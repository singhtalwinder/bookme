# UI Component Library

Shared UI components for the BookMe platform, built with shadcn/ui components styled with the Marshmallow theme. Built with React, TypeScript, and Tailwind CSS.

## Components

### Button

A flexible button component with multiple variants and sizes.

```tsx
import { Button } from 'ui';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean

### Input

A text input component with label, error, and helper text support.

```tsx
import { Input } from 'ui';

<Input
  label="Email"
  type="email"
  error={errors.email}
  placeholder="you@example.com"
/>
```

### Select

A dropdown select component.

```tsx
import { Select } from 'ui';

<Select
  label="Choose an option"
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ]}
/>
```

### Dialog

A modal dialog component with backdrop and keyboard support.

```tsx
import { Dialog } from 'ui';

<Dialog
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  description="Are you sure you want to proceed?"
>
  <div className="flex gap-2">
    <Button onClick={() => setIsOpen(false)}>Cancel</Button>
    <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
  </div>
</Dialog>
```

### DatePicker

A date picker component using native HTML5 date input.

```tsx
import { DatePicker } from 'ui';

<DatePicker
  label="Select Date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
/>
```

## Utilities

### cn (className utility)

Merge Tailwind CSS classes with conflict resolution:

```tsx
import { cn } from 'ui';

<div className={cn('base-class', isActive && 'active-class', className)} />
```

## Styling

All components use Tailwind CSS with the **Marshmallow theme** - a professional, modern design system built on shadcn/ui. The theme features:
- Soft, approachable colors perfect for Hong Kong businesses
- Accessibility-first approach (React Aria)
- Consistent spacing and typography
- Professional color palette optimized for booking platforms

## Development

This package is part of the BookMe monorepo and is automatically linked to other packages via workspace dependencies.

