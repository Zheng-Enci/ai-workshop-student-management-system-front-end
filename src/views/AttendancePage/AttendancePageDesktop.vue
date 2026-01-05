<script setup>
/**
 * 签到页面组件(桌面端)
 *
 * @description 学生签到功能页面,展示签到热力图、趋势图和历史记录(桌面端)
 * @component AttendancePageDesktop
 */
// ECharts 按需引入
import { Check, ArrowLeft } from '@element-plus/icons-vue'
import { HeatmapChart, LineChart } from 'echarts/charts'
import {
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	CalendarComponent,
	VisualMapComponent
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ElButton, ElIcon, ElCalendar } from 'element-plus'
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-calendar.css'
import { useRouter } from 'vue-router'

import { getMyAttendanceRecords } from '@/api/attendance'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'

// 注册需要的组件
echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	CalendarComponent,
	VisualMapComponent,
	HeatmapChart,
	LineChart,
	CanvasRenderer
])

const userStore = useUserStore()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore
const router = useRouter()
const studentLevel = ref(0)
const isInSignTime = ref(false)
const currentTime = ref('')
const nextSignTime = ref('')
const timeInterval = ref(null)

const heatmapChart = ref(null)
const lineChart = ref(null)
const heatmapInstance = ref(null)
const lineInstance = ref(null)
const attendanceRecords = ref([])
const calendarValue = ref(new Date())

const goToNavigation = () => {
	router.push('/navigation')
}

const getDateAttendanceTimes = dateStr => {
	if (!attendanceRecords.value || attendanceRecords.value.length === 0) {
		return []
	}

	return attendanceRecords.value.filter(record => {
		if (!record || !record.attendanceDateTime) {
			return false
		}

		const recordDate = new Date(record.attendanceDateTime)
		const [recordDateStr] = recordDate.toISOString().split('T')
		return recordDateStr === dateStr
	}).map(record => record.attendanceDateTime)
}

const formatAttendanceTime = timeStr => {
	const date = new Date(timeStr)
	const hours = date.getHours().toString().padStart(2, '0')
	const minutes = date.getMinutes().toString().padStart(2, '0')
	const seconds = date.getSeconds().toString().padStart(2, '0')
	return `${hours}:${minutes}:${seconds}`
}

const getTimeSlotLabel = timeStr => {
	const date = new Date(timeStr)
	const hour = date.getHours()

	if (hour >= 6 && hour < 12) {
		return '早上'
	} if (hour >= 12 && hour < 18) {
		return '下午'
	} if (hour >= 18 && hour < 24) {
		return '晚上'
	}
	return '其他'
}

const formatCalendarTitle = date => {
	const dateObj = new Date(date)
	const year = dateObj.getFullYear()
	const month = dateObj.getMonth() + 1
	const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
	return `${year}年 ${monthNames[month - 1]}`
}

const prevMonth = () => {
	const date = new Date(calendarValue.value)
	date.setMonth(date.getMonth() - 1)
	calendarValue.value = date
}

const nextMonth = () => {
	const date = new Date(calendarValue.value)
	date.setMonth(date.getMonth() + 1)
	calendarValue.value = date
}

const goToday = () => {
	calendarValue.value = new Date()
}

const isTimeSlotSigned = (dateStr, timeSlot) => {
	if (!attendanceRecords.value || attendanceRecords.value.length === 0) {
		return false
	}

	return attendanceRecords.value.some(record => {
		if (!record || !record.attendanceDateTime) {
			return false
		}

		const recordDate = new Date(record.attendanceDateTime)
		const [recordDateStr] = recordDate.toISOString().split('T')

		if (recordDateStr !== dateStr) {
			return false
		}

		const hour = recordDate.getHours()

		switch (timeSlot) {
			case 'morning':
				return hour >= 6 && hour < 12
			case 'afternoon':
				return hour >= 12 && hour < 18
			case 'evening':
				return hour >= 18 && hour < 24
			default:
				return false
		}
	})
}


const generateHeatmapData = () => {
	const data = []
	const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
	const timeSlots = ['上午', '下午', '晚上']

	weekDays.forEach((day, dayIndex) => {
		timeSlots.forEach((slot, slotIndex) => {
			let count = 0
			attendanceRecords.value.forEach(record => {
				const date = new Date(record.attendanceDateTime)
				const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1
				const hour = date.getHours()

				if (dayOfWeek === dayIndex) {
					if (slot === '上午' && hour >= 8 && hour < 11) {
						count += 1
					} else if (slot === '下午' && hour >= 14 && hour < 17) {
						count += 1
					} else if (slot === '晚上' && hour >= 19 && hour < 22) {
						count += 1
					}
				}
			})
			data.push([dayIndex, slotIndex, count])
		})
	})

	return data
}

const generateLineData = () => {
	const dateMap = new Map()

	attendanceRecords.value.forEach(record => {
		const date = new Date(record.attendanceDateTime)
		const [dateStr] = date.toISOString().split('T')
		dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1)
	})

	const sortedDates = Array.from(dateMap.keys()).sort()
	const dailyValues = sortedDates.map(date => dateMap.get(date))

	let cumulativeSum = 0
	const cumulativeValues = dailyValues.map(value => {
		cumulativeSum += value
		return cumulativeSum
	})

	return {
		dates: sortedDates,
		values: cumulativeValues
	}
}

const initHeatmapChart = () => {
	if (!heatmapChart.value) { return }

	if (heatmapInstance.value) {
		heatmapInstance.value.dispose()
	}

	heatmapInstance.value = echarts.init(heatmapChart.value)

	const heatmapData = generateHeatmapData()
	const maxValue = Math.max(...heatmapData.map(item => item[2]), 1)

	const option = {
		backgroundColor: 'transparent',
		tooltip: {
			show: false
		},
		grid: {
			height: '60%',
			top: '15%',
			left: '10%',
			right: '10%',
			bottom: '20%'
		},
		xAxis: {
			type: 'category',
			data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
			splitArea: {
				show: true,
				areaStyle: {
					color: themeStore.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
				}
			},
			axisLabel: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 12
			},
			axisLine: {
				lineStyle: {
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			}
		},
		yAxis: {
			type: 'category',
			data: ['上午', '下午', '晚上'],
			splitArea: {
				show: true,
				areaStyle: {
					color: themeStore.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
				}
			},
			axisLabel: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 12
			},
			axisLine: {
				lineStyle: {
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			}
		},
		visualMap: {
			min: 0,
			max: maxValue,
			calculable: false,
			orient: 'horizontal',
			left: 'center',
			bottom: '5%',
			itemWidth: 20,
			itemHeight: 200,
			textStyle: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 11
			},
			inRange: {
				color: themeStore.isDark
					? ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8']
					: ['#fef3c7', '#fde68a', '#f59e0b', '#d97706', '#b45309', '#92400e']
			}
		},
		series: [{
			name: '签到次数',
			type: 'heatmap',
			data: heatmapData,
			label: {
				show: true,
				color: themeStore.isDark ? '#ffffff' : '#1f2937',
				fontSize: 11,
				fontWeight: 'bold'
			},
			emphasis: {
				itemStyle: {
					shadowBlur: 15,
					shadowColor: 'rgba(0, 0, 0, 0.3)',
					borderWidth: 2,
					borderColor: '#fff'
				}
			},
			itemStyle: {
				borderRadius: 4,
				borderWidth: 1,
				borderColor: themeStore.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
			}
		}]
	}

	heatmapInstance.value.setOption(option)
}

const initLineChart = () => {
	if (!lineChart.value) { return }

	if (lineInstance.value) {
		lineInstance.value.dispose()
	}

	lineInstance.value = echarts.init(lineChart.value)

	const lineData = generateLineData()

	const option = {
		backgroundColor: 'transparent',
		tooltip: {
			trigger: 'axis',
			backgroundColor: themeStore.isDark ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.9)',
			borderColor: '#ddd',
			textStyle: {
				color: themeStore.isDark ? '#000' : '#333'
			},
			formatter(params) {
				const date = new Date(params[0].axisValue)
				const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
				return `${formattedDate}<br/>累计签到次数: ${params[0].value}`
			}
		},
		grid: {
			left: '8%',
			right: '8%',
			bottom: '15%',
			top: '15%',
			containLabel: true
		},
		xAxis: {
			type: 'time',
			boundaryGap: false,
			axisLabel: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 11,
				rotate: 45,
				formatter(value) {
					const date = new Date(value)
					return `${date.getMonth() + 1}/${date.getDate()}`
				}
			},
			axisLine: {
				lineStyle: {
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: themeStore.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
				}
			}
		},
		yAxis: {
			type: 'value',
			name: '累计签到次数',
			nameTextStyle: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 12
			},
			axisLabel: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 11
			},
			axisLine: {
				lineStyle: {
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			},
			splitLine: {
				lineStyle: {
					color: themeStore.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
				}
			}
		},
		series: [{
			name: '累计签到次数',
			type: 'line',
			smooth: true,
			symbol: 'circle',
			symbolSize: 6,
			lineStyle: {
				color: '#4fc3f7',
				width: 3
			},
			itemStyle: {
				color: '#4fc3f7',
				borderColor: '#fff',
				borderWidth: 2
			},
			areaStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [{
						offset: 0, color: 'rgba(79, 195, 247, 0.3)'
					}, {
						offset: 1, color: 'rgba(79, 195, 247, 0.05)'
					}]
				}
			},
			emphasis: {
				itemStyle: {
					color: '#0288d1',
					borderColor: '#fff',
					borderWidth: 3,
					shadowBlur: 10,
					shadowColor: 'rgba(79, 195, 247, 0.5)'
				},
				lineStyle: {
					width: 4
				}
			},
			data: lineData.dates.map((date, index) => [date, lineData.values[index]])
		}]
	}

	lineInstance.value.setOption(option)
}

const initCharts = () => {
	initHeatmapChart()
	initLineChart()
}

const loadAttendanceRecords = async () => {
	try {
		const response = await getMyAttendanceRecords()
		if (response && response.code === 200 && response.data) {
			attendanceRecords.value = response.data
			await nextTick()
			initCharts()
		}
	} catch (error) {
		error
	}
}

const loadStudentLevel = () => {
	try {
		const userInfo = userStore.userInfo || JSON.parse(localStorage.getItem('userInfo') || '{}')
		studentLevel.value = userInfo.level || 0
	} catch (error) {
		studentLevel.value = 0
	}
}

const checkSignTime = () => {
	const now = new Date()
	const hour = now.getHours()
	const minute = now.getMinutes()
	const second = now.getSeconds()
	const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
	currentTime.value = timeStr

	const signTimeRanges = [
		{ start: 8, end: 11, name: '上午' },
		{ start: 14, end: 17, name: '下午' },
		{ start: 19, end: 22, name: '晚上' }
	]

	let inTime = false
	let nextTime = ''

	for (const range of signTimeRanges) {
		if (hour >= range.start && hour < range.end) {
			inTime = true
			break
		}
	}

	if (!inTime) {
		for (const range of signTimeRanges) {
			if (hour < range.start) {
				nextTime = `${range.name} ${range.start.toString().padStart(2, '0')}:00`
				break
			}
		}
		if (!nextTime) {
			nextTime = '明天上午 08:00'
		}
	}

	isInSignTime.value = inTime
	nextSignTime.value = nextTime
}


onMounted(async () => {
	try {
		checkSignTime()
		timeInterval.value = setInterval(checkSignTime, 1000)
		loadStudentLevel()
		await loadAttendanceRecords()
	} catch (error) {
		error
	}
})

watch(() => themeStore.isDark, () => {
	nextTick(() => {
		initHeatmapChart()
		initLineChart()
	})
})

onUnmounted(() => {
	if (timeInterval.value) {
		clearInterval(timeInterval.value)
	}
	if (heatmapInstance.value) {
		heatmapInstance.value.dispose()
	}
	if (lineInstance.value) {
		lineInstance.value.dispose()
	}
})
</script>

<template>
	<div class="attendance-container-desktop">
		<div class="background-effects-desktop">
			<div class="gradient-orb-desktop orb-1"/>
			<div class="gradient-orb-desktop orb-2"/>
			<div class="gradient-orb-desktop orb-3"/>
		</div>

		<div class="content-wrapper-desktop">
			<div class="page-title-desktop">
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊学生管理系统"
					class="title-logo-desktop"
					title="切换主题模式"
					@click="toggleTheme"/>
				<h1>AI坊学生签到</h1>
			</div>

			<div class="top-bar-desktop">
				<el-button
					type="primary"
					class="nav-button-desktop"
					:icon="ArrowLeft"
					@click="goToNavigation"
				>
					返回导航
				</el-button>
			</div>


			<div class="motto-corner-desktop">
				<img
					src="@/assets/QunCeQunLiChuangXingGongXing.png"
					alt="群策群力 创新共行"
					class="motto-image-desktop"
				/>
			</div>

			<div class="main-content-desktop">
				<div class="layout-grid-desktop">
					<div class="left-panel-desktop"/>
				</div>

				<div class="chart-item-desktop">
					<div class="chart-title-desktop">签到热力图</div>
					<div ref="heatmapChart" class="chart-content-desktop"/>
				</div>

				<div class="chart-item-desktop">
					<div class="chart-title-desktop">签到趋势图</div>
					<div ref="lineChart" class="chart-content-desktop"/>
				</div>

				<div class="chart-item-desktop">
					<div class="chart-title-desktop">签到记录</div>
					<div class="calendar-container-desktop">
						<el-calendar v-model="calendarValue" class="attendance-calendar-desktop" @click.stop>
							<template #header="{ date }">
								<div class="calendar-header-desktop">
									<div class="header-title">{{ formatCalendarTitle(date) }}</div>
									<div class="header-actions">
										<el-button size="small" @click="prevMonth">上个月</el-button>
										<el-button size="small" @click="goToday">今天</el-button>
										<el-button size="small" @click="nextMonth">下个月</el-button>
									</div>
								</div>
							</template>
							<template #date-cell="{ data }">
								<div
									class="calendar-cell-desktop"
									:class="{ 'has-attendance': getDateAttendanceTimes(data.day).length > 0 }"
								>
									<div class="calendar-cell-wrapper-desktop">
										<div class="cell-date-desktop">{{ data.day.split('-')[2] }}</div>
										<div class="cell-status-desktop">
											<div class="time-slot-status">
												<div
													class="time-slot morning"
													:class="{ 'signed': isTimeSlotSigned(data.day, 'morning') }"
												>
													<span class="time-label">早</span>
													<el-icon
														v-if="isTimeSlotSigned(data.day, 'morning')"
														class="slot-icon"
													>
														<check />
													</el-icon>
												</div>
												<div
													class="time-slot afternoon"
													:class="{ 'signed': isTimeSlotSigned(data.day, 'afternoon') }"
												>
													<span class="time-label">午</span>
													<el-icon
														v-if="isTimeSlotSigned(data.day, 'afternoon')"
														class="slot-icon"
													>
														<check />
													</el-icon>
												</div>
												<div
													class="time-slot evening"
													:class="{ 'signed': isTimeSlotSigned(data.day, 'evening') }"
												>
													<span class="time-label">晚</span>
													<el-icon
														v-if="isTimeSlotSigned(data.day, 'evening')"
														class="slot-icon"
													>
														<check />
													</el-icon>
												</div>
											</div>
										</div>
									</div>
									<div
										v-if="getDateAttendanceTimes(data.day).length > 0"
										class="custom-tooltip-desktop"
										:data-date="data.day"
									>
										<div class="tooltip-content-desktop">
											<div class="tooltip-times-desktop">
												<div
													v-for="(time, index) in getDateAttendanceTimes(data.day)"
													:key="index"
													class="tooltip-time-item-desktop"
												>
													<span class="tooltip-time-slot-desktop">
														{{ getTimeSlotLabel(time) }}
													</span>
													<span class="tooltip-time-text-desktop">
														{{ formatAttendanceTime(time) }}
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</template>
						</el-calendar>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import './css/AttendancePageDesktop.css';
</style>
