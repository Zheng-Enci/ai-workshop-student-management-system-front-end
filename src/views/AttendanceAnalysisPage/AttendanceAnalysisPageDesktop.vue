<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useLoadingMaskStore } from '@/stores/loading'
import LoadingMask from '@/components/LoadingMask.vue'
import DateRangeSelector from './forms/desktop/DateRangeSelector.vue'
import { ElButton, ElIcon } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import AttendanceTrendChart from './ts/attendanceTrendChart'
import { getDateRange, getAttendanceTrendData } from './ts/attendanceTrendChart'

const router = useRouter()
const themeStore = useThemeStore()
const loadingMaskStore = useLoadingMaskStore()
const { toggleTheme } = themeStore

const chartRef = ref(null);
let trendChart: AttendanceTrendChart | null = null;

const timeRange = ref('全部');

const showDateRangeSelector = ref(false);

const timeRanges = [
	{ label: '最近七天', value: '最近七天' },
	{ label: '最近三十天', value: '最近三十天' },
	{ label: '最近三个月', value: '最近三个月' },
	{ label: '最近半年', value: '最近半年' },
	{ label: '最近一年', value: '最近一年' },
	{ label: '全部', value: '全部' }
];

const handleTimeRangeChange = async (range: string) => {
	timeRange.value = range
	loadingMaskStore.showLoadingMask('正在加载签到数据...')
	await updateChartData(range)
	loadingMaskStore.hideLoadingMask()
}

const handleCustomDateRange = async (startDate: string, endDate: string) => {
	timeRange.value = '自定义'
	loadingMaskStore.showLoadingMask('正在加载签到数据...')
	const data = await getAttendanceTrendData(startDate, endDate)
	const dates = data.map(item => item.date)
	const values = data.map(item => item.count)
	if (trendChart) {
		trendChart.setOption(dates, values)
	}
	loadingMaskStore.hideLoadingMask()
}

const updateChartData = async (range: string) => {
	const { startDate, endDate } = getDateRange(range)
	const data = await getAttendanceTrendData(startDate, endDate)
	const dates = data.map(item => item.date)
	const values = data.map(item => item.count)
	if (trendChart) {
		trendChart.setOption(dates, values)
	}
}

const goBack = () => {
	router.push('/navigation-desktop')
}

const handleResize = () => {
	if (trendChart) {
		trendChart.resize()
	}
}

let unwatchTheme: (() => void) | undefined;

onMounted(async () => {
	await nextTick(() => {
		trendChart = new AttendanceTrendChart(chartRef, themeStore.isDarkMode)
		trendChart.init()
		// 监听主题切换并更新图表
		unwatchTheme = watch(
			() => themeStore.isDarkMode,
			(newIsDarkMode) => {
				if (trendChart) {
					trendChart.updateTheme(newIsDarkMode);
				}
			}
		)
		loadingMaskStore.showLoadingMask('正在加载签到数据...')
		const {startDate, endDate} = getDateRange('全部')
		getAttendanceTrendData(startDate, endDate).then(data => {
			const dates = data.map(item => item.date)
			const values = data.map(item => item.count)
			trendChart?.setOption(dates, values)
			loadingMaskStore.hideLoadingMask()
		})
		window.addEventListener('resize', handleResize)
	})
})

onUnmounted(() => {
	if (trendChart) {
		trendChart.dispose()
	}
	unwatchTheme?.();
	window.removeEventListener('resize', handleResize)
})
</script>

<template>
	<div class="attendance-analysis-page">
		<LoadingMask/>
		<div class="header-header">
			<div class="header-header-left">
				<el-button
					class="header-home-btn"
					type="primary"
					circle
					@click="goBack"
				>
					<el-icon><ArrowLeft /></el-icon>
				</el-button>
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="Logo"
					class="header-logo"
					title="切换主题模式"
					@click="toggleTheme"
				/>
				<div class="header-title-section">
					<h1>考勤分析</h1>
					<p>人工智能创作坊</p>
				</div>
			</div>
		</div>
		<div class="attendance-trend-container">
			<div class="attendance-trend-card">
				<div class="attendance-trend-title">签到趋势</div>
				<div class="attendance-trend-buttons">
					<el-button
						v-for="range in timeRanges"
						:key="range.value"
						:type="timeRange === range.value ? 'primary' : 'default'"
						@click="handleTimeRangeChange(range.value)"
					>
						{{ range.label }}
					</el-button>
					<el-button type="default" @click="showDateRangeSelector = true">
						自定义日期
					</el-button>
				</div>
				<div ref="chartRef" class="attendance-trend-content"></div>
			</div>
		</div>
		<DateRangeSelector v-model="showDateRangeSelector" @confirm="handleCustomDateRange" />
	</div>
</template>

<style scoped>
@import './css/desktop/header.css';
@import './css/desktop/page.css';
@import './css/desktop/attendance-trend.css';


const loadStudentDetails = async () => {
	try {
		const details = {}

		for (const record of attendanceRecords.value) {
			const studentId = record.scheduleId
			if (!details[studentId]) {
				try {
					const levelResponse = await getStudentLevel(studentId)
					if (levelResponse && levelResponse.code === 200 && levelResponse.data) {
						details[studentId] = {
							studentId,
							name: record.name,
							levelName: levelResponse.data.levelName
						}
					} else {
						details[studentId] = {
							studentId,
							name: record.name,
							levelName: '社团成员'
						}
					}
				} catch (error) {
					details[studentId] = {
						studentId,
						name: record.name,
						levelName: '社团成员'
					}
				}
			}
		}
		studentDetails.value = details
	} catch (error) {
		ElMessage.error('获取学生详细信息失败')
	}
}

const initPeriodChart = async () => {
	try {
		await nextTick()

		if (!periodChartInstance) {
			if (!periodChart.value) { return }

			await nextTick()
			periodChartInstance = echarts.init(periodChart.value)

			if (periodResizeObserver) {
				periodResizeObserver.disconnect()
			}

			periodResizeObserver = new ResizeObserver(() => {
				window.requestAnimationFrame(() => {
					if (periodChartInstance) {
						periodChartInstance.resize()
					}
				})
			})
			periodResizeObserver.observe(periodChart.value)
		}

		await nextTick()
		window.requestAnimationFrame(() => {
			updatePeriodChart()
		})
	} catch (error) {
		return
	}
}

const updatePeriodChart = () => {
	const total = periodStats.value.morning + periodStats.value.afternoon + periodStats.value.evening
	const currentIsDarkMode = themeStore.isDarkMode

	const option = {
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c}人 ({d}%)',
			backgroundColor: currentIsDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
			borderColor: currentIsDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
			textStyle: {
				color: currentIsDarkMode ? '#ffffff' : '#000000'
			}
		},
		series: [
			{
				name: '签到时段',
				type: 'pie',
				radius: ['40%', '70%'],
				center: ['50%', '45%'],
				avoidLabelOverlap: false,
				roseType: 'radius',
				itemStyle: {
					borderRadius: 8,
					borderColor: currentIsDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
					borderWidth: 2,
					shadowBlur: 20,
					shadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.2)',
					shadowOffsetX: 0,
					shadowOffsetY: 4
				},
				color: [
					'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
					'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
				],
				label: {
					show: true,
					position: 'outside',
					distance: 15,
					formatter(params) {
						const percent = total > 0 ? ((params.value / total) * 100).toFixed(1) : 0
						return `{name|${params.name}}\n{value|${params.value}人}\n{percent|${percent}%}`
					},
					rich: {
						name: {
							fontSize: 12,
							fontWeight: 'bold',
							color: currentIsDarkMode ? '#ffffff' : '#2c3e50',
							textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
							textShadowBlur: currentIsDarkMode ? 2 : 0,
							textShadowOffsetX: currentIsDarkMode ? 1 : 0,
							textShadowOffsetY: currentIsDarkMode ? 1 : 0
						},
						value: {
							fontSize: 14,
							fontWeight: 'bold',
							color: currentIsDarkMode ? '#00d4ff' : '#667eea',
							textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
							textShadowBlur: currentIsDarkMode ? 2 : 0,
							textShadowOffsetX: currentIsDarkMode ? 1 : 0,
							textShadowOffsetY: currentIsDarkMode ? 1 : 0
						},
						percent: {
							fontSize: 10,
							color: currentIsDarkMode ? '#cbd5e1' : '#6b7280',
							textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
							textShadowBlur: currentIsDarkMode ? 2 : 0,
							textShadowOffsetX: currentIsDarkMode ? 1 : 0,
							textShadowOffsetY: currentIsDarkMode ? 1 : 0
						}
					}
				},
				labelLine: {
					show: true,
					length: 20,
					length2: 15,
					lineStyle: {
						color: currentIsDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
						width: 2,
						type: 'solid'
					},
					smooth: 0.2
				},
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					},
					label: {
						show: true,
						fontSize: '14',
						fontWeight: 'bold'
					}
				},
				data: [
					{
						value: periodStats.value.morning,
						name: '上午',
						itemStyle: {
							color: {
								type: 'linear',
								x: 0, y: 0, x2: 1, y2: 1,
								colorStops: [
									{ offset: 0, color: '#ff6b6b' },
									{ offset: 1, color: '#ffa726' }
								]
							}
						}
					},
					{
						value: periodStats.value.afternoon,
						name: '下午',
						itemStyle: {
							color: {
								type: 'linear',
								x: 0, y: 0, x2: 1, y2: 1,
								colorStops: [
									{ offset: 0, color: '#00d4ff' },
									{ offset: 1, color: '#5b21b6' }
								]
							}
						}
					},
					{
						value: periodStats.value.evening,
						name: '晚上',
						itemStyle: {
							color: {
								type: 'linear',
								x: 0, y: 0, x2: 1, y2: 1,
								colorStops: [
									{ offset: 0, color: '#ec4899' },
									{ offset: 1, color: '#8b5cf6' }
								]
							}
						}
					}
				]
			},
			{
				name: '总人数',
				type: 'pie',
				radius: ['0%', '35%'],
				center: ['50%', '50%'],
				label: {
					show: true,
					position: 'center',
					formatter() {
						return `今日签到\n总人数\n${totalAttendance.value}人`
					},
					fontSize: 18,
					fontWeight: 'bold',
					color: currentIsDarkMode ? '#ffffff' : '#000000',
					textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
					textShadowBlur: currentIsDarkMode ? 4 : 0,
					textShadowOffsetX: currentIsDarkMode ? 2 : 0,
					textShadowOffsetY: currentIsDarkMode ? 2 : 0
				},
				itemStyle: {
					color: 'transparent'
				},
				data: [1]
			}
		]
	}

	periodChartInstance.setOption(option)
}

const initTimelineChart = async () => {
	try {
		await nextTick()

		if (!timelineChartInstance) {
			if (!timelineChart.value) { return }

			await nextTick()
			timelineChartInstance = echarts.init(timelineChart.value)

			if (timelineResizeObserver) {
				timelineResizeObserver.disconnect()
			}

			timelineResizeObserver = new ResizeObserver(() => {
				window.requestAnimationFrame(() => {
					if (timelineChartInstance && timelineChart.value) {
						try {
							timelineChartInstance.resize()
						} catch (error) {
							return
						}
					}
				})
			})
			timelineResizeObserver.observe(timelineChart.value)
		}

		if (timelineChartInstance) {
			await nextTick()
			window.requestAnimationFrame(() => {
				updateTimelineChart()
			})
		}
	} catch (error) {
		return
	}
}

const updateTimelineChart = () => {
	if (!timelineChartInstance) { return }

	const currentIsDarkMode = themeStore.isDarkMode
	const data = timelineData.value

	if (selectedTimeRange.value === 'today') {
		const sortedRecords = [...attendanceRecords.value].sort((a, b) =>
			new Date(a.attendanceTime) - new Date(b.attendanceTime)
		)

		const timeData = sortedRecords.map(record => {
			const date = new Date(record.attendanceTime)
			return [
				date.getHours() + date.getMinutes() / 60,
				record.name,
				record.scheduleId,
				record.attendanceTime
			]
		})

		if (timeData.length === 0) {
			return
		}

		const maxTime = timeData.length > 0 ? Math.max(...timeData.map(item => item[0])) : 22
		const minTime = timeData.length > 0 ? Math.min(...timeData.map(item => item[0])) : 8
		const timeRange = maxTime - minTime
		const padding = Math.max(0.5, timeRange * 0.1)

		const option = {
			tooltip: {
				trigger: 'item',
				formatter(params) {
					const { data } = params
					const time = new Date(data[3]).toLocaleTimeString('zh-CN', {
						hour: '2-digit',
						minute: '2-digit',
						second: '2-digit'
					})
					return `${data[1]} (${data[2]})<br/>签到时间: ${time}`
				},
				backgroundColor: currentIsDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
				borderColor: currentIsDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
				textStyle: {
					color: currentIsDarkMode ? '#ffffff' : '#000000'
				}
			},
			grid: {
				left: '5%',
				right: '5%',
				bottom: '10%',
				top: '10%',
				containLabel: true
			},
			xAxis: {
				type: 'value',
				name: '时间',
				nameLocation: 'middle',
				nameGap: 30,
				nameTextStyle: {
					color: currentIsDarkMode ? '#ffffff' : '#000000',
					textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
					textShadowBlur: currentIsDarkMode ? 3 : 0,
					textShadowOffsetX: currentIsDarkMode ? 2 : 0,
					textShadowOffsetY: currentIsDarkMode ? 2 : 0
				},
				min: Math.max(8, minTime - padding),
				max: maxTime,
				interval: timeRange > 6 ? 2 : 0.5,
				axisLabel: {
					formatter(value) {
						const hour = Math.floor(value)
						const minute = Math.round((value - hour) * 60)
						const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
						if (value >= 8 && value < 12) { return `${timeStr} 上午` }
						if (value >= 12 && value < 18) { return `${timeStr} 下午` }
						if (value >= 18 && value <= 22) { return `${timeStr} 晚上` }
						return timeStr
					},
					color: currentIsDarkMode ? '#ffffff' : '#000000',
					textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
					textShadowBlur: currentIsDarkMode ? 3 : 0,
					textShadowOffsetX: currentIsDarkMode ? 2 : 0,
					textShadowOffsetY: currentIsDarkMode ? 2 : 0
				},
				axisLine: {
					lineStyle: {
						color: '#667eea'
					}
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: '#f0f0f0',
						type: 'dashed'
					}
				}
			},
			yAxis: {
				type: 'value',
				name: '签到人数',
				nameLocation: 'middle',
				nameGap: 50,
				nameTextStyle: {
					color: currentIsDarkMode ? '#ffffff' : '#000000',
					textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
					textShadowBlur: currentIsDarkMode ? 3 : 0,
					textShadowOffsetX: currentIsDarkMode ? 2 : 0,
					textShadowOffsetY: currentIsDarkMode ? 2 : 0
				},
				axisLabel: {
					formatter: '{value}人',
					color: currentIsDarkMode ? '#ffffff' : '#000000',
					textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
					textShadowBlur: currentIsDarkMode ? 3 : 0,
					textShadowOffsetX: currentIsDarkMode ? 2 : 0,
					textShadowOffsetY: currentIsDarkMode ? 2 : 0
				},
				axisLine: {
					lineStyle: {
						color: '#667eea'
					}
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: '#f0f0f0',
						type: 'dashed'
					}
				}
			},
			series: [
				{
					name: '签到时间线',
					type: 'scatter',
					data: timeData,
					symbolSize() {
						return 8
					},
					itemStyle: {
						color(params) {
							const hour = params.data[0]
							if (hour >= 8 && hour < 12) { return '#ff6b6b' }
							if (hour >= 14 && hour < 18) { return '#00d4ff' }
							if (hour >= 19 && hour < 22) { return '#ec4899' }
							return '#8b5cf6'
						},
						borderColor: '#fff',
						borderWidth: 2,
						shadowBlur: 10,
						shadowColor: 'rgba(0, 0, 0, 0.3)'
					},
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				},
				{
					name: '签到趋势',
					type: 'line',
					data: timeData.map((item, index) => [item[0], index + 1]),
					lineStyle: {
						color: '#00d4ff',
						width: 3,
						type: 'solid',
						shadowBlur: 10,
						shadowColor: 'rgba(0, 212, 255, 0.3)'
					},
					itemStyle: {
						color: 'transparent'
					},
					areaStyle: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{
									offset: 0,
									color: 'rgba(0, 212, 255, 0.4)'
								},
								{
									offset: 1,
									color: 'rgba(0, 212, 255, 0.1)'
								}
							]
						}
					}
				}
			]
		}

		try {
			timelineChartInstance.setOption(option, true)
		} catch (error) {
			return
		}
	} else {
		if (!data || !Array.isArray(data) || data.length === 0) {
			return
		}

		const filteredData = data.filter(item => {
			if (!item || !item.date) { return false }
			const itemDate = new Date(item.date)
			return itemDate >= PROJECT_LAUNCH_DATE
		}).sort((a, b) => new Date(a.date) - new Date(b.date))

		if (filteredData.length === 0) {
			return
		}

		const dates = filteredData.map(item => item.date)
		const counts = filteredData.map(item => {
			const count = item.attendanceCount
			return typeof count === 'number' ? count : (parseInt(count) || 0)
		})

		const option = {
			tooltip: {
				trigger: 'axis',
				formatter(params) {
					const data = params[0]
					return `${data.name}<br/>签到人数: ${data.value}人`
				},
				backgroundColor: currentIsDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
				borderColor: currentIsDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
				textStyle: {
					color: currentIsDarkMode ? '#ffffff' : '#000000'
				}
			},
			grid: {
				left: '5%',
				right: '5%',
				bottom: '10%',
				top: '10%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data: dates,
				name: '日期',
				nameLocation: 'middle',
				nameGap: 30,
				nameTextStyle: {
					color: currentIsDarkMode ? '#ffffff' : '#000000',
					textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
					textShadowBlur: currentIsDarkMode ? 3 : 0,
					textShadowOffsetX: currentIsDarkMode ? 2 : 0,
					textShadowOffsetY: currentIsDarkMode ? 2 : 0
				},
				axisLabel: {
					color: currentIsDarkMode ? '#ffffff' : '#000000',
					textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
					textShadowBlur: currentIsDarkMode ? 3 : 0,
					textShadowOffsetX: currentIsDarkMode ? 2 : 0,
					textShadowOffsetY: currentIsDarkMode ? 2 : 0,
					rotate: dates.length > 10 ? 45 : 0
				},
				axisLine: {
					lineStyle: {
						color: '#667eea'
					}
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: '#f0f0f0',
						type: 'dashed'
					}
				}
			},
			yAxis: {
				type: 'value',
				name: '签到人数',
				nameLocation: 'middle',
				nameGap: 50,
				nameTextStyle: {
					color: currentIsDarkMode ? '#ffffff' : '#000000',
					textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
					textShadowBlur: currentIsDarkMode ? 3 : 0,
					textShadowOffsetX: currentIsDarkMode ? 2 : 0,
					textShadowOffsetY: currentIsDarkMode ? 2 : 0
				},
				axisLabel: {
					formatter: '{value}人',
					color: currentIsDarkMode ? '#ffffff' : '#000000',
					textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
					textShadowBlur: currentIsDarkMode ? 3 : 0,
					textShadowOffsetX: currentIsDarkMode ? 2 : 0,
					textShadowOffsetY: currentIsDarkMode ? 2 : 0
				},
				axisLine: {
					lineStyle: {
						color: '#667eea'
					}
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: '#f0f0f0',
						type: 'dashed'
					}
				}
			},
			series: [
				{
					name: '每日签到人数',
					type: 'line',
					data: counts,
					smooth: true,
					lineStyle: {
						color: '#00d4ff',
						width: 3,
						type: 'solid',
						shadowBlur: 10,
						shadowColor: 'rgba(0, 212, 255, 0.3)'
					},
					itemStyle: {
						color: '#00d4ff',
						borderColor: '#fff',
						borderWidth: 2,
						shadowBlur: 10,
						shadowColor: 'rgba(0, 212, 255, 0.3)'
					},
					areaStyle: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{
									offset: 0,
									color: 'rgba(0, 212, 255, 0.4)'
								},
								{
									offset: 1,
									color: 'rgba(0, 212, 255, 0.1)'
								}
							]
						}
					},
					emphasis: {
						itemStyle: {
							shadowBlur: 15,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 212, 255, 0.5)'
						}
					}
				}
			]
		}

		try {
			timelineChartInstance.setOption(option, true)
		} catch (error) {
			return
		}
	}
}

const loadTimelineData = async () => {
	try {
		let startTime, endTime

		switch (selectedTimeRange.value) {
			case 'today': {
				const today = new Date()
				startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
				endTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
				break
			}
			case 'yesterday': {
				const yesterday = new Date()
				yesterday.setDate(yesterday.getDate() - 1)
				startTime = ensureTimeNotBeforeLaunch(new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0))
				endTime = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59)
				break
			}
			case 'week': {
				const now = new Date()
				const dayOfWeek = now.getDay()
				const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
				const monday = new Date(now.setDate(diff))
				startTime = ensureTimeNotBeforeLaunch(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate(), 0, 0, 0))
				endTime = new Date()
				break
			}
			case 'lastWeek': {
				const now = new Date()
				const dayOfWeek = now.getDay()
				const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
				const thisWeekMonday = new Date(now.setDate(diff))
				const lastWeekMonday = new Date(thisWeekMonday)
				lastWeekMonday.setDate(thisWeekMonday.getDate() - 7)
				const lastWeekSunday = new Date(lastWeekMonday)
				lastWeekSunday.setDate(lastWeekMonday.getDate() + 6)
				startTime = ensureTimeNotBeforeLaunch(new Date(lastWeekMonday.getFullYear(), lastWeekMonday.getMonth(), lastWeekMonday.getDate(), 0, 0, 0))
				endTime = new Date(lastWeekSunday.getFullYear(), lastWeekSunday.getMonth(), lastWeekSunday.getDate(), 23, 59, 59)
				break
			}
			case 'month': {
				const now = new Date()
				startTime = ensureTimeNotBeforeLaunch(new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0))
				endTime = new Date()
				break
			}
			case 'lastMonth': {
				const now = new Date()
				const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
				const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
				startTime = ensureTimeNotBeforeLaunch(new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1, 0, 0, 0))
				endTime = new Date(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth(), lastMonthEnd.getDate(), 23, 59, 59)
				break
			}
			case 'last7days': {
				const now = new Date()
				const sevenDaysAgo = new Date(now)
				sevenDaysAgo.setDate(now.getDate() - 6)
				startTime = ensureTimeNotBeforeLaunch(new Date(sevenDaysAgo.getFullYear(), sevenDaysAgo.getMonth(), sevenDaysAgo.getDate(), 0, 0, 0))
				endTime = new Date()
				break
			}
			case 'last30days': {
				const now = new Date()
				const thirtyDaysAgo = new Date(now)
				thirtyDaysAgo.setDate(now.getDate() - 29)
				startTime = ensureTimeNotBeforeLaunch(new Date(thirtyDaysAgo.getFullYear(), thirtyDaysAgo.getMonth(), thirtyDaysAgo.getDate(), 0, 0, 0))
				endTime = new Date()
				break
			}
			case 'year': {
				const now = new Date()
				startTime = ensureTimeNotBeforeLaunch(new Date(now.getFullYear(), 0, 1, 0, 0, 0))
				endTime = new Date()
				break
			}
			case 'all': {
				startTime = PROJECT_LAUNCH_DATE
				endTime = new Date()
				break
			}
			case 'custom': {
				if (customDateRange.value && customDateRange.value.length === 2) {
					startTime = ensureTimeNotBeforeLaunch(new Date(customDateRange.value[0]))
					endTime = new Date(customDateRange.value[1])
					endTime.setHours(23, 59, 59, 999)
				} else {
					return
				}
				break
			}
			default:
				return
		}

		const response = await getDailyAttendanceCountInRange(
			startTime.toISOString(),
			endTime.toISOString()
		)

		if (response && response.code === 200) {
			timelineData.value = response.data || []
			await nextTick()
			if (timelineChartInstance) {
				updateTimelineChart()
			}
		}
	} catch (error) {
		ElMessage.error(error.message || '加载时间线数据失败')
	}
}

const loadAttendanceData = async () => {
	try {
		isLoading.value = true

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

			await loadStudentDetails()

			setTimeout(() => {
				initChartsWithTheme()
			}, 200)

			if (selectedTimeRange.value === 'today' && timelineChartInstance) {
				await nextTick()
				updateTimelineChart()
			}
		}
	} catch (error) {
		ElMessage.error(error.message || '加载签到数据失败')
	} finally {
		isLoading.value = false
	}
}

const refreshData = () => {
	loadAttendanceData()
	loadTimelineData()
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
	window.addEventListener('error', event => {
		if (event.message.includes('ResizeObserver loop completed with undelivered notifications')) {
			event.preventDefault()
			event.stopPropagation()
			return false
		}
	})

	await new Promise(resolve => setTimeout(resolve, 100))
	loadAttendanceData()
	loadTimelineData()
	startAutoRefresh()
})

onUnmounted(() => {
		stopAutoRefresh()
		if (resizeTimeout) {
			clearTimeout(resizeTimeout)
		}
		if (periodResizeObserver) {
			periodResizeObserver.disconnect()
		}
		if (timelineResizeObserver) {
			timelineResizeObserver.disconnect()
		}
		if (periodChartInstance) {
			periodChartInstance.dispose()
		}
		if (timelineChartInstance) {
			timelineChartInstance.dispose()
		}
	})
</script>
