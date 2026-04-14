/**
 * LoginPageDesktop.ts
 * 桌面端登录页面逻辑
 * 提供登录功能、头像获取、表单验证等
 *
 * @file LoginPageDesktop.ts
 * @description 桌面端登录页面的业务逻辑
 */

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/student'
import StudentApi from '@/api/ts/StudentApi'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'

/**
 * LoginPageDesktop 类
 * 封装桌面端登录页面的所有业务逻辑
 */
export default class LoginPageDesktop {
	/**
	 * 路由实例
	 */
	private router = useRouter()

	/**
	 * 用户状态仓库实例
	 */
	private userStore = useUserStore()

	/**
	 * 主题状态仓库实例
	 */
	private themeStore = useThemeStore()

	/**
	 * 主题切换方法
	 */
	public toggleTheme = this.themeStore.toggleTheme

	/**
	 * 登录表单数据模型
	 */
	public form = ref({
		studentId: '',
		password: ''
	})

	/**
	 * 记住我复选框状态
	 */
	public rememberMe = ref(false)

	/**
	 * 登录按钮加载状态
	 */
	public isLoading = ref(false)

	/**
	 * 学生头像URL
	 */
	public studentAvatarUrl = ref(null)

	/**
	 * 头像加载状态
	 * @description 控制头像加载动画的显示状态
	 */
	public isAvatarLoading = ref(false)

	/**
	 * 表单验证规则配置
	 */
	public rules = {
		studentId: [
			{ required: true, message: '请输入学号', trigger: 'blur' },
			{ pattern: /^\d{10}$/, message: '学号必须为 10 位数字', trigger: 'blur' }
		],
		password: [
			{ required: true, message: '请输入密码', trigger: 'blur' },
			{ min: 6, message: '密码长度至少 6 位', trigger: 'blur' },
			{ max: 16, message: '密码长度不能超过 16 位', trigger: 'blur' }
		]
	}

	/**
	 * 处理登录操作
	 *
	 * @async
	 * @returns {Promise<void>}
	 */
	public async handleLogin(): Promise<void> {
		this.isLoading.value = true
		try {
			const response = await login(this.form.value)
			const studentDbIdResponse = await StudentApi.getStudentDatabaseTableId(response.data.token)
			const studentDbId = studentDbIdResponse.data

			const userInfo = {
				...response.data,
				studentId: this.form.value.studentId,
				studentDatabaseTableId: studentDbId
			}
			this.userStore.setUserInfo(userInfo, response.data.token)

			if (this.rememberMe.value) {
				localStorage.setItem('rememberedUser', JSON.stringify({
					studentId: this.form.value.studentId,
					password: this.form.value.password
				}))
			} else {
				localStorage.removeItem('rememberedUser')
			}

			ElMessage.success('登录成功')
			await this.router.push('/navigation')
		} catch (error: any) {
			ElMessage.error(error.message || '登录失败，请检查您的学号和密码')
		} finally {
			this.isLoading.value = false
		}
	}

	/**
	 * 返回首页
	 */
	public goToHome(): void {
		this.router.push('/')
	}

	/**
	 * 根据学号获取学生头像
	 *
	 * @async
	 * @returns {Promise<void>}
	 */
	public async fetchStudentAvatar(): Promise<void> {
		if (!this.form.value.studentId || !/^\d{10}$/.test(this.form.value.studentId)) {
			this.studentAvatarUrl.value = null
			return
		}

		// 开始加载头像，显示加载动画
		// Start loading avatar, show loading animation
		this.isAvatarLoading.value = true
		this.studentAvatarUrl.value = null

		// 延迟3秒用于测试加载动画效果
		// Delay 3 seconds for testing loading animation effect
		await new Promise(resolve => setTimeout(resolve, 3000))

		try {
			// 获取256x256像素的头像，确保在100px显示尺寸下有清晰的视觉效果
			// Fetch 256x256 pixel avatar to ensure clear visual quality at 100px display size
			const avatarUrl = StudentApi.getAvatarUrlByStudentId(this.form.value.studentId, 256)
			if (avatarUrl) {
				// 添加时间戳参数强制刷新头像，避免浏览器缓存导致修改学号后头像不更新
				// 使用 & 连接符，因为 avatarUrl 已经包含 ?avatarSize=256 参数
				// Add timestamp parameter using & connector since avatarUrl already contains query params
				const separator = avatarUrl.includes('?') ? '&' : '?'
				this.studentAvatarUrl.value = `${avatarUrl}${separator}t=${Date.now()}`
			} else {
				// 如果获取不到头像URL，清空头像显示
				// Clear avatar display if avatar URL cannot be fetched
				this.studentAvatarUrl.value = null
			}
		} catch (error) {
			// 获取失败时清空头像
			// Clear avatar when fetch fails
			this.studentAvatarUrl.value = null
		} finally {
			// 加载完成，隐藏加载动画
			// Loading complete, hide loading animation
			this.isAvatarLoading.value = false
		}
	}

	/**
	 * 初始化方法
	 * 组件挂载时恢复记住的用户信息，并尝试加载头像
	 */
	public init(): void {
		onMounted(async () => {
			const rememberedUser = localStorage.getItem('rememberedUser')
			if (rememberedUser) {
				try {
					const userData = JSON.parse(rememberedUser)
					this.form.value.studentId = userData.studentId
					this.form.value.password = userData.password
					this.rememberMe.value = true
					// 自动加载头像
					await this.fetchStudentAvatar()
				} catch (error) {
					localStorage.removeItem('rememberedUser')
				}
			}
		})
	}
}
