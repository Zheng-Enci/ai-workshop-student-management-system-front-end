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
import { ElMessage, ElButton, ElIcon, ElRadioGroup, ElRadioButton, ElSelect, ElOption } from 'element-plus'
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import 'echarts-wordcloud'
import 'element-plus/theme-chalk/el-select.css'
import 'element-plus/theme-chalk/el-option.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-icon.css'

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

// ===================== 样式导入 ====================
// 导入移动端CSS样式
import '@/views/DashboardPage/mobile/css/DashboardPageMobile.css'
import LoadingMask from '@/components/LoadingMask.vue'

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
const selectedTimeRange = ref('today')
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

const saveUserPreferences = () => {
	const preferences = {
		selectedTimeRange: selectedTimeRange.value
	}
	localStorage.setItem('dashboardPreferences', JSON.stringify(preferences))
}

const loadUserPreferences = () => {
	const saved = localStorage.getItem('dashboardPreferences')
	if (saved) {
		try {
			const preferences = JSON.parse(saved)
			selectedTimeRange.value = preferences.selectedTimeRange || 'today'
		} catch (error) {
			selectedTimeRange.value = 'today'
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
		const dateString = currentDate.toLocaleDateString('en-CA')
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

const calculateClubMembers = () => {
	clubMembers.value = workshopMembers.value - levelStats.value.admin - levelStats.value.core - levelStats.value.normal
	// 坊内成员人数 = 管理员 + 核心成员 + 普通成员
	workshopMembersCount.value = levelStats.value.admin + levelStats.value.core + levelStats.value.normal
}

const calculateAttendanceRate = monthlyCount => {
	// 坊内成员总人数 = 管理员 + 核心成员 + 普通成员
	const membersCount = levelStats.value.admin + levelStats.value.core + levelStats.value.normal

	if (membersCount === 0) {
		return 0
	}

	return parseFloat(((monthlyCount / membersCount) * 100).toFixed(1))
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

const getLevelName = levelCode => {
	const levelMap = {
		0: '社团成员',
		1: '普通成员',
		2: '核心成员',
		3: '管理员'
	}
	return levelMap[levelCode] || '社团成员'
}

const initAttendanceChart = data => {
	if (!attendanceChart.value) { return }

	if (chartInstance) {
		chartInstance.dispose()
	}

	chartInstance = echarts.init(attendanceChart.value)

	// 数据按签到数升序排序（横向柱状图从下到上递增）
	const sortedData = [...data].sort((a, b) => a.attendanceCount - b.attendanceCount)
	const isDark = themeStore.isDarkMode

	const chartData = sortedData.map((item, index) => ({
		name: item.name,
		value: item.attendanceCount,
		itemData: item
	}))

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
				return `${itemData.name}<br/>${itemData.grade}年级 - ${itemData.major}<br/>签到次数: ${itemData.attendanceCount}次`
			}
		},
		grid: {
			left: '0%',
			right: '25%',
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
			data: chartData.map(item => item.name),
			axisLabel: {
				interval: 0,
				fontSize: 12,
				color: isDark ? '#ffffff' : '#2c3e50'
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
				data: chartData.map(item => item.value),
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
						return itemData.major
					},
					fontSize: 11,
					color: isDark ? '#ffffff' : '#666',
					distance: 8
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

	chartInstance.setOption(option)
}

const loadRankingData = async () => {
	try {
		let response

		switch (selectedTimeRange.value) {
			case 'week': {
				const now = new Date()
				const dayOfWeek = now.getDay()
				const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
				const monday = new Date(now.setDate(diff))
				const weekStart = monday.toLocaleDateString('en-CA')
				response = await getWeeklyRanking(weekStart, selectedTopN)
				break
			}
			case 'month': {
				const currentDate = new Date()
				const currentYear = currentDate.getFullYear()
				const currentMonth = currentDate.getMonth() + 1
				response = await getMonthlyRanking(currentYear, currentMonth, selectedTopN)
				break
			}
			case 'today': {
				const today = new Date().toLocaleDateString('en-CA')
				const startTime = `${today}T00:00:00`
				const endTime = `${today}T23:59:59`
				response = await getTopStudentsByTimeRange(startTime, endTime, selectedTopN)
				break
			}
			case 'last7days':
				response = await getLast7DaysRanking(selectedTopN)
				break
			case 'last30days':
				response = await getLast30DaysRanking(selectedTopN)
				break
			case 'all': {
				const PROJECT_LAUNCH_DATE = new Date('2024-09-09T00:00:00')
				const now = new Date()
				const startDate = PROJECT_LAUNCH_DATE.toLocaleDateString('en-CA')
				const endDate = now.toLocaleDateString('en-CA')
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

watch(() => themeStore.isDarkMode, () => {
	setTimeout(() => {
		initCharts()
	}, 100)
})

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

<template>
	<div class="dashboard-mobile-page">
		<div class="dashboard-mobile-header">
			<div class="dashboard-mobile-header-left">
				<el-button type="text" class="dashboard-mobile-back-btn" :icon="ArrowLeft" @click="goBack"></el-button>
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊"
					class="dashboard-mobile-logo"
					@click="toggleTheme"/>
			</div>
			<div class="dashboard-mobile-header-center">数据看板</div>
			<div class="dashboard-mobile-header-right">
				<img
					src="@/assets/QunCeQunLiChuangXingGongXing.png"
					alt="群策群力"
					class="dashboard-mobile-header-logo"/>
			</div>
		</div>

		<div class="dashboard-mobile-content">
			<!-- 排行榜区域：放在最上面 -->
			<div class="dashboard-mobile-ranking-section">
				<div class="dashboard-mobile-ranking-header">
					<span class="dashboard-mobile-ranking-title">排行榜</span>
					<el-select
						v-model="selectedTimeRange"
						size="small"
						class="dashboard-mobile-ranking-select"
						@change="loadRankingData"
					>
						<el-option label="本周" value="week" />
						<el-option label="本月" value="month" />
							<el-option label="今日" value="today" />
							<el-option label="最近7天" value="last7days" />
							<el-option label="最近30天" value="last30days" />
							<el-option label="全部" value="all" />
					</el-select>
				</div>
				<div class="dashboard-mobile-ranking-chart-container">
					<div ref="attendanceChart" class="dashboard-mobile-ranking-chart"/>
				</div>
			</div>

			<!-- 统计数据区域 -->
			<div class="dashboard-mobile-stats-grid">
				<div class="dashboard-mobile-stat-row">
					<div class="dashboard-mobile-stat-card">
						<div class="dashboard-mobile-stat-label">今日签到总人次</div>
						<div class="dashboard-mobile-stat-value">{{ todayAttendance }}人</div>
					</div>
					<div class="dashboard-mobile-stat-card">
						<div class="dashboard-mobile-stat-label">本月签到总人数</div>
						<div class="dashboard-mobile-stat-value">{{ monthlyAttendanceCount }}人</div>
					</div>
				</div>
				<div class="dashboard-mobile-stat-card">
					<div class="dashboard-mobile-stat-label">坊内成员人数</div>
					<div class="dashboard-mobile-stat-value">{{ workshopMembersCount }}人</div>
				</div>
			</div>

			<!-- 等级统计区域 -->
			<div class="dashboard-mobile-level-stats">
				<div class="dashboard-mobile-level-row">
					<div class="dashboard-mobile-level-item dashboard-mobile-admin-level">
						<el-icon><setting /></el-icon>
						<div class="dashboard-mobile-level-info">
							<span class="dashboard-mobile-level-label">管理员</span>
							<span class="dashboard-mobile-level-value">{{ levelStats.admin }}人</span>
						</div>
					</div>
					<div class="dashboard-mobile-level-item dashboard-mobile-core-level">
						<el-icon><star /></el-icon>
						<div class="dashboard-mobile-level-info">
							<span class="dashboard-mobile-level-label">核心成员</span>
							<span class="dashboard-mobile-level-value">{{ levelStats.core }}人</span>
						</div>
					</div>
				</div>
				<div class="dashboard-mobile-level-row">
					<div class="dashboard-mobile-level-item dashboard-mobile-normal-level">
						<el-icon><avatar /></el-icon>
						<div class="dashboard-mobile-level-info">
							<span class="dashboard-mobile-level-label">普通成员</span>
							<span class="dashboard-mobile-level-value">{{ levelStats.normal }}人</span>
						</div>
					</div>
					<div class="dashboard-mobile-level-item dashboard-mobile-club-level">
						<el-icon><user /></el-icon>
						<div class="dashboard-mobile-level-info">
							<span class="dashboard-mobile-level-label">社团成员</span>
							<span class="dashboard-mobile-level-value">{{ clubMembers }}人</span>
						</div>
					</div>
				</div>
			</div>

			<!-- 图表区域 -->
			<div class="dashboard-mobile-charts-section">
				<div class="dashboard-mobile-chart-item">
					<h3>年级分布</h3>
					<div ref="gradeChart" class="dashboard-mobile-chart-item"/>
				</div>

				<div class="dashboard-mobile-chart-item">
					<h3>专业分布</h3>
					<div ref="majorChart" class="dashboard-mobile-chart-item"/>
				</div>
			</div>

			<!-- 文明公约区域 -->
			<div class="dashboard-mobile-mechanism-section">
				<div class="dashboard-mobile-mechanism-card">
					<h3>AI 坊文明公约</h3>
					<div class="dashboard-mobile-mechanism-content">
						<p>
							厦门工学院人工智能创作坊环境保障机制适用于所有入坊师生，遵循"谁使用，谁负责；人走场清，物归原位；共同维护"原则。
							个人工位需人走椅归、桌面整洁、垃圾自清；公共区域保持地面无杂物、设备用后归位；最后离开者需关闭照明空调、关好门窗。
							使用者为第一责任人，团队值日督促规范，管理员巡查，违规者暂停使用权限并承担相应责任。
						</p>
					</div>
				</div>
			</div>
		</div>

		<LoadingMask/>
	</div>
</template>

<style scoped>
</style>

