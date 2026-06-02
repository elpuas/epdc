## EPDC Labs OG image fix

Date: 2026-06-02
Branch: `feature/epdc-labs-section`

### Problem

EPDC Labs entries were rendering their page hero image correctly in the layout, but social metadata was still falling back to the default share image because the Labs entry layout was not passing its resolved feature image into the shared head metadata layer.

### Files updated

- `src/layouts/BlogPost.astro`

### Reused metadata architecture

- Reused the same pattern already used by Portfolio entries in `ProjectLayout.astro`, where the entry image is explicitly forwarded to `BaseHead` as the Open Graph image source.
- Kept `BaseHead.astro` unchanged so the existing SEO/social fallback behavior remains centralized.

### Fix applied

- Forwarded the resolved Labs/blog hero image to `BaseHead` via `ogImage`.
- Preserved fallback behavior: if an entry has no `featuredImage` or `image`, `BaseHead` still falls back to the default share image.
- Added the same resolved image to the `StructuredData` payload as an `ImageObject`.
- Normalized the structured data image URL to an absolute URL for consistency with share metadata output.

### Validation notes

- Confirmed generated Labs pages now output entry-specific:
  - `og:image`
  - `twitter:image`
- Confirmed generated URLs are absolute and point to `/lab/epdc-conversations/lab-epdc-conversations.webp` for the EPDC Conversations entry.
- Confirmed Portfolio metadata output remains unchanged.
