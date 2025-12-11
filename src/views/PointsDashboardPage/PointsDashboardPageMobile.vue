<template>
  <div class="points-dashboard-mobile">
    <div class="header">
      <el-button @click="goBack" class="back-btn" type="primary" :icon="ArrowLeft" circle></el-button>
      <img src="@/assets/AiWorkShop_icon.png" alt="AI坊" class="logo" @click="toggleTheme" title="切换主题模式">
      <h1>积分看板</h1>
    </div>

    <div class="content">
      <div class="time-selector">
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

      <div class="ranking-section">
        <h2>积分排行榜</h2>
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
                <span>{{ student.studentGrade }}年级</span>
                <span>{{ student.studentMajor }}</span>
                <span class="student-level" :class="getLevelClass(student.studentLevel)">
                  {{ getLevelName(student.studentLevel) }}
                </span>
              </div>
            </div>
            <div class="points-display-item">
              <span class="points-count">{{ student.points }}</span>
              <span class="points-label">分</span>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <h2>统计信息</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">最高积分</div>
            <div class="stat-value">{{ maxPoints }} 分</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">参与人数</div>
            <div class="stat-value">{{ totalParticipants }} 人</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">平均积分</div>
            <div class="stat-value">{{ averagePoints }} 分</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">总积分</div>
            <div class="stat-value">{{ totalPoints }} 分</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { ElButton, ElRadioGroup, ElRadioButton } from 'element-plus'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-radio-group.css'
import 'element-plus/theme-chalk/el-radio-button.css'
import { ArrowLeft } from '@element-plus/icons-vue'
import { 
  getCurrentMonthTop10Students, 
  getTopStudentsByTimeRange,
  getWeeklyRanking,
  getMonthlyRanking,
  getYearlyRanking,
  getLast7DaysRanking,
  getLast30DaysRanking
} from '@/api/attendance'

const router = useRouter()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore

const rankingList = ref([])
const selectedTimeRange = ref('month')
const selectedTopN = ref(16)

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

onMounted(async () => {
  await loadRankingData()
})
</script>

<style scoped>
.points-dashboard-mobile {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-bottom: 20px;
}

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  width: 40px;
  height: 40px;
  background: var(--primary-color);
  border: none;
}

.logo {
  width: 48px;
  height: 48px;
  cursor: pointer;
  border-radius: 12px;
}

.header h1 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
  flex: 1;
}

.content {
  padding: 20px;
}


.time-selector {
  margin-bottom: 20px;
}

.time-radio-group {
  width: 100%;
}

.ranking-section {
  margin-bottom: 20px;
}

.ranking-section h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: var(--text-primary);
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.ranking-item.top-three {
  background: rgba(251, 191, 36, 0.1);
  border-color: rgba(251, 191, 36, 0.2);
}

.rank-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
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
  font-size: 24px;
}

.student-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.student-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.student-details {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
  align-items: center;
  flex-wrap: wrap;
}

.student-level {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
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

.points-display-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
}

.points-count {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-color);
}

.points-label {
  font-size: 10px;
  color: var(--text-secondary);
}

.stats-section h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: var(--text-primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-item {
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}
</style>

