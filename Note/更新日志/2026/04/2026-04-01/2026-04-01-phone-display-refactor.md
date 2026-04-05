# 2026-04-01 - 重构：提取手机展示区域样式到独立文件

## 重构

- 将手机展示区域样式提取到独立文件 `src/views/DashboardPage/css/desktop/phone-display.css`
- 为所有样式类名添加 `phone-display` 前缀，统一命名规范
- 更新 `DashboardPageDesktop.vue` 模板中的类名引用

### 变更的样式类名

- `.phone-display` → `.phone-display-container`
- `.phone-image` 保留在 qrcode.css 中作为 `.qrcode-phone-image`
- 响应式样式 - 1200px 和 768px 以下隐藏手机展示区域
