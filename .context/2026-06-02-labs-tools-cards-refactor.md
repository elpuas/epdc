# 2026-06-02 — EPDC Conversations Internal Tools Cards Refactor

## Scope
- Continued on existing branch `feature/epdc-labs-section`.
- No new branch created.
- No push performed.

## Section Refactor
- Replaced the long bullet-list implementation for the internal tools/projects section inside the EPDC Conversations labs entry.
- The section now uses reusable Astro/MDX components instead of repeated markdown list markup.

## Components Added
- `src/components/LabFeatures.astro`
  - section wrapper
  - compact intro support
  - responsive grid container
- `src/components/LabFeatureCard.astro`
  - icon
  - title
  - short description
  - optional `repoUrl`, `demoUrl`, and `docsUrl`
  - no hydration required

## Grid/Card Decisions
- Grid behavior:
  - 1 column on mobile
  - 2 columns from tablet widths
  - 3 columns on wider desktop widths
- Visual direction kept intentionally compact and documentation-like:
  - moderate padding
  - subtle border
  - small icon tile
  - no oversized CTA treatments
  - no flashy gradients or marketing-card behavior

## MDX Structure Improvements
- Updated these entries to use component-driven cards:
  - `src/content/labs/epdc-conversations.en.mdx`
  - `src/content/labs/epdc-conversations.es.mdx`
  - `src/content/labs/epdc-conversations.it.mdx`
- Preserved the existing localized copy/descriptions for:
  - Puro Confort Product Pricing
  - EPDC Product Selector
  - GreenPack Core
  - PBCR / Agent Mode entry
  - PBCR Similar Properties Filter
  - Premium Brokers – Agent Form CC
  - Smart Home Leads
  - AgentPress
- Kept the later “also worked on” list intact, since the request specifically targeted the internal tools/projects card section.

## Visual Hierarchy Improvements
- The section is now significantly easier to scan.
- Titles and descriptions are chunked into individual cards instead of a continuous text block.
- Icon usage improves recognition and grouping without changing the global EPDC visual language.

## Validation
- Ran `npm run build` successfully.
- Confirmed:
  - MDX imports resolve correctly
  - Astro icon names resolve correctly after normalization
  - no hydration issues introduced
  - cards render through static Astro components only
  - responsive grid compiles for labs routes in all three languages
