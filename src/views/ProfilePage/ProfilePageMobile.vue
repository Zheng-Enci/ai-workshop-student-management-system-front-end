<script setup>
/**
 * 个人信息页面组件(移动端)
 * 
 * @description 提供用户个人信息的查看、编辑、密码修改和头像上传功能(移动端适配)
 * @component ProfilePageMobile
 */
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
import { ref, reactive, onMounted, nextTick } from 'vue'
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
import { ArrowLeft, User, Edit, Lock, Calendar, Camera, ZoomIn, ZoomOut } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

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
import { useLoadingMaskStore } from '@/stores/loading'
import ProfilePageConfig from '@/views/ProfilePage/mobile/common/js/profile-page-common-config'
import ProfilePageUtils from '@/views/ProfilePage/mobile/common/js/profile-page-common-utils'
import LoadingMask from '@/components/LoadingMask.vue'
import ProfilePageUploadAvatarMobileForm from '@/views/ProfilePage/mobile/forms/ProfilePageUploadAvatarMobileForm.vue'
import '@/views/ProfilePage/mobile/css/profile-page-mobile-user-info.css'
import '@/views/ProfilePage/mobile/css/profile-page-mobile-header.css'
import '@/views/ProfilePage/mobile/css/profile-page-mobile-form-section.css'

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
/**
 * 全局加载蒙版 Store
 * @type {Store}
 * @description 管理全局加载蒙版的显示和隐藏
 */
const loadingMaskStore = useLoadingMaskStore()

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

// ===================== 加载状态变量 =====================
/**
 * 数据加载状态
 * @type {Ref<boolean>}
 * @description 控制个人信息数据加载中的状态显示
 */
const isLoading = ref(false)
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
 * 密码修改加载状态
 * @type {Ref<boolean>}
 * @description 控制密码修改操作加载中的状态显示
 */
const isPasswordLoading = ref(false)
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
 * 头像上传对话框显示状态
 * @type {Ref<boolean>}
 * @description 控制头像上传对话框的显示/隐藏
 */
const showAvatarUploadDialog = ref(false)

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
				if (value !== passwordForm.newPassword) {
					callback(new Error('两次输入的密码不一致'))
				} else {
					callback()
				}
			},
			trigger: 'blur'
		}
	]
}


const originalData = ref({})

/**
 * 返回导航页面
 * @function goBack
 * @description 返回到导航页面
 * @returns {void}
 */
const goBack = () => {
	router.push('/navigation')
}

/**
 * 切换主题
 * @function toggleTheme
 * @description 切换应用的主题（亮色/暗色模式）
 * @returns {void}
 */
const toggleTheme = () => {
	themeStore.toggleTheme()
}

/**
 * 加载用户个人资料
 * @function loadProfile
 * @description 从服务器加载用户个人资料、考勤次数和学生ID
 * 1. 设置加载状态为true
 * 2. 验证用户登录状态
 * 3. 并行获取个人资料、考勤次数和学生ID
 * 4. 更新表单数据和相关状态
 * 5. 处理成功或失败的响应
 * 6. 重置加载状态
 * @returns {Promise<void>} 异步操作完成的Promise
 */
const loadProfile = async () => {
	try {
		// 显示全局加载蒙版
		loadingMaskStore.showLoadingMask('正在加载个人信息...')
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
	} catch (error) {
		console.error('加载个人信息失败：', error)
	} finally {
		// 隐藏全局加载蒙版
		loadingMaskStore.hideLoadingMask()
	}
}

/**
 * 加载用户头像
 * @function loadAvatar
 * @description 根据学生ID获取并验证头像URL，确保头像存在后再显示
 * 1. 验证学生ID是否存在
 * 2. 使用getAvatarUrl函数获取头像URL
 * 3. 创建Image对象验证头像是否存在
 * 4. 设置超时机制避免长时间等待
 * 5. 根据验证结果更新头像URL状态
 * @returns {Promise<void>} 异步操作完成的Promise
 */
const loadAvatar = async () => {
	if (!studentInfoId.value) { return }

	avatarLoading.value = true
	try {
		const url = getAvatarUrl(studentInfoId.value, ProfilePageConfig.AVATAR_SIZE)
		if (!url) {
			avatarUrl.value = null
			return
		}

		// 使用Image对象检测头像是否存在
		const img = new Image()
		img.crossOrigin = 'anonymous'

		const checkAvatar = new Promise(resolve => {
			img.onload = () => {
				resolve(true)
			}
			img.onerror = () => {
				resolve(false)
			}
			// 设置超时，避免长时间等待
			setTimeout(() => resolve(false), 5000)
			img.src = url
		})

		const hasAvatar = await checkAvatar
		if (hasAvatar) {
			avatarUrl.value = url
		} else {
			avatarUrl.value = null
		}
	} catch (error) {
		console.error('加载头像失败:', error)
		avatarUrl.value = null
	} finally {
		avatarLoading.value = false
	}
}

/**
 * 处理头像上传成功事件
 * @function handleAvatarUploadSuccess
 * @description 当头像上传成功后，重新加载头像以显示新上传的头像
 * @returns {Promise<void>} 异步操作完成的Promise
 */
const handleAvatarUploadSuccess = async () => {
	await loadAvatar()
}

/**
 * 处理头像上传错误事件
 * @function handleAvatarUploadError
 * @description 当头像上传失败后，重新加载头像以恢复之前的状态
 * @returns {Promise<void>} 异步操作完成的Promise
 */
const handleAvatarUploadError = async () => {
	await loadAvatar()
}

/**
 * 切换编辑模式
 * @function toggleEditMode
 * @description 切换个人信息表单的编辑模式
 * 如果当前处于编辑模式，则取消编辑并重置表单；否则进入编辑模式
 * @returns {void}
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
 * 重置表单
 * @function resetForm
 * @description 将个人信息表单重置为原始数据状态
 * 1. 将表单数据恢复为原始数据
 * 2. 清空密码字段
 * 3. 清除表单验证状态
 * @returns {void}
 */
const resetForm = () => {
	Object.assign(formData, originalData.value)
	formData.password = ''
	if (formRef.value) {
		formRef.value.clearValidate()
	}
}

/**
 * 切换密码修改区域显示状态
 * @function togglePasswordSection
 * @description 切换密码修改区域的显示/隐藏状态
 * 显示时重置密码表单
 * @returns {void}
 */
const togglePasswordSection = () => {
	showPasswordSection.value = !showPasswordSection.value
	if (showPasswordSection.value) {
		resetPasswordForm()
	}
}

/**
 * 重置密码表单
 * @function resetPasswordForm
 * @description 将密码修改表单重置为空状态
 * 1. 清空所有密码相关字段
 * 2. 清除表单验证状态
 * @returns {void}
 */
const resetPasswordForm = () => {
	passwordForm.oldPassword = ''
	passwordForm.newPassword = ''
	passwordForm.confirmPassword = ''
	if (passwordFormRef.value) {
		passwordFormRef.value.clearValidate()
	}
}

/**
 * 取消密码修改
 * @function cancelPasswordChange
 * @description 取消密码修改操作，隐藏密码修改区域并重置表单
 * @returns {void}
 */
const cancelPasswordChange = () => {
	showPasswordSection.value = false
	resetPasswordForm()
}

/**
 * 确认密码修改
 * @function confirmPasswordChange
 * @description 确认密码修改操作
 * 1. 验证密码修改表单
 * 2. 设置加载状态为true
 * 3. 调用API修改密码
 * 4. 处理成功或失败的响应
 * 5. 重置加载状态
 * @returns {Promise<void>} 异步操作完成的Promise
 */
const confirmPasswordChange = async () => {
	if (!passwordFormRef.value) { return }

	try {
		await passwordFormRef.value.validate()
	} catch (error) {
		return
	}

	try {
		// 显示全局加载蒙版
		loadingMaskStore.showLoadingMask('正在修改密码...')
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
	} catch (error) {
		console.error('修改密码失败：', error)
	} finally {
		// 隐藏全局加载蒙版
		loadingMaskStore.hideLoadingMask()
	}
}

/**
 * 保存个人信息
 * @function saveProfile
 * @description 保存用户修改的个人信息到服务器
 * 1. 验证当前状态和表单引用
 * 2. 对表单进行验证
 * 3. 设置加载状态为true
 * 4. 验证用户登录状态
 * 5. 调用API更新学生信息
 * 6. 处理成功或失败的响应
 * 7. 更新本地存储的token（如果返回新token）
 * 8. 重置表单状态并退出编辑模式
 * @returns {Promise<void>} 异步操作完成的Promise
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

	try {
		// 显示全局加载蒙版
		loadingMaskStore.showLoadingMask('正在保存个人信息...')
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
	} catch (error) {
		console.error('保存个人信息失败：', error)
	} finally {
		// 隐藏全局加载蒙版
		loadingMaskStore.hideLoadingMask()
	}
}

/**
 * 显示裁剪对话框
 * @function showCropDialog
 * @description 显示头像裁剪对话框，将选择的图片文件加载到裁剪区域
 * 1. 恢复遮罩层样式确保正常显示
 * 2. 使用FileReader读取文件并转换为图片对象
 * 3. 初始化裁剪区域和事件监听器
 * @param {File} file - 用户选择的图片文件对象
 * @returns {Promise<void>} 异步操作完成的Promise
 * @throws {Error} 当图片加载失败或文件读取失败时抛出错误
 */
const showCropDialog = async file => new Promise((resolve, reject) => {
	try {
		// 恢复遮罩层样式，确保可以正常显示
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

				// 等待DOM更新后初始化裁剪
				nextTick(() => {
					setTimeout(() => {
						initCrop()
					}, 500)
				})
				resolve()
			}
			img.onerror = error => {
				console.error('图片加载失败:', error)
				reject(new Error('图片加载失败'))
			}
			img.src = e.target.result
		}
		reader.onerror = error => {
			console.error('文件读取失败:', error)
			reject(new Error('文件读取失败'))
		}
		reader.readAsDataURL(file)
	} catch (error) {
		console.error('显示裁剪对话框异常:', error)
		reject(error)
	}
})

/**
 * 初始化裁剪
 * @function initCrop
 * @description 初始化头像裁剪功能，设置Canvas尺寸、图片缩放比例和裁剪框位置
 * 1. 验证DOM引用是否存在
 * 2. 设置Canvas实际像素尺寸和CSS尺寸
 * 3. 计算初始缩放比例，确保图片最短边铺满裁剪框
 * 4. 设置图片初始位置为居中显示
 * 5. 初始化裁剪框位置和尺寸
 * 6. 设置动态最小缩放比例
 * 7. 绘制初始图像并设置事件监听器
 * @returns {void}
 */
const initCrop = () => {
	if (!cropCanvasRef.value || !cropImage.value || !cropWrapperRef.value) {
		console.error('初始化裁剪失败：缺少必要的引用')
		return
	}

	const canvas = cropCanvasRef.value
	const wrapper = cropWrapperRef.value
	const img = cropImage.value

	// 设置画布尺寸（移动端适配）
	let wrapperWidth = wrapper.clientWidth
	const wrapperHeight = 300 // 移动端固定高度较小

	if (wrapperWidth === 0) {
		wrapperWidth = wrapper.offsetWidth || 320
	}

	// 设置Canvas的实际像素尺寸
	canvas.width = wrapperWidth
	canvas.height = wrapperHeight

	// 确保Canvas的CSS尺寸与实际尺寸一致
	canvas.style.width = `${wrapperWidth}px`
	canvas.style.height = `${wrapperHeight}px`

	// 计算初始缩放比例，确保图片的最短边铺满300x300的裁剪框
	const imgMinSide = Math.min(img.width, img.height)
	const cropSize = 300 // 裁剪框固定尺寸

	// 以图片的最短边为准进行缩放，确保最短边能够铺满裁剪框
	scale.value = cropSize / imgMinSide

	// 居中显示
	imageX.value = (wrapperWidth - img.width * scale.value) / 2
	imageY.value = (wrapperHeight - img.height * scale.value) / 2

	// 初始化裁剪框（固定为300x300正方形，位于中心）
	const cropBox = cropBoxRef.value
	if (cropBox) {
		cropBox.style.width = `${cropSize}px`
		cropBox.style.height = `${cropSize}px`
		cropBox.style.left = `${(wrapperWidth - cropSize) / 2}px`
		cropBox.style.top = `${(wrapperHeight - cropSize) / 2}px`

		// 计算动态最小缩放比例：使图片最小边等于裁剪框边长
		const imgMinSide = Math.min(img.width, img.height)
		minScale.value = cropSize / imgMinSide
		console.log('动态最小缩放比例:', minScale.value, '图片最小边:', imgMinSide, '裁剪框尺寸:', cropSize)
	} else {
		// 如果裁剪框不存在，使用默认最小缩放
		minScale.value = 0.1
	}

	// 先绘制一次，确保内容显示
	drawCropCanvas()
	setupCropEvents()
}

/**
 * 限制图片位置，确保图片始终覆盖裁剪框
 */
const constrainImagePosition = () => {
	if (!cropCanvasRef.value || !cropImage.value || !cropBoxRef.value) {
		return
	}

	const canvas = cropCanvasRef.value
	const img = cropImage.value
	const cropBox = cropBoxRef.value

	// 获取裁剪框位置和尺寸
	const cropRect = cropBox.getBoundingClientRect()
	const canvasRect = canvas.getBoundingClientRect()

	let cropX, cropY, cropSize

	if (cropRect.width > 0) {
		cropX = cropRect.left - canvasRect.left
		cropY = cropRect.top - canvasRect.top
		cropSize = cropRect.width
	} else {
		// 使用样式计算的位置
		cropX = parseFloat(cropBox.style.left) || 0
		cropY = parseFloat(cropBox.style.top) || 0
		cropSize = parseFloat(cropBox.style.width) || 250
	}

	// 计算图片的显示尺寸（考虑缩放）
	const imgWidth = img.width * scale.value
	const imgHeight = img.height * scale.value

	// 计算裁剪框的边界
	const cropLeft = cropX
	const cropRight = cropX + cropSize
	const cropTop = cropY
	const cropBottom = cropY + cropSize

	// 限制图片位置，确保图片始终覆盖裁剪框
	// 图片左边缘不能超过裁剪框左边缘（向右拖动时限制）
	if (imageX.value > cropLeft) {
		imageX.value = cropLeft
	}
	// 图片右边缘不能小于裁剪框右边缘（向左拖动时限制）
	if (imageX.value + imgWidth < cropRight) {
		imageX.value = cropRight - imgWidth
	}
	// 图片上边缘不能超过裁剪框上边缘（向下拖动时限制）
	if (imageY.value > cropTop) {
		imageY.value = cropTop
	}
	// 图片下边缘不能小于裁剪框下边缘（向上拖动时限制）
	if (imageY.value + imgHeight < cropBottom) {
		imageY.value = cropBottom - imgHeight
	}
}

/**
 * 绘制裁剪画布
 */
const drawCropCanvas = () => {
	if (!cropCanvasRef.value || !cropImage.value) {
		return
	}

	const canvas = cropCanvasRef.value
	const ctx = canvas.getContext('2d')
	const img = cropImage.value

	// 清空画布
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	// 绘制半透明背景
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	// 绘制图片
	const imgWidth = img.width * scale.value
	const imgHeight = img.height * scale.value

	ctx.save()
	ctx.globalCompositeOperation = 'source-over'
	ctx.drawImage(img, imageX.value, imageY.value, imgWidth, imgHeight)

	// 绘制裁剪框外的遮罩
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
			cropSize = parseFloat(cropBox.style.width) || 250
			cropX = left
			cropY = top
		}

		// 使用destination-out模式清除裁剪框区域
		ctx.globalCompositeOperation = 'destination-out'
		ctx.fillRect(cropX, cropY, cropSize, cropSize)
	}

	ctx.restore()
}

/**
 * 设置裁剪事件（移动端支持触摸）
 */
const setupCropEvents = () => {
	if (!cropCanvasRef.value) { return }

	// 先移除旧的事件监听器
	removeCropEvents()

	const canvas = cropCanvasRef.value

	// 鼠标/触摸按下
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
			dragStartX.value = e.clientX || e.touches?.[0]?.clientX || 0
			dragStartY.value = e.clientY || e.touches?.[0]?.clientY || 0
			dragStartImageX.value = imageX.value
			dragStartImageY.value = imageY.value
			canvas.style.cursor = 'grabbing'
		}
	}

	// 鼠标/触摸移动
	mouseMoveHandler = e => {
		if (isDragging.value) {
			e.preventDefault()
			const currentX = e.clientX || e.touches?.[0]?.clientX || 0
			const currentY = e.clientY || e.touches?.[0]?.clientY || 0
			const deltaX = currentX - dragStartX.value
			const deltaY = currentY - dragStartY.value
			imageX.value = dragStartImageX.value + deltaX
			imageY.value = dragStartImageY.value + deltaY
			// 应用边界限制
			constrainImagePosition()
			drawCropCanvas()
		}
	}

	// 鼠标/触摸释放
	mouseUpHandler = () => {
		if (isDragging.value) {
			isDragging.value = false
			if (canvas) {
				canvas.style.cursor = 'move'
			}
		}
	}

	// 滚轮缩放
	wheelHandler = e => {
		e.preventDefault()
		e.stopPropagation()

		const oldScale = scale.value
		const delta = e.deltaY > 0 ? -0.01 : 0.01
		const newScale = Math.max(minScale.value, Math.min(5, scale.value + delta))

		if (newScale === oldScale) {
			return
		}

		// 以裁剪框中心为基准进行缩放
		if (cropBoxRef.value && cropCanvasRef.value) {
			const cropBox = cropBoxRef.value
			const canvas = cropCanvasRef.value
			const cropRect = cropBox.getBoundingClientRect()
			const canvasRect = canvas.getBoundingClientRect()

			const cropCenterX = (cropRect.left - canvasRect.left) + cropRect.width / 2
			const cropCenterY = (cropRect.top - canvasRect.top) + cropRect.height / 2

			const scaleRatio = newScale / oldScale

			imageX.value = cropCenterX - (cropCenterX - imageX.value) * scaleRatio
			imageY.value = cropCenterY - (cropCenterY - imageY.value) * scaleRatio
		}

		scale.value = newScale
		// 应用边界限制
		constrainImagePosition()
		drawCropCanvas()
	}

	// 计算两点之间的距离
	const getDistance = (touch1, touch2) => {
		const dx = touch2.clientX - touch1.clientX
		const dy = touch2.clientY - touch1.clientY
		return Math.sqrt(dx * dx + dy * dy)
	}

	// 计算两点的中心点
	const getCenter = (touch1, touch2) => ({
		x: (touch1.clientX + touch2.clientX) / 2,
		y: (touch1.clientY + touch2.clientY) / 2
	})

	// 触摸事件（移动端）
	touchStartHandler = e => {
		const { target } = e
		if (target === canvas || target === cropWrapperRef.value ||
			(cropWrapperRef.value && cropWrapperRef.value.contains(target))) {
			if (cropBoxRef.value && cropBoxRef.value.contains(target)) {
				return
			}

			// 检测是否有两个触摸点（捏合手势）
			if (e.touches.length === 2) {
				e.preventDefault()
				e.stopPropagation()

				// 开始捏合缩放
				isPinching.value = true
				isDragging.value = false

				const touch1 = e.touches[0]
				const touch2 = e.touches[1]

				// 记录初始距离和缩放比例
				initialPinchDistance.value = getDistance(touch1, touch2)
				initialPinchScale.value = scale.value

				// 计算初始中心点（在画布上的坐标）
				const center = getCenter(touch1, touch2)
				const canvasRect = canvas.getBoundingClientRect()
				initialPinchCenterX.value = center.x - canvasRect.left
				initialPinchCenterY.value = center.y - canvasRect.top
			} else if (e.touches.length === 1) {
				// 单点触摸，处理拖动
				mouseDownHandler(e)
			}
		}
	}

	touchMoveHandler = e => {
		if (isPinching.value && e.touches.length === 2) {
			// 处理捏合缩放
			e.preventDefault()
			e.stopPropagation()

			const touch1 = e.touches[0]
			const touch2 = e.touches[1]
			const currentDistance = getDistance(touch1, touch2)

			// 计算缩放比例
			const distanceRatio = currentDistance / initialPinchDistance.value
			const newScale = Math.max(minScale.value, Math.min(5, initialPinchScale.value * distanceRatio))

			// 计算当前中心点（在画布上的坐标）
			const center = getCenter(touch1, touch2)
			const canvasRect = canvas.getBoundingClientRect()
			const currentCenterX = center.x - canvasRect.left
			const currentCenterY = center.y - canvasRect.top

			// 以中心点为基准进行缩放
			const scaleRatio = newScale / scale.value
			imageX.value = currentCenterX - (currentCenterX - imageX.value) * scaleRatio
			imageY.value = currentCenterY - (currentCenterY - imageY.value) * scaleRatio

			scale.value = newScale
			// 应用边界限制
			constrainImagePosition()
			drawCropCanvas()
		} else if (isDragging.value && e.touches.length === 1) {
			// 单点拖动
			mouseMoveHandler(e)
		} else if (e.touches.length === 1 && !isPinching.value) {
			// 从捏合变为单点，开始拖动
			mouseDownHandler(e)
		}
	}

	touchEndHandler = e => {
		if (isPinching.value) {
			// 结束捏合
			isPinching.value = false
			initialPinchDistance.value = 0
		}

		if (e.touches.length === 0) {
			// 所有触摸点都释放了
			mouseUpHandler()
		} else if (e.touches.length === 1) {
			// 从两个触摸点变为一个，重置拖动状态
			isDragging.value = false
			const touch = e.touches[0]
			dragStartX.value = touch.clientX
			dragStartY.value = touch.clientY
			dragStartImageX.value = imageX.value
			dragStartImageY.value = imageY.value
		}
	}

	// 添加事件监听器
	canvas.addEventListener('mousedown', mouseDownHandler)
	canvas.addEventListener('touchstart', touchStartHandler, { passive: false })
	document.addEventListener('mousemove', mouseMoveHandler)
	document.addEventListener('touchmove', touchMoveHandler, { passive: false })
	document.addEventListener('mouseup', mouseUpHandler)
	document.addEventListener('touchend', touchEndHandler)
	canvas.addEventListener('wheel', wheelHandler)

	canvas.style.cursor = 'move'
}

/**
 * 移除裁剪事件
 * @function removeCropEvents
 * @description 移除所有与头像裁剪相关的事件监听器，防止内存泄漏
 * 包括鼠标事件、触摸事件和滚轮事件的监听器移除
 * @returns {void}
 */
const removeCropEvents = () => {
	if (!cropCanvasRef.value) { return }

	const canvas = cropCanvasRef.value

	if (mouseDownHandler) {
		canvas.removeEventListener('mousedown', mouseDownHandler)
	}
	if (touchStartHandler) {
		canvas.removeEventListener('touchstart', touchStartHandler)
	}
	if (mouseMoveHandler) {
		document.removeEventListener('mousemove', mouseMoveHandler)
	}
	if (touchMoveHandler) {
		document.removeEventListener('touchmove', touchMoveHandler)
	}
	if (mouseUpHandler) {
		document.removeEventListener('mouseup', mouseUpHandler)
	}
	if (touchEndHandler) {
		document.removeEventListener('touchend', touchEndHandler)
	}
	if (wheelHandler) {
		canvas.removeEventListener('wheel', wheelHandler)
	}
}

/**
 * 放大
 * @function zoomIn
 * @description 将图片放大0.1倍，最大放大到5倍，放大时以裁剪框中心为基准点
 * 1. 计算新的缩放比例（最大不超过5倍）
 * 2. 以裁剪框中心为基准点计算新的图片位置
 * 3. 更新缩放比例并应用边界限制
 * 4. 重新绘制裁剪画布
 * @returns {void}
 */
const zoomIn = () => {
	const oldScale = scale.value
	const newScale = Math.min(5, scale.value + 0.1)

	if (newScale === oldScale) {
		return
	}

	if (cropBoxRef.value && cropCanvasRef.value) {
		const cropBox = cropBoxRef.value
		const canvas = cropCanvasRef.value
		const cropRect = cropBox.getBoundingClientRect()
		const canvasRect = canvas.getBoundingClientRect()

		const cropCenterX = (cropRect.left - canvasRect.left) + cropRect.width / 2
		const cropCenterY = (cropRect.top - canvasRect.top) + cropRect.height / 2

		const scaleRatio = newScale / oldScale

		imageX.value = cropCenterX - (cropCenterX - imageX.value) * scaleRatio
		imageY.value = cropCenterY - (cropCenterY - imageY.value) * scaleRatio
	}

	scale.value = newScale
	// 应用边界限制
	constrainImagePosition()
	drawCropCanvas()
}

/**
 * 缩小
 * @function zoomOut
 * @description 将图片缩小0.1倍，最小缩小到动态计算的最小缩放比例，缩小时以裁剪框中心为基准点
 * 1. 计算新的缩放比例（最小不低于动态计算的最小缩放比例）
 * 2. 以裁剪框中心为基准点计算新的图片位置
 * 3. 更新缩放比例并应用边界限制
 * 4. 重新绘制裁剪画布
 * @returns {void}
 */
const zoomOut = () => {
	const oldScale = scale.value
	const newScale = Math.max(minScale.value, scale.value - 0.1)

	if (newScale === oldScale) {
		return
	}

	if (cropBoxRef.value && cropCanvasRef.value) {
		const cropBox = cropBoxRef.value
		const canvas = cropCanvasRef.value
		const cropRect = cropBox.getBoundingClientRect()
		const canvasRect = canvas.getBoundingClientRect()

		const cropCenterX = (cropRect.left - canvasRect.left) + cropRect.width / 2
		const cropCenterY = (cropRect.top - canvasRect.top) + cropRect.height / 2

		const scaleRatio = newScale / oldScale

		imageX.value = cropCenterX - (cropCenterX - imageX.value) * scaleRatio
		imageY.value = cropCenterY - (cropCenterY - imageY.value) * scaleRatio
	}

	scale.value = newScale
	// 应用边界限制
	constrainImagePosition()
	drawCropCanvas()
}

/**
 * 重置裁剪
 * @function resetCrop
 * @description 重置裁剪状态，重新初始化裁剪参数到默认值
 * 1. 验证图片和包装器引用是否存在
 * 2. 重新初始化裁剪参数
 * @returns {void}
 */
const resetCrop = () => {
	if (!cropImage.value || !cropWrapperRef.value) { return }
	initCrop()
}

/**
 * 取消裁剪
 * @function cancelCrop
 * @description 取消头像裁剪操作，清理事件监听器并重置裁剪状态
 * 1. 移除所有裁剪事件监听器
 * 2. 隐藏遮罩层避免视觉闪烁
 * 3. 清空裁剪图片引用
 * 4. 关闭裁剪对话框
 * 5. 延迟清理其他裁剪相关状态数据
 * @returns {void}
 */
const cancelCrop = () => {
	removeCropEvents()

	// 先直接操作DOM隐藏遮罩层，避免闪烁
	const dialogWrapper = document.querySelector('.crop-dialog-overlay')
	if (dialogWrapper) {
		dialogWrapper.style.display = 'none'
		dialogWrapper.style.visibility = 'hidden'
		dialogWrapper.style.opacity = '0'
	}

	// 立即清空 cropImage，避免在关闭动画过程中重新渲染
	cropImage.value = null

	// 关闭弹窗
	cropDialogVisible.value = false

	// 延迟清空其他数据，确保弹窗完全关闭后再清空
	setTimeout(() => {
		originalImageFile.value = null
		scale.value = 1
		imageX.value = 0
		imageY.value = 0
		isDragging.value = false
		isPinching.value = false
		initialPinchDistance.value = 0
	}, 0)
}

/**
 * 确认裁剪
 * @function confirmCrop
 * @description 确认头像裁剪操作，提取裁剪区域并上传裁剪后的头像
 * 1. 验证必要的DOM引用是否存在
 * 2. 计算裁剪区域在原图中的位置和尺寸
 * 3. 创建新的Canvas进行裁剪，输出为正方形
 * 4. 将裁剪结果转换为Blob并创建File对象
 * 5. 压缩图片后上传到服务器
 * @returns {Promise<void>} 异步操作完成的Promise
 */
const confirmCrop = async () => {
	if (!cropCanvasRef.value || !cropImage.value || !cropBoxRef.value) { return }

	isCropping.value = true
	try {
		const canvas = cropCanvasRef.value
		const cropBox = cropBoxRef.value
		const img = cropImage.value

		// 获取裁剪框位置和尺寸
		const canvasRect = canvas.getBoundingClientRect()
		const cropRect = cropBox.getBoundingClientRect()
		const cropX = cropRect.left - canvasRect.left
		const cropY = cropRect.top - canvasRect.top
		const cropSize = cropRect.width

		// 计算裁剪区域在原图中的位置和尺寸
		const sourceX = (cropX - imageX.value) / scale.value
		const sourceY = (cropY - imageY.value) / scale.value
		const sourceSize = cropSize / scale.value

		// 创建新的Canvas进行裁剪，使用原图最小边长作为正方形尺寸
		const cropCanvas = document.createElement('canvas')
		const outputSize = Math.min(img.width, img.height) // 使用原图的最小边长
		cropCanvas.width = outputSize
		cropCanvas.height = outputSize
		const cropCtx = cropCanvas.getContext('2d')

		// 绘制裁剪区域，输出为正方形
		cropCtx.drawImage(
			img,
			sourceX, sourceY, sourceSize, sourceSize, // 源图片裁剪区域
			0, 0, outputSize, outputSize // 目标Canvas区域，正方形尺寸
		)

		// 转换为Blob
		cropCanvas.toBlob(async blob => {
			if (!blob) {
				ElMessage.error('裁剪失败')
				return
			}

			// 创建File对象
			const croppedFile = new File([blob], originalImageFile.value?.name || 'avatar.jpg', {
				type: originalImageFile.value?.type || 'image/jpeg',
				lastModified: Date.now()
			})

			// 关闭裁剪对话框
			cropDialogVisible.value = false

			// 压缩并上传
			try {
				ElMessage.info('正在处理头像, 请稍候...')
				const compressedFile = await ProfilePageUtils.compressImage(croppedFile)

				// 预览图片
				const reader = new FileReader()
				reader.onload = e => {
					avatarUrl.value = e.target.result
				}
				reader.readAsDataURL(compressedFile)

				// 上传头像
				await uploadAvatarFile(compressedFile)
			} catch (error) {
				ElMessage.error(`图片处理失败：${error.message}`)
			} finally {
				isCropping.value = false
				cropImage.value = null
				originalImageFile.value = null
			}
		}, originalImageFile.value?.type || 'image/jpeg', 0.9)
	} catch (error) {
		isCropping.value = false
		ElMessage.error(`裁剪失败：${error.message}`)
	}
}

/**
 * 压缩图片直到小于2MB
 * @function compressImage
 * @description 压缩图片文件直到其大小小于指定的最大值
 * 1. 使用FileReader读取图片文件
 * 2. 创建Image对象加载图片
 * 3. 使用Canvas进行图片压缩
 * 4. 递归压缩直到图片大小满足要求或达到最小尺寸
 * @param {File} file - 需要压缩的图片文件
 * @param {number} maxSize - 最大文件大小（字节），默认为2MB
 * @returns {Promise<File>} 压缩后的文件对象
 * @throws {Error} 当图片加载失败或文件读取失败时抛出错误
 */
const compressImage = (file, maxSize = 2 * 1024 * 1024) => new Promise((resolve, reject) => {
	const reader = new FileReader()

	reader.onload = e => {
		const img = new Image()

		img.onload = () => {
			let { width } = img
			let { height } = img
			const minDimension = 100
			const quality = 0.9

			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')

			const tryCompress = () => {
				canvas.width = width
				canvas.height = height

				ctx.drawImage(img, 0, 0, width, height)

				canvas.toBlob(
					blob => {
						if (!blob) {
							reject(new Error('图片压缩失败'))
							return
						}

						if (blob.size <= maxSize) {
							const compressedFile = new File([blob], file.name, {
								type: file.type || 'image/jpeg',
								lastModified: Date.now()
							})
							resolve(compressedFile)
							return
						}

						if (width > minDimension && height > minDimension) {
							width = Math.max(minDimension, Math.floor(width * 0.5))
							height = Math.max(minDimension, Math.floor(height * 0.5))
							tryCompress()
							return
						}

						const compressedFile = new File([blob], file.name, {
							type: file.type || 'image/jpeg',
							lastModified: Date.now()
						})
						resolve(compressedFile)
					},
					file.type || 'image/jpeg',
					quality
				)
			}

			tryCompress()
		}

		img.onerror = () => {
			reject(new Error('图片加载失败'))
		}

		img.src = e.target.result
	}

	reader.onerror = () => {
		reject(new Error('文件读取失败'))
	}

	reader.readAsDataURL(file)
})

/**
 * 上传头像文件
 * @function uploadAvatarFile
 * @description 上传裁剪后的头像文件到服务器
 * 1. 设置上传状态为加载中
 * 2. 验证用户登录状态
 * 3. 调用API上传头像文件
 * 4. 处理上传成功或失败的响应
 * 5. 更新头像显示并重置上传状态
 * @param {File} file - 需要上传的头像文件
 * @returns {Promise<void>} 异步操作完成的Promise
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
		console.error('头像上传错误:', error)
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

onMounted(() => {
	loadProfile()
})
</script>

<template>
	<!-- 个人信息页面主容器(移动端) -->
	<div class="profile-container">
		<!-- 全局加载蒙版 -->
		<LoadingMask/>
		<!-- 页面头部 -->
		<div class="profile-page-mobile-header">
			<div class="profile-page-mobile-header-content">
				<el-button
					class="profile-page-mobile-header-back-btn"
					type="primary"
					:icon="ArrowLeft"
					circle
					@click="goBack"/>
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊"
					class="profile-page-mobile-header-logo"
					@click="toggleTheme"/>
				<div class="profile-page-mobile-header-title-section">
					<h1>个人信息</h1>
					<p>Personal Profile</p>
				</div>
			</div>
		</div>

		<!-- 主内容区域 -->
		<div class="main-content">
			<!-- 个人信息卡片 -->
			<div class="profile-page-mobile-profile-card">
				<!-- 加载遮罩 -->
				<div v-if="isLoading" class="loading-overlay">
					<div class="loading-spinner"/>
				</div>

				<!-- 用户信息头部 -->
				<div class="profile-page-mobile-profile-header">
					<div class="profile-page-mobile-user-info-section">
						<!-- 头像上传区域 -->
						<div class="profile-page-mobile-avatar-wrapper">
							<div class="profile-page-mobile-avatar-container" @click="showAvatarUploadDialog = true">
								<div class="profile-page-mobile-avatar" :class="{ 'avatar-loading': avatarLoading }">
									<img
										v-if="avatarUrl"
										:src="avatarUrl"
										alt="头像"
										class="profile-page-mobile-avatar"
									/>
									<el-icon v-else class="profile-page-mobile-avatar-icon">
										<user/>
									</el-icon>
									<div v-if="avatarLoading" class="profile-page-mobile-avatar-loading-spinner"/>
								</div>
								<div class="profile-page-mobile-avatar-status"/>
								<div class="profile-page-mobile-avatar-upload-overlay">
									<el-icon class="profile-page-mobile-upload-icon">
										<camera/>
									</el-icon>
									<span class="profile-page-mobile-upload-text">点击上传头像</span>
								</div>
							</div>
							<div class="profile-page-mobile-avatar-tip">
								<el-icon class="profile-page-mobile-tip-icon">
									<camera/>
								</el-icon>
								<span class="tip-text">{{ avatarUrl ? '点击头像修改头像' : '点击头像上传头像' }}</span>
							</div>
						</div>
						<!-- 用户详细信息 -->
						<div class="profile-page-mobile-user-details">
							<h2>{{ formData.name || '用户' }}</h2>
							<p class="profile-page-mobile-student-id">{{ formData.studentId || '学号' }}</p>
							<div class="profile-page-mobile-user-stats">
								<div v-if="attendanceCount !== null" class="profile-page-mobile-stat-item">
									<el-icon class="profile-page-mobile-stat-icon">
										<calendar/>
									</el-icon>
									<span class="profile-page-mobile-stat-text">已签到 {{ attendanceCount }} 次</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div v-if="!showPasswordSection" class="profile-page-mobile-form-section">
				<div class="profile-page-mobile-form-section-header">
					<div class="profile-page-mobile-form-section-title-wrapper">
						<div>
							<h3>基本信息</h3>
							<p>管理您的个人资料信息</p>
						</div>
						<el-button
							type="primary"
							:icon="Edit"
							:disabled="isLoading"
							class="profile-page-mobile-form-section-edit-btn"
							@click="toggleEditMode"
						>
							{{ isEditing ? '取消' : '编辑' }}
						</el-button>
					</div>
					<div class="profile-page-mobile-form-section-security-badge">
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
					class="profile-page-mobile-form-section-profile-form"
				>
					<div class="profile-page-mobile-form-section-form-grid">
							<div class="profile-page-mobile-form-section-form-item">
								<label class="profile-page-mobile-form-section-form-label">姓名</label>
								<el-form-item prop="name">
									<el-input
										v-model="formData.name"
										:disabled="!isEditing"
										placeholder="请输入姓名"
										maxlength="20"
										class="profile-page-mobile-form-section-form-input"
									/>
								</el-form-item>
							</div>

							<div class="profile-page-mobile-form-section-form-item">
								<label class="profile-page-mobile-form-section-form-label">学号</label>
								<el-form-item prop="studentId">
									<el-input
										v-model="formData.studentId"
										:disabled="!isEditing"
										placeholder="请输入学号"
										maxlength="10"
										class="profile-page-mobile-form-section-form-input"
									/>
								</el-form-item>
							</div>

							<div class="profile-page-mobile-form-section-form-item">
								<label class="profile-page-mobile-form-section-form-label">性别</label>
								<el-form-item prop="gender">
									<el-select
										v-model="formData.gender"
										:disabled="!isEditing"
										placeholder="请选择性别"
										class="profile-page-mobile-form-section-form-input"
									>
										<el-option label="男" value="男"/>
										<el-option label="女" value="女"/>
									</el-select>
								</el-form-item>
							</div>

							<div class="profile-page-mobile-form-section-form-item">
								<label class="profile-page-mobile-form-section-form-label">手机号</label>
								<el-form-item prop="phoneNumber">
									<el-input
										v-model="formData.phoneNumber"
										:disabled="!isEditing"
										placeholder="请输入手机号"
										maxlength="11"
										class="profile-page-mobile-form-section-form-input"
									/>
								</el-form-item>
							</div>

							<div class="profile-page-mobile-form-section-form-item">
								<label class="profile-page-mobile-form-section-form-label">学院</label>
								<el-form-item prop="college">
									<el-input
										v-model="formData.college"
										:disabled="!isEditing"
										placeholder="请输入学院"
										maxlength="50"
										class="profile-page-mobile-form-section-form-input"
									/>
								</el-form-item>
							</div>

							<div class="profile-page-mobile-form-section-form-item">
								<label class="profile-page-mobile-form-section-form-label">专业</label>
								<el-form-item prop="major">
									<el-input
										v-model="formData.major"
										:disabled="!isEditing"
										placeholder="请输入专业"
										maxlength="50"
										class="profile-page-mobile-form-section-form-input"
									/>
								</el-form-item>
							</div>

							<div class="profile-page-mobile-form-section-form-item">
								<label class="profile-page-mobile-form-section-form-label">年级</label>
								<el-form-item prop="grade">
									<el-select
										v-model="formData.grade"
										:disabled="!isEditing"
										placeholder="请选择年级"
										class="profile-page-mobile-form-section-form-input"
									>
										<el-option label="1年级" :value="1"/>
										<el-option label="2年级" :value="2"/>
										<el-option label="3年级" :value="3"/>
										<el-option label="4年级" :value="4"/>
										<el-option label="5年级" :value="5"/>
									</el-select>
								</el-form-item>
							</div>

							<div class="profile-page-mobile-form-section-form-item">
								<label class="profile-page-mobile-form-section-form-label">班级</label>
								<el-form-item prop="classNum">
									<el-input-number
										v-model="formData.classNum"
										:disabled="!isEditing"
										:min="1"
										:max="100"
										placeholder="请输入班级"
										class="profile-page-mobile-form-section-form-input"
									/>
								</el-form-item>
							</div>

							<div class="profile-page-mobile-form-section-form-item">
								<label class="profile-page-mobile-form-section-form-label">当前密码</label>
								<el-form-item prop="password">
									<el-input
										v-model="formData.password"
										type="password"
										:disabled="!isEditing"
										placeholder="请输入当前密码以确认身份"
										maxlength="16"
										show-password
										class="profile-page-mobile-form-section-form-input"
									/>
								</el-form-item>
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
						<div class="profile-page-mobile-form-section-form-item">
							<label class="profile-page-mobile-form-section-form-label">
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

						<div class="profile-page-mobile-form-section-form-item">
							<label class="profile-page-mobile-form-section-form-label">
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

						<div class="profile-page-mobile-form-section-form-item">
							<label class="profile-page-mobile-form-section-form-label">
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

						<div class="form-actions">
							<el-button :disabled="isPasswordLoading" class="reset-btn" @click="cancelPasswordChange">
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

		<!-- 头像上传表单组件 -->
		<ProfilePageUploadAvatarMobileForm
			v-model="showAvatarUploadDialog"
			:student-info-id="studentInfoId"
			@upload-success="handleAvatarUploadSuccess"
			@upload-error="handleAvatarUploadError"
		/>
	</div>
</template>

<style scoped>
</style>


