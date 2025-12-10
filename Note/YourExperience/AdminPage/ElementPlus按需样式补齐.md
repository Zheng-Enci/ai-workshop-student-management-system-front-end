# AdminPage - Element Plus 按需样式补齐经验

## 场景
超级管理员页面使用了多种 Element Plus 弹窗/表单/分页组件，但未按需导入对应样式，导致弹窗、分页、表单项等样式缺失或错乱。

## 缺失项
- el-dialog
- el-form / el-form-item
- el-pagination
- el-tooltip
- el-input-number
- el-date-picker
- el-button-group（配合按钮组）

## 解决方案
在 `src/views/AdminPage/AdminConsolePage.vue` 中补充按需样式引入（保持与现有按需风格一致）：
- `import 'element-plus/theme-chalk/el-dialog.css'`
- `import 'element-plus/theme-chalk/el-form.css'`
- `import 'element-plus/theme-chalk/el-form-item.css'`
- `import 'element-plus/theme-chalk/el-pagination.css'`
- `import 'element-plus/theme-chalk/el-tooltip.css'`
- `import 'element-plus/theme-chalk/el-input-number.css'`
- `import 'element-plus/theme-chalk/el-date-picker.css'`
- `import 'element-plus/theme-chalk/el-button-group.css'`

## 影响
补齐后考勤记录弹窗、补卡表单、分页、tooltip、数字输入与日期选择器样式正常加载，避免渲染错乱。

## 注意
- 继续遵循按需引入，避免全量导入。
- 新增组件时同步补充对应样式，保持一致性。*** End Patch

