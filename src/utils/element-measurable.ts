/**
 * 判断元素及其祖先是否处于可测量状态（非 display:none / visibility:hidden）
 */
export function isElementMeasurable(element: HTMLElement | null): boolean {
  if (!element) return false;

  let node: HTMLElement | null = element;
  while (node) {
    const style = getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden") {
      return false;
    }
    node = node.parentElement;
  }

  return true;
}
