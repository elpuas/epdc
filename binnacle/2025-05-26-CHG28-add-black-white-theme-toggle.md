# CHG28 - Add Black and White Theme Toggle

**Date**: 2025-05-26  
**Type**: Feature Implementation  
**Status**: Completed

## Description
Implemented a black-and-white mode toggle across the entire site using CSS custom properties and data attributes. This provides users with a grayscale viewing option without affecting layout or accessibility.

## Reason
- Enhance user experience with alternative viewing mode
- Provide accessibility option for users who prefer high contrast
- Demonstrate advanced CSS theming capabilities
- Add modern UI feature without breaking existing design

## Technical Implementation

### 1. CSS Variables (variables.css)
- Added `:root[data-theme='bw']` selector with grayscale color overrides
- Mapped all color variables to appropriate grayscale values:
  - `--color-primary`: #ffffff (white)
  - `--color-secondary`: #000000 (black)
  - `--color-tertiary`: #666666 (medium gray)
  - `--color-quaternary`: #cccccc (light gray)
  - `--color-white`: #000000 (inverted)
  - `--color-black`: #ffffff (inverted)

### 2. Layout Integration (Layout.astro)
- Added `data-theme="light"` attribute to `<html>` element
- Implemented theme toggle script with DOM event handling
- Added accessibility features with dynamic aria-label updates
- Toggle button switches between light and bw themes

### 3. Header Component (Header.astro)
- Added black-and-white toggle button below LanguageSwitcher
- Implemented proper accessibility with aria-label
- Used semantic button with ID `bw-toggle`
- Added emoji icons (⚫/🎨) for visual feedback

### 4. Header Styling (Header.module.css)
- Created `.headerControls` container for toggle and language switcher
- Styled `.bwToggle` button with:
  - Circular design with border
  - Hover effects and focus states
  - Responsive sizing for mobile
  - Proper color transitions

## Files Modified
- `src/styles/variables.css` - Added black-and-white theme variables
- `src/layouts/Layout.astro` - Added data-theme attribute and toggle script
- `src/components/Header.astro` - Added toggle button and controls container
- `src/styles/Header.module.css` - Added styling for toggle and controls

## Components Affected
- **Layout.astro**: Core theme switching functionality
- **Header.astro**: Toggle button placement and accessibility
- **All components**: Inherit theme changes through CSS variables

## Routes Affected
- **All routes**: Theme toggle available site-wide through header
- **Multilingual**: Works across all language versions (EN/ES/IT)

## Accessibility Features
- Proper ARIA labels with dynamic updates
- Keyboard accessible button
- Focus indicators
- High contrast in both modes
- No layout shifts during theme changes

## User Experience
- Instant theme switching without page reload
- Visual feedback with emoji icons
- Smooth transitions between themes
- Non-persistent (resets on page refresh)
- Available on all pages through header

## Testing Notes
- Theme toggle works across all pages
- No layout breaks in either mode
- Accessibility features function correctly
- Mobile responsive design maintained
- Color contrast improved in BW mode 