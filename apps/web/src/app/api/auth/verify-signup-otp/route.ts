import { createAdminClient, createServerClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { cookies } from 'next/headers';

const verifySignupOtpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  token: z.string().length(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, token } = verifySignupOtpSchema.parse(body);

    const adminClient = createAdminClient();

    // Get the user by email
    const { data: users } = await adminClient.auth.admin.listUsers();
    const user = users?.users.find(u => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify against our custom OTP stored in user metadata
    const storedOtp = user.user_metadata?.otp;
    const otpCreatedAt = user.user_metadata?.otp_created_at;

    if (!storedOtp || !otpCreatedAt) {
      return NextResponse.json(
        { error: 'No verification code found. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if OTP is expired (5 minutes)
    const otpAge = Date.now() - new Date(otpCreatedAt).getTime();
    const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes

    if (otpAge > OTP_EXPIRY) {
      return NextResponse.json(
        { error: 'Verification code expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify the OTP matches
    if (storedOtp !== token) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    console.log('✅ OTP verified successfully for:', email);

    // Mark email as confirmed and clear OTP
    await adminClient.auth.admin.updateUserById(user.id, {
      email_confirm: true,
      user_metadata: {
        ...user.user_metadata,
        otp: undefined, // Clear the OTP
        otp_created_at: undefined,
        signup_in_progress: true, // Still in progress until onboarding completes
      },
    });

    // Store pending signup data in cookies (will be used in onboarding)
    const cookieStore = await cookies();
    const pendingSignup = {
      email,
      password,
      userId: user.id,
      verified: true,
      timestamp: Date.now(),
    };

    cookieStore.set('pending_signup', JSON.stringify(pendingSignup), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      verified: true,
    });
  } catch (error) {
    console.error('Verify signup OTP error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


