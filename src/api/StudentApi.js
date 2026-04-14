/**
 * 学生API接口模块
 * 提供学生相关的API调用方法
 *
 * @module api/StudentApi
 * @description 封装学生信息查询、头像获取、等级查询等API接口
 */

import ApiInterceptor from '@/composables/ApiInterceptor'
import config from '@/config'

/**
 * 学生API类
 * 提供学生相关的API调用方法
 */
class StudentApi {
	/**
	 * API拦截器实例
	 * 使用ApiInterceptor创建axios实例，包含统一的请求拦截和错误处理
	 *
	 * @type {AxiosInstance}
	 */
	static api = ApiInterceptor.createInstance()

	/**
	 * 根据学生ID获取学生公开字段值
	 * 获取指定学生的某个公开字段的值（如姓名、头像等）
	 *
	 * @param {string|number} studentInfoId - 学生信息ID
	 * @param {string} fieldName - 字段名称（如'name'、'avatar'等）
	 * @returns {Promise<Object>} 响应数据对象
	 * @throws {Error} 如果请求失败，抛出错误
	 */
	static async getStudentPublicFieldValueById(studentInfoId, fieldName) {
		try {
			const response = await this.api.get('/api/v1/students/public-field-value-by-id', {
				params: {
					'student-info-id': studentInfoId,
					'field-name': fieldName
				}
			})
			return response.data
		} catch (error) {
			// 处理HTTP响应错误
			if (error.response) {
				const { status } = error.response
				// 服务器错误（5xx）
				if (status >= 500) {
					throw new Error('服务器错误，请稍后重试或联系管理员')
				} else {
					// 其他HTTP错误，使用服务器返回的错误消息
					throw new Error(error.response.data.message)
				}
			} else {
				// 网络错误或其他错误
				throw new Error('网络错误，获取学生信息失败, 请检查网络连接')
			}
		}
	}

	/**
	 * 获取头像URL（根据数据库主键ID）
	 * 根据学生数据库表主键ID和头像尺寸生成头像URL地址
	 * 这是一个静态辅助方法，不发起网络请求，仅生成URL
	 *
	 * @param {string|number} studentInfoId - 学生数据库表主键ID
	 * @param {number} [avatarSize=64] - 头像尺寸，默认64像素
	 * @returns {string|null} 头像URL地址，如果studentInfoId无效则返回null
	 */
	static getAvatarUrl(studentInfoId, avatarSize = 64) {
		// 验证学生ID是否有效
		if (!studentInfoId) {
			return null
		}
		// 拼接头像URL，包含学生ID和尺寸参数
		return `${config.API_BASE_URL}/api/v1/students/avatar/${studentInfoId}?avatarSize=${avatarSize}`
	}

	/**
	 * 获取头像URL（根据学号）
	 * 根据学号和头像尺寸生成头像URL地址
	 * 这是一个静态辅助方法，不发起网络请求，仅生成URL
	 *
	 * @param {string|number} studentId - 学生学号
	 * @param {number} [avatarSize=64] - 头像尺寸，默认64像素
	 * @returns {string|null} 头像URL地址，如果studentId无效则返回null
	 */
	static getAvatarUrlByStudentId(studentId, avatarSize = 64) {
		// 验证学号是否有效
		if (!studentId) {
			return null
		}
		// 拼接头像URL，包含学号和尺寸参数
		return `${config.API_BASE_URL}/api/v1/students/avatar/by-student-id/${studentId}?avatarSize=${avatarSize}`
	}

	/**
	 * 通过数据库表主键ID获取学生等级
	 * 获取指定学生的等级信息（等级代码：0-3）
	 *
	 * @param {string|number} studentInfoId - 学生数据库表主键ID
	 * @returns {Promise<Object>} 响应数据对象，data字段为等级代码(0-3)
	 * @throws {Error} 如果请求失败，抛出错误
	 */
	static async getStudentLevelByInfoId(studentInfoId) {
		try {
			const response = await this.api.get('/api/v1/students/get-student-level-by-info-id', {
				params: { 'student-info-id': studentInfoId }
			})
			return response.data
		} catch (error) {
			// 处理HTTP响应错误
			if (error.response) {
				const { status } = error.response
				// 服务器错误（5xx）
				if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					// 其他HTTP错误
					throw new Error(error.response.data.message)
				}
			} else {
				// 网络错误
				throw new Error('网络错误，获取学生等级失败，请检查网络连接')
			}
		}
	}

	/**
	 * 通过token获取学生数据库表主键ID
	 * 根据用户登录凭证获取学生的数据库表主键ID
	 *
	 * @param {string} token - 用户登录凭证
	 * @returns {Promise<Object>} 响应数据对象，data字段为学生数据库表主键ID
	 * @throws {Error} 如果请求失败，抛出错误
	 */
	static async getStudentDatabaseTableId(token) {
		try {
			const response = await this.api.get('/api/v1/students/get-student-database-table-id', {
				params: { token }
			})
			return response.data
		} catch (error) {
			// 处理HTTP响应错误
			if (error.response) {
				const { status } = error.response
				// 服务器错误（5xx）
				if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					// 其他HTTP错误
					throw new Error(error.response.data.message)
				}
			} else {
				// 网络错误
				throw new Error('网络错误，获取学生数据库表主键 ID 失败，请检查网络连接')
			}
		}
	}
	/**
	 * 修改学生等级
	 * 通过学号修改学生等级
	 *
	 * @param {string} studentId - 学生学号
	 * @param {number} newLevel - 新的等级（0-3）
	 * @param {string} specialPassword - 特殊密码（用于认证）
	 * @returns {Promise<Object>} 响应数据对象
	 * @throws {Error} 如果请求失败，抛出错误
	 */
	static async updateStudentLevel(studentId, newLevel, specialPassword) {
		try {
			const response = await this.api.post('/api/v1/students/set-level', {
				'studentId': studentId,
				'levelCode': newLevel
			}, {
				params: {
					'special-password': specialPassword
				}
			})
			return response.data
		} catch (error) {
			if (error.response) {
				const { status } = error.response
				if (status >= 500) {
					throw new Error('服务器错误，请稍后重试或联系管理员')
				} else {
					throw new Error(error.response.data.message)
				}
			} else {
				throw new Error('网络错误，修改学生等级失败，请检查网络连接')
			}
		}
	}

}

export default StudentApi
