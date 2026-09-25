import type { ExpressionSpecification } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

const STYLE = "https://tiles.openfreemap.org/styles/positron";
const CITY_ZOOM = 10;
// Fraction of the viewport height at which a stay becomes current: low
// enough that the previous stay's heading has just left the viewport.
const LINE = 0.3;

interface Stay {
  id: number;
  item: HTMLElement;
  center: [number, number];
}

function collectStays(): Stay[] {
  const items = document.querySelectorAll<HTMLElement>("[data-stay]");
  return [...items].flatMap((item, id) => {
    const { lng, lat } = item.dataset;
    return lng !== undefined && lat !== undefined
      ? [{ id, item, center: [Number(lng), Number(lat)] as [number, number] }]
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

async function mount(
  card: HTMLElement,
  container: HTMLElement,
  caption: HTMLElement | null,
  stays: Stay[],
) {
  const { Map, setWorkerUrl } = await import("maplibre-gl");
  // The page may already be scrolled, as when it is returned to: the map
  // starts at that stay rather than flying there from the first.
  const initial = currentStay(stays);
  if (!initial) return;
  // By default the library looks for the worker next to its own module, but
  // Vite prebundles the module in dev and hashes it in build, so the sibling
  // is never there. `?worker&url` bundles the worker with the shared chunk it
  // imports into a self-contained script; plain `?url` would emit it alone.
  setWorkerUrl(workerUrl);
  const map = new Map({
    container,
    style: STYLE,
    center: initial.center,
    zoom: CITY_ZOOM,
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

  map.addSource("stays", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: stays.map(({ id, center }) => ({
        type: "Feature",
        id,
        geometry: { type: "Point", coordinates: center },
        properties: {},
      })),
    },
  });
  const active: ExpressionSpecification = [
    "boolean",
    ["feature-state", "active"],
    false,
  ];
  map.addLayer({
    id: "stays",
    type: "circle",
    source: "stays",
    paint: {
      "circle-radius": ["case", active, 8, 5],
      "circle-color": "#2563eb",
      "circle-opacity": ["case", active, 1, 0.4],
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 2,
    },
  });

  const scrollTo = (stay: Stay | undefined) => {
    stay?.item.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  map.on("click", "stays", (event) => {
    const id = event.features?.[0]?.id;
    scrollTo(stays.find((stay) => stay.id === id));
  });
  map.on("mouseenter", "stays", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "stays", () => {
    map.getCanvas().style.cursor = "";
  });

  let current: Stay | undefined;
  caption?.addEventListener("click", () => {
    scrollTo(current);
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
    if (current) {
      map.setFeatureState(
        { source: "stays", id: current.id },
        { active: false },
      );
    }
    // The first stay is where the map already is. Later flights become
    // jumps under prefers-reduced-motion. The duration grows with the log
    // of the distance; at the default speed a flight between continents
    // takes many seconds, while a hop across a city is short enough that
    // speeding it up is imperceptible.
    const motion = current ? { speed: 2.5 } : { animate: false };
    current = stay;
    map.setFeatureState({ source: "stays", id: stay.id }, { active: true });
    map.flyTo({ center: stay.center, zoom: CITY_ZOOM, ...motion });
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
