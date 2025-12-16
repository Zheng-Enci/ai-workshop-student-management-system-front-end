# Element Plus 圆形按钮图标拉伸修复经验

## 问题
Element Plus 的 `circle` 按钮内的图标被拉伸成椭圆形。

## 原因
- 按钮容器缺少 `border-radius: 50%` 导致按钮本身不是圆形
- 按钮设置了固定宽高但未约束图标容器宽高比
- SVG 图标没有明确尺寸约束，被容器拉伸变形

## 解决方案
为按钮和图标容器添加完整的圆形和 flex 布局约束：

```css
.btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;  /* 关键：确保按钮是圆形 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.btn .el-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn .el-icon svg {
  width: 100%;
  height: 100%;
}
```

## 关键点
1. **必须**添加 `border-radius: 50%` 确保按钮是圆形
2. 按钮使用 flex 居中确保内容不偏移
3. 图标容器设置固定正方形尺寸
4. SVG 设置 100% 宽高填充容器且保持比例
