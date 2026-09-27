import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Loader } from "astro/loaders";
import ExifReader, { type ExpandedTags } from "exifreader";

import type { Place } from "@/photos/geo";

import { geocode, RateLimited } from "./geocode";

export interface PhotosLoaderOptions {
  /** Directory holding the exported JPEGs, relative to the project root. */
  base: string;
}

const isJpeg = (name: string) => /\.jpe?g$/i.test(name);

/** Numeric value of an EXIF rational tag, e.g. FNumber `[71, 10]` → 7.1. */
const rational = (tag: { value: unknown } | undefined) => {
  if (!Array.isArray(tag?.value)) return undefined;
  const [num, den] = tag.value as [number, number];
  return num / den;
};

/**
 * Descriptive fields are taken from XMP only, never from their EXIF/IPTC
 * duplicates: Lightroom writes everything it edits to XMP, and only XMP
 * `DateCreated` keeps the capture-time UTC offset, which EXIF loses on cameras
 * that omit `OffsetTimeOriginal`.
 */
function extract(tags: ExpandedTags, fileName: string) {
  const xmp = (key: string) => tags.xmp?.[key]?.description;
  const keywords = tags.xmp?.subject?.value;
  const { Latitude: latitude, Longitude: longitude } = tags.gps ?? {};

  return {
    image: fileName,
    title: xmp("title"),
    description: xmp("description"),
    dateCreated: xmp("DateCreated"),
    city: xmp("City"),
    location: xmp("Location"),
    state: xmp("State"),
    country: xmp("Country"),
    countryCode: xmp("CountryCode"),
    keywords: Array.isArray(keywords)
      ? keywords.map((keyword) => keyword.description)
      : [],
    gps:
      latitude !== undefined && longitude !== undefined
        ? { latitude, longitude }
        : undefined,
    camera: {
      make: tags.exif?.Make?.description,
      model: tags.exif?.Model?.description,
    },
    lens: tags.exif?.LensModel?.description,
    // Set by Lightroom on the result of merging bracketed exposures.
    mergedHdr: xmp("IsMergedHDR") === "True",
    exposure: {
      exposureTime: tags.exif?.ExposureTime?.description,
      fNumber: rational(tags.exif?.FNumber),
      iso: [tags.exif?.ISOSpeedRatings?.value].flat()[0],
      focalLength: rational(tags.exif?.FocalLength),
      focalLength35mm: tags.exif?.FocalLengthIn35mmFilm?.value,
    },
  };
}

type Extracted = ReturnType<typeof extract>;
type PhotoData = Extracted & { place?: Place | undefined };

export function photos({ base }: PhotosLoaderOptions): Loader {
  return {
    name: "photos",
    load: async (context) => {
      const { config, store, watcher, logger } = context;
      const dir = fileURLToPath(new URL(base, config.root));

      const idOf = (filePath: string) => {
        const relative = path.relative(dir, filePath);
        return relative
          .slice(0, -path.extname(relative).length)
          .split(path.sep)
          .join("/");
      };

      /**
       * The place a photo shows, its sublocation, which is distinct from
       * where the camera was. Photos from one place share it, so an entry
       * already in the store answers for any new photo from the same place
       * without a lookup.
       */
      async function locate({
        location,
        city,
        countryCode,
      }: Extracted): Promise<Place | undefined> {
        if (!location || !city || !countryCode) return undefined;
        for (const entry of store.values()) {
          const data = entry.data as PhotoData;
          if (
            data.place &&
            data.location === location &&
            data.city === city &&
            data.countryCode === countryCode
          ) {
            return data.place;
          }
        }
        return geocode(`${location}, ${city}`, countryCode);
      }

      async function loadFile(filePath: string) {
        const id = idOf(filePath);
        const relativePath = path
          .relative(fileURLToPath(config.root), filePath)
          .split(path.sep)
          .join("/");

        // Size and mtime stand in for a content digest so an unchanged file is
        // skipped without being read; a stale hit only costs a re-parse.
        const { size, mtimeMs } = await stat(filePath);
        const digest = context.generateDigest(
          `${String(size)}:${String(mtimeMs)}`,
        );
        if (store.get(id)?.digest === digest) return;

        const tags = ExifReader.load(await readFile(filePath), {
          expanded: true,
        });
        const extracted = extract(tags, path.basename(filePath));
        let place: Place | undefined;
        let located = true;
        try {
          place = await locate(extracted);
        } catch (error: unknown) {
          // Being rate limited is not one lookup failing but the run
          // breaching the usage policy: it fails the build outright.
          if (error instanceof RateLimited) throw error;
          logger.warn(`Could not geocode ${id}: ${String(error)}`);
          located = false;
        }
        const data = await context.parseData({
          id,
          filePath: relativePath,
          data: { ...extracted, place },
        });
        // A lookup that failed is more likely the network than the name,
        // so the entry is stored without a digest and retried next sync.
        store.set({
          id,
          data,
          filePath: relativePath,
          ...(located && { digest }),
        });
        logger.debug(`Loaded ${id}`);
      }

      // Lightroom publishes through a `tmp` folder inside the destination
      // and moves each file out once written. Even a header-only file in
      // there parses as a photo, only to point the page at an image that is
      // about to move away, so nothing under that folder counts.
      const isPhoto = (filePath: string) => {
        const relative = path.relative(dir, filePath);
        return (
          !relative.startsWith("..") &&
          isJpeg(relative) &&
          !relative.split(path.sep).includes("tmp")
        );
      };
      const entries = await readdir(dir, {
        recursive: true,
        withFileTypes: true,
      });
      const files = entries
        .filter((entry) => entry.isFile())
        .map((entry) => path.join(entry.parentPath, entry.name))
        .filter(isPhoto);

      const ids = new Set(files.map(idOf));
      for (const id of store.keys()) {
        if (!ids.has(id)) store.delete(id);
      }
      await Promise.all(files.map(loadFile));

      if (!watcher) return;
      watcher.add(dir);
      const onChange = (filePath: string) => {
        if (!isPhoto(filePath)) return;
        // An export still being written parses as a truncated JPEG; the
        // follow-up change event reloads it once complete.
        loadFile(filePath).catch((error: unknown) => {
          logger.error(`Failed to load ${filePath}: ${String(error)}`);
        });
      };
      watcher.on("add", onChange);
      watcher.on("change", onChange);
      watcher.on("unlink", (filePath: string) => {
        if (isPhoto(filePath)) store.delete(idOf(filePath));
      });
    },
  };
}
