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
		console.log('[验证码] getVerificationCodeData 被调用, 当前状态:', verificationCodeStatus, ', 数据:', verificationCodeData)
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
		console.log('[验证码] getVerificationCodeStatus 被调用, 返回:', verificationCodeStatus)
		return verificationCodeStatus
	}

	/**
	 * 检查是否有权获取验证码
	 * @returns 是否有权获取验证码
	 */
	static async checkVerificationCodePermission() {
		console.log('[验证码] checkVerificationCodePermission 开始检查权限')
		try {
			const result = await getVerificationCode()
			console.log('[验证码] checkVerificationCodePermission API返回:', result)
			return true
		} catch (error: any) {
			console.error('[验证码] checkVerificationCodePermission 错误:', error)
			const errorMessage = error?.message || ''
			if (errorMessage.includes('403') || errorMessage.includes('不允许访问') || errorMessage.includes('无权')) {
				verificationCodeStatus = "没有权限获取验证码"
			} else {
				verificationCodeStatus = "验证码获取失败"
			}
			console.log('[验证码] checkVerificationCodePermission 权限检查失败, 状态:', verificationCodeStatus)
			return false
		}
	}

	/**
	 * 获取剩余时间百分比
	 * @returns 剩余时间百分比（0-100）
	 */
	static get remainingTimePercent() {
		console.log('[验证码] remainingTimePercent 被调用, 状态:', verificationCodeStatus)
		// 如果验证码一直是"正在申请验证码"，计算基于快速刷新过程的进度
		if (verificationCodeData === "正在申请验证码") {
			// 如果还没有开始第一次获取，返回0
			if (firstVerificationTime === 0) {
				console.log('[验证码] remainingTimePercent: firstVerificationTime=0, 返回0')
				return 0
			}
			
			const now = Date.now()
			const elapsed = (now - firstVerificationTime) / 1000 // 转换为秒
			const totalTime = elapsed + (fastRefreshCount * verificationCodeConfig.refreshInterval / 1000)
			// 乘以0到3的随机值
			const randomMultiplier = Math.random() * 3
			const progress = (totalTime / verificationCodeConfig.serverRefreshInterval) * 100 * randomMultiplier
			
			// 确保进度不超过100%
			const result = Math.min(100, progress)
			console.log('[验证码] remainingTimePercent: 申请中, 返回', result)
			return result
		}

		// 正常情况：验证码已经变化，使用正常的剩余时间计算
		const now = Date.now()
		const elapsed = (now - lastRefreshTime) / 1000
		const remaining = verificationCodeConfig.serverRefreshInterval - elapsed
		const progress = 100 - (remaining / verificationCodeConfig.serverRefreshInterval) * 100
		
		// 确保进度在0-100范围内
		const result = Math.min(100, Math.max(0, progress))
		console.log('[验证码] remainingTimePercent: 正常, 返回', result)
		return result
	}

	/**
	 * 刷新验证码
	 */
	static async refreshVerificationCode() {
		console.log('[验证码] refreshVerificationCode 开始刷新')
		try {
			const response = await getVerificationCode()
			console.log('[验证码] refreshVerificationCode API返回:', response.data)
			
			// 只有当获取到的验证码与第一次获取的不同时，才显示真实验证码
			if (response.data !== verificationCodeData) {
				console.log('[验证码] 验证码发生变化, 更新数据')
				verificationCodeData = response.data
				verificationCodeStatus = "验证码"
				// 只有在验证码变化时才更新刷新时间
				lastRefreshTime = Date.now()
			} else {
				console.log('[验证码] 验证码未变化, 保持当前状态')
			}
		} catch (error: any) {
			console.error('[验证码] refreshVerificationCode 错误:', error)
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
		console.log('[验证码] startAutoRefresh 开始启动自动刷新')
		const refresh = async () => {
			await this.refreshVerificationCode()
		}

		const hasPermission = await this.checkVerificationCodePermission()
		console.log('[验证码] startAutoRefresh 权限检查结果:', hasPermission)
		if (!hasPermission) {
			verificationCodeStatus = "本机无权获取验证码"
			return
		}

		try {
			const response = await getVerificationCode()
			console.log('[验证码] startAutoRefresh 首次获取验证码:', response.data)
			firstVerificationCode = response.data
			firstVerificationTime = Date.now()
			verificationCodeStatus = "正在申请获取验证码"
			
			// 快速刷新：每隔500ms获取验证码，直到验证码变化
			const fastRefresh = async () => {
				// 更新快速刷新执行次数
				fastRefreshCount++
				console.log('[验证码] fastRefresh 第', fastRefreshCount, '次执行')
				
				try {
					const fastResponse = await getVerificationCode()
					console.log('[验证码] fastRefresh API返回:', fastResponse.data, ', 首次:', firstVerificationCode)
					
					// 如果验证码与第一次不同，开始正常刷新流程
					if (fastResponse.data !== firstVerificationCode) {
						console.log('[验证码] fastRefresh 检测到验证码变化, 切换到正常模式')
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
					console.error('[验证码] fastRefresh 错误:', error)
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
			console.log('[验证码] startAutoRefresh 启动快速刷新, 间隔:', verificationCodeConfig.refreshInterval)
			const fastRefreshInterval = setInterval(fastRefresh, verificationCodeConfig.refreshInterval)
			
		} catch (error) {
			console.error('[验证码] startAutoRefresh 首次获取验证码失败:', error)
			ElMessage.error(`首次获取验证码失败：${error}`)
		}
	}
}

export default verificationCode
