'use client';

import { useState } from 'react';
import { useAlert } from '@/providers/alert-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { AlertTriangle, CheckCircle, Info, Trash2 } from 'lucide-react';

export default function AlertDemoPage() {
  const { alert, confirm } = useAlert();
  const [lastAction, setLastAction] = useState<string>('No action yet');

  const handleSimpleAlert = async () => {
    await alert('This is a simple alert message!');
    setLastAction('Simple alert closed');
  };

  const handleSuccessAlert = async () => {
    await alert('Your changes have been saved successfully!', {
      title: 'Success',
      confirmText: 'Great!',
    });
    setLastAction('Success alert closed');
  };

  const handleWarningAlert = async () => {
    await alert('This action cannot be undone. Please review before proceeding.', {
      title: 'Warning',
      confirmText: 'I understand',
    });
    setLastAction('Warning alert closed');
  };

  const handleErrorAlert = async () => {
    await alert('An error occurred while processing your request. Please try again.', {
      title: 'Error',
      variant: 'destructive',
      confirmText: 'OK',
    });
    setLastAction('Error alert closed');
  };

  const handleSimpleConfirm = async () => {
    const confirmed = await confirm('Are you sure you want to continue?');
    setLastAction(confirmed ? 'User confirmed' : 'User cancelled');
  };

  const handleDeleteConfirm = async () => {
    const confirmed = await confirm('This will permanently delete your account. This action cannot be undone.', {
      title: 'Delete Account',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
    });
    setLastAction(confirmed ? 'Account deletion confirmed' : 'Deletion cancelled');
  };

  const handleCustomConfirm = async () => {
    const confirmed = await confirm('Do you want to save changes before closing?', {
      title: 'Unsaved Changes',
      confirmText: 'Save & Close',
      cancelText: 'Discard',
    });
    setLastAction(confirmed ? 'Changes saved' : 'Changes discarded');
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="fixed left-6 top-6 z-50">
        <Logo size="xs" showText href="/" />
      </div>
      <div className="fixed right-6 top-6 z-50">
        <ThemeToggle />
      </div>

      <div className="container mx-auto max-w-5xl space-y-8 py-12 px-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Custom Alert System</h1>
          <p className="text-muted-foreground">
            Beautiful, accessible alerts and confirmations - no more native browser alerts!
          </p>
        </div>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Last Action
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sm">{lastAction}</p>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Simple Alerts</CardTitle>
              <CardDescription>Basic alert dialogs with messages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleSimpleAlert} className="w-full">
                <Info className="mr-2 h-4 w-4" />
                Show Simple Alert
              </Button>

              <Button onClick={handleSuccessAlert} className="w-full" variant="default">
                <CheckCircle className="mr-2 h-4 w-4" />
                Show Success Alert
              </Button>

              <Button onClick={handleWarningAlert} className="w-full" variant="secondary">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Show Warning Alert
              </Button>

              <Button onClick={handleErrorAlert} className="w-full" variant="destructive">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Show Error Alert
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Confirm Dialogs</CardTitle>
              <CardDescription>Get user confirmation before actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleSimpleConfirm} className="w-full" variant="outline">
                Simple Confirmation
              </Button>

              <Button onClick={handleDeleteConfirm} className="w-full" variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Confirmation
              </Button>

              <Button onClick={handleCustomConfirm} className="w-full" variant="secondary">
                Custom Confirmation
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>What makes this better than native alerts?</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 sm:grid-cols-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-sm">Fully customizable styling</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-sm">Matches your design system</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-sm">Accessible (ARIA compliant)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-sm">Smooth animations</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-sm">Keyboard navigation (ESC to close)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-sm">Promise-based API</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-sm">TypeScript support</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-sm">Dark mode compatible</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
            <CardDescription>How to use the custom alert system in your code</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-semibold">Simple Alert</h3>
              <pre className="rounded-lg bg-muted p-4 text-xs">
{`import { useAlert } from '@/providers/alert-provider';

function MyComponent() {
  const { alert } = useAlert();

  const handleClick = async () => {
    await alert('Hello World!');
  };
}`}
              </pre>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold">Confirmation Dialog</h3>
              <pre className="rounded-lg bg-muted p-4 text-xs">
{`import { useAlert } from '@/providers/alert-provider';

function MyComponent() {
  const { confirm } = useAlert();

  const handleDelete = async () => {
    const confirmed = await confirm(
      'Are you sure?',
      { variant: 'destructive' }
    );
    
    if (confirmed) {
      // Delete item
    }
  };
}`}
              </pre>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold">With Custom Options</h3>
              <pre className="rounded-lg bg-muted p-4 text-xs">
{`await alert('Message', {
  title: 'Custom Title',
  confirmText: 'Got it!',
  variant: 'destructive'
});

await confirm('Unsaved changes', {
  title: 'Warning',
  confirmText: 'Save',
  cancelText: 'Discard',
  variant: 'destructive'
});`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

