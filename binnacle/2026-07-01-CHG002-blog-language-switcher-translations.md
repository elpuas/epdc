# 2026-07-01 CHG002 - Blog Language Switcher Translations

## What changed

- Added an optional `translationKey` field to blog content entries.
- Updated blog post routes to pass language-specific switcher paths to the blog layout.
- Updated the language switcher to use explicit paths when provided, preserving the existing path replacement behavior for static pages.
- Added a blog slug helper that removes only explicit `.en`, `.es`, or `.it` filename suffixes before generating public blog URLs.
- Added a shared `translationKey` to the new website visibility post in Spanish, English, and Italian.

## Why

Blog posts can use different localized slugs per language, so replacing only the locale prefix can generate a URL for a post that does not exist.

Astro's collection slug for files named with language suffixes, such as `post-name.en.mdx`, was also leaking the locale suffix into public routes as `post-nameen`. Public blog routes now normalize that suffix from the entry id before generating paths and card links.

## Fallback behavior

- If a blog post has a matching translated entry, the language switcher points to that translated post.
- If no translation key or translated entry exists, the language switcher points to the blog index for the selected locale instead of a broken URL.

## Files affected

- `src/content/config.ts`
- `src/components/LanguageSwitcher.astro`
- `src/components/Header.astro`
- `src/layouts/BlogPost.astro`
- `src/pages/en/blog/[slug].astro`
- `src/pages/es/blog/[slug].astro`
- `src/pages/it/blog/[slug].astro`
- `src/utils/blogSlug.ts`
- `src/content/blog/como-compartir-tu-nuevo-sitio-web-y-empezar-a-ganar-visibilidad.es.mdx`
- `src/content/blog/how-to-share-your-new-website-and-start-gaining-visibility.en.mdx`
- `src/content/blog/come-condividere-il-tuo-nuovo-sito-web-e-iniziare-a-guadagnare-visibilita.it.mdx`

## Breaking changes

- None.
