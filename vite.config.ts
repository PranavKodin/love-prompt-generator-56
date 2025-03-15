
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import history from 'connect-history-api-fallback';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'configure-history-api-fallback',
      configureServer(server) {
        return () => {
          server.middlewares.use(
            history({
              disableDotRule: true,
              htmlAcceptHeaders: ['text/html', 'application/xhtml+xml']
            })
          );
        };
      },
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Fix alias for imports like "@/components/ui/toaster"
    },
  },
  server: {
    port: 8080,
    strictPort: true,
    host: "0.0.0.0",
  },
});
