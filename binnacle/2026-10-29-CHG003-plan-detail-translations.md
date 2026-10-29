# English and Italian plan detail pages

## What changed

- Added English and Italian versions of the three plan pages, localized shared labels, card links and contact form selections.
- Updated the English and Italian service pages, terms and related FAQ and portfolio references to reflect the current offer.
- Converted Italian plan prices from USD using the ECB reference rate, rounded to the nearest euro and recorded in `docs/plan-pricing-eur-review.md`.

## Why

To provide equivalent plan information in all three languages and propose consistent Italian prices for review.

## Files affected

- `src/components/PlanDetail.astro`, `src/data/plan-details.ts`
- `src/pages/en/services/[plan].astro`, `src/pages/it/services/[plan].astro`
- `src/pages/en/services.astro`, `src/pages/it/services.astro`
- `src/pages/en/contact.astro`, `src/pages/it/contact.astro`
- `src/pages/en/terms-and-conditions.astro`, `src/pages/it/terms-and-conditions.astro`
- English and Italian FAQ, premium-license articles and portfolio references.
- `docs/plan-pricing-eur-review.md`

## Breaking changes

- Italian plan amounts are displayed in euros rather than dollars and remain pending approval before publication.
