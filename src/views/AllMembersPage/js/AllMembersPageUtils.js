import PersonalInformation from "@/views/AllMembersPage/js/PersonalInformation";
import {ElMessage} from "element-plus";
import StatisticsApi from "@/api/StatisticsApi";
import StudentApi from "@/api/StudentApi";
import Config from "./Config";
import PointsApi from "@/api/PointsApi";

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

	/**
	 * 获取学生综合排名列表
	 * @param {Number} startRank - 起始排名（从1开始）
	 * @param {Number} endRank - 结束排名
	 * @returns {Promise<Array>} 学生对象列表
	 */
	static async getComprehensiveRanking(startRank, endRank) {

		const response = await StatisticsApi.getComprehensiveRanking(startRank, endRank);

		// 检查响应状态
		if (response.code !== 200) {
			ElMessage.error(response.message || '获取综合排名失败');
			return [];
		}

		// 处理数据：将 API 返回的数据转换为标准学生对象列表
		return (response.data || []).map(rankData => {
			const student = PersonalInformation.createStudentObject(rankData.studentInfoId);

			// 填充基本字段
			student.name = rankData.name;
			student.gender = rankData.gender;
			student.college = rankData.college;
			student.major = rankData.major;
			student.grade = rankData.grade;
			student.levelCode = rankData.levelCode;

			// 正确处理积分和得分
			student.attendanceCount = rankData.attendanceCount;
			student.attendancePoints = Math.round(rankData.attendanceCount * 0.64);  // 签到积分 = 签到次数 × 0.64
			student.activityPoints = rankData.totalPoints;  // 活动积分 = totalPoints（活动总积分）

			// 学生总积分 = 综合得分
			student.totalPoints = Math.round(rankData.comprehensiveScore);

			// 填充排名
			student.ranking = rankData.ranking;

			// 设置头像 URL
			student.avatarUrl = StudentApi.getAvatarUrl(rankData.studentInfoId, Config.AVATAR_SIZE);

			return student;

		});

	}

}

export default AllMembersPageUtils;
