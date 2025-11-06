/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'], // global setup (jest-dom, mocks)
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    css: true, // allow importing css/scss in tests
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: 'coverage',
    },
  },
});
