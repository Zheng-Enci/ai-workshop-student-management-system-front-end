<template>
  <div class="points-dashboard-page">
    <div v-if="deviceType === 'desktop'">
      <PointsDashboardPageDesktop />
    </div>
    <div v-else>
      <PointsDashboardPageMobile />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import PointsDashboardPageDesktop from './PointsDashboardPageDesktop.vue'
import PointsDashboardPageMobile from './PointsDashboardPageMobile.vue'

const deviceType = ref('desktop')

const detectDevice = () => {
  const screenWidth = window.innerWidth
  
  if (screenWidth < 768) {
    deviceType.value = 'mobile'
  } else {
    deviceType.value = 'desktop'
  }
}

onMounted(() => {
  detectDevice()
  window.addEventListener('resize', detectDevice)
})

onUnmounted(() => {
  window.removeEventListener('resize', detectDevice)
})
</script>

<style scoped>
.points-dashboard-page {
  width: 100%;
  height: 100%;
}
</style>



