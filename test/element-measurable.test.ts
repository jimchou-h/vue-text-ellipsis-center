import { describe, expect, it } from "vitest";
import { isElementMeasurable } from "../src/utils/element-measurable";

describe("isElementMeasurable", () => {
  it("可见元素应返回 true", () => {
    const element = document.createElement("div");
    element.textContent = "hello";
    document.body.appendChild(element);

    expect(isElementMeasurable(element)).toBe(true);

    document.body.removeChild(element);
  });

  it("display:none 元素应返回 false", () => {
    const element = document.createElement("div");
    element.style.display = "none";
    element.textContent = "hello";
    document.body.appendChild(element);

    expect(isElementMeasurable(element)).toBe(false);

    document.body.removeChild(element);
  });

  it("父级 display:none 时子元素应返回 false", () => {
    const parent = document.createElement("div");
    const child = document.createElement("div");
    parent.style.display = "none";
    parent.appendChild(child);
    document.body.appendChild(parent);

    expect(isElementMeasurable(child)).toBe(false);

    document.body.removeChild(parent);
  });
});
