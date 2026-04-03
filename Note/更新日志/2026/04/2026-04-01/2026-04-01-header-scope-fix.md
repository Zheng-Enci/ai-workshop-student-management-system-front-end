# 2026-04-01 - 修复：header样式作用域问题

## 修复

- 修复 header 样式未生效问题
- 将 header 样式从 scoped 样式改为全局样式
- 将 DashboardPageDesktop.css 的导入也移至全局样式

### 问题原因

组件使用 `<style scoped>` 导致导入的 CSS 样式被加上作用域限制，header 元素无法匹配到带作用域的样式。

### 解决方案

将 header 样式和 DashboardPageDesktop.css 的导入改为全局 `<style>`，确保样式正确应用。
