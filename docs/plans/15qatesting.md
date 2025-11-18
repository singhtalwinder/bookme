QA & Testing
Unit
Availability calculation (hours, time off, buffers, external busy, max_concurrent)
Tiered pricing resolution (seniority titles, overrides)
Status transitions and value calculations
Commission computation
Notification preference resolution and dedupe
Integration
RLS per role across key tables
Sync idempotency and delta token handling
External auto-update → appointment update → notifications emitted
Exports permissions and delivery
PDPO data export/delete flows
E2E (Playwright)
Signup + OTP; onboarding to first booking
Calendar create/reschedule; status lifecycle
Online booking guest + optional account; self-reschedule/cancel (24h default)
Notifications center and email receipts
2-way sync create/update/delete
Load/Perf
Calendar rendering with 20 visible staff columns
Org with 100 staff; slot search < 300ms; global search < 300ms
Accessibility
Keyboard navigation for calendar interactions
ARIA roles/labels on booking forms and dialogs