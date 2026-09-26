import type {
  CircleLayerSpecification,
  ExpressionSpecification,
} from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

import type { Bounds, GeoPoint, Outline, StayGeometry } from "@/photos/geo";

const STYLE = "https://tiles.openfreemap.org/styles/positron";
// How far a stay's frame may zoom in: a stay of one place still shows the
// streets around it.
const MAX_ZOOM = 12;
// Keeps the lowest marker clear of the attribution button.
const PADDING = { top: 24, right: 24, bottom: 40, left: 24 };
// Both come out much as they go in through the page's dark-mode filter,
// `invert(1) hue-rotate(180deg)`, which is not true of every shade: the
// filter flips lightness, so only shades near the middle survive it.
const CAMERA_COLOR = "#3b82f6";
const PLACE_COLOR = "#f97316";
/** Radius of a place's dot, in pixels. */
const MARKER_RADIUS = { active: 5, idle: 4 };
// The rim around each point, in pixels beyond its edge, so that touching
// points stay apart, each disc cut off from the next by a gap of rim.
const RIM_WIDTH = 1.5;
const dark = matchMedia("(prefers-color-scheme: dark)");
// White; in dark mode a grey, so that it does not glare against the dark
// basemap. The page inverts the map's colours there, so the grey is drawn
// as its inverse.
const rimColor = () => (dark.matches ? "#2e2a24" : "#ffffff");
// Fraction of the viewport height at which a stay becomes current: low
// enough that the previous stay's heading has just left the viewport.
const LINE = 0.3;

interface Stay extends StayGeometry {
  id: number;
  item: HTMLElement;
  bounds: NonNullable<StayGeometry["bounds"]>;
}

function collectStays(): Stay[] {
  const items = document.querySelectorAll<HTMLElement>("[data-stay]");
  return [...items].flatMap((item, id) => {
    const { geometry } = item.dataset;
    if (geometry === undefined) return [];
    const parsed = JSON.parse(geometry) as StayGeometry;
    return parsed.bounds
      ? [{ ...parsed, bounds: parsed.bounds, id, item }]
      : [];
  });
}

// The current stay is the last one whose top has scrolled past a line
// near the top of the viewport, so it stays current until the next one
// reaches that line, however tall or short it is. The first stay is
// current before any has reached the line, and the last one once the
// page cannot scroll any further, since a short last stay may never
// reach the line on its own.
function currentStay(stays: Stay[]): Stay | undefined {
  const { scrollHeight } = document.documentElement;
  const atEnd =
    scrollHeight > innerHeight && scrollY + innerHeight >= scrollHeight - 1;
  if (atEnd) return stays.at(-1);
  const line = innerHeight * LINE;
  let current = stays[0];
  for (const stay of stays) {
    if (stay.item.getBoundingClientRect().top <= line) current = stay;
  }
  return current;
}

const lngLat = ({ longitude, latitude }: GeoPoint): [number, number] => [
  longitude,
  latitude,
];

async function mount(
  card: HTMLElement,
  container: HTMLElement,
  caption: HTMLElement | null,
  stays: Stay[],
) {
  const { Map: MapLibreMap, setWorkerUrl } = await import("maplibre-gl");
  // The page may already be scrolled, as when it is returned to: the map
  // starts at that stay rather than flying there from the first.
  const initial = currentStay(stays);
  if (!initial) return;
  // By default the library looks for the worker next to its own module, but
  // Vite prebundles the module in dev and hashes it in build, so the sibling
  // is never there. `?worker&url` bundles the worker with the shared chunk it
  // imports into a self-contained script; plain `?url` would emit it alone.
  setWorkerUrl(workerUrl);
  const fit = { padding: PADDING, maxZoom: MAX_ZOOM };
  const map = new MapLibreMap({
    container,
    style: STYLE,
    bounds: initial.bounds,
    fitBoundsOptions: fit,
    attributionControl: { compact: true },
  });
  // The map floats over the page: a wheel over it should keep scrolling the
  // page, since that scroll is what drives the map.
  map.scrollZoom.disable();

  // The compact attribution expands itself once the sources' attribution
  // text arrives and only collapses when the map is dragged, which never
  // happens here; collapse it to its button the moment it expands.
  const attribution = container.querySelector(".maplibregl-ctrl-attrib");
  if (attribution) {
    const collapse = new MutationObserver(() => {
      if (attribution.classList.contains("maplibregl-compact-show")) {
        collapse.disconnect();
        attribution
          .querySelector<HTMLElement>(".maplibregl-ctrl-attrib-button")
          ?.click();
      }
    });
    collapse.observe(attribution, { attributeFilter: ["class"] });
  }

  await map.once("load");

  // Every point belongs to a stay and is restyled through its feature state
  // when the stay switches. The ids are assigned here and kept per stay:
  // querying the source for them instead would only find the points inside
  // the tiles loaded for the current view, never the stay being left.
  const stateKeys = new Map<Stay, { source: string; id: number }[]>();
  /** Adds a source of one feature per item, with ids in item order. */
  const addFeatures = <T>(
    source: string,
    items: (stay: Stay) => (T & {
      geometry: Outline | { type: "Point"; coordinates: [number, number] };
      photo: string;
    })[],
  ) => {
    const all = stays.flatMap((stay) =>
      items(stay).map((item) => ({ stay, item })),
    );
    all.forEach(({ stay }, id) => {
      stateKeys.set(stay, [...(stateKeys.get(stay) ?? []), { source, id }]);
    });
    map.addSource(source, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: all.map(({ stay, item: { geometry, photo } }, id) => ({
          type: "Feature" as const,
          id,
          geometry,
          properties: { stay: stay.id, photo },
        })),
      },
    });
    return all.map(({ item }) => item);
  };
  const point = (coordinates: GeoPoint) => ({
    type: "Point" as const,
    coordinates: lngLat(coordinates),
  });
  addFeatures("outlines", (stay) =>
    stay.places.flatMap(({ outline, photo }) =>
      outline ? [{ geometry: outline, photo }] : [],
    ),
  );
  addFeatures("cameras", (stay) =>
    stay.cameras.map(({ point: camera, photo }) => ({
      geometry: point(camera),
      photo,
    })),
  );
  const places = addFeatures("places", (stay) =>
    stay.places.map((place) => ({
      geometry: point(place),
      photo: place.photo,
      bounds: place.bounds,
    })),
  );

  // Whether each outlined place is drawn as its outline or as a marker
  // depends on how large the outline is on screen, so it is decided after
  // every move; a place without an outline is always a marker.
  const size = ([west, south, east, north]: Bounds) => {
    const sw = map.project([west, south]);
    const ne = map.project([east, north]);
    return Math.max(ne.x - sw.x, sw.y - ne.y);
  };
  const resize = () => {
    places.forEach(({ bounds }, id) => {
      if (!bounds) return;
      // An outline the marker would cover is shown as the marker instead.
      const marker = size(bounds) < 2 * MARKER_RADIUS.idle;
      map.setFeatureState({ source: "places", id }, { marker });
    });
  };
  map.on("moveend", resize);
  resize();

  const active: ExpressionSpecification = [
    "boolean",
    ["feature-state", "active"],
    false,
  ];
  map.addLayer({
    id: "outline-fills",
    type: "fill",
    source: "outlines",
    paint: {
      "fill-color": PLACE_COLOR,
      "fill-opacity": ["case", active, 0.2, 0.1],
    },
  });
  map.addLayer({
    id: "outline-lines",
    type: "line",
    source: "outlines",
    paint: {
      "line-color": PLACE_COLOR,
      "line-width": ["case", active, 2, 1],
      "line-opacity": ["case", active, 1, 0.4],
    },
  });
  const marker: ExpressionSpecification = [
    "boolean",
    ["feature-state", "marker"],
    true,
  ];
  /** A kind of point on the map: a coloured dot on a rim. */
  interface PointKind {
    source: string;
    color: string;
    radius: { active: number; idle: number };
    /** How strongly the dot is coloured, 0 to 1, by state. */
    strength: ExpressionSpecification;
    /** Whether the point is drawn at all. */
    shown: ExpressionSpecification;
  }
  // The dots of the other stays stay on the map, faded, for context; the
  // current stay's are left a little pale. The cameras come last, so above
  // the places: a camera standing at a place is the smaller dot on it.
  const kinds: PointKind[] = [
    {
      source: "places",
      color: PLACE_COLOR,
      radius: MARKER_RADIUS,
      strength: ["case", active, 0.75, 0.4],
      shown: marker,
    },
    {
      source: "cameras",
      color: CAMERA_COLOR,
      radius: { active: 3, idle: 2 },
      strength: ["case", active, 0.75, 0.4],
      shown: ["literal", true],
    },
  ];
  // A fainter dot is a paler one, not a translucent one: two pale dots
  // overlapping stay pale, where two translucent ones would darken each
  // other. It pales towards white, the basemap's own paper; in dark mode
  // the filter that darkens the basemap darkens that too, so the dot
  // fades into the map in either theme.
  const shade = (kind: PointKind): ExpressionSpecification => [
    "interpolate",
    ["linear"],
    kind.strength,
    0,
    "#ffffff",
    1,
    kind.color,
  ];
  const radius = (
    { radius }: PointKind,
    beyond = 0,
  ): ExpressionSpecification => [
    "case",
    active,
    radius.active + beyond,
    radius.idle + beyond,
  ];
  const disc = (
    kind: PointKind,
    id: string,
    paint: CircleLayerSpecification["paint"],
  ) => {
    map.addLayer({
      id,
      type: "circle",
      source: kind.source,
      paint: { "circle-radius": radius(kind), ...paint },
    });
  };
  // Each point's rim is a disc under the point rather than a stroke on it.
  // A stroke is drawn with its point, so where two points touch the later
  // one's stroke cuts across the earlier one's disc; with every rim under
  // every point, touching points merge into one shape with one rim. Rims
  // go under their own kind only, so a camera's rim parts it from the
  // place it stands on. The rim fades instead of paling, since it is
  // white on the basemap and has nothing to pale towards, and it fades
  // only with the stay, not with the dot's paling: translucent, it would
  // show the dot it parts from.
  const rimOpacity: ExpressionSpecification = ["case", active, 1, 0.4];
  for (const kind of kinds) {
    disc(kind, `${kind.source}-rims`, {
      "circle-radius": radius(kind, RIM_WIDTH),
      "circle-color": rimColor(),
      "circle-opacity": ["case", kind.shown, rimOpacity, 0],
    });
    disc(kind, kind.source, {
      "circle-color": shade(kind),
      "circle-opacity": ["case", kind.shown, 1, 0],
    });
  }
  const recolor = () => {
    for (const kind of kinds) {
      map.setPaintProperty(`${kind.source}-rims`, "circle-color", rimColor());
    }
  };
  dark.addEventListener("change", recolor);
  // A point stands for a photo, or for the first photo showing a place,
  // so clicking it goes to that photo; the stay heading is the caption's.
  for (const layer of ["outline-fills", ...kinds.map((kind) => kind.source)]) {
    map.on("click", layer, (event) => {
      const photo = event.features?.[0]?.properties.photo as string | undefined;
      if (photo === undefined) return;
      document
        .querySelector(`[data-photo="${CSS.escape(photo)}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    map.on("mouseenter", layer, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", layer, () => {
      map.getCanvas().style.cursor = "";
    });
  }
  const setActive = (stay: Stay, active: boolean) => {
    for (const key of stateKeys.get(stay) ?? []) {
      map.setFeatureState(key, { active });
    }
  };

  let current: Stay | undefined;
  caption?.addEventListener("click", () => {
    current?.item.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  const activate = (stay: Stay) => {
    if (stay === current) return;
    if (caption) {
      // The stay's heading already says when and where; repeat it above
      // the map, since the heading itself has scrolled away by the time
      // the map switches.
      for (const part of ["place", "date"]) {
        const target = caption.querySelector(`[data-${part}]`);
        const source = stay.item.querySelector(`[data-stay-${part}]`);
        if (target) target.textContent = source?.textContent.trim() ?? "";
      }
    }
    if (current) setActive(current, false);
    // The first stay is where the map already is. Later flights become
    // jumps under prefers-reduced-motion. The duration grows with the log
    // of the distance; at the default speed a flight between continents
    // takes many seconds, while a hop across a city is short enough that
    // speeding it up is imperceptible.
    const motion = current ? { speed: 2.5 } : { animate: false };
    current = stay;
    setActive(stay, true);
    map.fitBounds(stay.bounds, { ...fit, ...motion });
  };

  let frame: number | undefined;
  const onScroll = () => {
    frame ??= requestAnimationFrame(() => {
      frame = undefined;
      const stay = currentStay(stays);
      if (stay) activate(stay);
    });
  };
  activate(initial);
  // Revealed only now: until the tiles are in and the caption filled, the
  // card is a grey box over an empty line.
  card.classList.remove("invisible");
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  // The page may have scrolled on while the library was loading.
  onScroll();

  document.addEventListener(
    "astro:before-swap",
    () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      if (frame !== undefined) cancelAnimationFrame(frame);
      dark.removeEventListener("change", recolor);
      map.remove();
    },
    { once: true },
  );
}

document.addEventListener("astro:page-load", () => {
  const card = document.querySelector<HTMLElement>("[data-timeline-map-card]");
  const container = document.querySelector<HTMLElement>("[data-timeline-map]");
  const caption = document.querySelector<HTMLElement>(
    "[data-timeline-map-caption]",
  );
  const stays = collectStays();
  if (!card || !container || stays.length === 0) return;

  mount(card, container, caption, stays).catch((error: unknown) => {
    console.error("Failed to mount the timeline map", error);
  });
});
