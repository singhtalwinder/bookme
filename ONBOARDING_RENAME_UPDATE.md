# Onboarding Rename & URL Tracking Update

## Changes Made

### 1. Renamed Route
- **Old**: `/signup`
- **New**: `/onboarding`
- Directory moved from `/apps/web/src/app/signup/` to `/apps/web/src/app/onboarding/`

### 2. URL Step Tracking
Each step in the onboarding wizard is now tracked in the URL with query parameters:
- Step 1: `/onboarding?step=1`
- Step 2: `/onboarding?step=2`
- Step 3: `/onboarding?step=3`
- Step 4: `/onboarding?step=4`
- Step 5: `/onboarding?step=5`
- Step 6: `/onboarding?step=6`

### 3. Benefits of URL Tracking

**User Experience:**
- Users can bookmark specific steps
- Browser back/forward buttons work correctly
- Refreshing the page maintains the current step
- Users can share links to specific steps (if they have a valid session)
- Better for analytics tracking

**Developer Benefits:**
- Easier debugging (can see which step a user is on from URL)
- Can deep link users to specific steps if needed
- State is preserved in URL, not just component state

### 4. Technical Implementation

**Key Features:**
```typescript
// Read step from URL on mount
const stepFromUrl = parseInt(searchParams.get('step') || '1', 10);

// Update URL when step changes (without page reload)
const updateStepInUrl = (step: number) => {
  const params = new URLSearchParams(searchParams.toString());
  params.set('step', step.toString());
  router.push(`/onboarding?${params.toString()}`, { scroll: false });
  setCurrentStep(step);
};

// Sync with URL changes (browser back/forward)
useEffect(() => {
  const urlStep = parseInt(searchParams.get('step') || '1', 10);
  if (urlStep >= 1 && urlStep <= totalSteps && urlStep !== currentStep) {
    setCurrentStep(urlStep);
  }
}, [searchParams, currentStep, totalSteps]);
```

**Suspense Boundary:**
- Added Suspense wrapper since we're using `useSearchParams` hook
- Shows loading state while URL params are being read
- Required by Next.js 15 for client components using search params

### 5. Files Modified

**Route Files:**
- `apps/web/src/app/onboarding/page.tsx` (renamed from signup)
  - Added `useSearchParams` import
  - Added URL step tracking logic
  - Added Suspense boundary wrapper
  - Changed function name from `SignupPage` to `OnboardingPage`

**Middleware:**
- `apps/web/src/middleware.ts`
  - Updated `/signup` → `/onboarding` in public routes
  - Updated `/signup` → `/onboarding` in auth pages redirect list

**Other References:**
- `apps/web/src/app/create-account/page.tsx` - Updated redirect after OTP
- `apps/web/src/components/shadcn-studio/blocks/login-page-01/login-page-01.tsx` - Updated link
- `apps/web/src/components/examples/login-form-example.tsx` - Updated link

### 6. User Flow

1. **Create Account** → `/create-account`
   - Enter email & password
   - Verify OTP

2. **Onboarding** → `/onboarding?step=1`
   - Step 1: Personal Info → `/onboarding?step=1`
   - Step 2: Business Details → `/onboarding?step=2`
   - Step 3: Industry → `/onboarding?step=3`
   - Step 4: Service Locations → `/onboarding?step=4`
   - Step 5: Current Software → `/onboarding?step=5`
   - Step 6: Referral Source → `/onboarding?step=6`

3. **Complete** → `/dashboard`

### 7. Backward Compatibility

**Breaking Changes:**
- Direct links to `/signup` will need to be updated to `/onboarding`
- Any bookmarks users have to `/signup` will redirect to login (due to middleware)
- No breaking changes to data or API

**Migration Notes:**
- The middleware redirects authenticated users from `/onboarding` to `/dashboard`
- Unauthenticated users can access `/onboarding` only with valid pending signup session
- Old `/signup` route no longer exists (folder renamed)

### 8. Testing Checklist

- [ ] Navigate to `/onboarding` without session → redirects to `/create-account`
- [ ] Complete create-account → redirects to `/onboarding?step=1`
- [ ] Click "Next" → URL updates to `/onboarding?step=2`
- [ ] Click "Previous" → URL updates to `/onboarding?step=1`
- [ ] Refresh page at step 3 → stays on step 3
- [ ] Use browser back button → goes to previous step with correct URL
- [ ] Use browser forward button → goes to next step with correct URL
- [ ] Manually enter `/onboarding?step=5` in URL → goes to step 5 (if valid session)
- [ ] Enter invalid step like `/onboarding?step=99` → defaults to step 1
- [ ] Complete all steps → creates account and redirects to dashboard
- [ ] Try to access `/onboarding` when authenticated → redirects to dashboard

### 9. Analytics Tracking

With URL-based step tracking, you can now:
- Track which steps users drop off at (via URL in analytics)
- See average time spent on each step (by tracking URL changes)
- Identify problematic steps where users bounce
- Create funnels based on URL patterns

**Example Google Analytics Event:**
```javascript
// Track step view
gtag('event', 'onboarding_step_view', {
  step_number: 3,
  step_name: 'Industry',
  page_path: '/onboarding?step=3'
});
```

### 10. Future Enhancements

Potential improvements now that we have URL tracking:
- Add step slugs: `/onboarding/personal-info` instead of `?step=1`
- Save progress: Allow users to return to incomplete onboarding later
- Skip steps: Allow certain steps to be optional with URL control
- A/B testing: Test different step orders or content per step
- Direct deep links: Send users to specific steps via email/SMS

