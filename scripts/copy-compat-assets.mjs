import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const librarySource = path.join(
  repoRoot,
  "src",
  "dist",
  "vue-text-ellipsis-center.umd.js",
);
const vueDemiSource = path.join(
  repoRoot,
  "src",
  "node_modules",
  "vue-demi",
  "lib",
  "index.iife.js",
);
const targetDir = path.join(repoRoot, "examples", "compat", "vendor");
const libraryTarget = path.join(targetDir, "vue-text-ellipsis-center.umd.js");
const vueDemiTarget = path.join(targetDir, "vue-demi.iife.js");

mkdirSync(targetDir, { recursive: true });
copyFileSync(librarySource, libraryTarget);
copyFileSync(vueDemiSource, vueDemiTarget);

console.log(`Copied compat assets to ${targetDir}`);
