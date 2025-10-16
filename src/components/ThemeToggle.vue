<template>
  <button @click="toggleTheme" class="theme-toggle-btn" title="切换主题模式">
    <el-icon size="22" class="theme-icon">
      <Sunny v-if="isDarkMode" />
      <Moon v-else />
    </el-icon>
  </button>
</template>

<script setup>
import { Sunny, Moon } from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const { isDarkMode, toggleTheme } = themeStore
</script>

<style scoped>
.theme-toggle-btn {
  background: var(--primary-gradient);
  border: none;
  color: white;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 32px var(--shadow-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.theme-toggle-btn:hover {
  transform: scale(1.1) rotate(180deg);
  box-shadow: 0 12px 40px var(--shadow-hover);
}

.theme-toggle-btn:active {
  transform: scale(0.95);
}

.theme-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (min-width: 768px) {
  .theme-toggle-btn {
    width: 52px;
    height: 52px;
    top: 32px;
    right: 32px;
  }
  
  .theme-icon {
    font-size: 24px;
  }
}
</style>
