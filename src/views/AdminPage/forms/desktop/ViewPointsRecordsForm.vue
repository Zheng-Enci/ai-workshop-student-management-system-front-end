<script setup>
/**
 * 查看学生改分记录表单
 * 功能描述: 查看指定学生的所有改分记录
 * 自包含组件: 包含所有状态、逻辑和 API 调用
 */

import { computed, nextTick, ref, watch } from 'vue'
import { ElDialog, ElTable, ElTableColumn, ElButton, ElMessage, ElTag, ElIcon, ElPopover } from 'element-plus'
import { Document } from '@element-plus/icons-vue'
import PointsApi from '../../../../api/ts/PointsApi.ts'
import { useLoadingMaskStore } from '../../../../stores/ts/loading'

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
const isLoading = ref(false)

/**
 * 加载改分记录
 * 调用 API 获取学生改分记录
 */
const loadAdjustRecords = async () => {
	if (!props.student?.id) {
		return
	}

	isLoading.value = true
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
				isLoading.value = false
			}, 512)
		})
	}
}

/**
 * 格式化日期时间
 * @param createTime - 创建时间字符串
 * @returns 格式化后的日期时间
 */
const formatDateTime = (createTime) => {
	if (!createTime) return ''
	const date = new Date(createTime)
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')
	const seconds = String(date.getSeconds()).padStart(2, '0')
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * 获取积分变更标签类型
 * @param adjustPoint - 改分分数
 * @returns 标签类型
 */
const getPointTagType = (adjustPoint) => {
	return adjustPoint > 0 ? 'success' : 'danger'
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
		width="800px"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		:teleported="true"
		@close="handleClose"
	>
		<div style="min-height: 400px;">
			<!-- 无数据提示 -->
			<div v-if="!adjustRecords || adjustRecords.length === 0" style="text-align: center; padding: 40px;">
				<el-icon :size="48">
					<Document />
				</el-icon>
				<p style="margin-top: 16px; color: #909399;">暂无改分记录</p>
			</div>

			<!-- 改分记录表格 -->
			<el-table v-else :data="adjustRecords" stripe style="width: 100%">
				<el-table-column prop="createTime" label="时间" width="180" :formatter="(row) => formatDateTime(row.createTime)" />
				<el-table-column prop="adjustPoints" label="分数" width="100" align="center">
					<template #default="{ row }">
						<el-tag :type="getPointTagType(row.adjustPoints)">
							{{ row.adjustPoints > 0 ? '+' : '' }}{{ row.adjustPoints }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="adjustReason" label="理由">
					<template #default="{ row }">
						<el-popover
							placement="top"
							:width="300"
							effect="light"
							trigger="hover"
							popper-class="ViewPointsRecordsForm-popover"
						>
							<template #reference>
								<div class="text-ellipsis">{{ row.adjustReason }}</div>
							</template>
							<div class="ViewPointsRecordsForm-popover-content">{{ row.adjustReason }}</div>
						</el-popover>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<template #footer>
			<div>
				<el-button @click="handleClose">关闭</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style scoped>
/* 文本省略样式 */
.text-ellipsis {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>

<style scoped>
/* Popover 内容样式 */
.ViewPointsRecordsForm-popover-content {
	word-wrap: break-word;
	white-space: pre-wrap;
}
</style>

<style>
/* Popover 样式修复 - 使用更高优先级的选择器 */

/* 浅色模式（日间）- 白色背景，黑色文字 */
.el-popper.is-light.ViewPointsRecordsForm-popover {
	background-color: #ffffff !important;
	border: 1px solid #cccccc !important;
}

/* 深色模式（夜间）- 黑色背景，白色文字 */
html.dark .el-popper.is-light.ViewPointsRecordsForm-popover {
	background-color: #000000 !important;
	border: 1px solid #333333 !important;
}

/* Popover 箭头样式 - 浅色模式 */
.el-popper.is-light.ViewPointsRecordsForm-popover .el-popper__arrow::before {
	background-color: #ffffff !important;
	border: 1px solid #cccccc !important;
}

/* Popover 箭头样式 - 深色模式 */
html.dark .el-popper.is-light.ViewPointsRecordsForm-popover .el-popper__arrow::before {
	background-color: #000000 !important;
	border: 1px solid #333333 !important;
}

/* Popover 内容文字颜色 - 强制覆盖全局样式 */
.el-popper.is-light.ViewPointsRecordsForm-popover .ViewPointsRecordsForm-popover-content {
	color: #000000 !important;
}

/* 深色模式下的 Popover 内容文字颜色 */
html.dark .el-popper.is-light.ViewPointsRecordsForm-popover .ViewPointsRecordsForm-popover-content {
	color: #ffffff !important;
}
</style>
