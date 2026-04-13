---
alwaysApply: true
---
# 命名约定
变量：ref驼峰 | 常量全大写下划线 | 布尔is/has/can | 事件on/handle | API函数驼峰 | 私有下划线前缀
# 页面文件
PageName+Page.vue | +PageDesktop.vue | +PageMobile.vue | +Page.css | +Page.js | +PageConfig.js | +PageUtils.js | +DataLoader.ts
# 表单组件文件
PageName+{功能名}DesktopForm.vue | +{功能名}MobileForm.vue
# API文件
AttendanceApi.ts/js | PointsApi.ts/js | attendance.js | points.js | StudentManagementApi.js | ChangePassword.ts/js
# CSS样式类名
## 通用规则
Vue组件文件的样式类名必须使用kebab-case格式，且前缀必须与文件名保持一致
例如：ProfilePageUploadAvatarDesktopForm.vue 的样式类名前缀为 profile-page-upload-avatar-desktop-form-*
## 入口页面特殊规则
PageName.vue 作为设备检测和路由跳转的入口页面，允许使用内联样式
类名前缀规则：
- LoginPage.vue → login-page-*
- ProfilePage.vue → profile-page-*
转换规则：文件名 PascalCase → 前缀 kebab-case
# 路由跳转规范
跳转只能访问页面入口文件，由入口文件决定前往desktop还是mobile
例如：跳转到/admin 而不是/admin/desktop
