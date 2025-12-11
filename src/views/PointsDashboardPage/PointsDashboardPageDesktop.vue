<template>
  <div class="points-dashboard-container">
    <div class="header">
      <div class="header-left">
        <el-button @click="goBack" class="back-btn" type="primary" :icon="ArrowLeft" circle></el-button>
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊" class="logo" @click="toggleTheme" title="切换主题模式">
        <div class="title-section">
          <h1>积分看板</h1>
          <p>Points Dashboard</p>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="left-section">
        <div class="ranking-card">
          <h2>积分排行榜</h2>
          <div class="time-range-selector">
            <el-radio-group 
              v-model="selectedTimeRange" 
              @change="handleTimeRangeChange"
              size="small"
              class="time-radio-group"
            >
              <el-radio-button
                v-for="option in timeRangeOptions.filter(opt => opt.value !== 'custom')"
                :key="option.value"
                :label="option.value"
              >
                {{ option.label }}
              </el-radio-button>
            </el-radio-group>
          </div>
          <div ref="rankingChart" class="ranking-chart"></div>
          <div class="ranking-list">
            <div 
              v-for="(student, index) in rankingList" 
              :key="index"
              class="ranking-item"
              :class="{ 'top-three': index < 3 }"
            >
              <div class="rank-number" :class="getRankClass(index)">
                <span v-if="index === 0" class="rank-icon">🥇</span>
                <span v-else-if="index === 1" class="rank-icon">🥈</span>
                <span v-else-if="index === 2" class="rank-icon">🥉</span>
                <span v-else class="rank-text">{{ index + 1 }}</span>
              </div>
              <div class="student-info">
                <div class="student-name">{{ student.studentName }}</div>
                <div class="student-details">
                  <span class="student-grade">{{ student.studentGrade }}年级</span>
                  <span class="student-major">{{ student.studentMajor }}</span>
                  <span class="student-level" :class="getLevelClass(student.studentLevel)">
                    {{ getLevelName(student.studentLevel) }}
                  </span>
                </div>
              </div>
              <div class="student-points">
                <div class="points-count">{{ student.points }}</div>
                <div class="points-label">积分</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="right-section">
        <div class="stats-card">
          <h2>统计信息</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-icon">
                <el-icon><Trophy /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-label">最高积分</div>
                <div class="stat-value">{{ maxPoints }} 分</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">
                <el-icon><User /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-label">参与人数</div>
                <div class="stat-value">{{ totalParticipants }} 人</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">
                <el-icon><DataAnalysis /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-label">平均积分</div>
                <div class="stat-value">{{ averagePoints }} 分</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-label">总积分</div>
                <div class="stat-value">{{ totalPoints }} 分</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { ElButton, ElIcon, ElRadioGroup, ElRadioButton } from 'element-plus'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-radio-group.css'
import 'element-plus/theme-chalk/el-radio-button.css'
import { ArrowLeft, Trophy, User, DataAnalysis, TrendCharts } from '@element-plus/icons-vue'
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import {
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { 
  getCurrentMonthTop10Students, 
  getTopStudentsByTimeRange,
  getWeeklyRanking,
  getMonthlyRanking,
  getYearlyRanking,
  getLast7DaysRanking,
  getLast30DaysRanking
} from '@/api/attendance'

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer
])

const router = useRouter()
const themeStore = useThemeStore()
const { toggleTheme, isDark } = themeStore

const rankingList = ref([])
const selectedTimeRange = ref('month')
const selectedTopN = ref(16)
const rankingChart = ref(null)
let chartInstance = null

const maxPoints = ref(0)
const totalParticipants = ref(0)
const averagePoints = ref(0)
const totalPoints = ref(0)

const timeRangeOptions = [
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '本年', value: 'year' },
  { label: '近7天', value: 'last7days' },
  { label: '近30天', value: 'last30days' },
  { label: '全部', value: 'all' }
]

const goBack = () => {
  router.push('/navigation')
}

const getCurrentWeekStart = () => {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
  const monday = new Date(now.setDate(diff))
  return monday.toISOString().split('T')[0]
}

const handleTimeRangeChange = async () => {
  await loadRankingData()
}

const loadRankingData = async () => {
  try {
    let response
    
    switch (selectedTimeRange.value) {
      case 'week': {
        const weekStart = getCurrentWeekStart()
        response = await getWeeklyRanking(weekStart, selectedTopN.value)
        break
      }
      case 'month': {
        const now = new Date()
        response = await getMonthlyRanking(now.getFullYear(), now.getMonth() + 1, selectedTopN.value)
        break
      }
      case 'year':
        response = await getYearlyRanking(new Date().getFullYear(), selectedTopN.value)
        break
      case 'last7days':
        response = await getLast7DaysRanking(selectedTopN.value)
        break
      case 'last30days': {
        response = await getLast30DaysRanking(selectedTopN.value)
        break
      }
      case 'all': {
        const PROJECT_LAUNCH_DATE = new Date('2024-09-09T00:00:00')
        const now = new Date()
        const startTime = PROJECT_LAUNCH_DATE.toISOString().split('T')[0] + 'T00:00:00'
        const endTime = now.toISOString().split('T')[0] + 'T23:59:59'
        response = await getTopStudentsByTimeRange(startTime, endTime, selectedTopN.value)
        break
      }
      default:
        response = await getCurrentMonthTop10Students()
        break
    }

    if (response.code === 200) {
      const list = response.data || []
      
      rankingList.value = list.map((item) => ({
        ...item,
        attendanceCount: item.attendanceCount || 0,
        points: Math.round((item.attendanceCount || 0) * 0.3)
      }))

      calculateStats()
      await initRankingChart()
    }
  } catch (error) {
    return
  }
}

const calculateStats = () => {
  if (rankingList.value.length === 0) {
    maxPoints.value = 0
    totalParticipants.value = 0
    averagePoints.value = 0
    totalPoints.value = 0
    return
  }

  const points = rankingList.value.map(item => item.points)
  maxPoints.value = Math.max(...points)
  totalParticipants.value = rankingList.value.length
  totalPoints.value = points.reduce((sum, p) => sum + p, 0)
  averagePoints.value = Math.round(totalPoints.value / totalParticipants.value)
}

const getRankClass = (index) => {
  if (index === 0) return 'rank-gold'
  if (index === 1) return 'rank-silver'
  if (index === 2) return 'rank-bronze'
  return ''
}

const getLevelName = (levelCode) => {
  const levelMap = {
    0: '社团成员',
    1: '普通成员',
    2: '核心成员',
    3: '管理员'
  }
  return levelMap[levelCode] || '未知'
}

const getLevelClass = (levelCode) => {
  const levelClassMap = {
    0: 'club-member',
    1: 'normal-member',
    2: 'core-member',
    3: 'admin'
  }
  return levelClassMap[levelCode] || 'club-member'
}

const initRankingChart = async () => {
  if (!rankingChart.value) return

  await nextTick()

  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(rankingChart.value)

  const names = rankingList.value.map(item => item.studentName)
  const points = rankingList.value.map(item => item.points)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: isDark.value ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderColor: isDark.value ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      textStyle: {
        color: isDark.value ? '#ffffff' : '#2c3e50'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: isDark.value ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      axisLabel: {
        color: isDark.value ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
      },
      splitLine: {
        lineStyle: {
          color: isDark.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: names,
      axisLine: {
        lineStyle: {
          color: isDark.value ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      axisLabel: {
        color: isDark.value ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
      }
    },
    series: [
      {
        name: '积分',
        type: 'bar',
        data: points,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' }
          ])
        },
        label: {
          show: true,
          position: 'right',
          color: isDark.value ? '#ffffff' : '#2c3e50'
        }
      }
    ]
  }

  chartInstance.setOption(option)

  // 清理ECharts自动生成的容器div
  await nextTick()
  setTimeout(() => {
    const chartContainer = rankingChart.value
    if (chartContainer) {
      // 查找并删除包含_echarts_instance_属性的div及其内部div
      const echartsContainer = chartContainer.querySelector('div[_echarts_instance_]')
      if (echartsContainer) {
        // 删除内层div（包含特定样式的div）
        const innerDiv = echartsContainer.querySelector('div[style*="position: relative"][style*="width: 663px"][style*="height: 400px"]')
        if (innerDiv && innerDiv.parentNode === echartsContainer) {
          echartsContainer.removeChild(innerDiv)
        }
        // 删除外层容器div（包含_echarts_instance_属性的div）
        if (echartsContainer.parentNode === chartContainer) {
          chartContainer.removeChild(echartsContainer)
        }
      }
    }
  }, 100)

  window.addEventListener('resize', () => {
    if (chartInstance) {
      chartInstance.resize()
    }
  })
}

onMounted(async () => {
  await loadRankingData()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<style scoped>
.points-dashboard-container {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-bottom: 40px;
}

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.back-btn {
  width: 48px;
  height: 48px;
  background: var(--primary-color);
  border: none;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.logo {
  width: 64px;
  height: 64px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
}

.logo:hover {
  transform: scale(1.1) rotate(5deg);
  filter: brightness(1.2);
}

.title-section h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-section p {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 4px 0 0 0;
  font-weight: 500;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 40px 60px;
  max-width: 1600px;
  margin: 0 auto;
}

.left-section,
.right-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.ranking-card,
.stats-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
}

.ranking-card h2,
.stats-card h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 24px 0;
  color: var(--text-primary);
}

.ranking-chart {
  width: 100%;
  height: 400px;
  margin-bottom: 24px;
}

.time-range-selector {
  margin-bottom: 24px;
}

.time-radio-group {
  width: 100%;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.ranking-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
}

.ranking-item.top-three {
  background: rgba(251, 191, 36, 0.1);
  border-color: rgba(251, 191, 36, 0.2);
}

.rank-number {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-weight: 600;
  font-size: 18px;
}

.rank-gold {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
}

.rank-silver {
  background: linear-gradient(135deg, #94a3b8, #64748b);
  color: white;
}

.rank-bronze {
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
}

.rank-text {
  color: var(--text-secondary);
}

.rank-icon {
  font-size: 32px;
}

.student-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.student-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.student-details {
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: var(--text-secondary);
  align-items: center;
}

.student-level {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.student-level.club-member {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.student-level.normal-member {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.student-level.core-member {
  background: rgba(251, 191, 36, 0.1);
  color: #fbbf24;
}

.student-level.admin {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.student-points {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.points-count {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
}

.points-label {
  font-size: 12px;
  color: var(--text-secondary);
}


.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  color: var(--primary-color);
  font-size: 24px;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 16px 20px;
  }

  .main-content {
    padding: 20px;
  }

  .points-number {
    font-size: 48px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>

