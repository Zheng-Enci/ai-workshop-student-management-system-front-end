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

/**
 * 签到记录响应接口
 * @interface AttendanceRecordsResponse
 */
interface AttendanceRecordsResponse {
	data: AttendanceRecord[]
}

// ===================== 类定义区 =====================
/**
 * 签到页面桌面端数据加载类
 * @class AttendancePageDesktop
 */
export default class AttendancePageDesktop {
	/**
	 * 签到记录数据
	 * @private
	 */
	private attendanceRecords: AttendanceRecord[] = []

	/**
	 * 初始化数据 - 加载学生签到记录
	 * @async
	 * @function initData
	 * @returns 签到记录数组
	 * @throws 如果加载失败则抛出错误
	 */
	public async initData(): Promise<AttendanceRecord[]> {
		try {
			const studentId = studentManager.getStudentId()
			if (!studentId) {
				throw new Error('学生ID不存在，请重新登录')
			}
			const response = await AttendanceApi.getStudentAttendanceRecords(studentId)
			this.attendanceRecords = response.data
			return this.attendanceRecords
		} catch (error) {
			console.error('加载签到记录失败:', error)
			throw error
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
	 * 获取学生ID
	 * @function getStudentId
	 * @returns 学生ID
	 */
	public getStudentId(): string {
		return studentManager.getStudentId() || ''
	}
}
