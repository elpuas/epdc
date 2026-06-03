# 2026-06-02 - CHG035 - Translate EPDC Conversations and add EPDC Labs navigation

## What changed
- Replaced the provisional EPDC Conversations copy with the provided source content in Spanish.
- Added full English and Italian translations for the same labs entry:
  - `src/content/labs/epdc-conversations.en.mdx`
  - `src/content/labs/epdc-conversations.es.mdx`
  - `src/content/labs/epdc-conversations.it.mdx`
- Updated frontmatter excerpts and tags to better match the final content direction.

## Navigation update
- Added `EPDC Labs` as a new dropdown item under the existing Crafted with Love navigation item in desktop header navigation.
- Added `EPDC Labs` as a direct item in the mobile dock to preserve mobile discoverability without changing the dock interaction pattern.
- Added the `labs` navigation translation key in:
  - `src/i18n/translations/en.json`
  - `src/i18n/translations/es.json`
  - `src/i18n/translations/it.json`
- Updated nav typing in `src/i18n/utils.ts`.

## Files modified
- `src/components/Header.astro`
- `src/components/MobileDock.astro`
- `src/styles/Header.module.css`
- `src/i18n/utils.ts`
- `src/i18n/translations/en.json`
- `src/i18n/translations/es.json`
- `src/i18n/translations/it.json`
- `src/content/labs/epdc-conversations.en.mdx`
- `src/content/labs/epdc-conversations.es.mdx`
- `src/content/labs/epdc-conversations.it.mdx`

## Route and locale notes
- Kept the existing `en/es/it` locale architecture after the user clarified Portuguese was a typo.
- Preserved the existing labs route structure and public slug:
  - `/epdc-labs/epdc-conversations`
  - `/en/epdc-labs/epdc-conversations`
  - `/es/epdc-labs/epdc-conversations`
  - `/it/epdc-labs/epdc-conversations`

## Validation notes
- `npm run build` completed successfully.
- Generated HTML was checked to confirm:
  - translated labs routes exist
  - the desktop dropdown markup is present
  - accessibility attributes for the dropdown are present
  - the mobile dock contains the new labs entry
