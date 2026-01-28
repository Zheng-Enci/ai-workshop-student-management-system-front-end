<script setup>
/**
 * 全部成员页面组件(桌面端)
 *
 * @description 展示所有成员的积分信息和排名统计
 * @component AllMembersPageDesktop
 */
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useThemeStore } from '@/stores/theme'
import { useLoadingMaskStore } from '@/stores/loading'
import LoadingMask from '@/components/LoadingMask.vue'

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
import { ArrowLeft, Box, DataAnalysis, Search, User, View } from '@element-plus/icons-vue'
import { BarChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ElButton, ElDialog, ElIcon, ElInput, ElTooltip } from 'element-plus'

import { getAttendanceTopRanking } from '@/api/attendance'
import AdjustRecordsDialogManager from '@/views/AllMembersPage/js/AdjustRecordsDialogManager'
import AllMembersPage from '@/views/AllMembersPage/js/AllMembersPage'

echarts.use([
	GridComponent,
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
 * 全局加载蒙版 Store
 * @type {Store}
 * @description 管理全局加载蒙版的显示和隐藏
 */
const loadingMaskStore = useLoadingMaskStore()
/**
 * 主题切换方法
 * @type {Function}
 * @description 解构自主题Store,用于切换明暗主题
 */
const { toggleTheme } = themeStore

// ===================== 响应式变量定义区 =====================
/**
 * 当前激活的标签页
 * @type {Ref<string>}
 * @description 控制显示哪个排行榜:'total'|'signIn'|'activity'
 */
const activeTab = ref('total')
/**
 * 选中的排行榜显示数量
 * @type {number}
 * @description Java Integer最大值,表示无上限显示所有数据
 */
const selectedTopN = 2147483647 // Java Integer 最大值，无上限
/**
 * 总积分排行榜显示数量
 * @type {number}
 * @description Java Integer最大值,表示无上限显示所有数据
 */
const totalRankingTopN = 2147483647 // Java Integer 最大值，无上限
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
 * @description 存储排名靠前的学生数据
 */
const topStudents = ref([])
/**
 * 已加载的数据数量
 * @type {Ref<number>}
 * @description 记录已加载的学生数据数量,用于进度显示
 */
const loadedCount = ref(0)

// ===================== 统计数据变量 =====================
/**
 * 总学生数量
 * @type {Ref<number>}
 * @description 系统中所有学生的总数
 */
const totalCount = ref(0)
/**
 * 学院统计
 * @type {Ref<object>}
 * @description 按学院分类的学生数量统计
 */
const collegeStats = ref({})
/**
 * 专业统计
 * @type {Ref<object>}
 * @description 按专业分类的学生数量统计
 */
const majorStats = ref({})
/**
 * 性别统计
 * @type {Ref<object>}
 * @description 按性别分类的学生数量统计
 */
const genderStats = ref({})
/**
 * 年级统计
 * @type {Ref<object>}
 * @description 按年级分类的学生数量统计
 */
const gradeStats = ref({})

// ===================== 搜索功能变量 =====================
/**
 * 搜索关键词
 * @type {Ref<string>}
 * @description 用户输入的搜索关键词,用于筛选学生
 */
const searchKeyword = ref('')
/**
 * 筛选后的学生列表
 * @type {Ref<Array>}
 * @description 根据搜索关键词筛选后的学生数据列表
 */
const filteredStudents = ref([])

// ===================== 随机文案相关 =====================
/**
 * 技术相关激励文案数组
 * @type {Array<string>}
 * @description 包含128句技术相关的激励文案,用于页面随机展示
 * 文案内容涵盖编程、学习、成长等主题,激励学生持续学习
 */
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
 * @returns 随机选择的激励文案
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
 * @type {Ref<object | null>}
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

// ===================== 统计数据弹窗相关变量 =====================
/**
 * 统计数据弹窗显示状态
 * @type {Ref<boolean>}
 * @description 控制统计数据弹窗的显示/隐藏
 */
const statisticsDialogVisible = ref(false)
/**
 * 统计数据弹窗关闭状态标记
 * @type {Ref<boolean>}
 * @description 防止弹窗关闭动画期间的重复关闭操作
 */
const isClosingStatisticsDialog = ref(false)

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
 * @description 总积分柱状图的DOM元素引用
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

// ===================== 页面跳转方法区 =====================
/**
 * 返回上一页
 * @function goBack
 * @description 点击返回按钮时触发,跳转到导航页面
 */
const goBack = () => {
	router.push('/navigation')
}

/**
 * 跳转到积分看板页面
 * @function goToPointsDashboard
 * @description 点击积分看板入口时触发,跳转到积分看板页面
 */
const goToPointsDashboard = () => {
	router.push('/points-dashboard')
}

/**
 * 初始化签到积分柱状图
 * @function initSignInChart
 * @description 创建并配置签到积分排行榜的柱状图
 * 特性:
 * - 水平柱状图展示学生排名
 * - 根据排名动态计算柱状颜色
 * - 支持明暗主题切换
 * - 显示学生姓名、专业、年级信息
 * @param data - 学生签到积分数据数组
 * @async
 * @returns
 */
const initSignInChart = async data => {
	if (!signInChart.value) {
		await nextTick()
		if (!signInChart.value) { return }
	}

	if (signInChartInstance) {
		signInChartInstance.dispose()
	}

	signInChartInstance = echarts.init(signInChart.value)

	const sortedData = [...data].sort((a, b) => a.signInPoints - b.signInPoints)
	const isDark = themeStore.isDarkMode
	const maxValue = sortedData.length > 0 ? sortedData[sortedData.length - 1].signInPoints : null

	const option = {
		tooltip: {
			show: false
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
				data: sortedData.map(item => item.signInPoints),
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
						let line1 = ''
						if (item.major) {
							line1 += item.major
						}
						if (item.major && item.grade) {
							line1 += ' '
						}
						if (item.grade) {
							if (!item.major) {
								line1 += ' '
							}
							line1 += formatGrade(item.grade)
						}
						if (!line1) {
							line1 = '--'
						}
						return line1
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
 * 初始化活动积分柱状图
 * @function initActivityChart
 * @description 创建并配置活动积分排行榜的柱状图
 * 特性:
 * - 水平柱状图展示学生排名
 * - 根据排名动态计算柱状颜色
 * - 支持明暗主题切换
 * - 显示学生姓名、专业、年级信息
 * @param data - 学生活动积分数据数组
 * @async
 * @returns
 */
const initActivityChart = async data => {
	if (!activityChart.value) {
		await nextTick()
		if (!activityChart.value) { return }
	}

	if (activityChartInstance) {
		activityChartInstance.dispose()
	}

	activityChartInstance = echarts.init(activityChart.value)

	const sortedData = [...data].sort((a, b) => a.activityPoints - b.activityPoints)
	const isDark = themeStore.isDarkMode
	const maxValue = sortedData.length > 0 ? sortedData[sortedData.length - 1].activityPoints : null

	const option = {
		tooltip: {
			show: false
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
				data: sortedData.map(item => item.activityPoints),
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
						let line1 = ''
						if (item.major) {
							line1 += item.major
						}
						if (item.major && item.grade) {
							line1 += ' '
						}
						if (item.grade) {
							if (!item.major) {
								line1 += ' '
							}
							line1 += formatGrade(item.grade)
						}
						if (!line1) {
							line1 = '--'
						}
						return line1
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
 * 初始化总积分柱状图
 * @function initTotalChart
 * @description 创建并配置总积分排行榜的柱状图
 * 特性:
 * - 水平柱状图展示学生排名
 * - 双柱显示签到积分和活动积分
 * - 根据排名动态计算柱状颜色
 * - 支持明暗主题切换
 * @param data - 学生总积分数据数组
 * @async
 * @returns
 */
const initTotalChart = async data => {
	if (!totalChart.value) {
		await nextTick()
		if (!totalChart.value) { return }
	}

	if (totalChartInstance) {
		totalChartInstance.dispose()
	}

	totalChartInstance = echarts.init(totalChart.value)

	const sortedData = [...data].sort((a, b) => a.totalPoints - b.totalPoints)
	const isDark = themeStore.isDarkMode
	const maxValue = sortedData.length > 0 ? sortedData[sortedData.length - 1].totalPoints : null

	const option = {
		tooltip: {
			show: false
		},
		legend: {
			data: ['签到积分', '活动积分'],
			top: '0%',
			right: '0%',
			textStyle: {
				color: isDark ? '#ffffff' : '#2c3e50',
				fontSize: 12
			}
		},
		grid: {
			left: '0%',
			right: '15%',
			bottom: '3%',
			top: '8%',
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
				data: sortedData.map(item => item.signInPoints),
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
				data: sortedData.map(item => item.activityPoints),
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
						return `${item.totalPoints}分`
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
 * @param student - 学生对象,包含hasAvatar和avatarUrl属性
 * @returns
 */
const handleAvatarError = student => {
	student.hasAvatar = false
	student.avatarUrl = null
}

/**
 * 加载签到积分排行榜数据
 * @function loadSignInRanking
 * @description 从服务器获取签到次数排名并转换为积分显示
 * 流程:
 * 1. 调用API获取签到排名数据
 * 2. 将签到次数转换为积分(1次=0.64分)
 * 3. 初始化签到积分图表
 * @async
 * @returns
 */
const loadSignInRanking = async () => {
	try {
		const response = await getAttendanceTopRanking(selectedTopN)
		if (response.code === 200 && response.data) {
			signInRanking.value = response.data.map(item => ({
				studentInfoId: item.studentInfoId,
				attendanceCount: item.attendanceCount,
				signInPoints: Math.round(item.attendanceCount * 0.64)
			}))
			await nextTick()
			if (signInRanking.value.length > 0) {
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
			}
		}
	} catch (error) {
		signInRanking.value = []
	}
}

/**
 * 填充学生列表至指定长度
 * @function padTopStudents
 * @description 当学生数量不足时,使用占位符填充列表至指定长度
 * @param list - 原始学生列表
 * @param targetLength - 目标列表长度,默认12
 * @returns 填充后的学生列表
 */
const padTopStudents = (list, targetLength = 12) => {
	const filled = [...list]
	while (filled.length < targetLength) {
		filled.push({
			placeholder: true,
			placeholderId: `placeholder-${filled.length}`
		})
	}
	return filled
}

/**
 * 处理窗口大小变化
 * @function handleResize
 * @description 当窗口大小改变时,重新调整所有图表尺寸
 * @returns
 */
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

/**
 * 计算学生统计数据
 * @function calculateStatistics
 * @description 统计学生的学院、专业、性别、年级分布情况
 * 统计内容:
 * - 总学生数量
 * - 按学院分类的数量
 * - 按专业分类的数量
 * - 按性别分类的数量
 * - 按年级分类的数量
 * @param students - 学生数据数组
 * @returns
 */
const calculateStatistics = students => {
	totalCount.value = students.length

	const colleges = {}
	const majors = {}
	const genders = {}
	const grades = {}

	students.forEach(student => {
		// 学院统计
		if (student.college) {
			colleges[student.college] = (colleges[student.college] || 0) + 1
		}

		// 专业统计
		if (student.major) {
			majors[student.major] = (majors[student.major] || 0) + 1
		}

		// 性别统计
		if (student.gender) {
			genders[student.gender] = (genders[student.gender] || 0) + 1
		}

		// 年级统计
		if (student.grade) {
			grades[student.grade] = (grades[student.grade] || 0) + 1
		}
	})

	collegeStats.value = colleges
	majorStats.value = majors
	genderStats.value = genders
	gradeStats.value = grades
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
 * 打开统计数据弹窗
 * @function showStatisticsDialog
 * @description 显示学生统计数据对话框
 * 重置关闭状态并显示弹窗
 * @returns
 */
const showStatisticsDialog = () => {
	// 重置关闭状态
	isClosingStatisticsDialog.value = false
	statisticsDialogVisible.value = true
}

/**
 * 关闭统计数据弹窗
 * @function closeStatisticsDialog
 * @description 关闭学生统计数据对话框
 * 防止重复关闭,并隐藏遮罩层
 * @returns
 */
const closeStatisticsDialog = () => {
	// 防止重复关闭
	if (isClosingStatisticsDialog.value) { return }
	isClosingStatisticsDialog.value = true

	// 先手动隐藏遮罩层，避免视觉闪烁
	const dialogWrapper = document.querySelector('.statistics-dialog-overlay')
	if (dialogWrapper) {
		dialogWrapper.style.display = 'none'
		dialogWrapper.style.visibility = 'hidden'
		dialogWrapper.style.opacity = '0'
	}

	// 关闭弹窗
	statisticsDialogVisible.value = false

	// 重置关闭状态
	setTimeout(() => {
		isClosingStatisticsDialog.value = false
	}, 0)
}

/**
 * 格式化年级
 * @function formatGrade
 * @description 将数字年级转换为中文显示格式
 * @param grade - 年级数字(1-6)
 * @returns 格式化后的年级文本,如'大一'、'大二'等
 */
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

/**
 * 格式化时间
 * @function formatTime
 * @description 将时间字符串格式化为 YYYY-MM-DD HH:MM 格式
 * @param timeString - 时间字符串
 * @returns 格式化后的时间字符串,无效时返回原始值
 */
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
 * 处理搜索功能
 * @function handleSearch
 * @description 根据搜索关键词筛选学生列表
 * 筛选字段:姓名、性别、学院、专业、年级、总积分、签到积分、活动积分
 * @returns
 */
const handleSearch = () => {
	if (!searchKeyword.value.trim()) {
		filteredStudents.value = totalRanking.value
		topStudents.value = padTopStudents(totalRanking.value, totalRanking.value.length)
		return
	}

	const keyword = searchKeyword.value.toLowerCase().trim()

	filteredStudents.value = totalRanking.value.filter(student => {
		// 搜索姓名
		if (student.name && student.name.toLowerCase().includes(keyword)) { return true }

		// 搜索性别
		if (student.gender && student.gender.toLowerCase().includes(keyword)) { return true }

		// 搜索学院
		if (student.college && student.college.toLowerCase().includes(keyword)) { return true }

		// 搜索专业
		if (student.major && student.major.toLowerCase().includes(keyword)) { return true }

		// 搜索年级（支持"大一"、"大二"等格式）
		if (student.grade) {
			const gradeText = formatGrade(student.grade).toLowerCase()
			if (gradeText.includes(keyword)) { return true }
			if (student.grade.toString().includes(keyword)) { return true }
		}

		// 搜索总积分
		if (student.totalPoints !== undefined && student.totalPoints.toString().includes(keyword)) { return true }

		// 搜索签到积分
		if (student.signInPoints !== undefined && student.signInPoints.toString().includes(keyword)) { return true }

		// 搜索活动积分
		return Boolean(student.activityPoints !== undefined && student.activityPoints.toString().includes(keyword))
	})

	topStudents.value = padTopStudents(filteredStudents.value, filteredStudents.value.length)
}


/**
 * 组件挂载完成后的生命周期钩子
 * @function onMounted
 * @description 初始化页面数据和启动各种功能
 * 执行内容:
 * 1. 等待DOM更新
 * 2. 显示全局加载蒙版
 * 3. 创建AllMembersPage实例并加载数据
 * 4. 绑定学生数据到页面响应式变量
 * 5. 使用padTopStudents处理数据
 * 6. 更新计数器
 * 7. 计算统计数据
 * 8. 隐藏全局加载蒙版
 * 9. 监听窗口resize事件
 * 10. 启动励志语录轮播
 * @async
 * @returns {Promise<void>}
 */
onMounted(async () => {
	try {
		// 显示全局加载蒙版
		loadingMaskStore.showLoadingMask('正在加载全部成员数据...')
		await nextTick()

		// 使用 AllMembersPage 加载数据
		const allMembersPage = new AllMembersPage()
		await allMembersPage.initData()

		// 将加载的学生数据绑定到页面
		totalRanking.value = allMembersPage.currentPageToShowStudentProfiles || []
		filteredStudents.value = allMembersPage.currentPageToShowStudentProfiles || []

		// 调用 padTopStudents 处理数据
		topStudents.value = padTopStudents(filteredStudents.value, filteredStudents.value.length)

		// 更新计数器
		loadedCount.value = filteredStudents.value.length
		totalCount.value = allMembersPage.sortedStudentInfoIds?.length || 0

		// 计算统计数据
		calculateStatistics(totalRanking.value)
	} finally {
		// 隐藏全局加载蒙版
		loadingMaskStore.hideLoadingMask()
	}

	window.addEventListener('resize', handleResize)
	startQuoteRotation()
})

// 创建响应式实例（替换原有的 ref 定义）
/**
 * 改分记录弹窗管理器
 * @type {Reactive<AdjustRecordsDialogManager>}
 * @description 管理改分记录弹窗的打开、关闭和数据加载
 */
const adjustRecordsDialogManager = reactive(new AdjustRecordsDialogManager())

// 方法修改为调用类方法
/**
 * 打开改分记录弹窗
 * @function openRecordsDialog
 * @description 点击学生卡片时触发,打开该学生的改分记录弹窗
 * @param student - 学生对象,包含学生ID等信息
 * @returns
 */
const openRecordsDialog = student => {
	adjustRecordsDialogManager.open(student)
}

/**
 * 处理改分记录弹窗关闭事件
 * @function handleRecordsDialogClose
 * @description 关闭改分记录弹窗时调用管理器的关闭方法
 * @returns
 */
const handleRecordsDialogClose = () => {
	adjustRecordsDialogManager.handleDialogClose()
}

/**
 * 组件卸载前的生命周期钩子
 * @function onUnmounted
 * @description 组件卸载前清理资源和事件监听
 * 清理内容:
 * 1. 停止励志语录轮播
 * 2. 销毁所有图表实例
 * 3. 移除窗口resize监听
 * @returns {void}
 */
onUnmounted(() => {
	stopQuoteRotation()
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
	<!-- 全部成员页面主容器 -->
	<div class="points-dashboard-container" style="overflow-y: visible;">
		<!-- 全局加载蒙版 -->
		<LoadingMask/>
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
					@click="goToPointsDashboard">
					<el-icon>
						<data-analysis/>
					</el-icon>
					<span style="margin-left: 6px;">积分看板</span>
				</el-button>
				<div class="slogan">
					<img src="@/assets/QunCeQunLiChuangXingGongXing.png" alt="群策群力，创新共行" class="slogan-img"/>
				</div>
			</div>
		</div>

		<div class="main-content" style="overflow-y: visible;">
			<div style="gap: 20px; overflow-y: visible;">
				<div class="dashboard-side" style="overflow-y: visible;">
					<div class="side-card" style="overflow-y: visible;">
						<div class="side-card-header">
							<div class="card-header-left">
								<div class="side-card-title">全部成员</div>
							</div>
							<div class="unified-legend">
								<div class="legend-section">
									<div v-if="topStudents.length > 0" class="legend-item">
										<el-button
											type="primary"
											size="small"
											plain
											@click="showStatisticsDialog">
											<el-icon>
												<data-analysis/>
											</el-icon>
											<span style="margin-left: 6px;">查看统计数据</span>
										</el-button>
									</div>
								</div>
								<div v-if="topStudents.length > 0" class="legend-section">
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
								<div class="legend-section" style="display: flex; gap: 20px; align-items: center;">
									<div class="legend-item">
										<el-input
											v-model="searchKeyword"
											placeholder="搜索姓名/学院/专业/年级/性别/积分"
											clearable
											style="width: 280px;"
											size="small"
											@input="handleSearch"
										>
											<template #prefix>
												<el-icon>
													<search/>
												</el-icon>
											</template>
										</el-input>
									</div>
								</div>
							</div>
						</div>
						<div v-if="topStudents.length > 0" class="random-quote-container">
							<div class="random-quote" :class="{ 'fade-in': showQuote }">
								{{ currentQuote }}
							</div>
						</div>
					</div>
					<!-- 有数据：显示学生列表 -->
					<div v-if="topStudents.length > 0" class="side-card-body">
						<div
							v-for="(student, index) in topStudents"
							:key="student.studentInfoId || student.placeholderId"
							:data-index="index"
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
									<!-- 修改后的代码 -->
									<div
										ref="avatarRef"
										class="side-avatar"
										:class="{
											'has-avatar': student.avatarUrl,
											'no-avatar': !student.avatarUrl
										}"
									>
										<img
											v-if="student.avatarUrl"
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
										<div class="meta-row">
											<div v-if="student.gender" class="meta-line meta-line-second">
												{{ student.gender }}
											</div>
											<div v-else class="meta-line meta-line-second">--</div>
											<div v-if="student.college" class="meta-line meta-line-second">
												{{ student.college }}
											</div>
											<div v-else class="meta-line meta-line-second">--</div>
										</div>
										<div class="meta-row">
											<div v-if="student.major" class="meta-line meta-line-second">
												{{ student.major }}
											</div>
											<div v-else class="meta-line meta-line-second">--</div>
											<div v-if="student.grade" class="meta-line meta-line-second">
												{{ formatGrade(student.grade) }}
											</div>
											<div v-else class="meta-line meta-line-second">--</div>
										</div>
									</div>
									<div class="side-points">
										<div class="points-total-row">
											<div v-if="!student.placeholder" class="points-formula">
												<span class="points-total points-total-main">{{
													student.totalPoints
												}}</span>
												<span class="points-equals">=</span>
												<span class="points-number points-signin">{{
													student.attendancePoints
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

					<!-- 无数据：显示暂无数据 -->
					<div v-if="topStudents.length === 0" class="side-empty">
						<el-icon size="48">
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
		v-if="adjustRecordsDialogManager.visible"
		v-model="adjustRecordsDialogManager.visible"
		:title="adjustRecordsDialogManager.getTitle()"
		width="80%"
		:close-on-click-modal="false"
		:destroy-on-close="true"
		:append-to-body="true"
		:teleported="true"
		modal-class="records-dialog-overlay"
		class="records-dialog"
		@close="handleRecordsDialogClose"
	>
		<div v-if="adjustRecordsDialogManager.loading" class="records-loading">
			<el-icon class="is-loading">
				<loading/>
			</el-icon>
			<span>加载中...</span>
		</div>
		<div v-else-if="adjustRecordsDialogManager.allRecords.length === 0" class="records-empty">
			<el-icon>
				<box/>
			</el-icon>
			<span>暂无改分记录</span>
		</div>
		<div v-else class="records-grid">
			<div
				v-for="(record, index) in adjustRecordsDialogManager.allRecords"
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


	<!-- 统计数据弹窗 -->
	<el-dialog
		v-if="statisticsDialogVisible"
		v-model="statisticsDialogVisible"
		title="统计数据"
		width="70%"
		:close-on-click-modal="false"
		:destroy-on-close="true"
		:append-to-body="true"
		:teleported="true"
		modal-class="statistics-dialog-overlay"
		class="statistics-dialog"
		@close="closeStatisticsDialog"
	>
		<div class="statistics-content">
			<div class="statistics-section-wrapper">
				<div class="statistics-section-title">总览</div>
				<div class="statistics-grid">
					<div class="statistics-card">
						<div class="statistics-card-label">总人数</div>
						<div class="statistics-card-value">{{ totalCount }}</div>
					</div>
				</div>
			</div>

			<div class="statistics-section-wrapper">
				<div class="statistics-section-title">学院分布</div>
				<div class="statistics-grid">
					<div v-for="(count, college) in collegeStats" :key="'college-' + college" class="statistics-card">
						<div class="statistics-card-label">{{ college }}</div>
						<div class="statistics-card-value">{{ count }}人</div>
					</div>
				</div>
			</div>

			<div class="statistics-section-wrapper">
				<div class="statistics-section-title">专业分布</div>
				<div class="statistics-grid">
					<div v-for="(count, major) in majorStats" :key="'major-' + major" class="statistics-card">
						<div class="statistics-card-label">{{ major }}</div>
						<div class="statistics-card-value">{{ count }}人</div>
					</div>
				</div>
			</div>

			<div class="statistics-section-wrapper">
				<div class="statistics-section-title">性别分布</div>
				<div class="statistics-grid">
					<div v-for="(count, gender) in genderStats" :key="'gender-' + gender" class="statistics-card">
						<div class="statistics-card-label">{{ gender }}</div>
						<div class="statistics-card-value">{{ count }}人</div>
					</div>
				</div>
			</div>

			<div class="statistics-section-wrapper">
				<div class="statistics-section-title">年级分布</div>
				<div class="statistics-grid">
					<div v-for="(count, grade) in gradeStats" :key="'grade-' + grade" class="statistics-card">
						<div class="statistics-card-label">{{ formatGrade(grade) }}</div>
						<div class="statistics-card-value">{{ count }}人</div>
					</div>
				</div>
			</div>
		</div>
	</el-dialog>
</template>

<style scoped>
@import './css/AllMembersPageDesktop.css';
</style>
