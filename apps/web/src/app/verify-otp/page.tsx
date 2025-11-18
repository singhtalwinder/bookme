'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BubbleBackground } from '@/components/ui/bubble-background';
import { Logo } from '@/components/logo';
import { AuthFooter } from '@/components/auth-footer';
import { ThemeToggle } from '@/components/theme-toggle';
import { CheckCircle2, AlertCircle } from 'lucide-react';
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
const otpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: 'Code must be 6 digits' })
    .regex(/^\d+$/, { message: 'Code must contain only numbers' }),
});

type OtpFormValues = z.infer<typeof otpSchema>;

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);

  // Redirect to verify-email if no email parameter
  if (!emailParam) {
    router.push('/verify-email');
    return null;
  }

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const handleVerifyOtp = async (data: OtpFormValues) => {
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailParam, token: data.otp }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Verification failed');
      }

      // Redirect to dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setResendSuccess(false);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailParam }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend code');
      }

      setError('');
      setResendSuccess(true);
      // Auto-hide success message after 5 seconds
      setTimeout(() => setResendSuccess(false), 5000);
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
              We sent a 6-digit verification code to
            </p>
            <p className="mt-1 text-md font-semibold text-gray-900 dark:text-white">
              {emailParam}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white/95 backdrop-blur-sm p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/95">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Enter verification code
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Check your email for the 6-digit code we just sent
            </p>
          </div>

          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleVerifyOtp)} className="space-y-4" noValidate>
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                      <FormLabel>Verification code</FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          {...field}
                          value={field.value ?? ''}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} className="h-12 w-12 text-lg border-gray-300 dark:border-gray-700" />
                            <InputOTPSlot index={1} className="h-12 w-12 text-lg border-gray-300 dark:border-gray-700" />
                            <InputOTPSlot index={2} className="h-12 w-12 text-lg border-gray-300 dark:border-gray-700" />
                            <InputOTPSlot index={3} className="h-12 w-12 text-lg border-gray-300 dark:border-gray-700" />
                            <InputOTPSlot index={4} className="h-12 w-12 text-lg border-gray-300 dark:border-gray-700" />
                            <InputOTPSlot index={5} className="h-12 w-12 text-lg border-gray-300 dark:border-gray-700" />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription className="text-center">
                        Enter the 6-digit code sent to your email
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

                {resendSuccess && (
                  <Alert className="bg-success-50 border-success-200 dark:bg-success-900/20 dark:border-success-800">
                    <CheckCircle2 className="h-4 w-4 text-success-600 dark:text-success-400" />
                    <AlertDescription className="text-success-600 dark:text-success-400">
                      Verification code resent successfully!
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={form.formState.isSubmitting || !form.formState.isValid}
                >
                  {form.formState.isSubmitting ? 'Verifying...' : 'Verify email'}
                </Button>

                <div className="space-y-2 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Didn&apos;t receive the code?
                  </p>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    disabled={form.formState.isSubmitting}
                  >
                    Resend code
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-4 text-center text-sm dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => router.push('/verify-email')}
                    className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    Change email address
                  </button>
                  <span className="mx-2 text-gray-400">·</span>
                  <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                    Back to login
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

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}
