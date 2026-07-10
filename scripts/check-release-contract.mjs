import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const packageRoot = path.join(repoRoot, "src");
const packageJsonPath = path.join(packageRoot, "package.json");
const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

const expectedEntries = [
  pkg.main,
  pkg.module,
  pkg.types,
  pkg.exports?.["."]?.types,
  pkg.exports?.["."]?.import,
  pkg.exports?.["."]?.require,
].filter(Boolean);

const missingEntries = expectedEntries.filter(
  (entry) => !existsSync(path.join(packageRoot, entry)),
);

if (missingEntries.length > 0) {
  throw new Error(
    `发布入口指向不存在的文件: ${missingEntries.join(", ")}`,
  );
}

if (pkg.peerDependencies?.vue !== "^2.6.14 || ^2.7.0 || >=3.2.0") {
  throw new Error("peerDependencies.vue 未声明 Vue 2/3 支持范围");
}

if (!pkg.dependencies?.["vue-demi"]) {
  throw new Error("发布包缺少 vue-demi 运行时依赖");
}

if (!pkg.peerDependenciesMeta?.["@vue/composition-api"]?.optional) {
  throw new Error("@vue/composition-api 必须声明为可选 peer 依赖");
}

if (!pkg.files?.includes("README.md")) {
  throw new Error("发布包 files 必须包含 README.md");
}

const packageReadmePath = path.join(packageRoot, "README.md");
if (!existsSync(packageReadmePath)) {
  throw new Error("发布包缺少 src/README.md，请先执行 pnpm build");
}

console.log("Release contract OK");
