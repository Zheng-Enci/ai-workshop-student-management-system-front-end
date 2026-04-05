/**
 * 学生管理页面类
 */
import { ElMessage } from 'element-plus'

import StudentManagerPageUtils from '@/views/StudentManagerPage/js/StudentManagerPageUtils'

class StudentManagerPage {
	// 管理员所管理的学生列表数据
	static students = []
	// 管理员头像链接
	static adminStudentAvatarUrl = ''

	/**
	 * 加载管理员所管理的学生数据（含统计数据）
	 * @param token - JWT token
	 * @param adminStudentDatabaseTableId
	 * @returns 返回对象包含：
	 *   - students: 学生列表数据
	 *   - attendanceCounts: 签到次数映射表 {studentId: count}
	 *   - totalAttendanceCount: 总签到次数
	 * @throws {Error} 当请求失败时抛出错误
	 */
	static async initData(token, adminStudentDatabaseTableId) {
		try {
			// 调用工具类方法获取学生数据（含签到次数和总积分）
			const students = await StudentManagerPageUtils.fetchManagedStudentsWithStats(token)
			// 为每个学生添加头像链接
			students.forEach(student => {
				student.avatarUrl = StudentManagerPageUtils.getStudentAvatarUrl(student.id)
			})
			StudentManagerPage.students = students
			// 获取管理员头像链接
			StudentManagerPage.adminStudentAvatarUrl = StudentManagerPageUtils
				.getStudentAvatarUrl(adminStudentDatabaseTableId)
		} catch (error) {
			ElMessage.error(`加载数据失败，请稍后再试或联系管理员, 原因：${error.message}` || '未知')
			throw error
		}
	}
}
export default StudentManagerPage
