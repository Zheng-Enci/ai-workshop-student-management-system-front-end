# CSS 使用情况分析报告

**生成时间**: 2026/1/7 08:56:40
**分析工具**: CSS Analyzer (Vite Plugin)

## 📊 总体统计

| 指标 | 数值 |
|------|------|
| 总CSS文件数 | 30 |
| 成功分析 | 30 |
| 分析失败 | 0 |
| 总CSS大小 | 458.75 KB |
| 未使用大小 | 5.54 KB |
| 未使用比例 | 1.21% |
| 分析耗时 | 3.92 秒 |

## ⚠️ 严重问题（包含未使用的 CSS 选择器）

发现 4 个文件包含明确未使用的 CSS 选择器。

### 1. src\views\AdminPage\css\AdminPageDesktop.css

- **原始大小**: 80.40 KB
- **未使用**: 1.00 KB (1.24%)
- **使用中**: 79.41 KB
- **未使用的选择器数量**: 1

**未使用的选择器列表**:

- `.charts-section`

### 2. src\views\DashboardPage\css\DashboardPageDesktop.css

- **原始大小**: 24.80 KB
- **未使用**: 0.12 KB (0.46%)
- **使用中**: 24.68 KB
- **未使用的选择器数量**: 2

**未使用的选择器列表**:

- `.details`
- `.dark .details`

### 3. src\views\NavigationPage\css\NavigationPageDesktop.css

- **原始大小**: 22.48 KB
- **未使用**: 0.44 KB (1.96%)
- **使用中**: 22.04 KB
- **未使用的选择器数量**: 1

**未使用的选择器列表**:

- `.navigation-grid.grid-4-cols`

### 4. src\views\PointsDashboardPage\css\PointsDashboardPageMobile.css

- **原始大小**: 26.17 KB
- **未使用**: 0.84 KB (3.2%)
- **使用中**: 25.33 KB
- **未使用的选择器数量**: 1

**未使用的选择器列表**:

- `.ranking-header`

## ⚠️ 存在未使用CSS的文件 (13个)

| 文件路径 | 原始大小 | 未使用大小 | 未使用比例 | 状态 |
|---------|---------|-----------|-----------|------|
| `src\assets\styles\theme.css` | 5.07 KB | 0.98 KB | 19.36% | ⚠️ |
| `src\views\AdminPage\css\AdminPageDesktop.css` | 80.40 KB | 1.00 KB | 1.24% | ⚠️ |
| `src\views\AdminPage\css\AdminPageMobile.css` | 28.88 KB | 0.17 KB | 0.6% | ⚠️ |
| `src\views\AllMembersPage\css\AllMembersPageMobile.css` | 7.39 KB | 0.27 KB | 3.66% | ⚠️ |
| `src\views\AttendancePage\css\AttendancePageDesktop.css` | 19.38 KB | 0.17 KB | 0.85% | ⚠️ |
| `src\views\DashboardPage\css\DashboardPageDesktop.css` | 24.80 KB | 0.12 KB | 0.46% | ⚠️ |
| `src\views\HomePage\css\HomePageDesktop.css` | 22.28 KB | 0.22 KB | 0.97% | ⚠️ |
| `src\views\NavigationPage\css\NavigationPageDesktop.css` | 22.48 KB | 0.44 KB | 1.96% | ⚠️ |
| `src\views\PointsDashboardPage\css\PointsDashboardPageDesktop.css` | 31.86 KB | 0.24 KB | 0.77% | ⚠️ |
| `src\views\PointsDashboardPage\css\PointsDashboardPageMobile.css` | 26.17 KB | 0.84 KB | 3.2% | ⚠️ |
| `src\views\ProfilePage\css\ProfilePageDesktop.css` | 22.63 KB | 0.55 KB | 2.42% | ⚠️ |
| `src\views\StudentManagerPage\css\mobile\StudentManagerPage-DatePicker.css` | 11.47 KB | 0.21 KB | 1.81% | ⚠️ |
| `src\views\StudentManagerPage\css\mobile\StudentManagerPage-StudentCards.css` | 5.85 KB | 0.34 KB | 5.86% | ⚠️ |

## ✅ 所有CSS都在使用中的文件 (17个)

- `src\views\AllMembersPage\css\AllMembersPageDesktop.css` (22.97 KB)
- `src\views\HomePage\css\HomePageMobile.css` (22.47 KB)
- `src\views\LoginPage\css\LoginPage.css` (7.03 KB)
- `src\views\NavigationPage\css\NavigationPage.css` (1.33 KB)
- `src\views\NavigationPage\css\NavigationPageMobile.css` (18.62 KB)
- `src\views\ProfilePage\css\ProfilePage.css` (1.18 KB)
- `src\views\ProfilePage\css\ProfilePageMobile.css` (34.80 KB)
- `src\views\RegisterPage\css\RegisterPage.css` (9.46 KB)
- `src\views\ScoreChangeRecordsPage\css\ScoreChangeRecordsPageDesktop.css` (9.74 KB)
- `src\views\ScoreChangeRecordsPage\css\ScoreChangeRecordsPageMobile.css` (10.30 KB)
- `src\views\StudentManagerPage\css\desktop\StudentManagerPage-Attendance_Records_Dialog.css` (1.65 KB)
- `src\views\StudentManagerPage\css\desktop\StudentManagerPage-HeatmapChart.css` (1.82 KB)
- `src\views\StudentManagerPage\css\desktop\StudentManagerPage-PageHeader.css` (2.40 KB)
- `src\views\StudentManagerPage\css\desktop\StudentManagerPage-StudentCards.css` (2.22 KB)
- `src\views\StudentManagerPage\css\desktop\StudentManagerPage-TrendChart.css` (1.92 KB)
- `src\views\StudentManagerPage\css\mobile\StudentManagerPage-PageHeader.css` (0.34 KB)
- `src\views\StudentManagerPage\css\mobile\StudentManagerPage-Search.css` (1.86 KB)

## 💡 优化建议

- ✅ CSS使用情况良好，未使用比例仅 1.21%
- 📝 建议定期检查，保持代码库整洁
- 🔍 对于未使用的CSS，请确认是否为动态生成或第三方库所需后再删除

---

*报告生成时间: 2026/1/7 08:56:40*
