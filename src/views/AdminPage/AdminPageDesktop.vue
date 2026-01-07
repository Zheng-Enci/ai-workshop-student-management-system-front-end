<script setup>
/**
 * 超级管理员控制台组件
 * 功能描述：AI坊学生管理系统的超级管理员核心操作界面，提供学生信息管理、考勤记录查看、补卡操作、积分修改等核心功能
 * 技术栈：Vue3 + Script Setup + Element Plus + 组合式API
 */

// ===================== 依赖导入区 =====================
// Element Plus 核心组件导入
import {
	ElMessage,       // 全局消息提示
	ElIcon,          // 图标容器
	ElInput,         // 输入框
	ElButton,        // 按钮
	ElSelect,        // 下拉选择器
	ElOption,        // 下拉选项
	ElDialog,        // 弹窗
	ElForm,          // 表单
	ElFormItem,      // 表单项
	ElInputNumber,   // 数字输入框
	ElDatePicker,    // 日期选择器
	ElTabs,          // 标签页
	ElTabPane,       // 标签页面板
	ElTag,           // 标签
	ElTooltip,       // 提示框
	ElPagination,    // 分页组件
	ElCalendar       // 日历组件
} from 'element-plus'

// Vue 核心组合式API
import {onMounted, watch, ref, nextTick} from 'vue'
import {useRouter} from 'vue-router'

// 自定义hooks - 封装管理员页面的核心业务逻辑
import {useAdminPage} from './js/AdminPage.js'

// Element Plus 样式导入（按需导入）
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

// Element Plus 图标组件导入
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
	Lock, House  ,
	Key
} from '@element-plus/icons-vue'

// ===================== 业务变量定义区 =====================
// 导入获取管理员头像的API
import {getAvatarUrl} from '@/api/student'

// 响应式变量 - 管理员头像URL（参数：2为管理员类型，256为头像尺寸）
const adminAvatarUrl = ref(getAvatarUrl(2, 256))

// 从自定义hooks中解构响应式状态和方法（核心业务逻辑封装）
const {
	// 认证相关
	isAuthenticated,    // 是否已完成身份验证
	specialPassword,    // 超级管理员验证密码
	authError,          // 认证错误信息
	authLoading,        // 认证加载状态
	// 通用加载状态
	isLoading,          // 全局加载状态
	isDataLoaded,       // 核心数据是否加载完成
	loadingProgress,    // 加载进度（百分比）
	loadingStatus,      // 加载状态文本提示
	// 学生数据
	students,           // 所有学生列表
	searchKeyword,      // 学生搜索关键词
	currentPage,        // 当前分页页码
	pageSize,           // 每页显示数量
	totalStudents,      // 学生总数
	// 统计数据
	todayCount,         // 今日签到人数
	monthlyCount,       // 本月签到人数
	studentLevels,      // 学生等级映射（studentId -> 等级值）
	studentAttendanceCounts, // 学生签到次数映射（studentId -> 次数）
	studentAdmins,      // 学生所属管理员映射（studentId -> 管理员信息）
	studentPoints,      // 学生积分信息映射（studentId -> 积分详情）
	// 界面状态
	activeLevelTab,     // 当前激活的学生等级标签页
	editDialogVisible,  // 编辑学生信息弹窗是否显示
	editFormRef,        // 编辑表单引用
	editForm,           // 编辑表单数据
	todayAttendanceDialogVisible, // 今日签到记录弹窗是否显示
	todayAttendanceRecords,       // 今日签到记录列表
	attendanceRecordsDialogVisible, // 考勤记录弹窗是否显示
	currentStudentInfo,            // 当前选中的学生信息
	calendarValue,                 // 日历选中日期
	scrollPosition,                // 滚动位置
	allStudentAttendanceRecords,   // 当前学生所有考勤记录
	calendarSlots,                 // 日历时间段配置
	filteredStudentAttendanceRecords, // 筛选后的考勤记录
	// 图表相关
	heatmapDialogVisible,  // 热力图弹窗是否显示
	trendDialogVisible,    // 趋势图弹窗是否显示
	heatmapChart,          // 热力图容器引用
	lineChart,             // 趋势图容器引用
	heatmapInstance,       // 热力图实例
	lineInstance,          // 趋势图实例
	// 日期详情
	showDateDetailsDialog, // 日期签到详情弹窗是否显示
	selectedDate,          // 选中的详情日期
	// 补卡相关
	makeupDialogVisible,   // 补卡弹窗是否显示
	makeupLoading,         // 补卡操作加载状态
	makeupSelectedStudent, // 选中的补卡学生
	makeupStep,            // 补卡步骤（date-选日期/hour-选时间）
	makeupFormRef,         // 补卡表单引用
	datePickerRef,         // 日期选择器引用
	makeupForm,            // 补卡表单数据
	// 积分相关
	pointsDialogVisible,       // 修改积分弹窗是否显示
	pointsLoading,             // 积分修改加载状态
	pointsSelectedStudent,     // 选中的积分修改学生
	pointsFormRef,             // 积分表单引用
	pointsForm,                // 积分表单数据
	scoreChangeRecordsDialogVisible, // 改分记录弹窗是否显示
	scoreChangeRecordsLoading,      // 改分记录加载状态
	scoreChangeRecords,             // 改分记录列表
	currentScoreChangeRecordsStudent, // 当前查看改分记录的学生
	// 配置项
	datetimeShortcuts,   // 日期快捷选择配置
	levelOptions,        // 学生等级选项（[{label, value, color}]）
	adminOptions,        // 管理员选项列表
	// 筛选后数据
	filteredStudents,    // 搜索筛选后的学生列表
	currentLevelStudents,// 当前等级标签页下的学生列表
	// 表单校验规则
	editFormRules,       // 编辑学生表单校验规则
	pointsFormRules,     // 积分修改表单校验规则
	makeupDateFormRules, // 补卡日期表单校验规则

	// 方法
	getLevelStudents,    // 根据等级筛选学生
	changeLevel,         // 修改学生等级
	changeAdmin,         // 分配学生所属管理员
	loadStudentLevels,   // 加载学生等级数据
	loadStudentAttendanceCounts, // 加载学生签到次数
	loadStudentAdmins,   // 加载学生所属管理员
	handleAvatarError,   // 头像加载失败处理
	loadStatistics,      // 加载统计数据
	refreshData,         // 刷新所有数据
	openEditDialog,      // 打开编辑学生弹窗
	cancelEdit,          // 取消编辑
	confirmEdit,         // 确认编辑
	showTodayAttendance, // 显示今日签到记录
	formatAttendanceTime,// 格式化考勤时间
	getTimePeriodClass,  // 获取时间段样式类
	getTimePeriodName,   // 获取时间段名称
	isSlotSigned,        // 判断时间段是否签到
	openDateDetails,     // 打开日期详情弹窗
	openAttendanceRecordsDialog, // 打开考勤记录弹窗
	closeAttendanceRecordsDialog, // 关闭考勤记录弹窗
	closeHeatmapDialog,  // 关闭热力图弹窗
	closeTrendDialog,    // 关闭趋势图弹窗
	formatDateForDisplay,// 格式化日期显示
	formatCalendarTitle, // 格式化日历标题
	prevMonth,           // 日历切换到上个月
	nextMonth,           // 日历切换到下个月
	goToday,             // 日历回到今天
	getTimeSlotLabel,    // 获取时间段标签
	getDateAttendanceTimes, // 获取指定日期的签到时间列表
	initHeatmapChart,    // 初始化热力图
	initLineChart,       // 初始化趋势图
	generateHeatmapData, // 生成热力图数据
	generateLineData,    // 生成趋势图数据
	openHeatmapDialog,   // 打开热力图弹窗
	openTrendDialog,     // 打开趋势图弹窗
	authenticate,        // 身份验证
	logout,              // 退出登录
	getShortcutDate,     // 获取快捷日期
	openMakeupDialog,    // 打开补卡弹窗
	cancelMakeup,        // 取消补卡
	handleDateChange,    // 日期选择变化处理
	formatSelectedDate,  // 格式化选中日期
	confirmDateStep,     // 确认补卡日期步骤
	selectDatetimeShortcut, // 选择日期快捷项
	isDatetimeShortcutSelected, // 判断快捷项是否选中
	selectHour,          // 选择补卡小时
	isHourSelected,      // 判断小时是否选中
	updateAttendanceTime,// 更新考勤时间
	submitMakeup,        // 提交补卡
	openPointsDialog,    // 打开修改积分弹窗
	handlePointsDialogClose, // 关闭积分弹窗处理
	cancelPoints,        // 取消积分修改
	confirmPoints,       // 确认积分修改
	openScoreChangeRecordsDialog, // 打开改分记录弹窗
	closeScoreChangeRecordsDialog, // 关闭改分记录弹窗
	formatTime,          // 格式化时间
	loadAllData,         // 加载所有核心数据
	timeSlots,           // 时间段配置
	sortedScoreChangeRecords, // 排序后的改分记录
	totalScoreChangePoints,   // 总积分调整值
	toggleTheme          // 切换主题
} = useAdminPage()

// 月份英文转中文映射表（用于日历/统计展示）
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

// 月份观察者（预留：用于监听月份变化，暂未初始化）
const monthObserver = null

// 路由实例
const router = useRouter()

/**
 * 前往首页
 * @function goToHome
 * @description 跳转到系统首页
 */
const goToHome = () => {
	router.push('/')
}

// ===================== 生命周期 & 监听 =====================
/**
 * 组件挂载完成钩子
 * 核心逻辑：
 * 1. 设置页面标题
 * 2. 从本地存储获取管理员密码，自动完成认证并加载数据
 * 3. 无密码时显示身份验证界面
 */
onMounted(async () => {
	// 设置页面标题
	document.title = '超级管理员控制台 - AI坊学生管理系统'

	// 从adminStore获取保存的管理员密码（需确保adminStore已全局注册）
	const adminPassword = adminStore.getAdminPassword()
	if (adminPassword) {
		// 已有密码，标记为已认证
		isAuthenticated.value = true
		try {
			// 加载所有核心数据
			await loadAllData(adminPassword)
		} catch (error) {
			// 加载失败：提示错误、取消认证、清空密码
			ElMessage.error(`加载数据失败：${error.message}`)
			isAuthenticated.value = false
			adminStore.clearAdminPassword()
		}
	} else {
		// 无密码，显示认证界面
		isAuthenticated.value = false
	}
})

/**
 * 监听日历选中日期变化
 * 触发条件：calendarValue响应式变量变化
 * 处理逻辑：考勤记录弹窗打开且非加载状态时，重新初始化图表
 */
watch(calendarValue, async () => {
	if (attendanceRecordsDialogVisible.value && !isLoading.value) {
		// 等待DOM更新完成后再初始化图表，避免容器未渲染
		await nextTick()
		initHeatmapChart()
		initLineChart()
	}
})
</script>

<template>
	<!-- 1. 身份验证界面：未认证时显示 -->
	<div v-if="!isAuthenticated">
		<!-- 身份认证页面顶部 -->
		<div class="identify-authentication-page-header">
			<div class="identify-authentication-page-header-left">
				<!-- 该按钮前往首页 -->
				<el-button
					type="primary"
					:icon="House"
					circle
					size="large"
					@click="goToHome"
					title="返回首页"
				/>
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊学生管理系统"
					title="切换主题模式"
					@click="toggleTheme"/>
			</div>

			<h2 class="identify-authentication-page-header-title">超级管理员身份验证</h2>
			<!-- 这里是一个锁标志 让页面看起来更有安全感 -->
			<div class="identify-authentication-page-header-right">
				<el-icon class="identify-authentication-page-header-right-icon">
					<Lock/>
				</el-icon>
			</div>
		</div>
		<!-- 身份认证页面主体 -->
		<div class="identify-authentication-page-body">
			<!-- 管理员头像：加载失败时显示默认样式 -->
			<img
				v-if="adminAvatarUrl"
				v-lazy="adminAvatarUrl"
				alt="Admin Avatar"
				@error="adminAvatarUrl = null"/>
			<!-- 密码输入框：支持回车提交 -->
			<el-input
				v-model="specialPassword"
				type="password"
				placeholder="请输入特殊密码"
				show-password
				size="large"
				@keyup.enter="authenticate"
			>
				<template #prefix>
					<el-icon>
						<lock/>
					</el-icon>
				</template>
			</el-input>

			<!-- 验证按钮：加载状态禁用 -->
			<el-button
				type="primary"
				size="large"
				:loading="authLoading"
				@click="authenticate"
			>
				<el-icon>
					<Key/>
				</el-icon>
				<span>验证身份</span>
			</el-button>

		</div>
	</div>

	<!-- 2. 加载界面：已认证但数据未加载完成时显示 -->
	<div v-else-if="!isDataLoaded" class="admin-loading">
		<div class="loading-page-header">
			<img
				src="@/assets/AiWorkShop_icon.png"
				alt="AI坊学生管理系统"
				class="loading-logo"
				title="切换主题模式"
				@click="toggleTheme"/>
		</div>
		<div class="loading-container">
			<div class="loading-spinner">
				<div class="spinner-ring"/>
				<div class="spinner-ring"/>
				<div class="spinner-ring"/>
			</div>
			<div class="loading-text">数据加载中，请稍候...</div>
			<!-- 加载进度条 -->
			<div class="loading-progress">
				<div class="progress-bar" :style="{ width: loadingProgress + '%' }"/>
			</div>
			<div class="loading-status">{{ loadingStatus }}</div>
		</div>
	</div>

	<!-- 3. 管理控制台主界面：已认证且数据加载完成时显示 -->
	<div v-else class="admin-console">
		<!-- 3.1 头部区域：logo + 标题 + 退出按钮 -->
		<div class="admin-header">
			<div class="header-left">
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊学生管理系统"
					class="logo"
					title="切换主题模式"
					@click="toggleTheme"/>
				<div class="title-section">
					<h1>超级管理员控制台</h1>
					<p>Super Admin Console</p>
				</div>
			</div>
			<div class="header-right">
				<el-button
					type="danger"
					size="small"
					class="logout-btn"
					@click="logout">
					<el-icon>
						<switch-button/>
					</el-icon>
					退出登录
				</el-button>
			</div>
		</div>

		<!-- 3.2 统计卡片区域：学生总数、今日签到、本月签到 -->
		<div class="admin-stats">
			<div class="stat-card">
				<div class="stat-icon">
					<el-icon>
						<user/>
					</el-icon>
				</div>
				<div class="stat-content">
					<div class="stat-value">{{ totalStudents }}</div>
					<div class="stat-label">学生总数</div>
				</div>
			</div>
			<div class="stat-card" style="cursor: pointer;" @click="showTodayAttendance">
				<div class="stat-icon">
					<el-icon>
						<calendar/>
					</el-icon>
				</div>
				<div class="stat-content">
					<div class="stat-value">{{ todayCount }}</div>
					<div class="stat-label">今日签到</div>
				</div>
			</div>
			<div class="stat-card">
				<div class="stat-icon">
					<el-icon>
						<trend-charts/>
					</el-icon>
				</div>
				<div class="stat-content">
					<div class="stat-value">{{ monthlyCount }}</div>
					<div class="stat-label">本月签到</div>
				</div>
			</div>
		</div>

		<!-- 3.3 学生信息管理区域 -->
		<div class="students-section">
			<!-- 区域头部：标题 + 搜索 + 刷新 -->
			<div class="section-header">
				<h2>学生信息管理</h2>
				<div class="header-actions">
					<el-input
						v-model="searchKeyword"
						placeholder="搜索学生信息"
						clearable
						class="search-input"
					>
						<template #prefix>
							<el-icon>
								<search/>
							</el-icon>
						</template>
					</el-input>
					<el-button :loading="isLoading" type="primary" @click="refreshData">
						<el-icon>
							<refresh/>
						</el-icon>
						刷新数据
					</el-button>
				</div>
			</div>

			<!-- 等级标签页：按学生等级分类展示 -->
			<div class="level-tabs">
				<el-tabs v-model="activeLevelTab" type="card" class="level-tabs-container">
					<el-tab-pane
						v-for="level in levelOptions"
						:key="level.value"
						:label="level.label"
						:name="level.value.toString()"
						:class="`level-tab-${level.color}`"
					>
						<template #label>
							<el-tag :type="level.color" size="large" class="tab-label">
								{{ level.label }}
								<span class="tab-count">({{ getLevelStudents(level.value).length }})</span>
							</el-tag>
						</template>
					</el-tab-pane>
				</el-tabs>
			</div>

			<!-- 学生卡片列表：展示当前等级下的所有学生 -->
			<div class="students-cards-container">
				<div
					v-for="student in filteredStudents"
					v-show="(parseInt(studentLevels[student.studentId] || 0) === parseInt(activeLevelTab))"
					:key="student.studentId"
					class="student-card"
					:data-level="studentLevels[student.studentId] || 0">
					<!-- 学生基础信息行：头像 + 基本信息 + 签到次数 + 积分 -->
					<div class="student-main-row">
						<div class="student-avatar"
							 :class="{ 'has-avatar': student.hasAvatar && student.avatarUrl, 'no-avatar': !student.hasAvatar || !student.avatarUrl }">
							<img
								v-if="student.hasAvatar && student.avatarUrl"
								v-lazy="student.avatarUrl"
								alt="头像"
								class="avatar-image"
								@error="handleAvatarError(student)"/>
							<span v-else class="avatar-text">{{ student.name.charAt(0) }}</span>
						</div>
						<div class="student-primary-info">
							<div class="student-name">{{ student.name }}</div>
							<div class="student-id">学号: {{ student.studentId }}</div>
							<div class="student-db-id">唯一ID: {{ student.id }}</div>
						</div>
						<div class="attendance-count">
							<el-icon class="attendance-icon">
								<calendar/>
							</el-icon>
							<span class="count-text">{{
									studentAttendanceCounts[student.studentId] || 0
								}}次</span>
						</div>
						<div class="points-info">
							<div class="points-summary">
								<span class="points-total">总积分: {{
										Math.round((studentAttendanceCounts[student.studentId] || 0) * 0.64) + ((studentPoints[student.studentId] && studentPoints[student.studentId].totalPoints) || 0)
									}}</span>
							</div>
							<div class="points-details">
								<span class="points-type">签到: {{
										Math.round((studentAttendanceCounts[student.studentId] || 0) * 0.64)
									}}</span>
								<span class="points-type">活动: {{
										(studentPoints[student.studentId] && studentPoints[student.studentId].totalPoints) || 0
									}}</span>
							</div>
						</div>
					</div>

					<!-- 学生详情行：详细信息 + 操作按钮 -->
					<div class="student-detail-row">
						<div class="student-details">
							<div class="detail-item">
								<span class="label">年级：</span>
								<span class="value">{{ student.grade }}年级</span>
							</div>
							<div class="detail-item">
								<span class="label">专业：</span>
								<span class="value">{{ student.major }}</span>
							</div>
							<div class="detail-item">
								<span class="label">班级：</span>
								<span class="value">{{ student.classNum }}班</span>
							</div>
							<div class="detail-item">
								<span class="label">性别：</span>
								<span class="value">{{ student.gender }}</span>
							</div>
							<div class="detail-item">
								<span class="label">手机：</span>
								<span class="value">{{ student.phoneNumber }}</span>
							</div>
						</div>
						<div class="student-actions">
							<!-- 考勤记录按钮 -->
							<el-button
								type="success"
								size="small"
								class="records-btn"
								@click="openAttendanceRecordsDialog(student)"
							>
								<el-icon>
									<calendar/>
								</el-icon>
								考勤记录
							</el-button>
							<!-- 补卡按钮 -->
							<el-button
								type="warning"
								size="small"
								class="makeup-btn"
								@click="openMakeupDialog(student)"
							>
								<el-icon>
									<clock/>
								</el-icon>
								补卡
							</el-button>
							<!-- 热力图按钮 -->
							<el-button
								type="info"
								size="small"
								class="heatmap-btn"
								@click="openHeatmapDialog(student)"
							>
								<el-icon>
									<trend-charts/>
								</el-icon>
								热力图
							</el-button>
							<!-- 趋势图按钮 -->
							<el-button
								type="primary"
								size="small"
								class="trend-btn"
								@click="openTrendDialog(student)"
							>
								<el-icon>
									<trend-charts/>
								</el-icon>
								趋势图
							</el-button>
							<!-- 修改积分按钮 -->
							<el-button
								type="success"
								size="small"
								class="points-btn"
								@click="openPointsDialog(student)"
							>
								<el-icon>
									<edit/>
								</el-icon>
								修改积分
							</el-button>
							<!-- 改分记录按钮 -->
							<el-button
								type="info"
								size="small"
								class="score-records-btn"
								@click="openScoreChangeRecordsDialog(student)"
							>
								<el-icon>
									<document/>
								</el-icon>
								改分记录
							</el-button>
						</div>
					</div>

					<!-- 学生管理行：等级修改 + 管理员分配 + 编辑按钮 -->
					<div class="student-management-row">
						<div class="level-management">
							<span class="management-label">学生等级：</span>
							<el-select
								:model-value="studentLevels[student.studentId] || 0"
								size="small"
								style="width: 120px;"
								:loading="isLoading"
								class="level-select"
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
						<div class="admin-management">
							<span class="management-label">所属管理员：</span>
							<!-- 管理员身份提示：等级3为管理员，无需分配 -->
							<div v-if="(studentLevels[student.studentId] || 0) === 3"
								 class="admin-level-notice">
								<el-icon class="admin-icon">
									<user-filled/>
								</el-icon>
								<span>管理员身份</span>
							</div>
							<!-- 无可用管理员提示 -->
							<div v-else-if="adminOptions.length === 0" class="no-admin-available">
								<el-icon class="warning-icon">
									<warning/>
								</el-icon>
								<span>暂无可用的管理员</span>
							</div>
							<!-- 管理员下拉选择器 -->
							<div v-else>
								<el-select
									:model-value="studentAdmins[student.studentId]?.adminStudentId || ''"
									size="small"
									style="width: 180px;"
									:loading="isLoading"
									class="admin-select"
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
										<div class="admin-option">
											<el-icon class="option-icon">
												<user-filled/>
											</el-icon>
											<div class="option-text">
												<div class="option-name">{{ option.student.name }}</div>
												<div class="option-id">{{ option.student.studentId }}</div>
											</div>
										</div>
									</el-option>
								</el-select>
							</div>
						</div>
						<div class="edit-action">
							<el-tooltip content="编辑学生信息" placement="top">
								<el-button
									type="primary"
									size="small"
									:loading="isLoading"
									class="edit-btn"
									@click="openEditDialog(student)"
								>
									<el-icon>
										<edit/>
									</el-icon>
									编辑
								</el-button>
							</el-tooltip>
						</div>
					</div>
				</div>
			</div>

			<!-- 分页区域：记录数 + 分页控件 -->
			<div class="table-footer">
				<div class="pagination-info">
					共 {{ currentLevelStudents.length }} 条记录
				</div>
				<el-pagination
					v-model:current-page="currentPage"
					v-model:page-size="pageSize"
					:page-sizes="[10, 20, 50, 100]"
					:total="currentLevelStudents.length"
					layout="total, sizes, prev, pager, next, jumper"
					class="pagination"
				/>
			</div>
		</div>

		<!-- 3.4 页脚区域：版权信息 + 模式提示 -->
		<div class="admin-footer">
			<div class="footer-content">
				<div class="footer-left">
					<span>人工智能创作坊学生管理系统</span>
				</div>
				<div class="footer-right">
					<span>超级管理员模式</span>
				</div>
			</div>
		</div>

		<!-- ===================== 弹窗组件区域 ===================== -->
		<!-- 4.1 编辑学生信息弹窗 -->
		<el-dialog
			v-if="editDialogVisible"
			v-model="editDialogVisible"
			title="修改学生信息"
			width="600px"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:append-to-body="true"
			:teleported="true"
			class="edit-dialog"
		>
			<el-form
				ref="editFormRef"
				:model="editForm"
				:rules="editFormRules"
				label-width="100px"
				class="edit-form"
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
				<div class="dialog-footer">
					<el-button :disabled="isLoading" @click="cancelEdit">取消</el-button>
					<el-button type="primary" :loading="isLoading" @click="confirmEdit">
						确认修改
					</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 4.2 今日签到记录弹窗 -->
		<el-dialog
			v-if="todayAttendanceDialogVisible"
			v-model="todayAttendanceDialogVisible"
			title="今日签到记录"
			width="800px"
			:close-on-click-modal="false"
			:append-to-body="true"
			:teleported="true"
			class="today-attendance-dialog"
		>
			<div class="attendance-records-container">
				<div v-if="todayAttendanceRecords.length === 0" class="no-records">
					<el-icon class="no-records-icon">
						<calendar/>
					</el-icon>
					<p>今日暂无签到记录</p>
				</div>
				<div v-else class="records-list">
					<div
						v-for="(record, index) in todayAttendanceRecords"
						:key="index"
						class="attendance-record-item"
						:class="getTimePeriodClass(record.attendanceTime)"
					>
						<div class="time-period-indicator" :class="getTimePeriodClass(record.attendanceTime)">
							<div class="indicator-dot"/>
							<span class="period-text">{{ getTimePeriodName(record.attendanceTime) }}</span>
						</div>
						<div class="record-content">
							<div class="student-avatar" :class="getTimePeriodClass(record.attendanceTime)">
								{{ record.name.charAt(0) }}
							</div>
							<div class="student-details">
								<div class="student-name">{{ record.name }}</div>
								<div class="student-id">{{ record.scheduleId }}</div>
							</div>
							<div class="attendance-time">
								<el-icon class="time-icon">
									<clock/>
								</el-icon>
								<span class="time-text">{{ formatAttendanceTime(record.attendanceTime) }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="todayAttendanceDialogVisible = false">关闭</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 4.3 学生考勤记录弹窗（日历形式） -->
		<el-dialog
			v-if="attendanceRecordsDialogVisible"
			v-model="attendanceRecordsDialogVisible"
			:title="`${currentStudentInfo.name} 的考勤记录`"
			width="900px"
			:close-on-click-modal="false"
			:destroy-on-close="true"
			:append-to-body="true"
			:teleported="true"
			modal-class="attendance-records-overlay"
			class="attendance-records-dialog"
			@close="closeAttendanceRecordsDialog"
		>
			<div class="student-info-header">
				<div class="student-avatar-large">
					{{ currentStudentInfo.name?.charAt(0) }}
				</div>
				<div class="student-info">
					<h3>{{ currentStudentInfo.name }}</h3>
					<p>学号：{{ currentStudentInfo.studentId }}</p>
					<p>专业：{{ currentStudentInfo.major }} | 年级：{{ currentStudentInfo.grade }}年级</p>
				</div>
				<div class="attendance-summary">
					<div class="summary-item">
						<span class="summary-label">总签到次数</span>
						<span class="summary-value">{{ allStudentAttendanceRecords.length }}</span>
					</div>
				</div>
			</div>

			<div class="attendance-records-container">
				<el-calendar v-model="calendarValue" :locale="zhCn"
							 class="attendance-calendar-admin attendance-fullcalendar">
					<template #header="{ date }">
						<div class="calendar-header-admin">
							<div class="header-title-admin">{{ formatCalendarTitle(date) }}</div>
							<div class="header-actions-admin">
								<el-button size="small" @click="prevMonth">上个月</el-button>
								<el-button size="small" @click="goToday">今天</el-button>
								<el-button size="small" @click="nextMonth">下个月</el-button>
							</div>
						</div>
					</template>
					<template #date-cell="{ data }">
						<div class="calendar-cell-admin" @click="openDateDetails(data.day)">
							<div class="cell-date-admin">{{ data.day.split('-')[2] }}</div>
							<div class="time-slot-status-admin">
								<span
									v-for="slot in calendarSlots"
									:key="slot.key"
									class="time-slot-admin"
									:class="{ signed: isSlotSigned(data.day, slot.key) }"
								>
									<span class="time-label-admin">{{ slot.label }}</span>
								</span>
							</div>
						</div>
					</template>
				</el-calendar>
			</div>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="closeAttendanceRecordsDialog">关闭</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 4.4 日期签到详情弹窗 -->
		<el-dialog
			v-if="showDateDetailsDialog"
			v-model="showDateDetailsDialog"
			title="签到详情"
			width="400px"
			class="date-details-dialog-admin"
			destroy-on-close
			:close-on-click-modal="false"
			:append-to-body="true"
			:teleported="true"
		>
			<div class="date-details-content-admin" @click.stop>
				<div class="selected-date-admin">{{ formatDateForDisplay(selectedDate) }}</div>
				<div class="attendance-times-admin">
					<div v-if="getDateAttendanceTimes(selectedDate).length === 0" class="no-attendance-admin">
						该日期无签到记录
					</div>
					<div v-else>
						<div v-for="(time, index) in getDateAttendanceTimes(selectedDate)" :key="index"
							 class="attendance-time-item-admin">
							<el-icon class="time-icon-admin">
								<clock/>
							</el-icon>
							<span class="time-text-admin">{{ formatAttendanceTime(time) }}</span>
							<span class="time-slot-label-admin">{{ getTimeSlotLabel(time) }}</span>
						</div>
					</div>
				</div>
			</div>
		</el-dialog>

		<!-- 4.5 签到热力图弹窗 -->
		<el-dialog
			v-if="heatmapDialogVisible"
			v-model="heatmapDialogVisible"
			:title="`${currentStudentInfo.name} 的签到热力图`"
			width="1200px"
			:close-on-click-modal="false"
			:append-to-body="true"
			:teleported="true"
			:destroy-on-close="true"
			modal-class="heatmap-overlay"
			class="heatmap-dialog"
			@close="closeHeatmapDialog"
		>
			<div class="student-info-header">
				<div class="student-avatar-large">
					{{ currentStudentInfo.name?.charAt(0) }}
				</div>
				<div class="student-info">
					<h3>{{ currentStudentInfo.name }}</h3>
					<p>学号：{{ currentStudentInfo.studentId }}</p>
					<p>专业：{{ currentStudentInfo.major }} | 年级：{{ currentStudentInfo.grade }}年级</p>
				</div>
				<div class="attendance-summary">
					<div class="summary-item">
						<span class="summary-label">总签到次数</span>
						<span class="summary-value">{{ allStudentAttendanceRecords.length }}</span>
					</div>
				</div>
			</div>

			<div class="chart-container">
				<div class="chart-item-admin">
					<div class="chart-title-admin">签到热力图</div>
					<div ref="heatmapChart" class="chart-content-admin"/>
				</div>
			</div>

			<template #footer>
				<div class="dialog-footer">
					<el-button @click="closeHeatmapDialog">关闭</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 4.6 签到趋势图弹窗 -->
		<el-dialog
			v-if="trendDialogVisible"
			v-model="trendDialogVisible"
			:title="`${currentStudentInfo.name} 的签到趋势图`"
			width="1200px"
			:close-on-click-modal="false"
			:append-to-body="true"
			:teleported="true"
			:destroy-on-close="true"
			modal-class="trend-overlay"
			class="trend-dialog"
			@close="closeTrendDialog"
		>
			<div class="student-info-header">
				<div class="student-avatar-large">
					{{ currentStudentInfo.name?.charAt(0) }}
				</div>
				<div class="student-info">
					<h3>{{ currentStudentInfo.name }}</h3>
					<p>学号：{{ currentStudentInfo.studentId }}</p>
					<p>专业：{{ currentStudentInfo.major }} | 年级：{{ currentStudentInfo.grade }}年级</p>
				</div>
				<div class="attendance-summary">
					<div class="summary-item">
						<span class="summary-label">总签到次数</span>
						<span class="summary-value">{{ allStudentAttendanceRecords.length }}</span>
					</div>
				</div>
			</div>

			<div class="chart-container">
				<div class="chart-item-admin">
					<div class="chart-title-admin">签到趋势图</div>
					<div ref="lineChart" class="chart-content-admin"/>
				</div>
			</div>

			<template #footer>
				<div class="dialog-footer">
					<el-button @click="closeTrendDialog">关闭</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 4.7 学生补卡弹窗（分步操作：选日期→选时间） -->
		<el-dialog
			v-if="makeupDialogVisible"
			v-model="makeupDialogVisible"
			:title=null
			:close-on-click-modal="false"
			class="makeup-dialog"
			:show-close="false"
			:modal="true"
			:append-to-body="true"
			:teleported="true"
			modal-class="makeup-overlay"
			:destroy-on-close="true"
		>
			<div class="makeup-header">
				<div class="header-icon">
					<el-icon size="28">
						<clock/>
					</el-icon>
				</div>
				<div class="header-content">
					<h3>学生补卡</h3>
					<p>为指定学生进行补卡操作</p>
				</div>
			</div>

			<div class="makeup-content">
				<div class="student-info-card">
					<div class="student-avatar">
						<el-icon size="36">
							<user/>
						</el-icon>
					</div>
					<div class="student-details">
						<div class="student-name">{{ makeupSelectedStudent?.name }}</div>
						<div class="student-id">{{ makeupSelectedStudent?.studentId }}</div>
						<div class="student-grade">{{ makeupSelectedStudent?.grade }}年级 ·
							{{ makeupSelectedStudent?.major }}
						</div>
					</div>
				</div>

				<!-- 补卡第一步：选择日期 -->
				<div v-if="makeupStep === 'date'" class="makeup-step-content">
					<div class="step-title">第一步：选择补卡日期</div>
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
								<clock/>
							</el-icon>
							<span>{{ shortcut.label }}</span>
						</el-button>
					</div>
					<el-form
						ref="makeupFormRef"
						:model="makeupForm"
						:rules="makeupDateFormRules"
						label-width="100px"
						class="makeup-form-content"
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
								class="makeup-date-picker"
								popper-class="makeup-date-picker-popper"
								clearable
								style="width: 100%"
								@change="handleDateChange"
							>
								<template #prefix-icon>
									<el-icon>
										<calendar/>
									</el-icon>
								</template>
							</el-date-picker>
						</el-form-item>
					</el-form>
				</div>

				<!-- 补卡第二步：选择时间 -->
				<div v-if="makeupStep === 'hour'" class="makeup-step-content">
					<div class="step-title">第二步：选择补卡时间</div>
					<div class="selected-date-display">
						<el-icon>
							<calendar/>
						</el-icon>
						<span>已选择日期：{{ formatSelectedDate() }}</span>
					</div>
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
								<div v-if="slotIndex < timeSlots.length - 1" class="time-slot-divider"/>
							</template>
						</div>
						<div class="form-tip">
							<el-icon>
								<warning/>
							</el-icon>
							<span>补卡时间必须在有效签到时间段内（早上 08:00-11:00、下午 14:00-17:00、晚上 19:00-22:00），且不能晚于当前时间</span>
						</div>
					</div>
				</div>
			</div>

			<div class="makeup-footer">
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
						<clock/>
					</el-icon>
					{{ makeupLoading ? '处理中...' : '确认补卡' }}
				</el-button>
			</div>
		</el-dialog>

		<!-- 4.8 修改积分弹窗 -->
		<el-dialog
			v-if="pointsDialogVisible"
			v-model="pointsDialogVisible"
			title="修改积分"
			width="600px"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:append-to-body="true"
			:teleported="true"
			modal-class="points-dialog-overlay"
			class="points-dialog"
			@close="handlePointsDialogClose"
		>
			<div v-if="pointsSelectedStudent" class="points-student-info">
				<div class="student-info-card">
					<div class="student-avatar-card">
						{{ pointsSelectedStudent.name.charAt(0) }}
					</div>
					<div class="student-info-details">
						<div class="student-name-card">{{ pointsSelectedStudent.name }}</div>
						<div class="student-id-card">学号：{{ pointsSelectedStudent.studentId }}</div>
						<div class="student-major-card">{{ pointsSelectedStudent.major }} |
							{{ pointsSelectedStudent.grade }}年级
						</div>
					</div>
				</div>
			</div>
			<el-form
				ref="pointsFormRef"
				:model="pointsForm"
				:rules="pointsFormRules"
				label-width="100px"
				class="points-form"
			>
				<el-form-item label="积分变动" prop="changePoints">
					<el-input-number
						v-model="pointsForm.changePoints"
						:min="-9999"
						:max="9999"
						placeholder="请输入积分变动值（正数为加分，负数为扣分）"
						style="width: 100%"
					/>
					<div class="form-tip">
						<el-icon>
							<warning/>
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
				<div class="dialog-footer">
					<el-button :disabled="pointsLoading" @click="cancelPoints">取消</el-button>
					<el-button type="primary" :loading="pointsLoading" @click="confirmPoints">
						确认修改
					</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 4.9 改分记录查看弹窗 -->
		<el-dialog
			v-if="scoreChangeRecordsDialogVisible"
			v-model="scoreChangeRecordsDialogVisible"
			:title="`${currentScoreChangeRecordsStudent?.name || '学生'} 的改分记录`"
			width="900px"
			:close-on-click-modal="false"
			:destroy-on-close="true"
			:append-to-body="true"
			:teleported="true"
			modal-class="score-change-records-overlay"
			class="score-change-records-dialog"
			@close="closeScoreChangeRecordsDialog"
		>
			<div class="student-info-header">
				<div class="student-avatar-large">
					{{ currentScoreChangeRecordsStudent?.name?.charAt(0) || '学' }}
				</div>
				<div class="student-info">
					<h3>{{ currentScoreChangeRecordsStudent?.name || '学生' }}</h3>
					<p>学号：{{ currentScoreChangeRecordsStudent?.studentId }}</p>
					<p v-if="currentScoreChangeRecordsStudent?.major && currentScoreChangeRecordsStudent?.grade">
						专业：{{ currentScoreChangeRecordsStudent.major }} |
						年级：{{ currentScoreChangeRecordsStudent.grade }}年级
					</p>
				</div>
				<div class="attendance-summary">
					<div class="summary-item">
						<span class="summary-label">总记录数</span>
						<span class="summary-value">{{ scoreChangeRecords.length }}</span>
					</div>
					<div class="summary-item">
						<span class="summary-label">总调整分数</span>
						<span class="summary-value"
							  :class="{ positive: totalScoreChangePoints >= 0, negative: totalScoreChangePoints < 0 }">
							{{ totalScoreChangePoints > 0 ? `+${totalScoreChangePoints}` : totalScoreChangePoints }}
						</span>
					</div>
				</div>
			</div>

			<!-- 加载状态 -->
			<div v-if="scoreChangeRecordsLoading" class="records-loading">
				<el-icon class="is-loading">
					<loading/>
				</el-icon>
				<span>加载中...</span>
			</div>
			<!-- 无记录状态 -->
			<div v-else-if="scoreChangeRecords.length === 0" class="records-empty">
				<el-icon>
					<box/>
				</el-icon>
				<span>暂无改分记录</span>
			</div>
			<!-- 记录列表 -->
			<div v-else class="score-change-records-container">
				<div class="records-grid">
					<div
						v-for="(record, index) in sortedScoreChangeRecords"
						:key="index"
						class="record-card"
					>
						<div class="record-header">
							<span class="record-time">{{ formatTime(record.createTime) }}</span>
							<span class="record-points-badge"
								  :class="{ positive: record.adjustPoints >= 0, negative: record.adjustPoints < 0 }">
								{{ record.adjustPoints > 0 ? `+${record.adjustPoints}` : record.adjustPoints }}
							</span>
						</div>
						<div class="record-reason-text">{{ record.adjustReason }}</div>
					</div>
				</div>
			</div>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="closeScoreChangeRecordsDialog">关闭</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<style scoped src="./css/desktop/AdminPageDesktop.css"></style>
<style scoped src="./css/desktop/AdminPage-identify_authentication_page.css"></style>

