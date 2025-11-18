import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-6 py-16">
      <div className="fixed left-6 top-6 z-50">
        <Logo size="xs" showText href="/" />
      </div>
      <div className="fixed right-6 top-6 z-50">
        <ThemeToggle />
      </div>
      
      <div className="flex w-full max-w-3xl flex-col items-center gap-10 text-center">
        <div className="space-y-6">
          <Logo size="lg" showText={false} className="mx-auto" href={undefined} />
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            BookMe
          </h1>
          <p className="text-xl font-semibold text-muted-foreground">
            Multi-tenant SaaS booking platform
          </p>
          <p className="text-base text-muted-foreground sm:text-lg">
            Explore the live shadcn/ui component playground and confirm your client-side
            runtime with the simple test page.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/create-account"
            className="inline-flex items-center rounded-md bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center rounded-md border border-input bg-background px-8 py-4 text-base font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
          >
            Sign In
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 border-t pt-6">
          <Link
            href="/logo-demo"
            className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Logo Showcase
          </Link>
          <Link
            href="/bubble-demo"
            className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Bubble Background
          </Link>
          <Link
            href="/test-components"
            className="inline-flex items-center rounded-md border border-input bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
          >
            Component playground
          </Link>
          <Link
            href="/test-simple"
            className="inline-flex items-center rounded-md border border-input bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
          >
            Simple test
          </Link>
        </div>

        <div className="w-full rounded-2xl border bg-card p-6 text-left shadow-sm">
          <h2 className="text-sm font-semibold text-muted-foreground">
            What&apos;s ready today
          </h2>
          <ul className="mt-4 grid gap-3 text-sm text-foreground sm:grid-cols-2">
            <li className="rounded-xl bg-muted/40 p-3">✅ pnpm monorepo setup</li>
            <li className="rounded-xl bg-muted/40 p-3">✅ Next.js 15 App Router</li>
            <li className="rounded-xl bg-muted/40 p-3">✅ Supabase client wiring</li>
            <li className="rounded-xl bg-muted/40 p-3">✅ shadcn/ui design system</li>
            <li className="rounded-xl bg-muted/40 p-3">✅ TypeScript + ESLint</li>
            <li className="rounded-xl bg-muted/40 p-3">✅ Tailwind CSS configuration</li>
            <li className="rounded-xl bg-muted/40 p-3">✅ BookMe logo & branding</li>
            <li className="rounded-xl bg-muted/40 p-3">✅ PWA configuration</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
