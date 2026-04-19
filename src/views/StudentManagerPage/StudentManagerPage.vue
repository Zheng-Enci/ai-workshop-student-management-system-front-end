<!--
  学生管理页面设备检测组件
  检测设备类型并自动跳转到对应的学生管理页面版本

  @component StudentManagerPage
  @description 作为学生管理页面的入口，结合屏幕宽度和UserAgent检测设备类型后重定向
-->
<script setup lang="ts">
/**
 * 导入Element Plus图标和组件
 */
import { onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useLoadingMaskStore } from '@/stores/ts/loading.ts'
import LoadingMask from '@/components/LoadingMask.vue'
import DeviceDetector, { DeviceType } from '@/composables/ts/DeviceDetector'

/**
 * 路由实例
 */
const router = useRouter()

/**
 * 全局加载蒙版 Store
 */
const loadingMaskStore = useLoadingMaskStore()

/**
 * 检测设备类型
 * 使用DeviceDetector进行设备类型判断
 *
 * @returns {string} 'mobile' | 'desktop'
 */
const detectDeviceType = () => {
	const deviceType = DeviceDetector.detect()
	// 平板设备也归类为移动端
	return deviceType === DeviceType.DESKTOP ? 'desktop' : 'mobile'
}

/**
 * 重定向到对应设备的学生管理页面
 * 根据检测到的设备类型跳转到对应的路由
 */
const redirectToDevicePage = () => {
	// 执行设备检测（符合项目要求,入口文件需要做设备检测）
	const deviceType = detectDeviceType()

	// 根据设备类型重定向到对应的学生管理页面
	if (deviceType === 'mobile') {
		router.replace('/student-manager/mobile')
	} else {
		router.replace('/student-manager/desktop')
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
	<!-- 设备检测页面容器 -->
	<div class="student-manager-page-device-detection-container">
		<LoadingMask/>
	</div>
</template>

<style scoped>
/* 设备检测页面容器样式 */
.student-manager-page-device-detection-container {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	/* 渐变背景 */
	background: linear-gradient(135deg,
		rgba(99, 102, 241, 0.1) 0%,
		rgba(168, 85, 247, 0.08) 25%,
		rgba(236, 72, 153, 0.06) 50%,
		rgba(251, 146, 60, 0.08) 75%,
		rgba(34, 197, 94, 0.1) 100%);
}
</style>
