/**
 * 签到热力图组件TypeScript逻辑
 *
 * @description 签到热力图ECharts封装组件，负责数据处理和图表渲染
 * 该组件展示学生签到记录的热力图，按周几(周一到周日)和时段(上午/下午/晚上)统计签到次数
 * 数据从AttendancePageDesktop单例获取，确保全局数据一致性
 * @class AttendancePageHeatmapDesktopComponent
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
 * ECharts热力图图表类型导入
 * @description HeatmapChart用于渲染热力图
 */
import {HeatmapChart} from 'echarts/charts'

/**
 * ECharts组件导入
 * @description 
 * - CalendarComponent: 日历组件
 * - GridComponent: 网格组件
 * - LegendComponent: 图例组件
 * - TitleComponent: 标题组件
 * - TooltipComponent: 提示框组件
 * - VisualMapComponent: 视觉映射组件(用于热力图颜色映射)
 */
import {
	CalendarComponent,
	GridComponent,
	LegendComponent,
	TitleComponent,
	TooltipComponent,
	VisualMapComponent
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

// ===================== ECharts 组件注册 =====================
/**
 * ECharts组件注册
 * @description 注册热力图所需的所有ECharts组件，必须在初始化图表前完成注册
 * 使用echarts.use()方法注册组件，这是ECharts 5.0+的按需引入方式
 */
echarts.use([
	TitleComponent,		// 标题组件
	TooltipComponent,	// 提示框组件
	GridComponent,		// 网格组件
	LegendComponent,	// 图例组件
	CalendarComponent,	// 日历组件
	VisualMapComponent,	// 视觉映射组件
	HeatmapChart,		// 热力图图表
	CanvasRenderer		// Canvas渲染器
])

// ===================== 类定义区 =====================
/**
 * 签到热力图组件类
 * @class AttendancePageHeatmapDesktopComponent
 * @description 
 * 封装ECharts热力图的所有功能，包括：
 * 1. 数据加载：从AttendancePageDesktop单例获取签到记录
 * 2. 数据处理：按周几和时段统计签到次数
 * 3. 图表渲染：使用ECharts渲染热力图
 * 4. 主题适配：监听主题变化，自动切换暗黑/亮色模式
 * 5. 生命周期管理：提供dispose方法销毁图表实例
 */
export default class AttendancePageHeatmapDesktopComponent {
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
	 * 在loadData()方法中赋值，在generateHeatmapData()方法中使用
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
	 * heatmapComponent.chartRef = chartRef
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
			// 等待单例数据初始化完成
			await attendancePageDesktop.waitForReady()
			this.attendanceRecords = attendancePageDesktop.getAttendanceRecords()
			this.initChart()
			this.updateChart()
		} catch (error) {
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
		if (!this.chartRef.value) {
			return
		}

		this.chartContainer = this.chartRef.value
		this.chartInstance = echarts.init(this.chartContainer)
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
		watch(() => this.themeStore.isDarkMode, () => {
			this.updateChart()
		})
	}

	/**
	 * 生成热力图所需数据
	 * @private
	 * @returns {Array<[number, number, number]>} 热力图数据数组
	 * @description 
	 * 将签到记录按周几和时段统计，生成热力图数据
	 * 数据结构：[周几索引, 时段索引, 签到次数]
	 * 周几索引：0=周一, 1=周二, ..., 6=周日
	 * 时段索引：0=上午(8-11点), 1=下午(14-17点), 2=晚上(19-22点)
	 * @example
	 * // 返回数据示例
	 * [[0, 0, 5], [0, 1, 3], [0, 2, 2], ...] // 周一上午5次，下午3次，晚上2次
	 */
	private generateHeatmapData(): [number, number, number][] {
		const data: [number, number, number][] = []
		const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
		const timeSlots = ['上午', '下午', '晚上']

		weekDays.forEach((_day, dayIndex) => {
			timeSlots.forEach((slot, slotIndex) => {
				let count = 0
				this.attendanceRecords.forEach(record => {
					if (!record.attendanceDateTime) {
						return
					}
					const date = new Date(record.attendanceDateTime)
					if (isNaN(date.getTime())) {
						return
					}
					const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1
					const hour = date.getHours()

					if (dayOfWeek === dayIndex) {
						if (slot === '上午' && hour >= 8 && hour < 11) {
							count += 1
						} else if (slot === '下午' && hour >= 14 && hour < 17) {
							count += 1
						} else if (slot === '晚上' && hour >= 19 && hour < 22) {
							count += 1
						}
					}
				})
				data.push([dayIndex, slotIndex, count])
			})
		})

		return data
	}

	/**
	 * 更新图表
	 * @private
	 * @description 
	 * 更新ECharts图表配置并渲染
	 * 流程：
	 * 1. 检查chartInstance和chartContainer是否存在，不存在则初始化
	 * 2. 调用generateHeatmapData()生成热力图数据
	 * 3. 计算最大值用于视觉映射
	 * 4. 构建ECharts配置对象option
	 * 5. 调用setOption()渲染图表
	 * 配置项包括：背景色、坐标轴、视觉映射、热力图系列等
	 */
	private updateChart(): void {
		if (!this.chartInstance || !this.chartContainer) {
			this.initChart()
			return
		}

		const heatmapData = this.generateHeatmapData()
		const maxValue = Math.max(...heatmapData.map(item => item[2]), 1)

		const option = {
			backgroundColor: 'transparent',
			tooltip: {
				show: false
			},
			grid: {
				height: '60%',
				top: '15%',
				left: '10%',
				right: '10%',
				bottom: '20%'
			},
			xAxis: {
				type: 'category',
				data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
				splitArea: {
					show: true,
					areaStyle: {
						color: this.themeStore.isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
					}
				},
				axisLabel: {
					color: this.themeStore.isDarkMode ? '#ccc' : '#666',
					fontSize: 12
				},
				axisLine: {
					lineStyle: {
						color: this.themeStore.isDarkMode ? '#444' : '#ddd'
					}
				}
			},
			yAxis: {
				type: 'category',
				data: ['上午', '下午', '晚上'],
				splitArea: {
					show: true,
					areaStyle: {
						color: this.themeStore.isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
					}
				},
				axisLabel: {
					color: this.themeStore.isDarkMode ? '#ccc' : '#666',
					fontSize: 12
				},
				axisLine: {
					lineStyle: {
						color: this.themeStore.isDarkMode ? '#444' : '#ddd'
					}
				}
			},
			visualMap: {
				min: 0,
				max: maxValue,
				calculable: false,
				orient: 'horizontal',
				left: 'center',
				bottom: '5%',
				itemWidth: 20,
				itemHeight: 200,
				textStyle: {
					color: this.themeStore.isDarkMode ? '#ccc' : '#666',
					fontSize: 11
				},
				inRange: {
					color: this.themeStore.isDarkMode
						? ['#6fd4cd', '#3CBDB1', '#238e8c', '#1a6967', '#134442', '#0a1f1d']
						: ['#e6f7f6', '#b3e8e4', '#80d9d2', '#4dcac0', '#3CBDB1', '#2A5C58']
				}
			},
			series: [{
				name: '签到次数',
				type: 'heatmap',
				data: heatmapData,
				label: {
					show: true,
					color: this.themeStore.isDarkMode ? '#ffffff' : '#1f2937',
					fontSize: 11,
					fontWeight: 'bold'
				},
				emphasis: {
					itemStyle: {
						shadowBlur: 15,
						shadowColor: 'rgba(0, 0, 0, 0.3)',
						borderWidth: 2,
						borderColor: '#fff'
					}
				},
				itemStyle: {
					borderRadius: 4,
					borderWidth: 1,
					borderColor: this.themeStore.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
				}
			}]
		}

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
		if (this.chartInstance) {
			this.chartInstance.dispose()
			this.chartInstance = null
		}
	}
}
