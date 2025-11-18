'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, CheckCircle2, Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { useAlert } from '@/providers/alert-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const services = [
  { value: 'haircut', label: 'Haircut', price: '$150' },
  { value: 'coloring', label: 'Hair Coloring', price: '$500' },
  { value: 'massage', label: 'Massage Therapy', price: '$300' },
  { value: 'facial', label: 'Facial Treatment', price: '$250' },
  { value: 'manicure', label: 'Manicure', price: '$120' },
] as const;

const plans = [
  { value: 'individual', label: 'Individual' },
  { value: 'business', label: 'Business' },
  { value: 'enterprise', label: 'Enterprise' },
] as const;

// Booking form validation schema
const bookingFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(50, { message: 'Full name must not exceed 50 characters' }),
  company: z.string().optional(),
  bookingNotes: z
    .string()
    .max(500, { message: 'Notes must not exceed 500 characters' })
    .optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function TestComponentsPage() {
  const { alert } = useAlert();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedService, setSelectedService] = useState<typeof services[number]['value']>('haircut');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [wantsNewsletter, setWantsNewsletter] = useState(false);
  const [plan, setPlan] = useState<typeof plans[number]['value']>('individual');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const formattedDate = useMemo(
    () => (selectedDate ? format(selectedDate, 'PPP') : 'Select a date'),
    [selectedDate],
  );

  // Form with validation
  const bookingForm = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      fullName: '',
      company: '',
      bookingNotes: '',
    },
    mode: 'onBlur',
  });

  const handleBookingSubmit = async (data: BookingFormValues) => {
    console.log('Booking form submitted:', data);
    await alert('Booking submitted successfully! Check console for data.', {
      title: 'Success',
    });
    bookingForm.reset();
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-muted/40 py-12">
        <div className="fixed left-6 top-6 z-50">
          <Logo size="xs" showText href="/" />
        </div>
        <div className="fixed right-6 top-6 z-50">
          <ThemeToggle />
        </div>
        
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6">
          <Card>
            <CardHeader className="space-y-4">
              <Badge className="w-fit" variant="secondary">
                shadcn/ui playground
              </Badge>
              <div className="space-y-3">
                <CardTitle className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  BookMe component testbed
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground sm:text-lg">
                  Every example on this page is rendered with{' '}
                  <span className="font-semibold text-foreground">shadcn/ui</span> components wired
                  up for our Next.js application. Tailwind tokens drive color, spacing, and motion.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3 pt-0">
              <Button size="lg">Primary action</Button>
              <Button size="lg" variant="outline">
                Outline
              </Button>
              <Button size="lg" variant="ghost">
                Ghost
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>Button variants and states from `button.tsx`.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button disabled>Disabled</Button>
                  <Button className="min-w-[120px]" disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold uppercase text-muted-foreground">
                  Usage tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Use `variant` and `size` to express primary vs secondary actions.</p>
                <p>• Combine with icons from `lucide-react` for expressive feedback.</p>
                <p>• Disabled and loading states inherit the same focus treatment.</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Inputs</CardTitle>
                <CardDescription>Form-ready inputs, selects, and textarea components.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        We&apos;ll send confirmations here.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+852 9123 4567"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Service</Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.value} value={service.value}>
                            {service.label} · {service.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any special requests or instructions..."
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      rows={4}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Live values
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium text-foreground">Email:</span> {email || '–'}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Service:</span>{' '}
                    {services.find((service) => service.value === selectedService)?.label ?? '–'}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Notes:</span>{' '}
                    {notes ? `${notes.slice(0, 60)}${notes.length > 60 ? '…' : ''}` : '–'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Form builder notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-muted-foreground">
                  <p>• Inputs are unstyled by default; compose with `Label` for accessibility.</p>
                  <p>• Tailwind utilities make it simple to express validation states.</p>
                  <p>• Textareas support native resize and custom heights.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Pick a date</CardTitle>
                <CardDescription>
                  The date picker composes `Popover` with the `Calendar` component from shadcn.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !selectedDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formattedDate}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </CardContent>
              <CardFooter>
                <div className="flex w-fit items-center gap-2 rounded-md border bg-muted/40 px-4 py-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <p>
                    Selected date:{' '}
                    <span className="font-medium text-foreground">
                      {selectedDate ? formattedDate : 'None'}
                    </span>
                  </p>
                </div>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold uppercase text-muted-foreground">
                  Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Works great with bookings, availability, and scheduling flows.</li>
                  <li>• Composable with range selection and disabled dates.</li>
                  <li>• Keyboard navigation is baked in by `react-day-picker`.</li>
                </ul>
                <div className="space-y-3 rounded-md border bg-muted/40 p-4">
                  <h4 className="text-sm font-semibold text-foreground">Why we like it</h4>
                  <p className="text-sm text-muted-foreground">
                    The API stays small while giving us full control over styling. No more wrestling
                    with CSS overrides.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Choices</CardTitle>
                <CardDescription>Checkbox, radio group, and switch components.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Plan</Label>
                  <RadioGroup value={plan} onValueChange={setPlan} className="grid gap-3">
                    {plans.map((option) => (
                      <div
                        key={option.value}
                        className={cn(
                          'flex items-center justify-between rounded-lg border bg-background p-3',
                          plan === option.value && 'border-primary ring-2 ring-primary/40',
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem id={option.value} value={option.value} />
                          <Label htmlFor={option.value} className="cursor-pointer font-medium">
                            {option.label}
                          </Label>
                        </div>
                        <Badge variant={plan === option.value ? 'default' : 'secondary'}>
                          {option.value === 'individual' && 'Best for solo'}
                          {option.value === 'business' && 'Popular'}
                          {option.value === 'enterprise' && 'Premium'}
                        </Badge>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Preferences</Label>
                  <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3">
                    <Checkbox
                      id="newsletter"
                      checked={wantsNewsletter}
                      onCheckedChange={(value) => setWantsNewsletter(!!value)}
                    />
                    <div className="space-y-1 leading-none">
                      <Label htmlFor="newsletter">Join our newsletter</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive tips about growing your booking revenue.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Push notifications</p>
                      <p className="text-xs text-muted-foreground">
                        Stay up to date when clients book or reschedule.
                      </p>
                    </div>
                    <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold uppercase text-muted-foreground">
                  Current selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 rounded-lg border bg-muted/40 p-4 text-sm">
                  <p>
                    <span className="font-medium text-foreground">Plan:</span> {plan}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Newsletter:</span>{' '}
                    {wantsNewsletter ? 'Subscribed' : 'Not subscribed'}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Push alerts:</span>{' '}
                    {notificationsEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Hover for a tooltip
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Tooltips compose `@radix-ui/react-tooltip` with Tailwind styling.
                  </TooltipContent>
                </Tooltip>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Avatars &amp; badges</CardTitle>
                <CardDescription>Quickly communicate identity and state.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="https://i.pravatar.cc/120?img=4" alt="Jessie" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://i.pravatar.cc/100?img=5" alt="Alex" />
                    <AvatarFallback>AL</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="https://i.pravatar.cc/140?img=8" alt="Jamie" />
                    <AvatarFallback>JM</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge>Active</Badge>
                  <Badge variant="secondary">Pending</Badge>
                  <Badge variant="outline">Draft</Badge>
                  <Badge variant="destructive">Overdue</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold uppercase text-muted-foreground">
                  About
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="rounded-lg border bg-muted/40 p-5 text-sm text-muted-foreground">
                  Avatars gracefully fall back to initials and can be sized with Tailwind utilities.
                  Badges expose a simple `variant` prop for consistent statuses.
                </div>
                <div className="space-y-2 rounded-lg border bg-muted/30 p-5 text-sm">
                  <p className="font-medium text-foreground">Best practices</p>
                  <p className="text-muted-foreground">
                    Pair avatars with badges or tooltips to provide additional context for who is
                    online, away, or assigned.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Booking form sample</CardTitle>
              <CardDescription>
                An end-to-end form with beautiful custom validation - no more ugly native browser errors!
              </CardDescription>
            </CardHeader>
            <Form {...bookingForm}>
              <form onSubmit={bookingForm.handleSubmit(handleBookingSubmit)} noValidate>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={bookingForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Jessie Han" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={bookingForm.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input placeholder="Jessie Studio" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={bookingForm.control}
                    name="bookingNotes"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Additional details</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share context, special requirements, or anything else..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex flex-wrap gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => bookingForm.reset()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={bookingForm.formState.isSubmitting}
                  >
                    {bookingForm.formState.isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit booking
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>

          <footer className="pb-8 text-center text-sm text-muted-foreground">
            Built with <span className="font-semibold text-foreground">shadcn/ui</span> + Tailwind
            CSS in Next.js 15.
          </footer>
        </div>
      </div>
    </TooltipProvider>
  );
}
