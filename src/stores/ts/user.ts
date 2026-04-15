/**
 * 用户状态管理Store - TypeScript版本
 * 使用Pinia管理用户登录状态、用户信息和token
 *
 * @module stores/user
 * @description 提供用户登录、登出、信息管理等功能
 */

import { defineStore } from 'pinia'

/**
 * 用户信息接口定义
 * @interface UserInfo
 * @property {number} id - 用户ID
 * @property {string} username - 用户名
 * @property {string} email - 用户邮箱
 * @property {string} [avatar] - 用户头像URL（可选）
 * @property {string} [nickname] - 用户昵称（可选）
 */
export interface UserInfo {
	id: number
	username: string
	email: string
	avatar?: string
	nickname?: string
}

/**
 * 学生等级信息接口定义
 * @interface StudentLevel
 * @property {number} level - 等级数值
 * @property {string} name - 等级名称
 * @property {number} points - 当前积分
 * @property {number} nextLevelPoints - 下一等级所需积分
 */
export interface StudentLevel {
	level: number
	name: string
	points: number
	nextLevelPoints: number
}

/**
 * User Store状态接口定义
 * @interface UserState
 */
interface UserState {
	/** 用户是否已登录 */
	isLoggedIn: boolean
	/** 用户信息对象 */
	userInfo: UserInfo | null
	/** 用户认证token */
	token: string | null
	/** 学生等级信息 */
	studentLevel: StudentLevel | null
}

/**
 * 用户Store定义
 * 管理用户登录状态、用户信息、token和学生等级
 */
export const useUserStore = defineStore('user', {
	/**
	 * Store状态定义
	 *
	 * @returns {UserState} Store状态对象
	 */
	state: (): UserState => ({
		isLoggedIn: false,
		userInfo: null,
		token: null,
		studentLevel: null
	}),

	/**
	 * Store计算属性
	 */
	getters: {
		/**
		 * 获取用户ID
		 * @param {UserState} state - Store状态
		 * @returns {number | null} 用户ID或null
		 */
		userId: (state: UserState): number | null => {
			return state.userInfo?.id ?? null
		},

		/**
		 * 获取用户名
		 * @param {UserState} state - Store状态
		 * @returns {string | null} 用户名或null
		 */
		username: (state: UserState): string | null => {
			return state.userInfo?.username ?? null
		},

		/**
		 * 检查是否已登录
		 * @param {UserState} state - Store状态
		 * @returns {boolean} 是否已登录
		 */
		isAuthenticated: (state: UserState): boolean => {
			return state.isLoggedIn && state.token !== null
		}
	},

	actions: {
		/**
		 * 设置用户信息和token
		 * 同时将信息保存到localStorage中
		 *
		 * @param {UserInfo | null} info - 用户信息对象
		 * @param {string | null} token - 用户认证token
		 * @returns {void}
		 */
		setUserInfo(info: UserInfo | null, token: string | null): void {
			this.userInfo = info
			this.token = token
			this.isLoggedIn = info !== null && token !== null

			// 持久化保存token到本地存储
			if (token) {
				localStorage.setItem('token', token)
			} else {
				localStorage.removeItem('token')
			}

			// 持久化保存用户信息到本地存储
			if (info) {
				localStorage.setItem('userInfo', JSON.stringify(info))
			} else {
				localStorage.removeItem('userInfo')
			}
		},

		/**
		 * 设置学生等级信息
		 * 将等级信息保存到localStorage中
		 *
		 * @param {StudentLevel | null} level - 学生等级信息对象
		 * @returns {void}
		 */
		setStudentLevel(level: StudentLevel | null): void {
			this.studentLevel = level

			if (level) {
				localStorage.setItem('studentLevel', JSON.stringify(level))
			} else {
				localStorage.removeItem('studentLevel')
			}
		},

		/**
		 * 用户登出
		 * 清除所有用户相关状态和本地存储数据
		 *
		 * @returns {void}
		 */
		logout(): void {
			this.userInfo = null
			this.token = null
			this.studentLevel = null
			this.isLoggedIn = false

			// 清除本地存储中的用户数据
			localStorage.removeItem('token')
			localStorage.removeItem('userInfo')
			localStorage.removeItem('studentLevel')
		},

		/**
		 * 从本地存储初始化用户状态
		 * 应用启动时调用，恢复用户登录状态
		 * 如果解析失败，清除所有本地存储数据
		 *
		 * @returns {void}
		 */
		initFromStorage(): void {
			const token = localStorage.getItem('token')
			const userInfoStr = localStorage.getItem('userInfo')
			const studentLevelStr = localStorage.getItem('studentLevel')

			// 如果存在token和用户信息，尝试恢复状态
			if (token && userInfoStr) {
				try {
					const userInfo: UserInfo = JSON.parse(userInfoStr)
					this.token = token
					this.userInfo = userInfo
					this.isLoggedIn = true

					// 如果存在学生等级信息，也进行恢复
					if (studentLevelStr) {
						const studentLevel: StudentLevel = JSON.parse(studentLevelStr)
						this.studentLevel = studentLevel
					}
				} catch (error) {
					// 解析失败，清除所有本地存储数据
					console.error('Failed to parse user data from storage:', error)
					this.logout()
				}
			}
		},

		/**
		 * 更新用户信息（部分更新）
		 * 只更新提供的字段，保留其他现有字段
		 *
		 * @param {Partial<UserInfo>} updates - 要更新的用户信息字段
		 * @returns {void}
		 */
		updateUserInfo(updates: Partial<UserInfo>): void {
			if (this.userInfo) {
				this.userInfo = { ...this.userInfo, ...updates }
				localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
			}
		},

		/**
		 * 清除错误状态并重置
		 * 用于登录失败后的状态清理
		 *
		 * @returns {void}
		 */
		clearUserState(): void {
			this.userInfo = null
			this.token = null
			this.studentLevel = null
			this.isLoggedIn = false
		}
	}
})

export default useUserStore
