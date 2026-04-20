<template>
	<div class="ip-monitor-page-desktop-line-chart">
		<h3 class="ip-monitor-page-desktop-line-chart-title">
			坊内IP出现次数趋势
		</h3>
		<div
			ref="chartRef"
			class="ip-monitor-page-desktop-line-chart-container"
		/>
	</div>
</template>

<script setup lang="ts">
import {ref, computed, watch, onMounted, onBeforeUnmount} from 'vue'
import * as echarts from 'echarts'
import type {ECharts} from 'echarts'

interface ChartProps {
	fangIPs: string[]
	ipCounts: Record<string, number>
	isDark?: boolean
}

const props = withDefaults(defineProps<ChartProps>(), {
	fangIPs: () => [],
	ipCounts: () => ({}),
	isDark: false
})

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: ECharts | null = null

const chartData = computed(() => {
	const data: {ip: string; count: number}[] = []
	console.log('chartData:', props.fangIPs, props.ipCounts)
	if (!props.fangIPs || props.fangIPs.length === 0 || !props.ipCounts) {
		console.log('No data - returning empty')
		return data
	}
	props.fangIPs.forEach((ip) => {
		const count = props.ipCounts[ip] || 0
		data.push({ip, count})
	})
	console.log('chartData result:', data)
	return data.sort((a, b) => a.count - b.count)
})

const getThemeColors = () => {
	return {
		textColor: props.isDark ? '#e0e0e0' : '#333333',
		gridColor: props.isDark ? '#333333' : '#e0e0e0',
		lineColor: props.isDark ? '#5bdae2' : '#1a9e9a'
	}
}

const initChart = (): void => {
	if (!chartRef.value) {
		return
	}
	chartInstance = echarts.init(chartRef.value)
	updateChart()
}

const updateChart = (): void => {
	if (!chartInstance) {
		return
	}

	const data = chartData.value
	const colors = getThemeColors()

	if (data.length === 0) {
		return
	}

	const option: echarts.EChartsOption = {
		tooltip: {
			trigger: 'axis',
			backgroundColor: props.isDark ? '#2c2c2c' : '#ffffff',
			borderColor: colors.gridColor,
			textStyle: {
				color: colors.textColor
			},
			formatter: (params: unknown) => {
				const p = params as {name: string; value: number}[]
				if (p && p[0]) {
					return `IP: ${p[0].name}<br/>次数: ${p[0].value}`
				}
				return ''
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
			data: data.map((d) => d.ip),
			axisLine: {
				lineStyle: {
					color: colors.gridColor
				}
			},
			axisLabel: {
				color: colors.textColor,
				rotate: 45,
				fontSize: 10,
				interval: Math.floor(data.length / 10)
			},
			axisTick: {
				alignWithLabel: true
			}
		},
		yAxis: {
			type: 'value',
			name: '出现次数',
			nameTextStyle: {
				color: colors.textColor,
				padding: [0, 0, 0, 40]
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: colors.gridColor
				}
			},
			axisLabel: {
				color: colors.textColor
			},
			splitLine: {
				lineStyle: {
					color: colors.gridColor,
					type: 'dashed'
				}
			}
		},
		series: [
			{
				name: '出现次数',
				type: 'line',
				data: data.map((d) => d.count),
				smooth: true,
				symbol: 'circle',
				symbolSize: 6,
				lineStyle: {
					color: colors.lineColor,
					width: 2
				},
				itemStyle: {
					color: colors.lineColor
				},
				areaStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{
							offset: 0,
							color: props.isDark ? 'rgba(91, 217, 212, 0.4)' : 'rgba(26, 158, 154, 0.4)'
						},
						{
							offset: 1,
							color: props.isDark ? 'rgba(91, 217, 212, 0.05)' : 'rgba(26, 158, 154, 0.05)'
						}
					])
				}
			}
		]
	}

	chartInstance.setOption(option)
}

watch(
	() => [props.fangIPs, props.ipCounts, props.isDark],
	() => {
		if (chartInstance) {
			updateChart()
		}
	},
	{deep: true}
)

const handleResize = (): void => {
	if (chartInstance) {
		chartInstance.resize()
	}
}

onMounted(() => {
	initChart()
	window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
	if (chartInstance) {
		chartInstance.dispose()
		chartInstance = null
	}
	window.removeEventListener('resize', handleResize)
})
</script>
