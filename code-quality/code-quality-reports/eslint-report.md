# ESLint 代码规范检查报告

## 📊 总体统计

| 指标 | 数值 |
|------|------|
| 检查文件数 | 79 |
| 错误总数 | 395 |
| 警告总数 | 312 |
| 问题总数 | 707 |

## 📈 状态评估

❌ **发现 395 个错误**，需要立即修复。

## 📋 按文件类型统计

| 文件类型 | 文件数 | 错误 | 警告 |
|---------|--------|------|------|
| Vue | 36 | 312 | 105 |
| JavaScript | 43 | 83 | 207 |

## ⚠️ 有问题的文件

| 文件路径 | 错误数 | 警告数 | 状态 |
|---------|--------|--------|------|
| src\views\StudentManagerPage\StudentManagerPageDesktop.vue | 59 | 13 | ❌ |
| src\views\StudentManagerPage\StudentManagerPageMobile.vue | 42 | 16 | ❌ |
| src\views\ProfilePage\ProfilePageDesktop.vue | 0 | 55 | ⚠️ |
| src\views\AttendanceAnalysisPage\AttendanceAnalysisPageDesktop.vue | 48 | 5 | ❌ |
| src\api\StudentApi.js | 28 | 7 | ❌ |
| src\composables\admin\StudentAttendance.js | 6 | 26 | ❌ |
| src\views\AdminPage\AdminPage.js | 29 | 2 | ❌ |
| src\views\AdminPage\AdminPageDesktop.vue | 31 | 0 | ❌ |
| src\views\ProfilePage\ProfilePageMobile.vue | 21 | 10 | ❌ |
| src\views\AdminPage\AdminPageMobile.vue | 26 | 0 | ❌ |
| src\composables\admin\StudentLevel.js | 7 | 18 | ❌ |
| src\composables\admin\StudentPoints.js | 4 | 20 | ❌ |
| src\views\AllMembersPage\AllMembersPageDesktop.vue | 22 | 1 | ❌ |
| src\composables\admin\StudentPersonalInformation.js | 2 | 20 | ❌ |
| src\views\StudentManagerPage\js\StudentManagerPage-Attendance_Records_Dialog.js | 2 | 19 | ❌ |
| src\composables\admin\StudentAvatar.js | 3 | 14 | ❌ |
| src\views\PointsDashboardPage\PointsDashboardPageMobile.vue | 14 | 1 | ❌ |
| src\views\AttendancePage\AttendancePageMobile.vue | 13 | 1 | ❌ |
| src\views\PointsDashboardPage\PointsDashboardPageDesktop.vue | 12 | 1 | ❌ |
| src\views\AttendanceAnalysisPage\AttendanceAnalysisPageMobile.vue | 12 | 0 | ❌ |
| src\api\AttendanceApi.js | 0 | 10 | ⚠️ |
| src\views\PointsDashboardPage\js\PointsDashboardPageUtils.js | 0 | 9 | ⚠️ |
| src\views\AllMembersPage\js\AllMembersPageUtils.js | 0 | 8 | ⚠️ |
| src\views\AllMembersPage\js\PointsServer.js | 0 | 8 | ⚠️ |
| src\api\PointsApi.js | 0 | 6 | ⚠️ |
| src\api\student.js | 0 | 6 | ⚠️ |
| src\views\AllMembersPage\js\AdjustRecordsDialogManager.js | 0 | 6 | ⚠️ |
| src\views\StudentManagerPage\js\StudentManagerPageStudentAttendanceServer.js | 0 | 6 | ⚠️ |
| src\views\ScoreChangeRecordsPage\ScoreChangeRecordsPageMobile.vue | 5 | 0 | ❌ |
| src\views\StudentManagerPage\js\StudentManagerPage.js | 1 | 4 | ❌ |
| src\views\PointsDashboardPage\js\PointsDashboardPage.js | 1 | 3 | ❌ |
| src\views\StudentManagerPage\js\StudentManagerPageUtils.js | 0 | 4 | ⚠️ |
| src\api\StatisticsApi.js | 0 | 3 | ⚠️ |
| src\views\AllMembersPage\AllMembersPageMobile.vue | 3 | 0 | ❌ |
| src\views\RegisterPage\RegisterPage.vue | 1 | 2 | ❌ |
| src\api\StudentManagementApi.js | 0 | 2 | ⚠️ |
| src\api\super_admin.js | 0 | 2 | ⚠️ |
| src\composables\ApiInterceptor.js | 0 | 2 | ⚠️ |
| src\views\ProfilePage\js\ProfilePageUtils.js | 0 | 2 | ⚠️ |
| src\views\AdminPage\AdminPage.vue | 1 | 0 | ❌ |
| src\views\AllMembersPage\AllMembersPage.vue | 1 | 0 | ❌ |
| src\views\PointsDashboardPage\PointsDashboardPage.vue | 1 | 0 | ❌ |

## 📝 详细问题列表

### 1. src\views\StudentManagerPage\StudentManagerPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 2 | 1 | ❌ 错误 | import/order | `vue` import should occur after import of `echarts/renderers` |
| 3 | 1 | ❌ 错误 | import/order | `element-plus` import should occur after import of `echarts/renderers` |
| 16 | 1 | ❌ 错误 | import/order | There should be no empty line within import group |
| 20 | 2 | ❌ 错误 | no-unused-vars | 'Loading' is defined but never used. Allowed unused vars must match /^_/u. |
| 41 | 8 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 54 | 1 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 92 | 20 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 93 | 20 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 112 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 113 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 125 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 126 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 141 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 142 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 226 | 55 | ❌ 错误 | sonarjs/no-redundant-boolean | Refactor the code to avoid using this boolean literal. |
| 238 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'event'. |
| 265 | 7 | ❌ 错误 | no-unused-vars | 'totalAttendanceCount' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 426 | 3 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 429 | 4 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 435 | 5 | ❌ 错误 | no-use-before-define | 'initDialogHeatmapChart' was used before it was defined. |
| 443 | 3 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 451 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 463 | 3 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 466 | 4 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 472 | 5 | ❌ 错误 | no-use-before-define | 'initDialogLineChart' was used before it was defined. |
| 480 | 3 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 488 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 496 | 7 | ❌ 错误 | no-unused-vars | 'formatAttendanceTime' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 520 | 24 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 522 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 526 | 24 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 528 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 532 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 556 | 3 | ❌ 错误 | no-use-before-define | 'initCharts' was used before it was defined. |
| 564 | 4 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 570 | 2 | ❌ 错误 | no-use-before-define | 'initHeatmapChart' was used before it was defined. |
| 571 | 2 | ❌ 错误 | no-use-before-define | 'initLineChart' was used before it was defined. |
| 575 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 576 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 577 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 590 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 596 | 22 | ❌ 错误 | no-use-before-define | 'generateHeatmapData' was used before it was defined. |
| 597 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 598 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 598 | 23 | ❌ 错误 | no-undef | 'studentAttendanceRecords' is not defined. |
| 690 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 697 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 698 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 699 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 712 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 718 | 19 | ❌ 错误 | no-use-before-define | 'generateLineData' was used before it was defined. |
| 719 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 720 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 720 | 23 | ❌ 错误 | no-undef | 'studentAttendanceRecords' is not defined. |
| 733 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 820 | 22 | ❌ 错误 | no-use-before-define | 'generateHeatmapData' was used before it was defined. |
| 922 | 19 | ❌ 错误 | no-use-before-define | 'generateLineData' was used before it was defined. |
| 935 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1016 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 1018 | 9 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1045 | 4 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 1051 | 53 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 1051 | 116 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 1051 | 179 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 1075 | 13 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 1315 | 1 | ❌ 错误 | max-len | This line has a length of 125. Maximum allowed is 120. |
| 1348 | 1 | ❌ 错误 | max-len | This line has a length of 270. Maximum allowed is 120. |
| 1350 | 1 | ❌ 错误 | max-len | This line has a length of 206. Maximum allowed is 120. |
| 1355 | 1 | ❌ 错误 | max-len | This line has a length of 272. Maximum allowed is 120. |
| 1357 | 1 | ❌ 错误 | max-len | This line has a length of 208. Maximum allowed is 120. |
| 1362 | 1 | ❌ 错误 | max-len | This line has a length of 270. Maximum allowed is 120. |
| 1364 | 1 | ❌ 错误 | max-len | This line has a length of 206. Maximum allowed is 120. |

### 2. src\views\StudentManagerPage\StudentManagerPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 16 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 16 | 41 | ❌ 错误 | no-unused-vars | 'Loading' is defined but never used. Allowed unused vars must match /^_/u. |
| 20 | 10 | ❌ 错误 | no-unused-vars | 'getManagedStudents' is defined but never used. Allowed unused vars must match /^_/u. |
| 27 | 1 | ❌ 错误 | import/order | `echarts/core` import should occur before import of `element-plus` |
| 28 | 1 | ❌ 错误 | import/order | `echarts/charts` import should occur before import of `element-plus` |
| 29 | 1 | ❌ 错误 | import/order | `echarts/components` import should occur before import of `element-plus` |
| 36 | 1 | ❌ 错误 | import/order | `echarts/renderers` import should occur before import of `element-plus` |
| 74 | 20 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 75 | 20 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 94 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 95 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 107 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 108 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 123 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 124 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 199 | 1 | ❌ 错误 | max-len | This line has a length of 121. Maximum allowed is 120. |
| 204 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 205 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 221 | 62 | ❌ 错误 | no-undefined | Unexpected use of undefined. |
| 229 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 235 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'event'. |
| 261 | 7 | ❌ 错误 | no-unused-vars | 'totalAttendanceCount' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 261 | 7 | ❌ 错误 | no-shadow | 'totalAttendanceCount' is already declared in the upper scope on line 199 column 7. |
| 399 | 5 | ❌ 错误 | no-use-before-define | 'initDialogHeatmapChart' was used before it was defined. |
| 436 | 5 | ❌ 错误 | no-use-before-define | 'initDialogLineChart' was used before it was defined. |
| 460 | 7 | ❌ 错误 | no-unused-vars | 'formatAttendanceTime' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 547 | 3 | ❌ 错误 | no-use-before-define | 'initCharts' was used before it was defined. |
| 563 | 2 | ❌ 错误 | no-use-before-define | 'initHeatmapChart' was used before it was defined. |
| 564 | 2 | ❌ 错误 | no-use-before-define | 'initLineChart' was used before it was defined. |
| 568 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 569 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 570 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 583 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 589 | 22 | ❌ 错误 | no-use-before-define | 'generateHeatmapData' was used before it was defined. |
| 590 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 591 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 683 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 690 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 691 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 692 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 705 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 711 | 19 | ❌ 错误 | no-use-before-define | 'generateLineData' was used before it was defined. |
| 712 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 713 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 726 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 813 | 22 | ❌ 错误 | no-use-before-define | 'generateHeatmapData' was used before it was defined. |
| 915 | 19 | ❌ 错误 | no-use-before-define | 'generateLineData' was used before it was defined. |
| 928 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1011 | 9 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1044 | 53 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 1044 | 116 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 1044 | 179 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 1186 | 1 | ❌ 错误 | max-len | This line has a length of 124. Maximum allowed is 120. |
| 1269 | 1 | ❌ 错误 | max-len | This line has a length of 141. Maximum allowed is 120. |
| 1314 | 1 | ❌ 错误 | max-len | This line has a length of 130. Maximum allowed is 120. |
| 1416 | 1 | ❌ 错误 | max-len | This line has a length of 138. Maximum allowed is 120. |
| 1419 | 1 | ❌ 错误 | max-len | This line has a length of 142. Maximum allowed is 120. |
| 1422 | 1 | ❌ 错误 | max-len | This line has a length of 138. Maximum allowed is 120. |

### 3. src\views\ProfilePage\ProfilePageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 121 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 121 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 175 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 175 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 231 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 231 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 259 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 259 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 367 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 367 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 428 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 428 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 466 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "file" type. |
| 467 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 467 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 506 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "file" type. |
| 507 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 507 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 549 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 549 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 561 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 561 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 575 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 575 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 583 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 583 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 591 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 591 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 639 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 639 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 647 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 647 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 656 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "event" type. |
| 657 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 657 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 688 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 688 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 721 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 721 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 754 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 754 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 765 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 765 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 794 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 794 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 883 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 883 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 897 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 897 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 908 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 908 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 917 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 917 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 967 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 967 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 4. src\views\AttendanceAnalysisPage\AttendanceAnalysisPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 2 | 1 | ❌ 错误 | import/order | `vue` import should occur after import of `element-plus` |
| 3 | 1 | ❌ 错误 | import/order | `vue-router` import should occur after import of `element-plus` |
| 52 | 7 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 53 | 4 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 54 | 4 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 56 | 7 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 57 | 4 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 58 | 4 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 61 | 41 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 63 | 11 | ❌ 错误 | no-use-before-define | 'initPeriodChart' was used before it was defined. |
| 64 | 11 | ❌ 错误 | no-use-before-define | 'initTimelineChart' was used before it was defined. |
| 72 | 26 | ❌ 错误 | sonarjs/no-identical-functions | Update this function so that its implementation is not identical to the one on line 50. |
| 74 | 7 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 75 | 4 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 76 | 4 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 78 | 7 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 79 | 4 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 80 | 4 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 83 | 41 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 85 | 11 | ❌ 错误 | no-use-before-define | 'initPeriodChart' was used before it was defined. |
| 86 | 11 | ❌ 错误 | no-use-before-define | 'initTimelineChart' was used before it was defined. |
| 157 | 9 | ❌ 错误 | no-use-before-define | 'loadTimelineData' was used before it was defined. |
| 160 | 4 | ❌ 错误 | no-use-before-define | 'updateTimelineChart' was used before it was defined. |
| 163 | 11 | ❌ 错误 | no-use-before-define | 'initTimelineChart' was used before it was defined. |
| 174 | 10 | ❌ 错误 | no-use-before-define | 'loadTimelineData' was used before it was defined. |
| 177 | 5 | ❌ 错误 | no-use-before-define | 'updateTimelineChart' was used before it was defined. |
| 180 | 12 | ❌ 错误 | no-use-before-define | 'initTimelineChart' was used before it was defined. |
| 218 | 1 | ❌ 错误 | max-len | This line has a length of 165. Maximum allowed is 120. |
| 218 | 33 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 218 | 87 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 218 | 143 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 247 | 28 | ⚠️ 警告 | no-await-in-loop | Unexpected `await` inside a loop. |
| 248 | 6 | ⚠️ 警告 | max-depth | Blocks are nested too deeply (5). Maximum allowed is 4. |
| 302 | 4 | ❌ 错误 | no-use-before-define | 'updatePeriodChart' was used before it was defined. |
| 309 | 27 | ⚠️ 警告 | complexity | Arrow function has a complexity of 27. Maximum allowed is 15. |
| 511 | 5 | ❌ 错误 | no-use-before-define | 'updateTimelineChart' was used before it was defined. |
| 519 | 29 | ⚠️ 警告 | complexity | Arrow function has a complexity of 60. Maximum allowed is 15. |
| 553 | 14 | ❌ 错误 | no-shadow | 'data' is already declared in the upper scope on line 523 column 8. |
| 661 | 14 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 740 | 48 | ❌ 错误 | radix | Missing radix parameter. |
| 747 | 12 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 747 | 12 | ❌ 错误 | no-shadow | 'data' is already declared in the upper scope on line 523 column 8. |
| 888 | 26 | ⚠️ 警告 | complexity | Async arrow function has a complexity of 22. Maximum allowed is 15. |
| 902 | 1 | ❌ 错误 | max-len | This line has a length of 140. Maximum allowed is 120. |
| 911 | 1 | ❌ 错误 | max-len | This line has a length of 131. Maximum allowed is 120. |
| 924 | 1 | ❌ 错误 | max-len | This line has a length of 155. Maximum allowed is 120. |
| 925 | 1 | ❌ 错误 | max-len | This line has a length of 129. Maximum allowed is 120. |
| 938 | 1 | ❌ 错误 | max-len | This line has a length of 122. Maximum allowed is 120. |
| 939 | 1 | ❌ 错误 | max-len | This line has a length of 123. Maximum allowed is 120. |
| 946 | 1 | ❌ 错误 | max-len | This line has a length of 149. Maximum allowed is 120. |
| 954 | 1 | ❌ 错误 | max-len | This line has a length of 152. Maximum allowed is 120. |
| 1017 | 5 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1200 | 1 | ❌ 错误 | max-len | This line has a length of 137. Maximum allowed is 120. |

### 5. src\api\StudentApi.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 1 | 58 | ❌ 错误 | semi | Extra semicolon. |
| 2 | 30 | ❌ 错误 | semi | Extra semicolon. |
| 5 | 46 | ❌ 错误 | semi | Extra semicolon. |
| 12 | 29 | ❌ 错误 | comma-dangle | Unexpected trailing comma. |
| 13 | 6 | ❌ 错误 | comma-dangle | Unexpected trailing comma. |
| 14 | 6 | ❌ 错误 | semi | Extra semicolon. |
| 15 | 24 | ❌ 错误 | semi | Extra semicolon. |
| 18 | 38 | ❌ 错误 | semi | Extra semicolon. |
| 20 | 42 | ❌ 错误 | semi | Extra semicolon. |
| 22 | 50 | ❌ 错误 | semi | Extra semicolon. |
| 25 | 46 | ❌ 错误 | semi | Extra semicolon. |
| 32 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 33 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "avatarSize" type. |
| 34 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 38 | 15 | ❌ 错误 | semi | Extra semicolon. |
| 40 | 99 | ❌ 错误 | semi | Extra semicolon. |
| 45 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 46 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 51 | 49 | ❌ 错误 | comma-dangle | Unexpected trailing comma. |
| 52 | 6 | ❌ 错误 | semi | Extra semicolon. |
| 53 | 24 | ❌ 错误 | semi | Extra semicolon. |
| 56 | 38 | ❌ 错误 | semi | Extra semicolon. |
| 58 | 36 | ❌ 错误 | semi | Extra semicolon. |
| 60 | 50 | ❌ 错误 | semi | Extra semicolon. |
| 63 | 45 | ❌ 错误 | semi | Extra semicolon. |
| 69 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 70 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 75 | 22 | ❌ 错误 | comma-dangle | Unexpected trailing comma. |
| 76 | 6 | ❌ 错误 | semi | Extra semicolon. |
| 77 | 24 | ❌ 错误 | semi | Extra semicolon. |
| 80 | 38 | ❌ 错误 | semi | Extra semicolon. |
| 82 | 36 | ❌ 错误 | semi | Extra semicolon. |
| 84 | 50 | ❌ 错误 | semi | Extra semicolon. |
| 87 | 53 | ❌ 错误 | semi | Extra semicolon. |
| 93 | 26 | ❌ 错误 | semi | Extra semicolon. |

### 6. src\composables\admin\StudentAttendance.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 14 | 1 | ⚠️ 警告 | jsdoc/require-returns | Missing JSDoc @returns declaration. |
| 37 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 58 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 59 | 1 | ⚠️ 警告 | jsdoc/check-param-names | Expected @param names to be "studentId, _params". Got "studentId, params, _params". |
| 59 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "params" type. |
| 60 | 1 | ⚠️ 警告 | jsdoc/require-param-description | Missing JSDoc @param "_params" description. |
| 60 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "_params" type. |
| 61 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 83 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 85 | 42 | ❌ 错误 | no-return-await | Redundant use of `await` on a return value. |
| 89 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 90 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 110 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "attendanceInfo" type. |
| 139 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 174 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "time" type. |
| 175 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 189 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "time" type. |
| 190 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 209 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "time" type. |
| 210 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 229 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "attendanceRecords" type. |
| 230 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 244 | 6 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 247 | 6 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 250 | 6 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 253 | 6 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 263 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "status" type. |
| 264 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 279 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "status" type. |
| 280 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 301 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 303 | 27 | ❌ 错误 | no-return-await | Redundant use of `await` on a return value. |

### 7. src\views\AdminPage\AdminPage.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 533 | 60 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 536 | 6 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 537 | 6 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 545 | 6 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 546 | 6 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 550 | 7 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 553 | 7 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 554 | 7 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 558 | 6 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 559 | 6 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 570 | 1 | ⚠️ 警告 | jsdoc/require-param-description | Missing JSDoc @param "student" description. |
| 570 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "student" type. |
| 573 | 3 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 574 | 3 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 748 | 17 | ❌ 错误 | no-use-before-define | 'getDateAttendanceTimes' was used before it was defined. |
| 773 | 5 | ❌ 错误 | no-use-before-define | 'initHeatmapChart' was used before it was defined. |
| 774 | 5 | ❌ 错误 | no-use-before-define | 'initLineChart' was used before it was defined. |
| 928 | 23 | ❌ 错误 | no-use-before-define | 'generateHeatmapData' was used before it was defined. |
| 950 | 12 | ❌ 错误 | no-shadow | 'timeSlots' is already declared in the upper scope on line 210 column 8. |
| 1054 | 20 | ❌ 错误 | no-use-before-define | 'generateLineData' was used before it was defined. |
| 1182 | 9 | ❌ 错误 | no-shadow | 'timeSlots' is already declared in the upper scope on line 210 column 8. |
| 1296 | 28 | ❌ 错误 | sonarjs/no-identical-functions | Update this function so that its implementation is not identical to the one on line 1265. |
| 1346 | 11 | ❌ 错误 | no-use-before-define | 'loadAllData' was used before it was defined. |
| 1418 | 7 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'label'. |
| 1438 | 10 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'node'. |
| 1440 | 10 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'node'. |
| 1441 | 10 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'node'. |
| 1442 | 10 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'node'. |
| 1443 | 10 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'node'. |
| 1563 | 3 | ❌ 错误 | no-use-before-define | 'updateAttendanceTime' was used before it was defined. |
| 1586 | 3 | ❌ 错误 | no-use-before-define | 'updateAttendanceTime' was used before it was defined. |

### 8. src\views\AdminPage\AdminPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 49 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 66 | 1 | ❌ 错误 | import/order | `@/api/student` import should occur before import of `./AdminPage.js` |
| 74 | 2 | ❌ 错误 | no-unused-vars | 'authError' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 80 | 2 | ❌ 错误 | no-unused-vars | 'students' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 100 | 2 | ❌ 错误 | no-unused-vars | 'scrollPosition' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 103 | 2 | ❌ 错误 | no-unused-vars | 'filteredStudentAttendanceRecords' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 108 | 2 | ❌ 错误 | no-unused-vars | 'heatmapInstance' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 109 | 2 | ❌ 错误 | no-unused-vars | 'lineInstance' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 141 | 2 | ❌ 错误 | no-unused-vars | 'loadStudentLevels' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 142 | 2 | ❌ 错误 | no-unused-vars | 'loadStudentAttendanceCounts' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 143 | 2 | ❌ 错误 | no-unused-vars | 'loadStudentAdmins' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 145 | 2 | ❌ 错误 | no-unused-vars | 'loadStatistics' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 169 | 2 | ❌ 错误 | no-unused-vars | 'generateHeatmapData' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 170 | 2 | ❌ 错误 | no-unused-vars | 'generateLineData' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 175 | 2 | ❌ 错误 | no-unused-vars | 'getShortcutDate' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 185 | 2 | ❌ 错误 | no-unused-vars | 'updateAttendanceTime' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 202 | 7 | ❌ 错误 | no-unused-vars | 'monthMap' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 218 | 7 | ❌ 错误 | no-unused-vars | 'monthObserver' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 224 | 24 | ❌ 错误 | no-undef | 'adminStore' is not defined. |
| 233 | 4 | ❌ 错误 | no-undef | 'adminStore' is not defined. |
| 434 | 1 | ❌ 错误 | max-len | This line has a length of 173. Maximum allowed is 120. |
| 454 | 1 | ❌ 错误 | max-len | This line has a length of 237. Maximum allowed is 120. |
| 457 | 1 | ❌ 错误 | max-len | This line has a length of 143. Maximum allowed is 120. |
| 458 | 1 | ❌ 错误 | max-len | This line has a length of 162. Maximum allowed is 120. |
| 809 | 1 | ❌ 错误 | max-len | This line has a length of 126. Maximum allowed is 120. |
| 862 | 1 | ❌ 错误 | max-len | This line has a length of 139. Maximum allowed is 120. |
| 991 | 1 | ❌ 错误 | max-len | This line has a length of 130. Maximum allowed is 120. |
| 1128 | 1 | ❌ 错误 | max-len | This line has a length of 133. Maximum allowed is 120. |
| 1195 | 1 | ❌ 错误 | max-len | This line has a length of 123. Maximum allowed is 120. |
| 1205 | 1 | ❌ 错误 | max-len | This line has a length of 141. Maximum allowed is 120. |
| 1229 | 1 | ❌ 错误 | max-len | This line has a length of 145. Maximum allowed is 120. |

### 9. src\views\ProfilePage\ProfilePageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 28 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 153 | 5 | ⚠️ 警告 | no-negated-condition | Unexpected negated condition. |
| 204 | 10 | ❌ 错误 | no-use-before-define | 'loadAvatar' was used before it was defined. |
| 280 | 9 | ❌ 错误 | no-use-before-define | 'showCropDialog' was used before it was defined. |
| 287 | 4 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'event'. |
| 294 | 3 | ❌ 错误 | no-use-before-define | 'resetForm' was used before it was defined. |
| 313 | 3 | ❌ 错误 | no-use-before-define | 'resetPasswordForm' was used before it was defined. |
| 428 | 1 | ⚠️ 警告 | jsdoc/require-returns | Missing JSDoc @returns declaration. |
| 430 | 1 | ⚠️ 警告 | jsdoc/require-param-description | Missing JSDoc @param "file" description. |
| 430 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "file" type. |
| 432 | 35 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 452 | 7 | ❌ 错误 | no-use-before-define | 'initCrop' was used before it was defined. |
| 523 | 9 | ❌ 错误 | no-shadow | 'imgMinSide' is already declared in the upper scope on line 504 column 8. |
| 525 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 532 | 2 | ❌ 错误 | no-use-before-define | 'drawCropCanvas' was used before it was defined. |
| 533 | 2 | ❌ 错误 | no-use-before-define | 'setupCropEvents' was used before it was defined. |
| 656 | 2 | ❌ 错误 | no-use-before-define | 'removeCropEvents' was used before it was defined. |
| 721 | 10 | ❌ 错误 | no-shadow | 'canvas' is already declared in the upper scope on line 658 column 8. |
| 771 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 772 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 796 | 10 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 797 | 10 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 841 | 10 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 999 | 30 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 1063 | 11 | ❌ 错误 | no-use-before-define | 'uploadAvatarFile' was used before it was defined. |
| 1078 | 1 | ⚠️ 警告 | jsdoc/require-returns | Missing JSDoc @returns declaration. |
| 1080 | 1 | ⚠️ 警告 | jsdoc/require-param-description | Missing JSDoc @param "file" description. |
| 1080 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "file" type. |
| 1081 | 1 | ⚠️ 警告 | jsdoc/require-param-description | Missing JSDoc @param "maxSize" description. |
| 1081 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "maxSize" type. |
| 1083 | 7 | ❌ 错误 | no-unused-vars | 'compressImage' is assigned a value but never used. Allowed unused vars must match /^_/u. |

### 10. src\views\AdminPage\AdminPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 8 | 1 | ❌ 错误 | import/order | `element-plus` import should occur before import of `vue` |
| 50 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `vue` |
| 67 | 1 | ❌ 错误 | import/order | `@/api/student` import should occur before import of `./AdminPage.js` |
| 69 | 1 | ❌ 错误 | import/order | `element-plus/dist/locale/zh-cn.mjs` import should occur before import of `vue` |
| 77 | 2 | ❌ 错误 | no-unused-vars | 'authError' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 83 | 2 | ❌ 错误 | no-unused-vars | 'students' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 103 | 2 | ❌ 错误 | no-unused-vars | 'scrollPosition' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 106 | 2 | ❌ 错误 | no-unused-vars | 'filteredStudentAttendanceRecords' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 111 | 2 | ❌ 错误 | no-unused-vars | 'heatmapInstance' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 112 | 2 | ❌ 错误 | no-unused-vars | 'lineInstance' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 144 | 2 | ❌ 错误 | no-unused-vars | 'loadStudentLevels' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 145 | 2 | ❌ 错误 | no-unused-vars | 'loadStudentAttendanceCounts' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 146 | 2 | ❌ 错误 | no-unused-vars | 'loadStudentAdmins' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 148 | 2 | ❌ 错误 | no-unused-vars | 'loadStatistics' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 172 | 2 | ❌ 错误 | no-unused-vars | 'generateHeatmapData' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 173 | 2 | ❌ 错误 | no-unused-vars | 'generateLineData' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 178 | 2 | ❌ 错误 | no-unused-vars | 'getShortcutDate' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 188 | 2 | ❌ 错误 | no-unused-vars | 'updateAttendanceTime' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 205 | 7 | ❌ 错误 | no-unused-vars | 'monthMap' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 221 | 7 | ❌ 错误 | no-unused-vars | 'monthObserver' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 227 | 24 | ❌ 错误 | no-undef | 'adminStore' is not defined. |
| 236 | 4 | ❌ 错误 | no-undef | 'adminStore' is not defined. |
| 246 | 9 | ❌ 错误 | no-undef | 'nextTick' is not defined. |
| 454 | 1 | ❌ 错误 | max-len | This line has a length of 149. Maximum allowed is 120. |
| 479 | 1 | ❌ 错误 | max-len | This line has a length of 196. Maximum allowed is 120. |
| 487 | 1 | ❌ 错误 | max-len | This line has a length of 123. Maximum allowed is 120. |

### 11. src\composables\admin\StudentLevel.js

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

### 12. src\composables\admin\StudentPoints.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 14 | 1 | ⚠️ 警告 | jsdoc/require-returns | Missing JSDoc @returns declaration. |
| 56 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 57 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 68 | 51 | ❌ 错误 | no-undefined | Unexpected use of undefined. |
| 86 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentIds" type. |
| 87 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 99 | 20 | ⚠️ 警告 | no-await-in-loop | Unexpected `await` inside a loop. |
| 119 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 120 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 126 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "student" type. |
| 151 | 3 | ❌ 错误 | no-use-before-define | 'resetPointsForm' was used before it was defined. |
| 156 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "formRef" type. |
| 157 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 223 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "formRef" type. |
| 234 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "student" type. |
| 235 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 290 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "records" type. |
| 291 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 302 | 17 | ❌ 错误 | no-use-before-define | 'formatTime' was used before it was defined. |
| 308 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "time" type. |
| 309 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 326 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 340 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 342 | 24 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |

### 13. src\views\AllMembersPage\AllMembersPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 2 | 1 | ❌ 错误 | import/order | `vue` import should occur after import of `element-plus` |
| 3 | 1 | ❌ 错误 | import/order | `vue-router` import should occur after import of `element-plus` |
| 5 | 1 | ❌ 错误 | import/order | `@/stores/theme` import should occur after import of `@/api/attendance` |
| 19 | 63 | ❌ 错误 | no-unused-vars | 'View' is defined but never used. Allowed unused vars must match /^_/u. |
| 24 | 47 | ❌ 错误 | no-unused-vars | 'ElTooltip' is defined but never used. Allowed unused vars must match /^_/u. |
| 42 | 7 | ❌ 错误 | no-unused-vars | 'totalRankingTopN' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 251 | 7 | ❌ 错误 | no-unused-vars | 'recordsDialogVisible' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 252 | 7 | ❌ 错误 | no-unused-vars | 'currentStudent' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 253 | 7 | ❌ 错误 | no-unused-vars | 'allRecords' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 254 | 7 | ❌ 错误 | no-unused-vars | 'recordsLoading' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 338 | 13 | ❌ 错误 | no-shadow | 'totalCount' is already declared in the upper scope on line 52 column 7. |
| 368 | 17 | ❌ 错误 | no-use-before-define | 'formatGrade' was used before it was defined. |
| 450 | 13 | ❌ 错误 | no-shadow | 'totalCount' is already declared in the upper scope on line 52 column 7. |
| 480 | 17 | ❌ 错误 | no-use-before-define | 'formatGrade' was used before it was defined. |
| 607 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 608 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 612 | 7 | ❌ 错误 | no-unused-vars | 'loadSignInRanking' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 751 | 19 | ❌ 错误 | radix | Missing radix parameter. |
| 789 | 53 | ⚠️ 警告 | complexity | Arrow function has a complexity of 17. Maximum allowed is 15. |
| 810 | 31 | ❌ 错误 | no-undefined | Unexpected use of undefined. |
| 813 | 32 | ❌ 错误 | no-undefined | Unexpected use of undefined. |
| 816 | 45 | ❌ 错误 | no-undefined | Unexpected use of undefined. |
| 1042 | 1 | ❌ 错误 | max-len | This line has a length of 124. Maximum allowed is 120. |

### 14. src\composables\admin\StudentPersonalInformation.js

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

### 15. src\views\StudentManagerPage\js\StudentManagerPage-Attendance_Records_Dialog.js

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

### 16. src\composables\admin\StudentAvatar.js

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

### 17. src\views\PointsDashboardPage\PointsDashboardPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 2 | 1 | ❌ 错误 | import/order | `vue` import should occur after import of `element-plus` |
| 3 | 1 | ❌ 错误 | import/order | `vue-router` import should occur after import of `element-plus` |
| 5 | 1 | ❌ 错误 | import/order | `@/stores/theme` import should occur after import of `@/api/StudentApi` |
| 18 | 47 | ❌ 错误 | no-unused-vars | 'View' is defined but never used. Allowed unused vars must match /^_/u. |
| 91 | 2 | ❌ 错误 | no-use-before-define | 'handleTabChange' was used before it was defined. |
| 388 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 389 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 403 | 1 | ❌ 错误 | max-len | This line has a length of 121. Maximum allowed is 120. |
| 416 | 4 | ⚠️ 警告 | no-negated-condition | Unexpected negated condition. |
| 588 | 54 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 617 | 7 | ❌ 错误 | no-unused-vars | 'refreshTimer' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 620 | 7 | ❌ 错误 | no-unused-vars | 'refreshData' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 733 | 19 | ❌ 错误 | radix | Missing radix parameter. |
| 1036 | 1 | ❌ 错误 | max-len | This line has a length of 165. Maximum allowed is 120. |
| 1049 | 1 | ❌ 错误 | max-len | This line has a length of 128. Maximum allowed is 120. |

### 18. src\views\AttendancePage\AttendancePageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 12 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 110 | 10 | ❌ 错误 | no-use-before-define | 'isSlotSigned' was used before it was defined. |
| 152 | 42 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 230 | 35 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 245 | 33 | ⚠️ 警告 | complexity | Async arrow function has a complexity of 23. Maximum allowed is 15. |
| 322 | 20 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 327 | 3 | ❌ 错误 | no-use-before-define | 'loadStudentLevel' was used before it was defined. |
| 378 | 1 | ❌ 错误 | max-len | This line has a length of 137. Maximum allowed is 120. |
| 418 | 1 | ❌ 错误 | max-len | This line has a length of 153. Maximum allowed is 120. |
| 419 | 1 | ❌ 错误 | max-len | This line has a length of 177. Maximum allowed is 120. |
| 420 | 1 | ❌ 错误 | max-len | This line has a length of 154. Maximum allowed is 120. |
| 433 | 1 | ❌ 错误 | max-len | This line has a length of 145. Maximum allowed is 120. |
| 446 | 1 | ❌ 错误 | max-len | This line has a length of 149. Maximum allowed is 120. |
| 459 | 1 | ❌ 错误 | max-len | This line has a length of 145. Maximum allowed is 120. |

### 19. src\views\PointsDashboardPage\PointsDashboardPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 2 | 1 | ❌ 错误 | import/order | `vue` import should occur after import of `element-plus` |
| 3 | 1 | ❌ 错误 | import/order | `vue-router` import should occur after import of `element-plus` |
| 5 | 1 | ❌ 错误 | import/order | `@/stores/theme` import should occur after import of `@/api/StudentApi` |
| 19 | 53 | ❌ 错误 | no-unused-vars | 'View' is defined but never used. Allowed unused vars must match /^_/u. |
| 280 | 2 | ❌ 错误 | no-use-before-define | 'handleTabChange' was used before it was defined. |
| 598 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 599 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 613 | 1 | ❌ 错误 | max-len | This line has a length of 121. Maximum allowed is 120. |
| 626 | 4 | ⚠️ 警告 | no-negated-condition | Unexpected negated condition. |
| 792 | 54 | ❌ 错误 | sonarjs/no-identical-functions | Update this function so that its implementation is not identical to the one on line 712. |
| 961 | 19 | ❌ 错误 | radix | Missing radix parameter. |
| 1288 | 1 | ❌ 错误 | max-len | This line has a length of 165. Maximum allowed is 120. |
| 1301 | 1 | ❌ 错误 | max-len | This line has a length of 128. Maximum allowed is 120. |

### 20. src\views\AttendanceAnalysisPage\AttendanceAnalysisPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 2 | 1 | ❌ 错误 | import/order | `vue` import should occur after import of `element-plus` |
| 3 | 1 | ❌ 错误 | import/order | `vue-router` import should occur after import of `element-plus` |
| 78 | 24 | ❌ 错误 | no-use-before-define | 'calculatePeriodStats' was used before it was defined. |
| 86 | 5 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 87 | 25 | ❌ 错误 | no-use-before-define | 'calculateAverageTime' was used before it was defined. |
| 93 | 5 | ❌ 错误 | no-use-before-define | 'initChartsWithTheme' was used before it was defined. |
| 119 | 11 | ❌ 错误 | no-use-before-define | 'initTimelineChart' was used before it was defined. |
| 133 | 4 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 135 | 4 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 137 | 4 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 268 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 511 | 1 | ❌ 错误 | max-len | This line has a length of 125. Maximum allowed is 120. |

### 21. src\api\AttendanceApi.js

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

### 22. src\views\PointsDashboardPage\js\PointsDashboardPageUtils.js

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

### 23. src\views\AllMembersPage\js\AllMembersPageUtils.js

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

### 24. src\views\AllMembersPage\js\PointsServer.js

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

### 25. src\api\PointsApi.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 8 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 9 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 23 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "top" type. |
| 24 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 37 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 38 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 26. src\api\student.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 490 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 491 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "file" type. |
| 492 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 567 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 568 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "avatarSize" type. |
| 569 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 27. src\views\AllMembersPage\js\AdjustRecordsDialogManager.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 27 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "student" type. |
| 77 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 85 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "time" type. |
| 86 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 110 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "points" type. |
| 111 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 28. src\views\StudentManagerPage\js\StudentManagerPageStudentAttendanceServer.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 12 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 13 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 36 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "dateStr" type. |
| 37 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "slot" type. |
| 38 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentAttendanceRecords" type. |
| 39 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 29. src\views\ScoreChangeRecordsPage\ScoreChangeRecordsPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 10 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 10 | 21 | ❌ 错误 | no-unused-vars | 'Loading' is defined but never used. Allowed unused vars must match /^_/u. |
| 12 | 1 | ❌ 错误 | import/order | `@/api/points` import should occur before import of `@/stores/theme` |
| 13 | 1 | ❌ 错误 | import/order | `@/api/student` import should occur before import of `@/stores/theme` |
| 189 | 1 | ❌ 错误 | max-len | This line has a length of 149. Maximum allowed is 120. |

### 30. src\views\StudentManagerPage\js\StudentManagerPage.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 16 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 17 | 1 | ⚠️ 警告 | jsdoc/require-param-description | Missing JSDoc @param "adminStudentDatabaseTableId" description. |
| 17 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "adminStudentDatabaseTableId" type. |
| 18 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 30 | 5 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |

### 31. src\views\PointsDashboardPage\js\PointsDashboardPage.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 35 | 8 | ❌ 错误 | sonarjs/no-identical-functions | Update this function so that its implementation is not identical to the one on line 24. |
| 45 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 46 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "type" type. |
| 47 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 32. src\views\StudentManagerPage\js\StudentManagerPageUtils.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 8 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 9 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 17 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 18 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 33. src\api\StatisticsApi.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 8 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "startRank" type. |
| 9 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "endRank" type. |
| 10 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 34. src\views\AllMembersPage\AllMembersPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 2 | 35 | ❌ 错误 | no-unused-vars | 'View' is defined but never used. Allowed unused vars must match /^_/u. |
| 44 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 45 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |

### 35. src\views\RegisterPage\RegisterPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 12 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 84 | 12 | ⚠️ 警告 | no-negated-condition | Unexpected negated condition. |
| 106 | 5 | ⚠️ 警告 | no-negated-condition | Unexpected negated condition. |

### 36. src\api\StudentManagementApi.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 8 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 9 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 37. src\api\super_admin.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 15 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "specialPassword" type. |
| 16 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 38. src\composables\ApiInterceptor.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 11 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 28 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "api" type. |

### 39. src\views\ProfilePage\js\ProfilePageUtils.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 9 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "file" type. |
| 10 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 40. src\views\AdminPage\AdminPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 5 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |

### 41. src\views\AllMembersPage\AllMembersPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 5 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |

### 42. src\views\PointsDashboardPage\PointsDashboardPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 5 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |

## 💡 修复建议

1. 运行 `npm run lint:fix` 自动修复可修复的问题
2. 运行 `npm run lint` 查看所有问题详情
3. 手动修复无法自动修复的问题

---

*报告生成时间: 2026/1/4 23:26:03*
