<template>
	<div>
		<div style="
			display: flex;
			padding-left: 20px;
			padding-right: 20px;
		">
			<div style="
				margin-top: 0;
				display: flex; align-items: center; gap: 12px;
			">
				<el-button @click="goBack" class="back-btn" type="primary" :icon="ArrowLeft" circle></el-button>
				<img src="@/assets/AiWorkShop_icon.png" alt="AI坊" class="logo" @click="toggleTheme" title="切换主题模式" style="width: 40px; height: 40px; cursor: pointer;">
			</div>

			<div style = "
				display: flex; flex-direction: column;
				margin-left: 20px; margin-top: 3%; font-size: 9px; width: 100%;
			">
				<h1 style="
					margin: 0; white-space: nowrap;
					background: linear-gradient(135deg, #667eea, #764ba2);
					-webkit-background-clip: text; -webkit-text-fill-color: transparent;
					background-clip: text; font-weight: 600; letter-spacing: 1px;
				">在0与1之间</h1>
				<h1 style="
					align-self: flex-end;
					display: inline-block;
					white-space: nowrap;
					background: linear-gradient(135deg, #667eea, #764ba2);
					-webkit-background-clip: text; -webkit-text-fill-color: transparent;
					background-clip: text; font-weight: 600; letter-spacing: 1px;
				">见证每一位创作者的光芒</h1>
			</div>
		</div>

	</div>
</template>

<script setup>
import {useRouter} from 'vue-router'
import {useThemeStore} from '@/stores/theme'
import {ElButton} from 'element-plus'
import {ArrowLeft} from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/el-button.css'

const router = useRouter()
const themeStore = useThemeStore()

const goBack = () => {
	router.push('/navigation')
}

const toggleTheme = () => {
	themeStore.toggleTheme()
}
</script>

<style scoped>
</style>
