<template>
	<!--
		IP折线图桌面端组件模板

		展示坊内IP出现次数的折线图趋势
		使用ECharts库渲染图表，支持深色/浅色主题切换
	-->
	<div class="ip-monitor-page-mobile-line-chart">
		<!--
			图表标题
			说明图表展示的内容：坊内IP出现次数趋势
		-->
		<h3 class="ip-monitor-page-mobile-line-chart-title">
			坊内IP出现次数趋势
		</h3>
		<!--
			图表容器
			ref绑定用于获取DOM元素，传递给ECharts初始化
			图表实例在script中通过IPLineChartMobile类管理
		-->
		<div
			ref="chartContainerRef"
			class="ip-monitor-page-mobile-line-chart-container"
		/>
	</div>
</template>

<script setup lang="ts">
/**
 * IP折线图桌面端组件脚本（重构后）
 *
 * @component IPLineChartMobile
 * @description 展示坊内IP出现次数趋势的折线图组件
 * 重构后，所有业务逻辑已移至IPLineChartMobile类中
 * Vue组件仅负责模板渲染和事件绑定
 */

// Vue核心API导入
import {onBeforeUnmount, onMounted, ref} from 'vue'

// IP折线图核心逻辑类导入
import {IPLineChartMobile} from './ts/IPLineChartMobile'

/**
 * 图表容器DOM引用
 * 用于获取图表挂载的DOM元素
 */
const chartContainerRef = ref<HTMLDivElement | null>(null)

/**
 * IP折线图核心类实例
 * 创建IPLineChartMobile类的实例
 * 该类封装了图表的所有业务逻辑，包括：
 * - 数据管理和获取
 * - ECharts实例管理
 * - 主题适配
 * - 图表渲染和销毁
 * - 生命周期管理
 */
const chart = new IPLineChartMobile({
	fangIPs: [],
	ipCounts: {},
	isDark: false
})

/**
 * 组件挂载生命周期钩子
 * 设置图表容器引用并调用chart.init()初始化组件
 */
onMounted(() => {
	if (chartContainerRef.value) {
		chart.ref = chartContainerRef.value
		chart.init()
	}
})

/**
 * 组件卸载前生命周期钩子
 * 调用chart.destroy()清理资源
 */
onBeforeUnmount(() => {
	chart.destroy()
})
</script>

<style>
/**
 * IP折线图组件样式导入
 *
 * 样式文件路径：./css/IPLineChartMobile.css
 * 包含所有组件相关的CSS样式定义
 */
@import './css/IPLineChartMobile.css';
</style>
