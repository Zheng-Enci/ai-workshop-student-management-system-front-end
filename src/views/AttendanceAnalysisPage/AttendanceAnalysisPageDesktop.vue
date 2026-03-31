<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

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
</style>
