import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/vue-text-ellipsis-center/',
  plugins: [vue()],
  server: {
    port: 3000
  }
})