# AGENTS.md

A multilingual Astro website for ElPuas Digital Crafts with MDX content management, accessibility-first design, and Netlify deployment.

## Project Architecture

- **Framework**: Astro 5.x with MDX integration
- **Languages**: TypeScript, Modern CSS with CSS nesting
- **Content**: File-based routing with content collections
- **Internationalization**: English (`en`), Spanish (`es`), Italian (`it`)
- **Deployment**: Netlify with form handling and redirects
- **Icons**: Astro Icon with Iconify (Phosphor icons + Circle Flags)

## Setup Commands

```bash
# Install dependencies
pnpm install

# Start development server (runs on localhost:4321)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run Astro CLI commands
pnpm astro --help
```

## Development Workflow

### Shell Environment
- Use `zsh` for all terminal commands
- Project uses ES modules (`"type": "module"` in package.json)
- All commands should be run from project root: `/Users/alfredonavas/REACT/epdc`

### Directory Structure Guide
```
src/
├── components/          # Reusable Astro components (.astro files)
├── content/            # Content collections (blog/, portfolio/)
│   ├── blog/           # MDX blog posts with .es.mdx, .en.mdx, .it.mdx
│   └── portfolio/      # MDX portfolio projects with language variants
├── i18n/              # Translation utilities and JSON files
├── layouts/           # Page layouts (Layout.astro, BlogPost.astro, etc.)
├── pages/             # File-based routing
│   ├── en/, es/, it/  # Language-specific pages
│   └── [lang]/        # Dynamic language routes
└── styles/            # CSS modules (.module.css) and global styles
```

## Content Management

### Adding Blog Posts
1. Create MDX files with language suffixes: `post-title.es.mdx`, `post-title.en.mdx`, `post-title.it.mdx`
2. Required frontmatter schema:
```yaml
---
title: "Post Title"
lang: "es"  # Must be "en", "es", or "it"
description: "SEO description"
image: "/image-filename.webp"  # Optional, from /public
date: "2025-09-18"  # YYYY-MM-DD format
author: "Author Name"  # Optional
---
```
3. Place in `src/content/blog/`
4. Use Astro's Image component for images: `<Image src={imageName} alt="description" />`

### Adding Portfolio Projects
1. Create MDX files with language variants in `src/content/portfolio/`
2. Required frontmatter:
```yaml
---
title: "Project Title"
description: "Project description"
date: "2025-09-18"
image: "/project-image.webp"
tags: ["web", "ecommerce"]  # Optional array
lang: "en"  # Required: "en", "es", or "it"
---
```

### Translation Guidelines
- **Always create content in all 3 languages**: English, Spanish, Italian
- **File naming**: Use language suffixes (`.en.mdx`, `.es.mdx`, `.it.mdx`)
- **Preserve structure**: Same headings, components, and image references across languages
- **Translate only**: Visible text, alt attributes, frontmatter title/description
- **Keep identical**: Import paths, component names, CSS classes, image filenames

## Component Development

### Creating New Components
- Place in `src/components/` with `.astro` extension
- Use TypeScript for props interface:
```typescript
---
interface Props {
  title: string;
  description?: string;
}
const { title, description } = Astro.props;
---
```
- Import CSS modules: `import styles from '../styles/Component.module.css';`
- Use semantic HTML and ARIA attributes for accessibility

### Styling Guidelines
- **CSS Modules**: Use `.module.css` for component-specific styles
- **Global styles**: Add to `src/styles/global.css`
- **CSS Custom Properties**: Defined in `src/styles/variables.css`
- **Modern CSS**: Use CSS nesting, logical properties, and container queries
- **No external CSS frameworks**: Project uses vanilla CSS only

## Internationalization

### Language Routing
- Default language (`en`) has no prefix: `/about`
- Other languages use prefixes: `/es/about`, `/it/about`
- Netlify redirect in `netlify.toml` sends `/` to `/en/`

### Adding Translations
1. Update `src/i18n/translations/` JSON files for UI text
2. Add page translations in respective language directories
3. Update `src/i18n/utils.ts` if adding new translation keys
4. Test all language variants maintain identical component structure

## Build and Deployment

### Local Development
```bash
# Check build without deploying
pnpm build && pnpm preview

# Development with file watching
pnpm dev
```

### Production Deployment
- **Platform**: Netlify (automatic deployment from git)
- **Build command**: `pnpm build`
- **Publish directory**: `dist/`
- **Forms**: Handled by Netlify with honeypot protection
- **Redirects**: Configured in `netlify.toml`

### Pre-deployment Checklist
- [ ] All content exists in en/es/it variants
- [ ] Images optimized and using Astro Image component
- [ ] No broken internal links between language versions
- [ ] Accessibility tested (semantic HTML, ARIA, keyboard navigation)
- [ ] Build completes without errors: `pnpm build`

## Code Style and Conventions

### File Naming
- **Components**: PascalCase (`BlogCard.astro`)
- **Pages**: kebab-case (`terms-and-conditions.astro`)
- **Content**: kebab-case with language suffix (`post-title.es.mdx`)
- **Styles**: Component.module.css for CSS modules

### Accessibility Requirements
- Use semantic HTML elements (`<main>`, `<nav>`, `<article>`)
- Include alt text for all images
- Ensure proper heading hierarchy (h1 → h2 → h3)
- Test keyboard navigation
- Maintain color contrast ratios (WCAG AA)

### Import Organization
```typescript
// 1. Astro/framework imports
import { Image } from 'astro:assets';

// 2. Component imports
import Layout from '../layouts/Layout.astro';

// 3. Asset imports
import heroImage from '../assets/hero.webp';

// 4. Utility imports
import { getTranslations } from '../i18n/utils';
```

## Testing and Quality Assurance

### Manual Testing Checklist
- [ ] All pages load in en/es/it variants
- [ ] Images display correctly with proper optimization
- [ ] Forms submit successfully (contact pages)
- [ ] Mobile dock navigation works on small screens
- [ ] Language switcher updates URL and content
- [ ] RSS feed generates correctly (`/rss.xml`)

### Performance Considerations
- Use Astro's Image component for automatic optimization
- Lazy load images below the fold
- Minimize JavaScript (Astro islands only when needed)
- Optimize fonts and use CSS custom properties for theming

## Change Documentation

### Binnacle Logging
- Document all changes in `binnacle/` directory
- Use format: `YYYY-MM-DD-CHG###-description.md`
- Include: what changed, why, and any breaking changes
- Reference specific files and components affected

### Commit Messages
- Format: `[component/area] Brief description`
- Examples:
  - `[blog] Add new AI integration post in es/en/it`
  - `[header] Fix language switcher navigation bug`
  - `[styles] Update CSS custom properties for dark mode`

## Security and Performance

### Security Guidelines
- Sanitize form inputs (handled by Netlify)
- Use Astro's built-in XSS protection
- Keep dependencies updated
- No sensitive data in frontend code

### Performance Targets
- **Core Web Vitals**: All pages should pass
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## Common Tasks

### Adding a New Page
```bash
# 1. Create page files
touch src/pages/en/new-page.astro
touch src/pages/es/new-page.astro  
touch src/pages/it/new-page.astro

# 2. Add navigation links in Header.astro (if needed)
# 3. Update i18n translations for menu text
# 4. Test all language versions
```

### Updating Styles
```bash
# 1. Edit relevant CSS module or global styles
# 2. Check changes don't break other components
# 3. Ensure responsive design works on mobile
# 4. Verify accessibility (color contrast, focus states)
```

### Content Updates
```bash
# 1. Update MDX files in all language variants
# 2. Ensure frontmatter schema matches content/config.ts
# 3. Optimize and add new images to /public if needed
# 4. Preview changes: pnpm dev
```

This project prioritizes accessibility, performance, and maintainable multilingual content. Always test changes across all language variants and ensure the experience remains consistent for users regardless of their language preference.