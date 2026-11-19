import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { vue2 } from './vite/vue2.ts';

export default defineConfig({
  appType: 'spa',
  plugins: [
    tailwindcss(),
    react(),
    vue2(),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('x-'),
        },
      },
    }),
    svelte(),
  ],
  resolve: {
    alias: [
      { find: '@island/bus', replacement: '/src/core/bus.ts' },
      { find: '@', replacement: '/src' },
    ],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
