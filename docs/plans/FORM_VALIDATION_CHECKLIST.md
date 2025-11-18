# Form Validation Checklist ✅

Use this checklist when creating ANY new form in the BookMe application.

---

## 📋 Required Steps for Every Form

### 1. ✅ Import Required Dependencies

```typescript
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription, // Optional
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
```

---

### 2. ✅ Define Zod Validation Schema

```typescript
const formSchema = z.object({
  email: z.string().min(1, "Required").email("Invalid email"),
  // Add all your fields here
});

type FormValues = z.infer<typeof formSchema>;
```

---

### 3. ✅ Initialize React Hook Form

```typescript
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    email: '',
    // Set defaults for all fields
  },
});
```

---

### 4. ✅ Create Submit Handler

```typescript
const onSubmit = async (data: FormValues) => {
  // data is already validated and type-safe!
  try {
    // Your API call here
  } catch (err) {
    // Handle errors
  }
};
```

---

### 5. ⚠️ CRITICAL: Add noValidate to Form Element

```typescript
<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
  {/* Without noValidate, you'll see browser tooltips! */}
</form>
```

**Why?** This prevents native browser validation popups from appearing over your custom validation messages.

---

### 6. ✅ Wrap with Form Provider

```typescript
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
    {/* Your form fields */}
  </form>
</Form>
```

---

### 7. ✅ Use FormField for Each Input

```typescript
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input type="email" {...field} />
      </FormControl>
      <FormDescription>Optional helper text</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

### 8. ✅ Add Loading State to Submit Button

```typescript
<Button 
  type="submit" 
  disabled={form.formState.isSubmitting}
>
  {form.formState.isSubmitting ? 'Loading...' : 'Submit'}
</Button>
```

---

## 🚫 Common Mistakes to Avoid

### ❌ Forgetting noValidate
```typescript
// BAD - Browser tooltips will appear
<form onSubmit={form.handleSubmit(onSubmit)}>

// GOOD - Only custom validation
<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
```

---

### ❌ Missing FormMessage
```typescript
// BAD - No error messages shown
<FormControl>
  <Input {...field} />
</FormControl>

// GOOD - Errors displayed
<FormControl>
  <Input {...field} />
</FormControl>
<FormMessage />
```

---

### ❌ Not Using FormControl
```typescript
// BAD - Form integration broken
<FormItem>
  <Input {...field} />
</FormItem>

// GOOD - Proper integration
<FormItem>
  <FormControl>
    <Input {...field} />
  </FormControl>
</FormItem>
```

---

### ❌ Adding HTML Validation Attributes
```typescript
// BAD - Conflicts with react-hook-form
<Input 
  required 
  minLength={8}
  pattern="[a-z]+"
  {...field} 
/>

// GOOD - Only use Zod validation
<Input {...field} />
```

---

### ❌ Not Spreading Field Props
```typescript
// BAD - Field not connected
<Input 
  value={field.value}
  onChange={field.onChange}
/>

// GOOD - All props included
<Input {...field} />
```

---

## 📖 Quick Validation Examples

### Email (Required)
```typescript
email: z.string().min(1, "Email required").email("Invalid email")
```

### Password (8+ chars)
```typescript
password: z.string().min(8, "Min 8 characters")
```

### Name (2-50 chars)
```typescript
name: z.string().min(2, "Too short").max(50, "Too long")
```

### OTP (6 digits)
```typescript
otp: z.string().length(6, "Must be 6 digits").regex(/^\d+$/, "Numbers only")
```

### Select/Enum
```typescript
role: z.enum(['admin', 'user'], { required_error: "Select a role" })
```

### Password Match
```typescript
z.object({
  password: z.string().min(8),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, {
  message: "Passwords don't match",
  path: ["confirm"],
})
```

### Optional Field
```typescript
bio: z.string().max(500).optional()
```

---

## ✅ Complete Template

Copy this template for new forms:

```typescript
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// 1. Define schema
const formSchema = z.object({
  email: z.string().min(1, "Required").email("Invalid email"),
});

type FormValues = z.infer<typeof formSchema>;

export default function MyForm() {
  const [error, setError] = useState('');

  // 2. Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  // 3. Handle submit
  const onSubmit = async (data: FormValues) => {
    setError('');
    
    try {
      const response = await fetch('/api/endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed');

      // Success!
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error occurred');
    }
  };

  // 4. Render form
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
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

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  );
}
```

---

## 🔍 Testing Your Form

Before considering a form complete, test:

1. ✅ Submit empty form → Shows all required field errors
2. ✅ Enter invalid email → Shows email error (not browser tooltip!)
3. ✅ Enter too short text → Shows length error
4. ✅ Fill form correctly → Submits successfully
5. ✅ Click submit again → Button is disabled during submission
6. ✅ Server error → Error message displayed
7. ✅ Tab through fields → All fields accessible via keyboard
8. ✅ Screen reader → Error messages announced

---

## 📚 Related Documentation

- [Validation Rules Reference](./VALIDATION_RULES.md) - Complete validation guide
- [Form Validation Guide](./FORM_VALIDATION.md) - Detailed examples
- [react-hook-form Docs](https://react-hook-form.com/)
- [Zod Docs](https://zod.dev/)

---

## 🎯 Remember

**The #1 rule:** Always add `noValidate` to prevent browser tooltips!

```typescript
<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
```

---

**Last Updated:** November 17, 2025

