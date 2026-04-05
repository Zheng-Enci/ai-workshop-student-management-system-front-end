<template>
  <div class="mobile-only-notice">
    <div class="notice-content">
      <el-icon :size="48" color="#909399"><Monitor /></el-icon>
      <h2>本功能只支持电脑端</h2>
      <p>请使用电脑访问以查看考勤分析数据</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Monitor } from '@element-plus/icons-vue'
</script>

<style scoped>
.mobile-only-notice {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.notice-content {
  text-align: center;
  color: #fff;
  padding: 40px;
}

.notice-content h2 {
  margin: 20px 0 10px;
  font-size: 24px;
}

.notice-content p {
  font-size: 14px;
  opacity: 0.8;
}
</style>
��组件
echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	EChartsPieChart,
	LineChart,
	CanvasRenderer
])
import { getTodayAttendanceRecords, getTopStudentsByTimeRange } from '@/api/attendance'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const themeStore = useThemeStore()

const goBack = () => {
	router.go(-1)
}

const toggleTheme = () => {
	themeStore.toggleTheme()
}

const selectedTimeRange = ref('today')
const timeRangeOptions = [
	{ label: '今日', value: 'today' },
	{ label: '昨月', value: 'lastMonth' },
	{ label: '自定义', value: 'custom' }
]

const attendanceRecords = ref([])
const totalAttendance = ref(0)
const periodStats = ref({
	morning: 0,
	afternoon: 0,
	evening: 0
})
const rankingList = ref([])
const latestAttendance = ref(null)
const earliestAttendance = ref(null)
const averageTime = ref('')
const lastUpdateTime = ref('')

const periodChart = ref(null)
const timelineChart = ref(null)
let periodChartInstance = null
let timelineChartInstance = null
let refreshTimer = null

const loadAttendanceData = async () => {
	try {
		const response = await getTodayAttendanceRecords()

		if (response && response.code === 200) {
			attendanceRecords.value = response.data || []
			totalAttendance.value = attendanceRecords.value.length
			periodStats.value = calculatePeriodStats(attendanceRecords.value)

			rankingList.value = [...attendanceRecords.value].sort((a, b) =>
				new Date(a.attendanceTime) - new Date(b.attendanceTime)
			)

			if (attendanceRecords.value.length > 0) {
				latestAttendance.value = attendanceRecords.value[attendanceRecords.value.length - 1]
				earliestAttendance.value = rankingList.value[0]
				averageTime.value = calculateAverageTime(attendanceRecords.value)
			}

			lastUpdateTime.value = new Date().toLocaleTimeString('zh-CN')

			setTimeout(() => {
				initChartsWithTheme()
			}, 200)
		}
	} catch (error) {
		ElMessage.error('加载签到数据失败')
	}
}

const loadTimelineData = async () => {
	try {
		let response
		if (selectedTimeRange.value === 'today') {
			response = await getTodayAttendanceRecords()
		} else if (selectedTimeRange.value === 'lastMonth') {
			const endDate = new Date()
			const startDate = new Date()
			startDate.setMonth(startDate.getMonth() - 1)
			response = await getTopStudentsByTimeRange(
				startDate.toISOString(),
				endDate.toISOString(),
				100
			)
		}

		if (response && response.code === 200) {
			setTimeout(async () => {
				await initTimelineChart()
			}, 100)
		}
	} catch (error) {
		ElMessage.error('加载时间线数据失败')
	}
}

const calculatePeriodStats = records => {
	const stats = { morning: 0, afternoon: 0, evening: 0 }

	records.forEach(record => {
		const hour = new Date(record.attendanceTime).getHours()
		if (hour >= 8 && hour < 11) {
			stats.morning++
		} else if (hour >= 14 && hour < 17) {
			stats.afternoon++
		} else if (hour >= 19 && hour < 22) {
			stats.evening++
		}
	})

	return stats
}

const calculateAverageTime = records => {
	if (records.length === 0) { return '--:--' }

	const times = records.map(item => new Date(item.attendanceTime).getTime())
	const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length
	return new Date(avgTime).toLocaleTimeString('zh-CN', {
		hour: '2-digit',
		minute: '2-digit'
	})
}

const formatTime = timeString => {
	const date = new Date(timeString)
	return date.toLocaleTimeString('zh-CN', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	})
}

const getRankingClass = index => {
	if (index === 0) { return 'first' }
	if (index === 1) { return 'second' }
	if (index === 2) { return 'third' }
	return ''
}

const initPeriodChart = async () => {
	await nextTick()

	if (!periodChart.value) { return }

	if (periodChartInstance) {
		periodChartInstance.dispose()
	}

	periodChartInstance = echarts.init(periodChart.value)

	const option = {
		backgroundColor: 'transparent',
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c} ({d}%)'
		},
		legend: {
			orient: 'horizontal',
			bottom: '5%',
			textStyle: {
				color: themeStore.isDark ? '#ffffff' : '#333333'
			}
		},
		series: [{
			name: '签到时段',
			type: 'pie',
			radius: ['40%', '70%'],
			center: ['50%', '45%'],
			avoidLabelOverlap: false,
			itemStyle: {
				borderRadius: 8,
				borderColor: themeStore.isDark ? '#2c2c2c' : '#ffffff',
				borderWidth: 2
			},
			label: {
				show: false,
				position: 'center'
			},
			emphasis: {
				label: {
					show: true,
					fontSize: 16,
					fontWeight: 'bold',
					color: themeStore.isDark ? '#ffffff' : '#333333'
				}
			},
			labelLine: {
				show: false
			},
			data: [
				{ value: periodStats.value.morning, name: '上午', itemStyle: { color: '#ff6b6b' } },
				{ value: periodStats.value.afternoon, name: '下午', itemStyle: { color: '#4ecdc4' } },
				{ value: periodStats.value.evening, name: '晚上', itemStyle: { color: '#45b7d1' } }
			]
		}]
	}

	periodChartInstance.setOption(option)
}

const initTimelineChart = async () => {
	await nextTick()

	if (!timelineChart.value) { return }

	if (timelineChartInstance) {
		timelineChartInstance.dispose()
	}

	const containerWidth = timelineChart.value.offsetWidth
	const containerHeight = containerWidth / 2

	timelineChartInstance = echarts.init(timelineChart.value, null, {
		width: containerWidth,
		height: containerHeight
	})

	setTimeout(() => {
		if (timelineChartInstance) {
			timelineChartInstance.resize({
				width: containerWidth,
				height: containerHeight
			})
		}
	}, 200)

	const option = {
		backgroundColor: 'transparent',
		tooltip: {
			trigger: 'axis',
			backgroundColor: themeStore.isDark ? 'rgba(50, 50, 50, 0.9)' : 'rgba(255, 255, 255, 0.9)',
			borderColor: themeStore.isDark ? '#666' : '#ddd',
			textStyle: {
				color: themeStore.isDark ? '#fff' : '#333'
			},
			formatter(params) {
				const data = params[0]
				const date = new Date(data.axisValue)
				const timeStr = date.toLocaleTimeString('zh-CN', {
					hour: '2-digit',
					minute: '2-digit'
				})
				return `${timeStr}<br/>签到人数: ${data.value}`
			}
		},
		grid: {
			left: '8%',
			right: '8%',
			bottom: '15%',
			top: '10%',
			containLabel: true
		},
		xAxis: {
			type: 'time',
			axisLine: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				color: themeStore.isDark ? '#999' : '#666',
				fontSize: 8,
				formatter(value) {
					const date = new Date(value)
					return date.toLocaleTimeString('zh-CN', {
						hour: '2-digit',
						minute: '2-digit'
					})
				}
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: themeStore.isDark ? '#333' : '#f0f0f0',
					type: 'dashed'
				}
			}
		},
		yAxis: {
			type: 'value',
			axisLine: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				color: themeStore.isDark ? '#999' : '#666',
				fontSize: 8
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: themeStore.isDark ? '#333' : '#f0f0f0',
					type: 'dashed'
				}
			}
		},
		series: [{
			name: '签到人数',
			type: 'line',
			smooth: true,
			symbol: 'circle',
			symbolSize: 3,
			lineStyle: {
				width: 2,
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 1,
					y2: 0,
					colorStops: [{
						offset: 0, color: '#667eea'
					}, {
						offset: 1, color: '#764ba2'
					}]
				}
			},
			itemStyle: {
				color: '#667eea',
				borderColor: '#fff',
				borderWidth: 2,
				shadowBlur: 10,
				shadowColor: 'rgba(102, 126, 234, 0.3)'
			},
			areaStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [{
						offset: 0, color: 'rgba(102, 126, 234, 0.4)'
					}, {
						offset: 1, color: 'rgba(118, 75, 162, 0.1)'
					}]
				}
			},
			emphasis: {
				itemStyle: {
					shadowBlur: 20,
					shadowColor: 'rgba(102, 126, 234, 0.5)'
				}
			},
			data: []
		}]
	}

	timelineChartInstance.setOption(option)
}

const initChartsWithTheme = () => {
	initPeriodChart()
	initTimelineChart()

	setTimeout(() => {
		if (timelineChartInstance && timelineChart.value) {
			const containerWidth = timelineChart.value.offsetWidth
			const containerHeight = containerWidth / 2
			timelineChartInstance.resize({
				width: containerWidth,
				height: containerHeight
			})
		}
		if (periodChartInstance) {
			periodChartInstance.resize()
		}
	}, 300)
}

const handleTimeRangeChange = async () => {
	try {
		await loadTimelineData()
		setTimeout(() => {
			if (timelineChartInstance && timelineChart.value) {
				const containerWidth = timelineChart.value.offsetWidth
				const containerHeight = containerWidth / 2
				timelineChartInstance.resize({
					width: containerWidth,
					height: containerHeight
				})
			}
		}, 100)
	} catch (error) {
		ElMessage.error('加载时间线数据失败')
	}
}


const startAutoRefresh = () => {
	refreshTimer = setInterval(() => {
		loadAttendanceData()
	}, 15000)
}

const stopAutoRefresh = () => {
	if (refreshTimer) {
		clearInterval(refreshTimer)
		refreshTimer = null
	}
}

onMounted(async () => {
	await loadAttendanceData()
	await loadTimelineData()
	startAutoRefresh()
})

onUnmounted(() => {
	stopAutoRefresh()
	if (periodChartInstance) {
		periodChartInstance.dispose()
	}
	if (timelineChartInstance) {
		timelineChartInstance.dispose()
	}
})
</script>

<template>
	<div class="attendance-analysis-mobile">
		<div class="mobile-header">
			<div class="header-left">
				<el-button
					type="text"
					class="back-button"
					@click="goBack"
				>
					<el-icon><arrow-left /></el-icon>
				</el-button>
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊"
					class="header-icon"
					@click="toggleTheme"
				/>
			</div>
			<h1 class="page-title">签到分析</h1>
		</div>

		<div class="mobile-content">
			<div class="time-range-selector">
				<el-segmented
					v-model="selectedTimeRange"
					:options="timeRangeOptions"
					size="small"
					@change="handleTimeRangeChange"
				/>
			</div>

			<div class="mobile-stats-grid">
				<div class="stat-card">
					<div class="stat-icon">
						<el-icon><user /></el-icon>
					</div>
					<div class="stat-content">
						<div class="stat-value">{{ totalAttendance }}</div>
						<div class="stat-label">今日签到</div>
					</div>
				</div>

				<div class="stat-card">
					<div class="stat-icon">
						<el-icon><clock /></el-icon>
					</div>
					<div class="stat-content">
						<div class="stat-value">{{ averageTime }}</div>
						<div class="stat-label">平均时间</div>
					</div>
				</div>

				<div class="stat-card">
					<div class="stat-icon">
						<el-icon><trend-charts /></el-icon>
					</div>
					<div class="stat-content">
						<div class="stat-value">{{ periodStats.morning + periodStats.afternoon + periodStats.evening }}</div>
						<div class="stat-label">总时段</div>
					</div>
				</div>

				<div class="stat-card">
					<div class="stat-icon">
						<el-icon><trophy /></el-icon>
					</div>
					<div class="stat-content">
						<div class="stat-value">{{ rankingList.length > 0 ? rankingList[0].name : '-' }}</div>
						<div class="stat-label">最早签到</div>
					</div>
				</div>
			</div>

			<div class="mobile-chart-section">
				<div class="chart-header">
					<h3>今日签到时段分布</h3>
					<el-icon class="header-icon"><pie-chart /></el-icon>
				</div>
				<div ref="periodChart" class="mobile-chart"/>
			</div>

			<div class="mobile-chart-section">
				<div class="chart-header">
					<h3>签到时间线</h3>
					<el-icon class="header-icon"><trend-charts /></el-icon>
				</div>
				<div ref="timelineChart" class="mobile-chart"/>
			</div>

			<div class="mobile-ranking-section">
				<div class="ranking-header">
					<h3>今日签到排行榜</h3>
					<el-icon class="header-icon"><trophy /></el-icon>
				</div>
				<div class="mobile-ranking-list">
					<div
						v-for="(item, index) in rankingList.slice(0, 10)"
						:key="index"
						class="mobile-ranking-item"
					>
						<div class="mobile-rank-number" :class="getRankingClass(index)">
							{{ index + 1 }}
						</div>
						<div class="mobile-student-info">
							<div class="mobile-student-name">{{ item.name }}</div>
							<div class="mobile-attendance-time">{{ formatTime(item.attendanceTime) }}</div>
						</div>
						<div v-if="index < 3" class="mobile-rank-badge">
							<el-icon><trophy /></el-icon>
						</div>
					</div>
				</div>
			</div>

			<div class="mobile-realtime-section">
				<div class="realtime-header">
					<h3>实时签到动态</h3>
					<el-icon class="header-icon"><trend-charts /></el-icon>
				</div>
				<div class="mobile-realtime-stats">
					<div class="realtime-item">
						<div class="realtime-label">最近签到</div>
						<div v-if="latestAttendance" class="realtime-value">
							{{ latestAttendance.name }} - {{ formatTime(latestAttendance.attendanceTime) }}
						</div>
						<div v-else class="realtime-value">暂无数据</div>
					</div>
					<div class="realtime-item">
						<div class="realtime-label">平均签到时间</div>
						<div class="realtime-value">{{ averageTime }}</div>
					</div>
					<div class="realtime-item">
						<div class="realtime-label">最早签到</div>
						<div v-if="earliestAttendance" class="realtime-value">
							{{ earliestAttendance.name }} - {{ formatTime(earliestAttendance.attendanceTime) }}
						</div>
						<div v-else class="realtime-value">暂无数据</div>
					</div>
				</div>
			</div>
		</div>

		<div class="mobile-footer">
			<div class="last-update">
				最后更新: {{ lastUpdateTime }}
			</div>
		</div>
	</div>
</template>

<style scoped>
@import './css/AttendanceAnalysisPageMobile.css';
</style>
