import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import history from "connect-history-api-fallback";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    middlewareMode: false, // Ensure Vite runs normally
    fs: {
      allow: ["."], // Fixes possible file access errors
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: "history-fallback",
      configureServer(server) {
        server.middlewares.use(
          history({
            index: "/index.html", // ✅ Ensures React Router handles routing
          })
        );
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  define: {
    "process.env": {}, // Fixes libraries that expect `process.env`
  },
}));
