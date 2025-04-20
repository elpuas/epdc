# Make TrustedBy Component Translatable

## Description
Updated the TrustedBy component to support localized titles through a prop-based approach, enabling proper translation in different language versions.

## Reason
To improve the multilingual support of the website by making all user-facing text translatable, including section titles in shared components.

## Files Modified
- `/src/components/TrustedBy.astro`
- `/src/pages/en/index.astro`
- `/src/pages/es/index.astro`
- `/src/pages/it/index.astro`

## Changes Made
1. Modified `TrustedBy.astro` component:
   - Added a `title` prop with the default value "Trusted by forward-thinking brands"
   - Replaced the hardcoded title text with the dynamic `{title}` value

2. Updated component usage in all index files:
   - English: `<TrustedBy title="Trusted by forward-thinking brands" />`
   - Spanish: `<TrustedBy title="Con la confianza de marcas visionarias" />`
   - Italian: `<TrustedBy title="Scelti da brand innovativi" />`

3. Maintained all styling and other functionality exactly as before

## Components Affected
- TrustedBy 