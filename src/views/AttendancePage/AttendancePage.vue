<script setup>
import { Loading } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
import { onMounted } from 'vue'
import 'element-plus/theme-chalk/el-icon.css'
import { useRouter } from 'vue-router'

const router = useRouter()

const detectDeviceType = () => {
	const screenWidth = window.innerWidth

	if (screenWidth < 768) {
		return 'mobile'
	}
	return 'desktop'
}

const redirectToDevicePage = () => {
	const deviceType = detectDeviceType()

	if (deviceType === 'mobile') {
		router.replace('/attendance-mobile')
	} else {
		router.replace('/attendance-desktop')
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
.device-detection-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg,
    rgb(99 102 241 / 0.1) 0%,
    rgb(168 85 247 / 0.08) 25%,
    rgb(236 72 153 / 0.06) 50%,
    rgb(251 146 60 / 0.08) 75%,
    rgb(34 197 94 / 0.1) 100%);
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  padding: 40px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  box-shadow: 0 8px 32px var(--shadow-color);
  backdrop-filter: blur(20px);
}

.spinner-icon {
  font-size: 32px;
  color: var(--primary-color);
  animation: spin 1s linear infinite;
}

.loading-text {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
