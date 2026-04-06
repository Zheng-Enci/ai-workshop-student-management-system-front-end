<script setup>
/**
 * 个人信息页面组件(桌面端)
 * 
 * @description 提供用户个人信息的查看、编辑、密码修改和头像上传功能
 * @component ProfilePageDesktop
 */
// Fix 1: Import order - Icons first, then Element Plus core
import { ArrowLeft, User, Edit, Lock, Calendar } from '@element-plus/icons-vue'
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
import '@/views/ProfilePage/css/desktop/profile-page-desktop-background.css'
import '@/views/ProfilePage/css/desktop/profile-page-desktop-header.css'
import '@/views/ProfilePage/css/desktop/profile-page-desktop-avatar.css'
import '@/views/ProfilePage/css/desktop/profile-page-desktop-user-info.css'
import '@/views/ProfilePage/css/desktop/profile-page-desktop-form.css'
import '@/views/ProfilePage/css/desktop/profile-page-desktop-security.css'
import ProfilePageChangePasswordDesktopForm from '@/views/ProfilePage/forms/desktop/ProfilePageChangePasswordDesktopForm.vue'
import ProfilePageUploadAvatarDesktopForm from '@/views/ProfilePage/forms/desktop/ProfilePageUploadAvatarDesktopForm.vue'
import {
	getStudentProfile,
	updateStudentInfo,
	changePassword,
	getStudentDatabaseTableId
} from '@/api/student'
import { useThemeStore } from '@/stores/theme'
import { useLoadingMaskStore } from '@/stores/loading'
import LoadingMask from '@/components/LoadingMask.vue'

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
/**
 * 文件输入框引用
 * @type {Ref<HTMLInputElement|null>}
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
 * 密码修改对话框显示状态
 * @type {Ref<boolean>}
 * @description 控制密码修改对话框的显示/隐藏
 */
const showPasswordDialog = ref(false)
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

/**
 * 重置表单到原始数据
 * @function resetForm
 * @description 将表单数据恢复到修改前的状态,并清除表单验证
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
 * 重置密码表单为空状态
 * @function resetPasswordForm
 * @description 清空密码修改表单的所有字段并清除验证
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
 * 返回导航页面
 * @function goBack
 * @description 跳转到导航页面
 * @returns {void}
 */
const goBack = () => {
	router.push('/navigation')
}

/**
 * 切换明暗主题
 * @function toggleTheme
 * @description 在亮色模式和暗色模式之间切换
 * @returns {void}
 */
const toggleTheme = () => {
	themeStore.toggleTheme()
}

/**
 * 从服务器加载用户个人资料数据
 * @function loadProfile
 * @description 获取用户个人信息、考勤次数和学生ID
 * 流程:
 * 1. 验证token是否存在
 * 2. 并行请求个人信息、考勤次数和学生ID
 * 3. 将数据绑定到响应式变量
 * @async
 * @returns {Promise<void>}
 */
const loadProfile = async () => {
	try {
		loadingMaskStore.showLoadingMask('正在加载个人信息...')
		isLoading.value = true

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
		loadingMaskStore.hideLoadingMask()
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
 * 打开密码修改对话框
 * @function openPasswordDialog
 * @description 打开密码修改对话框并重置表单
 * @returns {void}
 */
const openPasswordDialog = () => {
	showPasswordDialog.value = true
	if (passwordFormRef.value) {
		passwordFormRef.value.clearValidate()
	}
}

/**
 * 关闭密码修改对话框
 * @function closePasswordDialog
 * @description 关闭密码修改对话框并重置表单
 * @returns {void}
 */
const closePasswordDialog = () => {
	showPasswordDialog.value = false
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

	try {
		// 显示全局加载蒙版
		loadingMaskStore.showLoadingMask('正在修改密码...')
		isPasswordLoading.value = true

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
		// 隐藏全局加载蒙版
		loadingMaskStore.hideLoadingMask()
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

	try {
		// 显示全局加载蒙版
		loadingMaskStore.showLoadingMask('正在保存个人信息...')
		isLoading.value = true

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
		// 隐藏全局加载蒙版
		loadingMaskStore.hideLoadingMask()
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

// Fix 8: Mounted hook (last in script setup)
onMounted(() => {
	loadProfile()
})
</script>

<template>
	<!-- 个人信息页面主容器 -->
	<div class="profile-page-desktop-container">
		<!-- 全局加载蒙版 -->
		<LoadingMask/>
		<!-- 背景装饰效果 -->
		<div class="profile-page-desktop-background-effects">
			<div class="profile-page-desktop-gradient-orb profile-page-desktop-gradient-orb-1"/>
			<div class="profile-page-desktop-gradient-orb profile-page-desktop-gradient-orb-2"/>
			<div class="profile-page-desktop-gradient-orb profile-page-desktop-gradient-orb-3"/>
		</div>

		<div class="profile-page-desktop-content-wrapper">
			<!-- 页面头部 -->
			<div class="profile-page-desktop-page-header">
				<el-button
					class="profile-page-desktop-back-btn"
					type="primary"
					:icon="ArrowLeft"
					circle
					@click="goBack"/>
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊"
					class="profile-page-desktop-logo"
					title="切换主题模式"
					@click="toggleTheme"/>
				<div class="profile-page-desktop-title-section">
					<h1>个人信息</h1>
					<p>Personal Profile</p>
				</div>
			</div>

			<!-- 主内容区域 -->
			<div class="profile-page-desktop-main-content">
				<!-- 个人信息卡片 -->
				<div class="profile-page-desktop-profile-card">
					<!-- 加载遮罩 -->
					<div v-if="isLoading" class="profile-page-desktop-loading-overlay">
						<div class="profile-page-desktop-loading-spinner"/>
					</div>

					<!-- 用户信息头部 -->
					<div class="profile-page-desktop-profile-header">
						<div class="profile-page-desktop-user-info-section">
							<!-- 头像上传组件 -->
							<ProfilePageUploadAvatarDesktopForm
								:student-info-id="studentInfoId"
							/>
							<!-- 用户详细信息 -->
							<div class="profile-page-desktop-user-details">
								<h2>{{ formData.name || '用户' }}</h2>
								<p class="profile-page-desktop-student-id">{{ formData.studentId || '学号' }}</p>
								<div class="profile-page-desktop-user-stats">
									<div v-if="attendanceCount !== null" class="profile-page-desktop-stat-item">
										<el-icon class="profile-page-desktop-stat-icon">
											<calendar/>
										</el-icon>
										<span class="profile-page-desktop-stat-text">已签到 {{ attendanceCount }} 次</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div v-if="!showPasswordSection" class="profile-page-desktop-form-section">
						<div class="profile-page-desktop-section-header">
							<div class="profile-page-desktop-section-title-wrapper">
								<div>
									<h3>基本信息</h3>
									<p>管理您的个人资料信息</p>
								</div>
							</div>
							<div class="profile-page-desktop-security-badge">
								<el-icon class="profile-page-desktop-badge-icon">
									<lock/>
								</el-icon>
								<span>安全保护</span>
							</div>
							<div class="profile-page-desktop-form-actions">
								<el-button
									type="primary"
									:icon="Edit"
									:disabled="isLoading"
									class="profile-page-desktop-edit-btn"
									@click="toggleEditMode"
								>
									{{ isEditing ? '取消' : '编辑' }}
								</el-button>
							</div>
						</div>

						<el-form
							ref="formRef"
							:model="formData"
							:rules="rules"
							profile-page-desktop-form
						>
							<div class="profile-page-desktop-form-grid">
								<div class="profile-page-desktop-form-group">
									<div class="profile-page-desktop-form-item">
										<label class="profile-page-desktop-form-label">姓名</label>
										<el-form-item prop="name">
											<el-input
												v-model="formData.name"
												:disabled="!isEditing"
												placeholder="请输入姓名"
												maxlength="20"
												class="profile-page-desktop-form-input"
											/>
										</el-form-item>
									</div>

									<div class="profile-page-desktop-form-item">
										<label class="profile-page-desktop-form-label">学号</label>
										<el-form-item prop="studentId">
											<el-input
												v-model="formData.studentId"
												:disabled="!isEditing"
												placeholder="请输入学号"
												maxlength="10"
												class="profile-page-desktop-form-input"
											/>
										</el-form-item>
									</div>
								</div>

								<div class="profile-page-desktop-form-group">
									<div class="profile-page-desktop-form-item">
										<label class="profile-page-desktop-form-label">性别</label>
										<el-form-item prop="gender">
											<el-select
												v-model="formData.gender"
												:disabled="!isEditing"
												placeholder="请选择性别"
												class="profile-page-desktop-form-input"
											>
												<el-option label="男" value="男"/>
												<el-option label="女" value="女"/>
											</el-select>
										</el-form-item>
									</div>

									<div class="profile-page-desktop-form-item">
										<label class="profile-page-desktop-form-label">手机号</label>
										<el-form-item prop="phoneNumber">
											<el-input
												v-model="formData.phoneNumber"
												:disabled="!isEditing"
												placeholder="请输入手机号"
												maxlength="11"
												class="profile-page-desktop-form-input"
											/>
										</el-form-item>
									</div>
								</div>

								<div class="profile-page-desktop-form-group">
									<div class="profile-page-desktop-form-item">
										<label class="profile-page-desktop-form-label">学院</label>
										<el-form-item prop="college">
											<el-input
												v-model="formData.college"
												:disabled="!isEditing"
												placeholder="请输入学院"
												maxlength="50"
												class="profile-page-desktop-form-input"
											/>
										</el-form-item>
									</div>

									<div class="profile-page-desktop-form-item">
										<label class="profile-page-desktop-form-label">专业</label>
										<el-form-item prop="major">
											<el-input
												v-model="formData.major"
												:disabled="!isEditing"
												placeholder="请输入专业"
												maxlength="50"
												class="profile-page-desktop-form-input"
											/>
										</el-form-item>
									</div>
								</div>

								<div class="profile-page-desktop-form-group">
									<div class="profile-page-desktop-form-item">
										<label class="profile-page-desktop-form-label">年级</label>
										<el-form-item prop="grade">
											<el-select
												v-model="formData.grade"
												:disabled="!isEditing"
												placeholder="请选择年级"
												class="profile-page-desktop-form-input"
											>
												<el-option label="1年级" :value="1"/>
												<el-option label="2年级" :value="2"/>
												<el-option label="3年级" :value="3"/>
												<el-option label="4年级" :value="4"/>
												<el-option label="5年级" :value="5"/>
											</el-select>
										</el-form-item>
									</div>

									<div class="profile-page-desktop-form-item">
										<label class="profile-page-desktop-form-label">班级</label>
										<el-form-item prop="classNum">
											<el-input-number
												v-model="formData.classNum"
												:disabled="!isEditing"
												:min="1"
												:max="100"
												placeholder="请输入班级"
												class="profile-page-desktop-form-input"
											/>
										</el-form-item>
									</div>
								</div>

								<div class="profile-page-desktop-form-group">
									<div class="profile-page-desktop-form-item">
										<label class="profile-page-desktop-form-label">
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
												class="profile-page-desktop-form-input security-input"
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

							<div v-if="isEditing" class="profile-page-desktop-form-actions">
								<el-button :disabled="isLoading" class="profile-page-desktop-reset-btn" @click.prevent="resetForm">
									重置
								</el-button>
								<el-button
									type="primary"
									:loading="isLoading"
									:disabled="isLoading"
									class="profile-page-desktop-save-btn"
									@click="saveProfile">
									保存修改
								</el-button>
							</div>
						</el-form>
					</div>

					<div class="password-section">
						<div class="profile-page-desktop-section-header">
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
								@click="openPasswordDialog">
								{{ showPasswordDialog ? '返回基本信息' : '修改密码' }}
							</el-button>
						</div>
					</div>

					<!-- 密码修改对话框 -->
					<el-dialog
						v-model="showPasswordDialog"
						v-if="showPasswordDialog"
						title="修改密码"
						width="700px"
						:close-on-click-modal="false"
						:close-on-press-escape="false"
						class="profile-page-change-password-dialog"
						@close="closePasswordDialog"
					>
						<ProfilePageChangePasswordDesktopForm v-model="showPasswordDialog" @success="closePasswordDialog" />
					</el-dialog>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
:deep(.profile-page-desktop-back-btn.el-button--primary.is-circle) {
	width: 48px !important;
	height: 48px !important;
	padding: 0 !important;
	border-radius: 50% !important;
}
</style>
