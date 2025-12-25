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

	/**
	 * 根据总积分获取排名前N名学生
	 * @param {Number} top - 排名数量，默认10，最少为1
	 * @returns {Promise<Object>} 响应数据，data为学生ID和总积分列表
	 */
	static async getTopStudentsByTotalActivityPoints(top = 10) {
		const response = await this.api.get('/api/v1/points/top-ranking', {
			params: { top }
		}).catch(error => {
			const msg = error.response?.data?.message
			throw new Error(error.response?.status >= 500 ? '服务器错误，请稍后重试' : msg)
		})
		return response.data
	}
	/**
	 * 获取学生所有改分记录
	 * @param {Number} studentInfoId - 学生数据库表主键ID
	 * @returns {Promise<Object>} 响应数据，data为改分记录列表
	 */
	static async getAllAdjustRecordsByStudentInfoId(studentInfoId) {
		const response = await this.api.get('/api/v1/points/all-adjust-reason-and-adjust-point-and-create-time-records-by-student-info-id', {
			params: {
				'target-student-info-id': studentInfoId
			}
		}).catch(error => {
			const msg = error.response?.data?.message
			throw new Error(error.response?.status >= 500 ? '服务器错误，请稍后重试' : msg)
		})
		return response.data
	}



}

export default PointsApi
