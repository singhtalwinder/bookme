# Form Validation Rules - BookMe

This document outlines the validation rules applied across all forms in the BookMe application. All forms use **react-hook-form** with **Zod** validation schemas and **shadcn/ui Form components** for consistent, accessible, and type-safe validation.

## 🎯 Validation Philosophy

- **Client-side validation first**: Provide immediate feedback to users
- **No native browser validation**: All forms use `noValidate` or handle submission through react-hook-form to prevent browser popups
- **Consistent error messages**: Clear, actionable error messages
- **Accessible**: Proper ARIA attributes and screen reader support
- **Type-safe**: Full TypeScript support with Zod schema inference

## 📋 Common Field Validations

### Email Fields

```typescript
email: z
  .string()
  .min(1, { message: 'Email is required' })
  .email({ message: 'Please enter a valid email address' })
```

**Rules:**
- Required field
- Must be a valid email format
- Used in: Login, Signup, Forgot Password, Team Invite, Verify OTP (conditional)

---

### Password Fields

```typescript
password: z
  .string()
  .min(1, { message: 'Password is required' })
  .min(8, { message: 'Password must be at least 8 characters' })
  .max(100, { message: 'Password must be less than 100 characters' })
```

**Rules:**
- Required field
- Minimum 8 characters
- Maximum 100 characters
- Used in: Login, Signup, Accept Invite

**Note:** Consider adding additional password strength requirements (uppercase, lowercase, numbers, special characters) in production.

---

### Confirm Password

```typescript
confirmPassword: z
  .string()
  .min(1, { message: 'Please confirm your password' })

// With refinement for matching
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})
```

**Rules:**
- Required field
- Must match password field
- Used in: Accept Invite

---

### Name Fields

```typescript
name: z
  .string()
  .min(1, { message: 'Name is required' })
  .min(2, { message: 'Name must be at least 2 characters' })
  .max(50, { message: 'Name must be less than 50 characters' })
```

**Rules:**
- Required field
- Minimum 2 characters
- Maximum 50 characters
- Used in: Signup, Accept Invite

---

### OTP/Verification Code

```typescript
otp: z
  .string()
  .length(6, { message: 'Code must be 6 digits' })
  .regex(/^\d+$/, { message: 'Code must contain only numbers' })
```

**Rules:**
- Must be exactly 6 digits
- Only numeric characters allowed
- Used in: Login (OTP step), Verify OTP

---

### Business Name

```typescript
businessName: z
  .string()
  .min(1, { message: 'Business name is required' })
  .min(2, { message: 'Business name must be at least 2 characters' })
  .max(100, { message: 'Business name must be less than 100 characters' })
```

**Rules:**
- Required field
- Minimum 2 characters
- Maximum 100 characters
- Used in: Signup

---

### Business Handle (URL Slug)

```typescript
businessHandle: z
  .string()
  .min(1, { message: 'Booking URL is required' })
  .min(3, { message: 'Booking URL must be at least 3 characters' })
  .max(50, { message: 'Booking URL must be less than 50 characters' })
  .regex(/^[a-z0-9-]+$/, {
    message: 'Only lowercase letters, numbers, and hyphens are allowed',
  })
```

**Rules:**
- Required field
- Minimum 3 characters
- Maximum 50 characters
- Only lowercase letters, numbers, and hyphens
- Auto-generated from business name (can be manually edited)
- Used in: Signup

**Frontend sanitization:**
```typescript
const sanitized = value
  .toLowerCase()
  .replace(/[^a-z0-9-]/g, '')
  .slice(0, 50);
```

---

### Role Selection

```typescript
role: z.enum(['admin', 'staff', 'receptionist', 'viewer'], {
  required_error: 'Please select a role',
})
```

**Rules:**
- Required field
- Must be one of: admin, staff, receptionist, viewer
- Used in: Team Invite

**Role Descriptions:**
- **Admin**: Full access except billing
- **Staff**: Manage own calendar
- **Receptionist**: Manage all bookings
- **Viewer**: Read-only access

---

## 📝 Form-Specific Validation Schemas

### Login Form (Credentials Step)

**File:** `/apps/web/src/app/login/page.tsx`

```typescript
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
```

---

### Login Form (OTP Step)

**File:** `/apps/web/src/app/login/page.tsx`

```typescript
const otpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: 'Code must be 6 digits' })
    .regex(/^\d+$/, { message: 'Code must contain only numbers' }),
});
```

---

### Signup Form

**File:** `/apps/web/src/app/signup/page.tsx`

```typescript
const signupSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name must be less than 50 characters' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(100, { message: 'Password must be less than 100 characters' }),
  businessName: z
    .string()
    .min(1, { message: 'Business name is required' })
    .min(2, { message: 'Business name must be at least 2 characters' })
    .max(100, { message: 'Business name must be less than 100 characters' }),
  businessHandle: z
    .string()
    .min(1, { message: 'Booking URL is required' })
    .min(3, { message: 'Booking URL must be at least 3 characters' })
    .max(50, { message: 'Booking URL must be less than 50 characters' })
    .regex(/^[a-z0-9-]+$/, {
      message: 'Only lowercase letters, numbers, and hyphens are allowed',
    }),
});
```

---

### Forgot Password Form

**File:** `/apps/web/src/app/forgot-password/page.tsx`

```typescript
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
});
```

---

### Verify OTP Form (With Email)

**File:** `/apps/web/src/app/verify-otp/page.tsx`

```typescript
const otpWithEmailSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  otp: z
    .string()
    .length(6, { message: 'Code must be 6 digits' })
    .regex(/^\d+$/, { message: 'Code must contain only numbers' }),
});
```

---

### Verify OTP Form (Email in URL)

**File:** `/apps/web/src/app/verify-otp/page.tsx`

```typescript
const otpOnlySchema = z.object({
  otp: z
    .string()
    .length(6, { message: 'Code must be 6 digits' })
    .regex(/^\d+$/, { message: 'Code must contain only numbers' }),
});
```

---

### Team Invite Form

**File:** `/apps/web/src/app/team/page.tsx`

```typescript
const inviteSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  role: z.enum(['admin', 'staff', 'receptionist', 'viewer'], {
    required_error: 'Please select a role',
  }),
});
```

---

### Accept Invite Form

**File:** `/apps/web/src/app/accept-invite/page.tsx`

```typescript
const acceptInviteSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .min(2, { message: 'Name must be at least 2 characters' })
      .max(50, { message: 'Name must be less than 50 characters' }),
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(100, { message: 'Password must be less than 100 characters' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
```

---

## 🎨 Implementation Pattern

All forms follow this consistent pattern:

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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// 1. Define validation schema
const schema = z.object({
  email: z.string().email({ message: "Invalid email" }),
});

// 2. Infer TypeScript type
type FormValues = z.infer<typeof schema>;

// 3. Initialize form with resolver
const form = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: {
    email: '',
  },
});

// 4. Handle submission (data is already validated)
const onSubmit = async (data: FormValues) => {
  // data is type-safe and validated
  console.log(data);
};

// 5. Render form with noValidate attribute
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
      <Button type="submit" disabled={form.formState.isSubmitting}>
        Submit
      </Button>
    </form>
  </Form>
);
```

**⚠️ CRITICAL: Always add `noValidate` to the `<form>` element!**

This prevents native browser validation tooltips and ensures react-hook-form handles all validation.

---

## ✅ Validation Best Practices

### 1. **⚠️ ALWAYS Add noValidate to Forms**
```typescript
<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
```
This is **CRITICAL** to prevent native browser validation tooltips. Without this, users will see browser popups instead of your custom validation messages.

### 2. **Always Use FormControl**
Wraps the input component to provide proper form field integration.

### 3. **Always Include FormMessage**
Displays validation error messages below the field.

### 4. **Use FormDescription for Helper Text**
Provides additional context before the user interacts.

```typescript
<FormDescription>At least 8 characters</FormDescription>
```

### 5. **Disable Submit During Submission**
```typescript
<Button type="submit" disabled={form.formState.isSubmitting}>
  {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
</Button>
```

### 6. **Client-Side Input Sanitization**
For special fields like business handles, sanitize input on change:

```typescript
onChange={(e) => {
  const sanitized = e.target.value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 50);
  field.onChange(sanitized);
}}
```

### 7. **Validation Modes**
All forms use the default `onChange` mode for immediate feedback after first interaction.

### 8. **Server Error Handling**
Display server errors separately from validation errors:

```typescript
{error && (
  <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
    {error}
  </div>
)}
```

---

## 🔒 Security Considerations

### Password Requirements
Current implementation requires:
- Minimum 8 characters
- Maximum 100 characters

**Recommended enhancements for production:**
```typescript
password: z
  .string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' })
```

### Email Validation
Basic email format validation is performed client-side. Server-side should:
- Verify email deliverability
- Check for disposable email providers
- Implement rate limiting on OTP sends

### Business Handle Validation
- Client-side sanitization prevents invalid characters
- Server-side should check for uniqueness
- Consider reserving common words/routes

---

## 📚 Additional Resources

- [react-hook-form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [shadcn/ui Form Documentation](https://ui.shadcn.com/docs/components/form)
- [Project Form Validation Guide](./FORM_VALIDATION.md)

---

## 🔄 Future Enhancements

1. **Phone Number Validation**
   - International format support
   - Country code validation
   - Phone number verification

2. **Enhanced Password Strength**
   - Real-time strength indicator
   - Common password detection
   - Password breach checking

3. **Email Verification**
   - Real-time email validation
   - Disposable email detection
   - Corporate email requirements

4. **Business Handle Availability**
   - Real-time availability checking
   - Suggested alternatives
   - Reserved keyword prevention

5. **Custom Validation Rules**
   - Industry-specific requirements
   - Compliance validation
   - Multi-step form validation

---

**Last Updated:** November 17, 2025  
**Maintained By:** Development Team  
**Version:** 1.0.0

