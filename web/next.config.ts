import type { NextConfig } from "next";
import withPWA from "next-pwa";
import { runtimeCaching } from "./src/config/pwa";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-toast",
    ],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const withPWAPlugin = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching,
  buildExcludes: [/middleware-manifest\.json$/],
});

export default withPWAPlugin(nextConfig);
