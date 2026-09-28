import { describe, expect, test } from "vitest";

import { groupTimeline } from "./timeline";

const chicago = { city: "Chicago", countryCode: "US" };
const london = { city: "London", countryCode: "GB" };

describe("groupTimeline", () => {
  test("groups by the local calendar day, not the UTC day", () => {
    const entries = groupTimeline([
      { ...chicago, dateCreated: "2026-04-17T23:30:00-05:00" },
      { ...chicago, dateCreated: "2026-04-17T10:00:00-05:00" },
    ]);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      start: "2026-04-17",
      end: "2026-04-17",
    });
  });

  test("merges adjacent days in one city and splits on a wider gap", () => {
    const entries = groupTimeline([
      { ...chicago, dateCreated: "2026-04-16T09:00:00-05:00" },
      { ...chicago, dateCreated: "2026-04-17T09:00:00-05:00" },
      { ...chicago, dateCreated: "2026-04-20T09:00:00-05:00" },
    ]);
    expect(entries.map(({ start, end }) => [start, end])).toEqual([
      ["2026-04-20", "2026-04-20"],
      ["2026-04-16", "2026-04-17"],
    ]);
  });

  test("honours a custom gap", () => {
    const photos = [
      { ...chicago, dateCreated: "2026-04-16T09:00:00-05:00" },
      { ...chicago, dateCreated: "2026-04-19T09:00:00-05:00" },
    ];
    expect(groupTimeline(photos)).toHaveLength(2);
    expect(groupTimeline(photos, 3)).toHaveLength(1);
  });

  test("splits a travel day between cities and orders entries newest first", () => {
    const entries = groupTimeline([
      { ...chicago, dateCreated: "2026-04-16T20:00:00-05:00" },
      { ...london, dateCreated: "2026-04-16T11:00:00+01:00" },
    ]);
    expect(entries.map((entry) => entry.city)).toEqual(["Chicago", "London"]);
  });

  test("keeps same-named cities in different countries apart", () => {
    const entries = groupTimeline([
      {
        city: "London",
        countryCode: "GB",
        dateCreated: "2026-04-16T11:00:00+01:00",
      },
      {
        city: "London",
        countryCode: "CA",
        dateCreated: "2026-04-16T11:00:00-04:00",
      },
    ]);
    expect(entries).toHaveLength(2);
  });

  test("keeps photos within an entry in capture order", () => {
    const entries = groupTimeline([
      { ...chicago, dateCreated: "2026-04-17T15:15:00-05:00", location: "b" },
      { ...chicago, dateCreated: "2026-04-17T14:06:00-05:00", location: "a" },
    ]);
    expect(entries[0]!.photos.map((photo) => photo.location)).toEqual([
      "a",
      "b",
    ]);
  });

  test("lifts the sublocation only when every photo shares it", () => {
    const shared = groupTimeline([
      {
        ...london,
        dateCreated: "2026-04-16T11:00:00+01:00",
        location: "Heathrow Airport",
      },
      {
        ...london,
        dateCreated: "2026-04-16T12:00:00+01:00",
        location: "Heathrow Airport",
      },
    ]);
    expect(shared[0]!.location).toBe("Heathrow Airport");

    const mixed = groupTimeline([
      {
        ...london,
        dateCreated: "2026-04-16T11:00:00+01:00",
        location: "Heathrow Airport",
      },
      {
        ...london,
        dateCreated: "2026-04-16T12:00:00+01:00",
        location: "Kensington Gardens",
      },
    ]);
    expect(mixed[0]!.location).toBeUndefined();

    const partial = groupTimeline([
      {
        ...london,
        dateCreated: "2026-04-16T11:00:00+01:00",
        location: "Heathrow Airport",
      },
      { ...london, dateCreated: "2026-04-16T12:00:00+01:00" },
    ]);
    expect(partial[0]!.location).toBeUndefined();
  });
});
