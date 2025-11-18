Integrations: Google & Microsoft Calendars
Scope
Region: Hong Kong consent screens
Per-staff account connects
2-Way Sync
Read busy: blocks availability
Write appointments: create/update/delete mirrored
Auto-update time on external edits; on external delete → cancel + notify
Ignore external title/body changes
Engine
Delta tokens, polling 2–5 min, webhooks where available
Retry with exponential backoff; idempotent writes
Poisoned message quarantine
Mapping
appointment <-> external_event_id
Attendee: client email when available
AC
95%+ sync success within 5 minutes
External edits reflect internally and notify parties