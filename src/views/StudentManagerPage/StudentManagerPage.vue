<!--
  学生管理页面设备检测组件
  检测设备类型并自动跳转到对应的学生管理页面版本
  
  @component StudentManagerPage
  @description 作为学生管理页面的入口，结合屏幕宽度和UserAgent检测设备类型后重定向
-->
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

/**
 * 路由实例
 */
const router = useRouter()

/**
 * 检测设备类型
 * 结合屏幕宽度和UserAgent进行更准确的设备类型判断
 * 
 * @returns {string} 'mobile' | 'desktop'
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
 * 重定向到对应设备的学生管理页面
 * 根据检测到的设备类型跳转到对应的路由
 */
const redirectToDevicePage = () => {
	const deviceType = detectDeviceType()

	// 根据设备类型重定向到对应的学生管理页面
	if (deviceType === 'mobile') {
		router.replace('/student-manager/mobile')
	} else {
		router.replace('/student-manager/desktop')
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
			<!-- 旋转加载图标（注意：这里需要导入Loading组件） -->
			<el-icon class="spinner-icon"><Loading /></el-icon>
			<!-- 加载提示文本 -->
			<p class="loading-text">正在检测设备类型...</p>
		</div>
	</div>
</template>

<style scoped>
/**
 * 设备检测容器样式
 * 全屏居中显示，带紫色渐变背景
 */
.device-detection-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  /* 紫色渐变背景 */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/**
 * 加载动画容器
 * 白色文本，居中对齐
 */
.loading-spinner {
  color: white;
  text-align: center;
}

/**
 * 旋转加载图标样式
 * 大号图标，带无限旋转动画
 */
.spinner-icon {
  font-size: 48px;
  /* 持续旋转动画，1秒一圈 */
  animation: spin 1s linear infinite;
}

/**
 * 加载提示文本样式
 * 白色文本，中等字重
 */
.loading-text {
  margin-top: 16px;
  font-size: 18px;
  font-weight: 500;
}

/**
 * 旋转动画关键帧定义
 * 从0度平滑旋转到360度，形成连续循环效果
 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
