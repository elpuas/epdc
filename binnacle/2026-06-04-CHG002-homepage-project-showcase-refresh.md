# Homepage project showcase refresh

## What changed

- Added [`src/components/HomeProjectShowcase.astro`](/Users/alfredonavas/REACT/epdc/src/components/HomeProjectShowcase.astro) as a homepage-only replacement for the older case study treatment.
- Added [`src/components/HomeProjectShowcaseVisual.astro`](/Users/alfredonavas/REACT/epdc/src/components/HomeProjectShowcaseVisual.astro) as a reusable Astro placeholder for the screenshot area.
- Updated [`src/pages/en/index.astro`](/Users/alfredonavas/REACT/epdc/src/pages/en/index.astro), [`src/pages/es/index.astro`](/Users/alfredonavas/REACT/epdc/src/pages/es/index.astro), and [`src/pages/it/index.astro`](/Users/alfredonavas/REACT/epdc/src/pages/it/index.astro) to feature Nuara Pelletterie instead of FishCostaRica.
- Refined the showcase to remove the outer border, remove the eyebrow and CTA, make the full section clickable, add a title accent dot, and align the background and tag styling with the existing card system.
- Switched the showcase visual area to a slot-based placeholder component so the project screenshot can be replaced later without changing the section structure.
- Normalized the Nuara portfolio slugs in [`src/content/portfolio/nuara-pelletterie-ecommerce.en.mdx`](/Users/alfredonavas/REACT/epdc/src/content/portfolio/nuara-pelletterie-ecommerce.en.mdx) and [`src/content/portfolio/nuara-pelletterie-ecommerce.it.mdx`](/Users/alfredonavas/REACT/epdc/src/content/portfolio/nuara-pelletterie-ecommerce.it.mdx) so the homepage CTAs resolve to the requested URLs.

## Why

- The previous homepage section still behaved like a one-off promo block instead of a first-class part of the homepage design system.
- The updated component keeps the same layout direction while moving the visual treatment, interactivity, and supporting elements closer to `ServiceCard` and `SupportTeaser`.

## Breaking changes

- None.
