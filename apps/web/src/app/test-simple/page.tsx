'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/logo';

export default function SimpleTestPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="fixed left-6 top-6 z-50">
        <Logo size="xs" showText href="/" />
      </div>
      <div className="fixed right-6 top-6 z-50">
        <ThemeToggle />
      </div>
      
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8">
        <div className="space-y-4 text-center">
          <Badge variant="secondary" className="text-xs">
            Marshmallow Theme with OKLCH Colors
          </Badge>
          <h1 className="text-5xl font-bold tracking-tight">
            Theme Test Page
          </h1>
          <p className="text-lg text-muted-foreground">
            Showcasing the new Marshmallow theme with OKLCH color space.
            Toggle dark mode with the button in the top-right!
          </p>
        </div>

        <div className="grid w-full gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Primary Colors</CardTitle>
              <CardDescription>Pink/purple accent palette</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" size="lg">Primary Button</Button>
              <Button className="w-full" variant="secondary" size="lg">Secondary Button</Button>
              <Button className="w-full" variant="outline" size="lg">Outline Button</Button>
              <Button className="w-full" variant="ghost" size="lg">Ghost Button</Button>
              <Button className="w-full" variant="destructive" size="lg">Destructive Button</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Color Badges</CardTitle>
              <CardDescription>Status indicators and labels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
              <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
                <p className="text-sm font-medium">Background: Muted</p>
                <p className="text-sm text-muted-foreground">
                  This showcases the muted background with proper contrast.
                </p>
              </div>
              <div className="space-y-2 rounded-lg border bg-accent p-4">
                <p className="text-sm font-medium text-accent-foreground">Background: Accent</p>
                <p className="text-sm text-accent-foreground/80">
                  Purple accent with perfect readability.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Chart Colors</CardTitle>
              <CardDescription>Data visualization palette with 5 harmonious colors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                <div className="space-y-2">
                  <div className="h-24 rounded-lg bg-chart-1 shadow-md" />
                  <p className="text-center text-xs font-medium">Chart 1</p>
                </div>
                <div className="space-y-2">
                  <div className="h-24 rounded-lg bg-chart-2 shadow-md" />
                  <p className="text-center text-xs font-medium">Chart 2</p>
                </div>
                <div className="space-y-2">
                  <div className="h-24 rounded-lg bg-chart-3 shadow-md" />
                  <p className="text-center text-xs font-medium">Chart 3</p>
                </div>
                <div className="space-y-2">
                  <div className="h-24 rounded-lg bg-chart-4 shadow-md" />
                  <p className="text-center text-xs font-medium">Chart 4</p>
                </div>
                <div className="space-y-2">
                  <div className="h-24 rounded-lg bg-chart-5 shadow-md" />
                  <p className="text-center text-xs font-medium">Chart 5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Typography & Fonts</CardTitle>
              <CardDescription>
                Afacad (sans), Nunito (serif), Inter (mono)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-sans text-2xl font-bold">
                  Sans (Afacad): The quick brown fox jumps over the lazy dog
                </p>
                <p className="font-serif text-2xl font-bold">
                  Serif (Nunito): The quick brown fox jumps over the lazy dog
                </p>
                <p className="font-mono text-lg">
                  Mono (Inter): const greeting = "Hello, World!";
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Shadow Utilities</CardTitle>
              <CardDescription>Custom OKLCH-based shadows (2xs to 2xl)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-card shadow-2xs" />
                  <p className="text-center text-xs">2xs</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-card shadow-xs" />
                  <p className="text-center text-xs">xs</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-card shadow-sm" />
                  <p className="text-center text-xs">sm</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-card shadow-md" />
                  <p className="text-center text-xs">md</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-card shadow-lg" />
                  <p className="text-center text-xs">lg</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-card shadow-xl" />
                  <p className="text-center text-xs">xl</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-card shadow-2xl" />
                  <p className="text-center text-xs">2xl</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            ✨ Marshmallow theme • OKLCH colors • 1.45rem radius • Custom shadows
          </p>
        </div>
      </div>
    </div>
  );
}
