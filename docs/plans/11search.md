Search
Global Search (Cmd/Ctrl+K)
Entities: clients, appointments, services, staff
Query helpers: @staff, #service, !status
Top 10 results under 300ms
Scoped Search
Calendar: find by client name/phone/email, highlight matches in view
CRM: fuzzy search + tag filters
Services: name/category, online bookable filter
Appointments list: date, status, staff, service filters
Indexing
Trigram GIN indexes on clients(name, email, phone), services(name), staff_profiles(name)
Appointments searchable by client join and notes
Permissions
Results restricted by org via RLS
AC
Relevant ranking and instant navigation
