/**
 * 注册页面移动端逻辑类
 *
 * @description 封装注册页面移动端的所有业务逻辑，包括表单校验、注册提交、自动登录等功能
 * @class RegisterPageMobile
 */

// ===================== 第三方依赖导入 =====================
// Vue3 响应式 API
import { ref, type Ref, reactive } from 'vue'
// Vue Router 路由实例类型
import type { Router } from 'vue-router'

// ===================== 业务模块导入 =====================
// 学生 API 封装类：注册、登录、获取学生数据库主键 ID
import StudentApi from '@/api/ts/StudentApi'
// 状态管理：用户信息（登录态存储）
import { useUserStore } from '@/stores/ts/user'
// 状态管理：主题（暗黑/亮色）
import { useThemeStore } from '@/stores/ts/theme'
// 表单数据类
import RegisterFormData from './RegisterFormData'

export default class RegisterPageMobile {
	// ===================== 私有属性 =====================
	/**
	 * 路由实例
	 * @private
	 */
	private _router: Router

	/**
	 * 用户信息状态管理
	 * @private
	 */
	private _userStore: ReturnType<typeof useUserStore>

	/**
	 * 主题状态管理
	 * @private
	 */
	private _themeStore: ReturnType<typeof useThemeStore>

	/**
	 * 表单数据实例（响应式）
	 * @private
	 */
	private _formData: RegisterFormData

	// ===================== 公共响应式属性 =====================
	/**
	 * 表单引用实例（用于表单校验）
	 * @public
	 */
	public formRef: Ref<{ validate: () => Promise<void> } | null>

	/**
	 * 消息提示实例（从 Vue 文件注入）
	 * @public
	 */
	public message: any

	/**
	 * 注册按钮加载状态（防止重复提交）
	 * @public
	 */
	public isLoading: Ref<boolean>

	/**
	 * 表单校验规则配置
	 * @public
	 */
	public rules: Record<string, any>

	// ===================== 静态数据 =====================
	/**
	 * 学院下拉选项列表（静态数据）
	 * @public
	 * @readonly
	 */
	public readonly collegeOptions: string[] = [
		'融新学院',
		'机械电气与信息工程学院',
		'建筑科学与土木工程学院',
		'人工智能学院',
		'商 学 院',
		'博雅教育与艺术传媒学院',
		'外国语学院',
		'国 学 院',
		'国际教育学院',
		'继续教育学院'
	]

	// ===================== 构造函数 =====================
	/**
	 * 构造函数
	 * @constructor
	 * @param {Router} router - Vue Router 实例
	 */
	constructor(router: Router) {
		this._router = router
		this._userStore = useUserStore()
		this._themeStore = useThemeStore()
		// 使用 reactive 包装表单数据，确保响应式
		this._formData = reactive(new RegisterFormData())

		// 初始化响应式属性
		this.formRef = ref(null)
		this.isLoading = ref(false)

		// 初始化表单校验规则
		this.rules = this._initRules()
	}

	// ===================== Getter 方法 =====================
	/**
	 * 获取表单数据
	 * @getter form
	 * @returns {RegisterFormData} 表单数据实例
	 */
	public get form(): RegisterFormData {
		return this._formData
	}

	/**
	 * 获取主题切换方法
	 * @getter toggleTheme
	 * @returns {Function} 主题切换方法
	 */
	public get toggleTheme(): () => void {
		return this._themeStore.toggleTheme
	}

	// ===================== 私有方法 =====================
	/**
	 * 初始化表单校验规则
	 * @private
	 * @method _initRules
	 * @returns {Object} 表单校验规则配置对象
	 */
	private _initRules(): Record<string, any> {
		const self = this
		return {
			// 姓名校验：必填
			name: [
				{ required: true, message: '请输入姓名', trigger: 'blur' }
			],
			// 学号校验：必填 + 格式（长度为10位数字，起始范围为20-30）
			studentId: [
				{ required: true, message: '请输入学号', trigger: 'blur' },
				{
					pattern: /^(20|21|22|23|24|25|26|27|28|29|30)\d{8}$/,
					message: '学号必须为10位数字，且以20-30开头',
					trigger: 'blur'
				}
			],
			// 性别校验：必填
			gender: [
				{ required: true, message: '请选择性别', trigger: 'change' }
			],
			// 手机号校验：必填 + 格式（长度为11位，起始范围为13-19）
			phoneNumber: [
				{ required: true, message: '请输入手机号', trigger: 'blur' },
				{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
			],
			// 学院校验：必填
			college: [
				{ required: true, message: '请选择学院', trigger: 'change' }
			],
			// 专业校验：必填
			major: [
				{ required: true, message: '请输入专业', trigger: 'blur' }
			],
			// 年级校验：必填 + 自定义验证（1-5之间）
			grade: [
				{ required: true, message: '请选择年级', trigger: 'change' },
				{
					validator: (_rule: unknown, value: string, callback: (error?: Error) => void) => {
						if (!value) {
							callback(new Error('请选择年级'))
						} else if (!['1', '2', '3', '4', '5'].includes(value)) {
							callback(new Error('年级必须在 1-5 之间'))
						} else {
							callback()
						}
					},
					trigger: 'change'
				}
			],
			// 班级校验：必填 + 数字范围（1-100）
			classNum: [
				{ required: true, message: '请输入班级', trigger: 'blur' },
				{ type: 'number', min: 1, max: 100, message: '班级必须在 1-100 之间', trigger: 'blur' }
			],
			// 密码校验：必填 + 长度（6-16位）
			password: [
				{ required: true, message: '请输入密码', trigger: 'blur' },
				{ min: 6, message: '密码长度至少 6 位', trigger: 'blur' },
				{ max: 16, message: '密码长度不能超过 16 位', trigger: 'blur' }
			],
			// 确认密码校验：必填 + 自定义验证（与密码一致）
			confirmPassword: [
				{ required: true, message: '请确认密码', trigger: 'blur' },
				{
					validator: (_rule: unknown, value: string, callback: (error?: Error) => void) => {
						if (value !== self._formData.password) {
							callback(new Error('两次输入的密码不一致'))
						} else {
							callback()
						}
					},
					trigger: 'blur'
				}
			],
			// 邀请码校验：必填 + UUID格式
			invitationCode: [
				{ required: true, message: '请输入邀请码', trigger: 'blur' },
				{
					pattern: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
					message: '请输入正确的邀请码格式',
					trigger: 'blur'
				}
			]
		}
	}

	// ===================== 公共方法 =====================
	/**
	 * 处理注册提交逻辑
	 * @method handleRegister
	 * @description 1. 表单校验 → 2. 提交注册数据 → 3. 自动登录 → 4. 存储用户信息 → 5. 跳转导航页
	 * @async
	 * @returns {Promise<void>}
	 */
	public async handleRegister(): Promise<void> {
		// 测试：每次点击注册按钮输出 666
		this.message.info('666')
		console.log('handleRegister 被调用')
		console.log('formRef.value:', this.formRef.value)

		// 表单实例不存在时直接返回（容错）
		if (!this.formRef.value) {
			console.log('formRef.value 为空，直接返回')
			this.message.error('表单实例不存在')
			return
		}

		// 第一步：表单校验（同步校验）
		console.log('开始表单校验...')
		try {
			await this.formRef.value.validate()
			console.log('表单校验通过')
		} catch (error) {
			// 校验失败时终止流程
			console.log('表单校验失败:', error)
			this.message.error('表单校验失败，请检查输入')
			return
		}

		// 第二步：提交注册请求（开启加载状态）
		this.isLoading.value = true
		console.log('=== 开始注册流程 ===')
		try {
			// 组装注册数据（转换年级/班级为数字类型）
			const registerData = this._formData.toSubmitData()
			console.log('注册数据:', registerData)
			// 调用注册 API
			console.log('调用 StudentApi.register...')
			await StudentApi.register(registerData)
			console.log('StudentApi.register 成功')
			// 注册成功提示
			this.message.success('注册成功！正在为您登录...')

			// 第三步：自动登录（使用注册的学号/密码）
			const loginData = {
				studentId: this._formData.studentId,
				password: this._formData.password
			}
			// 调用登录 API
			const response = await StudentApi.login(loginData)

			// 第四步：获取学生数据库主键 ID（关联用户信息）
			const studentDbIdResponse = await StudentApi.getStudentDatabaseTableId(response.data.token)
			const studentDbId = studentDbIdResponse.data

			// 第五步：组装用户信息并存储到状态管理
			const userInfo = {
				...response.data,
				studentId: this._formData.studentId,
				studentDatabaseTableId: studentDbId
			}
			this._userStore.setUserInfo(userInfo, response.data.token)

			// 第六步：跳转到导航主页面
			void this._router.push('/navigation')
		} catch (error: any) {
			// 调试：输出错误对象详细信息
			console.log('=== 错误调试信息 ===')
			console.log('error:', error)
			console.log('error.message:', error.message)
			console.log('error.response:', error.response)
			console.log('error.response?.data:', error.response?.data)
			console.log('error.response?.data?.message:', error.response?.data?.message)
			console.log('====================')

			// 异常处理：显示错误信息（StudentApi 已经将服务器返回的 message 设置到 error.message 中）
			const errorMessage = error.message || '注册失败，请检查您的信息'
			this.message.error('调试: ' + errorMessage)
		} finally {
			// 最终：关闭加载状态（无论成功/失败）
			this.isLoading.value = false
		}
	}

	/**
	 * 跳转至首页
	 * @method goToHome
	 * @description 点击首页按钮时触发，返回系统首页
	 */
	public goToHome(): void {
		void this._router.push('/')
	}

	/**
	 * 检查登录状态并跳转
	 * @method checkLoginStatus
	 * @description 检测本地存储的 token，已登录状态自动跳转至导航页（防止重复注册）
	 */
	public checkLoginStatus(): void {
		// 从本地存储获取 token（登录态标识）
		const token = localStorage.getItem('token')
		// 存在 token 说明已登录，直接跳转导航页
		if (token) {
			void this._router.push('/navigation')
		}
	}
}
