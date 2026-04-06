---
alwaysApply: false
description: 使用Element库的时候必须阅读本文件
---
# Element Plus 按需导入规范

本项目使用 Element Plus **按需导入**方式，必须手动导入组件对应的样式文件。

## 导入规则

使用哪个组件，就必须导入对应的样式文件。

## 示例

```js
// 导入 Vue 核心和 Element Plus 消息组件
import { ElMessage } from 'element-plus'

// 必须导入对应的样式文件
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-message.css'
```

```js
// 表单组件示例
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'

import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
```

```js
// 对话框组件示例
import { ElDialog, ElOverlay } from 'element-plus'

import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-overlay.css'
```
