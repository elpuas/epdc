# Language Switcher Icon Update

## Description
Updated the language selector component to use circle-flags icons from Astro Icons instead of emoji flags, providing a more consistent and visually clear language switching experience.

## Reason
To improve visual consistency and accessibility across the site by using proper vector flag icons instead of emoji characters that may render differently across devices.

## Files Touched
- `src/components/LanguageSwitcher.astro`

## Implementation Details

### Changes Made
- Imported the `Icon` component from `astro-icon/components`
- Replaced emoji flags with proper circle-flags iconset:
  - 🇺🇸 → `circle-flags:us` for English
  - 🇨🇷 → `circle-flags:es` for Spanish
  - 🇮🇹 → `circle-flags:it` for Italian
- Added proper `aria-label` attributes to improve accessibility
- Standardized icon size to 24×24 pixels for consistency

### Benefits
- Vector-based icons scale better on high-DPI displays
- Consistent appearance across all devices and browsers
- Improved accessibility with proper labeling
- Better visual hierarchy in the language selector
- No functional changes to the language switching logic

## Notes
This change maintains all existing functionality while improving the visual presentation of the language selector. The circle-flags iconset provides standardized, high-quality flag icons that align better with the site's design system. 