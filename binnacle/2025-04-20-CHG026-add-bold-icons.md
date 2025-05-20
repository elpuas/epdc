# Add Bold Icons to Configuration

## Description
Updated the Astro icon configuration to include Phosphor bold icons used in the services page.

## Reason
The services page was showing errors for missing bold icons that weren't included in the icon configuration.

## Files Modified
- `/astro.config.mjs`

## Changes Made
1. Added the following bold icons to the Phosphor (ph) icon set configuration:
   - `cpu-bold`
   - `chart-line-up-bold`
   - `brain-bold`
   - `handshake-bold`

2. Reformatted the icon list for better readability with each icon type grouped logically

## Components Affected
- Icon components in the services page 