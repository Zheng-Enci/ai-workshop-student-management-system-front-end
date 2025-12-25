import PointsServer from "./PointsServer";
import {ElMessage} from "element-plus";

/**
 * 改分记录弹窗管理类
 */
class AdjustRecordsDialogManager {
	// 弹窗是否可见
	visible = false;

	// 当前学生
	currentStudent = null;

	// 所有改分记录
	allRecords = [];

	// 是否正在加载
	loading = false;

	// 是否正在关闭（防止重复关闭）
	isClosing = false;

	/**
	 * 打开改分记录弹窗
	 * @param {Object} student - 学生对象
	 */
	async open(student) {
		// 重置关闭状态
		this.isClosing = false;

		// 设置当前学生
		this.currentStudent = student;
		this.visible = true;
		this.loading = true;
		this.allRecords = [];

		try {
			// 使用 PointsServer 获取所有改分记录
			this.allRecords = await PointsServer.getAllAdjustRecordsByStudentInfoId(student.studentInfoId);
		} catch (error) {
			ElMessage.error(`获取${student.name}的改分记录失败：${error.message}， 请重试或联系管理员`);
			this.allRecords = [];
		} finally {
			this.loading = false;
		}
	}

	/**
	 * 关闭改分记录弹窗
	 */
	close() {
		// 防止重复关闭
		if (this.isClosing) return;
		this.isClosing = true;

		// 先关闭弹窗，避免响应式更新
		this.visible = false;

		// 延迟清空数据，确保弹窗完全关闭后再清空
		setTimeout(() => {
			this.allRecords = [];
			this.loading = false;
			this.currentStudent = null;
			this.isClosing = false;
		}, 0);
	}

	/**
	 * 获取弹窗标题
	 * @returns {String} 弹窗标题
	 */
	getTitle() {
		return `${this.currentStudent?.name || '学生'}的改分记录`;
	}
}

export default AdjustRecordsDialogManager;
