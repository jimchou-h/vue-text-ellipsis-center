import { cpSync, existsSync } from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const examplesDist = path.join(repoRoot, "examples", "dist");
const compatSource = path.join(repoRoot, "examples", "compat");
const compatTarget = path.join(examplesDist, "compat");

function run(command) {
  execSync(command, { cwd: repoRoot, stdio: "inherit" });
}

console.log("📦 构建组件库...");
run("pnpm build");

console.log("📋 构建 Vue 3 示例站点...");
run("pnpm --filter vue-text-ellipsis-center-examples run build");

if (!existsSync(examplesDist)) {
  throw new Error(`示例 dist 目录不存在: ${examplesDist}`);
}

console.log("📁 复制 compat 演示页到 dist/compat...");
cpSync(compatSource, compatTarget, { recursive: true });

console.log("✅ Pages 构建完成");
