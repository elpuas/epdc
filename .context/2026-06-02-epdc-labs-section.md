# 2026-06-02 — EPDC Labs Section

## Files Created
- `src/content/labs/epdc-conversations.en.mdx`
- `src/content/labs/epdc-conversations.es.mdx`
- `src/content/labs/epdc-conversations.it.mdx`
- `src/data/labs.ts`
- `src/components/CollectionIndexPage.astro`
- `src/pages/epdc-labs/index.astro`
- `src/pages/epdc-labs/[slug].astro`
- `src/pages/en/epdc-labs/index.astro`
- `src/pages/en/epdc-labs/[slug].astro`
- `src/pages/es/epdc-labs/index.astro`
- `src/pages/es/epdc-labs/[slug].astro`
- `src/pages/it/epdc-labs/index.astro`
- `src/pages/it/epdc-labs/[slug].astro`

## Files Modified
- `src/content/config.ts`
- `src/components/BlogCard.astro`
- `src/layouts/BlogPost.astro`

## Reused Blog Architecture and Components
- Reused `src/styles/BlogIndex.module.css` for the labs index hero and grid.
- Reused `src/components/BlogCard.astro` by extending it to support both `blog` and `labs` entries plus custom path prefixes.
- Reused `src/layouts/BlogPost.astro` for lab detail pages by widening the layout props to support `publishedAt`, `featuredImage`, tags, GitHub/demo links, and a configurable entry path.
- Kept the existing MDX rendering flow through `render()` and the current Astro content collection pattern.

## Content Collection Decisions
- Added a dedicated `labs` collection in `src/content/config.ts`.
- Implemented typed fields for:
  - `title`
  - `excerpt`
  - `publishedAt`
  - `featuredImage`
  - `featured`
  - `tags`
  - `github`
  - `demoUrl`
  - `lang`
  - `publicSlug`
- Used `publicSlug` instead of Astro's reserved `slug` field so translated entries can share the same public URL segment without collapsing into a single collection record.
- Added `src/data/labs.ts` for shared sorting, index copy, and route path generation.

## Routing Decisions
- Added multilingual section routes:
  - `/en/epdc-labs`
  - `/es/epdc-labs`
  - `/it/epdc-labs`
- Added English alias routes to satisfy the explicit top-level requirement:
  - `/epdc-labs`
  - `/epdc-labs/[slug]`
- Used `publicSlug` so all locales resolve to `/epdc-labs/epdc-conversations` under their respective language prefixes.

## Future Extensibility
- The schema already supports optional GitHub and demo links.
- The shared layout now supports lightweight technical metadata display.
- The collection helper centralizes sorting, making future featured ordering or filtering easier to add.
- The route structure is ready for additional labs entries without introducing new page templates.
- Filtering, screenshots, embedded videos, and richer technical metadata can be added on top of the current collection without replacing the page architecture.

## Validation
- Ran `npm run build` successfully because `pnpm` is not installed in this environment.
- Confirmed generated routes include:
  - `/epdc-labs`
  - `/epdc-labs/epdc-conversations`
  - `/en/epdc-labs/epdc-conversations`
  - `/es/epdc-labs/epdc-conversations`
  - `/it/epdc-labs/epdc-conversations`
- MDX content renders through the existing shared layout with code blocks and featured images enabled.
- Responsive behavior relies on the existing reused card layout and shared blog index styling rather than a parallel CSS system.
