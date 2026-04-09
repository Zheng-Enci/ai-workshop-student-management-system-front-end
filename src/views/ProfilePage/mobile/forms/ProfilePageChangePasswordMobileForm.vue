<script setup>
/**
 * 个人信息页面-密码修改表单组件(移动端)
 * 
 * @description 提供用户修改密码的功能，包含原密码、新密码、确认新密码三个字段
 * @component ProfilePageChangePasswordMobileForm
 */

// ======================== 导入 ========================
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElIcon, ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'
import { Lock } from '@element-plus/icons-vue'
import ProfilePageChangePasswordMobileForm from '@/views/ProfilePage/mobile/forms/ts/ProfilePageChangePasswordMobileForm'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-message.css'
import '@/views/ProfilePage/mobile/forms/css/ProfilePageChangePasswordMobileForm.css'

const profilePageChangePasswordMobileForm = new ProfilePageChangePasswordMobileForm()

const PASSWORD_RULES = profilePageChangePasswordMobileForm.getPASSWORD_RULES()
const passwordForm = profilePageChangePasswordMobileForm.getpasswordForm()
const formRef = profilePageChangePasswordMobileForm.getformRef()
const isLoading = profilePageChangePasswordMobileForm.getisLoading()

const resetForm = () => profilePageChangePasswordMobileForm.resetForm()
const handleSubmit = emit => profilePageChangePasswordMobileForm.handleSubmit(emit)
const handleCancel = emit => profilePageChangePasswordMobileForm.handleCancel(emit)

// ======================== Props ========================
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false
	}
})

// ======================== Emits ========================
const emit = defineEmits(['update:modelValue', 'success'])

// ======================== 计算属性 ========================
const dialogVisibleComputed = computed({
	get: () => props.modelValue,
	set: (val) => emit('update:modelValue', val)
})

// ======================== 生命周期 ========================
onMounted(() => {
	// 组件挂载后的初始化逻辑
})

// ======================== 暴露 ========================
/**
 * 暴露给父组件的方法
 * @type {Object}
 * @property {Function} resetForm - 重置表单方法
 * @property {Function} handleSubmit - 提交表单方法
 */
defineExpose({
	resetForm,
	handleSubmit
})

</script>

<template>
	<el-dialog
		v-model="dialogVisibleComputed"
		title="修改密码"
		width="90%"
		:close-on-click-modal="false"
		:close-on-press-escape="true"
		modal-class="profile-page-mobile-change-password-dialog-overlay"
		class="profile-page-mobile-change-password-dialog"
	>
		<div class="profile-page-change-password-mobile-form-wrapper">
			<el-form
				ref="formRef"
				:model="passwordForm"
				:rules="PASSWORD_RULES"
				class="profile-page-change-password-mobile-form"
				label-position="top"
			>
				<div class="profile-page-change-password-mobile-form-grid">
					<div class="profile-page-change-password-mobile-form-item">
						<label class="profile-page-change-password-mobile-form-label">
							<el-icon class="profile-page-change-password-mobile-form-label-icon">
								<lock/>
							</el-icon>
							原密码
						</label>
						<el-form-item prop="oldPassword">
							<el-input
								v-model="passwordForm.oldPassword"
								type="password"
								placeholder="请输入原密码"
								maxlength="16"
								show-password
								class="profile-page-change-password-mobile-form-input"
							/>
						</el-form-item>
					</div>

					<div class="profile-page-change-password-mobile-form-item">
						<label class="profile-page-change-password-mobile-form-label">
							<el-icon class="profile-page-change-password-mobile-form-label-icon">
								<lock/>
							</el-icon>
							新密码
						</label>
						<el-form-item prop="newPassword">
							<el-input
								v-model="passwordForm.newPassword"
								type="password"
								placeholder="请输入新密码（6-16位字符）"
								maxlength="16"
								show-password
								class="profile-page-change-password-mobile-form-input"
							/>
						</el-form-item>
						<div class="profile-page-change-password-mobile-form-security-hint">
							<el-icon class="profile-page-change-password-mobile-form-hint-icon">
								<lock/>
							</el-icon>
							<span>建议使用字母、数字和特殊字符组合</span>
						</div>
					</div>

					<div class="profile-page-change-password-mobile-form-item">
						<label class="profile-page-change-password-mobile-form-label">
							<el-icon class="profile-page-change-password-mobile-form-label-icon">
								<lock/>
							</el-icon>
							确认新密码
						</label>
						<el-form-item prop="confirmPassword">
							<el-input
								v-model="passwordForm.confirmPassword"
								type="password"
								placeholder="请再次输入新密码"
								maxlength="16"
								show-password
								class="profile-page-change-password-mobile-form-input"
							/>
						</el-form-item>
					</div>
				</div>

				<div class="profile-page-change-password-mobile-form-actions">
					<el-button
						:disabled="isLoading"
						class="profile-page-change-password-mobile-form-reset-btn"
						@click="handleCancel(emit)"
					>
						取消
					</el-button>
					<el-button
						type="primary"
						:loading="isLoading"
						:disabled="isLoading"
						class="profile-page-change-password-mobile-form-save-btn"
						@click="handleSubmit(emit)"
					>
						确认修改
					</el-button>
				</div>
			</el-form>
		</div>
	</el-dialog>
</template>
