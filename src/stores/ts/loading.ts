/**
 * 全局加载状态管理Store
 * 用于控制项目中所有页面的加载蒙版显示
 *
 * @module stores/loading
 * @description 提供全局加载状态的显示和隐藏功能
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 全局加载Store定义
 */
export const useLoadingMaskStore = defineStore('loadingMask', () => {
	/**
	 * 是否显示加载蒙版
	 */
	const isShowLoadingMask = ref<boolean>(false)

	/**
	 * 加载提示文字
	 */
	const loadingMaskText = ref<string>('正在加载...')

	/**
	 * 显示加载蒙版
	 *
	 * @param text - 加载提示文字，默认为"正在加载..."
	 */
	const showLoadingMask = (text: string = '正在加载...'): void => {
		loadingMaskText.value = text
		isShowLoadingMask.value = true
	}

	/**
	 * 隐藏加载蒙版
	 */
	const hideLoadingMask = (): void => {
		isShowLoadingMask.value = false
		loadingMaskText.value = '正在加载...'
	}

	return {
		isShowLoadingMask,
		loadingMaskText,
		showLoadingMask,
		hideLoadingMask
	}
})

/**
 * 加载Store类型定义
 * 导出供其他地方使用
 */
export type LoadingMaskStore = ReturnType<typeof useLoadingMaskStore>
