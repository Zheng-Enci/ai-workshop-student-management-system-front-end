/**
 * 签到趋势图组件TypeScript逻辑
 *
 * @description 签到趋势图ECharts封装组件，负责数据处理和图表渲染
 * 该组件展示学生签到记录的累计趋势折线图，按日期统计累计签到次数
 * 数据从AttendancePageDesktop单例获取，确保全局数据一致性
 * @class AttendancePageTrendDesktopComponent
 * @author ZhengEnCi zheng_enci_work@foxmail.com
 * @date 2026-01
 * @version 1.0.0
 */

// ===================== 第三方依赖导入区 =====================
/**
 * Vue响应式API导入
 * @description ref用于创建响应式引用，watch用于监听主题变化，Ref为类型定义
 */
import {ref, type Ref, watch} from 'vue'

/**
 * ECharts核心模块导入
 * @description echarts/core提供ECharts核心功能
 */
import * as echarts from 'echarts/core'

/**
 * ECharts折线图图表类型导入
 * @description LineChart用于渲染折线图
 */
import {LineChart} from 'echarts/charts'

/**
 * ECharts组件导入
 * @description
 * - GridComponent: 网格组件
 * - TitleComponent: 标题组件
 * - TooltipComponent: 提示框组件
 */
import {
	GridComponent,
	TitleComponent,
	TooltipComponent
} from 'echarts/components'

/**
 * ECharts渲染器导入
 * @description CanvasRenderer使用Canvas渲染图表
 */
import {CanvasRenderer} from 'echarts/renderers'

/**
 * 主题状态管理Store导入
 * @description useThemeStore用于获取当前主题模式(暗黑/亮色)，实现主题切换
 */
import {useThemeStore} from '@/stores/ts/theme'

/**
 * 签到页面数据单例导入
 * @description attendancePageDesktop是AttendancePageDesktop类的单例实例
 * 提供waitForReady()方法等待数据就绪，getAttendanceRecords()方法获取签到记录
 */
import attendancePageDesktop from './AttendancePageDesktop'

// ===================== 类型定义区 =====================
/**
 * 签到记录接口
 * @interface AttendanceRecord
 * @description 定义签到记录的数据结构
 * @property {string} attendanceDateTime - 签到日期时间，ISO 8601格式，例如"2025-09-10T14:43:15.543635"
 */
interface AttendanceRecord {
	attendanceDateTime: string
}

/**
 * 折线图数据接口
 * @interface LineChartData
 * @description 定义折线图所需的数据结构
 * @property {string[]} dates - 日期数组，格式为YYYY-MM-DD
 * @property {number[]} values - 对应日期的累计签到次数数组
 */
interface LineChartData {
	dates: string[]
	values: number[]
}

// ===================== ECharts 组件注册 =====================
/**
 * ECharts组件注册
 * @description 注册折线图所需的所有ECharts组件，必须在初始化图表前完成注册
 * 使用echarts.use()方法注册组件，这是ECharts 5.0+的按需引入方式
 */
echarts.use([
	TitleComponent,		// 标题组件
	TooltipComponent,	// 提示框组件
	GridComponent,		// 网格组件
	LineChart,			// 折线图图表
	CanvasRenderer		// Canvas渲染器
])

// ===================== 类定义区 =====================
/**
 * 签到趋势图组件类
 * @class AttendancePageTrendDesktopComponent
 * @description
 * 封装ECharts折线图的所有功能，包括：
 * 1. 数据加载：从AttendancePageDesktop单例获取签到记录
 * 2. 数据处理：按日期统计累计签到次数
 * 3. 图表渲染：使用ECharts渲染折线图
 * 4. 主题适配：监听主题变化，自动切换暗黑/亮色模式
 * 5. 生命周期管理：提供dispose方法销毁图表实例
 */
export default class AttendancePageTrendDesktopComponent {
	/**
	 * ECharts实例
	 * @private
	 * @description ECharts图表实例，通过echarts.init()创建
	 * 在initChart()方法中初始化，在dispose()方法中销毁
	 */
	private chartInstance: echarts.ECharts | null = null

	/**
	 * DOM容器引用
	 * @private
	 * @description 图表容器的DOM元素引用
	 * 从chartRef.value获取，用于ECharts初始化
	 */
	private chartContainer: HTMLElement | null = null

	/**
	 * 签到记录数据
	 * @private
	 * @description 存储从单例获取的签到记录数组
	 * 每个记录包含attendanceDateTime字段
	 * 在loadData()方法中赋值，在generateLineData()方法中使用
	 */
	private attendanceRecords: AttendanceRecord[] = []

	/**
	 * 主题Store
	 * @private
	 * @description Vue Pinia Store实例，用于获取当前主题模式
	 * isDarkMode属性表示是否为暗黑模式，影响图表配色
	 */
	private themeStore = useThemeStore()

	/**
	 * 图表容器引用（外部传入）
	 * @public
	 * @description Vue的ref引用，指向图表容器的DOM元素
	 * 由Vue组件通过v-bind传入，在onMounted时赋值
	 * @example
	 * // 在Vue组件中
	 * const chartRef = ref<HTMLElement | null>(null)
	 * trendComponent.chartRef = chartRef
	 */
	public chartRef: Ref<HTMLElement | null> = ref(null)

	/**
	 * 构造函数
	 * @constructor
	 * @description 初始化组件，启动主题变化监听
	 * 调用watchTheme()方法设置主题监听
	 */
	constructor() {
		this.watchTheme()
	}

	/**
	 * 加载签到记录数据
	 * @public
	 * @async
	 * @description
	 * 从AttendancePageDesktop单例加载签到记录数据
	 * 流程：
	 * 1. 调用waitForReady()等待单例数据初始化完成
	 * 2. 调用getAttendanceRecords()获取签到记录
	 * 3. 调用initChart()初始化图表
	 * 4. 调用updateChart()更新图表显示
	 * @throws 如果数据加载失败，会在控制台输出错误信息
	 */
	public async loadData(): Promise<void> {
		try {
			// 等待单例数据初始化完成，确保数据已加载
			await attendancePageDesktop.waitForReady()

			// 从单例获取签到记录数据
			this.attendanceRecords = attendancePageDesktop.getAttendanceRecords()

			// 初始化ECharts图表实例
			this.initChart()

			// 更新图表配置并渲染
			this.updateChart()
		} catch (error) {
			// 数据加载失败，输出错误信息到控制台
			console.error('加载签到记录失败:', error)
		}
	}

	/**
	 * 初始化图表
	 * @private
	 * @description
	 * 初始化ECharts图表实例
	 * 流程：
	 * 1. 检查chartRef.value是否存在
	 * 2. 保存DOM容器引用
	 * 3. 调用echarts.init()创建图表实例
	 * 4. 调用updateChart()渲染图表
	 */
	private initChart(): void {
		// 检查图表容器引用是否存在，不存在则直接返回
		if (!this.chartRef.value) {
			return
		}

		// 保存DOM容器引用，用于后续图表操作
		this.chartContainer = this.chartRef.value

		// 创建ECharts图表实例，使用Canvas渲染
		this.chartInstance = echarts.init(this.chartContainer)

		// 初始化完成后立即更新图表
		this.updateChart()
	}

	/**
	 * 监听主题变化
	 * @private
	 * @description
	 * 使用Vue的watch监听themeStore.isDarkMode变化
	 * 当主题切换时，自动调用updateChart()重新渲染图表
	 * 实现暗黑/亮色模式的无缝切换
	 */
	private watchTheme(): void {
		// 监听主题Store的isDarkMode属性变化
		watch(() => this.themeStore.isDarkMode, () => {
			// 主题变化时重新渲染图表，应用新的配色方案
			this.updateChart()
		})
	}

	/**
	 * 生成折线图所需数据
	 * @private
	 * @returns {LineChartData} 折线图数据对象
	 * @description
	 * 将签到记录按日期统计，生成折线图数据
	 * 流程：
	 * 1. 遍历所有签到记录，按日期统计每日签到次数
	 * 2. 对日期进行排序，确保时间顺序正确
	 * 3. 计算累计签到次数
	 * @example
	 * // 返回数据示例
	 * {
	 *   dates: ['2025-09-10', '2025-09-11', '2025-09-12'],
	 *   values: [2, 5, 8] // 累计次数
	 * }
	 */
	private generateLineData(): LineChartData {
		// 创建日期到当日签到次数的映射表
		const dateMap = new Map<string, number>()

		// 遍历所有签到记录，统计每日签到次数
		this.attendanceRecords.forEach(record => {
			// 检查记录是否包含有效的日期时间字段
			if (!record.attendanceDateTime) {
				return
			}

			// 将日期时间字符串解析为Date对象
			const date = new Date(record.attendanceDateTime)

			// 检查日期是否有效(解析失败会返回Invalid Date)
			if (isNaN(date.getTime())) {
				return
			}

			// 提取日期部分(YYYY-MM-DD格式)
			const [dateStr] = date.toISOString().split('T')

			// 统计该日期的签到次数
			dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1)
		})

		// 对日期进行排序，确保折线图时间顺序正确
		const sortedDates = Array.from(dateMap.keys()).sort()

		// 获取每日签到次数数组
		const dailyValues = sortedDates.map(date => dateMap.get(date) || 0)

		// 计算累计签到次数
		let cumulativeSum = 0
		const cumulativeValues = dailyValues.map(value => {
			cumulativeSum += value
			return cumulativeSum
		})

		// 返回折线图数据
		return {
			dates: sortedDates,
			values: cumulativeValues
		}
	}

	/**
	 * 更新图表
	 * @private
	 * @description
	 * 更新ECharts图表配置并渲染
	 * 流程：
	 * 1. 检查chartInstance和chartContainer是否存在，不存在则初始化
	 * 2. 调用generateLineData()生成折线图数据
	 * 3. 构建ECharts配置对象option
	 * 4. 调用setOption()渲染图表
	 * 配置项包括：背景色、提示框、坐标轴、折线系列等
	 */
	private updateChart(): void {
		// 检查图表实例和容器是否存在，不存在则初始化
		if (!this.chartInstance || !this.chartContainer) {
			this.initChart()
			return
		}

		// 生成折线图数据
		const lineData = this.generateLineData()

		// 构建ECharts配置对象
		const option = {
			// 设置背景色为透明，使用外部CSS控制背景
			backgroundColor: 'transparent',

			// 提示框配置
			tooltip: {
				trigger: 'axis',						// 轴触发模式
				backgroundColor: this.themeStore.isDarkMode ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.9)',
				borderColor: '#ddd',
				textStyle: {
					// 根据主题设置文字颜色
					color: this.themeStore.isDarkMode ? '#000' : '#333'
				},
				// 自定义提示框内容格式
				formatter: (params: any) => {
					const date = new Date(params[0].axisValue)
					const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
					return `${formattedDate}<br/>累计签到次数: ${params[0].value}`
				}
			},

			// 网格布局配置
			grid: {
				left: '8%',							// 距离左侧8%
				right: '8%',							// 距离右侧8%
				bottom: '15%',						// 距离底部15%
				top: '15%',							// 距离顶部15%
				containLabel: true					// 包含标签
			},

			// X轴配置：时间轴
			xAxis: {
				type: 'time',							// 时间轴类型
				boundaryGap: false,						// 无边界间隙
				axisLabel: {
					// 根据主题设置坐标轴标签颜色
					color: this.themeStore.isDarkMode ? '#ccc' : '#666',
					fontSize: 11,
					rotate: 45,						// 旋转45度防止重叠
					// 自定义日期格式（月/日）
					formatter: (value: string | number | Date) => {
						const date = new Date(value)
						return `${date.getMonth() + 1}/${date.getDate()}`
					}
				},
				axisLine: {
					lineStyle: {
						// 根据主题设置坐标轴线颜色
						color: this.themeStore.isDarkMode ? '#444' : '#ddd'
					}
				},
				splitLine: {
					show: true,
					lineStyle: {
						// 根据主题设置分割线颜色
						color: this.themeStore.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
					}
				}
			},

			// Y轴配置：累计次数
			yAxis: {
				type: 'value',							// 数值轴类型
				name: '累计签到次数',						// 轴名称
				nameTextStyle: {
					// 根据主题设置轴名称颜色
					color: this.themeStore.isDarkMode ? '#ccc' : '#666',
					fontSize: 12
				},
				axisLabel: {
					// 根据主题设置坐标轴标签颜色
					color: this.themeStore.isDarkMode ? '#ccc' : '#666',
					fontSize: 11
				},
				axisLine: {
					lineStyle: {
						// 根据主题设置坐标轴线颜色
						color: this.themeStore.isDarkMode ? '#444' : '#ddd'
					}
				},
				splitLine: {
					lineStyle: {
						// 根据主题设置分割线颜色
						color: this.themeStore.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
					}
				}
			},

			// 图表系列配置
			series: [{
				name: '累计签到次数',						// 系列名称
				type: 'line',							// 折线图类型
				smooth: true,							// 平滑曲线
				symbol: 'circle',						// 标记点形状
				symbolSize: 6,							// 标记点大小
				lineStyle: {
					color: '#4fc3f7',					// 线条颜色
					width: 3						// 线条宽度
				},
				itemStyle: {
					color: '#4fc3f7',					// 标记点颜色
					borderColor: '#fff',					// 标记点边框颜色
					borderWidth: 2						// 标记点边框宽度
				},
				areaStyle: {
					// 区域填充样式（渐变）
					color: {
						type: 'linear',						// 线性渐变
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [{
							offset: 0,
							color: 'rgba(79, 195, 247, 0.3)'	// 顶部颜色
						}, {
							offset: 1,
							color: 'rgba(79, 195, 247, 0.05)'	// 底部颜色
						}]
					}
				},
				emphasis: {
					// 高亮样式
					itemStyle: {
						color: '#0288d1',					// 高亮标记点颜色
						borderColor: '#fff',
						borderWidth: 3,
						shadowBlur: 10,
						shadowColor: 'rgba(79, 195, 247, 0.5)'
					},
					lineStyle: {
						width: 4						// 高亮线条宽度
					}
				},
				// 数据格式：[日期, 累计次数]
				data: lineData.dates.map((date, index) => [date, lineData.values[index]])
			}]
		}

		// 应用配置并渲染图表
		this.chartInstance.setOption(option)
	}

	/**
	 * 销毁图表实例
	 * @function dispose
	 * @description
	 * 销毁ECharts图表实例，释放资源
	 * 在Vue组件的onUnmounted生命周期中调用
	 * 防止内存泄漏
	 */
	public dispose(): void {
		// 检查图表实例是否存在
		if (this.chartInstance) {
			// 调用ECharts的dispose方法销毁实例
			this.chartInstance.dispose()

			// 清空实例引用，避免内存泄漏
			this.chartInstance = null
		}
	}
}
