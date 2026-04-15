/**
 * Vue 类型声明文件
 * 声明 Vue 单文件组件和 Vue 3 Composition API 的类型
 *
 * @file shims-vue.d.ts
 * @description 提供 Vue 3 类型支持
 */

declare module '*.vue' {
	import type { DefineComponent } from 'vue'
	const component: DefineComponent<{}, {}, any>
	export default component
}

/**
 * 声明 Vue 3 模块导出
 * 解决 TypeScript 无法识别 Vue 3 Composition API 的问题
 */
declare module 'vue' {
	export * from '@vue/runtime-core'
}
