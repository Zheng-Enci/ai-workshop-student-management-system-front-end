<script setup>
/**
 * 首页入口组件
 * 
 * @description 负责检测设备类型,并根据设备类型重定向到对应的桌面版或移动版首页
 * @component HomePage
 */
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 路由实例,用于页面跳转
const router = useRouter()

/**
 * 检测是否为移动设备
 * 
 * @description 根据窗口宽度判断设备类型
 * @returns {boolean} true表示移动端, false表示桌面端
 */
const isMobile = () => window.innerWidth <= 768

/**
 * 组件挂载时根据设备类型跳转到对应页面
 */
onMounted(() => {
	// 根据设备类型跳转到对应的页面
	if (isMobile()) {
		router.replace('/home-mobile')
	} else {
		router.replace('/home-desktop')
	}
})
</script>

<template>
	<!-- 首页入口容器,不显示任何内容,仅用于重定向 -->
	<div/>
</template>

<style scoped>
/* 样式将在具体页面文件中定义,此处保持为空 */
</style>
