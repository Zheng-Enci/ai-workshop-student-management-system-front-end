/**
 * 密码修改API模块
 * 提供密码修改相关的API调用方法
 *
 * @module api/ChangePassword
 * @description 封装密码修改相关的HTTP请求，包含完整的错误处理
 */

import ApiInterceptor from '@/composables/ApiInterceptor'
import config from '@/config'

/**
 * 密码修改API类
 * 提供密码修改相关的API调用方法
 */
class ChangePasswordApi {
	/**
	 * API拦截器实例
	 * 使用ApiInterceptor创建axios实例，包含统一的请求拦截和错误处理
	 *
	 * @type {AxiosInstance}
	 */
	static api = ApiInterceptor.createInstance()

	/**
	 * 修改密码
	 * 用户修改账户密码
	 *
	 * @param {string} token - 用户认证token
	 * @param {Object} data - 密码修改数据
	 * @param {string} data.oldPassword - 原密码
	 * @param {string} data.newPassword - 新密码
	 * @returns {Promise<Object>} 修改结果数据
	 * @throws {Error} 修改失败时抛出错误
	 * @description
	 * - Token无效时抛出'Token无效，请重新登录'
	 * - 原密码错误时抛出'原密码错误或参数验证失败'
	 * - 服务器错误时抛出'服务器错误，请稍后重试'
	 * - 其他错误抛出服务器返回的消息或'修改密码失败'
	 */
	static async changePassword(token, data) {
		try {
			const response = await this.api.post('/api/v1/students/change-password', data, {
				params: { token }
			})
			return response.data
		} catch (error) {
			if (error.response) {
				const { status } = error.response
				if (status === 401) {
					throw new Error('Token无效，请重新登录')
				} else if (status === 400) {
					throw new Error('原密码错误或参数验证失败')
				} else if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					throw new Error(error.response.data?.message || '修改密码失败')
				}
			} else {
				throw new Error('网络错误，修改密码失败')
			}
		}
	}
}

export default ChangePasswordApi
