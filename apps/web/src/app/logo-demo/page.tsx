import { Logo, LogoIcon, LogoFull, LogoNav } from '@/components/logo';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LogoDemoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/40 p-8">
      <div className="fixed left-6 top-6 z-50">
        <Logo size="xs" showText href="/" />
      </div>
      <div className="fixed right-6 top-6 z-50">
        <ThemeToggle />
      </div>
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">BookMe Logo Showcase</h1>
          <p className="text-lg text-muted-foreground">
            All logo variants and sizes available in the design system
          </p>
          <Link 
            href="/"
            className="inline-block text-sm text-primary hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Specialized Components */}
        <section className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-6 text-2xl font-semibold">Specialized Components</h2>
            
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="space-y-3 rounded-lg border bg-muted/50 p-6 text-center">
                <LogoNav />
                <div className="text-sm font-mono text-muted-foreground">
                  {'<LogoNav />'}
                </div>
                <p className="text-xs text-muted-foreground">
                  For navigation headers
                  <br />
                  (priority loading)
                </p>
              </div>

              <div className="space-y-3 rounded-lg border bg-muted/50 p-6 text-center">
                <LogoIcon />
                <div className="text-sm font-mono text-muted-foreground">
                  {'<LogoIcon />'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Icon only, small
                </p>
              </div>

              <div className="space-y-3 rounded-lg border bg-muted/50 p-6 text-center">
                <LogoFull />
                <div className="text-sm font-mono text-muted-foreground">
                  {'<LogoFull />'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Large with text
                  <br />
                  for hero sections
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* All Sizes */}
        <section className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-6 text-2xl font-semibold">All Sizes</h2>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Extra Small */}
              <div className="space-y-4 rounded-lg border bg-muted/50 p-6">
                <div className="flex min-h-[80px] items-center justify-center">
                  <Logo size="xs" showText={false} href={undefined} />
                </div>
                <div className="space-y-1 text-center">
                  <div className="text-sm font-mono text-muted-foreground">
                    {'<Logo size="xs" />'}
                  </div>
                  <p className="text-xs text-muted-foreground">32×32 pixels</p>
                </div>
              </div>

              {/* Small */}
              <div className="space-y-4 rounded-lg border bg-muted/50 p-6">
                <div className="flex min-h-[80px] items-center justify-center">
                  <Logo size="sm" showText={false} href={undefined} />
                </div>
                <div className="space-y-1 text-center">
                  <div className="text-sm font-mono text-muted-foreground">
                    {'<Logo size="sm" />'}
                  </div>
                  <p className="text-xs text-muted-foreground">64×64 pixels</p>
                </div>
              </div>

              {/* Medium */}
              <div className="space-y-4 rounded-lg border bg-muted/50 p-6">
                <div className="flex min-h-[80px] items-center justify-center">
                  <Logo size="md" showText={false} href={undefined} />
                </div>
                <div className="space-y-1 text-center">
                  <div className="text-sm font-mono text-muted-foreground">
                    {'<Logo size="md" />'}
                  </div>
                  <p className="text-xs text-muted-foreground">128×128 pixels (default)</p>
                </div>
              </div>

              {/* Large */}
              <div className="space-y-4 rounded-lg border bg-muted/50 p-6">
                <div className="flex min-h-[80px] items-center justify-center">
                  <Logo size="lg" showText={false} href={undefined} />
                </div>
                <div className="space-y-1 text-center">
                  <div className="text-sm font-mono text-muted-foreground">
                    {'<Logo size="lg" />'}
                  </div>
                  <p className="text-xs text-muted-foreground">256×256 pixels</p>
                </div>
              </div>

              {/* Extra Large */}
              <div className="col-span-full space-y-4 rounded-lg border bg-muted/50 p-6">
                <div className="flex min-h-[200px] items-center justify-center">
                  <Logo size="xl" showText={false} href={undefined} />
                </div>
                <div className="space-y-1 text-center">
                  <div className="text-sm font-mono text-muted-foreground">
                    {'<Logo size="xl" />'}
                  </div>
                  <p className="text-xs text-muted-foreground">512×512 pixels</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* With Text Variants */}
        <section className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-6 text-2xl font-semibold">With Text</h2>
            
            <div className="grid gap-8 sm:grid-cols-2">
              {/* Small with text */}
              <div className="space-y-4 rounded-lg border bg-muted/50 p-6">
                <div className="flex min-h-[80px] items-center justify-center">
                  <Logo size="sm" href={undefined} />
                </div>
                <div className="text-center text-sm font-mono text-muted-foreground">
                  {'<Logo size="sm" />'}
                </div>
              </div>

              {/* Medium with text */}
              <div className="space-y-4 rounded-lg border bg-muted/50 p-6">
                <div className="flex min-h-[80px] items-center justify-center">
                  <Logo size="md" href={undefined} />
                </div>
                <div className="text-center text-sm font-mono text-muted-foreground">
                  {'<Logo size="md" />'}
                </div>
              </div>

              {/* Large with text */}
              <div className="col-span-full space-y-4 rounded-lg border bg-muted/50 p-6">
                <div className="flex min-h-[120px] items-center justify-center">
                  <Logo size="lg" href={undefined} />
                </div>
                <div className="text-center text-sm font-mono text-muted-foreground">
                  {'<Logo size="lg" />'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-6 text-2xl font-semibold">Usage Examples</h2>
            
            <div className="space-y-8">
              {/* Navigation Example */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">Navigation Header</h3>
                <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                  <LogoNav />
                  <div className="flex gap-4 text-sm">
                    <span className="text-muted-foreground">Features</span>
                    <span className="text-muted-foreground">Pricing</span>
                    <span className="text-muted-foreground">About</span>
                  </div>
                </div>
              </div>

              {/* Hero Example */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">Hero Section</h3>
                <div className="flex flex-col items-center gap-4 rounded-lg border bg-gradient-to-b from-primary/5 to-transparent p-12 text-center">
                  <Logo size="xl" showText={false} href={undefined} />
                  <h1 className="text-3xl font-bold">BookMe</h1>
                  <p className="text-muted-foreground">Smart Booking Platform</p>
                </div>
              </div>

              {/* Footer Example */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">Footer</h3>
                <div className="rounded-lg border bg-background p-6">
                  <div className="flex items-center justify-between">
                    <Logo size="sm" href={undefined} />
                    <p className="text-xs text-muted-foreground">© 2024 BookMe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Colors */}
        <section className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-6 text-2xl font-semibold">Brand Colors</h2>
            
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2 rounded-lg border p-4">
                <div className="h-20 rounded bg-pink-500"></div>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">Primary Pink</p>
                  <p className="font-mono text-xs text-muted-foreground">#ec4899</p>
                  <p className="text-xs text-muted-foreground">pink-500</p>
                </div>
              </div>
              
              <div className="space-y-2 rounded-lg border p-4">
                <div className="h-20 rounded bg-purple-500"></div>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">Secondary Purple</p>
                  <p className="font-mono text-xs text-muted-foreground">#a855f7</p>
                  <p className="text-xs text-muted-foreground">purple-500</p>
                </div>
              </div>
              
              <div className="space-y-2 rounded-lg border p-4">
                <div className="h-20 rounded border bg-white"></div>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">White Star</p>
                  <p className="font-mono text-xs text-muted-foreground">#ffffff</p>
                  <p className="text-xs text-muted-foreground">white</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Link */}
        <div className="text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            View Full Documentation
          </Link>
        </div>
      </div>
    </main>
  );
}

