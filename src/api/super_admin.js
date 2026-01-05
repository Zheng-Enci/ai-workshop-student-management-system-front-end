/**
 * 超级管理员API模块
 * 提供超级管理员权限验证相关的API接口
 *
 * @module api/super_admin
 * @description 封装超级管理员相关的HTTP请求，主要用于特殊密码验证
 */

import axios from 'axios'

import config from '@/config'

/**
 * 创建axios实例
 * 配置基础URL、超时时间和请求头
 *
 * @type {AxiosInstance}
 */
const api = axios.create({
	baseURL: config.API_BASE_URL, // API基础URL
	timeout: 10000, // 请求超时时间（10秒）
	headers: {
		'Content-Type': 'application/json' // 默认Content-Type为JSON
	}
})

/**
 * 验证特殊密码接口
 * 验证用户输入的特殊密码（管理员密码）是否正确
 *
 * @param {string} specialPassword - 特殊密码（管理员密码）
 * @returns {Promise<Object>} 验证结果数据，包含验证是否通过的信息
 * @throws {Error} 网络错误时抛出异常
 * @example
 * const result = await validateSpecialPassword('admin123')
 * if (result.code === 200) {
 *   console.log('密码验证通过')
 * }
 */
export const validateSpecialPassword = async specialPassword => {
	try {
		// 调用超级管理员密码验证接口
		const response = await api.get('/api/v1/super-admin/validate-special-password', {
			params: { 'special-password': specialPassword }
		})
		// 返回响应数据
		return response.data
	} catch (error) {
		// 捕获并抛出网络错误
		throw new Error('网络错误')
	}
}
