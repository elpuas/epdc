# Pricing Section Refresh

## What changed

- Rebuilt the services pricing section into a premium editorial layout across Spanish, English, and Italian service pages.
- Updated [`src/components/PricingCard.astro`](/Users/alfredonavas/REACT/epdc/src/components/PricingCard.astro) to support compact plan descriptions, optional badges, editorial CTAs, integrated feature checks, and viewport reveal animation.
- Refreshed [`src/styles/Services.module.css`](/Users/alfredonavas/REACT/epdc/src/styles/Services.module.css) with a stronger pricing hierarchy, responsive 1/2/3-column grid behavior, trust-message styling, and lightweight secondary CTA treatment.

## Why

- The old pricing cards were visually disconnected from the newer homepage sections and carried too much copy.
- The new layout aligns pricing with the site’s current card language, spacing rhythm, hover behavior, and motion patterns while improving scanability.

## Breaking changes

- None expected. Pricing content and presentation changed, but the section anchor `#pricing-title` remains intact.
