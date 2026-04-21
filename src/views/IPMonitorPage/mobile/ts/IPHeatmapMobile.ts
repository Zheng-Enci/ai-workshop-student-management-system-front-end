/**
 * IP热力图桌面端组件核心逻辑类
 *
 * 本类负责IP热力图的全部数据处理、单元格样式计算、点击事件处理等功能
 * 采用面向对象设计模式，封装了热力图渲染所需的所有业务逻辑
 * 重构后，此类成为完整的视图模型，Vue组件只需调用此类的方法
 *
 * 主要功能：
 * 1. 管理坊内IP列表和IP出现次数的映射关系
 * 2. 根据IP出现次数计算热力图颜色渐变
 * 3. 提供单元格的CSS类名和样式计算
 * 4. 处理单元格点击交互事件
 * 5. 支持动态属性更新和响应式数据变化
 * 6. 自主数据获取，不依赖父组件传递props
 *
 * @class IPHeatmapMobile
 * @author AI Workshop Team
 * @since 2024
 */
import {ElMessage} from 'element-plus'
import {computed, ref, watch, type Ref} from 'vue'
import IPMonitorPageMobile from './IPMonitorPageMobile'
import type {IPMonitorPageData} from './IPMonitorPageMobile'

/**
 * 热力图组件属性接口
 * 定义了组件接收的所有配置参数类型
 *
 * @interface HeatmapProps
 */
interface HeatmapProps {
	/**
	 * 坊内IP地址列表
	 * 用于标识哪些IP属于当前坊，坊内IP将根据出现次数显示热力图颜色
	 * 非坊内IP则显示为灰色占位状态
	 * @type {string[]}
	 * @optional
	 */
	fangIPs?: string[]

	/**
	 * IP出现次数映射表
	 * 键为IP地址字符串，值为该IP出现的次数
	 * 用于计算热力图的颜色深浅
	 * @type {Record<string, number>}
	 * @optional
	 */
	ipCounts?: Record<string, number>

	/**
	 * 是否为深色模式
	 * 用于适配不同的主题配色方案
	 * @type {boolean}
	 * @optional
	 */
	isDark?: boolean

	/**
	 * IP地址范围列表
	 * 定义热力图显示的所有IP地址，从后端API获取
	 * @type {string[]}
	 * @optional
	 */
	ipRange?: string[]
}

/**
 * IP热力图桌面端核心类
 * 封装了热力图的所有业务逻辑和计算方法
 * 重构后包含完整的Vue响应式数据管理和生命周期逻辑
 */
export class IPHeatmapMobile {
	/**
	 * IP计数器映射
	 * 使用Map结构存储IP到出现次数的映射，提供高效的查询性能
	 * 在属性更新时自动同步
	 * @private
	 * @type {Map<string, number>}
	 */
	private ipCounter: Map<string, number> = new Map()

	/**
	 * IP监控页面数据管理实例
	 * 使用单例模式获取数据管理类实例
	 * 该实例包含所有IP监控数据：ipCounts、scanCount、fangIPs、ipRange
	 * @private
	 * @type {IPMonitorPageMobile}
	 */
	private pageDataManager: IPMonitorPageMobile

	/**
	 * 页面数据响应式引用
	 * 直接从IPMonitorPageDesktop获取数据并转换为响应式
	 * 数据变化时自动更新热力图
	 * @private
	 * @type {Ref<IPMonitorPageData>}
	 */
	private pageData: Ref<IPMonitorPageData>

	/**
	 * 是否为深色模式
	 * 从本地存储或系统偏好获取主题设置
	 * 默认使用浅色模式
	 * @private
	 * @type {Ref<boolean>}
	 */
	private readonly isDark: Ref<boolean>

	/**
	 * 数据监听器清理函数
	 * 用于在组件卸载时清理watch监听
	 * @private
	 * @type {(() => void) | null}
	 */
	private unwatchData: (() => void) | null = null

	/**
	 * 构造函数
	 * 初始化组件属性并构建IP计数器映射
	 * 同时初始化数据管理实例和响应式数据
	 *
	 * @example
	 * const heatmap = new IPHeatmapMobile({
	 *   fangIPs: ['10.0.48.151', '10.0.48.152'],
	 *   ipCounts: { '10.0.48.151': 5, '10.0.48.152': 10 }
	 * })
	 * @param _props
	 */
	constructor(_props: HeatmapProps) {
		/**
		 * 初始化数据管理实例
		 * 使用单例模式获取IPMonitorPageDesktop实例
		 */
		this.pageDataManager = IPMonitorPageMobile.getInstance()

		/**
		 * 初始化页面数据响应式引用
		 * 直接从数据管理器获取数据
		 */
		this.pageData = ref<IPMonitorPageData>(this.pageDataManager.getData())

		/**
		 * 初始化深色模式状态
		 * 默认使用浅色模式
		 */
		this.isDark = ref(false)

		/**
		 * 初始化IP计数器
		 * 注意：此时pageData已经初始化，可以使用计算属性
		 */
		this.updateIPCouter()
	}

	/**
	 * 坊内IP列表计算属性
	 * 从pageData中提取坊内IP列表
	 * 如果数据未加载则返回空数组
	 *
	 * @public
	 * @returns {string[]} 坊内IP地址数组
	 */
	public get fangIPs(): string[] {
		return this.pageData.value.fangIPs?.fang_ips || []
	}

	/**
	 * IP使用次数映射计算属性
	 * 从pageData中提取IP使用次数映射
	 * 如果数据未加载则返回空对象
	 *
	 * @public
	 * @returns {Record<string, number>} IP使用次数映射
	 */
	public get ipCounts(): Record<string, number> {
		return this.pageData.value.ipCounts?.ip_counts || {}
	}

	/**
	 * IP地址范围列表计算属性
	 * 从pageData中提取IP地址范围列表
	 * 如果数据未加载则返回空数组
	 *
	 * @public
	 * @returns {string[]} IP地址范围数组
	 */
	public get ipRange(): string[] {
		return this.pageData.value.ipRange?.ip_range || []
	}

	/**
	 * 热力图行数计算属性
	 * 从ipRange长度计算行数
	 * 行数根据ipRange长度和每行显示的列数计算得出
	 *
	 * @public
	 * @returns {number} 热力图行数
	 */
	public get rowCount(): number {
		return Math.ceil(this.ipRange.length / 4)
	}

	/**
	 * 热力图列数计算属性
	 * 默认每行显示4个IP
	 *
	 * @public
	 * @returns {number} 热力图列数，固定为4
	 */
	public get colCount(): number {
		return 4
	}

	/**
	 * 计算属性：获取最大出现次数
	 * 遍历所有IP计数，返回出现次数的最大值
	 * 用于热力图颜色计算的上限基准
	 *
	 * @public
	 * @returns {number} 最大出现次数，无数据时返回0
	 */
	public get maxCount(): number {
		const counts = Object.values(this.ipCounts)
		if (counts.length === 0) return 0
		return Math.max(...counts)
	}

	/**
	 * 计算属性：获取最小出现次数（非零）
	 * 遍历所有IP计数，返回大于0的最小出现次数
	 * 用于热力图颜色计算的下限基准
	 *
	 * @public
	 * @returns {number} 最小非零出现次数，无有效数据时返回0
	 */
	public get minCount(): number {
		const counts = Object.values(this.ipCounts).filter(c => c > 0)
		if (counts.length === 0) return 0
		return Math.min(...counts)
	}

	/**
	 * 初始化组件
	 * 设置数据监听器和生命周期逻辑
	 * 此方法应在Vue组件的onMounted中调用
	 *
	 * @public
	 * @returns {void}
	 */
	public init(): void {
		/**
		 * 设置数据监听器
		 * 监听fangIPs、ipCounts、isDark的变化
		 * 当任一数据变化时，调用updateProps更新内部状态
		 */
		this.unwatchData = watch(
			[
				computed(() => this.fangIPs),
				computed(() => this.ipCounts),
				this.isDark
			],
			([newFangIPs, newIpCounts, newIsDark]) => {
				this.updateProps({
					fangIPs: newFangIPs,
					ipCounts: newIpCounts,
					isDark: newIsDark,
					ipRange: this.ipRange
				})
			},
			{deep: true}
		)

		/**
		 * 组件挂载后执行，处理异步数据加载场景
		 * 使用重试机制确保在异步数据场景下组件能正确初始化
		 */
		let attempts = 0
		const tryUpdate = () => {
			attempts++
			// 更新pageData引用
			this.pageData.value = this.pageDataManager.getData()
			// 检查fangIPs是否已加载且有数据
			if (this.fangIPs && this.fangIPs.length > 0) {
				// 数据已加载，更新heatmap实例
				this.updateProps({
					fangIPs: this.fangIPs,
					ipCounts: this.ipCounts,
					isDark: this.isDark.value,
					ipRange: this.ipRange
				})
			} else if (attempts < 20) {
				// 数据未加载，继续重试（最多20次）
				setTimeout(tryUpdate, 300)
			}
		}
		// 延迟300ms后开始第一次尝试
		setTimeout(tryUpdate, 300)
	}

	/**
	 * 销毁组件
	 * 清理监听器和资源
	 * 此方法应在Vue组件的onBeforeUnmount中调用
	 *
	 * @public
	 * @returns {void}
	 */
	public destroy(): void {
		if (this.unwatchData) {
			this.unwatchData()
			this.unwatchData = null
		}
	}
	/**
	 * 更新IP计数器
	 * 将ipCounts对象转换为Map结构，便于后续高效查询
	 * 此方法在构造函数和属性更新时调用
	 *
	 * @private
	 * @returns {void}
	 */
	private updateIPCouter(): void {
		// 使用计算属性ipCounts获取数据，确保数据一致性
		this.ipCounter = new Map(Object.entries(this.ipCounts || {}))
	}

	/**
	 * 更新组件属性
	 * 支持动态更新组件配置，更新后会自动重新计算IP计数器
	 * 此方法用于响应式数据变化场景
	 *
	 * @public
	 * @param {HeatmapProps} _props - 新的组件属性（已废弃，保留参数以保持API兼容）
	 * @returns {void}
	 * @example
	 * heatmap.updateProps({
	 *   ipCounts: { '10.0.48.151': 15 }
	 * })
	 */
	public updateProps(_props: HeatmapProps): void {
		// 直接从计算属性获取最新数据，不再依赖props
		this.updateIPCouter()
	}

	/**
	 * 计算热力图颜色RGB值
	 * 根据最小值、最大值和当前值，使用线性插值算法计算热力图渐变颜色
	 *
	 * 颜色渐变逻辑：
	 * - 最小值（或零值）显示为浅青色 (91, 217, 212)
	 * - 最大值显示为深红色 (45, 85, 130)
	 * - 中间值按比例进行RGB线性插值
	 *
	 * @public
	 * @static
	 * @param {number} min - 最小出现次数（颜色基准下限）
	 * @param {number} max - 最大出现次数（颜色基准上限）
	 * @param {number} value - 当前IP的出现次数
	 * @returns {{r: number; g: number; b: number}} RGB颜色对象，包含r、g、b三个分量（0-255）
	 * @example
	 * const color = IPHeatmapMobile.calculateColor(1, 10, 5)
	 * // 返回中间过渡色
	 */
	public static calculateColor(
		min: number,
		max: number,
		value: number
	): {r: number; g: number; b: number} {
		// 边界情况处理：如果最大值等于最小值，或值为0，返回默认浅青色
		if (max === min || value === 0) {
			return {r: 91, g: 217, b: 212}
		}

		// 计算当前值在最小最大值之间的比例（0-1之间）
		const ratio = (value - min) / (max - min)

		// RGB线性插值计算
		// 从浅青色(91, 217, 212)渐变到深红色(45, 85, 130)
		const r = Math.round(91 + (45 - 91) * ratio)
		const g = Math.round(217 + (85 - 217) * ratio)
		const b = Math.round(212 + (130 - 212) * ratio)

		return {r, g, b}
	}

	/**
	 * 获取IP编号
	 * 根据行列位置计算对应的IP在列表中的索引
	 *
	 * 计算逻辑：
	 * - 将行列位置转换为一维索引
	 * - 每行4个IP，行号从1开始
	 * - 列号从1开始
	 *
	 * @public
	 * @param {number} row - 行号（从1开始）
	 * @param {number} col - 列号（从1开始）
	 * @returns {number} IP在列表中的索引位置
	 * @example
	 * getIPIndex(1, 1) // 返回 0
	 * getIPIndex(1, 2) // 返回 1
	 * getIPIndex(2, 1) // 返回 4
	 */
	public getIPIndex(row: number, col: number): number {
		return (row - 1) * 4 + (col - 1)
	}

	/**
	 * 获取完整IP地址
	 * 根据行列位置从IP列表中获取对应的IP地址
	 *
	 * @public
	 * @param {number} row - 行号（从1开始）
	 * @param {number} col - 列号（从1开始）
	 * @returns {string} 完整的IP地址，如 "10.0.48.151"
	 * @example
	 * getFullIP(1, 1) // 返回 "10.0.48.151"
	 */
	public getFullIP(row: number, col: number): string {
		const index = this.getIPIndex(row, col)
		// 使用计算属性ipRange获取IP列表，确保数据一致性
		return this.ipRange[index] || ''
	}

	/**
	 * 获取单元格样式类名
	 * 根据IP的状态（是否坊内IP、出现次数）返回对应的CSS类名
	 *
	 * 类名分配逻辑：
	 * 1. 基础类名：ip-monitor-page-mobile-ip-cell（所有单元格）
	 * 2. 非坊内IP：ip-monitor-page-mobile-non-fang（灰色显示）
	 * 3. 坊内IP但次数为0：ip-monitor-page-mobile-count-zero（浅色显示）
	 * 4. 坊内IP且有次数：ip-monitor-page-mobile-heatmap-cell（热力图颜色）
	 *
	 * @public
	 * @param {number} row - 行号（从1开始）
	 * @param {number} col - 列号（从1开始）
	 * @returns {string} 空格分隔的CSS类名字符串
	 */
	public getCellClass(row: number, col: number): string {
		// 基础类名，所有单元格都包含
		const classes = ['ip-monitor-page-mobile-ip-cell']

		// 获取当前位置的IP地址和计数
		const ip = this.getFullIP(row, col)
		const count = this.ipCounter.get(ip) || 0
		const isFangIP = this.fangIPs.includes(ip)

		// 根据IP状态分配不同的样式类名
		if (!isFangIP) {
			// 非坊内IP：使用灰色样式
			classes.push('ip-monitor-page-mobile-non-fang')
		} else if (count === 0) {
			// 坊内IP但无记录：使用浅色样式
			classes.push('ip-monitor-page-mobile-count-zero')
		} else {
			// 坊内IP且有记录：使用热力图样式
			classes.push('ip-monitor-page-mobile-heatmap-cell')
		}

		return classes.join(' ')
	}

	/**
	 * 获取单元格内联样式
	 * 根据IP出现次数计算对应的背景色和文字颜色样式
	 *
	 * 样式计算逻辑：
	 * 1. 非坊内IP或次数为0：返回空对象，使用默认样式
	 * 2. 坊内IP且有次数：计算热力图渐变背景色
	 * 3. 文字颜色根据背景亮度自动计算（深色背景用白字，浅色背景用黑字）
	 *
	 * 亮度计算公式：Y = 0.299*R + 0.587*G + 0.114*B
	 * 阈值180以下为深色背景，使用白色文字
	 *
	 * @public
	 * @param {number} row - 行号（从1开始）
	 * @param {number} col - 列号（从1开始）
	 * @returns {Record<string, string>} 样式对象，包含backgroundColor和color属性
	 */
	public getCellStyle(row: number, col: number): Record<string, string> {
		// 获取当前位置的IP地址和计数
		const ip = this.getFullIP(row, col)
		const count = this.ipCounter.get(ip) || 0

		// 非坊内IP或次数为0时返回空样式
		if (!this.fangIPs.includes(ip) || count === 0) {
			return {}
		}

		// 计算热力图颜色
		const color = IPHeatmapMobile.calculateColor(this.minCount, this.maxCount, count)

		// 计算背景亮度，使用标准亮度公式
		// 亮度值范围0-255，阈值180用于判断深浅背景
		const brightness = color.r * 0.299 + color.g * 0.587 + color.b * 0.114
		const textColor = brightness < 180 ? 'white' : '#333333'

		return {
			backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
			color: textColor
		}
	}

	/**
	 * 处理单元格点击事件
	 * 当用户点击热力图中的IP单元格时触发
	 *
	 * 交互行为：
	 * - 显示Element Plus消息提示
	 * - 展示当前IP地址和出现次数
	 *
	 * @public
	 * @param {number} row - 点击的行号（从1开始）
	 * @param {number} col - 点击的列号（从1开始）
	 * @returns {void}
	 */
	public handleCellClick(row: number, col: number): void {
		const ip = this.getFullIP(row, col)
		const count = this.ipCounter.get(ip) || 0
		ElMessage.info(`IP: ${ip}, 出现次数: ${count}`)
	}
}
