<script setup>
/**
 * 注册页面入口组件
 *
 * @description 负责检测设备类型,并根据设备类型重定向到对应的桌面版或移动版注册页面
 * @component RegisterPage
 */
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DeviceDetector, { DeviceType } from '@/composables/ts/DeviceDetector'

// 路由实例,用于页面跳转
const router = useRouter()

/**
 * 检测是否为移动设备
 *
 * @description 使用DeviceDetector判断设备类型
 * @returns true表示移动端, false表示桌面端
 */
const isMobile = () => {
	const deviceType = DeviceDetector.detect()
	// 平板设备也归类为移动端
	return deviceType !== DeviceType.DESKTOP
}

/**
 * 组件挂载时根据设备类型跳转到对应页面
 */
onMounted(() => {
	// 根据设备类型跳转到对应的注册页面
	if (isMobile()) {
		router.replace('/register-mobile')
	} else {
		router.replace('/register-desktop')
	}
})
</script>

<template>
	<!-- 注册页面入口容器,不显示任何内容,仅用于重定向 -->
	<div/>
</template>

<style scoped>
/* 样式将在具体页面文件中定义,此处保持为空 */
</style>
