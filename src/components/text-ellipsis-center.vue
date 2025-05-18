<template>
  <div ref="container">
    <!-- Measure Prepare -->
    <div
      v-if="status === MEASURE_STATUS.PREPARE"
      ref="fullMeasureRef"
      :style="measureStyle"
      aria-hidden="true"
    >
      {{ text }}
      <slot name="expandNode" />
    </div>
    <div
      v-if="status === MEASURE_STATUS.PREPARE"
      ref="singleRowMeasureRef"
      :style="measureStyle"
      aria-hidden="true"
    >
      &nbsp;
    </div>

    <!-- Measure Walking -->
    <div
      v-if="status === MEASURE_STATUS.MEASURE_WALKING"
      ref="midMeasureRef"
      :style="measureStyle"
      aria-hidden="true"
      style="word-break: break-all"
    >
      {{ renderContent(midIndex) }}
    </div>

    <!-- Final Display -->
    <div v-else ref="displayRef">
      <template v-if="expanded || status === MEASURE_STATUS.STABLE_NO_ELLIPSIS">
        {{ text }}
        <slot
          name="collapseNode"
          v-if="status === MEASURE_STATUS.STABLE_ELLIPSIS"
        />
      </template>
      <template v-else-if="status === MEASURE_STATUS.STABLE_ELLIPSIS">
        {{ renderContent(midIndex) }}
      </template>
    </div>
  </div>
</template>

<script>
import { mapItems, getObserver } from "../utils/intersection-observer";
import runes from "runes2";

const MEASURE_STATUS = {
  PREPARE: 1,
  MEASURE_WALKING: 2,
  STABLE_ELLIPSIS: 99,
  STABLE_NO_ELLIPSIS: 100,
};

export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    rows: {
      type: Number,
      default: 1,
    },
    direction: {
      type: String,
      default: "middle",
    },
    expanded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      contentChars: [],
      maxHeight: 0,
      walkingIndexes: [0, 0],
      status: MEASURE_STATUS.STABLE_NO_ELLIPSIS,
      measureStyle: {
        visibility: "hidden",
        whiteSpace: "inherit",
        lineHeight: "inherit",
        fontSize: "inherit",
      },

      init: false,

      MEASURE_STATUS,
    };
  },
  computed: {
    midIndex() {
      return Math.ceil((this.walkingIndexes[0] + this.walkingIndexes[1]) / 2);
    },
    // 根据 index 生成文本返回
    renderContent() {
      return function (index) {
        const prefixContent = this.contentChars.slice(0, index).join("");
        const suffixContent = this.contentChars.slice(-index).join("");

        if (this.direction === "start") {
          return `...${prefixContent}`;
        } else if (this.direction === "end") {
          return `${suffixContent}...`;
        } else if (this.direction === "middle") {
          return `${prefixContent}...${suffixContent}`;
        }
        return "";
      };
    },
  },
  watch: {
    text: {
      immediate: true,
      async handler(newContent) {
        this.contentChars = runes(newContent);
        // 监听要先关闭再打开,不然会有延迟
        if (this.init) {
          this.init = false;
          this.cancelObserver();
          await this.$nextTick();
          this.openObserver();
        }
      },
    },
    async status() {
      await this.$nextTick();
      this.measureHeights();
    },
  },
  methods: {
    startMeasure() {
      this.status = MEASURE_STATUS.PREPARE;
      this.walkingIndexes = [
        0,
        this.direction === "middle"
          ? Math.ceil(this.contentChars.length / 2)
          : this.contentChars.length,
      ];
    },
    async measureHeights() {
      if (this.status === MEASURE_STATUS.PREPARE) {
        const fullMeasureHeight = this.$refs.fullMeasureRef?.offsetHeight || 0;
        const singleRowHeight =
          this.$refs.singleRowMeasureRef?.offsetHeight || 0;
        const rowMeasureHeight = singleRowHeight * this.rows;
        if (fullMeasureHeight <= rowMeasureHeight) {
          this.status = MEASURE_STATUS.STABLE_NO_ELLIPSIS;
        } else {
          this.maxHeight = rowMeasureHeight;
          this.status = MEASURE_STATUS.MEASURE_WALKING;
        }
      }
    },
    async handleWalkingMeasure() {
      if (this.status === MEASURE_STATUS.MEASURE_WALKING) {
        const diff = this.walkingIndexes[1] - this.walkingIndexes[0];
        const midHeight = this.$refs.midMeasureRef?.offsetHeight || 0;
        if (diff > 1) {
          if (midHeight > this.maxHeight) {
            this.walkingIndexes = [this.walkingIndexes[0], this.midIndex];
          } else {
            this.walkingIndexes = [this.midIndex, this.walkingIndexes[1]];
          }
        } else {
          if (midHeight > this.maxHeight) {
            this.walkingIndexes = [
              this.walkingIndexes[0],
              this.walkingIndexes[0],
            ];
          } else {
            this.walkingIndexes = [
              this.walkingIndexes[1],
              this.walkingIndexes[1],
            ];
          }
          this.status = MEASURE_STATUS.STABLE_ELLIPSIS;
        }
      }
    },
    // 增加 监听
    async openObserver() {
      const element = this.$refs.container;
      // 文件名计算懒加载
      const observer = getObserver();
      observer.observe(element);
      mapItems.set(element, (entry) => {
        if (entry.isIntersecting) {
          if (this.init) {
            return;
          }
          this.startMeasure();
          this.init = true;
        }
      });
    },
    // 移除 监听
    cancelObserver() {
      const element = this.$refs.container;
      const observer = getObserver();
      observer.unobserve(element);
      mapItems.delete(element);
    },
  },
  mounted() {
    this.openObserver();
  },
  beforeDestroy() {
    this.cancelObserver();
  },
  updated() {
    // renderContent 执行后触发 updated，然后再执行 handleWalkingMeasure
    // setTimeout 确保能渲染后触发
    setTimeout(() => {
      if (this.status === MEASURE_STATUS.MEASURE_WALKING) {
        this.handleWalkingMeasure();
      }
    }, 0)
  },
};
</script>
