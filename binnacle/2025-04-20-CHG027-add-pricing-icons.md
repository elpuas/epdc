# Add Pricing Card Icons to Configuration

## Description
Updated the Astro icon configuration to include Phosphor icons used in the PricingCard component.

## Reason
The services page was showing errors for missing icons (`ph:browser`, `ph:trending-up`, and `ph:rocket-launch-bold`) that weren't included in the icon configuration.

## Files Modified
- `/astro.config.mjs`

## Changes Made
1. Added the following icons to the Phosphor (ph) icon set configuration:
   - `browser` (used in Starter pricing plan)
   - `trending-up` (used in Growth pricing plan)
   - `rocket-launch-bold` (used in Pro pricing plan)

2. Maintained consistent formatting with previous icon configuration changes

## Components Affected
- PricingCard component in the services page 