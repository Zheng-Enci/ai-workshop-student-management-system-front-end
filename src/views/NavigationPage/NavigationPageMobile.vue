<script setup>
import { Check, User, DataAnalysis, SwitchButton, Calendar, Star, UserFilled, House, TrendCharts, ArrowRight, Trophy, Coin, Document } from '@element-plus/icons-vue'
import { ElMessage, ElButton, ElIcon } from 'element-plus'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

import { getMyAttendanceCount } from '@/api/attendance'
import { getTotalPointsByStudentInfoId } from '@/api/points'
import { getStudentLevel, getStudentDatabaseTableId, getAvatarUrl } from '@/api/student'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import NavigationPageConfig from '@/views/NavigationPage/js/NavigationPageConfig'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-popper.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore
const attendanceCount = ref(null)
const signInPoints = ref(null)
const activityPoints = ref(null)
const totalPoints = ref(null)
const pointsLoading = ref(false)
const avatarUrl = ref(null)
const hasAvatar = ref(false)
const avatarLoading = ref(false)
const avatarTipShown = ref(false)

const isAdmin = computed(() => userStore.studentLevel?.levelCode === 3)

const getLevelName = levelCode => {
	const levelMap = {
		0: '社团成员',
		1: '普通成员',
		2: '核心成员',
		3: '管理员'
	}
	return levelMap[levelCode] || '未知等级'
}

const getLevelClass = levelCode => {
	const levelClassMap = {
		0: 'club-member',
		1: 'normal-member',
		2: 'core-member',
		3: 'admin'
	}
	return levelClassMap[levelCode] || 'club-member'
}

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
	router.push('/profile/mobile')
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

const loadAttendanceCount = async () => {
	try {
		const token = localStorage.getItem('token')
		if (!token) { return }

		const response = await getMyAttendanceCount(token)
		if (response.code === 200) {
			attendanceCount.value = response.data.count
			// 计算签到积分：签到次数 × 0.64（四舍五入）
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

const loadPoints = async () => {
	try {
		pointsLoading.value = true
		const token = localStorage.getItem('token')
		if (!token) {
			pointsLoading.value = false
			return
		}

		// 并行加载签到次数和学生数据库ID
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
			const activityResponse = await getTotalPointsByStudentInfoId(studentIdResponse.data)
				.catch(() => ({ code: 0, data: 0 }))
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
			// 发生错误时设置为0，避免显示null
			signInPoints.value = 0
			activityPoints.value = 0
			totalPoints.value = 0
		}
	} finally {
		pointsLoading.value = false
	}
}

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

const showDefaultAvatar = () => {
	hasAvatar.value = false
	avatarUrl.value = null
	// 显示提示消息（只显示一次）
	if (!avatarTipShown.value) {
		ElMessage.info({
			message: '您还没有上传头像，点击头像前往个人信息页面上传',
			duration: 4000,
			showClose: true
		})
		avatarTipShown.value = true
	}
}

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
		const avatarUrlString = getAvatarUrl(studentInfoId, NavigationPageConfig.AVATAR_SIZE)

		if (!avatarUrlString) {
			showDefaultAvatar()
			avatarLoading.value = false
			return
		}

		// 使用fetch检测头像是否存在（更可靠的方式）
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
				// 响应状态码不是200（可能是400），头像不存在
				showDefaultAvatar()
				avatarLoading.value = false
			}
		} catch (fetchError) {
			// fetch失败，可能是网络错误或CORS问题，使用Image对象作为fallback
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

const handleLogout = () => {
	userStore.logout()
	ElMessage.success('已退出登录')
	router.push('/login')
}

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
			<div class="header-content">
				<el-button
					class="home-btn"
					type="primary"
					:icon="House"
					circle
					@click="goToHome"/>
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊学生管理系统"
					class="logo"
					title="切换主题模式"
					@click="toggleTheme"/>
				<div class="title-section">
					<h1>AI坊学生管理系统</h1>
					<p>人工智能创作坊</p>
				</div>
			</div>

			<div class="user-profile">
				<div
					class="user-avatar"
					:class="{ 'has-avatar': hasAvatar, 'no-avatar': !hasAvatar }"
					@click="handleAvatarClick">
					<img
						v-if="hasAvatar && avatarUrl"
						v-lazy="avatarUrl"
						alt="用户头像"
						class="avatar-image" />
					<el-icon v-else size="28" class="avatar-icon"><user /></el-icon>
					<div v-if="avatarLoading" class="avatar-loading">
						<img src="@/assets/loading.gif" alt="加载中" class="loading-gif" />
					</div>
				</div>
				<div class="user-details">
					<div class="user-name">{{ userStore.userInfo?.name || '学生' }}</div>
					<div
						v-if="userStore.studentLevel"
						class="user-level"
						:class="getLevelClass(userStore.studentLevel?.levelCode)">
						<el-icon class="level-icon"><star /></el-icon>
						<span>{{ getLevelName(userStore.studentLevel.levelCode) }}</span>
					</div>
					<div v-if="attendanceCount !== null" class="attendance-count">
						<el-icon class="attendance-icon"><calendar /></el-icon>
						<span>已签到 {{ attendanceCount }} 次</span>
					</div>
				</div>
			</div>

			<div
				v-if="!pointsLoading && (totalPoints !== null || signInPoints !== null || activityPoints !== null)"
				class="points-display">
				<div class="points-card total-points">
					<div class="points-icon">
						<el-icon size="16"><coin /></el-icon>
					</div>
					<div class="points-content">
						<div class="points-label">总积分</div>
						<div class="points-value">{{ totalPoints !== null ? totalPoints : 0 }}</div>
					</div>
				</div>
				<div class="points-card activity-points">
					<div class="points-icon">
						<el-icon size="16"><trophy /></el-icon>
					</div>
					<div class="points-content">
						<div class="points-label">活动积分</div>
						<div class="points-value">{{ activityPoints !== null ? activityPoints : 0 }}</div>
					</div>
				</div>
				<div class="points-card signin-points">
					<div class="points-icon">
						<el-icon size="16"><calendar /></el-icon>
					</div>
					<div class="points-content">
						<div class="points-label">签到积分</div>
						<div class="points-value">{{ signInPoints !== null ? signInPoints : 0 }}</div>
					</div>
				</div>
			</div>
		</div>

		<div class="main-content">
			<div class="navigation-sections">
				<!-- 个人中心分组 -->
				<div class="nav-section">
					<div class="section-header">
						<div class="section-title">
							<el-icon class="section-icon"><user /></el-icon>
							<span>个人中心</span>
						</div>
						<div class="section-divider"/>
					</div>
					<div class="feature-grid">
						<div class="feature-card primary-card" @click="goToAttendance">
							<div class="card-background"/>
							<div class="card-content">
								<div class="card-icon">
									<el-icon size="32"><check /></el-icon>
								</div>
								<div class="card-text">
									<h3>学生签到</h3>
									<p>进行AI坊实践签到</p>
								</div>
								<div class="card-arrow">
									<el-icon><arrow-right /></el-icon>
								</div>
							</div>
						</div>

						<div class="feature-card" @click="showProfile">
							<div class="card-background"/>
							<div class="card-content">
								<div class="card-icon">
									<el-icon size="28"><user /></el-icon>
								</div>
								<div class="card-text">
									<h3>个人信息</h3>
									<p>编辑个人资料信息</p>
								</div>
								<div class="card-arrow">
									<el-icon><arrow-right /></el-icon>
								</div>
							</div>
						</div>

						<div class="feature-card" @click="goToScoreChangeRecords">
							<div class="card-background"/>
							<div class="card-content">
								<div class="card-icon">
									<el-icon size="28"><document /></el-icon>
								</div>
								<div class="card-text">
									<h3>改分记录</h3>
									<p>查看所有积分调整记录</p>
								</div>
								<div class="card-arrow">
									<el-icon><arrow-right /></el-icon>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- 数据查看分组 -->
				<div class="nav-section">
					<div class="section-header">
						<div class="section-title">
							<el-icon class="section-icon"><data-analysis /></el-icon>
							<span>数据查看</span>
						</div>
						<div class="section-divider"/>
					</div>
					<div class="feature-grid">
						<div class="feature-card" @click="goToDashboard">
							<div class="card-background"/>
							<div class="card-content">
								<div class="card-icon">
									<el-icon size="28"><data-analysis /></el-icon>
								</div>
								<div class="card-text">
									<h3>数据看板</h3>
									<p>查看数据统计图表</p>
								</div>
								<div class="card-arrow">
									<el-icon><arrow-right /></el-icon>
								</div>
							</div>
						</div>

						<div class="feature-card" @click="goToAttendanceAnalysis">
							<div class="card-background"/>
							<div class="card-content">
								<div class="card-icon">
									<el-icon size="28"><trend-charts /></el-icon>
								</div>
								<div class="card-text">
									<h3>签到分析</h3>
									<p>查看签到时段分析</p>
								</div>
								<div class="card-arrow">
									<el-icon><arrow-right /></el-icon>
								</div>
							</div>
						</div>

						<div class="feature-card" @click="goToPointsDashboard">
							<div class="card-background"/>
							<div class="card-content">
								<div class="card-icon">
									<el-icon size="28"><trophy /></el-icon>
								</div>
								<div class="card-text">
									<h3>积分看板</h3>
									<p>查看积分排行榜</p>
								</div>
								<div class="card-arrow">
									<el-icon><arrow-right /></el-icon>
								</div>
							</div>
						</div>

						<div class="feature-card" @click="goToAllMembers">
							<div class="card-background"/>
							<div class="card-content">
								<div class="card-icon">
									<el-icon size="28"><user /></el-icon>
								</div>
								<div class="card-text">
									<h3>全部成员</h3>
									<p>查看所有成员信息</p>
								</div>
								<div class="card-arrow">
									<el-icon><arrow-right /></el-icon>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- 管理功能分组（管理员可见） -->
				<div v-if="isAdmin" class="nav-section">
					<div class="section-header">
						<div class="section-title">
							<el-icon class="section-icon"><user-filled /></el-icon>
							<span>管理功能</span>
						</div>
						<div class="section-divider"/>
					</div>
					<div class="feature-grid">
						<div class="feature-card admin-card" @click="goToAdmin">
							<div class="card-background"/>
							<div class="card-content">
								<div class="card-icon">
									<el-icon size="28"><user-filled /></el-icon>
								</div>
								<div class="card-text">
									<h3>学生管理</h3>
									<p>管理学生信息</p>
								</div>
								<div class="card-arrow">
									<el-icon><arrow-right /></el-icon>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="footer">
			<el-button
				type="danger"
				class="logout-btn"
				plain
				@click="handleLogout">
				<el-icon><switch-button /></el-icon>
				退出登录
			</el-button>
		</div>
	</div>
</template>

<style scoped>
@import './css/NavigationPageMobile.css';
</style>

<style>
.dark .logout-btn.el-button--danger.is-plain {
  color: #fff !important;
  background-color: #000 !important;
  border-color: #000 !important;
}

.dark .logout-btn:active {
  color: var(--danger-color) !important;
}
</style>

