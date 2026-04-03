# 2026-04-01 - 重构：为header样式添加header-前缀并提取到独立文件

## 重构

- 为 `header.css` 中所有样式类名添加 `header-` 前缀，避免样式冲突
- 将 header 区域样式提取到独立文件 `src/views/DashboardPage/css/desktop/header.css`
- 更新 `DashboardPageDesktop.vue` 模板中的类名引用
- 更新 `DashboardPageDesktop.css` 导入 header 样式

### 变更的样式类名

- `back-btn` → `header-back-btn`
- `logo` → `header-logo`
- `title-section` → `header-title-section`
- `slogan` → `header-slogan`
- `slogan-img` → `header-slogan-img`
