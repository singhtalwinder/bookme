# Testing Guide - New Authentication Flow

## Prerequisites
- Supabase project configured
- Email OTP enabled in Supabase Auth settings
- `.env.local` with all required variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

## Test Scenarios

### 1. Happy Path - Complete Signup Flow

**Steps:**
1. Navigate to home page `/`
2. Click "Get Started" button
3. Should redirect to `/create-account`
4. Enter valid email and password (min 8 characters)
5. Click "Continue"
6. Check email for 6-digit OTP code
7. Enter OTP code in verification field
8. Click "Verify"
9. Should redirect to `/signup` (onboarding wizard)
10. Complete Step 1 (Personal Info):
    - First name: John
    - Last name: Doe
    - Country code: +1 (US)
    - Phone: (555) 123-4567
    - Country: United States
11. Click "Next"
12. Complete Step 2 (Business Details):
    - Business name: Test Business
    - Website: https://example.com (optional)
    - Physical address: 123 Main St (optional)
    - Team size: Just me
13. Click "Next"
14. Complete Step 3 (Industry):
    - Search and select an industry (e.g., "Hair Salon")
    - Click on the selected badge to make it primary
15. Click "Next"
16. Complete Step 4 (Service Locations):
    - Select at least one location (e.g., "In store / Physical location")
17. Click "Next"
18. Complete Step 5 (Current Software):
    - Select an option (e.g., "I'm not using any software")
19. Click "Next"
20. Complete Step 6 (Referral Source):
    - Select how you heard about us (e.g., "Search engine")
21. Click "Create account"
22. Should redirect to `/dashboard`
23. Verify user is logged in
24. Check database for:
    - User created in `users` table
    - Organization created in `organizations` table
    - Membership created in `memberships` table with role='owner'

**Expected Result:** ✅ Account created successfully, user logged in and on dashboard

---

### 2. Invalid OTP Code

**Steps:**
1. Go to `/create-account`
2. Enter email and password
3. Click "Continue"
4. Enter incorrect OTP (e.g., "000000")
5. Click "Verify"

**Expected Result:** ❌ Error message: "Invalid or expired verification code"

---

### 3. Duplicate Email

**Steps:**
1. Complete a full signup with email `test@example.com`
2. Log out
3. Go to `/create-account`
4. Enter same email `test@example.com`
5. Click "Continue"

**Expected Result:** ❌ Error message: "Email already registered"

---

### 4. Session Expiration

**Steps:**
1. Go to `/create-account`
2. Enter email and password
3. Verify OTP successfully
4. DO NOT complete onboarding
5. Wait 1 hour OR manually delete `pending_signup` cookie
6. Try to refresh `/signup` page

**Expected Result:** 🔄 Redirected to `/create-account` with message about expired session

---

### 5. Direct Access to Onboarding Without Verification

**Steps:**
1. Clear all cookies
2. Try to navigate directly to `/signup`

**Expected Result:** 🔄 Automatically redirected to `/create-account`

---

### 6. Browser Refresh During Onboarding

**Steps:**
1. Start onboarding flow
2. Get to Step 3 or 4
3. Refresh the browser
4. Check if still on `/signup`
5. Check if email session is still valid

**Expected Result:** ✅ User stays on `/signup`, can continue onboarding (within 1 hour)

---

### 7. Back Button Navigation

**Steps:**
1. Complete create-account and OTP verification
2. On `/signup`, fill out steps 1-3
3. Use browser back button
4. Verify navigation between steps works

**Expected Result:** ✅ Can navigate backward through steps, form data persists

---

### 8. Resend OTP

**Steps:**
1. Go to `/create-account`
2. Enter email and password
3. Click "Continue"
4. Click "Didn't receive a code? Resend"
5. Check email for new OTP

**Expected Result:** ✅ New OTP sent successfully

---

### 9. Login After Signup

**Steps:**
1. Complete full signup flow
2. Navigate to `/dashboard` (should be logged in)
3. Open new incognito window
4. Go to `/login`
5. Enter the same email/password used during signup
6. Complete OTP verification

**Expected Result:** ✅ User can log in with created account

---

### 10. Validation Errors

**Steps:**
1. Go to `/create-account`
2. Click "Continue" without entering anything
3. Enter invalid email format
4. Enter password less than 8 characters
5. On onboarding, try to proceed without required fields

**Expected Results:** ❌ Appropriate validation errors shown for each field

---

## Database Checks

After successful signup, verify in Supabase dashboard:

### Users Table
```sql
SELECT * FROM users WHERE email = 'test@example.com';
```
Should show:
- `id` matches auth.users.id
- `name` = "First Last"
- `email` = entered email
- `metadata` contains phone info

### Organizations Table
```sql
SELECT * FROM organizations WHERE handle LIKE 'test-business%';
```
Should show:
- Auto-generated handle from business name
- `metadata` contains onboarding data (industries, locations, etc.)

### Memberships Table
```sql
SELECT * FROM memberships 
WHERE user_id = '<user_id>' AND org_id = '<org_id>';
```
Should show:
- `role` = 'owner'
- Links user to their organization

### Auth Users
Check in Supabase Auth dashboard:
- User exists with verified email
- `user_metadata` contains name and org_id

---

## Cookie Inspection

During onboarding (before completion), inspect cookies:
- `pending_signup` should exist
- Should be httpOnly
- Should expire in 1 hour
- Value should be encrypted JSON

After completion:
- `pending_signup` cookie should be deleted
- Supabase session cookies should exist

---

## Error Scenarios to Test

1. **Network Errors**
   - Disconnect internet during OTP submission
   - Disconnect during account creation

2. **Malformed Data**
   - Send invalid JSON to API endpoints
   - Try to bypass frontend validation with browser tools

3. **Concurrent Sessions**
   - Start signup in two browsers with same email
   - Complete in one, try to complete in other

---

## Performance Checks

1. **OTP Delivery Time**: Should receive email within 30 seconds
2. **Page Load Times**: All pages should load under 2 seconds
3. **Form Submission**: Account creation should complete within 5 seconds

---

## Browser Compatibility

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Safari (iOS)
- ✅ Mobile Chrome (Android)

---

## Accessibility Checks

1. Tab through forms - all fields should be keyboard accessible
2. Screen reader test - labels should be properly announced
3. Error messages should be associated with form fields
4. Color contrast should meet WCAG guidelines

---

## Security Checks

1. ✅ Passwords not visible in network requests (check browser dev tools)
2. ✅ Cookies are httpOnly and secure (in production)
3. ✅ OTP codes expire after use
4. ✅ Can't access onboarding without valid session
5. ✅ CSRF protection via Next.js

