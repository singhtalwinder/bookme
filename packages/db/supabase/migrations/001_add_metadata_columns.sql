-- Migration: Add metadata columns to users and organizations
-- This allows storing additional structured data without schema changes

-- Add metadata column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Add metadata column to organizations table  
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Create indexes for better JSON query performance
CREATE INDEX IF NOT EXISTS idx_users_metadata ON users USING gin(metadata);
CREATE INDEX IF NOT EXISTS idx_organizations_metadata ON organizations USING gin(metadata);

-- Add comments for documentation
COMMENT ON COLUMN users.metadata IS 'Flexible JSON storage for user-related data (e.g., phone, firstName, lastName)';
COMMENT ON COLUMN organizations.metadata IS 'Flexible JSON storage for org-related data (e.g., onboarding info, settings)';

