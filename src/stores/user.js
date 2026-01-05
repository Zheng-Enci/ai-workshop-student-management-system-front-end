/**
 * 用户状态管理Store
 * 使用Pinia管理用户登录状态、用户信息和token
 *
 * @module stores/user
 * @description 提供用户登录、登出、信息管理等功能
 */

import { defineStore } from 'pinia'

/**
 * 用户Store定义
 * 管理用户登录状态、用户信息、token和学生等级
 */
export const useUserStore = defineStore('user', {
	/**
	 * Store状态定义
	 *
	 * @type {object}
	 * @property {boolean} isLoggedIn - 用户是否已登录
	 * @property {object | null} userInfo - 用户信息对象
	 * @property {string|null} token - 用户认证token
	 * @property {object | null} studentLevel - 学生等级信息
	 */
	state: () => ({
		isLoggedIn: false,
		userInfo: null,
		token: null,
		studentLevel: null
	}),
	actions: {
		/**
		 * 设置用户信息和token
		 * 同时将信息保存到localStorage中
		 *
		 * @param info - 用户信息对象
		 * @param token - 用户认证token
		 */
		setUserInfo(info, token) {
			this.userInfo = info
			this.token = token
			// 持久化保存token到本地存储
			if (token) {
				localStorage.setItem('token', token)
			}
			// 持久化保存用户信息到本地存储
			if (info) {
				localStorage.setItem('userInfo', JSON.stringify(info))
			}
		},
		/**
		 * 设置学生等级信息
		 * 将等级信息保存到localStorage中
		 *
		 * @param level - 学生等级信息对象
		 */
		setStudentLevel(level) {
			this.studentLevel = level
			if (level) {
				localStorage.setItem('studentLevel', JSON.stringify(level))
			}
		},
		/**
		 * 用户登出
		 * 清除所有用户相关状态和本地存储数据
		 */
		logout() {
			this.userInfo = null
			this.token = null
			this.studentLevel = null
			// 清除本地存储中的用户数据
			localStorage.removeItem('token')
			localStorage.removeItem('userInfo')
			localStorage.removeItem('studentLevel')
		},
		/**
		 * 从本地存储初始化用户状态
		 * 应用启动时调用，恢复用户登录状态
		 * 如果解析失败，清除所有本地存储数据
		 */
		initFromStorage() {
			const token = localStorage.getItem('token')
			const userInfo = localStorage.getItem('userInfo')
			const studentLevel = localStorage.getItem('studentLevel')
			// 如果存在token和用户信息，尝试恢复状态
			if (token && userInfo) {
				try {
					this.token = token
					this.userInfo = JSON.parse(userInfo)
					// 如果存在学生等级信息，也进行恢复
					if (studentLevel) {
						this.studentLevel = JSON.parse(studentLevel)
					}
				} catch (error) {
					// 解析失败，清除所有本地存储数据
					localStorage.removeItem('token')
					localStorage.removeItem('userInfo')
					localStorage.removeItem('studentLevel')
				}
			}
		}
	}
})
