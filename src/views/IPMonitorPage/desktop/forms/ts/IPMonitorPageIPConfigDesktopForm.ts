/**
 * IP监控页面-IP配置表单TS逻辑(桌面端)
 *
 * @description IP配置表单的业务逻辑类
 * @class IPMonitorPageIPConfigDesktopForm
 */
export class IPMonitorPageIPConfigDesktopForm {
	/**
	 * 表单数据
	 * @type {Object}
	 */
	private formData: {
		ip: string
		state: string
		note: string
	}

	/**
	 * 构造函数
	 * @constructor
	 */
	constructor() {
		this.formData = {
			ip: '',
			state: 'available',
			note: ''
		}
	}

	/**
	 * 获取表单数据
	 * @returns {Object} 表单数据对象
	 */
	public getFormData(): { ip: string; state: string; note: string } {
		return { ...this.formData }
	}

	/**
	 * 设置表单数据
	 * @param {Object} data - 要设置的数据对象
	 */
	public setFormData(data: { ip: string; state: string; note: string }): void {
		this.formData = { ...data }
	}

	/**
	 * 重置表单数据
	 */
	public resetFormData(): void {
		this.formData = {
			ip: '',
			state: 'available',
			note: ''
		}
	}

	/**
	 * 验证表单数据
	 * @returns {boolean} 验证是否通过
	 */
	public validate(): boolean {
		if (!this.formData.ip) {
			return false
		}
		return true
	}
}
