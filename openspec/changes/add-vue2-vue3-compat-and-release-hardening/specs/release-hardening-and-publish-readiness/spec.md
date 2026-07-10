## ADDED Requirements

### Requirement: 一致的发布入口契约
该包 MUST 发布一致且有效的入口元数据（`main`、`module`、`exports`、`types`、`files`），并且这些路径都指向真实存在的构建产物。

#### Scenario: 构建产物存在于声明路径
- **WHEN** 发布构建完成
- **THEN** 包入口元数据引用的每个路径 SHALL 在打包产物中真实存在

#### Scenario: 使用方解析运行时与类型入口
- **WHEN** 使用方在 ESM/CJS 工具链与 TypeScript 中解析该包
- **THEN** 运行时入口与类型入口 SHALL 无需手工绕过路径即可成功解析

### Requirement: 发布门禁校验
当必需校验不通过时，发布流程 MUST 快速失败并中止。

#### Scenario: 版本矩阵测试失败阻断发布
- **WHEN** 任一必需的 Vue 版本矩阵测试任务失败
- **THEN** 发布工作流 SHALL 立即停止且 MUST NOT 发布任何产物

#### Scenario: 元数据一致性失败阻断发布
- **WHEN** 入口路径与类型路径一致性校验失败
- **THEN** 发布工作流 SHALL 立即停止且 MUST NOT 发布任何产物

### Requirement: 版本化使用文档
文档 MUST 提供经过最小验证的 Vue 2 与 Vue 3 使用说明。

#### Scenario: 用户按 Vue 2 快速开始文档操作
- **WHEN** 用户按文档执行 Vue 2 安装与使用步骤
- **THEN** 组件 SHALL 在 Vue 2 示例应用中正常渲染，且无需未文档化的额外步骤

#### Scenario: 用户按 Vue 3 快速开始文档操作
- **WHEN** 用户按文档执行 Vue 3 安装与使用步骤
- **THEN** 组件 SHALL 在 Vue 3 示例应用中正常渲染，且无需未文档化的额外步骤
