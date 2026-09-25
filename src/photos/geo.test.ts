import { describe, expect, it } from "vitest";

import { centroid, stayCenters, type GeoPoint } from "./geo";

const chicago = { city: "Chicago", countryCode: "US" };
const london = { city: "London", countryCode: "GB" };

const loop = { latitude: 41.5, longitude: -87.5 };
const pier = { latitude: 42.5, longitude: -87.75 };
const hydePark = { latitude: 51.5, longitude: -0.17 };
const heathrow = { latitude: 51.47, longitude: -0.46 };

const gps = (point: GeoPoint) => ({ gps: point });
const place = (point: GeoPoint) => ({ place: point });
const unlocated = {};

describe("centroid", () => {
  it("is undefined for no points", () => {
    expect(centroid([])).toBeUndefined();
  });

  it("averages the coordinates", () => {
    expect(centroid([loop, pier])).toEqual({
      latitude: 42,
      longitude: -87.625,
    });
  });
});

describe("stayCenters", () => {
  it("uses the stay's own geotagged photos", () => {
    const stay = { ...chicago, photos: [gps(loop), unlocated, gps(pier)] };
    expect(stayCenters([stay])).toEqual([{ latitude: 42, longitude: -87.625 }]);
  });

  it("prefers where the camera was over the place shown", () => {
    const stay = {
      ...london,
      photos: [{ ...gps(hydePark), ...place(heathrow) }, place(heathrow)],
    };
    expect(stayCenters([stay])).toEqual([hydePark]);
  });

  it("uses the places shown when no photo has GPS", () => {
    const airport = { ...london, photos: [place(heathrow)] };
    const gardens = { ...london, photos: [gps(hydePark)] };
    expect(stayCenters([airport, gardens])).toEqual([heathrow, hydePark]);
  });

  it("falls back to other stays in the same city", () => {
    const airport = { ...london, photos: [unlocated] };
    const gardens = { ...london, photos: [gps(hydePark)] };
    const stay = { ...chicago, photos: [gps(loop)] };
    expect(stayCenters([stay, airport, gardens])).toEqual([
      loop,
      hydePark,
      hydePark,
    ]);
  });

  it("is undefined when the city has no location data at all", () => {
    expect(stayCenters([{ ...london, photos: [unlocated] }])).toEqual([
      undefined,
    ]);
  });
});
