# Changelog Entry – CHG009

**Date:** 2025-04-17  
**ID:** CHG009  
**Type:** Fix  
**Summary:** Fixed invalid fragment syntax in Italian blog post route

## Details

- Added missing frontmatter fences (`---`) to the Italian blog post template
- Proper separation of JavaScript and template markup in the Astro file
- Compared with working `en` and `es` templates before applying change
- Ensured consistent structure across all language routes

## Affected Files

- `/src/pages/it/blog/[slug].astro` 