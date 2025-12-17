<template>
  <div>
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 20px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <el-button @click="goBack" class="back-btn" type="primary" :icon="ArrowLeft" circle></el-button>
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊" class="logo" @click="toggleTheme" title="切换主题模式" style="width: 40px; height: 40px; cursor: pointer;">
      </div>
      <div class="title-section">
        <h1 class="main-title" style="margin: 0; font-size: 14px; white-space: nowrap;">在0与1之间，见证每一位创作者的光芒</h1>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { ElButton } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/el-button.css'

const router = useRouter()
const themeStore = useThemeStore()

const goBack = () => {
  router.push('/navigation')
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}
</script>

<style scoped>
</style>