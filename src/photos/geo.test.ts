import { describe, expect, it } from "vitest";

import {
  bounds,
  stayGeometries,
  vertices,
  type GeoPoint,
  type Outline,
} from "./geo";

const chicago = { city: "Chicago", countryCode: "US" };
const london = { city: "London", countryCode: "GB" };

const loop = { latitude: 41.5, longitude: -87.5 };
const pier = { latitude: 42.5, longitude: -87.75 };
const hydePark = { latitude: 51.5, longitude: -0.17 };
const heathrow = { latitude: 51.47, longitude: -0.46 };

// A ring around Heathrow, as a Nominatim polygon: [longitude, latitude].
const apron: Outline = {
  type: "Polygon",
  coordinates: [
    [
      [-0.5, 51.45],
      [-0.4, 51.45],
      [-0.4, 51.5],
      [-0.5, 51.5],
      [-0.5, 51.45],
    ],
  ],
};

const gps = (id: string, point: GeoPoint) => ({ id, gps: point });
const place = (
  id: string,
  name: string,
  point: GeoPoint,
  outline?: Outline,
) => ({
  id,
  location: name,
  place: { ...point, outline },
});
const unlocated = { id: "x" };

describe("vertices", () => {
  it("lists a polygon's positions as points", () => {
    const strip: Outline = {
      type: "Polygon",
      coordinates: [
        [
          [-87.5, 41.5],
          [-87.75, 42.5],
        ],
      ],
    };
    expect(vertices(strip)).toEqual([loop, pier]);
  });

  it("flattens every ring of a multipolygon", () => {
    const islands: Outline = {
      type: "MultiPolygon",
      coordinates: [[[[-87.5, 41.5]]], [[[-87.75, 42.5]]]],
    };
    expect(vertices(islands)).toEqual([loop, pier]);
  });
});

describe("bounds", () => {
  it("is undefined for no points", () => {
    expect(bounds([])).toBeUndefined();
  });

  it("collapses to a single point", () => {
    expect(bounds([loop])).toEqual([-87.5, 41.5, -87.5, 41.5]);
  });

  it("boxes the points as west, south, east, north", () => {
    expect(bounds([loop, pier])).toEqual([-87.75, 41.5, -87.5, 42.5]);
  });
});

describe("stayGeometries", () => {
  it("lists camera positions by photo and frames them", () => {
    const stay = {
      ...chicago,
      photos: [gps("a", loop), unlocated, gps("b", pier)],
    };
    expect(stayGeometries([stay])).toEqual([
      {
        places: [],
        cameras: [
          { point: loop, photo: "a" },
          { point: pier, photo: "b" },
        ],
        bounds: [-87.75, 41.5, -87.5, 42.5],
      },
    ]);
  });

  it("lists each place once, with the first photo showing it", () => {
    const stay = {
      ...london,
      photos: [
        place("a", "Heathrow", heathrow),
        place("b", "Heathrow", heathrow),
      ],
    };
    expect(stayGeometries([stay])[0]?.places).toEqual([
      { name: "Heathrow", ...heathrow, photo: "a" },
    ]);
  });

  it("frames the places shown together with the camera positions", () => {
    const stay = {
      ...london,
      photos: [{ ...gps("a", hydePark), ...place("a", "Heathrow", heathrow) }],
    };
    expect(stayGeometries([stay])[0]).toEqual({
      places: [{ name: "Heathrow", ...heathrow, photo: "a" }],
      cameras: [{ point: hydePark, photo: "a" }],
      bounds: [-0.46, 51.47, -0.17, 51.5],
    });
  });

  it("frames a place on its whole outline", () => {
    const stay = {
      ...london,
      photos: [place("a", "Heathrow", heathrow, apron)],
    };
    expect(stayGeometries([stay])[0]?.bounds).toEqual([
      -0.5, 51.45, -0.4, 51.5,
    ]);
  });

  it("frames an unlocated stay on other stays in the same city", () => {
    const airport = { ...london, photos: [unlocated] };
    const gardens = { ...london, photos: [gps("a", hydePark)] };
    const stay = { ...chicago, photos: [gps("b", loop)] };
    expect(
      stayGeometries([stay, airport, gardens]).map((g) => g.bounds),
    ).toEqual([
      [-87.5, 41.5, -87.5, 41.5],
      [-0.17, 51.5, -0.17, 51.5],
      [-0.17, 51.5, -0.17, 51.5],
    ]);
  });

  it("has no bounds when the city has no location data at all", () => {
    expect(stayGeometries([{ ...london, photos: [unlocated] }])).toEqual([
      { places: [], cameras: [], bounds: undefined },
    ]);
  });
});
