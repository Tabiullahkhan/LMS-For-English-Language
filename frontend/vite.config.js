import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    host: true, // makes the dev server reachable from other devices on the same network, like your phone
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // installed apps auto-update in the background, no manual re-install needed
      manifest: {
        name: "Tabi Khan English Academy",
        short_name: "TK English",
        description: "Grammar, speaking, and writing courses",
        start_url: "/",
        display: "standalone", // opens full-screen like a native app, no browser address bar
        background_color: "#ffffff",
        theme_color: "#2563eb",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      // Basic offline caching for the app shell (JS/CSS/HTML) so it loads fast even on
      // a weak connection - video content still needs internet, this doesn't cache that.
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
});
