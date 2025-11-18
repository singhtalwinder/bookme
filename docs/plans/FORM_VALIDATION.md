# Form Validation with shadcn/ui

This guide explains how to implement beautiful form validation with shadcn/ui, replacing native browser errors with custom styled error messages.

## Overview

We're using three key libraries:
- **react-hook-form**: Powerful form state management
- **Zod**: TypeScript-first schema validation
- **shadcn/ui Form**: Beautiful, accessible form components

## Quick Start

### 1. Basic Form Setup

```typescript
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Define your validation schema
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export function MyForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: FormValues) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## Common Validation Patterns

### Required Fields

```typescript
const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});
```

### Email Validation

```typescript
const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});
```

### Phone Number

```typescript
const schema = z.object({
  phone: z.string()
    .min(10, { message: "Phone must be at least 10 digits" })
    .regex(/^[0-9+\-\s()]+$/, { message: "Invalid phone number format" }),
});
```

### Min/Max Length

```typescript
const schema = z.object({
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be less than 20 characters" }),
});
```

### Optional Fields

```typescript
const schema = z.object({
  bio: z.string().max(500).optional(),
  // or
  website: z.string().url().optional().or(z.literal('')),
});
```

### Select/Dropdown

```typescript
const schema = z.object({
  service: z.string({ required_error: "Please select a service" }),
});

// In your component:
<FormField
  control={form.control}
  name="service"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Service</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="haircut">Haircut</SelectItem>
          <SelectItem value="coloring">Coloring</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Checkbox with Validation

```typescript
const schema = z.object({
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

// In your component:
<FormField
  control={form.control}
  name="terms"
  render={({ field }) => (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>Accept terms and conditions</FormLabel>
        <FormMessage />
      </div>
    </FormItem>
  )}
/>
```

### Custom Validation Logic

```typescript
const schema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // This will show the error on confirmPassword field
});
```

### Date Validation

```typescript
const schema = z.object({
  birthDate: z.string()
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18;
    }, {
      message: "You must be at least 18 years old",
    }),
});
```

## Form Validation Modes

Control when validation occurs:

```typescript
const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onChange',    // Validate on every change (default)
  // mode: 'onBlur',   // Validate when field loses focus
  // mode: 'onSubmit', // Validate only on submit
  // mode: 'onTouched',// Validate after field is touched
  // mode: 'all',      // Validate on both blur and change
});
```

## Handling Form Submission

```typescript
function onSubmit(data: FormValues) {
  // Data is already validated at this point
  console.log(data);
  
  // Call your API
  fetch('/api/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(result => {
      console.log('Success:', result);
    })
    .catch(error => {
      // Handle server errors
      form.setError('root', {
        type: 'manual',
        message: 'Something went wrong. Please try again.',
      });
    });
}
```

## Programmatically Setting Errors

```typescript
// Set error on specific field
form.setError('email', {
  type: 'manual',
  message: 'This email is already registered',
});

// Set form-level error
form.setError('root', {
  type: 'manual',
  message: 'Server error occurred',
});

// Clear errors
form.clearErrors('email');
form.clearErrors(); // Clear all errors
```

## Accessing Form State

```typescript
// Check if form is valid
const isValid = form.formState.isValid;

// Check if form is being submitted
const isSubmitting = form.formState.isSubmitting;

// Check if field has error
const hasEmailError = !!form.formState.errors.email;

// Get specific error message
const emailError = form.formState.errors.email?.message;

// Check if form is dirty (has changes)
const isDirty = form.formState.isDirty;

// Check if specific field is dirty
const isEmailDirty = form.formState.dirtyFields.email;
```

## Form Description (Helper Text)

Add helper text that appears below inputs:

```typescript
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormDescription>
        We'll never share your email with anyone else.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Styling Error Messages

The error messages automatically use your theme's `destructive` color. You can customize in your `globals.css`:

```css
@layer base {
  :root {
    --destructive: 0 84.2% 60.2%;
  }
}
```

Or customize the FormMessage component in `form.tsx`:

```typescript
const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)} // Customize here
      {...props}
    >
      {body}
    </p>
  )
})
```

## Disabling Native Validation

**⚠️ CRITICAL:** To completely prevent native browser validation popups, add `noValidate` to your form:

```typescript
<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
  {/* form fields */}
</form>
```

**This is automatically handled when you use `form.handleSubmit()` with `noValidate`.**

Without `noValidate`, browsers will show their own validation tooltips for fields with `type="email"`, `required`, etc., which conflicts with your custom validation messages.

## Complete Example

See `/app/form-demo/page.tsx` for a complete working example with all field types.

## Benefits

✅ **No native browser errors** - Complete control over error display  
✅ **Type-safe** - Full TypeScript support  
✅ **Accessible** - Proper ARIA attributes  
✅ **Consistent styling** - Matches your design system  
✅ **Flexible validation** - Validate on change, blur, or submit  
✅ **Great DX** - Autocomplete and type inference  

## Resources

- [react-hook-form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [shadcn/ui Form Documentation](https://ui.shadcn.com/docs/components/form)

