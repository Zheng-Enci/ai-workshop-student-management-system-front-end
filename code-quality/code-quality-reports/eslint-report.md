# ESLint 代码规范检查报告

## 📊 总体统计

| 指标 | 数值 |
|------|------|
| 检查文件数 | 78 |
| 错误总数 | 444 |
| 警告总数 | 736 |
| 问题总数 | 1180 |

## 📈 状态评估

❌ **发现 444 个错误**，需要立即修复。

## 📋 按文件类型统计

| 文件类型 | 文件数 | 错误 | 警告 |
|---------|--------|------|------|
| Vue | 36 | 341 | 170 |
| JavaScript | 42 | 103 | 566 |

## ⚠️ 有问题的文件

| 文件路径 | 错误数 | 警告数 | 状态 |
|---------|--------|--------|------|
| src\views\AdminPage\AdminPage.js | 29 | 98 | ❌ |
| src\api\attendance.js | 28 | 98 | ❌ |
| src\api\student.js | 0 | 109 | ⚠️ |
| src\views\AttendanceAnalysisPage\AttendanceAnalysisPageDesktop.vue | 48 | 37 | ❌ |
| src\views\StudentManagerPage\StudentManagerPageDesktop.vue | 59 | 14 | ❌ |
| src\views\StudentManagerPage\StudentManagerPageMobile.vue | 42 | 17 | ❌ |
| src\views\ProfilePage\ProfilePageDesktop.vue | 1 | 56 | ❌ |
| src\composables\admin\StudentAttendance.js | 10 | 29 | ❌ |
| src\views\ProfilePage\ProfilePageMobile.vue | 22 | 11 | ❌ |
| src\views\AdminPage\AdminPageDesktop.vue | 30 | 0 | ❌ |
| src\composables\admin\StudentPoints.js | 6 | 23 | ❌ |
| src\api\points.js | 7 | 21 | ❌ |
| src\views\AdminPage\AdminPageMobile.vue | 26 | 1 | ❌ |
| src\composables\admin\StudentLevel.js | 7 | 18 | ❌ |
| src\views\AllMembersPage\AllMembersPageDesktop.vue | 23 | 2 | ❌ |
| src\composables\admin\StudentPersonalInformation.js | 2 | 20 | ❌ |
| src\views\StudentManagerPage\js\StudentManagerPage-Attendance_Records_Dialog.js | 2 | 19 | ❌ |
| src\composables\admin\StudentAvatar.js | 3 | 14 | ❌ |
| src\views\AttendancePage\AttendancePageMobile.vue | 13 | 2 | ❌ |
| src\views\PointsDashboardPage\PointsDashboardPageDesktop.vue | 13 | 2 | ❌ |
| src\views\PointsDashboardPage\PointsDashboardPageMobile.vue | 14 | 1 | ❌ |
| src\api\StudentApi.js | 0 | 14 | ⚠️ |
| src\views\AttendanceAnalysisPage\AttendanceAnalysisPageMobile.vue | 12 | 1 | ❌ |
| src\api\AttendanceApi.js | 0 | 10 | ⚠️ |
| src\stores\admin.js | 5 | 4 | ❌ |
| src\views\PointsDashboardPage\js\PointsDashboardPageUtils.js | 0 | 9 | ⚠️ |
| src\views\AllMembersPage\js\AllMembersPageUtils.js | 0 | 8 | ⚠️ |
| src\views\AllMembersPage\js\PointsServer.js | 0 | 8 | ⚠️ |
| src\views\PointsDashboardPage\js\PointsDashboardPage.js | 1 | 7 | ❌ |
| src\api\PointsApi.js | 0 | 6 | ⚠️ |
| src\views\AdminPage\AdminPage.vue | 4 | 2 | ❌ |
| src\views\AllMembersPage\js\AdjustRecordsDialogManager.js | 0 | 6 | ⚠️ |
| src\views\AllMembersPage\js\PersonalInformation.js | 0 | 6 | ⚠️ |
| src\views\ScoreChangeRecordsPage\ScoreChangeRecordsPageMobile.vue | 5 | 1 | ❌ |
| src\views\StudentManagerPage\js\StudentManagerPageStudentAttendanceServer.js | 0 | 6 | ⚠️ |
| src\components\ThemeToggle.vue | 1 | 4 | ❌ |
| src\views\StudentManagerPage\js\StudentManagerPage.js | 1 | 4 | ❌ |
| src\api\StatisticsApi.js | 0 | 4 | ⚠️ |
| src\router\index.js | 0 | 4 | ⚠️ |
| src\views\AllMembersPage\AllMembersPage.vue | 3 | 1 | ❌ |
| src\views\AllMembersPage\AllMembersPageMobile.vue | 3 | 1 | ❌ |
| src\views\HomePage\HomePage.vue | 2 | 2 | ❌ |
| src\views\PointsDashboardPage\PointsDashboardPage.vue | 3 | 1 | ❌ |
| src\views\RegisterPage\RegisterPage.vue | 1 | 3 | ❌ |
| src\views\StudentManagerPage\js\StudentManagerPageUtils.js | 0 | 4 | ⚠️ |
| src\api\super_admin.js | 0 | 3 | ⚠️ |
| src\config\Config.js | 2 | 1 | ❌ |
| src\stores\user.js | 0 | 3 | ⚠️ |
| src\views\AttendancePage\AttendancePage.vue | 2 | 1 | ❌ |
| src\views\HomePage\js\HomePage.js | 0 | 3 | ⚠️ |
| src\views\LoginPage\LoginPage.vue | 2 | 1 | ❌ |
| src\views\NavigationPage\NavigationPage.vue | 2 | 1 | ❌ |
| src\views\ScoreChangeRecordsPage\ScoreChangeRecordsPage.vue | 2 | 1 | ❌ |
| src\views\StudentManagerPage\StudentManagerPage.vue | 2 | 1 | ❌ |
| src\api\StudentManagementApi.js | 0 | 2 | ⚠️ |
| src\composables\ApiInterceptor.js | 0 | 2 | ⚠️ |
| src\views\HomePage\HomePageDesktop.vue | 1 | 1 | ❌ |
| src\views\HomePage\HomePageMobile.vue | 1 | 1 | ❌ |
| src\views\NavigationPage\NavigationPageDesktop.vue | 1 | 1 | ❌ |
| src\views\ProfilePage\js\ProfilePageUtils.js | 0 | 2 | ⚠️ |
| src\App.vue | 1 | 0 | ❌ |
| src\stores\theme.js | 0 | 1 | ⚠️ |
| src\views\AttendancePage\AttendancePageDesktop.vue | 0 | 1 | ⚠️ |
| src\views\DashboardPage\DashboardPage.vue | 1 | 0 | ❌ |
| src\views\DashboardPage\DashboardPageMobile.vue | 0 | 1 | ⚠️ |
| src\views\ProfilePage\ProfilePage.vue | 1 | 0 | ❌ |
| src\views\ScoreChangeRecordsPage\ScoreChangeRecordsPageDesktop.vue | 0 | 1 | ⚠️ |

## 📝 详细问题列表

### 1. src\views\AdminPage\AdminPage.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 65 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 65 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 295 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 352 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "shortcut" type "Object"; prefer: "object". |
| 352 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 353 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 354 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 368 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 411 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 538 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 539 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 563 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 564 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 565 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 628 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 629 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 630 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 694 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 728 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 764 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 810 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 846 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 854 | 60 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 859 | 6 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 860 | 6 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 870 | 6 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 871 | 6 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 877 | 7 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 881 | 7 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 882 | 7 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 888 | 6 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 889 | 6 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 903 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 903 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 906 | 3 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 907 | 3 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 914 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 942 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 985 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 985 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 1022 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1075 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1101 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 1102 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1122 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 1123 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1146 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 1147 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1170 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 1171 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 1172 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1176 | 17 | ❌ 错误 | no-use-before-define | 'getDateAttendanceTimes' was used before it was defined. |
| 1186 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 1197 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 1197 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 1198 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1223 | 5 | ❌ 错误 | no-use-before-define | 'initHeatmapChart' was used before it was defined. |
| 1224 | 5 | ❌ 错误 | no-use-before-define | 'initLineChart' was used before it was defined. |
| 1332 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 1333 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1348 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 1349 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1391 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 1392 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1410 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 1411 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1429 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1444 | 23 | ❌ 错误 | no-use-before-define | 'generateHeatmapData' was used before it was defined. |
| 1468 | 12 | ❌ 错误 | no-shadow | 'timeSlots' is already declared in the upper scope on line 373 column 8. |
| 1567 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1582 | 20 | ❌ 错误 | no-use-before-define | 'generateLineData' was used before it was defined. |
| 1724 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1735 | 9 | ❌ 错误 | no-shadow | 'timeSlots' is already declared in the upper scope on line 373 column 8. |
| 1792 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 1792 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1853 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 1853 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 1854 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1900 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 1900 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 1901 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1912 | 28 | ❌ 错误 | sonarjs/no-identical-functions | Update this function so that its implementation is not identical to the one on line 1865. |
| 1947 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1977 | 11 | ❌ 错误 | no-use-before-define | 'loadAllData' was used before it was defined. |
| 2023 | 1 | ⚠️ 警告 | jsdoc/check-types | Use object shorthand or index signatures instead of `Object`, e.g., `{[key: string]: string}` |
| 2044 | 1 | ⚠️ 警告 | jsdoc/check-types | Use object shorthand or index signatures instead of `Object`, e.g., `{[key: string]: string}` |
| 2087 | 7 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'label'. |
| 2116 | 10 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'node'. |
| 2119 | 10 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'node'. |
| 2120 | 10 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'node'. |
| 2121 | 10 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'node'. |
| 2122 | 10 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'node'. |
| 2146 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 2146 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 2147 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 2253 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 2268 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 2289 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "shortcut" type "Object"; prefer: "object". |
| 2289 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 2290 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 2291 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 2292 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 2293 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 2304 | 3 | ❌ 错误 | no-use-before-define | 'updateAttendanceTime' was used before it was defined. |
| 2314 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "shortcut" type "Object"; prefer: "object". |
| 2314 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 2315 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 2336 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 2344 | 3 | ❌ 错误 | no-use-before-define | 'updateAttendanceTime' was used before it was defined. |
| 2351 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 2352 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 2380 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 2381 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 2382 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 2400 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 2464 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 2464 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 2531 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 2589 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 2589 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 2590 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 2662 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 2663 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 2685 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 2686 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 2694 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 2695 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |

### 2. src\api\attendance.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 16 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 51 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 52 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 53 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 54 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 54 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 93 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 94 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 95 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 96 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 97 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 97 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 130 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 131 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 132 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 133 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 134 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 134 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 168 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 169 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 169 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 193 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 194 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 194 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 218 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 219 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 220 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 220 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 246 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 247 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 248 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 248 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 276 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 277 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 277 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 301 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 302 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 303 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 303 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 331 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 339 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 340 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 340 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 364 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 365 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 366 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 366 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 395 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 396 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 396 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 424 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 425 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 426 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 427 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 428 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 428 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 455 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 456 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 456 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 482 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 483 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 484 | 1 | ⚠️ 警告 | jsdoc/no-defaults | Defaults are not permitted on @param. |
| 484 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 485 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 485 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 496 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 497 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 498 | 1 | ⚠️ 警告 | jsdoc/no-defaults | Defaults are not permitted on @param. |
| 498 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 499 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 499 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 512 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 513 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 514 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 515 | 1 | ⚠️ 警告 | jsdoc/no-defaults | Defaults are not permitted on @param. |
| 515 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 516 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 516 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 528 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 529 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 530 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 531 | 1 | ⚠️ 警告 | jsdoc/no-defaults | Defaults are not permitted on @param. |
| 531 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 532 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 532 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 555 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 556 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 557 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 558 | 1 | ⚠️ 警告 | jsdoc/no-defaults | Defaults are not permitted on @param. |
| 558 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 559 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 559 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 578 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 579 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 580 | 1 | ⚠️ 警告 | jsdoc/no-defaults | Defaults are not permitted on @param. |
| 580 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 581 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 581 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 592 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 593 | 1 | ⚠️ 警告 | jsdoc/no-defaults | Defaults are not permitted on @param. |
| 593 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 594 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 594 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 609 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 610 | 1 | ⚠️ 警告 | jsdoc/no-defaults | Defaults are not permitted on @param. |
| 610 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 611 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 611 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 626 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 627 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 628 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 629 | 1 | ⚠️ 警告 | jsdoc/no-defaults | Defaults are not permitted on @param. |
| 629 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 630 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 630 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 642 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 643 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 644 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 645 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 645 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 721 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 722 | 1 | ⚠️ 警告 | jsdoc/no-defaults | Defaults are not permitted on @param. |
| 722 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 723 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 723 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 3. src\api\student.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 52 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "data" type "Object"; prefer: "object". |
| 52 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 53 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 54 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 55 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 55 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 87 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "data" type "Object"; prefer: "object". |
| 87 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 88 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 89 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 90 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 91 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 92 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 93 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 94 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 95 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 96 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 97 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 97 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 126 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 127 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 166 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 167 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 167 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 198 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 199 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "data" type "Object"; prefer: "object". |
| 199 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 200 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 201 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 202 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 203 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 204 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 205 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 206 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 207 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 207 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 241 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 242 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "data" type "Object"; prefer: "object". |
| 242 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 243 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 244 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 245 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 245 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 279 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 279 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 304 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 304 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 329 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 329 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 354 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 355 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 355 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 384 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 385 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 385 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 412 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 413 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 413 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 440 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 441 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 441 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 472 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 473 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 473 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 500 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 501 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 502 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 502 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 532 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 533 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 533 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 564 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 565 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 566 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 567 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 567 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 601 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 602 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 603 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "studentData" type "Object"; prefer: "object". |
| 603 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 604 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 605 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 606 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 607 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 608 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 609 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 610 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 611 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 612 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 612 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 646 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 647 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 648 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 649 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 649 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 683 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 684 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 684 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 715 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 716 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 716 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 747 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 748 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 749 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 749 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 835 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 836 | 1 | ⚠️ 警告 | jsdoc/no-defaults | Defaults are not permitted on @param. |
| 836 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 837 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 4. src\views\AttendanceAnalysisPage\AttendanceAnalysisPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 8 | 1 | ❌ 错误 | import/order | `vue` import should occur after import of `element-plus` |
| 9 | 1 | ❌ 错误 | import/order | `vue-router` import should occur after import of `element-plus` |
| 59 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 64 | 7 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 65 | 4 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 66 | 4 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 68 | 7 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 69 | 4 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 70 | 4 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 73 | 41 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 75 | 11 | ❌ 错误 | no-use-before-define | 'initPeriodChart' was used before it was defined. |
| 76 | 11 | ❌ 错误 | no-use-before-define | 'initTimelineChart' was used before it was defined. |
| 86 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 89 | 26 | ❌ 错误 | sonarjs/no-identical-functions | Update this function so that its implementation is not identical to the one on line 62. |
| 91 | 7 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 92 | 4 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 93 | 4 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 95 | 7 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 96 | 4 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 97 | 4 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 100 | 41 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 102 | 11 | ❌ 错误 | no-use-before-define | 'initPeriodChart' was used before it was defined. |
| 103 | 11 | ❌ 错误 | no-use-before-define | 'initTimelineChart' was used before it was defined. |
| 113 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 149 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 150 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 184 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 193 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 198 | 9 | ❌ 错误 | no-use-before-define | 'loadTimelineData' was used before it was defined. |
| 201 | 4 | ❌ 错误 | no-use-before-define | 'updateTimelineChart' was used before it was defined. |
| 204 | 11 | ❌ 错误 | no-use-before-define | 'initTimelineChart' was used before it was defined. |
| 214 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 220 | 10 | ❌ 错误 | no-use-before-define | 'loadTimelineData' was used before it was defined. |
| 223 | 5 | ❌ 错误 | no-use-before-define | 'updateTimelineChart' was used before it was defined. |
| 226 | 12 | ❌ 错误 | no-use-before-define | 'initTimelineChart' was used before it was defined. |
| 237 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 238 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 253 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 254 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 266 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 267 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 279 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "records" type "Object"; prefer: "object". |
| 279 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 280 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 280 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 288 | 1 | ❌ 错误 | max-len | This line has a length of 165. Maximum allowed is 120. |
| 288 | 33 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 288 | 87 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 288 | 143 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 296 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "records" type "Object"; prefer: "object". |
| 296 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 297 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 317 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 328 | 28 | ⚠️ 警告 | no-await-in-loop | Unexpected `await` inside a loop. |
| 329 | 6 | ⚠️ 警告 | max-depth | Blocks are nested too deeply (5). Maximum allowed is 4. |
| 359 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 388 | 4 | ❌ 错误 | no-use-before-define | 'updatePeriodChart' was used before it was defined. |
| 397 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 400 | 27 | ⚠️ 警告 | complexity | Arrow function has a complexity of 27. Maximum allowed is 15. |
| 573 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 607 | 5 | ❌ 错误 | no-use-before-define | 'updateTimelineChart' was used before it was defined. |
| 617 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 620 | 29 | ⚠️ 警告 | complexity | Arrow function has a complexity of 60. Maximum allowed is 15. |
| 654 | 14 | ❌ 错误 | no-shadow | 'data' is already declared in the upper scope on line 624 column 8. |
| 762 | 14 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 841 | 48 | ❌ 错误 | radix | Missing radix parameter. |
| 848 | 12 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 848 | 12 | ❌ 错误 | no-shadow | 'data' is already declared in the upper scope on line 624 column 8. |
| 991 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 994 | 26 | ⚠️ 警告 | complexity | Async arrow function has a complexity of 22. Maximum allowed is 15. |
| 1008 | 1 | ❌ 错误 | max-len | This line has a length of 140. Maximum allowed is 120. |
| 1017 | 1 | ❌ 错误 | max-len | This line has a length of 131. Maximum allowed is 120. |
| 1030 | 1 | ❌ 错误 | max-len | This line has a length of 155. Maximum allowed is 120. |
| 1031 | 1 | ❌ 错误 | max-len | This line has a length of 129. Maximum allowed is 120. |
| 1044 | 1 | ❌ 错误 | max-len | This line has a length of 122. Maximum allowed is 120. |
| 1045 | 1 | ❌ 错误 | max-len | This line has a length of 123. Maximum allowed is 120. |
| 1052 | 1 | ❌ 错误 | max-len | This line has a length of 149. Maximum allowed is 120. |
| 1060 | 1 | ❌ 错误 | max-len | This line has a length of 152. Maximum allowed is 120. |
| 1108 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1128 | 5 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1154 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1164 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1175 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1351 | 1 | ❌ 错误 | max-len | This line has a length of 137. Maximum allowed is 120. |

### 5. src\views\StudentManagerPage\StudentManagerPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 8 | 1 | ❌ 错误 | import/order | `vue` import should occur after import of `echarts/renderers` |
| 9 | 1 | ❌ 错误 | import/order | `element-plus` import should occur after import of `echarts/renderers` |
| 22 | 1 | ❌ 错误 | import/order | There should be no empty line within import group |
| 26 | 2 | ❌ 错误 | no-unused-vars | 'Loading' is defined but never used. Allowed unused vars must match /^_/u. |
| 47 | 8 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 60 | 1 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 102 | 20 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 103 | 20 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 122 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 123 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 135 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 136 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 151 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 152 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 238 | 55 | ❌ 错误 | sonarjs/no-redundant-boolean | Refactor the code to avoid using this boolean literal. |
| 250 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'event'. |
| 277 | 7 | ❌ 错误 | no-unused-vars | 'totalAttendanceCount' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 438 | 3 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 441 | 4 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 447 | 5 | ❌ 错误 | no-use-before-define | 'initDialogHeatmapChart' was used before it was defined. |
| 455 | 3 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 463 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 475 | 3 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 478 | 4 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 484 | 5 | ❌ 错误 | no-use-before-define | 'initDialogLineChart' was used before it was defined. |
| 492 | 3 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 500 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 508 | 7 | ❌ 错误 | no-unused-vars | 'formatAttendanceTime' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 532 | 24 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 534 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 538 | 24 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 540 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 544 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 568 | 3 | ❌ 错误 | no-use-before-define | 'initCharts' was used before it was defined. |
| 576 | 4 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 582 | 2 | ❌ 错误 | no-use-before-define | 'initHeatmapChart' was used before it was defined. |
| 583 | 2 | ❌ 错误 | no-use-before-define | 'initLineChart' was used before it was defined. |
| 587 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 588 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 589 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 602 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 608 | 22 | ❌ 错误 | no-use-before-define | 'generateHeatmapData' was used before it was defined. |
| 609 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 610 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 610 | 23 | ❌ 错误 | no-undef | 'studentAttendanceRecords' is not defined. |
| 702 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 709 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 710 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 711 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 724 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 730 | 19 | ❌ 错误 | no-use-before-define | 'generateLineData' was used before it was defined. |
| 731 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 732 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 732 | 23 | ❌ 错误 | no-undef | 'studentAttendanceRecords' is not defined. |
| 745 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 832 | 22 | ❌ 错误 | no-use-before-define | 'generateHeatmapData' was used before it was defined. |
| 934 | 19 | ❌ 错误 | no-use-before-define | 'generateLineData' was used before it was defined. |
| 947 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1028 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 1030 | 9 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1057 | 4 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 1063 | 53 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 1063 | 116 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 1063 | 179 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 1087 | 13 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 1328 | 1 | ❌ 错误 | max-len | This line has a length of 125. Maximum allowed is 120. |
| 1361 | 1 | ❌ 错误 | max-len | This line has a length of 270. Maximum allowed is 120. |
| 1363 | 1 | ❌ 错误 | max-len | This line has a length of 206. Maximum allowed is 120. |
| 1368 | 1 | ❌ 错误 | max-len | This line has a length of 272. Maximum allowed is 120. |
| 1370 | 1 | ❌ 错误 | max-len | This line has a length of 208. Maximum allowed is 120. |
| 1375 | 1 | ❌ 错误 | max-len | This line has a length of 270. Maximum allowed is 120. |
| 1377 | 1 | ❌ 错误 | max-len | This line has a length of 206. Maximum allowed is 120. |

### 6. src\views\StudentManagerPage\StudentManagerPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 22 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 22 | 41 | ❌ 错误 | no-unused-vars | 'Loading' is defined but never used. Allowed unused vars must match /^_/u. |
| 26 | 10 | ❌ 错误 | no-unused-vars | 'getManagedStudents' is defined but never used. Allowed unused vars must match /^_/u. |
| 33 | 1 | ❌ 错误 | import/order | `echarts/core` import should occur before import of `element-plus` |
| 34 | 1 | ❌ 错误 | import/order | `echarts/charts` import should occur before import of `element-plus` |
| 35 | 1 | ❌ 错误 | import/order | `echarts/components` import should occur before import of `element-plus` |
| 42 | 1 | ❌ 错误 | import/order | `echarts/renderers` import should occur before import of `element-plus` |
| 80 | 20 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 81 | 20 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 100 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 101 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 113 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 114 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 129 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 130 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 205 | 1 | ❌ 错误 | max-len | This line has a length of 121. Maximum allowed is 120. |
| 210 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 211 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 227 | 62 | ❌ 错误 | no-undefined | Unexpected use of undefined. |
| 235 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 241 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'event'. |
| 267 | 7 | ❌ 错误 | no-unused-vars | 'totalAttendanceCount' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 267 | 7 | ❌ 错误 | no-shadow | 'totalAttendanceCount' is already declared in the upper scope on line 205 column 7. |
| 405 | 5 | ❌ 错误 | no-use-before-define | 'initDialogHeatmapChart' was used before it was defined. |
| 442 | 5 | ❌ 错误 | no-use-before-define | 'initDialogLineChart' was used before it was defined. |
| 466 | 7 | ❌ 错误 | no-unused-vars | 'formatAttendanceTime' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 553 | 3 | ❌ 错误 | no-use-before-define | 'initCharts' was used before it was defined. |
| 569 | 2 | ❌ 错误 | no-use-before-define | 'initHeatmapChart' was used before it was defined. |
| 570 | 2 | ❌ 错误 | no-use-before-define | 'initLineChart' was used before it was defined. |
| 574 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 575 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 576 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 589 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 595 | 22 | ❌ 错误 | no-use-before-define | 'generateHeatmapData' was used before it was defined. |
| 596 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 597 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 689 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 696 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 697 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 698 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 711 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 717 | 19 | ❌ 错误 | no-use-before-define | 'generateLineData' was used before it was defined. |
| 718 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 719 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 732 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 819 | 22 | ❌ 错误 | no-use-before-define | 'generateHeatmapData' was used before it was defined. |
| 921 | 19 | ❌ 错误 | no-use-before-define | 'generateLineData' was used before it was defined. |
| 934 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1017 | 9 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1050 | 53 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 1050 | 116 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 1050 | 179 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 1192 | 1 | ❌ 错误 | max-len | This line has a length of 124. Maximum allowed is 120. |
| 1275 | 1 | ❌ 错误 | max-len | This line has a length of 141. Maximum allowed is 120. |
| 1320 | 1 | ❌ 错误 | max-len | This line has a length of 130. Maximum allowed is 120. |
| 1422 | 1 | ❌ 错误 | max-len | This line has a length of 138. Maximum allowed is 120. |
| 1425 | 1 | ❌ 错误 | max-len | This line has a length of 142. Maximum allowed is 120. |
| 1428 | 1 | ❌ 错误 | max-len | This line has a length of 138. Maximum allowed is 120. |

### 7. src\views\ProfilePage\ProfilePageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 129 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 129 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 183 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 183 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 239 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 239 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 267 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 267 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 375 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 375 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 436 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 436 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 474 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "file" type. |
| 475 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 475 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 514 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "file" type. |
| 515 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 515 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 557 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 557 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 569 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 569 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 583 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 583 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 591 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 591 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 599 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 599 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 647 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 647 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 655 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 655 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 664 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "event" type. |
| 665 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 665 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 696 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 696 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 729 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 729 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 762 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 762 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 773 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 773 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 802 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 802 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 891 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 891 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 905 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 905 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 916 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 916 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 925 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 925 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 975 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 975 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 8. src\composables\admin\StudentAttendance.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 20 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 21 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 21 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 54 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 76 | 4 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 77 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 78 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "_params" type "Object"; prefer: "object". |
| 78 | 1 | ⚠️ 警告 | jsdoc/no-defaults | Defaults are not permitted on @param. |
| 78 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 79 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 79 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 102 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 104 | 42 | ❌ 错误 | no-return-await | Redundant use of `await` on a return value. |
| 108 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 109 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 129 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "attendanceInfo" type. |
| 159 | 4 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 160 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 160 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 197 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "time" type. |
| 198 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 212 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "time" type. |
| 213 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 232 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "time" type. |
| 233 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 253 | 4 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 254 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 255 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 255 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 271 | 6 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 274 | 6 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 277 | 6 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 280 | 6 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 290 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "status" type. |
| 291 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 306 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "status" type. |
| 307 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 328 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 330 | 27 | ❌ 错误 | no-return-await | Redundant use of `await` on a return value. |

### 9. src\views\ProfilePage\ProfilePageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 34 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 166 | 5 | ⚠️ 警告 | no-negated-condition | Unexpected negated condition. |
| 217 | 10 | ❌ 错误 | no-use-before-define | 'loadAvatar' was used before it was defined. |
| 293 | 9 | ❌ 错误 | no-use-before-define | 'showCropDialog' was used before it was defined. |
| 300 | 4 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'event'. |
| 307 | 3 | ❌ 错误 | no-use-before-define | 'resetForm' was used before it was defined. |
| 326 | 3 | ❌ 错误 | no-use-before-define | 'resetPasswordForm' was used before it was defined. |
| 441 | 1 | ⚠️ 警告 | jsdoc/require-returns | Missing JSDoc @returns declaration. |
| 443 | 1 | ⚠️ 警告 | jsdoc/require-param-description | Missing JSDoc @param "file" description. |
| 443 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "file" type. |
| 445 | 35 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 465 | 7 | ❌ 错误 | no-use-before-define | 'initCrop' was used before it was defined. |
| 536 | 9 | ❌ 错误 | no-shadow | 'imgMinSide' is already declared in the upper scope on line 517 column 8. |
| 538 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 545 | 2 | ❌ 错误 | no-use-before-define | 'drawCropCanvas' was used before it was defined. |
| 546 | 2 | ❌ 错误 | no-use-before-define | 'setupCropEvents' was used before it was defined. |
| 669 | 2 | ❌ 错误 | no-use-before-define | 'removeCropEvents' was used before it was defined. |
| 734 | 10 | ❌ 错误 | no-shadow | 'canvas' is already declared in the upper scope on line 671 column 8. |
| 784 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 785 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 809 | 10 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 810 | 10 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 854 | 10 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1012 | 30 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 1076 | 11 | ❌ 错误 | no-use-before-define | 'uploadAvatarFile' was used before it was defined. |
| 1091 | 1 | ⚠️ 警告 | jsdoc/require-returns | Missing JSDoc @returns declaration. |
| 1093 | 1 | ⚠️ 警告 | jsdoc/require-param-description | Missing JSDoc @param "file" description. |
| 1093 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "file" type. |
| 1094 | 1 | ⚠️ 警告 | jsdoc/require-param-description | Missing JSDoc @param "maxSize" description. |
| 1094 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "maxSize" type. |
| 1096 | 7 | ❌ 错误 | no-unused-vars | 'compressImage' is assigned a value but never used. Allowed unused vars must match /^_/u. |

### 10. src\views\AdminPage\AdminPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 49 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 75 | 2 | ❌ 错误 | no-unused-vars | 'authError' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 81 | 2 | ❌ 错误 | no-unused-vars | 'students' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 101 | 2 | ❌ 错误 | no-unused-vars | 'scrollPosition' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 104 | 2 | ❌ 错误 | no-unused-vars | 'filteredStudentAttendanceRecords' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 109 | 2 | ❌ 错误 | no-unused-vars | 'heatmapInstance' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 110 | 2 | ❌ 错误 | no-unused-vars | 'lineInstance' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 142 | 2 | ❌ 错误 | no-unused-vars | 'loadStudentLevels' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 143 | 2 | ❌ 错误 | no-unused-vars | 'loadStudentAttendanceCounts' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 144 | 2 | ❌ 错误 | no-unused-vars | 'loadStudentAdmins' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 146 | 2 | ❌ 错误 | no-unused-vars | 'loadStatistics' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 170 | 2 | ❌ 错误 | no-unused-vars | 'generateHeatmapData' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 171 | 2 | ❌ 错误 | no-unused-vars | 'generateLineData' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 176 | 2 | ❌ 错误 | no-unused-vars | 'getShortcutDate' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 186 | 2 | ❌ 错误 | no-unused-vars | 'updateAttendanceTime' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 203 | 7 | ❌ 错误 | no-unused-vars | 'monthMap' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 219 | 7 | ❌ 错误 | no-unused-vars | 'monthObserver' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 225 | 24 | ❌ 错误 | no-undef | 'adminStore' is not defined. |
| 234 | 4 | ❌ 错误 | no-undef | 'adminStore' is not defined. |
| 436 | 1 | ❌ 错误 | max-len | This line has a length of 173. Maximum allowed is 120. |
| 456 | 1 | ❌ 错误 | max-len | This line has a length of 237. Maximum allowed is 120. |
| 459 | 1 | ❌ 错误 | max-len | This line has a length of 143. Maximum allowed is 120. |
| 460 | 1 | ❌ 错误 | max-len | This line has a length of 162. Maximum allowed is 120. |
| 811 | 1 | ❌ 错误 | max-len | This line has a length of 126. Maximum allowed is 120. |
| 864 | 1 | ❌ 错误 | max-len | This line has a length of 139. Maximum allowed is 120. |
| 993 | 1 | ❌ 错误 | max-len | This line has a length of 130. Maximum allowed is 120. |
| 1130 | 1 | ❌ 错误 | max-len | This line has a length of 133. Maximum allowed is 120. |
| 1197 | 1 | ❌ 错误 | max-len | This line has a length of 123. Maximum allowed is 120. |
| 1207 | 1 | ❌ 错误 | max-len | This line has a length of 141. Maximum allowed is 120. |
| 1231 | 1 | ❌ 错误 | max-len | This line has a length of 145. Maximum allowed is 120. |

### 11. src\composables\admin\StudentPoints.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 20 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 21 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 21 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 79 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 80 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 91 | 51 | ❌ 错误 | no-undefined | Unexpected use of undefined. |
| 109 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentIds" type. |
| 110 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 122 | 20 | ⚠️ 警告 | no-await-in-loop | Unexpected `await` inside a loop. |
| 142 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 143 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 149 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "student" type. |
| 174 | 3 | ❌ 错误 | no-use-before-define | 'resetPointsForm' was used before it was defined. |
| 180 | 4 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 181 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "formRef" type "Object"; prefer: "object". |
| 181 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 182 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 182 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 250 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "formRef" type. |
| 261 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "student" type. |
| 262 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 317 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "records" type. |
| 318 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 329 | 17 | ❌ 错误 | no-use-before-define | 'formatTime' was used before it was defined. |
| 335 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "time" type. |
| 336 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 353 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 367 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 369 | 24 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |

### 12. src\api\points.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 16 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 51 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 52 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 53 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 54 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 55 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 56 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 56 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 90 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 91 | 1 | ⚠️ 警告 | jsdoc/no-defaults | Defaults are not permitted on @param. |
| 91 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 92 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 92 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 120 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 121 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 122 | 1 | ⚠️ 警告 | jsdoc/no-defaults | Defaults are not permitted on @param. |
| 122 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 123 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 123 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 154 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 155 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 156 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 156 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 186 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 187 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 188 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 188 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 13. src\views\AdminPage\AdminPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 14 | 1 | ❌ 错误 | import/order | `element-plus` import should occur before import of `vue` |
| 56 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `vue` |
| 73 | 1 | ❌ 错误 | import/order | `@/api/student` import should occur before import of `./AdminPage.js` |
| 75 | 1 | ❌ 错误 | import/order | `element-plus/dist/locale/zh-cn.mjs` import should occur before import of `vue` |
| 84 | 2 | ❌ 错误 | no-unused-vars | 'authError' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 90 | 2 | ❌ 错误 | no-unused-vars | 'students' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 110 | 2 | ❌ 错误 | no-unused-vars | 'scrollPosition' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 113 | 2 | ❌ 错误 | no-unused-vars | 'filteredStudentAttendanceRecords' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 118 | 2 | ❌ 错误 | no-unused-vars | 'heatmapInstance' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 119 | 2 | ❌ 错误 | no-unused-vars | 'lineInstance' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 151 | 2 | ❌ 错误 | no-unused-vars | 'loadStudentLevels' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 152 | 2 | ❌ 错误 | no-unused-vars | 'loadStudentAttendanceCounts' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 153 | 2 | ❌ 错误 | no-unused-vars | 'loadStudentAdmins' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 155 | 2 | ❌ 错误 | no-unused-vars | 'loadStatistics' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 179 | 2 | ❌ 错误 | no-unused-vars | 'generateHeatmapData' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 180 | 2 | ❌ 错误 | no-unused-vars | 'generateLineData' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 185 | 2 | ❌ 错误 | no-unused-vars | 'getShortcutDate' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 195 | 2 | ❌ 错误 | no-unused-vars | 'updateAttendanceTime' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 212 | 7 | ❌ 错误 | no-unused-vars | 'monthMap' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 228 | 7 | ❌ 错误 | no-unused-vars | 'monthObserver' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 234 | 24 | ❌ 错误 | no-undef | 'adminStore' is not defined. |
| 243 | 4 | ❌ 错误 | no-undef | 'adminStore' is not defined. |
| 254 | 9 | ❌ 错误 | no-undef | 'nextTick' is not defined. |
| 462 | 1 | ❌ 错误 | max-len | This line has a length of 149. Maximum allowed is 120. |
| 487 | 1 | ❌ 错误 | max-len | This line has a length of 196. Maximum allowed is 120. |
| 495 | 1 | ❌ 错误 | max-len | This line has a length of 123. Maximum allowed is 120. |

### 14. src\composables\admin\StudentLevel.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 10 | 1 | ⚠️ 警告 | jsdoc/require-returns | Missing JSDoc @returns declaration. |
| 25 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 26 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 35 | 10 | ❌ 错误 | no-use-before-define | 'getStudentLevelText' was used before it was defined. |
| 37 | 15 | ❌ 错误 | no-use-before-define | 'getStudentLevelName' was used before it was defined. |
| 43 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "identity" type. |
| 44 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 58 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "identity" type. |
| 59 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 73 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 84 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 95 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 96 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "newLevel" type. |
| 97 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "specialPassword" type. |
| 98 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 113 | 11 | ❌ 错误 | no-use-before-define | 'loadStudentLevels' was used before it was defined. |
| 128 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 130 | 37 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 161 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "level" type. |
| 162 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 168 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 179 | 36 | ❌ 错误 | no-undefined | Unexpected use of undefined. |
| 180 | 5 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 195 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 197 | 27 | ❌ 错误 | no-return-await | Redundant use of `await` on a return value. |

### 15. src\views\AllMembersPage\AllMembersPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 8 | 1 | ❌ 错误 | import/order | `vue` import should occur after import of `element-plus` |
| 9 | 1 | ❌ 错误 | import/order | `vue-router` import should occur after import of `element-plus` |
| 11 | 1 | ❌ 错误 | import/order | `@/stores/theme` import should occur after import of `@/api/attendance` |
| 25 | 63 | ❌ 错误 | no-unused-vars | 'View' is defined but never used. Allowed unused vars must match /^_/u. |
| 30 | 47 | ❌ 错误 | no-unused-vars | 'ElTooltip' is defined but never used. Allowed unused vars must match /^_/u. |
| 49 | 7 | ❌ 错误 | no-unused-vars | 'totalRankingTopN' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 258 | 7 | ❌ 错误 | no-unused-vars | 'recordsDialogVisible' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 259 | 7 | ❌ 错误 | no-unused-vars | 'currentStudent' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 260 | 7 | ❌ 错误 | no-unused-vars | 'allRecords' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 261 | 7 | ❌ 错误 | no-unused-vars | 'recordsLoading' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 345 | 13 | ❌ 错误 | no-shadow | 'totalCount' is already declared in the upper scope on line 59 column 7. |
| 375 | 17 | ❌ 错误 | no-use-before-define | 'formatGrade' was used before it was defined. |
| 457 | 13 | ❌ 错误 | no-shadow | 'totalCount' is already declared in the upper scope on line 59 column 7. |
| 487 | 17 | ❌ 错误 | no-use-before-define | 'formatGrade' was used before it was defined. |
| 614 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 615 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 619 | 7 | ❌ 错误 | no-unused-vars | 'loadSignInRanking' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 758 | 19 | ❌ 错误 | radix | Missing radix parameter. |
| 796 | 53 | ⚠️ 警告 | complexity | Arrow function has a complexity of 17. Maximum allowed is 15. |
| 817 | 31 | ❌ 错误 | no-undefined | Unexpected use of undefined. |
| 820 | 32 | ❌ 错误 | no-undefined | Unexpected use of undefined. |
| 823 | 45 | ❌ 错误 | no-undefined | Unexpected use of undefined. |
| 1051 | 1 | ❌ 错误 | max-len | This line has a length of 124. Maximum allowed is 120. |

### 16. src\composables\admin\StudentPersonalInformation.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 10 | 1 | ⚠️ 警告 | jsdoc/require-returns | Missing JSDoc @returns declaration. |
| 61 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "student" type. |
| 92 | 4 | ⚠️ 警告 | no-negated-condition | Unexpected negated condition. |
| 102 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "formRef" type. |
| 103 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "specialPassword" type. |
| 104 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 130 | 29 | ❌ 错误 | no-undefined | Unexpected use of undefined. |
| 158 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "formRef" type. |
| 169 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "phone" type. |
| 170 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 179 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "email" type. |
| 180 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 189 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentNumber" type. |
| 190 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 199 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentNumber" type. |
| 200 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "excludeStudentId" type. |
| 201 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 214 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "student" type. |
| 215 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 231 | 4 | ⚠️ 警告 | no-negated-condition | Unexpected negated condition. |
| 241 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 243 | 24 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |

### 17. src\views\StudentManagerPage\js\StudentManagerPage-Attendance_Records_Dialog.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 8 | 7 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 23 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentManagerPageStudentAttendanceServer" type. |
| 31 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "student" type. |
| 32 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 32 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 70 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 70 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 78 | 1 | ⚠️ 警告 | jsdoc/require-param-description | Missing JSDoc @param "value" description. |
| 78 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "value" type. |
| 86 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 86 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 94 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 94 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 102 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 102 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 110 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "date" type. |
| 118 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 118 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 126 | 1 | ⚠️ 警告 | jsdoc/require-param-description | Missing JSDoc @param "value" description. |
| 126 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "value" type. |
| 133 | 16 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |

### 18. src\composables\admin\StudentAvatar.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 9 | 1 | ⚠️ 警告 | jsdoc/require-returns | Missing JSDoc @returns declaration. |
| 19 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 20 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 45 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "students" type. |
| 46 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 48 | 44 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 79 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "event" type. |
| 80 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 96 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 99 | 3 | ⚠️ 警告 | no-negated-condition | Unexpected negated condition. |
| 99 | 21 | ❌ 错误 | no-undefined | Unexpected use of undefined. |
| 108 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "students" type. |
| 109 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 145 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 151 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 161 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 163 | 24 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |

### 19. src\views\AttendancePage\AttendancePageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 18 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 116 | 10 | ❌ 错误 | no-use-before-define | 'isSlotSigned' was used before it was defined. |
| 158 | 42 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 236 | 35 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 251 | 33 | ⚠️ 警告 | complexity | Async arrow function has a complexity of 23. Maximum allowed is 15. |
| 328 | 20 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 333 | 3 | ❌ 错误 | no-use-before-define | 'loadStudentLevel' was used before it was defined. |
| 384 | 1 | ❌ 错误 | max-len | This line has a length of 137. Maximum allowed is 120. |
| 424 | 1 | ❌ 错误 | max-len | This line has a length of 153. Maximum allowed is 120. |
| 425 | 1 | ❌ 错误 | max-len | This line has a length of 177. Maximum allowed is 120. |
| 426 | 1 | ❌ 错误 | max-len | This line has a length of 154. Maximum allowed is 120. |
| 439 | 1 | ❌ 错误 | max-len | This line has a length of 145. Maximum allowed is 120. |
| 452 | 1 | ❌ 错误 | max-len | This line has a length of 149. Maximum allowed is 120. |
| 465 | 1 | ❌ 错误 | max-len | This line has a length of 145. Maximum allowed is 120. |

### 20. src\views\PointsDashboardPage\PointsDashboardPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 8 | 1 | ❌ 错误 | import/order | `vue` import should occur after import of `element-plus` |
| 9 | 1 | ❌ 错误 | import/order | `vue-router` import should occur after import of `element-plus` |
| 11 | 1 | ❌ 错误 | import/order | `@/stores/theme` import should occur after import of `@/api/StudentApi` |
| 25 | 53 | ❌ 错误 | no-unused-vars | 'View' is defined but never used. Allowed unused vars must match /^_/u. |
| 287 | 2 | ❌ 错误 | no-use-before-define | 'handleTabChange' was used before it was defined. |
| 605 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 606 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 620 | 1 | ❌ 错误 | max-len | This line has a length of 121. Maximum allowed is 120. |
| 633 | 4 | ⚠️ 警告 | no-negated-condition | Unexpected negated condition. |
| 799 | 54 | ❌ 错误 | sonarjs/no-identical-functions | Update this function so that its implementation is not identical to the one on line 719. |
| 968 | 19 | ❌ 错误 | radix | Missing radix parameter. |
| 1297 | 1 | ❌ 错误 | max-len | This line has a length of 165. Maximum allowed is 120. |
| 1310 | 1 | ❌ 错误 | max-len | This line has a length of 128. Maximum allowed is 120. |

### 21. src\views\PointsDashboardPage\PointsDashboardPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 2 | 1 | ❌ 错误 | import/order | `vue` import should occur after import of `element-plus` |
| 3 | 1 | ❌ 错误 | import/order | `vue-router` import should occur after import of `element-plus` |
| 5 | 1 | ❌ 错误 | import/order | `@/stores/theme` import should occur after import of `@/api/StudentApi` |
| 18 | 47 | ❌ 错误 | no-unused-vars | 'View' is defined but never used. Allowed unused vars must match /^_/u. |
| 92 | 2 | ❌ 错误 | no-use-before-define | 'handleTabChange' was used before it was defined. |
| 389 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 390 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 404 | 1 | ❌ 错误 | max-len | This line has a length of 121. Maximum allowed is 120. |
| 417 | 4 | ⚠️ 警告 | no-negated-condition | Unexpected negated condition. |
| 589 | 54 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 618 | 7 | ❌ 错误 | no-unused-vars | 'refreshTimer' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 621 | 7 | ❌ 错误 | no-unused-vars | 'refreshData' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 734 | 19 | ❌ 错误 | radix | Missing radix parameter. |
| 1037 | 1 | ❌ 错误 | max-len | This line has a length of 165. Maximum allowed is 120. |
| 1050 | 1 | ❌ 错误 | max-len | This line has a length of 128. Maximum allowed is 120. |

### 22. src\api\StudentApi.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 29 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 30 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 31 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 31 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 66 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 67 | 1 | ⚠️ 警告 | jsdoc/no-defaults | Defaults are not permitted on @param. |
| 67 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 68 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 83 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 84 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 84 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 115 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 116 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 116 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 23. src\views\AttendanceAnalysisPage\AttendanceAnalysisPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 8 | 1 | ❌ 错误 | import/order | `vue` import should occur after import of `element-plus` |
| 9 | 1 | ❌ 错误 | import/order | `vue-router` import should occur after import of `element-plus` |
| 84 | 24 | ❌ 错误 | no-use-before-define | 'calculatePeriodStats' was used before it was defined. |
| 92 | 5 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 93 | 25 | ❌ 错误 | no-use-before-define | 'calculateAverageTime' was used before it was defined. |
| 99 | 5 | ❌ 错误 | no-use-before-define | 'initChartsWithTheme' was used before it was defined. |
| 125 | 11 | ❌ 错误 | no-use-before-define | 'initTimelineChart' was used before it was defined. |
| 139 | 4 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 141 | 4 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 143 | 4 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 274 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 517 | 1 | ❌ 错误 | max-len | This line has a length of 125. Maximum allowed is 120. |

### 24. src\api\AttendanceApi.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 8 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 9 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 23 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "top" type. |
| 24 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 38 | 1 | ⚠️ 警告 | jsdoc/require-param-description | Missing JSDoc @param "studentId" description. |
| 38 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 39 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 39 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 53 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "date" type. |
| 54 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 25. src\stores\admin.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 18 | 4 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 19 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 33 | 5 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 34 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 56 | 5 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 57 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 71 | 5 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 72 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 26. src\views\PointsDashboardPage\js\PointsDashboardPageUtils.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 15 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 16 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 36 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "startRank" type. |
| 37 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "endRank" type. |
| 38 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 85 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "top" type. |
| 86 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 112 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "top" type. |
| 113 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 27. src\views\AllMembersPage\js\AllMembersPageUtils.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 18 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "attendanceRankingData" type. |
| 19 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "pointsRankingData" type. |
| 20 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 46 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentIds" type. |
| 47 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 64 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "startRank" type. |
| 65 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "endRank" type. |
| 66 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 28. src\views\AllMembersPage\js\PointsServer.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 13 | 3 | ⚠️ 警告 | jsdoc/require-description | Missing JSDoc block description. |
| 14 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "adjustReason" type. |
| 15 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "adjustPoints" type. |
| 16 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "createTime" type. |
| 26 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "serverData" type. |
| 27 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 40 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 41 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 29. src\views\PointsDashboardPage\js\PointsDashboardPage.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 49 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 66 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 68 | 8 | ❌ 错误 | sonarjs/no-identical-functions | Update this function so that its implementation is not identical to the one on line 51. |
| 82 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 83 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 84 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 118 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 157 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 30. src\api\PointsApi.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 8 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 9 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 23 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "top" type. |
| 24 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 37 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 38 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 31. src\views\AdminPage\AdminPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 11 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 19 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 21 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 37 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |

### 32. src\views\AllMembersPage\js\AdjustRecordsDialogManager.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 27 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "student" type. |
| 77 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 85 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "time" type. |
| 86 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 110 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "points" type. |
| 111 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 33. src\views\AllMembersPage\js\PersonalInformation.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 30 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 31 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 31 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 67 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 68 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 68 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 34. src\views\ScoreChangeRecordsPage\ScoreChangeRecordsPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 16 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 16 | 21 | ❌ 错误 | no-unused-vars | 'Loading' is defined but never used. Allowed unused vars must match /^_/u. |
| 18 | 1 | ❌ 错误 | import/order | `@/api/points` import should occur before import of `@/stores/theme` |
| 19 | 1 | ❌ 错误 | import/order | `@/api/student` import should occur before import of `@/stores/theme` |
| 195 | 1 | ❌ 错误 | max-len | This line has a length of 149. Maximum allowed is 120. |

### 35. src\views\StudentManagerPage\js\StudentManagerPageStudentAttendanceServer.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 12 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 13 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 36 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "dateStr" type. |
| 37 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "slot" type. |
| 38 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentAttendanceRecords" type. |
| 39 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 36. src\components\ThemeToggle.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 1 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 23 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag (preference). Replace "const" JSDoc tag with "constant". |
| 23 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @const "themeStore" type "Object"; prefer: "object". |
| 29 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag (preference). Replace "const" JSDoc tag with "constant". |
| 30 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag (preference). Replace "const" JSDoc tag with "constant". |

### 37. src\views\StudentManagerPage\js\StudentManagerPage.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 16 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 17 | 1 | ⚠️ 警告 | jsdoc/require-param-description | Missing JSDoc @param "adminStudentDatabaseTableId" description. |
| 17 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "adminStudentDatabaseTableId" type. |
| 18 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 30 | 5 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |

### 38. src\api\StatisticsApi.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 33 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 34 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 35 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 35 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 39. src\router\index.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 506 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 507 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 522 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 523 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "isValid" type. |

### 40. src\views\AllMembersPage\AllMembersPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 1 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 15 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 26 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 27 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 41. src\views\AllMembersPage\AllMembersPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 8 | 35 | ❌ 错误 | no-unused-vars | 'View' is defined but never used. Allowed unused vars must match /^_/u. |
| 50 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 51 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |

### 42. src\views\HomePage\HomePage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 16 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 18 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 43. src\views\PointsDashboardPage\PointsDashboardPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 1 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 15 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 26 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 27 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 44. src\views\RegisterPage\RegisterPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 18 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 90 | 12 | ⚠️ 警告 | no-negated-condition | Unexpected negated condition. |
| 112 | 5 | ⚠️ 警告 | no-negated-condition | Unexpected negated condition. |

### 45. src\views\StudentManagerPage\js\StudentManagerPageUtils.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 8 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 9 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 17 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 18 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 46. src\api\super_admin.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 31 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 32 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 32 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 47. src\config\Config.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 11 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 12 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |

### 48. src\stores\user.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 36 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "info" type. |
| 37 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 55 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "level" type. |

### 49. src\views\AttendancePage\AttendancePage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 1 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 26 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 27 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 50. src\views\HomePage\js\HomePage.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 19 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 19 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 110 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |

### 51. src\views\LoginPage\LoginPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 60 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |

### 52. src\views\NavigationPage\NavigationPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 1 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 26 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 27 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 53. src\views\ScoreChangeRecordsPage\ScoreChangeRecordsPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 1 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 26 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 27 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 54. src\views\StudentManagerPage\StudentManagerPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 1 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 20 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 21 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 55. src\api\StudentManagementApi.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 8 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 9 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 56. src\composables\ApiInterceptor.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 26 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 51 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |

### 57. src\views\HomePage\HomePageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |

### 58. src\views\HomePage\HomePageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |

### 59. src\views\NavigationPage\NavigationPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |

### 60. src\views\ProfilePage\js\ProfilePageUtils.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 21 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 22 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 61. src\App.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 1 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |

### 62. src\stores\theme.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 82 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "theme" type. |

### 63. src\views\AttendancePage\AttendancePageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |

### 64. src\views\DashboardPage\DashboardPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 1 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |

### 65. src\views\DashboardPage\DashboardPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |

### 66. src\views\ProfilePage\ProfilePage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 1 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |

### 67. src\views\ScoreChangeRecordsPage\ScoreChangeRecordsPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |

## 💡 修复建议

1. 运行 `npm run lint:fix` 自动修复可修复的问题
2. 运行 `npm run lint` 查看所有问题详情
3. 手动修复无法自动修复的问题

---

*报告生成时间: 2026/1/5 18:10:50*
