/**
 * IP热力图桌面端组件核心逻辑
 * 负责热力图数据处理、单元格样式计算、点击事件处理
 */
import {ref, computed} from 'vue'
import {ElMessage} from 'element-plus'

interface HeatmapProps {
	fangIPs: string[]
	ipCounts: Record<string, number>
	isDark: boolean
}

export class IPHeatmapDesktop {
	private props: HeatmapProps
	private ipCounter: Map<string, number> = new Map()

	private static readonly IP_START = 151
	private static readonly IP_PREFIX = '10.0.48.'

	constructor(props: HeatmapProps) {
		this.props = props
		this.updateIPCouter()
	}

	private updateIPCouter(): void {
		this.ipCounter = new Map(Object.entries(this.props.ipCounts || {}))
	}

	public updateProps(props: HeatmapProps): void {
		this.props = props
		this.updateIPCouter()
	}

	/**
	 * 计算属性：坊内IP列表
	 */
	public get fangIPs(): string[] {
		return this.props.fangIPs || []
	}

	/**
	 * 计算属性：最大次数
	 */
	public get maxCount(): number {
		let max = 0
		this.ipCounter.forEach((count) => {
			if (count > max) {
				max = count
			}
		})
		return max
	}

	/**
	 * 计算属性：最小次数（非零）
	 */
	public get minCount(): number {
		let min = Infinity
		this.ipCounter.forEach((count) => {
			if (count > 0 && count < min) {
				min = count
			}
		})
		return min === Infinity ? 0 : min
	}

	/**
	 * 计算颜色RGB值
	 * 根据最小值、最大值和当前值计算热力图颜色
	 *
	 * @param min - 最小出现次数
	 * @param max - 最大出现次数
	 * @param value - 当前IP的出现次数
	 * @returns RGB对象 {r, g, b}
	 */
	public static calculateColor(
		min: number,
		max: number,
		value: number
	): {r: number; g: number; b: number} {
		if (max === min || value === 0) {
			return {r: 91, g: 217, b: 212}
		}

		const ratio = (value - min) / (max - min)
		const r = Math.round(91 + (45 - 91) * ratio)
		const g = Math.round(217 + (85 - 217) * ratio)
		const b = Math.round(212 + (130 - 212) * ratio)

		return {r, g, b}
	}

	/**
	 * 获取IP编号
	 * 根据行列计算IP的最后一位编号
	 */
	public getIPNumber(row: number, col: number): number {
		return IPHeatmapDesktop.IP_START + (row - 1) * 10 + (col - 1)
	}

	/**
	 * 获取完整IP地址
	 * 根据行列计算完整的IP地址
	 */
	public getFullIP(row: number, col: number): string {
		return `${IPHeatmapDesktop.IP_PREFIX}${this.getIPNumber(row, col)}`
	}

	/**
	 * 获取单元格样式类
	 * 根据IP状态返回对应的CSS类名
	 */
	public getCellClass(row: number, col: number): string {
		const classes = ['ip-monitor-page-desktop-ip-cell']

		const ip = this.getFullIP(row, col)
		const count = this.ipCounter.get(ip) || 0
		const isFangIP = this.fangIPs.includes(ip)

		if (!isFangIP) {
			classes.push('ip-monitor-page-desktop-non-fang')
		} else if (count === 0) {
			classes.push('ip-monitor-page-desktop-count-zero')
		} else {
			classes.push('ip-monitor-page-desktop-heatmap-cell')
		}

		return classes.join(' ')
	}

	/**
	 * 获取单元格样式
	 * 根据IP出现次数返回对应的背景色样式
	 */
	public getCellStyle(row: number, col: number): Record<string, string> {
		const ip = this.getFullIP(row, col)
		const count = this.ipCounter.get(ip) || 0

		if (!this.fangIPs.includes(ip) || count === 0) {
			return {}
		}
		const color = IPHeatmapDesktop.calculateColor(this.minCount, this.maxCount, count)

		// 计算文字颜色
		const brightness = color.r * 0.299 + color.g * 0.587 + color.b * 0.114
		const textColor = brightness < 180 ? 'white' : '#333333'

		return {
			backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
			color: textColor
		}
	}

	/**
	 * 处理单元格点击
	 * 点击IP单元格时的处理函数
	 */
	public handleCellClick(row: number, col: number): void {
		const ip = this.getFullIP(row, col)
		const count = this.ipCounter.get(ip) || 0
		ElMessage.info(`IP: ${ip}, 出现次数: ${count}`)
	}

	/**
	 * 渲染行数
	 */
	public get rowCount(): number {
		return 10
	}

	/**
	 * 渲染列数
	 */
	public get colCount(): number {
		return 10
	}
}

export default IPHeatmapDesktop
