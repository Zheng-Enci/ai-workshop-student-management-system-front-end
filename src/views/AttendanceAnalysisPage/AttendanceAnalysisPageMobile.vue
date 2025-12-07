<template>
  <div class="attendance-analysis-mobile">
    <div class="mobile-header">
      <div class="header-left">
        <el-button 
          type="text" 
          @click="goBack" 
          class="back-button"
        >
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <img 
          src="@/assets/AiWorkShop_icon.png" 
          alt="AI坊" 
          class="header-icon"
          @click="toggleTheme"
        />
      </div>
      <h1 class="page-title">签到分析</h1>
    </div>

    <div class="mobile-content">
      <div class="time-range-selector">
        <el-segmented 
          v-model="selectedTimeRange" 
          :options="timeRangeOptions"
          @change="handleTimeRangeChange"
          size="small"
        />
      </div>

      <div class="mobile-stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ totalAttendance }}</div>
            <div class="stat-label">今日签到</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Clock /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ averageTime }}</div>
            <div class="stat-label">平均时间</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ periodStats.morning + periodStats.afternoon + periodStats.evening }}</div>
            <div class="stat-label">总时段</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Trophy /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ rankingList.length > 0 ? rankingList[0].name : '-' }}</div>
            <div class="stat-label">最早签到</div>
          </div>
        </div>
      </div>

      <div class="mobile-chart-section">
        <div class="chart-header">
          <h3>今日签到时段分布</h3>
          <el-icon class="header-icon"><PieChart /></el-icon>
        </div>
        <div ref="periodChart" class="mobile-chart"></div>
      </div>

      <div class="mobile-chart-section">
        <div class="chart-header">
          <h3>签到时间线</h3>
          <el-icon class="header-icon"><TrendCharts /></el-icon>
        </div>
        <div ref="timelineChart" class="mobile-chart"></div>
      </div>

      <div class="mobile-ranking-section">
        <div class="ranking-header">
          <h3>今日签到排行榜</h3>
          <el-icon class="header-icon"><Trophy /></el-icon>
        </div>
        <div class="mobile-ranking-list">
          <div 
            v-for="(item, index) in rankingList.slice(0, 10)" 
            :key="index"
            class="mobile-ranking-item"
          >
            <div class="mobile-rank-number" :class="getRankingClass(index)">
              {{ index + 1 }}
            </div>
            <div class="mobile-student-info">
              <div class="mobile-student-name">{{ item.name }}</div>
              <div class="mobile-attendance-time">{{ formatTime(item.attendanceTime) }}</div>
            </div>
            <div class="mobile-rank-badge" v-if="index < 3">
              <el-icon><Trophy /></el-icon>
            </div>
          </div>
        </div>
      </div>

      <div class="mobile-realtime-section">
        <div class="realtime-header">
          <h3>实时签到动态</h3>
          <el-icon class="header-icon"><TrendCharts /></el-icon>
        </div>
        <div class="mobile-realtime-stats">
          <div class="realtime-item">
            <div class="realtime-label">最近签到</div>
            <div class="realtime-value" v-if="latestAttendance">
              {{ latestAttendance.name }} - {{ formatTime(latestAttendance.attendanceTime) }}
            </div>
            <div class="realtime-value" v-else>暂无数据</div>
          </div>
          <div class="realtime-item">
            <div class="realtime-label">平均签到时间</div>
            <div class="realtime-value">{{ averageTime }}</div>
          </div>
          <div class="realtime-item">
            <div class="realtime-label">最早签到</div>
            <div class="realtime-value" v-if="earliestAttendance">
              {{ earliestAttendance.name }} - {{ formatTime(earliestAttendance.attendanceTime) }}
            </div>
            <div class="realtime-value" v-else>暂无数据</div>
          </div>
        </div>
      </div>
    </div>

    <div class="mobile-footer">
      <div class="last-update">
        最后更新: {{ lastUpdateTime }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElButton, ElIcon, ElSegmented } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-segmented.css'
import { ArrowLeft, User, Clock, TrendCharts, Trophy, PieChart } from '@element-plus/icons-vue'
// ECharts 按需引入
import * as echarts from 'echarts/core'
import { PieChart as EChartsPieChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 注册需要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  EChartsPieChart,
  LineChart,
  CanvasRenderer
])
import { useThemeStore } from '@/stores/theme'
import { getTodayAttendanceRecords, getTopStudentsByTimeRange } from '@/api/attendance'

const router = useRouter()
const themeStore = useThemeStore()

const goBack = () => {
  router.go(-1)
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const selectedTimeRange = ref('today')
const timeRangeOptions = [
  { label: '今日', value: 'today' },
  { label: '昨月', value: 'lastMonth' },
  { label: '自定义', value: 'custom' }
]

const attendanceRecords = ref([])
const totalAttendance = ref(0)
const periodStats = ref({
  morning: 0,
  afternoon: 0,
  evening: 0
})
const rankingList = ref([])
const latestAttendance = ref(null)
const earliestAttendance = ref(null)
const averageTime = ref('')
const lastUpdateTime = ref('')

const periodChart = ref(null)
const timelineChart = ref(null)
let periodChartInstance = null
let timelineChartInstance = null
let refreshTimer = null

const loadAttendanceData = async () => {
  try {
    const response = await getTodayAttendanceRecords()
    
    if (response && response.code === 200) {
      attendanceRecords.value = response.data || []
      totalAttendance.value = attendanceRecords.value.length
      periodStats.value = calculatePeriodStats(attendanceRecords.value)
      
      rankingList.value = [...attendanceRecords.value].sort((a, b) => 
        new Date(a.attendanceTime) - new Date(b.attendanceTime)
      )
      
      if (attendanceRecords.value.length > 0) {
        latestAttendance.value = attendanceRecords.value[attendanceRecords.value.length - 1]
        earliestAttendance.value = rankingList.value[0]
        averageTime.value = calculateAverageTime(attendanceRecords.value)
      }
      
      lastUpdateTime.value = new Date().toLocaleTimeString('zh-CN')
      
      setTimeout(() => {
        initChartsWithTheme()
      }, 200)
    }
  } catch (error) {
    ElMessage.error('加载签到数据失败')
  }
}

const loadTimelineData = async () => {
  try {
    let response
    if (selectedTimeRange.value === 'today') {
      response = await getTodayAttendanceRecords()
    } else if (selectedTimeRange.value === 'lastMonth') {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - 1)
      response = await getTopStudentsByTimeRange(
        startDate.toISOString(),
        endDate.toISOString(),
        100
      )
    }
    
    if (response && response.code === 200) {
      setTimeout(async () => {
        await initTimelineChart()
      }, 100)
    }
  } catch (error) {
    ElMessage.error('加载时间线数据失败')
  }
}

const calculatePeriodStats = (records) => {
  const stats = { morning: 0, afternoon: 0, evening: 0 }
  
  records.forEach(record => {
    const hour = new Date(record.attendanceTime).getHours()
    if (hour >= 8 && hour < 11) {
      stats.morning++
    } else if (hour >= 14 && hour < 17) {
      stats.afternoon++
    } else if (hour >= 19 && hour < 22) {
      stats.evening++
    }
  })
  
  return stats
}

const calculateAverageTime = (records) => {
  if (records.length === 0) return '--:--'
  
  const times = records.map(item => new Date(item.attendanceTime).getTime())
  const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length
  return new Date(avgTime).toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatTime = (timeString) => {
  const date = new Date(timeString)
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  })
}

const getRankingClass = (index) => {
  if (index === 0) return 'first'
  if (index === 1) return 'second'
  if (index === 2) return 'third'
  return ''
}

const initPeriodChart = async () => {
  await nextTick()
  
  if (!periodChart.value) return
  
  if (periodChartInstance) {
    periodChartInstance.dispose()
  }
  
  periodChartInstance = echarts.init(periodChart.value)
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: '5%',
      textStyle: {
        color: themeStore.isDark ? '#ffffff' : '#333333'
      }
    },
    series: [{
      name: '签到时段',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 8,
        borderColor: themeStore.isDark ? '#2c2c2c' : '#ffffff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold',
          color: themeStore.isDark ? '#ffffff' : '#333333'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: periodStats.value.morning, name: '上午', itemStyle: { color: '#ff6b6b' } },
        { value: periodStats.value.afternoon, name: '下午', itemStyle: { color: '#4ecdc4' } },
        { value: periodStats.value.evening, name: '晚上', itemStyle: { color: '#45b7d1' } }
      ]
    }]
  }
  
  periodChartInstance.setOption(option)
}

const initTimelineChart = async () => {
  await nextTick()
  
  if (!timelineChart.value) return
  
  if (timelineChartInstance) {
    timelineChartInstance.dispose()
  }
  
  const containerWidth = timelineChart.value.offsetWidth
  const containerHeight = containerWidth / 2
  
  timelineChartInstance = echarts.init(timelineChart.value, null, {
    width: containerWidth,
    height: containerHeight
  })
  
  setTimeout(() => {
    if (timelineChartInstance) {
      timelineChartInstance.resize({
        width: containerWidth,
        height: containerHeight
      })
    }
  }, 200)
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: themeStore.isDark ? 'rgba(50, 50, 50, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      borderColor: themeStore.isDark ? '#666' : '#ddd',
      textStyle: {
        color: themeStore.isDark ? '#fff' : '#333'
      },
      formatter: function(params) {
        const data = params[0]
        const date = new Date(data.axisValue)
        const timeStr = date.toLocaleTimeString('zh-CN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
        return `${timeStr}<br/>签到人数: ${data.value}`
      }
    },
    grid: {
      left: '8%',
      right: '8%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'time',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: themeStore.isDark ? '#999' : '#666',
        fontSize: 8,
        formatter: function(value) {
          const date = new Date(value)
          return date.toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: themeStore.isDark ? '#333' : '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: themeStore.isDark ? '#999' : '#666',
        fontSize: 8
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: themeStore.isDark ? '#333' : '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    series: [{
      name: '签到人数',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 3,
      lineStyle: {
        width: 2,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [{
            offset: 0, color: '#667eea'
          }, {
            offset: 1, color: '#764ba2'
          }]
        }
      },
      itemStyle: {
        color: '#667eea',
        borderColor: '#fff',
        borderWidth: 2,
        shadowBlur: 10,
        shadowColor: 'rgba(102, 126, 234, 0.3)'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(102, 126, 234, 0.4)'
          }, {
            offset: 1, color: 'rgba(118, 75, 162, 0.1)'
          }]
        }
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 20,
          shadowColor: 'rgba(102, 126, 234, 0.5)'
        }
      },
      data: []
    }]
  }
  
  timelineChartInstance.setOption(option)
}

const initChartsWithTheme = () => {
  initPeriodChart()
  initTimelineChart()
  
  setTimeout(() => {
    if (timelineChartInstance && timelineChart.value) {
      const containerWidth = timelineChart.value.offsetWidth
      const containerHeight = containerWidth / 2
      timelineChartInstance.resize({
        width: containerWidth,
        height: containerHeight
      })
    }
    if (periodChartInstance) {
      periodChartInstance.resize()
    }
  }, 300)
}

const handleTimeRangeChange = async () => {
  try {
    await loadTimelineData()
    setTimeout(() => {
      if (timelineChartInstance && timelineChart.value) {
        const containerWidth = timelineChart.value.offsetWidth
        const containerHeight = containerWidth / 2
        timelineChartInstance.resize({
          width: containerWidth,
          height: containerHeight
        })
      }
    }, 100)
  } catch (error) {
    ElMessage.error('加载时间线数据失败')
  }
}


const startAutoRefresh = () => {
  refreshTimer = setInterval(() => {
    loadAttendanceData()
  }, 15000)
}

const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

onMounted(async () => {
  await loadAttendanceData()
  await loadTimelineData()
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
  if (periodChartInstance) {
    periodChartInstance.dispose()
  }
  if (timelineChartInstance) {
    timelineChartInstance.dispose()
  }
})
</script>

<style scoped>
.attendance-analysis-mobile {
  min-height: 100vh;
  background: var(--bg-color);
  color: var(--text-color);
  padding: 0;
}

.mobile-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-button {
  color: var(--text-color);
  font-size: 18px;
  padding: 8px;
}

.header-icon {
  width: 32px;
  height: 32px;
  cursor: pointer;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.header-icon:hover {
  transform: scale(1.1);
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: var(--text-color);
}

.mobile-content {
  padding: 16px;
}

.time-range-selector {
  margin-bottom: 20px;
}

.mobile-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--border-color);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.mobile-chart-section {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.mobile-chart-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.chart-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--text-color);
  position: relative;
}

.chart-header h3::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 1px;
}

.mobile-chart {
  width: 100%;
  height: 200px;
  border-radius: 12px;
  background: var(--card-bg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.mobile-ranking-section {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid var(--border-color);
}

.ranking-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.ranking-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--text-color);
}

.mobile-ranking-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-ranking-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 1px solid var(--border-color);
  box-shadow: 0 8px 32px var(--shadow-color);
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.mobile-rank-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  background: var(--text-secondary);
  color: white;
  flex-shrink: 0;
  margin-right: 10px;
}

.mobile-rank-number.first {
  background: #ffd700;
  color: #333;
}

.mobile-rank-number.second {
  background: #c0c0c0;
  color: #333;
}

.mobile-rank-number.third {
  background: #cd7f32;
  color: white;
}

.mobile-student-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  margin-right: 6px;
}

.mobile-student-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.mobile-attendance-time {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.2;
  white-space: nowrap;
}

.mobile-rank-badge {
  position: absolute;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
  z-index: 10;
  transition: all 0.3s ease;
}

.mobile-realtime-section {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid var(--border-color);
}

.realtime-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.realtime-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--text-color);
}

.mobile-realtime-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.realtime-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--bg-color);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.realtime-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.realtime-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
  text-align: right;
  max-width: 60%;
}

.mobile-footer {
  padding: 16px;
  text-align: center;
}

.last-update {
  font-size: 12px;
  color: var(--text-secondary);
}

@media (max-width: 480px) {
  .mobile-stats-grid {
    grid-template-columns: 1fr;
  }
  
  .mobile-chart {
    height: 200px;
  }
  
  .stat-card {
    padding: 12px;
  }
  
  .stat-icon {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
  
  .stat-value {
    font-size: 18px;
  }
}
</style>
