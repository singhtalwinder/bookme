# Phase 1 Testing Guide

Quick guide to manually test and verify the Phase 1 setup.

## Prerequisites

Before testing, ensure you have:
- Installed dependencies: `pnpm install`
- Started Supabase: `cd packages/db && supabase start`
- Applied migrations: `pnpm --filter db migrate`
- Configured `.env.local` with Supabase keys

## Test Checklist

### 1. Installation & Build ✓

```bash
# Test workspace structure
pnpm list --depth 0

# Expected output:
# bookme
# ├── web (workspace app)
# ├── ui (workspace package)
# ├── db (workspace package)
# └── functions (workspace package)
```

### 2. Type Checking ✓

```bash
# Should complete with no errors
pnpm type-check
```

### 3. Linting ✓

```bash
# Should pass all rules
pnpm lint
```

### 4. Development Server ✓

```bash
# Start the dev server
pnpm dev

# Server should start at http://localhost:3000
```

### 5. UI Components Test Page ✓

Once the dev server is running:

1. **Visit Homepage**: http://localhost:3000
   - Should see "BookMe Platform" title
   - Should see "Phase 1 Setup Complete" message
   - Should see "Test UI Components →" button

2. **Click "Test UI Components" or visit**: http://localhost:3000/test-components

3. **Test Each Component**:

   #### Buttons
   - [ ] Primary button renders in blue
   - [ ] All 5 variants display correctly (primary, secondary, outline, ghost, danger)
   - [ ] Small, medium, large sizes work
   - [ ] Click "Click to Load" - should show loading spinner for 2 seconds
   - [ ] Disabled buttons are not clickable

   #### Inputs
   - [ ] Type in "Email Address" field - value appears in blue box below
   - [ ] Password field hides characters
   - [ ] Error input shows red border and error message
   - [ ] Helper text appears in gray below inputs
   - [ ] Disabled input cannot be edited
   - [ ] All labels are aligned properly

   #### Selects
   - [ ] "Choose a Service" dropdown opens with 5 options
   - [ ] Selecting an option shows value in green box below
   - [ ] User Role dropdown has 6 options
   - [ ] Error select shows red border
   - [ ] Disabled select cannot be opened

   #### Date Pickers
   - [ ] "Select Appointment Date" opens calendar picker
   - [ ] Selecting a date shows formatted date in purple box
   - [ ] "With Min/Max" restricts dates to 2025
   - [ ] Disabled date picker cannot be changed

   #### Dialog
   - [ ] Click "Open Dialog" button
   - [ ] Modal appears with backdrop
   - [ ] Press ESC key - dialog closes
   - [ ] Click "Open Dialog" again
   - [ ] Click backdrop - dialog closes
   - [ ] Open dialog, click "Confirm" - shows alert then closes
   - [ ] Open dialog, click "Cancel" - closes without alert
   - [ ] While dialog is open, background should not scroll

   #### Combined Form
   - [ ] Fill out all fields in the form
   - [ ] Click "Book Appointment" - should show alert
   - [ ] All validation works (required fields)

### 6. Supabase Database ✓

Visit http://localhost:54323 (Supabase Studio):

1. **Navigate to SQL Editor**
   - Run: `SELECT * FROM pg_extension WHERE extname IN ('uuid-ossp', 'pg_trgm');`
   - Should see both extensions installed

2. **Check Custom Types**
   ```sql
   SELECT typname FROM pg_type 
   WHERE typname IN (
     'user_role', 
     'appointment_status', 
     'appointment_source',
     'integration_provider',
     'notification_type'
   );
   ```
   - Should return all 5 custom types

3. **Test RLS Helper Function**
   ```sql
   SELECT auth.org_id();
   ```
   - Should return NULL (no authenticated user yet)
   - Function should exist without errors

### 7. Responsive Design ✓

On the test components page:

1. **Desktop** (> 1024px):
   - [ ] Layout is centered with max-width
   - [ ] All components display properly

2. **Tablet** (768px - 1024px):
   - [ ] Components stack appropriately
   - [ ] Forms remain usable

3. **Mobile** (< 768px):
   - [ ] Test components page scrolls smoothly
   - [ ] Dialog fills screen appropriately
   - [ ] Buttons and inputs are touch-friendly
   - [ ] Text remains readable

### 8. Browser Compatibility ✓

Test in:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)

All components should work identically across browsers.

### 9. Accessibility ✓

On test components page:

1. **Keyboard Navigation**:
   - [ ] Tab through all interactive elements
   - [ ] Order is logical (top to bottom)
   - [ ] Focus indicators are visible
   - [ ] Enter/Space activates buttons

2. **Screen Reader** (optional):
   - [ ] All inputs have proper labels
   - [ ] Error messages are announced
   - [ ] Dialog has ARIA labels

3. **Color Contrast**:
   - [ ] Text is readable on all backgrounds
   - [ ] Error messages are distinguishable

### 10. Performance ✓

1. **Dev Server**:
   - [ ] Hot reload works (edit a file, saves automatically)
   - [ ] No console errors in browser
   - [ ] Page loads in < 2 seconds

2. **Build Production**:
   ```bash
   pnpm --filter web build
   ```
   - [ ] Build completes successfully
   - [ ] No TypeScript errors
   - [ ] No build warnings

## Common Issues & Solutions

### Issue: Cannot find module 'ui'
**Solution**: 
```bash
pnpm install
```

### Issue: Supabase connection error
**Solution**:
```bash
cd packages/db
supabase stop
supabase start
# Update .env.local with new keys
```

### Issue: Port 3000 already in use
**Solution**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
PORT=3001 pnpm dev
```

### Issue: Tailwind styles not loading
**Solution**:
```bash
# Restart dev server
# Or clear .next cache
rm -rf apps/web/.next
pnpm dev
```

### Issue: Type errors in IDE
**Solution**:
```bash
# Regenerate types
pnpm type-check
# Restart TypeScript server in VS Code (Cmd+Shift+P > "TypeScript: Restart TS Server")
```

## Success Criteria

Phase 1 is successfully tested if:

✅ All dev scripts run without errors
✅ All UI components render correctly
✅ All components are interactive and functional
✅ Supabase database has migrations applied
✅ RLS helper function exists
✅ No console errors in browser
✅ Production build completes successfully
✅ All 5 workspaces are properly linked

## Screenshots (Optional)

You can take screenshots of:
1. Homepage with test button
2. Test components page
3. Dialog open
4. Supabase Studio showing extensions
5. Combined form filled out

## Next Steps

Once all tests pass:

1. ✅ Phase 1 is complete
2. Review `bookme-full-implementation.plan.md`
3. Proceed to **Phase 2 (M0)**: Auth + Organizations + RLS

---

**Happy Testing!** 🚀

If you encounter any issues not listed here, check:
- `docs/SETUP.md` for detailed setup instructions
- `README.md` for project overview
- GitHub Issues (if applicable)

