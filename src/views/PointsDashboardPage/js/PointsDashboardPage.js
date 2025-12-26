import {ElMessage} from "element-plus";
import PointsDashboardPageUtils from "./PointsDashboardPageUtils";

/**
 * 积分仪表板页面管理类
 */
class PointsDashboardPage {
	// 综合排名数据
	comprehensiveRankingData = null;

	/**
	 * 自动获取学生的积分和综合排名数据（前 32 名）
	 */
	async initData() {
		// 获取当前页面要显示的学生的个人信息数据, 默认显示前 32 个
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
		// 获取当前页面要显示的学生的个人信息数据, 默认显示前 32 个
		try {
			this.comprehensiveRankingData = await PointsDashboardPageUtils.getComprehensiveRanking(1, 32);
		} catch (error) {
			ElMessage.error(error.message || '获取综合排名失败, 请检查网络连接或联系管理员');
		}
	}
}

export default PointsDashboardPage;
