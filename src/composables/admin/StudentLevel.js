/**
 * 学生等级管理模块
 * 提供学生等级查询、修改和相关工具函数
 */
import { ref } from 'vue'

import { setStudentLevel, getStudentLevel as _getStudentLevel } from '@/api/student'
import { useAdminStore } from '@/stores/admin'

/**
 * 学生等级管理Composable
 */
export function useStudentLevel() {
	// 响应式状态
	const studentLevels = ref([])
	const levelOptions = ref([])
	const adminOptions = ref([])
	const loading = ref(false)

	// 管理员状态
	const adminStore = useAdminStore()

	/**
	 * 根据学生ID获取学生身份信息
	 * @param studentId 学生ID
	 * @returns 学生身份信息
	 */
	const getStudentIdentityByStudentId = studentId => {
		const student = adminStore.students.find(s => s.studentInfoId === studentId)
		if (!student) { return { identity: 0, text: '未知' } }

		const identity = student.identity || 0
		return {
			identity,
			text: getStudentLevelText(identity),
			isAdmin: identity >= 1,
			levelName: getStudentLevelName(identity)
		}
	}

	/**
	 * 根据身份获取学生等级文本
	 * @param identity 身份标识
	 * @returns 等级文本
	 */
	const getStudentLevelText = identity => {
		const levelMap = {
			0: '普通学生',
			1: '课代表',
			2: '班长',
			3: '班主任'
		}
		return levelMap[identity] || '普通学生'
	}

	/**
	 * 根据身份获取等级名称
	 * @param identity 身份标识
	 * @returns 等级名称
	 */
	const getStudentLevelName = identity => {
		const nameMap = {
			0: 'Student',
			1: 'Representative',
			2: 'Monitor',
			3: 'Teacher'
		}
		return nameMap[identity] || 'Student'
	}

	/**
	 * 获取所有等级选项
	 * @returns 等级选项数组
	 */
	const getLevelOptions = () => [
		{ value: 0, label: '普通学生' },
		{ value: 1, label: '课代表' },
		{ value: 2, label: '班长' },
		{ value: 3, label: '班主任' }
	]

	/**
	 * 获取所有管理员选项
	 * @returns 管理员选项数组
	 */
	const getAdminOptions = () => adminStore.students
		.filter(student => student.identity >= 1)
		.map(student => ({
			value: student.studentInfoId,
			label: student.name
		}))

	/**
	 * 更改学生等级
	 * @param studentId 学生ID
	 * @param newLevel 新等级
	 * @param specialPassword 特殊密码
	 * @returns 请求结果
	 */
	const changeLevel = async (studentId, newLevel, specialPassword) => {
		loading.value = true
		try {
			const response = await setStudentLevel(studentId, newLevel, specialPassword)

			if (response.code === 200) {
				// 更新本地状态
				const student = adminStore.students.find(s => s.studentInfoId === studentId)
				if (student) {
					student.identity = newLevel
				}

				// 刷新选项
				await loadStudentLevels()
				return { success: true, message: '等级更新成功' }
			}
			return { success: false, message: response.message || '等级更新失败' }
		} catch (error) {
			console.error('更改学生等级失败:', error)
			return { success: false, message: '等级更新失败，请检查网络连接' }
		} finally {
			loading.value = false
		}
	}

	/**
	 * 加载学生等级数据
	 * 从 adminStore 中已经加载的学生数据中提取等级信息
	 * @returns 加载结果
	 */
	const loadStudentLevels = async () => {
		loading.value = true
		try {
			// 从 adminStore 中获取学生数据
			const students = adminStore.students || []

			// 提取学生等级信息
			const levelsData = {}
			students.forEach(student => {
				if (student.studentInfoId) {
					levelsData[student.studentInfoId] = student.identity || 0
				}
			})

			studentLevels.value = levelsData

			// 更新选项
			levelOptions.value = getLevelOptions()
			adminOptions.value = getAdminOptions()

			return { success: true }
		} catch (error) {
			console.error('加载学生等级失败:', error)
			return { success: false, message: '加载学生等级失败，请检查数据' }
		} finally {
			loading.value = false
		}
	}

	/**
	 * 获取指定等级的学生列表
	 * @param level 等级
	 * @returns 学生列表
	 */
	const getLevelStudents = level => adminStore.students.filter(student => student.identity === level)

	/**
	 * 获取学生数量统计
	 * @returns 各等级学生数量
	 */
	const getStudentLevelStats = () => {
		const stats = {
			0: 0, // 普通学生
			1: 0, // 课代表
			2: 0, // 班长
			3: 0 // 班主任
		}

		adminStore.students.forEach(student => {
			if (stats[student.identity] !== undefined) {
				stats[student.identity]++
			}
		})

		return {
			normal: stats[0],
			representative: stats[1],
			monitor: stats[2],
			teacher: stats[3],
			total: adminStore.students.length
		}
	}

	/**
	 * 初始化模块
	 * @returns 初始化结果
	 */
	const init = async () => await loadStudentLevels()

	return {
		// 状态
		studentLevels,
		levelOptions,
		adminOptions,
		loading,

		// 方法
		getStudentIdentityByStudentId,
		getStudentLevelText,
		getStudentLevelName,
		getLevelOptions,
		getAdminOptions,
		changeLevel,
		loadStudentLevels,
		getLevelStudents,
		getStudentLevelStats,
		init
	}
}
