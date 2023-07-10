/** @type {string[]} */
const skills = require("./skills.json");

/** @param theme {"light" | "dark"} */
const skillIcons = (theme) =>
  `https://skillicons.dev/icons?i=${skills.join(",")}&theme=${theme}&perline=6`;

/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
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
        hostname: "blog.smallfang.fun",
        port: "",
        pathname: "/image/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/skills/light",
        destination: skillIcons("light"),
      },
      {
        source: "/skills/dark",
        destination: skillIcons("dark"),
      },
    ];
  },
};

module.exports = nextConfig;