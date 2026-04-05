# 2026-04-01 - 重构：提取二维码区域样式到独立文件

## 重构

- 将二维码区域样式提取到独立文件 `src/views/DashboardPage/css/desktop/qrcode.css`
- 为所有样式类名添加 `qrcode-` 前缀，统一命名规范
- 更新 `DashboardPageDesktop.vue` 模板中的类名引用

### 变更的样式类名

- `.qr-section` → `.qrcode-section`
- `.website-qr-section` → `.qrcode-website-section`
- `.wechat-qr-section` → `.qrcode-wechat-section`
- `.qr-code` → `.qrcode-code`
- `.website-qr-code` → `.qrcode-website-code`
- `.qr-text` → `.qrcode-text`
- `.website-qr-text` → `.qrcode-website-text`
- `.phone-image` → `.qrcode-phone-image`
- 暗色模式样式
- 响应式样式 - 768px 以下
