/**
 * 签到页面桌面端数据加载类
 *
 * @description 用于加载学生签到记录的核心类
 * @class AttendancePageDesktop
 * @author ZhengEnCi zheng_enci_work@foxmail.com
 * @date 2026-01
 * @version 1.0.0
 */

// ===================== 第三方依赖导入区 =====================
import AttendanceApi from '@/api/ts/AttendanceApi'
import {ElMessage} from 'element-plus'
import studentManager from '@/stores/ts/StudentStore'

// ===================== 类型定义区 =====================
/**
 * 签到记录接口
 * @interface AttendanceRecord
 */
interface AttendanceRecord {
	id: string
	studentId: string
	studentName: string
	checkInTime: string
}

// ===================== 类定义区 =====================
/**
 * 签到页面桌面端数据加载类
 * @class AttendancePageDesktop
 */
class AttendancePageDesktop {
	/**
	 * 签到记录数据缓存Promise
	 * 用于确保initData只发起一次请求
	 * @private
	 */
	private initDataPromise: Promise<void> | null = null

	/**
	 * 签到记录数据
	 * @private
	 */
	private attendanceRecords: AttendanceRecord[] = []

	/**
	 * 初始化数据 - 加载学生签到记录
	 * 多次调用只发起一次请求
	 * @async
	 * @function initData
	 * @throws 如果加载失败则抛出错误
	 */
	public async initData(): Promise<void> {
		if (this.initDataPromise) {
			return this.initDataPromise
		}

		this.initDataPromise = this.loadData()
		return this.initDataPromise
	}

	/**
	 * 实际加载数据
	 * @private
	 * @async
	 */
	private async loadData(): Promise<void> {
		try {
			const studentId = studentManager.getStudentId()
			if (!studentId) {
				throw new Error('学生ID不存在，请重新登录')
			}
			const response = await AttendanceApi.getStudentAttendanceRecords(studentId)
			this.attendanceRecords = response.data
		} catch (error) {
			ElMessage.error('加载签到记录失败')
			this.initDataPromise = null
			// 重新抛出错误，让调用者处理
			return Promise.reject(error)
		}
	}

	/**
	 * 获取签到记录
	 * @function getAttendanceRecords
	 * @returns 签到记录数组
	 */
	public getAttendanceRecords(): AttendanceRecord[] {
		return this.attendanceRecords
	}

	/**
	 * 等待数据就绪
	 * @function waitForReady
	 * @description 等待单例数据初始化完成，可安全地获取数据
	 * @returns {Promise<void>}
	 * @example
	 * await attendancePageDesktop.waitForReady()
	 * const records = attendancePageDesktop.getAttendanceRecords()
	 */
	public async waitForReady(): Promise<void> {
		return this.initData()
	}
}

/**
 * 签到页面数据单例实例
 * 确保全局只有一个实例，所有组件获取的数据一致
 */
const attendancePageDesktop = new AttendancePageDesktop()

export default attendancePageDesktop
