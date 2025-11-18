# Troubleshooting Guide

## Tailwind CSS Not Working / Styles Missing

If you see unstyled components or Tailwind classes not applying, try these steps in order:

### 1. Hard Refresh Browser
- **Mac**: `Cmd + Shift + R`
- **Windows/Linux**: `Ctrl + Shift + R`
- Or open an incognito/private window

### 2. Clean and Restart Dev Server
```bash
cd apps/web
pnpm run dev:clean
```

### 3. Deep Clean (if step 2 doesn't work)
```bash
cd apps/web
pnpm run clean:all
pnpm install
pnpm dev
```

### 4. Nuclear Option (if all else fails)
```bash
# From project root
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
rm -rf apps/*/.next
rm -rf .turbo
pnpm install
cd apps/web && pnpm dev
```

## When to Clean Cache

You should clean the cache when:
- ✅ Changing font configurations
- ✅ Modifying logo/image components
- ✅ Updating Tailwind config
- ✅ Changing CSS variable values
- ✅ Modifying postcss.config.mjs
- ✅ After pulling major changes
- ✅ Styles suddenly stop working

## Quick Commands

```bash
# Clean dev cache and restart
pnpm run dev:clean

# Deep clean everything
pnpm run clean:all

# Just clean .next folder
pnpm run clean
```

## Prevention Tips

1. **Always use `dev:clean` after modifying:**
   - `tailwind.config.ts`
   - `postcss.config.mjs`
   - `globals.css`
   - Font configurations
   - Logo/image components

2. **If you see any styling issues, try a hard refresh FIRST** before assuming code is broken

3. **Use incognito mode** for testing to avoid cache issues

## Common Issues

### Issue: Buttons/Links are unstyled
**Solution**: Hard refresh or run `pnpm run dev:clean`

### Issue: Colors are wrong/missing
**Solution**: Check if globals.css is imported in layout.tsx, then clean cache

### Issue: Fonts not loading
**Solution**: Clean cache with `pnpm run clean:all` and restart

### Issue: Logo/images not appearing
**Solution**: Check the public folder, then hard refresh browser

## Development Best Practices

1. Keep dev server running while making changes
2. If you change configuration files, always restart dev server
3. Test in incognito mode before concluding there's a bug
4. When in doubt, clean and restart

