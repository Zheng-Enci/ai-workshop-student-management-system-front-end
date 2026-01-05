<script setup>
/**
 * 管理员页面入口组件
 * 
 * @description 负责检测设备类型,并根据设备类型重定向到对应的桌面版或移动版管理员页面
 * @component AdminPage
 */
import { ElIcon } from 'element-plus'
import { onMounted } from 'vue'
import 'element-plus/theme-chalk/el-icon.css'
import { Loading } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

// 路由实例,用于页面跳转
const router = useRouter()

/**
 * 检测设备类型
 * 
 * @description 结合屏幕宽度和User-Agent判断设备类型
 * @returns {string} 'mobile' 表示移动端, 'desktop' 表示桌面端
 */
const detectDeviceType = () => {
	const screenWidth = window.innerWidth
	const userAgent = navigator.userAgent.toLowerCase()

	// 结合屏幕宽度和 userAgent 进行更准确的检测
	// 屏幕宽度小于768px 或 匹配移动端User-Agent则判定为移动设备
	const isMobile = screenWidth < 768 ||
                   /android.*mobile|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)

	return isMobile ? 'mobile' : 'desktop'
}

/**
 * 重定向到对应设备的页面
 * 
 * @description 根据设备类型跳转到桌面版或移动版管理员页面
 */
const redirectToDevicePage = () => {
	// 执行设备检测（符合项目要求,入口文件需要做设备检测）
	const deviceType = detectDeviceType()

	// 根据设备类型跳转到对应的页面
	if (deviceType === 'mobile') {
		router.replace('/admin/mobile')
	} else {
		router.replace('/admin/desktop')
	}
}

/**
 * 组件挂载时立即执行设备检测和页面跳转
 */
onMounted(() => {
	redirectToDevicePage()
})
</script>

<template>
	<!-- 设备检测页面容器 -->
	<div class="device-detection-container">
		<!-- 加载动画区域 -->
		<div class="loading-spinner">
			<!-- 旋转加载图标 -->
			<el-icon class="spinner-icon"><loading /></el-icon>
			<!-- 加载提示文本 -->
			<p class="loading-text">正在检测设备类型...</p>
		</div>
	</div>
</template>

<style scoped>
/* 设备检测页面容器样式 */
.device-detection-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  /* 渐变背景 */
  background: linear-gradient(135deg,
    rgba(99, 102, 241, 0.1) 0%,
    rgba(168, 85, 247, 0.08) 25%,
    rgba(236, 72, 153, 0.06) 50%,
    rgba(251, 146, 60, 0.08) 75%,
    rgba(34, 197, 94, 0.1) 100%);
}

/* 加载动画容器样式 */
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

/* 旋转图标动画样式 */
.spinner-icon {
  font-size: 32px;
  color: var(--primary-color);
  /* 旋转动画 */
  animation: spin 1s linear infinite;
}

/* 加载文本样式 */
.loading-text {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

/* 旋转动画定义 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
