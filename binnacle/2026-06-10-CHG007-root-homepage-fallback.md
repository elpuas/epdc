# Root Homepage Fallback

## What changed

- Added an explicit Astro root route at `src/pages/index.astro` that redirects `/` to `/en/`.
- Kept the existing Netlify root redirect in place as a hosting-level fallback.

## Why

- The project is configured to use localized homepages like `/en/`, `/es/`, and `/it/`, but there was no actual Astro page for `/`.
- Root traffic depended entirely on the Netlify redirect, so if that rule was bypassed or not applied in some environments, `/` could fall through to a 404.
- This change provides application-level fallback behavior in addition to hosting-level redirects.

## Files affected

- `src/pages/index.astro`

## Breaking changes

- None intended. Root requests still resolve to the default language homepage at `/en/`.
