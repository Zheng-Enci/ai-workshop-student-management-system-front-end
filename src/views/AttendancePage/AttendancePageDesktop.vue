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
// Element Plus 图标组件：签到勾选、返回箭头
import { Check, ArrowLeft } from '@element-plus/icons-vue'
// ECharts 图表类型：热力图、折线图
import { HeatmapChart, LineChart } from 'echarts/charts'
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
// Element Plus 基础组件：按钮、图标、日历
import { ElButton, ElIcon, ElCalendar } from 'element-plus'
// Vue3 核心API：响应式、生命周期、DOM更新、监听、类型
import {ref, onMounted, onUnmounted, nextTick, watch, type Ref} from 'vue'
// Element Plus 基础样式（按需引入）
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-calendar.css'
// Vue Router 路由跳转
import { useRouter } from 'vue-router'

// ===================== 业务模块导入区 =====================
// 签到相关API：获取当前用户签到记录
import AttendanceApi from '@/api/ts/AttendanceApi'
// 状态管理：主题（暗黑/亮色）
import { useThemeStore } from '@/stores/ts/theme'
// 状态管理：用户信息
import { useUserStore } from '@/stores/ts/user'
// 状态管理：全局加载蒙版
import { useLoadingMaskStore } from '@/stores/ts/loading'
// 全局加载蒙版组件
import LoadingMask from '@/components/LoadingMask.vue'
import AttendancePageHeatmapDesktopComponent from './desktop/AttendancePageHeatmapDesktopComponent.vue'

// ===================== 类型定义区 =====================
/**
 * 签到记录接口
 * @interface MyAttendanceRecord
 */
interface MyAttendanceRecord {
	attendanceDateTime: string
}

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
	LineChart,            // 折线图图表
	CanvasRenderer        // Canvas渲染器
])

// ===================== 状态管理实例化 =====================
// 用户信息仓库实例
const userStore = useUserStore()
// 主题仓库实例
const themeStore = useThemeStore()
// 解构主题切换方法
const { toggleTheme } = themeStore
// 路由实例
const router = useRouter()
// 全局加载蒙版 Store
const loadingMaskStore = useLoadingMaskStore()

// ===================== 响应式变量定义区 =====================
/**
 * 学生等级（用于后续等级展示/权限控制）
 * @type {Ref<number>}
 */
const studentLevel: Ref<number> = ref(0)

/**
 * 是否处于签到时间段内
 * @type {Ref<boolean>}
 */
const isInSignTime: Ref<boolean> = ref(false)

/**
 * 当前时间字符串（格式：HH:MM:SS）
 * @type {Ref<string>}
 */
const currentTime: Ref<string> = ref('')

/**
 * 下次签到时间提示文本
 * @type {Ref<string>}
 */
const nextSignTime: Ref<string> = ref('')

/**
 * 热力图组件引用
 * @type {Ref<any>}
 */
const heatmapComponentRef: Ref<any> = ref<any>(null)

/**
 * 时间检测定时器实例（用于实时更新时间/签到状态）
 * @type {Ref<ReturnType<typeof setInterval> | null>}
 */
const timeInterval: Ref<ReturnType<typeof setInterval> | null> = ref<ReturnType<typeof setInterval> | null>(null)

/**
 * 折线图DOM容器引用
 * @type {Ref<HTMLElement | null>}
 */
const lineChart: Ref<HTMLElement | null> = ref<HTMLElement | null>(null)

/**
 * 折线图ECharts实例
 * @type {Ref<any>}
 */
const lineInstance: Ref<any> = ref<any>(null)

/**
 * 签到记录列表（接口返回数据）
 * @type {Ref<AttendanceRecord[]>}
 */
const attendanceRecords: Ref<MyAttendanceRecord[]> = ref<MyAttendanceRecord[]>([])

/**
 * 日历当前选中日期
 * @type {Ref<Date>}
 */
const calendarValue: Ref<Date> = ref(new Date())

// ===================== 页面交互方法区 =====================
/**
 * 返回导航页面
 * @function goToNavigation
 * @description 点击返回按钮时触发，跳转到导航主页面
 */
const goToNavigation = () => {
	router.push('/navigation')
}

/**
  * 获取指定日期的所有签到时间
  * @function getDateAttendanceTimes
  * @param {string} dateStr - 目标日期（格式：YYYY-MM-DD）
  * @returns {Array<string>} 该日期下的所有签到时间字符串数组
  */
 const getDateAttendanceTimes = (dateStr: string): string[] => {
	// 无签到记录时返回空数组
	if (!attendanceRecords.value || attendanceRecords.value.length === 0) {
		return []
	}

	// 过滤指定日期的签到记录，并提取签到时间
	return attendanceRecords.value.filter(record => {
		// 数据容错：排除空记录/无时间字段的记录
		if (!record || !record.attendanceDateTime) {
			return false
		}

		// 解析记录日期并与目标日期对比
		const recordDate = new Date(record.attendanceDateTime)
		const [recordDateStr] = recordDate.toISOString().split('T')
		return recordDateStr === dateStr
	}).map(record => record.attendanceDateTime)
}

/**
 * 格式化签到时间为HH:MM:SS格式
 * @function formatAttendanceTime
 * @param {string} timeStr - 原始时间字符串（ISO格式）
 * @returns {string} 格式化后的时间字符串（HH:MM:SS）
 */
const formatAttendanceTime = (timeStr: string): string => {
	const date = new Date(timeStr)
	const hours = date.getHours().toString().padStart(2, '0')
	const minutes = date.getMinutes().toString().padStart(2, '0')
	const seconds = date.getSeconds().toString().padStart(2, '0')
	return `${hours}:${minutes}:${seconds}`
}

/**
 * 根据签到时间判断时段标签（早上/下午/晚上/其他）
 * @function getTimeSlotLabel
 * @param {string} timeStr - 原始时间字符串（ISO格式）
 * @returns {string} 时段标签文本
 */
const getTimeSlotLabel = (timeStr: string): string => {
	const date = new Date(timeStr)
	const hour = date.getHours()

	// 时段划分规则
	if (hour >= 6 && hour < 12) {
		return '早上'
	} if (hour >= 12 && hour < 18) {
		return '下午'
	} if (hour >= 18 && hour < 24) {
		return '晚上'
	}
	return '其他'
}

/**
 * 格式化日历标题为「YYYY年 月份中文名」格式
 * @function formatCalendarTitle
 * @param {Date | string} date - 目标日期
 * @returns {string} 格式化后的日历标题
 */
const formatCalendarTitle = (date: Date | string): string => {
	const dateObj = new Date(date)
	const year = dateObj.getFullYear()
	const month = dateObj.getMonth() + 1
	// 月份中文名映射
	const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

	// 检查日期是否有效
	if (isNaN(year) || isNaN(month)) {
		const today = new Date()
		return `${today.getFullYear()}年 ${monthNames[today.getMonth()]}`
	}

	return `${year}年 ${monthNames[month - 1]}`
}

/**
 * 日历标题文本（响应式变量）
 * @type {Ref<string>}
 */
const calendarTitle: Ref<string> = ref(formatCalendarTitle(calendarValue.value))

/**
 * 更新日历标题文本
 * @function updateCalendarTitle
 * @description 根据calendarValue更新日历标题，用于手动触发标题更新
 */
const updateCalendarTitle = () => {
	calendarTitle.value = formatCalendarTitle(calendarValue.value)
}

/**
 * 日历切换到上个月
 * @function prevMonth
 * @description 点击上个月按钮时触发，更新日历选中日期
 */
const prevMonth = () => {
	const date = new Date(calendarValue.value)
	date.setMonth(date.getMonth() - 1)
	calendarValue.value = date
	updateCalendarTitle()
}

/**
 * 日历切换到下个月
 * @function nextMonth
 * @description 点击下个月按钮时触发，更新日历选中日期
 */
const nextMonth = () => {
	const date = new Date(calendarValue.value)
	date.setMonth(date.getMonth() + 1)
	calendarValue.value = date
	updateCalendarTitle()
}

/**
 * 日历跳转到今天
 * @function goToday
 * @description 点击今天按钮时触发，重置日历选中日期为当前日期
 */
const goToday = () => {
	calendarValue.value = new Date()
	updateCalendarTitle()
}

/**
 * 判断指定日期的指定时段是否已签到
 * @function isTimeSlotSigned
 * @param {string} dateStr - 目标日期（格式：YYYY-MM-DD）
 * @param {string} timeSlot - 目标时段（morning/afternoon/evening）
 * @returns {boolean} 该时段是否已签到
 */
const isTimeSlotSigned = (dateStr: string, timeSlot: string): boolean => {
	// 无签到记录时返回false
	if (!attendanceRecords.value || attendanceRecords.value.length === 0) {
		return false
	}

	// 检测是否存在指定日期+时段的签到记录
	return attendanceRecords.value.some(record => {
		// 数据容错
		if (!record || !record.attendanceDateTime) {
			return false
		}

		// 解析记录日期
		const recordDate = new Date(record.attendanceDateTime)
		const [recordDateStr] = recordDate.toISOString().split('T')

		// 日期不匹配直接返回false
		if (recordDateStr !== dateStr) {
			return false
		}

		// 获取小时数，判断时段
		const hour = recordDate.getHours()
		switch (timeSlot) {
			case 'morning': // 早上（6-12点）
				return hour >= 6 && hour < 12
			case 'afternoon': // 下午（12-18点）
				return hour >= 12 && hour < 18
			case 'evening': // 晚上（18-24点）
				return hour >= 18 && hour < 24
			default:
				return false
		}
	})
}

// ===================== 图表数据生成区 =====================
/**
 * 生成折线图所需数据
 * @function generateLineData
 * @description 按日期统计累计签到次数，用于展示签到趋势
 * @returns {Object} 包含日期数组和累计值数组的对象
 * @property {Array<string>} dates - 排序后的日期数组（YYYY-MM-DD）
 * @property {Array<number>} values - 对应日期的累计签到次数
 */
const generateLineData = (): { dates: string[]; values: number[] } => {
	// 日期→当日签到次数 映射表
	const dateMap = new Map<string, number>()

	// 统计每日签到次数
	attendanceRecords.value.forEach(record => {
		if (!record.attendanceDateTime) {
			return
		}
		const date = new Date(record.attendanceDateTime)
		if (isNaN(date.getTime())) {
			return
		}
		const [dateStr] = date.toISOString().split('T')
		dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1)
	})

	// 日期排序（保证折线图时间顺序正确）
	const sortedDates = Array.from(dateMap.keys()).sort()
	// 每日签到次数数组
	const dailyValues = sortedDates.map(date => dateMap.get(date))

	// 计算累计签到次数
	let cumulativeSum = 0
	const cumulativeValues = dailyValues.map(value => {
		cumulativeSum += value || 0
		return cumulativeSum
	})

	return {
		dates: sortedDates,
		values: cumulativeValues
	}
}

// ===================== 图表初始化区 =====================
/**
 * 初始化签到趋势折线图
 * @function initLineChart
 * @description 销毁旧实例→创建新实例→生成数据→配置选项→渲染图表
 */
const initLineChart = () => {
	// DOM容器不存在时直接返回
	if (!lineChart.value) { return }

	// 销毁旧实例（防止内存泄漏）
	if (lineInstance.value) {
		lineInstance.value.dispose()
	}

	// 创建新的ECharts实例
	lineInstance.value = echarts.init(lineChart.value)

	// 生成折线图数据
	const lineData = generateLineData()

	// 折线图配置项
	const option = {
		backgroundColor: 'transparent', // 透明背景
		tooltip: { // 提示框配置
			trigger: 'axis', // 轴触发
			backgroundColor: themeStore.isDarkMode ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.9)',
			borderColor: '#ddd',
			textStyle: { // 文本样式（适配主题）
				color: themeStore.isDarkMode ? '#000' : '#333'
			},
			// 自定义提示框内容
			formatter(params: any) {
				const date = new Date(params[0].axisValue)
				const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
				return `${formattedDate}<br/>累计签到次数: ${params[0].value}`
			}
		},
		grid: { // 网格布局
			left: '8%',
			right: '8%',
			bottom: '15%',
			top: '15%',
			containLabel: true // 包含标签
		},
		xAxis: { // X轴：时间
			type: 'time',
			boundaryGap: false, // 无边界间隙
			axisLabel: { // 轴标签样式
				color: themeStore.isDarkMode ? '#ccc' : '#666',
				fontSize: 11,
				rotate: 45, // 旋转45度防止重叠
				// 自定义日期格式（月/日）
				formatter(value: string | number | Date) {
					const date = new Date(value)
					return `${date.getMonth() + 1}/${date.getDate()}`
				}
			},
			axisLine: { // 轴线样式
				lineStyle: {
					color: themeStore.isDarkMode ? '#444' : '#ddd'
				}
			},
			splitLine: { // 分割线样式
				show: true,
				lineStyle: {
					color: themeStore.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
				}
			}
		},
		yAxis: { // Y轴：累计次数
			type: 'value',
			name: '累计签到次数', // 轴名称
			nameTextStyle: { // 轴名称样式
				color: themeStore.isDarkMode ? '#ccc' : '#666',
				fontSize: 12
			},
			axisLabel: { // 轴标签样式
				color: themeStore.isDarkMode ? '#ccc' : '#666',
				fontSize: 11
			},
			axisLine: { // 轴线样式
				lineStyle: {
					color: themeStore.isDarkMode ? '#444' : '#ddd'
				}
			},
			splitLine: { // 分割线样式
				lineStyle: {
					color: themeStore.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
				}
			}
		},
		series: [{ // 系列数据
			name: '累计签到次数',
			type: 'line', // 折线图类型
			smooth: true, // 平滑曲线
			symbol: 'circle', // 标记点形状
			symbolSize: 6, // 标记点大小
			lineStyle: { // 线条样式
				color: '#4fc3f7',
				width: 3
			},
			itemStyle: { // 标记点样式
				color: '#4fc3f7',
				borderColor: '#fff',
				borderWidth: 2
			},
			areaStyle: { // 区域填充样式（渐变）
				color: {
					type: 'linear', // 线性渐变
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [{
						offset: 0, color: 'rgba(79, 195, 247, 0.3)' // 顶部颜色
					}, {
						offset: 1, color: 'rgba(79, 195, 247, 0.05)' // 底部颜色
					}]
				}
			},
			emphasis: { // 高亮样式
				itemStyle: {
					color: '#0288d1',
					borderColor: '#fff',
					borderWidth: 3,
					shadowBlur: 10,
					shadowColor: 'rgba(79, 195, 247, 0.5)'
				},
				lineStyle: {
					width: 4
				}
			},
			// 数据格式：[日期, 累计次数]
			data: lineData.dates.map((date, index) => [date, lineData.values[index]])
		}]
	}

	// 应用配置项渲染图表
	lineInstance.value.setOption(option)
}

/**
 * 初始化所有图表
 * @function initCharts
 * @description 统一初始化折线图（热力图已抽离为独立组件）
 */
const initCharts = () => {
	initLineChart()
}

// ===================== 数据加载区 =====================
/**
 * 加载用户签到记录
 * @function loadAttendanceRecords
 * @description 调用API获取签到记录，成功后初始化图表
 * @async
 */
const loadAttendanceRecords = async () => {
	try {
		// 显示加载蒙版
		loadingMaskStore.showLoadingMask('正在加载签到记录...')
		// 从本地存储获取学生ID
		const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
		const studentId = userInfo.studentId
		if (!studentId) {
			loadingMaskStore.hideLoadingMask()
			return
		}
		// 调用API获取签到记录
		const response = await AttendanceApi.getStudentAttendanceRecords(studentId)
		// 接口返回成功且有数据时更新记录并初始化图表
		if (response && response.data) {
			attendanceRecords.value = (response.data as unknown) as MyAttendanceRecord[]
			// 等待DOM更新完成后初始化图表
			await nextTick()
			initCharts()
			// 更新热力图组件数据
			heatmapComponentRef.value?.updateData()
		}
	} catch {
		// 错误容错（可扩展：添加错误提示、日志上报）
	} finally {
		// 隐藏加载蒙版
		loadingMaskStore.hideLoadingMask()
	}
}

/**
 * 加载学生等级
 * @function loadStudentLevel
 * @description 从用户仓库/本地存储中获取学生等级
 */
const loadStudentLevel = () => {
	try {
		// 优先从用户仓库获取，仓库无数据则从本地存储读取
		const userInfo = userStore.userInfo || JSON.parse(localStorage.getItem('userInfo') || '{}')
		studentLevel.value = userInfo.level || 0
	} catch {
		// 解析失败时默认等级为0
		studentLevel.value = 0
	}
}

/**
 * 检测当前是否处于签到时段
 * @function checkSignTime
 * @description 1. 更新当前时间 2. 判断是否在签到时段 3. 计算下次签到时间
 */
const checkSignTime = () => {
	// 获取当前时间
	const now = new Date()
	const hour = now.getHours()
	const minute = now.getMinutes()
	const second = now.getSeconds()
	// 格式化当前时间为HH:MM:SS
	currentTime.value = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`

	// 签到时段配置
	const signTimeRanges = [
		{ start: 8, end: 11, name: '上午' }, // 上午8-11点
		{ start: 14, end: 17, name: '下午' }, // 下午14-17点
		{ start: 19, end: 22, name: '晚上' }  // 晚上19-22点
	]

	let inTime = false // 是否在签到时段
	let nextTime = ''  // 下次签到时间

	// 判断当前是否在任意签到时段内
	for (const range of signTimeRanges) {
		if (hour >= range.start && hour < range.end) {
			inTime = true
			break
		}
	}

	// 不在签到时段时计算下次签到时间
	if (!inTime) {
		// 查找当前时间之后的第一个签到时段
		for (const range of signTimeRanges) {
			if (hour < range.start) {
				nextTime = `${range.name} ${range.start.toString().padStart(2, '0')}:00`
				break
			}
		}
		// 所有时段都已过（如22点后），提示明天上午
		if (!nextTime) {
			nextTime = '明天上午 08:00'
		}
	}

	// 更新响应式变量
	isInSignTime.value = inTime
	nextSignTime.value = nextTime
}

// ===================== 生命周期钩子 =====================
/**
 * 组件挂载完成钩子
 * @description 1. 初始化签到时间检测 2. 启动时间定时器 3. 加载学生等级 4. 加载签到记录
 * @async
 */
onMounted(async () => {
	try {
		// 首次检测签到时间
		checkSignTime()
		// 启动定时器（每秒更新时间/签到状态）
		timeInterval.value = setInterval(checkSignTime, 1000)
		// 加载学生等级
		loadStudentLevel()
		// 加载签到记录
		await loadAttendanceRecords()
	} catch {
		// 组件挂载初始化失败
	}
})

/**
 * 监听主题变化
 * @description 主题切换时重新渲染图表（适配暗黑/亮色样式）
 */
watch(() => themeStore.isDarkMode, () => {
	// 等待DOM更新完成后重新初始化图表
	nextTick(() => {
		initLineChart()
	})
})

/**
 * 组件卸载钩子
 * @description 1. 清除定时器 2. 销毁ECharts实例（防止内存泄漏）
 */
onUnmounted(() => {
	// 清除时间检测定时器
	if (timeInterval.value) {
		clearInterval(timeInterval.value)
	}
	// 销毁折线图实例
	if (lineInstance.value) {
		lineInstance.value.dispose()
	}
})
</script>

<template>
	<!-- 签到页面根容器（桌面端） -->
	<div class="attendance-container-desktop">
		<!-- 全局加载蒙版 -->
		<LoadingMask/>
		<!-- 背景装饰效果 -->
		<div class="background-effects-desktop">
			<div class="gradient-orb-desktop orb-1"/>
			<div class="gradient-orb-desktop orb-2"/>
			<div class="gradient-orb-desktop orb-3"/>
		</div>

		<!-- 内容包裹层 -->
		<div class="content-wrapper-desktop">
			<!-- 页面标题区 -->
			<div class="page-title-desktop">
				<!-- 系统logo（点击切换主题） -->
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊学生管理系统"
					class="title-logo-desktop"
					title="切换主题模式"
					@click="toggleTheme"/>
				<h1>AI坊学生签到</h1>
			</div>

			<!-- 顶部操作栏 -->
			<div class="top-bar-desktop">
				<!-- 返回导航按钮 -->
				<el-button
					type="primary"
					class="nav-button-desktop"
					:icon="ArrowLeft"
					@click="goToNavigation"
				>
					返回导航
				</el-button>
			</div>

			<!-- 标语角标 -->
			<div class="motto-corner-desktop">
				<img
					src="@/assets/QunCeQunLiChuangXingGongXing.png"
					alt="群策群力 创新共行"
					class="motto-image-desktop"
				/>
			</div>

			<!-- 主内容区 -->
			<div class="main-content-desktop">
				<!-- 布局网格（预留左侧面板） -->
				<div class="layout-grid-desktop">
					<div class="left-panel-desktop"/>
				</div>

				<!-- 热力图组件 -->
				<div class="chart-item-desktop">
					<div class="chart-title-desktop">签到热力图</div>
					<AttendancePageHeatmapDesktopComponent ref="heatmapComponentRef"/>
				</div>

				<!-- 折线图组件 -->
				<div class="chart-item-desktop">
					<div class="chart-title-desktop">签到趋势图</div>
					<div ref="lineChart" class="chart-content-desktop"/>
				</div>

				<!-- 签到记录日历组件 -->
				<div class="chart-item-desktop">
					<div class="chart-title-desktop">签到记录</div>
					<div class="calendar-container-desktop">
						<!-- Element Plus日历组件 -->
						<el-calendar v-model="calendarValue" class="attendance-calendar-desktop" @click.stop>
							<!-- 日历头部自定义模板 -->
							<template #header="">
								<div class="calendar-header-desktop">
									<div class="header-title">{{ calendarTitle }}</div>
									<div class="header-actions">
										<el-button size="small" @click="prevMonth">上个月</el-button>
										<el-button size="small" @click="goToday">今天</el-button>
										<el-button size="small" @click="nextMonth">下个月</el-button>
									</div>
								</div>
							</template>
							<!-- 日历单元格自定义模板 -->
							<template #date-cell="{ data }">
								<div
									class="calendar-cell-desktop"
									:class="{ 'has-attendance': getDateAttendanceTimes(data.day).length > 0 }"
								>
									<div class="calendar-cell-wrapper-desktop">
										<!-- 日期数字 -->
										<div class="cell-date-desktop">{{ data.day.split('-')[2] }}</div>
										<!-- 时段签到状态 -->
										<div class="cell-status-desktop">
											<div class="time-slot-status">
												<!-- 早上时段 -->
												<div
													class="time-slot morning"
													:class="{ 'signed': isTimeSlotSigned(data.day, 'morning') }"
												>
													<span class="time-label">早</span>
													<el-icon
														v-if="isTimeSlotSigned(data.day, 'morning')"
														class="slot-icon"
													>
														<check />
													</el-icon>
												</div>
												<!-- 下午时段 -->
												<div
													class="time-slot afternoon"
													:class="{ 'signed': isTimeSlotSigned(data.day, 'afternoon') }"
												>
													<span class="time-label">午</span>
													<el-icon
														v-if="isTimeSlotSigned(data.day, 'afternoon')"
														class="slot-icon"
													>
														<check />
													</el-icon>
												</div>
												<!-- 晚上时段 -->
												<div
													class="time-slot evening"
													:class="{ 'signed': isTimeSlotSigned(data.day, 'evening') }"
												>
													<span class="time-label">晚</span>
													<el-icon
														v-if="isTimeSlotSigned(data.day, 'evening')"
														class="slot-icon"
													>
														<check />
													</el-icon>
												</div>
											</div>
										</div>
									</div>
									<!-- 签到时间提示框（有签到记录时显示） -->
									<div
										v-if="getDateAttendanceTimes(data.day).length > 0"
										class="custom-tooltip-desktop"
										:data-date="data.day"
									>
										<div class="tooltip-content-desktop">
											<div class="tooltip-times-desktop">
												<div
													v-for="(time, index) in getDateAttendanceTimes(data.day)"
													:key="index"
													class="tooltip-time-item-desktop"
												>
                          <span class="tooltip-time-slot-desktop">
                            {{ getTimeSlotLabel(time) }}
                          </span>
													<span class="tooltip-time-text-desktop">
                            {{ formatAttendanceTime(time) }}
                          </span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</template>
						</el-calendar>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* 导入桌面端专属样式文件（包含布局、颜色、交互等样式） */
@import './desktop/css/attendance-desktop.css';

/**
 * 样式说明：
 * 1. 所有样式均为scoped作用域，避免全局污染
 * 2. 适配暗黑/亮色主题的样式在script中通过主题状态动态控制
 * 3. 布局采用响应式适配桌面端（1920×1080及以上分辨率）
 * 4. 交互样式（hover/active）在外部CSS文件中定义
 */
</style>
