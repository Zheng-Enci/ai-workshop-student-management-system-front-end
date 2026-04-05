import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', {
	state: () => ({
		isAdminAuthenticated: false,
		adminPassword: null,
		adminSessionStartTime: null
	}),

	actions: {
		setAdminPassword(password) {
			this.adminPassword = password
			this.isAdminAuthenticated = true
			this.adminSessionStartTime = Date.now()
		},

		clearAdminPassword() {
			this.adminPassword = null
			this.isAdminAuthenticated = false
			this.adminSessionStartTime = null
		},

		isSessionValid() {
			if (!this.adminSessionStartTime) { return false }
			const sessionDuration = Date.now() - this.adminSessionStartTime
			const maxSessionTime = 30 * 60 * 1000 // 30分钟
			return sessionDuration < maxSessionTime
		},

		getAdminPassword() {
			if (!this.isAdminAuthenticated || !this.isSessionValid()) {
				this.clearAdminPassword()
				return null
			}
			return this.adminPassword
		}
	}
})
