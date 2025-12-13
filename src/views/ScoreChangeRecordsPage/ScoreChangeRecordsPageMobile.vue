<template>
  <div class="score-change-records-container">
    <div class="background-effects">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>
    
    <div class="header">
      <div class="header-content">
        <el-button @click="goBack" class="back-btn" type="primary" :icon="ArrowLeft" circle></el-button>
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊学生管理系统" class="logo" @click="toggleTheme" title="切换主题模式">
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
              <el-icon size="20"><Document /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-label">总记录数</div>
              <div class="stats-value">{{ records.length }}</div>
            </div>
          </div>
          <div class="stats-item">
            <div class="stats-icon positive">
              <el-icon size="20"><ArrowUp /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-label">加分记录</div>
              <div class="stats-value">{{ positiveCount }}</div>
            </div>
          </div>
          <div class="stats-item">
            <div class="stats-icon negative">
              <el-icon size="20"><ArrowDown /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-label">扣分记录</div>
              <div class="stats-value">{{ negativeCount }}</div>
            </div>
          </div>
          <div class="stats-item">
            <div class="stats-icon points">
              <el-icon size="20"><Coin /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-label">总调整分数</div>
              <div class="stats-value">{{ totalPoints > 0 ? `+${totalPoints}` : totalPoints }}</div>
            </div>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>加载中...</span>
        </div>

        <!-- 空状态 -->
        <div v-else-if="records.length === 0" class="empty-container">
          <el-icon><Box /></el-icon>
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

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { ElButton, ElIcon } from 'element-plus'
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

const sortedRecords = computed(() => {
  return [...records.value].sort((a, b) => {
    const timeA = new Date(a.createTime).getTime()
    const timeB = new Date(b.createTime).getTime()
    return timeB - timeA // 最新的在前
  })
})

const positiveCount = computed(() => {
  return records.value.filter(r => r.adjustPoints > 0).length
})

const negativeCount = computed(() => {
  return records.value.filter(r => r.adjustPoints < 0).length
})

const totalPoints = computed(() => {
  return records.value.reduce((sum, r) => sum + r.adjustPoints, 0)
})

const formatTime = (timeString) => {
  if (!timeString) return '--'
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

<style scoped>
.score-change-records-container {
  min-height: 100vh;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.background-effects {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: float 20s ease-in-out infinite;
}

.orb-1 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  top: 60%;
  right: 10%;
  animation-delay: -7s;
}

.orb-3 {
  width: 180px;
  height: 180px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  bottom: 20%;
  left: 50%;
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-30px) rotate(120deg); }
  66% { transform: translateY(30px) rotate(240deg); }
}

.header {
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  width: 44px;
  height: 44px;
  background: var(--primary-color);
  border: none;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.25);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  touch-action: manipulation;
  flex-shrink: 0;
}

.back-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.logo {
  width: 48px;
  height: 48px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  touch-action: manipulation;
  flex-shrink: 0;
}

.logo:active {
  transform: scale(0.95);
  filter: brightness(1.2);
}

.title-section {
  flex: 1;
  min-width: 0;
}

.title-section h1 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  word-break: break-word;
}

.title-section p {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 4px 0 0 0;
  font-weight: 500;
  word-break: break-word;
}

.main-content {
  position: relative;
  z-index: 10;
  padding: 24px 20px;
  min-height: calc(100vh - 200px);
}

.content-wrapper {
  width: 100%;
  max-width: 100%;
}

.stats-card {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stats-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  touch-action: manipulation;
}

.stats-item:active {
  transform: scale(0.98);
  background: rgba(255, 255, 255, 0.12);
}

.stats-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stats-icon.total {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
}

.stats-icon.positive {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.stats-icon.negative {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.stats-icon.points {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
}

.stats-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.stats-label {
  font-size: 11px;
  color: var(--text-secondary);
  font-weight: 500;
  word-break: break-word;
}

.stats-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  word-break: break-word;
}

.loading-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.loading-container .el-icon {
  font-size: 40px;
  color: var(--primary-color);
}

.empty-container .el-icon {
  font-size: 56px;
  color: var(--text-secondary);
  opacity: 0.5;
}

.loading-container span,
.empty-container span {
  font-size: 14px;
  font-weight: 500;
}

.records-container {
  width: 100%;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(0, 242, 254, 0.05) 100%);
  border: 1px solid rgba(102, 126, 234, 0.15);
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  touch-action: manipulation;
}

.record-card:active {
  transform: scale(0.98);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(0, 242, 254, 0.08) 100%);
  border-color: rgba(102, 126, 234, 0.25);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 12px;
}

.record-time {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
  word-break: break-word;
  flex: 1;
  min-width: 0;
}

.record-points-badge {
  font-size: 14px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  min-width: 60px;
  text-align: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.record-points-badge.positive {
  color: #10b981;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.record-points-badge.negative {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.record-reason-text {
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.6;
  word-break: break-word;
}
</style>

