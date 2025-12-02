<template>
  <div class="attendance-analysis-container">
    <div class="header">
      <div class="header-left">
        <el-button @click="goBack" class="back-btn" type="primary" :icon="ArrowLeft" circle></el-button>
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊" class="logo" @click="handleThemeToggle" title="切换主题模式">
        <div class="title-section">
          <h1>签到分析</h1>
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
              <h3>今日签到时段分布</h3>
              <el-icon class="header-icon"><PieChart /></el-icon>
            </div>
            <div ref="periodChart" class="chart"></div>
          </div>

          <div class="chart-card">
            <div class="card-header">
              <h3>签到时间线</h3>
              <el-icon class="header-icon"><Clock /></el-icon>
            </div>
            <div class="timeline-controls">
              <div class="time-range-selector">
                <el-select 
                  v-model="selectedTimeRange" 
                  @change="handleTimeRangeChange"
                  placeholder="选择时间范围"
                  size="small"
                  class="time-select"
                >
                  <el-option
                    v-for="option in timeRangeOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </div>
              
              <div class="custom-date-range" v-if="selectedTimeRange === 'custom'">
                <el-date-picker
                  v-model="customDateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  size="small"
                  @change="handleCustomDateChange"
                  class="custom-date-picker"
                />
              </div>
            </div>
            <div ref="timelineChart" class="timeline-chart"></div>
          </div>
        </div>

        <div class="right-column">
          <div class="chart-card">
            <div class="card-header">
              <h3>今日签到排行榜</h3>
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
                  </div>
                </div>
                <div class="attendance-time">{{ formatTime(record.attendanceTime) }}</div>
                <div class="rank-badge" v-if="index < 3">
                  <el-icon v-if="index === 0" class="trophy-icon"><Trophy /></el-icon>
                  <el-icon v-else-if="index === 1" class="medal-icon"><Medal /></el-icon>
                  <el-icon v-else class="star-icon"><Star /></el-icon>
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, 
  Refresh, 
  PieChart, 
  Clock, 
  Trophy, 
  Medal, 
  Star,
  TrendCharts 
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { getStudentLevel } from '@/api/student'
import { getTodayAttendanceRecords, getDailyAttendanceCountInRange } from '@/api/attendance'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore

const initChartsWithTheme = () => {
  try {
    if (periodChartInstance) {
      periodChartInstance.dispose()
      periodChartInstance = null
    }
    if (timelineChartInstance) {
      timelineChartInstance.dispose()
      timelineChartInstance = null
    }
    
    window.requestAnimationFrame(async () => {
      setTimeout(async () => {
        await initPeriodChart()
        await initTimelineChart()
      }, 100)
    })
  } catch (error) {
    return
  }
}

const refreshCharts = () => {
  try {
    if (periodChartInstance) {
      periodChartInstance.dispose()
      periodChartInstance = null
    }
    if (timelineChartInstance) {
      timelineChartInstance.dispose()
      timelineChartInstance = null
    }
    
    window.requestAnimationFrame(async () => {
      setTimeout(async () => {
        await initPeriodChart()
        await initTimelineChart()
      }, 100)
    })
  } catch (error) {
    return
  }
}

const handleThemeToggle = () => {
  toggleTheme()
  window.requestAnimationFrame(() => {
    setTimeout(() => {
      refreshCharts()
    }, 150)
  })
}

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

const selectedTimeRange = ref('today')
const customDateRange = ref([])
const timelineData = ref([])

const PROJECT_LAUNCH_DATE = new Date('2025-09-09T00:00:00')

const ensureTimeNotBeforeLaunch = (time) => {
  return time < PROJECT_LAUNCH_DATE ? PROJECT_LAUNCH_DATE : time
}

const timeRangeOptions = [
  { label: '今日', value: 'today' },
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '昨月', value: 'lastMonth' },
  { label: '本年度', value: 'year' },
  { label: '全部', value: 'all' },
  { label: '自定义', value: 'custom' }
]


let periodChartInstance = null
let timelineChartInstance = null
let refreshTimer = null
let resizeTimeout = null
let periodResizeObserver = null
let timelineResizeObserver = null

const periodChart = ref(null)
const timelineChart = ref(null)

const goBack = () => {
  router.push('/navigation')
}

const handleTimeRangeChange = async () => {
  try {
    await loadTimelineData()
    setTimeout(async () => {
      await initTimelineChart()
    }, 100)
  } catch (error) {
    ElMessage.error('加载时间线数据失败')
  }
}

const handleCustomDateChange = async () => {
  if (customDateRange.value && customDateRange.value.length === 2) {
    try {
      await loadTimelineData()
      setTimeout(async () => {
        await initTimelineChart()
      }, 100)
    } catch (error) {
      ElMessage.error('加载时间线数据失败')
    }
  }
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
    const details = {}
    
    for (const record of attendanceRecords.value) {
      const studentId = record.scheduleId
      if (!details[studentId]) {
        try {
          const levelResponse = await getStudentLevel(studentId)
          if (levelResponse && levelResponse.code === 200 && levelResponse.data) {
            details[studentId] = {
              studentId: studentId,
              name: record.name,
              levelName: levelResponse.data.levelName
            }
          } else {
            details[studentId] = {
              studentId: studentId,
              name: record.name,
              levelName: '社团成员'
            }
          }
        } catch (error) {
          details[studentId] = {
            studentId: studentId,
            name: record.name,
            levelName: '社团成员'
          }
        }
      }
    }
    studentDetails.value = details
  } catch (error) {
    ElMessage.error('获取学生详细信息失败')
  }
}

const initPeriodChart = async () => {
  try {
    await nextTick()
    
    if (!periodChartInstance) {
      if (!periodChart.value) return
      
      await nextTick()
      periodChartInstance = echarts.init(periodChart.value)
      
      if (periodResizeObserver) {
        periodResizeObserver.disconnect()
      }
      
      periodResizeObserver = new ResizeObserver(() => {
        window.requestAnimationFrame(() => {
          if (periodChartInstance) {
            periodChartInstance.resize()
          }
        })
      })
      periodResizeObserver.observe(periodChart.value)
    }
    
    await nextTick()
    window.requestAnimationFrame(() => {
      updatePeriodChart()
    })
  } catch (error) {
    return
  }
}

const updatePeriodChart = () => {

  const total = periodStats.value.morning + periodStats.value.afternoon + periodStats.value.evening
  const currentIsDarkMode = themeStore.isDarkMode
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}人 ({d}%)',
      backgroundColor: currentIsDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      borderColor: currentIsDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      textStyle: {
        color: currentIsDarkMode ? '#ffffff' : '#000000'
      }
    },
    series: [
      {
        name: '签到时段',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        roseType: 'radius',
        itemStyle: {
          borderRadius: 8,
          borderColor: currentIsDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
          borderWidth: 2,
          shadowBlur: 20,
          shadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.2)',
          shadowOffsetX: 0,
          shadowOffsetY: 4
        },
        color: [
          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        ],
        label: {
          show: true,
          position: 'outside',
          distance: 15,
          formatter: function(params) {
            const percent = total > 0 ? ((params.value / total) * 100).toFixed(1) : 0
            return `{name|${params.name}}\n{value|${params.value}人}\n{percent|${percent}%}`
          },
          rich: {
            name: {
              fontSize: 12,
              fontWeight: 'bold',
              color: currentIsDarkMode ? '#ffffff' : '#2c3e50',
              textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
              textShadowBlur: currentIsDarkMode ? 2 : 0,
              textShadowOffsetX: currentIsDarkMode ? 1 : 0,
              textShadowOffsetY: currentIsDarkMode ? 1 : 0
            },
            value: {
              fontSize: 14,
              fontWeight: 'bold',
              color: currentIsDarkMode ? '#00d4ff' : '#667eea',
              textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
              textShadowBlur: currentIsDarkMode ? 2 : 0,
              textShadowOffsetX: currentIsDarkMode ? 1 : 0,
              textShadowOffsetY: currentIsDarkMode ? 1 : 0
            },
            percent: {
              fontSize: 10,
              color: currentIsDarkMode ? '#cbd5e1' : '#6b7280',
              textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
              textShadowBlur: currentIsDarkMode ? 2 : 0,
              textShadowOffsetX: currentIsDarkMode ? 1 : 0,
              textShadowOffsetY: currentIsDarkMode ? 1 : 0
            }
          }
        },
        labelLine: {
          show: true,
          length: 20,
          length2: 15,
          lineStyle: {
            color: currentIsDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
            width: 2,
            type: 'solid'
          },
          smooth: 0.2
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
          color: currentIsDarkMode ? '#ffffff' : '#000000',
          textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
          textShadowBlur: currentIsDarkMode ? 4 : 0,
          textShadowOffsetX: currentIsDarkMode ? 2 : 0,
          textShadowOffsetY: currentIsDarkMode ? 2 : 0
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

const initTimelineChart = async () => {
  try {
    await nextTick()
    
    if (!timelineChartInstance) {
      if (!timelineChart.value) return
      
      await nextTick()
      timelineChartInstance = echarts.init(timelineChart.value)
      
      if (timelineResizeObserver) {
        timelineResizeObserver.disconnect()
      }
      
      timelineResizeObserver = new ResizeObserver(() => {
        window.requestAnimationFrame(() => {
          if (timelineChartInstance) {
            timelineChartInstance.resize()
          }
        })
      })
      timelineResizeObserver.observe(timelineChart.value)
    }
    
    if (timelineChartInstance) {
      await nextTick()
      window.requestAnimationFrame(() => {
        updateTimelineChart()
      })
    }
  } catch (error) {
    return
  }
}

const updateTimelineChart = () => {
  if (!timelineChartInstance) return

  const currentIsDarkMode = themeStore.isDarkMode
  const data = timelineData.value

  if (selectedTimeRange.value === 'today') {
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
        },
        backgroundColor: currentIsDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        borderColor: currentIsDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        textStyle: {
          color: currentIsDarkMode ? '#ffffff' : '#000000'
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
        nameTextStyle: {
          color: currentIsDarkMode ? '#ffffff' : '#000000',
          textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
          textShadowBlur: currentIsDarkMode ? 3 : 0,
          textShadowOffsetX: currentIsDarkMode ? 2 : 0,
          textShadowOffsetY: currentIsDarkMode ? 2 : 0
        },
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
          },
          color: currentIsDarkMode ? '#ffffff' : '#000000',
          textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
          textShadowBlur: currentIsDarkMode ? 3 : 0,
          textShadowOffsetX: currentIsDarkMode ? 2 : 0,
          textShadowOffsetY: currentIsDarkMode ? 2 : 0
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
        nameTextStyle: {
          color: currentIsDarkMode ? '#ffffff' : '#000000',
          textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
          textShadowBlur: currentIsDarkMode ? 3 : 0,
          textShadowOffsetX: currentIsDarkMode ? 2 : 0,
          textShadowOffsetY: currentIsDarkMode ? 2 : 0
        },
        axisLabel: {
          formatter: '{value}人',
          color: currentIsDarkMode ? '#ffffff' : '#000000',
          textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
          textShadowBlur: currentIsDarkMode ? 3 : 0,
          textShadowOffsetX: currentIsDarkMode ? 2 : 0,
          textShadowOffsetY: currentIsDarkMode ? 2 : 0
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

    timelineChartInstance.setOption(option, true)
  } else {
    const filteredData = data.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= PROJECT_LAUNCH_DATE
    })
    
    const dates = filteredData.map(item => item.date)
    const counts = filteredData.map(item => item.attendanceCount)
    
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          const data = params[0]
          return `${data.name}<br/>签到人数: ${data.value}人`
        },
        backgroundColor: currentIsDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        borderColor: currentIsDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        textStyle: {
          color: currentIsDarkMode ? '#ffffff' : '#000000'
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
        type: 'category',
        data: dates,
        name: '日期',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          color: currentIsDarkMode ? '#ffffff' : '#000000',
          textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
          textShadowBlur: currentIsDarkMode ? 3 : 0,
          textShadowOffsetX: currentIsDarkMode ? 2 : 0,
          textShadowOffsetY: currentIsDarkMode ? 2 : 0
        },
        axisLabel: {
          color: currentIsDarkMode ? '#ffffff' : '#000000',
          textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
          textShadowBlur: currentIsDarkMode ? 3 : 0,
          textShadowOffsetX: currentIsDarkMode ? 2 : 0,
          textShadowOffsetY: currentIsDarkMode ? 2 : 0,
          rotate: dates.length > 10 ? 45 : 0
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
        nameTextStyle: {
          color: currentIsDarkMode ? '#ffffff' : '#000000',
          textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
          textShadowBlur: currentIsDarkMode ? 3 : 0,
          textShadowOffsetX: currentIsDarkMode ? 2 : 0,
          textShadowOffsetY: currentIsDarkMode ? 2 : 0
        },
        axisLabel: {
          formatter: '{value}人',
          color: currentIsDarkMode ? '#ffffff' : '#000000',
          textShadowColor: currentIsDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
          textShadowBlur: currentIsDarkMode ? 3 : 0,
          textShadowOffsetX: currentIsDarkMode ? 2 : 0,
          textShadowOffsetY: currentIsDarkMode ? 2 : 0
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
          name: '每日签到人数',
          type: 'line',
          data: counts,
          smooth: true,
          lineStyle: {
            color: '#00d4ff',
            width: 3,
            type: 'solid',
            shadowBlur: 10,
            shadowColor: 'rgba(0, 212, 255, 0.3)'
          },
          itemStyle: {
            color: '#00d4ff',
            borderColor: '#fff',
            borderWidth: 2,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 212, 255, 0.3)'
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
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 15,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 212, 255, 0.5)'
            }
          }
        }
      ]
    }

    timelineChartInstance.setOption(option, true)
  }
}

const loadTimelineData = async () => {
  try {
    let startTime, endTime
    
    switch (selectedTimeRange.value) {
      case 'today': {
        const today = new Date()
        startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
        endTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
        break
      }
      case 'week': {
        const now = new Date()
        const dayOfWeek = now.getDay()
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
        const monday = new Date(now.setDate(diff))
        startTime = ensureTimeNotBeforeLaunch(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate(), 0, 0, 0))
        endTime = new Date()
        break
      }
      case 'month': {
        const now = new Date()
        startTime = ensureTimeNotBeforeLaunch(new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0))
        endTime = new Date()
        break
      }
      case 'lastMonth': {
        const now = new Date()
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
        startTime = ensureTimeNotBeforeLaunch(new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1, 0, 0, 0))
        endTime = new Date(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth(), lastMonthEnd.getDate(), 23, 59, 59)
        break
      }
      case 'year': {
        const now = new Date()
        startTime = ensureTimeNotBeforeLaunch(new Date(now.getFullYear(), 0, 1, 0, 0, 0))
        endTime = new Date()
        break
      }
      case 'all': {
        startTime = PROJECT_LAUNCH_DATE
        endTime = new Date()
        break
      }
      case 'custom': {
        if (customDateRange.value && customDateRange.value.length === 2) {
          startTime = ensureTimeNotBeforeLaunch(new Date(customDateRange.value[0]))
          endTime = new Date(customDateRange.value[1])
          endTime.setHours(23, 59, 59, 999)
        } else {
          return
        }
        break
      }
      default:
        return
    }
    
    const response = await getDailyAttendanceCountInRange(
      startTime.toISOString(),
      endTime.toISOString()
    )
    
    if (response && response.code === 200) {
      timelineData.value = response.data || []
    }
  } catch (error) {
    ElMessage.error(error.message || '加载时间线数据失败')
  }
}

const loadAttendanceData = async () => {
  try {
    isLoading.value = true
    
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
      
      await loadStudentDetails()
      
      setTimeout(() => {
        initChartsWithTheme()
      }, 200)
    }
  } catch (error) {
    ElMessage.error(error.message || '加载签到数据失败')
  } finally {
    isLoading.value = false
  }
}

const refreshData = () => {
  loadAttendanceData()
  loadTimelineData()
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
  window.addEventListener('error', (event) => {
    if (event.message.includes('ResizeObserver loop completed with undelivered notifications')) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }
  })
  
  await new Promise(resolve => setTimeout(resolve, 100))
  loadAttendanceData()
  loadTimelineData()
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }
  if (periodResizeObserver) {
    periodResizeObserver.disconnect()
  }
  if (timelineResizeObserver) {
    timelineResizeObserver.disconnect()
  }
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
  background: var(--bg-primary);
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--glass-bg);
  padding: 20px 30px;
  border-radius: 20px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px var(--shadow-color);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
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
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo:hover {
  transform: scale(1.1);
  filter: brightness(1.2);
}

.title-section h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-section p {
  margin: 5px 0 0 0;
  font-size: 14px;
  color: var(--text-tertiary);
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
  color: var(--text-tertiary);
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
  background: var(--glass-bg);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 8px 32px var(--shadow-color);
  backdrop-filter: blur(10px);
  margin-bottom: 20px;
  border: 1px solid var(--glass-border);
  transition: all 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px var(--shadow-hover);
  border-color: var(--primary-color);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--border-color);
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.header-icon {
  font-size: 20px;
  color: var(--primary-color);
}

.chart {
  width: 100%;
  height: 400px;
}

.timeline-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.time-range-selector {
  flex: 1;
}

.time-select {
  width: 100%;
}

.custom-date-range {
  flex: 1;
}

.custom-date-picker {
  width: 100%;
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
  background: var(--bg-secondary);
  padding: 15px 20px;
  border-radius: 12px;
  border-left: 4px solid var(--primary-color);
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
  color: var(--text-primary);
  font-size: 16px;
}

.student-id {
  color: var(--text-tertiary);
  font-size: 14px;
}

.attendance-time {
  color: var(--primary-color);
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

.ranking-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.ranking-item:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 16px 48px var(--shadow-hover);
}

.ranking-item:hover::before {
  opacity: 1;
}

.ranking-item > * {
  position: relative;
  z-index: 1;
}

.rank-first {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 237, 78, 0.2));
  color: var(--text-primary);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  border: 2px solid rgba(255, 215, 0, 0.5);
  backdrop-filter: blur(10px);
}

.rank-second {
  background: linear-gradient(135deg, rgba(192, 192, 192, 0.3), rgba(232, 232, 232, 0.2));
  color: var(--text-primary);
  box-shadow: 0 0 15px rgba(192, 192, 192, 0.3);
  border: 2px solid rgba(192, 192, 192, 0.5);
  backdrop-filter: blur(10px);
}

.rank-third {
  background: linear-gradient(135deg, rgba(205, 127, 50, 0.3), rgba(218, 165, 32, 0.2));
  color: var(--text-primary);
  box-shadow: 0 0 15px rgba(205, 127, 50, 0.3);
  border: 2px solid rgba(205, 127, 50, 0.5);
  backdrop-filter: blur(10px);
}

.rank-number {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 20px;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.rank-number::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3));
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.ranking-item:hover .rank-number::before {
  opacity: 1;
}

.rank-first .rank-number {
  background: #ffd700;
  color: var(--text-primary);
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
  border: 1px solid #ffd700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.rank-second .rank-number {
  background: #c0c0c0;
  color: var(--text-primary);
  box-shadow: 0 2px 8px rgba(192, 192, 192, 0.3);
  border: 1px solid #c0c0c0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.rank-third .rank-number {
  background: #cd7f32;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(205, 127, 50, 0.3);
  border: 1px solid #cd7f32;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.ranking-item .student-info {
  flex: 1;
  margin-bottom: 0;
}

.ranking-item .student-name {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 6px;
  color: var(--text-primary);
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
  color: var(--text-primary);
}

.student-college,
.student-major,
.student-grade {
  font-size: 13px;
  color: var(--text-primary);
  background: var(--bg-tertiary);
  padding: 6px 10px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.ranking-item .attendance-time {
  margin-right: 60px;
  font-weight: 700;
  color: var(--primary-color);
  font-size: 16px;
  background: var(--bg-tertiary);
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  flex-shrink: 0;
}

.rank-badge {
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

.rank-badge:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.trophy-icon {
  color: #ffd700;
  filter: drop-shadow(0 2px 4px rgba(255, 215, 0, 0.3));
}

.medal-icon {
  color: #c0c0c0;
  filter: drop-shadow(0 2px 4px rgba(192, 192, 192, 0.3));
}

.star-icon {
  color: #cd7f32;
  filter: drop-shadow(0 2px 4px rgba(205, 127, 50, 0.3));
}


.realtime-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.realtime-item {
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 16px;
  border-left: 4px solid var(--primary-color);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.realtime-item:hover {
  background: var(--bg-tertiary);
  border-left-color: var(--secondary-color);
  box-shadow: 0 8px 20px var(--shadow-color);
}

.realtime-label {
  font-size: 14px;
  color: var(--text-tertiary);
  margin-bottom: 8px;
  font-weight: 600;
}

.realtime-value {
  font-size: 16px;
  color: var(--text-primary);
  font-weight: 600;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--glass-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
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

.dark .student-college,
.dark .student-major,
.dark .student-grade {
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  font-weight: 600 !important;
}

.dark .ranking-item .student-name {
  color: #ffffff !important;
  font-weight: 600 !important;
}

.dark .ranking-item .attendance-time {
  color: #00d4ff !important;
  background: rgba(0, 212, 255, 0.3) !important;
  border: 1px solid rgba(0, 212, 255, 0.5) !important;
  font-weight: 600 !important;
}

.dark .student-level {
  font-weight: 600 !important;
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
