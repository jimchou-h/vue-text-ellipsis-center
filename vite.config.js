import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import dts from 'vite-plugin-dts'

// 插件名称（UMD 全局变量用）
const name = 'vue-text-ellipsis-center'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: 'src',     // 从 src 生成声明
      outputDir: 'dist',    // 输出到 dist
      tsConfigFilePath: './tsconfig.json',
      // rollupTypes: true, // 把类型打包为一个 index.d.ts
      // insertTypesEntry: true // 在 package.json 中插入 types 字段
    })
  ],
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