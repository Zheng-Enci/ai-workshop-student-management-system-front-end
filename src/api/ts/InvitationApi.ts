/**
 * 邀请码API接口模块
 * 提供邀请码相关的API调用方法
 *
 * @module api/InvitationApi
 * @description 封装邀请码相关的API接口，包括查询邀请码等功能
 */

import ApiInterceptor from '../../composables/ApiInterceptor'
import type { AxiosInstance, AxiosError } from 'axios'

/**
 * API响应类型
 */
interface InvitationCodeResponse {
	data: string
}

/**
 * Axios错误类型
 */
interface AxiosError {
	response?: {
		status: number
		data?: {
			message?: string
		}
	}
}

/**
 * 邀请码API类
 * 提供邀请码相关的API调用方法
 *
 * @class InvitationApi
 * @description 使用ApiInterceptor创建的axios实例进行HTTP请求
 */
class InvitationApi {
	/**
	 * axios实例
	 * 使用ApiInterceptor创建的带拦截器的axios实例
	 *
	 * @static
	 */
	static api: AxiosInstance = ApiInterceptor.createInstance()

	/**
	 * 查询邀请码
	 * 根据JWT Token查询当前用户的最新邀请码
	 * 如果用户没有邀请码，系统会自动生成一个新的邀请码
	 *
	 * @static
	 * @returns {Promise<string>} 邀请码字符串（UUID格式）
	 * @throws {Error} 网络错误或服务器错误时抛出异常
	 * @example
	 * // 查询当前用户的邀请码
	 * const invitationCode = await InvitationApi.getInvitationCode()
	 * console.log(invitationCode) // "550e8400-e29b-41d4-a716-446655440000"
	 */
	static async getInvitationCode(): Promise<string> {
		try {
			const response = await this.api.get<InvitationCodeResponse>('/api/v1/invitation-code')
			return response.data.data
		} catch (error) {
			const axiosError = error as AxiosError<{ message: string }>
			const msg = axiosError.response?.data?.message
			throw new Error(axiosError.response?.status && axiosError.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		}
	}
}

/**
 * 导出邀请码API类
 * @exports InvitationApi
 */
export default InvitationApi
