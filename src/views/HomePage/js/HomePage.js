/**
 * 首页逻辑管理模块
 * 提供首页相关的业务逻辑和状态管理
 *
 * @module views/HomePage/js/HomePage
 * @description 管理首页的路由导航、主题切换、头像加载等功能
 */

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { getAvatarUrl } from '@/api/student'
import { useThemeStore } from '@/stores/theme'

/**
 * 首页逻辑Composable函数
 * 封装首页的所有业务逻辑和状态管理
 *
 * @returns 包含状态和方法的对象，供组件使用
 */
export const useHomePageLogic = () => {
	/**
	 * 路由实例
	 * 用于页面导航和路由跳转
	 */
	const router = useRouter()

	/**
	 * 主题存储实例
	 * 用于管理应用主题（深色/浅色模式）
	 */
	const themeStore = useThemeStore()

	/**
	 * 联系表单可见性状态
	 * 控制联系表单对话框的显示/隐藏
	 *
	 * @type {Ref<boolean>}
	 */
	const contactFormVisible = ref(false)

	/**
	 * 开发者头像URL
	 * 存储开发者头像的URL地址
	 *
	 * @type {Ref<string>}
	 */
	const developerAvatar = ref('')

	/**
	 * 主题切换功能
	 * 切换应用的主题模式（深色/浅色）
	 */
	const toggleTheme = () => {
		themeStore.toggleTheme()
	}

	/**
	 * 跳转到登录页面
	 * 导航到用户登录页面
	 */
	const goToLogin = () => {
		router.push('/login')
	}

	/**
	 * 跳转到仪表板页面
	 * 导航到数据看板页面，查看系统统计数据
	 */
	const goToDashboard = () => {
		router.push('/dashboard')
	}

	/**
	 * 跳转到考勤分析页面
	 * 导航到考勤分析页面，查看考勤数据可视化
	 */
	const goToAttendanceAnalysis = () => {
		router.push('/attendance-analysis')
	}

	/**
	 * 跳转到积分仪表板页面
	 * 导航到积分看板页面，查看积分排行榜
	 */
	const goToPointsDashboard = () => {
		router.push('/points-dashboard')
	}

	/**
	 * 跳转到所有成员页面
	 * 导航到全部成员页面，查看所有成员信息
	 */
	const goToAllMembers = () => {
		router.push('/all-members')
	}

	/**
	 * 显示联系表单
	 * 打开联系表单对话框
	 */
	const showContactForm = () => {
		contactFormVisible.value = true
	}

	/**
	 * 处理头像加载错误
	 * 当头像加载失败时，使用默认头像替换
	 *
	 * @param event - 图片加载错误事件
	 */
	const handleAvatarError = event => {
		const { target } = event
		// 设置默认头像路径
		target.src = '@/assets/default-avatar.png'
	}

	/**
	 * 获取开发者头像
	 * 从API获取开发者头像URL（学生ID为1）
	 * 如果获取失败，使用默认头像
	 */
	const fetchDeveloperAvatar = async () => {
		try {
			// 获取学生ID为1的头像URL
			const avatarUrl = await getAvatarUrl(1)
			developerAvatar.value = avatarUrl
		} catch (error) {
			console.error('获取开发者头像失败:', error)
			// 获取失败时使用默认头像
			developerAvatar.value = '@/assets/default-avatar.png'
		}
	}

	/**
	 * 组件挂载时的初始化操作
	 * 在组件挂载时自动获取开发者头像
	 */
	onMounted(() => {
		fetchDeveloperAvatar()
	})

	/**
	 * 返回所有需要的属性和方法
	 * 供组件使用，包括状态和方法
	 */
	return {
		toggleTheme,
		contactFormVisible,
		developerAvatar,
		goToLogin,
		goToDashboard,
		goToAttendanceAnalysis,
		goToPointsDashboard,
		goToAllMembers,
		showContactForm,
		handleAvatarError
	}
}
