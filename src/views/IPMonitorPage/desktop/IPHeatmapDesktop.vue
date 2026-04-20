<template>
	<!--
		IP热力图桌面端组件模板
		
		本组件使用表格形式展示IP地址的热力图，每个单元格代表一个IP地址
		通过颜色深浅直观展示IP的使用频率，颜色越深表示使用次数越多
		
		布局结构：
		- 外层容器：控制整体样式和定位
		- 表格区域：展示IP热力图网格
		- 图例区域：说明颜色含义和IP状态
	-->
	<div class="ip-monitor-page-desktop-heatmap">
		<!--
			IP热力图表格
			
			使用HTML table元素构建网格布局：
			- 行数(rowCount)和列数(colCount)由IPHeatmapDesktop类根据ipRange计算得出
			- 每个单元格代表一个IP地址
			- 单元格样式通过heatmap.getCellClass和heatmap.getCellStyle动态计算
			
			单元格内容展示逻辑：
			1. 坊内IP（在fangIPs列表中）：显示完整IP地址 + 使用次数
			2. 非坊内IP：仅显示完整IP地址（灰色背景）
		-->
		<table class="ip-monitor-page-desktop-heatmap-table">
			<!--
				遍历每一行
				row从1开始计数，对应热力图的第一行到最后一行
			-->
			<tr
				v-for="row in rowCount"
				:key="row"
			>
				<!--
					遍历每一列
					col从1开始计数，每行固定显示10个IP（根据colCount计算）
					单元格key使用"row-col"格式确保唯一性
					
					单元格属性说明：
					- class：动态计算，根据IP状态返回不同CSS类名
					- style：动态计算，根据使用次数返回背景色样式
					- @click：点击事件，显示IP详情弹窗
				-->
				<td
					v-for="col in colCount"
					:key="`${row}-${col}`"
					:class="heatmap.getCellClass(row, col)"
					:style="heatmap.getCellStyle(row, col)"
					@click="heatmap.handleCellClick(row, col)"
				>
					<!--
						坊内IP展示区域
						
						判断条件：当前单元格的IP在fangIPs列表中
						heatmap.getFullIP(row, col)根据行列号获取对应的完整IP地址
						
						展示内容：
						- ip-number：完整IP地址（如10.0.48.151）
						- count-number：该IP的使用次数，从ipCounts对象中获取
						  使用可选链?.防止ipCounts为undefined，默认显示0
					-->
					<div v-if="fangIPs?.includes(heatmap.getFullIP(row, col))">
						<span class="ip-monitor-page-desktop-heatmap-ip-number">{{ heatmap.getFullIP(row, col) }}</span>
						<span class="ip-monitor-page-desktop-heatmap-count-number">
							{{ ipCounts?.[heatmap.getFullIP(row, col)] || 0 }}
						</span>
					</div>
					<!--
						非坊内IP展示区域
						
						仅显示完整IP地址，不显示使用次数
						样式为灰色背景，表示该IP不在当前坊内
					-->
					<span
						v-else
						class="ip-monitor-page-desktop-heatmap-ip-number"
					>
						{{ heatmap.getFullIP(row, col) }}
					</span>
				</td>
			</tr>
		</table>

		<!--
			图例说明区域
			
			展示条件：heatmap.maxCount > 0（有IP使用记录时才显示）
			
			图例内容：
			1. 颜色渐变说明：展示使用次数范围（1次到最大次数）
			2. 坊内IP说明：带颜色的单元格表示该IP在当前坊内且有使用记录
			3. 非坊内IP说明：灰色单元格表示该IP不在当前坊内
			4. 可分配IP说明：白色/浅色单元格表示该IP在坊内但使用次数为0
		-->
		<div
			v-if="heatmap.maxCount > 0"
			class="ip-monitor-page-desktop-heatmap-legend"
		>
			<!--
				热力图颜色渐变说明
				展示从浅色到深色的渐变条，表示使用次数从少到多
			-->
			<div class="ip-monitor-page-desktop-heatmap-legend-item">
				<div
					class="ip-monitor-page-desktop-heatmap-legend-color ip-monitor-page-desktop-heatmap-legend-gradient"
				/>
				<span>1次-{{ heatmap.maxCount }}次（颜色越深次数越多）</span>
			</div>
			<!--
				坊内IP状态说明
				带数字的彩色单元格表示该IP在坊内且有使用记录
			-->
			<div class="ip-monitor-page-desktop-heatmap-legend-item">
				<div
					class="ip-monitor-page-desktop-heatmap-legend-color ip-monitor-page-desktop-heatmap-legend-fang"
				/>
				<span>坊内IP（带数字表示有使用次数）</span>
			</div>
			<!--
				非坊内IP状态说明
				灰色单元格表示该IP不在当前坊内，不可使用
			-->
			<div class="ip-monitor-page-desktop-heatmap-legend-item">
				<div
					class="ip-monitor-page-desktop-heatmap-legend-color ip-monitor-page-desktop-heatmap-legend-non-fang"
				/>
				<span>非坊内IP（灰色背景，不可使用）</span>
			</div>
			<!--
				可分配IP状态说明
				白色/浅色单元格表示该IP在坊内但尚未使用，可分配
			-->
			<div class="ip-monitor-page-desktop-heatmap-legend-item">
				<div
					class="ip-monitor-page-desktop-heatmap-legend-color ip-monitor-page-desktop-heatmap-legend-available"
				/>
				<span>可分配IP（坊内但次数为0，无颜色背景）</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
/**
 * IP热力图桌面端组件脚本
 *
 * @component IPHeatmapDesktop
 * @description 展示IP地址使用频率的热力图组件，使用IPHeatmapDesktop类处理核心逻辑
 * 本组件完全自主从IPMonitorPageDesktop获取数据，不依赖父组件传递props
 *
 * 功能特性：
 * 1. 网格化展示IP地址，每个单元格代表一个IP
 * 2. 根据使用次数显示不同颜色深浅（热力图效果）
 * 3. 区分坊内IP和非坊内IP（不同样式）
 * 4. 点击单元格显示IP详情
 * 5. 响应式数据更新，支持动态刷新
 * 6. 自主数据获取，组件完全独立
 */

// Vue核心API导入
import {computed, onMounted, watch, provide, ref} from 'vue'

// IP热力图核心逻辑类导入
import {IPHeatmapDesktop} from './ts/IPHeatmapDesktop'

// IP监控页面数据管理类导入
import IPMonitorPageDesktop from './ts/IPMonitorPageDesktop'
import type {IPMonitorPageData} from './ts/IPMonitorPageDesktop'

/**
 * IP监控页面数据管理实例
 * 使用单例模式获取数据管理类实例
 * 该实例包含所有IP监控数据：ipCounts、scanCount、fangIPs、ipRange
 */
const pageDataManager = IPMonitorPageDesktop.getInstance()

/**
 * 页面数据响应式引用
 * 直接从IPMonitorPageDesktop获取数据并转换为响应式
 * 数据变化时自动更新热力图
 */
const pageData = ref<IPMonitorPageData>(pageDataManager.getData())

/**
 * 向子组件提供数据管理实例
 * 使用Vue的Provide/Inject机制实现跨层级数据共享
 * 子组件可以通过inject('ipMonitorData')获取此实例
 * 这样设计使得IPHeatmapDesktop成为数据提供中心
 */
provide('ipMonitorData', pageDataManager)

/**
 * 坊内IP列表计算属性
 * 从pageData中提取坊内IP列表
 * 如果数据未加载则返回空数组
 */
const fangIPs = computed(() => {
	return pageData.value.fangIPs?.fang_ips || []
})

/**
 * IP使用次数映射计算属性
 * 从pageData中提取IP使用次数映射
 * 如果数据未加载则返回空对象
 */
const ipCounts = computed(() => {
	return pageData.value.ipCounts?.ip_counts || {}
})

/**
 * IP地址范围列表计算属性
 * 从pageData中提取IP地址范围列表
 * 如果数据未加载则返回空数组
 */
const ipRange = computed(() => {
	return pageData.value.ipRange?.ip_range || []
})

/**
 * 是否为深色模式
 * 从本地存储或系统偏好获取主题设置
 * 默认使用浅色模式
 */
const isDark = ref(false)

/**
 * IP热力图核心类实例
 *
 * 创建IPHeatmapDesktop类的实例，传入初始数据
 * 该类封装了热力图的所有业务逻辑，包括：
 * - IP数据管理和查询
 * - 单元格样式计算
 * - 点击事件处理
 * - 行列数计算
 */
const heatmap = new IPHeatmapDesktop({
	fangIPs: fangIPs.value,
	ipCounts: ipCounts.value,
	isDark: isDark.value,
	ipRange: ipRange.value,
})

/**
 * 热力图行数计算属性
 *
 * 从heatmap实例中获取行数
 * 行数根据ipRange长度和每行显示的列数计算得出
 */
const rowCount = computed(() => heatmap.rowCount)

/**
 * 热力图列数计算属性
 *
 * 从heatmap实例中获取列数
 * 默认每行显示10个IP（可根据需要调整）
 */
const colCount = computed(() => heatmap.colCount)

/**
 * 数据监听器
 *
 * 监听fangIPs、ipCounts、isDark的变化
 * 当任一数据变化时，调用heatmap.updateProps更新内部状态
 *
 * 配置说明：
 * - deep: true 启用深度监听，确保对象内部属性变化也能被捕获
 */
watch(
	[fangIPs, ipCounts, isDark],
	([newFangIPs, newIpCounts, newIsDark]) => {
		heatmap.updateProps({
			fangIPs: newFangIPs,
			ipCounts: newIpCounts,
			isDark: newIsDark,
			ipRange: ipRange.value
		})
	},
	{deep: true}
)

/**
 * 组件挂载生命周期钩子
 *
 * 组件挂载后执行，处理异步数据加载场景：
 * 1. 尝试获取fangIPs数据
 * 2. 如果数据未加载完成，最多重试20次（每次间隔300ms）
 * 3. 数据加载完成后更新heatmap实例
 *
 * 重试机制确保在异步数据场景下组件能正确初始化
 */
onMounted(() => {
	/** 重试计数器 */
	let attempts = 0
	
	/**
	 * 尝试更新数据
	 * 递归函数，直到获取到fangIPs数据或达到最大重试次数
	 */
	const tryUpdate = () => {
		attempts++
		// 更新pageData引用
		pageData.value = pageDataManager.getData()
		// 检查fangIPs是否已加载且有数据
		if (fangIPs.value && fangIPs.value.length > 0) {
			// 数据已加载，更新heatmap实例
			heatmap.updateProps({
				fangIPs: fangIPs.value,
				ipCounts: ipCounts.value,
				isDark: isDark.value,
				ipRange: ipRange.value
			})
		} else if (attempts < 20) {
			// 数据未加载，继续重试（最多20次）
			setTimeout(tryUpdate, 300)
		}
	}
	// 延迟300ms后开始第一次尝试
	setTimeout(tryUpdate, 300)
})
</script>

<style>
/**
 * IP热力图组件样式导入
 *
 * 样式文件路径：./css/IPHeatmapDesktop.css
 * 包含所有组件相关的CSS样式定义
 */
@import './css/IPHeatmapDesktop.css';
</style>
