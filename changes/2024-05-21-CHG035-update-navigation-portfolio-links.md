---
title: "Update Navigation Links to Portfolio Section"
date: "2024-05-21"
id: "CHG035"
change_type: "fix"
priority: "medium"
---

## Change Description
Updated the navigation links in the header to properly point to the new multilingual portfolio section ("crafted-with-love"). This ensures users are directed to the new portfolio index pages instead of the placeholder pages.

## Rationale
After implementing the full portfolio section with index pages in each language, the navigation links needed to be updated to point to the correct routes. This change ensures consistent navigation throughout the site.

## Implementation Details

### Files Modified:
- `src/components/Header.astro` - Updated the "crafted-with-love" navigation link to include a trailing slash, directing users to the index page of the portfolio section

### Changes:
- Changed `/${lang}/crafted-with-love` to `/${lang}/crafted-with-love/` to ensure proper routing to the index pages

## Related Changes
- Related to CHG034 (Multilingual Portfolio Section Implementation)

## Testing Notes
Verified that clicking the "Crafted with Love" navigation link in any language correctly routes to the corresponding portfolio index page. 