import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

interface PackageJson {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: Record<string, { optional?: boolean }>;
}

const repoRoot = path.resolve(__dirname, "..");
const libPackagePath = path.join(repoRoot, "src", "package.json");

function readLibPackage(): PackageJson {
  return JSON.parse(readFileSync(libPackagePath, "utf-8")) as PackageJson;
}

describe("Vue 兼容契约", () => {
  it("发布包应引入 vue-demi 作为跨版本运行时适配层", () => {
    const pkg = readLibPackage();
    expect(pkg.dependencies?.["vue-demi"]).toBeTruthy();
  });

  it("发布包应声明 Vue2/Vue3 支持范围", () => {
    const pkg = readLibPackage();
    expect(pkg.peerDependencies?.vue).toBe("^2.6.14 || ^2.7.0 || >=3.2.0");
  });

  it("Vue 2.6 场景应将 @vue/composition-api 声明为可选 peer 依赖", () => {
    const pkg = readLibPackage();
    expect(pkg.peerDependencies?.["@vue/composition-api"]).toBeTruthy();
    expect(pkg.peerDependenciesMeta?.["@vue/composition-api"]?.optional).toBe(
      true,
    );
  });
});
