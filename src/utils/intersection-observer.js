import 'intersection-observer'

// 使用单例模式只实例化一次，优化性能
let observer = null
export const mapItems = new Map()

function handleIntersection(entries) {
  entries.forEach((entry) => {
    const callback = mapItems.get(entry.target)
    callback && callback(entry)
  })
}

export function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(handleIntersection)
  }
  return observer
}
