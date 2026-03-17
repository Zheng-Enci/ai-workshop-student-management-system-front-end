<script setup>
/**
 * 特殊密码补卡表单
 * 功能描述: 通过特殊密码为指定学生在指定时间进行补卡操作
 * 自包含组件: 包含所有状态、逻辑和 API 调用
 */

import { ref, computed } from 'vue'
import { ElDialog, ElForm, ElFormItem, ElButton, ElMessage } from 'element-plus'
import SpecialPasswordApi from '../../../../api/ts/SpecialPasswordApi'
import { specialPassword } from '../../ts/AdminPage'
import { useLoadingMaskStore } from '../../../../stores/loading'

// 时间按钮配置
const timeButtons = [
	{
		label: '前天上午',
		value: () => {
			const date = new Date()
			date.setDate(date.getDate() - 2)
			date.setHours(9, 0, 0, 0)
			return date.toISOString()
		}
	},
	{
		label: '前天下午',
		value: () => {
			const date = new Date()
			date.setDate(date.getDate() - 2)
			date.setHours(15, 0, 0, 0)
			return date.toISOString()
		}
	},
	{
		label: '前天晚上',
		value: () => {
			const date = new Date()
			date.setDate(date.getDate() - 2)
			date.setHours(20, 0, 0, 0)
			return date.toISOString()
		}
	},
	{
		label: '昨天上午',
		value: () => {
			const date = new Date()
			date.setDate(date.getDate() - 1)
			date.setHours(9, 0, 0, 0)
			return date.toISOString()
		}
	},
	{
		label: '昨天下午',
		value: () => {
			const date = new Date()
			date.setDate(date.getDate() - 1)
			date.setHours(15, 0, 0, 0)
			return date.toISOString()
		}
	},
	{
		label: '昨天晚上',
		value: () => {
			const date = new Date()
			date.setDate(date.getDate() - 1)
			date.setHours(20, 0, 0, 0)
			return date.toISOString()
		}
	},
	{
		label: '今天上午',
		value: () => {
			const date = new Date()
			date.setHours(9, 0, 0, 0)
			return date.toISOString()
		}
	},
	{
		label: '今天下午',
		value: () => {
			const date = new Date()
			date.setHours(15, 0, 0, 0)
			return date.toISOString()
		}
	},
	{
		label: '今天晚上',
		value: () => {
			const date = new Date()
			date.setHours(20, 0, 0, 0)
			return date.toISOString()
		}
	}
]

// 选中的时间
const selectedTimeIndex = ref(-1)

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

// 表单数据
const formData = ref({
	targetAttendanceDateTime: ''
})

// 表单引用
const formRef = ref()

// 表单验证规则
const rules = {
	targetAttendanceDateTime: [
		{ required: true, message: '请选择补卡时间', trigger: 'change' }
	]
}

/**
 * 选择时间按钮
 */
const handleSelectTime = (index) => {
	selectedTimeIndex.value = index
	const time = timeButtons[index].value()
	formData.value.targetAttendanceDateTime = time
}

/**
 * 格式化时间显示
 */
const formatSelectedTime = computed(() => {
	if (!formData.value.targetAttendanceDateTime) return '未选择时间'
	const date = new Date(formData.value.targetAttendanceDateTime)
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')
	const seconds = String(date.getSeconds()).padStart(2, '0')
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
})

/**
 * 提交补卡
 * 调用 API 进行补卡操作
 */
const handleConfirm = async () => {
	// 表单验证
	if (!formRef.value) return

	await formRef.value.validate(async (valid) => {
		if (!valid) return

		try {
			// 显示全局加载蒙版
			loadingMaskStore.showLoadingMask('正在补卡...')

			// 格式化时间为接口要求的格式
			const date = new Date(formData.value.targetAttendanceDateTime)
			const year = date.getFullYear()
			const month = String(date.getMonth() + 1).padStart(2, '0')
			const day = String(date.getDate()).padStart(2, '0')
			const hours = String(date.getHours()).padStart(2, '0')
			const minutes = String(date.getMinutes()).padStart(2, '0')
			const seconds = String(date.getSeconds()).padStart(2, '0')
			const dateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`

			// 调用 API 进行补卡
			const response = await SpecialPasswordApi.makeupAttendanceWithSpecialPassword(
				specialPassword.value,
				props.student.studentId,
				dateTime
			)

			if (response.code === 200) {
				// 关闭弹窗
				dialogVisible.value = false
				// 重置表单
				formRef.value.resetFields()
				selectedTimeIndex.value = -1
				ElMessage.success(response.message)
			} else {
				ElMessage.error(response.message)
			}

			// 延迟关闭加载蒙版
			setTimeout(() => {
				loadingMaskStore.hideLoadingMask()
			}, 512)

		} catch (error) {
			// 显示错误提示
			const errorMessage = error instanceof Error ? error.message : "未知错误"
			ElMessage.error(`补卡失败: ${errorMessage}`)

			// 关闭加载蒙版
			setTimeout(() => {
				loadingMaskStore.hideLoadingMask()
			}, 512)
		}
	})
}

/**
 * 关闭弹窗
 */
const handleClose = () => {
	formRef.value?.resetFields()
	selectedTimeIndex.value = -1
	dialogVisible.value = false
}
</script>

<template>
	<el-dialog
		v-model="dialogVisible"
		v-if="dialogVisible"
		:title="`为 ${student?.name} 补卡`"
		width="90%"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		:teleported="true"
		@close="handleClose"
		class="makeup-attendance-form-dialog"
	>
		<el-form
			ref="formRef"
			:model="formData"
			:rules="rules"
			label-width="auto"
			label-position="top"
			class="makeup-attendance-form-container"
		>
			<el-form-item label="补卡时间" prop="targetAttendanceDateTime" style="display: flex; flex-direction: column;align-items: center;">
				<div class="makeup-attendance-form-time-buttons-grid">
					<el-button
						v-for="(btn, index) in timeButtons"
						:key="index"
						:type="selectedTimeIndex === index ? 'primary' : 'default'"
						@click="handleSelectTime(index)"
						:class="index === 0 ? 'makeup-attendance-form-time-button-first' : 'makeup-attendance-form-time-button'"
					>
						{{ btn.label }}
					</el-button>
				</div>
			</el-form-item>
		</el-form>

		<template #footer>
			<div class="makeup-attendance-form-footer">
				<el-button @click="handleClose" size="large">取消</el-button>
				<el-button
					type="primary"
					@click="handleConfirm"
					size="large"
				>
					确认补卡
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style scoped>
/* 移动端适配 */
.makeup-attendance-form-dialog {
	max-width: 90%;
}

.makeup-attendance-form-dialog :deep(.el-dialog__body) {
	padding: 15px;
	overflow: visible;
}

.makeup-attendance-form-dialog :deep(.el-dialog__header) {
	padding: 15px 15px 10px;
}

.makeup-attendance-form-dialog :deep(.el-dialog__footer) {
	padding: 10px 15px 15px;
}

.makeup-attendance-form-container {
	padding: 0 5px;
}

.makeup-attendance-form-container :deep(.el-form-item__label) {
	font-size: 14px;
	line-height: 32px;
	text-align: center;
}

.makeup-attendance-form-footer {
	display: flex;
	justify-content: flex-end;
	gap: 10px;
}

.makeup-attendance-form-footer .el-button {
	flex: 1;
	margin-left: 0;
}

/* 时间选择按钮样式 */
.makeup-attendance-form-selected-time {
	text-align: center;
	padding: 10px;
	margin-bottom: 15px;
	font-size: 14px;
	color: #606266;
	background-color: #f5f7fa;
	border-radius: 4px;
}

.makeup-attendance-form-time-buttons-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 16px;
	padding: 5px 0;
}

.makeup-attendance-form-time-buttons-grid :deep(.el-button) {
	width: 100% !important;
	min-width: 0;
	box-sizing: border-box;
}

.makeup-attendance-form-time-button {
	height: 40px;
	font-size: 14px;
	padding: 0 8px;
	width: 100%;
	margin: 0;
}

.makeup-attendance-form-time-button-first {
	height: 40px;
	font-size: 14px;
	padding: 0 8px;
	width: 100%;
	margin: 0;
}

/* 小屏幕适配 */
@media screen and (max-width: 375px) {
	.makeup-attendance-form-dialog :deep(.el-dialog__title) {
		font-size: 16px;
	}

	.makeup-attendance-form-container :deep(.el-form-item__label) {
		font-size: 13px;
		line-height: 28px;
	}

	.makeup-attendance-form-time-button {
		height: 36px;
		font-size: 13px;
	}

	.makeup-attendance-form-time-button-first {
		height: 36px;
		font-size: 13px;
	}
}
</style>
