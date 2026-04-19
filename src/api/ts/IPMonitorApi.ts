/**
 * IP监控API接口模块
 * 提供IP扫描数据统计、IP范围查询等API调用方法
 *
 * @module api/IPMonitorApi
 * @description 封装IP监控系统的API接口，包括IP出现次数统计、扫描次数查询、坊内IP列表获取、IP范围查询等功能
 */

import axios, { type AxiosInstance, type AxiosError } from 'axios'
import { ConfigServer } from '@/config/ts/Config'

/**
 * API响应类型
 * 定义IP监控系统API的统一响应结构
 */
export interface ApiResponse<T> {
	/** 业务状态码，200表示成功 */
	code: number
	/** 操作结果描述 */
	message: string
	/** 响应数据 */
	data: T
}

/**
 * IP出现次数统计响应数据类型
 */
export interface IPCountsData {
	/** 该时间范围内的扫描次数 */
	total_scans: number
	/** IP出现次数统计，键为IP地址，值为出现次数 */
	ip_counts: Record<string, number>
}

/**
 * 扫描次数响应数据类型
 */
export interface ScanCountData {
	/** 该时间范围内的扫描次数 */
	scan_count: number
}

/**
 * 坊内IP列表响应数据类型
 */
export interface FangIPsData {
	/** 坊内IP地址列表 */
	fang_ips: string[]
	/** 坊内IP数量 */
	count: number
}

/**
 * IP范围响应数据类型
 */
export interface IPRangeData {
	/** IP地址范围列表 */
	ip_range: string[]
	/** IP地址总数 */
	count: number
	/** 起始IP地址 */
	start_ip: string
	/** 结束IP地址 */
	end_ip: string
}

/**
 * IP监控API类
 * 提供IP监控系统相关的API调用方法
 *
 * @class IPMonitorApi
 * @description 使用独立的axios实例进行HTTP请求，基础URL为IP监控服务器地址
 */
class IPMonitorApi {
	/**
	 * axios实例
	 * 使用IP监控服务器基础URL创建的axios实例
	 *
	 * @static
	 * @private
	 */
	private static api: AxiosInstance = axios.create({
		baseURL: ConfigServer.IP_MONITOR_BASE_URL,
		timeout: 10000,
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		}
	})

	/**
	 * 获取IP出现次数统计
	 * 获取指定时间范围内每个IP出现的次数统计
	 *
	 * @static
	 * @param {number} startTime - 开始时间戳（Unix时间戳，秒）
	 * @param {number} endTime - 结束时间戳（Unix时间戳，秒）
	 * @returns {Promise<ApiResponse<IPCountsData>>} IP出现次数统计数据，包含总扫描次数和各IP出现次数
	 * @throws {Error} 请求参数错误或服务器错误时抛出错误
	 * @example
	 * // 获取所有时间段的IP统计
	 * const result = await IPMonitorApi.getIPCounts(0, 9999999999)
	 * console.log(result.data.total_scans) // 输出：15
	 * console.log(result.data.ip_counts) // 输出：{ "10.0.48.241": 15, "10.0.48.153": 12, ... }
	 */
	static async getIPCounts(startTime: number, endTime: number): Promise<ApiResponse<IPCountsData>> {
		const response = await this.api.get<ApiResponse<IPCountsData>>('/api/ip-counts', {
			params: {
				start_time: startTime,
				end_time: endTime
			}
		}).catch((error: AxiosError<{ message: string }>) => {
			if (error.response) {
				const { status } = error.response
				if (status === 400) {
					throw new Error(error.response.data?.message || '请求参数错误')
				} else if (status !== undefined && status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					throw new Error(error.response.data?.message || '获取IP统计失败')
				}
			} else {
				throw new Error('网络错误，获取IP统计失败')
			}
		})
		return response.data
	}

	/**
	 * 获取扫描次数
	 * 获取指定时间范围内的扫描次数
	 *
	 * @static
	 * @param {number} startTime - 开始时间戳（Unix时间戳，秒）
	 * @param {number} endTime - 结束时间戳（Unix时间戳，秒）
	 * @returns {Promise<ApiResponse<ScanCountData>>} 扫描次数数据
	 * @throws {Error} 请求参数错误或服务器错误时抛出错误
	 * @example
	 * // 获取所有时间段的扫描次数
	 * const result = await IPMonitorApi.getScanCount(0, 9999999999)
	 * console.log(result.data.scan_count) // 输出：15
	 */
	static async getScanCount(startTime: number, endTime: number): Promise<ApiResponse<ScanCountData>> {
		const response = await this.api.get<ApiResponse<ScanCountData>>('/api/scan-count', {
			params: {
				start_time: startTime,
				end_time: endTime
			}
		}).catch((error: AxiosError<{ message: string }>) => {
			if (error.response) {
				const { status } = error.response
				if (status === 400) {
					throw new Error(error.response.data?.message || '请求参数错误')
				} else if (status !== undefined && status >= 500) {
					throw new Error('服务器错误，请稍后重试')
				} else {
					throw new Error(error.response.data?.message || '获取扫描次数失败')
				}
			} else {
				throw new Error('网络错误，获取扫描次数失败')
			}
		})
		return response.data
	}

	/**
	 * 获取坊内IP列表
	 * 获取配置中定义的坊内IP地址列表
	 *
	 * @static
	 * @returns {Promise<ApiResponse<FangIPsData>>} 坊内IP列表数据
	 * @throws {Error} 服务器错误时抛出错误
	 * @example
	 * // 获取坊内所有IP地址
	 * const result = await IPMonitorApi.getFangIPs()
	 * console.log(result.data.fang_ips) // 输出：["10.0.48.153", "10.0.48.154", ...]
	 * console.log(result.data.count) // 输出：47
	 */
	static async getFangIPs(): Promise<ApiResponse<FangIPsData>> {
		const response = await this.api.get<ApiResponse<FangIPsData>>('/api/fang-ips')
			.catch((error: AxiosError<{ message: string }>) => {
				if (error.response) {
					const { status } = error.response
					if (status !== undefined && status >= 500) {
						throw new Error('服务器错误，请稍后重试')
					} else {
						throw new Error(error.response.data?.message || '获取坊内IP列表失败')
					}
				} else {
					throw new Error('网络错误，获取坊内IP列表失败')
				}
			})
		return response.data
	}

	/**
	 * 获取IP范围
	 * 获取配置中定义的扫描IP范围
	 *
	 * @static
	 * @returns {Promise<ApiResponse<IPRangeData>>} IP范围数据
	 * @throws {Error} 服务器错误时抛出错误
	 * @example
	 * // 获取扫描IP范围
	 * const result = await IPMonitorApi.getIPRange()
	 * console.log(result.data.start_ip) // 输出："10.0.48.151"
	 * console.log(result.data.end_ip) // 输出："10.0.48.250"
	 * console.log(result.data.count) // 输出：100
	 */
	static async getIPRange(): Promise<ApiResponse<IPRangeData>> {
		const response = await this.api.get<ApiResponse<IPRangeData>>('/api/ip-range')
			.catch((error: AxiosError<{ message: string }>) => {
				if (error.response) {
					const { status } = error.response
					if (status !== undefined && status >= 500) {
						throw new Error('服务器错误，请稍后重试')
					} else {
						throw new Error(error.response.data?.message || '获取IP范围失败')
					}
				} else {
					throw new Error('网络错误，获取IP范围失败')
				}
			})
		return response.data
	}
}

export default IPMonitorApi
