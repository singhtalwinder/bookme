/**
 * Database package - Supabase client, types, and utilities
 * @packageDocumentation
 */

// Re-export Supabase client types
export type { SupabaseClient } from '@supabase/supabase-js';

// Export database types (will be generated after first migration)
export * from './types';

// Export utility functions
export * from './utils';

