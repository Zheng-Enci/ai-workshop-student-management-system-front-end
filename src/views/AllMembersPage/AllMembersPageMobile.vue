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
					<div style="display: flex; flex-direction: column; align-items: center; gap: 4px; flex-shrink: 0;">
						<div style="font-size: 20px; font-weight: 700; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">{{ loadedCount }}/{{ totalCount }}</div>
						<div style="font-size: 10px; color: var(--text-tertiary); white-space: nowrap;">加载进度</div>
					</div>
				</div>
			</div>
		</div>

		<!--主体内容-->
		<div style="padding: 16px; flex: 1; overflow-y: auto;">
			<div v-if="topStudents.length > 0" style="display: flex; flex-direction: column; gap: 12px;">
				<div v-for="(student, index) in topStudents" :key="student.studentInfoId || student.placeholderId" :data-index="index" :style="`background: ${getStudentBackground(student)}; border: 1px solid rgba(102, 126, 234, 0.2); border-radius: 12px; padding: 16px; backdrop-filter: blur(20px); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); position: relative; overflow: hidden;`">
					<!-- 光影扫过效果 -->
					<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%); transform: translateX(-100%); animation: card-shine 2.5s ease-in-out infinite; pointer-events: none; z-index: 1;"></div>
					<div style="display: flex; gap: 12px; position: relative; z-index: 2;">
						<div style="width: 56px; height: 56px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3); flex-shrink: 0; position: relative; overflow: hidden;">
							<!-- 头像光影效果 -->
							<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.5) 50%, transparent 70%); transform: translate(-100%, -100%); animation: avatar-shine 3s ease-in-out infinite; pointer-events: none; border-radius: 8px; z-index: 1;"></div>
							<img v-if="student.hasAvatar && student.avatarUrl" :src="student.avatarUrl" alt="头像" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" @error="handleAvatarError(student)" />
							<el-icon v-else size="26"><User /></el-icon>
						</div>
						<div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
							<div style="font-size: 16px; font-weight: 700; color: var(--text-primary);">{{ student.placeholder ? '待入榜' : (student.name || `学生ID: ${student.studentInfoId}`) }}</div>
							<div v-if="!student.placeholder" style="display: flex; flex-wrap: wrap; gap: 4px; font-size: 11px;">
								<span v-if="student.gender" style="padding: 2px 6px; border-radius: 4px; background: rgba(102, 126, 234, 0.12); border: 1px solid rgba(102, 126, 234, 0.2); color: var(--text-primary);">{{ student.gender }}</span>
								<span v-if="student.college" style="padding: 2px 6px; border-radius: 4px; background: rgba(102, 126, 234, 0.12); border: 1px solid rgba(102, 126, 234, 0.2); color: var(--text-primary);">{{ student.college }}</span>
								<span v-if="student.major" style="padding: 2px 6px; border-radius: 4px; background: rgba(102, 126, 234, 0.12); border: 1px solid rgba(102, 126, 234, 0.2); color: var(--text-primary);">{{ student.major }}</span>
								<span v-if="student.grade" style="padding: 2px 6px; border-radius: 4px; background: rgba(102, 126, 234, 0.12); border: 1px solid rgba(102, 126, 234, 0.2); color: var(--text-primary);">{{ formatGrade(student.grade) }}</span>
							</div>
							<div v-if="!student.placeholder" style="display: flex; align-items: center; gap: 6px; padding-top: 8px; border-top: 1px solid rgba(102, 126, 234, 0.1);">
								<span style="font-size: 18px; font-weight: 800; background: linear-gradient(135deg, #667eea, #00d4ff, #00f2fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">{{ student.totalPoints }}</span>
								<span style="color: var(--text-secondary); font-size: 14px;">=</span>
								<span style="font-size: 14px; font-weight: 700; color: #3b82f6;">{{ student.signInPoints }}</span>
								<span style="color: var(--text-secondary); font-size: 14px;">+</span>
								<span style="font-size: 14px; font-weight: 700; color: #f59e0b;">{{ student.activityPoints }}</span>
								<el-button size="small" type="primary" plain @click="openRecordsDialog(student)" circle style="margin-left: auto; width: 28px; height: 28px; padding: 0;">
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
		<el-dialog v-if="recordsDialogVisible" v-model="recordsDialogVisible" :title="`${currentStudent?.name || '学生'}的改分记录`" width="90%" :close-on-click-modal="false" :destroy-on-close="true" :append-to-body="true" :teleported="true" @close="handleRecordsDialogClose">
			<div v-if="recordsLoading" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; gap: 16px; color: var(--text-secondary);">
				<el-icon class="is-loading" size="48"><Loading /></el-icon>
				<span>加载中...</span>
			</div>
			<div v-else-if="allRecords.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; gap: 16px; color: var(--text-secondary);">
				<el-icon size="48"><Box /></el-icon>
				<span>暂无改分记录</span>
			</div>
			<div v-else style="display: flex; flex-direction: column; gap: 12px;">
				<div v-for="(record, index) in allRecords" :key="index" style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(0, 242, 254, 0.05) 100%); border: 1px solid rgba(102, 126, 234, 0.15); border-radius: 12px; padding: 16px; backdrop-filter: blur(10px);">
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
						<span style="font-size: 13px; color: var(--text-secondary); font-weight: 500;">{{ formatTime(record.createTime) }}</span>
						<span :style="`font-size: 16px; font-weight: 700; padding: 4px 12px; border-radius: 6px; min-width: 60px; text-align: center; ${record.adjustPoints >= 0 ? 'color: #10b981; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3);' : 'color: #ef4444; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3);'}`">{{ record.adjustPoints > 0 ? `+${record.adjustPoints}` : record.adjustPoints }}</span>
					</div>
					<div style="font-size: 14px; color: var(--text-primary); line-height: 1.6; word-break: break-word;">{{ record.adjustReason }}</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
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
import { getAttendanceTopRanking } from '@/api/attendance'
import { getPointsTopRanking, getTopAdjustRecordsByStudentInfoId } from '@/api/points'
import { getStudentPublicFieldValueById, getAvatarUrl, getStudentLevelByInfoId } from '@/api/student'

const router = useRouter()
const themeStore = useThemeStore()

const totalRankingTopN = 2147483647
const totalRanking = ref([])
const topStudents = ref([])
const searchKeyword = ref('')
const filteredStudents = ref([])
const isLoading = ref(true)
const loadedCount = ref(0)
const totalCount = ref(0)

const recordsDialogVisible = ref(false)
const currentStudent = ref(null)
const allRecords = ref([])
const recordsLoading = ref(false)
const isClosingRecordsDialog = ref(false)

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

const loadStudentInfo = async (rankingList, idField = 'studentInfoId') => {
	// 逐个加载学生信息，从第一名开始
	totalCount.value = rankingList.length
	loadedCount.value = 0
	
	for (let i = 0; i < rankingList.length; i++) {
		const item = rankingList[i]
		const studentId = item[idField] || item.targetStudentInfoId
		if (!studentId) {
			loadedCount.value++
			continue
		}
		
		try {
			const [nameResponse, genderResponse, collegeResponse, gradeResponse, majorResponse, levelResponse] = await Promise.all([
				getStudentPublicFieldValueById(studentId, 'name').catch(() => ({ code: 400, data: null })),
				getStudentPublicFieldValueById(studentId, 'gender').catch(() => ({ code: 400, data: null })),
				getStudentPublicFieldValueById(studentId, 'college').catch(() => ({ code: 400, data: null })),
				getStudentPublicFieldValueById(studentId, 'grade').catch(() => ({ code: 400, data: null })),
				getStudentPublicFieldValueById(studentId, 'major').catch(() => ({ code: 400, data: null })),
				getStudentLevelByInfoId(studentId).catch(() => ({ code: 400, data: null }))
			])
			
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
			const avatarUrlString = getAvatarUrl(studentId)
			if (avatarUrlString) {
				const avatarUrlWithTimestamp = avatarUrlString + '?t=' + Date.now()
				item.avatarUrl = avatarUrlWithTimestamp
				item.hasAvatar = true
				
				await new Promise((resolve) => {
					const img = new Image()
					img.onload = () => {
						item.hasAvatar = true
						resolve()
					}
					img.onerror = () => {
						item.hasAvatar = false
						item.avatarUrl = null
						resolve()
					}
					img.src = avatarUrlWithTimestamp
				})
			} else {
				item.hasAvatar = false
				item.avatarUrl = null
			}
			
			loadedCount.value++
		} catch (error) {
			loadedCount.value++
			continue
		}
	}
	
	return rankingList
}

const loadTotalRanking = async () => {
	isLoading.value = true
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
			filteredStudents.value = totalRanking.value
			topStudents.value = searchKeyword.value ? filteredStudents.value : totalRanking.value
			isLoading.value = false
			
			loadStudentInfo(totalRanking.value, 'studentInfoId')
			return
		}
	} catch (error) {
		totalRanking.value = []
	} finally {
		if (isLoading.value) {
			isLoading.value = false
		}
	}
}

const openRecordsDialog = async (student) => {
	isClosingRecordsDialog.value = false
	currentStudent.value = student
	recordsDialogVisible.value = true
	recordsLoading.value = true
	allRecords.value = []
	
	try {
		const response = await getTopAdjustRecordsByStudentInfoId(student.studentInfoId, 100)
		if (response.code === 200 && Array.isArray(response.data)) {
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
	if (isClosingRecordsDialog.value) return
	isClosingRecordsDialog.value = true
	recordsDialogVisible.value = false
	setTimeout(() => {
		allRecords.value = []
		recordsLoading.value = false
		currentStudent.value = null
		isClosingRecordsDialog.value = false
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
		if (student.signInPoints !== undefined && student.signInPoints.toString().includes(keyword)) return true
		if (student.activityPoints !== undefined && student.activityPoints.toString().includes(keyword)) return true
		return false
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

onMounted(async () => {
	await nextTick()
	await loadTotalRanking()
})
</script>

<style scoped>
/* 组件样式 */
</style>

<style>
/* 全局动画定义 - 不能使用scoped，否则内联样式无法引用 */
@keyframes card-shine {
	0% {
		transform: translateX(-100%);
		opacity: 0;
	}
	10% {
		opacity: 1;
	}
	90% {
		opacity: 1;
	}
	100% {
		transform: translateX(200%);
		opacity: 0;
	}
}

@keyframes avatar-shine {
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
</style>
