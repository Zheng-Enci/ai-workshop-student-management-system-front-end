# 页面入场动画规范

## 概述

本规范定义了项目中所有页面入场动画的标准实现方式，以 RegisterPageDesktop 为基准示例。

## 动画设计原则

### 缓动函数

统一使用弹性缓动函数：

```css
cubic-bezier(0.34, 1.56, 0.64, 1)
```

该缓动函数产生自然的弹性效果，增强用户体验。

### 动画时长

- **页面容器**: 0.8s
- **顶部导航元素**: 0.5s - 0.6s
- **主要内容卡片**: 0.8s
- **表单元素**: 0.5s - 0.6s
- **按钮**: 0.6s

### 延迟策略

采用阶梯式延迟，营造层次感：

| 顺序 | 元素类型 | 建议延迟 |
|------|---------|---------|
| 1 | 页面容器 | 0s |
| 2 | 页面标题 | 0.05s |
| 3 | 左上角按钮 | 0.1s |
| 4 | 右上角Logo | 0.15s |
| 5 | 左侧展示图 | 0.2s |
| 6 | 右侧卡片 | 0.3s |
| 7 | 卡片头部 | 0.5s |
| 8 | 表单行1-4 | 0.6s - 0.9s |
| 9 | 密码等字段 | 1.0s - 1.1s |
| 10 | 主要按钮 | 1.2s |
| 11 | 底部链接 | 1.3s |

## 动画类型规范

### 1. 页面容器动画

**效果**: 淡入 + 轻微缩放

```css
.page-container {
	animation: page-fade-in 0.8s ease-out;
}

@keyframes page-fade-in {
	0% {
		opacity: 0;
		transform: scale(1.02);
	}
	100% {
		opacity: 1;
		transform: scale(1);
	}
}
```

### 2. 从左侧滑入

**适用**: 展示图片、左侧导航

```css
.element {
	animation: slide-from-left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
}

@keyframes slide-from-left {
	0% {
		opacity: 0;
		transform: translateX(-60px) scale(0.95);
	}
	100% {
		opacity: 1;
		transform: translateX(0) scale(1);
	}
}
```

### 3. 从右侧滑入

**适用**: 表单卡片、右侧内容

```css
.element {
	animation: slide-from-right 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both;
}

@keyframes slide-from-right {
	0% {
		opacity: 0;
		transform: translateX(80px) scale(0.95);
	}
	100% {
		opacity: 1;
		transform: translateX(0) scale(1);
	}
}
```

### 4. 从上方滑入

**适用**: 页面标题、欢迎语

```css
.element {
	animation: slide-from-top 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s both;
}

@keyframes slide-from-top {
	0% {
		opacity: 0;
		transform: translateY(-20px);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}
```

### 5. 从下方滑入

**适用**: 表单行、表单项

```css
.element {
	animation: slide-from-bottom 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s both;
}

@keyframes slide-from-bottom {
	0% {
		opacity: 0;
		transform: translateY(30px);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}
```

### 6. 缩放淡入

**适用**: 按钮、小元素

```css
.element {
	animation: scale-fade-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 1.2s both;
}

@keyframes scale-fade-in {
	0% {
		opacity: 0;
		transform: scale(0.8);
	}
	100% {
		opacity: 1;
		transform: scale(1);
	}
}
```

### 7. 旋转滑入

**适用**: Logo、图标

```css
.element {
	animation: rotate-slide-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
}

@keyframes rotate-slide-in {
	0% {
		opacity: 0;
		transform: translateX(30px) rotate(-15deg) scale(0.8);
	}
	100% {
		opacity: 1;
		transform: translateX(0) rotate(0deg) scale(1);
	}
}
```

## 完整示例

参考文件: `src/views/RegisterPage/desktop/css/RegisterPageDesktop.css`

## 注意事项

1. **使用 `both` 填充模式**: 确保动画开始前元素保持初始状态
2. **合理设置延迟**: 避免所有元素同时动画，营造层次感
3. **保持动画方向一致**: 左侧元素从左滑入，右侧元素从右滑入
4. **动画性能**: 优先使用 `transform` 和 `opacity` 属性
5. **可访问性**: 考虑 `prefers-reduced-motion` 媒体查询

```css
@media (prefers-reduced-motion: reduce) {
	*,
	*::before,
	*::after {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
	}
}
```
