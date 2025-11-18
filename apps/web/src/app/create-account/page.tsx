'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import { Logo } from '@/components/logo';
import { AuthFooter } from '@/components/auth-footer';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BubbleBackground } from '@/components/ui/bubble-background';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

// Validation schemas
const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(100, { message: 'Password must be less than 100 characters' }),
});

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: 'Code must be 6 digits' })
    .regex(/^\d+$/, { message: 'Code must contain only numbers' }),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

export default function CreateAccountPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [savedEmail, setSavedEmail] = useState('');
  const [savedPassword, setSavedPassword] = useState('');
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
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

  useEffect(() => {
    if (step === 'otp') {
      otpForm.reset({ otp: '' });
    }
  }, [step, otpForm]);

  const handleBackToEmail = () => {
    setStep('email');
    setError('');
    setResendSuccess(false);
    otpForm.reset({ otp: '' });
  };

  const handleEmailSubmit = async (data: EmailFormValues) => {
    setError('');

    try {
      // Call API to initiate account creation and send OTP
      const response = await fetch('/api/auth/initiate-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to send verification code');
      }

      // Save email and password, move to OTP step
      setSavedEmail(data.email);
      setSavedPassword(data.password);
      setStep('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleVerifyOtp = async (data: OtpFormValues) => {
    setError('');

    try {
      // Verify OTP and create temporary session
      const response = await fetch('/api/auth/verify-signup-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: savedEmail, 
          password: savedPassword,
          token: data.otp 
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Verification failed');
      }

      // Redirect to onboarding flow
      router.push('/onboarding');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setResendSuccess(false);

    if (!savedEmail) {
      setError('Email is missing. Please go back and enter your email again.');
      return;
    }

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

      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleSocialSignup = async (provider: 'google' | 'facebook') => {
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

  if (step === 'otp') {
    return (
      <SignupOtpStep
        email={savedEmail}
        form={otpForm}
        error={error}
        resendSuccess={resendSuccess}
        handleVerifyOtp={handleVerifyOtp}
        handleResendOtp={handleResendOtp}
        onBack={handleBackToEmail}
      />
    );
  }

  return (
    <div className="container relative grid min-h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0 overflow-hidden">
      {/* Left side - Branding */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-700 to-primary-800" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Logo size="sm" showText={true} href="/" />
        </div>
        <div className="relative z-20 mt-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Join thousands of businesses</h2>
            <p className="text-lg opacity-90">
              Start managing your bookings effortlessly. Set up your account in minutes and streamline your business operations.
            </p>
          </div>
          <blockquote className="space-y-2 border-l-4 border-white/30 pl-4">
            <p className="text-lg">
              &ldquo;BookMe has revolutionized how we manage appointments. It's
              simple, elegant, and just works.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis, Salon Owner</footer>
          </blockquote>
          <AuthFooter variant="dark" />
        </div>
      </div>

      {/* Right side - Create Account Form */}
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
            <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
            <p className="text-sm text-muted-foreground">
              Start your journey with BookMe. Create an account to manage your bookings.
            </p>
          </div>

          <div className="grid gap-6">
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="grid gap-4" noValidate>
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          disabled={emailForm.formState.isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={emailForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Create a password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="At least 8 characters"
                          autoComplete="new-password"
                          disabled={emailForm.formState.isSubmitting}
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

                <Button type="submit" className="w-full" disabled={emailForm.formState.isSubmitting}>
                  {emailForm.formState.isSubmitting ? 'Creating account...' : 'Create account'}
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
                disabled={emailForm.formState.isSubmitting}
                onClick={() => handleSocialSignup('google')}
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
                disabled={emailForm.formState.isSubmitting}
                onClick={() => handleSocialSignup('facebook')}
              >
                <svg className="mr-2 h-4 w-4" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>

          <p className="px-8 text-center text-xs text-muted-foreground">
            By creating an account, you agree to our Terms of Service and Privacy Policy
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

type SignupOtpStepProps = {
  email: string;
  form: UseFormReturn<OtpFormValues>;
  error: string;
  resendSuccess: boolean;
  handleVerifyOtp: (data: OtpFormValues) => Promise<void>;
  handleResendOtp: () => Promise<void>;
  onBack: () => void;
};

function SignupOtpStep({
  email,
  form,
  error,
  resendSuccess,
  handleVerifyOtp,
  handleResendOtp,
  onBack,
}: SignupOtpStepProps) {
  return (
    <BubbleBackground className="relative flex min-h-screen items-center justify-center px-4 py-12 overflow-hidden">
      <div className="absolute left-4 top-4 z-10 sm:left-6 sm:top-6">
        <Logo size="xs" showText href="/" />
      </div>

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
              {email}
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
                  onClick={onBack}
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

        <div className="mt-8">
          <AuthFooter variant="light" />
        </div>
      </div>
    </BubbleBackground>
  );
}
