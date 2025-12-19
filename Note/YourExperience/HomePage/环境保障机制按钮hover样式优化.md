# 环境保障机制按钮hover样式优化

## 核心样式
```css
.environment-policy-button:hover {
  transform: translateY(-2px);
  border-color: var(--primary-color);
  box-shadow: 0 12px 40px var(--shadow-hover);
}
```

## 关键要点
- **性能优化**：用transform代替位置属性，启用GPU加速
- **玻璃拟态**：backdrop-filter: blur(20px)实现毛玻璃效果
- **主题适配**：全用CSS变量，支持白天/夜间模式
- **微交互**：hover上移2px，active快速回弹

## 实现位置
- `src/views/HomePage/HomePageDesktop.vue` 末尾样式区