import axios from 'axios'

import ConfigServer from '@/config/Config'

/**
 * API 拦截器类 - 统一处理 axios 实例的响应拦截器
 */
class ApiInterceptor {
	/**
	 * 创建带有统一响应拦截器的 axios 实例
	 * @returns 配置好的 axios 实例
	 */
	static createInstance() {
		const api = axios.create({
			baseURL: ConfigServer.API_BASE_URL,
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json'
			}
		})

		this.setup(api)
		return api
	}

	/**
	 * 为已存在的 axios 实例添加响应拦截器
	 * @param api - axios 实例
	 */
	static setup(api) {
		api.interceptors.response.use(
			response => response,
			error => {
				if (error.code === 'ECONNABORTED') {
					throw new Error('请求超时，请检查网络连接')
				} else if (error.code === 'ERR_NETWORK') {
					throw new Error('网络连接失败，请检查服务器状态')
				} else if (error.code === 'ERR_INTERNET_DISCONNECTED') {
					throw new Error('网络连接已断开，请检查网络设置')
				}
				return Promise.reject(error)
			}
		)
	}
}

export default ApiInterceptor
