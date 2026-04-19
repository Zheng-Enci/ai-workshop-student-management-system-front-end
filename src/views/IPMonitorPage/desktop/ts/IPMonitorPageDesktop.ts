/**
 * IP监控页面桌面端数据管理模块
 * 提供数据初始化、加载和管理功能
 *
 * @module views/IPMonitorPage/desktop/ts/IPMonitorPageDesktop
 * @description 管理IP监控页面的所有数据，包括IP统计、扫描次数、坊内IP列表和IP范围
 */

import {reactive, ref} from 'vue'
import type {FangIPsData, IPCountsData, IPRangeData, ScanCountData} from '@/api/ts/IPMonitorApi'
import IPMonitorApi from '@/api/ts/IPMonitorApi'
import {useLoadingMaskStore} from '@/stores/ts/loading'

/**
 * IP监控页面数据接口
 * 定义页面所需的所有数据类型
 */
export interface IPMonitorPageData {
	/** IP出现次数统计数据 */
	ipCounts: IPCountsData | null
	/** 扫描次数数据 */
	scanCount: ScanCountData | null
	/** 坊内IP列表数据 */
	fangIPs: FangIPsData | null
	/** IP范围数据 */
	ipRange: IPRangeData | null
}

/**
 * IP监控页面桌面端数据管理类
 * 使用单例模式管理页面数据
 *
 * @class IPMonitorPageDesktop
 * @description 提供数据初始化和加载功能，使用LoadingMask显示加载状态
 */
class IPMonitorPageDesktop {
	/**
	 * 页面数据对象
	 * 使用reactive实现响应式数据绑定
	 *
	 * @private
	 */
	private data: IPMonitorPageData = reactive({
		ipCounts: null,
		scanCount: null,
		fangIPs: null,
		ipRange: null
	})

	/**
	 * 单例实例
	 *
	 * @private
	 * @static
	 */
	private static instance: IPMonitorPageDesktop | null = null

	/**
	 * 获取单例实例
	 * 确保全局只有一个数据管理实例
	 *
	 * @static
	 * @returns {IPMonitorPageDesktop} 单例实例
	 */
	public static getInstance(): IPMonitorPageDesktop {
		if (!IPMonitorPageDesktop.instance) {
			IPMonitorPageDesktop.instance = new IPMonitorPageDesktop()
		}
		return IPMonitorPageDesktop.instance
	}

	/**
	 * 初始化数据
	 * 调用所有IP监控API接口获取数据，并使用LoadingMask显示加载状态
	 *
	 * @public
	 * @async
	 * @returns {Promise<void>}
	 * @example
	 * const pageData = IPMonitorPageDesktop.getInstance()
	 * await pageData.init_data()
	 * console.log(pageData.getData().ipCounts)
	 */
	public async init_data(): Promise<void> {
		const loadingMaskStore = useLoadingMaskStore()

		try {
			// 显示加载蒙版
			loadingMaskStore.showLoadingMask('正在加载IP监控数据...')

			// 获取当前时间戳和过去30天的时间戳
			const endTime = Math.floor(Date.now() / 1000)
			const startTime = endTime - 30 * 24 * 60 * 60 // 30天前

			// 并行调用所有API接口
			const [ipCountsResult, scanCountResult, fangIPsResult, ipRangeResult] = await Promise.all([
				// 获取IP出现次数统计
				IPMonitorApi.getIPCounts(startTime, endTime).catch((err) => {
					console.error('获取IP统计失败:', err)
					return null
				}),
				// 获取扫描次数
				IPMonitorApi.getScanCount(startTime, endTime).catch((err) => {
					console.error('获取扫描次数失败:', err)
					return null
				}),
				// 获取坊内IP列表
				IPMonitorApi.getFangIPs().catch((err) => {
					console.error('获取坊内IP列表失败:', err)
					return null
				}),
				// 获取IP范围
				IPMonitorApi.getIPRange().catch((err) => {
					console.error('获取IP范围失败:', err)
					return null
				})
			])

			// 保存数据到内存
			if (ipCountsResult) {
				this.data.ipCounts = ipCountsResult.data
			}
			if (scanCountResult) {
				this.data.scanCount = scanCountResult.data
			}
			if (fangIPsResult) {
				this.data.fangIPs = fangIPsResult.data
			}
			if (ipRangeResult) {
				this.data.ipRange = ipRangeResult.data
			}

			console.log('IP监控数据加载完成:', this.data)
		} catch (err) {
			console.error('初始化IP监控数据失败:', err)
		} finally {
			// 隐藏加载蒙版
			loadingMaskStore.hideLoadingMask()
		}
	}

	/**
	 * 获取页面数据
	 * 返回当前保存的所有数据
	 *
	 * @public
	 * @returns {IPMonitorPageData} 页面数据对象
	 */
	public getData(): IPMonitorPageData {
		return this.data
	}

	/**
	 * 刷新数据
	 * 重新调用所有API接口获取最新数据
	 *
	 * @public
	 * @async
	 * @returns {Promise<void>}
	 */
	public async refreshData(): Promise<void> {
		await this.init_data()
	}

	/**
	 * 清空数据
	 * 清除内存中的所有数据
	 *
	 * @public
	 */
	public clearData(): void {
		this.data.ipCounts = null
		this.data.scanCount = null
		this.data.fangIPs = null
		this.data.ipRange = null
	}
}

export default IPMonitorPageDesktop
