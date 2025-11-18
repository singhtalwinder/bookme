/**
 * DEPRECATED: This file is kept for backward compatibility.
 * 
 * For CLIENT components, import from './supabase-client'
 * For SERVER components and API routes, import from './supabase-server'
 * 
 * This ensures proper code splitting and prevents 'next/headers' errors in client components.
 */

// Re-export client functions (safe for client components)
export { createClient, createSupabaseClient } from './supabase-client';

// Re-export server functions (only for server components/API routes)
export { createServerClient, createAdminClient, createSupabaseAdminClient } from './supabase-server';

