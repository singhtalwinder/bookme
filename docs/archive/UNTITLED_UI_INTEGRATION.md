# Integrating Untitled UI into BookMe

This guide covers how to integrate Untitled UI components into the BookMe platform.

## What is Untitled UI?

Untitled UI is a premium design system and component library. It typically comes in two forms:
1. **Untitled UI for Figma** - Design files
2. **Untitled UI React** - Pre-built React components (if purchased separately)

## Integration Options

### Option A: Using Untitled UI React Components (Recommended)

If you have the React component library:

#### 1. Install Untitled UI Package

```bash
cd packages/ui

# If it's a private npm package
pnpm add @untitled-ui/react

# Or if you have local files
# Copy the untitled-ui folder to packages/ui/src/untitled-ui
```

#### 2. Update `packages/ui/package.json`

```json
{
  "name": "ui",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.tsx",
  "types": "./src/index.tsx",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@untitled-ui/icons-react": "^1.0.0",
    "@headlessui/react": "^1.7.17",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0"
  }
}
```

#### 3. Update `packages/ui/src/index.tsx`

Replace the exports with Untitled UI components:

```typescript
/**
 * UI Component Library for BookMe Platform
 * Using Untitled UI Design System
 */

// Export utilities
export * from './utils';

// Re-export Untitled UI components
export { Button } from './components/Button';
export { Input } from './components/Input';
export { Select } from './components/Select';
export { Dialog } from './components/Dialog';
export { DatePicker } from './components/DatePicker';

// Additional Untitled UI components as needed
export { Card } from './components/Card';
export { Badge } from './components/Badge';
export { Avatar } from './components/Avatar';
```

#### 4. Update Tailwind Config

Update `packages/ui/tailwind.config.js` to use Untitled UI design tokens:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Untitled UI Color Palette
        primary: {
          25: '#F5FEFF',
          50: '#ECFDFF',
          100: '#CFF9FE',
          200: '#A5F0FC',
          300: '#67E3F9',
          400: '#22CCEE',
          500: '#06AED4',
          600: '#088AB2',
          700: '#0E7090',
          800: '#155B75',
          900: '#164C63',
        },
        gray: {
          25: '#FCFCFD',
          50: '#F9FAFB',
          100: '#F2F4F7',
          200: '#EAECF0',
          300: '#D0D5DD',
          400: '#98A2B3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#1D2939',
          900: '#101828',
        },
        error: {
          25: '#FFFBFA',
          50: '#FEF3F2',
          100: '#FEE4E2',
          200: '#FECDCA',
          300: '#FDA29B',
          400: '#F97066',
          500: '#F04438',
          600: '#D92D20',
          700: '#B42318',
          800: '#912018',
          900: '#7A271A',
        },
        success: {
          25: '#F6FEF9',
          50: '#ECFDF3',
          100: '#D1FADF',
          200: '#A6F4C5',
          300: '#6CE9A6',
          400: '#32D583',
          500: '#12B76A',
          600: '#039855',
          700: '#027A48',
          800: '#05603A',
          900: '#054F31',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '5.625rem', letterSpacing: '-0.02em' }],
        'display-xl': ['3.75rem', { lineHeight: '4.5rem', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '3.75rem', letterSpacing: '-0.02em' }],
        'display-md': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.02em' }],
        'display-sm': ['1.875rem', { lineHeight: '2.375rem' }],
        'display-xs': ['1.5rem', { lineHeight: '2rem' }],
      },
      boxShadow: {
        xs: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
        sm: '0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)',
        md: '0px 2px 4px -2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px rgba(16, 24, 40, 0.10)',
        lg: '0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)',
        xl: '0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)',
        '2xl': '0px 24px 48px -12px rgba(16, 24, 40, 0.18)',
        '3xl': '0px 32px 64px -12px rgba(16, 24, 40, 0.14)',
      },
    },
  },
  plugins: [],
};
```

### Option B: Building from Untitled UI Figma Designs

If you only have Figma files, we'll need to build components based on the designs:

#### 1. Keep Current Structure

Keep our custom components but style them according to Untitled UI specs.

#### 2. Extract Design Tokens from Figma

- Colors
- Typography
- Spacing
- Border radius
- Shadows

#### 3. Update Each Component

Update styling to match Untitled UI exactly.

### Option C: Use Shadcn/ui + Untitled UI Styling

Shadcn/ui components with Untitled UI design tokens:

```bash
cd packages/ui
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select
```

Then style them with Untitled UI tokens.

## Recommended Approach for BookMe

I recommend **Option A with a wrapper layer**:

```
packages/ui/
├── src/
│   ├── untitled/           # Untitled UI components (installed or copied)
│   ├── components/         # Our wrapper components
│   │   ├── Button.tsx      # Wraps Untitled Button with BookMe defaults
│   │   ├── Input.tsx       # Wraps Untitled Input
│   │   └── ...
│   ├── utils/
│   └── index.tsx
```

This gives us:
- ✅ Professional Untitled UI design
- ✅ BookMe-specific customizations
- ✅ Type safety and consistency
- ✅ Easy to swap implementations later

## Implementation Steps

### Step 1: Share Your Untitled UI Access

Tell me which you have:
1. **Untitled UI React npm package** (provide package name)
2. **Untitled UI local files** (I'll help you copy them)
3. **Figma files only** (we'll build from designs)
4. **Untitled UI Pro license** (check documentation)

### Step 2: Install Dependencies

Once I know what you have, I'll update the `package.json` and install.

### Step 3: Create Wrapper Components

I'll create thin wrappers around Untitled UI components for BookMe-specific needs.

### Step 4: Update Test Page

Update `/test-components` to showcase Untitled UI components.

### Step 5: Sync with Web App

Ensure `apps/web` Tailwind config matches the UI package.

## What Do You Have?

Please let me know:

1. Do you have **Untitled UI React components**?
2. Do you have the **npm package name** or **local files**?
3. Or do you have only **Figma designs**?

Once you tell me, I'll implement the integration right away! 🚀

## Alternative: Use Similar Open-Source

If you don't have Untitled UI yet, consider:
- **Shadcn/ui** - Similar quality, open source
- **Park UI** - Unstyled components
- **Radix UI** - Primitive components with Untitled UI styling

Let me know how you'd like to proceed!

