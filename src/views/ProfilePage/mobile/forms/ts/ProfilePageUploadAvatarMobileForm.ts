/**
 * 头像裁剪模块
 * 提供头像裁剪、缩放、拖拽等核心逻辑
 *
 * @module ProfilePageUploadAvatarMobileForm
 * @description 封装头像裁剪功能的所有核心逻辑，包括Canvas绘制、事件处理、图片缩放等
 */

import { ref, nextTick } from 'vue'

/**
 * 裁剪弹窗显示状态
 * @type {Ref<boolean>}
 * @description 控制头像裁剪弹窗的显示/隐藏
 */
export const cropDialogVisible = ref(false)

/**
 * 裁剪画布引用
 * @type {Ref<HTMLCanvasElement|null>}
 * @description Canvas元素引用，用于绘制裁剪后的头像
 */
export const cropCanvasRef = ref(null)

/**
 * 裁剪容器引用
 * @type {Ref<HTMLElement|null>}
 * @description 裁剪区域的容器元素引用
 */
export const cropWrapperRef = ref(null)

/**
 * 裁剪框引用
 * @type {Ref<HTMLElement|null>}
 * @description 裁剪框元素引用，用于定义裁剪区域
 */
export const cropBoxRef = ref(null)

/**
 * 原始图片文件
 * @type {Ref<File|null>}
 * @description 用户选择的原始图片文件对象
 */
export const originalImageFile = ref(null)

/**
 * 裁剪图片对象
 * @type {Ref<HTMLImageElement|null>}
 * @description 用于裁剪的图片对象引用
 */
export const cropImage = ref(null)

/**
 * 图片缩放比例
 * @type {Ref<number>}
 * @description 图片的当前缩放比例，初始值为1(100%)
 */
export const scale = ref(1)

/**
 * 最小缩放比例
 * @type {Ref<number>}
 * @description 图片允许的最小缩放比例，防止过度缩小
 */
export const minScale = ref(0.1)

/**
 * 图片X轴偏移量
 * @type {Ref<number>}
 * @description 图片在裁剪区域中的X轴位置偏移
 */
export const imageX = ref(0)

/**
 * 图片Y轴偏移量
 * @type {Ref<number>}
 * @description 图片在裁剪区域中的Y轴位置偏移
 */
export const imageY = ref(0)

/**
 * 是否正在拖拽
 * @type {Ref<boolean>}
 * @description 标记用户是否正在拖拽图片
 */
export const isDragging = ref(false)

/**
 * 拖拽起始X坐标
 * @type {Ref<number>}
 * @description 记录鼠标按下时的X坐标
 */
export const dragStartX = ref(0)

/**
 * 拖拽起始Y坐标
 * @type {Ref<number>}
 * @description 记录鼠标按下时的Y坐标
 */
export const dragStartY = ref(0)

/**
 * 拖拽起始图片X偏移
 * @type {Ref<number>}
 * @description 记录拖拽开始时的图片X轴偏移量
 */
export const dragStartImageX = ref(0)

/**
 * 拖拽起始图片Y偏移
 * @type {Ref<number>}
 * @description 记录拖拽开始时的图片Y轴偏移量
 */
export const dragStartImageY = ref(0)

/**
 * 鼠标按下事件处理器
 * @type {Ref<Function|null>}
 * @description 用于移除事件监听器
 */
export const mouseDownHandler = ref(null)

/**
 * 鼠标移动事件处理器
 * @type {Ref<Function|null>}
 * @description 用于移除事件监听器
 */
export const mouseMoveHandler = ref(null)

/**
 * 鼠标抬起事件处理器
 * @type {Ref<Function|null>}
 * @description 用于移除事件监听器
 */
export const mouseUpHandler = ref(null)

/**
 * 鼠标离开事件处理器
 * @type {Ref<Function|null>}
 * @description 用于移除事件监听器
 */
export const mouseLeaveHandler = ref(null)

/**
 * 鼠标滚轮事件处理器
 * @type {Ref<Function|null>}
 * @description 用于移除事件监听器
 */
export const wheelHandler = ref(null)

/**
 * 限制图片位置确保覆盖裁剪框
 * @function constrainImagePosition
 * @description 确保图片位置不会超出裁剪框边界
 * 计算图片在当前缩放比例下的尺寸，并根据裁剪框位置限制图片移动范围
 * @returns {void}
 */
export const constrainImagePosition = () => {
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
export const drawCropCanvas = () => {
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
export const removeCropEvents = () => {
	if (!cropCanvasRef.value) {
		return
	}

	const canvas = cropCanvasRef.value

	if (mouseDownHandler.value) {
		canvas.removeEventListener('mousedown', mouseDownHandler.value)
	}
	if (mouseMoveHandler.value) {
		document.removeEventListener('mousemove', mouseMoveHandler.value)
	}
	if (mouseUpHandler.value) {
		document.removeEventListener('mouseup', mouseUpHandler.value)
	}
	if (mouseLeaveHandler.value) {
		canvas.removeEventListener('mouseleave', mouseLeaveHandler.value)
	}
	if (wheelHandler.value) {
		canvas.removeEventListener('wheel', wheelHandler.value)
	}
}

/**
 * 设置裁剪相关的事件监听器
 * @function setupCropEvents
 * @description 为裁剪功能添加鼠标事件，支持拖拽移动和滚轮缩放
 * @returns {void}
 */
export const setupCropEvents = () => {
	if (!cropCanvasRef.value) {
		return
	}

	removeCropEvents()

	const canvas = cropCanvasRef.value

	mouseDownHandler.value = e => {
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

	mouseMoveHandler.value = e => {
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

	mouseUpHandler.value = () => {
		if (isDragging.value) {
			isDragging.value = false
			if (canvas) {
				canvas.style.cursor = 'move'
			}
		}
	}

	mouseLeaveHandler.value = () => {
	}

	wheelHandler.value = e => {
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

	canvas.addEventListener('mousedown', mouseDownHandler.value)
	document.addEventListener('mousemove', mouseMoveHandler.value)
	document.addEventListener('mouseup', mouseUpHandler.value)
	canvas.addEventListener('mouseleave', mouseLeaveHandler.value)
	canvas.addEventListener('wheel', wheelHandler.value)

	canvas.style.cursor = 'move'
}

/**
 * 初始化裁剪画布和相关设置
 * @function initCrop
 * @description 设置裁剪功能所需的画布尺寸、图片位置和缩放
 * @returns {void}
 */
export const initCrop = () => {
	if (!cropCanvasRef.value || !cropImage.value || !cropWrapperRef.value) {
		return
	}

	const canvas = cropCanvasRef.value
	const wrapper = cropWrapperRef.value
	const img = cropImage.value

	let wrapperWidth = wrapper.clientWidth
	const wrapperHeight = 200

	if (wrapperWidth === 0) {
		wrapperWidth = wrapper.offsetWidth || 320
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
export const showCropDialog = file => new Promise((resolve, reject) => {
	try {
		const dialogWrapper = document.querySelector('.profile-page-upload-avatar-mobile-form-dialog-overlay')
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
 * 放大图片
 * @function zoomIn
 * @description 增加图片缩放比例
 * @returns {void}
 */
export const zoomIn = () => {
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
export const zoomOut = () => {
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
export const resetCrop = () => {
	if (cropImage.value && cropWrapperRef.value) {
		initCrop()
	}
}

/**
 * 关闭裁剪对话框并清理数据
 * @function closeCropDialog
 * @description 关闭对话框，先执行淡出动画再清理数据
 * @returns {void}
 */
export const closeCropDialog = () => {
	const dialogWrapper = document.querySelector('.profile-page-upload-avatar-mobile-form-dialog-overlay')
	if (dialogWrapper) {
		dialogWrapper.style.opacity = '0'
	}

	cropImage.value = null

	setTimeout(() => {
		originalImageFile.value = null
		scale.value = 1
		imageX.value = 0
		imageY.value = 0
		isDragging.value = false
	}, 0)
}

/**
 * 取消裁剪
 * @function cancelCrop
 * @description 关闭裁剪对话框并清理裁剪数据
 * @returns {void}
 */
export const cancelCrop = () => {
	closeCropDialog()
}

/**
 * 执行裁剪操作
 * @function performCrop
 * @description 执行裁剪操作，生成裁剪后的图片数据
 * @param {HTMLCanvasElement} canvas - 裁剪画布
 * @param {HTMLElement} cropBox - 裁剪框元素
 * @param {HTMLImageElement} img - 要裁剪的图片
 * @returns {Object} 裁剪后的Canvas对象和裁剪信息
 */
export const performCrop = (canvas, cropBox, img) => {
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

	return {
		cropCanvas,
		outputSize,
		originalFile: originalImageFile.value
	}
}

/**
 * 重置裁剪状态
 * @function resetCropState
 * @description 重置所有裁剪相关的状态值
 * @returns {void}
 */
export const resetCropState = () => {
	scale.value = 1
	minScale.value = 0.1
	imageX.value = 0
	imageY.value = 0
	isDragging.value = false
	dragStartX.value = 0
	dragStartY.value = 0
	dragStartImageX.value = 0
	dragStartImageY.value = 0
	originalImageFile.value = null
	cropImage.value = null
}
