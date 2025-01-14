import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/data/projects" }),
  schema: z.object({
    name: z.string(),
    sortOrder: z.number(),
    href: z.string().url(),
    github: z.string(),
    icons: z.array(z.string()),
  }),
});

const links = defineCollection({
  loader: file("./src/data/links.yaml"),
  schema: z.object({
    href: z.string().url(),
    img: z.object({
      src: z.string().url(),
      alt: z.string().optional(),
    }),
    title: z.string(),
    desc: z.string(),
  }),
});

export const collections = { projects, links };
