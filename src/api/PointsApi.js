import ApiInterceptor from "@/composables/ApiInterceptor";

class PointsApi {
	static api = ApiInterceptor.createInstance()

	/**
	 * 通过目标数据库学生表 ID 获取总活动积分
	 * @param {Number} studentInfoId - 学生数据库表主键ID
	 * @returns {Promise<Object>} 响应数据，data字段为总积分
	 */
	static async getTotalActivityPointsByStudentInfoId(studentInfoId) {
		const response = await this.api.get('/api/v1/points/total-points-by-student-info-id', {
			params: { 'target-student-info-id': studentInfoId }
		}).catch(error => {
			const msg = error.response?.data?.message
			throw new Error(error.response?.status >= 500 ? '服务器错误，请稍后重试' : msg)
		})
		return response.data
	}

}

export default PointsApi
