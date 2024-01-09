import Masonry from "masonry-layout";

document.addEventListener("astro:after-swap", () => {
  const e = document.querySelector("[data-masonry]");
  if (e) new Masonry(e); // eslint-disable-line no-new
});
