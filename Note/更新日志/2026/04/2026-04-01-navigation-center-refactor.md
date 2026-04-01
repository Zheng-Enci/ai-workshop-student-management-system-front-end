# 2026-04-01 - 重构：提取 NavigationPage 用户卡片样式

## 重构

- 将用户卡片样式提取到 `src/views/NavigationPage/css/desktop/user-card.css`
- 为所有样式类名添加统一的 `user-card-` 前缀
- 更新 `NavigationPageDesktop.vue` 模板中的类名引用

### 提取的样式

- `.user-card-hub-layout` - 用户卡片枢纽布局
- `.user-card-info-card` - 用户信息卡片
- `.user-card-left-section` - 用户卡片左侧区域
- `.user-card-avatar` / `.user-card-avatar-image` / `.user-card-avatar-icon` / `.user-card-avatar-loading` - 头像相关
- `.user-card-user-info` / `.user-card-user-name` / `.user-card-user-level` - 用户信息
- `.user-card-attendance` - 考勤信息
- `.user-card-points-section` / `.user-card-points-grid` - 积分区域
- `.user-card-point-item` / `.user-card-point-icon` / `.user-card-point-info` - 积分项
- 响应式样式（768px 以下）
