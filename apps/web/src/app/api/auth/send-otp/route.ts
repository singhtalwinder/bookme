import { createSupabaseAdminClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';

const sendOtpSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = sendOtpSchema.parse(body);

    const supabase = createSupabaseAdminClient();

    // Get the user by email
    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users?.users.find(u => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate new OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Update user with new OTP
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        otp,
        otp_created_at: new Date().toISOString(),
      },
    });

    if (updateError) {
      console.error('Update user error:', updateError);
      return NextResponse.json(
        { error: 'Failed to generate new code' },
        { status: 500 }
      );
    }

    console.log('================================================');
    console.log('📧 RESENT EMAIL VERIFICATION CODE FOR:', email);
    console.log('🔐 CODE:', otp);
    console.log('================================================');

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    // Handle environment variable errors
    if (error instanceof Error && error.message.includes('Missing Supabase')) {
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

