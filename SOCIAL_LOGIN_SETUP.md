# Social Login Setup Guide

This guide will walk you through setting up Google and Facebook OAuth authentication for your BookMe application using Supabase.

## Prerequisites

- A Supabase project (you're using Supabase Cloud)
- Access to Google Cloud Console (for Google OAuth)
- Access to Facebook for Developers (for Facebook OAuth)

## Database Setup

### 1. Apply Database Migration

The OAuth support migration has already been created. You need to apply it to your Supabase database:

**Option A: Using Supabase Dashboard**
1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `/packages/db/supabase/migrations/003_add_oauth_support.sql`
4. Paste and run the SQL in the editor

**Option B: Using Supabase CLI**
```bash
cd packages/db
supabase db push
```

This migration adds:
- `auth_provider` field to track login method (email, google, facebook)
- `provider_user_id` for external OAuth IDs
- Database trigger that auto-creates user profiles for OAuth signups

## Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Add a name (e.g., "BookMe App")

5. Configure Authorized redirect URIs:
   - Add: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Replace `YOUR_PROJECT_REF` with your actual Supabase project reference
   - You can find this in your Supabase Dashboard under Settings > API

6. Click "Create"
7. Copy your **Client ID** and **Client Secret**

### Step 2: Configure Google OAuth in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **Google** in the list and click to enable it
4. Enter your Google OAuth credentials:
   - **Client ID**: Paste the Client ID from Google
   - **Client Secret**: Paste the Client Secret from Google
5. Click **Save**

## Facebook OAuth Setup

### Step 1: Create Facebook App

1. Go to [Facebook for Developers](https://developers.facebook.com/)
2. Click "My Apps" > "Create App"
3. Select "Consumer" as the app type
4. Fill in your app details:
   - **App Name**: BookMe (or your app name)
   - **App Contact Email**: Your email
5. Click "Create App"

### Step 2: Configure Facebook Login

1. In your Facebook App Dashboard, click "Add Product"
2. Find "Facebook Login" and click "Set Up"
3. Select "Web" as the platform
4. For "Site URL", enter your app's URL (can update later)

5. Configure OAuth settings:
   - Go to "Facebook Login" > "Settings" in the left sidebar
   - Under "Valid OAuth Redirect URIs", add:
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     ```
   - Replace `YOUR_PROJECT_REF` with your actual Supabase project reference
   - Click "Save Changes"

6. Get your credentials:
   - Go to "Settings" > "Basic" in the left sidebar
   - Copy your **App ID**
   - Copy your **App Secret** (click "Show" to reveal it)

### Step 3: Make App Public (Important!)

1. In your Facebook App Dashboard, go to "App Mode" at the top
2. Switch from "Development" to "Live" mode
3. This is required for users outside of your developer account to log in

### Step 4: Configure Facebook OAuth in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **Facebook** in the list and click to enable it
4. Enter your Facebook OAuth credentials:
   - **Facebook client ID**: Paste your App ID
   - **Facebook client secret**: Paste your App Secret
5. Click **Save**

## Supabase Auth Configuration

### Update Site URL and Redirect URLs

1. In your Supabase Dashboard, go to **Authentication** > **URL Configuration**
2. Set your **Site URL**:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
3. Add **Redirect URLs** (comma-separated):
   ```
   http://localhost:3000/auth/callback,
   https://yourdomain.com/auth/callback
   ```

## Testing Your Setup

### Test Google Login

1. Go to your app's login page (`/login` or `/create-account`)
2. Click the "Google" button
3. You should be redirected to Google's login page
4. After successful login, you should be redirected back to your app
5. New users should be taken to the onboarding flow (`/signup`)
6. Existing users should go directly to the dashboard

### Test Facebook Login

1. Go to your app's login page (`/login` or `/create-account`)
2. Click the "Facebook" button
3. You should be redirected to Facebook's login page
4. After successful login, you should be redirected back to your app
5. New users should be taken to the onboarding flow (`/signup`)
6. Existing users should go directly to the dashboard

## How It Works

### Authentication Flow

1. **User clicks social login button**
   - Triggers `supabase.auth.signInWithOAuth()`
   - User is redirected to OAuth provider (Google or Facebook)

2. **User authenticates with provider**
   - OAuth provider redirects back to Supabase callback URL
   - Supabase creates/updates the user in `auth.users` table

3. **Database trigger executes**
   - Automatically creates user profile in `users` table
   - Populates name, email, avatar from OAuth data
   - Sets `auth_provider` field

4. **OAuth callback handler (`/auth/callback`)**
   - Checks if user has an organization membership
   - **New users** (no membership): Redirected to `/signup` for onboarding
   - **Existing users** (has membership): Redirected to `/dashboard`

5. **Onboarding completion** (for new users)
   - User completes business information in `/signup`
   - Organization and membership are created
   - User is redirected to `/dashboard`

### Data Flow

```
OAuth Provider (Google/Facebook)
    ↓
Supabase Auth (creates auth.users entry)
    ↓
Database Trigger (creates users table entry)
    ↓
/auth/callback Route (checks membership)
    ↓
/signup (new users) OR /dashboard (existing users)
```

## Troubleshooting

### "Invalid OAuth redirect URI" Error

- **Cause**: The redirect URI in Supabase doesn't match what's configured in Google/Facebook
- **Solution**: Double-check that the redirect URI is exactly:
  ```
  https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
  ```

### "Access Denied" or "App Not Public" Error (Facebook)

- **Cause**: Facebook app is still in development mode
- **Solution**: Switch your Facebook app to "Live" mode in the app dashboard

### OAuth Login Works But Redirects to Wrong Page

- **Cause**: Middleware or callback logic issue
- **Solution**: Check browser console and server logs for errors

### User Profile Not Created

- **Cause**: Database trigger not firing or error in trigger
- **Solution**: 
  1. Check that migration 003 was applied successfully
  2. Look for errors in Supabase logs (Dashboard > Logs)
  3. Manually check if trigger exists:
     ```sql
     SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
     ```

### OAuth Works in Development But Not Production

- **Cause**: Site URL and redirect URLs not configured for production
- **Solution**: 
  1. Update Site URL in Supabase to your production domain
  2. Add production redirect URL to allowed list
  3. Update OAuth provider settings with production URL

## Security Notes

1. **Never commit OAuth secrets**: Keep your Client ID and Client Secret secure. Don't commit them to version control.

2. **Use environment variables**: Store sensitive credentials in environment variables (already handled by Supabase)

3. **Validate redirect URIs**: Only whitelist the specific callback URLs you need

4. **HTTPS in production**: Always use HTTPS for your production site URL

5. **Review OAuth scopes**: Only request the minimum scopes needed (email, profile)

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)

## Support

If you encounter issues:
1. Check Supabase Dashboard > Logs for error messages
2. Check browser console for client-side errors
3. Verify all redirect URIs are correct
4. Ensure OAuth apps are in "Live" mode (especially Facebook)

