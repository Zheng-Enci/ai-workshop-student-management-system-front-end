<template>
	<div v-if="modelValue" class="date-range-selector-overlay" @click.self="close">
		<div class="date-range-selector-container">
			<div class="date-range-selector-header">
				<h3>自定义日期范围</h3>
				<el-icon class="date-range-selector-close-icon" @click="close">
					<Close />
				</el-icon>
			</div>
			<div class="date-range-selector-content">
				<div class="date-range-selector-form">
					<div class="date-range-selector-input-group">
						<div class="date-range-selector-input-label">开始日期</div>
						<el-date-picker
							v-model="startDate"
							type="date"
							format="YYYY-MM-DD"
							value-format="YYYY-MM-DD"
							placeholder="选择开始日期"
							style="width: 100%"
						/>
					</div>
					<div class="date-range-selector-input-group">
						<div class="date-range-selector-input-label">结束日期</div>
						<el-date-picker
							v-model="endDate"
							type="date"
							format="YYYY-MM-DD"
							value-format="YYYY-MM-DD"
							placeholder="选择结束日期"
							style="width: 100%"
						/>
					</div>
				</div>
			</div>
			<div class="date-range-selector-footer">
				<el-button @click="close">取消</el-button>
				<el-button type="primary" @click="confirm">确定</el-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Close } from '@element-plus/icons-vue'
import { ElButton, ElIcon, ElDatePicker } from 'element-plus'
import 'element-plus/theme-chalk/el-date-picker.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-popper.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-scrollbar.css'

const props = defineProps<{
	modelValue: boolean
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
	(e: 'confirm', startDate: string, endDate: string): void
}>()

const startDate = ref('')
const endDate = ref('')

watch(
	() => props.modelValue,
	(newValue) => {
		if (newValue) {
			const now = new Date()
			const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
			startDate.value = formatDate(sevenDaysAgo)
			endDate.value = formatDate(now)
		}
	}
)

const formatDate = (date: Date): string => {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

const close = () => {
	emit('update:modelValue', false)
}

const confirm = () => {
	if (startDate.value && endDate.value) {
		emit('confirm', startDate.value, endDate.value)
		close()
	}
}
</script>

<style scoped>
.date-range-selector-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 1000;
	display: flex;
	justify-content: center;
	align-items: center;
}

.date-range-selector-container {
	background-color: var(--bg-primary);
	border: 1px solid var(--border-color);
	border-radius: 12px;
	padding: 24px;
	width: 400px;
	max-width: 90%;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.date-range-selector-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
}

.date-range-selector-header h3 {
	font-size: 18px;
	font-weight: 600;
	color: var(--text-primary);
}

.date-range-selector-close-icon {
	font-size: 20px;
	cursor: pointer;
	color: var(--text-secondary);
	transition: color 0.3s;
}

.date-range-selector-close-icon:hover {
	color: var(--text-primary);
}

.date-range-selector-content {
	margin-bottom: 24px;
}

.date-range-selector-form {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.date-range-selector-input-group {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.date-range-selector-input-label {
	font-size: 14px;
	font-weight: 500;
	color: var(--text-secondary);
}

.date-range-selector-footer {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
}

.date-range-selector-footer .el-button {
	min-width: 80px;
}
</style>
