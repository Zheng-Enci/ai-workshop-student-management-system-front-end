/**
 * 学生积分管理模块
 * 提供学生积分查询、调整和变更记录功能
 */
import { ref, reactive } from 'vue'

import {
	getTotalPointsByStudentInfoId,
	createPointsRecord,
	getAllAdjustRecordsByStudentInfoId
} from '@/api/points'
import { useAdminStore } from '@/stores/admin'

/**
 * 学生积分管理Composable
 */
/**
 * 学生积分管理Composable函数
 * 提供积分查询、调整、变更记录查看等功能
 * 
 * @returns {Object} 包含状态、表单、验证规则和方法的对象
 */
export function useStudentPoints() {
	/**
	 * 响应式状态定义
	 */
	// 加载状态标识
	const loading = ref(false)
	// 学生积分数据对象，key为学生ID，value为积分值
	const studentPoints = ref({})
	// 积分调整对话框显示状态
	const pointsDialogVisible = ref(false)
	// 积分变更记录对话框显示状态
	const scoreChangeRecordsDialogVisible = ref(false)
	// 积分变更记录列表
	const scoreChangeRecords = ref([])
	// 当前操作的学生信息
	const currentStudent = ref(null)

	/**
	 * 积分调整表单数据
	 * 使用reactive创建响应式对象
	 */
	const pointsForm = reactive({
		studentInfoId: null, // 学生信息ID
		changeAmount: 0, // 积分变更数量
		reason: '', // 变更原因
		operation: 'add', // 操作类型：'add'（增加）或 'subtract'（扣除）
		specialPassword: '' // 特殊密码（管理员密码）
	})

	/**
	 * 积分表单验证规则
	 * 定义表单字段的验证规则，用于表单验证
	 */
	const pointsFormRules = {
		changeAmount: [
			{ required: true, message: '请输入积分变更数量', trigger: 'blur' },
			{ type: 'number', message: '积分变更数量必须为数字', trigger: 'blur' },
			{ min: 1, message: '积分变更数量必须大于0', trigger: 'blur' }
		],
		reason: [
			{ required: true, message: '请输入变更原因', trigger: 'blur' },
			{ min: 5, max: 200, message: '变更原因长度在5到200个字符', trigger: 'blur' }
		],
		specialPassword: [
			{ required: true, message: '请输入特殊密码', trigger: 'blur' }
		]
	}

	/**
	 * 管理员状态管理
	 * 用于获取管理员权限和密码
	 */
	const adminStore = useAdminStore()

	/**
	 * 加载学生积分数据
	 * @param studentId 学生ID
	 * @returns 加载结果
	 */
	const loadStudentPoints = async studentId => {
		if (!studentId) {
			return { success: false, message: '学生ID无效' }
		}

		loading.value = true
		try {
			const response = await getTotalPointsByStudentInfoId(studentId)

			if (response.code === 200 && response.data !== undefined) {
				studentPoints.value = {
					...studentPoints.value,
					[studentId]: response.data
				}
				return { success: true, points: response.data }
			}
			return { success: false, message: response.message || '获取学生积分失败' }
		} catch (error) {
			console.error('获取学生积分失败:', error)
			return { success: false, message: '获取学生积分失败，请检查网络连接' }
		} finally {
			loading.value = false
		}
	}

	/**
	 * 批量加载多个学生积分
	 * @param studentIds 学生ID列表
	 * @returns 加载结果
	 */
	const loadMultipleStudentPoints = async studentIds => {
		if (!studentIds || !Array.isArray(studentIds)) {
			return { success: false, message: '学生ID列表无效' }
		}

		loading.value = true
		const results = []

		try {
			for (const studentId of studentIds) {
				const result = await loadStudentPoints(studentId)
				results.push({
					studentId,
					points: result.success ? result.points : 0,
					success: result.success,
					message: result.message
				})
			}

			return { success: true, results }
		} catch (error) {
			console.error('批量获取学生积分失败:', error)
			return { success: false, message: '批量获取学生积分失败' }
		} finally {
			loading.value = false
		}
	}

	/**
	 * 获取学生积分
	 * @param studentId 学生ID
	 * @returns 积分数量
	 */
	const getStudentPoints = studentId => studentPoints.value[studentId] || 0

	/**
	 * 打开积分调整对话框
	 * @param student 学生信息
	 */
	const openPointsDialog = student => {
		if (!student) { return }

		// 设置当前学生
		currentStudent.value = student

		// 填充表单数据
		pointsForm.studentInfoId = student.studentInfoId
		pointsForm.changeAmount = 0
		pointsForm.reason = ''
		pointsForm.operation = 'add'
		pointsForm.specialPassword = ''

		// 显示对话框
		pointsDialogVisible.value = true
	}

	/**
	 * 关闭积分调整对话框
	 */
	const closePointsDialog = () => {
		pointsDialogVisible.value = false
		currentStudent.value = null
		resetPointsForm()
	}

	/**
	 * 确认积分调整
	 * 验证表单并提交积分变更请求
	 * 
	 * @param {Object} formRef - 表单引用对象，用于表单验证
	 * @returns {Promise<Object>} 操作结果对象，包含success、message和newPoints字段
	 */
	const confirmPoints = async formRef => {
		if (!formRef) {
			return { success: false, message: '表单引用无效' }
		}

		try {
			// 验证表单：检查所有字段是否符合验证规则
			await formRef.validate()

			loading.value = true

			// 计算变更后的积分
			const currentPoints = getStudentPoints(pointsForm.studentInfoId)
			// 根据操作类型计算变更量：增加为正数，扣除为负数
			const changeAmount = pointsForm.operation === 'add'
				? pointsForm.changeAmount
				: -pointsForm.changeAmount
			const newPoints = currentPoints + changeAmount

			// 检查积分是否会变为负数：不允许积分为负
			if (newPoints < 0) {
				return { success: false, message: '积分不能为负数，请调整变更数量' }
			}

			// 提交积分变更：调用API创建积分调整记录
			const response = await createPointsRecord(
				pointsForm.specialPassword,
				pointsForm.reason,
				changeAmount,
				pointsForm.studentInfoId
			)

			// 处理成功响应
			if (response.code === 200) {
				// 更新本地积分状态：同步更新本地缓存
				studentPoints.value = {
					...studentPoints.value,
					[pointsForm.studentInfoId]: newPoints
				}

				// 关闭对话框
				closePointsDialog()

				return {
					success: true,
					message: `积分调整成功，${pointsForm.operation === 'add' ? '增加' : '扣除'} ${Math.abs(changeAmount)} 积分`,
					newPoints
				}
			}
			return { success: false, message: response.message || '积分调整失败' }
		} catch (error) {
			console.error('积分调整失败:', error)

			if (error && error.message) {
				// 表单验证错误：验证规则不通过
				return { success: false, message: '表单验证失败，请检查输入信息' }
			}
			// API调用错误：网络或服务器错误
			return { success: false, message: '积分调整失败，请检查网络连接' }
		} finally {
			loading.value = false
		}
	}

	/**
	 * 取消积分调整
	 * @param formRef 表单引用
	 */
	const cancelPoints = formRef => {
		if (formRef) {
			formRef.resetFields()
		}
		closePointsDialog()
	}

	/**
	 * 打开积分变更记录对话框
	 * @param student 学生信息
	 * @returns 操作结果
	 */
	const openScoreChangeRecordsDialog = async student => {
		if (!student) {
			return { success: false, message: '学生信息无效' }
		}

		loading.value = true
		try {
			// 获取积分变更记录
			const response = await getAllAdjustRecordsByStudentInfoId(student.studentInfoId)

			if (response.code === 200 && response.data) {
				scoreChangeRecords.value = response.data
				currentStudent.value = student
				scoreChangeRecordsDialogVisible.value = true
				return { success: true }
			}
			return { success: false, message: response.message || '获取积分变更记录失败' }
		} catch (error) {
			console.error('获取积分变更记录失败:', error)
			return { success: false, message: '获取积分变更记录失败，请检查网络连接' }
		} finally {
			loading.value = false
		}
	}

	/**
	 * 关闭积分变更记录对话框
	 */
	const closeScoreChangeRecordsDialog = () => {
		scoreChangeRecordsDialogVisible.value = false
		scoreChangeRecords.value = []
		currentStudent.value = null
	}

	/**
	 * 重置积分表单
	 */
	const resetPointsForm = () => {
		Object.keys(pointsForm).forEach(key => {
			if (key === 'studentInfoId') {
				pointsForm[key] = null
			} else if (key === 'changeAmount') {
				pointsForm[key] = 0
			} else if (key === 'operation') {
				pointsForm[key] = 'add'
			} else {
				pointsForm[key] = ''
			}
		})
	}

	/**
	 * 格式化积分变更记录
	 * @param records 积分变更记录
	 * @returns 格式化后的记录
	 */
	const formatScoreChangeRecords = records => {
		if (!records || !Array.isArray(records)) {
			return []
		}

		return records.map(record => ({
			...record,
			displayAmount: record.points > 0 ? `+${record.points}` : record.points.toString(),
			displayType: record.points > 0 ? '增加' : '扣除',
			displayTime: formatTime(record.createTime)
		}))
	}

	/**
	 * 格式化时间
	 * @param time 时间字符串
	 * @returns 格式化后的时间
	 */
	const formatTime = time => {
		if (!time) { return '' }

		const date = new Date(time)
		const year = date.getFullYear()
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const day = date.getDate().toString().padStart(2, '0')
		const hours = date.getHours().toString().padStart(2, '0')
		const minutes = date.getMinutes().toString().padStart(2, '0')

		return `${year}-${month}-${day} ${hours}:${minutes}`
	}

	/**
	 * 获取积分排名
	 * @returns 学生积分排名列表
	 */
	const getStudentPointsRanking = () => {
		const studentsWithPoints = adminStore.students.map(student => ({
			...student,
			points: getStudentPoints(student.studentInfoId)
		}))

		// 按积分降序排序
		return studentsWithPoints.sort((a, b) => b.points - a.points)
	}

	/**
	 * 初始化模块
	 * @returns 初始化结果
	 */
	const init = async () => {
		resetPointsForm()
		return { success: true }
	}

	return {
		// 状态
		loading,
		studentPoints,
		pointsDialogVisible,
		scoreChangeRecordsDialogVisible,
		scoreChangeRecords,
		currentStudent,
		pointsForm,
		pointsFormRules,

		// 方法
		loadStudentPoints,
		loadMultipleStudentPoints,
		getStudentPoints,
		openPointsDialog,
		closePointsDialog,
		confirmPoints,
		cancelPoints,
		openScoreChangeRecordsDialog,
		closeScoreChangeRecordsDialog,
		resetPointsForm,
		formatScoreChangeRecords,
		formatTime,
		getStudentPointsRanking,
		init
	}
}
