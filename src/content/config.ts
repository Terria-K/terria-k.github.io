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
    tags: z.array(z.string().refine(x => x === x.toLowerCase(), "Tag must be lowercase.")).optional(),
    image: image()
  })
});

const artworks = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string().optional(),
    description: z.string().optional()
  })
})

export const collections = {
  games, posts, artworks
};