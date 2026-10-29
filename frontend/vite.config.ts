/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

declare const process: { env: Record<string, string | undefined> }; // Node global, avoids pulling in @types/node

// In production the FastAPI backend serves the built files under /static/,
// so assets are emitted with that base path. In dev, Vite proxies /api to FastAPI.
export default defineConfig(({ command }) => ({
  // On Vercel the built files are the site root; elsewhere FastAPI serves them under /static/
  base: command === 'build' && !process.env.VERCEL ? '/static/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:5000' },
  },
  build: { outDir: 'dist', sourcemap: true },
  test: { environment: 'node' },
}));
