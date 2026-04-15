/**
 * 头像裁剪器类
 * 提供头像裁剪、缩放、拖拽等核心逻辑
 *
 * @class ProfilePageUploadAvatarMobileForm
 * @description 封装头像裁剪功能的所有核心逻辑，包括Canvas绘制、事件处理、图片缩放等
 */

import { ref, nextTick } from 'vue'

export default class ProfilePageUploadAvatarMobileForm {
	/**
	 * 裁剪弹窗显示状态
	 * @private
	 */
	private cropDialogVisible = ref(false)

	/**
	 * 裁剪画布引用
	 * @private
	 */
	private cropCanvasRef = ref(null)

	/**
	 * 裁剪容器引用
	 * @private
	 */
	private cropWrapperRef = ref(null)

	/**
	 * 裁剪框引用
	 * @private
	 */
	private cropBoxRef = ref(null)

	/**
	 * 原始图片文件
	 * @private
	 */
	private originalImageFile = ref<File | null>(null)

	/**
	 * 裁剪图片对象
	 * @private
	 */
	private cropImage = ref(null)

	/**
	 * 图片缩放比例
	 * @private
	 */
	private scale = ref(1)

	/**
	 * 最小缩放比例
	 * @private
	 */
	private minScale = ref(0.1)

	/**
	 * 图片X轴偏移量
	 * @private
	 */
	private imageX = ref(0)

	/**
	 * 图片Y轴偏移量
	 * @private
	 */
	private imageY = ref(0)

	/**
	 * 是否正在拖拽
	 * @private
	 */
	private isDragging = ref(false)

	/**
	 * 拖拽起始X坐标
	 * @private
	 */
	private dragStartX = ref(0)

	/**
	 * 拖拽起始Y坐标
	 * @private
	 */
	private dragStartY = ref(0)

	/**
	 * 拖拽起始图片X偏移
	 * @private
	 */
	private dragStartImageX = ref(0)

	/**
	 * 拖拽起始图片Y偏移
	 * @private
	 */
	private dragStartImageY = ref(0)

	/**
	 * 鼠标按下事件处理器
	 * @private
	 */
	private mouseDownHandler = ref(null)

	/**
	 * 鼠标移动事件处理器
	 * @private
	 */
	private mouseMoveHandler = ref(null)

	/**
	 * 鼠标抬起事件处理器
	 * @private
	 */
	private mouseUpHandler = ref(null)

	/**
	 * 鼠标离开事件处理器
	 * @private
	 */
	private mouseLeaveHandler = ref(null)

	/**
	 * 鼠标滚轮事件处理器
	 * @private
	 */
	private wheelHandler = ref(null)

	/**
	 * 触摸开始事件处理器
	 * @private
	 */
	private touchStartHandler = ref(null)

	/**
	 * 触摸移动事件处理器
	 * @private
	 */
	private touchMoveHandler = ref(null)

	/**
	 * 触摸结束事件处理器
	 * @private
	 */
	private touchEndHandler = ref(null)

	/**
	 * 获取裁剪弹窗显示状态
	 * @returns {typeof cropDialogVisible}
	 */
	public getCropDialogVisible() {
		return this.cropDialogVisible
	}

	/**
	 * 设置裁剪弹窗显示状态
	 * @param {boolean} value
	 */
	public setCropDialogVisible(value: boolean) {
		this.cropDialogVisible.value = value
	}

	/**
	 * 获取裁剪画布引用
	 * @returns {typeof cropCanvasRef}
	 */
	public getCropCanvasRef() {
		return this.cropCanvasRef
	}

	/**
	 * 获取裁剪容器引用
	 * @returns {typeof cropWrapperRef.value}
	 */
	public getCropWrapperRef() {
		return this.cropWrapperRef
	}

	/**
	 * 获取裁剪框引用
	 * @returns {typeof cropBoxRef.value}
	 */
	public getCropBoxRef() {
		return this.cropBoxRef
	}

	/**
	 * 获取原始图片文件
	 * @returns {typeof originalImageFile.value}
	 */
	public getOriginalImageFile() {
		return this.originalImageFile
	}

	/**
	 * 设置原始图片文件
	 * @param {File | null} file
	 */
	public setOriginalImageFile(file: File | null) {
		this.originalImageFile.value = file
	}

	/**
	 * 获取裁剪图片对象
	 * @returns {typeof cropImage.value}
	 */
	public getCropImage() {
		return this.cropImage
	}

	/**
	 * 设置裁剪图片对象
	 * @param {HTMLImageElement | null} img
	 */
	public setCropImage(img: HTMLImageElement | null) {
		this.cropImage.value = img
	}

	/**
	 * 获取图片缩放比例
	 * @returns {typeof scale.value}
	 */
	public getScale() {
		return this.scale
	}

	/**
	 * 获取最小缩放比例
	 * @returns {typeof minScale.value}
	 */
	public getMinScale() {
		return this.minScale
	}

	/**
	 * 获取图片X轴偏移量
	 * @returns {typeof imageX.value}
	 */
	public getImageX() {
		return this.imageX
	}

	/**
	 * 获取图片Y轴偏移量
	 * @returns {typeof imageY.value}
	 */
	public getImageY() {
		return this.imageY
	}

	/**
	 * 获取是否正在拖拽
	 * @returns {typeof isDragging.value}
	 */
	public getIsDragging() {
		return this.isDragging
	}

	/**
	 * 限制图片位置确保覆盖裁剪框
	 * @method constrainImagePosition
	 * @description 确保图片位置不会超出裁剪框边界
	 * 计算图片在当前缩放比例下的尺寸，并根据裁剪框位置限制图片移动范围
	 * @returns {void}
	 */
	private constrainImagePosition() {
		if (!this.cropCanvasRef.value || !this.cropImage.value || !this.cropBoxRef.value) {
			return
		}

		const canvas = this.cropCanvasRef.value
		const img = this.cropImage.value
		const cropBox = this.cropBoxRef.value

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

		const imgWidth = img.width * this.scale.value
		const imgHeight = img.height * this.scale.value

		const cropLeft = cropX
		const cropRight = cropX + cropSize
		const cropTop = cropY
		const cropBottom = cropY + cropSize

		if (this.imageX.value > cropLeft) {
			this.imageX.value = cropLeft
		}
		if (this.imageX.value + imgWidth < cropRight) {
			this.imageX.value = cropRight - imgWidth
		}
		if (this.imageY.value > cropTop) {
			this.imageY.value = cropTop
		}
		if (this.imageY.value + imgHeight < cropBottom) {
			this.imageY.value = cropBottom - imgHeight
		}
	}

	/**
	 * 绘制裁剪画布，显示图片和裁剪遮罩
	 * @method drawCropCanvas
	 * @description 在Canvas上绘制图片和半透明遮罩层
	 * 绘制流程:
	 * 1. 清空画布
	 * 2. 绘制图片
	 * 3. 在裁剪框外部绘制半透明遮罩
	 * @returns {void}
	 */
	private drawCropCanvas() {
		if (!this.cropCanvasRef.value || !this.cropImage.value) {
			return
		}

		const canvas = this.cropCanvasRef.value
		const ctx = canvas.getContext('2d')
		const img = this.cropImage.value

		ctx.clearRect(0, 0, canvas.width, canvas.height)

		const imgWidth = img.width * this.scale.value
		const imgHeight = img.height * this.scale.value

		ctx.save()
		ctx.drawImage(img, this.imageX.value, this.imageY.value, imgWidth, imgHeight)

		if (this.cropBoxRef.value) {
			const cropBox = this.cropBoxRef.value
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
	 * @method removeCropEvents
	 * @description 清除所有裁剪功能的鼠标事件监听器，防止内存泄漏
	 * @returns {void}
	 */
	private removeCropEvents() {
		if (!this.cropCanvasRef.value) {
			return
		}

		const canvas = this.cropCanvasRef.value

		if (this.mouseDownHandler.value) {
			canvas.removeEventListener('mousedown', this.mouseDownHandler.value)
		}
		if (this.mouseMoveHandler.value) {
			document.removeEventListener('mousemove', this.mouseMoveHandler.value)
		}
		if (this.mouseUpHandler.value) {
			document.removeEventListener('mouseup', this.mouseUpHandler.value)
		}
		if (this.mouseLeaveHandler.value) {
			canvas.removeEventListener('mouseleave', this.mouseLeaveHandler.value)
		}
		if (this.wheelHandler.value) {
			canvas.removeEventListener('wheel', this.wheelHandler.value)
		}
		if (this.touchStartHandler.value) {
			canvas.removeEventListener('touchstart', this.touchStartHandler.value)
		}
		if (this.touchMoveHandler.value) {
			document.removeEventListener('touchmove', this.touchMoveHandler.value)
		}
		if (this.touchEndHandler.value) {
			document.removeEventListener('touchend', this.touchEndHandler.value)
		}
	}

	private initialPinchDistance = ref(0)
	private initialPinchScale = ref(1)
	private isPinching = ref(false)

	/**
	 * 计算两个触摸点之间的距离
	 * @method getPinchDistance
	 * @description 根据两个触摸点坐标计算它们之间的距离
	 * @param {Touch} touch1 - 第一个触摸点
	 * @param {Touch} touch2 - 第二个触摸点
	 * @returns {number} 两点之间的距离
	 */
	private getPinchDistance(touch1: Touch, touch2: Touch): number {
		const dx = touch1.clientX - touch2.clientX
		const dy = touch1.clientY - touch2.clientY
		return Math.sqrt(dx * dx + dy * dy)
	}

	/**
	 * 计算两个触摸点的中心点
	 * @method getPinchCenter
	 * @description 计算两个触摸点的中心坐标，用于缩放时以中心为基准
	 * @param {Touch} touch1 - 第一个触摸点
	 * @param {Touch} touch2 - 第二个触摸点
	 * @returns {{ x: number, y: number }} 中心点坐标
	 */
	private getPinchCenter(touch1: Touch, touch2: Touch): { x: number; y: number } {
		return {
			x: (touch1.clientX + touch2.clientX) / 2,
			y: (touch1.clientY + touch2.clientY) / 2
		}
	}

	/**
	 * 设置裁剪相关的事件监听器
	 * @method setupCropEvents
	 * @description 为裁剪功能添加鼠标事件，支持拖拽移动和滚轮缩放
	 * @returns {void}
	 */
	private setupCropEvents() {
		if (!this.cropCanvasRef.value) {
			return
		}

		this.removeCropEvents()

		const canvas = this.cropCanvasRef.value

		this.mouseDownHandler.value = e => {
			const { target } = e
			if (target === canvas || target === this.cropWrapperRef.value ||
				(this.cropWrapperRef.value && this.cropWrapperRef.value.contains(target))) {
				if (this.cropBoxRef.value && this.cropBoxRef.value.contains(target)) {
					return
				}
				e.preventDefault()
				e.stopPropagation()
				this.isDragging.value = true
				this.dragStartX.value = e.clientX
				this.dragStartY.value = e.clientY
				this.dragStartImageX.value = this.imageX.value
				this.dragStartImageY.value = this.imageY.value
				canvas.style.cursor = 'grabbing'
			}
		}

		this.mouseMoveHandler.value = e => {
			if (this.isDragging.value) {
				e.preventDefault()
				const deltaX = e.clientX - this.dragStartX.value
				const deltaY = e.clientY - this.dragStartY.value
				this.imageX.value = this.dragStartImageX.value + deltaX
				this.imageY.value = this.dragStartImageY.value + deltaY
				this.constrainImagePosition()
				this.drawCropCanvas()
			}
		}

		this.mouseUpHandler.value = () => {
			if (this.isDragging.value) {
				this.isDragging.value = false
				if (canvas) {
					canvas.style.cursor = 'move'
				}
			}
		}

		this.mouseLeaveHandler.value = () => {
		}

		this.wheelHandler.value = e => {
			e.preventDefault()
			e.stopPropagation()

			const oldScale = this.scale.value
			const delta = e.deltaY > 0 ? -0.01 : 0.01
			const newScale = Math.max(this.minScale.value, Math.min(5, this.scale.value + delta))

			if (newScale === oldScale) {
				return
			}

			if (this.cropBoxRef.value && this.cropCanvasRef.value) {
				const cropBox = this.cropBoxRef.value
				const canvasDom = this.cropCanvasRef.value
				const cropRect = cropBox.getBoundingClientRect()
				const canvasRect = canvasDom.getBoundingClientRect()

				const cropCenterX = (cropRect.left - canvasRect.left) + cropRect.width / 2
				const cropCenterY = (cropRect.top - canvasRect.top) + cropRect.height / 2
				const scaleRatio = newScale / oldScale

				this.imageX.value = cropCenterX - (cropCenterX - this.imageX.value) * scaleRatio
				this.imageY.value = cropCenterY - (cropCenterY - this.imageY.value) * scaleRatio
			}

			this.scale.value = newScale
			this.constrainImagePosition()
			this.drawCropCanvas()
		}

		canvas.addEventListener('mousedown', this.mouseDownHandler.value)
		document.addEventListener('mousemove', this.mouseMoveHandler.value)
		document.addEventListener('mouseup', this.mouseUpHandler.value)
		canvas.addEventListener('mouseleave', this.mouseLeaveHandler.value)
		canvas.addEventListener('wheel', this.wheelHandler.value)

		canvas.style.cursor = 'move'

		this.touchStartHandler.value = e => {
			if (e.touches.length === 2) {
				e.preventDefault()
				this.isPinching.value = true
				this.isDragging.value = false
				const touch1 = e.touches[0]
				const touch2 = e.touches[1]
				this.initialPinchDistance.value = this.getPinchDistance(touch1, touch2)
				this.initialPinchScale.value = this.scale.value
				const center = this.getPinchCenter(touch1, touch2)
				this.dragStartX.value = center.x
				this.dragStartY.value = center.y
				this.dragStartImageX.value = this.imageX.value
				this.dragStartImageY.value = this.imageY.value
			} else if (e.touches.length === 1) {
				const touch = e.touches[0]
				const { target } = e
				if (target === canvas || target === this.cropWrapperRef.value ||
					(this.cropWrapperRef.value && this.cropWrapperRef.value.contains(target))) {
					if (this.cropBoxRef.value && this.cropBoxRef.value.contains(target)) {
						return
					}
					e.preventDefault()
					this.isDragging.value = true
					this.dragStartX.value = touch.clientX
					this.dragStartY.value = touch.clientY
					this.dragStartImageX.value = this.imageX.value
					this.dragStartImageY.value = this.imageY.value
				}
			}
		}

		this.touchMoveHandler.value = e => {
			if (e.touches.length === 2 && this.isPinching.value) {
				e.preventDefault()
				const touch1 = e.touches[0]
				const touch2 = e.touches[1]
				const currentDistance = this.getPinchDistance(touch1, touch2)
				const scaleFactor = currentDistance / this.initialPinchDistance.value
				const newScale = Math.max(
					this.minScale.value,
					Math.min(5, this.initialPinchScale.value * scaleFactor)
				)

				if (this.cropBoxRef.value && this.cropCanvasRef.value) {
					const cropBox = this.cropBoxRef.value
					const canvasDom = this.cropCanvasRef.value
					const cropRect = cropBox.getBoundingClientRect()
					const canvasRect = canvasDom.getBoundingClientRect()

					const cropCenterX = (cropRect.left - canvasRect.left) + cropRect.width / 2
					const cropCenterY = (cropRect.top - canvasRect.top) + cropRect.height / 2
					const oldScale = this.scale.value
					const scaleRatio = newScale / oldScale

					this.imageX.value = cropCenterX - (cropCenterX - this.imageX.value) * scaleRatio
					this.imageY.value = cropCenterY - (cropCenterY - this.imageY.value) * scaleRatio
				}

				this.scale.value = newScale
				this.constrainImagePosition()
				this.drawCropCanvas()
			} else if (e.touches.length === 1 && this.isDragging.value && !this.isPinching.value) {
				e.preventDefault()
				const touch = e.touches[0]
				const deltaX = touch.clientX - this.dragStartX.value
				const deltaY = touch.clientY - this.dragStartY.value
				this.imageX.value = this.dragStartImageX.value + deltaX
				this.imageY.value = this.dragStartImageY.value + deltaY
				this.constrainImagePosition()
				this.drawCropCanvas()
			}
		}

		this.touchEndHandler.value = e => {
			if (e.touches.length === 0) {
				if (this.isDragging.value) {
					this.isDragging.value = false
				}
				if (this.isPinching.value) {
					this.isPinching.value = false
				}
			} else if (e.touches.length === 1) {
				if (this.isPinching.value) {
					this.isPinching.value = false
					this.isDragging.value = true
					const touch = e.touches[0]
					this.dragStartX.value = touch.clientX
					this.dragStartY.value = touch.clientY
					this.dragStartImageX.value = this.imageX.value
					this.dragStartImageY.value = this.imageY.value
				}
			}
		}

		canvas.addEventListener('touchstart', this.touchStartHandler.value, { passive: false })
		document.addEventListener('touchmove', this.touchMoveHandler.value, { passive: false })
		document.addEventListener('touchend', this.touchEndHandler.value)
	}

	/**
	 * 初始化裁剪画布和相关设置
	 * @method initCrop
	 * @description 设置裁剪功能所需的画布尺寸、图片位置和缩放
	 * @returns {void}
	 */
	public initCrop() {
		if (!this.cropCanvasRef.value || !this.cropImage.value || !this.cropWrapperRef.value) {
			return
		}

		const canvas = this.cropCanvasRef.value
		const wrapper = this.cropWrapperRef.value
		const img = this.cropImage.value

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
			this.scale.value = wrapperWidth / img.width * 0.8
		} else {
			this.scale.value = wrapperHeight / img.height * 0.8
		}

		this.imageX.value = (wrapperWidth - img.width * this.scale.value) / 2
		this.imageY.value = (wrapperHeight - img.height * this.scale.value) / 2

		const cropSize = Math.min(wrapperWidth * 0.6, wrapperHeight * 0.6, 300)
		const cropBox = this.cropBoxRef.value

		if (cropBox) {
			cropBox.style.width = `${cropSize}px`
			cropBox.style.left = `${(wrapperWidth - cropSize) / 2}px`
			cropBox.style.top = `${(wrapperHeight - cropSize) / 2}px`

			const imgMinSide = Math.min(img.width, img.height)
			this.minScale.value = cropSize / imgMinSide
		} else {
			this.minScale.value = 0.1
		}

		this.drawCropCanvas()
		this.setupCropEvents()
	}

	/**
	 * 显示裁剪对话框并加载选中的图片
	 * @method showCropDialog
	 * @description 读取用户选择的图片文件，打开裁剪弹窗
	 * @param {File} file - 用户选择的图片文件
	 * @returns {Promise<void>}
	 */
	public showCropDialog = (file: File) => {
		return new Promise((resolve: (value: void) => void, reject: (reason?: Error) => void) => {
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
						this.cropImage.value = img
						this.cropDialogVisible.value = true

						nextTick(() => {
							setTimeout(() => {
								this.initCrop()
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
	}

	/**
	 * 放大图片
	 * @method zoomIn
	 * @description 增加图片缩放比例
	 * @returns {void}
	 */
	public zoomIn() {
		const oldScale = this.scale.value
		const newScale = Math.min(5, this.scale.value + 0.01)

		if (newScale === oldScale) {
			return
		}

		if (this.cropBoxRef.value && this.cropCanvasRef.value) {
			const cropBox = this.cropBoxRef.value
			const canvasDom = this.cropCanvasRef.value
			const cropRect = cropBox.getBoundingClientRect()
			const canvasRect = canvasDom.getBoundingClientRect()

			const cropCenterX = (cropRect.left - canvasRect.left) + cropRect.width / 2
			const cropCenterY = (cropRect.top - canvasRect.top) + cropRect.height / 2
			const scaleRatio = newScale / oldScale

			this.imageX.value = cropCenterX - (cropCenterX - this.imageX.value) * scaleRatio
			this.imageY.value = cropCenterY - (cropCenterY - this.imageY.value) * scaleRatio
		}

		this.scale.value = newScale
		this.constrainImagePosition()
		this.drawCropCanvas()
	}

	/**
	 * 缩小图片
	 * @method zoomOut
	 * @description 减少图片缩放比例
	 * @returns {void}
	 */
	public zoomOut() {
		const oldScale = this.scale.value
		const newScale = Math.max(this.minScale.value, this.scale.value - 0.01)

		if (newScale === oldScale) {
			return
		}

		if (this.cropBoxRef.value && this.cropCanvasRef.value) {
			const cropBox = this.cropBoxRef.value
			const canvasDom = this.cropCanvasRef.value
			const cropRect = cropBox.getBoundingClientRect()
			const canvasRect = canvasDom.getBoundingClientRect()

			const cropCenterX = (cropRect.left - canvasRect.left) + cropRect.width / 2
			const cropCenterY = (cropRect.top - canvasRect.top) + cropRect.height / 2
			const scaleRatio = newScale / oldScale

			this.imageX.value = cropCenterX - (cropCenterX - this.imageX.value) * scaleRatio
			this.imageY.value = cropCenterY - (cropCenterY - this.imageY.value) * scaleRatio
		}

		this.scale.value = newScale
		this.constrainImagePosition()
		this.drawCropCanvas()
	}

	/**
	 * 重置裁剪区域
	 * @method resetCrop
	 * @description 将裁剪区域重置为初始状态
	 * @returns {void}
	 */
	public resetCrop() {
		if (this.cropImage.value && this.cropWrapperRef.value) {
			this.initCrop()
		}
	}

	/**
	 * 关闭裁剪对话框并清理数据
	 * @method closeCropDialog
	 * @description 关闭对话框，先执行淡出动画再清理数据
	 * @returns {void}
	 */
	public closeCropDialog() {
		const dialogWrapper = document.querySelector('.profile-page-upload-avatar-mobile-form-dialog-overlay')
		if (dialogWrapper) {
			dialogWrapper.style.opacity = '0'
		}

		this.cropImage.value = null
		this.cropDialogVisible.value = false

		setTimeout(() => {
			this.originalImageFile.value = null
			this.scale.value = 1
			this.imageX.value = 0
			this.imageY.value = 0
			this.isDragging.value = false
		}, 0)
	}

	/**
	 * 取消裁剪
	 * @method cancelCrop
	 * @description 关闭裁剪对话框并清理裁剪数据
	 * @returns {void}
	 */
	public cancelCrop() {
		this.closeCropDialog()
	}

	/**
	 * 执行裁剪操作
	 * @method performCrop
	 * @description 执行裁剪操作，生成裁剪后的图片数据
	 * @param {HTMLCanvasElement} canvas - 裁剪画布
	 * @param {HTMLElement} cropBox - 裁剪框元素
	 * @param {HTMLImageElement} img - 要裁剪的图片
	 * @returns {Object} 裁剪后的Canvas对象和裁剪信息
	 */
	public performCrop(canvas: HTMLCanvasElement, cropBox: HTMLElement, img: HTMLImageElement) {
		const canvasRect = canvas.getBoundingClientRect()
		const cropRect = cropBox.getBoundingClientRect()
		const cropX = cropRect.left - canvasRect.left
		const cropY = cropRect.top - canvasRect.top
		const cropSize = cropRect.width

		const sourceX = (cropX - this.imageX.value) / this.scale.value
		const sourceY = (cropY - this.imageY.value) / this.scale.value
		const sourceSize = cropSize / this.scale.value

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
			originalFile: this.originalImageFile.value
		}
	}

	/**
	 * 重置裁剪状态
	 * @method resetCropState
	 * @description 重置所有裁剪相关的状态值
	 * @returns {void}
	 */
	public resetCropState() {
		this.scale.value = 1
		this.minScale.value = 0.1
		this.imageX.value = 0
		this.imageY.value = 0
		this.isDragging.value = false
		this.dragStartX.value = 0
		this.dragStartY.value = 0
		this.dragStartImageX.value = 0
		this.dragStartImageY.value = 0
		this.originalImageFile.value = null
		this.cropImage.value = null
	}
}
