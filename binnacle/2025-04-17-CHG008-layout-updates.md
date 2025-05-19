# Layout System Updates

## Description
Enhanced the layout system with internationalization support and improved container constraints.

## Reason
To provide:
- Consistent multilingual support across all layout components
- Better content width control with max-width constraints
- Improved responsive spacing using CSS custom properties

## Files Touched
- `src/layouts/Layout.astro`: Added language prop support
- `src/components/Header.astro`: Implemented translations
- `src/components/Footer.astro`: Implemented translations
- `src/styles/Layout.module.css`: Added max-width and improved spacing

## Updates Made

### Internationalization
- Added language prop passing from Layout to Header/Footer
- Implemented translation function usage in navigation
- Added fallback to English for missing translations
- Updated all hardcoded strings to use translation keys

### Layout Improvements
- Added max-width: 1240px constraint to body
- Implemented responsive padding using CSS custom properties
- Added visual separation for header/footer with borders
- Improved container spacing at different breakpoints

### CSS Variables Added
- `--space-inline`: Base horizontal padding (1rem)
- `--space-inline-lg`: Medium breakpoint padding (2rem)
- `--space-inline-xl`: Large breakpoint padding (3rem)

## Validation
- Verify translations work on /es route
- Check max-width constraint on large screens
- Confirm responsive padding adjustments
- Test header/footer borders and spacing 