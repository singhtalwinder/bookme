'use client';

import { useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
const inviteSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  role: z.enum(['admin', 'staff', 'receptionist', 'viewer'], {
    required_error: 'Please select a role',
  }),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

export default function TeamPage() {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role: 'staff',
    },
  });

  const handleInvite = async (data: InviteFormValues) => {
    setError('');
    setSuccess('');

    try {
      // Get the current session token
      const response = await fetch('/api/auth/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to send invite');
      }

      setSuccess(`Invitation sent to ${data.email}`);
      form.reset();
      setShowInviteForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo size="sm" showText href="/dashboard" />
            <nav className="hidden md:flex md:gap-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Dashboard
              </Link>
              <Link
                href="/calendar"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Calendar
              </Link>
              <Link
                href="/clients"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Clients
              </Link>
              <Link
                href="/services"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Services
              </Link>
              <Link
                href="/team"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Team
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Team</h1>
            <p className="text-muted-foreground">Manage your team members and invitations</p>
          </div>
          <Button onClick={() => setShowInviteForm(!showInviteForm)}>
            {showInviteForm ? 'Cancel' : 'Invite team member'}
          </Button>
        </div>

        {success && (
          <div className="mb-6 rounded-md bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
            {success}
          </div>
        )}

        {showInviteForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Invite team member</CardTitle>
              <CardDescription>
                Send an invitation to join your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleInvite)} className="space-y-4" noValidate>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="colleague@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                            <SelectItem value="receptionist">Receptionist</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          <strong>Admin:</strong> Full access except billing. <strong>Staff:</strong> Manage own calendar.{' '}
                          <strong>Receptionist:</strong> Manage all bookings. <strong>Viewer:</strong> Read-only access.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {error && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? 'Sending...' : 'Send invitation'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowInviteForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Active members of your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No team members yet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>Invitations waiting to be accepted</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No pending invitations</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

