<script setup>
/**
 * IP监控页面-IP配置表单组件(桌面端)
 *
 * @description 提供IP配置功能，包含IP范围、分配状态等配置
 * @component IPMonitorPageIPConfigDesktopForm
 */

// ======================== 导入 ========================
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton } from 'element-plus'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-select.css'
import 'element-plus/theme-chalk/el-option.css'
import 'element-plus/theme-chalk/el-button.css'

// ======================== Props ========================
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false
	},
	ipData: {
		type: Object,
		default: () => ({})
	}
})

// ======================== Emits ========================
const emit = defineEmits(['update:modelValue', 'confirm'])

// ======================== 计算属性 ========================
const dialogVisible = computed({
	get: () => props.modelValue,
	set: (val) => emit('update:modelValue', val)
})

// ======================== 常量 ========================
const IP_STATES = [
	{ label: '可分配', value: 'available' },
	{ label: '已分配', value: 'allocated' },
	{ label: '预留', value: 'reserved' },
	{ label: '禁用', value: 'disabled' }
]

// ======================== 状态 ========================
const formData = reactive({
	ip: '',
	state: 'available',
	note: ''
})

// ======================== 方法 ========================
const handleConfirm = () => {
	if (!formData.ip) {
		ElMessage.warning('请输入IP地址')
		return
	}
	emit('confirm', { ...formData })
	dialogVisible.value = false
	resetForm()
}

const handleCancel = () => {
	dialogVisible.value = false
	resetForm()
}

const resetForm = () => {
	formData.ip = ''
	formData.state = 'available'
	formData.note = ''
}
</script>

<template>
	<ElDialog
		v-model="dialogVisible"
		title="IP配置"
		width="500px"
		:close-on-click-modal="false"
		class="ip-monitor-page-ip-config-desktop-form-dialog"
	>
		<ElForm
			:model="formData"
			label-width="100px"
			class="ip-monitor-page-ip-config-desktop-form"
		>
			<ElFormItem label="IP地址">
				<ElInput
					v-model="formData.ip"
					placeholder="请输入IP地址"
					disabled
				/>
			</ElFormItem>
			<ElFormItem label="分配状态">
				<ElSelect
					v-model="formData.state"
					placeholder="请选择分配状态"
					class="ip-monitor-page-ip-config-desktop-form-state-select"
				>
					<ElOption
						v-for="item in IP_STATES"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</ElSelect>
			</ElFormItem>
			<ElFormItem label="备注">
				<ElInput
					v-model="formData.note"
					type="textarea"
					:rows="3"
					placeholder="请输入备注"
				/>
			</ElFormItem>
		</ElForm>
		<template #footer>
			<ElButton
				type="primary"
				@click="handleConfirm"
			>
				确认
			</ElButton>
			<ElButton @click="handleCancel">
				取消
			</ElButton>
		</template>
	</ElDialog>
</template>

<style>
@import './css/IPMonitorPageIPConfigDesktopForm.css';
</style>
