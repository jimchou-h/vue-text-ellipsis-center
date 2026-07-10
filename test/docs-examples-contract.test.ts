import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(__dirname, "..");

const basicCompatExamples = [
  "examples/compat/vue2.6.html",
  "examples/compat/vue2.7.html",
  "examples/compat/vue3.html",
] as const;

const compatCaseExamples = [
  "examples/compat/vue2.6-cases.html",
  "examples/compat/vue2.7-cases.html",
  "examples/compat/vue3-cases.html",
] as const;

describe("示例与文档契约", () => {
  it("应提供 Vue 2.6、Vue 2.7、Vue 3 的最小示例", () => {
    const exampleFiles = [
      ...basicCompatExamples,
      ...compatCaseExamples,
      "examples/compat/vendor/vue-demi.iife.js",
      "examples/compat/vendor/vue-text-ellipsis-center.umd.js",
    ];

    for (const file of exampleFiles) {
      expect(existsSync(path.join(repoRoot, file)), `${file} 不存在`).toBe(true);
    }
  });

  it("基础 compat 示例不应包含 expandNode（避免与纯省略演示混淆）", () => {
    for (const file of basicCompatExamples) {
      const html = readFileSync(path.join(repoRoot, file), "utf-8");
      expect(html, `${file} 不应包含 expandNode`).not.toMatch(
        /expandNode|#expandNode|slot="expandNode"/,
      );
    }
  });

  it("功能矩阵 compat 示例应覆盖展开收起、懒加载与 resize 场景", () => {
    for (const file of compatCaseExamples) {
      const html = readFileSync(path.join(repoRoot, file), "utf-8");
      expect(html, `${file} 应包含 expandNode`).toMatch(
        /expandNode|#expandNode|slot="expandNode"/,
      );
      expect(html, `${file} 应包含 rows=2`).toMatch(/:rows="2"|rows="2"/);
      expect(html, `${file} 应包含 useObserver`).toMatch(
        /use-observer|useObserver|:use-observer/,
      );
      expect(html, `${file} 应包含 resize 场景`).toMatch(
        /data-case="resize"|resizeWidth/,
      );
      expect(html, `${file} 展开按钮应绑定点击事件`).toMatch(
        /data-action="expand"|@click="(expanded = true|openExpanded|onExpandCaseClick)"/,
      );
    }
  });

  it("README 应包含支持矩阵、API 与完整使用示例", () => {
    const readme = readFileSync(path.join(repoRoot, "README.md"), "utf-8");

    expect(readme).toContain("Vue 2.6");
    expect(readme).toContain("@vue/composition-api");
    expect(readme).toContain("Vue 2.7");
    expect(readme).toContain("Vue 3");
    expect(readme).toContain("render");
    expect(readme).toContain("expandNode");
    expect(readme).toContain("collapseNode");
    expect(readme).toContain("useObserver");
    expect(readme).toContain("direction=\"start\"");
    expect(readme).toContain("v-show");
    expect(readme).toContain("v-model:expanded");
  });
});
