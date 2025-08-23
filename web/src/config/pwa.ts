export const runtimeCaching = [
  {
    urlPattern: ({ request }: any) => request.destination === "image",
    handler: "CacheFirst",
    options: {
      cacheName: "images",
      expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
    },
  },
  {
    urlPattern: ({ request }: any) => request.destination === "style" || request.destination === "script",
    handler: "StaleWhileRevalidate",
    options: { cacheName: "static-resources" },
  },
  {
    urlPattern: ({ url }: any) => url.pathname.startsWith("/") && !url.pathname.startsWith("/_next"),
    handler: "NetworkFirst",
    options: {
      cacheName: "pages",
      networkTimeoutSeconds: 3,
    },
  },
];


