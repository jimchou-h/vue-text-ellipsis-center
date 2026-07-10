import { copyFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const source = path.join(repoRoot, "README.md");
const target = path.join(repoRoot, "src", "README.md");

copyFileSync(source, target);

console.log(`Copied package README to ${target}`);
