import * as echarts from 'echarts/core'
import {LineChart} from 'echarts/charts'
import {GridComponent, TitleComponent, TooltipComponent, LegendComponent, MarkLineComponent} from 'echarts/components'
import {CanvasRenderer} from 'echarts/renderers'
import type {EChartsOption} from 'echarts'
import type {Ref} from 'vue'
import AttendanceApi from '../../../api/ts/AttendanceApi'

echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	MarkLineComponent,
	LineChart,
	CanvasRenderer
])

interface DateRange {
	startDate: string
	endDate: string
}

function getDateRange(timeRange: string): DateRange {
	const now = new Date()
	const endDate = formatDate(now)
	const minDate = new Date(2025, 8, 10)
	let startDate: Date

	switch (timeRange) {
		case '最近一天':
			startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
			break;
		case '七天':
		case '最近七天':
			startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
			break;
		case '三十天':
		case '最近三十天':
			startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
			break;
		case '三个月':
		case '最近三个月':
			startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
			break;
		case '半年':
		case '最近半年':
			startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
			break;
		case '一年':
		case '最近一年':
			startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
			break;
		case '全部':
			startDate = new Date(2025, 8, 10);
			break;
		default:
			startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
	}

	if (startDate < minDate) {
		startDate = minDate
	}

	return {
		startDate: formatDate(startDate),
		endDate: endDate
	}
}

function formatDate(date: Date): string {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

function calculateMovingAverage(values: number[], windowSize: number = 7): number[] {
	const result: number[] = []
	for (let i = 0; i < values.length; i++) {
		if (i < windowSize - 1) {
			result.push(values[i])
		} else {
			const sum = values.slice(i - windowSize + 1, i + 1).reduce((a, b) => a + b, 0)
			result.push(sum / windowSize)
		}
	}
	return result
}

function calculateLinearTrend(values: number[]): number[] {
	const n = values.length
	if (n < 2) return values

	const xMean = (n - 1) / 2
	const yMean = values.reduce((a, b) => a + b, 0) / n

	let numerator = 0
	let denominator = 0

	for (let i = 0; i < n; i++) {
		numerator += (i - xMean) * (values[i] - yMean)
		denominator += (i - xMean) * (i - xMean)
	}

	const slope = denominator === 0 ? 0 : numerator / denominator
	const intercept = yMean - slope * xMean

	return values.map((_, i) => slope * i + intercept)
}

class AttendanceTrendChart {
	private instance: echarts.ECharts | null = null

	constructor(private containerRef: Ref<HTMLElement | null>, private isDark: Ref<boolean>) {}

	init() {
		if (!this.containerRef.value) return

		if (this.instance) {
			this.instance.dispose()
		}

		this.instance = echarts.init(this.containerRef.value)
	}

	setOption(dates: string[], values: number[]) {
		if (!this.instance) return

		const smoothValues = calculateMovingAverage(values, 7)
		const trendLineValues = calculateLinearTrend(values)

		const maxValue = Math.max(...values)
		const maxIndex = values.indexOf(maxValue)
		const maxDate = dates[maxIndex]

		const option: EChartsOption = {
			backgroundColor: 'transparent',
			legend: {
				data: ['签到人次', '7天滚动平均', '趋势线'],
				top: 10,
				itemWidth: 20,
				itemHeight: 10,
				textStyle: {
					color: this.isDark.value ? '#ccc' : '#666'
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				top: '15%',
				bottom: '3%',
				containLabel: true
			},
			tooltip: {
				trigger: 'axis',
				backgroundColor: this.isDark.value ? 'rgba(50, 50, 50, 0.9)' : 'rgba(255, 255, 255, 0.9)',
				borderColor: this.isDark.value ? '#444' : '#ddd',
				textStyle: {
					color: this.isDark.value ? '#ccc' : '#666'
				},
				axisPointer: {
					type: 'line',
					lineStyle: {
						color: this.isDark.value ? '#666' : '#999'
					}
				}
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: dates,
				axisLabel: {
					color: this.isDark.value ? '#ccc' : '#666',
					fontSize: 12
				},
				axisLine: {
					lineStyle: {
						color: this.isDark.value ? '#444' : '#ddd'
					}
				}
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					color: this.isDark.value ? '#ccc' : '#666',
					fontSize: 12
				},
				axisLine: {
					lineStyle: {
						color: this.isDark.value ? '#444' : '#ddd'
					}
				},
				splitLine: {
					lineStyle: {
						color: this.isDark.value ? '#333' : '#eee'
					}
				}
			},
			series: [
				{
					name: '签到人次',
					type: 'line',
					data: values,
					smooth: true,
					lineStyle: {
						color: '#667eea',
						width: 3
					},
					areaStyle: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{ offset: 0, color: 'rgba(102, 126, 234, 0.3)' },
								{ offset: 1, color: 'rgba(102, 126, 234, 0.1)' }
							]
						}
					},
					itemStyle: { color: '#667eea' },
					markLine: {
						silent: true,
						symbol: 'none',
						data: [
							{
								type: 'max',
								name: '最高签到',
								lineStyle: {
									color: this.isDark.value ? '#f50' : '#ff4400',
									type: 'dashed',
									width: 2
								},
								label: {
									formatter: `${maxValue} 人次`,
									position: 'end',
									color: this.isDark.value ? '#f50' : '#ff4400'
								}
							}
						]
					}
				},
				{
					name: '7天滚动平均',
					type: 'line',
					data: smoothValues,
					smooth: true,
					lineStyle: { color: this.isDark.value ? '#ff7875' : '#ff4d4f', width: 3, type: 'dashed' },
					itemStyle: { color: this.isDark.value ? '#ff7875' : '#ff4d4f' },
					symbol: 'none'
				},
				{
					name: '趋势线',
					type: 'line',
					data: trendLineValues,
					smooth: false,
					lineStyle: { color: this.isDark.value ? '#52c41a' : '#389e0d', width: 2 },
					itemStyle: { color: this.isDark.value ? '#52c41a' : '#389e0d' },
					symbol: 'none'
				}
			]
		}

		this.instance.setOption(option)
	}

	resize() {
		if (this.instance) {
			this.instance.resize()
		}
	}

	dispose() {
		if (this.instance) {
			this.instance.dispose()
			this.instance = null
		}
	}
}

export default AttendanceTrendChart
export { getDateRange, getAttendanceTrendData }

/**
 * 获取指定日期的签到人数
 * @param date - 指定日期，格式为 'YYYY-MM-DD'，默认为今天
 * @returns 签到人数
 */
async function getAttendanceCountByDate(date?: string): Promise<number> {
	try {
		return await AttendanceApi.getTodayAttendanceCount(date)
	} catch (error: any) {
		throw error
	}
}

/**
 * 获取指定时间范围内的签到趋势数据
 * @param startDate - 开始日期，格式为 'YYYY-MM-DD'
 * @param endDate - 结束日期，格式为 'YYYY-MM-DD'
 * @returns 包含日期和签到人数的列表
 */
async function getAttendanceTrendData(startDate: string, endDate: string): Promise<{ date: string; count: number }[]> {
	const dates: string[] = []
	const currentDate = new Date(startDate)

	while (currentDate <= new Date(endDate)) {
		const dateStr = formatDate(currentDate)
		dates.push(dateStr)
		currentDate.setDate(currentDate.getDate() + 1)
	}

	const results: { date: string; count: number }[] = []
	const batchSize = 64
	for (let i = 0; i < dates.length; i += batchSize) {
		const batch = dates.slice(i, i + batchSize)
		const batchResults = await Promise.all(
			batch.map(async (date) => {
				try {
					const count = await getAttendanceCountByDate(date)
					return { date, count }
				} catch (error) {
					return { date, count: 0 }
				}
			})
		)
		results.push(...batchResults)
	}

	return results
}
