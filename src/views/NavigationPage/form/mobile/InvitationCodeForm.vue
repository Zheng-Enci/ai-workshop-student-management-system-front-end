<script setup lang="ts">
/**
 * 邀请码表单（移动端）
 * 功能描述: 显示当前用户的邀请码，支持复制功能
 * 自包含组件: 包含所有状态、逻辑和 API 调用
 * 样式来源: 遵循 AdminPage 表单风格，适配移动端
 */

import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-icon.css'

import { computed, nextTick, ref, watch } from 'vue'
import { ElButton, ElDialog, ElIcon } from 'element-plus'
import { Star, DocumentCopy, Check } from '@element-plus/icons-vue'
import InvitationApi from '../../../../api/ts/InvitationApi'
import { useUserStore } from '../../../../stores/user'

// Props
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false
	}
})

// Emits
const emit = defineEmits(['update:modelValue'])

// 计算属性: 是否显示弹窗
const dialogVisible = computed({
	get: () => {
		return props.modelValue
	},
	set: (val) => {
		emit('update:modelValue', val)
	}
})

// 使用用户 Store
const userStore = useUserStore()

// 表单内部状态
const invitationCode = ref<string | null>(null)
const isLoading = ref(false)
const isCopied = ref(false)
const errorMessage = ref<string | null>(null)

/**
 * 加载邀请码
 * 调用 API 获取当前用户的邀请码
 */
const loadInvitationCode = async () => {
	if (!userStore.token) {
		errorMessage.value = '未登录，请先登录'
		return
	}

	isLoading.value = true
	errorMessage.value = null

	try {
		const result = await InvitationApi.getInvitationCode(userStore.token)

		if (result.code === 200 && result.data) {
			invitationCode.value = result.data
			errorMessage.value = null
		} else if (result.code === 400) {
			errorMessage.value = result.message || '获取邀请码失败'
			invitationCode.value = null
		} else {
			errorMessage.value = '获取邀请码失败'
			invitationCode.value = null
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : '未知错误'
		errorMessage.value = `获取邀请码失败: ${errorMessage}`
		invitationCode.value = null
	} finally {
		nextTick().then(() => {
			setTimeout(() => {
				isLoading.value = false
			}, 512)
		})
	}
}

/**
 * 复制邀请码到剪贴板
 */
const copyInvitationCode = async () => {
	if (!invitationCode.value) {
		return
	}

	try {
		if (navigator.clipboard && navigator.clipboard.writeText) {
			await navigator.clipboard.writeText(invitationCode.value)
		} else {
			const textArea = document.createElement('textarea')
			textArea.value = invitationCode.value
			textArea.style.position = 'fixed'
			textArea.style.left = '-999999px'
			textArea.style.top = '-999999px'
			document.body.appendChild(textArea)
			textArea.focus()
			textArea.select()
			document.execCommand('copy')
			document.body.removeChild(textArea)
		}
		isCopied.value = true

		setTimeout(() => {
			isCopied.value = false
		}, 2000)
	} catch (error) {
	}
}

/**
 * 刷新邀请码
 */
const refreshInvitationCode = () => {
	loadInvitationCode()
}

/**
 * 监听 dialogVisible 变化，打开时加载数据
 */
watch(dialogVisible, (newVal) => {
	if (newVal) {
		loadInvitationCode()
	} else {
		invitationCode.value = null
		isCopied.value = false
		errorMessage.value = null
	}
}, { immediate: false })

/**
 * 关闭弹窗
 */
const handleClose = () => {
	dialogVisible.value = false
	invitationCode.value = null
	isCopied.value = false
	errorMessage.value = null
}
</script>

<template>
	<el-dialog
		v-model="dialogVisible"
		v-if="dialogVisible"
		title="我的邀请码"
		width="90%"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		:teleported="true"
		class="invitation-code-form-dialog"
		modal-class="invitation-code-form-dialog-overlay"
		@close="handleClose"
	>
		<div class="invitation-code-form-container">
			<!-- 加载状态 -->
			<div v-if="isLoading" class="invitation-code-state">
				<el-icon :size="48" class="is-loading">
					<Star/>
				</el-icon>
				<p class="invitation-code-state-text">正在加载邀请码...</p>
			</div>

			<!-- 错误提示 -->
			<div v-else-if="errorMessage" class="invitation-code-state error">
				<el-icon :size="48">
					<Star/>
				</el-icon>
				<p class="invitation-code-state-text error-text">{{ errorMessage }}</p>
			</div>

			<!-- 无数据提示 -->
			<div v-else-if="!invitationCode" class="invitation-code-state">
				<el-icon :size="48">
					<Star/>
				</el-icon>
				<p class="invitation-code-state-text">暂无邀请码</p>
			</div>

			<!-- 邀请码展示 -->
			<div v-else class="invitation-code-content">
				<div class="invitation-code-info">
					<div class="invitation-code-label">您的专属邀请码</div>
					<div class="invitation-code-value">{{ invitationCode }}</div>
					<div class="invitation-code-tip">分享此邀请码给朋友，邀请他们加入AI坊</div>
				</div>

				<div class="invitation-code-actions">
					<el-button
						type="primary"
						@click="copyInvitationCode"
					>
						<template #icon>
							<el-icon>
								<DocumentCopy v-if="!isCopied"/>
								<Check v-else/>
							</el-icon>
						</template>
						{{ isCopied ? '已复制' : '复制邀请码' }}
					</el-button>
					<el-button @click="refreshInvitationCode">
						刷新
					</el-button>
				</div>
			</div>
		</div>

		<template #footer>
			<div>
				<el-button @click="handleClose">关闭</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style scoped>
/* ==================== 容器样式 ==================== */

.invitation-code-form-container {
	padding: 20px 0;
	min-height: 300px;
}

/* ==================== 状态显示 ==================== */

.invitation-code-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60px 20px;
	gap: 16px;
	color: var(--text-tertiary);
}

.invitation-code-state .el-icon {
	color: var(--text-tertiary);
}

.invitation-code-state-text {
	margin: 0;
	font-size: 14px;
}

.invitation-code-state.error .el-icon,
.invitation-code-state.error .invitation-code-state-text {
	color: var(--danger-color);
}

/* ==================== 邀请码内容 ==================== */

.invitation-code-content {
	display: flex;
	flex-direction: column;
	gap: 24px;
	align-items: center;
}

.invitation-code-info {
	display: flex;
	flex-direction: column;
	gap: 12px;
	align-items: center;
	text-align: center;
	padding: 24px 20px;
	background: var(--primary-gradient);
	border-radius: 16px;
	width: 100%;
	box-sizing: border-box;
}

.invitation-code-label {
	font-size: 14px;
	font-weight: 500;
	color: rgba(255, 255, 255, 0.8);
}

.invitation-code-value {
	font-size: 20px;
	font-weight: 600;
	color: #ffffff;
	padding: 16px 20px;
	background: rgba(255, 255, 255, 0.15);
	border-radius: 8px;
	font-family: 'Courier New', monospace;
	letter-spacing: 1px;
	word-break: break-all;
	max-width: 90%;
	backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.2);
}

.invitation-code-tip {
	font-size: 12px;
	color: rgba(255, 255, 255, 0.7);
	max-width: 280px;
}

/* ==================== 按钮区域 ==================== */

.invitation-code-actions {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
	justify-content: center;
}

.invitation-code-actions .el-button--primary {
	background: var(--primary-gradient);
	border: none;
}

/* ==================== 夜间模式适配 ==================== */
/* 移动端邀请码信息区域使用渐变背景，夜间模式保持与日间模式一致 */

html.dark .invitation-code-label {
	color: rgba(255, 255, 255, 0.8);
}

html.dark .invitation-code-value {
	color: #ffffff;
	background: rgba(255, 255, 255, 0.15);
}

html.dark .invitation-code-tip {
	color: rgba(255, 255, 255, 0.7);
}
</style>
