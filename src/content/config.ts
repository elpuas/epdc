import { defineCollection, z } from 'astro:content';

// Define the flexible schema for the blog collection
const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(), 
    // Handle both 'date' and 'pubDate'
    date: z.preprocess((frontmatter) => {
      if (frontmatter && typeof frontmatter === 'object') {
        if ('date' in frontmatter) return frontmatter.date;
        if ('pubDate' in frontmatter) return frontmatter.pubDate;
      }
      return undefined; 
    }, z.string().transform((str) => new Date(str)).optional()),
    // Handle both 'image' and 'heroImage'
    image: z.preprocess((frontmatter) => {
       if (frontmatter && typeof frontmatter === 'object') {
        if ('image' in frontmatter) return frontmatter.image;
        if ('heroImage' in frontmatter) return frontmatter.heroImage;
       }
      return undefined; 
    }, z.string().optional()),
    // Make lang optional and default to 'en' if missing
    lang: z.enum(['en', 'es', 'it']).optional().default('en'), 
  }),
});

// Export collections
export const collections = {
  'blog': blogCollection,
}; 