/**
 * 学生API接口模块
 * 提供学生相关的API调用方法
 *
 * @module api/StudentApi
 * @description 封装学生信息查询、头像获取、等级查询、登录注册等API接口
 */

import ApiInterceptor from '@/composables/ts/ApiInterceptor'
import type { AxiosInstance, AxiosError } from 'axios'
import config from '@/config/ts'

/**
 * API响应类型
 */
export interface ApiResponse<T> {
	code: number
	message: string
	data: T
}

/**
 * 登录数据类型
 */
export interface LoginData {
	studentId: string
	password: string
}

/**
 * 登录响应数据类型
 */
export interface LoginResponse {
	token: string
	[name: string]: any
}

/**
 * 注册数据类型
 */
export interface RegisterData {
	studentId: string
	password: string
	name: string
	gender?: string
	phoneNumber?: string
	college?: string
	major?: string
	grade?: number | string
	classNum?: number | string
	invitationCode?: string
}

/**
 * 学生等级响应类型
 */
export interface StudentLevelResponse {
	data: number
}

/**
 * 学生数据库表ID响应类型
 */
export interface StudentDatabaseIdResponse {
	data: number
}

/**
 * 学生公开字段值响应类型
 */
export interface StudentPublicFieldResponse {
	data: string
}

/**
 * 年级统计项类型
 */
export interface GradeStatistic {
	grade: number
	count: number
}

/**
 * 专业统计项类型
 */
export interface MajorStatistic {
	major: string
	count: number
}

/**
 * 年级统计响应类型
 */
export interface GradeStatisticsResponse {
	data: GradeStatistic[]
}

/**
 * 专业统计响应类型
 */
export interface MajorStatisticsResponse {
	data: MajorStatistic[]
}

/**
 * 学生数量响应类型（直接返回数字）
 */
export interface StudentCountResponse {
	data: number
}

/**
 * 学生个人信息数据类型
 * 与StudentStore中的StudentInfo接口对应
 */
export interface StudentProfileData {
	id: number
	studentId: string
	name: string
	gender: string
	phone: string
	college: string
	grade: number
	major: string
	className: string
	avatar?: string
	nickname?: string
}

/**
 * 学生总数响应类型（返回对象格式）
 */
export interface TotalStudentCountResponse {
	data: {
		count: number
	}
}

/**
 * 学生API类
 * 提供学生相关的API调用方法
 *
 * @class StudentApi
 * @description 使用ApiInterceptor创建的axios实例进行HTTP请求
 */
class StudentApi {
	/**
	 * axios实例
	 * 使用ApiInterceptor创建的带拦截器的axios实例
	 *
	 * @static
	 */
	static api: AxiosInstance = ApiInterceptor.createInstance()

	/**
	 * 学生登录接口
	 * 使用学号和密码进行登录认证
	 *
	 * @static
	 * @param {LoginData} data - 登录数据对象
	 * @param {string} data.studentId - 学号
	 * @param {string} data.password - 密码
	 * @returns {Promise<ApiResponse<LoginResponse>>} 登录结果数据，包含token和用户信息
	 * @throws {Error} 登录失败时抛出错误
	 * @example
	 * // 使用学号和密码登录
	 * const result = await StudentApi.login({ studentId: '2021001001', password: '123456' })
	 * console.log(result.data.token) // 输出登录token
	 */
	static async login(data: LoginData): Promise<ApiResponse<LoginResponse>> {
		const response = await this.api.post('/api/v1/students/login', data)
			.catch((error: AxiosError<{ message: string }>) => {
				if (error.response) {
					const { status } = error.response
					if (status === 401) {
						throw new Error('学号或密码错误')
					} else if (status === 403) {
						throw new Error('账户已被禁用')
					} else if (status !== undefined && status >= 500) {
						throw new Error('服务器错误，请稍后重试')
					} else {
						throw new Error(error.response.data?.message || '登录失败')
					}
				} else {
					throw new Error('网络错误，登录失败')
				}
			})
		return response.data
	}

	/**
	 * 学生注册接口
	 * 创建新的学生账户
	 *
	 * @static
	 * @param {RegisterData} data - 注册数据对象
	 * @param {string} data.studentId - 学号
	 * @param {string} data.password - 密码
	 * @param {string} data.name - 姓名
	 * @param {string} [data.gender] - 性别
	 * @param {string} [data.phoneNumber] - 手机号
	 * @param {string} [data.college] - 学院
	 * @param {string} [data.major] - 专业
	 * @param {number|string} [data.grade] - 年级
	 * @param {number|string} [data.classNum] - 班级
	 * @param {string} [data.invitationCode] - 邀请码
	 * @returns {Promise<ApiResponse<any>>} 注册结果数据
	 * @throws {Error} 注册失败时抛出错误
	 * @example
	 * // 注册新学生账户
	 * const result = await StudentApi.register({
	 *   studentId: '2021001001',
	 *   password: '123456',
	 *   name: '张三',
	 *   gender: '男',
	 *   phoneNumber: '13800138000',
	 *   college: '计算机学院',
	 *   major: '软件工程',
	 *   grade: 3,
	 *   classNum: 2,
	 *   invitationCode: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
	 * })
	 */
	static async register(data: RegisterData): Promise<ApiResponse<any>> {
		const response = await this.api.post('/api/v1/students', data)
			.catch((error: AxiosError<{ message: string }>) => {
				if (error.response) {
					const { status } = error.response
					if (status === 400 || status === 409) {
						throw new Error(error.response.data?.message || '注册失败')
					} else if (status !== undefined && status >= 500) {
						throw new Error('服务器错误，请稍后重试')
					} else {
						throw new Error(error.response.data?.message || '注册失败')
					}
				} else {
					throw new Error('网络错误，注册失败')
				}
			})
		return response.data
	}

	/**
	 * 根据学生数据库表主键ID获取学生公开字段值
	 * 获取指定学生的某个公开字段的值（如姓名、性别、学院、年级、专业等）
	 *
	 * @static
	 * @param {string|number} studentInfoId - 学生数据库表主键ID
	 * @param {string} fieldName - 字段名称（支持的字段：name, gender, college, grade, major）
	 * @returns {Promise<ApiResponse<string>>} 响应数据对象，data字段为字段值
	 * @throws {Error} 网络错误或服务器错误时抛出异常
	 * @example
	 * // 获取ID为1的学生姓名
	 * const result = await StudentApi.getStudentPublicFieldValueById(1, 'name')
	 * console.log(result.data) // 输出：张三
	 */
	static async getStudentPublicFieldValueById(
		studentInfoId: string | number,
		fieldName: string
	): Promise<ApiResponse<string>> {
		const response = await this.api.get('/api/v1/students/public-field-value-by-id', {
			params: {
				'student-info-id': studentInfoId,
				'field-name': fieldName
			}
		}).catch((error: AxiosError<{ message: string }>) => {
			const msg = error.response?.data?.message
			throw new Error(error.response?.status !== undefined && error.response.status >= 500 ? '服务器错误，请稍后重试或联系管理员' : msg)
		})
		return response.data
	}

	/**
	 * 获取头像URL（根据数据库主键ID）
	 * 根据学生数据库表主键ID和头像尺寸生成头像URL地址
	 * 这是一个静态辅助方法，不发起网络请求，仅生成URL
	 *
	 * @static
	 * @param {string|number} studentInfoId - 学生数据库表主键ID
	 * @param {number} [avatarSize=64] - 头像尺寸，默认64像素
	 * @returns {string|null} 头像URL地址，如果studentInfoId无效则返回null
	 * @example
	 * // 获取ID为1的学生头像URL
	 * const avatarUrl = StudentApi.getAvatarUrl(1, 128)
	 * console.log(avatarUrl) // 输出：http://<server>:7001/api/v1/students/avatar/1?avatarSize=128
	 */
	static getAvatarUrl(studentInfoId: string | number, avatarSize: number = 64): string | null {
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
	 * @static
	 * @param {string|number} studentId - 学生学号
	 * @param {number} [avatarSize=64] - 头像尺寸，默认64像素
	 * @returns {string|null} 头像URL地址，如果studentId无效则返回null
	 * @example
	 * // 获取学号为2021001001的学生头像URL
	 * const avatarUrl = StudentApi.getAvatarUrlByStudentId('2021001001', 128)
	 * console.log(avatarUrl) // 输出：http://<server>:7001/api/v1/students/avatar/by-student-id/2021001001?avatarSize=128
	 */
	static getAvatarUrlByStudentId(studentId: string | number, avatarSize: number = 64): string | null {
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
	 * @static
	 * @param {string|number} studentInfoId - 学生数据库表主键ID
	 * @returns {Promise<ApiResponse<number>>} 响应数据对象，data字段为等级代码(0-3)
	 * @throws {Error} 网络错误或服务器错误时抛出异常
	 * @example
	 * // 获取ID为1的学生等级
	 * const result = await StudentApi.getStudentLevelByInfoId(1)
	 * console.log(result.data) // 输出：1（普通成员）
	 *
	 * // 等级代码说明：
	 * // 0 = 社团成员（默认）
	 * // 1 = 普通成员
	 * // 2 = 核心成员
	 * // 3 = 管理员
	 */
	static async getStudentLevelByInfoId(studentInfoId: string | number): Promise<ApiResponse<number>> {
		const response = await this.api.get('/api/v1/students/get-student-level-by-info-id', {
			params: { 'student-info-id': studentInfoId }
		}).catch((error: AxiosError<{ message: string }>) => {
			const msg = error.response?.data?.message
			throw new Error(error.response?.status !== undefined && error.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		})
		return response.data
	}

	/**
	 * 通过token获取学生数据库表主键ID
	 * 根据用户登录凭证获取学生的数据库表主键ID
	 *
	 * @static
	 * @param {string} token - 用户登录凭证（JWT Token）
	 * @returns {Promise<ApiResponse<number>>} 响应数据对象，data字段为学生数据库表主键ID
	 * @throws {Error} 网络错误或服务器错误时抛出异常
	 * @example
	 * // 使用token获取学生数据库表ID
	 * const result = await StudentApi.getStudentDatabaseTableId('your-jwt-token')
	 * console.log(result.data) // 输出：123
	 */
	static async getStudentDatabaseTableId(token: string): Promise<ApiResponse<number>> {
		const response = await this.api.get('/api/v1/students/get-student-database-table-id', {
			params: { token }
		}).catch((error: AxiosError<{ message: string }>) => {
			const msg = error.response?.data?.message
			throw new Error(error.response?.status !== undefined && error.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		})
		return response.data
	}

	/**
	 * 修改学生等级
	 * 通过学号修改学生等级（需要特殊密码认证）
	 *
	 * @static
	 * @param {string} studentId - 学生学号
	 * @param {number} newLevel - 新的等级（0-3）
	 * @param {string} specialPassword - 特殊密码（用于认证）
	 * @returns {Promise<ApiResponse<string>>} 响应数据对象
	 * @throws {Error} 网络错误或服务器错误时抛出异常
	 * @example
	 * // 将学号为2021001001的学生等级修改为2（核心成员）
	 * const result = await StudentApi.updateStudentLevel('2021001001', 2, 'your-special-password')
	 * console.log(result.data) // 输出：等级修改成功
	 */
	static async updateStudentLevel(
		studentId: string,
		newLevel: number,
		specialPassword: string
	): Promise<ApiResponse<string>> {
		const response = await this.api.post('/api/v1/students/set-level', {
			'studentId': studentId,
			'levelCode': newLevel
		}, {
			params: {
				'special-password': specialPassword
			}
		}).catch((error: AxiosError<{ message: string }>) => {
			const msg = error.response?.data?.message
			throw new Error(error.response?.status !== undefined && error.response.status >= 500 ? '服务器错误，请稍后重试或联系管理员' : msg)
		})
		return response.data
	}

	/**
	 * 获取年级分布统计
	 * @returns 年级统计列表，包含年级和人数
	 */
	static async getGradeStatistics(): Promise<GradeStatisticsResponse> {
		const response = await this.api.get<GradeStatisticsResponse>('/api/v1/students/grade-statistics')
			.catch((error: AxiosError<{ message: string }>) => {
				const msg = error.response?.data?.message
				throw new Error(error.response?.status !== undefined && error.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
			})
		return response.data
	}

	/**
	 * 获取专业分布统计
	 * @returns 专业统计列表，包含专业和人数
	 */
	static async getMajorStatistics(): Promise<MajorStatisticsResponse> {
		const response = await this.api.get<MajorStatisticsResponse>('/api/v1/students/major-statistics')
			.catch((error: AxiosError<{ message: string }>) => {
				const msg = error.response?.data?.message
				throw new Error(error.response?.status !== undefined && error.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
			})
		return response.data
	}

	/**
	 * 获取学生总数
	 * @returns 学生总数响应对象 { code, message, data: { count: number } }
	 */
	static async getTotalStudentCount(): Promise<TotalStudentCountResponse> {
		const response = await this.api.get<TotalStudentCountResponse>('/api/v1/students/total-count')
			.catch((error: AxiosError<{ message: string }>) => {
				const msg = error.response?.data?.message
				throw new Error(error.response?.status !== undefined && error.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
			})
		return response.data
	}

	/**
	 * 获取指定等级的学生数量
	 * @param levelCode - 等级代码（0-3）
	 * @returns 该等级的学生数量响应对象 { code, message, data: number }
	 */
	static async getStudentCountByLevel(levelCode: number): Promise<StudentCountResponse> {
		const response = await this.api.get<StudentCountResponse>('/api/v1/students/student-count-by-level-code', {
			params: { 'level-code': levelCode }
		}).catch((error: AxiosError<{ message: string }>) => {
			const msg = error.response?.data?.message
			throw new Error(error.response?.status !== undefined && error.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		})
		return response.data
	}

	/**
	 * 获取学生个人信息接口
	 * 根据token获取当前登录学生的个人信息
	 *
	 * @static
	 * @param {string} token - 用户认证token
	 * @returns {Promise<ApiResponse<StudentProfileData>>} 响应数据对象，包含学生个人信息
	 * @throws {Error} 网络错误或服务器错误时抛出异常
	 * @example
	 * // 获取当前登录学生的个人信息
	 * const result = await StudentApi.getStudentProfile('your-jwt-token')
	 * console.log(result.data.name) // 输出：学生姓名
	 */
	static async getStudentProfile(token: string): Promise<ApiResponse<StudentProfileData>> {
		const response = await this.api.get('/api/v1/students/profile', {
			params: { token }
		}).catch((error: AxiosError<{ message: string }>) => {
			const msg = error.response?.data?.message
			throw new Error(error.response?.status !== undefined && error.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		})
		return response.data
	}
}

export default StudentApi
