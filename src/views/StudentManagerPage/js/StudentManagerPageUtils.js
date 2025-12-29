import StudentApi from "@/api/StudentApi";
import StudentManagerPageConfig from "@/views/StudentManagerPage/js/StudentManagerPageConfig";
import StudentManagementApi from "@/api/StudentManagementApi";

class StudentManagerPageUtils {
	/**
	 * 获取学生头像URL
	 * @param {Number} studentInfoId - 学生数据库表主键ID
	 * @returns {String} 头像URL
	 */
	static getStudentAvatarUrl(studentInfoId) {
		return StudentApi.getAvatarUrl(studentInfoId, StudentManagerPageConfig.AVATAR_SIZE);
	}

	/**
	 * 获取当前管理员所管理的学生综合信息列表（含统计数据）
	 * @param {String} token - JWT token
	 * @returns {Promise<Array>} 学生信息列表
	 * @throws {Error} 当请求失败或数据异常时抛出错误
	 *
	 * 返回数据结构示例：
	 * [
	 *   {
	 *     id: 123,
	 *     studentId: 2021001001,
	 *     name: "张三",
	 *     gender: "男",
	 *     phoneNumber: "13812345678",
	 *     college: "计算机学院",
	 *     grade: 3,
	 *     classNum: 1,
	 *     major: "软件工程",
	 *     attendanceCount: 25,
	 *     totalPoints: 250
	 *   }
	 * ]
	 */
	static async fetchManagedStudentsWithStats(token) {
		const result = await StudentManagementApi.getManagedStudentsWithStats(token);

		// 检查响应状态码
		if (result.code === 200) {
			// 返回学生列表数据
			// 字段映射解析
			if (! result.data && result.data.length > 0) {
				return [];
			}
			return result.data.map(item => ({
				id: item.id,
				studentId: item.studentId,
				name: item.name,
				gender: item.gender,
				phone: item.phoneNumber,
				college: item.college,
				grade: item.grade,
				classNum: item.classNum,
				major: item.major,
				checkInCount: item.attendanceCount,
				points: item.totalPoints,
				gradeDisplay: item.grade,
				classDisplay: item.classNum
			}));
		} else {
			// 业务异常，抛出错误
			throw new Error(result.message || '获取管理学生信息失败');
		}
	}
}

export default StudentManagerPageUtils;
