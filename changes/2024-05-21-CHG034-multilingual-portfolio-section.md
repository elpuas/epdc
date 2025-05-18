---
title: "Add Multilingual Portfolio Section"
date: "2024-05-21"
id: "CHG034"
change_type: "feature"
priority: "high"
---

## Change Description
Added a complete multilingual portfolio section named "crafted-with-love" that mirrors the blog system architecture. This implementation provides a showcase for client projects with full language support (English, Spanish, Italian).

## Rationale
The portfolio section is essential to showcase our work and capabilities to potential clients in their preferred language, maintaining consistent user experience across the site.

## Implementation Details

### Files Added/Modified:
- `src/content/config.ts` - Added portfolio collection schema
- `src/components/ProjectCard.astro` - Created card component for portfolio grid
- `src/layouts/ProjectLayout.astro` - Created layout for individual project pages
- `src/pages/[lang]/crafted-with-love/index.astro` - Added index pages for each language
- `src/pages/[lang]/crafted-with-love/[slug].astro` - Added dynamic project routes
- `src/content/portfolio/*.mdx` - Added sample portfolio items in three languages

### Key Features:
- MDX-driven content with frontmatter for metadata
- Responsive card grid layout with hover effects
- Language-specific filtering of portfolio items
- Consistent styling with the rest of the site
- SEO-friendly metadata and image handling
- Sample projects demonstrating the system capabilities

## Related Changes
- None

## Testing Notes
Tested portfolio section in all three languages, ensuring proper routing and content display. 