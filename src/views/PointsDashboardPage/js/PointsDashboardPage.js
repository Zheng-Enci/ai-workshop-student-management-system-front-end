import {ElMessage} from "element-plus";
import PointsDashboardPageUtils from "./PointsDashboardPageUtils";
import StudentApi from "@/api/StudentApi";

/**
 * 积分仪表板页面管理类
 */
class PointsDashboardPage {
	// 综合排名数据
	comprehensiveRankingData = null;

	// 签到排行榜数据
	attendanceData = null;

	// 活动积分排行榜数据
	activityData = null;

	/**
	 * 自动获取学生的积分和综合排名数据（前 32 名）
	 */
	async initData() {
		try {
			this.comprehensiveRankingData = await PointsDashboardPageUtils.getComprehensiveRanking(1, 32);
		} catch (error) {
			ElMessage.error(error.message || '获取综合排名失败, 请检查网络连接或联系管理员');
		}
	}

	/**
	 * 刷新学生的积分和综合排名数据（前 32 名）
	 */
	async refreshData() {
		try {
			this.comprehensiveRankingData = await PointsDashboardPageUtils.getComprehensiveRanking(1, 32);
		} catch (error) {
			ElMessage.error(error.message || '获取综合排名失败, 请检查网络连接或联系管理员');
		}
	}

	/**
	 * 通用方法：根据studentInfoId获取学生姓名（解决异步问题）
	 * @param {Number} studentInfoId 学生ID
	 * @param {String} type 类型（attendance/activity），用于错误提示
	 * @returns {Promise<String>} 学生姓名
	 */
	async getStudentNameById(studentInfoId, type) {
		// 1. 先从本地综合排名数据找
		const matchedStudent = this.comprehensiveRankingData?.find(
			student => student.studentInfoId === studentInfoId
		);
		if (matchedStudent?.name) {
			return matchedStudent.name;
		}

		// 2. 本地没找到，调用API获取
		try {
			const response = await StudentApi.getStudentPublicFieldValueById(studentInfoId, 'name');
			if (response.code === 200) {
				return response.data || '未知';
			}
			ElMessage.error(`获取${type}排行榜学生姓名失败：${response.message || '接口返回异常'}`);
			return '未知';
		} catch (error) {
			ElMessage.error(`获取${type}排行榜学生姓名失败，请检查网络连接或联系管理员`);
			return '未知';
		}
	}

	/**
	 * 获取学生的签到排行榜数据，并补充学生姓名等信息
	 */
	async getAttendanceData() {
		try {
			let rawAttendanceData = await PointsDashboardPageUtils.getTopNStudentsByAttendanceCount(32);

			if (!this.comprehensiveRankingData || this.comprehensiveRankingData.length === 0) {
				ElMessage.warning('综合排名数据未加载，无法补充学生信息');
				this.attendanceData = rawAttendanceData;
				return;
			}

			// 用Promise.all处理异步，确保拿到姓名后再赋值
			this.attendanceData = await Promise.all(
				rawAttendanceData.map(async (item) => {
					const name = await this.getStudentNameById(item.studentInfoId, '签到');
					return {
						...item,
						name
					};
				})
			);
		} catch (error) {
			ElMessage.error(error.message || '获取签到排行榜失败, 请检查网络连接或联系管理员');
			this.attendanceData = [];
		}
	}

	/**
	 * 获取学生的活动积分排行榜数据，并补充学生姓名等信息
	 */
	async getActivityData() {
		try {
			let rawActivityData = await PointsDashboardPageUtils.getTopNStudentsByActivityPoints(32);

			if (!this.comprehensiveRankingData || this.comprehensiveRankingData.length === 0) {
				ElMessage.warning('综合排名数据未加载，无法补充学生信息');
				this.activityData = rawActivityData;
				return;
			}

			// 复用通用方法，逻辑完全统一
			this.activityData = await Promise.all(
				rawActivityData.map(async (item) => {
					const name = await this.getStudentNameById(item.studentInfoId, '活动积分');
					return {
						...item,
						name
					};
				})
			);
		} catch (error) {
			ElMessage.error(error.message || '获取活动积分排行榜失败, 请检查网络连接或联系管理员');
			this.activityData = [];
		}
	}
}

export default PointsDashboardPage;
