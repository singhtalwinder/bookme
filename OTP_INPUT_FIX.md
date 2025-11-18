# OTP Input Field Fix

## Issue
The OTP input fields were not accepting any user input across multiple authentication pages. The component would display with placeholder "0"s but remain completely unresponsive to keyboard input.

## Root Causes
1. **Missing FormControl wrapper** - The `InputOTP` component from shadcn/ui was not wrapped with `FormControl` from react-hook-form
2. **Blocking div wrapper** - An extra `div` between `FormControl` and `InputOTP` prevented proper prop forwarding
3. **Incomplete field props** - Only `value` and `onChange` were passed instead of spreading all field props with `{...field}`

## Solution
Fixed the form integration in all three affected pages by:
1. Adding `FormControl` wrapper
2. Removing the blocking `div` between `FormControl` and `InputOTP`
3. Using the spread operator `{...field}` to pass all necessary props (value, onChange, onBlur, ref, name)

### Files Modified
1. `/apps/web/src/app/verify-otp/page.tsx`
2. `/apps/web/src/app/login/page.tsx`
3. `/apps/web/src/app/create-account/page.tsx`

### Code Change Pattern
**Before (Broken):**
```tsx
<FormItem>
  <FormLabel>Verification code</FormLabel>
  <div className="flex justify-center">
    <InputOTP
      maxLength={6}
      value={field.value}
      onChange={field.onChange}
    >
      <InputOTPGroup>
        {/* ... slots ... */}
      </InputOTPGroup>
    </InputOTP>
  </div>
  <FormMessage />
</FormItem>
```

**After (Fixed):**
```tsx
<FormItem className="flex flex-col items-center">
  <FormLabel>Verification code</FormLabel>
  <FormControl>
    <InputOTP
      maxLength={6}
      {...field}
    >
      <InputOTPGroup>
        {/* ... slots ... */}
      </InputOTPGroup>
    </InputOTP>
  </FormControl>
  <FormMessage />
</FormItem>
```

## Technical Details

### Why FormControl is Required
The `FormControl` component from shadcn/ui:
- Connects the input element to react-hook-form's field controller
- Passes necessary props like `onChange`, `onBlur`, `value`, `name`, and `ref` to the input
- Ensures proper form validation and state management
- Required for all custom input components used within `FormField`

### Why the Div Wrapper Was Removed
- `FormControl` uses `React.cloneElement` to inject props into its direct child
- Having a `div` between `FormControl` and `InputOTP` meant the props were injected into the div, not the input
- The `input-otp` library requires these props to be on the actual `InputOTP` component to function

### Why `{...field}` Instead of Individual Props
The `field` object from react-hook-form contains:
- `value` - Current input value
- `onChange` - Handler to update form state
- `onBlur` - Handler for blur events (needed for validation timing)
- `ref` - Reference for DOM manipulation and focus management
- `name` - Field identifier

Manually passing only `value` and `onChange` is insufficient - the missing `ref` prevents the input-otp library from properly accessing the underlying input element.

## Testing
After this fix, users should be able to:
- Click on any OTP slot to focus
- Type numbers 0-9 to fill in the verification code
- Use arrow keys to navigate between slots
- Use backspace to delete digits
- See the caret animation indicating focus

## Status
✅ Fixed - All OTP input fields now accept user input correctly

