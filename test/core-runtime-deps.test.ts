import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(__dirname, "..");

describe("核心运行时依赖契约", () => {
  it("核心组件应使用 Vue2 兼容的 vnode ref 绑定", () => {
    const componentSource = readFileSync(
      path.join(repoRoot, "src", "components", "text-ellipsis-center.tsx"),
      "utf-8",
    );

    expect(componentSource).toContain("useVnodeRef");
    expect(componentSource).toContain("invokeSlot");
    expect(componentSource).toContain("normalizeDomProps");
    expect(componentSource).toContain("containerVnodeRef");

    const bridgeSource = readFileSync(
      path.join(repoRoot, "src", "runtime", "vue-bridge.ts"),
      "utf-8",
    );
    expect(bridgeSource).toContain("toVue2VnodeData");
  });

  it("核心组件运行路径不应直接依赖 @vueuse/core", () => {
    const componentSource = readFileSync(
      path.join(repoRoot, "src", "components", "text-ellipsis-center.tsx"),
      "utf-8",
    );

    expect(componentSource).not.toContain("@vueuse/core");
    expect(componentSource).toContain("useElementResizeObserver");
  });
});
