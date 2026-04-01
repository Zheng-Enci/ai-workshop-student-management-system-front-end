# 2026-04-01 - 重构：提取二维码区域样式到独立文件

## 重构

- 将二维码区域样式提取到独立文件 `src/views/DashboardPage/css/desktop/qrcode.css`
- 更新 `DashboardPageDesktop.vue` 导入新的 CSS 文件

### 变更的样式

- `.qr-section` - 二维码区域容器
- `.website-qr-section` - 网站二维码区域
- `.wechat-qr-section` - 微信二维码区域
- `.qr-code` - 二维码图片
- `.website-qr-code` - 网站二维码图片
- `.qr-text` - 二维码文本
- `.website-qr-text` - 网站二维码文本
- `.phone-image` - 手机图片
- 暗色模式样式
- 响应式样式 - 768px 以下
