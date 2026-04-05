<script setup>
// ECharts 按需引入
import { ArrowLeft, Calendar, Clock, User, Setting, Star, Avatar } from '@element-plus/icons-vue'
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
	getDailyAttendanceCount,
	getCurrentMonthTop10Students,
	getWeeklyRanking,
	getMonthlyRanking,
	getYearlyRanking,
	getTopStudentsByTimeRange,
	getLast7DaysRanking,
	getLast30DaysRanking,
	getVerificationCode
} from '@/api/attendance'
import {
	getGradeStatistics,
	getMajorStatistics,
	getTotalStudentCount,
	getStudentCountByLevel
} from '@/api/student'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore

const gradeChart = ref(null)
const majorChart = ref(null)
const attendanceChart = ref(null)
const progressWidth = ref(0)
const currentQRType = ref('website')
const verificationCode = ref('')
const verificationCodeStatus = ref('loading')
const verificationCodeInterval = ref(null)
const verificationCodeRetryCount = ref(0)
const verificationCodeHasSuccess = ref(false)
const MAX_RETRY_COUNT = 8

const switchQRType = () => {
	currentQRType.value = currentQRType.value === 'website' ? 'wechat' : 'website'
}
const progressInterval = ref(null)

const topStudents = ref([])
const totalStudents = ref(0)
const todayCount = ref(0)
const dailyAvgAttendance = ref(0)
const attendanceRate = ref(0)
const monthlyAttendanceCount = ref(0)
const workshopMembersCount = ref(0)
const levelStats = ref({
	admin: 0,
	core: 0,
	normal: 0
})
const clubMembers = ref(0)

const selectedTimeRange = ref('week')
const selectedTopN = 16

const timeRangeOptions = [
	{ label: '本周', value: 'week' },
	{ label: '本月', value: 'month' },
	{ label: '本年度', value: 'year' },
	{ label: '最近7天', value: 'last7days' },
	{ label: '最近30天', value: 'last30days' },
	{ label: '全部', value: 'all' }
]


let gradeChartInstance = null
let majorChartInstance = null
let attendanceChartInstance = null

const goBack = () => {
	router.push('/navigation')
}

const saveUserPreferences = () => {
	const preferences = {
		timeRange: selectedTimeRange.value
	}
	localStorage.setItem('dashboardPreferences', JSON.stringify(preferences))
}

const loadUserPreferences = () => {
	const saved = localStorage.getItem('dashboardPreferences')
	if (saved) {
		try {
			const preferences = JSON.parse(saved)
			selectedTimeRange.value = preferences.timeRange || 'week'
		} catch (error) {
			selectedTimeRange.value = 'week'
		}
	}
}

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

		const nextDate = new Date(currentDate)
		nextDate.setDate(nextDate.getDate() + 1)
		currentDate = nextDate
	}

	if (workingDays === 0) {
		return 0
	}

	return parseFloat((monthlyCount / workingDays).toFixed(2))
}

const getCurrentWeekStart = () => {
	const now = new Date()
	const dayOfWeek = now.getDay()
	const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
	const monday = new Date(now.setDate(diff))
	return monday.toISOString().split('T')[0]
}

const getLevelName = levelCode => {
	const levelMap = {
		0: '社团成员',
		1: '普通成员',
		2: '核心成员',
		3: '管理员'
	}
	return levelMap[levelCode] || '社团成员'
}

const calculateClubMembers = () => {
	clubMembers.value = totalStudents.value - levelStats.value.admin - levelStats.value.core - levelStats.value.normal
	// 坊内成员人数 = 管理员 + 核心成员 + 普通成员
	workshopMembersCount.value = levelStats.value.admin + levelStats.value.core + levelStats.value.normal
}

const calculateAttendanceRate = monthlyCount => {
	const workshopCount = levelStats.value.admin + levelStats.value.core + levelStats.value.normal

	if (workshopCount === 0) {
		return 0
	}

	return parseFloat(((monthlyCount / workshopCount) * 100).toFixed(1))
}

const getStableColor = index => {
	const colors = [
		'#667eea', '#764ba2', '#f093fb', '#f5576c',
		'#4facfe', '#00f2fe', '#a8edea', '#fed6e3',
		'#ff9a9e', '#fecfef', '#fecfef', '#a8edea',
		'#d299c2', '#fad0c4', '#ffd1ff', '#a8e6cf'
	]
	return colors[index % colors.length]
}

const getDarkStableColor = index => {
	const colors = [
		'#00d4ff', '#ff6b6b', '#4ecdc4', '#45b7d1',
		'#96ceb4', '#feca57', '#ff9ff3', '#54a0ff',
		'#5f27cd', '#00d2d3', '#ff9f43', '#10ac84',
		'#ee5a24', '#0984e3', '#6c5ce7', '#a29bfe'
	]
	return colors[index % colors.length]
}

const initGradeChart = data => {
	if (!gradeChart.value) { return }

	if (gradeChartInstance) {
		gradeChartInstance.dispose()
	}

	gradeChartInstance = echarts.init(gradeChart.value)

	const sortedData = [...data].sort((a, b) => a.grade - b.grade)
	const isDark = themeStore.isDarkMode

	const option = {
		backgroundColor: 'transparent',
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c} ({d}%)',
			backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
			borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
			textStyle: {
				color: isDark ? '#ffffff' : '#2c3e50'
			}
		},
		legend: {
			orient: 'vertical',
			left: 'left',
			data: sortedData.map(item => `${item.grade}年级`),
			textStyle: {
				color: isDark ? '#ffffff' : '#2c3e50'
			}
		},
		series: [
			{
				name: '年级分布',
				type: 'pie',
				radius: ['40%', '70%'],
				center: ['50%', '50%'],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 10,
					borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : '#fff',
					borderWidth: 2
				},
				label: {
					show: false,
					position: 'center',
					color: isDark ? '#ffffff' : '#2c3e50'
				},
				emphasis: {
					label: {
						show: true,
						fontSize: '18',
						fontWeight: 'bold',
						color: isDark ? '#ffffff' : '#2c3e50'
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
}

const initMajorChart = data => {
	if (!majorChart.value) { return }

	if (majorChartInstance) {
		majorChartInstance.dispose()
	}

	majorChartInstance = echarts.init(majorChart.value)

	const sortedData = [...data].sort((a, b) => b.count - a.count)
	const isDark = themeStore.isDarkMode

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
				color: isDark ? '#ffffff' : '#2c3e50'
			}
		},
		series: [
			{
				type: 'wordCloud',
				gridSize: 1,
				sizeRange: [16, 50],
				rotationRange: [0, 0],
				rotationStep: 0,
				shape: 'circle',
				width: '100%',
				height: '100%',
				left: 'center',
				top: 'center',
				right: null,
				bottom: null,
				layoutAnimation: false,
				shrinkToFit: true,
				drawOutOfBound: false,
				random() {
					return 0.5
				},
				textStyle: {
					fontFamily: 'Microsoft YaHei, sans-serif',
					fontWeight: 'bold',
					color(params) {
						return isDark ? getDarkStableColor(params.dataIndex) : getStableColor(params.dataIndex)
					}
				},
				emphasis: {
					textStyle: {
						shadowBlur: 10,
						shadowColor: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)'
					}
				},
				data: wordCloudData
			}
		]
	}

	majorChartInstance.setOption(option)
}

const initAttendanceChart = data => {
	if (!attendanceChart.value) { return }

	if (attendanceChartInstance) {
		attendanceChartInstance.dispose()
	}

	attendanceChartInstance = echarts.init(attendanceChart.value)

	const sortedData = [...data].sort((a, b) => a.attendanceCount - b.attendanceCount)
	const isDark = themeStore.isDarkMode

	const option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			},
			backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
			borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
			textStyle: {
				color: isDark ? '#ffffff' : '#2c3e50'
			},
			formatter(params) {
				const itemData = sortedData[params[0].dataIndex]
				return `${itemData.name} (${itemData.levelName})<br/>${itemData.grade}年级 - ${itemData.major}<br/>签到次数: ${itemData.attendanceCount}次`
			}
		},
		grid: {
			left: '0%',
			right: '15%',
			bottom: '3%',
			top: '0%',
			containLabel: true
		},
		xAxis: {
			type: 'value',
			axisLabel: {
				fontSize: 12,
				formatter: '{value}次',
				color: isDark ? '#ffffff' : '#2c3e50'
			},
			axisLine: {
				lineStyle: {
					color: isDark ? '#ffffff' : '#2c3e50'
				}
			}
		},
		yAxis: {
			type: 'category',
			data: sortedData.map(item => `${item.name} (${item.levelName})`),
			axisLabel: {
				interval: 0,
				fontSize: 12,
				color: isDark ? '#ffffff' : '#2c3e50',
				formatter(value) {
					return value
				}
			},
			axisLine: {
				lineStyle: {
					color: isDark ? '#ffffff' : '#2c3e50'
				}
			}
		},
		series: [
			{
				name: '签到次数',
				type: 'bar',
				data: sortedData.map(item => item.attendanceCount),
				barWidth: '60%',
				itemStyle: {
					color(params) {
						const totalCount = sortedData.length
						const index = params.dataIndex

						if (totalCount <= 10) {
							const colors = ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1']
							return colors[index]
						}
						const hue = 200 + (index / totalCount) * 40
						const saturation = 70 + (index / totalCount) * 20
						const lightness = 85 - (index / totalCount) * 30
						return `hsl(${hue}, ${saturation}%, ${lightness}%)`
					},
					borderRadius: [0, 4, 4, 0]
				},
				label: {
					show: true,
					position: 'right',
					formatter(params) {
						const itemData = sortedData[params.dataIndex]
						return `${itemData.grade}年级\n${itemData.major}`
					},
					fontSize: 11,
					color: isDark ? '#ffffff' : '#666',
					lineHeight: 14,
					distance: 10
				},
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}
		]
	}

	attendanceChartInstance.setOption(option)
}

const loadRankingData = async () => {
	try {
		let response

		switch (selectedTimeRange.value) {
			case 'week': {
				const weekStart = getCurrentWeekStart()
				response = await getWeeklyRanking(weekStart, selectedTopN)
				break
			}
			case 'month': {
				const now = new Date()
				response = await getMonthlyRanking(now.getFullYear(), now.getMonth() + 1, selectedTopN)
				break
			}
			case 'year':
				response = await getYearlyRanking(new Date().getFullYear(), selectedTopN)
				break
			case 'last7days':
				response = await getLast7DaysRanking(selectedTopN)
				break
			case 'last30days': {
				response = await getLast30DaysRanking(selectedTopN)
				break
			}
			case 'all': {
				const PROJECT_LAUNCH_DATE = new Date('2024-09-09T00:00:00')
				const now = new Date()
				const [startDate] = PROJECT_LAUNCH_DATE.toISOString().split('T')
				const [endDate] = now.toISOString().split('T')
				const startTime = `${startDate}T00:00:00`
				const endTime = `${endDate}T23:59:59`
				response = await getTopStudentsByTimeRange(startTime, endTime, selectedTopN)
				break
			}
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

			topStudents.value = processedData
			initAttendanceChart(processedData)
		}
	} catch (error) {
		ElMessage.error(`获取排行榜数据失败：${error.message}`)
	}
}

const handleTimeRangeChange = async () => {
	saveUserPreferences()
	await loadRankingData()
}

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


const loadVerificationCode = async () => {
	if (!verificationCodeHasSuccess.value && verificationCodeRetryCount.value >= MAX_RETRY_COUNT) {
		verificationCodeStatus.value = 'error'
		return
	}

	try {
		const response = await getVerificationCode()
		if (response.code === 200 && response.data) {
			if (verificationCode.value !== response.data) {
				verificationCode.value = response.data
				verificationCodeStatus.value = 'success'
			}
			verificationCodeHasSuccess.value = true
			verificationCodeRetryCount.value = 0
		} else if (!verificationCodeHasSuccess.value) {
			verificationCodeRetryCount.value += 1
			if (verificationCodeRetryCount.value >= MAX_RETRY_COUNT) {
				verificationCode.value = ''
				verificationCodeStatus.value = 'error'
				if (verificationCodeInterval.value) {
					clearInterval(verificationCodeInterval.value)
					verificationCodeInterval.value = null
				}
			}
		}
	} catch (error) {
		if (!verificationCodeHasSuccess.value) {
			verificationCodeRetryCount.value += 1
			if (verificationCodeRetryCount.value >= MAX_RETRY_COUNT) {
				verificationCode.value = ''
				verificationCodeStatus.value = 'error'
				if (verificationCodeInterval.value) {
					clearInterval(verificationCodeInterval.value)
					verificationCodeInterval.value = null
				}
			}
		}
	}
}

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
			getDailyAttendanceCount()
		])

		if (gradeData.code === 200 && gradeData.data) {
			initGradeChart(gradeData.data)
		}

		if (majorData.code === 200 && majorData.data) {
			initMajorChart(majorData.data)
		}

		if (totalData.code === 200 && totalData.data) {
			totalStudents.value = totalData.data.count
		}

		if (monthlyData.code === 200 && monthlyData.data) {
			const dailyAvg = calculateDailyAvgAttendance(monthlyData.data.count)
			dailyAvgAttendance.value = dailyAvg

			// 保存月度数据，等levelStats加载完成后再计算签到率
			monthlyAttendanceCount.value = monthlyData.data.count
		}

		if (dailyData.code === 200 && dailyData.data) {
			todayCount.value = dailyData.data.count
		}

		await loadRankingData()
		await loadLevelStats()

		calculateClubMembers()

		watch(selectedTimeRange, async (newValue, oldValue) => {
			if (newValue !== oldValue) {
				saveUserPreferences()
				await loadRankingData()
			}
		})
	} catch (error) {
		ElMessage.error(`数据加载失败：${error.message}`)
	}
}

const startProgress = () => {
	progressWidth.value = 0
	progressInterval.value = setInterval(() => {
		progressWidth.value += 100 / 150
		if (progressWidth.value >= 100) {
			progressWidth.value = 0
			loadData()
		}
	}, 100)
}

const startVerificationCodeRefresh = () => {
	loadVerificationCode()
	verificationCodeInterval.value = setInterval(() => {
		loadVerificationCode()
	}, 500)
}

const handleResize = () => {
	if (gradeChartInstance) {
		gradeChartInstance.resize()
	}
	if (majorChartInstance) {
		majorChartInstance.resize()
	}
	if (attendanceChartInstance) {
		attendanceChartInstance.resize()
	}
}

watch(() => themeStore.isDarkMode, () => {
	setTimeout(() => {
		loadData()
	}, 100)
})

onMounted(async () => {
	await nextTick()
	loadUserPreferences()
	await loadData()
	startProgress()
	startVerificationCodeRefresh()
	window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
	if (progressInterval.value) {
		clearInterval(progressInterval.value)
	}
	if (verificationCodeInterval.value) {
		clearInterval(verificationCodeInterval.value)
	}
	if (gradeChartInstance) {
		gradeChartInstance.dispose()
	}
	if (majorChartInstance) {
		majorChartInstance.dispose()
	}
	if (attendanceChartInstance) {
		attendanceChartInstance.dispose()
	}
	window.removeEventListener('resize', handleResize)
})
</script>

<template>
	<div class="dashboard-container">
		<div class="header">
			<div class="header-left">
				<el-button
					class="back-btn"
					type="primary"
					:icon="ArrowLeft"
					circle
					@click="goBack"/>
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊"
					class="logo"
					title="切换主题模式"
					@click="toggleTheme"/>
				<div class="title-section">
					<h1>人工智能创作坊</h1>
					<p>Artificial Intelligence Workshop</p>
				</div>
			</div>
			<div class="header-right">
				<div class="slogan">
					<img src="@/assets/QunCeQunLiChuangXingGongXing.png" alt="群策群力，创新共行" class="slogan-img"/>
				</div>
			</div>
		</div>

		<div class="main-content">
			<div class="left-section">
				<div class="punch-card">
					<h2>排行榜</h2>

					<div class="top-students">
						<div class="chart-header">
							<div class="controls-section">
								<div class="time-range-selector">
									<el-radio-group
										v-model="selectedTimeRange"
										size="small"
										class="time-radio-group"
										@change="handleTimeRangeChange"
									>
										<el-radio-button
											v-for="option in timeRangeOptions.filter(opt => opt.value !== 'custom')"
											:key="option.value"
											:label="option.value"
										>
											{{ option.label }}
										</el-radio-button>
									</el-radio-group>
								</div>
							</div>
						</div>
						<div ref="attendanceChart" class="attendance-chart"/>
					</div>

					<div class="summary-stats">
						<div class="stats-row">
							<div class="total-count">
								<span class="label">
									<el-icon class="stat-icon"><calendar /></el-icon>
									本月签到总人数
								</span>
								<span class="value">{{ monthlyAttendanceCount }}人</span>
							</div>
							<div class="total-count">
								<span class="label">
									<el-icon class="stat-icon"><clock /></el-icon>
									今日签到总人数
								</span>
								<span class="value">{{ todayCount }}人</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="right-section">
				<div class="overview-card">
					<h2>学生总览</h2>

					<div class="charts-container">
						<div class="chart-section">
							<h3>年级分布</h3>
							<div ref="gradeChart" class="chart"/>
						</div>

						<div class="chart-section">
							<h3>专业分布</h3>
							<div ref="majorChart" class="chart"/>
						</div>
					</div>

					<div class="environment-mechanism">
						<div class="mechanism-card">
							<h2>AI 坊文明公约</h2>

							<div class="mechanism-content">
								<div class="mechanism-section">
									<p>
										厦门工学院人工智能创作坊环境保障机制适用于所有入坊师生，
										遵循"谁使用，谁负责；人走场清，物归原位；共同维护"原则。
										个人工位需人走椅归、桌面整洁、垃圾自清；公共区域保持地面无杂物、设备用后归位；
										最后离开者需关闭照明空调、关好门窗。使用者为第一责任人，
										团队值日督促规范，管理员巡查，违规者暂停使用权限并承担相应责任。
									</p>
								</div>
							</div>
						</div>
					</div>

					<div class="summary-stats">
						<div class="stats-row">
							<div class="total-count">
								<span class="label">
									<el-icon class="stat-icon"><user /></el-icon>
									坊内成员人数
								</span>
								<span class="value">{{ workshopMembersCount }}人</span>
							</div>
							<div class="level-stats">
								<div class="level-item admin-level">
									<div class="level-icon">
										<el-icon><setting /></el-icon>
									</div>
									<div class="level-content">
										<span class="level-label">管理员</span>
										<span class="level-value">{{ levelStats.admin }}人</span>
									</div>
								</div>
								<div class="level-item core-level">
									<div class="level-icon">
										<el-icon><star /></el-icon>
									</div>
									<div class="level-content">
										<span class="level-label">核心成员</span>
										<span class="level-value">{{ levelStats.core }}人</span>
									</div>
								</div>
								<div class="level-item normal-level">
									<div class="level-icon">
										<el-icon><avatar /></el-icon>
									</div>
									<div class="level-content">
										<span class="level-label">普通成员</span>
										<span class="level-value">{{ levelStats.normal }}人</span>
									</div>
								</div>
								<div class="level-item club-level">
									<div class="level-icon">
										<el-icon><user /></el-icon>
									</div>
									<div class="level-content">
										<span class="level-label">社团成员</span>
										<span class="level-value">{{ clubMembers }}人</span>
									</div>
								</div>
							</div>
							<div class="system-info">
								<div class="system-name">人工智能创作坊</div>
								<div class="system-subtitle">智慧学生管理系统</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="footer">
			<div class="progress-bar">
				<div class="progress-fill" :style="{ width: progressWidth + '%' }"/>
			</div>
		</div>

		<div class="phone-display">
			<div class="verification-code-card">
				<div class="verification-code-label">签到验证码</div>
				<div class="verification-code-value">
					<span v-if="verificationCodeStatus === 'loading'">获取中...</span>
					<span v-else-if="verificationCodeStatus === 'success'">{{ verificationCode }}</span>
					<span v-else-if="verificationCodeStatus === 'error'" class="error-text">本机无权获取</span>
				</div>
			</div>

			<div v-if="currentQRType === 'website'" class="website-qr-section">
				<img src="@/assets/ShouJiDuanQianDanRuKou.png" alt="手机端签到入口" class="website-qr-code"/>
				<div
					class="website-qr-text"
					:style="{
						'font-weight': '800 !important',
						'color': '#60a5fa !important',
						'text-shadow': '0 0 8px rgb(96 165 250 / 1) !important'
					}"
				>
					手机端签到入口
				</div>
			</div>

			<div v-if="currentQRType === 'wechat'" class="wechat-qr-section">
				<img src="@/assets/ErWeiMa.png" alt="公众号二维码" class="qr-code"/>
				<div
					class="qr-text"
					:style="{
						'font-weight': '800 !important',
						'color': '#60a5fa !important',
						'text-shadow': '0 0 8px rgb(96 165 250 / 1) !important'
					}"
				>
					扫码了解更多
				</div>
			</div>

			<!-- 二维码切换按钮 -->
			<div class="qr-switch-buttons">
				<el-button
					class="qr-switch-btn"
					type="primary"
					@click="switchQRType"
				>
					{{ currentQRType === 'website' ? '切换到公众号' : '切换到签到入口' }}
				</el-button>
			</div>

			<img src="@/assets/Phone.png" alt="手机展示" class="phone-image"/>
		</div>
	</div>
</template>

<style scoped>
@import './css/DashboardPageDesktop.css';
</style>

<style>
.time-select-dropdown {
  z-index: 3000 !important;
  min-width: auto !important;
  padding: 8px 0;
  background: #fff;
  border: 1px solid rgb(0 0 0 / 0.1);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.15);
}

.time-select-dropdown .el-select-dropdown__item {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 40px;
  padding: 12px 16px;
  margin: 2px 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  color: #606266 !important;
  text-align: left;
  white-space: nowrap;
  pointer-events: auto !important;
  cursor: pointer !important;
  user-select: none;
  background-color: #fff !important;
  border-radius: 8px;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.time-select-dropdown .el-select-dropdown__item span {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  pointer-events: none !important;
}

:where(html.dark) .time-select-dropdown .el-select-dropdown__item:hover {
  color: #818cf8;
  background-color: #334155 !important;
}

:where(html.dark) .time-select-dropdown .el-select-dropdown__item.selected {
  font-weight: 600 !important;
  color: #818cf8 !important;
  background-color: rgb(102 126 234 / 0.2) !important;
}

.time-select-dropdown .el-select-dropdown__item:hover {
  color: #409eff !important;
  background-color: #f5f7fa !important;
}

.time-select-dropdown .el-select-dropdown__item.selected {
  font-weight: 600 !important;
  color: #409eff !important;
  background-color: #ecf5ff !important;
}

.time-select-dropdown .el-select-dropdown__item.selected:hover {
  background-color: #d9ecff !important;
}

:where(html.dark) .time-select-dropdown .el-select-dropdown__item.selected:hover {
  background-color: rgb(102 126 234 / 0.3) !important;
}

html.dark .time-select-dropdown {
  background: #1e293b;
  border: 1px solid rgb(255 255 255 / 0.1);
}

html.dark .time-select-dropdown .el-select-dropdown__item {
  color: #e2e8f0 !important;
  background-color: #1e293b !important;
}

.time-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.time-radio-group .el-radio-button {
  margin: 0;
}

.time-radio-group .el-radio-button__inner {
  padding: 8px 16px;
  font-size: 13px;
  color: #606266 !important;
  background-color: #fff !important;
  border-color: #dcdfe6 !important;
  border-radius: 6px;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

:where(html.dark) .time-radio-group .el-radio-button__inner {
  color: #e2e8f0 !important;
  background-color: #1e293b !important;
  border-color: #334155 !important;
}

.time-radio-group .el-radio-button__original-radio:checked + .el-radio-button__inner {
  color: #fff !important;
  background-color: #409eff !important;
  border-color: #409eff !important;
  box-shadow: 0 2px 8px rgb(64 158 255 / 0.3) !important;
}

.time-radio-group .el-radio-button.is-active .el-radio-button__inner {
  color: #fff !important;
  background-color: #409eff !important;
  border-color: #409eff !important;
  box-shadow: 0 2px 8px rgb(64 158 255 / 0.3) !important;
}

:where(html.dark) .time-radio-group .el-radio-button__original-radio:checked + .el-radio-button__inner {
  color: #fff !important;
  background-color: #667eea !important;
  border-color: #667eea !important;
  box-shadow: 0 2px 8px rgb(102 126 234 / 0.4) !important;
}

:where(html.dark) .time-radio-group .el-radio-button.is-active .el-radio-button__inner {
  color: #fff !important;
  background-color: #667eea !important;
  border-color: #667eea !important;
  box-shadow: 0 2px 8px rgb(102 126 234 / 0.4) !important;
}
</style>

