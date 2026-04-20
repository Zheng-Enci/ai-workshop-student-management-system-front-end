<template>
	<!--
		IP折线图桌面端组件模板
		
		展示坊内IP出现次数的折线图趋势
		使用ECharts库渲染图表，支持深色/浅色主题切换
	-->
	<div class="ip-monitor-page-desktop-line-chart">
		<!--
			图表标题
			说明图表展示的内容：坊内IP出现次数趋势
		-->
		<h3 class="ip-monitor-page-desktop-line-chart-title">
			坊内IP出现次数趋势
		</h3>
		<!--
			图表容器
			ref绑定用于获取DOM元素，传递给ECharts初始化
			图表实例在script中通过IPLineChartDesktop类管理
		-->
		<div
			ref="chartContainerRef"
			class="ip-monitor-page-desktop-line-chart-container"
		/>
	</div>
</template>

<script setup lang="ts">
/**
 * IP折线图桌面端组件脚本
 *
 * @component IPLineChartDesktop
 * @description 展示坊内IP出现次数趋势的折线图组件
 * 本组件完全自主从IPMonitorPageDesktop获取数据，不依赖父组件传递props
 *
 * 功能特性：
 * 1. 使用ECharts渲染折线图展示IP使用趋势
 * 2. 支持深色/浅色主题自动适配
 * 3. 数据按使用次数排序展示
 * 4. 响应式数据更新，支持动态刷新
 * 5. 自主数据获取，组件完全独立
 */

// Vue核心API导入
import {ref, onMounted, onBeforeUnmount, computed, watch} from 'vue'

// IP折线图核心逻辑类导入
import {IPLineChartDesktop} from './ts/IPLineChartDesktop'

// IP监控页面数据管理类导入
import IPMonitorPageDesktop from './ts/IPMonitorPageDesktop'
import type {IPMonitorPageData} from './ts/IPMonitorPageDesktop'

// 主题状态管理导入
import {useThemeStore} from '@/stores/ts/theme'

/**
 * IP监控页面数据管理实例
 * 使用单例模式获取数据管理类实例
 * 该实例包含所有IP监控数据：ipCounts、scanCount、fangIPs、ipRange
 */
const pageDataManager = IPMonitorPageDesktop.getInstance()

/**
 * 页面数据响应式引用
 * 直接从IPMonitorPageDesktop获取数据并转换为响应式
 * 数据变化时自动更新图表
 */
const pageData = ref<IPMonitorPageData>(pageDataManager.getData())

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
 * 主题状态管理实例
 * 用于获取当前主题模式（深色/浅色）
 */
const themeStore = useThemeStore()

/**
 * 是否为深色模式计算属性
 * 从主题store获取当前主题状态
 * 自动响应主题切换
 */
const isDark = computed(() => themeStore.isDarkMode)

/**
 * 图表容器DOM引用
 * 用于获取图表挂载的DOM元素
 */
const chartContainerRef = ref<HTMLDivElement | null>(null)

/**
 * IP折线图核心类实例
 * 创建IPLineChartDesktop类的实例，传入初始数据
 * 该类封装了图表的所有业务逻辑，包括：
 * - ECharts实例管理
 * - 图表数据处理和格式化
 * - 主题适配
 * - 图表渲染和销毁
 */
let chartInstance: IPLineChartDesktop | null = null

/**
 * 组件挂载生命周期钩子
 *
 * 组件挂载后执行：
 * 1. 检查图表容器是否存在
 * 2. 创建IPLineChartDesktop实例
 * 3. 设置图表容器引用
 * 4. 挂载图表（初始化ECharts并渲染）
 */
onMounted(() => {
	if (chartContainerRef.value) {
		chartInstance = new IPLineChartDesktop({
			fangIPs: fangIPs.value,
			ipCounts: ipCounts.value,
			isDark: isDark.value
		})
		chartInstance.ref = chartContainerRef.value
		chartInstance.mount()
	}
})

/**
 * 数据变化监听器
 *
 * 监听ipCounts数据变化，当时间段切换导致数据更新时：
 * 1. 更新pageData引用获取最新数据
 * 2. 重新创建图表实例使用新数据
 * 3. 重新挂载图表展示新时间段的数据
 * 确保折线图随时间段切换实时更新
 */
watch(
	ipCounts,
	(newIpCounts) => {
		// 更新pageData获取最新数据
		pageData.value = pageDataManager.getData()
		if (chartInstance && chartContainerRef.value) {
			// 销毁旧实例
			chartInstance.unmount()
			// 使用新数据重新创建
			chartInstance = new IPLineChartDesktop({
				fangIPs: fangIPs.value,
				ipCounts: newIpCounts,
				isDark: isDark.value
			})
			chartInstance.ref = chartContainerRef.value
			chartInstance.mount()
		}
	},
	{deep: true}
)

/**
 * 主题切换监听器
 *
 * 监听isDark变化，当主题切换时：
 * 1. 销毁旧图表实例
 * 2. 使用新主题重新创建图表实例
 * 确保图表样式随主题实时更新
 */
watch(
	isDark,
	(newIsDark) => {
		if (chartInstance && chartContainerRef.value) {
			// 销毁旧实例
			chartInstance.unmount()
			// 使用新主题重新创建
			chartInstance = new IPLineChartDesktop({
				fangIPs: fangIPs.value,
				ipCounts: ipCounts.value,
				isDark: newIsDark
			})
			chartInstance.ref = chartContainerRef.value
			chartInstance.mount()
		}
	}
)

/**
 * 组件卸载前生命周期钩子
 *
 * 组件卸载前执行：
 * 1. 销毁ECharts实例（释放内存）
 * 2. 清空chartInstance引用
 * 防止内存泄漏
 */
onBeforeUnmount(() => {
	if (chartInstance) {
		chartInstance.unmount()
		chartInstance = null
	}
})
</script>

<style>
/**
 * IP折线图组件样式导入
 *
 * 样式文件路径：./css/IPLineChartDesktop.css
 * 包含所有组件相关的CSS样式定义
 */
@import './css/IPLineChartDesktop.css';
</style>
