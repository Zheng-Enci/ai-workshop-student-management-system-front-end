/**
 * 人工智能创作坊学生管理仪表盘 - 桌面端核心逻辑类
 *
 * @class DashboardPageDesktop
 * @description 封装桌面端仪表盘的所有业务逻辑，包括数据可视化、图表渲染、时间筛选、验证码管理等功能
 */
import { ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { PieChart, BarChart } from 'echarts/charts'
import {
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import 'echarts-wordcloud'
import VerificationCode from './verificationCode'
import DashboardDataLoader from '@/views/DashboardPage/common/ts/DashboardDataLoader'
import { useThemeStore } from '@/stores/theme'
import { useLoadingMaskStore } from '@/stores/ts/loading'

export default class DashboardPageDesktop {
	/**
	 * 路由实例
	 * @private
	 */
	private router: ReturnType<typeof useRouter>

	/**
	 * 主题状态仓库实例
	 * @private
	 */
	private themeStore: ReturnType<typeof useThemeStore>

	/**
	 * 全局加载蒙版 Store
	 * @private
	 */
	private loadingMaskStore: ReturnType<typeof useLoadingMaskStore>

	/**
	 * ECharts DOM容器引用（模板ref绑定）
	 * @public
	 */
	public gradeChart = ref(null)
	public majorChart = ref(null)
	public attendanceChart = ref(null)

	/**
	 * 进度条宽度（用于页面加载动画）
	 * @public
	 */
	public progressWidth = ref(0)

	/**
	 * 当前二维码类型：website-签到入口 / wechat-公众号
	 * @public
	 */
	public currentQRType = ref('website')

	/**
	 * 进度条定时器（页面加载动画）
	 * @private
	 */
	private progressInterval: any = null

	/**
	 * 核心业务数据响应式存储
	 * @public
	 */
	public topStudents = ref([])
	public totalStudents = ref(0)
	public todayCount = ref(0)
	public dailyAvgAttendance = ref(0)
	public attendanceRate = ref(0)
	public monthlyAttendanceCount = ref(0)
	public workshopMembersCount = ref(0)
	public levelStats = ref({
		admin: 0,
		core: 0,
		normal: 0
	})
	public clubMembers = ref(0)

	/**
	 * 时间范围筛选相关
	 * @public
	 */
	public selectedTimeRange = ref('week')

	/**
	 * 时间范围选项配置（过滤/展示用）
	 * @public
	 */
	public timeRangeOptions = [
		{ label: '本周', value: 'week' },
		{ label: '本月', value: 'month' },
		{ label: '今日', value: 'today' },
		{ label: '最近7天', value: 'last7days' },
		{ label: '最近30天', value: 'last30days' },
		{ label: '全部', value: 'all' }
	]

	/**
	 * ECharts 实例存储（用于销毁/重置）
	 * @private
	 */
	private gradeChartInstance: any = null
	private majorChartInstance: any = null
	private attendanceChartInstance: any = null

	/**
	 * 数据加载器实例
	 * @private
	 */
	private dataLoader: DashboardDataLoader

	/**
	 * 构造函数
	 * @constructor
	 * @description 初始化路由、主题Store和加载蒙版Store
	 */
	constructor() {
		this.router = useRouter()
		this.themeStore = useThemeStore()
		this.loadingMaskStore = useLoadingMaskStore()

		// 监听主题变化，重新渲染图表
		watch(() => this.themeStore.isDarkMode, () => {
			this.initCharts()
		})

		// 注册 ECharts 组件和图表
		echarts.use([
			PieChart,
			BarChart,
			TitleComponent,
			TooltipComponent,
			GridComponent,
			LegendComponent,
			CanvasRenderer
		])

		this.dataLoader = new DashboardDataLoader(
			this.topStudents,
			this.totalStudents,
			this.todayCount,
			this.dailyAvgAttendance,
			this.monthlyAttendanceCount,
			this.levelStats,
			this.selectedTimeRange,
			this.clubMembers,
			this.workshopMembersCount
		)
	}

	// ======================== 公共方法 ========================

	/**
	 * 返回上一级页面（导航页）
	 * @public
	 * @method goBack
	 * @returns {void}
	 */
	public goBack(): void {
		this.router.push('/navigation')
	}

	/**
	 * 保存用户偏好设置到本地存储
	 * 存储内容：选中的时间范围
	 * @public
	 * @method saveUserPreferences
	 * @returns {void}
	 */
	public saveUserPreferences(): void {
		this.dataLoader.saveUserPreferences({
			timeRange: this.selectedTimeRange.value
		})
	}

	/**
	 * 从本地存储加载用户偏好设置
	 * 若无存储或解析失败，使用默认值'week'
	 * @public
	 * @method loadUserPreferences
	 * @returns {void}
	 */
	public loadUserPreferences(): void {
		const preferences = this.dataLoader.loadUserPreferences()
		this.selectedTimeRange.value = preferences.timeRange
	}

	/**
	 * 切换二维码展示类型
	 * 切换逻辑：website ↔ wechat
	 * @public
	 * @method switchQRType
	 * @returns {void}
	 */
	public switchQRType(): void {
		this.currentQRType.value = this.currentQRType.value === 'website' ? 'wechat' : 'website'
	}

	/**
	 * 切换主题
	 * @public
	 * @method toggleTheme
	 * @returns {void}
	 */
	public toggleTheme(): void {
		this.themeStore.toggleTheme()
	}

	/**
	 * 获取验证码管理实例
	 * @public
	 * @method getVerificationCode
	 * @returns VerificationCode 实例
	 */
	public getVerificationCode(): VerificationCode {
		return VerificationCode
	}

	// ======================== 核心算法/工具函数 ========================

	// ======================== ECharts 初始化函数 ========================

	/**
	 * 初始化年级分布饼图
	 * @public
	 * @method initGradeChart
	 * @param data - 年级统计数据 [{grade: 年级, count: 人数}, ...]
	 * @returns {void}
	 */
	public initGradeChart(data: Array<{ grade: number; count: number }>): void {
		if (!this.gradeChart.value) {
			return
		}

		if (this.gradeChartInstance) {
			this.gradeChartInstance.dispose()
		}

		this.gradeChartInstance = echarts.init(this.gradeChart.value)

		const sortedData = [...data].sort((a, b) => a.grade - b.grade)
		const isDark = this.themeStore.isDarkMode

		const option = {
			backgroundColor: 'transparent',
			tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b}: {c} ({d}%)',
				backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
				borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
				textStyle: {
					color: isDark ? '#ffffff' : '#2c3e50'
				}
			},
			legend: {
				orient: 'vertical',
				left: 'left',
				data: sortedData.map(item => `${item.grade}年级`),
				textStyle: {
					color: isDark ? '#ffffff' : '#2c3e50'
				}
			},
			series: [{
				name: '年级分布',
				type: 'pie',
				radius: ['40%', '70%'],
				center: ['50%', '50%'],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 10,
					borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : '#fff',
					borderWidth: 2
				},
				label: {
					show: false,
					position: 'center',
					color: isDark ? '#ffffff' : '#2c3e50'
				},
				emphasis: {
					label: {
						show: true,
						fontSize: '18',
						fontWeight: 'bold',
						color: isDark ? '#ffffff' : '#2c3e50'
					}
				},
				labelLine: {
					show: false
				},
				data: sortedData.map(item => ({
					value: item.count,
					name: `${item.grade}年级`
				}))
			}]
		}

		this.gradeChartInstance.setOption(option)
	}

	/**
	 * 初始化专业分布词云图
	 * @public
	 * @method initMajorChart
	 * @param data - 专业统计数据 [{major: 专业名称, count: 人数}, ...]
	 * @returns {void}
	 */
	public initMajorChart(data: Array<{ major: string; count: number }>): void {
		if (!this.majorChart.value) {
			return
		}

		if (this.majorChartInstance) {
			this.majorChartInstance.dispose()
		}

		this.majorChartInstance = echarts.init(this.majorChart.value)

		const sortedData = [...data].sort((a, b) => b.count - a.count)
		const isDark = this.themeStore.isDarkMode

		// 缓存颜色方法，避免在ECharts配置中使用this
		const getStableColor = (index: number): string => {
			const colors: string[] = [
				'#667eea', '#764ba2', '#f093fb', '#f5576c',
				'#4facfe', '#00f2fe', '#a8edea', '#fed6e3',
				'#ff9a9e', '#fecfef', '#fecfef', '#a8edea',
				'#d299c2', '#fad0c4', '#ffd1ff', '#a8e6cf'
			]
			return colors[index % colors.length]
		}

		const getDarkStableColor = (index: number): string => {
			const colors: string[] = [
				'#00d4ff', '#ff6b6b', '#4ecdc4', '#45b7d1',
				'#96ceb4', '#feca57', '#ff9ff3', '#54a0ff',
				'#5f27cd', '#00d2d3', '#ff9f43', '#10ac84',
				'#ee5a24', '#0984e3', '#6c5ce7', '#a29bfe'
			]
			return colors[index % colors.length]
		}

		const wordCloudData = sortedData.map((item, index) => ({
			name: item.major,
			value: item.count,
			textStyle: {
				color: isDark ? getDarkStableColor(index) : getStableColor(index)
			}
		}))

		const option = {
			backgroundColor: 'transparent',
			tooltip: {
				trigger: 'item',
				formatter: '{b}: {c}人',
				backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
				borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
				textStyle: {
					color: isDark ? '#ffffff' : '#2c3e50'
				}
			},
			series: [{
				type: 'wordCloud',
				gridSize: 1,
				sizeRange: [16, 50],
				rotationRange: [0, 0],
				rotationStep: 0,
				shape: 'circle',
				width: '100%',
				height: '100%',
				left: 'center',
				top: 'center',
				right: null,
				bottom: null,
				layoutAnimation: false,
				shrinkToFit: true,
				drawOutOfBound: false,
				random() {
					return 0.5
				},
				textStyle: {
					fontFamily: 'Microsoft YaHei, sans-serif',
					fontWeight: 'bold',
					color(params) {
						return isDark ? getDarkStableColor(params.dataIndex) : getStableColor(params.dataIndex)
					}
				},
				emphasis: {
					textStyle: {
						shadowBlur: 10,
						shadowColor: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)'
					}
				},
				data: wordCloudData
			}]
		}

		this.majorChartInstance.setOption(option)
	}

	/**
	 * 初始化签到排行榜柱状图
	 * @public
	 * @method initAttendanceChart
	 * @param data - 学生签到数据 [{name: 姓名, grade: 年级, major: 专业, attendanceCount: 签到数, levelName: 等级名称}, ...]
	 * @returns {void}
	 */
	public initAttendanceChart(data: Array<{ name: string; grade: number; major: string; attendanceCount: number; levelName: string }>): void {
		if (!this.attendanceChart.value) {
			return
		}

		if (this.attendanceChartInstance) {
			this.attendanceChartInstance.dispose()
			this.attendanceChartInstance = null
		}
		this.attendanceChartInstance = echarts.init(this.attendanceChart.value)

		const sortedData = [...data].sort((a, b) => b.attendanceCount - a.attendanceCount)
		const isDark = this.themeStore.isDarkMode

		// 缓存 sortedData 以供 ECharts formatter 使用
		const cachedSortedData = sortedData

		const option = {
			animation: true,
			animationDuration: 750,
			animationDurationUpdate: 750,
			animationEasing: 'cubicOut',
			animationEasingUpdate: 'cubicOut',
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				},
				backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
				borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
				textStyle: {
					color: isDark ? '#ffffff' : '#2c3e50'
				},
				formatter(params) {
					if (!params || !params[0] || !cachedSortedData[params[0].dataIndex]) {
						return ''
					}
					const itemData = cachedSortedData[params[0].dataIndex]
					return `${itemData.name} (${itemData.levelName})\n${itemData.grade}年级 - ${itemData.major}\n签到次数: ${itemData.attendanceCount}次`
				}
			},
			grid: {
				left: '0%',
				right: '20%',
				bottom: '3%',
				top: '0%',
				containLabel: true
			},
			xAxis: {
				type: 'value',
				max: cachedSortedData.length > 0 ? cachedSortedData[0].attendanceCount : null,
				axisLabel: {
					fontSize: 11,
					formatter: '{value}次',
					color: isDark ? '#ffffff' : '#2c3e50'
				},
				axisLine: {
					lineStyle: {
						color: isDark ? '#ffffff' : '#2c3e50'
					}
				}
			},
			yAxis: {
				type: 'category',
				inverse: true,
				data: cachedSortedData.map(item => `${item.name} (${item.levelName})`),
				axisLabel: {
					interval: 0,
					fontSize: 11,
					color: isDark ? '#ffffff' : '#2c3e50'
				},
				axisLine: {
					lineStyle: {
						color: isDark ? '#ffffff' : '#2c3e50'
					}
				}
			},
			series: [{
				name: '签到次数',
				type: 'bar',
				data: cachedSortedData.map(item => item.attendanceCount),
				barWidth: '60%',
				animation: true,
				animationDuration: 750,
				animationEasing: 'cubicOut',
				animationDelay: function(idx) {
					return idx * 30
				},
				itemStyle: {
					color(params) {
						const totalCount = sortedData.length
						const index = totalCount - 1 - params.dataIndex

						if (totalCount <= 10) {
							const colors = ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1']
							return colors[index]
						}
						const hue = 200 + (index / totalCount) * 40
						const saturation = 70 + (index / totalCount) * 20
						const lightness = 85 - (index / totalCount) * 30
						return `hsl(${hue}, ${saturation}%, ${lightness}%)`
					},
					borderRadius: [0, 4, 4, 0]
				},
				label: {
					show: true,
					position: 'right',
					formatter(params) {
						if (!params || !cachedSortedData || !cachedSortedData[params.dataIndex]) {
							return ''
						}
						const itemData = cachedSortedData[params.dataIndex]
						return `${itemData.grade}年级\n${itemData.major}`
					},
					fontSize: 11,
					color: isDark ? '#ffffff' : '#666',
					lineHeight: 14,
					distance: 10
				},
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}]
		}

		this.attendanceChartInstance.setOption(option)
	}

	// ======================== 数据加载相关 ========================

	/**
	 * 加载所有数据
	 * @public
	 * @method loadData
	 * @returns {Promise<void>}
	 */
	public async loadData(): Promise<void> {
		try {
			this.loadingMaskStore.showLoadingMask('正在加载数据...')

			await this.dataLoader.loadData()

			await nextTick()
			this.initCharts()

			VerificationCode.startAutoRefresh()

			this.loadingMaskStore.hideLoadingMask()
		} catch (error) {
			console.error('加载数据失败:', error)
			this.loadingMaskStore.hideLoadingMask()
		}
	}

	/**
	 * 初始化所有图表
	 * @private
	 * @method initCharts
	 * @returns {void}
	 */
	private initCharts(): void {
		if (this.gradeChart.value) {
			this.initGradeChart(this.dataLoader.getGradeData())
		}
		if (this.majorChart.value) {
			this.initMajorChart(this.dataLoader.getMajorData())
		}
		if (this.attendanceChart.value) {
			this.initAttendanceChart(this.dataLoader.getRankingData())
		}
	}

	/**
	 * 处理时间范围变化
	 * @public
	 * @method handleTimeRangeChange
	 * @returns {Promise<void>}
	 */
	public async handleTimeRangeChange(): Promise<void> {
		try {
			this.loadingMaskStore.showLoadingMask('正在加载数据...')

			await this.dataLoader.loadRankingData()

			await nextTick()

			const rankingData = this.dataLoader.getRankingData()

			this.initAttendanceChart(rankingData)

			this.saveUserPreferences()
			this.loadingMaskStore.hideLoadingMask()
		} catch (error) {
			console.error('加载排行榜数据失败:', error)
			this.loadingMaskStore.hideLoadingMask()
		}
	}

	private static readonly DATA_REFRESH_INTERVAL = 512

	/**
	 * 加载进度条动画
	 * @private
	 * @method startProgressAnimation
	 * @returns {void}
	 */
	private startProgressAnimation(): void {
		this.progressWidth.value = 0
		this.progressInterval = setInterval(() => {
			this.progressWidth.value += 100 / (DashboardPageDesktop.DATA_REFRESH_INTERVAL * 10)
			if (this.progressWidth.value >= 100) {
				this.progressWidth.value = 0
				this.loadData()
			}
		}, 100)
	}

	/**
	 * 停止进度条动画
	 * @private
	 * @method stopProgressAnimation
	 * @returns {void}
	 */
	private stopProgressAnimation(): void {
		if (this.progressInterval) {
			clearInterval(this.progressInterval)
			this.progressInterval = null
		}
	}

	// ======================== 生命周期 ========================

	/**
	 * 组件挂载
	 * @public
	 * @method onMounted
	 * @returns {void}
	 */
	public onMounted(): void {
		this.loadUserPreferences()
		this.loadData()
		this.startProgressAnimation()
	}

	/**
	 * 组件卸载
	 * @public
	 * @method onUnmounted
	 * @returns {void}
	 */
	public onUnmounted(): void {
		this.stopProgressAnimation()

		if (this.gradeChartInstance) {
			this.gradeChartInstance.dispose()
			this.gradeChartInstance = null
		}
		if (this.majorChartInstance) {
			this.majorChartInstance.dispose()
			this.majorChartInstance = null
		}
		if (this.attendanceChartInstance) {
			this.attendanceChartInstance.dispose()
			this.attendanceChartInstance = null
		}
	}
}
