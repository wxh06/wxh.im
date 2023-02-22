/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { dirs: ["."] },
  experimental: { appDir: true },
  images: { domains: ["raw.githubusercontent.com", "thirdqq.qlogo.cn"] },
};

module.exports = nextConfig;
