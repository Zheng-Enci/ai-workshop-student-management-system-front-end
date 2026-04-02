# 2026-04-02 移动端导航页面类名重构

## 概述
重构 NavigationPageMobile.vue 的 CSS 类名，统一使用 `navSection-` 前缀，提高代码语义性和一致性。

## 变更内容

### 类名重构
将所有 `card-` 前缀的类名改为 `navSection-card-` 前缀：

- `card-background` → `navSection-card-bg`
- `card-content` → `navSection-card-content`
- `card-icon` → `navSection-card-icon`
- `card-text` → `navSection-card-text`
- `card-arrow` → `navSection-card-arrow`

### 结构优化
- `feature-card` → `navSection-card`
- `feature-grid` → `navSection-grid`
- `nav-section` → `navSection-item`
- `section-header` → `navSection-header`
- `section-title` → `navSection-title`
- `section-divider` → `navSection-divider`

### 其他类名
- `gradient-orb` → `background-orb-*`
- `header` → `header-container`
- `user-profile` → `user-card-profile`
- `points-display` → `points-card-display`
