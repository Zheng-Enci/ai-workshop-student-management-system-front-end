<template>
	<div class="points-dashboard-container">
		<div class="header">
			<div class="header-left">
				<el-button @click="goBack" class="back-btn" type="primary" :icon="ArrowLeft" circle></el-button>
				<img src="@/assets/AiWorkShop_icon.png" alt="AI坊" class="logo" @click="toggleTheme"
					 title="切换主题模式">
				<div class="title-section">
					<h1 class="main-title">在0与1之间，见证每一位创作者的光芒</h1>
				</div>
			</div>
			<div class="header-right">
				<!-- 手机端不显示slogan图片 -->
			</div>
		</div>

		<div class="main-content">
			<div class="dashboard-layout">
				<div class="dashboard-main">
					<div v-if="activeTab === 'signIn'" class="ranking-tabs">
						<div class="ranking-topbar">
							<div class="ranking-arrows">
								<el-button circle size="small" plain @click="switchTab('prev')">
									<el-icon>
										<ArrowLeft/>
									</el-icon>
								</el-button>
								<span class="ranking-label">{{ currentTabLabel }}</span>
								<el-button circle size="small" plain @click="switchTab('next')">
									<el-icon>
										<ArrowRight/>
									</el-icon>
								</el-button>
							</div>
						</div>
						<div class="ranking-list-container">
							<div v-if="signInLoading" class="loading-container">
								<el-icon class="is-loading">
									<Loading/>
								</el-icon>
								<span>加载中...</span>
							</div>
							<div v-else-if="signInRanking.length === 0" class="empty-container">
								<el-icon>
									<Box/>
								</el-icon>
								<span>暂无数据</span>
							</div>
							<div v-else>
								<div ref="signInChart" class="points-chart"></div>
								<div class="formula-card formula-mini">
									<div class="formula-content">
										<div class="formula-item">
											<span class="formula-label">总签到积分</span>
											<span class="formula-equals">=</span>
											<span class="formula-value">签到次数</span>
											<span class="formula-operator">×</span>
											<span class="formula-value">0.64</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div v-else-if="activeTab === 'activity'" class="ranking-tabs">
						<div class="ranking-topbar">
							<div class="ranking-arrows">
								<el-button circle size="small" plain @click="switchTab('prev')">
									<el-icon>
										<ArrowLeft/>
									</el-icon>
								</el-button>
								<span class="ranking-label">{{ currentTabLabel }}</span>
								<el-button circle size="small" plain @click="switchTab('next')">
									<el-icon>
										<ArrowRight/>
									</el-icon>
								</el-button>
							</div>
						</div>
						<div class="ranking-list-container">
							<div v-if="activityLoading" class="loading-container">
								<el-icon class="is-loading">
									<Loading/>
								</el-icon>
								<span>加载中...</span>
							</div>
							<div v-else-if="activityRanking.length === 0" class="empty-container">
								<el-icon>
									<Box/>
								</el-icon>
								<span>暂无数据</span>
							</div>
							<div v-else>
								<div ref="activityChart" class="points-chart"></div>
								<div class="formula-card formula-mini">
									<div class="formula-content">
										<div class="formula-item">
											<span class="formula-label">总活动积分</span>
											<span class="formula-equals">=</span>
											<span class="formula-value">Σ(所有活动积分)</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div v-else class="ranking-tabs">
						<div class="ranking-topbar">
							<div class="ranking-arrows">
								<el-button circle size="small" plain @click="switchTab('prev')">
									<el-icon>
										<ArrowLeft/>
									</el-icon>
								</el-button>
								<span class="ranking-label">{{ currentTabLabel }}</span>
								<el-button circle size="small" plain @click="switchTab('next')">
									<el-icon>
										<ArrowRight/>
									</el-icon>
								</el-button>
							</div>
						</div>
						<div class="ranking-list-container">
							<div v-if="totalLoading" class="loading-container">
								<el-icon class="is-loading">
									<Loading/>
								</el-icon>
								<span>加载中...</span>
							</div>
							<div v-else-if="totalRanking.length === 0" class="empty-container">
								<el-icon>
									<Box/>
								</el-icon>
								<span>暂无符合条件的学生</span>
							</div>
							<div v-else>
								<div ref="totalChart" class="points-chart"></div>
								<div class="formula-card formula-mini">
									<div class="formula-content">
										<div class="formula-item">
											<span class="formula-label">总积分</span>
											<span class="formula-equals">=</span>
											<span class="formula-value formula-signin">总签到积分</span>
											<span class="formula-operator">+</span>
											<span class="formula-value formula-activity">总活动积分</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="dashboard-side">
					<div class="side-card">
						<div class="side-card-header">
							<div class="card-header-left">
								<div class="side-card-title">优秀成员</div>
								<div class="side-card-subtitle">总积分前32名</div>
							</div>
							<div class="unified-legend" v-if="topStudents.length > 0">
								<div class="legend-section">
									<div class="legend-item">
										<span class="legend-dot legend-club-member"></span>
										<span class="legend-text">社团成员</span>
									</div>
									<div class="legend-item">
										<span class="legend-dot legend-normal-member"></span>
										<span class="legend-text">普通成员</span>
									</div>
									<div class="legend-item">
										<span class="legend-dot legend-core-member"></span>
										<span class="legend-text">核心成员</span>
									</div>
									<div class="legend-item">
										<span class="legend-dot legend-admin"></span>
										<span class="legend-text">管理员</span>
									</div>
								</div>
								<div class="legend-section">
									<div class="legend-item">
										<el-icon class="hint-icon">
											<View/>
										</el-icon>
										<span class="legend-text">点击眼睛图标可查看全部改分记录</span>
									</div>
								</div>
								<div class="legend-section">
									<div class="legend-item">
										<span class="legend-dot legend-total"></span>
										<span class="legend-text">总积分</span>
									</div>
									<div class="legend-item">
										<span class="legend-dot legend-signin"></span>
										<span class="legend-text">总签到积分</span>
									</div>
									<div class="legend-item">
										<span class="legend-dot legend-activity"></span>
										<span class="legend-text">总活动积分</span>
									</div>
								</div>
							</div>
						</div>
						<div class="side-card-body" v-if="topStudents.length > 0">
							<div
								v-for="student in topStudents"
								:key="student.studentInfoId || student.placeholderId"
								class="side-student"
								:class="{
                  'is-placeholder': student.placeholder,
                  'level-club-member': !student.placeholder && student.levelCode === 0,
                  'level-normal-member': !student.placeholder && student.levelCode === 1,
                  'level-core-member': !student.placeholder && student.levelCode === 2,
                  'level-admin': !student.placeholder && student.levelCode === 3
                }"
							>
								<div class="side-info">
									<div class="side-avatar-section">
										<div class="side-avatar"
											 :class="{ 'has-avatar': student.hasAvatar && student.avatarUrl, 'no-avatar': !student.hasAvatar || !student.avatarUrl }">
											<img v-if="student.hasAvatar && student.avatarUrl" v-lazy="student.avatarUrl"
												 alt="头像" class="avatar-image" @error="handleAvatarError(student)"/>
											<el-icon v-else size="18" class="avatar-icon">
												<User/>
											</el-icon>
										</div>
										<div class="side-name">
											{{
												student.placeholder ? '待入榜' : (student.name || `学生ID: ${student.studentInfoId}`)
											}}
										</div>
									</div>
									<div class="side-content">
										<div class="side-meta" v-if="!student.placeholder">
											<div class="meta-line meta-line-second" v-if="student.major">
												{{ student.major }}
											</div>
											<div class="meta-line meta-line-second" v-if="student.grade">
												{{ formatGrade(student.grade) }}
											</div>
											<div class="meta-line meta-line-second"
												 v-if="!student.major && !student.grade">--
											</div>
										</div>
										<div class="side-points">
											<div class="points-total-row">
												<div class="points-formula" v-if="!student.placeholder">
													<span class="points-total points-total-main">{{
															student.totalPoints
														}}</span>
													<span class="points-equals">=</span>
													<span class="points-number points-signin">{{
															student.signInPoints
														}}</span>
													<span class="points-plus">+</span>
													<span class="points-number points-activity">{{
															student.activityPoints
														}}</span>
												</div>
												<div class="points-formula" v-else>
													<span class="points-placeholder">待公布</span>
												</div>
												<el-button
													v-if="!student.placeholder"
													size="small"
													type="primary"
													plain
													@click="openRecordsDialog(student)"
													class="view-records-btn"
													circle
												>
													<el-icon>
														<View/>
													</el-icon>
												</el-button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div v-else class="side-empty">
							<el-icon>
								<Box/>
							</el-icon>
							<span>暂无数据</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 改分记录弹窗 -->
		<el-dialog
			v-model="recordsDialogVisible"
			:title="dialogTitle"
			width="95%"
			:close-on-press-escape="true"
			:show-close="true"
			:close-on-click-modal="false"
			:destroy-on-close="true"
			:append-to-body="true"
			:teleported="true"
			modal-class="records-dialog-overlay"
			class="records-dialog"
			@close="handleRecordsDialogClose"
		>
			<div v-if="showRecordsContent" class="records-grid">
				<div
					v-for="record in allRecords"
					:key="record.id"
					class="record-card"
				>
					<div class="record-header">
						<span class="record-time">{{ formatTime(record.createTime) }}</span>
						<span class="record-points-badge"
							  :class="{ positive: record.adjustPoints >= 0, negative: record.adjustPoints < 0 }">
              {{ record.adjustPoints > 0 ? `+${record.adjustPoints}` : record.adjustPoints }}
            </span>
					</div>
					<div class="record-reason-text">{{ record.adjustReason }}</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, nextTick, watch, computed} from 'vue'
import {useRouter} from 'vue-router'
import {useThemeStore} from '@/stores/theme'
import {ElButton, ElIcon, ElDialog} from 'element-plus'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-scrollbar.css'
import 'element-plus/theme-chalk/el-tag.css'
import 'element-plus/theme-chalk/el-popper.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/display.css'
import {ArrowLeft, ArrowRight, Loading, Box, View, User} from '@element-plus/icons-vue'
import * as echarts from 'echarts/core'
import {BarChart} from 'echarts/charts'
import {
	GridComponent,
	TooltipComponent
} from 'echarts/components'
import {CanvasRenderer} from 'echarts/renderers'
import {getTopAdjustRecordsByStudentInfoId} from '@/api/points'
import PointsDashboardPage from './js/PointsDashboardPage'
import PointsDashboardPageUtils from './js/PointsDashboardPageUtils'
import StudentApi from '@/api/StudentApi'
import {ElMessage} from 'element-plus'

echarts.use([
	GridComponent,
	TooltipComponent,
	BarChart,
	CanvasRenderer
])

const router = useRouter()
const themeStore = useThemeStore()
const {toggleTheme} = themeStore

// 创建 PointsDashboardPage 实例
const dashboardPage = ref(new PointsDashboardPage())

const activeTab = ref('total')
const tabOrder = ['total', 'signIn', 'activity']
const tabLabelMap = {
	total: '总积分排行榜',
	signIn: '签到积分排行榜',
	activity: '活动积分排行榜'
}
const currentTabLabel = computed(() => tabLabelMap[activeTab.value] || '')
const signInRanking = ref([])
const activityRanking = ref([])
const totalRanking = ref([])
const topStudents = ref([])
const attendanceData = ref([])
const signInLoading = ref(false)
const activityLoading = ref(false)
const totalLoading = ref(false)

// 改分记录弹窗相关
const recordsDialogVisible = ref(false)
const currentStudent = ref(null)
const allRecords = ref([])
const recordsLoading = ref(false)
const dialogTitle = ref('改分记录')
const showRecordsContent = ref(true)

const signInChart = ref(null)
const activityChart = ref(null)
const totalChart = ref(null)
let signInChartInstance = null
let activityChartInstance = null
let totalChartInstance = null

const goBack = () => {
	router.push('/navigation')
}

const switchTab = (direction) => {
	const idx = tabOrder.indexOf(activeTab.value)
	const nextIdx = direction === 'prev'
		? (idx - 1 + tabOrder.length) % tabOrder.length
		: (idx + 1) % tabOrder.length
	activeTab.value = tabOrder[nextIdx]
	handleTabChange(activeTab.value)
}

const initSignInChart = async (data) => {
	if (!signInChart.value) {
		await nextTick()
		if (!signInChart.value) return
	}

	if (signInChartInstance) {
		signInChartInstance.dispose()
	}

	signInChartInstance = echarts.init(signInChart.value)

	const sortedData = [...data].sort((a, b) => (a.signInPoints || 0) - (b.signInPoints || 0))
	const isDark = themeStore.isDarkMode
	const maxValue = sortedData.length > 0 ? (sortedData[sortedData.length - 1].signInPoints || 0) : 0

	const option = {
		tooltip: {
			show: true,
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			},
			formatter: function (params) {
				const item = sortedData[params[0].dataIndex]
				return `${item.name || '未知学生'}<br/>总积分: ${item.totalPoints || 0}分`
			}
		},
		grid: {
			left: '0%',
			right: '15%',
			bottom: '3%',
			top: '0%',
			containLabel: true
		},
		xAxis: {
			type: 'value',
			max: maxValue,
			axisLabel: {
				fontSize: 10,
				formatter: '{value}分',
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
			data: sortedData.map(item => item.name || `学生ID: ${item.studentInfoId}`),
			axisLabel: {
				interval: 0,
				fontSize: 10,
				color: isDark ? '#ffffff' : '#2c3e50'
			},
			axisLine: {
				lineStyle: {
					color: isDark ? '#ffffff' : '#2c3e50'
				}
			}
		},
		series: [
			{
				name: '签到积分',
				type: 'bar',
				data: sortedData.map(item => item.signInPoints || 0),
				barWidth: '60%',
				itemStyle: {
					color: function (params) {
						const totalCount = sortedData.length
						const index = params.dataIndex

						if (totalCount <= 10) {
							const colors = ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1']
							return colors[index]
						} else {
							const hue = 200 + (index / totalCount) * 40
							const saturation = 70 + (index / totalCount) * 20
							const lightness = 85 - (index / totalCount) * 30
							return `hsl(${hue}, ${saturation}%, ${lightness}%)`
						}
					},
					borderRadius: [0, 4, 4, 0]
				},
				label: {
					show: true,
					position: 'right',
					formatter: function (params) {
						const item = sortedData[params.dataIndex]
						return `${item.signInPoints || 0}分`
					},
					fontSize: 10,
					color: isDark ? '#ffffff' : '#666',
					distance: 8
				}
			}
		]
	}

	signInChartInstance.setOption(option)
}
const initActivityChart = async (data) => {
	if (!activityChart.value) {
		await nextTick()
		if (!activityChart.value) return
	}

	if (activityChartInstance) {
		activityChartInstance.dispose()
	}

	activityChartInstance = echarts.init(activityChart.value)

	const sortedData = [...data].sort((a, b) => a.activityPoints - b.activityPoints)
	const isDark = themeStore.isDarkMode
	const maxValue = sortedData.length > 0 ? sortedData[sortedData.length - 1].activityPoints : null

	const option = {
		tooltip: {
			show: false
		},
		grid: {
			left: '0%',
			right: '20%',
			bottom: '5%',
			top: '0%',
			containLabel: true
		},
		xAxis: {
			type: 'value',
			max: maxValue,
			axisLabel: {
				fontSize: 10,
				formatter: '{value}分',
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
			data: sortedData.map(item => item.name || `学生ID: ${item.targetStudentInfoId}`),
			axisLabel: {
				interval: 0,
				fontSize: 10,
				color: isDark ? '#ffffff' : '#2c3e50'
			},
			axisLine: {
				lineStyle: {
					color: isDark ? '#ffffff' : '#2c3e50'
				}
			}
		},
		series: [
			{
				name: '活动积分',
				type: 'bar',
				data: sortedData.map(item => item.activityPoints),
				barWidth: '60%',
				itemStyle: {
					color: function (params) {
						const totalCount = sortedData.length
						const index = params.dataIndex

						if (totalCount <= 10) {
							const colors = ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1']
							return colors[index]
						} else {
							const hue = 200 + (index / totalCount) * 40
							const saturation = 70 + (index / totalCount) * 20
							const lightness = 85 - (index / totalCount) * 30
							return `hsl(${hue}, ${saturation}%, ${lightness}%)`
						}
					},
					borderRadius: [0, 4, 4, 0]
				},
				label: {
					show: true,
					position: 'right',
					formatter: sortedData.map(item => item.activityPoints),
					fontSize: 9,
					color: isDark ? '#ffffff' : '#666',
					lineHeight: 12,
					distance: 8
				}
			}
		]
	}

	activityChartInstance.setOption(option)
}

const initTotalChart = async (data) => {
	if (!totalChart.value) {
		await nextTick()
		if (!totalChart.value) return
	}

	if (totalChartInstance) {
		totalChartInstance.dispose()
	}

	totalChartInstance = echarts.init(totalChart.value)

	const sortedData = [...data].sort((a, b) => a.totalPoints - b.totalPoints)
	const isDark = themeStore.isDarkMode
	const firstPlaceTotalPoints = sortedData.length > 0 ? sortedData[sortedData.length - 1].totalPoints : null

	const option = {
		tooltip: {
			show: false
		},
		grid: {
			left: '0%',
			right: '20%',
			bottom: '5%',
			top: '0%',
			containLabel: true
		},
		xAxis: {
			type: 'value',
			max: firstPlaceTotalPoints,
			axisLabel: {
				fontSize: 10,
				formatter: '{value}分',
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
			data: sortedData.map(item => item.name || `学生ID: ${item.studentInfoId}`),
			axisLabel: {
				interval: 0,
				fontSize: 10,
				color: isDark ? '#ffffff' : '#2c3e50'
			},
			axisLine: {
				lineStyle: {
					color: isDark ? '#ffffff' : '#2c3e50'
				}
			}
		},
		series: [
			{
				name: '签到积分',
				type: 'bar',
				stack: 'total',
				data: sortedData.map(item => item.signInPoints),
				barWidth: '60%',
				itemStyle: {
					color: isDark ? '#60a5fa' : '#4facfe',
					borderRadius: [0, 0, 0, 0]
				},
				label: {
					show: false
				}
			},
			{
				name: '活动积分',
				type: 'bar',
				stack: 'total',
				data: sortedData.map(item => item.activityPoints),
				barWidth: '60%',
				itemStyle: {
					color: isDark ? '#00d4ff' : '#00f2fe',
					borderRadius: [0, 4, 4, 0]
				},
				label: {
					show: true,
					position: 'right',
					formatter: function (params) {
						const item = sortedData[params.dataIndex]
						return `${item.totalPoints}分`
					},
					fontSize: 9,
					color: isDark ? '#ffffff' : '#666',
					distance: 8
				}
			}
		]
	}

	totalChartInstance.setOption(option)
}

const handleAvatarError = (student) => {
	student.hasAvatar = false
	student.avatarUrl = null
}


// 已删除 loadStudentInfo 函数，因为 PointsDashboardPage 已经返回了完整的学生信息

// 已删除冗余的 loadSignInRanking 和 loadActivityRanking 函数，现在统一使用 PointsDashboardPage 管理数据

const getAttendanceData = async () => {
	try {
		// 1. 先获取原始签到排名数据
		let rawAttendanceData = await PointsDashboardPageUtils.getTopNStudentsByAttendanceCount(32);

		// 2. 检查综合排名数据是否存在，不存在则提示并返回空
		if (!dashboardPage.value.comprehensiveRankingData || dashboardPage.value.comprehensiveRankingData.length === 0) {
			ElMessage.warning('综合排名数据未加载，无法补充学生信息');
			attendanceData.value = rawAttendanceData;
			return;
		}

		// 3. 遍历签到数据，补充学生信息（姓名、学院、专业等）
		const processedAttendanceData = await Promise.all(rawAttendanceData.map(async item => {
			// 根据studentInfoId从综合排名数据中找对应学生
			const matchedStudent = dashboardPage.value.comprehensiveRankingData.find(
				student => student.studentInfoId === item.studentInfoId
			);
			// 如果没找到
			if (!matchedStudent) {
				try {
					const nameResponse = await StudentApi.getStudentPublicFieldValueById(item.studentInfoId, 'name');
					let name = '未知';
					if (nameResponse.code === 200) {
						name = nameResponse.data;
					} else if (nameResponse.message) {
						ElMessage.error(`获取学生签到排行榜学生姓名失败：${nameResponse.message}`);
					} else {
						ElMessage.error('获取签到排行榜学生姓名失败，请检查网络连接或联系管理员');
					}
					// 补充信息：找到则用匹配的信息，没找到则姓名显示"未知"
					return {
						...item, // 保留原有字段（studentInfoId、attendanceCount、attendancePoints、ranking）
						// 补充学生姓名
						name: name,
					};
				} catch (error) {
					ElMessage.error(`获取签到排行榜学生姓名失败，请检查网络连接或联系管理员`);
					return {
						...item,
						name: '未知',
					};
				}
			} else {
				// 补充信息：找到则用匹配的信息，没找到则姓名显示"未知"
				return {
					...item, // 保留原有字段（studentInfoId、attendanceCount、attendancePoints、ranking）
					// 补充学生姓名
					name: matchedStudent?.name || '未知',
				};
			}
		}));

		attendanceData.value = processedAttendanceData;

		// 将数据格式化为图表所需格式
		signInRanking.value = processedAttendanceData.map(item => ({
			studentInfoId: item.studentInfoId,
			name: item.name || '未知',
			grade: item.grade,
			major: item.major,
			signInPoints: item.attendancePoints || 0
		}));
	} catch (error) {
		ElMessage.error(error.message || '获取签到排行榜失败, 请检查网络连接或联系管理员');
		attendanceData.value = [];
		signInRanking.value = [];
	}
}

const padTopStudents = (list, targetLength = 12) => {
	const filled = [...list]
	while (filled.length < targetLength) {
		filled.push({
			placeholder: true,
			placeholderId: `placeholder-${filled.length}`
		})
	}
	return filled
}

const loadTotalRanking = async () => {
	totalLoading.value = true
	try {
		// 使用 PointsDashboardPage 获取数据（前32名）
		await dashboardPage.value.initData()
		const rankingData = dashboardPage.value.comprehensiveRankingData || []

		// 将数据格式化为图表所需格式，直接使用 PointsDashboardPage 返回的完整数据
		totalRanking.value = rankingData.map(student => ({
			studentInfoId: student.studentInfoId,
			name: student.name,                   // 直接使用已获取的姓名
			grade: student.grade,                  // 直接使用已获取的年级
			major: student.major,                  // 直接使用已获取的专业
			levelCode: student.levelCode,          // 直接使用已获取的等级
			hasAvatar: !!student.avatarUrl,        // 直接使用已获取的头像信息
			avatarUrl: student.avatarUrl,          // 直接使用已获取的头像URL
			signInPoints: student.attendancePoints,  // 签到积分
			activityPoints: student.activityPoints,  // 活动积分
			totalPoints: student.totalPoints         // 总积分
		}))

		// 侧边栏显示前32名
		const topList = totalRanking.value.slice(0, 32)
		topStudents.value = padTopStudents(topList, 32)

		// 初始化图表 - 显示前20名
		await nextTick()
		if (totalRanking.value.length > 0) {
			const initChartWithRetry = async (retryCount = 0) => {
				if (totalChart.value) {
					await initTotalChart(totalRanking.value.slice(0, 32))
				} else if (retryCount < 10) {
					setTimeout(() => {
						initChartWithRetry(retryCount + 1)
					}, 100)
				}
			}
			setTimeout(() => {
				initChartWithRetry()
			}, 200)
		}
	} catch (error) {
		console.error('获取综合排名数据失败:', error)
		totalRanking.value = []
	} finally {
		totalLoading.value = false
	}
}

const handleTabChange = async (tabName) => {
	await nextTick()
	if (tabName === 'signIn') {
		signInLoading.value = true
		try {
			// 使用新的获取签到数据方法
			await getAttendanceData()

			const initChartWithRetry = async (retryCount = 0) => {
				if (signInChart.value) {
					await initSignInChart(signInRanking.value)
				} else if (retryCount < 10) {
					setTimeout(() => {
						initChartWithRetry(retryCount + 1)
					}, 100)
				}
			}
			setTimeout(() => {
				initChartWithRetry()
			}, 200)
		} catch (error) {
			console.error('获取签到排名数据失败:', error)
		} finally {
			signInLoading.value = false
		}
	} else if (tabName === 'activity') {
		activityLoading.value = true
		try {
			// 使用新的获取活动积分数据方法
			await dashboardPage.value.getActivityData()

			// 将获取到的活动积分数据赋值给activityRanking
			activityRanking.value = dashboardPage.value.activityData.map(item => ({
				targetStudentInfoId: item.studentInfoId,
				name: item.name || '未知',
				grade: item.grade,
				major: item.major,
				activityPoints: item.activityPoints || 0
			}))

			const initChartWithRetry = async (retryCount = 0) => {
				if (activityChart.value) {
					await initActivityChart(activityRanking.value)
				} else if (retryCount < 10) {
					setTimeout(() => {
						initChartWithRetry(retryCount + 1)
					}, 100)
				}
			}
			setTimeout(() => {
				initChartWithRetry()
			}, 200)
		} catch (error) {
			console.error('获取活动积分排名数据失败:', error)
		} finally {
			activityLoading.value = false
		}
	} else if (tabName === 'total') {
		if (totalRanking.value.length === 0) {
			await loadTotalRanking()
		} else if (totalRanking.value.length > 0) {
			const initChartWithRetry = async (retryCount = 0) => {
				if (totalChart.value) {
					initTotalChart(totalRanking.value.slice(0, 32))
				} else if (retryCount < 10) {
					setTimeout(() => {
						initChartWithRetry(retryCount + 1)
					}, 100)
				}
			}
			setTimeout(() => {
				initChartWithRetry()
			}, 200)
		}
	}
}

const handleResize = () => {
	if (signInChartInstance) {
		signInChartInstance.resize()
	}
	if (activityChartInstance) {
		activityChartInstance.resize()
	}
	if (totalChartInstance) {
		totalChartInstance.resize()
	}
}

// 自动刷新定时器
let refreshTimer = null

// 统一的刷新函数，根据当前激活的 tab 刷新对应的数据
const refreshData = async () => {
	// 统一使用 PointsDashboardPage 刷新数据
	await dashboardPage.value.refreshData()
	const rankingData = dashboardPage.value.comprehensiveRankingData || []

	// 更新总积分排行榜
	totalRanking.value = rankingData.map(student => ({
		studentInfoId: student.studentInfoId,
		name: student.name,                   // 直接使用已获取的姓名
		grade: student.grade,                  // 直接使用已获取的年级
		major: student.major,                  // 直接使用已获取的专业
		levelCode: student.levelCode,          // 直接使用已获取的等级
		hasAvatar: !!student.avatarUrl,        // 直接使用已获取的头像信息
		avatarUrl: student.avatarUrl,          // 直接使用已获取的头像URL
		signInPoints: student.attendancePoints,  // 签到积分
		activityPoints: student.activityPoints,  // 活动积分
		totalPoints: student.totalPoints         // 总积分
	}))

	// 更新侧边栏显示的前32名
	const topList = totalRanking.value.slice(0, 32)
	topStudents.value = padTopStudents(topList, 32)

	// 根据当前激活的 tab 更新对应的排行榜
	if (activeTab.value === 'signIn') {
		signInRanking.value = rankingData.map(student => ({
			studentInfoId: student.studentInfoId,
			name: student.name,
			grade: student.grade,
			major: student.major,
			signInPoints: student.attendancePoints
		}))
	} else if (activeTab.value === 'activity') {
		activityRanking.value = rankingData.map(student => ({
			targetStudentInfoId: student.studentInfoId,
			name: student.name,
			grade: student.grade,
			major: student.major,
			activityPoints: student.activityPoints
		}))
	}
}

// 启动自动刷新
const startAutoRefresh = () => {
	// 清除已存在的定时器
	if (refreshTimer) {
		clearInterval(refreshTimer)
	}
	// 设置定时器，每隔60秒（60000毫秒）刷新一次
	refreshTimer = setInterval(() => {
		refreshData()
	}, 60000)
}

// 停止自动刷新
const stopAutoRefresh = () => {
	if (refreshTimer) {
		clearInterval(refreshTimer)
		refreshTimer = null
	}
}

watch(() => themeStore.isDarkMode, () => {
	setTimeout(() => {
		if (activeTab.value === 'signIn' && signInRanking.value.length > 0) {
			initSignInChart(signInRanking.value)
		} else if (activeTab.value === 'activity' && activityRanking.value.length > 0) {
			initActivityChart(activityRanking.value)
		} else if (activeTab.value === 'total' && totalRanking.value.length > 0) {
			initTotalChart(totalRanking.value)
		}
	}, 100)
})

const openRecordsDialog = async (student) => {
	// 恢复遮罩层样式，确保可以正常显示
	const dialogWrapper = document.querySelector('.records-dialog-overlay')
	if (dialogWrapper) {
		dialogWrapper.style.display = ''
		dialogWrapper.style.visibility = ''
		dialogWrapper.style.opacity = ''
	}

	// 设置当前学生
	currentStudent.value = student
	dialogTitle.value = `${student?.name || '学生'}的改分记录`
	showRecordsContent.value = true
	recordsDialogVisible.value = true
	recordsLoading.value = true
	allRecords.value = []

	try {
		const response = await getTopAdjustRecordsByStudentInfoId(student.studentInfoId, 100)
		if (response.code === 200 && Array.isArray(response.data)) {
			// 按时间降序排序（最新的在前）
			allRecords.value = response.data.sort((a, b) => {
				const timeA = new Date(a.createTime).getTime()
				const timeB = new Date(b.createTime).getTime()
				return timeB - timeA
			})
		}
	} catch (error) {
		console.error('获取改分记录失败:', error)
		allRecords.value = []
	} finally {
		recordsLoading.value = false
	}
}

const handleRecordsDialogClose = () => {
	// 先直接操作DOM隐藏遮罩层，避免闪烁
	const dialogWrapper = document.querySelector('.records-dialog-overlay')
	if (dialogWrapper) {
		dialogWrapper.style.display = 'none'
		dialogWrapper.style.visibility = 'hidden'
		dialogWrapper.style.opacity = '0'
	}

	// 立即清空 allRecords，避免 v-for 在关闭动画过程中重新渲染
	allRecords.value = []

	// 延迟清空其他数据，确保弹窗完全关闭后再清空
	setTimeout(() => {
		recordsLoading.value = false
		currentStudent.value = null
		dialogTitle.value = '改分记录'
	}, 0)
}

const formatGrade = (grade) => {
	if (!grade) return ''
	const gradeNum = parseInt(grade)
	if (isNaN(gradeNum)) return grade
	const gradeMap = {
		1: '大一',
		2: '大二',
		3: '大三',
		4: '大四',
		5: '大五',
		6: '大六'
	}
	return gradeMap[gradeNum] || `${gradeNum}年级`
}

const formatTime = (timeString) => {
	if (!timeString) return '--'
	try {
		const date = new Date(timeString)
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')
		return `${year}-${month}-${day} ${hours}:${minutes}`
	} catch (error) {
		return timeString
	}
}

onMounted(async () => {
	await nextTick()
	await loadTotalRanking()
	window.addEventListener('resize', handleResize)
	// 启动自动刷新
	startAutoRefresh()
})

onUnmounted(() => {
	// 停止自动刷新
	stopAutoRefresh()
	if (signInChartInstance) {
		signInChartInstance.dispose()
	}
	if (activityChartInstance) {
		activityChartInstance.dispose()
	}
	if (totalChartInstance) {
		totalChartInstance.dispose()
	}
	window.removeEventListener('resize', handleResize)
})
</script>
<style scoped src="./css/PointsDashboardPageMobile.css"></style>

