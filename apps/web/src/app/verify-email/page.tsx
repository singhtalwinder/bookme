'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BubbleBackground } from '@/components/ui/bubble-background';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { AlertCircle } from 'lucide-react';
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
const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export default function VerifyEmailPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (data: EmailFormValues) => {
    setError('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to send verification code');
      }

      // Redirect to OTP page with email
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

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
              Verify your email
            </h1>
            <p className="mt-3 text-md text-gray-600 dark:text-gray-400">
              Enter your email to receive a verification code
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white/95 backdrop-blur-sm p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/95">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Email verification
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              We&apos;ll send you a 6-digit code to verify your email
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
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          autoFocus
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the email address you want to verify
                      </FormDescription>
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
                  className="w-full" 
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Sending code...' : 'Send verification code'}
                </Button>

                <div className="border-t border-gray-200 pt-4 text-center text-sm dark:border-gray-800">
                  <Link href="/login" className="font-semibold text-primary hover:text-primary/80">
                    Back to login
                  </Link>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </BubbleBackground>
  );
}

