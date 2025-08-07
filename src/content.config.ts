import { defineCollection, z } from "astro:content";

const projects = defineCollection({
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
    image: image(),
    draft: z.boolean().optional()
  })
});

const artworks = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string().optional(),
    description: z.string().optional()
  })
})

const fourOFour = defineCollection({
    type: "content"
});

export const collections = {
  projects, posts, artworks, ["404"]: fourOFour
};