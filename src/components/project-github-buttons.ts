import { render } from "github-buttons";

const r = () => {
  document.querySelectorAll("a[data-github-btn]").forEach((anchor) => {
    render(
      {
        href: anchor.getAttribute("href")!,
        "aria-label": anchor.getAttribute("aria-label")!,
        "data-color-scheme":
          "no-preference: light; light: light; dark: dark_dimmed;",
        "data-icon": "octicon-star",
        "data-size": "large",
        "data-show-count": true,
        "data-text": "Star",
      },
      (el) => anchor.parentNode?.replaceChild(el, anchor),
    );
  });
};

r();
document.addEventListener("astro:after-swap", r);
