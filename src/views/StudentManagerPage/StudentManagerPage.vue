<template>
  <div class="student-manager-container">
    <div class="header">
      <el-button @click="goBack" class="back-btn">
        <el-icon><ArrowLeft /></el-icon>
        返回导航
      </el-button>
      <div class="header-content">
        <img 
          ref="logoRef"
          src="@/assets/AiWorkShop_icon.png" 
          alt="AI坊学生管理系统" 
          class="logo" 
          @click="toggleTheme"
          title="切换主题模式"
        >
        <h1>学生管理</h1>
        <div class="admin-info">
          <div class="admin-details">
            <span class="admin-name">{{ userStore.userInfo?.name || '管理员' }}</span>
            <div class="admin-level">
              <el-icon class="level-icon"><Star /></el-icon>
              <span class="level-text">管理员</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="main-content">
      <div class="search-section">
        <el-input
          v-model="searchQuery"
          placeholder="搜索学生姓名、学号或专业..."
          class="search-input"
          clearable
          @input="handleSearch"
          @clear="handleClearSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button 
          type="primary" 
          @click="handleSearch"
          class="search-btn"
          :icon="Search"
        >
          搜索
        </el-button>
      </div>
      
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon size="24"><User /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ managedStudents.length }}</div>
            <div class="stat-label">管理学生总数</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon size="24"><Calendar /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ totalAttendanceCount }}</div>
            <div class="stat-label">总签到次数</div>
          </div>
        </div>
      </div>
      
      <div class="students-section">
        <div class="section-header">
          <h2>管理的学生列表</h2>
          <div class="header-actions">
            <el-button 
              type="info" 
              @click="sortByAttendance" 
              :class="{ 'active': sortOrder === 'attendance' }"
            >
              <el-icon><Sort /></el-icon>
              按打卡次数排序
            </el-button>
            <el-button 
              type="primary" 
              @click="refreshStudents" 
              :loading="loading"
            >
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </div>
        
        <div class="students-list" v-if="!loading && filteredStudents.length > 0">
          <div class="student-card" v-for="student in filteredStudents" :key="student.studentId">
            <div class="student-avatar">
              <el-icon size="32"><User /></el-icon>
            </div>
            <div class="student-info">
              <div class="student-name">{{ student.name }}</div>
              <div class="student-details">
                <div class="detail-item">
                  <span class="label">学号：</span>
                  <span class="value">{{ student.studentId }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">年级：</span>
                  <span class="value">{{ student.grade }}年级</span>
                </div>
                <div class="detail-item">
                  <span class="label">专业：</span>
                  <span class="value">{{ student.major }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">班级：</span>
                  <span class="value">{{ student.classNum }}班</span>
                </div>
                <div class="detail-item">
                  <span class="label">性别：</span>
                  <span class="value">{{ student.gender }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">手机：</span>
                  <span class="value">{{ student.phoneNumber }}</span>
                </div>
              </div>
            </div>
            <div class="student-actions">
              <div class="attendance-info">
                <div class="attendance-count">
                  <el-icon class="attendance-icon"><Calendar /></el-icon>
                  <span class="count-text">{{ getStudentAttendanceCountFromCache(student.studentId) }}次</span>
                </div>
                <div class="action-buttons">
                  <el-button 
                    type="success" 
                    size="small" 
                    @click="openAttendanceRecordsDialog(student)"
                    class="records-btn"
                  >
                    <el-icon><Calendar /></el-icon>
                    考勤记录
                  </el-button>
                  <el-button 
                    type="warning" 
                    size="small" 
                    @click="openMakeupDialog(student)"
                    class="makeup-btn"
                  >
                    <el-icon><Clock /></el-icon>
                    补卡
                  </el-button>
                  <el-button 
                    type="info" 
                    size="small" 
                    @click="openHeatmapDialog(student)"
                    class="heatmap-btn"
                  >
                    <el-icon><Star /></el-icon>
                    热力图
                  </el-button>
                  <el-button 
                    type="primary" 
                    size="small" 
                    @click="openTrendChartDialog(student)"
                    class="trend-btn"
                  >
                    <el-icon><TrendCharts /></el-icon>
                    趋势图
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="empty-state" v-if="!loading && managedStudents.length === 0">
          <el-icon size="64" class="empty-icon"><User /></el-icon>
          <h3>暂无管理的学生</h3>
          <p>您当前没有管理任何学生</p>
        </div>
        
        <div class="no-search-results" v-if="!loading && managedStudents.length > 0 && filteredStudents.length === 0 && searchQuery">
          <el-icon size="64" class="empty-icon"><Search /></el-icon>
          <h3>未找到匹配的学生</h3>
          <p>请尝试其他关键词或清空搜索条件</p>
        </div>
        
        <div class="loading-state" v-if="loading">
          <el-icon size="32" class="loading-icon"><Loading /></el-icon>
          <p>加载中...</p>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="makeupDialogVisible"
      :title="null"
      width="90%"
      :close-on-click-modal="false"
      class="makeup-dialog"
      :show-close="false"
      v-if="makeupDialogVisible"
      :modal="true"
      :append-to-body="true"
      :destroy-on-close="true"
      :transition="false"
    >
      <div class="makeup-header">
        <div class="header-icon">
          <el-icon size="28"><Clock /></el-icon>
        </div>
        <div class="header-content">
          <h3>学生补卡</h3>
          <p>为指定学生进行补卡操作</p>
        </div>
      </div>
      
      <div class="makeup-content">
        <div class="student-info-card">
          <div class="student-avatar">
            <el-icon size="36"><User /></el-icon>
          </div>
          <div class="student-details">
            <div class="student-name">{{ makeupSelectedStudent?.name }}</div>
            <div class="student-id">{{ makeupSelectedStudent?.studentId }}</div>
            <div class="student-grade">{{ makeupSelectedStudent?.grade }}年级 · {{ makeupSelectedStudent?.major }}</div>
          </div>
        </div>
        
        <div class="form-section">
          <div class="form-header">
            <el-icon class="form-icon"><Calendar /></el-icon>
            <span class="form-title">选择补卡时间</span>
          </div>
          <div class="form-content">
            <el-date-picker
              v-model="makeupForm.attendanceTime"
              type="datetime"
              placeholder="请选择补卡时间"
              format="YYYY年MM月DD日 HH:mm"
              value-format="YYYY-MM-DDTHH:mm:ss"
              class="datetime-picker"
              :shortcuts="timeShortcuts"
            />
            <div class="form-tip">
              <el-icon><InfoFilled /></el-icon>
              <span>补卡时间不受签到时间段限制</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="makeup-footer">
        <el-button 
          @click="closeMakeupDialog" 
          class="cancel-btn"
          size="large"
        >
          取消
        </el-button>
        <el-button 
          type="primary" 
          @click="submitMakeup" 
          :loading="makeupLoading"
          class="submit-btn"
          size="large"
        >
          <el-icon v-if="!makeupLoading"><Check /></el-icon>
          {{ makeupLoading ? '处理中...' : '确认补卡' }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-model="attendanceRecordsDialogVisible"
      :title="`${selectedStudent?.name} 的考勤记录`"
      width="95%"
      :close-on-click-modal="false"
      class="attendance-records-dialog"
      v-if="attendanceRecordsDialogVisible"
      :modal="true"
      :append-to-body="true"
      :destroy-on-close="true"
      :transition="false"
    >
      <div class="attendance-records-container">
        <div class="records-header">
          <div class="student-info">
            <div class="student-avatar-large">
              {{ selectedStudent?.name?.charAt(0) }}
            </div>
            <div class="student-details">
              <h3>{{ selectedStudent?.name }}</h3>
              <p>学号：{{ selectedStudent?.studentId }}</p>
              <p>专业：{{ selectedStudent?.major }} | 年级：{{ selectedStudent?.grade }}年级</p>
            </div>
          </div>
          <div class="attendance-summary">
            <div class="summary-item">
              <span class="summary-label">总签到次数</span>
              <span class="summary-value">{{ studentAttendanceRecords.length }}</span>
            </div>
          </div>
        </div>
        
        <div v-if="studentAttendanceRecords.length === 0" class="no-records">
          <el-icon class="no-records-icon"><Calendar /></el-icon>
          <p>暂无考勤记录</p>
        </div>
        <div v-else class="calendar-container">
          <el-calendar v-model="calendarValue" class="attendance-calendar">
            <template #header="{ date }">
              <div class="calendar-header">
                <div class="header-title">{{ formatCalendarTitle(date) }}</div>
                <div class="header-actions">
                  <el-button size="small" @click="prevMonth">上个月</el-button>
                  <el-button size="small" @click="goToday">今天</el-button>
                  <el-button size="small" @click="nextMonth">下个月</el-button>
                </div>
              </div>
            </template>
            <template #date-cell="{ data }">
              <div class="calendar-cell-admin" @click="showDateDetails(data.day, $event)">
                <div class="cell-date-admin">{{ data.day.split('-')[2] }}</div>
                <div class="cell-status-admin">
                  <div class="time-slot-status-admin">
                    <div class="time-slot-admin morning" :class="{ 'signed': isTimeSlotSigned(data.day, 'morning') }">
                      <span class="time-label-admin">早</span>
                    </div>
                    <div class="time-slot-admin afternoon" :class="{ 'signed': isTimeSlotSigned(data.day, 'afternoon') }">
                      <span class="time-label-admin">午</span>
                    </div>
                    <div class="time-slot-admin evening" :class="{ 'signed': isTimeSlotSigned(data.day, 'evening') }">
                      <span class="time-label-admin">晚</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-calendar>
          <div class="calendar-legend">
            <div class="legend-item">
              <div class="legend-dot morning"></div>
              <span>早上 (8:00-11:00)</span>
            </div>
            <div class="legend-item">
              <div class="legend-dot afternoon"></div>
              <span>下午 (14:00-17:00)</span>
            </div>
            <div class="legend-item">
              <div class="legend-dot evening"></div>
              <span>晚上 (19:00-22:00)</span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeAttendanceRecordsDialog">关闭</el-button>
        </div>
      </template>
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
              <span class="time-text-desktop">{{ formatAttendanceTime(time.attendanceDateTime) }}</span>
              <span class="time-slot-label-desktop">{{ getTimeSlotLabel(time.attendanceDateTime) }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-if="heatmapDialogVisible"
      v-model="heatmapDialogVisible"
      :title="`${selectedStudent?.name} 的签到热力图`"
      width="80%"
      class="heatmap-dialog"
      destroy-on-close
      :close-on-click-modal="false"
      @close="closeHeatmapDialog"
    >
      <div class="heatmap-dialog-content">
        <div v-if="attendanceRecordsLoading" class="loading-container">
          <el-icon class="loading-icon"><Loading /></el-icon>
          <p>加载中...</p>
        </div>
        <div v-else-if="studentAttendanceRecords.length === 0" class="no-records">
          <el-icon class="no-records-icon"><Calendar /></el-icon>
          <p>暂无考勤记录</p>
        </div>
        <div v-else class="chart-container">
          <div class="chart-item-admin">
            <div class="chart-title-admin">签到热力图</div>
            <div ref="heatmapDialogChart" class="chart-content-admin"></div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeHeatmapDialog">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-if="trendChartDialogVisible"
      v-model="trendChartDialogVisible"
      :title="`${selectedStudent?.name} 的签到趋势图`"
      width="80%"
      class="trend-chart-dialog"
      destroy-on-close
      :close-on-click-modal="false"
      @close="closeTrendChartDialog"
    >
      <div class="trend-chart-dialog-content">
        <div v-if="attendanceRecordsLoading" class="loading-container">
          <el-icon class="loading-icon"><Loading /></el-icon>
          <p>加载中...</p>
        </div>
        <div v-else-if="studentAttendanceRecords.length === 0" class="no-records">
          <el-icon class="no-records-icon"><Calendar /></el-icon>
          <p>暂无考勤记录</p>
        </div>
        <div v-else class="chart-container">
          <div class="chart-item-admin">
            <div class="chart-title-admin">签到趋势图</div>
            <div ref="trendDialogChart" class="chart-content-admin"></div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeTrendChartDialog">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Calendar, Star, Refresh, Loading, ArrowLeft, Clock, InfoFilled, Check, Search, Sort, TrendCharts } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { getManagedStudents, getStudentAttendanceCount, makeupAttendance, getStudentAttendanceRecords } from '@/api/admin'
import { getStudentLevel } from '@/api/user'
import * as echarts from 'echarts'

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()
const managedStudents = ref([])
const loading = ref(false)
const searchQuery = ref('')
const filteredStudents = ref([])
const sortOrder = ref('default')

const heatmapChart = ref(null)
const lineChart = ref(null)
const heatmapInstance = ref(null)
const lineInstance = ref(null)
const heatmapDialogChart = ref(null)
const trendDialogChart = ref(null)

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    if (sortOrder.value === 'attendance') {
      filteredStudents.value = [...managedStudents.value].sort((a, b) => {
        const countA = getStudentAttendanceCountFromCache(a.studentId)
        const countB = getStudentAttendanceCountFromCache(b.studentId)
        return countB - countA
      })
    } else {
      filteredStudents.value = managedStudents.value
    }
    return
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  let filtered = managedStudents.value.filter(student => 
    student.name.toLowerCase().includes(query) ||
    student.studentId.toString().includes(query) ||
    student.major.toLowerCase().includes(query) ||
    student.college.toLowerCase().includes(query)
  )
  
  if (sortOrder.value === 'attendance') {
    filtered = filtered.sort((a, b) => {
      const countA = getStudentAttendanceCountFromCache(a.studentId)
      const countB = getStudentAttendanceCountFromCache(b.studentId)
      return countB - countA
    })
  }
  
  filteredStudents.value = filtered
}

const handleClearSearch = () => {
  searchQuery.value = ''
  if (sortOrder.value === 'attendance') {
    filteredStudents.value = [...managedStudents.value].sort((a, b) => {
      const countA = getStudentAttendanceCountFromCache(a.studentId)
      const countB = getStudentAttendanceCountFromCache(b.studentId)
      return countB - countA
    })
  } else {
    filteredStudents.value = managedStudents.value
  }
}

const sortByAttendance = () => {
  if (sortOrder.value === 'attendance') {
    sortOrder.value = 'default'
    filteredStudents.value = [...managedStudents.value]
  } else {
    sortOrder.value = 'attendance'
    filteredStudents.value = [...managedStudents.value].sort((a, b) => {
      const countA = getStudentAttendanceCountFromCache(a.studentId)
      const countB = getStudentAttendanceCountFromCache(b.studentId)
      return countB - countA
    })
  }
}
const attendanceCounts = ref({})
const makeupDialogVisible = ref(false)
const selectedStudent = ref(null)
const makeupSelectedStudent = ref(null)
const makeupForm = ref({
  attendanceTime: ''
})
const makeupLoading = ref(false)
const attendanceRecordsDialogVisible = ref(false)
const studentAttendanceRecords = ref([])
const calendarValue = ref(new Date())
const attendanceRecordsLoading = ref(false)
const showDateDetailsDialog = ref(false)
const selectedDate = ref('')
const heatmapDialogVisible = ref(false)
const trendChartDialogVisible = ref(false)

const timeShortcuts = [
  {
    text: '今天上午',
    value: () => {
      const today = new Date()
      today.setHours(9, 0, 0, 0)
      return today
    }
  },
  {
    text: '今天下午',
    value: () => {
      const today = new Date()
      today.setHours(15, 0, 0, 0)
      return today
    }
  },
  {
    text: '今天晚上',
    value: () => {
      const today = new Date()
      today.setHours(20, 0, 0, 0)
      return today
    }
  },
  {
    text: '昨天上午',
    value: () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(9, 0, 0, 0)
      return yesterday
    }
  },
  {
    text: '昨天下午',
    value: () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(15, 0, 0, 0)
      return yesterday
    }
  },
  {
    text: '昨天晚上',
    value: () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(20, 0, 0, 0)
      return yesterday
    }
  }
]

const totalAttendanceCount = computed(() => {
  return Object.values(attendanceCounts.value).reduce((sum, count) => sum + count, 0)
})

const getStudentAttendanceCountFromCache = (studentId) => {
  return attendanceCounts.value[studentId] || 0
}

const loadManagedStudents = async () => {
  if (!userStore.userInfo?.studentId) {
    ElMessage.error('用户信息获取失败')
    return
  }
  
  loading.value = true
  try {
    const response = await getManagedStudents(userStore.userInfo.studentId)
    if (response.code === 200) {
      managedStudents.value = response.data || []
      if (sortOrder.value === 'attendance') {
        filteredStudents.value = [...managedStudents.value].sort((a, b) => {
          const countA = getStudentAttendanceCountFromCache(a.studentId)
          const countB = getStudentAttendanceCountFromCache(b.studentId)
          return countB - countA
        })
      } else {
        filteredStudents.value = managedStudents.value
      }
      await loadAttendanceCounts()
    } else {
      ElMessage.error(response.message || '获取管理学生信息失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '获取管理学生信息失败')
  } finally {
    loading.value = false
  }
}

const loadAttendanceCounts = async () => {
  const promises = managedStudents.value.map(async (student) => {
    try {
      const response = await getStudentAttendanceCount(student.studentId)
      if (response.code === 200) {
        attendanceCounts.value[student.studentId] = response.data.count || 0
      }
    } catch (error) {
      attendanceCounts.value[student.studentId] = 0
    }
  })
  
  await Promise.all(promises)
}

const refreshStudents = () => {
  loadManagedStudents()
}

const goBack = () => {
  router.push('/navigation')
}

const openMakeupDialog = (student) => {
  makeupSelectedStudent.value = student
  makeupForm.value.attendanceTime = ''
  document.body.style.overflow = 'hidden'
  makeupDialogVisible.value = true
}

const closeMakeupDialog = () => {
  makeupDialogVisible.value = false
  document.body.style.overflow = ''
  makeupSelectedStudent.value = null
  makeupForm.value.attendanceTime = ''
}

const submitMakeup = async () => {
  if (!makeupForm.value.attendanceTime) {
    ElMessage.warning('请选择补卡时间')
    return
  }
  
  if (!userStore.token) {
    ElMessage.error('请先登录')
    router.push('/login')
    return
  }
  
  makeupLoading.value = true
  try {
    const response = await makeupAttendance(
      userStore.token,
      makeupSelectedStudent.value.studentId,
      makeupForm.value.attendanceTime
    )
    
    if (response.code === 200) {
      ElMessage.success('补卡成功')
      closeMakeupDialog()
      await loadAttendanceCounts()
    } else {
      ElMessage.error(response.message || '补卡失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '补卡失败')
  } finally {
    makeupLoading.value = false
  }
}

const openAttendanceRecordsDialog = async (student) => {
  selectedStudent.value = student
  
  try {
    attendanceRecordsLoading.value = true
    const response = await getStudentAttendanceRecords(student.studentId)
    if (response.code === 200) {
      studentAttendanceRecords.value = response.data || []
      attendanceRecordsDialogVisible.value = true
      document.body.style.overflow = 'hidden'
    } else {
      ElMessage.error(response.message || '获取考勤记录失败')
    }
  } catch (error) {
    ElMessage.error('获取考勤记录失败：' + error.message)
  } finally {
    attendanceRecordsLoading.value = false
  }
}

const closeAttendanceRecordsDialog = () => {
  attendanceRecordsDialogVisible.value = false
  document.body.style.overflow = ''
  selectedStudent.value = null
  studentAttendanceRecords.value = []
}

const openHeatmapDialog = async (student) => {
  selectedStudent.value = student
  
  try {
    attendanceRecordsLoading.value = true
    const response = await getStudentAttendanceRecords(student.studentId)
    if (response.code === 200) {
      studentAttendanceRecords.value = response.data || []
      heatmapDialogVisible.value = true
      document.body.style.overflow = 'hidden'
      
      await nextTick()
      setTimeout(() => {
        initDialogHeatmapChart()
      }, 100)
    } else {
      ElMessage.error(response.message || '获取考勤记录失败')
    }
  } catch (error) {
    ElMessage.error('获取考勤记录失败：' + error.message)
  } finally {
    attendanceRecordsLoading.value = false
  }
}

const closeHeatmapDialog = () => {
  heatmapDialogVisible.value = false
  document.body.style.overflow = ''
  selectedStudent.value = null
  studentAttendanceRecords.value = []
  
  if (heatmapInstance.value) {
    heatmapInstance.value.dispose()
    heatmapInstance.value = null
  }
}

const openTrendChartDialog = async (student) => {
  selectedStudent.value = student
  
  try {
    attendanceRecordsLoading.value = true
    const response = await getStudentAttendanceRecords(student.studentId)
    if (response.code === 200) {
      studentAttendanceRecords.value = response.data || []
      trendChartDialogVisible.value = true
      document.body.style.overflow = 'hidden'
      
      await nextTick()
      setTimeout(() => {
        initDialogLineChart()
      }, 100)
    } else {
      ElMessage.error(response.message || '获取考勤记录失败')
    }
  } catch (error) {
    ElMessage.error('获取考勤记录失败：' + error.message)
  } finally {
    attendanceRecordsLoading.value = false
  }
}

const closeTrendChartDialog = () => {
  trendChartDialogVisible.value = false
  document.body.style.overflow = ''
  selectedStudent.value = null
  studentAttendanceRecords.value = []
  
  if (lineInstance.value) {
    lineInstance.value.dispose()
    lineInstance.value = null
  }
}

const formatAttendanceTime = (timeString) => {
  if (!timeString) return ''
  const date = new Date(timeString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}


const formatCalendarTitle = (date) => {
  if (!date) return '2025年9月'
  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) return '2025年9月'
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() + 1
  return `${year}年${month}月`
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

const isTimeSlotSigned = (dateString, timeSlot) => {
  if (!studentAttendanceRecords.value || studentAttendanceRecords.value.length === 0) return false
  
  const targetDate = new Date(dateString)
  const year = targetDate.getFullYear()
  const month = String(targetDate.getMonth() + 1).padStart(2, '0')
  const day = String(targetDate.getDate()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`
  
  return studentAttendanceRecords.value.some(record => {
    const recordDate = new Date(record.attendanceDateTime)
    const recordYear = recordDate.getFullYear()
    const recordMonth = String(recordDate.getMonth() + 1).padStart(2, '0')
    const recordDay = String(recordDate.getDate()).padStart(2, '0')
    const recordDateStr = `${recordYear}-${recordMonth}-${recordDay}`
    
    if (recordDateStr !== dateStr) return false
    
    const hour = recordDate.getHours()
    if (timeSlot === 'morning' && hour >= 8 && hour < 11) return true
    if (timeSlot === 'afternoon' && hour >= 14 && hour < 17) return true
    if (timeSlot === 'evening' && hour >= 19 && hour < 22) return true
    
    return false
  })
}

const showDateDetails = (dateString, event) => {
  event.stopPropagation()
  selectedDate.value = dateString
  showDateDetailsDialog.value = true
}

const handleDateDetailsClose = () => {
  showDateDetailsDialog.value = false
  selectedDate.value = ''
}

const getDateAttendanceTimes = (dateString) => {
  if (!studentAttendanceRecords.value || studentAttendanceRecords.value.length === 0) return []
  
  const targetDate = new Date(dateString)
  const year = targetDate.getFullYear()
  const month = String(targetDate.getMonth() + 1).padStart(2, '0')
  const day = String(targetDate.getDate()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`
  
  return studentAttendanceRecords.value.filter(record => {
    const recordDate = new Date(record.attendanceDateTime)
    const recordYear = recordDate.getFullYear()
    const recordMonth = String(recordDate.getMonth() + 1).padStart(2, '0')
    const recordDay = String(recordDate.getDate()).padStart(2, '0')
    const recordDateStr = `${recordYear}-${recordMonth}-${recordDay}`
    return recordDateStr === dateStr
  })
}

const formatSelectedDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

const getTimeSlotLabel = (timeString) => {
  if (!timeString) return ''
  const date = new Date(timeString)
  const hour = date.getHours()
  
  if (hour >= 8 && hour < 11) return '上午'
  if (hour >= 14 && hour < 17) return '下午'
  if (hour >= 19 && hour < 22) return '晚上'
  return '其他时间'
}

onMounted(async () => {
  if (!userStore.userInfo?.studentId) {
    ElMessage.error('请先登录')
    router.push('/login')
    return
  }
  
  try {
    const levelResponse = await getStudentLevel(userStore.userInfo.studentId)
    userStore.setStudentLevel(levelResponse.data)
    
    if (levelResponse.data.levelCode !== 3) {
      ElMessage.error('您没有管理员权限')
      router.push('/navigation')
      return
    }
    
    loadManagedStudents()
    
    await nextTick()
    initCharts()
  } catch (error) {
    ElMessage.error('获取用户权限失败')
    router.push('/navigation')
  }
  
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      attendanceRecordsDialogVisible.value = false
      makeupDialogVisible.value = false
      document.body.style.overflow = ''
    }
  })
})

const initCharts = () => {
  initHeatmapChart()
  initLineChart()
}

const initDialogHeatmapChart = () => {
  console.log('开始初始化热力图')
  console.log('heatmapDialogChart.value:', heatmapDialogChart.value)
  console.log('容器尺寸:', heatmapDialogChart.value?.offsetWidth, heatmapDialogChart.value?.offsetHeight)
  
  if (!heatmapDialogChart.value) {
    console.error('热力图容器不存在')
    return
  }
  
  if (heatmapInstance.value) {
    heatmapInstance.value.dispose()
  }
  
  try {
    heatmapInstance.value = echarts.init(heatmapDialogChart.value)
    console.log('ECharts实例创建成功')
  } catch (error) {
    console.error('ECharts初始化失败:', error)
    return
  }
  
  const heatmapData = generateHeatmapData()
  console.log('热力图数据:', heatmapData)
  console.log('考勤记录:', studentAttendanceRecords.value)
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
        color: themeStore.isDark ? '#ccc' : '#666',
        fontSize: 10
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
  
  try {
    heatmapInstance.value.setOption(option)
    console.log('热力图配置设置成功')
  } catch (error) {
    console.error('热力图配置设置失败:', error)
  }
}

const initDialogLineChart = () => {
  console.log('开始初始化趋势图')
  console.log('trendDialogChart.value:', trendDialogChart.value)
  console.log('容器尺寸:', trendDialogChart.value?.offsetWidth, trendDialogChart.value?.offsetHeight)
  
  if (!trendDialogChart.value) {
    console.error('趋势图容器不存在')
    return
  }
  
  if (lineInstance.value) {
    lineInstance.value.dispose()
  }
  
  try {
    lineInstance.value = echarts.init(trendDialogChart.value)
    console.log('ECharts实例创建成功')
  } catch (error) {
    console.error('ECharts初始化失败:', error)
    return
  }
  
  const lineData = generateLineData()
  console.log('趋势图数据:', lineData)
  console.log('考勤记录:', studentAttendanceRecords.value)
  
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
        const date = params[0].axisValue
        const value = params[0].value
        return `日期: ${date}<br/>累计签到: ${value}次`
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
      boundaryGap: false,
      data: lineData.dates,
      axisLabel: {
        color: themeStore.isDark ? '#ccc' : '#666',
        fontSize: 10,
        rotate: 45
      },
      axisLine: {
        lineStyle: {
          color: themeStore.isDark ? '#444' : '#ddd'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: themeStore.isDark ? '#ccc' : '#666',
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: themeStore.isDark ? '#444' : '#ddd'
        }
      },
      splitLine: {
        lineStyle: {
          color: themeStore.isDark ? '#333' : '#eee'
        }
      }
    },
    series: [{
      name: '累计签到次数',
      type: 'line',
      stack: 'Total',
      data: lineData.values,
      smooth: true,
      lineStyle: {
        color: '#50a3ba',
        width: 3
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(80, 163, 186, 0.3)'
          }, {
            offset: 1, color: 'rgba(80, 163, 186, 0.1)'
          }]
        }
      },
      itemStyle: {
        color: '#50a3ba'
      },
      emphasis: {
        focus: 'series'
      }
    }]
  }
  
  lineInstance.value.setOption(option)
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
        color: themeStore.isDark ? '#ccc' : '#666',
        fontSize: 10
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
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
        const date = params[0].axisValue
        const value = params[0].value
        return `日期: ${date}<br/>累计签到: ${value}次`
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
      boundaryGap: false,
      data: lineData.dates,
      axisLabel: {
        color: themeStore.isDark ? '#ccc' : '#666',
        fontSize: 10,
        rotate: 45
      },
      axisLine: {
        lineStyle: {
          color: themeStore.isDark ? '#444' : '#ddd'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: themeStore.isDark ? '#ccc' : '#666',
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: themeStore.isDark ? '#444' : '#ddd'
        }
      },
      splitLine: {
        lineStyle: {
          color: themeStore.isDark ? '#333' : '#eee'
        }
      }
    },
    series: [{
      name: '累计签到次数',
      type: 'line',
      stack: 'Total',
      data: lineData.values,
      smooth: true,
      lineStyle: {
        color: '#50a3ba',
        width: 3
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(80, 163, 186, 0.3)'
          }, {
            offset: 1, color: 'rgba(80, 163, 186, 0.1)'
          }]
        }
      },
      itemStyle: {
        color: '#50a3ba'
      },
      emphasis: {
        focus: 'series'
      }
    }]
  }
  
  lineInstance.value.setOption(option)
}

const generateLineData = () => {
  const dateMap = new Map()
  
  studentAttendanceRecords.value.forEach(record => {
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
      studentAttendanceRecords.value.forEach(record => {
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

watch(() => themeStore.isDark, () => {
  if (heatmapInstance.value) {
    initHeatmapChart()
  }
  if (lineInstance.value) {
    initLineChart()
  }
})

watch(() => studentAttendanceRecords.value, () => {
  if (heatmapInstance.value) {
    initHeatmapChart()
  }
  if (lineInstance.value) {
    initLineChart()
  }
})
</script>

<style scoped>
.student-manager-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--primary-gradient);
  padding: 0;
  margin: 0;
  position: relative;
  overflow: hidden;
}

.student-manager-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, var(--glass-bg) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, var(--glass-bg) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
  pointer-events: none;
  animation: backgroundFloat 20s ease-in-out infinite;
}

@keyframes backgroundFloat {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
    opacity: 0.8;
  }
  33% { 
    transform: translateY(-30px) rotate(120deg); 
    opacity: 1;
  }
  66% { 
    transform: translateY(30px) rotate(240deg); 
    opacity: 0.9;
  }
}

.header {
  padding: 24px;
  background: var(--glass-bg);
  backdrop-filter: blur(25px);
  border-radius: 0 0 32px 32px;
  box-shadow: 0 12px 40px var(--shadow-color);
  border: 1px solid var(--glass-bg);
  position: relative;
  z-index: 1;
}

.header-content {
  text-align: center;
  position: relative;
}

.logo {
  width: 70px;
  height: 70px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
  box-shadow: 0 8px 25px var(--shadow-color);
  position: relative;
  z-index: 10;
}

.logo:hover {
  transform: scale(1.1) rotate(5deg);
  filter: brightness(1.2);
  box-shadow: 0 12px 35px var(--shadow-hover);
}

h1 {
  color: var(--text-primary);
  font-size: 28px;
  margin: 0 0 20px 0;
  font-weight: 800;
  text-shadow: 0 4px 12px var(--shadow-color);
  letter-spacing: 1px;
}

.search-section {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 25px var(--shadow-color);
}

.search-input {
  flex: 1;
  max-width: 400px;
}

.search-input :deep(.el-input__wrapper) {
  background: transparent;
  backdrop-filter: none;
  border: 1px solid var(--glass-border);
  box-shadow: none;
  border-radius: 12px;
}

.search-input :deep(.el-input__inner) {
  color: var(--text-primary);
}

.search-input :deep(.el-input__inner::placeholder) {
  color: var(--text-tertiary);
}

.search-btn {
  background: var(--primary-gradient);
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  box-shadow: 0 8px 25px var(--shadow-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px var(--shadow-hover);
}

.no-search-results {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-primary);
}

.no-search-results h3 {
  margin: 20px 0 10px 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.no-search-results p {
  margin: 0;
  font-size: 16px;
  color: var(--text-secondary);
}

.admin-info {
  margin-top: 15px;
  padding: 16px 24px;
  background: var(--glass-bg);
  backdrop-filter: blur(15px);
  border-radius: 24px;
  display: inline-block;
  box-shadow: 0 8px 25px var(--shadow-color);
  border: 1px solid var(--glass-border);
  transition: all 0.3s ease;
}

.admin-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

.admin-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.admin-name {
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 700;
  text-shadow: 0 2px 8px var(--shadow-color);
}

.admin-level {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
}

.level-icon {
  font-size: 14px;
  color: var(--warning-color);
  filter: drop-shadow(0 2px 4px rgba(255, 215, 0, 0.3));
}

.level-text {
  color: var(--warning-color);
  font-size: 13px;
  font-weight: 700;
  text-shadow: 0 2px 4px var(--shadow-color);
}

.main-content {
  flex: 1;
  padding: 20px;
  position: relative;
  z-index: 1;
}

.stats-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 25px;
}

.stat-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 18px;
  box-shadow: 0 8px 32px var(--shadow-color);
  border: 1px solid var(--glass-bg);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%);
}

.stat-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 16px 48px var(--shadow-hover);
  background: var(--glass-bg);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  box-shadow: 0 8px 25px var(--shadow-color);
  border: 1px solid var(--glass-border);
  transition: all 0.3s ease;
}

.stat-card:hover .stat-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 35px var(--shadow-hover);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 6px;
  text-shadow: 0 4px 12px var(--shadow-color);
  letter-spacing: 1px;
}

.stat-label {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  text-shadow: 0 2px 8px var(--shadow-color);
}

.students-section {
  background: var(--glass-bg);
  backdrop-filter: blur(25px);
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 12px 40px var(--shadow-color);
  border: 1px solid var(--glass-bg);
  position: relative;
  overflow: hidden;
}

.students-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  font-size: 22px;
  color: var(--text-primary);
  font-weight: 800;
  text-shadow: 0 4px 12px var(--shadow-color);
  letter-spacing: 1px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.header-actions .el-button.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: #ffffff;
}

.students-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.student-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 8px 32px var(--shadow-color);
  border: 1px solid var(--glass-bg);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.student-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.6) 0%, var(--glass-bg) 100%);
}

.student-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 20px 60px var(--shadow-hover);
  background: var(--glass-bg);
}

.student-avatar {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  flex-shrink: 0;
  box-shadow: 0 8px 25px var(--shadow-color);
  border: 1px solid var(--glass-border);
  transition: all 0.3s ease;
}

.student-card:hover .student-avatar {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 35px var(--shadow-hover);
}

.student-info {
  flex: 1;
  min-width: 0;
}

.student-name {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 10px;
  text-shadow: 0 4px 12px var(--shadow-color);
  letter-spacing: 0.5px;
}

.student-details {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.detail-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  white-space: nowrap;
}

.label {
  color: var(--text-secondary);
  font-weight: 600;
  margin-right: 4px;
  text-shadow: 0 2px 8px var(--shadow-color);
}

.value {
  color: var(--text-primary);
  font-weight: 700;
  text-shadow: 0 2px 8px var(--shadow-color);
}

.student-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.student-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.attendance-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.action-buttons {
  display: flex;
  gap: 8px;
  width: 100%;
  justify-content: space-between;
}

.attendance-count {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  color: var(--text-primary);
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 25px var(--shadow-color);
  transition: all 0.3s ease;
}

.attendance-count:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 35px var(--shadow-hover);
}

.attendance-icon {
  font-size: 16px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.count-text {
  font-size: 15px;
  font-weight: 700;
  text-shadow: 0 2px 8px var(--shadow-color);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.8);
}

.empty-icon {
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 20px;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
}

.empty-state h3 {
  margin: 0 0 15px 0;
  font-size: 20px;
  color: var(--text-primary);
  font-weight: 700;
  text-shadow: 0 4px 12px var(--shadow-color);
}

.empty-state p {
  margin: 0;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 2px 8px var(--shadow-color);
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.8);
}

.loading-icon {
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
  color: var(--text-primary);
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}


.back-btn {
  position: absolute;
  top: 24px;
  left: 24px;
  width: 140px;
  height: 48px;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(15px);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  box-shadow: 0 8px 25px var(--shadow-color);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  z-index: 10;
  text-shadow: 0 2px 8px var(--shadow-color);
}

.back-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 12px 35px var(--shadow-hover);
  background: var(--glass-border);
}

.records-btn {
  width: 100%;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  box-shadow: 0 6px 20px var(--shadow-color);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 0;
  box-sizing: border-box;
  text-shadow: 0 2px 8px var(--shadow-color);
}

.records-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 12px 35px var(--shadow-hover);
}

.makeup-btn {
  width: 100%;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  margin: 0;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  box-shadow: 0 6px 20px var(--shadow-color);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-shadow: 0 2px 8px var(--shadow-color);
}

.makeup-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 12px 35px var(--shadow-hover);
}

.makeup-dialog {
  border-radius: 24px;
  overflow: hidden;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: 0 20px 60px var(--shadow-color);
}

.makeup-dialog .el-dialog__wrapper {
  transition: none !important;
}

.makeup-dialog .el-dialog {
  transition: none !important;
}

.makeup-dialog .el-overlay {
  transition: none !important;
}

.makeup-dialog .el-dialog__body {
  padding: 0;
}

.makeup-header {
  background: var(--primary-gradient);
  padding: 30px 35px;
  display: flex;
  align-items: center;
  gap: 20px;
  color: var(--text-primary);
  position: relative;
  overflow: hidden;
}

.header-icon {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  background: var(--glass-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 25px var(--shadow-color);
}

.header-content h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 800;
  text-shadow: 0 2px 8px var(--shadow-color);
  letter-spacing: 0.5px;
}

.header-content p {
  margin: 0;
  font-size: 15px;
  opacity: 0.9;
  font-weight: 500;
  text-shadow: 0 1px 4px var(--shadow-color);
}

.makeup-content {
  padding: 35px;
  background: var(--bg-primary);
}

.student-info-card {
  background: var(--glass-bg);
  border-radius: 20px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 25px;
  box-shadow: 0 8px 30px var(--shadow-color);
  border: 1px solid var(--glass-border);
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
}

.student-info-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--primary-gradient);
}

.student-info-card .student-avatar {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.student-info-card .student-details {
  flex: 1;
}

.student-info-card .student-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.student-info-card .student-id {
  font-size: 16px;
  color: var(--text-secondary);
  font-weight: 600;
  margin-bottom: 4px;
}

.student-info-card .student-grade {
  font-size: 14px;
  color: var(--text-tertiary);
  font-weight: 500;
}

.student-status {
  position: absolute;
  top: 15px;
  right: 15px;
}

.form-section {
  background: var(--glass-bg);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 30px var(--shadow-color);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(15px);
}

.form-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--border-color);
}

.form-icon {
  color: var(--primary-color);
  font-size: 20px;
}

.form-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.datetime-picker {
  width: 100%;
}

.datetime-picker .el-input__wrapper {
  border-radius: 12px;
  border: 2px solid var(--border-color);
  padding: 12px 16px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: var(--bg-primary);
}

.datetime-picker .el-input__wrapper:hover {
  border-color: var(--primary-color);
}

.datetime-picker .el-input__wrapper.is-focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--bg-tertiary);
  border-radius: 10px;
  border-left: 4px solid var(--primary-color);
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

.form-tip .el-icon {
  color: var(--primary-color);
  font-size: 16px;
}

.makeup-footer {
  background: var(--bg-secondary);
  padding: 20px 30px;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  border-top: 1px solid var(--border-color);
}

.cancel-btn {
  width: 120px;
  height: 45px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  border: 2px solid var(--border-color);
  color: var(--text-secondary);
  background: var(--glass-bg);
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  border-color: var(--primary-color);
  color: var(--text-primary);
  background: var(--bg-tertiary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.submit-btn {
  width: 140px;
  height: 45px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  background: var(--primary-gradient);
  border: none;
  color: var(--text-primary);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.submit-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .header {
    padding: 20px 16px;
  }
  
  .back-btn {
    position: static;
    width: 100%;
    height: 52px;
    font-size: 16px;
    margin-bottom: 20px;
    border-radius: 26px;
  }
  
  .logo {
    width: 60px;
    height: 60px;
    margin-bottom: 12px;
  }
  
  h1 {
    font-size: 24px;
    margin-bottom: 16px;
  }
  
  .search-section {
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
    padding: 16px;
  }
  
  .search-input {
    max-width: 100%;
  }
  
  .search-btn {
    width: 100%;
    padding: 14px 24px;
  }
  
  .admin-info {
    padding: 12px 20px;
    margin-top: 12px;
  }
  
  .admin-name {
    font-size: 16px;
  }
  
  .main-content {
    padding: 16px;
  }
  
  .stats-section {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .stat-card {
    padding: 20px;
    gap: 16px;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
  }
  
  .stat-number {
    font-size: 24px;
  }
  
  .stat-label {
    font-size: 14px;
  }
  
  .students-section {
    padding: 20px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
    margin-bottom: 16px;
  }
  
  .section-header h2 {
    text-align: center;
    font-size: 20px;
  }
  
  .student-details {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
  
  .student-card {
    flex-direction: column;
    text-align: center;
    gap: 16px;
    padding: 20px;
  }
  
  .student-avatar {
    width: 48px;
    height: 48px;
  }
  
  .student-name {
    font-size: 18px;
    margin-bottom: 8px;
  }
  
  .student-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .attendance-info {
    gap: 6px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 6px;
  }
  
  .records-btn,
  .makeup-btn {
    flex: 1;
    font-size: 12px;
    padding: 10px 12px;
  }
  
  .attendance-count {
    padding: 10px 14px;
    font-size: 14px;
  }
  
  .makeup-dialog {
    width: 95% !important;
  }
  
  .makeup-header {
    padding: 20px;
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .header-icon {
    width: 40px;
    height: 40px;
  }
  
  .header-content h3 {
    font-size: 20px;
  }
  
  .makeup-content {
    padding: 20px;
  }
  
  .student-info-card {
    flex-direction: column;
    text-align: center;
    gap: 16px;
    padding: 20px;
  }
  
  .student-status {
    position: static;
    margin-top: 12px;
  }
  
  .form-section {
    padding: 20px;
  }
  
  .form-header {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
  
  .makeup-footer {
    padding: 16px 20px;
    flex-direction: column;
    gap: 12px;
  }
  
  .cancel-btn,
  .submit-btn {
    width: 100%;
    height: 52px;
    font-size: 16px;
  }
}

.attendance-records-dialog {
  .el-dialog__wrapper {
    transition: none !important;
    animation: none !important;
  }
  
  .el-dialog {
    transition: none !important;
    animation: none !important;
    transform: none !important;
  }
  
  .el-overlay {
    transition: none !important;
    animation: none !important;
  }
  
  .el-dialog__header {
    background: var(--primary-gradient);
    color: var(--text-primary);
    padding: 20px 24px;
    border-radius: 8px 8px 0 0;
  }
  
  .el-dialog__title {
    color: var(--text-primary);
    font-weight: 700;
    font-size: 18px;
  }
  
  .el-dialog__headerbtn .el-dialog__close {
    color: var(--text-primary);
    font-size: 20px;
  }
  
  .el-dialog__body {
    padding: 30px 24px;
    background: var(--bg-secondary);
  }
  
  .el-dialog__footer {
    background: var(--bg-secondary);
    padding: 20px 24px;
    border-radius: 0 0 8px 8px;
  }
}

.el-dialog__wrapper {
  transition: none !important;
  animation: none !important;
}

.el-dialog {
  transition: none !important;
  animation: none !important;
  transform: none !important;
}

.el-overlay {
  transition: none !important;
  animation: none !important;
}

.attendance-records-container {
  overflow-y: visible;
}

.records-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: var(--glass-bg);
  border-radius: 16px;
  box-shadow: 0 4px 20px var(--shadow-color);
}

.student-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.student-avatar-large {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.student-details h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.student-details p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 4px 0;
}

.attendance-summary {
  text-align: center;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  background: var(--primary-gradient);
  border-radius: 12px;
  color: var(--text-primary);
}

.summary-label {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
}

.summary-value {
  font-size: 24px;
  font-weight: 700;
  text-shadow: 0 2px 4px var(--shadow-color);
}

.no-records {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.no-records-icon {
  font-size: 48px;
  color: var(--text-tertiary);
  margin-bottom: 20px;
}

.no-records p {
  font-size: 16px;
  margin: 0;
  color: var(--text-secondary);
}

.charts-container-admin {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
  background: var(--glass-bg);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px var(--shadow-color);
}

.chart-item-admin {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px var(--shadow-color);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.chart-item-admin::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  opacity: 0.8;
}

.chart-item-admin:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px var(--shadow-color);
}

.chart-title-admin {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 15px;
  text-align: center;
  position: relative;
}

.chart-title-admin::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 2px;
  background: var(--primary-color);
  border-radius: 1px;
}

.chart-content-admin {
  height: 300px;
  width: 100%;
}

@media (max-width: 768px) {
  .charts-container-admin {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .chart-content-admin {
    height: 250px;
  }
}

.calendar-container {
  background: var(--glass-bg);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px var(--shadow-color);
}

.attendance-calendar {
  width: 100%;
}

.calendar-cell-admin {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.calendar-cell-admin:hover {
  background-color: var(--bg-secondary);
  border-radius: 4px;
}

.cell-date-admin {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.cell-status-admin {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.time-slot-status-admin {
  display: flex;
  gap: 2px;
  justify-content: center;
  align-items: center;
}

.time-slot-admin {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.time-slot-admin.signed {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
}

.time-slot-admin.morning.signed {
  background: var(--success-color);
  border-color: var(--success-color);
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.time-slot-admin.afternoon.signed {
  background: var(--warning-color);
  border-color: var(--warning-color);
  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
}

.time-slot-admin.evening.signed {
  background: var(--primary-color);
  border-color: var(--primary-color);
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
}

.time-label-admin {
  font-size: 8px;
  font-weight: 600;
}

.date-details-dialog-desktop {
  border-radius: 16px;
  overflow: hidden;
}

.date-details-content-desktop {
  padding: 20px;
}

.selected-date-desktop {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20px;
  text-align: center;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.attendance-times-desktop {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.no-attendance-desktop {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
  font-size: 16px;
  background: var(--bg-tertiary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.attendance-time-item-desktop {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.heatmap-dialog,
.trend-chart-dialog {
  background: var(--bg-primary);
  border-radius: 16px;
  box-shadow: 0 8px 32px var(--shadow-color);
}

.heatmap-dialog-content,
.trend-chart-dialog-content {
  padding: 20px;
}

.chart-container {
  background: var(--glass-bg);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px var(--shadow-color);
}

.heatmap-btn,
.trend-btn {
  margin-left: 8px;
}

.heatmap-btn:hover {
  background-color: var(--info-color);
  border-color: var(--info-color);
  color: white;
}

.trend-btn:hover {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.attendance-time-item-desktop:hover {
  background: var(--bg-tertiary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.time-icon-desktop {
  color: var(--primary-color);
  font-size: 18px;
}

.time-text-desktop {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 16px;
}

.time-slot-label-desktop {
  font-size: 12px;
  color: var(--text-secondary);
  background-color: var(--bg-tertiary);
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  margin-left: auto;
}

.attendance-calendar :deep(.el-calendar__header) {
  padding: 0;
}

.attendance-calendar :deep(.el-calendar__body) {
  padding: 0;
}

.attendance-calendar :deep(.el-calendar-table) {
  border: none;
}

.attendance-calendar :deep(.el-calendar-table thead th) {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  font-weight: 600;
  padding: 12px 0;
  border: none;
  font-size: 14px;
}

.attendance-calendar :deep(.el-calendar-table thead th:nth-child(1))::after {
  content: '周日';
}

.attendance-calendar :deep(.el-calendar-table thead th:nth-child(2))::after {
  content: '周一';
}

.attendance-calendar :deep(.el-calendar-table thead th:nth-child(3))::after {
  content: '周二';
}

.attendance-calendar :deep(.el-calendar-table thead th:nth-child(4))::after {
  content: '周三';
}

.attendance-calendar :deep(.el-calendar-table thead th:nth-child(5))::after {
  content: '周四';
}

.attendance-calendar :deep(.el-calendar-table thead th:nth-child(6))::after {
  content: '周五';
}

.attendance-calendar :deep(.el-calendar-table thead th:nth-child(7))::after {
  content: '周六';
}

.attendance-calendar :deep(.el-calendar-table thead th) {
  font-size: 0;
}

.attendance-calendar :deep(.el-calendar-table tbody td) {
  border: 1px solid var(--border-color);
  padding: 0;
  height: 60px;
  vertical-align: top;
  background: var(--bg-primary);
}

.attendance-calendar :deep(.el-calendar-table tbody td.is-today) {
  background: #000000 !important;
  border: 3px solid #ffffff !important;
  color: #ffffff !important;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3) !important;
  position: relative !important;
}

.attendance-calendar :deep(.el-calendar-table tbody td.is-today)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  pointer-events: none;
  z-index: 1;
}

.attendance-calendar :deep(.el-calendar-table tbody td.is-today) .day-number {
  color: #ffffff !important;
  font-weight: 900 !important;
  font-size: 14px !important;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5) !important;
  z-index: 2;
  position: relative;
}

.attendance-calendar :deep(.el-calendar-table tbody td.is-today) .attendance-dot {
  filter: brightness(1.5) drop-shadow(0 0 3px rgba(255, 255, 255, 0.8)) !important;
  z-index: 2;
  position: relative;
}

.attendance-calendar :deep(.el-calendar-table tbody td.is-selected) {
  background: var(--primary-color);
  opacity: 0.2;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px 24px;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.header-actions {
  display: flex;
  gap: 8px;
  margin-left: 20px;
  z-index: 10;
  position: relative;
}

.header-actions .el-button {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.header-actions .el-button:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

html.dark .calendar-header {
  background-color: var(--bg-primary);
  border-bottom-color: var(--border-color);
}

html.dark .header-title {
  color: var(--text-primary);
}

html.dark .header-actions .el-button {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

html.dark .header-actions .el-button:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.calendar-day {
  position: relative;
  height: 100%;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 6px 4px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.calendar-day:hover {
  background: var(--primary-color);
  opacity: 0.05;
}

.day-number {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
  z-index: 2;
}

.attendance-dots {
  display: flex;
  flex-direction: column;
  gap: 2px;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
}

.attendance-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.attendance-dot:hover {
  transform: scale(1.3);
  z-index: 10;
}

.attendance-dot.morning {
  background: linear-gradient(135deg, var(--success-color) 0%, #059669 100%);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3), 0 0 0 2px rgba(16, 185, 129, 0.1);
}

.attendance-dot.afternoon {
  background: linear-gradient(135deg, var(--warning-color) 0%, #D97706 100%);
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3), 0 0 0 2px rgba(245, 158, 11, 0.1);
}

.attendance-dot.evening {
  background: linear-gradient(135deg, var(--primary-color) 0%, #7C3AED 100%);
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3), 0 0 0 2px rgba(139, 92, 246, 0.1);
}

.attendance-dot:hover {
  transform: scale(1.3);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 3px rgba(255, 255, 255, 0.8);
}

.calendar-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 24px;
  padding: 20px;
  background: var(--bg-tertiary);
  border-radius: 16px;
  flex-wrap: wrap;
  border: 1px solid var(--glass-border);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
  padding: 8px 16px;
  background: var(--glass-bg);
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.legend-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px var(--shadow-color);
}

.legend-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-dot.morning {
  background: linear-gradient(135deg, var(--success-color) 0%, #059669 100%);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3), 0 0 0 2px rgba(16, 185, 129, 0.1);
}

.legend-dot.afternoon {
  background: linear-gradient(135deg, var(--warning-color) 0%, #D97706 100%);
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3), 0 0 0 2px rgba(245, 158, 11, 0.1);
}

.legend-dot.evening {
  background: linear-gradient(135deg, var(--primary-color) 0%, #7C3AED 100%);
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3), 0 0 0 2px rgba(139, 92, 246, 0.1);
}

.attendance-record-item {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  margin-bottom: 16px;
}

.attendance-record-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  transition: all 0.4s ease;
}

.attendance-record-item.morning::before {
  background: linear-gradient(90deg, var(--success-color) 0%, #059669 100%);
}

.attendance-record-item.afternoon::before {
  background: linear-gradient(90deg, var(--warning-color) 0%, #D97706 100%);
}

.attendance-record-item.evening::before {
  background: linear-gradient(90deg, var(--primary-color) 0%, #7C3AED 100%);
}

.attendance-record-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.attendance-record-item.morning:hover {
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.2);
}

.attendance-record-item.afternoon:hover {
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.2);
}

.attendance-record-item.evening:hover {
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
}

.time-period-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.time-period-indicator.morning {
  color: var(--success-color);
}

.time-period-indicator.afternoon {
  color: var(--warning-color);
}

.time-period-indicator.evening {
  color: var(--primary-color);
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.time-period-indicator.morning .indicator-dot {
  background: linear-gradient(135deg, var(--success-color) 0%, #059669 100%);
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
}

.time-period-indicator.afternoon .indicator-dot {
  background: linear-gradient(135deg, var(--warning-color) 0%, #D97706 100%);
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
}

.time-period-indicator.evening .indicator-dot {
  background: linear-gradient(135deg, var(--primary-color) 0%, #7C3AED 100%);
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.4);
}

.record-content {
  display: flex;
  align-items: center;
  padding: 0 20px 20px;
  gap: 16px;
}

.student-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  color: var(--text-primary);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.student-avatar.morning {
  background: linear-gradient(135deg, var(--success-color) 0%, #059669 100%);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.student-avatar.afternoon {
  background: linear-gradient(135deg, var(--warning-color) 0%, #D97706 100%);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.student-avatar.evening {
  background: linear-gradient(135deg, var(--primary-color) 0%, #7C3AED 100%);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.student-details {
  flex: 1;
  min-width: 0;
}

.student-name {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 16px;
  margin-bottom: 4px;
  line-height: 1.2;
}

.student-id {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.2;
}

.attendance-time {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 14px;
  flex-shrink: 0;
}

.time-icon {
  color: var(--text-tertiary);
  font-size: 16px;
  transition: all 0.3s ease;
}

.time-text {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-weight: 500;
  font-size: 13px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .records-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .calendar-container {
    padding: 15px;
  }
  
  .calendar-day {
    min-height: 45px;
  }
  
  .day-number {
    font-size: 10px;
  }
  
  .attendance-dot {
    width: 6px;
    height: 6px;
  }
  
  .attendance-calendar :deep(.el-calendar-table tbody td) {
    height: 45px;
  }
  
  .calendar-legend {
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }
  
  .legend-item {
    font-size: 13px;
  }
  
  .legend-dot {
    width: 10px;
    height: 10px;
  }
  
  .record-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 0 16px 16px;
  }
  
  .attendance-time {
    align-self: flex-end;
    margin-top: 8px;
  }
  
  .time-period-indicator {
    padding: 10px 16px 6px;
    font-size: 11px;
  }
  
  .student-avatar {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .student-name {
    font-size: 15px;
  }
  
  .student-id {
    font-size: 12px;
  }
  
  .time-text {
    font-size: 12px;
  }
  
  .attendance-record-item {
    margin-bottom: 12px;
  }
  
  .calendar-header {
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }
  
  .header-title {
    font-size: 18px;
  }
  
  .header-actions {
    gap: 6px;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
