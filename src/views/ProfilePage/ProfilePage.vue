<!--
  个人信息页面设备检测组件
  检测设备类型并自动跳转到对应的个人信息页面版本
  
  @component ProfilePage
  @description 作为个人信息页面的入口，检测设备类型后重定向到desktop或mobile版本
-->
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

/**
 * 路由实例
 */
const router = useRouter()

/**
 * 检测设备类型并重定向
 * 根据窗口宽度判断设备类型，并跳转到对应的个人信息页面路由
 */
const detectDevice = () => {
	const screenWidth = window.innerWidth

	// 小于768px为移动设备，跳转到移动版
	if (screenWidth < 768) {
		router.replace('/profile/mobile')
	} else {
		// 大于等于768px为桌面设备，跳转到桌面版
		router.replace('/profile/desktop')
	}
}

/**
 * 组件挂载后立即检测设备并重定向
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
