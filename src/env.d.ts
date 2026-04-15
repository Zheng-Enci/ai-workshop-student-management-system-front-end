/// <reference types="vite/client" />

declare module '*.vue' {
	import type { DefineComponent } from 'vue'
	const component: DefineComponent<{}, {}, any>
	export default component
}

// 扩展 Vue 的 JSX 命名空间以支持 v-lazy 指令
declare module '@vue/runtime-core' {
	export interface ComponentCustomProperties {
		// v-lazy 指令类型声明
		vLazy: import('vue').Directive<HTMLElement, string>
	}

	export interface GlobalDirectives {
		vLazy: import('vue').Directive<HTMLElement, string>
	}
}

// 声明 vue3-lazy 模块
declare module 'vue3-lazy' {
	import { Plugin } from 'vue'

	interface VueLazyloadOptions {
		loading?: string
		error?: string
		preLoad?: number
		attempt?: number
		listenEvents?: string[]
		adapter?: any
		filter?: any
		lazyComponent?: boolean
		dispatchEvent?: boolean
		throttleWait?: number
		observer?: boolean
		observerOptions?: IntersectionObserverInit
	}

	const VueLazyload: Plugin<VueLazyloadOptions>
	export default VueLazyload
}

// 声明静态资源类型
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.svg'
