---
alwaysApply: false
description: 页面目录结构、入口文件规范、表单组件命名规则
---
# 页面结构
3个Vue文件：PageName.vue（入口）、PageNameDesktop.vue、PageNameMobile.vue
# 页面代码分离（重要）
Vue文件只保留<template>，TS代码抽到ts文件夹，CSS抽到css文件夹
例如：views/ProfilePage/ProfilePageMobile.vue → 只保留template
     views/ProfilePage/ts/ProfilePageMobile.ts → 抽离的TS代码
     views/ProfilePage/css/ProfilePageMobile.css → 抽离的样式
# 页面资源文件夹
除3个Vue文件外，其他资源放在desktop和mobile两个文件夹中
例如：views/ProfilePage/
     ├── ProfilePage.vue
     ├── ProfilePageDesktop.vue
     ├── ProfilePageMobile.vue
     ├── desktop/
     │   ├── css/           # 桌面端样式
     │   ├── forms/         # 桌面端表单组件
     │   ├── ts/            # 桌面端私有TS代码
     │   └── common/        # 桌面端公共代码（表单组件间共用）
     │       ├── js/        # 公用js文件，文件名加{page-name}-前缀
     │       ├── ts/        # 公用ts文件，文件名加{page-name}-前缀
     │       ├── css/       # 公用css文件，类名加{page-name}-前缀
     │       └── vue/       # 公用vue组件，文件名加{page-name}-前缀
     │       # 示例：desktop/common/ts/profile-page-util.ts
     └── mobile/
         ├── css/           # 移动端样式
         ├── forms/         # 移动端表单组件（含css子文件夹）
         ├── ts/            # 移动端私有TS代码
         └── common/        # 移动端公共代码（表单组件间共用）
             ├── js/        # 公用js文件，文件名加{page-name}-前缀
             ├── ts/        # 公用ts文件，文件名加{page-name}-前缀
             ├── css/       # 公用css文件，类名加{page-name}-前缀
             └── vue/       # 公用vue组件，文件名加{page-name}-前缀
             # 示例：mobile/common/ts/profile-page-util.ts
# 表单
forms/文件夹，desktop/mobile子文件夹，文件名+Form后缀
# 表单组件命名
表单组件文件名：{PageName}{功能名}DesktopForm.vue | {PageName}{功能名}MobileForm.vue
CSS前缀：{PageName}{功能名}Desktop-{类名} | {PageName}{功能名}Mobile-{类名}
# 表单组件模板
<script setup>
/** *******************************************************************
 * 名称 - 核心逻辑
 * 1. 功能
 ********************************************************************/

// ======================== 导入 ========================
// ======================== 组件 ========================
// ======================== 常量 ========================
// ======================== 状态 ========================
// ======================== 计算属性 ========================
// ======================== 方法 ========================
// ======================== 生命周期 ========================
</script>

<template></template>
# 表单CSS
表单组件的CSS必须写在表单所在文件夹的css子文件夹中，导入时使用相对路径
例如：forms/desktop/ProfilePageUploadAvatarDesktopForm.vue 对应 forms/desktop/css/ProfilePageUploadAvatarDesktopForm.css
导入方式：import '@/views/ProfilePage/forms/desktop/css/ProfilePageUploadAvatarDesktopForm.css'
# 组件模板
<script setup>
/** *******************************************************************
 * 名称 - 核心逻辑
 * 1. 功能
 ********************************************************************/

// ======================== 导入 ========================
// ======================== 组件 ========================
// ======================== 常量 ========================
// ======================== 状态 ========================
// ======================== 计算属性 ========================
// ======================== 方法 ========================
// ======================== 生命周期 ========================
</script>

<template></template>
# CSS
BEM/kebab命名 | -desktop/-mobile后缀 | 类名前缀：{文件名}-{类名}
