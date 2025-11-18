# Setup Guide

Complete guide to setting up the BookMe platform for development.

## Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify: `node --version`

2. **pnpm** (v8 or higher)
   ```bash
   npm install -g pnpm
   ```
   - Verify: `pnpm --version`

3. **Supabase CLI**
   ```bash
   npm install -g supabase
   ```
   - Verify: `supabase --version`

4. **Git**
   - Verify: `git --version`

### Optional Tools

- **Docker Desktop** - For local Supabase (recommended)
- **VS Code** - Recommended editor with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

## Initial Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd Bookme
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install dependencies for all workspaces (web, ui, db, functions).

### 3. Environment Configuration

#### Create Local Environment File

```bash
cp .env.example apps/web/.env.local
```

#### Update Environment Variables

Edit `apps/web/.env.local`:

```env
# For local development with Supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from-supabase-start>
SUPABASE_SERVICE_ROLE_KEY=<from-supabase-start>

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BOOKING_BASE_URL=http://localhost:3000/book
NODE_ENV=development
```

### 4. Start Local Supabase

```bash
cd packages/db
supabase start
```

**Important**: Save the output! It contains:
- API URL
- anon key
- service_role key
- Studio URL (http://localhost:54323)

Copy the `anon key` and `service_role key` to your `.env.local`.

### 5. Apply Database Migrations

```bash
pnpm --filter db migrate
```

This applies all migrations from `packages/db/supabase/migrations/`.

### 6. Generate Database Types (Optional)

```bash
pnpm --filter db generate
```

This creates TypeScript types from your database schema.

### 7. Start Development Server

```bash
pnpm dev
```

The app will be available at:
- Web: http://localhost:3000
- Supabase Studio: http://localhost:54323

## Verification

### Check Installation

1. **Visit the app**: http://localhost:3000
   - You should see the BookMe welcome page

2. **Check Supabase Studio**: http://localhost:54323
   - Navigate to Table Editor
   - Verify migrations have been applied

3. **Run type checking**:
   ```bash
   pnpm type-check
   ```

4. **Run linting**:
   ```bash
   pnpm lint
   ```

## Development Workflow

### Starting Development

```bash
# Terminal 1: Start Supabase (if not already running)
cd packages/db
supabase start

# Terminal 2: Start Next.js
cd ../..
pnpm dev
```

### Making Database Changes

1. Create a new migration:
   ```bash
   cd packages/db
   supabase migration new <migration_name>
   ```

2. Edit the migration file in `supabase/migrations/`

3. Apply the migration:
   ```bash
   pnpm migrate
   ```

4. Generate new types:
   ```bash
   pnpm generate
   ```

### Stopping Development

```bash
# Stop Supabase
cd packages/db
supabase stop
```

## Production Setup

### Supabase Cloud

1. Create a project at [supabase.com](https://supabase.com)
2. Link your local project:
   ```bash
   supabase link --project-ref <project-id>
   ```
3. Push migrations:
   ```bash
   supabase db push
   ```

### Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy from `apps/web/`:
   ```bash
   cd apps/web
   vercel
   ```

3. Set environment variables in Vercel Dashboard

## Troubleshooting

### Port Already in Use

If ports 54321-54326 are in use:
```bash
supabase stop
supabase start
```

### Dependencies Issues

Clear and reinstall:
```bash
pnpm clean
pnpm install
```

### Database Connection Issues

Reset database:
```bash
cd packages/db
supabase db reset
```

### Type Errors

Regenerate types:
```bash
pnpm --filter db generate
pnpm type-check
```

## Next Steps

- Review the [Implementation Plan](../bookme-full-implementation.plan.md)
- Check the [API Documentation](./API.md) (to be created)
- Read about [Database Schema](./DATABASE.md) (to be created)

## Getting Help

- Check documentation in `docs/`
- Review project plan in root directory
- Consult Supabase docs: https://supabase.com/docs
- Next.js docs: https://nextjs.org/docs

