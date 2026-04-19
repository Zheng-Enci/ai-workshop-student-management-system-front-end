/**
 * 设备检测模块
 * 提供设备类型检测功能，用于判断当前设备是桌面端还是移动端
 *
 * @module composables/DeviceDetector
 * @description 通过User-Agent和屏幕尺寸检测设备类型
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
	TABLET = 'tablet'
}

/**
 * 设备检测器类
 * 提供静态方法用于检测设备类型
 *
 * @class DeviceDetector
 * @description 使用User-Agent和屏幕尺寸判断设备类型
 */
class DeviceDetector {
	/**
	 * 检测设备类型
	 * 根据User-Agent和屏幕尺寸判断当前设备类型
	 *
	 * @static
	 * @returns {DeviceType} 设备类型枚举值（DESKTOP、MOBILE、TABLET）
	 * @example
	 * // 获取设备类型
	 * const deviceType = DeviceDetector.detect()
	 * if (deviceType === DeviceType.MOBILE) {
	 *   console.log('当前是移动设备')
	 * }
	 */
	static detect(): DeviceType {
		const userAgent = navigator.userAgent
		const screenWidth = window.innerWidth
		const screenHeight = window.innerHeight
		const minSize = Math.min(screenWidth, screenHeight)

		// 检测平板设备
		if (
			userAgent.includes('iPad') ||
			(userAgent.includes('Android') && !userAgent.includes('Mobile')) ||
			(minSize >= 768 && minSize <= 1366)
		) {
			return DeviceType.TABLET
		}

		// 检测移动设备
		if (
			userAgent.includes('Android') ||
			userAgent.includes('iPhone') ||
			userAgent.includes('iPod') ||
			userAgent.includes('Windows Phone') ||
			minSize < 768
		) {
			return DeviceType.MOBILE
		}

		// 默认为桌面设备
		return DeviceType.DESKTOP
	}
}

export default DeviceDetector
