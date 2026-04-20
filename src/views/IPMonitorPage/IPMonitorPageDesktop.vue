<template>
	<div class="ip-monitor-page-desktop">
		<!-- 页面头部 -->
		<div class="ip-monitor-page-desktop-header-container">
			<!-- 左侧区域：导航按钮和扫描统计 -->
			<div class="ip-monitor-page-desktop-header-left">
				<el-button
					type="primary"
					class="ip-monitor-page-desktop-nav-btn"
					@click="$router.push('/navigation')"
				>
					<el-icon><ArrowLeft /></el-icon>
					导航
				</el-button>
				<div class="ip-monitor-page-desktop-scan-stats">
					{{ timeRangeLabel }}扫描次数：{{ recent7DScans }}
				</div>
			</div>
			<h1 class="ip-monitor-page-desktop-title">IP出现次数统计</h1>
			<!-- Logo图片 - 点击切换日间/夜间模式 -->
			<img
				class="ip-monitor-page-desktop-logo"
				src="/src/assets/AiWorkShop_icon.png"
				alt="AiWorkShop Logo"
				@click="handleLogoClick"
				title="点击切换日间/夜间模式"
			/>
		</div>

		<!-- 主内容区域：扫描统计和IP表格 -->
		<div class="ip-monitor-page-desktop-main-content">
			<!-- IP统计信息 -->
			<div class="ip-monitor-page-desktop-ip-stats">
				<div class="ip-monitor-page-desktop-stats-left">
					<span>坊内总IP: {{ fangIPs.length }}</span>
					<span v-if="maxCount > 0">| 活跃: {{ activeIPCount }}</span>
					<span v-if="maxCount > 0">| 不活跃: {{ inactiveIPCount }}</span>
					<span v-if="maxCount > 0">| 利用率: {{ ipUtilizationRate }}</span>
					<span v-if="maxCount > 0">| 最大: {{ maxCount }}</span>
					<span v-if="maxCount > 0">| 最小: {{ minCount }}</span>
					<span v-if="maxCount > 0">| 平均: {{ avgCount }}</span>
				</div>
				<el-select
					v-model="selectedTimeRange"
					class="ip-monitor-page-desktop-time-select"
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
			<!-- IP热力图表格 -->
			<IPHeatmapDesktop
				:fang-ips="pageData.fangIPs?.fang_ips || []"
				:ip-counts="pageData.ipCounts?.ip_counts || {}"
				:is-dark="isDarkMode"
			/>
		</div>

		<!-- IP出现次数折线图 -->
		<IPLineChartDesktop
			v-if="pageData.fangIPs?.fang_ips?.length > 0"
			:fang-ips="pageData.fangIPs.fang_ips"
			:ip-counts="pageData.ipCounts?.ip_counts"
			:is-dark="isDarkMode"
		/>
		<div style="display:none">{{ consoleLog(pageData) }}</div>

	</div>
</template>

<script setup lang="ts">
/**
 * IP监控页面桌面端组件
 * 展示IP出现次数统计热力图
 *
 * @component IPMonitorPageDesktop
 * @description 使用IPMonitorPageDesktop.ts管理数据，展示IP出现次数热力图
 */
import {ref, computed, onMounted} from 'vue'
import {ElButton, ElMessage, ElIcon, ElSelect, ElOption} from 'element-plus'
import {ArrowLeft} from '@element-plus/icons-vue'
import {useThemeStore} from '@/stores/ts/theme'
import IPMonitorPageDesktop from './desktop/ts/IPMonitorPageDesktop'
import IPHeatmapDesktop from './desktop/IPHeatmapDesktop.vue'
import IPLineChartDesktop from './desktop/IPLineChartDesktop.vue'
import type {IPMonitorPageData} from './desktop/ts/IPMonitorPageDesktop'

// Element Plus 基础样式导入(按需导入,减小打包体积)

/**
 * el-button 组件样式
 * 提供按钮的基础样式，包括:
 * - 按钮的默认/主要/成功/警告/危险等类型样式
 * - 按钮的尺寸样式(大/中/小)
 * - 按钮的悬停、点击、禁用状态样式
 * - 按钮的圆角、边框、阴影效果
 */
import 'element-plus/theme-chalk/el-button.css'

/**
 * el-message 组件样式
 * 提供消息提示组件的基础样式，包括:
 * - 消息框的定位和层级
 * - 成功/警告/错误/信息等不同类型的颜色样式
 * - 消息图标和关闭按钮的样式
 * - 消息的进入/退出动画效果
 */
import 'element-plus/theme-chalk/el-message.css'

/**
 * el-icon 组件样式
 * 提供图标组件的基础样式，包括:
 * - 图标的尺寸和颜色
 * - 图标的对齐方式
 * - 图标的旋转动画效果
 */
import 'element-plus/theme-chalk/el-icon.css'

/**
 * el-select 组件样式
 * 提供下拉选择框的基础样式，包括:
 * - 选择框的输入区域样式
 * - 下拉菜单的展开动画
 * - 选项的悬停和选中状态
 * - 清除按钮和箭头图标样式
 */
import 'element-plus/theme-chalk/el-select.css'

/**
 * el-option 组件样式
 * 提供下拉选项的基础样式，包括:
 * - 选项的默认、悬停、选中状态
 * - 选项的分组和分隔线样式
 * - 选项的禁用状态样式
 */
import 'element-plus/theme-chalk/el-option.css'

/**
 * Element Plus 全局基础样式
 * 提供组件库的基础通用样式，包括:
 * - CSS变量定义(主题色、字体、间距等)
 * - 基础动画和过渡效果
 * - 图标字体样式
 * - 通用的工具类样式
 */
import 'element-plus/dist/index.css'

// ==================== 响应式数据 ====================

/**
 * 页面数据
 * 存储从IPMonitorPageDesktop获取的所有数据
 */
const pageData = ref<IPMonitorPageData>({
	ipCounts: null,
	scanCount: null,
	fangIPs: null,
	ipRange: null
})

/**
 * 选中的时间范围（天数）
 * 默认最近7天
 */
const selectedTimeRange = ref<number>(7)

/**
 * 时间范围标签
 * 根据选择的天数返回对应的中文标签
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
 * 从页面数据中提取坊内IP列表
 */
const fangIPs = computed(() => {
	return pageData.value.fangIPs?.fang_ips || []
})

/**
 * IP计数器
 * 从页面数据中提取IP出现次数统计
 */
const ipCounter = computed(() => {
	if (!pageData.value.ipCounts?.ip_counts) {
		return new Map<string, number>()
	}
	return new Map(Object.entries(pageData.value.ipCounts.ip_counts))
})

/**
 * 最近7天扫描次数
 * 从页面数据中提取扫描次数
 */
const recent7DScans = computed(() => {
	return pageData.value.scanCount?.scan_count || 0
})

/**
 * 是否为深色模式
 * 从主题store中获取当前主题状态
 */
const isDarkMode = computed(() => {
	const themeStore = useThemeStore()
	return themeStore.isDarkMode
})

/**
 * 最大次数
 * 计算所有IP中出现次数的最大值
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
 * 计算所有IP中出现次数的最小值（排除0次）
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
 * 统计出现次数大于0的IP数量
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
 * 计算所有活跃IP的平均出现次数
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
 * 不活跃IP数（坊内次数为0的IP）
 * 统计坊内IP中出现次数为0的数量
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
 * 计算活跃IP占坊内总IP的百分比
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
 * 控制台日志
 * 用于在模板中输出调试信息
 */
function consoleLog(data: unknown): void {
	console.log('[IPMonitorPageDesktop] template pageData:', data)
}

/**
 * 初始化页面数据
 * 组件挂载时调用，加载初始数据
 */
async function initPageData(): Promise<void> {
	console.log('[IPMonitorPageDesktop] initPageData 开始')
	const pageDataManager = IPMonitorPageDesktop.getInstance()
	await pageDataManager.init_data()
	pageData.value = pageDataManager.getData()
	console.log('[IPMonitorPageDesktop] initPageData 完成, pageData:', pageData.value)
}

/**
 * 处理Logo点击
 * 点击Logo时切换日间/夜间模式
 */
function handleLogoClick(): void {
	const themeStore = useThemeStore()
	themeStore.toggleTheme()
}

/**
 * 处理时间范围变化
 * 当用户选择不同时间范围时刷新数据
 *
 * @param {number} days - 选择的天数
 */
async function handleTimeRangeChange(days: number): Promise<void> {
	const endTime = Math.floor(Date.now() / 1000)
	const startTime = endTime - days * 24 * 60 * 60

	const pageDataManager = IPMonitorPageDesktop.getInstance()
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
 * IP监控页面桌面端样式
 * 从独立CSS文件导入
 */
@import './desktop/css/IPMonitorPageDesktop.css';
@import './desktop/css/IPLineChartDesktop.css';
</style>
