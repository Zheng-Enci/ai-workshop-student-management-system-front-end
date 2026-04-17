<script setup>
/**
 * 考勤趋势图组件
 * @description 显示学生考勤趋势图的独立组件
 * @component TrendChartForm
 * @author AI Workshop
 * @version 1.0.0
 */

import { nextTick, ref, watch } from 'vue'
import { ElButton, ElDialog, ElIcon, ElMessage } from 'element-plus'
import { Calendar, Loading } from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores/theme'
import { LineChart } from 'echarts/charts'
import { GridComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import StudentManagerPageAttendance_Records_Dialog from '@/views/StudentManagerPage/js/StudentManagerPage-Attendance_Records_Dialog'
import StudentManagerPageStudentAttendanceServer from '@/views/StudentManagerPage/js/StudentManagerPageStudentAttendanceServer'

// 注册ECharts组件
echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LineChart,
	CanvasRenderer
])

// ===================== 状态仓库 =====================
const themeStore = useThemeStore()

// ===================== 响应式变量 =====================
/**
 * 趋势图弹窗显示状态
 */
const trendChartDialogVisible = ref(false)

/**
 * 弹窗中的趋势图DOM引用
 */
const trendDialogChart = ref(null)

/**
 * 趋势图实例
 */
const lineInstance = ref(null)

/**
 * 选中的学生
 */
const selectedStudent = ref(null)

/**
 * 考勤记录加载状态
 */
const attendanceRecordsLoading = ref(false)

// ===================== 方法函数 =====================

/**
 * 打开趋势图弹窗
 * @param {Object} student - 学生对象
 */
const openTrendChartDialog = async (student) => {
	selectedStudent.value = student
	attendanceRecordsLoading.value = true
	trendChartDialogVisible.value = true
	document.body.style.overflow = 'hidden'

	try {
		const records = await StudentManagerPageStudentAttendanceServer.getStudentAttendanceRecords(student.studentId)
		if (records) {
			StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords = records
			await nextTick()
			setTimeout(() => {
				initDialogLineChart()
			}, 100)
		} else {
			ElMessage.error('获取考勤记录失败')
		}
	} catch (error) {
		ElMessage.error(`获取考勤记录失败：${error.message}`)
	} finally {
		attendanceRecordsLoading.value = false
	}
}

/**
 * 关闭趋势图弹窗
 */
const closeTrendChartDialog = () => {
	trendChartDialogVisible.value = false
	document.body.style.overflow = ''
	selectedStudent.value = null
	StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords = []

	if (lineInstance.value) {
		lineInstance.value.dispose()
		lineInstance.value = null
	}
}

/**
 * 初始化弹窗趋势图
 */
const initDialogLineChart = () => {
	if (!trendDialogChart.value) {
		console.error('趋势图容器不存在')
		return
	}

	if (lineInstance.value) {
		lineInstance.value.dispose()
	}

	try {
		lineInstance.value = echarts.init(trendDialogChart.value)
	} catch (error) {
		console.error('ECharts初始化失败:', error)
		return
	}

	const lineData = generateLineData()

	const option = {
		backgroundColor: 'transparent',
		tooltip: {
			trigger: 'axis',
			backgroundColor: themeStore.isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
			borderColor: themeStore.isDark ? '#333' : '#ddd',
			textStyle: {
				color: themeStore.isDark ? '#fff' : '#333'
			},
			formatter(params) {
				const date = params[0].axisValue
				const { value } = params[0]
				return `日期: ${date}<br/>累计签到: ${value}次`
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
			boundaryGap: false,
			data: lineData.dates,
			axisLabel: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 10,
				rotate: 45
			},
			axisLine: {
				lineStyle: {
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			}
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 12
			},
			axisLine: {
				lineStyle: {
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			},
			splitLine: {
				lineStyle: {
					color: themeStore.isDark ? '#333' : '#eee'
				}
			}
		},
		series: [{
			name: '累计签到次数',
			type: 'line',
			stack: 'Total',
			data: lineData.values,
			smooth: true,
			lineStyle: {
				color: '#50a3ba',
				width: 3
			},
			areaStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [{
						offset: 0,
						color: 'rgba(80, 163, 186, 0.3)'
					}, {
						offset: 1,
						color: 'rgba(80, 163, 186, 0.1)'
					}]
				}
			},
			itemStyle: {
				color: '#50a3ba'
			},
			emphasis: {
				focus: 'series'
			}
		}]
	}

	lineInstance.value.setOption(option)
}

/**
 * 生成趋势图数据
 */
const generateLineData = () => {
	// 1. 统计每个日期的签到次数
	const dateMap = new Map()
	StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords.forEach(record => {
		const date = new Date(record.attendanceDateTime)
		const dateStr = date.toISOString().split('T')[0]
		dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1)
	})

	// 2. 获取日期范围
	const sortedDates = Array.from(dateMap.keys()).sort()
	if (sortedDates.length === 0) {
		return { dates: [], values: [] }
	}

	const startDate = new Date(sortedDates[0])
	const endDate = new Date(sortedDates[sortedDates.length - 1])

	// 3. 生成完整日期列表（从最早到最晚，每一天都包含）
	const completeDates = []
	const currentDate = new Date(startDate)
	while (currentDate <= endDate) {
		completeDates.push(currentDate.toISOString().split('T')[0])
		currentDate.setDate(currentDate.getDate() + 1)
	}

	// 4. 填充数据，没有记录的日期补0
	const dailyValues = completeDates.map(date => dateMap.get(date) || 0)

	// 5. 计算累计值
	let cumulativeSum = 0
	const cumulativeValues = dailyValues.map(value => {
		cumulativeSum += value
		return cumulativeSum
	})

	return {
		dates: completeDates,
		values: cumulativeValues
	}
}

// ===================== 监听主题变化 =====================
watch(() => themeStore.isDark, () => {
	nextTick(() => {
		setTimeout(() => {
			if (lineInstance.value) {
				initDialogLineChart()
			}
		}, 100)
	}, 50)
})

// 暴露方法给父组件
defineExpose({
	openTrendChartDialog
})
</script>

<template>
	<el-dialog
		v-if="trendChartDialogVisible"
		v-model="trendChartDialogVisible"
		:title="`${selectedStudent?.name} 的签到趋势图`"
		width="80%"
		class="trend-chart-dialog"
		destroy-on-close
		:close-on-click-modal="false"
		:append-to-body="true"
		:teleported="true"
		modal-class="trend-overlay"
		@close="closeTrendChartDialog"
	>
		<div class="TrendChartForm-dialog-content">
			<div v-if="attendanceRecordsLoading" class="TrendChartForm-loading-container">
				<el-icon class="TrendChartForm-loading-icon">
					<loading/>
				</el-icon>
				<p>加载中...</p>
			</div>
			<div v-else-if="!StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords || StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords.length === 0" class="TrendChartForm-no-records">
				<el-icon class="TrendChartForm-no-records-icon">
					<calendar/>
				</el-icon>
				<p>暂无考勤记录</p>
			</div>
			<div v-else class="TrendChartForm-container">
				<div class="TrendChartForm-item">
					<div class="TrendChartForm-title">签到趋势图</div>
					<div ref="trendDialogChart" class="TrendChartForm-content"/>
				</div>
			</div>
		</div>
		<template #footer>
			<div class="admin-page-desktop-dialog-footer">
				<el-button @click="closeTrendChartDialog">关闭</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style scoped>
/**
 * 趋势图组件样式
 */

.TrendChartForm-dialog-content {
	width: 100%;
}

/* ==================== 趋势图容器样式 ==================== */
.TrendChartForm-container {
	width: 100%;
	padding: 20px;
}

.TrendChartForm-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.TrendChartForm-title {
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 15px;
	text-align: center;
}

.TrendChartForm-content {
	width: 100%;
	height: 400px;
}

/* ==================== 加载状态样式 ==================== */
.TrendChartForm-loading-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60px 20px;
}

.TrendChartForm-loading-icon {
	font-size: 40px;
	margin-bottom: 16px;
	animation: TrendChartForm-rotate 2s linear infinite;
}

@keyframes TrendChartForm-rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

/* ==================== 无数据状态样式 ==================== */
.TrendChartForm-no-records {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60px 20px;
	color: #999;
}

.TrendChartForm-no-records-icon {
	font-size: 48px;
	margin-bottom: 16px;
	color: #999;
}

/* ==================== 夜间模式适配 ==================== */

html.dark .TrendChartForm-no-records {
	color: #6b7280;
}

html.dark .TrendChartForm-no-records-icon {
	color: #6b7280;
}
</style>
