import { createSupabaseAdminClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { randomBytes } from 'crypto';

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'staff', 'receptionist', 'viewer']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, role } = inviteSchema.parse(body);

    const supabase = createSupabaseAdminClient();

    // Get current user from session (we'll need to handle this in client-side)
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's membership
    const { data: membership, error: membershipError } = await supabase
      .from('memberships')
      .select('org_id, role')
      .eq('user_id', user.id)
      .single();

    if (membershipError || !membership || !['owner', 'admin'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Check if user already exists in system
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
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
          { error: 'User already belongs to an organization' },
          { status: 400 }
        );
      }
    }

    // Generate invite token
    const inviteToken = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    // Create invite
    const { data: invite, error: inviteError } = await supabase
      .from('invites')
      .insert({
        org_id: membership.org_id,
        email,
        role,
        invited_by_user_id: user.id,
        token: inviteToken,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (inviteError || !invite) {
      console.error('Invite creation error:', inviteError);
      return NextResponse.json(
        { error: 'Failed to create invite' },
        { status: 500 }
      );
    }

    // TODO: Send invite email with token
    // For now, return the token (in production, this would be emailed)

    return NextResponse.json({
      success: true,
      message: 'Invite sent successfully',
      inviteToken, // Remove this in production
      inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL}/accept-invite?token=${inviteToken}`,
    });
  } catch (error) {
    console.error('Invite error:', error);
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

