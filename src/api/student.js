/**
 * 学生相关API接口模块
 * 提供学生登录、注册、个人信息管理、数据统计等功能的API调用
 *
 * @module api/student
 * @description 封装所有学生相关的HTTP请求，包括错误处理和响应拦截
 */

import axios from 'axios'

import config from '@/config'

/**
 * 创建axios实例
 * 配置基础URL、超时时间和请求头
 *
 * @type {AxiosInstance}
 */
const api = axios.create({
	baseURL: config.API_BASE_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json'
	}
})

/**
 * 响应拦截器
 * 统一处理网络错误和超时错误，提供友好的错误提示
 */
api.interceptors.response.use(
	response => response,
	error => {
		// 处理请求超时错误
		if (error.code === 'ECONNABORTED') {
			throw new Error('请求超时，请检查网络连接')
		} else if (error.code === 'ERR_NETWORK') {
			// 处理网络连接失败错误
			throw new Error('网络连接失败，请检查服务器状态')
		} else if (error.code === 'ERR_INTERNET_DISCONNECTED') {
			// 处理网络断开错误
			throw new Error('网络连接已断开，请检查网络设置')
		}
		return Promise.reject(error)
	}
)

/**
 * 学生登录接口
 * 使用学号和密码进行登录认证
 *
 * @param data - 登录数据对象
 * @param data.studentId - 学号
 * @param data.password - 密码
 * @returns 登录结果数据，包含token和用户信息
 * @throws {Error} 登录失败时抛出错误
 */
export const login = async data => {
	try {
		const response = await api.post('/api/v1/students/login', data)
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			// 处理401错误：学号或密码错误
			if (status === 401) {
				throw new Error('学号或密码错误')
			} else if (status === 403) {
				// 处理403错误：账户已被禁用
				throw new Error('账户已被禁用')
			} else if (status >= 500) {
				// 处理服务器错误
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '登录失败')
			}
		} else {
			throw new Error('网络错误，登录失败')
		}
	}
}

/**
 * 学生注册接口
 * 创建新的学生账户
 *
 * @param data - 注册数据对象
 * @param data.studentId - 学号
 * @param data.password - 密码
 * @param data.name - 姓名
 * @param [data.gender] - 性别
 * @param [data.phoneNumber] - 手机号
 * @param [data.college] - 学院
 * @param [data.major] - 专业
 * @param [data.grade] - 年级
 * @param [data.classNum] - 班级
 * @returns 注册结果数据
 * @throws {Error} 注册失败时抛出错误（400/409为业务错误，500+为服务器错误）
 */
export const register = async data => {
	try {
		const response = await api.post('/api/v1/students', data)
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			// 处理400/409错误：参数验证失败或学号已存在
			if (status === 400 || status === 409) {
				throw new Error(error.response.data?.message || '注册失败')
			} else if (status >= 500) {
				// 处理服务器错误
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '注册失败')
			}
		} else {
			throw new Error('网络错误，注册失败')
		}
	}
}

/**
 * Token验证接口
 * 验证用户登录token是否有效
 *
 * @param token - 用户认证token
 * @returns token是否有效，true表示有效，false表示无效
 * @throws {Error} 网络错误或服务器错误时抛出异常
 */
export const validateToken = async token => {
	try {
		const response = await api.post('/api/v1/students/validation-token', null, {
			params: { token },
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})
		// 返回验证结果，如果data字段存在则返回其值，否则返回false
		return response.data.data || false
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			// 403和401都表示token无效，返回false
			if (status === 403) {
				return false
			}
			if (status === 401) {
				return false
			}
			// 服务器错误，抛出异常
			if (status >= 500) {
				throw new Error('服务器错误，请稍后重试')
			}
			// 其他错误也返回false
			return false
		}
		// 网络错误，抛出异常
		throw new Error('网络错误，Token验证失败')
	}
}

/**
 * 获取学生个人信息接口
 * 根据token获取当前登录学生的个人信息
 *
 * @param token - 用户认证token
 * @returns 学生个人信息数据
 * @throws {Error} 获取失败时抛出错误
 */
export const getStudentProfile = async token => {
	try {
		const response = await api.get('/api/v1/students/profile', {
			params: { token }
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			// 处理401错误：Token无效
			if (status === 401) {
				throw new Error('Token无效，请重新登录')
			} else if (status >= 500) {
				// 处理服务器错误
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '获取个人信息失败')
			}
		} else {
			throw new Error('网络错误，获取个人信息失败')
		}
	}
}

/**
 * 更新学生个人信息接口
 * 更新当前登录学生的个人信息
 *
 * @param token - 用户认证token
 * @param data - 要更新的学生信息数据
 * @param [data.name] - 姓名
 * @param [data.gender] - 性别
 * @param [data.phoneNumber] - 手机号
 * @param [data.college] - 学院
 * @param [data.major] - 专业
 * @param [data.grade] - 年级
 * @param [data.classNum] - 班级
 * @returns 更新结果数据
 * @throws {Error} 更新失败时抛出错误
 */
export const updateStudentInfo = async (token, data) => {
	try {
		const response = await api.put('/api/v1/students/update-info', data, {
			params: { token }
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			// 处理401错误：Token无效
			if (status === 401) {
				throw new Error('Token无效，请重新登录')
			} else if (status === 400) {
				// 处理400错误：参数验证失败
				throw new Error('参数验证失败，请检查输入信息')
			} else if (status >= 500) {
				// 处理服务器错误
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '更新个人信息失败')
			}
		} else {
			throw new Error('网络错误，更新个人信息失败')
		}
	}
}

/**
 * 修改密码接口
 * 修改当前登录学生的账户密码
 *
 * @param token - 用户认证token
 * @param data - 密码修改数据
 * @param data.oldPassword - 原密码
 * @param data.newPassword - 新密码
 * @returns 修改结果数据
 * @throws {Error} 修改失败时抛出错误
 */
export const changePassword = async (token, data) => {
	try {
		const response = await api.post('/api/v1/students/change-password', data, {
			params: { token }
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			// 处理401错误：Token无效
			if (status === 401) {
				throw new Error('Token无效，请重新登录')
			} else if (status === 400) {
				// 处理400错误：原密码错误或参数验证失败
				throw new Error('原密码错误或参数验证失败')
			} else if (status >= 500) {
				// 处理服务器错误
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '修改密码失败')
			}
		} else {
			throw new Error('网络错误，修改密码失败')
		}
	}
}

/**
 * 获取年级统计接口
 * 获取各年级学生数量统计信息
 *
 * @returns 年级统计数据
 * @throws {Error} 获取失败时抛出错误
 */
export const getGradeStatistics = async () => {
	try {
		const response = await api.get('/api/v1/students/grade-statistics')
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
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

/**
 * 获取专业统计接口
 * 获取各专业学生数量统计信息
 *
 * @returns 专业统计数据
 * @throws {Error} 获取失败时抛出错误
 */
export const getMajorStatistics = async () => {
	try {
		const response = await api.get('/api/v1/students/major-statistics')
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
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

/**
 * 获取学生总数接口
 * 获取系统中所有学生的总数量
 *
 * @returns 学生总数数据
 * @throws {Error} 获取失败时抛出错误
 */
export const getTotalStudentCount = async () => {
	try {
		const response = await api.get('/api/v1/students/total-count')
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
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

/**
 * 根据等级代码获取学生数量接口
 * 获取指定等级的学生数量统计
 *
 * @param levelCode - 等级代码（0-3）
 * @returns 该等级的学生数量数据
 * @throws {Error} 获取失败时抛出错误
 */
export const getStudentCountByLevel = async levelCode => {
	try {
		const response = await api.get('/api/v1/students/student-count-by-level-code', {
			params: {
				'level-code': levelCode
			}
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
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

/**
 * 根据学号获取学生等级接口
 * 通过学号（studentId）获取学生的等级信息
 *
 * @param studentId - 学号
 * @returns 学生等级数据，data字段为等级代码(0-3)
 * @throws {Error} 获取失败时抛出错误
 */
export const getStudentLevel = async studentId => {
	try {
		const response = await api.get('/api/v1/students/get-student-level', {
			params: { 'student-id': studentId }
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
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

/**
 * 根据学生信息ID获取学生等级接口
 * 通过学生信息ID（studentInfoId）获取学生的等级信息
 *
 * @param studentInfoId - 学生信息ID（数据库主键）
 * @returns 学生等级数据，data字段为等级代码(0-3)
 * @throws {Error} 获取失败时抛出错误
 */
export const getStudentLevelByInfoId = async studentInfoId => {
	try {
		const response = await api.get('/api/v1/students/get-student-level-by-info-id', {
			params: { 'student-info-id': studentInfoId }
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
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

/**
 * 通过token获取学生数据库表主键ID接口
 * 根据用户登录token获取学生的数据库表主键ID
 *
 * @param token - 用户认证token
 * @returns 响应数据，data字段为学生数据库表主键ID
 * @throws {Error} 获取失败时抛出错误
 */
export const getStudentDatabaseTableId = async token => {
	try {
		const response = await api.get('/api/v1/students/get-student-database-table-id', {
			params: { token }
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			// 处理401错误：Token无效
			if (status === 401) {
				throw new Error('Token无效，请重新登录')
			} else if (status >= 500) {
				// 处理服务器错误
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '获取学生ID失败')
			}
		} else {
			throw new Error('网络错误，获取学生ID失败')
		}
	}
}

/**
 * 根据学生信息ID获取学生姓名接口
 * 通过学生信息ID获取学生的姓名
 *
 * @param studentInfoId - 学生信息ID（数据库主键）
 * @returns 响应数据，data字段为学生姓名
 * @throws {Error} 获取失败时抛出错误
 */
export const getStudentNameByInfoId = async studentInfoId => {
	try {
		const response = await api.get('/api/v1/students/get-student-name-by-info-id', {
			params: { 'student-info-id': studentInfoId }
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
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

/**
 * 根据学生信息ID获取学生公开字段值接口
 * 获取指定学生的某个公开字段的值（如姓名、头像等）
 *
 * @param studentInfoId - 学生信息ID（数据库主键）
 * @param fieldName - 字段名称（如'name'、'avatar'等）
 * @returns 响应数据，data字段为字段值
 * @throws {Error} 获取失败时抛出错误
 */
export const getStudentPublicFieldValueById = async (studentInfoId, fieldName) => {
	try {
		const response = await api.get('/api/v1/students/public-field-value-by-id', {
			params: {
				'student-info-id': studentInfoId,
				'field-name': fieldName
			}
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
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
 * 使用特殊密码获取所有学生信息接口
 * 管理员使用特殊密码获取系统中所有学生的信息列表
 *
 * @param specialPassword - 特殊密码（管理员密码）
 * @returns 所有学生信息数据
 * @throws {Error} 获取失败时抛出错误（400为特殊密码错误）
 */
export const getAllStudentsWithSpecialPassword = async specialPassword => {
	try {
		const response = await api.get('/api/v1/students/all-with-special-password', {
			params: { 'special-password': specialPassword }
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			// 处理400错误：特殊密码错误
			if (status === 400) {
				throw new Error('特殊密码错误')
			} else if (status >= 500) {
				// 处理服务器错误
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
 * 设置学生等级接口
 * 管理员使用特殊密码为学生设置等级
 *
 * @param specialPassword - 特殊密码（管理员密码）
 * @param studentId - 学号
 * @param levelCode - 等级代码（0-3）
 * @returns 设置结果数据
 * @throws {Error} 设置失败时抛出错误
 */
export const setStudentLevel = async (specialPassword, studentId, levelCode) => {
	try {
		const response = await api.post('/api/v1/students/set-level', {
			studentId,
			levelCode
		}, {
			params: { 'special-password': specialPassword }
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			// 处理400错误：参数验证失败或特殊密码错误
			if (status === 400) {
				throw new Error(error.response.data?.message || '设置学生等级失败')
			} else if (status >= 500) {
				// 处理服务器错误
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '设置学生等级失败')
			}
		} else {
			throw new Error('网络错误，设置学生等级失败')
		}
	}
}

/**
 * 使用特殊密码更新学生信息接口
 * 管理员使用特殊密码更新指定学生的信息
 *
 * @param specialPassword - 特殊密码（管理员密码）
 * @param studentId - 学号
 * @param studentData - 要更新的学生信息数据
 * @param [studentData.name] - 姓名
 * @param [studentData.gender] - 性别
 * @param [studentData.phoneNumber] - 手机号
 * @param [studentData.college] - 学院
 * @param [studentData.major] - 专业
 * @param [studentData.grade] - 年级
 * @param [studentData.classNum] - 班级
 * @param [studentData.password] - 密码
 * @returns 更新结果数据
 * @throws {Error} 更新失败时抛出错误
 */
export const updateStudentWithSpecialPassword = async (specialPassword, studentId, studentData) => {
	try {
		const response = await api.put('/api/v1/students/update-with-special-password', studentData, {
			params: {
				'special-password': specialPassword,
				'student-id': studentId
			}
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			// 处理400错误：参数验证失败或特殊密码错误
			if (status === 400) {
				throw new Error(error.response.data?.message || '更新学生信息失败')
			} else if (status >= 500) {
				// 处理服务器错误
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '更新学生信息失败')
			}
		} else {
			throw new Error('网络错误，更新学生信息失败')
		}
	}
}

/**
 * 分配学生给管理员接口
 * 将指定学生分配给指定的管理员进行管理
 *
 * @param specialPassword - 特殊密码（管理员密码）
 * @param studentId - 被管理学生的学号
 * @param adminStudentId - 管理员的学号
 * @returns 分配结果数据
 * @throws {Error} 分配失败时抛出错误
 */
export const assignStudentToAdmin = async (specialPassword, studentId, adminStudentId) => {
	try {
		const response = await api.post('/api/v1/students/assign-student-to-admin', {
			studentId,
			adminStudentId
		}, {
			params: { 'special-password': specialPassword }
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			// 处理400错误：参数验证失败或特殊密码错误
			if (status === 400) {
				throw new Error(error.response.data?.message || '分配管理员失败')
			} else if (status >= 500) {
				// 处理服务器错误
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '分配管理员失败')
			}
		} else {
			throw new Error('网络错误，分配管理员失败')
		}
	}
}

/**
 * 获取管理员信息接口
 * 获取管理指定学生的管理员信息
 *
 * @param managedStudentId - 被管理学生的学号
 * @returns 管理员信息数据
 * @throws {Error} 获取失败时抛出错误
 */
export const getAdminInfo = async managedStudentId => {
	try {
		const response = await api.get('/api/v1/students/admin-info', {
			params: { 'managed-student-id': managedStudentId }
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			// 处理400错误：参数验证失败
			if (status === 400) {
				throw new Error(error.response.data?.message || '获取管理员信息失败')
			} else if (status >= 500) {
				// 处理服务器错误
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '获取管理员信息失败')
			}
		} else {
			throw new Error('网络错误，获取管理员信息失败')
		}
	}
}

/**
 * 获取管理员管理的学生列表接口
 * 获取指定管理员管理的所有学生信息列表
 *
 * @param adminStudentId - 管理员的学号
 * @returns 被管理学生信息列表数据
 * @throws {Error} 获取失败时抛出错误
 */
export const getManagedStudents = async adminStudentId => {
	try {
		const response = await api.get('/api/v1/students/managed-students', {
			params: { 'admin-student-id': adminStudentId }
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			// 处理400错误：参数验证失败
			if (status === 400) {
				throw new Error(error.response.data?.message || '获取管理学生信息失败')
			} else if (status >= 500) {
				// 处理服务器错误
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
 * 上传学生头像接口
 * 上传学生的头像图片文件
 *
 * @param token - 用户认证token
 * @param file - 头像文件对象（支持图片格式，最大2MB）
 * @returns 上传结果数据，包含头像URL
 * @throws {Error} 上传失败时抛出错误（401为Token无效，413为文件过大，400为参数错误）
 */
export const uploadAvatar = async (token, file) => {
	try {
		// 创建FormData对象，用于上传文件
		const formData = new FormData()
		formData.append('file', file)

		// 根据接口文档：token作为Query参数，file在FormData中
		// 使用较长的超时时间（60秒），因为文件上传可能需要较长时间
		const response = await api.post('/api/v1/students/avatar', formData, {
			params: { token },
			headers: {
				// 删除默认的Content-Type，让axios自动处理FormData的Content-Type
				// 这样浏览器会自动添加multipart/form-data边界
				'Content-Type': false
			},
			timeout: 60000
		})

		return response.data
	} catch (error) {
		// 记录详细的错误信息，便于调试
		console.error('上传头像API错误:', error)
		console.error('错误详情:', {
			response: error.response,
			responseStatus: error.response?.status,
			responseData: error.response?.data,
			request: error.request,
			message: error.message,
			code: error.code
		})

		// 处理各种异常情况
		if (error.response) {
			// 服务器返回了响应，根据状态码和响应数据生成错误消息
			const { status } = error.response
			const { data } = error.response

			let errorMessage = '头像上传失败'
			// 尝试从响应数据中提取错误消息
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
			} else if (status === 400) {
				// 400错误：请求参数错误
				errorMessage = '请求参数错误，请检查文件格式和大小（最大2MB）'
			} else if (status === 401) {
				// 401错误：Token无效
				errorMessage = 'Token无效，请重新登录'
			} else if (status === 413) {
				// 413错误：文件太大
				errorMessage = '文件太大，请选择小于2MB的图片'
			} else if (status >= 500) {
				// 5xx错误：服务器错误
				errorMessage = '服务器错误，请稍后重试'
			} else {
				errorMessage = `服务器错误 (${status})`
			}

			throw new Error(errorMessage)
		} else if (error.request) {
			// 请求已发出但没有收到响应（网络问题）
			throw new Error('网络错误，无法连接到服务器')
		} else {
			// 请求配置错误
			throw new Error(`网络错误，头像上传失败：${error.message}`)
		}
	}
}

/**
 * 获取头像URL（辅助函数）
 * 根据学生ID和头像尺寸生成头像URL地址
 * 这是一个静态辅助方法，不发起网络请求，仅生成URL
 *
 * @param studentInfoId - 学生数据库表主键ID
 * @param [avatarSize] - 头像尺寸（像素），默认64
 * @returns 头像URL地址，如果studentInfoId无效则返回null
 */
export const getAvatarUrl = (studentInfoId, avatarSize = 64) => {
	// 验证学生ID是否有效
	if (!studentInfoId) {
		return null
	}
	// 拼接头像URL，包含学生ID和尺寸参数
	return `${config.API_BASE_URL}/api/v1/students/avatar/${studentInfoId}?avatarSize=${avatarSize}`
}

