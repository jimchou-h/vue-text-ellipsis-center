## ADDED Requirements

### Requirement: 统一的 Vue 2 / Vue 3 运行时支持
该包 MUST 提供一个可安装分发版本，在受支持的 Vue 2 与 Vue 3 运行时下均可工作，且不要求使用方改变组件使用语义。

#### Scenario: Vue 3 应用通过插件方式安装
- **WHEN** Vue 3 应用通过 `app.use(...)` 安装 `vue-text-ellipsis-center`
- **THEN** `TextEllipsisCenter` 组件 SHALL 被正确注册并正常渲染

#### Scenario: Vue 2 应用通过插件方式安装
- **WHEN** Vue 2 应用通过 `Vue.use(...)` 安装 `vue-text-ellipsis-center`
- **THEN** `TextEllipsisCenter` 组件 SHALL 被正确注册并正常渲染

### Requirement: 跨版本公共行为一致性
在相同 props 与插槽输入下，组件在 Vue 2 与 Vue 3 中 MUST 呈现等价的可见行为，包括省略方向、显示行数与展开/收起表现。

#### Scenario: 中间省略行为一致
- **WHEN** 等价的 Vue 2 与 Vue 3 测试用例渲染 `direction="middle"` 的长文本
- **THEN** 两侧渲染结果 SHALL 以等价顺序包含前缀、省略标记与后缀

#### Scenario: 展开状态行为一致
- **WHEN** 等价的 Vue 2 与 Vue 3 测试用例以 `expanded=true` 渲染
- **THEN** 两侧渲染结果 SHALL 显示完整文本且不截断

### Requirement: 明确声明兼容契约
包元数据 MUST 声明双版本运行所支持的 Vue 版本范围与必要的 `peerDependencies` 要求。

#### Scenario: 使用方检查包元数据
- **WHEN** 使用方查看发布产物中的 `peerDependencies` 与相关元数据
- **THEN** 元数据 SHALL 清晰描述兼容的 Vue 版本区间及可选兼容依赖要求
