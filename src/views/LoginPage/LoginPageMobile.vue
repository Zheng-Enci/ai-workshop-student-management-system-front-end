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
			circle
			@click="loginPage.goToHome()"/>
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
							/>
						</div>
					</el-form-item>

					<el-form-item prop="password" class="login-page-mobile-form-item">
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
					<div class="login-page-mobile-form-options">
						<el-checkbox v-model="loginPage.rememberMe.value" class="login-page-mobile-remember-checkbox">
							记住我
						</el-checkbox>
					</div>

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
