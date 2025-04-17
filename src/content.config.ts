import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';
import { SUPPORTED_LANGUAGES } from '../i18n/utils';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		lang: z.enum(SUPPORTED_LANGUAGES),
		slug: z.string(),
	}),
});

export const collections = { blog };
