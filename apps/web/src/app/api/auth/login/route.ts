import { createAdminClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const supabase = createAdminClient();

    // Verify password with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      console.error('Login error:', authError);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Password is correct, now send OTP for second factor
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });

    // Sign out the password session since we require OTP
    await supabase.auth.signOut();

    if (otpError) {
      console.error('OTP send error:', otpError);
      return NextResponse.json(
        { error: 'Failed to send verification code' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
      requiresOtp: true,
    });
  } catch (error) {
    console.error('Login error:', error);
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


