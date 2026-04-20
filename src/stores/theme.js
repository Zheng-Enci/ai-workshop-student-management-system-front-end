/**
 * 主题状态管理Store
 * 使用Pinia和Composition API管理应用主题（深色/浅色模式）
 *
 * @module stores/theme
 * @description 提供主题切换、自动主题、时间感知主题等功能
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

/**
 * 主题Store定义
 * 使用Composition API风格定义，支持响应式主题管理
 */
export const useThemeStore = defineStore('theme', () => {
	/**
	 * 是否为深色模式
	 *
	 * @type {Ref<boolean>}
	 */
	const isDarkMode = ref(false)

	/**
	 * 是否启用自动主题切换
	 * 启用后根据时间自动切换深色/浅色模式
	 *
	 * @type {Ref<boolean>}
	 */
	const autoThemeEnabled = ref(true)

	/**
	 * 更新文档根元素的主题类名
	 * 在HTML元素上添加/移除dark或light类
	 */
	const updateDocumentTheme = () => {
		const html = document.documentElement
		if (isDarkMode.value) {
			html.classList.add('dark')
			html.classList.remove('light')
		} else {
			html.classList.add('light')
			html.classList.remove('dark')
		}
	}

	/**
	 * 检查并应用基于时间的主题
	 * 根据当前时间（6点前或18点后）自动切换到深色模式
	 */
	const checkTimeBasedTheme = () => {
		// 如果未启用自动主题，直接返回
		if (!autoThemeEnabled.value) { return }

		const hour = new Date().getHours()
		// 6点前或18点后使用深色模式
		const shouldBeDark = hour < 6 || hour >= 18

		// 如果当前主题与应该的主题不一致，则切换
		if (isDarkMode.value !== shouldBeDark) {
			isDarkMode.value = shouldBeDark
			updateDocumentTheme()
		}
	}

	/**
	 * 切换主题（深色/浅色）
	 * 手动切换时会禁用自动主题功能，并显示切换提示
	 */
	const toggleTheme = () => {
		isDarkMode.value = !isDarkMode.value
		autoThemeEnabled.value = false
		// 保存主题偏好到本地存储
		localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
		localStorage.setItem('autoTheme', 'false')
		updateDocumentTheme()
		// 显示主题切换提示
		ElMessage.success(isDarkMode.value ? '已切换到夜间模式' : '已切换到日间模式')
	}

	/**
	 * 设置指定主题
	 *
	 * @param theme - 主题名称，'dark' 或 'light'
	 */
	const setTheme = theme => {
		isDarkMode.value = theme === 'dark'
		autoThemeEnabled.value = false
		// 保存主题偏好到本地存储
		localStorage.setItem('theme', theme)
		localStorage.setItem('autoTheme', 'false')
		updateDocumentTheme()
	}

	/**
	 * 启用自动主题功能
	 * 启用后根据时间自动切换主题，并显示启用提示
	 */
	const enableAutoTheme = () => {
		autoThemeEnabled.value = true
		localStorage.setItem('autoTheme', 'true')
		// 立即检查并应用基于时间的主题
		checkTimeBasedTheme()
		// 显示自动主题已启用提示
		ElMessage.success('已启用自动主题（6:00-18:00日间模式，其余夜间模式）')
	}

	/**
	 * 初始化主题
	 * 从本地存储恢复主题设置，或使用系统偏好
	 * 设置定时器每分钟检查一次时间以更新主题
	 */
	const initTheme = () => {
		const savedAutoTheme = localStorage.getItem('autoTheme')
		const savedTheme = localStorage.getItem('theme')

		// 如果之前启用了自动主题，恢复自动主题功能
		if (savedAutoTheme === 'true') {
			autoThemeEnabled.value = true
			checkTimeBasedTheme()
		} else if (savedTheme) {
			// 如果保存了主题偏好，使用保存的主题
			isDarkMode.value = savedTheme === 'dark'
			autoThemeEnabled.value = false
		} else {
			// 首次使用，根据系统偏好设置主题
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
			isDarkMode.value = prefersDark
			autoThemeEnabled.value = true
			localStorage.setItem('autoTheme', 'true')
		}

		// 应用主题到文档
		updateDocumentTheme()

		// 设置定时器，每分钟检查一次时间以更新主题
		setInterval(checkTimeBasedTheme, 60000)
	}

	/**
	 * 当前主题的计算属性
	 * 返回'dark'或'light'字符串
	 *
	 * @type {ComputedRef<string>}
	 */
	const currentTheme = computed(
		() => (isDarkMode.value ? 'dark' : 'light')
	)

	return {
		isDarkMode,
		autoThemeEnabled,
		currentTheme,
		toggleTheme,
		setTheme,
		enableAutoTheme,
		initTheme
	}
})
