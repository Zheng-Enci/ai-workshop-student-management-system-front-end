import {ElMessage} from "element-plus";
import StudentApi from "@/api/StudentApi";
import PointsDashboardPageConfig from "@/views/PointsDashboardPage/js/PointsDashboardPageConfig";
import StatisticsApi from "@/api/StatisticsApi";

/**
 * 积分仪表板页面工具类
 */
class PointsDashboardPageUtils {
	/**
	 * 创建学生对象
	 * @param {Number} studentInfoId - 学生信息 ID
	 * @returns {Object} 学生对象
	 */
	static createStudentObject(studentInfoId) {
		return {
			studentInfoId,
			name: null,
			gender: null,
			college: null,
			grade: null,
			major: null,
			levelCode: null,
			avatarUrl: null,
			totalPoints: 0,
			attendanceCount: 0,
			attendancePoints: 0,
			activityPoints: 0
		};
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
		if ('code' in response && response.code !== 200) {
			ElMessage.error(response.message || '获取综合排名失败');
			return [];
		}

		if (!('data' in response)) {
			return [];
		}

		// 处理数据：将 API 返回的数据转换为标准学生对象列表
		return (response.data || []).map(rankData => {
			const student = PointsDashboardPageUtils.createStudentObject(rankData.studentInfoId);

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
			student.avatarUrl = StudentApi.getAvatarUrl(rankData.studentInfoId, PointsDashboardPageConfig.AVATAR_SIZE);

			return student;

		});

	}
}

export default PointsDashboardPageUtils;
