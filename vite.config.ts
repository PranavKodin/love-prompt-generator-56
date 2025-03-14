import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Fix alias for imports like "@/components/ui/toaster"
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    host: "0.0.0.0",
  },
});
