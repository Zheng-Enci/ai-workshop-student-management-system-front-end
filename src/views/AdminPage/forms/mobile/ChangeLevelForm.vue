<script setup>
/**
 * 修改学生身份表单
 * 功能描述: 为指定学生修改身份等级
 * 自包含组件: 包含所有状态、逻辑和 API 调用
 */

import { ref, computed } from 'vue'
import { ElDialog, ElButton, ElMessage } from 'element-plus'
import StudentApi from '../../../../api/StudentApi.js'
import { specialPassword, updateStudentLevel } from '../../ts/AdminPage'
import { useLoadingMaskStore } from '../../../../stores/loading'
import { nextTick } from 'vue'

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
const selectedLevel = ref(null)

// 身份选项
const levelOptions = [
	{ label: '社团成员', value: 0 },
	{ label: '普通成员', value: 1 },
	{ label: '核心成员', value: 2 },
	{ label: '管理员', value: 3 }
]

/**
 * 提交修改
 * 调用 API 修改学生身份
 */
const handleConfirm = async () => {
	const selected = levelOptions.find(opt => opt.value === selectedLevel.value)

	try {
		// 显示全局加载蒙版
		loadingMaskStore.showLoadingMask('正在修改学生身份...')

		// 调用 API 修改学生身份
		const response = await StudentApi.updateStudentLevel(
			props.student?.studentId,
			selectedLevel.value,
			specialPassword.value
		)

		if (response.code === 200) {
			// 关闭弹窗
			dialogVisible.value = false
			// 更新本地数据（调用 AdminPage.ts 中的函数）
			// 这样可以同步更新所有相关数据，包括管理员映射表
			updateStudentLevel(
				props.student?.id,
				selectedLevel.value,
				selected.label
			)
			ElMessage.success(response.message)
		} else {
			ElMessage.error(response.message)
		}

		// 延迟关闭加载蒙版，确保页面渲染完成
		nextTick().then(() => {
			setTimeout(() => {
				loadingMaskStore.hideLoadingMask()
			}, 512)
		})

	} catch (error) {
		// 用户取消确认时不显示错误
		if (error === 'cancel') return

		// 显示错误提示
		const errorMessage = error instanceof Error ? error.message : "未知错误"
		ElMessage.error(`修改失败: ${errorMessage}`)

		// 关闭加载蒙版
		nextTick().then(() => {
			setTimeout(() => {
				loadingMaskStore.hideLoadingMask()
			}, 512)
		})
	}
}

/**
 * 关闭弹窗
 */
const handleClose = () => {
	selectedLevel.value = null
	dialogVisible.value = false
}
</script>

<template>
	<el-dialog
		v-model="dialogVisible"
		v-if="dialogVisible"
		:title="`修改 ${student?.name} 的学生身份`"
		width="90%"
		class="change-level-form-dialog"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		:teleported="true"
		@close="handleClose"
	>
		<div class="change-level-form-container">
			<div class="change-level-form-buttons-grid">
				<el-button
					v-for="option in levelOptions"
					:key="option.value"
					:type="selectedLevel === option.value ? 'primary' : 'default'"
					size="large"
					@click="selectedLevel = option.value"
					class="change-level-form-option-button"
				>
					{{ option.label }}
				</el-button>
			</div>
		</div>
		<template #footer>
			<div class="change-level-form-footer">
				<el-button @click="handleClose" size="large">取消</el-button>
				<el-button
					type="primary"
					:disabled="selectedLevel === props.student?.level"
					@click="handleConfirm"
					size="large"
				>
					确认
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style scoped>
/* 移动端适配 */
.change-level-form-dialog {
	max-width: 90%;
}

.change-level-form-dialog :deep(.el-dialog__body) {
	padding: 15px;
	overflow-x: hidden;
}

.change-level-form-dialog :deep(.el-dialog__header) {
	padding: 15px 15px 10px;
}

.change-level-form-dialog :deep(.el-dialog__footer) {
	padding: 10px 15px 15px;
}

/* 选项按钮网格布局 */
.change-level-form-container {
	width: 100%;
	box-sizing: border-box;
}

.change-level-form-buttons-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 10px;
	padding: 5px;
	box-sizing: border-box;
	margin: 0 !important;
}

.change-level-form-option-button {
	width: 100% !important;
	min-width: 0 !important;
	max-width: none !important;
	height: 44px !important;
	font-size: 14px !important;
	padding: 0 !important;
}

/* 底部按钮布局 */
.change-level-form-footer {
	display: flex;
	gap: 10px;
}

.change-level-form-footer .el-button {
	flex: 1;
}

/* 小屏幕适配 */
@media screen and (max-width: 375px) {
	.change-level-form-dialog :deep(.el-dialog__title) {
		font-size: 16px;
	}

	.change-level-form-buttons-grid {
		grid-template-columns: repeat(2, 1fr);
		gap: 8px;
		padding: 8px 5px;
	}
	.change-level-form-buttons-grid .el-button {
		margin: 0 !important;
	}

	.change-level-form-option-button {
		height: 40px !important;
		font-size: 13px !important;
	}
}
</style>
