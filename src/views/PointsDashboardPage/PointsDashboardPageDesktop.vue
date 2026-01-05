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

// 初始化路由和Store
const router = useRouter()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore

// 创建 PointsDashboardPage 实例
const dashboardPage = ref(new PointsDashboardPage())

const activeTab = ref('total')
const tabOrder = ['total', 'signIn', 'activity']
const tabLabelMap = {
	total: '总积分排行榜',
	signIn: '签到积分排行榜',
	activity: '活动积分排行榜'
}
const currentTabLabel = computed(() => tabLabelMap[activeTab.value] || '')
const signInRanking = ref([])
const activityRanking = ref([])
const totalRanking = ref([])
const topStudents = ref([])
const attendanceData = ref([])
const signInLoading = ref(false)
const activityLoading = ref(false)
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

const currentQuote = ref('')
const showQuote = ref(false)
let quoteTimer = null
let lastQuoteIndex = -1

// 获取随机文案（避免连续显示相同文案）
const getRandomQuote = () => {
	let randomIndex
	// 如果只有一条文案，直接返回
	if (quotes.length === 1) {
		return quotes[0]
	}
	// 确保不连续显示相同的文案
	do {
		randomIndex = Math.floor(Math.random() * quotes.length)
	} while (randomIndex === lastQuoteIndex && quotes.length > 1)

	lastQuoteIndex = randomIndex
	return quotes[randomIndex]
}

// 更新文案（带淡入淡出效果）
const updateQuote = () => {
	showQuote.value = false
	setTimeout(() => {
		currentQuote.value = getRandomQuote()
		showQuote.value = true
	}, 400) // 淡出时间
}

// 启动文案轮播
const startQuoteRotation = () => {
	// 立即显示第一条
	currentQuote.value = getRandomQuote()
	showQuote.value = true

	// 每隔一段时间刷新（5-8秒随机间隔，增加自然感）
	const scheduleNext = () => {
		const delay = 5000 + Math.random() * 3000 // 5-8秒随机
		quoteTimer = setTimeout(() => {
			updateQuote()
			scheduleNext()
		}, delay)
	}
	scheduleNext()
}

// 停止文案轮播
const stopQuoteRotation = () => {
	if (quoteTimer) {
		clearTimeout(quoteTimer)
		quoteTimer = null
	}
}

// 改分记录弹窗相关
const recordsDialogVisible = ref(false)
const currentStudent = ref(null)
const allRecords = ref([])
const recordsLoading = ref(false)
const isClosingRecordsDialog = ref(false)

const signInChart = ref(null)
const activityChart = ref(null)
const totalChart = ref(null)
let signInChartInstance = null
let activityChartInstance = null
let totalChartInstance = null

const goBack = () => {
	router.push('/navigation')
}

const goToAllMembers = () => {
	router.push('/all-members')
}

const switchTab = direction => {
	const idx = tabOrder.indexOf(activeTab.value)
	const nextIdx = direction === 'prev'
		? (idx - 1 + tabOrder.length) % tabOrder.length
		: (idx + 1) % tabOrder.length
	activeTab.value = tabOrder[nextIdx]
	handleTabChange(activeTab.value)
}

const initSignInChart = async data => {
	if (!signInChart.value) {
		await nextTick()
		if (!signInChart.value) { return }
	}

	if (signInChartInstance) {
		signInChartInstance.dispose()
	}

	signInChartInstance = echarts.init(signInChart.value)

	const sortedData = [...data].sort((a, b) => (a.signInPoints || 0) - (b.signInPoints || 0))
	const isDark = themeStore.isDarkMode
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

const initActivityChart = async data => {
	if (!activityChart.value) {
		await nextTick()
		if (!activityChart.value) { return }
	}

	if (activityChartInstance) {
		activityChartInstance.dispose()
	}

	activityChartInstance = echarts.init(activityChart.value)

	const sortedData = [...data].sort((a, b) => (a.activityPoints || 0) - (b.activityPoints || 0))
	const isDark = themeStore.isDarkMode
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

const initTotalChart = async data => {
	if (!totalChart.value) {
		await nextTick()
		if (!totalChart.value) { return }
	}

	if (totalChartInstance) {
		totalChartInstance.dispose()
	}

	totalChartInstance = echarts.init(totalChart.value)

	const sortedData = [...data].sort((a, b) => (a.totalPoints || 0) - (b.totalPoints || 0))
	const isDark = themeStore.isDarkMode
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

const handleAvatarError = student => {
	student.hasAvatar = false
	student.avatarUrl = null
}


// 已删除 loadStudentInfo 函数，因为 PointsDashboardPage 已经返回了完整的学生信息

// 删除了冗余的 loadSignInRanking 和 loadActivityRanking 函数，现在统一使用 PointsDashboardPage 管理数据

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

const loadTotalRanking = async () => {
	totalLoading.value = true
	try {
		// 使用 PointsDashboardPage 获取数据（前32名）
		await dashboardPage.value.initData()
		const rankingData = dashboardPage.value.comprehensiveRankingData || []

		// 将数据格式化为图表所需格式，直接使用 PointsDashboardPage 返回的完整数据
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

		// 侧边栏显示前32名
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
let refreshTimer = null

// 统一的刷新函数，根据当前激活的 tab 刷新对应的数据
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

// 启动自动刷新
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

// 停止自动刷新
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

onMounted(async () => {
	await nextTick()
	await loadTotalRanking()
	window.addEventListener('resize', handleResize)
	startQuoteRotation()
	// 启动自动刷新
	startAutoRefresh()
})

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
											<view/>
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
														<view/>
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
