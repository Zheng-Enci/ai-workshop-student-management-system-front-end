import { createApp } from 'vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import router from "@/router";
import { createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import '@/assets/styles/theme.css'
import VueLazyload from 'vue3-lazy'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
// 配置懒加载
app.use(VueLazyload, {
	loading: 'src/assets/loading.gif',  // 加载中的占位图
	error: 'src/assets/loadError.png'        // 加载失败的占位图
})

const userStore = useUserStore()
userStore.initFromStorage()

const themeStore = useThemeStore()
themeStore.initTheme()

app.mount('#app')
