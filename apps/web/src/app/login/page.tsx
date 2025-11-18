'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Logo } from '@/components/logo';
import { AuthFooter } from '@/components/auth-footer';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Validation schemas
const credentialsSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' }),
});

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: 'Code must be 6 digits' })
    .regex(/^\d+$/, { message: 'Code must contain only numbers' }),
});

type CredentialsFormValues = z.infer<typeof credentialsSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [savedEmail, setSavedEmail] = useState('');
  const [error, setError] = useState('');

  const credentialsForm = useForm<CredentialsFormValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const handleLogin = async (data: CredentialsFormValues) => {
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Login failed');
      }

      // Save email and move to OTP step
      setSavedEmail(data.email);
      setStep('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleVerifyOtp = async (data: OtpFormValues) => {
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: savedEmail, token: data.otp }),
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

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: savedEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend code');
      }

      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      const { createClient } = await import('@/lib/supabase-client');
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="container relative grid min-h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0 overflow-hidden">
      {/* Left side - Form */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-700 to-primary-800" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Logo size="sm" showText={true} href="/" />
        </div>
        <div className="relative z-20 mt-auto space-y-8">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;BookMe has revolutionized how we manage appointments. It's
              simple, elegant, and just works.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
          <AuthFooter variant="dark" />
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="relative lg:p-8">
        {/* Logo for small screens */}
        <div className="fixed left-6 top-6 z-50 lg:hidden">
          <Logo size="xs" showText href="/" />
        </div>
        
        {/* Theme Toggle */}
        <div className="fixed right-6 top-6 z-50">
          <ThemeToggle />
        </div>
        
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 px-6 sm:w-[350px] sm:px-0">
          <div className="flex flex-col space-y-2 text-center pt-20 lg:pt-0">
            <h1 className="text-2xl font-semibold tracking-tight">
              {step === 'credentials' ? 'Welcome back' : 'Verify your email'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {step === 'credentials'
                ? 'Enter your credentials to sign in to your account'
                : `We sent a 6-digit code to ${savedEmail}`}
            </p>
          </div>

          <div className="grid gap-6">
            {step === 'credentials' ? (
              <>
                <Form {...credentialsForm}>
                  <form onSubmit={credentialsForm.handleSubmit(handleLogin)} className="grid gap-4" noValidate>
                    <FormField
                      control={credentialsForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              autoComplete="email"
                              disabled={credentialsForm.formState.isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={credentialsForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel>Password</FormLabel>
                            <Link
                              href="/forgot-password"
                              className="ml-auto inline-block text-sm text-primary hover:underline"
                            >
                              Forgot password?
                            </Link>
                          </div>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              autoComplete="current-password"
                              disabled={credentialsForm.formState.isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {error && (
                      <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
                        {error}
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={credentialsForm.formState.isSubmitting}>
                      {credentialsForm.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
                    </Button>
                  </form>
                </Form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    type="button"
                    disabled={credentialsForm.formState.isSubmitting}
                    onClick={() => handleSocialLogin('google')}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={credentialsForm.formState.isSubmitting}
                    onClick={() => handleSocialLogin('facebook')}
                  >
                    <svg className="mr-2 h-4 w-4" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </Button>
                </div>
              </>
            ) : (
              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="grid gap-4" noValidate>
                  <FormField
                    control={otpForm.control}
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {error && (
                    <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={otpForm.formState.isSubmitting || !otpForm.formState.isValid}
                  >
                    {otpForm.formState.isSubmitting ? 'Verifying...' : 'Verify'}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-sm font-medium text-primary hover:underline"
                      disabled={otpForm.formState.isSubmitting}
                    >
                      Didn&apos;t receive a code? Resend
                    </button>
                  </div>
                </form>
              </Form>
            )}
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            {step === 'credentials' ? (
              <>
                Don&apos;t have an account?{' '}
                <Link
                  href="/create-account"
                  className="font-medium text-primary hover:underline"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="font-medium text-primary hover:underline"
              >
                Back to sign in
              </button>
            )}
          </p>

          {/* Footer for mobile/tablet screens */}
          <div className="lg:hidden px-8 pt-8">
            <AuthFooter variant="light" />
          </div>
        </div>
      </div>
    </div>
  );
}

