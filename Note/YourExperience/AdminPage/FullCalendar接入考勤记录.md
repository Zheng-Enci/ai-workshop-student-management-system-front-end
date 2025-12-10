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

