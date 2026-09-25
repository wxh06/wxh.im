import pLimit from "p-limit";

import type { GeoPoint } from "@/photos/geo";

// Nominatim's usage policy: identify the application, one request at a
// time, and cache the results, which the content layer's data store does.
const ENDPOINT = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "wxh.im photos (https://wxh.im)";
const limit = pLimit(1);

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
}

async function search(query: string, countryCode: string) {
  const url = new URL(ENDPOINT);
  url.searchParams.set("q", query);
  url.searchParams.set("countrycodes", countryCode);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (response.status === 429) throw new RateLimited();
  if (!response.ok) {
    throw new Error(`Nominatim responded ${String(response.status)}`);
  }
  const [place] = (await response.json()) as NominatimPlace[];
  return place
    ? { latitude: Number(place.lat), longitude: Number(place.lon) }
    : undefined;
}

const inFlight = new Map<string, Promise<GeoPoint | undefined>>();

/**
 * Position of a free-form place name within a country, or `undefined` when
 * Nominatim has nothing for it. Identical lookups share one request while it is
 * in flight, which is what a batch of photos from one place produces.
 */
export function geocode(
  query: string,
  countryCode: string,
): Promise<GeoPoint | undefined> {
  const key = `${countryCode}/${query}`;
  let result = inFlight.get(key);
  if (!result) {
    result = limit(() => search(query, countryCode));
    inFlight.set(key, result);
    result.catch(() => inFlight.delete(key));
  }
  return result;
}
