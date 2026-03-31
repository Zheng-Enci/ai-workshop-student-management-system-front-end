<script setup>
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { ElButton, ElIcon } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { LineChart } from 'echarts/charts'
import { GridComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LineChart,
	CanvasRenderer
])

const router = useRouter()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore

const chartRef = ref(null)
const chartInstance = ref(null)

const goBack = () => {
	router.push('/navigation-desktop')
}

const initChart = () => {
	if (!chartRef.value) return

	if (chartInstance.value) {
		chartInstance.value.dispose()
	}

	chartInstance.value = echarts.init(chartRef.value)

	const option = {
		backgroundColor: 'transparent',
		tooltip: {
			trigger: 'axis',
			backgroundColor: themeStore.isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
			borderColor: themeStore.isDark ? '#333' : '#ddd',
			textStyle: {
				color: themeStore.isDark ? '#fff' : '#333'
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
			data: [],
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
			name: '签到人次',
			type: 'line',
			stack: 'Total',
			data: [],
			smooth: true,
			lineStyle: {
				color: '#667eea',
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
						color: 'rgba(102, 126, 234, 0.3)'
					}, {
						offset: 1,
						color: 'rgba(102, 126, 234, 0.1)'
					}]
				}
			},
			itemStyle: {
				color: '#667eea'
			}
		}]
	}

	chartInstance.value.setOption(option)
}

const handleResize = () => {
	if (chartInstance.value) {
		chartInstance.value.resize()
	}
}

onMounted(() => {
	nextTick(() => {
		initChart()
		window.addEventListener('resize', handleResize)
	})
})

onUnmounted(() => {
	if (chartInstance.value) {
		chartInstance.value.dispose()
	}
	window.removeEventListener('resize', handleResize)
})
</script>

<template>
	<div class="attendance-analysis-page">
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
		<div class="chart-container">
			<div class="chart-card">
				<div class="chart-title">签到人次趋势</div>
				<div ref="chartRef" class="chart-content"></div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import './css/desktop/header.css';
@import './css/desktop/page.css';
@import './css/desktop/chart.css';
</style>
