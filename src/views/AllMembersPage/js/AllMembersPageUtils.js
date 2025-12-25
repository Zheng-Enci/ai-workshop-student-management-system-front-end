import PersonalInformation from "@/views/AllMembersPage/js/PersonalInformation";
import {ElMessage} from "element-plus";

/**
 * 全员页面工具类
 */
class AllMembersPageUtils {
	/**
	 * 按签到次数和积分总和对学生ID进行排序
	 * 排序规则：签到次数 * 0.64 + 积分，按总分降序排列
	 * @param {Array} attendanceRankingData - 签到排名数据，格式：[{ studentInfoId: 1, attendanceCount: 50 }, ...]
	 * @param {Array} pointsRankingData - 积分排名数据，格式：[{ targetStudentInfoId: 1, totalPoints: 150 }, ...]
	 * @returns {Array} 合并后的排序数据，仅包含学生ID，格式：[1, 3, 2, ...]
	 */
	static sortStudentIdsByAttendanceAndPoints(attendanceRankingData, pointsRankingData) {
		// 建立字典，key 为学生数据库表id，初始值为 0
		const studentScoreMap = new Map();

		// 遍历签到排名数据，加上签到次数 * 0.64
		attendanceRankingData.forEach(item => {
			studentScoreMap.set(item.studentInfoId, item.attendanceCount * 0.64);
		});

		// 遍历积分排名数据，加上获得积分
		pointsRankingData.forEach(item => {
			const currentScore = studentScoreMap.get(item.targetStudentInfoId) || 0;
			studentScoreMap.set(item.targetStudentInfoId, currentScore + item.totalPoints);
		});

		// 转换为数组并排序
		const sortedData = Array.from(studentScoreMap.entries()).sort((a, b) => b[1] - a[1]);

		// 返回学生ID数组
		return sortedData.map(item => item[0]);
	}

	/**
	 * 根据学生ID数组批量获取学生详细信息（并行加载）
	 * @param {Array} studentIds - 学生ID数组
	 * @returns {Promise<Array>} 学生详细信息数组
	 */
	static async getStudentProfilesByIds(studentIds) {
		try {
			// 并行加载所有学生数据
			const promises = studentIds.map(studentId =>
				PersonalInformation.getStudentProfileByStudentInfoId(studentId)
			);
			return await Promise.all(promises);
		} catch (error) {
			ElMessage.error('获取学生信息失败, 请检查网络或联系管理员');
			return [];
		}
	}
}

export default AllMembersPageUtils;
