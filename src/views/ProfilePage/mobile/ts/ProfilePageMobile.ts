/**
 * 个人信息页面移动端业务逻辑类
 *
 * @class ProfilePageMobile
 * @description 封装移动端个人信息页面的所有业务逻辑，包括表单数据管理、个人信息加载保存、头像上传、密码修改等功能
 */
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
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

export default class ProfilePageMobile {
	/**
	 * 路由实例
	 * @private
	 */
	private router: ReturnType<typeof useRouter>

	/**
	 * 主题状态仓库实例
	 * @private
	 */
	private themeStore: ReturnType<typeof useThemeStore>

	/**
	 * 全局加载蒙版 Store
	 * @private
	 */
	private loadingMaskStore: ReturnType<typeof useLoadingMaskStore>

	/**
	 * 个人信息表单引用
	 * @public
	 */
	public formRef = ref()

	/**
	 * 密码修改表单引用
	 * @public
	 */
	public passwordFormRef = ref()

	/**
	 * 数据加载状态
	 * @public
	 */
	public isLoading = ref(false)

	/**
	 * 编辑模式状态
	 * @public
	 */
	public isEditing = ref(false)

	/**
	 * 密码修改区域显示状态
	 * @public
	 */
	public showPasswordSection = ref(false)

	/**
	 * 密码修改加载状态
	 * @public
	 */
	public isPasswordLoading = ref(false)

	/**
	 * 考勤次数
	 * @public
	 */
	public attendanceCount = ref(null)

	/**
	 * 学生数据库ID
	 * @public
	 */
	public studentInfoId = ref(null)

	/**
	 * 头像URL
	 * @public
	 */
	public avatarUrl = ref(null)

	/**
	 * 头像加载状态
	 * @public
	 */
	public avatarLoading = ref(false)

	/**
	 * 头像上传状态
	 * @public
	 */
	public isUploading = ref(false)

	/**
	 * 个人信息表单数据
	 * @public
	 */
	public formData = reactive({
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
	 * @public
	 */
	public passwordForm = reactive({
		oldPassword: '',
		newPassword: '',
		confirmPassword: ''
	})

	/**
	 * 原始数据备份
	 * @public
	 */
	public originalData = ref({})

	/**
	 * 表单验证规则
	 * @public
	 */
	public rules = {
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
			{ required: true, message: '请输入密码', trigger: 'blur' }
		]
	}

	/**
	 * 密码验证规则
	 * @public
	 */
	public passwordRules = {
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
				validator: (rule: any, value: string, callback: any) => {
					if (value !== this.passwordForm.newPassword) {
						callback(new Error('两次输入的密码不一致'))
					} else {
						callback()
					}
				},
				trigger: 'blur'
			}
		]
	}

	/**
	 * 裁剪相关状态
	 * @public
	 */
	public cropDialogVisible = ref(false)
	public cropCanvasRef = ref(null)
	public cropWrapperRef = ref(null)
	public cropBoxRef = ref(null)
	public originalImageFile = ref(null)
	public cropImage = ref(null)
	public scale = ref(1)
	public minScale = ref(0.1)
	public imageX = ref(0)
	public imageY = ref(0)
	public isDragging = ref(false)
	public isPinching = ref(false)
	public initialPinchDistance = ref(0)
	public initialPinchScale = ref(1)
	public initialPinchCenterX = ref(0)
	public initialPinchCenterY = ref(0)
	public isCropping = ref(false)
	public dragStartX = ref(0)
	public dragStartY = ref(0)
	public dragStartImageX = ref(0)
	public dragStartImageY = ref(0)

	/**
	 * 事件处理器引用
	 * @private
	 */
	private mouseDownHandler: any = null
	private mouseMoveHandler: any = null
	private mouseUpHandler: any = null
	private wheelHandler: any = null
	private touchStartHandler: any = null
	private touchMoveHandler: any = null
	private touchEndHandler: any = null

	/**
	 * 构造函数
	 * @constructor
	 * @description 初始化路由、主题Store和加载蒙版Store
	 */
	constructor() {
		this.router = useRouter()
		this.themeStore = useThemeStore()
		this.loadingMaskStore = useLoadingMaskStore()
	}

	/**
	 * 返回导航页面
	 * @public
	 * @method goBack
	 * @description 返回到导航页面
	 * @returns {void}
	 */
	public goBack() {
		this.router.push('/navigation')
	}

	/**
	 * 切换主题
	 * @public
	 * @method toggleTheme
	 * @description 切换应用的主题（亮色/暗色模式）
	 * @returns {void}
	 */
	public toggleTheme() {
		this.themeStore.toggleTheme()
	}

	/**
	 * 加载用户个人资料
	 * @public
	 * @method loadProfile
	 * @description 从服务器加载用户个人资料、考勤次数和学生ID
	 * @returns {Promise<void>} 异步操作完成的Promise
	 */
	public async loadProfile() {
		try {
			this.loadingMaskStore.showLoadingMask('正在加载个人信息...')
			this.isLoading.value = true
			try {
				const token = localStorage.getItem('token')
				if (!token) {
					ElMessage.error('请先登录')
					this.router.push('/login')
					return
				}

				const [profileResponse, attendanceResponse, studentIdResponse] = await Promise.all([
					getStudentProfile(token),
					getMyAttendanceCount(token),
					getStudentDatabaseTableId(token)
				])

				if (profileResponse.code === 200) {
					Object.assign(this.formData, profileResponse.data)
					this.originalData.value = { ...profileResponse.data }
				} else {
					ElMessage.error(profileResponse.message || '获取个人信息失败')
				}

				if (attendanceResponse.code === 200) {
					this.attendanceCount.value = attendanceResponse.data.count
				}

				if (studentIdResponse.code === 200) {
					this.studentInfoId.value = studentIdResponse.data
					await this.loadAvatar()
				}
			} catch (error: any) {
				ElMessage.error(`获取个人信息失败：${error.message}`)
				if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
					localStorage.removeItem('token')
					localStorage.removeItem('userInfo')
					this.router.push('/login')
				}
			} finally {
				this.isLoading.value = false
			}
		} catch (error) {
			console.error('加载个人信息失败：', error)
		} finally {
			this.loadingMaskStore.hideLoadingMask()
		}
	}

	/**
	 * 加载用户头像
	 * @public
	 * @method loadAvatar
	 * @description 根据学生ID获取并验证头像URL
	 * @returns {Promise<void>} 异步操作完成的Promise
	 */
	public async loadAvatar() {
		if (!this.studentInfoId.value) { return }

		this.avatarLoading.value = true
		try {
			const url = getAvatarUrl(this.studentInfoId.value, ProfilePageConfig.AVATAR_SIZE)
			if (!url) {
				this.avatarUrl.value = null
				return
			}

			const img = new Image()
			img.crossOrigin = 'anonymous'

			const checkAvatar = new Promise(resolve => {
				img.onload = () => { resolve(true) }
				img.onerror = () => { resolve(false) }
				setTimeout(() => resolve(false), 5000)
				img.src = url
			})

			const hasAvatar = await checkAvatar
			if (hasAvatar) {
				this.avatarUrl.value = url
			} else {
				this.avatarUrl.value = null
			}
		} catch (error) {
			console.error('加载头像失败:', error)
			this.avatarUrl.value = null
		} finally {
			this.avatarLoading.value = false
		}
	}

	/**
	 * 处理头像上传成功事件
	 * @public
	 * @method handleAvatarUploadSuccess
	 * @description 当头像上传成功后，重新加载头像
	 * @returns {Promise<void>} 异步操作完成的Promise
	 */
	public async handleAvatarUploadSuccess() {
		await this.loadAvatar()
	}

	/**
	 * 处理头像上传错误事件
	 * @public
	 * @method handleAvatarUploadError
	 * @description 当头像上传失败后，重新加载头像
	 * @returns {Promise<void>} 异步操作完成的Promise
	 */
	public async handleAvatarUploadError() {
		await this.loadAvatar()
	}

	/**
	 * 切换编辑模式
	 * @public
	 * @method toggleEditMode
	 * @description 切换个人信息表单的编辑模式
	 * @returns {void}
	 */
	public toggleEditMode() {
		if (this.isEditing.value) {
			this.resetForm()
			this.isEditing.value = false
			ElMessage.success('已取消编辑')
		} else {
			this.isEditing.value = true
		}
	}

	/**
	 * 重置表单
	 * @public
	 * @method resetForm
	 * @description 将个人信息表单重置为原始数据状态
	 * @returns {void}
	 */
	public resetForm() {
		Object.assign(this.formData, this.originalData.value)
		this.formData.password = ''
		if (this.formRef.value) {
			this.formRef.value.clearValidate()
		}
	}

	/**
	 * 切换密码修改区域显示状态
	 * @public
	 * @method togglePasswordSection
	 * @description 切换密码修改区域的显示/隐藏状态
	 * @returns {void}
	 */
	public togglePasswordSection() {
		this.showPasswordSection.value = !this.showPasswordSection.value
		if (this.showPasswordSection.value) {
			this.resetPasswordForm()
		}
	}

	/**
	 * 重置密码表单
	 * @public
	 * @method resetPasswordForm
	 * @description 将密码修改表单重置为空状态
	 * @returns {void}
	 */
	public resetPasswordForm() {
		this.passwordForm.oldPassword = ''
		this.passwordForm.newPassword = ''
		this.passwordForm.confirmPassword = ''
		if (this.passwordFormRef.value) {
			this.passwordFormRef.value.clearValidate()
		}
	}

	/**
	 * 取消密码修改
	 * @public
	 * @method cancelPasswordChange
	 * @description 取消密码修改操作，隐藏密码修改区域并重置表单
	 * @returns {void}
	 */
	public cancelPasswordChange() {
		this.showPasswordSection.value = false
		this.resetPasswordForm()
	}

	/**
	 * 确认密码修改
	 * @public
	 * @method confirmPasswordChange
	 * @description 确认密码修改操作
	 * @returns {Promise<void>} 异步操作完成的Promise
	 */
	public async confirmPasswordChange() {
		if (!this.passwordFormRef.value) { return }

		try {
			await this.passwordFormRef.value.validate()
		} catch (error) {
			return
		}

		try {
			this.loadingMaskStore.showLoadingMask('正在修改密码...')
			this.isPasswordLoading.value = true
			try {
				const token = localStorage.getItem('token')
				if (!token) {
					ElMessage.error('请先登录')
					this.router.push('/login')
					return
				}

				const response = await changePassword(token, {
					oldPassword: this.passwordForm.oldPassword,
					newPassword: this.passwordForm.newPassword,
					confirmPassword: this.passwordForm.confirmPassword
				})

				if (response.code === 200) {
					ElMessage.success('密码修改成功')
					this.showPasswordSection.value = false
					this.resetPasswordForm()
				} else {
					ElMessage.error(response.message || '修改密码失败')
				}
			} catch (error: any) {
				ElMessage.error(`修改密码失败：${error.message}`)
				if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
					localStorage.removeItem('token')
					localStorage.removeItem('userInfo')
					this.router.push('/login')
				}
			} finally {
				this.isPasswordLoading.value = false
			}
		} catch (error) {
			console.error('修改密码失败：', error)
		} finally {
			this.loadingMaskStore.hideLoadingMask()
		}
	}

	/**
	 * 保存个人信息
	 * @public
	 * @method saveProfile
	 * @description 保存用户修改的个人信息到服务器
	 * @returns {Promise<void>} 异步操作完成的Promise
	 */
	public async saveProfile() {
		if (this.isLoading.value) {
			ElMessage.warning('系统正在加载中，请稍后重试')
			return
		}

		if (!this.formRef.value) {
			ElMessage.warning('表单未初始化，请稍后重试')
			return
		}

		try {
			await this.formRef.value.validate()
		} catch (error) {
			ElMessage.warning('请先完善表单信息')
			return
		}

		try {
			this.loadingMaskStore.showLoadingMask('正在保存个人信息...')
			this.isLoading.value = true
			try {
				const token = localStorage.getItem('token')
				if (!token) {
					ElMessage.error('请先登录')
					this.router.push('/login')
					return
				}

				const updateData = { ...this.formData }

				const response = await updateStudentInfo(token, updateData)

				if (response.code === 200) {
					ElMessage.success('个人信息更新成功')
					if (response.data && response.data.token) {
						localStorage.setItem('token', response.data.token)
					}
					this.originalData.value = { ...this.formData }
					this.formData.password = ''
					this.isEditing.value = false
				} else {
					ElMessage.error(response.message || '更新个人信息失败')
				}
			} catch (error: any) {
				ElMessage.error(`更新个人信息失败：${error.message}`)
				if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
					localStorage.removeItem('token')
					localStorage.removeItem('userInfo')
					this.router.push('/login')
				}
			} finally {
				this.isLoading.value = false
			}
		} catch (error) {
			console.error('保存个人信息失败：', error)
		} finally {
			this.loadingMaskStore.hideLoadingMask()
		}
	}

	/**
	 * 显示裁剪对话框
	 * @public
	 * @method showCropDialog
	 * @description 显示头像裁剪对话框
	 * @param {File} file - 用户选择的图片文件对象
	 * @returns {Promise<void>} 异步操作完成的Promise
	 */
	public async showCropDialog(file: File) {
		try {
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
					this.cropImage.value = img
					this.cropDialogVisible.value = true

					setTimeout(() => {
						this.initCrop()
					}, 500)
				}
				img.onerror = (error: any) => {
					console.error('图片加载失败:', error)
				}
				img.src = e.target?.result as string
			}
			reader.onerror = (error: any) => {
				console.error('文件读取失败:', error)
			}
			reader.readAsDataURL(file)
		} catch (error) {
			console.error('显示裁剪对话框异常:', error)
		}
	}

	/**
	 * 初始化裁剪
	 * @public
	 * @method initCrop
	 * @description 初始化头像裁剪功能
	 * @returns {void}
	 */
	public initCrop() {
		if (!this.cropCanvasRef.value || !this.cropImage.value || !this.cropWrapperRef.value) {
			console.error('初始化裁剪失败：缺少必要的引用')
			return
		}

		const canvas = this.cropCanvasRef.value
		const wrapper = this.cropWrapperRef.value
		const img = this.cropImage.value

		let wrapperWidth = wrapper.clientWidth
		const wrapperHeight = 300

		if (wrapperWidth === 0) {
			wrapperWidth = wrapper.offsetWidth || 320
		}

		canvas.width = wrapperWidth
		canvas.height = wrapperHeight
		canvas.style.width = `${wrapperWidth}px`
		canvas.style.height = `${wrapperHeight}px`

		const imgMinSide = Math.min(img.width, img.height)
		const cropSize = 300

		this.scale.value = cropSize / imgMinSide
		this.imageX.value = (wrapperWidth - img.width * this.scale.value) / 2
		this.imageY.value = (wrapperHeight - img.height * this.scale.value) / 2

		const cropBox = this.cropBoxRef.value
		if (cropBox) {
			cropBox.style.width = `${cropSize}px`
			cropBox.style.height = `${cropSize}px`
			cropBox.style.left = `${(wrapperWidth - cropSize) / 2}px`
			cropBox.style.top = `${(wrapperHeight - cropSize) / 2}px`

			const minSide = Math.min(img.width, img.height)
			this.minScale.value = cropSize / minSide
		} else {
			this.minScale.value = 0.1
		}

		this.drawCropCanvas()
		this.setupCropEvents()
	}

	/**
	 * 限制图片位置
	 * @public
	 * @method constrainImagePosition
	 * @description 确保图片始终覆盖裁剪框
	 * @returns {void}
	 */
	public constrainImagePosition() {
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
			cropSize = parseFloat(cropBox.style.width) || 250
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
	 * 绘制裁剪画布
	 * @public
	 * @method drawCropCanvas
	 * @description 绘制裁剪画布内容
	 * @returns {void}
	 */
	public drawCropCanvas() {
		if (!this.cropCanvasRef.value || !this.cropImage.value) {
			return
		}

		const canvas = this.cropCanvasRef.value
		const ctx = canvas.getContext('2d')
		const img = this.cropImage.value

		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
		ctx.fillRect(0, 0, canvas.width, canvas.height)

		const imgWidth = img.width * this.scale.value
		const imgHeight = img.height * this.scale.value

		ctx.save()
		ctx.globalCompositeOperation = 'source-over'
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
				cropSize = parseFloat(cropBox.style.width) || 250
				cropX = left
				cropY = top
			}

			ctx.globalCompositeOperation = 'destination-out'
			ctx.fillRect(cropX, cropY, cropSize, cropSize)
		}

		ctx.restore()
	}

	/**
	 * 设置裁剪事件
	 * @public
	 * @method setupCropEvents
	 * @description 设置裁剪相关的事件监听器
	 * @returns {void}
	 */
	public setupCropEvents() {
		if (!this.cropCanvasRef.value) { return }

		this.removeCropEvents()

		const canvas = this.cropCanvasRef.value

		this.mouseDownHandler = (e: any) => {
			const { target } = e
			if (target === canvas || target === this.cropWrapperRef.value ||
				(this.cropWrapperRef.value && this.cropWrapperRef.value.contains(target))) {
				if (this.cropBoxRef.value && this.cropBoxRef.value.contains(target)) {
					return
				}
				e.preventDefault()
				e.stopPropagation()
				this.isDragging.value = true
				this.dragStartX.value = e.clientX || e.touches?.[0]?.clientX || 0
				this.dragStartY.value = e.clientY || e.touches?.[0]?.clientY || 0
				this.dragStartImageX.value = this.imageX.value
				this.dragStartImageY.value = this.imageY.value
				canvas.style.cursor = 'grabbing'
			}
		}

		this.mouseMoveHandler = (e: any) => {
			if (this.isDragging.value) {
				e.preventDefault()
				const currentX = e.clientX || e.touches?.[0]?.clientX || 0
				const currentY = e.clientY || e.touches?.[0]?.clientY || 0
				const deltaX = currentX - this.dragStartX.value
				const deltaY = currentY - this.dragStartY.value
				this.imageX.value = this.dragStartImageX.value + deltaX
				this.imageY.value = this.dragStartImageY.value + deltaY
				this.constrainImagePosition()
				this.drawCropCanvas()
			}
		}

		this.mouseUpHandler = () => {
			if (this.isDragging.value) {
				this.isDragging.value = false
				if (canvas) {
					canvas.style.cursor = 'move'
				}
			}
		}

		this.wheelHandler = (e: any) => {
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

		const getDistance = (touch1: Touch, touch2: Touch) => {
			const dx = touch2.clientX - touch1.clientX
			const dy = touch2.clientY - touch1.clientY
			return Math.sqrt(dx * dx + dy * dy)
		}

		const getCenter = (touch1: Touch, touch2: Touch) => ({
			x: (touch1.clientX + touch2.clientX) / 2,
			y: (touch1.clientY + touch2.clientY) / 2
		})

		this.touchStartHandler = (e: any) => {
			const { target } = e
			if (target === canvas || target === this.cropWrapperRef.value ||
				(this.cropWrapperRef.value && this.cropWrapperRef.value.contains(target))) {
				if (this.cropBoxRef.value && this.cropBoxRef.value.contains(target)) {
					return
				}

				if (e.touches.length === 2) {
					e.preventDefault()
					e.stopPropagation()
					this.isPinching.value = true
					this.isDragging.value = false

					const touch1 = e.touches[0]
					const touch2 = e.touches[1]

					this.initialPinchDistance.value = getDistance(touch1, touch2)
					this.initialPinchScale.value = this.scale.value

					const center = getCenter(touch1, touch2)
					const canvasRect = canvas.getBoundingClientRect()
					this.initialPinchCenterX.value = center.x - canvasRect.left
					this.initialPinchCenterY.value = center.y - canvasRect.top
				} else if (e.touches.length === 1) {
					this.mouseDownHandler(e)
				}
			}
		}

		this.touchMoveHandler = (e: any) => {
			if (this.isPinching.value && e.touches.length === 2) {
				e.preventDefault()
				e.stopPropagation()

				const touch1 = e.touches[0]
				const touch2 = e.touches[1]
				const currentDistance = getDistance(touch1, touch2)
				const distanceRatio = currentDistance / this.initialPinchDistance.value
				const newScale = Math.max(this.minScale.value, Math.min(5, this.initialPinchScale.value * distanceRatio))

				const center = getCenter(touch1, touch2)
				const canvasRect = canvas.getBoundingClientRect()
				const currentCenterX = center.x - canvasRect.left
				const currentCenterY = center.y - canvasRect.top

				const scaleRatio = newScale / this.scale.value
				this.imageX.value = currentCenterX - (currentCenterX - this.imageX.value) * scaleRatio
				this.imageY.value = currentCenterY - (currentCenterY - this.imageY.value) * scaleRatio

				this.scale.value = newScale
				this.constrainImagePosition()
				this.drawCropCanvas()
			} else if (this.isDragging.value && e.touches.length === 1) {
				this.mouseMoveHandler(e)
			} else if (e.touches.length === 1 && !this.isPinching.value) {
				this.mouseDownHandler(e)
			}
		}

		this.touchEndHandler = (e: any) => {
			if (this.isPinching.value) {
				this.isPinching.value = false
				this.initialPinchDistance.value = 0
			}

			if (e.touches.length === 0) {
				this.mouseUpHandler()
			} else if (e.touches.length === 1) {
				this.isDragging.value = false
				const touch = e.touches[0]
				this.dragStartX.value = touch.clientX
				this.dragStartY.value = touch.clientY
				this.dragStartImageX.value = this.imageX.value
				this.dragStartImageY.value = this.imageY.value
			}
		}

		canvas.addEventListener('mousedown', this.mouseDownHandler)
		canvas.addEventListener('touchstart', this.touchStartHandler, { passive: false })
		document.addEventListener('mousemove', this.mouseMoveHandler)
		document.addEventListener('touchmove', this.touchMoveHandler, { passive: false })
		document.addEventListener('mouseup', this.mouseUpHandler)
		document.addEventListener('touchend', this.touchEndHandler)
		canvas.addEventListener('wheel', this.wheelHandler)

		canvas.style.cursor = 'move'
	}

	/**
	 * 移除裁剪事件
	 * @public
	 * @method removeCropEvents
	 * @description 移除所有与头像裁剪相关的事件监听器
	 * @returns {void}
	 */
	public removeCropEvents() {
		if (!this.cropCanvasRef.value) { return }

		const canvas = this.cropCanvasRef.value

		if (this.mouseDownHandler) {
			canvas.removeEventListener('mousedown', this.mouseDownHandler)
		}
		if (this.touchStartHandler) {
			canvas.removeEventListener('touchstart', this.touchStartHandler)
		}
		if (this.mouseMoveHandler) {
			document.removeEventListener('mousemove', this.mouseMoveHandler)
		}
		if (this.touchMoveHandler) {
			document.removeEventListener('touchmove', this.touchMoveHandler)
		}
		if (this.mouseUpHandler) {
			document.removeEventListener('mouseup', this.mouseUpHandler)
		}
		if (this.touchEndHandler) {
			document.removeEventListener('touchend', this.touchEndHandler)
		}
		if (this.wheelHandler) {
			canvas.removeEventListener('wheel', this.wheelHandler)
		}
	}

	/**
	 * 放大
	 * @public
	 * @method zoomIn
	 * @description 将图片放大0.1倍
	 * @returns {void}
	 */
	public zoomIn() {
		const oldScale = this.scale.value
		const newScale = Math.min(5, this.scale.value + 0.1)

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
	 * 缩小
	 * @public
	 * @method zoomOut
	 * @description 将图片缩小0.1倍
	 * @returns {void}
	 */
	public zoomOut() {
		const oldScale = this.scale.value
		const newScale = Math.max(this.minScale.value, this.scale.value - 0.1)

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
	 * 重置裁剪
	 * @public
	 * @method resetCrop
	 * @description 重置裁剪状态
	 * @returns {void}
	 */
	public resetCrop() {
		if (!this.cropImage.value || !this.cropWrapperRef.value) { return }
		this.initCrop()
	}

	/**
	 * 取消裁剪
	 * @public
	 * @method cancelCrop
	 * @description 取消头像裁剪操作
	 * @returns {void}
	 */
	public cancelCrop() {
		this.removeCropEvents()

		const dialogWrapper = document.querySelector('.crop-dialog-overlay')
		if (dialogWrapper) {
			dialogWrapper.style.display = 'none'
			dialogWrapper.style.visibility = 'hidden'
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
			this.isPinching.value = false
			this.initialPinchDistance.value = 0
		}, 0)
	}

	/**
	 * 确认裁剪
	 * @public
	 * @method confirmCrop
	 * @description 确认头像裁剪操作
	 * @returns {Promise<void>} 异步操作完成的Promise
	 */
	public async confirmCrop() {
		if (!this.cropCanvasRef.value || !this.cropImage.value || !this.cropBoxRef.value) { return }

		this.isCropping.value = true
		try {
			const canvas = this.cropCanvasRef.value
			const cropBox = this.cropBoxRef.value
			const img = this.cropImage.value

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

			cropCanvas.toBlob(async blob => {
				if (!blob) {
					ElMessage.error('裁剪失败')
					return
				}

				const croppedFile = new File([blob], this.originalImageFile.value?.name || 'avatar.jpg', {
					type: this.originalImageFile.value?.type || 'image/jpeg',
					lastModified: Date.now()
				})

				this.cropDialogVisible.value = false

				try {
					ElMessage.info('正在处理头像, 请稍候...')
					const compressedFile = await ProfilePageUtils.compressImage(croppedFile)

					const reader = new FileReader()
					reader.onload = e => {
						this.avatarUrl.value = e.target?.result as string
					}
					reader.readAsDataURL(compressedFile)

					await this.uploadAvatarFile(compressedFile)
				} catch (error: any) {
					ElMessage.error(`图片处理失败：${error.message}`)
				} finally {
					this.isCropping.value = false
					this.cropImage.value = null
					this.originalImageFile.value = null
				}
			}, this.originalImageFile.value?.type || 'image/jpeg', 0.9)
		} catch (error: any) {
			this.isCropping.value = false
			ElMessage.error(`裁剪失败：${error.message}`)
		}
	}

	/**
	 * 上传头像文件
	 * @public
	 * @method uploadAvatarFile
	 * @description 上传头像文件到服务器
	 * @param {File} file - 头像文件
	 * @returns {Promise<void>} 异步操作完成的Promise
	 */
	public async uploadAvatarFile(file: File) {
		if (!this.studentInfoId.value) {
			ElMessage.error('学生信息不存在')
			return
		}

		this.isUploading.value = true
		try {
			const token = localStorage.getItem('token')
			if (!token) {
				ElMessage.error('请先登录')
				this.router.push('/login')
				return
			}

			const formData = new FormData()
			formData.append('file', file)

			const response = await uploadAvatar(token, this.studentInfoId.value, file)

			if (response.code === 200) {
				ElMessage.success('头像上传成功')
			} else {
				ElMessage.error(response.message || '头像上传失败')
			}
		} catch (error: any) {
			ElMessage.error(`头像上传失败：${error.message}`)
		} finally {
			this.isUploading.value = false
		}
	}
}
