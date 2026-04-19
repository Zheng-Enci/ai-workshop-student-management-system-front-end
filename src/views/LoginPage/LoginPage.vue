<!--
  登录页面设备检测组件
  检测设备类型并自动跳转到对应的登录页面版本

  @component LoginPage
  @description 作为登录页面的入口，结合屏幕宽度和UserAgent检测设备类型后重定向
-->
<script setup>
/** *******************************************************************
 * LoginPage - 登录页面入口
 * 1. 检测设备类型
 * 2. 重定向到对应设备的登录页面
 ********************************************************************/

// ======================== 导入 ========================
import { onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useLoadingMaskStore } from '@/stores/ts/loading'
import LoadingMask from '@/components/LoadingMask.vue'
import DeviceDetector, { DeviceType } from '@/composables/ts/DeviceDetector'

// ======================== 状态 ========================
/**
 * 路由实例
 * Router instance
 */
const router = useRouter()

/**
 * 全局加载蒙版 Store
 * Global loading mask store
 */
const loadingMaskStore = useLoadingMaskStore()

// ======================== 方法 ========================
/**
 * 检测设备类型
 * 使用DeviceDetector进行设备类型判断
 *
 * @description Detect device type using DeviceDetector
 * @returns {string} 'mobile' | 'desktop'
 */
const detectDeviceType = () => {
	const deviceType = DeviceDetector.detect()
	// 平板设备也归类为移动端
	return deviceType === DeviceType.DESKTOP ? 'desktop' : 'mobile'
}

/**
 * 重定向到对应设备的登录页面
 * 根据检测到的设备类型跳转到对应的路由
 *
 * Redirect to login page for corresponding device
 * Jump to corresponding route based on detected device type
 */
const redirectToDevicePage = () => {
	// 执行设备检测（符合项目要求,入口文件需要做设备检测）
	// Perform device detection (per project requirements, entry file needs device detection)
	const deviceType = detectDeviceType()

	// 根据设备类型重定向到对应的登录页面
	// Redirect to corresponding login page based on device type
	if (deviceType === 'mobile') {
		router.replace('/login/mobile')
	} else {
		router.replace('/login/desktop')
	}

	// 在跳转后关闭加载蒙版
	// Close loading mask after redirect
	nextTick(() => {
		loadingMaskStore.hideLoadingMask()
	})
}

// ======================== 生命周期 ========================
/**
 * 组件挂载时立即执行设备检测和页面跳转
 * Execute device detection and page redirect when component is mounted
 */
onMounted(() => {
	nextTick(() => {
		// 显示全局加载蒙版
		// Show global loading mask
		loadingMaskStore.showLoadingMask('正在检测设备类型...')
		// 执行设备检测和重定向
		// Execute device detection and redirect
		redirectToDevicePage()
	})
})
</script>

<template>
	<!-- 设备检测页面容器 -->
	<!-- Device detection page container -->
	<div class="login-page-device-detection-container">
		<LoadingMask/>
	</div>
</template>

<style scoped>

/* 设备检测页面容器样式 */

/* Device detection page container styles */
.login-page-device-detection-container {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;

	/* 渐变背景 */

	/* Gradient background */
	background: linear-gradient(
		135deg,
		rgb(99 102 241 / 0.1) 0%,
		rgb(168 85 247 / 0.08) 25%,
		rgb(236 72 153 / 0.06) 50%,
		rgb(251 146 60 / 0.08) 75%,
		rgb(34 197 94 / 0.1) 100%
	);
}
</style>
