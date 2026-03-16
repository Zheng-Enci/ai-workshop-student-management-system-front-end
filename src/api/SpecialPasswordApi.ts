/**
 * 特殊密码API接口模块
 * 提供需要特殊密码认证的API调用方法
 *
 * @module api/SpecialPasswordApi
 * @description 封装特殊密码相关的API接口，包括学生综合信息查询等
 */

import ApiInterceptor from '../composables/ApiInterceptor.js'

/**
 * API响应类型
 */
export interface ApiResponse<T> {
	data: T
}

/**
 * Axios请求配置类型
 */
interface AxiosRequestConfig {
	params: {
		'special-password': string
		start?: number
		end?: number
	}
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
 * 特殊密码API类
 * 提供需要特殊密码认证的API调用方法
 *
 * @class SpecialPasswordApi
 * @description 使用ApiInterceptor创建的axios实例进行HTTP请求
 */
class SpecialPasswordApi {
	/**
	 * axios实例
	 * 使用ApiInterceptor创建的带拦截器的axios实例
	 *
	 * @static
	 */
	static api = ApiInterceptor.createInstance()

	/**
	 * 验证特殊密码
	 * 验证提供的特殊密码是否正确，用于超级管理员身份验证
	 *
	 * @static
	 * @param {string} specialPassword - 特殊密码（请联系系统管理员获取）
	 * @returns {Promise<ApiResponse<boolean>>} 响应数据对象，data字段为验证结果(true/false)
	 * @throws {Error} 网络错误或服务器错误时抛出异常
	 * @example
	 * // 验证特殊密码
	 * const result = await SpecialPasswordApi.validateSpecialPassword('password123')
	 * console.log(result.data) // true表示密码正确，null表示密码错误
	 */
	static async validateSpecialPassword(specialPassword: string): Promise<ApiResponse<boolean | null>> {
		const response = await this.api.get('/api/v1/super-admin/validate-special-password', {
			params: {
				'special-password': specialPassword
			}
		}).catch((error: AxiosError) => {
			const msg = error.response?.data?.message
			throw new Error(error.response?.status !== undefined && error.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		})
		return response.data
	}

	/**
	 * 获取学生综合信息
	 * 通过特殊密码获取指定ID范围内学生的综合信息，包括考勤次数、个人信息、总积分、等级和管理员信息
	 *
	 * @static
	 * @param {string} specialPassword - 特殊密码（请联系系统管理员获取）
	 * @param {number} start - 起始学生数据库表主键ID（包含）
	 * @param {number} end - 结束学生数据库表主键ID（包含）
	 * @returns {Promise<ApiResponse<any[]>>} 响应数据对象，data字段为学生综合信息数组
	 * @throws {Error} 网络错误或服务器错误时抛出异常
	 * @example
	 * // 获取ID 1-100 的学生综合信息
	 * const result = await SpecialPasswordApi.getStudentComprehensiveInfo('password123', 1, 100)
	 * console.log(result.data) // 学生综合信息列表
	 */
	static async getStudentComprehensiveInfo(specialPassword: string, start: number, end: number): Promise<ApiResponse<any[]>> {
		const response = await this.api.get('/api/v1/super-admin/student-comprehensive-info', {
			params: {
				'special-password': specialPassword,
				start,
				end
			}
		}).catch((error: AxiosError) => {
			const msg = error.response?.data?.message
			throw new Error(error.response?.status !== undefined && error.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		})
		return response.data
	}
}

/**
 * 导出特殊密码API类
 * @exports SpecialPasswordApi
 */
export default SpecialPasswordApi
