# AdminPage - FullCalendar 接入考勤记录

## 需求
将考勤记录月视图改为 FullCalendar 实现，支持月视图展示，按需引入依赖，保持弹窗居中与遮罩。

## 实现
- 依赖：`@fullcalendar/core`、`@fullcalendar/daygrid`、`@fullcalendar/interaction`、`@fullcalendar/vue3`，样式 `@fullcalendar/daygrid/main.css`。
- 组件：`<FullCalendar :options="calendarOptions" />`。
- 配置：plugins 为 dayGrid、interaction；`initialView: 'dayGridMonth'`；`locale: 'zh-cn'`；`dayMaxEventRows: true`；`height: 620`。
- 数据：从考勤记录映射事件 `{ id, title, start, allDay: true }`，使用 `attendanceDateTime`。
- 弹窗：保留 `modal-class` 与 scoped `:deep` 样式，确保遮罩和对话框居中；`append-to-body`、`teleported`、`v-if`+`v-model` 组合控制渲染。

## 注意
- 按需引入，遵循项目第三方库使用规则，禁止全量导入。
- `modal-class` 生成的 overlay 无 scope，样式需用顶层 `:deep(.xxx-overlay)` 命中。
- 事件起始时间需要可解析的 ISO 字符串。***

## 按需导入常见问题与排查方法
- **核心经验**：从全量导入改为按需导入后，容易出现遗漏导入的问题，导致页面出现 bug。**关键排查方法：查看浏览器控制台的警告和错误信息，根据提示补充缺失的导入。**
- **Element Plus 组件遗漏**：若出现 `Failed to resolve component: el-xxx` 错误，说明组件未导入，需从 `element-plus` 导入对应组件（如 `ElCalendar`、`ElDialog` 等）并导入相应样式文件。
- **ECharts 组件遗漏**：若出现 `[ECharts] Component xxx is used but not imported` 或 `[ECharts] Series xxx is used but not imported` 警告，需导入对应组件（如 `VisualMapComponent`、`HeatmapChart` 等）并在 `echarts.use()` 中注册。
- **排查步骤**：
  1. 打开浏览器开发者工具控制台
  2. 查看警告（Warning）和错误（Error）信息
  3. 根据错误提示找到缺失的组件或模块
  4. 补充相应的导入语句
  5. 刷新页面验证问题是否解决
- **预防措施**：在开发新功能时，建议先查看第三方库的文档，了解需要导入哪些组件，避免遗漏。

## 兼容性补充
- daygrid 样式需使用 `@fullcalendar/daygrid/index.css`，新版包未导出 `main.css`，错误路径会触发构建期模块未找到。
- 若包本身不携带样式导出，可在页面 `<style>` 顶部直接 `@import url('https://unpkg.com/@fullcalendar/daygrid@6.1.19/index.css');`，避免新增本地样式文件。
- 若运行时报错 `Cannot find module '@fullcalendar/core/internal.js'`，可在 `vue.config.js` 为 webpack 增加别名：`'@fullcalendar/core/internal.js'` 与 `'@fullcalendar/core/internal'` 指向 `node_modules/@fullcalendar/core/internal.js`。

## Element Plus Calendar 替代方案
- 当要求改为使用 Element Plus Calendar 时，可直接 `<el-calendar v-model="calendarValue">` 搭配 `date-cell` 插槽渲染自定义单元格。
- 通过 `getDateAttendanceTimes(date)` 和 `getTimePeriodClass(time)` 判定早/午/晚状态，设置 `calendarSlots = [{ key:'morning', label:'早' }, ...]`，并用 `isSlotSigned(date, slot)` 高亮。
- `isSlotSigned` 函数中应使用 `getTimePeriodClass(time)` 而非不存在的 `getTimePeriod`，避免 ESLint no-undef 报错。
- 弹窗列表可复用现有 `selectedDate` 与 `showDateDetailsDialog`，点击单元格调用 `openDateDetails(data.day)`。
- **组件导入注意**：使用 Element Plus 组件时，必须同时导入组件和样式。组件需从 `element-plus` 导入（如 `ElCalendar`、`ElDialog`、`ElForm`、`ElFormItem`、`ElPagination`、`ElTooltip`、`ElInputNumber`、`ElDatePicker`、`ElIcon`），样式需从 `element-plus/theme-chalk/el-xxx.css` 导入。若运行时出现 "Failed to resolve component" 错误，检查是否遗漏组件导入。特别注意：使用 `<el-icon>` 时，即使只使用图标（如 `Lock`），也必须导入 `ElIcon` 组件本身，不能只导入图标。
- **中文化配置**：为 Element Plus Calendar 和 DatePicker 组件添加中文显示，需导入中文语言包 `import zhCn from 'element-plus/es/locale/lang/zh-cn'`，并在组件上设置 `:locale="zhCn"` 属性。同时，为日历星期显示添加 CSS 覆盖：`.attendance-calendar-admin :deep(.el-calendar-table thead th) { font-size: 0; }` 配合 `::after` 伪元素设置中文星期（周日、周一...周六），确保星期显示为中文。
- **日历导航按钮中文化**：Element Plus Calendar 默认的导航按钮为英文（Previous Month、Today、Next Month），需要通过自定义 header 模板替换为中文。使用 `<template #header="{ date }">` 插槽，添加"上个月"、"今天"、"下个月"按钮，并实现 `prevMonth()`、`nextMonth()`、`goToday()` 函数来切换月份，以及 `formatCalendarTitle(date)` 函数来格式化显示年月标题。

## ECharts 按需导入
- **按需导入原则**：遵循项目第三方库使用规则，禁止全量导入 ECharts，必须按需导入所需组件。
- **热力图导入**：使用热力图（heatmap）时，需导入 `HeatmapChart` 从 `echarts/charts`，并在 `echarts.use()` 中注册。
- **VisualMap 组件导入**：使用 `visualMap` 配置项时，需导入 `VisualMapComponent` 从 `echarts/components`，并在 `echarts.use()` 中注册。
- **完整导入示例**：
  ```javascript
  import * as echarts from 'echarts/core'
  import { BarChart, LineChart, HeatmapChart } from 'echarts/charts'
  import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    VisualMapComponent
  } from 'echarts/components'
  import { CanvasRenderer } from 'echarts/renderers'
  echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    VisualMapComponent,
    BarChart,
    LineChart,
    HeatmapChart,
    CanvasRenderer
  ])
  ```
- **错误提示**：若运行时出现 `[ECharts] Component visualMap is used but not imported` 或 `[ECharts] Series heatmap is used but not imported` 警告，检查是否遗漏了相应的组件导入和注册。

## Element Plus DatePicker 美化
- **图标添加**：使用 `prefix-icon` 插槽添加日历图标，提升视觉识别度：`<template #prefix-icon><el-icon><Calendar /></el-icon></template>`
- **样式美化要点**：
  - 圆角：设置 `border-radius: 10px` 使边框更柔和
  - 边框：使用 `border: 2px solid` 增加边框粗细，默认颜色 `#e5e7eb`
  - 阴影：添加轻微阴影 `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05)` 增加层次感
  - 过渡效果：使用 `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` 实现平滑过渡
  - 悬停效果：悬停时改变边框颜色和阴影 `border-color: #F59E0B; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.15)`
  - 焦点效果：聚焦时添加外发光 `box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1)`
- **样式选择器**：使用 `:deep()` 穿透 Element Plus 的样式作用域，如 `.makeup-date-picker :deep(.el-input__wrapper)`
- **暗色模式支持**：为暗色模式添加对应的样式，使用 CSS 变量如 `var(--admin-bg-secondary)`、`var(--admin-text-primary)` 等
- **下拉面板美化**：美化日期选择器的下拉面板（`el-picker-panel`），包括：
  - 面板整体：设置圆角 `border-radius: 12px`、阴影 `box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12)`、边框 `border: 1px solid #e5e7eb`
  - 时间选择头部：添加底部边框分隔，优化输入框样式
  - 日期头部：美化年月显示（悬停效果）、导航按钮（圆角、悬停背景色变化）
  - 日期表格：优化单元格样式（圆角 `border-radius: 6px`、悬停背景色、今日高亮、选中状态背景色）
  - 星期中文化：使用 CSS `::after` 伪元素将英文星期（Sun/Mon等）替换为中文（日/一等），设置 `font-size: 0` 隐藏原文本
- **增大弹出面板**：如需更大的独立日历选择器，可通过 `popper-class` 属性设置自定义样式类，然后在全局样式（非 scoped）中定义样式：
  - 设置 `popper-class="makeup-date-picker-popper"` 属性
  - 在 `<style>`（非 scoped）中定义 `.makeup-date-picker-popper` 样式
  - 增大面板宽度：`min-width: 420px`
  - 增大单元格尺寸：`width: 36px; height: 36px`
  - 增大字体和间距：调整 `font-size`、`padding`、`margin` 等
  - 注意：`popper-class` 是添加到弹出到 body 的元素上的，不在 scoped 样式作用域内，需要使用全局样式
- **占位符中文化**：Element Plus DatePicker 在 datetime 模式下，时间选择器头部会有 "Select date" 和 "Select time" 的英文占位符，需要通过 JavaScript 动态设置：
  - 在打开对话框的函数中，使用 `nextTick()` 和 `setTimeout()` 等待 DOM 渲染完成
  - 通过 `document.querySelector('.makeup-date-picker-popper')` 查找弹出面板
  - 使用 `querySelectorAll('.el-date-picker__editor-wrap .el-input__inner')` 查找输入框
  - 通过 `setAttribute('placeholder', '选择日期')` 和 `setAttribute('placeholder', '选择时间')` 设置中文占位符
  - 建议使用多个 `setTimeout` 调用（如 100ms 和 300ms）确保在不同渲染时机都能正确设置
- **注意事项**：美化要适度，不要过度设计，保持与整体 UI 风格一致；确保在不同主题模式下都有良好的视觉效果；下拉面板样式需要使用 `:deep()` 穿透 Element Plus 的样式作用域；弹出面板的全局样式需要使用非 scoped 的 `<style>` 标签；占位符中文化需要在 DOM 渲染完成后动态设置，不能仅依赖 CSS。

