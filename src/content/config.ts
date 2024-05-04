import { defineCollection, z, type Render } from "astro:content";

const gamesCollection = defineCollection({
  type: 'content',
  schema: ({image}) => z.object({
    title: z.string(),
    description: z.string(),
    image: image()
  })
});

export type GamesCollection = {
  id: string;
  slug: string;
  body: string;
  collection: "games";
  data: {
    title: string,
    description: string,
    image: ImageMetadata
  }
} & { render(): Render[".md"]};

export const collections = {
  'games': gamesCollection
};