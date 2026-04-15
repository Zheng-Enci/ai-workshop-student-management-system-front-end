<!--
  数据看板页面设备检测组件
  检测设备类型并自动跳转到对应的数据看板页面版本

  @component DashboardPage
  @description 作为数据看板页面的入口，检测设备类型后重定向到desktop或mobile版本
-->
<script setup>
/**
 * 数据看板页面设备检测组件
 *
 * @component DashboardPage
 * @description 作为数据看板页面的入口组件,负责以下功能:
 * 1. 检测用户设备类型(移动端/桌面端)
 * 2. 根据设备类型自动重定向到对应的数据看板页面版本
 * 3. 显示设备检测加载动画,提升用户体验
 *
 * @author 前端开发团队
 * @version 1.0.0
 */

// ===================== 依赖导入区 =====================
import { onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useLoadingMaskStore } from '@/stores/ts/loading'
import LoadingMask from '@/components/LoadingMask.vue'

// ===================== 全局实例初始化 =====================
const router = useRouter()
const loadingMaskStore = useLoadingMaskStore()

// ===================== 业务逻辑方法区 =====================
/**
 * 检测设备类型
 * @returns {string} 'mobile' | 'desktop'
 */
const detectDeviceType = () => {
	const screenWidth = window.innerWidth
	if (screenWidth < 768) {
		return 'mobile'
	}
	return 'desktop'
}

/**
 * 重定向到对应设备的数据看板页面
 */
const redirectToDevicePage = () => {
	const deviceType = detectDeviceType()

	if (deviceType === 'mobile') {
		router.replace('/dashboard-mobile')
	} else {
		router.replace('/dashboard-desktop')
	}

	nextTick(() => {
		loadingMaskStore.hideLoadingMask()
	})
}

// ===================== 生命周期钩子 =====================
onMounted(() => {
	nextTick(() => {
		loadingMaskStore.showLoadingMask('正在检测设备类型...')
		redirectToDevicePage()
	})
})
</script>

<template>
	<div class="dashboard-page-device-detection-container">
		<LoadingMask/>
	</div>
</template>

<style scoped>
.dashboard-page-device-detection-container {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	background: linear-gradient(135deg,
		rgba(99, 102, 241, 0.1) 0%,
		rgba(168, 85, 247, 0.08) 25%,
		rgba(236, 72, 153, 0.06) 50%,
		rgba(251, 146, 60, 0.08) 75%,
		rgba(34, 197, 94, 0.1) 100%);
}
</style>
