<template>
	<div class="ip-monitor-page-desktop">
		<!-- 页面头部 -->
		<div class="ip-monitor-page-desktop-header-container">
			<!-- 导航按钮 -->
			<el-button
				type="primary"
				class="ip-monitor-page-desktop-nav-btn"
				@click="$router.push('/navigation')"
			>
				<el-icon><ArrowLeft /></el-icon>
				导航
			</el-button>
			<h1 class="ip-monitor-page-desktop-title">IP出现次数统计</h1>
            <!-- Logo图片 -->
            <img
                class="ip-monitor-page-desktop-logo"
                src="/src/assets/AiWorkShop_icon.png"
                alt="AiWorkShop Logo"
            />
		</div>

		<!-- 主内容区域：扫描统计和IP表格 -->
		<div class="ip-monitor-page-desktop-main-content">
			<!-- 扫描统计信息 -->
			<div class="ip-monitor-page-desktop-scan-stats">
				最近7天扫描次数：{{ recent7DScans }}
			</div>
			<!-- IP热力图表格 -->
			<table class="ip-monitor-page-desktop-ip-table">
				<tr
					v-for="row in 10"
					:key="row"
				>
					<td
						v-for="col in 10"
						:key="`${row}-${col}`"
						:class="getCellClass(row, col)"
						:style="getCellStyle(row, col)"
						@click="handleCellClick(row, col)"
					>
						<div v-if="fangIPs.includes(getFullIP(row, col))">
							<span class="ip-monitor-page-desktop-ip-number">{{ getIPNumber(row, col) }}</span>
							<span
								v-if="(ipCounter.get(getFullIP(row, col)) || 0) > 0"
								class="ip-monitor-page-desktop-count-number"
							>
							{{ ipCounter.get(getFullIP(row, col)) || 0 }}
						</span>
						</div>
						<span
							v-else
							class="ip-monitor-page-desktop-ip-number"
						>
						{{ getIPNumber(row, col) }}
					</span>
					</td>
				</tr>
			</table>
		</div>
		<!-- 颜色筛选横条 -->
		<div
			v-if="maxCount > 0"
			class="ip-monitor-page-desktop-color-filter-container"
		>
			<div class="ip-monitor-page-desktop-color-filter-title">点击颜色筛选IP范围</div>
			<div class="ip-monitor-page-desktop-color-filter-bar">
				<div
					v-for="(block, index) in colorBlocks"
					:key="index"
					class="ip-monitor-page-desktop-color-block-wrapper"
				>
					<div
						class="ip-monitor-page-desktop-color-block"
						:style="{ backgroundColor: block.color }"
						:class="{ selected: selectedColorIndex === index }"
						@click="handleColorBlockClick(index)"
					/>
					<div class="ip-monitor-page-desktop-color-block-label">{{ block.label }}</div>
				</div>
			</div>
			<div class="ip-monitor-page-desktop-color-filter-controls">
				<el-button
					type="primary"
					@click="resetFilter"
				>
					显示全部
				</el-button>
			</div>
		</div>

		<!-- 图例 -->
		<div
			v-if="maxCount > 0"
			class="ip-monitor-page-desktop-legend"
		>
			<div class="ip-monitor-page-desktop-legend-item">
				<div
					class="ip-monitor-page-desktop-legend-color"
					:style="{ background: 'linear-gradient(to right, rgb(255,218,185), rgb(255,69,0))' }"
				/>
				<span>1次-{{ maxCount }}次（坊内，颜色越深次数越多）</span>
			</div>
		</div>

		<!-- 调试信息 -->
		<div class="ip-monitor-page-desktop-debug-info">
			最大次数: {{ maxCount }} |
			<span v-if="maxCount > 0">
				示例：1次=rgb(255,218,185), {{ maxCount }}次=rgb(255,69,0) |
				总IP数: {{ ipCounter.size }}
			</span>
			<span v-else>暂无数据</span>
		</div>
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
import {ElButton, ElMessage, ElIcon} from 'element-plus'
import {ArrowLeft} from '@element-plus/icons-vue'
import IPMonitorPageDesktop from './desktop/ts/IPMonitorPageDesktop'
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
 * Element Plus 全局基础样式
 * 提供组件库的基础通用样式，包括:
 * - CSS变量定义(主题色、字体、间距等)
 * - 基础动画和过渡效果
 * - 图标字体样式
 * - 通用的工具类样式
 */
import 'element-plus/dist/index.css'

// ==================== 常量定义 ====================

/** 颜色块数量 */
const COLOR_BLOCK_COUNT = 15

/** IP范围起始值 */
const IP_START = 151

/** IP前缀 */
const IP_PREFIX = '10.0.48.'

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
 * 选中的颜色块索引
 * 用于筛选显示特定次数范围的IP
 */
const selectedColorIndex = ref<number | null>(null)

// ==================== 计算属性 ====================

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
 * 坊内IP列表
 * 从页面数据中提取坊内IP列表
 */
const fangIPs = computed(() => {
	return pageData.value.fangIPs?.fang_ips || []
})

/**
 * 最近7天扫描次数
 * 从页面数据中提取扫描次数
 */
const recent7DScans = computed(() => {
	return pageData.value.scanCount?.scan_count || 0
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
 * 颜色块数据
 * 生成颜色筛选横条的数据
 */
const colorBlocks = computed(() => {
	if (maxCount.value === 0) {
		return []
	}

	const blocks = []
	const rangeSize = (maxCount.value - minCount.value) / COLOR_BLOCK_COUNT

	for (let i = 0; i < COLOR_BLOCK_COUNT; i++) {
		// 计算当前颜色块对应的次数值（使用区间中点）
		const countValue = minCount.value + (i + 0.5) * rangeSize
		const color = IPMonitorPageDesktop.calculateColor(minCount.value, maxCount.value, countValue)

		// 计算范围标签
		const minRange = i === 0 ? Math.floor(minCount.value) : Math.floor(minCount.value + i * rangeSize) + 1
		const maxRange = i === COLOR_BLOCK_COUNT - 1
			? Math.floor(maxCount.value)
			: Math.floor(minCount.value + (i + 1) * rangeSize)

		const label = minRange === maxRange ? `${minRange}` : `${minRange}-${maxRange}`

		blocks.push({
			color: `rgb(${color.r}, ${color.g}, ${color.b})`,
			label,
			minRange: minCount.value + i * rangeSize,
			maxRange: i === COLOR_BLOCK_COUNT - 1 ? maxCount.value + 0.1 : minCount.value + (i + 1) * rangeSize
		})
	}

	return blocks
})

// ==================== 方法 ====================

/**
 * 获取IP编号
 * 根据行列计算IP的最后一位编号
 *
 * @param {number} row - 行号（1-10）
 * @param {number} col - 列号（1-10）
 * @returns {number} IP编号
 */
function getIPNumber(row: number, col: number): number {
	return IP_START + (row - 1) * 10 + (col - 1)
}

/**
 * 获取完整IP地址
 * 根据行列计算完整的IP地址
 *
 * @param {number} row - 行号（1-10）
 * @param {number} col - 列号（1-10）
 * @returns {string} 完整IP地址
 */
function getFullIP(row: number, col: number): string {
	return `${IP_PREFIX}${getIPNumber(row, col)}`
}

/**
 * 获取单元格样式类
 * 根据IP状态返回对应的CSS类名
 *
 * @param {number} row - 行号（1-10）
 * @param {number} col - 列号（1-10）
 * @returns {string} CSS类名
 */
function getCellClass(row: number, col: number): string {
	const classes = ['ip-monitor-page-desktop-ip-cell']

	const ip = getFullIP(row, col)
	const count = ipCounter.value.get(ip) || 0
	const isFangIP = fangIPs.value.includes(ip)

	if (!isFangIP) {
		classes.push('ip-monitor-page-desktop-non-fang')
	} else if (count === 0) {
		classes.push('ip-monitor-page-desktop-count-zero')
	} else {
		classes.push('ip-monitor-page-desktop-heatmap-cell')
	}

	// 添加筛选状态类
	if (selectedColorIndex.value !== null) {
		const block = colorBlocks.value[selectedColorIndex.value]
		if (block && count >= block.minRange && count < block.maxRange) {
			classes.push('ip-monitor-page-desktop-filtered-in')
		} else if (isFangIP && count > 0) {
			classes.push('ip-monitor-page-desktop-filtered-out')
		}
	}

	return classes.join(' ')
}

/**
 * 获取单元格样式
 * 根据IP出现次数返回对应的背景色样式
 *
 * @param {number} row - 行号（1-10）
 * @param {number} col - 列号（1-10）
 * @returns {object} 样式对象
 */
function getCellStyle(row: number, col: number): Record<string, string> {
	const ip = getFullIP(row, col)
	const count = ipCounter.value.get(ip) || 0

	if (!fangIPs.value.includes(ip) || count === 0) {
		return {}
	}
	const color = IPMonitorPageDesktop.calculateColor(minCount.value, maxCount.value, count)

	// 计算文字颜色
	const brightness = color.r * 0.299 + color.g * 0.587 + color.b * 0.114
	const textColor = brightness < 180 ? 'white' : '#333333'

	return {
		backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
		color: textColor
	}
}

/**
 * 处理单元格点击
 * 点击IP单元格时的处理函数
 *
 * @param {number} row - 行号
 * @param {number} col - 列号
 */
function handleCellClick(row: number, col: number): void {
	const ip = getFullIP(row, col)
	const count = ipCounter.value.get(ip) || 0
	ElMessage.info(`IP: ${ip}, 出现次数: ${count}`)
}

/**
 * 处理颜色块点击
 * 点击颜色筛选块时的处理函数
 *
 * @param {number} index - 颜色块索引
 */
function handleColorBlockClick(index: number): void {
	if (selectedColorIndex.value === index) {
		selectedColorIndex.value = null
	} else {
		selectedColorIndex.value = index
	}
}

/**
 * 重置筛选
 * 清除颜色筛选状态，显示所有IP
 */
function resetFilter(): void {
	selectedColorIndex.value = null
}

/**
 * 初始化页面数据
 * 组件挂载时调用，加载初始数据
 */
async function initPageData(): Promise<void> {
	const pageDataManager = IPMonitorPageDesktop.getInstance()
	await pageDataManager.init_data()
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
</style>
