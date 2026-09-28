import pLimit from "p-limit";

import { outline, type Place } from "@/photos/geo";

// Nominatim's usage policy: identify the application, one request at a
// time, and cache the results, which the content layer's data store does.
const ENDPOINT = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "wxh.im photos (https://wxh.im)";
const limit = pLimit(1);
// Simplification tolerance in degrees, about 20 m: keeps an airport's
// outline at a few kilobytes without visibly straightening a park's edge at
// the zoom a whole stay fits in.
const OUTLINE_THRESHOLD = "0.0002";

/** Nominatim answered 429: the usage policy was breached and the client is blocked. */
export class RateLimited extends Error {
  constructor() {
    super("Nominatim rate limit hit");
    this.name = "RateLimited";
  }
}

interface NominatimPlace {
  lat: string;
  lon: string;
  geojson: unknown;
}

async function search(query: string, countryCode: string) {
  const url = new URL(ENDPOINT);
  url.searchParams.set("q", query);
  url.searchParams.set("countrycodes", countryCode);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("polygon_geojson", "1");
  url.searchParams.set("polygon_threshold", OUTLINE_THRESHOLD);
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (response.status === 429) throw new RateLimited();
  if (!response.ok) {
    throw new Error(`Nominatim responded ${String(response.status)}`);
  }
  const [found] = (await response.json()) as NominatimPlace[];
  if (!found) return undefined;
  return {
    latitude: Number(found.lat),
    longitude: Number(found.lon),
    // A place mapped as a node has a Point here, which adds nothing to the
    // point above; one mapped as a way along a street has a line, and only
    // one of the many ways a street is made of, which misleads.
    outline: outline.safeParse(found.geojson).data,
  };
}

const inFlight = new Map<string, Promise<Place | undefined>>();

/**
 * The place a free-form name within a country refers to, or `undefined`
 * when Nominatim has nothing for it. Identical lookups share one request while it is
 * in flight, which is what a batch of photos from one place produces.
 */
export function geocode(
  query: string,
  countryCode: string,
): Promise<Place | undefined> {
  const key = `${countryCode}/${query}`;
  let result = inFlight.get(key);
  if (!result) {
    result = limit(() => search(query, countryCode));
    inFlight.set(key, result);
    result.catch(() => inFlight.delete(key));
  }
  return result;
}
