# Naming Conventions

## Variable Naming

| Type | Convention | Example |
|------|------------|---------|
| Component ref | camelCase | `const gradeChart = ref(null)` |
| Constant | UPPER_SNAKE_CASE | `const API_BASE_URL = '...'` |
| Boolean variable | is/has/can prefix | `isLoading`, `hasError` |
| Event handler | on/handle prefix | `onClick`, `handleSubmit` |
| API function | camelCase | `getGradeStatistics()` |
| Private variable | underscore prefix | `_privateMethod()` |

## Page File Naming

| Usage | Convention | Example |
|------|------------|---------|
| Page main file | PageName + Page | `DashboardPage.vue` |
| Desktop page | PageName + PageDesktop | `DashboardPageDesktop.vue` |
| Mobile page | PageName + PageMobile | `DashboardPageMobile.vue` |
| Page style | PageName + Page | `DashboardPage.css` |
| Page logic | PageName + Page | `DashboardPage.js` |
| Page config | PageName + PageConfig | `DashboardPageConfig.js` |
| Page utility | PageName + PageUtils | `DashboardPageUtils.js` |
| Page data loader | PageName + DataLoader | `DashboardDataLoader.ts` |

## API File Naming

- TypeScript API: `AttendanceApi.ts`, `PointsApi.ts`
- JavaScript API: `AttendanceApi.js`, `PointsApi.js`
- Compatibility API: `attendance.js`, `points.js`
- Admin API: `StudentManagementApi.js`
