import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

interface PackageJson {
  name: string;
  main?: string;
  module?: string;
  types?: string;
  files?: string[];
  exports?: Record<string, { types?: string; import?: string; require?: string }>;
}

const repoRoot = path.resolve(__dirname, "..");
const libPackagePath = path.join(repoRoot, "src", "package.json");

function readLibPackage(): PackageJson {
  return JSON.parse(readFileSync(libPackagePath, "utf-8")) as PackageJson;
}

describe("发布契约", () => {
  it("使用 src/package.json 作为唯一发布元数据来源", () => {
    const pkg = readLibPackage();
    expect(pkg.name).toBe("vue-text-ellipsis-center");
  });

  it("入口与类型声明字段必须使用 .d.ts 且一致", () => {
    const pkg = readLibPackage();
    const exportsRoot = pkg.exports?.["."] ?? {};

    expect(pkg.main).toBe("./dist/vue-text-ellipsis-center.umd.js");
    expect(pkg.module).toBe("./dist/vue-text-ellipsis-center.es.js");
    expect(pkg.types).toBe("./dist/vue-text-ellipsis-center.es.d.ts");

    expect(exportsRoot.import).toBe("./dist/vue-text-ellipsis-center.es.js");
    expect(exportsRoot.require).toBe("./dist/vue-text-ellipsis-center.umd.js");
    expect(exportsRoot.types).toBe("./dist/vue-text-ellipsis-center.es.d.ts");
    expect(exportsRoot.types?.endsWith(".d.ts")).toBe(true);
  });

  it("发布 files 必须包含包内 README.md", () => {
    const pkg = readLibPackage();
    expect(pkg.files).toContain("README.md");
    expect(pkg.files).not.toContain("../README.md");
  });

  it("发布声明的入口文件必须指向构建产物目录", () => {
    const pkg = readLibPackage();
    const exportsRoot = pkg.exports?.["."] ?? {};
    const declaredPaths = [pkg.main, pkg.module, pkg.types, exportsRoot.types].filter(
      (item): item is string => Boolean(item),
    );

    for (const relativePath of declaredPaths) {
      expect(relativePath.startsWith("./dist/")).toBe(true);
      expect(relativePath.includes("..")).toBe(false);
    }
  });
});
