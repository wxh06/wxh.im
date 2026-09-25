export interface TimelinePhoto {
  /** Capture time as an ISO 8601 string carrying the local UTC offset. */
  dateCreated: string;
  city: string;
  countryCode: string;
  location?: string | undefined;
}

export interface TimelineEntry<P extends TimelinePhoto> {
  /** First and last local calendar day covered, as `YYYY-MM-DD`. */
  start: string;
  end: string;
  city: string;
  countryCode: string;
  /** The sublocation, present only when every photo shares one. */
  location?: string;
  /** In capture order. */
  photos: P[];
}

// The string is the wall clock at the place of capture, so its date part is
// the local calendar day without any time zone conversion.
const localDate = (photo: TimelinePhoto) => photo.dateCreated.slice(0, 10);

// Date-only ISO strings parse as UTC midnight, so the difference is whole days.
const daysBetween = (from: string, to: string) =>
  (Date.parse(to) - Date.parse(from)) / 86_400_000;

/**
 * Splits photos into stays: runs of photos in one city whose local days are
 * at most `maxGapDays` apart. Entries are returned newest first.
 */
export function groupTimeline<P extends TimelinePhoto>(
  photos: readonly P[],
  maxGapDays = 1,
): TimelineEntry<P>[] {
  const entries: TimelineEntry<P>[] = [];
  const sorted = photos.toSorted(
    (a, b) => Date.parse(a.dateCreated) - Date.parse(b.dateCreated),
  );

  for (const photo of sorted) {
    const day = localDate(photo);
    const current = entries.at(-1);
    const continues =
      current?.city === photo.city &&
      current.countryCode === photo.countryCode &&
      daysBetween(current.end, day) <= maxGapDays;
    if (continues) {
      current.end = day;
      current.photos.push(photo);
    } else {
      entries.push({
        start: day,
        end: day,
        city: photo.city,
        countryCode: photo.countryCode,
        photos: [photo],
      });
    }
  }

  for (const entry of entries) {
    const locations = new Set(entry.photos.map((photo) => photo.location));
    const [location] = locations;
    if (locations.size === 1 && location !== undefined) {
      entry.location = location;
    }
  }

  return entries.reverse();
}
