import {ref} from 'vue'
import * as echarts from 'echarts'
import type {ECharts} from 'echarts'

interface ChartProps {
	fangIPs?: string[]
	ipCounts?: Record<string, number>
	isDark?: boolean
}

export class IPLineChartDesktop {
	private props: ChartProps
	private chartRef: ReturnType<typeof ref<HTMLDivElement | null>>
	private chartInstance: ECharts | null = null

	constructor(props: ChartProps) {
		this.props = props
		this.chartRef = ref<HTMLDivElement | null>(null)
	}

	set ref(val: HTMLDivElement | null) {
		this.chartRef.value = val
	}

	private get chartData(): {ip: string; count: number}[] {
		const data: {ip: string; count: number}[] = []
		const ipCounts = this.props.ipCounts
		if (!ipCounts) {
			return data
		}
		Object.keys(ipCounts).forEach((ip) => {
			const count = ipCounts[ip] || 0
			data.push({ip, count})
		})
		return data.sort((a, b) => a.count - b.count)
	}

	private getThemeColors() {
		return {
			textColor: this.props.isDark ? '#e0e0e0' : '#333333',
			gridColor: this.props.isDark ? '#333333' : '#e0e0e0',
			lineColor: this.props.isDark ? '#5bdae2' : '#1a9e9a'
		}
	}

	private initChart(): void {
		if (!this.chartRef.value) {
			return
		}
		this.chartInstance = echarts.init(this.chartRef.value)
		this.updateChart()
	}

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
				backgroundColor: this.props.isDark ? '#1a1a1a' : '#ffffff',
				borderColor: this.props.isDark ? '#5bdae2' : '#1a9e9a',
				borderWidth: 1,
				padding: [10, 15],
				textStyle: {
					color: this.props.isDark ? '#ffffff' : '#333333',
					fontSize: 14
				},
				extraCssText: this.props.isDark
					? 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);'
					: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);',
				formatter: (params: unknown) => {
					const p = params as {name: string; value: number}[]
					if (p && p[0]) {
						const ipColor = this.props.isDark ? '#5bdae2' : '#1a9e9a'
						return `<div style="font-weight: 500;">
							<div style="margin-bottom: 5px;">
								<span style="color: ${ipColor};">●</span>
								<span style="color: ${this.props.isDark ? '#ffffff' : '#333333'};">IP: ${p[0].name}</span>
							</div>
							<div>
								<span style="color: ${ipColor};">●</span>
								<span style="color: ${this.props.isDark ? '#ffffff' : '#333333'};">次数: ${p[0].value}</span>
							</div>
						</div>`
					}
					return ''
				}
			},
			grid: {
				left: '3%',
				right: '4%',
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
					rotate: 45,
					fontSize: 9,
					interval: 0,
					overflow: 'none'
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
								color: this.props.isDark ? 'rgba(91, 217, 212, 0.4)' : 'rgba(26, 158, 154, 0.4)'
							},
							{
								offset: 1,
								color: this.props.isDark ? 'rgba(91, 217, 212, 0.05)' : 'rgba(26, 158, 154, 0.05)'
							}
						])
					}
				}
			]
		}

		this.chartInstance.setOption(option)
	}

	public mount(): void {
		this.initChart()
		window.addEventListener('resize', this.handleResize)
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

	public unmount(): void {
		if (this.chartInstance) {
			this.chartInstance.dispose()
			this.chartInstance = null
		}
		window.removeEventListener('resize', this.handleResize)
	}

	private handleResize = (): void => {
		if (this.chartInstance) {
			this.chartInstance.resize()
		}
	}
}

export default IPLineChartDesktop
