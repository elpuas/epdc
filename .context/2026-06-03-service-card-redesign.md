## Branch Purpose

- Branch: `feature/service-card-redesign`
- Goal: refactor `ServiceCard` and the homepage Services section so they align more closely with the newer EPDC card family established by Labs and Hecho con Amor, without modifying those sections directly.

## ServiceCard Refinements

- Rebuilt `ServiceCard` from the previous skew-heavy layout into a cleaner two-column card with stronger spacing, calmer proportions, and a more premium visual rhythm.
- Preserved all existing service titles, descriptions, icons, and links.
- Replaced aggressive hover distortion with a restrained lift, border emphasis, soft glow, and subtle icon refinement.

## LabFeatureCard Influences

- Used `LabFeatureCard.astro` as a visual reference for icon framing, typography hierarchy, compact structure, and balanced padding.
- Kept `ServiceCard` independent rather than duplicating the Labs card markup or exact presentation.

## Gradient Title Reuse

- Applied the existing `text-gradient-brand` treatment to service titles to connect them with the broader EPDC heading language.
- Reused the site’s current gradient implementation from global styles instead of introducing a new gradient system.

## Design System Consistency Decisions

- Updated the homepage Services grid to better support the refined card proportions across mobile, tablet, and desktop.
- Removed the legacy alternating skew hover behavior so Services now sit in the same design direction as Labs and Hecho con Amor while remaining visually distinct.
- Increased service title scale for stronger homepage hierarchy and improved perceived balance against the card height.
- Added explicit row spacing plus staggered card entrance timing on the homepage grid so each service enters the canvas at a slightly different moment without introducing heavy motion.
