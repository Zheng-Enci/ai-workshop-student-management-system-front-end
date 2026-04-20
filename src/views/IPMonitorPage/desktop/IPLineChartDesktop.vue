<template>
	<div class="ip-monitor-page-desktop-line-chart">
		<h3 class="ip-monitor-page-desktop-line-chart-title">
			坊内IP出现次数趋势
		</h3>
		<div
			ref="chartContainerRef"
			class="ip-monitor-page-desktop-line-chart-container"
		/>
	</div>
</template>

<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount} from 'vue'
import {IPLineChartDesktop} from './ts/IPLineChartDesktop'

interface ChartProps {
	fangIPs?: string[]
	ipCounts?: Record<string, number>
	isDark?: boolean
}

const props = defineProps<ChartProps>()

console.log('[IPLineChartDesktop] props received:', props)

const chartContainerRef = ref<HTMLDivElement | null>(null)
let chartInstance: IPLineChartDesktop | null = null

onMounted(() => {
	console.log('[IPLineChartDesktop] onMounted')
	if (chartContainerRef.value) {
		chartInstance = new IPLineChartDesktop(props)
		chartInstance.ref = chartContainerRef.value
		chartInstance.mount()
	}
})

onBeforeUnmount(() => {
	if (chartInstance) {
		chartInstance.unmount()
		chartInstance = null
	}
})
</script>
