# ESLint 代码规范检查报告

## 📊 总体统计

| 指标 | 数值 |
|------|------|
| 检查文件数 | 78 |
| 错误总数 | 1208 |
| 警告总数 | 857 |
| 问题总数 | 2065 |

## 📈 状态评估

❌ **发现 1208 个错误**，需要立即修复。

## 📋 按文件类型统计

| 文件类型 | 文件数 | 错误 | 警告 |
|---------|--------|------|------|
| Vue | 36 | 1142 | 361 |
| JavaScript | 42 | 66 | 496 |

## ⚠️ 有问题的文件

| 文件路径 | 错误数 | 警告数 | 状态 |
|---------|--------|--------|------|
| src\views\AdminPage\AdminPageMobile.vue | 466 | 2 | ❌ |
| src\views\AdminPage\AdminPageDesktop.vue | 165 | 0 | ❌ |
| src\views\StudentManagerPage\StudentManagerPageMobile.vue | 105 | 43 | ❌ |
| src\views\AdminPage\AdminPage.js | 29 | 98 | ❌ |
| src\views\AttendancePage\AttendancePageMobile.vue | 93 | 6 | ❌ |
| src\views\StudentManagerPage\StudentManagerPageDesktop.vue | 61 | 36 | ❌ |
| src\views\AttendanceAnalysisPage\AttendanceAnalysisPageDesktop.vue | 48 | 41 | ❌ |
| src\api\student.js | 0 | 82 | ⚠️ |
| src\views\AttendanceAnalysisPage\AttendanceAnalysisPageMobile.vue | 60 | 19 | ❌ |
| src\api\attendance.js | 0 | 63 | ⚠️ |
| src\views\ProfilePage\ProfilePageDesktop.vue | 1 | 59 | ❌ |
| src\composables\admin\StudentAttendance.js | 10 | 29 | ❌ |
| src\views\ProfilePage\ProfilePageMobile.vue | 22 | 13 | ❌ |
| src\views\AttendancePage\AttendancePageDesktop.vue | 16 | 16 | ❌ |
| src\views\PointsDashboardPage\PointsDashboardPageDesktop.vue | 13 | 19 | ❌ |
| src\views\AllMembersPage\AllMembersPageDesktop.vue | 23 | 8 | ❌ |
| src\composables\admin\StudentPoints.js | 6 | 23 | ❌ |
| src\composables\admin\StudentLevel.js | 7 | 18 | ❌ |
| src\composables\admin\StudentPersonalInformation.js | 2 | 20 | ❌ |
| src\views\PointsDashboardPage\PointsDashboardPageMobile.vue | 16 | 5 | ❌ |
| src\views\StudentManagerPage\js\StudentManagerPage-Attendance_Records_Dialog.js | 2 | 19 | ❌ |
| src\views\AllMembersPage\AllMembersPageMobile.vue | 3 | 16 | ❌ |
| src\composables\admin\StudentAvatar.js | 3 | 14 | ❌ |
| src\views\DashboardPage\DashboardPageDesktop.vue | 0 | 17 | ⚠️ |
| src\api\StudentApi.js | 0 | 14 | ⚠️ |
| src\api\points.js | 0 | 14 | ⚠️ |
| src\views\NavigationPage\NavigationPageMobile.vue | 2 | 11 | ❌ |
| src\api\AttendanceApi.js | 0 | 10 | ⚠️ |
| src\views\LoginPage\LoginPage.vue | 6 | 4 | ❌ |
| src\stores\admin.js | 5 | 4 | ❌ |
| src\views\NavigationPage\NavigationPageDesktop.vue | 0 | 9 | ⚠️ |
| src\views\PointsDashboardPage\js\PointsDashboardPageUtils.js | 0 | 9 | ⚠️ |
| src\views\ScoreChangeRecordsPage\ScoreChangeRecordsPageMobile.vue | 5 | 4 | ❌ |
| src\views\AllMembersPage\js\AllMembersPageUtils.js | 0 | 8 | ⚠️ |
| src\views\AllMembersPage\js\PointsServer.js | 0 | 8 | ⚠️ |
| src\views\AttendancePage\AttendancePage.vue | 6 | 2 | ❌ |
| src\views\PointsDashboardPage\js\PointsDashboardPage.js | 1 | 7 | ❌ |
| src\views\RegisterPage\RegisterPage.vue | 1 | 7 | ❌ |
| src\api\PointsApi.js | 0 | 6 | ⚠️ |
| src\views\AdminPage\AdminPage.vue | 4 | 2 | ❌ |
| src\views\AllMembersPage\js\AdjustRecordsDialogManager.js | 0 | 6 | ⚠️ |
| src\views\AllMembersPage\js\PersonalInformation.js | 0 | 6 | ⚠️ |
| src\views\StudentManagerPage\js\StudentManagerPageStudentAttendanceServer.js | 0 | 6 | ⚠️ |
| src\components\ThemeToggle.vue | 1 | 4 | ❌ |
| src\views\StudentManagerPage\js\StudentManagerPage.js | 1 | 4 | ❌ |
| src\api\StatisticsApi.js | 0 | 4 | ⚠️ |
| src\router\index.js | 0 | 4 | ⚠️ |
| src\views\AllMembersPage\AllMembersPage.vue | 3 | 1 | ❌ |
| src\views\HomePage\HomePage.vue | 2 | 2 | ❌ |
| src\views\HomePage\HomePageDesktop.vue | 3 | 1 | ❌ |
| src\views\PointsDashboardPage\PointsDashboardPage.vue | 3 | 1 | ❌ |
| src\views\ProfilePage\ProfilePage.vue | 3 | 1 | ❌ |
| src\views\ScoreChangeRecordsPage\ScoreChangeRecordsPageDesktop.vue | 0 | 4 | ⚠️ |
| src\views\StudentManagerPage\js\StudentManagerPageUtils.js | 0 | 4 | ⚠️ |
| src\App.vue | 2 | 1 | ❌ |
| src\api\super_admin.js | 0 | 3 | ⚠️ |
| src\stores\user.js | 0 | 3 | ⚠️ |
| src\views\DashboardPage\DashboardPage.vue | 2 | 1 | ❌ |
| src\views\HomePage\js\HomePage.js | 0 | 3 | ⚠️ |
| src\views\NavigationPage\NavigationPage.vue | 2 | 1 | ❌ |
| src\views\ScoreChangeRecordsPage\ScoreChangeRecordsPage.vue | 2 | 1 | ❌ |
| src\views\StudentManagerPage\StudentManagerPage.vue | 2 | 1 | ❌ |
| src\api\StudentManagementApi.js | 0 | 2 | ⚠️ |
| src\composables\ApiInterceptor.js | 0 | 2 | ⚠️ |
| src\views\DashboardPage\DashboardPageMobile.vue | 0 | 2 | ⚠️ |
| src\views\HomePage\HomePageMobile.vue | 1 | 1 | ❌ |
| src\views\ProfilePage\js\ProfilePageUtils.js | 0 | 2 | ⚠️ |
| src\stores\theme.js | 0 | 1 | ⚠️ |

## 📝 详细问题列表

### 1. src\views\AdminPage\AdminPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 9 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "features". |
| 26 | 1 | ❌ 错误 | import/order | There should be no empty line within import group |
| 26 | 1 | ❌ 错误 | import/order | `element-plus` import should occur before import of `vue` |
| 27 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 全局提示组件'. |
| 28 | 9 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 图标容器组件'. |
| 29 | 10 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 输入框组件'. |
| 30 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 按钮组件'. |
| 31 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 下拉选择器组件'. |
| 32 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 下拉选项组件'. |
| 33 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 对话框组件'. |
| 34 | 9 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 表单组件'. |
| 35 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 表单项组件'. |
| 36 | 15 | ❌ 错误 | comma-spacing | A space is required after ','. |
| 38 | 9 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 标签页组件'. |
| 39 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 标签页面板组件'. |
| 40 | 8 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 标签组件'. |
| 41 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 提示框组件'. |
| 43 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历组件'. |
| 71 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `vue` |
| 72 | 7 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 用户图标'. |
| 73 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历图标'. |
| 74 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 趋势图图标'. |
| 75 | 9 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 搜索图标'. |
| 76 | 10 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 刷新图标'. |
| 77 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 切换按钮图标'. |
| 78 | 7 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 编辑图标'. |
| 79 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 填充用户图标'. |
| 80 | 8 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 时钟图标'. |
| 81 | 10 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 警告图标'. |
| 82 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 文档图标'. |
| 83 | 10 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 加载图标'. |
| 84 | 6 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 盒子图标'. |
| 85 | 6 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 锁图标'. |
| 89 | 1 | ❌ 错误 | import/order | `@/api/student` import should occur before import of `./AdminPage.js` |
| 92 | 1 | ❌ 错误 | import/order | `element-plus/dist/locale/zh-cn.mjs` import should occur before import of `vue` |
| 107 | 7 | ❌ 错误 | no-unused-vars | 'monthMap' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 123 | 7 | ❌ 错误 | no-unused-vars | 'monthObserver' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 137 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 是否已通过身份验证（布...'. |
| 138 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 超级管理员验证密码（字...'. |
| 139 | 2 | ❌ 错误 | no-unused-vars | 'authError' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 139 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 身份验证错误信息（字符...'. |
| 140 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 身份验证加载状态（布尔...'. |
| 141 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 全局数据加载状态（布尔...'. |
| 142 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 核心数据是否加载完成（...'. |
| 143 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 数据加载进度（百分比，...'. |
| 144 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 数据加载状态文本（字符...'. |
| 145 | 2 | ❌ 错误 | no-unused-vars | 'students' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 145 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 所有学生原始数据列表（...'. |
| 146 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 学生搜索关键词（字符串...'. |
| 147 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 分页当前页码（数字）'. |
| 148 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 分页每页条数（数字）'. |
| 149 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 学生总数（数字）'. |
| 150 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 今日签到人数（数字）'. |
| 151 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 本月签到人数（数字）'. |
| 152 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 学生等级映射表（对象，...'. |
| 154 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 学生所属管理员映射表（...'. |
| 155 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 学生积分信息映射表（对...'. |
| 156 | 17 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 当前激活的学生等级标签...'. |
| 157 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 编辑学生信息对话框显示...'. |
| 158 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 编辑表单引用（Ref）'. |
| 159 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 编辑表单数据（对象）'. |
| 161 | 25 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 今日考勤记录列表（数组...'. |
| 163 | 21 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 当前选中的学生信息（对...'. |
| 164 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历组件选中日期（日期...'. |
| 165 | 2 | ❌ 错误 | no-unused-vars | 'scrollPosition' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 165 | 17 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 页面滚动位置（数字）'. |
| 167 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历时间段配置（数组）'. |
| 168 | 2 | ❌ 错误 | no-unused-vars | 'filteredStudentAttendanceRecords' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 170 | 21 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 趋势图对话框显示状态（...'. |
| 171 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 热力图容器引用（Ref...'. |
| 172 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 趋势图容器引用（Ref...'. |
| 173 | 2 | ❌ 错误 | no-unused-vars | 'heatmapInstance' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 173 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 热力图实例（Ref）'. |
| 174 | 2 | ❌ 错误 | no-unused-vars | 'lineInstance' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 174 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 趋势图实例（Ref）'. |
| 176 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 选中的日期（字符串）'. |
| 177 | 22 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 补卡对话框显示状态（布...'. |
| 178 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 补卡操作加载状态（布尔...'. |
| 179 | 23 | ❌ 错误 | comma-spacing | A space is required after ','. |
| 180 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 补卡步骤（date:选...'. |
| 181 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 补卡表单引用（Ref）'. |
| 182 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日期选择器引用（Ref...'. |
| 183 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 补卡表单数据（对象）'. |
| 184 | 22 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 积分修改对话框显示状态...'. |
| 185 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 积分修改加载状态（布尔...'. |
| 186 | 23 | ❌ 错误 | comma-spacing | A space is required after ','. |
| 187 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 积分表单引用（Ref）'. |
| 188 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 积分表单数据（对象）'. |
| 190 | 28 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 积分变动记录加载状态（...'. |
| 191 | 21 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 积分变动记录列表（数组...'. |
| 193 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日期快捷选择配置（数组...'. |
| 194 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 学生等级选项（数组）'. |
| 195 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 管理员选项（数组）'. |
| 196 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 筛选后的学生列表（数组...'. |
| 198 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 编辑表单校验规则（对象...'. |
| 199 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 积分表单校验规则（对象...'. |
| 200 | 22 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 补卡日期表单校验规则（...'. |
| 203 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 根据等级获取学生列表'. |
| 204 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 修改学生等级'. |
| 205 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 修改学生所属管理员'. |
| 206 | 2 | ❌ 错误 | no-unused-vars | 'loadStudentLevels' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 206 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 加载学生等级数据'. |
| 207 | 2 | ❌ 错误 | no-unused-vars | 'loadStudentAttendanceCounts' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 208 | 2 | ❌ 错误 | no-unused-vars | 'loadStudentAdmins' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 208 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 加载学生所属管理员数据'. |
| 209 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 头像加载失败处理'. |
| 210 | 2 | ❌ 错误 | no-unused-vars | 'loadStatistics' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 210 | 17 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 加载统计数据（总数、今...'. |
| 211 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 刷新所有数据'. |
| 212 | 17 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 打开编辑学生对话框'. |
| 213 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 取消编辑操作'. |
| 214 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 确认编辑学生信息'. |
| 215 | 22 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 显示今日考勤记录'. |
| 217 | 21 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 获取时间段样式类'. |
| 218 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 获取时间段名称'. |
| 219 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 判断指定日期时间段是否...'. |
| 220 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 打开日期详情对话框'. |
| 223 | 21 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 关闭热力图对话框'. |
| 224 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 关闭趋势图对话框'. |
| 226 | 22 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 格式化日历标题'. |
| 227 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历切换到上个月'. |
| 228 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历切换到下个月'. |
| 229 | 10 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历回到今日'. |
| 230 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 获取时间段标签'. |
| 232 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 初始化热力图'. |
| 233 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 初始化趋势图'. |
| 234 | 2 | ❌ 错误 | no-unused-vars | 'generateHeatmapData' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 234 | 22 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 生成热力图数据'. |
| 235 | 2 | ❌ 错误 | no-unused-vars | 'generateLineData' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 235 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 生成趋势图数据'. |
| 236 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 打开热力图对话框'. |
| 237 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 打开趋势图对话框'. |
| 238 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 身份验证'. |
| 239 | 9 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 退出登录'. |
| 240 | 2 | ❌ 错误 | no-unused-vars | 'getShortcutDate' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 240 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 获取快捷日期'. |
| 241 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 打开补卡对话框'. |
| 242 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 取消补卡操作'. |
| 243 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 处理日期选择变化'. |
| 244 | 21 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 格式化选中的日期'. |
| 245 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 确认补卡日期步骤'. |
| 248 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 选择补卡小时'. |
| 249 | 17 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 判断小时是否选中'. |
| 250 | 2 | ❌ 错误 | no-unused-vars | 'updateAttendanceTime' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 251 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 提交补卡操作'. |
| 252 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 打开积分修改对话框'. |
| 254 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 取消积分修改'. |
| 255 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 确认积分修改'. |
| 258 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 格式化时间'. |
| 259 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 加载所有核心数据'. |
| 260 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 考勤时间段配置（数组）'. |
| 263 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 切换主题（亮色/暗色）'. |
| 276 | 24 | ❌ 错误 | no-undef | 'adminStore' is not defined. |
| 287 | 4 | ❌ 错误 | no-undef | 'adminStore' is not defined. |
| 305 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 重新初始化趋势图'. |
| 540 | 1 | ❌ 错误 | max-len | This line has a length of 149. Maximum allowed is 120. |
| 561 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 9 tabs. |
| 562 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 8 tabs. |
| 568 | 1 | ❌ 错误 | max-len | This line has a length of 200. Maximum allowed is 120. |
| 568 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 10 tabs. |
| 569 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 9 tabs. |
| 573 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 10 tabs. |
| 574 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 9 tabs. |
| 576 | 1 | ❌ 错误 | max-len | This line has a length of 127. Maximum allowed is 120. |
| 576 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 10 tabs. |
| 577 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 9 tabs. |
| 823 | 34 | ❌ 错误 | vue/no-parsing-error | Parsing error: unexpected-character-in-attribute-name. |
| 823 | 34 | ❌ 错误 | vue/max-attributes-per-line | '<!--' should be on a new line. |
| 823 | 39 | ❌ 错误 | vue/max-attributes-per-line | '点击遮罩层不关闭' should be on a new line. |
| 823 | 48 | ❌ 错误 | vue/max-attributes-per-line | '--' should be on a new line. |
| 824 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 825 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 826 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 827 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 828 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 829 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 830 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 831 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 832 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 833 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 834 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 835 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 836 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 837 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 838 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 839 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 840 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 841 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 842 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 843 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 844 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 845 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 846 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 847 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 848 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 849 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 850 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 851 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 852 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 853 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 854 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 855 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 856 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 857 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 858 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 859 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 860 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 861 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 862 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 863 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 864 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 865 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 866 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 867 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 868 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 869 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 870 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 871 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 872 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 873 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 874 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 875 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 876 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 877 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 878 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 879 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 880 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 881 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 882 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 883 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 884 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 885 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 886 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 887 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 888 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 889 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 890 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 891 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 957 | 29 | ❌ 错误 | vue/no-parsing-error | Parsing error: unexpected-character-in-attribute-name. |
| 957 | 29 | ❌ 错误 | vue/max-attributes-per-line | '<!--' should be on a new line. |
| 957 | 34 | ❌ 错误 | vue/max-attributes-per-line | '关闭时销毁DOM，释放资源' should be on a new line. |
| 957 | 34 | ❌ 错误 | vue/attribute-hyphenation | Attribute '关闭时销毁DOM，释放资源' must be hyphenated. |
| 957 | 48 | ❌ 错误 | vue/max-attributes-per-line | '--' should be on a new line. |
| 958 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 959 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 960 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 961 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 962 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 963 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 964 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 965 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 966 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 967 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 968 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 969 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 970 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 971 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 972 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 973 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 974 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 975 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 976 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 977 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 978 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 979 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 980 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 982 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 983 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 984 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 985 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 986 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 987 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 988 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 989 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 990 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 991 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 992 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 993 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 994 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 995 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 996 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 997 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 998 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 999 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1000 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1001 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1002 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1003 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1012 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1013 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1014 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1015 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1016 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1017 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1018 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1019 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1020 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1021 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1161 | 24 | ❌ 错误 | vue/no-parsing-error | Parsing error: unexpected-character-in-attribute-name. |
| 1161 | 24 | ❌ 错误 | vue/max-attributes-per-line | '<!--' should be on a new line. |
| 1161 | 29 | ❌ 错误 | vue/max-attributes-per-line | '隐藏默认关闭按钮' should be on a new line. |
| 1161 | 38 | ❌ 错误 | vue/max-attributes-per-line | '--' should be on a new line. |
| 1162 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1163 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1164 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1165 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1166 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1167 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1168 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1169 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1170 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1171 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1172 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1173 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1174 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1175 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1176 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1177 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1178 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1179 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1181 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1182 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1183 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1184 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1185 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1186 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1187 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1188 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1189 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1190 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1191 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1192 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1193 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1194 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1195 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1196 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1197 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1198 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1200 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1201 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1202 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1203 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1204 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1205 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1206 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1207 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1208 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1209 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1210 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1211 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1212 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1213 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1214 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1215 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1216 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1217 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1218 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1219 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1220 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1221 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1222 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1223 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1224 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1225 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1226 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1227 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1228 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1229 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1230 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1231 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1232 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1233 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1234 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1235 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1236 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1237 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1238 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1239 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1240 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1241 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1242 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1243 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1244 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1245 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1246 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1247 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1248 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1249 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1250 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1252 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1253 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1254 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1255 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1256 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1257 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1258 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1259 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1260 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1261 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1262 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1263 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1264 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1265 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1266 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1267 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1268 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1269 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1270 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1271 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1272 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1273 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1274 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1275 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1276 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1277 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1278 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1279 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1280 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1281 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1282 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1283 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1284 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1285 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1286 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1287 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1288 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1289 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1290 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1291 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1292 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1293 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1295 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1296 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1297 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1298 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1299 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1300 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1301 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1302 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1303 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1304 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1305 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1306 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1307 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1308 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1309 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1310 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1311 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1312 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1313 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1314 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1315 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1316 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1317 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1318 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1319 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1320 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1321 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1322 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1323 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1324 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1325 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1326 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1327 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1328 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1329 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1330 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |

### 2. src\views\AdminPage\AdminPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 10 | 1 | ❌ 错误 | import/order | There should be no empty line within import group |
| 11 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 全局消息提示'. |
| 12 | 9 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 图标容器'. |
| 13 | 10 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 输入框'. |
| 14 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 按钮'. |
| 15 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 下拉选择器'. |
| 16 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 下拉选项'. |
| 17 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 弹窗'. |
| 18 | 9 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 表单'. |
| 19 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 表单项'. |
| 20 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 数字输入框'. |
| 21 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日期选择器'. |
| 22 | 9 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 标签页'. |
| 23 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 标签页面板'. |
| 24 | 8 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 标签'. |
| 25 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 提示框'. |
| 26 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 分页组件'. |
| 27 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历组件'. |
| 61 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 62 | 7 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 用户图标'. |
| 63 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历图标'. |
| 64 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 趋势图图标'. |
| 65 | 9 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 搜索图标'. |
| 66 | 10 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 刷新图标'. |
| 67 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 切换按钮图标'. |
| 68 | 7 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 编辑图标'. |
| 69 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 填充用户图标'. |
| 70 | 8 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 时钟图标'. |
| 71 | 10 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 警告图标'. |
| 72 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 文档图标'. |
| 73 | 10 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 加载图标'. |
| 74 | 6 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 盒子图标'. |
| 75 | 6 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 锁图标'. |
| 88 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 是否已完成身份验证'. |
| 89 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 超级管理员验证密码'. |
| 90 | 2 | ❌ 错误 | no-unused-vars | 'authError' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 90 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 认证错误信息'. |
| 91 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 认证加载状态'. |
| 93 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 全局加载状态'. |
| 94 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 核心数据是否加载完成'. |
| 95 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 加载进度（百分比）'. |
| 96 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 加载状态文本提示'. |
| 98 | 2 | ❌ 错误 | no-unused-vars | 'students' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 98 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 所有学生列表'. |
| 99 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 学生搜索关键词'. |
| 100 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 当前分页页码'. |
| 101 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 每页显示数量'. |
| 102 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 学生总数'. |
| 104 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 今日签到人数'. |
| 105 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 本月签到人数'. |
| 106 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 学生等级映射（stud...'. |
| 108 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 学生所属管理员映射（s...'. |
| 109 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 学生积分信息映射（st...'. |
| 111 | 17 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 当前激活的学生等级标签...'. |
| 112 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 编辑学生信息弹窗是否显...'. |
| 113 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 编辑表单引用'. |
| 114 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 编辑表单数据'. |
| 116 | 25 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 今日签到记录列表'. |
| 118 | 21 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 当前选中的学生信息'. |
| 119 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历选中日期'. |
| 120 | 2 | ❌ 错误 | no-unused-vars | 'scrollPosition' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 120 | 17 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 滚动位置'. |
| 121 | 30 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 当前学生所有考勤记录'. |
| 122 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历时间段配置'. |
| 123 | 2 | ❌ 错误 | no-unused-vars | 'filteredStudentAttendanceRecords' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 125 | 23 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 热力图弹窗是否显示'. |
| 126 | 21 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 趋势图弹窗是否显示'. |
| 127 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 热力图容器引用'. |
| 128 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 趋势图容器引用'. |
| 129 | 2 | ❌ 错误 | no-unused-vars | 'heatmapInstance' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 129 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 热力图实例'. |
| 130 | 2 | ❌ 错误 | no-unused-vars | 'lineInstance' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 130 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 趋势图实例'. |
| 133 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 选中的详情日期'. |
| 135 | 22 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 补卡弹窗是否显示'. |
| 136 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 补卡操作加载状态'. |
| 138 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 补卡步骤（date-选...'. |
| 139 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 补卡表单引用'. |
| 140 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日期选择器引用'. |
| 141 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 补卡表单数据'. |
| 143 | 22 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 修改积分弹窗是否显示'. |
| 144 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 积分修改加载状态'. |
| 145 | 24 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 选中的积分修改学生'. |
| 146 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 积分表单引用'. |
| 147 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 积分表单数据'. |
| 149 | 28 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 改分记录加载状态'. |
| 150 | 21 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 改分记录列表'. |
| 153 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日期快捷选择配置'. |
| 154 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 学生等级选项（[{la...'. |
| 155 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 管理员选项列表'. |
| 157 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 搜索筛选后的学生列表'. |
| 158 | 22 | ❌ 错误 | comma-spacing | A space is required after ','. |
| 160 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 编辑学生表单校验规则'. |
| 161 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 积分修改表单校验规则'. |
| 165 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 根据等级筛选学生'. |
| 166 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 修改学生等级'. |
| 167 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 分配学生所属管理员'. |
| 168 | 2 | ❌ 错误 | no-unused-vars | 'loadStudentLevels' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 168 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 加载学生等级数据'. |
| 169 | 2 | ❌ 错误 | no-unused-vars | 'loadStudentAttendanceCounts' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 170 | 2 | ❌ 错误 | no-unused-vars | 'loadStudentAdmins' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 170 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 加载学生所属管理员'. |
| 171 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 头像加载失败处理'. |
| 172 | 2 | ❌ 错误 | no-unused-vars | 'loadStatistics' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 172 | 17 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 加载统计数据'. |
| 173 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 刷新所有数据'. |
| 174 | 17 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 打开编辑学生弹窗'. |
| 175 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 取消编辑'. |
| 176 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 确认编辑'. |
| 178 | 22 | ❌ 错误 | comma-spacing | A space is required after ','. |
| 179 | 21 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 获取时间段样式类'. |
| 180 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 获取时间段名称'. |
| 181 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 判断时间段是否签到'. |
| 182 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 打开日期详情弹窗'. |
| 185 | 21 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 关闭热力图弹窗'. |
| 186 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 关闭趋势图弹窗'. |
| 187 | 22 | ❌ 错误 | comma-spacing | A space is required after ','. |
| 189 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历切换到上个月'. |
| 190 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历切换到下个月'. |
| 191 | 10 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历回到今天'. |
| 192 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 获取时间段标签'. |
| 194 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 初始化热力图'. |
| 195 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 初始化趋势图'. |
| 196 | 2 | ❌ 错误 | no-unused-vars | 'generateHeatmapData' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 197 | 2 | ❌ 错误 | no-unused-vars | 'generateLineData' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 197 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 生成趋势图数据'. |
| 198 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 打开热力图弹窗'. |
| 199 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 打开趋势图弹窗'. |
| 200 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 身份验证'. |
| 201 | 9 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 退出登录'. |
| 202 | 2 | ❌ 错误 | no-unused-vars | 'getShortcutDate' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 202 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 获取快捷日期'. |
| 203 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 打开补卡弹窗'. |
| 204 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 取消补卡'. |
| 205 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日期选择变化处理'. |
| 206 | 21 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 格式化选中日期'. |
| 207 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 确认补卡日期步骤'. |
| 210 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 选择补卡小时'. |
| 211 | 17 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 判断小时是否选中'. |
| 212 | 2 | ❌ 错误 | no-unused-vars | 'updateAttendanceTime' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 212 | 22 | ❌ 错误 | comma-spacing | A space is required after ','. |
| 213 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 提交补卡'. |
| 214 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 打开修改积分弹窗'. |
| 216 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 取消积分修改'. |
| 217 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 确认积分修改'. |
| 220 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 格式化时间'. |
| 221 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 加载所有核心数据'. |
| 222 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 时间段配置'. |
| 224 | 25 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 总积分调整值'. |
| 225 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 切换主题'. |
| 229 | 7 | ❌ 错误 | no-unused-vars | 'monthMap' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 245 | 7 | ❌ 错误 | no-unused-vars | 'monthObserver' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 260 | 24 | ❌ 错误 | no-undef | 'adminStore' is not defined. |
| 271 | 4 | ❌ 错误 | no-undef | 'adminStore' is not defined. |
| 489 | 1 | ❌ 错误 | max-len | This line has a length of 173. Maximum allowed is 120. |
| 509 | 1 | ❌ 错误 | max-len | This line has a length of 237. Maximum allowed is 120. |
| 512 | 1 | ❌ 错误 | max-len | This line has a length of 143. Maximum allowed is 120. |
| 513 | 1 | ❌ 错误 | max-len | This line has a length of 162. Maximum allowed is 120. |
| 881 | 1 | ❌ 错误 | max-len | This line has a length of 126. Maximum allowed is 120. |
| 935 | 1 | ❌ 错误 | max-len | This line has a length of 139. Maximum allowed is 120. |
| 1067 | 1 | ❌ 错误 | max-len | This line has a length of 130. Maximum allowed is 120. |
| 1209 | 1 | ❌ 错误 | max-len | This line has a length of 133. Maximum allowed is 120. |
| 1276 | 1 | ❌ 错误 | max-len | This line has a length of 123. Maximum allowed is 120. |
| 1286 | 1 | ❌ 错误 | max-len | This line has a length of 141. Maximum allowed is 120. |
| 1313 | 1 | ❌ 错误 | max-len | This line has a length of 145. Maximum allowed is 120. |

### 3. src\views\StudentManagerPage\StudentManagerPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 7 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 9 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "date". |
| 11 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "dependency". |
| 16 | 1 | ❌ 错误 | import/order | There should be no empty line within import group |
| 17 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 全局消息提示组件'. |
| 18 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 按钮组件'. |
| 19 | 9 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 图标容器组件'. |
| 20 | 10 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 输入框组件'. |
| 21 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 弹窗组件'. |
| 23 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历组件'. |
| 27 | 1 | ❌ 错误 | import/order | There should be no empty line within import group |
| 28 | 6 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 响应式数据创建'. |
| 29 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 生命周期钩子-组件挂载...'. |
| 30 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 计算属性创建'. |
| 31 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 异步DOM更新完成回调'. |
| 32 | 7 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 响应式数据监听'. |
| 50 | 1 | ❌ 错误 | import/order | There should be no empty line within import group |
| 50 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 51 | 7 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 用户图标'. |
| 52 | 14 | ❌ 错误 | no-unused-vars | 'CalendarIcon' is defined but never used. Allowed unused vars must match /^_/u. |
| 53 | 7 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 星星/热力图图标'. |
| 54 | 10 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 刷新图标'. |
| 55 | 2 | ❌ 错误 | no-unused-vars | 'Loading' is defined but never used. Allowed unused vars must match /^_/u. |
| 55 | 10 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 加载中图标'. |
| 56 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 返回箭头图标'. |
| 57 | 8 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 时钟/补卡图标'. |
| 58 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 信息提示图标'. |
| 59 | 8 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 确认勾选图标'. |
| 60 | 9 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 搜索图标'. |
| 61 | 7 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 排序图标'. |
| 62 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 趋势图图标'. |
| 70 | 1 | ❌ 错误 | import/order | There should be no empty line within import group |
| 71 | 28 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 获取学生签到次数'. |
| 72 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 学生补卡操作'. |
| 77 | 1 | ❌ 错误 | import/order | There should be no empty line within import group |
| 78 | 2 | ❌ 错误 | no-unused-vars | 'getManagedStudents' is defined but never used. Allowed unused vars must match /^_/u. |
| 79 | 17 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 获取学生/管理员权限等...'. |
| 84 | 1 | ❌ 错误 | import/order | There should be no empty line within import group |
| 84 | 45 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 用户状态管理'. |
| 92 | 1 | ❌ 错误 | import/order | `echarts/core` import should occur before import of `element-plus` |
| 94 | 1 | ❌ 错误 | import/order | `echarts/charts` import should occur before import of `element-plus` |
| 96 | 1 | ❌ 错误 | import/order | `echarts/components` import should occur before import of `element-plus` |
| 97 | 17 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 标题组件'. |
| 98 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 提示框组件'. |
| 99 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 网格组件'. |
| 100 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 图例组件'. |
| 101 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 视觉映射组件（热力图用...'. |
| 104 | 1 | ❌ 错误 | import/order | `echarts/renderers` import should occur before import of `element-plus` |
| 119 | 27 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 路由实例'. |
| 120 | 33 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 用户状态实例'. |
| 121 | 35 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 主题状态实例'. |
| 122 | 32 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 管理员管理的学生列表'. |
| 123 | 27 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 全局加载状态'. |
| 124 | 28 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 搜索框输入内容'. |
| 125 | 33 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 搜索过滤后的学生列表'. |
| 126 | 33 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 排序方式：defaul...'. |
| 129 | 31 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 热力图容器DOM引用'. |
| 130 | 28 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 趋势图容器DOM引用'. |
| 131 | 34 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 热力图ECharts实...'. |
| 132 | 31 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 趋势图ECharts实...'. |
| 133 | 37 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 弹窗内热力图容器DOM...'. |
| 134 | 35 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 弹窗内趋势图容器DOM...'. |
| 137 | 33 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 学生签到次数缓存 {s...'. |
| 138 | 39 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 补卡弹窗显示状态'. |
| 139 | 34 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 当前选中的学生对象'. |
| 140 | 40 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 补卡操作选中的学生对象'. |
| 141 | 25 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 补卡表单数据'. |
| 142 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 补卡时间'. |
| 144 | 33 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 补卡操作加载状态'. |
| 148 | 41 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 选中学生的考勤记录列表'. |
| 149 | 38 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历组件当前选中日期'. |
| 150 | 44 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 考勤记录加载状态'. |
| 153 | 40 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 热力图弹窗显示状态'. |
| 154 | 43 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 趋势图弹窗显示状态'. |
| 216 | 45 | ❌ 错误 | arrow-body-style | Unexpected block statement surrounding arrow body; move the returned value immediately after the `=>`. |
| 223 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 224 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 226 | 45 | ❌ 错误 | arrow-parens | Unexpected parentheses around single function argument. |
| 226 | 59 | ❌ 错误 | arrow-body-style | Unexpected block statement surrounding arrow body; move the returned value immediately after the `=>`. |
| 232 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 232 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 233 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 235 | 30 | ❌ 错误 | arrow-parens | Unexpected parentheses around single function argument. |
| 236 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 237 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 254 | 62 | ❌ 错误 | no-undefined | Unexpected use of undefined. |
| 263 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 269 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 271 | 28 | ❌ 错误 | arrow-parens | Unexpected parentheses around single function argument. |
| 273 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'event'. |
| 285 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 286 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 288 | 7 | ❌ 错误 | no-unused-vars | 'formatAttendanceTime' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 288 | 31 | ❌ 错误 | arrow-parens | Unexpected parentheses around single function argument. |
| 303 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 304 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 306 | 30 | ❌ 错误 | arrow-parens | Unexpected parentheses around single function argument. |
| 318 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 318 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 325 | 9 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 348 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 367 | 53 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 367 | 61 | ❌ 错误 | brace-style | Closing curly brace does not appear on the same line as the subsequent block. |
| 368 | 59 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 368 | 67 | ❌ 错误 | brace-style | Closing curly brace does not appear on the same line as the subsequent block. |
| 369 | 59 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 382 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 383 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 384 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 520 | 7 | ❌ 错误 | no-unused-vars | 'totalAttendanceCount' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 520 | 7 | ❌ 错误 | no-shadow | 'totalAttendanceCount' is already declared in the upper scope on line 216 column 7. |
| 583 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 583 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 585 | 27 | ❌ 错误 | arrow-parens | Unexpected parentheses around single function argument. |
| 648 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 648 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 650 | 44 | ❌ 错误 | arrow-parens | Unexpected parentheses around single function argument. |
| 683 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 683 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 685 | 34 | ❌ 错误 | arrow-parens | Unexpected parentheses around single function argument. |
| 700 | 5 | ❌ 错误 | no-use-before-define | 'initDialogHeatmapChart' was used before it was defined. |
| 730 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 730 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 732 | 37 | ❌ 错误 | arrow-parens | Unexpected parentheses around single function argument. |
| 747 | 5 | ❌ 错误 | no-use-before-define | 'initDialogLineChart' was used before it was defined. |
| 805 | 2 | ❌ 错误 | no-use-before-define | 'initHeatmapChart' was used before it was defined. |
| 806 | 2 | ❌ 错误 | no-use-before-define | 'initLineChart' was used before it was defined. |
| 813 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 814 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 815 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 831 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 839 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 840 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 935 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 945 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 946 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 947 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 963 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 971 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 972 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 988 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1206 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1476 | 1 | ❌ 错误 | max-len | This line has a length of 124. Maximum allowed is 120. |
| 1563 | 1 | ❌ 错误 | max-len | This line has a length of 141. Maximum allowed is 120. |
| 1610 | 1 | ❌ 错误 | max-len | This line has a length of 130. Maximum allowed is 120. |
| 1715 | 1 | ❌ 错误 | max-len | This line has a length of 138. Maximum allowed is 120. |
| 1718 | 1 | ❌ 错误 | max-len | This line has a length of 142. Maximum allowed is 120. |
| 1721 | 1 | ❌ 错误 | max-len | This line has a length of 138. Maximum allowed is 120. |

### 4. src\views\AdminPage\AdminPage.js

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

### 5. src\views\AttendancePage\AttendancePageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 26 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 156 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 175 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 181 | 10 | ❌ 错误 | no-use-before-define | 'isSlotSigned' was used before it was defined. |
| 191 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 192 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 247 | 42 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 349 | 7 | ❌ 错误 | no-unused-vars | 'submitAttendance' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 349 | 35 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 372 | 33 | ⚠️ 警告 | complexity | Async arrow function has a complexity of 23. Maximum allowed is 15. |
| 452 | 7 | ❌ 错误 | no-unused-vars | 'handleVerificationCodeDialogClose' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 485 | 20 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 547 | 1 | ❌ 错误 | max-len | This line has a length of 137. Maximum allowed is 120. |
| 555 | 59 | ❌ 错误 | vue/component-name-in-template-casing | Component name "User" is not kebab-case. |
| 570 | 42 | ❌ 错误 | vue/component-name-in-template-casing | Component name "Clock" is not kebab-case. |
| 575 | 42 | ❌ 错误 | vue/component-name-in-template-casing | Component name "Calendar" is not kebab-case. |
| 585 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 585 | 6 | ❌ 错误 | vue/no-parsing-error | Parsing error: unexpected-character-in-attribute-name. |
| 585 | 6 | ❌ 错误 | vue/valid-attribute-name | Attribute name <!-- is not valid. |
| 585 | 11 | ❌ 错误 | vue/max-attributes-per-line | '禁用条件：加载中' should be on a new line. |
| 585 | 21 | ❌ 错误 | vue/no-parsing-error | Parsing error: unexpected-solidus-in-tag. |
| 585 | 22 | ❌ 错误 | vue/max-attributes-per-line | '非签到时段' should be on a new line. |
| 585 | 29 | ❌ 错误 | vue/no-parsing-error | Parsing error: unexpected-solidus-in-tag. |
| 585 | 30 | ❌ 错误 | vue/max-attributes-per-line | '已签到' should be on a new line. |
| 585 | 34 | ❌ 错误 | vue/max-attributes-per-line | '--' should be on a new line. |
| 585 | 34 | ❌ 错误 | vue/valid-attribute-name | Attribute name -- is not valid. |
| 586 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 587 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 588 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 589 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 590 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 591 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 592 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 593 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 594 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 595 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 596 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 597 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 598 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 599 | 1 | ❌ 错误 | max-len | This line has a length of 149. Maximum allowed is 120. |
| 599 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 599 | 110 | ❌ 错误 | vue/component-name-in-template-casing | Component name "Check" is not kebab-case. |
| 600 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 601 | 1 | ❌ 错误 | max-len | This line has a length of 173. Maximum allowed is 120. |
| 601 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 601 | 134 | ❌ 错误 | vue/component-name-in-template-casing | Component name "Check" is not kebab-case. |
| 602 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 603 | 1 | ❌ 错误 | max-len | This line has a length of 150. Maximum allowed is 120. |
| 603 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 603 | 111 | ❌ 错误 | vue/component-name-in-template-casing | Component name "Clock" is not kebab-case. |
| 604 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 605 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 605 | 62 | ❌ 错误 | vue/component-name-in-template-casing | Component name "Loading" is not kebab-case. |
| 606 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 607 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 608 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 609 | 1 | ❌ 错误 | vue/html-indent | Expected "\t" character, but found " " character. |
| 610 | 1 | ❌ 错误 | vue/html-indent | Expected "\t" character, but found " " character. |
| 611 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 612 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 613 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 614 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 615 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 622 | 1 | ❌ 错误 | max-len | This line has a length of 145. Maximum allowed is 120. |
| 624 | 17 | ❌ 错误 | vue/component-name-in-template-casing | Component name "Sunrise" is not kebab-case. |
| 636 | 1 | ❌ 错误 | max-len | This line has a length of 149. Maximum allowed is 120. |
| 638 | 17 | ❌ 错误 | vue/component-name-in-template-casing | Component name "Sunny" is not kebab-case. |
| 650 | 1 | ❌ 错误 | max-len | This line has a length of 145. Maximum allowed is 120. |
| 652 | 17 | ❌ 错误 | vue/component-name-in-template-casing | Component name "Moon" is not kebab-case. |
| 667 | 16 | ❌ 错误 | vue/component-name-in-template-casing | Component name "Monitor" is not kebab-case. |
| 682 | 34 | ❌ 错误 | vue/no-parsing-error | Parsing error: unexpected-character-in-attribute-name. |
| 682 | 34 | ❌ 错误 | vue/max-attributes-per-line | '<!--' should be on a new line. |
| 682 | 39 | ❌ 错误 | vue/max-attributes-per-line | '点击遮罩层不关闭' should be on a new line. |
| 682 | 48 | ❌ 错误 | vue/max-attributes-per-line | '--' should be on a new line. |
| 683 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 684 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 685 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 686 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 687 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 688 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 689 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 690 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 691 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 692 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 693 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 694 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 695 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 696 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 697 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 698 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 699 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 700 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 701 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 702 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 703 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 704 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 705 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 706 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |

### 6. src\views\StudentManagerPage\StudentManagerPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 8 | 1 | ❌ 错误 | import/order | `vue` import should occur after import of `echarts/renderers` |
| 9 | 1 | ❌ 错误 | import/order | `element-plus` import should occur after import of `echarts/renderers` |
| 22 | 1 | ❌ 错误 | import/order | There should be no empty line within import group |
| 26 | 2 | ❌ 错误 | no-unused-vars | 'Loading' is defined but never used. Allowed unused vars must match /^_/u. |
| 47 | 8 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 60 | 1 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 188 | 20 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 189 | 20 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 208 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 209 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 230 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 231 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 256 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 257 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 266 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 273 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 279 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 285 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 327 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 390 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 391 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 400 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 400 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 401 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 416 | 55 | ❌ 错误 | sonarjs/no-redundant-boolean | Refactor the code to avoid using this boolean literal. |
| 432 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 436 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'event'. |
| 458 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 490 | 7 | ❌ 错误 | no-unused-vars | 'totalAttendanceCount' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 529 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 577 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 577 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 703 | 3 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 706 | 4 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 712 | 5 | ❌ 错误 | no-use-before-define | 'initDialogHeatmapChart' was used before it was defined. |
| 720 | 3 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 728 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 740 | 3 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 743 | 4 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 749 | 5 | ❌ 错误 | no-use-before-define | 'initDialogLineChart' was used before it was defined. |
| 757 | 3 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 765 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 778 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 779 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 781 | 7 | ❌ 错误 | no-unused-vars | 'formatAttendanceTime' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 801 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 802 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 823 | 24 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 825 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 834 | 24 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 836 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 845 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 869 | 3 | ❌ 错误 | no-use-before-define | 'initCharts' was used before it was defined. |
| 877 | 4 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 889 | 2 | ❌ 错误 | no-use-before-define | 'initHeatmapChart' was used before it was defined. |
| 890 | 2 | ❌ 错误 | no-use-before-define | 'initLineChart' was used before it was defined. |
| 894 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 895 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 896 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 909 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 915 | 22 | ❌ 错误 | no-use-before-define | 'generateHeatmapData' was used before it was defined. |
| 916 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 917 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 917 | 23 | ❌ 错误 | no-undef | 'studentAttendanceRecords' is not defined. |
| 1009 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 1016 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 1017 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 1018 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 1031 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 1037 | 19 | ❌ 错误 | no-use-before-define | 'generateLineData' was used before it was defined. |
| 1038 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 1039 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 1039 | 23 | ❌ 错误 | no-undef | 'studentAttendanceRecords' is not defined. |
| 1052 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1139 | 22 | ❌ 错误 | no-use-before-define | 'generateHeatmapData' was used before it was defined. |
| 1241 | 19 | ❌ 错误 | no-use-before-define | 'generateLineData' was used before it was defined. |
| 1254 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1337 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 1337 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1353 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 1355 | 9 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1386 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1409 | 4 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 1419 | 53 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 1419 | 61 | ❌ 错误 | brace-style | Closing curly brace does not appear on the same line as the subsequent block. |
| 1420 | 59 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 1420 | 67 | ❌ 错误 | brace-style | Closing curly brace does not appear on the same line as the subsequent block. |
| 1421 | 59 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 1457 | 13 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 1700 | 1 | ❌ 错误 | max-len | This line has a length of 125. Maximum allowed is 120. |
| 1733 | 1 | ❌ 错误 | max-len | This line has a length of 270. Maximum allowed is 120. |
| 1735 | 1 | ❌ 错误 | max-len | This line has a length of 206. Maximum allowed is 120. |
| 1740 | 1 | ❌ 错误 | max-len | This line has a length of 272. Maximum allowed is 120. |
| 1742 | 1 | ❌ 错误 | max-len | This line has a length of 208. Maximum allowed is 120. |
| 1747 | 1 | ❌ 错误 | max-len | This line has a length of 270. Maximum allowed is 120. |
| 1749 | 1 | ❌ 错误 | max-len | This line has a length of 206. Maximum allowed is 120. |

### 7. src\views\AttendanceAnalysisPage\AttendanceAnalysisPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 8 | 1 | ❌ 错误 | import/order | `vue` import should occur after import of `element-plus` |
| 9 | 1 | ❌ 错误 | import/order | `vue-router` import should occur after import of `element-plus` |
| 74 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 79 | 7 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 80 | 4 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 81 | 4 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 83 | 7 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 84 | 4 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 85 | 4 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 88 | 41 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 90 | 11 | ❌ 错误 | no-use-before-define | 'initPeriodChart' was used before it was defined. |
| 91 | 11 | ❌ 错误 | no-use-before-define | 'initTimelineChart' was used before it was defined. |
| 101 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 104 | 26 | ❌ 错误 | sonarjs/no-identical-functions | Update this function so that its implementation is not identical to the one on line 77. |
| 106 | 7 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 107 | 4 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 108 | 4 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 110 | 7 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 111 | 4 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 112 | 4 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 115 | 41 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 117 | 11 | ❌ 错误 | no-use-before-define | 'initPeriodChart' was used before it was defined. |
| 118 | 11 | ❌ 错误 | no-use-before-define | 'initTimelineChart' was used before it was defined. |
| 128 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 167 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 186 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 192 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 204 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 239 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 240 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 274 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 283 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 288 | 9 | ❌ 错误 | no-use-before-define | 'loadTimelineData' was used before it was defined. |
| 291 | 4 | ❌ 错误 | no-use-before-define | 'updateTimelineChart' was used before it was defined. |
| 294 | 11 | ❌ 错误 | no-use-before-define | 'initTimelineChart' was used before it was defined. |
| 304 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 310 | 10 | ❌ 错误 | no-use-before-define | 'loadTimelineData' was used before it was defined. |
| 313 | 5 | ❌ 错误 | no-use-before-define | 'updateTimelineChart' was used before it was defined. |
| 316 | 12 | ❌ 错误 | no-use-before-define | 'initTimelineChart' was used before it was defined. |
| 327 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 328 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 343 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 344 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 356 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 357 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 369 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "records" type "Object"; prefer: "object". |
| 369 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 370 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 370 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 378 | 1 | ❌ 错误 | max-len | This line has a length of 165. Maximum allowed is 120. |
| 378 | 33 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 378 | 87 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 378 | 143 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 386 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "records" type "Object"; prefer: "object". |
| 386 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 387 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 407 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 418 | 28 | ⚠️ 警告 | no-await-in-loop | Unexpected `await` inside a loop. |
| 419 | 6 | ⚠️ 警告 | max-depth | Blocks are nested too deeply (5). Maximum allowed is 4. |
| 449 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 478 | 4 | ❌ 错误 | no-use-before-define | 'updatePeriodChart' was used before it was defined. |
| 487 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 490 | 27 | ⚠️ 警告 | complexity | Arrow function has a complexity of 27. Maximum allowed is 15. |
| 663 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 697 | 5 | ❌ 错误 | no-use-before-define | 'updateTimelineChart' was used before it was defined. |
| 707 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 710 | 29 | ⚠️ 警告 | complexity | Arrow function has a complexity of 60. Maximum allowed is 15. |
| 744 | 14 | ❌ 错误 | no-shadow | 'data' is already declared in the upper scope on line 714 column 8. |
| 852 | 14 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 931 | 48 | ❌ 错误 | radix | Missing radix parameter. |
| 938 | 12 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 938 | 12 | ❌ 错误 | no-shadow | 'data' is already declared in the upper scope on line 714 column 8. |
| 1081 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1084 | 26 | ⚠️ 警告 | complexity | Async arrow function has a complexity of 22. Maximum allowed is 15. |
| 1098 | 1 | ❌ 错误 | max-len | This line has a length of 140. Maximum allowed is 120. |
| 1107 | 1 | ❌ 错误 | max-len | This line has a length of 131. Maximum allowed is 120. |
| 1120 | 1 | ❌ 错误 | max-len | This line has a length of 155. Maximum allowed is 120. |
| 1121 | 1 | ❌ 错误 | max-len | This line has a length of 129. Maximum allowed is 120. |
| 1134 | 1 | ❌ 错误 | max-len | This line has a length of 122. Maximum allowed is 120. |
| 1135 | 1 | ❌ 错误 | max-len | This line has a length of 123. Maximum allowed is 120. |
| 1142 | 1 | ❌ 错误 | max-len | This line has a length of 149. Maximum allowed is 120. |
| 1150 | 1 | ❌ 错误 | max-len | This line has a length of 152. Maximum allowed is 120. |
| 1198 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1218 | 5 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1244 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1254 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1265 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1441 | 1 | ❌ 错误 | max-len | This line has a length of 137. Maximum allowed is 120. |

### 8. src\api\student.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 52 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data" type. |
| 53 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data.studentId" type. |
| 54 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data.password" type. |
| 55 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 87 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data" type. |
| 88 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data.studentId" type. |
| 89 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data.password" type. |
| 90 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data.name" type. |
| 91 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data.gender" type. |
| 92 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data.phoneNumber" type. |
| 93 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data.college" type. |
| 94 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data.major" type. |
| 95 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data.grade" type. |
| 96 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data.classNum" type. |
| 97 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 126 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 127 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 166 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 167 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 198 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 199 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data" type. |
| 200 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data.name" type. |
| 201 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data.gender" type. |
| 202 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data.phoneNumber" type. |
| 203 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data.college" type. |
| 204 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data.major" type. |
| 205 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data.grade" type. |
| 206 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data.classNum" type. |
| 207 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 241 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 242 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data" type. |
| 243 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data.oldPassword" type. |
| 244 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data.newPassword" type. |
| 245 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 279 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 304 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 329 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 354 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "levelCode" type. |
| 355 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 384 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 385 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 412 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 413 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 440 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 441 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 472 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 473 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 500 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 501 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "fieldName" type. |
| 502 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 532 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "specialPassword" type. |
| 533 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 564 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "specialPassword" type. |
| 565 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 566 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "levelCode" type. |
| 567 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 601 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "specialPassword" type. |
| 602 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 603 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentData" type. |
| 604 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentData.name" type. |
| 605 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentData.gender" type. |
| 606 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentData.phoneNumber" type. |
| 607 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentData.college" type. |
| 608 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentData.major" type. |
| 609 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentData.grade" type. |
| 610 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentData.classNum" type. |
| 611 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentData.password" type. |
| 612 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 646 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "specialPassword" type. |
| 647 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 648 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "adminStudentId" type. |
| 649 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 683 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "managedStudentId" type. |
| 684 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 715 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "adminStudentId" type. |
| 716 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 747 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 748 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "file" type. |
| 749 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 835 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 836 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "avatarSize" type. |
| 837 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 9. src\views\AttendanceAnalysisPage\AttendanceAnalysisPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 14 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 16 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "date". |
| 18 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "适配端". |
| 23 | 1 | ❌ 错误 | import/order | `vue` import should occur after import of `element-plus` |
| 25 | 1 | ❌ 错误 | import/order | `vue-router` import should occur after import of `element-plus` |
| 32 | 1 | ❌ 错误 | import/order | There should be no empty line within import group |
| 54 | 17 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 标题组件（当前未使用，...'. |
| 55 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 提示框组件（图表交互提...'. |
| 56 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 网格组件（折线图布局）'. |
| 57 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 图例组件（饼图图例）'. |
| 58 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 饼图图表（时段分布）'. |
| 59 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 折线图图表（时间线）'. |
| 60 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// Canvas渲染器（适...'. |
| 99 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "values". |
| 148 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 155 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 210 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 223 | 24 | ❌ 错误 | no-use-before-define | 'calculatePeriodStats' was used before it was defined. |
| 233 | 5 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 234 | 25 | ❌ 错误 | no-use-before-define | 'calculateAverageTime' was used before it was defined. |
| 242 | 5 | ❌ 错误 | no-use-before-define | 'initChartsWithTheme' was used before it was defined. |
| 256 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 280 | 11 | ❌ 错误 | no-use-before-define | 'initTimelineChart' was used before it was defined. |
| 291 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 292 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 306 | 4 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 308 | 4 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 310 | 4 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 320 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 321 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 341 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 342 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 356 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 357 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 361 | 37 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 第一名'. |
| 362 | 38 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 第二名'. |
| 363 | 37 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 第三名'. |
| 364 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 其他名次'. |
| 373 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 393 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 提示框配置'. |
| 397 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 图例配置'. |
| 398 | 25 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 水平布局'. |
| 399 | 17 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 距离底部5%'. |
| 400 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 文字样式（适配主题）'. |
| 406 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 饼图类型'. |
| 407 | 27 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 内/外半径（环形饼图）'. |
| 408 | 27 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 图表居中'. |
| 409 | 29 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 避免标签重叠'. |
| 410 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 区块样式（适配主题）'. |
| 411 | 21 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 圆角'. |
| 415 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 标签配置（默认隐藏）'. |
| 419 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 高亮配置（hover时...'. |
| 427 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 隐藏标签线'. |
| 430 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 饼图数据（绑定时段统计...'. |
| 447 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 484 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 提示框配置（适配主题）'. |
| 493 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 502 | 10 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 网格配置（适配移动端边...'. |
| 509 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// X轴（时间轴）'. |
| 511 | 30 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 隐藏轴线'. |
| 512 | 30 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 隐藏刻度'. |
| 513 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 标签样式（适配主题/移...'. |
| 525 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 分割线样式（适配主题）'. |
| 533 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// Y轴（数值轴）'. |
| 535 | 30 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 隐藏轴线'. |
| 536 | 30 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 隐藏刻度'. |
| 537 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 标签样式（适配主题/移...'. |
| 541 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 分割线样式（适配主题）'. |
| 551 | 17 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 折线图类型'. |
| 552 | 17 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 平滑曲线'. |
| 553 | 21 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 标记点形状'. |
| 554 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 移动端标记点缩小'. |
| 555 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 渐变线条样式'. |
| 570 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 标记点样式（带阴影）'. |
| 577 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 区域填充（渐变）'. |
| 591 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 高亮样式（增大阴影）'. |
| 597 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 数据暂空（实际应从接口...'. |
| 637 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 777 | 1 | ❌ 错误 | max-len | This line has a length of 125. Maximum allowed is 120. |

### 10. src\api\attendance.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 52 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 53 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "verificationCode" type. |
| 54 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 94 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 95 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 96 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "attendanceTime" type. |
| 97 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 131 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "specialPassword" type. |
| 132 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "targetStudentId" type. |
| 133 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "targetAttendanceDateTime" type. |
| 134 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 169 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 194 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 219 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "date" type. |
| 220 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 247 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 248 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 277 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 302 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 303 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 340 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 365 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 366 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 396 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 425 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "startTime" type. |
| 426 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "endTime" type. |
| 427 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "topN" type. |
| 428 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 456 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 483 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "date" type. |
| 484 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "topN" type. |
| 485 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 497 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "weekStart" type. |
| 498 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "topN" type. |
| 499 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 513 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "year" type. |
| 514 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "month" type. |
| 515 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "topN" type. |
| 516 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 529 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "year" type. |
| 530 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "quarter" type. |
| 531 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "topN" type. |
| 532 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 556 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "year" type. |
| 557 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "semester" type. |
| 558 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "topN" type. |
| 559 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 579 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "year" type. |
| 580 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "topN" type. |
| 581 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 593 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "topN" type. |
| 594 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 610 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "topN" type. |
| 611 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 627 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "startDate" type. |
| 628 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "endDate" type. |
| 629 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "topN" type. |
| 630 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 643 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "startTime" type. |
| 644 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "endTime" type. |
| 645 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 722 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "top" type. |
| 723 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 11. src\views\ProfilePage\ProfilePageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 281 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 307 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 321 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 329 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 329 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 383 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 383 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 439 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 439 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 467 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 467 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 575 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 575 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 636 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 636 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 674 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "file" type. |
| 675 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 675 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 714 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "file" type. |
| 715 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 715 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 757 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 757 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 769 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 769 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 783 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 783 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 791 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 791 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 799 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 799 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 847 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 847 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 855 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 855 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 864 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "event" type. |
| 865 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 865 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 896 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 896 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 929 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 929 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 962 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 962 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 973 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 973 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 1002 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 1002 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 1091 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 1091 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 1105 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 1105 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 1116 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 1116 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 1125 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 1125 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 1175 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 1175 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 12. src\composables\admin\StudentAttendance.js

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

### 13. src\views\ProfilePage\ProfilePageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 34 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 322 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 348 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 406 | 5 | ⚠️ 警告 | no-negated-condition | Unexpected negated condition. |
| 457 | 10 | ❌ 错误 | no-use-before-define | 'loadAvatar' was used before it was defined. |
| 533 | 9 | ❌ 错误 | no-use-before-define | 'showCropDialog' was used before it was defined. |
| 540 | 4 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'event'. |
| 547 | 3 | ❌ 错误 | no-use-before-define | 'resetForm' was used before it was defined. |
| 566 | 3 | ❌ 错误 | no-use-before-define | 'resetPasswordForm' was used before it was defined. |
| 681 | 1 | ⚠️ 警告 | jsdoc/require-returns | Missing JSDoc @returns declaration. |
| 683 | 1 | ⚠️ 警告 | jsdoc/require-param-description | Missing JSDoc @param "file" description. |
| 683 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "file" type. |
| 685 | 35 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 705 | 7 | ❌ 错误 | no-use-before-define | 'initCrop' was used before it was defined. |
| 776 | 9 | ❌ 错误 | no-shadow | 'imgMinSide' is already declared in the upper scope on line 757 column 8. |
| 778 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 785 | 2 | ❌ 错误 | no-use-before-define | 'drawCropCanvas' was used before it was defined. |
| 786 | 2 | ❌ 错误 | no-use-before-define | 'setupCropEvents' was used before it was defined. |
| 909 | 2 | ❌ 错误 | no-use-before-define | 'removeCropEvents' was used before it was defined. |
| 974 | 10 | ❌ 错误 | no-shadow | 'canvas' is already declared in the upper scope on line 911 column 8. |
| 1024 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1025 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1049 | 10 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1050 | 10 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1094 | 10 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1252 | 30 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 1316 | 11 | ❌ 错误 | no-use-before-define | 'uploadAvatarFile' was used before it was defined. |
| 1331 | 1 | ⚠️ 警告 | jsdoc/require-returns | Missing JSDoc @returns declaration. |
| 1333 | 1 | ⚠️ 警告 | jsdoc/require-param-description | Missing JSDoc @param "file" description. |
| 1333 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "file" type. |
| 1334 | 1 | ⚠️ 警告 | jsdoc/require-param-description | Missing JSDoc @param "maxSize" description. |
| 1334 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "maxSize" type. |
| 1336 | 7 | ❌ 错误 | no-unused-vars | 'compressImage' is assigned a value but never used. Allowed unused vars must match /^_/u. |

### 14. src\views\AttendancePage\AttendancePageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 12 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 14 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "date". |
| 58 | 17 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 标题组件'. |
| 59 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 提示框组件'. |
| 60 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 网格组件'. |
| 61 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 图例组件'. |
| 62 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历组件'. |
| 63 | 21 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 视觉映射组件（热力图颜...'. |
| 64 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 热力图图表'. |
| 65 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 折线图图表'. |
| 66 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// Canvas渲染器'. |
| 159 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 160 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 185 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 186 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 199 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 200 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 220 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 221 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 266 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 267 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 268 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 312 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 355 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 355 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 721 | 37 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 晚上19-22点'. |
| 725 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 下次签到时间'. |
| 957 | 1 | ❌ 错误 | vue/html-indent | Expected "\t" character, but found " " character. |
| 958 | 1 | ❌ 错误 | vue/html-indent | Expected "\t" character, but found " " character. |
| 959 | 1 | ❌ 错误 | vue/html-indent | Expected "\t" character, but found " " character. |
| 961 | 1 | ❌ 错误 | vue/html-indent | Expected "\t" character, but found " " character. |
| 962 | 1 | ❌ 错误 | vue/html-indent | Expected "\t" character, but found " " character. |

### 15. src\views\PointsDashboardPage\PointsDashboardPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 8 | 1 | ❌ 错误 | import/order | `vue` import should occur after import of `element-plus` |
| 9 | 1 | ❌ 错误 | import/order | `vue-router` import should occur after import of `element-plus` |
| 11 | 1 | ❌ 错误 | import/order | `@/stores/theme` import should occur after import of `@/api/StudentApi` |
| 25 | 53 | ❌ 错误 | no-unused-vars | 'View' is defined but never used. Allowed unused vars must match /^_/u. |
| 89 | 1 | ⚠️ 警告 | jsdoc/check-types | Use object shorthand or index signatures instead of `Object`, e.g., `{[key: string]: string}` |
| 316 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 405 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 489 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 506 | 2 | ❌ 错误 | no-use-before-define | 'handleTabChange' was used before it was defined. |
| 519 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 521 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 645 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 647 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 771 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 773 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 893 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 893 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 896 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 897 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 912 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 920 | 1 | ❌ 错误 | max-len | This line has a length of 121. Maximum allowed is 120. |
| 933 | 4 | ⚠️ 警告 | no-negated-condition | Unexpected negated condition. |
| 985 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 986 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 987 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1012 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1134 | 54 | ❌ 错误 | sonarjs/no-identical-functions | Update this function so that its implementation is not identical to the one on line 1054. |
| 1303 | 19 | ❌ 错误 | radix | Missing radix parameter. |
| 1632 | 1 | ❌ 错误 | max-len | This line has a length of 165. Maximum allowed is 120. |
| 1645 | 1 | ❌ 错误 | max-len | This line has a length of 128. Maximum allowed is 120. |

### 16. src\views\AllMembersPage\AllMembersPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 8 | 1 | ❌ 错误 | import/order | `vue` import should occur after import of `element-plus` |
| 9 | 1 | ❌ 错误 | import/order | `vue-router` import should occur after import of `element-plus` |
| 11 | 1 | ❌ 错误 | import/order | `@/stores/theme` import should occur after import of `@/api/attendance` |
| 25 | 63 | ❌ 错误 | no-unused-vars | 'View' is defined but never used. Allowed unused vars must match /^_/u. |
| 30 | 47 | ❌ 错误 | no-unused-vars | 'ElTooltip' is defined but never used. Allowed unused vars must match /^_/u. |
| 80 | 7 | ❌ 错误 | no-unused-vars | 'totalRankingTopN' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 133 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 139 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 145 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 151 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 339 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 425 | 7 | ❌ 错误 | no-unused-vars | 'recordsDialogVisible' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 428 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 431 | 7 | ❌ 错误 | no-unused-vars | 'currentStudent' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 437 | 7 | ❌ 错误 | no-unused-vars | 'allRecords' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 443 | 7 | ❌ 错误 | no-unused-vars | 'recordsLoading' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 579 | 13 | ❌ 错误 | no-shadow | 'totalCount' is already declared in the upper scope on line 130 column 7. |
| 609 | 17 | ❌ 错误 | no-use-before-define | 'formatGrade' was used before it was defined. |
| 691 | 13 | ❌ 错误 | no-shadow | 'totalCount' is already declared in the upper scope on line 130 column 7. |
| 721 | 17 | ❌ 错误 | no-use-before-define | 'formatGrade' was used before it was defined. |
| 848 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 849 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 853 | 7 | ❌ 错误 | no-unused-vars | 'loadSignInRanking' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 992 | 19 | ❌ 错误 | radix | Missing radix parameter. |
| 1030 | 53 | ⚠️ 警告 | complexity | Arrow function has a complexity of 17. Maximum allowed is 15. |
| 1051 | 31 | ❌ 错误 | no-undefined | Unexpected use of undefined. |
| 1054 | 32 | ❌ 错误 | no-undefined | Unexpected use of undefined. |
| 1057 | 45 | ❌ 错误 | no-undefined | Unexpected use of undefined. |
| 1285 | 1 | ❌ 错误 | max-len | This line has a length of 124. Maximum allowed is 120. |

### 17. src\composables\admin\StudentPoints.js

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

### 18. src\composables\admin\StudentLevel.js

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

### 19. src\composables\admin\StudentPersonalInformation.js

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

### 20. src\views\PointsDashboardPage\PointsDashboardPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 2 | 1 | ❌ 错误 | import/order | `vue` import should occur after import of `element-plus` |
| 3 | 1 | ❌ 错误 | import/order | `vue-router` import should occur after import of `element-plus` |
| 5 | 1 | ❌ 错误 | import/order | `@/stores/theme` import should occur after import of `@/api/StudentApi` |
| 18 | 47 | ❌ 错误 | no-unused-vars | 'View' is defined but never used. Allowed unused vars must match /^_/u. |
| 44 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 45 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 52 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 100 | 1 | ⚠️ 警告 | jsdoc/check-types | Use object shorthand or index signatures instead of `Object`, e.g., `{[key: string]: string}` |
| 172 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 253 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 270 | 2 | ❌ 错误 | no-use-before-define | 'handleTabChange' was used before it was defined. |
| 567 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 568 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 582 | 1 | ❌ 错误 | max-len | This line has a length of 121. Maximum allowed is 120. |
| 595 | 4 | ⚠️ 警告 | no-negated-condition | Unexpected negated condition. |
| 767 | 54 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 796 | 7 | ❌ 错误 | no-unused-vars | 'refreshTimer' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 799 | 7 | ❌ 错误 | no-unused-vars | 'refreshData' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 912 | 19 | ❌ 错误 | radix | Missing radix parameter. |
| 1215 | 1 | ❌ 错误 | max-len | This line has a length of 165. Maximum allowed is 120. |
| 1228 | 1 | ❌ 错误 | max-len | This line has a length of 128. Maximum allowed is 120. |

### 21. src\views\StudentManagerPage\js\StudentManagerPage-Attendance_Records_Dialog.js

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

### 22. src\views\AllMembersPage\AllMembersPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 8 | 35 | ❌ 错误 | no-unused-vars | 'View' is defined but never used. Allowed unused vars must match /^_/u. |
| 114 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 114 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 117 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 118 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 125 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 125 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 136 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 137 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 152 | 1 | ⚠️ 警告 | jsdoc/check-types | Use object shorthand or index signatures instead of `Object`, e.g., `{[key: string]: string}` |
| 169 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 169 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 170 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 171 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 197 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 197 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 198 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 199 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 23. src\composables\admin\StudentAvatar.js

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

### 24. src\views\DashboardPage\DashboardPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 175 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "year" type. |
| 176 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "month" type. |
| 177 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 201 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "monthlyCount" type. |
| 202 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 247 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 260 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "levelCode" type. |
| 261 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 286 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "monthlyCount" type. |
| 287 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 304 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "index" type. |
| 305 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 319 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "index" type. |
| 320 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 335 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data" type. |
| 416 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data" type. |
| 501 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data" type. |

### 25. src\api\StudentApi.js

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

### 26. src\api\points.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 52 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "specialPassword" type. |
| 53 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "adjustReason" type. |
| 54 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "changePoints" type. |
| 55 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "targetStudentInfoId" type. |
| 56 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 91 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "top" type. |
| 92 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 121 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 122 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "top" type. |
| 123 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 155 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 156 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 187 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 188 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 27. src\views\NavigationPage\NavigationPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 5 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 12 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 137 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 138 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 143 | 1 | ⚠️ 警告 | jsdoc/check-types | Use object shorthand or index signatures instead of `Object`, e.g., `{[key: string]: string}` |
| 158 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 159 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 164 | 1 | ⚠️ 警告 | jsdoc/check-types | Use object shorthand or index signatures instead of `Object`, e.g., `{[key: string]: string}` |
| 272 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 312 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 393 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 448 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 28. src\api\AttendanceApi.js

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

### 29. src\views\LoginPage\LoginPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 65 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 88 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 115 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 124 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 126 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 134 | 1 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 176 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 186 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |

### 30. src\stores\admin.js

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

### 31. src\views\NavigationPage\NavigationPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 143 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 144 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 149 | 1 | ⚠️ 警告 | jsdoc/check-types | Use object shorthand or index signatures instead of `Object`, e.g., `{[key: string]: string}` |
| 164 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 165 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 170 | 1 | ⚠️ 警告 | jsdoc/check-types | Use object shorthand or index signatures instead of `Object`, e.g., `{[key: string]: string}` |
| 279 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 319 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 32. src\views\PointsDashboardPage\js\PointsDashboardPageUtils.js

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

### 33. src\views\ScoreChangeRecordsPage\ScoreChangeRecordsPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 16 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 16 | 21 | ❌ 错误 | no-unused-vars | 'Loading' is defined but never used. Allowed unused vars must match /^_/u. |
| 18 | 1 | ❌ 错误 | import/order | `@/api/points` import should occur before import of `@/stores/theme` |
| 19 | 1 | ❌ 错误 | import/order | `@/api/student` import should occur before import of `@/stores/theme` |
| 96 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 97 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 128 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 297 | 1 | ❌ 错误 | max-len | This line has a length of 149. Maximum allowed is 120. |

### 34. src\views\AllMembersPage\js\AllMembersPageUtils.js

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

### 35. src\views\AllMembersPage\js\PointsServer.js

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

### 36. src\views\AttendancePage\AttendancePage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 11 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 12 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 17 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 45 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 51 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 52 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 69 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 94 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |

### 37. src\views\PointsDashboardPage\js\PointsDashboardPage.js

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

### 38. src\views\RegisterPage\RegisterPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 13 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 15 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "date". |
| 34 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 79 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 112 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 153 | 12 | ⚠️ 警告 | no-negated-condition | Unexpected negated condition. |
| 178 | 5 | ⚠️ 警告 | no-negated-condition | Unexpected negated condition. |
| 201 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 39. src\api\PointsApi.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 8 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 9 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 23 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "top" type. |
| 24 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 37 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 38 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 40. src\views\AdminPage\AdminPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 15 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 28 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 30 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 46 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |

### 41. src\views\AllMembersPage\js\AdjustRecordsDialogManager.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 27 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "student" type. |
| 77 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 85 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "time" type. |
| 86 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 110 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "points" type. |
| 111 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 42. src\views\AllMembersPage\js\PersonalInformation.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 30 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 31 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 31 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 67 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 68 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 68 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 43. src\views\StudentManagerPage\js\StudentManagerPageStudentAttendanceServer.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 12 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 13 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 36 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "dateStr" type. |
| 37 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "slot" type. |
| 38 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentAttendanceRecords" type. |
| 39 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 44. src\components\ThemeToggle.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 1 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 23 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag (preference). Replace "const" JSDoc tag with "constant". |
| 23 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @const "themeStore" type "Object"; prefer: "object". |
| 29 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag (preference). Replace "const" JSDoc tag with "constant". |
| 30 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag (preference). Replace "const" JSDoc tag with "constant". |

### 45. src\views\StudentManagerPage\js\StudentManagerPage.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 16 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 17 | 1 | ⚠️ 警告 | jsdoc/require-param-description | Missing JSDoc @param "adminStudentDatabaseTableId" description. |
| 17 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "adminStudentDatabaseTableId" type. |
| 18 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 30 | 5 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |

### 46. src\api\StatisticsApi.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 33 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 34 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 35 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 35 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 47. src\router\index.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 506 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 507 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 522 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 523 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "isValid" type. |

### 48. src\views\AllMembersPage\AllMembersPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 1 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 15 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 26 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 27 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 49. src\views\HomePage\HomePage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 16 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 18 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 50. src\views\HomePage\HomePageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 5 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 12 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 25 | 1 | ❌ 错误 | import/order | There should be at least one empty line between import groups |

### 51. src\views\PointsDashboardPage\PointsDashboardPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 1 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 15 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 26 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 27 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 52. src\views\ProfilePage\ProfilePage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 1 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 11 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 12 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 17 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |

### 53. src\views\ScoreChangeRecordsPage\ScoreChangeRecordsPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 97 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 98 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 129 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 54. src\views\StudentManagerPage\js\StudentManagerPageUtils.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 8 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 9 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 17 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 18 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 55. src\App.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 11 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 12 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 18 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |

### 56. src\api\super_admin.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 31 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 32 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 32 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 57. src\stores\user.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 36 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "info" type. |
| 37 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 55 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "level" type. |

### 58. src\views\DashboardPage\DashboardPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 11 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 12 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 18 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |

### 59. src\views\HomePage\js\HomePage.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 19 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 19 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 110 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |

### 60. src\views\NavigationPage\NavigationPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 1 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 26 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 27 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 61. src\views\ScoreChangeRecordsPage\ScoreChangeRecordsPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 1 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 26 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 27 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 62. src\views\StudentManagerPage\StudentManagerPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 1 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 20 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 21 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 63. src\api\StudentManagementApi.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 8 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 9 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 64. src\composables\ApiInterceptor.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 26 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 51 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "api" type. |

### 65. src\views\DashboardPage\DashboardPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 111 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |

### 66. src\views\HomePage\HomePageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |

### 67. src\views\ProfilePage\js\ProfilePageUtils.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 21 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 22 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 68. src\stores\theme.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 82 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "theme" type. |

## 💡 修复建议

1. 运行 `npm run lint:fix` 自动修复可修复的问题
2. 运行 `npm run lint` 查看所有问题详情
3. 手动修复无法自动修复的问题

---

*报告生成时间: 2026/1/6 08:51:54*
