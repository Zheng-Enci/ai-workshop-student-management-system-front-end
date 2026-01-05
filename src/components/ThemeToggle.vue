<!--
  主题切换按钮组件
  提供深色/浅色主题切换功能的全局按钮组件
  
  @component ThemeToggle
  @description 固定在页面右上角的圆形按钮，点击切换主题模式
-->
<script setup>
/**
 * 导入Element Plus图标组件
 * Sunny: 太阳图标（代表浅色模式）
 * Moon: 月亮图标（代表深色模式）
 */
import { Sunny, Moon } from '@element-plus/icons-vue'

/**
 * 导入主题状态管理store
 */
import { useThemeStore } from '@/stores/theme'

/**
 * 获取主题store实例
 * @const {Object} themeStore - 主题状态管理实例
 */
const themeStore = useThemeStore()

/**
 * 解构获取主题相关状态和方法
 * @const {boolean} isDarkMode - 当前是否为深色模式
 * @const {Function} toggleTheme - 切换主题的方法
 */
const { isDarkMode, toggleTheme } = themeStore
</script>

<template>
	<!-- 主题切换按钮 -->
	<button class="theme-toggle-btn" title="切换主题模式" @click="toggleTheme">
		<!-- 图标容器 -->
		<el-icon size="22" class="theme-icon">
			<!-- 深色模式时显示太阳图标 -->
			<sunny v-if="isDarkMode" />
			<!-- 浅色模式时显示月亮图标 -->
			<moon v-else />
		</el-icon>
	</button>
</template>

<style scoped>
/**
 * 主题切换按钮样式
 * 圆形按钮，固定在页面右上角，带毛玻璃效果和动画
 */
.theme-toggle-btn {
  /* 渐变背景 */
  background: var(--primary-gradient);
  border: none;
  color: white;
  /* 圆形按钮 */
  border-radius: 50%;
  width: 44px;
  height: 44px;
  /* 内容居中 */
  display: flex;
  align-items: center;
  justify-content: center;
  /* 鼠标手型 */
  cursor: pointer;
  /* 阴影效果 */
  box-shadow: 0 8px 32px var(--shadow-color);
  /* 平滑过渡动画 */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  /* 固定定位在右上角 */
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
  /* 毛玻璃效果 */
  backdrop-filter: blur(10px);
}

/**
 * 悬停效果：放大并旋转180度
 */
.theme-toggle-btn:hover {
  transform: scale(1.1) rotate(180deg);
  box-shadow: 0 12px 40px var(--shadow-hover);
}

/**
 * 点击效果：缩小
 */
.theme-toggle-btn:active {
  transform: scale(0.95);
}

/**
 * 图标过渡动画
 */
.theme-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/**
 * 平板及以上设备样式
 * 按钮尺寸更大
 */
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
