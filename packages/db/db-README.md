# Database Package

This package contains all database-related code for the BookMe platform, including:

- Supabase migrations
- Database type definitions
- Query utilities
- RLS helper functions

## Setup

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Initialize local Supabase:
```bash
supabase init
supabase start
```

3. Apply migrations:
```bash
pnpm migrate
```

## Migrations

All migrations are stored in `supabase/migrations/`. To create a new migration:

```bash
supabase migration new <migration_name>
```

## Type Generation

After applying migrations, generate TypeScript types:

```bash
pnpm generate
```

This will update `src/types/database.types.ts` with the latest schema.

## RLS Helper

The `auth.org_id()` function extracts the organization ID from the JWT claims. This is used throughout the application to enforce row-level security:

```sql
CREATE POLICY "Users can only see their org data"
  ON some_table
  FOR SELECT
  USING (org_id = auth.org_id());
```

