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
import './css/desktop/PointsDashboardPageDesktopHeader.css'
import './css/desktop/PointsDashboardPageDesktopRanking.css'
import './css/desktop/PointsDashboardPageDesktopSide.css'
import PointsDashboardPageViewRecordsDesktopForm from './forms/desktop/PointsDashboardPageViewRecordsDesktopForm.vue'

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
	<div class="points-dashboard-container points-dashboard-desktop-enter-animation">
		<!-- 页面头部 -->
		<div class="points-dashboard-page-desktop-header">
			<div class="points-dashboard-page-desktop-header-left">
				<el-button
					class="points-dashboard-page-desktop-header-back-btn"
					type="primary"
					:icon="ArrowLeft"
					circle
					@click="goBack"/>
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊"
					class="points-dashboard-page-desktop-header-logo"
					title="切换主题模式"
					@click="toggleTheme"/>
				<div class="points-dashboard-page-desktop-header-title-section">
					<h1 class="points-dashboard-page-desktop-header-main-title">在0与1之间，见证每一位创作者的光芒</h1>
				</div>
			</div>
			<div class="points-dashboard-page-desktop-header-right">
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
				<div class="points-dashboard-page-desktop-header-slogan">
					<img src="@/assets/QunCeQunLiChuangXingGongXing.png" alt="群策群力，创新共行" class="points-dashboard-page-desktop-header-slogan-img"/>
				</div>
			</div>
		</div>

		<div class="main-content">
			<div class="dashboard-layout">
				<div class="points-dashboard-page-desktop-dashboard-main">
					<div v-if="activeTab === 'signIn'" class="points-dashboard-page-desktop-ranking-tabs">
						<div class="points-dashboard-page-desktop-ranking-topbar">
							<div class="points-dashboard-page-desktop-ranking-arrows">
								<el-button
									circle
									size="small"
									plain
									@click="switchTab('prev')">
									<el-icon>
										<arrow-left/>
									</el-icon>
								</el-button>
								<span class="points-dashboard-page-desktop-ranking-label">{{ currentTabLabel }}</span>
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
						<div class="points-dashboard-page-desktop-ranking-list-container">
							<div v-if="signInLoading" class="points-dashboard-page-desktop-loading-container">
								<el-icon class="is-loading">
									<loading/>
								</el-icon>
								<span>加载中...</span>
							</div>
							<div v-else-if="signInRanking.length === 0" class="points-dashboard-page-desktop-empty-container">
								<el-icon>
									<box/>
								</el-icon>
								<span>暂无数据</span>
							</div>
							<div v-else class="points-dashboard-page-desktop-chart-container">
								<div ref="signInChart" class="points-dashboard-page-desktop-points-chart"/>
								<div class="points-dashboard-page-desktop-formula-card points-dashboard-page-desktop-formula-mini">
									<div class="points-dashboard-page-desktop-formula-content">
										<div class="points-dashboard-page-desktop-formula-item">
											<span class="points-dashboard-page-desktop-formula-label">总签到积分</span>
											<span class="points-dashboard-page-desktop-formula-equals">=</span>
											<span class="points-dashboard-page-desktop-formula-value">签到次数</span>
											<span class="points-dashboard-page-desktop-formula-operator">×</span>
											<span class="points-dashboard-page-desktop-formula-value">0.64</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div v-else-if="activeTab === 'activity'" class="points-dashboard-page-desktop-ranking-tabs">
						<div class="points-dashboard-page-desktop-ranking-topbar">
							<div class="points-dashboard-page-desktop-ranking-arrows">
								<el-button
									circle
									size="small"
									plain
									@click="switchTab('prev')">
									<el-icon>
										<arrow-left/>
									</el-icon>
								</el-button>
								<span class="points-dashboard-page-desktop-ranking-label">{{ currentTabLabel }}</span>
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
						<div class="points-dashboard-page-desktop-ranking-list-container">
							<div v-if="activityLoading" class="points-dashboard-page-desktop-loading-container">
								<el-icon class="is-loading">
									<loading/>
								</el-icon>
								<span>加载中...</span>
							</div>
							<div v-else-if="activityRanking.length === 0" class="points-dashboard-page-desktop-empty-container">
								<el-icon>
									<box/>
								</el-icon>
								<span>暂无数据</span>
							</div>
							<div v-else class="points-dashboard-page-desktop-chart-container">
								<div ref="activityChart" class="points-dashboard-page-desktop-points-chart"/>
								<div class="points-dashboard-page-desktop-formula-card points-dashboard-page-desktop-formula-mini">
									<div class="points-dashboard-page-desktop-formula-content">
										<div class="points-dashboard-page-desktop-formula-item">
											<span class="points-dashboard-page-desktop-formula-label">总活动积分</span>
											<span class="points-dashboard-page-desktop-formula-equals">=</span>
											<span class="points-dashboard-page-desktop-formula-value">Σ(所有活动积分)</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div v-else class="points-dashboard-page-desktop-ranking-tabs">
						<div class="points-dashboard-page-desktop-ranking-topbar">
							<div class="points-dashboard-page-desktop-ranking-arrows">
								<el-button
									circle
									size="small"
									plain
									@click="switchTab('prev')">
									<el-icon>
										<arrow-left/>
									</el-icon>
								</el-button>
								<span class="points-dashboard-page-desktop-ranking-label">{{ currentTabLabel }}</span>
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
						<div class="points-dashboard-page-desktop-ranking-list-container">
							<div v-if="totalLoading" class="points-dashboard-page-desktop-loading-container">
								<el-icon class="is-loading">
									<loading/>
								</el-icon>
								<span>加载中...</span>
							</div>
							<div v-else-if="totalRanking.length === 0" class="points-dashboard-page-desktop-empty-container">
								<el-icon>
									<box/>
								</el-icon>
								<span>暂无符合条件的学生</span>
							</div>
							<div v-else class="points-dashboard-page-desktop-chart-container">
								<div ref="totalChart" class="points-dashboard-page-desktop-points-chart"/>
								<div class="points-dashboard-page-desktop-formula-card points-dashboard-page-desktop-formula-mini">
									<div class="points-dashboard-page-desktop-formula-content">
										<div class="points-dashboard-page-desktop-formula-item">
											<span class="points-dashboard-page-desktop-formula-label">总积分</span>
											<span class="points-dashboard-page-desktop-formula-equals">=</span>
											<span class="points-dashboard-page-desktop-formula-value points-dashboard-page-desktop-formula-signin">总签到积分</span>
											<span class="points-dashboard-page-desktop-formula-operator">+</span>
											<span class="points-dashboard-page-desktop-formula-value points-dashboard-page-desktop-formula-activity">总活动积分</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="points-dashboard-page-desktop-dashboard-side">
					<div class="points-dashboard-page-desktop-side-card">
						<div class="points-dashboard-page-desktop-side-card-header">
							<div class="points-dashboard-page-desktop-card-header-left">
								<div class="points-dashboard-page-desktop-side-card-title">优秀成员</div>
								<div class="points-dashboard-page-desktop-side-card-subtitle">总积分前32名</div>
							</div>
							<div v-if="topStudents.length > 0" class="points-dashboard-page-desktop-unified-legend">
								<div class="points-dashboard-page-desktop-legend-section">
									<div class="points-dashboard-page-desktop-legend-item">
										<span class="points-dashboard-page-desktop-legend-dot points-dashboard-page-desktop-legend-club-member"/>
										<span class="points-dashboard-page-desktop-legend-text">社团成员</span>
									</div>
									<div class="points-dashboard-page-desktop-legend-item">
										<span class="points-dashboard-page-desktop-legend-dot points-dashboard-page-desktop-legend-normal-member"/>
										<span class="points-dashboard-page-desktop-legend-text">普通成员</span>
									</div>
									<div class="points-dashboard-page-desktop-legend-item">
										<span class="points-dashboard-page-desktop-legend-dot points-dashboard-page-desktop-legend-core-member"/>
										<span class="points-dashboard-page-desktop-legend-text">核心成员</span>
									</div>
									<div class="points-dashboard-page-desktop-legend-item">
										<span class="points-dashboard-page-desktop-legend-dot points-dashboard-page-desktop-legend-admin"/>
										<span class="points-dashboard-page-desktop-legend-text">管理员</span>
									</div>
								</div>
								<div class="points-dashboard-page-desktop-legend-section">
									<div class="points-dashboard-page-desktop-legend-item">
										<el-icon class="points-dashboard-page-desktop-hint-icon">
											<View/>
										</el-icon>
										<span class="points-dashboard-page-desktop-legend-text">点击眼睛图标可查看全部改分记录</span>
									</div>
								</div>
								<div class="points-dashboard-page-desktop-legend-section">
									<div class="points-dashboard-page-desktop-legend-item">
										<span class="points-dashboard-page-desktop-legend-dot points-dashboard-page-desktop-legend-total"/>
										<span class="points-dashboard-page-desktop-legend-text">总积分</span>
									</div>
									<div class="points-dashboard-page-desktop-legend-item">
										<span class="points-dashboard-page-desktop-legend-dot points-dashboard-page-desktop-legend-signin"/>
										<span class="points-dashboard-page-desktop-legend-text">总签到积分</span>
									</div>
									<div class="points-dashboard-page-desktop-legend-item">
										<span class="points-dashboard-page-desktop-legend-dot points-dashboard-page-desktop-legend-activity"/>
										<span class="points-dashboard-page-desktop-legend-text">总活动积分</span>
									</div>
								</div>
							</div>
						</div>
						<div v-if="topStudents.length > 0" class="points-dashboard-page-desktop-side-card-body">
							<div
								v-for="(student, index) in topStudents"
								:key="student.studentInfoId || student.placeholderId"
								:style="{ animationDelay: `${index * 0.05}s` }"
								class="points-dashboard-page-desktop-side-student"
								:class="{
									'points-dashboard-page-desktop-is-placeholder': student.placeholder,
									'points-dashboard-page-desktop-level-club-member': !student.placeholder && student.levelCode === 0,
									'points-dashboard-page-desktop-level-normal-member': !student.placeholder && student.levelCode === 1,
									'points-dashboard-page-desktop-level-core-member': !student.placeholder && student.levelCode === 2,
									'points-dashboard-page-desktop-level-admin': !student.placeholder && student.levelCode === 3
								}"
							>
								<div class="points-dashboard-page-desktop-side-info">
									<div class="points-dashboard-page-desktop-side-avatar-section">
										<div
											class="points-dashboard-page-desktop-side-avatar"
											:class="{ 'points-dashboard-page-desktop-has-avatar': student.hasAvatar && student.avatarUrl, 'points-dashboard-page-desktop-no-avatar': !student.hasAvatar || !student.avatarUrl }">
											<img
												v-if="student.hasAvatar && student.avatarUrl"
												v-lazy="student.avatarUrl"
												alt="头像"
												class="points-dashboard-page-desktop-avatar-image"
												@error="handleAvatarError(student)"/>
											<el-icon v-else size="26" class="points-dashboard-page-desktop-avatar-icon">
												<user/>
											</el-icon>
										</div>
										<div class="points-dashboard-page-desktop-side-name">
											{{
												student.placeholder ? '待入榜' : (student.name || `学生ID: ${student.studentInfoId}`)
											}}
										</div>
									</div>
									<div class="points-dashboard-page-desktop-side-content">
										<div v-if="!student.placeholder" class="points-dashboard-page-desktop-side-meta">
											<div v-if="student.major" class="points-dashboard-page-desktop-meta-line points-dashboard-page-desktop-meta-line-second">
												{{ student.major }}
											</div>
											<div v-else class="points-dashboard-page-desktop-meta-line points-dashboard-page-desktop-meta-line-second">--</div>
											<div v-if="student.grade" class="points-dashboard-page-desktop-meta-line points-dashboard-page-desktop-meta-line-second">
												{{ formatGrade(student.grade) }}
											</div>
											<div v-else class="points-dashboard-page-desktop-meta-line points-dashboard-page-desktop-meta-line-second">--</div>
										</div>
										<div class="points-dashboard-page-desktop-side-points">
											<div class="points-dashboard-page-desktop-points-total-row">
												<div v-if="!student.placeholder" class="points-dashboard-page-desktop-points-formula">
													<span class="points-dashboard-page-desktop-points-total points-dashboard-page-desktop-points-total-main" style="color: #667eea !important;">{{
														student.totalPoints
													}}</span>
													<span class="points-dashboard-page-desktop-points-equals">=</span>
													<span class="points-dashboard-page-desktop-points-number points-dashboard-page-desktop-points-signin" style="color: #4facfe !important;">{{
														student.signInPoints
													}}</span>
													<span class="points-dashboard-page-desktop-points-plus">+</span>
													<span class="points-dashboard-page-desktop-points-number points-dashboard-page-desktop-points-activity" style="color: #f59e0b !important;">{{
														student.activityPoints
													}}</span>
												</div>
												<div v-else class="points-dashboard-page-desktop-points-formula">
													<span class="points-placeholder">待公布</span>
												</div>
												<el-button
													v-if="!student.placeholder"
													size="small"
													type="primary"
													plain
													class="points-dashboard-page-desktop-view-records-btn"
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
		<PointsDashboardPageViewRecordsDesktopForm
			v-model="recordsDialogVisible"
			:student-info-id="currentStudent?.studentInfoId"
			:student-name="currentStudent?.name"
		/>
	</div>
</template>


