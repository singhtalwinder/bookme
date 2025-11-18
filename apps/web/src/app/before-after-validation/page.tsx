'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormValues = z.infer<typeof schema>;

export default function BeforeAfterComparison() {
  const [nativeSubmitted, setNativeSubmitted] = useState(false);
  const [customSubmitted, setCustomSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  function handleNativeSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNativeSubmitted(true);
    setTimeout(() => setNativeSubmitted(false), 3000);
  }

  function handleCustomSubmit(data: FormValues) {
    console.log('Custom form data:', data);
    setCustomSubmitted(true);
    setTimeout(() => setCustomSubmitted(false), 3000);
  }

  return (
    <div className="min-h-screen">
      <div className="fixed left-6 top-6 z-50">
        <Logo size="xs" showText href="/" />
      </div>
      <div className="fixed right-6 top-6 z-50">
        <ThemeToggle />
      </div>
      <div className="container mx-auto py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Before vs After: Form Validation
          </h1>
          <p className="text-xl text-muted-foreground">
            See the difference between native browser validation and custom shadcn/ui
            validation
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* BEFORE: Native Browser Validation */}
          <Card className="border-destructive/50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-destructive" />
                    Before (Native Browser)
                  </CardTitle>
                  <CardDescription>Using HTML5 validation attributes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleNativeSubmit} noValidate className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="native-email">Email</Label>
                  <Input
                    id="native-email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="native-password">Password</Label>
                  <Input
                    id="native-password"
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Submit with Native Validation
                </Button>

                {nativeSubmitted && (
                  <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600">
                    Form submitted successfully!
                  </div>
                )}
              </form>

              {/* Problems List */}
              <div className="mt-6 space-y-3 rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                <h4 className="font-semibold text-destructive">Problems:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong>Ugly popups:</strong> Native browser tooltips don't match
                      your design
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong>Inconsistent styling:</strong> Looks different in Chrome,
                      Safari, Firefox
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong>Limited customization:</strong> Can't change error
                      messages or styling
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong>Poor UX:</strong> Only shows one error at a time
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong>Hard to test:</strong> Difficult to handle programmatically
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* AFTER: Custom shadcn/ui Validation */}
          <Card className="border-green-500/50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    After (shadcn/ui + Zod)
                  </CardTitle>
                  <CardDescription>
                    Using react-hook-form with Zod validation
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleCustomSubmit)}
                  noValidate
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Submit with Custom Validation
                  </Button>

                  {customSubmitted && (
                    <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600">
                      Form submitted successfully!
                    </div>
                  )}
                </form>
              </Form>

              {/* Benefits List */}
              <div className="mt-6 space-y-3 rounded-lg border border-green-500/50 bg-green-500/5 p-4">
                <h4 className="font-semibold text-green-600">Benefits:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span>
                      <strong>Beautiful errors:</strong> Styled to match your design
                      system perfectly
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span>
                      <strong>Consistent:</strong> Same experience across all browsers
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span>
                      <strong>Fully customizable:</strong> Complete control over messages
                      and styling
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span>
                      <strong>Better UX:</strong> Shows all errors inline, real-time
                      feedback
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span>
                      <strong>Type-safe:</strong> Full TypeScript support with
                      autocomplete
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span>
                      <strong>Easy to test:</strong> Programmatic control over form state
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Try It Section */}
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle>Try It Yourself!</CardTitle>
            <CardDescription>
              Submit each form without filling it out to see the difference
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-semibold">Left Form (Native):</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>1. Click "Submit with Native Validation"</li>
                    <li>2. See the ugly browser popup</li>
                    <li>3. Notice it's hard to customize</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold">Right Form (Custom):</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>1. Click "Submit with Custom Validation"</li>
                    <li>2. See beautiful inline errors</li>
                    <li>3. Notice they match your theme!</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border bg-background p-4">
                <p className="text-sm">
                  <strong>Tip:</strong> Start typing in the right form's email field with
                  an invalid email (like "test@") and watch the real-time validation in
                  action! 🎯
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Ready to Upgrade Your Forms?</CardTitle>
            <CardDescription>Here's how to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  1
                </span>
                <div>
                  <strong>Check the demos:</strong> Visit{' '}
                  <code className="rounded bg-muted px-1 py-0.5">/form-demo</code> for a
                  complete example
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  2
                </span>
                <div>
                  <strong>Read the docs:</strong> See{' '}
                  <code className="rounded bg-muted px-1 py-0.5">
                    docs/FORM_VALIDATION.md
                  </code>{' '}
                  for detailed patterns
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  3
                </span>
                <div>
                  <strong>Use the cheat sheet:</strong> Quick reference at{' '}
                  <code className="rounded bg-muted px-1 py-0.5">
                    FORM_VALIDATION_CHEATSHEET.md
                  </code>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  4
                </span>
                <div>
                  <strong>Copy examples:</strong> Use{' '}
                  <code className="rounded bg-muted px-1 py-0.5">
                    src/components/examples/login-form-example.tsx
                  </code>{' '}
                  as a template
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}

