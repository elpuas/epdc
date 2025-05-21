# ElPuas Digital Crafts

A modern, multilingual website built with Astro, showcasing digital services and portfolio projects with a focus on accessibility, performance, and user experience.

## Features

- **Multilingual Support**: Complete internationalization for English, Spanish, and Italian through file-based routing (`/en`, `/es`, `/it`)
- **Content-Driven Design**: MDX integration for portfolio projects and blog content
- **Image Optimization**: Astro's built-in image optimization for maximum performance
- **Netlify Integration**: Form handling on the contact pages with honeypot protection
- **Interactive Components**: Custom flipping cards, animated icons, and mobile dock navigation
- **Accessibility-First**: Semantic HTML, ARIA attributes, and keyboard navigation throughout
- **Modular Architecture**: Reusable components for consistent design across pages
- **Content Collections**: Type-safe Markdown and MDX content with schemas

## Tech Stack

- **[Astro](https://astro.build/)**: Core framework for static site generation
- **Custom CSS**: Modern Vanilla CSS with CSS nesting and custom properties
- **[Iconify](https://iconify.design/) + [Astro Icon](https://github.com/natemoo-re/astro-icon)**: Icon system
- **[Netlify](https://www.netlify.com/)**: Deployment and form handling
- **[MDX](https://mdxjs.com/)**: Enhanced markdown for content 
- **[Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)**: Structured content management

## Project Structure

```
├── public/             # Static assets (images, favicon, etc.)
├── src/
│   ├── components/     # Reusable UI components
│   ├── content/        # Collections of structured content (portfolio, blog)
│   ├── i18n/           # Internationalization utilities
│   ├── layouts/        # Page layouts and templates
│   ├── pages/          # Page routes and views
│   │   ├── en/         # English pages
│   │   ├── es/         # Spanish pages
│   │   ├── it/         # Italian pages
│   │   └── [lang]/     # Dynamic language routes
│   └── styles/         # CSS modules and global styles
├── binnacle/           # Change logs for project modifications
├── astro.config.mjs    # Astro configuration
└── package.json        # Project dependencies
```

### Key Components

- **Layout.astro**: Main page layout with header, footer, and SEO metadata
- **ProjectLayout.astro**: Template for portfolio project detail pages
- **ServiceCard.astro**: Reusable component for service offerings
- **LanguageSwitcher.astro**: Language toggle component for multilingual navigation
- **Footer.astro**: Site footer with company information and social links
- **Header.astro**: Site header with navigation links
- **MobileDock.astro**: Mobile-specific navigation component

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/epdc.git
cd epdc

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The site will be running at http://localhost:4321

### Building for Production

```bash
# Generate optimized build
pnpm build

# Preview production build locally
pnpm preview
```

## Deployment

This project is configured for deployment on Netlify. Simply connect your repository to Netlify, and it will automatically build and deploy when changes are pushed to the main branch.

## Development Guidelines

- **Language Consistency**: All three language versions should maintain identical structure and components
- **Components First**: Create reusable components for any UI elements that appear more than once
- **Accessibility**: Maintain accessibility standards in all new features
- **Change Logging**: Document all modifications in the `binnacle/` directory with dated markdown files
- **Image Optimization**: Always use Astro's Image component rather than HTML img tags

## Adding New Content

When adding new pages or sections:

1. Start with the English (`en`) version
2. Create matching pages in Spanish (`es`) and Italian (`it`) directories
3. Ensure identical component structure and styling across all languages
4. Only translate visible text content, not technical identifiers or code

## License

This project is proprietary and not licensed for public use without permission.
