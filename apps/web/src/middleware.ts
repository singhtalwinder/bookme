import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: req,
  });

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Skip auth checks if Supabase is not configured (dev mode)
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase not configured - skipping auth middleware');
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              req.cookies.set(name, value);
            });
            supabaseResponse = NextResponse.next({
              request: req,
            });
            cookiesToSet.forEach(({ name, value, options }) => {
              supabaseResponse.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // Refresh session if expired - required for Server Components
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Public routes that don't require authentication
    const publicRoutes = [
      '/login',
      '/signup', // Updated from /onboarding - this is where OAuth users go for onboarding
      '/create-account',
      '/verify-otp',
      '/verify-email',
      '/forgot-password',
      '/accept-invite',
      '/auth/callback', // OAuth callback route
      '/api/auth', // All auth API routes
      '/api/test-supabase', // Test endpoint
      '/test-components',
      '/test-simple',
      '/logo-demo',
      '/form-demo',
      '/validation-modes-demo',
      '/before-after-validation',
      '/alert-demo',
      '/bubble-demo',
      '/login-page-01',
    ];
    const isPublicRoute =
      publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route)) ||
      req.nextUrl.pathname.startsWith('/book/') ||
      req.nextUrl.pathname === '/';

    // Redirect to login if not authenticated and trying to access protected route
    if (!session && !isPublicRoute) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect to dashboard if authenticated and trying to access auth pages (except signup and accept-invite)
    const authPages = ['/login', '/create-account'];
    if (session && authPages.some((route) => req.nextUrl.pathname.startsWith(route))) {
      // Check if user has completed onboarding (has org_id or membership)
      const hasOrgId = session.user.user_metadata?.org_id;
      
      if (hasOrgId) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      
      // If no org_id, user needs to complete onboarding - redirect to signup
      // (This handles OAuth users who authenticated but didn't complete onboarding)
      if (!req.nextUrl.pathname.startsWith('/signup')) {
        return NextResponse.redirect(new URL('/signup', req.url));
      }
    }

    // For authenticated users accessing /signup, check if they need to be there
    if (session && req.nextUrl.pathname.startsWith('/signup')) {
      const hasOrgId = session.user.user_metadata?.org_id;
      
      // If they have an org_id, they've already completed onboarding
      if (hasOrgId) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      // Otherwise, let them access /signup to complete onboarding
    }

    // Inject org_id from JWT claims into request headers for RLS
    if (session?.user) {
      const orgId = session.user.user_metadata?.org_id;
      const role = session.user.user_metadata?.role;
      
      if (orgId) {
        supabaseResponse.headers.set('x-org-id', orgId);
      }
      if (role) {
        supabaseResponse.headers.set('x-user-role', role);
      }
      supabaseResponse.headers.set('x-user-id', session.user.id);
    }

    return supabaseResponse;
  } catch (error) {
    console.error('Middleware error:', error);
    // In case of error, allow the request to proceed
    return supabaseResponse;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logos (logo files)
     * - icons (icon files)
     * - *.png, *.jpg, *.jpeg, *.svg, *.ico (image files)
     * - manifest.json (PWA manifest)
     */
    '/((?!_next/static|_next/image|favicon.ico|logos|icons|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.ico$|manifest.json).*)',
  ],
};

