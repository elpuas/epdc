# 2026-05-21 - CHG032 - Add WordPress 7.0 + Studio AI-native blog post (ES)

## What changed
- Added new Spanish blog post MDX file:
  - `src/content/blog/wordpress-7-studio-inicio-wordpress-ai-native.es.mdx`
- Reused existing local blog image assets as temporary placeholders:
  - `public/post-gianfranco.jpg` (hero + frontmatter image)
  - `public/wordpress-bien-hecho-parte-dos.webp`
  - `public/telex.png`
- Added external source/reference links in content where relevant:
  - WordPress Studio
  - WordPress AI team page
  - AI Building Blocks / Abilities API context
  - WordPress.com

## Reference template used
- Main structure reference:
  - `src/content/blog/como-wordpress-esta-integrando-la-ia.es.mdx`
- Secondary style/reference check:
  - `src/content/blog/wordpress-6-9-lo-nuevo.mdx`

## Notes
- Followed existing blog conventions in this repo: frontmatter keys (`title`, `lang`, `description`, `image`, `date`, `author`), `astro:assets` image block pattern, and CTA notification block.
- Build verification could not be executed in this environment because `pnpm` is not available (`command not found`).
