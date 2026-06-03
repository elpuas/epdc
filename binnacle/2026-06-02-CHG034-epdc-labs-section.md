# 2026-06-02 - CHG034 - Add EPDC Labs section

## What changed
- Added a new `labs` Astro content collection in `src/content/config.ts`.
- Added multilingual lab entries for `EPDC Conversations`:
  - `src/content/labs/epdc-conversations.en.mdx`
  - `src/content/labs/epdc-conversations.es.mdx`
  - `src/content/labs/epdc-conversations.it.mdx`
- Added shared labs data helpers in `src/data/labs.ts`.
- Added a shared index renderer in `src/components/CollectionIndexPage.astro`.
- Added labs index and detail routes for:
  - `/epdc-labs`
  - `/epdc-labs/[slug]`
  - `/en/epdc-labs`
  - `/en/epdc-labs/[slug]`
  - `/es/epdc-labs`
  - `/es/epdc-labs/[slug]`
  - `/it/epdc-labs`
  - `/it/epdc-labs/[slug]`

## Reuse strategy
- Reused `src/components/BlogCard.astro` instead of creating a separate labs card component.
- Reused `src/layouts/BlogPost.astro` for single lab entries by extending it to support labs metadata.
- Reused `src/styles/BlogIndex.module.css` for the labs landing page structure and spacing.

## Implementation notes
- Added typed labs fields for excerpt, publish date, featured image, tags, GitHub link, demo link, language, and public slug.
- Used `publicSlug` instead of Astro's reserved `slug` field so translated entries can share the same public URL segment without conflicting in the content store.
- Kept the visual direction intentionally restrained and technical by staying inside the existing blog typography and spacing system.

## Validation notes
- `pnpm` is unavailable in this environment, so validation was run with `npm run build`.
- Astro build completed successfully after the new routes and collection were added.
- Generated routes were verified in `dist/` for root, English, Spanish, and Italian labs pages.
