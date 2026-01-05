<!--
  仪表板页面组件
  根据设备类型自动切换显示桌面版或移动版仪表板
  
  @component DashboardPage
  @description 响应式仪表板页面，根据屏幕宽度自动适配显示对应版本
-->
<script setup>
import { ref, onMounted } from 'vue'

/**
 * 导入桌面版和移动版仪表板组件
 */
import DashboardPageDesktop from './DashboardPageDesktop.vue'
import DashboardPageMobile from './DashboardPageMobile.vue'

/**
 * 设备类型状态
 * @type {Ref<string>} 'desktop' | 'mobile'
 */
const deviceType = ref('desktop')

/**
 * 检测设备类型
 * 根据窗口宽度判断设备类型（768px为分界点）
 */
const detectDevice = () => {
	const screenWidth = window.innerWidth

	// 小于768px为移动设备
	if (screenWidth < 768) {
		deviceType.value = 'mobile'
	} else {
		// 大于等于768px为桌面设备
		deviceType.value = 'desktop'
	}
}

/**
 * 组件挂载后执行
 * 初始检测设备类型，并监听窗口大小变化
 */
onMounted(() => {
	detectDevice()
	// 监听窗口大小变化，实时切换设备类型
	window.addEventListener('resize', detectDevice)
})
</script>

<template>
	<div class="dashboard-page">
		<!-- 桌面版仪表板 -->
		<div v-if="deviceType === 'desktop'">
			<dashboard-page-desktop />
		</div>
		<!-- 移动版仪表板 -->
		<div v-else>
			<dashboard-page-mobile />
		</div>
	</div>
</template>

<style scoped>
.dashboard-page {
  width: 100%;
  height: 100%;
}
</style>
