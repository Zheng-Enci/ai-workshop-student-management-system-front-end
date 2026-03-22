<script setup lang="ts">
/**
 * 数据下载表单
 * 功能描述: 显示上周每天签到人次和上周签到活跃学生数据
 * 自包含组件: 包含所有状态、逻辑和 API 调用
 */

import { computed, ref } from 'vue'
import { ElButton, ElDialog, ElIcon } from 'element-plus'
import { DataLine, User } from '@element-plus/icons-vue'
import AttendanceApi from '../../../../api/ts/AttendanceApi.ts'
import AdminPageUtils from '../../ts/AdminPageUtils'

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

// ===================== 方法函数 =====================

/**
 * 处理上周每天签到人次按钮点击
 */
const handleDownloadDailyAttendance = async () => {
	const now = new Date()
	const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay()
	const monday = new Date(now)
	monday.setDate(now.getDate() - dayOfWeek - 6)
	
	const data: number[] = []
	const dates: string[] = []
	
	for (let i = 0; i < 7; i++) {
		const date = new Date(monday)
		date.setDate(monday.getDate() + i)
		const dateStr = date.toISOString().split('T')[0]
		const count = await AttendanceApi.getTodayAttendanceCount(dateStr)
		data.push(count)
		dates.push(`${date.getMonth() + 1}/${date.getDate()}`)
	}
	
	const csvData: string[][] = [
		['一', '二', '三', '四', '五', '六', '日'],
		data.map(count => String(count))
	]
	
	AdminPageUtils.exportToCSV(csvData, '上周每天签到人次.csv')
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