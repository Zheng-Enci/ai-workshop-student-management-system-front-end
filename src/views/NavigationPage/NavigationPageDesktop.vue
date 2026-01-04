<script setup>
import {
	Check,
	User,
	DataAnalysis,
	SwitchButton,
	Calendar,
	Star,
	UserFilled,
	House,
	TrendCharts,
	Trophy,
	Coin,
	Document
} from '@element-plus/icons-vue'
// 导入 Element Plus 组件
import { ElMessage, ElButton, ElIcon } from 'element-plus'
// 导入 Vue 核心 API
import { ref, onMounted, computed } from 'vue'
// 导入 Vue Router
import { useRouter } from 'vue-router'

// 导入 API 方法
import { getMyAttendanceCount } from '@/api/attendance'
import { getTotalPointsByStudentInfoId } from '@/api/points'
import { getStudentLevel, getStudentDatabaseTableId, getAvatarUrl } from '@/api/student'
// 导入 Pinia 仓库
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
// 导入配置文件
import NavigationPageConfig from '@/views/NavigationPage/js/NavigationPageConfig'

// 导入 Element Plus 基础样式
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-popper.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'

// 初始化路由
const router = useRouter()

// 初始化 Pinia 仓库
const userStore = useUserStore()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore

// 响应式数据定义
const attendanceCount = ref(null)
const signInPoints = ref(null)
const activityPoints = ref(null)
const totalPoints = ref(null)
const pointsLoading = ref(false)
const avatarUrl = ref(null)
const hasAvatar = ref(false)
const avatarLoading = ref(false)
const avatarTipShown = ref(false)

// 计算属性：判断是否为管理员
const isAdmin = computed(() => userStore.studentLevel?.levelCode === 3)

// 方法：根据等级编码获取等级名称
const getLevelName = levelCode => {
	const levelMap = {
		0: '社团成员',
		1: '普通成员',
		2: '核心成员',
		3: '管理员'
	}
	return levelMap[levelCode] || '未知等级'
}

// 方法：根据等级编码获取等级样式类
const getLevelClass = levelCode => {
	const levelClassMap = {
		0: 'club-member',
		1: 'normal-member',
		2: 'core-member',
		3: 'admin'
	}
	return levelClassMap[levelCode] || 'club-member'
}

// 路由跳转方法
const goToAttendance = () => {
	router.push('/attendance')
}

const goToHome = () => {
	router.push('/')
}

const showProfile = () => {
	router.push('/profile')
}

const handleAvatarClick = () => {
	router.push('/profile/desktop')
}

const goToDashboard = () => {
	router.push('/dashboard')
}

const goToAttendanceAnalysis = () => {
	router.push('/attendance-analysis')
}

const goToPointsDashboard = () => {
	router.push('/points-dashboard')
}

const goToAllMembers = () => {
	router.push('/all-members')
}

const goToScoreChangeRecords = () => {
	router.push('/score-change-records')
}

const goToAdmin = () => {
	router.push('/student-manager')
}

// 加载签到次数
const loadAttendanceCount = async () => {
	try {
		const token = localStorage.getItem('token')
		if (!token) { return }

		const response = await getMyAttendanceCount(token)
		if (response.code === 200) {
			attendanceCount.value = response.data.count
			// 计算签到积分：签到次数 * 0.64（四舍五入）
			signInPoints.value = Math.round(response.data.count * 0.64)
		}
	} catch (error) {
		if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
			localStorage.removeItem('token')
			localStorage.removeItem('userInfo')
			router.push('/login')
		}
	}
}

// 加载积分数据
const loadPoints = async () => {
	try {
		pointsLoading.value = true
		const token = localStorage.getItem('token')

		if (!token) {
			pointsLoading.value = false
			return
		}

		// 并行请求签到数据和学生ID数据
		const [attendanceResponse, studentIdResponse] = await Promise.all([
			getMyAttendanceCount(token).catch(() => ({ code: 0, data: { count: 0 } })),
			getStudentDatabaseTableId(token).catch(() => ({ code: 0, data: null }))
		])

		// 计算签到积分
		if (attendanceResponse.code === 200) {
			signInPoints.value = Math.round(attendanceResponse.data.count * 0.64)
		} else {
			signInPoints.value = 0
		}

		// 获取活动积分
		if (studentIdResponse.code === 200 && studentIdResponse.data) {
			const activityResponse = await getTotalPointsByStudentInfoId(
				studentIdResponse.data
			).catch(() => ({ code: 0, data: 0 }))
			if (activityResponse.code === 200) {
				activityPoints.value = activityResponse.data || 0
			} else {
				activityPoints.value = 0
			}
		} else {
			activityPoints.value = 0
		}

		// 计算总积分
		totalPoints.value = (signInPoints.value || 0) + (activityPoints.value || 0)
	} catch (error) {
		if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
			localStorage.removeItem('token')
			localStorage.removeItem('userInfo')
			router.push('/login')
		} else {
			// 出错时默认赋值为0，避免显示null
			signInPoints.value = 0
			activityPoints.value = 0
			totalPoints.value = 0
		}
	} finally {
		pointsLoading.value = false
	}
}

// 加载学生等级
const loadStudentLevel = async () => {
	try {
		if (!userStore.userInfo?.studentId) { return }

		const response = await getStudentLevel(userStore.userInfo.studentId)
		if (response.code === 200) {
			userStore.setStudentLevel(response.data)
		}
	} catch (error) {
		return
	}
}

// 显示默认头像并提示
const showDefaultAvatar = () => {
	hasAvatar.value = false
	avatarUrl.value = null

	// 显示提示消息（只显示一次）
	if (!avatarTipShown.value) {
		ElMessage.info({
			message: '你还没有上传头像，点击头像前往个人信息页面上传',
			duration: 4000,
			showClose: true
		})
		avatarTipShown.value = true
	}
}

// 加载用户头像
const loadUserAvatar = async () => {
	try {
		avatarLoading.value = true
		const token = localStorage.getItem('token')

		if (!token) {
			showDefaultAvatar()
			avatarLoading.value = false
			return
		}

		// 获取学生数据库ID
		const idResponse = await getStudentDatabaseTableId(token)
		if (idResponse.code !== 200 || !idResponse.data) {
			showDefaultAvatar()
			avatarLoading.value = false
			return
		}

		const studentInfoId = idResponse.data
		const avatarUrlString = getAvatarUrl(
			studentInfoId,
			NavigationPageConfig.AVATAR_SIZE * 2
		)

		if (!avatarUrlString) {
			showDefaultAvatar()
			avatarLoading.value = false
			return
		}

		// 使用fetch验证头像是否存在（更可靠的方式）
		try {
			const response = await fetch(avatarUrlString, { method: 'GET' })
			if (response.ok) {
				const contentType = response.headers.get('content-type')
				// 检查响应是否为图片类型
				if (contentType && contentType.startsWith('image/')) {
					// 头像存在，使用Image对象加载
					const img = new Image()
					img.onload = () => {
						avatarUrl.value = avatarUrlString
						hasAvatar.value = true
						avatarLoading.value = false
					}
					img.onerror = () => {
						showDefaultAvatar()
						avatarLoading.value = false
					}
					img.src = avatarUrlString
				} else {
					// 返回的不是图片（可能是JSON错误信息），头像不存在
					showDefaultAvatar()
					avatarLoading.value = false
				}
			} else {
				// 响应状态码不是200，头像不存在
				showDefaultAvatar()
				avatarLoading.value = false
			}
		} catch (fetchError) {
			// fetch失败（网络错误或CORS问题），使用Image对象作为降级方案
			const img = new Image()
			img.onload = () => {
				avatarUrl.value = avatarUrlString
				hasAvatar.value = true
				avatarLoading.value = false
			}
			img.onerror = () => {
				showDefaultAvatar()
				avatarLoading.value = false
			}
			img.src = avatarUrlString
		}
	} catch (error) {
		if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
			localStorage.removeItem('token')
			localStorage.removeItem('userInfo')
			router.push('/login')
		} else {
			showDefaultAvatar()
		}
		avatarLoading.value = false
	}
}

// 退出登录处理
const handleLogout = () => {
	userStore.logout()
	ElMessage.success('已退出登录')
	router.push('/login')
}

// 挂载后加载数据
onMounted(() => {
	loadAttendanceCount()
	loadStudentLevel()
	loadPoints()
	loadUserAvatar()
})
</script>

<template>
	<div class="navigation-container">
		<div class="background-effects">
			<div class="gradient-orb orb-1"/>
			<div class="gradient-orb orb-2"/>
			<div class="gradient-orb orb-3"/>
		</div>

		<div class="header">
			<div class="header-top">
				<div class="header-left">
					<el-button
						class="home-btn"
						type="primary"
						:icon="House"
						circle
						@click="goToHome"
					/>

					<img
						src="@/assets/AiWorkShop_icon.png"
						alt="Logo"
						class="logo"
						title="切换主题模式"
						@click="toggleTheme"
					/>

					<div class="title-section">
						<h1>AI坊学生管理系统</h1>
						<p>人工智能创作坊</p>
					</div>
				</div>

				<div class="header-center">
					<div class="page-title-wrapper">
						<div class="page-title">功能导航</div>
					</div>
				</div>

				<div class="header-right">
					<el-button
						type="danger"
						class="logout-btn"
						plain
						@click="handleLogout"
					>
						<el-icon>
							<switch-button/>
						</el-icon>
						退出登录
					</el-button>
				</div>
			</div>
		</div>

		<div class="main-content">
			<div class="center-hub-layout">
				<div class="center-info-card">
					<div class="center-left-section">
						<div
							class="center-avatar"
							:class="{ 'has-avatar': hasAvatar, 'no-avatar': !hasAvatar }"
							@click="handleAvatarClick"
						>
							<img
								v-if="hasAvatar && avatarUrl"
								v-lazy="avatarUrl"
								alt="用户头像"
								class="avatar-image"
							/>
							<el-icon v-else size="32" class="avatar-icon">
								<user/>
							</el-icon>
							<div v-if="avatarLoading" class="avatar-loading">
								<img src="@/assets/loading.gif" alt="加载中" class="loading-gif"/>
							</div>
						</div>

						<div class="center-user-info">
							<div class="center-user-name">{{ userStore.userInfo?.name || '学生' }}</div>

							<div
								v-if="userStore.studentLevel"
								class="center-user-level"
								:class="getLevelClass(userStore.studentLevel?.levelCode)"
							>
								<el-icon class="level-icon" size="14">
									<star/>
								</el-icon>
								<span>{{ getLevelName(userStore.studentLevel.levelCode) }}</span>
							</div>

							<div v-if="attendanceCount !== null" class="center-attendance">
								<el-icon class="attendance-icon" size="16">
									<calendar/>
								</el-icon>
								<span>已签到{{ attendanceCount }} 次</span>
							</div>
						</div>
					</div>

					<div
						v-if="
							!pointsLoading &&
								(totalPoints !== null || signInPoints !== null || activityPoints !== null)
						"
						class="center-points-section"
					>
						<div class="center-points-grid">
							<div class="center-point-item total-points">
								<div class="center-point-icon">
									<el-icon size="20">
										<coin/>
									</el-icon>
								</div>
								<div class="center-point-info">
									<div class="center-point-label">总积分</div>
									<div class="center-point-value">{{ totalPoints !== null ? totalPoints : 0 }}</div>
								</div>
							</div>

							<div class="center-point-item activity-points">
								<div class="center-point-icon">
									<el-icon size="20">
										<trophy/>
									</el-icon>
								</div>
								<div class="center-point-info">
									<div class="center-point-label">活动积分</div>
									<div class="center-point-value">
										{{ activityPoints !== null ? activityPoints : 0 }}
									</div>
								</div>
							</div>

							<div class="center-point-item signin-points">
								<div class="center-point-icon">
									<el-icon size="20">
										<calendar/>
									</el-icon>
								</div>
								<div class="center-point-info">
									<div class="center-point-label">签到积分</div>
									<div class="center-point-value">{{ signInPoints !== null ? signInPoints : 0 }}</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="navigation-sections">
					<!-- 个人中心分组 -->
					<div class="nav-section">
						<div class="section-header">
							<div class="section-title">
								<el-icon class="section-icon">
									<user/>
								</el-icon>
								<span>个人中心</span>
							</div>
							<div class="section-divider"/>
						</div>

						<div class="navigation-grid">
							<div class="nav-card" @click="goToAttendance">
								<div class="nav-icon">
									<el-icon size="28">
										<check/>
									</el-icon>
								</div>
								<div class="nav-content">
									<div class="nav-label">签到记录</div>
									<div class="nav-description">查看签到历史记录</div>
								</div>
							</div>

							<div class="nav-card" @click="showProfile">
								<div class="nav-icon">
									<el-icon size="28">
										<user/>
									</el-icon>
								</div>
								<div class="nav-content">
									<div class="nav-label">个人信息</div>
									<div class="nav-description">编辑个人资料信息</div>
								</div>
							</div>

							<div class="nav-card" @click="goToScoreChangeRecords">
								<div class="nav-icon">
									<el-icon size="28">
										<document/>
									</el-icon>
								</div>
								<div class="nav-content">
									<div class="nav-label">改分记录</div>
									<div class="nav-description">查看所有积分调整记录</div>
								</div>
							</div>
						</div>
					</div>

					<!-- 数据查看分组 -->
					<div class="nav-section">
						<div class="section-header">
							<div class="section-title">
								<el-icon class="section-icon">
									<data-analysis/>
								</el-icon>
								<span>数据查看</span>
							</div>
							<div class="section-divider"/>
						</div>

						<div class="navigation-grid grid-4-cols">
							<div class="nav-card" @click="goToDashboard">
								<div class="nav-icon">
									<el-icon size="28">
										<data-analysis/>
									</el-icon>
								</div>
								<div class="nav-content">
									<div class="nav-label">数据看板</div>
									<div class="nav-description">查看数据统计图表</div>
								</div>
							</div>

							<div class="nav-card" @click="goToAttendanceAnalysis">
								<div class="nav-icon">
									<el-icon size="28">
										<trend-charts/>
									</el-icon>
								</div>
								<div class="nav-content">
									<div class="nav-label">签到分析</div>
									<div class="nav-description">查看签到时段分析</div>
								</div>
							</div>

							<div class="nav-card" @click="goToPointsDashboard">
								<div class="nav-icon">
									<el-icon size="28">
										<trophy/>
									</el-icon>
								</div>
								<div class="nav-content">
									<div class="nav-label">积分看板</div>
									<div class="nav-description">查看积分排行榜</div>
								</div>
							</div>

							<div class="nav-card" @click="goToAllMembers">
								<div class="nav-icon">
									<el-icon size="28">
										<user-filled/>
									</el-icon>
								</div>
								<div class="nav-content">
									<div class="nav-label">查看全部成员</div>
									<div class="nav-description">查看所有成员信息</div>
								</div>
							</div>
						</div>
					</div>

					<!-- 管理功能分组（管理员可见）-->
					<div v-if="isAdmin" class="nav-section">
						<div class="section-header">
							<div class="section-title">
								<el-icon class="section-icon">
									<user-filled/>
								</el-icon>
								<span>管理功能</span>
							</div>
							<div class="section-divider"/>
						</div>

						<div class="navigation-grid">
							<div class="nav-card" @click="goToAdmin">
								<div class="nav-icon">
									<el-icon size="28">
										<user-filled/>
									</el-icon>
								</div>
								<div class="nav-content">
									<div class="nav-label">学生管理</div>
									<div class="nav-description">管理学生信息</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import '@/views/NavigationPage/css/NavigationPageDesktop.css';
</style>

<style>
/* 暗色模式下退出按钮样式 */
.dark .logout-btn.is-plain {
	color: #fff !important;
	background-color: #000 !important;
	border-color: #000 !important;
}

.dark .logout-btn.is-plain:hover {
	color: white !important;
	background-color: #000 !important;
	border-color: #000 !important;
}
</style>
