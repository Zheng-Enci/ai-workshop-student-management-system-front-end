<!--
  考勤页面设备检测组件
  检测设备类型并自动跳转到对应的考勤页面版本

  @component AttendancePage
  @description 作为考勤页面的入口，检测设备类型后重定向到desktop或mobile版本
-->
<script setup>
/**
 * 导入Element Plus图标和组件
 */
import { Loading } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
import { onMounted } from 'vue'
import 'element-plus/theme-chalk/el-icon.css'
import { useRouter } from 'vue-router'

/**
 * 路由实例
 */
const router = useRouter()

/**
 * 检测设备类型
 * 根据窗口宽度判断设备类型
 *
 * @returns 'mobile' | 'desktop'
 */
const detectDeviceType = () => {
	const screenWidth = window.innerWidth

	// 小于768px为移动设备
	if (screenWidth < 768) {
		return 'mobile'
	}
	// 大于等于768px为桌面设备
	return 'desktop'
}

/**
 * 重定向到对应设备的考勤页面
 * 检测设备类型后跳转到对应的路由
 */
const redirectToDevicePage = () => {
	const deviceType = detectDeviceType()

	// 根据设备类型重定向
	if (deviceType === 'mobile') {
		router.replace('/attendance-mobile')
	} else {
		router.replace('/attendance-desktop')
	}
}

/**
 * 组件挂载后立即执行重定向
 */
onMounted(() => {
	redirectToDevicePage()
})
</script>

<template>
	<!-- 设备检测加载容器 -->
	<div class="device-detection-container">
		<!-- 加载动画 -->
		<div class="loading-spinner">
			<!-- 旋转加载图标 -->
			<el-icon class="spinner-icon"><loading /></el-icon>
			<!-- 加载提示文本 -->
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
