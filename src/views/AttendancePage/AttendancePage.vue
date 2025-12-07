<template>
  <div class="device-detection-container">
    <div class="loading-spinner">
      <el-icon class="spinner-icon"><Loading /></el-icon>
      <p class="loading-text">正在检测设备类型...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { ElIcon } from 'element-plus'
import 'element-plus/theme-chalk/el-icon.css'
import { Loading } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const detectDeviceType = () => {
  const screenWidth = window.innerWidth
  
  if (screenWidth < 768) {
    return 'mobile'
  } else {
    return 'desktop'
  }
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

<style scoped>
.device-detection-container {
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

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px var(--shadow-color);
}

.spinner-icon {
  font-size: 32px;
  color: var(--primary-color);
  animation: spin 1s linear infinite;
}

.loading-text {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>