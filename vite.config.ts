import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path';
import minimist from 'minimist';

const { f } = minimist(process.argv.slice(2));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
      emptyOutDir: false,
      lib: {
          formats: f === 'iife' ? ['iife'] : ['es', 'umd'],
          entry: resolve(__dirname, 'src', 'entry.ts'),
          name: 'TravelDatePicker',
          fileName: 'travel-datepicker',
      },
      rollupOptions: {
          external: f === 'iife' ? ['vue'] : ['vue', 'date-fns'],
          output: {
              globals: {
                  vue: 'Vue',
                  'date-fns': 'dateFns',
              },
          },
      },
  },
})
