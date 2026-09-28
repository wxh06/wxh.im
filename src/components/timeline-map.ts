import type {
  CircleLayerSpecification,
  ExpressionSpecification,
  FilterSpecification,
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
  interface StateKey {
    source: string;
    id: number;
  }
  const stateKeys = new Map<Stay, StateKey[]>();
  // What a photo on the page corresponds to: its own camera position, and
  // the place it shows, which it shares with the other photos of that place.
  const hoverKeys = new Map<string, StateKey[]>();
  const photoKey = (photo: string) => `photo:${photo}`;
  const placeKey = (stay: Stay, place: string) =>
    `place:${String(stay.id)}/${place}`;
  /** Adds a source of one feature per item, with ids in item order. */
  const addFeatures = <T>(
    source: string,
    items: (stay: Stay) => (T & {
      geometry: Outline | { type: "Point"; coordinates: [number, number] };
      photo: string;
      /** The place this feature belongs to; without it, only the photo. */
      place?: string;
      properties?: Record<string, unknown>;
    })[],
  ) => {
    const all = stays.flatMap((stay) =>
      items(stay).map((item) => ({ stay, item })),
    );
    all.forEach(({ stay, item }, id) => {
      const key = { source, id };
      stateKeys.set(stay, [...(stateKeys.get(stay) ?? []), key]);
      const hover =
        item.place === undefined
          ? photoKey(item.photo)
          : placeKey(stay, item.place);
      hoverKeys.set(hover, [...(hoverKeys.get(hover) ?? []), key]);
    });
    map.addSource(source, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: all.map(
          ({ stay, item: { geometry, photo, properties } }, id) => ({
            type: "Feature" as const,
            id,
            geometry,
            properties: { ...properties, stay: stay.id, photo },
          }),
        ),
      },
    });
    return all.map(({ item }) => item);
  };
  const point = (coordinates: GeoPoint) => ({
    type: "Point" as const,
    coordinates: lngLat(coordinates),
  });
  addFeatures("outlines", (stay) =>
    stay.places.flatMap(({ outline, photo, name }) =>
      outline
        ? [{ geometry: outline, photo, place: name, properties: { name } }]
        : [],
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
      place: place.name,
      properties: { name: place.name },
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
  const hover: ExpressionSpecification = [
    "boolean",
    ["feature-state", "hover"],
    false,
  ];
  const marker: ExpressionSpecification = [
    "boolean",
    ["feature-state", "marker"],
    true,
  ];
  // Opacity by state: hovered, in the current stay, or in another stay.
  // While anything is hovered, everything else fades further, so that the
  // hovered point stands out among the neighbours a city centre packs in.
  const DIM = 0.3;
  const tiers = (
    focused: boolean,
    hovered: number,
    active_: number,
    idle: number,
  ): ExpressionSpecification => {
    const dim = focused ? DIM : 1;
    return [
      "case",
      hover,
      hovered,
      ["case", active, active_ * dim, idle * dim],
    ];
  };
  const outlineOpacity = (focused: boolean) => ({
    fill: tiers(focused, 0.3, 0.2, 0.1),
    line: tiers(focused, 1, 1, 0.4),
  });
  map.addLayer({
    id: "outline-fills",
    type: "fill",
    source: "outlines",
    paint: {
      "fill-color": PLACE_COLOR,
      "fill-opacity": outlineOpacity(false).fill,
    },
  });
  map.addLayer({
    id: "outline-lines",
    type: "line",
    source: "outlines",
    paint: {
      "line-color": PLACE_COLOR,
      "line-width": ["case", hover, 3, ["case", active, 2, 1]],
      "line-opacity": outlineOpacity(false).line,
    },
  });
  /** A kind of point on the map: a coloured dot on a rim. */
  interface PointKind {
    source: string;
    color: string;
    radius: { active: number; idle: number };
    /**
     * How strongly the dot is coloured, 0 to 1, by state; `focused` while
     * anything on the map is hovered.
     */
    strength: (focused: boolean) => ExpressionSpecification;
    /** Whether the point is drawn at all. */
    shown: ExpressionSpecification;
  }
  // The dots of the other stays stay on the map, faded, for context; the
  // current stay's are left a little pale, so that a hovered one, drawn in
  // full colour, stands out. The cameras come last, so above the places: a
  // camera standing at a place is the smaller dot on it.
  const kinds: PointKind[] = [
    {
      source: "places",
      color: PLACE_COLOR,
      radius: MARKER_RADIUS,
      strength: (focused) => tiers(focused, 1, 0.75, 0.4),
      shown: marker,
    },
    {
      source: "cameras",
      color: CAMERA_COLOR,
      radius: { active: 3, idle: 2 },
      strength: (focused) => tiers(focused, 1, 0.75, 0.4),
      shown: ["literal", true],
    },
  ];
  // A fainter dot is a paler one, not a translucent one: two pale dots
  // overlapping stay pale, where two translucent ones would darken each
  // other. It pales towards white, the basemap's own paper; in dark mode
  // the filter that darkens the basemap darkens that too, so the dot
  // fades into the map in either theme.
  let focused = false;
  const shade = (kind: PointKind): ExpressionSpecification => [
    "interpolate",
    ["linear"],
    kind.strength(focused),
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
  type Shown = (kind: PointKind) => ExpressionSpecification;
  const rimOpacity = (
    kind: PointKind,
    shown: Shown,
  ): ExpressionSpecification => [
    "case",
    shown(kind),
    tiers(focused, 1, 1, 0.4),
    0,
  ];
  const drawn: { suffix: string; shown: Shown }[] = [];
  /** Draws every kind, rims under dots, in layers named with the suffix. */
  const draw = (suffix: string, shown: Shown) => {
    drawn.push({ suffix, shown });
    for (const kind of kinds) {
      disc(kind, `${kind.source}${suffix}-rims`, {
        "circle-radius": radius(kind, RIM_WIDTH),
        "circle-color": rimColor(),
        "circle-opacity": rimOpacity(kind, shown),
      });
      disc(kind, `${kind.source}${suffix}`, {
        "circle-color": shade(kind),
        "circle-opacity": ["case", shown(kind), 1, 0],
      });
    }
  };
  // A hovered point moves to layers above every other point, leaving its
  // place in the base layers empty: the draw order within a layer is
  // fixed, so in place it would stay under whichever neighbour happens to
  // be drawn later.
  draw("", (kind) => ["all", ["!", hover], kind.shown]);
  draw("-hovered", (kind) => ["all", hover, kind.shown]);
  // The colours depend on the theme and on whether anything is hovered.
  const repaint = () => {
    for (const { suffix, shown } of drawn) {
      for (const kind of kinds) {
        const id = `${kind.source}${suffix}`;
        map.setPaintProperty(`${id}-rims`, "circle-color", rimColor());
        map.setPaintProperty(
          `${id}-rims`,
          "circle-opacity",
          rimOpacity(kind, shown),
        );
        map.setPaintProperty(id, "circle-color", shade(kind));
      }
    }
  };
  dark.addEventListener("change", repaint);
  // A place is named only while hovered: a label for every place would
  // need room the map does not have, and the photos name the places anyway.
  // The label is filtered in rather than faded in so that it exists only
  // while shown: symbol placement runs from the top layer down and ignores
  // opacity, so an ever-present label would either claim its room while
  // invisible or, told to ignore placement, be drawn across the basemap's
  // own labels when it did show.
  const labelled = (ids: number[]): FilterSpecification => [
    "in",
    ["id"],
    ["literal", ids],
  ];
  map.addLayer({
    id: "place-labels",
    type: "symbol",
    source: "places",
    filter: labelled([]),
    layout: {
      "text-field": ["get", "name"],
      "text-font": ["Noto Sans Regular"],
      "text-size": 12,
      "text-anchor": "bottom",
      "text-offset": [0, -0.8],
      // Never dropped itself: whatever it collides with yields to it.
      "text-allow-overlap": true,
    },
    paint: {
      "text-color": "#111827",
      "text-halo-color": "#ffffff",
      "text-halo-width": 1,
    },
  });

  // A point stands for a photo, or for the first photo showing a place,
  // so clicking it goes to that photo; the stay heading is the caption's.
  const pointLayers = ["outline-fills", ...kinds.map((kind) => kind.source)];
  for (const layer of pointLayers) {
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

  // Hovering a photo lights up its points on the map, and hovering a point
  // lights up its photos on the page: the one taken there, or every one
  // showing the place. Either way the same photos and the same points are
  // lit, so a point on the map is resolved to its photos first.
  const stayOf = (element: Element) =>
    stays.find((stay) => stay.item === element.closest("[data-stay]"));
  const keysOf = (item: HTMLElement) => {
    const { photo, place } = item.dataset;
    const stay = stayOf(item);
    return [
      ...(photo === undefined ? [] : (hoverKeys.get(photoKey(photo)) ?? [])),
      ...(place === undefined || !stay
        ? []
        : (hoverKeys.get(placeKey(stay, place)) ?? [])),
    ];
  };
  // The blue of the camera dots, so that the frame reads as the same mark.
  const HIGHLIGHT = ["outline-2", "outline-offset-2", "outline-blue-500"];
  let hovered: StateKey[] = [];
  let highlighted: Element[] = [];
  const hoverPhotos = (items: HTMLElement[]) => {
    for (const key of hovered) map.setFeatureState(key, { hover: false });
    hovered = items.flatMap(keysOf);
    for (const key of hovered) map.setFeatureState(key, { hover: true });
    if (focused !== hovered.length > 0) {
      focused = !focused;
      const outline = outlineOpacity(focused);
      map.setPaintProperty("outline-fills", "fill-opacity", outline.fill);
      map.setPaintProperty("outline-lines", "line-opacity", outline.line);
      repaint();
    }
    map.setFilter(
      "place-labels",
      labelled(
        hovered.filter((key) => key.source === "places").map((key) => key.id),
      ),
    );
    for (const image of highlighted) image.classList.remove(...HIGHLIGHT);
    highlighted = items.flatMap((item) => item.querySelector("img") ?? []);
    for (const image of highlighted) image.classList.add(...HIGHLIGHT);
  };

  const onPhotoOver = (event: Event) => {
    const item = (event.target as Element).closest<HTMLElement>("[data-photo]");
    if (item) hoverPhotos([item]);
  };
  const onPhotoOut = (event: Event) => {
    if ((event.target as Element).closest("[data-photo]")) hoverPhotos([]);
  };
  document.addEventListener("mouseover", onPhotoOver);
  document.addEventListener("mouseout", onPhotoOut);

  for (const layer of pointLayers) {
    map.on("mousemove", layer, (event) => {
      const feature = event.features?.[0];
      if (!feature) return;
      const {
        photo,
        name,
        stay: stayId,
      } = feature.properties as {
        photo: string;
        name?: string;
        stay: number;
      };
      const stay = stays.find(({ id }) => id === stayId);
      const selector =
        name === undefined || !stay
          ? `[data-photo="${CSS.escape(photo)}"]`
          : `[data-place="${CSS.escape(name)}"]`;
      hoverPhotos([
        ...(stay?.item ?? document).querySelectorAll<HTMLElement>(selector),
      ]);
    });
    map.on("mouseleave", layer, () => {
      hoverPhotos([]);
    });
  }

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
      document.removeEventListener("mouseover", onPhotoOver);
      document.removeEventListener("mouseout", onPhotoOut);
      if (frame !== undefined) cancelAnimationFrame(frame);
      dark.removeEventListener("change", repaint);
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
