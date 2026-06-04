# EPDC Labs Index Cards Redesign

## Scope Isolation

- Redesigned only the `/epdc-labs` index card presentation.
- Left Blog index pages on their existing `BlogCard.astro` plus `BlogIndex.module.css` path.
- Left Portfolio components and styles untouched.

## Shared Component Considerations

- The Labs index previously used `CollectionIndexPage.astro`, which renders `BlogCard.astro`.
- Instead of mutating that shared path, the implementation adds:
  - `src/components/LabsIndexPage.astro`
  - `src/components/LabsCard.astro`
  - `src/styles/LabsIndex.module.css`
- The four Labs index routes now import the Labs-specific page component directly, so Blog routes continue using their original card rendering stack.

## Labs-Only Design Decisions

- Shifted the Labs card hierarchy away from article-style image-first composition toward product/system presentation:
  - optional status row
  - title-first compact card structure
  - concise technical summary
  - tags as capability chips
  - explicit project CTA
- Added a localized Labs-only kicker in the dedicated index page shell instead of reusing Blog hero copy patterns.
- Reduced image dominance by moving the preview into a secondary supporting slot.
- Simplified the index card again after grid breakage so it now follows the same denser, cleaner structure as the Labs cards used inside post content.
- Replaced per-entry featured images in the Labs index card with a shared generic lab icon to keep the index visually consistent and tool/system-oriented.
- Added an optional `status` field to the Labs collection schema and populated the existing EPDC Conversations entry in all three languages with localized status copy.

## How Blog Regressions Were Avoided

- Did not edit `src/components/BlogCard.astro`.
- Did not edit `src/styles/BlogIndex.module.css`.
- Did not edit Blog index pages.
- Did not repurpose shared Blog classes for Labs styling.
- Kept routing logic explicit at the Labs page level so only `/epdc-labs` consumes the new card UI.
