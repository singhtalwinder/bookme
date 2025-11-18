# 🧪 Test Your Authentication System

## ✅ Your Setup Status

- ✅ Production Supabase connected
- ✅ Database migrations applied
- ✅ 4 tables created (organizations, users, memberships, invites)
- ✅ RLS policies enabled
- ✅ Dev server starting...

---

## 🚀 Step 1: Access Your App

Open your browser and go to:
```
http://localhost:3000
```

You should see the BookMe landing page with:
- ✅ Logo
- ✅ "Logo Showcase" button
- ✅ "Component playground" button
- ✅ "Simple test" button

---

## 📝 Step 2: Test Signup Flow

1. Click the browser's address bar and go to:
   ```
   http://localhost:3000/signup
   ```

2. Fill in the form:
   - **Your name**: John Doe
   - **Email**: your-real-email@example.com (use a real email you can check!)
   - **Password**: TestPass123!
   - **Business name**: Test Salon
   - **Business handle**: test-salon (auto-generated)

3. Click **"Create account"**

4. You should see a redirect to the OTP verification page

5. **Check your email** for the OTP code
   - Subject: "Confirm your signup"
   - Sender: noreply@mail.app.supabase.io
   - Contains a 6-digit code

6. Enter the 6-digit code

7. Click **"Verify"**

8. You should be redirected to `/dashboard` 🎉

---

## ✅ Step 3: Verify in Supabase Dashboard

Go back to Supabase and check:

### Table: users
1. Go to **Table Editor** > **users**
2. You should see your user record:
   - ✅ id (UUID)
   - ✅ email (your email)
   - ✅ name (John Doe)
   - ✅ created_at timestamp

### Table: organizations
1. Click **organizations** table
2. You should see:
   - ✅ name: "Test Salon"
   - ✅ handle: "test-salon"
   - ✅ timezone: "Asia/Hong_Kong"
   - ✅ currency: "HKD"

### Table: memberships
1. Click **memberships** table
2. You should see:
   - ✅ user_id (matches your user)
   - ✅ org_id (matches your organization)
   - ✅ role: "owner"

### Authentication Logs
1. Go to **Authentication** > **Logs**
2. You should see:
   - ✅ OTP sent event
   - ✅ User signup event
   - ✅ Login event

---

## 🧪 Step 4: Test Login Flow

1. In your app, click **"Sign out"** (top right)

2. Go to `/login`

3. Enter your credentials:
   - Email: (same as signup)
   - Password: TestPass123!

4. Click **"Continue"**

5. Check your email for new OTP code

6. Enter the code

7. Should redirect to dashboard ✅

---

## 🎯 Step 5: Test Dashboard Features

Once logged in, you should see:

### Dashboard Page
- ✅ Welcome message with your name
- ✅ Organization name displayed
- ✅ "Get Started" checklist
- ✅ Booking page URL preview
- ✅ Quick stats (all showing 0)
- ✅ Next steps cards

### Navigation
Try clicking these links:
- ✅ Dashboard (current page)
- ✅ Calendar (placeholder)
- ✅ Clients (placeholder)
- ✅ Services (placeholder)
- ✅ Team (team management page)

### Team Page
1. Click **"Team"** in navigation
2. Click **"Invite team member"**
3. Fill in:
   - Email: another-email@example.com
   - Role: Staff
4. Click **"Send invitation"**
5. You should see success message
6. **Copy the invite URL** from the success message

---

## 👥 Step 6: Test Staff Invite (Optional)

1. Open the invite URL in an **incognito/private window**

2. You should see the accept invite page

3. Fill in:
   - Name: Jane Staff
   - Password: StaffPass123!
   - Confirm password: StaffPass123!

4. Click **"Accept invitation"**

5. Check email for OTP

6. Enter OTP

7. Should see dashboard (now as staff member!)

8. **Verify in Supabase:**
   - Check `invites` table - should show `accepted_at` timestamp
   - Check `memberships` table - should have 2 rows now
   - Check `users` table - should have 2 users

---

## ❌ Step 7: Test Single-Business Constraint

**This should FAIL (by design):**

1. While still logged in as staff, try to go to `/signup`
2. Should redirect to dashboard (already logged in)

3. OR try this in Supabase SQL Editor:
```sql
-- Try to create duplicate membership (should fail)
INSERT INTO memberships (user_id, org_id, role)
VALUES (
  (SELECT id FROM users LIMIT 1),
  gen_random_uuid(),
  'staff'
);
```

Expected error:
```
ERROR: duplicate key value violates unique constraint "memberships_user_id_key"
```

✅ This proves the single-business rule is working!

---

## 🎉 Success Checklist

- [ ] Can signup with email + password
- [ ] Receive OTP email
- [ ] OTP verification works
- [ ] Dashboard loads after login
- [ ] User record in database
- [ ] Organization record in database
- [ ] Membership record with role='owner'
- [ ] Can logout and login again
- [ ] Can invite team members
- [ ] Staff can accept invites
- [ ] Single-business constraint enforced

---

## 🐛 Troubleshooting

### "No OTP email received"
1. Check spam folder
2. Wait 1-2 minutes (emails can be slow)
3. Check Supabase > Authentication > Logs
4. Try "Resend code" button

### "Invalid or expired OTP"
- OTP codes expire after 60 seconds
- Request a new one

### "Failed to create account"
- Check browser console (F12) for errors
- Check Supabase logs
- Verify .env.local has correct credentials

### "Session not persisting"
- Check browser localStorage for `sb-*` keys
- Clear browser cache and try again
- Check that Supabase URL in .env.local is correct

### "RLS policy error"
- This means org_id is not in JWT
- Check that user_metadata contains org_id
- In Supabase SQL Editor run:
  ```sql
  SELECT raw_user_meta_data FROM auth.users;
  ```
- Should see: `{"org_id": "...", "role": "owner"}`

---

## 📊 What to Check in Logs

### Browser DevTools (F12)
- Network tab: API calls to `/api/auth/*`
- Console: No red errors
- Application > Local Storage: `sb-*` entries

### Supabase Dashboard
- **Authentication > Logs**: OTP and login events
- **Logs**: API requests
- **Table Editor**: Verify data was created

---

## 🎊 You're All Set!

If all tests pass, you have a fully functional authentication system with:
- ✅ Secure OTP authentication
- ✅ Single-business enforcement
- ✅ Row Level Security
- ✅ Staff invitations
- ✅ Role-based access

**Next step:** Start building M1 - Onboarding wizard!

