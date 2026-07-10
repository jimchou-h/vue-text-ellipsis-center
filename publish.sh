#!/usr/bin/env sh

set -e

echo "🔧 安装依赖..."
pnpm install

echo "🧱 构建项目..."
pnpm run build

echo "🚀 发布到 npm..."
cd src && npm publish --access public

echo "✅ 发布成功"
