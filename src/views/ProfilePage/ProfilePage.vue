<!--
  个人信息页面设备检测组件
  检测设备类型并自动跳转到对应的个人信息页面版本
  
  @component ProfilePage
  @description 作为个人信息页面的入口，检测设备类型后重定向到desktop或mobile版本
-->
<script setup>
/**
 * 个人信息页面设备检测组件
 * 
 * @component ProfilePage
 * @description 作为个人信息页面的入口组件,负责以下功能:
 * 1. 检测用户设备类型(移动端/桌面端)
 * 2. 根据设备类型自动重定向到对应的个人信息页面版本
 * 3. 显示设备检测加载动画,提升用户体验
 * 
 * @author 前端开发团队
 * @version 1.0.0
 */

// Vue3 生命周期钩子导入
import { onMounted } from 'vue'
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
 * 检测设备类型并重定向
 * @function detectDevice
 * @description 根据浏览器窗口宽度判断设备类型,并跳转到对应的个人信息页面路由
 * 判断规则:
 * - 屏幕宽度 < 768px: 判定为移动设备,跳转到移动版个人信息页面
 * - 屏幕宽度 >= 768px: 判定为桌面设备,跳转到桌面版个人信息页面
 * 使用router.replace而非push,避免在浏览器历史记录中留下中间页面
 */
const detectDevice = () => {
	// 获取当前浏览器窗口的宽度(像素)
	const screenWidth = window.innerWidth

	// 小于768px为移动设备,跳转到移动版个人信息页面
	if (screenWidth < 768) {
		router.replace('/profile/mobile')
	} else {
		// 大于等于768px为桌面设备,跳转到桌面版个人信息页面
		router.replace('/profile/desktop')
	}
}

// ===================== 生命周期钩子 =====================
/**
 * 组件挂载生命周期钩子
 * @description 组件挂载完成后立即执行设备检测和页面重定向
 * 确保用户访问个人信息页面时能够快速跳转到对应设备版本的页面
 */
onMounted(() => {
	detectDevice()
})
</script>

<template>
	<!-- 设备检测加载容器 -->
	<div class="device-detection">
		<!-- 加载提示容器 -->
		<div class="loading-container">
			<!-- 加载旋转动画 -->
			<div class="loading-spinner"/>
			<!-- 加载提示文本 -->
			<p>正在检测设备类型...</p>
		</div>
	</div>
</template>

<style scoped>
@import './css/ProfilePage.css';
</style>
