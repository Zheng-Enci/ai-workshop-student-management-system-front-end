/**
 * 考勤记录对话框类
 * 控制考勤记录表单的显示与隐藏
 */
import {reactive} from 'vue'
import {ElMessage} from "element-plus";

class StudentManagerPageAttendance_Records_Dialog {
	// 响应式状态
	static state = reactive({
		attendanceRecordsDialogVisible: false,
		selectedStudent: null,
		studentAttendanceRecords: [],
		calendarValue: new Date(),
		attendanceRecordsLoading: false
	})

	// 学生考勤服务实例
	static studentManagerPageStudentAttendanceServer = null

	/**
	 * 设置学生考勤服务实例
	 * @param studentManagerPageStudentAttendanceServer 学生考勤服务实例
	 */
	static setStudentAttendanceServer(studentManagerPageStudentAttendanceServer) {
		this.studentManagerPageStudentAttendanceServer = studentManagerPageStudentAttendanceServer
	}

	/**
	 * 打开考勤记录对话框
	 * @param {Object} student 学生信息对象
	 * @returns {Promise<void>}
	 */
	static async openAttendanceRecordsDialog(student) {
		this.state.selectedStudent = student

		try {
			this.state.attendanceRecordsLoading = true
			this.state.studentAttendanceRecords = await this.studentManagerPageStudentAttendanceServer.getStudentAttendanceRecords(student.studentId)
			this.state.attendanceRecordsDialogVisible = true
			document.body.style.overflow = 'hidden'
		} catch (error) {
			ElMessage.error('获取考勤记录失败：' + error.message)
		} finally {
			this.state.attendanceRecordsLoading = false
		}
	}

	/**
	 * 关闭考勤记录对话框
	 */
	static closeAttendanceRecordsDialog() {
		// 手动隐藏遮罩层，避免视觉闪烁
		const dialogWrapper = document.querySelector('.attendance-records-dialog-overlay')
		if (dialogWrapper) {
			dialogWrapper.style.display = 'none'
			dialogWrapper.style.visibility = 'hidden'
			dialogWrapper.style.opacity = '0'
		}
		// 再隐藏对话框
		this.state.attendanceRecordsDialogVisible = false
		document.body.style.overflow = ''
		this.state.selectedStudent = null
		this.state.studentAttendanceRecords = []
	}

	/**
	 * 获取对话框可见性
	 * @returns {boolean}
	 */
	static get attendanceRecordsDialogVisible() {
		return this.state.attendanceRecordsDialogVisible
	}

	/**
	 * 设置对话框可见性
	 * @param {boolean} value
	 */
	static set attendanceRecordsDialogVisible(value) {
		this.state.attendanceRecordsDialogVisible = value
	}

	/**
	 * 获取当前选中的学生
	 * @returns {Object|null}
	 */
	static getSelectedStudent() {
		return this.state.selectedStudent
	}

	/**
	 * 获取考勤记录数据
	 * @returns {Array}
	 */
	static getAttendanceRecords() {
		return this.state.studentAttendanceRecords
	}

	/**
	 * 获取日历值
	 * @returns {Date}
	 */
	static get calendarValue() {
		return this.state.calendarValue
	}

	/**
	 * 设置日历值
	 * @param {Date} date 日期值
	 */
	static setCalendarValue(date) {
		this.state.calendarValue = date
	}

	/**
	 * 获取加载状态
	 * @returns {boolean}
	 */
	static get isLoading() {
		return this.state.attendanceRecordsLoading
	}

	/**
	 * 设置加载状态
	 * @param {boolean} value
	 */
	static set attendanceRecordsLoading(value) {
		this.state.attendanceRecordsLoading = value
	}
}

export default StudentManagerPageAttendance_Records_Dialog
