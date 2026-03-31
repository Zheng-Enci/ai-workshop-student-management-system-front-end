<script setup>
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { ElButton, ElIcon } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'

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
					class="header-home-btn"
					type="primary"
					circle
					@click="goBack"
				>
					<el-icon><ArrowLeft /></el-icon>
				</el-button>
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="Logo"
					class="header-logo"
					title="切换主题模式"
					@click="toggleTheme"
				/>
				<div class="header-title-section">
					<h1>考勤分析</h1>
					<p>人工智能创作坊</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import './css/desktop/header.css';
@import './css/desktop/page.css';
</style>
