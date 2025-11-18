# Building Components from Untitled UI Figma

Step-by-step guide to implement Untitled UI design system from Figma files.

## Phase 1: Extract Design Tokens from Figma

### Step 1.1: Export Design Tokens

In your Untitled UI Figma file:

1. **Colors**
   - Open the color styles panel
   - Document all color values for:
     - Primary colors (25-900 shades)
     - Gray scale (25-900 shades)
     - Error/Success/Warning colors
     - Background colors
   
2. **Typography**
   - Font family (usually Inter)
   - Font sizes and line heights
   - Font weights
   - Letter spacing

3. **Spacing**
   - Common spacing values (4, 8, 12, 16, 20, 24, 32, etc.)

4. **Border Radius**
   - sm, md, lg, xl values

5. **Shadows**
   - xs, sm, md, lg, xl, 2xl, 3xl

### Step 1.2: Use Figma Plugins (Optional but Recommended)

Install these Figma plugins to automate token extraction:

- **Design Tokens** by Lukas Oppermann
- **Tokens Studio** (formerly Figma Tokens)
- **Style Dictionary**

These can export tokens as JSON which we'll convert to Tailwind config.

## Phase 2: Update Tailwind Configuration

### Step 2.1: Update `packages/ui/tailwind.config.js`

I'll create a comprehensive Untitled UI Tailwind config based on standard Untitled UI specs:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary colors (adjust to match your Figma exactly)
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
        // Gray scale
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
        // Error colors
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
        // Success colors
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
        // Warning colors
        warning: {
          25: '#FFFCF5',
          50: '#FFFAEB',
          100: '#FEF0C7',
          200: '#FEDF89',
          300: '#FEC84B',
          400: '#FDB022',
          500: '#F79009',
          600: '#DC6803',
          700: '#B54708',
          800: '#93370D',
          900: '#7A2E0E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '5.625rem', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-xl': ['3.75rem', { lineHeight: '4.5rem', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-lg': ['3rem', { lineHeight: '3.75rem', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-md': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-sm': ['1.875rem', { lineHeight: '2.375rem', fontWeight: '600' }],
        'display-xs': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'xl': ['1.25rem', { lineHeight: '1.875rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'md': ['1rem', { lineHeight: '1.5rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'xs': ['0.75rem', { lineHeight: '1.125rem' }],
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
      borderRadius: {
        'none': '0',
        'sm': '0.375rem',
        'DEFAULT': '0.5rem',
        'md': '0.5rem',
        'lg': '0.625rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
        'full': '9999px',
      },
    },
  },
  plugins: [],
};
```

## Phase 3: Component Implementation Strategy

We have two options:

### Option A: Use Shadcn/ui + Untitled UI Styling (RECOMMENDED)

**Pros:**
- ✅ Fast implementation (pre-built accessible components)
- ✅ Customizable with Tailwind
- ✅ Well-documented
- ✅ Regularly updated

**Steps:**
1. Install shadcn/ui CLI
2. Initialize with our Untitled UI tokens
3. Generate components
4. Adjust styling to match Figma exactly

### Option B: Build Components from Scratch

**Pros:**
- ✅ Full control
- ✅ Exact match to Figma
- ✅ No dependencies

**Cons:**
- ⏱️ Time consuming
- More code to maintain

## Phase 4: Implementation Plan

I'll implement **Option A** which gives us professional components quickly.

### What I'll Do:

1. **Update Tailwind configs** in both `packages/ui` and `apps/web`
2. **Install shadcn/ui** and its dependencies (Radix UI)
3. **Generate core components** styled with Untitled UI tokens
4. **Wrap them** in our `packages/ui` structure
5. **Update test page** to show Untitled UI styled components

### Components We'll Build:

**Phase 1 (Immediate):**
- Button (all variants from Figma)
- Input
- Select
- Dialog/Modal
- DatePicker

**Phase 2 (As needed):**
- Badge
- Avatar
- Card
- Dropdown Menu
- Tabs
- Toast/Alert
- Table
- Calendar

## Your Action Items

To help me match your Figma exactly:

### Option 1: Share Specific Values (Easiest)

If you can, share:
1. **Primary brand color hex code** (e.g., #088AB2)
2. **Any other brand colors** you want instead of default Untitled UI
3. **Font choice** (Inter is standard, but confirm)

### Option 2: Use Standard Untitled UI (Fastest)

I'll use standard Untitled UI design tokens, and you can tweak colors later.

## Next Steps

**Tell me which you prefer:**

**A. Use standard Untitled UI design tokens** (I'll implement immediately)
- Fastest option
- Professional out of the box
- You can adjust brand colors later

**B. Wait while you extract specific colors from Figma**
- Most accurate to your files
- Takes 15-30 mins to extract tokens
- I'll guide you through extraction

**C. Share Figma file link** (if you're comfortable)
- I can inspect and extract tokens
- Most accurate implementation

Which approach works best for you? I can start implementing right away! 🚀

