import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
	state: () => ({
		isLoggedIn: false,
		userInfo: null,
		token: null,
		studentLevel: null
	}),
	actions: {
		setUserInfo(info, token) {
			this.userInfo = info
			this.token = token
			if (token) {
				localStorage.setItem('token', token)
			}
			if (info) {
				localStorage.setItem('userInfo', JSON.stringify(info))
			}
		},
		setStudentLevel(level) {
			this.studentLevel = level
			if (level) {
				localStorage.setItem('studentLevel', JSON.stringify(level))
			}
		},
		logout() {
			this.userInfo = null
			this.token = null
			this.studentLevel = null
			localStorage.removeItem('token')
			localStorage.removeItem('userInfo')
			localStorage.removeItem('studentLevel')
		},
		initFromStorage() {
			const token = localStorage.getItem('token')
			const userInfo = localStorage.getItem('userInfo')
			const studentLevel = localStorage.getItem('studentLevel')
			if (token && userInfo) {
				try {
					this.token = token
					this.userInfo = JSON.parse(userInfo)
					if (studentLevel) {
						this.studentLevel = JSON.parse(studentLevel)
					}
				} catch (error) {
					localStorage.removeItem('token')
					localStorage.removeItem('userInfo')
					localStorage.removeItem('studentLevel')
				}
			}
		}
	}
})
