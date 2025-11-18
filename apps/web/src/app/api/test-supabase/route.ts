import { createAdminClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Testing Supabase connection...');
    
    // Check environment variables
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('Environment variables:', { hasUrl, hasAnonKey, hasServiceKey });
    
    if (!hasUrl || !hasAnonKey || !hasServiceKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        details: { hasUrl, hasAnonKey, hasServiceKey }
      });
    }
    
    // Try to create admin client
    const supabase = createAdminClient();
    console.log('Admin client created');
    
    // Try a simple query
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Query error:', error);
      return NextResponse.json({
        success: false,
        error: 'Database query failed',
        details: error.message
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection working!',
      userCount: data?.length || 0
    });
    
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Exception thrown',
      message: error instanceof Error ? error.message : String(error)
    });
  }
}

