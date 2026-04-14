<script setup>
/**
 * 登录页面组件
 *
 * @description 提供用户登录功能，支持记住密码、验证输入等
 * @component LoginPageMobile
 */
// ===================== 第三方依赖导入区 =====================
// Element Plus 图标组件：用户、锁、首页图标
import { User, Lock, House } from '@element-plus/icons-vue'
// Element Plus 核心组件：表单、表单项、输入框、按钮、复选框、图标
import { ElForm, ElFormItem, ElInput, ElButton, ElCheckbox, ElIcon } from 'element-plus'
// Element Plus 基础样式文件（按需导入，减小打包体积）
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-checkbox.css'
import 'element-plus/theme-chalk/el-icon.css'
// Vue 3 组合式 API
import { ref } from 'vue'
// 移动端登录页面样式导入
// Mobile login page styles import
import '@/views/LoginPage/mobile/css/LoginPageMobile.css'

// ===================== 业务模块导入区 =====================
// 移动端登录页面业务逻辑类
import LoginPageMobile from '@/views/LoginPage/mobile/ts/LoginPageMobile'

// ===================== 初始化业务逻辑类 =====================
/**
 * 登录页面业务逻辑实例
 * @type {LoginPageMobile}
 * @description 封装移动端登录页面的所有业务逻辑
 */
const loginPage = new LoginPageMobile()

// ===================== 导出模板使用的响应式变量和方法 =====================
/**
 * 学生头像URL
 * @description 直接使用 loginPage 中的响应式头像URL变量
 */
const studentAvatarUrl = loginPage.studentAvatarUrl

/**
 * 获取学生头像方法（已绑定上下文）
 * @description 将 fetchStudentAvatar 方法绑定到 loginPage 实例，确保 this 指向正确
 */
const fetchStudentAvatar = loginPage.fetchStudentAvatar.bind(loginPage)
</script>

<template>
	<!-- 登录页面容器 -->
	<div class="login-page-mobile-container">
		<!-- 背景装饰效果 -->
		<div class="login-page-mobile-background-effects">
			<div class="login-page-mobile-gradient-orb login-page-mobile-orb-1"/>
			<div class="login-page-mobile-gradient-orb login-page-mobile-orb-2"/>
			<div class="login-page-mobile-gradient-orb login-page-mobile-orb-3"/>
		</div>
		<!-- 返回首页按钮 - 点击返回系统首页 -->
		<!-- Home button - click to return to system home page -->
		<el-button
			class="login-page-mobile-home-btn"
			type="primary"
			:icon="House"
			@click="loginPage.goToHome()">
			首页
		</el-button>
		<!-- Logo图标 - 点击切换主题模式 -->
		<!-- Logo icon - click to toggle theme mode -->
		<img
			src="@/assets/AiWorkShop_icon.png"
			alt="AI坊学生管理系统"
			class="login-page-mobile-logo"
			title="切换主题模式"
			@click="loginPage.toggleTheme()"/>
		<!-- 页面标题 - 顶部居中显示 -->
		<!-- Page title - displayed at top center -->
		<div class="login-page-mobile-page-title">
			<h1>AI坊学生管理系统</h1>
			<p class="login-page-mobile-subtitle">AI Workshop Student System</p>
		</div>

		<!-- 登录卡片内容 -->
		<div class="login-page-mobile-login-content">
			<div class="login-page-mobile-login-card">
				<!-- 学生头像显示区域 -->
				<!-- Student avatar display area -->
				<div class="login-page-mobile-avatar-container">
					<!-- 有头像时显示头像（使用v-lazy懒加载） -->
					<!-- Show avatar when available (using v-lazy for lazy loading) -->
					<img
						v-if="loginPage.studentAvatarUrl?.value"
						v-lazy="loginPage.studentAvatarUrl.value"
						alt="学生头像"
						class="login-page-mobile-avatar"
						@error="loginPage.studentAvatarUrl && (loginPage.studentAvatarUrl.value = null)"
					/>
					<!-- 无头像时显示默认图标 -->
					<!-- Show default icon when no avatar -->
					<div v-else class="login-page-mobile-avatar-placeholder">
						<el-icon><user/></el-icon>
					</div>
				</div>

				<!-- 欢迎文本 -->
				<!-- Welcome text -->
				<div class="login-page-mobile-welcome-text">
					<p>欢迎登录 / Welcome Back</p>
				</div>

				<!-- 登录表单 -->
				<el-form
					:model="loginPage.form.value"
					:rules="loginPage.rules"
					label-width="0px"
					class="login-page-mobile-login-form">
					<el-form-item prop="studentId" class="login-page-mobile-form-item">
						<div class="login-page-mobile-input-group">
							<div class="login-page-mobile-input-icon">
								<el-icon>
									<user/>
								</el-icon>
							</div>
							<el-input
							v-model="loginPage.form.value.studentId"
							placeholder="请输入学号"
							class="login-page-mobile-custom-input"
							size="large"
							@blur="fetchStudentAvatar"
						/>
						</div>
					</el-form-item>

					<el-form-item prop="password" class="login-page-mobile-form-item login-page-mobile-password-item">
						<div class="login-page-mobile-input-group">
							<div class="login-page-mobile-input-icon">
								<el-icon>
									<lock/>
								</el-icon>
							</div>
							<el-input
								v-model="loginPage.form.value.password"
								type="password"
								placeholder="请输入密码"
								class="login-page-mobile-custom-input"
								size="large"
								show-password
							/>
						</div>
					</el-form-item>

					<!-- 记住我选项 -->
					<!-- Remember me option -->
					<el-form-item class="login-page-mobile-form-item login-page-mobile-remember-item">
						<el-checkbox v-model="loginPage.rememberMe.value" class="login-page-mobile-remember-checkbox">
							记住我
						</el-checkbox>
					</el-form-item>

					<!-- 登录按钮 -->
					<el-button
						type="primary"
						class="login-page-mobile-login-button"
						size="large"
						:loading="loginPage.isLoading.value"
						:disabled="loginPage.isLoading.value"
						@click="loginPage.handleLogin()"
					>
						{{ loginPage.isLoading.value ? '登录中...' : '登录' }}
					</el-button>
				</el-form>

				<!-- 卡片底部：注册链接 -->
				<div class="login-page-mobile-card-footer">
					<p class="login-page-mobile-register-link">
						还没有账号？
						<router-link to="/register" class="login-page-mobile-link">立即注册</router-link>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
</style>
