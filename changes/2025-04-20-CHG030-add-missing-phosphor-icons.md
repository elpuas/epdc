# CHG030: Add Missing Phosphor Icons

## Description
Added missing Phosphor icons to the Astro configuration to fix icon rendering issues.

## Reason
Several pages were using Phosphor icons that weren't included in the icon configuration, causing runtime errors.

## Files Touched
- astro.config.mjs

## Affected Components/Routes
- /en/about
- Any component using Phosphor icons

## Changes Made
- Added the following missing icons to the Phosphor icon set configuration:
  - handshake
  - rocket-launch
  - brain
  - magnifying-glass
  - pen-nib
  - truck
  - chart-line-up 