# ECharts夜间模式最佳实践

## 问题描述
数据看板页面排行榜在夜间模式下，鼠标悬停显示的学生信息tooltip不可见，表现为白色背景配白色文字。

## 问题分析
ECharts的tooltip配置缺少夜间模式下的背景色和文字颜色设置，导致在夜间模式下使用默认的白色背景和白色文字，造成文字不可见。

## 解决方案

### 1. Tooltip配置修复
在ECharts的option配置中，为tooltip添加完整的夜间模式支持：

```javascript
const isDark = themeStore.isDarkMode

const option = {
  tooltip: {
    trigger: 'axis', // 或 'item'
    axisPointer: {
      type: 'shadow'
    },
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
    textStyle: {
      color: isDark ? '#ffffff' : '#2c3e50'
    },
    formatter: function(params) {
      // 自定义格式化函数
    }
  }
}
```

### 2. 关键配置项说明
- **backgroundColor**: 夜间模式使用深色半透明背景，白天模式使用白色半透明背景
- **borderColor**: 夜间模式使用白色边框，白天模式使用深色边框
- **textStyle.color**: 夜间模式使用白色文字，白天模式使用深色文字

### 3. 颜色值参考
- 夜间模式背景：`rgba(30, 41, 59, 0.95)` (深蓝灰色)
- 夜间模式边框：`rgba(255, 255, 255, 0.2)` (半透明白色)
- 夜间模式文字：`#ffffff` (纯白色)
- 白天模式背景：`rgba(255, 255, 255, 0.95)` (半透明白色)
- 白天模式边框：`rgba(0, 0, 0, 0.1)` (半透明黑色)
- 白天模式文字：`#2c3e50` (深灰色)

## 最佳实践

### 1. 统一配置模式
所有ECharts图表都应使用相同的tooltip配置模式，确保夜间模式一致性。

### 2. 主题状态检测
使用`themeStore.isDarkMode`检测当前主题状态，确保配置与主题同步。

### 3. 透明度设置
背景色使用0.95透明度，既保证可读性又保持视觉层次。

### 4. 边框处理
边框颜色与背景形成对比，增强tooltip的视觉边界。

## 常见问题

### 1. Tooltip文字不可见
**原因**: 缺少textStyle.color配置
**解决**: 添加textStyle.color设置

### 2. Tooltip背景不协调
**原因**: 使用固定背景色
**解决**: 根据主题动态设置背景色

### 3. 边框不明显
**原因**: 边框颜色与背景色对比度不够
**解决**: 调整边框透明度或颜色

## 代码示例

### 完整配置示例
```javascript
const initChart = (data) => {
  const isDark = themeStore.isDarkMode
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      textStyle: {
        color: isDark ? '#ffffff' : '#2c3e50'
      },
      formatter: '{b}: {c}人'
    },
    // 其他配置...
  }
  
  chartInstance.setOption(option)
}
```

## 移动端白天模式文字显示问题修复

### 问题描述
数据看板页面手机端白天模式下，饼图的legend文字不可见，表现为白色文字在浅色背景上无法辨认。

### 问题分析
1. **CSS变量固定化**：手机端页面使用了固定的CSS变量 `--text-primary: white`，导致白天模式下所有文字都是白色
2. **背景颜色不匹配**：白天模式使用了浅色渐变背景，但文字颜色没有相应调整
3. **主题检测缺失**：页面样式没有根据主题状态动态调整文字颜色

### 解决方案

#### 1. 修复CSS变量配置
```css
:root {
  --bg-gradient: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  --card-bg: rgba(255, 255, 255, 0.9);
  --card-border: rgba(0, 0, 0, 0.1);
  --text-primary: #1e293b; /* 白天模式使用深色文字 */
  --text-secondary: #64748b;
  --header-bg: rgba(255, 255, 255, 0.9);
  --header-border: rgba(0, 0, 0, 0.1);
}

.dark {
  --bg-gradient: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  --card-bg: rgba(255, 255, 255, 0.05);
  --card-border: rgba(255, 255, 255, 0.1);
  --text-primary: #e0e0e0; /* 夜间模式使用浅色文字 */
  --text-secondary: rgba(224, 224, 224, 0.7);
  --header-bg: rgba(255, 255, 255, 0.05);
  --header-border: rgba(255, 255, 255, 0.1);
}
```

#### 2. 关键修复要点
- **白天模式**：使用深色文字 `#1e293b` 配浅色背景
- **夜间模式**：使用浅色文字 `#e0e0e0` 配深色背景
- **背景适配**：白天模式使用浅色渐变，夜间模式使用深色渐变
- **对比度保证**：确保文字与背景有足够的对比度

### 修复效果
- ✅ 白天模式下饼图legend文字清晰可见
- ✅ 夜间模式下文字显示正常
- ✅ 主题切换时文字颜色正确更新
- ✅ 整体视觉效果协调统一

## 注意事项
1. 确保themeStore正确导入和使用
2. 在主题切换时重新初始化图表
3. 保持所有图表的tooltip样式一致性
4. 测试不同主题下的显示效果
5. **移动端适配**：确保移动端CSS变量与主题状态同步
6. **颜色对比度**：保证文字与背景有足够的对比度
