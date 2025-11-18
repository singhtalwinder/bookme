# Authentication & Onboarding Flow Update

## Summary

The authentication and onboarding flow has been restructured to separate email/password collection from the onboarding wizard. This creates a cleaner user experience with email verification happening before users enter business details.

## New Flow

### 1. Initial Account Creation (`/create-account`)
- **Purpose**: Collect email and password, verify email via OTP
- **Features**:
  - Email and password input with validation
  - Social login buttons (Google, Facebook) - placeholder for future implementation
  - OTP verification step
  - Similar design to the login page for consistency

### 2. Onboarding Wizard (`/signup`)
- **Purpose**: Collect business and personal information after email is verified
- **Changes**:
  - **Step 1 (Personal Info)**: Removed email field, now only collects:
    - First name
    - Last name
    - Country code & phone number
    - Country
  - **Step 6 (Almost Done)**: Removed password field, now only collects:
    - Referral source
  - Steps 2-5 remain unchanged

### 3. Session Management
- Verified email and password are stored in a secure HTTP-only cookie (`pending_signup`)
- Cookie expires after 1 hour
- Cookie is validated before allowing access to onboarding
- Cookie is cleared after successful account creation

## API Routes

### New Routes

1. **POST `/api/auth/initiate-signup`**
   - Accepts: `{ email, password }`
   - Validates email is not already registered
   - Sends OTP to email
   - Returns: `{ success, message }`

2. **POST `/api/auth/verify-signup-otp`**
   - Accepts: `{ email, password, token }`
   - Verifies OTP code
   - Creates secure session cookie with verified credentials
   - Returns: `{ success, message, verified }`

3. **GET `/api/auth/check-pending-signup`**
   - Checks for valid pending signup session
   - Returns: `{ email, verified }` or error if expired/missing

4. **POST `/api/auth/complete-signup`**
   - Accepts: All onboarding form data (without email/password)
   - Retrieves email/password from session cookie
   - Creates:
     - Supabase auth user (with email already verified)
     - Organization with auto-generated handle
     - User profile with all details
     - Membership with owner role
   - Signs user in automatically
   - Clears pending signup cookie
   - Returns: `{ success, userId, orgId }`

### Modified Routes

- **Existing `/api/auth/signup`**: Kept for backward compatibility but no longer used in main flow

## User Experience Flow

1. User visits home page → clicks "Get Started"
2. Redirected to `/create-account`
3. Enters email and password → receives OTP
4. Enters OTP code → email verified
5. Redirected to `/signup` (onboarding wizard)
6. If user refreshes or revisits `/signup`:
   - System checks for pending signup session
   - If valid, continues onboarding
   - If expired/missing, redirects to `/create-account`
7. Completes 6-step onboarding wizard
8. Account fully created → redirected to `/dashboard`

## Security Features

- Email verification via OTP before any account creation
- Secure HTTP-only cookies prevent client-side tampering
- 1-hour expiration on pending signups
- Password stored temporarily in encrypted cookie (via Next.js)
- Full cleanup on successful account creation or expiration

## Benefits

1. **Better UX**: Users verify their email upfront, reducing friction later
2. **Cleaner Onboarding**: Focus on business details without auth concerns
3. **Session Protection**: Secure temporary storage of credentials
4. **Consistent Design**: Create account page matches login page design
5. **Social Login Ready**: Structure supports future social auth integration

## Files Modified

### New Files
- `/apps/web/src/app/create-account/page.tsx`
- `/apps/web/src/app/api/auth/initiate-signup/route.ts`
- `/apps/web/src/app/api/auth/verify-signup-otp/route.ts`
- `/apps/web/src/app/api/auth/check-pending-signup/route.ts`
- `/apps/web/src/app/api/auth/complete-signup/route.ts`

### Modified Files
- `/apps/web/src/app/signup/page.tsx` - Removed email from step 1, password from step 6, added session check
- `/apps/web/src/app/login/page.tsx` - Updated signup link to `/create-account`
- `/apps/web/src/app/page.tsx` - Added Get Started button linking to `/create-account`

## Migration Notes

- Existing users are unaffected
- Old `/signup` route with email/password in the wizard can be deprecated
- Cookie-based session is temporary (1 hour) and self-cleaning
- No database schema changes required

## Testing Recommendations

1. Test complete flow: create-account → verify OTP → onboarding → dashboard
2. Test session expiration (wait 1 hour or manually delete cookie)
3. Test refresh/reload at various steps
4. Test back button navigation
5. Test duplicate email handling
6. Test invalid OTP codes
7. Test network errors during signup
8. Verify cookies are properly cleared after completion

## Future Enhancements

- Implement actual Google OAuth integration
- Implement actual Facebook OAuth integration
- Add phone number verification as optional second factor
- Add email change/resend OTP functionality
- Add progress saving (allow users to resume incomplete onboarding)

