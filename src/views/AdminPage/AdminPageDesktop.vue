<script setup>
/**
 * 超级管理员控制台组件
 * 功能描述：AI坊学生管理系统的超级管理员核心操作界面，提供学生信息管理、考勤记录查看、补卡操作、积分修改等核心功能
 * 技术栈：Vue3 + Script Setup + Element Plus + 组合式API
 */

// ===================== 依赖导入区 =====================
// Element Plus 核心组件导入
import {
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
	ElTag,           // 标签
	ElTooltip,       // 提示框
	// 分页组件
	ElCalendar       // 日历组件
} from 'element-plus'
import {useRouter} from 'vue-router'

const router = useRouter()

// Vue 核心组合式API
import {onMounted, nextTick, ref} from 'vue'

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
	SwitchButton,    // 切换按钮图标
	Edit,            // 编辑图标
	// 填充用户图标
	Clock,           // 时钟图标
	Warning,         // 警告图标
	Document,        // 文档图标
	Loading,         // 加载图标
	Box,             // 盒子图标
	Lock, House,
	Key, Refresh,
} from '@element-plus/icons-vue'
import {
	authenticate, isAuthenticating, superAdminAvatarUrl,
	toShowStudentInfos, searchStudents, refreshData, resetPageState, getAdminName
} from './ts/AdminPage.ts'


// ===================== 业务变量定义区 =====================
// 在现有的导入语句下添加
import LoadingMask from '../../components/LoadingMask.vue'



import {pageState} from './ts/AdminPage.ts'
import {toggleTheme} from "./ts/AdminPage.ts";
import {logout} from "./ts/AdminPage.ts";
import {specialPassword} from "./ts/AdminPage.ts";
import {searchKeywords} from './ts/AdminPage.ts'

// 导入 ChangeLevelForm 组件
import ChangeLevelForm from './forms/desktop/ChangeLevelForm.vue'


// 定义响应式变量
const changeLevelDialogVisible = ref(false)
const selectedStudent = ref(null)

// 打开修改身份弹窗
const openChangeLevelDialog = (student) => {
	selectedStudent.value = student
	changeLevelDialogVisible.value = true
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

	// 重置数据为初始状态
	resetPageState()


	await nextTick()
})

</script>

<template>
	<!-- 加载蒙版 -->
	<LoadingMask/>
	<!-- 1. 身份验证界面：未认证时显示 -->
	<div v-if="pageState === 'auth'">
		<!-- 身份认证页面顶部 -->
		<div class="identify-authentication-page-header">
			<div class="identify-authentication-page-header-left">
				<!-- 该按钮前往首页 -->
				<el-button
					type="primary"
					:icon="House"
					circle
					size="large"
					@click="router.push('/')"
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
				v-if="superAdminAvatarUrl"
				v-lazy="superAdminAvatarUrl"
				alt="Admin Avatar"
			/>
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

	<!-- 2. 管理控制台主界面：已认证且数据加载完成时显示 -->
	<div v-else class="main-page">
		<!-- 3.1 头部区域：logo + 标题 + 退出按钮 -->
		<div class="main-page-header">
			<div class="main-page-header-left">
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊学生管理系统"
					title="切换主题模式"
					@click="toggleTheme"/>
				<div class="main-page-header-left-title">
					<h1>超级管理员控制台</h1>
					<p>Super Admin Console</p>
				</div>
			</div>
			<div class="main-page-header-right">
				<el-button
					type="danger"
					size="large"
					@click="logout">
					<el-icon>
						<switch-button/>
					</el-icon>
					退出登录
				</el-button>
			</div>
		</div>


		<!-- 等级标签页：按学生等级分类展示 -->
		<div class="main-page-buttons-and-search">
			<div class="main-page-buttons-and-search-search">
				<el-input
					v-model="searchKeywords"
					placeholder="搜索学生信息,支持多词搜索(空格隔开)"
					clearable
					@blur="searchStudents"
				>
					<template #prefix>
						<el-icon>
							<search/>
						</el-icon>
					</template>
				</el-input>

				<!-- 刷新按钮 -->
				<el-button
					type="success"
					size="default"
					@click="refreshData"
				>
					<el-icon>
						<refresh/>
					</el-icon>
					刷新数据
				</el-button>
			</div>

		</div>
		<div class="student-cards">
			<div
				v-for="studentInfo in toShowStudentInfos"
				:key="studentInfo.id"
				class="student-cards-item"
			>
				<!-- 学生卡片头部 -->
				<div class="student-cards-item-header">
					<img
						v-if="studentInfo.avatarUrl"
						v-lazy="studentInfo.avatarUrl"
						alt="头像"
					/>
					<div class="student-cards-item-header-student-info">
						<div>{{ studentInfo.id }}</div>
						<div>{{ studentInfo.name }}</div>
						<div>{{ studentInfo.studentId }}</div>
					</div>

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
				<!-- 学生卡片学生信息 -->
				<div class="student-cards-item-student-info">
					<span>年级：{{ studentInfo.grade }}年级</span>
					<span>专业：{{ studentInfo.major }}</span>
					<span>班级：{{ studentInfo.classNum }}班</span>
					<span>性别：{{ studentInfo.gender }}</span>
					<span>手机：{{ studentInfo.phoneNumber }}</span>
					<span>身份：
					<el-button
						type="primary"
						size="small"
						@click="openChangeLevelDialog(studentInfo)"
					>
						<el-icon>
							<user/>
						</el-icon>
						{{ studentInfo.levelName }}
					</el-button>
					</span>

					<span v-if = "studentInfo.level !== 3">所属管理员：<el-button
						type="primary"
						size="small"
					>
						  <el-icon>
							<user/>
						  </el-icon>
						 {{ getAdminName(studentInfo.adminId) }}
						</el-button>
					</span>
				</div>
				<div class="student-cards-item-buttons">
					<div>
						<span>考勤</span>
						<div>
							<!-- 考勤记录按钮 -->
							<el-button
								type="success"
							>
								<el-icon>
									<calendar/>
								</el-icon>
								考勤记录
							</el-button>
							<!-- 补卡按钮 -->
							<el-button
								type="warning"
							>
								<el-icon>
									<clock/>
								</el-icon>
								补卡
							</el-button>
							<!-- 热力图按钮 -->
							<el-button
								type="info"
							>
								<el-icon>
									<trend-charts/>
								</el-icon>
								热力图
							</el-button>
							<!-- 趋势图按钮 -->
							<el-button
								type="primary"
							>
								<el-icon>
									<trend-charts/>
								</el-icon>
								趋势图
							</el-button>
						</div>
					</div>
					<div>
						<span>积分</span>
						<div>
							<!-- 修改积分按钮 -->
							<el-button
								type="success"
							>
								<el-icon>
									<edit/>
								</el-icon>
								修改积分
							</el-button>
							<!-- 改分记录按钮 -->
							<el-button
								type="info"
							>
								<el-icon>
									<document/>
								</el-icon>
								改分记录
							</el-button>
						</div>
					</div>
					<div>
						<span>个人信息</span>
						<div>
							<el-button
								type="primary"
							>
								<el-icon>
									<edit/>
								</el-icon>
								编辑
							</el-button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- ChangeLevelForm 组件 -->
	<ChangeLevelForm
		v-model="changeLevelDialogVisible"
		:student="selectedStudent"
	/>
</template>

<style scoped src="./css/desktop/AdminPageDesktop.css"></style>
<style scoped src="./css/desktop/AdminPage-identify_authentication_page.css"></style>
<style scoped src="./css/desktop/AdminPage-main_page_header.css"></style>
<style scoped src="./css/desktop/AdminPage-main_page_buttons_and_search.css"></style>
<style scoped src="./css/desktop/AdminPage-main_page_student_cards.css"></style>

