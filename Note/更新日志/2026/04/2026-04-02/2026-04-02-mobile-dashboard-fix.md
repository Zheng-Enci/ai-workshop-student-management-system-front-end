# 2026-04-02 移动端数据看板跳转修复

## 概述
修复移动端首页数据看板卡片点击无反应的问题。

## 变更内容

### 数据看板卡片跳转修复
- 将数据看板卡片的点击行为从显示提示信息改为跳转到 DashboardPage
- 使用 window.location.href 替代 router.push 解决移动端跳转不生效的问题

### 移动端 CSS 优化
- 为 .feature-card 添加 cursor: pointer 样式
- 添加 -webkit-tap-highlight-color: transparent 优化触摸体验
