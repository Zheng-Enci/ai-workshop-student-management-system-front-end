<template>
	<div class="ip-monitor-page-desktop">
		<!-- 页面头部 -->
		<div class="ip-monitor-page-desktop-header-container">
			<div class="ip-monitor-page-desktop-scan-stats">
				最近7天扫描次数：{{ recent7DScans }}
			</div>
			<h1 class="ip-monitor-page-desktop-title">IP出现次数统计</h1>
		</div>

		<!-- 时间范围选择器 -->
		<div class="ip-monitor-page-desktop-time-selector">
			<el-date-picker
				v-model="timeRange"
				type="datetimerange"
				range-separator="至"
				start-placeholder="开始时间"
				end-placeholder="结束时间"
				:default-time="['00:00:00', '23:59:59']"
				@change="handleTimeRangeChange"
			/>
			<el-button
				type="primary"
				class="ip-monitor-page-desktop-refresh-btn"
				@click="handleRefresh"
			>
				刷新数据
			</el-button>
		</div>

		<!-- IP表格 -->
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
					<div v-if="!isNonFangIP(row, col)">
						<span class="ip-monitor-page-desktop-ip-number">{{ getIPNumber(row, col) }}</span>
						<span
							v-if="getIPCount(row, col) > 0"
							class="ip-monitor-page-desktop-count-number"
						>
							{{ getIPCount(row, col) }}
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
import { ref, computed, onMounted, watch } from 'vue'
import { ElDatePicker, ElButton, ElMessage } from 'element-plus'
import IPMonitorPageDesktop from './desktop/ts/IPMonitorPageDesktop'
import type { IPMonitorPageData } from './desktop/ts/IPMonitorPageDesktop'

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
 * 时间范围
 * 用于选择数据查询的时间范围
 */
const timeRange = ref<[Date, Date] | null>(null)

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
		const color = calculateColor(minCount.value, maxCount.value, countValue)

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
 * 获取IP出现次数
 * 从ipCounter中获取指定IP的出现次数
 *
 * @param {number} row - 行号（1-10）
 * @param {number} col - 列号（1-10）
 * @returns {number} IP出现次数
 */
function getIPCount(row: number, col: number): number {
	const ip = getFullIP(row, col)
	return ipCounter.value.get(ip) || 0
}

/**
 * 判断是否为非坊内IP
 * 检查指定IP是否在坊内IP列表中
 *
 * @param {number} row - 行号（1-10）
 * @param {number} col - 列号（1-10）
 * @returns {boolean} 是否为非坊内IP
 */
function isNonFangIP(row: number, col: number): boolean {
	const ipNumber = getIPNumber(row, col)
	return !fangIPs.value.includes(ipNumber.toString())
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

	if (isNonFangIP(row, col)) {
		classes.push('ip-monitor-page-desktop-non-fang')
	} else if (getIPCount(row, col) === 0) {
		classes.push('ip-monitor-page-desktop-count-zero')
	} else {
		classes.push('ip-monitor-page-desktop-heatmap-cell')
	}

	// 添加筛选状态类
	if (selectedColorIndex.value !== null) {
		const count = getIPCount(row, col)
		const block = colorBlocks.value[selectedColorIndex.value]
		if (block && count >= block.minRange && count < block.maxRange) {
			classes.push('ip-monitor-page-desktop-filtered-in')
		} else if (!isNonFangIP(row, col) && getIPCount(row, col) > 0) {
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
	if (isNonFangIP(row, col) || getIPCount(row, col) === 0) {
		return {}
	}

	const count = getIPCount(row, col)
	const color = calculateColor(minCount.value, maxCount.value, count)

	// 计算文字颜色
	const brightness = color.r * 0.299 + color.g * 0.587 + color.b * 0.114
	const textColor = brightness < 180 ? 'white' : '#333333'

	return {
		backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
		color: textColor
	}
}

/**
 * 计算颜色RGB值
 * 根据次数计算对应的热力图颜色
 *
 * @param {number} min - 最小次数
 * @param {number} max - 最大次数
 * @param {number} count - 当前次数
 * @returns {object} RGB颜色对象
 */
function calculateColor(min: number, max: number, count: number): { r: number; g: number; b: number } {
	const lightOrange = { r: 255, g: 218, b: 185 }
	const darkOrange = { r: 255, g: 69, b: 0 }

	if (max === min) {
		return lightOrange
	}

	const intensity = ((count - min) / (max - min)) * 255
	const r = Math.round(lightOrange.r - (intensity / 255) * (lightOrange.r - darkOrange.r))
	const g = Math.round(lightOrange.g - (intensity / 255) * (lightOrange.g - darkOrange.g))
	const b = Math.round(lightOrange.b - (intensity / 255) * (lightOrange.b - darkOrange.b))

	return { r, g, b }
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
	const count = getIPCount(row, col)
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
 * 处理时间范围变化
 * 当用户选择新的时间范围时刷新数据
 */
async function handleTimeRangeChange(): Promise<void> {
	if (!timeRange.value || timeRange.value.length !== 2) {
		return
	}

	const startTime = Math.floor(timeRange.value[0].getTime() / 1000)
	const endTime = Math.floor(timeRange.value[1].getTime() / 1000)

	const pageDataManager = IPMonitorPageDesktop.getInstance()
	await pageDataManager.refreshIPDataByTimeRange(startTime, endTime)

	// 更新本地数据
	pageData.value = pageDataManager.getData()
}

/**
 * 处理刷新按钮点击
 * 重新加载所有数据
 */
async function handleRefresh(): Promise<void> {
	const pageDataManager = IPMonitorPageDesktop.getInstance()
	await pageDataManager.init_data()
	pageData.value = pageDataManager.getData()

	// 重置时间选择器
	timeRange.value = null
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

<style scoped>
/**
 * IP监控页面桌面端样式
 * 使用kebab-case命名规范，前缀与文件名一致
 */

/* 页面容器 */
.ip-monitor-page-desktop {
	padding: 20px;
	background-color: #f8f9fa;
	min-height: 100vh;
}

/* 头部容器 */
.ip-monitor-page-desktop-header-container {
	position: relative;
	margin-bottom: 30px;
}

/* 扫描统计 */
.ip-monitor-page-desktop-scan-stats {
	color: #666;
	font-size: 16px;
	font-weight: 600;
	position: absolute;
	top: 0;
	left: 0;
}

/* 页面标题 */
.ip-monitor-page-desktop-title {
	text-align: center;
	color: #333;
	margin: 0;
	padding: 10px 0;
}

/* 时间选择器容器 */
.ip-monitor-page-desktop-time-selector {
	width: 90%;
	margin: 0 auto 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 15px;
}

/* 刷新按钮 */
.ip-monitor-page-desktop-refresh-btn {
	margin-left: 10px;
}

/* IP表格 */
.ip-monitor-page-desktop-ip-table {
	width: 90%;
	margin: 0 auto;
	border-collapse: collapse;
	background-color: #fff;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* IP单元格 */
.ip-monitor-page-desktop-ip-cell {
	width: 10%;
	height: 60px;
	text-align: center;
	border: 1px solid #ddd;
	padding: 5px;
	font-size: 14px;
	position: relative;
	cursor: pointer;
	transition: all 0.2s ease;
}

.ip-monitor-page-desktop-ip-cell:hover {
	transform: scale(1.05);
	z-index: 1;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* IP编号 */
.ip-monitor-page-desktop-ip-number {
	font-weight: bold;
	margin-bottom: 5px;
	display: block;
}

/* 次数编号 */
.ip-monitor-page-desktop-count-number {
	font-size: 16px;
	font-weight: 600;
}

/* 0次：白色背景 */
.ip-monitor-page-desktop-count-zero {
	background-color: #ffffff;
}

.ip-monitor-page-desktop-count-zero .ip-monitor-page-desktop-ip-number,
.ip-monitor-page-desktop-count-zero .ip-monitor-page-desktop-count-number {
	color: #718096;
}

/* 非坊内IP：斜纹背景 */
.ip-monitor-page-desktop-non-fang {
	background: repeating-linear-gradient(
		45deg,
		#f5f5f5,
		#f5f5f5 8px,
		#e8e8e8 8px,
		#e8e8e8 16px
	);
	border: 2px dashed #cccccc;
	opacity: 0.7;
}

.ip-monitor-page-desktop-non-fang .ip-monitor-page-desktop-ip-number {
	color: #999999;
	font-weight: normal;
}

/* 热力图单元格 */
.ip-monitor-page-desktop-heatmap-cell {
	transition: all 0.3s ease;
}

/* 颜色筛选容器 */
.ip-monitor-page-desktop-color-filter-container {
	width: 90%;
	margin: 20px auto;
	background-color: #fff;
	padding: 20px;
	border-radius: 8px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 颜色筛选标题 */
.ip-monitor-page-desktop-color-filter-title {
	text-align: center;
	color: #333;
	font-size: 16px;
	font-weight: 600;
	margin-bottom: 15px;
}

/* 颜色筛选横条 */
.ip-monitor-page-desktop-color-filter-bar {
	display: flex;
	width: 100%;
	gap: 2px;
	margin-bottom: 10px;
}

/* 颜色块包装器 */
.ip-monitor-page-desktop-color-block-wrapper {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
}

/* 颜色块 */
.ip-monitor-page-desktop-color-block {
	width: 100%;
	height: 40px;
	transition: all 0.2s ease;
	border-radius: 4px;
	position: relative;
	cursor: pointer;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.ip-monitor-page-desktop-color-block:hover {
	transform: scaleY(1.1);
	z-index: 1;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.ip-monitor-page-desktop-color-block.selected {
	border: 3px solid #1890ff;
	box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.3), 0 2px 8px rgba(0, 0, 0, 0.3);
	z-index: 2;
}

/* 颜色块标签 */
.ip-monitor-page-desktop-color-block-label {
	margin-top: 5px;
	font-size: 11px;
	color: #666;
	text-align: center;
	white-space: nowrap;
	font-weight: 500;
}

@media (max-width: 768px) {
	.ip-monitor-page-desktop-color-block-label {
		font-size: 9px;
	}
}

/* 颜色筛选控制按钮 */
.ip-monitor-page-desktop-color-filter-controls {
	display: flex;
	justify-content: center;
	gap: 10px;
	margin-top: 15px;
}

/* 筛选状态样式 */
.ip-monitor-page-desktop-filtered-out {
	opacity: 0.25;
	filter: grayscale(50%);
	transition: opacity 0.3s ease, filter 0.3s ease;
}

.ip-monitor-page-desktop-filtered-in {
	opacity: 1;
	filter: brightness(1.1);
	transition: opacity 0.3s ease, filter 0.3s ease;
}

/* 图例 */
.ip-monitor-page-desktop-legend {
	width: 90%;
	margin: 20px auto 0;
	display: flex;
	justify-content: center;
	gap: 20px;
	flex-wrap: wrap;
	background-color: #fff;
	padding: 10px;
	border-radius: 4px;
	box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

/* 图例项 */
.ip-monitor-page-desktop-legend-item {
	display: flex;
	align-items: center;
	gap: 5px;
	font-size: 13px;
}

/* 图例颜色 */
.ip-monitor-page-desktop-legend-color {
	width: 20px;
	height: 20px;
	border-radius: 2px;
}

/* 调试信息 */
.ip-monitor-page-desktop-debug-info {
	margin-top: 20px;
	padding: 10px;
	background: #f0f0f0;
	text-align: center;
	font-size: 12px;
	color: #666;
}
</style>
