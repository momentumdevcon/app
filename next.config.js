/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sessionize.com",
      },
    ],
  },
};

module.exports = nextConfig;
