<template>
  <div class="attendance-analysis-container">
    <div class="header">
      <div class="header-left">
        <el-button @click="goBack" class="back-btn" type="primary" :icon="ArrowLeft" circle></el-button>
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊" class="logo">
        <div class="title-section">
          <h1>今日签到分析</h1>
          <p>Attendance Analysis Dashboard</p>
        </div>
      </div>
      <div class="header-right">
        <div class="refresh-section">
          <el-button @click="refreshData" :loading="isLoading" type="primary" :icon="Refresh" circle></el-button>
          <span class="last-update">最后更新: {{ lastUpdateTime }}</span>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="content-grid">
        <div class="left-column">
          <div class="chart-card">
            <div class="card-header">
              <h3>签到时段分布</h3>
              <el-icon class="header-icon"><PieChart /></el-icon>
            </div>
            <div ref="periodChart" class="chart"></div>
          </div>

          <div class="chart-card">
            <div class="card-header">
              <h3>签到时间线</h3>
              <el-icon class="header-icon"><Clock /></el-icon>
            </div>
            <div ref="timelineChart" class="timeline-chart"></div>
          </div>
        </div>

        <div class="right-column">
          <div class="chart-card">
            <div class="card-header">
              <h3>签到排行榜</h3>
              <el-icon class="header-icon"><Trophy /></el-icon>
            </div>
            <div class="ranking-list">
              <div v-if="isLoading" class="loading-overlay">
                <div class="loading-spinner"></div>
              </div>
              <div 
                v-for="(record, index) in rankingList" 
                :key="index"
                class="ranking-item"
                :class="getRankingClass(index)"
              >
                <div class="rank-number">{{ index + 1 }}</div>
                <div class="student-info">
                  <div class="student-name">{{ record.name }}</div>
                  <div class="student-details">
                    <span class="student-level" :class="getLevelClass(studentDetails[record.scheduleId]?.levelName)">
                      {{ studentDetails[record.scheduleId]?.levelName || '社团成员' }}
                    </span>
                    <span class="student-college">{{ studentDetails[record.scheduleId]?.college || '未知学院' }}</span>
                    <span class="student-major">{{ studentDetails[record.scheduleId]?.major || '未知专业' }}</span>
                    <span class="student-grade">{{ studentDetails[record.scheduleId]?.grade || '?' }}年级</span>
                  </div>
                </div>
                <div class="attendance-time">{{ formatTime(record.attendanceTime) }}</div>
                <div class="rank-badge" v-if="index < 3">
                  <el-icon v-if="index === 0"><Trophy /></el-icon>
                  <el-icon v-else-if="index === 1"><Medal /></el-icon>
                  <el-icon v-else><Trophy /></el-icon>
                </div>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <div class="card-header">
              <h3>实时签到动态</h3>
              <el-icon class="header-icon"><TrendCharts /></el-icon>
            </div>
            <div class="realtime-stats">
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, 
  Refresh, 
  PieChart, 
  Clock, 
  Trophy, 
  Medal, 
  TrendCharts 
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { getTodayAttendanceRecords, getAllStudentsWithSpecialPassword, getStudentLevel } from '@/api/user'

const router = useRouter()

const isLoading = ref(false)
const lastUpdateTime = ref('')
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
const studentDetails = ref({})
const allStudents = ref([])

let periodChartInstance = null
let timelineChartInstance = null
let refreshTimer = null

const goBack = () => {
  router.go(-1)
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
  if (index === 0) return 'rank-first'
  if (index === 1) return 'rank-second'
  if (index === 2) return 'rank-third'
  return 'rank-normal'
}

const getLevelClass = (levelName) => {
  if (levelName === '管理员') return 'level-admin'
  if (levelName === '核心成员') return 'level-core'
  if (levelName === '普通成员') return 'level-normal'
  return 'level-club'
}

const calculatePeriodStats = (records) => {
  const stats = { morning: 0, afternoon: 0, evening: 0 }
  
  records.forEach(record => {
    const hour = new Date(record.attendanceTime).getHours()
    if (hour >= 8 && hour < 12) stats.morning++
    else if (hour >= 14 && hour < 18) stats.afternoon++
    else if (hour >= 19 && hour < 22) stats.evening++
  })
  
  return stats
}

const calculateAverageTime = (records) => {
  if (records.length === 0) return '暂无数据'
  
  const totalMinutes = records.reduce((sum, record) => {
    const date = new Date(record.attendanceTime)
    return sum + date.getHours() * 60 + date.getMinutes()
  }, 0)
  
  const avgMinutes = Math.round(totalMinutes / records.length)
  const hours = Math.floor(avgMinutes / 60)
  const minutes = avgMinutes % 60
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

const loadStudentDetails = async () => {
  try {
    const response = await getAllStudentsWithSpecialPassword('axiezhixingi')
    if (response.code === 200 && response.data) {
      allStudents.value = response.data
      
      const details = {}
      for (const student of allStudents.value) {
        try {
          const levelResponse = await getStudentLevel(student.studentId)
          if (levelResponse.code === 200 && levelResponse.data) {
            details[student.studentId] = {
              ...student,
              levelName: levelResponse.data.levelName
            }
          } else {
            details[student.studentId] = {
              ...student,
              levelName: '社团成员'
            }
          }
        } catch (error) {
          details[student.studentId] = {
            ...student,
            levelName: '社团成员'
          }
        }
      }
      studentDetails.value = details
    }
  } catch (error) {
    console.error('获取学生详细信息失败:', error)
  }
}

const initPeriodChart = () => {
  if (!periodChartInstance) {
    const chartDom = document.querySelector('.chart')
    if (!chartDom) return
    periodChartInstance = echarts.init(chartDom)
  }

  const total = periodStats.value.morning + periodStats.value.afternoon + periodStats.value.evening
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}人 ({d}%)'
    },
    series: [
      {
        name: '签到时段',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside',
          formatter: function(params) {
            const percent = total > 0 ? ((params.value / total) * 100).toFixed(1) : 0
            return `${params.name}\n${params.value}人\n${percent}%`
          },
          fontSize: 14,
          fontWeight: 'bold',
          color: '#2c3e50'
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 10,
          lineStyle: {
            color: '#999'
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
        data: [
          { 
            value: periodStats.value.morning, 
            name: '上午',
            itemStyle: { 
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 1, y2: 1,
                colorStops: [
                  { offset: 0, color: '#ff6b6b' },
                  { offset: 1, color: '#ffa726' }
                ]
              }
            }
          },
          { 
            value: periodStats.value.afternoon, 
            name: '下午',
            itemStyle: { 
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 1, y2: 1,
                colorStops: [
                  { offset: 0, color: '#00d4ff' },
                  { offset: 1, color: '#5b21b6' }
                ]
              }
            }
          },
          { 
            value: periodStats.value.evening, 
            name: '晚上',
            itemStyle: { 
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 1, y2: 1,
                colorStops: [
                  { offset: 0, color: '#ec4899' },
                  { offset: 1, color: '#8b5cf6' }
                ]
              }
            }
          }
        ]
      },
      {
        name: '总人数',
        type: 'pie',
        radius: ['0%', '35%'],
        center: ['50%', '50%'],
        label: {
          show: true,
          position: 'center',
          formatter: function() {
            return `今日签到\n总人数\n${totalAttendance.value}人`
          },
          fontSize: 18,
          fontWeight: 'bold',
          color: '#2c3e50'
        },
        itemStyle: {
          color: 'transparent'
        },
        data: [1]
      }
    ]
  }

  periodChartInstance.setOption(option)
}

const initTimelineChart = () => {
  if (!timelineChartInstance) {
    const chartDom = document.querySelector('.timeline-chart')
    if (!chartDom) return
    timelineChartInstance = echarts.init(chartDom)
  }

  const sortedRecords = [...attendanceRecords.value].sort((a, b) => 
    new Date(a.attendanceTime) - new Date(b.attendanceTime)
  )

  const timeData = sortedRecords.map(record => {
    const date = new Date(record.attendanceTime)
    return [
      date.getHours() + date.getMinutes() / 60,
      record.name,
      record.scheduleId,
      record.attendanceTime
    ]
  })

  const maxTime = timeData.length > 0 ? Math.max(...timeData.map(item => item[0])) : 22
  const minTime = timeData.length > 0 ? Math.min(...timeData.map(item => item[0])) : 8
  const timeRange = maxTime - minTime
  const padding = Math.max(0.5, timeRange * 0.1)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        const data = params.data
        const time = new Date(data[3]).toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
        return `${data[1]} (${data[2]})<br/>签到时间: ${time}`
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: '时间',
      nameLocation: 'middle',
      nameGap: 30,
      min: Math.max(8, minTime - padding),
      max: maxTime,
      interval: timeRange > 6 ? 2 : 0.5,
      axisLabel: {
        formatter: function(value) {
          const hour = Math.floor(value)
          const minute = Math.round((value - hour) * 60)
          const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
          if (value >= 8 && value < 12) return `${timeStr} 上午`
          if (value >= 12 && value < 18) return `${timeStr} 下午`
          if (value >= 18 && value <= 22) return `${timeStr} 晚上`
          return timeStr
        }
      },
      axisLine: {
        lineStyle: {
          color: '#667eea'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '签到人数',
      nameLocation: 'middle',
      nameGap: 50,
      axisLabel: {
        formatter: '{value}人'
      },
      axisLine: {
        lineStyle: {
          color: '#667eea'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '签到时间线',
        type: 'scatter',
        data: timeData,
        symbolSize: function() {
          return 8
        },
        itemStyle: {
          color: function(params) {
            const hour = params.data[0]
            if (hour >= 8 && hour < 12) return '#ff6b6b'
            if (hour >= 14 && hour < 18) return '#00d4ff'
            if (hour >= 19 && hour < 22) return '#ec4899'
            return '#8b5cf6'
          },
          borderColor: '#fff',
          borderWidth: 2,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      },
      {
        name: '签到趋势',
        type: 'line',
        data: timeData.map((item, index) => [item[0], index + 1]),
        lineStyle: {
          color: '#00d4ff',
          width: 3,
          type: 'solid',
          shadowBlur: 10,
          shadowColor: 'rgba(0, 212, 255, 0.3)'
        },
        itemStyle: {
          color: 'transparent'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(0, 212, 255, 0.4)'
              },
              {
                offset: 1,
                color: 'rgba(0, 212, 255, 0.1)'
              }
            ]
          }
        }
      }
    ]
  }

  timelineChartInstance.setOption(option)
}

const loadAttendanceData = async () => {
  try {
    isLoading.value = true
    
    await Promise.all([
      getTodayAttendanceRecords(),
      loadStudentDetails()
    ])
    
    const response = await getTodayAttendanceRecords()
    
    if (response.code === 200) {
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
        initPeriodChart()
        initTimelineChart()
      }, 100)
    }
  } catch (error) {
    ElMessage.error(error.message || '加载签到数据失败')
  } finally {
    isLoading.value = false
  }
}

const refreshData = () => {
  loadAttendanceData()
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

onMounted(() => {
  loadAttendanceData()
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
.attendance-analysis-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px 30px;
  border-radius: 20px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-btn {
  width: 50px;
  height: 50px;
  font-size: 18px;
}

.logo {
  width: 50px;
  height: 50px;
  border-radius: 12px;
}

.title-section h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-section p {
  margin: 5px 0 0 0;
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.refresh-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.last-update {
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 500;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}


.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.chart-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f8f9fa;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
}

.header-icon {
  font-size: 20px;
  color: #667eea;
}

.chart {
  width: 100%;
  height: 300px;
}

.timeline-chart {
  width: 100%;
  height: 400px;
}

.timeline-container {
  position: relative;
  max-height: 400px;
  overflow-y: auto;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #667eea, #764ba2);
}

.timeline-item {
  position: relative;
  margin-bottom: 20px;
  padding-left: 20px;
}

.timeline-dot {
  position: absolute;
  left: -25px;
  top: 8px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 0 3px #667eea;
}

.morning-period .timeline-dot {
  box-shadow: 0 0 0 3px #ff9f43;
}

.afternoon-period .timeline-dot {
  box-shadow: 0 0 0 3px #10ac84;
}

.evening-period .timeline-dot {
  box-shadow: 0 0 0 3px #5f27cd;
}

.timeline-content {
  background: #f8f9fa;
  padding: 15px 20px;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.morning-period .timeline-content {
  border-left-color: #ff9f43;
}

.afternoon-period .timeline-content {
  border-left-color: #10ac84;
}

.evening-period .timeline-content {
  border-left-color: #5f27cd;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.student-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 16px;
}

.student-id {
  color: #7f8c8d;
  font-size: 14px;
}

.attendance-time {
  color: #667eea;
  font-weight: 600;
  font-size: 14px;
}

.ranking-list {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 212, 255, 0.6) rgba(0, 0, 0, 0.2);
}

.ranking-list::-webkit-scrollbar {
  width: 8px;
}

.ranking-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  margin: 10px 0;
}

.ranking-list::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #00d4ff, #5b21b6);
  border-radius: 10px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
}

.ranking-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #00d4ff, #ec4899);
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.5);
}

.ranking-list::-webkit-scrollbar-corner {
  background: transparent;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 18px 24px;
  margin-bottom: 12px;
  background: #f8f9fa;
  border-radius: 16px;
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid #e9ecef;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.ranking-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
  border-color: #667eea;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.rank-first {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 237, 78, 0.2));
  color: #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  border: 2px solid rgba(255, 215, 0, 0.5);
  backdrop-filter: blur(10px);
}

.rank-second {
  background: linear-gradient(135deg, rgba(192, 192, 192, 0.3), rgba(232, 232, 232, 0.2));
  color: #c0c0c0;
  box-shadow: 0 0 15px rgba(192, 192, 192, 0.3);
  border: 2px solid rgba(192, 192, 192, 0.5);
  backdrop-filter: blur(10px);
}

.rank-third {
  background: linear-gradient(135deg, rgba(205, 127, 50, 0.3), rgba(218, 165, 32, 0.2));
  color: #cd7f32;
  box-shadow: 0 0 15px rgba(205, 127, 50, 0.3);
  border: 2px solid rgba(205, 127, 50, 0.5);
  backdrop-filter: blur(10px);
}

.rank-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #00d4ff;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  margin-right: 18px;
  font-size: 16px;
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.7);
  border: 3px solid #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
}

.rank-first .rank-number {
  background: #ffd700;
  color: #8b4513;
  box-shadow: 0 0 25px rgba(255, 215, 0, 0.8);
  border: 3px solid #ffd700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.rank-second .rank-number {
  background: #c0c0c0;
  color: #2c3e50;
  box-shadow: 0 0 20px rgba(192, 192, 192, 0.8);
  border: 3px solid #c0c0c0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.rank-third .rank-number {
  background: #cd7f32;
  color: #ffffff;
  box-shadow: 0 0 20px rgba(205, 127, 50, 0.8);
  border: 3px solid #cd7f32;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
}

.ranking-item .student-info {
  flex: 1;
  margin-bottom: 0;
}

.ranking-item .student-name {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 6px;
  color: #2c3e50;
  letter-spacing: 0.5px;
}

.student-details {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-top: 4px;
}

.student-level {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.level-admin {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
}

.level-core {
  background: linear-gradient(135deg, #4ecdc4, #7fdbda);
  color: white;
}

.level-normal {
  background: linear-gradient(135deg, #45b7d1, #74c0fc);
  color: white;
}

.level-club {
  background: linear-gradient(135deg, #96ceb4, #b8e6b8);
  color: #2e7d32;
}

.student-college,
.student-major,
.student-grade {
  font-size: 13px;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 6px 10px;
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  font-weight: 700;
}

.ranking-item .attendance-time {
  margin-right: 15px;
  font-weight: 700;
  color: #667eea;
  font-size: 16px;
  background: rgba(102, 126, 234, 0.1);
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.rank-badge {
  font-size: 20px;
}

.realtime-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.realtime-item {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 16px;
  border-left: 4px solid #667eea;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.realtime-item:hover {
  background: #e9ecef;
  border-left-color: #764ba2;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.realtime-label {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 8px;
  font-weight: 600;
}

.realtime-value {
  font-size: 16px;
  color: #2c3e50;
  font-weight: 600;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .attendance-analysis-container {
    padding: 10px;
  }
  
  .header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
}
</style>
