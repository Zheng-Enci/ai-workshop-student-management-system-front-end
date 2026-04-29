/**
 * 签到热力图组件TypeScript逻辑
 *
 * @description 签到热力图ECharts封装组件，负责数据处理和图表渲染
 * @class AttendancePageHeatmapDesktopComponent
 * @author ZhengEnCi zheng_enci_work@foxmail.com
 * @date 2026-01
 * @version 1.0.0
 */

// ===================== 第三方依赖导入区 =====================
import {ref, type Ref, watch} from 'vue'
import * as echarts from 'echarts/core'
import {HeatmapChart} from 'echarts/charts'
import {
	CalendarComponent,
	GridComponent,
	LegendComponent,
	TitleComponent,
	TooltipComponent,
	VisualMapComponent
} from 'echarts/components'
import {CanvasRenderer} from 'echarts/renderers'
import {useThemeStore} from '@/stores/ts/theme'
import attendancePageDesktop, {type AttendanceRecord} from './AttendancePageDesktop'

// ===================== ECharts 组件注册 =====================
echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	CalendarComponent,
	VisualMapComponent,
	HeatmapChart,
	CanvasRenderer
])

// ===================== 类定义区 =====================
/**
 * 签到热力图组件类
 * @class AttendancePageHeatmapDesktopComponent
 */
export default class AttendancePageHeatmapDesktopComponent {
	/**
	 * ECharts实例
	 * @private
	 */
	private chartInstance: echarts.ECharts | null = null

	/**
	 * DOM容器引用
	 * @private
	 */
	private chartContainer: HTMLElement | null = null

	/**
	 * 签到记录数据
	 * @private
	 */
	private attendanceRecords: AttendanceRecord[] = []

	/**
	 * 主题Store
	 * @private
	 */
	private themeStore = useThemeStore()

	/**
	 * 图表容器引用（外部传入）
	 * @public
	 */
	public chartRef: Ref<HTMLElement | null> = ref(null)

	/**
	 * 构造函数
	 * @constructor
	 */
	constructor() {
		this.watchTheme()
	}

	/**
	 * 加载签到记录数据
	 * @public
	 * @async
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
	 */
	public dispose(): void {
		if (this.chartInstance) {
			this.chartInstance.dispose()
			this.chartInstance = null
		}
	}
}
