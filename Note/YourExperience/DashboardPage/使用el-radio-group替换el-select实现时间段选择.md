# DashboardPage - 使用 el-radio-group 替换 el-select 实现时间段选择

## 问题背景

使用 `el-select` 实现时间段选择时，出现"最近30天"和"自定义"选项点击无反应的问题。经过多次CSS修复尝试仍未解决，最终决定更换组件实现。

## 联网学习总结（10个内容）

### 1. Element Plus el-radio-group 组件
- `el-radio-group` 是单选按钮组组件
- 配合 `el-radio-button` 可以实现按钮样式的单选
- 事件处理更可靠，不依赖下拉菜单的事件机制

### 2. el-radio-button 按钮样式
- `el-radio-button` 提供按钮样式的单选选项
- 支持 `size` 属性设置大小
- 选中状态有明显的视觉反馈

### 3. 组件替换的优势
- **事件可靠性**：不依赖下拉菜单的事件处理机制
- **用户体验**：所有选项直接可见，无需点击下拉
- **样式控制**：更容易自定义样式，不会出现点击失效问题

### 4. v-model 绑定
- `el-radio-group` 使用 `v-model` 绑定选中值
- `el-radio-button` 使用 `label` 属性设置值
- 值变化时自动触发 `@change` 事件

### 5. 响应式布局
- 使用 `flex-wrap: wrap` 实现选项自动换行
- 移动端和桌面端可以有不同的布局方式
- 适应不同屏幕尺寸

### 6. 样式自定义
- 可以自定义选中和未选中状态的样式
- 支持暗色模式适配
- 不需要处理下拉菜单的样式问题

### 7. 按需导入组件
- 需要导入 `ElRadioGroup` 和 `ElRadioButton`
- 需要导入对应的样式文件
- 移除不再使用的 `ElSelect` 和 `ElOption`

### 8. 事件处理
- `@change` 事件在值变化时触发
- 事件参数是新的选中值
- 处理逻辑与 `el-select` 相同

### 9. 移动端适配
- 移动端可以使用更小的按钮尺寸
- 可以调整间距和字体大小
- 保持与桌面端一致的功能逻辑

### 10. 代码简化
- 不需要处理下拉菜单的样式
- 不需要处理点击事件失效问题
- 代码更简洁，维护更容易

## 实现方案

### 1. 更新组件导入

**位置**：`src/views/DashboardPage/DashboardPageDesktop.vue` 第224-232行

**修改**：
```javascript
import { ElMessage, ElButton, ElIcon, ElRadioGroup, ElRadioButton, ElInputNumber, ElDatePicker } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-radio-group.css'
import 'element-plus/theme-chalk/el-radio-button.css'
import 'element-plus/theme-chalk/el-input-number.css'
import 'element-plus/theme-chalk/el-date-picker.css'
```

**移除**：
- `ElSelect` 和 `ElOption` 组件导入
- `el-select.css`、`el-option.css`、`el-select-dropdown.css` 样式导入

### 2. 更新模板代码

**位置**：`src/views/DashboardPage/DashboardPageDesktop.vue` 第27-44行

**修改**：
```vue
<div class="time-range-selector">
  <el-radio-group 
    v-model="selectedTimeRange" 
    @change="handleTimeRangeChange"
    size="small"
    class="time-radio-group"
  >
    <el-radio-button
      v-for="option in timeRangeOptions"
      :key="option.value"
      :label="option.value"
    >
      {{ option.label }}
    </el-radio-button>
  </el-radio-group>
</div>
```

### 3. 更新样式

**位置**：`src/views/DashboardPage/DashboardPageDesktop.vue` 第2002-2088行

**移除**：所有 `.time-select-dropdown` 相关样式

**添加**：
```css
.time-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.time-radio-group .el-radio-button {
  margin: 0;
}

.time-radio-group .el-radio-button__inner {
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 13px;
}

.time-radio-group .el-radio-button__original-radio:checked + .el-radio-button__inner {
  background-color: #409eff;
  border-color: #409eff;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

html.dark .time-radio-group .el-radio-button__inner {
  background-color: #1e293b;
  border-color: #334155;
  color: #e2e8f0;
}

html.dark .time-radio-group .el-radio-button__original-radio:checked + .el-radio-button__inner {
  background-color: #667eea;
  border-color: #667eea;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}
```

### 4. Mobile 版本修复

**位置**：`src/views/DashboardPage/DashboardPageMobile.vue`

**修改**：
- 更新组件导入（第113行）
- 更新模板代码（第64-73行）
- 更新样式（第1029-1109行）
- 应用相同的修复方案

### 5. 移除 watch 监听（可选）

**位置**：`src/views/DashboardPage/DashboardPageDesktop.vue` 第628-638行

由于 `el-radio-group` 的事件处理更可靠，可以移除之前添加的 `watch` 监听作为备选方案。

## 修复要点

### 1. 组件选择
- **el-radio-group**：更适合选项较少且需要直接可见的场景
- **事件可靠性**：不依赖下拉菜单的事件处理机制
- **用户体验**：所有选项直接可见，操作更直观

### 2. 样式设计
- **响应式布局**：使用 `flex-wrap: wrap` 实现自动换行
- **视觉反馈**：选中状态有明显的颜色和阴影变化
- **暗色模式**：适配暗色模式的主题色

### 3. 代码简化
- **移除复杂样式**：不需要处理下拉菜单的样式问题
- **事件处理**：使用标准的 `@change` 事件即可
- **维护性**：代码更简洁，更容易维护

## 符合技术指令要求

✅ **按需导入**：使用按需导入方式  
✅ **样式文件导入**：导入了所有必要的样式文件  
✅ **组件替换**：使用更可靠的组件实现功能  
✅ **代码规范**：符合 ESLint 规范  
✅ **功能保障**：确保所有选项都能正常点击和使用  
✅ **用户体验**：改善交互体验，所有选项直接可见  

## 相关文件

- `src/views/DashboardPage/DashboardPageDesktop.vue`
- `src/views/DashboardPage/DashboardPageMobile.vue`

