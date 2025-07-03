import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Optimize memory usage
  build: {
    // Chunk size optimization
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-icons', '@radix-ui/react-slot'],
        },
      },
    },
  },
  // Dev server optimization
  server: {
    // Disable server-side rendering for better memory usage
    middlewareMode: false,
    fs: {
      strict: true,
    },
    // Optimize memory usage
    hmr: {
      overlay: false,
    },
  },
});