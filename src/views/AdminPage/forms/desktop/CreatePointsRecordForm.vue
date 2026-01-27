<script setup>
/**
 * 创建积分记录表单
 * 功能描述: 通过特殊密码为指定学生创建积分记录，记录积分变更原因和分数
 * 自包含组件: 包含所有状态、逻辑和 API 调用
 */

import { ref, computed } from 'vue'
import { ElDialog, ElForm, ElFormItem, ElInput, ElInputNumber, ElButton, ElMessage } from 'element-plus'
import SpecialPasswordApi from '../../../../api/ts/SpecialPasswordApi'
import { specialPassword } from '../../ts/AdminPage'
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

// 表单数据
const formData = ref({
	changePoints: null,
	adjustReason: ''
})

// 表单引用
const formRef = ref()

// 表单验证规则
const rules = {
	changePoints: [
		{ required: true, message: '改分分数不能为空', trigger: 'change' },
		{ type: 'number', message: '请输入有效的数字', trigger: 'change' }
	],
	adjustReason: [
		{ required: true, message: '改分理由不能为空', trigger: 'blur' },
		{ max: 500, message: '改分理由不能超过500字符', trigger: 'blur' }
	]
}

/**
 * 提交创建积分记录
 * 调用 API 创建积分记录
 */
const handleConfirm = async () => {
	// 表单验证
	if (!formRef.value) return

	await formRef.value.validate(async (valid) => {
		if (!valid) return

		try {
			// 显示全局加载蒙版
			loadingMaskStore.showLoadingMask('正在创建积分记录...')

			// 调用 API 创建积分记录
			const response = await SpecialPasswordApi.createPointsRecord(
				specialPassword.value,
				props.student?.id,
				formData.value.changePoints,
				formData.value.adjustReason
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
			ElMessage.error(`创建积分记录失败: ${errorMessage}`)

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
		:title="`为 ${student?.name} 创建积分记录`"
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
			<el-form-item label="改分分数" prop="changePoints">
				<el-input-number
					v-model="formData.changePoints"
					:precision="0"
					:step="1"
					:min="-999"
					:max="999"
					placeholder="请输入改分分数（正数为加分，负数为扣分）"
					style="width: 100%"
				/>
			</el-form-item>
			<el-form-item label="改分理由" prop="adjustReason">
				<el-input
					v-model="formData.adjustReason"
					type="textarea"
					:rows="4"
					:maxlength="500"
					show-word-limit
					placeholder="请输入改分理由"
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
					确认
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style scoped>
</style>
