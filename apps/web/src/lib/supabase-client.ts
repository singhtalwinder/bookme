import { createBrowserClient } from '@supabase/ssr';
import type { Database } from 'db';

/**
 * Client-side Supabase client for use in Client Components
 * This file is safe to import in client components
 */
export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Export for backward compatibility
export const createSupabaseClient = createClient;

