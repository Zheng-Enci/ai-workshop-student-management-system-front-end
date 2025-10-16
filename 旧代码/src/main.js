import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from "@/router";
import { createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'

const app = createApp(App)
app.use(ElementPlus)
const pinia = createPinia()
app.use(pinia)
app.use(router)

const userStore = useUserStore()
userStore.initFromStorage()

app.mount('#app')
