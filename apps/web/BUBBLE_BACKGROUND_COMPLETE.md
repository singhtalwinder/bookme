# 🎨 Bubble Background Component - Marshmallow Theme

**Date:** November 17, 2025  
**Status:** Complete with interactive animation and Marshmallow colors

---

## ✨ Component Created

### BubbleBackground Component

**Location:** `/apps/web/src/components/ui/bubble-background.tsx`

An animated background with floating bubbles that uses Marshmallow theme colors (grays + brand purple). Bubbles can optionally respond to mouse movement for an interactive experience.

---

## 🎨 Marshmallow Colors Used

### Light Mode
- **Gray Shades:** 
  - `rgba(209, 213, 219, 0.3)` - gray-300
  - `rgba(156, 163, 175, 0.25)` - gray-400
  - `rgba(107, 114, 128, 0.2)` - gray-500

- **Brand Purple:**
  - `rgba(124, 58, 237, 0.15)` - brand-600
  - `rgba(139, 92, 246, 0.12)` - brand-500
  - `rgba(167, 139, 250, 0.1)` - brand-400

### Dark Mode
- **Gray Shades:**
  - `rgba(75, 85, 99, 0.2)` - gray-600
  - `rgba(55, 65, 81, 0.25)` - gray-700
  - `rgba(31, 41, 55, 0.3)` - gray-800

- **Brand Purple:**
  - `rgba(124, 58, 237, 0.1)` - brand-600
  - `rgba(139, 92, 246, 0.08)` - brand-500
  - `rgba(167, 139, 250, 0.06)` - brand-400

**Why these colors?**
- Subtle and non-distracting
- Matches Marshmallow theme palette
- Works in both light and dark mode
- Low opacity for background effect

---

## 📖 Usage

### Basic Usage

```tsx
import { BubbleBackground } from '@/components/ui/bubble-background';

export default function MyPage() {
  return (
    <div className="relative min-h-screen">
      <BubbleBackground className="absolute inset-0" />
      
      <div className="relative z-10">
        {/* Your content here */}
      </div>
    </div>
  );
}
```

### Interactive Mode

```tsx
<BubbleBackground
  interactive  // Bubbles respond to mouse movement
  className="absolute inset-0"
  bubbleCount={25}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `interactive` | `boolean` | `false` | Whether bubbles respond to mouse movement |
| `className` | `string` | `undefined` | Additional CSS classes |
| `bubbleCount` | `number` | `20` | Number of bubbles to render |

---

## 🎯 Features

### ✅ Performance Optimized
- **60fps animation** using `requestAnimationFrame`
- **Canvas rendering** for smooth performance
- **Efficient collision detection** for interactive mode
- **Device pixel ratio** support for sharp rendering

### ✅ Theme Aware
- **Auto-detects dark mode** and switches color palette
- **Marshmallow colors** (grays + brand purple)
- **Low opacity** for subtle background effect

### ✅ Interactive
- **Mouse tracking** in interactive mode
- **Repulsion effect** - bubbles avoid cursor
- **Smooth animations** with physics-based movement

### ✅ Responsive
- **Auto-resizes** with window
- **Mobile friendly** (works without interaction)
- **Edge wrapping** - bubbles wrap around screen

---

## 🌐 Demo Page

**Location:** `/apps/web/src/app/bubble-demo/page.tsx`

Visit **http://localhost:3000/bubble-demo** to see:
- Interactive bubble background
- Marshmallow color showcase
- Light/dark mode switching
- Feature highlights

---

## 💡 Use Cases

### Landing Pages
```tsx
<div className="relative min-h-screen bg-gray-50 dark:bg-gray-950">
  <BubbleBackground interactive className="absolute inset-0" />
  <div className="relative z-10">
    {/* Hero section */}
  </div>
</div>
```

### Auth Pages
```tsx
<div className="relative min-h-screen">
  <BubbleBackground 
    className="absolute inset-0" 
    bubbleCount={15}  // Fewer bubbles for subtle effect
  />
  <div className="relative z-10">
    {/* Login/signup form */}
  </div>
</div>
```

### Behind Modal/Card
```tsx
<div className="relative">
  <BubbleBackground className="absolute inset-0 rounded-xl" />
  <Card className="relative z-10 backdrop-blur-sm bg-white/80">
    {/* Card content */}
  </Card>
</div>
```

---

## 🎨 Styling Tips

### Backdrop Blur Effect

For a frosted glass look, combine with backdrop blur:

```tsx
<div className="relative">
  <BubbleBackground className="absolute inset-0" />
  <Card className="relative z-10 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
    {/* Content */}
  </Card>
</div>
```

### Constrained Area

Use within a specific container:

```tsx
<div className="relative h-96 rounded-xl overflow-hidden">
  <BubbleBackground className="absolute inset-0" />
  <div className="relative z-10 p-8">
    {/* Content */}
  </div>
</div>
```

### Full Page Background

```tsx
<div className="relative min-h-screen overflow-hidden">
  <BubbleBackground 
    interactive 
    className="absolute inset-0"
    bubbleCount={30}
  />
  <div className="relative z-10">
    {/* Page content */}
  </div>
</div>
```

---

## ⚙️ Customization

### Adjust Bubble Count

```tsx
// Subtle (few bubbles)
<BubbleBackground bubbleCount={10} />

// Normal
<BubbleBackground bubbleCount={20} />

// Dense
<BubbleBackground bubbleCount={40} />
```

### Adjust Colors

Edit `/apps/web/src/components/ui/bubble-background.tsx`:

```tsx
// Around line 60-70
const colors = [
  'rgba(YOUR, CUSTOM, COLORS, 0.3)',
  // ... more colors
];
```

### Adjust Speed

Edit the velocity multiplier around line 87:

```tsx
vx: (Math.random() - 0.5) * 1.0,  // Increase for faster
vy: (Math.random() - 0.5) * 1.0,
```

---

## 🧪 Testing

Start your dev server:

```bash
cd apps/web
pnpm dev
```

### Test URLs:

1. **Bubble Demo Page**
   ```
   http://localhost:3000/bubble-demo
   ```
   - Move your mouse around
   - Toggle dark mode
   - See color explanations

2. **Add to other pages**
   ```tsx
   import { BubbleBackground } from '@/components/ui/bubble-background';
   ```

---

## 📊 Technical Details

### Animation Loop
- Uses `requestAnimationFrame` for smooth 60fps
- Clears and redraws canvas each frame
- Updates bubble positions with physics

### Interactive Mode
- Tracks mouse position
- Calculates distance to each bubble
- Applies repulsion force within 150px radius
- Bubbles smoothly avoid cursor

### Edge Handling
- Bubbles wrap around screen edges
- Creates infinite scrolling effect
- No sudden disappearances

### Dark Mode Detection
- Checks `document.documentElement.classList.contains('dark')`
- Switches color palette automatically
- No flashing or re-renders

---

## 🎯 Best Practices

### 1. **Layer Content Above Background**
Always use `relative` positioning and `z-10` or higher:

```tsx
<div className="relative min-h-screen">
  <BubbleBackground className="absolute inset-0" />
  <div className="relative z-10">
    {/* Your content */}
  </div>
</div>
```

### 2. **Use Backdrop Blur for Readability**
Cards and text over bubbles should have backdrop blur:

```tsx
<Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
```

### 3. **Adjust Bubble Count for Performance**
Mobile devices: 10-15 bubbles  
Desktop: 20-30 bubbles

### 4. **Test in Both Modes**
Always check light and dark mode to ensure colors work well

---

## ✨ Summary

**Created:**
- ✅ `BubbleBackground` component with Marshmallow colors
- ✅ Interactive mode with mouse tracking
- ✅ Demo page at `/bubble-demo`
- ✅ Auto dark mode detection
- ✅ Smooth 60fps animation
- ✅ Fully responsive

**Marshmallow Theme:**
- ✅ Gray scale (300-500 light, 600-800 dark)
- ✅ Brand purple (400-600)
- ✅ Subtle opacity for background effect
- ✅ Matches existing color palette

**Files Created:**
```
apps/web/src/
  ├── components/ui/bubble-background.tsx
  └── app/bubble-demo/page.tsx
```

Your bubble background is ready to use anywhere in your app! 🎨✨

