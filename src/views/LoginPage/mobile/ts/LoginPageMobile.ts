/**
 * LoginPageMobile 业务逻辑类
 * 移动端登录页面业务逻辑
 *
 * @file LoginPageMobile.ts
 * @description 处理移动端登录页面的所有业务逻辑，包括表单验证、登录请求、状态管理等
 */

// ===================== 第三方依赖导入区 =====================
// Element Plus 消息提示组件
import { ElMessage } from 'element-plus'
// Vue3 核心API:响应式变量、组件挂载生命周期
import { ref, onMounted, type Ref } from 'vue'
// Vue Router 路由功能
import { useRouter, type Router } from 'vue-router'

// ===================== 业务模块导入区 =====================
// 学生相关API:登录接口
import { login } from '@/api/student'
// 学生API封装类:获取学生数据库主键ID
import StudentApi from '@/api/StudentApi'
// Pinia状态管理:主题切换功能
import { useThemeStore } from '@/stores/theme'
// Pinia状态管理:用户信息存储
import { useUserStore } from '@/stores/user'

/**
 * 登录表单数据接口
 * @interface LoginForm
 * @property {string} studentId - 学生学号
 * @property {string} password - 登录密码
 */
interface LoginForm {
	studentId: string
	password: string
}

/**
 * 移动端登录页面业务逻辑类
 * @class LoginPageMobile
 * @description 封装移动端登录页面的所有业务逻辑，使用面向对象方式组织代码
 */
export default class LoginPageMobile {
	// ===================== 路由和状态管理实例 =====================
	/**
	 * 路由实例
	 * @type {Router}
	 * @description 用于页面跳转和路由导航
	 */
	private router: Router

	/**
	 * 用户状态仓库实例
	 * @type {ReturnType<typeof useUserStore>}
	 * @description 管理用户登录态、用户信息存储和获取
	 */
	private userStore: ReturnType<typeof useUserStore>

	/**
	 * 主题状态仓库实例
	 * @type {ReturnType<typeof useThemeStore>}
	 * @description 管理应用主题切换(亮色/暗色模式)
	 */
	private themeStore: ReturnType<typeof useThemeStore>

	// ===================== 响应式状态变量 =====================
	/**
	 * 登录表单数据模型
	 * @type {Ref<LoginForm>}
	 * @description 包含学号和密码的响应式表单数据
	 */
	public form: Ref<LoginForm>

	/**
	 * 记住我复选框状态
	 * @type {Ref<boolean>}
	 * @description 控制是否保存用户登录信息到本地存储
	 */
	public rememberMe: Ref<boolean>

	/**
	 * 登录按钮加载状态
	 * @type {Ref<boolean>}
	 * @description 控制登录按钮的loading状态，防止重复提交
	 */
	public isLoading: Ref<boolean>

	/**
	 * 学生头像URL
	 * @type {Ref<string | null>}
	 * @description 存储学生头像的URL地址
	 */
	public studentAvatarUrl: Ref<string | null>

	/**
	 * 表单验证规则配置
	 * @type {Object}
	 * @description Element Plus表单验证规则，包含必填、格式、长度等校验
	 */
	public rules = {
		/**
		 * 学号验证规则
		 * @description 包含必填校验和格式校验(10位数字)
		 */
		studentId: [
			{ required: true, message: '请输入学号', trigger: 'blur' },
			{ pattern: /^\d{10}$/, message: '学号必须为 10 位数字', trigger: 'blur' }
		],
		/**
		 * 密码验证规则
		 * @description 包含必填校验和长度校验(6-16位)
		 */
		password: [
			{ required: true, message: '请输入密码', trigger: 'blur' },
			{ min: 6, message: '密码长度至少 6 位', trigger: 'blur' },
			{ max: 16, message: '密码长度不能超过 16 位', trigger: 'blur' }
		]
	}

	// ===================== 构造函数 =====================
	/**
	 * 构造函数
	 * @constructor
	 * @description 初始化路由、状态管理和响应式变量
	 */
	constructor() {
		// 初始化路由实例
		this.router = useRouter()
		// 初始化用户状态仓库
		this.userStore = useUserStore()
		// 初始化主题状态仓库
		this.themeStore = useThemeStore()

		// 初始化响应式变量
		this.form = ref<LoginForm>({
			studentId: '',
			password: ''
		})
		this.rememberMe = ref<boolean>(false)
		this.isLoading = ref<boolean>(false)
		this.studentAvatarUrl = ref<string | null>(null)

		// 组件挂载时恢复记住的用户信息，并尝试加载头像
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

	// ===================== 公开方法 =====================
	/**
	 * 主题切换方法
	 * @method toggleTheme
	 * @description 切换应用主题（亮色/暗色模式）
	 */
	public toggleTheme(): void {
		this.themeStore.toggleTheme()
	}

	/**
	 * 返回首页
	 * @method goToHome
	 * @description 点击首页按钮时触发，跳转到系统首页
	 */
	public goToHome(): void {
		this.router.push('/')
	}

	/**
	 * 处理登录操作
	 * @method handleLogin
	 * @description 执行登录流程的核心方法，包含以下步骤：
	 * 1. 开启加载状态，防止重复提交
	 * 2. 调用登录API接口，获取token和用户基础信息
	 * 3. 根据token获取学生数据库主键ID
	 * 4. 构建完整的用户信息对象并存储到状态管理
	 * 5. 根据"记住我"选项决定是否保存登录信息到本地存储
	 * 6. 显示成功提示并跳转到导航页面
	 * @async
	 * @returns {Promise<void>}
	 */
	public async handleLogin(): Promise<void> {
		// 开启加载状态，禁用登录按钮
		this.isLoading.value = true
		try {
			// 第一步：调用登录API，传入学号和密码
			const response = await login(this.form.value)

			// 第二步：使用返回的token获取学生数据库表主键ID
			// 这个ID用于后续的用户信息关联和头像获取等操作
			const studentDbIdResponse = await StudentApi.getStudentDatabaseTableId(response.data.token)
			const studentDbId = studentDbIdResponse.data

			// 第三步：构建完整的用户信息对象
			// 合并登录接口返回的数据、学号和数据库主键ID
			const userInfo = {
				...response.data,
				studentId: this.form.value.studentId,
				studentDatabaseTableId: studentDbId
			}
			// 将用户信息和token存储到Pinia状态管理中
			this.userStore.setUserInfo(userInfo, response.data.token)

			// 第四步：处理"记住我"功能
			this.handleRememberMe()

			// 第五步：显示成功提示并跳转到导航页面
			ElMessage.success('登录成功')
			await this.router.push('/navigation')
		} catch (error: any) {
			// 异常处理：显示错误提示信息
			ElMessage.error(error.message || '登录失败，请检查您的学号和密码')
		} finally {
			// 无论成功或失败，都要关闭加载状态
			this.isLoading.value = false
		}
	}

	// ===================== 私有方法 =====================
	/**
	 * 根据学号获取学生头像
	 * @method fetchStudentAvatar
	 * @description 当学号输入框失去焦点时触发，根据学号获取对应的学生头像
	 * @async
	 * @returns {Promise<void>}
	 */
	public async fetchStudentAvatar(): Promise<void> {
		if (!this.form.value.studentId || !/^\d{10}$/.test(this.form.value.studentId)) {
			this.studentAvatarUrl.value = null
			return
		}

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
		}
	}

	/**
	 * 处理"记住我"功能
	 * @method handleRememberMe
	 * @description 如果用户勾选了记住我，将学号和密码保存到本地存储；否则清除本地存储中的记住信息
	 * @private
	 */
	private handleRememberMe(): void {
		if (this.rememberMe.value) {
			localStorage.setItem('rememberedUser', JSON.stringify({
				studentId: this.form.value.studentId,
				password: this.form.value.password
			}))
		} else {
			localStorage.removeItem('rememberedUser')
		}
	}

}
