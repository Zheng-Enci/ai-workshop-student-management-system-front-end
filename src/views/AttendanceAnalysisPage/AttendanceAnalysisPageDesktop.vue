<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { ElButton, ElIcon } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import AttendanceTrendChart from './ts/attendanceTrendChart'

const router = useRouter()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore

const chartRef = ref(null);
let trendChart: AttendanceTrendChart | null = null;

const timeRange = ref('最近七天');

const timeRanges = [
	{ label: '最近一天', value: '最近一天' },
	{ label: '最近七天', value: '最近七天' },
	{ label: '最近三十天', value: '最近三十天' },
	{ label: '最近三个月', value: '最近三个月' },
	{ label: '最近半年', value: '最近半年' },
	{ label: '最近一年', value: '最近一年' },
	{ label: '全部', value: '全部' }
];

const handleTimeRangeChange = (range: string) => {
	timeRange.value = range;
};

const goBack = () => {
	router.push('/navigation-desktop')
}

const handleResize = () => {
	if (trendChart) {
		trendChart.resize()
	}
}

onMounted(() => {
	nextTick(() => {
		trendChart = new AttendanceTrendChart(chartRef, themeStore.isDark)
		trendChart.init()
		trendChart.setOption([], [])
		window.addEventListener('resize', handleResize)
	})
})

onUnmounted(() => {
	if (trendChart) {
		trendChart.dispose()
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
				</div>
				<div ref="chartRef" class="attendance-trend-content"></div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import './css/desktop/header.css';
@import './css/desktop/page.css';
@import './css/desktop/attendance-trend.css';
</style>
