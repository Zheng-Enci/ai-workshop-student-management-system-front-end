# 2026-04-02 NavigationPage 桌面端 CSS 类名重构

## 概述
为 `NavigationPage/css/desktop` 目录下所有 CSS 文件中的样式名添加 `navigation-desktop-` 前缀，确保样式名与文件名保持一致。

## 变更内容

### CSS 文件样式名更新
- `navigation-desktop-header.css` - 添加 `navigation-desktop-header-` 前缀
- `navigation-desktop-navSections.css` - 添加 `navigation-desktop-navSections-` 前缀
- `navigation-desktop-navSectionPersonal.css` - 添加 `navigation-desktop-navSectionPersonal-` 前缀
- `navigation-desktop-navSectionData.css` - 添加 `navigation-desktop-navSectionData-` 前缀
- `navigation-desktop-navSectionAdmin.css` - 添加 `navigation-desktop-navSectionAdmin-` 前缀
- `navigation-desktop-navSectionCard.css` - 添加 `navigation-desktop-navSectionCard-` 前缀
- `navigation-desktop-user-card.css` - 添加 `navigation-desktop-user-card-` 前缀

### Vue 组件 class 更新
更新 `NavigationPageDesktop.vue` 中的所有 class 属性：
- `.header-container` → `.navigation-desktop-header-container`
- `.header-top` → `.navigation-desktop-header-top`
- `.header-left` → `.navigation-desktop-header-left`
- `.header-home-btn` → `.navigation-desktop-header-home-btn`
- `.header-logo` → `.navigation-desktop-header-logo`
- `.header-title-section` → `.navigation-desktop-header-title-section`
- `.header-center` → `.navigation-desktop-header-center`
- `.header-right` → `.navigation-desktop-header-right`
- `.header-page-title-wrapper` → `.navigation-desktop-header-page-title-wrapper`
- `.header-page-title` → `.navigation-desktop-header-page-title`
- `.header-logout-btn` → `.navigation-desktop-header-logout-btn`
- `.user-card-hub-layout` → `.navigation-desktop-user-card-hub-layout`
- `.user-card-info-card` → `.navigation-desktop-user-card-info-card`
- `.user-card-left-section` → `.navigation-desktop-user-card-left-section`
- `.user-card-avatar` → `.navigation-desktop-user-card-avatar`
- `.user-card-avatar-image` → `.navigation-desktop-user-card-avatar-image`
- `.user-card-avatar-icon` → `.navigation-desktop-user-card-avatar-icon`
- `.user-card-avatar-loading` → `.navigation-desktop-user-card-avatar-loading`
- `.user-card-user-info` → `.navigation-desktop-user-card-user-info`
- `.user-card-user-name` → `.navigation-desktop-user-card-user-name`
- `.user-card-user-level` → `.navigation-desktop-user-card-user-level`
- `.level-icon` → `.navigation-desktop-user-card-level-icon`
- `.user-card-attendance` → `.navigation-desktop-user-card-attendance`
- `.attendance-icon` → `.navigation-desktop-user-card-attendance-icon`
- `.user-card-points-section` → `.navigation-desktop-user-card-points-section`
- `.user-card-points-grid` → `.navigation-desktop-user-card-points-grid`
- `.user-card-point-icon` → `.navigation-desktop-user-card-point-icon`
- `.user-card-point-info` → `.navigation-desktop-user-card-point-info`
- `.user-card-point-label` → `.navigation-desktop-user-card-point-label`
- `.user-card-point-value` → `.navigation-desktop-user-card-point-value`
- `.loading-gif` → `.navigation-desktop-user-card-loading-gif`
- `.navSections` → `.navigation-desktop-navSections`
- `.navSectionPersonal` → `.navigation-desktop-navSectionPersonal`
- `.navSectionPersonal-header` → `.navigation-desktop-navSectionPersonal-header`
- `.navSectionPersonal-title` → `.navigation-desktop-navSectionPersonal-title`
- `.navSectionPersonal-icon` → `.navigation-desktop-navSectionPersonal-icon`
- `.navSectionPersonal-divider` → `.navigation-desktop-navSectionPersonal-divider`
- `.navSectionData` → `.navigation-desktop-navSectionData`
- `.navSectionData-header` → `.navigation-desktop-navSectionData-header`
- `.navSectionData-title` → `.navigation-desktop-navSectionData-title`
- `.navSectionData-icon` → `.navigation-desktop-navSectionData-icon`
- `.navSectionData-divider` → `.navigation-desktop-navSectionData-divider`
- `.navSectionAdmin` → `.navigation-desktop-navSectionAdmin`
- `.navSectionAdmin-header` → `.navigation-desktop-navSectionAdmin-header`
- `.navSectionAdmin-title` → `.navigation-desktop-navSectionAdmin-title`
- `.navSectionAdmin-icon` → `.navigation-desktop-navSectionAdmin-icon`
- `.navSectionAdmin-divider` → `.navigation-desktop-navSectionAdmin-divider`
- `.navSection-grid` → `.navigation-desktop-navSectionCard-grid`
- `.navSection-card` → `.navigation-desktop-navSectionCard-card`
- `.navSection-card-icon` → `.navigation-desktop-navSectionCard-card-icon`
- `.navSection-content` → `.navigation-desktop-navSectionCard-content`
- `.navSection-label` → `.navigation-desktop-navSectionCard-label`
- `.navSection-description` → `.navigation-desktop-navSectionCard-description`

## 提交信息
```
refactor: NavigationPage desktop CSS class naming with navigation-desktop prefix
```
