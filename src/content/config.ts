import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  schema: z.object({
    draft: z.boolean().default(true),
    title: z.string(),
    description: z.string(),
    author: z.string().default("richard"),
    tags: z.array(z.string()),
    footnote: z.string().optional(),
    pubDate: z.string(),
    content: z.string().default("blog"),
    canonicalURL: z.string().url().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
