# Form Validation Quick Reference

## 🚀 Basic Setup

```tsx
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const schema = z.object({
  name: z.string().min(1, "Required"),
});

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(data => console.log(data))}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
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

## 📋 Common Validations

```typescript
// Required
z.string().min(1, "Required")

// Email
z.string().email("Invalid email")

// Phone
z.string().regex(/^[0-9+\-\s()]+$/, "Invalid phone")

// Min/Max length
z.string().min(3, "Too short").max(20, "Too long")

// Number range
z.number().min(0).max(100)

// Optional
z.string().optional()

// URL
z.string().url("Invalid URL")

// Date
z.string().datetime()

// Enum/Select
z.enum(["option1", "option2"])

// Password match
z.object({
  password: z.string().min(8),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, {
  message: "Passwords don't match",
  path: ["confirm"],
})
```

## 🎛️ Validation Modes

```typescript
const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onChange',   // Validate on every keystroke
  // mode: 'onBlur',  // Validate when leaving field (recommended)
  // mode: 'onSubmit',// Validate only on submit
});
```

## 🔤 Text Input

```tsx
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input type="email" placeholder="you@example.com" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## 📝 Textarea

```tsx
<FormField
  control={form.control}
  name="message"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Message</FormLabel>
      <FormControl>
        <Textarea placeholder="Your message..." {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## 📦 Select Dropdown

```tsx
<FormField
  control={form.control}
  name="service"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Service</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

## ☑️ Checkbox

```tsx
<FormField
  control={form.control}
  name="terms"
  render={({ field }) => (
    <FormItem className="flex items-center space-x-3 space-y-0">
      <FormControl>
        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
      </FormControl>
      <FormLabel>I accept terms</FormLabel>
      <FormMessage />
    </FormItem>
  )}
/>
```

## 🔘 Radio Group

```tsx
<FormField
  control={form.control}
  name="plan"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Select Plan</FormLabel>
      <FormControl>
        <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="free" id="free" />
            <Label htmlFor="free">Free</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pro" id="pro" />
            <Label htmlFor="pro">Pro</Label>
          </div>
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## 🔄 Switch/Toggle

```tsx
<FormField
  control={form.control}
  name="notifications"
  render={({ field }) => (
    <FormItem className="flex items-center justify-between">
      <FormLabel>Enable notifications</FormLabel>
      <FormControl>
        <Switch checked={field.value} onCheckedChange={field.onChange} />
      </FormControl>
    </FormItem>
  )}
/>
```

## 🛠️ Programmatic Actions

```typescript
// Set error manually
form.setError('email', {
  type: 'manual',
  message: 'This email is already taken',
});

// Clear errors
form.clearErrors('email');
form.clearErrors(); // Clear all

// Reset form
form.reset();

// Reset with values
form.reset({ email: 'new@email.com' });

// Get values
const currentValues = form.getValues();
const emailValue = form.getValues('email');

// Set values
form.setValue('email', 'new@email.com');

// Check if valid
const isValid = form.formState.isValid;

// Check if submitting
const isSubmitting = form.formState.isSubmitting;

// Check if dirty
const isDirty = form.formState.isDirty;
```

## 🎨 Adding Helper Text

```tsx
<FormItem>
  <FormLabel>Password</FormLabel>
  <FormControl>
    <Input type="password" {...field} />
  </FormControl>
  <FormDescription>
    Must be at least 8 characters
  </FormDescription>
  <FormMessage />
</FormItem>
```

## ⚠️ Server-Side Errors

```typescript
async function onSubmit(data: FormValues) {
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      // Show server error
      form.setError('root', {
        type: 'manual',
        message: 'Server error occurred',
      });
      return;
    }
    
    // Success
    console.log('Submitted!');
  } catch (error) {
    form.setError('root', {
      type: 'manual',
      message: 'Network error',
    });
  }
}

// Display root error
{form.formState.errors.root && (
  <div className="text-destructive text-sm">
    {form.formState.errors.root.message}
  </div>
)}
```

## 🎯 Conditional Validation

```typescript
const schema = z.object({
  hasCompany: z.boolean(),
  companyName: z.string().optional(),
}).refine((data) => {
  if (data.hasCompany) {
    return data.companyName && data.companyName.length > 0;
  }
  return true;
}, {
  message: "Company name is required when 'Has Company' is checked",
  path: ["companyName"],
});
```

## 🔢 Array/Multiple Values

```typescript
const schema = z.object({
  tags: z.array(z.string()).min(1, "Select at least one tag"),
});
```

## 📅 Date Validation

```typescript
const schema = z.object({
  birthDate: z.string().refine((date) => {
    const age = new Date().getFullYear() - new Date(date).getFullYear();
    return age >= 18;
  }, "Must be 18 or older"),
});
```

## 🎭 Custom Error Styling

In `globals.css`:
```css
:root {
  --destructive: 0 84.2% 60.2%; /* Red for errors */
}
```

## 📂 File Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── form.tsx          ← Core form components
│   │   ├── input.tsx
│   │   ├── button.tsx
│   │   └── ...
│   └── examples/
│       └── login-form-example.tsx  ← Example forms
├── app/
│   ├── form-demo/
│   │   └── page.tsx          ← Full demo
│   └── validation-modes-demo/
│       └── page.tsx          ← Modes comparison
└── docs/
    └── FORM_VALIDATION.md    ← Full documentation
```

## 🔗 Demo Pages

- Full Demo: `/form-demo`
- Validation Modes: `/validation-modes-demo`

## 📚 Resources

- Full Docs: `docs/FORM_VALIDATION.md`
- [react-hook-form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [shadcn/ui Forms](https://ui.shadcn.com/docs/components/form)

