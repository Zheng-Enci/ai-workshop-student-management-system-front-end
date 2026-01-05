/**
 * 积分相关API接口
 * 提供积分调整、积分查询、积分排名等功能的API调用
 * 
 * @module api/points
 * @description 封装所有积分相关的HTTP请求，包括错误处理和响应拦截
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
	baseURL: config.API_BASE_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json'
	}
})

/**
 * 响应拦截器
 * 统一处理网络错误和超时错误
 */
api.interceptors.response.use(
	response => response,
	error => {
		// 处理请求超时错误
		if (error.code === 'ECONNABORTED') {
			throw new Error('请求超时，请检查网络连接')
		} else if (error.code === 'ERR_NETWORK') {
			// 处理网络连接失败错误
			throw new Error('网络连接失败，请检查服务器状态')
		} else if (error.code === 'ERR_INTERNET_DISCONNECTED') {
			// 处理网络断开错误
			throw new Error('网络连接已断开，请检查网络设置')
		}
		return Promise.reject(error)
	}
)

/**
 * 创建积分调整记录
 * 管理员使用特殊密码为学生调整积分
 * 
 * @param {string} specialPassword - 特殊密码（管理员密码）
 * @param {string} adjustReason - 调整原因说明
 * @param {number} changePoints - 积分变化量（正数为增加，负数为减少）
 * @param {string|number} targetStudentInfoId - 目标学生信息ID
 * @returns {Promise<Object>} - 积分记录创建结果数据
 * @throws {Error} - 创建失败时抛出错误
 */
export const createPointsRecord = async (specialPassword, adjustReason, changePoints, targetStudentInfoId) => {
	try {
		const response = await api.post('/api/v1/points', {
			adjustReason,
			changePoints,
			targetStudentInfoId
		}, {
			headers: {
				'X-Special-Password': specialPassword
			}
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			if (status === 400) {
				throw new Error(error.response.data?.message || '积分记录创建失败')
			} else if (status >= 500) {
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '积分记录创建失败')
			}
		} else {
			throw new Error('网络错误，积分记录创建失败')
		}
	}
}

/**
 * 获取积分总排名
 * 获取所有学生的活动积分排名
 * 
 * @param {number} [top=50] - 返回前N名，默认50
 * @returns {Promise<Object>} - 积分排名数据
 * @throws {Error} - 获取失败时抛出错误
 */
export const getPointsTopRanking = async (top = 50) => {
	try {
		const response = await api.get('/api/v1/points/top-ranking', {
			params: { top }
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			if (status === 400) {
				throw new Error(error.response.data?.message || '获取活动积分排名失败')
			} else if (status >= 500) {
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '获取活动积分排名失败')
			}
		} else {
			throw new Error('网络错误，获取活动积分排名失败')
		}
	}
}

/**
 * 获取学生前N条积分调整记录
 * 按积分变化量降序排列，获取指定学生的前N条积分调整记录
 * 
 * @param {string|number} studentInfoId - 学生信息ID
 * @param {number} [top=3] - 返回前N条记录，默认3
 * @returns {Promise<Object>} - 积分调整记录数据
 * @throws {Error} - 获取失败时抛出错误
 */
export const getTopAdjustRecordsByStudentInfoId = async (studentInfoId, top = 3) => {
	try {
		const response = await api.get('/api/v1/points/top-n-adjust-reason-and-points-and-create-time-records-by-student-info-id-order-by-adjust-points-desc', {
			params: {
				'target-student-info-id': studentInfoId,
				top
			}
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			if (status === 400) {
				throw new Error(error.response.data?.message || '获取积分记录失败')
			} else if (status >= 500) {
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '获取积分记录失败')
			}
		} else {
			throw new Error('网络错误，获取积分记录失败')
		}
	}
}

/**
 * 获取学生总积分
 * 获取指定学生的活动积分总和
 * 
 * @param {string|number} studentInfoId - 学生信息ID
 * @returns {Promise<Object>} - 学生总积分数据
 * @throws {Error} - 获取失败时抛出错误
 */
export const getTotalPointsByStudentInfoId = async studentInfoId => {
	try {
		const response = await api.get('/api/v1/points/total-points-by-student-info-id', {
			params: {
				'target-student-info-id': studentInfoId
			}
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			if (status === 400) {
				throw new Error(error.response.data?.message || '获取活动积分失败')
			} else if (status >= 500) {
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '获取活动积分失败')
			}
		} else {
			throw new Error('网络错误，获取活动积分失败')
		}
	}
}

/**
 * 获取学生所有积分调整记录
 * 获取指定学生的所有积分调整记录（包括调整原因、调整积分、创建时间）
 * 
 * @param {string|number} studentInfoId - 学生信息ID
 * @returns {Promise<Object>} - 所有积分调整记录数据
 * @throws {Error} - 获取失败时抛出错误
 */
export const getAllAdjustRecordsByStudentInfoId = async studentInfoId => {
	try {
		const response = await api.get('/api/v1/points/all-adjust-reason-and-adjust-point-and-create-time-records-by-student-info-id', {
			params: {
				'target-student-info-id': studentInfoId
			}
		})
		return response.data
	} catch (error) {
		if (error.response) {
			const { status } = error.response
			if (status === 400) {
				throw new Error(error.response.data?.message || '获取改分记录失败')
			} else if (status >= 500) {
				throw new Error('服务器错误，请稍后重试')
			} else {
				throw new Error(error.response.data?.message || '获取改分记录失败')
			}
		} else {
			throw new Error('网络错误，获取改分记录失败')
		}
	}
}

