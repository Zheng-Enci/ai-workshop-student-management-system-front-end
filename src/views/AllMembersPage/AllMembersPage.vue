<!--
  所有成员页面设备检测组件
  检测设备类型并自动跳转到对应的成员列表页面版本

  @component AllMembersPage
  @description 作为成员列表页面的入口，结合屏幕宽度和UserAgent检测设备类型后重定向
-->
<script setup>
/**
 * 导入Element Plus图标和组件
 */
import { ElIcon } from 'element-plus'
import { onMounted } from 'vue'
import 'element-plus/theme-chalk/el-icon.css'
import { Loading } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

/**
 * 路由实例
 */
const router = useRouter()

/**
 * 检测设备类型
 * 结合屏幕宽度和UserAgent进行更准确的设备类型判断
 *
 * @returns 'mobile' | 'desktop'
 */
const detectDeviceType = () => {
	const screenWidth = window.innerWidth
	const userAgent = navigator.userAgent.toLowerCase()

	// 结合屏幕宽度和 userAgent 进行更准确的检测
	// 屏幕宽度小于768px或UserAgent包含移动设备标识，则判定为移动设备
	const isMobile = screenWidth < 768 ||
                   /android.*mobile|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)

	return isMobile ? 'mobile' : 'desktop'
}

/**
 * 重定向到对应设备的成员列表页面
 * 根据检测到的设备类型跳转到对应的路由
 */
const redirectToDevicePage = () => {
	const deviceType = detectDeviceType()

	// 根据设备类型重定向到对应的成员列表页面
	if (deviceType === 'mobile') {
		router.replace('/all-members-mobile')
	} else {
		router.replace('/all-members-desktop')
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
/**
 * 设备检测容器样式
 * 全屏居中显示，带渐变背景
 */
.device-detection-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;

  /* 多色渐变背景 */
  background: linear-gradient(135deg,
    rgb(99 102 241 / 0.1) 0%,
    rgb(168 85 247 / 0.08) 25%,
    rgb(236 72 153 / 0.06) 50%,
    rgb(251 146 60 / 0.08) 75%,
    rgb(34 197 94 / 0.1) 100%);
}

/**
 * 加载动画容器
 * 毛玻璃卡片效果，内容垂直排列
 */
.loading-spinner {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  padding: 40px;

  /* 毛玻璃背景 */
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  box-shadow: 0 8px 32px var(--shadow-color);
  backdrop-filter: blur(20px);
}

/**
 * 旋转加载图标样式
 */
.spinner-icon {
  font-size: 32px;
  color: var(--primary-color);

  /* 旋转动画 */
  animation: spin 1s linear infinite;
}

/**
 * 加载提示文本样式
 */
.loading-text {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

/**
 * 旋转动画定义
 * 从0度旋转到360度
 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
