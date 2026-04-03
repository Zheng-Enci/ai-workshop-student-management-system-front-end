# 2026-04-01 - 重构：底部进度条改用 el-progress 组件

## 重构

- 底部进度条从自定义 CSS 实现改为使用 Element Plus `<el-progress>` 组件
- 移除原有的 `footer-progress-bar` 和 `footer-progress-fill` 样式

### 变更内容

- 使用 `<el-progress>` 替代原生 div 实现
- 属性配置：
  - `:percentage="progressWidth"` - 进度百分比
  - `:show-text="false"` - 隐藏进度文字
  - `:stroke-width="4"` - 进度条高度
  - `color="#fff"` - 进度条颜色为白色
