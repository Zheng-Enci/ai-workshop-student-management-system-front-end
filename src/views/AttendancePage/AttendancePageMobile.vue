<script setup lang="ts">
/**
 * 签到页面组件(移动端)
 *
 * @description 学生签到功能页面,展示当前时段签到状态和历史记录(移动端)
 * @component AttendancePageMobile
 * @author 开发人员
 * @version 1.0.0
 */

// ======================== 依赖导入区 ========================
// Element Plus 组件及消息提示
import {ElMessage, ElButton, ElIcon, ElDialog, ElInput} from 'element-plus'
// Vue3 核心响应式API及生命周期钩子
import {ref, onMounted, onUnmounted} from 'vue'
// Element Plus 基础样式（按需导入）
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-popper.css'
import 'element-plus/theme-chalk/el-overlay.css'
// 本周签到概览样式
import './css/mobile/attendance-mobile-weekly-overview.css'
// Element Plus 图标组件
import {Check, ArrowLeft, Clock, Calendar, Sunrise, Sunny, Moon, Monitor, User, Loading} from '@element-plus/icons-vue'
// Vue Router 路由跳转
import {useRouter} from 'vue-router'

// 业务接口导入
import {signIn} from '@/api/attendance' // 签到提交接口
import {getStudentDatabaseTableId, getAvatarUrl} from '@/api/student' // 学生信息及头像接口
import AttendanceApi from '@/api/ts/AttendanceApi' // 签到相关API接口
// Pinia 状态管理
import {useThemeStore} from '@/stores/theme' // 主题切换状态
import {useUserStore} from '@/stores/user' // 用户信息状态
// 页面配置常量
import AttendancePageConfig from '@/views/AttendancePage/js/AttendancePageConfig'

// ======================== 响应式变量定义区 ========================
/** 通用加载状态 - 用于按钮/接口请求加载中展示 */
const loading = ref(false)
/** 用户状态仓库实例 - 获取登录态、用户信息 */
const userStore = useUserStore()
/** 主题状态仓库实例 - 用于切换明暗主题 */
const themeStore = useThemeStore()
/** 解构主题切换方法 */
const {toggleTheme} = themeStore
/** 路由实例 - 用于页面跳转 */
const router = useRouter()
/** 学生等级 - 预留扩展字段，暂未使用 */
const studentLevel = ref(0)
/** 是否处于签到时间段内 - 控制签到按钮可点击状态 */
const isInSignTime = ref(false)
/** 当前时间字符串 - 格式：HH:MM:SS，实时更新 */
const currentTime = ref('')
/** 当前日期字符串 - 格式：YYYY年MM月DD日，实时更新 */
const currentDate = ref('')
/** 下次签到时间提示文本 - 非签到时段展示 */
const nextSignTime = ref('')
/** 定时器实例 - 用于实时更新时间，组件卸载时清除 */
const timeInterval = ref(null)
/** 验证码弹窗显示状态 - 控制弹窗显隐 */
const showVerificationCodeDialog = ref(false)
/** 用户输入的验证码 - 双向绑定输入框 */
const inputVerificationCode = ref('')
/** 当日签到状态对象 - 存储早中晚三个时段的签到时间 */
const attendanceStatus = ref({
	morning: null, // 上午签到时间（ISO格式），null表示未签到
	afternoon: null, // 下午签到时间（ISO格式）
	evening: null // 晚上签到时间（ISO格式）
})

// 头像相关响应式变量
/** 是否有用户头像 - 控制默认头像/自定义头像展示 */
const hasAvatar = ref(false)
/** 用户头像URL - 成功获取后赋值 */
const avatarUrl = ref(null)
/** 头像提示是否已显示 - 控制"上传头像"提示只显示一次 */
const avatarTipShown = ref(false)

// 本周签到概览相关响应式变量
/** 本周每天的签到数据 */
const weeklyAttendanceData = ref([
	{ date: '', dayName: '周一', slots: { morning: false, afternoon: false, evening: false } },
	{ date: '', dayName: '周二', slots: { morning: false, afternoon: false, evening: false } },
	{ date: '', dayName: '周三', slots: { morning: false, afternoon: false, evening: false } },
	{ date: '', dayName: '周四', slots: { morning: false, afternoon: false, evening: false } },
	{ date: '', dayName: '周五', slots: { morning: false, afternoon: false, evening: false } },
	{ date: '', dayName: '周六', slots: { morning: false, afternoon: false, evening: false } },
	{ date: '', dayName: '周日', slots: { morning: false, afternoon: false, evening: false } }
])
/** 本周签到数据加载状态 */
const weeklyAttendanceLoading = ref(false)
/** 学生数据库表主键ID */
const studentInfoId = ref(null)
/** 今日签到状态（从服务器获取） */
const todayAttendanceSlots = ref({ morning: false, afternoon: false, evening: false })

// ======================== 业务逻辑方法区 ========================
/**
 * 展示默认头像并提示上传
 * @description 当用户未上传头像时调用，显示默认图标并给出上传提示（仅首次）
 * @function showDefaultAvatar
 * @returns {void}
 */
const showDefaultAvatar = () => {
	hasAvatar.value = false
	avatarUrl.value = null
	// 提示用户上传头像（只显示一次）
	if (!avatarTipShown.value) {
		ElMessage.info({
			message: '您还没有上传头像，点击头像即可上传',
			duration: 4000, // 提示显示4秒
			showClose: true // 显示关闭按钮
		})
		avatarTipShown.value = true // 标记提示已显示，避免重复触发
	}
}

/**
 * 处理头像点击事件
 * @description 点击头像跳转到个人资料页面，用于上传/修改头像
 * @function handleAvatarClick
 * @returns {void}
 */
const handleAvatarClick = () => {
	router.push('/profile')
}

/**
 * 加载用户头像
 * @description 从接口获取学生ID，再获取头像URL，失败则显示默认头像
 * 加载流程:
 * 1. 验证登录token是否存在
 * 2. 调用接口获取学生数据库ID
 * 3. 根据ID和配置尺寸构建头像URL
 * 4. 更新头像显示状态
 * @function loadUserAvatar
 * @async
 * @returns {Promise<void>}
 */
const loadUserAvatar = async () => {
	try {
		// 从本地存储获取登录token
		const token = localStorage.getItem('token')
		if (!token) { // 无token直接显示默认头像
			showDefaultAvatar()
			return
		}

		// 获取学生数据库ID（用于拼接头像URL）
		const idResponse = await getStudentDatabaseTableId(token)
		if (idResponse.code !== 200 || !idResponse.data) { // 接口返回异常
			showDefaultAvatar()
			return
		}

		// 拼接头像URL（传入学生ID和配置的头像尺寸）
		const studentInfoId = idResponse.data
		const avatarUrlString = getAvatarUrl(studentInfoId, AttendancePageConfig.AVATAR_SIZE)

		if (!avatarUrlString) { // 头像URL为空
			showDefaultAvatar()
			return
		}

		// 成功获取头像，更新状态
		avatarUrl.value = avatarUrlString
		hasAvatar.value = true
	} catch (error) { // 捕获所有异常，避免页面崩溃
		console.error('加载用户头像失败:', error)
		showDefaultAvatar()
	}
}

/**
 * 返回导航页面
 * @description 点击返回按钮时触发，跳转到导航主页
 * @function goToNavigation
 * @returns {void}
 */
const goToNavigation = () => {
	router.push('/navigation')
}

/**
 * 获取当前所处的签到时段
 * @description 根据当前小时数判断属于上午/下午/晚上签到时段，非签到时段返回null
 * 签到时段规则:
 * - 上午: 8:00 - 10:59 (8点到11点前)
 * - 下午: 14:00 - 16:59 (14点到17点前)
 * - 晚上: 19:00 - 21:59 (19点到22点前)
 * @function getCurrentTimeSlot
 * @returns {string|null} 时段标识：morning/afternoon/evening 或 null
 */
const getCurrentTimeSlot = () => {
	const now = new Date()
	const hour = now.getHours() // 获取当前小时（0-23）

	// 上午签到时段：8:00 - 10:59
	if (hour >= 8 && hour < 11) {
		return 'morning'
	}
	// 下午签到时段：14:00 - 16:59
	if (hour >= 14 && hour < 17) {
		return 'afternoon'
	}
	// 晚上签到时段：19:00 - 21:59
	if (hour >= 19 && hour < 22) {
		return 'evening'
	}
	// 非签到时段
	return null
}

/**
 * 判断当前时段是否已签到
 * @description 先获取当前时段，再检查该时段的签到状态
 * 逻辑流程:
 * 1. 获取当前所处的时段
 * 2. 如果非签到时段,返回false
 * 3. 检查该时段是否有签到记录
 * @function isCurrentSlotSigned
 * @returns {boolean} true=已签到，false=未签到/非签到时段
 */
const isCurrentSlotSigned = () => {
	try {
		const currentSlot = getCurrentTimeSlot()
		if (!currentSlot) {
			return false
		} // 非签到时段直接返回未签到
		return isSlotSigned(currentSlot)
	} catch (error) { // 异常时返回未签到，避免页面逻辑中断
		console.error('判断当前时段签到状态失败:', error)
		return false
	}
}

/**
 * 检查指定时段是否已签到
 * @description 对比签到时间的日期与今日是否一致，一致则为已签到
 * 判断逻辑:
 * 1. 获取该时段的签到时间(ISO格式)
 * 2. 解析签到时间的日期部分
 * 3. 对比今日日期与签到日期
 * @function isSlotSigned
 * @param {string} slot 时段标识：morning/afternoon/evening
 * @returns {boolean} true=已签到，false=未签到
 */
const isSlotSigned = slot => {
	try {
		return todayAttendanceSlots.value[slot] || false
	} catch (error) {
		console.error(`检查${slot}时段签到状态失败:`, error)
		return false
	}
}

/**
 * 加载本地存储的签到状态
 * @description 从localStorage读取当日签到状态，异常则重置为默认值
 * 存储规则:
 * - Key: attendance_${today} (attendance_Wed Jan 05 2026)
 * - Value: JSON字符串 { morning: ISO时间, afternoon: ISO时间, evening: ISO时间 }
 * 验证规则:
 * - 必须包含morning/afternoon/evening三个字段
 * - 不合法的数据会被重置为默认值
 * @function loadAttendanceStatus
 * @returns {void}
 */
const loadAttendanceStatus = () => {
	const today = new Date().toDateString() // 今日日期字符串（格式：Wed Jan 05 2026）
	const saved = localStorage.getItem(`attendance_${today}`) // 读取本地存储的签到状态
	if (saved) {
		try {
			const parsed = JSON.parse(saved) // 解析JSON字符串
			// 验证解析结果的合法性
			if (parsed && typeof parsed === 'object' &&
				'morning' in parsed && 'afternoon' in parsed && 'evening' in parsed) {
				attendanceStatus.value = parsed // 合法则更新状态
			} else {
				// 格式不合法，重置为默认值
				attendanceStatus.value = {morning: null, afternoon: null, evening: null}
			}
		} catch (e) { // 解析失败，重置为默认值
			console.error('解析本地签到状态失败:', e)
			attendanceStatus.value = {morning: null, afternoon: null, evening: null}
		}
	} else {
		// 无本地存储，初始化默认状态
		attendanceStatus.value = {morning: null, afternoon: null, evening: null}
	}
}

/**
 * 同步本地签到状态
 * @description 重新读取本地存储的签到状态，用于定时刷新
 * 使用场景:
 * - 整点时同步一次,确保状态最新
 * - 其他地方修改了localStorage后同步
 * 兼容处理:
 * - 确保每个时段值不为空,空字符串/undefined/null都会转为null
 * @function syncAllAttendanceStatus
 * @async
 * @returns {Promise<void>}
 */
const syncAllAttendanceStatus = async () => {
	try {
		const today = new Date().toDateString()
		const saved = localStorage.getItem(`attendance_${today}`)

		if (saved) {
			try {
				const status = JSON.parse(saved)
				if (status && typeof status === 'object') {
					// 兼容处理：确保每个时段值不为空，空则设为null
					attendanceStatus.value = {
						morning: status.morning || null,
						afternoon: status.afternoon || null,
						evening: status.evening || null
					}
				}
			} catch (e) { // 解析失败，重置状态
				console.error('同步本地签到状态失败:', e)
				attendanceStatus.value = {morning: null, afternoon: null, evening: null}
			}
		}
	} catch (error) { // 捕获外层异常
		console.error('同步签到状态异常:', error)
		attendanceStatus.value = {morning: null, afternoon: null, evening: null}
	}
}

/**
 * 保存签到状态到本地存储
 * @description 将当前签到状态持久化到localStorage，避免页面刷新后丢失
 * 存储规则:
 * - Key: attendance_${today} (按日期区分)
 * - Value: JSON字符串
 * - 防护措施: 状态异常时保存默认值,避免存储错误数据
 * @function saveAttendanceStatus
 * @returns {void}
 */
const saveAttendanceStatus = () => {
	const today = new Date().toDateString()
	if (attendanceStatus.value && typeof attendanceStatus.value === 'object') {
		// 状态合法，保存到本地
		localStorage.setItem(`attendance_${today}`, JSON.stringify(attendanceStatus.value))
	} else {
		// 状态异常，保存默认值
		const defaultStatus = {morning: null, afternoon: null, evening: null}
		localStorage.setItem(`attendance_${today}`, JSON.stringify(defaultStatus))
	}
}

/**
 * 检查当前是否在签到时间内
 * @description 实时更新当前时间、签到时段状态、下次签到时间；整点时同步签到状态
 * 执行频率: 每秒调用一次
 * 主要功能:
 * 1. 更新当前时间显示(HH:MM:SS格式)
 * 2. 判断是否在签到时段内
 * 3. 计算下次签到时间(非签到时段)
 * 4. 整点时同步签到状态
 *
 * 签到时段配置:
 * - 上午: 08:00 - 10:59 (8-11点前)
 * - 下午: 14:00 - 16:59 (14-17点前)
 * - 晚上: 19:00 - 21:59 (19-22点前)
 * @function checkSignTime
 * @returns {void}
 */
const checkSignTime = () => {
	const now = new Date()
	const hour = now.getHours()
	const minute = now.getMinutes()
	const second = now.getSeconds()
	// 格式化当前时间为 HH:MM:SS
	const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
	currentTime.value = timeStr // 更新当前时间显示

	// 格式化当前日期为 YYYY年MM月DD日
	const year = now.getFullYear()
	const month = (now.getMonth() + 1).toString().padStart(2, '0')
	const day = now.getDate().toString().padStart(2, '0')
	const dateStr = `${year}年${month}月${day}日`
	currentDate.value = dateStr // 更新当前日期显示

	// 定义三个签到时段的配置
	const signTimeRanges = [
		{start: 8, end: 11, name: '上午'}, // 上午8点-11点
		{start: 14, end: 17, name: '下午'}, // 下午14点-17点
		{start: 19, end: 22, name: '晚上'} // 晚上19点-22点
	]

	let inTime = false // 是否在签到时段内
	let nextTime = '' // 下次签到时间提示

	// 判断当前是否在任意签到时段内
	for (const range of signTimeRanges) {
		if (hour >= range.start && hour < range.end) {
			inTime = true
			break
		}
	}

	// 非签到时段，计算下次签到时间
	if (!inTime) {
		for (const range of signTimeRanges) {
			if (hour < range.start) {
				nextTime = `${range.name} ${range.start.toString().padStart(2, '0')}:00`
				break
			}
		}
		// 若当前时间晚于所有签到时段（22点后），提示明天上午
		if (!nextTime) {
			nextTime = '明天上午 08:00'
		}
	}

	// 更新响应式状态
	isInSignTime.value = inTime
	nextSignTime.value = nextTime

	// 整点（分和秒都为0）时同步一次签到状态，确保数据最新
	if (minute === 0 && second === 0) {
		syncAllAttendanceStatus()
	}
}

/**
 * 提交签到请求（前置校验）
 * @description 点击签到按钮时触发，先校验时段和签到状态，通过则弹出验证码弹窗
 * 校验流程:
 * 1. 检查是否在签到时段内
 * 2. 检查当前时段是否已签到
 * 3. 通过校验则弹出验证码输入弹窗
 * @function submitAttendance
 * @async
 * @returns {Promise<void>}
 */
const submitAttendance = async () => {
	// 非签到时段，提示下次签到时间
	if (!isInSignTime.value) {
		ElMessage.error(`当前时间 ${currentTime.value} 不在签到时间内，下次签到时间：${nextSignTime.value}`)
		return
	}

	// 当前时段已签到，提示无需重复签到
	if (isCurrentSlotSigned()) {
		ElMessage.warning('当前时间段已签到，请等待下次签到时间')
		return
	}

	// 清空之前输入的验证码，显示验证码弹窗
	inputVerificationCode.value = ''
	showVerificationCodeDialog.value = true
}

/**
 * 确认验证码并提交签到
 * @description 验证验证码格式，调用签到接口，更新本地签到状态
 * 执行流程:
 * 1. 验证码格式校验(6位数字)
 * 2. 获取登录token
 * 3. 调用签到接口
 * 4. 更新本地签到状态
 * 5. 处理接口响应(成功/失败/重复签到)
 * @function confirmVerificationCode
 * @async
 * @returns {Promise<void>}
 */
const confirmVerificationCode = async () => {
	// 验证码格式校验：非空且6位数字
	if (!inputVerificationCode.value || inputVerificationCode.value.length !== 6) {
		ElMessage.error('请输入6位数字验证码')
		return
	}
	if (!/^\d{6}$/.test(inputVerificationCode.value)) {
		ElMessage.error('验证码必须是6位数字')
		return
	}

	loading.value = true // 开启加载状态

	try {
		// 获取登录token（优先从Pinia，其次从本地存储）
		const token = userStore.token || localStorage.getItem('token')
		if (!token) { // 无token，提示登录并跳转
			ElMessage.error('请先登录')
			router.push('/login')
			loading.value = false
			showVerificationCodeDialog.value = false
			return
		}

		// 调用签到接口（传入token和验证码）
		const res = await signIn(token, inputVerificationCode.value)

		// 接口返回成功（200）
		if (res.code === 200) {
			const currentSlot = getCurrentTimeSlot()
			if (currentSlot && attendanceStatus.value) {
				// 更新当前时段的签到时间为当前时间（ISO格式）
				attendanceStatus.value = {
					...attendanceStatus.value,
					[currentSlot]: new Date().toISOString()
				}
				saveAttendanceStatus() // 保存到本地存储
				// 更新今日签到状态卡片数据
				todayAttendanceSlots.value = {
					...todayAttendanceSlots.value,
					[currentSlot]: true
				}
			}
			// 刷新本周签到概览数据
			loadWeeklyAttendance()
			// 关闭弹窗、清空验证码、提示成功
			showVerificationCodeDialog.value = false
			inputVerificationCode.value = ''
			ElMessage.success('签到成功！')
		} else if (res.code === 400 && res.message && res.message.includes('已签到')) {
			// 接口返回已签到（重复签到），更新本地状态
			const currentSlot = getCurrentTimeSlot()
			if (currentSlot && attendanceStatus.value) {
				attendanceStatus.value = {
					...attendanceStatus.value,
					[currentSlot]: new Date().toISOString()
				}
				saveAttendanceStatus()
				// 更新今日签到状态卡片数据
				todayAttendanceSlots.value = {
					...todayAttendanceSlots.value,
					[currentSlot]: true
				}
			}
			// 刷新本周签到概览数据
			loadWeeklyAttendance()
			showVerificationCodeDialog.value = false
			inputVerificationCode.value = ''
			ElMessage.success('您已签到，无需重复签到')
		} else if (res.message && (res.message.includes('验证码错误') || res.message.includes('验证码已过期'))) {
			// 验证码错误/过期，提示错误并清空输入框
			ElMessage.error(res.message)
			inputVerificationCode.value = ''
		} else {
			// 其他错误，提示默认信息
			ElMessage.error(res.message || '签到失败')
		}
	} catch (error) { // 捕获接口请求异常
		console.error('签到接口请求失败:', error)
		if (error.message && (error.message.includes('验证码错误') || error.message.includes('验证码已过期'))) {
			ElMessage.error(error.message)
			inputVerificationCode.value = ''
		} else {
			ElMessage.error(error.message || '签到失败')
		}
	} finally { // 无论成功失败，关闭加载状态
		loading.value = false
	}
}

/**
 * 处理验证码弹窗关闭事件
 * @description 弹窗关闭时清空验证码输入框，避免残留
 * @function handleVerificationCodeDialogClose
 * @returns {void}
 */
const handleVerificationCodeDialogClose = () => {
	inputVerificationCode.value = ''
}

/**
 * 取消签到（关闭验证码弹窗）
 * @description 点击取消按钮时触发，关闭弹窗
 * @function cancelVerificationCode
 * @returns {void}
 */
const cancelVerificationCode = () => {
	showVerificationCodeDialog.value = false
}

/**
 * 加载学生等级
 * @description 从Pinia/本地存储读取用户等级，异常则设为0
 * 优先级: Pinia Store > localStorage
 * 预留扩展: 当前仅读取,暂未在页面中使用
 * @function loadStudentLevel
 * @returns {void}
 */
const loadStudentLevel = () => {
	try {
		// 优先从Pinia获取，其次从本地存储解析
		const userInfo = userStore.userInfo || JSON.parse(localStorage.getItem('userInfo') || '{}')
		studentLevel.value = userInfo.level || 0
	} catch (error) { // 解析失败，设为默认值0
		console.error('加载学生等级失败:', error)
		studentLevel.value = 0
	}
}

/**
 * 获取本周日期范围
 * @description 计算本周周一和周日的日期
 * @returns {{ startTime: string, endTime: string }} 本周开始和结束时间
 */
const getWeekDateRange = () => {
	const now = new Date()
	const dayOfWeek = now.getDay() || 7
	const monday = new Date(now)
	monday.setDate(now.getDate() - dayOfWeek + 1)
	const sunday = new Date(monday)
	sunday.setDate(monday.getDate() + 6)
	const formatDate = (d) => {
		const year = d.getFullYear()
		const month = (d.getMonth() + 1).toString().padStart(2, '0')
		const day = d.getDate().toString().padStart(2, '0')
		return `${year}-${month}-${day}`
	}
	return {
		startTime: `${formatDate(monday)} 00:00:00`,
		endTime: `${formatDate(sunday)} 23:59:59`
	}
}

/**
 * 判断签到时间属于哪个时段
 * @param {string} timeStr - ISO格式的签到时间
 * @returns {string|null}
 */
const getSlotFromTime = (timeStr: string): string | null => {
	if (!timeStr) return null
	const date = new Date(timeStr)
	const hour = date.getHours()
	if (hour >= 8 && hour < 11) return 'morning'
	if (hour >= 14 && hour < 17) return 'afternoon'
	if (hour >= 19 && hour < 22) return 'evening'
	return null
}

/**
 * 获取签到时段的CSS类名
 * @param {Object} slots - 时段签到状态对象
 * @returns {string} CSS类名
 */
const getSlotClass = (slots: { morning: boolean; afternoon: boolean; evening: boolean }): string => {
	if (slots.morning && slots.afternoon && slots.evening) return 'slot-all'
	if (slots.morning && slots.afternoon) return 'slot-morning-afternoon'
	if (slots.morning && slots.evening) return 'slot-morning-evening'
	if (slots.afternoon && slots.evening) return 'slot-afternoon-evening'
	if (slots.morning) return 'slot-morning'
	if (slots.afternoon) return 'slot-afternoon'
	if (slots.evening) return 'slot-evening'
	return 'slot-none'
}

/**
 * 获取已签到次数
 * @param {Object} slots - 时段签到状态对象
 * @returns {number} 已签到次数
 */
const getSignedCount = (slots: { morning: boolean; afternoon: boolean; evening: boolean }): number => {
	let count = 0
	if (slots.morning) count++
	if (slots.afternoon) count++
	if (slots.evening) count++
	return count
}

/**
 * 加载本周签到数据
 * @description 调用接口获取本周每天的签到记录，更新weeklyAttendanceData
 * @async
 * @returns {Promise<void>}
 */
const loadWeeklyAttendance = async () => {
	try {
		weeklyAttendanceLoading.value = true
		const token = userStore.token || localStorage.getItem('token')
		if (!token) return
		const idResponse = await getStudentDatabaseTableId(token)
		if (idResponse.code !== 200 || !idResponse.data) return
		studentInfoId.value = idResponse.data
		const { startTime, endTime } = getWeekDateRange()
		const records = await AttendanceApi.getStudentRecordsByTimeRange(studentInfoId.value, startTime, endTime)
		const daySlots = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
		const today = new Date().toDateString()
		let todaySlots = { morning: false, afternoon: false, evening: false }
		weeklyAttendanceData.value = weeklyAttendanceData.value.map((day, index) => {
			const currentDate = new Date()
			currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1 + index)
			const dateStr = currentDate.toISOString().split('T')[0]
			const dayName = daySlots[currentDate.getDay()]
			const isToday = currentDate.toDateString() === today
			const isFuture = currentDate > new Date()
			const slots = { morning: false, afternoon: false, evening: false }
			if (!isFuture) {
				records.forEach(record => {
					const recordDate = new Date(record)
					if (recordDate.toISOString().split('T')[0] === dateStr) {
						const slot = getSlotFromTime(record)
						if (slot) slots[slot] = true
					}
				})
			}
			if (isToday) {
				todaySlots = slots
			}
			return { date: dateStr, dayName, slots, isToday, isFuture }
		})
		todayAttendanceSlots.value = todaySlots
	} catch (error) {
		console.error('加载本周签到数据失败:', error)
	} finally {
		weeklyAttendanceLoading.value = false
	}
}

// ======================== 生命周期钩子 ========================
/**
 * 组件挂载完成钩子
 * @description 初始化页面数据：加载签到状态、启动时间定时器、加载学生等级和头像
 * 初始化顺序:
 * 1. 加载本地签到状态
 * 2. 首次检查签到时间
 * 3. 启动定时器(每秒更新)
 * 4. 加载学生等级
 * 5. 加载用户头像
 * 6. 延迟同步签到状态(避免初始化冲突)
 * @onMounted
 * @async
 */
onMounted(async () => {
	try {
		loadAttendanceStatus() // 加载本地签到状态
		checkSignTime() // 首次检查签到时间
		// 启动定时器，每秒更新一次时间和签到状态
		timeInterval.value = setInterval(checkSignTime, 1000)
		loadStudentLevel() // 加载学生等级
		loadUserAvatar() // 加载用户头像
		loadWeeklyAttendance() // 加载本周签到数据
		// 延迟500ms同步签到状态，避免页面初始化时接口请求冲突
		setTimeout(async () => {
			await syncAllAttendanceStatus()
		}, 500)
	} catch (error) { // 初始化异常，重置签到状态
		console.error('组件初始化失败:', error)
		attendanceStatus.value = {morning: null, afternoon: null, evening: null}
	}
})

/**
 * 组件卸载前钩子
 * @description 清除定时器，避免内存泄漏
 * @onUnmounted
 * @returns {void}
 */
onUnmounted(() => {
	if (timeInterval.value) {
		clearInterval(timeInterval.value) // 清除时间更新定时器
		timeInterval.value = null // 释放引用
	}
})
</script>

<template>
	<!-- 移动端签到页面根容器 -->
	<div class="attendance-mobile-background-container-mobile">
		<!-- 背景装饰效果：渐变浮动圆球 -->
		<div class="attendance-mobile-background-effects-mobile">
			<div class="attendance-mobile-background-orb-mobile attendance-mobile-background-orb-1"/>
			<div class="attendance-mobile-background-orb-mobile attendance-mobile-background-orb-2"/>
			<div class="attendance-mobile-background-orb-mobile attendance-mobile-background-orb-3"/>
		</div>

		<!-- 内容包裹层：所有业务内容容器 -->
		<div class="content-wrapper-mobile">
			<!-- 返回按钮：固定在左上角，点击返回导航页 -->
			<el-button
				type="primary"
				class="nav-button-mobile"
				:icon="ArrowLeft"
				@click="goToNavigation"
			>
				返回
			</el-button>

			<!-- 页面头部：logo、头像、标题 -->
			<div class="attendance-mobile-header-header-mobile">
				<!-- 左侧：Logo和标题 -->
				<div class="attendance-mobile-header-left-mobile">
					<!-- 系统logo：点击切换明暗主题 -->
					<img
						src="@/assets/AiWorkShop_icon.png"
						alt="AI坊学生管理系统"
						class="attendance-mobile-header-logo-mobile"
						title="切换主题模式"
						@click="toggleTheme"/>
					<!-- 页面标题区域 -->
					<div class="attendance-mobile-header-titles-mobile">
						<h1 class="attendance-mobile-header-title-mobile">AI坊学生签到</h1>
						<p class="attendance-mobile-header-subtitle-mobile">智能签到系统</p>
					</div>
				</div>
				<!-- 右侧：用户头像 -->
				<!-- 用户头像容器：点击跳转到个人资料页 -->
				<div class="attendance-mobile-header-avatar-mobile" :class="{ 'has-avatar': hasAvatar, 'no-avatar': !hasAvatar }"
					 @click="handleAvatarClick">
					<!-- 自定义头像：懒加载 -->
					<img
						v-if="hasAvatar && avatarUrl"
						v-lazy="avatarUrl"
						alt="用户头像"
						class="attendance-mobile-header-avatar-image-mobile"/>
					<!-- 默认头像图标：无自定义头像时显示 -->
					<el-icon v-else size="24" class="attendance-mobile-header-avatar-icon-mobile">
						<User/>
					</el-icon>
				</div>
			</div>

			<!-- 主内容区：签到按钮和状态卡片 -->
			<div class="main-content-mobile">
				<!-- 本周签到概览：展示本周每天的签到状态 -->
				<div class="attendance-mobile-weekly-overview-mobile">
					<div class="attendance-mobile-weekly-overview-title-mobile">本周签到概览</div>
					<div class="attendance-mobile-weekly-overview-grid-mobile">
						<div v-for="day in weeklyAttendanceData" :key="day.date"
								 class="attendance-mobile-weekly-overview-day-mobile"
								 :class="{ 'today': day.isToday, 'future': day.isFuture }">
								<div class="attendance-mobile-weekly-overview-circle-mobile"
									:class="getSlotClass(day.slots)">
									<span class="slot-count">{{ getSignedCount(day.slots) }}</span>
								</div>
								<div class="attendance-mobile-weekly-overview-day-name-mobile">{{ day.dayName }}</div>
							</div>
					</div>
				</div>

				<!-- 签到按钮容器 -->
				<div class="attendance-mobile-sign-button-container-mobile">
					<button
						class="attendance-mobile-sign-button-button-mobile"
						:disabled="loading || !isInSignTime || isCurrentSlotSigned()"
						:class="{
							'loading': loading,
							'disabled': !isInSignTime || isCurrentSlotSigned(),
							'success': isInSignTime && isCurrentSlotSigned(),
							'morning': getCurrentTimeSlot() === 'morning',
							'afternoon': getCurrentTimeSlot() === 'afternoon',
							'evening': getCurrentTimeSlot() === 'evening'
						}"
						@click="submitAttendance">
						<div class="attendance-mobile-sign-button-background-mobile"/>
						<div class="attendance-mobile-sign-button-content-mobile">
							<div class="attendance-mobile-sign-button-icon-container-mobile">
								<el-icon v-if="!loading && isInSignTime && !isCurrentSlotSigned()" size="40"
										 class="attendance-mobile-sign-button-main-icon-mobile">
									<Check/>
								</el-icon>
								<el-icon v-else-if="!loading && isInSignTime && isCurrentSlotSigned()" size="40"
										 class="attendance-mobile-sign-button-main-icon-mobile attendance-mobile-sign-button-main-icon-mobile-success-icon-mobile">
									<Check/>
								</el-icon>
								<el-icon v-else-if="!loading && !isInSignTime" size="40"
										 class="attendance-mobile-sign-button-main-icon-mobile attendance-mobile-sign-button-main-icon-mobile-disabled-icon-mobile">
									<Clock/>
								</el-icon>
								<el-icon v-else size="28" class="attendance-mobile-sign-button-main-icon-mobile attendance-mobile-sign-button-main-icon-mobile-loading-icon-mobile">
									<Loading/>
								</el-icon>
							</div>
							<span v-if="!loading" class="attendance-mobile-sign-button-text-mobile">
								{{ !isInSignTime ? '非签到时间' : (isCurrentSlotSigned() ? '已签到' : '点击签到') }}
							</span>
							<span v-else class="attendance-mobile-sign-button-text-mobile attendance-mobile-sign-button-text-mobile-loading-text-mobile">签到中...</span>
						</div>
						<div class="attendance-mobile-sign-button-ripple-mobile"/>
					</button>
				</div>

				<!-- 签到状态卡片组：展示早中晚三个时段的签到状态 -->
				<div class="attendance-mobile-status-cards-cards-mobile">
					<!-- 上午签到状态卡片 -->
					<div class="attendance-mobile-status-cards-card-mobile morning"
						 :class="{ 'active': getCurrentTimeSlot() === 'morning', 'signed': isSlotSigned('morning') }">
						<div class="attendance-mobile-status-cards-card-icon-mobile">
							<el-icon>
								<Sunrise/>
							</el-icon>
						</div>
						<div class="attendance-mobile-status-cards-card-content-mobile">
							<div class="attendance-mobile-status-cards-card-title-mobile">上午签到</div>
							<div class="attendance-mobile-status-cards-card-time-mobile">08:00 - 11:00</div>
							<div class="attendance-mobile-status-cards-card-status-mobile" :class="{ 'signed': isSlotSigned('morning') }">
								{{ isSlotSigned('morning') ? '已签到' : '未签到' }}
							</div>
						</div>
					</div>

					<!-- 下午签到状态卡片 -->
					<div class="attendance-mobile-status-cards-card-mobile afternoon"
						 :class="{ 'active': getCurrentTimeSlot() === 'afternoon', 'signed': isSlotSigned('afternoon') }">
						<div class="attendance-mobile-status-cards-card-icon-mobile">
							<el-icon>
								<Sunny/>
							</el-icon>
						</div>
						<div class="attendance-mobile-status-cards-card-content-mobile">
							<div class="attendance-mobile-status-cards-card-title-mobile">下午签到</div>
							<div class="attendance-mobile-status-cards-card-time-mobile">14:00 - 17:00</div>
							<div class="attendance-mobile-status-cards-card-status-mobile" :class="{ 'signed': isSlotSigned('afternoon') }">
								{{ isSlotSigned('afternoon') ? '已签到' : '未签到' }}
							</div>
						</div>
					</div>

					<!-- 晚上签到状态卡片 -->
					<div class="attendance-mobile-status-cards-card-mobile evening"
						 :class="{ 'active': getCurrentTimeSlot() === 'evening', 'signed': isSlotSigned('evening') }">
						<div class="attendance-mobile-status-cards-card-icon-mobile">
							<el-icon>
								<Moon/>
							</el-icon>
						</div>
						<div class="attendance-mobile-status-cards-card-content-mobile">
							<div class="attendance-mobile-status-cards-card-title-mobile">晚上签到</div>
							<div class="attendance-mobile-status-cards-card-time-mobile">19:00 - 22:00</div>
							<div class="attendance-mobile-status-cards-card-status-mobile" :class="{ 'signed': isSlotSigned('evening') }">
								{{ isSlotSigned('evening') ? '已签到' : '未签到' }}
							</div>
						</div>
					</div>
				</div>

				<!-- 桌面端提示卡片：引导用户在电脑端查看详细记录 -->
				<div class="attendance-mobile-desktop-tip-card-card-mobile">
					<div class="attendance-mobile-desktop-tip-card-icon-mobile">
						<el-icon>
							<Monitor/>
						</el-icon>
					</div>
					<div class="attendance-mobile-desktop-tip-card-content-mobile">
						<p class="attendance-mobile-desktop-tip-card-text-mobile">💡 提示：如需查看详细签到记录和历史数据，请在电脑端访问</p>
					</div>
				</div>
			</div>
		</div>

		<!-- 验证码弹窗：输入6位数字验证码完成签到 -->
		<el-dialog
			v-if="showVerificationCodeDialog"
			v-model="showVerificationCodeDialog"
			title="输入签到验证码"
			width="90%"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			destroy-on-close
			class="verification-code-dialog-mobile"
			@close="handleVerificationCodeDialogClose"
		>
		<div class="verification-code-content-mobile">
			<!-- 验证码提示文本 -->
			<div class="verification-code-hint-mobile">
				<p>请输入6位数字验证码</p>
			</div>
			<!-- 验证码输入框：限制6位数字，回车提交 -->
			<el-input
				v-model="inputVerificationCode"
				placeholder="请输入验证码"
				maxlength="6"
				class="verification-code-input-mobile"
				@keyup.enter="confirmVerificationCode"
			/>
			<!-- 弹窗操作按钮：取消/确认 -->
			<div class="verification-code-actions-mobile">
				<el-button @click.stop="cancelVerificationCode">取消</el-button>
				<el-button type="primary" :loading="loading" @click.stop="confirmVerificationCode">确认</el-button>
			</div>
		</div>
		</el-dialog>
	</div>
</template>

<style scoped>
@import './css/mobile/attendance-mobile-background.css';
@import './css/mobile/attendance-mobile-sign-button.css';
@import './css/mobile/attendance-mobile-time-card.css';
@import './css/mobile/attendance-mobile-header.css';
@import './css/mobile/attendance-mobile-status-cards.css';
@import './css/mobile/attendance-mobile-desktop-tip-card.css';

/** 内容包裹层：相对定位，层级高于背景，垂直布局 */
.content-wrapper-mobile {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	max-width: 100%; /* 适配移动端宽度 */
	position: relative; /* 作为子元素定位容器 */
	z-index: 1; /* 层级高于背景装饰 */
}

/** 返回按钮：固定定位，玻璃态，hover效果 */
.nav-button-mobile {
	position: fixed; /* 固定在左上角 */
	top: 12px;
	left: 12px;
	height: 36px;
	border-radius: 18px; /* 胶囊形状 */
	font-size: 12px;
	font-weight: 600;
	background: var(--glass-bg); /* 玻璃态背景 */
	backdrop-filter: blur(20px); /* 毛玻璃效果 */
	border: 1px solid var(--glass-border); /* 玻璃态边框 */
	color: var(--text-primary); /* 主文本色 */
	box-shadow: 0 3px 12px var(--shadow-color); /* 阴影 */
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* 平滑过渡 */
	z-index: 1000; /* 层级最高，确保不被遮挡 */
	padding: 0 12px;
	min-width: 60px;
}

/** 返回按钮hover效果：上移，阴影放大，背景变色 */
.nav-button-mobile:hover {
	transform: translateY(-1px); /* 轻微上移 */
	box-shadow: 0 6px 18px var(--shadow-color); /* 阴影放大 */
	background: var(--primary-color); /* 主色调背景 */
	color: #ffffff; /* 白色文本 */
}

/** 系统logo：固定尺寸，hover动画 */
.logo-mobile {
	width: 50px;
	height: 50px;
	margin-bottom: 12px;
	cursor: pointer; /* 点击指针 */
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* 平滑过渡 */
	border-radius: 0;
	background: transparent;
	box-shadow: none;
}

/** logo hover效果：缩放+旋转，亮度提升 */
.logo-mobile:hover {
	transform: scale(1.1) rotate(5deg); /* 放大10%，旋转5度 */
	filter: brightness(1.2); /* 亮度提升20% */
}

/** 页面主标题：主文本色，阴影，字间距 */
h1 {
	color: var(--text-primary);
	font-size: 20px;
	margin: 0 0 6px 0;
	font-weight: 700;
	text-shadow: 0 2px 6px var(--shadow-color); /* 文本阴影增强可读性 */
	letter-spacing: 0.5px; /* 字间距优化 */
}

/** 页面副标题：次文本色，低透明度 */
.subtitle {
	color: var(--text-secondary); /* 次文本色 */
	font-size: 12px;
	margin: 0;
	font-weight: 400;
	opacity: 0.8; /* 透明度降低 */
}

/** 主内容区：垂直布局，居中，子元素间距 */
.main-content-mobile {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 50px; /* 子元素间距 */
	width: 100%;
}

/** 旋转动画：用于加载中图标 */
@keyframes spin-mobile {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

/** 验证码弹窗：圆角样式 */
.verification-code-dialog-mobile {
	border-radius: 16px;
}

/** 验证码弹窗内容：上下内边距 */
.verification-code-content-mobile {
	padding: 20px 0;
}

/** 验证码提示文本：居中，底部间距 */
.verification-code-hint-mobile {
	margin-bottom: 20px;
	text-align: center;
}

/** 验证码提示文本：主文本色，中等字号 */
.verification-code-hint-mobile p {
	margin: 8px 0;
	color: var(--text-primary);
	font-size: 14px;
}

/** 验证码输入框：底部间距 */
.verification-code-input-mobile {
	margin-bottom: 20px;
}

/** 深度选择器：修改Element Plus输入框样式 */
.verification-code-input-mobile :deep(.el-input__wrapper) {
	background: var(--glass-bg);
	backdrop-filter: blur(20px);
	border: 2px solid var(--glass-border);
	border-radius: 12px;
	padding: 12px 16px;
	box-shadow: 0 4px 16px var(--shadow-color);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/** 输入框hover：主色调边框，阴影放大 */
.verification-code-input-mobile :deep(.el-input__wrapper:hover) {
	border-color: var(--primary-color);
	box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
}

/** 输入框聚焦：主色调边框，更强阴影 */
.verification-code-input-mobile :deep(.el-input__wrapper.is-focus) {
	border-color: var(--primary-color);
	box-shadow: 0 6px 24px rgba(102, 126, 234, 0.3);
}

/** 输入框内容：居中，等宽字体，大号，字间距 */
.verification-code-input-mobile :deep(.el-input__inner) {
	text-align: center;
	font-size: 28px;
	font-weight: 700;
	letter-spacing: 6px; /* 数字间距，提升可读性 */
	font-family: 'Consolas', 'Monaco', 'Lucida Console', monospace;
	color: var(--text-primary);
	background: transparent;
	border: none;
	padding: 0;
}

/** 输入框占位符：次文本色，小字号，低透明度 */
.verification-code-input-mobile :deep(.el-input__inner::placeholder) {
	color: var(--text-tertiary);
	font-size: 20px;
	font-weight: 500;
	letter-spacing: 2px;
	opacity: 0.6;
}

/** 弹窗操作按钮：水平布局，两端对齐，间距 */
.verification-code-actions-mobile {
	display: flex;
	justify-content: space-between;
	gap: 12px;
}

/** 操作按钮：弹性布局，占满剩余空间 */
.verification-code-actions-mobile .el-button {
	flex: 1;
}

/** 脉冲动画：加载中按钮的呼吸效果 */
@keyframes pulse-mobile {
	0% {
		box-shadow: 0 8px 28px rgba(102, 126, 234, 0.3),
		0 0 0 1px rgba(255, 255, 255, 0.1),
		inset 0 1px 0 rgba(255, 255, 255, 0.2);
	}
	50% {
		box-shadow: 0 12px 36px rgba(102, 126, 234, 0.5),
		0 0 0 6px rgba(102, 126, 234, 0.1),
		inset 0 1px 0 rgba(255, 255, 255, 0.3);
	}
	100% {
		box-shadow: 0 8px 28px rgba(102, 126, 234, 0.3),
		0 0 0 1px rgba(255, 255, 255, 0.1),
		inset 0 1px 0 rgba(255, 255, 255, 0.2);
	}
}
</style>

<!-- 全局样式：处理验证码弹窗的明暗主题适配 -->
<style>
/** 亮色主题下的弹窗背景：白色 */
.verification-code-dialog-mobile.el-dialog {
	background-color: #ffffff !important;
}

/** 亮色主题下的弹窗头部：白色，浅灰色底部分隔线 */
.verification-code-dialog-mobile.el-dialog .el-dialog__header {
	background-color: #ffffff !important;
	border-bottom: 1px solid #e2e8f0 !important;
}

/** 亮色主题下的弹窗内容：白色 */
.verification-code-dialog-mobile.el-dialog .el-dialog__body {
	background-color: #ffffff !important;
}

/** 暗色主题下的弹窗背景：深灰色 */
html.dark .verification-code-dialog-mobile.el-dialog {
	background-color: #0f172a !important;
}

/** 暗色主题下的弹窗头部：深灰色，深灰色底部分隔线 */
html.dark .verification-code-dialog-mobile.el-dialog .el-dialog__header {
	background-color: #0f172a !important;
	border-bottom: 1px solid #334155 !important;
}

/** 暗色主题下的弹窗内容：深灰色 */
html.dark .verification-code-dialog-mobile.el-dialog .el-dialog__body {
	background-color: #0f172a !important;
}
</style>
