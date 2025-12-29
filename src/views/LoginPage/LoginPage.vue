<script setup>
import {ref, onMounted} from "vue";
import {ElForm, ElFormItem, ElInput, ElButton, ElMessage, ElCheckbox, ElIcon} from "element-plus";
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-checkbox.css'
import 'element-plus/theme-chalk/el-icon.css'
import {User, Lock, House} from "@element-plus/icons-vue";
import {useRouter} from 'vue-router';
import {login} from '@/api/student';
import {useUserStore} from '@/stores/user';
import {useThemeStore} from '@/stores/theme';
import StudentApi from "@/api/StudentApi";

const router = useRouter();
const userStore = useUserStore();
const themeStore = useThemeStore();
const {toggleTheme} = themeStore;
const form = ref({
	studentId: "",
	password: ""
});
const rememberMe = ref(false);
const isLoading = ref(false);

const rules = {
	studentId: [
		{required: true, message: "请输入学号", trigger: "blur"},
		{pattern: /^\d{10}$/, message: "学号必须为 10 位数字", trigger: "blur"}
	],
	password: [
		{required: true, message: "请输入密码", trigger: "blur"},
		{min: 6, message: "密码长度至少 6 位", trigger: "blur"},
		{max: 16, message: "密码长度不能超过 16 位", trigger: "blur"}
	]
};

const handleLogin = async () => {
	isLoading.value = true;
	try {
		const response = await login(form.value);
		// 获取学生数据库表主键ID
		const studentDbIdResponse = await StudentApi.getStudentDatabaseTableId(response.data.token);
		const studentDbId = studentDbIdResponse.data;

		const userInfo = {
			...response.data,
			studentId: form.value.studentId,
			studentDatabaseTableId: studentDbId
		};
		userStore.setUserInfo(userInfo, response.data.token);

		if (rememberMe.value) {
			localStorage.setItem('rememberedUser', JSON.stringify({
				studentId: form.value.studentId,
				password: form.value.password
			}));
		} else {
			localStorage.removeItem('rememberedUser');
		}

		ElMessage.success('登录成功');
		router.push('/navigation');
	} catch (error) {
		ElMessage.error(error.message || '登录失败，请检查您的学号和密码');
	} finally {
		isLoading.value = false;
	}
};

const goToHome = () => {
	router.push('/');
};

onMounted(() => {
	const rememberedUser = localStorage.getItem('rememberedUser');
	if (rememberedUser) {
		try {
			const userData = JSON.parse(rememberedUser);
			form.value.studentId = userData.studentId;
			form.value.password = userData.password;
			rememberMe.value = true;
		} catch (error) {
			localStorage.removeItem('rememberedUser');
		}
	}
});
</script>

<template>
	<div class="login-container">
		<div class="background-effects">
			<div class="gradient-orb orb-1"></div>
			<div class="gradient-orb orb-2"></div>
			<div class="gradient-orb orb-3"></div>
		</div>

		<el-button @click="goToHome" class="home-btn" type="primary" :icon="House" circle></el-button>

		<div class="login-content">
			<div class="login-card">
				<div class="card-header">
					<img src="@/assets/AiWorkShop_icon.png" alt="AI坊学生管理系统" class="logo" @click="toggleTheme"
						 title="切换主题模式">
					<h1>AI坊学生管理系统</h1>
					<p class="subtitle">人工智能创作坊</p>
				</div>

				<ElForm :model="form" :rules="rules" label-width="0px" class="login-form">
					<ElFormItem prop="studentId" class="form-item">
						<div class="input-group">
							<div class="input-icon">
								<ElIcon>
									<User/>
								</ElIcon>
							</div>
							<ElInput
								v-model="form.studentId"
								placeholder="请输入学号"
								class="custom-input"
								size="large"
							/>
						</div>
					</ElFormItem>

					<ElFormItem prop="password" class="form-item">
						<div class="input-group">
							<div class="input-icon">
								<ElIcon>
									<Lock/>
								</ElIcon>
							</div>
							<ElInput
								type="password"
								v-model="form.password"
								placeholder="请输入密码"
								class="custom-input"
								size="large"
								show-password
							/>
						</div>
					</ElFormItem>

					<div class="form-options">
						<ElCheckbox v-model="rememberMe" class="remember-checkbox">
							记住我
						</ElCheckbox>
					</div>

					<ElButton
						type="primary"
						@click="handleLogin"
						class="login-button"
						size="large"
						:loading="isLoading"
						:disabled="isLoading"
					>
						{{ isLoading ? '登录中...' : '登录' }}
					</ElButton>
				</ElForm>

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
.login-container {
	min-height: 100vh;
	background: var(--bg-primary);
	position: relative;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
}

.background-effects {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 0;
}

.gradient-orb {
	position: absolute;
	border-radius: 50%;
	filter: blur(100px);
	opacity: 0.3;
	animation: float 20s ease-in-out infinite;
}

.orb-1 {
	width: 300px;
	height: 300px;
	background: linear-gradient(135deg, #667eea, var(--secondary-color));
	top: 10%;
	left: 10%;
	animation-delay: 0s;
}

.orb-2 {
	width: 200px;
	height: 200px;
	background: linear-gradient(135deg, #f093fb, #f5576c);
	top: 60%;
	right: 10%;
	animation-delay: -7s;
}

.orb-3 {
	width: 250px;
	height: 250px;
	background: linear-gradient(135deg, #4facfe, #00f2fe);
	bottom: 20%;
	left: 50%;
	animation-delay: -14s;
}

@keyframes float {
	0%, 100% {
		transform: translateY(0px) rotate(0deg);
	}
	33% {
		transform: translateY(-30px) rotate(120deg);
	}
	66% {
		transform: translateY(30px) rotate(240deg);
	}
}

.home-btn {
	position: absolute;
	top: 30px;
	left: 30px;
	width: 48px;
	height: 48px;
	background: var(--primary-color);
	border: none;
	box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
	z-index: 10;
}

.login-content {
	position: relative;
	z-index: 10;
	width: 100%;
	max-width: 400px;
	padding: 20px;
}

.login-card {
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(20px);
	border-radius: 24px;
	padding: 40px;
	border: 1px solid rgba(255, 255, 255, 0.2);
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
}

.login-card:hover {
	background: rgba(255, 255, 255, 0.15);
	border-color: rgba(255, 255, 255, 0.3);
	box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.card-header {
	text-align: center;
	margin-bottom: 32px;
}

.logo {
	width: 80px;
	height: 80px;
	cursor: pointer;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	border-radius: 16px;
	margin-bottom: 20px;
}

.logo:hover {
	transform: scale(1.1) rotate(5deg);
	filter: brightness(1.2);
}

.card-header h1 {
	font-size: 28px;
	font-weight: 700;
	margin: 0 0 8px 0;
	background: linear-gradient(135deg, #667eea, var(--secondary-color));
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.subtitle {
	font-size: 16px;
	color: var(--text-secondary);
	margin: 0;
	font-weight: 500;
}

.login-form {
	margin-bottom: 24px;
}

.form-item {
	margin-bottom: 0;
}

.form-item :deep(.el-form-item__content) {
	width: 100%;
}

.input-group {
	position: relative;
	width: 100%;
	margin-bottom: 20px;
}

.input-icon {
	position: absolute;
	left: 16px;
	top: 50%;
	transform: translateY(-50%);
	color: var(--text-tertiary);
	z-index: 2;
	font-size: 18px;
}

.custom-input {
	width: 100%;
}

.custom-input :deep(.el-input) {
	width: 100%;
}

.custom-input :deep(.el-input__wrapper) {
	width: 100%;
	background: rgba(255, 255, 255, 0.1);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 12px;
	padding-left: 48px;
	box-shadow: none;
	transition: all 0.3s ease;
}

.custom-input :deep(.el-input__wrapper:hover) {
	border-color: rgba(255, 255, 255, 0.4);
	background: rgba(255, 255, 255, 0.15);
}

.custom-input :deep(.el-input__wrapper.is-focus) {
	border-color: var(--primary-color);
	background: rgba(255, 255, 255, 0.2);
	box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.custom-input :deep(.el-input__inner) {
	color: var(--text-primary);
	background: transparent;
	border: none;
	font-size: 16px;
}

.custom-input :deep(.el-input__inner::placeholder) {
	color: var(--text-tertiary);
}

.form-options {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24px;
}

.remember-checkbox {
	color: var(--text-secondary);
}

.login-button {
	width: 100%;
	height: 48px;
	background: linear-gradient(135deg, #667eea, var(--secondary-color));
	border: none;
	border-radius: 12px;
	font-size: 16px;
	font-weight: 600;
	transition: all 0.3s ease;
	box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.login-button:hover {
	transform: translateY(-2px);
	box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
}

.login-button:active {
	transform: translateY(0);
}

.card-footer {
	text-align: center;
	padding-top: 20px;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.register-link {
	color: var(--text-secondary);
	margin: 0;
	font-size: 14px;
}

.link {
	color: var(--primary-color);
	text-decoration: none;
	font-weight: 600;
	transition: all 0.3s ease;
}

.link:hover {
	color: var(--secondary-color);
	text-decoration: underline;
}

@media (max-width: 768px) {
	.home-btn {
		top: 20px;
		left: 20px;
		width: 44px;
		height: 44px;
	}

	.login-content {
		padding: 16px;
	}

	.login-card {
		padding: 32px 24px;
		border-radius: 20px;
	}

	.card-header h1 {
		font-size: 24px;
	}

	.logo {
		width: 70px;
		height: 70px;
	}

	.custom-input :deep(.el-input__inner) {
		font-size: 16px;
	}

	.login-button {
		height: 44px;
		font-size: 15px;
	}
}

@media (max-width: 480px) {
	.login-card {
		padding: 24px 20px;
		border-radius: 16px;
	}

	.card-header h1 {
		font-size: 22px;
	}

	.logo {
		width: 60px;
		height: 60px;
	}

	.subtitle {
		font-size: 14px;
	}
}
</style>
