# 2026-04-01 - 重构：提取 NavigationPage 中心区域样式

## 重构

- 将中心区域样式提取到 `src/views/NavigationPage/css/desktop/center.css`
- 为所有样式类名添加统一的 `center-` 前缀
- 更新 `NavigationPageDesktop.vue` 模板中的类名引用

### 提取的样式

- `.center-hub-layout` - 中心枢纽布局
- `.center-info-card` - 中心信息卡片
- `.center-left-section` - 中心左侧区域
- `.center-avatar` / `.center-avatar-image` / `.center-avatar-icon` / `.center-avatar-loading` - 头像相关
- `.center-user-info` / `.center-user-name` / `.center-user-level` - 用户信息
- `.center-attendance` - 考勤信息
- `.center-points-section` / `.center-points-grid` - 积分区域
- `.center-point-item` / `.center-point-icon` / `.center-point-info` - 积分项
- 响应式样式（768px 以下）
