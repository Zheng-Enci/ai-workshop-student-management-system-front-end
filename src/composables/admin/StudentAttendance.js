/**
 * 学生考勤管理模块
 * 提供学生考勤记录查看、考勤补卡和考勤统计功能
 */
import { ref, computed } from 'vue'

import {
	getTodayAttendanceRecords,
	getStudentAttendanceRecords,
	makeupAttendanceWithSpecialPassword
} from '@/api/attendance'
import { useAdminStore } from '@/stores/admin'

/**
 * 学生考勤管理Composable
 */
/**
 * 学生考勤管理Composable函数
 * 提供考勤记录查询、补卡操作、统计计算等功能
 * 
 * @returns {Object} 包含状态、计算属性和方法的对象
 */
export function useStudentAttendance() {
	/**
	 * 响应式状态定义
	 */
	// 今日考勤记录列表
	const todayAttendanceRecords = ref([])
	// 所有学生考勤记录列表
	const allStudentAttendanceRecords = ref([])
	// 加载状态标识
	const loading = ref(false)
	// 补卡表单数据
	const makeupForm = ref({
		studentInfoId: null, // 学生信息ID
		attendanceId: null, // 考勤记录ID
		specialPassword: '', // 特殊密码（管理员密码）
		date: '', // 补卡日期
		period: 'morning' // 时间段：morning/afternoon/evening/night
	})
	// 补卡对话框显示状态
	const makeupDialogVisible = ref(false)
	// 考勤记录对话框显示状态
	const attendanceRecordsDialogVisible = ref(false)

	/**
	 * 管理员状态管理
	 * 用于获取管理员权限和密码
	 */
	const _adminStore = useAdminStore()

	/**
	 * 获取今日考勤记录
	 * @returns 请求结果
	 */
	const fetchTodayAttendance = async () => {
		loading.value = true
		try {
			const response = await getTodayAttendanceRecords()
			if (response.code === 200 && response.data) {
				todayAttendanceRecords.value = response.data
				return { success: true }
			}
			return { success: false, message: response.message || '获取今日考勤记录失败' }
		} catch (error) {
			console.error('获取今日考勤记录失败:', error)
			return { success: false, message: '获取今日考勤记录失败，请检查网络连接' }
		} finally {
			loading.value = false
		}
	}

	/**
	 * 获取学生考勤记录
	 * 根据学生ID获取该学生的所有考勤记录
	 * 
	 * @param {string|number} studentId - 学生ID
	 * @param {Object} [_params={}] - 查询参数（预留，当前未使用）
	 * @returns {Promise<Object>} 请求结果对象，包含success和message字段
	 */
	const fetchStudentAttendance = async (studentId, _params = {}) => {
		loading.value = true
		try {
			const response = await getStudentAttendanceRecords(studentId)

			// 检查响应是否成功
			if (response.code === 200 && response.data) {
				allStudentAttendanceRecords.value = response.data
				return { success: true }
			}
			return { success: false, message: response.message || '获取学生考勤记录失败' }
		} catch (error) {
			console.error('获取学生考勤记录失败:', error)
			return { success: false, message: '获取学生考勤记录失败，请检查网络连接' }
		} finally {
			loading.value = false
		}
	}

	/**
	 * 显示今日考勤
	 * @returns 请求结果
	 */
	const showTodayAttendance = async () => await fetchTodayAttendance()

	/**
	 * 打开学生考勤记录对话框
	 * @param studentId 学生ID
	 * @returns 请求结果
	 */
	const openAttendanceRecordsDialog = async studentId => {
		const result = await fetchStudentAttendance(studentId)
		if (result.success) {
			attendanceRecordsDialogVisible.value = true
		}
		return result
	}

	/**
	 * 关闭考勤记录对话框
	 */
	const closeAttendanceRecordsDialog = () => {
		attendanceRecordsDialogVisible.value = false
		allStudentAttendanceRecords.value = []
	}

	/**
	 * 打开补卡对话框
	 * @param attendanceInfo 考勤信息
	 */
	const openMakeupDialog = attendanceInfo => {
		makeupForm.value = {
			studentInfoId: attendanceInfo.studentInfoId,
			attendanceId: attendanceInfo.id,
			specialPassword: '',
			date: attendanceInfo.date || '',
			period: attendanceInfo.period || 'morning'
		}
		makeupDialogVisible.value = true
	}

	/**
	 * 关闭补卡对话框
	 */
	const closeMakeupDialog = () => {
		makeupDialogVisible.value = false
		makeupForm.value = {
			studentInfoId: null,
			attendanceId: null,
			specialPassword: '',
			date: '',
			period: 'morning'
		}
	}

	/**
	 * 提交补卡申请
	 * 使用特殊密码为学生补录考勤记录
	 * 
	 * @returns {Promise<Object>} 请求结果对象，包含success和message字段
	 */
	const submitMakeup = async () => {
		// 验证表单：检查特殊密码是否已输入
		if (!makeupForm.value.specialPassword) {
			return { success: false, message: '请输入特殊密码' }
		}

		loading.value = true
		try {
			// 调用补卡API，传入特殊密码、学生ID和考勤时间
			const response = await makeupAttendanceWithSpecialPassword(
				makeupForm.value.specialPassword,
				makeupForm.value.studentInfoId,
				makeupForm.value.attendanceTime
			)

			// 补卡成功后的处理
			if (response.code === 200) {
				closeMakeupDialog()
				// 刷新考勤记录，确保数据最新
				if (makeupForm.value.studentInfoId) {
					await fetchStudentAttendance(makeupForm.value.studentInfoId)
				}
				return { success: true, message: '补卡成功' }
			}
			return { success: false, message: response.message || '补卡失败' }
		} catch (error) {
			console.error('补卡失败:', error)
			return { success: false, message: '补卡失败，请检查网络连接' }
		} finally {
			loading.value = false
		}
	}

	/**
	 * 格式化考勤时间
	 * @param time 时间字符串
	 * @returns 格式化后的时间
	 */
	const formatAttendanceTime = time => {
		if (!time) { return '' }

		const date = new Date(time)
		const hours = date.getHours().toString().padStart(2, '0')
		const minutes = date.getMinutes().toString().padStart(2, '0')

		return `${hours}:${minutes}`
	}

	/**
	 * 根据时间获取时间段样式类
	 * @param time 时间字符串
	 * @returns 样式类名
	 */
	const getTimePeriodClass = time => {
		if (!time) { return '' }

		const hour = new Date(time).getHours()

		if (hour >= 6 && hour < 12) {
			return 'morning'
		} if (hour >= 12 && hour < 18) {
			return 'afternoon'
		} if (hour >= 18 && hour < 22) {
			return 'evening'
		}
		return 'night'
	}

	/**
	 * 根据时间获取时间段名称
	 * @param time 时间字符串
	 * @returns 时间段名称
	 */
	const getTimePeriodName = time => {
		if (!time) { return '' }

		const hour = new Date(time).getHours()

		if (hour >= 6 && hour < 12) {
			return '上午'
		} if (hour >= 12 && hour < 18) {
			return '下午'
		} if (hour >= 18 && hour < 22) {
			return '晚上'
		}
		return '深夜'
	}

	/**
	 * 计算考勤统计
	 * 统计考勤记录中各种状态的数量
	 * 
	 * @param {Array} attendanceRecords - 考勤记录数组
	 * @returns {Object} 统计结果对象，包含present（出勤）、absent（缺勤）、late（迟到）、leave（请假）和total（总数）
	 */
	const getAttendanceStats = attendanceRecords => {
		// 初始化统计对象
		const stats = {
			present: 0, // 出勤次数
			absent: 0, // 缺勤次数
			late: 0, // 迟到次数
			leave: 0, // 请假次数
			total: attendanceRecords.length // 总记录数
		}

		// 遍历记录，统计各种状态的数量
		attendanceRecords.forEach(record => {
			switch (record.status) {
				case 'present':
					stats.present++
					break
				case 'absent':
					stats.absent++
					break
				case 'late':
					stats.late++
					break
				case 'leave':
					stats.leave++
					break
			}
		})

		return stats
	}

	/**
	 * 获取考勤状态文本
	 * @param status 状态代码
	 * @returns 状态文本
	 */
	const getAttendanceStatusText = status => {
		const statusMap = {
			present: '出勤',
			absent: '缺勤',
			late: '迟到',
			leave: '请假'
		}

		return statusMap[status] || '未知'
	}

	/**
	 * 获取考勤状态类型
	 * @param status 状态代码
	 * @returns 状态类型
	 */
	const getAttendanceStatusType = status => {
		const typeMap = {
			present: 'success',
			absent: 'danger',
			late: 'warning',
			leave: 'info'
		}

		return typeMap[status] || 'info'
	}

	/**
	 * 获取今日考勤统计
	 * @returns {object} 今日考勤统计
	 */
	const todayAttendanceStats = computed(() => getAttendanceStats(todayAttendanceRecords.value))

	/**
	 * 初始化模块
	 * @returns 初始化结果
	 */
	const init = async () => await fetchTodayAttendance()

	return {
		// 状态
		todayAttendanceRecords,
		allStudentAttendanceRecords,
		loading,
		makeupForm,
		makeupDialogVisible,
		attendanceRecordsDialogVisible,

		// 计算属性
		todayAttendanceStats,

		// 方法
		fetchTodayAttendance,
		fetchStudentAttendance,
		showTodayAttendance,
		openAttendanceRecordsDialog,
		closeAttendanceRecordsDialog,
		openMakeupDialog,
		closeMakeupDialog,
		submitMakeup,
		formatAttendanceTime,
		getTimePeriodClass,
		getTimePeriodName,
		getAttendanceStats,
		getAttendanceStatusText,
		getAttendanceStatusType,
		init
	}
}
