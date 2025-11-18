'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { useAlert } from '@/providers/alert-provider';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';

// Define the validation schema
const bookingFormSchema = z.object({
  fullName: z
    .string()
    .min(2, {
      message: 'Full name must be at least 2 characters.',
    })
    .max(50, {
      message: 'Full name must not be longer than 50 characters.',
    }),
  email: z
    .string()
    .min(1, { message: 'Email is required.' })
    .email({
      message: 'Please enter a valid email address.',
    }),
  phone: z
    .string()
    .min(10, {
      message: 'Phone number must be at least 10 digits.',
    })
    .regex(/^[0-9+\-\s()]+$/, {
      message: 'Please enter a valid phone number.',
    }),
  service: z.string({
    required_error: 'Please select a service.',
  }),
  date: z.string({
    required_error: 'Please select a date.',
  }),
  notes: z
    .string()
    .max(500, {
      message: 'Notes must not be longer than 500 characters.',
    })
    .optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions.',
  }),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

// Default values
const defaultValues: Partial<BookingFormValues> = {
  fullName: '',
  email: '',
  phone: '',
  notes: '',
  terms: false,
};

export default function FormDemoPage() {
  const { alert } = useAlert();
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues,
    mode: 'onChange', // Validate on change
  });

  async function onSubmit(data: BookingFormValues) {
    console.log('Form submitted:', data);
    // Here you would typically send the data to your backend
    await alert('Form submitted successfully! Check console for data.', {
      title: 'Success',
    });
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
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Form Validation Demo</h1>
          <p className="text-muted-foreground">
            This demonstrates proper form validation with shadcn/ui, react-hook-form, and Zod.
            No more ugly native browser errors!
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Book an Appointment</CardTitle>
            <CardDescription>
              Fill out the form below to book your appointment. All fields marked with * are
              required.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-8">
              <CardContent className="space-y-6">
                {/* Full Name Field */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter your full name as it appears on your ID.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john.doe@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        We'll send your booking confirmation to this email.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Field */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        We'll use this to send you appointment reminders.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Service Select */}
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="haircut">Haircut</SelectItem>
                          <SelectItem value="coloring">Hair Coloring</SelectItem>
                          <SelectItem value="styling">Hair Styling</SelectItem>
                          <SelectItem value="treatment">Hair Treatment</SelectItem>
                          <SelectItem value="massage">Massage</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the service you'd like to book.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date Field */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        Select your preferred appointment date.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Notes Textarea */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special requests or information we should know?"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: Share any additional details (max 500 characters).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Terms Checkbox */}
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Accept terms and conditions *</FormLabel>
                        <FormDescription>
                          You agree to our Terms of Service and Privacy Policy.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Reset Form
                </Button>
                <Button type="submit">Submit Booking</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {/* Additional Examples Card */}
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
            <CardDescription>Benefits of this approach</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Real-time validation:</strong> Errors appear as you type (configurable)
              </li>
              <li>
                <strong>Custom error messages:</strong> Clear, user-friendly messages styled with
                your theme
              </li>
              <li>
                <strong>Type-safe:</strong> Full TypeScript support with Zod schema validation
              </li>
              <li>
                <strong>Accessible:</strong> Proper ARIA attributes and semantic HTML
              </li>
              <li>
                <strong>Consistent styling:</strong> Matches your design system perfectly
              </li>
              <li>
                <strong>No native browser errors:</strong> Complete control over the UX
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}

