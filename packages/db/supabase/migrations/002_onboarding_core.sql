-- Migration: Onboarding core data model
-- Purpose: Provide structured data for the onboarding wizard

BEGIN;

-- ============================================================================
-- Onboarding progress tracking
-- ============================================================================
CREATE TABLE onboarding_progress (
  org_id uuid PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  current_step text NOT NULL DEFAULT 'business',
  completed_steps text[] NOT NULL DEFAULT ARRAY[]::text[],
  checklist jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_complete boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  last_viewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (char_length(current_step) > 0)
);

COMMENT ON TABLE onboarding_progress IS 'Tracks wizard state per organization';
COMMENT ON COLUMN onboarding_progress.checklist IS 'Key-value storage for lightweight task completion flags';

CREATE TRIGGER update_onboarding_progress_updated_at BEFORE UPDATE ON onboarding_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Services & pricing catalog
-- ============================================================================
CREATE TABLE service_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  sort_order smallint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE service_categories
  ADD CONSTRAINT service_categories_id_org_unique UNIQUE (id, org_id);

CREATE UNIQUE INDEX service_categories_org_name_idx
  ON service_categories (org_id, lower(name));

COMMENT ON TABLE service_categories IS 'High-level grouping for services';

CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  category_id uuid,
  name text NOT NULL,
  description text,
  duration_min integer NOT NULL CHECK (duration_min > 0),
  price numeric(10,2) NOT NULL DEFAULT 0,
  buffer_before_min integer NOT NULL DEFAULT 0 CHECK (buffer_before_min >= 0),
  buffer_after_min integer NOT NULL DEFAULT 0 CHECK (buffer_after_min >= 0),
  online_bookable boolean NOT NULL DEFAULT true,
  max_concurrent smallint NOT NULL DEFAULT 1 CHECK (max_concurrent > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE services
  ADD CONSTRAINT services_id_org_unique UNIQUE (id, org_id);

ALTER TABLE services
  ADD CONSTRAINT services_category_fk
  FOREIGN KEY (category_id, org_id) REFERENCES service_categories(id, org_id);

CREATE INDEX services_org_name_idx ON services (org_id, lower(name));

COMMENT ON TABLE services IS 'Bookable offerings configured during onboarding';

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE service_variants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  service_id uuid NOT NULL,
  name text NOT NULL,
  duration_delta_min integer NOT NULL DEFAULT 0,
  price_delta numeric(10,2),
  sort_order smallint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE service_variants
  ADD CONSTRAINT service_variants_id_org_unique UNIQUE (id, org_id);

ALTER TABLE service_variants
  ADD CONSTRAINT service_variants_service_fk
  FOREIGN KEY (service_id, org_id) REFERENCES services(id, org_id) ON DELETE CASCADE;

COMMENT ON TABLE service_variants IS 'Per-service add-ons or versions with duration/price deltas';

CREATE TABLE seniority_titles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  sort_order smallint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE seniority_titles
  ADD CONSTRAINT seniority_titles_id_org_unique UNIQUE (id, org_id);

CREATE UNIQUE INDEX seniority_titles_org_name_idx
  ON seniority_titles (org_id, lower(name));

COMMENT ON TABLE seniority_titles IS 'Custom seniority levels used for tiered pricing';

CREATE TABLE tiered_prices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  service_id uuid NOT NULL,
  seniority_title_id uuid,
  price numeric(10,2),
  percent_override numeric(5,2),
  absolute_override numeric(10,2),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (
    price IS NOT NULL OR percent_override IS NOT NULL OR absolute_override IS NOT NULL
  )
);

ALTER TABLE tiered_prices
  ADD CONSTRAINT tiered_prices_id_org_unique UNIQUE (id, org_id);

ALTER TABLE tiered_prices
  ADD CONSTRAINT tiered_prices_service_fk
  FOREIGN KEY (service_id, org_id) REFERENCES services(id, org_id) ON DELETE CASCADE;

ALTER TABLE tiered_prices
  ADD CONSTRAINT tiered_prices_seniority_fk
  FOREIGN KEY (seniority_title_id, org_id) REFERENCES seniority_titles(id, org_id) ON DELETE CASCADE;

CREATE UNIQUE INDEX tiered_prices_unique_combo_idx
  ON tiered_prices (org_id, service_id, seniority_title_id);

CREATE UNIQUE INDEX tiered_prices_default_unique_idx
  ON tiered_prices (org_id, service_id)
  WHERE seniority_title_id IS NULL;

COMMENT ON TABLE tiered_prices IS 'Pricing overrides per seniority tier or default service pricing model';

-- ============================================================================
-- Staff directory & availability
-- ============================================================================
CREATE TABLE staff_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text,
  phone text,
  bio text,
  color text,
  seniority_title_id uuid,
  max_concurrent smallint NOT NULL DEFAULT 1 CHECK (max_concurrent > 0),
  show_client_details boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE staff_profiles
  ADD CONSTRAINT staff_profiles_id_org_unique UNIQUE (id, org_id);

ALTER TABLE staff_profiles
  ADD CONSTRAINT staff_profiles_seniority_fk
  FOREIGN KEY (seniority_title_id, org_id) REFERENCES seniority_titles(id, org_id);

CREATE UNIQUE INDEX staff_profiles_org_user_idx
  ON staff_profiles (org_id, user_id)
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX staff_profiles_org_email_idx
  ON staff_profiles (org_id, lower(email))
  WHERE email IS NOT NULL;

COMMENT ON TABLE staff_profiles IS 'Internal staff roster with optional auth linkage';

CREATE TRIGGER update_staff_profiles_updated_at BEFORE UPDATE ON staff_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE staff_services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL,
  service_id uuid NOT NULL,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE staff_services
  ADD CONSTRAINT staff_services_unique_assignment UNIQUE (org_id, staff_id, service_id);

ALTER TABLE staff_services
  ADD CONSTRAINT staff_services_staff_fk
  FOREIGN KEY (staff_id, org_id) REFERENCES staff_profiles(id, org_id) ON DELETE CASCADE;

ALTER TABLE staff_services
  ADD CONSTRAINT staff_services_service_fk
  FOREIGN KEY (service_id, org_id) REFERENCES services(id, org_id) ON DELETE CASCADE;

COMMENT ON TABLE staff_services IS 'Mapping of which services each staff member can perform';

CREATE TABLE staff_service_overrides (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL,
  service_id uuid NOT NULL,
  price numeric(10,2),
  duration_min integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (price IS NOT NULL OR duration_min IS NOT NULL),
  CHECK (duration_min IS NULL OR duration_min > 0)
);

ALTER TABLE staff_service_overrides
  ADD CONSTRAINT staff_service_overrides_unique_assignment UNIQUE (org_id, staff_id, service_id);

ALTER TABLE staff_service_overrides
  ADD CONSTRAINT staff_service_overrides_staff_fk
  FOREIGN KEY (staff_id, org_id) REFERENCES staff_profiles(id, org_id) ON DELETE CASCADE;

ALTER TABLE staff_service_overrides
  ADD CONSTRAINT staff_service_overrides_service_fk
  FOREIGN KEY (service_id, org_id) REFERENCES services(id, org_id) ON DELETE CASCADE;

COMMENT ON TABLE staff_service_overrides IS 'Per-staff adjustments to duration or pricing';

CREATE TABLE working_hours (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL,
  weekday smallint NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_closed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (is_closed OR start_time < end_time)
);

ALTER TABLE working_hours
  ADD CONSTRAINT working_hours_staff_fk
  FOREIGN KEY (staff_id, org_id) REFERENCES staff_profiles(id, org_id) ON DELETE CASCADE;

CREATE UNIQUE INDEX working_hours_unique_day_idx
  ON working_hours (org_id, staff_id, weekday);

COMMENT ON TABLE working_hours IS 'Weekly recurring schedule per staff member';

CREATE TABLE time_off (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (start_at < end_at)
);

ALTER TABLE time_off
  ADD CONSTRAINT time_off_staff_fk
  FOREIGN KEY (staff_id, org_id) REFERENCES staff_profiles(id, org_id) ON DELETE CASCADE;

CREATE INDEX time_off_staff_range_idx
  ON time_off (staff_id, start_at, end_at);

COMMENT ON TABLE time_off IS 'Ad-hoc unavailability blocks captured during onboarding';

-- ============================================================================
-- RLS policies
-- ============================================================================
DO $$
DECLARE 
  table_name text;
BEGIN
  FOR table_name IN
    SELECT unnest(ARRAY[
      'onboarding_progress',
      'service_categories',
      'services',
      'service_variants',
      'seniority_titles',
      'tiered_prices',
      'staff_profiles',
      'staff_services',
      'staff_service_overrides',
      'working_hours',
      'time_off'
    ])
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', table_name);

    EXECUTE format(
      'CREATE POLICY %I ON %I USING (org_id = public.get_org_id()) WITH CHECK (org_id = public.get_org_id());',
      table_name || '_org_access',
      table_name
    );

    EXECUTE format(
      'CREATE POLICY %I ON %I FOR ALL USING ((current_setting(''request.jwt.claims'', true)::json->>''role'') = ''service_role'') WITH CHECK ((current_setting(''request.jwt.claims'', true)::json->>''role'') = ''service_role'');',
      table_name || '_service_role',
      table_name
    );
  END LOOP;
END $$;

COMMIT;


