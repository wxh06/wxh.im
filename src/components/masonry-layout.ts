const r = () =>
  import("masonry-layout")
    .then(({ default: Masonry }) => {
      document
        .querySelectorAll("[data-masonry]")
        .forEach((e) => new Masonry(e));
    })
    .catch(console.error); // eslint-disable-line no-console

r();
document.addEventListener("astro:after-swap", r);
