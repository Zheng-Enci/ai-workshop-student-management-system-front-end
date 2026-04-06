<script setup>
/**
 * 个人信息页面-头像上传表单组件(桌面端)
 * 
 * @description 提供用户头像上传、裁剪和预览功能，支持图片缩放和拖拽调整
 * @component ProfilePageUploadAvatarDesktopForm
 */

// ======================== 导入 ========================
import { ref, reactive, nextTick, onUnmounted, watch } from 'vue'
import { ElMessage, ElButton, ElIcon, ElDialog } from 'element-plus'
import { Camera, ZoomIn, ZoomOut } from '@element-plus/icons-vue'
import { uploadAvatar, getAvatarUrl } from '@/api/student'
import ProfilePageConfig from '@/views/ProfilePage/js/ProfilePageConfig'
import ProfilePageUtils from '@/views/ProfilePage/js/ProfilePageUtils'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-overlay.css'

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
 * 裁剪弹窗显示状态
 * @type {Ref<boolean>}
 * @description 控制头像裁剪弹窗的显示/隐藏
 */
const cropDialogVisible = ref(false)

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

// ======================== 裁剪相关状态 ========================
/**
 * 裁剪画布引用
 * @type {Ref<HTMLCanvasElement|null>}
 * @description Canvas元素引用，用于绘制裁剪后的头像
 */
const cropCanvasRef = ref(null)

/**
 * 裁剪容器引用
 * @type {Ref<HTMLElement|null>}
 * @description 裁剪区域的容器元素引用
 */
const cropWrapperRef = ref(null)

/**
 * 裁剪框引用
 * @type {Ref<HTMLElement|null>}
 * @description 裁剪框元素引用，用于定义裁剪区域
 */
const cropBoxRef = ref(null)

/**
 * 原始图片文件
 * @type {Ref<File|null>}
 * @description 用户选择的原始图片文件对象
 */
const originalImageFile = ref(null)

/**
 * 裁剪图片对象
 * @type {Ref<HTMLImageElement|null>}
 * @description 用于裁剪的图片对象引用
 */
const cropImage = ref(null)

/**
 * 图片缩放比例
 * @type {Ref<number>}
 * @description 图片的当前缩放比例，初始值为1(100%)
 */
const scale = ref(1)

/**
 * 最小缩放比例
 * @type {Ref<number>}
 * @description 图片允许的最小缩放比例，防止过度缩小
 */
const minScale = ref(0.1)

/**
 * 图片X轴偏移量
 * @type {Ref<number>}
 * @description 图片在裁剪区域中的X轴位置偏移
 */
const imageX = ref(0)

/**
 * 图片Y轴偏移量
 * @type {Ref<number>}
 * @description 图片在裁剪区域中的Y轴位置偏移
 */
const imageY = ref(0)

/**
 * 是否正在拖拽
 * @type {Ref<boolean>}
 * @description 标记用户是否正在拖拽图片
 */
const isDragging = ref(false)

/**
 * 拖拽起始X坐标
 * @type {Ref<number>}
 * @description 记录鼠标按下时的X坐标
 */
const dragStartX = ref(0)

/**
 * 拖拽起始Y坐标
 * @type {Ref<number>}
 * @description 记录鼠标按下时的Y坐标
 */
const dragStartY = ref(0)

/**
 * 拖拽起始图片X偏移
 * @type {Ref<number>}
 * @description 记录拖拽开始时的图片X轴偏移量
 */
const dragStartImageX = ref(0)

/**
 * 拖拽起始图片Y偏移
 * @type {Ref<number>}
 * @description 记录拖拽开始时的图片Y轴偏移量
 */
const dragStartImageY = ref(0)

// ======================== 事件处理器引用 ========================
/**
 * 鼠标按下事件处理器
 * @type {Function|null}
 * @description 用于移除事件监听器
 */
let mouseDownHandler = null

/**
 * 鼠标移动事件处理器
 * @type {Function|null}
 * @description 用于移除事件监听器
 */
let mouseMoveHandler = null

/**
 * 鼠标抬起事件处理器
 * @type {Function|null}
 * @description 用于移除事件监听器
 */
let mouseUpHandler = null

/**
 * 鼠标离开事件处理器
 * @type {Function|null}
 * @description 用于移除事件监听器
 */
let mouseLeaveHandler = null

/**
 * 鼠标滚轮事件处理器
 * @type {Function|null}
 * @description 用于移除事件监听器
 */
let wheelHandler = null

// ======================== 生命周期 ========================
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
 * 限制图片位置确保覆盖裁剪框
 * @function constrainImagePosition
 * @description 确保图片位置不会超出裁剪框边界
 * 计算图片在当前缩放比例下的尺寸，并根据裁剪框位置限制图片移动范围
 * @returns {void}
 */
const constrainImagePosition = () => {
	if (!cropCanvasRef.value || !cropImage.value || !cropBoxRef.value) {
		return
	}

	const canvas = cropCanvasRef.value
	const img = cropImage.value
	const cropBox = cropBoxRef.value

	const cropRect = cropBox.getBoundingClientRect()
	const canvasRect = canvas.getBoundingClientRect()

	let cropX, cropY, cropSize

	if (cropRect.width > 0) {
		cropX = cropRect.left - canvasRect.left
		cropY = cropRect.top - canvasRect.top
		cropSize = cropRect.width
	} else {
		cropX = parseFloat(cropBox.style.left) || 0
		cropY = parseFloat(cropBox.style.top) || 0
		cropSize = parseFloat(cropBox.style.width) || 300
	}

	const imgWidth = img.width * scale.value
	const imgHeight = img.height * scale.value

	const cropLeft = cropX
	const cropRight = cropX + cropSize
	const cropTop = cropY
	const cropBottom = cropY + cropSize

	if (imageX.value > cropLeft) {
		imageX.value = cropLeft
	}
	if (imageX.value + imgWidth < cropRight) {
		imageX.value = cropRight - imgWidth
	}
	if (imageY.value > cropTop) {
		imageY.value = cropTop
	}
	if (imageY.value + imgHeight < cropBottom) {
		imageY.value = cropBottom - imgHeight
	}
}

/**
 * 绘制裁剪画布，显示图片和裁剪遮罩
 * @function drawCropCanvas
 * @description 在Canvas上绘制图片和半透明遮罩层
 * 绘制流程:
 * 1. 清空画布
 * 2. 绘制图片
 * 3. 在裁剪框外部绘制半透明遮罩
 * @returns {void}
 */
const drawCropCanvas = () => {
	if (!cropCanvasRef.value || !cropImage.value) {
		return
	}

	const canvas = cropCanvasRef.value
	const ctx = canvas.getContext('2d')
	const img = cropImage.value

	ctx.clearRect(0, 0, canvas.width, canvas.height)

	const imgWidth = img.width * scale.value
	const imgHeight = img.height * scale.value

	ctx.save()
	ctx.drawImage(img, imageX.value, imageY.value, imgWidth, imgHeight)

	if (cropBoxRef.value) {
		const cropBox = cropBoxRef.value
		const cropRect = cropBox.getBoundingClientRect()
		const canvasRect = canvas.getBoundingClientRect()

		let cropX, cropY, cropSize

		if (cropRect.width > 0) {
			cropX = cropRect.left - canvasRect.left
			cropY = cropRect.top - canvasRect.top
			cropSize = cropRect.width
		} else {
			const left = parseFloat(cropBox.style.left) || 0
			const top = parseFloat(cropBox.style.top) || 0
			cropSize = parseFloat(cropBox.style.width) || 300
			cropX = left
			cropY = top
		}

		ctx.globalCompositeOperation = 'source-over'
		ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
		ctx.fillRect(0, 0, canvas.width, cropY)
		ctx.fillRect(0, cropY, cropX, cropSize)
		ctx.fillRect(cropX + cropSize, cropY, canvas.width - cropX - cropSize, cropSize)
		ctx.fillRect(0, cropY + cropSize, canvas.width, canvas.height - cropY - cropSize)
	}

	ctx.restore()
}

/**
 * 移除裁剪相关的事件监听器
 * @function removeCropEvents
 * @description 清除所有裁剪功能的鼠标事件监听器，防止内存泄漏
 * @returns {void}
 */
const removeCropEvents = () => {
	if (!cropCanvasRef.value) {
		return
	}

	const canvas = cropCanvasRef.value

	if (mouseDownHandler) {
		canvas.removeEventListener('mousedown', mouseDownHandler)
	}
	if (mouseMoveHandler) {
		document.removeEventListener('mousemove', mouseMoveHandler)
	}
	if (mouseUpHandler) {
		document.removeEventListener('mouseup', mouseUpHandler)
	}
	if (mouseLeaveHandler) {
		canvas.removeEventListener('mouseleave', mouseLeaveHandler)
	}
	if (wheelHandler) {
		canvas.removeEventListener('wheel', wheelHandler)
	}
}

/**
 * 设置裁剪相关的事件监听器
 * @function setupCropEvents
 * @description 为裁剪功能添加鼠标事件，支持拖拽移动和滚轮缩放
 * @returns {void}
 */
const setupCropEvents = () => {
	if (!cropCanvasRef.value) {
		return
	}

	removeCropEvents()

	const canvas = cropCanvasRef.value

	mouseDownHandler = e => {
		const { target } = e
		if (target === canvas || target === cropWrapperRef.value ||
			(cropWrapperRef.value && cropWrapperRef.value.contains(target))) {
			if (cropBoxRef.value && cropBoxRef.value.contains(target)) {
				return
			}
			e.preventDefault()
			e.stopPropagation()
			isDragging.value = true
			dragStartX.value = e.clientX
			dragStartY.value = e.clientY
			dragStartImageX.value = imageX.value
			dragStartImageY.value = imageY.value
			canvas.style.cursor = 'grabbing'
		}
	}

	mouseMoveHandler = e => {
		if (isDragging.value) {
			e.preventDefault()
			const deltaX = e.clientX - dragStartX.value
			const deltaY = e.clientY - dragStartY.value
			imageX.value = dragStartImageX.value + deltaX
			imageY.value = dragStartImageY.value + deltaY
			constrainImagePosition()
			drawCropCanvas()
		}
	}

	mouseUpHandler = () => {
		if (isDragging.value) {
			isDragging.value = false
			if (canvas) {
				canvas.style.cursor = 'move'
			}
		}
	}

	mouseLeaveHandler = () => {
	}

	wheelHandler = e => {
		e.preventDefault()
		e.stopPropagation()

		const oldScale = scale.value
		const delta = e.deltaY > 0 ? -0.01 : 0.01
		const newScale = Math.max(minScale.value, Math.min(5, scale.value + delta))

		if (newScale === oldScale) {
			return
		}

		if (cropBoxRef.value && cropCanvasRef.value) {
			const cropBox = cropBoxRef.value
			const canvasDom = cropCanvasRef.value
			const cropRect = cropBox.getBoundingClientRect()
			const canvasRect = canvasDom.getBoundingClientRect()

			const cropCenterX = (cropRect.left - canvasRect.left) + cropRect.width / 2
			const cropCenterY = (cropRect.top - canvasRect.top) + cropRect.height / 2
			const scaleRatio = newScale / oldScale

			imageX.value = cropCenterX - (cropCenterX - imageX.value) * scaleRatio
			imageY.value = cropCenterY - (cropCenterY - imageY.value) * scaleRatio
		}

		scale.value = newScale
		constrainImagePosition()
		drawCropCanvas()
	}

	canvas.addEventListener('mousedown', mouseDownHandler)
	document.addEventListener('mousemove', mouseMoveHandler)
	document.addEventListener('mouseup', mouseUpHandler)
	canvas.addEventListener('mouseleave', mouseLeaveHandler)
	canvas.addEventListener('wheel', wheelHandler)

	canvas.style.cursor = 'move'
}

/**
 * 初始化裁剪画布和相关设置
 * @function initCrop
 * @description 设置裁剪功能所需的画布尺寸、图片位置和缩放
 * @returns {void}
 */
const initCrop = () => {
	if (!cropCanvasRef.value || !cropImage.value || !cropWrapperRef.value) {
		return
	}

	const canvas = cropCanvasRef.value
	const wrapper = cropWrapperRef.value
	const img = cropImage.value

	let wrapperWidth = wrapper.clientWidth
	const wrapperHeight = 400

	if (wrapperWidth === 0) {
		wrapperWidth = wrapper.offsetWidth || 560
	}

	canvas.width = wrapperWidth
	canvas.height = wrapperHeight
	canvas.style.width = `${wrapperWidth}px`
	canvas.style.height = `${wrapperHeight}px`

	const imgAspect = img.width / img.height
	const wrapperAspect = wrapperWidth / wrapperHeight

	if (imgAspect > wrapperAspect) {
		scale.value = wrapperWidth / img.width * 0.8
	} else {
		scale.value = wrapperHeight / img.height * 0.8
	}

	imageX.value = (wrapperWidth - img.width * scale.value) / 2
	imageY.value = (wrapperHeight - img.height * scale.value) / 2

	const cropSize = Math.min(wrapperWidth * 0.6, wrapperHeight * 0.6, 300)
	const cropBox = cropBoxRef.value

	if (cropBox) {
		cropBox.style.width = `${cropSize}px`
		cropBox.style.left = `${(wrapperWidth - cropSize) / 2}px`
		cropBox.style.top = `${(wrapperHeight - cropSize) / 2}px`

		const imgMinSide = Math.min(img.width, img.height)
		minScale.value = cropSize / imgMinSide
	} else {
		minScale.value = 0.1
	}

	drawCropCanvas()
	setupCropEvents()
}

/**
 * 显示裁剪对话框并加载选中的图片
 * @function showCropDialog
 * @description 读取用户选择的图片文件，打开裁剪弹窗
 * @param {File} file - 用户选择的图片文件
 * @returns {Promise<void>}
 */
const showCropDialog = file => new Promise((resolve, reject) => {
	try {
		const dialogWrapper = document.querySelector('.profile-page-upload-avatar-desktop-form-dialog-overlay')
		if (dialogWrapper) {
			dialogWrapper.style.display = ''
			dialogWrapper.style.visibility = ''
			dialogWrapper.style.opacity = ''
		}

		const reader = new FileReader()
		reader.onload = e => {
			const img = new Image()
			img.onload = () => {
				cropImage.value = img
				cropDialogVisible.value = true

				nextTick(() => {
					setTimeout(() => {
						initCrop()
					}, 500)
				})
				resolve()
			}
			img.onerror = () => reject(new Error('图片加载失败'))
			img.src = e.target.result
		}
		reader.onerror = () => reject(new Error('文件读取失败'))
		reader.readAsDataURL(file)
	} catch (error) {
		reject(error)
	}
})

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
 * 放大图片
 * @function zoomIn
 * @description 增加图片缩放比例
 * @returns {void}
 */
const zoomIn = () => {
	const oldScale = scale.value
	const newScale = Math.min(5, scale.value + 0.01)

	if (newScale === oldScale) {
		return
	}

	if (cropBoxRef.value && cropCanvasRef.value) {
		const cropBox = cropBoxRef.value
		const canvasDom = cropCanvasRef.value
		const cropRect = cropBox.getBoundingClientRect()
		const canvasRect = canvasDom.getBoundingClientRect()

		const cropCenterX = (cropRect.left - canvasRect.left) + cropRect.width / 2
		const cropCenterY = (cropRect.top - canvasRect.top) + cropRect.height / 2
		const scaleRatio = newScale / oldScale

		imageX.value = cropCenterX - (cropCenterX - imageX.value) * scaleRatio
		imageY.value = cropCenterY - (cropCenterY - imageY.value) * scaleRatio
	}

	scale.value = newScale
	constrainImagePosition()
	drawCropCanvas()
}

/**
 * 缩小图片
 * @function zoomOut
 * @description 减少图片缩放比例
 * @returns {void}
 */
const zoomOut = () => {
	const oldScale = scale.value
	const newScale = Math.max(minScale.value, scale.value - 0.01)

	if (newScale === oldScale) {
		return
	}

	if (cropBoxRef.value && cropCanvasRef.value) {
		const cropBox = cropBoxRef.value
		const canvasDom = cropCanvasRef.value
		const cropRect = cropBox.getBoundingClientRect()
		const canvasRect = canvasDom.getBoundingClientRect()

		const cropCenterX = (cropRect.left - canvasRect.left) + cropRect.width / 2
		const cropCenterY = (cropRect.top - canvasRect.top) + cropRect.height / 2
		const scaleRatio = newScale / oldScale

		imageX.value = cropCenterX - (cropCenterX - imageX.value) * scaleRatio
		imageY.value = cropCenterY - (cropCenterY - imageY.value) * scaleRatio
	}

	scale.value = newScale
	constrainImagePosition()
	drawCropCanvas()
}

/**
 * 重置裁剪区域
 * @function resetCrop
 * @description 将裁剪区域重置为初始状态
 * @returns {void}
 */
const resetCrop = () => {
	if (cropImage.value && cropWrapperRef.value) {
		initCrop()
	}
}

/**
 * 取消裁剪
 * @function cancelCrop
 * @description 关闭裁剪对话框并清理裁剪数据
 * @returns {void}
 */
const cancelCrop = () => {
	const dialogWrapper = document.querySelector('.profile-page-upload-avatar-desktop-form-dialog-overlay')
	if (dialogWrapper) {
		dialogWrapper.style.opacity = '0'
	}

	cropImage.value = null
	cropDialogVisible.value = false

	setTimeout(() => {
		originalImageFile.value = null
		scale.value = 1
		imageX.value = 0
		imageY.value = 0
		isDragging.value = false
	}, 0)
}

/**
 * 确认裁剪并上传头像
 * @function confirmCrop
 * @description 执行裁剪操作，压缩图片并上传到服务器
 * @async
 * @returns {Promise<void>}
 */
const confirmCrop = async () => {
	if (!cropCanvasRef.value || !cropImage.value || !cropBoxRef.value) {
		return
	}

	isCropping.value = true

	try {
		const canvas = cropCanvasRef.value
		const cropBox = cropBoxRef.value
		const img = cropImage.value

		const canvasRect = canvas.getBoundingClientRect()
		const cropRect = cropBox.getBoundingClientRect()
		const cropX = cropRect.left - canvasRect.left
		const cropY = cropRect.top - canvasRect.top
		const cropSize = cropRect.width

		const sourceX = (cropX - imageX.value) / scale.value
		const sourceY = (cropY - imageY.value) / scale.value
		const sourceSize = cropSize / scale.value

		const cropCanvas = document.createElement('canvas')
		const outputSize = Math.min(img.width, img.height)
		cropCanvas.width = outputSize
		cropCanvas.height = outputSize
		const cropCtx = cropCanvas.getContext('2d')

		cropCtx.drawImage(
			img,
			sourceX, sourceY, sourceSize, sourceSize,
			0, 0, outputSize, outputSize
		)

		await new Promise(resolve => {
			cropCanvas.toBlob(async blob => {
				if (!blob) {
					ElMessage.error('裁剪失败')
					resolve()
					return
				}

				const croppedFile = new File(
					[blob],
					originalImageFile.value?.name || 'avatar.jpg',
					{
						type: originalImageFile.value?.type || 'image/jpeg',
						lastModified: Date.now()
					}
				)

				cropDialogVisible.value = false

				ElMessage.info('正在处理头像, 请稍候...')
				const compressedFile = await ProfilePageUtils.compressImage(croppedFile)

				await uploadAvatarFile(compressedFile)

				await loadAvatar()

				resolve()
			}, originalImageFile.value?.type || 'image/jpeg', 0.9)
		})
	} catch (error) {
		ElMessage.error(`裁剪失败：${error.message}`)
	} finally {
		isCropping.value = false
		cropImage.value = null
		originalImageFile.value = null
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
	<div class="profile-page-upload-avatar-desktop-form">
		<!-- 头像上传区域 -->
		<div class="profile-page-desktop-avatar-wrapper">
			<div class="profile-page-desktop-avatar-container" @click="triggerFileSelect">
				<div class="profile-page-desktop-avatar" :class="{ 'profile-page-desktop-avatar-loading': avatarLoading }">
					<img
						v-if="avatarUrl"
						:key="avatarUrl"
						v-lazy="avatarUrl"
						alt="头像"
						class="profile-page-desktop-avatar-image"
						@error="handleAvatarError"
					/>
					<el-icon v-else class="profile-page-desktop-avatar-icon">
						<Camera/>
					</el-icon>
					<div v-if="avatarLoading" class="profile-page-desktop-avatar-loading-spinner"/>
				</div>
				<div class="profile-page-desktop-avatar-status"/>
				<div class="profile-page-desktop-avatar-upload-overlay">
					<el-icon class="profile-page-desktop-upload-icon">
						<Camera/>
					</el-icon>
					<span class="profile-page-desktop-upload-text">点击上传头像</span>
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
			<div class="profile-page-desktop-avatar-tip">
				<el-icon class="profile-page-desktop-tip-icon">
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
			width="600px"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			modal-class="profile-page-upload-avatar-desktop-form-dialog-overlay"
			class="profile-page-upload-avatar-desktop-form-dialog"
		>
			<div class="profile-page-upload-avatar-desktop-form-container">
				<!-- 裁剪画布包装器 -->
				<div ref="cropWrapperRef" class="profile-page-upload-avatar-desktop-form-wrapper">
					<canvas ref="cropCanvasRef" class="profile-page-upload-avatar-desktop-form-canvas"/>
					<div ref="cropBoxRef" class="profile-page-upload-avatar-desktop-form-box"/>
				</div>
				<!-- 裁剪控制按钮 -->
				<div class="profile-page-upload-avatar-desktop-form-controls">
					<el-button :icon="ZoomOut" circle @click="zoomOut"/>
					<span class="profile-page-upload-avatar-desktop-form-zoom-info">{{ Math.round(scale * 100) }}%</span>
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

<style scoped>
@import '@/views/ProfilePage/css/desktop/profile-page-desktop-avatar.css';

.profile-page-upload-avatar-desktop-form-container {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.profile-page-upload-avatar-desktop-form-wrapper {
	position: relative;
	width: 100%;
	height: 400px;
	background: transparent;
	border-radius: 8px;
	overflow: visible;
}

html.dark .profile-page-upload-avatar-desktop-form-wrapper {
	background: transparent;
}

.profile-page-upload-avatar-desktop-form-canvas {
	display: block;
}

.profile-page-upload-avatar-desktop-form-box {
	position: absolute;
	overflow: visible;
	z-index: 5;
	outline: none;
	cursor: move;
	box-sizing: border-box;
}

html.dark .profile-page-upload-avatar-desktop-form-box {
	overflow: visible;
	z-index: 5;
	outline: none;
	cursor: move;
	box-sizing: border-box;
}

.profile-page-upload-avatar-desktop-form-controls {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12px;
}

.profile-page-upload-avatar-desktop-form-zoom-info {
	min-width: 60px;
	text-align: center;
	font-size: 14px;
	color: #666;
}
</style>
