# Quick Start Guide

Get the BookMe platform running in 5 minutes.

## Prerequisites

- Node.js 18+
- pnpm 8+

## Setup Steps

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Install Supabase CLI

```bash
npm install -g supabase
```

### 3. Start Supabase

```bash
cd packages/db
supabase start
```

**Save the output!** You'll need the API keys.

### 4. Configure Environment

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key-from-supabase-start>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key-from-supabase-start>
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 5. Apply Migrations

```bash
pnpm --filter db migrate
```

### 6. Start Development Server

```bash
# From project root
pnpm dev
```

## Access Points

- **Web App**: http://localhost:3000
- **Supabase Studio**: http://localhost:54323
- **API**: http://localhost:3000/api

## Useful Commands

```bash
# Development
pnpm dev                    # Start web app
pnpm dev:all               # Start all packages

# Database
pnpm --filter db migrate   # Apply migrations
pnpm --filter db reset     # Reset database
pnpm --filter db generate  # Generate types

# Code Quality
pnpm lint                  # Run ESLint
pnpm type-check           # TypeScript check
pnpm format               # Format with Prettier

# Testing (Phase 6)
pnpm test                 # Run tests

# Cleanup
pnpm clean                # Clean build artifacts
```

## Stopping Services

```bash
# Stop Supabase
cd packages/db
supabase stop

# Stop Next.js
Ctrl+C in terminal
```

## Troubleshooting

### Port conflicts
```bash
supabase stop
supabase start
```

### Module not found
```bash
pnpm install
```

### Type errors
```bash
pnpm --filter db generate
```

### Database issues
```bash
cd packages/db
supabase db reset
```

## Next Phase

Once everything is running, proceed to Phase 2 (M0) to implement:
- Authentication with OTP
- Organizations and memberships
- RLS policies
- Auth UI pages

See `bookme-full-implementation.plan.md` for details.

## Need Help?

- Check `docs/SETUP.md` for detailed instructions
- Review `docs/ARCHITECTURE.md` for system design
- Read `README.md` for project overview

