<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const detectDeviceType = () => {
	const screenWidth = window.innerWidth
	const userAgent = navigator.userAgent.toLowerCase()

	const isMobile = screenWidth < 768 ||
                   /android.*mobile|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)

	return isMobile ? 'mobile' : 'desktop'
}

const redirectToDevicePage = () => {
	const deviceType = detectDeviceType()

	if (deviceType === 'mobile') {
		router.replace('/student-manager/mobile')
	} else {
		router.replace('/student-manager/desktop')
	}
}

onMounted(() => {
	redirectToDevicePage()
})
</script>

<template>
	<div class="device-detection-container">
		<div class="loading-spinner">
			<el-icon class="spinner-icon"><Loading /></el-icon>
			<p class="loading-text">正在检测设备类型...</p>
		</div>
	</div>
</template>

<style scoped>
.device-detection-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.loading-spinner {
  color: white;
  text-align: center;
}

.spinner-icon {
  font-size: 48px;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 16px;
  font-size: 18px;
  font-weight: 500;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
