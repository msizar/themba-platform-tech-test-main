import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });
const { BACKEND_PORT, FRONTEND_PORT } = globalThis.process.env;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: FRONTEND_PORT,
    proxy: {
      '/api': `http://localhost:${BACKEND_PORT}`,
    },
  },
});
