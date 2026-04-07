<script setup>
/** *******************************************************************
 * 人工智能创作坊学生管理仪表盘 - 核心逻辑层
 * 功能概述：
 * 1. 数据可视化：年级分布(饼图)、专业分布(词云)、签到排行榜(柱状图)
 * 2. 数据交互：多时间维度筛选排行榜、主题切换、验证码自动刷新
 * 3. 数据统计：签到率、日均签到数、成员等级分布等核心指标计算
 * 4. 资源管理：ECharts实例销毁、定时器清理、窗口自适应
 ********************************************************************/

// ======================== 依赖导入区 ========================
// Element Plus 图标组件按需引入
import {ArrowLeft, Calendar, Clock, User, Setting, Star, Avatar} from '@element-plus/icons-vue'
// ECharts 图表类型按需引入
import {PieChart, BarChart} from 'echarts/charts'
// ECharts 组件按需引入
import {
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent
} from 'echarts/components'
// ECharts 核心库
import * as echarts from 'echarts/core'
// ECharts 渲染器（Canvas模式）
import {CanvasRenderer} from 'echarts/renderers'
// Element Plus 组件按需引入
import {ElMessage, ElButton, ElIcon, ElRadioGroup, ElRadioButton, ElProgress} from 'element-plus'
// Vue 3 核心 API
import {ref, onMounted, onUnmounted, nextTick, watch} from 'vue'
// Element Plus 样式按需引入
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-radio-group.css'
import 'element-plus/theme-chalk/el-radio-button.css'
import 'element-plus/theme-chalk/el-progress.css'
// Vue Router 路由钩子
import {useRouter} from 'vue-router'
// ECharts 词云扩展
import 'echarts-wordcloud'

// ======================== 导入验证码管理类 ========================
import VerificationCode from './ts/verificationCode'

// ======================== 数据加载器 ========================
import DashboardDataLoader from './ts/DashboardDataLoader'

// ======================== API 接口导入区 ========================
// 考勤相关接口
import {
	getMonthlyAttendanceCount, // 获取月度签到总人数
	getCurrentMonthTop10Students, // 获取当月 TOP10 签到学生
	getWeeklyRanking, // 获取周签到排行榜
	getMonthlyRanking, // 获取月签到排行榜
	getTopStudentsByTimeRange, // 按时间范围获取 TOP 学生
	getLast7DaysRanking, // 获取近 7 天签到排行榜
	getLast30DaysRanking // 获取近 30 天签到排行榜
} from '@/api/attendance'
// 考勤API类（兼容不同命名规范）
import AttendanceApi from '@/api/AttendanceApi'
// 学生相关接口
import {
	getGradeStatistics, // 获取年级分布统计
	getMajorStatistics, // 获取专业分布统计
	getTotalStudentCount, // 获取学生总数
	getStudentCountByLevel // 按等级获取学生数
} from '@/api/student'
// 主题状态管理
import {useThemeStore} from '@/stores/theme'

// ======================== 全局实例与状态初始化 ========================
// 路由实例
const router = useRouter()
// 主题仓库实例
const themeStore = useThemeStore()
const {toggleTheme} = themeStore

// ECharts DOM容器引用（模板ref绑定）
const gradeChart = ref(null) // 年级分布图表容器
const majorChart = ref(null) // 专业分布图表容器
const attendanceChart = ref(null) // 签到排行榜图表容器

// 进度条宽度（用于页面加载动画）
const progressWidth = ref(0)
// 当前二维码类型：website-签到入口 / wechat-公众号
const currentQRType = ref('website')

// 进度条定时器（页面加载动画）
const progressInterval = ref(null)

// 核心业务数据响应式存储
const topStudents = ref([]) // TOP学生签到数据
const totalStudents = ref(0) // 学生总数
const todayCount = ref(0) // 今日签到人次
const dailyAvgAttendance = ref(0) // 月度日均签到数
const attendanceRate = ref(0) // 月度签到率
const monthlyAttendanceCount = ref(0) // 月度签到总人数
const workshopMembersCount = ref(0) // 坊内成员总数
const levelStats = ref({ // 成员等级分布
	admin: 0, // 管理员
	core: 0, // 核心成员
	normal: 0 // 普通成员
})
const clubMembers = ref(0) // 社团成员数（非坊内成员）

// 时间范围筛选相关
const selectedTimeRange = ref('week') // 当前选中的时间范围
const selectedTopN = 16 // 排行榜展示TOP数量

// 时间范围选项配置（过滤/展示用）
const timeRangeOptions = [
	{label: '本周', value: 'week'},
	{label: '本月', value: 'month'},
	{label: '今日', value: 'today'},
	{label: '最近7天', value: 'last7days'},
	{label: '最近30天', value: 'last30days'},
	{label: '全部', value: 'all'}
]

// ECharts 实例存储（用于销毁/重置）
let gradeChartInstance = null
let majorChartInstance = null
let attendanceChartInstance = null

// ======================== 数据加载器实例 ========================
const dataLoader = new DashboardDataLoader(
	topStudents,
	totalStudents,
	todayCount,
	dailyAvgAttendance,
	attendanceRate,
	monthlyAttendanceCount,
	levelStats,
	selectedTimeRange,
	clubMembers,
	workshopMembersCount
)

// ======================== 基础交互函数 ========================
/**
 * 返回上一级页面（导航页）
 */
const goBack = () => {
	router.push('/navigation')
}

/**
 * 保存用户偏好设置到本地存储
 * 存储内容：选中的时间范围
 */
const saveUserPreferences = () => {
	dataLoader.saveUserPreferences({
		timeRange: selectedTimeRange.value
	})
}

/**
 * 从本地存储加载用户偏好设置
 * 若无存储或解析失败，使用默认值'week'
 */
const loadUserPreferences = () => {
	const preferences = dataLoader.loadUserPreferences()
	selectedTimeRange.value = preferences.timeRange
}

/**
 * 切换二维码展示类型
 * 切换逻辑：website ↔ wechat
 */
const switchQRType = () => {
	currentQRType.value = currentQRType.value === 'website' ? 'wechat' : 'website'
}

// ======================== 核心算法/工具函数 ========================
/**
 * 获取指定年月的法定节假日列表
 * @param year - 年份（如2024）
 * @param month - 月份（0-11，对应1-12月）
 * @returns 节假日日期数组（格式：YYYY-MM-DD）
 */
const getHolidaysForMonth = (year, month) => {
	const holidays = []

	// 节假日配置表（key: 月份(0-11), value: 日期数组）
	const monthHolidays = {
		0: [`${year}-01-01`], // 元旦
		1: [`${year}-02-10`, `${year}-02-11`, `${year}-02-12`, `${year}-02-13`, `${year}-02-14`, `${year}-02-15`, `${year}-02-16`, `${year}-02-17`], // 春节
		3: [`${year}-04-05`, `${year}-04-06`, `${year}-04-07`], // 清明节
		4: [`${year}-05-01`, `${year}-05-02`, `${year}-05-03`], // 劳动节
		8: [`${year}-09-15`, `${year}-09-16`, `${year}-09-17`], // 中秋节
		9: [`${year}-10-01`, `${year}-10-02`, `${year}-10-03`, `${year}-10-04`, `${year}-10-05`, `${year}-10-06`, `${year}-10-07`] // 国庆节
	}

	if (monthHolidays[month]) {
		holidays.push(...monthHolidays[month])
	}

	return holidays
}

/**
 * 计算月度日均签到数（排除周末和节假日）
 * @param monthlyCount - 月度签到总人数
 * @returns 日均签到数（保留2位小数）
 */
const calculateDailyAvgAttendance = monthlyCount => {
	const now = new Date()
	const currentDay = now.getDate()
	const year = now.getFullYear()
	const month = now.getMonth()

	// 获取当月节假日列表
	const holidays = getHolidaysForMonth(year, month)

	let workingDays = 0
	const startOfMonth = new Date(year, month, 1) // 当月1号
	const endOfMonth = new Date(year, month, currentDay) // 当前日期

	// 遍历当月已过日期，计算工作日数量
	let currentDate = new Date(startOfMonth)
	while (currentDate <= endOfMonth) {
		const dayOfWeek = currentDate.getDay()
		const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6) // 周日/周六
		const dateString = currentDate.toLocaleDateString('en-CA') // 格式化为YYYY-MM-DD
		const isHoliday = holidays.includes(dateString)

		// 非周末且非节假日 = 工作日
		if (!isWeekend && !isHoliday) {
			workingDays += 1
		}

		// 日期累加（避免引用同一对象）
		const nextDate = new Date(currentDate)
		nextDate.setDate(nextDate.getDate() + 1)
		currentDate = nextDate
	}

	// 无工作日时返回0，避免除以0
	if (workingDays === 0) {
		return 0
	}

	// 计算日均签到数并保留2位小数
	return parseFloat((monthlyCount / workingDays).toFixed(2))
}

/**
 * 获取本周周一的日期（ISO格式：YYYY-MM-DD）
 * @returns 本周周一日期
 */
const getCurrentWeekStart = () => {
	const now = new Date()
	const dayOfWeek = now.getDay()
	// 计算与周一的差值（周日特殊处理为-6）
	const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
	const monday = new Date(now.setDate(diff))
	return monday.toLocaleDateString('en-CA')
}

/**
 * 将等级编码转换为等级名称
 * @param levelCode - 等级编码（0-3）
 * @returns 等级名称
 */
const getLevelName = levelCode => {
	const levelMap = {
		0: '社团成员',
		1: '普通成员',
		2: '核心成员',
		3: '管理员'
	}
	return levelMap[levelCode] || '社团成员' // 兜底值
}

/**
 * 计算社团成员和坊内成员数量
 * 逻辑：
 * - 坊内成员 = 管理员 + 核心成员 + 普通成员
 * - 社团成员 = 学生总数 - 坊内成员
 */
/**
 * 计算月度签到率
 * @param monthlyCount - 月度签到总人数
 * @returns 签到率（保留1位小数，百分比）
 */
const calculateAttendanceRate = monthlyCount => {
	// 坊内成员总数
	const workshopCount = levelStats.value.admin + levelStats.value.core + levelStats.value.normal

	// 无坊内成员时返回0
	if (workshopCount === 0) {
		return 0
	}

	// 签到率 = (签到人数 / 坊内成员数) * 100%
	return parseFloat(((monthlyCount / workshopCount) * 100).toFixed(1))
}

/**
 * 获取浅色模式下的稳定颜色（按索引循环）
 * @param index - 数据索引
 * @returns 十六进制颜色值
 */
const getStableColor = index => {
	const colors = [
		'#667eea', '#764ba2', '#f093fb', '#f5576c',
		'#4facfe', '#00f2fe', '#a8edea', '#fed6e3',
		'#ff9a9e', '#fecfef', '#fecfef', '#a8edea',
		'#d299c2', '#fad0c4', '#ffd1ff', '#a8e6cf'
	]
	return colors[index % colors.length]
}

/**
 * 获取深色模式下的稳定颜色（按索引循环）
 * @param index - 数据索引
 * @returns 十六进制颜色值
 */
const getDarkStableColor = index => {
	const colors = [
		'#00d4ff', '#ff6b6b', '#4ecdc4', '#45b7d1',
		'#96ceb4', '#feca57', '#ff9ff3', '#54a0ff',
		'#5f27cd', '#00d2d3', '#ff9f43', '#10ac84',
		'#ee5a24', '#0984e3', '#6c5ce7', '#a29bfe'
	]
	return colors[index % colors.length]
}

// ======================== ECharts 初始化函数 ========================
/**
 * 初始化年级分布饼图
 * @param data - 年级统计数据 [{grade: 年级, count: 人数}, ...]
 */
const initGradeChart = data => {
	// 容器未挂载时跳过初始化
	if (!gradeChart.value) {
		return
	}

	// 销毁旧实例（避免内存泄漏）
	if (gradeChartInstance) {
		gradeChartInstance.dispose()
	}

	// 初始化ECharts实例
	gradeChartInstance = echarts.init(gradeChart.value)

	// 数据按年级升序排序
	const sortedData = [...data].sort((a, b) => a.grade - b.grade)
	const isDark = themeStore.isDarkMode // 当前主题模式

	// 饼图配置项
	const option = {
		backgroundColor: 'transparent', // 透明背景（适配主题）
		tooltip: {
			trigger: 'item', // 触发方式：数据项触发
			formatter: '{a} <br/>{b}: {c} ({d}%)', // 提示框格式
			backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
			borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
			textStyle: {
				color: isDark ? '#ffffff' : '#2c3e50'
			}
		},
		legend: {
			orient: 'vertical', // 垂直排列
			left: 'left', // 左侧显示
			data: sortedData.map(item => `${item.grade}年级`), // 图例数据
			textStyle: {
				color: isDark ? '#ffffff' : '#2c3e50'
			}
		},
		series: [
			{
				name: '年级分布',
				type: 'pie', // 饼图类型
				radius: ['40%', '70%'], // 内/外半径（环形饼图）
				center: ['50%', '50%'], // 图表中心位置
				avoidLabelOverlap: false, // 避免标签重叠
				itemStyle: {
					borderRadius: 10, // 圆角
					borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : '#fff',
					borderWidth: 2 // 边框宽度
				},
				label: {
					show: false, // 隐藏默认标签
					position: 'center',
					color: isDark ? '#ffffff' : '#2c3e50'
				},
				emphasis: {
					label: {
						show: true, // 高亮时显示标签
						fontSize: '18',
						fontWeight: 'bold',
						color: isDark ? '#ffffff' : '#2c3e50'
					}
				},
				labelLine: {
					show: false // 隐藏标签连接线
				},
				// 格式化数据为ECharts所需格式
				data: sortedData.map(item => ({
					value: item.count,
					name: `${item.grade}年级`
				}))
			}
		]
	}

	// 应用配置项
	gradeChartInstance.setOption(option)
}

/**
 * 初始化专业分布词云图
 * @param data - 专业统计数据 [{major: 专业名称, count: 人数}, ...]
 */
const initMajorChart = data => {
	// 容器未挂载时跳过初始化
	if (!majorChart.value) {
		return
	}

	// 销毁旧实例（避免内存泄漏）
	if (majorChartInstance) {
		majorChartInstance.dispose()
	}

	// 初始化ECharts实例
	majorChartInstance = echarts.init(majorChart.value)

	// 数据按人数降序排序
	const sortedData = [...data].sort((a, b) => b.count - a.count)
	const isDark = themeStore.isDarkMode // 当前主题模式

	// 格式化词云数据（添加颜色配置）
	const wordCloudData = sortedData.map((item, index) => ({
		name: item.major,
		value: item.count,
		textStyle: {
			color: isDark ? getDarkStableColor(index) : getStableColor(index)
		}
	}))

	// 词云图配置项
	const option = {
		backgroundColor: 'transparent', // 透明背景
		tooltip: {
			trigger: 'item', // 数据项触发
			formatter: '{b}: {c}人', // 提示框格式
			backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
			borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
			textStyle: {
				color: isDark ? '#ffffff' : '#2c3e50'
			}
		},
		series: [
			{
				type: 'wordCloud', // 词云类型
				gridSize: 1, // 词间距
				sizeRange: [16, 50], // 字体大小范围
				rotationRange: [0, 0], // 旋转角度范围（0=不旋转）
				rotationStep: 0, // 旋转步长
				shape: 'circle', // 词云形状（圆形）
				width: '100%', // 宽度
				height: '100%', // 高度
				left: 'center', // 水平居中
				top: 'center', // 垂直居中
				right: null,
				bottom: null,
				layoutAnimation: false, // 关闭布局动画
				shrinkToFit: true, // 自动缩放以适应容器
				drawOutOfBound: false, // 不绘制到容器外
				// 固定随机种子（保证词云位置稳定）
				random() {
					return 0.5
				},
				textStyle: {
					fontFamily: 'Microsoft YaHei, sans-serif', // 字体
					fontWeight: 'bold', // 加粗
					// 动态颜色（按索引）
					color(params) {
						return isDark ? getDarkStableColor(params.dataIndex) : getStableColor(params.dataIndex)
					}
				},
				emphasis: {
					textStyle: {
						shadowBlur: 10, // 高亮阴影模糊度
						shadowColor: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)'
					}
				},
				data: wordCloudData
			}
		]
	}

	// 应用配置项
	majorChartInstance.setOption(option)
}

/**
 * 初始化签到排行榜柱状图
 * @param data - 学生签到数据 [{name: 姓名, grade: 年级, major: 专业, attendanceCount: 签到数, levelName: 等级名称}, ...]
 */
const initAttendanceChart = data => {
	// 容器未挂载时跳过初始化
	if (!attendanceChart.value) {
		return
	}

	// 销毁旧实例（避免内存泄漏）
	if (attendanceChartInstance) {
		attendanceChartInstance.dispose()
	}

	// 初始化ECharts实例
	attendanceChartInstance = echarts.init(attendanceChart.value)

	// 数据按签到数升序排序（柱状图从下到上递增）
	const sortedData = [...data].sort((a, b) => a.attendanceCount - b.attendanceCount)
	const isDark = themeStore.isDarkMode // 当前主题模式

	// 柱状图配置项
	const option = {
		tooltip: {
			trigger: 'axis', // 坐标轴触发
			axisPointer: {
				type: 'shadow' // 阴影指示器
			},
			backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
			borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
			textStyle: {
				color: isDark ? '#ffffff' : '#2c3e50'
			},
			// 自定义提示框内容
			formatter(params) {
				const itemData = sortedData[params[0].dataIndex]
				return `${itemData.name} (${itemData.levelName})<br/>${itemData.grade}年级 - ${itemData.major}<br/>签到次数: ${itemData.attendanceCount}次`
			}
		},
		grid: {
			left: '0%', // 左内边距
			right: '20%', // 右内边距（预留标签空间）
			bottom: '3%', // 下内边距
			top: '0%', // 上内边距
			containLabel: true // 包含标签在内
		},
		xAxis: {
			type: 'value', // 数值轴
			axisLabel: {
				fontSize: 12,
				formatter: '{value}次', // 单位：次
				color: isDark ? '#ffffff' : '#2c3e50'
			},
			axisLine: {
				lineStyle: {
					color: isDark ? '#ffffff' : '#2c3e50'
				}
			}
		},
		yAxis: {
			type: 'category', // 分类轴
			data: sortedData.map(item => {
				const name = `${item.name} (${item.levelName})`
				return name.length > 5 ? name.replace(/(.{5})/g, '$1\n') : name
			}), // Y轴标签
			axisLabel: {
				interval: 0, // 显示所有标签
				fontSize: 12,
				color: isDark ? '#ffffff' : '#2c3e50'
			},
			axisLine: {
				lineStyle: {
					color: isDark ? '#ffffff' : '#2c3e50'
				}
			}
		},
		series: [
			{
				name: '签到次数',
				type: 'bar', // 柱状图类型
				data: sortedData.map(item => item.attendanceCount), // 签到数
				barWidth: '60%', // 柱子宽度
				itemStyle: {
					// 动态颜色（区分不同排名）
					color(params) {
						const totalCount = sortedData.length
						const index = params.dataIndex

						// TOP10使用固定渐变色系
						if (totalCount <= 10) {
							const colors = ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1']
							return colors[index]
						}
						// 超过10个时使用HSL动态配色
						const hue = 200 + (index / totalCount) * 40
						const saturation = 70 + (index / totalCount) * 20
						const lightness = 85 - (index / totalCount) * 30
						return `hsl(${hue}, ${saturation}%, ${lightness}%)`
					},
					borderRadius: [0, 4, 4, 0] // 右侧圆角
				},
				label: {
					show: true, // 显示标签
					position: 'right', // 标签在柱子右侧
					// 自定义标签内容（年级+专业）
					formatter(params) {
						const itemData = sortedData[params.dataIndex]
						return `${itemData.grade}年级\n${itemData.major}`
					},
					fontSize: 11,
					color: isDark ? '#ffffff' : '#666',
					lineHeight: 14, // 行高（适配换行）
					distance: 10 // 与柱子的距离
				},
				emphasis: {
					itemStyle: {
						shadowBlur: 10, // 高亮阴影模糊度
						shadowOffsetX: 0, // 阴影X偏移
						shadowColor: 'rgba(0, 0, 0, 0.5)' // 阴影颜色
					}
				}
			}
		]
	}

	// 应用配置项
	attendanceChartInstance.setOption(option)
}

// ======================== 数据加载/更新函数 ========================
/**
 * 加载排行榜数据（按选中的时间范围）
 * 支持：本周/本月/本年度/最近7天/最近30天/全部
 */
const loadRankingData = async () => {
	try {
		let response

		// 根据选中的时间范围调用不同API
		switch (selectedTimeRange.value) {
			case 'week': {
				const weekStart = getCurrentWeekStart()
				response = await getWeeklyRanking(weekStart, selectedTopN)
				break
			}
			case 'month': {
				const now = new Date()
				response = await getMonthlyRanking(now.getFullYear(), now.getMonth() + 1, selectedTopN)
				break
			}
			case 'today': {
				const today = new Date().toLocaleDateString('en-CA')
				const startTime = `${today}T00:00:00`
				const endTime = `${today}T23:59:59`
				response = await getTopStudentsByTimeRange(startTime, endTime, selectedTopN)
				break
			}
			case 'last7days':
				response = await getLast7DaysRanking(selectedTopN)
				break
			case 'last30days': {
				response = await getLast30DaysRanking(selectedTopN)
				break
			}
			case 'all': {
				// 项目启动日期（固定）
				const PROJECT_LAUNCH_DATE = new Date('2024-09-09T00:00:00')
				const now = new Date()
				const startDate = PROJECT_LAUNCH_DATE.toLocaleDateString('en-CA')
				const endDate = now.toLocaleDateString('en-CA')
				const startTime = `${startDate}T00:00:00`
				const endTime = `${endDate}T23:59:59`
				response = await getTopStudentsByTimeRange(startTime, endTime, selectedTopN)
				break
			}
			default:
				response = await getCurrentMonthTop10Students()
				break
		}

		// API调用成功时处理数据
		if (response.code === 200) {
			const {data} = response
			// 格式化数据为前端所需结构
			const processedData = data.map(item => ({
				name: item.studentName,
				grade: item.studentGrade,
				major: item.studentMajor,
				attendanceCount: item.attendanceCount,
				levelName: getLevelName(item.studentLevel)
			}))

			// 更新响应式数据
			topStudents.value = processedData
			// 初始化/更新排行榜图表
			initAttendanceChart(processedData)
		}
	} catch (error) {
		// 错误提示
		ElMessage.error(`获取排行榜数据失败：${error.message}`)
	}
}

/**
 * 时间范围切换处理函数
 * 1. 保存用户偏好
 * 2. 重新加载排行榜数据
 */
const handleTimeRangeChange = async () => {
	saveUserPreferences()
	await dataLoader.loadRankingData(selectedTopN)
	initAttendanceChart(topStudents.value)
}

/**
 * 加载学生等级统计数据
 * 并计算：坊内成员数、社团成员数、签到率
 */
const loadLevelStats = async () => {
	try {
		// 并行请求不同等级的学生数
		const [adminData, coreData, normalData] = await Promise.all([
			getStudentCountByLevel(3), // 管理员
			getStudentCountByLevel(2), // 核心成员
			getStudentCountByLevel(1) // 普通成员
		])

		// 更新等级统计数据
		if (adminData.code === 200) {
			levelStats.value.admin = adminData.data
		}

		if (coreData.code === 200) {
			levelStats.value.core = coreData.data
		}

		if (normalData.code === 200) {
			levelStats.value.normal = normalData.data
		}

		// 计算社团成员和坊内成员数量
		calculateClubMembers()

		// 计算签到率（需等待月度签到数据加载完成）
		if (monthlyAttendanceCount.value > 0) {
			const rate = calculateAttendanceRate(monthlyAttendanceCount.value)
			attendanceRate.value = rate
		}
	} catch (error) {
		ElMessage.error('获取等级统计失败')
	}
}

/**
 * 加载页面核心数据（主入口）
 * 并行加载：年级统计、专业统计、学生总数、月度签到、今日签到
 */
const loadData = async () => {
	try {
		const { gradeData, majorData, totalData, monthlyData, dailyData } = await dataLoader.loadData()

		if (gradeData.code === 200 && gradeData.data) {
			initGradeChart(gradeData.data)
		}

		if (majorData.code === 200 && majorData.data) {
			initMajorChart(majorData.data)
		}

		if (monthlyData.code === 200 && monthlyData.data) {
			const dailyAvg = calculateDailyAvgAttendance(monthlyData.data.count)
			dailyAvgAttendance.value = dailyAvg
			monthlyAttendanceCount.value = monthlyData.data.count
		}

		if (dailyData.code === 200 && dailyData.data != null) {
			todayCount.value = dailyData.data
		}

		await dataLoader.loadRankingData(selectedTopN)
		initAttendanceChart(topStudents.value)
		await dataLoader.loadLevelStats()

		dataLoader.updateClubMembers()
		dataLoader.updateAttendanceRate()

		watch(selectedTimeRange, async (newValue, oldValue) => {
			if (newValue !== oldValue) {
				saveUserPreferences()
				await dataLoader.loadRankingData(selectedTopN)
				initAttendanceChart(topStudents.value)
			}
		})
	} catch (error) {
		ElMessage.error(`数据加载失败：${error.message}`)
	}
}

/**
 * 启动进度条动画
 * 动画逻辑：128秒内进度条从0到100%，完成后重新加载数据
 */
const startProgress = () => {
	progressWidth.value = 0
	progressInterval.value = setInterval(() => {
		progressWidth.value += 100 / 1280 // 1280次 * 100ms = 128秒
		if (progressWidth.value >= 100) {
			progressWidth.value = 0
			loadData() // 重新加载数据
		}
	}, 100)
}

/**
 * 启动验证码自动刷新
 * 使用 VerificationCode 类的自动刷新机制
 */
const startVerificationCodeRefresh = () => {
	VerificationCode.startAutoRefresh()
}

/**
 * 窗口大小变化时调整图表尺寸
 * 保证图表自适应容器大小
 */
const handleResize = () => {
	if (gradeChartInstance) {
		gradeChartInstance.resize()
	}
	if (majorChartInstance) {
		majorChartInstance.resize()
	}
	if (attendanceChartInstance) {
		attendanceChartInstance.resize()
	}
}

// ======================== 监听与生命周期 ========================
/**
 * 监听主题模式变化
 * 主题切换后重新加载数据（更新图表样式）
 */
watch(() => themeStore.isDarkMode, () => {
	setTimeout(() => {
		loadData()
	}, 100)
})

/**
 * 组件挂载时执行
 * 执行顺序：
 * 1. 等待DOM挂载完成
 * 2. 加载用户偏好设置
 * 3. 加载核心数据
 * 4. 启动进度条动画
 * 5. 启动验证码刷新
 * 6. 监听窗口大小变化
 */
onMounted(async () => {
	await nextTick() // 等待DOM渲染完成
	loadUserPreferences()
	await loadData()
	startProgress()
	startVerificationCodeRefresh()
	window.addEventListener('resize', handleResize)
})

/**
 * 组件卸载时执行（资源清理）
 * 清理内容：
 * 1. 进度条定时器
 * 2. 验证码定时器
 * 3. ECharts实例
 * 4. 窗口大小监听
 */
onUnmounted(() => {
	// 清理定时器
	if (progressInterval.value) {
		clearInterval(progressInterval.value)
	}
	// 销毁 ECharts 实例（避免内存泄漏）
	if (gradeChartInstance) {
		gradeChartInstance.dispose()
	}
	if (majorChartInstance) {
		majorChartInstance.dispose()
	}
	if (attendanceChartInstance) {
		attendanceChartInstance.dispose()
	}
	// 移除事件监听
	window.removeEventListener('resize', handleResize)
})

// 注册ECharts所需组件（必须在使用前注册）
echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	PieChart,
	BarChart,
	CanvasRenderer
])
</script>

<template>
	<!-- 仪表盘主容器 -->
	<div class="dashboard-desktop-container">
		<!-- 头部区域：返回按钮 + 标题 + 标语 -->
		<div class="dashboard-desktop-header">
			<div class="dashboard-desktop-header-left">
				<!-- 返回按钮 -->
				<el-button
					class="dashboard-desktop-header-back-btn"
					type="primary"
					:icon="ArrowLeft"
					circle
					@click="goBack"/>
				<!-- Logo（点击切换主题） -->
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊"
					class="dashboard-desktop-header-logo"
					title="切换主题模式"
					@click="toggleTheme"/>
				<!-- 标题区域 -->
				<div class="dashboard-desktop-header-title-section">
					<h1>人工智能创作坊</h1>
					<p>Artificial Intelligence Workshop</p>
				</div>
			</div>
			<div class="dashboard-desktop-header-right">
				<!-- 标语 -->
				<div class="dashboard-desktop-header-slogan">
					<img src="@/assets/QunCeQunLiChuangXingGongXing.png" alt="群策群力，创新共行" class="dashboard-desktop-header-slogan-img"/>
				</div>
			</div>
		</div>

		<!-- 主内容区域：左侧排行榜 + 右侧学生总览 -->
		<div class="dashboard-desktop-main-content">
			<!-- 左侧区域：签到排行榜 -->
			<div class="dashboard-desktop-ranking-left-section">
				<div class="dashboard-desktop-ranking-punch-card">
					<h2>排行榜</h2>

					<!-- 排行榜图表区域 -->
					<div class="dashboard-desktop-ranking-top-students">
						<div class="dashboard-desktop-ranking-chart-header">
							<div class="dashboard-desktop-ranking-controls-section">
								<!-- 时间范围筛选器 -->
								<div class="dashboard-desktop-ranking-time-range-selector">
									<el-radio-group
										v-model="selectedTimeRange"
										size="small"
										class="time-radio-group"
										@change="handleTimeRangeChange"
									>
										<el-radio-button
											v-for="option in timeRangeOptions.filter(opt => opt.value !== 'custom')"
											:key="option.value"
											:label="option.value"
										>
											{{ option.label }}
										</el-radio-button>
									</el-radio-group>
								</div>
							</div>
						</div>
						<!-- 签到排行榜图表容器 -->
						<div ref="attendanceChart" class="dashboard-desktop-ranking-attendance-chart"/>
					</div>

					<!-- 签到统计摘要 -->
					<div class="dashboard-desktop-ranking-summary-stats">
						<div class="dashboard-desktop-ranking-stats-row">
							<div class="dashboard-desktop-ranking-total-count">
								<span class="dashboard-desktop-ranking-label">
									<el-icon class="dashboard-desktop-ranking-stat-icon"><calendar/></el-icon>
									本月签到总人数
								</span>
								<span class="dashboard-desktop-ranking-value">{{ monthlyAttendanceCount }}人</span>
							</div>
							<div class="dashboard-desktop-ranking-total-count">
								<span class="dashboard-desktop-ranking-label">
									<el-icon class="dashboard-desktop-ranking-stat-icon"><clock/></el-icon>
									今日签到总人次
								</span>
								<span class="dashboard-desktop-ranking-value">{{ todayCount }}人</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 右侧区域：学生总览 -->
			<div class="dashboard-desktop-overview-right-section">
				<div class="dashboard-desktop-overview-overview-card">
					<h2>学生总览</h2>

					<!-- 图表容器：年级分布 + 专业分布 -->
					<div class="dashboard-desktop-overview-charts-container">
						<div class="dashboard-desktop-overview-chart-section">
							<h3>年级分布</h3>
							<div ref="gradeChart" class="dashboard-desktop-overview-chart"/>
						</div>

						<div class="dashboard-desktop-overview-chart-section">
							<h3>专业分布</h3>
							<div ref="majorChart" class="dashboard-desktop-overview-chart"/>
						</div>
					</div>

					<!-- 文明公约区域 -->
					<div class="dashboard-desktop-overview-environment-mechanism">
						<div class="dashboard-desktop-overview-mechanism-card">
							<h2>AI 坊文明公约</h2>

							<div class="dashboard-desktop-overview-mechanism-content">
								<div class="dashboard-desktop-overview-mechanism-section">
									<p>
										厦门工学院人工智能创作坊环境保障机制适用于所有入坊师生，
										遵循"谁使用，谁负责；人走场清，物归原位；共同维护"原则。
										个人工位需人走椅归、桌面整洁、垃圾自清；公共区域保持地面无杂物、设备用后归位；
										最后离开者需关闭照明空调、关好门窗。使用者为第一责任人，
										团队值日督促规范，管理员巡查，违规者暂停使用权限并承担相应责任。
									</p>
								</div>
							</div>
						</div>
					</div>

					<!-- 学生统计摘要 -->
					<div class="dashboard-desktop-overview-summary-stats">
						<div class="dashboard-desktop-overview-stats-row">
							<div class="dashboard-desktop-overview-total-count">
								<span class="dashboard-desktop-overview-label">
									<el-icon class="dashboard-desktop-overview-stat-icon"><user/></el-icon>
									坊内成员人数
								</span>
								<span class="dashboard-desktop-overview-value">{{ workshopMembersCount }}人</span>
							</div>
							<!-- 等级统计 -->
							<div class="dashboard-desktop-overview-level-stats">
								<div class="dashboard-desktop-overview-level-item dashboard-desktop-overview-admin-level">
									<div class="dashboard-desktop-overview-level-icon">
										<el-icon>
											<setting/>
										</el-icon>
									</div>
									<div class="dashboard-desktop-overview-level-content">
										<span class="dashboard-desktop-overview-level-label">管理员</span>
										<span class="dashboard-desktop-overview-level-value">{{ levelStats.admin }}人</span>
									</div>
								</div>
								<div class="dashboard-desktop-overview-level-item dashboard-desktop-overview-core-level">
									<div class="dashboard-desktop-overview-level-icon">
										<el-icon>
											<star/>
										</el-icon>
									</div>
									<div class="dashboard-desktop-overview-level-content">
										<span class="dashboard-desktop-overview-level-label">核心成员</span>
										<span class="dashboard-desktop-overview-level-value">{{ levelStats.core }}人</span>
									</div>
								</div>
								<div class="dashboard-desktop-overview-level-item dashboard-desktop-overview-normal-level">
									<div class="dashboard-desktop-overview-level-icon">
										<el-icon>
											<avatar/>
										</el-icon>
									</div>
									<div class="dashboard-desktop-overview-level-content">
										<span class="dashboard-desktop-overview-level-label">普通成员</span>
										<span class="dashboard-desktop-overview-level-value">{{ levelStats.normal }}人</span>
									</div>
								</div>
								<div class="dashboard-desktop-overview-level-item dashboard-desktop-overview-club-level">
									<div class="dashboard-desktop-overview-level-icon">
										<el-icon>
											<user/>
										</el-icon>
									</div>
									<div class="dashboard-desktop-overview-level-content">
										<span class="dashboard-desktop-overview-level-label">社团成员</span>
										<span class="dashboard-desktop-overview-level-value">{{ clubMembers }}人</span>
									</div>
								</div>
							</div>
							<!-- 系统信息 -->
							<div class="dashboard-desktop-overview-system-info">
								<div class="dashboard-desktop-overview-system-name">人工智能创作坊</div>
								<div class="dashboard-desktop-overview-system-subtitle">智慧学生管理系统</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 底部进度条 -->
		<div class="dashboard-desktop-footer-container">
			<el-progress
				:percentage="progressWidth"
				:show-text="false"
				:stroke-width="4"
				color="#fff"
			/>
		</div>

		<!-- 手机展示区域：验证码 + 二维码 -->
		<div class="dashboard-desktop-phone-display-container">
			<!-- 签到验证码卡片 -->
			<div class="dashboard-desktop-verification-code-card">
				<div class="dashboard-desktop-verification-code-label">签到验证码</div>
				<div class="dashboard-desktop-verification-code-value">
					<!-- 根据验证码状态显示不同内容 -->
					<span v-if="VerificationCode.getVerificationCodeStatus() === '本机无权获取验证码'"
						  style="font-size: 19px;padding: 10px 10px;">本机无权获取验证码</span>
					<span v-else-if="VerificationCode.getVerificationCodeStatus() === '验证码获取失败'"
						  style="font-size: 19px;">验证码获取失败</span>
					<div v-else-if="VerificationCode.getVerificationCodeStatus() === '正在申请获取验证码'">
					<span
						style="font-size: 16px;padding: 10px 10px;">正在申请获取验证码...</span>
						<ElProgress
							:percentage="VerificationCode.remainingTimePercent"
							:show-text="false"
							color="#409EFF"
						/>
					</div>
					<div v-else-if="VerificationCode.getVerificationCodeStatus() === '验证码'">
						<span>{{ VerificationCode.getVerificationCodeData() }}</span>
						<ElProgress
							:percentage="VerificationCode.remainingTimePercent"
							:show-text="false"
							color="#409EFF"
						/>
					</div>
				</div>
			</div>

			<!-- 网站二维码 -->
			<div v-if="currentQRType === 'website'" class="dashboard-desktop-qrcode-website-section">
				<img src="@/assets/ShouJiDuanQianDanRuKou.png" alt="手机端签到入口" class="dashboard-desktop-qrcode-website-code"/>
				<div
					class="dashboard-desktop-qrcode-website-text"
					:style="{
						'font-weight': '800 !important',
						'color': '#60a5fa !important',
						'text-shadow': '0 0 8px rgb(96 165 250 / 1) !important'
					}"
				>
					手机端签到入口
				</div>
			</div>

			<!-- 微信二维码 -->
			<div v-if="currentQRType === 'wechat'" class="dashboard-desktop-qrcode-wechat-section">
				<img src="@/assets/ErWeiMa.png" alt="公众号二维码" class="dashboard-desktop-qrcode-code"/>
				<div
					class="dashboard-desktop-qrcode-text"
					:style="{
						'font-weight': '800 !important',
						'color': '#60a5fa !important',
						'text-shadow': '0 0 8px rgb(96 165 250 / 1) !important'
					}"
				>
					扫码了解更多
				</div>
			</div>

			<!-- 二维码切换按钮 -->
			<div class="dashboard-desktop-qrcode-switch-buttons">
				<el-button
					class="dashboard-desktop-qrcode-switch-btn"
					type="primary"
					@click="switchQRType"
				>
					{{ currentQRType === 'website' ? '切换到公众号' : '切换到签到入口' }}
				</el-button>
			</div>

			<!-- 手机背景图 -->
			<img src="@/assets/Phone.png" alt="手机展示" class="dashboard-desktop-qrcode-phone-image"/>
		</div>
	</div>
</template>

<!-- 全局样式：头部区域 -->
<style>
@import './css/desktop/dashboard-desktop-header.css';
@import './css/desktop/dashboard-desktop-ranking.css';
@import './css/desktop/dashboard-desktop-overview.css';
@import './css/desktop/dashboard-desktop-verification.css';
@import './css/desktop/dashboard-desktop-qrcode.css';
@import './css/desktop/dashboard-desktop-qrcode-switch.css';
@import './css/desktop/dashboard-desktop-phone-display.css';
@import './css/desktop/dashboard-desktop-footer.css';
@import './css/DashboardPageDesktop.css';
</style>

<!-- 全局样式：时间筛选器和单选按钮样式 -->
<style>
.time-select-dropdown {
	z-index: 3000 !important;
	min-width: auto !important;
	padding: 8px 0;
	background: #fff;
	border: 1px solid rgb(0 0 0 / 0.1);
	border-radius: 12px;
	box-shadow: 0 8px 24px rgb(0 0 0 / 0.15);
}

.time-select-dropdown .el-select-dropdown__item {
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 100%;
	min-height: 40px;
	padding: 12px 16px;
	margin: 2px 8px;
	overflow: hidden;
	text-overflow: ellipsis;
	line-height: 1.5;
	color: #606266 !important;
	text-align: left;
	white-space: nowrap;
	pointer-events: auto !important;
	cursor: pointer !important;
	user-select: none;
	background-color: #fff !important;
	border-radius: 8px;
	transition: opacity 0.2s ease, transform 0.2s ease;
}

.time-select-dropdown .el-select-dropdown__item span {
	display: block;
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	pointer-events: none !important;
}

:where(html.dark) .time-select-dropdown .el-select-dropdown__item:hover {
	color: #818cf8;
	background-color: #334155 !important;
}

:where(html.dark) .time-select-dropdown .el-select-dropdown__item.selected {
	font-weight: 600 !important;
	color: #818cf8 !important;
	background-color: rgb(102 126 234 / 0.2) !important;
}

.time-select-dropdown .el-select-dropdown__item:hover {
	color: #409eff !important;
	background-color: #f5f7fa !important;
}

.time-select-dropdown .el-select-dropdown__item.selected {
	font-weight: 600 !important;
	color: #409eff !important;
	background-color: #ecf5ff !important;
}

.time-select-dropdown .el-select-dropdown__item.selected:hover {
	background-color: #d9ecff !important;
}

:where(html.dark) .time-select-dropdown .el-select-dropdown__item.selected:hover {
	background-color: rgb(102 126 234 / 0.3) !important;
}

html.dark .time-select-dropdown {
	background: #1e293b;
	border: 1px solid rgb(255 255 255 / 0.1);
}

html.dark .time-select-dropdown .el-select-dropdown__item {
	color: #e2e8f0 !important;
	background-color: #1e293b !important;
}

.time-radio-group {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	align-items: center;
}

.time-radio-group .el-radio-button {
	margin: 0;
}

.time-radio-group .el-radio-button__inner {
	padding: 8px 16px;
	font-size: 13px;
	color: #606266 !important;
	background-color: #fff !important;
	border-color: #dcdfe6 !important;
	border-radius: 6px;
	transition: opacity 0.2s ease, transform 0.2s ease;
}

:where(html.dark) .time-radio-group .el-radio-button__inner {
	color: #e2e8f0 !important;
	background-color: #1e293b !important;
	border-color: #334155 !important;
}

.time-radio-group .el-radio-button__original-radio:checked + .el-radio-button__inner {
	color: #fff !important;
	background-color: #409eff !important;
	border-color: #409eff !important;
	box-shadow: 0 2px 8px rgb(64 158 255 / 0.3) !important;
}

.time-radio-group .el-radio-button.is-active .el-radio-button__inner {
	color: #fff !important;
	background-color: #409eff !important;
	border-color: #409eff !important;
	box-shadow: 0 2px 8px rgb(64 158 255 / 0.3) !important;
}

:where(html.dark) .time-radio-group .el-radio-button__original-radio:checked + .el-radio-button__inner {
	color: #fff !important;
	background-color: #667eea !important;
	border-color: #667eea !important;
	box-shadow: 0 2px 8px rgb(102 126 234 / 0.4) !important;
}

:where(html.dark) .time-radio-group .el-radio-button.is-active .el-radio-button__inner {
	color: #fff !important;
	background-color: #667eea !important;
	border-color: #667eea !important;
	box-shadow: 0 2px 8px rgb(102 126 234 / 0.4) !important;
}
</style>
