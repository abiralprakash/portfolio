import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Builds the premium React demo into ../public/demo so the existing Cloudflare
// Worker serves it at /demo without any routing changes.
export default defineConfig({
  root: __dirname,
  base: '/demo/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../public/demo',
    emptyOutDir: true,
  },
});
