# Vue Text Ellipsis Center

[![npm version](https://img.shields.io/npm/v/vue-text-ellipsis-center.svg)](https://www.npmjs.com/package/vue-text-ellipsis-center)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 2/3](https://img.shields.io/badge/Vue-2.x%20%7C%203.x-brightgreen.svg)](https://vuejs.org/)

一个简单易用的 Vue 2 / Vue 3 文本省略组件，让你的长文本在任何容器中都能稳定显示。

🌐 **[在线演示](https://jimchou-h.github.io/vue-text-ellipsis-center/)**

## ✨ 它能做什么？

当你的文本太长，容器装不下时，这个组件会自动帮你：

- ✅ 在开头、中间或结尾添加省略号
- ✅ 支持单行或多行文本
- ✅ 自定义展开/收起按钮（插槽）
- ✅ 滚动到可见区域时才计算（`useObserver`）
- ✅ 容器大小变化时自动重新计算
- ✅ `v-show` 隐藏时延后测量，显示后自动恢复

## 🚀 快速上手

### 支持矩阵

| Vue 版本 | 支持状态 | 说明 |
|----------|----------|------|
| Vue 2.6 | 支持 | 需要同时安装 `@vue/composition-api` |
| Vue 2.7 | 支持 | 使用 Vue 2.7 内置 Composition API |
| Vue 3 | 支持 | 推荐 Vue 3.2+ |

### 安装

```bash
npm install vue-text-ellipsis-center
# 或
yarn add vue-text-ellipsis-center
# 或
pnpm add vue-text-ellipsis-center
```

Vue 2.6 需要额外安装：

```bash
pnpm add @vue/composition-api
```

## 📦 注册与引入

### Vue 3：全局注册

```js
import { createApp } from 'vue'
import TextEllipsisCenter from 'vue-text-ellipsis-center'

const app = createApp(App)
app.use(TextEllipsisCenter)
app.mount('#app')
```

注册后可使用 `<TextEllipsisCenter>` 或 `<text-ellipsis-center>`。

### Vue 3：按需引入

```vue
<script setup>
import { TextEllipsisCenter } from 'vue-text-ellipsis-center'
</script>

<template>
  <TextEllipsisCenter text="这是一段很长的文本..." />
</template>
```

### Vue 2.6：全局注册

```js
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import TextEllipsisCenter from 'vue-text-ellipsis-center'

Vue.use(VueCompositionAPI)
Vue.use(TextEllipsisCenter)
```

### Vue 2.7：全局注册

```js
import Vue from 'vue'
import TextEllipsisCenter from 'vue-text-ellipsis-center'

Vue.use(TextEllipsisCenter)
```

### Vue 2：局部注册

```js
import TextEllipsisCenter from 'vue-text-ellipsis-center'

export default {
  components: { TextEllipsisCenter },
}
```

## 🔧 API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `text` | `string` | 必填 | 要显示的文本内容 |
| `rows` | `number` | `1` | 显示行数 |
| `direction` | `'start' \| 'middle' \| 'end'` | `'middle'` | 省略号位置 |
| `expanded` | `boolean` | `false` | 是否展开显示完整内容 |
| `useObserver` | `boolean` | `false` | 是否在进入视口后再计算省略 |

### Slots

| 插槽 | 说明 |
|------|------|
| `expandNode` | 省略态下显示的展开控件（如按钮）。**只负责 UI，不会自动切换 `expanded`** |
| `collapseNode` | 展开态下显示的收起控件。通常与 `expandNode` 成对使用 |

### 展开状态绑定

| Vue 版本 | 推荐写法 |
|----------|----------|
| Vue 3 | `v-model:expanded="isExpanded"` |
| Vue 2.7+ | `:expanded.sync="isExpanded"` |
| Vue 2.6 | `:expanded="isExpanded"` + 手动 `@click` 更新 |

`expandNode` / `collapseNode` 不会自动改 `expanded`，你需要在按钮上绑定点击逻辑（或使用 `v-model:expanded` / `.sync` 配合父级状态）。

## 💡 使用示例

### 1. 基础单行省略

容器需有明确宽度（或受父级布局约束），组件才会正确计算省略。

```vue
<template>
  <div style="width: 200px;">
    <TextEllipsisCenter
      text="这是一个非常长的文本内容，需要被省略显示"
    />
  </div>
</template>
```

### 2. 省略位置：start / middle / end

```vue
<!-- 开头省略 -->
<TextEllipsisCenter
  text="这是一段需要在开头省略的超长文本..."
  direction="start"
/>

<!-- 中间省略（默认） -->
<TextEllipsisCenter
  text="这是一段需要在中间省略的超长文本..."
  direction="middle"
/>

<!-- 结尾省略 -->
<TextEllipsisCenter
  text="这是一段需要在结尾省略的超长文本..."
  direction="end"
/>
```

### 3. 多行省略

```vue
<TextEllipsisCenter
  text="这个文本很长，需要在两行内显示并自动省略多余部分"
  :rows="2"
  direction="middle"
/>
```

### 4. 可展开 / 收起

Vue 3：

```vue
<template>
  <div style="width: 220px;">
    <TextEllipsisCenter
      v-model:expanded="isExpanded"
      direction="end"
      text="点击按钮可以查看完整的长文本内容..."
    >
      <template #expandNode>
        <button type="button" @click="isExpanded = true">展开</button>
      </template>
      <template #collapseNode>
        <button type="button" @click="isExpanded = false">收起</button>
      </template>
    </TextEllipsisCenter>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isExpanded = ref(false)
</script>
```

Vue 2：

```html
<div style="width: 220px;">
  <text-ellipsis-center
    :expanded.sync="isExpanded"
    direction="end"
    text="点击按钮可以查看完整的长文本内容..."
  >
    <button slot="expandNode" type="button" @click="isExpanded = true">展开</button>
    <button slot="collapseNode" type="button" @click="isExpanded = false">收起</button>
  </text-ellipsis-center>
</div>
```

> 未提供 `expandNode` 时，组件只显示省略结果，不会出现展开按钮。

### 5. 懒加载（`useObserver`）

适合长列表、Tab、折叠面板等「初始不可见」的场景。

```vue
<TextEllipsisCenter
  text="这个文本只有在滚动到可见区域时才会计算省略"
  use-observer
/>
```

列表批量使用：

```vue
<div v-for="item in items" :key="item.id" class="list-item">
  <TextEllipsisCenter :text="item.text" use-observer />
</div>
```

### 6. 容器宽度变化（自适应）

组件会监听容器尺寸变化并重新计算，无需额外配置。

```vue
<template>
  <div :style="{ width: containerWidth + 'px' }">
    <TextEllipsisCenter
      :text="text"
      :rows="2"
      direction="middle"
    />
  </div>
  <input v-model.number="containerWidth" type="range" min="120" max="520" />
</template>

<script setup>
import { ref } from 'vue'

const containerWidth = ref(220)
const text = ref('当容器宽度变化时，省略效果会自动调整以适应新的容器尺寸')
</script>
```

### 7. 动态更新文本

`text` 变化后组件会自动重新测量并更新省略结果。

```vue
<TextEllipsisCenter :text="dynamicText" />

<button @click="dynamicText = '更新后的超长文本内容...'">换一段文字</button>
```

若同时开启 `useObserver`，文本在不可见时更新会延后到进入视口后再计算。

### 8. `v-show` / Tab 隐藏场景

默认模式下，组件在 `display: none`（如 `v-show="false"`）时会**延后测量**，显示后自动恢复计算。

Tab、抽屉等场景建议：

```vue
<TextEllipsisCenter
  v-show="activeTab === 'detail'"
  :text="detailText"
  use-observer
/>
```

或配合 `v-if` 在显示时再挂载。

### 9. TypeScript

```ts
import TextEllipsisCenter, { TextEllipsisCenter as NamedExport } from 'vue-text-ellipsis-center'
```

Vue 3 `script setup` 直接按上面「按需引入」示例使用即可。

## 🧪 本地示例与兼容页

仓库内提供 Vue 2.6 / 2.7 / 3 最小 HTML 示例（需先 `pnpm build` 生成 vendor 资源）：

```bash
npx serve examples/compat
```

基础演示：

- `http://localhost:3000/vue2.6.html`
- `http://localhost:3000/vue2.7.html`
- `http://localhost:3000/vue3.html`

功能矩阵（覆盖方向、多行、展开收起、懒加载、resize）：

- `http://localhost:3000/vue2.6-cases.html`
- `http://localhost:3000/vue2.7-cases.html`
- `http://localhost:3000/vue3-cases.html`

完整 Vue 3 交互 Demo（`examples/App.vue`）：

```bash
pnpm dev
```

## 🔄 迁移说明

当前实现已从 TSX 绑定迁移到更中性的 `render` / `h` 渲染方案，目的是降低 Vue 2 / Vue 3 在 JSX 编译和插槽语义上的差异风险。对使用方来说，组件名、props、slots 与插件安装方式保持一致。

## 📦 发布前检查（维护者）

```bash
pnpm verify:release
```

该命令会依次执行：

- 单元测试与契约测试（`pnpm test`）
- 构建产物（`pnpm build`）
- 浏览器兼容 E2E（`pnpm test:e2e`）
- 发布入口检查与 `npm pack --dry-run`

E2E 共 **15** 项用例，在 Vue 2.6 / 2.7 / 3 的真实浏览器环境里验证：

| 页面 | 用例数 | 覆盖内容 |
|------|--------|----------|
| `vue*.html` 基础页 | 3 | `middle` 省略，且无多余展开按钮 |
| `vue*-cases.html` 功能矩阵 | 12（每版本 4） | 见下表 |

功能矩阵每版本覆盖：

| 场景 | 断言要点 |
|------|----------|
| 方向 + 多行 | `start` / `middle` / `end` 省略形态；`rows=2` 高度 |
| 展开收起 | `expandNode` 插槽按钮可见；点击后 `expanded` 切换并恢复省略 |
| 懒加载 | `useObserver` 进入视口前无省略，滚动后完成计算 |
| 自适应 | 窄容器省略 → 宽容器显示完整 → 再收窄恢复省略 |

首次运行 E2E 需安装 Playwright 浏览器：

```bash
pnpm exec playwright install chromium
pnpm build
pnpm test:e2e
```

## 🤝 遇到问题？

- 查看 **[在线演示](https://jimchou-h.github.io/vue-text-ellipsis-center/)**
- 提交 [Issue](https://github.com/jimchou-h/vue-text-ellipsis-center/issues)

## 📄 许可证

MIT License
