
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import history from 'connect-history-api-fallback';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'configure-server',
      configureServer(server) {
        // Use connect-history-api-fallback properly
        return () => {
          server.middlewares.use(
            history({
              disableDotRule: true,
              verbose: true
            })
          );
        };
      },
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
