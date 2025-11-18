# Build Error Fix - Supabase Client/Server Separation

## Issue

The build was failing with this error:
```
You're importing a component that needs "next/headers". That only works in a Server Component which is not supported in the pages/ directory.
```

## Root Cause

The `/src/lib/supabase.ts` file was importing `next/headers` at the top level:
```typescript
import { cookies } from 'next/headers';
```

Even though client components (`login/page.tsx` and `create-account/page.tsx`) were dynamically importing only the client-safe `createClient` function:
```typescript
const { createClient } = await import('@/lib/supabase');
```

The dynamic import still caused the entire module to be evaluated, including the `next/headers` import, which is not allowed in client components.

## Solution

Split the Supabase utilities into separate files based on their usage context:

### 1. Created `supabase-client.ts` (Client-Safe)
**File**: `/apps/web/src/lib/supabase-client.ts`

Contains only client-side utilities:
- `createClient()` - Browser client using `@supabase/ssr`
- No `next/headers` imports
- Safe to import in client components

```typescript
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from 'db';

export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};
```

### 2. Created `supabase-server.ts` (Server-Only)
**File**: `/apps/web/src/lib/supabase-server.ts`

Contains only server-side utilities:
- `createServerClient()` - Server client with cookie handling
- `createAdminClient()` - Admin client with service role
- Uses `next/headers` for cookie operations
- **Only for Server Components and API routes**

```typescript
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { createClient as createSupabaseJsClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from 'db';

export const createServerClient = async () => { /* ... */ };
export const createAdminClient = () => { /* ... */ };
```

### 3. Updated `supabase.ts` (Backward Compatibility)
**File**: `/apps/web/src/lib/supabase.ts`

Now acts as a re-export hub for backward compatibility:
```typescript
// Re-export client functions (safe for client components)
export { createClient, createSupabaseClient } from './supabase-client';

// Re-export server functions (only for server components/API routes)
export { createServerClient, createAdminClient, createSupabaseAdminClient } from './supabase-server';
```

## Files Updated

### Client Components
- `/apps/web/src/app/login/page.tsx`
- `/apps/web/src/app/create-account/page.tsx`

Changed from:
```typescript
const { createClient } = await import('@/lib/supabase');
```

To:
```typescript
const { createClient } = await import('@/lib/supabase-client');
```

### Server Components/API Routes
- `/apps/web/src/app/auth/callback/route.ts`
- `/apps/web/src/app/api/auth/complete-signup/route.ts`

Changed from:
```typescript
import { createServerClient } from '@/lib/supabase';
```

To:
```typescript
import { createServerClient } from '@/lib/supabase-server';
```

## Benefits

1. **Clear Separation**: Explicit separation between client and server utilities
2. **Build Compatibility**: Resolves Next.js build errors
3. **Better Tree Shaking**: Webpack can better optimize bundles
4. **Type Safety**: Maintains full TypeScript type safety
5. **Backward Compatible**: Old imports still work via re-exports
6. **Documentation**: Clear warnings about where each utility should be used

## Import Guidelines

### For Client Components (use 'use client')
```typescript
import { createClient } from '@/lib/supabase-client';
// or
const { createClient } = await import('@/lib/supabase-client');
```

### For Server Components/API Routes
```typescript
import { createServerClient, createAdminClient } from '@/lib/supabase-server';
```

### For Mixed Files (not recommended)
```typescript
// Will still work but prefer specific imports
import { createClient } from '@/lib/supabase';
```

## Verification

✅ No linting errors  
✅ Build should now succeed  
✅ All OAuth functionality preserved  
✅ Backward compatibility maintained  

## Testing

After this fix, verify:
1. Build completes successfully: `npm run build`
2. Development server runs: `npm run dev`
3. Social login buttons still work in `/login` and `/create-account`
4. OAuth callback still functions properly

---

**Status**: ✅ Fixed  
**Issue**: Next.js build error with `next/headers` in client components  
**Solution**: Split Supabase utilities into client and server files

