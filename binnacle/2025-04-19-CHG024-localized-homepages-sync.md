# Localized Homepages Synchronization

## Description
Updated Spanish (es) and Italian (it) homepages to match the structure and content of the English (en) homepage, ensuring consistent layout and fully translated content across all localized versions.

## Reason
Maintain a consistent user experience across language variants while providing properly localized content for Spanish and Italian users.

## Files Modified
- `/src/pages/es/index.astro`
- `/src/pages/it/index.astro`

## Changes Made
1. Added missing sections to both localized versions:
   - "Trusted By" section with TrustedBy component
   - Support plan teaser section with features
   - Firefly component section
2. Updated CSS classes to match English version:
   - Added `styles.caseAccent` class to case study paragraphs
   - Added `styles.caseQuote` class to testimonial blockquotes
3. Updated intro text and CTA buttons to match English content and style
4. Added proper imports for TrustedBy and Firefly components
5. Updated href paths to use the correct locale-based routes:
   - `/es/contacto` and `/it/contatto` for contact pages
   - `/es/servicios#planes` and `/it/servizi#piani` for services pages
6. All content has been properly translated to maintain meaning while being natural in each language

## Components Affected
- Hero
- Button
- ServiceCard
- TrustedBy
- Firefly
- Icon 