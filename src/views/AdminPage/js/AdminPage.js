/**
 * 管理员页面逻辑管理模块
 * 提供管理员后台页面的所有业务逻辑和状态管理
 *
 * @module views/AdminPage/AdminPage
 * @description 管理学生信息、考勤记录、积分调整、数据可视化等功能
 */

import { BarChart, LineChart, HeatmapChart } from 'echarts/charts'
import {
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	VisualMapComponent
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ElMessage } from 'element-plus'
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'

import {
	getStudentAttendanceCount,
	getDailyAttendanceCount,
	getMonthlyAttendanceCount,
	getTodayAttendanceRecords,
	getStudentAttendanceRecords,
	makeupAttendanceWithSpecialPassword
} from '@/api/attendance'
import { createPointsRecord, getAllAdjustRecordsByStudentInfoId, getTotalPointsByStudentInfoId } from '@/api/points'
import {
	getAllStudentsWithSpecialPassword,
	setStudentLevel,
	getStudentLevel,
	updateStudentWithSpecialPassword,
	getAdminInfo,
	assignStudentToAdmin,
	getAvatarUrl
} from '@/api/student'
import { validateSpecialPassword } from '@/api/super_admin'
import { useAdminStore } from '@/stores/admin'
import { useThemeStore } from '@/stores/theme'

/**
 * 注册ECharts组件
 * 注册管理员页面所需的所有ECharts图表组件和渲染器
 */
echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	VisualMapComponent,
	BarChart,
	LineChart,
	HeatmapChart,
	CanvasRenderer
])

/**
 * 管理员页面Composable函数
 * 封装管理员后台页面的所有业务逻辑和状态管理
 *
 * @returns {Object} 包含状态、计算属性和方法的对象，供组件使用
 */
export const useAdminPage = () => {
	/**
	 * Store实例
	 */
	// 管理员状态管理
	const adminStore = useAdminStore()
	// 主题状态管理
	const themeStore = useThemeStore()
	const { toggleTheme } = themeStore
	// 路由实例（未使用，保留用于未来扩展）
	const _router = useRouter()

	/**
	 * 认证相关状态
	 */
	// 是否已通过管理员认证
	const isAuthenticated = ref(false)
	// 特殊密码（管理员密码）
	const specialPassword = ref('')
	// 认证错误信息
	const authError = ref('')
	// 认证加载状态
	const authLoading = ref(false)

	/**
	 * 数据加载相关状态
	 */
	// 是否正在加载数据
	const isLoading = ref(false)
	// 数据是否已加载完成
	const isDataLoaded = ref(false)
	// 加载进度（0-100）
	const loadingProgress = ref(0)
	// 加载状态文本
	const loadingStatus = ref('正在验证身份...')

	/**
	 * 学生列表相关状态
	 */
	// 学生列表数据
	const students = ref([])
	// 搜索关键词
	const searchKeyword = ref('')
	// 当前页码
	const currentPage = ref(1)
	// 每页显示数量
	const pageSize = ref(20)
	// 学生总数
	const totalStudents = ref(0)

	/**
	 * 统计数据相关状态
	 */
	// 今日考勤总数
	const todayCount = ref(0)
	// 本月考勤总数
	const monthlyCount = ref(0)
	// 学生等级数据（key为学生ID，value为等级代码）
	const studentLevels = ref({})
	// 学生考勤次数数据（key为学生ID，value为考勤次数）
	const studentAttendanceCounts = ref({})
	// 学生管理员数据（key为学生ID，value为管理员信息）
	const studentAdmins = ref({})
	// 学生积分数据（key为学生ID，value为积分值）
	const studentPoints = ref({})

	/**
	 * 等级标签页状态
	 */
	// 当前激活的等级标签（'0'、'1'、'2'、'3'）
	const activeLevelTab = ref('0')

	/**
	 * 编辑学生对话框相关状态
	 */
	// 编辑对话框显示状态
	const editDialogVisible = ref(false)
	// 编辑表单引用
	const editFormRef = ref()
	// 编辑表单数据
	const editForm = ref({
		name: '',
		studentId: '',
		gender: '',
		phoneNumber: '',
		college: '',
		major: '',
		grade: 1,
		classNum: 1,
		password: ''
	})
	// 当前编辑的学生ID
	const currentEditStudentId = ref('')

	/**
	 * 今日考勤对话框相关状态
	 */
	// 今日考勤对话框显示状态
	const todayAttendanceDialogVisible = ref(false)
	// 今日考勤记录列表
	const todayAttendanceRecords = ref([])

	/**
	 * 考勤记录对话框相关状态
	 */
	// 考勤记录对话框显示状态
	const attendanceRecordsDialogVisible = ref(false)
	// 当前查看的学生信息
	const currentStudentInfo = ref({})
	// 日历选中的日期
	const calendarValue = ref(new Date())
	// 滚动位置（用于恢复滚动状态）
	const scrollPosition = ref(0)
	// 所有学生考勤记录
	const allStudentAttendanceRecords = ref([])
	// 日历时间段配置
	const calendarSlots = [
		{ key: 'morning', label: '早' },
		{ key: 'afternoon', label: '午' },
		{ key: 'evening', label: '晚' }
	]

	/**
	 * 过滤后的学生考勤记录计算属性
	 * 根据日历选中的日期，过滤出该月份的所有考勤记录
	 *
	 * @type {ComputedRef<Array>}
	 */
	const filteredStudentAttendanceRecords = computed(() => {
		// 如果没有考勤记录，返回空数组
		if (!allStudentAttendanceRecords.value || allStudentAttendanceRecords.value.length === 0) {
			return []
		}

		// 获取当前选中的日期
		const currentDate = calendarValue.value
		const currentYear = currentDate.getFullYear()
		const currentMonth = currentDate.getMonth()

		// 过滤出当前年月的考勤记录
		return allStudentAttendanceRecords.value.filter(record => {
			// 验证记录有效性
			if (!record || !record.attendanceDateTime) {
				return false
			}

			// 比较记录日期与选中日期的年月
			const recordDate = new Date(record.attendanceDateTime)
			return recordDate.getFullYear() === currentYear && recordDate.getMonth() === currentMonth
		})
	})

	/**
	 * 热力图对话框相关状态
	 */
	// 热力图对话框显示状态
	const heatmapDialogVisible = ref(false)
	// 趋势图对话框显示状态
	const trendDialogVisible = ref(false)
	// 热力图DOM引用
	const heatmapChart = ref(null)
	// 折线图DOM引用
	const lineChart = ref(null)
	// 热力图ECharts实例
	const heatmapInstance = ref(null)
	// 折线图ECharts实例
	const lineInstance = ref(null)
	// 日期详情对话框显示状态
	const showDateDetailsDialog = ref(false)
	// 选中的日期
	const selectedDate = ref('')

	/**
	 * 补卡对话框相关状态
	 */
	// 补卡对话框显示状态
	const makeupDialogVisible = ref(false)
	// 补卡加载状态
	const makeupLoading = ref(false)
	// 选中的补卡学生
	const makeupSelectedStudent = ref(null)
	// 补卡步骤（'date'或'time'）
	const makeupStep = ref('date')
	// 补卡表单引用
	const makeupFormRef = ref()
	// 日期选择器引用
	const datePickerRef = ref()
	// 补卡表单数据
	const makeupForm = ref({
		attendanceTime: '', // 完整的考勤时间
		selectedDate: '', // 选中的日期
		selectedHour: null // 选中的小时
	})

	/**
	 * 积分调整对话框相关状态
	 */
	// 积分调整对话框显示状态
	const pointsDialogVisible = ref(false)
	// 积分调整加载状态
	const pointsLoading = ref(false)
	// 选中的积分调整学生
	const pointsSelectedStudent = ref(null)
	// 积分调整表单引用
	const pointsFormRef = ref()
	// 积分调整表单数据
	const pointsForm = ref({
		changePoints: null, // 积分变化量（正数为增加，负数为减少）
		adjustReason: '' // 调整原因
	})

	/**
	 * 改分记录对话框相关状态
	 */
	// 改分记录对话框显示状态
	const scoreChangeRecordsDialogVisible = ref(false)
	// 改分记录加载状态
	const scoreChangeRecordsLoading = ref(false)
	// 改分记录列表
	const scoreChangeRecords = ref([])
	// 当前查看改分记录的学生
	const currentScoreChangeRecordsStudent = ref(null)


	/**
	 * 日期时间快捷选项配置
	 * 用于补卡对话框的日期时间选择器，提供常用时间段的快捷选择
	 *
	 * @type {Array<Object>}
	 * @property {string} key - 快捷选项的唯一标识
	 * @property {string} label - 显示的标签文本
	 * @property {number} dateOffset - 日期偏移量（0为今天，-1为昨天）
	 * @property {string} timeSlot - 时间段（'morning'、'afternoon'、'evening'）
	 * @property {number} defaultHour - 默认小时数
	 */
	const datetimeShortcuts = [
		{
			key: 'today-morning',
			label: '今天早上',
			dateOffset: 0,
			timeSlot: 'morning',
			defaultHour: 8
		},
		{
			key: 'today-afternoon',
			label: '今天下午',
			dateOffset: 0,
			timeSlot: 'afternoon',
			defaultHour: 14
		},
		{
			key: 'today-evening',
			label: '今天晚上',
			dateOffset: 0,
			timeSlot: 'evening',
			defaultHour: 19
		},
		{
			key: 'yesterday-morning',
			label: '昨天早上',
			dateOffset: -1,
			timeSlot: 'morning',
			defaultHour: 8
		},
		{
			key: 'yesterday-afternoon',
			label: '昨天下午',
			dateOffset: -1,
			timeSlot: 'afternoon',
			defaultHour: 14
		},
		{
			key: 'yesterday-evening',
			label: '昨天晚上',
			dateOffset: -1,
			timeSlot: 'evening',
			defaultHour: 19
		}
	]


	/**
	 * 获取快捷选项对应的日期字符串
	 * 根据快捷选项的日期偏移量计算日期，并格式化为YYYY-MM-DD格式
	 *
	 * @param {Object} shortcut - 快捷选项对象
	 * @param {number} shortcut.dateOffset - 日期偏移量
	 * @returns {string} 格式化的日期字符串（YYYY-MM-DD）
	 */
	const getShortcutDate = shortcut => {
		const date = new Date()
		// 根据偏移量调整日期
		date.setDate(date.getDate() + shortcut.dateOffset)
		// 格式化为YYYY-MM-DD格式
		return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
	}

	/**
	 * 时间段配置
	 * 定义补卡时可选择的时间段和对应的小时数
	 *
	 * @type {Array<Object>}
	 * @property {string} label - 时间段标签
	 * @property {string} key - 时间段键值
	 * @property {Array<number>} hours - 该时间段可选的小时数数组
	 */
	const timeSlots = [
		{
			label: '早上',
			key: 'morning',
			hours: [8, 9, 10, 11] // 早上可选的小时：8-11点
		},
		{
			label: '下午',
			key: 'afternoon',
			hours: [14, 15, 16, 17] // 下午可选的小时：14-17点
		},
		{
			label: '晚上',
			key: 'evening',
			hours: [19, 20, 21, 22] // 晚上可选的小时：19-22点
		}
	]

	/**
	 * 所有有效小时数数组
	 * 从时间段配置中提取所有可选的小时数，用于验证
	 */
	const validHours = timeSlots.flatMap(slot => slot.hours)

	/**
	 * 补卡日期表单验证规则
	 * 定义补卡日期选择器的验证规则
	 */
	const makeupDateFormRules = {
		selectedDate: [
			{ required: true, message: '请选择日期', trigger: 'change' }
		]
	}

	/**
	 * 学生等级选项配置
	 * 定义学生等级的可选值和显示标签
	 *
	 * @type {Array<Object>}
	 * @property {number} value - 等级代码（0-3）
	 * @property {string} label - 等级标签
	 * @property {string} color - 等级对应的颜色类型
	 */
	const levelOptions = [
		{ value: 0, label: '社团成员', color: 'info' },
		{ value: 1, label: '普通成员', color: 'success' },
		{ value: 2, label: '核心成员', color: 'warning' },
		{ value: 3, label: '管理员', color: 'danger' }
	]

	/**
	 * 管理员选项计算属性
	 * 从学生列表中筛选出等级为3（管理员）的学生，用于分配管理员功能
	 *
	 * @type {ComputedRef<Array>}
	 */
	const adminOptions = computed(() => {
		// 如果没有学生数据，返回空数组
		if (!students.value.length) {
			return []
		}

		// 筛选出等级为3（管理员）的学生
		const adminStudents = students.value.filter(student => {
			const level = studentLevels.value[student.studentId] || 0
			return level === 3
		})

		// 转换为选项格式，包含value、label和student对象
		return adminStudents.map(student => ({
			value: student.studentId,
			label: `${student.name} (${student.studentId})`,
			student
		}))
	})

	/**
	 * 编辑表单验证规则
	 * 定义学生信息编辑表单的字段验证规则
	 */
	const editFormRules = {
		name: [
			{ required: true, message: '请输入学生姓名', trigger: 'blur' }
		],
		studentId: [
			{ required: true, message: '请输入学号', trigger: 'blur' },
			// 学号格式：以20-30开头的10位数字
			{ pattern: /^[2-3][0-9]\d{8}$/, message: '学号格式不正确（以20-30开头的10位数字）', trigger: 'blur' }
		],
		gender: [
			{ required: true, message: '请选择性别', trigger: 'change' }
		],
		phoneNumber: [
			{ required: true, message: '请输入手机号', trigger: 'blur' },
			// 手机号格式：1开头的11位数字，第二位为3-9
			{ pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
		],
		college: [
			{ required: true, message: '请输入学院', trigger: 'blur' }
		],
		major: [
			{ required: true, message: '请输入专业', trigger: 'blur' }
		],
		grade: [
			{ required: true, message: '请选择年级', trigger: 'change' }
		],
		classNum: [
			{ required: true, message: '请输入班级', trigger: 'blur' }
		],
		password: [
			// 密码为可选字段，如果填写则长度必须在6-16位之间
			{ min: 6, max: 16, message: '密码长度必须在6到16位之间', trigger: 'blur' }
		]
	}

	/**
	 * 积分调整表单验证规则
	 * 定义积分调整表单的字段验证规则
	 */
	const pointsFormRules = {
		changePoints: [
			{ required: true, message: '请输入积分变动值', trigger: 'blur' },
			{ type: 'number', message: '积分变动值必须为数字', trigger: 'blur' }
		],
		adjustReason: [
			{ required: true, message: '请输入改分理由', trigger: 'blur' },
			{ max: 500, message: '改分理由不能超过500个字符', trigger: 'blur' }
		]
	}

	/**
	 * 过滤后的学生列表计算属性
	 * 根据搜索关键词过滤学生列表，支持按姓名、学号、手机号、学院、专业搜索
	 *
	 * @type {ComputedRef<Array>}
	 */
	const filteredStudents = computed(() => {
		// 如果没有搜索关键词，返回所有学生
		if (!searchKeyword.value) {
			return students.value
		}
		// 将关键词转换为小写，实现不区分大小写的搜索
		const keyword = searchKeyword.value.toLowerCase()
		return students.value.filter(student => {
			try {
				// 在多个字段中搜索关键词
				return (
					(student.name && student.name.toLowerCase().includes(keyword)) ||
					(student.studentId && String(student.studentId).toLowerCase().includes(keyword)) ||
					(student.phoneNumber && String(student.phoneNumber).includes(keyword)) ||
					(student.college && student.college.toLowerCase().includes(keyword)) ||
					(student.major && student.major.toLowerCase().includes(keyword))
				)
			} catch (error) {
				// 如果过滤过程中出错，记录错误并排除该学生
				console.error('Filter student error:', error, student)
				return false
			}
		})
	})

	/**
	 * 获取指定等级的学生列表
	 * 从过滤后的学生列表中筛选出指定等级的学生
	 *
	 * @param {number} levelCode - 等级代码（0-3）
	 * @returns {Array} 该等级的学生列表
	 */
	const getLevelStudents = levelCode => filteredStudents.value.filter(student => {
		// 获取学生的等级，默认为0（社团成员）
		const studentLevel = studentLevels.value[student.studentId] || 0
		return studentLevel === levelCode
	})

	/**
	 * 当前等级的学生列表计算属性
	 * 根据当前激活的等级标签页，返回该等级的学生列表
	 *
	 * @type {ComputedRef<Array>}
	 */
	const currentLevelStudents = computed(() => {
		// 将字符串形式的等级代码转换为数字
		const currentLevel = parseInt(activeLevelTab.value, 10)
		return getLevelStudents(currentLevel)
	})

	/**
	 * 修改学生等级
	 * 使用管理员密码为学生设置新的等级
	 *
	 * @param {string} studentId - 学号
	 * @param {number} newLevel - 新等级代码（0-3）
	 * @returns {Promise<void>}
	 */
	const changeLevel = async (studentId, newLevel) => {
		// 如果等级没有变化，直接返回
		if (studentLevels.value[studentId] === newLevel) {
			return
		}

		// 获取管理员密码
		const adminPassword = adminStore.getAdminPassword()
		if (!adminPassword) {
			// 如果管理员密码无效，提示重新登录
			ElMessage.error('身份验证已过期，请重新登录')
			isAuthenticated.value = false
			adminStore.clearAdminPassword()
			return
		}

		// 开始加载
		isLoading.value = true
		try {
			// 调用API设置学生等级
			const response = await setStudentLevel(adminPassword, studentId, newLevel)
			if (response.code === 200) {
				// 保存旧等级，用于后续处理
				const oldLevel = studentLevels.value[studentId] || 0
				// 更新本地等级数据
				studentLevels.value[studentId] = newLevel

				// 如果学生从管理员降级，清除其管理的所有学生的管理员关系
				if (oldLevel === 3 && newLevel !== 3) {
					Object.keys(studentAdmins.value).forEach(key => {
						if (studentAdmins.value[key]?.adminStudentId === studentId) {
							studentAdmins.value[key] = null
						}
					})
				}

				// 如果学生升级为管理员，清除其自己的管理员关系
				if (newLevel === 3) {
					studentAdmins.value[studentId] = null
				}

				ElMessage.success('学生等级设置成功')
			} else {
				// 设置失败，恢复原等级
				ElMessage.error(response.message || '设置失败')
				studentLevels.value[studentId] = studentLevels.value[studentId] || 0
			}
		} catch (error) {
			// 发生错误，恢复原等级
			ElMessage.error(error.message)
			studentLevels.value[studentId] = studentLevels.value[studentId] || 0
		} finally {
			// 结束加载状态
			isLoading.value = false
		}
	}

	/**
	 * 修改学生的所属管理员
	 * 将指定学生分配给指定的管理员进行管理
	 *
	 * @param {string} studentId - 被管理学生的学号
	 * @param {string|null} newAdminId - 新管理员的学号，null表示取消分配
	 * @returns {Promise<void>}
	 */
	const changeAdmin = async (studentId, newAdminId) => {
		// 获取当前管理员ID
		const currentAdminId = studentAdmins.value[studentId]?.adminStudentId
		// 如果管理员没有变化，直接返回
		if (currentAdminId === newAdminId) {
			return
		}

		// 检查学生等级，管理员不能分配所属管理员
		const studentLevel = studentLevels.value[studentId] || 0
		if (studentLevel === 3) {
			ElMessage.warning('管理员不能分配所属管理员')
			return
		}

		// 获取管理员密码
		const adminPassword = adminStore.getAdminPassword()
		if (!adminPassword) {
			// 如果管理员密码无效，提示重新登录
			ElMessage.error('身份验证已过期，请重新登录')
			isAuthenticated.value = false
			adminStore.clearAdminPassword()
			return
		}

		// 开始加载
		isLoading.value = true
		try {
			// 调用API分配管理员
			const response = await assignStudentToAdmin(adminPassword, studentId, newAdminId)
			if (response.code === 200) {
				// 如果分配了管理员，更新本地数据
				if (newAdminId) {
					// 从管理员选项中查找选中的管理员
					const selectedAdmin = adminOptions.value.find(admin => admin.value === newAdminId)
					if (selectedAdmin) {
						// 更新学生的管理员信息
						studentAdmins.value[studentId] = {
							adminStudentId: newAdminId,
							adminName: selectedAdmin.student.name
						}
					}
				} else {
					// 如果取消分配（newAdminId为null），清除管理员关系
					studentAdmins.value[studentId] = null
				}
				ElMessage.success('管理员分配成功')
			} else {
				ElMessage.error(response.message || '分配失败')
			}
		} catch (error) {
			ElMessage.error(error.message)
		} finally {
			// 结束加载状态
			isLoading.value = false
		}
	}

	/**
	 * 加载所有学生的等级信息
	 * 批量获取学生列表中每个学生的等级，并更新到本地状态
	 *
	 * @returns {Promise<void>}
	 */
	const loadStudentLevels = async () => {
		// 如果没有学生数据，直接返回
		if (!students.value.length) {
			return
		}

		try {
			// 为每个学生创建获取等级的Promise
			const levelPromises = students.value.map(async student => {
				try {
					// 调用API获取学生等级
					const response = await getStudentLevel(student.studentId)
					if (response.code === 200) {
						// 更新本地等级数据
						studentLevels.value[student.studentId] = response.data.levelCode
					}
				} catch (error) {
					// 获取失败，默认设置为0（社团成员）
					studentLevels.value[student.studentId] = 0
				}
			})
			// 并行执行所有请求
			await Promise.all(levelPromises)
		} catch (error) {
			ElMessage.error(`加载学生等级失败：${error.message}`)
		}
	}

	/**
	 * 加载所有学生的考勤次数
	 * 批量获取学生列表中每个学生的签到次数，并更新到本地状态
	 *
	 * @returns {Promise<void>}
	 */
	const loadStudentAttendanceCounts = async () => {
		// 如果没有学生数据，直接返回
		if (!students.value.length) { return }

		try {
			// 为每个学生创建获取考勤次数的Promise
			const attendancePromises = students.value.map(async student => {
				try {
					// 调用API获取学生签到次数
					const response = await getStudentAttendanceCount(student.studentId)
					if (response.code === 200) {
						// 更新本地考勤次数数据
						studentAttendanceCounts.value[student.studentId] = response.data.count
					} else {
						// API返回失败，设置为0
						studentAttendanceCounts.value[student.studentId] = 0
					}
				} catch (error) {
					// 获取失败，设置为0
					studentAttendanceCounts.value[student.studentId] = 0
				}
			})
			// 并行执行所有请求
			await Promise.all(attendancePromises)
		} catch (error) {
			ElMessage.error(`加载学生签到次数失败：${error.message}`)
		}
	}

	/**
	 * 加载所有学生的积分信息
	 * 批量获取学生列表中每个学生的总积分，并更新到本地状态
	 * 注意：当前API只返回总积分，签到积分和活动积分需要后端提供更详细的接口
	 *
	 * @returns {Promise<void>}
	 */
	const loadStudentPoints = async () => {
		// 如果没有学生数据，直接返回
		if (!students.value.length) { return }

		try {
			// 为每个学生创建获取积分的Promise
			const pointsPromises = students.value.map(async student => {
				try {
					// 使用学生的数据库主键ID（id字段）而不是学号（studentId字段）
					const response = await getTotalPointsByStudentInfoId(student.id)
					if (response.code === 200) {
						// 根据接口文档，API返回的是一个数字，表示总积分
						const totalPoints = response.data || 0
						// 由于API只返回总积分，我们将签到积分和活动积分都设为0
						// 如果需要区分签到积分和活动积分，需要后端提供更详细的接口
						studentPoints.value[student.studentId] = {
							totalPoints,
							attendancePoints: 0,
							activityPoints: 0
						}
					} else {
						// API返回失败，设置为0
						studentPoints.value[student.studentId] = {
							totalPoints: 0,
							attendancePoints: 0,
							activityPoints: 0
						}
					}
				} catch (error) {
					// 获取失败，设置为0
					studentPoints.value[student.studentId] = { totalPoints: 0, attendancePoints: 0, activityPoints: 0 }
				}
			})
			// 并行执行所有请求
			await Promise.all(pointsPromises)
		} catch (error) {
			ElMessage.error(`加载学生积分信息失败：${error.message}`)
		}
	}

	/**
	 * 加载所有学生的管理员信息
	 * 批量获取学生列表中每个学生的所属管理员信息，并更新到本地状态
	 *
	 * @returns {Promise<void>}
	 */
	const loadStudentAdmins = async () => {
		// 如果没有学生数据，直接返回
		if (!students.value.length) { return }

		try {
			// 为每个学生创建获取管理员信息的Promise
			const adminPromises = students.value.map(async student => {
				try {
					// 调用API获取学生的管理员信息
					const response = await getAdminInfo(student.studentId)
					if (response.code === 200 && response.data) {
						// 更新本地管理员数据
						studentAdmins.value[student.studentId] = response.data
					} else {
						// 没有管理员，设置为null
						studentAdmins.value[student.studentId] = null
					}
				} catch (error) {
					// 获取失败，设置为null
					studentAdmins.value[student.studentId] = null
				}
			})
			// 并行执行所有请求
			await Promise.all(adminPromises)
		} catch (error) {
			// 部分失败不影响整体，只显示警告
			ElMessage.warning('部分学生管理员信息加载失败，请刷新重试')
		}
	}

	/**
	 * 加载所有学生的头像
	 * 批量获取学生列表中每个学生的头像URL，并验证头像是否存在
	 *
	 * @returns {Promise<void>}
	 */
	const loadStudentAvatars = async () => {
		// 如果没有学生数据，直接返回
		if (!students.value.length) { return }

		try {
			// 为每个学生创建加载头像的Promise
			const avatarPromises = students.value.map(async student => {
				// 获取学生的数据库主键ID
				const studentInfoId = student.id
				if (!studentInfoId) {
					// 如果没有ID，标记为无头像
					student.hasAvatar = false
					student.avatarUrl = null
					return
				}

				// 生成头像URL（尺寸128像素）
				const avatarUrlString = getAvatarUrl(studentInfoId, 128)
				if (avatarUrlString) {
					const avatarUrlWithTimestamp = avatarUrlString

					// 先设置头像URL和标记
					student.avatarUrl = avatarUrlWithTimestamp
					student.hasAvatar = true

					// 创建Image对象验证头像是否存在
					const img = new Image()
					// 头像加载成功
					img.onload = () => {
						student.hasAvatar = true
					}
					// 头像加载失败
					img.onerror = () => {
						student.hasAvatar = false
						student.avatarUrl = null
					}
					// 开始加载头像
					img.src = avatarUrlWithTimestamp
				} else {
					// 无法生成URL，标记为无头像
					student.hasAvatar = false
					student.avatarUrl = null
				}
			})
			// 并行执行所有头像加载
			await Promise.all(avatarPromises)
		} catch (error) {
			console.error('加载学生头像失败:', error)
		}
	}

	/**
	 * 处理头像加载错误
	 * 当头像加载失败时，清除学生的头像信息
	 *
	 * @param {Object} student - 学生对象
	 */
	const handleAvatarError = student => {
		student.hasAvatar = false
		student.avatarUrl = null
	}

	/**
	 * 加载统计数据
	 * 获取今日和本月的考勤统计数据
	 *
	 * @returns {Promise<void>}
	 */
	const loadStatistics = async () => {
		try {
			// 并行获取今日和本月考勤统计
			const [dailyData, monthlyData] = await Promise.all([
				getDailyAttendanceCount(),
				getMonthlyAttendanceCount()
			])

			// 更新今日考勤总数
			if (dailyData.code === 200) {
				todayCount.value = dailyData.data.count
			}

			// 更新本月考勤总数
			if (monthlyData.code === 200) {
				monthlyCount.value = monthlyData.data.count
			}
		} catch (error) {
			ElMessage.error(`统计数据加载失败：${error.message}`)
		}
	}

	/**
	 * 刷新所有数据
	 * 重新获取学生列表和所有相关数据（等级、考勤、积分、管理员、头像等）
	 *
	 * @returns {Promise<void>}
	 */
	const refreshData = async () => {
		// 获取管理员密码
		const adminPassword = adminStore.getAdminPassword()
		if (!adminPassword) {
			// 如果管理员密码无效，提示重新登录
			ElMessage.error('身份验证已过期，请重新登录')
			isAuthenticated.value = false
			adminStore.clearAdminPassword()
			return
		}

		// 开始加载
		isLoading.value = true
		try {
			// 获取所有学生列表
			const response = await getAllStudentsWithSpecialPassword(adminPassword)
			if (response.code === 200) {
				// 更新学生列表和总数
				students.value = response.data
				totalStudents.value = response.data.length
				// 依次加载各种相关数据
				await loadStatistics() // 加载统计数据
				await loadStudentLevels() // 加载学生等级
				await loadStudentAttendanceCounts() // 加载考勤次数
				await loadStudentPoints() // 加载积分信息
				await loadStudentAdmins() // 加载管理员信息
				await loadStudentAvatars() // 加载头像
				ElMessage.success('数据刷新成功')
			}
		} catch (error) {
			ElMessage.error(`数据刷新失败：${error.message}`)
		} finally {
			// 结束加载状态
			isLoading.value = false
		}
	}

	/**
	 * 打开编辑学生对话框
	 * 填充编辑表单并显示编辑对话框
	 *
	 * @param {Object} student - 要编辑的学生对象
	 */
	const openEditDialog = student => {
		// 设置当前编辑的学生ID
		currentEditStudentId.value = student.studentId
		// 填充表单数据
		editForm.value = {
			name: student.name,
			studentId: student.studentId.toString(),
			gender: student.gender,
			phoneNumber: student.phoneNumber,
			college: student.college,
			major: student.major,
			grade: student.grade,
			classNum: student.classNum,
			password: '' // 密码字段留空，不修改则不更新
		}
		// 显示编辑对话框
		editDialogVisible.value = true
	}

	/**
	 * 取消编辑
	 * 关闭编辑对话框并重置表单
	 */
	const cancelEdit = () => {
		editDialogVisible.value = false
		// 重置表单字段
		editFormRef.value?.resetFields()
		// 清空当前编辑的学生ID
		currentEditStudentId.value = ''
	}

	/**
	 * 确认编辑
	 * 验证表单并提交学生信息更新
	 *
	 * @returns {Promise<void>}
	 */
	const confirmEdit = async () => {
		// 检查表单引用是否存在
		if (!editFormRef.value) { return }

		try {
			// 验证表单
			await editFormRef.value.validate()

			// 获取管理员密码
			const adminPassword = adminStore.getAdminPassword()
			if (!adminPassword) {
				// 如果管理员密码无效，提示重新登录
				ElMessage.error('身份验证已过期，请重新登录')
				isAuthenticated.value = false
				adminStore.clearAdminPassword()
				return
			}

			// 开始加载
			isLoading.value = true

			// 调用API更新学生信息
			const response = await updateStudentWithSpecialPassword(
				adminPassword,
				currentEditStudentId.value,
				editForm.value
			)

			if (response.code === 200) {
				ElMessage.success('学生信息修改成功')
				editDialogVisible.value = false
				// 刷新数据以获取最新信息
				await refreshData()
			} else {
				ElMessage.error(response.message || '修改失败')
			}
		} catch (error) {
			// 处理错误（可能是表单验证错误或API错误）
			if (error.message) {
				ElMessage.error(error.message)
			}
		} finally {
			// 结束加载状态
			isLoading.value = false
		}
	}

	/**
	 * 显示今日考勤记录
	 * 获取今日所有考勤记录并显示在对话框中
	 *
	 * @returns {Promise<void>}
	 */
	const showTodayAttendance = async () => {
		try {
			isLoading.value = true
			// 调用API获取今日考勤记录
			const response = await getTodayAttendanceRecords()
			if (response.code === 200) {
				// 更新今日考勤记录列表
				todayAttendanceRecords.value = response.data || []
				// 显示对话框
				todayAttendanceDialogVisible.value = true
			} else {
				ElMessage.error(response.message || '获取今日签到记录失败')
			}
		} catch (error) {
			ElMessage.error(`获取今日签到记录失败：${error.message}`)
		} finally {
			isLoading.value = false
		}
	}

	/**
	 * 格式化考勤时间
	 * 将时间字符串格式化为中文本地化格式
	 *
	 * @param {string} timeString - 时间字符串（ISO格式）
	 * @returns {string} 格式化后的时间字符串
	 */
	const formatAttendanceTime = timeString => {
		if (!timeString) { return '' }
		const date = new Date(timeString)
		// 格式化为中文本地化格式
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
	 * 根据时间获取时间段样式类
	 * 根据时间的小时数判断时间段，返回对应的CSS类名
	 *
	 * @param {string} timeString - 时间字符串（ISO格式）
	 * @returns {string} 时间段样式类名（'morning'、'afternoon'、'evening'）
	 */
	const getTimePeriodClass = timeString => {
		if (!timeString) { return 'morning' }
		const date = new Date(timeString)
		const hour = date.getHours()

		// 根据小时数判断时间段
		if (hour >= 8 && hour < 11) {
			return 'morning' // 早上：8-11点
		} if (hour >= 14 && hour < 17) {
			return 'afternoon' // 下午：14-17点
		} if (hour >= 19 && hour < 22) {
			return 'evening' // 晚上：19-22点
		}
		// 其他时间默认为早上
		return 'morning'
	}

	/**
	 * 根据时间获取时间段名称
	 * 根据时间的小时数判断时间段，返回对应的中文名称
	 *
	 * @param {string} timeString - 时间字符串（ISO格式）
	 * @returns {string} 时间段名称（'早上'、'下午'、'晚上'）
	 */
	const getTimePeriodName = timeString => {
		if (!timeString) { return '早上' }
		const date = new Date(timeString)
		const hour = date.getHours()

		// 根据小时数判断时间段
		if (hour >= 8 && hour < 11) {
			return '早上' // 早上：8-11点
		} if (hour >= 14 && hour < 17) {
			return '下午' // 下午：14-17点
		} if (hour >= 19 && hour < 22) {
			return '晚上' // 晚上：19-22点
		}
		// 其他时间默认为早上
		return '早上'
	}

	/**
	 * 检查指定日期和时间段是否已签到
	 * 判断指定日期在指定时间段是否有签到记录
	 *
	 * @param {string} dateStr - 日期字符串（YYYY-MM-DD格式）
	 * @param {string} slotKey - 时间段键值（'morning'、'afternoon'、'evening'）
	 * @returns {boolean} 是否已签到
	 */
	const isSlotSigned = (dateStr, slotKey) => {
		// 获取该日期的所有签到时间
		const times = getDateAttendanceTimes(dateStr)
		if (!times.length) { return false }
		// 检查是否有任何签到时间属于该时间段
		return times.some(time => getTimePeriodClass(time) === slotKey)
	}

	/**
	 * 打开日期详情对话框
	 * 显示指定日期的详细考勤信息
	 *
	 * @param {string} dateStr - 日期字符串（YYYY-MM-DD格式）
	 */
	const openDateDetails = dateStr => {
		selectedDate.value = dateStr
		showDateDetailsDialog.value = true
	}

	/**
	 * 打开考勤记录对话框
	 * 获取并显示指定学生的所有考勤记录，初始化热力图和趋势图
	 *
	 * @param {Object} student - 学生对象
	 * @returns {Promise<void>}
	 */
	const openAttendanceRecordsDialog = async student => {
		// 保存当前学生信息和滚动位置
		currentStudentInfo.value = student
		scrollPosition.value = window.pageYOffset || document.documentElement.scrollTop

		try {
			isLoading.value = true
			// 调用API获取学生考勤记录
			const response = await getStudentAttendanceRecords(student.studentId)
			if (response.code === 200) {
				// 更新考勤记录列表
				allStudentAttendanceRecords.value = response.data || []
				// 获取第一条记录的日期，用于初始化日历
				const firstRecordDate = allStudentAttendanceRecords.value[0]?.attendanceDateTime
				const baseDate = firstRecordDate ? new Date(firstRecordDate) : new Date()
				// 设置日历为第一条记录所在月份的第一天
				calendarValue.value = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1)
				// 设置选中日期为第一条记录的日期
				selectedDate.value = firstRecordDate ? firstRecordDate.split('T')[0] : new Date().toISOString().split('T')[0]
				// 显示对话框
				attendanceRecordsDialogVisible.value = true
				// 等待DOM更新后初始化图表
				await nextTick()
				initHeatmapChart() // 初始化热力图
				initLineChart() // 初始化折线图
			} else {
				ElMessage.error(response.message || '获取考勤记录失败')
			}
		} catch (error) {
			ElMessage.error(`获取考勤记录失败：${error.message}`)
		} finally {
			isLoading.value = false
		}
	}

	/**
	 * 关闭考勤记录对话框
	 * 清理对话框状态、销毁图表实例、恢复滚动位置
	 */
	const closeAttendanceRecordsDialog = () => {
		// 先直接操作DOM隐藏对话框，避免闪烁
		const dialogWrapper = document.querySelector('.attendance-records-overlay')
		if (dialogWrapper) {
			dialogWrapper.style.display = 'none'
			dialogWrapper.style.visibility = 'hidden'
			dialogWrapper.style.opacity = '0'
		}

		// 立即设置v-model为false
		attendanceRecordsDialogVisible.value = false

		// 销毁热力图实例
		if (heatmapInstance.value) {
			heatmapInstance.value.dispose()
			heatmapInstance.value = null
		}
		// 销毁折线图实例
		if (lineInstance.value) {
			lineInstance.value.dispose()
			lineInstance.value = null
		}
		// 重置日历和考勤记录数据
		calendarValue.value = new Date()
		allStudentAttendanceRecords.value = []
		currentStudentInfo.value = {}

		// 恢复滚动位置
		requestAnimationFrame(() => {
			window.scrollTo(0, scrollPosition.value)
		})
	}

	/**
	 * 关闭热力图对话框
	 * 清理对话框状态、销毁图表实例、恢复滚动位置
	 */
	const closeHeatmapDialog = () => {
		// 先直接操作DOM隐藏对话框，避免闪烁
		const dialogWrapper = document.querySelector('.heatmap-overlay')
		if (dialogWrapper) {
			dialogWrapper.style.display = 'none'
			dialogWrapper.style.visibility = 'hidden'
			dialogWrapper.style.opacity = '0'
		}

		// 立即设置v-model为false
		heatmapDialogVisible.value = false

		// 立即销毁热力图实例，不延迟
		if (heatmapInstance.value) {
			heatmapInstance.value.dispose()
			heatmapInstance.value = null
		}

		// 恢复滚动位置
		requestAnimationFrame(() => {
			window.scrollTo(0, scrollPosition.value)
		})
	}

	/**
	 * 关闭趋势图对话框
	 * 清理对话框状态、销毁图表实例、恢复滚动位置
	 */
	const closeTrendDialog = () => {
		// 先直接操作DOM隐藏对话框，避免闪烁
		const dialogWrapper = document.querySelector('.trend-overlay')
		if (dialogWrapper) {
			dialogWrapper.style.display = 'none'
			dialogWrapper.style.visibility = 'hidden'
			dialogWrapper.style.opacity = '0'
		}

		// 立即设置v-model为false
		trendDialogVisible.value = false

		// 立即销毁折线图实例，不延迟
		if (lineInstance.value) {
			lineInstance.value.dispose()
			lineInstance.value = null
		}

		// 恢复滚动位置
		requestAnimationFrame(() => {
			window.scrollTo(0, scrollPosition.value)
		})
	}

	/**
	 * 格式化日期用于显示
	 * 将日期字符串格式化为中文格式（YYYY年MM月DD日）
	 *
	 * @param {string} dateStr - 日期字符串
	 * @returns {string} 格式化后的日期字符串
	 */
	const formatDateForDisplay = dateStr => {
		if (!dateStr) { return '' }
		const date = new Date(dateStr)
		const year = date.getFullYear()
		const month = date.getMonth() + 1
		const day = date.getDate()
		return `${year}年${month}月${day}日`
	}

	/**
	 * 格式化日历标题
	 * 将日期格式化为中文格式（YYYY年MM月）
	 *
	 * @param {Date|string} date - 日期对象或字符串
	 * @returns {string} 格式化后的日期字符串
	 */
	const formatCalendarTitle = date => {
		if (!date) { return '' }
		const d = new Date(date)
		const year = d.getFullYear()
		const month = d.getMonth() + 1
		return `${year}年${month}月`
	}

	/**
	 * 切换到上一个月
	 * 将日历选中日期向前移动一个月
	 */
	const prevMonth = () => {
		const date = new Date(calendarValue.value)
		date.setMonth(date.getMonth() - 1)
		calendarValue.value = date
	}

	/**
	 * 切换到下一个月
	 * 将日历选中日期向后移动一个月
	 */
	const nextMonth = () => {
		const date = new Date(calendarValue.value)
		date.setMonth(date.getMonth() + 1)
		calendarValue.value = date
	}

	/**
	 * 跳转到今天
	 * 将日历选中日期设置为当前日期
	 */
	const goToday = () => {
		calendarValue.value = new Date()
	}

	/**
	 * 获取时间段标签
	 * 根据时间字符串获取对应的时间段中文标签
	 *
	 * @param {string} timeStr - 时间字符串
	 * @returns {string} 时间段标签（'早上'、'下午'、'晚上'、'其他'）
	 */
	const getTimeSlotLabel = timeStr => {
		if (!timeStr) { return '' }
		const date = new Date(timeStr)
		const hour = date.getHours()

		// 根据小时数判断时间段
		if (hour >= 8 && hour < 11) { return '早上' }
		if (hour >= 14 && hour < 17) { return '下午' }
		if (hour >= 19 && hour < 22) { return '晚上' }
		return '其他'
	}

	/**
	 * 获取指定日期的所有签到时间
	 * 从过滤后的考勤记录中提取指定日期的所有签到时间，并排序
	 *
	 * @param {string} dateStr - 日期字符串（YYYY-MM-DD格式）
	 * @returns {Array<string>} 该日期的所有签到时间数组
	 */
	const getDateAttendanceTimes = dateStr => {
		if (!filteredStudentAttendanceRecords.value || !dateStr) { return [] }
		return filteredStudentAttendanceRecords.value
			.filter(record => {
				// 提取记录日期（YYYY-MM-DD部分）
				const [recordDate] = new Date(record.attendanceDateTime).toISOString().split('T')
				return recordDate === dateStr
			})
			.map(record => record.attendanceDateTime) // 提取时间字符串
			.sort() // 按时间排序
	}

	/**
	 * 初始化热力图
	 * 创建ECharts热力图实例，展示考勤数据的热力图可视化
	 *
	 * @returns {void}
	 */
	const initHeatmapChart = () => {
		// 检查图表容器是否存在
		if (!heatmapChart.value) { return }

		// 如果已有实例，先销毁
		if (heatmapInstance.value) {
			heatmapInstance.value.dispose()
		}

		// 创建新的ECharts实例
		heatmapInstance.value = echarts.init(heatmapChart.value)

		// 生成热力图数据
		const heatmapData = generateHeatmapData()

		// 检查数据是否有效
		if (!heatmapData || !Array.isArray(heatmapData) || heatmapData.length === 0) {
			return
		}

		// 计算最大值，用于颜色映射
		const maxValue = Math.max(...heatmapData.map(item => item[2]), 1)

		const option = {
			backgroundColor: 'transparent',
			tooltip: {
				position: 'top',
				backgroundColor: 'rgba(255,255,255,0.9)',
				borderColor: '#ddd',
				textStyle: {
					color: '#333'
				},
				formatter(params) {
					if (!params || !params.data || !Array.isArray(params.data)) {
						return ''
					}
					const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
					const timeSlots = ['上午', '下午', '晚上']
					return `${weekDays[params.data[0]]} ${timeSlots[params.data[1]]}<br/>签到次数: ${params.data[2]}`
				}
			},
			grid: {
				height: '70%',
				top: '10%',
				left: '8%',
				right: '8%',
				bottom: '15%'
			},
			xAxis: {
				type: 'category',
				data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
				splitArea: {
					show: true,
					areaStyle: {
						color: 'rgba(0,0,0,0.02)'
					}
				},
				axisLabel: {
					color: '#666',
					fontSize: 12
				},
				axisLine: {
					lineStyle: {
						color: '#ddd'
					}
				}
			},
			yAxis: {
				type: 'category',
				data: ['上午', '下午', '晚上'],
				splitArea: {
					show: true,
					areaStyle: {
						color: 'rgba(0,0,0,0.02)'
					}
				},
				axisLabel: {
					color: '#666',
					fontSize: 12
				},
				axisLine: {
					lineStyle: {
						color: '#ddd'
					}
				}
			},
			visualMap: {
				min: 0,
				max: maxValue,
				calculable: false,
				orient: 'horizontal',
				left: 'center',
				bottom: '3%',
				itemWidth: 25,
				itemHeight: 250,
				textStyle: {
					color: '#666',
					fontSize: 12
				},
				inRange: {
					color: ['#fef3c7', '#fde68a', '#f59e0b', '#d97706', '#b45309', '#92400e']
				}
			},
			series: [{
				name: '签到次数',
				type: 'heatmap',
				data: heatmapData,
				label: {
					show: true,
					color: '#1f2937',
					fontSize: 11,
					fontWeight: 'bold'
				},
				emphasis: {
					itemStyle: {
						shadowBlur: 15,
						shadowColor: 'rgba(0, 0, 0, 0.3)',
						borderWidth: 2,
						borderColor: '#fff'
					}
				},
				itemStyle: {
					borderRadius: 4,
					borderWidth: 1,
					borderColor: 'rgba(0,0,0,0.1)'
				}
			}]
		}

		heatmapInstance.value.setOption(option)
	}

	/**
	 * 初始化折线图
	 * 创建ECharts折线图实例，展示考勤数据的累计趋势
	 *
	 * @returns {void}
	 */
	const initLineChart = () => {
		// 检查图表容器是否存在
		if (!lineChart.value) { return }

		// 如果已有实例，先销毁
		if (lineInstance.value) {
			lineInstance.value.dispose()
		}

		// 创建新的ECharts实例
		lineInstance.value = echarts.init(lineChart.value)

		// 生成折线图数据
		const lineData = generateLineData()

		// 检查数据是否有效
		if (!lineData || !lineData.dates || !lineData.values || lineData.dates.length === 0) {
			return
		}

		/**
		 * ECharts折线图配置选项
		 * 配置图表样式、工具提示、坐标轴、数据系列等
		 */
		const option = {
			backgroundColor: 'transparent', // 透明背景
			tooltip: {
				trigger: 'axis', // 坐标轴触发
				backgroundColor: 'rgba(255,255,255,0.9)', // 半透明白色背景
				borderColor: '#ddd',
				textStyle: {
					color: '#333'
				},
				// 自定义工具提示格式化函数
				formatter(params) {
					if (!params || !params[0] || !params[0].axisValue) {
						return ''
					}
					// 格式化日期为YYYY-MM-DD格式
					const date = new Date(params[0].axisValue)
					const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
					return `${formattedDate}<br/>累计签到次数: ${params[0].value}`
				}
			},
			grid: {
				// 图表网格布局，留出边距
				left: '8%',
				right: '8%',
				bottom: '12%',
				top: '12%',
				containLabel: true // 包含坐标轴标签
			},
			xAxis: {
				type: 'time', // 时间类型坐标轴
				boundaryGap: false, // 不留边界间隙
				axisLabel: {
					color: '#666',
					fontSize: 11,
					rotate: 45, // 标签旋转45度
					// 自定义标签格式化函数，显示月/日
					formatter(value) {
						const date = new Date(value)
						return `${date.getMonth() + 1}/${date.getDate()}`
					}
				},
				axisLine: {
					lineStyle: {
						color: '#ddd'
					}
				},
				splitLine: {
					show: true, // 显示分割线
					lineStyle: {
						color: 'rgba(0,0,0,0.05)' // 浅色分割线
					}
				}
			},
			yAxis: {
				type: 'value', // 数值类型坐标轴
				name: '累计签到次数', // Y轴名称
				nameTextStyle: {
					color: '#666',
					fontSize: 12
				},
				axisLabel: {
					color: '#666',
					fontSize: 11
				},
				axisLine: {
					lineStyle: {
						color: '#ddd'
					}
				},
				splitLine: {
					lineStyle: {
						color: 'rgba(0,0,0,0.05)' // 浅色分割线
					}
				}
			},
			series: [{
				name: '累计签到次数',
				type: 'line', // 折线图
				smooth: true, // 平滑曲线
				symbol: 'circle', // 数据点符号为圆形
				symbolSize: 6, // 符号大小
				lineStyle: {
					color: '#4fc3f7', // 线条颜色（蓝色）
					width: 3 // 线条宽度
				},
				itemStyle: {
					color: '#4fc3f7', // 数据点颜色
					borderColor: '#fff', // 边框颜色
					borderWidth: 2 // 边框宽度
				},
				areaStyle: {
					// 区域填充样式，使用线性渐变
					color: {
						type: 'linear',
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [{
							offset: 0, color: 'rgba(79, 195, 247, 0.3)' // 顶部较深
						}, {
							offset: 1, color: 'rgba(79, 195, 247, 0.05)' // 底部较浅
						}]
					}
				},
				emphasis: {
					// 鼠标悬停时的样式
					itemStyle: {
						color: '#0288d1', // 更深的蓝色
						borderColor: '#fff',
						borderWidth: 3,
						shadowBlur: 10, // 阴影模糊
						shadowColor: 'rgba(79, 195, 247, 0.5)' // 阴影颜色
					},
					lineStyle: {
						width: 4 // 悬停时线条更粗
					}
				},
				// 数据格式：[日期, 累计签到次数]
				data: lineData.dates.map((date, index) => [date, lineData.values[index]])
			}]
		}

		// 应用配置到图表实例
		lineInstance.value.setOption(option)
	}

	/**
	 * 生成热力图数据
	 * 根据考勤记录统计每周各时间段（星期×时间段）的签到次数
	 *
	 * @returns {Array<Array<number>>} 热力图数据数组，格式为[星期索引(0-6), 时间段索引(0-2), 签到次数]
	 * @description 数据格式说明：
	 *   - 第一个元素：星期索引（0=周一，1=周二，...，6=周日）
	 *   - 第二个元素：时间段索引（0=上午，1=下午，2=晚上）
	 *   - 第三个元素：该时间段在该星期的签到次数
	 */
	const generateHeatmapData = () => {
		const data = []
		// 星期数组，索引对应0-6
		const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
		// 时间段数组，索引对应0-2
		const timeSlots = ['上午', '下午', '晚上']

		// 获取所有考勤记录
		const records = allStudentAttendanceRecords.value || []

		// 如果没有记录，返回全0数据
		if (!records || !Array.isArray(records) || records.length === 0) {
			weekDays.forEach((day, dayIndex) => {
				timeSlots.forEach((slot, slotIndex) => {
					// 为每个星期×时间段组合创建数据点，签到次数为0
					data.push([dayIndex, slotIndex, 0])
				})
			})
			return data
		}

		// 遍历每个星期×时间段组合
		weekDays.forEach((day, dayIndex) => {
			timeSlots.forEach((slot, slotIndex) => {
				let count = 0
				// 统计该星期×时间段的签到次数
				records.forEach(record => {
					if (!record || !record.attendanceDateTime) { return }

					// 解析考勤时间
					const date = new Date(record.attendanceDateTime)
					if (isNaN(date.getTime())) { return }

					// 计算星期几（0=周日，1=周一，...，6=周六）
					// 转换为我们的索引（0=周一，...，6=周日）
					const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1
					const hour = date.getHours()

					// 如果记录属于当前星期
					if (dayOfWeek === dayIndex) {
						// 根据时间段判断（上午：8-11点，下午：14-17点，晚上：19-22点）
						if (slot === '上午' && hour >= 8 && hour < 11) {
							count += 1
						} else if (slot === '下午' && hour >= 14 && hour < 17) {
							count += 1
						} else if (slot === '晚上' && hour >= 19 && hour < 22) {
							count += 1
						}
					}
				})
				// 添加数据点：[星期索引, 时间段索引, 签到次数]
				data.push([dayIndex, slotIndex, count])
			})
		})

		return data
	}

	/**
	 * 生成折线图数据
	 * 根据考勤记录统计每日签到次数，并计算累计签到次数
	 *
	 * @returns {Object} 折线图数据对象
	 * @property {Array<string>} dates - 日期数组（YYYY-MM-DD格式），已排序
	 * @property {Array<number>} values - 累计签到次数数组，与dates一一对应
	 * @description 数据生成流程：
	 *   1. 统计每日签到次数
	 *   2. 按日期排序
	 *   3. 计算累计签到次数（累加每日签到次数）
	 */
	const generateLineData = () => {
		// 使用Map存储每日签到次数，key为日期字符串，value为签到次数
		const dateMap = new Map()

		// 获取所有考勤记录
		const records = allStudentAttendanceRecords.value || []

		// 如果没有记录，返回空数据
		if (!records || !Array.isArray(records) || records.length === 0) {
			return {
				dates: [],
				values: []
			}
		}

		// 遍历所有记录，统计每日签到次数
		records.forEach(record => {
			if (!record || !record.attendanceDateTime) { return }

			// 解析考勤时间
			const date = new Date(record.attendanceDateTime)
			if (isNaN(date.getTime())) { return }

			// 提取日期部分（YYYY-MM-DD）
			const [dateStr] = date.toISOString().split('T')
			// 累加该日期的签到次数
			dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1)
		})

		// 获取所有日期并排序
		const sortedDates = Array.from(dateMap.keys()).sort()
		// 获取每日签到次数数组（按日期顺序）
		const dailyValues = sortedDates.map(date => dateMap.get(date))

		// 计算累计签到次数
		let cumulativeSum = 0
		const cumulativeValues = dailyValues.map(value => {
			// 累加每日签到次数
			cumulativeSum += value
			return cumulativeSum
		})

		// 返回日期数组和累计签到次数数组
		return {
			dates: sortedDates,
			values: cumulativeValues
		}
	}

	/**
	 * 打开热力图对话框
	 * 获取指定学生的考勤记录并显示热力图可视化
	 *
	 * @param {Object} student - 学生对象
	 * @returns {Promise<void>}
	 */
	const openHeatmapDialog = async student => {
		// 保存当前学生信息和滚动位置
		currentStudentInfo.value = student
		scrollPosition.value = window.pageYOffset || document.documentElement.scrollTop

		/**
		 * 恢复滚动位置
		 * 延迟执行以确保DOM更新完成
		 */
		const restoreScroll = () => {
			setTimeout(() => {
				window.scrollTo(0, scrollPosition.value)
			}, 50)
		}

		try {
			isLoading.value = true
			restoreScroll()
			// 调用API获取学生考勤记录
			const response = await getStudentAttendanceRecords(student.studentId)
			if (response.code === 200) {
				// 更新考勤记录列表
				allStudentAttendanceRecords.value = response.data || []
				// 显示热力图对话框
				heatmapDialogVisible.value = true

				// 等待DOM更新后初始化热力图
				await nextTick()
				initHeatmapChart()
			} else {
				ElMessage.error(response.message || '获取考勤记录失败')
			}
		} catch (error) {
			ElMessage.error(`获取考勤记录失败：${error.message}`)
		} finally {
			isLoading.value = false
			restoreScroll()
		}
	}

	/**
	 * 打开趋势图对话框
	 * 获取指定学生的考勤记录并显示折线趋势图
	 *
	 * @param {Object} student - 学生对象
	 * @returns {Promise<void>}
	 */
	const openTrendDialog = async student => {
		// 保存当前学生信息和滚动位置
		currentStudentInfo.value = student
		scrollPosition.value = window.pageYOffset || document.documentElement.scrollTop

		/**
		 * 恢复滚动位置
		 * 延迟执行以确保DOM更新完成
		 */
		const restoreScroll = () => {
			setTimeout(() => {
				window.scrollTo(0, scrollPosition.value)
			}, 50)
		}

		try {
			isLoading.value = true
			restoreScroll()
			// 调用API获取学生考勤记录
			const response = await getStudentAttendanceRecords(student.studentId)
			if (response.code === 200) {
				// 更新考勤记录列表
				allStudentAttendanceRecords.value = response.data || []
				// 显示趋势图对话框
				trendDialogVisible.value = true

				// 等待DOM更新后初始化折线图
				await nextTick()
				initLineChart()
			} else {
				ElMessage.error(response.message || '获取考勤记录失败')
			}
		} catch (error) {
			ElMessage.error(`获取考勤记录失败：${error.message}`)
		} finally {
			isLoading.value = false
			restoreScroll()
		}
	}

	/**
	 * 管理员身份认证
	 * 验证特殊密码（管理员密码）并初始化管理员模式
	 *
	 * @returns {Promise<void>}
	 */
	const authenticate = async () => {
		// 验证密码是否为空
		if (!specialPassword.value.trim()) {
			ElMessage({
				message: '请输入特殊密码',
				type: 'error',
				duration: 3000
			})
			return
		}

		// 开始认证加载
		authLoading.value = true

		try {
			// 使用新增的特殊密码验证接口
			const response = await validateSpecialPassword(specialPassword.value)
			if (response.code === 200) {
				// 认证成功，设置认证状态
				isAuthenticated.value = true
				// 保存密码到store，用于后续API调用
				adminStore.setAdminPassword(specialPassword.value)
				ElMessage({
					message: response.message,
					type: 'success',
					duration: 3000
				})
				// 传入密码加载所有数据
				await loadAllData(specialPassword.value)
			} else {
				// 认证失败，显示错误消息
				ElMessage({
					message: response.message,
					type: 'error',
					duration: 3000
				})
			}
		} catch (error) {
			// 捕获异常，显示错误消息
			ElMessage({
				message: error.message,
				type: 'error',
				duration: 3000
			})
		} finally {
			// 结束认证加载状态
			authLoading.value = false
		}
	}

	/**
	 * 退出管理员模式
	 * 清除管理员密码、重置认证状态、清空数据
	 */
	const logout = () => {
		// 清除store中的管理员密码
		adminStore.clearAdminPassword()
		// 重置认证状态
		isAuthenticated.value = false
		// 重置数据加载状态
		isDataLoaded.value = false
		// 清空特殊密码输入
		specialPassword.value = ''
		// 清空认证错误信息
		authError.value = ''
		// 清空学生列表
		students.value = []
		ElMessage.success('已退出管理员模式')
	}

	/**
	 * 月份中英文映射表
	 * 用于将Element Plus日期选择器的英文月份转换为中文
	 *
	 * @type {Object<string, string>}
	 */
	const monthMap = {
		January: '一月',
		February: '二月',
		March: '三月',
		April: '四月',
		May: '五月',
		June: '六月',
		July: '七月',
		August: '八月',
		September: '九月',
		October: '十月',
		November: '十一月',
		December: '十二月'
	}

	/**
	 * 星期中英文映射表
	 * 用于将Element Plus日期选择器的英文星期转换为中文
	 *
	 * @type {Object<string, string>}
	 */
	const weekDayMap = {
		Sun: '日',
		Sunday: '日',
		Mon: '一',
		Monday: '一',
		Tue: '二',
		Tuesday: '二',
		Wed: '三',
		Wednesday: '三',
		Thu: '四',
		Thursday: '四',
		Fri: '五',
		Friday: '五',
		Sat: '六',
		Saturday: '六'
	}

	/**
	 * 月份观察器实例
	 * 用于监听日期选择器DOM变化，实现月份中文化
	 *
	 * @type {MutationObserver|null}
	 */
	let monthObserver = null

	/**
	 * 设置中文月份
	 * 查找日期选择器中的月份标签，将英文月份替换为中文
	 */
	const setChineseMonth = () => {
		// 查找日期选择器的弹出层
		const popper = document.querySelector('.makeup-date-picker-popper')
		if (popper) {
			// 查找所有月份标签
			const headerLabels = popper.querySelectorAll('.el-date-picker__header-label')
			headerLabels.forEach(label => {
				const text = label.textContent.trim()
				// 遍历月份映射表，查找匹配的英文月份并替换为中文
				for (const [enMonth, cnMonth] of Object.entries(monthMap)) {
					if (text.includes(enMonth)) {
						const newText = text.replace(enMonth, cnMonth)
						label.textContent = newText
						break
					}
				}
			})
		}
	}

	/**
	 * 设置中文星期
	 * 查找日期选择器中的星期标签，将英文星期替换为中文
	 */
	const setChineseWeekDays = () => {
		// 查找日期选择器的弹出层
		const popper = document.querySelector('.makeup-date-picker-popper')
		if (popper) {
			// 查找所有星期标签（表头）
			const weekDayCells = popper.querySelectorAll('.el-date-table th')
			weekDayCells.forEach(cell => {
				const text = cell.textContent.trim()
				if (text) {
					// 遍历星期映射表，查找匹配的英文星期
					for (const [enDay, cnDay] of Object.entries(weekDayMap)) {
						if (text === enDay || text.includes(enDay)) {
							// 清除原有子节点内容
							const childNodes = Array.from(cell.childNodes)
							childNodes.forEach(node => {
								if (node.nodeType === Node.TEXT_NODE) {
									// 文本节点：清空内容
									node.textContent = ''
								} else if (node.nodeType === Node.ELEMENT_NODE) {
									// 元素节点：隐藏
									node.style.display = 'none'
									node.style.fontSize = '0'
									node.style.opacity = '0'
									node.style.visibility = 'hidden'
								}
							})
							// 如果还没有中文星期标签，创建一个
							if (!cell.querySelector('.chinese-weekday')) {
								const cnSpan = document.createElement('span')
								cnSpan.className = 'chinese-weekday'
								cnSpan.textContent = cnDay
								// 设置样式，确保中文星期显示在中央
								cnSpan.style.cssText = 'font-size: 20px !important; font-weight: 600 !important; display: block !important; position: absolute !important; top: 50% !important; left: 50% !important; transform: translate(-50%, -50%) !important; color: #606266 !important; line-height: 1 !important; width: 100% !important; text-align: center !important;'
								cell.appendChild(cnSpan)
							}
							break
						}
					}
				}
			})
		}
	}

	/**
	 * 打开补卡对话框
	 * 初始化补卡表单并显示对话框，设置日期选择器的中文化
	 *
	 * @param {Object} student - 要补卡的学生对象
	 * @returns {Promise<void>}
	 */
	const openMakeupDialog = async student => {
		// 设置选中的学生
		makeupSelectedStudent.value = student
		// 重置补卡表单
		makeupForm.value.attendanceTime = ''
		makeupForm.value.selectedDate = ''
		makeupForm.value.selectedHour = null
		// 重置步骤为日期选择
		makeupStep.value = 'date'
		// 显示对话框
		makeupDialogVisible.value = true
		// 等待DOM更新
		await nextTick()

		// 延迟执行，确保日期选择器已渲染
		setTimeout(() => {
			// 自动聚焦并打开日期选择器
			const datePickerInput = document.querySelector('.makeup-date-picker input')
			if (datePickerInput) {
				datePickerInput.focus()
				datePickerInput.click()
			}

			// 多次尝试设置中文化（因为DOM可能延迟渲染）
			setChineseMonth()
			setChineseWeekDays()

			setTimeout(() => {
				setChineseMonth()
				setChineseWeekDays()
			}, 200)

			setTimeout(() => {
				setChineseMonth()
				setChineseWeekDays()
			}, 500)

			setTimeout(() => {
				setChineseMonth()
				setChineseWeekDays()
			}, 800)
		}, 100)

		// 如果已有观察器，先断开
		if (monthObserver) {
			monthObserver.disconnect()
		}

		// 创建新的MutationObserver，监听DOM变化并自动设置中文化
		monthObserver = new MutationObserver(() => {
			setChineseMonth()
			setChineseWeekDays()
		})

		// 延迟观察，确保弹出层已创建
		setTimeout(() => {
			const popper = document.querySelector('.makeup-date-picker-popper')
			if (popper) {
				// 开始观察DOM变化
				monthObserver.observe(popper, {
					childList: true, // 监听子节点变化
					subtree: true, // 监听所有后代节点
					characterData: true // 监听文本内容变化
				})
			}
		}, 200)
	}

	/**
	 * 取消补卡
	 * 关闭补卡对话框并重置表单，断开观察器
	 */
	const cancelMakeup = () => {
		// 断开并清空观察器
		if (monthObserver) {
			monthObserver.disconnect()
			monthObserver = null
		}
		// 关闭对话框
		makeupDialogVisible.value = false
		// 重置表单
		makeupFormRef.value?.resetFields()
		// 清空选中的学生
		makeupSelectedStudent.value = null
		// 重置表单数据
		makeupForm.value.selectedDate = ''
		makeupForm.value.selectedHour = null
		// 重置步骤
		makeupStep.value = 'date'
	}

	/**
	 * 处理日期变化
	 * 当补卡日期选择器日期变化时的处理函数
	 * 当前为空实现，可根据需要添加逻辑
	 */
	const handleDateChange = () => {
		// 日期变化处理逻辑（预留接口）
	}

	/**
	 * 格式化选中的日期
	 * 将日期字符串格式化为中文格式（YYYY年MM月DD日）
	 *
	 * @returns {string} 格式化后的日期字符串
	 */
	const formatSelectedDate = () => {
		if (!makeupForm.value.selectedDate) { return '' }
		const date = new Date(makeupForm.value.selectedDate)
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		return `${year}年${month}月${day}日`
	}

	/**
	 * 确认日期选择步骤
	 * 验证日期表单，通过后切换到时间选择步骤
	 *
	 * @returns {Promise<void>}
	 */
	const confirmDateStep = async () => {
		if (!makeupFormRef.value) { return }
		try {
			// 验证表单
			await makeupFormRef.value.validate()
			// 切换到时间选择步骤
			makeupStep.value = 'hour'
			// 重置选中的小时
			makeupForm.value.selectedHour = null
		} catch {
			// 验证失败，不切换步骤
			return
		}
	}

	/**
	 * 选择日期时间快捷选项
	 * 根据快捷选项自动设置日期和时间，并切换到时间选择步骤
	 *
	 * @param {Object} shortcut - 快捷选项对象
	 * @param {string} shortcut.key - 快捷选项键值
	 * @param {number} shortcut.dateOffset - 日期偏移量
	 * @param {string} shortcut.timeSlot - 时间段
	 * @param {number} shortcut.defaultHour - 默认小时
	 */
	const selectDatetimeShortcut = shortcut => {
		// 设置日期（根据偏移量计算）
		const dateValue = getShortcutDate(shortcut)
		makeupForm.value.selectedDate = dateValue

		// 设置默认时间（该时间段的首个时间）
		makeupForm.value.selectedHour = shortcut.defaultHour

		// 更新补卡时间（组合日期和小时）
		updateAttendanceTime()

		// 自动切换到时间选择步骤
		makeupStep.value = 'hour'
	}

	/**
	 * 检查日期时间快捷选项是否被选中
	 * 判断当前选择的日期和时间是否匹配指定的快捷选项
	 *
	 * @param {Object} shortcut - 快捷选项对象
	 * @returns {boolean} 是否匹配该快捷选项
	 */
	const isDatetimeShortcutSelected = shortcut => {
		// 如果日期或时间未选择，返回false
		if (!makeupForm.value.selectedDate || makeupForm.value.selectedHour === null) { return false }

		// 检查日期是否匹配
		const shortcutDate = getShortcutDate(shortcut)
		if (makeupForm.value.selectedDate !== shortcutDate) { return false }

		// 检查时间段是否匹配
		const selectedSlot = timeSlots.find(slot => slot.hours.includes(makeupForm.value.selectedHour))
		if (!selectedSlot || selectedSlot.key !== shortcut.timeSlot) { return false }

		return true
	}

	/**
	 * 选择小时
	 * 设置补卡时间的小时数
	 *
	 * @param {number} hour - 小时数（8-22之间的有效值）
	 */
	const selectHour = hour => {
		// 验证小时数是否有效
		if (!validHours.includes(hour)) { return }
		// 设置选中的小时
		makeupForm.value.selectedHour = hour
		// 更新补卡时间
		updateAttendanceTime()
	}

	/**
	 * 检查小时是否被选中
	 * 判断指定的小时数是否为当前选中的小时
	 *
	 * @param {number} hour - 小时数
	 * @returns {boolean} 是否选中
	 */
	const isHourSelected = hour => {
		if (makeupForm.value.selectedHour === null) { return false }
		return makeupForm.value.selectedHour === hour
	}

	/**
	 * 更新补卡时间
	 * 根据选中的日期和小时，组合生成完整的ISO格式时间字符串
	 */
	const updateAttendanceTime = () => {
		if (makeupForm.value.selectedDate && makeupForm.value.selectedHour !== null) {
			const dateStr = makeupForm.value.selectedDate
			// 将小时数格式化为两位数（如：8 -> '08'）
			const hourStr = String(makeupForm.value.selectedHour).padStart(2, '0')
			// 组合为ISO格式时间字符串（YYYY-MM-DDTHH:00:00）
			makeupForm.value.attendanceTime = `${dateStr}T${hourStr}:00:00`
		} else {
			// 如果日期或小时未选择，清空时间
			makeupForm.value.attendanceTime = ''
		}
	}

	/**
	 * 验证补卡时间
	 * 检查补卡时间是否晚于当前时间（补卡时间不能是未来时间）
	 *
	 * @param {string} dateStr - 日期字符串（YYYY-MM-DD格式）
	 * @param {number} hour - 小时数
	 * @returns {boolean} 验证是否通过
	 */
	const validateAttendanceTime = (dateStr, hour) => {
		// 构造选中的时间对象
		const selectedTime = new Date(`${dateStr}T${String(hour).padStart(2, '0')}:00:00`)
		const now = new Date()
		// 如果选中的时间晚于当前时间，提示错误
		if (selectedTime > now) {
			ElMessage.warning('补卡时间不能晚于当前时间')
			return false
		}
		return true
	}

	/**
	 * 提交补卡
	 * 验证补卡信息并调用API提交补卡请求
	 *
	 * @returns {Promise<void>}
	 */
	const submitMakeup = async () => {
		// 如果正在加载，直接返回
		if (makeupLoading.value) { return }
		// 验证时间是否已选择
		if (makeupForm.value.selectedHour === null) {
			ElMessage.warning('请选择补卡时间')
			return
		}
		// 验证日期是否已选择
		if (!makeupForm.value.selectedDate) {
			ElMessage.warning('请选择补卡日期')
			return
		}
		// 验证时间是否有效（不能是未来时间）
		if (!validateAttendanceTime(makeupForm.value.selectedDate, makeupForm.value.selectedHour)) {
			return
		}
		// 更新补卡时间
		updateAttendanceTime()
		// 验证时间是否完整
		if (!makeupForm.value.attendanceTime) {
			ElMessage.warning('补卡时间不完整')
			return
		}
		// 获取管理员密码
		const adminPassword = adminStore.getAdminPassword()
		if (!adminPassword) {
			ElMessage.error('身份验证已过期，请重新登录')
			isAuthenticated.value = false
			adminStore.clearAdminPassword()
			return
		}
		// 开始加载
		makeupLoading.value = true
		try {
			// 调用API提交补卡
			const response = await makeupAttendanceWithSpecialPassword(
				adminPassword,
				makeupSelectedStudent.value.studentId,
				makeupForm.value.attendanceTime
			)
			if (response.code === 200) {
				ElMessage.success('补卡成功')
				// 关闭对话框并重置表单
				cancelMakeup()
				// 刷新学生考勤次数
				await loadStudentAttendanceCounts()
			} else {
				ElMessage.error(response.message || '补卡失败')
			}
		} catch (error) {
			ElMessage.error(error.message || '补卡失败')
		} finally {
			// 结束加载状态
			makeupLoading.value = false
		}
	}

	/**
	 * 打开积分调整对话框
	 * 初始化积分调整表单并显示对话框
	 *
	 * @param {Object} student - 要调整积分的学生对象
	 */
	const openPointsDialog = student => {
		// 验证学生信息是否完整
		if (!student || !student.id) {
			ElMessage.warning('学生信息不完整，无法修改积分')
			return
		}

		// 恢复遮罩层样式，确保可以正常显示
		const dialogWrapper = document.querySelector('.points-dialog-overlay')
		if (dialogWrapper) {
			dialogWrapper.style.display = '' // 清空内联样式
			dialogWrapper.style.visibility = '' // 清空内联样式
			dialogWrapper.style.opacity = '' // 清空内联样式
		}

		// 设置选中的学生
		pointsSelectedStudent.value = student
		// 重置积分调整表单
		pointsForm.value = {
			changePoints: null, // 积分变化量
			adjustReason: '' // 调整原因
		}
		// 显示对话框
		pointsDialogVisible.value = true
	}

	/**
	 * 处理积分对话框关闭
	 * 隐藏对话框并清空表单数据
	 */
	const handlePointsDialogClose = () => {
		// 先直接操作DOM隐藏遮罩层，避免闪烁
		const dialogWrapper = document.querySelector('.points-dialog-overlay')
		if (dialogWrapper) {
			dialogWrapper.style.display = 'none'
			dialogWrapper.style.visibility = 'hidden'
			dialogWrapper.style.opacity = '0'
		}

		// 延迟清空数据，确保弹窗完全关闭后再清空
		setTimeout(() => {
			// 重置表单字段
			pointsFormRef.value?.resetFields()
			// 清空选中的学生
			pointsSelectedStudent.value = null
			// 重置表单数据
			pointsForm.value = {
				changePoints: null,
				adjustReason: ''
			}
		}, 0)
	}

	/**
	 * 取消积分调整
	 * 关闭积分调整对话框
	 */
	const cancelPoints = () => {
		pointsDialogVisible.value = false
	}

	/**
	 * 确认积分调整
	 * 验证表单并调用API创建积分调整记录
	 *
	 * @returns {Promise<void>}
	 */
	const confirmPoints = async () => {
		// 检查表单引用是否存在
		if (!pointsFormRef.value) { return }

		try {
			// 验证表单
			await pointsFormRef.value.validate()

			// 获取管理员密码
			const adminPassword = adminStore.getAdminPassword()
			if (!adminPassword) {
				ElMessage.error('身份验证已过期，请重新登录')
				isAuthenticated.value = false
				adminStore.clearAdminPassword()
				return
			}

			// 验证学生信息是否完整
			if (!pointsSelectedStudent.value || !pointsSelectedStudent.value.id) {
				ElMessage.error('学生信息不完整')
				return
			}

			// 开始加载
			pointsLoading.value = true

			// 调用API创建积分记录
			const response = await createPointsRecord(
				adminPassword,
				pointsForm.value.adjustReason.trim(), // 调整原因（去除首尾空格）
				parseInt(pointsForm.value.changePoints, 10), // 积分变化量（转换为整数）
				pointsSelectedStudent.value.id // 学生数据库主键ID
			)

			if (response.code === 200) {
				ElMessage.success('积分记录创建成功')
				// 关闭对话框（数据清空由 handlePointsDialogClose 处理）
				pointsDialogVisible.value = false
			} else {
				ElMessage.error(response.message || '积分记录创建失败')
			}
		} catch (error) {
			// 处理错误
			if (error.message) {
				ElMessage.error(error.message)
			}
		} finally {
			// 结束加载状态
			pointsLoading.value = false
		}
	}

	/**
	 * 打开积分变更记录对话框
	 * 获取指定学生的所有积分调整记录并显示
	 *
	 * @param {Object} student - 学生对象
	 * @returns {Promise<void>}
	 */
	const openScoreChangeRecordsDialog = async student => {
		// 验证学生信息是否完整
		if (!student || !student.id) {
			ElMessage.warning('学生信息不完整，无法查看改分记录')
			return
		}

		// 设置当前查看的学生
		currentScoreChangeRecordsStudent.value = student
		// 显示对话框
		scoreChangeRecordsDialogVisible.value = true
		// 开始加载
		scoreChangeRecordsLoading.value = true
		// 清空记录列表
		scoreChangeRecords.value = []

		try {
			// 调用API获取积分调整记录
			const response = await getAllAdjustRecordsByStudentInfoId(student.id)
			if (response.code === 200 && Array.isArray(response.data)) {
				// 更新记录列表
				scoreChangeRecords.value = response.data
			} else {
				// 如果数据格式不正确，设置为空数组
				scoreChangeRecords.value = []
			}
		} catch (error) {
			console.error('获取改分记录失败:', error)
			ElMessage.error(`获取改分记录失败：${error.message || '未知错误'}`)
			scoreChangeRecords.value = []
		} finally {
			// 结束加载状态
			scoreChangeRecordsLoading.value = false
		}
	}

	/**
	 * 关闭积分变更记录对话框
	 * 清空对话框状态和数据
	 */
	const closeScoreChangeRecordsDialog = () => {
		scoreChangeRecordsDialogVisible.value = false
		currentScoreChangeRecordsStudent.value = null
		scoreChangeRecords.value = []
	}

	/**
	 * 排序后的积分变更记录
	 * 按创建时间降序排列（最新的在前）
	 *
	 * @type {ComputedRef<Array>}
	 */
	const sortedScoreChangeRecords = computed(() => [...scoreChangeRecords.value].sort((a, b) => {
		const timeA = new Date(a.createTime).getTime()
		const timeB = new Date(b.createTime).getTime()
		return timeB - timeA // 最新的在前
	}))

	/**
	 * 总积分变更点数
	 * 计算所有积分调整记录的积分变化总和
	 *
	 * @type {ComputedRef<number>}
	 */
	const totalScoreChangePoints = computed(() => scoreChangeRecords.value.reduce((sum, r) => sum + r.adjustPoints, 0))

	/**
	 * 格式化时间字符串
	 * 将ISO格式时间字符串格式化为 YYYY-MM-DD HH:mm 格式
	 *
	 * @param {string} timeString - 时间字符串（ISO格式）
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
			// 如果解析失败，返回原字符串
			return timeString
		}
	}

	/**
	 * 加载所有数据
	 * 按步骤加载学生列表、统计数据、等级、考勤、积分、管理员、头像等所有数据
	 *
	 * @param {string} adminPassword - 管理员密码
	 * @returns {Promise<void>}
	 */
	const loadAllData = async adminPassword => {
		// 总步骤数（用于计算进度百分比）
		const totalSteps = 7

		/**
		 * 更新加载进度
		 * @param {number} step - 当前步骤（1-7）
		 * @param {string} status - 状态描述文本
		 */
		const updateProgress = (step, status) => {
			loadingProgress.value = (step / totalSteps) * 100
			loadingStatus.value = status
		}

		try {
			// 步骤1：获取学生数据
			updateProgress(1, '正在获取学生数据...')
			// 使用已验证的密码直接获取学生数据，避免重复验证
			const response = await getAllStudentsWithSpecialPassword(adminPassword)
			// 检查响应是否存在以及code是否为200
			if (!response || response.code !== 200) {
				ElMessage.error('获取学生数据失败')
				// 不清除认证状态，因为密码已经验证过了
				return
			}

			// 更新学生列表和总数
			students.value = response.data
			totalStudents.value = response.data.length

			// 步骤2：加载统计数据（今日和本月考勤总数）
			updateProgress(2, '正在加载统计数据...')
			await loadStatistics()

			// 步骤3：加载学生等级
			updateProgress(3, '正在加载学生等级...')
			await loadStudentLevels()

			// 步骤4：加载考勤数据（每个学生的签到次数）
			updateProgress(4, '正在加载考勤数据...')
			await loadStudentAttendanceCounts()

			// 步骤5：加载积分信息（每个学生的总积分）
			updateProgress(5, '正在加载积分信息...')
			await loadStudentPoints()

			// 步骤6：加载管理员信息（每个学生的所属管理员）
			updateProgress(6, '正在加载管理员信息...')
			await loadStudentAdmins()

			// 步骤7：加载学生头像
			updateProgress(6, '正在加载学生头像...')
			await loadStudentAvatars()

			// 完成：标记数据已加载
			updateProgress(7, '数据加载完成！')

			// 延迟500ms后标记数据加载完成（给用户看到完成提示）
			setTimeout(() => {
				isDataLoaded.value = true
			}, 500)
		} catch (error) {
			ElMessage.error(`加载数据失败：${error.message}`)
			// 不应该在这里清除认证状态，因为密码验证已经成功
			// isAuthenticated.value = false
			// adminStore.clearAdminPassword()
			// 只是数据加载失败，仍保持认证状态，让用户可以重试
		}
	}

	onMounted(async () => {
		document.title = '超级管理员控制台 - AI坊学生管理系统'

		const adminPassword = adminStore.getAdminPassword()
		if (adminPassword) {
			// 如果已有密码，直接验证并加载数据
			isAuthenticated.value = true
			try {
				await loadAllData(adminPassword)
			} catch (error) {
				ElMessage.error(`加载数据失败：${error.message}`)
			}
		} else {
			isAuthenticated.value = false
		}
	})

	watch(calendarValue, async () => {
		if (attendanceRecordsDialogVisible.value && !isLoading.value) {
			await nextTick()
			initHeatmapChart()
			initLineChart()
		}
	})

	// 返回所有需要导出的变量和函数
	return {
		// 响应式数据
		isAuthenticated,
		specialPassword,
		authError,
		authLoading,
		isLoading,
		isDataLoaded,
		loadingProgress,
		loadingStatus,
		students,
		searchKeyword,
		currentPage,
		pageSize,
		totalStudents,
		todayCount,
		monthlyCount,
		studentLevels,
		studentAttendanceCounts,
		studentAdmins,
		studentPoints,
		activeLevelTab,
		editDialogVisible,
		editFormRef,
		editForm,
		currentEditStudentId,
		todayAttendanceDialogVisible,
		todayAttendanceRecords,
		attendanceRecordsDialogVisible,
		currentStudentInfo,
		calendarValue,
		scrollPosition,
		allStudentAttendanceRecords,
		calendarSlots,
		filteredStudentAttendanceRecords,
		heatmapDialogVisible,
		trendDialogVisible,
		heatmapChart,
		lineChart,
		heatmapInstance,
		lineInstance,
		showDateDetailsDialog,
		selectedDate,
		makeupDialogVisible,
		makeupLoading,
		makeupSelectedStudent,
		makeupStep,
		makeupFormRef,
		datePickerRef,
		makeupForm,
		pointsDialogVisible,
		pointsLoading,
		pointsSelectedStudent,
		pointsFormRef,
		pointsForm,
		scoreChangeRecordsDialogVisible,
		scoreChangeRecordsLoading,
		scoreChangeRecords,
		currentScoreChangeRecordsStudent,
		datetimeShortcuts,
		levelOptions,
		adminOptions,
		filteredStudents,
		currentLevelStudents,
		editFormRules,
		pointsFormRules,
		makeupDateFormRules,

		// 函数
		getLevelStudents,
		changeLevel,
		changeAdmin,
		loadStudentLevels,
		loadStudentAttendanceCounts,
		loadStudentPoints,
		loadStudentAdmins,
		loadStudentAvatars,
		handleAvatarError,
		loadStatistics,
		refreshData,
		openEditDialog,
		cancelEdit,
		confirmEdit,
		showTodayAttendance,
		formatAttendanceTime,
		getTimePeriodClass,
		getTimePeriodName,
		isSlotSigned,
		openDateDetails,
		openAttendanceRecordsDialog,
		closeAttendanceRecordsDialog,
		closeHeatmapDialog,
		closeTrendDialog,
		formatDateForDisplay,
		formatCalendarTitle,
		prevMonth,
		nextMonth,
		goToday,
		getTimeSlotLabel,
		getDateAttendanceTimes,
		initHeatmapChart,
		initLineChart,
		generateHeatmapData,
		generateLineData,
		openHeatmapDialog,
		openTrendDialog,
		authenticate,
		logout,
		getShortcutDate,
		setChineseMonth,
		setChineseWeekDays,
		openMakeupDialog,
		cancelMakeup,
		handleDateChange,
		formatSelectedDate,
		confirmDateStep,
		selectDatetimeShortcut,
		isDatetimeShortcutSelected,
		selectHour,
		isHourSelected,
		updateAttendanceTime,
		validateAttendanceTime,
		submitMakeup,
		openPointsDialog,
		handlePointsDialogClose,
		cancelPoints,
		confirmPoints,
		openScoreChangeRecordsDialog,
		closeScoreChangeRecordsDialog,
		formatTime,
		loadAllData,

		// 常量
		timeSlots,
		validHours,
		sortedScoreChangeRecords,
		totalScoreChangePoints,
		toggleTheme
	}
}
