# 2026-07-28 - CHG001 - Crafted with Love interactions

## What changed

- Enhanced `MadeWithLoveCard.astro` with active, secondary, hover, and keyboard-focus states.
- Enhanced `MadeWithLoveGrid.astro` with a shared floating project preview and collision-aware viewport positioning.
- Kept every project card as one semantic, fully clickable anchor to its existing localized permalink.
- Reused each portfolio entry's existing `image` frontmatter without changing content or the collection schema.

## Image and performance decisions

- Imported the existing portfolio assets through Astro's image pipeline.
- Generated responsive WebP output at 360, 520, and 680 pixels wide.
- Stored optimized image metadata on each statically rendered card and used one decorative preview image for the grid.
- Left the preview without a source until a project is activated so the browser does not eagerly download every featured image.
- Reserved the preview dimensions and positioned it with `position: fixed` to avoid layout shifts.

## Interaction and accessibility

- Pointer hover and keyboard focus display the same project preview and active-card emphasis.
- The active card uses border, background, elevation, scale, title intensity, and icon intensity changes.
- Surrounding cards move into a restrained secondary state while remaining legible.
- The floating preview uses `pointer-events: none` and remains below the active card so it cannot block navigation or obscure the active title.
- The card focus indicator is a three-pixel solid outline with an offset.
- Preview images are decorative with an empty alternative description and an `aria-hidden` wrapper.
- Reduced-motion styles remove movement, scaling, and nonessential transitions.
- Coarse-pointer, no-hover, and small-screen layouts disable only the floating preview while preserving the full-card links.

## Responsive behavior

- Preserved the existing one-, two-, and three-column grid breakpoints.
- Clamped preview coordinates to the viewport and reversed the vertical placement when space below the active card is limited.
- Kept the preview out of the document flow to prevent cumulative layout shift and horizontal overflow.

## Validation

- `npm run build` completed successfully.
- The production build generated optimized variants for all ten portfolio featured images.
- Browser validation covered all ten Spanish project cards and confirmed:
  - correct project-to-image mapping
  - collision clamping at grid and viewport edges
  - active-card stacking above the preview
  - complete Tab navigation with an equivalent preview state
  - a visible three-pixel focus outline on every card
  - correct full-card navigation to the localized project permalink
  - no console errors or warnings
  - no horizontal overflow in touch/mobile emulation
  - the preview remains disabled in no-hover/coarse-pointer emulation
- Temporary Playwright screenshots, snapshots, and configuration files were removed after validation.

## Breaking changes

- None.
