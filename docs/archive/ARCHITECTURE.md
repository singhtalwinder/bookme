# Architecture Overview

## System Architecture

BookMe is built as a modern, multi-tenant SaaS platform using a monorepo structure with clear separation of concerns.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Web App    │  │ Public Pages │  │   Mobile (Future)    │  │
│  │  (Next.js)   │  │   (Booking)  │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   API Routes      │
                    │   (Next.js API)   │
                    └─────────┬─────────┘
                              │
┌─────────────────────────────┴─────────────────────────────────┐
│                      Backend Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐│
│  │   Supabase   │  │ Edge         │  │  External APIs       ││
│  │   Auth       │  │ Functions    │  │  (Google, MS)        ││
│  │   Database   │  │ (Sync/Email) │  │                      ││
│  │   Storage    │  │              │  │                      ││
│  └──────────────┘  └──────────────┘  └──────────────────────┘│
└───────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library (packages/ui)
- **State Management**: React Hooks + Server Components

### Backend
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth (OTP + OAuth)
- **Storage**: Supabase Storage
- **Edge Functions**: Supabase Edge Functions (Deno)
- **Real-time**: Supabase Realtime (for notifications)

### Infrastructure
- **Hosting**: Vercel (frontend) + Supabase Cloud (backend)
- **CDN**: Vercel Edge Network
- **Email**: Resend or similar service
- **Monitoring**: (To be decided)

## Monorepo Structure

```
bookme/
├── apps/
│   └── web/                    # Next.js application
│       ├── src/
│       │   ├── app/           # App Router pages
│       │   ├── components/    # App-specific components
│       │   ├── lib/           # Utilities and helpers
│       │   └── middleware.ts  # Auth middleware
│       └── package.json
│
├── packages/
│   ├── ui/                    # Shared UI components
│   │   ├── src/
│   │   │   ├── components/   # Button, Input, Dialog, etc.
│   │   │   └── utils/        # cn() utility
│   │   └── package.json
│   │
│   ├── db/                    # Database package
│   │   ├── supabase/
│   │   │   ├── migrations/   # SQL migrations
│   │   │   └── config.toml   # Supabase config
│   │   ├── src/
│   │   │   ├── types/        # Database types
│   │   │   └── utils/        # Query helpers
│   │   └── package.json
│   │
│   └── functions/             # Edge functions
│       ├── src/
│       │   ├── notifications/ # Email sending
│       │   ├── sync/         # Calendar sync
│       │   └── exports/      # CSV generation
│       └── package.json
│
└── docs/                      # Documentation
```

## Multi-Tenancy Model

### Organization Isolation

Each business (organization) is completely isolated using Row-Level Security (RLS):

1. **JWT Claims**: `org_id` embedded in JWT token after authentication
2. **RLS Helper**: `auth.org_id()` function extracts org_id from JWT
3. **RLS Policies**: Every table has policies filtering by `org_id = auth.org_id()`

```sql
-- Example RLS Policy
CREATE POLICY "Users see only their org data"
  ON appointments
  FOR ALL
  USING (org_id = auth.org_id());
```

### One Business Per User

Users can only belong to ONE organization (enforced by UNIQUE constraint on `memberships.user_id`). This simplifies:
- Context switching (none needed)
- Data isolation
- Permission management

## Data Flow

### Authentication Flow

```
1. User enters email
2. Backend sends OTP via Supabase Auth
3. User enters OTP
4. Backend verifies OTP
5. JWT issued with org_id claim
6. Middleware validates JWT on all requests
7. org_id injected into request context
```

### Appointment Creation Flow

```
1. User creates appointment (web app or API)
2. API validates availability
3. API resolves price (service → staff → seniority)
4. API creates appointment with snapshot
5. API creates external calendar event (if integrated)
6. API emits notification events
7. Edge function sends emails
```

### Calendar Sync Flow

```
1. Cron triggers sync edge function (every 2-5 min)
2. Function fetches changes using delta tokens
3. Function processes updates:
   - New events → block availability
   - Time changes → update appointment + notify
   - Deletions → cancel appointment + notify
4. Function updates delta token
```

## Security Model

### Authentication
- OTP-based email auth (no passwords stored)
- JWT tokens with short expiry (1 hour)
- Refresh tokens for session management
- OAuth for calendar integrations (encrypted tokens)

### Authorization
- Role-based access control (owner, admin, staff, receptionist, viewer)
- RLS enforces org-level isolation
- Custom permissions for exports

### Data Protection
- All PII encrypted at rest (Supabase)
- OAuth tokens encrypted before storage
- Secure tokens for guest booking management
- PDPO compliance tools (access, export, delete)

## Performance Considerations

### Database
- Indexes on high-traffic queries (org_id, dates, foreign keys)
- Trigram indexes for search (pg_trgm)
- Connection pooling via Supabase

### Frontend
- Server components for initial render
- Client components only where needed
- Image optimization via Next.js
- Code splitting by route

### Calendar
- Virtualization for large staff lists
- Debounced conflict checks
- Cached working hours and time off

### Availability Engine
- Indexed date range queries
- Target: < 300ms response time
- Cached external busy times (short TTL)

## Scalability

### Current Scale
- Target: 100-500 organizations
- 20-100 staff per organization
- 1000+ appointments per day per org

### Future Scale
- Horizontal scaling via Supabase read replicas
- Edge functions auto-scale
- Vercel auto-scales frontend
- Database partitioning by org_id (if needed)

## Development Workflow

```
1. Feature branch from main
2. Develop locally with Supabase local
3. Write tests (unit, integration, e2e)
4. Create migration if schema changes
5. Run lint, type-check, tests
6. Create PR
7. Review + merge
8. Deploy to staging
9. Test on staging
10. Deploy to production
```

## Deployment Pipeline

### Staging
- Auto-deploy on merge to `develop`
- Supabase preview instance
- Vercel preview deployment
- Run E2E tests

### Production
- Manual trigger or merge to `main`
- Supabase production instance
- Vercel production deployment
- Smoke tests
- Rollback capability

## Monitoring & Observability

(To be implemented in M6)

- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- Database monitoring (Supabase Dashboard)
- Custom metrics (appointments, sync success rate)
- Alerting (failed syncs, auth errors)

## Future Considerations

### Phase 2+
- Mobile app (React Native)
- WhatsApp notifications
- SMS reminders
- Payment processing
- Advanced reporting (BI tools)
- Multi-language support
- API for third-party integrations
- Zapier/Make.com integrations

