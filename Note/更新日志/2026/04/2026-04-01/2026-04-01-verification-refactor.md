# 2026-04-01 - 重构：提取验证码卡片样式到独立文件

## 重构

- 将验证码卡片样式提取到独立文件 `src/views/DashboardPage/css/desktop/verification.css`
- 更新 `DashboardPageDesktop.vue` 导入新的 CSS 文件

### 变更的样式

- `.verification-code-card` - 验证码卡片容器
- `.verification-code-label` - 验证码标签
- `.verification-code-value` - 验证码值
- `.verification-code-value span` - 验证码值中的 span
- `.verification-code-value .error-text` - 错误文本
- `.dark .verification-code-card` - 暗色模式卡片
- `.dark .verification-code-value` - 暗色模式值
- 响应式样式 - 768px 以下
