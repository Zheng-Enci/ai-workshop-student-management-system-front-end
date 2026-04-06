<script setup>
/**
 * 改分记录页面组件(移动端)
 *
 * @description 展示学生的积分调整记录,包括加分和扣分历史(移动端)
 * @component ScoreChangeRecordsPageMobile
 */
import { ElButton, ElIcon } from 'element-plus'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

import { useThemeStore } from '@/stores/theme'
import { useLoadingMaskStore } from '@/stores/loading'
import LoadingMask from '@/components/LoadingMask.vue'

import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import { ArrowLeft, Box, Document, ArrowUp, ArrowDown, Coin } from '@element-plus/icons-vue'

import { getAllAdjustRecordsByStudentInfoId } from '@/api/points'
import { getStudentDatabaseTableId } from '@/api/student'

// ===================== 全局实例初始化 =====================
/**
 * 路由实例
 * @type {Router}
 * @description 用于页面跳转和路由导航
 */
const router = useRouter()
/**
 * 主题状态仓库实例
 * @type {Store}
 * @description 管理应用主题切换(亮色/暗色模式)
 */
const themeStore = useThemeStore()
/**
 * 全局加载蒙版 Store
 * @type {Store}
 * @description 管理全局加载蒙版的显示和隐藏
 */
const loadingMaskStore = useLoadingMaskStore()
/**
 * 主题切换方法
 * @type {Function}
 * @description 解构自主题Store,用于切换明暗主题
 */
const { toggleTheme } = themeStore

// ===================== 响应式变量定义区 =====================
/**
 * 积分调整记录列表
 * @type {Ref<Array>}
 * @description 存储所有积分调整记录,包含加分和扣分记录
 */
const records = ref([])

/**
 * 记录卡片动画显示状态
 * @type {Ref<boolean>}
 * @description 控制记录卡片是否以动画方式显示
 */
const showCardAnimation = ref(false)

/**
 * 页面入场动画状态
 * @type {Ref<boolean>}
 * @description 控制页面入场动画显示
 */
const showPageAnimation = ref(false)

// ===================== 计算属性区 =====================
/**
 * 排序后的记录列表
 * @type {ComputedRef<Array>}
 * @description 按创建时间倒序排列,最新的记录在前
 */
const sortedRecords = computed(() => [...records.value].sort((a, b) => {
	// 将时间字符串转换为时间戳进行比较
	const timeA = new Date(a.createTime).getTime()
	const timeB = new Date(b.createTime).getTime()
	// 倒序排列:最新的在前
	return timeB - timeA
}))

/**
 * 加分记录数量
 * @type {ComputedRef<number>}
 * @description 统计积分调整值大于0的记录数量
 */
const positiveCount = computed(() => records.value.filter(r => r.adjustPoints > 0).length)

/**
 * 扣分记录数量
 * @type {ComputedRef<number>}
 * @description 统计积分调整值小于0的记录数量
 */
const negativeCount = computed(() => records.value.filter(r => r.adjustPoints < 0).length)

/**
 * 总调整积分
 * @type {ComputedRef<number>}
 * @description 计算所有积分调整记录的总和(加分和扣分的总和)
 */
const totalPoints = computed(() => records.value.reduce((sum, r) => sum + r.adjustPoints, 0))

// ===================== 业务逻辑方法区 =====================
/**
 * 格式化时间字符串
 * @function formatTime
 * @description 将ISO时间字符串格式化为可读的日期时间格式
 * 格式: YYYY-MM-DD HH:mm
 * @param {string} timeString - ISO格式的时间字符串
 * @returns {string} 格式化后的时间字符串,失败时返回原字符串或'--'
 */
const formatTime = timeString => {
	// 空值处理
	if (!timeString) { return '--' }
	try {
		const date = new Date(timeString)
		// 提取年月日时分
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')
		// 返回格式化后的时间字符串
		return `${year}-${month}-${day} ${hours}:${minutes}`
	} catch (error) {
		// 解析失败时返回原字符串
		return timeString
	}
}

/**
 * 加载积分调整记录
 * @function loadRecords
 * @description 从API获取当前学生的所有积分调整记录
 * 流程:
 * 1. 获取登录token
 * 2. 根据token获取学生数据库ID
 * 3. 根据学生ID获取所有积分调整记录
 * 4. 更新记录列表
 * @async
 * @returns {Promise<void>}
 */
const loadRecords = async () => {
	try {
		// 显示全局加载蒙版
		loadingMaskStore.showLoadingMask('正在加载改分记录...')
		// 从本地存储获取登录token
		const token = localStorage.getItem('token')
		// 无token时跳转到登录页
		if (!token) {
			router.push('/login')
			return
		}

		/**
		 * 获取学生数据库ID
		 * @description 使用token获取学生数据库主键ID,用于查询积分调整记录
		 */
		const studentIdResponse = await getStudentDatabaseTableId(token)
		// 接口返回异常时抛出错误
		if (studentIdResponse.code !== 200 || !studentIdResponse.data) {
			throw new Error('获取学生信息失败')
		}

		// 获取学生数据库ID
		const studentInfoId = studentIdResponse.data

		/**
		 * 获取所有改分记录
		 * @description 根据学生ID查询该学生的所有积分调整记录
		 */
		const response = await getAllAdjustRecordsByStudentInfoId(studentInfoId)
		// 接口返回成功且数据为数组时更新记录列表
		if (response.code === 200 && Array.isArray(response.data)) {
			records.value = response.data
		} else {
			// 数据异常时设为空数组
			records.value = []
		}
	} catch (error) {
		// 错误日志记录
		console.error('加载改分记录失败:', error)
		// Token失效处理:清除本地存储并跳转到登录页
		if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
			localStorage.removeItem('token')
			localStorage.removeItem('userInfo')
			router.push('/login')
		} else {
			// 其他错误时设为空数组
			records.value = []
		}
	} finally {
		// 隐藏全局加载蒙版
		loadingMaskStore.hideLoadingMask()
		// 显示记录卡片动画
		showCardAnimation.value = true
		showPageAnimation.value = true
	}
}

/**
 * 返回上一页
 * @function goBack
 * @description 点击返回按钮时触发,跳转到导航页面
 */
const goBack = () => {
	router.push('/navigation')
}

// ===================== 生命周期钩子 =====================
/**
 * 组件挂载生命周期钩子
 * @description 组件挂载完成后立即加载积分调整记录
 */
onMounted(() => {
	loadRecords()
})
</script>

<template>
	<div class="ScoreChangeRecordsPageMobile-score-change-records-container" :class="{ 'ScoreChangeRecordsPageMobile-page-animate': showPageAnimation }">
		<!-- 全局加载蒙版 -->
		<LoadingMask/>
		<div class="ScoreChangeRecordsPageMobile-background-effects">
			<div class="ScoreChangeRecordsPageMobile-gradient-orb ScoreChangeRecordsPageMobile-orb-1"/>
			<div class="ScoreChangeRecordsPageMobile-gradient-orb ScoreChangeRecordsPageMobile-orb-2"/>
			<div class="ScoreChangeRecordsPageMobile-gradient-orb ScoreChangeRecordsPageMobile-orb-3"/>
		</div>

		<div class="ScoreChangeRecordsPageMobile-header">
			<div class="ScoreChangeRecordsPageMobile-header-content">
				<el-button
					class="ScoreChangeRecordsPageMobile-back-btn"
					type="primary"
					:icon="ArrowLeft"
					circle
					@click="goBack"/>
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊学生管理系统"
					class="ScoreChangeRecordsPageMobile-logo"
					title="切换主题模式"
					@click="toggleTheme"/>
					<div class="ScoreChangeRecordsPageMobile-title-section">
						<h1>积分变更记录</h1>
						<p>查看您的积分调整历史</p>
					</div>
				</div>
			</div>

			<div class="ScoreChangeRecordsPageMobile-main-content">
				<div class="ScoreChangeRecordsPageMobile-content-wrapper">
					<!-- 统计卡片 -->
					<div class="ScoreChangeRecordsPageMobile-stats-card">
						<div class="ScoreChangeRecordsPageMobile-stats-item">
							<div class="ScoreChangeRecordsPageMobile-stats-icon ScoreChangeRecordsPageMobile-total">
								<el-icon><Coin /></el-icon>
							</div>
							<div class="ScoreChangeRecordsPageMobile-stats-info">
								<span class="ScoreChangeRecordsPageMobile-stats-label">总记录数</span>
								<span class="ScoreChangeRecordsPageMobile-stats-value">{{ records.length }}</span>
							</div>
						</div>
						<div class="ScoreChangeRecordsPageMobile-stats-item">
							<div class="ScoreChangeRecordsPageMobile-stats-icon ScoreChangeRecordsPageMobile-positive">
								<el-icon><ArrowUp /></el-icon>
							</div>
							<div class="ScoreChangeRecordsPageMobile-stats-info">
								<span class="ScoreChangeRecordsPageMobile-stats-label">加分记录</span>
								<span class="ScoreChangeRecordsPageMobile-stats-value">{{ positiveCount }}</span>
							</div>
						</div>
						<div class="ScoreChangeRecordsPageMobile-stats-item">
							<div class="ScoreChangeRecordsPageMobile-stats-icon ScoreChangeRecordsPageMobile-negative">
								<el-icon><ArrowDown /></el-icon>
							</div>
							<div class="ScoreChangeRecordsPageMobile-stats-info">
								<span class="ScoreChangeRecordsPageMobile-stats-label">扣分记录</span>
								<span class="ScoreChangeRecordsPageMobile-stats-value">{{ negativeCount }}</span>
							</div>
						</div>
						<div class="ScoreChangeRecordsPageMobile-stats-item">
							<div class="ScoreChangeRecordsPageMobile-stats-icon ScoreChangeRecordsPageMobile-points">
								<el-icon><Box /></el-icon>
							</div>
							<div class="ScoreChangeRecordsPageMobile-stats-info">
								<span class="ScoreChangeRecordsPageMobile-stats-label">总调整分数</span>
								<span class="ScoreChangeRecordsPageMobile-stats-value">{{ totalPoints > 0 ? `+${totalPoints}` : totalPoints }}</span>
							</div>
						</div>
					</div>

					<!-- 空状态 -->
					<div v-if="records.length === 0" class="ScoreChangeRecordsPageMobile-empty-container">
					<el-icon><box /></el-icon>
					<span>暂无改分记录</span>
				</div>

				<!-- 记录列表 -->
				<div v-else class="ScoreChangeRecordsPageMobile-records-container">
					<div class="ScoreChangeRecordsPageMobile-records-list">
						<div
							v-for="(record, index) in sortedRecords"
							:key="index"
							class="ScoreChangeRecordsPageMobile-record-card"
							:class="{ 'ScoreChangeRecordsPageMobile-card-animate': showCardAnimation }"
							:style="{ animationDelay: `${index * 0.1}s` }"
						>
							<div class="ScoreChangeRecordsPageMobile-record-header">
								<span class="ScoreChangeRecordsPageMobile-record-time">{{ formatTime(record.createTime) }}</span>
								<span class="ScoreChangeRecordsPageMobile-record-points-badge" :class="{ 'ScoreChangeRecordsPageMobile-positive': record.adjustPoints >= 0, 'ScoreChangeRecordsPageMobile-negative': record.adjustPoints < 0 }">
									{{ record.adjustPoints > 0 ? `+${record.adjustPoints}` : record.adjustPoints }}
								</span>
							</div>
							<div class="ScoreChangeRecordsPageMobile-record-reason-text">{{ record.adjustReason }}</div>
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

