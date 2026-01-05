/**
 * 服务器配置对象
 * 定义应用的基础配置信息，包括API地址、验证码服务地址等
 * 
 * @module config/Config
 * @description 应用全局配置，包含API基础URL、验证码URL、应用标题和版本号
 */

/**
 * 服务器配置
 * 
 * @type {Object}
 * @property {string} API_BASE_URL - API服务基础URL地址
 * @property {string} VERIFICATION_CODE_URL - 验证码服务URL地址
 * @property {string} APP_TITLE - 应用标题
 * @property {string} APP_VERSION - 应用版本号
 */
export const ConfigServer = {
	API_BASE_URL: 'https://10257qh6684dd.vicp.fun/zheng_en_ci',
	VERIFICATION_CODE_URL: 'http://10.0.48.168:7001/api/v1/attendance/verification-code',
	APP_TITLE: 'AI坊学生管理系统',
	APP_VERSION: '1.0.0'
}

export default ConfigServer

