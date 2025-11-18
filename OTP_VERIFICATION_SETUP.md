# OTP Verification Setup

## ✅ What's Working Now

Your authentication system now uses **custom 6-digit OTP codes** for email verification!

### How It Works

1. **User Signs Up** (`/create-account`)
   - Enters email and password
   - Clicks "Create account"

2. **OTP Generated**
   - Server generates a random 6-digit code
   - Stores it in user's metadata in Supabase
   - **CODE IS PRINTED IN TERMINAL** (for development)

3. **User Enters Code**
   - Types the 6-digit code on OTP screen
   - Server verifies against stored metadata
   - Code expires after 5 minutes

4. **Redirect to Onboarding**
   - After successful verification
   - Completes business setup

## 🔍 For Development (Current Setup)

**To get your OTP code:**

1. Start the dev server: `pnpm dev`
2. Go to `/create-account` and sign up
3. Look in your **terminal** for:

```
================================================
📧 EMAIL VERIFICATION CODE FOR: your@email.com
🔐 CODE: 123456
================================================
```

4. Enter that code on the OTP screen

## 📧 For Production

You have several options to send real emails:

### Option 1: Supabase Custom SMTP (Recommended)

1. Go to Supabase Dashboard → Authentication → Email Templates
2. Configure Custom SMTP (Settings → Auth → SMTP Settings)
3. Add email provider (SendGrid, Mailgun, AWS SES, etc.)
4. Customize email template to include: `{{.Code}}`

### Option 2: Use a Service (Resend, SendGrid, Postmark)

Add an email service to `initiate-signup/route.ts`:

```typescript
// Add after generating OTP
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'noreply@yourdomain.com',
  to: email,
  subject: 'Your verification code',
  html: `
    <h1>Verify your email</h1>
    <p>Your verification code is: <strong>${otp}</strong></p>
    <p>This code expires in 5 minutes.</p>
  `,
});
```

### Option 3: Supabase Edge Functions

Create a Supabase Edge Function to send emails with your custom template.

## 🔐 Security Features

- ✅ **OTP expires after 5 minutes**
- ✅ **One-time use** (cleared after verification)
- ✅ **Stored securely** in user metadata
- ✅ **Cannot be accessed** by client-side code
- ✅ **Requires password** on signup

## 🧪 Testing Locally

1. **Start dev server:**
   ```bash
   cd /Users/talwindersingh/Bookme
   pnpm dev
   ```

2. **Create account:**
   - Go to `http://localhost:3000/create-account`
   - Enter email and password
   - Submit form

3. **Get OTP from terminal:**
   - Check terminal output
   - Copy the 6-digit code

4. **Verify:**
   - Enter code on OTP screen
   - Should redirect to `/onboarding`

## 🎯 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/initiate-signup` | POST | Create user, generate OTP |
| `/api/auth/verify-signup-otp` | POST | Verify OTP, set cookie |
| `/api/auth/send-otp` | POST | Resend OTP code |

## 📝 Files Modified

- ✅ `apps/web/src/middleware.ts` - Added `/api/auth` to public routes
- ✅ `apps/web/src/app/api/auth/initiate-signup/route.ts` - Generates custom OTP
- ✅ `apps/web/src/app/api/auth/verify-signup-otp/route.ts` - Verifies custom OTP
- ✅ `apps/web/src/app/api/auth/send-otp/route.ts` - Resends OTP

## 🚀 Next Steps

1. **For Production:**
   - Configure custom SMTP in Supabase
   - Or integrate email service (Resend/SendGrid)
   - Remove console.log statements

2. **Optional Enhancements:**
   - Rate limiting (prevent OTP spam)
   - SMS OTP option
   - Remember device feature
   - Email templates with branding

## 💡 Why This Approach?

Supabase's free tier `signInWithOtp()` sends magic links, not 6-digit codes. By generating our own codes and storing them in user metadata, we get:

- ✅ Better UX (type code vs click link)
- ✅ Works on same device
- ✅ Familiar 2FA experience
- ✅ Full control over expiry and validation
- ✅ No dependency on email delivery for the link

## 🐛 Troubleshooting

**"No verification code found"**
- OTP wasn't generated - check terminal logs
- Try clicking "Resend code"

**"Verification code expired"**
- OTPs expire after 5 minutes
- Click "Resend code" to get a new one

**"Invalid verification code"**
- Make sure you copied the full 6-digit code
- Check it's the most recent code (if you clicked resend)

---

**Ready to test?** Just run `pnpm dev` and check your terminal for the OTP codes! 🎉

