<template>
  <div class="demo-container">
    <!-- 标题区域 -->
    <header class="demo-header">
      <h1>Vue Text Ellipsis Center Demo</h1>
      <p>展示文本居中省略组件的多种使用场景</p>
    </header>

    <!-- 基础用法区域 -->
    <section class="demo-section">
      <h2>基础用法</h2>
      <div class="demo-grid">
        <div class="demo-item">
          <h3>单行省略（默认）</h3>
          <div class="demo-box">
            <text-ellipsis-center
              text="这是一个很长长长长长长长长长长长长长长长长的文本内容，需要被省略显示"
              :rows="1"
            />
          </div>
        </div>
        
        <div class="demo-item">
          <h3>多行省略</h3>
          <div class="demo-box multi-line">
            <text-ellipsis-center
              text="这是一个非常长长长长长长长长长长长长长长长长的文本内容，需要在两行内显示并自动进行省略处理"
              :rows="2"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 省略位置区域 -->
    <section class="demo-section">
      <h2>省略位置</h2>
      <div class="demo-grid">
        <div class="demo-item">
          <h3>开头省略 (direction="start")</h3>
          <div class="demo-box">
            <text-ellipsis-center
              text="这是一个很长长长长长长长长长长长长长长长长的文本内容，需要在开头进行省略"
              direction="start"
            />
          </div>
        </div>
        
        <div class="demo-item">
          <h3>中间省略 (direction="middle")</h3>
          <div class="demo-box">
            <text-ellipsis-center
              text="这是一个很长长长长长长长长长长长长长长长长的文本内容，需要在中间进行省略"
              direction="middle"
            />
          </div>
        </div>
        
        <div class="demo-item">
          <h3>结尾省略 (direction="end")</h3>
          <div class="demo-box">
            <text-ellipsis-center
              text="这是一个很长长长长长长长长长长长长长长长长的文本内容，需要在结尾进行省略"
              direction="end"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 交互功能区域 -->
    <section class="demo-section">
      <h2>交互功能</h2>
      <div class="demo-grid">
        <div class="demo-item">
          <h3>展开/收起功能</h3>
          <div class="demo-box">
            <text-ellipsis-center
              v-model:expanded="expanded1"
              text="这是一个可以展开收起的文本内容，点击按钮可以查看完整内容"
              :rows="1"
            >
              <template #expandNode>
                <button class="expand-btn" @click="expanded1 = true">展开</button>
              </template>
              <template #collapseNode>
                <button class="collapse-btn" @click="expanded1 = false">收起</button>
              </template>
            </text-ellipsis-center>
          </div>
        </div>
        
        <div class="demo-item">
          <h3>懒加载 (useObserver)</h3>
          <div class="demo-box">
            <text-ellipsis-center
              text="这个文本使用了IntersectionObserver进行懒加载，滚动到可见区域时才会计算省略"
              useObserver
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 响应式测试区域 -->
    <section class="demo-section">
      <h2>响应式测试</h2>
      <div class="responsive-test">
        <div class="width-control">
          <label for="width-slider">容器宽度：{{ containerWidth }}px</label>
          <input
            id="width-slider"
            type="range"
            min="100"
            max="500"
            v-model="containerWidth"
            class="slider"
          />
        </div>
        
        <div class="responsive-box" :style="{ width: containerWidth + 'px' }">
          <text-ellipsis-center
            :text="responsiveText"
            :rows="2"
            direction="middle"
          />
        </div>
      </div>
    </section>

    <!-- 性能测试区域 -->
    <section class="demo-section">
      <h2>性能测试</h2>
      <div class="performance-test">
        <button @click="addItems" class="test-btn">添加项目</button>
        <button @click="clearItems" class="test-btn">清空项目</button>
        <span class="item-count">当前项目数：{{ performanceItems.length }}</span>
        
        <div class="items-container">
          <div
            v-for="(item, index) in performanceItems"
            :key="index"
            class="performance-item"
          >
            <text-ellipsis-center
              :text="item.text"
              :rows="1"
              useObserver
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 交互功能状态
const expanded1 = ref(false)

// 响应式测试状态
const containerWidth = ref(300)
const responsiveText = '这是一个响应式测试文本，当容器宽度变化时，省略效果会自动调整以适应新的容器尺寸'

// 性能测试状态
const performanceItems = ref<Array<{text: string}>>([])

// 生成随机文本
const generateRandomText = (length: number = 100): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789中文测试文本内容'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 添加性能测试项目
const addItems = () => {
  for (let i = 0; i < 10; i++) {
    performanceItems.value.push({
      text: generateRandomText(Math.floor(Math.random() * 100) + 100)
    })
  }
}

// 清空性能测试项目
const clearItems = () => {
  performanceItems.value = []
}

// 初始化一些测试项目
addItems()
</script>

<style scoped>
.demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
}

.demo-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #eaeaea;
}

.demo-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 2.5rem;
}

.demo-header p {
  color: #7f8c8d;
  font-size: 1.2rem;
}

.demo-section {
  margin-bottom: 50px;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.demo-section h2 {
  color: #34495e;
  margin-bottom: 25px;
  font-size: 1.8rem;
  border-left: 4px solid #3498db;
  padding-left: 15px;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.demo-item {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.demo-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.demo-item h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.1rem;
  font-weight: 600;
}

.demo-box {
  /* width: 100%; */
  padding: 15px;
  background: #ecf0f1;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
  min-height: 40px;
  display: flex;
  align-items: center;
}

.demo-box.multi-line {
  min-height: 60px;
  height: 60px;
}

.expand-btn, .collapse-btn {
  margin-left: 8px;
  padding: 4px 8px;
  border: 1px solid #3498db;
  background: #3498db;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease;
}

.expand-btn:hover, .collapse-btn:hover {
  background: #2980b9;
}

.responsive-test {
  background: white;
  padding: 25px;
  border-radius: 8px;
}

.width-control {
  margin-bottom: 20px;
}

.width-control label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #2c3e50;
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.slider:hover {
  opacity: 1;
}

.responsive-box {
  padding: 20px;
  background: #ecf0f1;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
  min-height: 60px;
  transition: width 0.3s ease;
}

.performance-test {
  background: white;
  padding: 25px;
  border-radius: 8px;
}

.test-btn {
  padding: 8px 16px;
  margin-right: 10px;
  border: 1px solid #27ae60;
  background: #27ae60;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.test-btn:hover {
  background: #219a52;
}

.item-count {
  margin-left: 15px;
  font-weight: 600;
  color: #2c3e50;
}

.items-container {
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px;
}

.performance-item {
  padding: 10px;
  margin-bottom: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #3498db;
  font-size: 13px;
}

.performance-item:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .demo-container {
    padding: 10px;
  }
  
  .demo-section {
    padding: 20px;
  }
  
  .demo-grid {
    grid-template-columns: 1fr;
  }
  
  .demo-header h1 {
    font-size: 2rem;
  }
}
</style>