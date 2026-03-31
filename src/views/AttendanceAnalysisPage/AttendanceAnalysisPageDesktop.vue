<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
	router.push('/navigation-desktop')
}
</script>

<template>
	<div class="attendance-analysis-page">
		<div class="header">
			<div class="header-left">
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="Logo"
					class="logo"
				/>
				<div class="title-section">
					<h1>考勤分析</h1>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import './css/AttendanceAnalysisPageDesktop.css';
</style>
