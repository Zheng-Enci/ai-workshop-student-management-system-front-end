<script setup lang="ts">
/** *******************************************************************
 * RegisterPageMobile - 注册页面移动端核心逻辑
 * 1. 负责移动端用户注册功能
 * 2. 表单校验、注册提交、自动登录
 * 3. 已登录状态自动跳转
 ********************************************************************/

// ======================== 导入 ========================
// Element Plus 核心组件
import { ElForm, ElFormItem, ElInput, ElButton, ElIcon, ElSelect, ElOption } from 'element-plus'
// Element Plus 基础样式（按需引入，减小打包体积）
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-select.css'
import 'element-plus/theme-chalk/el-option.css'
// Element Plus 图标组件
import { User, Lock, Phone, School, Collection, House } from '@element-plus/icons-vue'
// 顶栏样式
import './mobile/css/RegisterPageMobileHeader.css'
// 表单样式
import './mobile/css/RegisterPageMobileForm.css'
// Vue3 核心 API
import { onMounted } from 'vue'
// Vue Router
import { useRouter } from 'vue-router'
// 页面逻辑类
import RegisterPageMobile from './mobile/ts/RegisterPageMobile'

// ======================== 组件 ========================
// 无外部组件

// ======================== 常量 ========================
// 无常量定义

// ======================== 状态 ========================
// 路由实例
const router = useRouter()
// 页面逻辑类实例
const pageLogic = new RegisterPageMobile(router)

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
	<div class="register-page-mobile-form-container">
		<!-- 背景装饰效果（渐变球体） -->
		<div class="register-page-mobile-form-background-effects">
			<div class="register-page-mobile-form-gradient-orb register-page-mobile-form-orb-1"/>
			<div class="register-page-mobile-form-gradient-orb register-page-mobile-form-orb-2"/>
			<div class="register-page-mobile-form-gradient-orb register-page-mobile-form-orb-3"/>
		</div>

		<!-- 顶栏容器（包含首页按钮、Logo、系统名称和副标题，使用flex布局自动对齐） -->
		<div class="register-page-mobile-header-top-bar">
			<!-- 返回首页按钮（圆角矩形按钮，仅包含文字） -->
			<el-button
				class="register-page-mobile-header-home-btn"
				type="primary"
				@click="pageLogic.goToHome()">
				首页
			</el-button>

			<!-- 系统标题（主标题+副标题） -->
			<div class="register-page-mobile-header-title-group">
				<h1 class="register-page-mobile-header-main-title">AI坊学生管理系统</h1>
				<p class="register-page-mobile-header-subtitle">AI Workshop Student Management System</p>
			</div>

			<!-- 系统logo（点击切换主题） -->
			<img
				src="@/assets/AiWorkShop_icon.png"
				alt="AI坊学生管理系统"
				class="register-page-mobile-header-logo"
				title="切换主题模式"
				@click="pageLogic.toggleTheme"/>
		</div>

		<!-- 注册表单核心内容区 -->
		<div class="register-page-mobile-form-content">
			<!-- 注册卡片容器（带圆角/阴影/半透明） -->
			<div class="register-page-mobile-form-card">

				<!-- 注册表单（绑定模型/规则/引用） -->
				<el-form
					ref="pageLogic.formRef"
					:model="pageLogic.form"
					:rules="pageLogic.rules"
					label-width="0px"
					class="register-page-mobile-form-form">
					<!-- 第一行：姓名 + 学号 -->
					<div class="register-page-mobile-form-form-row">
						<!-- 姓名字段 -->
						<el-form-item prop="name" class="register-page-mobile-form-form-item-half register-page-mobile-form-form-item">
							<div class="register-page-mobile-form-input-group">
								<div class="register-page-mobile-form-input-icon">
									<el-icon>
										<user/>
									</el-icon>
								</div>
								<el-input
									v-model="pageLogic.form.name"
									placeholder="请输入姓名"
									class="register-page-mobile-form-custom-input"
									size="large"
								/>
							</div>
						</el-form-item>

						<!-- 学号字段 -->
						<el-form-item prop="studentId" class="register-page-mobile-form-form-item-half register-page-mobile-form-form-item">
							<div class="register-page-mobile-form-input-group">
								<div class="register-page-mobile-form-input-icon">
									<el-icon>
										<collection/>
									</el-icon>
								</div>
								<el-input
									v-model="pageLogic.form.studentId"
									placeholder="请输入学号"
									class="register-page-mobile-form-custom-input"
									size="large"
								/>
							</div>
						</el-form-item>
					</div>

					<!-- 第二行：性别 + 手机号 -->
					<div class="register-page-mobile-form-form-row">
						<!-- 性别字段（下拉选择） -->
						<el-form-item prop="gender" class="register-page-mobile-form-form-item-half register-page-mobile-form-form-item">
							<div class="register-page-mobile-form-input-group">
								<div class="register-page-mobile-form-input-icon">
									<el-icon>
										<user/>
									</el-icon>
								</div>
								<el-select
									v-model="pageLogic.form.gender"
									placeholder="请选择性别"
									class="register-page-mobile-form-custom-select"
									size="large"
									popper-class="register-page-mobile-form-gender-select-dropdown"
								>
									<el-option label="男" value="男"/>
									<el-option label="女" value="女"/>
								</el-select>
							</div>
						</el-form-item>

						<!-- 手机号字段 -->
						<el-form-item prop="phoneNumber" class="register-page-mobile-form-form-item-half register-page-mobile-form-form-item">
							<div class="register-page-mobile-form-input-group">
								<div class="register-page-mobile-form-input-icon">
									<el-icon>
										<phone/>
									</el-icon>
								</div>
								<el-input
									v-model="pageLogic.form.phoneNumber"
									placeholder="请输入手机号"
									class="register-page-mobile-form-custom-input"
									size="large"
								/>
							</div>
						</el-form-item>
					</div>

					<!-- 第三行：学院 + 专业 -->
					<div class="register-page-mobile-form-form-row">
						<!-- 学院字段（下拉选择） -->
						<el-form-item prop="college" class="register-page-mobile-form-form-item-half register-page-mobile-form-form-item">
							<div class="register-page-mobile-form-input-group">
								<div class="register-page-mobile-form-input-icon">
									<el-icon>
										<school/>
									</el-icon>
								</div>
								<el-select
									v-model="pageLogic.form.college"
									placeholder="请选择学院"
									class="register-page-mobile-form-custom-select"
									size="large"
									popper-class="register-page-mobile-form-college-select-dropdown"
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
						<el-form-item prop="major" class="register-page-mobile-form-form-item-half register-page-mobile-form-form-item">
							<div class="register-page-mobile-form-input-group">
								<div class="register-page-mobile-form-input-icon">
									<el-icon>
										<school/>
									</el-icon>
								</div>
								<el-input
									v-model="pageLogic.form.major"
									placeholder="请输入专业"
									class="register-page-mobile-form-custom-input"
									size="large"
								/>
							</div>
						</el-form-item>
					</div>

					<!-- 第四行：年级 + 班级 -->
					<div class="register-page-mobile-form-form-row">
						<!-- 年级字段（下拉选择） -->
						<el-form-item prop="grade" class="register-page-mobile-form-form-item-half register-page-mobile-form-form-item">
							<div class="register-page-mobile-form-input-group">
								<div class="register-page-mobile-form-input-icon">
									<el-icon>
										<school/>
									</el-icon>
								</div>
								<el-select
									v-model="pageLogic.form.grade"
									placeholder="请选择年级"
									class="register-page-mobile-form-custom-select"
									size="large"
									popper-class="register-page-mobile-form-grade-select-dropdown"
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
						<el-form-item prop="classNum" class="register-page-mobile-form-form-item-half register-page-mobile-form-form-item">
							<div class="register-page-mobile-form-input-group">
								<div class="register-page-mobile-form-input-icon">
									<el-icon>
										<school/>
									</el-icon>
								</div>
								<el-input
									v-model.number="pageLogic.form.classNum"
									placeholder="请输入班级"
									class="register-page-mobile-form-custom-input"
									size="large"
									type="number"
									:min="1"
									:max="100"
								/>
							</div>
						</el-form-item>
					</div>

					<!-- 密码字段 -->
					<el-form-item prop="password" class="register-page-mobile-form-form-item register-page-mobile-form-password-form-item">
						<div class="register-page-mobile-form-input-group">
							<div class="register-page-mobile-form-input-icon">
								<el-icon>
									<lock/>
								</el-icon>
							</div>
							<el-input
								v-model="pageLogic.form.password"
								type="password"
								placeholder="请输入密码"
								class="register-page-mobile-form-custom-input"
								size="large"
								show-password
							/>
						</div>
					</el-form-item>

					<!-- 确认密码字段 -->
					<el-form-item prop="confirmPassword" class="register-page-mobile-form-form-item register-page-mobile-form-password-form-item">
						<div class="register-page-mobile-form-input-group">
							<div class="register-page-mobile-form-input-icon">
								<el-icon>
									<lock/>
								</el-icon>
							</div>
							<el-input
								v-model="pageLogic.form.confirmPassword"
								type="password"
								placeholder="请确认密码"
								class="register-page-mobile-form-custom-input"
								size="large"
								show-password
							/>
						</div>
					</el-form-item>

					<!-- 邀请码字段 -->
					<el-form-item prop="invitationCode" class="register-page-mobile-form-form-item register-page-mobile-form-last-input-form-item">
						<div class="register-page-mobile-form-input-group">
							<div class="register-page-mobile-form-input-icon">
								<el-icon>
									<collection/>
								</el-icon>
							</div>
							<el-input
								v-model="pageLogic.form.invitationCode"
								placeholder="请输入邀请码"
								class="register-page-mobile-form-custom-input"
								size="large"
							/>
						</div>
					</el-form-item>

					<!-- 注册按钮（带加载状态/禁用） -->
					<el-button
						type="primary"
						class="register-page-mobile-form-button"
						size="large"
						:loading="pageLogic.isLoading.value"
						:disabled="pageLogic.isLoading.value"
						@click="pageLogic.handleRegister()"
					>
						{{ pageLogic.isLoading.value ? '注册中...' : '注册' }}
					</el-button>
				</el-form>

				<!-- 卡片底部（登录链接） -->
				<div class="register-page-mobile-form-card-footer">
					<p class="register-page-mobile-form-login-link">
						已有账号？
						<router-link to="/login" class="register-page-mobile-form-link">立即登录</router-link>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
