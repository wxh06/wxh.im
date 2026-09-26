import { z } from "astro/zod";

export const geoPoint = z.object({
  latitude: z.number(),
  longitude: z.number(),
});
export type GeoPoint = z.infer<typeof geoPoint>;

/** GeoJSON `[longitude, latitude]`. */
const position = z.tuple([z.number(), z.number()]);

/** The GeoJSON geometries that give a place an area rather than a point. */
export const outline = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("Polygon"),
    coordinates: z.array(z.array(position)),
  }),
  z.object({
    type: z.literal("MultiPolygon"),
    coordinates: z.array(z.array(z.array(position))),
  }),
]);
export type Outline = z.infer<typeof outline>;

/** A named place as the gazetteer knows it: a point, and an outline if it has one. */
export const place = geoPoint.extend({ outline: outline.optional() });
export type Place = z.infer<typeof place>;

export interface Stay {
  city: string;
  countryCode: string;
  photos: readonly {
    id: string;
    location?: string | undefined;
    gps?: GeoPoint | undefined;
    place?: Place | undefined;
  }[];
}

export interface Camera {
  point: GeoPoint;
  /** The photo taken from it. */
  photo: string;
}

/** `[west, south, east, north]`, as a map library takes it. */
export type Bounds = [number, number, number, number];

export interface StayGeometry {
  /** The places the stay's photos show, one per sublocation. */
  places: (Place & {
    name: string;
    /** The first photo showing it. */
    photo: string;
    bounds?: Bounds | undefined;
  })[];
  /** Where the camera was, one per geotagged photo. */
  cameras: Camera[];
  /** What a map should frame for the stay; absent when nothing locates it. */
  bounds?: Bounds | undefined;
}

/** Every vertex of an outline, whatever its nesting. */
export function vertices({ type, coordinates }: Outline): GeoPoint[] {
  const flat = type === "Polygon" ? coordinates.flat() : coordinates.flat(2);
  return flat.map(([longitude, latitude]) => ({ latitude, longitude }));
}

/** A place's own point, or its outline when it has one. */
const extent = (place: Place): GeoPoint[] =>
  place.outline ? vertices(place.outline) : [place];

// A plain box is fine at city scale, where no set of points straddles the
// antimeridian.
export function bounds(points: readonly GeoPoint[]): Bounds | undefined {
  if (points.length === 0) return undefined;
  const longitudes = points.map((point) => point.longitude);
  const latitudes = points.map((point) => point.latitude);
  return [
    Math.min(...longitudes),
    Math.min(...latitudes),
    Math.max(...longitudes),
    Math.max(...latitudes),
  ];
}

/**
 * What to draw for each stay: the places shown, with their outlines, and the
 * camera positions, framed together. A stay none of whose photos is located
 * is framed on every located photo from the same city, which at least lands
 * in the right city.
 */
export function stayGeometries(stays: readonly Stay[]): StayGeometry[] {
  const cityKey = (stay: Stay) => `${stay.countryCode}/${stay.city}`;

  const geometries = stays.map((stay) => {
    const places = new Map<string, StayGeometry["places"][number]>();
    const cameras: Camera[] = [];
    for (const { id, location, gps, place } of stay.photos) {
      if (location && place && !places.has(location)) {
        places.set(location, {
          name: location,
          ...place,
          photo: id,
          bounds: place.outline && bounds(vertices(place.outline)),
        });
      }
      if (gps) cameras.push({ point: gps, photo: id });
    }
    return { places: [...places.values()], cameras };
  });
  const points = ({ places, cameras }: (typeof geometries)[number]) => [
    ...cameras.map(({ point }) => point),
    ...places.flatMap(extent),
  ];

  const byCity = new Map<string, GeoPoint[]>();
  stays.forEach((stay, index) => {
    const key = cityKey(stay);
    byCity.set(key, [
      ...(byCity.get(key) ?? []),
      ...points(geometries[index]!),
    ]);
  });

  return geometries.map((geometry, index) => ({
    ...geometry,
    bounds:
      bounds(points(geometry)) ??
      bounds(byCity.get(cityKey(stays[index]!)) ?? []),
  }));
}
