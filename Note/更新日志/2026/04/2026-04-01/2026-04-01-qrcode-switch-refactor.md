# 2026-04-01 - 重构：提取二维码切换按钮样式到独立文件

## 重构

- 将二维码切换按钮样式提取到独立文件 `src/views/DashboardPage/css/desktop/qrcode-switch.css`
- 为所有样式类名添加 `qrcode-` 前缀，统一命名规范
- 更新 `DashboardPageDesktop.vue` 模板中的类名引用

### 变更的样式类名

- `.qr-switch-buttons` → `.qrcode-switch-buttons`
- `.qr-switch-btn` → `.qrcode-switch-btn`
- 暗色模式样式
- 响应式样式 - 768px 以下
