<script setup>
/**
 * 登录页面组件
 * 
 * @description 提供用户登录功能,支持记住密码、验证输入等
 * @component LoginPage
 */
// ===================== 第三方依赖导入区 =====================
// Element Plus 图标组件:用户、锁、首页图标
import { User, Lock, House } from '@element-plus/icons-vue'
// Element Plus 核心组件:表单、表单项、输入框、按钮、消息提示、复选框、图标
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage, ElCheckbox, ElIcon } from 'element-plus'
// Vue3 核心API:响应式变量、组件挂载生命周期
import { ref, onMounted } from 'vue'
// Element Plus 基础样式文件(按需导入,减小打包体积)
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-checkbox.css'
import 'element-plus/theme-chalk/el-icon.css'
// Vue Router 路由功能导入
import { useRouter } from 'vue-router'

// ===================== 样式导入 =====================
// 桌面端登录页面样式
import '@/views/LoginPage/desktop/css/LoginPageDesktop.css'

// ===================== 业务模块导入区 =====================
// 学生相关API:登录接口
import { login } from '@/api/student'
// 学生API封装类:获取学生数据库主键ID
import StudentApi from '@/api/StudentApi'
// Pinia状态管理:主题切换功能
import { useThemeStore } from '@/stores/theme'
// Pinia状态管理:用户信息存储
import { useUserStore } from '@/stores/user'

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
 * @description 管理用户登录态、用户信息存储和获取
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
 * 登录表单数据模型
 * @type {Ref<Object>}
 * @property {string} studentId - 学生学号(10位数字)
 * @property {string} password - 登录密码(6-16位字符)
 */
const form = ref({
	studentId: '',
	password: ''
})
/**
 * 记住我复选框状态
 * @type {Ref<boolean>}
 * @description 控制是否保存用户登录信息到本地存储
 */
const rememberMe = ref(false)
/**
 * 登录按钮加载状态
 * @type {Ref<boolean>}
 * @description 控制登录按钮的loading状态,防止重复提交
 */
const isLoading = ref(false)

/**
 * 表单验证规则配置
 * @type {Object}
 * @description Element Plus表单验证规则,包含必填、格式、长度等校验
 * @property {Array} studentId - 学号验证规则数组
 * @property {Array} password - 密码验证规则数组
 */
const rules = {
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

/**
 * 处理登录操作
 * 
 * @function handleLogin
 * @description 执行登录流程的核心方法,包含以下步骤:
 * 1. 开启加载状态,防止重复提交
 * 2. 调用登录API接口,获取token和用户基础信息
 * 3. 根据token获取学生数据库主键ID
 * 4. 构建完整的用户信息对象并存储到状态管理
 * 5. 根据"记住我"选项决定是否保存登录信息到本地存储
 * 6. 显示成功提示并跳转到导航页面
 * 
 * @async
 * @returns {Promise<void>}
 */
const handleLogin = async () => {
	// 开启加载状态,禁用登录按钮
	isLoading.value = true
	try {
		// 第一步:调用登录API,传入学号和密码
		const response = await login(form.value)
		
		// 第二步:使用返回的token获取学生数据库表主键ID
		// 这个ID用于后续的用户信息关联和头像获取等操作
		const studentDbIdResponse = await StudentApi.getStudentDatabaseTableId(response.data.token)
		const studentDbId = studentDbIdResponse.data

		// 第三步:构建完整的用户信息对象
		// 合并登录接口返回的数据、学号和数据库主键ID
		const userInfo = {
			...response.data,
			studentId: form.value.studentId,
			studentDatabaseTableId: studentDbId
		}
		// 将用户信息和token存储到Pinia状态管理中
		userStore.setUserInfo(userInfo, response.data.token)

		// 第四步:处理"记住我"功能
		// 如果用户勾选了记住我,将学号和密码保存到本地存储
		// 否则清除本地存储中的记住信息
		if (rememberMe.value) {
			localStorage.setItem('rememberedUser', JSON.stringify({
				studentId: form.value.studentId,
				password: form.value.password
			}))
		} else {
			localStorage.removeItem('rememberedUser')
		}

		// 第五步:显示成功提示并跳转到导航页面
		ElMessage.success('登录成功')
		router.push('/navigation')
	} catch (error) {
		// 异常处理:显示错误提示信息
		ElMessage.error(error.message || '登录失败，请检查您的学号和密码')
	} finally {
		// 无论成功或失败,都要关闭加载状态
		isLoading.value = false
	}
}

/**
 * 返回首页
 * 
 * @function goToHome
 * @description 点击首页按钮时触发,跳转到系统首页
 */
const goToHome = () => {
	router.push('/')
}

/**
 * 组件挂载生命周期钩子
 * 
 * @description 组件挂载完成后自动执行,用于恢复"记住我"功能保存的用户信息
 * 流程:
 * 1. 从本地存储读取保存的用户信息
 * 2. 如果存在,解析JSON数据并填充到表单
 * 3. 自动勾选"记住我"复选框
 * 4. 如果数据解析失败,清除本地存储中的无效数据
 */
onMounted(() => {
	// 从本地存储获取保存的用户信息
	const rememberedUser = localStorage.getItem('rememberedUser')
	if (rememberedUser) {
		try {
			// 解析JSON字符串为对象
			const userData = JSON.parse(rememberedUser)
			// 填充学号和密码到表单
			form.value.studentId = userData.studentId
			form.value.password = userData.password
			// 自动勾选"记住我"复选框
			rememberMe.value = true
		} catch (error) {
			// 如果数据解析失败(可能是数据损坏),清除本地存储
			// 避免下次加载时再次尝试解析无效数据
			localStorage.removeItem('rememberedUser')
		}
	}
})
</script>

<template>
	<!-- 登录页面容器 -->
	<div class="login-page-desktop-container">
		<!-- 背景装饰效果 -->
		<div class="login-page-desktop-background-effects">
			<div class="login-page-desktop-gradient-orb orb-1"/>
			<div class="login-page-desktop-gradient-orb orb-2"/>
			<div class="login-page-desktop-gradient-orb orb-3"/>
		</div>

		<!-- 返回首页按钮 -->
		<el-button
			class="login-page-desktop-home-btn"
			type="primary"
			:icon="House"
			circle
			@click="goToHome"/>

		<!-- Logo - 右上角 -->
		<img
			src="@/assets/AiWorkShop_icon.png"
			alt="AI坊学生管理系统"
			class="login-page-desktop-logo"
			title="切换主题模式"
			@click="toggleTheme"/>

		<!-- 页面标题 - 顶部居中 -->
		<div class="login-page-desktop-page-title">
			<h1>AI坊学生管理系统</h1>
			<p class="login-page-desktop-subtitle">人工智能创作坊</p>
		</div>

		<!-- 登录卡片内容 -->
		<div class="login-page-desktop-content">
			<div class="login-page-desktop-card">
				<!-- 卡片头部:副标题 -->
				<div class="login-page-desktop-card-header">
					<p class="login-page-desktop-welcome-text">欢迎登录</p>
				</div>

				<!-- 登录表单 -->
				<el-form
					:model="form"
					:rules="rules"
					label-width="0px"
					class="login-page-desktop-form">
					<el-form-item prop="studentId" class="form-item">
						<div class="login-page-desktop-input-group">
							<div class="login-page-desktop-input-icon">
								<el-icon>
									<user/>
								</el-icon>
							</div>
							<el-input
								v-model="form.studentId"
								placeholder="请输入学号"
								class="login-page-desktop-custom-input"
								size="large"
							/>
						</div>
					</el-form-item>

					<el-form-item prop="password" class="form-item">
						<div class="login-page-desktop-input-group">
							<div class="login-page-desktop-input-icon">
								<el-icon>
									<lock/>
								</el-icon>
							</div>
							<el-input
								v-model="form.password"
								type="password"
								placeholder="请输入密码"
								class="login-page-desktop-custom-input"
								size="large"
								show-password
							/>
						</div>
					</el-form-item>

					<!-- 记住我选项 -->
					<div class="login-page-desktop-form-options">
						<el-checkbox v-model="rememberMe" class="login-page-desktop-remember-checkbox">
							记住我
						</el-checkbox>
					</div>

					<!-- 登录按钮 -->
					<el-button
						type="primary"
						class="login-page-desktop-login-button"
						size="large"
						:loading="isLoading"
						:disabled="isLoading"
						@click="handleLogin"
					>
						{{ isLoading ? '登录中...' : '登录' }}
					</el-button>
				</el-form>

				<!-- 卡片底部:注册链接 -->
				<div class="login-page-desktop-card-footer">
					<p class="login-page-desktop-register-link">
						还没有账号？
						<router-link to="/register" class="link">立即注册</router-link>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
