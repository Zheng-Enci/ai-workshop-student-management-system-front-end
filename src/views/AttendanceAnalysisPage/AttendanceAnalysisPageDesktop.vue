/**
 * 签到分析页面组件(桌面端)
 * 
 * @description 管理员端桌面端签到数据统计分析组件，提供签到时段分布、时间线趋势、签到排行榜等功能
 * @component AttendanceAnalysisPageDesktop
 * @author 开发团队
 * @date 2026-01-06
 * @version 1.0.0
 * @dependency vue: ^3.3.0, vue-router: ^4.2.0, element-plus: ^2.0.0, echarts: ^5.4.0
 * @feature 时段分布饼图展示今日签到时段统计
 * @feature 时间线图表支持多种时间范围选择查看
 * @feature 签到排行榜展示学生签到顺序和等级
 * @feature 实时签到动态显示最新、最早和平均签到时间
 * @feature 支持亮色/暗色主题切换，图表样式自适应
 * @feature 自动刷新数据功能，每15秒更新一次
 */
<script setup>
/**
 * Vue 核心响应式 API
 * @description 提供组件的响应式状态管理和生命周期钩子
 */

// ===================== 导入依赖区 =====================
/**
 * Vue 核心响应式 API
 * @description 提供组件的响应式状态管理和生命周期钩子
 */
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

/**
 * Vue 路由实例
 * @description 用于页面导航和路由管理
 */
import { useRouter } from 'vue-router'

/**
 * Element Plus 样式导入
 * @description 引入组件所需的Element Plus样式文件
 */
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-radio-group.css'
import 'element-plus/theme-chalk/el-radio-button.css'
import 'element-plus/theme-chalk/el-date-picker.css'

/**
 * Element Plus 图标导入
 * @description 引入页面所需的Element Plus图标组件
 */
import {
	ArrowLeft,
	Refresh,
	PieChart,
	Clock,
	Trophy,
	Medal,
	Star,
	TrendCharts
} from '@element-plus/icons-vue'

// ECharts 按需引入
/**
 * ECharts 图表类型
 * @description 引入需要使用的图表类型
 */
import { PieChart as EChartsPieChart, LineChart, ScatterChart } from 'echarts/charts'

/**
 * ECharts 组件
 * @description 引入图表需要的组件
 */
import {
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent
} from 'echarts/components'

/**
 * ECharts 核心库
 * @description 图表初始化和配置的核心库
 */
import * as echarts from 'echarts/core'

/**
 * ECharts 渲染器
 * @description 负责图表的渲染实现
 */
import { CanvasRenderer } from 'echarts/renderers'

/**
 * Element Plus 组件导入
 * @description 引入页面所需的Element Plus组件
 */
import { ElMessage, ElButton, ElIcon, ElRadioGroup, ElRadioButton, ElDatePicker } from 'element-plus'

// 注册 ECharts 组件和渲染器
echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	EChartsPieChart,
	LineChart,
	ScatterChart,
	CanvasRenderer
])

// API 接口导入
import { getTodayAttendanceRecords, getDailyAttendanceCountInRange } from '@/api/attendance'
import { getStudentLevel } from '@/api/student'

// Pinia 状态管理
import { useThemeStore } from '@/stores/theme'

// ===================== 全局实例初始化 =====================
/**
 * 路由实例
 * @type {Router}
 * @description 用于页面跳转和路由导航
 */
const router = useRouter()
/**
 * 主题状态仓库实例
 * @type {Store}
 * @description 管理应用主题切换(亮色/暗色模式)
 */
const themeStore = useThemeStore()
/**
 * 主题切换方法
 * @type {Function}
 * @description 解构自主题Store,用于切换明暗主题
 */
const { toggleTheme } = themeStore

/**
 * 使用主题重新初始化图表
 * @returns {void}
 * @description 销毁现有图表实例并重新创建,用于主题切换时更新图表样式
 */
const initChartsWithTheme = () => {
	try {
		if (periodChartInstance) {
			periodChartInstance.dispose()
			periodChartInstance = null
		}
		if (timelineChartInstance) {
			timelineChartInstance.dispose()
			timelineChartInstance = null
		}

		window.requestAnimationFrame(async () => {
			setTimeout(async () => {
				await initPeriodChart()
				await initTimelineChart()
			}, 100)
		})
	} catch (error) {
		return
	}
}

/**
 * 刷新图表数据
 * @returns {void}
 * @description 销毁并重新创建图表实例,用于数据刷新
 */
const refreshCharts = () => {
	try {
		if (periodChartInstance) {
			periodChartInstance.dispose()
			periodChartInstance = null
		}
		if (timelineChartInstance) {
			timelineChartInstance.dispose()
			timelineChartInstance = null
		}

		window.requestAnimationFrame(async () => {
			setTimeout(async () => {
				await initPeriodChart()
				await initTimelineChart()
			}, 100)
		})
	} catch (error) {
		return
	}
}

/**
 * 处理主题切换
 * @returns {void}
 * @description 切换主题并延迟刷新图表以应用新主题样式
 */
const handleThemeToggle = () => {
	toggleTheme()
	window.requestAnimationFrame(() => {
		setTimeout(() => {
			refreshCharts()
		}, 150)
	})
}

// ===================== 响应式变量定义区 =====================
/**
 * 数据加载状态
 * @type {Ref<boolean>}
 * @description 控制数据加载中的状态显示
 */
const isLoading = ref(false)
/**
 * 最后更新时间
 * @type {Ref<string>}
 * @description 记录数据最后更新的时间字符串
 */
const lastUpdateTime = ref('')
/**
 * 考勤记录列表
 * @type {Ref<Array>}
 * @description 存储所有考勤记录数据
 */
const attendanceRecords = ref([])
/**
 * 总考勤次数
 * @type {Ref<number>}
 * @description 累计签到总次数
 */
const totalAttendance = ref(0)
/**
 * 时段统计数据
 * @type {Ref<Object>}
 * @description 按时段分类的签到次数统计
 * @property {number} morning - 上午签到次数
 * @property {number} afternoon - 下午签到次数
 * @property {number} evening - 晚上签到次数
 */
const periodStats = ref({
	morning: 0,
	afternoon: 0,
	evening: 0
})
/**
 * 排行榜列表
 * @type {Ref<Array>}
 * @description 存储签到排行榜的学生数据
 */
const rankingList = ref([])
/**
 * 最早签到记录
 * @type {Ref<Object|null>}
 * @description 记录最早的一次签到信息
 */
const latestAttendance = ref(null)
/**
 * 最晚签到记录
 * @type {Ref<Object|null>}
 * @description 记录最晚的一次签到信息
 */
const earliestAttendance = ref(null)
/**
 * 平均签到时间
 * @type {Ref<string>}
 * @description 计算得出的平均签到时间字符串
 */
const averageTime = ref('')
/**
 * 学生详细信息
 * @type {Ref<Object>}
 * @description 存储学生的详细信息数据
 */
const studentDetails = ref({})

/**
 * 选中的时间范围
 * @type {Ref<string>}
 * @description 时间范围选择:'today'|'week'|'month'|'custom'
 */
const selectedTimeRange = ref('today')
/**
 * 自定义日期范围
 * @type {Ref<Array>}
 * @description 用户自定义的日期范围数组[startDate, endDate]
 */
const customDateRange = ref([])
/**
 * 时间线数据
 * @type {Ref<Array>}
 * @description 用于时间线图表展示的数据
 */
const timelineData = ref([])

// ===================== 常量定义区 =====================
/**
 * 项目启动日期
 * @type {Date}
 * @description 项目正式启动的日期,用于过滤在此之前的数据
 * 避免显示项目启动前的无效数据
 */
const PROJECT_LAUNCH_DATE = new Date('2025-09-09T00:00:00')

/**
 * 确保时间不早于项目启动日期
 * @function ensureTimeNotBeforeLaunch
 * @param {Date} time - 待检查的时间对象
 * @returns {Date} - 返回原始时间或项目启动日期的较晚者
 * @description 防止查询项目启动之前的无效数据，确保所有查询时间范围都在项目启动日期之后
 * @example
 * const validTime = ensureTimeNotBeforeLaunch(new Date('2025-08-01'));
 * // 返回 PROJECT_LAUNCH_DATE (2025-09-09)，因为传入时间早于项目启动日期
 */
const ensureTimeNotBeforeLaunch = time => (time < PROJECT_LAUNCH_DATE ? PROJECT_LAUNCH_DATE : time)

/**
 * 时间范围选项配置
 * @type {Array<Object>}
 * @description 提供给用户选择的时间范围选项列表
 * @property {string} label - 显示在界面上的选项名称
 * @property {string} value - 选项的实际值，用于内部逻辑判断
 */
const timeRangeOptions = [
	{ label: '今日', value: 'today' },
	{ label: '昨天', value: 'yesterday' },
	{ label: '本周', value: 'week' },
	{ label: '上周', value: 'lastWeek' },
	{ label: '本月', value: 'month' },
	{ label: '昨月', value: 'lastMonth' },
	{ label: '最近7天', value: 'last7days' },
	{ label: '最近30天', value: 'last30days' },
	{ label: '本年度', value: 'year' },
	{ label: '全部', value: 'all' },
	{ label: '自定义', value: 'custom' }
]

/**
 * ECharts图表实例引用
 * @description 用于管理图表实例的生命周期和交互
 */
/**
 * 时段分布饼图实例
 * @type {Object|null}
 * @description 存储签到时段分布饼图的ECharts实例
 */
let periodChartInstance = null

/**
 * 时间线图表实例
 * @type {Object|null}
 * @description 存储签到时间线图表的ECharts实例
 */
let timelineChartInstance = null

/**
 * 数据刷新定时器
 * @type {number|null}
 * @description 用于定时刷新签到数据的定时器ID
 */
let refreshTimer = null

/**
 * 图表大小调整定时器
 * @type {number|null}
 * @description 用于防抖处理图表大小调整的定时器ID
 */
const resizeTimeout = null

/**
 * 时段图表大小观察器
 * @type {ResizeObserver|null}
 * @description 监听时段分布图表容器大小变化的ResizeObserver实例
 */
let periodResizeObserver = null

/**
 * 时间线图表大小观察器
 * @type {ResizeObserver|null}
 * @description 监听时间线图表容器大小变化的ResizeObserver实例
 */
let timelineResizeObserver = null

/**
 * DOM元素引用
 * @description 用于获取和操作页面DOM元素的引用
 */
/**
 * 时段分布图表DOM引用
 * @type {Ref<HTMLElement|null>}
 * @description 时段分布饼图的DOM容器引用
 */
const periodChart = ref(null)

/**
 * 时间线图表DOM引用
 * @type {Ref<HTMLElement|null>}
 * @description 时间线图表的DOM容器引用
 */
const timelineChart = ref(null)

/**
 * 返回导航页
 * @returns {void}
 * @description 跳转回导航中心页面
 */
const goBack = () => {
	router.push('/navigation')
}

/**
 * 处理时间范围变更
 * @returns {Promise<void>}
 * @description 重新加载时间线数据并更新图表
 */
const handleTimeRangeChange = async () => {
	try {
		await loadTimelineData()
		await nextTick()
		if (timelineChartInstance) {
			updateTimelineChart()
		} else {
			setTimeout(async () => {
				await initTimelineChart()
			}, 100)
		}
	} catch (error) {
		ElMessage.error('加载时间线数据失败')
	}
}

/**
 * 处理自定义日期范围变更
 * @returns {Promise<void>}
 * @description 验证日期选择后重新加载时间线数据并更新图表
 */
const handleCustomDateChange = async () => {
	if (customDateRange.value && customDateRange.value.length === 2) {
		try {
			await loadTimelineData()
			await nextTick()
			if (timelineChartInstance) {
				updateTimelineChart()
			} else {
				setTimeout(async () => {
					await initTimelineChart()
				}, 100)
			}
		} catch (error) {
			ElMessage.error('加载时间线数据失败')
		}
	}
}

/**
 * 格式化时间字符串
 * @param {string} timeString - ISO格式时间字符串
 * @returns {string} - 格式化后的时间(HH:mm:ss)
 * @description 将ISO时间字符串转换为中文时间格式
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
 * 获取排行榜样式类名
 * @param {number} index - 排名索引(从0开始)
 * @returns {string} - 对应的CSS类名
 * @description 根据排名返回不同的样式类名(前三名特殊样式)
 */
const getRankingClass = index => {
	if (index === 0) { return 'rank-first' }
	if (index === 1) { return 'rank-second' }
	if (index === 2) { return 'rank-third' }
	return 'rank-normal'
}

/**
 * 获取等级样式类名
 * @param {string} levelName - 等级名称
 * @returns {string} - 对应的CSS类名
 * @description 根据学生等级返回对应的样式类名
 */
const getLevelClass = levelName => {
	if (levelName === '管理员') { return 'level-admin' }
	if (levelName === '核心成员') { return 'level-core' }
	if (levelName === '普通成员') { return 'level-normal' }
	return 'level-club'
}

/**
 * 计算时段统计数据
 * @param {Array<Object>} records - 签到记录数组
 * @returns {Object} - 包含morning、afternoon、evening三个时段的签到数量
 * @description 将签到记录按时间段(上午8-12、下午14-18、晚上19-22)进行分类统计
 */
const calculatePeriodStats = records => {
	const stats = { morning: 0, afternoon: 0, evening: 0 }

	records.forEach(record => {
		const hour = new Date(record.attendanceTime).getHours()
		if (hour >= 8 && hour < 12) { stats.morning++ } else if (hour >= 14 && hour < 18) { stats.afternoon++ } else if (hour >= 19 && hour < 22) { stats.evening++ }
	})

	return stats
}

/**
 * 计算平均签到时间
 * @param {Array<Object>} records - 签到记录数组
 * @returns {string} - 格式化的平均时间(HH:mm)
 * @description 计算所有签到时间的平均值并格式化输出
 */
const calculateAverageTime = records => {
	if (records.length === 0) { return '暂无数据' }

	const totalMinutes = records.reduce((sum, record) => {
		const date = new Date(record.attendanceTime)
		return sum + date.getHours() * 60 + date.getMinutes()
	}, 0)

	const avgMinutes = Math.round(totalMinutes / records.length)
	const hours = Math.floor(avgMinutes / 60)
	const minutes = avgMinutes % 60

	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

/**
 * 加载学生详细信息
 * @returns {Promise<void>}
 * @description 获取所有签到学生的等级信息并缓存
 */
const loadStudentDetails = async () => {
	try {
		const details = {}

		for (const record of attendanceRecords.value) {
			const studentId = record.scheduleId
			if (!details[studentId]) {
				try {
					const levelResponse = await getStudentLevel(studentId)
					if (levelResponse && levelResponse.code === 200 && levelResponse.data) {
						details[studentId] = {
							studentId,
							name: record.name,
							levelName: levelResponse.data.levelName
						}
					} else {
						details[studentId] = {
							studentId,
							name: record.name,
							levelName: '社团成员'
						}
					}
				} catch (error) {
					details[studentId] = {
						studentId,
						name: record.name,
						levelName: '社团成员'
					}
				}
			}
		}
		studentDetails.value = details
	} catch (error) {
		ElMessage.error('获取学生详细信息失败')
	}
}

/**
 * 初始化时段分布饼图
 * @returns {Promise<void>}
 * @description 创建并渲染签到时段分布的玫瑰饼图,显示上午、下午、晚上签到统计
 */
const initPeriodChart = async () => {
	try {
		await nextTick()

		if (!periodChartInstance) {
			if (!periodChart.value) { return }

			await nextTick()
			periodChartInstance = echarts.init(periodChart.value)

			if (periodResizeObserver) {
				periodResizeObserver.disconnect()
			}

			periodResizeObserver = new ResizeObserver(() => {
				window.requestAnimationFrame(() => {
					if (periodChartInstance) {
						periodChartInstance.resize()
					}
				})
			})
			periodResizeObserver.observe(periodChart.value)
		}

		await nextTick()
		window.requestAnimationFrame(() => {
			updatePeriodChart()
		})
	} catch (error) {
		return
	}
}

/**
 * 更新时段分布图表配置
 * @returns {void}
 * @description 更新饼图数据和样式,支持主题切换
 */
const updatePeriodChart = () => {
	const total = periodStats.value.morning + periodStats.value.afternoon + periodStats.value.evening
	const currentIsDarkMode = themeStore.isDarkMode

	const option = {
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c}人 ({d}%)',
			backgroundColor: currentIsDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
			borderColor: currentIsDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
			textStyle: {
				color: currentIsDarkMode ? '#ffffff' : '#000000'
			}
		},
		series: [
			{
				name: '签到时段',
				type: 'pie',
				radius: ['40%', '70%'],
				center: ['50%', '45%'],
				avoidLabelOverlap: false,
				roseType: 'radius',
				itemStyle: {
					borderRadius: 8,
					borderColor: currentIsDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
					borderWidth: 2,
					shadowBlur: 20,
					shadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.2)',
					shadowOffsetX: 0,
					shadowOffsetY: 4
				},
				color: [
					'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
					'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
				],
				label: {
					show: true,
					position: 'outside',
					distance: 15,
					formatter(params) {
						const percent = total > 0 ? ((params.value / total) * 100).toFixed(1) : 0
						return `{name|${params.name}}\n{value|${params.value}人}\n{percent|${percent}%}`
					},
					rich: {
						name: {
							fontSize: 12,
							fontWeight: 'bold',
							color: currentIsDarkMode ? '#ffffff' : '#2c3e50',
							textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
							textShadowBlur: currentIsDarkMode ? 2 : 0,
							textShadowOffsetX: currentIsDarkMode ? 1 : 0,
							textShadowOffsetY: currentIsDarkMode ? 1 : 0
						},
						value: {
							fontSize: 14,
							fontWeight: 'bold',
							color: currentIsDarkMode ? '#00d4ff' : '#667eea',
							textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
							textShadowBlur: currentIsDarkMode ? 2 : 0,
							textShadowOffsetX: currentIsDarkMode ? 1 : 0,
							textShadowOffsetY: currentIsDarkMode ? 1 : 0
						},
						percent: {
							fontSize: 10,
							color: currentIsDarkMode ? '#cbd5e1' : '#6b7280',
							textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
							textShadowBlur: currentIsDarkMode ? 2 : 0,
							textShadowOffsetX: currentIsDarkMode ? 1 : 0,
							textShadowOffsetY: currentIsDarkMode ? 1 : 0
						}
					}
				},
				labelLine: {
					show: true,
					length: 20,
					length2: 15,
					lineStyle: {
						color: currentIsDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
						width: 2,
						type: 'solid'
					},
					smooth: 0.2
				},
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					},
					label: {
						show: true,
						fontSize: '14',
						fontWeight: 'bold'
					}
				},
				data: [
					{
						value: periodStats.value.morning,
						name: '上午',
						itemStyle: {
							color: {
								type: 'linear',
								x: 0, y: 0, x2: 1, y2: 1,
								colorStops: [
									{ offset: 0, color: '#ff6b6b' },
									{ offset: 1, color: '#ffa726' }
								]
							}
						}
					},
					{
						value: periodStats.value.afternoon,
						name: '下午',
						itemStyle: {
							color: {
								type: 'linear',
								x: 0, y: 0, x2: 1, y2: 1,
								colorStops: [
									{ offset: 0, color: '#00d4ff' },
									{ offset: 1, color: '#5b21b6' }
								]
							}
						}
					},
					{
						value: periodStats.value.evening,
						name: '晚上',
						itemStyle: {
							color: {
								type: 'linear',
								x: 0, y: 0, x2: 1, y2: 1,
								colorStops: [
									{ offset: 0, color: '#ec4899' },
									{ offset: 1, color: '#8b5cf6' }
								]
							}
						}
					}
				]
			},
			{
				name: '总人数',
				type: 'pie',
				radius: ['0%', '35%'],
				center: ['50%', '50%'],
				label: {
					show: true,
					position: 'center',
					formatter() {
						return `今日签到\n总人数\n${totalAttendance.value}人`
					},
					fontSize: 18,
					fontWeight: 'bold',
					color: currentIsDarkMode ? '#ffffff' : '#000000',
					textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
					textShadowBlur: currentIsDarkMode ? 4 : 0,
					textShadowOffsetX: currentIsDarkMode ? 2 : 0,
					textShadowOffsetY: currentIsDarkMode ? 2 : 0
				},
				itemStyle: {
					color: 'transparent'
				},
				data: [1]
			}
		]
	}

	periodChartInstance.setOption(option)
}

/**
 * 初始化时间线图表
 * @returns {Promise<void>}
 * @description 创建并渲染签到时间线图,根据选择的时间范围显示不同类型的图表
 */
const initTimelineChart = async () => {
	try {
		await nextTick()

		if (!timelineChartInstance) {
			if (!timelineChart.value) { return }

			await nextTick()
			timelineChartInstance = echarts.init(timelineChart.value)

			if (timelineResizeObserver) {
				timelineResizeObserver.disconnect()
			}

			timelineResizeObserver = new ResizeObserver(() => {
				window.requestAnimationFrame(() => {
					if (timelineChartInstance && timelineChart.value) {
						try {
							timelineChartInstance.resize()
						} catch (error) {
							return
						}
					}
				})
			})
			timelineResizeObserver.observe(timelineChart.value)
		}

		if (timelineChartInstance) {
			await nextTick()
			window.requestAnimationFrame(() => {
				updateTimelineChart()
			})
		}
	} catch (error) {
		return
	}
}

/**
 * 更新时间线图表配置
 * @returns {void}
 * @description 根据时间范围类型(今日/其他时间范围)更新图表数据
 */
const updateTimelineChart = () => {
	if (!timelineChartInstance) { return }

	const currentIsDarkMode = themeStore.isDarkMode
	const data = timelineData.value

	if (selectedTimeRange.value === 'today') {
		const sortedRecords = [...attendanceRecords.value].sort((a, b) =>
			new Date(a.attendanceTime) - new Date(b.attendanceTime)
		)

		const timeData = sortedRecords.map(record => {
			const date = new Date(record.attendanceTime)
			return [
				date.getHours() + date.getMinutes() / 60,
				record.name,
				record.scheduleId,
				record.attendanceTime
			]
		})

		if (timeData.length === 0) {
			return
		}

		const maxTime = timeData.length > 0 ? Math.max(...timeData.map(item => item[0])) : 22
		const minTime = timeData.length > 0 ? Math.min(...timeData.map(item => item[0])) : 8
		const timeRange = maxTime - minTime
		const padding = Math.max(0.5, timeRange * 0.1)

		const option = {
			tooltip: {
				trigger: 'item',
				formatter(params) {
					const { data } = params
					const time = new Date(data[3]).toLocaleTimeString('zh-CN', {
						hour: '2-digit',
						minute: '2-digit',
						second: '2-digit'
					})
					return `${data[1]} (${data[2]})<br/>签到时间: ${time}`
				},
				backgroundColor: currentIsDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
				borderColor: currentIsDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
				textStyle: {
					color: currentIsDarkMode ? '#ffffff' : '#000000'
				}
			},
			grid: {
				left: '5%',
				right: '5%',
				bottom: '10%',
				top: '10%',
				containLabel: true
			},
			xAxis: {
				type: 'value',
				name: '时间',
				nameLocation: 'middle',
				nameGap: 30,
				nameTextStyle: {
					color: currentIsDarkMode ? '#ffffff' : '#000000',
					textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
					textShadowBlur: currentIsDarkMode ? 3 : 0,
					textShadowOffsetX: currentIsDarkMode ? 2 : 0,
					textShadowOffsetY: currentIsDarkMode ? 2 : 0
				},
				min: Math.max(8, minTime - padding),
				max: maxTime,
				interval: timeRange > 6 ? 2 : 0.5,
				axisLabel: {
					formatter(value) {
						const hour = Math.floor(value)
						const minute = Math.round((value - hour) * 60)
						const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
						if (value >= 8 && value < 12) { return `${timeStr} 上午` }
						if (value >= 12 && value < 18) { return `${timeStr} 下午` }
						if (value >= 18 && value <= 22) { return `${timeStr} 晚上` }
						return timeStr
					},
					color: currentIsDarkMode ? '#ffffff' : '#000000',
					textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
					textShadowBlur: currentIsDarkMode ? 3 : 0,
					textShadowOffsetX: currentIsDarkMode ? 2 : 0,
					textShadowOffsetY: currentIsDarkMode ? 2 : 0
				},
				axisLine: {
					lineStyle: {
						color: '#667eea'
					}
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: '#f0f0f0',
						type: 'dashed'
					}
				}
			},
			yAxis: {
				type: 'value',
				name: '签到人数',
				nameLocation: 'middle',
				nameGap: 50,
				nameTextStyle: {
					color: currentIsDarkMode ? '#ffffff' : '#000000',
					textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
					textShadowBlur: currentIsDarkMode ? 3 : 0,
					textShadowOffsetX: currentIsDarkMode ? 2 : 0,
					textShadowOffsetY: currentIsDarkMode ? 2 : 0
				},
				axisLabel: {
					formatter: '{value}人',
					color: currentIsDarkMode ? '#ffffff' : '#000000',
					textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
					textShadowBlur: currentIsDarkMode ? 3 : 0,
					textShadowOffsetX: currentIsDarkMode ? 2 : 0,
					textShadowOffsetY: currentIsDarkMode ? 2 : 0
				},
				axisLine: {
					lineStyle: {
						color: '#667eea'
					}
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: '#f0f0f0',
						type: 'dashed'
					}
				}
			},
			series: [
				{
					name: '签到时间线',
					type: 'scatter',
					data: timeData,
					symbolSize() {
						return 8
					},
					itemStyle: {
						color(params) {
							const hour = params.data[0]
							if (hour >= 8 && hour < 12) { return '#ff6b6b' }
							if (hour >= 14 && hour < 18) { return '#00d4ff' }
							if (hour >= 19 && hour < 22) { return '#ec4899' }
							return '#8b5cf6'
						},
						borderColor: '#fff',
						borderWidth: 2,
						shadowBlur: 10,
						shadowColor: 'rgba(0, 0, 0, 0.3)'
					},
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				},
				{
					name: '签到趋势',
					type: 'line',
					data: timeData.map((item, index) => [item[0], index + 1]),
					lineStyle: {
						color: '#00d4ff',
						width: 3,
						type: 'solid',
						shadowBlur: 10,
						shadowColor: 'rgba(0, 212, 255, 0.3)'
					},
					itemStyle: {
						color: 'transparent'
					},
					areaStyle: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{
									offset: 0,
									color: 'rgba(0, 212, 255, 0.4)'
								},
								{
									offset: 1,
									color: 'rgba(0, 212, 255, 0.1)'
								}
							]
						}
					}
				}
			]
		}

		try {
			timelineChartInstance.setOption(option, true)
		} catch (error) {
			return
		}
	} else {
		if (!data || !Array.isArray(data) || data.length === 0) {
			return
		}

		const filteredData = data.filter(item => {
			if (!item || !item.date) { return false }
			const itemDate = new Date(item.date)
			return itemDate >= PROJECT_LAUNCH_DATE
		}).sort((a, b) => new Date(a.date) - new Date(b.date))

		if (filteredData.length === 0) {
			return
		}

		const dates = filteredData.map(item => item.date)
		const counts = filteredData.map(item => {
			const count = item.attendanceCount
			return typeof count === 'number' ? count : (parseInt(count) || 0)
		})

		const option = {
			tooltip: {
				trigger: 'axis',
				formatter(params) {
					const data = params[0]
					return `${data.name}<br/>签到人数: ${data.value}人`
				},
				backgroundColor: currentIsDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
				borderColor: currentIsDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
				textStyle: {
					color: currentIsDarkMode ? '#ffffff' : '#000000'
				}
			},
			grid: {
				left: '5%',
				right: '5%',
				bottom: '10%',
				top: '10%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data: dates,
				name: '日期',
				nameLocation: 'middle',
				nameGap: 30,
				nameTextStyle: {
					color: currentIsDarkMode ? '#ffffff' : '#000000',
					textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
					textShadowBlur: currentIsDarkMode ? 3 : 0,
					textShadowOffsetX: currentIsDarkMode ? 2 : 0,
					textShadowOffsetY: currentIsDarkMode ? 2 : 0
				},
				axisLabel: {
					color: currentIsDarkMode ? '#ffffff' : '#000000',
					textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
					textShadowBlur: currentIsDarkMode ? 3 : 0,
					textShadowOffsetX: currentIsDarkMode ? 2 : 0,
					textShadowOffsetY: currentIsDarkMode ? 2 : 0,
					rotate: dates.length > 10 ? 45 : 0
				},
				axisLine: {
					lineStyle: {
						color: '#667eea'
					}
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: '#f0f0f0',
						type: 'dashed'
					}
				}
			},
			yAxis: {
				type: 'value',
				name: '签到人数',
				nameLocation: 'middle',
				nameGap: 50,
				nameTextStyle: {
					color: currentIsDarkMode ? '#ffffff' : '#000000',
					textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
					textShadowBlur: currentIsDarkMode ? 3 : 0,
					textShadowOffsetX: currentIsDarkMode ? 2 : 0,
					textShadowOffsetY: currentIsDarkMode ? 2 : 0
				},
				axisLabel: {
					formatter: '{value}人',
					color: currentIsDarkMode ? '#ffffff' : '#000000',
					textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
					textShadowBlur: currentIsDarkMode ? 3 : 0,
					textShadowOffsetX: currentIsDarkMode ? 2 : 0,
					textShadowOffsetY: currentIsDarkMode ? 2 : 0
				},
				axisLine: {
					lineStyle: {
						color: '#667eea'
					}
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: '#f0f0f0',
						type: 'dashed'
					}
				}
			},
			series: [
				{
					name: '每日签到人数',
					type: 'line',
					data: counts,
					smooth: true,
					lineStyle: {
						color: '#00d4ff',
						width: 3,
						type: 'solid',
						shadowBlur: 10,
						shadowColor: 'rgba(0, 212, 255, 0.3)'
					},
					itemStyle: {
						color: '#00d4ff',
						borderColor: '#fff',
						borderWidth: 2,
						shadowBlur: 10,
						shadowColor: 'rgba(0, 212, 255, 0.3)'
					},
					areaStyle: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{
									offset: 0,
									color: 'rgba(0, 212, 255, 0.4)'
								},
								{
									offset: 1,
									color: 'rgba(0, 212, 255, 0.1)'
								}
							]
						}
					},
					emphasis: {
						itemStyle: {
							shadowBlur: 15,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 212, 255, 0.5)'
						}
					}
				}
			]
		}

		try {
			timelineChartInstance.setOption(option, true)
		} catch (error) {
			return
		}
	}
}

/**
 * 加载时间线数据
 * @async
 * @function loadTimelineData
 * @returns {Promise<void>}
 * @description 根据选择的时间范围从API获取签到统计数据，并更新时间线图表
 * @param {string} selectedTimeRange - 选择的时间范围（today/yesterday/week/lastWeek/month/lastMonth/last7days/last30days/year/all/custom）
 * @param {Array<Date>} customDateRange - 自定义日期范围数组，仅当selectedTimeRange为custom时有效
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * await loadTimelineData()
 */
const loadTimelineData = async () => {
	try {
		let startTime, endTime

		switch (selectedTimeRange.value) {
			case 'today': {
				const today = new Date()
				startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
				endTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
				break
			}
			case 'yesterday': {
				const yesterday = new Date()
				yesterday.setDate(yesterday.getDate() - 1)
				startTime = ensureTimeNotBeforeLaunch(new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0))
				endTime = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59)
				break
			}
			case 'week': {
				const now = new Date()
				const dayOfWeek = now.getDay()
				const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
				const monday = new Date(now.setDate(diff))
				startTime = ensureTimeNotBeforeLaunch(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate(), 0, 0, 0))
				endTime = new Date()
				break
			}
			case 'lastWeek': {
				const now = new Date()
				const dayOfWeek = now.getDay()
				const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
				const thisWeekMonday = new Date(now.setDate(diff))
				const lastWeekMonday = new Date(thisWeekMonday)
				lastWeekMonday.setDate(thisWeekMonday.getDate() - 7)
				const lastWeekSunday = new Date(lastWeekMonday)
				lastWeekSunday.setDate(lastWeekMonday.getDate() + 6)
				startTime = ensureTimeNotBeforeLaunch(new Date(lastWeekMonday.getFullYear(), lastWeekMonday.getMonth(), lastWeekMonday.getDate(), 0, 0, 0))
				endTime = new Date(lastWeekSunday.getFullYear(), lastWeekSunday.getMonth(), lastWeekSunday.getDate(), 23, 59, 59)
				break
			}
			case 'month': {
				const now = new Date()
				startTime = ensureTimeNotBeforeLaunch(new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0))
				endTime = new Date()
				break
			}
			case 'lastMonth': {
				const now = new Date()
				const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
				const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
				startTime = ensureTimeNotBeforeLaunch(new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1, 0, 0, 0))
				endTime = new Date(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth(), lastMonthEnd.getDate(), 23, 59, 59)
				break
			}
			case 'last7days': {
				const now = new Date()
				const sevenDaysAgo = new Date(now)
				sevenDaysAgo.setDate(now.getDate() - 6)
				startTime = ensureTimeNotBeforeLaunch(new Date(sevenDaysAgo.getFullYear(), sevenDaysAgo.getMonth(), sevenDaysAgo.getDate(), 0, 0, 0))
				endTime = new Date()
				break
			}
			case 'last30days': {
				const now = new Date()
				const thirtyDaysAgo = new Date(now)
				thirtyDaysAgo.setDate(now.getDate() - 29)
				startTime = ensureTimeNotBeforeLaunch(new Date(thirtyDaysAgo.getFullYear(), thirtyDaysAgo.getMonth(), thirtyDaysAgo.getDate(), 0, 0, 0))
				endTime = new Date()
				break
			}
			case 'year': {
				const now = new Date()
				startTime = ensureTimeNotBeforeLaunch(new Date(now.getFullYear(), 0, 1, 0, 0, 0))
				endTime = new Date()
				break
			}
			case 'all': {
				startTime = PROJECT_LAUNCH_DATE
				endTime = new Date()
				break
			}
			case 'custom': {
				if (customDateRange.value && customDateRange.value.length === 2) {
					startTime = ensureTimeNotBeforeLaunch(new Date(customDateRange.value[0]))
					endTime = new Date(customDateRange.value[1])
					endTime.setHours(23, 59, 59, 999)
				} else {
					return
				}
				break
			}
			default:
				return
		}

		const response = await getDailyAttendanceCountInRange(
			startTime.toISOString(),
			endTime.toISOString()
		)

		if (response && response.code === 200) {
			timelineData.value = response.data || []
			await nextTick()
			if (timelineChartInstance) {
				updateTimelineChart()
			}
		}
	} catch (error) {
		ElMessage.error(error.message || '加载时间线数据失败')
	}
}

/**
 * 加载签到数据
 * @async
 * @function loadAttendanceData
 * @returns {Promise<void>}
 * @description 获取今日签到记录并更新所有相关统计和图表，包括总人数、时段统计、排行榜、极值签到记录和平均签到时间
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * await loadAttendanceData()
 */
const loadAttendanceData = async () => {
	try {
		isLoading.value = true

		const response = await getTodayAttendanceRecords()

		if (response && response.code === 200) {
			attendanceRecords.value = response.data || []
			totalAttendance.value = attendanceRecords.value.length
			periodStats.value = calculatePeriodStats(attendanceRecords.value)

			rankingList.value = [...attendanceRecords.value].sort((a, b) =>
				new Date(a.attendanceTime) - new Date(b.attendanceTime)
			)

			if (attendanceRecords.value.length > 0) {
				latestAttendance.value = attendanceRecords.value[attendanceRecords.value.length - 1]
				earliestAttendance.value = rankingList.value[0]
				averageTime.value = calculateAverageTime(attendanceRecords.value)
			}

			lastUpdateTime.value = new Date().toLocaleTimeString('zh-CN')

			await loadStudentDetails()

			setTimeout(() => {
				initChartsWithTheme()
			}, 200)

			if (selectedTimeRange.value === 'today' && timelineChartInstance) {
				await nextTick()
				updateTimelineChart()
			}
		}
	} catch (error) {
		ElMessage.error(error.message || '加载签到数据失败')
	} finally {
		isLoading.value = false
	}
}

/**
 * 刷新所有数据
 * @returns {void}
 * @description 重新加载签到数据和时间线数据
 */
const refreshData = () => {
	loadAttendanceData()
	loadTimelineData()
}

/**
 * 开始自动刷新
 * @returns {void}
 * @description 每15秒自动刷新一次签到数据
 */
const startAutoRefresh = () => {
	refreshTimer = setInterval(() => {
		loadAttendanceData()
	}, 15000)
}

/**
 * 停止自动刷新
 * @returns {void}
 * @description 清除自动刷新定时器
 */
const stopAutoRefresh = () => {
	if (refreshTimer) {
		clearInterval(refreshTimer)
		refreshTimer = null
	}
}


/**
 * 组件挂载后钩子
 * @function onMounted
 * @returns {Promise<void>}
 * @description 组件挂载完成后执行的初始化操作
 * - 添加ResizeObserver错误监听，防止控制台出现无害错误信息
 * - 延迟100ms确保DOM完全渲染
 * - 加载初始签到数据
 * - 加载时间线数据
 * - 启动自动刷新机制
 */
onMounted(async () => {
	window.addEventListener('error', event => {
		if (event.message.includes('ResizeObserver loop completed with undelivered notifications')) {
			event.preventDefault()
			event.stopPropagation()
			return false
		}
	})

	await new Promise(resolve => setTimeout(resolve, 100))
	loadAttendanceData()
	loadTimelineData()
	startAutoRefresh()
})

/**
 * 组件卸载前钩子
 * @function onUnmounted
 * @returns {void}
 * @description 组件卸载前执行的清理操作，释放资源防止内存泄漏
 * - 停止自动刷新定时器
 * - 清除可能存在的超时定时器
 * - 断开时段分布图表的ResizeObserver连接
 * - 断开时间线图表的ResizeObserver连接
 * - 销毁时段分布图表实例
 * - 销毁时间线图表实例
 */
onUnmounted(() => {
	stopAutoRefresh()
	if (resizeTimeout) {
		clearTimeout(resizeTimeout)
	}
	if (periodResizeObserver) {
		periodResizeObserver.disconnect()
	}
	if (timelineResizeObserver) {
		timelineResizeObserver.disconnect()
	}
	if (periodChartInstance) {
		periodChartInstance.dispose()
	}
	if (timelineChartInstance) {
		timelineChartInstance.dispose()
	}
})
</script>

<template>
	<!-- 签到分析页面主容器 -->
	<div class="attendance-analysis-container">
		<!-- 头部区域:包含返回按钮、Logo、主题切换、标题和刷新功能 -->
		<div class="header">
			<div class="header-left">
				<!-- 返回按钮 -->
				<el-button
					class="back-btn"
					type="primary"
					:icon="ArrowLeft"
					circle
					@click="goBack"/>
				<!-- Logo,点击切换主题 -->
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊"
					class="logo"
					title="切换主题模式"
					@click="handleThemeToggle"/>
				<!-- 标题区域 -->
				<div class="title-section">
					<h1>签到分析</h1>
					<p>Attendance Analysis Dashboard</p>
				</div>
			</div>
			<!-- 右侧刷新区域 -->
			<div class="header-right">
				<div class="refresh-section">
					<!-- 刷新按钮 -->
					<el-button
						:loading="isLoading"
						type="primary"
						:icon="Refresh"
						circle
						@click="refreshData"/>
					<!-- 最后更新时间显示 -->
					<span class="last-update">最后更新: {{ lastUpdateTime }}</span>
				</div>
			</div>
		</div>

		<!-- 主内容区域:网格布局展示图表和统计信息 -->
	<!-- @description 使用响应式网格布局，将页面内容分为左侧图表区域和右侧统计区域 -->
	<!-- @class main-content 主内容区域容器类 -->
	<div class="main-content">
		<!-- 内容网格布局 -->
		<!-- @description 采用双列网格布局，左侧展示图表，右侧展示排行榜和统计信息 -->
		<!-- @class content-grid 网格布局容器类 -->
		<div class="content-grid">
			<!-- 左侧列:时段分布饼图和时间线图表 -->
			<!-- @description 左侧区域包含两个主要图表卡片，展示签到时段分布和时间线趋势 -->
			<!-- @class left-column 左侧列容器类 -->
			<div class="left-column">
				<!-- 时段分布图表卡片 -->
				<!-- @description 展示今日签到时段分布的玫瑰饼图，按上午、下午、晚上分类统计 -->
				<!-- @class chart-card 图表卡片容器类 -->
				<div class="chart-card">
					<!-- 卡片头部 -->
					<!-- @description 包含图表标题和图标，提供视觉识别和主题切换支持 -->
					<!-- @class card-header 卡片头部容器类 -->
					<div class="card-header">
						<h3>今日签到时段分布</h3>
						<el-icon class="header-icon"><pie-chart /></el-icon>
					</div>
					<!-- 时段分布饼图容器 -->
					<!-- @description ECharts饼图的DOM容器，通过ref引用进行图表初始化 -->
					<!-- @ref periodChart 饼图容器的Vue引用，用于图表实例化 -->
					<!-- @class chart 图表容器类 -->
					<div ref="periodChart" class="chart"/>
				</div>

				<!-- 时间线图表卡片 -->
				<!-- @description 根据选择的时间范围展示签到数据趋势，支持今日散点图和其他时间范围的折线图 -->
				<!-- @class chart-card 图表卡片容器类 -->
				<div class="chart-card">
					<!-- 卡片头部 -->
					<!-- @description 包含图表标题和时钟图标，直观表示时间线数据 -->
					<!-- @class card-header 卡片头部容器类 -->
					<div class="card-header">
						<h3>签到时间线</h3>
						<el-icon class="header-icon"><clock /></el-icon>
					</div>
					<!-- 时间线控制区域 -->
					<!-- @description 包含时间范围选择器和自定义日期选择器，控制图表显示的数据范围 -->
					<!-- @class timeline-controls 时间线控制区域类 -->
					<div class="timeline-controls">
						<!-- 时间范围选择器 -->
						<!-- @description 提供预设时间范围选项，如今日、昨天、本周等 -->
						<!-- @class time-range-selector 时间范围选择器容器类 -->
						<div class="time-range-selector">
							<!-- Element Plus 单选按钮组 -->
							<!-- @component el-radio-group Element Plus的单选按钮组组件 -->
							<!-- @v-model selectedTimeRange 绑定选择的时间范围值 -->
							<!-- @size small 设置按钮组大小为小型 -->
							<!-- @class time-radio-group 自定义样式类 -->
							<!-- @event @change 时间范围变化时触发handleTimeRangeChange方法 -->
							<el-radio-group
								v-model="selectedTimeRange"
								size="small"
								class="time-radio-group"
								@change="handleTimeRangeChange"
							>
								<!-- 时间范围选项 -->
								<!-- @description 遍历timeRangeOptions生成单选按钮，过滤掉自定义选项 -->
								<!-- @v-for 循环渲染时间范围选项 -->
								<!-- @key 使用option.value作为唯一标识 -->
								<!-- @label 设置选项的值 -->
								<el-radio-button
									v-for="option in timeRangeOptions.filter(opt => opt.value !== 'custom')"
									:key="option.value"
									:label="option.value"
								>
									{{ option.label }}
								</el-radio-button>
							</el-radio-group>
						</div>

						<!-- 自定义日期范围选择器 -->
						<!-- @description 当选择"自定义"时间范围时显示，允许用户选择任意日期范围 -->
						<!-- @v-if 条件渲染，仅当selectedTimeRange为'custom'时显示 -->
						<!-- @class custom-date-range 自定义日期范围容器类 -->
						<div v-if="selectedTimeRange === 'custom'" class="custom-date-range">
							<!-- Element Plus 日期范围选择器 -->
							<!-- @component el-date-picker Element Plus的日期选择器组件 -->
							<!-- @v-model customDateRange 绑定选择的自定义日期范围 -->
							<!-- @type daterange 设置为日期范围选择模式 -->
							<!-- @range-separator 设置范围分隔符为"至" -->
							<!-- @start-placeholder 设置开始日期占位符 -->
							<!-- @end-placeholder 设置结束日期占位符 -->
							<!-- @size small 设置日期选择器大小为小型 -->
							<!-- @class custom-date-picker 自定义样式类 -->
							<!-- @event @change 日期范围变化时触发handleCustomDateChange方法 -->
							<el-date-picker
								v-model="customDateRange"
								type="daterange"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								size="small"
								class="custom-date-picker"
								@change="handleCustomDateChange"
							/>
						</div>
					</div>
					<!-- 时间线图表容器 -->
					<!-- @description ECharts时间线图表的DOM容器，通过ref引用进行图表初始化 -->
					<!-- @ref timelineChart 时间线图表容器的Vue引用，用于图表实例化 -->
					<!-- @class timeline-chart 时间线图表容器类 -->
					<div ref="timelineChart" class="timeline-chart"/>
				</div>
			</div>

			<!-- 右侧列:排行榜和实时动态 -->
			<!-- @description 右侧区域包含签到排行榜和实时签到动态两个卡片，展示详细的签到信息 -->
			<!-- @class right-column 右侧列容器类 -->
			<div class="right-column">
				<!-- 今日签到排行榜卡片 -->
				<!-- @description 展示今日签到学生的排行榜，按签到时间排序，前三名有特殊样式 -->
				<!-- @class chart-card 图表卡片容器类 -->
				<div class="chart-card">
					<!-- 卡片头部 -->
					<!-- @description 包含排行榜标题和奖杯图标，突出显示排名信息 -->
					<!-- @class card-header 卡片头部容器类 -->
					<div class="card-header">
						<h3>今日签到排行榜</h3>
						<el-icon class="header-icon"><trophy /></el-icon>
					</div>
					<!-- 排行榜列表 -->
					<!-- @description 显示所有签到学生的排名、姓名、等级和签到时间 -->
					<!-- @class ranking-list 排行榜列表容器类 -->
					<div class="ranking-list">
						<!-- 加载动画 -->
						<!-- @description 数据加载时显示的覆盖层和加载动画 -->
						<!-- @v-if 条件渲染，仅当isLoading为true时显示 -->
						<!-- @class loading-overlay 加载覆盖层类 -->
						<div v-if="isLoading" class="loading-overlay">
							<div class="loading-spinner"/>
						</div>
						<!-- 排行榜项 -->
						<!-- @description 单个学生的排名信息项，包含排名、姓名、等级和签到时间 -->
						<!-- @v-for 循环渲染排行榜数据 -->
						<!-- @key 使用index作为唯一标识 -->
						<!-- @class ranking-item 排行榜项基础类 -->
						<!-- @:class 动态添加排名样式类，前三名有特殊颜色和样式 -->
						<div
							v-for="(record, index) in rankingList"
							:key="index"
							class="ranking-item"
							:class="getRankingClass(index)"
						>
							<!-- 排名数字 -->
							<!-- @description 显示学生的签到排名，从1开始计数 -->
							<!-- @class rank-number 排名数字类 -->
							<div class="rank-number">{{ index + 1 }}</div>
							<!-- 学生信息:姓名和等级 -->
							<!-- @description 显示学生的姓名和等级信息，等级根据学生ID从API获取 -->
							<!-- @class student-info 学生信息容器类 -->
							<div class="student-info">
								<div class="student-name">{{ record.name }}</div>
								<div 
									class="student-level"
									:class="getLevelClass(studentDetails[record.scheduleId]?.levelName || '社团成员')"
								>
									{{ studentDetails[record.scheduleId]?.levelName || '社团成员' }}
								</div>
							</div>
							<!-- 签到时间 -->
							<!-- @description 显示学生的具体签到时间，使用formatTime函数格式化 -->
							<!-- @class attendance-time 签到时间类 -->
							<div class="attendance-time">{{ formatTime(record.attendanceTime) }}</div>
						</div>
					</div>
				</div>

				<!-- 实时签到动态卡片 -->
				<!-- @description 展示今日签到的实时统计信息，包括最早、最晚和平均签到时间 -->
				<!-- @class chart-card 图表卡片容器类 -->
				<div class="chart-card">
					<!-- 卡片头部 -->
					<!-- @description 包含统计标题和趋势图表图标，突出显示实时数据特性 -->
					<!-- @class card-header 卡片头部容器类 -->
					<div class="card-header">
						<h3>实时签到动态</h3>
						<el-icon class="header-icon"><trend-charts /></el-icon>
					</div>
					<!-- 统计信息内容 -->
					<!-- @description 以网格布局显示三项核心统计信息 -->
					<!-- @class stats-content 统计内容容器类 -->
					<div class="stats-content">
						<!-- 最早签到 -->
						<!-- @description 显示今日最早签到的学生信息和时间 -->
						<!-- @class stat-item 统计项容器类 -->
						<div class="stat-item">
							<div class="stat-label">最早签到</div>
							<div class="stat-value">
								<el-icon class="stat-icon"><star /></el-icon>
								<span v-if="earliestAttendance">
									{{ earliestAttendance.name }}<br/>
									{{ formatTime(earliestAttendance.attendanceTime) }}
								</span>
								<span v-else>暂无数据</span>
							</div>
						</div>
						<!-- 最晚签到 -->
						<!-- @description 显示今日最晚签到的学生信息和时间 -->
						<!-- @class stat-item 统计项容器类 -->
						<div class="stat-item">
							<div class="stat-label">最晚签到</div>
							<div class="stat-value">
								<el-icon class="stat-icon"><clock /></el-icon>
								<span v-if="latestAttendance">
									{{ latestAttendance.name }}<br/>
									{{ formatTime(latestAttendance.attendanceTime) }}
								</span>
								<span v-else>暂无数据</span>
							</div>
						</div>
						<!-- 平均签到时间 -->
						<!-- @description 显示今日所有签到学生的平均签到时间 -->
						<!-- @class stat-item 统计项容器类 -->
						<div class="stat-item">
							<div class="stat-label">平均签到时间</div>
							<div class="stat-value">
								<el-icon class="stat-icon"><medal /></el-icon>
								<span>{{ averageTime }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
								<div class="student-info">
									<div class="student-name">{{ record.name }}</div>
									<div class="student-details">
										<span class="student-level" :class="getLevelClass(studentDetails[record.scheduleId]?.levelName)">
											{{ studentDetails[record.scheduleId]?.levelName || '社团成员' }}
										</span>
									</div>
								</div>
								<!-- 签到时间 -->
								<div class="attendance-time">{{ formatTime(record.attendanceTime) }}</div>
								<!-- 前三名特殊徽章 -->
								<div v-if="index < 3" class="rank-badge">
									<el-icon v-if="index === 0" class="trophy-icon"><trophy /></el-icon>
									<el-icon v-else-if="index === 1" class="medal-icon"><medal /></el-icon>
									<el-icon v-else class="star-icon"><star /></el-icon>
								</div>
							</div>
						</div>
					</div>

					<!-- 实时签到动态卡片 -->
					<div class="chart-card">
						<div class="card-header">
							<h3>实时签到动态</h3>
							<el-icon class="header-icon"><trend-charts /></el-icon>
						</div>
						<!-- 实时统计信息 -->
						<div class="realtime-stats">
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
			</div>
		</div>
	</div>
</template>

<style scoped>
@import './css/AttendanceAnalysisPageDesktop.css';
</style>
