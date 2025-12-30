import AttendanceApi from "@/api/AttendanceApi";
import {ElMessage} from "element-plus";

// 学生管理页面签到相关服务代码
class StudentManagerPageStudentAttendanceServer {

	// 保存获取过的学生签到记录（字典）
	static studentAttendanceRecords = {};

	/**
	 * 获取学生的签到记录列表
	 * @param {String|Number} studentId - 学生学号
	 * @returns {Promise<Array>} 签到记录列表，每条记录包含 attendanceDateTime 字段
	 * @throws {Error} 当请求失败或数据异常时通过 ElMessage 显示错误信息
	 */
	static async getStudentAttendanceRecords(studentId) {
		if (studentId in StudentManagerPageStudentAttendanceServer.studentAttendanceRecords) {
			return StudentManagerPageStudentAttendanceServer.studentAttendanceRecords[studentId];
		}
		const result = await AttendanceApi.getStudentAttendanceRecords(studentId);

		/// 检查响应状态码
		if (result.code === 200) {
			// 返回签到记录列表
			StudentManagerPageStudentAttendanceServer.studentAttendanceRecords[studentId] = result.data.map(item => ({
				attendanceDateTime: item.attendanceDateTime
			}));
			return StudentManagerPageStudentAttendanceServer.studentAttendanceRecords[studentId];
		} else {
			// 业务异常，抛出错误
			ElMessage.error('获取签到记录失败, 请重试或联系管理员, 原因: ' + result.message || "网络异常");
		}
	}

	/**
	 * 获取指定日期某个时间段的签到时间
	 * @param {String} dateStr - 日期字符串，格式为 "YYYY-MM-DD"
	 * @param {String} slot - 时间段标识，可选值：'morning'(早)、'afternoon'(午)、'evening'(晚)
	 * @param {Array} studentAttendanceRecords - 签到记录的响应式引用对象，数据结构为 [{ attendanceDateTime: String }]
	 * @returns {String} 格式化的签到时间字符串（如 "08:30"），如果该时段无签到记录则返回空字符串
	 *
	 * 时间段划分：
	 * - 早上(morning)：8:00-11:00
	 * - 下午(afternoon)：14:00-17:00
	 * - 晚上(evening)：19:00-22:00
	 */
	static getAttendanceTimeBySlot(dateStr, slot, studentAttendanceRecords) {
		// 将目标日期转换为 Date 对象的日期字符串格式，用于日期比对
		const targetDate = new Date(dateStr).toDateString()
		const records = studentAttendanceRecords

		// 检查签到记录是否存在且非空
		if (!records || !Array.isArray(records) || records.length === 0) {
			return ''
		}

		// 根据时间段查找匹配的签到记录
		const matchedRecords = records.filter(record => {  // ✅ 使用 records，不是 studentAttendanceRecords.value
			// 获取签到记录的日期
			const recordDate = new Date(record.attendanceDateTime).toDateString()
			// 如果日期不匹配，跳过该记录
			if (recordDate !== targetDate) return false

			// 获取签到时间的小时数，用于判断时间段
			const hour = new Date(record.attendanceDateTime).getHours()

			// 根据时间段标识判断签到是否属于该时段
			// 早：8:00-11:00, 午：14:00-17:00, 晚：19:00-22:00
			if (slot === 'morning') {
				return hour >= 8 && hour < 11
			} else if (slot === 'afternoon') {
				return hour >= 14 && hour < 17
			} else if (slot === 'evening') {
				return hour >= 19 && hour < 22
			}
			return false
		})

		// 如果没有找到匹配的签到记录，返回 未签到
		if (matchedRecords.length === 0) {
			return ''
		}

		// 获取第一个匹配的签到记录并格式化时间
		const time = new Date(matchedRecords[0].attendanceDateTime)
		// 返回时:分格式的字符串，如 "08:30"
		return time.toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit', second: '2-digit'})
	}


}

export default StudentManagerPageStudentAttendanceServer;
