Data Model (DDL Outline)
Note: Use Supabase migrations; apply RLS per org.

Core
organizations(id, name, handle unique, timezone, address, phone, brand_color, logo_url, currency default ‘HKD’, created_at)
users(id, email unique, name, avatar_url, created_at)
memberships(id, user_id unique, org_id, role enum(owner,admin,staff,receptionist,viewer), created_at)
Staff & Scheduling
staff_profiles(id, org_id, user_id nullable, name, email, phone, bio, color, seniority_title_id nullable, max_concurrent int default 1, show_client_details boolean default true, created_at)
working_hours(id, staff_id, weekday int, start_time, end_time, is_closed boolean)
time_off(id, staff_id, start_at timestamptz, end_at timestamptz, reason)
Services & Pricing
service_categories(id, org_id, name, sort_order)
services(id, org_id, category_id, name, description, duration_min, price numeric, online_bookable boolean, buffer_before_min, buffer_after_min, max_concurrent int default 1, created_at)
service_variants(id, org_id, service_id, name, duration_delta_min, price_delta numeric, sort_order)
seniority_titles(id, org_id, name, sort_order) // max 10 per org (enforce in app; optional db constraint)
tiered_prices(id, org_id, service_id, seniority_title_id nullable, percent_override numeric nullable, absolute_override numeric nullable, price numeric nullable)
staff_service_overrides(id, org_id, staff_id, service_id, price numeric nullable, duration_min nullable)
staff_services(staff_id, service_id)
Clients & Appointments
clients(id, org_id, name, email, phone, notes_short, marketing_opt_in boolean, blocked boolean, created_at)
client_notes(id, client_id, author_user_id, body, created_at)
client_files(id, client_id, url, mime_type, created_at)
appointments(id, org_id, client_id, staff_id, service_id, variant_id nullable, start_at, end_at, status enum(pending,confirmed,arrived,started,completed,canceled,no_show), price_snapshot numeric, tip_snapshot numeric nullable, notes, source enum(admin,online), external_event_id nullable, external_provider enum(google,microsoft) nullable, external_last_change_at timestamptz nullable, created_at)
appointment_status_events(id, appointment_id, from_status, to_status, changed_by_user_id nullable, changed_at)
Integrations & Notifications
integration_accounts(id, org_id, staff_id, provider enum(google,microsoft), access_token_encrypted, refresh_token_encrypted, expires_at, connected_email, sync_write_calendar_id, sync_read_calendar_ids text[], delta_token, last_sync_at)
external_calendar_links(id, appointment_id, provider, external_event_id, last_synced_at)
notifications(id, org_id, type, actor_user_id nullable, subject_type, subject_id, channel enum(in_app,email), payload jsonb, status enum(queued,sent,read,failed), created_at, read_at)
notification_preferences(id, org_id, user_id, type, in_app boolean, email boolean)
email_events(id, org_id, type, appointment_id nullable, client_id nullable, to_email, status, sent_at)
exports(id, org_id, type, filters_json, status enum(pending,processing,ready,failed), file_url, created_at)
permissions_overrides(id, org_id, user_id, can_export boolean, created_at)
RLS Highlights
All org tables: policy org_id = auth.jwt().org_id
memberships readable by self; admins can read team
clients/appointments: staff read within org; client details can be masked by staff_profiles.show_client_details
Indexes
appointments(org_id, staff_id, start_at)
clients(org_id, lower(name)), clients(email), clients(phone)
GIN trigram on clients(name, email, phone), services(name), staff_profiles(name)
appointment_status_events(appointment_id, changed_at)
integration_accounts(staff_id, provider)
exports(org_id, created_at)
