<script setup>
/**
 * 超级管理员控制台组件
 * 功能描述：AI坊学生管理系统的超级管理员核心操作界面，提供学生信息管理、考勤记录查看、补卡操作、积分修改等核心功能
 * 技术栈：Vue3 + Script Setup + Element Plus + 组合式API
 */

// ===================== 第一部分：依赖导入区 =====================

// 1.1 Vue 核心依赖
import { useRouter } from 'vue-router'
import { onMounted, nextTick, ref } from 'vue'

// 1.2 Element Plus 核心组件
import { ElIcon, ElInput, ElButton } from 'element-plus'

// 1.3 Element Plus 图标组件
import {
	User,            // 用户图标
	Calendar,        // 日历图标
	TrendCharts,     // 趋势图图标
	Search,          // 搜索图标
	SwitchButton,    // 切换按钮图标
	Edit,            // 编辑图标
	Clock,           // 时钟图标
	Document,        // 文档图标
	Lock,            // 锁图标
	House,           // 房屋图标
	Key,             // 钥匙图标
	Refresh,         // 刷新图标
	Download,        // 下载图标
	ArrowRight,      // 右箭头图标
	Warning,         // 警告图标
} from '@element-plus/icons-vue'

// 1.4 Element Plus 样式导入（按需导入，减少包体积）
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

// 1.5 业务逻辑模块导入
import {
	authenticate,                      // 身份验证函数
	isAuthenticating,                  // 验证状态
	superAdminAvatarUrl,               // 管理员头像URL
	toShowStudentInfos,                // 待展示的学生列表
	searchStudents,                    // 搜索学生函数
	refreshData,                      // 刷新数据函数
	resetPageState,                   // 重置页面状态
	getAdminName,                     // 获取管理员名称
	pageState,                        // 页面状态
	toggleTheme,                      // 切换主题函数
	logout,                           // 退出登录函数
	specialPassword,                  // 特殊密码
	searchKeywords,                   // 搜索关键词
} from './ts/AdminPage.ts'

// 1.6 业务组件导入
// 全局组件
import LoadingMask from '../../components/LoadingMask.vue'

// 表单弹窗组件
import HeatmapChartForm from './forms/mobile/HeatmapChartForm.vue'              // 考勤热力图组件
import AttendanceTrendChartForm from './forms/mobile/AttendanceTrendChartForm.vue' // 考勤趋势图组件
import ChangeLevelForm from './forms/mobile/ChangeLevelForm.vue'                  // 修改学生身份组件
import ChangeAdminForm from './forms/mobile/ChangeAdminForm.vue'                  // 修改所属管理员组件
import ViewAttendanceRecordsForm from './forms/mobile/ViewAttendanceRecordsForm.vue' // 查看考勤记录组件
import MakeupAttendanceForm from './forms/mobile/MakeupAttendanceForm.vue'          // 补卡组件
import CreatePointsRecordForm from './forms/mobile/CreatePointsRecordForm.vue'      // 创建积分记录组件
import ViewPointsRecordsForm from './forms/mobile/ViewPointsRecordsForm.vue'        // 查看改分记录组件
import UpdateStudentInfoForm from './forms/mobile/UpdateStudentInfoForm.vue'      // 修改学生个人信息组件
import DataDownloadForm from './forms/mobile/DataDownloadForm.vue'                // 数据下载表单组件

// ===================== 第二部分：路由实例 =====================
const router = useRouter()

// ===================== 第三部分：响应式状态定义区 =====================

// 3.1 弹窗显示状态
/**
 * 数据下载表单弹窗显示状态
 * @type {Ref<boolean>}
 */
const dataDownloadDialogVisible = ref(false)

/**
 * 是否显示数据下载按钮
 * @type {Ref<boolean>}
 */
const showDownloadButton = ref(false)

/**
 * 修改学生身份弹窗显示状态
 * @type {Ref<boolean>}
 */
const changeLevelDialogVisible = ref(false)

/**
 * 修改所属管理员弹窗显示状态
 * @type {Ref<boolean>}
 */
const changeAdminDialogVisible = ref(false)

/**
 * 查看考勤记录弹窗显示状态
 * @type {Ref<boolean>}
 */
const attendanceDialogVisible = ref(false)

/**
 * 补卡弹窗显示状态
 * @type {Ref<boolean>}
 */
const makeupAttendanceDialogVisible = ref(false)

/**
 * 创建积分记录弹窗显示状态
 * @type {Ref<boolean>}
 */
const createPointsRecordDialogVisible = ref(false)

/**
 * 查看改分记录弹窗显示状态
 * @type {Ref<boolean>}
 */
const viewPointsRecordsDialogVisible = ref(false)

/**
 * 修改学生个人信息弹窗显示状态
 * @type {Ref<boolean>}
 */
const updateStudentInfoDialogVisible = ref(false)

// 3.2 选中学生状态
/**
 * 当前选中的学生对象（用于修改身份）
 * @type {Ref<Object|null>}
 */
const selectedStudent = ref(null)

/**
 * 当前选中的学生对象（用于修改管理员）
 * @type {Ref<Object|null>}
 */
const selectedStudentForAdminChange = ref(null)

/**
 * 当前选中的学生对象（用于查看考勤记录）
 * @type {Ref<Object|null>}
 */
const selectedStudentForAttendance = ref(null)

/**
 * 当前选中的学生对象（用于补卡操作）
 * @type {Ref<Object|null>}
 */
const selectedStudentForMakeup = ref(null)

/**
 * 当前选中的学生对象（用于创建积分记录操作）
 * @type {Ref<Object|null>}
 */
const selectedStudentForPointsRecord = ref(null)

/**
 * 当前选中的学生对象（用于查看改分记录操作）
 * @type {Ref<Object|null>}
 */
const selectedStudentForViewPointsRecords = ref(null)

/**
 * 当前选中的学生对象（用于修改个人信息）
 * @type {Ref<Object|null>}
 */
const selectedStudentForUpdateInfo = ref(null)

// 3.3 子组件引用
/**
 * 热力图组件引用，用于调用组件方法
 * @type {Ref<Object|null>}
 */
const heatmapChartFormRef = ref(null)

/**
 * 趋势图组件引用，用于调用组件方法
 * @type {Ref<Object|null>}
 */
const trendChartFormRef = ref(null)

// ===================== 第四部分：弹窗操作函数区 =====================

/**
 * 打开修改学生身份弹窗
 * @param {Object} student - 学生信息对象
 * @description 选中学生后显示修改身份对话框
 */
const openChangeLevelDialog = (student) => {
	selectedStudent.value = student
	changeLevelDialogVisible.value = true
}

/**
 * 打开修改所属管理员弹窗
 * @param {Object} student - 学生信息对象
 * @description 选中学生后显示修改管理员对话框
 */
const openChangeAdminDialog = (student) => {
	selectedStudentForAdminChange.value = student
	changeAdminDialogVisible.value = true
}

/**
 * 打开查看考勤记录弹窗
 * @param {Object} student - 学生信息对象
 * @description 选中学生后显示考勤记录对话框
 */
const openAttendanceDialog = (student) => {
	selectedStudentForAttendance.value = student
	attendanceDialogVisible.value = true
}

/**
 * 打开补卡操作弹窗
 * @param {Object} student - 学生信息对象
 * @description 选中学生后显示补卡对话框
 */
const openMakeupAttendanceDialog = (student) => {
	selectedStudentForMakeup.value = student
	makeupAttendanceDialogVisible.value = true
}

/**
 * 打开创建积分记录弹窗
 * @param {Object} student - 学生信息对象
 * @description 选中学生后显示创建积分记录对话框
 */
const openCreatePointsRecordDialog = (student) => {
	selectedStudentForPointsRecord.value = student
	createPointsRecordDialogVisible.value = true
}

/**
 * 打开查看改分记录弹窗
 * @param {Object} student - 学生信息对象
 * @description 选中学生后显示改分记录对话框
 */
const openViewPointsRecordsDialog = (student) => {
	selectedStudentForViewPointsRecords.value = student
	viewPointsRecordsDialogVisible.value = true
}

/**
 * 打开修改学生个人信息弹窗
 * @param {Object} student - 学生信息对象
 * @description 选中学生后显示修改个人信息对话框
 */
const openUpdateStudentInfoDialog = (student) => {
	selectedStudentForUpdateInfo.value = student
	updateStudentInfoDialogVisible.value = true
}

/**
 * 打开考勤热力图弹窗
 * @param {Object} student - 学生信息对象
 * @description 调用热力图子组件的打开方法，展示学生签到热力图
 */
const openHeatmapDialog = (student) => {
	heatmapChartFormRef.value.openHeatmapDialog(student)
}

/**
 * 打开考勤趋势图弹窗
 * @param {Object} student - 学生信息对象
 * @description 调用趋势图子组件的打开方法，展示学生签到累计趋势
 */
const openTrendChartDialog = (student) => {
	trendChartFormRef.value.openTrendChartDialog(student)
}

// ===================== 第五部分：生命周期钩子区 =====================

/**
 * 组件挂载完成钩子
 * 执行逻辑：
 * 1. 设置页面标题
 * 2. 重置页面状态为初始值
 * 3. 等待 DOM 更新完成
 */
onMounted(async () => {
	// 设置页面标题
	document.title = '超级管理员控制台 - AI坊学生管理系统'

	// 重置数据为初始状态
	resetPageState()

	// 等待 DOM 更新
	await nextTick()
})
</script>

<template>
	<!-- ===================== 模板区域 ===================== -->

	<!-- 加载蒙版：全局加载状态提示 -->
	<LoadingMask/>

	<!-- ===================== 1. 身份验证界面 ===================== -->
	<!-- 显示条件：未通过身份验证时显示 -->
	<div v-if="pageState === 'auth'">
		<!-- 身份认证页面顶部：包含返回按钮、系统logo和锁图标 -->
		<div class="identify-authentication-page-header">
			<!-- 左侧区域：返回按钮和系统logo -->
			<div class="identify-authentication-page-header-left">
				<!-- 返回首页按钮 -->
				<el-button
					type="primary"
					:icon="House"
					circle
					size="large"
					@click="router.push('/')"
				/>
				<!-- 系统logo（点击可切换主题） -->
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊学生管理系统"
					title="切换主题模式"
					@click="toggleTheme"
				/>
			</div>

			<!-- 页面标题 -->
			<h2 class="identify-authentication-page-header-title">超级管理员身份验证</h2>

			<!-- 右侧区域：安全锁图标 -->
			<div class="identify-authentication-page-header-right">
				<el-icon class="identify-authentication-page-header-right-icon">
					<Lock/>
				</el-icon>
			</div>
		</div>

		<!-- 身份认证页面主体：包含头像、密码输入和验证按钮 -->
		<div class="identify-authentication-page-body">
			<!-- 管理员头像 -->
			<img
				v-if="superAdminAvatarUrl"
				v-lazy="superAdminAvatarUrl"
				alt="Admin Avatar"
			/>

			<!-- 密码输入框：支持回车提交和密码显示切换 -->
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
						<Lock/>
					</el-icon>
				</template>
			</el-input>

			<!-- 身份验证按钮：加载时显示loading状态 -->
			<el-button
				type="primary"
				size="large"
				:loading="isAuthenticating"
				@click="authenticate"
			>
				<el-icon>
					<Key/>
				</el-icon>
				<span>验证身份</span>
			</el-button>
		</div>
	</div>

	<!-- ===================== 2. 管理控制台主界面 ===================== -->
	<!-- 显示条件：已通过身份验证时显示 -->
	<div v-else class="main-page">
		<!-- 2.1 页面头部：logo、标题和退出按钮 -->
		<div class="main-page-header">
			<!-- 左侧区域：系统logo和控制台标题 -->
			<div class="main-page-header-left">
				<!-- 系统logo（点击可切换主题） -->
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊学生管理系统"
					title="切换主题模式"
					@click="toggleTheme"
				/>
				<!-- 控制台标题区域 -->
				<div class="main-page-header-left-title">
					<h1>超级管理员控制台</h1>
					<p>Super Admin Console</p>
				</div>
			</div>

			<!-- 右侧区域：退出登录按钮 -->
			<div class="main-page-header-right">
				<el-button
					v-if="!showDownloadButton"
					type="danger"
					size="large"
					@click="logout"
				>
					<el-icon>
						<SwitchButton/>
					</el-icon>
					退出登录
				</el-button>
				<el-button
					v-if="!showDownloadButton"
					type="info"
					size="large"
					@click="showDownloadButton = true"
					class="arrow-button"
				>
					<el-icon>
						<ArrowRight/>
					</el-icon>
				</el-button>
				<el-button
					v-if="showDownloadButton"
					type="primary"
					size="large"
					@click="dataDownloadDialogVisible = true"
				>
					<el-icon>
						<Download/>
					</el-icon>
					导出数据
				</el-button>
				<el-button
					v-if="showDownloadButton"
					type="info"
					size="large"
					@click="showDownloadButton = false"
					class="arrow-button"
				>
					<el-icon>
						<ArrowRight style="transform: rotate(180deg)"/>
					</el-icon>
				</el-button>
			</div>
		</div>

		<!-- 2.2 搜索和刷新功能区域 -->
		<div class="main-page-buttons-and-search">
			<!-- 搜索框和刷新按钮容器 -->
			<div class="main-page-buttons-and-search-search">
				<!-- 多关键词搜索框：支持按学号、姓名等多维度搜索 -->
				<el-input
					v-model="searchKeywords"
					placeholder="搜索学生信息，多词空格隔开"
					clearable
					@blur="searchStudents"
				>
					<template #prefix>
						<el-icon>
							<Search/>
						</el-icon>
					</template>
				</el-input>

				<!-- 刷新数据按钮 -->
				<el-button
					type="success"
					size="default"
					@click="refreshData"
				>
					<el-icon>
						<Refresh/>
					</el-icon>
					刷新数据
				</el-button>
			</div>
		</div>

		<!-- 2.3 学生卡片列表区域 -->
		<div class="student-cards">
			<!-- 遍历学生列表，每个学生生成一张卡片 -->
			<div
				v-for="studentInfo in toShowStudentInfos"
				:key="studentInfo.id"
				class="student-cards-item"
			>
				<!-- 学生卡片头部：头像、基本信息和积分展示 -->
				<div class="student-cards-item-header">
					<!-- 学生头像 -->
					<img
						v-if="studentInfo.avatarUrl"
						v-lazy="studentInfo.avatarUrl"
						alt="头像"
					/>

					<!-- 学生基本信息：ID、姓名、学号 -->
					<div class="student-cards-item-header-student-info">
						<div>{{ studentInfo.id }}</div>
						<div>{{ studentInfo.name }}</div>
						<div>{{ studentInfo.studentId }}</div>
					</div>

					<!-- 积分信息：总积分、签到积分、活动积分 -->
					<div class="student-cards-item-header-points">
						<div>
							<span>总积分: {{
									Math.round(studentInfo.attendanceCount * 0.64) + studentInfo.totalPoints
								}}</span>
						</div>
						<div>
							<span>签到: {{
									Math.round(studentInfo.attendanceCount * 0.64)
								}} ({{
									studentInfo.attendanceCount
								}})</span>
							<span>&nbsp;&nbsp;活动: {{
									studentInfo.totalPoints
								}}</span>
						</div>
					</div>
				</div>

				<!-- 学生详细信息：年级、专业、班级、性别、手机、身份、所属管理员 -->
				<div class="student-cards-item-student-info">
					<span>年级：{{ studentInfo.grade }}年级</span>
					<span>学院：{{ studentInfo.college }}</span>
					<span>专业：{{ studentInfo.major }}</span>
					<span>班级：{{ studentInfo.classNum }}班</span>
					<span>性别：{{ studentInfo.gender }}</span>
					<span>手机：{{ studentInfo.phoneNumber }}</span>
					<!-- 学生身份：可点击修改 -->
					<span>身份：
						<el-button
							type="primary"
							size="small"
							@click="openChangeLevelDialog(studentInfo)"
						>
							<el-icon>
								<User/>
							</el-icon>
							{{ studentInfo.levelName }}
						</el-button>
					</span>
					<!-- 所属管理员：仅非超级管理员显示，可点击修改 -->
					<span v-if="studentInfo.level !== 3">
						所属管理员：
						<el-button
							type="primary"
							size="small"
							@click="openChangeAdminDialog(studentInfo)"
						>
							<el-icon>
								<User/>
							</el-icon>
							{{ getAdminName(studentInfo.adminId) }}
						</el-button>
					</span>
				</div>

				<!-- 学生卡片操作按钮区：考勤、积分、个人信息 -->
				<div class="student-cards-item-buttons">
					<!-- 考勤相关操作 -->
					<div>
						<span>考勤</span>
						<div>
							<!-- 查看考勤记录按钮 -->
							<el-button
								type="success"
								size="small"
								@click="openAttendanceDialog(studentInfo)"
							>
								<el-icon>
									<Calendar/>
								</el-icon>
								考勤记录
							</el-button>

							<!-- 补卡操作按钮 -->
							<el-button
								type="warning"
								size="small"
								@click="openMakeupAttendanceDialog(studentInfo)"
							>
								<el-icon>
									<Clock/>
								</el-icon>
								补卡
							</el-button>

							<!-- 查看热力图按钮 -->
							<el-button
								type="info"
								size="small"
								@click="openHeatmapDialog(studentInfo)"
							>
								<el-icon>
									<TrendCharts/>
								</el-icon>
								热力图
							</el-button>

							<!-- 查看趋势图按钮 -->
							<el-button
								type="primary"
								size="small"
								@click="openTrendChartDialog(studentInfo)"
							>
								<el-icon>
									<TrendCharts/>
								</el-icon>
								趋势图
							</el-button>
						</div>
					</div>

					<!-- 积分相关操作 -->
					<div>
						<span>积分</span>
						<div>
							<!-- 修改积分按钮 -->
							<el-button
								type="success"
								size="small"
								@click="openCreatePointsRecordDialog(studentInfo)"
							>
								<el-icon>
									<Edit/>
								</el-icon>
								修改积分
							</el-button>
							<!-- 查看改分记录按钮 -->
							<el-button
								type="info"
								size="small"
								@click="openViewPointsRecordsDialog(studentInfo)"
							>
								<el-icon>
									<Document/>
								</el-icon>
								改分记录
							</el-button>
						</div>
					</div>

					<!-- 个人信息操作 -->
					<div>
						<span>个人信息</span>
						<div>
							<!-- 编辑个人信息按钮 -->
							<el-button
								type="primary"
								size="small"
								@click="openUpdateStudentInfoDialog(studentInfo)"
							>
								<el-icon>
									<Edit/>
								</el-icon>
								编辑
							</el-button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- ===================== 3. 表单弹窗组件 ===================== -->

	<!-- 修改学生身份弹窗组件 -->
	<ChangeLevelForm
		v-model="changeLevelDialogVisible"
		:student="selectedStudent"
	/>

	<!-- 修改所属管理员弹窗组件 -->
	<ChangeAdminForm
		v-model="changeAdminDialogVisible"
		:student="selectedStudentForAdminChange"
	/>

	<!-- 查看考勤记录弹窗组件 -->
	<ViewAttendanceRecordsForm
		v-model="attendanceDialogVisible"
		:student="selectedStudentForAttendance"
	/>

	<!-- 补卡操作弹窗组件 -->
	<MakeupAttendanceForm
		v-model="makeupAttendanceDialogVisible"
		:student="selectedStudentForMakeup"
	/>

	<!-- 创建积分记录弹窗组件 -->
	<CreatePointsRecordForm
		v-model="createPointsRecordDialogVisible"
		:student="selectedStudentForPointsRecord"
	/>

	<!-- 查看改分记录弹窗组件 -->
	<ViewPointsRecordsForm
		v-model="viewPointsRecordsDialogVisible"
		:student="selectedStudentForViewPointsRecords"
	/>

	<!-- 修改学生个人信息弹窗组件 -->
	<UpdateStudentInfoForm
		v-model="updateStudentInfoDialogVisible"
		:student="selectedStudentForUpdateInfo"
		@success="refreshData"
	/>

	<!-- 考勤热力图弹窗组件 -->
	<HeatmapChartForm ref="heatmapChartFormRef" />

	<!-- 考勤趋势图弹窗组件 -->
	<AttendanceTrendChartForm ref="trendChartFormRef" />

	<!-- 数据下载表单弹窗组件 -->
	<DataDownloadForm v-model="dataDownloadDialogVisible" />
</template>

<!-- 样式文件导入：按模块分别导入 -->
<style scoped src="./css/mobile/AdminPageMobile.css"></style>
<style scoped src="./css/mobile/AdminPage-identify_authentication_page.css"></style>
<style scoped src="./css/mobile/AdminPage-main_page_header.css"></style>
<style scoped src="./css/mobile/AdminPage-main_page_buttons_and_search.css"></style>
<style scoped src="./css/mobile/AdminPage-main_page_student_cards.css"></style>

					</el-button>
				</div>
			</template>
		</el-dialog>

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
				<div v-if="todayAttendanceRecords.length === 0" class="no-records-mobile">
					<el-icon class="no-records-icon-mobile">
						<calendar/>
					</el-icon>
					<p>今日暂无签到记录</p>
				</div>
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
									<clock/>
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

			<div class="attendance-records-container-mobile">
				<el-calendar
					v-model="calendarValue"
					:locale="zhCn"
					class="attendance-calendar-mobile fullcalendar-mobile">
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
					<div v-if="getDateAttendanceTimes(selectedDate).length === 0" class="no-attendance-mobile">
						该日期无签到记录
					</div>
					<div v-else>
						<div
							v-for="(time, index) in getDateAttendanceTimes(selectedDate)"
							:key="index"
							class="attendance-time-item-mobile">
							<el-icon class="time-icon-mobile">
								<clock/>
							</el-icon>
							<span class="time-text-mobile">{{ formatAttendanceTime(time) }}</span>
							<span class="time-slot-label-mobile">{{ getTimeSlotLabel(time) }}</span>
						</div>
					</div>
				</div>
			</div>
		</el-dialog>

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
			<div class="makeup-header-mobile">
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

			<div class="makeup-content-mobile">
				<div class="student-info-card">
					<div class="student-avatar">
						<el-icon size="36">
							<user/>
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

				<div v-if="makeupStep === 'date'" class="makeup-step-content-mobile">
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
										<calendar/>
									</el-icon>
								</template>
							</el-date-picker>
						</el-form-item>
					</el-form>
				</div>

				<div v-if="makeupStep === 'hour'" class="makeup-step-content-mobile">
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

			<div class="makeup-footer-mobile">
				<el-button
					class="cancel-btn"
					size="large"
					@click="cancelMakeup"
				>
					取消
				</el-button>
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
				<div class="dialog-footer-mobile">
					<el-button :disabled="pointsLoading" @click="cancelPoints">取消</el-button>
					<el-button type="primary" :loading="pointsLoading" @click="confirmPoints">
						确认修改
					</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 改分记录查看弹窗 -->
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

			<div v-if="scoreChangeRecordsLoading" class="records-loading-mobile">
				<el-icon class="is-loading">
					<loading/>
				</el-icon>
				<span>加载中...</span>
			</div>
			<div v-else-if="scoreChangeRecords.length === 0" class="records-empty-mobile">
				<el-icon>
					<box/>
				</el-icon>
				<span>暂无改分记录</span>
			</div>
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
