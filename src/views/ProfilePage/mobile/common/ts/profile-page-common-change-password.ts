/**
 * 密码修改API模块
 * 提供密码修改相关的API调用方法
 *
 * @module api/ChangePassword
 * @description 封装密码修改相关的HTTP请求，包含完整的错误处理
 */

import ApiInterceptor from '@/composables/ts/ApiInterceptor'

/**
 * 密码修改请求数据接口
 * 定义修改密码时需要的参数结构
 *
 * @interface ChangePasswordData
 * @property {string} oldPassword - 原密码
 * @property {string} newPassword - 新密码
 */
interface ChangePasswordData {
	/** 原密码 */
	oldPassword: string
	/** 新密码 */
	newPassword: string
}

/**
 * 密码修改响应数据接口
 * 定义修改密码接口返回的数据结构
 *
 * @interface ChangePasswordResponse
 * @property {boolean} success - 是否成功
 * @property {string} [message] - 响应消息
 * @property {unknown} [data] - 附加数据
 */
interface ChangePasswordResponse {
	/** 是否成功 */
	success: boolean
	/** 响应消息 */
	message?: string
	/** 附加数据 */
	data?: unknown
}

/**
 * 密码修改API类
 * 提供密码修改相关的API调用方法
 */
class ChangePasswordApi {
	/**
	 * API拦截器实例
	 * 使用ApiInterceptor创建axios实例，包含统一的请求拦截和错误处理
	 */
	static api: import('axios').AxiosInstance = ApiInterceptor.createInstance()

	/**
	 * 修改密码
	 * 用户修改账户密码
	 *
	 * @param {string} token - 用户认证token
	 * @param {ChangePasswordData} data - 密码修改数据
	 * @returns {Promise<ChangePasswordResponse>} 修改结果数据
	 * @throws {Error} 修改失败时抛出错误
	 * @description
	 * - Token无效时抛出'Token无效，请重新登录'
	 * - 原密码错误时抛出'原密码错误或参数验证失败'
	 * - 服务器错误时抛出'服务器错误，请稍后重试'
	 * - 其他错误抛出服务器返回的消息或'修改密码失败'
	 */
	static async changePassword(
		token: string,
		data: ChangePasswordData
	): Promise<ChangePasswordResponse> {
		try {
			const response = await this.api.post('/api/v1/students/change-password', data, {
				params: { token }
			})
			return response.data
		} catch (error: unknown) {
			// 使用类型守卫检查error是否为AxiosError
			if (this.isAxiosError(error) && error.response) {
				const { status } = error.response
				if (status === 401) {
					throw new Error('Token无效，请重新登录')
				} else if (status === 400) {
					throw new Error('原密码错误或参数验证失败')
				} else if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					// 安全地访问data属性
					const responseData = error.response.data as { message?: string } | undefined
					throw new Error(responseData?.message || '修改密码失败')
				}
			} else {
				throw new Error('网络错误，修改密码失败')
			}
		}
	}

	/**
	 * 类型守卫：检查错误是否为AxiosError
	 * 用于安全地访问AxiosError特有的属性
	 *
	 * @private
	 * @param {unknown} error - 待检查的错误对象
	 * @returns {boolean} 是否为AxiosError
	 */
	private static isAxiosError(error: unknown): error is import('axios').AxiosError {
		return (
			typeof error === 'object' &&
			error !== null &&
			'response' in error
		)
	}
}

export default ChangePasswordApi
