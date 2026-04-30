<template>
	<!-- 热力图图表容器 -->
	<!-- 使用ref绑定DOM元素，供ECharts初始化使用 -->
	<div ref="chartRef" class="attendance-page-heatmap-desktop-component-chart"/>
</template>

<script setup lang="ts">
/**
 * 签到热力图组件(桌面端)
 *
 * @description 签到热力图ECharts封装组件，用于展示按周几和时段统计的签到次数热力图
 * 数据从AttendancePageDesktop单例获取，确保数据一致性
 * 组件生命周期：
 * - onMounted: 创建热力图组件实例，加载数据并渲染图表
 * - onUnmounted: 销毁图表实例，释放资源
 * @component AttendancePageHeatmapDesktopComponent
 * @author ZhengEnCi zheng_enci_work@foxmail.com
 * @date 2026-01
 * @version 1.0.0
 */

// ===================== Vue核心API导入 =====================
/**
 * ref: 创建响应式引用，用于绑定DOM元素
 * onMounted: 组件挂载完成后的生命周期钩子
 * onUnmounted: 组件卸载前的生命周期钩子
 */
import {ref, onMounted, onUnmounted} from 'vue'

// ===================== 热力图组件类导入 =====================
/**
 * AttendancePageHeatmapDesktopComponent: 热力图组件的TypeScript逻辑类
 * 封装了ECharts图表的初始化、数据加载、渲染、销毁等功能
 * 位于./ts/AttendancePageHeatmapDesktopComponent.ts
 */
import AttendancePageHeatmapDesktopComponent from './ts/AttendancePageHeatmapDesktopComponent'

// ===================== 样式文件导入 =====================
/**
 * 导入组件样式文件
 * 样式定义在独立的CSS文件中，符合项目规范
 */
import './css/AttendancePageHeatmapDesktopComponent.css'

// ===================== 响应式数据定义 =====================
/**
 * 图表容器DOM引用
 * @description 使用Vue的ref绑定热力图容器的DOM元素
 * 类型为HTMLElement或null，初始值为null
 * 在模板中通过ref="chartRef"绑定，在onMounted时赋值
 * 传递给AttendancePageHeatmapDesktopComponent类用于ECharts初始化
 */
const chartRef = ref<HTMLElement | null>(null)

/**
 * 热力图组件实例
 * @description AttendancePageHeatmapDesktopComponent类的实例
 * 在onMounted中创建，在onUnmounted中销毁
 * 初始值为null，创建后赋值
 */
let heatmapComponent: AttendancePageHeatmapDesktopComponent | null = null

// ===================== 生命周期钩子 =====================
/**
 * 组件挂载完成生命周期钩子
 * @description 
 * 组件挂载到DOM后执行，完成以下操作：
 * 1. 创建AttendancePageHeatmapDesktopComponent实例
 * 2. 将chartRef赋值给组件实例，供ECharts初始化使用
 * 3. 调用loadData()方法加载数据并渲染图表
 * 注意：使用await等待数据加载完成
 */
onMounted(async () => {
	// 创建热力图组件实例
	heatmapComponent = new AttendancePageHeatmapDesktopComponent()
	
	// 将Vue的ref引用传递给组件实例
	// 组件内部使用this.chartRef.value获取DOM元素
	heatmapComponent.chartRef = chartRef
	
	// 加载数据并渲染图表
	// 该方法会等待单例数据就绪，然后初始化ECharts并渲染
	await heatmapComponent.loadData()
})

/**
 * 组件卸载前生命周期钩子
 * @description 
 * 组件从DOM移除前执行，完成资源清理：
 * 1. 检查heatmapComponent是否存在
 * 2. 调用dispose()方法销毁ECharts实例，释放内存
 * 3. 将heatmapComponent置为null，避免内存泄漏
 * 注意：必须销毁ECharts实例，否则会造成内存泄漏
 */
onUnmounted(() => {
	// 检查组件实例是否存在
	if (heatmapComponent) {
		// 销毁ECharts图表实例，释放Canvas资源和事件监听
		heatmapComponent.dispose()
		
		// 清空实例引用，帮助垃圾回收
		heatmapComponent = null
	}
})
</script>
