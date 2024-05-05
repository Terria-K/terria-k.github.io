import { defineCollection, z } from "astro:content";

const games = defineCollection({
  type: "content",
  schema: ({image}) => z.object({
    title: z.string(),
    description: z.string(),
    image: image()
  })
});

const posts = defineCollection({
  type: "content",
  schema: ({image}) => z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    tags: z.array(z.string()).optional(),
    image: image()
  })
});

export const collections = {
  games, posts
};