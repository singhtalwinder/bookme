import { createAdminClient, createServerClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const verifyOtpSchema = z.object({
  email: z.string().email(),
  token: z.string().length(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, token } = verifyOtpSchema.parse(body);

    const supabase = await createServerClient();
    const adminClient = createAdminClient();

    // Verify OTP - this will create a session automatically
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error || !data.user) {
      console.error('OTP verification error:', error);
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Get user's membership and org info
    const { data: membership, error: membershipError } = await adminClient
      .from('memberships')
      .select('org_id, role')
      .eq('user_id', data.user.id)
      .single();

    if (membershipError || !membership) {
      console.error('Membership fetch error:', membershipError);
      return NextResponse.json(
        { error: 'User membership not found' },
        { status: 400 }
      );
    }

    // Update user metadata with org_id and role for JWT claims
    // This ensures the JWT tokens have the right claims
    await adminClient.auth.admin.updateUserById(data.user.id, {
      user_metadata: {
        ...data.user.user_metadata,
        org_id: membership.org_id,
        role: membership.role,
      },
    });

    // Refresh the session to get updated metadata in JWT
    await supabase.auth.refreshSession();

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        org_id: membership.org_id,
        role: membership.role,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
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


