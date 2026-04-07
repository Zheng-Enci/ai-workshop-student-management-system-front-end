<script setup>
/**
 * 导航页面组件(移动端)
 *
 * @component NavigationPageMobile
 * @description 移动端导航主页,提供系统功能入口和用户信息展示
 * 主要功能:
 * 1. 展示用户头像、等级、积分等个人信息
 * 2. 提供签到、数据看板、积分看板等功能入口
 * 3. 根据用户等级显示不同的功能入口
 * 4. 支持主题切换功能
 *
 * @author 前端开发团队
 * @version 1.0.0
 */

// ===================== 依赖导入区 =====================
// Element Plus 图标组件导入
import { Check, User, DataAnalysis, SwitchButton, Calendar, Star, UserFilled, House, ArrowRight, Trophy, Coin, Document, TrendCharts } from '@element-plus/icons-vue'
// Element Plus 核心组件导入
import { ElMessage, ElButton, ElIcon } from 'element-plus'
// Vue3 核心API导入
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
// Vue Router 路由功能导入
import { useRouter } from 'vue-router'

// 业务API导入
import { getMyAttendanceCount } from '@/api/attendance'
import { getTotalPointsByStudentInfoId } from '@/api/points'
import { getStudentLevel, getStudentDatabaseTableId, getAvatarUrl } from '@/api/student'
// Pinia状态管理导入
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
// 页面配置常量导入
import NavigationPageConfig from '@/views/NavigationPage/js/NavigationPageConfig'
// 邀请码表单导入
import InvitationCodeForm from '@/views/NavigationPage/form/mobile/InvitationCodeForm.vue'
// Element Plus 基础样式导入(按需导入)
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-popper.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'

// ===================== 全局实例初始化 =====================
/**
 * 路由实例
 * @type {Router}
 * @description 用于页面跳转和路由导航
 */
const router = useRouter()
/**
 * 用户状态仓库实例
 * @type {Store}
 * @description 管理用户登录态、用户信息存储
 */
const userStore = useUserStore()
/**
 * 主题状态仓库实例
 * @type {Store}
 * @description 管理应用主题切换(亮色/暗色模式)
 */
const themeStore = useThemeStore()
/**
 * 主题切换方法
 * @type {Function}
 * @description 解构自主题Store,用于切换明暗主题
 */
const { toggleTheme } = themeStore

// ===================== 响应式变量定义区 =====================
/**
 * 考勤次数
 * @type {Ref<number|null>}
 * @description 用户累计签到次数
 */
const attendanceCount = ref(null)
/**
 * 签到积分
 * @type {Ref<number|null>}
 * @description 通过签到获得的积分
 */
const signInPoints = ref(null)
/**
 * 活动积分
 * @type {Ref<number|null>}
 * @description 通过参与活动获得的积分
 */
const activityPoints = ref(null)
/**
 * 总积分
 * @type {Ref<number|null>}
 * @description 用户累计总积分
 */
const totalPoints = ref(null)
/**
 * 积分加载状态
 * @type {Ref<boolean>}
 * @description 控制积分数据加载中的状态显示
 */
const pointsLoading = ref(false)
/**
 * 用户头像URL
 * @type {Ref<string|null>}
 * @description 用户自定义头像的URL地址
 */
const avatarUrl = ref(null)
/**
 * 是否有头像
 * @type {Ref<boolean>}
 * @description 标记用户是否已上传自定义头像
 */
const hasAvatar = ref(false)
/**
 * 头像加载状态
 * @type {Ref<boolean>}
 * @description 控制头像加载中的状态显示
 */
const avatarLoading = ref(false)
/**
 * 头像提示是否已显示
 * @type {Ref<boolean>}
 * @description 控制"上传头像"提示只显示一次
 */
const avatarTipShown = ref(false)

/**
 * 邀请码表单显示状态
 * @type {Ref<boolean>}
 * @description 控制邀请码表单的显示与隐藏
 */
const invitationFormVisible = ref(false)

/**
 * 是否为管理员
 * @type {ComputedRef<boolean>}
 * @description 根据用户等级判断是否为管理员(等级码为3)
 */
const isAdmin = computed(() => userStore.studentLevel?.levelCode === 3)

/**
 * 获取等级名称
 * @function getLevelName
 * @description 根据等级码返回对应的等级名称
 * @param {number} levelCode - 等级码(0-3)
 * @returns {string} 等级名称
 */
const getLevelName = levelCode => {
	/**
	 * 等级码与名称的映射关系
	 * @type {Object<number, string>}
	 */
	const levelMap = {
		0: '社团成员',
		1: '普通成员',
		2: '核心成员',
		3: '管理员'
	}
	return levelMap[levelCode] || '未知等级'
}

/**
 * 获取等级CSS类名
 * @function getLevelClass
 * @description 根据等级码返回对应的CSS类名,用于样式控制
 * @param {number} levelCode - 等级码(0-3)
 * @returns {string} CSS类名
 */
const getLevelClass = levelCode => {
	/**
	 * 等级码与CSS类名的映射关系
	 * @type {Object<number, string>}
	 */
	const levelClassMap = {
		0: 'club-member',
		1: 'normal-member',
		2: 'core-member',
		3: 'admin'
	}
	return levelClassMap[levelCode] || 'club-member'
}

// ===================== 页面跳转方法区 =====================
/**
 * 跳转到签到页面
 * @function goToAttendance
 * @description 点击签到入口时触发,跳转到签到页面
 */
const goToAttendance = () => {
	router.push('/attendance')
}

/**
 * 跳转到首页
 * @function goToHome
 * @description 点击首页入口时触发,返回系统首页
 */
const goToHome = () => {
	router.push('/')
}

/**
 * 显示个人资料页面
 * @function showProfile
 * @description 点击个人资料入口时触发,跳转到个人资料页面
 */
const showProfile = () => {
	router.push('/profile')
}

/**
 * 处理头像点击事件
 * @function handleAvatarClick
 * @description 点击用户头像时触发,跳转到移动端个人资料页面
 */
const handleAvatarClick = () => {
	router.push('/profile/mobile')
}

/**
 * 跳转到数据看板页面
 * @function goToDashboard
 * @description 点击数据看板入口时触发,跳转到数据看板页面
 */
const goToDashboard = () => {
	router.push('/dashboard')
}

/**
 * 跳转到积分看板页面
 * @function goToPointsDashboard
 * @description 点击积分看板入口时触发,跳转到积分看板页面
 */
const goToPointsDashboard = () => {
	router.push('/points-dashboard')
}

/**
 * 跳转到考勤分析页面
 * @function goToAttendanceAnalysis
 * @description 点击考勤分析入口时触发,跳转到考勤分析页面
 */
const goToAttendanceAnalysis = () => {
	router.push('/attendance-analysis')
}

/**
 * 跳转到所有成员页面
 * @function goToAllMembers
 * @description 点击所有成员入口时触发,跳转到所有成员页面
 */
const goToAllMembers = () => {
	router.push('/all-members')
}

/**
 * 跳转到积分变更记录页面
 * @function goToScoreChangeRecords
 * @description 点击积分变更记录入口时触发,跳转到积分变更记录页面
 */
const goToScoreChangeRecords = () => {
	router.push('/score-change-records')
}

/**
 * 跳转到管理员页面
 * @function goToAdmin
 * @description 点击管理员入口时触发,跳转到学生管理页面(仅管理员可见)
 */
const goToAdmin = () => {
	router.push('/student-manager')
}

/**
 * 跳转到邀请码页面
 * @function goToInvitationCode
 * @description 点击邀请码入口时触发,打开邀请码表单
 */
const goToInvitationCode = () => {
	invitationFormVisible.value = true
}

/**
 * 加载考勤次数
 * @function loadAttendanceCount
 * @description 从API获取用户的累计签到次数,并计算对应的签到积分
 * 积分计算规则: 签到次数 × 0.64 (四舍五入)
 * @async
 * @returns {Promise<void>}
 */
const loadAttendanceCount = async () => {
	try {
		// 从本地存储获取登录token
		const token = localStorage.getItem('token')
		// 无token时直接返回,不执行后续操作
		if (!token) { return }

		// 调用API获取签到次数
		const response = await getMyAttendanceCount(token)
		if (response.code === 200) {
			// 更新考勤次数
			attendanceCount.value = response.data.count
			/**
			 * 计算签到积分
			 * @description 根据签到次数计算积分,每次签到获得0.64积分,四舍五入取整
			 */
			signInPoints.value = Math.round(response.data.count * 0.64)
		}
	} catch (error) {
		// Token失效处理:清除本地存储并跳转到登录页
		if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
			localStorage.removeItem('token')
			localStorage.removeItem('userInfo')
			router.push('/login')
		}
	}
}

/**
 * 加载积分数据
 * @function loadPoints
 * @description 并行加载签到积分和活动积分,计算总积分
 * 流程:
 * 1. 并行获取签到次数和学生数据库ID
 * 2. 根据签到次数计算签到积分
 * 3. 根据学生ID获取活动积分
 * 4. 计算总积分 = 签到积分 + 活动积分
 * @async
 * @returns {Promise<void>}
 */
const loadPoints = async () => {
	try {
		// 开启积分加载状态
		pointsLoading.value = true
		const token = localStorage.getItem('token')
		// 无token时关闭加载状态并返回
		if (!token) {
			pointsLoading.value = false
			return
		}

		/**
		 * 并行加载数据
		 * @description 使用Promise.all同时请求签到次数和学生数据库ID,提升加载效率
		 * 使用catch处理单个请求失败,避免整体失败
		 */
		const [attendanceResponse, studentIdResponse] = await Promise.all([
			getMyAttendanceCount(token).catch(() => ({ code: 0, data: { count: 0 } })),
			getStudentDatabaseTableId(token).catch(() => ({ code: 0, data: null }))
		])

		/**
		 * 计算签到积分
		 * @description 根据签到次数计算积分,失败时设为0
		 */
		if (attendanceResponse.code === 200) {
			signInPoints.value = Math.round(attendanceResponse.data.count * 0.64)
		} else {
			signInPoints.value = 0
		}

		/**
		 * 获取活动积分
		 * @description 需要先获取学生数据库ID,再根据ID获取活动积分
		 */
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

		/**
		 * 计算总积分
		 * @description 总积分 = 签到积分 + 活动积分
		 * 使用||0确保null/undefined时默认为0
		 */
		totalPoints.value = (signInPoints.value || 0) + (activityPoints.value || 0)
	} catch (error) {
		// Token失效处理
		if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
			localStorage.removeItem('token')
			localStorage.removeItem('userInfo')
			router.push('/login')
		} else {
			/**
			 * 其他错误处理
			 * @description 发生错误时将所有积分设为0,避免显示null或undefined
			 */
			signInPoints.value = 0
			activityPoints.value = 0
			totalPoints.value = 0
		}
	} finally {
		// 无论成功或失败,都要关闭加载状态
		pointsLoading.value = false
	}
}

/**
 * 加载学生等级
 * @function loadStudentLevel
 * @description 从API获取学生等级信息并存储到状态管理中
 * @async
 * @returns {Promise<void>}
 */
const loadStudentLevel = async () => {
	try {
		// 检查用户信息中是否有学号
		if (!userStore.userInfo?.studentId) { return }

		// 调用API获取学生等级
		const response = await getStudentLevel(userStore.userInfo.studentId)
		if (response.code === 200) {
			// 将等级信息存储到状态管理中
			userStore.setStudentLevel(response.data)
		}
	} catch (error) {
		// 静默失败,不显示错误提示

	}
}

/**
 * 显示默认头像
 * @function showDefaultAvatar
 * @description 当用户未上传头像时调用,显示默认图标并给出上传提示(仅首次)
 * 提示信息会显示4秒,用户可手动关闭
 */
const showDefaultAvatar = () => {
	// 标记为无头像状态
	hasAvatar.value = false
	avatarUrl.value = null
	/**
	 * 显示提示消息(只显示一次)
	 * @description 避免重复提示打扰用户,仅在首次未检测到头像时提示
	 */
	if (!avatarTipShown.value) {
		ElMessage.info({
			message: '您还没有上传头像，点击头像前往个人信息页面上传',
			duration: 4000, // 提示显示4秒
			showClose: true // 显示关闭按钮
		})
		// 标记提示已显示,避免重复触发
		avatarTipShown.value = true
	}
}

/**
 * 加载用户头像
 * @function loadUserAvatar
 * @description 从接口获取学生ID,再获取头像URL,使用fetch和Image对象双重验证头像是否存在
 * 流程:
 * 1. 获取登录token
 * 2. 根据token获取学生数据库ID
 * 3. 拼接头像URL
 * 4. 使用fetch检测头像是否存在(检查响应类型)
 * 5. 使用Image对象加载头像(作为fallback)
 * @async
 * @returns {Promise<void>}
 */
const loadUserAvatar = async () => {
	try {
		// 开启头像加载状态
		avatarLoading.value = true
		// 从本地存储获取登录token
		const token = localStorage.getItem('token')
		// 无token时显示默认头像并关闭加载状态
		if (!token) {
			showDefaultAvatar()
			avatarLoading.value = false
			return
		}

		/**
		 * 获取学生数据库ID
		 * @description 使用token获取学生数据库主键ID,用于拼接头像URL
		 */
		const idResponse = await getStudentDatabaseTableId(token)
		// 接口返回异常时显示默认头像
		if (idResponse.code !== 200 || !idResponse.data) {
			showDefaultAvatar()
			avatarLoading.value = false
			return
		}

		// 获取学生数据库ID
		const studentInfoId = idResponse.data
		/**
		 * 拼接头像URL
		 * @description 根据学生ID和配置的头像尺寸拼接头像URL
		 */
		const avatarUrlString = getAvatarUrl(studentInfoId, NavigationPageConfig.AVATAR_SIZE)

		// 头像URL为空时显示默认头像
		if (!avatarUrlString) {
			showDefaultAvatar()
			avatarLoading.value = false
			return
		}

		/**
		 * 使用fetch检测头像是否存在(更可靠的方式)
		 * @description 通过检查HTTP响应状态和Content-Type来判断头像是否存在
		 * 优点: 可以检查响应类型,避免加载非图片内容
		 */
		try {
			const response = await fetch(avatarUrlString, { method: 'GET' })
			if (response.ok) {
				// 获取响应内容类型
				const contentType = response.headers.get('content-type')
				/**
				 * 检查响应是否为图片类型
				 * @description 确保返回的是图片而不是JSON错误信息
				 */
				if (contentType && contentType.startsWith('image/')) {
					/**
					 * 头像存在,使用Image对象加载
					 * @description Image对象加载成功时更新头像URL和状态
					 */
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
					/**
					 * 返回的不是图片(可能是JSON错误信息),头像不存在
					 * @description 服务器返回了非图片内容,判定头像不存在
					 */
					showDefaultAvatar()
					avatarLoading.value = false
				}
			} else {
				/**
				 * 响应状态码不是200(可能是400),头像不存在
				 * @description HTTP状态码异常,判定头像不存在
				 */
				showDefaultAvatar()
				avatarLoading.value = false
			}
		} catch (fetchError) {
			/**
			 * fetch失败,可能是网络错误或CORS问题,使用Image对象作为fallback
			 * @description 当fetch请求失败时,使用Image对象尝试加载头像
			 * 这样可以处理CORS限制或网络问题
			 */
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
		// Token失效处理
		if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
			localStorage.removeItem('token')
			localStorage.removeItem('userInfo')
			router.push('/login')
		} else {
			// 其他错误时显示默认头像
			showDefaultAvatar()
		}
		// 关闭加载状态
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

	const savedScrollY = localStorage.getItem('navigationPageScrollY')
	if (savedScrollY) {
		setTimeout(() => {
			window.scrollTo(0, parseFloat(savedScrollY))
		}, 100)
	}

	window.addEventListener('scroll', handleScroll)
})

const handleScroll = () => {
	localStorage.setItem('navigationPageScrollY', window.scrollY.toString())
}

onBeforeUnmount(() => {
	window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
	<div class="navigation-container">
		<div class="navigation-page-mobile-background-effects">
			<div class="navigation-page-mobile-background-orb-1"/>
			<div class="navigation-page-mobile-background-orb-2"/>
			<div class="navigation-page-mobile-background-orb-3"/>
		</div>

		<div class="navigation-page-mobile-header-container">
			<div class="navigation-page-mobile-header-content">
				<el-button
					class="navigation-page-mobile-header-home-btn"
					type="primary"
					:icon="House"
					circle
					@click="goToHome"/>
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊学生管理系统"
					class="navigation-page-mobile-header-logo"
					title="切换主题模式"
					@click="toggleTheme"/>
				<div class="navigation-page-mobile-header-title-section">
					<h1>AI坊学生管理系统</h1>
					<p>人工智能创作坊</p>
				</div>
			</div>

			<div class="navigation-page-mobile-user-card-profile">
				<div
					class="navigation-page-mobile-user-card-avatar"
					:class="{ 'has-avatar': hasAvatar, 'no-avatar': !hasAvatar }"
					@click="handleAvatarClick">
					<img
						v-if="hasAvatar && avatarUrl"
						v-lazy="avatarUrl"
						alt="用户头像"
						class="navigation-page-mobile-user-card-avatar-image" />
					<el-icon v-else size="28" class="navigation-page-mobile-user-card-avatar-icon"><user /></el-icon>
					<div v-if="avatarLoading" class="navigation-page-mobile-user-card-avatar-loading">
						<img src="@/assets/loading.gif" alt="加载中" class="navigation-page-mobile-user-card-loading-gif" />
					</div>
				</div>
				<div class="navigation-page-mobile-user-card-details">
					<div>
						<div class="navigation-page-mobile-user-card-name">{{ userStore.userInfo?.name || '学生' }}</div>
						<div
							v-if="userStore.studentLevel"
							class="navigation-page-mobile-user-card-level"
							:class="getLevelClass(userStore.studentLevel?.levelCode)">
							<el-icon class="level-icon"><star /></el-icon>
							<span>{{ getLevelName(userStore.studentLevel.levelCode) }}</span>
						</div>
						<div v-if="attendanceCount !== null" class="navigation-page-mobile-user-card-attendance">
							<el-icon class="attendance-icon"><calendar /></el-icon>
							<span>已签到 {{ attendanceCount }} 次</span>
						</div>
					</div>
				</div>
				<div class="navigation-page-mobile-points-card-item navigation-page-mobile-points-card-total">
					<div class="navigation-page-mobile-points-card-icon">
						<el-icon size="16"><coin /></el-icon>
					</div>
					<div class="navigation-page-mobile-points-card-content">
						<div class="navigation-page-mobile-points-card-label">总积分</div>
						<div class="navigation-page-mobile-points-card-value">{{ totalPoints !== null ? totalPoints : 0 }}</div>
					</div>
				</div>
			</div>

			<div
				v-if="!pointsLoading && (totalPoints !== null || signInPoints !== null || activityPoints !== null)"
				class="navigation-page-mobile-points-card-display">

				<div class="navigation-page-mobile-points-card-item navigation-page-mobile-points-card-activity">
					<div class="navigation-page-mobile-points-card-icon">
						<el-icon size="16"><trophy /></el-icon>
					</div>
					<div class="navigation-page-mobile-points-card-content">
						<div class="navigation-page-mobile-points-card-label">活动积分</div>
						<div class="navigation-page-mobile-points-card-value">{{ activityPoints !== null ? activityPoints : 0 }}</div>
					</div>
				</div>
				<div class="navigation-page-mobile-points-card-item navigation-page-mobile-points-card-signin">
					<div class="navigation-page-mobile-points-card-icon">
						<el-icon size="16"><calendar /></el-icon>
					</div>
					<div class="navigation-page-mobile-points-card-content">
						<div class="navigation-page-mobile-points-card-label">签到积分</div>
						<div class="navigation-page-mobile-points-card-value">{{ signInPoints !== null ? signInPoints : 0 }}</div>
					</div>
				</div>
		</div>

		<div class="navigation-page-mobile-nav-sections-main">
			<div class="navigation-page-mobile-nav-sections-container">
				<!-- 个人中心分组 -->
				<div class="navigation-page-mobile-nav-section-card-item">
					<div class="navigation-page-mobile-nav-section-card-header">
						<div class="navigation-page-mobile-nav-section-card-title">
							<el-icon class="navigation-page-mobile-nav-section-card-icon"><user /></el-icon>
							<span>个人中心</span>
						</div>
						<div class="navigation-page-mobile-nav-section-card-divider"/>
					</div>
					<div class="navigation-page-mobile-nav-section-card-grid">
						<div class="navigation-page-mobile-nav-section-card-card primary-card" @click="goToAttendance">
							<div class="navigation-page-mobile-nav-section-card-card-bg"/>
							<div class="navigation-page-mobile-nav-section-card-card-content">
								<div class="navigation-page-mobile-nav-section-card-card-icon">
									<el-icon size="32"><check /></el-icon>
								</div>
								<div class="navigation-page-mobile-nav-section-card-card-text">
									<h3>学生签到</h3>
									<p>进行AI坊实践签到</p>
								</div>
								<div class="navigation-page-mobile-nav-section-card-card-arrow">
									<el-icon><arrow-right /></el-icon>
								</div>
							</div>
						</div>

						<div class="navigation-page-mobile-nav-section-card-card invite-card" @click="showProfile">
							<div class="navigation-page-mobile-nav-section-card-card-bg"/>
							<div class="navigation-page-mobile-nav-section-card-card-content">
								<div class="navigation-page-mobile-nav-section-card-card-icon">
									<el-icon size="28"><user /></el-icon>
								</div>
								<div class="navigation-page-mobile-nav-section-card-card-text">
									<h3>个人信息</h3>
									<p>编辑个人资料信息</p>
								</div>
								<div class="navigation-page-mobile-nav-section-card-card-arrow">
									<el-icon><arrow-right /></el-icon>
								</div>
							</div>
						</div>

						<div class="navigation-page-mobile-nav-section-card-card records-card" @click="goToScoreChangeRecords">
							<div class="navigation-page-mobile-nav-section-card-card-bg"/>
							<div class="navigation-page-mobile-nav-section-card-card-content">
								<div class="navigation-page-mobile-nav-section-card-card-icon">
									<el-icon size="28"><document /></el-icon>
								</div>
								<div class="navigation-page-mobile-nav-section-card-card-text">
									<h3>改分记录</h3>
									<p>查看所有积分调整记录</p>
								</div>
								<div class="navigation-page-mobile-nav-section-card-card-arrow">
									<el-icon><arrow-right /></el-icon>
								</div>
							</div>
						</div>

						<div class="navigation-page-mobile-nav-section-card-card invite-card" @click="goToInvitationCode">
							<div class="navigation-page-mobile-nav-section-card-card-bg"/>
							<div class="navigation-page-mobile-nav-section-card-card-content">
								<div class="navigation-page-mobile-nav-section-card-card-icon">
									<el-icon size="28"><star /></el-icon>
								</div>
								<div class="navigation-page-mobile-nav-section-card-card-text">
									<h3>邀请码</h3>
									<p>查看我的邀请码</p>
								</div>
								<div class="navigation-page-mobile-nav-section-card-card-arrow">
									<el-icon><arrow-right /></el-icon>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- 数据查看分组 -->
				<div class="navigation-page-mobile-nav-sections-item">
					<div class="navigation-page-mobile-nav-sections-header">
						<div class="navigation-page-mobile-nav-sections-title">
							<el-icon class="navigation-page-mobile-nav-sections-icon"><data-analysis /></el-icon>
							<span>数据查看</span>
						</div>
						<div class="navigation-page-mobile-nav-sections-divider"/>
					</div>
					<div class="navigation-page-mobile-nav-sections-grid">
						<div class="navigation-page-mobile-nav-sections-card data-card" @click="goToDashboard">
							<div class="navigation-page-mobile-nav-sections-card-bg"/>
							<div class="navigation-page-mobile-nav-sections-card-content">
								<div class="navigation-page-mobile-nav-sections-card-icon">
									<el-icon size="28"><data-analysis /></el-icon>
								</div>
								<div class="navigation-page-mobile-nav-sections-card-text">
									<h3>数据看板</h3>
									<p>查看数据统计图表</p>
								</div>
							</div>
						</div>

						<div class="navigation-page-mobile-nav-sections-card points-card" @click="goToPointsDashboard">
							<div class="navigation-page-mobile-nav-sections-card-bg"/>
							<div class="navigation-page-mobile-nav-sections-card-content">
								<div class="navigation-page-mobile-nav-sections-card-icon">
									<el-icon size="28"><trophy /></el-icon>
								</div>
								<div class="navigation-page-mobile-nav-sections-card-text">
									<h3>积分看板</h3>
									<p>查看积分排行榜</p>
								</div>
							</div>
						</div>

						<div class="navigation-page-mobile-nav-sections-card analysis-card" @click="goToAttendanceAnalysis">
							<div class="navigation-page-mobile-nav-sections-card-bg"/>
							<div class="navigation-page-mobile-nav-sections-card-content">
								<div class="navigation-page-mobile-nav-sections-card-icon">
									<el-icon size="28"><trend-charts /></el-icon>
								</div>
								<div class="navigation-page-mobile-nav-sections-card-text">
									<h3>考勤分析</h3>
									<p>查看考勤数据统计</p>
								</div>
							</div>
						</div>

						<div class="navigation-page-mobile-nav-sections-card members-card" @click="goToAllMembers">
							<div class="navigation-page-mobile-nav-sections-card-bg"/>
							<div class="navigation-page-mobile-nav-sections-card-content">
								<div class="navigation-page-mobile-nav-sections-card-icon">
									<el-icon size="28"><user /></el-icon>
								</div>
								<div class="navigation-page-mobile-nav-sections-card-text">
									<h3>全部成员</h3>
									<p>查看所有成员信息</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- 管理功能分组（管理员可见） -->
				<div v-if="isAdmin" class="navigation-page-mobile-nav-sections-item">
					<div class="navigation-page-mobile-nav-sections-header">
						<div class="navigation-page-mobile-nav-sections-title">
							<el-icon class="navigation-page-mobile-nav-sections-icon"><user-filled /></el-icon>
							<span>管理功能</span>
						</div>
						<div class="navigation-page-mobile-nav-sections-divider"/>
					</div>
					<div class="navigation-page-mobile-nav-sections-grid">
						<div class="navigation-page-mobile-nav-sections-card admin-card" @click="goToAdmin">
							<div class="navigation-page-mobile-nav-sections-card-bg"/>
							<div class="navigation-page-mobile-nav-sections-card-content">
								<div class="navigation-page-mobile-nav-sections-card-icon">
									<el-icon size="28"><user-filled /></el-icon>
								</div>
								<div class="navigation-page-mobile-nav-sections-card-text">
									<h3>学生管理</h3>
									<p>管理学生信息</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<invitation-code-form v-model="invitationFormVisible"/>

		<div class="navigation-footer-container">
			<el-button
				type="danger"
				class="navigation-footer-logout-btn"
				plain
				@click="handleLogout">
				<el-icon><switch-button /></el-icon>
				退出登录
			</el-button>
		</div>
	</div>
		</div>
</template>

<style scoped>
</style>

<style>
/* ==================== 移动端 CSS 模块化 ==================== */
@import '@/views/NavigationPage/css/mobile/navigation-page-mobile-background.css';
@import '@/views/NavigationPage/css/mobile/navigation-page-mobile-header.css';
@import '@/views/NavigationPage/css/mobile/navigation-page-mobile-user-card.css';
@import '@/views/NavigationPage/css/mobile/navigation-page-mobile-points-card.css';
@import '@/views/NavigationPage/css/mobile/navigation-page-mobile-nav-sections.css';
@import '@/views/NavigationPage/css/mobile/navigation-page-mobile-nav-section-card.css';
@import '@/views/NavigationPage/css/mobile/navigation-page-mobile-footer.css';
</style>

