<script setup>
import { Loading } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import 'element-plus/theme-chalk/el-icon.css'

const router = useRouter()

const detectDeviceType = () => {
	const screenWidth = window.innerWidth
	const userAgent = navigator.userAgent.toLowerCase()

	// 结合屏幕宽度和 userAgent 进行更准确的检测
	const isMobile = screenWidth < 768 ||
                   /android.*mobile|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)

	return isMobile ? 'mobile' : 'desktop'
}

const redirectToDevicePage = () => {
	const deviceType = detectDeviceType()

	if (deviceType === 'mobile') {
		router.replace('/navigation-mobile')
	} else {
		router.replace('/navigation-desktop')
	}
}

onMounted(() => {
	redirectToDevicePage()
})
</script>

<template>
	<div class="device-detection-container">
		<div class="loading-spinner">
			<el-icon class="spinner-icon"><loading /></el-icon>
			<p class="loading-text">正在检测设备类型...</p>
		</div>
	</div>
</template>

<style scoped>
@import './css/NavigationPage.css';
</style>
