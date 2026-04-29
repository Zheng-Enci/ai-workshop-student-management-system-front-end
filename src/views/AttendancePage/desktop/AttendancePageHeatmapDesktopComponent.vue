<template>
	<div ref="chartRef" class="attendance-page-heatmap-desktop-component-chart"/>
</template>

<script setup lang="ts">
/**
 * 签到热力图组件(桌面端)
 *
 * @description 签到热力图ECharts封装组件，用于展示按周几和时段统计的签到次数热力图
 * 数据从AttendancePageDesktop单例获取
 * @component AttendancePageHeatmapDesktopComponent
 * @author ZhengEnCi zheng_enci_work@foxmail.com
 * @date 2026-01
 * @version 1.0.0
 */

import {ref, onMounted, onUnmounted} from 'vue'
import AttendancePageHeatmapDesktopComponent from './ts/AttendancePageHeatmapDesktopComponent'

const chartRef = ref<HTMLElement | null>(null)
let heatmapComponent: AttendancePageHeatmapDesktopComponent | null = null

onMounted(async () => {
	heatmapComponent = new AttendancePageHeatmapDesktopComponent()
	heatmapComponent.chartRef = chartRef
	await heatmapComponent.loadData()
})

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
