<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useLoadingMaskStore } from '@/stores/loading'
import LoadingMask from '@/components/LoadingMask.vue'
import DateRangeSelector from './forms/desktop/DateRangeSelector.vue'
import { ElButton, ElIcon, ElSelect, ElOption } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

import 'element-plus/theme-chalk/el-select.css'
import 'element-plus/theme-chalk/el-option.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-icon.css'

import AttendanceTrendChart from './ts/attendanceTrendChart'
import { getDateRange, getAttendanceTrendData } from './ts/attendanceTrendChart'

const router = useRouter()
const themeStore = useThemeStore()
const loadingMaskStore = useLoadingMaskStore()
const { toggleTheme } = themeStore

const chartRef = ref(null)
let trendChart: AttendanceTrendChart | null = null

const timeRange = ref('全部')

const showDateRangeSelector = ref(false)

const timeRanges = [
	{ label: '最近七天', value: '最近七天' },
	{ label: '最近三十天', value: '最近三十天' },
	{ label: '最近三个月', value: '最近三个月' },
	{ label: '最近半年', value: '最近半年' },
	{ label: '最近一年', value: '最近一年' },
	{ label: '全部', value: '全部' }
]

const handleTimeRangeChange = async (range: string) => {
	if (!range) return
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
	router.back()
}

const handleResize = () => {
	if (trendChart) {
		trendChart.resize(undefined, 150)
	}
}

let unwatchTheme: (() => void) | undefined

onMounted(async () => {
	await nextTick(() => {
		trendChart = new AttendanceTrendChart(chartRef, themeStore.isDarkMode)
		trendChart.init()
		if (chartRef.value) {
			chartRef.value.style.height = '150px'
		}
		trendChart.resize(undefined, 150)
		unwatchTheme = watch(
			() => themeStore.isDarkMode,
			(newIsDarkMode) => {
				if (trendChart) {
					trendChart.updateTheme(newIsDarkMode)
				}
			}
		)
		loadingMaskStore.showLoadingMask('正在加载签到数据...')
		const { startDate, endDate } = getDateRange('全部')
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
	unwatchTheme?.()
	window.removeEventListener('resize', handleResize)
})
</script>

<template>
	<div class="attendance-analysis-mobile-page">
		<LoadingMask/>
		<div class="attendance-analysis-mobile-header">
			<div class="attendance-analysis-mobile-header-left">
				<el-button
					type="text"
					class="attendance-analysis-mobile-back-btn"
					:icon="ArrowLeft"
					@click="goBack"
				></el-button>
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="Logo"
					class="attendance-analysis-mobile-logo"
					title="切换主题模式"
					@click="toggleTheme"
				/>
			</div>
			<div class="attendance-analysis-mobile-header-center">考勤分析</div>
			<div class="attendance-analysis-mobile-header-right"></div>
		</div>

		<div class="attendance-analysis-mobile-content">
			<div class="attendance-analysis-mobile-card">
				<div class="attendance-analysis-mobile-title">签到趋势</div>
				<div class="attendance-analysis-mobile-controls">
					<el-select
						v-model="timeRange"
						size="small"
						class="attendance-analysis-mobile-select"
						@change="handleTimeRangeChange"
					>
						<el-option
							v-for="range in timeRanges"
							:key="range.value"
							:label="range.label"
							:value="range.value"
						/>
					</el-select>
					<el-button size="small" @click="showDateRangeSelector = true">
						自定义
					</el-button>
				</div>
				<div ref="chartRef" class="attendance-analysis-mobile-chart"></div>
			</div>
		</div>

		<DateRangeSelector v-model="showDateRangeSelector" @confirm="handleCustomDateRange" />
	</div>
</template>

<style scoped>
@import './css/mobile/attendance-analysis-mobile.css';

:deep(.el-select__wrapper) {
  background: transparent !important;
  box-shadow: none !important;
  border: 1px solid rgb(0 0 0 / 0.1) !important;
}

:deep(.el-select__selection) {
  background: transparent !important;
}

:deep(.el-button) {
  background: transparent !important;
  border: 1px solid rgb(0 0 0 / 0.1) !important;
}

:deep(.el-input__wrapper) {
  background: transparent !important;
  box-shadow: none !important;
}
</style>
