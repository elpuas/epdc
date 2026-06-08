# Public Assets Audit

Date: 2026-06-07

## Summary

- Audited the full `public/` directory against active references in `src/`.
- Moved referenced assets into usage-based folders: `posts`, `portfolio`, `brands`, `logos`, `backgrounds`, `campaigns`, `labs`, and `general`.
- Updated all active references after each move batch.
- Kept only browser-required web-root files in `/public` root.
- Isolated confirmed orphaned files in `public/to-delete/` so they can be reviewed and removed later without breaking the app.
- Final validation: `npm run build` passed.

## Root Files Kept Unchanged

These remain in `/public` because browsers, manifests, or platform conventions expect them at the web root:

- `public/android-chrome-192x192.png`
- `public/android-chrome-512x512.png`
- `public/apple-touch-icon.png`
- `public/favicon-16x16.png`
- `public/favicon-32x32.png`
- `public/favicon.ico`
- `public/favicon.svg`
- `public/manifest.webmanifest`
- `public/robots.txt`
- `public/site.webmanifest`

## Moved Assets

| Original location | New location | References updated |
| --- | --- | ---: |
| `public/ai-en-el-puas.jpg` | `public/posts/ai-en-el-puas.jpg` | 6 |
| `public/blog-mantenimiento.jpg` | `public/posts/blog-mantenimiento.jpg` | 6 |
| `public/blog-placeholder-about.jpg` | `public/posts/blog-placeholder-about.jpg` | 1 |
| `public/blog-post-dec.jpg` | `public/posts/blog-post-dec.jpg` | 2 |
| `public/blog-wp-new.webp` | `public/posts/blog-wp-new.webp` | 6 |
| `public/blogMayHero.jpg` | `public/posts/blogMayHero.jpg` | 6 |
| `public/codex-screen.png` | `public/posts/codex-screen.png` | 3 |
| `public/faq.jpg` | `public/posts/faq.jpg` | 6 |
| `public/fishcostarica-performance.png` | `public/posts/fishcostarica-performance.png` | 3 |
| `public/llms-hero.jpg` | `public/posts/llms-hero.jpg` | 6 |
| `public/post-gianfranco.jpg` | `public/posts/post-gianfranco.jpg` | 6 |
| `public/telex.png` | `public/posts/telex.png` | 3 |
| `public/wordpress-bien-hecho.webp` | `public/posts/wordpress-bien-hecho.webp` | 6 |
| `public/wordpress-bien-hecho-parte-dos.webp` | `public/posts/wordpress-bien-hecho-parte-dos.webp` | 6 |
| `public/blog-wp-7-studio/*` | `public/posts/blog-wp-7-studio/*` | 21 |
| `public/images/riesgo-invisible-plugins-premium-no-renovados-{1,2,3}.webp` | `public/posts/riesgo-invisible-plugins-premium-no-renovados-{1,2,3}.webp` | 12 |
| `public/monkey-phone.jpg` | `public/portfolio/monkey-phone.jpg` | 3 |
| `public/cas-showcase.jpg` | `public/portfolio/cas-showcase.jpg` | 3 |
| `public/epdc-nuara-card.webp` | `public/portfolio/epdc-nuara-card.webp` | 3 |
| `public/logo-updated-150x150.webp` | `public/logos/logo-updated-150x150.webp` | 2 |
| `public/default.png` | `public/general/default.png` | 1 |
| `public/luciernaga-verde.png` | `public/backgrounds/luciernaga-verde.png` | 1 |
| `public/images/avalanche.png` | `public/brands/avalanche.png` | 1 |
| `public/images/pb.png` | `public/brands/pb.png` | 1 |
| `public/images/monkey.png` | `public/brands/monkey.png` | 1 |
| `public/images/fishcostarica.png` | `public/brands/fishcostarica.png` | 1 |
| `public/images/Logo-rojo-voyager.png` | `public/brands/Logo-rojo-voyager.png` | 1 |
| `public/lab/epdc-conversations/*` | `public/labs/epdc-conversations/*` | 9 |
| `public/images/wcsj.webp` | `public/campaigns/wcsj.webp` | 1 |
| `public/images/wcsj-form.webp` | `public/campaigns/wcsj-form.webp` | 1 |

## Orphaned Assets Found

Confirmed unused assets were moved to `public/to-delete/` for later deletion. No active references in `src/` point to these files.

### Root orphans

- `public/to-delete/root/blog-placeholder-1.jpg`
- `public/to-delete/root/blog-placeholder-2.jpg`
- `public/to-delete/root/blog-placeholder-3.jpg`
- `public/to-delete/root/blog-placeholder-4.jpg`
- `public/to-delete/root/blog-placeholder-5.jpg`
- `public/to-delete/root/fishcostarica-laptop-half.webp`
- `public/to-delete/root/lab.jpg`
- `public/to-delete/root/laptop-placeholder.jpg`
- `public/to-delete/root/mobile.png`
- `public/to-delete/root/nuara-home-mobile.png`
- `public/to-delete/root/phone-showcase.jpg`
- `public/to-delete/root/service-one.png`
- `public/to-delete/root/.DS_Store`

### Portfolio orphans

- `public/to-delete/portfolio/aiecostarica.webp`
- `public/to-delete/portfolio/fishcostarica.jpg`
- `public/to-delete/portfolio/gbox-mobile.mp4`
- `public/to-delete/portfolio/hero-aiecostarica-desktop.webp`
- `public/to-delete/portfolio/monkey-scrubs.jpg`
- `public/to-delete/portfolio/monkeyscrubs-featured.jpg`
- `public/to-delete/portfolio/nuara-mobile.mp4`
- `public/to-delete/portfolio/placeholder.af`
- `public/to-delete/portfolio/placeholder.af~lock~`
- `public/to-delete/portfolio/.DS_Store`

### Other orphans

- `public/to-delete/team/ai-assistant.png`
- `public/to-delete/images/defender.png`

Total isolated orphaned files: 25

## Assets Left Unchanged

- `public/fonts/*`
  Reason: already grouped correctly and referenced as font assets.
- `public/icons/*`
  Reason: already grouped correctly for app icons.
- `public/team/alfredo-navas.jpeg`
  Reason: already in the correct usage folder.
- `public/team/gianfranco.png`
  Reason: already in the correct usage folder.
- `public/portfolio/*` remaining active files
  Reason: already grouped correctly by portfolio usage.
- `public/posts/*` after the move
  Reason: this is now the consolidated location for blog and article assets.

## Validation

- Searched active references across Astro, MDX, Markdown-adjacent source usage, JSON-linked content, and component imports.
- Updated all active references after each move batch.
- Verified `/public` root has no loose content images left; only required web-root files remain.
- Ran a production build successfully:
  - `npm run build`
