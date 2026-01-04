import { ElMessage } from 'element-plus'


import AttendanceApi from '@/api/AttendanceApi'
import PointsApi from '@/api/PointsApi'

import AllMembersPageUtils from './AllMembersPageUtils'

/**
 * 全员页面管理类
 */
class AllMembersPage {
	// 签到排名数据
	attendanceRankingData = null

	// 积分排名数据
	pointsRankingData = null

	// 排序后的学生ID数据
	sortedStudentInfoIds = null

	// 当前页面要显示的学生的个人信息数据
	currentPageToShowStudentProfiles = null

	/**
	 * 自动获取所有学生的签到和积分数据，并排序
	 */
	async initData() {
		const attendanceRes = await AttendanceApi.getTopNStudentsByAttendanceCount(2147483647)
		if (attendanceRes.code === 200) {
			this.attendanceRankingData = attendanceRes.data
		} else {
			ElMessage.error(attendanceRes.message || '获取签到排名失败, 请检查网络连接或联系管理员')
		}

		const pointsRes = await PointsApi.getTopStudentsByTotalActivityPoints(2147483647)
		if (pointsRes.code === 200) {
			this.pointsRankingData = pointsRes.data
		} else {
			ElMessage.error(pointsRes.message || '获取积分排名失败, 请检查网络连接或联系管理员')
		}

		// 获取排序后的学生ID
		this.sortedStudentInfoIds = AllMembersPageUtils.sortStudentIdsByAttendanceAndPoints(
			this.attendanceRankingData, this.pointsRankingData
		)
		// 获取当前页面要显示的学生的个人信息数据, 默认显示前 30 个
		this.currentPageToShowStudentProfiles = await AllMembersPageUtils.getComprehensiveRanking(1, 1000)
	}
}

export default AllMembersPage
