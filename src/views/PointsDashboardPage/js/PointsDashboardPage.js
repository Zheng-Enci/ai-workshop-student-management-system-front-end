/**
 * 积分仪表板页面管理模块
 * 提供积分看板页面的数据管理和业务逻辑
 *
 * @module views/PointsDashboardPage/js/PointsDashboardPage
 * @description 管理综合排名、签到排行、活动积分排行等数据的获取和处理
 */

import { ElMessage } from 'element-plus'

import StudentApi from '@/api/StudentApi'

import PointsDashboardPageUtils from './PointsDashboardPageUtils'

/**
 * 积分仪表板页面管理类
 * 负责管理积分看板页面的所有数据和业务逻辑
 */
class PointsDashboardPage {
	/**
	 * 综合排名数据
	 * 存储学生的综合排名信息（包含积分和签到次数）
	 *
	 * @type {Array|null}
	 */
	comprehensiveRankingData = null

	/**
	 * 签到排行榜数据
	 * 存储按签到次数排序的学生排行榜数据
	 *
	 * @type {Array|null}
	 */
	attendanceData = null

	/**
	 * 活动积分排行榜数据
	 * 存储按活动积分排序的学生排行榜数据
	 *
	 * @type {Array|null}
	 */
	activityData = null

	/**
	 * 初始化数据
	 * 自动获取学生的积分和综合排名数据（前32名）
	 * 在页面加载时调用，用于初始化页面数据
	 *
	 * @returns {Promise<void>}
	 */
	async initData() {
		try {
			// 获取综合排名数据，参数1表示排名类型，32表示获取前32名
			this.comprehensiveRankingData = await PointsDashboardPageUtils.getComprehensiveRanking(1, 32)
		} catch (error) {
			// 显示错误提示信息
			ElMessage.error(error.message || '获取综合排名失败, 请检查网络连接或联系管理员')
		}
	}

	/**
	 * 刷新数据
	 * 重新获取学生的积分和综合排名数据（前32名）
	 * 用于手动刷新页面数据
	 *
	 * @returns {Promise<void>}
	 */
	async refreshData() {
		try {
			// 重新获取综合排名数据
			this.comprehensiveRankingData = await PointsDashboardPageUtils.getComprehensiveRanking(1, 32)
		} catch (error) {
			// 显示错误提示信息
			ElMessage.error(error.message || '获取综合排名失败, 请检查网络连接或联系管理员')
		}
	}

	/**
	 * 根据学生ID获取学生姓名（通用方法）
	 * 解决异步数据获取问题，优先从本地缓存查找，未找到则调用API
	 *
	 * @param {string|number} studentInfoId - 学生信息ID
	 * @param {string} type - 类型标识（attendance/activity），用于错误提示
	 * @returns {Promise<string>} 学生姓名，如果获取失败返回'未知'
	 */
	async getStudentNameById(studentInfoId, type) {
		// 第一步：先从本地综合排名数据中查找（避免不必要的API调用）
		const matchedStudent = this.comprehensiveRankingData?.find(
			student => student.studentInfoId === studentInfoId
		)
		// 如果本地找到，直接返回姓名
		if (matchedStudent?.name) {
			return matchedStudent.name
		}

		// 第二步：本地没找到，调用API获取学生姓名
		try {
			const response = await StudentApi.getStudentPublicFieldValueById(studentInfoId, 'name')
			// 检查响应是否成功
			if (response.code === 200) {
				return response.data || '未知'
			}
			// API返回错误，显示错误提示
			ElMessage.error(`获取${type}排行榜学生姓名失败：${response.message || '接口返回异常'}`)
			return '未知'
		} catch (error) {
			// 网络错误或其他异常，显示错误提示
			ElMessage.error(`获取${type}排行榜学生姓名失败，请检查网络连接或联系管理员`)
			return '未知'
		}
	}

	/**
	 * 获取签到排行榜数据
	 * 获取学生的签到排行榜数据，并补充学生姓名等信息
	 * 如果综合排名数据未加载，则只返回原始数据
	 *
	 * @returns {Promise<void>}
	 */
	async getAttendanceData() {
		try {
			// 获取原始签到排行榜数据（前32名）
			const rawAttendanceData = await PointsDashboardPageUtils.getTopNStudentsByAttendanceCount(32)

			// 检查综合排名数据是否已加载
			if (!this.comprehensiveRankingData || this.comprehensiveRankingData.length === 0) {
				ElMessage.warning('综合排名数据未加载，无法补充学生信息')
				// 如果未加载，直接使用原始数据
				this.attendanceData = rawAttendanceData
				return
			}

			// 使用Promise.all并行处理，为每个学生补充姓名信息
			// 确保所有异步操作完成后再赋值
			this.attendanceData = await Promise.all(
				rawAttendanceData.map(async item => {
					// 为每个学生获取姓名
					const name = await this.getStudentNameById(item.studentInfoId, '签到')
					return {
						...item,
						name
					}
				})
			)
		} catch (error) {
			// 获取失败时显示错误提示，并设置空数组
			ElMessage.error(error.message || '获取签到排行榜失败, 请检查网络连接或联系管理员')
			this.attendanceData = []
		}
	}

	/**
	 * 获取活动积分排行榜数据
	 * 获取学生的活动积分排行榜数据，并补充学生姓名等信息
	 * 如果综合排名数据未加载，则只返回原始数据
	 *
	 * @returns {Promise<void>}
	 */
	async getActivityData() {
		try {
			// 获取原始活动积分排行榜数据（前32名）
			const rawActivityData = await PointsDashboardPageUtils.getTopNStudentsByActivityPoints(32)

			// 检查综合排名数据是否已加载
			if (!this.comprehensiveRankingData || this.comprehensiveRankingData.length === 0) {
				ElMessage.warning('综合排名数据未加载，无法补充学生信息')
				// 如果未加载，直接使用原始数据
				this.activityData = rawActivityData
				return
			}

			// 复用通用方法，逻辑与签到排行榜完全统一
			// 使用Promise.all并行处理，为每个学生补充姓名信息
			this.activityData = await Promise.all(
				rawActivityData.map(async item => {
					// 为每个学生获取姓名
					const name = await this.getStudentNameById(item.studentInfoId, '活动积分')
					return {
						...item,
						name
					}
				})
			)
		} catch (error) {
			// 获取失败时显示错误提示，并设置空数组
			ElMessage.error(error.message || '获取活动积分排行榜失败, 请检查网络连接或联系管理员')
			this.activityData = []
		}
	}
}

export default PointsDashboardPage
