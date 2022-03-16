import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue(),vueJsx() ],
  build: {
    outDir: './dist',
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      formats:['es'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['vue']
    }
  }
});
