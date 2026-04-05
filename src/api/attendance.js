/**
 * 考勤相关API接口
 * 提供签到、补卡、考勤统计等功能的API调用
 *
 * @module api/attendance
 * @description 封装所有考勤相关的HTTP请求，包括错误处理和响应拦截
 */

import axios from 'axios'

import config from '@/config'

/**
 * 创建axios实例
 * 配置基础URL、超时时间和请求头
 *
 * @type {AxiosInstance}
 */
const api = axios.create({
	baseURL: config.API_BASE_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json'
	}
})

/**
 * 响应拦截器
 * 统一处理网络错误和超时错误
 */
api.interceptors.response.use(
	response => response,
	error => {
		// 处理请求超时错误
		if (error.code === 'ECONNABORTED') {
			throw new Error('请求超时，请检查网络连接')
		} else if (error.code === 'ERR_NETWORK') {
			// 处理网络连接失败错误
			throw new Error('网络连接失败，请检查服务器状态')
		} else if (error.code === 'ERR_INTERNET_DISCONNECTED') {
			// 处理网络断开错误
			throw new Error('网络连接已断开，请检查网络设置')
		}
		return Promise.reject(error)
	}
)

/**
 * 学生签到接口
 * 使用token和验证码进行签到操作
 *
 * @param token - 用户认证token
 * @param verificationCode - 验证码
 * @returns - 签到结果数据
 * @throws {Error} - 签到失败时抛出错误
 */
export const signIn = async (token, verificationCode) => {
	try {
		const response = await api.post('/api/v1/attendance', {}, {
			params: { token, verificationCode },
			headers: {
				'Content-Type': 'application/json'
			}
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			// 处理403错误：Token过期或无效
			if (status === 403) {
				throw new Error('Token已过期或无效，请重新登录')
			} else if (status === 401) {
				// 处理401错误：未授权访问
				throw new Error('未授权访问，请重新登录')
			} else if (status >= 500) {
				// 处理服务器错误
				throw new Error('服务器错误，请稍后重试')
			} else if (status === 400) {
				// 400错误可能是业务逻辑错误，返回错误数据
				return error.response.data
			} else {
				throw new Error(error.response.data?.message || '签到失败')
			}
		} else {
			throw new Error('网络错误，签到失败')
		}
	}
}

/**
 * 补卡接口（使用token）
 * 为指定学生补录考勤记录
 *
 * @param token - 用户认证token
 * @param studentId - 学生ID
 * @param attendanceTime - 考勤时间（ISO格式字符串）
 * @returns - 补卡结果数据
 * @throws {Error} - 补卡失败时抛出错误
 */
export const makeupAttendance = async (token, studentId, attendanceTime) => {
	try {
		const response = await api.post('/api/v1/attendance/makeup', {
			studentId,
			attendanceTime
		}, {
			params: { token }
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			if (status === 401) {
				throw new Error('Token无效，请重新登录')
			} else if (status === 400) {
				throw new Error(error.response.data?.message || '补卡失败')
			} else if (status >= 500) {
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '补卡失败')
			}
		} else {
			throw new Error('网络错误，补卡失败')
		}
	}
}

/**
 * 使用特殊密码补卡接口
 * 管理员使用特殊密码为指定学生补录考勤
 *
 * @param specialPassword - 特殊密码（管理员密码）
 * @param targetStudentId - 目标学生ID
 * @param targetAttendanceDateTime - 目标考勤时间（ISO格式字符串）
 * @returns - 补卡结果数据
 * @throws {Error} - 补卡失败时抛出错误
 */
export const makeupAttendanceWithSpecialPassword = async (
	specialPassword,
	targetStudentId,
	targetAttendanceDateTime
) => {
	try {
		const response = await api.post('/api/v1/attendance/makeup-with-special-password', {
			specialPassword,
			targetStudentId,
			targetAttendanceDateTime
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			if (status === 400) {
				throw new Error(error.response.data?.message || '补卡失败')
			} else if (status >= 500) {
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '补卡失败')
			}
		} else {
			throw new Error('网络错误，补卡失败')
		}
	}
}

/**
 * 获取优秀学生统计
 * 获取签到次数排名靠前的学生数据
 *
 * @returns - 优秀学生统计数据
 * @throws {Error} - 获取失败时抛出错误
 */
export const getTopStudents = async () => {
	try {
		const response = await api.get('/api/v1/attendance/top-students')
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			if (status >= 500) {
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '获取优秀学生统计失败')
			}
		} else {
			throw new Error('网络错误，获取优秀学生统计失败')
		}
	}
}

/**
 * 获取月度考勤统计
 * 获取当前月份的考勤签到总数
 *
 * @returns - 月度考勤统计数据
 * @throws {Error} - 获取失败时抛出错误
 */
export const getMonthlyAttendanceCount = async () => {
	try {
		const response = await api.get('/api/v1/attendance/monthly-count')
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			if (status >= 500) {
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '获取月度考勤统计失败')
			}
		} else {
			throw new Error('网络错误，获取月度考勤统计失败')
		}
	}
}

/**
 * 获取日度考勤统计
 * 获取指定日期的考勤签到总数，如果不传日期则获取今天的统计
 *
 * @param [date] - 日期字符串（可选，格式：YYYY-MM-DD）
 * @returns - 日度考勤统计数据
 * @throws {Error} - 获取失败时抛出错误
 */
export const getDailyAttendanceCount = async date => {
	try {
		const response = await api.get('/api/v1/attendance/daily-count', {
			params: date ? { date } : {}
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			if (status >= 500) {
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '获取日度考勤统计失败')
			}
		} else {
			throw new Error('网络错误，获取日度考勤统计失败')
		}
	}
}

/**
 * 获取个人签到次数
 * 获取当前登录用户的签到总次数
 *
 * @param token - 用户认证token
 * @returns - 个人签到次数数据
 * @throws {Error} - 获取失败时抛出错误
 */
export const getMyAttendanceCount = async token => {
	try {
		const response = await api.get('/api/v1/attendance/my-attendance-count', {
			params: { token }
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			if (status === 401) {
				throw new Error('Token无效，请重新登录')
			} else if (status >= 500) {
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '获取个人签到次数失败')
			}
		} else {
			throw new Error('网络错误，获取个人签到次数失败')
		}
	}
}

/**
 * 获取本月签到前十名学生
 * 获取当前月份签到次数排名前10的学生数据
 *
 * @returns - 本月签到前十名学生数据
 * @throws {Error} - 获取失败时抛出错误
 */
export const getCurrentMonthTop10Students = async () => {
	try {
		const response = await api.get('/api/v1/attendance/current-month-top10-students')
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			if (status >= 500) {
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '获取本月签到前十名失败')
			}
		} else {
			throw new Error('网络错误，获取本月签到前十名失败')
		}
	}
}

/**
 * 根据学生ID获取签到次数
 * 获取指定学生的总签到次数
 *
 * @param studentId - 学生ID
 * @returns - 学生签到次数数据
 * @throws {Error} - 获取失败时抛出错误
 */
export const getAttendanceCountByStudentId = async studentId => {
	try {
		const response = await api.get('/api/v1/attendance/attendance-count-by-student-id', {
			params: { studentId }
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			if (status === 400) {
				throw new Error(error.response.data?.message || '获取学生签到次数失败')
			} else if (status >= 500) {
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '获取学生签到次数失败')
			}
		} else {
			throw new Error('网络错误，获取学生签到次数失败')
		}
	}
}

/**
 * 获取学生签到次数的别名
 * 与getAttendanceCountByStudentId功能相同
 *
 * @type {Function}
 */
export const getStudentAttendanceCount = getAttendanceCountByStudentId

/**
 * 获取今日签到记录
 * 获取今天所有的签到记录列表
 *
 * @returns - 今日签到记录数据
 * @throws {Error} - 获取失败时抛出错误
 */
export const getTodayAttendanceRecords = async () => {
	try {
		const response = await api.get('/api/v1/attendance/today-records')
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			if (status >= 500) {
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '获取今日签到记录失败')
			}
		} else {
			throw new Error('网络错误，获取今日签到记录失败')
		}
	}
}

/**
 * 获取学生考勤记录
 * 获取指定学生的所有考勤记录列表
 *
 * @param studentId - 学生ID
 * @returns - 学生考勤记录数据
 * @throws {Error} - 获取失败时抛出错误
 */
export const getStudentAttendanceRecords = async studentId => {
	try {
		const response = await api.get('/api/v1/attendance/student-records', {
			params: { studentId }
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			if (status === 400) {
				throw new Error(error.response.data?.message || '获取学生考勤记录失败')
			} else if (status >= 500) {
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '获取学生考勤记录失败')
			}
		} else {
			throw new Error('网络错误，获取学生考勤记录失败')
		}
	}
}

/**
 * 获取个人考勤记录
 * 获取当前登录用户的所有考勤记录
 * 从localStorage中读取用户信息获取studentId
 *
 * @returns - 个人考勤记录数据
 * @throws {Error} - 获取失败时抛出错误
 */
export const getMyAttendanceRecords = async () => {
	try {
		const response = await api.get('/api/v1/attendance/student-records', {
			params: { studentId: JSON.parse(localStorage.getItem('userInfo') || '{}').studentId }
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			if (status === 401) {
				throw new Error('Token无效，请重新登录')
			} else if (status >= 500) {
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '获取个人考勤记录失败')
			}
		} else {
			throw new Error('网络错误，获取个人考勤记录失败')
		}
	}
}

/**
 * 获取指定时间范围内的签到排行
 * 根据时间范围获取签到次数排名前N的学生
 *
 * @param startTime - 开始时间（ISO格式字符串）
 * @param endTime - 结束时间（ISO格式字符串）
 * @param topN - 返回前N名（默认值由后端决定）
 * @returns - 签到排行数据
 * @throws {Error} - 获取失败时抛出错误
 */
export const getTopStudentsByTimeRange = async (startTime, endTime, topN) => {
	try {
		const response = await api.get('/api/v1/attendance/get-top-students-by-attendance-count-in-time-range', {
			params: { startTime, endTime, topN }
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			if (status >= 500) {
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '获取签到排行失败')
			}
		} else {
			throw new Error('网络错误，获取签到排行失败')
		}
	}
}

/**
 * 获取验证码
 * 从验证码服务获取签到验证码
 * 注意：此接口使用独立的URL，不使用api实例
 *
 * @returns - 验证码数据
 * @throws {Error} - 获取失败时抛出错误
 */
export const getVerificationCode = async () => {
	try {
		const response = await axios.get(config.VERIFICATION_CODE_URL)
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			if (status === 403) {
				throw new Error('IP地址不允许访问该接口')
			} else if (status >= 500) {
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '获取验证码失败')
			}
		} else {
			throw new Error('网络错误，获取验证码失败')
		}
	}
}

/**
 * 获取日度签到排行
 * 获取指定日期的签到次数排名
 *
 * @param date - 日期字符串（格式：YYYY-MM-DD）
 * @param [topN] - 返回前N名，默认10
 * @returns - 日度签到排行数据
 */
export const getDailyRanking = (date, topN = 10) => {
	const startTime = `${date}T00:00:00`
	const endTime = `${date}T23:59:59`
	return getTopStudentsByTimeRange(startTime, endTime, topN)
}

/**
 * 获取周度签到排行
 * 获取指定周（从周一开始）的签到次数排名
 *
 * @param weekStart - 周开始日期（格式：YYYY-MM-DD）
 * @param [topN] - 返回前N名，默认10
 * @returns - 周度签到排行数据
 */
export const getWeeklyRanking = (weekStart, topN = 10) => {
	const startTime = `${weekStart}T00:00:00`
	const weekEnd = new Date(weekStart)
	weekEnd.setDate(weekEnd.getDate() + 6)
	const endTime = `${weekEnd.toISOString().split('T')[0]}T23:59:59`
	return getTopStudentsByTimeRange(startTime, endTime, topN)
}

/**
 * 获取月度签到排行
 * 获取指定年月的签到次数排名
 *
 * @param year - 年份
 * @param month - 月份（1-12）
 * @param [topN] - 返回前N名，默认10
 * @returns - 月度签到排行数据
 */
export const getMonthlyRanking = (year, month, topN = 10) => {
	const startTime = `${year}-${month.toString().padStart(2, '0')}-01T00:00:00`
	const lastDay = new Date(year, month, 0).getDate()
	const endTime = `${year}-${month.toString().padStart(2, '0')}-${lastDay}T23:59:59`
	return getTopStudentsByTimeRange(startTime, endTime, topN)
}

/**
 * 获取季度签到排行
 * 获取指定年季度的签到次数排名
 *
 * @param year - 年份
 * @param quarter - 季度（1-4）
 * @param [topN] - 返回前N名，默认10
 * @returns - 季度签到排行数据
 */
export const getQuarterlyRanking = (year, quarter, topN = 10) => {
	// 定义每个季度包含的月份
	const quarterMonths = {
		1: [1, 2, 3],
		2: [4, 5, 6],
		3: [7, 8, 9],
		4: [10, 11, 12]
	}

	const [startMonth, , endMonth] = quarterMonths[quarter]

	const startTime = `${year}-${startMonth.toString().padStart(2, '0')}-01T00:00:00`
	const lastDay = new Date(year, endMonth, 0).getDate()
	const endTime = `${year}-${endMonth.toString().padStart(2, '0')}-${lastDay}T23:59:59`

	return getTopStudentsByTimeRange(startTime, endTime, topN)
}

/**
 * 获取学期签到排行
 * 获取指定年学期的签到次数排名
 *
 * @param year - 年份
 * @param semester - 学期（1或2）
 * @param [topN] - 返回前N名，默认10
 * @returns - 学期签到排行数据
 */
export const getSemesterRanking = (year, semester, topN = 10) => {
	// 定义学期时间范围：第一学期2-7月，第二学期9-12月
	const semesterRanges = {
		1: { start: `${year}-02-01`, end: `${year}-07-31` },
		2: { start: `${year}-09-01`, end: `${year}-12-31` }
	}

	const range = semesterRanges[semester]
	const startTime = `${range.start}T00:00:00`
	const endTime = `${range.end}T23:59:59`

	return getTopStudentsByTimeRange(startTime, endTime, topN)
}

/**
 * 获取年度签到排行
 * 获取指定年份的签到次数排名
 *
 * @param year - 年份
 * @param [topN] - 返回前N名，默认10
 * @returns - 年度签到排行数据
 */
export const getYearlyRanking = (year, topN = 10) => {
	const startTime = `${year}-01-01T00:00:00`
	const endTime = `${year}-12-31T23:59:59`
	return getTopStudentsByTimeRange(startTime, endTime, topN)
}

/**
 * 获取最近7天签到排行
 * 获取过去7天（包括今天）的签到次数排名
 *
 * @param [topN] - 返回前N名，默认10
 * @returns - 最近7天签到排行数据
 */
export const getLast7DaysRanking = (topN = 10) => {
	const endDate = new Date()
	const startDate = new Date(endDate.getTime() - 6 * 24 * 60 * 60 * 1000)

	const startTime = `${startDate.toISOString().split('T')[0]}T00:00:00`
	const endTime = `${endDate.toISOString().split('T')[0]}T23:59:59`

	return getTopStudentsByTimeRange(startTime, endTime, topN)
}

/**
 * 获取最近30天签到排行
 * 获取过去30天（包括今天）的签到次数排名
 *
 * @param [topN] - 返回前N名，默认10
 * @returns - 最近30天签到排行数据
 */
export const getLast30DaysRanking = (topN = 10) => {
	const endDate = new Date()
	const startDate = new Date(endDate.getTime() - 29 * 24 * 60 * 60 * 1000)

	const startTime = `${startDate.toISOString().split('T')[0]}T00:00:00`
	const endTime = `${endDate.toISOString().split('T')[0]}T23:59:59`

	return getTopStudentsByTimeRange(startTime, endTime, topN)
}

/**
 * 获取自定义时间范围签到排行
 * 获取指定日期范围内的签到次数排名
 *
 * @param startDate - 开始日期（格式：YYYY-MM-DD）
 * @param endDate - 结束日期（格式：YYYY-MM-DD）
 * @param [topN] - 返回前N名，默认10
 * @returns - 自定义时间范围签到排行数据
 */
export const getCustomRangeRanking = (startDate, endDate, topN = 10) => {
	const startTime = `${startDate}T00:00:00`
	const endTime = `${endDate}T23:59:59`
	return getTopStudentsByTimeRange(startTime, endTime, topN)
}

/**
 * 获取时间范围内的每日考勤统计
 * 批量获取指定时间范围内每天的考勤签到数量
 * 如果开始时间早于项目启动日期，则从项目启动日期开始统计
 *
 * @param startTime - 开始时间（ISO格式字符串）
 * @param endTime - 结束时间（ISO格式字符串）
 * @returns - 包含每日考勤统计的数组数据
 * @throws {Error} - 获取失败时抛出错误
 */
export const getDailyAttendanceCountInRange = async (startTime, endTime) => {
	try {
		// 项目启动日期，早于此日期的数据不统计
		const PROJECT_LAUNCH_DATE = new Date('2024-09-09T00:00:00')
		const startDate = new Date(startTime)
		const endDate = new Date(endTime)

		// 如果开始时间早于项目启动日期，则从项目启动日期开始
		const actualStartDate = startDate < PROJECT_LAUNCH_DATE ? PROJECT_LAUNCH_DATE : startDate
		// 计算需要查询的天数（包含开始和结束日期）
		const daysDiff = Math.ceil((endDate - actualStartDate) / (1000 * 60 * 60 * 24)) + 1

		// 创建所有日期的请求数组
		const requests = []
		for (let i = 0; i < daysDiff; i++) {
			const currentDate = new Date(actualStartDate)
			currentDate.setDate(actualStartDate.getDate() + i)
			const [dateStr] = currentDate.toISOString().split('T')

			// 为每一天创建请求，失败时返回0
			requests.push(
				api.get('/api/v1/attendance/daily-count', {
					params: {
						data: dateStr
					}
				}).then(response => {
					// 如果响应成功，返回日期和签到数量
					if (response.data && response.data.code === 200) {
						return {
							date: dateStr,
							attendanceCount: response.data.data?.count || 0
						}
					}
					// 响应失败，返回0
					return {
						date: dateStr,
						attendanceCount: 0
					}
				}).catch(() => ({
					// 请求失败，返回0
					date: dateStr,
					attendanceCount: 0
				}))
			)
		}

		// 并行执行所有请求
		const results = await Promise.all(requests)

		return {
			code: 200,
			message: '获取成功',
			data: results
		}
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			if (status === 400) {
				throw new Error('时间参数错误')
			} else if (status >= 500) {
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '获取签到数据失败')
			}
		} else {
			throw new Error('网络错误，获取签到数据失败')
		}
	}
}

/**
 * 获取签到次数总排名
 * 获取所有学生的签到次数排名
 *
 * @param [top] - 返回前N名，默认50
 * @returns - 签到次数排名数据
 * @throws {Error} - 获取失败时抛出错误
 */
export const getAttendanceTopRanking = async (top = 50) => {
	try {
		const response = await api.get('/api/v1/attendance/top-ranking', {
			params: { top }
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			if (status === 400) {
				throw new Error(error.response.data?.message || '获取签到次数排名失败')
			} else if (status >= 500) {
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '获取签到次数排名失败')
			}
		} else {
			throw new Error('网络错误，获取签到次数排名失败')
		}
	}
}

