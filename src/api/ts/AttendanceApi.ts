import ApiInterceptor from '../../composables/ApiInterceptor'
import type { AxiosInstance, AxiosError } from 'axios'

// 定义接口返回的数据类型
interface AttendanceCountResponse {
	data: number
}

interface TopRankingResponse {
	data: Array<{
		studentId: string
		count: number
	}>
}

interface AttendanceRecord {
	id: string
	studentId: string
	studentName: string
	checkInTime: string
	// 根据实际需求添加更多字段
}

interface AttendanceRecordsResponse {
	data: AttendanceRecord[]
}

class AttendanceApi {
	static api: AxiosInstance = ApiInterceptor.createInstance()

	/**
	 * 通过学生数据库表主键ID获取总签到次数
	 * @param studentInfoId - 学生数据库表主键ID
	 * @returns 响应数据，data 字段为签到次数
	 */
	static async getTotalAttendanceCountByStudentInfoId(studentInfoId: string): Promise<number> {
		try {
			const response = await this.api.get<AttendanceCountResponse>('/api/v1/attendance/total-attendance-count-by-student-info-id', {
				params: { 'student-info-id': studentInfoId }
			})
			return response.data.data
		} catch (error) {
			const axiosError = error as AxiosError<{ message: string }>
			const msg = axiosError.response?.data?.message
			throw new Error(axiosError.response?.status && axiosError.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		}
	}

	/**
	 * 获取签到次数排名前N名
	 * @param top - 排名数量，默认 10，最少为 1
	 * @returns 响应数据，data为学生 ID 和签到次数列表
	 */
	static async getTopNStudentsByAttendanceCount(top: number = 10): Promise<Array<{ studentId: string; count: number }>> {
		try {
			const response = await this.api.get<TopRankingResponse>('/api/v1/attendance/top-ranking', {
				params: { top }
			})
			return response.data.data
		} catch (error) {
			const axiosError = error as AxiosError<{ message: string }>
			const msg = axiosError.response?.data?.message
			throw new Error(axiosError.response?.status && axiosError.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		}
	}

	/**
	 * 根据学生学号获取该学生所有签到记录
	 * @param studentId - 学生学号
	 * @returns 该学生的所有签到记录列表
	 */
	static async getStudentAttendanceRecords(studentId: string): Promise<AttendanceRecord[]> {
		try {
			const response = await this.api.get<AttendanceRecordsResponse>('/api/v1/attendance/student-records', {
				params: { studentId }
			})
			return response.data.data
		} catch (error) {
			const axiosError = error as AxiosError<{ message: string }>
			const msg = axiosError.response?.data?.message
			throw new Error(axiosError.response?.status && axiosError.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		}
	}

	/**
	 * 获取今日签到次数（不去重）
	 * @param date - 查询日期，格式：yyyy-MM-dd，不传则查询当天
	 * @returns 响应数据，data 字段为签到记录总数（数字类型）
	 */
	static async getTodayAttendanceCount(date?: string): Promise<number> {
		try {
			const params = date ? { date } : {}
			const response = await this.api.get<AttendanceCountResponse>('/api/v1/attendance/today-attendance-count', {
				params
			})
			return response.data.data
		} catch (error) {
			const axiosError = error as AxiosError<{ message: string }>
			const msg = axiosError.response?.data?.message
			throw new Error(axiosError.response?.status && axiosError.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		}
	}
}

export default AttendanceApi
