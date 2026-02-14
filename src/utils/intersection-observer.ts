import 'intersection-observer'

// 回调函数类型定义
type IntersectionCallback = (entry: IntersectionObserverEntry) => void

// 使用单例模式只实例化一次，优化性能
let observer: IntersectionObserver | null = null

/**
 * 存储元素与回调函数的映射关系
 */
export const mapItems = new Map<Element, IntersectionCallback>()

/**
 * 处理 IntersectionObserver 回调
 * @param entries 观察到的条目数组
 */
function handleIntersection(entries: IntersectionObserverEntry[]): void {
  entries.forEach((entry) => {
    const callback = mapItems.get(entry.target)
    if (callback) {
      try {
        callback(entry)
      } catch (error) {
        console.error('IntersectionObserver callback error:', error)
      }
    }
  })
}

/**
 * 获取全局 IntersectionObserver 实例
 * @returns IntersectionObserver 实例
 */
export function getObserver(): IntersectionObserver {
  if (!observer) {
    // 配置选项：当元素进入视口时触发回调
    const options: IntersectionObserverInit = {
      root: null, // 相对于视口
      rootMargin: '0px',
      threshold: 0.1 // 当10%的元素可见时触发
    }
    
    observer = new IntersectionObserver(handleIntersection, options)
  }
  return observer
}

/**
 * 安全地观察元素
 * @param element 要观察的 DOM 元素
 * @param callback 回调函数
 */
export function observeElement(element: Element, callback: IntersectionCallback): void {
  if (!element) {
    console.warn('Cannot observe null element')
    return
  }
  
  const observer = getObserver()
  mapItems.set(element, callback)
  observer.observe(element)
}

/**
 * 安全地取消观察元素
 * @param element 要取消观察的 DOM 元素
 */
export function unobserveElement(element: Element): void {
  if (!element) {
    console.warn('Cannot unobserve null element')
    return
  }
  
  const observer = getObserver()
  mapItems.delete(element)
  observer.unobserve(element)
}

/**
 * 清理所有观察器和映射关系
 */
export function cleanup(): void {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  mapItems.clear()
}
