/**
 * 特殊密码API接口模块
 * 提供需要特殊密码认证的API调用方法
 *
 * @module api/SpecialPasswordApi
 * @description 封装特殊密码相关的API接口，包括学生综合信息查询等
 */

import ApiInterceptor from '../../composables/ApiInterceptor.js'

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
 * 学生信息更新类型
 * 定义可通过特殊密码修改的学生信息字段
 */
interface StudentUpdateInfo {
	name: string
	studentId: string
	gender: string
	phoneNumber: string
	college: string
	major: string
	grade: number
	classNum: number
	password: string
}

/**
 * Axios更新学生信息请求配置类型
 */
interface UpdateStudentRequestConfig {
	params: {
		'special-password': string
		'student-id': string
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

	/**
	 * 分配学生为管理员
	 * 通过特殊密码将指定学生分配给指定管理员进行管理
	 *
	 * @static
	 * @param {string} specialPassword - 特殊密码（请联系系统管理员获取）
	 * @param {string} studentId - 被分配的学生学号（以20-30开头的10位数字）
	 * @param {string} adminStudentId - 管理员学号（以20-30开头的10位数字，必须是等级3的管理员）
	 * @returns {Promise<ApiResponse<boolean>>} 响应数据对象，data字段为分配结果(true/false)
	 * @throws {Error} 网络错误或服务器错误时抛出异常
	 * @example
	 * // 将学号为2021001001的学生分配给学号为2021001002的管理员
	 * const result = await SpecialPasswordApi.assignStudentToAdmin('password123', '2021001001', '2021001002')
	 * console.log(result.data) // true表示分配成功
	 */
	static async assignStudentToAdmin(specialPassword: string, studentId: string, adminStudentId: string): Promise<ApiResponse<boolean>> {
		const response = await this.api.post('/api/v1/students/assign-student-to-admin', {
			'studentId': studentId,
			'adminStudentId': adminStudentId
		}, {
			params: {
				'special-password': specialPassword
			}
		} as AxiosRequestConfig).catch((error: AxiosError) => {
			const msg = error.response?.data?.message
			throw new Error(error.response?.status !== undefined && error.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		})
		return response.data
	}

	/**
	 * 特殊密码补卡
	 * 通过特殊密码为指定学生在指定时间进行补卡操作
	 *
	 * @static
	 * @param {string} specialPassword - 特殊密码（请联系系统管理员获取）
	 * @param {string} targetStudentId - 目标补卡学生学号（以20-30开头的10位数字）
	 * @param {string} targetAttendanceDateTime - 目标补卡时间（ISO 8601格式：YYYY-MM-DDTHH:mm:ss）
	 * @returns {Promise<ApiResponse<boolean>>} 响应数据对象，data字段为补卡结果(true/false)
	 * @throws {Error} 网络错误或服务器错误时抛出异常
	 * @example
	 * // 为学号2021001001的学生在2024-01-15 08:30:00进行补卡
	 * const result = await SpecialPasswordApi.makeupAttendanceWithSpecialPassword('password123', '2021001001', '2024-01-15T08:30:00')
	 * console.log(result.data) // true表示补卡成功
	 */
	static async makeupAttendanceWithSpecialPassword(
		specialPassword: string,
		targetStudentId: string,
		targetAttendanceDateTime: string
	): Promise<ApiResponse<boolean>> {
		const response = await this.api.post('/api/v1/attendance/makeup-with-special-password', {
			specialPassword: specialPassword,
			targetStudentId: targetStudentId,
			targetAttendanceDateTime: targetAttendanceDateTime
		}).catch((error: AxiosError) => {
			const msg = error.response?.data?.message
			throw new Error(error.response?.status !== undefined && error.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		})
		return response.data
	}

	/**
	 * 创建积分记录
	 * 通过特殊密码为指定学生创建积分记录，记录积分变更原因和分数
	 *
	 * @static
	 * @param {string} specialPassword - 特殊密码（请联系系统管理员获取）
	 * @param {number} targetStudentInfoId - 目标学生数据库表主键ID
	 * @param {number} changePoints - 改分分数（正数为加分，负数为扣分）
	 * @param {string} adjustReason - 改分理由
	 * @returns {Promise<ApiResponse<null>>} 响应数据对象，data字段为null
	 * @throws {Error} 网络错误或服务器错误时抛出异常
	 * @example
	 * // 为ID为123的学生增加10分，理由是"参加活动表现优秀"
	 * const result = await SpecialPasswordApi.createPointsRecord('password123', 123, 10, '参加活动表现优秀')
	 * console.log(result.data) // null表示创建成功
	 */
	static async createPointsRecord(
		specialPassword: string,
		targetStudentInfoId: number,
		changePoints: number,
		adjustReason: string
	): Promise<ApiResponse<null>> {
		const response = await this.api.post('/api/v1/points', {
			adjustReason: adjustReason,
			changePoints: changePoints,
			targetStudentInfoId: targetStudentInfoId
		}, {
			headers: {
				'X-Special-Password': specialPassword
			}
		}).catch((error: AxiosError) => {
			const msg = error.response?.data?.message
			throw new Error(error.response?.status !== undefined && error.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		})
		return response.data
	}

	/**
	 * 管理员更新学生信息
	 * 通过特殊密码更新指定学生的所有信息，包括学号、姓名、联系方式等
	 *
	 * @static
	 * @param {string} specialPassword - 特殊密码（请联系系统管理员获取）
	 * @param {string} oldStudentId - 要修改的学生学号（旧学号）
	 * @param {StudentUpdateInfo} studentInfo - 新的学生信息对象
	 * @returns {Promise<ApiResponse<boolean>>} 响应数据对象，data字段为修改结果(true/false)
	 * @throws {Error} 网络错误或服务器错误时抛出异常
	 * @example
	 * // 更新学号为2021001001的学生信息
	 * const result = await SpecialPasswordApi.updateStudentWithSpecialPassword(
	 *   'password123',
	 *   '2021001001',
	 *   {
	 *     name: '张三',
	 *     studentId: '2021001002',
	 *     gender: '男',
	 *     phoneNumber: '13812345678',
	 *     college: '计算机学院',
	 *     major: '软件工程',
	 *     grade: 3,
	 *     classNum: 1,
	 *     password: 'newpassword123'
	 *   }
	 * )
	 * console.log(result.data) // true表示修改成功
	 */
	static async updateStudentWithSpecialPassword(
		specialPassword: string,
		oldStudentId: string,
		studentInfo: StudentUpdateInfo
	): Promise<ApiResponse<boolean>> {
		const response = await this.api.put('/api/v1/students/update-with-special-password', {
			name: studentInfo.name,
			studentId: studentInfo.studentId,
			gender: studentInfo.gender,
			phoneNumber: studentInfo.phoneNumber,
			college: studentInfo.college,
			major: studentInfo.major,
			grade: studentInfo.grade,
			classNum: studentInfo.classNum,
			password: studentInfo.password
		}, {
			params: {
				'special-password': specialPassword,
				'student-id': oldStudentId
			}
		} as UpdateStudentRequestConfig).catch((error: AxiosError) => {
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
