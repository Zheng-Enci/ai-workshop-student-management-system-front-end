<script setup>
import { ElButton, ElIcon } from 'element-plus'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

import { useThemeStore } from '@/stores/theme'

import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import { ArrowLeft, Loading, Box, Document, ArrowUp, ArrowDown, Coin } from '@element-plus/icons-vue'

import { getAllAdjustRecordsByStudentInfoId } from '@/api/points'
import { getStudentDatabaseTableId } from '@/api/student'

const router = useRouter()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore

const records = ref([])
const loading = ref(false)

const sortedRecords = computed(() => [...records.value].sort((a, b) => {
	const timeA = new Date(a.createTime).getTime()
	const timeB = new Date(b.createTime).getTime()
	return timeB - timeA // 最新的在前
}))

const positiveCount = computed(() => records.value.filter(r => r.adjustPoints > 0).length)

const negativeCount = computed(() => records.value.filter(r => r.adjustPoints < 0).length)

const totalPoints = computed(() => records.value.reduce((sum, r) => sum + r.adjustPoints, 0))

const formatTime = timeString => {
	if (!timeString) { return '--' }
	try {
		const date = new Date(timeString)
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')
		return `${year}-${month}-${day} ${hours}:${minutes}`
	} catch (error) {
		return timeString
	}
}

const loadRecords = async () => {
	try {
		loading.value = true
		const token = localStorage.getItem('token')
		if (!token) {
			router.push('/login')
			return
		}

		// 获取学生数据库ID
		const studentIdResponse = await getStudentDatabaseTableId(token)
		if (studentIdResponse.code !== 200 || !studentIdResponse.data) {
			throw new Error('获取学生信息失败')
		}

		const studentInfoId = studentIdResponse.data

		// 获取所有改分记录
		const response = await getAllAdjustRecordsByStudentInfoId(studentInfoId)
		if (response.code === 200 && Array.isArray(response.data)) {
			records.value = response.data
		} else {
			records.value = []
		}
	} catch (error) {
		console.error('加载改分记录失败:', error)
		if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
			localStorage.removeItem('token')
			localStorage.removeItem('userInfo')
			router.push('/login')
		} else {
			records.value = []
		}
	} finally {
		loading.value = false
	}
}

const goBack = () => {
	router.push('/navigation')
}

onMounted(() => {
	loadRecords()
})
</script>

<template>
	<div class="score-change-records-container">
		<div class="background-effects">
			<div class="gradient-orb orb-1"/>
			<div class="gradient-orb orb-2"/>
			<div class="gradient-orb orb-3"/>
		</div>

		<div class="header">
			<div class="header-content">
				<el-button
					class="back-btn"
					type="primary"
					:icon="ArrowLeft"
					circle
					@click="goBack"/>
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊学生管理系统"
					class="logo"
					title="切换主题模式"
					@click="toggleTheme"/>
				<div class="title-section">
					<h1>改分记录</h1>
					<p>查看所有积分调整记录</p>
				</div>
			</div>
		</div>

		<div class="main-content">
			<div class="content-wrapper">
				<!-- 统计信息卡片 -->
				<div class="stats-card">
					<div class="stats-item">
						<div class="stats-icon total">
							<el-icon size="20"><document /></el-icon>
						</div>
						<div class="stats-info">
							<div class="stats-label">总记录数</div>
							<div class="stats-value">{{ records.length }}</div>
						</div>
					</div>
					<div class="stats-item">
						<div class="stats-icon positive">
							<el-icon size="20"><arrow-up /></el-icon>
						</div>
						<div class="stats-info">
							<div class="stats-label">加分记录</div>
							<div class="stats-value">{{ positiveCount }}</div>
						</div>
					</div>
					<div class="stats-item">
						<div class="stats-icon negative">
							<el-icon size="20"><arrow-down /></el-icon>
						</div>
						<div class="stats-info">
							<div class="stats-label">扣分记录</div>
							<div class="stats-value">{{ negativeCount }}</div>
						</div>
					</div>
					<div class="stats-item">
						<div class="stats-icon points">
							<el-icon size="20"><coin /></el-icon>
						</div>
						<div class="stats-info">
							<div class="stats-label">总调整分数</div>
							<div class="stats-value">{{ totalPoints > 0 ? `+${totalPoints}` : totalPoints }}</div>
						</div>
					</div>
				</div>

				<!-- 加载状态 -->
				<div v-if="loading" class="loading-container">
					<el-icon class="is-loading"><loading /></el-icon>
					<span>加载中...</span>
				</div>

				<!-- 空状态 -->
				<div v-else-if="records.length === 0" class="empty-container">
					<el-icon><box /></el-icon>
					<span>暂无改分记录</span>
				</div>

				<!-- 记录列表 -->
				<div v-else class="records-container">
					<div class="records-list">
						<div
							v-for="(record, index) in sortedRecords"
							:key="index"
							class="record-card"
						>
							<div class="record-header">
								<span class="record-time">{{ formatTime(record.createTime) }}</span>
								<span class="record-points-badge" :class="{ positive: record.adjustPoints >= 0, negative: record.adjustPoints < 0 }">
									{{ record.adjustPoints > 0 ? `+${record.adjustPoints}` : record.adjustPoints }}
								</span>
							</div>
							<div class="record-reason-text">{{ record.adjustReason }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import './css/ScoreChangeRecordsPageMobile.css';
</style>

