/**
 * 管理员页面核心逻辑模块
 * 提供管理员页面的状态管理和核心功能实现
 *
 * @module views/AdminPage/ts/AdminPage
 * @description 封装管理员页面的核心业务逻辑，包括身份验证和学生数据管理
 */

import {ElMessage} from 'element-plus'
import AdminPageUtils from './AdminPageUtils'
import type {StudentInfo} from './types'
import {nextTick, ref} from "vue";
// 导入主题 Store
import {useThemeStore} from '../../../stores/theme'
// 导入加载蒙版 Store
import {useLoadingMaskStore} from '../../../stores/loading'
import {adminPageConfig} from "./AdminPageConfig";
import StudentApi from "../../../api/StudentApi.js";

/**
 * 超级管理员头像 URL
 */
let superAdminAvatarUrl = StudentApi.getAvatarUrl(adminPageConfig.superAdminInfoId, adminPageConfig.superAdminAvatarSize_desktop)

/**
 * 页面状态
 * 使用ref创建响应式变量，控制当前显示的页面
 * 'auth': 显示身份验证页面
 * 'loading': 显示数据加载页面
 * 'main': 显示主控制台页面
 */
const pageState = ref<'auth' | 'main'>('auth')

/**
 * 当前选中的学生等级
 * 用于控制身份按钮的高亮显示
 * -1: 表示显示所有成员（全部成员按钮被选中）
 * 0: 社团成员
 * 1: 普通成员
 * 2: 核心成员
 * 3: 管理员
 */
const currentSelectedLevel = ref<number>(-1)

/**
 * 特殊密码状态
 * 存储经过验证的特殊密码
 * 该密码将在后续的API请求中作为认证凭证使用
 * 验证成功后会存储密码，验证失败或超时会清空密码
 */
const specialPassword = ref('')

/**
 * 所有学生信息数据
 * 使用ref创建响应式变量，存储从后端获取的完整学生数据
 * 包含学生的基本信息、等级、管理员等信息
 * 作为原始数据源，不直接用于UI展示
 */
const allStudentInfos = ref<StudentInfo[]>([])

/**
 * 社团成员信息数据
 * 使用ref创建响应式变量，存储等级为0的社团成员数据
 * 包含社团成员的基本信息、等级、管理员等信息
 */
const membersOfTheClubInfos = ref<StudentInfo[]>([])

/**
 * 普通成员信息数据
 * 使用ref创建响应式变量，存储等级为1的普通成员数据
 * 包含普通成员的基本信息、等级、管理员等信息
 */
const ordinaryMembersInfos = ref<StudentInfo[]>([])

/**
 * 核心成员信息数据
 * 使用ref创建响应式变量，存储等级为2的核心成员数据
 * 包含核心成员的基本信息、等级、管理员等信息
 */
const coreMembersInfos = ref<StudentInfo[]>([])

/**
 * 管理员成员信息数据
 * 使用ref创建响应式变量，存储等级为3的管理员成员数据
 * 包含管理员成员的基本信息、等级、管理员等信息
 */
const adminMembersInfos = ref<StudentInfo[]>([])

// 导入loading mask store
const loadingMaskStore = useLoadingMaskStore()

/**
 * 待显示的学生信息数据
 * 使用ref创建响应式变量，存储当前需要展示的学生数据
 * 可能是经过筛选、排序或分页处理后的数据
 * 直接绑定到UI组件进行展示
 */
const toShowStudentInfos = ref<StudentInfo[]>([])

export const toShowAllMembersCount = ref<number>(0)
export const toShowMembersOfTheClubCount = ref<number>(0)
export const toShowOrdinaryMembersCount = ref<number>(0)
export const toShowCoreMembersCount = ref<number>(0)
export const toShowAdminMembersCount = ref<number>(0)

/**
 * 搜索关键词
 * 使用ref创建响应式变量，存储当前搜索关键词
 */
const searchKeyword = ref('')

/**
 * 搜索结果
 */
let searchResult: StudentInfo[] = []

/**
 * 验证特殊密码
 * 验证提供的特殊密码是否正确，验证成功后存储密码并切换到加载页面
 *
 * @returns {Promise<boolean>} 验证结果，true表示密码正确，false表示密码错误
 * @example
 * // 验证特殊密码
 * const isValid = await validateSpecialPassword('password123')
 * if (isValid) {
 *   console.log('密码正确并已存储')
 * } else {
 *   console.log('密码错误')
 * }
 */
export async function validateSpecialPassword(): Promise<boolean> {
	if (specialPassword.value === '' || specialPassword.value === null) {
		// 密码为空，提示用户输入密码
		ElMessage.error('请输入密码')
		return false
	}
	try {
		// 调用工具函数验证特殊密码
		// AdminPageUtils.validateSpecialPassword会向后端API发送请求验证密码
		const response = await AdminPageUtils.validateSpecialPassword(specialPassword.value)

		// 如果验证成功（response为true）
		if (response) {
			// 设置定时器，四分钟后自动退出登录
			// 这是一个安全机制，防止密码长期有效导致的安全风险
			setTimeout(() => {
				// 退出登录
				logout()
			}, 4 * 60 * 1000)
			return true
		} else {
			return false
		}
	} catch (error) {
		// 验证失败，保持在身份验证页面
		pageState.value = 'auth'

		// 捕获验证过程中的错误
		// 如果错误对象是Error类型，使用其message属性
		// 否则使用默认错误提示"网络问题"
		const errorMessage = error instanceof Error ? error.message : "网络问题"

		// 显示错误提示消息，告知用户验证失败的具体原因
		ElMessage.error(`验证密码失败: ${errorMessage}`)

		// 返回false表示验证失败
		return false
	}
}

/**
 * 加载学生数据
 * 从后端获取所有学生的综合信息并存储到状态变量中，完成后切换到主页面
 *
 * @async
 * @returns {Promise<void>} 无返回值
 * @description 该函数在管理员登录成功后被调用，用于获取所有学生的综合信息并存储到状态变量中
 * @example
 * // 验证密码成功后加载数据
 * const isValid = await validateSpecialPassword('password123')
 * if (isValid) {
 *   await loadData()
 *   console.log('数据已加载')
 * }
 */
export async function loadData(): Promise<void> {
	try {
		// 调用工具函数获取学生综合信息
		// 传入之前验证并存储的specialPassword作为认证凭证
		const fetchedStudentInfos = await AdminPageUtils.getStudentComprehensiveInfo(
			specialPassword.value,
		)

		// 将获取到的学生信息数据存储到响应式变量中
		// 直接替换整个数组，触发响应式更新
		allStudentInfos.value = fetchedStudentInfos
		toShowStudentInfos.value = fetchedStudentInfos


		// 统计各等级学生数量
		const levelCounts = fetchedStudentInfos.reduce((acc, student) => {
			acc[student.level] = (acc[student.level] || 0) + 1
			return acc
		}, {} as Record<number, number>)


		// 为各个身份的信息数组赋值
		membersOfTheClubInfos.value = fetchedStudentInfos.filter(student => student.level === 0)
		ordinaryMembersInfos.value = fetchedStudentInfos.filter(student => student.level === 1)
		coreMembersInfos.value = fetchedStudentInfos.filter(student => student.level === 2)
		adminMembersInfos.value = fetchedStudentInfos.filter(student => student.level === 3)

		// 更新待显示的数量统计
		toShowAllMembersCount.value = fetchedStudentInfos.length
		toShowMembersOfTheClubCount.value = levelCounts[0] || 0
		toShowOrdinaryMembersCount.value = levelCounts[1] || 0
		toShowCoreMembersCount.value = levelCounts[2] || 0
		toShowAdminMembersCount.value = levelCounts[3] || 0

		// 设置页面状态为主页面
		pageState.value = 'main'

	} catch (error) {
		// 捕获数据获取过程中的错误
		// 如果错误对象是Error类型，使用其message属性获取具体错误信息
		// 否则使用默认错误提示"未知错误"
		const errorMessage = error instanceof Error ? error.message : "未知错误"

		// 显示错误提示消息，告知用户加载数据失败的具体原因
		ElMessage.error(`加载数据失败: ${errorMessage}`)

		// 加载失败，回到身份验证页面
		pageState.value = 'auth'
	}
}
export async function refreshData(): Promise<void> {
	// 打开加载蒙版
	loadingMaskStore.showLoadingMask("正在刷新数据...")
	try {
		// 调用工具函数获取学生综合信息
		// 传入之前验证并存储的specialPassword作为认证凭证
		const fetchedStudentInfos = await AdminPageUtils.getStudentComprehensiveInfo(
			specialPassword.value,
		)

		// 将获取到的学生信息数据存储到响应式变量中
		// 直接替换整个数组，触发响应式更新
		allStudentInfos.value = fetchedStudentInfos

		searchResult = AdminPageUtils.searchStudents(allStudentInfos.value, searchKeyword.value)
		// 计算各个身份的学生数量
		const levelCounts = searchResult.reduce((acc, student) => {
			acc[student.level] = (acc[student.level] || 0) + 1
			return acc
		}, {} as Record<number, number>)
		// 更新要显示的数量统计
		toShowAllMembersCount.value = searchResult.length
		toShowMembersOfTheClubCount.value = levelCounts[0] || 0
		toShowOrdinaryMembersCount.value = levelCounts[1] || 0
		toShowCoreMembersCount.value = levelCounts[2] || 0
		toShowAdminMembersCount.value = levelCounts[3] || 0
		// 更新待显示的学生数据 (依据当前要显示的身份)
		toShowStudentInfos.value = currentSelectedLevel.value === -1? searchResult : searchResult.filter(student => student.level === currentSelectedLevel.value)

		// 为各个身份的信息数组赋值
		membersOfTheClubInfos.value = fetchedStudentInfos.filter(student => student.level === 0)
		ordinaryMembersInfos.value = fetchedStudentInfos.filter(student => student.level === 1)
		coreMembersInfos.value = fetchedStudentInfos.filter(student => student.level === 2)
		adminMembersInfos.value = fetchedStudentInfos.filter(student => student.level === 3)
		ElMessage.success("数据刷新成功")
	} catch (error) {
		// 捕获数据获取过程中的错误
		// 如果错误对象是Error类型，使用其message属性获取具体错误信息
		// 否则使用默认错误提示"未知错误"
		const errorMessage = error instanceof Error ? error.message : "未知错误"

		// 显示错误提示消息，告知用户加载数据失败的具体原因
		ElMessage.error(`刷新数据失败: ${errorMessage}`)

		// 加载失败，回到身份验证页面
		pageState.value = 'auth'
	}
	// 关闭加载蒙版
	nextTick().then(() => {
		setTimeout(() => {
			loadingMaskStore.hideLoadingMask()
		}, 512)  // 延迟 512ms 关闭，确保页面渲染完成和动画执行完毕
	})
}

/**
 * 身份验证加载状态
 * 用于防止用户重复点击验证按钮
 */
const isAuthenticating = ref(false)

/**
 * 身份验证函数
 * 执行完整的身份验证流程，包括验证密码和加载数据
 * 该函数不需要传入参数，直接使用specialPassword.value中的密码进行验证
 * 如果验证成功，自动调用loadData函数加载学生数据
 *
 * @returns {Promise<boolean>} 验证和加载结果，true表示成功，false表示失败
 * @description 该函数封装了验证特殊密码和加载学生数据的完整流程
 * @example
 * // 执行身份验证
 * const success = await authenticate()
 * if (success) {
 *   console.log('身份验证成功，数据已加载')
 * } else {
 *   console.log('身份验证失败')
 * }
 */
export async function authenticate(): Promise<void> {
	specialPassword.value = 'axiezhixingiaigg'
	// 如果正在验证身份，则直接返回
	if (isAuthenticating.value) {
		// 防止用户重复点击验证按钮
		return
	}
	// 设置正在验证身份状态
	isAuthenticating.value = true
	try {
		// 调用验证特殊密码函数
		// validateSpecialPassword会检查specialPassword.value中的密码
		const isValid = await validateSpecialPassword()

		// 如果验证成功
		if (isValid) {
			// 打开加载蒙版
			loadingMaskStore.showLoadingMask("身份验证成功, 正在加载学生数据...")
			// 切换页面状态到加载页面
			pageState.value = 'main'
			// 加载学生数据
			await loadData()
		}


	} catch (error) {
		// 捕获身份验证过程中的错误
		const errorMessage = error instanceof Error ? error.message : "未知错误"
		ElMessage.error(`身份验证失败: ${errorMessage}`)
	} finally {
		// 验证完成，恢复默认状态
		isAuthenticating.value = false
		// 关闭加载蒙版
		nextTick().then(() => {
			setTimeout(() => {
				loadingMaskStore.hideLoadingMask()
			}, 512)  // 延迟 512ms 关闭，确保页面渲染完成和动画执行完毕
		})
	}
}


/**
 * 退出登录
 * 清空密码和学生数据，切换到身份验证页面
 *
 * @returns {void} 无返回值
 * @example
 * // 退出登录
 * logout()
 */
export function logout(): void {
	resetPageState()
}

/**
 * 切换主题（日间/夜间模式）
 * @description 调用主题Store的toggleTheme方法实现主题切换
 */
export function toggleTheme(): void {
	const themeStore = useThemeStore()
	themeStore.toggleTheme()
}

/**
 * 设置学生等级显示
 * 根据指定的等级筛选学生数据，并更新到ShowStudentInfos响应式变量中
 * 用于在主页面中点击不同身份按钮时，动态切换显示对应等级的学生信息
 *
 * @param level - 学生等级，可选值：
 *               - undefined 或 -1: 显示所有学生（全部成员）
 *               - 0: 显示社团成员
 *               - 1: 显示普通成员
 *               - 2: 显示核心成员
 *               - 3: 显示管理员
 * @returns {void} 无返回值
 *
 * @example
 * // 显示所有学生（全部成员）
 * setStudentLevelDisplay(-1)
 *
 * // 只显示社团成员
 * setStudentLevelDisplay(0)
 *
 * // 只显示管理员
 * setStudentLevelDisplay(3)
 */
export function setStudentLevelDisplay(level: number): void {

	// 打开加载蒙版
	loadingMaskStore.showLoadingMask("正在切换学生列表...")

	setTimeout(() => {
		// 根据指定的等级直接赋值对应的学生数据数组
		// 使用已经预先筛选好的对应等级的学生数据数组，避免重复筛选，提高性能
		switch (level) {
			case -1:
				toShowStudentInfos.value = searchResult.length > 0 ? searchResult : allStudentInfos.value
				break
			case 0:
				toShowStudentInfos.value = searchResult.length > 0 ? searchResult.filter(student => student.level === 0) : membersOfTheClubInfos.value
				break
			case 1:
				toShowStudentInfos.value = searchResult.length > 0 ? searchResult.filter(student => student.level === 1) : ordinaryMembersInfos.value
				break
			case 2:
				toShowStudentInfos.value = searchResult.length > 0 ? searchResult.filter(student => student.level === 2) : coreMembersInfos.value
				break
			case 3:
				toShowStudentInfos.value = searchResult.length > 0 ? searchResult.filter(student => student.level === 3) : adminMembersInfos.value
				break
		}
		// 设置当前选中的等级
		currentSelectedLevel.value = level

		// 使用nextTick等待DOM更新和动画执行完成
		nextTick().then(() => {
			setTimeout(() => {
				// 关闭加载蒙版
				loadingMaskStore.hideLoadingMask()
			}, 128)  // 延迟 512ms 关闭，确保页面渲染完成和动画执行完毕
		})
	}, 128)  // 延迟 256ms 切换，确保蒙版渲染完成
}

/**
 * 搜索学生·
 */
export function searchStudents(): void {
	// 打开加载蒙版
	loadingMaskStore.showLoadingMask(`正在搜索有关 ${searchKeyword.value} 的学生...`)

	searchResult = AdminPageUtils.searchStudents(allStudentInfos.value, searchKeyword.value)
	// 计算各个身份的学生数量
	const levelCounts = searchResult.reduce((acc, student) => {
		acc[student.level] = (acc[student.level] || 0) + 1
		return acc
	}, {} as Record<number, number>)
	// 更新待显示的数量统计
	toShowAllMembersCount.value = searchResult.length
	toShowMembersOfTheClubCount.value = levelCounts[0] || 0
	toShowOrdinaryMembersCount.value = levelCounts[1] || 0
	toShowCoreMembersCount.value = levelCounts[2] || 0
	toShowAdminMembersCount.value = levelCounts[3] || 0
	// 更新待显示的学生数据 (依据当前要显示的身份)
	toShowStudentInfos.value = currentSelectedLevel.value === -1? searchResult : searchResult.filter(student => student.level === currentSelectedLevel.value)
	// 关闭加载蒙版
	nextTick().then(() => {
		setTimeout(() => {
			loadingMaskStore.hideLoadingMask()
		}, 512)  // 延迟 512ms 关闭，确保页面渲染完成和动画执行完毕
	})
}
/**
 * 重置页面所有变量到默认值
 * 用于页面挂载时初始化状态，确保每次页面加载都从初始状态开始
 *
 * @returns {void} 无返回值
 * @example
 * // 在 onMounted 中调用
 * onMounted(() => {
 *   resetPageState()
 *   authenticate()
 * })
 */
export function resetPageState(): void {
	// 重置页面状态
	pageState.value = 'auth'
	currentSelectedLevel.value = -1
	specialPassword.value = ''

	// 重置学生数据
	allStudentInfos.value = []
	membersOfTheClubInfos.value = []
	ordinaryMembersInfos.value = []
	coreMembersInfos.value = []
	adminMembersInfos.value = []
	toShowStudentInfos.value = []

	// 重置数量统计
	toShowAllMembersCount.value = 0
	toShowMembersOfTheClubCount.value = 0
	toShowOrdinaryMembersCount.value = 0
	toShowCoreMembersCount.value = 0
	toShowAdminMembersCount.value = 0

	// 重置搜索相关
	searchKeyword.value = ''
	searchResult = []

	// 重置加载状态
	isAuthenticating.value = false
}


// 导出响应式变量，供Vue组件使用
export {
	pageState, specialPassword, toShowStudentInfos, allStudentInfos, currentSelectedLevel,
	isAuthenticating, // 验证按钮是否点击状态
	superAdminAvatarUrl, // 超级管理员头像 URL
	searchKeyword, // 搜索关键词
}
