import { createServerClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from 'ui';

export default async function DashboardPage() {
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Get user profile and organization
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  const { data: membership } = await supabase
    .from('memberships')
    .select(`
      role,
      organizations (
        id,
        name,
        handle,
        timezone
      )
    `)
    .eq('user_id', session.user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo size="sm" showText href="/dashboard" />
            <nav className="hidden md:flex md:gap-6">
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                Dashboard
              </Link>
              <Link
                href="/calendar"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Calendar
              </Link>
              <Link
                href="/clients"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Clients
              </Link>
              <Link
                href="/services"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Services
              </Link>
              <Link
                href="/team"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Team
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <form action="/api/auth/logout" method="POST">
              <Button type="submit" variant="outline" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-display-sm font-semibold text-gray-900 dark:text-white">
            Welcome back, {user?.name || 'there'}!
          </h1>
          <p className="mt-2 text-md text-gray-600 dark:text-gray-400">
            {membership?.organizations?.name || 'Your business'} • {membership?.role}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Get Started</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Complete your setup to start accepting bookings
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  1
                </div>
                <span className="text-sm text-gray-900 dark:text-white">Complete onboarding wizard</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  2
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Add services</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  3
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Invite team members</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  4
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Share booking page</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Booking Page</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Share this link with your clients
              </p>
            </div>
            <div className="space-y-4">
                <div className="flex items-center gap-2 rounded-md bg-muted p-3">
                  <code className="flex-1 text-sm">
                    bookme.app/{membership?.organizations?.handle || 'your-handle'}
                  </code>
                  <Button variant="ghost" size="sm">
                    Copy
                  </Button>
                </div>
                <Button className="w-full" variant="outline" asChild>
                  <Link href={`/book/${membership?.organizations?.handle}`} target="_blank">
                    Preview
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Stats</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Your business at a glance
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Bookings today</p>
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Total clients</p>
              </div>
              <div>
                <p className="text-2xl font-bold">HKD 0</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Revenue this month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Next Steps</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800/50">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Set up services</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Add the services you offer and their pricing
              </p>
            </div>

            <div className="cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800/50">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Invite team members</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Add staff members to manage bookings
              </p>
            </div>

            <div className="cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800/50">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Configure working hours</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Set your availability for bookings
              </p>
            </div>

            <div className="cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800/50">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Connect calendar</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Sync with Google or Microsoft Calendar
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

