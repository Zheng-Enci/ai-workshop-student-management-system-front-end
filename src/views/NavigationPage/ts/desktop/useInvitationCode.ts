/**
 * 邀请码管理模块
 * 提供邀请码获取、复制和错误处理功能
 */
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import InvitationApi from '@/api/ts/InvitationApi'

/**
 * 邀请码状态枚举
 */
enum InvitationCodeStatus {
	/**
	 * 邀请码获取失败
	 */
	FETCH_FAILED = 'fetch_failed',
	/**
	 * 无权获取邀请码
	 */
	NO_PERMISSION = 'no_permission',
	/**
	 * 邀请码
	 */
	HAS_CODE = 'has_code'
}

/**
 * 邀请码管理类
 */
class InvitationCodeManager {
	loading = ref(false)
	invitationCode = ref<string | null>(null)
	error = ref<string | null>(null)
	status = ref<InvitationCodeStatus | null>(null)
	token = ref<string | null>(null)

	/**
	 * 设置用户认证token
	 * @param token 用户认证token
	 */
	setToken(token: string | null) {
		this.token.value = token
	}

	/**
	 * 获取邀请码
	 * 每次都从服务器获取最新邀请码，不使用缓存
	 * @returns 获取结果
	 */
	async fetchInvitationCode() {
		if (!this.token.value) {
			ElMessage.error('未登录，请先登录')
			this.status.value = InvitationCodeStatus.FETCH_FAILED
			return { success: false, message: '未登录，请先登录' }
		}

		try {
			const result = await InvitationApi.getInvitationCode(this.token.value)

			if (result.code === 400) {
				this.error.value = result.message

				if (result.message && result.message.includes('权限')) {
					this.status.value = InvitationCodeStatus.NO_PERMISSION
				} else {
					this.status.value = InvitationCodeStatus.FETCH_FAILED
				}

				return { success: false, message: this.error.value }
			}

			if (result.code === 200 && result.data) {
				this.invitationCode.value = result.data
				this.status.value = InvitationCodeStatus.HAS_CODE
				return { success: true, data: result.data }
			}

			this.status.value = InvitationCodeStatus.FETCH_FAILED
			return { success: false, message: result.message || '获取邀请码失败' }
		} catch (err: any) {
			ElMessage.error(err.message || '获取邀请码失败')

			if (err.message && err.message.includes('无权')) {
				this.status.value = InvitationCodeStatus.NO_PERMISSION
			} else {
				this.status.value = InvitationCodeStatus.FETCH_FAILED
			}

			return { success: false, message: this.error.value }
		}
	}

	/**
	 * 复制邀请码到剪贴板
	 * @param code 邀请码，必须提供
	 * @returns 复制结果
	 */
	async copyInvitationCode(code: string) {
		if (!code) {
			ElMessage.warning('没有可复制的邀请码')
			return { success: false, message: '没有可复制的邀请码' }
		}

		try {
			await navigator.clipboard.writeText(code)
			ElMessage.success('邀请码已复制到剪贴板')
			return { success: true }
		} catch (err) {
			ElMessage.error('复制失败，请手动复制')
			return { success: false, message: '复制失败' }
		}
	}

	/**
	 * 初始化模块
	 * @returns 初始化结果
	 */
	async init() {
		this.loading.value = false
		this.invitationCode.value = null
		this.error.value = null
		this.status.value = null
		return { success: true }
	}
}

/**
 * 创建邀请码管理实例
 * @returns 邀请码管理实例
 */
export function useInvitationCode() {
	return new InvitationCodeManager()
}

export default InvitationCodeManager
export { InvitationCodeStatus }
