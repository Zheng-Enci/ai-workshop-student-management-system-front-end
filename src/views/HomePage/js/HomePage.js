import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { getAvatarUrl } from '@/api/student'
import { useThemeStore } from '@/stores/theme'

export const useHomePageLogic = () => {
	// 路由实例
	const router = useRouter()

	// 主题存储
	const themeStore = useThemeStore()

	// 联系表单可见性状态
	const contactFormVisible = ref(false)

	// 开发者头像URL
	const developerAvatar = ref('')

	// 主题切换功能
	const toggleTheme = () => {
		themeStore.toggleTheme()
	}

	// 跳转到登录页面
	const goToLogin = () => {
		router.push('/login')
	}

	// 跳转到仪表板页面
	const goToDashboard = () => {
		router.push('/dashboard')
	}

	// 跳转到考勤分析页面
	const goToAttendanceAnalysis = () => {
		router.push('/attendance-analysis')
	}

	// 跳转到积分仪表板页面
	const goToPointsDashboard = () => {
		router.push('/points-dashboard')
	}

	// 跳转到所有成员页面
	const goToAllMembers = () => {
		router.push('/all-members')
	}

	// 显示联系表单
	const showContactForm = () => {
		contactFormVisible.value = true
	}

	// 处理头像加载错误
	const handleAvatarError = event => {
		const { target } = event
		target.src = '@/assets/default-avatar.png'
	}

	// 获取开发者头像
	const fetchDeveloperAvatar = async () => {
		try {
			const avatarUrl = await getAvatarUrl(1)
			developerAvatar.value = avatarUrl
		} catch (error) {
			console.error('获取开发者头像失败:', error)
			developerAvatar.value = '@/assets/default-avatar.png'
		}
	}

	// 在组件挂载时获取开发者头像
	onMounted(() => {
		fetchDeveloperAvatar()
	})

	// 返回所有需要的属性和方法
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
