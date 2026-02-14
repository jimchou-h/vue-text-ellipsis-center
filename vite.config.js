import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// 插件名称（UMD 全局变量用）
const name = 'vue-text-ellipsis-center'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom', // ✅ 关键配置
    globals: true,
  },
  optimizeDeps: {
    exclude: ['vue-demi']
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name,
      fileName: (format) => `vue-text-ellipsis-center.${format}.js`,
      formats: ['es', 'umd'],
    },
    outDir: './dist', // 打包输出目录
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          'vue': 'Vue',
        },
      },
    },
  },
})