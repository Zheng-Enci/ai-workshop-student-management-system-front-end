import ApiInterceptor from "@/composables/ApiInterceptor";

class AttendanceApi {
	static api = ApiInterceptor.createInstance();

	/**
	 * 通过学生数据库表主键ID获取总签到次数
	 * @param {Number} studentInfoId - 学生数据库表主键ID
	 * @returns {Promise<Object>} 响应数据，data字段为签到次数
	 */
	static async getTotalAttendanceCountByStudentInfoId(studentInfoId) {
		const response = await this.api.get('/api/v1/attendance/total-attendance-count-by-student-info-id', {
			params: { 'student-info-id': studentInfoId }
		}).catch(error => {
			const msg = error.response?.data?.message
			throw new Error(error.response?.status >= 500 ? '服务器错误，请稍后重试' : msg)
		})
		return response.data
	}

	/**
	 * 获取签到次数排名前N名
	 * @param {Number} top - 排名数量，默认 10，最少为 1
	 * @returns {Promise<Object>} 响应数据，data为学生 ID 和签到次数列表
	 */
	static async getTopNStudentsByAttendanceCount(top = 10) {
		const response = await this.api.get('/api/v1/attendance/top-ranking', {
			params: { top }
		}).catch(error => {
			const msg = error.response?.data?.message
			throw new Error(error.response?.status >= 500 ? '服务器错误，请稍后重试' : msg)
		})
		return response.data
	}
}
export default AttendanceApi
