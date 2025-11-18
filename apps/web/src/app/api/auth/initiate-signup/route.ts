import { createAdminClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';

const initiateSignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    console.log('=== Initiate Signup API Called ===');
    
    const body = await request.json();
    console.log('Request body received:', { email: body.email, hasPassword: !!body.password });
    
    const { email, password } = initiateSignupSchema.parse(body);
    console.log('Schema validation passed');

    console.log('Creating admin client...');
    const supabase = createAdminClient();
    console.log('Admin client created successfully');

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Check if email exists in auth.users (someone may have started signup before)
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const existingAuthUser = authUsers?.users.find(u => u.email === email);

    if (existingAuthUser) {
      // If user exists in auth but not in our users table, they never completed signup
      // Let's delete the old auth user and start fresh
      await supabase.auth.admin.deleteUser(existingAuthUser.id);
    }

    // Generate a random 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // Store OTP in user metadata temporarily
    // We'll create the user with email_confirm: false
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // User must verify via OTP
      user_metadata: {
        otp,
        otp_created_at: new Date().toISOString(),
        signup_in_progress: true,
      },
    });

    if (authError || !authData.user) {
      console.error('Auth creation error:', authError);
      return NextResponse.json(
        { error: 'Failed to initiate signup' },
        { status: 500 }
      );
    }

    // Generate and store OTP in user metadata
    const { error: updateError } = await supabase.auth.admin.updateUserById(authData.user.id, {
      user_metadata: {
        otp,
        otp_created_at: new Date().toISOString(),
        signup_in_progress: true,
      },
    });

    if (updateError) {
      console.error('Update user error:', updateError);
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Failed to initiate signup' },
        { status: 500 }
      );
    }

    console.log('================================================');
    console.log('📧 EMAIL VERIFICATION CODE FOR:', email);
    console.log('🔐 CODE:', otp);
    console.log('================================================');
    console.log('⚠️  For production, configure custom SMTP in Supabase');
    console.log('================================================');

    // TODO: For production, send email via custom SMTP or service
    // For now, the OTP is logged to console (dev mode)
    // In production, you'll want to:
    // 1. Configure custom SMTP in Supabase dashboard
    // 2. Or use a service like Resend, SendGrid, or Postmark
    // 3. Or customize Supabase email templates to include the code

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
    });
  } catch (error) {
    console.error('=== Initiate signup error ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}


