# 2026-05-21 - CHG033 - Add EN/IT translations for WordPress 7.0 + Studio article

## What changed
- Added English blog post:
  - `src/content/blog/wordpress-7-studio-the-start-of-ai-native-wordpress.en.mdx`
- Added Italian blog post:
  - `src/content/blog/wordpress-7-studio-inizio-wordpress-ai-native.it.mdx`

## Multilingual references used
- `src/content/blog/como-wordpress-esta-integrando-la-ia.es.mdx`
- `src/content/blog/how-wordpress-is-integrating-ai.en.mdx`
- `src/content/blog/come-wordpress-sta-integrando-l-ia.it.mdx`
- `src/content/blog/wordpress-6-9-lo-nuevo.mdx`
- `src/content/blog/wordpress-6-9-whats-new.en.mdx`
- `src/content/blog/wordpress-6-9-novita.it.mdx`

## Generated slugs (from filenames)
- ES: `wordpress-7-studio-inicio-wordpress-ai-native`
- EN: `wordpress-7-studio-the-start-of-ai-native-wordpress`
- IT: `wordpress-7-studio-inizio-wordpress-ai-native`

## Translation adjustments
- Kept business/editorial tone focused on clients, agencies, and small studios.
- Localized phrasing naturally (not literal sentence-by-sentence translation).
- Preserved section structure, heading rhythm, and CTA block pattern across languages.
- Aligned EN/IT placeholder image strategy with the current ES version using:
  - `public/blog-wp-7-studio/wp-7-studio-hero.webp`
  - `public/blog-wp-7-studio/wordpress-7.webp`
  - `public/blog-wp-7-studio/studio-one.webp`
  - `public/blog-wp-7-studio/studio-two.webp`
  - `public/blog-wp-7-studio/connectors.webp`
  - `public/blog-wp-7-studio/agents.webp`
- Used locale-specific internal CTA links:
  - EN: `/en/contact`
  - IT: `/it/contact`

## Validation notes
- Image placeholder paths verified as present in `public/blog-wp-7-studio/`.
- Locale contact routes verified in:
  - `src/pages/en/contact.astro`
  - `src/pages/it/contact.astro`
- Build could not be executed in this environment because `pnpm` is not installed (`command not found`).
