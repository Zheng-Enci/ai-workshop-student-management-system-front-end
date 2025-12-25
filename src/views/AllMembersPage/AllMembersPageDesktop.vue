<template>
	<div class="points-dashboard-container" style="overflow-y: visible;">
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
				<el-button @click="goToPointsDashboard" type="primary" size="default" plain>
					<el-icon>
						<DataAnalysis/>
					</el-icon>
					<span style="margin-left: 6px;">积分看板</span>
				</el-button>
				<div class="slogan">
					<img src="@/assets/QunCeQunLiChuangXingGongXing.png" alt="群策群力，创新共行" class="slogan-img">
				</div>
			</div>
		</div>

		<div class="main-content" style="overflow-y: visible;">
			<div style="gap: 20px; overflow-y: visible;">
				<div class="dashboard-side" style="overflow-y: visible;">
					<div class="side-card" style="overflow-y: visible;">
						<div class="side-card-header">
							<div class="card-header-left">
								<div class="side-card-title">全部成员</div>
							</div>
							<div class="unified-legend">
								<div class="legend-section">
									<div class="legend-item" v-if="topStudents.length > 0">
										<el-button @click="showStatisticsDialog" type="primary" size="small" plain>
											<el-icon>
												<DataAnalysis/>
											</el-icon>
											<span style="margin-left: 6px;">查看统计数据</span>
										</el-button>
									</div>
								</div>
								<div class="legend-section" v-if="topStudents.length > 0">
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
								<div class="legend-section" style="display: flex; align-items: center; gap: 20px;">
									<div class="legend-item">
										<el-input
											v-model="searchKeyword"
											placeholder="搜索姓名/学院/专业/年级/积分..."
											clearable
											style="width: 280px;"
											size="small"
											@input="handleSearch"
										>
											<template #prefix>
												<el-icon>
													<Search/>
												</el-icon>
											</template>
										</el-input>
									</div>
									<div v-if="topStudents.length > 0"
										 style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
										<div
											style="font-size: 20px; font-weight: 700; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
											{{ loadedCount }}/{{ totalCount }}
										</div>
										<div
											style="font-size: 12px; color: var(--el-text-color-secondary); white-space: nowrap;">
											加载进度
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="random-quote-container" v-if="topStudents.length > 0">
							<div class="random-quote" :class="{ 'fade-in': showQuote }">
								{{ currentQuote }}
							</div>
						</div>
					</div>
					<!-- 有数据：显示学生列表 -->
					<div class="side-card-body" v-if="topStudents.length > 0">
						<div
							v-for="(student, index) in topStudents"
							:key="student.studentInfoId || student.placeholderId"
							:data-index="index"
							:style="{ animationDelay: `${index * 0.05}s` }"
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
									<!-- 修改后的代码 -->
									<div
										ref="avatarRef"
										class="side-avatar"
										:class="{
											'has-avatar': student.avatarUrl,
											'no-avatar': !student.avatarUrl
										}"
									>
										<img v-if="student.avatarUrl" :src="student.avatarUrl"
											 alt="头像" class="avatar-image" @error="handleAvatarError(student)"/>
										<el-icon v-else size="26" class="avatar-icon">
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
										<div class="meta-row">
											<div class="meta-line meta-line-second" v-if="student.gender">
												{{ student.gender }}
											</div>
											<div class="meta-line meta-line-second" v-else>--</div>
											<div class="meta-line meta-line-second" v-if="student.college">
												{{ student.college }}
											</div>
											<div class="meta-line meta-line-second" v-else>--</div>
										</div>
										<div class="meta-row">
											<div class="meta-line meta-line-second" v-if="student.major">
												{{ student.major }}
											</div>
											<div class="meta-line meta-line-second" v-else>--</div>
											<div class="meta-line meta-line-second" v-if="student.grade">
												{{ formatGrade(student.grade) }}
											</div>
											<div class="meta-line meta-line-second" v-else>--</div>
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
														student.attendancePoints
													}}</span>
												<span class="points-plus">+</span>
												<span class="points-number points-activity">{{
														student.activityPoints
													}}</span>
											</div>
											<div class="points-formula" v-else>
												<span class="points-placeholder">待公布</span>
											</div>
											<el-tooltip content="查看全部改分记录" placement="top" :show-after="300">
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
											</el-tooltip>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- 加载中：显示加载动画 -->
					<div v-else-if="totalLoading" class="side-empty">
						<el-icon class="is-loading" size="48">
							<Loading/>
						</el-icon>
						<span>数据加载中...</span>
					</div>

					<!-- 无数据：显示暂无数据 -->
					<div v-else class="side-empty">
						<el-icon size="48">
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
		v-if="recordsDialogVisible"
		v-model="recordsDialogVisible"
		:title="`${currentStudent?.name || '学生'}的改分记录`"
		width="80%"
		:close-on-click-modal="false"
		:destroy-on-close="true"
		:append-to-body="true"
		:teleported="true"
		modal-class="records-dialog-overlay"
		class="records-dialog"
		@close="handleRecordsDialogClose"
	>
		<div v-if="recordsLoading" class="records-loading">
			<el-icon class="is-loading">
				<Loading/>
			</el-icon>
			<span>加载中...</span>
		</div>
		<div v-else-if="allRecords.length === 0" class="records-empty">
			<el-icon>
				<Box/>
			</el-icon>
			<span>暂无改分记录</span>
		</div>
		<div v-else class="records-grid">
			<div
				v-for="(record, index) in allRecords"
				:key="index"
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

	<!-- 统计数据弹窗 -->
	<el-dialog
		v-if="statisticsDialogVisible"
		v-model="statisticsDialogVisible"
		title="统计数据"
		width="70%"
		:close-on-click-modal="false"
		:destroy-on-close="true"
		:append-to-body="true"
		:teleported="true"
		modal-class="statistics-dialog-overlay"
		class="statistics-dialog"
		@close="closeStatisticsDialog"
	>
		<div class="statistics-content">
			<div class="statistics-section-wrapper">
				<div class="statistics-section-title">总览</div>
				<div class="statistics-grid">
					<div class="statistics-card">
						<div class="statistics-card-label">总人数</div>
						<div class="statistics-card-value">{{ totalCount }}</div>
					</div>
				</div>
			</div>

			<div class="statistics-section-wrapper">
				<div class="statistics-section-title">学院分布</div>
				<div class="statistics-grid">
					<div class="statistics-card" v-for="(count, college) in collegeStats" :key="'college-' + college">
						<div class="statistics-card-label">{{ college }}</div>
						<div class="statistics-card-value">{{ count }}人</div>
					</div>
				</div>
			</div>

			<div class="statistics-section-wrapper">
				<div class="statistics-section-title">专业分布</div>
				<div class="statistics-grid">
					<div class="statistics-card" v-for="(count, major) in majorStats" :key="'major-' + major">
						<div class="statistics-card-label">{{ major }}</div>
						<div class="statistics-card-value">{{ count }}人</div>
					</div>
				</div>
			</div>

			<div class="statistics-section-wrapper">
				<div class="statistics-section-title">性别分布</div>
				<div class="statistics-grid">
					<div class="statistics-card" v-for="(count, gender) in genderStats" :key="'gender-' + gender">
						<div class="statistics-card-label">{{ gender }}</div>
						<div class="statistics-card-value">{{ count }}人</div>
					</div>
				</div>
			</div>

			<div class="statistics-section-wrapper">
				<div class="statistics-section-title">年级分布</div>
				<div class="statistics-grid">
					<div class="statistics-card" v-for="(count, grade) in gradeStats" :key="'grade-' + grade">
						<div class="statistics-card-label">{{ formatGrade(grade) }}</div>
						<div class="statistics-card-value">{{ count }}人</div>
					</div>
				</div>
			</div>
		</div>
	</el-dialog>
</template>

<script setup>
import {nextTick, onMounted, onUnmounted, ref, watch} from 'vue'
import {useRouter} from 'vue-router'
import {useThemeStore} from '@/stores/theme'
import {ElButton, ElDialog, ElIcon, ElInput, ElTooltip} from 'element-plus'
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
import 'element-plus/theme-chalk/el-tooltip.css'
import 'element-plus/theme-chalk/display.css'
import {ArrowLeft, Box, DataAnalysis, Loading, Search, User, View} from '@element-plus/icons-vue'
import * as echarts from 'echarts/core'
import {BarChart} from 'echarts/charts'
import {GridComponent} from 'echarts/components'
import {CanvasRenderer} from 'echarts/renderers'
import {getAttendanceTopRanking} from '@/api/attendance'
import {getPointsTopRanking, getTopAdjustRecordsByStudentInfoId} from '@/api/points'
import {getAvatarUrl, getStudentLevelByInfoId, getStudentPublicFieldValueById} from '@/api/student'
import AllMembersPage from "@/views/AllMembersPage/js/AllMembersPage";

echarts.use([
	GridComponent,
	BarChart,
	CanvasRenderer
])

const router = useRouter()
const themeStore = useThemeStore()
const {toggleTheme} = themeStore

const activeTab = ref('total')
const selectedTopN = 2147483647 // Java Integer 最大值，无上限
const totalRankingTopN = 2147483647 // Java Integer 最大值，无上限
const signInRanking = ref([])
const activityRanking = ref([])
const totalRanking = ref([])
const topStudents = ref([])
const signInLoading = ref(false)
const activityLoading = ref(false)
const totalLoading = ref(true)
const loadedCount = ref(0)

// 统计数据
const totalCount = ref(0)
const collegeStats = ref({})
const majorStats = ref({})
const genderStats = ref({})
const gradeStats = ref({})

// 搜索功能
const searchKeyword = ref('')
const filteredStudents = ref([])

// 随机文案相关 - 128句技术相关激励文案
const quotes = [
	'每一行代码，都是向梦想更近一步',
	'今天的代码，是明天产品的基石',
	'不要等待需求，要主动创造价值',
	'坚持不是看到bug才修复，而是持续优化代码',
	'你的代码，终将成就更好的产品',
	'代码不会发光，发光的是写代码的你',
	'上线不是终点，bug也不是末日',
	'只有写出来的功能，没有等出来的产品',
	'相信自己，你比想象中更会编程',
	'每一次调试，都是成长的机会',
	'编程到无能为力，重构到感动自己',
	'代码虽多行则将至，bug虽难修则必成',
	'不经历bug，怎么见彩虹',
	'越写代码，越幸运',
	'成功没有捷径，只有敲代码',
	'今天的你，决定了明天的代码质量',
	'不要害怕报错，害怕的是从未尝试',
	'梦想照进现实，需要代码来实现',
	'坚持写代码就是胜利，放弃才是失败',
	'你的编程潜力无限，只待你去发掘',
	'每一次报错，都是为了更好地理解代码',
	'写代码的人，运气都不会太差',
	'相信自己，你值得拥有最好的技术栈',
	'不要停止学习新技术，不要固守旧技术',
	'成功的人找方法，失败的人找借口',
	'只有拼尽全力，才能写出优雅的代码',
	'你的坚持，终将写出好代码',
	'梦想不会逃跑，会逃跑的永远是bug',
	'努力的意义，是让自己随时有能力重构代码',
	'没有框架的孩子，必须手写代码',
	'你现在的学习，是为了将来有更多技术选择',
	'不要在该学技术的年纪选择安逸',
	'成功就是简单的代码重复优化',
	'每一个不曾写代码的日子，都是对技术的辜负',
	'你的代码，时间会给你答案',
	'不要因为走得太远，而忘记为什么写代码',
	'相信自己，没有什么功能实现不了',
	'每一次代码提交，都是对未来的投资',
	'成功不是偶然，而是持续写代码',
	'不要等待机会，要主动创造产品',
	'写代码的人，终将被技术温柔以待',
	'梦想还是要有的，万一用代码实现了呢',
	'今天的代码，是明天成功的资本',
	'不要害怕bug，bug是成长的阶梯',
	'你的代码，终将照亮前行的路',
	'坚持到底写代码，就是胜利',
	'相信自己，你比想象中更会解决问题',
	'每一次代码优化，都在为成功铺路',
	'不要轻言放弃，否则对不起代码',
	'你的坚持，终将换来成功',
	'不要停止写代码，成功就在前方',
	'相信自己，没有什么功能做不到',
	'每一次重构代码，都是突破的机会',
	'写代码的人，终将收获成功',
	'不要害怕报错，报错是成功之母',
	'你的代码，时间会证明一切',
	'相信自己，你值得拥有成功',
	'每一次代码提交，都在向目标靠近',
	'不要等待需求，要主动抓住机会',
	'你的坚持，终将成就梦想',
	'不要因为困难而放弃，要因为坚持而成功',
	'每一次学习新技术，都是对未来的投资',
	'不要停止编码，成功就在前方',
	'你的代码，终将换来回报',
	'不要害怕新技术，新技术是成长的机会',
	'每一次代码审查，都在为成功铺路',
	'不要等待机会，要主动创造产品',
	'你的坚持，终将成就更好的代码',
	'每一次提交代码，都在向梦想靠近',
	'你的代码，终将照亮前行的路',
	'不要停止学习新技术，成功就在前方',
	'每一次重构代码，都是突破的机会',
	'你的坚持，终将换来成功',
	'不要等待需求，要主动抓住机会',
	'相信自己，你值得拥有成功',
	'每一次性能优化，都在为成功铺路',
	'不要因为困难而放弃，要因为坚持而成功',
	'你的代码，时间会证明一切',
	'不要停止编码，不要回顾旧代码',
	'每一次单元测试，都在向目标靠近',
	'不要害怕新技术，新技术是成长的机会',
	'你的代码，终将换来回报',
	'不要等待机会，要主动创造产品',
	'每一次学习算法，都是对未来的投资',
	'不要因为走得太远，而忘记为什么写代码',
	'你的坚持，终将成就梦想',
	'不要轻言放弃，否则对不起代码',
	'每一次架构设计，都是突破的机会',
	'你的代码，时间会给你答案',
	'相信自己，没有什么功能做不到',
	'每一次代码提交，都在向梦想靠近',
	'你的坚持，终将成就更好的代码',
	'每一次学习设计模式，都是对未来的投资',
	'你的代码，终将换来成功',
	'相信自己，你值得拥有最好的技术',
	'每一次代码审查，都在向目标靠近',
	'写代码的人，运气都不会太差',
	'相信自己，你比想象中更会编程',
	'写代码的人，终将被技术温柔以待',
	'每一次Git提交，都是对代码质量的承诺',
	'不要害怕技术债务，重构是成长的必经之路',
	'你的代码注释，是给未来自己的礼物',
	'每一次代码Review，都在提升团队水平',
	'不要停止思考，算法是程序员的灵魂',
	'你的测试覆盖率，决定了代码的可靠性',
	'每一次性能调优，都在追求极致体验',
	'不要忽视代码规范，细节决定成败',
	'你的设计模式，让代码更优雅',
	'每一次学习新技术栈，都在拓宽技术边界',
	'不要害怕开源，分享让技术更美好',
	'你的代码架构，决定了系统的可扩展性',
	'每一次解决技术难题，都在突破自我',
	'不要停止探索，技术世界永无止境',
	'你的代码质量，体现了你的专业素养',
	'每一次技术分享，都在传播知识',
	'不要害怕挑战，复杂问题需要耐心',
	'你的代码风格，是个人品牌的体现',
	'每一次优化算法，都在追求效率',
	'不要停止实践，理论需要代码验证',
	'你的技术选型，决定了项目的未来',
	'每一次代码重构，都在追求完美',
	'不要害怕新技术，拥抱变化才能进步',
	'你的代码可读性，体现了你的责任心',
	'每一次技术突破，都在创造价值',
	'不要停止学习，技术更新日新月异',
	'你的代码文档，是团队协作的桥梁',
	'每一次技术选型，都在权衡利弊',
	'不要害怕失败，错误是最好的老师',
	'你的代码版本控制，记录了成长的轨迹'
]

const currentQuote = ref('')
const showQuote = ref(false)
let quoteTimer = null
let lastQuoteIndex = -1

// 获取随机文案（避免连续显示相同文案）
const getRandomQuote = () => {
	let randomIndex
	// 如果只有一条文案，直接返回
	if (quotes.length === 1) {
		return quotes[0]
	}
	// 确保不连续显示相同的文案
	do {
		randomIndex = Math.floor(Math.random() * quotes.length)
	} while (randomIndex === lastQuoteIndex && quotes.length > 1)

	lastQuoteIndex = randomIndex
	return quotes[randomIndex]
}

// 更新文案（带淡入淡出效果）
const updateQuote = () => {
	showQuote.value = false
	setTimeout(() => {
		currentQuote.value = getRandomQuote()
		showQuote.value = true
	}, 400) // 淡出时间
}

// 启动文案轮播
const startQuoteRotation = () => {
	// 立即显示第一条
	currentQuote.value = getRandomQuote()
	showQuote.value = true

	// 每隔一段时间刷新（5-8秒随机间隔，增加自然感）
	const scheduleNext = () => {
		const delay = 5000 + Math.random() * 3000 // 5-8秒随机
		quoteTimer = setTimeout(() => {
			updateQuote()
			scheduleNext()
		}, delay)
	}
	scheduleNext()
}

// 停止文案轮播
const stopQuoteRotation = () => {
	if (quoteTimer) {
		clearTimeout(quoteTimer)
		quoteTimer = null
	}
}

// 改分记录弹窗相关
const recordsDialogVisible = ref(false)
const currentStudent = ref(null)
const allRecords = ref([])
const recordsLoading = ref(false)
const isClosingRecordsDialog = ref(false)

// 统计数据弹窗
const statisticsDialogVisible = ref(false)
const isClosingStatisticsDialog = ref(false)

const signInChart = ref(null)
const activityChart = ref(null)
const totalChart = ref(null)
let signInChartInstance = null
let activityChartInstance = null
let totalChartInstance = null

const goBack = () => {
	router.push('/navigation')
}

const goToPointsDashboard = () => {
	router.push('/points-dashboard')
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

	const sortedData = [...data].sort((a, b) => a.signInPoints - b.signInPoints)
	const isDark = themeStore.isDarkMode
	const maxValue = sortedData.length > 0 ? sortedData[sortedData.length - 1].signInPoints : null

	const option = {
		tooltip: {
			show: false
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
				fontSize: 12,
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
				fontSize: 12,
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
				data: sortedData.map(item => item.signInPoints),
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
						let line1 = ''
						if (item.major) {
							line1 += item.major
						}
						if (item.major && item.grade) {
							line1 += ' '
						}
						if (item.grade) {
							if (!item.major) {
								line1 += ' '
							}
							line1 += formatGrade(item.grade)
						}
						if (!line1) {
							line1 = '--'
						}
						return line1
					},
					fontSize: 11,
					color: isDark ? '#ffffff' : '#666',
					lineHeight: 14,
					distance: 10
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
			right: '15%',
			bottom: '3%',
			top: '0%',
			containLabel: true
		},
		xAxis: {
			type: 'value',
			max: maxValue,
			axisLabel: {
				fontSize: 12,
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
				fontSize: 12,
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
					formatter: function (params) {
						const item = sortedData[params.dataIndex]
						let line1 = ''
						if (item.major) {
							line1 += item.major
						}
						if (item.major && item.grade) {
							line1 += ' '
						}
						if (item.grade) {
							if (!item.major) {
								line1 += ' '
							}
							line1 += formatGrade(item.grade)
						}
						if (!line1) {
							line1 = '--'
						}
						return line1
					},
					fontSize: 11,
					color: isDark ? '#ffffff' : '#666',
					lineHeight: 14,
					distance: 10
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
	const maxValue = sortedData.length > 0 ? sortedData[sortedData.length - 1].totalPoints : null

	const option = {
		tooltip: {
			show: false
		},
		legend: {
			data: ['签到积分', '活动积分'],
			top: '0%',
			right: '0%',
			textStyle: {
				color: isDark ? '#ffffff' : '#2c3e50',
				fontSize: 12
			}
		},
		grid: {
			left: '0%',
			right: '15%',
			bottom: '3%',
			top: '8%',
			containLabel: true
		},
		xAxis: {
			type: 'value',
			max: maxValue,
			axisLabel: {
				fontSize: 12,
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
				fontSize: 12,
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
					fontSize: 11,
					color: isDark ? '#ffffff' : '#666',
					distance: 10
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


const loadStudentInfoByStartId = async (startId = 1, limit = 30) => {
	// 创建一个数组来存储学生信息
	const students = []

	// 设置总数和当前加载计数
	totalCount.value = limit
	loadedCount.value = 0

	// 从 startId 开始，逐个加载学生信息
	while (loadedCount.value < totalCount.value) {
		const studentInfoId = startId + loadedCount.value
		const item = {
			studentInfoId,
			name: null,
			gender: null,
			college: null,
			grade: null,
			major: null,
			levelCode: null,
			hasAvatar: true, // 添加这个属性
			avatarUrl: null,
			totalPoints: 0, // 添加默认总积分
			signInPoints: 0, // 添加默认签到积分
			activityPoints: 0 // 添加默认活动积分
		}

		try {
			// 查询所有可公开字段：name, gender, college, grade, major
			const [nameResponse, genderResponse, collegeResponse, gradeResponse, majorResponse, levelResponse] = await Promise.all([
				getStudentPublicFieldValueById(studentInfoId, 'name').catch(() => ({code: 400, data: null})),
				getStudentPublicFieldValueById(studentInfoId, 'gender').catch(() => ({code: 400, data: null})),
				getStudentPublicFieldValueById(studentInfoId, 'college').catch(() => ({code: 400, data: null})),
				getStudentPublicFieldValueById(studentInfoId, 'grade').catch(() => ({code: 400, data: null})),
				getStudentPublicFieldValueById(studentInfoId, 'major').catch(() => ({code: 400, data: null})),
				getStudentLevelByInfoId(studentInfoId).catch(() => ({code: 400, data: null}))
			])

			// 填充学生信息
			if (nameResponse.code === 200 && nameResponse.data) {
				item.name = nameResponse.data
			}
			if (genderResponse.code === 200 && genderResponse.data) {
				item.gender = genderResponse.data
			}
			if (collegeResponse.code === 200 && collegeResponse.data) {
				item.college = collegeResponse.data
			}
			if (gradeResponse.code === 200 && gradeResponse.data) {
				item.grade = parseInt(gradeResponse.data)
			}
			if (majorResponse.code === 200 && majorResponse.data) {
				item.major = majorResponse.data
			}
			if (levelResponse.code === 200 && levelResponse.data !== null && levelResponse.data !== undefined) {
				item.levelCode = parseInt(levelResponse.data)
			}

			// 加载头像
			item.avatarUrl = getAvatarUrl(studentInfoId, 256)
			students.push(item)
			loadedCount.value++
		} catch (error) {
			// 出错时也要增加计数，避免无限循环
			loadedCount.value++
		}
	}

	return students
}


const loadSignInRanking = async () => {
	signInLoading.value = true
	try {
		const response = await getAttendanceTopRanking(selectedTopN)
		if (response.code === 200 && response.data) {
			signInRanking.value = response.data.map(item => ({
				studentInfoId: item.studentInfoId,
				attendanceCount: item.attendanceCount,
				signInPoints: Math.round(item.attendanceCount * 0.64)
			}))
			signInLoading.value = false
			await nextTick()
			if (signInRanking.value.length > 0) {
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
			}
		}
	} catch (error) {
		signInRanking.value = []
	} finally {
		signInLoading.value = false
	}
}

const loadActivityRanking = async () => {
	activityLoading.value = true
	try {
		const response = await getPointsTopRanking(selectedTopN)
		if (response.code === 200 && response.data) {
			activityRanking.value = response.data.map(item => ({
				targetStudentInfoId: item.targetStudentInfoId,
				activityPoints: item.totalPoints
			}))
			activityLoading.value = false
			await nextTick()
			if (activityRanking.value.length > 0) {
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
			}
		}
	} catch (error) {
		activityRanking.value = []
	} finally {
		activityLoading.value = false
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
		const [signInResponse, activityResponse] = await Promise.all([
			getAttendanceTopRanking(totalRankingTopN),
			getPointsTopRanking(totalRankingTopN)
		])

		if (signInResponse.code === 200 && activityResponse.code === 200) {
			const signInMap = new Map()
			signInResponse.data.forEach((item, index) => {
				signInMap.set(item.studentInfoId, {
					studentInfoId: item.studentInfoId,
					attendanceCount: item.attendanceCount,
					signInPoints: Math.round(item.attendanceCount * 0.64),
					signInRank: index + 1
				})
			})

			const activityMap = new Map()
			activityResponse.data.forEach((item, index) => {
				activityMap.set(item.targetStudentInfoId, {
					targetStudentInfoId: item.targetStudentInfoId,
					activityPoints: item.totalPoints,
					activityRank: index + 1
				})
			})

			const eligibleStudents = []
			const allStudentIds = new Set([...signInMap.keys(), ...activityMap.keys()])

			allStudentIds.forEach(studentId => {
				const signInData = signInMap.get(studentId)
				const activityData = activityMap.get(studentId)
				eligibleStudents.push({
					studentInfoId: studentId,
					signInPoints: signInData ? signInData.signInPoints : 0,
					activityPoints: activityData ? activityData.activityPoints : 0,
					totalPoints: (signInData ? signInData.signInPoints : 0) + (activityData ? activityData.activityPoints : 0)
				})
			})

			eligibleStudents.sort((a, b) => b.totalPoints - a.totalPoints)
			totalRanking.value = eligibleStudents

			// 立即显示基础列表（边加载边显示）
			filteredStudents.value = totalRanking.value
			topStudents.value = padTopStudents(searchKeyword.value ? filteredStudents.value : totalRanking.value, (searchKeyword.value ? filteredStudents.value : totalRanking.value).length)
			totalLoading.value = false

			// 计算统计数据
			calculateStatistics(totalRanking.value)

			// 异步加载学生详细信息
			await nextTick()
			if (totalRanking.value.length > 0) {
				const initChartWithRetry = async (retryCount = 0) => {
					if (totalChart.value) {
						await initTotalChart(totalRanking.value)
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
	} catch (error) {
		totalRanking.value = []
	} finally {
		totalLoading.value = false
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

// 计算统计数据
const calculateStatistics = (students) => {
	totalCount.value = students.length

	const colleges = {}
	const majors = {}
	const genders = {}
	const grades = {}

	students.forEach(student => {
		// 学院统计
		if (student.college) {
			colleges[student.college] = (colleges[student.college] || 0) + 1
		}

		// 专业统计
		if (student.major) {
			majors[student.major] = (majors[student.major] || 0) + 1
		}

		// 性别统计
		if (student.gender) {
			genders[student.gender] = (genders[student.gender] || 0) + 1
		}

		// 年级统计
		if (student.grade) {
			grades[student.grade] = (grades[student.grade] || 0) + 1
		}
	})

	collegeStats.value = colleges
	majorStats.value = majors
	genderStats.value = genders
	gradeStats.value = grades
}

// 自动刷新定时器
let refreshTimer = null

// 统一的刷新函数，根据当前激活的 tab 刷新对应的数据
const refreshData = async () => {
	// 总是刷新总积分排行榜（包含优秀成员数据）
	await loadTotalRanking()

	// 根据当前激活的 tab 刷新对应的排行榜
	if (activeTab.value === 'signIn') {
		await loadSignInRanking()
	} else if (activeTab.value === 'activity') {
		await loadActivityRanking()
	}
}

// 启动自动刷新
const startAutoRefresh = () => {
	// 清除已存在的定时器
	if (refreshTimer) {
		clearInterval(refreshTimer)
	}
	// 设置定时器，每隔1小时（3600000毫秒）刷新一次
	refreshTimer = setInterval(() => {
		refreshData()
	}, 3600000)
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
	// 重置关闭状态
	isClosingRecordsDialog.value = false

	// 设置当前学生
	currentStudent.value = student
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
	// 防止重复关闭
	if (isClosingRecordsDialog.value) return
	isClosingRecordsDialog.value = true

	// 先关闭弹窗，避免响应式更新
	recordsDialogVisible.value = false

	// 延迟清空数据，确保弹窗完全关闭后再清空
	setTimeout(() => {
		allRecords.value = []
		recordsLoading.value = false
		currentStudent.value = null
		isClosingRecordsDialog.value = false
	}, 0)
}

// 打开统计数据弹窗
const showStatisticsDialog = () => {
	// 重置关闭状态
	isClosingStatisticsDialog.value = false
	statisticsDialogVisible.value = true
}

// 关闭统计数据弹窗
const closeStatisticsDialog = () => {
	// 防止重复关闭
	if (isClosingStatisticsDialog.value) return
	isClosingStatisticsDialog.value = true

	// 先手动隐藏遮罩层，避免视觉闪烁
	const dialogWrapper = document.querySelector('.statistics-dialog-overlay')
	if (dialogWrapper) {
		dialogWrapper.style.display = 'none'
		dialogWrapper.style.visibility = 'hidden'
		dialogWrapper.style.opacity = '0'
	}

	// 关闭弹窗
	statisticsDialogVisible.value = false

	// 重置关闭状态
	setTimeout(() => {
		isClosingStatisticsDialog.value = false
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

// 搜索处理函数
const handleSearch = () => {
	if (!searchKeyword.value.trim()) {
		filteredStudents.value = totalRanking.value
		topStudents.value = padTopStudents(totalRanking.value, totalRanking.value.length)
		return
	}

	const keyword = searchKeyword.value.toLowerCase().trim()

	filteredStudents.value = totalRanking.value.filter(student => {
		// 搜索姓名
		if (student.name && student.name.toLowerCase().includes(keyword)) return true

		// 搜索性别
		if (student.gender && student.gender.toLowerCase().includes(keyword)) return true

		// 搜索学院
		if (student.college && student.college.toLowerCase().includes(keyword)) return true

		// 搜索专业
		if (student.major && student.major.toLowerCase().includes(keyword)) return true

		// 搜索年级（支持"大一"、"大二"等格式）
		if (student.grade) {
			const gradeText = formatGrade(student.grade).toLowerCase()
			if (gradeText.includes(keyword)) return true
			if (student.grade.toString().includes(keyword)) return true
		}

		// 搜索总积分
		if (student.totalPoints !== undefined && student.totalPoints.toString().includes(keyword)) return true

		// 搜索签到积分
		if (student.signInPoints !== undefined && student.signInPoints.toString().includes(keyword)) return true

		// 搜索活动积分
		if (student.activityPoints !== undefined && student.activityPoints.toString().includes(keyword)) return true

		return false
	})

	topStudents.value = padTopStudents(filteredStudents.value, filteredStudents.value.length)
}


onMounted(async () => {
	await nextTick()

	// 使用 AllMembersPage 加载数据
	const allMembersPage = new AllMembersPage()
	await allMembersPage.initData()

	// 将加载的学生数据绑定到页面
	totalRanking.value = allMembersPage.currentPageToShowStudentProfiles || []
	filteredStudents.value = allMembersPage.currentPageToShowStudentProfiles || []

	// 调用 padTopStudents 处理数据
	topStudents.value = padTopStudents(filteredStudents.value, filteredStudents.value.length)

	// 更新计数器
	loadedCount.value = filteredStudents.value.length
	totalCount.value = allMembersPage.sortedStudentInfoIds?.length || 0

	// 计算统计数据
	calculateStatistics(totalRanking.value)

	window.addEventListener('resize', handleResize)
	startQuoteRotation()
	startAutoRefresh()
})


onUnmounted(() => {
	stopQuoteRotation()
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

<style scoped>
/* 阴影系统 CSS 变量 - 根据主题模式调整 */
/* 日间模式：使用深灰色阴影（而非纯黑色）增强对比度，不透明度 0.2-0.3，增大模糊半径和扩散范围 */
/* 参考 Material Design 3、Ant Design、腾讯云等：避免纯黑色，使用深灰色 rgba(30-50, 30-50, 30-50) */
:root {
	--shadow-sm: 0 2px 12px rgba(30, 30, 30, 0.2), 0 1px 4px rgba(30, 30, 30, 0.15);
	--shadow-md: 0 4px 20px rgba(40, 40, 40, 0.25), 0 2px 8px rgba(40, 40, 40, 0.18);
	--shadow-lg: 0 8px 40px rgba(50, 50, 50, 0.3), 0 4px 16px rgba(50, 50, 50, 0.22), 0 2px 8px rgba(50, 50, 50, 0.15);
	--shadow-primary: 0 2px 12px rgba(102, 126, 234, 0.35), 0 1px 4px rgba(102, 126, 234, 0.25);
	--shadow-card: 0 4px 20px rgba(40, 40, 40, 0.25), 0 2px 8px rgba(40, 40, 40, 0.18);
	--shadow-button: 0 8px 40px rgba(102, 126, 234, 0.5), 0 4px 16px rgba(102, 126, 234, 0.35);
}

html.dark {
	--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
	--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
	--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2);
	--shadow-primary: 0 2px 8px rgba(102, 126, 234, 0.2);
	--shadow-card: 0 4px 16px rgba(0, 0, 0, 0.12);
	--shadow-button: 0 8px 32px rgba(102, 126, 234, 0.3);
}


.points-dashboard-container {
	min-height: 100vh;
	background: var(--bg-primary);
	display: flex;
	flex-direction: column;
}

.header {
	position: sticky;
	top: 0;
	z-index: 100;
	background: rgba(255, 255, 255, 0.05);
	backdrop-filter: blur(20px);
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	padding: 12px 24px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
	min-height: 72px;
	flex-shrink: 0;
}

.header-left {
	display: flex;
	align-items: center;
	gap: 12px;
	position: absolute;
	left: 24px;
	z-index: 1;
}

.header-left .back-btn,
.header-left .logo {
	flex-shrink: 0;
}

.header-right {
	display: flex;
	align-items: center;
	gap: 20px;
	position: absolute;
	right: 24px;
	z-index: 1;
}

.slogan {
	display: flex;
	align-items: center;
	padding: 16px 16px 0px 16px;
	margin-right: 8px;
}

.slogan-img {
	height: 80px;
	transition: filter 0.3s ease;
}

html.dark .slogan-img {
	filter: invert(1);
}

.back-btn {
	width: 48px;
	height: 48px;
	background: var(--primary-color);
	border: none;
	box-shadow: var(--shadow-button);
}

.logo {
	width: 64px;
	height: 64px;
	cursor: pointer;
	border-radius: 0;
}

.title-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	flex: 1;
}

.title-section .main-title {
	font-size: 32px;
	font-weight: 800;
	margin: 0;
	padding: 0;
	line-height: 1.2;
	background: linear-gradient(135deg, #667eea, #764ba2);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	letter-spacing: 2px;
	text-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
	display: block;
}

.title-section h1 {
	font-size: 32px;
	font-weight: 700;
	margin: 0;
	background: linear-gradient(135deg, #667eea, #764ba2);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.title-section p {
	font-size: 16px;
	color: var(--text-secondary);
	margin: 8px 0 0 0;
	font-weight: 500;
}

.main-content[data-v-eba736f6] {
	padding: 16px 16px;
	max-width: 100%;
	width: 100%;
	flex: 1;
	display: flex;
	flex-direction: column;
}

.dashboard-layout {
	display: grid;
	grid-template-columns: auto 1fr;
	gap: 20px;
	flex: 1;
	min-height: 0;
}

.dashboard-main {
	min-width: 0;
	width: fit-content;
	max-width: 550px;
}

.ranking-tabs {
	width: 550px;
	margin-left: 0%;
	margin-top: 0%;
}

.ranking-topbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	margin-bottom: 32px;
	flex-wrap: wrap;
}

.ranking-arrows {
	display: flex;
	gap: 6px;
	align-items: center;
	margin-bottom: 0;
	background: rgba(255, 255, 255, 0.6);
	border: 1px solid rgba(102, 126, 234, 0.2);
	border-radius: 14px;
	padding: 4px 8px;
	backdrop-filter: blur(6px);
}

html.dark .ranking-arrows {
	background: rgba(15, 23, 42, 0.65);
	border: 1px solid rgba(255, 255, 255, 0.08);
}

.ranking-arrows .el-button {
	padding: 4px;
	width: 28px;
	height: 28px;
}

.ranking-label {
	font-size: 12px;
	font-weight: 700;
	color: var(--text-primary);
	padding: 2px 8px;
	border-radius: 12px;
	background: rgba(102, 126, 234, 0.1);
	border: 1px solid rgba(102, 126, 234, 0.2);
	line-height: 18px;
	white-space: nowrap;
}

html.dark .ranking-label {
	background: rgba(255, 255, 255, 0.08);
	border: 1px solid rgba(255, 255, 255, 0.12);
}

.ranking-topbar .color-legend {
	margin-left: auto;
}

.dashboard-side {
	min-width: 0;
	width: 100%;
	display: flex;
	flex-direction: column;
}

.side-card {
	background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(0, 242, 254, 0.08) 100%);
	border: 1px solid rgba(102, 126, 234, 0.2);
	border-radius: 20px;
	padding: 0 24px 0px 24px;
	backdrop-filter: blur(20px);
	box-shadow: var(--shadow-lg);
	width: 100%;
	display: flex;
	flex-direction: column;
}

.side-card-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	margin-bottom: 12px;
	margin-top: 1%;
	padding-top: 0;
	padding-bottom: 10px;
	border-bottom: 1px solid rgba(102, 126, 234, 0.15);
	flex-shrink: 0;
	position: relative;
}

.random-quote-container {
	position: absolute;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	width: fit-content;
	padding: 12px 18px;
	background: transparent;
	border-radius: 12px;
	border: none;
	backdrop-filter: none;
	box-shadow: none;
	z-index: 5;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	margin-right: 0;
}

.random-quote {
	font-size: 13.5px;
	color: var(--text-primary);
	line-height: 1.8;
	text-align: right;
	opacity: 0;
	transition: opacity 0.5s ease-in-out;
	font-weight: 500;
	letter-spacing: 0.5px;
	word-break: break-word;
	overflow-wrap: break-word;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.random-quote.fade-in {
	opacity: 0.95;
}

.card-header-left {
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
}

.side-card-title {
	font-size: 24px;
	font-weight: 800;
	color: var(--text-primary);
	background: linear-gradient(135deg, var(--primary-color), #00d4ff, #00f2fe);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	letter-spacing: 0.6px;
	text-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
	position: relative;
	display: inline-block;
}

.side-card-subtitle {
	font-size: 11px;
	color: var(--text-secondary);
	margin-top: 4px;
	opacity: 0.85;
}

.side-card-body {
	display: grid;
	grid-template-columns: repeat(10, minmax(0, 1fr));
	grid-auto-rows: min-content;
	gap: 6px;
	width: 100%;
	align-items: start;
	position: relative;
	padding-top: 10px;
	overflow: hidden;
}

/* 全部成员块对角线光影扫过效果 */
.side-card-body::after {
	content: '';
	position: absolute;
	top: -50%;
	left: -50%;
	width: 200%;
	height: 200%;
	background: linear-gradient(
		135deg,
		transparent 30%,
		rgba(255, 255, 255, 0.15) 50%,
		transparent 70%
	);
	transform: translate(-100%, -100%);
	animation: diagonal-sweep 3s ease-in-out infinite;
	pointer-events: none;
	z-index: 10;
}

@keyframes diagonal-sweep {
	0% {
		transform: translate(-100%, -100%);
		opacity: 0;
	}
	10% {
		opacity: 1;
	}
	90% {
		opacity: 1;
	}
	100% {
		transform: translate(100%, 100%);
		opacity: 0;
	}
}


.side-student {
	display: flex;
	flex-direction: column;
	gap: 7px;
	padding: 12px;
	border-radius: 10px;
	background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
	box-shadow: var(--shadow-card), 0 2px 8px rgba(102, 126, 234, 0.1);
	position: relative;
	overflow: visible;
	min-height: 0;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	animation: card-enter 0.6s ease-out backwards;
	z-index: 2;
}

.side-student::before {
	content: '';
	position: absolute;
	inset: 0;
	border-radius: 10px;
	padding: 1.5px;
	background: linear-gradient(135deg, transparent 0%, transparent 60%, rgba(102, 126, 234, 0.08) 100%);
	-webkit-mask-composite: xor;
	mask-composite: exclude;
	pointer-events: none;
	z-index: 0;
}

.side-student.level-club-member {
	background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%);
}

.side-student.level-club-member::before {
	background: linear-gradient(135deg, transparent 0%, transparent 60%, rgba(59, 130, 246, 0.12) 100%);
}

.side-student.level-normal-member {
	background: linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.06) 100%);
}

.side-student.level-normal-member::before {
	background: linear-gradient(135deg, transparent 0%, transparent 60%, rgba(34, 197, 94, 0.12) 100%);
}

.side-student.level-core-member {
	background: linear-gradient(135deg, rgba(251, 191, 36, 0.12) 0%, rgba(251, 191, 36, 0.06) 100%);
}

.side-student.level-core-member::before {
	background: linear-gradient(135deg, transparent 0%, transparent 60%, rgba(251, 191, 36, 0.12) 100%);
}

.side-student.level-admin {
	background: linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.06) 100%);
}

.side-student.level-admin::before {
	background: linear-gradient(135deg, transparent 0%, transparent 60%, rgba(239, 68, 68, 0.12) 100%);
}

.side-student:nth-child(1) {
	animation-delay: 0.1s;
}

.side-student:nth-child(2) {
	animation-delay: 0.2s;
}

.side-student:nth-child(3) {
	animation-delay: 0.3s;
}

.side-student:nth-child(4) {
	animation-delay: 0.4s;
}

.side-student:nth-child(5) {
	animation-delay: 0.5s;
}

.side-student:nth-child(6) {
	animation-delay: 0.6s;
}

.side-student:nth-child(7) {
	animation-delay: 0.7s;
}

.side-student:nth-child(8) {
	animation-delay: 0.8s;
}

.side-student:nth-child(9) {
	animation-delay: 0.9s;
}

.side-student:nth-child(10) {
	animation-delay: 1.0s;
}

.side-student:nth-child(11) {
	animation-delay: 1.1s;
}

.side-student:nth-child(12) {
	animation-delay: 1.2s;
}


.side-student.is-placeholder {
	opacity: 0.6;
	box-shadow: none;
	background: rgba(255, 255, 255, 0.02);
	border: 1.5px dashed rgba(102, 126, 234, 0.2);
}

.side-student.is-placeholder::before {
	display: none;
}


.side-info {
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 8px;
	flex: 1;
	justify-content: flex-start;
	position: relative;
	z-index: 2;
	min-height: 0;
	overflow: hidden;
}

.side-avatar-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 7px;
	margin-bottom: 0;
}

.side-avatar {
	width: 56px;
	height: 56px;
	background: linear-gradient(135deg, #667eea, #764ba2);
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
	flex-shrink: 0;
	position: relative;
	overflow: hidden;
}


.side-avatar.has-avatar {
	background: transparent;
}

.side-avatar.no-avatar {
	background: linear-gradient(135deg, #667eea, #764ba2);
}

.side-avatar .avatar-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 8px;
	position: relative;
	z-index: 0;
}

.side-avatar .avatar-icon {
	color: white;
	position: relative;
	z-index: 0;
}


.side-name {
	font-size: 12px;
	font-weight: 700;
	color: var(--text-primary);
	word-break: break-word;
	line-height: 1.3;
	letter-spacing: 0.1px;
	flex: 1;
	min-width: 0;
}


.side-content {
	display: flex;
	flex-direction: column;
	gap: 9px;
	flex: 1;
	min-width: 0;
}

.side-meta {
	display: flex;
	flex-direction: column;
	gap: 4px;
	font-size: 10px;
	color: var(--text-primary);
	min-height: 0;
	width: 100%;
}

.side-meta .meta-row {
	display: flex;
	flex-direction: row;
	gap: 4px;
	flex-wrap: nowrap;
	align-items: center;
	justify-content: center;
	width: 100%;
}

.side-meta .meta-line {
	padding: 2px 4px;
	border-radius: 4px;
	background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(0, 242, 254, 0.08) 100%);
	border: 1px solid rgba(102, 126, 234, 0.2);
	line-height: 1.3;
	cursor: default;
	width: fit-content;
	flex: 0 0 auto;
	box-sizing: border-box;
	font-weight: 500;
	box-shadow: var(--shadow-primary);
	position: relative;
	font-size: 10px;
	white-space: nowrap;
	text-align: center;
}


.side-meta .meta-line-first {
	min-height: 0;
	font-weight: 600;
	color: var(--primary-color);
}

.side-meta .meta-line-second {
	min-height: 0;
	font-size: 9px;
	color: var(--text-secondary);
}

.unified-legend {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 16px;
	flex: 1;
	min-width: 0;
	padding: 0;
	border-bottom: none;
	align-items: center;
}

.unified-legend .legend-section {
	display: flex;
	align-items: center;
	gap: 16px;
	flex-wrap: wrap;
}

.unified-legend .legend-item {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	color: var(--text-secondary);
	font-size: 12px;
}

.unified-legend .legend-dot {
	width: 10px;
	height: 10px;
	border-radius: 50%;
	display: inline-block;
	box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2);
	flex-shrink: 0;
}

.unified-legend .legend-club-member {
	background: linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.6) 100%);
}

.unified-legend .legend-normal-member {
	background: linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(34, 197, 94, 0.6) 100%);
}

.unified-legend .legend-core-member {
	background: linear-gradient(135deg, rgba(251, 191, 36, 0.8) 0%, rgba(251, 191, 36, 0.6) 100%);
}

.unified-legend .legend-admin {
	background: linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, rgba(239, 68, 68, 0.6) 100%);
}

.unified-legend .legend-total {
	background: linear-gradient(135deg, var(--primary-color), #00d4ff, #00f2fe);
}

.unified-legend .legend-signin {
	background: linear-gradient(135deg, #10b981, #059669, #047857);
}

.unified-legend .legend-activity {
	background: linear-gradient(135deg, #f59e0b, #d97706, #b45309);
}

.unified-legend .legend-text {
	font-size: 12px;
	color: var(--text-secondary);
	white-space: nowrap;
}

.unified-legend .statistics-section {
	padding: 8px 12px;
	background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(0, 242, 254, 0.05) 100%);
	border-radius: 8px;
	border: 1px solid rgba(102, 126, 234, 0.15);
}

.unified-legend .statistics-item {
	gap: 6px;
}

.unified-legend .statistics-label {
	font-size: 12px;
	font-weight: 600;
	color: var(--primary-color);
}

.unified-legend .statistics-value {
	font-size: 13px;
	font-weight: 700;
	color: var(--text-primary);
	background: linear-gradient(135deg, var(--primary-color), #00d4ff);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.unified-legend .hint-icon {
	font-size: 14px;
	color: var(--primary-color);
	flex-shrink: 0;
}


.side-points {
	display: flex;
	flex-direction: column;
	gap: 3px;
	padding-top: 7px;
	border-top: 1px solid rgba(102, 126, 234, 0.1);
	flex-shrink: 0;
}

.points-total-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 6px;
	flex-wrap: wrap;
}

.points-formula {
	display: flex;
	align-items: center;
	gap: 4px;
	flex-wrap: nowrap;
	flex: 1;
	min-width: 0;
}

.points-total {
	font-size: 14px;
	font-weight: 800;
	letter-spacing: 0.2px;
	flex-shrink: 0;
}

.points-equals {
	color: var(--text-secondary);
	font-size: 12px;
	font-weight: 600;
	flex-shrink: 0;
	margin: 0 1px;
}

.points-plus {
	color: var(--text-secondary);
	font-size: 12px;
	font-weight: 600;
	flex-shrink: 0;
	margin: 0 1px;
}

.points-total-main {
	color: var(--primary-color);
	background: linear-gradient(135deg, var(--primary-color), #00d4ff, #00f2fe);
	background-size: 200% 200%;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	text-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
	animation: points-gradient-flow 3s ease infinite;
}


.points-detail {
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 11px;
	line-height: 1.3;
}

.points-number {
	font-weight: 700;
	font-size: 11px;
	flex-shrink: 0;
}

.points-number.points-signin {
	color: #10b981;
	background: linear-gradient(135deg, #10b981, #059669, #047857);
	background-size: 200% 200%;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.points-number.points-activity {
	color: #f59e0b;
	background: linear-gradient(135deg, #f59e0b, #d97706, #b45309);
	background-size: 200% 200%;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.points-separator {
	color: var(--text-secondary);
	opacity: 0.5;
	font-size: 10px;
}

.points-placeholder {
	font-size: 11px;
	color: var(--text-secondary);
	opacity: 0.6;
}

.side-records {
	margin-top: 6px;
	display: flex;
	flex-direction: column;
	gap: 4px;
	flex-shrink: 0;
}

.record-list {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.record-item {
	display: flex;
	align-items: flex-start;
	gap: 8px;
	font-size: 11px;
	color: var(--text-primary);
	padding: 6px 8px;
	border-radius: 6px;
	background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(0, 242, 254, 0.06) 100%);
	border: 1px solid rgba(102, 126, 234, 0.15);
}

.record-points {
	font-weight: 700;
	font-size: 13px;
	min-width: 40px;
	text-align: center;
	padding: 2px 6px;
	border-radius: 6px;
	flex-shrink: 0;
}

.record-points.positive {
	color: #10b981;
	background: rgba(16, 185, 129, 0.15);
	border: 1px solid rgba(16, 185, 129, 0.3);
}

.record-points.negative {
	color: #ef4444;
	background: rgba(239, 68, 68, 0.15);
	border: 1px solid rgba(239, 68, 68, 0.3);
}

.record-reason {
	color: var(--text-primary);
	flex: 1;
	word-break: break-all;
	line-height: 1.5;
	opacity: 0.9;
}

.side-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 8px;
	color: var(--text-secondary);
	padding: 32px 12px;
	font-size: 13px;
}

.ranking-header {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	gap: 8px;
	margin-bottom: 12px;
}

.ranking-arrows {
	display: flex;
	gap: 6px;
	position: absolute;
	top: 8px;
	left: 8px;
	align-items: center;
}

.ranking-arrows .el-button {
	padding: 4px;
	width: 28px;
	height: 28px;
}

.ranking-label {
	font-size: 12px;
	font-weight: 700;
	color: var(--text-primary);
	padding: 2px 8px;
	border-radius: 12px;
	background: rgba(255, 255, 255, 0.08);
	border: 1px solid rgba(255, 255, 255, 0.12);
	line-height: 18px;
}

.ranking-tabs {
	background: rgba(255, 255, 255, 0.05);
	border-radius: 20px;
	padding: 20px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(20px);
}

:deep(.el-tabs__header) {
	margin: 0 0 24px 0;
}

:deep(.el-tabs__nav-wrap::after) {
	background-color: rgba(255, 255, 255, 0.1);
}

:deep(.el-tabs__item) {
	color: var(--text-secondary);
	font-size: 16px;
	font-weight: 500;
	padding: 0 24px;
	height: 48px;
	line-height: 48px;
}

:deep(.el-tabs__item.is-active) {
	color: var(--primary-color);
	font-weight: 600;
}

:deep(.el-tabs__active-bar) {
	background-color: var(--primary-color);
	height: 3px;
}

.ranking-list-container {
	min-height: 320px;
}

.loading-container,
.empty-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 80px 20px;
	gap: 16px;
	color: var(--text-secondary);
}

.loading-container .el-icon {
	font-size: 48px;
	color: var(--primary-color);
}

.empty-container .el-icon {
	font-size: 48px;
	color: var(--text-secondary);
}

.points-chart {
	width: 100%;
	height: 550px;
}

.color-legend {
	display: flex;
	align-items: center;
	gap: 16px;
	margin: 8px 0 4px;
}

.legend-item {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	color: var(--text-secondary);
	font-size: 13px;
}

.legend-dot {
	width: 12px;
	height: 12px;
	border-radius: 50%;
	display: inline-block;
	box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2);
}

.legend-signin {
	background: linear-gradient(135deg, #4facfe, #60a5fa);
}

.legend-activity {
	background: linear-gradient(135deg, #00f2fe, #00d4ff);
}

.formula-card {
	background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(0, 242, 254, 0.05) 100%);
	border-radius: 12px;
	padding: 16px 20px;
	margin-bottom: 20px;
	border: 1px solid rgba(102, 126, 234, 0.15);
	backdrop-filter: blur(10px);
	box-shadow: var(--shadow-sm);
}

.formula-content {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.formula-item {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 14px;
	color: var(--text-primary);
	flex-wrap: wrap;
	line-height: 1.5;
}

.formula-label {
	font-weight: 600;
	color: var(--primary-color);
	font-size: 14px;
	letter-spacing: 0.3px;
}

.formula-equals {
	color: var(--text-secondary);
	font-weight: 500;
	margin: 0 2px;
	font-size: 15px;
}

.formula-value {
	background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(0, 242, 254, 0.12) 100%);
	padding: 4px 12px;
	border-radius: 6px;
	color: var(--primary-color);
	font-weight: 500;
	border: 1px solid rgba(102, 126, 234, 0.2);
	font-size: 13px;
}

.formula-operator {
	color: var(--text-secondary);
	font-weight: 600;
	margin: 0 4px;
	font-size: 16px;
	opacity: 0.8;
}

.formula-desc {
	font-size: 12px;
	color: var(--text-secondary);
	line-height: 1.6;
	margin-top: 8px;
	padding-top: 12px;
	border-top: 1px solid rgba(102, 126, 234, 0.15);
	opacity: 0.85;
}

.formula-card.formula-mini {
	padding: 14px 18px;
	margin-bottom: 16px;
}

.formula-card.formula-mini .formula-item {
	font-size: 13px;
	gap: 6px;
}

.formula-card.formula-mini .formula-label,
.formula-card.formula-mini .formula-value,
.formula-card.formula-mini .formula-equals {
	font-size: 13px;
}

.formula-card.formula-mini .formula-value {
	padding: 3px 10px;
	font-size: 12px;
}

.formula-card.formula-mini .formula-operator {
	font-size: 14px;
	margin: 0 3px;
}

.formula-card.formula-mini .formula-desc {
	font-size: 11px;
	margin-top: 6px;
	padding-top: 10px;
}

.view-records-btn {
	width: 24px;
	height: 24px;
	padding: 0;
	flex-shrink: 0;
	backdrop-filter: blur(10px);
	background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(0, 242, 254, 0.1) 100%);
	border: 1px solid rgba(102, 126, 234, 0.35);
	box-shadow: var(--shadow-primary);
}

.view-records-btn :deep(.el-button__inner) {
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--primary-color);
}

.view-records-btn .el-icon {
	font-size: 12px;
	color: var(--primary-color);
}

.records-dialog :deep(.el-dialog__body) {
	padding: 20px;
	max-height: 70vh;
	overflow-y: auto;
}

/* 完全禁用弹窗过渡动画，避免闪烁 */
.records-dialog :deep(.el-dialog__wrapper) {
	transition: none !important;
	animation: none !important;
}

.records-dialog :deep(.el-dialog) {
	transition: none !important;
	animation: none !important;
	transform: none !important;
}

.records-dialog :deep(.el-overlay) {
	transition: none !important;
	animation: none !important;
}

.records-dialog :deep(.el-dialog__body) {
	transition: none !important;
	animation: none !important;
}

.records-dialog :deep(.el-dialog__header) {
	transition: none !important;
	animation: none !important;
}

/* 禁用 BaseTransition 组件的过渡动画 */
.records-dialog :deep(.el-fade-in),
.records-dialog :deep(.el-fade-in-linear),
.records-dialog :deep(.el-zoom-in-center),
.records-dialog :deep(.el-zoom-in-top),
.records-dialog :deep(.el-zoom-in-bottom) {
	transition: none !important;
	animation: none !important;
}

.records-loading,
.records-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60px 20px;
	gap: 16px;
	color: var(--text-secondary);
}

.records-loading .el-icon {
	font-size: 48px;
	color: var(--primary-color);
}

.records-empty .el-icon {
	font-size: 48px;
	color: var(--text-secondary);
}

.records-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: 16px;
}

.record-card {
	background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(0, 242, 254, 0.05) 100%);
	border: 1px solid rgba(102, 126, 234, 0.15);
	border-radius: 12px;
	padding: 16px;
	backdrop-filter: blur(10px);
	box-shadow: var(--shadow-sm);
}

.record-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12px;
}

.record-time {
	font-size: 13px;
	color: var(--text-secondary);
	font-weight: 500;
}

.record-points-badge {
	font-size: 16px;
	font-weight: 700;
	padding: 4px 12px;
	border-radius: 6px;
	min-width: 60px;
	text-align: center;
}

.record-points-badge.positive {
	color: #10b981;
	background: rgba(16, 185, 129, 0.15);
	border: 1px solid rgba(16, 185, 129, 0.3);
}

.record-points-badge.negative {
	color: #ef4444;
	background: rgba(239, 68, 68, 0.15);
	border: 1px solid rgba(239, 68, 68, 0.3);
}

/* 动画关键帧定义 */
@keyframes card-enter {
	0% {
		opacity: 0;
		transform: translateY(20px) scale(0.95);
	}
	100% {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}


@keyframes points-gradient-flow {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}

.record-reason-text {
	font-size: 14px;
	color: var(--text-primary);
	line-height: 1.6;
	word-break: break-word;
}

/* 统计数据弹窗样式 */
.statistics-dialog :deep(.el-dialog__body) {
	padding: 20px;
	max-height: 70vh;
	overflow-y: auto;
}

/* 禁用统计数据弹窗过渡动画，避免闪烁 */
.statistics-dialog :deep(.el-dialog__wrapper) {
	transition: none !important;
	animation: none !important;
}

.statistics-dialog :deep(.el-dialog) {
	transition: none !important;
	animation: none !important;
	transform: none !important;
}

.statistics-content {
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.statistics-section-wrapper {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.statistics-section-title {
	font-size: 16px;
	font-weight: 700;
	color: var(--primary-color);
	padding-bottom: 8px;
	border-bottom: 2px solid rgba(102, 126, 234, 0.2);
}

.statistics-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
	gap: 12px;
}

.statistics-card {
	background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(0, 242, 254, 0.05) 100%);
	border: 1px solid rgba(102, 126, 234, 0.15);
	border-radius: 10px;
	padding: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	backdrop-filter: blur(10px);
	box-shadow: var(--shadow-sm);
	transition: all 0.3s ease;
}

.statistics-card:hover {
	transform: translateY(-2px);
	box-shadow: var(--shadow-md);
	border-color: rgba(102, 126, 234, 0.3);
}

.statistics-card-label {
	font-size: 13px;
	color: var(--text-secondary);
	font-weight: 500;
	text-align: center;
}

.statistics-card-value {
	font-size: 20px;
	font-weight: 700;
	color: var(--primary-color);
	background: linear-gradient(135deg, var(--primary-color), #00d4ff);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

</style>
