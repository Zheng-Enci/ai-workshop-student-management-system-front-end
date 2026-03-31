<script setup>
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { ElButton } from 'element-plus'
import { House } from '@element-plus/icons-vue'

const router = useRouter()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore

const goBack = () => {
	router.push('/navigation-desktop')
}
</script>

<template>
	<div class="attendance-analysis-page">
		<div class="header-header">
			<div class="header-header-left">
				<el-button
					class="home-btn"
					type="primary"
					:icon="House"
					circle
					@click="goBack"
				/>
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="Logo"
					class="header-logo"
					title="切换主题模式"
					@click="toggleTheme"
				/>
				<div class="header-title-section">
					<h1>考勤分析</h1>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import './css/desktop/header.css';
@import './css/desktop/page.css';
@import './css/desktop/home-btn.css';
</style>
