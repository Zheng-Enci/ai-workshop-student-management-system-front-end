import AttendanceApi from '@/api/AttendanceApi'
import {getVerificationCode} from '@/api/attendance'
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
        console.log(verificationCodeData)
		// 如果状态不是"验证码"，返回状态信息
		if (verificationCodeStatus !== "验证码") {
			return verificationCodeStatus
		}
		// 状态为"验证码"时返回真实验证码数据
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
			console.log('[验证码权限检查] 开始检查...')
			const result = await getVerificationCode()
			console.log('[验证码权限检查] API返回结果:', result)
			return true
		} catch (error: any) {
			console.log('[验证码权限检查] API调用失败:', error)
			console.log('[验证码权限检查] error.message:', error?.message)
			console.log('[验证码权限检查] error.response:', error?.response)
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
		// 如果验证码一直是"正在申请验证码"，计算基于快速刷新过程的进度
		if (verificationCodeData === "正在申请验证码") {
			// 如果还没有开始第一次获取，返回0
			if (firstVerificationTime === 0) {
				return 0
			}
			
			const now = Date.now()
			const elapsed = (now - firstVerificationTime) / 1000 // 转换为秒
			const totalTime = elapsed + (fastRefreshCount * verificationCodeConfig.refreshInterval / 1000)
			// 乘以0到3的随机值
			const randomMultiplier = Math.random() * 3
			const progress = (totalTime / verificationCodeConfig.serverRefreshInterval) * 100 * randomMultiplier
			
			// 确保进度不超过100%
			return Math.min(100, progress)
		}

		// 正常情况：验证码已经变化，使用正常的剩余时间计算
		const now = Date.now()
		const elapsed = (now - lastRefreshTime) / 1000
		const remaining = verificationCodeConfig.serverRefreshInterval - elapsed
		const progress = 100 - (remaining / verificationCodeConfig.serverRefreshInterval) * 100
		
		// 确保进度在0-100范围内
		return Math.min(100, Math.max(0, progress))
	}

	/**
	 * 刷新验证码
	 */
	static async refreshVerificationCode() {
		try {
			const response = await getVerificationCode()
			
			// 只有当获取到的验证码与第一次获取的不同时，才显示真实验证码
			if (response.data !== verificationCodeData) {
				verificationCodeData = response.data
				verificationCodeStatus = "验证码"
				// 只有在验证码变化时才更新刷新时间
				lastRefreshTime = Date.now()
			} 
		} catch (error: any) {
			// 根据错误类型设置状态
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
		console.log('[验证码] startAutoRefresh 开始执行')
		const refresh = async () => {
			await this.refreshVerificationCode()
		}

		// 首先检查是否有权获取验证码
		const hasPermission = await this.checkVerificationCodePermission()
		console.log('[验证码] 权限检查结果:', hasPermission)
		if (!hasPermission) {
			// 无权获取验证码，设置状态并返回
			verificationCodeStatus = "本机无权获取验证码"
			return
		}

		// 有权获取验证码，继续执行后续逻辑
		try {
			console.log('[验证码] 开始获取验证码...')
			const response = await getVerificationCode()
			console.log('[验证码] getVerificationCode 返回:', response)
			firstVerificationCode = response.data
			firstVerificationTime = Date.now()
			// 设置状态为正在申请获取验证码
			verificationCodeStatus = "正在申请获取验证码"
			
			// 快速刷新：每隔500ms获取验证码，直到验证码变化
			const fastRefresh = async () => {
				// 更新快速刷新执行次数
				fastRefreshCount++
				
				try {
					const fastResponse = await getVerificationCode()
					
					// 如果验证码与第一次不同，开始正常刷新流程
					if (fastResponse.data !== firstVerificationCode) {
						// 更新验证码数据和状态
						verificationCodeData = fastResponse.data
						verificationCodeStatus = "验证码"
						lastRefreshTime = Date.now()
						
						// 停止快速刷新，开始正常刷新
						clearInterval(fastRefreshInterval)
						refresh()
						setInterval(refresh, verificationCodeConfig.refreshInterval)
					}
				} catch (error: any) {
					// 根据错误类型设置状态
					if (error.response && error.response.status === 403) {
						verificationCodeStatus = "本机无权获取验证码"
					} else {
						verificationCodeStatus = "验证码获取失败"
					}
					ElMessage.error(`快速刷新验证码失败：${error}`)
				}
			}
			
			// 启动快速刷新
			const fastRefreshInterval = setInterval(fastRefresh, verificationCodeConfig.refreshInterval)
			
		} catch (error) {
			ElMessage.error(`首次获取验证码失败：${error}`)
		}
	}
}

export default verificationCode
