<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const detectDevice = () => {
	const screenWidth = window.innerWidth

	if (screenWidth < 768) {
		router.replace('/profile/mobile')
	} else {
		router.replace('/profile/desktop')
	}
}

onMounted(() => {
	detectDevice()
})
</script>

<template>
	<div class="device-detection">
		<div class="loading-container">
			<div class="loading-spinner"/>
			<p>正在检测设备类型...</p>
		</div>
	</div>
</template>

<style scoped>
@import './css/ProfilePage.css';
</style>
