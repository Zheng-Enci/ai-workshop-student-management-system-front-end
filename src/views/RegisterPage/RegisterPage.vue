<script setup>
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage, ElIcon, ElSelect, ElOption } from 'element-plus'
import { ref, onMounted } from 'vue'
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-select.css'
import 'element-plus/theme-chalk/el-option.css'
import { User, Lock, Phone, School, Collection, House } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

import { register, login } from '@/api/student'
import StudentApi from '@/api/StudentApi'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore

const collegeOptions = [
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

const form = ref({
	name: '',
	studentId: '',
	gender: '',
	phoneNumber: '',
	college: '',
	major: '',
	grade: '',
	classNum: null,
	password: '',
	confirmPassword: ''
})

const formRef = ref(null)

const rules = {
	name: [
		{ required: true, message: '请输入姓名', trigger: 'blur' }
	],
	studentId: [
		{ required: true, message: '请输入学号', trigger: 'blur' },
		{
			pattern: /^(20|21|22|23|24|25|26|27|28|29|30)\d{8}$/,
			message: '学号必须为10位数字，且以20-30开头',
			trigger: 'blur'
		}
	],
	gender: [
		{ required: true, message: '请选择性别', trigger: 'change' }
	],
	phoneNumber: [
		{ required: true, message: '请输入手机号', trigger: 'blur' },
		{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
	],
	college: [
		{ required: true, message: '请选择学院', trigger: 'change' }
	],
	major: [
		{ required: true, message: '请输入专业', trigger: 'blur' }
	],
	grade: [
		{ required: true, message: '请选择年级', trigger: 'change' },
		{
			validator: (rule, value, callback) => {
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
	classNum: [
		{ required: true, message: '请输入班级', trigger: 'blur' },
		{ type: 'number', min: 1, max: 100, message: '班级必须在 1-100 之间', trigger: 'blur' }
	],
	password: [
		{ required: true, message: '请输入密码', trigger: 'blur' },
		{ min: 6, message: '密码长度至少 6 位', trigger: 'blur' },
		{ max: 16, message: '密码长度不能超过 16 位', trigger: 'blur' }
	],
	confirmPassword: [
		{ required: true, message: '请确认密码', trigger: 'blur' },
		{
			validator: (rule, value, callback) => {
				if (value !== form.value.password) {
					callback(new Error('两次输入的密码不一致'))
				} else {
					callback()
				}
			},
			trigger: 'blur'
		}
	]
}

const isLoading = ref(false)

const handleRegister = async () => {
	if (!formRef.value) { return }

	try {
		await formRef.value.validate()
	} catch (error) {
		return
	}

	isLoading.value = true
	try {
		const registerData = {
			...form.value,
			grade: form.value.grade ? Number(form.value.grade) : null,
			classNum: form.value.classNum ? Number(form.value.classNum) : null
		}
		await register(registerData)
		ElMessage.success('注册成功！正在为您登录...')

		const loginData = {
			studentId: form.value.studentId,
			password: form.value.password
		}

		const response = await login(loginData)

		// 获取学生数据库表主键ID
		const studentDbIdResponse = await StudentApi.getStudentDatabaseTableId(response.data.token)
		const studentDbId = studentDbIdResponse.data

		const userInfo = {
			...response.data,
			studentId: form.value.studentId,
			studentDatabaseTableId: studentDbId
		}
		userStore.setUserInfo(userInfo, response.data.token)

		router.push('/navigation')
	} catch (error) {
		ElMessage.error(error.message || '注册失败，请检查您的信息')
	} finally {
		isLoading.value = false
	}
}

const goToHome = () => {
	router.push('/')
}

onMounted(() => {
	const token = localStorage.getItem('token')
	if (token) {
		router.push('/navigation')
	}
})
</script>

<template>
	<div class="register-container">
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

		<div class="register-content">
			<div class="register-card">
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
					ref="formRef"
					:model="form"
					:rules="rules"
					label-width="0px"
					class="register-form">
					<div class="form-row">
						<el-form-item prop="name" class="form-item-half form-item">
							<div class="input-group">
								<div class="input-icon">
									<el-icon>
										<user/>
									</el-icon>
								</div>
								<el-input
									v-model="form.name"
									placeholder="请输入姓名"
									class="custom-input"
									size="large"
								/>
							</div>
						</el-form-item>

						<el-form-item prop="studentId" class="form-item-half form-item">
							<div class="input-group">
								<div class="input-icon">
									<el-icon>
										<collection/>
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
					</div>

					<div class="form-row">
						<el-form-item prop="gender" class="form-item-half form-item">
							<div class="input-group">
								<div class="input-icon">
									<el-icon>
										<user/>
									</el-icon>
								</div>
								<el-select
									v-model="form.gender"
									placeholder="请选择性别"
									class="custom-select"
									size="large"
									popper-class="gender-select-dropdown"
								>
									<el-option label="男" value="男"/>
									<el-option label="女" value="女"/>
								</el-select>
							</div>
						</el-form-item>

						<el-form-item prop="phoneNumber" class="form-item-half form-item">
							<div class="input-group">
								<div class="input-icon">
									<el-icon>
										<phone/>
									</el-icon>
								</div>
								<el-input
									v-model="form.phoneNumber"
									placeholder="请输入手机号"
									class="custom-input"
									size="large"
								/>
							</div>
						</el-form-item>
					</div>

					<div class="form-row">
						<el-form-item prop="college" class="form-item-half form-item">
							<div class="input-group">
								<div class="input-icon">
									<el-icon>
										<school/>
									</el-icon>
								</div>
								<el-select
									v-model="form.college"
									placeholder="请选择学院"
									class="custom-select"
									size="large"
									popper-class="college-select-dropdown"
								>
									<el-option
										v-for="college in collegeOptions"
										:key="college"
										:label="college"
										:value="college"
									/>
								</el-select>
							</div>
						</el-form-item>

						<el-form-item prop="major" class="form-item-half form-item">
							<div class="input-group">
								<div class="input-icon">
									<el-icon>
										<school/>
									</el-icon>
								</div>
								<el-input
									v-model="form.major"
									placeholder="请输入专业"
									class="custom-input"
									size="large"
								/>
							</div>
						</el-form-item>
					</div>

					<div class="form-row">
						<el-form-item prop="grade" class="form-item-half form-item">
							<div class="input-group">
								<div class="input-icon">
									<el-icon>
										<school/>
									</el-icon>
								</div>
								<el-select
									v-model="form.grade"
									placeholder="请选择年级"
									class="custom-select"
									size="large"
									popper-class="grade-select-dropdown"
								>
									<el-option label="1年级" value="1"/>
									<el-option label="2年级" value="2"/>
									<el-option label="3年级" value="3"/>
									<el-option label="4年级" value="4"/>
									<el-option label="5年级" value="5"/>
								</el-select>
							</div>
						</el-form-item>

						<el-form-item prop="classNum" class="form-item-half form-item">
							<div class="input-group">
								<div class="input-icon">
									<el-icon>
										<school/>
									</el-icon>
								</div>
								<el-input
									v-model.number="form.classNum"
									placeholder="请输入班级"
									class="custom-input"
									size="large"
									type="number"
									:min="1"
									:max="100"
								/>
							</div>
						</el-form-item>
					</div>

					<el-form-item prop="password" class="form-item password-form-item">
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

					<el-form-item prop="confirmPassword" class="form-item last-input-form-item">
						<div class="input-group">
							<div class="input-icon">
								<el-icon>
									<lock/>
								</el-icon>
							</div>
							<el-input
								v-model="form.confirmPassword"
								type="password"
								placeholder="请确认密码"
								class="custom-input"
								size="large"
								show-password
							/>
						</div>
					</el-form-item>

					<el-button
						type="primary"
						class="register-button"
						size="large"
						:loading="isLoading"
						:disabled="isLoading"
						@click="handleRegister"
					>
						{{ isLoading ? '注册中...' : '注册' }}
					</el-button>
				</el-form>

				<div class="card-footer">
					<p class="login-link">
						已有账号？
						<router-link to="/login" class="link">立即登录</router-link>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import './css/RegisterPage.css';
</style>

<style>
.gender-select-dropdown {
	z-index: 3000 !important;
	padding: 8px 0;
	background: var(--bg-primary);
	border: 1px solid rgb(255 255 255 / 0.2);
	border-radius: 12px;
	box-shadow: 0 8px 24px rgb(0 0 0 / 0.15);
	backdrop-filter: blur(20px);
}

.college-select-dropdown {
	z-index: 3000 !important;
	min-width: auto;
	background: var(--bg-primary);
	border: 1px solid rgb(255 255 255 / 0.2);
	border-radius: 12px;
	box-shadow: 0 8px 24px rgb(0 0 0 / 0.15);
	backdrop-filter: blur(20px);
}

.grade-select-dropdown {
	z-index: 3000 !important;
	min-width: auto;
	background: var(--bg-primary);
	border: 1px solid rgb(255 255 255 / 0.2);
	border-radius: 12px;
	box-shadow: 0 8px 24px rgb(0 0 0 / 0.15);
	backdrop-filter: blur(20px);
}

.gender-select-dropdown .el-select-dropdown__item,
.college-select-dropdown .el-select-dropdown__item,
.grade-select-dropdown .el-select-dropdown__item {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	min-height: 40px;
	padding: 12px 16px;
	margin: 2px 8px;
	overflow: visible;
	text-overflow: clip;
	line-height: 1.5;
	color: var(--text-primary);
	text-align: left;
	white-space: nowrap;
	border-radius: 8px;
	transition: transform 0.2s ease;
}

.college-select-dropdown .el-select-dropdown__item,
.grade-select-dropdown .el-select-dropdown__item {
	width: auto;
	min-width: 100%;
	margin: 4px 8px;
}

.college-select-dropdown .el-select-dropdown__item span,
.grade-select-dropdown .el-select-dropdown__item span {
	display: block;
	width: 100%;
	overflow: visible;
	text-overflow: clip;
	white-space: nowrap;
}

.gender-select-dropdown .el-select-dropdown__item:hover,
.college-select-dropdown .el-select-dropdown__item:hover,
.grade-select-dropdown .el-select-dropdown__item:hover {
	color: var(--primary-color);
	background-color: rgb(102 126 234 / 0.15);
}

.college-select-dropdown .el-select-dropdown__item:hover,
.grade-select-dropdown .el-select-dropdown__item:hover {
	transform: translateX(4px);
}

.gender-select-dropdown .el-select-dropdown__item.selected,
.college-select-dropdown .el-select-dropdown__item.selected,
.grade-select-dropdown .el-select-dropdown__item.selected {
	font-weight: 600;
	color: var(--primary-color);
	background-color: rgb(102 126 234 / 0.2);
}

.gender-select-dropdown .el-select-dropdown__item.selected:hover,
.college-select-dropdown .el-select-dropdown__item.selected:hover,
.grade-select-dropdown .el-select-dropdown__item.selected:hover {
	background-color: rgb(102 126 234 / 0.25);
}
</style>
