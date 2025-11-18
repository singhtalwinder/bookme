import { createSupabaseAdminClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const acceptInviteSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
  name: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password, name } = acceptInviteSchema.parse(body);

    const supabase = createSupabaseAdminClient();

    // Get invite
    const { data: invite, error: inviteError } = await supabase
      .from('invites')
      .select('*')
      .eq('token', token)
      .is('accepted_at', null)
      .single();

    if (inviteError || !invite) {
      return NextResponse.json(
        { error: 'Invalid or expired invite' },
        { status: 400 }
      );
    }

    // Check expiry
    if (new Date(invite.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Invite has expired' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', invite.email)
      .single();

    if (existingUser) {
      // Check if they're already in an org
      const { data: existingMembership } = await supabase
        .from('memberships')
        .select('org_id')
        .eq('user_id', existingUser.id)
        .single();

      if (existingMembership) {
        return NextResponse.json(
          { error: 'You already belong to an organization' },
          { status: 400 }
        );
      }
    }

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      // Update user profile
      await supabase
        .from('users')
        .update({ name })
        .eq('id', userId);
    } else {
      // Create new auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: invite.email,
        password,
        email_confirm: false,
        user_metadata: { name },
      });

      if (authError || !authData.user) {
        console.error('Auth creation error:', authError);
        return NextResponse.json(
          { error: 'Failed to create account' },
          { status: 500 }
        );
      }

      userId = authData.user.id;

      // Create user profile
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: invite.email,
          name,
        });

      if (userError) {
        console.error('User profile creation error:', userError);
        await supabase.auth.admin.deleteUser(userId);
        return NextResponse.json(
          { error: 'Failed to create user profile' },
          { status: 500 }
        );
      }
    }

    // Create membership
    const { error: membershipError } = await supabase
      .from('memberships')
      .insert({
        user_id: userId,
        org_id: invite.org_id,
        role: invite.role,
      });

    if (membershipError) {
      console.error('Membership creation error:', membershipError);
      if (!existingUser) {
        await supabase.auth.admin.deleteUser(userId);
      }
      return NextResponse.json(
        { error: 'Failed to create membership' },
        { status: 500 }
      );
    }

    // Update user metadata with org_id for JWT claims
    await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        name,
        org_id: invite.org_id,
        role: invite.role,
      },
    });

    // Mark invite as accepted
    await supabase
      .from('invites')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invite.id);

    // Send OTP for verification
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: invite.email,
    });

    if (otpError) {
      console.error('OTP send error:', otpError);
    }

    return NextResponse.json({
      success: true,
      message: 'Invite accepted. Please check your email for verification code.',
      email: invite.email,
    });
  } catch (error) {
    console.error('Accept invite error:', error);
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

