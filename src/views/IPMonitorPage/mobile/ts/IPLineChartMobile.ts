/**
 * IP折线图桌面端组件核心逻辑类
 *
 * 本类负责IP折线图的全部数据处理、图表渲染、主题适配等功能
 * 采用面向对象设计模式，封装了折线图渲染所需的所有业务逻辑
 * 重构后，此类成为完整的视图模型，Vue组件只需调用此类的方法
 *
 * 主要功能：
 * 1. 管理坊内IP列表和IP出现次数的映射关系
 * 2. 使用ECharts渲染折线图展示IP使用趋势
 * 3. 支持深色/浅色主题自动适配
 * 4. 数据按使用次数排序展示
 * 5. 支持动态属性更新和响应式数据变化
 * 6. 自主数据获取，不依赖父组件传递props
 *
 * @class IPLineChartMobile
 * @author AI Workshop Team
 * @since 2024
 */
import {ref, computed, watch, type Ref} from 'vue'
import * as echarts from 'echarts'
import type {ECharts} from 'echarts'
import IPMonitorPageMobile from './IPMonitorPageMobile'
import type {IPMonitorPageData} from './IPMonitorPageMobile'
import {useThemeStore} from '@/stores/ts/theme'

/**
 * 折线图组件属性接口
 * 定义了组件接收的所有配置参数类型
 *
 * @interface ChartProps
 */
interface ChartProps {
	/**
	 * 坊内IP地址列表
	 * 用于标识哪些IP属于当前坊
	 * @type {string[]}
	 * @optional
	 */
	fangIPs?: string[]

	/**
	 * IP出现次数映射表
	 * 键为IP地址字符串，值为该IP出现的次数
	 * 用于绘制折线图
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
}

/**
 * IP折线图桌面端核心类
 * 封装了折线图的所有业务逻辑和计算方法
 * 重构后包含完整的Vue响应式数据管理和生命周期逻辑
 */
export class IPLineChartMobile {
	/**
	 * 图表容器DOM引用
	 * 用于获取图表挂载的DOM元素
	 * @private
	 * @type {ReturnType<typeof ref<HTMLDivElement | null>>}
	 */
	private chartRef: ReturnType<typeof ref<HTMLDivElement | null>>

	/**
	 * ECharts实例
	 * 存储ECharts图表实例，用于图表操作
	 * @private
	 * @type {ECharts | null}
	 */
	private chartInstance: ECharts | null = null

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
	 * 数据变化时自动更新图表
	 * @private
	 * @type {Ref<IPMonitorPageData>}
	 */
	private pageData: Ref<IPMonitorPageData>

	/**
	 * 主题状态管理实例
	 * 用于获取当前主题模式（深色/浅色）
	 * @private
	 * @type {ReturnType<typeof useThemeStore>}
	 */
	private themeStore: ReturnType<typeof useThemeStore>

	/**
	 * 是否为深色模式计算属性
	 * 从主题store获取当前主题状态
	 * 自动响应主题切换
	 * @private
	 * @type {import('vue').ComputedRef<boolean>}
	 */
	private readonly isDark: import('vue').ComputedRef<boolean>

	/**
	 * 数据监听器清理函数
	 * 用于在组件卸载时清理watch监听
	 * @private
	 * @type {(() => void) | null}
	 */
	private unwatchData: (() => void) | null = null

	/**
	 * 主题监听器清理函数
	 * 用于在组件卸载时清理watch监听
	 * @private
	 * @type {(() => void) | null}
	 */
	private unwatchTheme: (() => void) | null = null

	/**
	 * 构造函数
	 * 初始化组件属性
	 * 同时初始化数据管理实例和响应式数据
	 *
	 * @example
	 * const chart = new IPLineChartDesktop({
	 *   fangIPs: ['10.0.48.151', '10.0.48.152'],
	 *   ipCounts: { '10.0.48.151': 5, '10.0.48.152': 10 }
	 * })
	 * @param _props
	 */
	constructor(_props: ChartProps) {
		this.chartRef = ref<HTMLDivElement | null>(null)

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
		 * 初始化主题状态管理
		 */
		this.themeStore = useThemeStore()

		/**
		 * 初始化深色模式计算属性
		 * 从主题store获取当前主题状态
		 */
		this.isDark = computed(() => this.themeStore.isDarkMode)
	}

	/**
	 * 设置图表容器DOM引用
	 *
	 * @public
	 * @param {HTMLDivElement | null} val - DOM元素
	 */
	set ref(val: HTMLDivElement | null) {
		this.chartRef.value = val
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
	 * 图表数据计算属性
	 * 处理原始数据，转换为图表所需的格式
	 * 按使用次数升序排序
	 *
	 * @private
	 * @returns {{ip: string; count: number}[]} 图表数据数组
	 */
	private get chartData(): {ip: string; count: number}[] {
		const data: {ip: string; count: number}[] = []
		const ipCounts = this.ipCounts
		if (!ipCounts) {
			return data
		}
		Object.keys(ipCounts).forEach((ip) => {
			const count = ipCounts[ip] || 0
			data.push({ip, count})
		})
		return data.sort((a, b) => a.count - b.count)
	}

	/**
	 * 获取主题颜色
	 * 根据当前主题返回对应的颜色配置
	 */
	private getThemeColors(): {textColor: string; gridColor: string; lineColor: string} {
		return {
			textColor: this.isDark.value ? '#e0e0e0' : '#333333',
			gridColor: this.isDark.value ? '#333333' : '#e0e0e0',
			lineColor: this.isDark.value ? '#5bdae2' : '#1a9e9a'
		}
	}

	/**
	 * 初始化图表
	 * 创建ECharts实例并设置基础配置
	 *
	 * @private
	 */
	private initChart(): void {
		if (!this.chartRef.value) {
			return
		}
		this.chartInstance = echarts.init(this.chartRef.value)
		this.updateChart()
	}

	/**
	 * 更新图表
	 * 根据当前数据更新图表显示
	 *
	 * @private
	 */
	private updateChart(): void {
		if (!this.chartInstance) {
			return
		}

		const data = this.chartData
		const colors = this.getThemeColors()

		if (data.length === 0) {
			return
		}

		const option: echarts.EChartsOption = {
			tooltip: {
				trigger: 'axis',
				backgroundColor: this.isDark.value ? '#1a1a1a' : '#ffffff',
				borderColor: this.isDark.value ? '#5bdae2' : '#1a9e9a',
				borderWidth: 1,
				padding: [10, 15],
				textStyle: {
					color: this.isDark.value ? '#ffffff' : '#333333',
					fontSize: 14
				},
				extraCssText: this.isDark.value
					? 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);'
					: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);',
				formatter: (params: unknown) => {
					const p = params as {name: string; value: number}[]
					if (p && p[0]) {
						const ipColor = this.isDark.value ? '#5bdae2' : '#1a9e9a'
						return `<div style="font-weight: 500;">
							<div style="margin-bottom: 5px;">
								<span style="color: ${ipColor};">●</span>
								<span style="color: ${this.isDark.value ? '#ffffff' : '#333333'};">IP: ${p[0].name}</span>
							</div>
							<div>
								<span style="color: ${ipColor};">●</span>
								<span style="color: ${this.isDark.value ? '#ffffff' : '#333333'};">次数: ${p[0].value}</span>
							</div>
						</div>`
					}
					return ''
				}
			},
			grid: {
				left: '1%',
				right: '2%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data: data.map((d) => d.ip),
				axisLine: {
					lineStyle: {
						color: colors.gridColor
					}
				},
				axisLabel: {
					color: colors.textColor,
					rotate: 90,
					fontSize: 8,
					interval: 'auto',
					overflow: 'truncate',
					width: 60
				},
				axisTick: {
					alignWithLabel: true
				}
			},
			yAxis: {
				type: 'value',
				name: '出现次数',
				nameTextStyle: {
					color: colors.textColor,
					padding: [0, 0, 0, 40]
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: colors.gridColor
					}
				},
				axisLabel: {
					color: colors.textColor
				},
				splitLine: {
					lineStyle: {
						color: colors.gridColor,
						type: 'dashed'
					}
				}
			},
			series: [
				{
					name: '出现次数',
					type: 'line',
					data: data.map((d) => d.count),
					smooth: true,
					symbol: 'circle',
					symbolSize: 6,
					lineStyle: {
						color: colors.lineColor,
						width: 2
					},
					itemStyle: {
						color: colors.lineColor
					},
					areaStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{
								offset: 0,
								color: this.isDark.value ? 'rgba(91, 217, 212, 0.4)' : 'rgba(26, 158, 154, 0.4)'
							},
							{
								offset: 1,
								color: this.isDark.value ? 'rgba(91, 217, 212, 0.05)' : 'rgba(26, 158, 154, 0.05)'
							}
						])
					}
				}
			]
		}

		this.chartInstance.setOption(option)
	}

	/**
	 * 初始化组件
	 * 设置数据监听器、主题监听器和生命周期逻辑
	 * 此方法应在Vue组件的onMounted中调用
	 *
	 * @public
	 */
	public init(): void {
		/**
		 * 设置数据监听器
		 * 监听ipCounts数据变化，当时间段切换导致数据更新时重新渲染图表
		 */
		this.unwatchData = watch(
			() => this.ipCounts,
			() => {
				// 更新pageData获取最新数据
				this.pageData.value = this.pageDataManager.getData()
				if (this.chartInstance) {
					this.updateChart()
				}
			},
			{deep: true}
		)

		/**
		 * 设置主题监听器
		 * 监听isDark变化，当主题切换时重新渲染图表
		 */
		this.unwatchTheme = watch(
			this.isDark,
			() => {
				if (this.chartInstance) {
					this.updateChart()
				}
			}
		)

		/**
		 * 初始化图表
		 */
		this.initChart()

		/**
		 * 添加窗口大小变化监听
		 */
		window.addEventListener('resize', this.handleResize)

		/**
		 * 使用重试机制确保在异步数据场景下组件能正确初始化
		 */
		let attempts = 0
		const tryUpdate = () => {
			attempts++
			if (this.chartData.length > 0) {
				this.updateChart()
			} else if (attempts < 20) {
				setTimeout(tryUpdate, 300)
			}
		}
		setTimeout(tryUpdate, 300)
	}

	/**
	 * 销毁组件
	 * 清理监听器和资源
	 * 此方法应在Vue组件的onBeforeUnmount中调用
	 *
	 * @public
	 */
	public destroy(): void {
		// 清理数据监听器
		if (this.unwatchData) {
			this.unwatchData()
			this.unwatchData = null
		}

		// 清理主题监听器
		if (this.unwatchTheme) {
			this.unwatchTheme()
			this.unwatchTheme = null
		}

		// 销毁图表实例
		if (this.chartInstance) {
			this.chartInstance.dispose()
			this.chartInstance = null
		}

		// 移除窗口大小变化监听
		window.removeEventListener('resize', this.handleResize)
	}

	/**
	 * 处理窗口大小变化
	 * 调整图表大小以适应容器
	 *
	 * @private
	 */
	private handleResize = (): void => {
		if (this.chartInstance) {
			this.chartInstance.resize()
		}
	}
}
