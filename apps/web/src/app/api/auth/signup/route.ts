import { createSupabaseAdminClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  businessName: z.string().min(1),
  businessHandle: z.string().min(3).regex(/^[a-z0-9-]+$/),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = signupSchema.parse(body);

    const supabase = createSupabaseAdminClient();

    // 1. Check if handle is available
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('id')
      .eq('handle', data.businessHandle)
      .single();

    if (existingOrg) {
      return NextResponse.json(
        { error: 'Business handle already taken' },
        { status: 400 }
      );
    }

    // 2. Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', data.email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // 3. Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: false, // We'll use OTP for verification
      user_metadata: {
        name: data.name,
      },
    });

    if (authError || !authData.user) {
      console.error('Auth creation error:', authError);
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }

    // 4. Create organization
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: data.businessName,
        handle: data.businessHandle,
        timezone: 'Asia/Hong_Kong',
        currency: 'HKD',
      })
      .select()
      .single();

    if (orgError || !orgData) {
      console.error('Org creation error:', orgError);
      // Cleanup: delete auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Failed to create business' },
        { status: 500 }
      );
    }

    // 5. Create user profile
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: data.email,
        name: data.name,
      });

    if (userError) {
      console.error('User profile creation error:', userError);
      // Cleanup
      await supabase.auth.admin.deleteUser(authData.user.id);
      await supabase.from('organizations').delete().eq('id', orgData.id);
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      );
    }

    // 6. Create membership (owner role)
    const { error: membershipError } = await supabase
      .from('memberships')
      .insert({
        user_id: authData.user.id,
        org_id: orgData.id,
        role: 'owner',
      });

    if (membershipError) {
      console.error('Membership creation error:', membershipError);
      // Cleanup
      await supabase.auth.admin.deleteUser(authData.user.id);
      await supabase.from('organizations').delete().eq('id', orgData.id);
      return NextResponse.json(
        { error: 'Failed to create membership' },
        { status: 500 }
      );
    }

    // 7. Update user metadata with org_id for JWT claims
    await supabase.auth.admin.updateUserById(authData.user.id, {
      user_metadata: {
        name: data.name,
        org_id: orgData.id,
        role: 'owner',
      },
    });

    // 8. Send OTP for verification
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: data.email,
    });

    if (otpError) {
      console.error('OTP send error:', otpError);
      // User is created, they can request OTP later
    }

    return NextResponse.json({
      success: true,
      message: 'Account created. Please check your email for verification code.',
      userId: authData.user.id,
      orgId: orgData.id,
    });
  } catch (error) {
    console.error('Signup error:', error);
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

