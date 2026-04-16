import ApiInterceptor from '../../composables/ts/ApiInterceptor'
import type { AxiosInstance, AxiosError } from 'axios'
import axios from 'axios'
import { ConfigServer } from '@/config/ts/Config'

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

interface TimeRangeTopStudentsResponse {
	data: Array<{
		studentId: string
		name: string
		count: number
		college: string
		major: string
		grade: number
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

interface DailySignInCountResponse {
	data: Array<{
		date: string
		signCount: number
	}>
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

	/**
	 * 获取指定日期范围内每日签到人次统计
	 * @param startDate - 开始日期，格式：yyyy-MM-dd
	 * @param endDate - 结束日期，格式：yyyy-MM-dd
	 * @returns 响应数据，包含日期和签到人次列表
	 */
	static async getDailySignInCount(startDate: string, endDate: string): Promise<Array<{ date: string; count: number }>> {
		try {
			const response = await this.api.get<DailySignInCountResponse>('/api/v1/attendance/daily-sign-in-count', {
				params: { startDate, endDate }
			})
			return response.data.data.map(item => ({
				date: item.date,
				count: item.signCount
			}))
		} catch (error) {
			const axiosError = error as AxiosError<{ message: string }>
			const msg = axiosError.response?.data?.message
			throw new Error(axiosError.response?.status && axiosError.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		}
	}

	/**
	 * 获取指定时间内签到次数最多的前N名学生
	 * @param startTime - 开始时间，格式：yyyy-MM-dd HH:mm:ss
	 * @param endTime - 结束时间，格式：yyyy-MM-dd HH:mm:ss
	 * @param topN - 排名数量，默认 10，最少为 1
	 * @returns 响应数据，data为学生信息列表，包含学号、姓名、签到次数、学院、专业、年级
	 */
	static async getTopStudentsByTimeRange(startTime: string, endTime: string, topN: number = 10): Promise<Array<{
		studentId: string
		name: string
		count: number
		college: string
		major: string
		grade: number
	}>> {
		try {
			const response = await this.api.get<TimeRangeTopStudentsResponse>('/api/v1/attendance/get-top-students-by-attendance-count-in-time-range', {
				params: { startTime, endTime, topN }
			})
			return response.data.data
		} catch (error) {
			const axiosError = error as AxiosError<{ message: string }>
			const msg = axiosError.response?.data?.message
			throw new Error(axiosError.response?.status && axiosError.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		}
	}

	/**
	 * 获取验证码
	 * 从验证码服务获取签到验证码
	 * 注意：此接口使用独立的URL，不使用api实例
	 * @returns - 验证码数据
	 * @throws {Error} - 获取失败时抛出错误
	 */
	static async getVerificationCode(): Promise<any> {
		try {
			const response = await axios.get(ConfigServer.VERIFICATION_CODE_URL)
			return response.data
		} catch (error) {
			const axiosError = error as AxiosError<{ message: string }>
			const msg = axiosError.response?.data?.message
			if (axiosError.response?.status === 403) {
				throw new Error('IP地址不允许访问该接口')
			}
			throw new Error(axiosError.response?.status && axiosError.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		}
	}

	/**
	 * 查询指定学生指定时间段内签到记录
	 * @param studentInfoId - 学生数据库表主键ID
	 * @param startTime - 开始时间，格式：yyyy-MM-dd HH:mm:ss
	 * @param endTime - 结束时间，格式：yyyy-MM-dd HH:mm:ss
	 * @returns 签到时间列表
	 */
	static async getStudentRecordsByTimeRange(studentInfoId: number, startTime: string, endTime: string): Promise<string[]> {
		try {
			const response = await this.api.get<{ data: string[] }>('/api/v1/attendance/student-records-by-time-range', {
				params: { studentInfoId, startTime, endTime }
			})
			return response.data.data
		} catch (error) {
			const axiosError = error as AxiosError<{ message: string }>
			const msg = axiosError.response?.data?.message
			throw new Error(axiosError.response?.status && axiosError.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		}
	}

	/**
	 * 学生签到
	 * @param token - 用户认证令牌
	 * @param verificationCode - 验证码
	 * @returns 签到响应结果
	 */
	static async signIn(token: string, verificationCode: string): Promise<{ code: number; message: string; data?: unknown }> {
		try {
			const response = await this.api.post('/api/v1/attendance', {}, {
				params: { token, verificationCode }
			})
			return response.data
		} catch (error) {
			const axiosError = error as AxiosError<{ code: number; message: string; data?: unknown }>
			// 400错误返回业务错误数据（如验证码错误）
			if (axiosError.response?.status === 400) {
				return axiosError.response.data
			}
			const msg = axiosError.response?.data?.message
			throw new Error(axiosError.response?.status && axiosError.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		}
	}
}

export default AttendanceApi

