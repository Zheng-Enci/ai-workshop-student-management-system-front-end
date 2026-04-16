import {getVerificationCode} from '@/api/ts/InvitationApi'
import {ElMessage} from 'element-plus'
import {verificationCodeConfig} from './verificationCodeConfig'

let verificationCodeData: any = "正在申请验证码"
let lastRefreshTime: number = 0
let firstVerificationCode: any = ""
let firstVerificationTime: number = 0
let fastRefreshCount: number = 0
let verificationCodeStatus: string = "正在申请获取验证码"

/**
 * 验证码管理类
 * 提供验证码获取和自动刷新功能
 */
class verificationCode {
	/**
	 * 获取验证码数据
	 * @returns 验证码数据或状态信息
	 */
	static getVerificationCodeData() {
		if (verificationCodeStatus !== "验证码") {
			return verificationCodeStatus
		}
		return verificationCodeData
	}

	/**
	 * 获取验证码状态
	 * @returns 验证码状态
	 */
	static getVerificationCodeStatus() {
		return verificationCodeStatus
	}

	/**
	 * 检查是否有权获取验证码
	 * @returns 是否有权获取验证码
	 */
	static async checkVerificationCodePermission() {
		try {
			await getVerificationCode()
			return true
		} catch (error: any) {
			const errorMessage = error?.message || ''
			if (errorMessage.includes('403') || errorMessage.includes('不允许访问') || errorMessage.includes('无权')) {
				verificationCodeStatus = "没有权限获取验证码"
			} else {
				verificationCodeStatus = "验证码获取失败"
			}
			return false
		}
	}

	/**
	 * 获取剩余时间百分比
	 * @returns 剩余时间百分比（0-100）
	 */
	static get remainingTimePercent() {
		if (verificationCodeData === "正在申请验证码") {
			if (firstVerificationTime === 0) {
				return 0
			}

			const now = Date.now()
			const elapsed = (now - firstVerificationTime) / 1000
			const totalTime = elapsed + (fastRefreshCount * verificationCodeConfig.refreshInterval / 1000)
			const randomMultiplier = Math.random() * 3
			const progress = (totalTime / verificationCodeConfig.serverRefreshInterval) * 100 * randomMultiplier

			return Math.min(100, progress)
		}

		const now = Date.now()
		const elapsed = (now - lastRefreshTime) / 1000
		const remaining = verificationCodeConfig.serverRefreshInterval - elapsed
		const progress = 100 - (remaining / verificationCodeConfig.serverRefreshInterval) * 100

		return Math.min(100, Math.max(0, progress))
	}

	/**
	 * 刷新验证码
	 */
	static async refreshVerificationCode() {
		try {
			const response = await getVerificationCode()

			if (response.data !== verificationCodeData) {
				verificationCodeData = response.data
				verificationCodeStatus = "验证码"
				lastRefreshTime = Date.now()
			}
		} catch (error: any) {
			if (error.response && error.response.status === 403) {
				verificationCodeStatus = "本机无权获取验证码"
			} else {
				verificationCodeStatus = "验证码获取失败"
			}
			ElMessage.error(`获取验证码失败：${error}`)
		}
	}

	/**
	 * 启动自动刷新（按配置文件的时间间隔）
	 */
	static async startAutoRefresh() {
		const refresh = async () => {
			await this.refreshVerificationCode()
		}

		const hasPermission = await this.checkVerificationCodePermission()
		if (!hasPermission) {
			verificationCodeStatus = "本机无权获取验证码"
			return
		}

		try {
			const response = await getVerificationCode()
			firstVerificationCode = response.data
			firstVerificationTime = Date.now()
			verificationCodeStatus = "正在申请获取验证码"

			const fastRefresh = async () => {
				fastRefreshCount++

				try {
					const fastResponse = await getVerificationCode()

					if (fastResponse.data !== firstVerificationCode) {
						verificationCodeData = fastResponse.data
						verificationCodeStatus = "验证码"
						lastRefreshTime = Date.now()

						clearInterval(fastRefreshInterval)
						await refresh()
						setInterval(refresh, verificationCodeConfig.refreshInterval)
					}
				} catch (error: any) {
					if (error.response && error.response.status === 403) {
						verificationCodeStatus = "本机无权获取验证码"
					} else {
						verificationCodeStatus = "验证码获取失败"
					}
					ElMessage.error(`快速刷新验证码失败：${error}`)
				}
			}

			const fastRefreshInterval = setInterval(fastRefresh, verificationCodeConfig.refreshInterval)

		} catch (error) {
			ElMessage.error(`首次获取验证码失败：${error}`)
		}
	}
}

export default verificationCode
