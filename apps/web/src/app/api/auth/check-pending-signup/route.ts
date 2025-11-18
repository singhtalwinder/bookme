import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const pendingSignupCookie = cookieStore.get('pending_signup');

    if (!pendingSignupCookie) {
      return NextResponse.json(
        { error: 'No pending signup found' },
        { status: 404 }
      );
    }

    const pendingSignup = JSON.parse(pendingSignupCookie.value);

    if (!pendingSignup.verified || !pendingSignup.email) {
      return NextResponse.json(
        { error: 'Invalid signup session' },
        { status: 400 }
      );
    }

    // Check if signup has expired (1 hour)
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    if (pendingSignup.timestamp < oneHourAgo) {
      // Clear expired cookie
      cookieStore.delete('pending_signup');
      return NextResponse.json(
        { error: 'Signup session expired. Please start over.' },
        { status: 410 }
      );
    }

    return NextResponse.json({
      email: pendingSignup.email,
      verified: true,
      isOAuth: pendingSignup.isOAuth || false,
      provider: pendingSignup.provider || 'email',
    });
  } catch (error) {
    console.error('Check pending signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
