# CHG032: Comprehensive Icon Configuration Update

## Description
Updated the Astro icon configuration with a complete set of Phosphor icons used throughout the site, including both regular and bold variants.

## Reason
The site was still experiencing icon loading errors with certain Phosphor icons that weren't properly included in the configuration. This comprehensive update ensures all icons used across the site are properly configured.

## Files Touched
- astro.config.mjs

## Affected Components/Routes
- All pages and components using Phosphor icons

## Changes Made
- Organized icons into regular and bold sections for better maintainability
- Added previously missing icons:
  - Added 'cpu' regular variant
  - Added bold variants for all icons: flask-bold, shopping-cart-bold, etc.
- Ensured complete parity between regular and bold variants
- Fixed alphabetical ordering of icons for easier maintenance 