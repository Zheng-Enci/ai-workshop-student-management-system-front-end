<script setup>
/**
 * 签到分析页面组件(移动端)
 *
 * @description AI坊学生管理系统移动端签到数据统计分析核心页面，适配手机端交互/布局特性，核心功能包括：
 * 1. 多维度签到数据统计（今日/上月/自定义时段切换）
 * 2. 签到时段分布可视化（饼图展示上午/下午/晚上签到人数）
 * 3. 签到时间线可视化（折线图展示签到人数随时间变化趋势）
 * 4. 签到排行榜展示（按签到时间排序，展示前10名学生）
 * 5. 实时签到动态监控（最早/最近签到、平均签到时间）
 * 6. 15秒自动刷新数据，保证数据实时性
 * 7. 暗黑/亮色主题适配，全图表样式随主题动态调整
 * 8. 提供返回上一页、切换主题的快捷操作
 * @component AttendanceAnalysisPageMobile
 * @author 前端开发组
 * @date 2026-01
 * @version 1.0.0
 * @适配端 移动端（375px-414px宽度适配）
 */

// ===================== 第三方依赖导入区 =====================
// Vue3 核心API：响应式变量、组件挂载/卸载生命周期、DOM更新完成回调
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
// Vue Router 路由实例：用于页面跳转（返回上一页）
import { useRouter } from 'vue-router'
// Element Plus 基础样式（按需引入，减小打包体积）
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-segmented.css'
// Element Plus 图标组件：返回箭头、用户、时钟、趋势图、奖杯、饼图
import { ArrowLeft, User, Clock, TrendCharts, Trophy, PieChart } from '@element-plus/icons-vue'

// ===================== ECharts 按需引入配置 =====================
// ECharts 图表类型：饼图（重命名为EChartsPieChart避免冲突）、折线图
import { PieChart as EChartsPieChart, LineChart } from 'echarts/charts'
// ECharts 功能组件：标题、提示框、网格、图例
import {
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent
} from 'echarts/components'
// ECharts 核心库
import * as echarts from 'echarts/core'
// ECharts 渲染器：Canvas渲染（移动端性能更优）
import { CanvasRenderer } from 'echarts/renderers'
// Element Plus 核心组件：消息提示、按钮、图标、分段选择器（时段切换）
import { ElMessage, ElButton, ElIcon, ElSegmented } from 'element-plus'

// ===================== ECharts 组件注册 =====================
// 注册ECharts所需组件（按需引入，避免全量引入增大包体积）
echarts.use([
	TitleComponent,       // 标题组件（当前未使用，预留扩展）
	TooltipComponent,     // 提示框组件（图表交互提示）
	GridComponent,        // 网格组件（折线图布局）
	LegendComponent,      // 图例组件（饼图图例）
	EChartsPieChart,      // 饼图图表（时段分布）
	LineChart,            // 折线图图表（时间线）
	CanvasRenderer        // Canvas渲染器（适配移动端）
])

// ===================== 业务模块导入区 =====================
// 签到相关API：获取今日签到记录、按时间范围获取top学生
import { getTodayAttendanceRecords, getTopStudentsByTimeRange } from '@/api/attendance'
// 状态管理：主题（暗黑/亮色）- 用于图表样式适配
import { useThemeStore } from '@/stores/theme'

// ===================== 全局实例初始化 =====================
/** 路由实例：用于页面跳转（返回上一页） */
const router = useRouter()
/** 主题仓库实例：管理暗黑/亮色主题切换，适配图表样式 */
const themeStore = useThemeStore()

// ===================== 页面交互方法 =====================
/**
 * 返回上一页
 * @function goBack
 * @description 点击左上角返回按钮触发，调用路由返回方法回到上一级页面
 */
const goBack = () => {
	router.go(-1)
}

/**
 * 切换主题模式（暗黑/亮色）
 * @function toggleTheme
 * @description 点击header图标触发，调用主题仓库的切换方法，切换后图表会重新渲染适配样式
 */
const toggleTheme = () => {
	themeStore.toggleTheme()
}

// ===================== 响应式变量定义区 =====================
/**
 * 选中的时间范围（用于数据筛选）
 * @type {Ref<string>}
 * @default 'today'
 * @values 'today'（今日）| 'lastMonth'（上月）| 'custom'（自定义，预留）
 */
const selectedTimeRange = ref('today')

/**
 * 时间范围下拉选项（分段选择器数据源）
 * @type {Array<{label: string, value: string}>}
 */
const timeRangeOptions = [
	{ label: '今日', value: 'today' },
	{ label: '昨月', value: 'lastMonth' },
	{ label: '自定义', value: 'custom' }
]

/**
 * 签到记录列表（接口返回的原始数据）
 * @type {Ref<Array<{name: string, attendanceTime: string}>>}
 */
const attendanceRecords = ref([])

/**
 * 总签到人数
 * @type {Ref<number>}
 * @default 0
 */
const totalAttendance = ref(0)

/**
 * 各时段签到统计数据
 * @type {Ref<{morning: number, afternoon: number, evening: number}>}
 * @property {number} morning - 上午（8-11点）签到人数
 * @property {number} afternoon - 下午（14-17点）签到人数
 * @property {number} evening - 晚上（19-22点）签到人数
 * @default {morning: 0, afternoon: 0, evening: 0}
 */
const periodStats = ref({
	morning: 0,
	afternoon: 0,
	evening: 0
})

/**
 * 签到排行榜列表（按签到时间升序排序）
 * @type {Ref<Array<{name: string, attendanceTime: string}>>}
 */
const rankingList = ref([])

/**
 * 最新签到记录
 * @type {Ref<Object|null>}
 * @default null
 */
const latestAttendance = ref(null)

/**
 * 最早签到记录
 * @type {Ref<Object|null>}
 * @default null
 */
const earliestAttendance = ref(null)

/**
 * 平均签到时间（格式化后的字符串）
 * @type {Ref<string>}
 * @default ''
 */
const averageTime = ref('')

/**
 * 数据最后更新时间（本地化时间字符串）
 * @type {Ref<string>}
 * @default ''
 */
const lastUpdateTime = ref('')

/**
 * 时段分布饼图DOM容器引用
 * @type {Ref<HTMLElement|null>}
 */
const periodChart = ref(null)

/**
 * 签到时间线折线图DOM容器引用
 * @type {Ref<HTMLElement|null>}
 */
const timelineChart = ref(null)

/**
 * 时段分布饼图ECharts实例
 * @type {ECharts|null}
 */
let periodChartInstance = null

/**
 * 签到时间线折线图ECharts实例
 * @type {ECharts|null}
 */
let timelineChartInstance = null

/**
 * 自动刷新定时器实例（15秒刷新一次数据）
 * @type {number|null}
 */
let refreshTimer = null

// ===================== 数据加载与处理函数 =====================
/**
 * 加载签到核心数据（今日）
 * @function loadAttendanceData
 * @description 1. 调用API获取今日签到记录 → 2. 统计总人数 → 3. 计算时段分布 → 4. 生成排行榜 → 5. 计算极值/平均值 → 6. 更新最后更新时间 → 7. 初始化图表
 * @async
 * @returns {Promise<void>}
 */
const loadAttendanceData = async () => {
	try {
		// 调用API获取今日签到记录
		const response = await getTodayAttendanceRecords()

		// 接口返回成功且有数据时处理
		if (response && response.code === 200) {
			attendanceRecords.value = response.data || []
			// 统计总签到人数
			totalAttendance.value = attendanceRecords.value.length
			// 计算各时段签到统计
			periodStats.value = calculatePeriodStats(attendanceRecords.value)

			// 生成签到排行榜（按签到时间升序）
			rankingList.value = [...attendanceRecords.value].sort((a, b) =>
				new Date(a.attendanceTime) - new Date(b.attendanceTime)
			)

			// 计算极值（最早/最新签到）和平均值
			if (attendanceRecords.value.length > 0) {
				latestAttendance.value = attendanceRecords.value[attendanceRecords.value.length - 1]
				earliestAttendance.value = rankingList.value[0]
				averageTime.value = calculateAverageTime(attendanceRecords.value)
			}

			// 更新最后更新时间（本地化时间）
			lastUpdateTime.value = new Date().toLocaleTimeString('zh-CN')

			// 延迟初始化图表（确保DOM渲染完成）
			setTimeout(() => {
				initChartsWithTheme()
			}, 200)
		}
	} catch (error) {
		// 错误提示（移动端友好的消息提示）
		ElMessage.error('加载签到数据失败')
	}
}

/**
 * 加载时间线图表数据（按选中的时间范围）
 * @function loadTimelineData
 * @description 根据选中的时间范围加载对应数据，仅实现今日/上月逻辑，自定义预留扩展
 * @async
 * @returns {Promise<void>}
 */
const loadTimelineData = async () => {
	try {
		let response
		// 根据选中的时间范围调用不同API
		if (selectedTimeRange.value === 'today') {
			response = await getTodayAttendanceRecords()
		} else if (selectedTimeRange.value === 'lastMonth') {
			// 计算上月时间范围（结束时间为今天，开始时间为上月今天）
			const endDate = new Date()
			const startDate = new Date()
			startDate.setMonth(startDate.getMonth() - 1)
			// 调用按时间范围获取top学生API
			response = await getTopStudentsByTimeRange(
				startDate.toISOString(),
				endDate.toISOString(),
				100
			)
		}

		// 接口返回成功时初始化时间线图表
		if (response && response.code === 200) {
			setTimeout(async () => {
				await initTimelineChart()
			}, 100)
		}
	} catch (error) {
		ElMessage.error('加载时间线数据失败')
	}
}

/**
 * 计算各时段签到统计
 * @function calculatePeriodStats
 * @param {Array<{attendanceTime: string}>} records - 签到记录列表
 * @returns {{morning: number, afternoon: number, evening: number}} 各时段签到人数
 * @description 时段划分规则：
 * - 上午：8:00-10:59
 * - 下午：14:00-16:59
 * - 晚上：19:00-21:59
 */
const calculatePeriodStats = records => {
	// 初始化统计数据
	const stats = { morning: 0, afternoon: 0, evening: 0 }

	// 遍历记录统计各时段人数
	records.forEach(record => {
		const hour = new Date(record.attendanceTime).getHours()
		if (hour >= 8 && hour < 11) {
			stats.morning++
		} else if (hour >= 14 && hour < 17) {
			stats.afternoon++
		} else if (hour >= 19 && hour < 22) {
			stats.evening++
		}
	})

	return stats
}

/**
 * 计算平均签到时间
 * @function calculateAverageTime
 * @param {Array<{attendanceTime: string}>} records - 签到记录列表
 * @returns {string} 格式化后的平均时间（HH:MM），无数据返回'--:--'
 */
const calculateAverageTime = records => {
	// 无数据时返回占位符
	if (records.length === 0) { return '--:--' }

	// 转换所有签到时间为时间戳并计算总和
	const times = records.map(item => new Date(item.attendanceTime).getTime())
	const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length

	// 格式化为HH:MM（本地化）
	return new Date(avgTime).toLocaleTimeString('zh-CN', {
		hour: '2-digit',
		minute: '2-digit'
	})
}

/**
 * 格式化时间字符串为HH:MM:SS
 * @function formatTime
 * @param {string} timeString - 原始时间字符串（ISO格式）
 * @returns {string} 格式化后的时间（HH:MM:SS）
 */
const formatTime = timeString => {
	const date = new Date(timeString)
	return date.toLocaleTimeString('zh-CN', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	})
}

/**
 * 获取排行榜名次样式类名
 * @function getRankingClass
 * @param {number} index - 排行榜索引（从0开始）
 * @returns {string} 样式类名（first/second/third/空字符串）
 * @description 用于为前三名添加特殊样式（金色/银色/铜色）
 */
const getRankingClass = index => {
	if (index === 0) { return 'first' }   // 第一名
	if (index === 1) { return 'second' }  // 第二名
	if (index === 2) { return 'third' }   // 第三名
	return ''                             // 其他名次
}

// ===================== 图表初始化函数 =====================
/**
 * 初始化时段分布饼图
 * @function initPeriodChart
 * @description 1. 等待DOM更新 → 2. 销毁旧实例（防内存泄漏） → 3. 创建新实例 → 4. 配置主题适配的饼图选项 → 5. 渲染图表
 * @async
 * @returns {Promise<void>}
 */
const initPeriodChart = async () => {
	// 等待DOM更新完成
	await nextTick()

	// DOM容器不存在时返回
	if (!periodChart.value) { return }

	// 销毁旧实例（防止内存泄漏）
	if (periodChartInstance) {
		periodChartInstance.dispose()
	}

	// 创建新的ECharts实例
	periodChartInstance = echarts.init(periodChart.value)

	// 饼图配置项（适配主题）
	const option = {
		backgroundColor: 'transparent', // 透明背景（适配页面主题）
		tooltip: {                      // 提示框配置
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c} ({d}%)' // 提示格式：名称 + 数量 + 百分比
		},
		legend: {                       // 图例配置
			orient: 'horizontal',         // 水平布局
			bottom: '5%',                 // 距离底部5%
			textStyle: {                  // 文字样式（适配主题）
				color: themeStore.isDark ? '#ffffff' : '#333333'
			}
		},
		series: [{
			name: '签到时段',
			type: 'pie',                  // 饼图类型
			radius: ['40%', '70%'],       // 内/外半径（环形饼图）
			center: ['50%', '45%'],       // 图表居中
			avoidLabelOverlap: false,     // 避免标签重叠
			itemStyle: {                  // 区块样式（适配主题）
				borderRadius: 8,            // 圆角
				borderColor: themeStore.isDark ? '#2c2c2c' : '#ffffff',
				borderWidth: 2
			},
			label: {                      // 标签配置（默认隐藏）
				show: false,
				position: 'center'
			},
			emphasis: {                   // 高亮配置（hover时显示标签）
				label: {
					show: true,
					fontSize: 16,
					fontWeight: 'bold',
					color: themeStore.isDark ? '#ffffff' : '#333333'
				}
			},
			labelLine: {                  // 隐藏标签线
				show: false
			},
			data: [                       // 饼图数据（绑定时段统计）
				{ value: periodStats.value.morning, name: '上午', itemStyle: { color: '#ff6b6b' } },
				{ value: periodStats.value.afternoon, name: '下午', itemStyle: { color: '#4ecdc4' } },
				{ value: periodStats.value.evening, name: '晚上', itemStyle: { color: '#45b7d1' } }
			]
		}]
	}

	// 应用配置项渲染图表
	periodChartInstance.setOption(option)
}

/**
 * 初始化签到时间线折线图
 * @function initTimelineChart
 * @description 1. 适配移动端容器尺寸 → 2. 销毁旧实例 → 3. 创建新实例 → 4. 配置主题适配的折线图选项 → 5. 渲染图表
 * @async
 * @returns {Promise<void>}
 */
const initTimelineChart = async () => {
	// 等待DOM更新完成
	await nextTick()

	// DOM容器不存在时返回
	if (!timelineChart.value) { return }

	// 销毁旧实例
	if (timelineChartInstance) {
		timelineChartInstance.dispose()
	}

	// 适配移动端容器尺寸（宽度=容器宽度，高度=宽度/2）
	const containerWidth = timelineChart.value.offsetWidth
	const containerHeight = containerWidth / 2

	// 创建新实例（指定尺寸）
	timelineChartInstance = echarts.init(timelineChart.value, null, {
		width: containerWidth,
		height: containerHeight
	})

	// 延迟调整尺寸（确保渲染完成）
	setTimeout(() => {
		if (timelineChartInstance) {
			timelineChartInstance.resize({
				width: containerWidth,
				height: containerHeight
			})
		}
	}, 200)

	// 折线图配置项（适配移动端/主题）
	const option = {
		backgroundColor: 'transparent', // 透明背景
		tooltip: {                      // 提示框配置（适配主题）
			trigger: 'axis',
			backgroundColor: themeStore.isDark ? 'rgba(50, 50, 50, 0.9)' : 'rgba(255, 255, 255, 0.9)',
			borderColor: themeStore.isDark ? '#666' : '#ddd',
			textStyle: {
				color: themeStore.isDark ? '#fff' : '#333'
			},
			// 自定义提示格式：时间 + 签到人数
			formatter(params) {
				const data = params[0]
				const date = new Date(data.axisValue)
				const timeStr = date.toLocaleTimeString('zh-CN', {
					hour: '2-digit',
					minute: '2-digit'
				})
				return `${timeStr}<br/>签到人数: ${data.value}`
			}
		},
		grid: {                         // 网格配置（适配移动端边距）
			left: '8%',
			right: '8%',
			bottom: '15%',
			top: '10%',
			containLabel: true
		},
		xAxis: {                        // X轴（时间轴）
			type: 'time',
			axisLine: { show: false },    // 隐藏轴线
			axisTick: { show: false },    // 隐藏刻度
			axisLabel: {                  // 标签样式（适配主题/移动端字体大小）
				color: themeStore.isDark ? '#999' : '#666',
				fontSize: 8,
				// 格式化时间为HH:MM
				formatter(value) {
					const date = new Date(value)
					return date.toLocaleTimeString('zh-CN', {
						hour: '2-digit',
						minute: '2-digit'
					})
				}
			},
			splitLine: {                  // 分割线样式（适配主题）
				show: true,
				lineStyle: {
					color: themeStore.isDark ? '#333' : '#f0f0f0',
					type: 'dashed'
				}
			}
		},
		yAxis: {                        // Y轴（数值轴）
			type: 'value',
			axisLine: { show: false },    // 隐藏轴线
			axisTick: { show: false },    // 隐藏刻度
			axisLabel: {                  // 标签样式（适配主题/移动端）
				color: themeStore.isDark ? '#999' : '#666',
				fontSize: 8
			},
			splitLine: {                  // 分割线样式（适配主题）
				show: true,
				lineStyle: {
					color: themeStore.isDark ? '#333' : '#f0f0f0',
					type: 'dashed'
				}
			}
		},
		series: [{
			name: '签到人数',
			type: 'line',                 // 折线图类型
			smooth: true,                 // 平滑曲线
			symbol: 'circle',             // 标记点形状
			symbolSize: 3,                // 移动端标记点缩小
			lineStyle: {                  // 渐变线条样式
				width: 2,
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 1,
					y2: 0,
					colorStops: [{
						offset: 0, color: '#667eea'
					}, {
						offset: 1, color: '#764ba2'
					}]
				}
			},
			itemStyle: {                  // 标记点样式（带阴影）
				color: '#667eea',
				borderColor: '#fff',
				borderWidth: 2,
				shadowBlur: 10,
				shadowColor: 'rgba(102, 126, 234, 0.3)'
			},
			areaStyle: {                  // 区域填充（渐变）
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [{
						offset: 0, color: 'rgba(102, 126, 234, 0.4)'
					}, {
						offset: 1, color: 'rgba(118, 75, 162, 0.1)'
					}]
				}
			},
			emphasis: {                   // 高亮样式（增大阴影）
				itemStyle: {
					shadowBlur: 20,
					shadowColor: 'rgba(102, 126, 234, 0.5)'
				}
			},
			data: []                      // 数据暂空（实际应从接口绑定，此处预留）
		}]
	}

	// 应用配置项渲染图表
	timelineChartInstance.setOption(option)
}

/**
 * 初始化所有图表（适配当前主题）
 * @function initChartsWithTheme
 * @description 统一初始化饼图和折线图，并调整尺寸适配移动端
 */
const initChartsWithTheme = () => {
	initPeriodChart()
	initTimelineChart()

	// 延迟调整图表尺寸（确保渲染完成）
	setTimeout(() => {
		// 调整时间线图表尺寸
		if (timelineChartInstance && timelineChart.value) {
			const containerWidth = timelineChart.value.offsetWidth
			const containerHeight = containerWidth / 2
			timelineChartInstance.resize({
				width: containerWidth,
				height: containerHeight
			})
		}
		// 调整饼图尺寸
		if (periodChartInstance) {
			periodChartInstance.resize()
		}
	}, 300)
}

/**
 * 处理时间范围切换
 * @function handleTimeRangeChange
 * @description 分段选择器切换时触发，重新加载时间线数据并调整图表尺寸
 * @async
 * @returns {Promise<void>}
 */
const handleTimeRangeChange = async () => {
	try {
		// 重新加载时间线数据
		await loadTimelineData()
		// 调整图表尺寸适配移动端
		setTimeout(() => {
			if (timelineChartInstance && timelineChart.value) {
				const containerWidth = timelineChart.value.offsetWidth
				const containerHeight = containerWidth / 2
				timelineChartInstance.resize({
					width: containerWidth,
					height: containerHeight
				})
			}
		}, 100)
	} catch (error) {
		ElMessage.error('加载时间线数据失败')
	}
}

// ===================== 自动刷新控制函数 =====================
/**
 * 启动数据自动刷新
 * @function startAutoRefresh
 * @description 15秒刷新一次签到数据，保证移动端数据实时性
 */
const startAutoRefresh = () => {
	refreshTimer = setInterval(() => {
		loadAttendanceData()
	}, 15000)
}

/**
 * 停止数据自动刷新
 * @function stopAutoRefresh
 * @description 组件卸载时调用，清除定时器防止内存泄漏
 */
const stopAutoRefresh = () => {
	if (refreshTimer) {
		clearInterval(refreshTimer)
		refreshTimer = null
	}
}

// ===================== 生命周期钩子 =====================
/**
 * 组件挂载完成钩子
 * @description 1. 加载核心签到数据 → 2. 加载时间线数据 → 3. 启动自动刷新
 * @async
 */
onMounted(async () => {
	await loadAttendanceData()
	await loadTimelineData()
	startAutoRefresh()
})

/**
 * 组件卸载钩子
 * @description 1. 停止自动刷新 → 2. 销毁饼图实例 → 3. 销毁折线图实例 → 释放内存
 */
onUnmounted(() => {
	stopAutoRefresh()
	if (periodChartInstance) {
		periodChartInstance.dispose()
	}
	if (timelineChartInstance) {
		timelineChartInstance.dispose()
	}
})
</script>

<template>
	<!-- 移动端签到分析页面根容器（适配移动端布局） -->
	<div class="attendance-analysis-mobile">
		<!-- 页面头部（返回按钮+logo+标题） -->
		<div class="mobile-header">
			<div class="header-left">
				<!-- 返回按钮（文本按钮，适配移动端点击区域） -->
				<el-button
					type="text"
					class="back-button"
					@click="goBack"
				>
					<el-icon><arrow-left /></el-icon>
				</el-button>
				<!-- 系统logo（点击切换主题） -->
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊"
					class="header-icon"
					@click="toggleTheme"
				/>
			</div>
			<h1 class="page-title">签到分析</h1>
		</div>

		<!-- 页面核心内容区（滚动布局） -->
		<div class="mobile-content">
			<!-- 时间范围选择器（分段选择器，适配移动端） -->
			<div class="time-range-selector">
				<el-segmented
					v-model="selectedTimeRange"
					:options="timeRangeOptions"
					size="small"
					@change="handleTimeRangeChange"
				/>
			</div>

			<!-- 核心统计卡片网格（4宫格，展示关键指标） -->
			<div class="mobile-stats-grid">
				<!-- 今日签到人数卡片 -->
				<div class="stat-card">
					<div class="stat-icon">
						<el-icon><user /></el-icon>
					</div>
					<div class="stat-content">
						<div class="stat-value">{{ totalAttendance }}</div>
						<div class="stat-label">今日签到</div>
					</div>
				</div>

				<!-- 平均签到时间卡片 -->
				<div class="stat-card">
					<div class="stat-icon">
						<el-icon><clock /></el-icon>
					</div>
					<div class="stat-content">
						<div class="stat-value">{{ averageTime }}</div>
						<div class="stat-label">平均时间</div>
					</div>
				</div>

				<!-- 总时段签到人数卡片 -->
				<div class="stat-card">
					<div class="stat-icon">
						<el-icon><trend-charts /></el-icon>
					</div>
					<div class="stat-content">
						<div class="stat-value">{{ periodStats.morning + periodStats.afternoon + periodStats.evening }}</div>
						<div class="stat-label">总时段</div>
					</div>
				</div>

				<!-- 最早签到学生卡片 -->
				<div class="stat-card">
					<div class="stat-icon">
						<el-icon><trophy /></el-icon>
					</div>
					<div class="stat-content">
						<div class="stat-value">{{ rankingList.length > 0 ? rankingList[0].name : '-' }}</div>
						<div class="stat-label">最早签到</div>
					</div>
				</div>
			</div>

			<!-- 时段分布饼图区域 -->
			<div class="mobile-chart-section">
				<div class="chart-header">
					<h3>今日签到时段分布</h3>
					<el-icon class="header-icon"><pie-chart /></el-icon>
				</div>
				<!-- 饼图DOM容器（ref绑定periodChart） -->
				<div ref="periodChart" class="mobile-chart"/>
			</div>

			<!-- 签到时间线折线图区域 -->
			<div class="mobile-chart-section">
				<div class="chart-header">
					<h3>签到时间线</h3>
					<el-icon class="header-icon"><trend-charts /></el-icon>
				</div>
				<!-- 折线图DOM容器（ref绑定timelineChart） -->
				<div ref="timelineChart" class="mobile-chart"/>
			</div>

			<!-- 签到排行榜区域（展示前10名） -->
			<div class="mobile-ranking-section">
				<div class="ranking-header">
					<h3>今日签到排行榜</h3>
					<el-icon class="header-icon"><trophy /></el-icon>
				</div>
				<div class="mobile-ranking-list">
					<!-- 排行榜项（仅展示前10条） -->
					<div
						v-for="(item, index) in rankingList.slice(0, 10)"
						:key="index"
						class="mobile-ranking-item"
					>
						<!-- 名次数字（前三名有特殊样式） -->
						<div class="mobile-rank-number" :class="getRankingClass(index)">
							{{ index + 1 }}
						</div>
						<!-- 学生信息（姓名+签到时间） -->
						<div class="mobile-student-info">
							<div class="mobile-student-name">{{ item.name }}</div>
							<div class="mobile-attendance-time">{{ formatTime(item.attendanceTime) }}</div>
						</div>
						<!-- 前三名奖杯图标 -->
						<div v-if="index < 3" class="mobile-rank-badge">
							<el-icon><trophy /></el-icon>
						</div>
					</div>
				</div>
			</div>

			<!-- 实时签到动态区域 -->
			<div class="mobile-realtime-section">
				<div class="realtime-header">
					<h3>实时签到动态</h3>
					<el-icon class="header-icon"><trend-charts /></el-icon>
				</div>
				<div class="mobile-realtime-stats">
					<!-- 最近签到 -->
					<div class="realtime-item">
						<div class="realtime-label">最近签到</div>
						<div v-if="latestAttendance" class="realtime-value">
							{{ latestAttendance.name }} - {{ formatTime(latestAttendance.attendanceTime) }}
						</div>
						<div v-else class="realtime-value">暂无数据</div>
					</div>
					<!-- 平均签到时间 -->
					<div class="realtime-item">
						<div class="realtime-label">平均签到时间</div>
						<div class="realtime-value">{{ averageTime }}</div>
					</div>
					<!-- 最早签到 -->
					<div class="realtime-item">
						<div class="realtime-label">最早签到</div>
						<div v-if="earliestAttendance" class="realtime-value">
							{{ earliestAttendance.name }} - {{ formatTime(earliestAttendance.attendanceTime) }}
						</div>
						<div v-else class="realtime-value">暂无数据</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 页面底部（最后更新时间） -->
		<div class="mobile-footer">
			<div class="last-update">
				最后更新: {{ lastUpdateTime }}
			</div>
		</div>
	</div>
</template>

<style scoped>
/**
 * 局部样式作用域：导入移动端签到分析页面专属样式文件
 * @description 包含移动端适配的布局、颜色、间距、响应式样式，适配375px-414px手机宽度
 * @注意 所有样式均使用rem单位或百分比，保证多机型适配
 */
@import './css/AttendanceAnalysisPageMobile.css';
</style>
