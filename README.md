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

## 📊 Project Status

### ✅ M0 - Authentication & Accounts (COMPLETE)
**Completed:** November 16, 2025

- ✅ OTP authentication at every login
- ✅ Single-business membership enforcement
- ✅ Complete RLS (Row Level Security) policies
- ✅ User signup with business creation
- ✅ Staff invitation system
- ✅ Password reset flow
- ✅ Dashboard landing page
- ✅ Team management UI

**Documentation:** See [`docs/plans/M0_AUTH_COMPLETE.md`](docs/plans/M0_AUTH_COMPLETE.md) for details.

### 🔜 Upcoming Milestones

- **M1 - Onboarding**: Business wizard, services setup, staff configuration
- **M2 - Calendar**: Full business calendar, booking management, staff view
- **M3 - Online Booking**: Public booking pages with availability search
- **M4 - Calendar Sync**: Google/Microsoft 2-way synchronization
- **M5 - Dashboard & Reports**: Metrics and CSV exports
- **M6 - PDPO Tooling**: Data access and compliance features

See [`docs/plans/00bookmeprojectplan.md`](docs/plans/00bookmeprojectplan.md) for the complete roadmap.

## 🏗️ Architecture

This is a monorepo built with:

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS v4
- **UI Components**: shadcn/ui with Marshmallow theme (React Aria, accessibility-first)
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Package Manager**: pnpm workspaces
- **Deployment**: Vercel (frontend) + Supabase (backend)

### Workspace Structure

```
bookme/
├── apps/
│   └── web/                    # Next.js application
│       ├── src/
│       │   ├── app/            # Next.js pages and routes
│       │   ├── components/     # React components
│       │   │   ├── ui/         # shadcn/ui base components
│       │   │   └── examples/   # Component usage examples
│       │   └── lib/            # Utilities and services
│       ├── public/
│       │   ├── logos/          # Brand logos (SVG)
│       │   └── icons/          # Favicon and PWA icons
│       └── package.json
│
├── packages/
│   ├── ui/                     # Shared UI components (shadcn/ui based)
│   │   ├── src/components/
│   │   │   ├── base/           # Form inputs, buttons, etc.
│   │   │   ├── application/    # Complex UI patterns
│   │   │   └── foundations/    # Icons, logos, patterns
│   │   └── package.json
│   │
│   ├── db/                     # Database package
│   │   ├── supabase/
│   │   │   ├── migrations/     # SQL migration files
│   │   │   └── config.toml     # Supabase config
│   │   ├── src/                # Database utilities
│   │   └── package.json
│   │
│   └── functions/              # Supabase Edge Functions
│       ├── src/
│       └── package.json
│
├── docs/                       # Documentation
│   ├── plans/                  # All documentation and project plans
│   └── archive/                # Historical documentation
│
├── pnpm-workspace.yaml         # pnpm workspace config
├── package.json                # Root package.json
└── tsconfig.json               # TypeScript config
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

## 🎨 Branding & Assets

The BookMe logo is available in multiple sizes for various use cases. See [Logo Usage Guide](docs/LOGO_USAGE.md) for:
- How to use the Logo component in your code
- Available logo sizes and when to use them
- Brand guidelines and best practices
- PWA and favicon configuration

All logo assets are located in `apps/web/public/logos/` and `apps/web/public/icons/`.

## 📚 Development Phases

- [x] **Phase 1**: Project foundation and scaffolding ✅
- [x] **Phase 1.5**: shadcn/ui integration with Marshmallow theme ✅
- [x] **Phase 1.6**: Branding and logo assets ✅
- [ ] **Phase 2 (M0)**: Auth + Organizations + RLS
- [ ] **Phase 3 (M1)**: Onboarding + Services + Team
- [ ] **Phase 4 (M2)**: Calendar + Appointments
- [ ] **Phase 5 (M2.5)**: Global Search
- [ ] **Phase 6 (M3)**: Online Booking
- [ ] **Phase 7 (M3.5)**: Notifications
- [ ] **Phase 8 (M4)**: 2-Way Calendar Sync
- [ ] **Phase 9 (M5)**: Dashboard + Reports
- [ ] **Phase 10 (M6)**: PDPO + Polish

### 📖 Documentation

All documentation is now located in the [docs/plans/](docs/plans/) directory:

- **Quick Start**: [docs/plans/QUICKSTART.md](docs/plans/QUICKSTART.md)
- **Setup Guide**: [docs/plans/SETUP.md](docs/plans/SETUP.md)
- **Architecture**: [docs/plans/ARCHITECTURE.md](docs/plans/ARCHITECTURE.md)
- **Form Validation**: [docs/plans/FORM_VALIDATION.md](docs/plans/FORM_VALIDATION.md)
- **Logo & Branding**: [docs/plans/LOGO_USAGE.md](docs/plans/LOGO_USAGE.md)
- **Project Organization**: [docs/plans/PROJECT_ORGANIZATION.md](docs/plans/PROJECT_ORGANIZATION.md)
- **Theme Update**: [docs/plans/THEME_UPDATE.md](docs/plans/THEME_UPDATE.md)
- **Project Plans**: Numbered files (00-15) in [docs/plans/](docs/plans/)

**Package Documentation**:
- [packages/db/db-README.md](packages/db/db-README.md)
- [packages/functions/functions-README.md](packages/functions/functions-README.md)
- [packages/ui/ui-README.md](packages/ui/ui-README.md)

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

