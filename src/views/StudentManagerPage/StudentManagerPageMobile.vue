<script setup>
/**
 * 学生管理页面组件(移动端)
 *
 * @description 管理员端移动端学生管理核心组件，提供学生考勤记录查看、补卡操作、签到热力图/趋势图可视化、
 *              学生信息搜索/排序、主题切换等功能，集成Element Plus组件库和ECharts可视化库
 * @component StudentManagerPageMobile
 * @author 开发团队
 * @date 2026-01
 * @version 1.0.0
 * @dependency element-plus: ^2.0.0, vue: ^3.3.0, echarts: ^5.4.0, vue-router: ^4.2.0
 */

// ======================== 核心依赖导入区 ========================
// Element Plus 核心组件导入
import {
	ElMessage,    // 全局消息提示组件
	ElButton,     // 按钮组件
	ElIcon,       // 图标容器组件
	ElInput,      // 输入框组件
	ElDialog,     // 弹窗组件
	ElDatePicker, // 日期时间选择器组件
	ElCalendar    // 日历组件
} from 'element-plus'

// Vue3 核心组合式API导入
import {
	ref,        // 响应式数据创建
	onMounted,  // 生命周期钩子-组件挂载后
	computed,   // 计算属性创建
	nextTick,   // 异步DOM更新完成回调
	watch       // 响应式数据监听
} from 'vue'

// Element Plus 样式文件导入（按需引入）
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

// Element Plus 图标组件导入
import {
	User,          // 用户图标
	Calendar as CalendarIcon, // 日历图标（重命名避免冲突）
	Star,          // 星星/热力图图标
	Refresh,       // 刷新图标
	Loading,       // 加载中图标
	ArrowLeft,     // 返回箭头图标
	Clock,         // 时钟/补卡图标
	InfoFilled,    // 信息提示图标
	Check,         // 确认勾选图标
	Search,        // 搜索图标
	Sort,          // 排序图标
	TrendCharts    // 趋势图图标
} from '@element-plus/icons-vue'

// Vue Router 路由钩子导入
import { useRouter } from 'vue-router'

// ======================== 业务API导入区 ========================
// 考勤相关接口
import {
	getStudentAttendanceCount,  // 获取学生签到次数
	makeupAttendance,           // 学生补卡操作
	getStudentAttendanceRecords // 获取学生考勤记录列表
} from '@/api/attendance'

// 学生相关接口
import {
	getManagedStudents, // 获取管理员管理的学生列表
	getStudentLevel     // 获取学生/管理员权限等级
} from '@/api/student'

// ======================== 状态管理导入区 ========================
import { useThemeStore } from '@/stores/theme' // 主题状态管理
import { useUserStore } from '@/stores/user'   // 用户状态管理

// ======================== 工具模块导入区 ========================
import StudentManagerPage from '@/views/StudentManagerPage/js/StudentManagerPage' // 学生管理核心逻辑
import StudentManagerPageUtils from '@/views/StudentManagerPage/js/StudentManagerPageUtils' // 工具函数集

// ======================== ECharts 可视化配置区 ========================
// ECharts 核心库导入
import * as echarts from 'echarts/core'
// ECharts 图表类型导入
import { LineChart, HeatmapChart } from 'echarts/charts'
// ECharts 组件导入
import {
	TitleComponent,      // 标题组件
	TooltipComponent,    // 提示框组件
	GridComponent,       // 网格组件
	LegendComponent,     // 图例组件
	VisualMapComponent   // 视觉映射组件（热力图用）
} from 'echarts/components'
// ECharts 渲染器导入
import { CanvasRenderer } from 'echarts/renderers'

// 注册ECharts需要的组件和渲染器
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

// ======================== 响应式数据定义区 ========================
const router = useRouter()                     // 路由实例
const userStore = useUserStore()               // 用户状态实例
const themeStore = useThemeStore()             // 主题状态实例
const managedStudents = ref([])                // 管理员管理的学生列表
const loading = ref(false)                     // 全局加载状态
const searchQuery = ref('')                    // 搜索框输入内容
const filteredStudents = ref([])               // 搜索过滤后的学生列表
const sortOrder = ref('default')               // 排序方式：default-默认 | attendance-按签到次数

// ECharts 实例相关响应式引用
const heatmapChart = ref(null)                 // 热力图容器DOM引用
const lineChart = ref(null)                    // 趋势图容器DOM引用
const heatmapInstance = ref(null)              // 热力图ECharts实例
const lineInstance = ref(null)                 // 趋势图ECharts实例
const heatmapDialogChart = ref(null)           // 弹窗内热力图容器DOM引用
const trendDialogChart = ref(null)             // 弹窗内趋势图容器DOM引用

// 补卡功能相关响应式数据
const attendanceCounts = ref({})               // 学生签到次数缓存 {studentId: count}
const makeupDialogVisible = ref(false)         // 补卡弹窗显示状态
const selectedStudent = ref(null)              // 当前选中的学生对象
const makeupSelectedStudent = ref(null)        // 补卡操作选中的学生对象
const makeupForm = ref({                       // 补卡表单数据
	attendanceTime: ''                           // 补卡时间
})
const makeupLoading = ref(false)               // 补卡操作加载状态

// 考勤记录功能相关响应式数据
const attendanceRecordsDialogVisible = ref(false) // 考勤记录弹窗显示状态
const studentAttendanceRecords = ref([])          // 选中学生的考勤记录列表
const calendarValue = ref(new Date())             // 日历组件当前选中日期
const attendanceRecordsLoading = ref(false)       // 考勤记录加载状态

// 可视化弹窗相关响应式数据
const heatmapDialogVisible = ref(false)       // 热力图弹窗显示状态
const trendChartDialogVisible = ref(false)    // 趋势图弹窗显示状态

// 日期选择器快捷选项配置
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

// ======================== 计算属性定义区 ========================
/**
 * 计算所有学生的总签到次数
 * @returns {number} 总签到次数
 */
const totalAttendanceCount = computed(() => {
	return Object.values(attendanceCounts.value).reduce((sum, count) => sum + count, 0)
})

// ======================== 工具函数定义区 ========================
/**
 * 从缓存中获取学生签到次数
 * @param {string|number} studentId - 学生ID
 * @returns {number} 签到次数（默认0）
 */
const getStudentAttendanceCountFromCache = (studentId) => {
	return attendanceCounts.value[studentId] || 0
}

/**
 * 获取学生头像URL（兼容多字段ID）
 * @param {Object} student - 学生对象
 * @returns {string|null} 头像URL或null
 */
const getStudentAvatarUrl = (student) => {
	console.log('获取头像URL, student:', student)
	console.log('可用的ID字段:', {
		id: student.id,
		studentInfoId: student.studentInfoId,
		studentId: student.studentId,
		infoId: student.infoId,
		databaseId: student.databaseId
	})

	// 尝试多个可能的ID字段名（兼容不同后端返回格式）
	const possibleIds = [
		student.studentInfoId,
		student.id,
		student.infoId,
		student.databaseId
	]

	// 筛选有效ID（非空、非undefined、非空字符串）
	const validId = possibleIds.find(id => id != null && id !== undefined && id !== '')

	if (!validId) {
		console.warn('未找到有效的学生ID:', student)
		return null
	}

	// 调用工具函数生成头像URL
	const url = StudentManagerPageUtils.getStudentAvatarUrl(validId)
	console.log('使用的ID:', validId, '头像URL:', url)
	return url
}

/**
 * 头像加载失败时的处理函数
 * @param {Event} event - 图片加载错误事件
 */
const handleAvatarError = (event) => {
	// 隐藏加载失败的图片
	event.target.style.display = 'none'
	const parent = event.target.parentElement
	if (parent) {
		// 创建默认图标替代
		const icon = document.createElement('i')
		icon.className = 'el-icon'
		parent.appendChild(icon)
	}
}

/**
 * 格式化考勤时间为中文本地化格式
 * @param {string} timeString - 时间字符串（ISO格式）
 * @returns {string} 格式化后的时间字符串
 */
const formatAttendanceTime = (timeString) => {
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

/**
 * 格式化日历标题为"YYYY年MM月"格式
 * @param {Date|string} date - 日期对象/字符串
 * @returns {string} 格式化后的标题字符串
 */
const formatCalendarTitle = (date) => {
	if (!date) { return '2025年9月' }
	const dateObj = new Date(date)
	// 处理无效日期
	if (isNaN(dateObj.getTime())) { return '2025年9月' }
	const year = dateObj.getFullYear()
	const month = dateObj.getMonth() + 1
	return `${year}年${month}月`
}

/**
 * 生成趋势图所需数据（累计签到次数）
 * @returns {Object} {dates: 日期数组, values: 累计值数组}
 */
const generateLineData = () => {
	// 按日期统计每日签到次数
	const dateMap = new Map()
	studentAttendanceRecords.value.forEach(record => {
		const date = new Date(record.attendanceDateTime)
		const dateStr = date.toISOString().split('T')[0]
		dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1)
	})

	// 按日期排序
	const sortedDates = Array.from(dateMap.keys()).sort()
	const dailyValues = sortedDates.map(date => dateMap.get(date))

	// 计算累计签到次数
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

/**
 * 生成热力图所需数据（按周几+时段统计）
 * @returns {Array} 热力图数据 [[周几索引, 时段索引, 次数], ...]
 */
const generateHeatmapData = () => {
	const data = []
	const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
	const timeSlots = ['上午', '下午', '晚上']

	// 遍历所有周几和时段组合
	weekDays.forEach((day, dayIndex) => {
		timeSlots.forEach((slot, slotIndex) => {
			let count = 0
			// 统计该周几+时段的签到次数
			studentAttendanceRecords.value.forEach(record => {
				const date = new Date(record.attendanceDateTime)
				// 转换周日为6（原getDay()返回0），统一为0-6索引
				const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1
				const hour = date.getHours()

				if (dayOfWeek === dayIndex) {
					if (slot === '上午' && hour >= 8 && hour < 11) { count++ }
					else if (slot === '下午' && hour >= 14 && hour < 17) { count++ }
					else if (slot === '晚上' && hour >= 19 && hour < 22) { count++ }
				}
			})
			// 存储[周几索引, 时段索引, 次数]
			data.push([dayIndex, slotIndex, count])
		})
	})

	return data
}

/**
 * 检查指定日期+时段是否已签到
 * @param {string} dateString - 日期字符串
 * @param {string} timeSlot - 时段：morning/afternoon/evening
 * @returns {boolean} 是否签到
 */
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

		// 日期不匹配直接返回false
		if (recordDateStr !== dateStr) { return false }

		// 检查时段匹配
		const hour = recordDate.getHours()
		if (timeSlot === 'morning' && hour >= 8 && hour < 11) { return true }
		if (timeSlot === 'afternoon' && hour >= 14 && hour < 17) { return true }
		if (timeSlot === 'evening' && hour >= 19 && hour < 22) { return true }

		return false
	})
}

// ======================== 事件处理函数区 ========================
/**
 * 切换主题（亮色/暗色）
 */
const toggleTheme = () => {
	themeStore.toggleTheme()
}

/**
 * 处理学生搜索逻辑
 * 支持按姓名、学号、专业、学院搜索，搜索后保持排序状态
 */
const handleSearch = () => {
	// 搜索框为空时，按当前排序方式重置列表
	if (!searchQuery.value.trim()) {
		if (sortOrder.value === 'attendance') {
			filteredStudents.value = [...managedStudents.value].sort((a, b) => {
				const countA = getStudentAttendanceCountFromCache(a.studentId)
				const countB = getStudentAttendanceCountFromCache(b.studentId)
				return countB - countA // 降序排列
			})
		} else {
			filteredStudents.value = managedStudents.value
		}
		return
	}

	// 统一转为小写，实现不区分大小写搜索
	const query = searchQuery.value.toLowerCase().trim()
	let filtered = managedStudents.value.filter(student =>
		student.name.toLowerCase().includes(query) ||
		student.studentId.toString().includes(query) ||
		student.major.toLowerCase().includes(query) ||
		student.college.toLowerCase().includes(query)
	)

	// 搜索后按签到次数排序
	if (sortOrder.value === 'attendance') {
		filtered = filtered.sort((a, b) => {
			const countA = getStudentAttendanceCountFromCache(a.studentId)
			const countB = getStudentAttendanceCountFromCache(b.studentId)
			return countB - countA
		})
	}

	filteredStudents.value = filtered
}

/**
 * 清空搜索框并重置学生列表
 */
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

/**
 * 切换按签到次数排序/恢复默认排序
 */
const sortByAttendance = () => {
	if (sortOrder.value === 'attendance') {
		// 当前是按签到排序，切换为默认排序
		sortOrder.value = 'default'
		filteredStudents.value = [...managedStudents.value]
	} else {
		// 切换为按签到次数降序排序
		sortOrder.value = 'attendance'
		filteredStudents.value = [...managedStudents.value].sort((a, b) => {
			const countA = getStudentAttendanceCountFromCache(a.studentId)
			const countB = getStudentAttendanceCountFromCache(b.studentId)
			return countB - countA
		})
	}
}

/**
 * 加载管理员管理的学生列表
 * 包含权限验证、数据初始化、签到次数缓存、列表初始化
 */
const loadManagedStudents = async () => {
	// 未登录状态拦截
	if (!userStore.token) {
		ElMessage.error('请先登录')
		return
	}

	loading.value = true
	try {
		// 初始化学生管理核心数据
		await StudentManagerPage.initData(userStore.token)

		// 获取处理后的学生数据
		const students = StudentManagerPage.students || []
		managedStudents.value = students

		// 初始化签到次数缓存
		const newAttendanceCounts = {}
		let totalAttendanceCount = 0

		students.forEach(student => {
			newAttendanceCounts[student.studentId] = student.checkInCount || 0
			totalAttendanceCount += (student.checkInCount || 0)
		})

		// 更新签到次数缓存
		Object.assign(attendanceCounts.value, newAttendanceCounts)

		// 根据当前排序方式初始化过滤列表
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

/**
 * 批量加载所有学生的签到次数并更新缓存
 */
const loadAttendanceCounts = async () => {
	// 并行请求所有学生的签到次数
	const promises = managedStudents.value.map(async student => {
		try {
			const response = await getStudentAttendanceCount(student.studentId)
			if (response.code === 200) {
				attendanceCounts.value[student.studentId] = response.data.count || 0
			}
		} catch (error) {
			// 请求失败时默认次数为0
			attendanceCounts.value[student.studentId] = 0
		}
	})

	await Promise.all(promises)
}

/**
 * 刷新学生列表（重新加载数据）
 */
const refreshStudents = () => {
	loadManagedStudents()
}

/**
 * 返回导航页面
 */
const goBack = () => {
	router.push('/navigation')
}

/**
 * 打开补卡弹窗
 * @param {Object} student - 要补卡的学生对象
 */
const openMakeupDialog = (student) => {
	makeupSelectedStudent.value = student
	makeupForm.value.attendanceTime = '' // 重置补卡时间
	document.body.style.overflow = 'hidden' // 防止弹窗滚动穿透
	makeupDialogVisible.value = true
}

/**
 * 关闭补卡弹窗并重置状态
 */
const closeMakeupDialog = () => {
	makeupDialogVisible.value = false
	document.body.style.overflow = '' // 恢复页面滚动
	makeupSelectedStudent.value = null
	makeupForm.value.attendanceTime = ''
}

/**
 * 提交补卡操作
 * 包含表单验证、权限检查、接口调用、结果处理
 */
const submitMakeup = async () => {
	// 表单验证：补卡时间必填
	if (!makeupForm.value.attendanceTime) {
		ElMessage.warning('请选择补卡时间')
		return
	}

	// 权限验证：未登录跳转登录页
	if (!userStore.token) {
		ElMessage.error('请先登录')
		router.push('/login')
		return
	}

	makeupLoading.value = true
	try {
		// 调用补卡接口
		const response = await makeupAttendance(
			userStore.token,
			makeupSelectedStudent.value.studentId,
			makeupForm.value.attendanceTime
		)

		// 接口调用成功处理
		if (response.code === 200) {
			ElMessage.success('补卡成功')
			closeMakeupDialog()
			// 重新加载签到次数缓存
			await loadAttendanceCounts()
		} else {
			ElMessage.error(response.message || '补卡失败')
		}
	} catch (error) {
		// 异常处理
		ElMessage.error(error.message || '补卡失败')
	} finally {
		makeupLoading.value = false
	}
}

/**
 * 打开考勤记录弹窗并加载数据
 * @param {Object} student - 要查看的学生对象
 */
const openAttendanceRecordsDialog = async (student) => {
	selectedStudent.value = student

	try {
		attendanceRecordsLoading.value = true
		// 调用接口获取考勤记录
		const response = await getStudentAttendanceRecords(student.studentId)
		if (response.code === 200) {
			studentAttendanceRecords.value = response.data || []
			attendanceRecordsDialogVisible.value = true
			document.body.style.overflow = 'hidden' // 防止滚动穿透
		} else {
			ElMessage.error(response.message || '获取考勤记录失败')
		}
	} catch (error) {
		ElMessage.error(`获取考勤记录失败：${error.message}`)
	} finally {
		attendanceRecordsLoading.value = false
	}
}

/**
 * 关闭考勤记录弹窗并重置状态
 */
const closeAttendanceRecordsDialog = () => {
	attendanceRecordsDialogVisible.value = false
	document.body.style.overflow = '' // 恢复页面滚动
	selectedStudent.value = null
	studentAttendanceRecords.value = []
}

/**
 * 打开热力图弹窗并加载数据+初始化图表
 * @param {Object} student - 要查看的学生对象
 */
const openHeatmapDialog = async (student) => {
	selectedStudent.value = student

	try {
		attendanceRecordsLoading.value = true
		// 获取考勤记录数据
		const response = await getStudentAttendanceRecords(student.studentId)
		if (response.code === 200) {
			studentAttendanceRecords.value = response.data || []
			heatmapDialogVisible.value = true
			document.body.style.overflow = 'hidden'

			// 等待DOM更新完成后初始化图表
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

/**
 * 关闭热力图弹窗并销毁ECharts实例
 */
const closeHeatmapDialog = () => {
	heatmapDialogVisible.value = false
	document.body.style.overflow = ''
	selectedStudent.value = null
	studentAttendanceRecords.value = []

	// 销毁ECharts实例释放资源
	if (heatmapInstance.value) {
		heatmapInstance.value.dispose()
		heatmapInstance.value = null
	}
}

/**
 * 打开趋势图弹窗并加载数据+初始化图表
 * @param {Object} student - 要查看的学生对象
 */
const openTrendChartDialog = async (student) => {
	selectedStudent.value = student

	try {
		attendanceRecordsLoading.value = true
		// 获取考勤记录数据
		const response = await getStudentAttendanceRecords(student.studentId)
		if (response.code === 200) {
			studentAttendanceRecords.value = response.data || []
			trendChartDialogVisible.value = true
			document.body.style.overflow = 'hidden'

			// 等待DOM更新完成后初始化图表
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

/**
 * 关闭趋势图弹窗并销毁ECharts实例
 */
const closeTrendChartDialog = () => {
	trendChartDialogVisible.value = false
	document.body.style.overflow = ''
	selectedStudent.value = null
	studentAttendanceRecords.value = []

	// 销毁ECharts实例释放资源
	if (lineInstance.value) {
		lineInstance.value.dispose()
		lineInstance.value = null
	}
}

/**
 * 日历组件-切换到上个月
 */
const prevMonth = () => {
	const date = new Date(calendarValue.value)
	date.setMonth(date.getMonth() - 1)
	calendarValue.value = date
}

/**
 * 日历组件-切换到下个月
 */
const nextMonth = () => {
	const date = new Date(calendarValue.value)
	date.setMonth(date.getMonth() + 1)
	calendarValue.value = date
}

/**
 * 日历组件-跳转到今天
 */
const goToday = () => {
	calendarValue.value = new Date()
}

// ======================== ECharts 初始化函数区 ========================
/**
 * 初始化页面内所有图表（热力图+趋势图）
 */
const initCharts = () => {
	initHeatmapChart()
	initLineChart()
}

/**
 * 初始化弹窗内热力图
 */
const initDialogHeatmapChart = () => {
	console.log('开始初始化热力图')
	console.log('heatmapDialogChart.value:', heatmapDialogChart.value)
	console.log('容器尺寸:', heatmapDialogChart.value?.offsetWidth, heatmapDialogChart.value?.offsetHeight)

	// 容器不存在时终止
	if (!heatmapDialogChart.value) {
		console.error('热力图容器不存在')
		return
	}

	// 销毁旧实例避免内存泄漏
	if (heatmapInstance.value) {
		heatmapInstance.value.dispose()
	}

	try {
		// 创建新的ECharts实例
		heatmapInstance.value = echarts.init(heatmapDialogChart.value)
		console.log('ECharts实例创建成功')
	} catch (error) {
		console.error('ECharts初始化失败:', error)
		return
	}

	// 生成热力图数据
	const heatmapData = generateHeatmapData()
	console.log('热力图数据:', heatmapData)
	console.log('考勤记录:', studentAttendanceRecords.value)
	const maxValue = Math.max(...heatmapData.map(item => item[2]), 1)

	// 热力图配置项
	const option = {
		backgroundColor: 'transparent', // 透明背景适配主题
		tooltip: {
			show: false // 关闭提示框
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
				// 适配明暗主题的颜色渐变
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
		// 应用配置项
		heatmapInstance.value.setOption(option)
		console.log('热力图配置设置成功')
	} catch (error) {
		console.error('热力图配置设置失败:', error)
	}
}

/**
 * 初始化弹窗内趋势图
 */
const initDialogLineChart = () => {
	console.log('开始初始化趋势图')
	console.log('trendDialogChart.value:', trendDialogChart.value)
	console.log('容器尺寸:', trendDialogChart.value?.offsetWidth, trendDialogChart.value?.offsetHeight)

	// 容器不存在时终止
	if (!trendDialogChart.value) {
		console.error('趋势图容器不存在')
		return
	}

	// 销毁旧实例避免内存泄漏
	if (lineInstance.value) {
		lineInstance.value.dispose()
	}

	try {
		// 创建新的ECharts实例
		lineInstance.value = echarts.init(trendDialogChart.value)
		console.log('ECharts实例创建成功')
	} catch (error) {
		console.error('ECharts初始化失败:', error)
		return
	}

	// 生成趋势图数据
	const lineData = generateLineData()
	console.log('趋势图数据:', lineData)
	console.log('考勤记录:', studentAttendanceRecords.value)

	// 趋势图配置项
	const option = {
		backgroundColor: 'transparent', // 透明背景
		tooltip: {
			trigger: 'axis',
			// 适配明暗主题的提示框样式
			backgroundColor: themeStore.isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
			borderColor: themeStore.isDark ? '#333' : '#ddd',
			textStyle: {
				color: themeStore.isDark ? '#fff' : '#333'
			},
			// 自定义提示框内容
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
				rotate: 45 // 旋转标签避免重叠
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
			smooth: true, // 平滑曲线
			lineStyle: {
				color: '#50a3ba',
				width: 3
			},
			areaStyle: {
				// 渐变填充
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
				focus: 'series' // 高亮整个系列
			}
		}]
	}

	// 应用配置项
	lineInstance.value.setOption(option)
}

/**
 * 初始化页面内热力图（非弹窗）
 */
const initHeatmapChart = () => {
	if (!heatmapChart.value) { return }

	// 销毁旧实例
	if (heatmapInstance.value) {
		heatmapInstance.value.dispose()
	}

	// 创建新实例
	heatmapInstance.value = echarts.init(heatmapChart.value)

	// 生成数据
	const heatmapData = generateHeatmapData()
	const maxValue = Math.max(...heatmapData.map(item => item[2]), 1)

	// 配置项（同弹窗内热力图）
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

/**
 * 初始化页面内趋势图（非弹窗）
 */
const initLineChart = () => {
	if (!lineChart.value) { return }

	// 销毁旧实例
	if (lineInstance.value) {
		lineInstance.value.dispose()
	}

	// 创建新实例
	lineInstance.value = echarts.init(lineChart.value)

	// 生成数据
	const lineData = generateLineData()

	// 配置项（同弹窗内趋势图）
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

// ======================== 生命周期与监听区 ========================
/**
 * 组件挂载后执行的初始化逻辑
 * 包含：权限验证、数据加载、图表初始化、页面状态恢复
 */
onMounted(async () => {
	// 未登录状态拦截
	if (!userStore.userInfo?.studentId) {
		ElMessage.error('请先登录')
		router.push('/login')
		return
	}

	try {
		// 验证管理员权限
		const levelResponse = await getStudentLevel(userStore.userInfo.studentId)
		userStore.setStudentLevel(levelResponse.data)

		// 非管理员权限拦截
		if (levelResponse.data.levelCode !== 3) {
			ElMessage.error('您没有管理员权限')
			router.push('/navigation')
			return
		}

		// 加载学生列表数据
		loadManagedStudents()

		// 等待DOM更新后初始化图表
		await nextTick()
		initCharts()
	} catch (error) {
		ElMessage.error('获取用户权限失败')
		router.push('/navigation')
	}

	// 监听页面恢复显示事件，重置弹窗状态（解决页面缓存导致的弹窗残留）
	window.addEventListener('pageshow', event => {
		if (event.persisted) {
			attendanceRecordsDialogVisible.value = false
			makeupDialogVisible.value = false
			document.body.style.overflow = ''
		}
	})
})

/**
 * 监听主题变化，重新初始化图表适配主题样式
 */
watch(() => themeStore.isDark, () => {
	if (heatmapInstance.value) {
		initHeatmapChart()
	}
	if (lineInstance.value) {
		initLineChart()
	}
})

/**
 * 监听考勤记录变化，重新初始化图表更新数据
 */
watch(() => studentAttendanceRecords.value, () => {
	if (heatmapInstance.value) {
		initHeatmapChart()
	}
	if (lineInstance.value) {
		initLineChart()
	}
})
</script>

<!-- 
  学生管理页面模板定义(移动端)
  @template StudentManagerPageMobileTemplate
  @description 定义学生管理页面移动端的完整UI结构，包括头部导航、搜索区域、统计卡片、学生列表和各种弹窗
-->
<template>
	<!-- 学生管理页面主容器 -->
	<div class="student-manager-container">
		<!-- 页面头部：包含返回按钮、Logo、标题和管理员信息 -->
		<div class="header">
			<!-- 返回导航按钮：点击返回导航页面 -->
			<el-button class="back-btn" @click="goBack">
				<el-icon><arrow-left /></el-icon>
				返回导航
			</el-button>
			<!-- 头部内容区域：Logo、标题和管理员信息 -->
			<div class="header-content">
				<!-- 系统Logo：点击切换主题模式 -->
				<img
					ref="logoRef"
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊学生管理系统"
					class="logo"
					title="切换主题模式"
					@click="toggleTheme"
				/>
				<!-- 页面标题 -->
				<h1>学生管理</h1>
				<!-- 管理员信息展示 -->
				<div class="admin-info">
					<div class="admin-details">
						<!-- 管理员姓名 -->
						<span class="admin-name">{{ userStore.userInfo?.name || '管理员' }}</span>
						<!-- 管理员等级标识 -->
						<div class="admin-level">
							<el-icon class="level-icon"><star /></el-icon>
							<span class="level-text">管理员</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 主要内容区域：包含搜索、统计和学生列表 -->
		<div class="main-content">
			<!-- 搜索区域：支持按姓名、学号、专业搜索 -->
			<div class="search-section">
				<!-- 搜索输入框：支持实时搜索和清空 -->
				<el-input
					v-model="searchQuery"
					placeholder="搜索学生姓名、学号或专业..."
					class="search-input"
					clearable
					@input="handleSearch"
					@clear="handleClearSearch"
				>
					<template #prefix>
						<!-- 搜索图标 -->
						<el-icon><search /></el-icon>
					</template>
				</el-input>
				<!-- 搜索按钮：手动触发搜索 -->
				<el-button
					type="primary"
					class="search-btn"
					:icon="Search"
					@click="handleSearch"
				>
					搜索
				</el-button>
			</div>

			<!-- 统计卡片区域：展示管理学生总数和总签到次数 -->
			<div class="stats-section">
				<!-- 管理学生总数统计卡片 -->
				<div class="stat-card">
					<div class="stat-icon">
						<el-icon size="24"><user /></el-icon>
					</div>
					<div class="stat-content">
						<!-- 学生总数数字 -->
						<div class="stat-number">{{ managedStudents.length }}</div>
						<!-- 统计标签 -->
						<div class="stat-label">管理学生总数</div>
					</div>
				</div>

				<!-- 总签到次数统计卡片 -->
				<div class="stat-card">
					<div class="stat-icon">
						<el-icon size="24"><calendar /></el-icon>
					</div>
					<div class="stat-content">
						<!-- 签到总次数数字 -->
						<div class="stat-number">{{ totalAttendanceCount }}</div>
						<!-- 统计标签 -->
						<div class="stat-label">总签到次数</div>
					</div>
				</div>
			</div>

			<!-- 学生列表区域：展示所有管理的学生信息 -->
			<div class="students-section">
				<!-- 列表头部：标题和操作按钮 -->
				<div class="section-header">
					<h2>管理的学生列表</h2>
					<!-- 头部操作按钮组 -->
					<div class="header-actions">
						<!-- 按打卡次数排序按钮：切换排序方式 -->
						<el-button
							type="info"
							:class="{ 'active': sortOrder === 'attendance' }"
							@click="sortByAttendance"
						>
							<el-icon><sort /></el-icon>
							按打卡次数排序
						</el-button>
						<!-- 刷新按钮：重新加载学生列表 -->
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

				<!-- 学生列表：展示所有学生卡片（加载完成且有数据时显示） -->
				<div v-if="!loading && filteredStudents.length > 0" class="students-list">
					<!-- 单个学生卡片 -->
					<div v-for="student in filteredStudents" :key="student.studentId" class="student-card">
						<!-- 学生头像区域：显示头像或默认图标和签到次数 -->
						<div class="student-avatar">
							<!-- 头像容器 -->
							<div class="avatar-section">
								<!-- 学生头像图片：加载失败时显示默认图标 -->
								<img
									v-if="getStudentAvatarUrl(student)"
									:src="getStudentAvatarUrl(student)"
									:alt="student.name"
									class="student-avatar-img"
									@error="handleAvatarError"
								/>
								<!-- 默认用户图标：当头像加载失败或不存在时显示 -->
								<el-icon v-else size="32"><user /></el-icon>
							</div>
							<!-- 签到次数显示 -->
							<div class="attendance-count">
								<el-icon class="attendance-icon"><calendar /></el-icon>
								<span class="count-text">{{ getStudentAttendanceCountFromCache(student.studentId) }}次</span>
							</div>
						</div>
						<!-- 学生信息区域：显示学生详细信息 -->
						<div class="student-info">
							<!-- 学生姓名 -->
							<div class="student-name">{{ student.name }}</div>
							<!-- 学生详细信息列表 -->
							<div class="student-details">
								<!-- 学号信息 -->
								<div class="detail-item">
									<span class="label">学号：</span>
									<span class="value">{{ student.studentId }}</span>
								</div>
								<!-- 年级信息 -->
								<div class="detail-item">
									<span class="label">年级：</span>
									<span class="value">{{ student.grade }}年级</span>
								</div>
								<!-- 专业信息 -->
								<div class="detail-item">
									<span class="label">专业：</span>
									<span class="value">{{ student.major }}</span>
								</div>
								<!-- 班级信息 -->
								<div class="detail-item">
									<span class="label">班级：</span>
									<span class="value">{{ student.classNum }}班</span>
								</div>
								<!-- 性别信息 -->
								<div class="detail-item">
									<span class="label">性别：</span>
									<span class="value">{{ student.gender }}</span>
								</div>
								<!-- 手机号信息 -->
								<div class="detail-item">
									<span class="label">手机：</span>
									<span class="value">{{ student.phone }}</span>
								</div>
							</div>
						</div>
						<!-- 学生操作按钮区域：提供考勤记录、补卡、热力图、趋势图等功能 -->
						<div class="student-actions">
							<div class="attendance-info">
								<!-- 操作按钮组 -->
								<div class="action-buttons">
									<!-- 考勤记录按钮：点击打开考勤记录弹窗 -->
									<el-button
										type="success"
										size="small"
										class="records-btn"
										@click="openAttendanceRecordsDialog(student)"
									>
										<el-icon><calendar /></el-icon>
										考勤记录
									</el-button>
									<!-- 补卡按钮：点击打开补卡弹窗 -->
									<el-button
										type="warning"
										size="small"
										class="makeup-btn"
										@click="openMakeupDialog(student)"
									>
										<el-icon><clock /></el-icon>
										补卡
									</el-button>
									<!-- 热力图按钮：点击打开热力图弹窗 -->
									<el-button
										type="info"
										size="small"
										class="heatmap-btn"
										@click="openHeatmapDialog(student)"
									>
										<el-icon><star /></el-icon>
										热力图
									</el-button>
									<!-- 趋势图按钮：点击打开趋势图弹窗 -->
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

				<!-- 空状态：无管理学生时显示 -->
				<div v-if="!loading && managedStudents.length === 0" class="empty-state">
					<!-- 空状态图标 -->
					<el-icon size="64" class="empty-icon"><user /></el-icon>
					<!-- 空状态标题 -->
					<h3>暂无管理的学生</h3>
					<!-- 空状态描述 -->
					<p>您当前没有管理任何学生</p>
				</div>

				<!-- 搜索无结果状态：搜索后无匹配结果时显示 -->
				<div v-if="!loading && managedStudents.length > 0 && filteredStudents.length === 0 && searchQuery" class="no-search-results">
					<!-- 搜索图标 -->
					<el-icon size="64" class="empty-icon"><search /></el-icon>
					<!-- 无结果标题 -->
					<h3>未找到匹配的学生</h3>
					<!-- 无结果描述 -->
					<p>请尝试其他关键词或清空搜索条件</p>
				</div>

				<!-- 加载中状态：数据加载时显示 -->
				<div v-if="loading" class="loading-state">
					<!-- 加载图标 -->
					<el-icon size="32" class="loading-icon"><loading /></el-icon>
					<!-- 加载提示文本 -->
					<p>加载中...</p>
				</div>
			</div>
		</div>

		<!-- 补卡弹窗：为学生进行补卡操作 -->
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
			<!-- 弹窗头部：图标和标题 -->
			<div class="makeup-header">
				<!-- 头部图标 -->
				<div class="header-icon">
					<el-icon size="28"><clock /></el-icon>
				</div>
				<!-- 头部内容：标题和描述 -->
				<div class="header-content">
					<h3>学生补卡</h3>
					<p>为指定学生进行补卡操作</p>
				</div>
			</div>

			<!-- 弹窗内容：学生信息和补卡表单 -->
			<div class="makeup-content">
				<!-- 学生信息卡片：显示选中学生信息 -->
				<div class="student-info-card">
					<!-- 学生头像 -->
					<div class="student-avatar">
						<el-icon size="36"><user /></el-icon>
					</div>
					<!-- 学生详细信息 -->
					<div class="student-details">
						<!-- 学生姓名 -->
						<div class="student-name">{{ makeupSelectedStudent?.name }}</div>
						<!-- 学生学号 -->
						<div class="student-id">{{ makeupSelectedStudent?.studentId }}</div>
						<!-- 学生年级和专业 -->
						<div class="student-grade">{{ makeupSelectedStudent?.grade }}年级 · {{ makeupSelectedStudent?.major }}</div>
					</div>
				</div>

				<!-- 表单区域：补卡时间选择 -->
				<div class="form-section">
					<!-- 表单头部：图标和标题 -->
					<div class="form-header">
						<el-icon class="form-icon"><calendar /></el-icon>
						<span class="form-title">选择补卡时间</span>
					</div>
					<!-- 表单内容：日期时间选择器 -->
					<div class="form-content">
						<!-- 日期时间选择器：支持快捷选项 -->
						<el-date-picker
							v-model="makeupForm.attendanceTime"
							type="datetime"
							placeholder="请选择补卡时间"
							format="YYYY年MM月DD日 HH:mm"
							value-format="YYYY-MM-DDTHH:mm:ss"
							class="datetime-picker"
							:shortcuts="timeShortcuts"
						/>
						<!-- 表单提示信息 -->
						<div class="form-tip">
							<el-icon><info-filled /></el-icon>
							<span>补卡时间不受签到时间段限制</span>
						</div>
					</div>
				</div>
			</div>

			<!-- 弹窗底部：操作按钮 -->
			<div class="makeup-footer">
				<!-- 取消按钮：关闭弹窗 -->
				<el-button
					class="cancel-btn"
					size="large"
					@click="closeMakeupDialog"
				>
					取消
				</el-button>
				<!-- 确认补卡按钮：提交补卡操作 -->
				<el-button
					type="primary"
					:loading="makeupLoading"
					class="submit-btn"
					size="large"
					@click="submitMakeup"
				>
					<!-- 确认图标：加载中时隐藏 -->
					<el-icon v-if="!makeupLoading"><check /></el-icon>
					<!-- 按钮文本：根据加载状态显示不同文本 -->
					{{ makeupLoading ? '处理中...' : '确认补卡' }}
				</el-button>
			</div>
		</el-dialog>

		<!-- 考勤记录弹窗：展示学生考勤记录日历 -->
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
			<!-- 考勤记录容器 -->
			<div class="attendance-records-container">
				<!-- 记录头部：学生信息和签到统计 -->
				<div class="records-header">
					<!-- 学生信息区域 -->
					<div class="student-info">
						<!-- 学生头像大图：显示姓名首字 -->
						<div class="student-avatar-large">
							{{ selectedStudent?.name?.charAt(0) }}
						</div>
						<!-- 学生详细信息 -->
						<div class="student-details">
							<!-- 学生姓名 -->
							<h3>{{ selectedStudent?.name }}</h3>
							<!-- 学生学号 -->
							<p>学号：{{ selectedStudent?.studentId }}</p>
							<!-- 学生专业和年级 -->
							<p>专业：{{ selectedStudent?.major }} | 年级：{{ selectedStudent?.grade }}年级</p>
						</div>
					</div>
					<!-- 签到统计区域 -->
					<div class="attendance-summary">
						<!-- 总签到次数统计项 -->
						<div class="summary-item">
							<span class="summary-label">总签到次数</span>
							<span class="summary-value">{{ studentAttendanceRecords.length }}</span>
						</div>
					</div>
				</div>

				<!-- 无考勤记录状态：当学生没有考勤记录时显示 -->
				<div v-if="studentAttendanceRecords.length === 0" class="no-records">
					<!-- 无记录图标 -->
					<el-icon class="no-records-icon"><calendar /></el-icon>
					<!-- 无记录提示文本 -->
					<p>暂无考勤记录</p>
				</div>
				<!-- 日历展示考勤记录：当有考勤记录时显示 -->
				<div v-else class="calendar-container">
					<!-- 日历组件：展示每月签到情况 -->
					<el-calendar v-model="calendarValue" class="attendance-calendar">
						<!-- 日历头部：自定义标题和操作按钮 -->
						<template #header="{ date }">
							<div class="calendar-header">
								<!-- 日历标题：显示当前年月 -->
								<div class="header-title">{{ formatCalendarTitle(date) }}</div>
								<!-- 日历操作按钮：上个月、今天、下个月 -->
								<div class="header-actions">
									<el-button size="small" @click="prevMonth">上个月</el-button>
									<el-button size="small" @click="goToday">今天</el-button>
									<el-button size="small" @click="nextMonth">下个月</el-button>
								</div>
							</div>
						</template>
						<!-- 日历单元格：自定义日期单元格内容 -->
						<template #date-cell="{ data }">
							<!-- 日历单元格容器 -->
							<div class="calendar-cell-admin">
								<!-- 日期数字 -->
								<div class="cell-date-admin">{{ data.day.split('-')[2] }}</div>
								<!-- 签到状态：显示早、午、晚三个时段的签到情况 -->
								<div class="cell-status-admin">
									<div class="time-slot-status-admin">
										<!-- 早上时段签到状态 -->
										<div class="time-slot-admin morning" :class="{ 'signed': isTimeSlotSigned(data.day, 'morning') }">
											<span class="time-label-admin">早</span>
										</div>
										<!-- 下午时段签到状态 -->
										<div class="time-slot-admin afternoon" :class="{ 'signed': isTimeSlotSigned(data.day, 'afternoon') }">
											<span class="time-label-admin">午</span>
										</div>
										<!-- 晚上时段签到状态 -->
										<div class="time-slot-admin evening" :class="{ 'signed': isTimeSlotSigned(data.day, 'evening') }">
											<span class="time-label-admin">晚</span>
										</div>
									</div>
								</div>
							</div>
						</template>
					</el-calendar>
					<!-- 日历图例：说明各时段的时间范围 -->
					<div class="calendar-legend">
						<!-- 早上时段图例 -->
						<div class="legend-item">
							<div class="legend-dot morning"/>
							<span>早上 (8:00-11:00)</span>
						</div>
						<!-- 下午时段图例 -->
						<div class="legend-item">
							<div class="legend-dot afternoon"/>
							<span>下午 (14:00-17:00)</span>
						</div>
						<!-- 晚上时段图例 -->
						<div class="legend-item">
							<div class="legend-dot evening"/>
							<span>晚上 (19:00-22:00)</span>
						</div>
					</div>
				</div>
			</div>
			<!-- 弹窗底部：关闭按钮 -->
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="closeAttendanceRecordsDialog">关闭</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 热力图弹窗：展示学生签到热力图 -->
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
			<!-- 热力图弹窗内容 -->
			<div class="heatmap-dialog-content">
				<!-- 加载中状态：数据加载时显示 -->
				<div v-if="attendanceRecordsLoading" class="loading-container">
					<!-- 加载图标 -->
					<el-icon class="loading-icon"><loading /></el-icon>
					<!-- 加载提示文本 -->
					<p>加载中...</p>
				</div>
				<!-- 无数据状态：无考勤记录时显示 -->
				<div v-else-if="studentAttendanceRecords.length === 0" class="no-records">
					<!-- 无记录图标 -->
					<el-icon class="no-records-icon"><calendar /></el-icon>
					<!-- 无记录提示文本 -->
					<p>暂无考勤记录</p>
				</div>
				<!-- 热力图容器：展示签到热力图 -->
				<div v-else class="chart-container">
					<!-- 热力图图表项 -->
					<div class="chart-item-admin">
						<!-- 图表标题 -->
						<div class="chart-title-admin">签到热力图</div>
						<!-- 图表内容容器 -->
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

		<!-- 趋势图弹窗 -->
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
				<!-- 加载中状态 -->
				<div v-if="attendanceRecordsLoading" class="loading-container">
					<el-icon class="loading-icon"><loading /></el-icon>
					<p>加载中...</p>
				</div>
				<!-- 无数据状态 -->
				<div v-else-if="studentAttendanceRecords.length === 0" class="no-records">
					<el-icon class="no-records-icon"><calendar /></el-icon>
					<p>暂无考勤记录</p>
				</div>
				<!-- 趋势图容器 -->
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
