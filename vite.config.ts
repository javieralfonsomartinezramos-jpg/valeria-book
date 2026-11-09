import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
    cssCodeSplit: false,
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api'],
      },
      transformer: 'lightningcss',
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});
