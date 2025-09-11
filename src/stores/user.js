import {defineStore} from "pinia";

export const useUserStore = defineStore('user', {
    state: () => ({
        isLoggedIn: false,
        userInfo: null,
        token: null,
    }),
    actions: {
        setUserInfo(info, token) {
            this.userInfo = info;
            this.token = token;
            this.isLoggedIn = true;
            if (token) {
                localStorage.setItem('token', token);
            }
            if (info) {
                localStorage.setItem('userInfo', JSON.stringify(info));
            }
        },
        logout() {
            this.userInfo = null;
            this.token = null;
            this.isLoggedIn = false;
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
        },
        initFromStorage() {
            const token = localStorage.getItem('token');
            const userInfo = localStorage.getItem('userInfo');
            if (token && userInfo) {
                try {
                    this.token = token;
                    this.userInfo = JSON.parse(userInfo);
                    this.isLoggedIn = true;
                } catch (error) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userInfo');
                }
            }
        }
    }
})