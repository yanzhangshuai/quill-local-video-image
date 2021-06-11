import path from 'path';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const resolve = function (dir) {
	return path.join(__dirname, dir);
};


export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve('src')
    }
  }
})
