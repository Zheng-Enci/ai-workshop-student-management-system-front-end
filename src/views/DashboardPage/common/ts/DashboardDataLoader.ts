/**
 * 仪表盘数据加载器
 * 整合所有数据获取逻辑，提供统一的数据加载接口
 *
 * @module DashboardDataLoader
 * @description 负责从后端获取仪表盘所需的所有数据，包括：
 * - 年级分布统计
 * - 专业分布统计
 * - 学生总数
 * - 月度/今日签到数据
 * - 排行榜数据（支持多种时间范围）
 * - 学生等级统计
 */

// ======================== API 接口导入 ========================
import AttendanceApi from '@/api/ts/AttendanceApi'
import StudentApi from '@/api/ts/StudentApi'

// ======================== 工具函数 ========================
/**
 * 获取指定年月的法定节假日列表
 * @param year - 年份（如2024）
 * @param month - 月份（0-11，对应1-12月）
 * @returns 节假日日期数组（格式：YYYY-MM-DD）
 */
const getHolidaysForMonth = (year: number, month: number): string[] => {
	const holidays: string[] = []

	const monthHolidays: Record<number, string[]> = {
		0: [`${year}-01-01`],
		1: [`${year}-02-10`, `${year}-02-11`, `${year}-02-12`, `${year}-02-13`, `${year}-02-14`, `${year}-02-15`, `${year}-02-16`, `${year}-02-17`],
		3: [`${year}-04-05`, `${year}-04-06`, `${year}-04-07`],
		4: [`${year}-05-01`, `${year}-05-02`, `${year}-05-03`],
		8: [`${year}-09-15`, `${year}-09-16`, `${year}-09-17`],
		9: [`${year}-10-01`, `${year}-10-02`, `${year}-10-03`, `${year}-10-04`, `${year}-10-05`, `${year}-10-06`, `${year}-10-07`]
	}

	if (monthHolidays[month]) {
		holidays.push(...monthHolidays[month])
	}

	return holidays
}

/**
 * 计算月度日均签到数（排除周末和节假日）
 * @param monthlyCount - 月度签到总人数
 * @returns 日均签到数（保留2位小数）
 */
const calculateDailyAvgAttendance = (monthlyCount: number): number => {
	const now = new Date()
	const currentDay = now.getDate()
	const year = now.getFullYear()
	const month = now.getMonth()

	const holidays = getHolidaysForMonth(year, month)

	let workingDays = 0
	const startOfMonth = new Date(year, month, 1)
	const endOfMonth = new Date(year, month, currentDay)

	let currentDate = new Date(startOfMonth)
	while (currentDate <= endOfMonth) {
		const dayOfWeek = currentDate.getDay()
		const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6)
		const dateString = currentDate.toLocaleDateString('en-CA')
		const isHoliday = holidays.includes(dateString)

		if (!isWeekend && !isHoliday) {
			workingDays += 1
		}

		const nextDate = new Date(currentDate)
		nextDate.setDate(nextDate.getDate() + 1)
		currentDate = nextDate
	}

	if (workingDays === 0) {
		return 0
	}

	return parseFloat((monthlyCount / workingDays).toFixed(2))
}

/**
 * 获取本周周一的日期（ISO格式：YYYY-MM-DD）
 * @returns 本周周一日期
 */
const getCurrentWeekStart = (): string => {
	const now = new Date()
	const dayOfWeek = now.getDay()
	const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
	const monday = new Date(now.setDate(diff))
	return monday.toLocaleDateString('en-CA')
}

/**
 * 将等级编码转换为等级名称
 * @param levelCode - 等级编码（0-3）
 * @returns 等级名称
 */
const getLevelName = (levelCode: number): string => {
	const levelMap: Record<number, string> = {
		0: '社团成员',
		1: '普通成员',
		2: '核心成员',
		3: '管理员'
	}
	return levelMap[levelCode] || '社团成员'
}

/**
 * 计算社团成员和坊内成员数量
 * @param totalStudents - 学生总数
 * @param levelStats - 等级分布统计
 * @returns 包含坊内成员数和社团成员数的对象
 */
const calculateClubMembers = (totalStudents: number, levelStats: { admin: number; core: number; normal: number }): { workshopMembersCount: number; clubMembers: number } => {
	const workshopMembersCount = levelStats.admin + levelStats.core + levelStats.normal
	const clubMembers = totalStudents - workshopMembersCount
	return { workshopMembersCount, clubMembers }
}

/**
 * 计算月度签到率
 * @param monthlyCount - 月度签到总人数
 * @param levelStats - 等级分布统计
 * @returns 签到率（保留1位小数，百分比）
 */
const calculateAttendanceRate = (monthlyCount: number, levelStats: { admin: number; core: number; normal: number }): number => {
	const workshopCount = levelStats.admin + levelStats.core + levelStats.normal

	if (workshopCount === 0) {
		return 0
	}

	return parseFloat(((monthlyCount / workshopCount) * 100).toFixed(1))
}

// ======================== 数据加载器类 ========================
class DashboardDataLoader {
	private topStudentsRef: any
	private totalStudentsRef: any
	private todayCountRef: any
	private dailyAvgAttendanceRef: any
	private attendanceRateRef: any
	private monthlyAttendanceCountRef: any
	private levelStatsRef: any
	private selectedTimeRangeRef: any
	private clubMembersRef: any
	private workshopMembersCountRef: any

	private gradeData: Array<{ grade: number; count: number }> | null = null
	private majorData: Array<{ major: string; count: number }> | null = null

	constructor(
		topStudentsRef: any,
		totalStudentsRef: any,
		todayCountRef: any,
		dailyAvgAttendanceRef: any,
		attendanceRateRef: any,
		monthlyAttendanceCountRef: any,
		levelStatsRef: any,
		selectedTimeRangeRef: any,
		clubMembersRef: any,
		workshopMembersCountRef: any
	) {
		this.topStudentsRef = topStudentsRef
		this.totalStudentsRef = totalStudentsRef
		this.todayCountRef = todayCountRef
		this.dailyAvgAttendanceRef = dailyAvgAttendanceRef
		this.attendanceRateRef = attendanceRateRef
		this.monthlyAttendanceCountRef = monthlyAttendanceCountRef
		this.levelStatsRef = levelStatsRef
		this.selectedTimeRangeRef = selectedTimeRangeRef
		this.clubMembersRef = clubMembersRef
		this.workshopMembersCountRef = workshopMembersCountRef
	}

	/**
	 * 加载年级和专业统计数据
	 * @private
	 * @returns 包含年级和专业数据的对象
	 */
	private async loadGradeAndMajorData(): Promise<void> {
		try {
			const [gradeData, majorData] = await Promise.all([
				StudentApi.getGradeStatistics(),
				StudentApi.getMajorStatistics()
			])

			this.gradeData = gradeData.map((item: any) => ({
				grade: item.grade,
				count: item.count
			}))

			this.majorData = majorData.map((item: any) => ({
				major: item.major,
				count: item.count
			}))
		} catch (error: any) {
			throw new Error(`获取年级和专业数据失败：${error.message}`)
		}
	}

	/**
	 * 加载排行榜数据
	 * @param selectedTopN - 排行榜展示数量
	 * @returns 排行榜数据
	 */
	public async loadRankingData(selectedTopN: number = 16): Promise<void> {
		try {
			let data

			switch (this.selectedTimeRangeRef.value) {
				case 'week': {
					const weekStart = getCurrentWeekStart()
					data = await AttendanceApi.getWeeklyRanking(weekStart, selectedTopN)
					break
				}
				case 'month': {
					const now = new Date()
					data = await AttendanceApi.getMonthlyRanking(now.getFullYear(), now.getMonth() + 1, selectedTopN)
					break
				}
				case 'today': {
					const today = new Date().toLocaleDateString('en-CA')
					const startTime = `${today}T00:00:00`
					const endTime = `${today}T23:59:59`
					data = await AttendanceApi.getTopStudentsByTimeRange(startTime, endTime, selectedTopN)
					break
				}
				case 'last7days':
					data = await AttendanceApi.getLast7DaysRanking(selectedTopN)
					break
				case 'last30days': {
					data = await AttendanceApi.getLast30DaysRanking(selectedTopN)
					break
				}
				case 'all': {
					const PROJECT_LAUNCH_DATE = new Date('2024-09-09T00:00:00')
					const now = new Date()
					const startDate = PROJECT_LAUNCH_DATE.toLocaleDateString('en-CA')
					const endDate = now.toLocaleDateString('en-CA')
					const startTime = `${startDate}T00:00:00`
					const endTime = `${endDate}T23:59:59`
					data = await AttendanceApi.getTopStudentsByTimeRange(startTime, endTime, selectedTopN)
					break
				}
				default:
					data = await AttendanceApi.getCurrentMonthTop10Students()
					break
			}

			const processedData = data.map((item: any) => ({
				name: item.name,
				grade: item.grade,
				major: item.major,
				attendanceCount: item.count,
				levelName: getLevelName(item.studentLevel ?? 0)
			}))

			this.topStudentsRef.value = processedData
		} catch (error: any) {
			throw new Error(`获取排行榜数据失败：${error.message}`)
		}
	}

	/**
	 * 加载排行榜数据（异步版本，用于并行加载）
	 * @returns 排行榜数据数组
	 */
	private async loadRankingDataAsync(): Promise<any[]> {
		try {
			let data

			switch (this.selectedTimeRangeRef.value) {
				case 'week': {
					const weekStart = getCurrentWeekStart()
					data = await AttendanceApi.getWeeklyRanking(weekStart, 16)
					break
				}
				case 'month': {
					const now = new Date()
					data = await AttendanceApi.getMonthlyRanking(now.getFullYear(), now.getMonth() + 1, 16)
					break
				}
				case 'today': {
					const today = new Date().toLocaleDateString('en-CA')
					const startTime = `${today}T00:00:00`
					const endTime = `${today}T23:59:59`
					data = await AttendanceApi.getTopStudentsByTimeRange(startTime, endTime, 16)
					break
				}
				case 'last7days':
					data = await AttendanceApi.getLast7DaysRanking(16)
					break
				case 'last30days':
					data = await AttendanceApi.getLast30DaysRanking(16)
					break
				case 'all': {
					const PROJECT_LAUNCH_DATE = new Date('2024-09-09T00:00:00')
					const now = new Date()
					const startDate = PROJECT_LAUNCH_DATE.toLocaleDateString('en-CA')
					const endDate = now.toLocaleDateString('en-CA')
					const startTime = `${startDate}T00:00:00`
					const endTime = `${endDate}T23:59:59`
					data = await AttendanceApi.getTopStudentsByTimeRange(startTime, endTime, 16)
					break
				}
				default:
					data = await AttendanceApi.getCurrentMonthTop10Students()
					break
			}

			const processedData = data.map((item: any) => ({
				name: item.name,
				grade: item.grade,
				major: item.major,
				attendanceCount: item.count,
				levelName: getLevelName(item.studentLevel ?? 0)
			}))

			this.topStudentsRef.value = processedData
			return processedData
		} catch (error) {
			console.error('获取排行榜数据失败:', error)
			return []
		}
	}

	/**
	 * 加载学生等级统计
	 * @returns 等级统计数据
	 */
	public async loadLevelStats(): Promise<void> {
		try {
			const [adminCount, coreCount, normalCount] = await Promise.all([
				StudentApi.getStudentCountByLevel(3),
				StudentApi.getStudentCountByLevel(2),
				StudentApi.getStudentCountByLevel(1)
			])

			this.levelStatsRef.value.admin = adminCount
			this.levelStatsRef.value.core = coreCount
			this.levelStatsRef.value.normal = normalCount
		} catch (error) {
			throw new Error('获取等级统计失败')
		}
	}

	/**
	 * 加载页面核心数据（主入口）
	 * 并行加载：年级统计、专业统计、学生总数、月度签到、今日签到、排行榜数据
	 * @returns 包含所有加载数据的对象
	 */
	public async loadData(): Promise<{
		gradeData: any
		majorData: any
		totalData: any
		monthlyData: any
		dailyData: any
	}> {
		try {
			const [gradeData, majorData, totalCount, monthlyCount, todayCount, rankingData] = await Promise.all([
				StudentApi.getGradeStatistics(),
				StudentApi.getMajorStatistics(),
				StudentApi.getTotalStudentCount(),
				AttendanceApi.getMonthlyAttendanceCount(),
				AttendanceApi.getTodayAttendanceCount(),
				this.loadRankingDataAsync()
			])

			await this.loadLevelStats()

			this.gradeData = gradeData.map((item: any) => ({
				grade: item.grade,
				count: item.count
			}))

			this.majorData = majorData.map((item: any) => ({
				major: item.major,
				count: item.count
			}))

			this.totalStudentsRef.value = totalCount

			const dailyAvg = calculateDailyAvgAttendance(monthlyCount)
			this.dailyAvgAttendanceRef.value = dailyAvg
			this.monthlyAttendanceCountRef.value = monthlyCount

			this.todayCountRef.value = todayCount

			this.updateClubMembers()

			return {
				gradeData: { code: 200, data: gradeData },
				majorData: { code: 200, data: majorData },
				totalData: { code: 200, data: { count: totalCount } },
				monthlyData: { code: 200, data: { count: monthlyCount } },
				dailyData: { code: 200, data: todayCount }
			}
		} catch (error: any) {
			throw new Error(`数据加载失败：${error.message}`)
		}
	}

	/**
	 * 更新签到率
	 */
	public updateAttendanceRate(): void {
		if (this.monthlyAttendanceCountRef.value > 0) {
			const rate = calculateAttendanceRate(
				this.monthlyAttendanceCountRef.value,
				this.levelStatsRef.value
			)
			this.attendanceRateRef.value = rate
		}
	}

	/**
	 * 更新社团成员和坊内成员数量
	 */
	public updateClubMembers(): void {
		const { workshopMembersCount, clubMembers } = calculateClubMembers(
			this.totalStudentsRef.value,
			this.levelStatsRef.value
		)
		this.workshopMembersCountRef.value = workshopMembersCount
		this.clubMembersRef.value = clubMembers
	}

	/**
	 * 保存用户偏好设置
	 * @param preferences - 用户偏好设置对象
	 */
	public saveUserPreferences(preferences: { timeRange: string }): void {
		localStorage.setItem('dashboardPreferences', JSON.stringify(preferences))
	}

	/**
	 * 加载用户偏好设置
	 * @returns 用户偏好设置对象
	 */
	public loadUserPreferences(): { timeRange: string } {
		const saved = localStorage.getItem('dashboardPreferences')
		if (saved) {
			try {
				const preferences = JSON.parse(saved)
				return { timeRange: preferences.timeRange || 'week' }
			} catch (error) {
				return { timeRange: 'week' }
			}
		}
		return { timeRange: 'week' }
	}

	/**
	 * 获取年级分布数据
	 * @returns 年级分布数据
	 */
	public getGradeData(): Array<{ grade: number; count: number }> {
		return this.gradeData || []
	}

	/**
	 * 获取专业分布数据
	 * @returns 专业分布数据
	 */
	public getMajorData(): Array<{ major: string; count: number }> {
		return this.majorData || []
	}

	/**
	 * 获取排行榜数据
	 * @returns 排行榜数据
	 */
	public getRankingData(): Array<{ name: string; grade: number; major: string; attendanceCount: number; levelName: string }> {
		return this.topStudentsRef.value || []
	}
}

export default DashboardDataLoader
