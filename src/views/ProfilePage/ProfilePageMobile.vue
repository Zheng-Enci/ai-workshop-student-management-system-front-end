<script setup>
/**
 * 个人信息页面组件(移动端)
 *
 * @description 提供用户个人信息的查看、编辑、密码修改和头像上传功能(移动端适配)
 * @component ProfilePageMobile
 */
import { onMounted } from 'vue'
import { ElButton, ElIcon, ElInput, ElSelect, ElOption, ElFormItem, ElForm, ElInputNumber } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-select.css'
import 'element-plus/theme-chalk/el-option.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-input-number.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-scrollbar.css'
import 'element-plus/theme-chalk/base.css'
import { ArrowLeft, Edit, Lock, Calendar } from '@element-plus/icons-vue'

import LoadingMask from '@/components/LoadingMask.vue'
import ProfilePageUploadAvatarMobileForm from '@/views/ProfilePage/mobile/forms/ProfilePageUploadAvatarMobileForm.vue'
import ProfilePageChangePasswordMobileForm from '@/views/ProfilePage/mobile/forms/ProfilePageChangePasswordMobileForm.vue'
import ProfilePageMobileClass from '@/views/ProfilePage/mobile/ts/ProfilePageMobile'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-scrollbar.css'
import '@/views/ProfilePage/mobile/css/profile-page-mobile-user-info.css'
import '@/views/ProfilePage/mobile/css/profile-page-mobile-header.css'
import '@/views/ProfilePage/mobile/css/profile-page-mobile-form-section.css'
import '@/views/ProfilePage/mobile/css/profile-page-mobile-security.css'
import '@/views/ProfilePage/mobile/forms/css/ProfilePageChangePasswordMobileForm.css'

const profilePageMobile = new ProfilePageMobileClass()

const formRef = profilePageMobile.formRef
const isLoading = profilePageMobile.isLoading
const isEditing = profilePageMobile.isEditing
const attendanceCount = profilePageMobile.attendanceCount
const studentInfoId = profilePageMobile.studentInfoId
const formData = profilePageMobile.formData
const rules = profilePageMobile.rules
const showPasswordDialog = profilePageMobile.showPasswordDialog

const goBack = () => profilePageMobile.goBack()
const toggleTheme = () => profilePageMobile.toggleTheme()
const loadProfile = () => profilePageMobile.loadProfile()
const handleAvatarUploadSuccess = () => profilePageMobile.handleAvatarUploadSuccess()
const handleAvatarUploadError = () => profilePageMobile.handleAvatarUploadError()
const toggleEditMode = () => profilePageMobile.toggleEditMode()
const openPasswordDialog = () => {
	profilePageMobile.openPasswordDialog()
}
const resetForm = () => profilePageMobile.resetForm()
const saveProfile = () => profilePageMobile.saveProfile()
const closePasswordDialog = () => {
	profilePageMobile.closePasswordDialog()
}

onMounted(() => {
	loadProfile()
})
</script>

<template>
	<!-- 个人信息页面主容器(移动端) -->
	<div class="profile-container">
		<!-- 全局加载蒙版 -->
		<LoadingMask/>
		<!-- 页面头部 -->
		<div class="profile-page-mobile-header">
			<div class="profile-page-mobile-header-content">
				<el-button
					class="profile-page-mobile-header-back-btn"
					type="primary"
					:icon="ArrowLeft"
					circle
					@click="goBack"/>
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊"
					class="profile-page-mobile-header-logo"
					@click="toggleTheme"/>
				<div class="profile-page-mobile-header-title-section">
					<h1>个人信息</h1>
					<p>Personal Profile</p>
				</div>
			</div>
		</div>

		<!-- 主内容区域 -->
		<div class="main-content">
			<!-- 个人信息卡片 -->
			<div class="profile-page-mobile-profile-card">
				<!-- 加载遮罩 -->
				<div v-if="isLoading" class="loading-overlay">
					<div class="loading-spinner"/>
				</div>

				<!-- 用户信息头部 -->
				<div class="profile-page-mobile-profile-header">
					<div class="profile-page-mobile-user-info-section">
						<!-- 头像上传组件 -->
						<ProfilePageUploadAvatarMobileForm
							:student-info-id="studentInfoId"
							@upload-success="handleAvatarUploadSuccess"
							@upload-error="handleAvatarUploadError"
						/>
						<!-- 用户详细信息 -->
						<div class="profile-page-mobile-user-details">
							<h2>{{ formData.name || '用户' }}</h2>
							<p class="profile-page-mobile-student-id">{{ formData.studentId || '学号' }}</p>
							<div class="profile-page-mobile-user-stats">
								<div v-if="attendanceCount !== null" class="profile-page-mobile-stat-item">
									<el-icon class="profile-page-mobile-stat-icon">
										<calendar/>
									</el-icon>
									<span class="profile-page-mobile-stat-text">已签到 {{ attendanceCount }} 次</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="profile-page-mobile-form-section">
				<div class="profile-page-mobile-form-section-header">
					<div class="profile-page-mobile-form-section-title-wrapper">
						<div>
							<h3>基本信息</h3>
							<p>管理您的个人资料信息</p>
						</div>
						<el-button
							type="primary"
							:icon="Edit"
							:disabled="isLoading"
							class="profile-page-mobile-form-section-edit-btn"
							@click="toggleEditMode"
						>
							{{ isEditing ? '取消' : '编辑' }}
						</el-button>
					</div>
					<div class="profile-page-mobile-form-section-security-badge">
						<el-icon class="badge-icon">
							<lock/>
						</el-icon>
						<span>安全保护</span>
					</div>
				</div>

				<el-form
					ref="formRef"
					:model="formData"
					:rules="rules"
					class="profile-page-mobile-form-section-profile-form"
				>
					<div class="profile-page-mobile-form-section-form-grid">
							<div class="profile-page-mobile-form-section-form-item">
								<label class="profile-page-mobile-form-section-form-label">姓名</label>
								<el-form-item prop="name">
									<el-input
										v-model="formData.name"
										:disabled="!isEditing"
										placeholder="请输入姓名"
										maxlength="20"
										class="profile-page-mobile-form-section-form-input"
									/>
								</el-form-item>
							</div>

							<div class="profile-page-mobile-form-section-form-item">
								<label class="profile-page-mobile-form-section-form-label">学号</label>
								<el-form-item prop="studentId">
									<el-input
										v-model="formData.studentId"
										:disabled="!isEditing"
										placeholder="请输入学号"
										maxlength="10"
										class="profile-page-mobile-form-section-form-input"
									/>
								</el-form-item>
							</div>

							<div class="profile-page-mobile-form-section-form-item">
								<label class="profile-page-mobile-form-section-form-label">性别</label>
								<el-form-item prop="gender">
									<el-select
										v-model="formData.gender"
										:disabled="!isEditing"
										placeholder="请选择性别"
										class="profile-page-mobile-form-section-form-input"
									>
										<el-option label="男" value="男"/>
										<el-option label="女" value="女"/>
									</el-select>
								</el-form-item>
							</div>

							<div class="profile-page-mobile-form-section-form-item">
								<label class="profile-page-mobile-form-section-form-label">手机号</label>
								<el-form-item prop="phoneNumber">
									<el-input
										v-model="formData.phoneNumber"
										:disabled="!isEditing"
										placeholder="请输入手机号"
										maxlength="11"
										class="profile-page-mobile-form-section-form-input"
									/>
								</el-form-item>
							</div>

							<div class="profile-page-mobile-form-section-form-item">
								<label class="profile-page-mobile-form-section-form-label">学院</label>
								<el-form-item prop="college">
									<el-input
										v-model="formData.college"
										:disabled="!isEditing"
										placeholder="请输入学院"
										maxlength="50"
										class="profile-page-mobile-form-section-form-input"
									/>
								</el-form-item>
							</div>

							<div class="profile-page-mobile-form-section-form-item">
								<label class="profile-page-mobile-form-section-form-label">专业</label>
								<el-form-item prop="major">
									<el-input
										v-model="formData.major"
										:disabled="!isEditing"
										placeholder="请输入专业"
										maxlength="50"
										class="profile-page-mobile-form-section-form-input"
									/>
								</el-form-item>
							</div>

							<div class="profile-page-mobile-form-section-form-item">
								<label class="profile-page-mobile-form-section-form-label">年级</label>
								<el-form-item prop="grade">
									<el-select
										v-model="formData.grade"
										:disabled="!isEditing"
										placeholder="请选择年级"
										class="profile-page-mobile-form-section-form-input"
									>
										<el-option label="1年级" :value="1"/>
										<el-option label="2年级" :value="2"/>
										<el-option label="3年级" :value="3"/>
										<el-option label="4年级" :value="4"/>
										<el-option label="5年级" :value="5"/>
									</el-select>
								</el-form-item>
							</div>

							<div class="profile-page-mobile-form-section-form-item">
								<label class="profile-page-mobile-form-section-form-label">班级</label>
								<el-form-item prop="classNum">
									<el-input-number
										v-model="formData.classNum"
										:disabled="!isEditing"
										:min="1"
										:max="100"
										placeholder="请输入班级"
										class="profile-page-mobile-form-section-form-input"
									/>
								</el-form-item>
							</div>

							<div class="profile-page-mobile-form-section-form-item">
								<label class="profile-page-mobile-form-section-form-label">当前密码</label>
								<el-form-item prop="password">
									<el-input
										v-model="formData.password"
										type="password"
										:disabled="!isEditing"
										placeholder="请输入当前密码以确认身份"
										maxlength="16"
										show-password
										class="profile-page-mobile-form-section-form-input"
									/>
								</el-form-item>
							</div>
						</div>

						<div v-if="isEditing" class="form-actions">
							<el-button :disabled="isLoading" class="reset-btn" @click.prevent="resetForm">
								重置
							</el-button>
							<el-button
								type="primary"
								:loading="isLoading"
								:disabled="isLoading"
								class="save-btn"
								@click="saveProfile">
								保存修改
							</el-button>
						</div>
					</el-form>
				</div>

				<div class="password-section">
					<div class="section-header">
						<h3>安全设置</h3>
						<p>保护您的账户安全</p>
					</div>
					<div class="security-card">
						<div class="security-info">
							<div class="security-icon">
								<el-icon>
									<lock/>
								</el-icon>
							</div>
							<div class="security-content">
								<h4>密码管理</h4>
								<p>定期修改密码有助于保护账户安全</p>
							</div>
						</div>
						<el-button
							type="primary"
							:icon="Lock"
							class="security-btn"
							@click="openPasswordDialog">
							修改密码
						</el-button>
					</div>
				</div>
			</div>
		</div>

		<!-- 密码修改对话框组件 -->
		<ProfilePageChangePasswordMobileForm
			v-model="showPasswordDialog"
			@success="loadProfile"
			@close="closePasswordDialog"
		/>
	</div>
</template>

<style scoped>
/* 入场动画 */
.profile-container {
	animation: fadeInUp 0.8s ease-out forwards;
	opacity: 0;
	transform: translateY(20px);
}

/* 淡入上移动画 */
@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* 为不同区块添加延迟动画，增强层次感 */
.profile-page-mobile-header {
	animation: fadeInUp 0.6s ease-out 0.1s forwards;
	opacity: 0;
	transform: translateY(20px);
}

.profile-page-mobile-profile-card {
	animation: fadeInUp 0.6s ease-out 0.2s forwards;
	opacity: 0;
	transform: translateY(20px);
}

.profile-page-mobile-form-section {
	animation: fadeInUp 0.6s ease-out 0.3s forwards;
	opacity: 0;
	transform: translateY(20px);
}

.password-section {
	animation: fadeInUp 0.6s ease-out 0.4s forwards;
	opacity: 0;
	transform: translateY(20px);
}
</style>


