# 2026-04-02 NavigationPage 移动端入场动画

## 概述
为 NavigationPage 移动端各个 CSS 模块添加入场动画效果。

## 变更内容

### 入场动画添加
按照桌面端的动画风格，为移动端各模块添加 fadeInUp 和 fadeInLeft 动画：

- `background.css` - 添加 fadeIn 动画
- `header.css` - 添加 fadeInDown 动画
- `user-card.css` - 添加 fadeInUp 动画（延迟 0.2s）
- `points-card.css` - 添加 fadeInUp 动画（延迟 0.3s）
- `navSections.css` - 添加 fadeInUp 动画（延迟 0.4s）
- `navSectionCard.css` - 添加 fadeInUp 和 fadeInLeft 动画
- `footer.css` - 添加 fadeInUp 动画（延迟 0.6s）

### 动画效果
- fadeIn: 从透明到完全显示
- fadeInDown: 从上方淡入
- fadeInUp: 从下方淡入（主要入场动画）
- fadeInLeft: 从左侧淡入（区块头部）
