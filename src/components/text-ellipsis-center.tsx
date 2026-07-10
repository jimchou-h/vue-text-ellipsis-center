import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  useVnodeRef,
  invokeSlot,
  normalizeDomProps,
  watch,
  type CSSProperties,
  type PropType,
  type VNode,
} from "../runtime/vue-bridge";

// @ts-ignore - JavaScript module without types
import { mapItems, getObserver } from "../utils/intersection-observer";
import { useElementResizeObserver } from "../utils/resize-observer";
import { isElementMeasurable } from "../utils/element-measurable";
// @ts-ignore - JavaScript module without types
import runes from "runes2";

// 测量状态枚举 - 使用 const enum 获得更好的类型安全性和性能
const enum MEASURE_STATUS {
  HIDE = 0,
  PREPARE = 1,
  MEASURE_WALKING = 2,
  STABLE_ELLIPSIS = 99,
  STABLE_NO_ELLIPSIS = 100,
}

// Props 接口定义
interface Props {
  /** 需要显示的文本内容 */
  text: string;
  /** 显示的行数 */
  rows?: number;
  /** 省略号位置：start(开头)、middle(中间)、end(结尾) */
  direction?: "start" | "middle" | "end";
  /** 是否展开显示完整内容 */
  expanded?: boolean;
  /** 是否使用 IntersectionObserver 进行懒加载 */
  useObserver?: boolean;
  /** 更新展开状态的函数 */
  "onUpdate:expanded"?: (value: boolean) => void;
}

// 组件状态接口
interface ComponentState {
  /** 文本字符数组（支持 Unicode） */
  contentChars: string[];
  /** 最大允许高度 */
  maxHeight: number;
  /** 二分查找的索引范围 [start, end] */
  walkingIndexes: [number, number];
  /** 当前测量状态 */
  status: MEASURE_STATUS;
  /** 容器样式 */
  containerStyle: CSSProperties;
  /** 测量元素的样式 */
  measureStyle: CSSProperties;
  /** 是否已初始化 */
  init: boolean;
}

export default defineComponent({
  name: "TextEllipsisCenter",

  props: {
    text: {
      type: String as PropType<string>,
      required: true,
    },
    rows: {
      type: Number as PropType<number>,
      default: 1,
    },
    direction: {
      type: String as PropType<"start" | "middle" | "end">,
      default: "middle",
    },
    expanded: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    useObserver: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },

  emits: ["update:expanded"],

  setup(props, { slots }) {
    // 获取组件实例
    const instance = getCurrentInstance();

    const { elementRef: containerRef, bindRef: containerVnodeRef } =
      useVnodeRef<HTMLElement>();
    const { elementRef: fullMeasureRef, bindRef: fullMeasureVnodeRef } =
      useVnodeRef<HTMLElement>();
    const {
      elementRef: singleRowMeasureRef,
      bindRef: singleRowMeasureVnodeRef,
    } = useVnodeRef<HTMLElement>();
    const { elementRef: midMeasureRef, bindRef: midMeasureVnodeRef } =
      useVnodeRef<HTMLElement>();

    // 获取 DOM 元素的辅助函数
    const getRootElement = (): HTMLElement | null => {
      if (!instance) return null;

      const proxy = instance.proxy as { $el?: HTMLElement } | null;
      if (proxy?.$el instanceof HTMLElement) {
        return proxy.$el;
      }

      const vnode = instance.vnode as { elm?: HTMLElement } | undefined;
      return vnode?.elm instanceof HTMLElement ? vnode.elm : null;
    };

    const getElementBySelector = (selector: string): HTMLElement | null => {
      const root = getRootElement();
      if (!root) return null;
      return root.querySelector(selector);
    };

    const resolveContainer = (): HTMLElement | null =>
      containerRef.value ?? getRootElement();

    // 响应式状态管理
    const state = reactive<ComponentState>({
      contentChars: [],
      maxHeight: 0,
      walkingIndexes: [0, 0],
      status: MEASURE_STATUS.STABLE_NO_ELLIPSIS,
      containerStyle: {
        overflow: "hidden",
        lineHeight: "1.5",
        wordBreak: "break-all",
      },
      measureStyle: {
        visibility: "hidden",
        whiteSpace: "inherit",
        lineHeight: "inherit",
        fontSize: "inherit",
      },
      init: false,
    });

    let pendingMeasure = false;

    const markMeasureComplete = (): void => {
      state.init = true;
      pendingMeasure = false;
    };

    const ensureMeasurableOrDefer = async (): Promise<boolean> => {
      const container = resolveContainer();
      if (container && !isElementMeasurable(container)) {
        await deferMeasureUntilVisible();
        return false;
      }
      return true;
    };

    /**
     * 容器不可见时延后测量，待进入视口或尺寸恢复后再计算
     */
    const deferMeasureUntilVisible = async (): Promise<void> => {
      prepareMeasureRetryCount = 0;
      walkingMeasureRetryCount = 0;
      pendingMeasure = true;
      state.status = MEASURE_STATUS.HIDE;
      state.containerStyle = {
        ...state.containerStyle,
        minHeight: "1px",
      };
      await bindVisibilityObserver();
    };

    /**
     * 计算中间索引 - 用于二分查找
     */
    const midIndex = computed(() => {
      return Math.ceil((state.walkingIndexes[0] + state.walkingIndexes[1]) / 2);
    });

    /**
     * 前缀内容
     */
    const prefixContent = computed(() =>
      state.contentChars.slice(0, midIndex.value).join(""),
    );

    /**
     * 后缀内容
     */
    const suffixContent = computed(() =>
      state.contentChars.slice(-midIndex.value).join(""),
    );

    /**
     * 开始测量流程
     */
    const startMeasure = (): void => {
      prepareMeasureRetryCount = 0;
      walkingMeasureRetryCount = 0;
      state.status = MEASURE_STATUS.PREPARE;
      state.walkingIndexes = [
        0,
        props.direction === "middle"
          ? Math.ceil(state.contentChars.length / 2)
          : state.contentChars.length,
      ];
    };

    let prepareMeasureRetryCount = 0;
    let walkingMeasureRetryCount = 0;

    /**
     * 测量元素高度并决定是否需要省略
     */
    const measureHeights = async (): Promise<void> => {
      await nextTick(); // 确保 DOM 已更新

      if (state.status === MEASURE_STATUS.PREPARE) {
        if (!(await ensureMeasurableOrDefer())) return;

        // 优先使用 ref，如果 ref 为空则使用 querySelector
        let fullMeasureEl = fullMeasureRef.value;
        let singleRowMeasureEl = singleRowMeasureRef.value;

        // 如果 ref 为空，尝试通过选择器获取
        if (!fullMeasureEl) {
          fullMeasureEl = getElementBySelector('[data-measure="full"]');
        }
        if (!singleRowMeasureEl) {
          singleRowMeasureEl = getElementBySelector(
            '[data-measure="single-row"]',
          );
        }

        const fullMeasureHeight = fullMeasureEl?.offsetHeight ?? 0;
        const singleRowHeight = singleRowMeasureEl?.offsetHeight ?? 0;

        if (
          !fullMeasureEl ||
          !singleRowMeasureEl ||
          singleRowHeight === 0 ||
          fullMeasureHeight === 0
        ) {
          const container = resolveContainer();
          if (container && !isElementMeasurable(container)) {
            await deferMeasureUntilVisible();
            return;
          }

          if (prepareMeasureRetryCount < 5) {
            prepareMeasureRetryCount += 1;
            await nextTick();
            await measureHeights();
          }
          return;
        }

        prepareMeasureRetryCount = 0;

        const rowMeasureHeight = singleRowHeight * props.rows;

        // 如果完整内容高度小于等于允许的最大高度，则不需要省略
        if (fullMeasureHeight <= rowMeasureHeight) {
          state.status = MEASURE_STATUS.STABLE_NO_ELLIPSIS;
          markMeasureComplete();
        } else {
          state.maxHeight = rowMeasureHeight;
          state.status = MEASURE_STATUS.MEASURE_WALKING;
        }
      }
    };

    /**
     * 处理二分查找测量过程
     */
    const handleWalkingMeasure = async (): Promise<void> => {
      await nextTick(); // 确保 DOM 已更新

      if (state.status === MEASURE_STATUS.MEASURE_WALKING) {
        if (!(await ensureMeasurableOrDefer())) return;

        const diff = state.walkingIndexes[1] - state.walkingIndexes[0];

        // 优先使用 ref，如果 ref 为空则使用 querySelector
        let midMeasureEl = midMeasureRef.value;

        // 如果 ref 为空，尝试通过选择器获取
        if (!midMeasureEl) {
          midMeasureEl = getElementBySelector('[data-measure="mid"]');
        }

        const midHeight = midMeasureEl?.offsetHeight ?? 0;

        if (!midMeasureEl || midHeight === 0) {
          const container = resolveContainer();
          if (container && !isElementMeasurable(container)) {
            await deferMeasureUntilVisible();
            return;
          }

          if (walkingMeasureRetryCount < 5) {
            walkingMeasureRetryCount += 1;
            await nextTick();
            await handleWalkingMeasure();
          }
          return;
        }

        walkingMeasureRetryCount = 0;

        // 二分查找算法：根据中间元素的高度调整搜索范围
        if (diff > 1) {
          if (midHeight > state.maxHeight) {
            // 中间文本过高，向左搜索
            state.walkingIndexes = [state.walkingIndexes[0], midIndex.value];
          } else {
            // 中间文本合适或过低，向右搜索
            state.walkingIndexes = [midIndex.value, state.walkingIndexes[1]];
          }
        } else {
          // 找到最优解
          if (midHeight > state.maxHeight) {
            state.walkingIndexes = [
              state.walkingIndexes[0],
              state.walkingIndexes[0],
            ];
          } else {
            state.walkingIndexes = [
              state.walkingIndexes[1],
              state.walkingIndexes[1],
            ];
          }
          state.status = MEASURE_STATUS.STABLE_ELLIPSIS;
          markMeasureComplete();
        }
      }
    };

    /**
     * 开启可见性监听（useObserver 懒加载 + 隐藏延后测量共用）
     */
    const bindVisibilityObserver = async (): Promise<void> => {
      const bindObserver = (element: HTMLElement): void => {
        const observer = getObserver();
        observer.observe(element);

        mapItems.set(element, (entry: IntersectionObserverEntry) => {
          if (!entry.isIntersecting) return;

          if (
            state.status === MEASURE_STATUS.PREPARE ||
            state.status === MEASURE_STATUS.MEASURE_WALKING
          ) {
            return;
          }

          if (props.useObserver && !state.init) {
            startMeasure();
            return;
          }

          if (pendingMeasure) {
            pendingMeasure = false;
            startMeasure();
          }
        });
      };

      for (let attempt = 0; attempt < 20; attempt++) {
        await nextTick();
        const element = resolveContainer();
        if (element) {
          bindObserver(element);
          return;
        }

        await new Promise<void>((resolve) => {
          setTimeout(resolve, 16);
        });
      }
    };

    /**
     * 取消 IntersectionObserver 监听
     */
    const cancelObserver = (): void => {
      const element = resolveContainer();
      if (!element) return;

      const observer = getObserver();
      observer.unobserve(element);
      mapItems.delete(element);
    };

    // 监听容器尺寸变化
    const resizeTarget = ref<HTMLElement | null>(null);

    const syncResizeTarget = (): void => {
      resizeTarget.value = containerRef.value ?? getRootElement();
    };

    watch(containerRef, () => nextTick(syncResizeTarget), { immediate: true });
    onMounted(() => {
      syncResizeTarget();
      nextTick(syncResizeTarget);
    });

    useElementResizeObserver(resizeTarget, () => {
      const container = resizeTarget.value ?? getRootElement();
      if (!container) return;

      if (state.init) {
        state.status = MEASURE_STATUS.HIDE;
        startMeasure();
        return;
      }

      if (pendingMeasure && isElementMeasurable(container)) {
        pendingMeasure = false;
        startMeasure();
      }
    });

    // 监听文本变化，重新初始化测量
    watch(
      () => props.text,
      async (newContent: string) => {
        state.contentChars = runes(newContent);

        // 如果已经初始化过，需要重新开始测量流程
        if (state.init) {
          state.init = false;
          if (props.useObserver) {
            cancelObserver();
            await nextTick();
            await bindVisibilityObserver();
          } else {
            const container = resolveContainer();
            if (container && isElementMeasurable(container)) {
              startMeasure();
            } else {
              await deferMeasureUntilVisible();
            }
          }
        }
      },
      { immediate: true },
    );

    // 监听状态变化，触发高度测量
    watch(
      () => state.status,
      async () => {
        await nextTick();
        nextTick(() => {
          measureHeights();
        });
      },
    );

    // 模拟 Vue 2 的 updated 钩子，处理测量过程中的渲染更新
    watch([() => state.status, () => state.walkingIndexes], () => {
      if (state.status === MEASURE_STATUS.MEASURE_WALKING) {
        nextTick(() => {
          handleWalkingMeasure();
        });
      }
    });

    // 组件挂载时初始化
    onMounted(() => {
      if (props.useObserver) {
        state.status = MEASURE_STATUS.HIDE;
        state.containerStyle = {
          ...state.containerStyle,
          minHeight: "1px",
        };
        bindVisibilityObserver();
      } else {
        startMeasure();
      }
    });

    // 组件卸载前清理资源
    onBeforeUnmount(() => {
      cancelObserver();
    });

    const toNodeArray = (content: unknown): Array<string | VNode> => {
      if (content == null) return [];
      return Array.isArray(content)
        ? (content as Array<string | VNode>)
        : [content as string | VNode];
    };

    const renderExpandNode = (): Array<string | VNode> =>
      toNodeArray(invokeSlot(slots, "expandNode"));
    const renderCollapseNode = (): Array<string | VNode> =>
      toNodeArray(invokeSlot(slots, "collapseNode"));

    const getEllipsisNodes = (): Array<string | VNode> => {
      if (props.direction === "start") {
        return [...renderExpandNode(), "...", suffixContent.value];
      }
      if (props.direction === "end") {
        return [prefixContent.value, "...", ...renderExpandNode()];
      }
      return [
        prefixContent.value,
        "...",
        ...renderExpandNode(),
        suffixContent.value,
      ];
    };

    return () => {
      const children: VNode[] = [];

      if (state.status === MEASURE_STATUS.PREPARE) {
        children.push(
          h(
            "div",
            normalizeDomProps({
              ref: fullMeasureVnodeRef,
              style: state.measureStyle,
              "aria-hidden": "true",
              "data-measure": "full",
            }),
            [props.text, ...renderExpandNode()],
          ),
        );
        children.push(
          h(
            "div",
            normalizeDomProps({
              ref: singleRowMeasureVnodeRef,
              style: state.measureStyle,
              "aria-hidden": "true",
              "data-measure": "single-row",
            }),
            ["\u00A0", ...renderExpandNode()],
          ),
        );
      }

      if (state.status === MEASURE_STATUS.MEASURE_WALKING) {
        children.push(
          h(
            "div",
            normalizeDomProps({
              ref: midMeasureVnodeRef,
              style: { ...state.measureStyle, wordBreak: "break-all" },
              "aria-hidden": "true",
              "data-measure": "mid",
            }),
            getEllipsisNodes(),
          ),
        );
      }

      if (
        state.status !== MEASURE_STATUS.PREPARE &&
        state.status !== MEASURE_STATUS.MEASURE_WALKING
      ) {
        let finalChildren: Array<string | VNode> = [];
        if (
          props.expanded ||
          state.status === MEASURE_STATUS.STABLE_NO_ELLIPSIS
        ) {
          finalChildren = [props.text];
          if (state.status === MEASURE_STATUS.STABLE_ELLIPSIS) {
            finalChildren.push(...renderCollapseNode());
          }
        } else if (state.status === MEASURE_STATUS.STABLE_ELLIPSIS) {
          finalChildren = getEllipsisNodes();
        }
        children.push(h("div", {}, finalChildren));
      }

      return h(
        "div",
        normalizeDomProps({
          ref: containerVnodeRef,
          style: state.containerStyle,
          "data-container": "text-ellipsis",
        }),
        children,
      );
    };
  },
});
