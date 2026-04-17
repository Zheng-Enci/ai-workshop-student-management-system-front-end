<script setup lang="ts">
/**
 * 学生管理页面组件(桌面端)
 *
 * @description 管理员管理学生信息页面,包括考勤记录、补卡、热力图、趋势图等功能
 * @component StudentManagerPageDesktop
 * @author AI Workshop
 * @version 1.0.0
 * @since 2024-01-01
 * @see {@link https://github.com/your-repo/student-management-system}
 * @license MIT
 * @summary 提供管理员对学生信息的全面管理功能，包括学生列表展示、考勤记录查看、补卡操作和数据可视化。
 */
import { nextTick, onMounted, ref, watch } from 'vue'
import { ElButton, ElCalendar, ElDatePicker, ElDialog, ElIcon, ElInput, ElMessage, ElMessageBox } from 'element-plus'
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
import {
	ArrowLeft,
	Calendar,
	Clock,
	Loading,
	Refresh,
	Search,
	Sort,
	Star,
	TrendCharts,
	User
} from '@element-plus/icons-vue'

// ECharts 按需引入
import { HeatmapChart, LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useRouter } from 'vue-router'

import { getStudentAttendanceCount, makeupAttendance } from '@/api/attendance'
import { getStudentLevel } from '@/api/student'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import StudentManagerPage from '@/views/StudentManagerPage/js/StudentManagerPage'
import StudentManagerPageAttendance_Records_Dialog
	from '@/views/StudentManagerPage/js/StudentManagerPage-Attendance_Records_Dialog'
import StudentManagerPageStudentAttendanceServer
	from '@/views/StudentManagerPage/js/StudentManagerPageStudentAttendanceServer'
import StudentManagerPageUtils from '@/views/StudentManagerPage/js/StudentManagerPageUtils'

const studentManagerPageUtils = StudentManagerPageUtils
const studentManagerPageStudentAttendanceServer = StudentManagerPageStudentAttendanceServer
import 'element-plus/theme-chalk/el-message-box.css'

const studentManagerPage = StudentManagerPage

// 设置考勤服务实例到 Dialog 类
StudentManagerPageAttendance_Records_Dialog.setStudentAttendanceServer(studentManagerPageStudentAttendanceServer)

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

// ===================== 全局实例初始化 =====================
/**
 * 路由实例
 * @type {Router}
 * @description 用于页面跳转和路由导航
 */
const router = useRouter()
/**
 * 用户状态仓库实例
 * @type {Store}
 * @description 管理用户登录态、用户信息存储
 */
const userStore = useUserStore()
/**
 * 主题状态仓库实例
 * @type {Store}
 * @description 管理应用主题切换(亮色/暗色模式)
 */
const themeStore = useThemeStore()

// ===================== 响应式变量定义区 =====================

/**
 * 管理的学生列表
 * @type {Ref<Array>}
 * @description 存储当前管理员负责管理的所有学生数据
 */
const managedStudents = ref([])
/**
 * 数据加载状态
 * @type {Ref<boolean>}
 * @description 控制数据加载中的状态显示
 */
const loading = ref(false)
/**
 * 搜索关键词
 * @type {Ref<string>}
 * @description 用户输入的搜索关键词,用于筛选学生
 */
const searchQuery = ref('')
/**
 * 筛选后的学生列表
 * @type {Ref<Array>}
 * @description 根据搜索关键词和排序规则筛选后的学生数据列表
 */
const filteredStudents = ref([])
/**
 * 排序方式
 * @type {Ref<string>}
 * @description 学生列表的排序方式:'default'|'attendance'|其他
 */
const sortOrder = ref('default')

// ===================== 图表相关变量 =====================
/**
 * 考勤热力图DOM引用
 * @type {Ref<HTMLElement|null>}
 * @description 考勤热力图的DOM元素引用
 */
const heatmapChart = ref(null)
/**
 * 考勤趋势图DOM引用
 * @type {Ref<HTMLElement|null>}
 * @description 考勤趋势图的DOM元素引用
 */
const lineChart = ref(null)
/**
 * 考勤热力图实例
 * @type {Ref<ECharts|null>}
 * @description ECharts考勤热力图实例
 */
const heatmapInstance = ref(null)
/**
 * 考勤趋势图实例
 * @type {Ref<ECharts|null>}
 * @description ECharts考勤趋势图实例
 */
const lineInstance = ref(null)
/**
 * 弹窗中的热力图DOM引用
 * @type {Ref<HTMLElement|null>}
 * @description 弹窗中显示的考勤热力图的DOM元素引用
 */
const heatmapDialogChart = ref(null)
/**
 * 弹窗中的趋势图DOM引用
 * @type {Ref<HTMLElement|null>}
 * @description 弹窗中显示的考勤趋势图的DOM元素引用
 */
const trendDialogChart = ref(null)

// ===================== 页面操作方法区 =====================
/**
 * 切换主题
 * @function toggleTheme
 * @description 切换应用的明暗主题模式
 */
const toggleTheme = () => {
	themeStore.toggleTheme()
}

// ===================== 学生搜索和排序方法区 =====================
/**
 * 处理搜索操作
 * @function handleSearch
 * @description 根据搜索关键词和排序规则筛选学生列表
 * 如果搜索关键词为空且排序方式为考勤排序,则按考勤次数排序
 * 否则根据搜索关键词进行筛选
 */
const handleSearch = () => {
	// 搜索关键词为空时的处理
	if (!searchQuery.value.trim()) {
		// 如果当前是按考勤排序,则执行考勤排序逻辑
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

/**
 * 清除搜索
 * @function handleClearSearch
 * @description 清空搜索关键词并重置学生列表
 * 如果当前是按考勤排序,则保持排序状态
 */
const handleClearSearch = () => {
	// 清空搜索关键词
	searchQuery.value = ''
	// 根据当前排序方式重置列表
	if (sortOrder.value === 'attendance') {
		// 保持考勤排序
		filteredStudents.value = [...managedStudents.value].sort((a, b) => {
			const countA = getStudentAttendanceCountFromCache(a.studentId)
			const countB = getStudentAttendanceCountFromCache(b.studentId)
			return countB - countA
		})
	} else {
		// 恢复默认列表
		filteredStudents.value = managedStudents.value
	}
}

/**
 * 按考勤次数排序
 * @function sortByAttendance
 * @description 切换考勤排序状态
 * 如果当前已按考勤排序,则切换为默认排序
 * 如果当前是默认排序,则切换为按考勤次数降序排序
 */
const sortByAttendance = () => {
	if (sortOrder.value === 'attendance') {
		// 切换为默认排序
		sortOrder.value = 'default'
		filteredStudents.value = [...managedStudents.value]
	} else {
		// 切换为考勤排序
		sortOrder.value = 'attendance'
		filteredStudents.value = [...managedStudents.value].sort((a, b) => {
			const countA = getStudentAttendanceCountFromCache(a.studentId)
			const countB = getStudentAttendanceCountFromCache(b.studentId)
			return countB - countA // 降序排列
		})
	}
}

// ===================== 补卡功能相关变量 =====================
/**
 * 考勤次数缓存
 * @type {Ref<Object>}
 * @description 存储每个学生的签到次数,格式为{studentId: count}
 * 用于快速获取学生签到次数,避免重复请求API
 */
const attendanceCounts = ref({})
/**
 * 当前选中的学生
 * @type {Ref<Object|null>}
 * @description 存储当前查看详情或进行操作的学生对象
 */
const selectedStudent = ref(null)
/**
 * 当前补卡操作的学生
 * @type {Ref<Object|null>}
 * @description 存储正在进行补卡操作的学生对象
 */
const currentMakeupStudent = ref(null)
/**
 * 补卡表单数据
 * @type {Ref<Object>}
 * @description 存储补卡操作的表单数据
 * @property {string} attendanceTime - 补卡时间
 */
const makeupForm = ref({
	attendanceTime: ''
})
/**
 * 补卡操作加载状态
 * @type {Ref<boolean>}
 * @description 控制补卡操作进行中的状态显示
 */
const makeupLoading = ref(false)
/**
 * 隐藏的日期选择器引用
 * @type {Ref<HTMLElement|null>}
 * @description 日期时间选择器组件的DOM引用,用于程序化触发
 */
const hiddenDatePicker = ref(null)
/**
 * 日期选择器显示状态
 * @type {Ref<boolean>}
 * @description 控制日期时间选择器的显示/隐藏
 */
const showDatePicker = ref(false)

// ===================== 图表弹窗相关变量 =====================
/**
 * 热力图弹窗显示状态
 * @type {Ref<boolean>}
 * @description 控制考勤热力图弹窗的显示/隐藏
 */
const heatmapDialogVisible = ref(false)
/**
 * 趋势图弹窗显示状态
 * @type {Ref<boolean>}
 * @description 控制考勤趋势图弹窗的显示/隐藏
 */
const trendChartDialogVisible = ref(false)

/**
 * 时间快捷选项
 * @type {Array<Object>}
 * @description 日期时间选择器的快捷选项,提供常用时间点快速选择
 * 包含今天和昨天的上午、下午、晚上三个时段
 */
const timeShortcuts = [
	{
		text: '今天上午',
		value: () => {
			const today = new Date()
			today.setHours(9, 0, 0, 0) // 设置为今天上午9点
			return today
		}
	},
	{
		text: '今天下午',
		value: () => {
			const today = new Date()
			today.setHours(15, 0, 0, 0) // 设置为今天下午3点
			return today
		}
	},
	{
		text: '今天晚上',
		value: () => {
			const today = new Date()
			today.setHours(20, 0, 0, 0) // 设置为今天晚上8点
			return today
		}
	},
	{
		text: '昨天上午',
		value: () => {
			const yesterday = new Date()
			yesterday.setDate(yesterday.getDate() - 1) // 设置为昨天
			yesterday.setHours(9, 0, 0, 0) // 设置为昨天上午9点
			return yesterday
		}
	},
	{
		text: '昨天下午',
		value: () => {
			const yesterday = new Date()
			yesterday.setDate(yesterday.getDate() - 1) // 设置为昨天
			yesterday.setHours(15, 0, 0, 0) // 设置为昨天下午3点
			return yesterday
		}
	},
	{
		text: '昨天晚上',
		value: () => {
			const yesterday = new Date()
			yesterday.setDate(yesterday.getDate() - 1) // 设置为昨天
			yesterday.setHours(20, 0, 0, 0) // 设置为昨天晚上8点
			return yesterday
		}
	}
]

// ===================== 工具方法区 =====================
/**
 * 从缓存获取学生签到次数
 * @function getStudentAttendanceCountFromCache
 * @description 从本地缓存中获取学生的签到次数,如果不存在则返回0
 * @param {string|number} studentId - 学生ID
 * @returns {number} 学生的签到次数
 */
const getStudentAttendanceCountFromCache = studentId => attendanceCounts.value[studentId] || 0

/**
 * 获取学生头像URL
 * @function getStudentAvatarUrl
 * @description 根据学生对象获取头像URL
 * 尝试多个可能的ID字段名,找到有效的ID后调用工具函数获取头像URL
 * @param {Object} student - 学生对象
 * @returns {string|null} 头像URL,如果找不到有效ID则返回null
 */
const getStudentAvatarUrl = student => {
	/**
	 * 尝试多个可能的字段名
	 * @description 不同数据源可能使用不同的字段名存储学生数据库ID
	 */
	const possibleIds = [
		student.studentInfoId,
		student.id,
		student.infoId,
		student.databaseId
	]

	// 查找第一个有效的ID(非null、非undefined、非空字符串)
	const validId = possibleIds.find(id => id != null && true && id !== '')

	// 如果找不到有效ID,输出警告并返回null
	if (!validId) {
		console.warn('未找到有效的学生ID:', student)
		return null
	}

	// 使用工具函数获取头像URL
	return studentManagerPageUtils.getStudentAvatarUrl(validId)
}

/**
 * 处理头像加载错误
 * @function handleAvatarError
 * @description 当学生头像加载失败时,隐藏图片并显示默认图标
 * @param {Event} event - 图片加载错误事件对象
 */
const handleAvatarError = event => {
	// 隐藏加载失败的图片
	event.target.style.display = 'none'
	// 获取图片的父元素
	const parent = event.target.parentElement
	if (parent) {
		// 创建默认图标元素
		const icon = document.createElement('i')
		icon.className = 'el-icon'
		// 将图标添加到父元素中
		parent.appendChild(icon)
	}
}

/**
 * 加载管理的学生列表
 * @function loadManagedStudents
 * @description 从API获取管理员负责管理的所有学生数据
 * 流程:
 * 1. 检查用户登录状态
 * 2. 调用业务逻辑类初始化数据
 * 3. 更新学生列表和签到次数缓存
 * 4. 根据排序方式设置过滤后的列表
 * @async
 * @returns {Promise<void>}
 */
const loadManagedStudents = async () => {
	// 检查登录状态
	if (!userStore.token) {
		ElMessage.error('请先登录')
		return
	}

	// 开启加载状态
	loading.value = true
	try {
		/**
		 * 使用 studentManagerPage.initData 初始化数据
		 * @description 调用业务逻辑类的方法,获取并处理学生数据
		 */
		await studentManagerPage.initData(userStore.token, userStore.userInfo.studentDatabaseTableId)

		/**
		 * 获取处理后的学生数据
		 * @description 从业务逻辑类中获取已处理的学生列表
		 */
		const students = studentManagerPage.students || []

		// 更新管理的学生列表
		managedStudents.value = students

		/**
		 * 更新签到次数映射
		 * @description 遍历学生列表,提取每个学生的签到次数并构建映射对象
		 */
		const newAttendanceCounts = {}
		let totalAttendanceCount = 0

		students.forEach(student => {
			newAttendanceCounts[student.studentId] = student.checkInCount || 0
			totalAttendanceCount += (student.checkInCount || 0)
		})

		// 合并到现有的签到次数缓存中
		Object.assign(attendanceCounts.value, newAttendanceCounts)

		/**
		 * 根据排序方式设置过滤后的学生列表
		 * @description 如果当前是按考勤排序,则对列表进行排序
		 */
		if (sortOrder.value === 'attendance') {
			filteredStudents.value = [...students].sort((a, b) => {
				const countA = getStudentAttendanceCountFromCache(a.studentId)
				const countB = getStudentAttendanceCountFromCache(b.studentId)
				return countB - countA // 降序排列
			})
		} else {
			// 默认排序,直接使用原始列表
			filteredStudents.value = students
		}
	} catch (error) {
		// 错误处理:显示错误消息
		ElMessage.error(error.message || '获取管理学生信息失败')
	} finally {
		// 关闭加载状态
		loading.value = false
	}
}

/**
 * 加载所有学生的签到次数
 * @function loadAttendanceCounts
 * @description 并行请求所有学生的签到次数并更新缓存
 * 使用Promise.all并行请求,提升加载效率
 * @async
 * @returns {Promise<void>}
 */
const loadAttendanceCounts = async () => {
	/**
	 * 为每个学生创建签到次数请求Promise
	 * @description 使用map创建Promise数组,实现并行请求
	 */
	const promises = managedStudents.value.map(async student => {
		try {
			// 调用API获取学生签到次数
			const response = await getStudentAttendanceCount(student.studentId)
			if (response.code === 200) {
				// 更新缓存中的签到次数
				attendanceCounts.value[student.studentId] = response.data.count || 0
			}
		} catch (error) {
			// 请求失败时设置为0
			attendanceCounts.value[student.studentId] = 0
		}
	})

	// 等待所有请求完成
	await Promise.all(promises)
}

/**
 * 刷新学生列表
 * @function refreshStudents
 * @description 重新加载管理的学生列表数据
 */
const refreshStudents = () => {
	loadManagedStudents()
}

/**
 * 返回上一页
 * @function goBack
 * @description 点击返回按钮时触发,跳转到导航页面
 */
const goBack = () => {
	router.push('/navigation')
}

/**
 * 打开日期选择器
 * @function openDatePicker
 * @description 打开补卡日期时间选择器
 * 设置当前补卡学生,清空表单,显示选择器,并自动聚焦输入框
 * @param {Object} student - 要进行补卡操作的学生对象
 */
const openDatePicker = student => {
	// 设置当前补卡学生
	currentMakeupStudent.value = student
	// 清空补卡时间
	makeupForm.value.attendanceTime = ''
	// 显示日期选择器
	showDatePicker.value = true

	/**
	 * 延迟聚焦输入框
	 * @description 使用多层延迟确保DOM渲染完成后再聚焦
	 * 第一层延迟50ms等待弹窗显示
	 * 第二层延迟200ms等待日期选择器组件渲染完成
	 */
	setTimeout(() => {
		nextTick(() => {
			setTimeout(() => {
				const picker = hiddenDatePicker.value
				if (picker) {
					/**
					 * 尝试点击输入框
					 * @description 通过DOM查询找到日期选择器的输入框并聚焦
					 * 这样可以自动打开日期选择面板,提升用户体验
					 */
					const inputEl = document.querySelector('.el-date-editor--datetime .el-input__inner')
					if (inputEl) {
						inputEl.click()
						inputEl.focus()
					}
				}
			}, 200)
		})
	}, 50)
}

const handleMakeupTimeChange = async (student, time) => {
	// 验证时间：1. 不能超过当前时间  2. 必须在有效签到时间段内
	const selectedTime = new Date(time)
	const currentTime = new Date()

	// 1. 检查补卡时间不能超过当前时间
	if (selectedTime > currentTime) {
		ElMessage.error('补卡时间不能晚于当前时间')
		makeupForm.value.attendanceTime = ''
		showDatePicker.value = false
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

	if (!isValidTime) {
		ElMessage.error('补卡时间必须在有效签到时间段内（早上 08:00-11:00、下午 14:00-17:00、晚上 19:00-22:00）')
		makeupForm.value.attendanceTime = ''
		showDatePicker.value = false
		return
	}

	// 格式化日期显示
	const dateObj = new Date(time)
	const dateStr = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日`
	const timeStr = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`

	try {
		// 弹出确认对话框
		await ElMessageBox.confirm(
			`您确定要为学生 <strong style="color: #3CBDB1;">${student.name}</strong><br/>补 <strong style="color: #3CBDB1;">${dateStr} ${timeStr}</strong> 的卡吗？`,
			'确认补卡',
			{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'info',
				dangerouslyUseHTMLString: true,
				distinguishCancelAndClose: true
			}
		)

		// 用户点击确定后执行补卡
		makeupLoading.value = true
		const response = await makeupAttendance(
			userStore.token,
			student.studentId,
			time
		)

		if (response.code === 200) {
			ElMessage.success(`补卡成功：${student.name}`)
			await loadAttendanceCounts()
		} else {
			ElMessage.error(response.message || '补卡失败')
		}
	} catch (error) {
		// 用户点击取消或关闭对话框
		if (error !== 'cancel') {
			ElMessage.error(error.message || '补卡失败')
		}
	} finally {
		makeupLoading.value = false
		makeupForm.value.attendanceTime = ''
		showDatePicker.value = false
	}
}

const openHeatmapDialog = async student => {
	selectedStudent.value = student

	try {
		StudentManagerPageAttendance_Records_Dialog.state.attendanceRecordsLoading = true
		const records = await studentManagerPageStudentAttendanceServer.getStudentAttendanceRecords(student.studentId)
		if (records) {
			StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords = records
			heatmapDialogVisible.value = true
			document.body.style.overflow = 'hidden'

			await nextTick()
			setTimeout(() => {
				initDialogHeatmapChart()
			}, 100)
		} else {
			ElMessage.error('获取考勤记录失败')
		}
	} catch (error) {
		ElMessage.error(`获取考勤记录失败：${error.message}`)
	} finally {
		StudentManagerPageAttendance_Records_Dialog.state.attendanceRecordsLoading = false
	}
}

const closeHeatmapDialog = () => {
	heatmapDialogVisible.value = false
	document.body.style.overflow = ''
	selectedStudent.value = null
	StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords = []

	if (heatmapInstance.value) {
		heatmapInstance.value.dispose()
		heatmapInstance.value = null
	}
}

const openTrendChartDialog = async student => {
	selectedStudent.value = student

	try {
		StudentManagerPageAttendance_Records_Dialog.state.attendanceRecordsLoading = true
		const records = await studentManagerPageStudentAttendanceServer.getStudentAttendanceRecords(student.studentId)
		if (records) {
			StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords = records
			trendChartDialogVisible.value = true
			document.body.style.overflow = 'hidden'

			await nextTick()
			setTimeout(() => {
				initDialogLineChart()
			}, 100)
		} else {
			ElMessage.error('获取考勤记录失败')
		}
	} catch (error) {
		ElMessage.error(`获取考勤记录失败：${error.message}`)
	} finally {
		StudentManagerPageAttendance_Records_Dialog.state.attendanceRecordsLoading = false
	}
}

const closeTrendChartDialog = () => {
	trendChartDialogVisible.value = false
	document.body.style.overflow = ''
	selectedStudent.value = null
	StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords = []

	if (lineInstance.value) {
		lineInstance.value.dispose()
		lineInstance.value = null
	}
}

/**
 * 格式化考勤时间
 * @function formatAttendanceTime
 * @description 将ISO时间字符串格式化为中文本地化时间格式
 * 格式: YYYY/MM/DD HH:mm:ss
 * @param {string} timeString - ISO格式的时间字符串
 * @returns {string} 格式化后的时间字符串,空值时返回空字符串
 */
const formatAttendanceTime = timeString => {
	// 空值处理
	if (!timeString) { return '' }
	// 创建Date对象并格式化为中文本地化格式
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
 * 格式化日历标题
 * @function formatCalendarTitle
 * @description 将日期格式化为日历标题格式(年月)
 * 格式: YYYY年MM月
 * @param {Date|string} date - 日期对象或日期字符串
 * @returns {string} 格式化后的年月字符串,无效日期时返回默认值'2025年9月'
 */
const formatCalendarTitle = date => {
	// 空值处理,返回默认值
	if (!date) { return '2025年9月' }
	// 创建Date对象
	const dateObj = new Date(date)
	// 无效日期处理
	if (isNaN(dateObj.getTime())) { return '2025年9月' }
	// 提取年月
	const year = dateObj.getFullYear()
	const month = dateObj.getMonth() + 1
	return `${year}年${month}月`
}

/**
 * 切换到上一个月
 * @function prevMonth
 * @description 将日历显示日期向前移动一个月
 */
const prevMonth = () => {
	const date = new Date(StudentManagerPageAttendance_Records_Dialog.state.calendarValue)
	date.setMonth(date.getMonth() - 1) // 月份减1
	StudentManagerPageAttendance_Records_Dialog.state.calendarValue = date
}

/**
 * 切换到下一个月
 * @function nextMonth
 * @description 将日历显示日期向后移动一个月
 */
const nextMonth = () => {
	const date = new Date(StudentManagerPageAttendance_Records_Dialog.state.calendarValue)
	date.setMonth(date.getMonth() + 1) // 月份加1
	StudentManagerPageAttendance_Records_Dialog.state.calendarValue = date
}

/**
 * 跳转到今天
 * @function goToday
 * @description 将日历显示日期设置为当前日期
 */
const goToday = () => {
	StudentManagerPageAttendance_Records_Dialog.state.calendarValue = new Date()
}


onMounted(async () => {
	if (!userStore.userInfo?.studentId) {
		ElMessage.error('请先登录')
		await router.push('/login')
		return
	}

	try {
		const levelResponse = await getStudentLevel(userStore.userInfo.studentId)
		userStore.setStudentLevel(levelResponse.data)

		if (levelResponse.data.levelCode !== 3) {
			ElMessage.error('您没有管理员权限')
			await router.push('/navigation')
			return
		}

		await loadManagedStudents()

		await nextTick()
		initCharts()
	} catch (error) {
		ElMessage.error('获取用户权限失败')
		await router.push('/navigation')
	}

	window.addEventListener('pageshow', event => {
		if (event.persisted) {
			StudentManagerPageAttendance_Records_Dialog.closeAttendanceRecordsDialog()
		}
	})
})

/**
 * 初始化所有图表
 * @function initCharts
 * @description 初始化页面上的所有ECharts图表
 * 包括热力图和趋势图
 */
const initCharts = () => {
	initHeatmapChart()
	initLineChart()
}

/**
 * 初始化弹窗热力图
 * @function initDialogHeatmapChart
 * @description 初始化在弹窗中显示的考勤热力图
 * 1. 验证DOM容器是否存在
 * 2. 销毁已存在的图表实例
 * 3. 创建新的ECharts实例
 * 4. 生成热力图数据
 * 5. 配置图表选项并应用到实例
 * @returns {void}
 */
const initDialogHeatmapChart = () => {
	console.log('开始初始化热力图')
	console.log('heatmapDialogChart.value:', heatmapDialogChart.value)
	console.log('容器尺寸:', heatmapDialogChart.value?.offsetWidth, heatmapDialogChart.value?.offsetHeight)

	// 验证DOM容器是否存在
	if (!heatmapDialogChart.value) {
		console.error('热力图容器不存在')
		return
	}

	// 如果已有实例,先销毁避免内存泄漏
	if (heatmapInstance.value) {
		heatmapInstance.value.dispose()
	}

	try {
		// 创建ECharts实例
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
	// 计算数据中的最大值,用于配置颜色映射
	const maxValue = Math.max(...heatmapData.map(item => item[2]), 1)

	// 配置热力图选项
	const option = {
		// 设置背景透明
		backgroundColor: 'transparent',
		// 配置提示框
		tooltip: {
			show: false // 弹窗热力图不显示提示框,避免界面过于复杂
		},
		// 配置网格布局
		grid: {
			height: '60%', // 图表高度占容器60%
			top: '15%', // 顶部留白15%
			left: '10%', // 左侧留白10%
			right: '10%', // 右侧留白10%
			bottom: '20%' // 底部留白20%
		},
		// 配置X轴(星期)
		xAxis: {
			type: 'category', // 类目轴
			data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], // 星期数据
			// 分隔区域样式
			splitArea: {
				show: true, // 显示分隔区域
				// 根据主题设置分隔区域颜色
				areaStyle: {
					color: themeStore.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
				}
			},
			// 轴标签样式
			axisLabel: {
				// 根据主题设置标签颜色
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 12 // 标签字体大小
			},
			// 轴线样式
			axisLine: {
				lineStyle: {
					// 根据主题设置轴线颜色
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			}
		},
		// 配置Y轴(时段)
		yAxis: {
			type: 'category', // 类目轴
			data: ['上午', '下午', '晚上'], // 时段数据
			// 分隔区域样式
			splitArea: {
				show: true, // 显示分隔区域
				// 根据主题设置分隔区域颜色
				areaStyle: {
					color: themeStore.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
				}
			},
			// 轴标签样式
			axisLabel: {
				// 根据主题设置标签颜色
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 12 // 标签字体大小
			},
			// 轴线样式
			axisLine: {
				lineStyle: {
					// 根据主题设置轴线颜色
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			}
		},
		// 配置视觉映射组件
		visualMap: {
			min: 0, // 最小值
			max: maxValue, // 最大值
			calculable: false, // 不显示计算手柄
			orient: 'horizontal', // 水平方向
			left: 'center', // 居中显示
			bottom: '5%', // 底部留白5%
			itemWidth: 20, // 图例宽度
			itemHeight: 200, // 图例高度
			// 文字样式
			textStyle: {
				// 根据主题设置文字颜色
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 11 // 文字大小
			},
			// 颜色映射范围
			inRange: {
				// 根据主题设置颜色映射
				color: themeStore.isDark
					? ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'] // 暗色主题颜色
					: ['#fef3c7', '#fde68a', '#f59e0b', '#d97706', '#b45309', '#92400e'] // 亮色主题颜色
			}
		},
		// 配置数据系列
		series: [{
			name: '签到次数', // 系列名称
			type: 'heatmap', // 热力图类型
			data: heatmapData, // 热力图数据
			// 标签配置
			label: {
				show: true, // 显示标签
				color: '#000000', // 标签颜色
				fontSize: 10 // 标签字体大小
			},
			// 高亮状态配置
			emphasis: {
				itemStyle: {
					shadowBlur: 10, // 阴影模糊度
					shadowColor: 'rgba(0, 0, 0, 0.5)' // 阴影颜色
				}
			}
		}]
	}

	// 应用配置到图表实例
	try {
		heatmapInstance.value.setOption(option)
		console.log('热力图配置设置成功')
	} catch (error) {
		console.error('热力图配置设置失败:', error)
	}
}

/**
 * 初始化弹窗趋势图
 * @function initDialogLineChart
 * @description 初始化在弹窗中显示的考勤趋势图
 * 1. 验证DOM容器是否存在
 * 2. 销毁已存在的图表实例
 * 3. 创建新的ECharts实例
 * 4. 生成趋势图数据
 * 5. 配置图表选项并应用到实例
 * @returns {void}
 */
const initDialogLineChart = () => {
	console.log('开始初始化趋势图')
	console.log('trendDialogChart.value:', trendDialogChart.value)
	console.log('容器尺寸:', trendDialogChart.value?.offsetWidth, trendDialogChart.value?.offsetHeight)

	// 验证DOM容器是否存在
	if (!trendDialogChart.value) {
		console.error('趋势图容器不存在')
		return
	}

	// 如果已有实例,先销毁避免内存泄漏
	if (lineInstance.value) {
		lineInstance.value.dispose()
	}

	try {
		// 创建ECharts实例
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

	// 配置趋势图选项
	const option = {
		// 设置背景透明
		backgroundColor: 'transparent',
		// 配置提示框
		tooltip: {
			trigger: 'axis', // 坐标轴触发提示框
			// 根据主题设置提示框背景色
			backgroundColor: themeStore.isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
			// 根据主题设置提示框边框颜色
			borderColor: themeStore.isDark ? '#333' : '#ddd',
			// 根据主题设置提示框文字颜色
			textStyle: {
				color: themeStore.isDark ? '#fff' : '#333'
			},
			// 自定义提示框内容格式
			formatter(params) {
				const date = params[0].axisValue
				const { value } = params[0]
				return `日期: ${date}<br/>累计签到: ${value}次`
			}
		},
		// 配置网格布局
		grid: {
			left: '3%', // 左侧留白3%
			right: '4%', // 右侧留白4%
			bottom: '3%', // 底部留白3%
			containLabel: true // 网格包含坐标轴标签
		},
		// 配置X轴(日期)
		xAxis: {
			type: 'category', // 类目轴
			boundaryGap: false, // 不留边界间隙
			data: lineData.dates, // 日期数据
			// 轴标签样式
			axisLabel: {
				// 根据主题设置标签颜色
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 10, // 标签字体大小
				rotate: 45 // 标签旋转45度避免重叠
			},
			// 轴线样式
			axisLine: {
				lineStyle: {
					// 根据主题设置轴线颜色
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			}
		},
		// 配置Y轴(累计签到次数)
		yAxis: {
			type: 'value', // 数值轴
			// 轴标签样式
			axisLabel: {
				// 根据主题设置标签颜色
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 12 // 标签字体大小
			},
			// 轴线样式
			axisLine: {
				lineStyle: {
					// 根据主题设置轴线颜色
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			},
			// 分割线样式
			splitLine: {
				lineStyle: {
					// 根据主题设置分割线颜色
					color: themeStore.isDark ? '#333' : '#eee'
				}
			}
		},
		// 配置数据系列
		series: [{
			name: '累计签到次数', // 系列名称
			type: 'line', // 折线图类型
			stack: 'Total', // 堆叠图
			data: lineData.values, // 趋势数据
			smooth: true, // 平滑曲线
			// 线条样式
			lineStyle: {
				color: '#50a3ba', // 线条颜色
				width: 3 // 线条宽度
			},
			// 区域填充样式
			areaStyle: {
				// 渐变色配置
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					// 渐变色停止点
					colorStops: [{
						offset: 0, color: 'rgba(80, 163, 186, 0.3)' // 起始颜色
					}, {
						offset: 1, color: 'rgba(80, 163, 186, 0.1)' // 结束颜色
					}]
				}
			},
			// 数据项样式
			itemStyle: {
				color: '#50a3ba' // 数据点颜色
			},
			// 高亮状态配置
			emphasis: {
				focus: 'series' // 高亮整个系列
			}
		}]
	}

	// 应用配置到图表实例
	lineInstance.value.setOption(option)
}

/**
 * 初始化页面热力图
 * @function initHeatmapChart
 * @description 初始化页面主区域的考勤热力图
 * 1. 验证DOM容器是否存在
 * 2. 销毁已存在的图表实例
 * 3. 创建新的ECharts实例
 * 4. 生成热力图数据
 * 5. 配置图表选项并应用到实例
 * @returns {void}
 */
const initHeatmapChart = () => {
	// 验证DOM容器是否存在
	if (!heatmapChart.value) { return }

	// 如果已有实例,先销毁避免内存泄漏
	if (heatmapInstance.value) {
		heatmapInstance.value.dispose()
	}

	// 创建ECharts实例
	heatmapInstance.value = echarts.init(heatmapChart.value)

	// 生成热力图数据
	const heatmapData = generateHeatmapData()
	// 计算数据中的最大值,用于配置颜色映射
	const maxValue = Math.max(...heatmapData.map(item => item[2]), 1)

	// 配置热力图选项
	const option = {
		// 设置背景透明
		backgroundColor: 'transparent',
		// 配置提示框
		tooltip: {
			show: false // 主页面热力图不显示提示框,避免界面过于复杂
		},
		// 配置网格布局
		grid: {
			height: '60%', // 图表高度占容器60%
			top: '15%', // 顶部留白15%
			left: '10%', // 左侧留白10%
			right: '10%', // 右侧留白10%
			bottom: '20%' // 底部留白20%
		},
		// 配置X轴(星期)
		xAxis: {
			type: 'category', // 类目轴
			data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], // 星期数据
			// 分隔区域样式
			splitArea: {
				show: true, // 显示分隔区域
				// 根据主题设置分隔区域颜色
				areaStyle: {
					color: themeStore.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
				}
			},
			// 轴标签样式
			axisLabel: {
				// 根据主题设置标签颜色
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 12 // 标签字体大小
			},
			// 轴线样式
			axisLine: {
				lineStyle: {
					// 根据主题设置轴线颜色
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			}
		},
		// 配置Y轴(时段)
		yAxis: {
			type: 'category', // 类目轴
			data: ['上午', '下午', '晚上'], // 时段数据
			// 分隔区域样式
			splitArea: {
				show: true, // 显示分隔区域
				// 根据主题设置分隔区域颜色
				areaStyle: {
					color: themeStore.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
				}
			},
			// 轴标签样式
			axisLabel: {
				// 根据主题设置标签颜色
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 12 // 标签字体大小
			},
			// 轴线样式
			axisLine: {
				lineStyle: {
					// 根据主题设置轴线颜色
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			}
		},
		// 配置视觉映射组件
		visualMap: {
			min: 0, // 最小值
			max: maxValue, // 最大值
			calculable: false, // 不显示计算手柄
			orient: 'horizontal', // 水平方向
			left: 'center', // 居中显示
			bottom: '5%', // 底部留白5%
			itemWidth: 20, // 图例宽度
			itemHeight: 200, // 图例高度
			// 文字样式
			textStyle: {
				// 根据主题设置文字颜色
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 11 // 文字大小
			},
			// 颜色映射范围
			inRange: {
				// 根据主题设置颜色映射
				color: themeStore.isDark
					? ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'] // 暗色主题颜色
					: ['#fef3c7', '#fde68a', '#f59e0b', '#d97706', '#b45309', '#92400e'] // 亮色主题颜色
			}
		},
		// 配置数据系列
		series: [{
			name: '签到次数', // 系列名称
			type: 'heatmap', // 热力图类型
			data: heatmapData, // 热力图数据
			// 标签配置
			label: {
				show: true, // 显示标签
				color: '#000000', // 标签颜色
				fontSize: 10 // 标签字体大小
			},
			// 高亮状态配置
			emphasis: {
				itemStyle: {
					shadowBlur: 10, // 阴影模糊度
					shadowColor: 'rgba(0, 0, 0, 0.5)' // 阴影颜色
				}
			}
		}]
	}

	// 应用配置到图表实例
	heatmapInstance.value.setOption(option)
}

/**
 * 初始化页面趋势图
 * @function initLineChart
 * @description 初始化页面主区域的考勤趋势图
 * 1. 验证DOM容器是否存在
 * 2. 销毁已存在的图表实例
 * 3. 创建新的ECharts实例
 * 4. 生成趋势图数据
 * 5. 配置图表选项并应用到实例
 * @returns {void}
 */
const initLineChart = () => {
	// 验证DOM容器是否存在
	if (!lineChart.value) { return }

	// 如果已有实例,先销毁避免内存泄漏
	if (lineInstance.value) {
		lineInstance.value.dispose()
	}

	// 创建ECharts实例
	lineInstance.value = echarts.init(lineChart.value)

	// 生成趋势图数据
	const lineData = generateLineData()

	// 配置趋势图选项
	const option = {
		// 设置背景透明
		backgroundColor: 'transparent',
		// 配置提示框
		tooltip: {
			trigger: 'axis', // 坐标轴触发提示框
			// 根据主题设置提示框背景色
			backgroundColor: themeStore.isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
			// 根据主题设置提示框边框颜色
			borderColor: themeStore.isDark ? '#333' : '#ddd',
			// 根据主题设置提示框文字颜色
			textStyle: {
				color: themeStore.isDark ? '#fff' : '#333'
			},
			// 自定义提示框内容格式
			formatter(params) {
				const date = params[0].axisValue
				const { value } = params[0]
				return `日期: ${date}<br/>累计签到: ${value}次`
			}
		},
		// 配置网格布局
		grid: {
			left: '3%', // 左侧留白3%
			right: '4%', // 右侧留白4%
			bottom: '3%', // 底部留白3%
			containLabel: true // 网格包含坐标轴标签
		},
		// 配置X轴(日期)
		xAxis: {
			type: 'category', // 类目轴
			boundaryGap: false, // 不留边界间隙
			data: lineData.dates, // 日期数据
			// 轴标签样式
			axisLabel: {
				// 根据主题设置标签颜色
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 10, // 标签字体大小
				rotate: 45 // 标签旋转45度避免重叠
			},
			// 轴线样式
			axisLine: {
				lineStyle: {
					// 根据主题设置轴线颜色
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			}
		},
		// 配置Y轴(累计签到次数)
		yAxis: {
			type: 'value', // 数值轴
			// 轴标签样式
			axisLabel: {
				// 根据主题设置标签颜色
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 12 // 标签字体大小
			},
			// 轴线样式
			axisLine: {
				lineStyle: {
					// 根据主题设置轴线颜色
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			},
			// 分割线样式
			splitLine: {
				lineStyle: {
					// 根据主题设置分割线颜色
					color: themeStore.isDark ? '#333' : '#eee'
				}
			}
		},
		// 配置数据系列
		series: [{
			name: '累计签到次数', // 系列名称
			type: 'line', // 折线图类型
			stack: 'Total', // 堆叠图
			data: lineData.values, // 趋势数据
			smooth: true, // 平滑曲线
			// 线条样式
			lineStyle: {
				color: '#50a3ba', // 线条颜色
				width: 3 // 线条宽度
			},
			// 区域填充样式
			areaStyle: {
				// 渐变色配置
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					// 渐变色停止点
					colorStops: [{
						offset: 0, color: 'rgba(80, 163, 186, 0.3)' // 起始颜色
					}, {
						offset: 1, color: 'rgba(80, 163, 186, 0.1)' // 结束颜色
					}]
				}
			},
			// 数据项样式
			itemStyle: {
				color: '#50a3ba' // 数据点颜色
			},
			// 高亮状态配置
			emphasis: {
				focus: 'series' // 高亮整个系列
			}
		}]
	}

	// 应用配置到图表实例
	lineInstance.value.setOption(option)
}

/**
 * 生成趋势图数据
 * @function generateLineData
 * @description 根据考勤记录生成趋势图所需的数据
 * 计算每日签到次数和累计签到次数
 * @returns {Object} 包含日期数组和累计值数组的对象
 * @property {Array<string>} dates - 排序后的日期字符串数组
 * @property {Array<number>} values - 累计签到次数数组
 */
const generateLineData = () => {
	/**
	 * 日期映射表
	 * @description 使用Map存储每个日期对应的签到次数
	 * key: 日期字符串(YYYY-MM-DD), value: 该日期的签到次数
	 */
	const dateMap = new Map()

	/**
	 * 遍历考勤记录,统计每日签到次数
	 * @description 将每条记录的日期提取出来,统计同一天的签到次数
	 */
	StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords.forEach(record => {
		const date = new Date(record.attendanceDateTime)
		const dateStr = date.toISOString().split('T')[0] // 提取日期部分(YYYY-MM-DD)
		// 累加该日期的签到次数
		dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1)
	})

	// 将日期按升序排序
	const sortedDates = Array.from(dateMap.keys()).sort()
	// 获取每日签到次数数组
	const dailyValues = sortedDates.map(date => dateMap.get(date))

	/**
	 * 计算累计签到次数
	 * @description 将每日签到次数累加,生成累计值数组
	 */
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
 * 生成热力图数据
 * @function generateHeatmapData
 * @description 根据考勤记录生成热力图所需的数据
 * 按星期和时段统计签到次数
 * @returns {Array<Array<number>>} 热力图数据数组
 * 格式: [[星期索引, 时段索引, 签到次数], ...]
 * 星期索引: 0-6 (周一到周日)
 * 时段索引: 0-2 (上午、下午、晚上)
 */
const generateHeatmapData = () => {
	const data = []
	// 星期数组
	const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
	// 时段数组
	const timeSlots = ['上午', '下午', '晚上']

	/**
	 * 遍历每个星期和时段的组合
	 * @description 为每个组合统计对应的签到次数
	 */
	weekDays.forEach((day, dayIndex) => {
		timeSlots.forEach((slot, slotIndex) => {
			let count = 0
			/**
			 * 遍历考勤记录,统计当前星期和时段的签到次数
			 * @description 检查每条记录是否属于当前的星期和时段
			 */
			StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords.forEach(record => {
				const date = new Date(record.attendanceDateTime)
				// 获取星期几(0=周日,1=周一,...,6=周六)
				// 转换为索引(0=周一,1=周二,...,6=周日)
				const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1
				const hour = date.getHours()

				// 检查是否匹配当前星期
				if (dayOfWeek === dayIndex) {
					// 检查是否匹配当前时段
					if (slot === '上午' && hour >= 8 && hour < 11) { count++ } // 上午: 8-11点
					else if (slot === '下午' && hour >= 14 && hour < 17) { count++ } // 下午: 14-17点
					else if (slot === '晚上' && hour >= 19 && hour < 22) { count++ } // 晚上: 19-22点
				}
			})
			// 添加数据点: [星期索引, 时段索引, 签到次数]
			data.push([dayIndex, slotIndex, count])
		})
	})

	return data
}

/**
 * 监听主题变化
 * @description 当主题切换时,重新初始化图表以应用新的主题样式
 * 使用延迟确保主题切换完成后再更新图表
 */
watch(() => themeStore.isDark, () => {
	nextTick(() => {
		setTimeout(() => {
			// 如果热力图实例存在,重新初始化
			if (heatmapInstance.value) {
				initHeatmapChart()
			}
			// 如果趋势图实例存在,重新初始化
			if (lineInstance.value) {
				initLineChart()
			}
		}, 100) // 延迟100ms等待主题切换完成
	}, 50)
})

/**
 * 监听考勤记录变化
 * @description 当考勤记录数据更新时,重新初始化图表以显示最新数据
 * 确保图表数据与考勤记录保持同步
 */
watch(() => StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords, () => {
	// 如果热力图实例存在,重新初始化
	if (heatmapInstance.value) {
		initHeatmapChart()
	}
	// 如果趋势图实例存在,重新初始化
	if (lineInstance.value) {
		initLineChart()
	}
})
</script>

<template>
	<!-- 学生管理页面主容器 -->
	<div class="student-manager-page-page-header-wrapper student-manager-page-desktop-enter-animation">
		<div class="student-manager-page-page-header">
			<!-- 页面头部左侧块 -->
			<div class="student-manager-page-page-header-left">
				<el-button
					title="返回导航页"
					@click="goBack"
				>
					<el-icon>
						<arrow-left/>
					</el-icon>
				</el-button>
				<img
					ref="logoRef"
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊学生管理系统"
					title="切换主题模式"
					@click="toggleTheme"
				/>
			</div>
			<!-- 页面头部中间块 -->
			<div class="student-manager-page-page-header-middle">
				<h1>学生管理</h1>
			</div>
			<!-- 页面头部右侧块 -->
			<div v-if="studentManagerPage.adminStudentAvatarUrl" class="student-manager-page-page-header-right">
				<img
					:src="studentManagerPage.adminStudentAvatarUrl"
					v-lazy="studentManagerPage.adminStudentAvatarUrl"
					alt="管理员头像"
				/>
			</div>
		</div>
		<div class="student-cards">
			<!-- 学生卡片列表块头部 -->
			<div class="student-cards-header">
				<h2>管理的学生列表</h2>
				<el-input
					v-model="searchQuery"
					placeholder="搜索学生姓名、学号或专业..."
					clearable
					@input="handleSearch"
					@clear="handleClearSearch"
				>
					<template #prefix>
						<el-icon>
							<search/>
						</el-icon>
					</template>
				</el-input>
				<div>
					<el-button
						type="info"
						:class="{ 'active': sortOrder === 'attendance' }"
						@click="sortByAttendance"
					>
						<el-icon>
							<sort/>
						</el-icon>
						按打卡次数排序
					</el-button>
					<el-button
						type="primary"
						:loading="loading"
						@click="refreshStudents"
					>
						<el-icon>
							<refresh/>
						</el-icon>
						刷新
					</el-button>
				</div>
			</div>
			<!-- 学生卡片列表块内容 -->
			<div v-if="!loading && filteredStudents.length > 0" class="student-cards-list">
				<div v-for="(student, index) in filteredStudents" :key="student.studentId"
				     class="student-cards-list-item"
				     :style="{ animationDelay: `${index * 0.15}s` }">
					<!-- 学生卡片头部块 -->
					<div class="student-cards-list-item-header">
						<!-- 块1：头像 -->
						<img
							:src="getStudentAvatarUrl(student)"
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
					<div class="student-cards-list-item-buttons">
						<el-button
							type="success"
							size="small"
							@click="StudentManagerPageAttendance_Records_Dialog.openAttendanceRecordsDialog(student)"
						>
							<el-icon>
								<calendar/>
							</el-icon>
							考勤记录
						</el-button>
						<el-button
							type="warning"
							size="small"
							@click="openDatePicker(student)"
						>
							<el-icon>
								<clock/>
							</el-icon>
							补卡
						</el-button>
						<el-button
							type="info"
							size="small"
							@click="openHeatmapDialog(student)"
						>
							<el-icon>
								<star/>
							</el-icon>
							热力图
						</el-button>
						<el-button
							type="primary"
							size="small"
							@click="openTrendChartDialog(student)"
						>
							<el-icon>
								<trend-charts/>
							</el-icon>
							趋势图
						</el-button>
					</div>
				</div>
			</div>

			<div v-if="!loading && managedStudents.length === 0" class="empty-state">
				<el-icon size="64" class="empty-icon">
					<user/>
				</el-icon>
				<h3>暂无管理的学生</h3>
				<p>您当前没有管理任何学生</p>
			</div>

			<div
				v-if="!loading && managedStudents.length > 0 && filteredStudents.length === 0 && searchQuery"
				class="no-search-results">
				<el-icon size="64" class="empty-icon">
					<search/>
				</el-icon>
				<h3>未找到匹配的学生</h3>
				<p>请尝试其他关键词或清空搜索条件</p>
			</div>

			<div v-if="loading" class="loading-state">
				<el-icon size="32" class="loading-icon">
					<loading/>
				</el-icon>
				<p>加载中...</p>
			</div>
		</div>

		<!-- 隐藏的日期选择器 -->
		<el-date-picker
			v-if="showDatePicker"
			ref="hiddenDatePicker"
			v-model="makeupForm.attendanceTime"
			type="datetime"
			format="YYYY年MM月DD日 HH:mm"
			value-format="YYYY-MM-DDTHH:mm:ss"
			:shortcuts="timeShortcuts"
			:loading="makeupLoading"
			popper-class="makeup-attendance-date-picker"
			style="position: fixed; left: 50%; top: 75%; transform: translate(-50%, -50%); opacity: 0; pointer-events: none;"
			@change="(val) => handleMakeupTimeChange(currentMakeupStudent, val)"

		/>
		<el-dialog
			v-if="StudentManagerPageAttendance_Records_Dialog.state.attendanceRecordsDialogVisible"
			v-model="StudentManagerPageAttendance_Records_Dialog.state.attendanceRecordsDialogVisible"
			:title="`${StudentManagerPageAttendance_Records_Dialog.getSelectedStudent()?.name}的考勤记录`"
			class="attendance-records-dialog"
			modal-class="attendance-records-dialog-overlay"
			@close="StudentManagerPageAttendance_Records_Dialog.closeAttendanceRecordsDialog()"
		>
			<div>
				<div v-if="!StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords || StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords.length === 0">
					<el-icon>
						<calendar/>
					</el-icon>
					<p>暂无考勤记录</p>
				</div>
				<div>
					<el-calendar v-model="StudentManagerPageAttendance_Records_Dialog.state.calendarValue">
						<template #header="{ date }">
							<div>{{ date }}</div>
							<div>
								<el-button size="small" @click="prevMonth">上个月</el-button>
								<el-button size="small" @click="goToday">今天</el-button>
								<el-button size="small" @click="nextMonth">下个月</el-button>
							</div>
						</template>
						<template #date-cell="{ data }">
							<div class="attendance-records-dialog-list-item">
								<div class="attendance-records-dialog-list-item-div">
									<span
										:class="{ 'attendance-records-dialog-list-item-has-attendance': studentManagerPageStudentAttendanceServer.getAttendanceTimeBySlot(data.day, 'morning', StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords) }">
										早:&nbsp;&nbsp;{{
											studentManagerPageStudentAttendanceServer.getAttendanceTimeBySlot(data.day, 'morning', StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords)
										}}
									</span>

									<span
										:class="{ 'attendance-records-dialog-list-item-has-attendance': studentManagerPageStudentAttendanceServer.getAttendanceTimeBySlot(data.day, 'afternoon', StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords) }">
										午:&nbsp;&nbsp;{{
											studentManagerPageStudentAttendanceServer.getAttendanceTimeBySlot(data.day, 'afternoon', StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords)
										}}
									</span>

									<span
										:class="{ 'attendance-records-dialog-list-item-has-attendance': studentManagerPageStudentAttendanceServer.getAttendanceTimeBySlot(data.day, 'evening', StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords) }">
										晚:&nbsp;&nbsp;{{
											studentManagerPageStudentAttendanceServer.getAttendanceTimeBySlot(data.day, 'evening', StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords)
										}}
									</span>
								</div>

								<span class="attendance-records-dialog-list-item-span">{{
									data.day.split('-')[2]
								}}</span>
							</div>
						</template>
					</el-calendar>
				</div>
			</div>
			<template #footer>
				<div>
					<el-button @click="StudentManagerPageAttendance_Records_Dialog.closeAttendanceRecordsDialog()">
						关闭
					</el-button>
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
				<div v-if="attendanceRecordsLoading" class="student-manager-page-heatmap-chart-loading-container">
					<el-icon class="student-manager-page-heatmap-chart-loading-icon">
						<loading/>
					</el-icon>
					<p>加载中...</p>
				</div>
				<div v-else-if="!StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords || StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords.length === 0" class="student-manager-page-heatmap-chart-no-records">
					<el-icon class="student-manager-page-heatmap-chart-no-records-icon">
						<calendar/>
					</el-icon>
					<p>暂无考勤记录</p>
				</div>
				<div v-else class="student-manager-page-heatmap-chart-container">
					<div class="student-manager-page-heatmap-chart-item">
						<div class="student-manager-page-heatmap-chart-title">签到热力图</div>
						<div ref="heatmapDialogChart" class="student-manager-page-heatmap-chart-content"/>
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
				<div v-if="attendanceRecordsLoading" class="student-manager-page-trend-chart-loading-container">
					<el-icon class="student-manager-page-trend-chart-loading-icon">
						<loading/>
					</el-icon>
					<p>加载中...</p>
				</div>
				<div v-else-if="!StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords || StudentManagerPageAttendance_Records_Dialog.state.studentAttendanceRecords.length === 0" class="student-manager-page-trend-chart-no-records">
					<el-icon class="student-manager-page-trend-chart-no-records-icon">
						<calendar/>
					</el-icon>
					<p>暂无考勤记录</p>
				</div>
				<div v-else class="student-manager-page-trend-chart-container">
					<div class="student-manager-page-trend-chart-item">
						<div class="student-manager-page-trend-chart-title">签到趋势图</div>
						<div ref="trendDialogChart" class="student-manager-page-trend-chart-content"/>
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

<style scoped src="./css/desktop/StudentManagerPage-PageHeader.css"></style>
<style scoped src="./css/desktop/StudentManagerPage-StudentCards.css"></style>
<style scoped src="./css/desktop/StudentManagerPage-Attendance_Records_Dialog.css"></style>
<style scoped src="./css/desktop/StudentManagerPage-HeatmapChart.css"></style>
<style scoped src="./css/desktop/StudentManagerPage-TrendChart.css"></style>

