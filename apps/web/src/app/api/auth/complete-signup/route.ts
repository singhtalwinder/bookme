import { createAdminClient, createServerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { cookies } from 'next/headers';

const completeSignupSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  countryCode: z.string().min(1),
  phoneNumber: z.string().min(1),
  country: z.string().min(1),
  businessName: z.string().min(1),
  website: z.string().optional(),
  physicalAddress: z.string().optional(),
  teamSize: z.string().min(1),
  industries: z.array(z.string()).min(1),
  primaryIndustry: z.string().min(1),
  customIndustry: z.string().optional(),
  serviceLocations: z.array(z.string()).min(1),
  currentSoftware: z.string().min(1),
  referralSource: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = completeSignupSchema.parse(body);

    // Get pending signup from cookie
    const cookieStore = await cookies();
    const pendingSignupCookie = cookieStore.get('pending_signup');

    if (!pendingSignupCookie) {
      return NextResponse.json(
        { error: 'No pending signup found. Please start over.' },
        { status: 400 }
      );
    }

    const pendingSignup = JSON.parse(pendingSignupCookie.value);

    if (!pendingSignup.verified || !pendingSignup.email) {
      return NextResponse.json(
        { error: 'Invalid signup session' },
        { status: 400 }
      );
    }

    // For OAuth users, we need to get the user ID from the current session
    let userId = pendingSignup.userId;
    const isOAuth = pendingSignup.isOAuth || false;

    if (isOAuth) {
      const supabase = await createServerClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        return NextResponse.json(
          { error: 'OAuth session expired. Please sign in again.' },
          { status: 401 }
        );
      }
      
      userId = user.id;
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid signup session - missing user ID' },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Generate business handle from business name
    const businessHandle = data.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if handle is available (add random suffix if needed)
    let finalHandle = businessHandle;
    let suffix = 1;
    while (true) {
      const { data: existingOrg } = await adminClient
        .from('organizations')
        .select('id')
        .eq('handle', finalHandle)
        .single();

      if (!existingOrg) break;
      
      finalHandle = `${businessHandle}-${suffix}`;
      suffix++;
    }

    // Check if user already has an organization
    const { data: existingMembership } = await adminClient
      .from('memberships')
      .select('id, org_id')
      .eq('user_id', userId)
      .single();

    if (existingMembership) {
      return NextResponse.json(
        { error: 'User already has an organization' },
        { status: 400 }
      );
    }

    // Determine timezone and currency from country
    const timezoneMap: Record<string, string> = {
      'United States': 'America/New_York',
      'Canada': 'America/Toronto',
      'United Kingdom': 'Europe/London',
      'Australia': 'Australia/Sydney',
      'Hong Kong': 'Asia/Hong_Kong',
      'Singapore': 'Asia/Singapore',
    };

    const currencyMap: Record<string, string> = {
      'United States': 'USD',
      'Canada': 'CAD',
      'United Kingdom': 'GBP',
      'Australia': 'AUD',
      'Hong Kong': 'HKD',
      'Singapore': 'SGD',
    };

    const timezone = timezoneMap[data.country] || 'UTC';
    const currency = currencyMap[data.country] || 'USD';

    // Create organization with all onboarding data
    const { data: orgData, error: orgError } = await adminClient
      .from('organizations')
      .insert({
        name: data.businessName,
        handle: finalHandle,
        timezone,
        currency,
        phone: `${data.countryCode}${data.phoneNumber}`,
        address: data.physicalAddress || null,
        metadata: {
          website: data.website,
          teamSize: data.teamSize,
          industries: data.industries,
          primaryIndustry: data.primaryIndustry,
          customIndustry: data.customIndustry,
          serviceLocations: data.serviceLocations,
          currentSoftware: data.currentSoftware,
          referralSource: data.referralSource,
        },
      })
      .select()
      .single();

    if (orgError || !orgData) {
      console.error('Org creation error:', orgError);
      return NextResponse.json(
        { error: 'Failed to create business' },
        { status: 500 }
      );
    }

    // For OAuth users, user profile should already exist from the trigger
    // For email users, create the user profile
    if (!isOAuth) {
      const { error: userError } = await adminClient
        .from('users')
        .insert({
          id: userId,
          email: pendingSignup.email,
          name: `${data.firstName} ${data.lastName}`,
          auth_provider: 'email',
          metadata: {
            firstName: data.firstName,
            lastName: data.lastName,
            countryCode: data.countryCode,
            phoneNumber: data.phoneNumber,
            country: data.country,
          },
        });

      if (userError) {
        console.error('User profile creation error:', userError);
        // Cleanup
        await adminClient.from('organizations').delete().eq('id', orgData.id);
        return NextResponse.json(
          { error: 'Failed to create user profile' },
          { status: 500 }
        );
      }
    } else {
      // Update OAuth user profile with additional info
      const { error: updateError } = await adminClient
        .from('users')
        .update({
          name: `${data.firstName} ${data.lastName}`,
          metadata: {
            firstName: data.firstName,
            lastName: data.lastName,
            countryCode: data.countryCode,
            phoneNumber: data.phoneNumber,
            country: data.country,
          },
        })
        .eq('id', userId);

      if (updateError) {
        console.error('User profile update error:', updateError);
        // Continue anyway, this is not critical
      }
    }

    // Create membership (owner role)
    const { error: membershipError } = await adminClient
      .from('memberships')
      .insert({
        user_id: userId,
        org_id: orgData.id,
        role: 'owner',
      });

    if (membershipError) {
      console.error('Membership creation error:', membershipError);
      // Cleanup
      await adminClient.from('organizations').delete().eq('id', orgData.id);
      return NextResponse.json(
        { error: 'Failed to create membership' },
        { status: 500 }
      );
    }

    // Update user metadata with org_id and role for JWT claims
    await adminClient.auth.admin.updateUserById(userId, {
      user_metadata: {
        name: `${data.firstName} ${data.lastName}`,
        org_id: orgData.id,
        role: 'owner',
        signup_complete: true,
      },
    });

    // For email users, sign them in
    // For OAuth users, they're already signed in
    if (!isOAuth && pendingSignup.password) {
      const supabase = await createServerClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: pendingSignup.email,
        password: pendingSignup.password,
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        // User is created but couldn't sign in automatically
        // They can still login manually
      }
    }

    // Clear the pending signup cookie
    cookieStore.delete('pending_signup');

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      userId: userId,
      orgId: orgData.id,
    });
  } catch (error) {
    console.error('Complete signup error:', error);
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


