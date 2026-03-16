<!--
  导航页面设备检测组件
  检测设备类型并自动跳转到对应的导航页面版本

  @component NavigationPage
  @description 作为导航页面的入口，结合屏幕宽度和UserAgent检测设备类型后重定向
-->
<script setup>
/**
 * 导入Element Plus图标和组件
 */
import { Loading } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import 'element-plus/theme-chalk/el-icon.css'

/**
 * 路由实例
 */
const router = useRouter()

/**
 * 检测设备类型
 * 结合屏幕宽度和UserAgent进行更准确的设备类型判断
 *
 * @returns 'mobile' | 'desktop'
 */
const detectDeviceType = () => {
	const screenWidth = window.innerWidth
	const userAgent = navigator.userAgent.toLowerCase()

	// 结合屏幕宽度和 userAgent 进行更准确的检测
	// 屏幕宽度小于768px或UserAgent包含移动设备标识，则判定为移动设备
	const isMobile = screenWidth < 768 ||
                   /android.*mobile|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)

	return isMobile ? 'mobile' : 'desktop'
}

/**
 * 重定向到对应设备的导航页面
 * 根据检测到的设备类型跳转到对应的路由
 */
const redirectToDevicePage = () => {
	const deviceType = detectDeviceType()

	// 根据设备类型重定向到对应的导航页面
	if (deviceType === 'mobile') {
		router.replace('/navigation-mobile')
	} else {
		router.replace('/navigation-desktop')
	}
}

/**
 * 组件挂载后立即执行重定向
 */
onMounted(() => {
	redirectToDevicePage()
})
</script>

<template>
	<!-- 设备检测加载容器 -->
	<div class="device-detection-container">
		<!-- 加载动画 -->
		<div class="loading-spinner">
			<!-- 旋转加载图标 -->
			<el-icon class="spinner-icon"><loading /></el-icon>
			<!-- 加载提示文本 -->
			<p class="loading-text">正在检测设备类型...</p>
		</div>
	</div>
</template>

<style scoped>
/* 导入导航页面的CSS样式 */
@import './css/NavigationPage.css';
</style>
