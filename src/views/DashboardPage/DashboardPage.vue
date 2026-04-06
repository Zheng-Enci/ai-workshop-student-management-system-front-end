<!--
  仪表板页面组件
  根据设备类型自动切换显示桌面版或移动版仪表板

  @component DashboardPage
  @description 响应式仪表板页面，根据屏幕宽度自动适配显示对应版本
-->
<script setup>
/**
 * 仪表板页面入口组件
 *
 * @component DashboardPage
 * @description 数据看板页面,支持桌面端和移动端查看
 * 主要功能:
 * 1. 检测设备类型(桌面端/移动端)
 * 2. 根据设备类型自动显示对应的仪表板版本
 * 3. 桌面端显示完整的数据看板功能
 * 4. 移动端显示优化后的响应式数据看板
 *
 * @author 前端开发团队
 * @version 3.0.0
 */

// Vue3 核心API导入
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Setting } from '@element-plus/icons-vue'
import { ElButton, ElIcon } from 'element-plus'
import DashboardPageDesktop from './DashboardPageDesktop.vue'
import DashboardPageMobile from './DashboardPageMobile.vue'

// ===================== 全局实例初始化 =====================
const router = useRouter()

// ===================== 响应式变量定义区 =====================
/**
 * 设备类型状态
 * @type {Ref<string>}
 * @description 当前设备类型标识,'desktop'表示桌面端,'mobile'表示移动端
 */
const deviceType = ref('desktop')

// ===================== 业务逻辑方法区 =====================
/**
 * 检测设备类型
 * @function detectDevice
 * @description 根据浏览器窗口宽度判断当前设备类型
 * 判断规则:
 * - 屏幕宽度 < 768px: 判定为移动设备,显示移动端仪表板
 * - 屏幕宽度 >= 768px: 判定为桌面设备,显示桌面端仪表板
 * 这是响应式设计的标准断点,符合移动端和桌面端的分界
 */
const detectDevice = () => {
	// 获取当前浏览器窗口的宽度(像素)
	const screenWidth = window.innerWidth

	// 小于768px为移动设备
	if (screenWidth < 768) {
		deviceType.value = 'mobile'
	} else {
		// 大于等于768px为桌面设备
		deviceType.value = 'desktop'
	}
}

/**
 * 返回上一页
 * @function goBack
 * @description 点击返回按钮时触发,返回浏览器历史记录的上一页
 */
const goBack = () => {
	router.go(-1)
}

// ===================== 生命周期钩子 =====================
/**
 * 组件挂载生命周期钩子
 * @description 组件挂载完成后执行以下操作:
 * 1. 初始检测设备类型
 * 2. 监听窗口大小变化事件,实时切换设备类型
 */
onMounted(() => {
	// 初始检测设备类型
	detectDevice()
	/**
	 * 监听窗口大小变化
	 * @description 当用户调整浏览器窗口大小时,实时检测设备类型并切换组件
	 * 这样可以实现响应式布局,无需刷新页面
	 */
	window.addEventListener('resize', detectDevice)
})
</script>

<template>
	<div class="dashboard-page">
		<!-- 移动端: 显示优化后的响应式仪表板 -->
		<dashboard-page-mobile v-if="deviceType === 'mobile'" />
		<!-- 桌面端: 显示完整数据看板 -->
		<dashboard-page-desktop v-else />
	</div>
</template>

<style scoped>
.dashboard-page {
	width: 100%;
	height: 100%;
}
</style>
