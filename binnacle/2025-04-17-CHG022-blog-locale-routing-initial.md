# Changelog Entry – CHG022

**Date:** 2025-04-17
**ID:** CHG022
**Type:** Feature
**Summary:** Initial setup for blog i18n with localized `[slug].astro` routes and test posts.

## Details

- Renamed `/src/pages/blog/[...slug].astro` to `/src/pages/en/blog/[slug].astro`.
- Created localized route files:
    - `/src/pages/es/blog/[slug].astro`
    - `/src/pages/it/blog/[slug].astro`
- Updated `getStaticPaths` in each route file to filter blog posts based on the `lang` frontmatter property (`en`, `es`, `it`) and use `post.slug` for parameters.
- Created basic test posts with corresponding `lang` properties:
    - `hello-en.mdx` (`lang: en`)
    - `hola-es.mdx` (`lang: es`)
    - `ciao-it.mdx` (`lang: it`)
- Verified that test posts render correctly at their respective localized URLs.

## Affected Files

- `/src/pages/en/blog/[slug].astro` (Renamed from `/src/pages/blog/[...slug].astro` and modified)
- `/src/pages/es/blog/[slug].astro` (New file)
- `/src/pages/it/blog/[slug].astro` (New file)
- `/src/content/blog/hello-en.mdx` (New file)
- `/src/content/blog/hola-es.mdx` (New file)
- `/src/content/blog/ciao-it.mdx` (New file)
