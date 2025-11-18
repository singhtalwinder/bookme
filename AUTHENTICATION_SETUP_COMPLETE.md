# Authentication Setup - Complete ✅

## Overview

Your BookMe application now has a fully functional authentication system integrated with Supabase. This document outlines what has been implemented and how to use it.

## What's Been Implemented

### 1. **Supabase Integration** ✅
- Updated to use `@supabase/ssr` package (proper Next.js 15 App Router support)
- Three client types:
  - `createClient()` - Client-side browser client
  - `createServerClient()` - Server-side client with RLS (respects user sessions)
  - `createAdminClient()` - Admin client with service role (bypasses RLS)

### 2. **Database Schema** ✅
- Added `metadata` JSONB columns to `users` and `organizations` tables
- Migration file created: `packages/db/supabase/migrations/001_add_metadata_columns.sql`
- Flexible storage for onboarding data, user details, and organization settings

### 3. **Complete Auth Flow** ✅

#### **Signup Flow**:
1. User enters email + password (`/create-account`)
2. System sends OTP to email (`/api/auth/initiate-signup`)
3. User verifies OTP (`/api/auth/verify-signup-otp`)
4. User completes onboarding with business details (`/onboarding`)
5. Account created with organization, user profile, and membership (`/api/auth/complete-signup`)
6. User automatically signed in and redirected to dashboard

#### **Login Flow**:
1. User enters email + password (`/login`)
2. System verifies password, sends OTP (`/api/auth/login`)
3. User verifies OTP (`/api/auth/verify-otp`)
4. Session created, user redirected to dashboard

#### **Logout Flow**:
1. User clicks "Sign out" button
2. Session destroyed (`/api/auth/logout` or server action)
3. User redirected to login page

### 4. **Middleware Protection** ✅
- Automatic session refresh
- Protected routes (requires authentication)
- Public routes (login, signup, onboarding, etc.)
- Automatic redirects:
  - Unauthenticated users → `/login`
  - Authenticated users trying to access auth pages → `/dashboard`

### 5. **JWT Claims** ✅
- User metadata includes `org_id` and `role`
- Enables Row Level Security (RLS) policies
- Automatically injected into request headers via middleware

## API Routes

### Auth API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/initiate-signup` | POST | Start signup, send OTP |
| `/api/auth/verify-signup-otp` | POST | Verify OTP, save verified email |
| `/api/auth/complete-signup` | POST | Complete onboarding, create account |
| `/api/auth/login` | POST | Verify password, send OTP |
| `/api/auth/verify-otp` | POST | Verify OTP for login, create session |
| `/api/auth/logout` | POST | Sign out user |
| `/api/auth/send-otp` | POST | Resend OTP |

## Database Structure

### Organizations Table
```sql
- id (uuid, PK)
- name (text)
- handle (text, unique) -- for booking URLs
- timezone (text)
- currency (text)
- phone (text)
- address (text)
- brand_color (text)
- logo_url (text)
- metadata (jsonb) -- onboarding data
- created_at, updated_at
```

### Users Table
```sql
- id (uuid, PK, FK to auth.users)
- email (text, unique)
- name (text)
- avatar_url (text)
- metadata (jsonb) -- phone, firstName, lastName, etc.
- created_at, updated_at
```

### Memberships Table
```sql
- id (uuid, PK)
- user_id (uuid, unique, FK to users)
- org_id (uuid, FK to organizations)
- role (enum: owner, admin, staff, receptionist, viewer)
- created_at, updated_at
```

**Important**: The `user_id` is UNIQUE, enforcing the single-business rule per user.

## Environment Variables Required

Create a `.env.local` file in `apps/web/`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Running the Migration

To add the metadata columns to your database:

```bash
# If using Supabase CLI
cd packages/db
supabase db push

# Or run the SQL directly in Supabase Dashboard:
# SQL Editor → New Query → Paste contents of 001_add_metadata_columns.sql
```

## Testing the Auth Flow

### 1. **Start the Development Server**
```bash
cd apps/web
pnpm dev
```

### 2. **Test Signup**
1. Navigate to `http://localhost:3000/create-account`
2. Enter email and password
3. Check email for OTP code
4. Enter OTP
5. Complete onboarding form (6 steps)
6. Should redirect to dashboard

### 3. **Test Login**
1. Navigate to `http://localhost:3000/login`
2. Enter email and password
3. Check email for OTP code
4. Enter OTP
5. Should redirect to dashboard

### 4. **Test Logout**
1. Click "Sign out" button in dashboard header
2. Should redirect to login page
3. Try accessing `/dashboard` - should redirect to login

### 5. **Test Protected Routes**
1. Log out
2. Try accessing `/dashboard`, `/team`, etc.
3. Should redirect to login with `?redirect=` parameter

## Key Features

✅ **Email + Password + OTP** - Two-factor authentication
✅ **Onboarding Flow** - Collect business details during signup
✅ **Organization Management** - Each user belongs to one organization
✅ **Role-Based Access** - Owner, Admin, Staff, Receptionist, Viewer roles
✅ **Row Level Security** - Data isolation by organization
✅ **Session Management** - Automatic refresh, secure cookies
✅ **Middleware Protection** - Route guards and automatic redirects
✅ **JWT Claims** - org_id and role in tokens for RLS

## Next Steps

1. **Run the migration** to add metadata columns
2. **Configure Supabase** email templates (optional, for branded emails)
3. **Test the complete flow** from signup to dashboard
4. **Implement password reset** (optional, use `/forgot-password` page)
5. **Add social auth** (Google, Facebook) if desired

## Troubleshooting

### Issue: "Missing Supabase environment variables"
- Ensure `.env.local` exists in `apps/web/`
- Check variable names match exactly (with `NEXT_PUBLIC_` prefix for client-side)

### Issue: "Failed to send verification code"
- Check Supabase project has email auth enabled
- Verify email templates are configured in Supabase Dashboard
- Check Supabase logs for email sending errors

### Issue: "User membership not found" after login
- Ensure the complete-signup flow finished successfully
- Check that memberships table has a record for the user
- Verify org_id is set in user metadata

### Issue: OTP not receiving
- Check Supabase email settings
- Look in spam folder
- In development, check Supabase Dashboard → Authentication → Email for rate limits
- May need to configure custom SMTP in production

## Architecture Notes

- **Client Components** use `createClient()` from `@/lib/supabase`
- **Server Components** use `await createServerClient()`
- **API Routes** use `await createServerClient()` for user sessions or `createAdminClient()` for admin operations
- **Middleware** uses `@supabase/ssr` directly with cookie handling

## File Structure

```
apps/web/src/
├── lib/
│   └── supabase.ts                          # Supabase client setup
├── middleware.ts                             # Auth middleware
├── app/
│   ├── api/auth/
│   │   ├── initiate-signup/route.ts         # Start signup
│   │   ├── verify-signup-otp/route.ts       # Verify email
│   │   ├── complete-signup/route.ts         # Complete registration
│   │   ├── login/route.ts                   # Login (password check)
│   │   ├── verify-otp/route.ts              # Verify OTP for login
│   │   ├── logout/route.ts                  # Sign out
│   │   └── send-otp/route.ts                # Resend OTP
│   ├── create-account/page.tsx              # Signup page
│   ├── login/page.tsx                       # Login page
│   ├── onboarding/page.tsx                  # Onboarding wizard
│   └── dashboard/page.tsx                   # Protected dashboard

packages/db/supabase/migrations/
└── 001_add_metadata_columns.sql             # Metadata columns migration
```

## Summary

🎉 **Your authentication system is fully set up and ready to use!**

The system handles:
- User registration with email verification
- Two-factor authentication (password + OTP)
- Complete onboarding flow with business details
- Organization and user profile management
- Secure session handling with automatic refresh
- Route protection and role-based access
- Row-level security with proper JWT claims

You can now focus on building the rest of your BookMe features!

