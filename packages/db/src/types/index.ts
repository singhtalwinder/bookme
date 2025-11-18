/**
 * Database types and enums
 */

// User roles in the system
export type UserRole = 'owner' | 'admin' | 'staff' | 'receptionist' | 'viewer';

// Appointment statuses
export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'arrived'
  | 'started'
  | 'completed'
  | 'no_show'
  | 'canceled';

// Appointment sources
export type AppointmentSource = 'online' | 'staff' | 'phone' | 'walk_in' | 'external';

// Integration providers
export type IntegrationProvider = 'google' | 'microsoft';

// Notification types
export type NotificationType =
  | 'appointment.created'
  | 'appointment.updated'
  | 'appointment.canceled'
  | 'appointment.status.arrived'
  | 'appointment.status.started'
  | 'appointment.status.completed'
  | 'appointment.status.no_show'
  | 'appointment.self_rescheduled'
  | 'appointment.self_canceled'
  | 'appointment.external_updated'
  | 'appointment.reminder.24h'
  | 'appointment.reminder.3h'
  | 'export.ready'
  | 'sync.failed';

// Common database table interfaces will be added as we create migrations
export interface BaseTable {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface OrgTable extends BaseTable {
  org_id: string;
}

// ============================================================================
// CORE TABLES - M0 Auth & Accounts
// ============================================================================

export interface Organization extends BaseTable {
  name: string;
  handle: string;
  timezone: string;
  phone: string | null;
  address: string | null;
  brand_color: string;
  logo_url: string | null;
  currency: string;
  metadata?: Record<string, any>;
}

export interface User extends BaseTable {
  id: string; // References auth.users(id)
  email: string;
  name: string | null;
  avatar_url: string | null;
  metadata?: Record<string, any>;
}

export interface Membership extends BaseTable {
  user_id: string;
  org_id: string;
  role: UserRole;
}

export interface Invite extends BaseTable {
  org_id: string;
  email: string;
  role: UserRole;
  invited_by_user_id: string;
  token: string;
  expires_at: string;
  accepted_at: string | null;
}

// ============================================================================
// AUTH & SESSION TYPES
// ============================================================================

export interface AuthSession {
  user_id: string;
  email: string;
  org_id?: string;
  role?: UserRole;
}

export interface JWTClaims {
  sub: string;
  email?: string;
  org_id?: string;
  role?: UserRole;
  aud?: string;
  exp?: number;
  iat?: number;
}

// ============================================================================
// SUPABASE DATABASE TYPE
// ============================================================================

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: Organization;
        Insert: Omit<Organization, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Organization>;
      };
      users: {
        Row: User;
        Insert: Omit<User, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<User>;
      };
      memberships: {
        Row: Membership;
        Insert: Omit<Membership, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Membership>;
      };
      invites: {
        Row: Invite;
        Insert: Omit<Invite, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Invite>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      user_role: UserRole;
      appointment_status: AppointmentStatus;
      appointment_source: AppointmentSource;
      integration_provider: IntegrationProvider;
      notification_type: NotificationType;
    };
  };
}


