-- Initial migration: Setup extensions and RLS helper function
-- BookMe Platform - Phase 1 Foundation

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For search functionality

-- Create custom types
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'staff', 'receptionist', 'viewer');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'arrived', 'started', 'completed', 'no_show', 'canceled');
CREATE TYPE appointment_source AS ENUM ('online', 'staff', 'phone', 'walk_in', 'external');
CREATE TYPE integration_provider AS ENUM ('google', 'microsoft');
CREATE TYPE notification_type AS ENUM (
  'appointment.created',
  'appointment.updated', 
  'appointment.canceled',
  'appointment.status.arrived',
  'appointment.status.started',
  'appointment.status.completed',
  'appointment.status.no_show',
  'appointment.self_rescheduled',
  'appointment.self_canceled',
  'appointment.external_updated',
  'appointment.reminder.24h',
  'appointment.reminder.3h',
  'export.ready',
  'sync.failed'
);

-- RLS Helper Function: Extract org_id from JWT
-- This function is used by RLS policies to filter data by organization
CREATE OR REPLACE FUNCTION public.get_org_id() 
RETURNS uuid 
LANGUAGE sql 
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::json->>'org_id')::uuid,
    NULL
  );
$$;

COMMENT ON FUNCTION public.get_org_id() IS 'Extracts org_id from JWT claims for RLS policies';

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Organizations table
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  handle text UNIQUE NOT NULL,
  timezone text NOT NULL DEFAULT 'Asia/Hong_Kong',
  phone text,
  address text,
  brand_color text DEFAULT '#6366f1',
  logo_url text,
  currency text NOT NULL DEFAULT 'HKD',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE organizations IS 'Business organizations using the platform';
COMMENT ON COLUMN organizations.handle IS 'Unique URL-friendly identifier for public booking pages';
COMMENT ON COLUMN organizations.timezone IS 'IANA timezone identifier for scheduling';

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE users IS 'User profiles linked to Supabase auth';

-- Memberships table (enforces single-business rule)
CREATE TABLE memberships (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE memberships IS 'User organization memberships - UNIQUE constraint enforces single-business rule';
COMMENT ON COLUMN memberships.user_id IS 'UNIQUE constraint ensures one user can only belong to one organization';

-- Invites table for staff onboarding
CREATE TABLE invites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email text NOT NULL,
  role user_role NOT NULL,
  invited_by_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE invites IS 'Pending staff invitations';

-- Create indexes
CREATE INDEX idx_memberships_org_id ON memberships(org_id);
CREATE INDEX idx_memberships_user_id ON memberships(user_id);
CREATE INDEX idx_invites_org_id ON invites(org_id);
CREATE INDEX idx_invites_token ON invites(token);
CREATE INDEX idx_invites_email ON invites(email);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Users can read their own organization"
  ON organizations FOR SELECT
  USING (id = public.get_org_id());

CREATE POLICY "Users can update their own organization"
  ON organizations FOR UPDATE
  USING (id = public.get_org_id())
  WITH CHECK (id = public.get_org_id());

CREATE POLICY "Service role has full access to organizations"
  ON organizations FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- Users policies
CREATE POLICY "Users can read their own profile"
  ON users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can read other users in their org"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships m1
      JOIN memberships m2 ON m1.org_id = m2.org_id
      WHERE m1.user_id = auth.uid() AND m2.user_id = users.id
    )
  );

CREATE POLICY "Service role has full access to users"
  ON users FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- Memberships policies
CREATE POLICY "Users can read their own membership"
  ON memberships FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all memberships in their org"
  ON memberships FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE user_id = auth.uid() 
        AND org_id = memberships.org_id
        AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Service role has full access to memberships"
  ON memberships FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- Invites policies
CREATE POLICY "Admins can read invites in their org"
  ON invites FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE user_id = auth.uid() 
        AND org_id = invites.org_id
        AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can create invites in their org"
  ON invites FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE user_id = auth.uid() 
        AND org_id = invites.org_id
        AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Service role has full access to invites"
  ON invites FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memberships_updated_at BEFORE UPDATE ON memberships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

