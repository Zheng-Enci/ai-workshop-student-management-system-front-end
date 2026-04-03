# 2026-04-02 NavigationPage 移动端 CSS 重构

## 概述
将 NavigationPage 移动端的 CSS 样式从单一文件抽取到独立的模块化文件中，保持与桌面端一致的代码组织方式。

## 变更内容

### 移动端 CSS 模块化
创建 `css/mobile/` 目录并新增以下文件：
- `background.css` - 背景效果样式（渐变球体、浮动动画）
- `header.css` - 头部样式（返回按钮、Logo、标题）
- `user-card.css` - 用户信息卡片样式（头像、名称、等级、考勤次数）
- `points-card.css` - 积分卡片样式（总积分、活动积分、签到积分）
- `navSections.css` - 导航区块容器样式（主内容、导航区域）
- `navSectionCard.css` - 导航卡片样式（区块头部、功能卡片）
- `footer.css` - 页脚样式（登出按钮）

### 引用更新
在 `NavigationPageMobile.vue` 中引入模块化 CSS 文件：
```css
@import './css/mobile/background.css';
@import './css/mobile/header.css';
@import './css/mobile/user-card.css';
@import './css/mobile/points-card.css';
@import './css/mobile/navSections.css';
@import './css/mobile/navSectionCard.css';
@import './css/mobile/footer.css';
```

### 其他修复
- 移动端首页数据看板卡片使用 window.location.href 解决跳转问题
- 为 .feature-card 添加 cursor: pointer 和 -webkit-tap-highlight-color 优化触摸体验
