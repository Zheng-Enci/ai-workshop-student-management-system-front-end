/**
 * 签到记录日历组件TypeScript逻辑
 *
 * @description 签到记录日历组件，负责日历数据处理和签到状态判断
 * 该组件展示学生签到记录的日历视图，按日期显示早/午/晚时段的签到状态
 * 数据从AttendancePageDesktop单例获取，确保全局数据一致性
 * @class AttendancePageCalendarDesktopComponent
 * @author ZhengEnCi zheng_enci_work@foxmail.com
 * @date 2026-01
 * @version 1.0.0
 */

// ===================== 第三方依赖导入区 =====================
/**
 * Vue响应式API导入
 * @description ref用于创建响应式引用，Ref为类型定义
 */
import { ref, type Ref } from 'vue'

/**
 * Element Plus消息组件导入
 * @description ElMessage用于显示错误提示信息
 */
import { ElMessage } from 'element-plus'

/**
 * 签到页面数据单例导入
 * @description attendancePageDesktop是AttendancePageDesktop类的单例实例
 * 提供waitForReady()方法等待数据就绪，getAttendanceRecords()方法获取签到记录
 */
import attendancePageDesktop from './AttendancePageDesktop'

// ===================== 类型定义区 =====================
/**
 * 签到记录接口
 * @interface AttendanceRecord
 * @description 定义签到记录的数据结构
 * @property {string} attendanceDateTime - 签到日期时间，ISO 8601格式
 */
interface AttendanceRecord {
	attendanceDateTime: string
}

// ===================== 类定义区 =====================
/**
 * 签到记录日历组件类
 * @class AttendancePageCalendarDesktopComponent
 * @description
 * 封装签到记录日历的所有功能，包括：
 * 1. 数据加载：从AttendancePageDesktop单例获取签到记录
 * 2. 日期处理：格式化日历标题、切换月份等
 * 3. 签到状态判断：判断指定日期的指定时段是否已签到
 * 4. 时间格式化：格式化签到时间、获取时段标签等
 */
export default class AttendancePageCalendarDesktopComponent {
	/**
	 * 签到记录数据
	 * @public
	 * @description 存储从单例获取的签到记录数组，使用ref实现响应式
	 * 在loadData()方法中赋值，在模板中通过.value访问
	 * 使用响应式数据确保数据变化时UI自动更新
	 */
	public attendanceRecords: Ref<AttendanceRecord[]> = ref([])

	/**
	 * 日历当前选中日期
	 * @public
	 * @description 日历组件当前选中的日期，双向绑定
	 * 默认值为当前日期，可通过prevMonth/nextMonth/goToday方法修改
	 */
	public calendarValue: Ref<Date> = ref(new Date())

	/**
	 * 日历标题文本
	 * @public
	 * @description 日历头部显示的标题，格式为「YYYY年 月份中文名」
	 * 随calendarValue变化自动更新
	 */
	public calendarTitle: Ref<string> = ref(this.formatCalendarTitle(new Date()))

	/**
	 * 加载签到记录数据
	 * @public
	 * @async
	 * @description
	 * 从AttendancePageDesktop单例加载签到记录数据
	 * 流程：
	 * 1. 调用waitForReady()等待单例数据初始化完成
	 * 2. 调用getAttendanceRecords()获取签到记录
	 * @throws 如果数据加载失败，会显示错误提示信息
	 */
	public async loadData(): Promise<void> {
		try {
			// 等待单例数据初始化完成，确保数据已加载
			await attendancePageDesktop.waitForReady()

			// 从单例获取签到记录数据，使用.value赋值以保持响应式
			this.attendanceRecords.value = attendancePageDesktop.getAttendanceRecords()
		} catch (error) {
			// 数据加载失败，显示错误提示信息
			ElMessage.error('加载签到记录失败')
		}
	}

	/**
	 * 格式化日历标题
	 * @private
	 * @param {Date | string} date - 目标日期
	 * @returns {string} 格式化后的日历标题，格式为「YYYY年 月份中文名」
	 * @description 将日期格式化为日历标题显示格式
	 */
	private formatCalendarTitle(date: Date | string): string {
		const dateObj = new Date(date)
		const year = dateObj.getFullYear()
		const month = dateObj.getMonth() + 1

		// 月份中文名映射
		const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

		// 检查日期是否有效
		if (isNaN(year) || isNaN(month)) {
			const today = new Date()
			return `${today.getFullYear()}年 ${monthNames[today.getMonth()]}`
		}

		return `${year}年 ${monthNames[month - 1]}`
	}

	/**
	 * 更新日历标题
	 * @private
	 * @description 根据calendarValue更新calendarTitle
	 */
	private updateCalendarTitle(): void {
		this.calendarTitle.value = this.formatCalendarTitle(this.calendarValue.value)
	}

	/**
	 * 日历切换到上个月
	 * @public
	 * @description 点击上个月按钮时触发，更新日历选中日期和标题
	 */
	public prevMonth(): void {
		const date = new Date(this.calendarValue.value)
		date.setMonth(date.getMonth() - 1)
		this.calendarValue.value = date
		this.updateCalendarTitle()
	}

	/**
	 * 日历切换到下个月
	 * @public
	 * @description 点击下个月按钮时触发，更新日历选中日期和标题
	 */
	public nextMonth(): void {
		const date = new Date(this.calendarValue.value)
		date.setMonth(date.getMonth() + 1)
		this.calendarValue.value = date
		this.updateCalendarTitle()
	}

	/**
	 * 日历跳转到今天
	 * @public
	 * @description 点击今天按钮时触发，重置日历选中日期为当前日期
	 */
	public goToday(): void {
		this.calendarValue.value = new Date()
		this.updateCalendarTitle()
	}

	/**
	 * 判断指定日期的指定时段是否已签到
	 * @public
	 * @param {string} dateStr - 目标日期（格式：YYYY-MM-DD）
	 * @param {string} timeSlot - 目标时段（morning/afternoon/evening）
	 * @returns {boolean} 该时段是否已签到
	 * @description
	 * 检测指定日期和时段是否存在签到记录
	 * 时段划分规则：
	 * - morning: 6-12点
	 * - afternoon: 12-18点
	 * - evening: 18-24点
	 */
	public isTimeSlotSigned(dateStr: string, timeSlot: string): boolean {
		// 无签到记录时返回false，使用.value访问响应式数据
		if (!this.attendanceRecords.value || this.attendanceRecords.value.length === 0) {
			return false
		}

		// 检测是否存在指定日期+时段的签到记录，使用.value访问响应式数据
		return this.attendanceRecords.value.some(record => {
			// 数据容错
			if (!record || !record.attendanceDateTime) {
				return false
			}

			// 解析记录日期
			const recordDate = new Date(record.attendanceDateTime)
			const [recordDateStr] = recordDate.toISOString().split('T')

			// 日期不匹配直接返回false
			if (recordDateStr !== dateStr) {
				return false
			}

			// 提取小时数判断时段
			const hour = recordDate.getHours()

			// 根据时段参数匹配
			switch (timeSlot) {
				case 'morning': // 早上（6-12点）
					return hour >= 6 && hour < 12
				case 'afternoon': // 下午（12-18点）
					return hour >= 12 && hour < 18
				case 'evening': // 晚上（18-24点）
					return hour >= 18 && hour < 24
				default:
					return false
			}
		})
	}

	/**
	 * 获取指定日期的所有签到时间
	 * @public
	 * @param {string} dateStr - 目标日期（格式：YYYY-MM-DD）
	 * @returns {string[]} 该日期下的所有签到时间字符串数组（ISO格式）
	 * @description 过滤指定日期的所有签到记录，返回签到时间数组
	 */
	public getDateAttendanceTimes(dateStr: string): string[] {
		// 无签到记录时返回空数组，使用.value访问响应式数据
		if (!this.attendanceRecords.value || this.attendanceRecords.value.length === 0) {
			return []
		}

		// 过滤指定日期的签到记录，并提取签到时间，使用.value访问响应式数据
		return this.attendanceRecords.value
			.filter(record => {
				// 数据容错：排除空记录/无时间字段的记录
				if (!record || !record.attendanceDateTime) {
					return false
				}

				// 解析记录日期并与目标日期对比
				const recordDate = new Date(record.attendanceDateTime)
				const [recordDateStr] = recordDate.toISOString().split('T')
				return recordDateStr === dateStr
			})
			.map(record => record.attendanceDateTime)
	}

	/**
	 * 格式化签到时间
	 * @public
	 * @param {string} timeStr - 原始时间字符串（ISO格式）
	 * @returns {string} 格式化后的时间字符串（HH:MM:SS）
	 * @description 将ISO格式时间转换为可读的时间字符串
	 */
	public formatAttendanceTime(timeStr: string): string {
		const date = new Date(timeStr)
		const hours = date.getHours().toString().padStart(2, '0')
		const minutes = date.getMinutes().toString().padStart(2, '0')
		const seconds = date.getSeconds().toString().padStart(2, '0')
		return `${hours}:${minutes}:${seconds}`
	}

	/**
	 * 根据签到时间判断时段标签
	 * @public
	 * @param {string} timeStr - 原始时间字符串（ISO格式）
	 * @returns {string} 时段标签文本（早上/下午/晚上/其他）
	 * @description
	 * 根据时间判断所属时段：
	 * - 早上: 6-12点
	 * - 下午: 12-18点
	 * - 晚上: 18-24点
	 * - 其他: 0-6点
	 */
	public getTimeSlotLabel(timeStr: string): string {
		const date = new Date(timeStr)
		const hour = date.getHours()

		// 时段划分规则
		if (hour >= 6 && hour < 12) {
			return '早上'
		}
		if (hour >= 12 && hour < 18) {
			return '下午'
		}
		if (hour >= 18 && hour < 24) {
			return '晚上'
		}
		return '其他'
	}
}
