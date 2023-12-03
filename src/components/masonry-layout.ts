import Masonry from "masonry-layout";

document.addEventListener(
  "astro:after-swap",
  () => new Masonry("[data-masonry]"),
);
