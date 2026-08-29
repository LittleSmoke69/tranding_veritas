import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ['echarts/core', 'echarts/charts', 'echarts/components', 'echarts/renderers'],
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:4010',
      '/trades': 'http://localhost:4010',
      '/market': 'http://localhost:4010',
      '/robots': 'http://localhost:4010',
      '/api': 'http://localhost:4010',
      '/health': 'http://localhost:4010',
    },
  },
});
