<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
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
import 'element-plus/theme-chalk/display.css'
import { ArrowLeft, ArrowRight, Loading, Box, View, User } from '@element-plus/icons-vue'
import { BarChart } from 'echarts/charts'
import {
	GridComponent,
	TooltipComponent
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ElButton, ElIcon, ElDialog, ElMessage } from 'element-plus'


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

/**
 * 积分看板页面组件(移动端)
 *
 * @component PointsDashboardPageMobile
 * @description 展示学生积分排行榜,包括总积分、签到积分、活动积分三个维度(移动端适配)
 * 主要功能:
 * 1. 展示三种积分排行榜(总积分、签到积分、活动积分)
 * 2. 提供图表可视化展示积分分布
 * 3. 支持查看学生改分记录
 * 4. 支持标签页切换和左右箭头导航
 *
 * @author 前端开发团队
 * @version 1.0.0
 */

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
 * 弹窗标题
 * @type {Ref<string>}
 * @description 改分记录弹窗的标题文本
 */
const dialogTitle = ref('改分记录')
/**
 * 是否显示改分记录内容
 * @type {Ref<boolean>}
 * @description 控制弹窗中改分记录内容的显示/隐藏
 */
const showRecordsContent = ref(true)

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
 * 初始化签到积分柱状图
 * @function initSignInChart
 * @description 使用ECharts初始化签到积分排行榜的横向柱状图
 * @param {Array<Object>} data - 学生签到积分数据数组
 * @param {number} data[].signInPoints - 签到积分
 * @param {string} data[].name - 学生姓名
 * @param {number} data[].totalPoints - 总积分
 * @returns {Promise<void>}
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

	const sortedData = [...data].sort((a, b) => (a.signInPoints || 0) - (b.signInPoints || 0))
	const isDark = themeStore.isDarkMode
	const maxValue = sortedData.length > 0 ? (sortedData[sortedData.length - 1].signInPoints || 0) : 0

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
				fontSize: 10,
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
				fontSize: 10,
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
						return `${item.signInPoints || 0}分`
					},
					fontSize: 10,
					color: isDark ? '#ffffff' : '#666',
					distance: 8
				}
			}
		]
	}

	signInChartInstance.setOption(option)
}

/**
 * 初始化活动积分柱状图
 * @function initActivityChart
 * @description 使用ECharts初始化活动积分排行榜的横向柱状图
 * @param {Array<Object>} data - 学生活动积分数据数组
 * @param {number} data[].activityPoints - 活动积分
 * @param {string} data[].name - 学生姓名
 * @param {number} data[].targetStudentInfoId - 目标学生ID
 * @returns {Promise<void>}
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
			right: '20%',
			bottom: '5%',
			top: '0%',
			containLabel: true
		},
		xAxis: {
			type: 'value',
			max: maxValue,
			axisLabel: {
				fontSize: 10,
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
				fontSize: 10,
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
					formatter: sortedData.map(item => item.activityPoints),
					fontSize: 9,
					color: isDark ? '#ffffff' : '#666',
					lineHeight: 12,
					distance: 8
				}
			}
		]
	}

	activityChartInstance.setOption(option)
}

/**
 * 初始化总积分堆叠柱状图
 * @function initTotalChart
 * @description 使用ECharts初始化总积分排行榜的堆叠横向柱状图,显示签到积分和活动积分的组成
 * @param {Array<Object>} data - 学生总积分数据数组
 * @param {number} data[].totalPoints - 总积分
 * @param {number} data[].signInPoints - 签到积分
 * @param {number} data[].activityPoints - 活动积分
 * @param {string} data[].name - 学生姓名
 * @param {number} data[].studentInfoId - 学生ID
 * @returns {Promise<void>}
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
	const firstPlaceTotalPoints = sortedData.length > 0 ? sortedData[sortedData.length - 1].totalPoints : null

	const option = {
		tooltip: {
			show: false
		},
		grid: {
			left: '0%',
			right: '20%',
			bottom: '5%',
			top: '0%',
			containLabel: true
		},
		xAxis: {
			type: 'value',
			max: firstPlaceTotalPoints,
			axisLabel: {
				fontSize: 10,
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
				fontSize: 10,
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
					fontSize: 9,
					color: isDark ? '#ffffff' : '#666',
					distance: 8
				}
			}
		]
	}

	totalChartInstance.setOption(option)
}

/**
 * 处理头像加载错误
 * @function handleAvatarError
 * @description 当学生头像加载失败时,标记该学生没有头像并清空头像URL
 * @param {Object} student - 学生对象
 * @param {boolean} student.hasAvatar - 是否有头像
 * @param {string|null} student.avatarUrl - 头像URL
 */
const handleAvatarError = student => {
	student.hasAvatar = false
	student.avatarUrl = null
}


// 已删除 loadStudentInfo 函数，因为 PointsDashboardPage 已经返回了完整的学生信息

// 已删除冗余的 loadSignInRanking 和 loadActivityRanking 函数，现在统一使用 PointsDashboardPage 管理数据

/**
 * 获取考勤数据并处理签到排行榜
 * @function getAttendanceData
 * @description 获取前32名学生的考勤数据,补充学生信息(姓名、年级、专业等),并格式化为图表所需格式
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
		const processedAttendanceData = await Promise.all(rawAttendanceData.map(async item => {
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

		attendanceData.value = processedAttendanceData

		// 将数据格式化为图表所需格式
		signInRanking.value = processedAttendanceData.map(item => ({
			studentInfoId: item.studentInfoId,
			name: item.name || '未知',
			grade: item.grade,
			major: item.major,
			signInPoints: item.attendancePoints || 0
		}))
	} catch (error) {
		ElMessage.error(error.message || '获取签到排行榜失败, 请检查网络连接或联系管理员')
		attendanceData.value = []
		signInRanking.value = []
	}
}

/**
 * 填充优秀学生列表
 * @function padTopStudents
 * @description 将学生列表填充到指定长度,不足时添加占位符对象
 * @param {Array<Object>} list - 学生列表
 * @param {number} targetLength - 目标长度,默认为12
 * @returns {Array<Object>} 填充后的列表
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
 * 加载总积分排行榜数据
 * @function loadTotalRanking
 * @description 获取前32名学生的综合排名数据,格式化为图表所需格式,并初始化总积分图表
 * @returns {Promise<void>}
 */
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
		totalRanking.value = []
	} finally {
		totalLoading.value = false
	}
}

/**
 * 处理标签页切换
 * @function handleTabChange
 * @description 根据标签页名称加载对应的数据并初始化图表
 * @param {string} tabName - 标签页名称:'total'|'signIn'|'activity'
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
				grade: item.grade,
				major: item.major,
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
		} finally {
			activityLoading.value = false
		}
	} else if (tabName === 'total') {
		if (totalRanking.value.length === 0) {
			await loadTotalRanking()
		} else if (totalRanking.value.length > 0) {
			const initChartWithRetry = async (retryCount = 0) => {
				if (totalChart.value) {
					initTotalChart(totalRanking.value.slice(0, 32))
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

/**
 * 处理窗口大小调整
 * @function handleResize
 * @description 当窗口大小改变时,调整所有图表的尺寸以适应新的窗口大小
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

// 自动刷新定时器
const refreshTimer = null

/**
 * 刷新数据
 * @function refreshData
 * @description 根据当前激活的标签页刷新对应的数据,并更新排行榜和图表
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
 * 监听主题模式变化
 * @description 当主题模式切换时,重新初始化当前激活标签页的图表以适配新主题
 */
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
 * 打开改分记录弹窗
 * @function openRecordsDialog
 * @description 打开指定学生的改分记录弹窗,并加载该学生的改分记录
 * @param {Object} student - 学生对象
 * @param {number} student.studentInfoId - 学生ID
 * @param {string} student.name - 学生姓名
 * @returns {Promise<void>}
 */
const openRecordsDialog = async student => {
	// 恢复遮罩层样式，确保可以正常显示
	const dialogWrapper = document.querySelector('.records-dialog-overlay')
	if (dialogWrapper) {
		dialogWrapper.style.display = ''
		dialogWrapper.style.visibility = ''
		dialogWrapper.style.opacity = ''
	}

	// 设置当前学生
	currentStudent.value = student
	dialogTitle.value = `${student?.name || '学生'}的改分记录`
	showRecordsContent.value = true
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
		allRecords.value = []
	} finally {
		recordsLoading.value = false
	}
}

/**
 * 关闭改分记录弹窗
 * @function handleRecordsDialogClose
 * @description 关闭改分记录弹窗,清空数据并隐藏遮罩层
 */
const handleRecordsDialogClose = () => {
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
		dialogTitle.value = '改分记录'
	}, 0)
}

/**
 * 格式化年级显示
 * @function formatGrade
 * @description 将年级数字转换为中文显示(如:1->大一,2->大二)
 * @param {string|number} grade - 年级数字
 * @returns {string} 格式化后的年级字符串
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
 * 格式化时间显示
 * @function formatTime
 * @description 将时间字符串格式化为"YYYY-MM-DD HH:mm"格式
 * @param {string} timeString - 时间字符串
 * @returns {string} 格式化后的时间字符串
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
 * 组件挂载时的生命周期钩子
 * @function onMounted
 * @description 组件挂载时加载总积分排行榜数据并添加窗口大小调整监听器
 */
onMounted(async () => {
	await nextTick()
	await loadTotalRanking()
	window.addEventListener('resize', handleResize)
})

/**
 * 组件卸载时的生命周期钩子
 * @function onUnmounted
 * @description 组件卸载时销毁所有图表实例并移除窗口大小调整监听器
 */
onUnmounted(() => {
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
	<div class="points-dashboard-container">
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
				<!-- 手机端不显示slogan图片 -->
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
							<div v-else>
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
							<div v-else>
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
							<div v-else>
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
						</div>
						<div v-if="topStudents.length > 0" class="side-card-body">
							<div
								v-for="student in topStudents"
								:key="student.studentInfoId || student.placeholderId"
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
											<el-icon v-else size="18" class="avatar-icon">
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
											<div v-if="student.grade" class="meta-line meta-line-second">
												{{ formatGrade(student.grade) }}
											</div>
											<div
												v-if="!student.major && !student.grade"
												class="meta-line meta-line-second">
												--
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
			v-model="recordsDialogVisible"
			:title="dialogTitle"
			width="95%"
			:close-on-press-escape="true"
			:show-close="true"
			:close-on-click-modal="false"
			:destroy-on-close="true"
			:append-to-body="true"
			:teleported="true"
			modal-class="records-dialog-overlay"
			class="records-dialog"
			@close="handleRecordsDialogClose"
		>
			<div v-if="showRecordsContent" class="records-grid">
				<div
					v-for="record in allRecords"
					:key="record.id"
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
<style scoped src="./css/PointsDashboardPageMobile.css"></style>

