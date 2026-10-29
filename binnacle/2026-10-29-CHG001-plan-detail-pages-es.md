# Spanish plan detail pages and offer redesign

## What changed

- Added Spanish detail pages for Essential, Growth, and AI Commerce.
- Added a shared accessible plan-detail component and responsive styles.
- Removed decorative section numbering after review and kept only the functional onboarding sequence.
- Verified the plan pages against the current Spanish homepage direction on desktop and mobile: gradient display type, cyan eyebrow labels and CTAs, dark surfaces, restrained borders, and responsive spacing remain consistent.
- Linked the Spanish pricing cards to the corresponding detail pages.
- Aligned pricing-card rows across columns so different description lengths do not shift the prices.
- Replaced shortened company references in authored site copy with ElPuas Digital Crafts, preserving legal names, URLs, code identifiers, and client testimonials.
- Updated the monthly development allowance to 4 hours for Growth and 8 hours total for AI Commerce, as confirmed by Alfredo.
- Removed example blocks from the included-service cards and moved relevant examples into the FAQs.
- Added plan options to the Spanish contact form and preserved the selected plan through the `service` query parameter.
- Aligned the Spanish terms, service copy, FAQ article, premium-license article, and plan references in Spanish portfolio entries with the new offer.
- Added a review document with corrected contradictions and commercial decisions still pending.

## Why

The previous public content promised inconsistent development hours and treated hosting, Slack, licenses, page counts, product counts, text tokens, and image generation inconsistently. Alfredo confirmed that every plan includes a WordPress site with a premium theme adapted to the client's brand and the necessary licenses.

## Files affected

- `src/components/PlanDetail.astro`
- `src/components/PricingCard.astro`
- `src/styles/PlanDetail.module.css`
- `src/pages/es/services.astro`
- `src/pages/es/services/essential.astro`
- `src/pages/es/services/growth.astro`
- `src/pages/es/services/ai-commerce.astro`
- `src/pages/es/contact.astro`
- `src/pages/es/terms-and-conditions.astro`
- `src/content/blog/top-faq-about-our-services.es.mdx`
- `src/content/blog/riesgo-invisible-plugins-premium-no-renovados.es.mdx`
- `src/content/portfolio/fisioadriancampos.es.mdx`
- `src/content/portfolio/premium-brokers.es.mdx`
- `docs/plan-offer-review-es.md`

## Breaking changes

- All plans now include an initial site based on an adapted premium theme and the necessary licenses. The number of pages and products remains to be confirmed.
- English and Italian translations were subsequently prepared; see `2026-10-29-CHG003-plan-detail-translations.md`.
