import { createApp } from 'vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import router from "@/router";
import { createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import '@/assets/styles/theme.css'
import VueLazyload from 'vue3-lazy'

// 1. 修正静态资源导入语法（核心错误）
import loadingGif from '@/assets/loading.gif'
import loadErrorPng from '@/assets/loadError.png'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

// 2. 配置懒加载：使用导入的资源变量（而非硬编码路径）
app.use(VueLazyload, {
	loading: loadingGif,  // 导入的加载中图片变量
	error: loadErrorPng,  // 导入的加载失败图片变量
})

// 3. 确保Pinia实例已挂载后再使用store（规范写法）
const userStore = useUserStore(pinia)
userStore.initFromStorage()

const themeStore = useThemeStore(pinia)
themeStore.initTheme()

app.mount('#app')
