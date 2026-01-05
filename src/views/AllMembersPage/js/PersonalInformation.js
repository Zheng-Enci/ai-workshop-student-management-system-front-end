/**
 * 个人信息管理模块
 * 提供获取和构建学生个人信息的工具类
 *
 * @module views/AllMembersPage/js/PersonalInformation
 * @description 封装学生个人信息的获取逻辑，包括基本信息、等级、积分、考勤等数据的聚合
 */

import { ElMessage } from 'element-plus'

import AttendanceApi from '@/api/AttendanceApi'
import PointsApi from '@/api/PointsApi'
import StudentApi from '@/api/StudentApi'

import Config from './Config'

/**
 * 个人信息管理类
 * 提供创建学生对象模板和获取完整学生信息的方法
 *
 * @class PersonalInformation
 * @description 通过并行请求多个API接口，聚合学生的完整个人信息
 */
class PersonalInformation {
	/**
	 * 创建学生对象模板
	 * 创建一个包含所有学生信息字段的初始对象结构
	 *
	 * @static
	 * @param {string|number} studentInfoId - 学生信息ID（数据库主键）
	 * @returns {Object} 学生对象模板，包含所有字段的初始值
	 * @property {string|number} studentInfoId - 学生信息ID
	 * @property {string|null} name - 学生姓名
	 * @property {string|null} gender - 性别
	 * @property {string|null} college - 学院
	 * @property {number|null} grade - 年级
	 * @property {string|null} major - 专业
	 * @property {number|null} levelCode - 等级代码（0-3）
	 * @property {string|null} avatarUrl - 头像URL
	 * @property {number} totalPoints - 总积分
	 * @property {number} attendanceCount - 考勤次数
	 * @property {number} attendancePoints - 考勤积分（考勤次数 * 0.64）
	 * @property {number} activityPoints - 活动积分
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
		}
	}

	/**
	 * 根据学生信息ID获取完整的学生个人信息
	 * 并行请求多个API接口，聚合学生的基本信息、等级、积分、考勤等数据
	 *
	 * @static
	 * @param {string|number} studentInfoId - 学生信息ID（数据库主键）
	 * @returns {Promise<Object>} 完整的学生信息对象
	 * @throws {Error} 当API请求失败时，会显示错误提示但不会抛出异常，返回部分数据
	 * @description 该方法会并行请求以下数据：
	 *   - 基本信息：姓名、性别、学院、年级、专业
	 *   - 等级信息：学生等级代码
	 *   - 积分信息：活动积分
	 *   - 考勤信息：考勤次数
	 *   然后计算考勤积分和总积分
	 */
	static async getStudentProfileByStudentInfoId(studentInfoId) {
		// 创建学生对象模板
		const student = PersonalInformation.createStudentObject(studentInfoId)

		/**
		 * 批量获取基本信息字段（并行请求）
		 * 同时请求多个字段值，提高加载效率
		 */
		const fieldNames = ['name', 'gender', 'college', 'grade', 'major']
		const fieldPromises = fieldNames.map(fieldName =>
			// 为每个字段创建Promise请求
			StudentApi.getStudentPublicFieldValueById(studentInfoId, fieldName)
				.then(response => {
					// 请求成功，返回字段名和值
					if (response.code === 200) {
						return { fieldName, value: response.data }
					}
					// 请求失败，显示错误提示
					if (response.message) {
						ElMessage.error(`获取学生个人信息失败：${response.message}`)
					} else {
						ElMessage.error('获取学生个人信息失败，请检查网络连接或联系管理员')
					}
					return null
				})
				.catch(() => {
					// 捕获异常，显示错误提示
					ElMessage.error(`获取学生${fieldName}失败，请检查网络连接或联系管理员`)
					return null
				})
		)

		/**
		 * 批量获取扩展信息（并行请求）
		 * 同时请求等级、活动积分、考勤次数
		 */
		const [levelPromise, pointsPromise, attendancePromise] = [
			/**
			 * 获取学生等级
			 * 返回等级代码（0-3）
			 */
			StudentApi.getStudentLevelByInfoId(studentInfoId)
				.then(response => {
					if (response.code === 200) { return response.data }
					// 显示错误提示
					if (response.message) { ElMessage.error(`获取学生等级失败：${response.message}`) } else { ElMessage.error('获取学生等级失败，请检查网络连接或联系管理员') }
					return null
				})
				.catch(() => {
					ElMessage.error('获取学生等级失败，请检查网络连接或联系管理员')
					return null
				}),

			/**
			 * 获取学生活动积分
			 * 返回活动总积分
			 */
			PointsApi.getTotalActivityPointsByStudentInfoId(studentInfoId)
				.then(response => {
					if (response.code === 200) { return response.data }
					// 显示错误提示
					if (response.message) { ElMessage.error(`获取学生活动积分失败：${response.message}`) } else { ElMessage.error('获取学生活动积分失败，请检查网络连接或联系管理员') }
					return null
				})
				.catch(() => {
					ElMessage.error('获取学生活动积分失败，请检查网络连接或联系管理员')
					return null
				}),

			/**
			 * 获取学生考勤次数
			 * 返回总签到次数
			 */
			AttendanceApi.getTotalAttendanceCountByStudentInfoId(studentInfoId)
				.then(response => {
					if (response.code === 200) { return response.data }
					// 显示错误提示
					if (response.message) { ElMessage.error(`获取学生签到次数失败：${response.message}`) } else { ElMessage.error('获取学生签到次数失败，请检查网络连接或联系管理员') }
					return null
				})
				.catch(() => {
					ElMessage.error('获取学生签到次数失败，请检查网络连接或联系管理员')
					return null
				})
		]

		/**
		 * 等待所有请求完成
		 * 并行执行所有Promise，等待结果返回
		 */
		const fieldResults = await Promise.all(fieldPromises)
		const [levelCode, activityPoints, attendanceCount] = await Promise.all([
			levelPromise,
			pointsPromise,
			attendancePromise
		])

		/**
		 * 填充基本信息字段
		 * 将API返回的字段值填充到学生对象中
		 */
		fieldResults.forEach(result => {
			if (result && result.fieldName) {
				student[result.fieldName] = result.value
			}
		})

		/**
		 * 填充扩展信息
		 * 设置头像URL、等级、活动积分、考勤次数等
		 */
		// 生成头像URL（使用配置的头像尺寸）
		student.avatarUrl = StudentApi.getAvatarUrl(studentInfoId, Config.AVATAR_SIZE)
		// 设置学生等级
		student.levelCode = levelCode
		// 设置活动积分（如果为null则默认为0）
		student.activityPoints = activityPoints || 0
		// 设置考勤次数（如果为null则默认为0）
		student.attendanceCount = attendanceCount || 0

		/**
		 * 计算积分
		 * 考勤积分 = 考勤次数 * 0.64（四舍五入）
		 * 总积分 = 活动积分 + 考勤积分
		 */
		student.attendancePoints = Math.round(student.attendanceCount * 0.64)
		student.totalPoints = student.activityPoints + student.attendancePoints

		// 返回完整的学生信息对象
		return student
	}
}

/**
 * 导出个人信息管理类
 * @exports PersonalInformation
 */
export default PersonalInformation

