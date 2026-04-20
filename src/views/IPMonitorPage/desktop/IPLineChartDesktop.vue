<template>
	<div
		v-if="hasData"
		class="ip-monitor-page-desktop-line-chart"
	>
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

/**
 * IP出现次数折线图组件
 * 展示坊内IP的出现次数趋势
 *
 * @component IPLineChartDesktop
 * @description 使用echarts绘制折线图，X轴为坊内IP，Y轴为对应出现次数
 */

interface ChartProps {
	/**
	 * 坊内IP列表
	 */
	fangIPs?: string[]
	/**
	 * IP出现次数统计对象
	 */
	ipCounts?: Record<string, number>
	/**
	 * 主题是否为深色模式
	 */
	isDark?: boolean
}

const props = withDefaults(defineProps<ChartProps>(), {
	fangIPs: () => [],
	ipCounts: undefined,
	isDark: false
})

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: ECharts | null = null

/**
 * 图表数据
 * 将坊内IP和对应次数转换为图表数据格式
 */
const chartData = computed(() => {
	const data: {ip: string; count: number}[] = []
	if (!props.fangIPs?.length || !props.ipCounts) {
		return data
	}
	props.fangIPs.forEach((ip) => {
		const count = props.ipCounts[ip] || 0
		data.push({ip, count})
	})
	return data.sort((a, b) => a.count - b.count)
})

/**
 * 是否有数据
 * 判断是否有有效的数据用于显示图表
 */
const hasData = computed(() => {
	return chartData.value.length > 0
})

/**
 * 获取主题颜色
 * 根据深色/浅色模式返回对应的文字和网格颜色
 */
const getThemeColors = () => {
	return {
		textColor: props.isDark ? '#e0e0e0' : '#333333',
		gridColor: props.isDark ? '#333333' : '#e0e0e0',
		lineColor: props.isDark ? '#5bdae2' : '#1a9e9a'
	}
}

/**
 * 初始化图表
 * 创建echarts实例并配置图表选项
 */
const initChart = (): void => {
	if (!chartRef.value) {
		return
	}

	chartInstance = echarts.init(chartRef.value)
	updateChart()
}

/**
 * 更新图表
 * 根据当前数据和主题更新图表配置
 */
const updateChart = (): void => {
	if (!chartInstance) {
		return
	}

	const data = chartData.value
	const colors = getThemeColors()

	const option: echarts.EChartsOption = {
		title: {
			show: false
		},
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

/**
 * 监听数据和主题变化
 * 当IP数据或主题变化时重新渲染图表
 */
watch(
	() => [props.fangIPs, props.ipCounts, props.isDark],
	() => {
		updateChart()
	},
	{deep: true}
)

/**
 * 窗口大小变化时调整图表大小
 */
const handleResize = (): void => {
	if (chartInstance) {
		chartInstance.resize()
	}
}

/**
 * 组件挂载时初始化图表
 */
onMounted(() => {
	initChart()
	window.addEventListener('resize', handleResize)
})

/**
 * 组件卸载前销毁图表实例
 */
onBeforeUnmount(() => {
	if (chartInstance) {
		chartInstance.dispose()
		chartInstance = null
	}
	window.removeEventListener('resize', handleResize)
})
</script>
