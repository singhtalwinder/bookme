'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { BubbleBackground } from '@/components/ui/bubble-background';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function BubbleBackgroundDemo() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Bubble Background */}
      <BubbleBackground
        interactive
        className="absolute inset-0"
        bubbleCount={25}
      />

      {/* Logo */}
      <Link 
        href="/" 
        className="fixed left-6 top-6 z-50 flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300 transition-colors"
      >
        BookMe
      </Link>

      {/* Theme Toggle */}
      <div className="fixed right-6 top-6 z-50">
        <ThemeToggle />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="mb-2">
              Marshmallow Theme
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Bubble Background
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Interactive animated background with Marshmallow theme colors
            </p>
          </div>

          {/* Demo Card */}
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle>Marshmallow Colors</CardTitle>
              <CardDescription>
                Bubbles use gray scale (300-500) and brand purple shades
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Light Mode Colors:</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Gray 300, 400, 500 (subtle neutrals)</li>
                  <li>• Brand 600, 500, 400 (purple accents)</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Dark Mode Colors:</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Gray 600, 700, 800 (darker neutrals)</li>
                  <li>• Brand 600, 500, 400 (purple accents)</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Try it:</strong> Move your mouse around to interact with the bubbles!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/test-components">
                View All Components
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Features */}
          <div className="grid gap-4 sm:grid-cols-3 text-center">
            <div className="rounded-lg bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-4 border border-gray-200 dark:border-gray-800">
              <div className="text-2xl font-bold text-primary">
                Interactive
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Responds to mouse
              </div>
            </div>
            <div className="rounded-lg bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-4 border border-gray-200 dark:border-gray-800">
              <div className="text-2xl font-bold text-primary">
                Themed
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Marshmallow colors
              </div>
            </div>
            <div className="rounded-lg bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-4 border border-gray-200 dark:border-gray-800">
              <div className="text-2xl font-bold text-primary">
                Smooth
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                60fps animation
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

