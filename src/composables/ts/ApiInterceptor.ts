/**
 * API拦截器模块
 * 提供统一的axios实例创建和响应拦截器配置
 *
 * @module composables/ApiInterceptor
 * @description 封装axios实例的创建和错误处理逻辑，统一管理HTTP请求拦截器
 */

import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios'

import ConfigServer from '@/config/ts/Config'

/**
 * API拦截器类
 * 提供静态方法用于创建和配置axios实例的响应拦截器
 *
 * @class ApiInterceptor
 * @description 统一处理axios实例的响应拦截器，提供标准的错误处理逻辑
 */
class ApiInterceptor {
	/**
	 * 创建带有统一响应拦截器的axios实例
	 * 创建一个新的axios实例并自动配置响应拦截器
	 *
	 * @static
	 * @returns {AxiosInstance} 配置好的axios实例
	 * @example
	 * const api = ApiInterceptor.createInstance()
	 * api.get('/api/v1/users')
	 */
	static createInstance(): AxiosInstance {
		// 创建axios实例，配置基础URL、超时时间和请求头
		const api: AxiosInstance = axios.create({
			baseURL: ConfigServer.API_BASE_URL, // API基础URL
			timeout: 10000, // 请求超时时间（10秒）
			headers: {
				'Content-Type': 'application/json' // 默认Content-Type为JSON
			}
		})

		// 为实例配置响应拦截器
		this.setup(api)
		return api
	}

	/**
	 * 为已存在的axios实例添加响应拦截器
	 * 配置统一的错误处理逻辑，捕获网络错误并提供友好的错误提示
	 *
	 * @static
	 * @param {AxiosInstance} api - axios实例
	 * @description 拦截响应错误，根据错误代码提供友好的中文错误提示
	 * @example
	 * const api = axios.create()
	 * ApiInterceptor.setup(api)
	 */
	static setup(api: AxiosInstance): void {
		// 配置响应拦截器
		api.interceptors.response.use(
			// 成功响应直接返回
			(response: AxiosResponse) => response,
			// 错误响应处理
			(error: AxiosError) => {
				// 处理请求超时错误（ECONNABORTED）
				if (error.code === 'ECONNABORTED') {
					throw new Error('请求超时，请检查网络连接')
				} else if (error.code === 'ERR_NETWORK') {
					// 处理网络连接失败错误
					throw new Error('网络连接失败，请检查服务器状态')
				} else if (error.code === 'ERR_INTERNET_DISCONNECTED') {
					// 处理网络断开错误
					throw new Error('网络连接已断开，请检查网络设置')
				}
				// 其他错误继续向下传递
				return Promise.reject(error)
			}
		)
	}
}

/**
 * 导出API拦截器类
 * @exports ApiInterceptor
 */
export default ApiInterceptor
