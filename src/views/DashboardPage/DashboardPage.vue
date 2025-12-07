<template>
  <div class="dashboard-page">
    <div v-if="deviceType === 'desktop'">
      <DashboardPageDesktop />
    </div>
    <div v-else>
      <DashboardPageMobile />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DashboardPageDesktop from './DashboardPageDesktop.vue'
import DashboardPageMobile from './DashboardPageMobile.vue'

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
</script>

<style scoped>
.dashboard-page {
  width: 100%;
  height: 100%;
}
</style>
