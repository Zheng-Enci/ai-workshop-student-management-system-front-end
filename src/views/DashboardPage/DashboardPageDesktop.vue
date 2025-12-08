<template>
  <div class="dashboard-container">
    <div class="header">
      <div class="header-left">
        <el-button @click="goBack" class="back-btn" type="primary" :icon="ArrowLeft" circle></el-button>
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊" class="logo" @click="toggleTheme" title="切换主题模式">
        <div class="title-section">
          <h1>人工智能创作坊</h1>
          <p>Artificial Intelligence Workshop</p>
        </div>
      </div>
      <div class="header-right">
        <div class="slogan">
          <img src="@/assets/QunCeQunLiChuangXingGongXing.png" alt="群策群力，创新共行" class="slogan-img">
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="left-section">
        <div class="punch-card">
          <h2>排行榜</h2>

          <div class="top-students">
            <div class="chart-header">
              <div class="controls-section">
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
              </div>
            </div>
            <div ref="attendanceChart" class="attendance-chart"></div>
          </div>

          <div class="summary-stats">
            <div class="stats-row">
              <div class="total-count">
                  <span class="label">
                    <el-icon class="stat-icon"><Calendar /></el-icon>
                   本月签到总人数
                  </span>
                  <span class="value">{{ monthlyAttendanceCount }}人</span>
              </div>
              <div class="total-count">
                <span class="label">
                  <el-icon class="stat-icon"><Clock /></el-icon>
                  今日签到总人数
                </span>
                <span class="value">{{ todayCount }}人</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="right-section">
        <div class="overview-card">
          <h2>学生总览</h2>

          <div class="charts-container">
            <div class="chart-section">
              <h3>年级分布</h3>
              <div ref="gradeChart" class="chart"></div>
            </div>

            <div class="chart-section">
              <h3>专业分布</h3>
              <div ref="majorChart" class="chart"></div>
            </div>
          </div>

          <div class="environment-mechanism">
            <div class="mechanism-card">
              <h2>AI 坊文明公约</h2>
              
              <div class="mechanism-content">
                <div class="mechanism-section">
                  <p>厦门工学院人工智能创作坊环境保障机制适用于所有入坊师生，遵循"谁使用，谁负责；人走场清，物归原位；共同维护"原则。个人工位需人走椅归、桌面整洁、垃圾自清；公共区域保持地面无杂物、设备用后归位；最后离开者需关闭照明空调、关好门窗。使用者为第一责任人，团队值日督促规范，管理员巡查，违规者暂停使用权限并承担相应责任。</p>
                </div>
              </div>
            </div>
          </div>

          <div class="summary-stats">
            <div class="stats-row">
              <div class="total-count">
                <span class="label">
                  <el-icon class="stat-icon"><User /></el-icon>
                  坊内成员人数
                </span>
                <span class="value">{{ workshopMembersCount }}人</span>
              </div>
              <div class="level-stats">
                <div class="level-item admin-level">
                  <div class="level-icon">
                    <el-icon><Setting /></el-icon>
                  </div>
                  <div class="level-content">
                    <span class="level-label">管理员</span>
                    <span class="level-value">{{ levelStats.admin }}人</span>
                  </div>
                </div>
                <div class="level-item core-level">
                  <div class="level-icon">
                    <el-icon><Star /></el-icon>
                  </div>
                  <div class="level-content">
                    <span class="level-label">核心成员</span>
                    <span class="level-value">{{ levelStats.core }}人</span>
                  </div>
                </div>
                <div class="level-item normal-level">
                  <div class="level-icon">
                    <el-icon><Avatar /></el-icon>
                  </div>
                  <div class="level-content">
                    <span class="level-label">普通成员</span>
                    <span class="level-value">{{ levelStats.normal }}人</span>
                  </div>
                </div>
                <div class="level-item club-level">
                  <div class="level-icon">
                    <el-icon><User /></el-icon>
                  </div>
                  <div class="level-content">
                    <span class="level-label">社团成员</span>
                    <span class="level-value">{{ clubMembers }}人</span>
                  </div>
                </div>
              </div>
              <div class="system-info">
                <div class="system-name">人工智能创作坊</div>
                <div class="system-subtitle">智慧学生管理系统</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressWidth + '%' }"></div>
      </div>
    </div>

    <div class="phone-display">
      <div class="verification-code-card">
        <div class="verification-code-label">签到验证码</div>
        <div class="verification-code-value">
          <span v-if="verificationCodeStatus === 'loading'">获取中...</span>
          <span v-else-if="verificationCodeStatus === 'success'">{{ verificationCode }}</span>
          <span v-else-if="verificationCodeStatus === 'error'" class="error-text">本机无权获取</span>
        </div>
      </div>

      <div v-if="currentQRType === 'website'" class="website-qr-section">
        <img src="@/assets/ShouJiDuanQianDanRuKou.png" alt="手机端签到入口" class="website-qr-code">
        <div class="website-qr-text" style="color: #60a5fa !important; text-shadow: 0 0 8px rgba(96, 165, 250, 1) !important; font-weight: 800 !important;">手机端签到入口</div>
      </div>

      <div v-if="currentQRType === 'wechat'" class="wechat-qr-section">
        <img src="@/assets/ErWeiMa.png" alt="公众号二维码" class="qr-code">
        <div class="qr-text" style="color: #60a5fa !important; text-shadow: 0 0 8px rgba(96, 165, 250, 1) !important; font-weight: 800 !important;">扫码了解更多</div>
      </div>

      <!-- 二维码切换按钮 -->
      <div class="qr-switch-buttons">
        <el-button 
          @click="switchQRType"
          class="qr-switch-btn"
          type="primary"
        >
          {{ currentQRType === 'website' ? '切换到公众号' : '切换到签到入口' }}
        </el-button>
      </div>

      <img src="@/assets/Phone.png" alt="手机展示" class="phone-image">
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { ElMessage, ElButton, ElIcon, ElRadioGroup, ElRadioButton } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-radio-group.css'
import 'element-plus/theme-chalk/el-radio-button.css'
import { ArrowLeft, Calendar, Clock, User, Setting, Star, Avatar } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
// ECharts 按需引入
import * as echarts from 'echarts/core'
import { PieChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import 'echarts-wordcloud'

// 注册需要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  PieChart,
  BarChart,
  CanvasRenderer
])
import { useThemeStore } from '@/stores/theme'
import {
  getGradeStatistics,
  getMajorStatistics,
  getTotalStudentCount,
  getStudentCountByLevel
} from '@/api/student'
import {
  getMonthlyAttendanceCount,
  getDailyAttendanceCount,
  getCurrentMonthTop10Students,
  getWeeklyRanking,
  getMonthlyRanking,
  getYearlyRanking,
  getTopStudentsByTimeRange,
  getLast7DaysRanking,
  getLast30DaysRanking,
  getVerificationCode
} from '@/api/attendance'

const router = useRouter()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore

const gradeChart = ref(null)
const majorChart = ref(null)
const attendanceChart = ref(null)
const progressWidth = ref(0)
const currentQRType = ref('website')
const verificationCode = ref('')
const verificationCodeStatus = ref('loading')
const verificationCodeInterval = ref(null)
const verificationCodeRetryCount = ref(0)
const verificationCodeHasSuccess = ref(false)
const MAX_RETRY_COUNT = 8

const switchQRType = () => {
  currentQRType.value = currentQRType.value === 'website' ? 'wechat' : 'website'
}
const progressInterval = ref(null)

const topStudents = ref([])
const totalStudents = ref(0)
const todayCount = ref(0)
const dailyAvgAttendance = ref(0)
const attendanceRate = ref(0)
const monthlyAttendanceCount = ref(0)
const workshopMembersCount = ref(0)
const levelStats = ref({
  admin: 0,
  core: 0,
  normal: 0
})
const clubMembers = ref(0)

const selectedTimeRange = ref('week')
const selectedTopN = 16

const timeRangeOptions = [
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '本年度', value: 'year' },
  { label: '最近7天', value: 'last7days' },
  { label: '最近30天', value: 'last30days' },
  { label: '全部', value: 'all' }
]


let gradeChartInstance = null
let majorChartInstance = null
let attendanceChartInstance = null

const goBack = () => {
  router.push('/navigation')
}

const handleTimeRangeChange = async () => {
  saveUserPreferences()
  await loadRankingData()
}

const saveUserPreferences = () => {
  const preferences = {
    timeRange: selectedTimeRange.value
  }
  localStorage.setItem('dashboardPreferences', JSON.stringify(preferences))
}

const loadUserPreferences = () => {
  const saved = localStorage.getItem('dashboardPreferences')
  if (saved) {
    try {
      const preferences = JSON.parse(saved)
      selectedTimeRange.value = preferences.timeRange || 'week'
    } catch (error) {
      selectedTimeRange.value = 'week'
    }
  }
}

const calculateDailyAvgAttendance = (monthlyCount) => {
  const now = new Date()
  const currentDay = now.getDate()
  const year = now.getFullYear()
  const month = now.getMonth()
  
  const holidays = getHolidaysForMonth(year, month)
  
  let workingDays = 0
  const startOfMonth = new Date(year, month, 1)
  const endOfMonth = new Date(year, month, currentDay)
  
  for (let day = new Date(startOfMonth); day <= endOfMonth; day.setDate(day.getDate() + 1)) {
    const dayOfWeek = day.getDay()
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6)
    const dateString = day.toISOString().split('T')[0]
    const isHoliday = holidays.includes(dateString)
    
    if (!isWeekend && !isHoliday) {
      workingDays++
    }
  }
  
  if (workingDays === 0) {
    return 0
  }
  
  return parseFloat((monthlyCount / workingDays).toFixed(2))
}

const getHolidaysForMonth = (year, month) => {
  const holidays = []
  
  const monthHolidays = {
    0: [`${year}-01-01`],
    1: [`${year}-02-10`, `${year}-02-11`, `${year}-02-12`, `${year}-02-13`, `${year}-02-14`, `${year}-02-15`, `${year}-02-16`, `${year}-02-17`],
    3: [`${year}-04-05`, `${year}-04-06`, `${year}-04-07`],
    4: [`${year}-05-01`, `${year}-05-02`, `${year}-05-03`],
    8: [`${year}-09-15`, `${year}-09-16`, `${year}-09-17`],
    9: [`${year}-10-01`, `${year}-10-02`, `${year}-10-03`, `${year}-10-04`, `${year}-10-05`, `${year}-10-06`, `${year}-10-07`]
  }
  
  if (monthHolidays[month]) {
    holidays.push(...monthHolidays[month])
  }
  
  return holidays
}

const loadRankingData = async () => {
  try {
    let response
    
    switch (selectedTimeRange.value) {
      case 'week': {
        const weekStart = getCurrentWeekStart()
        response = await getWeeklyRanking(weekStart, selectedTopN)
        break
      }
      case 'month': {
        const now = new Date()
        response = await getMonthlyRanking(now.getFullYear(), now.getMonth() + 1, selectedTopN)
        break
      }
      case 'year':
        response = await getYearlyRanking(new Date().getFullYear(), selectedTopN)
        break
      case 'last7days':
        response = await getLast7DaysRanking(selectedTopN)
        break
      case 'last30days': {
        response = await getLast30DaysRanking(selectedTopN)
        break
      }
      case 'all': {
        const PROJECT_LAUNCH_DATE = new Date('2024-09-09T00:00:00')
        const now = new Date()
        const startTime = PROJECT_LAUNCH_DATE.toISOString().split('T')[0] + 'T00:00:00'
        const endTime = now.toISOString().split('T')[0] + 'T23:59:59'
        response = await getTopStudentsByTimeRange(startTime, endTime, selectedTopN)
        break
      }
      default:
        response = await getCurrentMonthTop10Students()
        break
    }
    
    if (response.code === 200) {
      const data = response.data
      const processedData = data.map(item => ({
        name: item.studentName,
        grade: item.studentGrade,
        major: item.studentMajor,
        attendanceCount: item.attendanceCount,
        levelName: getLevelName(item.studentLevel)
      }))
      
      topStudents.value = processedData
      await initAttendanceChart(processedData)
    }
  } catch (error) {
    ElMessage.error('获取排行榜数据失败：' + error.message)
  }
}

const getCurrentWeekStart = () => {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
  const monday = new Date(now.setDate(diff))
  return monday.toISOString().split('T')[0]
}

const getLevelName = (levelCode) => {
  const levelMap = {
    0: '社团成员',
    1: '普通成员', 
    2: '核心成员',
    3: '管理员'
  }
  return levelMap[levelCode] || '社团成员'
}

const loadLevelStats = async () => {
  try {
    const [adminData, coreData, normalData] = await Promise.all([
      getStudentCountByLevel(3),
      getStudentCountByLevel(2),
      getStudentCountByLevel(1)
    ])

    if (adminData.code === 200) {
      levelStats.value.admin = adminData.data
    }

    if (coreData.code === 200) {
      levelStats.value.core = coreData.data
    }

    if (normalData.code === 200) {
      levelStats.value.normal = normalData.data
    }

    // 计算社团成员数量
    calculateClubMembers()
    
    // 计算签到率
    if (monthlyAttendanceCount.value > 0) {
      const rate = calculateAttendanceRate(monthlyAttendanceCount.value)
      attendanceRate.value = rate
    }
  } catch (error) {
    ElMessage.error('获取等级统计失败')
  }
}

const calculateClubMembers = () => {
  clubMembers.value = totalStudents.value - levelStats.value.admin - levelStats.value.core - levelStats.value.normal
  // 坊内成员人数 = 管理员 + 核心成员 + 普通成员
  workshopMembersCount.value = levelStats.value.admin + levelStats.value.core + levelStats.value.normal
}

const calculateAttendanceRate = (monthlyCount) => {
  const workshopMembersCount = levelStats.value.admin + levelStats.value.core + levelStats.value.normal
  
  if (workshopMembersCount === 0) {
    return 0
  }
  
  return parseFloat(((monthlyCount / workshopMembersCount) * 100).toFixed(1))
}

const loadVerificationCode = async () => {
  if (!verificationCodeHasSuccess.value && verificationCodeRetryCount.value >= MAX_RETRY_COUNT) {
    verificationCodeStatus.value = 'error'
    return
  }

  try {
    const response = await getVerificationCode()
    if (response.code === 200 && response.data) {
      if (verificationCode.value !== response.data) {
      verificationCode.value = response.data
        verificationCodeStatus.value = 'success'
      }
      verificationCodeHasSuccess.value = true
      verificationCodeRetryCount.value = 0
    } else {
      if (!verificationCodeHasSuccess.value) {
        verificationCodeRetryCount.value++
        if (verificationCodeRetryCount.value >= MAX_RETRY_COUNT) {
          verificationCode.value = ''
          verificationCodeStatus.value = 'error'
          if (verificationCodeInterval.value) {
            clearInterval(verificationCodeInterval.value)
            verificationCodeInterval.value = null
          }
        }
      }
    }
  } catch (error) {
    if (!verificationCodeHasSuccess.value) {
      verificationCodeRetryCount.value++
      if (verificationCodeRetryCount.value >= MAX_RETRY_COUNT) {
    verificationCode.value = ''
        verificationCodeStatus.value = 'error'
        if (verificationCodeInterval.value) {
          clearInterval(verificationCodeInterval.value)
          verificationCodeInterval.value = null
        }
      }
    }
  }
}

const loadData = async () => {
  try {
    const [
      gradeData,
      majorData,
      totalData,
      monthlyData,
      dailyData
    ] = await Promise.all([
      getGradeStatistics(),
      getMajorStatistics(),
      getTotalStudentCount(),
      getMonthlyAttendanceCount(),
      getDailyAttendanceCount()
    ])

    if (gradeData.code === 200 && gradeData.data) {
      initGradeChart(gradeData.data)
    }

    if (majorData.code === 200 && majorData.data) {
      initMajorChart(majorData.data)
    }

    if (totalData.code === 200 && totalData.data) {
      totalStudents.value = totalData.data.count
    }

    if (monthlyData.code === 200 && monthlyData.data) {
      const dailyAvg = calculateDailyAvgAttendance(monthlyData.data.count)
      dailyAvgAttendance.value = dailyAvg
      
      // 保存月度数据，等levelStats加载完成后再计算签到率
      monthlyAttendanceCount.value = monthlyData.data.count
    }

    if (dailyData.code === 200 && dailyData.data) {
      todayCount.value = dailyData.data.count
    }

    await loadRankingData()
    await loadLevelStats()
    
    calculateClubMembers()
    
    watch(selectedTimeRange, async (newValue, oldValue) => {
      if (newValue !== oldValue) {
        saveUserPreferences()
        await loadRankingData()
      }
    })
  } catch (error) {
    ElMessage.error('数据加载失败：' + error.message)
  }
}

const initGradeChart = (data) => {
  if (!gradeChart.value) return

  if (gradeChartInstance) {
    gradeChartInstance.dispose()
  }

  gradeChartInstance = echarts.init(gradeChart.value)

  const sortedData = [...data].sort((a, b) => a.grade - b.grade)
  const isDark = themeStore.isDarkMode

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      textStyle: {
        color: isDark ? '#ffffff' : '#2c3e50'
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: sortedData.map(item => `${item.grade}年级`),
      textStyle: {
        color: isDark ? '#ffffff' : '#2c3e50'
      }
    },
    series: [
      {
        name: '年级分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center',
          color: isDark ? '#ffffff' : '#2c3e50'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold',
            color: isDark ? '#ffffff' : '#2c3e50'
          }
        },
        labelLine: {
          show: false
        },
        data: sortedData.map(item => ({
          value: item.count,
          name: `${item.grade}年级`
        }))
      }
    ]
  }

  gradeChartInstance.setOption(option)
}

const initMajorChart = (data) => {
  if (!majorChart.value) return

  if (majorChartInstance) {
    majorChartInstance.dispose()
  }

  majorChartInstance = echarts.init(majorChart.value)

  const sortedData = [...data].sort((a, b) => b.count - a.count)
  const isDark = themeStore.isDarkMode
  
  const wordCloudData = sortedData.map((item, index) => ({
    name: item.major,
    value: item.count,
    textStyle: {
      color: isDark ? getDarkStableColor(index) : getStableColor(index)
    }
  }))

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}人',
      backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      textStyle: {
        color: isDark ? '#ffffff' : '#2c3e50'
      }
    },
    series: [
      {
        type: 'wordCloud',
        gridSize: 1,
        sizeRange: [16, 50],
        rotationRange: [0, 0],
        rotationStep: 0,
        shape: 'circle',
        width: '100%',
        height: '100%',
        left: 'center',
        top: 'center',
        right: null,
        bottom: null,
        layoutAnimation: false,
        shrinkToFit: true,
        drawOutOfBound: false,
        random: function() {
          return 0.5;
        },
        textStyle: {
          fontFamily: 'Microsoft YaHei, sans-serif',
          fontWeight: 'bold',
          color: function(params) {
            return isDark ? getDarkStableColor(params.dataIndex) : getStableColor(params.dataIndex)
          }
        },
        emphasis: {
          textStyle: {
            shadowBlur: 10,
            shadowColor: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)'
          }
        },
        data: wordCloudData
      }
    ]
  }

  majorChartInstance.setOption(option)
}

// 为每个专业分配固定的颜色，确保颜色稳定
const getStableColor = (index) => {
  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c',
    '#4facfe', '#00f2fe', '#a8edea', '#fed6e3',
    '#ff9a9e', '#fecfef', '#fecfef', '#a8edea',
    '#d299c2', '#fad0c4', '#ffd1ff', '#a8e6cf'
  ]
  return colors[index % colors.length]
}

const getDarkStableColor = (index) => {
  const colors = [
    '#00d4ff', '#ff6b6b', '#4ecdc4', '#45b7d1',
    '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff',
    '#5f27cd', '#00d2d3', '#ff9f43', '#10ac84',
    '#ee5a24', '#0984e3', '#6c5ce7', '#a29bfe'
  ]
  return colors[index % colors.length]
}

const initAttendanceChart = async (data) => {
  if (!attendanceChart.value) return

  if (attendanceChartInstance) {
    attendanceChartInstance.dispose()
  }

  attendanceChartInstance = echarts.init(attendanceChart.value)

  const sortedData = [...data].sort((a, b) => a.attendanceCount - b.attendanceCount)
  const isDark = themeStore.isDarkMode
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      textStyle: {
        color: isDark ? '#ffffff' : '#2c3e50'
      },
      formatter: function(params) {
        const data = sortedData[params[0].dataIndex]
        return `${data.name} (${data.levelName})<br/>${data.grade}年级 - ${data.major}<br/>签到次数: ${data.attendanceCount}次`
      }
    },
    grid: {
      left: '0%',
      right: '15%',
      bottom: '3%',
      top: '0%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 12,
        formatter: '{value}次',
        color: isDark ? '#ffffff' : '#2c3e50'
      },
      axisLine: {
        lineStyle: {
          color: isDark ? '#ffffff' : '#2c3e50'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: sortedData.map(item => `${item.name} (${item.levelName})`),
      axisLabel: {
        interval: 0,
        fontSize: 12,
        color: isDark ? '#ffffff' : '#2c3e50',
        formatter: function(value) {
          return value
        }
      },
      axisLine: {
        lineStyle: {
          color: isDark ? '#ffffff' : '#2c3e50'
        }
      }
    },
    series: [
      {
        name: '签到次数',
        type: 'bar',
        data: sortedData.map(item => item.attendanceCount),
        barWidth: '60%',
        itemStyle: {
          color: function(params) {
            const totalCount = sortedData.length
            const index = params.dataIndex
            
            if (totalCount <= 10) {
              const colors = ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1']
              return colors[index]
            } else {
              const hue = 200 + (index / totalCount) * 40
              const saturation = 70 + (index / totalCount) * 20
              const lightness = 85 - (index / totalCount) * 30
              return `hsl(${hue}, ${saturation}%, ${lightness}%)`
            }
          },
          borderRadius: [0, 4, 4, 0]
        },
        label: {
          show: true,
          position: 'right',
          formatter: function(params) {
            const data = sortedData[params.dataIndex]
            return `${data.grade}年级\n${data.major}`
          },
          fontSize: 11,
          color: isDark ? '#ffffff' : '#666',
          lineHeight: 14,
          distance: 10
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  attendanceChartInstance.setOption(option)
}

const startProgress = () => {
  progressWidth.value = 0
  progressInterval.value = setInterval(() => {
    progressWidth.value += 100 / 150
    if (progressWidth.value >= 100) {
      progressWidth.value = 0
      loadData()
    }
  }, 100)
}

const startVerificationCodeRefresh = () => {
  loadVerificationCode()
  verificationCodeInterval.value = setInterval(() => {
    loadVerificationCode()
  }, 500)
}

const handleResize = () => {
  if (gradeChartInstance) {
    gradeChartInstance.resize()
  }
  if (majorChartInstance) {
    majorChartInstance.resize()
  }
  if (attendanceChartInstance) {
    attendanceChartInstance.resize()
  }
}

watch(() => themeStore.isDarkMode, () => {
  setTimeout(() => {
    loadData()
  }, 100)
})

onMounted(async () => {
  await nextTick()
  loadUserPreferences()
  await loadData()
  startProgress()
  startVerificationCodeRefresh()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (progressInterval.value) {
    clearInterval(progressInterval.value)
  }
  if (verificationCodeInterval.value) {
    clearInterval(verificationCodeInterval.value)
  }
  if (gradeChartInstance) {
    gradeChartInstance.dispose()
  }
  if (majorChartInstance) {
    majorChartInstance.dispose()
  }
  if (attendanceChartInstance) {
    attendanceChartInstance.dispose()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: var(--bg-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: var(--text-primary);
  position: relative;
  overflow-x: hidden;
}


.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-btn {
  width: 40px;
  height: 40px;
  background: var(--primary-color);
  border: none;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.logo {
  width: 60px;
  height: 60px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo:hover {
  transform: scale(1.1);
  filter: brightness(1.2);
}

.title-section h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 5px 0;
  color: #2c3e50;
  transition: color 0.3s ease;
}

.dark .title-section h1 {
  color: #ffffff;
}

.title-section p {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0;
  transition: color 0.3s ease;
}

.dark .title-section p {
  color: #e2e8f0;
}

.slogan-text {
  font-size: 18px;
  font-weight: 600;
  color: #667eea;
  margin: 8px 0 0 0;
  transition: color 0.3s ease;
  text-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
}

.dark .slogan-text {
  color: #60a5fa;
  text-shadow: 0 2px 4px rgba(96, 165, 250, 0.5);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.analysis-btn {
  height: 40px;
  padding: 0 20px;
  font-weight: 600;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.analysis-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.slogan {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  margin-right: 8px;
}

.slogan-img {
  height: 80px;
  transition: filter 0.3s ease;
}

.dark .slogan-img {
  filter: invert(1);
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
  padding: 10px 240px 40px 40px;
  min-height: calc(100vh - 200px);
}

.left-section {
  display: flex;
  flex-direction: column;
}

.right-section {
  display: flex;
  flex-direction: column;
}

.punch-card, .overview-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.dark .punch-card, .dark .overview-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px var(--shadow-color);
}

.punch-card h2, .overview-card h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: #2c3e50;
  transition: color 0.3s ease;
}

.dark .punch-card h2, .dark .overview-card h2 {
  color: #ffffff;
}

.subtitle {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0 0 30px 0;
  transition: color 0.3s ease;
}

.dark .subtitle {
  color: #e2e8f0;
}

.top-students {
  margin-bottom: 30px;
  flex: 1;
}

.chart-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
}

.controls-section {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.time-range-selector {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}


.chart-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #2c3e50;
  transition: color 0.3s ease;
}

.dark .chart-header h3 {
  color: #ffffff;
}

.switch-buttons {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.switch-buttons .el-button {
  border: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.switch-buttons .el-button--primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.dark .switch-buttons .el-button {
  color: #e2e8f0;
  background: #374151;
  border-color: #4b5563;
}

.dark .switch-buttons .el-button:hover {
  color: #ffffff;
  background: #4b5563;
  border-color: #6b7280;
}

.dark .switch-buttons .el-button--primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.switch-buttons .el-button--default {
  background: #f8f9fa;
  color: #6c757d;
}

.switch-buttons .el-button--default:hover {
  background: #e9ecef;
  color: #495057;
}

.student-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.student-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.rank {
  width: 30px;
  height: 30px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin-right: 15px;
}

.student-info {
  flex: 1;
}

.name {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
  transition: color 0.3s ease;
}

.dark .name {
  color: #ffffff;
}

.details {
  font-size: 14px;
  color: #7f8c8d;
  transition: color 0.3s ease;
}

.dark .details {
  color: #e2e8f0;
}

.count {
  font-size: 18px;
  font-weight: 700;
  color: #667eea;
}


.charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
  flex: 1;
}

.chart-section h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #2c3e50;
  text-align: center;
  transition: color 0.3s ease;
}

.dark .chart-section h3 {
  color: #ffffff;
}

.chart {
  width: 100%;
  height: 300px;
}

.attendance-chart {
  width: 100%;
  height: 550px;
}

.summary-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.summary-stats .stats-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.total-count {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.level-stats {
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
}

.level-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px;
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%);
  border-radius: 8px;
  border: 1px solid #e1e8ff;
  min-width: 90px;
  height: 70px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  justify-content: center;
}

.level-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.level-item:hover {
  transform: translateY(-6px) scale(1.05);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
}

.level-icon {
  margin-bottom: 6px;
  position: relative;
  z-index: 2;
}

.level-icon .el-icon {
  font-size: 18px;
  color: rgba(102, 126, 234, 0.8);
}

.level-content {
  position: relative;
  z-index: 2;
}

.level-label {
  font-size: 13px;
  color: #5a6c7d;
  margin-bottom: 4px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.level-value {
  font-size: 18px;
  font-weight: 800;
  color: #2c3e50;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.admin-level {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  border-color: #1e40af;
  box-shadow: 0 2px 8px rgba(30, 58, 138, 0.2);
}

.admin-level::before {
  background: linear-gradient(90deg, #1e3a8a, #3b82f6);
}

.admin-level:hover {
  box-shadow: 0 4px 16px rgba(30, 58, 138, 0.3);
}

.admin-level .level-icon .el-icon {
  color: rgba(255, 255, 255, 0.95);
}

.admin-level .level-label {
  color: rgba(255, 255, 255, 0.9);
}

.admin-level .level-value {
  color: #ffffff;
}

.core-level {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  border-color: #047857;
  box-shadow: 0 2px 8px rgba(5, 150, 105, 0.2);
}

.core-level::before {
  background: linear-gradient(90deg, #059669, #10b981);
}

.core-level:hover {
  box-shadow: 0 4px 16px rgba(5, 150, 105, 0.3);
}

.core-level .level-icon .el-icon {
  color: rgba(255, 255, 255, 0.95);
}

.core-level .level-label {
  color: rgba(255, 255, 255, 0.9);
}

.core-level .level-value {
  color: #ffffff;
}

.normal-level {
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  border-color: #6d28d9;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.2);
}

.normal-level::before {
  background: linear-gradient(90deg, #7c3aed, #a855f7);
}

.normal-level:hover {
  box-shadow: 0 4px 16px rgba(124, 58, 237, 0.3);
}

.normal-level .level-icon .el-icon {
  color: rgba(255, 255, 255, 0.95);
}

.normal-level .level-label {
  color: rgba(255, 255, 255, 0.9);
}

.normal-level .level-value {
  color: #ffffff;
}

.club-level {
  background: linear-gradient(135deg, #96ceb4 0%, #b8e6b8 100%);
  border-color: #66bb6a;
  box-shadow: 0 2px 8px rgba(150, 206, 180, 0.2);
}

.club-level::before {
  background: linear-gradient(90deg, #96ceb4, #66bb6a);
}

.club-level:hover {
  box-shadow: 0 4px 16px rgba(150, 206, 180, 0.3);
}

.club-level .level-label {
  color: #2e7d32;
}

.club-level .level-value {
  color: #1b5e20;
}

/* 夜间模式下的club-level样式 */
html.dark .club-level {
  background: linear-gradient(135deg, #2d5a3d 0%, #4a7c59 100%);
  border-color: #2d5a3d;
  box-shadow: 0 2px 8px rgba(45, 90, 61, 0.3);
}

html.dark .club-level::before {
  background: linear-gradient(90deg, #2d5a3d, #4a7c59);
}

html.dark .club-level:hover {
  box-shadow: 0 4px 16px rgba(45, 90, 61, 0.4);
}

html.dark .club-level .level-icon .el-icon {
  color: rgba(255, 255, 255, 0.95);
}

html.dark .club-level .level-label {
  color: rgba(255, 255, 255, 0.9);
}

html.dark .club-level .level-value {
  color: #ffffff;
}

.label {
  font-size: 18px;
  color: #7f8c8d;
  margin-bottom: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.value {
  font-size: 28px;
  font-weight: 700;
  color: #667eea;
  transition: all 0.3s ease;
}

.value.animate {
  transform: scale(1.1);
  color: #4facfe;
}

.stat-icon {
  font-size: 24px;
  color: #667eea;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
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

.phone-display {
  position: fixed;
  bottom: 80px;
  right: 40px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 25px;
  align-items: center;
}

.verification-code-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
  width: 150px;
  min-height: 100px;
  justify-content: center;
  transition: all 0.3s ease;
}

.verification-code-label {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 600;
  text-align: center;
}

.verification-code-value {
  font-size: 32px;
  font-weight: 800;
  color: var(--primary-color);
  text-align: center;
  letter-spacing: 4px;
  font-family: 'Courier New', monospace;
  text-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
  transition: opacity 0.3s ease;
}

.verification-code-value span {
  display: inline-block;
  transition: opacity 0.3s ease;
}

.verification-code-value .error-text {
  font-size: 16px;
  color: var(--text-secondary);
  letter-spacing: 0;
  text-shadow: none;
}

.dark .verification-code-card {
  background: var(--bg-secondary);
  border-color: var(--border-color);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.dark .verification-code-value {
  color: #60a5fa;
  text-shadow: 0 0 8px rgba(96, 165, 250, 0.5);
}

.website-qr-section, .wechat-qr-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8e8e8;
  width: 150px;
  height: 180px;
  justify-content: center;
}

.website-qr-code, .qr-code {
  width: 120px;
  height: 120px;
  border-radius: 8px;
}

.website-qr-text, .qr-text {
  font-size: 14px;
  color: #2c3e50;
  text-align: center;
  font-weight: 600;
  max-width: 140px;
  line-height: 1.4;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.dark .website-qr-text, .dark .qr-text {
  color: #ffffff !important;
}

.website-qr-text {
  color: #667eea;
  font-weight: 700;
}

.dark .website-qr-text {
  color: #60a5fa !important;
}

.dark .qr-text {
  color: #ffffff !important;
}

.phone-image {
  width: 200px;
  height: auto;
}

.system-info {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.system-name {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
  transition: color 0.3s ease;
}

.dark .system-name {
  color: #ffffff;
}

.system-subtitle {
  font-size: 14px;
  color: #7f8c8d;
  transition: color 0.3s ease;
}

.dark .system-subtitle {
  color: #e2e8f0;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #667eea;
  padding: 8px 40px;
  z-index: 1000;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0;
}

.progress-fill {
  height: 100%;
  background: #ffffff;
  border-radius: 3px;
  transition: width 0.1s linear;
}



@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .charts-container {
    grid-template-columns: 1fr;
  }

  .phone-display {
    display: none;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 20px;
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .main-content {
    padding: 20px;
  }

  .punch-card, .overview-card {
    padding: 20px;
  }

  .footer {
    padding: 15px 20px;
  }
}

/* 强制覆盖二维码文字样式 */
html.dark .website-qr-text {
  color: #60a5fa !important;
}

html.dark .qr-text {
  color: #ffffff !important;
}

.dark .website-qr-text {
  color: #60a5fa !important;
}

.dark .qr-text {
  color: #ffffff !important;
}

/* 针对"扫码了解更多"文字的额外强化 */
html.dark .wechat-qr-section .qr-text {
  color: #ffffff !important;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.8) !important;
  font-weight: 700 !important;
}

.dark .wechat-qr-section .qr-text {
  color: #ffffff !important;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.8) !important;
  font-weight: 700 !important;
}

html.dark .qr-text {
  color: #ffffff !important;
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.5) !important;
}

.dark .qr-text {
  color: #ffffff !important;
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.5) !important;
}

.environment-mechanism {
  margin-top: -20px;
}

.mechanism-card {
  background: var(--bg-card);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.mechanism-card:hover {
  transform: translateY(-2px);
}

.mechanism-card h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  text-align: left;
  padding-bottom: 8px;
}

.mechanism-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.mechanism-section {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 32px;
  transition: all 0.3s ease;
}

.mechanism-section:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.mechanism-section p {
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin: 0;
  text-align: justify;
}

html.dark .mechanism-card {
  background: #1e293b;
}

html.dark .mechanism-card h2 {
  color: #ffffff;
}

html.dark .mechanism-section {
  background: #0f172a;
}

html.dark .mechanism-section p {
  color: #cbd5e1;
}

@media (max-width: 768px) {
  .mechanism-card {
    padding: 20px;
  }
  
  .mechanism-card h2 {
    font-size: 20px;
  }
  
  .mechanism-section {
    padding: 24px;
  }
  
  .mechanism-section p {
    font-size: 14px;
    line-height: 1.7;
  }
}

.qr-switch-buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.qr-switch-btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #667eea, #764ba2) !important;
  border-color: transparent !important;
  color: white !important;
}

.qr-switch-btn:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #5568d3, #6a3d8f) !important;
}

html.dark .qr-switch-btn {
  background: #374151;
  border-color: #4b5563;
  color: #e2e8f0;
}

html.dark .qr-switch-btn:hover {
  background: #4b5563;
  border-color: #6b7280;
}

html.dark .qr-switch-btn.el-button--primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: transparent;
  color: white;
}
</style>

<style>
.time-select-dropdown {
  z-index: 3000 !important;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #ffffff;
  padding: 8px 0;
  min-width: auto !important;
}

.time-select-dropdown .el-select-dropdown__item {
  color: #606266 !important;
  padding: 12px 16px;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 2px 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  background-color: #ffffff !important;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer !important;
  pointer-events: auto !important;
  user-select: none;
}

.time-select-dropdown .el-select-dropdown__item span {
  display: block;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  pointer-events: none !important;
}

.time-select-dropdown .el-select-dropdown__item:hover {
  background-color: #f5f7fa !important;
  color: #409eff !important;
}

.time-select-dropdown .el-select-dropdown__item.selected {
  color: #409eff !important;
  font-weight: 600 !important;
  background-color: #ecf5ff !important;
}

.time-select-dropdown .el-select-dropdown__item.selected:hover {
  background-color: #d9ecff !important;
}

html.dark .time-select-dropdown {
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

html.dark .time-select-dropdown .el-select-dropdown__item {
  color: #e2e8f0 !important;
  background-color: #1e293b !important;
}

html.dark .time-select-dropdown {
  background: #1e293b;
}

html.dark .time-select-dropdown .el-select-dropdown__item:hover {
  background-color: #334155 !important;
  color: #818cf8;
}

html.dark .time-select-dropdown .el-select-dropdown__item.selected {
  color: #818cf8 !important;
  font-weight: 600 !important;
  background-color: rgba(102, 126, 234, 0.2) !important;
}

html.dark .time-select-dropdown .el-select-dropdown__item.selected:hover {
  background-color: rgba(102, 126, 234, 0.3) !important;
}

.time-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.time-radio-group .el-radio-button {
  margin: 0;
}

.time-radio-group .el-radio-button__inner {
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 13px;
  background-color: #ffffff !important;
  border-color: #dcdfe6 !important;
  color: #606266 !important;
}

.time-radio-group .el-radio-button__original-radio:checked + .el-radio-button__inner {
  background-color: #409eff !important;
  border-color: #409eff !important;
  color: #ffffff !important;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3) !important;
}

.time-radio-group .el-radio-button.is-active .el-radio-button__inner {
  background-color: #409eff !important;
  border-color: #409eff !important;
  color: #ffffff !important;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3) !important;
}

html.dark .time-radio-group .el-radio-button__inner {
  background-color: #1e293b !important;
  border-color: #334155 !important;
  color: #e2e8f0 !important;
}

html.dark .time-radio-group .el-radio-button__original-radio:checked + .el-radio-button__inner {
  background-color: #667eea !important;
  border-color: #667eea !important;
  color: #ffffff !important;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4) !important;
}

html.dark .time-radio-group .el-radio-button.is-active .el-radio-button__inner {
  background-color: #667eea !important;
  border-color: #667eea !important;
  color: #ffffff !important;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4) !important;
}
</style>



