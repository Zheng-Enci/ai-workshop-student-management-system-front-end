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

	static setupInterceptors() {
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

	static async login(data) {
		try {
			const response = await this.api.post('/api/v1/students/login', data)
			return response.data
		} catch (error) {
			if (error.response) {
				const status = error.response.status
				if (status === 401) {
					throw new Error('学号或密码错误')
				} else if (status === 403) {
					throw new Error('账户已被禁用')
				} else if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					throw new Error(error.response.data?.message || '登录失败')
				}
			} else {
				throw new Error('网络错误，登录失败')
			}
		}
	}

	static async register(data) {
		try {
			const response = await this.api.post('/api/v1/students', data)
			return response.data
		} catch (error) {
			if (error.response) {
				const status = error.response.status
				if (status === 400 || status === 409) {
					throw new Error(error.response.data?.message || '注册失败')
				} else if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					throw new Error(error.response.data?.message || '注册失败')
				}
			} else {
				throw new Error('网络错误，注册失败')
			}
		}
	}

	static async validateToken(token) {
		try {
			const response = await this.api.post('/api/v1/students/validation-token', null, {
				params: {token},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			})
			return response.data.data || false
		} catch (error) {
			if (error.response) {
				const status = error.response.status
				if (status === 403) {
					return false
				} else if (status === 401) {
					return false
				} else if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					return false
				}
			} else {
				throw new Error('网络错误，Token验证失败')
			}
		}
	}

	static async getStudentProfile(token) {
		try {
			const response = await this.api.get('/api/v1/students/profile', {
				params: {token}
			})
			return response.data
		} catch (error) {
			if (error.response) {
				const status = error.response.status
				if (status === 401) {
					throw new Error('Token无效，请重新登录')
				} else if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					throw new Error(error.response.data?.message || '获取个人信息失败')
				}
			} else {
				throw new Error('网络错误，获取个人信息失败')
			}
		}
	}

	static async updateStudentInfo(token, data) {
		try {
			const response = await this.api.put('/api/v1/students/update-info', data, {
				params: {token}
			})
			return response.data
		} catch (error) {
			if (error.response) {
				const status = error.response.status
				if (status === 401) {
					throw new Error('Token无效，请重新登录')
				} else if (status === 400) {
					throw new Error('参数验证失败，请检查输入信息')
				} else if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					throw new Error(error.response.data?.message || '更新个人信息失败')
				}
			} else {
				throw new Error('网络错误，更新个人信息失败')
			}
		}
	}

	static async changePassword(token, data) {
		try {
			const response = await this.api.post('/api/v1/students/change-password', data, {
				params: {token}
			})
			return response.data
		} catch (error) {
			if (error.response) {
				const status = error.response.status
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

	static async getGradeStatistics() {
		try {
			const response = await this.api.get('/api/v1/students/grade-statistics')
			return response.data
		} catch (error) {
			if (error.response) {
				const status = error.response.status
				if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					throw new Error(error.response.data?.message || '获取年级统计失败')
				}
			} else {
				throw new Error('网络错误，获取年级统计失败')
			}
		}
	}

	static async getMajorStatistics() {
		try {
			const response = await this.api.get('/api/v1/students/major-statistics')
			return response.data
		} catch (error) {
			if (error.response) {
				const status = error.response.status
				if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					throw new Error(error.response.data?.message || '获取专业统计失败')
				}
			} else {
				throw new Error('网络错误，获取专业统计失败')
			}
		}
	}

	static async getTotalStudentCount() {
		try {
			const response = await this.api.get('/api/v1/students/total-count')
			return response.data
		} catch (error) {
			if (error.response) {
				const status = error.response.status
				if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					throw new Error(error.response.data?.message || '获取学生总数失败')
				}
			} else {
				throw new Error('网络错误，获取学生总数失败')
			}
		}
	}

	static async getStudentCountByLevel(levelCode) {
		try {
			const response = await this.api.get('/api/v1/students/student-count-by-level-code', {
				params: {
					'level-code': levelCode
				}
			})
			return response.data
		} catch (error) {
			if (error.response) {
				const status = error.response.status
				if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					throw new Error(error.response.data?.message || '获取等级学生数量失败')
				}
			} else {
				throw new Error('网络错误，获取等级学生数量失败')
			}
		}
	}

	static async getStudentLevel(studentId) {
		try {
			const response = await this.api.get('/api/v1/students/get-student-level', {
				params: {'student-id': studentId}
			})
			return response.data
		} catch (error) {
			if (error.response) {
				const status = error.response.status
				if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					throw new Error(error.response.data?.message || '获取学生等级失败')
				}
			} else {
				throw new Error('网络错误，获取学生等级失败')
			}
		}
	}

	static async getStudentLevelByInfoId(studentInfoId) {
		try {
			const response = await this.api.get('/api/v1/students/get-student-level-by-info-id', {
				params: {'student-info-id': studentInfoId}
			})
			return response.data
		} catch (error) {
			if (error.response) {
				const status = error.response.status
				if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					throw new Error(error.response.data?.message || '获取学生等级失败')
				}
			} else {
				throw new Error('网络错误，获取学生等级失败')
			}
		}
	}

	static async getStudentDatabaseTableId(token) {
		try {
			const response = await this.api.get('/api/v1/students/get-student-database-table-id', {
				params: {token}
			})
			return response.data
		} catch (error) {
			if (error.response) {
				const status = error.response.status
				if (status === 401) {
					throw new Error('Token无效，请重新登录')
				} else if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					throw new Error(error.response.data?.message || '获取学生ID失败')
				}
			} else {
				throw new Error('网络错误，获取学生ID失败')
			}
		}
	}

	static async getStudentNameByInfoId(studentInfoId) {
		try {
			const response = await this.api.get('/api/v1/students/get-student-name-by-info-id', {
				params: {'student-info-id': studentInfoId}
			})
			return response.data
		} catch (error) {
			if (error.response) {
				const status = error.response.status
				if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					throw new Error(error.response.data?.message || '获取学生姓名失败')
				}
			} else {
				throw new Error('网络错误，获取学生姓名失败')
			}
		}
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

	static async getAllStudentsWithSpecialPassword(specialPassword) {
		try {
			const response = await this.api.get('/api/v1/students/all-with-special-password', {
				params: {'special-password': specialPassword}
			})
			return response.data
		} catch (error) {
			if (error.response) {
				const status = error.response.status
				if (status === 400) {
					throw new Error('特殊密码错误')
				} else if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					throw new Error(error.response.data?.message || '获取学生信息失败')
				}
			} else {
				throw new Error('网络错误，获取学生信息失败')
			}
		}
	}

	static async setStudentLevel(specialPassword, studentId, levelCode) {
		try {
			const response = await this.api.post('/api/v1/students/set-level', {
				studentId: studentId,
				levelCode: levelCode
			}, {
				params: {'special-password': specialPassword}
			})
			return response.data
		} catch (error) {
			if (error.response) {
				const status = error.response.status
				if (status === 400) {
					throw new Error(error.response.data?.message || '设置学生等级失败')
				} else if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					throw new Error(error.response.data?.message || '设置学生等级失败')
				}
			} else {
				throw new Error('网络错误，设置学生等级失败')
			}
		}
	}

	static async updateStudentWithSpecialPassword(specialPassword, studentId, studentData) {
		try {
			const response = await this.api.put('/api/v1/students/update-with-special-password', studentData, {
				params: {
					'special-password': specialPassword,
					'student-id': studentId
				}
			})
			return response.data
		} catch (error) {
			if (error.response) {
				const status = error.response.status
				if (status === 400) {
					throw new Error(error.response.data?.message || '更新学生信息失败')
				} else if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					throw new Error(error.response.data?.message || '更新学生信息失败')
				}
			} else {
				throw new Error('网络错误，更新学生信息失败')
			}
		}
	}

	static async assignStudentToAdmin(specialPassword, studentId, adminStudentId) {
		try {
			const response = await this.api.post('/api/v1/students/assign-student-to-admin', {
				studentId: studentId,
				adminStudentId: adminStudentId
			}, {
				params: {'special-password': specialPassword}
			})
			return response.data
		} catch (error) {
			if (error.response) {
				const status = error.response.status
				if (status === 400) {
					throw new Error(error.response.data?.message || '分配管理员失败')
				} else if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					throw new Error(error.response.data?.message || '分配管理员失败')
				}
			} else {
				throw new Error('网络错误，分配管理员失败')
			}
		}
	}

	static async getAdminInfo(managedStudentId) {
		try {
			const response = await this.api.get('/api/v1/students/admin-info', {
				params: {'managed-student-id': managedStudentId}
			})
			return response.data
		} catch (error) {
			if (error.response) {
				const status = error.response.status
				if (status === 400) {
					throw new Error(error.response.data?.message || '获取管理员信息失败')
				} else if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					throw new Error(error.response.data?.message || '获取管理员信息失败')
				}
			} else {
				throw new Error('网络错误，获取管理员信息失败')
			}
		}
	}

	static async getManagedStudents(adminStudentId) {
		try {
			const response = await this.api.get('/api/v1/students/managed-students', {
				params: {'admin-student-id': adminStudentId}
			})
			return response.data
		} catch (error) {
			if (error.response) {
				const status = error.response.status
				if (status === 400) {
					throw new Error(error.response.data?.message || '获取管理学生信息失败')
				} else if (status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					throw new Error(error.response.data?.message || '获取管理学生信息失败')
				}
			} else {
				throw new Error('网络错误，获取管理学生信息失败')
			}
		}
	}

	/**
	 * 上传学生头像
	 * @param {String} token - JWT token
	 * @param {File} file - 头像文件
	 * @returns {Promise} Promise对象
	 */
	static async uploadAvatar(token, file) {
		try {
			const formData = new FormData()
			formData.append('file', file)

			// 根据接口文档：token 作为 Query 参数，file 在 FormData 中
			// 这是之前能成功工作的版本
			const response = await this.api.post('/api/v1/students/avatar', formData, {
				params: {token},
				headers: {
					// 删除默认的 Content-Type，让 axios 自动处理 FormData
					'Content-Type': false
				},
				timeout: 60000
			})

			console.log('上传成功，服务器响应:', response.data)
			return response.data
		} catch (error) {
			console.error('上传头像API错误:', error)
			console.error('错误详情:', {
				response: error.response,
				responseStatus: error.response?.status,
				responseData: error.response?.data,
				request: error.request,
				message: error.message,
				code: error.code
			})

			// 处理异常（如token无效、文件为空等）
			if (error.response) {
				// 服务器返回了响应
				const status = error.response.status
				const data = error.response.data

				let errorMessage = '头像上传失败'
				if (data) {
					if (typeof data === 'string') {
						errorMessage = data
					} else if (data.message) {
						errorMessage = data.message
					} else if (data.msg) {
						errorMessage = data.msg
					} else if (data.error) {
						errorMessage = data.error
					} else {
						errorMessage = JSON.stringify(data) || `服务器错误 (${status})`
					}
				} else {
					// 响应体为空，根据状态码给出提示
					if (status === 400) {
						errorMessage = '请求参数错误，请检查文件格式和大小（最大2MB）'
					} else if (status === 401) {
						errorMessage = 'Token无效，请重新登录'
					} else if (status === 413) {
						errorMessage = '文件太大，请选择小于2MB的图片'
					} else if (status >= 500) {
						errorMessage = '服务器错误，请稍后重试'
					} else {
						errorMessage = `服务器错误 (${status})`
					}
				}

				throw new Error(errorMessage)
			} else if (error.request) {
				// 请求已发出但没有收到响应
				throw new Error('网络错误，无法连接到服务器')
			} else {
				// 请求配置错误
				throw new Error('网络错误，头像上传失败：' + error.message)
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
