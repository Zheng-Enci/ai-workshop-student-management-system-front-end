<template>
  <div class="points-dashboard-mobile">
    <div class="header">
      <el-button @click="goBack" class="back-btn" type="primary" :icon="ArrowLeft" circle></el-button>
      <img src="@/assets/AiWorkShop_icon.png" alt="AI坊" class="logo" @click="toggleTheme" title="切换主题模式">
      <h1>积分看板</h1>
    </div>

    <div class="content">
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { ElButton } from 'element-plus'
import 'element-plus/theme-chalk/el-button.css'
import { ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore

const goBack = () => {
  router.push('/navigation')
}
</script>

<style scoped>
.points-dashboard-mobile {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-bottom: 20px;
}

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  width: 40px;
  height: 40px;
  background: var(--primary-color);
  border: none;
}

.logo {
  width: 48px;
  height: 48px;
  cursor: pointer;
  border-radius: 12px;
}

.header h1 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
  flex: 1;
}

.content {
  padding: 20px;
}
</style>
