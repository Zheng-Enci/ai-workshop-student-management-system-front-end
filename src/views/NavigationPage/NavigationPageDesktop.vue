<script setup>
/**
 * 导航页面组件(桌面端)
 *
 * @description 提供系统功能导航,展示用户信息、签到次数、积分统计等
 * @component NavigationPageDesktop
 */
import {
	Check,
	User,
	DataAnalysis,
	SwitchButton,
	Calendar,
	Star,
	UserFilled,
	House,
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
// 导入邀请码表单
import InvitationCodeForm from '@/views/NavigationPage/form/desktop/InvitationCodeForm.vue'
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

const invitationFormVisible = ref(false)

// ===================== 计算属性区 =====================
/**
 * 是否为管理员
 * @type {ComputedRef<boolean>}
 * @description 根据用户等级判断是否为管理员(等级码为3)
 */
const isAdmin = computed(() => userStore.studentLevel?.levelCode === 3)

// ===================== 工具方法区 =====================
/**
 * 获取等级名称
 * @function getLevelName
 * @description 根据等级码返回对应的等级名称
 * @param levelCode - 等级码(0-3)
 * @returns 等级名称
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
 * @param levelCode - 等级码(0-3)
 * @returns CSS类名
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
 * 跳转到考勤分析页面
 * @function goToAttendanceAnalysis
 * @description 点击考勤分析入口时触发,跳转到考勤分析页面
 */
const goToAttendanceAnalysis = () => {
	router.push('/attendance-analysis')
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
 * @description 点击用户头像时触发,跳转到桌面端个人资料页面
 */
const handleAvatarClick = () => {
	router.push('/profile/desktop')
}

/**
 * 跳转到数据看板页面
 * @function goToDashboard
 * @description 点击数据看板入口时触发,跳转到数据看板页面
 */
const goToDashboard = () => {
	router.push('/dashboard-desktop')
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
 * 邀请码功能
 * @function handleInvitationCode
 * @description 点击邀请码卡片时触发，打开邀请码表单
 */
const handleInvitationCode = () => {
	invitationFormVisible.value = true
}

/**
 * 跳转到管理员页面
 * @function goToAdmin
 * @description 点击管理员入口时触发,跳转到学生管理页面(仅管理员可见)
 */
const goToAdmin = () => {
	router.push('/student-manager')
}

// ===================== 数据加载方法区 =====================
/**
 * 加载考勤次数
 * @function loadAttendanceCount
 * @description 从API获取用户的累计签到次数,并计算对应的签到积分
 * 积分计算规则: 签到次数 × 0.64 (四舍五入)
 * @async
 * @returns
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
 * @returns
 */
const loadPoints = async () => {
	try {
		// 开启积分加载状态
		pointsLoading.value = true
		// 从本地存储获取登录token
		const token = localStorage.getItem('token')

		// 无token时关闭加载状态并返回
		if (!token) {
			pointsLoading.value = false
			return
		}

		/**
		 * 并行请求签到数据和学生ID数据
		 * @description 使用Promise.all同时请求两个接口,提升加载效率
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

		/**
		 * 计算总积分
		 * @description 总积分 = 签到积分 + 活动积分
		 * 使用||0确保null/undefined时默认为0
		 */
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

/**
 * 加载学生等级信息
 * @function loadStudentLevel
 * @description 根据学生ID获取用户的等级信息并存储到全局状态
 * 等级信息包括:等级码、等级名称等,用于权限控制和界面展示
 * @async
 * @returns
 */
const loadStudentLevel = async () => {
	try {
		// 检查用户信息和学生ID是否存在
		if (!userStore.userInfo?.studentId) { return }

		// 调用API获取学生等级信息
		const response = await getStudentLevel(userStore.userInfo.studentId)
		if (response.code === 200) {
			// 将等级信息存储到全局状态
			userStore.setStudentLevel(response.data)
		}
	} catch (error) {
		// 加载失败时不做处理,静默失败
		return
	}
}

/**
 * 显示默认头像并提示用户上传
 * @function showDefaultAvatar
 * @description 当用户没有头像或头像加载失败时,显示默认头像图标
 * 同时提示用户前往个人信息页面上传自定义头像(仅提示一次)
 * @returns
 */
const showDefaultAvatar = () => {
	// 重置头像相关状态
	hasAvatar.value = false
	avatarUrl.value = null

	// 显示提示消息(只显示一次,避免重复打扰用户)
	if (!avatarTipShown.value) {
		ElMessage.info({
			message: '你还没有上传头像，点击头像前往个人信息页面上传',
			duration: 4000,
			showClose: true
		})
		avatarTipShown.value = true
	}
}

/**
 * 加载用户头像
 * @function loadUserAvatar
 * @description 从服务器获取用户自定义头像并进行验证显示
 * 加载流程:
 * 1. 验证登录状态(token)
 * 2. 获取学生数据库ID
 * 3. 构建头像URL
 * 4. 使用fetch验证头像是否存在
 * 5. 使用Image对象加载并显示头像
 *
 * @async
 * @returns
 */
const loadUserAvatar = async () => {
	try {
		// 开启头像加载状态
		avatarLoading.value = true
		// 从本地存储获取登录token
		const token = localStorage.getItem('token')

		// 未登录时显示默认头像
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
		// 构建头像URL,尺寸为配置值的2倍(适配高清屏)
		const avatarUrlString = getAvatarUrl(
			studentInfoId,
			NavigationPageConfig.AVATAR_SIZE * 2
		)

		// URL无效时显示默认头像
		if (!avatarUrlString) {
			showDefaultAvatar()
			avatarLoading.value = false
			return
		}

		/**
		 * 使用fetch验证头像是否存在(更可靠的方式)
		 * @description 先发送HTTP请求验证响应状态和Content-Type,
		 * 避免直接加载无效URL导致404错误
		 */
		try {
			const response = await fetch(avatarUrlString, { method: 'GET' })
			if (response.ok) {
				const contentType = response.headers.get('content-type')
				// 检查响应是否为图片类型(排除JSON错误响应)
				if (contentType && contentType.startsWith('image/')) {
					// 头像存在,使用Image对象加载以触发lazy-loading
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
					// 返回的不是图片(可能是JSON错误信息),头像不存在
					showDefaultAvatar()
					avatarLoading.value = false
				}
			} else {
				// 响应状态码不是200,头像不存在
				showDefaultAvatar()
				avatarLoading.value = false
			}
		} catch (fetchError) {
			// fetch失败(网络错误或CORS问题),使用Image对象作为降级方案
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
		// Token失效处理:清除本地存储并跳转到登录页
		if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
			localStorage.removeItem('token')
			localStorage.removeItem('userInfo')
			router.push('/login')
		} else {
			// 其他错误显示默认头像
			showDefaultAvatar()
		}
		avatarLoading.value = false
	}
}

/**
 * 退出登录处理
 * @function handleLogout
 * @description 用户点击退出登录按钮时触发
 * 操作流程:
 * 1. 调用userStore.logout()清除用户状态
 * 2. 显示成功提示消息
 * 3. 跳转到登录页面
 * @returns
 */
const handleLogout = () => {
	userStore.logout()
	ElMessage.success('已退出登录')
	router.push('/login')
}

/**
 * 组件挂载后初始化数据加载
 * @description 在Vue组件挂载到DOM后,并行加载以下数据:
 * 1. 考勤次数 - 用户累计签到次数
 * 2. 学生等级 - 用户权限等级信息
 * 3. 积分数据 - 签到积分和活动积分
 * 4. 用户头像 - 自定义头像或默认头像
 */
onMounted(() => {
	loadAttendanceCount()
	loadStudentLevel()
	loadPoints()
	loadUserAvatar()
})
</script>

<template>
	<!-- 导航页面主容器 -->
	<div class="navigation-container">
		<!-- 背景装饰效果 -->
		<div class="background-effects">
			<div class="gradient-orb orb-1"/>
			<div class="gradient-orb orb-2"/>
			<div class="gradient-orb orb-3"/>
		</div>

		<!-- 页面头部 -->
		<div class="header-container">
			<div class="header-top">
				<!-- 头部左侧:首页按钮和Logo -->
				<div class="header-left">
					<el-button
						class="header-home-btn"
						type="primary"
						:icon="House"
						circle
						@click="goToHome"
					/>

					<img
						src="@/assets/AiWorkShop_icon.png"
						alt="Logo"
						class="header-logo"
						title="切换主题模式"
						@click="toggleTheme"
					/>

					<div class="header-title-section">
						<h1>AI坊学生管理系统</h1>
						<p>人工智能创作坊</p>
					</div>
				</div>

				<!-- 头部中央:页面标题 -->
				<div class="header-center">
					<div class="header-page-title-wrapper">
						<div class="header-page-title">功能导航</div>
					</div>
				</div>

				<!-- 头部右侧:退出登录按钮 -->
				<div class="header-right">
					<el-button
						type="danger"
						class="header-logout-btn"
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

		<!-- 主内容区域 -->
		<div class="main-content">
			<!-- 中心卡片布局 -->
			<div class="user-card-hub-layout">
				<!-- 中心信息卡片 -->
				<div class="user-card-info-card">
					<!-- 左侧用户信息区域 -->
					<div class="user-card-left-section">
						<!-- 用户头像 -->
						<div
							class="user-card-avatar"
							:class="{ 'has-avatar': hasAvatar, 'no-avatar': !hasAvatar }"
							@click="handleAvatarClick"
						>
							<img
								v-if="hasAvatar && avatarUrl"
								v-lazy="avatarUrl"
								alt="用户头像"
								class="user-card-avatar-image"
							/>
							<el-icon v-else size="32" class="user-card-avatar-icon">
								<user/>
							</el-icon>
							<div v-if="avatarLoading" class="user-card-avatar-loading">
								<img src="@/assets/loading.gif" alt="加载中" class="loading-gif"/>
							</div>
						</div>

						<!-- 用户详情 -->
						<div class="user-card-user-info">
							<div class="user-card-user-name">{{ userStore.userInfo?.name || '学生' }}</div>

							<!-- 用户等级 -->
							<div
								v-if="userStore.studentLevel"
								class="user-card-user-level"
								:class="getLevelClass(userStore.studentLevel?.levelCode)"
							>
								<el-icon class="level-icon" size="14">
									<star/>
								</el-icon>
								<span>{{ getLevelName(userStore.studentLevel.levelCode) }}</span>
							</div>

							<!-- 签到次数 -->
							<div v-if="attendanceCount !== null" class="user-card-attendance">
								<el-icon class="attendance-icon" size="16">
									<calendar/>
								</el-icon>
								<span>已签到{{ attendanceCount }} 次</span>
							</div>
						</div>
					</div>

					<!-- 积分统计区域 -->
					<div
						v-if="
							!pointsLoading &&
								(totalPoints !== null || signInPoints !== null || activityPoints !== null)
						"
						class="user-card-points-section"
					>
						<div class="user-card-points-grid">
							<!-- 总积分卡片 -->
							<div class="user-card-point-item total-points">
								<div class="user-card-point-icon">
									<el-icon size="20">
										<coin/>
									</el-icon>
								</div>
								<div class="user-card-point-info">
									<div class="user-card-point-label">总积分</div>
									<div class="user-card-point-value">{{ totalPoints !== null ? totalPoints : 0 }}</div>
								</div>
							</div>

							<!-- 活动积分卡片 -->
							<div class="user-card-point-item activity-points">
								<div class="user-card-point-icon">
									<el-icon size="20">
										<trophy/>
									</el-icon>
								</div>
								<div class="user-card-point-info">
									<div class="user-card-point-label">活动积分</div>
									<div class="user-card-point-value">
										{{ activityPoints !== null ? activityPoints : 0 }}
									</div>
								</div>
							</div>

							<!-- 签到积分卡片 -->
							<div class="user-card-point-item signin-points">
								<div class="user-card-point-icon">
									<el-icon size="20">
										<calendar/>
									</el-icon>
								</div>
								<div class="user-card-point-info">
									<div class="user-card-point-label">签到积分</div>
									<div class="user-card-point-value">{{ signInPoints !== null ? signInPoints : 0 }}</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="navSections">
					<!-- 个人中心分组 -->
					<div class="navSectionPersonal">
						<div class="navSectionPersonal-header">
							<div class="navSectionPersonal-title">
								<el-icon class="navSectionPersonal-icon">
									<user/>
								</el-icon>
								<span>个人中心</span>
							</div>
							<div class="navSectionPersonal-divider"/>
						</div>

						<div class="navSection-grid">
							<div class="navSection-card" @click="goToAttendance">
								<div class="navSection-card-icon">
									<el-icon size="28">
										<check/>
									</el-icon>
								</div>
								<div class="navSection-content">
									<div class="navSection-label">签到记录</div>
									<div class="navSection-description">查看签到历史记录</div>
								</div>
							</div>

							<div class="navSection-card" @click="showProfile">
								<div class="navSection-card-icon">
									<el-icon size="28">
										<user/>
									</el-icon>
								</div>
								<div class="navSection-content">
									<div class="navSection-label">个人信息</div>
									<div class="navSection-description">编辑个人资料信息</div>
								</div>
							</div>

							<div class="navSection-card" @click="goToScoreChangeRecords">
								<div class="navSection-card-icon">
									<el-icon size="28">
										<document/>
									</el-icon>
								</div>
								<div class="navSection-content">
									<div class="navSection-label">改分记录</div>
									<div class="navSection-description">查看所有积分调整记录</div>
								</div>
							</div>

							<div class="navSection-card" @click="handleInvitationCode">
								<div class="navSection-card-icon">
									<el-icon size="28">
										<star/>
									</el-icon>
								</div>
								<div class="navSection-content">
									<div class="navSection-label">邀请码</div>
									<div class="navSection-description">查看我的邀请码</div>
								</div>
							</div>
						</div>
					</div>

					<!-- 数据查看分组 -->
					<div class="navSectionData">
						<div class="navSectionData-header">
							<div class="navSectionData-title">
								<el-icon class="navSectionData-icon">
									<data-analysis/>
								</el-icon>
								<span>数据查看</span>
							</div>
							<div class="navSectionData-divider"/>
						</div>

						<div class="navSection-grid">
							<div class="navSection-card" @click="goToAttendanceAnalysis">
								<div class="navSection-card-icon">
									<el-icon size="28">
										<data-analysis/>
									</el-icon>
								</div>
								<div class="navSection-content">
									<div class="navSection-label">考勤分析</div>
									<div class="navSection-description">查看考勤数据分析</div>
								</div>
							</div>

							<div class="navSection-card" @click="goToDashboard">
								<div class="navSection-card-icon">
									<el-icon size="28">
										<data-analysis/>
									</el-icon>
								</div>
								<div class="navSection-content">
									<div class="navSection-label">数据看板</div>
									<div class="navSection-description">查看数据统计图表</div>
								</div>
							</div>

							<div class="navSection-card" @click="goToPointsDashboard">
								<div class="navSection-card-icon">
									<el-icon size="28">
										<trophy/>
									</el-icon>
								</div>
								<div class="navSection-content">
									<div class="navSection-label">积分看板</div>
									<div class="navSection-description">查看积分排行榜</div>
								</div>
							</div>

							<div class="navSection-card" @click="goToAllMembers">
								<div class="navSection-card-icon">
									<el-icon size="28">
										<user-filled/>
									</el-icon>
								</div>
								<div class="navSection-content">
									<div class="navSection-label">查看全部成员</div>
									<div class="navSection-description">查看所有成员信息</div>
								</div>
							</div>
						</div>
					</div>

					<!-- 管理功能分组（管理员可见）-->
					<div v-if="isAdmin" class="navSectionAdmin">
						<div class="navSectionAdmin-header">
							<div class="navSectionAdmin-title">
								<el-icon class="navSectionAdmin-icon">
									<user-filled/>
								</el-icon>
								<span>管理功能</span>
							</div>
							<div class="navSectionAdmin-divider"/>
						</div>

						<div class="navSection-grid">
							<div class="navSection-card" @click="goToAdmin">
								<div class="navSection-card-icon">
									<el-icon size="28">
										<user-filled/>
									</el-icon>
								</div>
								<div class="navSection-content">
									<div class="navSection-label">学生管理</div>
									<div class="navSection-description">管理学生信息</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<invitation-code-form v-model="invitationFormVisible"/>
	</div>
</template>

<style scoped>
</style>

<style>
@import '@/views/NavigationPage/css/desktop/header.css';
@import '@/views/NavigationPage/css/desktop/user-card.css';
@import '@/views/NavigationPage/css/desktop/navSections.css';
@import '@/views/NavigationPage/css/desktop/navSectionPersonal.css';
@import '@/views/NavigationPage/css/desktop/navSectionData.css';
@import '@/views/NavigationPage/css/desktop/navSectionAdmin.css';
@import '@/views/NavigationPage/css/desktop/navSectionCard.css';
</style>
