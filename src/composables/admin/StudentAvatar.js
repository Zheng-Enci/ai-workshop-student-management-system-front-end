/**
 * 学生头像管理模块
 * 提供学生头像加载和错误处理功能
 */
import { ref } from 'vue'

import { getAvatarUrl } from '@/api/student'

/**
 * 学生头像管理Composable
 */
export function useStudentAvatar() {
	// 响应式状态
	const loading = ref(false)
	const avatarCache = ref(new Map()) // 缓存头像URL

	/**
	 * 获取学生头像URL
	 * @param studentId 学生ID
	 * @returns 头像URL
	 */
	const getStudentAvatarUrl = studentId => {
		// 检查缓存
		if (avatarCache.value.has(studentId)) {
			return avatarCache.value.get(studentId)
		}

		// 默认头像
		const defaultAvatar = '/images/default-avatar.png'

		// 从API获取头像URL
		try {
			const avatarUrl = getAvatarUrl(studentId) || defaultAvatar
			avatarCache.value.set(studentId, avatarUrl)
			return avatarUrl
		} catch (error) {
			avatarCache.value.set(studentId, defaultAvatar)
			return defaultAvatar
		}
	}

	/**
	 * 批量加载学生头像
	 * @param students 学生列表
	 * @returns 加载结果
	 */
	const loadStudentAvatars = async students => {
		if (!students || !Array.isArray(students)) {
			return { success: false, message: '学生列表无效' }
		}

		loading.value = true
		const results = []

		try {
			for (const student of students) {
				if (student && student.studentInfoId) {
					const avatarUrl = getStudentAvatarUrl(student.studentInfoId)
					results.push({
						studentId: student.studentInfoId,
						avatarUrl,
						success: true
					})
				}
			}

			return { success: true, results }
		} catch (error) {
			return { success: false, message: '加载头像失败，请检查网络连接' }
		} finally {
			loading.value = false
		}
	}

	/**
	 * 处理头像加载错误
	 * @param event 加载错误事件
	 * @param studentId 学生ID
	 */
	const handleAvatarError = (event, studentId) => {
		// 设置默认头像
		const defaultAvatar = '/images/default-avatar.png'
		const imgElement = event.target
		imgElement.src = defaultAvatar

		// 更新缓存
		avatarCache.value.set(studentId, defaultAvatar)
	}

	/**
	 * 清除头像缓存
	 * @param studentId 学生ID，不提供则清除所有缓存
	 */
	const clearAvatarCache = studentId => {
		if (studentId !== undefined) {
			avatarCache.value.delete(studentId)
		} else {
			avatarCache.value.clear()
		}
	}

	/**
	 * 预加载学生头像
	 * @param students 学生列表
	 * @returns 预加载结果
	 */
	const preloadStudentAvatars = async students => {
		if (!students || !Array.isArray(students)) {
			return { success: false, message: '学生列表无效' }
		}

		loading.value = true
		const preloadPromises = []

		try {
			for (const student of students) {
				if (student && student.studentInfoId) {
					const avatarUrl = getStudentAvatarUrl(student.studentInfoId)
					const preloadPromise = new Promise((resolve, _reject) => {
						const img = new Image()
						img.onload = () => resolve({ studentId: student.studentInfoId, success: true })
						img.onerror = () => resolve({ studentId: student.studentInfoId, success: false })
						img.src = avatarUrl
					})
					preloadPromises.push(preloadPromise)
				}
			}

			const results = await Promise.all(preloadPromises)
			return { success: true, results }
		} catch (error) {
			return { success: false, message: '预加载头像失败' }
		} finally {
			loading.value = false
		}
	}

	/**
	 * 获取头像缓存大小
	 * @returns 缓存大小
	 */
	const getAvatarCacheSize = () => avatarCache.value.size

	/**
	 * 获取缓存状态
	 * @returns 缓存状态信息
	 */
	const getCacheStatus = () => ({
		size: avatarCache.value.size,
		loading: loading.value,
		cachedStudents: Array.from(avatarCache.value.keys())
	})

	/**
	 * 初始化模块
	 * @returns 初始化结果
	 */
	const init = async () => {
		// 清理旧缓存
		clearAvatarCache()
		return { success: true }
	}

	return {
		// 状态
		loading,
		avatarCache,

		// 方法
		getStudentAvatarUrl,
		loadStudentAvatars,
		handleAvatarError,
		clearAvatarCache,
		preloadStudentAvatars,
		getAvatarCacheSize,
		getCacheStatus,
		init
	}
}
