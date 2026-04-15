/**
 * 路由类型声明文件
 * 扩展 vue-router 的 RouteMeta 接口以支持自定义元数据字段
 *
 * @module router/types
 * @description 为路由元数据提供 TypeScript 类型支持
 */

import 'vue-router'

/**
 * 声明 vue-router 模块扩展
 * 添加自定义路由元数据类型支持
 */
declare module 'vue-router' {
	/**
	 * 路由元数据接口扩展
	 * 定义自定义路由元数据字段的类型
	 */
	interface RouteMeta {
		/**
		 * 是否需要登录认证
		 * true 表示需要登录才能访问该路由
		 */
		requiresAuth?: boolean
		/**
		 * 页面标题
		 * 用于设置浏览器标签页标题和SEO
		 */
		title?: string
		/**
		 * 页面描述
		 * 用于SEO meta description
		 */
		description?: string
	}
}
