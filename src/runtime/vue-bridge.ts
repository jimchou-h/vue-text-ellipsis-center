import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  isVue2,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
  type Ref,
  type VNodeRef,
} from "vue-demi";
import {
  createVue2RefCallback,
  toVue2VnodeData,
  type DomProps,
} from "./vue2-vnode";

export function useVnodeRef<T extends Element = HTMLElement>(): {
  elementRef: Ref<T | null>;
  bindRef: VNodeRef;
} {
  const elementRef = ref<T | null>(null);

  const bindRef: VNodeRef = isVue2
    ? createVue2RefCallback(elementRef)
    : elementRef;

  return { elementRef: elementRef as Ref<T | null>, bindRef };
}

export function normalizeDomProps(props: DomProps): DomProps {
  if (!isVue2) return props;
  return toVue2VnodeData(props);
}

type SlotContent = unknown;

export function invokeSlot(
  slots: Record<string, SlotContent | undefined>,
  name: string,
): SlotContent {
  const slot = slots[name];
  if (!slot) return null;
  return typeof slot === "function" ? slot() : slot;
}

export {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  isVue2,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
};

export type { App, CSSProperties, PropType, Ref, VNode } from "vue-demi";
