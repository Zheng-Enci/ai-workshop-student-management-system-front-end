<template>
  <div class="attendance-container-desktop">
    <div class="background-effects-desktop">
      <div class="gradient-orb-desktop orb-1"></div>
      <div class="gradient-orb-desktop orb-2"></div>
      <div class="gradient-orb-desktop orb-3"></div>
    </div>
    
    <div class="content-wrapper-desktop">
      <div class="page-title-desktop">
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊学生管理系统" class="title-logo-desktop" @click="toggleTheme" title="切换主题模式">
        <h1>AI坊学生签到</h1>
      </div>
      
      <div class="top-bar-desktop">
      <el-button 
        type="primary" 
        @click="goToNavigation" 
        class="nav-button-desktop"
        :icon="ArrowLeft"
      >
        返回导航
      </el-button>
      
            <div class="time-card-desktop">
              <div class="time-info-desktop">
                <div class="current-time-desktop">
                  <el-icon class="time-icon-desktop"><Clock /></el-icon>
                  <span>{{ currentTime }}</span>
                </div>
                <div v-if="!isInSignTime" class="next-time-desktop">
                  <el-icon class="next-icon-desktop"><Calendar /></el-icon>
                  <span>下次签到：{{ nextSignTime }}</span>
                </div>
              </div>
            </div>
            
        <el-button 
          type="primary" 
          @click="showCalendar = true"
          class="calendar-button-desktop"
          :icon="Calendar"
        >
          签到记录
        </el-button>
          </div>
          
          
      <div class="motto-corner-desktop">
        <img src="@/assets/QunCeQunLiChuangXingGongXing.png" alt="群策群力 创新共行" class="motto-image-desktop">
              </div>
              
      <div class="left-sidebar-desktop">
        <div class="motto-text-vertical">
          <div class="vertical-text world-text">世界很大</div>
          <div class="vertical-text ai-text">AI无限</div>
                </div>
              </div>
              
      <div class="main-content-desktop">
        <div class="layout-grid-desktop">
          <div class="left-panel-desktop">
            
            </div>
          </div>
          
              <div class="chart-item-desktop">
                <div class="chart-title-desktop">签到热力图</div>
                <div ref="heatmapChart" class="chart-content-desktop"></div>
              </div>
              
              <div class="chart-item-desktop">
                <div class="chart-title-desktop">签到趋势图</div>
                <div ref="lineChart" class="chart-content-desktop"></div>
              </div>
            </div>
              
      <el-dialog
        v-if="showCalendar"
        v-model="showCalendar"
        title="签到记录"
        width="80%"
        class="calendar-dialog-desktop"
        destroy-on-close
        :close-on-click-modal="false"
        @close="handleCalendarClose"
      >
        <el-calendar v-model="calendarValue" class="attendance-calendar-desktop" :range="[]" @click.stop>
          <template #header="{ date }">
            <div class="calendar-header-desktop">
              <div class="header-title">{{ formatCalendarTitle(date) }}</div>
              <div class="header-actions">
                <el-button size="small" @click="prevMonth">上个月</el-button>
                <el-button size="small" @click="goToday">今天</el-button>
                <el-button size="small" @click="nextMonth">下个月</el-button>
              </div>
            </div>
          </template>
          <template #date-cell="{ data }">
            <div class="calendar-cell-desktop" @click="showDateDetails(data.day, $event)">
              <div class="cell-date-desktop">{{ data.day.split('-')[2] }}</div>
              <div class="cell-status-desktop">
                <div class="time-slot-status">
                  <div class="time-slot morning" :class="{ 'signed': isTimeSlotSigned(data.day, 'morning') }">
                    <span class="time-label">早</span>
                    <el-icon v-if="isTimeSlotSigned(data.day, 'morning')" class="slot-icon"><Check /></el-icon>
        </div>
                  <div class="time-slot afternoon" :class="{ 'signed': isTimeSlotSigned(data.day, 'afternoon') }">
                    <span class="time-label">午</span>
                    <el-icon v-if="isTimeSlotSigned(data.day, 'afternoon')" class="slot-icon"><Check /></el-icon>
      </div>
                  <div class="time-slot evening" :class="{ 'signed': isTimeSlotSigned(data.day, 'evening') }">
                    <span class="time-label">晚</span>
                    <el-icon v-if="isTimeSlotSigned(data.day, 'evening')" class="slot-icon"><Check /></el-icon>
              </div>
            </div>
          </div>
            </div>
          </template>
        </el-calendar>
      </el-dialog>

      <el-dialog
        v-if="showDateDetailsDialog"
        v-model="showDateDetailsDialog"
        title="签到详情"
        width="400px"
        class="date-details-dialog-desktop"
        destroy-on-close
        :close-on-click-modal="false"
        @click.stop
        @close="handleDateDetailsClose"
      >
        <div class="date-details-content-desktop" @click.stop>
          <div class="selected-date-desktop">{{ formatSelectedDate(selectedDate) }}</div>
          <div class="attendance-times-desktop">
            <div v-if="getDateAttendanceTimes(selectedDate).length === 0" class="no-attendance-desktop">
              该日期无签到记录
        </div>
            <div v-else>
              <div v-for="(time, index) in getDateAttendanceTimes(selectedDate)" :key="index" class="attendance-time-item-desktop">
                <el-icon class="time-icon-desktop"><Clock /></el-icon>
                <span class="time-text-desktop">{{ formatAttendanceTime(time) }}</span>
                <span class="time-slot-label-desktop">{{ getTimeSlotLabel(time) }}</span>
        </div>
      </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Check, ArrowLeft, Clock, Calendar } from '@element-plus/icons-vue'
import { signIn, getMyAttendanceRecords } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'

const loading = ref(false)
const userStore = useUserStore()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore
const router = useRouter()
const studentLevel = ref(0)
const isInSignTime = ref(false)
const currentTime = ref('')
const nextSignTime = ref('')
const timeInterval = ref(null)
const attendanceStatus = ref({
  morning: false,
  afternoon: false,
  evening: false
})

const heatmapChart = ref(null)
const lineChart = ref(null)
const heatmapInstance = ref(null)
const lineInstance = ref(null)
const attendanceRecords = ref([])
const showCalendar = ref(false)
const calendarValue = ref(new Date())
const showDateDetailsDialog = ref(false)
const selectedDate = ref('')

const goToNavigation = () => {
  router.push('/navigation')
}

const handleCalendarClose = () => {
  showCalendar.value = false
}

const showDateDetails = (dateStr, event) => {
  if (event) {
    event.stopPropagation()
    event.preventDefault()
  }
  
  if (showDateDetailsDialog.value) {
    return
  }
  
  if (!dateStr) {
    return
  }
  
  selectedDate.value = dateStr
  showDateDetailsDialog.value = true
}

const handleDateDetailsClose = () => {
  showDateDetailsDialog.value = false
  selectedDate.value = ''
}

const formatSelectedDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  return `${year}年${month}月${day}日 (${monthNames[month - 1]})`
}

const getDateAttendanceTimes = (dateStr) => {
  if (!attendanceRecords.value || attendanceRecords.value.length === 0) {
    return []
  }
  
  return attendanceRecords.value.filter(record => {
    if (!record || !record.attendanceDateTime) {
      return false
    }
    
    const recordDate = new Date(record.attendanceDateTime)
    const recordDateStr = recordDate.toISOString().split('T')[0]
    return recordDateStr === dateStr
  }).map(record => record.attendanceDateTime)
}

const formatAttendanceTime = (timeStr) => {
  const date = new Date(timeStr)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

const getTimeSlotLabel = (timeStr) => {
  const date = new Date(timeStr)
  const hour = date.getHours()
  
  if (hour >= 6 && hour < 12) {
    return '早上'
  } else if (hour >= 12 && hour < 18) {
    return '下午'
  } else if (hour >= 18 && hour < 24) {
    return '晚上'
  } else {
    return '其他'
  }
}

const formatCalendarTitle = (date) => {
  const dateObj = new Date(date)
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() + 1
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  return `${year}年 ${monthNames[month - 1]}`
}

const prevMonth = () => {
  const date = new Date(calendarValue.value)
  date.setMonth(date.getMonth() - 1)
  calendarValue.value = date
}

const nextMonth = () => {
  const date = new Date(calendarValue.value)
  date.setMonth(date.getMonth() + 1)
  calendarValue.value = date
}

const goToday = () => {
  calendarValue.value = new Date()
}

const isTimeSlotSigned = (dateStr, timeSlot) => {
  if (!attendanceRecords.value || attendanceRecords.value.length === 0) {
    return false
  }
  
  return attendanceRecords.value.some(record => {
    if (!record || !record.attendanceDateTime) {
      return false
    }
    
    const recordDate = new Date(record.attendanceDateTime)
    const recordDateStr = recordDate.toISOString().split('T')[0]
    
    if (recordDateStr !== dateStr) {
      return false
    }
    
    const hour = recordDate.getHours()
    
    switch (timeSlot) {
      case 'morning':
        return hour >= 6 && hour < 12
      case 'afternoon':
        return hour >= 12 && hour < 18
      case 'evening':
        return hour >= 18 && hour < 24
      default:
        return false
    }
  })
}



const loadAttendanceRecords = async () => {
  try {
    const response = await getMyAttendanceRecords()
    if (response && response.code === 200 && response.data) {
      attendanceRecords.value = response.data
      await nextTick()
      initCharts()
    }
  } catch (error) {
    error
  }
}

const initCharts = () => {
  initHeatmapChart()
  initLineChart()
}

const initHeatmapChart = () => {
  if (!heatmapChart.value) return
  
  if (heatmapInstance.value) {
    heatmapInstance.value.dispose()
  }
  
  heatmapInstance.value = echarts.init(heatmapChart.value)
  
  const heatmapData = generateHeatmapData()
  const maxValue = Math.max(...heatmapData.map(item => item[2]), 1)
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      position: 'top',
      backgroundColor: themeStore.isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
      borderColor: themeStore.isDark ? '#333' : '#ddd',
      textStyle: {
        color: themeStore.isDark ? '#fff' : '#333'
      },
      formatter: function (params) {
        const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        const timeSlots = ['上午', '下午', '晚上']
        return `${weekDays[params.data[0]]} ${timeSlots[params.data[1]]}<br/>签到次数: ${params.data[2]}`
      }
    },
    grid: {
      height: '60%',
      top: '15%',
      left: '10%',
      right: '10%',
      bottom: '20%'
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      splitArea: {
        show: true,
        areaStyle: {
          color: themeStore.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
        }
      },
      axisLabel: {
        color: themeStore.isDark ? '#ccc' : '#666',
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: themeStore.isDark ? '#444' : '#ddd'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: ['上午', '下午', '晚上'],
      splitArea: {
        show: true,
        areaStyle: {
          color: themeStore.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
        }
      },
      axisLabel: {
        color: themeStore.isDark ? '#ccc' : '#666',
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: themeStore.isDark ? '#444' : '#ddd'
        }
      }
    },
    visualMap: {
      min: 0,
      max: maxValue,
      calculable: false,
      orient: 'horizontal',
      left: 'center',
      bottom: '5%',
      itemWidth: 20,
      itemHeight: 200,
      textStyle: {
        color: themeStore.isDark ? '#ccc' : '#666',
        fontSize: 11
      },
      inRange: {
        color: themeStore.isDark 
          ? ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8']
          : ['#fef3c7', '#fde68a', '#f59e0b', '#d97706', '#b45309', '#92400e']
      }
    },
    series: [{
      name: '签到次数',
      type: 'heatmap',
      data: heatmapData,
      label: {
        show: true,
        color: themeStore.isDark ? '#ffffff' : '#1f2937',
        fontSize: 11,
        fontWeight: 'bold'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 15,
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          borderWidth: 2,
          borderColor: '#fff'
        }
      },
      itemStyle: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: themeStore.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
      }
    }]
  }
  
  heatmapInstance.value.setOption(option)
}

const initLineChart = () => {
  if (!lineChart.value) return
  
  if (lineInstance.value) {
    lineInstance.value.dispose()
  }
  
  lineInstance.value = echarts.init(lineChart.value)
  
  const lineData = generateLineData()
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: themeStore.isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
      borderColor: themeStore.isDark ? '#333' : '#ddd',
      textStyle: {
        color: themeStore.isDark ? '#fff' : '#333'
      },
      formatter: function (params) {
        const date = new Date(params[0].axisValue)
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        return `${formattedDate}<br/>累计签到次数: ${params[0].value}`
      }
    },
    grid: {
      left: '8%',
      right: '8%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axisLabel: {
        color: themeStore.isDark ? '#ccc' : '#666',
        fontSize: 11,
        rotate: 45,
        formatter: function (value) {
          const date = new Date(value)
          return `${date.getMonth() + 1}/${date.getDate()}`
        }
      },
      axisLine: {
        lineStyle: {
          color: themeStore.isDark ? '#444' : '#ddd'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: themeStore.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '累计签到次数',
      nameTextStyle: {
        color: themeStore.isDark ? '#ccc' : '#666',
        fontSize: 12
      },
      axisLabel: {
        color: themeStore.isDark ? '#ccc' : '#666',
        fontSize: 11
      },
      axisLine: {
        lineStyle: {
          color: themeStore.isDark ? '#444' : '#ddd'
        }
      },
      splitLine: {
        lineStyle: {
          color: themeStore.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
        }
      }
    },
    series: [{
      name: '累计签到次数',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        color: '#4fc3f7',
        width: 3
      },
      itemStyle: {
        color: '#4fc3f7',
        borderColor: '#fff',
        borderWidth: 2
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(79, 195, 247, 0.3)'
          }, {
            offset: 1, color: 'rgba(79, 195, 247, 0.05)'
          }]
        }
      },
      emphasis: {
        itemStyle: {
          color: '#0288d1',
          borderColor: '#fff',
          borderWidth: 3,
          shadowBlur: 10,
          shadowColor: 'rgba(79, 195, 247, 0.5)'
        },
        lineStyle: {
          width: 4
        }
      },
      data: lineData.dates.map((date, index) => [date, lineData.values[index]])
    }]
  }
  
  lineInstance.value.setOption(option)
}

const generateLineData = () => {
  const dateMap = new Map()
  
  attendanceRecords.value.forEach(record => {
    const date = new Date(record.attendanceDateTime)
    const dateStr = date.toISOString().split('T')[0]
    dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1)
  })
  
  const sortedDates = Array.from(dateMap.keys()).sort()
  const dailyValues = sortedDates.map(date => dateMap.get(date))
  
  let cumulativeSum = 0
  const cumulativeValues = dailyValues.map(value => {
    cumulativeSum += value
    return cumulativeSum
  })
  
  return {
    dates: sortedDates,
    values: cumulativeValues
  }
}

const generateHeatmapData = () => {
  const data = []
  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const timeSlots = ['上午', '下午', '晚上']
  
  weekDays.forEach((day, dayIndex) => {
    timeSlots.forEach((slot, slotIndex) => {
      let count = 0
      attendanceRecords.value.forEach(record => {
        const date = new Date(record.attendanceDateTime)
        const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1
        const hour = date.getHours()
        
        if (dayOfWeek === dayIndex) {
          if (slot === '上午' && hour >= 8 && hour < 11) count++
          else if (slot === '下午' && hour >= 14 && hour < 17) count++
          else if (slot === '晚上' && hour >= 19 && hour < 22) count++
        }
      })
      data.push([dayIndex, slotIndex, count])
    })
  })
  
  return data
}

const getCurrentTimeSlot = () => {
  const now = new Date()
  const hour = now.getHours()
  
  if (hour >= 8 && hour < 11) return 'morning'
  if (hour >= 14 && hour < 17) return 'afternoon'
  if (hour >= 19 && hour < 22) return 'evening'
  return null
}

const isCurrentSlotSigned = () => {
  try {
    const currentSlot = getCurrentTimeSlot()
    if (!currentSlot) return false
    if (!attendanceStatus.value || typeof attendanceStatus.value !== 'object') return false
    return Boolean(attendanceStatus.value[currentSlot])
  } catch (error) {
    return false
  }
}

const loadAttendanceStatus = () => {
  const today = new Date().toDateString()
  const saved = localStorage.getItem(`attendance_${today}`)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed && typeof parsed === 'object' && 
          'morning' in parsed && 'afternoon' in parsed && 'evening' in parsed) {
        attendanceStatus.value = parsed
      } else {
        attendanceStatus.value = { morning: false, afternoon: false, evening: false }
      }
    } catch (e) {
      attendanceStatus.value = { morning: false, afternoon: false, evening: false }
    }
  } else {
    attendanceStatus.value = { morning: false, afternoon: false, evening: false }
  }
}

const syncAllAttendanceStatus = async () => {
  try {
    const today = new Date().toDateString()
    const saved = localStorage.getItem(`attendance_${today}`)
    
    if (saved) {
      try {
        const status = JSON.parse(saved)
        if (status && typeof status === 'object') {
          attendanceStatus.value = {
            morning: Boolean(status.morning),
            afternoon: Boolean(status.afternoon),
            evening: Boolean(status.evening)
          }
        }
      } catch (e) {
        attendanceStatus.value = { morning: false, afternoon: false, evening: false }
      }
    }
  } catch (error) {
    error
  }
}

const refreshAttendanceStatus = async () => {
  try {
    const token = userStore.token || localStorage.getItem('token')
    if (!token) return
    
    const today = new Date().toDateString()
    
    try {
      const response = await signIn(token)
      if (response && response.code === 400 && response.message && response.message.includes('已签到')) {
        const currentSlot = getCurrentTimeSlot()
        if (currentSlot && attendanceStatus.value) {
          attendanceStatus.value[currentSlot] = true
          saveAttendanceStatus()
        }
      }
    } catch (error) {
      const saved = localStorage.getItem(`attendance_${today}`)
      if (saved) {
        try {
          const status = JSON.parse(saved)
          if (status && typeof status === 'object') {
            attendanceStatus.value = {
              morning: Boolean(status.morning),
              afternoon: Boolean(status.afternoon),
              evening: Boolean(status.evening)
            }
          }
        } catch (e) {
          attendanceStatus.value = { morning: false, afternoon: false, evening: false }
        }
      }
    }
  } catch (error) {
    error
  }
}

const saveAttendanceStatus = () => {
  const today = new Date().toDateString()
  if (attendanceStatus.value && typeof attendanceStatus.value === 'object') {
    localStorage.setItem(`attendance_${today}`, JSON.stringify(attendanceStatus.value))
  } else {
    const defaultStatus = { morning: false, afternoon: false, evening: false }
    localStorage.setItem(`attendance_${today}`, JSON.stringify(defaultStatus))
  }
}

const checkSignTime = () => {
  const now = new Date()
  const hour = now.getHours()
  const minute = now.getMinutes()
  const second = now.getSeconds()
  const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
  currentTime.value = timeStr
  
  const signTimeRanges = [
    { start: 8, end: 11, name: '上午' },
    { start: 14, end: 17, name: '下午' },
    { start: 19, end: 22, name: '晚上' }
  ]
  
  let inTime = false
  let nextTime = ''
  
  for (const range of signTimeRanges) {
    if (hour >= range.start && hour < range.end) {
      inTime = true
      break
    }
  }
  
  if (!inTime) {
    for (const range of signTimeRanges) {
      if (hour < range.start) {
        nextTime = `${range.name} ${range.start.toString().padStart(2, '0')}:00`
        break
      }
    }
    if (!nextTime) {
      nextTime = '明天上午 08:00'
    }
  }
  
  isInSignTime.value = inTime
  nextSignTime.value = nextTime
  
  if (minute === 0 && second === 0) {
    syncAllAttendanceStatus()
  }
}

const submitAttendance = async () => {
  if (!isInSignTime.value) {
    ElMessage.error(`当前时间 ${currentTime.value} 不在签到时间内，下次签到时间：${nextSignTime.value}`)
    return
  }
  
  if (isCurrentSlotSigned()) {
    ElMessage.error('当前时间段已签到，请等待下次签到时间')
    return
  }
  
  loading.value = true
  
  try {
    const token = userStore.token || localStorage.getItem('token')
    if (!token) {
      ElMessage.error('请先登录')
      router.push('/login')
      loading.value = false
      return
    }
    
    const res = await signIn(token)
    
    if (res.code === 200) {
      const currentSlot = getCurrentTimeSlot()
      if (currentSlot && attendanceStatus.value) {
        attendanceStatus.value[currentSlot] = true
        saveAttendanceStatus()
      }
      
      ElMessage.success('签到成功！')
      
      await refreshAttendanceStatus()
    } else if (res.code === 400 && res.message && res.message.includes('已签到')) {
      const currentSlot = getCurrentTimeSlot()
      if (currentSlot && attendanceStatus.value) {
        attendanceStatus.value[currentSlot] = true
        saveAttendanceStatus()
      }
      
      ElMessage.success('您已签到，无需重复签到')
      
      await refreshAttendanceStatus()
    } else {
      throw new Error(res.message || '签到失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '签到失败')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    loadAttendanceStatus()
    checkSignTime()
    timeInterval.value = setInterval(checkSignTime, 1000)
    loadStudentLevel()
    await loadAttendanceRecords()
    
    setTimeout(async () => {
      await syncAllAttendanceStatus()
      await submitAttendance()
    }, 1000)
  } catch (error) {
    attendanceStatus.value = { morning: false, afternoon: false, evening: false }
  }
})

watch(() => themeStore.isDark, () => {
  nextTick(() => {
    initHeatmapChart()
    initLineChart()
  })
})

onUnmounted(() => {
  if (timeInterval.value) {
    clearInterval(timeInterval.value)
  }
  if (heatmapInstance.value) {
    heatmapInstance.value.dispose()
  }
  if (lineInstance.value) {
    lineInstance.value.dispose()
  }
})

const loadStudentLevel = () => {
  try {
    const userInfo = userStore.userInfo || JSON.parse(localStorage.getItem('userInfo') || '{}')
    studentLevel.value = userInfo.level || 0
  } catch (error) {
    studentLevel.value = 0
  }
}
</script>

<style scoped>
.attendance-container-desktop {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.1) 0%, 
    rgba(168, 85, 247, 0.08) 25%, 
    rgba(236, 72, 153, 0.06) 50%, 
    rgba(251, 146, 60, 0.08) 75%, 
    rgba(34, 197, 94, 0.1) 100%);
  position: relative;
  overflow: hidden;
}

.background-effects-desktop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.gradient-orb-desktop {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: float-desktop 25s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 70%, transparent 100%);
  top: 5%;
  left: 5%;
  animation-delay: 0s;
}

.orb-2 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(168, 85, 247, 0.04) 70%, transparent 100%);
  top: 50%;
  right: 5%;
  animation-delay: 8s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.03) 70%, transparent 100%);
  bottom: 10%;
  left: 15%;
  animation-delay: 16s;
}

@keyframes float-desktop {
  0%, 100% { 
    transform: translateY(0px) translateX(0px) rotate(0deg); 
    opacity: 0.6;
  }
  25% { 
    transform: translateY(-20px) translateX(10px) rotate(90deg); 
    opacity: 0.8;
  }
  50% { 
    transform: translateY(-10px) translateX(-15px) rotate(180deg); 
    opacity: 1;
  }
  75% { 
    transform: translateY(15px) translateX(5px) rotate(270deg); 
    opacity: 0.7;
  }
}

.content-wrapper-desktop {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 1200px;
  position: relative;
  z-index: 1;
  padding-top: 20px;
}

.page-title-desktop {
  width: 100%;
  text-align: center;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.page-title-desktop h1 {
  font-size: 36px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  text-shadow: 0 2px 8px var(--shadow-color);
  letter-spacing: 2px;
}

.title-logo-desktop {
  width: 48px;
  height: 48px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
}

.title-logo-desktop:hover {
  transform: scale(1.1) rotate(180deg);
  box-shadow: 0 8px 32px var(--shadow-color);
}

html.dark .page-title-desktop h1 {
  color: var(--text-primary);
}

html.dark .title-logo-desktop {
  filter: invert(1) hue-rotate(180deg);
}

html.light .title-logo-desktop {
  filter: none;
}

.attendance-header-desktop {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
}

.top-bar-desktop {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-button-desktop {
  height: 48px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  box-shadow: 0 4px 16px var(--shadow-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0 20px;
  min-width: 100px;
}

.nav-button-desktop:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px var(--shadow-color);
  background: var(--primary-color);
  color: #ffffff;
}

.logo-desktop {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-desktop:hover {
  transform: scale(1.1) rotate(5deg);
  filter: brightness(1.2);
}


.motto-corner-desktop {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 999;
  transition: all 0.3s ease;
}

.motto-corner-desktop:hover {
  transform: translateY(-2px);
}

.motto-image-desktop {
  width: 150px;
  height: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.9;
}

.motto-image-desktop:hover {
  transform: scale(1.05);
  opacity: 1;
}

html.dark .motto-image-desktop {
  filter: invert(1) hue-rotate(180deg);
  transition: filter 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

html.light .motto-image-desktop {
  filter: none;
  transition: filter 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

h1 {
  color: var(--text-primary);
  font-size: 32px;
  margin: 0 0 8px 0;
  font-weight: 700;
  text-shadow: 0 2px 8px var(--shadow-color);
  letter-spacing: 1px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 16px;
  margin: 0;
  font-weight: 400;
  opacity: 0.8;
}

.motto-text {
  color: var(--text-primary);
  font-size: 14px;
  margin: 8px 0 0 0;
  font-weight: 500;
  font-style: italic;
  opacity: 0.9;
  text-shadow: 0 1px 4px var(--shadow-color);
}

.left-sidebar-desktop {
  position: fixed;
  left: 50%;
  bottom: 30px;
  transform: translateX(-50%);
  z-index: 998;
  padding: 0;
  transition: all 0.3s ease;
}

.left-sidebar-desktop:hover {
  transform: translateX(-50%) scale(1.01);
}

.motto-text-vertical {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.vertical-text {
  font-size: 18px;
  margin: 0;
  font-weight: 400;
  opacity: 0.8;
  line-height: 1.4;
  letter-spacing: 0.3px;
  color: #666;
  transition: all 0.3s ease;
}


.main-content-desktop {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
}

.layout-grid-desktop {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  width: 100%;
  max-width: 1400px;
  align-items: start;
}

.left-panel-desktop {
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
}

.right-panel-desktop {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.time-card-desktop {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px var(--shadow-color);
  padding: 16px 24px;
  text-align: center;
  transition: all 0.3s ease;
  min-width: 200px;
}

.time-card-desktop:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px var(--shadow-color);
}

.time-info-desktop {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.current-time-desktop {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 18px;
  color: var(--text-primary);
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.time-icon-desktop {
  color: var(--primary-color);
  font-size: 20px;
}

.next-time-desktop {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.next-icon-desktop {
  color: var(--text-tertiary);
}

.calendar-button-desktop {
  height: 48px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  box-shadow: 0 4px 16px var(--shadow-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0 20px;
  min-width: 120px;
}

.calendar-button-desktop:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px var(--shadow-color);
  background: var(--primary-color);
  color: #ffffff;
}

.calendar-dialog-desktop {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid var(--glass-border);
}

.attendance-calendar-desktop {
  background: transparent;
}

.calendar-cell-desktop {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  position: relative;
}

.cell-date-desktop {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.cell-status-desktop {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.signed-icon-desktop {
  color: #67c23a;
  font-size: 12px;
}

.signed-text-desktop {
  font-size: 10px;
  color: #67c23a;
  font-weight: 500;
}

.unsigned-text-desktop {
  font-size: 10px;
  color: var(--text-tertiary);
  font-weight: 400;
}







@media (max-width: 1024px) {
  .layout-grid-desktop {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .left-panel-desktop {
    order: 1;
  }
}


.charts-container-desktop {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
}

.chart-item-desktop {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
  margin-top: 30px;
}

.chart-item-desktop::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #4fc3f7, #29b6f6, #0288d1);
}

.chart-item-desktop:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: rgba(79, 195, 247, 0.2);
}

.chart-title-desktop {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 20px;
  text-align: center;
  position: relative;
}

.chart-title-desktop::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, #4fc3f7, #29b6f6);
  border-radius: 1px;
}

.chart-content-desktop {
  width: 100%;
  height: 350px;
  border-radius: 12px;
  overflow: hidden;
}

@media (max-width: 1024px) {
  .chart-content-desktop {
    height: 250px;
  }
}

html.dark {
  --el-message-bg-color: #000000 !important;
  --el-message-text-color: #ffffff !important;
  --el-message-border-color: #333333 !important;
  --el-color-success: #67c23a !important;
  --el-color-error: #f56c6c !important;
}

html.dark .el-message {
  background-color: var(--el-message-bg-color) !important;
  color: var(--el-message-text-color) !important;
  border-color: var(--el-message-border-color) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8) !important;
}

html.dark .el-message--success {
  background-color: var(--el-message-bg-color) !important;
  color: var(--el-message-text-color) !important;
  border-color: var(--el-color-success) !important;
}

html.dark .el-message--error {
  background-color: var(--el-message-bg-color) !important;
  color: var(--el-message-text-color) !important;
  border-color: var(--el-color-error) !important;
}

html.dark .el-message__content {
  color: var(--el-message-text-color) !important;
  font-weight: 500 !important;
}

html.dark .el-message__icon {
  color: var(--el-message-text-color) !important;
}

html.dark .el-message__closeBtn {
  color: #cccccc !important;
}

html.dark .el-message__closeBtn:hover {
  color: var(--el-message-text-color) !important;
}

html.dark .el-calendar {
  background-color: var(--bg-primary) !important;
  color: var(--text-primary) !important;
}

html.dark .el-calendar__header {
  background-color: var(--bg-primary) !important;
  color: var(--text-primary) !important;
  border-bottom-color: var(--border-color) !important;
}

html.dark .el-calendar__title {
  color: var(--text-primary) !important;
}

html.dark .el-calendar__button-group {
  background-color: var(--bg-primary) !important;
}

html.dark .el-button {
  background-color: var(--bg-secondary) !important;
  border-color: var(--border-color) !important;
  color: var(--text-primary) !important;
}

html.dark .el-button:hover {
  background-color: var(--bg-tertiary) !important;
  border-color: var(--primary-color) !important;
  color: var(--text-primary) !important;
}

html.dark .el-calendar-table {
  background-color: var(--bg-primary) !important;
}

html.dark .el-calendar-table th {
  background-color: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

html.dark .el-calendar-table td {
  background-color: var(--bg-primary) !important;
  border-color: var(--border-color) !important;
}

html.dark .el-calendar-table td:hover {
  background-color: var(--bg-secondary) !important;
}

html.dark .el-calendar-table .el-calendar-day {
  color: var(--text-primary) !important;
}

html.dark .el-calendar-table .is-today .el-calendar-day {
  background-color: var(--primary-color) !important;
  color: #ffffff !important;
}

html.dark .calendar-cell-desktop {
  background-color: transparent !important;
}

html.dark .cell-date-desktop {
  color: var(--text-primary) !important;
}

html.dark .cell-status-desktop {
  color: var(--text-secondary) !important;
}

html.dark .signed-text-desktop {
  color: var(--success-color) !important;
}

html.dark .unsigned-text-desktop {
  color: var(--text-tertiary) !important;
}

html.dark .signed-icon-desktop {
  color: var(--success-color) !important;
}

.time-slot-status {
  display: flex;
  flex-direction: row;
  gap: 2px;
  margin-top: 4px;
  justify-content: center;
}

.time-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 3px;
  border-radius: 3px;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  min-width: 24px;
  width: 24px;
  height: 20px;
}

.time-slot.signed {
  background-color: var(--success-color);
  border-color: var(--success-color);
}

.time-label {
  font-size: 9px;
  font-weight: 600;
  color: var(--text-secondary);
  line-height: 1;
}

.time-slot.signed .time-label {
  color: #ffffff;
}

.slot-icon {
  font-size: 7px;
  color: #ffffff;
  margin-left: 2px;
}

html.dark .time-slot {
  background-color: var(--bg-tertiary);
  border-color: var(--border-color);
}

html.dark .time-slot.signed {
  background-color: var(--success-color);
  border-color: var(--success-color);
}

html.dark .time-label {
  color: var(--text-secondary);
}

html.dark .time-slot.signed .time-label {
  color: #ffffff;
}

html.dark .slot-icon {
  color: #ffffff;
}

.calendar-cell-desktop {
  cursor: pointer;
  transition: all 0.2s ease;
}

.calendar-cell-desktop:hover {
  background-color: var(--bg-secondary);
  border-radius: 4px;
}

html.dark .calendar-cell-desktop:hover {
  background-color: var(--bg-secondary);
}

.date-details-dialog-desktop .el-dialog__body {
  padding: 20px;
}

.date-details-content-desktop {
  text-align: center;
}

.selected-date-desktop {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
  padding: 10px;
  background-color: var(--bg-secondary);
  border-radius: 8px;
}

.attendance-times-desktop {
  min-height: 100px;
}

.no-attendance-desktop {
  color: var(--text-tertiary);
  font-size: 14px;
  padding: 20px;
}

.attendance-time-item-desktop {
  display: flex;
    align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  margin: 8px 0;
  background-color: var(--bg-secondary);
  border-radius: 6px;
  border-left: 3px solid var(--success-color);
}

.time-icon-desktop {
  color: var(--success-color);
  font-size: 16px;
}

.time-text-desktop {
  font-size: 16px;
    font-weight: 500;
  color: var(--text-primary);
  font-family: 'Courier New', monospace;
}

.time-slot-label-desktop {
  font-size: 12px;
  color: var(--text-secondary);
  background-color: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 3px;
}

html.dark .selected-date-desktop {
  color: var(--text-primary);
  background-color: var(--bg-secondary);
}

html.dark .no-attendance-desktop {
  color: var(--text-tertiary);
}

html.dark .attendance-time-item-desktop {
  background-color: var(--bg-secondary);
}

html.dark .time-icon-desktop {
  color: var(--success-color);
}

html.dark .time-text-desktop {
  color: var(--text-primary);
}

html.dark .time-slot-label-desktop {
  color: var(--text-secondary);
  background-color: var(--bg-tertiary);
}

.calendar-header-desktop {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.header-actions {
  display: flex;
  gap: 8px;
  margin-left: 20px;
}

html.dark .calendar-header-desktop {
  background-color: var(--bg-primary);
  border-bottom-color: var(--border-color);
}

html.dark .header-title {
  color: var(--text-primary);
}

.el-calendar-table th {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  background-color: var(--bg-secondary);
  border-color: var(--border-color);
}

html.dark .el-calendar-table th {
  color: var(--text-primary);
  background-color: var(--bg-secondary);
  border-color: var(--border-color);
}

.el-calendar-table th:nth-child(1)::before {
  content: '日';
}

.el-calendar-table th:nth-child(2)::before {
  content: '一';
}

.el-calendar-table th:nth-child(3)::before {
  content: '二';
}

.el-calendar-table th:nth-child(4)::before {
  content: '三';
}

.el-calendar-table th:nth-child(5)::before {
  content: '四';
}

.el-calendar-table th:nth-child(6)::before {
  content: '五';
}

.el-calendar-table th:nth-child(7)::before {
  content: '六';
}

.el-calendar-table th {
  font-size: 0;
}

.el-calendar-table th::before {
  font-size: 14px;
  font-weight: 500;
}
</style>

