/**
 * 路由配置文件
 * 定义应用的所有路由规则，包括路由守卫、元信息设置等功能
 *
 * @module router
 * @description 管理应用的路由导航、权限验证和页面元信息
 */

import { createRouter, createWebHistory } from 'vue-router'

import { validateToken } from '@/api/student'

/**
 * 应用路由配置数组
 * 包含所有页面路由的定义，包括路径、组件、元信息等
 *
 * @type {Array<object>}
 * @description 路由配置对象包含：
 *   - path: 路由路径
 *   - name: 路由名称（用于编程式导航）
 *   - component: 路由组件（使用懒加载）
 *   - meta: 路由元信息（标题、描述、权限要求等）
 */
const routes = [
	/**
	 * 首页路由（自动适配移动端/桌面端）
	 * 根据设备类型自动跳转到对应的页面版本
	 */
	{
		path: '/',
		name: 'Home',
		component: () => import('../views/HomePage/HomePage.vue'),
		meta: {
			title: '首页 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统首页，查看系统介绍、本项目作者、产品功能，快速了解平台特性和使用指南'
		}
	},
	/**
	 * 首页路由（移动端）
	 * 移动设备专用首页，提供移动端优化的界面
	 */
	{
		path: '/home-mobile',
		name: 'HomeMobile',
		component: () => import('../views/HomePage/HomePageMobile.vue'),
		meta: {
			title: '首页 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统首页，查看系统介绍、本项目作者、产品功能，快速了解平台特性和使用指南'
		}
	},
	/**
	 * 首页路由（桌面端）
	 * 桌面设备专用首页，提供桌面端优化的界面
	 */
	{
		path: '/home-desktop',
		name: 'HomeDesktop',
		component: () => import('../views/HomePage/HomePageDesktop.vue'),
		meta: {
			title: '首页 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统首页，查看系统介绍、本项目作者、产品功能，快速了解平台特性和使用指南'
		}
	},
	/**
	 * 登录页面路由
	 * 用户登录入口，支持账号密码登录
	 */
	{
		path: '/login',
		name: 'Login',
		component: () => import('../views/LoginPage/LoginPage.vue'),
		meta: {
			title: '登录 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统登录页面，输入账号密码登录系统，访问成员管理、积分查询、考勤统计等功能'
		}
	},

	/**
	 * 注册页面路由
	 * 新用户注册入口，填写个人信息创建账户
	 */
	{
		path: '/register',
		name: 'Register',
		component: () => import('../views/RegisterPage/RegisterPage.vue'),
		meta: {
			title: '注册 - 厦工AI坊学生管理系统',
			description: '厦门工学院人工智能创作坊学生管理系统注册页面，填写个人信息创建账户，加入厦门工学院人工智能创作坊'
		}
	},


	/**
	 * 导航中心路由（自动适配）
	 * 需要登录认证，提供系统功能导航入口
	 */
	{
		path: '/navigation',
		name: 'Navigation',
		component: () => import('../views/NavigationPage/NavigationPage.vue'),
		meta: {
			requiresAuth: true,
			title: '导航中心 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统导航中心，快速访问数据看板、成员管理、考勤分析等功能，提供便捷入口导航'
		}
	},
	/**
	 * 导航中心路由（移动端）
	 * 移动设备专用导航页面，需要登录认证
	 */
	{
		path: '/navigation-mobile',
		name: 'NavigationMobile',
		component: () => import('../views/NavigationPage/NavigationPageMobile.vue'),
		meta: {
			requiresAuth: true,
			title: '导航中心 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统导航中心，快速访问数据看板、成员管理、考勤分析等功能，提供便捷入口导航'
		}
	},
	/**
	 * 导航中心路由（桌面端）
	 * 桌面设备专用导航页面，需要登录认证
	 */
	{
		path: '/navigation-desktop',
		name: 'NavigationDesktop',
		component: () => import('../views/NavigationPage/NavigationPageDesktop.vue'),
		meta: {
			requiresAuth: true,
			title: '导航中心 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统导航中心，快速访问数据看板、成员管理、考勤分析等功能，提供便捷入口导航'
		}
	},
	/**
	 * 考勤签到页面路由（自动适配）
	 * 需要登录认证，支持扫码签到和考勤记录查询
	 */
	{
		path: '/attendance',
		name: 'Attendance',
		component: () => import('../views/AttendancePage/AttendancePage.vue'),
		meta: {
			requiresAuth: true,
			title: '考勤签到 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统考勤签到页面，支持手机端扫码签到、查看签到记录、按月查询考勤数据'
		}
	},
	/**
	 * 考勤签到页面路由（移动端）
	 * 移动设备专用考勤页面，需要登录认证，支持扫码签到
	 */
	{
		path: '/attendance-mobile',
		name: 'AttendanceMobile',
		component: () => import('../views/AttendancePage/AttendancePageMobile.vue'),
		meta: {
			requiresAuth: true,
			title: '考勤签到 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统考勤签到页面，支持手机端扫码签到、查看签到记录、按月查询考勤数据'
		}
	},
	/**
	 * 考勤签到页面路由（桌面端）
	 * 桌面设备专用考勤页面，需要登录认证
	 */
	{
		path: '/attendance-desktop',
		name: 'AttendanceDesktop',
		component: () => import('../views/AttendancePage/AttendancePageDesktop.vue'),
		meta: {
			requiresAuth: true,
			title: '考勤签到 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统考勤签到页面，支持手机端扫码签到、查看签到记录、按月查询考勤数据'
		}
	},
	/**
	 * 数据看板路由（自动适配）
	 * 无需登录认证，展示系统统计数据
	 */
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: () => import('../views/DashboardPage/DashboardPage.vue'),
		meta: {
			requiresAuth: false,
			title: '数据看板 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统数据看板页面，实时展示积分排行、考勤统计、成员数据，为管理决策提供参考'
		}
	},
	/**
	 * 数据看板路由（桌面端）
	 * 桌面设备专用数据看板页面，无需登录认证
	 */
	{
		path: '/dashboard-desktop',
		name: 'DashboardDesktop',
		component: () => import('../views/DashboardPage/DashboardPageDesktop.vue'),
		meta: {
			requiresAuth: false,
			title: '数据看板 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统数据看板页面，实时展示积分排行、考勤统计、成员数据，为管理决策提供参考'
		}
	},
	/**
	 * 数据看板路由（移动端）
	 * 移动设备专用数据看板页面，无需登录认证
	 */
	{
		path: '/dashboard-mobile',
		name: 'DashboardMobile',
		component: () => import('../views/DashboardPage/DashboardPageMobile.vue'),
		meta: {
			requiresAuth: false,
			title: '数据看板 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统数据看板页面，实时展示积分排行、考勤统计、成员数据，为管理决策提供参考'
		}
	},
	/**
	 * 个人中心路由（自动适配）
	 * 需要登录认证，管理个人信息和账号设置
	 */
	{
		path: '/profile',
		name: 'Profile',
		component: () => import('../views/ProfilePage/ProfilePage.vue'),
		meta: {
			requiresAuth: true,
			title: '个人中心 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统个人中心页面，管理个人资料、查看积分明细、修改账号设置，支持头像上传和密码修改'
		}
	},
	/**
	 * 个人中心路由（移动端）
	 * 移动设备专用个人中心页面，需要登录认证
	 */
	{
		path: '/profile/mobile',
		name: 'ProfileMobile',
		component: () => import('../views/ProfilePage/ProfilePageMobile.vue'),
		meta: {
			requiresAuth: true,
			title: '个人中心 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统个人中心页面，管理个人资料、查看积分明细、修改账号设置，支持头像上传和密码修改'
		}
	},
	/**
	 * 个人中心路由（桌面端）
	 * 桌面设备专用个人中心页面，需要登录认证
	 */
	{
		path: '/profile/desktop',
		name: 'ProfileDesktop',
		component: () => import('../views/ProfilePage/ProfilePageDesktop.vue'),
		meta: {
			requiresAuth: true,
			title: '个人中心 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统个人中心页面，管理个人资料、查看积分明细、修改账号设置，支持头像上传和密码修改'
		}
	},
	/**
	 * 管理员后台路由（自动适配）
	 * 无需路由级认证，但需要管理员密码验证
	 */
	{
		path: '/admin',
		name: 'Admin',
		component: () => import('../views/AdminPage/AdminPage.vue'),
		meta: {
			requiresAuth: false,
			title: '管理员后台 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统管理员后台，管理成员信息、调整积分、处理补卡申请，查看考勤记录和改分记录'
		}
	},
	/**
	 * 管理员后台路由（移动端）
	 * 移动设备专用管理员后台页面，需要管理员密码验证
	 */
	{
		path: '/admin/mobile',
		name: 'AdminMobile',
		component: () => import('../views/AdminPage/AdminPageMobile.vue'),
		meta: {
			requiresAuth: false,
			title: '管理员后台 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统管理员后台，管理成员信息、调整积分、处理补卡申请，查看考勤记录和改分记录'
		}
	},
	/**
	 * 管理员后台路由（桌面端）
	 * 桌面设备专用管理员后台页面，需要管理员密码验证
	 */
	{
		path: '/admin/desktop',
		name: 'AdminDesktop',
		component: () => import('../views/AdminPage/AdminPageDesktop.vue'),
		meta: {
			requiresAuth: false,
			title: '管理员后台 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统管理员后台，管理成员信息、调整积分、处理补卡申请，查看考勤记录和改分记录'
		}
	},
	/**
	 * 学生管理页面路由（自动适配）
	 * 需要登录认证，提供学生信息查询和管理功能
	 */
	{
		path: '/student-manager',
		name: 'StudentManager',
		component: () => import('../views/StudentManagerPage/StudentManagerPage.vue'),
		meta: {
			requiresAuth: true,
			title: '学生管理 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统学生管理页面，查询和管理学生信息、编辑个人资料，支持批量操作和数据导出'
		}
	},
	/**
	 * 学生管理页面路由（移动端）
	 * 移动设备专用学生管理页面，需要登录认证
	 */
	{
		path: '/student-manager/mobile',
		name: 'StudentManagerMobile',
		component: () => import('../views/StudentManagerPage/StudentManagerPageMobile.vue'),
		meta: {
			requiresAuth: true,
			title: '学生管理 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统学生管理页面，查询和管理学生信息、编辑个人资料，支持批量操作和数据导出'
		}
	},
	/**
	 * 学生管理页面路由（桌面端）
	 * 桌面设备专用学生管理页面，需要登录认证
	 */
	{
		path: '/student-manager/desktop',
		name: 'StudentManagerDesktop',
		component: () => import('../views/StudentManagerPage/StudentManagerPageDesktop.vue'),
		meta: {
			requiresAuth: true,
			title: '学生管理 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统学生管理页面，查询和管理学生信息、编辑个人资料，支持批量操作和数据导出'
		}
	},
	/**
	 * 积分看板路由（自动适配）
	 * 无需登录认证，展示积分排行榜和统计数据
	 */
	{
		path: '/points-dashboard',
		name: 'PointsDashboard',
		component: () => import('../views/PointsDashboardPage/PointsDashboardPage.vue'),
		meta: {
			requiresAuth: false,
			title: '积分看板 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统积分看板页面，实时展示成员积分排行、签到活动数据分析，支持多维度统计查询'
		}
	},
	/**
	 * 积分看板路由（移动端）
	 * 移动设备专用积分看板页面，无需登录认证
	 */
	{
		path: '/points-dashboard-mobile',
		name: 'PointsDashboardMobile',
		component: () => import('../views/PointsDashboardPage/PointsDashboardPageMobile.vue'),
		meta: {
			requiresAuth: false,
			title: '积分看板 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统积分看板页面，实时展示成员积分排行、签到活动数据分析，支持多维度统计查询'
		}
	},
	/**
	 * 积分看板路由（桌面端）
	 * 桌面设备专用积分看板页面，无需登录认证
	 */
	{
		path: '/points-dashboard-desktop',
		name: 'PointsDashboardDesktop',
		component: () => import('../views/PointsDashboardPage/PointsDashboardPageDesktop.vue'),
		meta: {
			requiresAuth: false,
			title: '积分看板 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统积分看板页面，实时展示成员积分排行、签到活动数据分析，支持多维度统计查询'
		}
	},
	/**
	 * 改分记录路由（自动适配）
	 * 需要登录认证，查看积分调整历史记录
	 */
	{
		path: '/score-change-records',
		name: 'ScoreChangeRecords',
		component: () => import('../views/ScoreChangeRecordsPage/ScoreChangeRecordsPage.vue'),
		meta: {
			requiresAuth: true,
			title: '改分记录 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统改分记录页面，查看积分调整历史、调整时间、调整原因，透明展示积分变动明细'
		}
	},
	/**
	 * 改分记录路由（移动端）
	 * 移动设备专用改分记录页面，需要登录认证
	 */
	{
		path: '/score-change-records-mobile',
		name: 'ScoreChangeRecordsMobile',
		component: () => import('../views/ScoreChangeRecordsPage/ScoreChangeRecordsPageMobile.vue'),
		meta: {
			requiresAuth: true,
			title: '改分记录 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统改分记录页面，查看积分调整历史、调整时间、调整原因，透明展示积分变动明细'
		}
	},
	/**
	 * 改分记录路由（桌面端）
	 * 桌面设备专用改分记录页面，需要登录认证
	 */
	{
		path: '/score-change-records-desktop',
		name: 'ScoreChangeRecordsDesktop',
		component: () => import('../views/ScoreChangeRecordsPage/ScoreChangeRecordsPageDesktop.vue'),
		meta: {
			requiresAuth: true,
			title: '改分记录 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统改分记录页面，查看积分调整历史、调整时间、调整原因，透明展示积分变动明细'
		}
	},
	/**
	 * 全部成员页面路由（自动适配）
	 * 无需登录认证，展示所有成员信息和排名
	 */
	{
		path: '/all-members',
		name: 'AllMembers',
		component: () => import('../views/AllMembersPage/AllMembersPage.vue'),
		meta: {
			requiresAuth: false,
			title: '全部成员 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统全部成员页面，查看所有成员信息、积分排名、学院专业等详细资料，支持快速搜索筛选'
		}
	},
	/**
	 * 全部成员页面路由（移动端）
	 * 移动设备专用全部成员页面，无需登录认证
	 */
	{
		path: '/all-members-mobile',
		name: 'AllMembersMobile',
		component: () => import('../views/AllMembersPage/AllMembersPageMobile.vue'),
		meta: {
			requiresAuth: false,
			title: '全部成员 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统全部成员页面，查看所有成员信息、积分排名、学院专业等详细资料，支持快速搜索筛选'
		}
	},
	/**
	 * 全部成员页面路由（桌面端）
	 * 桌面设备专用全部成员页面，无需登录认证
	 */
	{
		path: '/all-members-desktop',
		name: 'AllMembersDesktop',
		component: () => import('../views/AllMembersPage/AllMembersPageDesktop.vue'),
		meta: {
			requiresAuth: false,
			title: '全部成员 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统全部成员页面，查看所有成员信息、积分排名、学院专业等详细资料，支持快速搜索筛选'
		}
	},
	/**
	 * 考勤分析页面路由（自动适配）
	 * 需要登录认证，查看考勤数据分析
	 */
	{
		path: '/attendance-analysis',
		name: 'AttendanceAnalysis',
		component: () => import('../views/AttendanceAnalysisPage/AttendanceAnalysisPage.vue'),
		meta: {
			requiresAuth: false,
			title: '考勤分析 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统考勤分析页面，查看考勤数据统计、签到趋势分析、成员考勤情况'
		}
	},
	/**
	 * 考勤分析页面路由（移动端）
	 * 移动设备专用考勤分析页面，需要登录认证
	 */
	{
		path: '/attendance-analysis-mobile',
		name: 'AttendanceAnalysisMobile',
		component: () => import('../views/AttendanceAnalysisPage/AttendanceAnalysisPageMobile.vue'),
		meta: {
			requiresAuth: false,
			title: '考勤分析 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统考勤分析页面，查看考勤数据统计、签到趋势分析、成员考勤情况'
		}
	},
	/**
	 * 考勤分析页面路由（桌面端）
	 * 桌面设备专用考勤分析页面，需要登录认证
	 */
	{
		path: '/attendance-analysis-desktop',
		name: 'AttendanceAnalysisDesktop',
		component: () => import('../views/AttendanceAnalysisPage/AttendanceAnalysisPageDesktop.vue'),
		meta: {
			requiresAuth: false,
			title: '考勤分析 - 厦工AI坊学生管理系统',
			description: '厦工AI坊学生管理系统考勤分析页面，查看考勤数据统计、签到趋势分析、成员考勤情况'
		}
	}
]

/**
 * 创建Vue Router实例
 * 使用HTML5历史模式，支持浏览器前进后退
 */
const router = createRouter({
	history: createWebHistory('/'),
	routes
})

/**
 * Token验证缓存对象
 * 用于缓存token验证结果，避免频繁请求服务器
 *
 * @type {object}
 * @property {string|null} token - 缓存的token值
 * @property {boolean} isValid - token是否有效
 * @property {number} timestamp - 缓存时间戳
 */
let tokenValidationCache = {
	token: null,
	isValid: false,
	timestamp: 0
}

/**
 * Token验证缓存有效期（毫秒）
 * 5秒内的验证结果会被缓存，减少重复验证请求
 */
const CACHE_DURATION = 5000

/**
 * 获取缓存的token验证结果
 *
 * @param token - 要验证的token
 * @returns - 如果缓存有效返回验证结果，否则返回null
 */
const getCachedValidation = token => {
	const now = Date.now()
	// 检查缓存是否有效：token匹配且未过期
	if (tokenValidationCache.token === token &&
      (now - tokenValidationCache.timestamp) < CACHE_DURATION) {
		return tokenValidationCache.isValid
	}
	return null
}

/**
 * 设置token验证结果到缓存
 *
 * @param token - 被验证的token
 * @param isValid - token是否有效
 */
const setCachedValidation = (token, isValid) => {
	tokenValidationCache = {
		token,
		isValid,
		timestamp: Date.now()
	}
}

/**
 * 全局前置路由守卫
 * 在路由跳转前执行，用于权限验证和token校验
 *
 * @param {object} to - 目标路由对象
 * @param {object} from - 来源路由对象
 * @param {Function} next - 路由跳转控制函数
 */
router.beforeEach(async (to, from, next) => {
	const token = localStorage.getItem('token')

	// 处理需要认证的路由
	if (to.meta.requiresAuth) {
		// 如果没有token，直接跳转到登录页
		if (!token) {
			next('/login')
			return
		}

		// 检查缓存中的验证结果
		const cachedResult = getCachedValidation(token)
		if (cachedResult !== null) {
			// 如果缓存显示token无效，清除本地存储并跳转登录
			if (!cachedResult) {
				localStorage.removeItem('token')
				localStorage.removeItem('userInfo')
				tokenValidationCache = { token: null, isValid: false, timestamp: 0 }
				next('/login')
				return
			}
			// 缓存有效，允许访问
			next()
			return
		}

		// 缓存无效，向服务器验证token
		try {
			const isValid = await validateToken(token)
			setCachedValidation(token, isValid)
			if (!isValid) {
				// token无效，清除本地存储并跳转登录
				localStorage.removeItem('token')
				localStorage.removeItem('userInfo')
				next('/login')
				return
			}
		} catch (error) {
			// 验证失败，标记为无效并清除本地存储
			setCachedValidation(token, false)
			localStorage.removeItem('token')
			localStorage.removeItem('userInfo')
			next('/login')
			return
		}
	}

	// 如果已登录用户访问登录页，验证token后跳转到导航页
	if (to.path === '/login' && token) {
		const cachedResult = getCachedValidation(token)
		if (cachedResult === null) {
			// 缓存无效，向服务器验证
			try {
				const isValid = await validateToken(token)
				setCachedValidation(token, isValid)
				if (isValid) {
					// token有效，跳转到导航页
					next('/navigation')
					return
				}
				// token无效，清除本地存储
				localStorage.removeItem('token')
				localStorage.removeItem('userInfo')
			} catch (error) {
				// 验证失败，清除本地存储
				setCachedValidation(token, false)
				localStorage.removeItem('token')
				localStorage.removeItem('userInfo')
			}
		} else {
			// 使用缓存结果
			if (cachedResult) {
				next('/navigation')
				return
			}
			// 缓存显示无效，清除本地存储
			localStorage.removeItem('token')
			localStorage.removeItem('userInfo')
			tokenValidationCache = { token: null, isValid: false, timestamp: 0 }
		}
	}

	// 允许访问目标路由
	next()
})

/**
 * 全局后置路由守卫
 * 在路由跳转完成后执行，用于更新页面标题和SEO元信息
 *
 * @param {object} to - 目标路由对象
 */
router.afterEach(to => {
	// 更新页面标题
	if (to.meta.title) {
		document.title = to.meta.title
	}

	// 更新SEO描述信息
	if (to.meta.description) {
		let descriptionMeta = document.querySelector('meta[name="description"]')
		// 如果不存在description meta标签，则创建
		if (!descriptionMeta) {
			descriptionMeta = document.createElement('meta')
			descriptionMeta.name = 'description'
			document.head.appendChild(descriptionMeta)
		}
		descriptionMeta.content = to.meta.description
	}
})

export default router
