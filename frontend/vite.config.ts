/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// In production the Flask backend serves the built files under /static/,
// so assets are emitted with that base path. In dev, Vite proxies /api to Flask.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/static/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:5000' },
  },
  build: { outDir: 'dist', sourcemap: true },
  test: { environment: 'node' },
}));
