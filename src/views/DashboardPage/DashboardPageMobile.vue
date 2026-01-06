<script setup>
/**
 * Dashboard 移动端主组件
 *
 * @description 提供系统功能导航,展示统计数据(移动端)
 * @component DashboardPageMobile
 */
// ECharts 按需引入
import { ArrowLeft, Setting, Star, Avatar, User } from '@element-plus/icons-vue'
import { PieChart, BarChart } from 'echarts/charts'
import {
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ElMessage, ElButton, ElIcon, ElRadioGroup, ElRadioButton } from 'element-plus'
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-radio-group.css'
import 'element-plus/theme-chalk/el-radio-button.css'
import { useRouter } from 'vue-router'
import 'echarts-wordcloud'

// 注册需要的组件
echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	PieChart,
	BarChart,
	CanvasRenderer
])
import {
	getMonthlyAttendanceCount,
	getCurrentMonthTop10Students,
	getWeeklyRanking,
	getMonthlyRanking,
	getYearlyRanking,
	getTopStudentsByTimeRange,
	getLast7DaysRanking,
	getLast30DaysRanking
} from '@/api/attendance'
import AttendanceApi from '@/api/AttendanceApi'
import {
	getGradeStatistics,
	getMajorStatistics,
	getTotalStudentCount,
	getStudentCountByLevel
} from '@/api/student'
import { useThemeStore } from '@/stores/theme'

// ===================== 全局实例初始化 =====================
/**
 * 路由实例
 * @type {Router}
 * @description 用于页面跳转和路由导航
 */
const router = useRouter()
/**
 * 主题状态仓库实例
 * @type {Store}
 * @description 管理应用主题切换(亮色/暗色模式)
 */
const themeStore = useThemeStore()

// ===================== 响应式变量定义区 =====================
/**
 * 今日考勤人数
 * @type {Ref<number>}
 * @description 当天签到的人数统计
 */
const todayAttendance = ref(0)
/**
 * 日均考勤人数
 * @type {Ref<number>}
 * @description 平均每日签到人数统计
 */
const dailyAvgAttendance = ref(0)
/**
 * 考勤率
 * @type {Ref<number>}
 * @description 考勤率百分比(0-100)
 */
const attendanceRate = ref(0)
/**
 * 月度考勤总数
 * @type {Ref<number>}
 * @description 当前月份的累计签到次数
 */
const monthlyAttendanceCount = ref(0)
/**
 * 工坊成员总数
 * @type {Ref<number>}
 * @description AI坊总成员数量
 */
const workshopMembersCount = ref(0)
/**
 * 工坊成员数(备用字段)
 * @type {Ref<number>}
 * @description 预留字段,用于特殊统计需求
 */
const workshopMembers = ref(0)
/**
 * 等级统计对象
 * @type {Ref<Object>}
 * @description 按等级分类的成员数量统计
 * @property {number} admin - 管理员数量
 * @property {number} core - 核心成员数量
 * @property {number} normal - 普通成员数量
 */
const levelStats = ref({
	admin: 0,
	core: 0,
	normal: 0
})
/**
 * 社团成员数量
 * @type {Ref<number>}
 * @description 社团成员等级的人数统计
 */
const clubMembers = ref(0)

/**
 * 选中的时间范围
 * @type {Ref<string>}
 * @description 排行榜的时间范围选择('week'|'month'|'year')
 */
const selectedTimeRange = ref('week')
/**
 * 排行榜显示数量
 * @type {number}
 * @description 排行榜显示前N名学生的数量
 */
const selectedTopN = 16
/**
 * 排行榜数据
 * @type {Ref<Array>}
 * @description 存储排行榜的学生数据列表
 */
const rankingData = ref([])
/**
 * 考勤图表DOM引用
 * @type {Ref<HTMLElement|null>}
 * @description 考勤统计图表的DOM元素引用
 */
const attendanceChart = ref(null)
/**
 * 年级统计图表DOM引用
 * @type {Ref<HTMLElement|null>}
 * @description 年级分布图表的DOM元素引用
 */
const gradeChart = ref(null)
/**
 * 专业统计图表DOM引用
 * @type {Ref<HTMLElement|null>}
 * @description 专业分布图表的DOM元素引用
 */
const majorChart = ref(null)
/**
 * 考勤图表实例
 * @type {EChartsInstance|null}
 * @description ECharts考勤统计图表实例
 */
let chartInstance = null
/**
 * 年级图表实例
 * @type {EChartsInstance|null}
 * @description ECharts年级分布图表实例
 */
let gradeChartInstance = null
/**
 * 专业图表实例
 * @type {EChartsInstance|null}
 * @description ECharts专业分布图表实例
 */
let majorChartInstance = null

// ===================== 工具函数区 =====================
/**
 * 保存用户偏好设置
 * @function saveUserPreferences
 * @description 将用户选择的时间范围等偏好设置保存到本地存储
 */

// ===================== 页面操作方法区 =====================
/**
 * 返回上一页
 * @function goBack
 * @description 点击返回按钮时触发,返回浏览器历史记录的上一页
 */
const goBack = () => {
	router.go(-1)
}

/**
 * 切换主题
 * @function toggleTheme
 * @description 切换应用的明暗主题模式
 */
const toggleTheme = () => {
	themeStore.toggleTheme()
}

/**
 * 保存用户偏好设置
 * @function saveUserPreferences
 * @description 将用户选择的时间范围等偏好设置保存到本地存储
 */
const saveUserPreferences = () => {
	const preferences = {
		selectedTimeRange: selectedTimeRange.value
	}
	localStorage.setItem('dashboardPreferences', JSON.stringify(preferences))
}

/**
 * 加载用户偏好设置
 * @function loadUserPreferences
 * @description 从本地存储加载用户之前选择的时间范围等偏好设置
 */
const loadUserPreferences = () => {
	const saved = localStorage.getItem('dashboardPreferences')
	if (saved) {
		try {
			const preferences = JSON.parse(saved)
			selectedTimeRange.value = preferences.selectedTimeRange || 'week'
		} catch (error) {
			selectedTimeRange.value = 'week'
		}
	}
}

/**
 * 获取指定月份的节假日
 * @function getHolidaysForMonth
 * @param {number} year - 年份
 * @param {number} month - 月份(0-11)
 * @returns {Array<string>} 指定月份的节假日日期数组
 * @description 根据年份和月份获取该月的法定节假日日期
 */
const getHolidaysForMonth = (year, month) => {
	const holidays = []

	const monthHolidays = {
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
 * 计算日均考勤人数
 * @function calculateDailyAvgAttendance
 * @param {number} monthlyCount - 月度考勤总数
 * @returns {number} 日均考勤人数
 * @description 计算工作日的日均考勤人数,排除周末和法定节假日
 */
const calculateDailyAvgAttendance = monthlyCount => {
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
		const [dateString] = currentDate.toISOString().split('T')
		const isHoliday = holidays.includes(dateString)

		if (!isWeekend && !isHoliday) {
			workingDays += 1
		}

		currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
	}

	if (workingDays === 0) {
		return 0
	}

	return parseFloat((monthlyCount / workingDays).toFixed(2))
}

/**
 * 计算社团成员数量
 * @function calculateClubMembers
 * @description 计算社团成员数量(总成员数减去坊内成员数)
 */
const calculateClubMembers = () => {
	clubMembers.value = workshopMembers.value - levelStats.value.admin - levelStats.value.core - levelStats.value.normal
	// 坊内成员人数 = 管理员 + 核心成员 + 普通成员
	workshopMembersCount.value = levelStats.value.admin + levelStats.value.core + levelStats.value.normal
}

/**
 * 计算考勤率
 * @function calculateAttendanceRate
 * @param {number} monthlyCount - 月度考勤总数
 * @returns {number} 考勤率百分比
 * @description 计算月度考勤率,基于坊内成员总数计算
 */
const calculateAttendanceRate = monthlyCount => {
	// 坊内成员总人数 = 管理员 + 核心成员 + 普通成员
	const membersCount = levelStats.value.admin + levelStats.value.core + levelStats.value.normal

	if (membersCount === 0) {
		return 0
	}

	return parseFloat(((monthlyCount / membersCount) * 100).toFixed(1))
}

/**
 * 加载等级统计信息
 * @function loadLevelStats
 * @async
 * @description 异步加载不同等级(管理员、核心成员、普通成员)的学生数量统计
 */
const loadLevelStats = async () => {
	try {
		const [adminData, coreData, normalData] = await Promise.all([
			getStudentCountByLevel(3),
			getStudentCountByLevel(2),
			getStudentCountByLevel(1)
		])

		if (adminData.code === 200) {
			levelStats.value.admin = adminData.data
		}

		if (coreData.code === 200) {
			levelStats.value.core = coreData.data
		}

		if (normalData.code === 200) {
			levelStats.value.normal = normalData.data
		}

		// 计算社团成员数量
		calculateClubMembers()

		// 计算签到率
		if (monthlyAttendanceCount.value > 0) {
			const rate = calculateAttendanceRate(monthlyAttendanceCount.value)
			attendanceRate.value = rate
		}
	} catch (error) {
		ElMessage.error('获取等级统计失败')
	}
}

/**
 * 获取稳定颜色
 * @function getStableColor
 * @param {number} index - 颜色索引
 * @returns {string} 对应索引的颜色值（十六进制格式）
 * @description 根据索引获取稳定的颜色值,用于图表配色。使用模运算确保颜色循环使用。
 * @example
 * ```javascript
 * // 获取第一个颜色
 * const color1 = getStableColor(0); // '#667eea'
 * // 获取第17个颜色（循环到第1个）
 * const color17 = getStableColor(16); // '#667eea'
 * ```
 */
const getStableColor = index => {
	const colors = [
		'#667eea', '#764ba2', '#f093fb', '#f5576c',
		'#4facfe', '#00f2fe', '#a8edea', '#fed6e3',
		'#ff9a9e', '#fecfef', '#fecfef', '#a8edea',
		'#d299c2', '#fad0c4', '#ffd1ff', '#a8e6cf'
	]
	return colors[index % colors.length]
}

/**
 * 获取暗色模式下的稳定颜色
 * @function getDarkStableColor
 * @param {number} index - 颜色索引
 * @returns {string} 对应索引的暗色模式颜色值（十六进制格式）
 * @description 根据索引获取暗色模式下的稳定颜色值,用于图表配色。使用模运算确保颜色循环使用。
 * @example
 * ```javascript
 * // 获取暗色模式下的第一个颜色
 * const darkColor1 = getDarkStableColor(0); // '#00d4ff'
 * // 获取暗色模式下的第17个颜色（循环到第1个）
 * const darkColor17 = getDarkStableColor(16); // '#00d4ff'
 * ```
 */
const getDarkStableColor = index => {
	const colors = [
		'#00d4ff', '#ff6b6b', '#4ecdc4', '#45b7d1',
		'#96ceb4', '#feca57', '#ff9ff3', '#54a0ff',
		'#5f27cd', '#00d2d3', '#ff9f43', '#10ac84',
		'#ee5a24', '#0984e3', '#6c5ce7', '#a29bfe'
	]
	return colors[index % colors.length]
}

/**
 * 初始化年级分布图表
 * @function initGradeChart
 * @param {Array} data - 年级统计数据
 * @description 初始化ECharts年级分布饼图,展示不同年级的学生人数分布
 */
const initGradeChart = data => {
	if (!gradeChart.value) { return }

	if (gradeChartInstance) {
		gradeChartInstance.dispose()
	}

	gradeChartInstance = echarts.init(gradeChart.value)

	const sortedData = [...data].sort((a, b) => a.grade - b.grade)
	const isDark = themeStore.isDarkMode

	const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim()

	const option = {
		backgroundColor: 'transparent',
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c} ({d}%)',
			backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
			borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
			textStyle: {
				color: textColor
			}
		},
		legend: {
			orient: 'horizontal',
			bottom: '5%',
			data: sortedData.map(item => `${item.grade}年级`),
			textStyle: {
				color: textColor,
				fontSize: 10
			}
		},
		series: [
			{
				name: '年级分布',
				type: 'pie',
				radius: ['30%', '60%'],
				center: ['50%', '45%'],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 8,
					borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : '#fff',
					borderWidth: 2
				},
				label: {
					show: false,
					position: 'center',
					color: textColor
				},
				emphasis: {
					label: {
						show: true,
						fontSize: '14',
						fontWeight: 'bold',
						color: textColor
					}
				},
				labelLine: {
					show: false
				},
				data: sortedData.map(item => ({
					value: item.count,
					name: `${item.grade}年级`
				}))
			}
		]
	}

	gradeChartInstance.setOption(option)

	setTimeout(() => {
		if (gradeChartInstance) {
			gradeChartInstance.resize()
		}
	}, 100)
}

/**
 * 初始化专业分布图表
 * @function initMajorChart
 * @param {Array} data - 专业统计数据
 * @description 初始化ECharts专业分布词云图,展示不同专业学生的人数分布
 */
const initMajorChart = data => {
	if (!majorChart.value) { return }

	if (majorChartInstance) {
		majorChartInstance.dispose()
	}

	majorChartInstance = echarts.init(majorChart.value)

	const sortedData = [...data].sort((a, b) => b.count - a.count)
	const isDark = themeStore.isDarkMode

	const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim()

	const wordCloudData = sortedData.map((item, index) => ({
		name: item.major,
		value: item.count,
		textStyle: {
			color: isDark ? getDarkStableColor(index) : getStableColor(index)
		}
	}))

	const option = {
		backgroundColor: 'transparent',
		tooltip: {
			trigger: 'item',
			formatter: '{b}: {c}人',
			backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
			borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
			textStyle: {
				color: textColor
			}
		},
		series: [
			{
				type: 'wordCloud',
				gridSize: 2,
				sizeRange: [12, 24],
				rotationRange: [-90, 90],
				shape: 'pentagon',
				width: '100%',
				height: '100%',
				drawOutOfBound: false,
				textStyle: {
					fontFamily: 'sans-serif',
					fontWeight: 'normal'
				},
				emphasis: {
					focus: 'self',
					textStyle: {
						textShadowBlur: 10,
						textShadowColor: '#333'
					}
				},
				data: wordCloudData
			}
		]
	}

	majorChartInstance.setOption(option)

	setTimeout(() => {
		if (majorChartInstance) {
			majorChartInstance.resize()
		}
	}, 100)
}

/**
 * 加载页面数据
 * @function loadData
 * @async
 * @description 异步加载页面所需的所有统计数据,包括年级分布、专业分布、总人数、考勤数据等
 * @returns {Promise<void>}
 * @throws {Error} 当任何数据加载失败时抛出错误
 * @example
 * ```javascript
 * // 调用加载数据函数
 * await loadData();
 * console.log('页面数据加载完成');
 * ```
 */
const loadData = async () => {
	try {
		const [
			gradeData,
			majorData,
			totalData,
			monthlyData,
			dailyData
		] = await Promise.all([
			getGradeStatistics(),
			getMajorStatistics(),
			getTotalStudentCount(),
			getMonthlyAttendanceCount(),
			AttendanceApi.getTodayAttendanceCount()
		])

		if (gradeData.code === 200 && gradeData.data) {
			await nextTick()
			initGradeChart(gradeData.data)
		}

		if (majorData.code === 200 && majorData.data) {
			await nextTick()
			initMajorChart(majorData.data)
		}

		if (totalData.code === 200 && totalData.data) {
			workshopMembers.value = totalData.data.count
		}

		if (monthlyData.code === 200 && monthlyData.data) {
			const dailyAvg = calculateDailyAvgAttendance(monthlyData.data.count)
			dailyAvgAttendance.value = dailyAvg

			// 保存月度数据，等levelStats加载完成后再计算签到率
			monthlyAttendanceCount.value = monthlyData.data.count
		}

		if (dailyData.code === 200 && dailyData.data != null) {
			todayAttendance.value = dailyData.data
		}

		await loadLevelStats()

		// 重新计算社团成员数量
		calculateClubMembers()
	} catch (error) {
		ElMessage.error(`数据加载失败: ${error.message || '未知错误'}`)
	}
}

/**
 * 根据等级码获取等级名称
 * @function getLevelName
 * @param {number} levelCode - 等级码(0-3)
 * @returns {string} 对应的等级名称
 * @description 根据学生等级码返回对应的等级名称。等级码与等级名称的映射关系：
 * - 0: 社团成员
 * - 1: 普通成员
 * - 2: 核心成员
 * - 3: 管理员
 * 对于未知的等级码，默认返回'社团成员'。
 * @example
 * ```javascript
 * // 获取管理员等级名称
 * const adminLevel = getLevelName(3); // '管理员'
 * // 获取普通成员等级名称
 * const normalLevel = getLevelName(1); // '普通成员'
 * // 获取未知等级码的默认值
 * const unknownLevel = getLevelName(5); // '社团成员'
 * ```
 */
const getLevelName = levelCode => {
	const levelMap = {
		0: '社团成员',
		1: '普通成员',
		2: '核心成员',
		3: '管理员'
	}
	return levelMap[levelCode] || '社团成员'
}

/**
 * 初始化考勤图表
 * @function initAttendanceChart
 * @param {Array} data - 考勤数据
 * @description 初始化ECharts考勤柱状图,展示学生考勤排名情况。
 * 该函数会先检查图表DOM引用是否存在，然后销毁已有的图表实例，重新初始化新的图表实例。
 * @param {Array} data - 考勤数据数组，每个元素包含name(学生姓名)、value(签到次数)等字段
 * @returns {void}
 * @example
 * ```javascript
 * // 初始化考勤图表
 * const chartData = [
 *   { name: '张三', value: 20 },
 *   { name: '李四', value: 18 },
 *   { name: '王五', value: 15 }
 * ];
 * initAttendanceChart(chartData);
 * ```
 */
const initAttendanceChart = data => {
	if (!attendanceChart.value) { return }

	if (chartInstance) {
		chartInstance.dispose()
	}

	chartInstance = echarts.init(attendanceChart.value)

	const chartData = data.map((item, index) => ({
		name: item.name,
		value: item.attendanceCount,
		itemStyle: {
			color: `hsl(${200 + index * 5}, 70%, 50%)`
		}
	}))

	const option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			data: chartData.map(item => item.name),
			axisLabel: {
				rotate: 45,
				fontSize: 10
			}
		},
		yAxis: {
			type: 'value',
			name: '签到次数'
		},
		series: [
			{
				name: '签到次数',
				type: 'bar',
				data: chartData,
				itemStyle: {
					borderRadius: [4, 4, 0, 0]
				}
			}
		]
	}

	chartInstance.setOption(option)
}

/**
 * 加载排行榜数据
 * @function loadRankingData
 * @async
 * @description 异步加载根据选定时间范围的排行榜数据,支持周、月、年、最近7天、最近30天、全部时间范围
 */
const loadRankingData = async () => {
	try {
		let response

		switch (selectedTimeRange.value) {
			/**
			 * 本周时间范围处理
			 * @case 'week'
			 * @description 计算本周的开始日期（周一），并获取本周的排行榜数据
			 * @example 2023-12-18（周一）到2023-12-24（周日）
			 */
			case 'week': {
				const now = new Date()
				const dayOfWeek = now.getDay()
				const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
				const monday = new Date(now.setDate(diff))
				const [weekStart] = monday.toISOString().split('T')
				response = await getWeeklyRanking(weekStart, selectedTopN)
				break
			}
			/**
			 * 本月时间范围处理
			 * @case 'month'
			 * @description 获取当前年份和月份，并获取本月的排行榜数据
			 * @example 2023年12月的完整数据
			 */
			case 'month': {
				const currentDate = new Date()
				const currentYear = currentDate.getFullYear()
				const currentMonth = currentDate.getMonth() + 1
				response = await getMonthlyRanking(currentYear, currentMonth, selectedTopN)
				break
			}
			/**
			 * 本年时间范围处理
			 * @case 'year'
			 * @description 获取当前年份，并获取本年的排行榜数据
			 * @example 2023年的完整数据
			 */
			case 'year':
				response = await getYearlyRanking(new Date().getFullYear(), selectedTopN)
				break
			/**
			 * 最近7天时间范围处理
			 * @case 'last7days'
			 * @description 获取最近7天的排行榜数据（包含当天）
			 * @example 当前日期为2023-12-24时，获取2023-12-18到2023-12-24的数据
			 */
			case 'last7days':
				response = await getLast7DaysRanking(selectedTopN)
				break
			/**
			 * 最近30天时间范围处理
			 * @case 'last30days'
			 * @description 获取最近30天的排行榜数据（包含当天）
			 * @example 当前日期为2023-12-24时，获取2023-11-25到2023-12-24的数据
			 */
			case 'last30days':
				response = await getLast30DaysRanking(selectedTopN)
				break
			/**
			 * 全部时间范围处理
			 * @case 'all'
			 * @description 获取从项目启动日期到当前日期的完整排行榜数据
			 * @example 从2024-09-09（项目启动）到当前日期的所有数据
			 */
			case 'all': {
				/**
				 * 项目启动日期
				 * @constant
				 * @type {Date}
				 * @description AI坊项目的正式启动日期，用于计算全时间段的排行榜数据范围
				 * @value '2024-09-09T00:00:00' 项目启动的具体日期时间
				 */
				const PROJECT_LAUNCH_DATE = new Date('2024-09-09T00:00:00')
				const now = new Date()
				const [startDate] = PROJECT_LAUNCH_DATE.toISOString().split('T')
				const [endDate] = now.toISOString().split('T')
				const startTime = `${startDate}T00:00:00`
				const endTime = `${endDate}T23:59:59`
				response = await getTopStudentsByTimeRange(startTime, endTime, selectedTopN)
				break
			}
			/**
			 * 默认时间范围处理
			 * @case default
			 * @description 当没有匹配到指定的时间范围时，默认获取当月的排行榜数据
			 * @example 当前月份的前10名学生数据
			 */
			default:
				response = await getCurrentMonthTop10Students()
				break
		}

		if (response.code === 200) {
			const { data } = response
			const processedData = data.map(item => ({
				name: item.studentName,
				grade: item.studentGrade,
				major: item.studentMajor,
				attendanceCount: item.attendanceCount,
				levelName: getLevelName(item.studentLevel)
			}))

			rankingData.value = processedData
			saveUserPreferences()
			await nextTick()
			initAttendanceChart(processedData)
		} else {
			ElMessage.error('获取排行榜数据失败')
		}
	} catch (error) {
		ElMessage.error(`排行榜数据加载失败: ${error.message || '未知错误'}`)
	}
}


/**
 * 处理窗口大小调整事件
 * @function handleResize
 * @description 当窗口大小发生变化时,重新调整所有图表的尺寸以适应新窗口大小
 */
const handleResize = () => {
	if (chartInstance) {
		chartInstance.resize()
	}
	if (gradeChartInstance) {
		gradeChartInstance.resize()
	}
	if (majorChartInstance) {
		majorChartInstance.resize()
	}
}

/**
 * 监听主题变化
 * @description 当主题模式发生变化时,重新加载数据以更新图表颜色
 */
watch(() => themeStore.isDarkMode, () => {
	setTimeout(() => {
		loadData()
	}, 100)
})

/**
 * 组件挂载生命周期钩子
 * @description 组件挂载后初始化主题、加载用户偏好、加载数据和排行榜
 */
onMounted(async () => {
	try {
		themeStore.initTheme()
		loadUserPreferences()
		await loadData()
		await loadRankingData()
		window.addEventListener('resize', handleResize)
	} catch (error) {
		ElMessage.error(`页面初始化失败: ${error.message || '未知错误'}`)
	}
})

/**
 * 组件卸载生命周期钩子
 * @description 组件卸载前销毁图表实例并移除事件监听器
 */
onUnmounted(() => {
	if (chartInstance) {
		chartInstance.dispose()
	}
	if (gradeChartInstance) {
		gradeChartInstance.dispose()
	}
	if (majorChartInstance) {
		majorChartInstance.dispose()
	}
	window.removeEventListener('resize', handleResize)
})
</script>

<!-- Dashboard 移动端页面模板 -->
<template>
	<!-- 主容器 -->
	<!-- @description Dashboard移动端页面的根容器，包含所有页面内容 -->
	<!-- @class dashboard-page-mobile 页面主容器类 -->
	<div class="dashboard-page-mobile">
		<!-- 移动端头部区域 -->
		<!-- @description 页面顶部导航栏，包含返回按钮、AI坊图标和页面标题 -->
		<!-- @class mobile-header 移动端头部容器类 -->
		<div class="mobile-header">
			<!-- 左侧头部内容 -->
			<!-- @description 头部左侧区域，包含返回按钮和AI坊图标 -->
			<!-- @class header-left 头部左侧容器类 -->
			<div class="header-left">
				<!-- 返回按钮 -->
				<!-- @description 返回上一页的按钮，点击触发goBack函数 -->
				<!-- @component el-button 按钮组件 -->
				<!-- @class back-btn 返回按钮样式类 -->
				<!-- @event click 点击事件，触发goBack函数 -->
				<el-button type="text" class="back-btn" @click="goBack">
					<!-- 返回图标 -->
					<!-- @component el-icon 图标容器 -->
					<!-- @icon arrow-left 返回箭头图标 -->
					<el-icon><arrow-left /></el-icon>
				</el-button>
				<!-- AI坊图标 -->
				<!-- @description AI坊的Logo图标，点击可切换主题 -->
				<!-- @src @/assets/AiWorkShop_icon.png 图标资源路径 -->
				<!-- @alt AI坊 图标替代文本 -->
				<!-- @class logo 图标样式类 -->
				<!-- @event click 点击事件，触发toggleTheme函数 -->
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊"
					class="logo"
					@click="toggleTheme"/>
			</div>
			<!-- 页面标题 -->
			<!-- @description 页面的主标题，显示"数据看板" -->
			<!-- @class header-title 标题样式类 -->
			<div class="header-title">数据看板</div>
		</div>

		<!-- 移动端内容区域 -->
		<!-- @description 页面的主要内容区域，包含所有统计卡片、图表和排行榜 -->
		<!-- @class mobile-content 移动端内容容器类 -->
		<div class="mobile-content">
			<!-- 统计数据网格 -->
			<!-- @description 展示核心统计数据的网格布局，包含今日签到总人次、本月签到总人数和坊内成员人数 -->
			<!-- @class stats-grid 统计数据网格容器类，使用响应式网格布局 -->
			<div class="stats-grid">
				<!-- 今日签到统计卡片 -->
				<!-- @description 展示当天实际签到总人次的统计卡片，反映当日活跃度 -->
				<!-- @class stat-card 统计卡片样式类，提供统一的卡片样式 -->
				<div class="stat-card">
					<!-- 统计标签 -->
					<!-- @description 卡片的描述性标签，说明统计数据的含义 -->
					<!-- @class stat-label 统计标签样式类，定义标签的字体和颜色 -->
					<div class="stat-label">今日签到总人次</div>
					<!-- 统计数值 -->
					<!-- @description 显示具体的统计数值，使用响应式数据绑定 -->
					<!-- @class stat-value 统计数值样式类，定义数值的字体大小和颜色 -->
					<!-- @data todayAttendance 今日签到总人次的响应式数据，从后端API获取 -->
					<div class="stat-value">{{ todayAttendance }}人</div>
				</div>
				<!-- 本月签到统计卡片 -->
				<!-- @description 展示当月累计签到总人数的统计卡片，反映月度活跃度趋势 -->
				<!-- @class stat-card 统计卡片样式类，提供统一的卡片样式 -->
				<div class="stat-card">
					<!-- 统计标签 -->
					<!-- @description 卡片的描述性标签，说明统计数据的含义 -->
					<!-- @class stat-label 统计标签样式类，定义标签的字体和颜色 -->
					<div class="stat-label">本月签到总人数</div>
					<!-- 统计数值 -->
					<!-- @description 显示具体的统计数值，使用响应式数据绑定 -->
					<!-- @class stat-value 统计数值样式类，定义数值的字体大小和颜色 -->
					<!-- @data monthlyAttendanceCount 本月签到总人数的响应式数据，从后端API获取 -->
					<div class="stat-value">{{ monthlyAttendanceCount }}人</div>
				</div>
				<!-- 坊内成员统计卡片 -->
				<!-- @description 展示AI坊内成员（管理员+核心成员+普通成员）总人数的统计卡片 -->
				<!-- @class stat-card 统计卡片样式类，提供统一的卡片样式 -->
				<div class="stat-card">
					<!-- 统计标签 -->
					<!-- @description 卡片的描述性标签，说明统计数据的含义 -->
					<!-- @class stat-label 统计标签样式类，定义标签的字体和颜色 -->
					<div class="stat-label">坊内成员人数</div>
					<!-- 统计数值 -->
					<!-- @description 显示具体的统计数值，使用响应式数据绑定 -->
					<!-- @class stat-value 统计数值样式类，定义数值的字体大小和颜色 -->
					<!-- @data workshopMembersCount 坊内成员人数的响应式数据，通过calculateClubMembers函数计算得出 -->
					<div class="stat-value">{{ workshopMembersCount }}人</div>
				</div>
			</div>

			<!-- 等级统计移动端展示 -->
			<!-- @description 展示不同等级成员数量的统计区域，包括管理员、核心成员、普通成员和社团成员 -->
			<!-- @class level-stats-mobile 等级统计移动端容器类 -->
			<div class="level-stats-mobile">
				<!-- 管理员等级项 -->
				<!-- @description 展示管理员等级成员数量的统计项 -->
				<!-- @class level-item 等级项样式类 -->
				<!-- @class admin-level 管理员等级样式类 -->
				<div class="level-item admin-level">
					<!-- 设置图标 -->
					<!-- @component el-icon 图标容器 -->
					<!-- @icon setting 设置图标，代表管理员权限 -->
					<el-icon><setting /></el-icon>
					<!-- 等级信息区域 -->
					<!-- @class level-info 等级信息容器类 -->
					<div class="level-info">
						<!-- 等级标签 -->
						<!-- @class level-label 等级标签样式类 -->
						<span class="level-label">管理员</span>
						<!-- 等级数值 -->
						<!-- @class level-value 等级数值样式类 -->
						<!-- @data levelStats.admin 管理员数量的响应式数据 -->
						<span class="level-value">{{ levelStats.admin }}人</span>
					</div>
				</div>
				<!-- 核心成员等级项 -->
				<!-- @description 展示核心成员等级数量的统计项 -->
				<!-- @class level-item 等级项样式类 -->
				<!-- @class core-level 核心成员等级样式类 -->
				<div class="level-item core-level">
					<!-- 星星图标 -->
					<!-- @component el-icon 图标容器 -->
					<!-- @icon star 星星图标，代表核心成员身份 -->
					<el-icon><star /></el-icon>
					<!-- 等级信息区域 -->
					<!-- @class level-info 等级信息容器类 -->
					<div class="level-info">
						<!-- 等级标签 -->
						<!-- @class level-label 等级标签样式类 -->
						<span class="level-label">核心成员</span>
						<!-- 等级数值 -->
						<!-- @class level-value 等级数值样式类 -->
						<!-- @data levelStats.core 核心成员数量的响应式数据 -->
						<span class="level-value">{{ levelStats.core }}人</span>
					</div>
				</div>
				<!-- 普通成员等级项 -->
				<!-- @description 展示普通成员等级数量的统计项 -->
				<!-- @class level-item 等级项样式类 -->
				<!-- @class normal-level 普通成员等级样式类 -->
				<div class="level-item normal-level">
					<!-- 头像图标 -->
					<!-- @component el-icon 图标容器 -->
					<!-- @icon avatar 头像图标，代表普通成员身份 -->
					<el-icon><avatar /></el-icon>
					<!-- 等级信息区域 -->
					<!-- @class level-info 等级信息容器类 -->
					<div class="level-info">
						<!-- 等级标签 -->
						<!-- @class level-label 等级标签样式类 -->
						<span class="level-label">普通成员</span>
						<!-- 等级数值 -->
						<!-- @class level-value 等级数值样式类 -->
						<!-- @data levelStats.normal 普通成员数量的响应式数据 -->
						<span class="level-value">{{ levelStats.normal }}人</span>
					</div>
				</div>
				<!-- 社团成员等级项 -->
				<!-- @description 展示社团成员等级数量的统计项 -->
				<!-- @class level-item 等级项样式类 -->
				<!-- @class club-level 社团成员等级样式类 -->
				<div class="level-item club-level">
					<!-- 用户图标 -->
					<!-- @component el-icon 图标容器 -->
					<!-- @icon user 用户图标，代表社团成员身份 -->
					<el-icon><user /></el-icon>
					<!-- 等级信息区域 -->
					<!-- @class level-info 等级信息容器类 -->
					<div class="level-info">
						<!-- 等级标签 -->
						<!-- @class level-label 等级标签样式类 -->
						<span class="level-label">社团成员</span>
						<!-- 等级数值 -->
						<!-- @class level-value 等级数值样式类 -->
						<!-- @data clubMembers 社团成员数量的响应式数据 -->
						<span class="level-value">{{ clubMembers }}人</span>
					</div>
				</div>
			</div>

			<!-- 排行榜区域 -->
			<!-- @description 展示学生考勤排名的区域，包括时间范围选择器和考勤图表 -->
			<!-- @class ranking-section 排行榜区域容器类 -->
			<div class="ranking-section">
				<!-- 排行榜区域头部 -->
				<!-- @description 排行榜区域的头部，包含标题和时间范围选择控件 -->
				<!-- @class section-header 区域头部样式类 -->
				<div class="section-header">
					<!-- 区域标题 -->
					<h3>排行榜</h3>
					<!-- 时间范围选择控件容器 -->
					<!-- @class controls 控件容器样式类 -->
					<div class="controls">
						<!-- 时间范围选择器 -->
						<!-- @component el-radio-group 单选按钮组组件 -->
						<!-- @v-model selectedTimeRange 绑定的响应式变量，控制当前选中的时间范围 -->
						<!-- @size small 控件大小 -->
						<!-- @class time-radio-group 时间选择器样式类 -->
						<!-- @event change 选择变化事件，触发loadRankingData函数重新加载排行榜数据 -->
						<el-radio-group
							v-model="selectedTimeRange"
							size="small"
							class="time-radio-group"
							@change="loadRankingData"
						>
							<!-- 周排行选项 -->
							<!-- @component el-radio-button 单选按钮组件 -->
							<!-- @label week 选项值，代表本周 -->
							<el-radio-button label="week">本周</el-radio-button>
							<!-- 月排行选项 -->
							<!-- @component el-radio-button 单选按钮组件 -->
							<!-- @label month 选项值，代表本月 -->
							<el-radio-button label="month">本月</el-radio-button>
							<!-- 年排行选项 -->
							<!-- @component el-radio-button 单选按钮组件 -->
							<!-- @label year 选项值，代表本年度 -->
							<el-radio-button label="year">本年度</el-radio-button>
							<!-- 最近7天排行选项 -->
							<!-- @component el-radio-button 单选按钮组件 -->
							<!-- @label last7days 选项值，代表最近7天 -->
							<el-radio-button label="last7days">最近7天</el-radio-button>
							<!-- 最近30天排行选项 -->
							<!-- @component el-radio-button 单选按钮组件 -->
							<!-- @label last30days 选项值，代表最近30天 -->
							<el-radio-button label="last30days">最近30天</el-radio-button>
							<!-- 全部时间排行选项 -->
							<!-- @component el-radio-button 单选按钮组件 -->
							<!-- @label all 选项值，代表全部时间 -->
							<el-radio-button label="all">全部</el-radio-button>
						</el-radio-group>
					</div>
				</div>
				<!-- 考勤图表容器 -->
				<!-- @description 考勤排行榜图表的容器 -->
				<!-- @class chart-container 图表容器样式类 -->
				<div class="chart-container">
					<!-- 考勤图表DOM引用 -->
					<!-- @ref attendanceChart 考勤图表的DOM引用，用于初始化ECharts实例 -->
					<!-- @class chart 图表样式类 -->
					<div ref="attendanceChart" class="chart"/>
				</div>
			</div>

			<!-- 图表区域 -->
			<!-- @description 展示年级分布和专业分布图表的区域 -->
			<!-- @class charts-section 图表区域容器类 -->
			<div class="charts-section">
				<!-- 年级分布图表项 -->
				<!-- @description 展示学生年级分布情况的图表项 -->
				<!-- @class chart-item 图表项样式类 -->
				<div class="chart-item">
					<!-- 图表标题 -->
					<h3>年级分布</h3>
					<!-- 年级分布图表DOM引用 -->
					<!-- @ref gradeChart 年级分布图表的DOM引用，用于初始化ECharts实例 -->
					<!-- @class chart 图表样式类 -->
					<div ref="gradeChart" class="chart"/>
				</div>

				<!-- 专业分布图表项 -->
				<!-- @description 展示学生专业分布情况的图表项 -->
				<!-- @class chart-item 图表项样式类 -->
				<div class="chart-item">
					<!-- 图表标题 -->
					<h3>专业分布</h3>
					<!-- 专业分布图表DOM引用 -->
					<!-- @ref majorChart 专业分布图表的DOM引用，用于初始化ECharts实例 -->
					<!-- @class chart 图表样式类 -->
					<div ref="majorChart" class="chart"/>
				</div>
			</div>

			<!-- 机制说明区域 -->
			<!-- @description 展示AI坊文明公约和相关机制说明的区域，提供团队准则和行为规范 -->
			<!-- @class mechanism-section 机制说明区域容器类 -->
			<div class="mechanism-section">
				<!-- 机制说明卡片 -->
				<!-- @description AI坊文明公约的卡片式容器，包含标题和具体条款内容 -->
				<!-- @class mechanism-card 机制说明卡片样式类 -->
				<div class="mechanism-card">
					<!-- 卡片标题 -->
					<!-- @description 文明公约卡片的主标题，清晰展示内容主题 -->
					<h3>AI 坊文明公约</h3>
					<!-- 机制内容区域 -->
					<!-- @description 包含文明公约具体条款的内容区域，以有序列表形式展示 -->
					<!-- @class mechanism-content 机制内容容器类 -->
					<div class="mechanism-content">
						<!-- 文明公约第1条 -->
						<!-- @description 关于学习态度的规定，要求成员积极参与团队活动 -->
						<p>
							1. 保持积极的学习态度，主动参与讨论和项目开发
						</p>
						<!-- 文明公约第2条 -->
						<!-- @description 关于团队氛围的规定，要求成员尊重他人 -->
						<p>
							2. 尊重他人，营造和谐友好的学习氛围
						</p>
						<!-- 文明公约第3条 -->
						<!-- @description 关于知识分享的规定，鼓励成员互相交流 -->
						<p>
							3. 乐于分享知识和经验，共同成长进步
						</p>
						<!-- 文明公约第4条 -->
						<!-- @description 关于团队纪律的规定，要求成员按时完成任务 -->
						<p>
							4. 遵守团队纪律，按时完成分配的任务
						</p>
						<!-- 文明公约第5条 -->
						<!-- @description 关于技术探索的规定，鼓励成员尝试新技术 -->
						<p>
							5. 勇于尝试新技术，不断提升自身技能水平
						</p>
						<!-- 文明公约第6条 -->
						<!-- @description 关于互助合作的规定，鼓励成员互相帮助 -->
						<p>
							6. 互相帮助，共同解决学习中遇到的问题
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
/**
 * 页面主样式文件引入
 * @description 引入DashboardPageMobile.css作为主要样式文件，包含页面布局和组件样式
 * @source ./css/DashboardPageMobile.css
 */
@import './css/DashboardPageMobile.css';
</style>

<style>
/**
 * 移动端页面样式定义
 * @description 定义DashboardPageMobile.vue组件的移动端专属样式，确保在移动设备上的良好显示效果
 * @scope global 全局样式作用域，影响组件内的所有元素
 */
/**
 * 时间范围选择器样式
 * @description 自定义时间范围选择器的布局和间距，使用弹性布局确保在移动设备上良好显示
 */
.time-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

/**
 * 单选按钮样式
 * @description 为时间范围选择器中的单选按钮提供基础样式，移除默认边距
 */
.time-radio-group .el-radio-button {
  margin: 0;
}

/**
 * 单选按钮内部样式
 * @description 定义单选按钮的内部样式，包括内边距、字体大小、边框圆角和过渡效果
 */
.time-radio-group .el-radio-button__inner {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 6px;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

/**
 * 暗色模式下单选按钮内部样式
 * @description 定义暗色模式下单选按钮的内部样式，调整颜色和背景色以适应暗色主题
 */
html.dark .time-radio-group .el-radio-button__inner {
  color: #e2e8f0;
  background-color: #1e293b;
  border-color: #334155;
}

/**
 * 选中状态下单选按钮样式
 * @description 定义选中状态下单选按钮的样式，突出显示当前选中的选项
 */
.time-radio-group .el-radio-button__original-radio:checked + .el-radio-button__inner {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  box-shadow: 0 2px 8px rgb(64 158 255 / 0.3);
}

/**
 * 暗色模式下选中状态单选按钮样式
 * @description 定义暗色模式下选中状态单选按钮的样式，使用不同的颜色方案适应暗色主题
 */
:where(.dark) .time-radio-group .el-radio-button__original-radio:checked + .el-radio-button__inner {
  color: #fff;
  background-color: #667eea;
  border-color: #667eea;
  box-shadow: 0 2px 8px rgb(102 126 234 / 0.4);
}

</style>

