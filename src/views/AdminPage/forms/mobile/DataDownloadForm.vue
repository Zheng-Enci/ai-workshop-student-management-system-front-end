<script setup>
/**
 * 数据下载表单
 * 功能描述: 显示上周每天签到人次和上周签到活跃学生数据
 * 自包含组件: 包含所有状态、逻辑和 API 调用
 */

import { computed } from 'vue'
import { ElButton, ElDialog, ElIcon, ElMessage } from 'element-plus'
import { DataLine, User } from '@element-plus/icons-vue'
import AttendanceApi from '../../../../api/ts/AttendanceApi.ts'
import AdminPageUtils from '../../ts/AdminPageUtils'
import ConfigServer from '@/config/ts/Config'

// Props
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false
	}
})

// Emits
const emit = defineEmits(['update:modelValue'])

// 计算属性: 是否显示弹窗
const dialogVisible = computed({
	get: () => props.modelValue,
	set: (val) => emit('update:modelValue', val)
})

// ===================== 工具函数 =====================

/**
 * 获取上周的时间范围
 * @returns 上周一00:00:00到上周日23:59:59的时间范围
 */
const getLastWeekTimeRange = () => {
	const now = new Date()
	const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay()
	
	const lastMonday = new Date(now)
	lastMonday.setDate(now.getDate() - dayOfWeek - 6)
	
	const lastSunday = new Date(lastMonday)
	lastSunday.setDate(lastMonday.getDate() + 6)
	
	const startTime = new Date(lastMonday)
	startTime.setHours(0, 0, 0, 0)
	
	const endTime = new Date(lastSunday)
	endTime.setHours(23, 59, 59, 999)
	
	return {
		lastMonday,
		lastSunday,
		startTime,
		endTime
	}
}

// ===================== 方法函数 =====================

/**
 * 处理上周每天签到人次按钮点击
 */
const handleDownloadDailyAttendance = async () => {
	const { lastMonday } = getLastWeekTimeRange()
	
	const data = []
	const dates = []
	
	for(let i = 0; i < 7; i++) {
		const date = new Date(lastMonday)
		date.setDate(lastMonday.getDate() + i)
		const dateStr = date.toISOString().split('T')[0]
		const count = await AttendanceApi.getTodayAttendanceCount(dateStr)
		data.push(count)
		dates.push(`${date.getMonth() + 1}/${date.getDate()}`)
	}
	
	const csvData = [
		['一', '二', '三', '四', '五', '六', '日'],
		data.map(count => String(count))
	]
	
	AdminPageUtils.exportToCSV(csvData, '上周每天签到人次.csv')
}

/**
 * 处理上周签到活跃学生数据按钮点击
 */
const handleDownloadActiveStudents = async () => {
	const { startTime, endTime } = getLastWeekTimeRange()
	
	const startTimeStr = startTime.toISOString().slice(0, 19)
	const endTimeStr = endTime.toISOString().slice(0, 19)

	const activeStudents = await AttendanceApi.getTopStudentsByTimeRange(startTimeStr, endTimeStr, 100)
	
	const filteredStudents = activeStudents.data.filter(student => student.attendanceCount >= 3)
	
	if (filteredStudents.length > 0) {
		const csvData = []
		
		csvData.push(['排名', '姓名', '签到次数', '等级', '年级', '专业'])
		
		filteredStudents.forEach((student, index) => {
			const levelName = ConfigServer.STUDENT_LEVEL_NAMES[student.studentLevel || 0] || '未知'
			
			csvData.push([
				String(index + 1),
				student.studentName || '未知',
				String(student.attendanceCount),
				levelName,
				String(student.studentGrade || 0),
				student.studentMajor || '未知'
			])
		})
		
		AdminPageUtils.exportToCSV(csvData, '上周签到活跃学生数据.csv')
	} else {
		ElMessage.info('没有找到签到次数大于3次的学生')
	}
}

/**
 * 关闭弹窗
 */
const handleClose = () => {
	dialogVisible.value = false
}
</script>

<template>
	<el-dialog
		v-model="dialogVisible"
		v-if="dialogVisible"
		title="数据下载"
		width="90%"
		class="data-download-form-dialog"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		:teleported="true"
		@close="handleClose"
	>
		<div class="data-download-form-container">
			<div class="data-download-form-buttons">
				<el-button
					type="primary"
					:icon="DataLine"
					@click="handleDownloadDailyAttendance"
					size="large"
					class="data-download-form-button"
				>
					上周每天签到人次
				</el-button>
				<el-button
					type="primary"
					:icon="User"
					@click="handleDownloadActiveStudents"
					size="large"
					class="data-download-form-button"
				>
					上周签到活跃学生数据
				</el-button>
			</div>
		</div>

		<template #footer>
			<div class="data-download-form-footer">
				<el-button @click="handleClose" size="large">关闭</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style scoped>
/* 移动端适配 */
.data-download-form-dialog {
	max-width: 90%;
}

.data-download-form-dialog :deep(.el-dialog__body) {
	padding: 15px;
}

.data-download-form-dialog :deep(.el-dialog__header) {
	padding: 15px 15px 10px;
}

.data-download-form-dialog :deep(.el-dialog__footer) {
	padding: 10px 15px 15px;
}

/* 容器样式 */
.data-download-form-container {
	padding: 10px 0;
	min-height: 100px;
	width: 100%;
}

/* 按钮区域 */
.data-download-form-buttons {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.data-download-form-button {
	width: 100% !important;
	height: 48px;
	font-size: 15px;
	min-width: 0;
}

.data-download-form-button :deep(.el-icon) {
	margin-right: 8px;
}

/* 覆盖 Element Plus 按钮默认间距 */
.data-download-form-button + .data-download-form-button {
	margin-left: 0;
}

/* 底部按钮布局 */
.data-download-form-footer {
	display: flex;
	justify-content: center;
}

.data-download-form-footer .el-button {
	width: 100%;
}

/* 小屏幕适配 */
@media screen and (max-width: 375px) {
	.data-download-form-dialog :deep(.el-dialog__title) {
		font-size: 16px;
	}

	.data-download-form-button {
		height: 44px;
		font-size: 14px;
	}
}
</style>
