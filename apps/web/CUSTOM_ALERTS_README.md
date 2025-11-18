# Custom Alert System

A beautiful, accessible, and fully customizable alert and confirmation dialog system that replaces native browser alerts.

## Features

- ✅ **Fully Customizable** - Matches your design system perfectly
- ✅ **Accessible** - ARIA compliant with keyboard navigation
- ✅ **Smooth Animations** - Beautiful entrance and exit animations
- ✅ **Promise-based API** - Easy async/await usage
- ✅ **TypeScript Support** - Full type safety
- ✅ **Dark Mode Compatible** - Works seamlessly with your theme
- ✅ **Multiple Variants** - Default and destructive styles

## Installation

The alert system is already integrated into the application. The provider is added to the root layout.

## Components Created

1. **`alert-dialog.tsx`** - Base Radix UI alert dialog components
2. **`alert-provider.tsx`** - Context provider with alert/confirm functions
3. **`providers/index.tsx`** - Combined providers wrapper

## Usage

### Basic Alert

```tsx
import { useAlert } from '@/providers/alert-provider';

function MyComponent() {
  const { alert } = useAlert();

  const handleClick = async () => {
    await alert('This is a simple message!');
    // Code after user closes alert
  };
}
```

### Alert with Options

```tsx
await alert('Your changes have been saved!', {
  title: 'Success',
  confirmText: 'Great!',
});

await alert('Something went wrong', {
  title: 'Error',
  variant: 'destructive',
  confirmText: 'OK',
});
```

### Confirmation Dialog

```tsx
import { useAlert } from '@/providers/alert-provider';

function MyComponent() {
  const { confirm } = useAlert();

  const handleDelete = async () => {
    const confirmed = await confirm('Are you sure you want to delete this item?');
    
    if (confirmed) {
      // User clicked confirm
      deleteItem();
    } else {
      // User clicked cancel or closed dialog
    }
  };
}
```

### Confirmation with Options

```tsx
const confirmed = await confirm(
  'This will permanently delete your account.',
  {
    title: 'Delete Account',
    confirmText: 'Delete',
    cancelText: 'Keep Account',
    variant: 'destructive',
  }
);
```

## API Reference

### `alert(message, options?)`

Shows an alert dialog with a single confirmation button.

**Parameters:**
- `message` (string) - The alert message to display
- `options` (object, optional):
  - `title` (string) - Optional title for the alert
  - `confirmText` (string) - Text for the confirm button (default: "OK")
  - `variant` ('default' | 'destructive') - Visual style variant (default: "default")

**Returns:** Promise<void> - Resolves when user closes the alert

### `confirm(message, options?)`

Shows a confirmation dialog with cancel and confirm buttons.

**Parameters:**
- `message` (string) - The confirmation message to display
- `options` (object, optional):
  - `title` (string) - Optional title for the dialog
  - `confirmText` (string) - Text for the confirm button (default: "Confirm")
  - `cancelText` (string) - Text for the cancel button (default: "Cancel")
  - `variant` ('default' | 'destructive') - Visual style variant (default: "default")

**Returns:** Promise<boolean> - Resolves to `true` if confirmed, `false` if cancelled

## Examples

### Success Alert

```tsx
await alert('Form submitted successfully!', {
  title: 'Success',
  confirmText: 'Great!',
});
```

### Warning Alert

```tsx
await alert('This action cannot be undone.', {
  title: 'Warning',
  confirmText: 'I understand',
});
```

### Error Alert

```tsx
await alert('An error occurred. Please try again.', {
  title: 'Error',
  variant: 'destructive',
  confirmText: 'OK',
});
```

### Delete Confirmation

```tsx
const confirmed = await confirm(
  'This will permanently delete your account. This action cannot be undone.',
  {
    title: 'Delete Account',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'destructive',
  }
);

if (confirmed) {
  await deleteAccount();
}
```

### Save Confirmation

```tsx
const shouldSave = await confirm(
  'Do you want to save changes before closing?',
  {
    title: 'Unsaved Changes',
    confirmText: 'Save & Close',
    cancelText: 'Discard',
  }
);

if (shouldSave) {
  await saveChanges();
}
```

## Keyboard Navigation

- **ESC** - Close dialog (treated as cancel for confirmations)
- **Enter** - Confirm action
- **Tab** - Navigate between buttons

## Demo

Visit `/alert-demo` to see all alert variants and examples in action.

## Migration from Native Alerts

### Before (Native Alerts)

```tsx
function handleSubmit() {
  alert('Form submitted!');
  console.log('This runs after clicking OK');
}

function handleDelete() {
  if (confirm('Delete this item?')) {
    deleteItem();
  }
}
```

### After (Custom Alerts)

```tsx
const { alert, confirm } = useAlert();

async function handleSubmit() {
  await alert('Form submitted!');
  console.log('This runs after clicking OK');
}

async function handleDelete() {
  const confirmed = await confirm('Delete this item?');
  if (confirmed) {
    deleteItem();
  }
}
```

## Styling

The alert dialogs automatically match your theme:
- Light/Dark mode compatible
- Uses your design system colors
- Respects your typography settings
- Consistent with other UI components

## Accessibility

- ARIA labels and roles
- Keyboard navigation
- Focus trap within dialog
- Screen reader friendly
- Backdrop prevents interaction with background

