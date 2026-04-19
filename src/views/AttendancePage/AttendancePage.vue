<!--
  考勤页面设备检测组件
  检测设备类型并自动跳转到对应的考勤页面版本

  @component AttendancePage
  @description 作为考勤页面的入口，检测设备类型后重定向到desktop或mobile版本
-->
<script setup lang="ts">
/**
 * 考勤页面设备检测组件
 *
 * @component AttendancePage
 * @description 作为考勤页面的入口组件,负责以下功能:
 * 1. 检测用户设备类型(移动端/桌面端)
 * 2. 根据设备类型自动重定向到对应的考勤页面版本
 * 3. 显示设备检测加载动画,提升用户体验
 *
 * @author 前端开发团队
 * @version 1.0.0
 */

// ===================== 依赖导入区 =====================
// Vue3 生命周期钩子导入
import { onMounted, nextTick } from 'vue'
// Vue Router 路由功能导入
import { useRouter } from 'vue-router'
import { useLoadingMaskStore } from '@/stores/ts/loading.ts'
import LoadingMask from '@/components/LoadingMask.vue'
import DeviceDetector, { DeviceType } from '@/composables/ts/DeviceDetector'

// ===================== 全局实例初始化 =====================
/**
 * 路由实例
 * @type {Router}
 * @description 用于页面跳转和路由导航,实现设备检测后的页面重定向
 */
const router = useRouter()

/**
 * 全局加载蒙版 Store
 */
const loadingMaskStore = useLoadingMaskStore()

// ===================== 业务逻辑方法区 =====================
/**
 * 检测设备类型
 *
 * @function detectDeviceType
 * @description 使用DeviceDetector检测设备类型
 * @returns {string} 'mobile' | 'desktop' - 设备类型标识
 */
const detectDeviceType = () => {
	const deviceType = DeviceDetector.detect()
	// 平板设备也归类为移动端
	return deviceType === DeviceType.DESKTOP ? 'desktop' : 'mobile'
}

/**
 * 重定向到对应设备的考勤页面
 *
 * @function redirectToDevicePage
 * @description 执行设备检测并根据结果跳转到对应的考勤页面版本
 * 流程:
 * 1. 调用设备检测方法获取设备类型
 * 2. 根据设备类型使用router.replace进行路由替换
 * 3. 使用replace而非push,避免在浏览器历史记录中留下中间页面
 */
const redirectToDevicePage = () => {
	// 执行设备类型检测
	const deviceType = detectDeviceType()

	// 根据设备类型重定向到对应的考勤页面
	// 移动端跳转到移动版考勤页面
	if (deviceType === 'mobile') {
		router.replace('/attendance-mobile')
	} else {
		// 桌面端跳转到桌面版考勤页面
		router.replace('/attendance-desktop')
	}

	// 在跳转后关闭加载蒙版
	nextTick(() => {
		loadingMaskStore.hideLoadingMask()
	})
}

// ===================== 生命周期钩子 =====================
/**
 * 组件挂载生命周期钩子
 *
 * @description 组件挂载完成后立即执行设备检测和页面重定向
 * 确保用户访问考勤页面时能够快速跳转到对应设备版本的页面
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
	<div class="attendance-page-device-detection-container">
		<LoadingMask/>
	</div>
</template>

<style scoped>
/* 设备检测页面容器样式 */
.attendance-page-device-detection-container {
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
