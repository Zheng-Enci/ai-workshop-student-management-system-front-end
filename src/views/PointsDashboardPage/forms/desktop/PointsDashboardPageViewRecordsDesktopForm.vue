<template>
	<el-dialog
		v-model="dialogVisible"
		:title="`${studentName}的改分记录`"
		width="80%"
		:close-on-click-modal="false"
		:destroy-on-close="true"
		:append-to-body="true"
		:teleported="true"
		modal-class="records-dialog-overlay"
		class="records-dialog"
		@close="handleClose"
	>
		<div v-if="loading" class="points-dashboard-page-view-records-desktop-form-loading">
			<el-icon class="is-loading">
				<loading/>
			</el-icon>
			<span>加载中...</span>
		</div>
		<div v-else-if="records.length === 0" class="points-dashboard-page-view-records-desktop-form-empty">
			<el-icon>
				<box/>
			</el-icon>
			<span>暂无改分记录</span>
		</div>
		<div v-else class="points-dashboard-page-view-records-desktop-form-grid">
			<div
				v-for="(record, index) in records"
				:key="index"
				class="points-dashboard-page-view-records-desktop-form-card"
			>
				<div class="points-dashboard-page-view-records-desktop-form-card-header">
					<span class="points-dashboard-page-view-records-desktop-form-card-time">{{ formatTime(record.createTime) }}</span>
					<span
						class="points-dashboard-page-view-records-desktop-form-card-badge"
						:class="{ positive: record.adjustPoints >= 0, negative: record.adjustPoints < 0 }">
						{{ record.adjustPoints > 0 ? `+${record.adjustPoints}` : record.adjustPoints }}
					</span>
				</div>
				<div class="points-dashboard-page-view-records-desktop-form-card-reason">{{ record.adjustReason }}</div>
			</div>
		</div>
	</el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Loading as Loading, Box as Box } from '@element-plus/icons-vue'
import { ElDialog, ElIcon } from 'element-plus'
import { getTopAdjustRecordsByStudentInfoId } from '@/api/points'

const props = defineProps({
	modelValue: {
		type: Boolean,
		required: true
	},
	studentInfoId: {
		type: [Number, String],
		default: null
	},
	studentName: {
		type: String,
		default: '学生'
	}
})

const emit = defineEmits(['update:modelValue', 'close'])

const loading = ref(false)
const records = ref([])

const dialogVisible = computed({
	get: () => props.modelValue,
	set: (val) => emit('update:modelValue', val)
})

watch(() => props.modelValue, val => {
	if (val && props.studentInfoId) {
		loadRecords()
	}
})

const formatTime = timeString => {
	if (!timeString) { return '--' }
	try {
		const date = new Date(timeString)
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')
		return `${year}-${month}-${day} ${hours}:${minutes}`
	} catch {
		return '--'
	}
}

const loadRecords = async () => {
	if (!props.studentInfoId) { return }
	loading.value = true
	records.value = []
	try {
		const response = await getTopAdjustRecordsByStudentInfoId(props.studentInfoId, 100)
		if (response.code === 200 && Array.isArray(response.data)) {
			records.value = response.data.sort((a, b) => {
				const timeA = new Date(a.createTime).getTime()
				const timeB = new Date(b.createTime).getTime()
				return timeB - timeA
			})
		}
	} catch (error) {
		console.error('获取改分记录失败:', error)
		records.value = []
	} finally {
		loading.value = false
	}
}

const handleClose = () => {
	records.value = []
	emit('close')
}

const handleOpen = () => {
	loadRecords()
}

defineExpose({
	handleOpen
})
</script>

<style scoped>
.points-dashboard-page-view-records-desktop-form-loading {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40px 0;
	color: var(--text-secondary);
	gap: 12px;
}

.points-dashboard-page-view-records-desktop-form-loading .el-icon {
	font-size: 32px;
}

.points-dashboard-page-view-records-desktop-form-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40px 0;
	color: var(--text-secondary);
	gap: 12px;
}

.points-dashboard-page-view-records-desktop-form-empty .el-icon {
	font-size: 48px;
}

.points-dashboard-page-view-records-desktop-form-grid {
	display: flex;
	flex-direction: column;
	gap: 12px;
	max-height: 400px;
	overflow-y: auto;
}

.points-dashboard-page-view-records-desktop-form-card {
	background: var(--bg-secondary);
	border-radius: 8px;
	padding: 12px;
}

.points-dashboard-page-view-records-desktop-form-card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8px;
}

.points-dashboard-page-view-records-desktop-form-card-time {
	font-size: 12px;
	color: var(--text-secondary);
}

.points-dashboard-page-view-records-desktop-form-card-badge {
	font-size: 14px;
	font-weight: 600;
	padding: 2px 8px;
	border-radius: 4px;
}

.points-dashboard-page-view-records-desktop-form-card-badge.positive {
	color: #10b981;
	background: rgba(16, 185, 129, 0.1);
}

.points-dashboard-page-view-records-desktop-form-card-badge.negative {
	color: #ef4444;
	background: rgba(239, 68, 68, 0.1);
}

.points-dashboard-page-view-records-desktop-form-card-reason {
	font-size: 13px;
	color: var(--text-primary);
	line-height: 1.5;
}
</style>
