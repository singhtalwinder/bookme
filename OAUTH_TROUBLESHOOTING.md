# OAuth "Pretty Print" Issue - Troubleshooting Guide

## Issue
Clicking "Login with Google" shows a blank page with "pretty print" text.

## Most Likely Cause
The OAuth provider (Google or Facebook) is **not configured** in your Supabase project yet.

## Quick Fix

### Step 1: Check if OAuth is Enabled in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Check if **Google** is enabled (should have a green toggle)

If Google is **not enabled** or shows **disabled**, that's your issue!

### Step 2: Enable and Configure Google OAuth

You need to complete the OAuth setup from the documentation. Here's the quick version:

#### A. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or select existing)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add Authorized redirect URI:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
   Replace `YOUR_PROJECT_REF` with your actual Supabase project reference
   - Find this in Supabase Dashboard → **Settings** → **API** → **Project URL**
   - Example: If your URL is `https://abcdefgh.supabase.co`, then use:
     ```
     https://abcdefgh.supabase.co/auth/v1/callback
     ```

7. Copy the **Client ID** and **Client Secret**

#### B. Configure in Supabase

1. Back in Supabase Dashboard → **Authentication** → **Providers**
2. Click on **Google**
3. Toggle **Enable** to ON
4. Paste your **Client ID**
5. Paste your **Client Secret**
6. Click **Save**

### Step 3: Test Again

1. Refresh your app
2. Click "Login with Google"
3. You should now be redirected to Google's login page

## Other Possible Issues

### Issue: Redirect URI Mismatch

**Error Message**: "redirect_uri_mismatch" or similar

**Solution**: Make sure the redirect URI in Google Cloud Console **exactly matches** the one from Supabase:
```
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

### Issue: OAuth App Not Public (Facebook only)

**Error Message**: "App Not Setup" or "This app is in Development Mode"

**Solution**: 
1. Go to Facebook Developer Console
2. Switch your app from "Development" to "Live" mode

### Issue: Missing Supabase Environment Variables

**Check your `.env.local` file** has:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these in Supabase Dashboard → **Settings** → **API**

## Debugging Steps

### 1. Check Browser Console

Open browser DevTools (F12) and check the Console tab for errors:
- Look for network errors
- Look for JavaScript errors
- Check if the OAuth URL is being generated correctly

### 2. Check Network Tab

In DevTools → Network tab:
- Click "Login with Google"
- Look for the request to `signInWithOAuth`
- Check if there's a redirect happening
- Look for any error responses

### 3. Check What URL is Generated

Add this temporary debug code to see what URL is being generated:

In `login/page.tsx`, modify the `handleSocialLogin` function:

```typescript
const handleSocialLogin = async (provider: 'google' | 'facebook') => {
  try {
    const { createClient } = await import('@/lib/supabase-client');
    const supabase = createClient();

    console.log('Attempting OAuth with provider:', provider);
    console.log('Redirect URL will be:', `${window.location.origin}/auth/callback`);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    console.log('OAuth response:', { data, error });

    if (error) {
      console.error('OAuth error:', error);
      setError(error.message);
    }
  } catch (err) {
    console.error('Exception during OAuth:', err);
    setError(err instanceof Error ? err.message : 'An error occurred');
  }
};
```

Then check the browser console after clicking the button.

### 4. Verify Supabase Configuration

Check your Supabase Auth settings:

1. Supabase Dashboard → **Authentication** → **URL Configuration**
2. **Site URL** should be:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
3. **Redirect URLs** should include:
   ```
   http://localhost:3000/auth/callback
   ```

## Expected Flow

When properly configured, clicking "Login with Google" should:

1. ✅ Generate an OAuth URL
2. ✅ Redirect you to Google's login page
3. ✅ After login, redirect back to `/auth/callback`
4. ✅ Then redirect to either `/signup` (new user) or `/dashboard` (existing user)

## Still Not Working?

### Check Supabase Logs

1. Supabase Dashboard → **Logs**
2. Select **Auth Logs**
3. Click "Login with Google"
4. Check if any errors appear in the logs

### Common Error Messages

- **"Provider not enabled"** → Enable Google in Providers settings
- **"Invalid redirect URI"** → Check redirect URI matches exactly
- **"Invalid client"** → Check Client ID and Secret are correct
- **"Access denied"** → OAuth app needs approval or is in wrong mode

## Need More Help?

If you're still seeing issues, please share:
1. What you see in the browser console (F12 → Console)
2. What you see in the Network tab when clicking the button
3. Screenshot of your Supabase Providers page showing Google's status
4. The Supabase project URL (without sensitive keys)

---

**Most Common Fix**: Enable Google OAuth in Supabase Dashboard → Authentication → Providers

See the full setup guide in: `/SOCIAL_LOGIN_SETUP.md`

