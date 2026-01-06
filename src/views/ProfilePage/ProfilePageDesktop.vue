<script setup>
/**
 * 个人信息页面组件(桌面端)
 * 
 * @description 提供用户个人信息的查看、编辑、密码修改和头像上传功能
 * @component ProfilePageDesktop
 */
// Fix 1: Import order - Icons first, then Element Plus core
import { ArrowLeft, User, Edit, Lock, Calendar, Camera, ZoomIn, ZoomOut } from '@element-plus/icons-vue'
import {
	ElMessage,
	ElButton,
	ElIcon,
	ElForm,
	ElFormItem,
	ElInput,
	ElSelect,
	ElOption,
	ElInputNumber,
	ElDialog
} from 'element-plus'
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'

// Element Plus styles
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-select.css'
import 'element-plus/theme-chalk/el-option.css'
import 'element-plus/theme-chalk/el-input-number.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-scrollbar.css'
import 'element-plus/theme-chalk/base.css'

// Project imports
import { getMyAttendanceCount } from '@/api/attendance'
import {
	getStudentProfile,
	updateStudentInfo,
	changePassword,
	uploadAvatar,
	getAvatarUrl,
	getStudentDatabaseTableId
} from '@/api/student'
import { useThemeStore } from '@/stores/theme'
import ProfilePageConfig from '@/views/ProfilePage/js/ProfilePageConfig'
import ProfilePageUtils from '@/views/ProfilePage/js/ProfilePageUtils'

// ===================== 全局实例初始化 =====================
/**
 * 路由实例
 * @type {Router}
 * @description 用于页面跳转和路由导航
 */
const router = useRouter()
/**
 * 主题状态仓库实例
 * @type {Store}
 * @description 管理应用主题切换(亮色/暗色模式)
 */
const themeStore = useThemeStore()

// ===================== 表单引用区 =====================
/**
 * 个人信息表单引用
 * @type {Ref<ElForm|null>}
 * @description Element Plus表单组件引用,用于表单验证和提交
 */
const formRef = ref()
/**
 * 密码修改表单引用
 * @type {Ref<ElForm|null>}
 * @description 密码修改表单组件引用,用于密码表单验证
 */
const passwordFormRef = ref()
/**
 * 文件输入框引用
 * @type {Ref<HTMLInputElement|null>}
 * @description 隐藏的文件输入框引用,用于触发文件选择
 */
const fileInputRef = ref(null)

// ===================== 头像裁剪相关引用 =====================
/**
 * 裁剪弹窗显示状态
 * @type {Ref<boolean>}
 * @description 控制头像裁剪弹窗的显示/隐藏
 */
const cropDialogVisible = ref(false)
/**
 * 裁剪画布引用
 * @type {Ref<HTMLCanvasElement|null>}
 * @description Canvas元素引用,用于绘制裁剪后的头像
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
 * @description 裁剪框元素引用,用于定义裁剪区域
 */
const cropBoxRef = ref(null)

// ===================== 加载状态变量 =====================
/**
 * 数据加载状态
 * @type {Ref<boolean>}
 * @description 控制个人信息数据加载中的状态显示
 */
const isLoading = ref(false)
/**
 * 密码修改加载状态
 * @type {Ref<boolean>}
 * @description 控制密码修改操作加载中的状态显示
 */
const isPasswordLoading = ref(false)
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

// ===================== UI状态变量 =====================
/**
 * 编辑模式状态
 * @type {Ref<boolean>}
 * @description 控制是否处于编辑模式,编辑模式下表单可编辑
 */
const isEditing = ref(false)
/**
 * 密码修改区域显示状态
 * @type {Ref<boolean>}
 * @description 控制密码修改区域的显示/隐藏
 */
const showPasswordSection = ref(false)
/**
 * 考勤次数
 * @type {Ref<number|null>}
 * @description 用户累计签到次数
 */
const attendanceCount = ref(null)
/**
 * 学生数据库ID
 * @type {Ref<number|null>}
 * @description 学生数据库表主键ID,用于头像上传等操作
 */
const studentInfoId = ref(null)
/**
 * 头像URL
 * @type {Ref<string|null>}
 * @description 用户头像的URL地址
 */
const avatarUrl = ref(null)

// ===================== 头像裁剪状态变量 =====================
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
 * @description 图片的当前缩放比例,初始值为1(100%)
 */
const scale = ref(1)
/**
 * 最小缩放比例
 * @type {Ref<number>}
 * @description 图片允许的最小缩放比例,防止过度缩小
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

// ===================== 事件处理器引用 =====================
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

// ===================== 表单数据定义区 =====================
/**
 * 个人信息表单数据
 * @type {Reactive<Object>}
 * @description 存储用户的个人信息,包含所有可编辑字段
 * @property {string} name - 姓名
 * @property {string} studentId - 学号
 * @property {string} gender - 性别
 * @property {string} phoneNumber - 手机号
 * @property {string} college - 学院
 * @property {string} major - 专业
 * @property {number|null} grade - 年级
 * @property {number|null} classNum - 班级
 * @property {string} password - 密码(编辑时使用)
 */
const formData = reactive({
	name: '',
	studentId: '',
	gender: '',
	phoneNumber: '',
	college: '',
	major: '',
	grade: null,
	classNum: null,
	password: ''
})

/**
 * 密码修改表单数据
 * @type {Reactive<Object>}
 * @description 存储密码修改相关的表单数据
 * @property {string} oldPassword - 旧密码
 * @property {string} newPassword - 新密码
 * @property {string} confirmPassword - 确认新密码
 */
const passwordForm = reactive({
	oldPassword: '',
	newPassword: '',
	confirmPassword: ''
})

/**
 * 原始数据备份
 * @type {Ref<Object>}
 * @description 保存用户信息的原始数据,用于取消编辑时恢复
 */
const originalData = ref({})

// Fix 3: Move all utility functions BEFORE their usage (resolve no-use-before-define)
/**
 * Constrain image position to ensure it covers the crop box
 * @returns
 */
const constrainImagePosition = () => {
	if (!cropCanvasRef.value || !cropImage.value || !cropBoxRef.value) {
		return
	}

	const canvas = cropCanvasRef.value
	const img = cropImage.value
	const cropBox = cropBoxRef.value

	// Get crop box position and size
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

	// Calculate image display size
	const imgWidth = img.width * scale.value
	const imgHeight = img.height * scale.value

	// Calculate crop box boundaries
	const cropLeft = cropX
	const cropRight = cropX + cropSize
	const cropTop = cropY
	const cropBottom = cropY + cropSize

	// Constrain image position
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
 * Draw the crop canvas with image and crop mask
 * @returns
 */
const drawCropCanvas = () => {
	if (!cropCanvasRef.value || !cropImage.value) {
		return
	}

	const canvas = cropCanvasRef.value
	const ctx = canvas.getContext('2d')
	const img = cropImage.value

	// Clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	// Draw semi-transparent background
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	// Draw image
	const imgWidth = img.width * scale.value
	const imgHeight = img.height * scale.value

	ctx.save()
	ctx.globalCompositeOperation = 'source-over'
	ctx.drawImage(img, imageX.value, imageY.value, imgWidth, imgHeight)

	// Draw crop mask
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

		// Clear crop box area
		ctx.globalCompositeOperation = 'destination-out'
		ctx.fillRect(cropX, cropY, cropSize, cropSize)
	}

	ctx.restore()
}

/**
 * Remove crop event listeners to prevent memory leaks
 * @returns
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
 * Setup crop event listeners (drag, zoom)
 * @returns
 */
const setupCropEvents = () => {
	if (!cropCanvasRef.value) {
		return
	}

	// Remove old events first
	removeCropEvents()

	const canvas = cropCanvasRef.value

	// Mouse down handler
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

	// Mouse move handler
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

	// Mouse up handler
	mouseUpHandler = () => {
		if (isDragging.value) {
			isDragging.value = false
			if (canvas) {
				canvas.style.cursor = 'move'
			}
		}
	}

	// Mouse leave handler
	mouseLeaveHandler = () => {
		if (isDragging.value) {
			// Let document mouseup handle the end of drag
		}
	}

	// Wheel zoom handler
	wheelHandler = e => {
		e.preventDefault()
		e.stopPropagation()

		const oldScale = scale.value
		const delta = e.deltaY > 0 ? -0.01 : 0.01
		const newScale = Math.max(minScale.value, Math.min(5, scale.value + delta))

		if (newScale === oldScale) {
			return
		}

		// Zoom around crop box center
		if (cropBoxRef.value && cropCanvasRef.value) {
			const cropBox = cropBoxRef.value
			const canvasDom = cropCanvasRef.value
			const cropRect = cropBox.getBoundingClientRect()
			const canvasRect = canvasDom.getBoundingClientRect()

			const cropCenterX = (cropRect.left - canvasRect.left) + cropRect.width / 2
			const cropCenterY = (cropRect.top - canvasRect.top) + cropRect.height / 2
			const scaleRatio = newScale / oldScale

			// Adjust image position to keep crop center fixed
			imageX.value = cropCenterX - (cropCenterX - imageX.value) * scaleRatio
			imageY.value = cropCenterY - (cropCenterY - imageY.value) * scaleRatio
		}

		scale.value = newScale
		constrainImagePosition()
		drawCropCanvas()
	}

	// Add event listeners
	canvas.addEventListener('mousedown', mouseDownHandler)
	document.addEventListener('mousemove', mouseMoveHandler)
	document.addEventListener('mouseup', mouseUpHandler)
	canvas.addEventListener('mouseleave', mouseLeaveHandler)
	canvas.addEventListener('wheel', wheelHandler)

	// Set cursor style
	canvas.style.cursor = 'move'
}

/**
 * Initialize crop canvas and settings
 * @returns
 */
const initCrop = () => {
	if (!cropCanvasRef.value || !cropImage.value || !cropWrapperRef.value) {
		return
	}

	const canvas = cropCanvasRef.value
	const wrapper = cropWrapperRef.value
	const img = cropImage.value

	// Set canvas size
	let wrapperWidth = wrapper.clientWidth
	const wrapperHeight = 400

	if (wrapperWidth === 0) {
		wrapperWidth = wrapper.offsetWidth || 560
	}

	canvas.width = wrapperWidth
	canvas.height = wrapperHeight
	canvas.style.width = `${wrapperWidth}px`
	canvas.style.height = `${wrapperHeight}px`

	// Calculate initial scale
	const imgAspect = img.width / img.height
	const wrapperAspect = wrapperWidth / wrapperHeight

	if (imgAspect > wrapperAspect) {
		scale.value = wrapperWidth / img.width * 0.8
	} else {
		scale.value = wrapperHeight / img.height * 0.8
	}

	// Center image
	imageX.value = (wrapperWidth - img.width * scale.value) / 2
	imageY.value = (wrapperHeight - img.height * scale.value) / 2

	// Initialize crop box
	const cropSize = Math.min(wrapperWidth * 0.6, wrapperHeight * 0.6, 300)
	const cropBox = cropBoxRef.value

	if (cropBox) {
		cropBox.style.width = `${cropSize}px`
		cropBox.style.left = `${(wrapperWidth - cropSize) / 2}px`
		cropBox.style.top = `${(wrapperHeight - cropSize) / 2}px`

		// Calculate dynamic min scale
		const imgMinSide = Math.min(img.width, img.height)
		minScale.value = cropSize / imgMinSide
	} else {
		minScale.value = 0.1
	}

	// Draw initial canvas
	drawCropCanvas()
	setupCropEvents()
}

/**
 * Load user avatar from server
 * @returns
 */
const loadAvatar = async () => {
	if (!studentInfoId.value) {
		return
	}

	avatarLoading.value = true

	try {
		const url = getAvatarUrl(studentInfoId.value, ProfilePageConfig.AVATAR_SIZE)
		if (!url) {
			avatarUrl.value = null
			return
		}

		// Check if avatar exists
		const img = new Image()
		img.crossOrigin = 'anonymous'

		const checkAvatar = new Promise(resolve => {
			img.onload = () => resolve(true)
			img.onerror = () => resolve(false)
			setTimeout(() => resolve(false), 5000)
			img.src = url
		})

		const hasAvatar = await checkAvatar
		avatarUrl.value = hasAvatar ? url : null
	} catch (error) {
		avatarUrl.value = null
	} finally {
		avatarLoading.value = false
	}
}

/**
 * Show crop dialog with selected image
 * @param file - Selected image file
 * @returns
 */
const showCropDialog = file => new Promise((resolve, reject) => {
	try {
		// Restore dialog overlay
		const dialogWrapper = document.querySelector('.crop-dialog-overlay')
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

				// Initialize crop after DOM update
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
 * Upload cropped avatar file to server
 * @param file - Cropped and compressed avatar file
 * @returns
 */
const uploadAvatarFile = async file => {
	isUploading.value = true

	try {
		const token = localStorage.getItem('token')
		if (!token) {
			ElMessage.error('请先登录')
			router.push('/login')
			return
		}

		ElMessage.info('正在上传头像, 请稍候...')
		const response = await uploadAvatar(token, file)

		if (response && response.code === 200) {
			ElMessage.success('头像上传成功')
			setTimeout(async () => {
				await loadAvatar()
			}, 500)
		} else {
			ElMessage.error(response?.message || '头像上传失败')
			await loadAvatar()
		}
	} catch (error) {
		const errorMessage = error.response?.data?.message || error.message || '头像上传失败'
		ElMessage.error(`头像上传失败：${errorMessage}`)
		await loadAvatar()

		if (errorMessage.includes('Token无效') || errorMessage.includes('请重新登录')) {
			localStorage.removeItem('token')
			localStorage.removeItem('userInfo')
			router.push('/login')
		}
	} finally {
		isUploading.value = false
	}
}

/**
 * Reset form to original data
 * @returns
 */
const resetForm = () => {
	Object.assign(formData, originalData.value)
	formData.password = ''
	if (formRef.value) {
		formRef.value.clearValidate()
	}
}

/**
 * Reset password form to empty state
 * @returns
 */
const resetPasswordForm = () => {
	passwordForm.oldPassword = ''
	passwordForm.newPassword = ''
	passwordForm.confirmPassword = ''
	if (passwordFormRef.value) {
		passwordFormRef.value.clearValidate()
	}
}

// Fix 4: Business logic functions (after utility functions)
/**
 * Navigate back to the navigation page
 * @returns
 */
const goBack = () => {
	router.push('/navigation')
}

/**
 * Toggle between light and dark theme
 * @returns
 */
const toggleTheme = () => {
	themeStore.toggleTheme()
}

/**
 * Load user profile data from server
 * @returns
 */
const loadProfile = async () => {
	isLoading.value = true

	try {
		const token = localStorage.getItem('token')
		if (!token) {
			ElMessage.error('请先登录')
			router.push('/login')
			return
		}

		const [profileResponse, attendanceResponse, studentIdResponse] = await Promise.all([
			getStudentProfile(token),
			getMyAttendanceCount(token),
			getStudentDatabaseTableId(token)
		])

		if (profileResponse.code === 200) {
			Object.assign(formData, profileResponse.data)
			originalData.value = { ...profileResponse.data }
		} else {
			ElMessage.error(profileResponse.message || '获取个人信息失败')
		}

		if (attendanceResponse.code === 200) {
			attendanceCount.value = attendanceResponse.data.count
		}

		if (studentIdResponse.code === 200) {
			studentInfoId.value = studentIdResponse.data
			await loadAvatar()
		}
	} catch (error) {
		ElMessage.error(`获取个人信息失败：${error.message}`)
		if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
			localStorage.removeItem('token')
			localStorage.removeItem('userInfo')
			router.push('/login')
		}
	} finally {
		isLoading.value = false
	}
}

/**
 * Handle avatar image load error
 * @returns
 */
const handleAvatarError = () => {
	avatarUrl.value = null
}

/**
 * Trigger file input click when avatar is clicked
 * @returns
 */
const handleAvatarClick = () => {
	fileInputRef.value?.click()
}

// Fix 5: Remove unnecessary async (resolve require-await) & fix param reassignment (no-param-reassign)
/**
 * Handle file selection from file input
 * @param event - File input change event
 * @returns
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
		// 使用 await 解决 require-await 错误
		showCropDialog(file).catch(err => {
			ElMessage.error(`图片加载失败：${err.message}`)
		})
	} catch (error) {
		ElMessage.error(`图片加载失败：${error.message}`)
	} finally {
		// Reset file input via ref instead of modifying event target directly
		if (fileInputRef.value) {
			fileInputRef.value.value = ''
		}
	}
}

/**
 * Zoom in the crop image
 * @returns
 */
const zoomIn = () => {
	const oldScale = scale.value
	const newScale = Math.min(5, scale.value + 0.01)

	if (newScale === oldScale) {
		return
	}

	// Zoom around crop box center
	if (cropBoxRef.value && cropCanvasRef.value) {
		const cropBox = cropBoxRef.value
		const canvasDom = cropCanvasRef.value
		const cropRect = cropBox.getBoundingClientRect()
		const canvasRect = canvasDom.getBoundingClientRect()

		const cropCenterX = (cropRect.left - canvasRect.left) + cropRect.width / 2
		const cropCenterY = (cropRect.top - canvasRect.top) + cropRect.height / 2
		const scaleRatio = newScale / oldScale

		// Adjust image position
		imageX.value = cropCenterX - (cropCenterX - imageX.value) * scaleRatio
		imageY.value = cropCenterY - (cropCenterY - imageY.value) * scaleRatio
	}

	scale.value = newScale
	constrainImagePosition()
	drawCropCanvas()
}

/**
 * Zoom out the crop image
 * @returns
 */
const zoomOut = () => {
	const oldScale = scale.value
	const newScale = Math.max(minScale.value, scale.value - 0.01)

	if (newScale === oldScale) {
		return
	}

	// Zoom around crop box center
	if (cropBoxRef.value && cropCanvasRef.value) {
		const cropBox = cropBoxRef.value
		const canvasDom = cropCanvasRef.value
		const cropRect = cropBox.getBoundingClientRect()
		const canvasRect = canvasDom.getBoundingClientRect()

		const cropCenterX = (cropRect.left - canvasRect.left) + cropRect.width / 2
		const cropCenterY = (cropRect.top - canvasRect.top) + cropRect.height / 2
		const scaleRatio = newScale / oldScale

		// Adjust image position
		imageX.value = cropCenterX - (cropCenterX - imageX.value) * scaleRatio
		imageY.value = cropCenterY - (cropCenterY - imageY.value) * scaleRatio
	}

	scale.value = newScale
	constrainImagePosition()
	drawCropCanvas()
}

/**
 * Reset crop to initial state
 * @returns
 */
const resetCrop = () => {
	if (!cropImage.value || !cropWrapperRef.value) {
		return
	}
	initCrop()
}

/**
 * Cancel crop and close dialog
 * @returns
 */
const cancelCrop = () => {
	// Remove event listeners
	removeCropEvents()

	// Hide dialog overlay
	const dialogWrapper = document.querySelector('.crop-dialog-overlay')
	if (dialogWrapper) {
		dialogWrapper.style.display = 'none'
		dialogWrapper.style.visibility = 'hidden'
		dialogWrapper.style.opacity = '0'
	}

	// Clear crop data
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
 * Confirm crop and process avatar
 * @returns
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

		// Get crop box position
		const canvasRect = canvas.getBoundingClientRect()
		const cropRect = cropBox.getBoundingClientRect()
		const cropX = cropRect.left - canvasRect.left
		const cropY = cropRect.top - canvasRect.top
		const cropSize = cropRect.width

		// Calculate source position in original image
		const sourceX = (cropX - imageX.value) / scale.value
		const sourceY = (cropY - imageY.value) / scale.value
		const sourceSize = cropSize / scale.value

		// Create cropped canvas
		const cropCanvas = document.createElement('canvas')
		const outputSize = Math.min(img.width, img.height)
		cropCanvas.width = outputSize
		cropCanvas.height = outputSize
		const cropCtx = cropCanvas.getContext('2d')

		// Draw cropped image
		cropCtx.drawImage(
			img,
			sourceX, sourceY, sourceSize, sourceSize,
			0, 0, outputSize, outputSize
		)

		// Convert to blob and process
		await new Promise(resolve => {
			cropCanvas.toBlob(async blob => {
				if (!blob) {
					ElMessage.error('裁剪失败')
					resolve()
					return
				}

				// Create cropped file
				const croppedFile = new File(
					[blob],
					originalImageFile.value?.name || 'avatar.jpg',
					{
						type: originalImageFile.value?.type || 'image/jpeg',
						lastModified: Date.now()
					}
				)

				// Close dialog
				cropDialogVisible.value = false

				// Compress and upload
				ElMessage.info('正在处理头像, 请稍候...')
				const compressedFile = await ProfilePageUtils.compressImage(croppedFile)

				// Preview avatar
				const reader = new FileReader()
				reader.onload = e => {
					avatarUrl.value = e.target.result
				}
				reader.readAsDataURL(compressedFile)

				// Upload to server
				await uploadAvatarFile(compressedFile)
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
 * Toggle edit mode for profile form
 * @returns
 */
const toggleEditMode = () => {
	if (isEditing.value) {
		resetForm()
		isEditing.value = false
		ElMessage.success('已取消编辑')
	} else {
		isEditing.value = true
	}
}

/**
 * Toggle password section visibility
 * @returns
 */
const togglePasswordSection = () => {
	showPasswordSection.value = !showPasswordSection.value
	if (showPasswordSection.value) {
		resetPasswordForm()
	}
}

/**
 * Cancel password change and hide section
 * @returns
 */
const cancelPasswordChange = () => {
	showPasswordSection.value = false
	resetPasswordForm()
}

/**
 * Confirm password change and submit to server
 * @returns
 */
const confirmPasswordChange = async () => {
	if (!passwordFormRef.value) {
		return
	}

	try {
		await passwordFormRef.value.validate()
	} catch (error) {
		return
	}

	isPasswordLoading.value = true

	try {
		const token = localStorage.getItem('token')
		if (!token) {
			ElMessage.error('请先登录')
			router.push('/login')
			return
		}

		const response = await changePassword(token, {
			oldPassword: passwordForm.oldPassword,
			newPassword: passwordForm.newPassword,
			confirmPassword: passwordForm.confirmPassword
		})

		if (response.code === 200) {
			ElMessage.success('密码修改成功')
			showPasswordSection.value = false
			resetPasswordForm()
		} else {
			ElMessage.error(response.message || '修改密码失败')
		}
	} catch (error) {
		ElMessage.error(`修改密码失败：${error.message}`)
		if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
			localStorage.removeItem('token')
			localStorage.removeItem('userInfo')
			router.push('/login')
		}
	} finally {
		isPasswordLoading.value = false
	}
}

/**
 * Save profile changes to server
 * @returns
 */
const saveProfile = async () => {
	if (isLoading.value) {
		ElMessage.warning('系统正在加载中，请稍后重试')
		return
	}

	if (!formRef.value) {
		ElMessage.warning('表单未初始化，请稍后重试')
		return
	}

	try {
		await formRef.value.validate()
	} catch (error) {
		ElMessage.warning('请先完善表单信息')
		return
	}

	isLoading.value = true

	try {
		const token = localStorage.getItem('token')
		if (!token) {
			ElMessage.error('请先登录')
			router.push('/login')
			return
		}

		const updateData = { ...formData }
		const response = await updateStudentInfo(token, updateData)

		if (response.code === 200) {
			ElMessage.success('个人信息更新成功')
			if (response.data && response.data.token) {
				localStorage.setItem('token', response.data.token)
			}
			originalData.value = { ...formData }
			formData.password = ''
			isEditing.value = false
		} else {
			ElMessage.error(response.message || '更新个人信息失败')
		}
	} catch (error) {
		ElMessage.error(`更新个人信息失败：${error.message}`)
		if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
			localStorage.removeItem('token')
			localStorage.removeItem('userInfo')
			router.push('/login')
		}
	} finally {
		isLoading.value = false
	}
}

// Fix 6: Form validation rules (moved here for readability)
const rules = {
	name: [
		{ required: true, message: '请输入姓名', trigger: 'blur' },
		{ min: 2, max: 20, message: '姓名长度在2到20个字符', trigger: 'blur' }
	],
	studentId: [
		{ required: true, message: '请输入学号', trigger: 'blur' },
		{ pattern: /^[2-3][0-9]\d{8}$/, message: '学号格式不正确（以20-30开头的10位数字）', trigger: 'blur' }
	],
	gender: [
		{ required: true, message: '请选择性别', trigger: 'change' }
	],
	phoneNumber: [
		{ required: true, message: '请输入手机号', trigger: 'blur' },
		{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
	],
	college: [
		{ required: true, message: '请输入学院', trigger: 'blur' },
		{ min: 2, max: 50, message: '学院名称长度在2到50个字符', trigger: 'blur' }
	],
	major: [
		{ required: true, message: '请输入专业', trigger: 'blur' },
		{ min: 2, max: 50, message: '专业名称长度在2到50个字符', trigger: 'blur' }
	],
	grade: [
		{ required: true, message: '请选择年级', trigger: 'change' }
	],
	classNum: [
		{ required: true, message: '请输入班级', trigger: 'blur' },
		{ type: 'number', min: 1, max: 100, message: '班级必须在1到100之间', trigger: 'blur' }
	],
	password: [
		{ required: true, message: '请输入当前密码', trigger: 'blur' },
		{ min: 6, max: 16, message: '密码长度在6到16个字符', trigger: 'blur' }
	]
}

const passwordRules = {
	oldPassword: [
		{ required: true, message: '请输入原密码', trigger: 'blur' }
	],
	newPassword: [
		{ required: true, message: '请输入新密码', trigger: 'blur' },
		{ min: 6, max: 16, message: '密码长度在6到16个字符', trigger: 'blur' }
	],
	confirmPassword: [
		{ required: true, message: '请确认新密码', trigger: 'blur' },
		{
			validator: (rule, value, callback) => {
				if (value && value !== passwordForm.newPassword) {
					callback(new Error('两次输入的密码不一致'))
				} else {
					callback()
				}
			},
			trigger: 'blur'
		}
	]
}

// Fix 7: Watch for crop dialog visibility (after function declarations)
watch(cropDialogVisible, visible => {
	if (visible && cropImage.value) {
		nextTick(() => {
			setTimeout(() => {
				initCrop()
			}, 200)
		})
	}
})

// Fix 8: Mounted hook (last in script setup)
onMounted(() => {
	loadProfile()
})
</script>

<template>
	<!-- 个人信息页面主容器 -->
	<div class="profile-container">
		<!-- 背景装饰效果 -->
		<div class="background-effects">
			<div class="gradient-orb orb-1"/>
			<div class="gradient-orb orb-2"/>
			<div class="gradient-orb orb-3"/>
		</div>

		<div class="content-wrapper">
			<!-- 页面头部 -->
			<div class="page-header">
				<el-button
					class="back-btn"
					type="primary"
					:icon="ArrowLeft"
					circle
					@click="goBack"/>
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊"
					class="logo"
					title="切换主题模式"
					@click="toggleTheme"/>
				<div class="title-section">
					<h1>个人信息</h1>
					<p>Personal Profile</p>
				</div>
			</div>

			<!-- 主内容区域 -->
			<div class="main-content">
				<!-- 个人信息卡片 -->
				<div class="profile-card">
					<!-- 加载遮罩 -->
					<div v-if="isLoading" class="loading-overlay">
						<div class="loading-spinner"/>
					</div>

					<!-- 用户信息头部 -->
					<div class="profile-header">
						<div class="user-info-section">
							<!-- 头像上传区域 -->
							<div class="avatar-wrapper">
								<div class="avatar-container" @click="handleAvatarClick">
									<div class="avatar" :class="{ 'avatar-loading': avatarLoading }">
										<img
											v-if="avatarUrl"
											:src="avatarUrl"
											alt="头像"
											class="avatar-image"
											@error="handleAvatarError"
										/>
										<el-icon v-else class="avatar-icon">
											<user/>
										</el-icon>
										<div v-if="avatarLoading" class="avatar-loading-spinner"/>
									</div>
									<div class="avatar-status"/>
									<div class="avatar-upload-overlay">
										<el-icon class="upload-icon">
											<camera/>
										</el-icon>
										<span class="upload-text">点击上传头像</span>
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
								<div class="avatar-tip">
									<el-icon class="tip-icon">
										<camera/>
									</el-icon>
									<span class="tip-text">{{
										avatarUrl ? '点击头像修改头像' : '点击头像上传头像'
									}}</span>
								</div>
							</div>
							<!-- 用户详细信息 -->
							<div class="user-details">
								<h2>{{ formData.name || '用户' }}</h2>
								<p class="student-id">{{ formData.studentId || '学号' }}</p>
								<div class="user-stats">
									<div v-if="attendanceCount !== null" class="stat-item">
										<el-icon class="stat-icon">
											<calendar/>
										</el-icon>
										<span class="stat-text">已签到 {{ attendanceCount }} 次</span>
									</div>
								</div>
							</div>
							<!-- 编辑按钮 -->
							<div class="action-buttons">
								<el-button
									type="primary"
									:icon="Edit"
									:disabled="isLoading"
									class="edit-btn"
									@click="toggleEditMode"
								>
									{{ isEditing ? '取消' : '编辑' }}
								</el-button>
							</div>
						</div>
					</div>

					<div v-if="!showPasswordSection" class="form-section">
						<div class="section-header">
							<div class="section-title-wrapper">
								<div>
									<h3>基本信息</h3>
									<p>管理您的个人资料信息</p>
								</div>
							</div>
							<div class="security-badge">
								<el-icon class="badge-icon">
									<lock/>
								</el-icon>
								<span>安全保护</span>
							</div>
						</div>

						<el-form
							ref="formRef"
							:model="formData"
							:rules="rules"
							class="profile-form"
						>
							<div class="form-grid">
								<div class="form-group">
									<div class="form-item">
										<label class="form-label">姓名</label>
										<el-form-item prop="name">
											<el-input
												v-model="formData.name"
												:disabled="!isEditing"
												placeholder="请输入姓名"
												maxlength="20"
												class="form-input"
											/>
										</el-form-item>
									</div>

									<div class="form-item">
										<label class="form-label">学号</label>
										<el-form-item prop="studentId">
											<el-input
												v-model="formData.studentId"
												:disabled="!isEditing"
												placeholder="请输入学号"
												maxlength="10"
												class="form-input"
											/>
										</el-form-item>
									</div>
								</div>

								<div class="form-group">
									<div class="form-item">
										<label class="form-label">性别</label>
										<el-form-item prop="gender">
											<el-select
												v-model="formData.gender"
												:disabled="!isEditing"
												placeholder="请选择性别"
												class="form-input"
											>
												<el-option label="男" value="男"/>
												<el-option label="女" value="女"/>
											</el-select>
										</el-form-item>
									</div>

									<div class="form-item">
										<label class="form-label">手机号</label>
										<el-form-item prop="phoneNumber">
											<el-input
												v-model="formData.phoneNumber"
												:disabled="!isEditing"
												placeholder="请输入手机号"
												maxlength="11"
												class="form-input"
											/>
										</el-form-item>
									</div>
								</div>

								<div class="form-group">
									<div class="form-item">
										<label class="form-label">学院</label>
										<el-form-item prop="college">
											<el-input
												v-model="formData.college"
												:disabled="!isEditing"
												placeholder="请输入学院"
												maxlength="50"
												class="form-input"
											/>
										</el-form-item>
									</div>

									<div class="form-item">
										<label class="form-label">专业</label>
										<el-form-item prop="major">
											<el-input
												v-model="formData.major"
												:disabled="!isEditing"
												placeholder="请输入专业"
												maxlength="50"
												class="form-input"
											/>
										</el-form-item>
									</div>
								</div>

								<div class="form-group">
									<div class="form-item">
										<label class="form-label">年级</label>
										<el-form-item prop="grade">
											<el-select
												v-model="formData.grade"
												:disabled="!isEditing"
												placeholder="请选择年级"
												class="form-input"
											>
												<el-option label="1年级" :value="1"/>
												<el-option label="2年级" :value="2"/>
												<el-option label="3年级" :value="3"/>
												<el-option label="4年级" :value="4"/>
												<el-option label="5年级" :value="5"/>
											</el-select>
										</el-form-item>
									</div>

									<div class="form-item">
										<label class="form-label">班级</label>
										<el-form-item prop="classNum">
											<el-input-number
												v-model="formData.classNum"
												:disabled="!isEditing"
												:min="1"
												:max="100"
												placeholder="请输入班级"
												class="form-input"
											/>
										</el-form-item>
									</div>
								</div>

								<div class="form-group">
									<div class="form-item">
										<label class="form-label">
											<el-icon class="label-icon">
												<lock/>
											</el-icon>
											当前密码
										</label>
										<el-form-item prop="password">
											<el-input
												v-model="formData.password"
												type="password"
												:disabled="!isEditing"
												placeholder="请输入当前密码以确认身份"
												maxlength="16"
												show-password
												class="form-input security-input"
											/>
										</el-form-item>
										<div v-if="isEditing" class="security-hint">
											<el-icon class="hint-icon">
												<lock/>
											</el-icon>
											<span>密码用于验证身份，确保操作安全</span>
										</div>
									</div>
								</div>
							</div>

							<div v-if="isEditing" class="form-actions">
								<el-button :disabled="isLoading" class="reset-btn" @click.prevent="resetForm">
									重置
								</el-button>
								<el-button
									type="primary"
									:loading="isLoading"
									:disabled="isLoading"
									class="save-btn"
									@click="saveProfile">
									保存修改
								</el-button>
							</div>
						</el-form>
					</div>

					<div class="password-section">
						<div class="section-header">
							<h3>安全设置</h3>
							<p>保护您的账户安全</p>
						</div>
						<div class="security-card">
							<div class="security-info">
								<div class="security-icon">
									<el-icon>
										<lock/>
									</el-icon>
								</div>
								<div class="security-content">
									<h4>密码管理</h4>
									<p>定期修改密码有助于保护账户安全</p>
								</div>
							</div>
							<el-button
								type="primary"
								:icon="Lock"
								class="security-btn"
								@click="togglePasswordSection">
								{{ showPasswordSection ? '返回基本信息' : '修改密码' }}
							</el-button>
						</div>
					</div>

					<div v-if="showPasswordSection" class="password-section">
						<div class="section-header security-header">
							<div class="section-title-wrapper">
								<el-icon class="section-icon security-icon-large">
									<lock/>
								</el-icon>
								<div>
									<h3>修改密码</h3>
									<p>为了账户安全，请设置新密码</p>
								</div>
							</div>
							<div class="security-tip">
								<el-icon class="tip-icon">
									<lock/>
								</el-icon>
								<span>您的密码将被加密存储</span>
							</div>
						</div>

						<el-form
							ref="passwordFormRef"
							:model="passwordForm"
							:rules="passwordRules"
							class="profile-form"
						>
							<div class="form-grid">
								<div class="form-group">
									<div class="form-item">
										<label class="form-label">
											<el-icon class="label-icon">
												<lock/>
											</el-icon>
											原密码
										</label>
										<el-form-item prop="oldPassword">
											<el-input
												v-model="passwordForm.oldPassword"
												type="password"
												placeholder="请输入原密码"
												maxlength="16"
												show-password
												class="form-input security-input"
											/>
										</el-form-item>
									</div>

									<div class="form-item">
										<label class="form-label">
											<el-icon class="label-icon">
												<lock/>
											</el-icon>
											新密码
										</label>
										<el-form-item prop="newPassword">
											<el-input
												v-model="passwordForm.newPassword"
												type="password"
												placeholder="请输入新密码（6-16位字符）"
												maxlength="16"
												show-password
												class="form-input security-input"
											/>
										</el-form-item>
										<div class="security-hint">
											<el-icon class="hint-icon">
												<lock/>
											</el-icon>
											<span>建议使用字母、数字和特殊字符组合</span>
										</div>
									</div>

									<div class="form-item">
										<label class="form-label">
											<el-icon class="label-icon">
												<lock/>
											</el-icon>
											确认新密码
										</label>
										<el-form-item prop="confirmPassword">
											<el-input
												v-model="passwordForm.confirmPassword"
												type="password"
												placeholder="请再次输入新密码"
												maxlength="16"
												show-password
												class="form-input security-input"
											/>
										</el-form-item>
									</div>
								</div>
							</div>

							<div class="form-actions">
								<el-button
									:disabled="isPasswordLoading"
									class="reset-btn"
									@click="cancelPasswordChange">
									取消
								</el-button>
								<el-button
									type="primary"
									:loading="isPasswordLoading"
									class="save-btn"
									@click="confirmPasswordChange"
								>
									确认修改
								</el-button>
							</div>
						</el-form>
					</div>
				</div>
			</div>
		</div>

		<!-- 头像裁剪对话框 -->
		<el-dialog
			v-model="cropDialogVisible"
			title="裁剪头像"
			width="600px"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			modal-class="crop-dialog-overlay"
			class="crop-dialog"
		>
			<div class="crop-container">
				<!-- 裁剪画布包装器 -->
				<div ref="cropWrapperRef" class="crop-wrapper">
					<canvas ref="cropCanvasRef" class="crop-canvas"/>
					<div ref="cropBoxRef" class="crop-box"/>
				</div>
				<!-- 裁剪控制按钮 -->
				<div class="crop-controls">
					<el-button :icon="ZoomOut" circle @click="zoomOut"/>
					<span class="zoom-info">{{ Math.round(scale * 100) }}%</span>
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
/* 导入外部样式文件 */
@import './css/ProfilePageDesktop.css';
</style>
