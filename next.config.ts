import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Placeholder stock photography; remove once brand assets live in /public.
      { protocol: "https", hostname: "images.unsplash.com" },
      // Leaflet default marker sprites.
      { protocol: "https", hostname: "unpkg.com" },
    ],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [64, 96, 128, 160, 240, 320, 400, 480],
  },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
