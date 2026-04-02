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
			selectedTimeRange.value = preferences.selectedTimeRange || 'week'
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

const loadRankingData = async () => {
	try {
		let response

		switch (selectedTimeRange.value) {
			case 'week': {
				const now = new Date()
				const dayOfWeek = now.getDay()
				const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
				const monday = new Date(now.setDate(diff))
				const [weekStart] = monday.toISOString().split('T')
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
			case 'year':
				response = await getYearlyRanking(new Date().getFullYear(), selectedTopN)
				break
			case 'last7days':
				response = await getLast7DaysRanking(selectedTopN)
				break
			case 'last30days':
				response = await getLast30DaysRanking(selectedTopN)
				break
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
		loadData()
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
	<div class="dashboard-page-mobile">
		<div class="mobile-header">
			<div class="header-left">
				<el-button type="text" class="back-btn" @click="goBack">
					<el-icon><arrow-left /></el-icon>
				</el-button>
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊"
					class="logo"
					@click="toggleTheme"/>
			</div>
			<div class="header-title">数据看板</div>
		</div>

		<div class="mobile-content">
			<div class="stats-grid">
				<div class="stat-card">
					<div class="stat-label">今日签到总人次</div>
					<div class="stat-value">{{ todayAttendance }}人</div>
				</div>
				<div class="stat-card">
					<div class="stat-label">本月签到总人数</div>
					<div class="stat-value">{{ monthlyAttendanceCount }}人</div>
				</div>
				<div class="stat-card">
					<div class="stat-label">坊内成员人数</div>
					<div class="stat-value">{{ workshopMembersCount }}人</div>
				</div>
			</div>

			<div class="level-stats-mobile">
				<div class="level-item admin-level">
					<el-icon><setting /></el-icon>
					<div class="level-info">
						<span class="level-label">管理员</span>
						<span class="level-value">{{ levelStats.admin }}人</span>
					</div>
				</div>
				<div class="level-item core-level">
					<el-icon><star /></el-icon>
					<div class="level-info">
						<span class="level-label">核心成员</span>
						<span class="level-value">{{ levelStats.core }}人</span>
					</div>
				</div>
				<div class="level-item normal-level">
					<el-icon><avatar /></el-icon>
					<div class="level-info">
						<span class="level-label">普通成员</span>
						<span class="level-value">{{ levelStats.normal }}人</span>
					</div>
				</div>
				<div class="level-item club-level">
					<el-icon><user /></el-icon>
					<div class="level-info">
						<span class="level-label">社团成员</span>
						<span class="level-value">{{ clubMembers }}人</span>
					</div>
				</div>
			</div>

			<div class="ranking-section">
				<div class="section-header">
					<h3>排行榜</h3>
					<div class="controls">
						<el-radio-group
							v-model="selectedTimeRange"
							size="small"
							class="time-radio-group"
							@change="loadRankingData"
						>
							<el-radio-button label="week">本周</el-radio-button>
							<el-radio-button label="month">本月</el-radio-button>
							<el-radio-button label="year">本年度</el-radio-button>
							<el-radio-button label="last7days">最近7天</el-radio-button>
							<el-radio-button label="last30days">最近30天</el-radio-button>
							<el-radio-button label="all">全部</el-radio-button>
						</el-radio-group>
					</div>
				</div>
				<div class="chart-container">
					<div ref="attendanceChart" class="chart"/>
				</div>
			</div>

			<div class="charts-section">
				<div class="chart-item">
					<h3>年级分布</h3>
					<div ref="gradeChart" class="chart"/>
				</div>

				<div class="chart-item">
					<h3>专业分布</h3>
					<div ref="majorChart" class="chart"/>
				</div>
			</div>

			<div class="mechanism-section">
				<div class="mechanism-card">
					<h3>AI 坊文明公约</h3>
					<div class="mechanism-content">
						<p>
							厦门工学院人工智能创作坊环境保障机制适用于所有入坊师生，遵循"谁使用，谁负责；人走场清，物归原位；共同维护"原则。
							个人工位需人走椅归、桌面整洁、垃圾自清；公共区域保持地面无杂物、设备用后归位；最后离开者需关闭照明空调、关好门窗。
							使用者为第一责任人，团队值日督促规范，管理员巡查，违规者暂停使用权限并承担相应责任。
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import './css/DashboardPageMobile.css';
</style>

<style scoped>
.time-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.time-radio-group .el-radio-button {
  margin: 0;
}

.time-radio-group .el-radio-button__inner {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 6px;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.time-radio-group .el-radio-button__original-radio:checked + .el-radio-button__inner {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  box-shadow: 0 2px 8px rgb(64 158 255 / 0.3);
}
</style>

