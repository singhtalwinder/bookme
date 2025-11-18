'use client';

import { useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BubbleBackground } from '@/components/ui/bubble-background';
import { Logo } from '@/components/logo';
import { AuthFooter } from '@/components/auth-footer';
import { ThemeToggle } from '@/components/theme-toggle';
import { CheckCircle2, AlertCircle, Mail } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Validation schema
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (data: ForgotPasswordFormValues) => {
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server configuration error. Please contact support.');
      }

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to send reset code');
      }

      setSubmittedEmail(data.email);
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  if (success) {
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
                Check your email
              </h1>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white/95 backdrop-blur-sm p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/95">
            <div className="mb-6 flex items-center justify-center">
              <div className="rounded-full bg-success-100 p-3 dark:bg-success-900/20">
                <Mail className="h-6 w-6 text-success-600 dark:text-success-400" />
              </div>
            </div>

            <div className="mb-6 text-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Verification code sent
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                We&apos;ve sent a 6-digit verification code to
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {submittedEmail}
              </p>
            </div>

            <Alert className="mb-6 bg-primary/5 border-primary/20">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm text-primary">
                Check your email inbox and spam folder for the verification code.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Link 
                href={`/verify-otp?email=${encodeURIComponent(submittedEmail)}`}
                className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/10"
              >
                Enter verification code
              </Link>
              <Link 
                href="/login"
                className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
              >
                Back to login
              </Link>
            </div>
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
              Reset your password
            </h1>
            <p className="mt-3 text-md text-gray-600 dark:text-gray-400">
              Enter your email to receive a verification code
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white/95 backdrop-blur-sm p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/95">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Forgot password?
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              No worries, we&apos;ll send you reset instructions
            </p>
          </div>

          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" noValidate>
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
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <Alert variant="destructive" className="bg-error-50 border-error-200 dark:bg-error-900/20 dark:border-error-800">
                    <AlertCircle className="h-4 w-4 text-error-600 dark:text-error-400" />
                    <AlertDescription className="text-error-600 dark:text-error-400">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full"
                >
                  {form.formState.isSubmitting ? 'Sending...' : 'Send reset code'}
                </Button>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Remember your password?{' '}
                  <Link href="/login" className="font-semibold text-primary hover:text-primary/80">
                    Sign in
                  </Link>
                </div>
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
