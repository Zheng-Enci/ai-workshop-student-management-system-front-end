# ESLint 代码规范检查报告

## 📊 总体统计

| 指标 | 数值 |
|------|------|
| 检查文件数 | 78 |
| 错误总数 | 1544 |
| 警告总数 | 1032 |
| 问题总数 | 2576 |

## 📈 状态评估

❌ **发现 1544 个错误**，需要立即修复。

## 📋 按文件类型统计

| 文件类型 | 文件数 | 错误 | 警告 |
|---------|--------|------|------|
| Vue | 36 | 1478 | 537 |
| JavaScript | 42 | 66 | 495 |

## ⚠️ 有问题的文件

| 文件路径 | 错误数 | 警告数 | 状态 |
|---------|--------|--------|------|
| src\views\AdminPage\AdminPageMobile.vue | 456 | 2 | ❌ |
| src\views\AttendanceAnalysisPage\AttendanceAnalysisPageDesktop.vue | 343 | 46 | ❌ |
| src\views\AdminPage\AdminPageDesktop.vue | 165 | 0 | ❌ |
| src\views\StudentManagerPage\StudentManagerPageMobile.vue | 110 | 43 | ❌ |
| src\views\AdminPage\AdminPage.js | 29 | 98 | ❌ |
| src\views\AttendancePage\AttendancePageMobile.vue | 92 | 28 | ❌ |
| src\views\StudentManagerPage\StudentManagerPageDesktop.vue | 66 | 40 | ❌ |
| src\api\student.js | 0 | 82 | ⚠️ |
| src\views\AttendanceAnalysisPage\AttendanceAnalysisPageMobile.vue | 60 | 19 | ❌ |
| src\api\attendance.js | 0 | 63 | ⚠️ |
| src\views\AllMembersPage\AllMembersPageDesktop.vue | 23 | 40 | ❌ |
| src\views\PointsDashboardPage\PointsDashboardPageMobile.vue | 15 | 48 | ❌ |
| src\views\ProfilePage\ProfilePageMobile.vue | 22 | 34 | ❌ |
| src\views\PointsDashboardPage\PointsDashboardPageDesktop.vue | 26 | 28 | ❌ |
| src\views\ProfilePage\ProfilePageDesktop.vue | 1 | 46 | ❌ |
| src\composables\admin\StudentAttendance.js | 10 | 29 | ❌ |
| src\views\HomePage\HomePageDesktop.vue | 34 | 4 | ❌ |
| src\views\AttendancePage\AttendancePageDesktop.vue | 16 | 16 | ❌ |
| src\views\AllMembersPage\AllMembersPageMobile.vue | 3 | 27 | ❌ |
| src\views\DashboardPage\DashboardPageMobile.vue | 0 | 30 | ⚠️ |
| src\composables\admin\StudentPoints.js | 6 | 23 | ❌ |
| src\composables\admin\StudentLevel.js | 7 | 18 | ❌ |
| src\composables\admin\StudentPersonalInformation.js | 2 | 20 | ❌ |
| src\views\StudentManagerPage\js\StudentManagerPage-Attendance_Records_Dialog.js | 2 | 19 | ❌ |
| src\views\NavigationPage\NavigationPageDesktop.vue | 0 | 19 | ⚠️ |
| src\composables\admin\StudentAvatar.js | 3 | 14 | ❌ |
| src\views\DashboardPage\DashboardPageDesktop.vue | 0 | 17 | ⚠️ |
| src\api\StudentApi.js | 0 | 14 | ⚠️ |
| src\api\points.js | 0 | 14 | ⚠️ |
| src\views\NavigationPage\NavigationPageMobile.vue | 2 | 11 | ❌ |
| src\api\AttendanceApi.js | 0 | 10 | ⚠️ |
| src\views\LoginPage\LoginPage.vue | 6 | 4 | ❌ |
| src\App.vue | 7 | 2 | ❌ |
| src\stores\admin.js | 5 | 4 | ❌ |
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
| src\views\PointsDashboardPage\PointsDashboardPage.vue | 3 | 1 | ❌ |
| src\views\ProfilePage\ProfilePage.vue | 3 | 1 | ❌ |
| src\views\ScoreChangeRecordsPage\ScoreChangeRecordsPageDesktop.vue | 0 | 4 | ⚠️ |
| src\views\StudentManagerPage\js\StudentManagerPageUtils.js | 0 | 4 | ⚠️ |
| src\api\super_admin.js | 0 | 3 | ⚠️ |
| src\stores\user.js | 0 | 3 | ⚠️ |
| src\views\DashboardPage\DashboardPage.vue | 2 | 1 | ❌ |
| src\views\ScoreChangeRecordsPage\ScoreChangeRecordsPage.vue | 2 | 1 | ❌ |
| src\views\StudentManagerPage\StudentManagerPage.vue | 2 | 1 | ❌ |
| src\api\StudentManagementApi.js | 0 | 2 | ⚠️ |
| src\composables\ApiInterceptor.js | 0 | 2 | ⚠️ |
| src\views\AllMembersPage\AllMembersPage.vue | 1 | 1 | ❌ |
| src\views\HomePage\HomePage.vue | 0 | 2 | ⚠️ |
| src\views\HomePage\HomePageMobile.vue | 1 | 1 | ❌ |
| src\views\HomePage\js\HomePage.js | 0 | 2 | ⚠️ |
| src\views\ProfilePage\js\ProfilePageUtils.js | 0 | 2 | ⚠️ |
| src\stores\theme.js | 0 | 1 | ⚠️ |
| src\views\NavigationPage\NavigationPage.vue | 0 | 1 | ⚠️ |

## 📝 详细问题列表

### 1. src\views\AdminPage\AdminPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 9 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "features". |
| 17 | 8 | ❌ 错误 | object-curly-spacing | A space is required after '{'. |
| 17 | 40 | ❌ 错误 | object-curly-spacing | A space is required before '}'. |
| 21 | 8 | ❌ 错误 | object-curly-spacing | A space is required after '{'. |
| 21 | 21 | ❌ 错误 | object-curly-spacing | A space is required before '}'. |
| 29 | 1 | ❌ 错误 | import/order | There should be no empty line within import group |
| 29 | 1 | ❌ 错误 | import/order | `element-plus` import should occur before import of `vue` |
| 30 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 全局提示组件'. |
| 31 | 9 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 图标容器组件'. |
| 32 | 10 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 输入框组件'. |
| 33 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 按钮组件'. |
| 34 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 下拉选择器组件'. |
| 35 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 下拉选项组件'. |
| 36 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 对话框组件'. |
| 37 | 9 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 表单组件'. |
| 38 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 表单项组件'. |
| 39 | 15 | ❌ 错误 | comma-spacing | A space is required after ','. |
| 41 | 9 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 标签页组件'. |
| 42 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 标签页面板组件'. |
| 43 | 8 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 标签组件'. |
| 44 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 提示框组件'. |
| 46 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历组件'. |
| 76 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `vue` |
| 77 | 7 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 用户图标'. |
| 78 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历图标'. |
| 79 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 趋势图图标'. |
| 80 | 9 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 搜索图标'. |
| 81 | 10 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 刷新图标'. |
| 82 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 切换按钮图标'. |
| 83 | 7 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 编辑图标'. |
| 84 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 填充用户图标'. |
| 85 | 8 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 时钟图标'. |
| 86 | 10 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 警告图标'. |
| 87 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 文档图标'. |
| 88 | 10 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 加载图标'. |
| 89 | 6 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 盒子图标'. |
| 90 | 6 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 锁图标'. |
| 95 | 1 | ❌ 错误 | import/order | `@/api/student` import should occur before import of `./AdminPage.js` |
| 95 | 8 | ❌ 错误 | object-curly-spacing | A space is required after '{'. |
| 95 | 21 | ❌ 错误 | object-curly-spacing | A space is required before '}'. |
| 100 | 1 | ❌ 错误 | import/order | `element-plus/dist/locale/zh-cn.mjs` import should occur before import of `vue` |
| 116 | 7 | ❌ 错误 | no-unused-vars | 'monthMap' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 133 | 7 | ❌ 错误 | no-unused-vars | 'monthObserver' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 149 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 是否已通过身份验证（布...'. |
| 150 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 超级管理员验证密码（字...'. |
| 151 | 2 | ❌ 错误 | no-unused-vars | 'authError' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 151 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 身份验证错误信息（字符...'. |
| 152 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 身份验证加载状态（布尔...'. |
| 153 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 全局数据加载状态（布尔...'. |
| 154 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 核心数据是否加载完成（...'. |
| 155 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 数据加载进度（百分比，...'. |
| 156 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 数据加载状态文本（字符...'. |
| 157 | 2 | ❌ 错误 | no-unused-vars | 'students' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 157 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 所有学生原始数据列表（...'. |
| 158 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 学生搜索关键词（字符串...'. |
| 159 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 分页当前页码（数字）'. |
| 160 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 分页每页条数（数字）'. |
| 161 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 学生总数（数字）'. |
| 162 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 今日签到人数（数字）'. |
| 163 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 本月签到人数（数字）'. |
| 164 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 学生等级映射表（对象，...'. |
| 166 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 学生所属管理员映射表（...'. |
| 167 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 学生积分信息映射表（对...'. |
| 168 | 17 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 当前激活的学生等级标签...'. |
| 169 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 编辑学生信息对话框显示...'. |
| 170 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 编辑表单引用（Ref）'. |
| 171 | 11 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 编辑表单数据（对象）'. |
| 173 | 25 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 今日考勤记录列表（数组...'. |
| 175 | 21 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 当前选中的学生信息（对...'. |
| 176 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历组件选中日期（日期...'. |
| 177 | 2 | ❌ 错误 | no-unused-vars | 'scrollPosition' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 177 | 17 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 页面滚动位置（数字）'. |
| 179 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历时间段配置（数组）'. |
| 180 | 2 | ❌ 错误 | no-unused-vars | 'filteredStudentAttendanceRecords' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 182 | 21 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 趋势图对话框显示状态（...'. |
| 183 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 热力图容器引用（Ref...'. |
| 184 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 趋势图容器引用（Ref...'. |
| 185 | 2 | ❌ 错误 | no-unused-vars | 'heatmapInstance' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 185 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 热力图实例（Ref）'. |
| 186 | 2 | ❌ 错误 | no-unused-vars | 'lineInstance' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 186 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 趋势图实例（Ref）'. |
| 188 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 选中的日期（字符串）'. |
| 189 | 22 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 补卡对话框显示状态（布...'. |
| 190 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 补卡操作加载状态（布尔...'. |
| 191 | 23 | ❌ 错误 | comma-spacing | A space is required after ','. |
| 192 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 补卡步骤（date:选...'. |
| 193 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 补卡表单引用（Ref）'. |
| 194 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日期选择器引用（Ref...'. |
| 195 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 补卡表单数据（对象）'. |
| 196 | 22 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 积分修改对话框显示状态...'. |
| 197 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 积分修改加载状态（布尔...'. |
| 198 | 23 | ❌ 错误 | comma-spacing | A space is required after ','. |
| 199 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 积分表单引用（Ref）'. |
| 200 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 积分表单数据（对象）'. |
| 202 | 28 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 积分变动记录加载状态（...'. |
| 203 | 21 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 积分变动记录列表（数组...'. |
| 205 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日期快捷选择配置（数组...'. |
| 206 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 学生等级选项（数组）'. |
| 207 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 管理员选项（数组）'. |
| 208 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 筛选后的学生列表（数组...'. |
| 210 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 编辑表单校验规则（对象...'. |
| 211 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 积分表单校验规则（对象...'. |
| 212 | 22 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 补卡日期表单校验规则（...'. |
| 215 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 根据等级获取学生列表'. |
| 216 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 修改学生等级'. |
| 217 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 修改学生所属管理员'. |
| 218 | 2 | ❌ 错误 | no-unused-vars | 'loadStudentLevels' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 218 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 加载学生等级数据'. |
| 219 | 2 | ❌ 错误 | no-unused-vars | 'loadStudentAttendanceCounts' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 220 | 2 | ❌ 错误 | no-unused-vars | 'loadStudentAdmins' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 220 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 加载学生所属管理员数据'. |
| 221 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 头像加载失败处理'. |
| 222 | 2 | ❌ 错误 | no-unused-vars | 'loadStatistics' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 222 | 17 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 加载统计数据（总数、今...'. |
| 223 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 刷新所有数据'. |
| 224 | 17 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 打开编辑学生对话框'. |
| 225 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 取消编辑操作'. |
| 226 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 确认编辑学生信息'. |
| 227 | 22 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 显示今日考勤记录'. |
| 229 | 21 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 获取时间段样式类'. |
| 230 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 获取时间段名称'. |
| 231 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 判断指定日期时间段是否...'. |
| 232 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 打开日期详情对话框'. |
| 235 | 21 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 关闭热力图对话框'. |
| 236 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 关闭趋势图对话框'. |
| 238 | 22 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 格式化日历标题'. |
| 239 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历切换到上个月'. |
| 240 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历切换到下个月'. |
| 241 | 10 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 日历回到今日'. |
| 242 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 获取时间段标签'. |
| 244 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 初始化热力图'. |
| 245 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 初始化趋势图'. |
| 246 | 2 | ❌ 错误 | no-unused-vars | 'generateHeatmapData' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 246 | 22 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 生成热力图数据'. |
| 247 | 2 | ❌ 错误 | no-unused-vars | 'generateLineData' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 247 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 生成趋势图数据'. |
| 248 | 20 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 打开热力图对话框'. |
| 249 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 打开趋势图对话框'. |
| 250 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 身份验证'. |
| 251 | 9 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 退出登录'. |
| 252 | 2 | ❌ 错误 | no-unused-vars | 'getShortcutDate' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 252 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 获取快捷日期'. |
| 253 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 打开补卡对话框'. |
| 254 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 取消补卡操作'. |
| 255 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 处理日期选择变化'. |
| 256 | 21 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 格式化选中的日期'. |
| 257 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 确认补卡日期步骤'. |
| 260 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 选择补卡小时'. |
| 261 | 17 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 判断小时是否选中'. |
| 262 | 2 | ❌ 错误 | no-unused-vars | 'updateAttendanceTime' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 263 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 提交补卡操作'. |
| 264 | 19 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 打开积分修改对话框'. |
| 266 | 15 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 取消积分修改'. |
| 267 | 16 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 确认积分修改'. |
| 270 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 格式化时间'. |
| 271 | 14 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 加载所有核心数据'. |
| 272 | 12 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 考勤时间段配置（数组）'. |
| 275 | 13 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 切换主题（亮色/暗色）'. |
| 291 | 24 | ❌ 错误 | no-undef | 'adminStore' is not defined. |
| 305 | 4 | ❌ 错误 | no-undef | 'adminStore' is not defined. |
| 327 | 18 | ❌ 错误 | no-multi-spaces | Multiple spaces found before '// 重新初始化趋势图'. |
| 633 | 1 | ❌ 错误 | max-len | This line has a length of 149. Maximum allowed is 120. |
| 662 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 9 tabs. |
| 663 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 8 tabs. |
| 673 | 1 | ❌ 错误 | max-len | This line has a length of 200. Maximum allowed is 120. |
| 673 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 10 tabs. |
| 674 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 9 tabs. |
| 678 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 10 tabs. |
| 679 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 9 tabs. |
| 681 | 1 | ❌ 错误 | max-len | This line has a length of 127. Maximum allowed is 120. |
| 681 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 10 tabs. |
| 682 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 9 tabs. |
| 983 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 984 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 985 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 986 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 988 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 989 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 990 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 991 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 992 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 993 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 994 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 995 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 996 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 997 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 998 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 999 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1000 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1001 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1002 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1003 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1004 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1005 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1006 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1007 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1008 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1009 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1010 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1011 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1012 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1013 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1014 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1015 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1016 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1017 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1018 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1019 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1020 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1021 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1022 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1023 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1024 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1025 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1026 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1027 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1028 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1029 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1030 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1031 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1032 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1033 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1034 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1035 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1036 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1037 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1038 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1039 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1040 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1041 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1042 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1043 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1044 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1045 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1046 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1047 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1048 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1049 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1050 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1124 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1125 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1126 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1127 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1128 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1130 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1131 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1132 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1133 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1134 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1135 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1136 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1137 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1138 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1139 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1140 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1141 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1142 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1143 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1144 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1145 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1146 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1148 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1149 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1150 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1151 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1152 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1153 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1154 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1155 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1156 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1157 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1158 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1159 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1160 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1161 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1162 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1163 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1164 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1165 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1166 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1167 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1168 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1169 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1178 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1179 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1180 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1181 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1182 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1183 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1184 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1185 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1186 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1187 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1340 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1341 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1342 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1343 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1344 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1346 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1347 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1348 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1349 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1350 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1351 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1352 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1353 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1354 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1355 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1356 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1357 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1359 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1360 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1361 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1362 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1363 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1364 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1365 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1366 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1367 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1368 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1369 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1370 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1371 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1372 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1373 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1374 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1375 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1376 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1378 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1379 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1380 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1381 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1382 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1383 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1384 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1385 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1386 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1387 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1388 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1389 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1390 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1391 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1392 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1393 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1394 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1395 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1396 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1397 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1398 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1399 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1400 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1401 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1402 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1403 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1404 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1405 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1406 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1407 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1408 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1409 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1410 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1411 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1412 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1413 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1414 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1415 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1416 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1417 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1418 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1419 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1420 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1421 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1422 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1423 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1424 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1425 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1426 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1427 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1428 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1430 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1431 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1432 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1433 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1434 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1435 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1436 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1437 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1438 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1439 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1440 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1441 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1442 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1443 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1444 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1445 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1446 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1447 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1448 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1449 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1450 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1451 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1452 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1453 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1454 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1455 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1456 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1457 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1458 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1459 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1460 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1461 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1462 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1463 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1464 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1465 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1466 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1467 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1468 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1469 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1470 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1471 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1473 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1474 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1475 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1476 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1477 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1478 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1479 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1480 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1481 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1482 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1483 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1484 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1485 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1486 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1487 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1488 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1489 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1490 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1491 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1492 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1493 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1494 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1495 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1496 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1497 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1498 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1499 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1500 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1501 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1502 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1503 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1504 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1505 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1506 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1507 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1508 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |

### 2. src\views\AttendanceAnalysisPage\AttendanceAnalysisPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 3 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 28 | 1 | ❌ 错误 | import/order | There should be no empty line within import group |
| 28 | 1 | ❌ 错误 | import/order | `vue` import should occur after import of `element-plus` |
| 34 | 1 | ❌ 错误 | import/order | There should be no empty line within import group |
| 34 | 1 | ❌ 错误 | import/order | `vue-router` import should occur after import of `element-plus` |
| 51 | 1 | ❌ 错误 | import/order | There should be no empty line within import group |
| 67 | 1 | ❌ 错误 | import/order | There should be no empty line within import group |
| 73 | 1 | ❌ 错误 | import/order | There should be no empty line within import group |
| 84 | 1 | ❌ 错误 | import/order | There should be no empty line within import group |
| 90 | 1 | ❌ 错误 | import/order | There should be no empty line within import group |
| 112 | 1 | ❌ 错误 | import/order | There should be no empty line within import group |
| 139 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 144 | 7 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 145 | 4 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 146 | 4 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 148 | 7 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 149 | 4 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 150 | 4 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 153 | 41 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 155 | 11 | ❌ 错误 | no-use-before-define | 'initPeriodChart' was used before it was defined. |
| 156 | 11 | ❌ 错误 | no-use-before-define | 'initTimelineChart' was used before it was defined. |
| 166 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 169 | 26 | ❌ 错误 | sonarjs/no-identical-functions | Update this function so that its implementation is not identical to the one on line 142. |
| 171 | 7 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 172 | 4 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 173 | 4 | ❌ 错误 | no-use-before-define | 'periodChartInstance' was used before it was defined. |
| 175 | 7 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 176 | 4 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 177 | 4 | ❌ 错误 | no-use-before-define | 'timelineChartInstance' was used before it was defined. |
| 180 | 41 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 182 | 11 | ❌ 错误 | no-use-before-define | 'initPeriodChart' was used before it was defined. |
| 183 | 11 | ❌ 错误 | no-use-before-define | 'initTimelineChart' was used before it was defined. |
| 193 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 232 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 251 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 257 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 269 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 305 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 306 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 316 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 341 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 348 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 401 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 410 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 415 | 9 | ❌ 错误 | no-use-before-define | 'loadTimelineData' was used before it was defined. |
| 418 | 4 | ❌ 错误 | no-use-before-define | 'updateTimelineChart' was used before it was defined. |
| 421 | 11 | ❌ 错误 | no-use-before-define | 'initTimelineChart' was used before it was defined. |
| 431 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 437 | 10 | ❌ 错误 | no-use-before-define | 'loadTimelineData' was used before it was defined. |
| 440 | 5 | ❌ 错误 | no-use-before-define | 'updateTimelineChart' was used before it was defined. |
| 443 | 12 | ❌ 错误 | no-use-before-define | 'initTimelineChart' was used before it was defined. |
| 454 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 455 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 470 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 471 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 483 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 484 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 496 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "records" type "Object"; prefer: "object". |
| 496 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 497 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 497 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 505 | 1 | ❌ 错误 | max-len | This line has a length of 165. Maximum allowed is 120. |
| 505 | 33 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 505 | 87 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 505 | 143 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 513 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "records" type "Object"; prefer: "object". |
| 513 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 514 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 534 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 545 | 28 | ⚠️ 警告 | no-await-in-loop | Unexpected `await` inside a loop. |
| 546 | 6 | ⚠️ 警告 | max-depth | Blocks are nested too deeply (5). Maximum allowed is 4. |
| 576 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 605 | 4 | ❌ 错误 | no-use-before-define | 'updatePeriodChart' was used before it was defined. |
| 614 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 617 | 27 | ⚠️ 警告 | complexity | Arrow function has a complexity of 27. Maximum allowed is 15. |
| 790 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 824 | 5 | ❌ 错误 | no-use-before-define | 'updateTimelineChart' was used before it was defined. |
| 834 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 837 | 29 | ⚠️ 警告 | complexity | Arrow function has a complexity of 60. Maximum allowed is 15. |
| 871 | 14 | ❌ 错误 | no-shadow | 'data' is already declared in the upper scope on line 841 column 8. |
| 979 | 14 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1058 | 48 | ❌ 错误 | radix | Missing radix parameter. |
| 1065 | 12 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1065 | 12 | ❌ 错误 | no-shadow | 'data' is already declared in the upper scope on line 841 column 8. |
| 1210 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1212 | 1 | ⚠️ 警告 | jsdoc/check-param-names | @param "selectedTimeRange" does not match an existing function parameter. |
| 1212 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 1213 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 1218 | 26 | ⚠️ 警告 | complexity | Async arrow function has a complexity of 22. Maximum allowed is 15. |
| 1232 | 1 | ❌ 错误 | max-len | This line has a length of 140. Maximum allowed is 120. |
| 1241 | 1 | ❌ 错误 | max-len | This line has a length of 131. Maximum allowed is 120. |
| 1254 | 1 | ❌ 错误 | max-len | This line has a length of 155. Maximum allowed is 120. |
| 1255 | 1 | ❌ 错误 | max-len | This line has a length of 129. Maximum allowed is 120. |
| 1268 | 1 | ❌ 错误 | max-len | This line has a length of 122. Maximum allowed is 120. |
| 1269 | 1 | ❌ 错误 | max-len | This line has a length of 123. Maximum allowed is 120. |
| 1276 | 1 | ❌ 错误 | max-len | This line has a length of 149. Maximum allowed is 120. |
| 1284 | 1 | ❌ 错误 | max-len | This line has a length of 152. Maximum allowed is 120. |
| 1334 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1357 | 5 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1383 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1393 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1404 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1516 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 2 tabs but found 1 tab. |
| 1517 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 2 tabs but found 1 tab. |
| 1518 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 2 tabs but found 1 tab. |
| 1519 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1520 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1521 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1522 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1523 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1524 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1525 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1526 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1527 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1528 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1529 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1530 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1531 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1532 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1533 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1534 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1535 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1536 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1537 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1538 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1539 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1540 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1541 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1542 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1543 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1545 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1546 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1547 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1548 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1549 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1550 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1551 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1552 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1553 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1554 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1555 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1556 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1557 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1558 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1559 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1560 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1561 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1562 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1563 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1564 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1565 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1566 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1567 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1568 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1569 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1570 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1571 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1572 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1573 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1574 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1575 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1576 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1577 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1578 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1579 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1580 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1581 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1582 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1583 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1584 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1585 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1586 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1587 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1588 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1589 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1591 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1592 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1593 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1594 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1595 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1596 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1597 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1598 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1599 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1600 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1601 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1602 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1603 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1604 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1605 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1606 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1607 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1608 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1609 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1610 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1611 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1612 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1613 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1614 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1615 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1616 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1617 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1618 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1619 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1620 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1621 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1622 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1623 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1624 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1626 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1627 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1628 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1629 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1630 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1631 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1632 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1633 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1634 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1635 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1636 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1637 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1638 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1639 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1640 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1641 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1642 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1643 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1644 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1645 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1646 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1647 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1648 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1649 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1650 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1651 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1652 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1653 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1654 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1655 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1656 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1657 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1658 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1659 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1660 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1661 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1662 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1663 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1664 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1665 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1666 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1667 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1668 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1669 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1670 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1671 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1672 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1673 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1673 | 13 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 1674 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1675 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1676 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1677 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1678 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1679 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1680 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1681 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1682 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1683 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1684 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1685 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1686 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1688 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1689 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1690 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1691 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1692 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1693 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1694 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1695 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1696 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1697 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1698 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1699 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1700 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1701 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1702 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1703 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1704 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1705 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1706 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1707 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1708 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1709 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1710 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1711 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1712 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1713 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1714 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1715 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1716 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1717 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1718 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1719 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1720 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1721 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1722 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1723 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1724 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1725 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1726 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 10 tabs but found 9 tabs. |
| 1727 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1728 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1729 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1730 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1731 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1732 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1733 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1734 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1735 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1736 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1737 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1738 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 9 tabs but found 8 tabs. |
| 1739 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 8 tabs but found 7 tabs. |
| 1740 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 7 tabs but found 6 tabs. |
| 1741 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 6 tabs but found 5 tabs. |
| 1742 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 1743 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 1744 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 1745 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 2 tabs but found 1 tab. |
| 1746 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 2 tabs but found 8 tabs. |
| 1747 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 9 tabs. |
| 1748 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 9 tabs. |
| 1749 | 1 | ❌ 错误 | max-len | This line has a length of 137. Maximum allowed is 120. |
| 1749 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 10 tabs. |
| 1750 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 11 tabs. |
| 1751 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 10 tabs. |
| 1752 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 9 tabs. |
| 1753 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 2 tabs but found 8 tabs. |
| 1754 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 2 tabs but found 8 tabs. |
| 1755 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 2 tabs but found 8 tabs. |
| 1756 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 2 tabs but found 8 tabs. |
| 1757 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 2 tabs but found 8 tabs. |
| 1758 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 9 tabs. |
| 1759 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 9 tabs. |
| 1760 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 9 tabs. |
| 1761 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 2 tabs but found 8 tabs. |
| 1762 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 1 tab but found 7 tabs. |
| 1763 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 1 tab but found 6 tabs. |
| 1763 | 7 | ❌ 错误 | vue/no-parsing-error | Parsing error: x-invalid-end-tag. |
| 1764 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 1 tab but found 5 tabs. |
| 1764 | 6 | ❌ 错误 | vue/no-parsing-error | Parsing error: x-invalid-end-tag. |
| 1766 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 1 tab but found 5 tabs. |
| 1767 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 1 tab but found 5 tabs. |
| 1768 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 2 tabs but found 6 tabs. |
| 1769 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 7 tabs. |
| 1770 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 7 tabs. |
| 1771 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 2 tabs but found 6 tabs. |
| 1772 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 2 tabs but found 6 tabs. |
| 1773 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 2 tabs but found 6 tabs. |
| 1774 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 7 tabs. |
| 1775 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 7 tabs. |
| 1776 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 8 tabs. |
| 1777 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 8 tabs. |
| 1778 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 9 tabs. |
| 1779 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 8 tabs. |
| 1780 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 8 tabs. |
| 1781 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 7 tabs. |
| 1782 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 7 tabs. |
| 1783 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 7 tabs. |
| 1784 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 8 tabs. |
| 1785 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 8 tabs. |
| 1786 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 7 tabs. |
| 1787 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 7 tabs. |
| 1788 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 7 tabs. |
| 1789 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 8 tabs. |
| 1790 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 8 tabs. |
| 1791 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 9 tabs. |
| 1792 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 8 tabs. |
| 1793 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 8 tabs. |
| 1794 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 7 tabs. |
| 1795 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 2 tabs but found 6 tabs. |
| 1796 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 1 tab but found 5 tabs. |
| 1797 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 1 tab but found 4 tabs. |
| 1797 | 5 | ❌ 错误 | vue/no-parsing-error | Parsing error: x-invalid-end-tag. |
| 1798 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 1 tab but found 3 tabs. |
| 1798 | 4 | ❌ 错误 | vue/no-parsing-error | Parsing error: x-invalid-end-tag. |
| 1799 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 1 tab but found 2 tabs. |
| 1799 | 3 | ❌ 错误 | vue/no-parsing-error | Parsing error: x-invalid-end-tag. |
| 1800 | 2 | ❌ 错误 | vue/no-parsing-error | Parsing error: x-invalid-end-tag. |

### 3. src\views\AdminPage\AdminPageDesktop.vue

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

### 4. src\views\StudentManagerPage\StudentManagerPageMobile.vue

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
| 840 | 23 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 840 | 23 | ❌ 错误 | no-undef | 'StudentManagerPageAttendance_Records_Dialog' is not defined. |
| 935 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 945 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 946 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 947 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 963 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 971 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 972 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 972 | 23 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 972 | 23 | ❌ 错误 | no-undef | 'StudentManagerPageAttendance_Records_Dialog' is not defined. |
| 988 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1206 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1355 | 5 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 1506 | 1 | ❌ 错误 | max-len | This line has a length of 124. Maximum allowed is 120. |
| 1609 | 1 | ❌ 错误 | max-len | This line has a length of 141. Maximum allowed is 120. |
| 1671 | 1 | ❌ 错误 | max-len | This line has a length of 130. Maximum allowed is 120. |
| 1807 | 1 | ❌ 错误 | max-len | This line has a length of 138. Maximum allowed is 120. |
| 1811 | 1 | ❌ 错误 | max-len | This line has a length of 142. Maximum allowed is 120. |
| 1815 | 1 | ❌ 错误 | max-len | This line has a length of 138. Maximum allowed is 120. |

### 5. src\views\AdminPage\AdminPage.js

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

### 6. src\views\AttendancePage\AttendancePageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 13 | 8 | ❌ 错误 | object-curly-spacing | A space is required after '{'. |
| 13 | 55 | ❌ 错误 | object-curly-spacing | A space is required before '}'. |
| 15 | 8 | ❌ 错误 | object-curly-spacing | A space is required after '{'. |
| 15 | 36 | ❌ 错误 | object-curly-spacing | A space is required before '}'. |
| 26 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 26 | 8 | ❌ 错误 | object-curly-spacing | A space is required after '{'. |
| 26 | 88 | ❌ 错误 | object-curly-spacing | A space is required before '}'. |
| 28 | 8 | ❌ 错误 | object-curly-spacing | A space is required after '{'. |
| 28 | 18 | ❌ 错误 | object-curly-spacing | A space is required before '}'. |
| 31 | 8 | ❌ 错误 | object-curly-spacing | A space is required after '{'. |
| 31 | 15 | ❌ 错误 | object-curly-spacing | A space is required before '}'. |
| 32 | 8 | ❌ 错误 | object-curly-spacing | A space is required after '{'. |
| 32 | 48 | ❌ 错误 | object-curly-spacing | A space is required before '}'. |
| 34 | 8 | ❌ 错误 | object-curly-spacing | A space is required after '{'. |
| 34 | 22 | ❌ 错误 | object-curly-spacing | A space is required before '}'. |
| 35 | 8 | ❌ 错误 | object-curly-spacing | A space is required after '{'. |
| 35 | 21 | ❌ 错误 | object-curly-spacing | A space is required before '}'. |
| 47 | 7 | ❌ 错误 | object-curly-spacing | A space is required after '{'. |
| 47 | 19 | ❌ 错误 | object-curly-spacing | A space is required before '}'. |
| 84 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 104 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 120 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 160 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 174 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 204 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 212 | 10 | ❌ 错误 | no-use-before-define | 'isSlotSigned' was used before it was defined. |
| 227 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 228 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 264 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 278 | 30 | ❌ 错误 | object-curly-spacing | A space is required after '{'. |
| 278 | 76 | ❌ 错误 | object-curly-spacing | A space is required before '}'. |
| 282 | 29 | ❌ 错误 | object-curly-spacing | A space is required after '{'. |
| 282 | 75 | ❌ 错误 | object-curly-spacing | A space is required before '}'. |
| 286 | 28 | ❌ 错误 | object-curly-spacing | A space is required after '{'. |
| 286 | 74 | ❌ 错误 | object-curly-spacing | A space is required before '}'. |
| 300 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 302 | 42 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 320 | 30 | ❌ 错误 | object-curly-spacing | A space is required after '{'. |
| 320 | 76 | ❌ 错误 | object-curly-spacing | A space is required before '}'. |
| 325 | 28 | ❌ 错误 | object-curly-spacing | A space is required after '{'. |
| 325 | 74 | ❌ 错误 | object-curly-spacing | A space is required before '}'. |
| 337 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 346 | 25 | ❌ 错误 | object-curly-spacing | A space is required after '{'. |
| 346 | 71 | ❌ 错误 | object-curly-spacing | A space is required before '}'. |
| 366 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 379 | 3 | ❌ 错误 | object-curly-spacing | A space is required after '{'. |
| 379 | 33 | ❌ 错误 | object-curly-spacing | A space is required before '}'. |
| 380 | 3 | ❌ 错误 | object-curly-spacing | A space is required after '{'. |
| 380 | 34 | ❌ 错误 | object-curly-spacing | A space is required before '}'. |
| 381 | 3 | ❌ 错误 | object-curly-spacing | A space is required after '{'. |
| 381 | 34 | ❌ 错误 | object-curly-spacing | A space is required before '}'. |
| 428 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 430 | 35 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 459 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 461 | 33 | ⚠️ 警告 | complexity | Async arrow function has a complexity of 23. Maximum allowed is 15. |
| 541 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 551 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 563 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 587 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "onMounted". |
| 590 | 20 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 604 | 28 | ❌ 错误 | object-curly-spacing | A space is required after '{'. |
| 604 | 74 | ❌ 错误 | object-curly-spacing | A space is required before '}'. |
| 611 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "onUnmounted". |
| 654 | 10 | ⚠️ 警告 | vue/first-attribute-linebreak | Expected a linebreak before this attribute. |
| 654 | 37 | ❌ 错误 | vue/max-attributes-per-line | ':class' should be on a new line. |
| 655 | 5 | ❌ 错误 | no-mixed-spaces-and-tabs | Mixed spaces and tabs. |
| 655 | 6 | ❌ 错误 | vue/html-indent | Expected "\t" character, but found " " character. |
| 664 | 7 | ❌ 错误 | vue/component-name-in-template-casing | Component name "User" is not kebab-case. |
| 681 | 9 | ❌ 错误 | vue/component-name-in-template-casing | Component name "Clock" is not kebab-case. |
| 688 | 9 | ❌ 错误 | vue/component-name-in-template-casing | Component name "Calendar" is not kebab-case. |
| 711 | 18 | ⚠️ 警告 | vue/first-attribute-linebreak | Expected a linebreak before this attribute. |
| 711 | 76 | ❌ 错误 | vue/max-attributes-per-line | 'size' should be on a new line. |
| 712 | 10 | ❌ 错误 | no-mixed-spaces-and-tabs | Mixed spaces and tabs. |
| 712 | 11 | ❌ 错误 | vue/html-indent | Expected "\t" character, but found " " character. |
| 713 | 10 | ❌ 错误 | vue/component-name-in-template-casing | Component name "Check" is not kebab-case. |
| 716 | 18 | ⚠️ 警告 | vue/first-attribute-linebreak | Expected a linebreak before this attribute. |
| 716 | 80 | ❌ 错误 | vue/max-attributes-per-line | 'size' should be on a new line. |
| 717 | 10 | ❌ 错误 | no-mixed-spaces-and-tabs | Mixed spaces and tabs. |
| 717 | 11 | ❌ 错误 | vue/html-indent | Expected "\t" character, but found " " character. |
| 718 | 10 | ❌ 错误 | vue/component-name-in-template-casing | Component name "Check" is not kebab-case. |
| 721 | 18 | ⚠️ 警告 | vue/first-attribute-linebreak | Expected a linebreak before this attribute. |
| 721 | 56 | ❌ 错误 | vue/max-attributes-per-line | 'size' should be on a new line. |
| 722 | 10 | ❌ 错误 | no-mixed-spaces-and-tabs | Mixed spaces and tabs. |
| 722 | 11 | ❌ 错误 | vue/html-indent | Expected "\t" character, but found " " character. |
| 723 | 10 | ❌ 错误 | vue/component-name-in-template-casing | Component name "Clock" is not kebab-case. |
| 727 | 10 | ❌ 错误 | vue/component-name-in-template-casing | Component name "Loading" is not kebab-case. |
| 745 | 11 | ⚠️ 警告 | vue/first-attribute-linebreak | Expected a linebreak before this attribute. |
| 746 | 6 | ❌ 错误 | no-mixed-spaces-and-tabs | Mixed spaces and tabs. |
| 746 | 7 | ❌ 错误 | vue/html-indent | Expected "\t" character, but found " " character. |
| 749 | 9 | ❌ 错误 | vue/component-name-in-template-casing | Component name "Sunrise" is not kebab-case. |
| 762 | 11 | ⚠️ 警告 | vue/first-attribute-linebreak | Expected a linebreak before this attribute. |
| 763 | 1 | ❌ 错误 | max-len | This line has a length of 122. Maximum allowed is 120. |
| 763 | 6 | ❌ 错误 | no-mixed-spaces-and-tabs | Mixed spaces and tabs. |
| 763 | 7 | ❌ 错误 | vue/html-indent | Expected "\t" character, but found " " character. |
| 766 | 9 | ❌ 错误 | vue/component-name-in-template-casing | Component name "Sunny" is not kebab-case. |
| 779 | 11 | ⚠️ 警告 | vue/first-attribute-linebreak | Expected a linebreak before this attribute. |
| 780 | 6 | ❌ 错误 | no-mixed-spaces-and-tabs | Mixed spaces and tabs. |
| 780 | 7 | ❌ 错误 | vue/html-indent | Expected "\t" character, but found " " character. |
| 783 | 9 | ❌ 错误 | vue/component-name-in-template-casing | Component name "Moon" is not kebab-case. |
| 800 | 8 | ❌ 错误 | vue/component-name-in-template-casing | Component name "Monitor" is not kebab-case. |
| 822 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |
| 823 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 824 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 825 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 826 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 827 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 828 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 829 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 830 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 831 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 832 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 833 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 834 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 835 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 836 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 837 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 838 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 5 tabs but found 4 tabs. |
| 839 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 4 tabs but found 3 tabs. |
| 840 | 1 | ❌ 错误 | vue/html-indent | Expected indentation of 3 tabs but found 2 tabs. |

### 7. src\views\StudentManagerPage\StudentManagerPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 14 | 1 | ❌ 错误 | import/order | `vue` import should occur after import of `echarts/renderers` |
| 15 | 1 | ❌ 错误 | import/order | `element-plus` import should occur after import of `echarts/renderers` |
| 16 | 1 | ❌ 错误 | import/order | `element-plus/dist/locale/zh-cn.mjs` import should occur after import of `echarts/renderers` |
| 16 | 8 | ❌ 错误 | no-unused-vars | 'zhCn' is defined but never used. Allowed unused vars must match /^_/u. |
| 29 | 1 | ❌ 错误 | import/order | There should be no empty line within import group |
| 33 | 2 | ❌ 错误 | no-unused-vars | 'Loading' is defined but never used. Allowed unused vars must match /^_/u. |
| 54 | 8 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 67 | 1 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 196 | 20 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 197 | 20 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 216 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 217 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 238 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 239 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 264 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 265 | 19 | ❌ 错误 | no-use-before-define | 'getStudentAttendanceCountFromCache' was used before it was defined. |
| 274 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 281 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 287 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 293 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 335 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 398 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 399 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 408 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 408 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 409 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 424 | 55 | ❌ 错误 | sonarjs/no-redundant-boolean | Refactor the code to avoid using this boolean literal. |
| 440 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 444 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'event'. |
| 466 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 498 | 7 | ❌ 错误 | no-unused-vars | 'totalAttendanceCount' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 537 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 585 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 585 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 711 | 3 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 714 | 4 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 720 | 5 | ❌ 错误 | no-use-before-define | 'initDialogHeatmapChart' was used before it was defined. |
| 728 | 3 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 736 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 748 | 3 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 751 | 4 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 757 | 5 | ❌ 错误 | no-use-before-define | 'initDialogLineChart' was used before it was defined. |
| 765 | 3 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 773 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 786 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 787 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 789 | 7 | ❌ 错误 | no-unused-vars | 'formatAttendanceTime' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 809 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 810 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 831 | 24 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 833 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 842 | 24 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 844 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 853 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 877 | 3 | ❌ 错误 | no-use-before-define | 'initCharts' was used before it was defined. |
| 885 | 4 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 897 | 2 | ❌ 错误 | no-use-before-define | 'initHeatmapChart' was used before it was defined. |
| 898 | 2 | ❌ 错误 | no-use-before-define | 'initLineChart' was used before it was defined. |
| 910 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 913 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 914 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 915 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 931 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 938 | 22 | ❌ 错误 | no-use-before-define | 'generateHeatmapData' was used before it was defined. |
| 939 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 940 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 940 | 23 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 1060 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 1075 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1078 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 1079 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 1080 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 1096 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 1103 | 19 | ❌ 错误 | no-use-before-define | 'generateLineData' was used before it was defined. |
| 1104 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 1105 | 2 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 1105 | 23 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 1125 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1233 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1248 | 22 | ❌ 错误 | no-use-before-define | 'generateHeatmapData' was used before it was defined. |
| 1378 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1393 | 19 | ❌ 错误 | no-use-before-define | 'generateLineData' was used before it was defined. |
| 1413 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1517 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 1517 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1533 | 2 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 1535 | 9 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1566 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1589 | 4 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 1599 | 53 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 1599 | 61 | ❌ 错误 | brace-style | Closing curly brace does not appear on the same line as the subsequent block. |
| 1600 | 59 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 1600 | 67 | ❌ 错误 | brace-style | Closing curly brace does not appear on the same line as the subsequent block. |
| 1601 | 59 | ❌ 错误 | no-plusplus | Unary operator '++' used. |
| 1637 | 13 | ❌ 错误 | camelcase | Identifier 'StudentManagerPageAttendance_Records_Dialog' is not in camel case. |
| 1880 | 1 | ❌ 错误 | max-len | This line has a length of 125. Maximum allowed is 120. |
| 1893 | 1 | ❌ 错误 | max-len | This line has a length of 195. Maximum allowed is 120. |
| 1913 | 1 | ❌ 错误 | max-len | This line has a length of 270. Maximum allowed is 120. |
| 1915 | 1 | ❌ 错误 | max-len | This line has a length of 206. Maximum allowed is 120. |
| 1920 | 1 | ❌ 错误 | max-len | This line has a length of 272. Maximum allowed is 120. |
| 1922 | 1 | ❌ 错误 | max-len | This line has a length of 208. Maximum allowed is 120. |
| 1927 | 1 | ❌ 错误 | max-len | This line has a length of 270. Maximum allowed is 120. |
| 1929 | 1 | ❌ 错误 | max-len | This line has a length of 206. Maximum allowed is 120. |
| 1972 | 1 | ❌ 错误 | max-len | This line has a length of 232. Maximum allowed is 120. |
| 2012 | 1 | ❌ 错误 | max-len | This line has a length of 230. Maximum allowed is 120. |

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

### 11. src\views\AllMembersPage\AllMembersPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 8 | 1 | ❌ 错误 | import/order | `vue` import should occur after import of `element-plus` |
| 9 | 1 | ❌ 错误 | import/order | `vue-router` import should occur after import of `element-plus` |
| 11 | 1 | ❌ 错误 | import/order | `@/stores/theme` import should occur after import of `@/api/attendance` |
| 30 | 47 | ❌ 错误 | no-unused-vars | 'ElTooltip' is defined but never used. Allowed unused vars must match /^_/u. |
| 80 | 7 | ❌ 错误 | no-unused-vars | 'totalRankingTopN' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 339 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 425 | 7 | ❌ 错误 | no-unused-vars | 'recordsDialogVisible' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 431 | 7 | ❌ 错误 | no-unused-vars | 'currentStudent' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 437 | 7 | ❌ 错误 | no-unused-vars | 'allRecords' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 443 | 7 | ❌ 错误 | no-unused-vars | 'recordsLoading' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 525 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data" type. |
| 527 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 527 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 592 | 13 | ❌ 错误 | no-shadow | 'totalCount' is already declared in the upper scope on line 130 column 7. |
| 622 | 17 | ❌ 错误 | no-use-before-define | 'formatGrade' was used before it was defined. |
| 650 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data" type. |
| 652 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 652 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 717 | 13 | ❌ 错误 | no-shadow | 'totalCount' is already declared in the upper scope on line 130 column 7. |
| 747 | 17 | ❌ 错误 | no-use-before-define | 'formatGrade' was used before it was defined. |
| 775 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "data" type. |
| 777 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 777 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 890 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "student" type. |
| 891 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 891 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 894 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 895 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 907 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 907 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 909 | 7 | ❌ 错误 | no-unused-vars | 'loadSignInRanking' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 947 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "list" type. |
| 948 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "targetLength" type. |
| 949 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 966 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 966 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 990 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "students" type. |
| 991 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 991 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 1047 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 1047 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 1060 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 1060 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 1088 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "grade" type. |
| 1089 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 1093 | 19 | ❌ 错误 | radix | Missing radix parameter. |
| 1110 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "timeString" type. |
| 1111 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 1133 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 1133 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 1144 | 53 | ⚠️ 警告 | complexity | Arrow function has a complexity of 17. Maximum allowed is 15. |
| 1165 | 31 | ❌ 错误 | no-undefined | Unexpected use of undefined. |
| 1168 | 32 | ❌ 错误 | no-undefined | Unexpected use of undefined. |
| 1171 | 45 | ❌ 错误 | no-undefined | Unexpected use of undefined. |
| 1232 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "student" type. |
| 1233 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 1233 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 1243 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 1243 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 1357 | 12 | ❌ 错误 | vue/component-name-in-template-casing | Component name "View" is not kebab-case. |
| 1442 | 1 | ❌ 错误 | max-len | This line has a length of 124. Maximum allowed is 120. |
| 1497 | 14 | ❌ 错误 | vue/component-name-in-template-casing | Component name "View" is not kebab-case. |

### 12. src\views\PointsDashboardPage\PointsDashboardPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 2 | 1 | ❌ 错误 | import/order | `vue` import should occur after import of `element-plus` |
| 3 | 1 | ❌ 错误 | import/order | `vue-router` import should occur after import of `element-plus` |
| 5 | 1 | ❌ 错误 | import/order | `@/stores/theme` import should occur after import of `@/api/StudentApi` |
| 45 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 100 | 1 | ⚠️ 警告 | jsdoc/check-types | Use object shorthand or index signatures instead of `Object`, e.g., `{[key: string]: string}` |
| 172 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 254 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 271 | 2 | ❌ 错误 | no-use-before-define | 'handleTabChange' was used before it was defined. |
| 278 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "data" type "Object"; prefer: "object". |
| 278 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 279 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 280 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 281 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 282 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 391 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "data" type "Object"; prefer: "object". |
| 391 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 392 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 393 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 394 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 395 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 494 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "data" type "Object"; prefer: "object". |
| 494 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 495 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 496 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 497 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 498 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 499 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 500 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 604 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 604 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 605 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 606 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 609 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 610 | 2 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |
| 622 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 630 | 1 | ❌ 错误 | max-len | This line has a length of 121. Maximum allowed is 120. |
| 643 | 4 | ⚠️ 警告 | no-negated-condition | Unexpected negated condition. |
| 698 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "list" type "Object"; prefer: "object". |
| 698 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 699 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 700 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 700 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 717 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 772 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 773 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 836 | 54 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 870 | 7 | ❌ 错误 | no-unused-vars | 'refreshTimer' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 876 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 878 | 7 | ❌ 错误 | no-unused-vars | 'refreshData' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 942 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 942 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 943 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 944 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 945 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1011 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 1012 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1016 | 19 | ❌ 错误 | radix | Missing radix parameter. |
| 1033 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 1034 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1298 | 12 | ❌ 错误 | vue/component-name-in-template-casing | Component name "View" is not kebab-case. |
| 1336 | 1 | ❌ 错误 | max-len | This line has a length of 165. Maximum allowed is 120. |
| 1349 | 1 | ❌ 错误 | max-len | This line has a length of 128. Maximum allowed is 120. |
| 1395 | 15 | ❌ 错误 | vue/component-name-in-template-casing | Component name "View" is not kebab-case. |

### 13. src\views\ProfilePage\ProfilePageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 34 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 322 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 348 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 406 | 5 | ⚠️ 警告 | no-negated-condition | Unexpected negated condition. |
| 424 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 434 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 450 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 481 | 10 | ❌ 错误 | no-use-before-define | 'loadAvatar' was used before it was defined. |
| 504 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 551 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 561 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 575 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 576 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 591 | 9 | ❌ 错误 | no-use-before-define | 'showCropDialog' was used before it was defined. |
| 598 | 4 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'event'. |
| 608 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 612 | 3 | ❌ 错误 | no-use-before-define | 'resetForm' was used before it was defined. |
| 627 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 642 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 647 | 3 | ❌ 错误 | no-use-before-define | 'resetPasswordForm' was used before it was defined. |
| 657 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 672 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 688 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 745 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 808 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 809 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 812 | 35 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 832 | 7 | ❌ 错误 | no-use-before-define | 'initCrop' was used before it was defined. |
| 865 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 913 | 9 | ❌ 错误 | no-shadow | 'imgMinSide' is already declared in the upper scope on line 894 column 8. |
| 915 | 3 | ⚠️ 警告 | no-console | Unexpected console statement. |
| 922 | 2 | ❌ 错误 | no-use-before-define | 'drawCropCanvas' was used before it was defined. |
| 923 | 2 | ❌ 错误 | no-use-before-define | 'setupCropEvents' was used before it was defined. |
| 1046 | 2 | ❌ 错误 | no-use-before-define | 'removeCropEvents' was used before it was defined. |
| 1111 | 10 | ❌ 错误 | no-shadow | 'canvas' is already declared in the upper scope on line 1048 column 8. |
| 1161 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1162 | 11 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1186 | 10 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1187 | 10 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1231 | 10 | ❌ 错误 | prefer-destructuring | Use array destructuring. |
| 1256 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1294 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1333 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1370 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1386 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1426 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1428 | 30 | ❌ 错误 | require-await | Async arrow function has no 'await' expression. |
| 1492 | 11 | ❌ 错误 | no-use-before-define | 'uploadAvatarFile' was used before it was defined. |
| 1515 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 1516 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 1517 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1520 | 7 | ❌ 错误 | no-unused-vars | 'compressImage' is assigned a value but never used. Allowed unused vars must match /^_/u. |
| 1601 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 1602 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 14. src\views\PointsDashboardPage\PointsDashboardPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 8 | 1 | ❌ 错误 | import/order | `vue` import should occur after import of `element-plus` |
| 9 | 1 | ❌ 错误 | import/order | `vue-router` import should occur after import of `element-plus` |
| 11 | 1 | ❌ 错误 | import/order | `@/stores/theme` import should occur after import of `@/api/StudentApi` |
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
| 1084 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 1086 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1147 | 1 | ❌ 错误 | indent | Expected indentation of 3 tabs but found 4. |
| 1147 | 55 | ❌ 错误 | sonarjs/no-identical-functions | Update this function so that its implementation is not identical to the one on line 1054. |
| 1148 | 1 | ❌ 错误 | indent | Expected indentation of 4 tabs but found 5. |
| 1149 | 1 | ❌ 错误 | indent | Expected indentation of 5 tabs but found 6. |
| 1150 | 1 | ❌ 错误 | indent | Expected indentation of 4 tabs but found 5. |
| 1151 | 1 | ❌ 错误 | indent | Expected indentation of 5 tabs but found 6. |
| 1152 | 1 | ❌ 错误 | indent | Expected indentation of 6 tabs but found 7. |
| 1153 | 1 | ❌ 错误 | indent | Expected indentation of 5 tabs but found 6. |
| 1154 | 1 | ❌ 错误 | indent | Expected indentation of 4 tabs but found 5. |
| 1155 | 1 | ❌ 错误 | indent | Expected indentation of 3 tabs but found 4. |
| 1156 | 1 | ❌ 错误 | indent | Expected indentation of 3 tabs but found 4. |
| 1157 | 1 | ❌ 错误 | indent | Expected indentation of 4 tabs but found 5. |
| 1158 | 1 | ❌ 错误 | indent | Expected indentation of 3 tabs but found 4. |
| 1159 | 1 | ❌ 错误 | indent | Expected indentation of 2 tabs but found 3. |
| 1193 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1245 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1262 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1293 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 1293 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 1295 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1342 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 1370 | 19 | ❌ 错误 | radix | Missing radix parameter. |
| 1679 | 12 | ❌ 错误 | vue/component-name-in-template-casing | Component name "View" is not kebab-case. |
| 1723 | 1 | ❌ 错误 | max-len | This line has a length of 165. Maximum allowed is 120. |
| 1736 | 1 | ❌ 错误 | max-len | This line has a length of 128. Maximum allowed is 120. |
| 1779 | 15 | ❌ 错误 | vue/component-name-in-template-casing | Component name "View" is not kebab-case. |

### 15. src\views\ProfilePage\ProfilePageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 281 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 307 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 321 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 332 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 393 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 457 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 493 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 608 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 676 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 721 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 722 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 769 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 771 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 815 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 829 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 845 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 855 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 870 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 918 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 918 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 926 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 926 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 935 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "event" type. |
| 936 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 936 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 967 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 967 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 1000 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 1000 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 1033 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 1033 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 1044 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 1044 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 1073 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 1073 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 1162 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 1162 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 1176 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 1176 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 1187 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 1187 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 1196 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 1196 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 1246 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 1246 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 16. src\composables\admin\StudentAttendance.js

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

### 17. src\views\HomePage\HomePageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 5 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 37 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @typedef "HomePageDesktopProps" type "Object"; prefer: "object". |
| 42 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @typedef "HomePageDesktopEmits" type "Object"; prefer: "object". |
| 76 | 1 | ❌ 错误 | indent | Expected indentation of 0 tabs but found 2. |
| 81 | 1 | ❌ 错误 | indent | Expected indentation of 0 tabs but found 2. |
| 82 | 1 | ❌ 错误 | indent | Expected indentation of 0 tabs but found 2. |
| 87 | 1 | ❌ 错误 | indent | Expected indentation of 0 tabs but found 2. |
| 89 | 1 | ❌ 错误 | indent | Expected indentation of 0 tabs but found 2. |
| 94 | 1 | ❌ 错误 | indent | Expected indentation of 0 tabs but found 2. |
| 95 | 1 | ❌ 错误 | indent | Expected indentation of 1 tab but found 3. |
| 96 | 1 | ❌ 错误 | indent | Expected indentation of 0 tabs but found 2. |
| 98 | 1 | ❌ 错误 | indent | Expected indentation of 0 tabs but found 2. |
| 108 | 1 | ❌ 错误 | indent | Expected indentation of 0 tabs but found 2. |
| 109 | 1 | ❌ 错误 | indent | Expected indentation of 1 tab but found 3. |
| 110 | 1 | ❌ 错误 | indent | Expected indentation of 1 tab but found 3. |
| 111 | 1 | ❌ 错误 | indent | Expected indentation of 1 tab but found 3. |
| 112 | 1 | ❌ 错误 | indent | Expected indentation of 1 tab but found 3. |
| 114 | 1 | ❌ 错误 | indent | Expected indentation of 1 tab but found 3. |
| 115 | 1 | ❌ 错误 | indent | Expected indentation of 1 tab but found 3. |
| 116 | 1 | ❌ 错误 | indent | Expected indentation of 1 tab but found 3. |
| 117 | 1 | ❌ 错误 | indent | Expected indentation of 1 tab but found 3. |
| 118 | 1 | ❌ 错误 | indent | Expected indentation of 2 tabs but found 4. |
| 119 | 1 | ❌ 错误 | indent | Expected indentation of 2 tabs but found 4. |
| 120 | 1 | ❌ 错误 | indent | Expected indentation of 2 tabs but found 4. |
| 121 | 1 | ❌ 错误 | indent | Expected indentation of 1 tab but found 3. |
| 123 | 1 | ❌ 错误 | indent | Expected indentation of 1 tab but found 3. |
| 124 | 1 | ❌ 错误 | indent | Expected indentation of 1 tab but found 3. |
| 126 | 1 | ❌ 错误 | indent | Expected indentation of 1 tab but found 3. |
| 127 | 1 | ❌ 错误 | indent | Expected indentation of 1 tab but found 3. |
| 128 | 1 | ❌ 错误 | indent | Expected indentation of 1 tab but found 3. |
| 129 | 1 | ❌ 错误 | indent | Expected indentation of 2 tabs but found 4. |
| 130 | 1 | ❌ 错误 | indent | Expected indentation of 1 tab but found 3. |
| 131 | 1 | ❌ 错误 | indent | Expected indentation of 0 tabs but found 2. |
| 133 | 1 | ❌ 错误 | indent | Expected indentation of 0 tabs but found 2. |
| 134 | 1 | ❌ 错误 | indent | Expected indentation of 0 tabs but found 2. |
| 138 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @property "setup" type "Object"; prefer: "object". |
| 150 | 1 | ❌ 错误 | indent | Expected indentation of 0 tabs but found 1. |
| 152 | 5 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |

### 18. src\views\AttendancePage\AttendancePageDesktop.vue

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

### 19. src\views\AllMembersPage\AllMembersPageMobile.vue

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
| 221 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 221 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 222 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 223 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 240 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 268 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @param "student" type "Object"; prefer: "object". |
| 268 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 269 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 294 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 295 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 296 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 20. src\views\DashboardPage\DashboardPageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 111 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @type type "Object"; prefer: "object". |
| 242 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 243 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 244 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 269 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 270 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 320 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 321 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 377 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 378 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 401 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 402 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 425 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 510 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 586 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 649 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 650 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 680 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 683 | 1 | ⚠️ 警告 | jsdoc/check-param-names | Duplicate @param "data" |
| 683 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 684 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 766 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "case". |
| 781 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "case". |
| 794 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "case". |
| 803 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "case". |
| 812 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "case". |
| 821 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "case". |
| 831 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "value". |
| 844 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "case". |

### 21. src\composables\admin\StudentPoints.js

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

### 22. src\composables\admin\StudentLevel.js

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

### 23. src\composables\admin\StudentPersonalInformation.js

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

### 24. src\views\StudentManagerPage\js\StudentManagerPage-Attendance_Records_Dialog.js

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

### 25. src\views\NavigationPage\NavigationPageDesktop.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 143 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "levelCode" type. |
| 144 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 149 | 1 | ⚠️ 警告 | jsdoc/check-types | Use object shorthand or index signatures instead of `Object`, e.g., `{[key: string]: string}` |
| 164 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "levelCode" type. |
| 165 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 170 | 1 | ⚠️ 警告 | jsdoc/check-types | Use object shorthand or index signatures instead of `Object`, e.g., `{[key: string]: string}` |
| 279 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 279 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 319 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 319 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 399 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 399 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 423 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 423 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 453 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 453 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 560 | 1 | ⚠️ 警告 | jsdoc/require-returns-description | Missing JSDoc @returns description. |
| 560 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 26. src\composables\admin\StudentAvatar.js

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

### 27. src\views\DashboardPage\DashboardPageDesktop.vue

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

### 28. src\api\StudentApi.js

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

### 29. src\api\points.js

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

### 30. src\views\NavigationPage\NavigationPageMobile.vue

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

### 31. src\api\AttendanceApi.js

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

### 32. src\views\LoginPage\LoginPage.vue

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

### 33. src\App.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 1 | 1 | ❌ 错误 | import/namespace | Resolve error: Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './es/locale/lang/zh-cn' is not defined by "exports" in D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\element-plus\package.json
    at exportsNotFound (node:internal/modules/esm/resolve:313:10)
    at packageExportsResolve (node:internal/modules/esm/resolve:656:13)
    at resolveExports (node:internal/modules/cjs/loader:679:36)
    at Module._findPath (node:internal/modules/cjs/loader:746:31)
    at findModulePath (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-import-resolver-alias\index.js:99:27)
    at exports.resolve (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-import-resolver-alias\index.js:75:10)
    at withResolver (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:180:23)
    at fullResolve (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:201:22)
    at relative (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:217:10)
    at resolve (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:233:12)
    at ExportMapBuilder.get (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-plugin-import\lib\exportMap\builder.js:37:45)
    at processBodyStatement (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-plugin-import\lib\rules\namespace.js:12:38)
    at D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-plugin-import\lib\rules\namespace.js:85:40
    at Array.forEach (<anonymous>)
    at Program (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-plugin-import\lib\rules\namespace.js:85:18)
    at ruleErrorHandler (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1076:28)
    at D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\safe-emitter.js:45:58
    at Array.forEach (<anonymous>)
    at Object.emit (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\safe-emitter.js:45:38)
    at NodeEventGenerator.applySelector (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\node-event-generator.js:297:26)
    at NodeEventGenerator.applySelectors (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\node-event-generator.js:326:22)
    at NodeEventGenerator.enterNode (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\node-event-generator.js:340:14)
    at CodePathAnalyzer.enterNode (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\code-path-analysis\code-path-analyzer.js:803:23)
    at D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1111:32
    at Array.forEach (<anonymous>)
    at runRules (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1106:15)
    at Linter._verifyWithoutProcessors (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1355:31)
    at D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1913:29
    at Array.map (<anonymous>)
    at Linter._verifyWithProcessor (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1908:37)
    at Linter._verifyWithConfigArray (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1800:25)
    at Linter.verify (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1437:65)
    at Linter.verifyAndFix (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:2068:29)
    at verifyText (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\cli-engine\cli-engine.js:254:48)
    at CLIEngine.executeOnFiles (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\cli-engine\cli-engine.js:834:28)
    at ESLint.lintFiles (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\eslint\eslint.js:551:23)
    at Object.execute (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\cli.js:421:36)
    at async main (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\bin\eslint.js:152:22) |
| 1 | 1 | ❌ 错误 | import/order | Resolve error: Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './es/locale/lang/zh-cn' is not defined by "exports" in D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\element-plus\package.json
    at exportsNotFound (node:internal/modules/esm/resolve:313:10)
    at packageExportsResolve (node:internal/modules/esm/resolve:656:13)
    at resolveExports (node:internal/modules/cjs/loader:679:36)
    at Module._findPath (node:internal/modules/cjs/loader:746:31)
    at findModulePath (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-import-resolver-alias\index.js:99:27)
    at exports.resolve (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-import-resolver-alias\index.js:75:10)
    at withResolver (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:180:23)
    at fullResolve (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:201:22)
    at relative (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:217:10)
    at resolve (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:233:12)
    at resolveImportType (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-plugin-import\lib\core\importType.js:126:2822)
    at computeRank (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-plugin-import\lib\rules\order.js:529:43)
    at registerNode (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-plugin-import\lib\rules\order.js:556:14)
    at ImportDeclaration (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-plugin-import\lib\rules\order.js:1140:15)
    at ruleErrorHandler (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1076:28)
    at D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\safe-emitter.js:45:58
    at Array.forEach (<anonymous>)
    at Object.emit (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\safe-emitter.js:45:38)
    at NodeEventGenerator.applySelector (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\node-event-generator.js:297:26)
    at NodeEventGenerator.applySelectors (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\node-event-generator.js:326:22)
    at NodeEventGenerator.enterNode (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\node-event-generator.js:340:14)
    at CodePathAnalyzer.enterNode (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\code-path-analysis\code-path-analyzer.js:803:23)
    at D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1111:32
    at Array.forEach (<anonymous>)
    at runRules (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1106:15)
    at Linter._verifyWithoutProcessors (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1355:31)
    at D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1913:29
    at Array.map (<anonymous>)
    at Linter._verifyWithProcessor (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1908:37)
    at Linter._verifyWithConfigArray (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1800:25)
    at Linter.verify (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1437:65)
    at Linter.verifyAndFix (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:2068:29)
    at verifyText (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\cli-engine\cli-engine.js:254:48)
    at CLIEngine.executeOnFiles (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\cli-engine\cli-engine.js:834:28)
    at ESLint.lintFiles (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\eslint\eslint.js:551:23)
    at Object.execute (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\cli.js:421:36)
    at async main (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\bin\eslint.js:152:22) |
| 1 | 1 | ❌ 错误 | import/no-unresolved | Resolve error: Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './es/locale/lang/zh-cn' is not defined by "exports" in D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\element-plus\package.json
    at exportsNotFound (node:internal/modules/esm/resolve:313:10)
    at packageExportsResolve (node:internal/modules/esm/resolve:656:13)
    at resolveExports (node:internal/modules/cjs/loader:679:36)
    at Module._findPath (node:internal/modules/cjs/loader:746:31)
    at findModulePath (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-import-resolver-alias\index.js:99:27)
    at exports.resolve (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-import-resolver-alias\index.js:75:10)
    at withResolver (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:180:23)
    at fullResolve (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:201:22)
    at relative (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:217:10)
    at resolve (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:233:12)
    at checkSourceValue (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-plugin-import\lib\rules\no-unresolved.js:40:53)
    at checkSourceValue (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\moduleVisitor.js:32:5)
    at checkSource (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\moduleVisitor.js:38:5)
    at ruleErrorHandler (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1076:28)
    at D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\safe-emitter.js:45:58
    at Array.forEach (<anonymous>)
    at Object.emit (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\safe-emitter.js:45:38)
    at NodeEventGenerator.applySelector (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\node-event-generator.js:297:26)
    at NodeEventGenerator.applySelectors (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\node-event-generator.js:326:22)
    at NodeEventGenerator.enterNode (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\node-event-generator.js:340:14)
    at CodePathAnalyzer.enterNode (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\code-path-analysis\code-path-analyzer.js:803:23)
    at D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1111:32
    at Array.forEach (<anonymous>)
    at runRules (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1106:15)
    at Linter._verifyWithoutProcessors (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1355:31)
    at D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1913:29
    at Array.map (<anonymous>)
    at Linter._verifyWithProcessor (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1908:37)
    at Linter._verifyWithConfigArray (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1800:25)
    at Linter.verify (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1437:65)
    at Linter.verifyAndFix (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:2068:29)
    at verifyText (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\cli-engine\cli-engine.js:254:48)
    at CLIEngine.executeOnFiles (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\cli-engine\cli-engine.js:834:28)
    at ESLint.lintFiles (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\eslint\eslint.js:551:23)
    at Object.execute (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\cli.js:421:36)
    at async main (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\bin\eslint.js:152:22) |
| 1 | 1 | ❌ 错误 | import/default | Resolve error: Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './es/locale/lang/zh-cn' is not defined by "exports" in D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\element-plus\package.json
    at exportsNotFound (node:internal/modules/esm/resolve:313:10)
    at packageExportsResolve (node:internal/modules/esm/resolve:656:13)
    at resolveExports (node:internal/modules/cjs/loader:679:36)
    at Module._findPath (node:internal/modules/cjs/loader:746:31)
    at findModulePath (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-import-resolver-alias\index.js:99:27)
    at exports.resolve (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-import-resolver-alias\index.js:75:10)
    at withResolver (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:180:23)
    at fullResolve (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:201:22)
    at relative (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:217:10)
    at resolve (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:233:12)
    at ExportMapBuilder.get (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-plugin-import\lib\exportMap\builder.js:37:45)
    at checkDefault (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-plugin-import\lib\rules\default.js:22:44)
    at ruleErrorHandler (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1076:28)
    at D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\safe-emitter.js:45:58
    at Array.forEach (<anonymous>)
    at Object.emit (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\safe-emitter.js:45:38)
    at NodeEventGenerator.applySelector (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\node-event-generator.js:297:26)
    at NodeEventGenerator.applySelectors (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\node-event-generator.js:326:22)
    at NodeEventGenerator.enterNode (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\node-event-generator.js:340:14)
    at CodePathAnalyzer.enterNode (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\code-path-analysis\code-path-analyzer.js:803:23)
    at D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1111:32
    at Array.forEach (<anonymous>)
    at runRules (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1106:15)
    at Linter._verifyWithoutProcessors (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1355:31)
    at D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1913:29
    at Array.map (<anonymous>)
    at Linter._verifyWithProcessor (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1908:37)
    at Linter._verifyWithConfigArray (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1800:25)
    at Linter.verify (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1437:65)
    at Linter.verifyAndFix (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:2068:29)
    at verifyText (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\cli-engine\cli-engine.js:254:48)
    at CLIEngine.executeOnFiles (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\cli-engine\cli-engine.js:834:28)
    at ESLint.lintFiles (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\eslint\eslint.js:551:23)
    at Object.execute (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\cli.js:421:36)
    at async main (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\bin\eslint.js:152:22) |
| 1 | 1 | ❌ 错误 | import/no-duplicates | Resolve error: Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './es/locale/lang/zh-cn' is not defined by "exports" in D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\element-plus\package.json
    at exportsNotFound (node:internal/modules/esm/resolve:313:10)
    at packageExportsResolve (node:internal/modules/esm/resolve:656:13)
    at resolveExports (node:internal/modules/cjs/loader:679:36)
    at Module._findPath (node:internal/modules/cjs/loader:746:31)
    at findModulePath (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-import-resolver-alias\index.js:99:27)
    at exports.resolve (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-import-resolver-alias\index.js:75:10)
    at withResolver (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:180:23)
    at fullResolve (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:201:22)
    at relative (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:217:10)
    at resolve (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:233:12)
    at defaultResolver (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-plugin-import\lib\rules\no-duplicates.js:320:112)
    at ImportDeclaration (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-plugin-import\lib\rules\no-duplicates.js:359:32)
    at ruleErrorHandler (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1076:28)
    at D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\safe-emitter.js:45:58
    at Array.forEach (<anonymous>)
    at Object.emit (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\safe-emitter.js:45:38)
    at NodeEventGenerator.applySelector (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\node-event-generator.js:297:26)
    at NodeEventGenerator.applySelectors (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\node-event-generator.js:326:22)
    at NodeEventGenerator.enterNode (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\node-event-generator.js:340:14)
    at CodePathAnalyzer.enterNode (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\code-path-analysis\code-path-analyzer.js:803:23)
    at D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1111:32
    at Array.forEach (<anonymous>)
    at runRules (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1106:15)
    at Linter._verifyWithoutProcessors (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1355:31)
    at D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1913:29
    at Array.map (<anonymous>)
    at Linter._verifyWithProcessor (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1908:37)
    at Linter._verifyWithConfigArray (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1800:25)
    at Linter.verify (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1437:65)
    at Linter.verifyAndFix (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:2068:29)
    at verifyText (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\cli-engine\cli-engine.js:254:48)
    at CLIEngine.executeOnFiles (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\cli-engine\cli-engine.js:834:28)
    at ESLint.lintFiles (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\eslint\eslint.js:551:23)
    at Object.execute (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\cli.js:421:36)
    at async main (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\bin\eslint.js:152:22) |
| 1 | 1 | ⚠️ 警告 | import/no-cycle | Resolve error: Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './es/locale/lang/zh-cn' is not defined by "exports" in D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\element-plus\package.json
    at exportsNotFound (node:internal/modules/esm/resolve:313:10)
    at packageExportsResolve (node:internal/modules/esm/resolve:656:13)
    at resolveExports (node:internal/modules/cjs/loader:679:36)
    at Module._findPath (node:internal/modules/cjs/loader:746:31)
    at findModulePath (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-import-resolver-alias\index.js:99:27)
    at exports.resolve (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-import-resolver-alias\index.js:75:10)
    at withResolver (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:180:23)
    at fullResolve (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:201:22)
    at relative (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:217:10)
    at resolve (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:233:12)
    at ExportMapBuilder.get (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-plugin-import\lib\exportMap\builder.js:37:45)
    at checkSourceValue (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-plugin-import\lib\rules\no-cycle.js:101:45)
    at checkSourceValue (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\moduleVisitor.js:32:5)
    at checkSource (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\moduleVisitor.js:38:5)
    at ruleErrorHandler (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1076:28)
    at D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\safe-emitter.js:45:58
    at Array.forEach (<anonymous>)
    at Object.emit (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\safe-emitter.js:45:38)
    at NodeEventGenerator.applySelector (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\node-event-generator.js:297:26)
    at NodeEventGenerator.applySelectors (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\node-event-generator.js:326:22)
    at NodeEventGenerator.enterNode (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\node-event-generator.js:340:14)
    at CodePathAnalyzer.enterNode (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\code-path-analysis\code-path-analyzer.js:803:23)
    at D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1111:32
    at Array.forEach (<anonymous>)
    at runRules (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1106:15)
    at Linter._verifyWithoutProcessors (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1355:31)
    at D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1913:29
    at Array.map (<anonymous>)
    at Linter._verifyWithProcessor (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1908:37)
    at Linter._verifyWithConfigArray (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1800:25)
    at Linter.verify (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1437:65)
    at Linter.verifyAndFix (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:2068:29)
    at verifyText (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\cli-engine\cli-engine.js:254:48)
    at CLIEngine.executeOnFiles (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\cli-engine\cli-engine.js:834:28)
    at ESLint.lintFiles (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\eslint\eslint.js:551:23)
    at Object.execute (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\cli.js:421:36)
    at async main (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\bin\eslint.js:152:22) |
| 1 | 1 | ❌ 错误 | import/no-self-import | Resolve error: Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './es/locale/lang/zh-cn' is not defined by "exports" in D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\element-plus\package.json
    at exportsNotFound (node:internal/modules/esm/resolve:313:10)
    at packageExportsResolve (node:internal/modules/esm/resolve:656:13)
    at resolveExports (node:internal/modules/cjs/loader:679:36)
    at Module._findPath (node:internal/modules/cjs/loader:746:31)
    at findModulePath (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-import-resolver-alias\index.js:99:27)
    at exports.resolve (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-import-resolver-alias\index.js:75:10)
    at withResolver (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:180:23)
    at fullResolve (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:201:22)
    at relative (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:217:10)
    at resolve (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\resolve.js:233:12)
    at isImportingSelf (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-plugin-import\lib\rules\no-self-import.js:16:70)
    at commonjs (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-plugin-import\lib\rules\no-self-import.js:38:9)
    at checkSourceValue (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\moduleVisitor.js:32:5)
    at checkSource (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint-module-utils\moduleVisitor.js:38:5)
    at ruleErrorHandler (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1076:28)
    at D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\safe-emitter.js:45:58
    at Array.forEach (<anonymous>)
    at Object.emit (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\safe-emitter.js:45:38)
    at NodeEventGenerator.applySelector (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\node-event-generator.js:297:26)
    at NodeEventGenerator.applySelectors (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\node-event-generator.js:326:22)
    at NodeEventGenerator.enterNode (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\node-event-generator.js:340:14)
    at CodePathAnalyzer.enterNode (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\code-path-analysis\code-path-analyzer.js:803:23)
    at D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1111:32
    at Array.forEach (<anonymous>)
    at runRules (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1106:15)
    at Linter._verifyWithoutProcessors (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1355:31)
    at D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1913:29
    at Array.map (<anonymous>)
    at Linter._verifyWithProcessor (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1908:37)
    at Linter._verifyWithConfigArray (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1800:25)
    at Linter.verify (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:1437:65)
    at Linter.verifyAndFix (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\linter\linter.js:2068:29)
    at verifyText (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\cli-engine\cli-engine.js:254:48)
    at CLIEngine.executeOnFiles (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\cli-engine\cli-engine.js:834:28)
    at ESLint.lintFiles (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\eslint\eslint.js:551:23)
    at Object.execute (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\lib\cli.js:421:36)
    at async main (D:\BaiduSyncdisk\ZhengEnCi\AiWorkShop\AiWorkshopStudentManagementSystem\front-end\node_modules\eslint\bin\eslint.js:152:22) |
| 12 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 24 | 18 | ❌ 错误 | import/no-unresolved | Unable to resolve path to module 'element-plus/es/locale/lang/zh-cn'. |

### 34. src\stores\admin.js

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

### 35. src\views\PointsDashboardPage\js\PointsDashboardPageUtils.js

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

### 36. src\views\ScoreChangeRecordsPage\ScoreChangeRecordsPageMobile.vue

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

### 37. src\views\AllMembersPage\js\AllMembersPageUtils.js

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

### 38. src\views\AllMembersPage\js\PointsServer.js

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

### 39. src\views\AttendancePage\AttendancePage.vue

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

### 40. src\views\PointsDashboardPage\js\PointsDashboardPage.js

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

### 41. src\views\RegisterPage\RegisterPage.vue

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

### 42. src\api\PointsApi.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 8 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 9 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 23 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "top" type. |
| 24 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 37 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentInfoId" type. |
| 38 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 43. src\views\AdminPage\AdminPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 15 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 28 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 30 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 46 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |

### 44. src\views\AllMembersPage\js\AdjustRecordsDialogManager.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 27 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "student" type. |
| 77 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 85 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "time" type. |
| 86 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 110 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "points" type. |
| 111 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 45. src\views\AllMembersPage\js\PersonalInformation.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 30 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 31 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 31 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |
| 67 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 68 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 68 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 46. src\views\StudentManagerPage\js\StudentManagerPageStudentAttendanceServer.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 12 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentId" type. |
| 13 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 36 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "dateStr" type. |
| 37 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "slot" type. |
| 38 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "studentAttendanceRecords" type. |
| 39 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 47. src\components\ThemeToggle.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 1 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 23 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag (preference). Replace "const" JSDoc tag with "constant". |
| 23 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @const "themeStore" type "Object"; prefer: "object". |
| 29 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag (preference). Replace "const" JSDoc tag with "constant". |
| 30 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag (preference). Replace "const" JSDoc tag with "constant". |

### 48. src\views\StudentManagerPage\js\StudentManagerPage.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 16 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 17 | 1 | ⚠️ 警告 | jsdoc/require-param-description | Missing JSDoc @param "adminStudentDatabaseTableId" description. |
| 17 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "adminStudentDatabaseTableId" type. |
| 18 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 30 | 5 | ❌ 错误 | no-param-reassign | Assignment to property of function parameter 'student'. |

### 49. src\api\StatisticsApi.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 33 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 34 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 35 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 35 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 50. src\router\index.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 506 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 507 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 522 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 523 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "isValid" type. |

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

### 55. src\api\super_admin.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 31 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 32 | 1 | ⚠️ 警告 | jsdoc/check-types | Invalid JSDoc @returns type "Object"; prefer: "object". |
| 32 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 56. src\stores\user.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 36 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "info" type. |
| 37 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 55 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "level" type. |

### 57. src\views\DashboardPage\DashboardPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 11 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 12 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 18 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |

### 58. src\views\ScoreChangeRecordsPage\ScoreChangeRecordsPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 1 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 26 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 27 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 59. src\views\StudentManagerPage\StudentManagerPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 1 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 20 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 21 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 60. src\api\StudentManagementApi.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 8 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "token" type. |
| 9 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 61. src\composables\ApiInterceptor.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 26 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 51 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "api" type. |

### 62. src\views\AllMembersPage\AllMembersPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 15 | 1 | ❌ 错误 | import/order | `@element-plus/icons-vue` import should occur before import of `element-plus` |
| 27 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 63. src\views\HomePage\HomePage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |
| 18 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

### 64. src\views\HomePage\HomePageMobile.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 4 | 3 | ❌ 错误 | no-trailing-spaces | Trailing spaces not allowed. |
| 6 | 1 | ⚠️ 警告 | jsdoc/check-tag-names | Invalid JSDoc tag name "component". |

### 65. src\views\HomePage\js\HomePage.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 19 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |
| 110 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "event" type. |

### 66. src\views\ProfilePage\js\ProfilePageUtils.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 21 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @param. |
| 22 | 1 | ⚠️ 警告 | jsdoc/no-types | Types are not permitted on @returns. |

### 67. src\stores\theme.js

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 82 | 1 | ⚠️ 警告 | jsdoc/require-param-type | Missing JSDoc @param "theme" type. |

### 68. src\views\NavigationPage\NavigationPage.vue

| 行号 | 列号 | 严重程度 | 规则 | 消息 |
|------|------|----------|------|------|
| 27 | 1 | ⚠️ 警告 | jsdoc/require-returns-type | Missing JSDoc @returns type. |

## 💡 修复建议

1. 运行 `npm run lint:fix` 自动修复可修复的问题
2. 运行 `npm run lint` 查看所有问题详情
3. 手动修复无法自动修复的问题

---

*报告生成时间: 2026/1/6 14:20:57*
