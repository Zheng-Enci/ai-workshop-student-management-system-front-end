/**
 * 设备检测模块
 * 提供设备类型检测功能，用于判断当前设备是桌面端还是移动端
 *
 * @module composables/DeviceDetector
 * @description 通过User-Agent和屏幕尺寸检测设备类型，支持响应式布局切换
 */

/**
 * 设备类型枚举
 */
export enum DeviceType {
	/** 桌面设备 */
	DESKTOP = 'desktop',
	/** 移动设备 */
	MOBILE = 'mobile',
	/** 平板设备 */
	TABLET = 'tablet',
	/** 未知设备 */
	UNKNOWN = 'unknown'
}

/**
 * 设备检测结果接口
 */
export interface DeviceDetectionResult {
	/** 设备类型 */
	deviceType: DeviceType
	/** 是否为桌面设备 */
	isDesktop: boolean
	/** 是否为移动设备 */
	isMobile: boolean
	/** 是否为平板设备 */
	isTablet: boolean
	/** 屏幕宽度 */
	screenWidth: number
	/** 屏幕高度 */
	screenHeight: number
	/** User-Agent字符串 */
	userAgent: string
	/** 是否支持触摸 */
	touchSupport: boolean
}

/**
 * 设备检测器类
 * 提供静态方法用于检测设备类型和获取设备信息
 *
 * @class DeviceDetector
 * @description 使用User-Agent分析和屏幕尺寸判断设备类型
 */
class DeviceDetector {
	/**
	 * 移动端User-Agent关键词列表
	 * 用于检测移动设备的标识字符串
	 */
	private static readonly MOBILE_KEYWORDS: string[] = [
		'Android',
		'iPhone',
		'iPod',
		'iPad',
		'Windows Phone',
		'BlackBerry',
		'Opera Mini',
		'Mobile',
		'mobile'
	]

	/**
	 * 平板设备User-Agent关键词列表
	 * 用于检测平板设备的标识字符串
	 */
	private static readonly TABLET_KEYWORDS: string[] = [
		'iPad',
		'Tablet',
		'Android',
		'Kindle',
		'Silk'
	]

	/**
	 * 检测当前设备类型
	 * 根据User-Agent和屏幕尺寸判断设备类型
	 *
	 * @static
	 * @returns {DeviceType} 设备类型枚举值
	 * @example
	 * // 获取设备类型
	 * const deviceType = DeviceDetector.detectDeviceType()
	 * if (deviceType === DeviceType.MOBILE) {
	 *   console.log('当前是移动设备')
	 * }
	 */
	static detectDeviceType(): DeviceType {
		const userAgent = navigator.userAgent
		const screenWidth = window.innerWidth
		const screenHeight = window.innerHeight
		const minScreenSize = Math.min(screenWidth, screenHeight)

		// 检测平板设备
		if (this.isTablet(userAgent, screenWidth, screenHeight)) {
			return DeviceType.TABLET
		}

		// 检测移动设备
		if (this.isMobile(userAgent, minScreenSize)) {
			return DeviceType.MOBILE
		}

		// 默认为桌面设备
		return DeviceType.DESKTOP
	}

	/**
	 * 判断是否为移动设备
	 * 通过User-Agent和屏幕尺寸综合判断
	 *
	 * @private
	 * @static
	 * @param {string} userAgent - User-Agent字符串
	 * @param {number} minScreenSize - 屏幕最小边尺寸
	 * @returns {boolean} 是否为移动设备
	 */
	private static isMobile(userAgent: string, minScreenSize: number): boolean {
		// 检查User-Agent是否包含移动设备关键词
		const hasMobileKeyword = this.MOBILE_KEYWORDS.some(keyword =>
			userAgent.includes(keyword)
		)

		// 屏幕尺寸小于768px认为是移动设备
		const isSmallScreen = minScreenSize < 768

		return hasMobileKeyword || isSmallScreen
	}

	/**
	 * 判断是否为平板设备
	 * 通过User-Agent和屏幕尺寸综合判断
	 *
	 * @private
	 * @static
	 * @param {string} userAgent - User-Agent字符串
	 * @param {number} screenWidth - 屏幕宽度
	 * @param {number} screenHeight - 屏幕高度
	 * @returns {boolean} 是否为平板设备
	 */
	private static isTablet(userAgent: string, screenWidth: number, screenHeight: number): boolean {
		// 检查User-Agent是否包含平板设备关键词
		const hasTabletKeyword = this.TABLET_KEYWORDS.some(keyword => {
			if (keyword === 'Android') {
				// Android平板通常不包含Mobile关键词
				return userAgent.includes('Android') && !userAgent.includes('Mobile')
			}
			return userAgent.includes(keyword)
		})

		// 屏幕尺寸在768px到1366px之间，且宽高比接近4:3或16:10
		const minSize = Math.min(screenWidth, screenHeight)
		const maxSize = Math.max(screenWidth, screenHeight)
		const isTabletSize = minSize >= 768 && minSize <= 1366
		const aspectRatio = maxSize / minSize
		const isTabletAspectRatio = aspectRatio >= 1.3 && aspectRatio <= 1.8

		return hasTabletKeyword || (isTabletSize && isTabletAspectRatio)
	}

	/**
	 * 获取完整的设备检测结果
	 * 包含设备类型、屏幕信息、User-Agent等详细信息
	 *
	 * @static
	 * @returns {DeviceDetectionResult} 设备检测结果对象
	 * @example
	 * // 获取设备详细信息
	 * const deviceInfo = DeviceDetector.getDeviceInfo()
	 * console.log(deviceInfo.deviceType) // 'mobile'
	 * console.log(deviceInfo.screenWidth) // 375
	 * console.log(deviceInfo.touchSupport) // true
	 */
	static getDeviceInfo(): DeviceDetectionResult {
		const deviceType = this.detectDeviceType()
		const screenWidth = window.innerWidth
		const screenHeight = window.innerHeight
		const userAgent = navigator.userAgent
		const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0

		return {
			deviceType,
			isDesktop: deviceType === DeviceType.DESKTOP,
			isMobile: deviceType === DeviceType.MOBILE,
			isTablet: deviceType === DeviceType.TABLET,
			screenWidth,
			screenHeight,
			userAgent,
			touchSupport
		}
	}

	/**
	 * 快速检测是否为桌面设备
	 * 简化版的设备检测，只返回是否为桌面设备
	 *
	 * @static
	 * @returns {boolean} 是否为桌面设备
	 * @example
	 * // 快速判断是否为桌面设备
	 * if (DeviceDetector.isDesktopDevice()) {
	 *   // 加载桌面端组件
	 * }
	 */
	static isDesktopDevice(): boolean {
		return this.detectDeviceType() === DeviceType.DESKTOP
	}

	/**
	 * 快速检测是否为移动设备
	 * 简化版的设备检测，只返回是否为移动设备
	 *
	 * @static
	 * @returns {boolean} 是否为移动设备
	 * @example
	 * // 快速判断是否为移动设备
	 * if (DeviceDetector.isMobileDevice()) {
	 *   // 加载移动端组件
	 * }
	 */
	static isMobileDevice(): boolean {
		const deviceType = this.detectDeviceType()
		return deviceType === DeviceType.MOBILE || deviceType === DeviceType.TABLET
	}

	/**
	 * 监听设备类型变化
	 * 当屏幕尺寸变化导致设备类型改变时触发回调
	 *
	 * @static
	 * @param {(deviceType: DeviceType) => void} callback - 设备类型变化时的回调函数
	 * @returns {() => void} 取消监听的函数
	 * @example
	 * // 监听设备类型变化
	 * const unsubscribe = DeviceDetector.onDeviceTypeChange((deviceType) => {
	 *   console.log('设备类型变为:', deviceType)
	 *   // 根据新设备类型切换布局
	 * })
	 *
	 * // 取消监听
	 * unsubscribe()
	 */
	static onDeviceTypeChange(callback: (deviceType: DeviceType) => void): () => void {
		let lastDeviceType = this.detectDeviceType()

		const handleResize = () => {
			const currentDeviceType = this.detectDeviceType()
			if (currentDeviceType !== lastDeviceType) {
				lastDeviceType = currentDeviceType
				callback(currentDeviceType)
			}
		}

		window.addEventListener('resize', handleResize)

		// 返回取消监听的函数
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}
}

export default DeviceDetector
