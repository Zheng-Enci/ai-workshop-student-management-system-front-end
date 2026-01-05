/**
 * Vue应用主入口文件
 * 配置和初始化Vue应用、Pinia状态管理、Vue Router路由等核心功能
 *
 * @module main
 * @description 应用的启动入口，负责创建Vue实例、注册插件、初始化stores等
 */

// 导入Element Plus深色模式CSS变量
import 'element-plus/theme-chalk/dark/css-vars.css'
// 导入Pinia状态管理库
import { createPinia } from 'pinia'
// 导入Vue核心库
import { createApp } from 'vue'
// 导入图片懒加载插件
import VueLazyload from 'vue3-lazy'

// 导入静态资源：加载失败时显示的图片
import loadErrorPng from '@/assets/loadError.png'
// 导入静态资源：加载中显示的GIF动画
import loadingGif from '@/assets/loading.gif'
// 导入全局主题样式
import '@/assets/styles/theme.css'
// 导入Vue Router路由配置
import router from '@/router'
// 导入主题状态管理store
import { useThemeStore } from '@/stores/theme'
// 导入用户状态管理store
import { useUserStore } from '@/stores/user'

// 导入根组件
import App from './App.vue'

/**
 * 创建Vue应用实例
 * @type {App}
 */
const app = createApp(App)

/**
 * 创建Pinia实例
 * Pinia是Vue的官方状态管理库
 * @type {Pinia}
 */
const pinia = createPinia()

/**
 * 注册Pinia插件
 * 在应用中启用状态管理功能
 */
app.use(pinia)

/**
 * 注册Vue Router插件
 * 在应用中启用路由功能
 */
app.use(router)

/**
 * 配置图片懒加载插件
 * 使用导入的静态资源作为加载状态的占位图
 */
app.use(VueLazyload, {
	loading: loadingGif, // 图片加载中显示的GIF动画
	error: loadErrorPng // 图片加载失败时显示的图片
})

/**
 * 初始化用户store
 * 从localStorage恢复用户登录状态和信息
 */
const userStore = useUserStore(pinia)
userStore.initFromStorage()

/**
 * 初始化主题store
 * 恢复用户的主题偏好设置（深色/浅色模式）
 */
const themeStore = useThemeStore(pinia)
themeStore.initTheme()

/**
 * 挂载Vue应用到DOM
 * 将应用挂载到id为'app'的DOM元素上
 */
app.mount('#app')
