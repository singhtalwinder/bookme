# BookMe Platform

A comprehensive multi-tenant SaaS booking platform built for Hong Kong businesses, featuring OTP authentication, calendar management, online booking, external calendar synchronization, CRM, dashboards, and PDPO compliance.

## 🚀 Features

- **Multi-tenant Architecture**: Each business has isolated data with Row-Level Security (RLS)
- **OTP Authentication**: Secure email-based one-time password authentication
- **Calendar Management**: Advanced availability engine with drag-and-drop scheduling
- **Online Booking**: Public booking pages with guest checkout
- **2-Way Calendar Sync**: Google Calendar and Microsoft Outlook integration
- **CRM**: Client profiles with appointment history and notes
- **Dashboard & Reports**: Real-time metrics and CSV exports
- **PDPO Compliance**: Data access, correction, export, and deletion tools
- **Search**: Global search with keyboard shortcuts (Cmd/Ctrl+K)
- **Notifications**: In-app and email notifications for all events

## 🏗️ Architecture

This is a monorepo built with:

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Package Manager**: pnpm workspaces
- **Deployment**: Vercel (frontend) + Supabase (backend)

### Workspace Structure

```
bookme/
├── apps/
│   └── web/              # Next.js application
├── packages/
│   ├── ui/               # Shared UI components
│   ├── db/               # Database migrations and types
│   └── functions/        # Supabase Edge Functions
└── docs/                 # Documentation
```

## 📋 Prerequisites

- Node.js 18+ 
- pnpm 8+
- Supabase CLI
- PostgreSQL (via Supabase local development)

## 🛠️ Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env.local` in `apps/web/`:

```bash
cp .env.example apps/web/.env.local
```

Update with your Supabase project credentials.

### 3. Start Supabase Local Development

```bash
cd packages/db
supabase start
```

This will start a local Supabase instance and output your local credentials.

### 4. Apply Database Migrations

```bash
pnpm --filter db migrate
```

### 5. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## 📦 Available Scripts

### Root Level

- `pnpm dev` - Start web app development server
- `pnpm dev:all` - Start all workspace packages in parallel
- `pnpm build` - Build production bundle
- `pnpm lint` - Run ESLint on all packages
- `pnpm type-check` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier
- `pnpm test` - Run tests across all packages

### Package-Specific

```bash
# Database operations
pnpm --filter db migrate      # Apply migrations
pnpm --filter db reset        # Reset database
pnpm --filter db generate     # Generate TypeScript types

# Web app
pnpm --filter web dev         # Start dev server
pnpm --filter web build       # Build for production
```

## 🗄️ Database Schema

The database is organized with the following key tables:

- **Core**: `organizations`, `users`, `memberships`
- **Services**: `service_categories`, `services`, `service_variants`, `tiered_prices`
- **Team**: `staff_profiles`, `staff_services`, `working_hours`, `time_off`
- **Appointments**: `appointments`, `clients`, `appointment_status_events`
- **Integrations**: `integration_accounts`, `external_calendar_links`
- **Notifications**: `notifications`, `notification_preferences`, `email_events`
- **Exports**: `exports`

All tables enforce RLS using the `auth.org_id()` helper function.

## 🔐 Security

- **Row-Level Security (RLS)**: All queries automatically filtered by `org_id`
- **JWT-based Auth**: Supabase Auth with secure token management
- **PDPO Compliance**: Built-in data privacy tools
- **Encrypted Tokens**: OAuth tokens encrypted before storage

## 🧪 Testing

Testing strategy (to be implemented in M6):

- **Unit Tests**: Vitest for business logic
- **Integration Tests**: Database operations and RLS policies
- **E2E Tests**: Playwright for critical user flows
- **Performance Tests**: Load testing for calendar and availability

## 📚 Development Phases

- [x] **Phase 1**: Project foundation and scaffolding ✅
- [ ] **Phase 2 (M0)**: Auth + Organizations + RLS
- [ ] **Phase 3 (M1)**: Onboarding + Services + Team
- [ ] **Phase 4 (M2)**: Calendar + Appointments
- [ ] **Phase 5 (M2.5)**: Global Search
- [ ] **Phase 6 (M3)**: Online Booking
- [ ] **Phase 7 (M3.5)**: Notifications
- [ ] **Phase 8 (M4)**: 2-Way Calendar Sync
- [ ] **Phase 9 (M5)**: Dashboard + Reports
- [ ] **Phase 10 (M6)**: PDPO + Polish

See `bookme-full-implementation.plan.md` for detailed implementation plan.

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run `pnpm lint` and `pnpm type-check`
4. Commit with descriptive message
5. Create pull request

## 📄 License

Proprietary - BookMe Platform

## 🆘 Support

For issues and questions, please refer to the project documentation or contact the development team.

---

**Built with ❤️ for Hong Kong businesses**

