<script setup>
/**
 * 个人信息页面-密码修改表单组件(桌面端)
 * 
 * @description 提供用户修改密码的功能，包含原密码、新密码、确认新密码三个字段
 * @component ProfilePageChangePasswordDesktopForm
 */

// ======================== 导入 ========================
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import ChangePasswordApi from '@/views/ProfilePage/js/ChangePassword'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-message.css'

// ======================== 常量 ========================
/**
 * 密码验证规则
 * @type {Object}
 * @description 定义密码修改表单的验证规则
 * @property {Array} oldPassword - 原密码验证规则
 * @property {Array} newPassword - 新密码验证规则(6-16位字符)
 * @property {Array} confirmPassword - 确认新密码验证规则(需与新密码一致)
 */
const PASSWORD_RULES = {
	oldPassword: [
		{ required: true, message: '请输入原密码', trigger: 'blur' }
	],
	newPassword: [
		{ required: true, message: '请输入新密码', trigger: 'blur' },
		{ min: 6, max: 16, message: '密码长度在6到16个字符', trigger: 'blur' }
	],
	confirmPassword: [
		{ required: true, message: '请确认新密码', trigger: 'blur' },
		{
			validator: (rule, value, callback) => {
				if (value && value !== passwordForm.newPassword) {
					callback(new Error('两次输入的密码不一致'))
				} else {
					callback()
				}
			},
			trigger: 'blur'
		}
	]
}

/**
 * 密码表单数据
 * @type {Reactive<Object>}
 * @description 存储密码修改表单的数据
 * @property {string} oldPassword - 原密码
 * @property {string} newPassword - 新密码
 * @property {string} confirmPassword - 确认新密码
 */
const passwordForm = reactive({
	oldPassword: '',
	newPassword: '',
	confirmPassword: ''
})

/**
 * 表单引用
 * @type {Ref<ElForm|null>}
 * @description Element Plus表单组件引用，用于表单验证和重置
 */
const formRef = ref()

/**
 * 加载状态
 * @type {Ref<boolean>}
 * @description 控制密码修改操作的加载状态
 */
const isLoading = ref(false)

// ======================== 方法 ========================
/**
 * 重置表单
 * @function resetForm
 * @description 清空表单数据并清除验证状态
 * @returns {void}
 */
const resetForm = () => {
	passwordForm.oldPassword = ''
	passwordForm.newPassword = ''
	passwordForm.confirmPassword = ''
	if (formRef.value) {
		formRef.value.clearValidate()
	}
}

/**
 * 提交密码修改
 * @function handleSubmit
 * @description 验证表单并提交密码修改请求
 * @returns {Promise<void>}
 */
const handleSubmit = async () => {
	if (!formRef.value) {
		return
	}

	try {
		await formRef.value.validate()
	} catch (error) {
		return
	}

	try {
		// 显示加载提示
		ElMessage.info('正在修改密码...')
		isLoading.value = true

		const token = localStorage.getItem('token')
		if (!token) {
			ElMessage.error('请先登录')
			return
		}

		const response = await ChangePasswordApi.changePassword(token, {
			oldPassword: passwordForm.oldPassword,
			newPassword: passwordForm.newPassword,
			confirmPassword: passwordForm.confirmPassword
		})

		if (response.code === 200) {
			ElMessage.success('密码修改成功')
			resetForm()
			// 通知父组件密码修改成功
			emit('success')
		} else {
			ElMessage.error(response.message || '修改密码失败')
		}
	} catch (error) {
		ElMessage.error(`修改密码失败：${error.message}`)
		if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
			localStorage.removeItem('token')
			localStorage.removeItem('userInfo')
			window.location.href = '/login'
		}
	} finally {
		isLoading.value = false
	}
}

/**
 * 取消密码修改
 * @function handleCancel
 * @description 取消密码修改操作并重置表单
 * @returns {void}
 */
const handleCancel = () => {
	resetForm()
	// 通知父组件取消操作
	emit('cancel')
}

// ======================== 生命周期 ========================
/**
 * 组件挂载时的初始化逻辑
 * @function onMounted
 * @description 组件挂载时执行的初始化操作
 * @returns {void}
 */
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
	<div class="profile-page-change-password-desktop-form-wrapper">
		<el-form
			ref="formRef"
			:model="passwordForm"
			:rules="PASSWORD_RULES"
			class="profile-page-change-password-desktop-form"
			label-position="top"
		>
			<div class="profile-page-change-password-desktop-form-grid">
				<div class="profile-page-change-password-desktop-form-item">
					<label class="profile-page-change-password-desktop-form-label">
						<el-icon class="profile-page-change-password-desktop-form-label-icon">
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
							class="profile-page-change-password-desktop-form-input"
						/>
					</el-form-item>
				</div>

				<div class="profile-page-change-password-desktop-form-item">
					<label class="profile-page-change-password-desktop-form-label">
						<el-icon class="profile-page-change-password-desktop-form-label-icon">
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
							class="profile-page-change-password-desktop-form-input"
						/>
					</el-form-item>
					<div class="profile-page-change-password-desktop-security-hint">
						<el-icon class="profile-page-change-password-desktop-hint-icon">
							<lock/>
						</el-icon>
						<span>建议使用字母、数字和特殊字符组合</span>
					</div>
				</div>

				<div class="profile-page-change-password-desktop-form-item">
					<label class="profile-page-change-password-desktop-form-label">
						<el-icon class="profile-page-change-password-desktop-form-label-icon">
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
							class="profile-page-change-password-desktop-form-input"
						/>
					</el-form-item>
				</div>
			</div>

			<div class="profile-page-change-password-desktop-form-actions">
				<el-button
					:disabled="isLoading"
					class="profile-page-change-password-desktop-reset-btn"
					@click="handleCancel"
				>
					取消
				</el-button>
				<el-button
					type="primary"
					:loading="isLoading"
					:disabled="isLoading"
					class="profile-page-change-password-desktop-save-btn"
					@click="handleSubmit"
				>
					确认修改
				</el-button>
			</div>
		</el-form>
	</div>
</template>

<style>
/**
 * 表单容器
 * @block profile-page-change-password-desktop-form-wrapper
 */
.profile-page-change-password-desktop-form-wrapper {
	width: 100%;
	max-width: 600px;
	margin: 0 auto;
}

/**
 * 密码修改表单
 * @block profile-page-change-password-desktop-form
 */
.profile-page-change-password-desktop-form {
	--el-form-label-font-size: 14px;
	--el-form-item-margin-bottom: 24px;
}

/**
 * 表单网格布局
 * @block profile-page-change-password-desktop-form-grid
 */
.profile-page-change-password-desktop-form-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 24px;
}

/**
 * 表单项
 * @block profile-page-change-password-desktop-form-item
 */
.profile-page-change-password-desktop-form-item {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

/**
 * 表单标签
 * @block profile-page-change-password-desktop-form-label
 */
.profile-page-change-password-desktop-form-label {
	display: flex;
	align-items: center;
	gap: 8px;
	font-weight: 500;
	color: var(--el-text-color-primary);
	font-size: 14px;
}

/**
 * 表单标签图标
 * @block profile-page-change-password-desktop-form-label-icon
 */
.profile-page-change-password-desktop-form-label-icon {
	color: var(--el-color-primary);
}

/**
 * 表单输入框
 * @block profile-page-change-password-desktop-form-input
 */
.profile-page-change-password-desktop-form-input {
	width: 100%;
}

/**
 * 安全提示
 * @block profile-page-change-password-desktop-security-hint
 */
.profile-page-change-password-desktop-security-hint {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 12px;
	color: var(--el-text-color-secondary);
}

/**
 * 提示图标
 * @block profile-page-change-password-desktop-hint-icon
 */
.profile-page-change-password-desktop-hint-icon {
	color: var(--el-color-info);
}

/**
 * 表单操作按钮组
 * @block profile-page-change-password-desktop-form-actions
 */
.profile-page-change-password-desktop-form-actions {
	display: flex;
	justify-content: flex-end;
	gap: 16px;
	margin-top: 32px;
}

/**
 * 重置按钮
 * @block profile-page-change-password-desktop-reset-btn
 */
.profile-page-change-password-desktop-reset-btn {
	min-width: 100px;
}

/**
 * 保存按钮
 * @block profile-page-change-password-desktop-save-btn
 */
.profile-page-change-password-desktop-save-btn {
	min-width: 120px;
}

</style>
