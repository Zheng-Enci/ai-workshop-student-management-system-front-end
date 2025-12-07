<template>
  <div class="device-detection">
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在检测设备类型...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const detectDevice = () => {
  const screenWidth = window.innerWidth
  
  if (screenWidth < 768) {
    router.replace('/profile/mobile')
  } else {
    router.replace('/profile/desktop')
  }
}

onMounted(() => {
  detectDevice()
})
</script>

<style scoped>
.device-detection {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.loading-container {
  text-align: center;
  color: white;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
}
</style>