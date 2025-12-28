<template>
	<div style="min-height: 100vh; background: var(--bg-primary); display: flex; flex-direction: column;">
		<!--顶部导航栏-->
		<div style="position: sticky; top: 0; z-index: 100; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding: 12px 20px; flex-shrink: 0;">
			<div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
				<el-button @click="goBack" type="primary" :icon="ArrowLeft" circle style="background: #667eea; border-color: #667eea; width: 40px; height: 40px; flex-shrink: 0;"></el-button>
				<img src="@/assets/AiWorkShop_icon.png" alt="AI坊" @click="toggleTheme" title="切换主题模式" style="width: 40px; height: 40px; cursor: pointer; flex-shrink: 0;">
				<div style="display: flex; flex-direction: column; margin-left: 8px; font-size: 9px; flex: 1; min-width: 0;">
					<h1 style="margin: 0; white-space: nowrap; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 600; letter-spacing: 1px; font-size: 14px;">在0与1之间</h1>
					<h1 style="align-self: flex-end; display: inline-block; white-space: nowrap; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 600; letter-spacing: 1px; font-size: 14px;">见证每一位创作者的光芒</h1>
				</div>
			</div>
			<div style="margin-top: 12px; display: flex; justify-content: center;">
				<el-input v-model="searchKeyword" placeholder="搜索姓名/学院/专业/年级/积分..." clearable style="width: 80%;" size="small" @input="handleSearch">
					<template #prefix>
						<el-icon><Search /></el-icon>
					</template>
				</el-input>
			</div>
			<div v-if="topStudents.length > 0" style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px; font-size: 11px; color: var(--text-secondary);">
				<div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
					<div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
						<div style="display: flex; flex-wrap: wrap; gap: 8px;">
							<div style="display: flex; align-items: center; gap: 4px;">
								<span style="width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.6) 100%); box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2); flex-shrink: 0;"></span>
								<span>社团成员</span>
							</div>
							<div style="display: flex; align-items: center; gap: 4px;">
								<span style="width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(34, 197, 94, 0.6) 100%); box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2); flex-shrink: 0;"></span>
								<span>普通成员</span>
							</div>
							<div style="display: flex; align-items: center; gap: 4px;">
								<span style="width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(135deg, rgba(251, 191, 36, 0.8) 0%, rgba(251, 191, 36, 0.6) 100%); box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2); flex-shrink: 0;"></span>
								<span>核心成员</span>
							</div>
							<div style="display: flex; align-items: center; gap: 4px;">
								<span style="width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, rgba(239, 68, 68, 0.6) 100%); box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2); flex-shrink: 0;"></span>
								<span>管理员</span>
							</div>
						</div>
						<div style="display: flex; align-items: center; gap: 4px;">
							<el-icon style="font-size: 12px; color: var(--primary-color); flex-shrink: 0;"><View /></el-icon>
							<span>点击眼睛图标可查看全部改分记录</span>
						</div>
						<div style="display: flex; flex-wrap: wrap; gap: 8px;">
							<div style="display: flex; align-items: center; gap: 4px;">
								<span style="width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #00d4ff, #00f2fe); box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2); flex-shrink: 0;"></span>
								<span>总积分</span>
							</div>
							<div style="display: flex; align-items: center; gap: 4px;">
								<span style="width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb); box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2); flex-shrink: 0;"></span>
								<span>总签到积分</span>
							</div>
							<div style="display: flex; align-items: center; gap: 4px;">
								<span style="width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #d97706, #b45309); box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2); flex-shrink: 0;"></span>
								<span>总活动积分</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!--主体内容-->
		<div style="padding: 16px; flex: 1; overflow-y: auto;">
			<div v-if="topStudents.length > 0" style="display: flex; flex-direction: column; gap: 12px;">
				<div v-for="(student, index) in topStudents" :key="student.studentInfoId || student.placeholderId" :data-index="index" :style="`background: ${getStudentBackground(student)}`" class="student-card">
					<div class="student-card-content">
						<div class="avatar-container">
							<!-- 头像光影效果 -->
							<div class="avatar-shine"></div>
							<img v-if="student.avatarUrl" v-lazy="student.avatarUrl" alt="头像" class="avatar-image" @error="handleAvatarError(student)" />
							<el-icon v-else size="26" class="avatar-icon"><User /></el-icon>
						</div>
						<div class="student-info">
							<div class="student-name">{{ student.placeholder ? '待入榜' : (student.name || `学生ID: ${student.studentInfoId}`) }}</div>
							<div v-if="!student.placeholder" class="student-meta">
								<span v-if="student.gender" class="meta-tag">{{ student.gender }}</span>
								<span v-if="student.college" class="meta-tag">{{ student.college }}</span>
								<span v-if="student.major" class="meta-tag">{{ student.major }}</span>
								<span v-if="student.grade" class="meta-tag">{{ formatGrade(student.grade) }}</span>
							</div>
							<div v-if="!student.placeholder" class="student-points">
								<span class="student-total-points">{{ student.totalPoints }}</span>
								<span class="points-separator">=</span>
								<span class="attendance-points">{{ student.attendancePoints }}</span>
								<span class="points-separator">+</span>
								<span class="activity-points">{{ student.activityPoints }}</span>

								<el-button size="small" type="primary" plain @click="openRecordsDialog(student)" circle class="view-records-btn">
									<el-icon><View /></el-icon>
								</el-button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 加载中状态 -->
			<div v-else-if="isLoading" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: var(--text-secondary); padding: 60px 20px; font-size: 14px;">
				<el-icon class="is-loading" size="48"><Loading /></el-icon>
				<span>数据加载中...</span>
			</div>
			<!-- 暂无数据状态 -->
			<div v-else style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: var(--text-secondary); padding: 60px 20px; font-size: 14px;">
				<el-icon size="48"><Box /></el-icon>
				<span>暂无数据</span>
			</div>
		</div>

		<!-- 改分记录弹窗 -->
		<el-dialog
			v-if="adjustRecordsDialogManager.visible"
			v-model="adjustRecordsDialogManager.visible"
			:title="adjustRecordsDialogManager.getTitle()"
			width="90%"
			:close-on-click-modal="false"
			:destroy-on-close="true"
			:append-to-body="true"
			:teleported="true"
			class="adjust-records-dialog"
			@close="adjustRecordsDialogManager.handleDialogClose"
		>
			<div v-if="adjustRecordsDialogManager.loading" class="records-loading">
				<el-icon class="is-loading" size="48"><Loading /></el-icon>
				<span>加载中...</span>
			</div>
			<div v-else-if="adjustRecordsDialogManager.allRecords.length === 0" class="records-empty">
				<el-icon size="48"><Box /></el-icon>
				<span>暂无改分记录</span>
			</div>
			<div v-else class="records-list">
				<div
					v-for="(record, index) in adjustRecordsDialogManager.allRecords"
					:key="index"
					class="record-item"
				>
					<div class="record-header">
						<span class="record-time">{{ adjustRecordsDialogManager.formatTime(record.createTime) }}</span>
						<span :class="adjustRecordsDialogManager.getPointsClass(record.adjustPoints)">
							{{ record.adjustPoints > 0 ? `+${record.adjustPoints}` : record.adjustPoints }}
						</span>
					</div>
					<div class="record-reason">{{ record.adjustReason }}</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script setup>
import { ref, onMounted, nextTick, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { ElButton, ElIcon, ElDialog, ElInput } from 'element-plus'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-overlay.css'
import { ArrowLeft, Loading, Box, View, User, Search } from '@element-plus/icons-vue'
import AllMembersPage from "@/views/AllMembersPage/js/AllMembersPage";
import AdjustRecordsDialogManager from "@/views/AllMembersPage/js/AdjustRecordsDialogManager";


const router = useRouter()
const themeStore = useThemeStore()


const totalRanking = ref([])
const topStudents = ref([])
const searchKeyword = ref('')
const filteredStudents = ref([])
const isLoading = ref(true)
const loadedCount = ref(0)
const totalCount = ref(0)



// 弹窗管理器
const adjustRecordsDialogManager = reactive(new AdjustRecordsDialogManager())

const goBack = () => {
	router.push('/navigation')
}

const toggleTheme = () => {
	themeStore.toggleTheme()
}

const handleAvatarError = (student) => {
	student.hasAvatar = false
	student.avatarUrl = null
}



const openRecordsDialog = (student) => {
	adjustRecordsDialogManager.open(student)
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



const handleSearch = () => {
	if (!searchKeyword.value.trim()) {
		filteredStudents.value = totalRanking.value
		topStudents.value = totalRanking.value
		return
	}
	
	const keyword = searchKeyword.value.toLowerCase().trim()
	
	filteredStudents.value = totalRanking.value.filter(student => {
		if (student.name && student.name.toLowerCase().includes(keyword)) return true
		if (student.gender && student.gender.toLowerCase().includes(keyword)) return true
		if (student.college && student.college.toLowerCase().includes(keyword)) return true
		if (student.major && student.major.toLowerCase().includes(keyword)) return true
		if (student.grade) {
			const gradeText = formatGrade(student.grade).toLowerCase()
			if (gradeText.includes(keyword)) return true
			if (student.grade.toString().includes(keyword)) return true
		}
		if (student.totalPoints !== undefined && student.totalPoints.toString().includes(keyword)) return true
		if (student.attendancePoints !== undefined && student.attendancePoints.toString().includes(keyword)) return true
		return !!(student.activityPoints !== undefined && student.activityPoints.toString().includes(keyword));

	})
	
	topStudents.value = filteredStudents.value
}

const getStudentBackground = (student) => {
	if (student.placeholder) {
		return 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(0, 242, 254, 0.08) 100%)'
	}
	if (student.levelCode === 0) {
		return 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%)'
	}
	if (student.levelCode === 1) {
		return 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.06) 100%)'
	}
	if (student.levelCode === 2) {
		return 'linear-gradient(135deg, rgba(251, 191, 36, 0.12) 0%, rgba(251, 191, 36, 0.06) 100%)'
	}
	if (student.levelCode === 3) {
		return 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.06) 100%)'
	}
	return 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(0, 242, 254, 0.08) 100%)'
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
})
</script>

<style scoped src = "./css/AllMembersPageMobile.css"></style>
