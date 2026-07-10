## 背景与动机

当前仓库处于迁移中间态：实现代码、包元数据、构建产物与测试基线未对齐，导致发布结果不稳定、可复现性不足。同时，目标用户明确需要在同一个维护中的包内获得 Vue 2 与 Vue 3 的稳定支持。

## 变更内容

- 建立正式的跨版本兼容策略，使 `vue-text-ellipsis-center` 能在 Vue 2 与 Vue 3 下统一使用。
- 收敛发布结构（入口、`exports`、类型声明、产物目录），确保构建产物与包声明一致且可复现。
- 重建测试策略：以用户可见行为为中心，并引入 Vue 2 + Vue 3 验证矩阵。
- 更新示例与文档，分别提供清晰的 Vue 2 / Vue 3 使用路径。
- 在发布到 GitHub/npm 前增加发布硬化检查（构建、测试、元数据一致性）。

## 能力清单

### 新增能力
- `cross-version-runtime-compat`：定义面向 Vue 2 / Vue 3 的运行时与打包兼容契约。
- `release-hardening-and-publish-readiness`：定义可发布所需的流水线质量门禁与产物一致性保障。

### 变更能力
- 无（仓库当前尚无既有 OpenSpec capability 需要修改）。

## 影响范围

- 影响代码范围：`src/components`、`src/index.ts`、运行时适配层/工具、测试、示例、构建与发布配置。
- 影响依赖范围：Vue 运行时适配栈（例如 `vue-demi`、Vue 2 Composition API 桥接依赖）、测试与构建插件、`peerDependencies` 声明。
- 影响对外契约：包安装/注册行为、文档中的支持矩阵、对消费者暴露的包元数据与入口定义。
