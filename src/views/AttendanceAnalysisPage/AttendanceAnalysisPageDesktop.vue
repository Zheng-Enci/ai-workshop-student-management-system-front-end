<script setup>
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'

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
</style>
