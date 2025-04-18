# Changelog Entry – CHG015

**Date:** 2025-04-17  
**ID:** CHG015  
**Type:** Feature  
**Summary:** Added animated rotating verb in hero message

## Details

- Created a new Hero component with animated verb rotation
- Words rotate every 3 seconds with a smooth fade transition
- Added localized verb lists for English, Spanish and Italian
- Implemented using vanilla JavaScript without external libraries
- Made accessible with aria-live="polite" attribute
- Added progressive enhancement with a default verb fallback

## Affected Files

- `/src/components/Hero.astro` (new file)
- `/src/pages/en/index.astro`
- `/src/pages/es/index.astro`
- `/src/pages/it/index.astro` 