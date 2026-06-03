# 2026-06-02 — Labs Layout Refinement

## Scope
- Continued on existing branch `feature/epdc-labs-section`.
- No new branch created.
- No push performed.

## Layout Refinements
- Updated `src/layouts/BlogPost.astro` to separate visual presentation between normal blog posts and EPDC Labs entries while keeping the shared layout file.
- Labs entries now follow this structure:
  - Title
  - Tags
  - Hero image
  - Content

## Metadata Rendering Changes
- Removed published date rendering for Labs entries only.
- Kept blog post date/author rendering unchanged.
- Removed automatic repository/demo link UI rendering from the shared layout.
- Kept schema/frontmatter support for `github` and `demoUrl` intact so those fields remain available for future use or manual MDX embedding.

## Tag Placement Update
- Moved Labs tags to render directly below the title.
- Ensured tags appear before the hero image for a more evergreen, product-oriented presentation.
- Left blog post presentation unchanged.

## Separation Between Blog and Labs Presentation Logic
- Added a Labs-specific conditional branch inside `BlogPost.astro` using `contentType === "labs"`.
- Blog posts still render their date/author block as before.
- Labs entries now suppress blog-like metadata clutter while keeping the same global typography and responsive layout system.

## Validation
- Ran `npm run build` successfully.
- Confirmed:
  - blog routes still build normally
  - labs routes still build normally
  - labs no longer auto-render dates
  - labs no longer auto-render repo/demo links
  - labs tags render above the hero image
  - responsive image/content structure remains intact at build level
