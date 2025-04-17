# Font System Implementation

## Description
Updated the typography system in global.css to use design tokens for consistent typography across the application.

## Reason
To establish a consistent and maintainable typography system that follows the design system specifications.

## Files Touched
- `src/styles/variables.css`
- `src/styles/global.css`

## Changes Made
- Added font family tokens to variables.css:
  - `--font-family-base`
  - `--font-family-heading`
- Added font weight tokens to variables.css:
  - `--font-weight-regular`
  - `--font-weight-bold`
- Updated global.css typography:
  - Imported variables.css
  - Updated @font-face declarations to use weight tokens
  - Implemented base typography using design tokens
  - Added heading hierarchy with proper font sizes
  - Standardized base text elements
- All font sizes use existing design tokens
- Line heights standardized using `--lineheight-base` and `--lineheight-heading`

## Validation
- All font families use CSS variables
- No hardcoded font sizes
- Consistent line heights applied
- Proper font weights for headings and body text
- Maintained existing @font-face declarations 