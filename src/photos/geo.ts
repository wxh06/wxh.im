import { z } from "astro/zod";

export const geoPoint = z.object({
  latitude: z.number(),
  longitude: z.number(),
});
export type GeoPoint = z.infer<typeof geoPoint>;

export interface Stay {
  city: string;
  countryCode: string;
  photos: readonly {
    gps?: GeoPoint | undefined;
    place?: GeoPoint | undefined;
  }[];
}

// A plain mean is fine at city scale, where no set of points straddles the
// antimeridian.
export function centroid(points: readonly GeoPoint[]): GeoPoint | undefined {
  if (points.length === 0) return undefined;
  let latitude = 0;
  let longitude = 0;
  for (const point of points) {
    latitude += point.latitude;
    longitude += point.longitude;
  }
  return {
    latitude: latitude / points.length,
    longitude: longitude / points.length,
  };
}

/**
 * Where to place each stay on a map: the centroid of its geotagged photos;
 * failing that, of the places its photos show; failing that, of every located
 * photo from the same city, which at least lands in the right city.
 */
export function stayCenters(stays: readonly Stay[]): (GeoPoint | undefined)[] {
  const cityKey = (stay: Stay) => `${stay.countryCode}/${stay.city}`;
  const points = (stay: Stay, key: "gps" | "place") =>
    stay.photos.flatMap((photo) => photo[key] ?? []);

  const byCity = new Map<string, GeoPoint[]>();
  for (const stay of stays) {
    const key = cityKey(stay);
    byCity.set(key, [
      ...(byCity.get(key) ?? []),
      ...points(stay, "gps"),
      ...points(stay, "place"),
    ]);
  }

  return stays.map(
    (stay) =>
      centroid(points(stay, "gps")) ??
      centroid(points(stay, "place")) ??
      centroid(byCity.get(cityKey(stay)) ?? []),
  );
}
