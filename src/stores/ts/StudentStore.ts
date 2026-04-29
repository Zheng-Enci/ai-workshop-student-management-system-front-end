/**
 * 学生状态管理Store - TypeScript版本
 * 使用Pinia管理学生登录状态、学生信息和token
 *
 * @module stores/student
 * @description 提供学生登录、登出，信息管理等功能
 * @author ZhengEnCi zheng_enci_work@foxmail.com
 * @remarks 区别于user.ts，本文件专门针对学生用户，包含学号(studentId)等学生特有字段
 * @important 本文件准备替代user.ts，为了保持项目稳定，user.ts暂时保留
 *            新代码应优先使用student.ts，逐步迁移旧代码
 */

import {defineStore} from 'pinia'
import {useRouter} from 'vue-router'
import StudentApi from '@/api/ts/StudentApi'

/**
 * 模块级token变量
 * 用于存储当前学生的认证token，避免重复从localStorage获取
 */
let currentToken: string | null = null

/**
 * 学生信息接口定义
 * @interface StudentInfo
 * @property {number} databaseId - 数据库自增ID
 * @property {string} studentId - 学号
 * @property {string} name - 姓名
 * @property {string} gender - 性别
 * @property {string} phone - 手机号
 * @property {string} college - 学院
 * @property {number} grade - 年级
 * @property {string} major - 专业
 * @property {string} className - 班级
 * @property {number} level - 等级
 * @property {string} [avatar] - 头像URL（可选）
 * @property {string} [nickname] - 昵称（可选）
 */
export interface StudentInfo {
	databaseId: number
	studentId: string
	name: string
	gender: string
	phone: string
	college: string
	grade: number
	major: string
	className: string
	level: number
	avatar?: string
	nickname?: string
}

/**
 * Student Store状态接口定义
 * @interface StudentState
 */
interface StudentState {
	/** 学生信息对象 */
	studentInfo: StudentInfo | null
	/** 学生认证token */
	token: string | null
}

/**
 * 学生Store定义
 * 管理学生登录状态、学生信息、token和学生等级
 */
export const useStudentStore = defineStore('student', {
	/**
	 * Store状态定义
	 *
	 * @returns {StudentState} Store状态对象
	 */
	state: (): StudentState => ({
		studentInfo: null,
		token: null
	}),

	/**
	 * Store计算属性
	 */
	getters: {
		/**
		 * 获取学生数据库ID
		 * @param {StudentState} state - Store状态
		 * @returns {number | null} 数据库ID或null
		 */
		studentDbId: (state: StudentState): number | null => {
			return state.studentInfo?.databaseId ?? null
		},

		/**
		 * 获取学号
		 * @param {StudentState} state - Store状态
		 * @returns {string | null} 学号或null
		 */
		studentId: (state: StudentState): string | null => {
			return state.studentInfo?.studentId ?? null
		},

		/**
		 * 获取学生姓名
		 * @param {StudentState} state - Store状态
		 * @returns {string | null} 姓名或null
		 */
		name: (state: StudentState): string | null => {
			return state.studentInfo?.name ?? null
		},

		/**
		 * 获取性别
		 * @param {StudentState} state - Store状态
		 * @returns {string | null} 性别或null
		 */
		gender: (state: StudentState): string | null => {
			return state.studentInfo?.gender ?? null
		},

		/**
		 * 获取手机号
		 * @param {StudentState} state - Store状态
		 * @returns {string | null} 手机号或null
		 */
		phone: (state: StudentState): string | null => {
			return state.studentInfo?.phone ?? null
		},

		/**
		 * 获取学院
		 * @param {StudentState} state - Store状态
		 * @returns {string | null} 学院或null
		 */
		college: (state: StudentState): string | null => {
			return state.studentInfo?.college ?? null
		},

		/**
		 * 获取年级
		 * @param {StudentState} state - Store状态
		 * @returns {number | null} 年级或null
		 */
		grade: (state: StudentState): number | null => {
			return state.studentInfo?.grade ?? null
		},

		/**
		 * 获取专业
		 * @param {StudentState} state - Store状态
		 * @returns {string | null} 专业或null
		 */
		major: (state: StudentState): string | null => {
			return state.studentInfo?.major ?? null
		},

		/**
		 * 获取班级
		 * @param {StudentState} state - Store状态
		 * @returns {string | null} 班级或null
		 */
		className: (state: StudentState): string | null => {
			return state.studentInfo?.className ?? null
		},

		/**
		 * 获取学生等级
		 * @param {StudentState} state - Store状态
		 * @returns {number | null} 等级或null
		 */
		level: (state: StudentState): number | null => {
			return state.studentInfo?.level ?? null
		},

		/**
		 * 检查是否已登录
		 * @param {StudentState} state - Store状态
		 * @returns {boolean} 是否已登录
		 */
		isAuthenticated: (state: StudentState): boolean => {
			return currentToken !== null && state.studentInfo !== null
		},

		/**
		 * 获取用户名（兼容旧代码）
		 * @param {StudentState} state - Store状态
		 * @returns {string | null} 用户名或null
		 */
		username: (state: StudentState): string | null => {
			return state.studentInfo?.name ?? null
		}
	},

	actions: {
		/**
		 * 设置学生信息和token
		 * 同时将信息保存到localStorage中
		 *
		 * @param {StudentInfo | null} info - 学生信息对象
		 * @param {string | null} token - 学生认证token
		 * @returns {void}
		 */
		setStudentInfo(info: StudentInfo | null, token: string | null): void {
			this.studentInfo = info
			this.token = token

			// 保存到模块级全局变量
			currentToken = token

			// 持久化保存token到本地存储
			if (token) {
				localStorage.setItem('token', token)
			} else {
				localStorage.removeItem('token')
			}

			// 持久化保存学生信息到本地存储
			if (info) {
				localStorage.setItem('studentInfo', JSON.stringify(info))
			} else {
				localStorage.removeItem('studentInfo')
			}
		},

		/**
		 * 学生登出
		 * 清除所有学生相关状态和本地存储数据
		 *
		 * @returns {void}
		 */
		logout(): void {
			this.studentInfo = null
			this.token = null

			// 清除模块级token变量
			currentToken = null

			// 清除本地存储中的学生数据
			localStorage.removeItem('token')
			localStorage.removeItem('studentInfo')
		},

		/**
		 * 从本地存储初始化学生状态
		 * 应用启动时调用，恢复学生登录状态
		 * 如果解析失败，清除所有本地存储数据
		 *
		 * @returns {void}
		 */
		initFromStorage(): void {
			const token = localStorage.getItem('token')
			const studentInfoStr = localStorage.getItem('studentInfo')

			// 如果存在token和学生信息，尝试恢复状态
			if (token && studentInfoStr) {
				try {
					const studentInfo: StudentInfo = JSON.parse(studentInfoStr)
					this.token = token
					this.studentInfo = studentInfo
					currentToken = token
				} catch (error) {
					// 解析失败，清除所有本地存储数据
					console.error('Failed to parse student data from storage:', error)
					this.logout()
				}
			}
		},

		/**
		 * 更新学生信息（部分更新）
		 * 只更新提供的字段，保留其他现有字段
		 *
		 * @param {Partial<StudentInfo>} updates - 要更新的学生信息字段
		 * @returns {void}
		 */
		updateStudentInfo(updates: Partial<StudentInfo>): void {
			if (this.studentInfo) {
				this.studentInfo = { ...this.studentInfo, ...updates }
				localStorage.setItem('studentInfo', JSON.stringify(this.studentInfo))
			}
		},

		/**
		 * 清除错误状态并重置
		 * 用于登录失败后的状态清理
		 *
		 * @returns {void}
		 */
		clearStudentState(): void {
			this.studentInfo = null
			this.token = null
			currentToken = null
		},

		/**
		 * 调用API获取数据并解析
		 * 通用的API调用方法，自动获取token并处理响应
		 *
		 * @async
		 * @template T - API响应数据类型
		 * @param {() => Promise<any>} apiFunc - API调用函数
		 * @returns {Promise<T>} API响应数据
		 * @throws {Error} 无token或API调用失败时抛出错误
		 */
		async fetchApiData<T>(apiFunc: () => Promise<any>): Promise<T> {
			if (!currentToken) {
				const router = useRouter()
				await router.push('/login')
				throw new Error('未登录，请先登录')
			}

			const response = await apiFunc()

			if (response.code === 200) {
				return response.data as T
			} else {
				throw new Error(response.message || '获取数据失败')
			}
		},

		/**
		 * 初始化学生状态
		 * 从localStorage获取token，如果token不存在则跳转到登录页面
		 * 如果token存在，则获取学生个人信息
		 *
		 * @async
		 * @returns {Promise<void>}
		 */
		async initStudentState(): Promise<void> {
			// 先从localStorage获取token并保存到模块级变量
			const token = localStorage.getItem('token')
			if (token) {
				currentToken = token
			}

			if (!currentToken) {
				const router = useRouter()
				await router.push('/login')
				return
			}

			try {
				const response = await StudentApi.getStudentProfile(currentToken)
				if (response.code === 200) {
					this.setStudentInfo(response.data, currentToken)
				} else {
					this.logout()
					const router = useRouter()
					await router.push('/login')
				}
			} catch (error) {
				this.logout()
				const router = useRouter()
				await router.push('/login')
			}
		}
	}
})

export default useStudentStore
