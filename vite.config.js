import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import dts from 'vite-plugin-dts'

// 插件名称（UMD 全局变量用）
const name = 'vue-text-ellipsis-center'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts({
      entryRoot: 'src',
      entry: 'src',      // 指定入口声明文件（关键）
      outDir: 'src/dist',             // 输出位置，字段叫 outDir
      tsConfigFilePath: './tsconfig.json',
      rollupTypes: true,          // 聚合声明
      insertTypesEntry: true,     // 在 package.json 写入 types 字段
      skipDiagnostics: true,      // 跳过全量类型检查，加速构建
      copyDtsFiles: true,         // 同时拷贝单个 d.ts 文件
    })
  ],
  test: {
    environment: 'jsdom', // ✅ 关键配置
    globals: true,
    exclude: ['**/node_modules/**', '**/dist/**', '**/compat-pages.spec.ts'],
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
    outDir: './src/dist', // 打包输出目录
    rollupOptions: {
      external: ['vue-demi'],
      output: {
        exports: 'named',
        globals: {
          'vue-demi': 'VueDemi',
        },
      },
    },
  },
})