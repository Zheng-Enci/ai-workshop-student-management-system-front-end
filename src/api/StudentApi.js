import axios from 'axios'
import config from '@/config'

class StudentAPI {
	static api = axios.create({
		baseURL: config.API_BASE_URL,
		timeout: 10000,
		headers: {
			'Content-Type': 'application/json'
		}
	})

	static setupInterceptors(){
		this.api.interceptors.response.use(
			response => response,
			error => {
				if (error.code === 'ECONNABORTED') {
					throw new Error('请求超时，请检查网络连接')
				} else if (error.code === 'ERR_NETWORK') {
					throw new Error('网络连接失败，请检查服务器状态')
				} else if (error.code === 'ERR_INTERNET_DISCONNECTED') {
					throw new Error('网络连接已断开，请检查网络设置')
				}
				return Promise.reject(error)
			}
		)
	}

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
			if (error.response) {
				const status = error.response.status
				if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					throw new Error(error.response.data?.message || '获取学生信息失败')
				}
			} else {
				throw new Error('网络错误，获取学生信息失败')
			}
		}
	}

	/**
	 * 获取头像URL（辅助函数）
	 * @param {Number} studentInfoId - 学生数据库表主键ID
	 * @param avatarSize - 头像尺寸
	 * @returns {String} 头像 URL
	 */
	static getAvatarUrl(studentInfoId, avatarSize = 64) {
		if (!studentInfoId) return null
		return `${config.API_BASE_URL}/api/v1/students/avatar/${studentInfoId}?avatarSize=${avatarSize}`
	}
}

// 设置拦截器
StudentAPI.setupInterceptors()

export default StudentAPI
