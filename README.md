# Vue Text Ellipsis Center

[![npm version](https://img.shields.io/npm/v/vue-text-ellipsis-center.svg)](https://www.npmjs.com/package/vue-text-ellipsis-center)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)

一个简单易用的 Vue 3 文本省略组件，让你的长文本在任何容器中都能完美显示。

🌐 **[在线演示](https://jimchou-h.github.io/vue-text-ellipsis-center/)**

## ✨ 它能做什么？

当你的文本太长，容器装不下时，这个组件会自动帮你：
- ✅ 在开头、中间或结尾添加省略号
- ✅ 支持单行或多行文本
- ✅ 点击展开/收起完整内容
- ✅ 滚动到可见区域时才计算（性能优化）
- ✅ 容器大小变化时自动重新计算

## 🚀 快速上手

### 安装

```bash
# 选择你喜欢的包管理器
npm install vue-text-ellipsis-center
# 或者
yarn add vue-text-ellipsis-center
# 或者
pnpm add vue-text-ellipsis-center
```

### 基本使用

```vue
<template>
  <!-- 在固定宽度的容器中使用 -->
  <div style="width: 200px;">
    <TextEllipsisCenter
      text="这是一个非常长的文本内容，需要被省略显示"
    />
  </div>
</template>

<script setup>
import TextEllipsisCenter from 'vue-text-ellipsis-center'
</script>
```

## 💡 常用场景

### 1. 多行文本省略

```vue
<TextEllipsisCenter
  text="这个文本很长，需要在两行内显示并自动省略多余部分"
  :rows="2"
  direction="middle"
/>
```

### 2. 可展开/收起的文本

```vue
<template>
  <TextEllipsisCenter
    v-model:expanded="isExpanded"
    text="点击按钮可以查看完整的长文本内容..."
  >
    <template #expandNode>
      <button>展开</button>
    </template>
    <template #collapseNode>
      <button>收起</button>
    </template>
  </TextEllipsisCenter>
</template>

<script setup>
import { ref } from 'vue'

const isExpanded = ref(false)
</script>
```

### 3. 列表中的懒加载（提升性能）

```vue
<!-- 当页面有很多文本时，使用懒加载避免一次性计算所有内容 -->
<TextEllipsisCenter
  text="这个文本只有在滚动到可见区域时才会计算省略"
  useObserver
/>
```

## 🔧 配置选项

| 属性 | 说明 | 默认值 |
|------|------|--------|
| `text` | 要显示的文本内容 | 必填 |
| `rows` | 显示的行数 | 1 |
| `direction` | 省略号位置：start(开头)、middle(中间)、end(结尾) | middle |
| `expanded` | 是否展开显示完整内容 | false |
| `useObserver` | 是否使用懒加载（适合大量数据） | false |

## 🌟 为什么选择这个组件？

- **智能计算**：自动找到最佳的省略位置
- **性能优秀**：支持懒加载，不影响页面加载速度
- **使用简单**：几行代码就能实现复杂效果
- **兼容性好**：支持 Vue 3 和 TypeScript

## 🤝 遇到问题？

- 查看 **[在线演示](https://jimchou-h.github.io/vue-text-ellipsis-center/)** 了解各种用法
- 有疑问或建议？欢迎提交 [Issue](https://github.com/jimchou-h/vue-text-ellipsis-center/issues)

## 📄 许可证

MIT License - 你可以自由使用、修改和分发。

---

⭐ **如果这个组件对你有帮助，请给个 Star 支持一下！**
