<script setup>
/**
 * 超级管理员页面组件(移动端)
 *
 * @description 超级管理员控制台,管理所有学生信息、考勤、积分等(移动端适配)
 * @component AdminPageMobile
 * @author 系统开发组
 * @version 1.0.0
 * @features 核心功能清单：
 * 1. 身份验证：超级管理员密码验证，验证通过后才能访问管理功能
 * 2. 数据加载：异步加载学生基础信息、考勤数据、积分数据等核心数据
 * 3. 学生管理：按等级筛选、搜索学生，编辑学生基础信息，分配所属管理员
 * 4. 考勤管理：查看今日/历史考勤、补卡操作、考勤热力图/趋势图展示
 * 5. 积分管理：修改学生积分、查看积分变动记录
 * 6. 适配特性：全页面适配移动端交互逻辑和视觉布局
 */
import {onMounted, watch, ref, nextTick} from 'vue' // Vue3核心组合式API

// 导入管理员页面核心业务逻辑（状态管理、方法封装）
// useAdminPage包含所有管理员页面所需的响应式数据和业务方法
import {useAdminPage} from './ts/AdminPage.js'

// 导入AdminPage模块，用于控制身份验证页面的显示
import * as AdminPage from './ts/AdminPage.js'

// 导入移动端专属样式文件
// 移动端样式适配不同的屏幕尺寸和交互方式
import './css/mobile/AdminPageMobile.css'

// Element Plus 组件按需导入（仅导入移动端使用的组件）
// 按需导入可以减小打包体积，提升移动端性能
import {
	ElMessage,    // 全局提示组件
	ElIcon,       // 图标容器组件
	ElInput,      // 输入框组件
	ElButton,     // 按钮组件
	ElSelect,     // 下拉选择器组件
	ElOption,     // 下拉选项组件
	ElDialog,     // 对话框组件
	ElForm,       // 表单组件
	ElFormItem,   // 表单项组件
	ElInputNumber,// 数字输入框组件
	ElDatePicker, // 日期选择器组件
	ElTabs,       // 标签页组件
	ElTabPane,    // 标签页面板组件
	ElTag,        // 标签组件
	ElTooltip,    // 提示框组件
	ElPagination, // 分页组件
	ElCalendar    // 日历组件
} from 'element-plus'

// Element Plus 样式按需导入（仅导入使用的组件样式，减小打包体积）
// 仅导入实际使用的组件样式，避免不必要的样式文件加载
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-select.css'
import 'element-plus/theme-chalk/el-option.css'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-input-number.css'
import 'element-plus/theme-chalk/el-date-picker.css'
import 'element-plus/theme-chalk/el-date-picker-panel.css'
import 'element-plus/theme-chalk/el-scrollbar.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-pagination.css'
import 'element-plus/theme-chalk/el-tooltip.css'
import 'element-plus/theme-chalk/el-button-group.css'
import 'element-plus/theme-chalk/el-calendar.css'
import 'element-plus/theme-chalk/el-tabs.css'
import 'element-plus/theme-chalk/el-tab-pane.css'
import 'element-plus/theme-chalk/el-tag.css'

// Element Plus 图标组件按需导入（移动端使用的图标）
// 按需导入图标组件，减少不必要的资源加载
import {
	User,            // 用户图标
	Calendar,        // 日历图标
	TrendCharts,     // 趋势图图标
	Search,          // 搜索图标
	Refresh,         // 刷新图标
	SwitchButton,    // 切换按钮图标
	Edit,            // 编辑图标
	UserFilled,      // 填充用户图标
	Clock,           // 时钟图标
	Warning,         // 警告图标
	Document,        // 文档图标
	Loading,         // 加载图标
	Box,             // 盒子图标
	Lock             // 锁图标
} from '@element-plus/icons-vue'

// 导入学生头像获取API
// 用于获取学生头像URL，支持头像显示功能
import {getAvatarUrl} from '@/api/student'

// 导入Element Plus中文语言包（适配移动端日历、日期选择器等组件）
// 提供中文本地化支持，提升用户体验
// 中文语言包确保日期选择器、日历等组件显示中文内容
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// ===================== 响应式变量定义 =====================
// 定义组件中使用的响应式变量，包括状态变量和计算属性
/**
 * 管理员头像URL（响应式）
 * @type {Ref<string>}
 * @param {number} 2 - 管理员类型标识
 * @param {number} 256 - 头像尺寸（像素）
 */
const adminAvatarUrl = ref(getAvatarUrl(2, 256))

/**
 * 月份英文转中文映射表
 * 用于日历组件月份显示适配中文环境
 */
const monthMap = {
	January: '一月',
	February: '二月',
	March: '三月',
	April: '四月',
	May: '五月',
	June: '六月',
	July: '七月',
	August: '八月',
	September: '九月',
	October: '十月',
	November: '十一月',
	December: '十二月'
}

// 月份观察器（预留变量，用于监听月份变化的扩展功能）
// 预留功能变量，便于后续功能扩展
const monthObserver = null

// ===================== 核心业务逻辑解构 =====================
// 从useAdminPage函数中解构出所有需要的状态和方法
// useAdminPage组合函数封装了管理员页面的所有业务逻辑
/**
 * 从useAdminPage组合式函数解构响应式状态和方法
 * 包含所有管理员页面的核心业务逻辑：
 * - 身份验证相关：isAuthenticated, specialPassword, authenticate等
 * - 数据加载相关：isLoading, loadAllData, refreshData等
 * - 学生管理相关：students, filteredStudents, editForm等
 * - 考勤管理相关：todayCount, openAttendanceRecordsDialog等
 * - 积分管理相关：pointsForm, openScoreChangeRecordsDialog等
 * - 图表相关：initHeatmapChart, generateLineData等
 */
const {
	// 状态变量
	isAuthenticated,      // 是否已通过身份验证（布尔值）
	specialPassword,      // 超级管理员验证密码（字符串）
	authError,            // 身份验证错误信息（字符串）
	authLoading,          // 身份验证加载状态（布尔值）
	isLoading,            // 全局数据加载状态（布尔值）
	isDataLoaded,         // 核心数据是否加载完成（布尔值）
	loadingProgress,      // 数据加载进度（百分比，0-100）
	loadingStatus,        // 数据加载状态文本（字符串）
	students,             // 所有学生原始数据列表（数组）
	searchKeyword,        // 学生搜索关键词（字符串）
	currentPage,          // 分页当前页码（数字）
	pageSize,             // 分页每页条数（数字）
	totalStudents,        // 学生总数（数字）
	todayCount,           // 今日签到人数（数字）
	monthlyCount,         // 本月签到人数（数字）
	studentLevels,        // 学生等级映射表（对象，key:学生ID，value:等级值）
	studentAttendanceCounts, // 学生签到次数映射表（对象）
	studentAdmins,        // 学生所属管理员映射表（对象）
	studentPoints,        // 学生积分信息映射表（对象）
	activeLevelTab,       // 当前激活的学生等级标签（字符串/数字）
	editDialogVisible,    // 编辑学生信息对话框显示状态（布尔值）
	editFormRef,          // 编辑表单引用（Ref）
	editForm,             // 编辑表单数据（对象）
	todayAttendanceDialogVisible, // 今日考勤对话框显示状态（布尔值）
	todayAttendanceRecords,       // 今日考勤记录列表（数组）
	attendanceRecordsDialogVisible, // 考勤记录对话框显示状态（布尔值）
	currentStudentInfo,   // 当前选中的学生信息（对象）
	calendarValue,        // 日历组件选中日期（日期对象/字符串）
	scrollPosition,       // 页面滚动位置（数字）
	allStudentAttendanceRecords, // 当前学生所有考勤记录（数组）
	calendarSlots,        // 日历时间段配置（数组）
	filteredStudentAttendanceRecords, // 筛选后的学生考勤记录（数组）
	heatmapDialogVisible, // 热力图对话框显示状态（布尔值）
	trendDialogVisible,   // 趋势图对话框显示状态（布尔值）
	heatmapChart,         // 热力图容器引用（Ref）
	lineChart,            // 趋势图容器引用（Ref）
	heatmapInstance,      // 热力图实例（Ref）
	lineInstance,         // 趋势图实例（Ref）
	showDateDetailsDialog, // 日期详情对话框显示状态（布尔值）
	selectedDate,         // 选中的日期（字符串）
	makeupDialogVisible,  // 补卡对话框显示状态（布尔值）
	makeupLoading,        // 补卡操作加载状态（布尔值）
	makeupSelectedStudent,// 补卡选中的学生（对象）
	makeupStep,           // 补卡步骤（date:选日期/hour:选时间）
	makeupFormRef,        // 补卡表单引用（Ref）
	datePickerRef,        // 日期选择器引用（Ref）
	makeupForm,           // 补卡表单数据（对象）
	pointsDialogVisible,  // 积分修改对话框显示状态（布尔值）
	pointsLoading,        // 积分修改加载状态（布尔值）
	pointsSelectedStudent,// 积分修改选中的学生（对象）
	pointsFormRef,        // 积分表单引用（Ref）
	pointsForm,           // 积分表单数据（对象）
	scoreChangeRecordsDialogVisible, // 积分变动记录对话框显示状态（布尔值）
	scoreChangeRecordsLoading,       // 积分变动记录加载状态（布尔值）
	scoreChangeRecords,   // 积分变动记录列表（数组）
	currentScoreChangeRecordsStudent, // 当前查看积分记录的学生（对象）
	datetimeShortcuts,    // 日期快捷选择配置（数组）
	levelOptions,         // 学生等级选项（数组）
	adminOptions,         // 管理员选项（数组）
	filteredStudents,     // 筛选后的学生列表（数组）
	currentLevelStudents, // 当前等级的学生列表（数组）
	editFormRules,        // 编辑表单校验规则（对象）
	pointsFormRules,      // 积分表单校验规则（对象）
	makeupDateFormRules,  // 补卡日期表单校验规则（对象）
	timeSlots,            // 考勤时间段配置（数组）
	sortedScoreChangeRecords, // 排序后的积分变动记录
	totalScoreChangePoints, // 积分变动总分数

	// 方法函数
	/**
	 * 根据等级获取学生列表
	 * @function getLevelStudents
	 * @param {number} level - 学生等级
	 * @returns {Array} 指定等级的学生列表
	 */
	getLevelStudents,
	/**
	 * 修改学生等级
	 * @function changeLevel
	 * @param {Object} student - 学生对象
	 * @param {number} newLevel - 新等级
	 * @returns {Promise<void>} 异步操作结果
	 */
	changeLevel,
	/**
	 * 修改学生所属管理员
	 * @function changeAdmin
	 * @param {Object} student - 学生对象
	 * @param {number} newAdmin - 新管理员ID
	 * @returns {Promise<void>} 异步操作结果
	 */
	changeAdmin,
	/**
	 * 加载学生等级数据
	 * @function loadStudentLevels
	 * @returns {Promise<void>} 异步操作结果
	 */
	loadStudentLevels,
	/**
	 * 加载学生签到次数
	 * @function loadStudentAttendanceCounts
	 * @returns {Promise<void>} 异步操作结果
	 */
	loadStudentAttendanceCounts,
	/**
	 * 加载学生所属管理员数据
	 * @function loadStudentAdmins
	 * @returns {Promise<void>} 异步操作结果
	 */
	loadStudentAdmins,
	/**
	 * 头像加载失败处理
	 * @function handleAvatarError
	 * @param {Event} event - 错误事件
	 * @returns {void}
	 */
	handleAvatarError,
	/**
	 * 加载统计数据（总数、今日/本月签到）
	 * @function loadStatistics
	 * @returns {Promise<void>} 异步操作结果
	 */
	loadStatistics,
	/**
	 * 刷新所有数据
	 * @function refreshData
	 * @returns {Promise<void>} 异步操作结果
	 */
	refreshData,
	/**
	 * 打开编辑学生对话框
	 * @function openEditDialog
	 * @param {Object} student - 学生对象
	 * @returns {void}
	 */
	openEditDialog,
	/**
	 * 取消编辑操作
	 * @function cancelEdit
	 * @returns {void}
	 */
	cancelEdit,
	/**
	 * 确认编辑学生信息
	 * @function confirmEdit
	 * @returns {Promise<void>} 异步操作结果
	 */
	confirmEdit,
	/**
	 * 显示今日考勤记录
	 * @function showTodayAttendance
	 * @returns {Promise<void>} 异步操作结果
	 */
	showTodayAttendance,
	/**
	 * 格式化考勤时间
	 * @function formatAttendanceTime
	 * @param {string} time - 时间字符串
	 * @returns {string} 格式化后的时间
	 */
	formatAttendanceTime,
	/**
	 * 获取时间段样式类
	 * @function getTimePeriodClass
	 * @param {string} time - 时间字符串
	 * @returns {string} 对应的CSS类名
	 */
	getTimePeriodClass,
	/**
	 * 获取时间段名称
	 * @function getTimePeriodName
	 * @param {string} time - 时间字符串
	 * @returns {string} 时间段名称
	 */
	getTimePeriodName,
	/**
	 * 判断指定日期时间段是否签到
	 * @function isSlotSigned
	 * @param {string} date - 日期字符串
	 * @param {string} slot - 时间段
	 * @returns {boolean} 是否已签到
	 */
	isSlotSigned,
	/**
	 * 打开日期详情对话框
	 * @function openDateDetails
	 * @param {string} date - 日期字符串
	 * @returns {void}
	 */
	openDateDetails,
	/**
	 * 打开考勤记录对话框
	 * @function openAttendanceRecordsDialog
	 * @param {Object} student - 学生对象
	 * @returns {Promise<void>} 异步操作结果
	 */
	openAttendanceRecordsDialog,
	/**
	 * 关闭考勤记录对话框
	 * @function closeAttendanceRecordsDialog
	 * @returns {void}
	 */
	closeAttendanceRecordsDialog,
	/**
	 * 关闭热力图对话框
	 * @function closeHeatmapDialog
	 * @returns {void}
	 */
	closeHeatmapDialog,
	/**
	 * 关闭趋势图对话框
	 * @function closeTrendDialog
	 * @returns {void}
	 */
	closeTrendDialog,
	/**
	 * 格式化显示日期
	 * @function formatDateForDisplay
	 * @param {string} date - 日期字符串
	 * @returns {string} 格式化后的日期
	 */
	formatDateForDisplay,
	/**
	 * 格式化日历标题
	 * @function formatCalendarTitle
	 * @param {Date} date - 日期对象
	 * @returns {string} 格式化后的标题
	 */
	formatCalendarTitle,
	/**
	 * 日历切换到上个月
	 * @function prevMonth
	 * @returns {void}
	 */
	prevMonth,
	/**
	 * 日历切换到下个月
	 * @function nextMonth
	 * @returns {void}
	 */
	nextMonth,
	/**
	 * 日历回到今日
	 * @function goToday
	 * @returns {void}
	 */
	goToday,
	/**
	 * 获取时间段标签
	 * @function getTimeSlotLabel
	 * @param {string} time - 时间字符串
	 * @returns {string} 时间段标签
	 */
	getTimeSlotLabel,
	/**
	 * 获取指定日期的签到时间列表
	 * @function getDateAttendanceTimes
	 * @param {string} date - 日期字符串
	 * @returns {Array} 签到时间列表
	 */
	getDateAttendanceTimes,
	/**
	 * 初始化热力图
	 * @function initHeatmapChart
	 * @returns {void}
	 */
	initHeatmapChart,
	/**
	 * 初始化趋势图
	 * @function initLineChart
	 * @returns {void}
	 */
	initLineChart,
	/**
	 * 生成热力图数据
	 * @function generateHeatmapData
	 * @returns {Array} 热力图数据
	 */
	generateHeatmapData,
	/**
	 * 生成趋势图数据
	 * @function generateLineData
	 * @returns {Object} 趋势图数据
	 */
	generateLineData,
	/**
	 * 打开热力图对话框
	 * @function openHeatmapDialog
	 * @param {Object} student - 学生对象
	 * @returns {void}
	 */
	openHeatmapDialog,
	/**
	 * 打开趋势图对话框
	 * @function openTrendDialog
	 * @param {Object} student - 学生对象
	 * @returns {void}
	 */
	openTrendDialog,
	/**
	 * 身份验证
	 * @function authenticate
	 * @returns {Promise<void>} 异步操作结果
	 */
	authenticate,
	/**
	 * 退出登录
	 * @function logout
	 * @returns {void}
	 */
	logout,
	/**
	 * 获取快捷日期
	 * @function getShortcutDate
	 * @param {string} type - 日期类型
	 * @returns {Date} 快捷日期
	 */
	getShortcutDate,
	/**
	 * 打开补卡对话框
	 * @function openMakeupDialog
	 * @param {Object} student - 学生对象
	 * @returns {void}
	 */
	openMakeupDialog,
	/**
	 * 取消补卡操作
	 * @function cancelMakeup
	 * @returns {void}
	 */
	cancelMakeup,
	/**
	 * 处理日期选择变化
	 * @function handleDateChange
	 * @returns {void}
	 */
	handleDateChange,
	/**
	 * 格式化选中的日期
	 * @function formatSelectedDate
	 * @returns {string} 格式化后的日期
	 */
	formatSelectedDate,
	/**
	 * 确认补卡日期步骤
	 * @function confirmDateStep
	 * @returns {void}
	 */
	confirmDateStep,
	/**
	 * 选择快捷日期
	 * @function selectDatetimeShortcut
	 * @param {Object} shortcut - 快捷日期对象
	 * @returns {void}
	 */
	selectDatetimeShortcut,
	/**
	 * 判断快捷日期是否选中
	 * @function isDatetimeShortcutSelected
	 * @param {Object} shortcut - 快捷日期对象
	 * @returns {boolean} 是否选中
	 */
	isDatetimeShortcutSelected,
	/**
	 * 选择补卡小时
	 * @function selectHour
	 * @param {number} hour - 小时
	 * @returns {void}
	 */
	selectHour,
	/**
	 * 判断小时是否选中
	 * @function isHourSelected
	 * @param {number} hour - 小时
	 * @returns {boolean} 是否选中
	 */
	isHourSelected,
	/**
	 * 更新考勤时间
	 * @function updateAttendanceTime
	 * @returns {void}
	 */
	updateAttendanceTime,
	/**
	 * 提交补卡操作
	 * @function submitMakeup
	 * @returns {Promise<void>} 异步操作结果
	 */
	submitMakeup,
	/**
	 * 打开积分修改对话框
	 * @function openPointsDialog
	 * @param {Object} student - 学生对象
	 * @returns {void}
	 */
	openPointsDialog,
	/**
	 * 关闭积分修改对话框
	 * @function handlePointsDialogClose
	 * @returns {void}
	 */
	handlePointsDialogClose,
	/**
	 * 取消积分修改
	 * @function cancelPoints
	 * @returns {void}
	 */
	cancelPoints,
	/**
	 * 确认积分修改
	 * @function confirmPoints
	 * @returns {Promise<void>} 异步操作结果
	 */
	confirmPoints,
	/**
	 * 打开积分变动记录对话框
	 * @function openScoreChangeRecordsDialog
	 * @param {Object} student - 学生对象
	 * @returns {void}
	 */
	openScoreChangeRecordsDialog,
	/**
	 * 关闭积分变动记录对话框
	 * @function closeScoreChangeRecordsDialog
	 * @returns {void}
	 */
	closeScoreChangeRecordsDialog,
	/**
	 * 格式化时间
	 * @function formatTime
	 * @param {string|Date} time - 时间
	 * @returns {string} 格式化后的时间
	 */
	formatTime,
	/**
	 * 加载所有核心数据
	 * @function loadAllData
	 * @param {string} password - 管理员密码
	 * @returns {Promise<void>} 异步操作结果
	 */
	loadAllData,
	/**
	 * 切换主题（亮色/暗色）
	 * @function toggleTheme
	 * @returns {void}
	 */
	toggleTheme
} = useAdminPage()

// ===================== 生命周期钩子 =====================
// 定义组件生命周期中的钩子函数，处理组件初始化等逻辑
/**
 * 组件挂载完成钩子
 * 执行初始化逻辑：设置页面标题、身份验证、数据加载
 */
onMounted(async () => {
	// 设置移动端页面标题，提升用户体验
	// 为移动端设备设置特定的页面标题，增强可识别性
	document.title = '超级管理员控制台 - AI坊学生管理系统'

	// 从管理员存储中获取已保存的密码（持久化登录）
	// 实现持久化登录功能，避免用户重复输入密码
	const adminPassword = adminStore.getAdminPassword()
	if (adminPassword) {
		// 如果已有密码，直接标记为已验证并加载数据
		// 检查本地存储中是否已有有效密码，实现自动登录
		AdminPage.isShowIdentifyAuthenticationPage.value = false
		isAuthenticated.value = true
		try {
			// 加载所有核心数据（学生、考勤、积分等）
			// 初始化时加载所有必要的数据，确保页面功能完整
			await loadAllData(adminPassword)
		} catch (error) {
			// 加载失败处理：提示错误、取消验证状态、清除保存的密码
			// 错误处理机制，确保用户在数据加载失败时能重新登录
			ElMessage.error(`加载数据失败：${error.message}`)
			isAuthenticated.value = false
			AdminPage.isShowIdentifyAuthenticationPage.value = true
			adminStore.clearAdminPassword()
		}
	} else {
		// 没有保存的密码，显示身份验证界面
		// 当本地没有有效密码时，显示验证界面要求用户输入密码
		isAuthenticated.value = false
		AdminPage.isShowIdentifyAuthenticationPage.value = true
	}
})

/**
 * 监听日历选中日期变化
 * 当考勤记录对话框打开且非加载状态时，重新初始化图表
 */
watch(calendarValue, async () => {
	// 确保对话框已打开且数据加载完成
	// 检查条件，确保只在适当状态下重新初始化图表
	// 避免在对话框关闭或加载状态下执行不必要的图表初始化
	if (attendanceRecordsDialogVisible.value && !isLoading.value) {
		// 等待DOM更新完成后再初始化图表，避免容器未渲染导致的初始化失败
		// 使用nextTick确保DOM已更新后再初始化图表组件
		await nextTick()
		initHeatmapChart() // 重新初始化热力图
		initLineChart()    // 重新初始化趋势图
	}
})
</script>

<template>
	<!-- 身份验证界面(移动端) -->
	<!-- 未通过身份验证时显示，仅展示密码输入框和验证按钮 -->
	<div v-if="AdminPage.isShowIdentifyAuthenticationPage" class="auth-section-mobile">
		<div class="auth-page-header-mobile">
			<div class="header-content-mobile">
				<!-- 系统LOGO，点击可切换主题 -->
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊学生管理系统"
					class="auth-logo-mobile"
					title="切换主题模式"
					@click="toggleTheme"/>
				<h2>身份验证</h2>
			</div>
		</div>
		<div class="auth-card-mobile">
			<div class="auth-header-mobile">
				<div class="auth-icon-container-mobile">
					<!-- 管理员头像，加载失败时显示默认圆环 -->
					<!-- 头像懒加载，失败时回退到默认样式 -->
					<!-- 支持v-lazy指令优化性能 -->
					<!-- 支持v-lazy指令优化性能 -->
					<img
						v-if="adminAvatarUrl"
						v-lazy="adminAvatarUrl"
						alt="Admin Avatar"
						class="admin-avatar-mobile"
						@error="adminAvatarUrl = null"/>
					<div v-else class="icon-ring-mobile"/>
				</div>
			</div>
			<div class="auth-form-mobile">
				<div class="input-container-mobile">
					<!-- 超级管理员密码输入框，支持回车提交 -->
					<!-- 密码输入框支持显示/隐藏密码，提升用户体验 -->
					<!-- 包含锁图标前缀，增强视觉识别 -->
					<!-- 包含锁图标前缀，增强视觉识别 -->
					<!-- 包含锁图标前缀，增强视觉识别 -->
					<el-input
						v-model="specialPassword"
						type="password"
						placeholder="请输入特殊密码"
						show-password
						size="large"
						class="password-input-mobile"
						@keyup.enter="authenticate"
					>
						<template #prefix>
							<el-icon>
								<lock/> <!-- 密码输入框前缀锁图标 -->
							</el-icon>
						</template>
					</el-input>
				</div>
				<!-- 身份验证提交按钮，加载状态禁用点击 -->
				<!-- 防止重复提交，提升系统稳定性 -->
				<!-- 加载状态时显示加载动画，提供视觉反馈 -->
				<!-- 加载状态时显示加载动画，提供视觉反馈 -->
				<!-- 加载状态时显示加载动画，提供视觉反馈 -->
				<el-button
					type="primary"
					size="large"
					:loading="authLoading"
					class="auth-button-mobile"
					@click="authenticate"
				>
					<span>验证身份</span>
				</el-button>
			</div>
		</div>
	</div>

	<!-- 加载界面 -->
	<!-- 已验证身份但核心数据未加载完成时显示 -->
	<!-- 显示加载动画、进度条和状态文本 -->
	<!-- 数据加载期间提供视觉反馈和进度指示 -->
	<div v-else-if="!isDataLoaded" class="admin-loading-mobile">
		<div class="loading-page-header-mobile">
			<!-- 系统LOGO，点击可切换主题 -->
			<img
				src="@/assets/AiWorkShop_icon.png"
				alt="AI坊学生管理系统"
				class="loading-logo-mobile"
				title="切换主题模式"
				@click="toggleTheme"/>
		</div>
		<div class="loading-container-mobile">
			<!-- 加载动画容器 -->
			<!-- 三环旋转动画提供视觉反馈 -->
			<!-- 动画效果提升用户体验，减少等待焦虑 -->
			<!-- 动画效果提升用户体验，减少等待焦虑 -->
			<!-- 动画效果提升用户体验，减少等待焦虑 -->
			<div class="loading-spinner-mobile">
				<div class="spinner-ring-mobile"/>
				<div class="spinner-ring-mobile"/>
				<div class="spinner-ring-mobile"/>
			</div>
			<!-- 加载提示文本 -->
			<!-- 明确告知用户当前状态 -->
			<!-- 提示文本使用中文，符合用户习惯 -->
			<!-- 提示文本使用中文，符合用户习惯 -->
			<!-- 提示文本使用中文，符合用户习惯 -->
			<div class="loading-text-mobile">数据加载中，请稍候...</div>
			<!-- 加载进度条 -->
			<!-- 直观显示数据加载进度 -->
			<!-- 进度条宽度由loadingProgress变量控制 -->
			<!-- 进度条宽度由loadingProgress变量控制 -->
			<!-- 进度条宽度由loadingProgress变量控制 -->
			<div class="loading-progress-mobile">
				<div class="progress-bar-mobile" :style="{ width: loadingProgress + '%' }"/>
			</div>
			<!-- 加载状态详情文本 -->
			<!-- 显示当前加载的具体状态信息 -->
			<!-- 动态更新状态文本，让用户了解加载进度 -->
			<!-- 动态更新状态文本，让用户了解加载进度 -->
			<!-- 动态更新状态文本，让用户了解加载进度 -->
			<div class="loading-status-mobile">{{ loadingStatus }}</div>
		</div>
	</div>

	<!-- 管理控制台主界面 -->
	<!-- 身份验证通过且核心数据加载完成后显示 -->
	<!-- 包含顶部导航栏、统计卡片、学生信息管理区域和底部 -->
	<!-- 主界面包含所有管理功能模块，是用户交互的核心区域 -->
	<div v-else class="admin-console-mobile">
		<!-- 顶部导航栏 -->
		<!-- 包含系统LOGO、页面标题和退出登录按钮 -->
		<!-- 顶部导航提供系统标识和主要操作入口 -->
		<div class="admin-header-mobile">
			<div class="header-left-mobile">
				<!-- 系统LOGO，点击可切换主题 -->
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊学生管理系统"
					class="header-logo-mobile"
					title="切换主题模式"
					@click="toggleTheme"/>
				<h1 class="header-title-mobile">超级管理员控制台</h1>
			</div>
			<div class="header-right-mobile">
				<!-- 退出登录按钮 -->
				<!-- 退出后清除本地存储的密码信息 -->
				<el-button
					type="danger"
					size="small"
					@click="logout"
					class="logout-btn-mobile"
				>
					<el-icon>
						<switch-button/> <!-- 退出登录图标 -->
					</el-icon>
					<span>退出</span>
				</el-button>
			</div>
		</div>

		<!-- 统计卡片区域 -->
		<!-- 显示系统核心统计数据：学生总数、今日签到、本月签到 -->
		<!-- 统计卡片提供数据概览，便于管理员快速了解系统状态 -->
		<div class="stats-cards-mobile">
			<!-- 学生总数卡片 -->
			<!-- 显示系统注册的学生总数 -->
			<div class="stat-card-mobile">
				<div class="card-icon-mobile">
					<el-icon :size="28">
						<user-filled/> <!-- 学生总数图标 -->
					</el-icon>
				</div>
				<div class="card-content-mobile">
					<div class="card-title-mobile">学生总数</div>
					<div class="card-value-mobile">{{ totalStudents }}</div>
				</div>
			</div>
			<!-- 今日签到卡片 -->
			<!-- 显示今日签到的学生人数 -->
			<div class="stat-card-mobile">
				<div class="card-icon-mobile">
					<el-icon :size="28">
						<calendar/> <!-- 今日签到图标 -->
					</el-icon>
				</div>
				<div class="card-content-mobile">
					<div class="card-title-mobile">今日签到</div>
					<div class="card-value-mobile">{{ todayCount }}</div>
				</div>
			</div>
			<!-- 本月签到卡片 -->
			<!-- 显示本月签到的学生人数 -->
			<div class="stat-card-mobile">
				<div class="card-icon-mobile">
					<el-icon :size="28">
						<trend-charts/> <!-- 本月签到图标 -->
					</el-icon>
				</div>
				<div class="card-content-mobile">
					<div class="card-title-mobile">本月签到</div>
					<div class="card-value-mobile">{{ monthlyCount }}</div>
				</div>
			</div>
		</div>

		<!-- 学生信息管理区域 -->
		<!-- 包含搜索、筛选、学生列表和分页功能 -->
		<!-- 学生管理区域是核心功能区，支持学生信息的查看和编辑 -->
		<div class="student-management-mobile">
			<!-- 搜索和筛选工具栏 -->
			<!-- 提供搜索框、等级筛选和功能按钮 -->
			<div class="toolbar-mobile">
				<!-- 学生搜索框 -->
				<!-- 支持按姓名或学号搜索学生 -->
				<el-input
					v-model="searchKeyword"
					placeholder="搜索学生姓名或学号"
					clearable
					class="search-input-mobile"
				>
					<template #prefix>
						<el-icon>
							<search/> <!-- 搜索图标 -->
						</el-icon>
					</template>
				</el-input>
				<!-- 今日考勤按钮 -->
				<!-- 查看今日所有学生的签到记录 -->
				<el-button
					type="primary"
					@click="showTodayAttendance"
					:loading="isLoading"
					class="today-attendance-btn-mobile"
				>
					<el-icon>
						<calendar/> <!-- 今日考勤图标 -->
					</el-icon>
					<span>今日考勤</span>
				</el-button>
			</div>

			<!-- 学生等级标签页 -->
			<!-- 按等级分类显示学生列表 -->
			<el-tabs
				v-model="activeLevelTab"
				class="level-tabs-mobile"
				@tab-change="getLevelStudents"
			>
				<!-- 所有学生标签 -->
				<el-tab-pane label="所有学生" name="all"/>
				<!-- 一级学生标签 -->
				<el-tab-pane label="一级" name="1"/>
				<!-- 二级学生标签 -->
				<el-tab-pane label="二级" name="2"/>
				<!-- 三级学生标签 -->
				<el-tab-pane label="三级" name="3"/>
				<!-- 四级学生标签 -->
				<el-tab-pane label="四级" name="4"/>
				<!-- 五级学生标签 -->
				<el-tab-pane label="五级" name="5"/>
			</el-tabs>

			<!-- 学生列表 -->
			<!-- 显示当前筛选条件下的学生列表 -->
			<!-- 每个学生卡片包含基本信息和操作按钮 -->
			<div class="students-list-mobile">
				<!-- 学生列表为空时的提示 -->
				<div v-if="filteredStudents.length === 0" class="no-students-mobile">
					<el-icon :size="48" class="no-students-icon-mobile">
						<document/> <!-- 无学生图标 -->
					</el-icon>
					<p>暂无学生数据</p>
				</div>
				<!-- 学生列表渲染 -->
				<template v-else>
					<div
						v-for="student in filteredStudents"
						:key="student.studentId"
						class="student-card-mobile"
					>
						<!-- 学生头像 -->
						<div class="student-avatar-container-mobile">
							<img
								:src="getAvatarUrl(student.studentId, 64)"
								:alt="student.name"
								class="student-avatar-mobile"
								@error="handleAvatarError"
							/>
						</div>
						<!-- 学生信息 -->
						<div class="student-info-mobile">
							<div class="student-name-mobile">{{ student.name }}</div>
							<div class="student-details-mobile">
								<span class="student-id-mobile">学号: {{ student.studentId }}</span>
								<span class="student-grade-mobile">{{ student.grade }}年级</span>
								<el-tag
									:type="student.level === 1 ? 'success' : student.level === 2 ? 'primary' : student.level === 3 ? 'warning' : student.level === 4 ? 'danger' : 'info'"
									size="small"
									class="level-tag-mobile"
								>
									{{ student.level }}级
								</el-tag>
							</div>
							<div class="student-stats-mobile">
								<span class="attendance-count-mobile">
									<el-icon class="stat-icon-mobile">
										<calendar/> <!-- 考勤统计图标 -->
									</el-icon>
									签到: {{ studentAttendanceCounts[student.studentId] || 0 }}
								</span>
								<span class="points-mobile">
									<el-icon class="stat-icon-mobile">
										<box/> <!-- 积分统计图标 -->
									</el-icon>
									积分: {{ studentPoints[student.studentId]?.points || 0 }}
								</span>
							</div>
						</div>
						<!-- 学生操作按钮 -->
						<div class="student-actions-mobile">
							<!-- 编辑学生信息按钮 -->
							<el-button
								size="small"
								@click="openEditDialog(student)"
								:loading="isLoading"
								class="action-btn-mobile edit-btn-mobile"
							>
								<el-icon>
									<edit/> <!-- 编辑图标 -->
								</el-icon>
							</el-button>
							<!-- 查看考勤记录按钮 -->
							<el-button
								size="small"
								@click="openAttendanceRecordsDialog(student)"
								:loading="isLoading"
								class="action-btn-mobile attendance-btn-mobile"
							>
								<el-icon>
									<calendar/> <!-- 考勤记录图标 -->
								</el-icon>
							</el-button>
							<!-- 修改积分按钮 -->
							<el-button
								size="small"
								@click="openPointsDialog(student)"
								:loading="isLoading"
								class="action-btn-mobile points-btn-mobile"
							>
								<el-icon>
									<box/> <!-- 积分图标 -->
								</el-icon>
							</el-button>
						</div>
					</div>
				</template>
			</div>

			<!-- 分页组件 -->
			<!-- 支持学生列表的分页浏览 -->
			<div class="pagination-mobile" v-if="totalStudents > pageSize">
				<el-pagination
					v-model:current-page="currentPage"
					v-model:page-size="pageSize"
					:page-sizes="[10, 20, 30, 50]"
					:total="totalStudents"
					layout="total, sizes, prev, pager, next, jumper"
					:hide-on-single-page="false"
					class="pagination-controls-mobile"
				/>
			</div>
		</div>
		<!-- 顶部导航栏 -->
		<!-- 包含系统LOGO、标题和退出登录按钮 -->
		<div class="admin-header-mobile">
			<div class="header-left-mobile">
				<!-- 系统LOGO，点击可切换主题 -->
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊学生管理系统"
					class="logo-mobile"
					title="切换主题模式"
					@click="toggleTheme"/>
				<div class="title-section-mobile">
					<h1>超级管理员控制台</h1>
					<p>Super Admin Console</p>
				</div>
			</div>
			<div class="header-right-mobile">
				<!-- 退出登录按钮 -->
				<el-button
					type="danger"
					size="small"
					class="logout-btn-mobile"
					@click="logout">
					<el-icon>
						<switch-button/> <!-- 退出登录图标 -->
					</el-icon>
					退出登录
				</el-button>
			</div>
		</div>

		<!-- 核心统计卡片区域 -->
		<!-- 显示学生总数、今日签到数和本月签到数三个统计卡片 -->
		<!-- 统计卡片提供关键数据概览，点击可查看详细信息 -->
		<div class="admin-stats-mobile">
			<!-- 学生总数统计卡片 -->
			<div class="stat-card-mobile">
				<div class="stat-icon-mobile">
					<el-icon>
						<user/> <!-- 用户图标 -->
						<!-- 学生总数统计的视觉标识 -->
						<!-- 使用Element Plus的User图标组件 -->
						<!-- 学生总数统计的视觉标识 -->
						<!-- 使用Element Plus的User图标组件 -->
					</el-icon>
				</div>
				<div class="stat-content-mobile">
					<div class="stat-value-mobile">{{ totalStudents }}</div>
					<div class="stat-label-mobile">学生总数</div>
				</div>
			</div>
			<!-- 今日签到统计卡片（点击可查看详情） -->
			<div class="stat-card-mobile" style="cursor: pointer;" @click="showTodayAttendance">
				<div class="stat-icon-mobile">
					<el-icon>
						<calendar/> <!-- 日历图标 -->
						<!-- 今日签到统计的视觉标识 -->
						<!-- 使用Element Plus的Calendar图标组件 -->
					</el-icon>
				</div>
				<div class="stat-content-mobile">
					<div class="stat-value-mobile">{{ todayCount }}</div>
					<div class="stat-label-mobile">今日签到</div>
				</div>
			</div>
			<!-- 本月签到统计卡片 -->
			<div class="stat-card-mobile">
				<div class="stat-icon-mobile">
					<el-icon>
						<trend-charts/> <!-- 趋势图图标 -->
						<!-- 本月签到统计的视觉标识 -->
						<!-- 使用Element Plus的TrendCharts图标组件 -->
					</el-icon>
				</div>
				<div class="stat-content-mobile">
					<div class="stat-value-mobile">{{ monthlyCount }}</div>
					<div class="stat-label-mobile">本月签到</div>
				</div>
			</div>
		</div>

		<!-- 学生信息管理区域 -->
		<!-- 包含搜索栏、等级标签页、学生卡片列表和分页器 -->
		<!-- 学生信息管理区域支持搜索、筛选、分页等功能 -->
		<div class="students-section-mobile">
			<!-- 区域头部：标题 + 搜索/刷新操作 -->
			<!-- 包含学生信息管理标题、搜索输入框和刷新数据按钮 -->
			<div class="section-header-mobile">
				<h2>学生信息管理</h2>
				<div class="header-actions-mobile">
					<!-- 学生搜索输入框（支持清空） -->
					<!-- 支持按姓名、学号等信息搜索学生 -->
					<!-- 包含搜索图标前缀，支持一键清空功能 -->
					<!-- 包含搜索图标前缀，支持一键清空功能 -->
					<!-- 包含搜索图标前缀，支持一键清空功能 -->
					<el-input
						v-model="searchKeyword"
						placeholder="搜索学生信息"
						clearable
						class="search-input-mobile"
					>
						<template #prefix>
							<el-icon>
								<search/> <!-- 搜索图标 -->
							</el-icon>
						</template>
					</el-input>
					<!-- 数据刷新按钮（加载状态禁用） -->
					<!-- 手动刷新数据，加载状态时禁用避免重复请求 -->
					<!-- 刷新按钮包含图标，提升视觉识别度 -->
					<!-- 刷新按钮包含图标，提升视觉识别度 -->
					<!-- 刷新按钮包含图标，提升视觉识别度 -->
					<el-button :loading="isLoading" type="primary" @click="refreshData">
						<el-icon>
							<refresh/> <!-- 刷新图标 -->
						</el-icon>
						刷新数据
					</el-button>
				</div>
			</div>

			<!-- 学生等级标签页 -->
			<!-- 按学生等级分类显示，支持切换不同等级的学生 -->
			<!-- 等级标签页便于快速筛选和管理不同等级的学生 -->
			<div class="level-tabs-mobile">
				<el-tabs v-model="activeLevelTab" type="card" class="level-tabs-container-mobile">
					<!-- 循环渲染等级标签页 -->
					<!-- 根据系统配置动态生成等级标签页 -->
					<!-- 使用v-for指令遍历levelOptions数组 -->
					<!-- 使用v-for指令遍历levelOptions数组 -->
					<!-- 使用v-for指令遍历levelOptions数组 -->
					<el-tab-pane
						v-for="level in levelOptions"
						:key="level.value"
						:label="level.label"
						:name="level.value.toString()"
						:class="`level-tab-${level.color}-mobile`"
					>
						<!-- 标签自定义模板：包含等级标签和学生数量 -->
						<!-- 显示等级名称和该等级的学生总数 -->
						<!-- 使用ElTag组件显示彩色标签，便于区分 -->
						<!-- 使用ElTag组件显示彩色标签，便于区分 -->
						<!-- 使用ElTag组件显示彩色标签，便于区分 -->
						<template #label>
							<el-tag :type="level.color" size="large" class="tab-label-mobile">
								{{ level.label }}
								<span class="tab-count-mobile">({{ getLevelStudents(level.value).length }})</span>
							</el-tag>
						</template>
					</el-tab-pane>
				</el-tabs>
			</div>

			<!-- 学生卡片列表容器 -->
			<!-- 循环渲染学生卡片，每个卡片包含学生信息和操作按钮 -->
			<!-- 每个学生卡片展示基础信息、详细信息和管理操作 -->
			<div class="students-cards-container-mobile">
				<!-- 循环渲染学生卡片（仅显示当前选中等级的学生） -->
				<div
					v-for="student in filteredStudents"
					v-show="(parseInt(studentLevels[student.studentId] || 0) === parseInt(activeLevelTab))"
					:key="student.studentId"
					class="student-card-mobile"
					:data-level="studentLevels[student.studentId] || 0">
					<!-- 学生卡片主行：头像 + 基础信息 + 签到次数 + 积分 -->
					<!-- 显示学生头像、姓名学号、签到次数和积分信息 -->
					<!-- 学生卡片主行展示最核心的识别信息和统计数据 -->
					<div class="student-main-row-mobile">
						<!-- 学生头像（加载失败显示姓名首字符） -->
						<!-- 优先显示头像，失败时显示姓名首字母 -->
						<!-- 使用v-lazy指令优化加载性能，@error处理加载失败 -->
						<!-- 支持头像懒加载，提升页面性能 -->
						<!-- 懒加载优化页面性能，避免不必要的网络请求 -->
						<div
							class="student-avatar-mobile"
							:class="{ 'has-avatar': student.hasAvatar && student.avatarUrl, 'no-avatar': !student.hasAvatar || !student.avatarUrl }">
							<img
								v-if="student.hasAvatar && student.avatarUrl"
								v-lazy="student.avatarUrl"
								alt="头像"
								class="avatar-image-mobile"
								@error="handleAvatarError(student)"/>
							<span v-else class="avatar-text-mobile">{{ student.name.charAt(0) }}</span>
						</div>
						<!-- 学生基础信息 -->
						<!-- 显示学生姓名、学号和数据库ID -->
						<!-- 提供学生的基本识别信息 -->
						<!-- 显示学生姓名、学号和数据库ID -->
						<!-- 提供学生的基本识别信息 -->
						<div class="student-primary-info-mobile">
							<div class="student-name-mobile">{{ student.name }}</div>
							<div class="student-id-mobile">学号: {{ student.studentId }}</div>
							<div class="student-db-id-mobile">唯一ID: {{ student.id }}</div>
						</div>
						<!-- 学生签到次数 -->
						<!-- 显示该学生的历史签到总次数 -->
						<!-- 签到次数是学生参与度的重要指标 -->
						<!-- 显示该学生的历史签到总次数 -->
						<!-- 签到次数是学生参与度的重要指标 -->
						<div class="attendance-count-mobile">
							<el-icon class="attendance-icon-mobile">
								<calendar/> <!-- 日历图标 -->
							</el-icon>
							<span class="count-text-mobile">{{
									studentAttendanceCounts[student.studentId] || 0
								}}次</span>
						</div>
						<!-- 学生积分信息（签到积分 + 活动积分） -->
						<!-- 计算并显示学生总积分，包含签到积分和活动积分 -->
						<!-- 积分系统激励学生积极参与活动和签到 -->
						<!-- 计算并显示学生总积分，包含签到积分和活动积分 -->
						<!-- 积分系统激励学生积极参与活动和签到 -->
						<div class="points-info-mobile">
							<div class="points-summary-mobile">
								<span class="points-total-mobile">总积分: {{
										Math.round((studentAttendanceCounts[student.studentId] || 0) * 0.64) + ((studentPoints[student.studentId] && studentPoints[student.studentId].totalPoints) || 0)
									}}</span>
							</div>
							<div class="points-details-mobile">
								<span class="points-type-mobile">签到: {{
										Math.round((studentAttendanceCounts[student.studentId] || 0) * 0.64)
									}}</span>
								<span class="points-type-mobile">活动: {{
										(studentPoints[student.studentId] && studentPoints[student.studentId].totalPoints) || 0
									}}</span>
							</div>
						</div>
					</div>

					<!-- 学生卡片详情行：详细信息 + 操作按钮 -->
					<!-- 显示学生详细信息（年级专业班级性别手机）和考勤操作按钮 -->
					<!-- 学生卡片详情行提供完整的个人信息和考勤管理功能 -->
					<div class="student-detail-row-mobile">
						<!-- 学生详细信息 -->
						<!-- 显示学生年级、专业、班级、性别和手机号 -->
						<!-- 详细信息便于管理员了解学生基本情况 -->
						<!-- 显示学生年级、专业、班级、性别和手机号 -->
						<!-- 详细信息便于管理员了解学生基本情况 -->
						<div class="student-details-mobile">
							<div class="detail-item-mobile">
								<span class="label-mobile">年级：</span>
								<span class="value-mobile">{{ student.grade }}年级</span>
							</div>
							<div class="detail-item-mobile">
								<span class="label-mobile">专业：</span>
								<span class="value-mobile">{{ student.major }}</span>
							</div>
							<div class="detail-item-mobile">
								<span class="label-mobile">班级：</span>
								<span class="value-mobile">{{ student.classNum }}班</span>
							</div>
							<div class="detail-item-mobile">
								<span class="label-mobile">性别：</span>
								<span class="value-mobile">{{ student.gender }}</span>
							</div>
							<div class="detail-item-mobile">
								<span class="label-mobile">手机：</span>
								<span class="value-mobile">{{ student.phoneNumber }}</span>
							</div>
						</div>
						<!-- 学生操作按钮组 -->
						<!-- 包含考勤管理和积分管理相关的操作按钮 -->
						<!-- 一组按钮提供对学生数据的管理功能 -->
						<!-- 包含考勤管理和积分管理相关的操作按钮 -->
						<!-- 一组按钮提供对学生数据的管理功能 -->
						<div class="student-actions-mobile">
							<div>
								<div>
									<span>考勤</span>
								</div>
								<div class="attendance-actions-container">
									<!-- 查看考勤记录按钮 -->
									<!-- 打开日历视图显示该学生的历史考勤记录 -->
									<!-- 日历视图便于查看学生的考勤模式和规律 -->
									<!-- 打开日历视图显示该学生的历史考勤记录 -->
									<!-- 日历视图便于查看学生的考勤模式和规律 -->
									<el-button
										type="success"
										size="small"
										class="records-btn-mobile"
										@click="openAttendanceRecordsDialog(student)"
									>
										<el-icon>
											<calendar/> <!-- 日历图标 -->
										</el-icon>
										考勤记录
									</el-button>
									<!-- 补卡操作按钮 -->
									<!-- 允许管理员为学生添加缺失的考勤记录 -->
									<!-- 补卡功能处理学生因技术问题未能正常签到的情况 -->
									<!-- 允许管理员为学生添加缺失的考勤记录 -->
									<!-- 补卡功能处理学生因技术问题未能正常签到的情况 -->
									<el-button
										type="warning"
										size="small"
										class="makeup-btn-mobile"
										@click="openMakeupDialog(student)"
									>
										<el-icon>
											<clock/> <!-- 时钟图标 -->
										</el-icon>
										补卡
									</el-button>
									<!-- 查看考勤热力图按钮 -->
									<!-- 显示该学生考勤的热力图可视化分析 -->
									<!-- 热力图直观显示学生的考勤频率和规律 -->
									<!-- 显示该学生考勤的热力图可视化分析 -->
									<!-- 热力图直观显示学生的考勤频率和规律 -->
									<el-button
										type="info"
										size="small"
										class="heatmap-btn-mobile"
										@click="openHeatmapDialog(student)"
									>
										<el-icon>
											<trend-charts/> <!-- 趋势图图标 -->
										</el-icon>
										热力图
									</el-button>
									<!-- 查看考勤趋势图按钮 -->
									<!-- 显示该学生考勤的趋势图可视化分析 -->
									<!-- 趋势图展示学生考勤的长期变化趋势 -->
									<!-- 显示该学生考勤的趋势图可视化分析 -->
									<!-- 趋势图展示学生考勤的长期变化趋势 -->
									<el-button
										type="primary"
										size="small"
										class="trend-btn-mobile"
										@click="openTrendDialog(student)"
									>
										<el-icon>
											<trend-charts/> <!-- 趋势图图标 -->
										</el-icon>
										趋势图
									</el-button>
								</div>
							</div>
							<!-- 修改积分按钮 -->
							<!-- 打开积分修改对话框，允许调整学生积分 -->
							<!-- 积分修改需要填写调整原因，确保操作可追溯 -->
							<!-- 打开积分修改对话框，允许调整学生积分 -->
							<!-- 积分修改需要填写调整原因，确保操作可追溯 -->
							<el-button
								type="success"
								size="small"
								class="points-btn-mobile"
								@click="openPointsDialog(student)"
							>
								<el-icon>
									<edit/> <!-- 编辑图标 -->
								</el-icon>
								修改积分
							</el-button>
							<!-- 查看积分变动记录按钮 -->
							<!-- 显示该学生积分变动的完整历史记录 -->
							<!-- 完整的积分变动历史便于审计和追踪 -->
							<!-- 显示该学生积分变动的完整历史记录 -->
							<!-- 完整的积分变动历史便于审计和追踪 -->
							<el-button
								type="info"
								size="small"
								class="score-records-btn-mobile"
								@click="openScoreChangeRecordsDialog(student)"
							>
								<el-icon>
									<document/> <!-- 文档图标 -->
								</el-icon>
								改分记录
							</el-button>
						</div>
					</div>

					<!-- 学生卡片管理行：等级修改 + 管理员分配 + 编辑按钮 -->
					<!-- 包含等级修改下拉框、管理员分配下拉框和编辑学生信息按钮 -->
					<!-- 学生卡片管理行提供学生分类、分配和信息编辑功能 -->
					<div class="student-management-row-mobile">
						<!-- 学生等级管理 -->
						<!-- 允许管理员调整学生的等级分类 -->
						<!-- 学生等级影响功能权限和管理方式 -->
						<!-- 允许管理员调整学生的等级分类 -->
						<!-- 学生等级影响功能权限和管理方式 -->
						<div class="level-management-mobile">
							<span class="management-label-mobile">学生等级：</span>
							<el-select
								:model-value="studentLevels[student.studentId] || 0"
								size="small"
								style="width: 120px;"
								:loading="isLoading"
								class="level-select-mobile"
								@change="(value) => changeLevel(student.studentId, value)"
							>
								<el-option
									v-for="option in levelOptions"
									:key="option.value"
									:label="option.label"
									:value="option.value"
								>
									<el-tag
										:type="option.color"
										size="small"
										style="width: 100%; text-align: center;"
									>
										{{ option.label }}
									</el-tag>
								</el-option>
							</el-select>
						</div>
						<!-- 学生所属管理员管理 -->
						<!-- 分配或修改负责该学生的学生管理员 -->
						<!-- 为学生分配负责的学生管理员，便于精细化管理 -->
						<!-- 分配或修改负责该学生的学生管理员 -->
						<!-- 为学生分配负责的学生管理员，便于精细化管理 -->
						<div class="admin-management-mobile">
							<span class="management-label-mobile">所属管理员：</span>
							<!-- 管理员等级学生（等级3）不显示分配选项 -->
							<div v-if="(studentLevels[student.studentId] || 0) === 3" class="admin-level-notice-mobile">
								<el-icon class="admin-icon-mobile">
									<user-filled/> <!-- 填充用户图标 -->
								</el-icon>
								<span>管理员身份</span>
							</div>
							<!-- 无可用管理员时显示提示 -->
							<div v-else-if="adminOptions.length === 0" class="no-admin-available-mobile">
								<el-icon class="warning-icon-mobile">
									<warning/> <!-- 警告图标 -->
								</el-icon>
								<span>暂无可用的管理员</span>
							</div>
							<!-- 正常显示管理员分配下拉框 -->
							<div v-else>
								<el-select
									:model-value="studentAdmins[student.studentId]?.adminStudentId || ''"
									size="small"
									style="width: 180px;"
									:loading="isLoading"
									class="admin-select-mobile"
									placeholder="分配管理员"
									clearable
									@change="(value) => changeAdmin(student.studentId, value)"
								>
									<el-option
										v-for="option in adminOptions"
										:key="option.value"
										:label="option.label"
										:value="option.value"
									>
										<div class="admin-option-mobile">
											<el-icon class="option-icon-mobile">
												<user-filled/> <!-- 填充用户图标 -->
											</el-icon>
											<div class="option-text-mobile">
												<div class="option-name-mobile">{{ option.student.name }}</div>
												<div class="option-id-mobile">{{ option.student.studentId }}</div>
											</div>
										</div>
									</el-option>
								</el-select>
							</div>
						</div>
						<!-- 编辑学生信息按钮（带提示框） -->
						<!-- 打开编辑对话框修改学生的基本信息 -->
						<!-- 编辑功能允许更新学生的基本信息和联系方式 -->
						<!-- 打开编辑对话框修改学生的基本信息 -->
						<!-- 编辑功能允许更新学生的基本信息和联系方式 -->
						<div class="edit-action-mobile">
							<el-tooltip content="编辑学生信息" placement="top">
								<el-button
									type="primary"
									size="small"
									:loading="isLoading"
									class="edit-btn-mobile"
									@click="openEditDialog(student)"
								>
									<el-icon>
										<edit/> <!-- 编辑图标 -->
									</el-icon>
									编辑
								</el-button>
							</el-tooltip>
						</div>
					</div>
				</div>
			</div>

			<!-- 分页区域 -->
			<!-- 显示当前页记录总数和分页控件 -->
			<!-- 分页区域支持大量学生数据的分页浏览 -->
			<div class="table-footer-mobile">
				<div class="pagination-info-mobile">
					共 {{ currentLevelStudents.length }} 条记录
				</div>
				<el-pagination
					v-model:current-page="currentPage"
					v-model:page-size="pageSize"
					:page-sizes="[10, 20, 50, 100]"
					:total="currentLevelStudents.length"
					layout="total, sizes, prev, pager, next, jumper"
					class="pagination-mobile"
				/>
			</div>
		</div>

		<!-- 页面底部 -->
		<!-- 显示系统名称和管理员模式标识 -->
		<!-- 页面底部提供版权信息和当前用户身份标识 -->
		<div class="admin-footer-mobile">
			<div class="footer-content-mobile">
				<div class="footer-left-mobile">
					<span>人工智能创作坊学生管理系统</span>
				</div>
				<div class="footer-right-mobile">
					<span>超级管理员模式</span>
				</div>
			</div>
		</div>

		<!-- 编辑学生信息对话框 -->
		<!-- 弹出式对话框，用于编辑学生的基本信息 -->
		<!-- 编辑对话框支持修改学生姓名、学号、性别、联系方式等信息 -->
		<el-dialog
			v-if="editDialogVisible"
			v-model="editDialogVisible"
			title="修改学生信息"
			width="90%"
			:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		:teleported="true"
		class="edit-dialog-mobile"
		>
		<el-form
			ref="editFormRef"
			:model="editForm"
			:rules="editFormRules"
			label-width="80px"
			class="edit-form-mobile"
		>
			<el-form-item label="姓名" prop="name">
				<el-input v-model="editForm.name" placeholder="请输入学生姓名"/>
			</el-form-item>
			<el-form-item label="学号" prop="studentId">
				<el-input v-model="editForm.studentId" placeholder="请输入学号"/>
			</el-form-item>
			<el-form-item label="性别" prop="gender">
				<el-select v-model="editForm.gender" placeholder="请选择性别" style="width: 100%">
					<el-option label="男" value="男"/>
					<el-option label="女" value="女"/>
				</el-select>
			</el-form-item>
			<el-form-item label="手机号" prop="phoneNumber">
				<el-input v-model="editForm.phoneNumber" placeholder="请输入手机号"/>
			</el-form-item>
			<el-form-item label="学院" prop="college">
				<el-input v-model="editForm.college" placeholder="请输入学院"/>
			</el-form-item>
			<el-form-item label="专业" prop="major">
				<el-input v-model="editForm.major" placeholder="请输入专业"/>
			</el-form-item>
			<el-form-item label="年级" prop="grade">
				<el-select v-model="editForm.grade" placeholder="请选择年级" style="width: 100%">
					<el-option label="1年级" :value="1"/>
					<el-option label="2年级" :value="2"/>
					<el-option label="3年级" :value="3"/>
					<el-option label="4年级" :value="4"/>
					<el-option label="5年级" :value="5"/>
				</el-select>
			</el-form-item>
			<el-form-item label="班级" prop="classNum">
				<el-input-number
					v-model="editForm.classNum"
					:min="1"
					:max="100"
					placeholder="请输入班级"
					style="width: 100%"
				/>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input
					v-model="editForm.password"
					type="password"
					placeholder="请输入新密码（6-16位）"
					show-password
				/>
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer-mobile">
				<el-button :disabled="isLoading" @click="cancelEdit">取消</el-button>
				<el-button type="primary" :loading="isLoading" @click="confirmEdit">
					确认修改
				</el-button>
			</div>
		</template>
		</el-dialog>

		<!-- 今日考勤记录对话框 -->
		<!-- 弹出式对话框，显示今日所有学生的签到记录 -->
		<!-- 今日考勤记录对话框按时间段展示当天的签到情况 -->
		<el-dialog
			v-if="todayAttendanceDialogVisible"
			v-model="todayAttendanceDialogVisible"
			title="今日签到记录"
			width="90%"
			:close-on-click-modal="false"
			:append-to-body="true"
			:teleported="true"
			class="today-attendance-dialog-mobile"
		>
			<div class="attendance-records-container-mobile">
				<!-- 无记录提示 -->
				<div v-if="todayAttendanceRecords.length === 0" class="no-records-mobile">
					<el-icon class="no-records-icon-mobile">
						<calendar/> <!-- 日历图标 -->
					</el-icon>
					<p>今日暂无签到记录</p>
				</div>
				<!-- 有记录时渲染列表 -->
				<!-- 按时间段分组显示签到记录 -->
				<!-- 使用v-for遍历今日签到记录数组 -->
				<!-- 提供签到时间、学生信息和时间段标识 -->
				<div v-else class="records-list-mobile">
					<div
						v-for="(record, index) in todayAttendanceRecords"
						:key="index"
						class="attendance-record-item-mobile"
						:class="getTimePeriodClass(record.attendanceTime)"
					>
						<div class="time-period-indicator-mobile" :class="getTimePeriodClass(record.attendanceTime)">
							<div class="indicator-dot-mobile"/>
							<span class="period-text-mobile">{{ getTimePeriodName(record.attendanceTime) }}</span>
						</div>
						<div class="record-content-mobile">
							<div class="student-avatar-mobile" :class="getTimePeriodClass(record.attendanceTime)">
								{{ record.name.charAt(0) }}
							</div>
							<div class="student-details-mobile">
								<div class="student-name-mobile">{{ record.name }}</div>
								<div class="student-id-mobile">{{ record.scheduleId }}</div>
							</div>
							<div class="attendance-time-mobile">
								<el-icon class="time-icon-mobile">
									<clock/> <!-- 时钟图标 -->
								</el-icon>
								<span class="time-text-mobile">{{ formatAttendanceTime(record.attendanceTime) }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<template #footer>
				<div class="dialog-footer-mobile">
					<el-button @click="todayAttendanceDialogVisible = false">关闭</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 学生考勤记录对话框（日历版） -->
		<!-- 弹出式对话框，以日历形式展示学生考勤记录 -->
		<!-- 考勤记录日历视图便于查看学生的历史考勤模式 -->
		<el-dialog
			v-if="attendanceRecordsDialogVisible"
			v-model="attendanceRecordsDialogVisible"
			:title="`${currentStudentInfo.name} 的考勤记录`"
			width="90%"
			:close-on-click-modal="false"
			:destroy-on-close="true"
		:append-to-body="true"
		:teleported="true"
		modal-class="attendance-records-overlay-mobile"
		class="attendance-records-dialog-mobile"
		@close="closeAttendanceRecordsDialog"
		>
		<!-- 学生信息头部 -->
		<div class="student-info-header-mobile">
			<div class="student-avatar-large-mobile">
				{{ currentStudentInfo.name?.charAt(0) }}
			</div>
			<div class="student-info-mobile">
				<h3>{{ currentStudentInfo.name }}</h3>
				<p>学号：{{ currentStudentInfo.studentId }}</p>
				<p>专业：{{ currentStudentInfo.major }} | 年级：{{ currentStudentInfo.grade }}年级</p>
			</div>
			<div class="attendance-summary-mobile">
				<div class="summary-item-mobile">
					<span class="summary-label-mobile">总签到次数</span>
					<span class="summary-value-mobile">{{ allStudentAttendanceRecords.length }}</span>
				</div>
			</div>
		</div>

		<!-- 考勤日历容器 -->
		<div class="attendance-records-container-mobile">
			<el-calendar
				v-model="calendarValue"
				:locale="zhCn"
				class="attendance-calendar-mobile fullcalendar-mobile">
				<!-- 日历头部自定义模板 -->
				<template #header="{ date }">
					<div class="calendar-header-mobile">
						<div class="header-title-mobile">{{ formatCalendarTitle(date) }}</div>
						<div class="header-actions-mobile">
							<el-button size="small" @click="prevMonth">上个月</el-button>
							<el-button size="small" @click="goToday">今天</el-button>
							<el-button size="small" @click="nextMonth">下个月</el-button>
						</div>
					</div>
				</template>
				<!-- 日历单元格自定义模板 -->
				<template #date-cell="{ data }">
					<div class="calendar-cell-mobile" @click="openDateDetails(data.day)">
						<div class="cell-date-mobile">{{ data.day.split('-')[2] }}</div>
						<div class="time-slot-status-mobile">
								<span
									v-for="slot in calendarSlots"
									:key="slot.key"
									class="time-slot-mobile"
									:class="{ signed: isSlotSigned(data.day, slot.key) }"
								>
									<span class="time-label-mobile">{{ slot.label }}</span>
								</span>
						</div>
					</div>
				</template>
			</el-calendar>
		</div>
		<template #footer>
			<div class="dialog-footer-mobile">
				<el-button @click="closeAttendanceRecordsDialog">关闭</el-button>
			</div>
		</template>
		</el-dialog>

		<!-- 日期考勤详情对话框 -->
		<!-- 弹出式对话框，显示指定日期的详细考勤时间 -->
		<!-- 日期考勤详情提供具体日期的签到时间列表 -->
		<el-dialog
			v-if="showDateDetailsDialog"
			v-model="showDateDetailsDialog"
			title="签到详情"
			width="90%"
			class="date-details-dialog-mobile"
			destroy-on-close
			:close-on-click-modal="false"
			:append-to-body="true"
			:teleported="true"
		>
			<div class="date-details-content-mobile" @click.stop>
				<div class="selected-date-mobile">{{ formatDateForDisplay(selectedDate) }}</div>
				<div class="attendance-times-mobile">
					<!-- 无签到记录提示 -->
					<!-- 提供友好的空状态提示 -->
					<!-- 空状态包含图标和文本，提升用户体验 -->
					<!-- 空状态包含图标和文本，提升用户体验 -->
					<!-- 空状态包含图标和文本，提升用户体验 -->
					<div v-if="getDateAttendanceTimes(selectedDate).length === 0" class="no-attendance-mobile">
						该日期无签到记录
					</div>
					<!-- 有签到记录时渲染 -->
					<div v-else>
						<div
							v-for="(time, index) in getDateAttendanceTimes(selectedDate)"
							:key="index"
							class="attendance-time-item-mobile">
							<el-icon class="time-icon-mobile">
								<clock/> <!-- 时钟图标 -->
							</el-icon>
							<span class="time-text-mobile">{{ formatAttendanceTime(time) }}</span>
							<span class="time-slot-label-mobile">{{ getTimeSlotLabel(time) }}</span>
						</div>
					</div>
				</div>
			</div>
		</el-dialog>

		<!-- 考勤热力图对话框 -->
		<!-- 弹出式对话框，以热力图形式展示学生考勤分布 -->
		<!-- 考勤热力图可视化展示学生考勤频率和规律 -->
		<el-dialog
			v-if="heatmapDialogVisible"
			v-model="heatmapDialogVisible"
			:title="`${currentStudentInfo.name} 的签到热力图`"
			width="90%"
			:close-on-click-modal="false"
			:append-to-body="true"
			:teleported="true"
			:destroy-on-close="true"
			modal-class="heatmap-overlay-mobile"
			class="heatmap-dialog-mobile"
			@close="closeHeatmapDialog"
		>
			<!-- 学生信息头部 -->
			<div class="student-info-header-mobile">
				<div class="student-avatar-large-mobile">
					{{ currentStudentInfo.name?.charAt(0) }}
				</div>
				<div class="student-info-mobile">
					<h3>{{ currentStudentInfo.name }}</h3>
					<p>学号：{{ currentStudentInfo.studentId }}</p>
					<p>专业：{{ currentStudentInfo.major }} | 年级：{{ currentStudentInfo.grade }}年级</p>
				</div>
				<div class="attendance-summary-mobile">
					<div class="summary-item-mobile">
						<span class="summary-label-mobile">总签到次数</span>
						<span class="summary-value-mobile">{{ allStudentAttendanceRecords.length }}</span>
					</div>
				</div>
			</div>

			<!-- 热力图容器 -->
			<div class="chart-container">
				<div class="chart-item-mobile">
					<div class="chart-title-mobile">签到热力图</div>
					<div ref="heatmapChart" class="chart-content-mobile"/>
				</div>
			</div>

			<template #footer>
				<div class="dialog-footer-mobile">
					<el-button @click="closeHeatmapDialog">关闭</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 考勤趋势图对话框 -->
		<!-- 弹出式对话框，以趋势图形式展示学生考勤趋势 -->
		<!-- 考勤趋势图显示学生考勤变化趋势和模式 -->
		<el-dialog
			v-if="trendDialogVisible"
			v-model="trendDialogVisible"
			:title="`${currentStudentInfo.name} 的签到趋势图`"
			width="90%"
			:close-on-click-modal="false"
			:append-to-body="true"
			:teleported="true"
			:destroy-on-close="true"
			modal-class="trend-overlay-mobile"
			class="trend-dialog-mobile"
			@close="closeTrendDialog"
		>
			<!-- 学生信息头部 -->
			<div class="student-info-header-mobile">
				<div class="student-avatar-large-mobile">
					{{ currentStudentInfo.name?.charAt(0) }}
				</div>
				<div class="student-info-mobile">
					<h3>{{ currentStudentInfo.name }}</h3>
					<p>学号：{{ currentStudentInfo.studentId }}</p>
					<p>专业：{{ currentStudentInfo.major }} | 年级：{{ currentStudentInfo.grade }}年级</p>
				</div>
				<div class="attendance-summary-mobile">
					<div class="summary-item-mobile">
						<span class="summary-label-mobile">总签到次数</span>
						<span class="summary-value-mobile">{{ allStudentAttendanceRecords.length }}</span>
					</div>
				</div>
			</div>

			<!-- 趋势图容器 -->
			<div class="chart-container">
				<div class="chart-item-mobile">
					<div class="chart-title-mobile">签到趋势图</div>
					<div ref="lineChart" class="chart-content-mobile"/>
				</div>
			</div>

			<template #footer>
				<div class="dialog-footer-mobile">
					<el-button @click="closeTrendDialog">关闭</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 补卡操作对话框（分步操作） -->
		<!-- 分步骤的补卡操作对话框，先选择日期再选择时间 -->
		<!-- 补卡操作分步进行，确保操作的准确性和安全性 -->
		<el-dialog
			v-if="makeupDialogVisible"
			v-model="makeupDialogVisible"
			:title=null
			:close-on-click-modal="false"
			class="makeup-dialog-mobile"
			:show-close="false"
		:modal="true"
		:append-to-body="true"
		:teleported="true"
		modal-class="makeup-overlay-mobile"
		:destroy-on-close="true"
		>
		<!-- 补卡对话框头部 -->
		<div class="makeup-header-mobile">
			<div class="header-icon">
				<el-icon size="28">
					<clock/> <!-- 时钟图标 -->
				</el-icon>
			</div>
			<div class="header-content">
				<h3>学生补卡</h3>
				<p>为指定学生进行补卡操作</p>
			</div>
		</div>

		<!-- 补卡对话框内容区 -->
		<div class="makeup-content-mobile">
			<!-- 选中学生信息卡片 -->
			<div class="student-info-card">
				<div class="student-avatar">
					<el-icon size="36">
						<user/> <!-- 用户图标 -->
					</el-icon>
				</div>
				<div class="student-details">
					<div class="student-name">{{ makeupSelectedStudent?.name }}</div>
					<div class="student-id">{{ makeupSelectedStudent?.studentId }}</div>
					<div class="student-grade">
						{{ makeupSelectedStudent?.grade }}年级 ·
						{{ makeupSelectedStudent?.major }}
					</div>
				</div>
			</div>

			<!-- 第一步：选择补卡日期 -->
			<div v-if="makeupStep === 'date'" class="makeup-step-content-mobile">
				<div class="step-title">第一步：选择补卡日期</div>
				<!-- 日期快捷选择按钮 -->
				<div class="date-shortcuts">
					<el-button
						v-for="shortcut in datetimeShortcuts"
						:key="shortcut.key"
						size="small"
						:type="isDatetimeShortcutSelected(shortcut) ? 'primary' : 'default'"
						class="date-shortcut-btn"
						@click="selectDatetimeShortcut(shortcut)"
					>
						<el-icon>
							<clock/> <!-- 时钟图标 -->
						</el-icon>
						<span>{{ shortcut.label }}</span>
					</el-button>
				</div>
				<!-- 补卡日期选择表单 -->
				<el-form
					ref="makeupFormRef"
					:model="makeupForm"
					:rules="makeupDateFormRules"
					label-width="100px"
					class="makeup-form-content-mobile"
				>
					<el-form-item label="选择日期" prop="selectedDate">
						<el-date-picker
							ref="datePickerRef"
							v-model="makeupForm.selectedDate"
							type="date"
							:locale="zhCn"
							placeholder="请选择日期"
							format="YYYY-MM-DD"
							value-format="YYYY-MM-DD"
							class="makeup-date-picker-mobile"
							popper-class="makeup-date-picker-popper-mobile"
							clearable
							style="width: 100%"
							@change="handleDateChange"
						>
							<template #prefix-icon>
								<el-icon>
									<calendar/> <!-- 日历图标 -->
								</el-icon>
							</template>
						</el-date-picker>
					</el-form-item>
				</el-form>
			</div>

			<!-- 第二步：选择补卡时间 -->
			<div v-if="makeupStep === 'hour'" class="makeup-step-content-mobile">
				<div class="step-title">第二步：选择补卡时间</div>
				<!-- 已选日期展示 -->
				<div class="selected-date-display">
					<el-icon>
						<calendar/> <!-- 日历图标 -->
					</el-icon>
					<span>已选择日期：{{ formatSelectedDate() }}</span>
				</div>
				<!-- 补卡小时选择按钮组 -->
				<div class="hour-buttons-group">
					<div class="hour-label">选择时间：</div>
					<div class="hour-buttons-container">
						<template v-for="(slot, slotIndex) in timeSlots" :key="slot.key">
							<div class="time-slot-buttons" :data-slot="slot.key">
								<div class="time-slot-label">{{ slot.label }}</div>
								<el-button
									v-for="hour in slot.hours"
									:key="hour"
									size="small"
									:type="isHourSelected(hour) ? 'primary' : 'default'"
									class="hour-btn"
									@click="selectHour(hour)"
								>
									{{ String(hour).padStart(2, '0') }}:00
								</el-button>
							</div>
							<!-- 时间段分隔线（最后一个不显示） -->
							<div v-if="slotIndex < timeSlots.length - 1" class="time-slot-divider"/>
						</template>
					</div>
					<!-- 补卡时间提示 -->
					<div class="form-tip">
						<el-icon>
							<warning/> <!-- 警告图标 -->
						</el-icon>
						<span>补卡时间必须在有效签到时间段内（早上 08:00-11:00、下午 14:00-17:00、晚上 19:00-22:00），且不能晚于当前时间</span>
					</div>
				</div>
			</div>
		</div>

		<!-- 补卡对话框底部按钮 -->
		<div class="makeup-footer-mobile">
			<el-button
				class="cancel-btn"
				size="large"
				@click="cancelMakeup"
			>
				取消
			</el-button>
			<!-- 日期步骤确认按钮 -->
			<el-button
				v-if="makeupStep === 'date'"
				type="primary"
				:disabled="!makeupForm.selectedDate"
				class="submit-btn"
				size="large"
				@click="confirmDateStep"
			>
				确认
			</el-button>
			<!-- 时间步骤提交按钮 -->
			<el-button
				v-if="makeupStep === 'hour'"
				type="primary"
				:loading="makeupLoading"
				:disabled="makeupForm.selectedHour === null"
				class="submit-btn"
				size="large"
				@click="submitMakeup"
			>
				<el-icon v-if="!makeupLoading">
					<clock/> <!-- 时钟图标 -->
				</el-icon>
				{{ makeupLoading ? '处理中...' : '确认补卡' }}
			</el-button>
		</div>
		</el-dialog>

		<!-- 修改积分对话框 -->
		<!-- 弹出式对话框，用于修改学生积分和填写改分理由 -->
		<!-- 积分修改对话框支持积分调整和记录调整原因 -->
		<el-dialog
			v-if="pointsDialogVisible"
			v-model="pointsDialogVisible"
			title="修改积分"
			width="90%"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:append-to-body="true"
			:teleported="true"
			modal-class="points-dialog-overlay-mobile"
			class="points-dialog-mobile"
			@close="handlePointsDialogClose"
		>
			<!-- 选中学生信息卡片 -->
			<div v-if="pointsSelectedStudent" class="points-student-info-mobile">
				<div class="student-info-card">
					<div class="student-avatar-card">
						{{ pointsSelectedStudent.name.charAt(0) }}
					</div>
					<div class="student-info-details">
						<div class="student-name-card">{{ pointsSelectedStudent.name }}</div>
						<div class="student-id-card">学号：{{ pointsSelectedStudent.studentId }}</div>
						<div class="student-major-card">
							{{ pointsSelectedStudent.major }} |
							{{ pointsSelectedStudent.grade }}年级
						</div>
					</div>
				</div>
			</div>
			<!-- 积分修改表单 -->
			<el-form
				ref="pointsFormRef"
				:model="pointsForm"
				:rules="pointsFormRules"
				label-width="100px"
				class="points-form-mobile"
			>
				<el-form-item label="积分变动" prop="changePoints">
					<el-input-number
						v-model="pointsForm.changePoints"
						:min="-9999"
						:max="9999"
						placeholder="请输入积分变动值（正数为加分，负数为扣分）"
						style="width: 100%"
					/>
					<!-- 积分变动提示 -->
					<div class="form-tip">
						<el-icon>
							<warning/> <!-- 警告图标 -->
						</el-icon>
						<span>正数表示加分，负数表示扣分</span>
					</div>
				</el-form-item>
				<el-form-item label="改分理由" prop="adjustReason">
					<el-input
						v-model="pointsForm.adjustReason"
						type="textarea"
						:rows="4"
						placeholder="请输入详细的改分理由（最多500字符）"
						maxlength="500"
						show-word-limit
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer-mobile">
					<el-button :disabled="pointsLoading" @click="cancelPoints">取消</el-button>
					<el-button type="primary" :loading="pointsLoading" @click="confirmPoints">
						确认修改
					</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 积分变动记录查看对话框 -->
		<!-- 弹出式对话框，查看学生积分变动历史记录 -->
		<!-- 积分变动记录提供完整的积分调整历史追踪 -->
		<el-dialog
			v-if="scoreChangeRecordsDialogVisible"
			v-model="scoreChangeRecordsDialogVisible"
			:title="`${currentScoreChangeRecordsStudent?.name || '学生'} 的改分记录`"
			width="90%"
			:close-on-click-modal="false"
			:destroy-on-close="true"
			:append-to-body="true"
			:teleported="true"
			modal-class="score-change-records-overlay-mobile"
			class="score-change-records-dialog-mobile"
			@close="closeScoreChangeRecordsDialog"
		>
			<!-- 学生信息头部 -->
			<div class="student-info-header-mobile">
				<div class="student-avatar-large-mobile">
					{{ currentScoreChangeRecordsStudent?.name?.charAt(0) || '学' }}
				</div>
				<div class="student-info-mobile">
					<h3>{{ currentScoreChangeRecordsStudent?.name || '学生' }}</h3>
					<p>学号：{{ currentScoreChangeRecordsStudent?.studentId }}</p>
					<p v-if="currentScoreChangeRecordsStudent?.major && currentScoreChangeRecordsStudent?.grade">
						专业：{{ currentScoreChangeRecordsStudent.major }} |
						年级：{{ currentScoreChangeRecordsStudent.grade }}年级
					</p>
				</div>
				<div class="attendance-summary-mobile">
					<div class="summary-item-mobile">
						<span class="summary-label-mobile">总记录数</span>
						<span class="summary-value-mobile">{{ scoreChangeRecords.length }}</span>
					</div>
					<div class="summary-item-mobile">
						<span class="summary-label-mobile">总调整分数</span>
						<span
							class="summary-value-mobile"
							:class="{ positive: totalScoreChangePoints >= 0, negative: totalScoreChangePoints < 0 }">
							{{ totalScoreChangePoints > 0 ? `+${totalScoreChangePoints}` : totalScoreChangePoints }}
						</span>
					</div>
				</div>
			</div>

			<!-- 加载状态 -->
			<div v-if="scoreChangeRecordsLoading" class="records-loading-mobile">
				<el-icon class="is-loading">
					<loading/> <!-- 加载图标 -->
				</el-icon>
				<span>加载中...</span>
			</div>
			<!-- 无记录状态 -->
			<div v-else-if="scoreChangeRecords.length === 0" class="records-empty-mobile">
				<el-icon>
					<box/> <!-- 盒子图标 -->
				</el-icon>
				<span>暂无改分记录</span>
			</div>
			<!-- 有记录时渲染列表 -->
			<div v-else class="score-change-records-container-mobile">
				<div class="records-grid">
					<div
						v-for="(record, index) in sortedScoreChangeRecords"
						:key="index"
						class="record-card-mobile"
					>
						<div class="record-header-mobile">
							<span class="record-time-mobile">{{ formatTime(record.createTime) }}</span>
							<span
								class="record-points-badge-mobile"
								:class="{ positive: record.adjustPoints >= 0, negative: record.adjustPoints < 0 }">
								{{ record.adjustPoints > 0 ? `+${record.adjustPoints}` : record.adjustPoints }}
							</span>
						</div>
						<div class="record-reason-text-mobile">{{ record.adjustReason }}</div>
					</div>
				</div>
			</div>
			<template #footer>
				<div class="dialog-footer-mobile">
					<el-button @click="closeScoreChangeRecordsDialog">关闭</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>
