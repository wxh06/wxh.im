import { describe, expect, it } from "vitest";

import { centroid, stayCenters } from "./geo";

const chicago = { city: "Chicago", countryCode: "US" };
const london = { city: "London", countryCode: "GB" };

const loop = { latitude: 41.5, longitude: -87.5 };
const pier = { latitude: 42.5, longitude: -87.75 };
const hydePark = { latitude: 51.5, longitude: -0.17 };

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
    const stay = { ...chicago, photos: [{ gps: loop }, {}, { gps: pier }] };
    expect(stayCenters([stay])).toEqual([{ latitude: 42, longitude: -87.625 }]);
  });

  it("falls back to other stays in the same city", () => {
    const heathrow = { ...london, photos: [{}] };
    const gardens = { ...london, photos: [{ gps: hydePark }] };
    const stay = { ...chicago, photos: [{ gps: loop }] };
    expect(stayCenters([stay, heathrow, gardens])).toEqual([
      loop,
      hydePark,
      hydePark,
    ]);
  });

  it("is undefined when the city has no GPS data at all", () => {
    expect(stayCenters([{ ...london, photos: [{}] }])).toEqual([undefined]);
  });
});
