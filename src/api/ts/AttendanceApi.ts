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
	attendanceTime: string
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

interface MonthlyAttendanceCountResponse {
	data: {
		count: number
	}
}

interface RankingStudent {
	studentId: string
	name: string
	count: number
	college: string
	major: string
	grade: number
}

interface RankingResponse {
	data: RankingStudent[]
}

class AttendanceApi {
	static api: AxiosInstance = ApiInterceptor.createInstance()

	/**
	 * 通过学生数据库表主键ID获取总签到次数
	 * @param studentInfoId - 学生数据库表主键ID
	 * @returns 响应数据，data 字段为签到次数
	 */
	static async getTotalAttendanceCountByStudentInfoId(studentInfoId: string): Promise<AttendanceCountResponse> {
		try {
			const response = await this.api.get<AttendanceCountResponse>('/api/v1/attendance/total-attendance-count-by-student-info-id', {
				params: { 'student-info-id': studentInfoId }
			})
			return response.data
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
	static async getTopNStudentsByAttendanceCount(top: number = 10): Promise<TopRankingResponse> {
		try {
			const response = await this.api.get<TopRankingResponse>('/api/v1/attendance/top-ranking', {
				params: { top }
			})
			return response.data
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
	static async getStudentAttendanceRecords(studentId: string): Promise<AttendanceRecordsResponse> {
		try {
			const response = await this.api.get<AttendanceRecordsResponse>('/api/v1/attendance/student-records', {
				params: { studentId }
			})
			return response.data
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
	static async getTodayAttendanceCount(date?: string): Promise<AttendanceCountResponse> {
		try {
			const params = date ? { date } : {}
			const response = await this.api.get<AttendanceCountResponse>('/api/v1/attendance/today-attendance-count', {
				params
			})
			return response.data
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
	static async getDailySignInCount(startDate: string, endDate: string): Promise<DailySignInCountResponse> {
		try {
			const response = await this.api.get<DailySignInCountResponse>('/api/v1/attendance/daily-sign-in-count', {
				params: { startDate, endDate }
			})
			return response.data
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
	static async getTopStudentsByTimeRange(startTime: string, endTime: string, topN: number = 10): Promise<TimeRangeTopStudentsResponse> {
		try {
			const response = await this.api.get<TimeRangeTopStudentsResponse>('/api/v1/attendance/get-top-students-by-attendance-count-in-time-range', {
				params: { startTime, endTime, topN }
			})
			return response.data
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
	 * @returns 签到时间列表响应对象 { code, message, data: string[] }
	 */
	static async getStudentRecordsByTimeRange(studentInfoId: number, startTime: string, endTime: string): Promise<{ data: string[] }> {
		try {
			const response = await this.api.get<{ data: string[] }>('/api/v1/attendance/student-records-by-time-range', {
				params: { studentInfoId, startTime, endTime }
			})
			return response.data
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

	/**
	 * 获取月度签到次数
	 * @returns 响应数据，data.count 字段为月度签到次数
	 */
	static async getMonthlyAttendanceCount(): Promise<MonthlyAttendanceCountResponse> {
		try {
			const response = await this.api.get<MonthlyAttendanceCountResponse>('/api/v1/attendance/monthly-count')
			return response.data
		} catch (error) {
			const axiosError = error as AxiosError<{ message: string }>
			const msg = axiosError.response?.data?.message
			throw new Error(axiosError.response?.status && axiosError.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		}
	}

	/**
	 * 获取当月签到次数前10名学生
	 * @returns 响应数据，data为学生信息列表
	 */
	static async getCurrentMonthTop10Students(): Promise<RankingResponse> {
		try {
			const response = await this.api.get<RankingResponse>('/api/v1/attendance/current-month-top10-students')
			return response.data
		} catch (error) {
			const axiosError = error as AxiosError<{ message: string }>
			const msg = axiosError.response?.data?.message
			throw new Error(axiosError.response?.status && axiosError.response.status >= 500 ? '服务器错误，请稍后重试' : msg)
		}
	}

	/**
	 * 获取周排行榜
	 * 获取指定周（从周一开始）的签到次数排名
	 * @param weekStart - 周开始日期，格式：yyyy-MM-dd
	 * @param topN - 排名数量，默认 10
	 * @returns 响应数据，data为学生信息列表
	 */
	static async getWeeklyRanking(weekStart: string, topN: number = 10): Promise<TimeRangeTopStudentsResponse> {
		const startTime = `${weekStart}T00:00:00`
		const weekEnd = new Date(weekStart)
		weekEnd.setDate(weekEnd.getDate() + 6)
		const endTime = `${weekEnd.toLocaleDateString('en-CA')}T23:59:59`
		return this.getTopStudentsByTimeRange(startTime, endTime, topN)
	}

	/**
	 * 获取月排行榜
	 * 获取指定年月的签到次数排名
	 * @param year - 年份
	 * @param month - 月份（1-12）
	 * @param topN - 排名数量，默认 10
	 * @returns 响应数据，data为学生信息列表
	 */
	static async getMonthlyRanking(year: number, month: number, topN: number = 10): Promise<TimeRangeTopStudentsResponse> {
		const startTime = `${year}-${month.toString().padStart(2, '0')}-01T00:00:00`
		const lastDay = new Date(year, month, 0).getDate()
		const endTime = `${year}-${month.toString().padStart(2, '0')}-${lastDay}T23:59:59`
		return this.getTopStudentsByTimeRange(startTime, endTime, topN)
	}

	/**
	 * 获取最近7天排行榜
	 * 获取过去7天（包括今天）的签到次数排名
	 * @param topN - 排名数量，默认 10
	 * @returns 响应数据，data为学生信息列表
	 */
	static async getLast7DaysRanking(topN: number = 10): Promise<TimeRangeTopStudentsResponse> {
		const endDate = new Date()
		const startDate = new Date(endDate.getTime() - 6 * 24 * 60 * 60 * 1000)
		const startTime = `${startDate.toLocaleDateString('en-CA')}T00:00:00`
		const endTime = `${endDate.toLocaleDateString('en-CA')}T23:59:59`
		return this.getTopStudentsByTimeRange(startTime, endTime, topN)
	}

	/**
	 * 获取最近30天排行榜
	 * 获取过去30天（包括今天）的签到次数排名
	 * @param topN - 排名数量，默认 10
	 * @returns 响应数据，data为学生信息列表
	 */
	static async getLast30DaysRanking(topN: number = 10): Promise<TimeRangeTopStudentsResponse> {
		const endDate = new Date()
		const startDate = new Date(endDate.getTime() - 29 * 24 * 60 * 60 * 1000)
		const startTime = `${startDate.toLocaleDateString('en-CA')}T00:00:00`
		const endTime = `${endDate.toLocaleDateString('en-CA')}T23:59:59`
		return this.getTopStudentsByTimeRange(startTime, endTime, topN)
	}
}

export default AttendanceApi

