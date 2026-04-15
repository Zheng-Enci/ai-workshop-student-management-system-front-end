<script setup>
/**
 * 特殊密码补卡表单
 * 功能描述: 通过特殊密码为指定学生在指定时间进行补卡操作
 * 自包含组件: 包含所有状态、逻辑和 API 调用
 */

import { ref, computed } from 'vue'
import { ElDialog, ElForm, ElFormItem, ElDatePicker, ElButton, ElMessage } from 'element-plus'
import SpecialPasswordApi from '../../../../api/ts/SpecialPasswordApi'
import { specialPassword } from '../../ts/AdminPage'
import { useLoadingMaskStore } from '../../../../stores/ts/loading'
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

// 表单数据
const formData = ref({
	targetAttendanceDateTime: ''
})

// 表单引用
const formRef = ref()

// 时间快捷选项
const timeShortcuts = [
	{
		text: '今天上午',
		value: () => {
			const today = new Date()
			today.setHours(9, 0, 0, 0)
			return today
		}
	},
	{
		text: '今天下午',
		value: () => {
			const today = new Date()
			today.setHours(15, 0, 0, 0)
			return today
		}
	},
	{
		text: '今天晚上',
		value: () => {
			const today = new Date()
			today.setHours(20, 0, 0, 0)
			return today
		}
	},
	{
		text: '昨天上午',
		value: () => {
			const yesterday = new Date()
			yesterday.setDate(yesterday.getDate() - 1)
			yesterday.setHours(9, 0, 0, 0)
			return yesterday
		}
	},
	{
		text: '昨天下午',
		value: () => {
			const yesterday = new Date()
			yesterday.setDate(yesterday.getDate() - 1)
			yesterday.setHours(15, 0, 0, 0)
			return yesterday
		}
	},
	{
		text: '昨天晚上',
		value: () => {
			const yesterday = new Date()
			yesterday.setDate(yesterday.getDate() - 1)
			yesterday.setHours(20, 0, 0, 0)
			return yesterday
		}
	}
]

// 表单验证规则
const rules = {
	targetAttendanceDateTime: [
		{ required: true, message: '补卡时间不能为空', trigger: 'change' }
	]
}

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
				ElMessage.success(response.message)
			} else {
				ElMessage.error(response.message)
			}

			// 延迟关闭加载蒙版
			nextTick().then(() => {
				setTimeout(() => {
					loadingMaskStore.hideLoadingMask()
				}, 512)
			})

		} catch (error) {
			// 显示错误提示
			const errorMessage = error instanceof Error ? error.message : "未知错误"
			ElMessage.error(`补卡失败: ${errorMessage}`)

			// 关闭加载蒙版
			nextTick().then(() => {
				setTimeout(() => {
					loadingMaskStore.hideLoadingMask()
				}, 512)
			})
		}
	})
}

/**
 * 关闭弹窗
 */
const handleClose = () => {
	formRef.value?.resetFields()
	dialogVisible.value = false
}
</script>

<template>
	<el-dialog
		v-model="dialogVisible"
		v-if="dialogVisible"
		:title="`为 ${student?.name} 补卡`"
		width="500px"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		:teleported="true"
		@close="handleClose"
	>
		<el-form
			ref="formRef"
			:model="formData"
			:rules="rules"
			label-width="100px"
			label-position="left"
		>
			<el-form-item label="补卡时间" prop="targetAttendanceDateTime">
				<el-date-picker
					v-model="formData.targetAttendanceDateTime"
					type="datetime"
					placeholder="请选择补卡时间"
					format="YYYY-MM-DD HH:mm:ss"
					value-format="YYYY-MM-DDTHH:mm:ss"
					:shortcuts="timeShortcuts"
					style="width: 100%"
				/>
			</el-form-item>
		</el-form>

		<template #footer>
			<div>
				<el-button @click="handleClose">取消</el-button>
				<el-button
					type="primary"
					@click="handleConfirm"
				>
					确认补卡
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style scoped>
</style>
