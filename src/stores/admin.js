/**
 * 管理员状态管理Store
 * 使用Pinia管理管理员认证状态和会话信息
 * 
 * @module stores/admin
 * @description 提供管理员密码管理、会话验证等功能
 */

import { defineStore } from 'pinia'

/**
 * 管理员Store定义
 * 管理管理员认证状态、密码和会话时间
 */
export const useAdminStore = defineStore('admin', {
	/**
	 * Store状态定义
	 * 
	 * @type {Object}
	 * @property {boolean} isAdminAuthenticated - 管理员是否已认证
	 * @property {string|null} adminPassword - 管理员密码
	 * @property {number|null} adminSessionStartTime - 管理员会话开始时间戳
	 */
	state: () => ({
		isAdminAuthenticated: false,
		adminPassword: null,
		adminSessionStartTime: null
	}),

	actions: {
		/**
		 * 设置管理员密码并开始会话
		 * 
		 * @param {string} password - 管理员密码
		 */
		setAdminPassword(password) {
			this.adminPassword = password
			this.isAdminAuthenticated = true
			// 记录会话开始时间，用于会话过期检查
			this.adminSessionStartTime = Date.now()
		},

		/**
		 * 清除管理员密码和会话信息
		 * 用于登出或会话过期时调用
		 */
		clearAdminPassword() {
			this.adminPassword = null
			this.isAdminAuthenticated = false
			this.adminSessionStartTime = null
		},

		/**
		 * 检查管理员会话是否有效
		 * 会话有效期为30分钟
		 * 
		 * @returns {boolean} - 会话是否有效
		 */
		isSessionValid() {
			// 如果没有会话开始时间，会话无效
			if (!this.adminSessionStartTime) { return false }
			const sessionDuration = Date.now() - this.adminSessionStartTime
			const maxSessionTime = 30 * 60 * 1000 // 30分钟
			// 检查会话是否在有效期内
			return sessionDuration < maxSessionTime
		},

		/**
		 * 获取管理员密码
		 * 如果未认证或会话已过期，返回null并清除状态
		 * 
		 * @returns {string|null} - 管理员密码，如果无效则返回null
		 */
		getAdminPassword() {
			// 如果未认证或会话已过期，清除状态并返回null
			if (!this.isAdminAuthenticated || !this.isSessionValid()) {
				this.clearAdminPassword()
				return null
			}
			return this.adminPassword
		}
	}
})
