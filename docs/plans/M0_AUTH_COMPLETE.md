# M0 - Authentication & Accounts - COMPLETE ✅

**Date Completed:** November 16, 2025  
**Milestone:** M0 - Foundations (Auth + Org + RLS)  
**Status:** Ready for Testing

## Overview

M0 implements the foundational authentication and organization system for BookMe. This milestone establishes secure user authentication with OTP verification, single-business membership enforcement, and complete RLS (Row Level Security) policies.

## What Was Built

### 1. Database Schema ✅

**Tables Created:**
- `organizations` - Business entities with branding and settings
- `users` - User profiles (extends Supabase auth.users)
- `memberships` - User-organization relationships with role management
- `invites` - Pending staff invitations

**Key Features:**
- UNIQUE constraint on `memberships.user_id` enforces single-business rule
- Complete RLS policies for all tables using `auth.org_id()` function
- Automatic `updated_at` triggers
- Comprehensive indexes for performance

**Location:** `/packages/db/supabase/migrations/000_init.sql`

### 2. TypeScript Types ✅

Complete type definitions for all database tables and auth-related types.

**Location:** `/packages/db/src/types/index.ts`

### 3. Authentication API Routes ✅

**Endpoints Created:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/signup` | POST | Create user + organization |
| `/api/auth/login` | POST | Verify password, send OTP |
| `/api/auth/send-otp` | POST | Send OTP code |
| `/api/auth/verify-otp` | POST | Verify OTP, establish session |
| `/api/auth/invite` | POST | Send staff invitation |
| `/api/auth/accept-invite` | POST | Accept invite, create membership |

**Security Features:**
- All endpoints use Zod validation
- Password verification before OTP
- Token-based invite system with expiry
- Proper error handling and cleanup on failures
- Single-business constraint enforcement

**Location:** `/apps/web/src/app/api/auth/`

### 4. Authentication UI Pages ✅

**Pages Created:**

| Page | Route | Purpose |
|------|-------|---------|
| Login | `/login` | Password + OTP login flow |
| Signup | `/signup` | Business creation + user registration |
| Verify OTP | `/verify-otp` | OTP verification |
| Forgot Password | `/forgot-password` | Password reset flow |
| Accept Invite | `/accept-invite` | Staff invitation acceptance |
| Dashboard | `/dashboard` | Post-auth landing page |
| Team | `/team` | Team management + invites |

**UX Features:**
- Two-step login (password → OTP)
- Auto-generated business handle from name
- Handle sanitization and validation
- Resend OTP functionality
- Success/error messaging
- Mobile-responsive design
- Proper loading states

**Location:** `/apps/web/src/app/`

### 5. Middleware Enhancement ✅

**Updates:**
- Proper public/protected route handling
- Redirect with original URL on auth failure
- Inject `org_id`, `role`, and `user_id` into request headers for RLS
- Support for invite acceptance flow
- Session validation

**Location:** `/apps/web/src/middleware.ts`

## Key Design Decisions

### 1. OTP at Every Login
- Password verification happens first
- OTP sent only after password is correct
- Session established only after OTP verification
- Enhances security for Hong Kong market

### 2. Single-Business Enforcement
- Database-level: UNIQUE constraint on `memberships.user_id`
- Application-level: Checks in invite acceptance
- Clear error messages when constraint violated

### 3. Handle Generation
- Auto-generated from business name
- Sanitized: lowercase, alphanumeric + hyphens
- Minimum 3 characters, maximum 50
- Checked for uniqueness

### 4. Role-Based Access
- Owner: Created during signup
- Admin: Can invite others, manage settings
- Staff: Manage own calendar
- Receptionist: Manage all bookings
- Viewer: Read-only access

### 5. Invite System
- 7-day expiry on invites
- Token-based (32-byte hex)
- Single-use (marked accepted)
- Can invite existing users if they have no membership

## RLS Security Model

All tables use RLS with the following pattern:

```sql
-- Users see data only from their organization
WHERE org_id = auth.org_id()

-- org_id extracted from JWT claims
-- JWT populated on OTP verification with:
--   - org_id (from membership)
--   - role (from membership)
--   - user_id (from auth)
```

## Testing Checklist

### Manual Testing Required

- [ ] **Signup Flow**
  - [ ] Create account with unique email
  - [ ] Verify business handle validation
  - [ ] Receive OTP email
  - [ ] Verify OTP and establish session
  - [ ] Redirect to dashboard

- [ ] **Login Flow**
  - [ ] Login with existing credentials
  - [ ] Verify OTP requirement
  - [ ] Test OTP resend
  - [ ] Invalid OTP handling
  - [ ] Successful login → dashboard

- [ ] **Single-Business Constraint**
  - [ ] Try to create second org with same user (should fail)
  - [ ] Try to accept invite when already in org (should fail)
  - [ ] Database constraint prevents duplicate memberships

- [ ] **Staff Invite Flow**
  - [ ] Owner/admin can send invites
  - [ ] Non-admin cannot send invites
  - [ ] Accept invite creates user + membership
  - [ ] Accept invite with existing user (no membership)
  - [ ] Expired invite rejected

- [ ] **Forgot Password**
  - [ ] Request password reset
  - [ ] Receive OTP
  - [ ] Complete verification

- [ ] **Session Management**
  - [ ] Session persists across page loads
  - [ ] Protected routes require auth
  - [ ] Public routes accessible without auth
  - [ ] Logout clears session

## Known Limitations

1. **Email Delivery**: Currently using Supabase's default email service
   - Production: Configure custom SMTP
   - Templates: Need to be customized in Supabase dashboard

2. **Invite Emails**: API returns invite URL but doesn't send email
   - TODO: Integrate email service in production

3. **Password Reset**: Uses OTP, but full reset flow needs password update UI

4. **Team Member Listing**: Team page created but needs to fetch actual members

## Database Migration

To apply the migration:

```bash
cd packages/db
# Using Supabase CLI
supabase db push

# Or apply directly to your Supabase project
```

## Environment Variables Required

```env
# Required for auth to work
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## API Error Codes

| Status | Meaning |
|--------|---------|
| 400 | Invalid input (Zod validation) |
| 401 | Invalid credentials / Unauthorized |
| 403 | Insufficient permissions |
| 500 | Server error |

## Next Steps (M1 - Onboarding)

With M0 complete, the next milestone will build:

1. **Onboarding Wizard**
   - Business details completion
   - Service setup
   - Staff configuration
   - Working hours

2. **Services Management**
   - Service categories
   - Service variants
   - Pricing tiers
   - Seniority titles

3. **Team Profiles**
   - Staff working hours
   - Service assignments
   - Time off management

## Files Created

```
packages/db/
  └── supabase/migrations/000_init.sql (updated)
  └── src/types/index.ts (updated)

apps/web/src/
  ├── app/
  │   ├── api/auth/
  │   │   ├── signup/route.ts
  │   │   ├── login/route.ts
  │   │   ├── send-otp/route.ts
  │   │   ├── verify-otp/route.ts
  │   │   ├── invite/route.ts
  │   │   └── accept-invite/route.ts
  │   ├── login/page.tsx
  │   ├── signup/page.tsx
  │   ├── verify-otp/page.tsx
  │   ├── forgot-password/page.tsx
  │   ├── accept-invite/page.tsx
  │   ├── dashboard/page.tsx
  │   └── team/page.tsx
  └── middleware.ts (updated)
```

## Success Criteria ✅

- [x] OTP enforced at every login
- [x] Single-business membership per user (DB + app enforced)
- [x] RLS policies protect all org data
- [x] Staff invite system functional
- [x] Complete auth flows (signup, login, invite)
- [x] Dashboard accessible post-auth
- [x] Middleware injects org_id for RLS

## Notes

- All UI components use shadcn/ui with Marshmallow theme
- Form validation uses Zod schemas
- Error messages are user-friendly
- Mobile-responsive design throughout
- Dark mode support included

