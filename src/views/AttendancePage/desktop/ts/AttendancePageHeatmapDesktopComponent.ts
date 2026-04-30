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
		// 初始化热力图数据数组，存储[周几索引, 时段索引, 签到次数]三元组
		const data: [number, number, number][] = []

		// 定义周几标签，用于遍历和显示
		const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

		// 定义时段标签，用于遍历和显示
		const timeSlots = ['上午', '下午', '晚上']

		// 遍历每一天(周一到周日)
		weekDays.forEach((_day, dayIndex) => {
			// 遍历每个时段(上午/下午/晚上)
			timeSlots.forEach((slot, slotIndex) => {
				// 初始化当前时段的签到次数计数器
				let count = 0

				// 遍历所有签到记录，统计符合条件的记录数
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

					// 获取周几，JavaScript的getDay()返回0-6(0=周日)
					// 转换为0-6(0=周一, 6=周日)的格式
					const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1

					// 获取小时数，用于判断时段
					const hour = date.getHours()

					// 检查是否匹配当前遍历的周几
					if (dayOfWeek === dayIndex) {
						// 检查是否匹配当前遍历的时段
						if (slot === '上午' && hour >= 8 && hour < 11) {
							// 上午时段：8点到11点
							count += 1
						} else if (slot === '下午' && hour >= 14 && hour < 17) {
							// 下午时段：14点到17点
							count += 1
						} else if (slot === '晚上' && hour >= 19 && hour < 22) {
							// 晚上时段：19点到22点
							count += 1
						}
					}
				})

				// 将统计结果添加到数据数组
				data.push([dayIndex, slotIndex, count])
			})
		})

		// 返回生成的热力图数据
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
		// 检查图表实例和容器是否存在，不存在则初始化
		if (!this.chartInstance || !this.chartContainer) {
			this.initChart()
			return
		}

		// 生成热力图数据
		const heatmapData = this.generateHeatmapData()

		// 计算数据最大值，用于视觉映射的颜色范围
		// 使用Math.max确保最大值至少为1，避免全为0时视觉映射异常
		const maxValue = Math.max(...heatmapData.map(item => item[2]), 1)

		// 计算数据最小值，用于视觉映射的颜色范围
		const minValue = Math.min(...heatmapData.map(item => item[2]), maxValue)


		// 构建ECharts配置对象
		const option = {
			// 设置背景色为透明，使用外部CSS控制背景
			backgroundColor: 'transparent',

			// 禁用提示框，热力图不需要显示详细提示
			tooltip: {
				show: false
			},

			// 网格配置，控制图表在容器中的位置和大小
			grid: {
				height: '60%',		// 图表高度占容器的60%
				top: '15%',			// 距离顶部15%
				left: '10%',			// 距离左侧10%
				right: '10%',		// 距离右侧10%
				bottom: '20%'		// 距离底部20%
			},

			// X轴配置，显示周一到周日
			xAxis: {
				type: 'category',					// 类目轴，用于显示离散的周几
				data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
				splitArea: {
					show: true,						// 显示分隔区域
					areaStyle: {
						// 根据主题设置分隔区域背景色
						color: this.themeStore.isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
					}
				},
				axisLabel: {
					// 根据主题设置坐标轴标签颜色
					color: this.themeStore.isDarkMode ? '#ccc' : '#666',
					fontSize: 12
				},
				axisLine: {
					lineStyle: {
						// 根据主题设置坐标轴线颜色
						color: this.themeStore.isDarkMode ? '#444' : '#ddd'
					}
				}
			},

			// Y轴配置，显示上午/下午/晚上
			yAxis: {
				type: 'category',					// 类目轴
				data: ['上午', '下午', '晚上'],
				splitArea: {
					show: true,
					areaStyle: {
						// 根据主题设置分隔区域背景色
						color: this.themeStore.isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
					}
				},
				axisLabel: {
					// 根据主题设置坐标轴标签颜色
					color: this.themeStore.isDarkMode ? '#ccc' : '#666',
					fontSize: 12
				},
				axisLine: {
					lineStyle: {
						// 根据主题设置坐标轴线颜色
						color: this.themeStore.isDarkMode ? '#444' : '#ddd'
					}
				}
			},

			// 视觉映射组件配置，控制热力图的颜色映射
			visualMap: {
				min: minValue,						// 最小值
				max: maxValue,						// 最大值
				calculable: true,					// 禁用拖拽选择范围
				orient: 'horizontal',				// 水平方向显示
				left: 'center',						// 水平居中
				bottom: '5%',						// 距离底部5%
				itemWidth: 20,						// 图例项宽度
				itemHeight: 200,					// 图例项高度
				textStyle: {
					// 根据主题设置文字颜色
					color: this.themeStore.isDarkMode ? '#ccc' : '#666',
					fontSize: 11
				},
				inRange: {
					// 根据主题设置颜色范围
					color: this.themeStore.isDarkMode
						? ['#6fd4cd', '#3CBDB1', '#238e8c', '#1a6967', '#134442', '#0a1f1d']	// 暗黑模式：冰川青渐变
						: ['#e6f7f6', '#b3e8e4', '#80d9d2', '#4dcac0', '#3CBDB1', '#2A5C58']		// 亮色模式：浅青到深青
				}
			},

			// 图表系列配置
			series: [{
				name: '签到次数',					// 系列名称
				type: 'heatmap',						// 图表类型为热力图
				data: heatmapData,					// 热力图数据
				label: {
					show: true,							// 显示标签
					// 根据主题设置标签颜色
					color: this.themeStore.isDarkMode ? '#ffffff' : '#1f2937',
					fontSize: 16,
					fontWeight: 'bold'				// 标签字体加粗
				},
				emphasis: {
					// 高亮样式配置
					itemStyle: {
						shadowBlur: 15,					// 阴影模糊度
						shadowColor: 'rgba(0, 0, 0, 0.3)',	// 阴影颜色
						borderWidth: 2,					// 边框宽度
						borderColor: '#fff'				// 边框颜色
					}
				},
				itemStyle: {
					borderRadius: 10,					// 圆角半径
					borderWidth: 1,						// 边框宽度
					// 根据主题设置边框颜色
					borderColor: this.themeStore.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
				}
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
