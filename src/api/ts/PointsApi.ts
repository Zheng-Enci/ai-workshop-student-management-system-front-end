/**
 * 积分API接口模块
 * 提供积分相关的API调用方法
 *
 * @module api/PointsApi
 * @description 封装积分相关的API接口，包括查询总积分、排名查询、改分记录等
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
		'target-student-info-id'?: number
		top?: number
	}
}

/**
 * Axios错误类型
 */
interface AxiosError {
	response?: {
		status?: number
		data?: {
			message?: string
		}
	}
}

/**
 * 排名前N名学生信息
 */
export interface TopStudentInfo {
	studentInfoId: number
	totalActivityPoints: number
}

/**
 * 改分记录信息
 */
export interface AdjustRecord {
	adjustReason: string
	adjustPoint: number
	createTime: string
}

/**
 * 积分API类
 * 提供积分相关的API调用方法
 *
 * @class PointsApi
 * @description 使用ApiInterceptor创建的axios实例进行HTTP请求
 */
class PointsApi {
	/**
	 * axios实例
	 * 使用ApiInterceptor创建的带拦截器的axios实例
	 *
	 * @static
	 */
	static api = ApiInterceptor.createInstance()

	/**
	 * 通过目标数据库学生表 ID 获取总活动积分
	 * 根据学生数据库表主键ID获取该学生的总活动积分
	 *
	 * @static
	 * @param {number} studentInfoId - 学生数据库表主键ID
	 * @returns {Promise<ApiResponse<number>>} 响应数据对象，data字段为总积分
	 * @throws {Error} 网络错误或服务器错误时抛出异常
	 * @example
	 * // 获取ID为123的学生的总活动积分
	 * const result = await PointsApi.getTotalActivityPointsByStudentInfoId(123)
	 * console.log(result.data) // 输出总积分，例如：50
	 */
	static async getTotalActivityPointsByStudentInfoId(studentInfoId: number): Promise<ApiResponse<number>> {
		const response = await this.api.get('/api/v1/points/total-points-by-student-info-id', {
			params: { 'target-student-info-id': studentInfoId }
		}).catch((error: AxiosError) => {
			const msg = error.response?.data?.message
			throw new Error(error.response?.status !== undefined && error.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		})
		return response.data
	}

	/**
	 * 根据总积分获取排名前N名学生
	 * 获取按照总活动积分排名的前N名学生信息
	 *
	 * @static
	 * @param {number} [top=10] - 排名数量，默认10，最少为1
	 * @returns {Promise<ApiResponse<TopStudentInfo[]>>} 响应数据对象，data字段为学生ID和总积分列表
	 * @throws {Error} 网络错误或服务器错误时抛出异常
	 * @example
	 * // 获取排名前10的学生
	 * const result = await PointsApi.getTopStudentsByTotalActivityPoints()
	 * console.log(result.data) // 输出前10名学生的ID和总积分
	 *
	 * // 获取排名前5的学生
	 * const result = await PointsApi.getTopStudentsByTotalActivityPoints(5)
	 */
	static async getTopStudentsByTotalActivityPoints(top: number = 10): Promise<ApiResponse<TopStudentInfo[]>> {
		const response = await this.api.get('/api/v1/points/top-ranking', {
			params: { top }
		}).catch((error: AxiosError) => {
			const msg = error.response?.data?.message
			throw new Error(error.response?.status !== undefined && error.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		})
		return response.data
	}

	/**
	 * 获取学生所有改分记录
	 * 根据学生数据库表主键ID获取该学生的所有改分记录
	 *
	 * @static
	 * @param {number} studentInfoId - 学生数据库表主键ID
	 * @returns {Promise<ApiResponse<AdjustRecord[]>>} 响应数据对象，data字段为改分记录列表
	 * @throws {Error} 网络错误或服务器错误时抛出异常
	 * @example
	 * // 获取ID为123的学生的所有改分记录
	 * const result = await PointsApi.getAllAdjustRecordsByStudentInfoId(123)
	 * console.log(result.data) // 输出改分记录列表
	 */
	static async getAllAdjustRecordsByStudentInfoId(studentInfoId: number): Promise<ApiResponse<AdjustRecord[]>> {
		const response = await this.api.get('/api/v1/points/all-adjust-reason-and-adjust-point-and-create-time-records-by-student-info-id', {
			params: {
				'target-student-info-id': studentInfoId
			}
		}).catch((error: AxiosError) => {
			const msg = error.response?.data?.message
			throw new Error(error.response?.status !== undefined && error.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		})
		return response.data
	}
}

export default PointsApi
