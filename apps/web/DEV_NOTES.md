# Web App Development Notes

## ⚠️ Important: Styles Not Working?

If Tailwind CSS styles suddenly stop applying:

1. **Hard refresh**: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. **Clean restart**: `pnpm run dev:clean`
3. **Deep clean**: `pnpm run clean:all && pnpm install && pnpm dev`

## Quick Commands

```bash
# Start development server
pnpm dev

# Start with clean cache (use after config changes)
pnpm run dev:clean

# Deep clean (clears .next, node_modules/.cache, .turbo)
pnpm run clean:all
```

## When to Use `dev:clean`

Always clean cache after modifying:
- ✅ `tailwind.config.ts`
- ✅ `postcss.config.mjs`
- ✅ `globals.css` (CSS variables)
- ✅ Font configurations in `layout.tsx`
- ✅ Logo component or image paths
- ✅ Any component using `@layer` directives

## Tips

- Keep dev server running while coding
- Use incognito mode to test without cache
- If styles break, **hard refresh first** before investigating code
- After pulling changes from git, run `dev:clean`

See `/TROUBLESHOOTING.md` for detailed guide.

