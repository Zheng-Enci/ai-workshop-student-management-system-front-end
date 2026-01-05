<script setup>
/**
 * 学生管理页面组件(移动端)
 *
 * @description 管理员管理学生的考勤记录、补卡、热力图、趋势图等功能(移动端)
 * @component StudentManagerPageMobile
 */
import { ElMessage, ElButton, ElIcon, ElInput, ElDialog, ElDatePicker, ElCalendar } from 'element-plus'
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-date-picker.css'
import 'element-plus/theme-chalk/el-date-picker-panel.css'
import 'element-plus/theme-chalk/el-time-picker.css'
import 'element-plus/theme-chalk/el-scrollbar.css'
import 'element-plus/theme-chalk/el-calendar.css'
import { User, Calendar, Star, Refresh, Loading, ArrowLeft, Clock, InfoFilled, Check, Search, Sort, TrendCharts } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

import { getStudentAttendanceCount, makeupAttendance, getStudentAttendanceRecords } from '@/api/attendance'
import { getManagedStudents, getStudentLevel } from '@/api/student'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import StudentManagerPage from '@/views/StudentManagerPage/js/StudentManagerPage'
import StudentManagerPageUtils from '@/views/StudentManagerPage/js/StudentManagerPageUtils'

// ECharts 按需引入
import * as echarts from 'echarts/core'
import { LineChart, HeatmapChart } from 'echarts/charts'
import {
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	VisualMapComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 注册需要的组件
echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	VisualMapComponent,
	LineChart,
	HeatmapChart,
	CanvasRenderer
])

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()
const managedStudents = ref([])
const loading = ref(false)
const searchQuery = ref('')
const filteredStudents = ref([])
const sortOrder = ref('default')

const heatmapChart = ref(null)
const lineChart = ref(null)
const heatmapInstance = ref(null)
const lineInstance = ref(null)
const heatmapDialogChart = ref(null)
const trendDialogChart = ref(null)

const toggleTheme = () => {
	themeStore.toggleTheme()
}

const handleSearch = () => {
	if (!searchQuery.value.trim()) {
		if (sortOrder.value === 'attendance') {
			filteredStudents.value = [...managedStudents.value].sort((a, b) => {
				const countA = getStudentAttendanceCountFromCache(a.studentId)
				const countB = getStudentAttendanceCountFromCache(b.studentId)
				return countB - countA
			})
		} else {
			filteredStudents.value = managedStudents.value
		}
		return
	}

	const query = searchQuery.value.toLowerCase().trim()
	let filtered = managedStudents.value.filter(student =>
		student.name.toLowerCase().includes(query) ||
		student.studentId.toString().includes(query) ||
		student.major.toLowerCase().includes(query) ||
		student.college.toLowerCase().includes(query)
	)

	if (sortOrder.value === 'attendance') {
		filtered = filtered.sort((a, b) => {
			const countA = getStudentAttendanceCountFromCache(a.studentId)
			const countB = getStudentAttendanceCountFromCache(b.studentId)
			return countB - countA
		})
	}

	filteredStudents.value = filtered
}

const handleClearSearch = () => {
	searchQuery.value = ''
	if (sortOrder.value === 'attendance') {
		filteredStudents.value = [...managedStudents.value].sort((a, b) => {
			const countA = getStudentAttendanceCountFromCache(a.studentId)
			const countB = getStudentAttendanceCountFromCache(b.studentId)
			return countB - countA
		})
	} else {
		filteredStudents.value = managedStudents.value
	}
}

const sortByAttendance = () => {
	if (sortOrder.value === 'attendance') {
		sortOrder.value = 'default'
		filteredStudents.value = [...managedStudents.value]
	} else {
		sortOrder.value = 'attendance'
		filteredStudents.value = [...managedStudents.value].sort((a, b) => {
			const countA = getStudentAttendanceCountFromCache(a.studentId)
			const countB = getStudentAttendanceCountFromCache(b.studentId)
			return countB - countA
		})
	}
}
const attendanceCounts = ref({})
const makeupDialogVisible = ref(false)
const selectedStudent = ref(null)
const makeupSelectedStudent = ref(null)
const makeupForm = ref({
	attendanceTime: ''
})
const makeupLoading = ref(false)
const attendanceRecordsDialogVisible = ref(false)
const studentAttendanceRecords = ref([])
const calendarValue = ref(new Date())
const attendanceRecordsLoading = ref(false)

const heatmapDialogVisible = ref(false)
const trendChartDialogVisible = ref(false)

const timeShortcuts = [
	{
		text: '今天上午',
		value: () => {
			const today = new Date()
			today.setHours(9, 0, 0, 0)
			return today
		}
	},
	{
		text: '今天下午',
		value: () => {
			const today = new Date()
			today.setHours(15, 0, 0, 0)
			return today
		}
	},
	{
		text: '今天晚上',
		value: () => {
			const today = new Date()
			today.setHours(20, 0, 0, 0)
			return today
		}
	},
	{
		text: '昨天上午',
		value: () => {
			const yesterday = new Date()
			yesterday.setDate(yesterday.getDate() - 1)
			yesterday.setHours(9, 0, 0, 0)
			return yesterday
		}
	},
	{
		text: '昨天下午',
		value: () => {
			const yesterday = new Date()
			yesterday.setDate(yesterday.getDate() - 1)
			yesterday.setHours(15, 0, 0, 0)
			return yesterday
		}
	},
	{
		text: '昨天晚上',
		value: () => {
			const yesterday = new Date()
			yesterday.setDate(yesterday.getDate() - 1)
			yesterday.setHours(20, 0, 0, 0)
			return yesterday
		}
	}
]

const totalAttendanceCount = computed(() => Object.values(attendanceCounts.value).reduce((sum, count) => sum + count, 0))

const getStudentAttendanceCountFromCache = studentId => attendanceCounts.value[studentId] || 0

const getStudentAvatarUrl = student => {
	console.log('获取头像URL, student:', student)
	console.log('可用的ID字段:', {
		id: student.id,
		studentInfoId: student.studentInfoId,
		studentId: student.studentId,
		infoId: student.infoId,
		databaseId: student.databaseId
	})

	// 尝试多个可能的字段名
	const possibleIds = [
		student.studentInfoId,
		student.id,
		student.infoId,
		student.databaseId
	]

	const validId = possibleIds.find(id => id != null && id !== undefined && id !== '')

	if (!validId) {
		console.warn('未找到有效的学生ID:', student)
		return null
	}

	const url = StudentManagerPageUtils.getStudentAvatarUrl(validId)
	console.log('使用的ID:', validId, '头像URL:', url)
	return url
}

const handleAvatarError = event => {
	// 头像加载失败时显示默认图标
	event.target.style.display = 'none'
	const parent = event.target.parentElement
	if (parent) {
		const icon = document.createElement('i')
		icon.className = 'el-icon'
		parent.appendChild(icon)
	}
}

const loadManagedStudents = async () => {
	if (!userStore.token) {
		ElMessage.error('请先登录')
		return
	}

	loading.value = true
	try {
		// 使用 StudentManagerPage.initData 初始化数据
		await StudentManagerPage.initData(userStore.token)

		// 获取处理后的学生数据
		const students = StudentManagerPage.students || []
		managedStudents.value = students

		// 更新签到次数映射
		const newAttendanceCounts = {}
		let totalAttendanceCount = 0

		students.forEach(student => {
			newAttendanceCounts[student.studentId] = student.checkInCount || 0
			totalAttendanceCount += (student.checkInCount || 0)
		})

		// 更新签到次数映射
		Object.assign(attendanceCounts.value, newAttendanceCounts)

		// 根据排序方式设置过滤后的学生列表
		if (sortOrder.value === 'attendance') {
			filteredStudents.value = [...students].sort((a, b) => {
				const countA = getStudentAttendanceCountFromCache(a.studentId)
				const countB = getStudentAttendanceCountFromCache(b.studentId)
				return countB - countA
			})
		} else {
			filteredStudents.value = students
		}
	} catch (error) {
		ElMessage.error(error.message || '获取管理学生信息失败')
	} finally {
		loading.value = false
	}
}

const loadAttendanceCounts = async () => {
	const promises = managedStudents.value.map(async student => {
		try {
			const response = await getStudentAttendanceCount(student.studentId)
			if (response.code === 200) {
				attendanceCounts.value[student.studentId] = response.data.count || 0
			}
		} catch (error) {
			attendanceCounts.value[student.studentId] = 0
		}
	})

	await Promise.all(promises)
}

const refreshStudents = () => {
	loadManagedStudents()
}

const goBack = () => {
	router.push('/navigation')
}

const openMakeupDialog = student => {
	makeupSelectedStudent.value = student
	makeupForm.value.attendanceTime = ''
	document.body.style.overflow = 'hidden'
	makeupDialogVisible.value = true
}

const closeMakeupDialog = () => {
	makeupDialogVisible.value = false
	document.body.style.overflow = ''
	makeupSelectedStudent.value = null
	makeupForm.value.attendanceTime = ''
}

const submitMakeup = async () => {
	if (!makeupForm.value.attendanceTime) {
		ElMessage.warning('请选择补卡时间')
		return
	}

	if (!userStore.token) {
		ElMessage.error('请先登录')
		router.push('/login')
		return
	}

	makeupLoading.value = true
	try {
		const response = await makeupAttendance(
			userStore.token,
			makeupSelectedStudent.value.studentId,
			makeupForm.value.attendanceTime
		)

		if (response.code === 200) {
			ElMessage.success('补卡成功')
			closeMakeupDialog()
			await loadAttendanceCounts()
		} else {
			ElMessage.error(response.message || '补卡失败')
		}
	} catch (error) {
		ElMessage.error(error.message || '补卡失败')
	} finally {
		makeupLoading.value = false
	}
}

const openAttendanceRecordsDialog = async student => {
	selectedStudent.value = student

	try {
		attendanceRecordsLoading.value = true
		const response = await getStudentAttendanceRecords(student.studentId)
		if (response.code === 200) {
			studentAttendanceRecords.value = response.data || []
			attendanceRecordsDialogVisible.value = true
			document.body.style.overflow = 'hidden'
		} else {
			ElMessage.error(response.message || '获取考勤记录失败')
		}
	} catch (error) {
		ElMessage.error(`获取考勤记录失败：${error.message}`)
	} finally {
		attendanceRecordsLoading.value = false
	}
}

const closeAttendanceRecordsDialog = () => {
	attendanceRecordsDialogVisible.value = false
	document.body.style.overflow = ''
	selectedStudent.value = null
	studentAttendanceRecords.value = []
}

const openHeatmapDialog = async student => {
	selectedStudent.value = student

	try {
		attendanceRecordsLoading.value = true
		const response = await getStudentAttendanceRecords(student.studentId)
		if (response.code === 200) {
			studentAttendanceRecords.value = response.data || []
			heatmapDialogVisible.value = true
			document.body.style.overflow = 'hidden'

			await nextTick()
			setTimeout(() => {
				initDialogHeatmapChart()
			}, 100)
		} else {
			ElMessage.error(response.message || '获取考勤记录失败')
		}
	} catch (error) {
		ElMessage.error(`获取考勤记录失败：${error.message}`)
	} finally {
		attendanceRecordsLoading.value = false
	}
}

const closeHeatmapDialog = () => {
	heatmapDialogVisible.value = false
	document.body.style.overflow = ''
	selectedStudent.value = null
	studentAttendanceRecords.value = []

	if (heatmapInstance.value) {
		heatmapInstance.value.dispose()
		heatmapInstance.value = null
	}
}

const openTrendChartDialog = async student => {
	selectedStudent.value = student

	try {
		attendanceRecordsLoading.value = true
		const response = await getStudentAttendanceRecords(student.studentId)
		if (response.code === 200) {
			studentAttendanceRecords.value = response.data || []
			trendChartDialogVisible.value = true
			document.body.style.overflow = 'hidden'

			await nextTick()
			setTimeout(() => {
				initDialogLineChart()
			}, 100)
		} else {
			ElMessage.error(response.message || '获取考勤记录失败')
		}
	} catch (error) {
		ElMessage.error(`获取考勤记录失败：${error.message}`)
	} finally {
		attendanceRecordsLoading.value = false
	}
}

const closeTrendChartDialog = () => {
	trendChartDialogVisible.value = false
	document.body.style.overflow = ''
	selectedStudent.value = null
	studentAttendanceRecords.value = []

	if (lineInstance.value) {
		lineInstance.value.dispose()
		lineInstance.value = null
	}
}

const formatAttendanceTime = timeString => {
	if (!timeString) { return '' }
	const date = new Date(timeString)
	return date.toLocaleString('zh-CN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	})
}


const formatCalendarTitle = date => {
	if (!date) { return '2025年9月' }
	const dateObj = new Date(date)
	if (isNaN(dateObj.getTime())) { return '2025年9月' }
	const year = dateObj.getFullYear()
	const month = dateObj.getMonth() + 1
	return `${year}年${month}月`
}

const prevMonth = () => {
	const date = new Date(calendarValue.value)
	date.setMonth(date.getMonth() - 1)
	calendarValue.value = date
}

const nextMonth = () => {
	const date = new Date(calendarValue.value)
	date.setMonth(date.getMonth() + 1)
	calendarValue.value = date
}

const goToday = () => {
	calendarValue.value = new Date()
}

const isTimeSlotSigned = (dateString, timeSlot) => {
	if (!studentAttendanceRecords.value || studentAttendanceRecords.value.length === 0) { return false }

	const targetDate = new Date(dateString)
	const year = targetDate.getFullYear()
	const month = String(targetDate.getMonth() + 1).padStart(2, '0')
	const day = String(targetDate.getDate()).padStart(2, '0')
	const dateStr = `${year}-${month}-${day}`

	return studentAttendanceRecords.value.some(record => {
		const recordDate = new Date(record.attendanceDateTime)
		const recordYear = recordDate.getFullYear()
		const recordMonth = String(recordDate.getMonth() + 1).padStart(2, '0')
		const recordDay = String(recordDate.getDate()).padStart(2, '0')
		const recordDateStr = `${recordYear}-${recordMonth}-${recordDay}`

		if (recordDateStr !== dateStr) { return false }

		const hour = recordDate.getHours()
		if (timeSlot === 'morning' && hour >= 8 && hour < 11) { return true }
		if (timeSlot === 'afternoon' && hour >= 14 && hour < 17) { return true }
		if (timeSlot === 'evening' && hour >= 19 && hour < 22) { return true }

		return false
	})
}


onMounted(async () => {
	if (!userStore.userInfo?.studentId) {
		ElMessage.error('请先登录')
		router.push('/login')
		return
	}

	try {
		const levelResponse = await getStudentLevel(userStore.userInfo.studentId)
		userStore.setStudentLevel(levelResponse.data)

		if (levelResponse.data.levelCode !== 3) {
			ElMessage.error('您没有管理员权限')
			router.push('/navigation')
			return
		}

		loadManagedStudents()

		await nextTick()
		initCharts()
	} catch (error) {
		ElMessage.error('获取用户权限失败')
		router.push('/navigation')
	}

	window.addEventListener('pageshow', event => {
		if (event.persisted) {
			attendanceRecordsDialogVisible.value = false
			makeupDialogVisible.value = false
			document.body.style.overflow = ''
		}
	})
})

const initCharts = () => {
	initHeatmapChart()
	initLineChart()
}

const initDialogHeatmapChart = () => {
	console.log('开始初始化热力图')
	console.log('heatmapDialogChart.value:', heatmapDialogChart.value)
	console.log('容器尺寸:', heatmapDialogChart.value?.offsetWidth, heatmapDialogChart.value?.offsetHeight)

	if (!heatmapDialogChart.value) {
		console.error('热力图容器不存在')
		return
	}

	if (heatmapInstance.value) {
		heatmapInstance.value.dispose()
	}

	try {
		heatmapInstance.value = echarts.init(heatmapDialogChart.value)
		console.log('ECharts实例创建成功')
	} catch (error) {
		console.error('ECharts初始化失败:', error)
		return
	}

	const heatmapData = generateHeatmapData()
	console.log('热力图数据:', heatmapData)
	console.log('考勤记录:', studentAttendanceRecords.value)
	const maxValue = Math.max(...heatmapData.map(item => item[2]), 1)

	const option = {
		backgroundColor: 'transparent',
		tooltip: {
			show: false
		},
		grid: {
			height: '60%',
			top: '15%',
			left: '10%',
			right: '10%',
			bottom: '20%'
		},
		xAxis: {
			type: 'category',
			data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
			splitArea: {
				show: true,
				areaStyle: {
					color: themeStore.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
				}
			},
			axisLabel: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 12
			},
			axisLine: {
				lineStyle: {
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			}
		},
		yAxis: {
			type: 'category',
			data: ['上午', '下午', '晚上'],
			splitArea: {
				show: true,
				areaStyle: {
					color: themeStore.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
				}
			},
			axisLabel: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 12
			},
			axisLine: {
				lineStyle: {
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			}
		},
		visualMap: {
			min: 0,
			max: maxValue,
			calculable: false,
			orient: 'horizontal',
			left: 'center',
			bottom: '5%',
			itemWidth: 20,
			itemHeight: 200,
			textStyle: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 11
			},
			inRange: {
				color: themeStore.isDark
					? ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8']
					: ['#fef3c7', '#fde68a', '#f59e0b', '#d97706', '#b45309', '#92400e']
			}
		},
		series: [{
			name: '签到次数',
			type: 'heatmap',
			data: heatmapData,
			label: {
				show: true,
				color: '#000000',
				fontSize: 10
			},
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}]
	}

	try {
		heatmapInstance.value.setOption(option)
		console.log('热力图配置设置成功')
	} catch (error) {
		console.error('热力图配置设置失败:', error)
	}
}

const initDialogLineChart = () => {
	console.log('开始初始化趋势图')
	console.log('trendDialogChart.value:', trendDialogChart.value)
	console.log('容器尺寸:', trendDialogChart.value?.offsetWidth, trendDialogChart.value?.offsetHeight)

	if (!trendDialogChart.value) {
		console.error('趋势图容器不存在')
		return
	}

	if (lineInstance.value) {
		lineInstance.value.dispose()
	}

	try {
		lineInstance.value = echarts.init(trendDialogChart.value)
		console.log('ECharts实例创建成功')
	} catch (error) {
		console.error('ECharts初始化失败:', error)
		return
	}

	const lineData = generateLineData()
	console.log('趋势图数据:', lineData)
	console.log('考勤记录:', studentAttendanceRecords.value)

	const option = {
		backgroundColor: 'transparent',
		tooltip: {
			trigger: 'axis',
			backgroundColor: themeStore.isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
			borderColor: themeStore.isDark ? '#333' : '#ddd',
			textStyle: {
				color: themeStore.isDark ? '#fff' : '#333'
			},
			formatter(params) {
				const date = params[0].axisValue
				const { value } = params[0]
				return `日期: ${date}<br/>累计签到: ${value}次`
			}
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: lineData.dates,
			axisLabel: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 10,
				rotate: 45
			},
			axisLine: {
				lineStyle: {
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			}
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 12
			},
			axisLine: {
				lineStyle: {
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			},
			splitLine: {
				lineStyle: {
					color: themeStore.isDark ? '#333' : '#eee'
				}
			}
		},
		series: [{
			name: '累计签到次数',
			type: 'line',
			stack: 'Total',
			data: lineData.values,
			smooth: true,
			lineStyle: {
				color: '#50a3ba',
				width: 3
			},
			areaStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [{
						offset: 0, color: 'rgba(80, 163, 186, 0.3)'
					}, {
						offset: 1, color: 'rgba(80, 163, 186, 0.1)'
					}]
				}
			},
			itemStyle: {
				color: '#50a3ba'
			},
			emphasis: {
				focus: 'series'
			}
		}]
	}

	lineInstance.value.setOption(option)
}

const initHeatmapChart = () => {
	if (!heatmapChart.value) { return }

	if (heatmapInstance.value) {
		heatmapInstance.value.dispose()
	}

	heatmapInstance.value = echarts.init(heatmapChart.value)

	const heatmapData = generateHeatmapData()
	const maxValue = Math.max(...heatmapData.map(item => item[2]), 1)

	const option = {
		backgroundColor: 'transparent',
		tooltip: {
			show: false
		},
		grid: {
			height: '60%',
			top: '15%',
			left: '10%',
			right: '10%',
			bottom: '20%'
		},
		xAxis: {
			type: 'category',
			data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
			splitArea: {
				show: true,
				areaStyle: {
					color: themeStore.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
				}
			},
			axisLabel: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 12
			},
			axisLine: {
				lineStyle: {
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			}
		},
		yAxis: {
			type: 'category',
			data: ['上午', '下午', '晚上'],
			splitArea: {
				show: true,
				areaStyle: {
					color: themeStore.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
				}
			},
			axisLabel: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 12
			},
			axisLine: {
				lineStyle: {
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			}
		},
		visualMap: {
			min: 0,
			max: maxValue,
			calculable: false,
			orient: 'horizontal',
			left: 'center',
			bottom: '5%',
			itemWidth: 20,
			itemHeight: 200,
			textStyle: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 11
			},
			inRange: {
				color: themeStore.isDark
					? ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8']
					: ['#fef3c7', '#fde68a', '#f59e0b', '#d97706', '#b45309', '#92400e']
			}
		},
		series: [{
			name: '签到次数',
			type: 'heatmap',
			data: heatmapData,
			label: {
				show: true,
				color: '#000000',
				fontSize: 10
			},
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}]
	}

	heatmapInstance.value.setOption(option)
}

const initLineChart = () => {
	if (!lineChart.value) { return }

	if (lineInstance.value) {
		lineInstance.value.dispose()
	}

	lineInstance.value = echarts.init(lineChart.value)

	const lineData = generateLineData()

	const option = {
		backgroundColor: 'transparent',
		tooltip: {
			trigger: 'axis',
			backgroundColor: themeStore.isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
			borderColor: themeStore.isDark ? '#333' : '#ddd',
			textStyle: {
				color: themeStore.isDark ? '#fff' : '#333'
			},
			formatter(params) {
				const date = params[0].axisValue
				const { value } = params[0]
				return `日期: ${date}<br/>累计签到: ${value}次`
			}
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: lineData.dates,
			axisLabel: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 10,
				rotate: 45
			},
			axisLine: {
				lineStyle: {
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			}
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 12
			},
			axisLine: {
				lineStyle: {
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			},
			splitLine: {
				lineStyle: {
					color: themeStore.isDark ? '#333' : '#eee'
				}
			}
		},
		series: [{
			name: '累计签到次数',
			type: 'line',
			stack: 'Total',
			data: lineData.values,
			smooth: true,
			lineStyle: {
				color: '#50a3ba',
				width: 3
			},
			areaStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [{
						offset: 0, color: 'rgba(80, 163, 186, 0.3)'
					}, {
						offset: 1, color: 'rgba(80, 163, 186, 0.1)'
					}]
				}
			},
			itemStyle: {
				color: '#50a3ba'
			},
			emphasis: {
				focus: 'series'
			}
		}]
	}

	lineInstance.value.setOption(option)
}

const generateLineData = () => {
	const dateMap = new Map()

	studentAttendanceRecords.value.forEach(record => {
		const date = new Date(record.attendanceDateTime)
		const dateStr = date.toISOString().split('T')[0]
		dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1)
	})

	const sortedDates = Array.from(dateMap.keys()).sort()
	const dailyValues = sortedDates.map(date => dateMap.get(date))

	let cumulativeSum = 0
	const cumulativeValues = dailyValues.map(value => {
		cumulativeSum += value
		return cumulativeSum
	})

	return {
		dates: sortedDates,
		values: cumulativeValues
	}
}

const generateHeatmapData = () => {
	const data = []
	const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
	const timeSlots = ['上午', '下午', '晚上']

	weekDays.forEach((day, dayIndex) => {
		timeSlots.forEach((slot, slotIndex) => {
			let count = 0
			studentAttendanceRecords.value.forEach(record => {
				const date = new Date(record.attendanceDateTime)
				const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1
				const hour = date.getHours()

				if (dayOfWeek === dayIndex) {
					if (slot === '上午' && hour >= 8 && hour < 11) { count++ } else if (slot === '下午' && hour >= 14 && hour < 17) { count++ } else if (slot === '晚上' && hour >= 19 && hour < 22) { count++ }
				}
			})
			data.push([dayIndex, slotIndex, count])
		})
	})

	return data
}

watch(() => themeStore.isDark, () => {
	if (heatmapInstance.value) {
		initHeatmapChart()
	}
	if (lineInstance.value) {
		initLineChart()
	}
})

watch(() => studentAttendanceRecords.value, () => {
	if (heatmapInstance.value) {
		initHeatmapChart()
	}
	if (lineInstance.value) {
		initLineChart()
	}
})
</script>

<template>
	<div class="student-manager-container">
		<div class="header">
			<el-button class="back-btn" @click="goBack">
				<el-icon><arrow-left /></el-icon>
				返回导航
			</el-button>
			<div class="header-content">
				<img
					ref="logoRef"
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊学生管理系统"
					class="logo"
					title="切换主题模式"
					@click="toggleTheme"
				/>
				<h1>学生管理</h1>
				<div class="admin-info">
					<div class="admin-details">
						<span class="admin-name">{{ userStore.userInfo?.name || '管理员' }}</span>
						<div class="admin-level">
							<el-icon class="level-icon"><star /></el-icon>
							<span class="level-text">管理员</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="main-content">
			<div class="search-section">
				<el-input
					v-model="searchQuery"
					placeholder="搜索学生姓名、学号或专业..."
					class="search-input"
					clearable
					@input="handleSearch"
					@clear="handleClearSearch"
				>
					<template #prefix>
						<el-icon><search /></el-icon>
					</template>
				</el-input>
				<el-button
					type="primary"
					class="search-btn"
					:icon="Search"
					@click="handleSearch"
				>
					搜索
				</el-button>
			</div>

			<div class="stats-section">
				<div class="stat-card">
					<div class="stat-icon">
						<el-icon size="24"><user /></el-icon>
					</div>
					<div class="stat-content">
						<div class="stat-number">{{ managedStudents.length }}</div>
						<div class="stat-label">管理学生总数</div>
					</div>
				</div>

				<div class="stat-card">
					<div class="stat-icon">
						<el-icon size="24"><calendar /></el-icon>
					</div>
					<div class="stat-content">
						<div class="stat-number">{{ totalAttendanceCount }}</div>
						<div class="stat-label">总签到次数</div>
					</div>
				</div>
			</div>

			<div class="students-section">
				<div class="section-header">
					<h2>管理的学生列表</h2>
					<div class="header-actions">
						<el-button
							type="info"
							:class="{ 'active': sortOrder === 'attendance' }"
							@click="sortByAttendance"
						>
							<el-icon><sort /></el-icon>
							按打卡次数排序
						</el-button>
						<el-button
							type="primary"
							:loading="loading"
							@click="refreshStudents"
						>
							<el-icon><refresh /></el-icon>
							刷新
						</el-button>
					</div>
				</div>

				<div v-if="!loading && filteredStudents.length > 0" class="students-list">
					<div v-for="student in filteredStudents" :key="student.studentId" class="student-card">
						<div class="student-avatar">
							<div class="avatar-section">
								<img
									v-if="getStudentAvatarUrl(student)"
									:src="getStudentAvatarUrl(student)"
									:alt="student.name"
									class="student-avatar-img"
									@error="handleAvatarError"
								/>
								<el-icon v-else size="32"><user /></el-icon>
							</div>
							<div class="attendance-count">
								<el-icon class="attendance-icon"><calendar /></el-icon>
								<span class="count-text">{{ getStudentAttendanceCountFromCache(student.studentId) }}次</span>
							</div>
						</div>
						<div class="student-info">
							<div class="student-name">{{ student.name }}</div>
							<div class="student-details">
								<div class="detail-item">
									<span class="label">学号：</span>
									<span class="value">{{ student.studentId }}</span>
								</div>
								<div class="detail-item">
									<span class="label">年级：</span>
									<span class="value">{{ student.grade }}年级</span>
								</div>
								<div class="detail-item">
									<span class="label">专业：</span>
									<span class="value">{{ student.major }}</span>
								</div>
								<div class="detail-item">
									<span class="label">班级：</span>
									<span class="value">{{ student.classNum }}班</span>
								</div>
								<div class="detail-item">
									<span class="label">性别：</span>
									<span class="value">{{ student.gender }}</span>
								</div>
								<div class="detail-item">
									<span class="label">手机：</span>
									<span class="value">{{ student.phone }}</span>
								</div>
							</div>
						</div>
						<div class="student-actions">
							<div class="attendance-info">
								<div class="action-buttons">
									<el-button
										type="success"
										size="small"
										class="records-btn"
										@click="openAttendanceRecordsDialog(student)"
									>
										<el-icon><calendar /></el-icon>
										考勤记录
									</el-button>
									<el-button
										type="warning"
										size="small"
										class="makeup-btn"
										@click="openMakeupDialog(student)"
									>
										<el-icon><clock /></el-icon>
										补卡
									</el-button>
									<el-button
										type="info"
										size="small"
										class="heatmap-btn"
										@click="openHeatmapDialog(student)"
									>
										<el-icon><star /></el-icon>
										热力图
									</el-button>
									<el-button
										type="primary"
										size="small"
										class="trend-btn"
										@click="openTrendChartDialog(student)"
									>
										<el-icon><trend-charts /></el-icon>
										趋势图
									</el-button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div v-if="!loading && managedStudents.length === 0" class="empty-state">
					<el-icon size="64" class="empty-icon"><user /></el-icon>
					<h3>暂无管理的学生</h3>
					<p>您当前没有管理任何学生</p>
				</div>

				<div v-if="!loading && managedStudents.length > 0 && filteredStudents.length === 0 && searchQuery" class="no-search-results">
					<el-icon size="64" class="empty-icon"><search /></el-icon>
					<h3>未找到匹配的学生</h3>
					<p>请尝试其他关键词或清空搜索条件</p>
				</div>

				<div v-if="loading" class="loading-state">
					<el-icon size="32" class="loading-icon"><loading /></el-icon>
					<p>加载中...</p>
				</div>
			</div>
		</div>

		<el-dialog
			v-if="makeupDialogVisible"
			v-model="makeupDialogVisible"
			:title="null"
			width="90%"
			:close-on-click-modal="false"
			class="makeup-dialog"
			:show-close="false"
			:modal="true"
			:append-to-body="true"
			:teleported="true"
			modal-class="makeup-overlay"
			:destroy-on-close="true"
		>
			<div class="makeup-header">
				<div class="header-icon">
					<el-icon size="28"><clock /></el-icon>
				</div>
				<div class="header-content">
					<h3>学生补卡</h3>
					<p>为指定学生进行补卡操作</p>
				</div>
			</div>

			<div class="makeup-content">
				<div class="student-info-card">
					<div class="student-avatar">
						<el-icon size="36"><user /></el-icon>
					</div>
					<div class="student-details">
						<div class="student-name">{{ makeupSelectedStudent?.name }}</div>
						<div class="student-id">{{ makeupSelectedStudent?.studentId }}</div>
						<div class="student-grade">{{ makeupSelectedStudent?.grade }}年级 · {{ makeupSelectedStudent?.major }}</div>
					</div>
				</div>

				<div class="form-section">
					<div class="form-header">
						<el-icon class="form-icon"><calendar /></el-icon>
						<span class="form-title">选择补卡时间</span>
					</div>
					<div class="form-content">
						<el-date-picker
							v-model="makeupForm.attendanceTime"
							type="datetime"
							placeholder="请选择补卡时间"
							format="YYYY年MM月DD日 HH:mm"
							value-format="YYYY-MM-DDTHH:mm:ss"
							class="datetime-picker"
							:shortcuts="timeShortcuts"
						/>
						<div class="form-tip">
							<el-icon><info-filled /></el-icon>
							<span>补卡时间不受签到时间段限制</span>
						</div>
					</div>
				</div>
			</div>

			<div class="makeup-footer">
				<el-button
					class="cancel-btn"
					size="large"
					@click="closeMakeupDialog"
				>
					取消
				</el-button>
				<el-button
					type="primary"
					:loading="makeupLoading"
					class="submit-btn"
					size="large"
					@click="submitMakeup"
				>
					<el-icon v-if="!makeupLoading"><check /></el-icon>
					{{ makeupLoading ? '处理中...' : '确认补卡' }}
				</el-button>
			</div>
		</el-dialog>

		<el-dialog
			v-if="attendanceRecordsDialogVisible"
			v-model="attendanceRecordsDialogVisible"
			:title="`${selectedStudent?.name} 的考勤记录`"
			width="95%"
			:close-on-click-modal="false"
			class="attendance-records-dialog"
			:modal="true"
			:append-to-body="true"
			:teleported="true"
			modal-class="attendance-records-overlay"
			:destroy-on-close="true"
		>
			<div class="attendance-records-container">
				<div class="records-header">
					<div class="student-info">
						<div class="student-avatar-large">
							{{ selectedStudent?.name?.charAt(0) }}
						</div>
						<div class="student-details">
							<h3>{{ selectedStudent?.name }}</h3>
							<p>学号：{{ selectedStudent?.studentId }}</p>
							<p>专业：{{ selectedStudent?.major }} | 年级：{{ selectedStudent?.grade }}年级</p>
						</div>
					</div>
					<div class="attendance-summary">
						<div class="summary-item">
							<span class="summary-label">总签到次数</span>
							<span class="summary-value">{{ studentAttendanceRecords.length }}</span>
						</div>
					</div>
				</div>

				<div v-if="studentAttendanceRecords.length === 0" class="no-records">
					<el-icon class="no-records-icon"><calendar /></el-icon>
					<p>暂无考勤记录</p>
				</div>
				<div v-else class="calendar-container">
					<el-calendar v-model="calendarValue" class="attendance-calendar">
						<template #header="{ date }">
							<div class="calendar-header">
								<div class="header-title">{{ formatCalendarTitle(date) }}</div>
								<div class="header-actions">
									<el-button size="small" @click="prevMonth">上个月</el-button>
									<el-button size="small" @click="goToday">今天</el-button>
									<el-button size="small" @click="nextMonth">下个月</el-button>
								</div>
							</div>
						</template>
						<template #date-cell="{ data }">
							<div class="calendar-cell-admin">
								<div class="cell-date-admin">{{ data.day.split('-')[2] }}</div>
								<div class="cell-status-admin">
									<div class="time-slot-status-admin">
										<div class="time-slot-admin morning" :class="{ 'signed': isTimeSlotSigned(data.day, 'morning') }">
											<span class="time-label-admin">早</span>
										</div>
										<div class="time-slot-admin afternoon" :class="{ 'signed': isTimeSlotSigned(data.day, 'afternoon') }">
											<span class="time-label-admin">午</span>
										</div>
										<div class="time-slot-admin evening" :class="{ 'signed': isTimeSlotSigned(data.day, 'evening') }">
											<span class="time-label-admin">晚</span>
										</div>
									</div>
								</div>
							</div>
						</template>
					</el-calendar>
					<div class="calendar-legend">
						<div class="legend-item">
							<div class="legend-dot morning"/>
							<span>早上 (8:00-11:00)</span>
						</div>
						<div class="legend-item">
							<div class="legend-dot afternoon"/>
							<span>下午 (14:00-17:00)</span>
						</div>
						<div class="legend-item">
							<div class="legend-dot evening"/>
							<span>晚上 (19:00-22:00)</span>
						</div>
					</div>
				</div>
			</div>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="closeAttendanceRecordsDialog">关闭</el-button>
				</div>
			</template>
		</el-dialog>


		<el-dialog
			v-if="heatmapDialogVisible"
			v-model="heatmapDialogVisible"
			:title="`${selectedStudent?.name} 的签到热力图`"
			width="80%"
			class="heatmap-dialog"
			destroy-on-close
			:close-on-click-modal="false"
			:append-to-body="true"
			:teleported="true"
			modal-class="heatmap-overlay"
			@close="closeHeatmapDialog"
		>
			<div class="heatmap-dialog-content">
				<div v-if="attendanceRecordsLoading" class="loading-container">
					<el-icon class="loading-icon"><loading /></el-icon>
					<p>加载中...</p>
				</div>
				<div v-else-if="studentAttendanceRecords.length === 0" class="no-records">
					<el-icon class="no-records-icon"><calendar /></el-icon>
					<p>暂无考勤记录</p>
				</div>
				<div v-else class="chart-container">
					<div class="chart-item-admin">
						<div class="chart-title-admin">签到热力图</div>
						<div ref="heatmapDialogChart" class="chart-content-admin"/>
					</div>
				</div>
			</div>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="closeHeatmapDialog">关闭</el-button>
				</div>
			</template>
		</el-dialog>

		<el-dialog
			v-if="trendChartDialogVisible"
			v-model="trendChartDialogVisible"
			:title="`${selectedStudent?.name} 的签到趋势图`"
			width="80%"
			class="trend-chart-dialog"
			destroy-on-close
			:close-on-click-modal="false"
			:append-to-body="true"
			:teleported="true"
			modal-class="trend-overlay"
			@close="closeTrendChartDialog"
		>
			<div class="trend-chart-dialog-content">
				<div v-if="attendanceRecordsLoading" class="loading-container">
					<el-icon class="loading-icon"><loading /></el-icon>
					<p>加载中...</p>
				</div>
				<div v-else-if="studentAttendanceRecords.length === 0" class="no-records">
					<el-icon class="no-records-icon"><calendar /></el-icon>
					<p>暂无考勤记录</p>
				</div>
				<div v-else class="chart-container">
					<div class="chart-item-admin">
						<div class="chart-title-admin">签到趋势图</div>
						<div ref="trendDialogChart" class="chart-content-admin"/>
					</div>
				</div>
			</div>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="closeTrendChartDialog">关闭</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<style scoped></style>

