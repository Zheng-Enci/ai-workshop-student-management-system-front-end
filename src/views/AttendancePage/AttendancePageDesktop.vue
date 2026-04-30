<script setup lang="ts">
/**
 * 签到页面组件(桌面端)
 *
 * @description 学生签到功能页面(桌面端专属)，核心功能包括：
 * 1. 展示签到热力图（按周/时段统计签到次数）
 * 2. 展示签到趋势图（累计签到次数折线图）
 * 3. 展示日历形式的签到历史记录（按早/午/晚时段区分）
 * 4. 实时检测签到时段、展示当前时间和下次签到时间
 * 5. 支持暗黑/亮色主题切换适配
 * 6. 提供日历月份切换、返回导航页等交互功能
 * @component AttendancePageDesktop
 * @author 前端开发组
 * @date 2026-01
 * @version 1.0.0
 */
/////
// ===================== 第三方依赖导入区 =====================
// Element Plus Message 组件样式（确保样式加载顺序正确）
import 'element-plus/theme-chalk/el-message.css'
// Element Plus 图标组件：返回箭头
import { ArrowLeft } from '@element-plus/icons-vue'
// ECharts 图表类型：热力图
import { HeatmapChart } from 'echarts/charts'
// ECharts 组件：标题、提示框、网格、图例、日历、视觉映射
import {
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	CalendarComponent,
	VisualMapComponent
} from 'echarts/components'
// ECharts 核心库
import * as echarts from 'echarts/core'
// ECharts 渲染器：Canvas渲染（适配桌面端性能）
import { CanvasRenderer } from 'echarts/renderers'
// Element Plus 基础组件：按钮
import { ElButton } from 'element-plus'
// Vue Router 路由跳转
import { useRouter } from 'vue-router'

// ===================== 业务模块导入区 =====================
// 状态管理：主题（暗黑/亮色）
import { useThemeStore } from '@/stores/ts/theme'
// 全局加载蒙版组件
import LoadingMask from '@/components/LoadingMask.vue'
import AttendancePageHeatmapDesktopComponent from './desktop/AttendancePageHeatmapDesktopComponent.vue'
import AttendancePageTrendDesktopComponent from './desktop/AttendancePageTrendDesktopComponent.vue'
import AttendancePageCalendarDesktopComponent from './desktop/AttendancePageCalendarDesktopComponent.vue'

// ===================== ECharts 组件注册 =====================
// 注册ECharts所需组件（按需引入，减小打包体积）
echarts.use([
	TitleComponent,       // 标题组件
	TooltipComponent,     // 提示框组件
	GridComponent,        // 网格组件
	LegendComponent,      // 图例组件
	CalendarComponent,    // 日历组件
	VisualMapComponent,   // 视觉映射组件（热力图颜色映射）
	HeatmapChart,         // 热力图图表
	CanvasRenderer        // Canvas渲染器
])

// ===================== 状态管理实例化 =====================
// 主题仓库实例
const themeStore = useThemeStore()
// 解构主题切换方法
const { toggleTheme } = themeStore
// 路由实例
const router = useRouter()

// ===================== 页面交互方法区 =====================
/**
 * 返回导航页面
 * @function goToNavigation
 * @description 点击返回按钮时触发，跳转到导航主页面
 */
const goToNavigation = () => {
	router.push('/navigation')
}
</script>

<template>
	<!-- 签到页面根容器（桌面端） -->
	<div class="attendance-page-desktop-container">
		<!-- 全局加载蒙版 -->
		<LoadingMask/>
		<!-- 背景装饰效果 -->
		<div class="attendance-page-desktop-background-effects">
			<div class="attendance-page-desktop-gradient-orb attendance-page-desktop-orb-1"/>
			<div class="attendance-page-desktop-gradient-orb attendance-page-desktop-orb-2"/>
			<div class="attendance-page-desktop-gradient-orb attendance-page-desktop-orb-3"/>
		</div>

		<!-- 内容包裹层 -->
		<div class="attendance-page-desktop-content-wrapper">
			<!-- 页面标题区 -->
			<div class="attendance-page-desktop-page-title">
				<!-- 系统logo（点击切换主题） -->
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊学生管理系统"
					class="attendance-page-desktop-title-logo"
					title="切换主题模式"
					@click="toggleTheme"/>
				<h1>AI坊学生签到</h1>
			</div>

			<!-- 顶部操作栏 -->
			<div class="attendance-page-desktop-top-bar">
				<!-- 返回导航按钮 -->
				<el-button
					type="primary"
					class="attendance-page-desktop-nav-button"
					:icon="ArrowLeft"
					@click="goToNavigation"
				>
					返回导航
				</el-button>
			</div>

			<!-- 标语角标 -->
			<div class="attendance-page-desktop-motto-corner">
				<img
					src="@/assets/QunCeQunLiChuangXingGongXing.png"
					alt="群策群力 创新共行"
					class="attendance-page-desktop-motto-image"
				/>
			</div>

			<!-- 主内容区 -->
			<div class="attendance-page-desktop-main-content">
				<!-- 布局网格（预留左侧面板） -->
				<div class="attendance-page-desktop-layout-grid">
					<div class="attendance-page-desktop-left-panel"/>
				</div>

				<!-- 热力图组件 -->
				<div class="attendance-page-desktop-chart-item">
					<div class="attendance-page-desktop-chart-title">签到热力图</div>
					<AttendancePageHeatmapDesktopComponent/>
				</div>

				<!-- 趋势图组件 -->
				<div class="attendance-page-desktop-chart-item">
					<div class="attendance-page-desktop-chart-title">签到趋势图</div>
					<AttendancePageTrendDesktopComponent/>
				</div>

				<!-- 签到记录日历组件 -->
				<div class="attendance-page-desktop-chart-item">
					<div class="attendance-page-desktop-chart-title">签到记录</div>
					<AttendancePageCalendarDesktopComponent/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* 导入桌面端专属样式文件（包含布局、颜色、交互等样式） */
@import './desktop/css/AttendancePageDesktop.css';

/**
 * 样式说明：
 * 1. 所有样式均为scoped作用域，避免全局污染
 * 2. 适配暗黑/亮色主题的样式在script中通过主题状态动态控制
 * 3. 布局采用响应式适配桌面端（1920×1080及以上分辨率）
 * 4. 交互样式（hover/active）在外部CSS文件中定义
 */
</style>

<style>
/* ===================== Element Plus Message 全局样式覆盖 ===================== */

</style>
