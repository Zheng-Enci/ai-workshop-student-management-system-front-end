import ApiInterceptor from '@/composables/ApiInterceptor'

class StudentManagementApi {
	static api = ApiInterceptor.createInstance()

	/**
	 * 获取当前管理员所管理的学生综合信息（含签到次数和总积分）
	 * @param token - JWT token，用于验证身份和获取管理员ID
	 * @returns 响应数据，data 字段为学生信息列表（含统计数据）
	 *
	 * 响应数据结构：
	 * {
	 *   code: 200,
	 *   message: "获取管理学生信息成功",
	 *   data: [
	 *     {
	 *       id: 123,
	 *       studentId: 2021001001,
	 *       name: "张三",
	 *       gender: "男",
	 *       phoneNumber: "13812345678",
	 *       college: "计算机学院",
	 *       grade: 3,
	 *       classNum: 1,
	 *       major: "软件工程",
	 *       attendanceCount: 25,
	 *       totalPoints: 250
	 *     }
	 *   ]
	 * }
	 */
	static async getManagedStudentsWithStats(token) {
		const response = await this.api.get('/api/v1/student-management/managed-students-with-stats', {
			params: { token }
		}).catch(error => {
			const msg = error.response?.data?.message
			throw new Error(error.response?.status >= 500 ? '服务器错误，请稍后重试' : msg)
		})
		return response.data
	}
}

export default StudentManagementApi
