# Changelog Entry – CHG007

**Date:** 2025-04-17
**ID:** CHG007
**Type:** Fix
**Summary:** Fixed Astro compiler error caused by invalid fragment attributes in the Italian blog slug route.

## Details

- Identified that `/src/pages/it/blog/[slug].astro` had an incorrect structure where components were rendered outside of a layout and potentially causing fragment attribute errors.
- Corrected the file structure by wrapping the `BlogPost` and `Content` components within the main `Layout.astro` component.
- Ensured the `lang="it"` prop is passed to the `Layout` component.
- Resolved the `[CompilerError] Unable to assign attributes when using <> Fragment shorthand syntax!` error.

## Affected Files

- `/src/pages/it/blog/[slug].astro`
