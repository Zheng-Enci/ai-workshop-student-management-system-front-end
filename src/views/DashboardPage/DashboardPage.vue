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
 * @description 数据看板页面,仅支持桌面端查看
 * 主要功能:
 * 1. 检测设备类型(桌面端/移动端)
 * 2. 移动端显示提示信息,引导用户使用电脑端访问
 * 3. 桌面端显示完整的数据看板功能
 *
 * @author 前端开发团队
 * @version 2.0.0
 */

// Vue3 核心API导入
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Setting } from '@element-plus/icons-vue'
import { ElButton, ElIcon } from 'element-plus'
import DashboardPageDesktop from './DashboardPageDesktop.vue'

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
 * - 屏幕宽度 < 768px: 判定为移动设备
 * - 屏幕宽度 >= 768px: 判定为桌面设备
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
		<!-- 移动端: 显示提示信息 -->
		<div v-if="deviceType === 'mobile'" class="mobile-tip">
			<div class="mobile-tip-content">
				<div class="tip-header">
					<el-button type="text" class="back-btn" @click="goBack">
						<el-icon><arrow-left /></el-icon>
					</el-button>
					<img
						src="@/assets/AiWorkShop_icon.png"
						alt="AI坊"
						class="logo"/>
					<div class="header-title">数据看板</div>
				</div>
				<div class="tip-card">
					<div class="tip-icon">
						<el-icon size="64"><setting /></el-icon>
					</div>
					<h3 class="tip-title">数据看板</h3>
					<p class="tip-description">
						数据看板功能仅支持电脑端查看，请在电脑上访问本系统以查看完整的数据统计和分析功能。
					</p>
					<el-button type="primary" class="return-btn" @click="goBack">
						返回导航页
					</el-button>
				</div>
			</div>
		</div>
		<!-- 桌面端: 显示完整数据看板 -->
		<dashboard-page-desktop v-else />
	</div>
</template>

<style scoped>
.dashboard-page {
	width: 100%;
	height: 100%;
}

/* 移动端提示样式 */
.mobile-tip {
	width: 100%;
	height: 100%;
	background: var(--bg-color, #f5f7fa);
	display: flex;
	align-items: center;
	justify-content: center;
}

.mobile-tip-content {
	width: 100%;
	max-width: 500px;
	padding: 20px;
}

.tip-header {
	display: flex;
	align-items: center;
	margin-bottom: 40px;
}

.back-btn {
	padding: 8px;
	font-size: 20px;
	color: var(--text-primary, #333);
}

.logo {
	width: 32px;
	height: 32px;
	margin: 0 12px;
	cursor: pointer;
}

.header-title {
	flex: 1;
	text-align: center;
	font-size: 18px;
	font-weight: 600;
	color: var(--text-primary, #333);
}

.tip-card {
	background: var(--card-bg, #fff);
	border-radius: 16px;
	padding: 40px 30px;
	text-align: center;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.tip-icon {
	margin-bottom: 20px;
	color: var(--primary-color, #409eff);
}

.tip-title {
	font-size: 24px;
	font-weight: 600;
	color: var(--text-primary, #333);
	margin: 0 0 16px 0;
}

.tip-description {
	font-size: 14px;
	color: var(--text-secondary, #666);
	line-height: 1.6;
	margin: 0 0 30px 0;
}

.return-btn {
	width: 100%;
	height: 44px;
	font-size: 16px;
}

/* 暗色模式 */
html.dark .mobile-tip {
	background: var(--bg-color, #0f172a);
}

html.dark .tip-card {
	background: var(--card-bg, #1e293b);
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

html.dark .back-btn {
	color: var(--text-primary, #e2e8f0);
}

html.dark .header-title {
	color: var(--text-primary, #e2e8f0);
}

html.dark .tip-title {
	color: var(--text-primary, #e2e8f0);
}

html.dark .tip-description {
	color: var(--text-secondary, #94a3b8);
}
</style>
