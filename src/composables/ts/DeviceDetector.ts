/**
 * 设备检测模块
 * 提供设备类型检测功能，用于判断当前设备是桌面端还是移动端
 *
 * @module composables/DeviceDetector
 * @description 通过User-Agent检测设备类型
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
 * @description 使用User-Agent判断设备类型
 */
class DeviceDetector {
	/**
	 * 检测设备类型
	 * 根据User-Agent判断当前设备类型
	 *
	 * @static
	 * @returns 设备类型枚举值（DESKTOP、MOBILE、TABLET）
	 * @example
	 * // 获取设备类型
	 * const deviceType = DeviceDetector.detect()
	 * if (deviceType === DeviceType.MOBILE) {
	 *   console.log('当前是移动设备')
	 * }
	 */
	static detect(): DeviceType {
		const userAgent = navigator.userAgent

		// 检测移动设备（仅通过User-Agent判断，不通过屏幕尺寸）
		const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet/i.test(userAgent)

		// 如果是移动设备，进一步判断是手机还是平板
		if (isMobile) {
			// iPad 明确判断为平板
			if (userAgent.includes('iPad')) {
				return DeviceType.TABLET
			}

			// Android 平板（不含 Mobile 关键词）
			if (userAgent.includes('Android') && !userAgent.includes('Mobile')) {
				return DeviceType.TABLET
			}

			// 其他情况归为手机
			return DeviceType.MOBILE
		}

		// 默认为桌面设备
		return DeviceType.DESKTOP
	}
}

export default DeviceDetector
