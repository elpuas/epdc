# Changelog Entry – CHG008

**Date:** 2025-04-17  
**ID:** CHG008  
**Type:** Fix  
**Summary:** Prevented LanguageSwitcher crash due to missing currentLang on blog post routes

## Details

- Fixed BlogPost layout to extract and pass the `lang` property to `Header` and `Footer` components
- Added fallback to LanguageSwitcher to default to 'en' if currentLang is undefined
- Properly mapped image/date fields from content schema to heroImage/pubDate properties used in template
- Updated FormattedDate component to handle undefined date values gracefully
- Ensured type safety using Language type

## Affected Files

- `/src/components/LanguageSwitcher.astro`
- `/src/layouts/BlogPost.astro`
- `/src/components/FormattedDate.astro` 