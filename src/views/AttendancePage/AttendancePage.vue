<!--
  考勤页面设备检测组件
  检测设备类型并自动跳转到对应的考勤页面版本

  @component AttendancePage
  @description 作为考勤页面的入口，检测设备类型后重定向到desktop或mobile版本
-->
<script setup>
/**
 * 考勤页面设备检测组件
 * 
 * @component AttendancePage
 * @description 作为考勤页面的入口组件,负责以下功能:
 * 1. 检测用户设备类型(移动端/桌面端)
 * 2. 根据设备类型自动重定向到对应的考勤页面版本
 * 3. 显示设备检测加载动画,提升用户体验
 * 
 * @author 前端开发团队
 * @version 1.0.0
 */

// ===================== 依赖导入区 =====================
// Element Plus 加载图标组件导入
import { Loading } from '@element-plus/icons-vue'
// Element Plus 图标组件导入
import { ElIcon } from 'element-plus'
// Vue3 生命周期钩子导入
import { onMounted } from 'vue'
// Element Plus 图标样式导入
import 'element-plus/theme-chalk/el-icon.css'
// Vue Router 路由功能导入
import { useRouter } from 'vue-router'

// ===================== 全局实例初始化 =====================
/**
 * 路由实例
 * @type {Router}
 * @description 用于页面跳转和路由导航,实现设备检测后的页面重定向
 */
const router = useRouter()

// ===================== 业务逻辑方法区 =====================
/**
 * 检测设备类型
 * 
 * @function detectDeviceType
 * @description 根据浏览器窗口宽度判断当前设备类型
 * 判断规则:
 * - 屏幕宽度 < 768px: 判定为移动设备
 * - 屏幕宽度 >= 768px: 判定为桌面设备
 * 
 * @returns {string} 'mobile' | 'desktop' - 设备类型标识
 */
const detectDeviceType = () => {
	// 获取当前浏览器窗口的宽度(像素)
	const screenWidth = window.innerWidth

	// 小于768px为移动设备
	// 这是响应式设计的标准断点,符合移动端和桌面端的分界
	if (screenWidth < 768) {
		return 'mobile'
	}
	// 大于等于768px为桌面设备
	return 'desktop'
}

/**
 * 重定向到对应设备的考勤页面
 * 
 * @function redirectToDevicePage
 * @description 执行设备检测并根据结果跳转到对应的考勤页面版本
 * 流程:
 * 1. 调用设备检测方法获取设备类型
 * 2. 根据设备类型使用router.replace进行路由替换
 * 3. 使用replace而非push,避免在浏览器历史记录中留下中间页面
 */
const redirectToDevicePage = () => {
	// 执行设备类型检测
	const deviceType = detectDeviceType()

	// 根据设备类型重定向到对应的考勤页面
	// 移动端跳转到移动版考勤页面
	if (deviceType === 'mobile') {
		router.replace('/attendance-mobile')
	} else {
		// 桌面端跳转到桌面版考勤页面
		router.replace('/attendance-desktop')
	}
}

// ===================== 生命周期钩子 =====================
/**
 * 组件挂载生命周期钩子
 * 
 * @description 组件挂载完成后立即执行设备检测和页面重定向
 * 确保用户访问考勤页面时能够快速跳转到对应设备版本的页面
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
 * 设备检测页面容器样式
 * @description 全屏居中布局,使用渐变背景提升视觉效果
 */
.device-detection-container {
  /* Flex布局:水平垂直居中 */
  display: flex;
  align-items: center;
  justify-content: center;
  /* 最小高度为视口高度,确保全屏显示 */
  min-height: 100vh;
  /**
   * 渐变背景
   * @description 使用多色渐变背景,营造现代感视觉效果
   * 颜色顺序:蓝紫→紫色→粉色→橙色→绿色
   */
  background: linear-gradient(135deg,
    rgb(99 102 241 / 0.1) 0%,
    rgb(168 85 247 / 0.08) 25%,
    rgb(236 72 153 / 0.06) 50%,
    rgb(251 146 60 / 0.08) 75%,
    rgb(34 197 94 / 0.1) 100%);
}

/**
 * 加载动画容器样式
 * @description 毛玻璃效果卡片,包含加载图标和提示文本
 */
.loading-spinner {
  /* Flex布局:垂直排列 */
  display: flex;
  flex-direction: column;
  /* 元素间距 */
  gap: 16px;
  /* 水平居中 */
  align-items: center;
  /* 内边距 */
  padding: 40px;
  /* 毛玻璃背景效果 */
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  box-shadow: 0 8px 32px var(--shadow-color);
  /* 背景模糊效果 */
  backdrop-filter: blur(20px);
}

/**
 * 旋转加载图标样式
 * @description 主色调图标,持续旋转动画
 */
.spinner-icon {
  font-size: 32px;
  color: var(--primary-color);
  /* 旋转动画:1秒线性无限循环 */
  animation: spin 1s linear infinite;
}

/**
 * 加载提示文本样式
 * @description 中等字重,使用主题文字颜色
 */
.loading-text {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

/**
 * 旋转动画定义
 * @description 从0度旋转到360度,实现图标旋转效果
 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
