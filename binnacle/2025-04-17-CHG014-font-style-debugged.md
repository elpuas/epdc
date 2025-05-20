# Font Style Debugging

## Root Cause
Font and style variables were not being applied due to:
1. Missing global styles import in Layout.astro
2. Scoped styles in Layout.module.css potentially overriding global typography
3. Incorrect CSS nesting structure in Layout.module.css

## Files Updated
- `src/layouts/Layout.astro`
- `src/styles/Layout.module.css`

## Changes Made
1. Added global.css import to Layout.astro
2. Restructured Layout.module.css to:
   - Properly close CSS blocks
   - Remove potential typography overrides
   - Maintain grid layout without affecting typography
3. Ensured proper CSS cascade order:
   - Global styles (variables.css, global.css)
   - Layout-specific styles (Layout.module.css)

## Before/After Behavior
Before:
- Font variables not consistently applied
- Potential style conflicts between global and scoped CSS
- Typography styles possibly overridden by layout styles

After:
- Global typography system properly applied
- Clear separation between layout and typography styles
- Consistent font family and sizes across the site 