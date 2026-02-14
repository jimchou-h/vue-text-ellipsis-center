<template>
  <div ref="containerRef" :style="state.containerStyle">
    <!-- Measure Prepare -->
    <div
      v-if="state.status === MEASURE_STATUS.PREPARE"
      ref="fullMeasureRef"
      :style="state.measureStyle"
      aria-hidden="true"
    >
      {{ props.text }}
      <slot name="expandNode" />
    </div>
    <div
      v-if="state.status === MEASURE_STATUS.PREPARE"
      ref="singleRowMeasureRef"
      :style="state.measureStyle"
      aria-hidden="true"
    >
      &nbsp;
    </div>

    <!-- Measure Walking -->
    <div
      v-if="state.status === MEASURE_STATUS.MEASURE_WALKING"
      ref="midMeasureRef"
      :style="state.measureStyle"
      aria-hidden="true"
      style="word-break: break-all"
    >
      {{ renderContent(midIndex) }}
    </div>

    <!-- Final Display -->
    <div v-else ref="displayRef">
      <template
        v-if="
          props.expanded || state.status === MEASURE_STATUS.STABLE_NO_ELLIPSIS
        "
      >
        {{ props.text }}
        <slot
          name="collapseNode"
          v-if="state.status === MEASURE_STATUS.STABLE_ELLIPSIS"
        />
      </template>
      <template v-else-if="state.status === MEASURE_STATUS.STABLE_ELLIPSIS">
        {{ renderContent(midIndex) }}
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  reactive,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
  type CSSProperties,
  useTemplateRef,
} from "vue";
// @ts-ignore - JavaScript module without types
import { mapItems, getObserver } from "../utils/intersection-observer";
// @ts-ignore - JavaScript module without types
import runes from "runes2";
import { useResizeObserver } from "@vueuse/core";

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
  /** 是否监听容器尺寸变化并自动重新计算 */
  autoResize?: boolean;
}

// Emits 接口定义
interface Emits {
  (e: "update:expanded", value: boolean): void;
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

// Props 定义 - 使用 withDefaults 提供默认值
const props = withDefaults(defineProps<Props>(), {
  rows: 1,
  direction: "middle",
  expanded: false,
  useObserver: false,
  autoResize: true,
});

// Emits 定义
const emit = defineEmits<Emits>();

// 模板引用
const containerRef = useTemplateRef("containerRef");
const fullMeasureRef = useTemplateRef("fullMeasureRef");
const singleRowMeasureRef = useTemplateRef("singleRowMeasureRef");
const midMeasureRef = useTemplateRef("midMeasureRef");

useResizeObserver(containerRef, () => {
  state.status = MEASURE_STATUS.HIDE;
  startMeasure();
});


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

/**
 * 计算中间索引 - 用于二分查找
 */
const midIndex = computed(() => {
  return Math.ceil((state.walkingIndexes[0] + state.walkingIndexes[1]) / 2);
});

/**
 * 根据索引生成省略文本
 * @param index 要保留的字符数量
 * @returns 格式化后的文本
 */
const renderContent = (index: number): string => {
  const prefixContent = state.contentChars.slice(0, index).join("");
  const suffixContent = state.contentChars.slice(-index).join("");

  switch (props.direction) {
    case "start":
      return `...${prefixContent}`;
    case "end":
      return `${suffixContent}...`;
    case "middle":
      return `${prefixContent}...${suffixContent}`;
    default:
      return "";
  }
};

/**
 * 开始测量流程
 */
const startMeasure = (): void => {
  state.status = MEASURE_STATUS.PREPARE;
  state.walkingIndexes = [
    0,
    props.direction === "middle"
      ? Math.ceil(state.contentChars.length / 2)
      : state.contentChars.length,
  ];
};

/**
 * 测量元素高度并决定是否需要省略
 */
const measureHeights = async (): Promise<void> => {
  if (state.status === MEASURE_STATUS.PREPARE) {
    const fullMeasureHeight = fullMeasureRef.value?.offsetHeight ?? 0;
    const singleRowHeight = singleRowMeasureRef.value?.offsetHeight ?? 0;
    const rowMeasureHeight = singleRowHeight * props.rows;

    // 如果完整内容高度小于等于允许的最大高度，则不需要省略
    if (fullMeasureHeight <= rowMeasureHeight) {
      state.status = MEASURE_STATUS.STABLE_NO_ELLIPSIS;
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
  if (state.status === MEASURE_STATUS.MEASURE_WALKING) {
    const diff = state.walkingIndexes[1] - state.walkingIndexes[0];
    const midHeight = midMeasureRef.value?.offsetHeight ?? 0;

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
    }
  }
};

/**
 * 开启 IntersectionObserver 监听
 */
const openObserver = async (): Promise<void> => {
  await nextTick();
  const element = containerRef.value;
  if (!element) return;

  const observer = getObserver();
  observer.observe(element);

  mapItems.set(element, (entry: IntersectionObserverEntry) => {
    if (entry.isIntersecting) {
      if (state.init) return;

      startMeasure();
      state.status = MEASURE_STATUS.PREPARE;
      state.init = true;
    }
  });
};

/**
 * 取消 IntersectionObserver 监听
 */
const cancelObserver = (): void => {
  const element = containerRef.value;
  if (!element) return;

  const observer = getObserver();
  observer.unobserve(element);
  mapItems.delete(element);
};

// const openAutoResize = (): void => {

// }

// 监听文本变化，重新初始化测量
watch(
  () => props.text,
  async (newContent: string) => {
    state.contentChars = runes(newContent);

    // 如果已经初始化过，需要重新开始测量流程
    if (state.init) {
      state.init = false;
      cancelObserver();
      await nextTick();
      openObserver();
    }
  },
  { immediate: true },
);

// 监听状态变化，触发高度测量
watch(
  () => state.status,
  async () => {
    await nextTick();
    measureHeights();
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
    openObserver();
  } else {
    startMeasure();
  }

  if (props.autoResize) {
    // openAutoResize();
  }
});

// 组件卸载前清理资源
onBeforeUnmount(() => {
  if (props.useObserver) {
    cancelObserver();
  }
});
</script>
