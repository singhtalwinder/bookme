-- Migration: Add OAuth support
-- Purpose: Add fields to support Google and Facebook OAuth authentication

BEGIN;

-- ============================================================================
-- Update users table to support OAuth
-- ============================================================================

-- Add auth provider tracking
ALTER TABLE users
ADD COLUMN auth_provider text DEFAULT 'email' CHECK (auth_provider IN ('email', 'google', 'facebook'));

-- Add OAuth provider user ID
ALTER TABLE users
ADD COLUMN provider_user_id text;

-- Add index for faster OAuth user lookups
CREATE INDEX idx_users_provider_user_id ON users(provider_user_id) WHERE provider_user_id IS NOT NULL;

COMMENT ON COLUMN users.auth_provider IS 'Authentication method used: email, google, or facebook';
COMMENT ON COLUMN users.provider_user_id IS 'User ID from OAuth provider (sub claim)';

-- ============================================================================
-- Database trigger for auto-creating user profiles on OAuth signup
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_oauth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  provider text;
  provider_id text;
  user_name text;
  user_avatar text;
BEGIN
  -- Extract provider from raw_app_meta_data
  provider := COALESCE(NEW.raw_app_meta_data->>'provider', 'email');
  
  -- Only process OAuth providers
  IF provider IN ('google', 'facebook') THEN
    -- Extract provider user ID from raw_user_meta_data
    provider_id := NEW.raw_user_meta_data->>'sub';
    
    -- Extract name (try full_name first, then name)
    user_name := COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name'
    );
    
    -- Extract avatar URL
    user_avatar := COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    );
    
    -- Insert or update user profile
    INSERT INTO public.users (
      id,
      email,
      name,
      avatar_url,
      auth_provider,
      provider_user_id,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      NEW.email,
      user_name,
      user_avatar,
      provider,
      provider_id,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      name = COALESCE(EXCLUDED.name, public.users.name),
      avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
      auth_provider = EXCLUDED.auth_provider,
      provider_user_id = EXCLUDED.provider_user_id,
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users table (requires service role access)
-- This will automatically create a profile when an OAuth user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_oauth_user();

COMMENT ON FUNCTION public.handle_new_oauth_user() IS 'Automatically creates user profile for OAuth signups';

-- ============================================================================
-- Update existing email users
-- ============================================================================

-- Set auth_provider to 'email' for all existing users (if not already set)
UPDATE users
SET auth_provider = 'email'
WHERE auth_provider IS NULL;

COMMIT;

