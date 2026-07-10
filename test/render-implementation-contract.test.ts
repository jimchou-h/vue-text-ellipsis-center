import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const componentPath = path.resolve(
  __dirname,
  "../src/components/text-ellipsis-center.tsx",
);

describe("渲染实现契约", () => {
  it("主组件渲染应使用 h/render，而非 JSX 语法块", () => {
    const source = readFileSync(componentPath, "utf-8");
    expect(source.includes("<div")).toBe(false);
    expect(source.includes("</")).toBe(false);
    expect(source.includes("<>")).toBe(false);
    expect(source.includes("h(")).toBe(true);
  });
});
