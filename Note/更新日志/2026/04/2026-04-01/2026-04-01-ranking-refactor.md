# 2026-04-01 - 重构：提取排行榜区域样式到独立文件

## 重构

- 将排行榜区域样式提取到独立文件 `src/views/DashboardPage/css/desktop/ranking.css`
- 为所有样式类名添加 `ranking-` 前缀，避免样式冲突
- 更新 `DashboardPageDesktop.vue` 模板中的类名引用

### 变更的样式类名

- `left-section` → `ranking-left-section`
- `punch-card` → `ranking-punch-card`
- `top-students` → `ranking-top-students`
- `chart-header` → `ranking-chart-header`
- `controls-section` → `ranking-controls-section`
- `time-range-selector` → `ranking-time-range-selector`
- `attendance-chart` → `ranking-attendance-chart`
- `summary-stats` → `ranking-summary-stats`
- `stats-row` → `ranking-stats-row`
- `total-count` → `ranking-total-count`
- `label` → `ranking-label`
- `value` → `ranking-value`
- `stat-icon` → `ranking-stat-icon`
