# Support teaser refresh

## What changed

- Added [`src/components/SupportTeaser.astro`](/Users/alfredonavas/REACT/epdc/src/components/SupportTeaser.astro) as a reusable homepage support teaser component.
- Replaced the inline support teaser sections in [`src/pages/es/index.astro`](/Users/alfredonavas/REACT/epdc/src/pages/es/index.astro), [`src/pages/en/index.astro`](/Users/alfredonavas/REACT/epdc/src/pages/en/index.astro), and [`src/pages/it/index.astro`](/Users/alfredonavas/REACT/epdc/src/pages/it/index.astro).
- Removed the old unused support teaser styles from [`src/styles/Index.module.css`](/Users/alfredonavas/REACT/epdc/src/styles/Index.module.css).

## Why

- The homepage support teaser was duplicated across languages and used a separate icon-list treatment.
- The new component reuses the existing `ServiceCard` pattern so the section stays visually aligned with the rest of the site.

## Breaking changes

- None.
