import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Build configuration for embeddable widget
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/embed.jsx'),
      name: 'FabCityWidget',
      formats: ['iife'],
      fileName: () => 'fabcity-widget.js'
    },
    rollupOptions: {
      output: {
        assetFileNames: 'fabcity-widget.css',
        // Inline all dependencies to create a single file
        inlineDynamicImports: true,
      }
    },
    outDir: 'dist-embed',
    emptyOutDir: true,
    // Minify for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs for debugging
      }
    }
  },
  // ✅ ADD THIS: Define process.env for browser compatibility
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': JSON.stringify({}),
    'global': 'globalThis'
  }
})