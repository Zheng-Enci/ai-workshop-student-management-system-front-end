/**
 * 用户状态管理Store
 * 使用Pinia管理用户登录状态、用户信息和token
 *
 * @module stores/user
 * @description 提供用户登录、登出、信息管理等功能
 */

import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

/**
 * 用户信息接口
 * @interface UserInfo
 */
export interface UserInfo {
	[key: string]: any
}

/**
 * 学生等级信息接口
 * @interface StudentLevel
 */
export interface StudentLevel {
	[key: string]: any
}

/**
 * 用户Store状态接口
 * @interface UserState
 */
interface UserState {
	isLoggedIn: boolean
	userInfo: UserInfo | null
	token: string | null
	studentLevel: StudentLevel | null
}

/**
 * 用户Store定义
 * 管理用户登录状态、用户信息、token和学生等级
 */
export const useUserStore = defineStore('user', () => {
	/**
	 * 用户是否已登录
	 * @type {Ref<boolean>}
	 */
	const isLoggedIn: Ref<boolean> = ref(false)

	/**
	 * 用户信息对象
	 * @type {Ref<UserInfo | null>}
	 */
	const userInfo: Ref<UserInfo | null> = ref(null)

	/**
	 * 用户认证token
	 * @type {Ref<string | null>}
	 */
	const token: Ref<string | null> = ref(null)

	/**
	 * 学生等级信息
	 * @type {Ref<StudentLevel | null>}
	 */
	const studentLevel: Ref<StudentLevel | null> = ref(null)

	/**
	 * 设置用户信息和token
	 * 同时将信息保存到localStorage中
	 *
	 * @param {UserInfo} info - 用户信息对象
	 * @param {string} tokenValue - 用户认证token
	 */
	const setUserInfo = (info: UserInfo, tokenValue: string): void => {
		userInfo.value = info
		token.value = tokenValue
		isLoggedIn.value = true
		// 持久化保存token到本地存储
		if (tokenValue) {
			localStorage.setItem('token', tokenValue)
		}
		// 持久化保存用户信息到本地存储
		if (info) {
			localStorage.setItem('userInfo', JSON.stringify(info))
		}
	}

	/**
	 * 设置学生等级信息
	 * 将等级信息保存到localStorage中
	 *
	 * @param {StudentLevel} level - 学生等级信息对象
	 */
	const setStudentLevel = (level: StudentLevel): void => {
		studentLevel.value = level
		if (level) {
			localStorage.setItem('studentLevel', JSON.stringify(level))
		}
	}

	/**
	 * 用户登出
	 * 清除所有用户相关状态和本地存储数据
	 */
	const logout = (): void => {
		userInfo.value = null
		token.value = null
		studentLevel.value = null
		isLoggedIn.value = false
		// 清除本地存储中的用户数据
		localStorage.removeItem('token')
		localStorage.removeItem('userInfo')
		localStorage.removeItem('studentLevel')
	}

	/**
	 * 从本地存储初始化用户状态
	 * 应用启动时调用，恢复用户登录状态
	 * 如果解析失败，清除所有本地存储数据
	 */
	const initFromStorage = (): void => {
		const savedToken = localStorage.getItem('token')
		const savedUserInfo = localStorage.getItem('userInfo')
		const savedStudentLevel = localStorage.getItem('studentLevel')
		// 如果存在token和用户信息，尝试恢复状态
		if (savedToken && savedUserInfo) {
			try {
				token.value = savedToken
				userInfo.value = JSON.parse(savedUserInfo)
				isLoggedIn.value = true
				// 如果存在学生等级信息，也进行恢复
				if (savedStudentLevel) {
					studentLevel.value = JSON.parse(savedStudentLevel)
				}
			} catch (error) {
				// 解析失败，清除所有本地存储数据
				localStorage.removeItem('token')
				localStorage.removeItem('userInfo')
				localStorage.removeItem('studentLevel')
			}
		}
	}

	return {
		isLoggedIn,
		userInfo,
		token,
		studentLevel,
		setUserInfo,
		setStudentLevel,
		logout,
		initFromStorage
	}
})
