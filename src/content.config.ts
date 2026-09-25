import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

import { photos as photosLoader } from "@/loaders/photos";

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

// ICU's region table stands in for an ISO 3166-1 list; it also admits a few
// CLDR-only codes such as UK, EU and ZZ, which hand-filled metadata won't hit.
const regionNames = new Intl.DisplayNames(["en"], {
  type: "region",
  fallback: "none",
});
const isRegionCode = (code: string) => {
  try {
    return regionNames.of(code) !== undefined;
  } catch {
    // Not even a well-formed region subtag, e.g. three letters.
    return false;
  }
};

const photos = defineCollection({
  loader: photosLoader({ base: "./photos" }),
  schema: ({ image }) =>
    z.object({
      image: image(),
      title: z.string().optional(),
      description: z.string().optional(),
      dateCreated: z.iso.datetime({ offset: true }),
      city: z.string(),
      location: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      countryCode: z
        .string()
        .refine(isRegionCode, "not an ISO 3166-1 alpha-2 code"),
      keywords: z.array(z.string()),
      gps: z.object({ latitude: z.number(), longitude: z.number() }).optional(),
      camera: z.object({ make: z.string().optional(), model: z.string() }),
      lens: z.string().optional(),
      exposure: z.object({
        exposureTime: z.string().optional(),
        fNumber: z.number().optional(),
        iso: z.number().optional(),
        focalLength: z.number().optional(),
        focalLength35mm: z.number().optional(),
      }),
    }),
});

export const collections = { projects, links, photos };
