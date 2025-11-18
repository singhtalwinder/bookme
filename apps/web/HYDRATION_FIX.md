# 🔧 Hydration Error Fixes

**Date:** November 17, 2025  
**Issues Fixed:** Hydration mismatch + Bubble background SSR

---

## ❌ Problems Identified

### 1. Hydration Mismatch Error
**Error:** Server rendered HTML didn't match client  
**Location:** `/forgot-password` page  
**Cause:** 
- Possible cached build with old Label component
- `autoFocus` attribute (client-only)
- Server/client rendering differences

### 2. Bubble Background Not Working
**Issue:** Component tried to access `window` and `document` during SSR  
**Cause:** Canvas API and browser APIs not available on server

---

## ✅ Fixes Applied

### 1. Forgot Password Page

**Changes:**
- ✅ Removed `autoFocus` (causes hydration issues)
- ✅ Added `name="email"` attribute (best practice)
- ✅ Ensured consistent label rendering
- ✅ Cleared Next.js build cache (`.next` folder)

**Before:**
```tsx
<input
  id="email"
  type="email"
  autoFocus  // ❌ Client-only, causes hydration mismatch
  ...
/>
```

**After:**
```tsx
<input
  id="email"
  name="email"  // ✅ Added for form submission
  type="email"
  // ✅ Removed autoFocus
  ...
/>
```

### 2. Bubble Background Component

**Changes:**
- ✅ Added `isMounted` state to track client-side rendering
- ✅ Return placeholder div during SSR
- ✅ Only initialize canvas after mount
- ✅ Added `isMounted` to useEffect dependencies

**Before:**
```tsx
useEffect(() => {
  const canvas = canvasRef.current;
  // ❌ window/document accessed immediately
  canvas.width = canvas.offsetWidth * window.devicePixelRatio;
  ...
}, [interactive, bubbleCount]);
```

**After:**
```tsx
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

useEffect(() => {
  if (!isMounted) return;  // ✅ Skip on server
  const canvas = canvasRef.current;
  // ✅ Safe to access window/document
  ...
}, [interactive, bubbleCount, isMounted]);

// ✅ Return placeholder during SSR
if (!isMounted) {
  return <div className={...} />;
}
```

---

## 🧪 Testing

### Clear Build Cache
```bash
cd apps/web
rm -rf .next
pnpm dev
```

### Test Forgot Password Page
1. Visit `http://localhost:3000/forgot-password`
2. ✅ No hydration errors in console
3. ✅ Form renders correctly
4. ✅ Input field works
5. ✅ Submit button works

### Test Bubble Background
1. Visit `http://localhost:3000/bubble-demo`
2. ✅ No SSR errors
3. ✅ Bubbles animate smoothly
4. ✅ Interactive mode works
5. ✅ Dark mode works

---

## 📝 Best Practices Applied

### 1. Avoid Client-Only Attributes in SSR
- ❌ `autoFocus` - Only works on client
- ✅ Use `useEffect` to focus after mount if needed

### 2. Handle Browser APIs Safely
```tsx
// ❌ Bad
useEffect(() => {
  window.something();  // Crashes on server
}, []);

// ✅ Good
const [isMounted, setIsMounted] = useState(false);
useEffect(() => {
  setIsMounted(true);
}, []);
useEffect(() => {
  if (!isMounted) return;
  window.something();  // Safe
}, [isMounted]);
```

### 3. Consistent Server/Client Rendering
- Use native HTML elements consistently
- Avoid conditional rendering based on `typeof window`
- Clear build cache when making structural changes

---

## 🚨 Common Hydration Issues

### Causes:
1. **Server/client branch** - `if (typeof window !== 'undefined')`
2. **Random values** - `Math.random()`, `Date.now()`
3. **Browser APIs** - `window`, `document`, `localStorage`
4. **Invalid HTML nesting** - React warnings
5. **Browser extensions** - Modify HTML before React loads

### Solutions:
1. ✅ Use `useState` + `useEffect` for client-only code
2. ✅ Generate random values in `useEffect`
3. ✅ Check `isMounted` before accessing browser APIs
4. ✅ Fix HTML structure issues
5. ✅ Test in incognito mode (no extensions)

---

## ✨ Summary

**Fixed:**
- ✅ Hydration mismatch on forgot password page
- ✅ Bubble background SSR errors
- ✅ Removed `autoFocus` (hydration issue)
- ✅ Added proper client-side mounting check
- ✅ Cleared build cache

**Result:**
- ✅ No more hydration errors
- ✅ Bubble background works correctly
- ✅ All pages render consistently
- ✅ Better SSR compatibility

**Files Updated:**
```
apps/web/src/
  ├── app/forgot-password/page.tsx
  └── components/ui/bubble-background.tsx
```

Your app now has proper SSR handling and no hydration errors! 🎉✨

