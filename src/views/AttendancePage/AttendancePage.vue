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
import { Loading } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const detectDeviceType = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  const screenWidth = window.innerWidth
  
  const isMobile = /android.*mobile|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent) || 
                   (screenWidth < 768)
  
  const isTablet = /ipad|android(?!.*mobile)|tablet|kindle|silk/i.test(userAgent) || 
                   (screenWidth >= 768 && screenWidth <= 1024)
  
  const isDesktop = screenWidth > 1024
  
  if (isMobile) {
    return 'mobile'
  } else if (isTablet) {
    return 'tablet'
  } else if (isDesktop) {
    return 'desktop'
  } else {
    return screenWidth < 768 ? 'mobile' : screenWidth <= 1024 ? 'tablet' : 'desktop'
  }
}

const redirectToDevicePage = () => {
  const deviceType = detectDeviceType()
  
  switch (deviceType) {
    case 'mobile':
      router.replace('/attendance-mobile')
      break
    case 'tablet':
      router.replace('/attendance-tablet')
      break
    case 'desktop':
      router.replace('/attendance-desktop')
      break
    default:
      router.replace('/attendance-desktop')
  }
}

onMounted(() => {
  setTimeout(() => {
    redirectToDevicePage()
  }, 500)
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