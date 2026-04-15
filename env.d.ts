/**
 * 项目类型声明文件
 * 用于声明全局类型和第三方库的类型扩展
 */

// 声明 Vue 3 的模块类型
/// <reference types="vite/client" />

declare module '*.vue' {
	import type { DefineComponent } from 'vue'
	const component: DefineComponent<{}, {}, any>
	export default component
}

// 声明 vue3-lazy 插件的 v-lazy 指令
import { Directive } from 'vue'

declare module 'vue' {
	export interface ComponentCustomProperties {
		// v-lazy 指令类型声明
		$lazy: Directive<HTMLElement, string>
	}
}

// 扩展 Vue 的 JSX 命名空间以支持 v-lazy 指令
declare module '@vue/runtime-core' {
	export interface ComponentCustomProperties {
		// v-lazy 指令类型声明
		vLazy: Directive<HTMLElement, string>
	}
}

// 声明静态资源类型
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.svg'
