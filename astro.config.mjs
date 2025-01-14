import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  trailingSlash: "never",
  integrations: [mdx(), tailwind(), icon()],
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "skillicons.dev",
        port: "",
        pathname: "/icons",
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
        hostname: "file.rotriw.com",
        port: "",
      },
    ],
  },
});
