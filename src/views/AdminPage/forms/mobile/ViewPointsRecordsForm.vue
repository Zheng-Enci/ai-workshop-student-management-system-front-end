<script setup>
/**
 * 查看学生改分记录表单
 * 功能描述: 查看指定学生的所有改分记录
 * 自包含组件: 包含所有状态、逻辑和 API 调用
 */

import { computed, nextTick, ref, watch } from 'vue'
import { ElDialog, ElButton, ElMessage, ElIcon } from 'element-plus'
import { Box } from '@element-plus/icons-vue'
import PointsApi from '../../../../api/ts/PointsApi.ts'
import { useLoadingMaskStore } from '../../../../stores/loading'

// Props
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false
	},
	student: {
		type: Object,
		default: () => null
	}
})

// Emits
const emit = defineEmits(['update:modelValue'])

// 计算属性: 是否显示弹窗
const dialogVisible = computed({
	get: () => props.modelValue,
	set: (val) => emit('update:modelValue', val)
})

// 使用全局加载蒙版 Store
const loadingMaskStore = useLoadingMaskStore()

// 表单内部状态
const adjustRecords = ref([])

/**
 * 加载改分记录
 * 调用 API 获取学生改分记录
 */
const loadAdjustRecords = async () => {
	if (!props.student?.id) {
		console.warn('[ViewPointsRecordsForm] 没有 studentId, 取消加载')
		return
	}

	loadingMaskStore.showLoadingMask('正在加载改分记录...')

	try {
		const response = await PointsApi.getAllAdjustRecordsByStudentInfoId(props.student.id)
		adjustRecords.value = response.data || []
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "未知错误"
		ElMessage.error(`加载改分记录失败: ${errorMessage}`)
		adjustRecords.value = []
	} finally {
		nextTick().then(() => {
			setTimeout(() => {
				loadingMaskStore.hideLoadingMask()
			}, 512)
		})
	}
}

/**
 * 格式化时间
 * @param time - 时间值（可以是时间戳或日期字符串）
 * @returns 格式化后的时间字符串
 */
const formatTime = (time) => {
	if (!time) { return '' }

	const date = new Date(time)

	// 检查日期是否有效
	if (isNaN(date.getTime())) {
		return time // 如果无法解析，返回原始值
	}

	// 格式化为：YYYY-MM-DD HH:mm
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')

	return `${year}-${month}-${day} ${hours}:${minutes}`
}

/**
 * 获取积分对应的CSS类名
 * @param points - 积分值
 * @returns CSS类名
 */
const getPointsClass = (points) => {
	if (points > 0) {
		return 'points-positive'
	} if (points < 0) {
		return 'points-negative'
	}
	return ''
}

/**
 * 监听 dialogVisible 变化，打开时加载数据
 */
watch(dialogVisible, (newVal) => {
	if (newVal) {
		loadAdjustRecords()
	} else {
		adjustRecords.value = []
	}
}, { immediate: false })

/**
 * 关闭弹窗
 */
const handleClose = () => {
	dialogVisible.value = false
	adjustRecords.value = []
}
</script>

<template>
	<el-dialog
		v-model="dialogVisible"
		v-if="dialogVisible"
		:title="`${student?.name} 的改分记录`"
		width="90%"
		class="view-points-records-form-dialog"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		:teleported="true"
		@close="handleClose"
	>
		<div style="min-height: 200px;">
			<!-- 无数据提示 -->
			<div v-if="!adjustRecords || adjustRecords.length === 0" class="records-empty">
				<el-icon size="48">
					<box/>
				</el-icon>
				<span>暂无改分记录</span>
			</div>

			<!-- 改分记录列表 -->
			<div v-else class="records-list">
				<div
					v-for="(record, index) in adjustRecords"
					:key="index"
					class="record-item"
				>
					<div class="record-header">
						<span class="record-time">
							{{ formatTime(record.createTime) }}
						</span>
						<span :class="getPointsClass(record.adjustPoints)">
							{{ record.adjustPoints > 0 ? `+${record.adjustPoints}` : record.adjustPoints }}
						</span>
					</div>
					<div class="record-reason">{{ record.adjustReason }}</div>
				</div>
			</div>
		</div>

		<template #footer>
			<div class="view-points-records-form-footer">
				<el-button @click="handleClose" size="large">关闭</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style scoped>
/* 移动端适配 */
.view-points-records-form-dialog {
	max-width: 90%;
}

.view-points-records-form-dialog :deep(.el-dialog__body) {
	padding: 15px;
}

.view-points-records-form-dialog :deep(.el-dialog__header) {
	padding: 15px 15px 10px;
}

.view-points-records-form-dialog :deep(.el-dialog__footer) {
	padding: 10px 15px 15px;
}

/* 空状态 */
.records-empty {
	display: flex;
	flex-direction: column;
	gap: 16px;
	align-items: center;
	justify-content: center;
	padding: 60px 20px;
	color: var(--text-secondary);
}

/* 记录列表容器 */
.records-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

/* 积分调整记录项 */
.record-item {
	padding: 16px;
	/* 渐变背景：从蓝紫色到青色，低透明度 */
	background: linear-gradient(135deg, rgb(102 126 234 / 0.08) 0%, rgb(0 242 254 / 0.05) 100%);
	border: 1px solid rgb(102 126 234 / 0.15);
	border-radius: 12px;
	backdrop-filter: blur(10px);
}

/* 记录项头部 */
.record-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12px;
}

/* 记录时间 */
.record-time {
	font-size: 13px;
	font-weight: 500;
	color: var(--text-secondary);
}

/* 正积分标签 */
.points-positive {
	min-width: 60px;
	padding: 4px 12px;
	font-size: 16px;
	font-weight: 700;
	color: #10b981;
	text-align: center;
	background: rgb(16 185 129 / 0.15);
	border: 1px solid rgb(16 185 129 / 0.3);
	border-radius: 6px;
}

/* 负积分标签 */
.points-negative {
	min-width: 60px;
	padding: 4px 12px;
	font-size: 16px;
	font-weight: 700;
	color: #ef4444;
	text-align: center;
	background: rgb(239 68 68 / 0.15);
	border: 1px solid rgb(239 68 68 / 0.3);
	border-radius: 6px;
}

/* 调整原因文本 */
.record-reason {
	font-size: 14px;
	line-height: 1.6;
	color: var(--text-primary);
	word-break: break-all;
}

/* 底部按钮布局 */
.view-points-records-form-footer {
	display: flex;
	justify-content: center;
}

.view-points-records-form-footer .el-button {
	width: 100%;
}

/* 小屏幕适配 */
@media screen and (max-width: 375px) {
	.view-points-records-form-dialog :deep(.el-dialog__title) {
		font-size: 16px;
	}

	.record-item {
		padding: 12px;
	}

	.record-time {
		font-size: 12px;
	}

	.record-reason {
		font-size: 13px;
	}

	.points-positive,
	.points-negative {
		font-size: 14px;
		padding: 3px 10px;
	}
}
</style>


