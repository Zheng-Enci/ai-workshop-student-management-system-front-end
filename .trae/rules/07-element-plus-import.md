# Element Plus 按需导入规范

本项目使用 Element Plus **按需导入**方式，必须手动导入组件对应的样式文件。

## 导入规则

使用哪个组件，就必须导入对应的样式文件。路径格式为：

```
element-plus/theme-chalk/{组件名}.css
```

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

## 注意事项

1. **base.css 是基础样式**，每个使用 Element Plus 的文件都建议导入
2. 导入顺序：先 base.css，再按组件依赖顺序导入
3. 如果不确定需要哪些样式，可以参考同类型页面或组件的导入
4. 样式文件位于 `node_modules/element-plus/theme-chalk/` 目录下
