// @ts-check

/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
        hostname: "blog.smallfang.fun",
        port: "",
        pathname: "/image/**",
      },
    ],
  },
};

module.exports = nextConfig;
