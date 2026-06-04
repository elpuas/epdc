# 2026-06-03 - CHG036 - Hecho con Amor index cards

## What changed
- Added a dedicated `src/components/MadeWithLoveCard.astro` component for portfolio index cards.
- Added a dedicated `src/components/MadeWithLoveGrid.astro` component for the portfolio index grid.
- Updated only these index pages to use the dedicated components:
  - `src/pages/en/crafted-with-love/index.astro`
  - `src/pages/es/crafted-with-love/index.astro`
  - `src/pages/it/crafted-with-love/index.astro`
- Expanded the brand gradient treatment into a shared typography utility and then into the global `h1` rule so page titles and single-entry headings across the site inherit the same green-to-blue title treatment.

## Card architecture
- The Hecho con Amor index no longer uses the shared `ProjectCard.astro` flip-card pattern.
- The new card structure is intentionally aligned with the Labs card pattern:
  - icon block
  - title
  - short excerpt
- Project URL behavior remains the same through the full-card anchor.
- Project icons are inferred from portfolio slug/title/tags so the cards remain scannable without screenshots.

## Animation decisions
- Entry motion uses a fade-in plus slight upward movement.
- Stagger timing is applied per card with 70ms increments, capped to keep the sequence restrained.
- Hover motion stays subtle:
  - slight card lift
  - small border glow via border/background shift
  - small icon movement
- Reduced-motion handling disables the entry animation and transitions.

## Component separation
- Hecho con Amor now has dedicated index components instead of reusing blog, labs, or shared portfolio cards.
- `ProjectCard.astro` was left untouched, which keeps single project routes and any other consumers unchanged.
- Labs components and layouts were not modified.

## Responsive behavior
- `MadeWithLoveGrid.astro` enforces explicit breakpoints:
  - mobile: 1 column
  - tablet (`min-width: 768px`): 2 columns
  - desktop (`min-width: 1100px`): 3 columns
- Validation confirmed 1/2/3 column behavior at mobile, tablet, and desktop viewport sizes.

## Equal-height card implementation
- Removed the per-card `align-self: start` override from `MadeWithLoveCard.astro` so each portfolio card can stretch with the CSS grid row.
- Added `height: 100%` on `.made-with-love-card` and `min-height: 100%` on `.card-shell` so the full clickable shell fills the stretched grid cell.
- Kept the implementation CSS-only using grid stretching plus internal flex/grid layout, with no fixed heights and no JavaScript measurements.
- Added `box-sizing: border-box` to both the card wrapper and the inner `.card-shell` after validating that the shell's padding and border were overflowing the stretched grid item and visually collapsing the row gap.

## Spacing adjustments
- Kept the Hecho con Amor grid on a single shared `gap: var(--space-lg)` value in `MadeWithLoveGrid.astro`.
- Added explicit `align-items: stretch` on the grid to reinforce equal-height behavior while preserving the same visual gap value for both rows and columns.
- Validation confirmed `row-gap` and `column-gap` both render as `24px`.
- Moved the entry animation from the grid item wrapper to the inner `.card-shell` so the grid item can preserve row spacing cleanly while the stagger animation still runs.
- Kept row and column spacing unified through `gap` instead of splitting `row-gap` and `column-gap` into separate values.
- Verified on the Spanish crafted-with-love index that card shell bounds now match card bounds exactly, restoring the visible vertical space between rows.

## Scope protection
- Single project pages were not edited and still expose their existing media and tag content.
- Blog, blog cards, blog layouts, labs cards, and labs layouts were not modified.

## Validation
- `pnpm build` could not be used because `pnpm` is unavailable in this environment.
- `npm run build` completed successfully.
- Browser validation confirmed:
  - Hecho con Amor index renders the new dedicated cards.
  - The index no longer shows tag chips or preview images.
  - Cards in the same desktop row render at equal heights:
    - first row: `205px / 205px / 205px`
    - second row: `230px / 230px / 230px`
  - Desktop, tablet, and mobile all render with measured `24px` vertical row spacing.
  - Tablet and mobile breakpoints still render without overflow or clipping.
  - Grid `row-gap` matches `column-gap` at all validated breakpoints.
  - Single project pages still contain media and tag content.
  - Labs index still renders `lab-card` entries.
  - Blog index still renders independently.
