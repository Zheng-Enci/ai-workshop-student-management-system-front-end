<script setup lang="ts">
/**
 * IP监控页面入口组件
 *
 * @description 负责检测设备类型，并根据设备类型重定向到对应的桌面版或移动版IP监控页面
 * @component IPMonitorPage
 */
import { onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useLoadingMaskStore } from '@/stores/ts/loading'
import LoadingMask from '@/components/LoadingMask.vue'
import DeviceDetector, { DeviceType } from '@/composables/ts/DeviceDetector'

/**
 * 路由实例
 * @description 用于页面跳转和路由导航
 */
const router = useRouter()

/**
 * 全局加载蒙版 Store
 */
const loadingMaskStore = useLoadingMaskStore()

/**
 * 检测设备类型
 *
 * @description 使用DeviceDetector检测设备类型
 * @returns 'mobile' 表示移动端，'desktop' 表示桌面端
 */
const detectDeviceType = (): 'mobile' | 'desktop' => {
	const deviceType = DeviceDetector.detect()
	// 平板设备也归类为移动端
	return deviceType === DeviceType.DESKTOP ? 'desktop' : 'mobile'
}

/**
 * 重定向到对应设备的页面
 *
 * @description 根据设备类型跳转到桌面版或移动版IP监控页面
 */
const redirectToDevicePage = () => {
	// 执行设备检测（符合项目要求，入口文件需要做设备检测）
	const deviceType = detectDeviceType()

	// 根据设备类型跳转到对应的页面
	if (deviceType === 'mobile') {
		router.replace('/ip-monitor/mobile')
	} else {
		router.replace('/ip-monitor/desktop')
	}

	// 在跳转后关闭加载蒙版
	nextTick(() => {
		loadingMaskStore.hideLoadingMask()
	})
}

/**
 * 组件挂载时立即执行设备检测和页面跳转
 */
onMounted(() => {
	nextTick(() => {
		// 显示全局加载蒙版
		loadingMaskStore.showLoadingMask('正在检测设备类型...')
		// 执行设备检测和重定向
		redirectToDevicePage()
	})
})
</script>

<template>
	<!-- IP监控页面设备检测容器 -->
	<div class="ip-monitor-page-device-detection-container">
		<LoadingMask/>
	</div>
</template>

<style scoped>
/* IP监控页面设备检测容器样式 */
.ip-monitor-page-device-detection-container {
	width: 100%;
	height: 100vh;
	background-color: #f5f7fa;
}
</style>
