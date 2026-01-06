<script setup>
/**
 * 积分看板页面组件(桌面端)
 *
 * @description 展示学生积分排行榜,包括总积分、签到积分、活动积分三个维度
 * @component PointsDashboardPageDesktop
 */
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useThemeStore } from '@/stores/theme'

import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-scrollbar.css'
import 'element-plus/theme-chalk/el-tag.css'
import 'element-plus/theme-chalk/el-popper.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-tooltip.css'
import 'element-plus/theme-chalk/display.css'
import { ArrowLeft, ArrowRight, Box, Loading, User, View } from '@element-plus/icons-vue'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ElButton, ElDialog, ElIcon, ElMessage } from 'element-plus'


import { getTopAdjustRecordsByStudentInfoId } from '@/api/points'
import StudentApi from '@/api/StudentApi'

import PointsDashboardPage from './js/PointsDashboardPage'
import PointsDashboardPageUtils from './js/PointsDashboardPageUtils'

echarts.use([
	GridComponent,
	TooltipComponent,
	BarChart,
	CanvasRenderer
])

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

// ===================== 业务逻辑实例初始化 =====================
/**
 * 积分看板页面业务逻辑实例
 * @type {Ref<PointsDashboardPage>}
 * @description 封装积分看板页面的核心业务逻辑,包含数据加载、图表初始化等方法
 */
const dashboardPage = ref(new PointsDashboardPage())

// ===================== 响应式变量定义区 =====================
/**
 * 当前激活的标签页
 * @type {Ref<string>}
 * @description 控制显示哪个排行榜:'total'|'signIn'|'activity'
 */
const activeTab = ref('total')
/**
 * 标签页顺序数组
 * @type {Array<string>}
 * @description 定义标签页的切换顺序,用于左右箭头切换
 */
const tabOrder = ['total', 'signIn', 'activity']
/**
 * 标签页名称映射
 * @type {Object<string, string>}
 * @description 标签页标识与显示名称的映射关系
 */
const tabLabelMap = {
	total: '总积分排行榜',
	signIn: '签到积分排行榜',
	activity: '活动积分排行榜'
}
/**
 * 当前标签页显示名称
 * @type {ComputedRef<string>}
 * @description 根据当前激活的标签页返回对应的显示名称
 */
const currentTabLabel = computed(() => tabLabelMap[activeTab.value] || '')
/**
 * 签到积分排行榜数据
 * @type {Ref<Array>}
 * @description 存储按签到积分排序的学生列表
 */
const signInRanking = ref([])
/**
 * 活动积分排行榜数据
 * @type {Ref<Array>}
 * @description 存储按活动积分排序的学生列表
 */
const activityRanking = ref([])
/**
 * 总积分排行榜数据
 * @type {Ref<Array>}
 * @description 存储按总积分排序的学生列表
 */
const totalRanking = ref([])
/**
 * 优秀学生列表
 * @type {Ref<Array>}
 * @description 存储排名靠前的学生数据,用于展示优秀成员
 */
const topStudents = ref([])
/**
 * 考勤数据
 * @type {Ref<Array>}
 * @description 存储学生的考勤相关数据
 */
const attendanceData = ref([])
/**
 * 签到积分加载状态
 * @type {Ref<boolean>}
 * @description 控制签到积分数据加载中的状态显示
 */
const signInLoading = ref(false)
/**
 * 活动积分加载状态
 * @type {Ref<boolean>}
 * @description 控制活动积分数据加载中的状态显示
 */
const activityLoading = ref(false)
/**
 * 总积分加载状态
 * @type {Ref<boolean>}
 * @description 控制总积分数据加载中的状态显示
 */
const totalLoading = ref(false)

// 随机文案相关 - 128句技术相关激励文案
const quotes = [
	'每一行代码，都是向梦想更近一步',
	'今天的代码，是明天产品的基石',
	'不要等待需求，要主动创造价值',
	'坚持不是看到bug才修复，而是持续优化代码',
	'你的代码，终将成就更好的产品',
	'代码不会发光，发光的是写代码的你',
	'上线不是终点，bug也不是末日',
	'只有写出来的功能，没有等出来的产品',
	'相信自己，你比想象中更会编程',
	'每一次调试，都是成长的机会',
	'编程到无能为力，重构到感动自己',
	'代码虽多行则将至，bug虽难修则必成',
	'不经历bug，怎么见彩虹',
	'越写代码，越幸运',
	'成功没有捷径，只有敲代码',
	'今天的你，决定了明天的代码质量',
	'不要害怕报错，害怕的是从未尝试',
	'梦想照进现实，需要代码来实现',
	'坚持写代码就是胜利，放弃才是失败',
	'你的编程潜力无限，只待你去发掘',
	'每一次报错，都是为了更好地理解代码',
	'写代码的人，运气都不会太差',
	'相信自己，你值得拥有最好的技术栈',
	'不要停止学习新技术，不要固守旧技术',
	'成功的人找方法，失败的人找借口',
	'只有拼尽全力，才能写出优雅的代码',
	'你的坚持，终将写出好代码',
	'梦想不会逃跑，会逃跑的永远是bug',
	'努力的意义，是让自己随时有能力重构代码',
	'没有框架的孩子，必须手写代码',
	'你现在的学习，是为了将来有更多技术选择',
	'不要在该学技术的年纪选择安逸',
	'成功就是简单的代码重复优化',
	'每一个不曾写代码的日子，都是对技术的辜负',
	'你的代码，时间会给你答案',
	'不要因为走得太远，而忘记为什么写代码',
	'相信自己，没有什么功能实现不了',
	'每一次代码提交，都是对未来的投资',
	'成功不是偶然，而是持续写代码',
	'不要等待机会，要主动创造产品',
	'写代码的人，终将被技术温柔以待',
	'梦想还是要有的，万一用代码实现了呢',
	'今天的代码，是明天成功的资本',
	'不要害怕bug，bug是成长的阶梯',
	'你的代码，终将照亮前行的路',
	'坚持到底写代码，就是胜利',
	'相信自己，你比想象中更会解决问题',
	'每一次代码优化，都在为成功铺路',
	'不要轻言放弃，否则对不起代码',
	'你的坚持，终将换来成功',
	'不要停止写代码，成功就在前方',
	'相信自己，没有什么功能做不到',
	'每一次重构代码，都是突破的机会',
	'写代码的人，终将收获成功',
	'不要害怕报错，报错是成功之母',
	'你的代码，时间会证明一切',
	'相信自己，你值得拥有成功',
	'每一次代码提交，都在向目标靠近',
	'不要等待需求，要主动抓住机会',
	'你的坚持，终将成就梦想',
	'不要因为困难而放弃，要因为坚持而成功',
	'每一次学习新技术，都是对未来的投资',
	'不要停止编码，成功就在前方',
	'你的代码，终将换来回报',
	'不要害怕新技术，新技术是成长的机会',
	'每一次代码审查，都在为成功铺路',
	'不要等待机会，要主动创造产品',
	'你的坚持，终将成就更好的代码',
	'每一次提交代码，都在向梦想靠近',
	'你的代码，终将照亮前行的路',
	'不要停止学习新技术，成功就在前方',
	'每一次重构代码，都是突破的机会',
	'你的坚持，终将换来成功',
	'不要等待需求，要主动抓住机会',
	'相信自己，你值得拥有成功',
	'每一次性能优化，都在为成功铺路',
	'不要因为困难而放弃，要因为坚持而成功',
	'你的代码，时间会证明一切',
	'不要停止编码，不要回顾旧代码',
	'每一次单元测试，都在向目标靠近',
	'不要害怕新技术，新技术是成长的机会',
	'你的代码，终将换来回报',
	'不要等待机会，要主动创造产品',
	'每一次学习算法，都是对未来的投资',
	'不要因为走得太远，而忘记为什么写代码',
	'你的坚持，终将成就梦想',
	'不要轻言放弃，否则对不起代码',
	'每一次架构设计，都是突破的机会',
	'你的代码，时间会给你答案',
	'相信自己，没有什么功能做不到',
	'每一次代码提交，都在向梦想靠近',
	'你的坚持，终将成就更好的代码',
	'每一次学习设计模式，都是对未来的投资',
	'你的代码，终将换来成功',
	'相信自己，你值得拥有最好的技术',
	'每一次代码审查，都在向目标靠近',
	'写代码的人，运气都不会太差',
	'相信自己，你比想象中更会编程',
	'写代码的人，终将被技术温柔以待',
	'每一次Git提交，都是对代码质量的承诺',
	'不要害怕技术债务，重构是成长的必经之路',
	'你的代码注释，是给未来自己的礼物',
	'每一次代码Review，都在提升团队水平',
	'不要停止思考，算法是程序员的灵魂',
	'你的测试覆盖率，决定了代码的可靠性',
	'每一次性能调优，都在追求极致体验',
	'不要忽视代码规范，细节决定成败',
	'你的设计模式，让代码更优雅',
	'每一次学习新技术栈，都在拓宽技术边界',
	'不要害怕开源，分享让技术更美好',
	'你的代码架构，决定了系统的可扩展性',
	'每一次解决技术难题，都在突破自我',
	'不要停止探索，技术世界永无止境',
	'你的代码质量，体现了你的专业素养',
	'每一次技术分享，都在传播知识',
	'不要害怕挑战，复杂问题需要耐心',
	'你的代码风格，是个人品牌的体现',
	'每一次优化算法，都在追求效率',
	'不要停止实践，理论需要代码验证',
	'你的技术选型，决定了项目的未来',
	'每一次代码重构，都在追求完美',
	'不要害怕新技术，拥抱变化才能进步',
	'你的代码可读性，体现了你的责任心',
	'每一次技术突破，都在创造价值',
	'不要停止学习，技术更新日新月异',
	'你的代码文档，是团队协作的桥梁',
	'每一次技术选型，都在权衡利弊',
	'不要害怕失败，错误是最好的老师',
	'你的代码版本控制，记录了成长的轨迹'
]

// ===================== 随机文案相关变量 =====================
/**
 * 当前显示的文案
 * @type {Ref<string>}
 * @description 当前正在显示的激励文案内容
 */
const currentQuote = ref('')
/**
 * 文案显示状态
 * @type {Ref<boolean>}
 * @description 控制文案的显示/隐藏,用于淡入淡出动画
 */
const showQuote = ref(false)
/**
 * 文案轮播定时器
 * @type {number|null}
 * @description 存储文案轮播的定时器ID,用于清除定时器
 */
let quoteTimer = null
/**
 * 上次显示的文案索引
 * @type {number}
 * @description 记录上次显示的文案在数组中的索引,避免连续显示相同文案
 */
let lastQuoteIndex = -1

// ===================== 随机文案方法区 =====================
/**
 * 获取随机文案
 * @function getRandomQuote
 * @description 从文案数组中随机选择一条文案,确保不连续显示相同文案
 * @returns {string} 随机选择的激励文案
 */
const getRandomQuote = () => {
	let randomIndex
	// 如果只有一条文案,直接返回
	if (quotes.length === 1) {
		return quotes[0]
	}
	/**
	 * 确保不连续显示相同的文案
	 * @description 通过循环确保新选择的文案索引与上次不同
	 */
	do {
		randomIndex = Math.floor(Math.random() * quotes.length)
	} while (randomIndex === lastQuoteIndex && quotes.length > 1)

	// 记录当前文案索引
	lastQuoteIndex = randomIndex
	return quotes[randomIndex]
}

/**
 * 更新文案(带淡入淡出效果)
 * @function updateQuote
 * @description 更新显示的文案,先淡出再淡入,实现平滑过渡效果
 * 淡出时间400ms,然后显示新文案并淡入
 */
const updateQuote = () => {
	// 先隐藏当前文案(淡出)
	showQuote.value = false
	// 等待淡出动画完成后显示新文案
	setTimeout(() => {
		currentQuote.value = getRandomQuote()
		showQuote.value = true // 淡入显示新文案
	}, 400) // 淡出时间
}

/**
 * 启动文案轮播
 * @function startQuoteRotation
 * @description 启动文案自动轮播功能
 * 流程:
 * 1. 立即显示第一条随机文案
 * 2. 每隔5-8秒随机间隔更新一次文案
 * 3. 使用递归调用实现持续轮播
 */
const startQuoteRotation = () => {
	// 立即显示第一条随机文案
	currentQuote.value = getRandomQuote()
	showQuote.value = true

	/**
	 * 安排下一次文案更新
	 * @description 使用递归调用实现持续轮播
	 * 随机间隔5-8秒,增加自然感,避免过于机械
	 */
	const scheduleNext = () => {
		// 5-8秒随机间隔
		const delay = 5000 + Math.random() * 3000
		quoteTimer = setTimeout(() => {
			updateQuote()
			scheduleNext() // 递归调用,实现持续轮播
		}, delay)
	}
	scheduleNext()
}

/**
 * 停止文案轮播
 * @function stopQuoteRotation
 * @description 清除文案轮播定时器,停止自动更新
 * 在组件卸载时调用,避免内存泄漏
 */
const stopQuoteRotation = () => {
	if (quoteTimer) {
		clearTimeout(quoteTimer)
		quoteTimer = null
	}
}

// ===================== 改分记录弹窗相关变量 =====================
/**
 * 改分记录弹窗显示状态
 * @type {Ref<boolean>}
 * @description 控制改分记录弹窗的显示/隐藏
 */
const recordsDialogVisible = ref(false)
/**
 * 当前选中的学生
 * @type {Ref<Object|null>}
 * @description 存储当前查看改分记录的学生信息
 */
const currentStudent = ref(null)
/**
 * 所有改分记录
 * @type {Ref<Array>}
 * @description 存储当前学生的所有积分调整记录
 */
const allRecords = ref([])
/**
 * 改分记录加载状态
 * @type {Ref<boolean>}
 * @description 控制改分记录数据加载中的状态显示
 */
const recordsLoading = ref(false)
/**
 * 改分记录弹窗关闭状态标记
 * @type {Ref<boolean>}
 * @description 防止弹窗关闭动画期间的重复关闭操作
 */
const isClosingRecordsDialog = ref(false)

// ===================== 图表相关变量 =====================
/**
 * 签到积分图表DOM引用
 * @type {Ref<HTMLElement|null>}
 * @description 签到积分柱状图的DOM元素引用
 */
const signInChart = ref(null)
/**
 * 活动积分图表DOM引用
 * @type {Ref<HTMLElement|null>}
 * @description 活动积分柱状图的DOM元素引用
 */
const activityChart = ref(null)
/**
 * 总积分图表DOM引用
 * @type {Ref<HTMLElement|null>}
 * @description 总积分堆叠柱状图的DOM元素引用
 */
const totalChart = ref(null)
/**
 * 签到积分图表实例
 * @type {EChartsInstance|null}
 * @description ECharts签到积分图表实例
 */
let signInChartInstance = null
/**
 * 活动积分图表实例
 * @type {EChartsInstance|null}
 * @description ECharts活动积分图表实例
 */
let activityChartInstance = null
/**
 * 总积分图表实例
 * @type {EChartsInstance|null}
 * @description ECharts总积分图表实例
 */
let totalChartInstance = null

// ===================== 页面操作方法区 =====================
/**
 * 返回上一页
 * @function goBack
 * @description 点击返回按钮时触发,跳转到导航页面
 */
const goBack = () => {
	router.push('/navigation')
}

/**
 * 跳转到所有成员页面
 * @function goToAllMembers
 * @description 点击所有成员入口时触发,跳转到所有成员页面
 */
const goToAllMembers = () => {
	router.push('/all-members')
}

/**
 * 切换标签页
 * @function switchTab
 * @description 根据方向切换标签页,支持循环切换
 * @param {string} direction - 切换方向:'prev'表示上一个,'next'表示下一个
 */
const switchTab = direction => {
	// 获取当前标签页在数组中的索引
	const idx = tabOrder.indexOf(activeTab.value)
	/**
	 * 计算下一个标签页索引
	 * @description 使用模运算实现循环切换
	 * - 向前切换:索引减1,如果小于0则跳到最后一个
	 * - 向后切换:索引加1,如果超过数组长度则跳到第一个
	 */
	const nextIdx = direction === 'prev'
		? (idx - 1 + tabOrder.length) % tabOrder.length
		: (idx + 1) % tabOrder.length
	// 更新当前激活的标签页
	activeTab.value = tabOrder[nextIdx]
	// 触发标签页切换处理
	handleTabChange(activeTab.value)
}

/**
 * 初始化签到积分图表
 * @function initSignInChart
 * @description 初始化并配置签到积分柱状图
 * 流程:
 * 1. 检查DOM元素是否存在
 * 2. 销毁旧实例(如果存在)
 * 3. 创建新的ECharts实例
 * 4. 排序数据并计算最大值
 * 5. 配置图表选项并渲染
 * @param {Array} data - 学生积分数据数组
 * @async
 * @returns {Promise<void>}
 */
const initSignInChart = async data => {
	// 检查DOM元素是否存在,不存在则等待下一个tick
	if (!signInChart.value) {
		await nextTick()
		if (!signInChart.value) { return }
	}

	// 如果已存在实例,先销毁避免内存泄漏
	if (signInChartInstance) {
		signInChartInstance.dispose()
	}

	// 创建新的ECharts实例
	signInChartInstance = echarts.init(signInChart.value)

	/**
	 * 排序数据并计算最大值
	 * @description 按签到积分升序排列,用于图表显示
	 * 计算最大值用于设置X轴范围
	 */
	const sortedData = [...data].sort((a, b) => (a.signInPoints || 0) - (b.signInPoints || 0))
	const isDark = themeStore.isDarkMode // 获取当前主题模式
	const maxValue = sortedData.length > 0 ? sortedData[sortedData.length - 1].signInPoints || 0 : 0

	const option = {
		tooltip: {
			show: true,
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			},
			formatter(params) {
				const item = sortedData[params[0].dataIndex]
				return `${item.name || '未知学生'}<br/>总积分: ${item.totalPoints || 0}分`
			}
		},
		grid: {
			left: '0%',
			right: '15%',
			bottom: '3%',
			top: '0%',
			containLabel: true
		},
		xAxis: {
			type: 'value',
			max: maxValue,
			axisLabel: {
				fontSize: 12,
				formatter: '{value}分',
				color: isDark ? '#ffffff' : '#2c3e50'
			},
			axisLine: {
				lineStyle: {
					color: isDark ? '#ffffff' : '#2c3e50'
				}
			}
		},
		yAxis: {
			type: 'category',
			data: sortedData.map(item => item.name || `学生ID: ${item.studentInfoId}`),
			axisLabel: {
				interval: 0,
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
				name: '签到积分',
				type: 'bar',
				data: sortedData.map(item => item.signInPoints || 0),
				barWidth: '60%',
				itemStyle: {
					color(params) {
						const totalCount = sortedData.length
						const index = params.dataIndex

						if (totalCount <= 10) {
							const colors = ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1']
							return colors[index]
						}
						const hue = 200 + (index / totalCount) * 40
						const saturation = 70 + (index / totalCount) * 20
						const lightness = 85 - (index / totalCount) * 30
						return `hsl(${hue}, ${saturation}%, ${lightness}%)`
					},
					borderRadius: [0, 4, 4, 0]
				},
				label: {
					show: true,
					position: 'right',
					formatter(params) {
						const item = sortedData[params.dataIndex]
						return `${item.signInPoints || item.attendancePoints || 0}分`
					},
					fontSize: 11,
					color: isDark ? '#ffffff' : '#666',
					lineHeight: 14,
					distance: 10
				}
			}
		]
	}

	signInChartInstance.setOption(option)
}

/**
 * 初始化活动积分图表
 * @function initActivityChart
 * @description 初始化并配置活动积分柱状图
 * 流程:
 * 1. 检查DOM元素是否存在
 * 2. 销毁旧实例(如果存在)
 * 3. 创建新的ECharts实例
 * 4. 排序数据并计算最大值
 * 5. 配置图表选项并渲染
 * @param {Array} data - 学生积分数据数组
 * @async
 * @returns {Promise<void>}
 */
const initActivityChart = async data => {
	// 检查DOM元素是否存在,不存在则等待下一个tick
	if (!activityChart.value) {
		await nextTick()
		if (!activityChart.value) { return }
	}

	// 如果已存在实例,先销毁避免内存泄漏
	if (activityChartInstance) {
		activityChartInstance.dispose()
	}

	// 创建新的ECharts实例
	activityChartInstance = echarts.init(activityChart.value)

	/**
	 * 排序数据并计算最大值
	 * @description 按活动积分升序排列,用于图表显示
	 * 计算最大值用于设置X轴范围
	 */
	const sortedData = [...data].sort((a, b) => (a.activityPoints || 0) - (b.activityPoints || 0))
	const isDark = themeStore.isDarkMode // 获取当前主题模式
	const maxValue = sortedData.length > 0 ? sortedData[sortedData.length - 1].activityPoints || 0 : 0

	const option = {
		tooltip: {
			show: true,
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			},
			formatter(params) {
				const item = sortedData[params[0].dataIndex]
				return `${item.name || '未知学生'}<br/>总积分: ${item.totalPoints || 0}分`
			}
		},
		grid: {
			left: '0%',
			right: '15%',
			bottom: '3%',
			top: '0%',
			containLabel: true
		},
		xAxis: {
			type: 'value',
			max: maxValue,
			axisLabel: {
				fontSize: 12,
				formatter: '{value}分',
				color: isDark ? '#ffffff' : '#2c3e50'
			},
			axisLine: {
				lineStyle: {
					color: isDark ? '#ffffff' : '#2c3e50'
				}
			}
		},
		yAxis: {
			type: 'category',
			data: sortedData.map(item => item.name || `学生ID: ${item.targetStudentInfoId}`),
			axisLabel: {
				interval: 0,
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
				name: '活动积分',
				type: 'bar',
				data: sortedData.map(item => item.activityPoints || 0),
				barWidth: '60%',
				itemStyle: {
					color(params) {
						const totalCount = sortedData.length
						const index = params.dataIndex

						if (totalCount <= 10) {
							const colors = ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1']
							return colors[index]
						}
						const hue = 200 + (index / totalCount) * 40
						const saturation = 70 + (index / totalCount) * 20
						const lightness = 85 - (index / totalCount) * 30
						return `hsl(${hue}, ${saturation}%, ${lightness}%)`
					},
					borderRadius: [0, 4, 4, 0]
				},
				label: {
					show: true,
					position: 'right',
					formatter(params) {
						const item = sortedData[params.dataIndex]
						return `${item.activityPoints || 0}分`
					},
					fontSize: 11,
					color: isDark ? '#ffffff' : '#666',
					lineHeight: 14,
					distance: 10
				}
			}
		]
	}

	activityChartInstance.setOption(option)
}

/**
 * 初始化总积分图表
 * @function initTotalChart
 * @description 初始化并配置总积分堆叠柱状图
 * 流程:
 * 1. 检查DOM元素是否存在
 * 2. 销毁旧实例(如果存在)
 * 3. 创建新的ECharts实例
 * 4. 排序数据并计算最大值
 * 5. 配置图表选项并渲染(堆叠柱状图,包含签到积分和活动积分)
 * @param {Array} data - 学生积分数据数组
 * @async
 * @returns {Promise<void>}
 */
const initTotalChart = async data => {
	// 检查DOM元素是否存在,不存在则等待下一个tick
	if (!totalChart.value) {
		await nextTick()
		if (!totalChart.value) { return }
	}

	// 如果已存在实例,先销毁避免内存泄漏
	if (totalChartInstance) {
		totalChartInstance.dispose()
	}

	// 创建新的ECharts实例
	totalChartInstance = echarts.init(totalChart.value)

	/**
	 * 排序数据并计算最大值
	 * @description 按总积分升序排列,用于图表显示
	 * 计算最大值用于设置X轴范围
	 */
	const sortedData = [...data].sort((a, b) => (a.totalPoints || 0) - (b.totalPoints || 0))
	const isDark = themeStore.isDarkMode // 获取当前主题模式
	const maxValue = sortedData.length > 0 ? sortedData[sortedData.length - 1].totalPoints || 0 : 0

	const option = {
		tooltip: {
			show: true,
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			},
			formatter(params) {
				const item = sortedData[params[0].dataIndex]
				return `${item.name || '未知学生'}<br/>总积分: ${item.totalPoints || 0}分`
			}
		},
		grid: {
			left: '0%',
			right: '15%',
			bottom: '3%',
			top: '0%',
			containLabel: true
		},
		xAxis: {
			type: 'value',
			max: maxValue,
			axisLabel: {
				fontSize: 12,
				formatter: '{value}分',
				color: isDark ? '#ffffff' : '#2c3e50'
			},
			axisLine: {
				lineStyle: {
					color: isDark ? '#ffffff' : '#2c3e50'
				}
			}
		},
		yAxis: {
			type: 'category',
			data: sortedData.map(item => item.name || `学生ID: ${item.studentInfoId}`),
			axisLabel: {
				interval: 0,
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
				name: '签到积分',
				type: 'bar',
				stack: 'total',
				data: sortedData.map(item => item.signInPoints || 0),
				barWidth: '60%',
				itemStyle: {
					color: isDark ? '#60a5fa' : '#4facfe',
					borderRadius: [0, 0, 0, 0]
				},
				label: {
					show: false
				}
			},
			{
				name: '活动积分',
				type: 'bar',
				stack: 'total',
				data: sortedData.map(item => item.activityPoints || 0),
				barWidth: '60%',
				itemStyle: {
					color: isDark ? '#00d4ff' : '#00f2fe',
					borderRadius: [0, 4, 4, 0]
				},
				label: {
					show: true,
					position: 'right',
					formatter(params) {
						const item = sortedData[params.dataIndex]
						return `${item.totalPoints || 0}分`
					},
					fontSize: 11,
					color: isDark ? '#ffffff' : '#666',
					distance: 10
				}
			}
		]
	}

	totalChartInstance.setOption(option)
}

/**
 * 处理头像加载错误
 * @function handleAvatarError
 * @description 当学生头像加载失败时调用,标记为无头像状态
 * @param {Object} student - 学生对象,包含hasAvatar和avatarUrl属性
 */
const handleAvatarError = student => {
	student.hasAvatar = false
	student.avatarUrl = null
}

// ===================== 数据加载方法区 =====================
/**
 * 获取考勤数据
 * @function getAttendanceData
 * @description 获取签到排行榜数据并补充学生信息
 * 流程:
 * 1. 获取原始签到排名数据(前32名)
 * 2. 检查综合排名数据是否存在
 * 3. 遍历签到数据,从综合排名数据中补充学生信息(姓名等)
 * 4. 如果综合排名数据中找不到,则调用API获取
 * 5. 格式化数据为图表所需格式
 * @async
 * @returns {Promise<void>}
 */
const getAttendanceData = async () => {
	try {
		// 1. 先获取原始签到排名数据
		const rawAttendanceData = await PointsDashboardPageUtils.getTopNStudentsByAttendanceCount(32)

		// 2. 检查综合排名数据是否存在，不存在则提示并返回空
		if (!dashboardPage.value.comprehensiveRankingData || dashboardPage.value.comprehensiveRankingData.length === 0) {
			ElMessage.warning('综合排名数据未加载，无法补充学生信息')
			attendanceData.value = rawAttendanceData
			return
		}

		// 3. 遍历签到数据，补充学生信息（姓名、学院、专业等）
		attendanceData.value = await Promise.all(rawAttendanceData.map(async item => {
			// 根据studentInfoId从综合排名数据中找对应学生
			const matchedStudent = dashboardPage.value.comprehensiveRankingData.find(
				student => student.studentInfoId === item.studentInfoId
			)
			// 如果没找到
			if (!matchedStudent) {
				try {
					const nameResponse = await StudentApi.getStudentPublicFieldValueById(item.studentInfoId, 'name')
					let name = '未知'
					if (nameResponse.code === 200) {
						name = nameResponse.data
					} else if (nameResponse.message) {
						ElMessage.error(`获取学生签到排行榜学生姓名失败：${nameResponse.message}`)
					} else {
						ElMessage.error('获取签到排行榜学生姓名失败，请检查网络连接或联系管理员')
					}
					// 补充信息：找到则用匹配的信息，没找到则姓名显示"未知"
					return {
						...item, // 保留原有字段（studentInfoId、attendanceCount、attendancePoints、ranking）
						// 补充学生姓名
						name
					}
				} catch (error) {
					ElMessage.error('获取签到排行榜学生姓名失败，请检查网络连接或联系管理员')
					return {
						...item,
						name: '未知'
					}
				}
			} else {
				// 补充信息：找到则用匹配的信息，没找到则姓名显示"未知"
				return {
					...item, // 保留原有字段（studentInfoId、attendanceCount、attendancePoints、ranking）
					// 补充学生姓名
					name: matchedStudent?.name || '未知'
				}
			}
		}))

		// 将数据格式化为图表所需格式
		signInRanking.value = attendanceData.value.map(item => ({
			studentInfoId: item.studentInfoId,
			name: item.name || '未知',
			signInPoints: item.attendancePoints || 0
		}))
	} catch (error) {
		ElMessage.error(error.message || '获取签到排行榜失败, 请检查网络连接或联系管理员')
		attendanceData.value = []
		signInRanking.value = []
	}
}

/**
 * 填充学生列表到指定长度
 * @function padTopStudents
 * @description 如果学生列表长度不足,使用占位符填充到目标长度
 * 用于保持网格布局的整齐,避免最后一行留空
 * @param {Array} list - 学生数据列表
 * @param {number} targetLength - 目标长度,默认12
 * @returns {Array} 填充后的列表,包含占位符对象
 */
const padTopStudents = (list, targetLength = 12) => {
	const filled = [...list]
	// 如果列表长度不足,添加占位符
	while (filled.length < targetLength) {
		filled.push({
			placeholder: true, // 标记为占位符
			placeholderId: `placeholder-${filled.length}` // 唯一标识
		})
	}
	return filled
}

/**
 * 加载总积分排行榜
 * @function loadTotalRanking
 * @description 从业务逻辑类获取综合排名数据并格式化
 * 流程:
 * 1. 调用业务逻辑类初始化数据
 * 2. 获取综合排名数据
 * 3. 格式化数据为图表和列表所需格式
 * 4. 填充侧边栏显示列表(前32名)
 * 5. 初始化图表(显示前20名)
 * @async
 * @returns {Promise<void>}
 */
const loadTotalRanking = async () => {
	// 开启加载状态
	totalLoading.value = true
	try {
		/**
		 * 使用 PointsDashboardPage 获取数据(前32名)
		 * @description 调用业务逻辑类初始化数据,获取综合排名
		 */
		await dashboardPage.value.initData()
		const rankingData = dashboardPage.value.comprehensiveRankingData || []

		/**
		 * 将数据格式化为图表所需格式
		 * @description 直接使用 PointsDashboardPage 返回的完整数据
		 * 包含学生ID、姓名、年级、专业、等级、头像、各类积分等信息
		 */
		totalRanking.value = rankingData.map(student => ({
			studentInfoId: student.studentInfoId, // 学生数据库ID
			name: student.name, // 直接使用已获取的姓名
			grade: student.grade, // 直接使用已获取的年级
			major: student.major, // 直接使用已获取的专业
			levelCode: student.levelCode, // 直接使用已获取的等级
			hasAvatar: Boolean(student.avatarUrl), // 直接使用已获取的头像信息
			avatarUrl: student.avatarUrl, // 直接使用已获取的头像URL
			signInPoints: student.attendancePoints, // 签到积分
			activityPoints: student.activityPoints, // 活动积分
			totalPoints: student.totalPoints // 总积分
		}))

		/**
		 * 侧边栏显示前32名
		 * @description 截取前32名学生,并使用占位符填充到32个
		 * 保持网格布局整齐(4行×8列或类似布局)
		 */
		const topList = totalRanking.value.slice(0, 32)
		topStudents.value = padTopStudents(topList, 32)

		// 初始化图表 - 显示前20名
		await nextTick()
		if (totalRanking.value.length > 0) {
			const initChartWithRetry = async (retryCount = 0) => {
				if (totalChart.value) {
					await initTotalChart(totalRanking.value.slice(0, 32))
				} else if (retryCount < 10) {
					setTimeout(() => {
						initChartWithRetry(retryCount + 1)
					}, 100)
				}
			}
			setTimeout(() => {
				initChartWithRetry()
			}, 200)
		}
	} catch (error) {
		console.error('获取综合排名数据失败:', error)
		totalRanking.value = []
	} finally {
		totalLoading.value = false
	}
}

/**
 * 处理标签页切换事件
 * @function handleTabChange
 * @description 切换标签页时触发,加载对应的数据并初始化图表
 * 流程:
 * 1. 等待下一个tick确保DOM更新
 * 2. 根据标签页类型加载对应数据
 * 3. 使用重试机制初始化图表(最多重试10次)
 * 4. 处理加载状态和错误
 * @param {string} tabName - 标签页名称:'signIn'|'activity'|'total'
 * @async
 * @returns {Promise<void>}
 */
const handleTabChange = async tabName => {
	await nextTick()
	if (tabName === 'signIn') {
		signInLoading.value = true
		try {
			// 使用新的获取签到数据方法
			await getAttendanceData()

			const initChartWithRetry = async (retryCount = 0) => {
				if (signInChart.value) {
					await initSignInChart(signInRanking.value)
				} else if (retryCount < 10) {
					setTimeout(() => {
						initChartWithRetry(retryCount + 1)
					}, 100)
				}
			}
			setTimeout(() => {
				initChartWithRetry()
			}, 200)
		} catch (error) {
			console.error('获取签到排名数据失败:', error)
		} finally {
			signInLoading.value = false
		}
	} else if (tabName === 'activity') {
		activityLoading.value = true
		try {
			// 使用新的获取活动积分数据方法
			await dashboardPage.value.getActivityData()

			// 将获取到的活动积分数据赋值给activityRanking
			activityRanking.value = dashboardPage.value.activityData.map(item => ({
				targetStudentInfoId: item.studentInfoId,
				name: item.name || '未知',
				activityPoints: item.activityPoints || 0
			}))

			const initChartWithRetry = async (retryCount = 0) => {
				if (activityChart.value) {
					await initActivityChart(activityRanking.value)
				} else if (retryCount < 10) {
					setTimeout(() => {
						initChartWithRetry(retryCount + 1)
					}, 100)
				}
			}
			setTimeout(() => {
				initChartWithRetry()
			}, 200)
		} catch (error) {
			console.error('获取活动积分排名数据失败:', error)
		} finally {
			activityLoading.value = false
		}
	} else if (tabName === 'total') {
		if (totalRanking.value.length === 0) {
			await loadTotalRanking()
		} else if (totalRanking.value.length > 0) {
				const initChartWithRetry = async (retryCount = 0) => {
					if (totalChart.value) {
						await initTotalChart(totalRanking.value.slice(0, 32))
					} else if (retryCount < 10) {
						setTimeout(() => {
							initChartWithRetry(retryCount + 1)
						}, 100)
					}
				}
				setTimeout(() => {
					initChartWithRetry()
				}, 200)
			}
	}
}

const handleResize = () => {
	if (signInChartInstance) {
		signInChartInstance.resize()
	}
	if (activityChartInstance) {
		activityChartInstance.resize()
	}
	if (totalChartInstance) {
		totalChartInstance.resize()
	}
}

// 自动刷新定时器
/**
 * 自动刷新定时器
 * @type {number|null}
 * @description 存储定时器引用,用于启动和停止自动刷新功能
 */
let refreshTimer = null

/**
 * 统一的刷新数据函数
 * @function refreshData
 * @description 根据当前激活的标签页刷新对应的数据
 * 流程:
 * 1. 调用dashboardPage刷新所有数据
 * 2. 更新总积分排行榜数据
 * 3. 更新侧边栏显示的前32名学生
 * 4. 根据当前激活标签页更新对应排行榜
 * @async
 * @returns {Promise<void>}
 */
const refreshData = async () => {
	// 统一使用 PointsDashboardPage 刷新数据
	await dashboardPage.value.refreshData()
	const rankingData = dashboardPage.value.comprehensiveRankingData || []

	// 更新总积分排行榜
	totalRanking.value = rankingData.map(student => ({
		studentInfoId: student.studentInfoId,
		name: student.name, // 直接使用已获取的姓名
		grade: student.grade, // 直接使用已获取的年级
		major: student.major, // 直接使用已获取的专业
		levelCode: student.levelCode, // 直接使用已获取的等级
		hasAvatar: Boolean(student.avatarUrl), // 直接使用已获取的头像信息
		avatarUrl: student.avatarUrl, // 直接使用已获取的头像URL
		signInPoints: student.attendancePoints, // 签到积分
		activityPoints: student.activityPoints, // 活动积分
		totalPoints: student.totalPoints // 总积分
	}))

	// 更新侧边栏显示的前32名
	const topList = totalRanking.value.slice(0, 32)
	topStudents.value = padTopStudents(topList, 32)

	// 根据当前激活的 tab 更新对应的排行榜
	if (activeTab.value === 'signIn') {
		signInRanking.value = rankingData.map(student => ({
			studentInfoId: student.studentInfoId,
			name: student.name,
			grade: student.grade,
			major: student.major,
			signInPoints: student.attendancePoints
		}))
	} else if (activeTab.value === 'activity') {
		activityRanking.value = rankingData.map(student => ({
			targetStudentInfoId: student.studentInfoId,
			name: student.name,
			grade: student.grade,
			major: student.major,
			activityPoints: student.activityPoints
		}))
	}
}

/**
 * 启动自动刷新功能
 * @function startAutoRefresh
 * @description 设置定时器,每隔60秒自动刷新一次数据
 * 流程:
 * 1. 清除已存在的定时器(避免重复)
 * 2. 创建新的定时器,每60秒调用refreshData()
 * @returns {void}
 */
const startAutoRefresh = () => {
	// 清除已存在的定时器
	if (refreshTimer) {
		clearInterval(refreshTimer)
	}
	// 设置定时器，每隔60秒（60000毫秒）刷新一次
	refreshTimer = setInterval(() => {
		refreshData()
	}, 60000)
}

/**
 * 停止自动刷新功能
 * @function stopAutoRefresh
 * @description 清除自动刷新定时器,释放资源
 * @returns {void}
 */
const stopAutoRefresh = () => {
	if (refreshTimer) {
		clearInterval(refreshTimer)
		refreshTimer = null
	}
}

watch(() => themeStore.isDarkMode, () => {
	setTimeout(() => {
		if (activeTab.value === 'signIn' && signInRanking.value.length > 0) {
			initSignInChart(signInRanking.value)
		} else if (activeTab.value === 'activity' && activityRanking.value.length > 0) {
			initActivityChart(activityRanking.value)
		} else if (activeTab.value === 'total' && totalRanking.value.length > 0) {
			initTotalChart(totalRanking.value)
		}
	}, 100)
})

/**
 * 打开改分记录对话框
 * @function openRecordsDialog
 * @description 打开学生改分记录弹窗并加载对应数据
 * 流程:
 * 1. 重置关闭状态
 * 2. 恢复遮罩层样式
 * 3. 设置当前学生并显示弹窗
 * 4. 调用API获取该学生的改分记录
 * 5. 按时间降序排序记录
 * @param {Object} student - 学生信息对象,包含studentInfoId等
 * @async
 * @returns {Promise<void>}
 */
const openRecordsDialog = async student => {
	// 重置关闭状态
	isClosingRecordsDialog.value = false

	// 恢复遮罩层样式，确保可以正常显示
	const dialogWrapper = document.querySelector('.records-dialog-overlay')
	if (dialogWrapper) {
		dialogWrapper.style.display = ''
		dialogWrapper.style.visibility = ''
		dialogWrapper.style.opacity = ''
	}

	// 设置当前学生
	currentStudent.value = student
	recordsDialogVisible.value = true
	recordsLoading.value = true
	allRecords.value = []

	try {
		const response = await getTopAdjustRecordsByStudentInfoId(student.studentInfoId, 100)
		if (response.code === 200 && Array.isArray(response.data)) {
			// 按时间降序排序（最新的在前）
			allRecords.value = response.data.sort((a, b) => {
				const timeA = new Date(a.createTime).getTime()
				const timeB = new Date(b.createTime).getTime()
				return timeB - timeA
			})
		}
	} catch (error) {
		console.error('获取改分记录失败:', error)
		allRecords.value = []
	} finally {
		recordsLoading.value = false
	}
}

/**
 * 处理改分记录对话框关闭事件
 * @function handleRecordsDialogClose
 * @description 关闭改分记录弹窗,执行清理操作
 * 流程:
 * 1. 防止重复关闭(使用标志位)
 * 2. 隐藏遮罩层DOM,避免闪烁
 * 3. 清空记录数据,防止渲染问题
 * 4. 延迟清理其他状态数据
 * @returns {void}
 */
const handleRecordsDialogClose = () => {
	// 防止重复关闭
	if (isClosingRecordsDialog.value) { return }
	isClosingRecordsDialog.value = true

	// 先直接操作DOM隐藏遮罩层，避免闪烁
	const dialogWrapper = document.querySelector('.records-dialog-overlay')
	if (dialogWrapper) {
		dialogWrapper.style.display = 'none'
		dialogWrapper.style.visibility = 'hidden'
		dialogWrapper.style.opacity = '0'
	}

	// 立即清空 allRecords，避免 v-for 在关闭动画过程中重新渲染
	allRecords.value = []

	// 延迟清空其他数据，确保弹窗完全关闭后再清空
	setTimeout(() => {
		recordsLoading.value = false
		currentStudent.value = null
		isClosingRecordsDialog.value = false
	}, 0)
}

const formatGrade = grade => {
	if (!grade) { return '' }
	const gradeNum = parseInt(grade)
	if (isNaN(gradeNum)) { return grade }
	const gradeMap = {
		1: '大一',
		2: '大二',
		3: '大三',
		4: '大四',
		5: '大五',
		6: '大六'
	}
	return gradeMap[gradeNum] || `${gradeNum}年级`
}

const formatTime = timeString => {
	if (!timeString) { return '--' }
	try {
		const date = new Date(timeString)
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')
		return `${year}-${month}-${day} ${hours}:${minutes}`
	} catch (error) {
		return timeString
	}
}

/**
 * 组件挂载完成后的生命周期钩子
 * @function onMounted
 * @description 组件挂载后初始化数据和启动各种功能
 * 执行内容:
 * 1. 等待DOM更新完成
 * 2. 加载总积分排行榜数据
 * 3. 监听窗口resize事件
 * 4. 启动励志语录轮播
 * 5. 启动自动刷新功能
 * @async
 * @returns {Promise<void>}
 */
onMounted(async () => {
	await nextTick()
	await loadTotalRanking()
	window.addEventListener('resize', handleResize)
	startQuoteRotation()
	// 启动自动刷新
	startAutoRefresh()
})

/**
 * 组件卸载前的生命周期钩子
 * @function onUnmounted
 * @description 组件卸载前清理资源和事件监听
 * 清理内容:
 * 1. 停止励志语录轮播
 * 2. 停止自动刷新
 * 3. 销毁所有图表实例
 * 4. 移除窗口resize监听
 * @returns {void}
 */
onUnmounted(() => {
	stopQuoteRotation()
	// 停止自动刷新
	stopAutoRefresh()
	if (signInChartInstance) {
		signInChartInstance.dispose()
	}
	if (activityChartInstance) {
		activityChartInstance.dispose()
	}
	if (totalChartInstance) {
		totalChartInstance.dispose()
	}
	window.removeEventListener('resize', handleResize)
})
</script>

<template>
	<!-- 积分看板页面主容器 -->
	<div class="points-dashboard-container">
		<!-- 页面头部 -->
		<div class="header">
			<div class="header-left">
				<el-button
					class="back-btn"
					type="primary"
					:icon="ArrowLeft"
					circle
					@click="goBack"/>
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊"
					class="logo"
					title="切换主题模式"
					@click="toggleTheme"/>
				<div class="title-section">
					<h1 class="main-title">在0与1之间，见证每一位创作者的光芒</h1>
				</div>
			</div>
			<div class="header-right">
				<el-button
					type="primary"
					size="default"
					plain
					@click="goToAllMembers">
					<el-icon>
						<user/>
					</el-icon>
					<span style="margin-left: 6px;">查看全部成员</span>
				</el-button>
				<div class="slogan">
					<img src="@/assets/QunCeQunLiChuangXingGongXing.png" alt="群策群力，创新共行" class="slogan-img"/>
				</div>
			</div>
		</div>

		<div class="main-content">
			<div class="dashboard-layout">
				<div class="dashboard-main">
					<div v-if="activeTab === 'signIn'" class="ranking-tabs">
						<div class="ranking-topbar">
							<div class="ranking-arrows">
								<el-button
									circle
									size="small"
									plain
									@click="switchTab('prev')">
									<el-icon>
										<arrow-left/>
									</el-icon>
								</el-button>
								<span class="ranking-label">{{ currentTabLabel }}</span>
								<el-button
									circle
									size="small"
									plain
									@click="switchTab('next')">
									<el-icon>
										<arrow-right/>
									</el-icon>
								</el-button>
							</div>
						</div>
						<div class="ranking-list-container">
							<div v-if="signInLoading" class="loading-container">
								<el-icon class="is-loading">
									<loading/>
								</el-icon>
								<span>加载中...</span>
							</div>
							<div v-else-if="signInRanking.length === 0" class="empty-container">
								<el-icon>
									<box/>
								</el-icon>
								<span>暂无数据</span>
							</div>
							<div v-else class="chart-container">
								<div ref="signInChart" class="points-chart"/>
								<div class="formula-card formula-mini">
									<div class="formula-content">
										<div class="formula-item">
											<span class="formula-label">总签到积分</span>
											<span class="formula-equals">=</span>
											<span class="formula-value">签到次数</span>
											<span class="formula-operator">×</span>
											<span class="formula-value">0.64</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div v-else-if="activeTab === 'activity'" class="ranking-tabs">
						<div class="ranking-topbar">
							<div class="ranking-arrows">
								<el-button
									circle
									size="small"
									plain
									@click="switchTab('prev')">
									<el-icon>
										<arrow-left/>
									</el-icon>
								</el-button>
								<span class="ranking-label">{{ currentTabLabel }}</span>
								<el-button
									circle
									size="small"
									plain
									@click="switchTab('next')">
									<el-icon>
										<arrow-right/>
									</el-icon>
								</el-button>
							</div>
						</div>
						<div class="ranking-list-container">
							<div v-if="activityLoading" class="loading-container">
								<el-icon class="is-loading">
									<loading/>
								</el-icon>
								<span>加载中...</span>
							</div>
							<div v-else-if="activityRanking.length === 0" class="empty-container">
								<el-icon>
									<box/>
								</el-icon>
								<span>暂无数据</span>
							</div>
							<div v-else class="chart-container">
								<div ref="activityChart" class="points-chart"/>
								<div class="formula-card formula-mini">
									<div class="formula-content">
										<div class="formula-item">
											<span class="formula-label">总活动积分</span>
											<span class="formula-equals">=</span>
											<span class="formula-value">Σ(所有活动积分)</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div v-else class="ranking-tabs">
						<div class="ranking-topbar">
							<div class="ranking-arrows">
								<el-button
									circle
									size="small"
									plain
									@click="switchTab('prev')">
									<el-icon>
										<arrow-left/>
									</el-icon>
								</el-button>
								<span class="ranking-label">{{ currentTabLabel }}</span>
								<el-button
									circle
									size="small"
									plain
									@click="switchTab('next')">
									<el-icon>
										<arrow-right/>
									</el-icon>
								</el-button>
							</div>
						</div>
						<div class="ranking-list-container">
							<div v-if="totalLoading" class="loading-container">
								<el-icon class="is-loading">
									<loading/>
								</el-icon>
								<span>加载中...</span>
							</div>
							<div v-else-if="totalRanking.length === 0" class="empty-container">
								<el-icon>
									<box/>
								</el-icon>
								<span>暂无符合条件的学生</span>
							</div>
							<div v-else class="chart-container">
								<div ref="totalChart" class="points-chart"/>
								<div class="formula-card formula-mini">
									<div class="formula-content">
										<div class="formula-item">
											<span class="formula-label">总积分</span>
											<span class="formula-equals">=</span>
											<span class="formula-value formula-signin">总签到积分</span>
											<span class="formula-operator">+</span>
											<span class="formula-value formula-activity">总活动积分</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="dashboard-side">
					<div class="side-card">
						<div class="side-card-header">
							<div class="card-header-left">
								<div class="side-card-title">优秀成员</div>
								<div class="side-card-subtitle">总积分前32名</div>
							</div>
							<div v-if="topStudents.length > 0" class="unified-legend">
								<div class="legend-section">
									<div class="legend-item">
										<span class="legend-dot legend-club-member"/>
										<span class="legend-text">社团成员</span>
									</div>
									<div class="legend-item">
										<span class="legend-dot legend-normal-member"/>
										<span class="legend-text">普通成员</span>
									</div>
									<div class="legend-item">
										<span class="legend-dot legend-core-member"/>
										<span class="legend-text">核心成员</span>
									</div>
									<div class="legend-item">
										<span class="legend-dot legend-admin"/>
										<span class="legend-text">管理员</span>
									</div>
								</div>
								<div class="legend-section">
									<div class="legend-item">
										<el-icon class="hint-icon">
											<View/>
										</el-icon>
										<span class="legend-text">点击眼睛图标可查看全部改分记录</span>
									</div>
								</div>
								<div class="legend-section">
									<div class="legend-item">
										<span class="legend-dot legend-total"/>
										<span class="legend-text">总积分</span>
									</div>
									<div class="legend-item">
										<span class="legend-dot legend-signin"/>
										<span class="legend-text">总签到积分</span>
									</div>
									<div class="legend-item">
										<span class="legend-dot legend-activity"/>
										<span class="legend-text">总活动积分</span>
									</div>
								</div>
							</div>
							<div v-if="topStudents.length > 0" class="random-quote-container">
								<div class="random-quote" :class="{ 'fade-in': showQuote }">
									{{ currentQuote }}
								</div>
							</div>
						</div>
						<div v-if="topStudents.length > 0" class="side-card-body">
							<div
								v-for="(student, index) in topStudents"
								:key="student.studentInfoId || student.placeholderId"
								:style="{ animationDelay: `${index * 0.05}s` }"
								class="side-student"
								:class="{
									'is-placeholder': student.placeholder,
									'level-club-member': !student.placeholder && student.levelCode === 0,
									'level-normal-member': !student.placeholder && student.levelCode === 1,
									'level-core-member': !student.placeholder && student.levelCode === 2,
									'level-admin': !student.placeholder && student.levelCode === 3
								}"
							>
								<div class="side-info">
									<div class="side-avatar-section">
										<div
											class="side-avatar"
											:class="{ 'has-avatar': student.hasAvatar && student.avatarUrl, 'no-avatar': !student.hasAvatar || !student.avatarUrl }">
											<img
												v-if="student.hasAvatar && student.avatarUrl"
												v-lazy="student.avatarUrl"
												alt="头像"
												class="avatar-image"
												@error="handleAvatarError(student)"/>
											<el-icon v-else size="26" class="avatar-icon">
												<user/>
											</el-icon>
										</div>
										<div class="side-name">
											{{
												student.placeholder ? '待入榜' : (student.name || `学生ID: ${student.studentInfoId}`)
											}}
										</div>
									</div>
									<div class="side-content">
										<div v-if="!student.placeholder" class="side-meta">
											<div v-if="student.major" class="meta-line meta-line-second">
												{{ student.major }}
											</div>
											<div v-else class="meta-line meta-line-second">--</div>
											<div v-if="student.grade" class="meta-line meta-line-second">
												{{ formatGrade(student.grade) }}
											</div>
											<div v-else class="meta-line meta-line-second">--</div>
										</div>
										<div class="side-points">
											<div class="points-total-row">
												<div v-if="!student.placeholder" class="points-formula">
													<span class="points-total points-total-main">{{
														student.totalPoints
													}}</span>
													<span class="points-equals">=</span>
													<span class="points-number points-signin">{{
														student.signInPoints
													}}</span>
													<span class="points-plus">+</span>
													<span class="points-number points-activity">{{
														student.activityPoints
													}}</span>
												</div>
												<div v-else class="points-formula">
													<span class="points-placeholder">待公布</span>
												</div>
												<el-button
													v-if="!student.placeholder"
													size="small"
													type="primary"
													plain
													class="view-records-btn"
													circle
													@click="openRecordsDialog(student)"
												>
													<el-icon>
														<View/>
													</el-icon>
												</el-button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div v-else class="side-empty">
							<el-icon>
								<box/>
							</el-icon>
							<span>暂无数据</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 改分记录弹窗 -->
		<el-dialog
			v-if="recordsDialogVisible"
			v-model="recordsDialogVisible"
			:title="`${currentStudent?.name || '学生'}的改分记录`"
			width="80%"
			:close-on-click-modal="false"
			:destroy-on-close="true"
			:append-to-body="true"
			:teleported="true"
			modal-class="records-dialog-overlay"
			class="records-dialog"
			@close="handleRecordsDialogClose"
		>
			<div v-if="recordsLoading" class="records-loading">
				<el-icon class="is-loading">
					<loading/>
				</el-icon>
				<span>加载中...</span>
			</div>
			<div v-else-if="allRecords.length === 0" class="records-empty">
				<el-icon>
					<box/>
				</el-icon>
				<span>暂无改分记录</span>
			</div>
			<div v-else class="records-grid">
				<div
					v-for="(record, index) in allRecords"
					:key="index"
					class="record-card"
				>
					<div class="record-header">
						<span class="record-time">{{ formatTime(record.createTime) }}</span>
						<span
							class="record-points-badge"
							:class="{ positive: record.adjustPoints >= 0, negative: record.adjustPoints < 0 }">
							{{ record.adjustPoints > 0 ? `+${record.adjustPoints}` : record.adjustPoints }}
						</span>
					</div>
					<div class="record-reason-text">{{ record.adjustReason }}</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<style scoped src="./css/PointsDashboardPageDesktop.css"></style>
