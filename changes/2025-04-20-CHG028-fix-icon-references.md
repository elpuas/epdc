# Fix Growth Plan Icon Reference

## Description
Updated the Growth pricing plan to use the "chart-line-up-bold" icon instead of "trending-up" which wasn't available in the Phosphor icon set.

## Reason
The services page was showing errors for the "trending-up" icon because it wasn't available in the configured Phosphor icon set.

## Files Modified
- `/src/pages/en/services.astro`

## Changes Made
1. Changed the Growth pricing plan icon from `ph:trending-up` to `ph:chart-line-up-bold`
2. The "chart-line-up-bold" icon better represents growth and was already configured in our icon set

## Components Affected
- PricingCard component in the services page 