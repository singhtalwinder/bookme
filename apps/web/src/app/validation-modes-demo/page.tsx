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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

type ValidationMode = 'onChange' | 'onBlur' | 'onSubmit';

export default function ValidationModesDemo() {
  const [mode, setMode] = useState<ValidationMode>('onChange');
  const [submissions, setSubmissions] = useState<string[]>([]);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    mode: mode,
  });

  function onSubmit(data: ContactFormValues) {
    const timestamp = new Date().toLocaleTimeString();
    setSubmissions((prev) => [
      `[${timestamp}] Form submitted with mode: ${mode}`,
      ...prev.slice(0, 4),
    ]);
    console.log('Form data:', data);
    form.reset();
  }

  function changeMode(newMode: ValidationMode) {
    setMode(newMode);
    form.reset();
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
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Form Validation Modes Demo
          </h1>
          <p className="text-muted-foreground">
            See how different validation modes affect the user experience
          </p>
        </div>

        {/* Mode Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Select Validation Mode</CardTitle>
            <CardDescription>
              Try different modes to see when validation errors appear
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={mode === 'onChange' ? 'default' : 'outline'}
                onClick={() => changeMode('onChange')}
              >
                onChange (Real-time)
              </Button>
              <Button
                variant={mode === 'onBlur' ? 'default' : 'outline'}
                onClick={() => changeMode('onBlur')}
              >
                onBlur (On field exit)
              </Button>
              <Button
                variant={mode === 'onSubmit' ? 'default' : 'outline'}
                onClick={() => changeMode('onSubmit')}
              >
                onSubmit (On form submit)
              </Button>
            </div>

            <div className="mt-4 rounded-lg bg-muted p-4">
              <h4 className="mb-2 font-semibold">Current Mode: {mode}</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {mode === 'onChange' && (
                  <>
                    <li>✓ Validates as you type</li>
                    <li>✓ Immediate feedback</li>
                    <li>✗ Can be distracting while typing</li>
                    <li>
                      <strong>Best for:</strong> Short forms, important fields
                    </li>
                  </>
                )}
                {mode === 'onBlur' && (
                  <>
                    <li>✓ Validates when you leave a field</li>
                    <li>✓ Less distracting while typing</li>
                    <li>✓ Good balance of UX and validation</li>
                    <li>
                      <strong>Best for:</strong> Most forms (recommended)
                    </li>
                  </>
                )}
                {mode === 'onSubmit' && (
                  <>
                    <li>✓ Only validates on submit</li>
                    <li>✓ Least intrusive</li>
                    <li>✗ User only sees errors after submitting</li>
                    <li>
                      <strong>Best for:</strong> Simple forms, quick actions
                    </li>
                  </>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Form</CardTitle>
            <CardDescription>
              Try filling out the form and see when errors appear based on the
              selected mode
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormDescription>Enter your full name</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>We'll never share your email</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject *</FormLabel>
                      <FormControl>
                        <Input placeholder="How can we help?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your message here..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Minimum 10 characters required
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button type="submit">Submit Form</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Submission Log */}
        {submissions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Submission Log</CardTitle>
              <CardDescription>Recent form submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {submissions.map((log, index) => (
                  <div
                    key={index}
                    className="rounded-md bg-muted p-3 text-sm font-mono"
                  >
                    {log}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips Card */}
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle>💡 Pro Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>onChange:</strong> Use for credit card inputs, passwords, or
              when you need immediate validation feedback.
            </p>
            <p>
              <strong>onBlur (recommended):</strong> Best default choice - validates
              after user finishes typing in each field.
            </p>
            <p>
              <strong>onSubmit:</strong> Use for very simple forms or when you want
              minimal interruption.
            </p>
            <p className="pt-2 text-muted-foreground">
              You can also use <code>mode: 'all'</code> to validate on both change
              and blur for maximum validation!
            </p>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}

