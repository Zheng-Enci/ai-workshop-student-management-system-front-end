/**
 * 服务器配置对象
 * 定义应用的基础配置信息，包括API地址、验证码服务地址等
 *
 * @module config/Config
 * @description 应用全局配置，包含API基础URL、验证码URL、应用标题和版本号
 */

/**
 * 服务器配置接口
 * 定义所有服务器相关配置项的类型结构
 */
interface ConfigServerType {
	/**
	 * 主后端API服务基础URL地址
	 * 用于学生管理系统的主要业务接口请求
	 * @example 'https://1231ye546ts77.vicp.fun/zheng_en_ci-main_backend'
	 */
	API_BASE_URL: string

	/**
	 * 验证码服务URL地址
	 * 用于获取考勤签到验证码图片
	 * @example 'http://10.0.48.168:7001/api/v1/attendance/verification-code'
	 */
	VERIFICATION_CODE_URL: string

	/**
	 * IP监控服务器基础URL地址
	 * 用于IP扫描数据统计、IP范围查询等监控功能
	 * 与主后端共用域名，仅路径后缀不同
	 * @example 'https://1231ye546ts77.vicp.fun/zheng_en_ci-ip_monitor'
	 */
	IP_MONITOR_BASE_URL: string

	/**
	 * 应用标题
	 * 显示在浏览器标签页和页面头部
	 * @example 'AI坊学生管理系统'
	 */
	APP_TITLE: string

	/**
	 * 应用版本号
	 * 遵循语义化版本规范 (SemVer)
	 * @example '1.0.0'
	 */
	APP_VERSION: string

	/**
	 * 学生等级对应名称（中文）
	 * 用于显示学生身份等级的本地化文本
	 * @property {string} 0 - 社团成员（最低等级）
	 * @property {string} 1 - 普通成员
	 * @property {string} 2 - 核心成员
	 * @property {string} 3 - 管理员（最高等级）
	 */
	STUDENT_LEVEL_NAMES: {
		[key: number]: string
	}

	/**
	 * 学生等级对应名称（英文）
	 * 用于国际化显示或导出数据时使用
	 * @property {string} 0 - Club Member
	 * @property {string} 1 - Regular Member
	 * @property {string} 2 - Core Member
	 * @property {string} 3 - Administrator
	 */
	STUDENT_LEVEL_NAMES_ENGLISH: {
		[key: number]: string
	}

	/**
	 * 学生等级选项数组
	 * 用于下拉选择组件的数据源
	 * 包含value和label属性，兼容Element Plus的el-select组件
	 */
	STUDENT_LEVEL_OPTIONS: Array<{
		/**
		 * 等级数值
		 * @type {number}
		 */
		value: number
		/**
		 * 等级显示文本
		 * @type {string}
		 */
		label: string
	}>
}

/**
 * 服务器配置对象
 * 包含所有服务器相关的配置项实例
 *
 * @type {ConfigServerType}
 * @const
 */
export const ConfigServer: ConfigServerType = {
	/**
	 * 主后端API服务基础URL地址
	 * 用于学生管理系统的主要业务接口请求
	 */
	API_BASE_URL: 'https://1231ye546ts77.vicp.fun/zheng_en_ci-main_backend',

	/**
	 * 验证码服务URL地址
	 * 用于获取考勤签到验证码图片
	 */
	VERIFICATION_CODE_URL: 'http://10.0.48.168:7001/api/v1/attendance/verification-code',

	/**
	 * IP监控服务器基础URL地址
	 * 用于IP扫描数据统计、IP范围查询等监控功能
	 * 与主后端共用域名 https://1231ye546ts77.vicp.fun，仅路径后缀不同
	 * 提供以下API端点：
	 * - /api/ip-counts - 获取IP出现次数统计
	 * - /api/scan-count - 获取扫描次数
	 * - /api/fang-ips - 获取坊内IP列表
	 * - /api/ip-range - 获取IP范围
	 */
	IP_MONITOR_BASE_URL: 'https://1231ye546ts77.vicp.fun/zheng_en_ci-ip_monitor',

	/**
	 * 应用标题
	 * 显示在浏览器标签页和页面头部
	 */
	APP_TITLE: 'AI坊学生管理系统',

	/**
	 * 应用版本号
	 * 遵循语义化版本规范 (SemVer)
	 */
	APP_VERSION: '1.0.0',

	/**
	 * 学生等级对应名称（中文）
	 * 用于显示学生身份等级的本地化文本
	 * 等级从低到高：社团成员 < 普通成员 < 核心成员 < 管理员
	 */
	STUDENT_LEVEL_NAMES: {
		0: '社团成员',
		1: '普通成员',
		2: '核心成员',
		3: '管理员'
	},

	/**
	 * 学生等级对应名称（英文）
	 * 用于国际化显示或导出数据时使用
	 */
	STUDENT_LEVEL_NAMES_ENGLISH: {
		0: 'Club Member',
		1: 'Regular Member',
		2: 'Core Member',
		3: 'Administrator'
	},

	/**
	 * 学生等级选项数组（用于下拉选择）
	 * 兼容Element Plus的el-select组件格式
	 * 可直接绑定到el-option组件
	 */
	STUDENT_LEVEL_OPTIONS: [
		{ value: 0, label: '社团成员' },
		{ value: 1, label: '普通成员' },
		{ value: 2, label: '核心成员' },
		{ value: 3, label: '管理员' }
	]
}

/**
 * 默认导出服务器配置对象
 * 支持ES模块的默认导入语法
 *
 * @example
 * import ConfigServer from '@/config/ts/Config'
 * const apiUrl = ConfigServer.API_BASE_URL
 */
export default ConfigServer
