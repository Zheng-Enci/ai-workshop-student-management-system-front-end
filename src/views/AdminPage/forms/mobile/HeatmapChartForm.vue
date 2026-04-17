<script setup lang="ts">
/**
 * 考勤热力图组件
 * @description 显示学生考勤热力图的独立组件
 * @component HeatmapChartForm
 * @author AI Workshop
 * @version 1.0.0
 */

import { nextTick, ref, watch } from 'vue'
import { ElButton, ElDialog, ElIcon, ElMessage } from 'element-plus'
import { Calendar, Loading } from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores/theme'
import { HeatmapChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import StudentManagerPageAttendance_Records_Dialog from '@/views/StudentManagerPage/js/StudentManagerPage-Attendance_Records_Dialog'
import StudentManagerPageStudentAttendanceServer from '@/views/StudentManagerPage/js/StudentManagerPageStudentAttendanceServer'

// 注册ECharts组件
echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	VisualMapComponent,
	HeatmapChart,
	CanvasRenderer
])

// ===================== 状态仓库 =====================
const themeStore = useThemeStore()

// ===================== 响应式变量 =====================
/**
 * 热力图弹窗显示状态
 */
const heatmapDialogVisible = ref(false)

/**
 * 弹窗中的热力图DOM引用
 */
const heatmapDialogChart = ref(null)

/**
 * 热力图实例
 */
const heatmapInstance = ref(null)

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
 * 打开热力图弹窗
 * @param {Object} student - 学生对象
 */
const openHeatmapDialog = async (student) => {
	selectedStudent.value = student
	attendanceRecordsLoading.value = true
	heatmapDialogVisible.value = true
	document.body.style.overflow = 'hidden'

	try {
		const records = await StudentManagerPageStudentAttendanceServer.getStudentAttendanceRecords(student.studentId)
		if (records) {
			StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords = records
			await nextTick()
			setTimeout(() => {
				initDialogHeatmapChart()
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
 * 关闭热力图弹窗
 */
const closeHeatmapDialog = () => {
	heatmapDialogVisible.value = false
	document.body.style.overflow = ''
	selectedStudent.value = null
	StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords = []

	if (heatmapInstance.value) {
		heatmapInstance.value.dispose()
		heatmapInstance.value = null
	}
}

/**
 * 初始化弹窗热力图
 */
const initDialogHeatmapChart = () => {
	if (!heatmapDialogChart.value) {
		return
	}

	if (heatmapInstance.value) {
		heatmapInstance.value.dispose()
	}

	try {
		heatmapInstance.value = echarts.init(heatmapDialogChart.value)
	} catch (error) {
		return
	}

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
			data: ['早', '午', '晚'],
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
				// 使用项目主色冰川青(#3CBDB1青色)和辅色深空蓝(#2A5C58深蓝)
				color: themeStore.isDark
					? ['#1a3d3a', '#236b64', '#2c9990', '#35c7bc', '#3CBDB1', '#5ecdc3']
					: ['#e6f7f6', '#b3e8e4', '#80d9d2', '#4dcac0', '#3CBDB1', '#2A5C58']
			}
		},
		series: [{
			name: '签到次数',
			type: 'heatmap',
			data: heatmapData,
			label: {
				show: true,
				color: '#000000',
				fontSize: 10
			},
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}]
	}

	heatmapInstance.value.setOption(option)
}

/**
 * 生成热力图数据
 */
const generateHeatmapData = () => {
	const data = []
	const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
	const timeSlots = ['上午', '下午', '晚上']

	weekDays.forEach((day, dayIndex) => {
		timeSlots.forEach((slot, slotIndex) => {
			let count = 0
			StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords.forEach(record => {
				const date = new Date(record.attendanceDateTime)
				const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1
				const hour = date.getHours()

				if (dayOfWeek === dayIndex) {
					if (slot === '上午' && hour >= 8 && hour < 11) { count++ }
					else if (slot === '下午' && hour >= 14 && hour < 17) { count++ }
					else if (slot === '晚上' && hour >= 19 && hour < 22) { count++ }
				}
			})
			data.push([dayIndex, slotIndex, count])
		})
	})

	return data
}

// ===================== 监听主题变化 =====================
watch(() => themeStore.isDark, () => {
	nextTick(() => {
		setTimeout(() => {
			if (heatmapInstance.value) {
				initDialogHeatmapChart()
			}
		}, 100)
	}, 50)
})

// 暴露方法给父组件
defineExpose({
	openHeatmapDialog
})
</script>

<template>
	<el-dialog
		v-if="heatmapDialogVisible"
		v-model="heatmapDialogVisible"
		:title="`${selectedStudent?.name} 的签到热力图`"
		width="90%"
		class="heatmap-chart-form-dialog"
		destroy-on-close
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		:teleported="true"
		modal-class="heatmap-chart-form-overlay"
		@close="closeHeatmapDialog"
	>
		<div class="heatmap-chart-form-dialog-content">
			<div v-if="attendanceRecordsLoading" class="heatmap-chart-form-loading-container">
				<el-icon class="heatmap-chart-form-loading-icon">
					<loading/>
				</el-icon>
				<p>加载中...</p>
			</div>
			<div v-else-if="!StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords || StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords.length === 0" class="heatmap-chart-form-no-records">
				<el-icon class="heatmap-chart-form-no-records-icon">
					<calendar/>
				</el-icon>
				<p>暂无考勤记录</p>
			</div>
			<div v-else class="heatmap-chart-form-container">
				<div class="heatmap-chart-form-item">
					<div class="heatmap-chart-form-title">签到热力图</div>
					<div ref="heatmapDialogChart" class="heatmap-chart-form-content"/>
				</div>
			</div>
		</div>
		<template #footer>
			<div class="heatmap-chart-form-footer">
				<el-button @click="closeHeatmapDialog" size="large">关闭</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style scoped>
/**
 * 学生管理页面 - 热力图样式
 * @description 定义签到热力图的容器样式，所有样式类名都以heatmap-chart-form为前缀
 */

/* 移动端适配 */
.heatmap-chart-form-dialog {
	max-width: 90%;
}

/* stylelint-disable */
.heatmap-chart-form-dialog :deep(.el-dialog__body) {
	padding: 15px;
	overflow: visible;
}

/* stylelint-disable */
.heatmap-chart-form-dialog :deep(.el-dialog__header) {
	padding: 15px 15px 10px;
}

/* stylelint-disable */
.heatmap-chart-form-dialog :deep(.el-dialog__footer) {
	padding: 10px 15px 15px;
}

.heatmap-chart-form-dialog-content {
	width: 100%;
}

/* ==================== 热力图容器样式 ==================== */

/**
 * 热力图容器
 * 包含热力图的整体布局容器
 */
.heatmap-chart-form-container {
	width: 100%;
	padding: 10px 5px;
}

/**
 * 热力图表项容器
 * 单个热力图的包装容器
 */
.heatmap-chart-form-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

/**
 * 热力图标题
 * 热力图的标题文字
 */
.heatmap-chart-form-title {
	font-size: 16px;
	font-weight: bold;
	margin-bottom: 10px;
	text-align: center;
}

/**
 * 热力图内容区域 - 固定高度
 * ECharts图表的DOM容器，必须有固定高度才能正确渲染
 */
.heatmap-chart-form-content {
	width: 100%;
	height: 350px;
}

/* ==================== 加载状态样式 ==================== */

/**
 * 热力图加载中容器
 * 显示加载图标和文字
 */
.heatmap-chart-form-loading-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40px 20px;
}

/**
 * 热力图加载图标
 * 旋转的加载动画
 */
.heatmap-chart-form-loading-icon {
	font-size: 32px;
	margin-bottom: 12px;
	animation: heatmap-chart-form-rotate 2s linear infinite;
}

/**
 * 热力图加载图标旋转动画
 */
@keyframes heatmap-chart-form-rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

/* ==================== 无数据状态样式 ==================== */

/**
 * 热力图无记录容器
 * 显示空状态图标和提示文字
 */
.heatmap-chart-form-no-records {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40px 20px;
	color: #999;
}

/**
 * 热力图无记录图标
 */
.heatmap-chart-form-no-records-icon {
	font-size: 40px;
	margin-bottom: 12px;
	color: #999;
}

/* ==================== 底部按钮样式 ==================== */
.heatmap-chart-form-footer {
	display: flex;
	justify-content: center;
}

/* stylelint-disable */
.heatmap-chart-form-footer .el-button {
	flex: 1;
}

/* ==================== 夜间模式适配 ==================== */

/**
 * 暗色模式下的热力图无记录文字颜色
 */
html.dark .heatmap-chart-form-no-records {
	color: #6b7280;
}

html.dark .heatmap-chart-form-no-records-icon {
	color: #6b7280;
}

/* ==================== 小屏幕适配 ==================== */
@media screen and (max-width: 375px) {
	/* stylelint-disable */
	.heatmap-chart-form-dialog :deep(.el-dialog__title) {
		font-size: 16px;
	}

	.heatmap-chart-form-title {
		font-size: 14px;
	}

	.heatmap-chart-form-content {
		height: 300px;
	}
}
</style>
