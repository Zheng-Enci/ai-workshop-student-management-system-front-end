/* eslint-disable no-invalid-this */
import { ElMessage } from 'element-plus'

import PointsServer from './PointsServer'

/**
 * 改分记录弹窗管理类
 */
class AdjustRecordsDialogManager {
	// 弹窗是否可见
	visible = false

	// 当前学生
	currentStudent = null

	// 所有改分记录
	allRecords = []

	// 是否正在加载
	loading = false

	// 是否正在关闭（防止重复关闭）
	isClosing = false

	/**
	 * 打开改分记录弹窗
	 * @param student - 学生对象
	 */
	async open(student) {
		// 重置关闭状态
		this.isClosing = false

		// 设置当前学生
		this.currentStudent = student
		this.visible = true
		this.loading = true
		this.allRecords = []

		try {
			// 使用 PointsServer 获取所有改分记录
			this.allRecords = await PointsServer.getAllAdjustRecordsByStudentInfoId(student.studentInfoId)
		} catch (error) {
			ElMessage.error(`获取${student.name}的改分记录失败：${error.message}， 请重试或联系管理员`)
			this.allRecords = []
		} finally {
			this.loading = false
		}
	}

	/**
	 * 处理弹窗关闭事件（防闪烁）
	 */
	handleDialogClose = () => {
		// 防止重复关闭
		if (this.isClosing) { return }
		this.isClosing = true

		// 手动隐藏遮罩层，避免视觉闪烁
		const dialogWrapper = document.querySelector('.el-overlay')
		if (dialogWrapper) {
			dialogWrapper.style.display = 'none'
			dialogWrapper.style.visibility = 'hidden'
			dialogWrapper.style.opacity = '0'
		}

		// 延迟清空数据，确保弹窗完全关闭后再清空
		setTimeout(() => {
			this.allRecords = []
			this.loading = false
			this.currentStudent = null
			this.isClosing = false
		}, 0)
	}

	/**
	 * 获取弹窗标题
	 * @returns 弹窗标题
	 */
	getTitle() {
		return `${this.currentStudent?.name || '学生'}的改分记录`
	}

	/**
	 * 格式化时间
	 * @param time - 时间值（可以是时间戳或日期字符串）
	 * @returns 格式化后的时间字符串
	 */
	formatTime(time) {
		if (!time) { return '' }

		const date = new Date(time)

		// 检查日期是否有效
		if (isNaN(date.getTime())) {
			return time // 如果无法解析，返回原始值
		}

		// 格式化为：YYYY-MM-DD HH:mm
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')

		return `${year}-${month}-${day} ${hours}:${minutes}`
	}

	/**
	 * 获取积分对应的CSS类名
	 * @param points - 积分值
	 * @returns CSS类名
	 */
	getPointsClass(points) {
		if (points > 0) {
			return 'points-positive'
		} if (points < 0) {
			return 'points-negative'
		}
		return ''
	}
}

export default AdjustRecordsDialogManager
