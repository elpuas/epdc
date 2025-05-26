import { defineCollection, z } from 'astro:content';

// Define the flexible schema for the blog collection
const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(), 
    // Handle date field
    date: z.string().transform((str) => new Date(str)).optional(),
    // Simplified image field - no complex preprocessing needed
    image: z.string().optional(),
    // Make lang optional and default to 'en' if missing
    lang: z.enum(['en', 'es', 'it']).optional().default('en'),
    // Add optional author field
    author: z.string().optional(),
  }),
});

// Define the portfolio collection schema
const portfolioCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().transform((str) => new Date(str)),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    lang: z.enum(['en', 'es', 'it']),
    slug: z.string().optional(), // Make slug optional as it can be inferred from filename
  }),
});

// Export collections
export const collections = {
  'blog': blogCollection,
  'portfolio': portfolioCollection,
}; 