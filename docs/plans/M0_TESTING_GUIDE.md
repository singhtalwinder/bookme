# M0 Authentication Testing Guide

## Prerequisites

1. **Supabase Project Setup**
   ```bash
   # Install Supabase CLI if not already installed
   brew install supabase/tap/supabase
   
   # Link to your project
   cd packages/db
   supabase link --project-ref your-project-ref
   
   # Apply migrations
   supabase db push
   ```

2. **Environment Variables**
   
   Create `/apps/web/.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Start Development Server**
   ```bash
   # From project root
   pnpm install
   pnpm dev
   ```

## Test Scenarios

### 1. New User Signup ✅

**Steps:**
1. Navigate to `http://localhost:3000/signup`
2. Fill in the form:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "TestPass123!"
   - Business Name: "Test Salon"
   - Business Handle: Auto-generated or custom
3. Submit form
4. Check email for OTP code
5. Enter OTP on verification page
6. Verify redirect to dashboard

**Expected Results:**
- Account created in `auth.users`
- Organization created in `organizations`
- User profile created in `users`
- Membership created with role='owner'
- JWT contains org_id and role
- Dashboard displays business name

**Database Verification:**
```sql
-- Check user was created
SELECT * FROM users WHERE email = 'john@example.com';

-- Check organization was created
SELECT * FROM organizations WHERE handle = 'test-salon';

-- Check membership was created
SELECT m.*, u.email, o.name as org_name
FROM memberships m
JOIN users u ON m.user_id = u.id
JOIN organizations o ON m.org_id = o.id
WHERE u.email = 'john@example.com';
```

### 2. Existing User Login ✅

**Steps:**
1. Navigate to `http://localhost:3000/login`
2. Enter email and password
3. Click "Continue"
4. Check email for OTP
5. Enter OTP
6. Verify redirect to dashboard

**Expected Results:**
- Password verified before OTP sent
- OTP email received
- Session established after OTP verification
- Dashboard shows user's organization

### 3. Single-Business Constraint ✅

**Test A: Attempt Second Signup**
1. While logged in, try to access `/signup`
2. Should redirect to dashboard

**Test B: Database Constraint**
```sql
-- Try to create duplicate membership (should fail)
INSERT INTO memberships (user_id, org_id, role)
VALUES (
  (SELECT id FROM users WHERE email = 'john@example.com'),
  (SELECT id FROM organizations WHERE handle = 'another-org'),
  'staff'
);
-- Expected: ERROR: duplicate key value violates unique constraint "memberships_user_id_key"
```

### 4. Staff Invitation Flow ✅

**Steps:**
1. Login as owner/admin
2. Navigate to `/team`
3. Click "Invite team member"
4. Fill form:
   - Email: "staff@example.com"
   - Role: "staff"
5. Submit invitation
6. Copy invite URL from response (or check database)
7. Open invite URL in incognito/another browser
8. Complete staff profile:
   - Name: "Jane Staff"
   - Password: "StaffPass123!"
9. Verify OTP
10. Check dashboard

**Expected Results:**
- Invite created with token
- Invite email sent (or URL available)
- Accept page loads with invite details
- New user created with membership
- Staff sees their organization's dashboard
- Staff cannot invite others

**Database Verification:**
```sql
-- Check invite was created
SELECT * FROM invites WHERE email = 'staff@example.com';

-- After acceptance, check membership
SELECT m.*, u.email, u.name, m.role
FROM memberships m
JOIN users u ON m.user_id = u.id
WHERE u.email = 'staff@example.com';
```

### 5. Invite to Existing User (No Membership) ✅

**Steps:**
1. Create a user account but don't complete signup (or manually insert)
2. Send invite to that email
3. Accept invite
4. User should be added to organization

**Expected Result:**
- Existing user gets membership added
- No duplicate user created

### 6. Invite Rejection Scenarios ✅

**Test A: User Already in Organization**
1. Send invite to john@example.com (who already owns an org)
2. Try to accept invite
3. Should see error: "You already belong to an organization"

**Test B: Expired Invite**
```sql
-- Manually expire an invite
UPDATE invites 
SET expires_at = NOW() - INTERVAL '1 day'
WHERE email = 'expired@example.com';
```
Try to accept - should see error: "Invite has expired"

**Test C: Invalid Token**
Navigate to `/accept-invite?token=invalid-token`
Should see error: "Invalid or expired invite"

### 7. Password Reset Flow ✅

**Steps:**
1. Navigate to `/forgot-password`
2. Enter email
3. Submit
4. Check email for OTP
5. Use OTP on verify page
6. Should establish session (password update UI pending)

**Expected Results:**
- OTP sent to email
- Can verify and login

### 8. OTP Resend ✅

**Steps:**
1. During any OTP step, click "Resend code"
2. Should receive new OTP
3. Old OTP should be invalidated (Supabase handles this)
4. New OTP should work

### 9. Session Persistence ✅

**Steps:**
1. Login successfully
2. Refresh page
3. Session should persist
4. Navigate between pages
5. Should remain logged in
6. Check localStorage for Supabase auth tokens

### 10. Route Protection ✅

**Protected Routes (require auth):**
- `/dashboard`
- `/calendar`
- `/team`
- `/services`
- `/clients`

**Steps:**
1. Logout or use incognito
2. Try to access `/dashboard`
3. Should redirect to `/login?redirect=/dashboard`

**Public Routes:**
- `/`
- `/login`
- `/signup`
- `/verify-otp`
- `/forgot-password`
- `/accept-invite`
- `/book/*`

### 11. Role-Based Invite Permissions ✅

**Steps:**
1. Login as staff user (not owner/admin)
2. Navigate to `/team`
3. Try to send invite
4. API should return 403 Forbidden

**Database Check:**
```sql
-- Check RLS policy
-- Staff shouldn't be able to insert into invites
```

### 12. Handle Validation ✅

**Test Cases:**
1. Handle with uppercase → should convert to lowercase
2. Handle with spaces → should convert to hyphens
3. Handle with special chars → should remove them
4. Handle too short (< 3) → should show error
5. Duplicate handle → should show error

**Steps:**
1. Try each case in signup form
2. Verify sanitization and validation

### 13. Logout ✅

**Steps:**
1. Click "Sign out" in dashboard
2. Should clear session
3. Should redirect to login
4. Try to access `/dashboard`
5. Should redirect to login

## Performance Tests

### 1. RLS Query Performance
```sql
-- Test org filtering
EXPLAIN ANALYZE
SELECT * FROM organizations WHERE id = auth.org_id();

-- Should use index, < 1ms
```

### 2. Membership Lookup
```sql
-- Test unique constraint performance
EXPLAIN ANALYZE
SELECT * FROM memberships WHERE user_id = 'some-uuid';

-- Should use unique index, < 1ms
```

## Security Audit

### 1. SQL Injection
- All queries use parameterized statements ✅
- Supabase client handles escaping ✅

### 2. XSS Protection
- React escapes by default ✅
- No `dangerouslySetInnerHTML` used ✅

### 3. CSRF Protection
- Supabase handles CSRF tokens ✅
- All POST requests use proper headers ✅

### 4. RLS Bypass Attempts
```sql
-- Try to access another org's data
-- Should return empty set due to RLS
SELECT * FROM organizations WHERE id != auth.org_id();
```

### 5. Rate Limiting
- Supabase has built-in rate limiting ✅
- Consider adding custom rate limiting for production

## Common Issues & Solutions

### Issue: OTP Email Not Received
**Solutions:**
1. Check spam folder
2. Verify Supabase email settings
3. Check Supabase logs for email delivery
4. Configure custom SMTP for production

### Issue: Session Not Persisting
**Solutions:**
1. Check browser localStorage
2. Verify Supabase URL and keys
3. Check for cookie blocking
4. Clear browser cache

### Issue: RLS Policy Errors
**Solutions:**
1. Verify JWT contains org_id
2. Check `auth.org_id()` function exists
3. Test with service_role key (bypasses RLS)
4. Check policy definitions

### Issue: Migration Errors
**Solutions:**
1. Drop and recreate database (dev only)
2. Check for existing tables/types
3. Verify Supabase CLI version
4. Check migration file syntax

## Automated Testing (Future)

To add automated tests:

```typescript
// Example E2E test with Playwright
test('user can signup and login', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'TestPass123!');
  // ... complete signup flow
  await expect(page).toHaveURL('/dashboard');
});
```

## Load Testing (Future)

```bash
# Using Artillery
artillery quick --count 10 --num 100 http://localhost:3000/api/auth/login
```

## Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ Proper error messages displayed
- ✅ Database constraints enforced
- ✅ RLS policies working
- ✅ Sessions persisting
- ✅ OTP emails sent
- ✅ Single-business rule enforced

