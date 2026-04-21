<template>
	<div class="ip-monitor-page-mobile">
		<!-- 加载蒙版组件 -->
		<LoadingMask/>
		<!-- 页面头部 -->
		<div class="ip-monitor-page-mobile-header-container">
			<!-- 左侧区域：导航按钮和扫描统计 -->
			<div class="ip-monitor-page-mobile-header-left">
				<el-button
					type="primary"
					class="ip-monitor-page-mobile-nav-btn"
					@click="router.push('/navigation')"
				>
					<el-icon>
						<ArrowLeft/>
					</el-icon>
					导航
				</el-button>
			</div>
			<h1 class="ip-monitor-page-mobile-title">IP出现次数统计</h1>
			<!-- Logo图片 - 点击切换日间/夜间模式 -->
			<img
				class="ip-monitor-page-mobile-logo"
				src="/src/assets/AiWorkShop_icon.png"
				alt="AiWorkShop Logo"
				@click="handleLogoClick"
				title="点击切换日间/夜间模式"
			/>
		</div>

		<!-- 主内容区域：扫描统计和IP表格 -->
		<div class="ip-monitor-page-mobile-main-content">
			<!-- IP统计信息 -->
			<div class="ip-monitor-page-mobile-ip-stats">
				<div class="ip-monitor-page-mobile-stats-left">
					<span>坊内总IP: {{ fangIPs.length }}</span>
					<span v-if="maxCount > 0">| 活跃: {{ activeIPCount }}</span>
					<span v-if="maxCount > 0">| 不活跃: {{ inactiveIPCount }}</span>
					<span v-if="maxCount > 0">| 利用率: {{ ipUtilizationRate }}</span>
				</div>
				<div class="ip-monitor-page-mobile-stats-left">
					<span v-if="maxCount > 0">最大: {{ maxCount }}</span>
					<span v-if="maxCount > 0">| 最小: {{ minCount }}</span>
					<span v-if="maxCount > 0">| 平均: {{ avgCount }}</span>
				</div>
			</div>
			<div class="ip-monitor-page-mobile-scan-time-container">
				<div class="ip-monitor-page-mobile-scan-stats">
					{{ timeRangeLabel }}扫描次数：{{ recent7DScans }}
				</div>
			</div>
			<div class="ip-monitor-page-mobile-controls-row">
				<!-- IP配置流程按钮 - 点击打开IP配置对话框 -->
				<el-button
					type="primary"
					class="ip-monitor-page-mobile-config-btn"
					size="small"
					@click="showIPConfigDialog = true"
				>
					IP配置流程
				</el-button>
				<el-select
					v-model="selectedTimeRange"
					class="ip-monitor-page-mobile-time-select"
					size="small"
					placeholder="选择时间范围"
					@change="handleTimeRangeChange"
				>
					<el-option
						label="最近七天"
						:value="7"
					/>
					<el-option
						label="最近一个月"
						:value="30"
					/>
					<el-option
						label="两个月"
						:value="60"
					/>
					<el-option
						label="三个月"
						:value="90"
					/>
					<el-option
						label="四个月"
						:value="120"
					/>
					<el-option
						label="五个月"
						:value="150"
					/>
					<el-option
						label="六个月"
						:value="180"
					/>
				</el-select>
			</div>
		</div>

		<!-- IP热力图表格 -->
		<IPHeatmapMobile
			v-if="(pageData.fangIPs?.fang_ips?.length ?? 0) > 0 && ipCounts && ipRange"
		/>

		<!-- IP出现次数折线图组件 -->
		<IPLineChartMobile
			v-if="(pageData.fangIPs?.fang_ips?.length ?? 0) > 0"
		/>

		<!-- IP配置流程对话框组件 -->
		<IPMonitorPageIPConfigMobileForm
			v-if="showIPConfigDialog"
			v-model="showIPConfigDialog"
			@confirm="handleConfigConfirm"
		/>
	</div>
</template>

<script setup lang="ts">
/**
 * IP监控页面移动端组件
 * 展示IP出现次数统计热力图
 *
 * @component IPMonitorPageMobile
 * @description 使用IPMonitorPageMobile.ts管理数据，展示IP出现次数热力图
 */
import {computed, onMounted, provide, ref, watch} from 'vue'
import {useRouter} from 'vue-router'
import {ElButton, ElIcon, ElOption, ElSelect} from 'element-plus'
import {ArrowLeft} from '@element-plus/icons-vue'
import {useThemeStore} from '@/stores/ts/theme'
import type {IPMonitorPageData} from './mobile/ts/IPMonitorPageMobile'
import IPMonitorPageMobile from './mobile/ts/IPMonitorPageMobile'
import IPHeatmapMobile from './mobile/IPHeatmapMobile.vue'
import IPLineChartMobile from './mobile/IPLineChartMobile.vue'
import LoadingMask from '@/components/LoadingMask.vue'
import IPMonitorPageIPConfigMobileForm from './mobile/forms/IPMonitorPageIPConfigMobileForm.vue'

// Element Plus 基础样式导入(按需导入,减小打包体积)
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-select.css'
import 'element-plus/theme-chalk/el-option.css'
import 'element-plus/dist/index.css'

// ==================== 响应式数据 ====================

/**
 * 路由实例
 * 用于页面导航
 */
const router = useRouter()

/**
 * IP监控页面数据管理实例
 * 使用单例模式获取数据管理类实例
 */
const pageDataManager = IPMonitorPageMobile.getInstance()

/**
 * 页面数据
 */
const pageData = ref<IPMonitorPageData>({
	ipCounts: null,
	scanCount: null,
	fangIPs: null,
	ipRange: null
})

/**
 * 向子组件提供数据管理实例
 */
provide('ipMonitorData', pageDataManager)

/**
 * 是否显示IP配置对话框
 */
const showIPConfigDialog = ref<boolean>(false)

/**
 * 选中的时间范围（天数）
 */
const selectedTimeRange = ref<number>(180)

/**
 * 时间范围标签
 */
const timeRangeLabel = computed(() => {
	const days = selectedTimeRange.value
	if (days === 7) {
		return '最近 7 天'
	}
	if (days <= 30) {
		return '最近 1 个月'
	}
	return `最近 ${Math.floor(days / 30)} 个月`
})

// ==================== 计算属性 ====================

/**
 * 坊内IP列表
 */
const fangIPs = ref<string[]>([])

/**
 * 监听pageData.fangIPs变化，更新fangIPs
 */
watch(
	() => pageData.value.fangIPs?.fang_ips,
	(newVal) => {
		fangIPs.value = newVal || []
	},
	{immediate: true}
)

/**
 * IP计数器
 */
const ipCounter = computed(() => {
	if (!pageData.value.ipCounts?.ip_counts) {
		return new Map<string, number>()
	}
	return new Map(Object.entries(pageData.value.ipCounts.ip_counts))
})

/**
 * IP次数对象
 */
const ipCounts = computed(() => {
	return pageData.value.ipCounts?.ip_counts || {}
})

/**
 * IP范围字符串
 */
const ipRange = computed(() => {
	return pageData.value.ipRange?.ip_range || []
})

/**
 * 最近7天扫描次数
 */
const recent7DScans = computed(() => {
	return pageData.value.scanCount?.scan_count || 0
})

/**
 * 最大次数
 */
const maxCount = computed(() => {
	let max = 0
	ipCounter.value.forEach((count) => {
		if (count > max) {
			max = count
		}
	})
	return max
})

/**
 * 最小次数（非零）
 */
const minCount = computed(() => {
	let min = Infinity
	ipCounter.value.forEach((count) => {
		if (count > 0 && count < min) {
			min = count
		}
	})
	return min === Infinity ? 0 : min
})

/**
 * 活跃IP数
 */
const activeIPCount = computed(() => {
	let count = 0
	ipCounter.value.forEach((value) => {
		if (value > 0) {
			count++
		}
	})
	return count
})

/**
 * 平均次数
 */
const avgCount = computed(() => {
	if (activeIPCount.value === 0) {
		return 0
	}
	let total = 0
	ipCounter.value.forEach((value) => {
		total += value
	})
	return Math.round(total / activeIPCount.value)
})

/**
 * 不活跃IP数
 */
const inactiveIPCount = computed(() => {
	let count = 0
	fangIPs.value.forEach((ip) => {
		const ipCount = ipCounter.value.get(ip) || 0
		if (ipCount === 0) {
			count++
		}
	})
	return count
})

/**
 * IP利用率
 */
const ipUtilizationRate = computed(() => {
	if (fangIPs.value.length === 0) {
		return '0%'
	}
	const rate = (activeIPCount.value / fangIPs.value.length) * 100
	return rate.toFixed(1) + '%'
})

// ==================== 方法 ====================

/**
 * 初始化页面数据
 */
async function initPageData(): Promise<void> {
	const pageDataManager = IPMonitorPageMobile.getInstance()
	await pageDataManager.init_data()
	pageData.value = pageDataManager.getData()

	// 从数据管理类获取保存的时间段
	const timeRange = pageDataManager.getTimeRange()

	// 根据保存的时间戳计算天数
	// 更新下拉框显示
	selectedTimeRange.value = Math.round((timeRange.endTime - timeRange.startTime) / (24 * 60 * 60))
}

/**
 * 处理Logo点击
 */
function handleLogoClick(): void {
	const themeStore = useThemeStore()
	themeStore.toggleTheme()
}

/**
 * 处理IP配置确认
 */
function handleConfigConfirm(): void {
	showIPConfigDialog.value = false
}

/**
 * 处理时间范围变化
 */
async function handleTimeRangeChange(days: number): Promise<void> {
	const endTime = Math.floor(Date.now() / 1000)
	const startTime = endTime - days * 24 * 60 * 60

	const pageDataManager = IPMonitorPageMobile.getInstance()
	await pageDataManager.refreshIPDataByTimeRange(startTime, endTime)
	pageData.value = pageDataManager.getData()
}

// ==================== 生命周期钩子 ====================

/**
 * 组件挂载时初始化数据
 */
onMounted(() => {
	initPageData()
})
</script>

<style>
/**
 * IP监控页面移动端样式
 */
@import './mobile/css/IPMonitorPageMobile.css';
@import './mobile/css/IPLineChartMobile.css';
</style>
