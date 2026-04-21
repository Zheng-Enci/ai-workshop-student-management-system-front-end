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
/**
 * 网络配置数据
 * 硬编码的网络配置信息，展示在表单中
 */
const networkConfig = reactive({
	// IP分配方式
	ipAssignment: '手动',
	// IPv4地址
	ipv4Address: '10.0.48.241',
	// IPv4掩码
	ipv4Mask: '255.255.255.0',
	// IPv4网关
	ipv4Gateway: '10.0.48.254',
	// DNS服务器分配方式
	dnsAssignment: '手动',
	// IPv4 DNS服务器
	ipv4DNS: ['211.138.156.66 (未加密)', '218.85.157.99 (未加密)'],
	// 聚合链接速度
	linkSpeed: '1000/1000 (Mbps)',
	// 本地链接IPv6地址
	ipv6Address: 'fe80::aab8:9309:a45d:2aad%19',
	// 制造商
	manufacturer: 'Intel',
	// 描述
	description: 'Intel(R) Ethernet Connection (17) I219-LM',
	// 驱动程序版本
	driverVersion: '12.19.2.65',
	// 物理地址(MAC)
	macAddress: '4C:D7:17:8D:51:FC'
})

// ======================== 方法 ========================
const handleConfirm = () => {
	emit('confirm', { ...networkConfig })
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
		<ElForm
			:model="networkConfig"
			label-width="180px"
			class="ip-monitor-page-ip-config-desktop-form"
		>
			<!-- IP配置信息区域 -->
			<div class="ip-monitor-page-ip-config-desktop-form-section">
				<h4 class="ip-monitor-page-ip-config-desktop-form-section-title">IP配置</h4>
				<ElFormItem label="IP分配:">
					<span class="ip-monitor-page-ip-config-desktop-form-value">{{ networkConfig.ipAssignment }}</span>
				</ElFormItem>
				<ElFormItem label="IPv4 地址:">
					<span class="ip-monitor-page-ip-config-desktop-form-value">{{ networkConfig.ipv4Address }}</span>
				</ElFormItem>
				<ElFormItem label="IPv4 掩码:">
					<span class="ip-monitor-page-ip-config-desktop-form-value">{{ networkConfig.ipv4Mask }}</span>
				</ElFormItem>
				<ElFormItem label="IPv4 网关:">
					<span class="ip-monitor-page-ip-config-desktop-form-value">{{ networkConfig.ipv4Gateway }}</span>
				</ElFormItem>
			</div>

			<!-- DNS配置信息区域 -->
			<div class="ip-monitor-page-ip-config-desktop-form-section">
				<h4 class="ip-monitor-page-ip-config-desktop-form-section-title">DNS配置</h4>
				<ElFormItem label="DNS 服务器分配:">
					<span class="ip-monitor-page-ip-config-desktop-form-value">{{ networkConfig.dnsAssignment }}</span>
				</ElFormItem>
				<ElFormItem label="IPv4 DNS 服务器:">
					<div class="ip-monitor-page-ip-config-desktop-form-dns-list">
						<span
							v-for="(dns, index) in networkConfig.ipv4DNS"
							:key="index"
							class="ip-monitor-page-ip-config-desktop-form-value"
						>
							{{ dns }}
						</span>
					</div>
				</ElFormItem>
			</div>

			<!-- 网络连接信息区域 -->
			<div class="ip-monitor-page-ip-config-desktop-form-section">
				<h4 class="ip-monitor-page-ip-config-desktop-form-section-title">网络连接信息</h4>
				<ElFormItem label="聚合链接速度(接收/传输):">
					<span class="ip-monitor-page-ip-config-desktop-form-value">{{ networkConfig.linkSpeed }}</span>
				</ElFormItem>
				<ElFormItem label="本地链接 IPv6 地址:">
					<span class="ip-monitor-page-ip-config-desktop-form-value">{{ networkConfig.ipv6Address }}</span>
				</ElFormItem>
				<ElFormItem label="IPv4 地址:">
					<span class="ip-monitor-page-ip-config-desktop-form-value">{{ networkConfig.ipv4Address }}</span>
				</ElFormItem>
				<ElFormItem label="IPv4 默认网关:">
					<span class="ip-monitor-page-ip-config-desktop-form-value">{{ networkConfig.ipv4Gateway }}</span>
				</ElFormItem>
				<ElFormItem label="IPv4 DNS 服务器:">
					<div class="ip-monitor-page-ip-config-desktop-form-dns-list">
						<span
							v-for="(dns, index) in networkConfig.ipv4DNS"
							:key="index"
							class="ip-monitor-page-ip-config-desktop-form-value"
						>
							{{ dns }}
						</span>
					</div>
				</ElFormItem>
			</div>


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
