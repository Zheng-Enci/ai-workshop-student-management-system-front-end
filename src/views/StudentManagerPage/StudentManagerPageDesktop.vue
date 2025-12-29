<template>
	<div class="page_header">
		<div class="page-header">
			<!-- 页面头部左侧块 -->
			<div class="page-header-left">
				<el-button
					@click="goBack"
					title="返回导航页"
				>
					<el-icon>
						<ArrowLeft/>
					</el-icon>
				</el-button>
				<img
					ref="logoRef"
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊学生管理系统"
					@click="toggleTheme"
					title="切换主题模式"
				>
			</div>
			<!-- 页面头部中间块 -->
			<div class="page-header-middle">
				<h1>学生管理</h1>
			</div>
			<!-- 页面头部右侧块 -->
			<div class="page-header-right" v-if="studentManagerPage.adminStudentAvatarUrl">
				<img
					v-lazy="studentManagerPage.adminStudentAvatarUrl"
					alt="管理员头像"
				>
			</div>
		</div>
		<div class="student-cards">
			<!-- 学生卡片列表块头部 -->
			<div class="student-cards-header">
				<h2>管理的学生列表</h2>
				<el-input
					v-model="searchQuery"
					placeholder="搜索学生姓名、学号或专业..."
					clearable
					@input="handleSearch"
					@clear="handleClearSearch"
				>
					<template #prefix>
						<el-icon>
							<Search/>
						</el-icon>
					</template>
				</el-input>
				<div>
					<el-button
						type="info"
						@click="sortByAttendance"
						:class="{ 'active': sortOrder === 'attendance' }"
					>
						<el-icon>
							<Sort/>
						</el-icon>
						按打卡次数排序
					</el-button>
					<el-button
						type="primary"
						@click="refreshStudents"
						:loading="loading"
					>
						<el-icon>
							<Refresh/>
						</el-icon>
						刷新
					</el-button>
				</div>
			</div>
			<!-- 学生卡片列表块内容 -->
			<div class="student-cards-list" v-if="!loading && filteredStudents.length > 0">
				<div class="student-cards-list-item" v-for="student in filteredStudents" :key="student.studentId">
					<!-- 学生卡片头部块 -->
					<div class="student-cards-list-item-header">

						<!-- 块1：头像 -->
						<img
							v-if="getStudentAvatarUrl(student)"
							v-lazy="getStudentAvatarUrl(student)"
							:alt="student.name"
							class="student-avatar-img"
							@error="handleAvatarError"
						/>

						<!-- 块2：学号 名字和签到次数 -->
						<div class="student-cards-list-item-header-name--student_id-attendance-count">
							<div>
								<span>姓名：</span>
								<span>{{ student.name }}</span>
							</div>
							<div>
								<span>学号：</span>
								<span>{{ student.studentId }}</span>
							</div>
							<div class="stat-item">
								<span class="label-checkin-count">签到次数：</span>
								<span class="value">{{ student.checkInCount }}次</span>
							</div>
						</div>
					</div>

					<!-- 学生卡片积分块 -->
					<div class="student-cards-list-item-points">
						<div>
							<span>总积分:&nbsp;</span>
							<span>{{ student.points + Math.round(student.checkInCount * 0.64) }}</span>
						</div>

						<div>
							<span>活动积分:&nbsp;</span>
							<span>{{ student.points }}</span>
						</div>
						<div>
							<span>签到积分:&nbsp;</span>
							<span>{{ Math.round(student.checkInCount * 0.64) }}</span>
						</div>
					</div>
					<!-- 学生卡片其他信息块 -->
					<div class="student-cards-list-item-other_info">
						<div>
							<span>年级:&nbsp;</span>
							<span>{{ student.grade }}年级</span>
						</div>
						<div>
							<span>专业:&nbsp;</span>
							<span>{{ student.major }}</span>
						</div>
						<div>
							<span>班级:&nbsp;</span>
							<span>{{ student.classNum }}班</span>
						</div>
						<div>
							<span>性别:&nbsp;</span>
							<span>{{ student.gender }}</span>
						</div>
						<div>
							<span>手机:&nbsp;</span>
							<span>{{ student.phone }}</span>
						</div>
					</div>
					<!-- 学生卡片按钮块 -->
					<div class="student-cards-list-item-buttons">
						<el-button
							type="success"
							size="small"
							@click="openAttendanceRecordsDialog(student)"
						>
							<el-icon>
								<Calendar/>
							</el-icon>
							考勤记录
						</el-button>
						<el-button
							type="warning"
							size="small"
							@click="openMakeupDialog(student)"
						>
							<el-icon>
								<Clock/>
							</el-icon>
							补卡
						</el-button>
						<el-button
							type="info"
							size="small"
							@click="openHeatmapDialog(student)"
						>
							<el-icon>
								<Star/>
							</el-icon>
							热力图
						</el-button>
						<el-button
							type="primary"
							size="small"
							@click="openTrendChartDialog(student)"
						>
							<el-icon>
								<TrendCharts/>
							</el-icon>
							趋势图
						</el-button>
					</div>
				</div>
			</div>

			<div class="empty-state" v-if="!loading && managedStudents.length === 0">
				<el-icon size="64" class="empty-icon">
					<User/>
				</el-icon>
				<h3>暂无管理的学生</h3>
				<p>您当前没有管理任何学生</p>
			</div>

			<div class="no-search-results"
				 v-if="!loading && managedStudents.length > 0 && filteredStudents.length === 0 && searchQuery">
				<el-icon size="64" class="empty-icon">
					<Search/>
				</el-icon>
				<h3>未找到匹配的学生</h3>
				<p>请尝试其他关键词或清空搜索条件</p>
			</div>

			<div class="loading-state" v-if="loading">
				<el-icon size="32" class="loading-icon">
					<Loading/>
				</el-icon>
				<p>加载中...</p>
			</div>
		</div>

		<el-dialog
			v-model="makeupDialogVisible"
			:title="null"
			width="90%"
			:close-on-click-modal="false"
			class="makeup-dialog"
			:show-close="false"
			v-if="makeupDialogVisible"
			:modal="true"
			:append-to-body="true"
			:teleported="true"
			modal-class="makeup-overlay"
			:destroy-on-close="true"
		>
			<div class="makeup-header">
				<div class="header-icon">
					<el-icon size="28">
						<Clock/>
					</el-icon>
				</div>
				<div class="header-content">
					<h3>学生补卡</h3>
					<p>为指定学生进行补卡操作</p>
				</div>
			</div>

			<div class="makeup-content">
				<div class="student-info-card">
					<div class="student-avatar">
						<el-icon size="36">
							<User/>
						</el-icon>
					</div>
					<div class="student-details">
						<div class="student-name">{{ makeupSelectedStudent?.name }}</div>
						<div class="student-id">{{ makeupSelectedStudent?.studentId }}</div>
						<div class="student-grade">{{ makeupSelectedStudent?.grade }}年级 ·
							{{ makeupSelectedStudent?.major }}
						</div>
					</div>
				</div>

				<div class="form-section">
					<div class="form-header">
						<el-icon class="form-icon">
							<Calendar/>
						</el-icon>
						<span class="form-title">选择补卡时间</span>
					</div>
					<div class="form-content">
						<el-date-picker
							v-model="makeupForm.attendanceTime"
							type="datetime"
							placeholder="请选择补卡时间"
							format="YYYY年MM月DD日 HH:mm"
							value-format="YYYY-MM-DDTHH:mm:ss"
							class="datetime-picker"
							:shortcuts="timeShortcuts"
						/>
						<div class="form-tip">
							<el-icon>
								<InfoFilled/>
							</el-icon>
							<span>补卡时间不受签到时间段限制</span>
						</div>
					</div>
				</div>
			</div>

			<div class="makeup-footer">
				<el-button
					@click="closeMakeupDialog"
					class="cancel-btn"
					size="large"
				>
					取消
				</el-button>
				<el-button
					type="primary"
					@click="submitMakeup"
					:loading="makeupLoading"
					class="submit-btn"
					size="large"
				>
					<el-icon v-if="!makeupLoading">
						<Check/>
					</el-icon>
					{{ makeupLoading ? '处理中...' : '确认补卡' }}
				</el-button>
			</div>
		</el-dialog>

		<el-dialog
			:title="`${selectedStudent?.name}的考勤记录`"
			v-model="attendanceRecordsDialogVisible"
			class="attendance-records-dialog"
		>
			<div>
				<div v-if="studentAttendanceRecords.length === 0">
					<el-icon>
						<Calendar/>
					</el-icon>
					<p>暂无考勤记录</p>
				</div>
				<div>
					<el-calendar v-model="calendarValue">
						<template #header="{ date }">
							<div>{{ formatCalendarTitle(date) }}</div>
							<div>
								<el-button size="small" @click="prevMonth">上个月</el-button>
								<el-button size="small" @click="goToday">今天</el-button>
								<el-button size="small" @click="nextMonth">下个月</el-button>
							</div>
						</template>
						<template #date-cell="{ data }">
							<div class="attendance-records-dialog-list-item">
								<div class = "attendance-records-dialog-list-item-div">
										<span
											:class="{ 'attendance-records-dialog-list-item-has-attendance': studentManagerPageStudentAttendanceServer.getAttendanceTimeBySlot(data.day, 'morning', studentAttendanceRecords) }">
										  早:&nbsp;&nbsp;{{
												studentManagerPageStudentAttendanceServer.getAttendanceTimeBySlot(data.day, 'morning', studentAttendanceRecords)
											}}
										</span>

										<span
											:class="{ 'attendance-records-dialog-list-item-has-attendance': studentManagerPageStudentAttendanceServer.getAttendanceTimeBySlot(data.day, 'afternoon', studentAttendanceRecords) }">
										  午:&nbsp;&nbsp;{{
												studentManagerPageStudentAttendanceServer.getAttendanceTimeBySlot(data.day, 'afternoon', studentAttendanceRecords)
											}}
										</span>

										<span
											:class="{ 'attendance-records-dialog-list-item-has-attendance': studentManagerPageStudentAttendanceServer.getAttendanceTimeBySlot(data.day, 'evening', studentAttendanceRecords) }">
										  晚:&nbsp;&nbsp;{{
												studentManagerPageStudentAttendanceServer.getAttendanceTimeBySlot(data.day, 'evening', studentAttendanceRecords)
											}}
										</span>
								</div>

								<span class = "attendance-records-dialog-list-item-span">{{ data.day.split('-')[2] }}</span>
							</div>
						</template>
					</el-calendar>
				</div>
			</div>
			<template #footer>
				<div>
					<el-button @click="closeAttendanceRecordsDialog">关闭</el-button>
				</div>
			</template>
		</el-dialog>


		<el-dialog
			v-if="heatmapDialogVisible"
			v-model="heatmapDialogVisible"
			:title="`${selectedStudent?.name} 的签到热力图`"
			width="80%"
			class="heatmap-dialog"
			destroy-on-close
			:close-on-click-modal="false"
			:append-to-body="true"
			:teleported="true"
			modal-class="heatmap-overlay"
			@close="closeHeatmapDialog"
		>
			<div class="heatmap-dialog-content">
				<div v-if="attendanceRecordsLoading" class="loading-container">
					<el-icon class="loading-icon">
						<Loading/>
					</el-icon>
					<p>加载中...</p>
				</div>
				<div v-else-if="studentAttendanceRecords.length === 0" class="no-records">
					<el-icon class="no-records-icon">
						<Calendar/>
					</el-icon>
					<p>暂无考勤记录</p>
				</div>
				<div v-else class="chart-container">
					<div class="chart-item-admin">
						<div class="chart-title-admin">签到热力图</div>
						<div ref="heatmapDialogChart" class="chart-content-admin"></div>
					</div>
				</div>
			</div>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="closeHeatmapDialog">关闭</el-button>
				</div>
			</template>
		</el-dialog>

		<el-dialog
			v-if="trendChartDialogVisible"
			v-model="trendChartDialogVisible"
			:title="`${selectedStudent?.name} 的签到趋势图`"
			width="80%"
			class="trend-chart-dialog"
			destroy-on-close
			:close-on-click-modal="false"
			:append-to-body="true"
			:teleported="true"
			modal-class="trend-overlay"
			@close="closeTrendChartDialog"
		>
			<div class="trend-chart-dialog-content">
				<div v-if="attendanceRecordsLoading" class="loading-container">
					<el-icon class="loading-icon">
						<Loading/>
					</el-icon>
					<p>加载中...</p>
				</div>
				<div v-else-if="studentAttendanceRecords.length === 0" class="no-records">
					<el-icon class="no-records-icon">
						<Calendar/>
					</el-icon>
					<p>暂无考勤记录</p>
				</div>
				<div v-else class="chart-container">
					<div class="chart-item-admin">
						<div class="chart-title-admin">签到趋势图</div>
						<div ref="trendDialogChart" class="chart-content-admin"></div>
					</div>
				</div>
			</div>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="closeTrendChartDialog">关闭</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import {nextTick, onMounted, ref, watch} from 'vue'
import {ElButton, ElCalendar, ElDatePicker, ElDialog, ElIcon, ElInput, ElMessage} from 'element-plus'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-date-picker.css'
import 'element-plus/theme-chalk/el-date-picker-panel.css'
import 'element-plus/theme-chalk/el-time-picker.css'
import 'element-plus/theme-chalk/el-scrollbar.css'
import 'element-plus/theme-chalk/el-calendar.css'
import {
	ArrowLeft,
	Calendar,
	Check,
	Clock,
	InfoFilled,
	Loading,
	Refresh,
	Search,
	Sort,
	Star,
	TrendCharts,
	User
} from '@element-plus/icons-vue'
import {useRouter} from 'vue-router'
import {useUserStore} from '@/stores/user'
import {useThemeStore} from '@/stores/theme'
import {getStudentAttendanceCount, makeupAttendance} from '@/api/attendance'
import {getStudentLevel} from '@/api/student'
import StudentManagerPageUtils from '@/views/StudentManagerPage/js/StudentManagerPageUtils'
// ECharts 按需引入
import * as echarts from 'echarts/core'
import {HeatmapChart, LineChart} from 'echarts/charts'
import {GridComponent, LegendComponent, TitleComponent, TooltipComponent, VisualMapComponent} from 'echarts/components'
import {CanvasRenderer} from 'echarts/renderers'
import StudentManagerPage from "@/views/StudentManagerPage/js/StudentManagerPage";
import StudentManagerPageStudentAttendanceServer
	from "@/views/StudentManagerPage/js/StudentManagerPageStudentAttendanceServer";

const studentManagerPageUtils = StudentManagerPageUtils
const studentManagerPageStudentAttendanceServer = StudentManagerPageStudentAttendanceServer

const studentManagerPage = StudentManagerPage

// 注册需要的组件
echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	VisualMapComponent,
	LineChart,
	HeatmapChart,
	CanvasRenderer
])

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()
const managedStudents = ref([])
const loading = ref(false)
const searchQuery = ref('')
const filteredStudents = ref([])
const sortOrder = ref('default')

const heatmapChart = ref(null)
const lineChart = ref(null)
const heatmapInstance = ref(null)
const lineInstance = ref(null)
const heatmapDialogChart = ref(null)
const trendDialogChart = ref(null)

const toggleTheme = () => {
	themeStore.toggleTheme()
}

const handleSearch = () => {
	if (!searchQuery.value.trim()) {
		if (sortOrder.value === 'attendance') {
			filteredStudents.value = [...managedStudents.value].sort((a, b) => {
				const countA = getStudentAttendanceCountFromCache(a.studentId)
				const countB = getStudentAttendanceCountFromCache(b.studentId)
				return countB - countA
			})
		} else {
			filteredStudents.value = managedStudents.value
		}
		return
	}

	const query = searchQuery.value.toLowerCase().trim()
	let filtered = managedStudents.value.filter(student =>
		student.name.toLowerCase().includes(query) ||
		student.studentId.toString().includes(query) ||
		student.major.toLowerCase().includes(query) ||
		student.college.toLowerCase().includes(query)
	)

	if (sortOrder.value === 'attendance') {
		filtered = filtered.sort((a, b) => {
			const countA = getStudentAttendanceCountFromCache(a.studentId)
			const countB = getStudentAttendanceCountFromCache(b.studentId)
			return countB - countA
		})
	}

	filteredStudents.value = filtered
}

const handleClearSearch = () => {
	searchQuery.value = ''
	if (sortOrder.value === 'attendance') {
		filteredStudents.value = [...managedStudents.value].sort((a, b) => {
			const countA = getStudentAttendanceCountFromCache(a.studentId)
			const countB = getStudentAttendanceCountFromCache(b.studentId)
			return countB - countA
		})
	} else {
		filteredStudents.value = managedStudents.value
	}
}

const sortByAttendance = () => {
	if (sortOrder.value === 'attendance') {
		sortOrder.value = 'default'
		filteredStudents.value = [...managedStudents.value]
	} else {
		sortOrder.value = 'attendance'
		filteredStudents.value = [...managedStudents.value].sort((a, b) => {
			const countA = getStudentAttendanceCountFromCache(a.studentId)
			const countB = getStudentAttendanceCountFromCache(b.studentId)
			return countB - countA
		})
	}
}
const attendanceCounts = ref({})
const makeupDialogVisible = ref(false)
const selectedStudent = ref(null)
const makeupSelectedStudent = ref(null)
const makeupForm = ref({
	attendanceTime: ''
})
const makeupLoading = ref(false)
const attendanceRecordsDialogVisible = ref(false)
const studentAttendanceRecords = ref([])
const calendarValue = ref(new Date())
const attendanceRecordsLoading = ref(false)

const heatmapDialogVisible = ref(false)
const trendChartDialogVisible = ref(false)

const timeShortcuts = [
	{
		text: '今天上午',
		value: () => {
			const today = new Date()
			today.setHours(9, 0, 0, 0)
			return today
		}
	},
	{
		text: '今天下午',
		value: () => {
			const today = new Date()
			today.setHours(15, 0, 0, 0)
			return today
		}
	},
	{
		text: '今天晚上',
		value: () => {
			const today = new Date()
			today.setHours(20, 0, 0, 0)
			return today
		}
	},
	{
		text: '昨天上午',
		value: () => {
			const yesterday = new Date()
			yesterday.setDate(yesterday.getDate() - 1)
			yesterday.setHours(9, 0, 0, 0)
			return yesterday
		}
	},
	{
		text: '昨天下午',
		value: () => {
			const yesterday = new Date()
			yesterday.setDate(yesterday.getDate() - 1)
			yesterday.setHours(15, 0, 0, 0)
			return yesterday
		}
	},
	{
		text: '昨天晚上',
		value: () => {
			const yesterday = new Date()
			yesterday.setDate(yesterday.getDate() - 1)
			yesterday.setHours(20, 0, 0, 0)
			return yesterday
		}
	}
]


const getStudentAttendanceCountFromCache = (studentId) => {
	return attendanceCounts.value[studentId] || 0
}

const getStudentAvatarUrl = (student) => {
	// 尝试多个可能的字段名
	const possibleIds = [
		student.studentInfoId,
		student.id,
		student.infoId,
		student.databaseId
	]

	const validId = possibleIds.find(id => id != null && true && id !== '')

	if (!validId) {
		console.warn('未找到有效的学生ID:', student)
		return null
	}

	return studentManagerPageUtils.getStudentAvatarUrl(validId)
}

const handleAvatarError = (event) => {
	// 头像加载失败时显示默认图标
	event.target.style.display = 'none'
	const parent = event.target.parentElement
	if (parent) {
		const icon = document.createElement('i')
		icon.className = 'el-icon'
		parent.appendChild(icon)
	}
}

const loadManagedStudents = async () => {
	if (!userStore.token) {
		ElMessage.error('请先登录')
		return
	}

	loading.value = true
	try {
		// 使用 studentManagerPage.initData 初始化数据
		await studentManagerPage.initData(userStore.token, userStore.userInfo.studentDatabaseTableId)

		// 获取处理后的学生数据
		const students = studentManagerPage.students || []

		managedStudents.value = students

		// 更新签到次数映射
		const newAttendanceCounts = {}
		let totalAttendanceCount = 0

		students.forEach(student => {
			newAttendanceCounts[student.studentId] = student.checkInCount || 0
			totalAttendanceCount += (student.checkInCount || 0)
		})

		// 更新签到次数映射
		Object.assign(attendanceCounts.value, newAttendanceCounts)

		// 根据排序方式设置过滤后的学生列表
		if (sortOrder.value === 'attendance') {
			filteredStudents.value = [...students].sort((a, b) => {
				const countA = getStudentAttendanceCountFromCache(a.studentId)
				const countB = getStudentAttendanceCountFromCache(b.studentId)
				return countB - countA
			})
		} else {
			filteredStudents.value = students
		}
	} catch (error) {
		ElMessage.error(error.message || '获取管理学生信息失败')
	} finally {
		loading.value = false
	}
}

const loadAttendanceCounts = async () => {
	const promises = managedStudents.value.map(async (student) => {
		try {
			const response = await getStudentAttendanceCount(student.studentId)
			if (response.code === 200) {
				attendanceCounts.value[student.studentId] = response.data.count || 0
			}
		} catch (error) {
			attendanceCounts.value[student.studentId] = 0
		}
	})

	await Promise.all(promises)
}

const refreshStudents = () => {
	loadManagedStudents()
}

const goBack = () => {
	router.push('/navigation')
}

const openMakeupDialog = (student) => {
	makeupSelectedStudent.value = student
	makeupForm.value.attendanceTime = ''
	document.body.style.overflow = 'hidden'
	makeupDialogVisible.value = true
}

const closeMakeupDialog = () => {
	makeupDialogVisible.value = false
	document.body.style.overflow = ''
	makeupSelectedStudent.value = null
	makeupForm.value.attendanceTime = ''
}

const submitMakeup = async () => {
	if (!makeupForm.value.attendanceTime) {
		ElMessage.warning('请选择补卡时间')
		return
	}

	if (!userStore.token) {
		ElMessage.error('请先登录')
		router.push('/login')
		return
	}

	makeupLoading.value = true
	try {
		const response = await makeupAttendance(
			userStore.token,
			makeupSelectedStudent.value.studentId,
			makeupForm.value.attendanceTime
		)

		if (response.code === 200) {
			ElMessage.success('补卡成功')
			closeMakeupDialog()
			await loadAttendanceCounts()
		} else {
			ElMessage.error(response.message || '补卡失败')
		}
	} catch (error) {
		ElMessage.error(error.message || '补卡失败')
	} finally {
		makeupLoading.value = false
	}
}

const openAttendanceRecordsDialog = async (student) => {
	selectedStudent.value = student

	try {
		attendanceRecordsLoading.value = true
		studentAttendanceRecords.value = await studentManagerPageStudentAttendanceServer.getStudentAttendanceRecords(student.studentId)
		attendanceRecordsDialogVisible.value = true
		document.body.style.overflow = 'hidden'
	} catch (error) {
		ElMessage.error('获取考勤记录失败：' + error.message)
	} finally {
		attendanceRecordsLoading.value = false
	}

}

const closeAttendanceRecordsDialog = () => {
	attendanceRecordsDialogVisible.value = false
	document.body.style.overflow = ''
	selectedStudent.value = null
	studentAttendanceRecords.value = []
}

const openHeatmapDialog = async (student) => {
	selectedStudent.value = student

	try {
		attendanceRecordsLoading.value = true
		const response = await studentManagerPageStudentAttendanceServer.getStudentAttendanceRecords(student.studentId)
		if (response.code === 200) {
			studentAttendanceRecords.value = response.data || []
			heatmapDialogVisible.value = true
			document.body.style.overflow = 'hidden'

			await nextTick()
			setTimeout(() => {
				initDialogHeatmapChart()
			}, 100)
		} else {
			ElMessage.error(response.message || '获取考勤记录失败')
		}
	} catch (error) {
		ElMessage.error('获取考勤记录失败：' + error.message)
	} finally {
		attendanceRecordsLoading.value = false
	}
}

const closeHeatmapDialog = () => {
	heatmapDialogVisible.value = false
	document.body.style.overflow = ''
	selectedStudent.value = null
	studentAttendanceRecords.value = []

	if (heatmapInstance.value) {
		heatmapInstance.value.dispose()
		heatmapInstance.value = null
	}
}

const openTrendChartDialog = async (student) => {
	selectedStudent.value = student

	try {
		attendanceRecordsLoading.value = true
		const response = await studentManagerPageStudentAttendanceServer.getStudentAttendanceRecords(student.studentId)
		if (response.code === 200) {
			studentAttendanceRecords.value = response.data || []
			trendChartDialogVisible.value = true
			document.body.style.overflow = 'hidden'

			await nextTick()
			setTimeout(() => {
				initDialogLineChart()
			}, 100)
		} else {
			ElMessage.error(response.message || '获取考勤记录失败')
		}
	} catch (error) {
		ElMessage.error('获取考勤记录失败：' + error.message)
	} finally {
		attendanceRecordsLoading.value = false
	}
}

const closeTrendChartDialog = () => {
	trendChartDialogVisible.value = false
	document.body.style.overflow = ''
	selectedStudent.value = null
	studentAttendanceRecords.value = []

	if (lineInstance.value) {
		lineInstance.value.dispose()
		lineInstance.value = null
	}
}

const formatAttendanceTime = (timeString) => {
	if (!timeString) return ''
	const date = new Date(timeString)
	return date.toLocaleString('zh-CN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	})
}


const formatCalendarTitle = (date) => {
	if (!date) return '2025年9月'
	const dateObj = new Date(date)
	if (isNaN(dateObj.getTime())) return '2025年9月'
	const year = dateObj.getFullYear()
	const month = dateObj.getMonth() + 1
	return `${year}年${month}月`
}

const prevMonth = () => {
	const date = new Date(calendarValue.value)
	date.setMonth(date.getMonth() - 1)
	calendarValue.value = date
}

const nextMonth = () => {
	const date = new Date(calendarValue.value)
	date.setMonth(date.getMonth() + 1)
	calendarValue.value = date
}

const goToday = () => {
	calendarValue.value = new Date()
}


onMounted(async () => {
	if (!userStore.userInfo?.studentId) {
		ElMessage.error('请先登录')
		router.push('/login')
		return
	}

	try {
		const levelResponse = await getStudentLevel(userStore.userInfo.studentId)
		userStore.setStudentLevel(levelResponse.data)

		if (levelResponse.data.levelCode !== 3) {
			ElMessage.error('您没有管理员权限')
			router.push('/navigation')
			return
		}

		loadManagedStudents()

		await nextTick()
		initCharts()
	} catch (error) {
		ElMessage.error('获取用户权限失败')
		router.push('/navigation')
	}

	window.addEventListener('pageshow', (event) => {
		if (event.persisted) {
			attendanceRecordsDialogVisible.value = false
			makeupDialogVisible.value = false
			document.body.style.overflow = ''
		}
	})
})

const initCharts = () => {
	initHeatmapChart()
	initLineChart()
}

const initDialogHeatmapChart = () => {
	console.log('开始初始化热力图')
	console.log('heatmapDialogChart.value:', heatmapDialogChart.value)
	console.log('容器尺寸:', heatmapDialogChart.value?.offsetWidth, heatmapDialogChart.value?.offsetHeight)

	if (!heatmapDialogChart.value) {
		console.error('热力图容器不存在')
		return
	}

	if (heatmapInstance.value) {
		heatmapInstance.value.dispose()
	}

	try {
		heatmapInstance.value = echarts.init(heatmapDialogChart.value)
		console.log('ECharts实例创建成功')
	} catch (error) {
		console.error('ECharts初始化失败:', error)
		return
	}

	const heatmapData = generateHeatmapData()
	console.log('热力图数据:', heatmapData)
	console.log('考勤记录:', studentAttendanceRecords.value)
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
					color: themeStore.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
				}
			},
			axisLabel: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 12
			},
			axisLine: {
				lineStyle: {
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			}
		},
		yAxis: {
			type: 'category',
			data: ['上午', '下午', '晚上'],
			splitArea: {
				show: true,
				areaStyle: {
					color: themeStore.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
				}
			},
			axisLabel: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 12
			},
			axisLine: {
				lineStyle: {
					color: themeStore.isDark ? '#444' : '#ddd'
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
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 11
			},
			inRange: {
				color: themeStore.isDark
					? ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8']
					: ['#fef3c7', '#fde68a', '#f59e0b', '#d97706', '#b45309', '#92400e']
			}
		},
		series: [{
			name: '签到次数',
			type: 'heatmap',
			data: heatmapData,
			label: {
				show: true,
				color: '#000000',
				fontSize: 10
			},
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}]
	}

	try {
		heatmapInstance.value.setOption(option)
		console.log('热力图配置设置成功')
	} catch (error) {
		console.error('热力图配置设置失败:', error)
	}
}

const initDialogLineChart = () => {
	console.log('开始初始化趋势图')
	console.log('trendDialogChart.value:', trendDialogChart.value)
	console.log('容器尺寸:', trendDialogChart.value?.offsetWidth, trendDialogChart.value?.offsetHeight)

	if (!trendDialogChart.value) {
		console.error('趋势图容器不存在')
		return
	}

	if (lineInstance.value) {
		lineInstance.value.dispose()
	}

	try {
		lineInstance.value = echarts.init(trendDialogChart.value)
		console.log('ECharts实例创建成功')
	} catch (error) {
		console.error('ECharts初始化失败:', error)
		return
	}

	const lineData = generateLineData()
	console.log('趋势图数据:', lineData)
	console.log('考勤记录:', studentAttendanceRecords.value)

	const option = {
		backgroundColor: 'transparent',
		tooltip: {
			trigger: 'axis',
			backgroundColor: themeStore.isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
			borderColor: themeStore.isDark ? '#333' : '#ddd',
			textStyle: {
				color: themeStore.isDark ? '#fff' : '#333'
			},
			formatter: function (params) {
				const date = params[0].axisValue
				const value = params[0].value
				return `日期: ${date}<br/>累计签到: ${value}次`
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
			boundaryGap: false,
			data: lineData.dates,
			axisLabel: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 10,
				rotate: 45
			},
			axisLine: {
				lineStyle: {
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			}
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 12
			},
			axisLine: {
				lineStyle: {
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			},
			splitLine: {
				lineStyle: {
					color: themeStore.isDark ? '#333' : '#eee'
				}
			}
		},
		series: [{
			name: '累计签到次数',
			type: 'line',
			stack: 'Total',
			data: lineData.values,
			smooth: true,
			lineStyle: {
				color: '#50a3ba',
				width: 3
			},
			areaStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [{
						offset: 0, color: 'rgba(80, 163, 186, 0.3)'
					}, {
						offset: 1, color: 'rgba(80, 163, 186, 0.1)'
					}]
				}
			},
			itemStyle: {
				color: '#50a3ba'
			},
			emphasis: {
				focus: 'series'
			}
		}]
	}

	lineInstance.value.setOption(option)
}

const initHeatmapChart = () => {
	if (!heatmapChart.value) return

	if (heatmapInstance.value) {
		heatmapInstance.value.dispose()
	}

	heatmapInstance.value = echarts.init(heatmapChart.value)

	const heatmapData = generateHeatmapData()
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
					color: themeStore.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
				}
			},
			axisLabel: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 12
			},
			axisLine: {
				lineStyle: {
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			}
		},
		yAxis: {
			type: 'category',
			data: ['上午', '下午', '晚上'],
			splitArea: {
				show: true,
				areaStyle: {
					color: themeStore.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
				}
			},
			axisLabel: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 12
			},
			axisLine: {
				lineStyle: {
					color: themeStore.isDark ? '#444' : '#ddd'
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
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 11
			},
			inRange: {
				color: themeStore.isDark
					? ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8']
					: ['#fef3c7', '#fde68a', '#f59e0b', '#d97706', '#b45309', '#92400e']
			}
		},
		series: [{
			name: '签到次数',
			type: 'heatmap',
			data: heatmapData,
			label: {
				show: true,
				color: '#000000',
				fontSize: 10
			},
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}]
	}

	heatmapInstance.value.setOption(option)
}

const initLineChart = () => {
	if (!lineChart.value) return

	if (lineInstance.value) {
		lineInstance.value.dispose()
	}

	lineInstance.value = echarts.init(lineChart.value)

	const lineData = generateLineData()

	const option = {
		backgroundColor: 'transparent',
		tooltip: {
			trigger: 'axis',
			backgroundColor: themeStore.isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
			borderColor: themeStore.isDark ? '#333' : '#ddd',
			textStyle: {
				color: themeStore.isDark ? '#fff' : '#333'
			},
			formatter: function (params) {
				const date = params[0].axisValue
				const value = params[0].value
				return `日期: ${date}<br/>累计签到: ${value}次`
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
			boundaryGap: false,
			data: lineData.dates,
			axisLabel: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 10,
				rotate: 45
			},
			axisLine: {
				lineStyle: {
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			}
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				color: themeStore.isDark ? '#ccc' : '#666',
				fontSize: 12
			},
			axisLine: {
				lineStyle: {
					color: themeStore.isDark ? '#444' : '#ddd'
				}
			},
			splitLine: {
				lineStyle: {
					color: themeStore.isDark ? '#333' : '#eee'
				}
			}
		},
		series: [{
			name: '累计签到次数',
			type: 'line',
			stack: 'Total',
			data: lineData.values,
			smooth: true,
			lineStyle: {
				color: '#50a3ba',
				width: 3
			},
			areaStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [{
						offset: 0, color: 'rgba(80, 163, 186, 0.3)'
					}, {
						offset: 1, color: 'rgba(80, 163, 186, 0.1)'
					}]
				}
			},
			itemStyle: {
				color: '#50a3ba'
			},
			emphasis: {
				focus: 'series'
			}
		}]
	}

	lineInstance.value.setOption(option)
}

const generateLineData = () => {
	const dateMap = new Map()

	studentAttendanceRecords.value.forEach(record => {
		const date = new Date(record.attendanceDateTime)
		const dateStr = date.toISOString().split('T')[0]
		dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1)
	})

	const sortedDates = Array.from(dateMap.keys()).sort()
	const dailyValues = sortedDates.map(date => dateMap.get(date))

	let cumulativeSum = 0
	const cumulativeValues = dailyValues.map(value => {
		cumulativeSum += value
		return cumulativeSum
	})

	return {
		dates: sortedDates,
		values: cumulativeValues
	}
}

const generateHeatmapData = () => {
	const data = []
	const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
	const timeSlots = ['上午', '下午', '晚上']

	weekDays.forEach((day, dayIndex) => {
		timeSlots.forEach((slot, slotIndex) => {
			let count = 0
			studentAttendanceRecords.value.forEach(record => {
				const date = new Date(record.attendanceDateTime)
				const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1
				const hour = date.getHours()

				if (dayOfWeek === dayIndex) {
					if (slot === '上午' && hour >= 8 && hour < 11) count++
					else if (slot === '下午' && hour >= 14 && hour < 17) count++
					else if (slot === '晚上' && hour >= 19 && hour < 22) count++
				}
			})
			data.push([dayIndex, slotIndex, count])
		})
	})

	return data
}

watch(() => themeStore.isDark, () => {
	if (heatmapInstance.value) {
		initHeatmapChart()
	}
	if (lineInstance.value) {
		initLineChart()
	}
})

watch(() => studentAttendanceRecords.value, () => {
	if (heatmapInstance.value) {
		initHeatmapChart()
	}
	if (lineInstance.value) {
		initLineChart()
	}
})
</script>

<style scoped src="./css/desktop/StudentManagerPage-PageHeader.css"></style>
<style scoped src="./css/desktop/StudentManagerPage-StudentCards.css"></style>
<style scoped src="./css/desktop/StudentManagerPage-Attendance_Records_Dialog.css"></style>

