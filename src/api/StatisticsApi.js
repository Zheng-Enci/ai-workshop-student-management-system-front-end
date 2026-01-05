/**
 * 统计数据API模块
 * 提供学生排名统计相关的API接口
 *
 * @module api/StatisticsApi
 * @description 封装统计相关的HTTP请求，包括综合排名查询等功能
 */

import ApiInterceptor from '@/composables/ApiInterceptor'

/**
 * 统计数据API类
 * 提供静态方法用于获取各种统计数据
 *
 * @class StatisticsApi
 * @description 使用ApiInterceptor创建的axios实例进行HTTP请求
 */
class StatisticsApi {
	/**
	 * axios实例
	 * 使用ApiInterceptor创建的带拦截器的axios实例
	 *
	 * @static
	 * @type {AxiosInstance}
	 */
	static api = ApiInterceptor.createInstance()

	/**
	 * 获取综合排名接口
	 * 根据签到次数和活动总积分计算学生的综合排名
	 *
	 * @static
	 * @param {number} startRank - 起始排名（从1开始，包含）
	 * @param {number} endRank - 结束排名（包含）
	 * @returns {Promise<Object>} 响应数据，data字段为学生综合排名信息列表
	 * @throws {Error} 网络错误或服务器错误时抛出异常
	 * @example
	 * // 获取排名前10的学生
	 * const result = await StatisticsApi.getComprehensiveRanking(1, 10)
	 * console.log(result.data) // 学生排名列表
	 */
	static async getComprehensiveRanking(startRank, endRank) {
		// 调用综合排名接口
		const response = await this.api.get('/api/v1/statistics/comprehensive-ranking', {
			params: {
				startRank, // 起始排名
				endRank // 结束排名
			}
		}).catch(error => {
			// 错误处理：提取错误消息
			const msg = error.response?.data?.message
			// 根据状态码判断错误类型，5xx为服务器错误，其他为业务错误
			throw new Error(error.response?.status >= 500 ? '服务器错误，请稍后重试' : msg)
		})
		// 返回响应数据
		return response.data
	}
}

/**
 * 导出统计数据API类
 * @exports StatisticsApi
 */
export default StatisticsApi
