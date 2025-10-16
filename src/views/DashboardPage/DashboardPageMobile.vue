<template>
  <div class="dashboard-page-mobile">
    <div class="mobile-header">
      <div class="header-left">
        <el-button type="text" @click="goBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊" class="logo" @click="toggleTheme">
      </div>
      <div class="header-title">数据看板</div>
    </div>

    <div class="mobile-content">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">今日签到</div>
          <div class="stat-value">{{ todayAttendance }}人</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">本月签到总人数</div>
          <div class="stat-value">{{ monthlyAttendanceCount }}人</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">坊内成员人数</div>
          <div class="stat-value">{{ workshopMembersCount }}人</div>
        </div>
      </div>

      <div class="level-stats-mobile">
        <div class="level-item admin-level">
          <el-icon><Setting /></el-icon>
          <div class="level-info">
            <span class="level-label">管理员</span>
            <span class="level-value">{{ levelStats.admin }}人</span>
          </div>
        </div>
        <div class="level-item core-level">
          <el-icon><Star /></el-icon>
          <div class="level-info">
            <span class="level-label">核心成员</span>
            <span class="level-value">{{ levelStats.core }}人</span>
          </div>
        </div>
        <div class="level-item normal-level">
          <el-icon><Avatar /></el-icon>
          <div class="level-info">
            <span class="level-label">普通成员</span>
            <span class="level-value">{{ levelStats.normal }}人</span>
          </div>
        </div>
        <div class="level-item club-level">
          <el-icon><User /></el-icon>
          <div class="level-info">
            <span class="level-label">社团成员</span>
            <span class="level-value">{{ clubMembers }}人</span>
          </div>
        </div>
      </div>

      <div class="ranking-section">
        <div class="section-header">
          <h3>排行榜</h3>
          <div class="controls">
            <el-select v-model="selectedTimeRange" @change="loadRankingData" size="small">
              <el-option label="今日" value="today"></el-option>
              <el-option label="本周" value="week"></el-option>
              <el-option label="本月" value="month"></el-option>
              <el-option label="本季度" value="quarter"></el-option>
              <el-option label="本年度" value="year"></el-option>
              <el-option label="最近7天" value="last7days"></el-option>
              <el-option label="最近30天" value="last30days"></el-option>
              <el-option label="自定义" value="custom"></el-option>
            </el-select>
            <el-select v-model="selectedTopN" @change="loadRankingData" size="small">
              <el-option label="前5名" :value="5"></el-option>
              <el-option label="前10名" :value="10"></el-option>
              <el-option label="前15名" :value="15"></el-option>
              <el-option label="前20名" :value="20"></el-option>
            </el-select>
          </div>
        </div>
        <div class="chart-container">
          <div ref="attendanceChart" class="chart"></div>
        </div>
      </div>

      <div class="charts-section">
        <div class="chart-item">
          <h3>年级分布</h3>
          <div ref="gradeChart" class="chart"></div>
        </div>
        
        <div class="chart-item">
          <h3>专业分布</h3>
          <div ref="majorChart" class="chart"></div>
        </div>
      </div>

      <div class="mechanism-section">
        <div class="mechanism-card">
          <h3>AI 坊文明公约</h3>
          <div class="mechanism-content">
            <p>厦门工学院人工智能创作坊环境保障机制适用于所有入坊师生，遵循"谁使用，谁负责；人走场清，物归原位；共同维护"原则。个人工位需人走椅归、桌面整洁、垃圾自清；公共区域保持地面无杂物、设备用后归位；最后离开者需关闭照明空调、关好门窗。使用者为第一责任人，团队值日督促规范，管理员巡查，违规者暂停使用权限并承担相应责任。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Setting, Star, Avatar, User } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import 'echarts-wordcloud'
import { useThemeStore } from '@/stores/theme'
import {
  getGradeStatistics,
  getMajorStatistics,
  getTotalStudentCount,
  getMonthlyAttendanceCount,
  getDailyAttendanceCount,
  getStudentCountByLevel,
  getCurrentMonthTop10Students,
  getDailyRanking,
  getWeeklyRanking,
  getMonthlyRanking,
  getQuarterlyRanking,
  getSemesterRanking,
  getYearlyRanking,
  getLast7DaysRanking,
  getLast30DaysRanking,
  getCustomRangeRanking
} from '@/api/user'

const router = useRouter()
const themeStore = useThemeStore()

const todayAttendance = ref(0)
const dailyAvgAttendance = ref(0)
const attendanceRate = ref(0)
const monthlyAttendanceCount = ref(0)
const workshopMembersCount = ref(0)
const workshopMembers = ref(0)
const levelStats = ref({
  admin: 0,
  core: 0,
  normal: 0
})
const clubMembers = ref(0)

const selectedTimeRange = ref('week')
const selectedTopN = ref(15)
const customDateRange = ref([])
const rankingData = ref([])
const attendanceChart = ref(null)
const gradeChart = ref(null)
const majorChart = ref(null)
let chartInstance = null
let gradeChartInstance = null
let majorChartInstance = null

const goBack = () => {
  router.go(-1)
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const saveUserPreferences = () => {
  const preferences = {
    selectedTimeRange: selectedTimeRange.value,
    selectedTopN: selectedTopN.value,
    customDateRange: customDateRange.value
  }
  localStorage.setItem('dashboardPreferences', JSON.stringify(preferences))
}

const loadUserPreferences = () => {
  const saved = localStorage.getItem('dashboardPreferences')
  if (saved) {
    try {
      const preferences = JSON.parse(saved)
      selectedTimeRange.value = preferences.selectedTimeRange || 'week'
      selectedTopN.value = preferences.selectedTopN || 15
      
      if (preferences.customDateRange && Array.isArray(preferences.customDateRange)) {
        customDateRange.value = preferences.customDateRange.map(date => {
          if (date instanceof Date) {
            return date
          } else if (typeof date === 'string') {
            return new Date(date)
          } else {
            return null
          }
        }).filter(date => date && !isNaN(date.getTime()))
      } else {
        customDateRange.value = []
      }
    } catch (error) {
      selectedTimeRange.value = 'week'
      selectedTopN.value = 15
      customDateRange.value = []
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
      await nextTick()
      initGradeChart(gradeData.data)
    }

    if (majorData.code === 200 && majorData.data) {
      await nextTick()
      initMajorChart(majorData.data)
    }

    if (totalData.code === 200 && totalData.data) {
      workshopMembers.value = totalData.data.count
    }

    if (monthlyData.code === 200 && monthlyData.data) {
      const dailyAvg = calculateDailyAvgAttendance(monthlyData.data.count)
      dailyAvgAttendance.value = dailyAvg
      
      // 保存月度数据，等levelStats加载完成后再计算签到率
      monthlyAttendanceCount.value = monthlyData.data.count
    }

    if (dailyData.code === 200 && dailyData.data) {
      todayAttendance.value = dailyData.data.count
    }

    await loadLevelStats()
    
    // 重新计算社团成员数量
    calculateClubMembers()
  } catch (error) {
    ElMessage.error('数据加载失败: ' + (error.message || '未知错误'))
  }
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
  clubMembers.value = workshopMembers.value - levelStats.value.admin - levelStats.value.core - levelStats.value.normal
  // 坊内成员人数 = 管理员 + 核心成员 + 普通成员
  workshopMembersCount.value = levelStats.value.admin + levelStats.value.core + levelStats.value.normal
}

const calculateAttendanceRate = (monthlyCount) => {
  // 坊内成员总人数 = 管理员 + 核心成员 + 普通成员
  const workshopMembersCount = levelStats.value.admin + levelStats.value.core + levelStats.value.normal
  
  if (workshopMembersCount === 0) {
    return 0
  }
  
  return parseFloat(((monthlyCount / workshopMembersCount) * 100).toFixed(1))
}

const loadRankingData = async () => {
  try {
    let response

    switch (selectedTimeRange.value) {
      case 'today': {
        const today = new Date().toISOString().split('T')[0]
        response = await getDailyRanking(today, selectedTopN.value)
        break
      }
      case 'week': {
        const now = new Date()
        const dayOfWeek = now.getDay()
        const monday = new Date(now)
        monday.setDate(now.getDate() - dayOfWeek + 1)
        const weekStart = monday.toISOString().split('T')[0]
        response = await getWeeklyRanking(weekStart, selectedTopN.value)
        break
      }
      case 'month': {
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth() + 1
        response = await getMonthlyRanking(currentYear, currentMonth, selectedTopN.value)
        break
      }
      case 'quarter': {
        const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3)
        response = await getQuarterlyRanking(new Date().getFullYear(), currentQuarter, selectedTopN.value)
        break
      }
      case 'semester': {
        const currentSemester = new Date().getMonth() >= 1 && new Date().getMonth() <= 6 ? 1 : 2
        response = await getSemesterRanking(new Date().getFullYear(), currentSemester, selectedTopN.value)
        break
      }
      case 'year':
        response = await getYearlyRanking(new Date().getFullYear(), selectedTopN.value)
        break
      case 'last7days':
        response = await getLast7DaysRanking(selectedTopN.value)
        break
      case 'last30days':
        response = await getLast30DaysRanking(selectedTopN.value)
        break
      case 'custom': {
        if (customDateRange.value && customDateRange.value.length === 2) {
          try {
            const startDateObj = new Date(customDateRange.value[0])
            const endDateObj = new Date(customDateRange.value[1])
            
            if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
              ElMessage.error('日期格式不正确')
              return
            }
            
            const startDate = startDateObj.toISOString().split('T')[0]
            const endDate = endDateObj.toISOString().split('T')[0]
            response = await getCustomRangeRanking(startDate, endDate, selectedTopN.value)
          } catch (dateError) {
            ElMessage.error('日期处理失败')
            return
          }
        } else {
          ElMessage.warning('请选择自定义日期范围')
          return
        }
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
      
      rankingData.value = processedData
      saveUserPreferences()
      await nextTick()
      initAttendanceChart(processedData)
    } else {
      ElMessage.error('获取排行榜数据失败')
    }
  } catch (error) {
    ElMessage.error('排行榜数据加载失败: ' + (error.message || '未知错误'))
  }
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

const initAttendanceChart = (data) => {
  if (!attendanceChart.value) return

  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(attendanceChart.value)

  const chartData = data.map((item, index) => ({
    name: item.name,
    value: item.attendanceCount,
    itemStyle: {
      color: `hsl(${200 + index * 5}, 70%, 50%)`
    }
  }))

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.map(item => item.name),
      axisLabel: {
        rotate: 45,
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      name: '签到次数'
    },
    series: [
      {
        name: '签到次数',
        type: 'bar',
        data: chartData,
        itemStyle: {
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

const initGradeChart = (data) => {
  if (!gradeChart.value) return

  if (gradeChartInstance) {
    gradeChartInstance.dispose()
  }

  gradeChartInstance = echarts.init(gradeChart.value)

  const sortedData = [...data].sort((a, b) => a.grade - b.grade)
  const isDark = themeStore.isDarkMode

  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim()

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      textStyle: {
        color: textColor
      }
    },
    legend: {
      orient: 'horizontal',
      bottom: '5%',
      data: sortedData.map(item => `${item.grade}年级`),
      textStyle: {
        color: textColor,
        fontSize: 10
      }
    },
    series: [
      {
        name: '年级分布',
        type: 'pie',
        radius: ['30%', '60%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center',
          color: textColor
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold',
            color: textColor
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
  
  setTimeout(() => {
    if (gradeChartInstance) {
      gradeChartInstance.resize()
    }
  }, 100)
}

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

const initMajorChart = (data) => {
  if (!majorChart.value) return

  if (majorChartInstance) {
    majorChartInstance.dispose()
  }

  majorChartInstance = echarts.init(majorChart.value)

  const sortedData = [...data].sort((a, b) => b.count - a.count)
  const isDark = themeStore.isDarkMode
  
  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim()
  
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
        color: textColor
      }
    },
    series: [
      {
        type: 'wordCloud',
        gridSize: 2,
        sizeRange: [12, 24],
        rotationRange: [-90, 90],
        shape: 'pentagon',
        width: '100%',
        height: '100%',
        drawOutOfBound: false,
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'normal'
        },
        emphasis: {
          focus: 'self',
          textStyle: {
            textShadowBlur: 10,
            textShadowColor: '#333'
          }
        },
        data: wordCloudData
      }
    ]
  }

  majorChartInstance.setOption(option)
  
  setTimeout(() => {
    if (majorChartInstance) {
      majorChartInstance.resize()
    }
  }, 100)
}

watch(() => themeStore.isDarkMode, () => {
  setTimeout(() => {
    loadData()
  }, 100)
})

onMounted(async () => {
  try {
    themeStore.initTheme()
    loadUserPreferences()
    await loadData()
    await loadRankingData()
    window.addEventListener('resize', handleResize)
  } catch (error) {
    ElMessage.error('页面初始化失败: ' + (error.message || '未知错误'))
  }
})

const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
  if (gradeChartInstance) {
    gradeChartInstance.resize()
  }
  if (majorChartInstance) {
    majorChartInstance.resize()
  }
}

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  if (gradeChartInstance) {
    gradeChartInstance.dispose()
  }
  if (majorChartInstance) {
    majorChartInstance.dispose()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.dashboard-page-mobile {
  min-height: 100vh;
  background: var(--bg-gradient);
  padding: 0;
  transition: background 0.3s ease;
}

.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--header-bg);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--header-border);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  color: var(--text-primary);
  font-size: 18px;
}

.logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.1);
}

.header-title {
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
}

.mobile-content {
  padding: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid var(--card-border);
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.level-stats-mobile {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.level-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.admin-level {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
}

.core-level {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
}

.normal-level {
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
}

.club-level {
  background: linear-gradient(135deg, #96ceb4 0%, #b8e6b8 100%);
}

.club-level .el-icon {
  color: #2e7d32;
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
}

html.dark .club-level .el-icon {
  color: rgba(255, 255, 255, 0.95);
}

html.dark .club-level .level-label {
  color: rgba(255, 255, 255, 0.9);
}

html.dark .club-level .level-value {
  color: #ffffff;
}

.level-item .el-icon {
  font-size: 24px;
  margin-right: 16px;
}

.level-info {
  display: flex;
  flex-direction: column;
}

.level-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 4px;
}

.level-value {
  font-size: 18px;
  font-weight: 700;
}

.ranking-section {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid var(--card-border);
}

.section-header {
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0 0 12px 0;
  color: var(--text-primary);
  font-size: 18px;
}

.controls {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chart-container {
  height: 300px;
}

.chart {
  width: 100%;
  height: 250px;
}

.charts-section {
  margin-bottom: 20px;
}

.chart-item {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid var(--card-border);
}

.chart-item h3 {
  margin: 0 0 12px 0;
  color: var(--text-primary);
  font-size: 16px;
  text-align: center;
}

.mechanism-section {
  margin-bottom: 20px;
}

.mechanism-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid var(--card-border);
}

.mechanism-card h3 {
  margin: 0 0 12px 0;
  color: var(--text-primary);
  font-size: 16px;
  text-align: center;
}

.mechanism-content p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
  text-align: justify;
}

:root {
  --bg-gradient: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  --card-bg: rgba(255, 255, 255, 0.9);
  --card-border: rgba(0, 0, 0, 0.1);
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --header-bg: rgba(255, 255, 255, 0.9);
  --header-border: rgba(0, 0, 0, 0.1);
}

.dark {
  --bg-gradient: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  --card-bg: rgba(255, 255, 255, 0.05);
  --card-border: rgba(255, 255, 255, 0.1);
  --text-primary: #e0e0e0;
  --text-secondary: rgba(224, 224, 224, 0.7);
  --header-bg: rgba(255, 255, 255, 0.05);
  --header-border: rgba(255, 255, 255, 0.1);
}
</style>

