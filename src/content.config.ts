import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string().regex(/^[a-z0-9][a-z0-9._-]*$/),
    category: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    charts: z.boolean().default(false),
  }),
});

export const collections = { posts };
