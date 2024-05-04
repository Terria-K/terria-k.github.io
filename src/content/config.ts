import { defineCollection, z, type Render } from "astro:content";

const gamesCollection = defineCollection({
  type: 'content',
  schema: ({image}) => z.object({
    title: z.string(),
    description: z.string(),
    image: image()
  })
});

const postsCollection = defineCollection({
  type: 'content',
  schema: ({image}) => z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    tags: z.array(z.string()).optional(),
    image: image()
  })
})

export const collections = {
  'posts': postsCollection,
  'games': gamesCollection
};