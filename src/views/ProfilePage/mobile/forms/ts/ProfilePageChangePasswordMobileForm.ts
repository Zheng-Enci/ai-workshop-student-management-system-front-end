/**
 * 个人信息页面-密码修改表单组件(移动端) - 核心逻辑
 * 
 * @description 提供用户修改密码的功能，包含原密码、新密码、确认新密码三个字段
 * @class ProfilePageChangePasswordMobileForm
 */

import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import ChangePasswordApi from '@/views/ProfilePage/desktop/common/ts/profile-page-common-change-password'

export default class ProfilePageChangePasswordMobileForm {
	/**
	 * 密码验证规则
	 * @private
	 */
	private PASSWORD_RULES = {
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
					if (value && value !== this.passwordForm.newPassword) {
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
	 * @private
	 */
	private passwordForm = reactive({
		oldPassword: '',
		newPassword: '',
		confirmPassword: ''
	})

	/**
	 * 表单引用
	 * @private
	 */
	private formRef = ref()

	/**
	 * 加载状态
	 * @private
	 */
	private isLoading = ref(false)

	/**
	 * 获取密码验证规则
	 * @returns {Object} 验证规则对象
	 */
	public getPASSWORD_RULES() {
		return this.PASSWORD_RULES
	}

	/**
	 * 获取密码表单数据
	 * @returns {Object} 密码表单数据
	 */
	public getpasswordForm() {
		return this.passwordForm
	}

	/**
	 * 获取表单引用
	 * @returns {Ref<ElForm|null>} 表单引用
	 */
	public getformRef() {
		return this.formRef
	}

	/**
	 * 获取加载状态
	 * @returns {Ref<boolean>} 加载状态
	 */
	public getisLoading() {
		return this.isLoading
	}

	/**
	 * 重置表单
	 * @public
	 * @method resetForm
	 * @description 清空表单数据并清除验证状态
	 * @returns {void}
	 */
	public resetForm() {
		this.passwordForm.oldPassword = ''
		this.passwordForm.newPassword = ''
		this.passwordForm.confirmPassword = ''
		if (this.formRef.value) {
			this.formRef.value.clearValidate()
		}
	}

	/**
	 * 提交密码修改
	 * @public
	 * @method handleSubmit
	 * @description 验证表单并提交密码修改请求
	 * @param {Function} emit - Vue emit 函数，用于触发事件
	 * @returns {Promise<void>}
	 */
	public async handleSubmit(emit) {
		if (!this.formRef.value) {
			return
		}

		try {
			await this.formRef.value.validate()
		} catch (error) {
			return
		}

		try {
			// 显示加载提示
			ElMessage.info('正在修改密码...')
			this.isLoading.value = true

			const token = localStorage.getItem('token')
			if (!token) {
				ElMessage.error('请先登录')
				return
			}

			const response = await ChangePasswordApi.changePassword(token, {
				oldPassword: this.passwordForm.oldPassword,
				newPassword: this.passwordForm.newPassword,
				confirmPassword: this.passwordForm.confirmPassword
			})

			if (response.code === 200) {
				ElMessage.success('密码修改成功')
				this.resetForm()
				// 通知父组件密码修改成功并关闭对话框
				emit('success')
				emit('close')
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
			this.isLoading.value = false
		}
	}

	/**
	 * 取消密码修改
	 * @public
	 * @method handleCancel
	 * @param {Function} emit - Vue emit 函数，用于触发事件
	 * @returns {void}
	 */
	public handleCancel(emit) {
		this.resetForm()
		emit('close')
	}
}
