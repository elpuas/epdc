# 2026-06-03 — Crafted With Love Card Animations

## Branch Purpose
- Branch: `feature/crafted-with-love-card-animations`
- Goal: add viewport-based entrance animations to the Crafted With Love index cards on `/en/crafted-with-love/`, `/es/crafted-with-love/`, and `/it/crafted-with-love/` without changing Blog, Labs, ServiceCard, single project pages, or shared card behavior elsewhere.
- Remote push: not performed.

## Animation Approach
- Added an opt-in animation hook to the Crafted With Love card/grid components instead of changing their default behavior globally.
- Enabled that hook only on `src/pages/es/crafted-with-love/index.astro`.
- Used a lightweight inline `IntersectionObserver` with no external dependencies.
- Cards animate once when entering the viewport with:
  - fade in
  - slight upward movement
  - small stagger via per-card delay
- Progressive enhancement is preserved:
  - cards render visible by default
  - hidden pre-animation state is only applied after the inline script marks cards as ready
  - if JavaScript fails, cards remain visible

## Files Changed
- `src/components/MadeWithLoveCard.astro`
- `src/components/MadeWithLoveGrid.astro`
- `src/pages/en/crafted-with-love/index.astro`
- `src/pages/es/crafted-with-love/index.astro`
- `src/pages/it/crafted-with-love/index.astro`

## Reduced Motion Handling
- If `prefers-reduced-motion: reduce` matches, the observer path is skipped and cards are immediately marked visible.
- CSS also disables the entrance transform/opacity state for the animated card variant under reduced motion.

## Validation Performed
- Ran `npm run build` successfully to verify the site compiles without hydration errors.
- Verified `/es/crafted-with-love/` in the browser at:
  - desktop `1440x1200`
  - tablet `1024x1366`
  - mobile `390x844`
- Applied the same observer-based animation behavior to `/en/crafted-with-love/` and `/it/crafted-with-love/` using the same opt-in page-level activation.
- Removed left/right `.container` padding at the mobile breakpoint on all three Crafted With Love index pages so cards can align flush on narrow screens without changing tablet or desktop spacing.
- Verified observer behavior on the Spanish index:
  - desktop top-of-page: `6/10` cards visible
  - after scroll: `10/10` cards visible
  - mobile top-of-page: `0/10` cards visible
  - mobile after scroll: `3/10` cards visible and remained visible after scrolling away/back, confirming one-time reveal behavior
- Verified no console warnings or errors during browser checks.
- Verified no animation impact on Labs or Blog in-browser:
  - `/es/epdc-labs/`: `0` crafted animation hooks
  - `/es/blog/`: `0` crafted animation hooks
- Reduced motion handling was validated at implementation level in this environment:
  - inline observer exits early when `prefers-reduced-motion: reduce` matches
  - CSS reduced-motion rules remove the hidden/translated entrance state for the animated variant
  - OS/browser reduced-motion emulation was not available in this validation surface
