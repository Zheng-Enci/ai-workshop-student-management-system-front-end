<script setup>
/**
 * 个人信息页面-头像上传表单组件(移动端)
 * 
 * @description 提供用户头像上传、裁剪和预览功能，支持图片缩放和拖拽调整
 * @component ProfilePageUploadAvatarMobileForm
 */

// ======================== 导入 ========================
import { ref, reactive, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage, ElButton, ElIcon, ElDialog } from 'element-plus'
import { Camera, ZoomIn, ZoomOut } from '@element-plus/icons-vue'
import { uploadAvatar, getAvatarUrl } from '@/api/student'
import ProfilePageConfig from '@/views/ProfilePage/mobile/common/js/profile-page-common-config'
import ProfilePageUtils from '@/views/ProfilePage/mobile/common/js/profile-page-common-utils'
import ImageCropper from '@/views/ProfilePage/mobile/forms/ts/ProfilePageUploadAvatarMobileForm.ts'

const imageCropper = new ImageCropper()

const cropDialogVisible = imageCropper.getCropDialogVisible()
const cropCanvasRef = imageCropper.getCropCanvasRef()
const cropWrapperRef = imageCropper.getCropWrapperRef()
// 在模板中通过 ref 绑定使用，无需额外读取
const cropBoxRef = imageCropper.getCropBoxRef()
const originalImageFile = imageCropper.getOriginalImageFile()
const cropImage = imageCropper.getCropImage()
const scale = imageCropper.getScale()
const minScale = imageCropper.getMinScale()
const imageX = imageCropper.getImageX()
const imageY = imageCropper.getImageY()
const isDragging = imageCropper.getIsDragging()

const removeCropEvents = () => imageCropper.removeCropEvents()
const setupCropEvents = () => imageCropper.setupCropEvents()
const initCrop = () => imageCropper.initCrop()
const showCropDialog = (file) => imageCropper.showCropDialog(file)
const zoomIn = () => imageCropper.zoomIn()
const zoomOut = () => imageCropper.zoomOut()
const resetCrop = () => imageCropper.resetCrop()
const closeCropDialog = () => imageCropper.closeCropDialog()
const cancelCrop = () => imageCropper.cancelCrop()
const performCrop = (canvas, cropBox, img) => imageCropper.performCrop(canvas, cropBox, img)

import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-overlay.css'
import '@/views/ProfilePage/mobile/forms/css/ProfilePageUploadAvatarMobileForm.css'

// ======================== Props ========================
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false
	},
	studentInfoId: {
		type: Number,
		default: null
	}
})

// ======================== Emits ========================
const emit = defineEmits(['update:modelValue', 'upload-success', 'upload-error'])

// ======================== 常量 ========================
/**
 * 文件输入框引用
 * @type {Ref<HTMLInputElement|null>}
 * @description 隐藏的文件输入框引用，用于触发文件选择
 */
const fileInputRef = ref(null)

// ======================== 响应式状态 ========================
/**
 * 头像URL
 * @type {Ref<string|null>}
 * @description 用户头像的URL地址
 */
const avatarUrl = ref(null)

/**
 * 头像加载状态
 * @type {Ref<boolean>}
 * @description 控制头像加载中的状态显示
 */
const avatarLoading = ref(false)

/**
 * 头像上传状态
 * @type {Ref<boolean>}
 * @description 控制头像上传操作加载中的状态显示
 */
const isUploading = ref(false)

/**
 * 头像裁剪状态
 * @type {Ref<boolean>}
 * @description 控制头像裁剪操作进行中的状态显示
 */
const isCropping = ref(false)

// ======================== 生命周期 ========================
/**
 * 组件挂载时加载头像
 * @function onMounted
 * @description 组件挂载后立即加载用户头像
 */
onMounted(() => {
	loadAvatar()
})

/**
 * 组件卸载时移除事件监听器
 * @function onUnmounted
 * @description 清理裁剪功能的事件监听器，防止内存泄漏
 */
onUnmounted(() => {
	removeCropEvents()
})

// ======================== 方法 ========================

/**
 * 加载用户头像
 * @function loadAvatar
 * @description 获取用户头像URL，头像加载由v-lazy处理
 * @async
 * @returns {Promise<void>}
 */
const loadAvatar = async () => {
	if (!props.studentInfoId) {
		return
	}

	const timestamp = Date.now()
	const avatarUrlString = getAvatarUrl(props.studentInfoId, ProfilePageConfig.AVATAR_SIZE)
	avatarUrl.value = `${avatarUrlString}&t=${timestamp}`
}

/**
 * 触发文件选择
 * @function triggerFileSelect
 * @description 触发隐藏的文件输入框点击事件
 * @returns {void}
 */
const triggerFileSelect = () => {
	fileInputRef.value?.click()
}

/**
 * 处理头像加载错误
 * @function handleAvatarError
 * @description 头像加载失败时设置为null
 * @returns {void}
 */
const handleAvatarError = () => {
	avatarUrl.value = null
}

/**
 * 处理文件选择
 * @function handleFileSelect
 * @description 处理用户选择的图片文件
 * @param {Event} event - 文件输入change事件
 * @returns {void}
 */
const handleFileSelect = event => {
	const file = event.target.files?.[0]
	if (!file) {
		return
	}

	if (!file.type.startsWith('image/')) {
		ElMessage.error('请选择图片文件')
		return
	}

	try {
		originalImageFile.value = file
		showCropDialog(file).catch(err => {
			ElMessage.error(`图片加载失败：${err.message}`)
		})
	} catch (error) {
		ElMessage.error(`图片加载失败：${error.message}`)
	} finally {
		if (fileInputRef.value) {
			fileInputRef.value.value = ''
		}
	}
}

/**
 * 上传头像文件到服务器
 * @function uploadAvatarFile
 * @description 将裁剪并压缩后的头像文件上传到服务器
 * @param {File} file - 裁剪并压缩后的头像文件
 * @async
 * @returns {Promise<void>}
 */
const uploadAvatarFile = async file => {
	isUploading.value = true

	try {
		const token = localStorage.getItem('token')
		if (!token) {
			ElMessage.error('请先登录')
			return
		}

		ElMessage.info('正在上传头像, 请稍候...')
		const response = await uploadAvatar(token, file)

		if (response && response.code === 200) {
			ElMessage.success('头像上传成功')
			emit('upload-success')
		} else {
			ElMessage.error(response?.message || '头像上传失败')
			emit('upload-error', response?.message || '头像上传失败')
		}
	} catch (error) {
		const errorMessage = error.response?.data?.message || error.message || '头像上传失败'
		ElMessage.error(`头像上传失败：${errorMessage}`)
		emit('upload-error', errorMessage)
	} finally {
		isUploading.value = false
	}
}

/**
 * 初始化组件
 * @function init
 * @description 组件初始化时加载头像
 * @async
 * @returns {Promise<void>}
 */
const init = async () => {
	if (props.studentInfoId) {
		await loadAvatar()
	}
}

init()

/**
 * 监听 studentInfoId 变化,当 ID 可用时加载头像
 * @watch studentInfoId
 * @description 监听父组件传入的 studentInfoId 属性,当值变化时重新加载头像
 */
watch(() => props.studentInfoId, newId => {
	if (newId) {
		loadAvatar()
	}
})
</script>

<template>
	<div class="profile-page-upload-avatar-mobile-form">
		<!-- 头像上传区域 -->
		<div class="profile-page-upload-avatar-mobile-form-wrapper">
			<div class="profile-page-upload-avatar-mobile-form-container" @click="triggerFileSelect">
				<div class="profile-page-upload-avatar-mobile-form-content" :class="{ 'profile-page-upload-avatar-mobile-form-loading': avatarLoading }">
					<img
						v-if="avatarUrl"
						:key="avatarUrl"
						v-lazy="avatarUrl"
						alt="头像"
						class="profile-page-upload-avatar-mobile-form-image"
						@error="handleAvatarError"
					/>
					<el-icon v-else class="profile-page-upload-avatar-mobile-form-icon">
						<Camera/>
					</el-icon>
					<div v-if="avatarLoading" class="profile-page-upload-avatar-mobile-form-loading-spinner"/>
				</div>
				<div class="profile-page-upload-avatar-mobile-form-upload-overlay">
					<el-icon class="profile-page-upload-avatar-mobile-form-upload-icon">
						<Camera/>
					</el-icon>
					<span class="profile-page-upload-avatar-mobile-form-upload-text">点击上传头像</span>
				</div>
				<!-- 文件输入 -->
				<input
					ref="fileInputRef"
					type="file"
					accept="image/*"
					style="display: none"
					@change="handleFileSelect"
				/>
			</div>
			<div class="profile-page-upload-avatar-mobile-form-tip">
				<el-icon class="profile-page-upload-avatar-mobile-form-tip-icon">
					<Camera/>
				</el-icon>
				<span class="tip-text">{{
					avatarUrl ? '点击头像修改头像' : '点击头像上传头像'
				}}</span>
			</div>
		</div>

		<!-- 头像裁剪对话框 -->
		<el-dialog
			v-model="cropDialogVisible"
			title="裁剪头像"
			width="90%"
			:close-on-click-modal="true"
			:close-on-press-escape="true"
			destroy-on-close
			modal-class="profile-page-upload-avatar-mobile-form-dialog-overlay"
			class="profile-page-upload-avatar-mobile-form-dialog"
			@close="closeCropDialog"
		>
			<div class="profile-page-upload-avatar-mobile-form-canvas-container">
				<!-- 裁剪画布包装器 -->
				<div ref="cropWrapperRef" class="profile-page-upload-avatar-mobile-form-canvas-wrapper">
					<canvas ref="cropCanvasRef" class="profile-page-upload-avatar-mobile-form-canvas"/>
					<div ref="cropBoxRef" class="profile-page-upload-avatar-mobile-form-box"/>
				</div>
				<!-- 裁剪控制按钮 -->
				<div class="profile-page-upload-avatar-mobile-form-controls">
					<el-button :icon="ZoomOut" circle @click="zoomOut"/>
					<span class="profile-page-upload-avatar-mobile-form-zoom-info">{{ Math.round(scale * 100) }}%</span>
					<el-button :icon="ZoomIn" circle @click="zoomIn"/>
					<el-button style="margin-left: 20px;" @click="resetCrop">重置</el-button>
				</div>
			</div>
			<template #footer>
				<el-button @click="cancelCrop">取消</el-button>
				<el-button type="primary" :loading="isCropping" @click="confirmCrop">确认裁剪</el-button>
			</template>
		</el-dialog>
	</div>
</template>
