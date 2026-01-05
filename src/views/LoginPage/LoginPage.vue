<script setup>
/**
 * 登录页面组件
 * 
 * @description 提供用户登录功能,支持记住密码、验证输入等
 * @component LoginPage
 */
import { User, Lock, House } from '@element-plus/icons-vue'
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage, ElCheckbox, ElIcon } from 'element-plus'
import { ref, onMounted } from 'vue'
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-checkbox.css'
import 'element-plus/theme-chalk/el-icon.css'
import { useRouter } from 'vue-router'

import { login } from '@/api/student'
import StudentApi from '@/api/StudentApi'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'

// 路由实例,用于页面跳转
const router = useRouter()
// 用户Store实例,用于管理用户信息
const userStore = useUserStore()
// 主题Store实例,用于主题切换
const themeStore = useThemeStore()
const { toggleTheme } = themeStore

// 登录表单数据
const form = ref({
	studentId: '',
	password: ''
})
// 记住我复选框状态
const rememberMe = ref(false)
// 登录按钮加载状态
const isLoading = ref(false)

/**
 * 表单验证规则
 */
const rules = {
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
 * @description 验证表单,调用登录接口,获取学生ID并存储用户信息
 */
const handleLogin = async () => {
	isLoading.value = true
	try {
		const response = await login(form.value)
		// 获取学生数据库表主键ID
		const studentDbIdResponse = await StudentApi.getStudentDatabaseTableId(response.data.token)
		const studentDbId = studentDbIdResponse.data

		// 构建完整的用户信息
		const userInfo = {
			...response.data,
			studentId: form.value.studentId,
			studentDatabaseTableId: studentDbId
		}
		userStore.setUserInfo(userInfo, response.data.token)

		// 记住我功能:保存用户信息到本地存储
		if (rememberMe.value) {
			localStorage.setItem('rememberedUser', JSON.stringify({
				studentId: form.value.studentId,
				password: form.value.password
			}))
		} else {
			localStorage.removeItem('rememberedUser')
		}

		ElMessage.success('登录成功')
		router.push('/navigation')
	} catch (error) {
		ElMessage.error(error.message || '登录失败，请检查您的学号和密码')
	} finally {
		isLoading.value = false
	}
}

/**
 * 返回首页
 */
const goToHome = () => {
	router.push('/')
}

/**
 * 组件挂载时自动填充记住的用户信息
 */
onMounted(() => {
	const rememberedUser = localStorage.getItem('rememberedUser')
	if (rememberedUser) {
		try {
			const userData = JSON.parse(rememberedUser)
			form.value.studentId = userData.studentId
			form.value.password = userData.password
			rememberMe.value = true
		} catch (error) {
			// 如果数据解析失败,清除本地存储
			localStorage.removeItem('rememberedUser')
		}
	}
})
</script>

<template>
	<!-- 登录页面容器 -->
	<div class="login-container">
		<!-- 背景装饰效果 -->
		<div class="background-effects">
			<div class="gradient-orb orb-1"/>
			<div class="gradient-orb orb-2"/>
			<div class="gradient-orb orb-3"/>
		</div>

		<!-- 返回首页按钮 -->
		<el-button
			class="home-btn"
			type="primary"
			:icon="House"
			circle
			@click="goToHome"/>

		<!-- 登录卡片内容 -->
		<div class="login-content">
			<div class="login-card">
				<!-- 卡片头部:Logo和标题 -->
				<div class="card-header">
					<img
						src="@/assets/AiWorkShop_icon.png"
						alt="AI坊学生管理系统"
						class="logo"
						title="切换主题模式"
						@click="toggleTheme"/>
					<h1>AI坊学生管理系统</h1>
					<p class="subtitle">人工智能创作坊</p>
				</div>

				<!-- 登录表单 -->
				<el-form
					:model="form"
					:rules="rules"
					label-width="0px"
					class="login-form">
					<el-form-item prop="studentId" class="form-item">
						<div class="input-group">
							<div class="input-icon">
								<el-icon>
									<user/>
								</el-icon>
							</div>
							<el-input
								v-model="form.studentId"
								placeholder="请输入学号"
								class="custom-input"
								size="large"
							/>
						</div>
					</el-form-item>

					<el-form-item prop="password" class="form-item">
						<div class="input-group">
							<div class="input-icon">
								<el-icon>
									<lock/>
								</el-icon>
							</div>
							<el-input
								v-model="form.password"
								type="password"
								placeholder="请输入密码"
								class="custom-input"
								size="large"
								show-password
							/>
						</div>
					</el-form-item>

					<!-- 记住我选项 -->
					<div class="form-options">
						<el-checkbox v-model="rememberMe" class="remember-checkbox">
							记住我
						</el-checkbox>
					</div>

					<!-- 登录按钮 -->
					<el-button
						type="primary"
						class="login-button"
						size="large"
						:loading="isLoading"
						:disabled="isLoading"
						@click="handleLogin"
					>
						{{ isLoading ? '登录中...' : '登录' }}
					</el-button>
				</el-form>

				<!-- 卡片底部:注册链接 -->
				<div class="card-footer">
					<p class="register-link">
						还没有账号？
						<router-link to="/register" class="link">立即注册</router-link>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* 导入外部样式文件 */
@import './css/LoginPage.css';
</style>
