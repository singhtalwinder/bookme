import { createServerClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * OAuth Callback Handler
 * 
 * This route handles the OAuth redirect from Supabase after social login.
 * It determines if the user is new or existing and redirects accordingly:
 * - New users (no organization): Redirect to /signup (onboarding)
 * - Existing users (has organization): Redirect to /dashboard
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(errorDescription || 'Authentication failed')}`,
        requestUrl.origin
      )
    );
  }

  // No code means invalid callback
  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=Invalid authentication code', requestUrl.origin)
    );
  }

  try {
    const supabase = await createServerClient();

    // Exchange the code for a session
    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error('Session exchange error:', sessionError);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(sessionError.message)}`, requestUrl.origin)
      );
    }

    if (!sessionData?.user) {
      return NextResponse.redirect(
        new URL('/login?error=Authentication failed', requestUrl.origin)
      );
    }

    const user = sessionData.user;

    // Check if user has an organization membership
    const { data: membership, error: membershipError } = await supabase
      .from('memberships')
      .select('id, org_id')
      .eq('user_id', user.id)
      .single();

    if (membershipError && membershipError.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" which is fine for new users
      console.error('Membership check error:', membershipError);
    }

    // If user has a membership, they're an existing user - go to dashboard
    if (membership) {
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
    }

    // New user - needs to complete onboarding
    // Create a pending signup session cookie so they can access /signup
    const cookieStore = await cookies();
    
    // Store verified OAuth user info in a secure cookie
    const pendingSignup = {
      email: user.email!,
      verified: true,
      isOAuth: true,
      provider: user.app_metadata?.provider || 'unknown',
      timestamp: Date.now(),
    };

    cookieStore.set('pending_signup', JSON.stringify(pendingSignup), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    // Redirect to onboarding
    return NextResponse.redirect(new URL('/signup', requestUrl.origin));
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent('An unexpected error occurred')}`,
        requestUrl.origin
      )
    );
  }
}

