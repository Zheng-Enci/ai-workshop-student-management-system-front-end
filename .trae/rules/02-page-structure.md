---
alwaysApply: false
description: 页面目录结构、入口文件规范、表单组件命名规则
---
# 页面结构
3个Vue文件：PageName.vue（入口）、PageNameDesktop.vue、PageNameMobile.vue
# 页面代码分离（重要）
## 入口页面（PageName.vue）
作为设备检测和路由跳转的入口页面，允许将TS代码、CSS样式与Template写在同一个Vue文件中
要求：
1. CSS类名必须使用文件名作为前缀（kebab-case）
2. 例如：LoginPage.vue 的类名前缀为 login-page-*
3. 例如：ProfilePage.vue 的类名前缀为 profile-page-*
## 路由目标页面（PageNameDesktop.vue / PageNameMobile.vue）
作为路由跳转目标的页面，TS代码、CSS样式必须分离到对应文件夹
例如：views/ProfilePage/ProfilePageDesktop.vue → 只保留template
     views/ProfilePage/desktop/ts/ProfilePageDesktop.ts → 抽离的TS代码
     views/ProfilePage/desktop/css/ProfilePageDesktop.css → 抽离的样式
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
     │       ├── js/        # 公用js文件，文件名格式：{page-name}-common-{具体功能}.js，页面名在前面
     │       ├── ts/        # 公用ts文件，文件名格式：{page-name}-common-{具体功能}.ts，页面名在前面
     │       ├── css/       # 公用css文件，类名格式：{page-name}-common-{具体功能}-类名，页面名在前面
     │       └── vue/       # 公用vue组件，文件名格式：{page-name}-common-{具体功能}.vue，页面名在前面
     │       # 示例：desktop/common/ts/profile-page-common-util.ts
     └── mobile/
         ├── css/           # 移动端样式
         ├── forms/         # 移动端表单组件（含css子文件夹）
         ├── ts/            # 移动端私有TS代码
         └── common/        # 移动端公共代码（表单组件间共用）
             ├── js/        # 公用js文件，文件名格式：{page-name}-common-{具体功能}.js，页面名在前面
             ├── ts/        # 公用ts文件，文件名格式：{page-name}-common-{具体功能}.ts，页面名在前面
             ├── css/       # 公用css文件，类名格式：{page-name}-common-{具体功能}-类名，页面名在前面
             └── vue/       # 公用vue组件，文件名格式：{page-name}-common-{具体功能}.vue，页面名在前面
             # 示例：mobile/common/ts/profile-page-common-util.ts
# 表单
forms/文件夹，desktop/mobile子文件夹，文件名+Form后缀
表单TS代码放在forms/ts/子文件夹中
表单CSS放在forms/css/子文件夹中
# 表单目录结构
## 桌面端
forms/
├── xxxDesktopForm.vue      # Vue组件
├── ts/
│   └── xxxDesktopForm.ts  # TS逻辑
└── css/
    └── xxxDesktopForm.css  # CSS样式
## 移动端
forms/
├── xxxMobileForm.vue       # Vue组件
├── ts/
│   └── xxxMobileForm.ts   # TS逻辑
└── css/
    └── xxxMobileForm.css   # CSS样式
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
