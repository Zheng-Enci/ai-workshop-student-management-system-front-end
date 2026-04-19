/**
 * 服务器配置对象
 * 定义应用的基础配置信息，包括API地址、验证码服务地址等
 *
 * @module config/Config
 * @description 应用全局配置，包含API基础URL、验证码URL、应用标题和版本号
 */

/**
 * 服务器配置接口
 */
interface ConfigServerType {
	API_BASE_URL: string
	VERIFICATION_CODE_URL: string
	IP_MONITOR_BASE_URL: string
	APP_TITLE: string
	APP_VERSION: string
	STUDENT_LEVEL_NAMES: {
		[key: number]: string
	}
	STUDENT_LEVEL_NAMES_ENGLISH: {
		[key: number]: string
	}
	STUDENT_LEVEL_OPTIONS: Array<{
		value: number
		label: string
	}>
}

/**
 * 服务器配置
 */
export const ConfigServer: ConfigServerType = {
	API_BASE_URL: 'https://1231ye546ts77.vicp.fun/zheng_en_ci-main_backend',
	VERIFICATION_CODE_URL: 'http://10.0.48.168:7001/api/v1/attendance/verification-code',
	IP_MONITOR_BASE_URL: 'https://1231ye546ts77.vicp.fun/zheng_en_ci-ip_monitor',
	APP_TITLE: 'AI坊学生管理系统',
	APP_VERSION: '1.0.0',
	
	// 学生等级对应名称（中文）
	STUDENT_LEVEL_NAMES: {
		0: '社团成员',
		1: '普通成员',
		2: '核心成员',
		3: '管理员'
	},
	
	// 学生等级对应名称（英文）
	STUDENT_LEVEL_NAMES_ENGLISH: {
		0: 'Club Member',
		1: 'Regular Member',
		2: 'Core Member',
		3: 'Administrator'
	},
	
	// 学生等级选项（用于下拉选择）
	STUDENT_LEVEL_OPTIONS: [
		{ value: 0, label: '社团成员' },
		{ value: 1, label: '普通成员' },
		{ value: 2, label: '核心成员' },
		{ value: 3, label: '管理员' }
	]
}

export default ConfigServer