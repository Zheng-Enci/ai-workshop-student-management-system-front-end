<script setup lang="ts">
/** *******************************************************************
 * RegisterPageDesktop - 注册页面桌面端核心逻辑
 * 1. 负责桌面端用户注册功能
 * 2. 表单校验、注册提交、自动登录
 * 3. 已登录状态自动跳转
 ********************************************************************/

// ======================== 导入 ========================
// Element Plus 核心组件
import { ElForm, ElFormItem, ElInput, ElButton, ElIcon, ElSelect, ElOption, type FormInstance } from 'element-plus'
// Element Plus 基础样式（按需引入，减小打包体积）
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-select.css'
import 'element-plus/theme-chalk/el-option.css'
// Element Plus 额外样式（下拉菜单、弹出层、表单验证等）
import 'element-plus/theme-chalk/el-popper.css'
import 'element-plus/theme-chalk/el-scrollbar.css'
// Element Plus 消息提示样式
import 'element-plus/theme-chalk/el-message.css'
// Element Plus 图标组件
import { User, Lock, Phone, School, Collection, House } from '@element-plus/icons-vue'
// Vue3 核心 API
import { onMounted, ref } from 'vue'
// Vue Router
import { useRouter } from 'vue-router'
// 页面逻辑类
import RegisterPageDesktop from './desktop/ts/RegisterPageDesktop'

// ======================== 样式导入 ========================
import '@/views/RegisterPage/desktop/css/RegisterPageDesktop.css'

// ======================== 组件 ========================
// 无外部组件

// ======================== 常量 ========================
// 无常量定义

// ======================== 状态 ========================
// 路由实例
const router = useRouter()
// 页面逻辑类实例
const pageLogic = new RegisterPageDesktop(router)
// 表单引用实例（用于表单校验）
const formRef = ref<FormInstance | null>(null)
// 将表单引用传递给 pageLogic
pageLogic.formRef = formRef

// ======================== 计算属性 ========================
// 无计算属性

// ======================== 方法 ========================
// 方法通过 pageLogic 实例调用

// ======================== 生命周期 ========================
/**
 * 组件挂载完成钩子
 * @description 检测本地存储的 token，已登录状态自动跳转至导航页
 */
onMounted(() => {
	pageLogic.checkLoginStatus()
})
</script>

<template>
	<!-- 注册页面根容器 -->
	<div class="register-page-desktop-container">
		<!-- 背景装饰效果（渐变球体） -->
		<div class="register-page-desktop-background-effects">
			<div class="register-page-desktop-gradient-orb orb-1"/>
			<div class="register-page-desktop-gradient-orb orb-2"/>
			<div class="register-page-desktop-gradient-orb orb-3"/>
		</div>

		<!-- 系统logo（右上角，点击切换主题） -->
		<img
			src="@/assets/AiWorkShop_icon.png"
			alt="AI坊学生管理系统"
			class="register-page-desktop-logo"
			title="切换主题模式"
			@click="pageLogic.toggleTheme"/>

		<!-- 返回首页按钮 -->
		<el-button
			class="register-page-desktop-home-btn"
			type="primary"
			@click="pageLogic.goToHome()">
			<el-icon><House/></el-icon>
			<span>首页</span>
		</el-button>

		<!-- 页面顶部中央标题 -->
		<div class="register-page-desktop-page-title">
			<h1>AI坊学生管理系统</h1>
			<p class="register-page-desktop-page-subtitle">AI Workshop Student Management System</p>
		</div>

		<!-- 展示图片区域 -->
		<div class="register-page-desktop-showcase">
			<img
				src="@/assets/ai-workshop-exhibition.jpg"
				alt="AI坊活动展示"
				class="register-page-desktop-showcase-image"
			/>
		</div>

		<!-- 注册表单核心内容区 -->
		<div class="register-page-desktop-content">
			<!-- 注册表单与展示图布局容器（黄金比例） -->
			<div class="register-page-desktop-main-layout">
				<!-- 注册卡片容器（带圆角/阴影/半透明） -->
				<div class="register-page-desktop-card">
				<!-- 卡片头部（欢迎语） -->
				<div class="register-page-desktop-card-header">
					<p class="register-page-desktop-welcome">欢迎加入AI坊</p>
					<p class="register-page-desktop-welcome-en">Welcome to AI Workshop</p>
				</div>

				<!-- 注册表单（绑定模型/规则/引用） -->
				<el-form
					ref="formRef"
					:model="pageLogic.form"
					:rules="pageLogic.rules"
					label-width="0px"
					class="register-page-desktop-form">
					<!-- 第一行：姓名 + 学号 -->
					<div class="register-page-desktop-form-row">
						<!-- 姓名字段 -->
						<el-form-item prop="name" class="register-page-desktop-form-item-half register-page-desktop-form-item">
							<div class="register-page-desktop-input-group">
								<div class="register-page-desktop-input-icon">
									<el-icon>
										<user/>
									</el-icon>
								</div>
								<el-input
									v-model="pageLogic.form.name"
									placeholder="请输入姓名"
									class="register-page-desktop-custom-input"
									size="large"
								/>
							</div>
						</el-form-item>

						<!-- 学号字段 -->
						<el-form-item prop="studentId" class="register-page-desktop-form-item-half register-page-desktop-form-item">
							<div class="register-page-desktop-input-group">
								<div class="register-page-desktop-input-icon">
									<el-icon>
										<collection/>
									</el-icon>
								</div>
								<el-input
									v-model="pageLogic.form.studentId"
									placeholder="请输入学号"
									class="register-page-desktop-custom-input"
									size="large"
								/>
							</div>
						</el-form-item>
					</div>

					<!-- 第二行：性别 + 手机号 -->
					<div class="register-page-desktop-form-row">
						<!-- 性别字段（下拉选择） -->
						<el-form-item prop="gender" class="register-page-desktop-form-item-half register-page-desktop-form-item">
							<div class="register-page-desktop-input-group">
								<div class="register-page-desktop-input-icon">
									<el-icon>
										<user/>
									</el-icon>
								</div>
								<el-select
									v-model="pageLogic.form.gender"
									placeholder="请选择性别"
									class="register-page-desktop-custom-select"
									size="large"
									popper-class="register-page-desktop-gender-select-dropdown"
								>
									<el-option label="男" value="男"/>
									<el-option label="女" value="女"/>
								</el-select>
							</div>
						</el-form-item>

						<!-- 手机号字段 -->
						<el-form-item prop="phoneNumber" class="register-page-desktop-form-item-half register-page-desktop-form-item">
							<div class="register-page-desktop-input-group">
								<div class="register-page-desktop-input-icon">
									<el-icon>
										<phone/>
									</el-icon>
								</div>
								<el-input
									v-model="pageLogic.form.phoneNumber"
									placeholder="请输入手机号"
									class="register-page-desktop-custom-input"
									size="large"
								/>
							</div>
						</el-form-item>
					</div>

					<!-- 第三行：学院 + 专业 -->
					<div class="register-page-desktop-form-row">
						<!-- 学院字段（下拉选择） -->
						<el-form-item prop="college" class="register-page-desktop-form-item-half register-page-desktop-form-item">
							<div class="register-page-desktop-input-group">
								<div class="register-page-desktop-input-icon">
									<el-icon>
										<school/>
									</el-icon>
								</div>
								<el-select
									v-model="pageLogic.form.college"
									placeholder="请选择学院"
									class="register-page-desktop-custom-select"
									size="large"
									popper-class="register-page-desktop-college-select-dropdown"
								>
									<el-option
										v-for="college in pageLogic.collegeOptions"
										:key="college"
										:label="college"
										:value="college"
									/>
								</el-select>
							</div>
						</el-form-item>

						<!-- 专业字段 -->
						<el-form-item prop="major" class="register-page-desktop-form-item-half register-page-desktop-form-item">
							<div class="register-page-desktop-input-group">
								<div class="register-page-desktop-input-icon">
									<el-icon>
										<school/>
									</el-icon>
								</div>
								<el-input
									v-model="pageLogic.form.major"
									placeholder="请输入专业"
									class="register-page-desktop-custom-input"
									size="large"
								/>
							</div>
						</el-form-item>
					</div>

					<!-- 第四行：年级 + 班级 -->
					<div class="register-page-desktop-form-row">
						<!-- 年级字段（下拉选择） -->
						<el-form-item prop="grade" class="register-page-desktop-form-item-half register-page-desktop-form-item">
							<div class="register-page-desktop-input-group">
								<div class="register-page-desktop-input-icon">
									<el-icon>
										<school/>
									</el-icon>
								</div>
								<el-select
									v-model="pageLogic.form.grade"
									placeholder="请选择年级"
									class="register-page-desktop-custom-select"
									size="large"
									popper-class="register-page-desktop-grade-select-dropdown"
								>
									<el-option label="1年级" value="1"/>
									<el-option label="2年级" value="2"/>
									<el-option label="3年级" value="3"/>
									<el-option label="4年级" value="4"/>
									<el-option label="5年级" value="5"/>
								</el-select>
							</div>
						</el-form-item>

						<!-- 班级字段（数字输入） -->
						<el-form-item prop="classNum" class="register-page-desktop-form-item-half register-page-desktop-form-item">
							<div class="register-page-desktop-input-group">
								<div class="register-page-desktop-input-icon">
									<el-icon>
										<school/>
									</el-icon>
								</div>
								<el-input
									v-model.number="pageLogic.form.classNum"
									placeholder="请输入班级"
									class="register-page-desktop-custom-input"
									size="large"
									type="number"
									:min="1"
									:max="100"
								/>
							</div>
						</el-form-item>
					</div>

					<!-- 密码字段 -->
					<el-form-item prop="password" class="register-page-desktop-form-item register-page-desktop-password-form-item">
						<div class="register-page-desktop-input-group">
							<div class="register-page-desktop-input-icon">
								<el-icon>
									<lock/>
								</el-icon>
							</div>
							<el-input
								v-model="pageLogic.form.password"
								type="password"
								placeholder="请输入密码"
								class="register-page-desktop-custom-input"
								size="large"
								show-password
							/>
						</div>
					</el-form-item>

					<!-- 确认密码字段 -->
					<el-form-item prop="confirmPassword" class="register-page-desktop-form-item register-page-desktop-password-form-item">
						<div class="register-page-desktop-input-group">
							<div class="register-page-desktop-input-icon">
								<el-icon>
									<lock/>
								</el-icon>
							</div>
							<el-input
								v-model="pageLogic.form.confirmPassword"
								type="password"
								placeholder="请确认密码"
								class="register-page-desktop-custom-input"
								size="large"
								show-password
							/>
						</div>
					</el-form-item>

					<!-- 邀请码字段 -->
					<el-form-item prop="invitationCode" class="register-page-desktop-form-item register-page-desktop-last-input-form-item">
						<div class="register-page-desktop-input-group">
							<div class="register-page-desktop-input-icon">
								<el-icon>
									<collection/>
								</el-icon>
							</div>
							<el-input
								v-model="pageLogic.form.invitationCode"
								placeholder="请输入邀请码"
								class="register-page-desktop-custom-input"
								size="large"
							/>
						</div>
					</el-form-item>

					<!-- 注册按钮（带加载状态/禁用） -->
					<el-button
						type="primary"
						class="register-page-desktop-register-button"
						size="large"
						:loading="pageLogic.isLoading.value"
						:disabled="pageLogic.isLoading.value"
						@click="pageLogic.handleRegister()"
					>
						{{ pageLogic.isLoading.value ? '注册中...' : '注册' }}
					</el-button>
				</el-form>

				<!-- 卡片底部（登录链接） -->
				<div class="register-page-desktop-card-footer">
					<p class="register-page-desktop-login-link">
						已有账号？
						<router-link to="/login" class="link">立即登录</router-link>
					</p>
				</div>
			</div>
			</div>
		</div>

	</div>
</template>
