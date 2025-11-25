import type { NextConfig } from "next";
import withPWAInit from "next-pwa";
import runtimeCaching from "next-pwa/cache.js";

// Initialize plugin
const withPWA = withPWAInit({
  dest: "public",
  webpack: true,
  disable: process.env.NODE_ENV === "development",

  // Custom caching JUST for your school page + APIs
  runtimeCaching: [
    {
      urlPattern: /^\/school$/,
      handler: "NetworkFirst",
      options: {
        cacheName: "school-page",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /^\/api\/school/,
      handler: "NetworkFirst",
      options: {
        cacheName: "school-api",
        expiration: {
          maxEntries: 20,
        },
      },
    },
    ...runtimeCaching, // keep default caching for other assets
  ],
});

const nextConfig: NextConfig = {
  turbopack: {},
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rickandmortyapi.com",
        pathname: "/api/character/avatar/**",
      },
    ],
  },
};

export default withPWA(nextConfig);
