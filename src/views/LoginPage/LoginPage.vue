<script setup>
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

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore
const form = ref({
	studentId: '',
	password: ''
})
const rememberMe = ref(false)
const isLoading = ref(false)

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

const handleLogin = async () => {
	isLoading.value = true
	try {
		const response = await login(form.value)
		// 获取学生数据库表主键ID
		const studentDbIdResponse = await StudentApi.getStudentDatabaseTableId(response.data.token)
		const studentDbId = studentDbIdResponse.data

		const userInfo = {
			...response.data,
			studentId: form.value.studentId,
			studentDatabaseTableId: studentDbId
		}
		userStore.setUserInfo(userInfo, response.data.token)

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

const goToHome = () => {
	router.push('/')
}

onMounted(() => {
	const rememberedUser = localStorage.getItem('rememberedUser')
	if (rememberedUser) {
		try {
			const userData = JSON.parse(rememberedUser)
			form.value.studentId = userData.studentId
			form.value.password = userData.password
			rememberMe.value = true
		} catch (error) {
			localStorage.removeItem('rememberedUser')
		}
	}
})
</script>

<template>
	<div class="login-container">
		<div class="background-effects">
			<div class="gradient-orb orb-1"/>
			<div class="gradient-orb orb-2"/>
			<div class="gradient-orb orb-3"/>
		</div>

		<el-button
			class="home-btn"
			type="primary"
			:icon="House"
			circle
			@click="goToHome"/>

		<div class="login-content">
			<div class="login-card">
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

					<div class="form-options">
						<el-checkbox v-model="rememberMe" class="remember-checkbox">
							记住我
						</el-checkbox>
					</div>

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
@import './css/LoginPage.css';
</style>
