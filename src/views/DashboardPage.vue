<template>
  <div class="dashboard-container">
    <div class="header">
      <div class="header-left">
        <el-button @click="goBack" class="back-btn" type="primary" :icon="ArrowLeft" circle></el-button>
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊" class="logo">
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
          <div v-if="isLoading" class="loading-overlay">
            <div class="loading-spinner"></div>
          </div>
          <h2>打卡</h2>
          <p class="subtitle">总打卡情况</p>
          
          <div class="top-students">
            <div ref="attendanceChart" class="attendance-chart"></div>
          </div>

          <div class="summary-stats">
            <div class="stats-row">
              <div class="total-count">
                <span class="label">
                  <el-icon class="stat-icon"><Calendar /></el-icon>
                  本月签到总人数
                </span>
                <span class="value">{{ monthlyCount }}人</span>
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
          <div v-if="isLoading" class="loading-overlay">
            <div class="loading-spinner"></div>
          </div>
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

          <div class="summary-stats">
            <div class="stats-row">
              <div class="total-count">
                <span class="label">
                  <el-icon class="stat-icon"><User /></el-icon>
                  现有成员人数
                </span>
                <span class="value">{{ totalStudents }}人</span>
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
      <!-- 网站入口二维码 -->
      <div class="website-qr-section">
        <img src="@/assets/WangZhanRuKouErWeiMa.png" alt="网站入口二维码" class="website-qr-code">
        <div class="website-qr-text">AI坊学生管理系统入口</div>
      </div>
      
      <!-- 公众号二维码 -->
      <div class="wechat-qr-section">
        <img src="@/assets/ErWeiMa.png" alt="公众号二维码" class="qr-code">
        <div class="qr-text">扫码了解更多</div>
      </div>
      
      <img src="@/assets/phone.png" alt="手机展示" class="phone-image">
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Calendar, Clock, User } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import 'echarts-wordcloud'
import { 
  getGradeStatistics, 
  getMajorStatistics, 
  getTotalStudentCount, 
  getTopStudents, 
  getMonthlyAttendanceCount, 
  getDailyAttendanceCount 
} from '@/api/user'

const gradeChart = ref(null)
const majorChart = ref(null)
const attendanceChart = ref(null)
const progressWidth = ref(0)
const progressInterval = ref(null)

const topStudents = ref([])
const totalStudents = ref(0)
const todayCount = ref(0)
const monthlyCount = ref(0)
const isLoading = ref(false)

let gradeChartInstance = null
let majorChartInstance = null
let attendanceChartInstance = null

const router = useRouter()

const goBack = () => {
  router.push('/navigation')
}

const loadData = async (isInitialLoad = false) => {
  if (isInitialLoad) {
    isLoading.value = true
  }
  
  try {
    const [
      gradeData,
      majorData,
      totalData,
      topData,
      monthlyData,
      dailyData
    ] = await Promise.all([
      getGradeStatistics(),
      getMajorStatistics(),
      getTotalStudentCount(),
      getTopStudents(),
      getMonthlyAttendanceCount(),
      getDailyAttendanceCount()
    ])

    if (gradeData.code === 200) {
      initGradeChart(gradeData.data)
    }

    if (majorData.code === 200) {
      initMajorChart(majorData.data)
    }

    if (totalData.code === 200) {
      animateNumber(totalStudents, totalData.data.count)
    }

    if (topData.code === 200) {
      topStudents.value = topData.data.slice(0, 5)
      initAttendanceChart(topData.data.slice(0, 5))
    }

    if (monthlyData.code === 200) {
      animateNumber(monthlyCount, monthlyData.data.count)
    }

    if (dailyData.code === 200) {
      animateNumber(todayCount, dailyData.data.count)
    }
  } catch (error) {
    ElMessage.error('数据加载失败：' + error.message)
  } finally {
    if (isInitialLoad) {
      setTimeout(() => {
        isLoading.value = false
      }, 500)
    }
  }
}

const animateNumber = (ref, targetValue) => {
  const startValue = ref.value
  const duration = 1000
  const startTime = Date.now()
  
  const updateValue = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    const currentValue = Math.round(startValue + (targetValue - startValue) * easeOutQuart)
    
    ref.value = currentValue
    
    if (progress < 1) {
      requestAnimationFrame(updateValue)
    } else {
      ref.value = targetValue
    }
  }
  
  requestAnimationFrame(updateValue)
}

const initGradeChart = (data) => {
  if (!gradeChart.value) return
  
  // 如果图表实例已存在，先销毁
  if (gradeChartInstance) {
    gradeChartInstance.dispose()
  }
  
  gradeChartInstance = echarts.init(gradeChart.value)
  
  // 按年级排序：1年级、2年级、3年级...
  const sortedData = [...data].sort((a, b) => a.grade - b.grade)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: sortedData.map(item => `${item.grade}年级`)
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
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
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
  
  // 如果图表实例已存在，先销毁
  if (majorChartInstance) {
    majorChartInstance.dispose()
  }
  
  majorChartInstance = echarts.init(majorChart.value)
  
  // 准备词云数据，人数越多词越大，按人数排序确保稳定性
  const sortedData = [...data].sort((a, b) => b.count - a.count)
  const wordCloudData = sortedData.map((item, index) => ({
    name: item.major,
    value: item.count,
    // 为每个专业分配固定的颜色，避免随机性
    textStyle: {
      color: getStableColor(index)
    }
  }))
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}人'
    },
    series: [
      {
        type: 'wordCloud',
        gridSize: 1, // 减小间距，让布局更紧凑
        sizeRange: [16, 50], // 适中的字体大小范围
        rotationRange: [0, 0], // 所有文字都横向展示，不旋转
        rotationStep: 0, // 不旋转
        shape: 'circle', // 圆形布局更稳定
        width: '100%',
        height: '100%',
        left: 'center',
        top: 'center',
        right: null,
        bottom: null,
        // 稳定性配置
        layoutAnimation: false, // 禁用布局动画
        shrinkToFit: true, // 自动缩放以适应容器
        drawOutOfBound: false, // 不绘制超出边界的文字
        // 固定随机种子，确保布局稳定
        random: function() {
          return 0.5; // 固定随机值，确保布局稳定
        },
        textStyle: {
          fontFamily: 'Microsoft YaHei, sans-serif',
          fontWeight: 'bold',
          color: function(params) {
            // 根据数据索引返回固定颜色
            return getStableColor(params.dataIndex)
          }
        },
        emphasis: {
          textStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
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

const initAttendanceChart = (data) => {
  if (!attendanceChart.value) return
  
  // 如果图表实例已存在，先销毁
  if (attendanceChartInstance) {
    attendanceChartInstance.dispose()
  }
  
  attendanceChartInstance = echarts.init(attendanceChart.value)
  
  const sortedData = [...data].sort((a, b) => a.attendanceCount - b.attendanceCount)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: '{b}: {c}次'
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}次'
      }
    },
    yAxis: {
      type: 'category',
      data: sortedData.map(item => item.name),
      axisLabel: {
        interval: 0,
        formatter: function(value) {
          return value.length > 4 ? value.substring(0, 4) + '...' : value
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
            // 打卡次数越多，颜色越亮（绿色系从深到浅）
            const colors = ['#a5d6a7', '#81c784', '#66bb6a', '#45a049', '#4CAF50']
            return colors[params.dataIndex % colors.length]
          },
          borderRadius: [0, 4, 4, 0]
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
      // 只刷新数据，不显示加载动画
      loadData(false)
    }
  }, 100)
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

onMounted(async () => {
  await nextTick()
  await loadData(true) // 初始加载时显示加载动画
  startProgress()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (progressInterval.value) {
    clearInterval(progressInterval.value)
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
  background: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #2c3e50;
  position: relative;
  overflow-x: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 40px;
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-btn {
  width: 40px;
  height: 40px;
  background: #667eea;
  border: none;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.logo {
  width: 60px;
  height: 60px;
}

.title-section h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.title-section p {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
}

.slogan-img {
  height: 80px;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
  padding: 40px 240px 40px 40px;
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
}

.punch-card h2, .overview-card h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.subtitle {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0 0 30px 0;
}

.top-students {
  margin-bottom: 30px;
  flex: 1;
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
}

.details {
  font-size: 14px;
  color: #7f8c8d;
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
}

.chart {
  width: 100%;
  height: 300px;
}

.attendance-chart {
  width: 100%;
  height: 300px;
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
}

.website-qr-text {
  color: #667eea;
  font-weight: 700;
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
}

.system-subtitle {
  font-size: 14px;
  color: #7f8c8d;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #667eea;
  padding: 15px 40px;
  z-index: 1000;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 10px;
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
</style>

