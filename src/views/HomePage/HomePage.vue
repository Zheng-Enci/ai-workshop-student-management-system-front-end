<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 检测是否为移动设备
const isMobile = () => window.innerWidth <= 768

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
	<div/>
</template>

<style scoped>
/* 样式将在具体页面文件中定义 */
</style>
