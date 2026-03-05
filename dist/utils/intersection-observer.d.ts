type IntersectionCallback = (entry: IntersectionObserverEntry) => void;
/**
 * 存储元素与回调函数的映射关系
 */
export declare const mapItems: Map<Element, IntersectionCallback>;
/**
 * 获取全局 IntersectionObserver 实例
 * @returns IntersectionObserver 实例
 */
export declare function getObserver(): IntersectionObserver;
/**
 * 安全地观察元素
 * @param element 要观察的 DOM 元素
 * @param callback 回调函数
 */
export declare function observeElement(element: Element, callback: IntersectionCallback): void;
/**
 * 安全地取消观察元素
 * @param element 要取消观察的 DOM 元素
 */
export declare function unobserveElement(element: Element): void;
/**
 * 清理所有观察器和映射关系
 */
export declare function cleanup(): void;
export {};
