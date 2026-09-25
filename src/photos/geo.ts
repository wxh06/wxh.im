export interface GeoPoint {
  latitude: number;
  longitude: number;
}

interface Stay {
  city: string;
  countryCode: string;
  photos: readonly { gps?: GeoPoint | undefined }[];
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
 * Where to place each stay on a map: the centroid of its geotagged photos,
 * falling back to the centroid of every geotagged photo from the same city
 * so a stay whose photos all lack GPS still lands somewhere sensible.
 */
export function stayCenters(stays: readonly Stay[]): (GeoPoint | undefined)[] {
  const cityKey = (stay: Stay) => `${stay.countryCode}/${stay.city}`;
  const points = (stay: Stay) =>
    stay.photos.flatMap((photo) => (photo.gps ? [photo.gps] : []));

  const byCity = new Map<string, GeoPoint[]>();
  for (const stay of stays) {
    const key = cityKey(stay);
    byCity.set(key, [...(byCity.get(key) ?? []), ...points(stay)]);
  }

  return stays.map(
    (stay) =>
      centroid(points(stay)) ?? centroid(byCity.get(cityKey(stay)) ?? []),
  );
}
