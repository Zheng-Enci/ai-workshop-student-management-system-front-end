import PointsApi from '@/api/PointsApi';
import {ElMessage} from 'element-plus';

/**
 * 积分服务类
 */
class PointsServer {
	/**
	 * 改分记录对象
	 */
	static AdjustRecord = class {
		/**
		 * @param {String} adjustReason - 改分理由
		 * @param {Number} adjustPoints - 改变的分数（正数加分，负数扣分）
		 * @param {String} createTime - 创建时间
		 */
		constructor(adjustReason, adjustPoints, createTime) {
			this.adjustReason = adjustReason;
			this.adjustPoints = adjustPoints;
			this.createTime = createTime;
		}

		/**
		 * 从服务器数据创建记录对象
		 * @param {Object} serverData - 服务器返回的数据
		 * @returns {PointsServer.AdjustRecord} 记录对象
		 */
		static fromServerData(serverData) {
			return new PointsServer.AdjustRecord(
				serverData.adjustReason,
				serverData.adjustPoints,
				serverData.createTime
			);
		}
	};

	/**
	 * 获取学生所有改分记录（按时间降序排列）
	 * @param {Number} studentInfoId - 学生数据库表主键ID
	 * @returns {Promise<Array<PointsServer.AdjustRecord>>} 改分记录对象列表，按时间降序排列
	 */
	static async getAllAdjustRecordsByStudentInfoId(studentInfoId) {

		// 使用 PointsApi 获取所有改分记录
		const response = await PointsApi.getAllAdjustRecordsByStudentInfoId(studentInfoId);

		// 检查响应状态
		if (response.code !== 200) {
			ElMessage.error(response.message || '获取改分记录失败');
			return [];
		}

		// 将服务器返回的数据转换为记录对象列表
		if (Array.isArray(response.data)) {
			const records = response.data.map(data => PointsServer.AdjustRecord.fromServerData(data));

			// 按时间降序排序（最新的在前）
			return records.sort((a, b) => {
				const timeA = new Date(a.createTime).getTime();
				const timeB = new Date(b.createTime).getTime();
				return timeB - timeA;
			});
		}

		return [];
	}
}

export default PointsServer;
