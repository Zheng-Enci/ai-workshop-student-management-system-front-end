/**
 * AttendancePageMobile 控制器类
 * @file AttendancePageMobileController.ts
 * @description 签到页面移动端控制器，封装所有业务逻辑和状态管理
 * @author 开发人员
 * @version 1.0.0
 */

// ======================== 依赖导入 ========================
import {ElMessage} from 'element-plus'
import {ref, type Ref} from 'vue'
import {useRouter} from 'vue-router'
import AttendanceApi from '@/api/ts/AttendanceApi'
import StudentApi from '@/api/ts/StudentApi'
import {useThemeStore} from '@/stores/ts/theme'
import {useUserStore} from '@/stores/ts/user'
import {useLoadingMaskStore} from '@/stores/ts/loading'
import AttendancePageConfig from '@/views/AttendancePage/mobile/common/ts/AttendancePageConfig'
import {flameController} from '@/views/AttendancePage/mobile/ts/FlameDisplayController'

/**
 * 签到页面移动端控制器类
 * 遵循项目 OOP 规范，使用类封装所有业务逻辑
 */
export default class AttendancePageMobileController {
	// ======================== 私有属性 ========================
	/** Vue Router 实例 */
	private router: ReturnType<typeof useRouter>
	/** 用户状态仓库 */
	private userStore: ReturnType<typeof useUserStore>
	/** 主题状态仓库 */
	private themeStore: ReturnType<typeof useThemeStore>
	/** 加载蒙版状态仓库 */
	private loadingMaskStore: ReturnType<typeof useLoadingMaskStore>
	/** 定时器实例 - 用于实时更新时间 */
	private timeInterval: Ref<ReturnType<typeof setInterval> | null> = ref(null)

	// ======================== 公共响应式状态 ========================
	/** 通用加载状态 - 用于按钮/接口请求加载中展示 */
	public loading: Ref<boolean> = ref(false)
	/** 学生等级 - 预留扩展字段，暂未使用 */
	public studentLevel: Ref<number> = ref(0)
	/** 是否处于签到时间段内 - 控制签到按钮可点击状态 */
	public isInSignTime: Ref<boolean> = ref(false)
	/** 当前时间字符串 - 格式：HH:MM:SS，实时更新 */
	public currentTime: Ref<string> = ref('')
	/** 当前日期字符串 - 格式：YYYY年MM月DD日，实时更新 */
	public currentDate: Ref<string> = ref('')
	/** 下次签到时间提示文本 - 非签到时段展示 */
	public nextSignTime: Ref<string> = ref('')
	/** 验证码弹窗显示状态 - 控制弹窗显隐 */
	public showVerificationCodeDialog: Ref<boolean> = ref(false)
	/** 用户输入的验证码 - 双向绑定输入框 */
	public inputVerificationCode: Ref<string> = ref('')
	/** 当日签到状态对象 - 存储早中晚三个时段的签到时间 */
	public attendanceStatus: Ref<{morning: string | null, afternoon: string | null, evening: string | null}> = ref({
		morning: null,
		afternoon: null,
		evening: null
	})
	/** 是否有用户头像 - 控制默认头像/自定义头像展示 */
	public hasAvatar: Ref<boolean> = ref(false)
	/** 用户头像URL - 成功获取后赋值 */
	public avatarUrl: Ref<string | null> = ref(null)
	/** 头像提示是否已显示 - 控制"上传头像"提示只显示一次 */
	public avatarTipShown: Ref<boolean> = ref(false)
	/** 本周每天的签到数据 */
	public weeklyAttendanceData: Ref<Array<{date: string, dayName: string, isToday: boolean, isFuture: boolean, slots: {morning: boolean, afternoon: boolean, evening: boolean}}>> = ref([
		{date: '', dayName: '周一', isToday: false, isFuture: false, slots: {morning: false, afternoon: false, evening: false}},
		{date: '', dayName: '周二', isToday: false, isFuture: false, slots: {morning: false, afternoon: false, evening: false}},
		{date: '', dayName: '周三', isToday: false, isFuture: false, slots: {morning: false, afternoon: false, evening: false}},
		{date: '', dayName: '周四', isToday: false, isFuture: false, slots: {morning: false, afternoon: false, evening: false}},
		{date: '', dayName: '周五', isToday: false, isFuture: false, slots: {morning: false, afternoon: false, evening: false}},
		{date: '', dayName: '周六', isToday: false, isFuture: false, slots: {morning: false, afternoon: false, evening: false}},
		{date: '', dayName: '周日', isToday: false, isFuture: false, slots: {morning: false, afternoon: false, evening: false}}
	])
	/** 本周签到数据加载状态 */
	public weeklyAttendanceLoading: Ref<boolean> = ref(false)
	/** 是否显示圆圈入场动画 */
	public showCircleAnimation: Ref<boolean> = ref(false)
	/** 学生数据库表主键ID */
	public studentInfoId: Ref<number | null> = ref(null)
	/** 今日签到状态（从服务器获取） */
	public todayAttendanceSlots: Ref<{morning: boolean, afternoon: boolean, evening: boolean}> = ref({
		morning: false,
		afternoon: false,
		evening: false
	})
	/** 火焰控制器实例 */
	public flameController = flameController

	// ======================== 构造函数 ========================
	/**
	 * 构造函数
	 * 初始化所有依赖和状态
	 */
	constructor() {
		this.router = useRouter()
		this.userStore = useUserStore()
		this.themeStore = useThemeStore()
		this.loadingMaskStore = useLoadingMaskStore()
	}

	// ======================== Getter 方法 ========================
	/**
	 * 获取主题切换方法
	 */
	public get toggleTheme(): () => void {
		return this.themeStore.toggleTheme
	}

	// ======================== 头像相关方法 ========================
	/**
	 * 展示默认头像并提示上传
	 */
	public showDefaultAvatar(): void {
		this.hasAvatar.value = false
		this.avatarUrl.value = null
		if (!this.avatarTipShown.value) {
			ElMessage.info({
				message: '您还没有上传头像，点击头像即可上传',
				duration: 4000,
				showClose: true
			})
			this.avatarTipShown.value = true
		}
	}

	/**
	 * 处理头像点击事件
	 */
	public async handleAvatarClick(): Promise<void> {
		await this.router.push('/profile')
	}

	/**
	 * 加载用户头像
	 */
	public async loadUserAvatar(): Promise<void> {
		try {
			const token = localStorage.getItem('token')
			if (!token) {
				this.showDefaultAvatar()
				return
			}

			const idResponse = await StudentApi.getStudentDatabaseTableId(token)
			if (idResponse.code !== 200 || !idResponse.data) {
				this.showDefaultAvatar()
				return
			}

			const studentInfoId = idResponse.data
			const avatarUrlString = StudentApi.getAvatarUrl(studentInfoId, AttendancePageConfig.AVATAR_SIZE)

			if (!avatarUrlString) {
				this.showDefaultAvatar()
				return
			}

			this.avatarUrl.value = avatarUrlString
			this.hasAvatar.value = true
		} catch (error) {
			console.error('加载用户头像失败:', error)
			this.showDefaultAvatar()
		}
	}

	// ======================== 导航方法 ========================
	/**
	 * 返回导航页面
	 */
	public async goToNavigation(): Promise<void> {
		await this.router.push('/navigation')
	}

	// ======================== 时段相关方法 ========================
	/**
	 * 获取当前所处的签到时段
	 * @returns 时段标识：morning/afternoon/evening 或 null
	 */
	public getCurrentTimeSlot(): string | null {
		const now = new Date()
		const hour = now.getHours()

		if (hour >= 8 && hour < 11) {
			return 'morning'
		}
		if (hour >= 14 && hour < 17) {
			return 'afternoon'
		}
		if (hour >= 19 && hour < 22) {
			return 'evening'
		}
		return null
	}

	/**
	 * 判断当前时段是否已签到
	 * @returns true=已签到，false=未签到/非签到时段
	 */
	public isCurrentSlotSigned(): boolean {
		try {
			const currentSlot = this.getCurrentTimeSlot()
			if (!currentSlot) {
				return false
			}
			return this.isSlotSigned(currentSlot)
		} catch (error) {
			console.error('判断当前时段签到状态失败:', error)
			return false
		}
	}

	/**
	 * 检查指定时段是否已签到
	 * @param slot - 时段标识：morning/afternoon/evening
	 * @returns true=已签到，false=未签到
	 */
	public isSlotSigned(slot: string): boolean {
		try {
			return this.todayAttendanceSlots.value[slot as keyof typeof this.todayAttendanceSlots.value] || false
		} catch (error) {
			console.error(`检查${slot}时段签到状态失败:`, error)
			return false
		}
	}

	// ======================== 本地存储相关方法 ========================
	/**
	 * 加载本地存储的签到状态
	 */
	public loadAttendanceStatus(): void {
		const today = new Date().toDateString()
		const saved = localStorage.getItem(`attendance_${today}`)
		if (saved) {
			try {
				const parsed = JSON.parse(saved)
				if (parsed && typeof parsed === 'object' &&
					'morning' in parsed && 'afternoon' in parsed && 'evening' in parsed) {
					this.attendanceStatus.value = parsed
				} else {
					this.attendanceStatus.value = {morning: null, afternoon: null, evening: null}
				}
			} catch (e) {
				console.error('解析本地签到状态失败:', e)
				this.attendanceStatus.value = {morning: null, afternoon: null, evening: null}
			}
		} else {
			this.attendanceStatus.value = {morning: null, afternoon: null, evening: null}
		}
	}

	/**
	 * 同步本地签到状态
	 */
	public async syncAllAttendanceStatus(): Promise<void> {
		try {
			const today = new Date().toDateString()
			const saved = localStorage.getItem(`attendance_${today}`)

			if (saved) {
				try {
					const status = JSON.parse(saved)
					if (status && typeof status === 'object') {
						this.attendanceStatus.value = {
							morning: status.morning || null,
							afternoon: status.afternoon || null,
							evening: status.evening || null
						}
					}
				} catch (e) {
					console.error('同步本地签到状态失败:', e)
					this.attendanceStatus.value = {morning: null, afternoon: null, evening: null}
				}
			}
		} catch (error) {
			console.error('同步签到状态异常:', error)
			this.attendanceStatus.value = {morning: null, afternoon: null, evening: null}
		}
	}

	/**
	 * 保存签到状态到本地存储
	 */
	public saveAttendanceStatus(): void {
		const today = new Date().toDateString()
		if (this.attendanceStatus.value && typeof this.attendanceStatus.value === 'object') {
			localStorage.setItem(`attendance_${today}`, JSON.stringify(this.attendanceStatus.value))
		} else {
			const defaultStatus = {morning: null, afternoon: null, evening: null}
			localStorage.setItem(`attendance_${today}`, JSON.stringify(defaultStatus))
		}
	}

	// ======================== 时间检查方法 ========================
	/**
	 * 检查当前是否在签到时间内
	 */
	public checkSignTime(): void {
		const now = new Date()
		const hour = now.getHours()
		const minute = now.getMinutes()
		const second = now.getSeconds()

		this.currentTime.value = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`

		const year = now.getFullYear()
		const month = (now.getMonth() + 1).toString().padStart(2, '0')
		const day = now.getDate().toString().padStart(2, '0')
		this.currentDate.value = `${year}年${month}月${day}日`

		const signTimeRanges = [
			{start: 8, end: 11, name: '上午'},
			{start: 14, end: 17, name: '下午'},
			{start: 19, end: 22, name: '晚上'}
		]

		let inTime = false
		let nextTime = ''

		for (const range of signTimeRanges) {
			if (hour >= range.start && hour < range.end) {
				inTime = true
				break
			} else if (hour < range.start) {
				nextTime = `${range.start}:00`
				break
			}
		}

		this.isInSignTime.value = inTime
		this.nextSignTime.value = nextTime

		if (minute === 0 && second === 0) {
			void this.syncAllAttendanceStatus()
		}
	}

	// ======================== 生命周期方法 ========================
	/**
	 * 组件挂载时初始化
	 */
	public onMounted(): void {
		this.loadAttendanceStatus()
		void this.loadUserAvatar()
		this.checkSignTime()
		this.timeInterval.value = setInterval(() => this.checkSignTime(), 1000)
		void this.loadWeeklyAttendance()
	}

	/**
	 * 组件卸载时清理
	 */
	public onUnmounted(): void {
		if (this.timeInterval.value) {
			clearInterval(this.timeInterval.value)
			this.timeInterval.value = null
		}
	}

	// ======================== 本周签到数据加载 ========================
	/**
	 * 加载本周签到概览数据
	 * 通过 getStudentRecordsByTimeRange 接口获取本周签到记录，并转换为周签到数据结构
	 */
	public async loadWeeklyAttendance(): Promise<void> {
		this.weeklyAttendanceLoading.value = true
		try {
			const token = this.userStore.token || localStorage.getItem('token')
			if (!token) {
				return
			}

			// 获取学生数据库表主键ID
			const idResponse = await StudentApi.getStudentDatabaseTableId(token)
			if (idResponse.code !== 200 || !idResponse.data) {
				console.error('获取学生ID失败')
				return
			}
			const studentInfoId = idResponse.data

			// 计算本周的起止时间（周一 00:00:00 到周日 23:59:59）
			const now = new Date()
			const currentDay = now.getDay() // 0=周日, 1=周一, ..., 6=周六
			const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay // 计算到本周一的天数偏移

			const monday = new Date(now)
			monday.setDate(now.getDate() + mondayOffset)
			monday.setHours(0, 0, 0, 0)

			const sunday = new Date(monday)
			sunday.setDate(monday.getDate() + 6)
			sunday.setHours(23, 59, 59, 999)

			// 格式化时间为 yyyy-MM-dd HH:mm:ss
			const formatDateTime = (date: Date): string => {
				const year = date.getFullYear()
				const month = (date.getMonth() + 1).toString().padStart(2, '0')
				const day = date.getDate().toString().padStart(2, '0')
				const hours = date.getHours().toString().padStart(2, '0')
				const minutes = date.getMinutes().toString().padStart(2, '0')
				const seconds = date.getSeconds().toString().padStart(2, '0')
				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
			}

			const startTime = formatDateTime(monday)
			const endTime = formatDateTime(sunday)

			// 调用 API 获取本周签到记录
			const records = await AttendanceApi.getStudentRecordsByTimeRange(studentInfoId, startTime, endTime)

			// 处理签到记录数据
			this.processWeeklyData(records)
			this.updateFlameController()
		} catch (error) {
			console.error('加载本周签到数据失败:', error)
		} finally {
			this.weeklyAttendanceLoading.value = false
			setTimeout(() => {
				this.showCircleAnimation.value = true
			}, 100)
		}
	}

	/**
	 * 处理本周签到数据
	 * 将时间字符串数组转换为周签到数据结构
	 * @param records - 服务器返回的签到时间字符串数组，格式：['2025-04-14 08:30:00', ...]
	 */
	private processWeeklyData(records: string[]): void {
		const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
		const today = new Date()

		// 初始化本周7天的数据结构
		const weeklyData: Array<{date: string, dayName: string, slots: {morning: boolean, afternoon: boolean, evening: boolean}}> = []

		// 计算本周一的日期
		const currentDay = today.getDay() // 0=周日, 1=周一, ..., 6=周六
		const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay
		const monday = new Date(today)
		monday.setDate(today.getDate() + mondayOffset)

		// 获取今天的日期字符串，用于判断 isToday 和 isFuture
		const todayString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`

		// 生成本周7天的初始数据（所有时段未签到）
		for (let i = 0; i < 7; i++) {
			const date = new Date(monday)
			date.setDate(monday.getDate() + i)
			const year = date.getFullYear()
			const month = (date.getMonth() + 1).toString().padStart(2, '0')
			const day = date.getDate().toString().padStart(2, '0')
			const dateString = `${year}-${month}-${day}`

			// 判断是否是今天或未来日期
			const isToday = dateString === todayString
			const isFuture = date > today

			weeklyData.push({
				date: dateString,
				dayName: weekDays[date.getDay()],
				isToday,
				isFuture,
				slots: {
					morning: false,
					afternoon: false,
					evening: false
				}
			})
		}

		// 根据签到记录更新各时段状态
		// 时间段定义：morning=08:00-11:00, afternoon=14:00-17:00, evening=19:00-22:00
		records.forEach(record => {
			const recordDate = new Date(record)
			const year = recordDate.getFullYear()
			const month = (recordDate.getMonth() + 1).toString().padStart(2, '0')
			const day = recordDate.getDate().toString().padStart(2, '0')
			const dateString = `${year}-${month}-${day}`
			const hour = recordDate.getHours()

			// 找到对应的日期数据
			const dayData = weeklyData.find(item => item.date === dateString)
			if (dayData) {
				// 根据小时判断时段
				if (hour >= 8 && hour < 11) {
					dayData.slots.morning = true
				} else if (hour >= 14 && hour < 17) {
					dayData.slots.afternoon = true
				} else if (hour >= 19 && hour < 22) {
					dayData.slots.evening = true
				}
			}
		})

		this.weeklyAttendanceData.value = weeklyData

		// 更新今日签到状态
		const todayData = weeklyData.find(item => item.isToday)

		if (todayData) {
			this.todayAttendanceSlots.value = {
				morning: todayData.slots.morning,
				afternoon: todayData.slots.afternoon,
				evening: todayData.slots.evening
			}
		}
	}

	/**
	 * 更新火焰控制器
	 * 计算本周总签到次数（所有日期的 morning + afternoon + evening）
	 */
	private updateFlameController(): void {
		// 计算本周总签到次数（所有日期的签到时段总和）
		let totalCount = 0
		this.weeklyAttendanceData.value.forEach(dayData => {
			totalCount += Object.values(dayData.slots).filter(Boolean).length
		})
		this.flameController.updateCount(totalCount)
	}

	// ======================== 签到提交方法 ========================
	/**
	 * 提交签到
	 */
	public async submitAttendance(): Promise<void> {
		if (!this.isInSignTime.value) {
			ElMessage.warning('当前不在签到时间段内')
			return
		}

		if (this.isCurrentSlotSigned()) {
			ElMessage.info('您已经签到过了，无需重复签到')
			return
		}

		this.showVerificationCodeDialog.value = true
	}

	/**
	 * 提交验证码
	 */
	public async submitVerificationCode(): Promise<void> {
		if (!this.inputVerificationCode.value || this.inputVerificationCode.value.length !== 6) {
			ElMessage.warning('请输入6位验证码')
			return
		}

		this.loading.value = true

		try {
			const token = this.userStore.token || localStorage.getItem('token')
			if (!token) {
				ElMessage.error('请先登录')
				await this.router.push('/login')
				this.loading.value = false
				this.showVerificationCodeDialog.value = false
				return
			}

			const res = await AttendanceApi.signIn(token, this.inputVerificationCode.value)

			if (res.code === 200) {
				await this.handleSignInSuccess('签到成功！')
			} else if (res.code === 400 && res.message && res.message.includes('已签到')) {
				await this.handleSignInSuccess('您已签到，无需重复签到')
			} else if (res.message && (res.message.includes('验证码错误') || res.message.includes('验证码已过期'))) {
				ElMessage.error(res.message)
				this.inputVerificationCode.value = ''
			} else {
				ElMessage.error(res.message || '签到失败，请重试')
			}
		} catch (error) {
			console.error('签到失败:', error)
			ElMessage.error('签到失败，请检查网络后重试')
		} finally {
			this.loading.value = false
		}
	}

	/**
	 * 取消验证码输入
	 */
	public cancelVerificationCode(): void {
		this.showVerificationCodeDialog.value = false
		this.inputVerificationCode.value = ''
	}

	/**
	 * 处理签到成功后的状态更新
	 * @param message - 成功提示消息
	 */
	private async handleSignInSuccess(message: string): Promise<void> {
		const currentSlot = this.getCurrentTimeSlot()
		if (currentSlot) {
			this.todayAttendanceSlots.value = {
				...this.todayAttendanceSlots.value,
				[currentSlot]: true
			}
			this.attendanceStatus.value = {
				...this.attendanceStatus.value,
				[currentSlot]: new Date().toISOString()
			}
			this.saveAttendanceStatus()
		}
		await this.loadWeeklyAttendance()
		this.showVerificationCodeDialog.value = false
		this.inputVerificationCode.value = ''
		ElMessage.success(message)
	}

	// ======================== 辅助方法 ========================
	/**
	 * 获取签到时段的CSS类名
	 * @param slots - 时段签到状态对象
	 * @returns CSS类名
	 */
	public getSlotClass(slots: { morning: boolean; afternoon: boolean; evening: boolean }): string {
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
	 * @param slots - 时段签到状态对象
	 * @returns 已签到次数
	 */
	public getSignedCount(slots: { morning: boolean; afternoon: boolean; evening: boolean }): number {
		let count = 0
		if (slots.morning) count++
		if (slots.afternoon) count++
		if (slots.evening) count++
		return count
	}
}
