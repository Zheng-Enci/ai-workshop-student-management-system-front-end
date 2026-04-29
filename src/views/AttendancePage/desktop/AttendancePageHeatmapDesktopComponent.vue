<template>
	<div ref="chartRef" class="attendance-page-heatmap-desktop-component-chart"/>
</template>

<script setup lang="ts">
/**
 * 签到热力图组件(桌面端)
 *
 * @description 签到热力图ECharts封装组件，用于展示按周几和时段统计的签到次数热力图
 * @component AttendancePageHeatmapDesktopComponent
 * @author ZhengEnCi zheng_enci_work@foxmail.com
 * @date 2026-01
 * @version 1.0.0
 */

import {ref, onMounted, onUnmounted, watch} from 'vue'
import AttendancePageHeatmapDesktopComponent from './ts/AttendancePageHeatmapDesktopComponent'

/**
 * 签到记录接口
 * @interface AttendanceRecord
 */
interface AttendanceRecord {
	attendanceDateTime: string
}

const props = defineProps<{
	/**
	 * 签到记录数据
	 * @type {AttendanceRecord[]}
	 */
	attendanceRecords: AttendanceRecord[]
}>()

const chartRef = ref<HTMLElement | null>(null)
let heatmapComponent: AttendancePageHeatmapDesktopComponent | null = null

onMounted(() => {
	heatmapComponent = new AttendancePageHeatmapDesktopComponent()
	heatmapComponent.chartRef = chartRef

	if (props.attendanceRecords && props.attendanceRecords.length > 0) {
		heatmapComponent.setData(props.attendanceRecords)
	}
})

watch(() => props.attendanceRecords, (newRecords) => {
	if (heatmapComponent && newRecords) {
		heatmapComponent.setData(newRecords)
	}
}, {deep: true})

onUnmounted(() => {
	if (heatmapComponent) {
		heatmapComponent.dispose()
		heatmapComponent = null
	}
})
</script>

<style scoped>
.attendance-page-heatmap-desktop-component-chart {
	width: 100%;
	height: 100%;
	min-height: 300px;
}
</style>
