# 2026-06-05 CHG004: Web Development section animation update

## What changed

- Replaced the first services-section icon for Web Development with a clearer development-oriented icon.
- Added a viewport-triggered reveal sequence to the first service block in `en`, `es`, and `it`.
- Sequenced the reveal as heading first, icon second, and content third using the same motion language as the pricing cards.
- Replaced the traditional feature bullets with wrapped pills using the existing homepage card/tag visual language.
- Updated the content reveal direction so the paragraph and pills enter from the right, with each pill animating independently on a subtle stagger.
- Extended the same reveal system to every remaining service section, keeping heading, icon, content, and pill timing identical across the page.
- Made content and pill direction responsive to the layout side so standard and reverse service rows enter from the side where the content visually sits.
- Corrected the content-side mapping so each content column enters from its actual outer edge toward the center, avoiding motion across the icon area.

## Why

- The previous flask icon did not communicate web development clearly enough.
- The updated reveal behavior makes the section easier to scan and introduces the content in a deliberate storytelling order without redesigning the section.

## Files affected

- `src/components/ServiceDetails.astro`
- `src/pages/en/services.astro`
- `src/pages/es/services.astro`
- `src/pages/it/services.astro`

## Breaking changes

- None.
