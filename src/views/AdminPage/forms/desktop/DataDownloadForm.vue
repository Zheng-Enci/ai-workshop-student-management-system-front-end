<script setup lang="ts">
/**
 * 数据下载表单
 * 功能描述: 显示上周每天签到人次和上周签到活跃学生数据
 * 自包含组件: 包含所有状态、逻辑和 API 调用
 */

import { computed, ref } from 'vue'
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
	const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay() // 转换为1-7（周一至周日）
	
	// 计算上周一的日期
	const lastMonday = new Date(now)
	lastMonday.setDate(now.getDate() - dayOfWeek - 6)
	
	// 计算上周日的日期
	const lastSunday = new Date(lastMonday)
	lastSunday.setDate(lastMonday.getDate() + 6)
	
	// 设置上周一00:00:00
	const startTime = new Date(lastMonday)
	startTime.setHours(0, 0, 0, 0)
	
	// 设置上周日23:59:59
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
	
	const data: number[] = []
	const dates: string[] = []
	
	for(let i = 0; i < 7; i++) {
		const date = new Date(lastMonday)
		date.setDate(lastMonday.getDate() + i)
		const dateStr = date.toISOString().split('T')[0]
		const count = await AttendanceApi.getTodayAttendanceCount(dateStr)
		data.push(count)
		dates.push(`${date.getMonth() + 1}/${date.getDate()}`)
	}
	
	const csvData: string[][] = [
		['一', '二', '三', '四', '五', '六', '日'],
		data.map(count => String(count.data))
	]
	AdminPageUtils.exportToCSV(csvData, '上周每天签到人次.csv')
}

/**
 * 处理上周签到活跃学生数据按钮点击
 */
const handleDownloadActiveStudents = async () => {
	// 第一步：获取上周的时间范围（上周一00:00到上周日23:59:59）
	const { startTime, endTime } = getLastWeekTimeRange()

	// 格式化为ISO字符串：yyyy-MM-ddTHH:mm:ss
	const startTimeStr = startTime.toISOString().slice(0, 19)
	const endTimeStr = endTime.toISOString().slice(0, 19)

	// 第二步：调用指定时间内签到次数前n名的接口
	// 获取上周签到次数最多的前50名学生（可以根据需要调整数量）
	const activeStudents = await AttendanceApi.getTopStudentsByTimeRange(startTimeStr, endTimeStr, 100)
	
	// 过滤出签到次数大于3次的学生
	const filteredStudents = activeStudents.data.filter(student => student.attendanceCount >= 3)
	
	// 第三步：下载CSV文件
	if (filteredStudents.length > 0) {
		// 准备CSV数据
		const csvData: string[][] = []
		
		// 添加表头
		csvData.push(['排名', '姓名', '签到次数', '等级', '年级', '专业'])
		
		// 添加学生数据（按签到次数降序排列）
		filteredStudents.forEach((student, index) => {
			// 使用Config.ts中的学生等级名称配置
			const levelName = ConfigServer.STUDENT_LEVEL_NAMES[student.studentLevel || 0] || '未知'
			
			csvData.push([
				String(index + 1), // 排名
				student.studentName || '未知', // 姓名
				String(student.attendanceCount), // 签到次数
				levelName, // 等级名称
				String(student.studentGrade || 0), // 年级
				student.studentMajor || '未知' // 专业
			])
		})

		// 调用CSV导出工具
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
		title="数据下载表单"
		width="900px"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		:teleported="true"
		class="weekly-attendance-report-form-dialog"
		modal-class="weekly-attendance-report-form-dialog-overlay"
		@close="handleClose"
	>
		<div class="data-download-form-container">
			<!-- 按钮区域 -->
			<div class="data-download-form-buttons">
				<el-button
					type="primary"
					:icon="DataLine"
					@click="handleDownloadDailyAttendance"
				>
					上周每天签到人次
				</el-button>
				<el-button
						type="primary"
						:icon="User"
						@click="handleDownloadActiveStudents"
					>
						上周签到活跃学生数据
					</el-button>
			</div>
		</div>

		<template #footer>
			<div>
				<el-button @click="handleClose">关闭</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style scoped>
/* ==================== 容器样式 ==================== */
.data-download-form-container {
	padding: 20px 0;
	min-height: 100px;
}

/* ==================== 按钮区域 ==================== */
.data-download-form-buttons {
	display: flex;
	gap: 16px;
	justify-content: center;
}

/* ==================== 夜间模式适配 ==================== */
html.dark .data-download-form-container {
	color: var(--admin-text-primary, #e5e7eb);
}
</style>
