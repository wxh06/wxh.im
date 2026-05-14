import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/data/projects" }),
  schema: z.object({
    name: z.string(),
    sortOrder: z.number(),
    href: z.url(),
    github: z.string(),
    icons: z.array(z.string()),
  }),
});

const links = defineCollection({
  loader: file("./src/data/links.yaml"),
  schema: z.object({
    href: z.url(),
    img: z.object({
      src: z.url(),
      alt: z.string().optional(),
    }),
    title: z.string(),
    desc: z.string(),
  }),
});

export const collections = { projects, links };
