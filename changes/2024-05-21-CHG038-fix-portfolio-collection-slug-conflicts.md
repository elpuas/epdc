---
title: "Fix Portfolio Collection Slug Conflicts"
date: "2024-05-21"
id: "CHG038"
change_type: "fix"
priority: "high"
---

## Change Description
Fixed an issue where portfolio projects weren't displaying correctly across all languages due to slug conflicts between the different language versions of the same project.

## Rationale
The portfolio section was only partially working - Spanish showed one project, Italian showed a different project, and English showed no projects at all. This was caused by slug conflicts in the MDX files where different language versions of the same project were using identical slugs. By following the same pattern as the blog (making slugs language-specific), we can ensure all projects display properly in each language.

## Implementation Details

### Files Modified:
- `src/content/portfolio/first-project.en.mdx` - Updated slug to "monkey-scrubs-ecommerce-en"
- `src/content/portfolio/first-project.es.mdx` - Updated slug to "monkey-scrubs-ecommerce-es"
- `src/content/portfolio/first-project.it.mdx` - Updated slug to "monkey-scrubs-ecommerce-it"
- `src/content/portfolio/second-project.en.mdx` - Updated slug to "fishcostarica-tourism-en"
- `src/content/portfolio/second-project.es.mdx` - Updated slug to "fishcostarica-tourism-es"
- `src/content/portfolio/second-project.it.mdx` - Updated slug to "fishcostarica-tourism-it"

### Changes:
- Made all slugs unique by appending language code (-en, -es, -it) to end of each slug
- This prevents slugs from different language versions of the same project from conflicting
- Follows the same pattern used in the blog collection for multilingual content

## Issue Root Cause
In Astro's content collection system, slugs must be unique across all entries in a collection regardless of language. The issue was that different language versions of the same project were using identical slugs (e.g., "monkey-scrubs-ecommerce" for EN/ES/IT versions), causing the system to only recognize one of them and discard or override the others.

## Testing Notes
Verified that all three language versions of the portfolio now correctly display both projects in their respective languages. 