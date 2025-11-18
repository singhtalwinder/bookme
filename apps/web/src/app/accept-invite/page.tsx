'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BubbleBackground } from '@/components/ui/bubble-background';
import { Logo } from '@/components/logo';
import { AuthFooter } from '@/components/auth-footer';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';

// Validation schema
const acceptInviteSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .min(2, { message: 'Name must be at least 2 characters' })
      .max(50, { message: 'Name must be less than 50 characters' }),
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(100, { message: 'Password must be less than 100 characters' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type AcceptInviteFormValues = z.infer<typeof acceptInviteSchema>;

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get('token');

  const [error, setError] = useState('');

  const form = useForm<AcceptInviteFormValues>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: {
      name: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!tokenParam) {
      setError('Invalid invite link');
    }
  }, [tokenParam]);

  const handleSubmit = async (data: AcceptInviteFormValues) => {
    setError('');

    if (!tokenParam) {
      setError('Invalid invite link');
      return;
    }

    try {
      const response = await fetch('/api/auth/accept-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: tokenParam,
          name: data.name,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to accept invite');
      }

      router.push(`/verify-otp?email=${encodeURIComponent(responseData.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (!tokenParam) {
    return (
      <BubbleBackground className="relative flex min-h-screen items-center justify-center px-4 py-12 overflow-hidden">
        {/* Top Left Logo */}
        <div className="absolute left-4 top-4 z-10 sm:left-6 sm:top-6">
          <Logo size="xs" showText href="/" />
        </div>

        {/* Theme Toggle */}
        <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
          <ThemeToggle />
        </div>

        <div className="relative z-10 w-full max-w-md space-y-8 pt-16 sm:pt-0">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-center">
              <h1 className="text-display-xs font-semibold text-gray-900 dark:text-white">
                Invalid invite
              </h1>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white/95 backdrop-blur-sm p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/95">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Invite not found
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                This invitation link is invalid or has expired
              </p>
            </div>
            <Button asChild className="w-full">
              <Link href="/login">Go to login</Link>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8">
          <AuthFooter variant="light" />
        </div>
      </BubbleBackground>
    );
  }

  return (
    <BubbleBackground className="relative flex min-h-screen items-center justify-center px-4 py-12 overflow-hidden">
      {/* Top Left Logo */}
      <div className="absolute left-4 top-4 z-10 sm:left-6 sm:top-6">
        <Logo size="xs" showText href="/" />
      </div>

      {/* Theme Toggle */}
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8 pt-16 sm:pt-0">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <h1 className="text-display-xs font-semibold text-gray-900 dark:text-white">
              Accept invitation
            </h1>
            <p className="mt-3 text-md text-gray-600 dark:text-gray-400">
              Join your team on BookMe
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white/95 backdrop-blur-sm p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/95">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Complete your profile
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Set up your account to get started
            </p>
          </div>

          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" noValidate>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="John Doe"
                          autoComplete="name"
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
                        <Input
                          type="password"
                          placeholder="••••••••"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>At least 8 characters</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <div className="rounded-lg bg-error-50 p-3 text-sm text-error-600 dark:bg-error-900/20 dark:text-error-400">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Creating account...' : 'Accept invitation'}
                </Button>

                <p className="text-xs text-gray-600 dark:text-gray-400">
                  By accepting, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
            </Form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8">
          <AuthFooter variant="light" />
        </div>
      </div>
    </BubbleBackground>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AcceptInviteContent />
    </Suspense>
  );
}
