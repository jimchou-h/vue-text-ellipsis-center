import { describe, expect, it, vi } from "vitest";
import { invokeSlot, normalizeDomProps, useVnodeRef } from "../src/runtime/vue-bridge";
import {
  createVue2RefCallback,
  toVue2VnodeData,
} from "../src/runtime/vue2-vnode";

describe("invokeSlot", () => {
  it("Vue 3 函数式插槽应被调用", () => {
    const slot = vi.fn(() => "slot-content");
    expect(invokeSlot({ expandNode: slot }, "expandNode")).toBe("slot-content");
    expect(slot).toHaveBeenCalledOnce();
  });

  it("Vue 2 数组插槽应原样返回", () => {
    const vnodes = [{ type: "span" }];
    expect(invokeSlot({ expandNode: vnodes }, "expandNode")).toBe(vnodes);
  });

  it("缺失插槽应返回 null", () => {
    expect(invokeSlot({}, "expandNode")).toBeNull();
  });
});

describe("toVue2VnodeData", () => {
  it("应将 data-* / aria-* 移入 attrs", () => {
    const bindRef = vi.fn();
    const result = toVue2VnodeData({
      style: { visibility: "hidden" },
      ref: bindRef,
      "data-measure": "full",
      "aria-hidden": "true",
      "data-container": "text-ellipsis",
    });

    expect(result.style).toEqual({ visibility: "hidden" });
    expect(result.ref).toBe(bindRef);
    expect(result.attrs).toEqual({
      "data-measure": "full",
      "aria-hidden": "true",
      "data-container": "text-ellipsis",
    });
    expect(result).not.toHaveProperty("data-measure");
  });
});

describe("createVue2RefCallback", () => {
  it("应通过回调写入 elementRef", () => {
    const elementRef = { value: null as HTMLDivElement | null };
    const bindRef = createVue2RefCallback(elementRef);
    const element = document.createElement("div");

    bindRef(element);

    expect(elementRef.value).toBe(element);
  });
});

describe("vue-bridge (Vue 3 模式)", () => {
  it("normalizeDomProps 应保持 props 结构不变", () => {
    const props = {
      style: { overflow: "hidden" },
      ref: () => {},
      "data-measure": "full",
      "aria-hidden": "true",
    };

    expect(normalizeDomProps(props)).toEqual(props);
  });

  it("useVnodeRef 的 bindRef 应为 ref 对象", () => {
    const { bindRef } = useVnodeRef<HTMLDivElement>();

    expect(bindRef).toHaveProperty("value");
    expect(typeof bindRef).not.toBe("function");
  });
});
