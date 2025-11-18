/**
 * Utility functions for database operations
 */

/**
 * Helper to construct RLS-aware queries
 * Ensures org_id is always included in filters
 */
export function withOrgId<T extends Record<string, unknown>>(
  filters: T,
  orgId: string
): T & { org_id: string } {
  return {
    ...filters,
    org_id: orgId,
  };
}

/**
 * Parse Supabase error for user-friendly messages
 */
export function parseSupabaseError(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const err = error as { message?: string; code?: string };
    
    // Handle common Supabase error codes
    if (err.code === '23505') {
      return 'A record with this value already exists';
    }
    if (err.code === '23503') {
      return 'Cannot delete this record as it is referenced by other data';
    }
    if (err.message) {
      return err.message;
    }
  }
  
  return 'An unexpected error occurred';
}

/**
 * Generate a secure random token for appointment management
 */
export function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

