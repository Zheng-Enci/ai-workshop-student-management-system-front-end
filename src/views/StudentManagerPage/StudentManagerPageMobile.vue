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
	ElMessage,     // 全局消息提示组件
	ElButton,      // 按钮组件
	ElIcon,        // 图标容器组件
	ElInput,       // 输入框组件
	ElDialog,      // 弹窗组件
	ElCalendar,    // 日历组件
	ElDatePicker,  // 日期时间选择器组件
	ElMessageBox   // 消息确认框组件
} from 'element-plus'

// Vant 组件导入（手机端UI库）- 暂时保留，后续可以移除
// import { Picker as VanPicker, Popup as VanPopup, Toast as VanToast } from 'vant'
// import 'vant/lib/index.css'

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
import 'element-plus/theme-chalk/el-popper.css'
import 'element-plus/theme-chalk/el-date-picker.css'
import 'element-plus/theme-chalk/el-date-picker-panel.css'
import 'element-plus/theme-chalk/el-time-picker.css'
import 'element-plus/theme-chalk/el-scrollbar.css'
import 'element-plus/theme-chalk/el-calendar.css'
import 'element-plus/theme-chalk/el-message-box.css'

// Element Plus 图标组件导入
import {
	User,          // 用户图标
	Calendar,// 日历图标
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
import {useRouter} from 'vue-router'

// ======================== 业务API导入区 ========================
// 考勤相关接口
import {
	getStudentAttendanceCount,  // 获取学生签到次数
	makeupAttendance,           // 学生补卡操作
	getStudentAttendanceRecords // 获取学生考勤记录列表
} from '@/api/attendance'

// 学生相关接口
import {
	getStudentLevel     // 获取学生/管理员权限等级
} from '@/api/student'

// ======================== 状态管理导入区 ========================
import {useThemeStore} from '@/stores/theme' // 主题状态管理
import {useUserStore} from '@/stores/user'   // 用户状态管理

// ======================== 工具模块导入区 ========================
import StudentManagerPage from '@/views/StudentManagerPage/js/StudentManagerPage' // 学生管理核心逻辑
import StudentManagerPageUtils from '@/views/StudentManagerPage/js/StudentManagerPageUtils' // 工具函数集

// ======================== 实例化工具模块 ========================
const studentManagerPageUtils = StudentManagerPageUtils
const studentManagerPage = StudentManagerPage

// ======================== ECharts 可视化配置区 ========================
// ECharts 核心库导入
import * as echarts from 'echarts/core'
// ECharts 图表类型导入
import {LineChart, HeatmapChart} from 'echarts/charts'
// ECharts 组件导入
import {
	TitleComponent,      // 标题组件
	TooltipComponent,    // 提示框组件
	GridComponent,       // 网格组件
	LegendComponent,     // 图例组件
	VisualMapComponent   // 视觉映射组件（热力图用）
} from 'echarts/components'
// ECharts 渲染器导入
import {CanvasRenderer} from 'echarts/renderers'

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
const showMakeupDialog = ref(false)            // 是否显示补卡时间选择对话框
const currentMakeupStudent = ref(null)         // 当前补卡学生对象
const makeupForm = ref({                       // 补卡表单数据
	attendanceTime: ''                           // 补卡时间
})
const makeupLoading = ref(false)               // 补卡操作加载状态
const selectedStudent = ref(null)              // 当前选中的学生对象

/**
 * 确认选择补卡时间
 */
const onMakeupConfirm = () => {
	if (!makeupForm.value.attendanceTime) {
		ElMessage.warning('请选择补卡时间！')
		return
	}

	// 验证时间
	handleMakeupTimeChange(currentMakeupStudent.value, makeupForm.value.attendanceTime)
}

/**
 * 关闭补卡对话框
 */
const closeMakeupDialog = () => {
	showMakeupDialog.value = false
	makeupForm.value.attendanceTime = ''
	currentMakeupStudent.value = null
}

/**
 * 取消选择补卡时间
 */
const onMakeupCancel = () => {
	closeMakeupDialog()
}

/**
 * 打开补卡时间选择对话框
 */
const openDatePicker = (student) => {
	// 设置当前补卡学生
	currentMakeupStudent.value = student
	// 清空补卡时间
	makeupForm.value.attendanceTime = ''
	// 使用 nextTick 确保数据更新
	nextTick(() => {
		// 显示对话框
		showMakeupDialog.value = true
		// 延迟禁用时间选择器输入框
		setTimeout(() => {
			// 禁用时间选择器的输入框
			const timeInputs = document.querySelectorAll('.el-date-picker__editor-wrap .el-input__inner')
			timeInputs.forEach(input => {
				input.setAttribute('readonly', 'true')
				input.setAttribute('inputmode', 'none')
				input.style.pointerEvents = 'none'
			})
		}, 300)
	})
}

// 考勤记录功能相关响应式数据
const attendanceRecordsDialogVisible = ref(false) // 考勤记录弹窗显示状态
const studentAttendanceRecords = ref([])          // 选中学生的考勤记录列表
const calendarValue = ref(new Date())             // 日历组件当前选中日期
const attendanceRecordsLoading = ref(false)       // 考勤记录加载状态

// 可视化弹窗相关响应式数据
const heatmapDialogVisible = ref(false)       // 热力图弹窗显示状态
const trendChartDialogVisible = ref(false)    // 趋势图弹窗显示状态

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
	const validId = possibleIds.find(id => id != null && true && id !== '')

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
	if (!timeString) {
		return ''
	}
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
	if (!date) {
		return '2025年9月'
	}
	const dateObj = new Date(date)
	// 处理无效日期
	if (isNaN(dateObj.getTime())) {
		return '2025年9月'
	}
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
					if (slot === '上午' && hour >= 8 && hour < 11) {
						count++
					} else if (slot === '下午' && hour >= 14 && hour < 17) {
						count++
					} else if (slot === '晚上' && hour >= 19 && hour < 22) {
						count++
					}
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
	if (!studentAttendanceRecords.value || studentAttendanceRecords.value.length === 0) {
		return false
	}

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
		if (recordDateStr !== dateStr) {
			return false
		}

		// 检查时段匹配
		const hour = recordDate.getHours()
		if (timeSlot === 'morning' && hour >= 8 && hour < 11) {
			return true
		}
		if (timeSlot === 'afternoon' && hour >= 14 && hour < 17) {
			return true
		}
		if (timeSlot === 'evening' && hour >= 19 && hour < 22) {
			return true
		}

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
		ElMessage.success('已恢复默认排序')
	} else {
		// 切换为按签到次数降序排序
		sortOrder.value = 'attendance'
		filteredStudents.value = [...managedStudents.value].sort((a, b) => {
			const countA = getStudentAttendanceCountFromCache(a.studentId)
			const countB = getStudentAttendanceCountFromCache(b.studentId)
			return countB - countA
		})
		ElMessage.success('已按打卡次数降序排序')
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
		await studentManagerPage.initData(userStore.token, userStore.userInfo.studentDatabaseTableId)

		// 获取处理后的学生数据
		const students = studentManagerPage.students || []
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
	ElMessage.success('列表已刷新')
}

/**
 * 返回导航页面
 */
const goBack = () => {
	router.push('/navigation')
}



/**
 * 处理补卡时间变化
 * @param {Object} student - 学生对象
 * @param {string} time - 选择的补卡时间
 */
const handleMakeupTimeChange = async (student, time) => {
	// 验证时间：1. 不能超过当前时间  2. 必须在有效签到时间段内
	const selectedTime = new Date(time)
	const currentTime = new Date()

	// 1. 检查补卡时间不能超过当前时间
	if (selectedTime > currentTime) {
		ElMessage.error('补卡时间不能晚于当前时间')
		makeupForm.value.attendanceTime = ''
		showMakeupDialog.value = false
		return
	}

	// 2. 检查补卡时间必须在有效签到时间段内
	const hour = selectedTime.getHours()
	const minute = selectedTime.getMinutes()
	const timeInMinutes = hour * 60 + minute

	// 定义有效签到时间段（分钟数）
	// 早上：08:00-11:00 → 480-660
	// 下午：14:00-17:00 → 840-1020
	// 晚上：19:00-22:00 → 1140-1320
	const validTimeSlots = [
		{ name: '上午', start: 480, end: 660 }, // 08:00-11:00
		{ name: '下午', start: 840, end: 1020 }, // 14:00-17:00
		{ name: '晚上', start: 1140, end: 1320 } // 19:00-22:00
	]

	// 检查所选时间是否在有效签到时间段内
	const isValidTime = validTimeSlots.some(slot =>
		timeInMinutes >= slot.start && timeInMinutes < slot.end
	)

	// 确认补卡
	try {
		let confirmMessage = `确定要为学生 ${student.name} 补卡吗？\n补卡时间：${selectedTime.toLocaleString('zh-CN')}`

		// 如果不在有效签到时间段内，添加提示信息
		if (!isValidTime) {
			confirmMessage += '\n\n⚠️ 警告：补卡时间不在有效签到时间段内（早上 08:00-11:00、下午 14:00-17:00、晚上 19:00-22:00）'
		}

		await ElMessageBox.confirm(
			confirmMessage,
			'确认补卡',
			{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}
		)
	} catch (error) {
		// 用户点击取消
		return
	}

	// 用户点击确定后执行补卡
	try {
		const response = await makeupAttendance(
			userStore.token,
			student.studentId,
			time
		)

		if (response.code === 200) {
			ElMessage.success(`补卡成功：${student.name}`)
			// 重新加载签到次数缓存
			await loadAttendanceCounts()
			// 关闭对话框
			closeMakeupDialog()
		} else {
			ElMessage.error(response.message || '补卡失败')
		}
	} catch (error) {
		ElMessage.error(error.message || '补卡失败')
	}
}

/**
 * 关闭考勤记录弹窗
 */
const closeAttendanceRecordsDialog = () => {
	attendanceRecordsDialogVisible.value = false
	studentAttendanceRecords.value = []
	selectedStudent.value = null
}

/**
 * 打开热力图弹窗
 * @param {Object} student - 要查看的学生对象
 */
const openHeatmapDialog = async (student) => {
	selectedStudent.value = student
	attendanceRecordsLoading.value = true
	try {
		// 调用API获取学生考勤记录
		const response = await getStudentAttendanceRecords(student.studentId)

		if (response.code === 200) {
			// 成功获取考勤记录，更新本地状态
			studentAttendanceRecords.value = response.data.attendanceRecords || []
			heatmapDialogVisible.value = true
			// 在下一个tick后初始化图表
			await nextTick()
			await initializeHeatmapDialogChart()
		} else {
			ElMessage.error(response.message || '获取考勤记录失败')
		}
	} catch (error) {
		ElMessage.error(error.message || '获取考勤记录失败')
	} finally {
		attendanceRecordsLoading.value = false
	}
}

/**
 * 关闭热力图弹窗
 */
const closeHeatmapDialog = () => {
	heatmapDialogVisible.value = false
	studentAttendanceRecords.value = []
	selectedStudent.value = null
	// 销毁图表实例
	if (heatmapInstance.value) {
		heatmapInstance.value.dispose()
		heatmapInstance.value = null
	}
}

/**
 * 打开趋势图弹窗
 * @param {Object} student - 要查看的学生对象
 */
const openTrendChartDialog = async (student) => {
	selectedStudent.value = student
	attendanceRecordsLoading.value = true
	try {
		// 调用API获取学生考勤记录
		const response = await getStudentAttendanceRecords(student.studentId)

		if (response.code === 200) {
			// 成功获取考勤记录，更新本地状态
			studentAttendanceRecords.value = response.data.attendanceRecords || []
			trendChartDialogVisible.value = true
			// 在下一个tick后初始化图表
			await nextTick()
			await initializeTrendDialogChart()
		} else {
			ElMessage.error(response.message || '获取考勤记录失败')
		}
	} catch (error) {
		ElMessage.error(error.message || '获取考勤记录失败')
	} finally {
		attendanceRecordsLoading.value = false
	}
}

/**
 * 关闭趋势图弹窗
 */
const closeTrendChartDialog = () => {
	trendChartDialogVisible.value = false
	studentAttendanceRecords.value = []
	selectedStudent.value = null
	// 销毁图表实例
	if (lineInstance.value) {
		lineInstance.value.dispose()
		lineInstance.value = null
	}
}

/**
 * 初始化弹窗热力图
 * 在DOM更新完成后调用，创建ECharts实例并配置图表
 */
const initializeHeatmapDialogChart = async () => {
	if (!heatmapDialogChart.value) return

	// 销毁现有实例（如果存在）
	if (heatmapInstance.value) {
		heatmapInstance.value.dispose()
	}

	// 创建新的ECharts实例
	heatmapInstance.value = echarts.init(heatmapDialogChart.value)

	// 生成热力图数据
	const heatmapData = generateHeatmapData()

	// 配置图表选项
	const option = {
		title: {
			text: '签到热力图',
			left: 'center',
			textStyle: {
				fontSize: 16,
				fontWeight: 'bold'
			}
		},
		tooltip: {
			position: 'top'
		},
		animation: false,
		grid: {
			height: '50%',
			y: '10%'
		},
		xAxis: {
			type: 'category',
			data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
			splitArea: {
				show: true
			}
		},
		yAxis: {
			type: 'category',
			data: ['上午', '下午', '晚上'],
			splitArea: {
				show: true
			}
		},
		visualMap: {
			min: 0,
			max: Math.max(...heatmapData.map(item => item[2]), 1),
			calculable: true,
			orient: 'horizontal',
			left: 'center',
			bottom: '15%'
		},
		series: [{
			name: '签到次数',
			type: 'heatmap',
			data: heatmapData,
			emphasis: {
				itemStyle: {
					borderColor: '#fff',
					borderWidth: 1
				}
			}
		}]
	}

	// 应用配置并渲染图表
	heatmapInstance.value.setOption(option)

	// 监听窗口大小变化，自动调整图表尺寸
	window.addEventListener('resize', () => {
		if (heatmapInstance.value) {
			heatmapInstance.value.resize()
		}
	})
}

/**
 * 初始化弹窗趋势图
 * 在DOM更新完成后调用，创建ECharts实例并配置图表
 */
const initializeTrendDialogChart = async () => {
	if (!trendDialogChart.value) return

	// 销毁现有实例（如果存在）
	if (lineInstance.value) {
		lineInstance.value.dispose()
	}

	// 创建新的ECharts实例
	lineInstance.value = echarts.init(trendDialogChart.value)

	// 生成趋势图数据
	const lineData = generateLineData()

	// 配置图表选项
	const option = {
		title: {
			text: '签到趋势图',
			left: 'center',
			textStyle: {
				fontSize: 16,
				fontWeight: 'bold'
			}
		},
		tooltip: {
			trigger: 'axis'
		},
		xAxis: {
			type: 'category',
			data: lineData.dates,
			axisLabel: {
				rotate: 45,
				fontSize: 10
			}
		},
		yAxis: {
			type: 'value',
			name: '累计签到次数'
		},
		series: [{
			data: lineData.values,
			type: 'line',
			smooth: true,
			areaStyle: {}
		}]
	}

	// 应用配置并渲染图表
	lineInstance.value.setOption(option)

	// 监听窗口大小变化，自动调整图表尺寸
	window.addEventListener('resize', () => {
		if (lineInstance.value) {
			lineInstance.value.resize()
		}
	})
}

/**
 * 切换到上个月
 * 更新日历组件显示的月份为当前月份的前一个月
 */
const prevMonth = () => {
	const current = new Date(calendarValue.value)
	current.setMonth(current.getMonth() - 1)
	calendarValue.value = current
}

/**
 * 切换到下个月
 * 更新日历组件显示的月份为当前月份的后一个月
 */
const nextMonth = () => {
	const current = new Date(calendarValue.value)
	current.setMonth(current.getMonth() + 1)
	calendarValue.value = current
}

/**
 * 切换到今天
 * 更新日历组件显示的月份为当前月份
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
	console.log('考勤记录:', StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords)
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
	console.log('考勤记录:', StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords)

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
				const {value} = params[0]
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
	if (!heatmapChart.value) {
		return
	}

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
	if (!lineChart.value) {
		return
	}

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
				const {value} = params[0]
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
 * 禁用时间选择器输入框的输入法
 */
const disableTimePickerInputs = () => {
	// 使用 MutationObserver 监听 DOM 变化，动态禁用新增的输入框
	const observer = new MutationObserver(() => {
		const timeInputs = document.querySelectorAll('.el-time-spinner__input')
		timeInputs.forEach(input => {
			input.setAttribute('readonly', 'true')
			input.style.caretColor = 'transparent'
			input.style.pointerEvents = 'none'
			input.setAttribute('inputmode', 'none')
		})
	})

	// 开始观察 body 下的 DOM 变化
	observer.observe(document.body, {
		childList: true,
		subtree: true
	})

	return observer
}

/**
 * 阻止时间选择器输入框的 focus 事件
 */
const preventTimePickerFocus = (event) => {
	const target = event.target
	if (target.classList.contains('el-time-spinner__input')) {
		event.preventDefault()
		target.blur()
	}
}

/**
 * 组件挂载后执行的初始化逻辑
 * 包含：权限验证、数据加载、图表初始化、页面状态恢复
 */
onMounted(async () => {
	// 禁用时间选择器输入框
	disableTimePickerInputs()

	// 监听 focus 事件，阻止时间选择器输入框获得焦点
	document.addEventListener('focus', preventTimePickerFocus, true)

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
			showMakeupDialog.value = false
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
	<!-- ======================== 学生管理页面(移动端) ======================== -->
	<!-- 管理员端移动端学生管理核心页面，提供以下主要功能： -->
	<!-- 1. 学生信息展示与搜索排序 -->
	<!-- 2. 考勤记录查看与补卡操作 -->
	<!-- 3. 签到热力图与趋势图可视化 -->
	<!-- 4. 主题切换与响应式布局 -->

	<!-- 页面头部：包含返回按钮、Logo、标题和管理员信息 -->
	<div class="page-header">
		<div class="page-header-left">
			<!-- 返回导航按钮：点击返回导航页面 -->
			<el-button @click="goBack">
				<el-icon>
					<arrow-left/>
				</el-icon>
			</el-button>
			<!-- 头部内容区域：Logo、标题和管理员信息 -->
			<!-- 系统Logo：点击切换主题模式 -->
			<img
				ref="logoRef"
				src="@/assets/AiWorkShop_icon.png"
				alt="AI坊学生管理系统"
				class="logo"
				title="切换主题模式"
				@click="toggleTheme"
			/>
		</div>
		<!-- 页面标题 -->
		<h1 class="page-header-title">学生管理</h1>
		<!-- 管理员头像 -->
		<div v-if="studentManagerPage.adminStudentAvatarUrl" class="page-header-right">
			<img
				v-lazy="studentManagerPage.adminStudentAvatarUrl"
				alt="管理员头像"
			/>
		</div>
	</div>
	<!-- 搜索区域：支持按姓名、学号、专业搜索 -->
	<div class="search">
		<!-- 搜索输入框：支持实时搜索和清空 -->
		<el-input
			v-model="searchQuery"
			placeholder="搜索学生姓名、学号或专业..."
			clearable
			@input="handleSearch"
			@clear="handleClearSearch"
		>
			<template #prefix>
				<!-- 搜索图标 -->
				<el-icon>
					<search/>
				</el-icon>
			</template>
		</el-input>
	</div>
	<!-- 学生管理页面主容器 -->
	<!-- 主要内容区域：包含搜索、统计和学生列表 -->
	<div class="student-cards">
		<!-- 学生列表区域：展示所有管理的学生信息 -->
		<!-- 列表头部：标题和操作按钮 -->
		<div class="student-cards-header">
			<h2 class="student-cards-header-title">管理的学生列表</h2>
			<!-- 头部操作按钮组 -->
			<div class="student-cards-header-buttons">
				<!-- 按打卡次数排序按钮：切换排序方式 -->
				<el-button
					type="info"
					class = "student-cards-header-buttons-left"
					@click="sortByAttendance"
				>
					<el-icon>
						<sort/>
					</el-icon>
				</el-button>
				<!-- 刷新按钮：重新加载学生列表 -->
				<el-button
					type="primary"
					:loading="loading"
					@click="refreshStudents"
					class = "student-cards-header-buttons-right"
				>
					<el-icon>
						<refresh/>
					</el-icon>
				</el-button>
			</div>
		</div>

		<!-- 学生列表：展示所有学生卡片（加载完成且有数据时显示） -->
		<!-- 学生卡片列表块内容 -->
		<div v-if="!loading && filteredStudents.length > 0" class="student-cards-list">
			<div v-for="student in filteredStudents" :key="student.studentId" class="student-cards-list-item">
				<!-- 学生卡片头部块 -->
				<div class="student-cards-list-item-header">
					<!-- 块1：头像 -->
					<img
						v-if="getStudentAvatarUrl(student)"
						v-lazy="getStudentAvatarUrl(student)"
						:alt="student.name"
						class="student-avatar-img"
						@error="handleAvatarError"
					/>

					<!-- 块2：学号 名字和签到次数 -->
					<div class="student-cards-list-item-header-name--student_id-attendance-count">
						<div>
							<span>姓名：</span>
							<span>{{ student.name }}</span>
						</div>
						<div>
							<span>学号：</span>
							<span>{{ student.studentId }}</span>
						</div>
						<div class="stat-item">
							<span class="label-checkin-count">签到次数：</span>
							<span class="value">{{ student.checkInCount }}次</span>
						</div>
					</div>
				</div>

				<!-- 学生卡片积分块 -->
				<div class="student-cards-list-item-points">
					<div>
						<span>总积分:&nbsp;</span>
						<span>{{ student.points + Math.round(student.checkInCount * 0.64) }}</span>
					</div>

					<div>
						<span>活动积分:&nbsp;</span>
						<span>{{ student.points }}</span>
					</div>
					<div>
						<span>签到积分:&nbsp;</span>
						<span>{{ Math.round(student.checkInCount * 0.64) }}</span>
					</div>
				</div>
				<!-- 学生卡片其他信息块 -->
				<div class="student-cards-list-item-other_info">
					<div>
						<span>年级:&nbsp;</span>
						<span>{{ student.grade }}年级</span>
					</div>
					<div>
						<span>学院:&nbsp;</span>
						<span>{{ student.college }}</span>
					</div>
					<div>
						<span>专业:&nbsp;</span>
						<span>{{ student.major }}</span>
					</div>
					<div>
						<span>班级:&nbsp;</span>
						<span>{{ student.classNum }}班</span>
					</div>
					<div>
						<span>性别:&nbsp;</span>
						<span>{{ student.gender }}</span>
					</div>
					<div>
						<span>手机:&nbsp;</span>
						<span>{{ student.phone }}</span>
					</div>
				</div>
				<!-- 学生卡片按钮块 -->
				<!-- 功能：提供学生操作按钮（补卡、考勤记录） -->
				<!-- 使用Flexbox水平布局排列按钮 -->
				<div class="student-cards-list-item-buttons">
					<!-- 补卡按钮：打开补卡时间选择对话框 -->
					<!-- type="warning": 使用警告色（橙色）按钮 -->
					<!-- size="small": 小尺寸按钮，适合卡片内展示 -->
					<!-- @click: 点击时触发openDatePicker函数，传入当前学生对象 -->
					<el-button
						type="warning"
						size="small"
						@click="openDatePicker(student)"
					>
						<!-- 时钟图标：表示时间选择 -->
						<el-icon>
							<clock/>
						</el-icon>
						补卡
					</el-button>
					<!-- 考勤记录按钮：点击查看学生考勤记录 -->
					<!-- type="success": 使用成功色（绿色）按钮 -->
					<!-- 注意：移动端简化显示，提示前往电脑端查看详细记录 -->
					<el-button
						type="success"
						size="small"
						@click="ElMessage.info('详细考勤记录请前往电脑端查看')"
					>
						<!-- 日历图标：表示考勤记录 -->
						<el-icon>
							<calendar/>
						</el-icon>
						考勤记录
					</el-button>
				</div>
			</div>

			<!-- ======================== 空状态显示区域 ======================== -->
			<!-- 空状态：无管理学生时显示 -->
			<!-- 条件：加载完成、原始学生列表为空 -->
			<div v-if="!loading && managedStudents.length === 0" class="empty-state">
				<!-- 空状态图标：用户图标，尺寸64px -->
				<el-icon size="64" class="empty-icon">
					<user/>
				</el-icon>
				<!-- 空状态标题 -->
				<h3>暂无管理的学生</h3>
				<!-- 空状态描述 -->
				<p>您当前没有管理任何学生</p>
			</div>

			<!-- 搜索无结果状态：搜索后无匹配结果时显示 -->
			<!-- 条件：加载完成、原始列表有数据、搜索后无结果、搜索框有内容 -->
			<div v-if="!loading && managedStudents.length > 0 && filteredStudents.length === 0 && searchQuery"
				 class="no-search-results">
				<!-- 搜索图标：提示搜索相关 -->
				<el-icon size="64" class="empty-icon">
					<search/>
				</el-icon>
				<!-- 无结果标题 -->
				<h3>未找到匹配的学生</h3>
				<!-- 无结果描述 -->
				<p>请尝试其他关键词或清空搜索条件</p>
			</div>

			<!-- 加载中状态：数据加载时显示 -->
			<!-- 条件：loading状态为true -->
			<div v-if="loading" class="loading-state">
				<!-- 加载图标：旋转动画效果 -->
				<el-icon size="32" class="loading-icon">
					<loading/>
				</el-icon>
				<!-- 加载提示文本 -->
				<p>加载中...</p>
			</div>
		</div>

		<!-- ======================== 补卡时间选择对话框 ======================== -->
		<!-- 功能：为学生手动添加补卡记录 -->
		<!-- 宽度：90%以适应移动端屏幕 -->
		<!-- 关闭行为：点击遮罩层可关闭（:close-on-click-modal="true"） -->
		<el-dialog
			v-if="showMakeupDialog"
			v-model="showMakeupDialog"
			title="选择补卡时间"
			width="90%"
			:close-on-click-modal="true"
			:append-to-body="true"
			:teleported="true"
			modal-class="makeup-attendance-overlay"
			class="makeup-attendance-dialog"
			@close="closeMakeupDialog"
		>
			<!-- 补卡表单内容容器 -->
			<div class="makeup-attendance-form">
				<!-- ======================== 日期时间选择器 ======================== -->
				<!-- 功能：选择补卡的年月日时分 -->
				<!-- type="datetime": 日期时间选择器 -->
				<!-- :editable="false": 禁用手动编辑，防止格式错误 -->
				<!-- :clearable="false": 禁用清空，必须选择时间 -->
				<!-- value-format: 返回值格式为YYYY-MM-DDTHH:mm:ss -->
				<!-- inputmode="none": 禁用移动端键盘，只使用弹窗选择 -->
				<el-date-picker
					v-model="makeupForm.attendanceTime"
					type="datetime"
					placeholder="选择日期时间"
					:default-value="new Date()"
					value-format="YYYY-MM-DDTHH:mm:ss"
					:editable="false"
					:clearable="false"
					inputmode="none"
					class="datetime-picker"
					popper-class="makeup-attendance-date-picker-mobile"
					style="width: 100%;"
				></el-date-picker>

				<!-- ======================== 时间段说明 ======================== -->
				<!-- 功能：提示用户有效签到时间段 -->
				<!-- 说明：补卡时间建议在有效签到时间段内 -->
				<div class="time-slot-tips">
					<p>有效签到时间段：</p>
					<p>• 上午：08:00-11:00</p>
					<p>• 下午：14:00-17:00</p>
					<p>• 晚上：19:00-22:00</p>
				</div>
			</div>
			<!-- ======================== 对话框底部按钮 ======================== -->
			<template #footer>
				<div class="dialog-footer">
					<!-- 取消按钮：关闭对话框，不保存 -->
					<el-button @click="onMakeupCancel">取消</el-button>
					<!-- 确认按钮：提交补卡时间，执行补卡操作 -->
					<!-- type="primary": 使用主题色按钮，强调主要操作 -->
					<el-button type="primary" @click="onMakeupConfirm">确认</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- ======================== 考勤记录弹窗 ======================== -->
		<!-- 功能：展示学生考勤记录日历，包含早、午、晚三个时段的签到情况 -->
		<!-- 特性：支持日历视图查看、签到状态显示、图例说明等功能 -->
		<!-- 宽度：95%以适应移动端屏幕 -->
		<!-- 关闭行为：点击模态框不关闭（:close-on-click-modal="false"），确保用户操作安全 -->
		<!-- 生命周期：关闭时销毁组件（:destroy-on-close="true"），避免数据残留 -->
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
				<!-- ======================== 记录头部区域 ======================== -->
				<!-- 功能：显示学生基本信息和签到统计数据 -->
				<div class="records-header">
					<!-- ======================== 学生信息区域 ======================== -->
					<!-- 功能：显示学生头像、姓名、学号、专业、年级等基本信息 -->
					<div class="student-info">
						<!-- 学生头像大图：显示姓名首字作为标识 -->
						<div class="student-avatar-large">
							{{ selectedStudent?.name?.charAt(0) }}
						</div>
						<!-- 学生详细信息：姓名、学号、专业、年级 -->
						<div class="student-details">
							<!-- 学生姓名 -->
							<h3>{{ selectedStudent?.name }}</h3>
							<!-- 学生学号 -->
							<p>学号：{{ selectedStudent?.studentId }}</p>
							<!-- 学生专业和年级 -->
							<p>专业：{{ selectedStudent?.major }} | 年级：{{ selectedStudent?.grade }}年级</p>
						</div>
					</div>

					<!-- ======================== 签到统计区域 ======================== -->
					<!-- 功能：显示学生总签到次数等统计数据 -->
					<div class="attendance-summary">
						<!-- 总签到次数统计项 -->
						<div class="summary-item">
							<!-- 统计标签 -->
							<span class="summary-label">总签到次数</span>
							<!-- 统计数值：若无记录显示0 -->
							<span class="summary-value">{{ studentAttendanceRecords?.length || 0 }}</span>
						</div>
					</div>
				</div>

				<!-- ======================== 无考勤记录状态 ======================== -->
				<!-- 功能：当学生没有考勤记录时显示空状态 -->
				<!-- 条件：studentAttendanceRecords为空或长度为0 -->
				<div v-if="!studentAttendanceRecords || studentAttendanceRecords.length === 0" class="no-records">
					<!-- 无记录图标：日历图标 -->
					<el-icon class="no-records-icon">
						<calendar/>
					</el-icon>
					<!-- 无记录提示文本 -->
					<p>暂无考勤记录</p>
				</div>

				<!-- ======================== 日历展示考勤记录 ======================== -->
				<!-- 功能：当有考勤记录时，使用日历组件展示每月签到情况 -->
				<!-- 日历单元格显示日期和三个时段（早、午、晚）的签到状态 -->
				<!-- 条件：存在考勤记录数据 -->
				<div v-else class="calendar-container">
					<!-- ======================== 日历组件 ======================== -->
					<!-- 功能：展示每月日历，自定义每个日期单元格的内容 -->
					<!-- 绑定：v-model绑定calendarValue响应式变量 -->
					<el-calendar v-model="calendarValue" class="attendance-calendar">
						<!-- ======================== 日历头部插槽 ======================== -->
						<!-- 功能：自定义日历头部，显示当前年月和操作按钮 -->
						<!-- 参数：date - 当前显示的日期 -->
						<template #header="{ date }">
							<div class="calendar-header">
								<!-- 日历标题：显示当前年月 -->
								<!-- 使用formatCalendarTitle函数格式化为"YYYY年MM月" -->
								<div class="header-title">{{ formatCalendarTitle(date) }}</div>
								<!-- 日历操作按钮：上个月、今天、下个月 -->
								<div class="header-actions">
									<!-- 上个月按钮：切换到上个月 -->
									<el-button size="small" @click="prevMonth">上个月</el-button>
									<!-- 今天按钮：快速回到当前月份 -->
									<el-button size="small" @click="goToday">今天</el-button>
									<!-- 下个月按钮：切换到下个月 -->
									<el-button size="small" @click="nextMonth">下个月</el-button>
								</div>
							</div>
						</template>

						<!-- ======================== 日历单元格插槽 ======================== -->
						<!-- 功能：自定义每个日期单元格的内容 -->
						<!-- 参数：data - 包含日期等信息的数据对象 -->
						<!-- 显示：日期数字 + 早/午/晚三个时段的签到状态 -->
						<template #date-cell="{ data }">
							<!-- 日历单元格容器 -->
							<div class="calendar-cell-admin">
								<!-- 日期数字：从data.day中提取日期部分（YYYY-MM-DD -> DD） -->
								<div class="cell-date-admin">{{ data.day.split('-')[2] }}</div>
								<!-- 签到状态：显示早、午、晚三个时段的签到情况 -->
								<!-- 已签到的时段会添加'signed'类名，显示不同颜色 -->
								<div class="cell-status-admin">
									<!-- 时段状态容器 -->
									<div class="time-slot-status-admin">
										<!-- ======================== 早上时段签到状态 ======================== -->
										<!-- 时间范围：8:00-11:00 -->
										<!-- 动态类名：isTimeSlotSigned(data.day, 'morning')返回true时添加signed类 -->
										<div class="time-slot-admin morning"
											 :class="{ 'signed': isTimeSlotSigned(data.day, 'morning') }">
											<!-- 时段标签 -->
											<span class="time-label-admin">早</span>
										</div>

										<!-- ======================== 下午时段签到状态 ======================== -->
										<!-- 时间范围：14:00-17:00 -->
										<!-- 动态类名：isTimeSlotSigned(data.day, 'afternoon')返回true时添加signed类 -->
										<div class="time-slot-admin afternoon"
											 :class="{ 'signed': isTimeSlotSigned(data.day, 'afternoon') }">
											<!-- 时段标签 -->
											<span class="time-label-admin">午</span>
										</div>

										<!-- ======================== 晚上时段签到状态 ======================== -->
										<!-- 时间范围：19:00-22:00 -->
										<!-- 动态类名：isTimeSlotSigned(data.day, 'evening')返回true时添加signed类 -->
										<div class="time-slot-admin evening"
											 :class="{ 'signed': isTimeSlotSigned(data.day, 'evening') }">
											<!-- 时段标签 -->
											<span class="time-label-admin">晚</span>
										</div>
									</div>
								</div>
							</div>
						</template>
					</el-calendar>

					<!-- ======================== 日历图例 ======================== -->
					<!-- 功能：说明各时段的颜色含义和时间范围 -->
					<div class="calendar-legend">
						<!-- 早上时段图例 -->
						<div class="legend-item">
							<!-- 图例圆点：早时段的颜色标识 -->
							<div class="legend-dot morning"/>
							<!-- 图例说明文字 -->
							<span>早上 (8:00-11:00)</span>
						</div>
						<!-- 下午时段图例 -->
						<div class="legend-item">
							<!-- 图例圆点：午时段的颜色标识 -->
							<div class="legend-dot afternoon"/>
							<!-- 图例说明文字 -->
							<span>下午 (14:00-17:00)</span>
						</div>
						<!-- 晚上时段图例 -->
						<div class="legend-item">
							<!-- 图例圆点：晚时段的颜色标识 -->
							<div class="legend-dot evening"/>
							<!-- 图例说明文字 -->
							<span>晚上 (19:00-22:00)</span>
						</div>
					</div>
				</div>
			</div>

			<!-- ======================== 考勤记录弹窗底部 ======================== -->
			<template #footer>
				<div class="dialog-footer">
					<!-- 关闭按钮：关闭考勤记录弹窗 -->
					<el-button @click="closeAttendanceRecordsDialog">关闭</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- ======================== 热力图弹窗 ======================== -->
		<!-- 功能：展示学生签到热力图，直观显示一周内各时段的签到频率 -->
		<!-- 特性：使用颜色深浅表示签到次数多少，颜色越深签到次数越多 -->
		<!-- 宽度：80%以适应移动端屏幕 -->
		<!-- 生命周期：关闭时销毁实例（destroy-on-close），避免内存泄漏 -->
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
			<!-- 热力图弹窗内容容器 -->
			<div class="heatmap-dialog-content">
				<!-- ======================== 加载中状态 ======================== -->
				<!-- 功能：数据加载时显示加载动画 -->
				<!-- 条件：attendanceRecordsLoading为true -->
				<div v-if="attendanceRecordsLoading" class="loading-container">
					<!-- 加载图标：旋转动画 -->
					<el-icon class="loading-icon">
						<loading/>
					</el-icon>
					<!-- 加载提示文本 -->
					<p>加载中...</p>
				</div>

				<!-- ======================== 无数据状态 ======================== -->
				<!-- 功能：无考勤记录时显示空状态 -->
				<!-- 条件：studentAttendanceRecords为空或长度为0 -->
				<div v-else-if="!studentAttendanceRecords || studentAttendanceRecords.length === 0" class="no-records">
					<!-- 无记录图标：日历图标 -->
					<el-icon class="no-records-icon">
						<calendar/>
					</el-icon>
					<!-- 无记录提示文本 -->
					<p>暂无考勤记录</p>
				</div>

				<!-- ======================== 热力图容器 ======================== -->
				<!-- 功能：展示签到热力图 -->
				<!-- 条件：存在考勤记录数据 -->
				<div v-else class="chart-container">
					<!-- 热力图图表项 -->
					<div class="chart-item-admin">
						<!-- 图表标题：说明图表类型 -->
						<div class="chart-title-admin">签到热力图</div>
						<!-- 图表内容容器：ECharts挂载点 -->
						<!-- ref: 挂载ECharts实例的DOM引用 -->
						<div ref="heatmapDialogChart" class="chart-content-admin"/>
					</div>
				</div>
			</div>

			<!-- ======================== 热力图弹窗底部 ======================== -->
			<template #footer>
				<div class="dialog-footer">
					<!-- 关闭按钮：关闭热力图弹窗 -->
					<el-button @click="closeHeatmapDialog">关闭</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- ======================== 趋势图弹窗 ======================== -->
		<!-- 功能：展示学生签到趋势图，显示一段时间内的签到频率变化 -->
		<!-- 特性：使用折线图展示签到次数随时间的变化趋势 -->
		<!-- 用途：支持查看不同时间段的签到趋势，帮助分析学生出勤规律 -->
		<!-- 宽度：80%以适应移动端屏幕 -->
		<!-- 生命周期：关闭时销毁实例（destroy-on-close），避免内存泄漏 -->
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
			<!-- 趋势图弹窗内容容器 -->
			<div class="trend-chart-dialog-content">
				<!-- ======================== 加载中状态 ======================== -->
				<!-- 功能：数据加载时显示加载动画 -->
				<!-- 条件：attendanceRecordsLoading为true -->
				<div v-if="attendanceRecordsLoading" class="loading-container">
					<!-- 加载图标：旋转动画 -->
					<el-icon class="loading-icon">
						<loading/>
					</el-icon>
					<!-- 加载提示文本 -->
					<p>加载中...</p>
				</div>

				<!-- ======================== 无数据状态 ======================== -->
				<!-- 功能：无考勤记录时显示空状态 -->
				<!-- 条件：studentAttendanceRecords为空或长度为0 -->
				<div v-else-if="!studentAttendanceRecords || studentAttendanceRecords.length === 0" class="no-records">
					<!-- 无记录图标：日历图标 -->
					<el-icon class="no-records-icon">
						<calendar/>
					</el-icon>
					<!-- 无记录提示文本 -->
					<p>暂无考勤记录</p>
				</div>

				<!-- ======================== 趋势图容器 ======================== -->
				<!-- 功能：展示签到趋势图 -->
				<!-- 条件：存在考勤记录数据 -->
				<div v-else class="chart-container">
					<!-- 趋势图图表项 -->
					<div class="chart-item-admin">
						<!-- 图表标题：说明图表类型 -->
						<div class="chart-title-admin">签到趋势图</div>
						<!-- 图表内容容器：ECharts挂载点 -->
						<!-- ref: 挂载ECharts实例的DOM引用 -->
						<div ref="trendDialogChart" class="chart-content-admin"/>
					</div>
				</div>
			</div>

			<!-- ======================== 趋势图弹窗底部 ======================== -->
			<template #footer>
				<div class="dialog-footer">
					<!-- 关闭按钮：关闭趋势图弹窗 -->
					<el-button @click="closeTrendChartDialog">关闭</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<!-- ======================== 样式文件导入区 ======================== -->
<!-- 功能：按模块引入独立的CSS样式文件，提高代码可维护性 -->
<!-- 使用scoped限定样式作用域，避免样式污染 -->

<!-- 页面头部样式：包含页面标题、用户信息、主题切换等组件样式 -->
<style scoped src="./css/mobile/StudentManagerPage-PageHeader.css"></style>

<!-- 搜索功能样式：包含搜索框、筛选器、搜索结果等组件样式 -->
<style scoped src="./css/mobile/StudentManagerPage-Search.css"></style>

<!-- 学生卡片样式：包含学生信息卡片、状态显示、交互按钮等组件样式 -->
<style scoped src="./css/mobile/StudentManagerPage-StudentCards.css"></style>

<!-- 日期时间选择器样式：包含补卡功能的日期时间选择器组件样式 -->
<style scoped src="./css/mobile/StudentManagerPage-DatePicker.css"></style>
