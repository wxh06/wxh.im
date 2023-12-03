import { z, defineCollection } from "astro:content";

const projectCollection = defineCollection({
  schema: z.object({
    name: z.string(),
    sortOrder: z.number(),
    href: z.string(),
    github: z.string(),
    icons: z.array(z.string()),
  }),
});

export const collections = {
  projects: projectCollection,
};
