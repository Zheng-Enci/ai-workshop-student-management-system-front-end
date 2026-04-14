<script setup>
/**
 * 登录页面组件 - 桌面端
 *
 * @description 提供用户登录功能,支持记住密码、验证输入、头像显示等
 * @component LoginPageDesktop
 */

// ===================== 第三方依赖导入 =====================
import { User, Lock, House } from '@element-plus/icons-vue'
import {ElButton, ElIcon, ElInput, ElForm, ElFormItem, ElCheckbox } from 'element-plus'
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-checkbox.css'
import 'element-plus/theme-chalk/el-icon.css'

// ===================== 样式导入 =====================
import '@/views/LoginPage/desktop/css/LoginPageDesktop.css'

// ===================== 业务逻辑导入 =====================
import LoginPageDesktop from './desktop/ts/LoginPageDesktop'

// ===================== 初始化 =====================
const loginPage = new LoginPageDesktop()
loginPage.init()

// ===================== 导出模板使用的变量和方法 =====================
const form = loginPage.form
const rememberMe = loginPage.rememberMe
const isLoading = loginPage.isLoading
const studentAvatarUrl = loginPage.studentAvatarUrl
const isAvatarLoading = loginPage.isAvatarLoading
const rules = loginPage.rules
const toggleTheme = loginPage.toggleTheme.bind(loginPage)
const handleLogin = loginPage.handleLogin.bind(loginPage)
const goToHome = loginPage.goToHome.bind(loginPage)
const fetchStudentAvatar = loginPage.fetchStudentAvatar.bind(loginPage)
</script>

<template>
	<!-- 登录页面容器 -->
	<div class="login-page-desktop-container">
		<!-- 背景装饰效果 -->
		<div class="login-page-desktop-background-effects">
			<!-- 科技感网格背景 -->
			<div class="login-page-desktop-grid-pattern"/>
			<!-- 浮动粒子 -->
			<div class="login-page-desktop-particle"/>
			<div class="login-page-desktop-particle"/>
			<div class="login-page-desktop-particle"/>
			<div class="login-page-desktop-particle"/>
			<div class="login-page-desktop-particle"/>
			<div class="login-page-desktop-particle"/>
			<div class="login-page-desktop-particle"/>
			<!-- 渐变光球 -->
			<div class="login-page-desktop-gradient-orb orb-1"/>
			<div class="login-page-desktop-gradient-orb orb-2"/>
			<div class="login-page-desktop-gradient-orb orb-3"/>
			<div class="login-page-desktop-gradient-orb orb-4"/>
		</div>

		<!-- 登录卡片内容 - 黄金比例布局 -->
		<div class="login-page-desktop-content">
			<div class="login-page-desktop-golden-layout">
				<!-- 左侧区域 - 黄金比例 61.8%，占满左侧 -->
				<div class="login-page-desktop-left-panel">
					<!-- 左上角按钮组 -->
					<div class="login-page-desktop-left-header">
						<!-- Logo - 点击切换主题 -->
						<div class="login-page-desktop-logo" title="切换主题模式" @click="toggleTheme">
							<img src="@/assets/AiWorkShop_icon.png" alt="AI创作坊 Logo"/>
						</div>
						<!-- 返回首页按钮 -->
						<el-button
							class="login-page-desktop-home-btn"
							type="primary"
							:icon="House"
							circle
							@click="goToHome"
						/>
					</div>
					<!-- 左侧内容区域，使用 img 标签显示成员合照 -->
					<img
						src="@/assets/AiWorkShop-Members-Group-Photo.jpg"
						alt="AI创作坊成员合照"
						class="login-page-desktop-group-photo"
					/>
				</div>
				<!-- 右侧区域 - 黄金比例 38.2%，占满右侧 -->
				<div class="login-page-desktop-right-panel">
					<!-- 右侧区域标题 -->
					<div class="login-page-desktop-right-title">
						<h1>AI坊学生管理系统</h1>
						<p class="login-page-desktop-subtitle">AI Workshop Student System</p>
					</div>
					<div class="login-page-desktop-card">
						<!-- 卡片标题 -->
						<div class="login-page-desktop-card-header">
							<p class="login-page-desktop-welcome-text">欢迎登录 / Welcome Back</p>
						</div>
						<!-- 学生头像显示区域 -->
				<div class="login-page-desktop-avatar-container">
					<!-- 加载动画 -->
					<!-- Loading animation -->
					<img
						v-if="isAvatarLoading"
						src="@/assets/loading.gif"
						alt="加载中"
						class="login-page-desktop-avatar-loading"
					/>
					<!-- 有头像时显示头像 -->
					<img
						v-else-if="studentAvatarUrl"
						:src="studentAvatarUrl"
						alt="学生头像"
						class="login-page-desktop-student-avatar"
						@error="studentAvatarUrl = null"
					/>
					<!-- 无头像时显示默认图标 -->
					<div v-else class="login-page-desktop-default-avatar">
						<el-icon :size="40">
							<User />
						</el-icon>
					</div>
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
								@blur="fetchStudentAvatar"
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
		</div>
	</div>
</template>
