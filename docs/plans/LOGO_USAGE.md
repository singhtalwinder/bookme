# BookMe Logo Usage Guide

## Overview

The BookMe logo is a beautiful pink-to-purple gradient with a white star/diamond shape in the center. This guide explains how to use the logo throughout the application.

## Logo Files Location

All logo assets are stored in `/apps/web/public/logos/` and `/apps/web/public/icons/`:

### Primary Logo (SVG - Perfect Quality)

| File | Format | Use Case |
|------|--------|----------|
| `/logos/bookme-logo.svg` | SVG (Vector) | **All sizes** - scales perfectly to any dimension |

**Benefits of SVG:**
- ✅ Perfect quality at any size (no blur or pixelation)
- ✅ Small file size (4.3KB vs 7.2MB PNG)
- ✅ Retina-ready automatically
- ✅ Includes gradients and effects from Figma

### Favicon & App Icons

| Size | File Path | Use Case |
|------|-----------|----------|
| 16x16 | `/icons/icon-16.png` | Browser favicon |
| 192x192 | `/icons/icon-192.png` | Android Chrome icon |
| 180x180 | `/apple-touch-icon.png` | iOS home screen icon |
| 32x32 | `/favicon.ico` | Legacy browsers |

## Using the Logo Component

### Basic Usage

```tsx
import { Logo } from '@/components/logo';

// Default logo with text
<Logo />

// Custom size
<Logo size="lg" />

// Icon only (no text)
<Logo showText={false} />

// Without link
<Logo href={undefined} />
```

### Logo Sizes

Available sizes: `xs`, `sm`, `md`, `lg`, `xl`, `full`

**Note**: All sizes use the same SVG file and scale perfectly - no quality loss!

```tsx
// Extra small (32x32) - Inline icons
<Logo size="xs" />

// Small (64x64) - Navigation headers
<Logo size="sm" />

// Medium (128x128) - Default, cards
<Logo size="md" />

// Large (256x256) - Hero sections
<Logo size="lg" />

// Extra large (512x512) - Feature banners
<Logo size="xl" />

// Full size (1024x1024) - Maximum display size
<Logo size="full" />
```

All sizes render crisp and clear on any display, including Retina screens!

### Specialized Logo Components

```tsx
import { LogoIcon, LogoFull, LogoNav } from '@/components/logo';

// Icon only, small size
<LogoIcon />

// Full logo with text, large size
<LogoFull />

// Navigation-optimized logo with priority loading
<LogoNav />
```

## Common Use Cases

### Navigation Header

```tsx
import { LogoNav } from '@/components/logo';

export function Header() {
  return (
    <header>
      <LogoNav />
      {/* other nav items */}
    </header>
  );
}
```

### Hero Section

```tsx
import { Logo } from '@/components/logo';

export function Hero() {
  return (
    <section>
      <Logo size="xl" showText={false} />
      <h1>BookMe</h1>
      <p>Your booking solution</p>
    </section>
  );
}
```

### Footer

```tsx
import { Logo } from '@/components/logo';

export function Footer() {
  return (
    <footer>
      <Logo size="sm" />
      {/* footer content */}
    </footer>
  );
}
```

### Loading Screen

```tsx
import { LogoIcon } from '@/components/logo';

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen">
      <LogoIcon size="lg" className="animate-pulse" />
    </div>
  );
}
```

## Brand Guidelines

### Colors

The logo features a gradient from pink to purple:
- Primary Pink: `#ec4899` (pink-500)
- Secondary Purple: `#a855f7` (purple-500)
- White Star: `#ffffff`

### Spacing

- Always maintain adequate clear space around the logo (minimum 50% of logo height)
- Don't place text or other elements too close to the logo

### Do's

✅ Use the provided logo components
✅ Maintain the aspect ratio
✅ Use appropriate sizes for different contexts
✅ Ensure good contrast with backgrounds
✅ Use the rounded corners (rounded-lg class is applied)

### Don'ts

❌ Don't stretch or distort the logo
❌ Don't change the colors
❌ Don't add effects or filters
❌ Don't rotate the logo (unless for intentional design effect)
❌ Don't place on busy backgrounds without proper contrast

## Metadata & PWA Configuration

The logo is automatically configured in the app metadata for:
- Browser favicons
- Apple touch icons
- PWA manifest
- Social media sharing (Open Graph, Twitter Cards)

See `/apps/web/src/app/layout.tsx` for the implementation.

## Next.js Image Optimization

All logo components use Next.js Image component with:
- Automatic format optimization (WebP when supported)
- Responsive loading
- Priority loading for above-the-fold logos
- Lazy loading for below-the-fold logos

## Export for External Use

If you need to export logos for external use (presentations, print, etc.):

1. **Original PNG**: Use `/apps/web/public/logos/bookme-logo-original.png`
2. **Source File**: Original source is at `/BookMe Logo.png`

## Updates and Maintenance

To update the logo:

### Main Logo (SVG)
1. Export the updated logo from Figma as SVG
2. Replace `/apps/web/public/logos/bookme-logo.svg`
3. Done! The SVG will automatically scale to all sizes

### Favicon/App Icons (PNG - if needed)
If you need to update the raster icons:
1. Export from Figma as PNG at exact sizes:
   - 16×16 → `apps/web/public/icons/icon-16.png`
   - 192×192 → `apps/web/public/icons/icon-192.png`
   - 180×180 → `apps/web/public/apple-touch-icon.png`
   - 32×32 → `apps/web/public/favicon-32.png`
2. Restart the dev server to see changes

## Questions?

For questions about logo usage, refer to this guide or contact the design team.

