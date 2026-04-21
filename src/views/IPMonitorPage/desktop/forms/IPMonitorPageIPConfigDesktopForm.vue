<script setup>
/**
 * IP监控页面-IP配置表单组件(桌面端)
 *
 * @description 提供IP配置功能，包含IP范围、分配状态等配置
 * @component IPMonitorPageIPConfigDesktopForm
 */

// ======================== 导入 ========================
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElSwitch } from 'element-plus'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-select.css'
import 'element-plus/theme-chalk/el-option.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-switch.css'

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
/**
 * IP分配方式选项
 */
const IP_ASSIGNMENT_OPTIONS = [
	{ label: '手动', value: 'manual' },
	{ label: '自动(DHCP)', value: 'dhcp' }
]

/**
 * DNS over HTTPS选项
 */
const DNS_OVER_HTTPS_OPTIONS = [
	{ label: '关', value: 'off' },
	{ label: '开', value: 'on' }
]

// ======================== 状态 ========================
/**
 * IP配置表单数据
 * 用于编辑IP设置
 */
const formData = reactive({
	// IP分配方式
	ipAssignment: 'manual',
	// IPv4开关
	ipv4Enabled: true,
	// IP地址
	ipAddress: '10.0.48.241',
	// 子网掩码
	subnetMask: '255.255.255.0',
	// 网关
	gateway: '10.0.48.254',
	// 首选DNS
	preferredDNS: '211.138.156.66',
	// 首选DNS over HTTPS
	preferredDNSOverHTTPS: 'off',
	// 备用DNS
	alternateDNS: '218.85.157.99',
	// 备用DNS over HTTPS
	alternateDNSOverHTTPS: 'off',
	// IPv6开关
	ipv6Enabled: false
})

// ======================== 方法 ========================
const handleConfirm = () => {
	emit('confirm', { ...formData })
	dialogVisible.value = false
}

const handleCancel = () => {
	dialogVisible.value = false
}
</script>

<template>
	<ElDialog
		v-model="dialogVisible"
		title="IP配置流程"
		width="600px"
		:close-on-click-modal="false"
		class="ip-monitor-page-ip-config-desktop-form-dialog"
	>
		<!-- 表单内容区域 -->
		<div class="ip-monitor-page-ip-config-desktop-form">
			<!-- IP配置流程图 -->
			<div class="ip-monitor-page-ip-config-desktop-form-image-container">
				<p class="ip-monitor-page-ip-config-desktop-form-hint">右键图中所示按钮</p>
				<img
					src="@/assets/ip-config-flowchart/1.jpg"
					alt="IP配置流程图"
					class="ip-monitor-page-ip-config-desktop-form-flowchart"
				/>
			</div>
		</div>
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
