<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useLoadingMaskStore } from '@/stores/ts/loading.ts'
import LoadingMask from '@/components/LoadingMask.vue'

const router = useRouter()
const loadingMaskStore = useLoadingMaskStore()

const detectDeviceType = () => {
	const screenWidth = window.innerWidth
	if (screenWidth < 768) {
		return 'mobile'
	}
	return 'desktop'
}

const redirectToDevicePage = () => {
	const deviceType = detectDeviceType()
	if (deviceType === 'mobile') {
		router.replace('/attendance-analysis-mobile')
	} else {
		router.replace('/attendance-analysis-desktop')
	}
	nextTick(() => {
		loadingMaskStore.hideLoadingMask()
	})
}

onMounted(() => {
	nextTick(() => {
		loadingMaskStore.showLoadingMask('正在检测设备类型...')
		redirectToDevicePage()
	})
})
</script>

<template>
	<div class="attendance-analysis-page-device-detection-container">
		<LoadingMask/>
	</div>
</template>

<style scoped>
.attendance-analysis-page-device-detection-container {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	background: linear-gradient(135deg,
		rgba(99, 102, 241, 0.1) 0%,
		rgba(168, 85, 247, 0.08) 25%,
		rgba(236, 72, 153, 0.06) 50%,
		rgba(251, 146, 60, 0.08) 75%,
		rgba(34, 197, 94, 0.1) 100%);
}
</style>
