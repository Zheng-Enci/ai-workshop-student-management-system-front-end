<script setup>
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
// Element Plus 图标组件
import {Check, ArrowLeft, Clock, Calendar, Sunrise, Sunny, Moon, Monitor, User, Loading} from '@element-plus/icons-vue'
// Vue Router 路由跳转
import {useRouter} from 'vue-router'

// 业务接口导入
import {signIn} from '@/api/attendance' // 签到提交接口
import {getStudentDatabaseTableId, getAvatarUrl} from '@/api/student' // 学生信息及头像接口
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
		// 签到状态对象异常时返回未签到
		if (!attendanceStatus.value || typeof attendanceStatus.value !== 'object') {
			return false
		}

		// 获取该时段的签到时间
		const signTime = attendanceStatus.value[slot]
		if (!signTime) {
			return false
		} // 无签到时间则未签到

		// 对比日期（忽略时间部分）
		const today = new Date().toDateString()
		const signDate = new Date(signTime).toDateString()

		return signDate === today // 日期相同则为今日已签到
	} catch (error) { // 异常时返回未签到
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
			}
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
			}
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
	<div class="attendance-container-mobile">
		<!-- 背景装饰效果：渐变浮动圆球 -->
		<div class="background-effects-mobile">
			<div class="gradient-orb-mobile orb-1"/>
			<div class="gradient-orb-mobile orb-2"/>
			<div class="gradient-orb-mobile orb-3"/>
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
			<div class="attendance-header-mobile">
				<!-- 系统logo：点击切换明暗主题 -->
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊学生管理系统"
					class="logo-mobile"
					title="切换主题模式"
					@click="toggleTheme"/>
				<!-- 用户头像容器：点击跳转到个人资料页 -->
				<div class="user-avatar-mobile" :class="{ 'has-avatar': hasAvatar, 'no-avatar': !hasAvatar }"
					 @click="handleAvatarClick">
					<!-- 自定义头像：懒加载 -->
					<img
						v-if="hasAvatar && avatarUrl"
						v-lazy="avatarUrl"
						alt="用户头像"
						class="avatar-image-mobile"/>
					<!-- 默认头像图标：无自定义头像时显示 -->
					<el-icon v-else size="24" class="avatar-icon-mobile">
						<User/>
					</el-icon>
				</div>
				<!-- 页面主标题 -->
				<h1>AI坊学生签到</h1>
				<!-- 页面副标题 -->
				<p class="subtitle">智能签到系统</p>
			</div>

			<!-- 主内容区：时间展示、签到按钮、状态卡片 -->
			<div class="main-content-mobile">
				<!-- 时间卡片：显示当前时间和下次签到时间 -->
				<div class="time-card-mobile">
					<div class="time-info-mobile">
						<!-- 当前时间展示 -->
						<div class="current-time-mobile">
							<el-icon class="time-icon-mobile">
								<Clock/>
							</el-icon>
							<span>{{ currentTime }}</span>
						</div>
						<!-- 下次签到时间：仅非签到时段显示 -->
						<div v-if="!isInSignTime" class="next-time-mobile">
							<el-icon class="next-icon-mobile">
								<Calendar/>
							</el-icon>
							<span>下次签到：{{ nextSignTime }}</span>
						</div>
					</div>
				</div>

				<!-- 签到按钮容器 -->
				<div class="sign-button-container-mobile">
					<button
						class="modern-sign-button-mobile"
						:disabled="loading || !isInSignTime || isCurrentSlotSigned()"
						:class="{
							'loading': loading,
							'disabled': !isInSignTime || isCurrentSlotSigned(),
							'success': isInSignTime && isCurrentSlotSigned()
						}"
						@click="submitAttendance"
					>
						<div class="button-background-mobile"/>
						<div class="button-content-mobile">
							<div class="icon-container-mobile">
								<!-- 可签到状态：显示勾选图标 -->
								<el-icon v-if="!loading && isInSignTime && !isCurrentSlotSigned()" size="40"
										 class="main-icon-mobile">
									<Check/>
								</el-icon>
								<!-- 已签到状态：显示绿色勾选图标 -->
								<el-icon v-else-if="!loading && isInSignTime && isCurrentSlotSigned()" size="40"
										 class="main-icon-mobile success-icon-mobile">
									<Check/>
								</el-icon>
								<!-- 非签到时段：显示时钟图标 -->
								<el-icon v-else-if="!loading && !isInSignTime" size="40"
										 class="main-icon-mobile disabled-icon-mobile">
									<Clock/>
								</el-icon>
								<!-- 加载中：显示旋转加载图标 -->
								<el-icon v-else size="28" class="loading-icon-mobile">
									<Loading/>
								</el-icon>
							</div>
							<!-- 按钮文本：根据状态动态显示 -->
							<span v-if="!loading" class="button-text-mobile">
								{{ !isInSignTime ? '非签到时间' : (isCurrentSlotSigned() ? '已签到' : '点击签到') }}
							</span>
							<!-- 加载中文本 -->
							<span v-else class="loading-text-mobile">签到中...</span>
						</div>
						<!-- 按钮点击波纹效果 -->
						<div class="ripple-effect-mobile"/>
					</button>
				</div>

				<!-- 签到状态卡片组：展示早中晚三个时段的签到状态 -->
				<div class="status-cards-mobile">
					<!-- 上午签到状态卡片 -->
					<div class="status-card-mobile"
						 :class="{ 'active': getCurrentTimeSlot() === 'morning', 'signed': isSlotSigned('morning') }">
						<div class="card-icon-mobile">
							<el-icon>
								<Sunrise/>
							</el-icon>
						</div>
						<div class="card-content-mobile">
							<div class="card-title-mobile">上午签到</div>
							<div class="card-time-mobile">08:00 - 11:00</div>
							<div class="card-status-mobile" :class="{ 'signed': isSlotSigned('morning') }">
								{{ isSlotSigned('morning') ? '已签到' : '未签到' }}
							</div>
						</div>
					</div>

					<!-- 下午签到状态卡片 -->
					<div class="status-card-mobile"
						 :class="{ 'active': getCurrentTimeSlot() === 'afternoon', 'signed': isSlotSigned('afternoon') }">
						<div class="card-icon-mobile">
							<el-icon>
								<Sunny/>
							</el-icon>
						</div>
						<div class="card-content-mobile">
							<div class="card-title-mobile">下午签到</div>
							<div class="card-time-mobile">14:00 - 17:00</div>
							<div class="card-status-mobile" :class="{ 'signed': isSlotSigned('afternoon') }">
								{{ isSlotSigned('afternoon') ? '已签到' : '未签到' }}
							</div>
						</div>
					</div>

					<!-- 晚上签到状态卡片 -->
					<div class="status-card-mobile"
						 :class="{ 'active': getCurrentTimeSlot() === 'evening', 'signed': isSlotSigned('evening') }">
						<div class="card-icon-mobile">
							<el-icon>
								<Moon/>
							</el-icon>
						</div>
						<div class="card-content-mobile">
							<div class="card-title-mobile">晚上签到</div>
							<div class="card-time-mobile">19:00 - 22:00</div>
							<div class="card-status-mobile" :class="{ 'signed': isSlotSigned('evening') }">
								{{ isSlotSigned('evening') ? '已签到' : '未签到' }}
							</div>
						</div>
					</div>
				</div>

				<!-- 桌面端提示卡片：引导用户在电脑端查看详细记录 -->
				<div class="desktop-tip-card-mobile">
					<div class="tip-icon-mobile">
						<el-icon>
							<Monitor/>
						</el-icon>
					</div>
					<div class="tip-content-mobile">
						<p class="tip-text-mobile">💡 提示：如需查看详细签到记录和历史数据，请在电脑端访问</p>
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
/** 根容器样式：移动端全屏布局，渐变背景，相对定位 */
.attendance-container-mobile {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh; /* 最小高度占满视口 */
	padding: 12px; /* 内边距适配移动端 */
	/* 渐变色背景：多色渐变，低透明度营造层次感 */
	background: linear-gradient(135deg,
	rgba(99, 102, 241, 0.1) 0%,
	rgba(168, 85, 247, 0.08) 25%,
	rgba(236, 72, 153, 0.06) 50%,
	rgba(251, 146, 60, 0.08) 75%,
	rgba(34, 197, 94, 0.1) 100%);
	position: relative; /* 作为绝对定位子元素的容器 */
	overflow: hidden; /* 隐藏溢出的背景装饰 */
}

/** 背景装饰容器：绝对定位，不响应点击事件 */
.background-effects-mobile {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	pointer-events: none; /* 穿透点击，不影响下层元素 */
	z-index: 0; /* 层级最低，作为背景 */
}

/** 渐变圆球基础样式：圆形、模糊、浮动动画 */
.gradient-orb-mobile {
	position: absolute;
	border-radius: 50%; /* 圆形 */
	filter: blur(60px); /* 高斯模糊，营造渐变效果 */
	animation: float-mobile 20s ease-in-out infinite; /* 浮动动画 */
}

/** 第一个渐变圆球：左上位置，紫色调 */
.orb-1 {
	width: 200px;
	height: 200px;
	background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 70%, transparent 100%);
	top: 5%;
	left: 5%;
	animation-delay: 0s; /* 无延迟 */
}

/** 第二个渐变圆球：右下位置，品红色调 */
.orb-2 {
	width: 180px;
	height: 180px;
	background: radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(168, 85, 247, 0.04) 70%, transparent 100%);
	top: 50%;
	right: 5%;
	animation-delay: 6s; /* 延迟6秒开始动画 */
}

/** 第三个渐变圆球：左下位置，绿色调 */
.orb-3 {
	width: 160px;
	height: 160px;
	background: radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.03) 70%, transparent 100%);
	bottom: 10%;
	left: 15%;
	animation-delay: 12s; /* 延迟12秒开始动画 */
}

/** 浮动动画：上下左右轻微移动，透明度变化 */
@keyframes float-mobile {
	0%, 100% {
		transform: translateY(0px) translateX(0px) rotate(0deg);
		opacity: 0.6;
	}
	25% {
		transform: translateY(-15px) translateX(8px) rotate(90deg);
		opacity: 0.8;
	}
	50% {
		transform: translateY(-8px) translateX(-12px) rotate(180deg);
		opacity: 1;
	}
	75% {
		transform: translateY(12px) translateX(4px) rotate(270deg);
		opacity: 0.7;
	}
}

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

/** 页面头部：玻璃态样式，居中布局，阴影效果 */
.attendance-header-mobile {
	text-align: center;
	margin-bottom: 24px;
	padding: 16px;
	background: var(--glass-bg); /* 玻璃态背景（全局变量） */
	backdrop-filter: blur(20px); /* 毛玻璃效果 */
	border-radius: 20px; /* 圆角 */
	border: 1px solid var(--glass-border); /* 玻璃态边框 */
	box-shadow: 0 6px 24px var(--shadow-color); /* 阴影增强层次感 */
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px; /* 子元素间距 */
}

/** 用户头像容器：固定尺寸，圆角，点击指针 */
.user-avatar-mobile {
	width: 48px;
	height: 48px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	overflow: hidden;
	flex-shrink: 0; /* 不收缩 */
	background: transparent;
	box-shadow: none;
	cursor: pointer; /* 点击指针 */
	touch-action: manipulation; /* 优化移动端触摸体验 */
}

/** 有头像时的样式：透明背景 */
.user-avatar-mobile.has-avatar {
	background: transparent;
}

/** 无头像时的样式：透明背景 */
.user-avatar-mobile.no-avatar {
	background: transparent;
}

/** 头像图片：覆盖容器，自适应裁剪 */
.user-avatar-mobile .avatar-image-mobile {
	width: 100%;
	height: 100%;
	object-fit: cover; /* 覆盖裁剪，保持比例 */
	border-radius: 8px;
}

/** 默认头像图标：继承文本颜色 */
.user-avatar-mobile .avatar-icon-mobile {
	color: var(--text-primary); /* 主文本色（全局变量） */
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
	gap: 20px; /* 子元素间距 */
	width: 100%;
}

/** 时间卡片：玻璃态，圆角，阴影，hover效果 */
.time-card-mobile {
	background: var(--glass-bg);
	backdrop-filter: blur(20px);
	border-radius: 16px;
	border: 1px solid var(--glass-border);
	box-shadow: 0 6px 24px var(--shadow-color);
	padding: 16px 20px;
	text-align: center;
	transition: all 0.3s ease; /* 平滑过渡 */
	width: 100%;
}

/** 时间卡片hover效果：上移，阴影放大 */
.time-card-mobile:hover {
	transform: translateY(-1px);
	box-shadow: 0 8px 28px var(--shadow-color);
}

/** 时间信息容器：垂直布局，子元素间距 */
.time-info-mobile {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

/** 当前时间展示：水平布局，图标+文本 */
.current-time-mobile {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px; /* 图标与文本间距 */
	font-size: 16px;
	color: var(--text-primary);
	font-weight: 600;
	font-family: 'Courier New', monospace; /* 等宽字体，时间显示更美观 */
}

/** 时间图标：主色调，固定尺寸 */
.time-icon-mobile {
	color: var(--primary-color);
	font-size: 20px;
}

/** 下次签到时间：水平布局，次文本色 */
.next-time-mobile {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	font-size: 12px;
	color: var(--text-secondary);
	font-weight: 500;
}

/** 下次签到图标：三级文本色，小尺寸 */
.next-icon-mobile {
	color: var(--text-tertiary);
	font-size: 14px;
}

/** 签到按钮容器：居中布局 */
.sign-button-container-mobile {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
}

/** 签到按钮：圆形，渐变背景，阴影，交互效果 */
.modern-sign-button-mobile {
	width: 160px;
	height: 160px;
	border-radius: 50%; /* 圆形按钮 */
	border: none; /* 无边框 */
	/* 渐变背景：主色调到次色调 */
	background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
	color: white; /* 白色文本 */
	cursor: pointer; /* 点击指针 */
	position: relative; /* 作为子元素定位容器 */
	overflow: hidden; /* 隐藏溢出的波纹效果 */
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* 平滑过渡 */
	/* 多层阴影：增强立体感 */
	box-shadow: 0 8px 28px rgba(102, 126, 234, 0.3),
	0 0 0 1px rgba(255, 255, 255, 0.1),
	inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/** 签到按钮hover效果（非禁用）：缩放，阴影放大 */
.modern-sign-button-mobile:hover:not(:disabled) {
	transform: translateY(-2px) scale(1.02); /* 上移+轻微放大 */
	box-shadow: 0 12px 36px rgba(102, 126, 234, 0.4),
	0 0 0 1px rgba(255, 255, 255, 0.2),
	inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

/** 签到按钮点击效果（非禁用）：轻微缩小 */
.modern-sign-button-mobile:active:not(:disabled) {
	transform: translateY(-1px) scale(0.98);
}

/** 禁用状态：低透明度，禁止指针，缩小 */
.modern-sign-button-mobile:disabled {
	opacity: 0.6;
	cursor: not-allowed;
	transform: scale(0.95);
}

/** 非签到时段/已签到状态：灰色渐变背景 */
.modern-sign-button-mobile.disabled {
	background: linear-gradient(135deg, #9E9E9E 0%, #757575 100%);
	box-shadow: 0 6px 20px rgba(158, 158, 158, 0.3),
	0 0 0 1px rgba(255, 255, 255, 0.1),
	inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/** 已签到状态：绿色渐变背景 */
.modern-sign-button-mobile.success {
	background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
	box-shadow: 0 8px 28px rgba(76, 175, 80, 0.3),
	0 0 0 1px rgba(255, 255, 255, 0.1),
	inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/** 加载中状态：脉冲动画 */
.modern-sign-button-mobile.loading {
	animation: pulse-mobile 2s ease-in-out infinite;
}

/** 按钮背景层：轻微渐变，增强层次感 */
.button-background-mobile {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
	border-radius: 50%;
}

/** 按钮内容层：相对定位，垂直居中 */
.button-content-mobile {
	position: relative;
	z-index: 2; /* 层级高于背景层 */
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	gap: 8px; /* 图标与文本间距 */
}

/** 图标容器：居中布局 */
.icon-container-mobile {
	display: flex;
	align-items: center;
	justify-content: center;
}

/** 主图标：阴影效果，平滑过渡 */
.main-icon-mobile {
	filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3));
	transition: all 0.3s ease;
}

/** 已签到图标：绿色阴影 */
.success-icon-mobile {
	filter: drop-shadow(0 3px 6px rgba(76, 175, 80, 0.4));
}

/** 禁用状态图标：灰度，低透明度 */
.disabled-icon-mobile {
	opacity: 0.6;
	filter: grayscale(100%) drop-shadow(0 3px 6px rgba(0, 0, 0, 0.2));
}

/** 加载中图标：旋转动画 */
.loading-icon-mobile {
	animation: spin-mobile 1s linear infinite;
	filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/** 按钮文本：白色，阴影，字间距 */
.button-text-mobile {
	font-size: 14px;
	font-weight: 700;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	letter-spacing: 0.5px;
	color: white;
	transition: all 0.3s ease;
}

/** 加载中文本：更小字号 */
.loading-text-mobile {
	font-size: 12px;
	font-weight: 600;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	color: white;
}

/** 按钮波纹效果：点击时扩散的圆形 */
.ripple-effect-mobile {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 0;
	height: 0;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.3); /* 半透明白色 */
	transform: translate(-50%, -50%); /* 居中 */
	transition: all 0.6s ease; /* 缓慢扩散 */
}

/** 按钮点击时波纹扩散 */
.modern-sign-button-mobile:active:not(:disabled) .ripple-effect-mobile {
	width: 200px;
	height: 200px;
}

/** 状态卡片组：网格布局，3列，间距8px */
.status-cards-mobile {
	display: grid;
	grid-template-columns: repeat(3, 1fr); /* 3列等宽 */
	gap: 8px;
	width: 100%;
}

/** 状态卡片：玻璃态，圆角，阴影，hover效果 */
.status-card-mobile {
	background: var(--glass-bg);
	backdrop-filter: blur(20px);
	border-radius: 12px;
	border: 1px solid var(--glass-border);
	box-shadow: 0 3px 12px var(--shadow-color);
	padding: 12px;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
}

/** 状态卡片hover效果：上移，阴影放大 */
.status-card-mobile:hover {
	transform: translateY(-1px);
	box-shadow: 0 6px 18px var(--shadow-color);
}

/** 当前时段卡片：主色调边框，增强高亮 */
.status-card-mobile.active {
	border-color: var(--primary-color);
	box-shadow: 0 6px 18px rgba(102, 126, 234, 0.2);
}

/** 已签到卡片：绿色边框，轻微绿色背景 */
.status-card-mobile.signed {
	border-color: #4CAF50;
	background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);
}

/** 卡片图标容器：固定尺寸，圆角，背景色 */
.card-icon-mobile {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	border-radius: 8px;
	background: var(--primary-color);
	color: white;
	margin-bottom: 8px;
	font-size: 16px;
}

/** 已签到卡片图标：绿色背景 */
.status-card-mobile.signed .card-icon-mobile {
	background: #4CAF50;
}

/** 卡片内容区：居中对齐 */
.card-content-mobile {
	text-align: center;
}

/** 卡片标题：主文本色，小字号，粗体 */
.card-title-mobile {
	font-size: 11px;
	font-weight: 600;
	color: var(--text-primary);
	margin-bottom: 4px;
}

/** 卡片时间：次文本色，极小字号 */
.card-time-mobile {
	font-size: 9px;
	color: var(--text-secondary);
	margin-bottom: 6px;
}

/** 卡片状态：胶囊样式，默认灰色背景 */
.card-status-mobile {
	font-size: 9px;
	font-weight: 500;
	padding: 3px 6px;
	border-radius: 12px; /* 胶囊圆角 */
	background: rgba(158, 158, 158, 0.1);
	color: var(--text-secondary);
	transition: all 0.3s ease;
}

/** 已签到状态：绿色背景，绿色文本 */
.card-status-mobile.signed {
	background: rgba(76, 175, 80, 0.1);
	color: #4CAF50;
}

/** 桌面端提示卡片：玻璃态，水平布局，图标+文本 */
.desktop-tip-card-mobile {
	background: var(--glass-bg);
	backdrop-filter: blur(20px);
	border-radius: 12px;
	border: 1px solid var(--glass-border);
	box-shadow: 0 3px 12px var(--shadow-color);
	padding: 12px 16px;
	width: 100%;
	display: flex;
	align-items: center;
	gap: 12px; /* 图标与文本间距 */
	margin-top: 8px;
}

/** 提示图标容器：固定尺寸，浅主色调背景 */
.tip-icon-mobile {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	border-radius: 8px;
	background: rgba(102, 126, 234, 0.1);
	color: var(--primary-color);
	flex-shrink: 0; /* 不收缩 */
	font-size: 18px;
}

/** 提示内容区：弹性布局，占满剩余空间 */
.tip-content-mobile {
	flex: 1;
	min-width: 0; /* 避免文本溢出 */
}

/** 提示文本：次文本色，小字号，行高优化 */
.tip-text-mobile {
	font-size: 12px;
	color: var(--text-secondary);
	margin: 0;
	line-height: 1.5; /* 行高优化可读性 */
	word-break: break-word; /* 自动换行 */
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
