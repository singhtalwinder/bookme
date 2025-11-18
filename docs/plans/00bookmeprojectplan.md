BookMe – Project Plan (v0.3)
Author: You
Region: Hong Kong
Standards: PDPO-aligned
Stack: Next.js + React, Supabase (Auth/DB/Storage/RLS), Edge Functions, shadcn/ui with Marshmallow theme

Executive Summary
Build a multi-tenant booking platform for service businesses in Hong Kong with:

OTP at every login
Single-business membership per user
Full business calendar and staff self-view
Online booking with guest or optional account, card-on-file placeholder (no payments)
Custom seniority titles for tiered pricing + service variants
2-way Google/Microsoft calendar sync (auto-update with notifications)
PDPO-aligned CRM
Notification layer (in-app + email) and global search
CSV reports with role-based export permissions
Success Metrics
Time-to-first-booking ≤ 60 minutes post-signup
≥ 50% bookings via online booking in month 1
No-show rate reduction ≥ 20% (with reminders)
Calendar median load ≤ 1.5s for up to 20 visible staff (scale to 100 staff)
≥ 95% successful 2-way sync events within 5 minutes
Global search response < 300ms for top 10 results
Core Views
Full Business Calendar (multi-staff)
Staff View (self calendar + personal settings)
Client-facing Booking Pages
Progressive Milestones and Priorities
Each milestone is shippable and builds on the previous. Include acceptance criteria (AC) and technical notes (TN).

M0 – Foundations (Auth + Org + RLS)
OTP at every login
Single-business per user enforced
Basic project scaffolding, CI, linting, env/config
AC:

Users can sign up, receive OTP, and log in with OTP each session
A user cannot join/create more than one business
RLS in place: users only read/write within their business
TN:

Supabase Auth OTP policy; JWT includes org_id
DB constraints: unique membership per user
Next.js middleware to gate routes by session/org
M1 – Onboarding + Core Data
Onboarding wizard (business, services, staff, booking URL)
Services with categories, variants, buffers, base price
Custom seniority titles and tiered pricing matrix
Team setup (roles, hours, time off)
AC:

New business completes wizard and can create first service, staff, and booking URL
Tiered pricing resolved by seniority or staff override
Staff working hours define availability
TN:

DDL for services, variants, seniority_titles, tiered_prices, staff overrides
Seed sample data option
M2 – Calendar (Internal)
Full business calendar (day/week), staff columns with virtualization
Staff self-view with quick settings
Booking create/edit/reschedule, conflict checks
Status lifecycle: pending → confirmed → arrived → started → completed → no_show → canceled
AC:

Create appointment from calendar; drag/drop to reschedule; status updates recorded
Performance: median load ≤ 1.5s with 20 visible columns
TN:

Indexed queries by org_id, staff_id, start_at
Appointment_status_events audit
M2.5 – Global Search (Baseline)
Global Cmd/Ctrl+K search for clients, services, staff
Calendar highlight search for client name/phone/email
AC:

Typing a client name shows relevant entities
Calendar highlights matching appointments in visible range
TN:

Trigram GIN indexes for fuzzy search
M3 – Online Booking (Public)
Guest and optional account booking
Availability search (Any staff or specific)
Card-on-file placeholder (token ref only, no charges)
Self-reschedule/cancel within policy; default 24h, configurable
AC:

Client can discover timeslot, confirm booking, and receive confirmation email
Policy respected for reschedule/cancel windows
TN:

Secure public links; .ics attachments
M3.5 – Notifications
In-app notification center + email delivery
Events: appointment create/update/cancel, client self-actions, status changes, exports ready, sync failures
External auto-update notifications with before/after times
AC:

Staff/admin see notifications; email toggles honored
External calendar change triggers auto-update + notification
TN:

Queue via edge functions; email_events logged; dedupe window
M4 – 2-Way Calendar Sync
Google/Microsoft connect, per-staff
Auto-apply external time changes; on external delete → cancel + notify
Read busy; write appointments; delta tokens + backoff
AC:

≥ 95% sync success within 5 minutes SLA
Edits propagate both directions for time changes
TN:

Idempotency keys; poisoned message handling
M5 – Dashboard + Reports
Dashboard metrics (value by status, utilization, new/returning)
CSV exports: Appointments, Clients, Utilization, Commissions
Export RBAC: admin-only by default; can delegate
AC:

Charts render with shadcn/ui charts (Marshmallow themed)
Exports generate asynchronously and email download link
TN:

Metrics derived from price_snapshot and status events
M6 – PDPO Tooling + Polish
Data access/correction and export/delete tools
A11y passes for keyboard navigation and ARIA
Perf and QA hardening
AC:

PDPO requests executable from Settings
Load tests for 100-staff orgs pass
Open Items (Locked-in decisions)
Notifications: included and mandatory for key events (done)
Default notification roles: staff get events affecting them; admin/reception get all booking events (agreed)
Max number of seniority titles: 10 (agreed)
Directory Suggestions
apps/web (Next.js)
packages/ui (shadcn/ui components with Marshmallow theme)
packages/db (SQL, types, migrations)
packages/functions (edge functions: sync, emails, exports)
docs (this folder)
