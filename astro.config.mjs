// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  trailingSlash: "never",
  integrations: [mdx(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    dangerouslyProcessSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.jsdelivr.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "*.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "thirdqq.qlogo.cn",
        port: "",
        pathname: "/g",
      },
      {
        protocol: "https",
        hostname: "cdn.luogu.com.cn",
        port: "",
        pathname: "/upload/**",
      },
      {
        protocol: "https",
        hostname: "cdn.rotriw.cn",
        port: "",
      },
      {
        protocol: "https",
        hostname: "msuhrooom.com",
        port: "",
        pathname: "/assets/**",
      },
    ],
  },
});
