/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: { domains: ["testingcf.jsdelivr.net", "thirdqq.qlogo.cn"] },
};

module.exports = nextConfig;
