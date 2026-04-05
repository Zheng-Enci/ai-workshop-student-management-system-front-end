<script setup>
/**
 * 用户注册页面组件
 *
 * @description AI坊学生管理系统新用户注册核心页面，具备以下核心功能：
 * 1. 学生信息表单填写（姓名、学号、性别、手机号、学院、专业、年级、班级）
 * 2. 完善的表单校验规则（格式、长度、必填、自定义验证）
 * 3. 密码设置与确认（一致性校验）
 * 4. 注册成功后自动完成登录并跳转至导航页
 * 5. 已登录状态自动跳转（防止重复注册）
 * 6. 支持暗黑/亮色主题切换适配
 * 7. 提供返回首页、跳转登录页的快捷入口
 * @component RegisterPage
 * @author 前端开发组
 * @date 2026-01
 * @version 1.0.0
 */

// ===================== 第三方依赖导入区 =====================
// Element Plus 核心组件：表单、表单项、输入框、按钮、消息提示、图标、下拉选择、下拉选项
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage, ElIcon, ElSelect, ElOption } from 'element-plus'
// Vue3 核心API：响应式变量、组件挂载生命周期
import { ref, onMounted } from 'vue'
// Element Plus 基础样式（按需引入，减小打包体积）
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-select.css'
import 'element-plus/theme-chalk/el-option.css'
// Element Plus 图标组件：用户、锁、手机、学校、收藏（学号）、房子（首页）
import { User, Lock, Phone, School, Collection, House } from '@element-plus/icons-vue'
// Vue Router 路由跳转
import { useRouter } from 'vue-router'

// ===================== 业务模块导入区 =====================
// 学生相关API：注册、登录
import { register, login } from '@/api/student'
// 学生API封装类：获取学生数据库主键ID
import StudentApi from '@/api/StudentApi'
// 状态管理：主题（暗黑/亮色）
import { useThemeStore } from '@/stores/theme'
// 状态管理：用户信息（登录态存储）
import { useUserStore } from '@/stores/user'

// ===================== 全局实例初始化 =====================
// 路由实例：用于页面跳转
const router = useRouter()
// 用户信息仓库实例：存储登录态、用户信息
const userStore = useUserStore()
// 主题仓库实例：管理暗黑/亮色主题切换
const themeStore = useThemeStore()
// 解构主题切换方法
const { toggleTheme } = themeStore

// ===================== 静态数据定义 =====================
/**
 * 学院下拉选项列表（静态数据）
 * @type {Array<string>}
 */
const collegeOptions = [
	'融新学院',
	'机械电气与信息工程学院',
	'建筑科学与土木工程学院',
	'人工智能学院',
	'商 学 院',
	'博雅教育与艺术传媒学院',
	'外国语学院',
	'国 学 院',
	'国际教育学院',
	'继续教育学院'
]

// ===================== 响应式变量定义区 =====================
/**
 * 注册表单数据模型
 * @type {Ref<Object>}
 * @property {string} name - 学生姓名
 * @property {string} studentId - 学号（10位数字，20-30开头）
 * @property {string} gender - 性别（男/女）
 * @property {string} phoneNumber - 手机号（11位，13-9开头）
 * @property {string} college - 学院（下拉选择）
 * @property {string} major - 专业（手动输入）
 * @property {string} grade - 年级（1-5）
 * @property {number|null} classNum - 班级（1-100的数字）
 * @property {string} password - 密码（6-16位）
 * @property {string} confirmPassword - 确认密码（与密码一致）
 */
const form = ref({
	name: '',
	studentId: '',
	gender: '',
	phoneNumber: '',
	college: '',
	major: '',
	grade: '',
	classNum: null,
	password: '',
	confirmPassword: '',
	invitationCode: ''
})

/**
 * 表单引用实例（用于表单校验）
 * @type {Ref<ElForm | null>}
 */
const formRef = ref(null)

/**
 * 表单校验规则配置
 * @type {Object}
 * @description 包含必填、格式、长度、自定义验证规则，触发方式为blur/change
 */
const rules = {
	// 姓名校验：必填
	name: [
		{ required: true, message: '请输入姓名', trigger: 'blur' }
	],
	// 学号校验：必填 + 格式（10位数字，20-30开头）
	studentId: [
		{ required: true, message: '请输入学号', trigger: 'blur' },
		{
			pattern: /^(20|21|22|23|24|25|26|27|28|29|30)\d{8}$/,
			message: '学号必须为10位数字，且以20-30开头',
			trigger: 'blur'
		}
	],
	// 性别校验：必填
	gender: [
		{ required: true, message: '请选择性别', trigger: 'change' }
	],
	// 手机号校验：必填 + 格式（11位，13-9开头）
	phoneNumber: [
		{ required: true, message: '请输入手机号', trigger: 'blur' },
		{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
	],
	// 学院校验：必填
	college: [
		{ required: true, message: '请选择学院', trigger: 'change' }
	],
	// 专业校验：必填
	major: [
		{ required: true, message: '请输入专业', trigger: 'blur' }
	],
	// 年级校验：必填 + 自定义验证（1-5之间）
	grade: [
		{ required: true, message: '请选择年级', trigger: 'change' },
		{
			validator: (rule, value, callback) => {
				if (!value) {
					callback(new Error('请选择年级'))
				} else if (!['1', '2', '3', '4', '5'].includes(value)) {
					callback(new Error('年级必须在 1-5 之间'))
				} else {
					callback()
				}
			},
			trigger: 'change'
		}
	],
	// 班级校验：必填 + 数字范围（1-100）
	classNum: [
		{ required: true, message: '请输入班级', trigger: 'blur' },
		{ type: 'number', min: 1, max: 100, message: '班级必须在 1-100 之间', trigger: 'blur' }
	],
	// 密码校验：必填 + 长度（6-16位）
	password: [
		{ required: true, message: '请输入密码', trigger: 'blur' },
		{ min: 6, message: '密码长度至少 6 位', trigger: 'blur' },
		{ max: 16, message: '密码长度不能超过 16 位', trigger: 'blur' }
	],
	// 确认密码校验：必填 + 自定义验证（与密码一致）
	confirmPassword: [
		{ required: true, message: '请确认密码', trigger: 'blur' },
		{
			validator: (rule, value, callback) => {
				if (value !== form.value.password) {
					callback(new Error('两次输入的密码不一致'))
				} else {
					callback()
				}
			},
			trigger: 'blur'
		}
	],
	// 邀请码校验：必填 + UUID格式
	invitationCode: [
		{ required: true, message: '请输入邀请码', trigger: 'blur' },
		{
			pattern: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
			message: '请输入正确的邀请码格式',
			trigger: 'blur'
		}
	]
}

/**
 * 注册按钮加载状态（防止重复提交）
 * @type {Ref<boolean>}
 */
const isLoading = ref(false)

// ===================== 核心业务逻辑区 =====================
/**
 * 处理注册提交逻辑
 * @function handleRegister
 * @description 1. 表单校验 → 2. 提交注册数据 → 3. 自动登录 → 4. 存储用户信息 → 5. 跳转导航页
 * @async
 * @returns {Promise<void>}
 */
const handleRegister = async () => {
	// 表单实例不存在时直接返回（容错）
	if (!formRef.value) { return }

	// 第一步：表单校验（同步校验）
	try {
		await formRef.value.validate()
	} catch (error) {
		// 校验失败时终止流程
		return
	}

	// 第二步：提交注册请求（开启加载状态）
	isLoading.value = true
	try {
		// 组装注册数据（转换年级/班级为数字类型）
		const registerData = {
			...form.value,
			grade: form.value.grade ? Number(form.value.grade) : null,
			classNum: form.value.classNum ? Number(form.value.classNum) : null
		}
		// 调用注册API
		await register(registerData)
		// 注册成功提示
		ElMessage.success('注册成功！正在为您登录...')

		// 第三步：自动登录（使用注册的学号/密码）
		const loginData = {
			studentId: form.value.studentId,
			password: form.value.password
		}
		// 调用登录API
		const response = await login(loginData)

		// 第四步：获取学生数据库主键ID（关联用户信息）
		const studentDbIdResponse = await StudentApi.getStudentDatabaseTableId(response.data.token)
		const studentDbId = studentDbIdResponse.data

		// 第五步：组装用户信息并存储到状态管理
		const userInfo = {
			...response.data,
			studentId: form.value.studentId,
			studentDatabaseTableId: studentDbId
		}
		userStore.setUserInfo(userInfo, response.data.token)

		// 第六步：跳转到导航主页面
		router.push('/navigation')
	} catch (error) {
		// 异常处理：提示错误信息
		ElMessage.error(error.message || '注册失败，请检查您的信息')
	} finally {
		// 最终：关闭加载状态（无论成功/失败）
		isLoading.value = false
	}
}

/**
 * 跳转至首页
 * @function goToHome
 * @description 点击首页按钮时触发，返回系统首页
 */
const goToHome = () => {
	router.push('/')
}

// ===================== 生命周期钩子 =====================
/**
 * 组件挂载完成钩子
 * @description 1. 检测本地存储的token → 2. 已登录状态自动跳转至导航页（防止重复注册）
 */
onMounted(() => {
	// 从本地存储获取token（登录态标识）
	const token = localStorage.getItem('token')
	// 存在token说明已登录，直接跳转导航页
	if (token) {
		router.push('/navigation')
	}
})
</script>

<template>
	<!-- 注册页面根容器 -->
	<div class="register-container">
		<!-- 背景装饰效果（渐变球体） -->
		<div class="background-effects">
			<div class="gradient-orb orb-1"/>
			<div class="gradient-orb orb-2"/>
			<div class="gradient-orb orb-3"/>
		</div>

		<!-- 返回首页按钮（圆形悬浮按钮） -->
		<el-button
			class="home-btn"
			type="primary"
			:icon="House"
			circle
			@click="goToHome"/>

		<!-- 注册表单核心内容区 -->
		<div class="register-content">
			<!-- 注册卡片容器（带圆角/阴影/半透明） -->
			<div class="register-card">
				<!-- 卡片头部（logo+系统名称） -->
				<div class="card-header">
					<!-- 系统logo（点击切换主题） -->
					<img
						src="@/assets/AiWorkShop_icon.png"
						alt="AI坊学生管理系统"
						class="logo"
						title="切换主题模式"
						@click="toggleTheme"/>
					<h1>AI坊学生管理系统</h1>
					<p class="subtitle">人工智能创作坊</p>
				</div>

				<!-- 注册表单（绑定模型/规则/引用） -->
				<el-form
					ref="formRef"
					:model="form"
					:rules="rules"
					label-width="0px"
					class="register-form">
					<!-- 第一行：姓名 + 学号 -->
					<div class="form-row">
						<!-- 姓名字段 -->
						<el-form-item prop="name" class="form-item-half form-item">
							<div class="input-group">
								<div class="input-icon">
									<el-icon>
										<user/>
									</el-icon>
								</div>
								<el-input
									v-model="form.name"
									placeholder="请输入姓名"
									class="custom-input"
									size="large"
								/>
							</div>
						</el-form-item>

						<!-- 学号字段 -->
						<el-form-item prop="studentId" class="form-item-half form-item">
							<div class="input-group">
								<div class="input-icon">
									<el-icon>
										<collection/>
									</el-icon>
								</div>
								<el-input
									v-model="form.studentId"
									placeholder="请输入学号"
									class="custom-input"
									size="large"
								/>
							</div>
						</el-form-item>
					</div>

					<!-- 第二行：性别 + 手机号 -->
					<div class="form-row">
						<!-- 性别字段（下拉选择） -->
						<el-form-item prop="gender" class="form-item-half form-item">
							<div class="input-group">
								<div class="input-icon">
									<el-icon>
										<user/>
									</el-icon>
								</div>
								<el-select
									v-model="form.gender"
									placeholder="请选择性别"
									class="custom-select"
									size="large"
									popper-class="gender-select-dropdown"
								>
									<el-option label="男" value="男"/>
									<el-option label="女" value="女"/>
								</el-select>
							</div>
						</el-form-item>

						<!-- 手机号字段 -->
						<el-form-item prop="phoneNumber" class="form-item-half form-item">
							<div class="input-group">
								<div class="input-icon">
									<el-icon>
										<phone/>
									</el-icon>
								</div>
								<el-input
									v-model="form.phoneNumber"
									placeholder="请输入手机号"
									class="custom-input"
									size="large"
								/>
							</div>
						</el-form-item>
					</div>

					<!-- 第三行：学院 + 专业 -->
					<div class="form-row">
						<!-- 学院字段（下拉选择） -->
						<el-form-item prop="college" class="form-item-half form-item">
							<div class="input-group">
								<div class="input-icon">
									<el-icon>
										<school/>
									</el-icon>
								</div>
								<el-select
									v-model="form.college"
									placeholder="请选择学院"
									class="custom-select"
									size="large"
									popper-class="college-select-dropdown"
								>
									<el-option
										v-for="college in collegeOptions"
										:key="college"
										:label="college"
										:value="college"
									/>
								</el-select>
							</div>
						</el-form-item>

						<!-- 专业字段 -->
						<el-form-item prop="major" class="form-item-half form-item">
							<div class="input-group">
								<div class="input-icon">
									<el-icon>
										<school/>
									</el-icon>
								</div>
								<el-input
									v-model="form.major"
									placeholder="请输入专业"
									class="custom-input"
									size="large"
								/>
							</div>
						</el-form-item>
					</div>

					<!-- 第四行：年级 + 班级 -->
					<div class="form-row">
						<!-- 年级字段（下拉选择） -->
						<el-form-item prop="grade" class="form-item-half form-item">
							<div class="input-group">
								<div class="input-icon">
									<el-icon>
										<school/>
									</el-icon>
								</div>
								<el-select
									v-model="form.grade"
									placeholder="请选择年级"
									class="custom-select"
									size="large"
									popper-class="grade-select-dropdown"
								>
									<el-option label="1年级" value="1"/>
									<el-option label="2年级" value="2"/>
									<el-option label="3年级" value="3"/>
									<el-option label="4年级" value="4"/>
									<el-option label="5年级" value="5"/>
								</el-select>
							</div>
						</el-form-item>

						<!-- 班级字段（数字输入） -->
						<el-form-item prop="classNum" class="form-item-half form-item">
							<div class="input-group">
								<div class="input-icon">
									<el-icon>
										<school/>
									</el-icon>
								</div>
								<el-input
									v-model.number="form.classNum"
									placeholder="请输入班级"
									class="custom-input"
									size="large"
									type="number"
									:min="1"
									:max="100"
								/>
							</div>
						</el-form-item>
					</div>

					<!-- 密码字段 -->
					<el-form-item prop="password" class="form-item password-form-item">
						<div class="input-group">
							<div class="input-icon">
								<el-icon>
									<lock/>
								</el-icon>
							</div>
							<el-input
								v-model="form.password"
								type="password"
								placeholder="请输入密码"
								class="custom-input"
								size="large"
								show-password
							/>
						</div>
					</el-form-item>

					<!-- 确认密码字段 -->
					<el-form-item prop="confirmPassword" class="form-item password-form-item">
						<div class="input-group">
							<div class="input-icon">
								<el-icon>
									<lock/>
								</el-icon>
							</div>
							<el-input
								v-model="form.confirmPassword"
								type="password"
								placeholder="请确认密码"
								class="custom-input"
								size="large"
								show-password
							/>
						</div>
					</el-form-item>

					<!-- 邀请码字段 -->
					<el-form-item prop="invitationCode" class="form-item last-input-form-item">
						<div class="input-group">
							<div class="input-icon">
								<el-icon>
									<collection/>
								</el-icon>
							</div>
							<el-input
								v-model="form.invitationCode"
								placeholder="请输入邀请码"
								class="custom-input"
								size="large"
							/>
						</div>
					</el-form-item>

					<!-- 注册按钮（带加载状态/禁用） -->
					<el-button
						type="primary"
						class="register-button"
						size="large"
						:loading="isLoading"
						:disabled="isLoading"
						@click="handleRegister"
					>
						{{ isLoading ? '注册中...' : '注册' }}
					</el-button>
				</el-form>

				<!-- 卡片底部（登录链接） -->
				<div class="card-footer">
					<p class="login-link">
						已有账号？
						<router-link to="/login" class="link">立即登录</router-link>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
/**
 * 局部样式作用域：导入注册页面专属样式文件
 * @description 包含布局、颜色、间距、表单样式等核心样式，与主题变量联动
 * 样式文件路径: ./css/RegisterPage.css
 */
@import './css/RegisterPage.css';
</style>

<style>
/**
 * 全局样式（非scoped）：下拉选择器自定义样式
 * @description 适配主题变量，优化下拉框视觉效果，包含悬浮/选中态、层级、背景等
 * 注意: 这些样式需要全局作用域，因为Element Plus下拉框会渲染到body下
 */

/**
 * 性别下拉框样式
 * @description 性别选择下拉框的容器样式，包含毛玻璃效果和主题适配
 */
.gender-select-dropdown {
	/* 提高层级，确保下拉框显示在其他元素之上 */
	z-index: 3000 !important;
	/* 内边距：上下8px，左右0 */
	padding: 8px 0;
	/* 背景色使用主题变量，支持亮色/暗色模式切换 */
	background: var(--bg-primary);
	/* 半透明边框，增强视觉层次 */
	border: 1px solid rgb(255 255 255 / 0.2);
	/* 圆角边框，提升现代感 */
	border-radius: 12px;
	/* 阴影效果，增强立体感 */
	box-shadow: 0 8px 24px rgb(0 0 0 / 0.15);
	/* 毛玻璃背景模糊效果 */
	backdrop-filter: blur(20px);
}

/**
 * 学院下拉框样式
 * @description 学院选择下拉框的容器样式，与性别下拉框保持一致的设计风格
 */
.college-select-dropdown {
	/* 提高层级，避免被其他元素遮挡 */
	z-index: 3000 !important;
	/* 最小宽度自适应，根据内容自动调整 */
	min-width: auto;
	/* 背景色使用主题变量 */
	background: var(--bg-primary);
	/* 半透明边框 */
	border: 1px solid rgb(255 255 255 / 0.2);
	/* 圆角边框 */
	border-radius: 12px;
	/* 阴影效果 */
	box-shadow: 0 8px 24px rgb(0 0 0 / 0.15);
	/* 毛玻璃背景模糊效果 */
	backdrop-filter: blur(20px);
}

/**
 * 年级下拉框样式
 * @description 年级选择下拉框的容器样式，保持与其他下拉框一致的设计
 */
.grade-select-dropdown {
	/* 提高层级 */
	z-index: 3000 !important;
	/* 最小宽度自适应 */
	min-width: auto;
	/* 背景色使用主题变量 */
	background: var(--bg-primary);
	/* 半透明边框 */
	border: 1px solid rgb(255 255 255 / 0.2);
	/* 圆角边框 */
	border-radius: 12px;
	/* 阴影效果 */
	box-shadow: 0 8px 24px rgb(0 0 0 / 0.15);
	/* 毛玻璃背景模糊效果 */
	backdrop-filter: blur(20px);
}

/**
 * 下拉选项通用样式
 * @description 所有下拉框选项的基础样式，包含布局、间距、文字样式等
 * 适用于: 性别、学院、年级三个下拉框的选项
 */
.gender-select-dropdown .el-select-dropdown__item,
.college-select-dropdown .el-select-dropdown__item,
.grade-select-dropdown .el-select-dropdown__item {
	/* Flex布局:水平排列，垂直居中 */
	display: flex;
	align-items: center;
	justify-content: flex-start;
	/* 最小高度40px，确保点击区域足够大 */
	min-height: 40px;
	/* 内边距:上下12px，左右16px */
	padding: 12px 16px;
	/* 外边距:上下2px，左右8px */
	margin: 2px 8px;
	/* 允许内容溢出可见 */
	overflow: visible;
	/* 文本溢出处理:不裁剪 */
	text-overflow: clip;
	/* 行高1.5倍，提升可读性 */
	line-height: 1.5;
	/* 文字颜色使用主题变量 */
	color: var(--text-primary);
	/* 文本左对齐 */
	text-align: left;
	/* 文本不换行 */
	white-space: nowrap;
	/* 圆角边框 */
	border-radius: 8px;
	/* 变换过渡动画，时长0.2秒，缓动函数ease */
	transition: transform 0.2s ease;
}

/**
 * 学院/年级下拉选项宽度适配
 * @description 针对学院和年级下拉框的特殊宽度处理
 * 原因: 学院名称较长，需要特殊处理以确保显示完整
 */
.college-select-dropdown .el-select-dropdown__item,
.grade-select-dropdown .el-select-dropdown__item {
	/* 宽度自适应 */
	width: auto;
	/* 最小宽度100%，确保选项占满容器 */
	min-width: 100%;
	/* 外边距:上下4px，左右8px */
	margin: 4px 8px;
}

/**
 * 学院/年级下拉选项文本容器适配
 * @description 确保文本内容能够完整显示，不被裁剪
 */
.college-select-dropdown .el-select-dropdown__item span,
.grade-select-dropdown .el-select-dropdown__item span {
	/* 块级显示 */
	display: block;
	/* 宽度100% */
	width: 100%;
	/* 允许内容溢出可见 */
	overflow: visible;
	/* 文本溢出不裁剪 */
	text-overflow: clip;
	/* 文本不换行 */
	white-space: nowrap;
}

/**
 * 下拉选项悬浮态样式
 * @description 鼠标悬停时的视觉反馈效果
 * 包含: 文字颜色变化、背景色变化
 */
.gender-select-dropdown .el-select-dropdown__item:hover,
.college-select-dropdown .el-select-dropdown__item:hover,
.grade-select-dropdown .el-select-dropdown__item:hover {
	/* 文字颜色变为主题主色 */
	color: var(--primary-color);
	/* 背景色变为浅主色半透明 */
	background-color: rgb(102 126 234 / 0.15);
}

/**
 * 学院/年级下拉选项悬浮动画效果
 * @description 鼠标悬停时选项向右移动4px，增强交互反馈
 */
.college-select-dropdown .el-select-dropdown__item:hover,
.grade-select-dropdown .el-select-dropdown__item:hover {
	/* 向右平移4px */
	transform: translateX(4px);
}

/**
 * 下拉选项选中态样式
 * @description 当前选中选项的视觉样式，区别于普通选项
 */
.gender-select-dropdown .el-select-dropdown__item.selected,
.college-select-dropdown .el-select-dropdown__item.selected,
.grade-select-dropdown .el-select-dropdown__item.selected {
	/* 字体加粗，字重600 */
	font-weight: 600;
	/* 文字颜色为主色 */
	color: var(--primary-color);
	/* 背景色为主色半透明，透明度20% */
	background-color: rgb(102 126 234 / 0.2);
}

/**
 * 下拉选项选中+悬浮态样式
 * @description 选中项在鼠标悬停时的样式，背景色更深
 */
.gender-select-dropdown .el-select-dropdown__item.selected:hover,
.college-select-dropdown .el-select-dropdown__item.selected:hover,
.grade-select-dropdown .el-select-dropdown__item.selected:hover {
	/* 背景色为主色半透明，透明度25%，比选中态更深 */
	background-color: rgb(102 126 234 / 0.25);
}
</style>
