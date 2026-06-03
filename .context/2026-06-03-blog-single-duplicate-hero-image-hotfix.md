# Blog Single Duplicate Hero Image Hotfix

## Root Cause Analysis

- The EPDC Labs refactor expanded `src/layouts/BlogPost.astro` so the shared layout could render a featured hero image for Labs entries.
- Standard blog posts already place their lead image inside the MDX body with custom composition.
- Once the shared layout started auto-rendering `image` / `featuredImage` ahead of `<slot />`, blog singles rendered the featured image twice: once from the layout and once from the MDX content.

## Layout And Template Adjustments

- Kept `BlogPost.astro` as the shared single-entry shell for metadata, headings, and structured data.
- Changed hero rendering from implicit behavior to explicit behavior through `showHeroImage`.
- Preserved the Labs-only metadata block (`tags` before hero) behind `contentType === 'labs'`.
- Preserved Open Graph and structured-data image support by continuing to resolve the social image from `featuredImage ?? image`.

## Blog Vs Labs Separation Decision

- Blog entries keep their original composition model:
  - title and date/author from the layout
  - lead image and custom body composition from MDX
- Labs entries keep the shared featured-image slot:
  - tags render before the hero
  - the layout can inject the hero only when `showHeroImage` is set
- This avoids CSS hiding, duplicate conditions across pages, or splitting the shared shell into near-duplicate layouts.

## Regression Fix Details

- Updated `src/layouts/BlogPost.astro` to:
  - support shared blog/labs metadata props
  - preserve social metadata and structured data for both content types
  - render the shared hero image only when `showHeroImage` is explicitly enabled
- On the current production snapshot in this workspace, the Labs route files are not present on `main`, so the hotfix was applied at the shared layout boundary where the regression was introduced.
