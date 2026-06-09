# 2026-06-08 CHG005: Portfolio single tag hierarchy refinement

## What changed

- Updated the portfolio single layout so project tags render directly beneath the project title instead of inside the highlighted metadata container.
- Removed the large lime background treatment from the tags wrapper while keeping the tag pills themselves intact.
- Matched the Lab article hierarchy more closely by using a lightweight metadata block under the title with tighter vertical spacing.
- Kept the existing date, featured image, typography, and responsive flow in place for portfolio single pages.

## Why

- The previous highlighted wrapper made project tags compete with the title and read like a featured content block instead of lightweight metadata.
- Aligning the portfolio single hierarchy with the Lab article pages keeps the page structure more consistent and easier to scan.

## Files affected

- `src/layouts/ProjectLayout.astro`
- `src/styles/ProjectLayout.module.css`

## Breaking changes

- None.
