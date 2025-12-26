import ApiInterceptor from "@/composables/ApiInterceptor";

class StatisticsApi {
	static api = ApiInterceptor.createInstance();

	/**
	 * 根据签到次数和活动总积分计算综合排名
	 * @param {Number} startRank - 起始排名（从1开始）
	 * @param {Number} endRank - 结束排名
	 * @returns {Promise<Object>} 响应数据，data为学生综合排名信息列表
	 */
	static async getComprehensiveRanking(startRank, endRank) {
		const response = await this.api.get('/api/v1/statistics/comprehensive-ranking', {
			params: { 
				startRank, 
				endRank 
			}
		}).catch(error => {
			const msg = error.response?.data?.message
			throw new Error(error.response?.status >= 500 ? '服务器错误，请稍后重试' : msg)
		})
		return response.data
	}
}

export default StatisticsApi
