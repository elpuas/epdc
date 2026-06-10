# Mobile Nav iOS Tap Fix

## What changed

- Updated header and mobile dock links to point directly to trailing-slash routes like `/en/about/` instead of redirecting URLs like `/en/about`.
- Updated the logo link to use `/${lang}/` so it lands on the final HTML route instead of a redirect.
- Reworked the language switcher to use native anchor navigation instead of `preventDefault()` plus `window.location.href`.
- Preserved the current page path when switching languages by generating the target language URL from the current pathname.
- Increased header and language-switcher tap targets to 44x44 and added `touch-action: manipulation` to clickable header/mobile controls.

## Why

- Production routes without trailing slashes currently return `301` redirects before the final page, and the root redirect responds as `text/plain`. Removing those extra redirects reduces Safari-specific navigation edge cases.
- The old language switcher relied on JavaScript interception, which is more fragile on iPhone Safari and can manifest as an ignored first tap.
- Small tap targets increase missed taps on mobile and can make the issue feel intermittent.

## Files affected

- `src/components/Header.astro`
- `src/components/MobileDock.astro`
- `src/components/LanguageSwitcher.astro`
- `src/styles/Header.module.css`
- `src/styles/MobileDock.module.css`
- `src/styles/LanguageSwitcher.module.css`

## Breaking changes

- None intended. The language switcher now performs native navigation instead of persisting a preferred language in `localStorage`.
