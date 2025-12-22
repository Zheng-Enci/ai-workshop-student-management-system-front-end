<template>
  <div class="points-dashboard-container">
    <div class="header">
      <div class="header-left">
        <el-button @click="goBack" class="back-btn" type="primary" :icon="ArrowLeft" circle></el-button>
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊" class="logo" @click="toggleTheme" title="切换主题模式">
        <div class="title-section">
          <h1 class="main-title">在0与1之间，见证每一位创作者的光芒</h1>
        </div>
      </div>
      <div class="header-right">
        <!-- 手机端不显示slogan图片 -->
      </div>
    </div>

    <div class="main-content">
      <div class="dashboard-layout">
        <div class="dashboard-main">
          <div v-if="activeTab === 'signIn'" class="ranking-tabs">
            <div class="ranking-topbar">
              <div class="ranking-arrows">
                <el-button circle size="small" plain @click="switchTab('prev')">
                  <el-icon><ArrowLeft /></el-icon>
                </el-button>
                <span class="ranking-label">{{ currentTabLabel }}</span>
                <el-button circle size="small" plain @click="switchTab('next')">
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="ranking-list-container">
              <div v-if="signInLoading" class="loading-container">
                <el-icon class="is-loading"><Loading /></el-icon>
                <span>加载中...</span>
              </div>
              <div v-else-if="signInRanking.length === 0" class="empty-container">
                <el-icon><Box /></el-icon>
                <span>暂无数据</span>
              </div>
              <div v-else>
                <div ref="signInChart" class="points-chart"></div>
                <div class="formula-card formula-mini">
                  <div class="formula-content">
                    <div class="formula-item">
                      <span class="formula-label">总签到积分</span>
                      <span class="formula-equals">=</span>
                      <span class="formula-value">签到次数</span>
                      <span class="formula-operator">×</span>
                      <span class="formula-value">0.64</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'activity'" class="ranking-tabs">
            <div class="ranking-topbar">
              <div class="ranking-arrows">
                <el-button circle size="small" plain @click="switchTab('prev')">
                  <el-icon><ArrowLeft /></el-icon>
                </el-button>
                <span class="ranking-label">{{ currentTabLabel }}</span>
                <el-button circle size="small" plain @click="switchTab('next')">
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="ranking-list-container">
              <div v-if="activityLoading" class="loading-container">
                <el-icon class="is-loading"><Loading /></el-icon>
                <span>加载中...</span>
              </div>
              <div v-else-if="activityRanking.length === 0" class="empty-container">
                <el-icon><Box /></el-icon>
                <span>暂无数据</span>
              </div>
              <div v-else>
                <div ref="activityChart" class="points-chart"></div>
                <div class="formula-card formula-mini">
                  <div class="formula-content">
                    <div class="formula-item">
                      <span class="formula-label">总活动积分</span>
                      <span class="formula-equals">=</span>
                      <span class="formula-value">Σ(所有活动积分)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="ranking-tabs">
            <div class="ranking-topbar">
              <div class="ranking-arrows">
                <el-button circle size="small" plain @click="switchTab('prev')">
                  <el-icon><ArrowLeft /></el-icon>
                </el-button>
                <span class="ranking-label">{{ currentTabLabel }}</span>
                <el-button circle size="small" plain @click="switchTab('next')">
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>
              <div class="color-legend">
                <div class="legend-item">
                  <span class="legend-dot legend-signin"></span>
                  <span class="legend-text">总签到积分</span>
                </div>
                <div class="legend-item">
                  <span class="legend-dot legend-activity"></span>
                  <span class="legend-text">总活动积分</span>
                </div>
              </div>
            </div>
            <div class="ranking-list-container">
              <div v-if="totalLoading" class="loading-container">
                <el-icon class="is-loading"><Loading /></el-icon>
                <span>加载中...</span>
              </div>
              <div v-else-if="totalRanking.length === 0" class="empty-container">
                <el-icon><Box /></el-icon>
                <span>暂无符合条件的学生</span>
              </div>
              <div v-else>
                <div ref="totalChart" class="points-chart"></div>
                <div class="formula-card formula-mini">
                  <div class="formula-content">
                    <div class="formula-item">
                      <span class="formula-label">总积分</span>
                      <span class="formula-equals">=</span>
                      <span class="formula-value">总签到积分</span>
                      <span class="formula-operator">+</span>
                      <span class="formula-value">总活动积分</span>
                    </div>
                    <div class="formula-desc">说明：只有同时处于签到积分前50名和活动积分前50名的学生才能参与总积分排名（显示前16名）</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dashboard-side">
          <div class="side-card">
            <div class="side-card-header">
              <div class="card-header-left">
                <div class="side-card-title">优秀成员</div>
                <div class="side-card-subtitle">总积分前32名</div>
              </div>
              <div class="unified-legend" v-if="topStudents.length > 0">
                <div class="legend-section">
                  <div class="legend-item">
                    <span class="legend-dot legend-club-member"></span>
                    <span class="legend-text">社团成员</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-dot legend-normal-member"></span>
                    <span class="legend-text">普通成员</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-dot legend-core-member"></span>
                    <span class="legend-text">核心成员</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-dot legend-admin"></span>
                    <span class="legend-text">管理员</span>
                  </div>
                </div>
                <div class="legend-section">
                  <div class="legend-item">
                    <el-icon class="hint-icon"><View /></el-icon>
                    <span class="legend-text">点击眼睛图标可查看全部改分记录</span>
                  </div>
                </div>
                <div class="legend-section">
                  <div class="legend-item">
                    <span class="legend-dot legend-total"></span>
                    <span class="legend-text">总积分</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-dot legend-signin"></span>
                    <span class="legend-text">总签到积分</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-dot legend-activity"></span>
                    <span class="legend-text">总活动积分</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="side-card-body" v-if="topStudents.length > 0">
              <div
                v-for="student in topStudents"
                :key="student.studentInfoId || student.placeholderId"
                class="side-student"
                :class="{ 
                  'is-placeholder': student.placeholder,
                  'level-club-member': !student.placeholder && student.levelCode === 0,
                  'level-normal-member': !student.placeholder && student.levelCode === 1,
                  'level-core-member': !student.placeholder && student.levelCode === 2,
                  'level-admin': !student.placeholder && student.levelCode === 3
                }"
              >
                <div class="side-info">
                  <div class="side-avatar-section">
                    <div class="side-avatar" :class="{ 'has-avatar': student.hasAvatar && student.avatarUrl, 'no-avatar': !student.hasAvatar || !student.avatarUrl }">
                      <img v-if="student.hasAvatar && student.avatarUrl" :src="student.avatarUrl" alt="头像" class="avatar-image" @error="handleAvatarError(student)" />
                      <el-icon v-else size="18" class="avatar-icon"><User /></el-icon>
                    </div>
                    <div class="side-name">
                      {{ student.placeholder ? '待入榜' : (student.name || `学生ID: ${student.studentInfoId}`) }}
                    </div>
                  </div>
                  <div class="side-content">
                    <div class="side-meta" v-if="!student.placeholder">
                      <div class="meta-line meta-line-second" v-if="student.major">{{ student.major }}</div>
                      <div class="meta-line meta-line-second" v-if="student.grade">{{ formatGrade(student.grade) }}</div>
                      <div class="meta-line meta-line-second" v-if="!student.major && !student.grade">--</div>
                    </div>
                    <div class="side-points">
                      <div class="points-total-row">
                        <div class="points-formula" v-if="!student.placeholder">
                          <span class="points-total points-total-main">{{ student.totalPoints }}</span>
                          <span class="points-equals">=</span>
                          <span class="points-number points-signin">{{ student.signInPoints }}</span>
                          <span class="points-plus">+</span>
                          <span class="points-number points-activity">{{ student.activityPoints }}</span>
                        </div>
                        <div class="points-formula" v-else>
                          <span class="points-placeholder">待公布</span>
                        </div>
                          <el-button 
                            v-if="!student.placeholder"
                            size="small" 
                            type="primary" 
                            plain 
                            @click="openRecordsDialog(student)"
                            class="view-records-btn"
                            circle
                          >
                            <el-icon><View /></el-icon>
                          </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="side-empty">
              <el-icon><Box /></el-icon>
              <span>暂无数据</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 改分记录弹窗 -->
    <el-dialog
      v-model="recordsDialogVisible"
      :title="dialogTitle"
      width="95%"
      :close-on-press-escape="true"
      :show-close="true"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :append-to-body="true"
      :teleported="true"
      modal-class="records-dialog-overlay"
      class="records-dialog"
      @close="handleRecordsDialogClose"
    >
      <div v-if="showRecordsContent" class="records-grid">
        <div
          v-for="record in allRecords"
          :key="record.id"
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
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { ElButton, ElIcon, ElDialog } from 'element-plus'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-scrollbar.css'
import 'element-plus/theme-chalk/el-tag.css'
import 'element-plus/theme-chalk/el-popper.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/display.css'
import { ArrowLeft, ArrowRight, Loading, Box, View, User } from '@element-plus/icons-vue'
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import {
  GridComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { getAttendanceTopRanking } from '@/api/attendance'
import { getPointsTopRanking, getTopAdjustRecordsByStudentInfoId } from '@/api/points'
import { getStudentPublicFieldValueById, getAvatarUrl, getStudentLevelByInfoId } from '@/api/student'

echarts.use([
  GridComponent,
  BarChart,
  CanvasRenderer
])

const router = useRouter()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore

const activeTab = ref('total')
const tabOrder = ['total', 'signIn', 'activity']
const tabLabelMap = {
  total: '总积分排行榜',
  signIn: '签到积分排行榜',
  activity: '活动积分排行榜'
}
const currentTabLabel = computed(() => tabLabelMap[activeTab.value] || '')
const selectedTopN = 35
const totalRankingTopN = 50
const signInRanking = ref([])
const activityRanking = ref([])
const totalRanking = ref([])
const topStudents = ref([])
const signInLoading = ref(false)
const activityLoading = ref(false)
const totalLoading = ref(false)

// 改分记录弹窗相关
const recordsDialogVisible = ref(false)
const currentStudent = ref(null)
const allRecords = ref([])
const recordsLoading = ref(false)
const dialogTitle = ref('改分记录')
const showRecordsContent = ref(true)

const signInChart = ref(null)
const activityChart = ref(null)
const totalChart = ref(null)
let signInChartInstance = null
let activityChartInstance = null
let totalChartInstance = null

const goBack = () => {
  router.push('/navigation')
}

const switchTab = (direction) => {
  const idx = tabOrder.indexOf(activeTab.value)
  const nextIdx = direction === 'prev'
    ? (idx - 1 + tabOrder.length) % tabOrder.length
    : (idx + 1) % tabOrder.length
  activeTab.value = tabOrder[nextIdx]
  handleTabChange(activeTab.value)
}

const initSignInChart = async (data) => {
  if (!signInChart.value) {
    await nextTick()
    if (!signInChart.value) return
  }

  if (signInChartInstance) {
    signInChartInstance.dispose()
  }

  signInChartInstance = echarts.init(signInChart.value)

  const sortedData = [...data].sort((a, b) => a.signInPoints - b.signInPoints)
  const isDark = themeStore.isDarkMode
  const maxValue = sortedData.length > 0 ? sortedData[sortedData.length - 1].signInPoints : null

  const option = {
    tooltip: {
      show: false
    },
    grid: {
      left: '0%',
      right: '20%',
      bottom: '5%',
      top: '0%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      max: maxValue,
      axisLabel: {
        fontSize: 10,
        formatter: '{value}分',
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
      data: sortedData.map(item => item.name || `学生ID: ${item.studentInfoId}`),
      axisLabel: {
        interval: 0,
        fontSize: 10,
        color: isDark ? '#ffffff' : '#2c3e50'
      },
      axisLine: {
        lineStyle: {
          color: isDark ? '#ffffff' : '#2c3e50'
        }
      }
    },
    series: [
      {
        name: '签到积分',
        type: 'bar',
        data: sortedData.map(item => item.signInPoints),
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
            const item = sortedData[params.dataIndex]
            let line1 = ''
            if (item.major) {
              line1 += item.major
            }
            if (item.major && item.grade) {
              line1 += ' '
            }
            if (item.grade) {
              if (!item.major) {
                line1 += ' '
              }
              line1 += formatGrade(item.grade)
            }
            if (!line1) {
              line1 = '--'
            }
            return line1
          },
          fontSize: 9,
          color: isDark ? '#ffffff' : '#666',
          lineHeight: 12,
          distance: 8
        }
      }
    ]
  }

  signInChartInstance.setOption(option)
}

const initActivityChart = async (data) => {
  if (!activityChart.value) {
    await nextTick()
    if (!activityChart.value) return
  }

  if (activityChartInstance) {
    activityChartInstance.dispose()
  }

  activityChartInstance = echarts.init(activityChart.value)

  const sortedData = [...data].sort((a, b) => a.activityPoints - b.activityPoints)
  const isDark = themeStore.isDarkMode
  const maxValue = sortedData.length > 0 ? sortedData[sortedData.length - 1].activityPoints : null

  const option = {
    tooltip: {
      show: false
    },
    grid: {
      left: '0%',
      right: '20%',
      bottom: '5%',
      top: '0%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      max: maxValue,
      axisLabel: {
        fontSize: 10,
        formatter: '{value}分',
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
      data: sortedData.map(item => item.name || `学生ID: ${item.targetStudentInfoId}`),
      axisLabel: {
        interval: 0,
        fontSize: 10,
        color: isDark ? '#ffffff' : '#2c3e50'
      },
      axisLine: {
        lineStyle: {
          color: isDark ? '#ffffff' : '#2c3e50'
        }
      }
    },
    series: [
      {
        name: '活动积分',
        type: 'bar',
        data: sortedData.map(item => item.activityPoints),
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
            const item = sortedData[params.dataIndex]
            let line1 = ''
            if (item.major) {
              line1 += item.major
            }
            if (item.major && item.grade) {
              line1 += ' '
            }
            if (item.grade) {
              if (!item.major) {
                line1 += ' '
              }
              line1 += formatGrade(item.grade)
            }
            if (!line1) {
              line1 = '--'
            }
            return line1
          },
          fontSize: 9,
          color: isDark ? '#ffffff' : '#666',
          lineHeight: 12,
          distance: 8
        }
      }
    ]
  }

  activityChartInstance.setOption(option)
}

const initTotalChart = async (data) => {
  if (!totalChart.value) {
    await nextTick()
    if (!totalChart.value) return
  }

  if (totalChartInstance) {
    totalChartInstance.dispose()
  }

  totalChartInstance = echarts.init(totalChart.value)

  const sortedData = [...data].sort((a, b) => a.totalPoints - b.totalPoints)
  const isDark = themeStore.isDarkMode
  const firstPlaceTotalPoints = sortedData.length > 0 ? sortedData[sortedData.length - 1].totalPoints : null

  const option = {
    tooltip: {
      show: false
    },
    legend: {
      data: ['签到积分', '活动积分'],
      top: '0%',
      right: '0%',
      textStyle: {
        color: isDark ? '#ffffff' : '#2c3e50',
        fontSize: 10
      }
    },
    grid: {
      left: '0%',
      right: '20%',
      bottom: '5%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      max: firstPlaceTotalPoints,
      axisLabel: {
        fontSize: 10,
        formatter: '{value}分',
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
      data: sortedData.map(item => item.name || `学生ID: ${item.studentInfoId}`),
      axisLabel: {
        interval: 0,
        fontSize: 10,
        color: isDark ? '#ffffff' : '#2c3e50'
      },
      axisLine: {
        lineStyle: {
          color: isDark ? '#ffffff' : '#2c3e50'
        }
      }
    },
    series: [
      {
        name: '签到积分',
        type: 'bar',
        stack: 'total',
        data: sortedData.map(item => item.signInPoints),
        barWidth: '60%',
        itemStyle: {
          color: isDark ? '#60a5fa' : '#4facfe',
          borderRadius: [0, 0, 0, 0]
        },
        label: {
          show: false
        }
      },
      {
        name: '活动积分',
        type: 'bar',
        stack: 'total',
        data: sortedData.map(item => item.activityPoints),
        barWidth: '60%',
        itemStyle: {
          color: isDark ? '#00d4ff' : '#00f2fe',
          borderRadius: [0, 4, 4, 0]
        },
        label: {
          show: true,
          position: 'right',
          formatter: function(params) {
            const item = sortedData[params.dataIndex]
            return `${item.totalPoints}分`
          },
          fontSize: 9,
          color: isDark ? '#ffffff' : '#666',
          distance: 8
        }
      }
    ]
  }

  totalChartInstance.setOption(option)
}

const handleAvatarError = (student) => {
  student.hasAvatar = false
  student.avatarUrl = null
}


const loadStudentInfo = async (rankingList, idField = 'studentInfoId') => {
  const infoPromises = rankingList.map(async (item) => {
    const studentId = item[idField] || item.targetStudentInfoId
    if (!studentId) return item
    
    try {
      // 查询必要的字段：name, grade, major（接口不支持studentId字段）
      const [nameResponse, gradeResponse, majorResponse, levelResponse] = await Promise.all([
        getStudentPublicFieldValueById(studentId, 'name').catch(() => ({ code: 400, data: null })),
        getStudentPublicFieldValueById(studentId, 'grade').catch(() => ({ code: 400, data: null })),
        getStudentPublicFieldValueById(studentId, 'major').catch(() => ({ code: 400, data: null })),
        getStudentLevelByInfoId(studentId).catch(() => ({ code: 400, data: null }))
      ])
      
      if (nameResponse.code === 200 && nameResponse.data) {
        item.name = nameResponse.data
      }
      if (gradeResponse.code === 200 && gradeResponse.data) {
        item.grade = parseInt(gradeResponse.data)
      }
      if (majorResponse.code === 200 && majorResponse.data) {
        item.major = majorResponse.data
      }
      if (levelResponse.code === 200 && levelResponse.data !== null && levelResponse.data !== undefined) {
        item.levelCode = parseInt(levelResponse.data)
      }
      
      // 加载头像
      const avatarUrlString = getAvatarUrl(studentId, 128)
      if (avatarUrlString) {
        // 先设置URL，让浏览器尝试加载
        item.avatarUrl = avatarUrlString
        item.hasAvatar = true
        // 使用Image对象验证头像是否存在
        const img = new Image()
        img.onload = () => {
          item.hasAvatar = true
        }
        img.onerror = () => {
          item.hasAvatar = false
          item.avatarUrl = null
        }
        img.src = avatarUrlString
      } else {
        item.hasAvatar = false
        item.avatarUrl = null
      }
    } catch (error) {
      return item
    }
    return item
  })
  
  await Promise.all(infoPromises)
  return rankingList
}

const loadSignInRanking = async () => {
  signInLoading.value = true
  try {
    const response = await getAttendanceTopRanking(selectedTopN)
    if (response.code === 200 && response.data) {
      signInRanking.value = response.data.map(item => ({
        studentInfoId: item.studentInfoId,
        attendanceCount: item.attendanceCount,
        signInPoints: Math.round(item.attendanceCount * 0.64)
      }))
      await loadStudentInfo(signInRanking.value, 'studentInfoId')
      signInLoading.value = false
      await nextTick()
      if (signInRanking.value.length > 0) {
        const initChartWithRetry = async (retryCount = 0) => {
          if (signInChart.value) {
            await initSignInChart(signInRanking.value)
          } else if (retryCount < 10) {
            setTimeout(() => {
              initChartWithRetry(retryCount + 1)
            }, 100)
          }
        }
        setTimeout(() => {
          initChartWithRetry()
        }, 200)
      }
    }
  } catch (error) {
    signInRanking.value = []
  } finally {
    signInLoading.value = false
  }
}

const loadActivityRanking = async () => {
  activityLoading.value = true
  try {
    const response = await getPointsTopRanking(selectedTopN)
    if (response.code === 200 && response.data) {
      activityRanking.value = response.data.map(item => ({
        targetStudentInfoId: item.targetStudentInfoId,
        activityPoints: item.totalPoints
      }))
      await loadStudentInfo(activityRanking.value, 'targetStudentInfoId')
      activityLoading.value = false
      await nextTick()
      if (activityRanking.value.length > 0) {
        const initChartWithRetry = async (retryCount = 0) => {
          if (activityChart.value) {
            await initActivityChart(activityRanking.value)
          } else if (retryCount < 10) {
            setTimeout(() => {
              initChartWithRetry(retryCount + 1)
            }, 100)
          }
        }
        setTimeout(() => {
          initChartWithRetry()
        }, 200)
      }
    }
  } catch (error) {
    activityRanking.value = []
  } finally {
    activityLoading.value = false
  }
}

const padTopStudents = (list, targetLength = 12) => {
  const filled = [...list]
  while (filled.length < targetLength) {
    filled.push({
      placeholder: true,
      placeholderId: `placeholder-${filled.length}`
    })
  }
  return filled
}

const loadTotalRanking = async () => {
  totalLoading.value = true
  try {
    const [signInResponse, activityResponse] = await Promise.all([
      getAttendanceTopRanking(totalRankingTopN),
      getPointsTopRanking(totalRankingTopN)
    ])
    
    if (signInResponse.code === 200 && activityResponse.code === 200) {
      const signInMap = new Map()
      signInResponse.data.forEach((item, index) => {
        signInMap.set(item.studentInfoId, {
          studentInfoId: item.studentInfoId,
          attendanceCount: item.attendanceCount,
          signInPoints: Math.round(item.attendanceCount * 0.64),
          signInRank: index + 1
        })
      })
      
      const activityMap = new Map()
      activityResponse.data.forEach((item, index) => {
        activityMap.set(item.targetStudentInfoId, {
          targetStudentInfoId: item.targetStudentInfoId,
          activityPoints: item.totalPoints,
          activityRank: index + 1
        })
      })
      
      const eligibleStudents = []
      signInMap.forEach((signInData, studentId) => {
        const activityData = activityMap.get(studentId)
        if (activityData) {
          eligibleStudents.push({
            studentInfoId: studentId,
            signInPoints: signInData.signInPoints,
            activityPoints: activityData.activityPoints,
            totalPoints: signInData.signInPoints + activityData.activityPoints
          })
        }
      })
      
      eligibleStudents.sort((a, b) => b.totalPoints - a.totalPoints)
      totalRanking.value = eligibleStudents.slice(0, selectedTopN)
      // 加载所有需要显示的学生信息（包括前40名）
      await loadStudentInfo(totalRanking.value, 'studentInfoId')
      // 从已加载信息的总排行榜中取前32名用于侧边栏显示
      const topList = totalRanking.value.slice(0, 32)
      topStudents.value = padTopStudents(topList, 32)
      totalLoading.value = false
      await nextTick()
      if (totalRanking.value.length > 0) {
        const initChartWithRetry = async (retryCount = 0) => {
          if (totalChart.value) {
            await initTotalChart(totalRanking.value)
          } else if (retryCount < 10) {
            setTimeout(() => {
              initChartWithRetry(retryCount + 1)
            }, 100)
          }
        }
        setTimeout(() => {
          initChartWithRetry()
        }, 200)
      }
    }
  } catch (error) {
    totalRanking.value = []
  } finally {
    totalLoading.value = false
  }
}

const handleTabChange = async (tabName) => {
  await nextTick()
  if (tabName === 'signIn') {
    if (signInRanking.value.length === 0) {
      await loadSignInRanking()
    } else if (signInRanking.value.length > 0) {
      const initChartWithRetry = async (retryCount = 0) => {
        if (signInChart.value) {
          await initSignInChart(signInRanking.value)
        } else if (retryCount < 10) {
          setTimeout(() => {
            initChartWithRetry(retryCount + 1)
          }, 100)
        }
      }
      setTimeout(() => {
        initChartWithRetry()
      }, 200)
    }
  } else if (tabName === 'activity') {
    if (activityRanking.value.length === 0) {
      await loadActivityRanking()
    } else if (activityRanking.value.length > 0) {
      const initChartWithRetry = async (retryCount = 0) => {
        if (activityChart.value) {
          await initActivityChart(activityRanking.value)
        } else if (retryCount < 10) {
          setTimeout(() => {
            initChartWithRetry(retryCount + 1)
          }, 100)
        }
      }
      setTimeout(() => {
        initChartWithRetry()
      }, 200)
    }
  } else if (tabName === 'total') {
    if (totalRanking.value.length === 0) {
      await loadTotalRanking()
    } else if (totalRanking.value.length > 0) {
      const initChartWithRetry = async (retryCount = 0) => {
        if (totalChart.value) {
          await initTotalChart(totalRanking.value)
        } else if (retryCount < 10) {
          setTimeout(() => {
            initChartWithRetry(retryCount + 1)
          }, 100)
        }
      }
      setTimeout(() => {
        initChartWithRetry()
      }, 200)
    }
  }
}

const handleResize = () => {
  if (signInChartInstance) {
    signInChartInstance.resize()
  }
  if (activityChartInstance) {
    activityChartInstance.resize()
  }
  if (totalChartInstance) {
    totalChartInstance.resize()
  }
}

watch(() => themeStore.isDarkMode, () => {
  setTimeout(() => {
    if (activeTab.value === 'signIn' && signInRanking.value.length > 0) {
      initSignInChart(signInRanking.value)
    } else if (activeTab.value === 'activity' && activityRanking.value.length > 0) {
      initActivityChart(activityRanking.value)
    } else if (activeTab.value === 'total' && totalRanking.value.length > 0) {
      initTotalChart(totalRanking.value)
    }
  }, 100)
})

const openRecordsDialog = async (student) => {
  // 恢复遮罩层样式，确保可以正常显示
  const dialogWrapper = document.querySelector('.records-dialog-overlay')
  if (dialogWrapper) {
    dialogWrapper.style.display = ''
    dialogWrapper.style.visibility = ''
    dialogWrapper.style.opacity = ''
  }
  
  // 设置当前学生
  currentStudent.value = student
  dialogTitle.value = `${student?.name || '学生'}的改分记录`
  showRecordsContent.value = true
  recordsDialogVisible.value = true
  recordsLoading.value = true
  allRecords.value = []
  
  try {
    const response = await getTopAdjustRecordsByStudentInfoId(student.studentInfoId, 100)
    if (response.code === 200 && Array.isArray(response.data)) {
      // 按时间降序排序（最新的在前）
      allRecords.value = response.data.sort((a, b) => {
        const timeA = new Date(a.createTime).getTime()
        const timeB = new Date(b.createTime).getTime()
        return timeB - timeA
      })
    }
  } catch (error) {
    console.error('获取改分记录失败:', error)
    allRecords.value = []
  } finally {
    recordsLoading.value = false
  }
}

const handleRecordsDialogClose = () => {
  // 先直接操作DOM隐藏遮罩层，避免闪烁
  const dialogWrapper = document.querySelector('.records-dialog-overlay')
  if (dialogWrapper) {
    dialogWrapper.style.display = 'none'
    dialogWrapper.style.visibility = 'hidden'
    dialogWrapper.style.opacity = '0'
  }
  
  // 立即清空 allRecords，避免 v-for 在关闭动画过程中重新渲染
  allRecords.value = []
  
  // 延迟清空其他数据，确保弹窗完全关闭后再清空
  setTimeout(() => {
    recordsLoading.value = false
    currentStudent.value = null
    dialogTitle.value = '改分记录'
  }, 0)
}

const formatGrade = (grade) => {
  if (!grade) return ''
  const gradeNum = parseInt(grade)
  if (isNaN(gradeNum)) return grade
  const gradeMap = {
    1: '大一',
    2: '大二',
    3: '大三',
    4: '大四',
    5: '大五',
    6: '大六'
  }
  return gradeMap[gradeNum] || `${gradeNum}年级`
}

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

onMounted(async () => {
  await nextTick()
  await loadTotalRanking()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (signInChartInstance) {
    signInChartInstance.dispose()
  }
  if (activityChartInstance) {
    activityChartInstance.dispose()
  }
  if (totalChartInstance) {
    totalChartInstance.dispose()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* 阴影系统 CSS 变量 - 根据主题模式调整 */
/* 日间模式：使用深灰色阴影（而非纯黑色）增强对比度，不透明度 0.2-0.3，增大模糊半径和扩散范围 */
/* 参考 Material Design 3、Ant Design、腾讯云等：避免纯黑色，使用深灰色 rgba(30-50, 30-50, 30-50) */
:root {
  --shadow-sm: 0 2px 12px rgba(30, 30, 30, 0.2), 0 1px 4px rgba(30, 30, 30, 0.15);
  --shadow-md: 0 4px 20px rgba(40, 40, 40, 0.25), 0 2px 8px rgba(40, 40, 40, 0.18);
  --shadow-lg: 0 8px 40px rgba(50, 50, 50, 0.3), 0 4px 16px rgba(50, 50, 50, 0.22), 0 2px 8px rgba(50, 50, 50, 0.15);
  --shadow-primary: 0 2px 12px rgba(102, 126, 234, 0.35), 0 1px 4px rgba(102, 126, 234, 0.25);
  --shadow-card: 0 4px 20px rgba(40, 40, 40, 0.25), 0 2px 8px rgba(40, 40, 40, 0.18);
  --shadow-button: 0 8px 40px rgba(102, 126, 234, 0.5), 0 4px 16px rgba(102, 126, 234, 0.35);
}

html.dark {
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2);
  --shadow-primary: 0 2px 8px rgba(102, 126, 234, 0.2);
  --shadow-card: 0 4px 16px rgba(0, 0, 0, 0.12);
  --shadow-button: 0 8px 32px rgba(102, 126, 234, 0.3);
}


.points-dashboard-container {
  min-height: 100vh;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
}

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  min-height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  position: absolute;
  left: 12px;
  z-index: 1;
}

.header-left .back-btn,
.header-left .logo {
  flex-shrink: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.slogan {
  display: flex;
  align-items: center;
  padding: 12px 8px 4px 8px;
  margin-right: 4px;
}

.slogan-img {
  height: 50px;
  transition: filter 0.3s ease;
}

html.dark .slogan-img {
  filter: invert(1);
}

.back-btn {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  background: var(--primary-color);
  border: none;
  box-shadow: var(--shadow-button);
  touch-action: manipulation;
}

.logo {
  width: 48px;
  height: 48px;
  min-width: 48px;
  min-height: 48px;
  cursor: pointer;
  border-radius: 0;
  touch-action: manipulation;
}

.title-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
}

.title-section .main-title {
  font-size: 24px;
  font-weight: 800;
  margin: 8px 0 0 0;
  padding: 0;
  line-height: 1.2;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  display: block;
}

.title-section h1 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-section p {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 6px 0 0 0;
  font-weight: 500;
}

.main-content {
  padding: 12px;
  max-width: 100%;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dashboard-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  min-height: 0;
}

.dashboard-main {
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

.ranking-tabs {
  width: 100%;
  margin-left: 0%;
  margin-top: 0%;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.ranking-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  flex-shrink: 0;
  width: 100%;
  margin-bottom: 1%;
}

.ranking-arrows {
  display: flex;
  gap: 2px;
  align-items: center;
  margin-bottom: 0;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 6px;
  padding: 2px 4px;
  backdrop-filter: blur(6px);
}

html.dark .ranking-arrows {
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.ranking-arrows .el-button {
  padding: 1px;
  width: 22px;
  height: 22px;
  min-width: 22px;
  min-height: 22px;
  touch-action: manipulation;
}

.ranking-label {
  font-size: 9px;
  font-weight: 700;
  color: var(--text-primary);
  padding: 1px 4px;
  border-radius: 4px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  line-height: 12px;
  white-space: nowrap;
}

html.dark .ranking-label {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.ranking-topbar .color-legend {
  margin-left: auto;
  /* margin-top: 10%; */
}

.dashboard-side {
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.side-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(0, 242, 254, 0.08) 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 16px;
  padding: 0 16px 16px 16px;
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-lg);
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: visible;
}

.side-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
  margin-top: 1%;
  padding-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(102, 126, 234, 0.15);
  flex-shrink: 0;
}

.card-header-left {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.side-card-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--text-primary);
  background: linear-gradient(135deg, var(--primary-color), #00d4ff, #00f2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.4px;
  text-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
  position: relative;
  display: inline-block;
}

.side-card-subtitle {
  font-size: 10px;
  color: var(--text-secondary);
  margin-top: 3px;
  opacity: 0.85;
  line-height: 1.3;
}

.side-card-body {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: min-content;
  gap: 6px;
  width: 100%;
  align-items: start;
  position: relative;
  overflow: hidden;
  flex: 1;
  min-height: 0;
  padding-top: 10px;
}


.side-student {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
  border: 1.5px solid rgba(102, 126, 234, 0.2);
  box-shadow: var(--shadow-card), 0 2px 8px rgba(102, 126, 234, 0.1);
  position: relative;
  overflow: visible;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: card-enter 0.6s ease-out backwards;
  width: 100%;
  min-height: 0;
}

.side-student.level-club-member {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%);
  border-color: rgba(59, 130, 246, 0.3);
}

.side-student.level-normal-member {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.06) 100%);
  border-color: rgba(34, 197, 94, 0.3);
}

.side-student.level-core-member {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.12) 0%, rgba(251, 191, 36, 0.06) 100%);
  border-color: rgba(251, 191, 36, 0.3);
}

.side-student.level-admin {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.06) 100%);
  border-color: rgba(239, 68, 68, 0.3);
}

.side-student:nth-child(1) { animation-delay: 0.1s; }
.side-student:nth-child(2) { animation-delay: 0.2s; }
.side-student:nth-child(3) { animation-delay: 0.3s; }
.side-student:nth-child(4) { animation-delay: 0.4s; }
.side-student:nth-child(5) { animation-delay: 0.5s; }
.side-student:nth-child(6) { animation-delay: 0.6s; }
.side-student:nth-child(7) { animation-delay: 0.7s; }
.side-student:nth-child(8) { animation-delay: 0.8s; }
.side-student:nth-child(9) { animation-delay: 0.9s; }
.side-student:nth-child(10) { animation-delay: 1.0s; }
.side-student:nth-child(11) { animation-delay: 1.1s; }
.side-student:nth-child(12) { animation-delay: 1.2s; }


.side-student.is-placeholder {
  opacity: 0.6;
  border-style: dashed;
  border-color: rgba(102, 126, 234, 0.2);
  box-shadow: none;
  background: rgba(255, 255, 255, 0.02);
}



.side-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  justify-content: flex-start;
  position: relative;
  z-index: 2;
  min-height: 0;
  overflow: hidden;
}

.side-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-bottom: 0;
}

.side-avatar {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.side-avatar::before {
  content: '';
  position: absolute;
  top: -200%;
  left: -200%;
  width: 400%;
  height: 400%;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0) 40%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(255, 255, 255, 0) 60%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: avatarShine 3s infinite linear;
  pointer-events: none;
  z-index: 1;
}

@keyframes avatarShine {
  0% {
    top: -200%;
    left: -200%;
  }
  100% {
    top: 200%;
    left: 200%;
  }
}

.side-avatar.has-avatar {
  background: transparent;
}

.side-avatar.no-avatar {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.side-avatar .avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  position: relative;
  z-index: 0;
}

.side-avatar .avatar-icon {
  color: white;
  position: relative;
  z-index: 0;
}


.side-name {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-primary);
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.2;
  letter-spacing: 0.1px;
  hyphens: auto;
  text-align: center;
  min-width: 0;
}


.side-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.side-meta {
  display: flex;
  flex-direction: row;
  gap: 2px;
  font-size: 9px;
  color: var(--text-primary);
  min-height: 0;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.side-meta .meta-line {
  padding: 2px 6px;
  border-radius: 4px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(0, 242, 254, 0.08) 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
  line-height: 1.3;
  cursor: default;
  width: fit-content;
  max-width: 100%;
  box-sizing: border-box;
  font-weight: 500;
  box-shadow: var(--shadow-primary);
  position: relative;
  font-size: 10px;
  white-space: nowrap;
}



.side-meta .meta-line-first {
  min-height: 0;
  font-weight: 600;
  color: var(--primary-color);
}

.side-meta .meta-line-second {
  min-height: 0;
  font-size: 9px;
  color: var(--text-secondary);
}

.unified-legend {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 14px;
  flex: 1;
  min-width: 0;
  padding: 0;
  border-bottom: none;
  align-items: center;
}

.unified-legend .legend-section {
  display: flex;
  align-items: center;
  gap: 9px;
  flex-wrap: wrap;
}

.unified-legend .legend-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--text-secondary);
  font-size: 11px;
}

.unified-legend .legend-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.unified-legend .legend-club-member {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.6) 100%);
}

.unified-legend .legend-normal-member {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(34, 197, 94, 0.6) 100%);
}

.unified-legend .legend-core-member {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.8) 0%, rgba(251, 191, 36, 0.6) 100%);
}

.unified-legend .legend-admin {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, rgba(239, 68, 68, 0.6) 100%);
}

.unified-legend .legend-total {
  background: linear-gradient(135deg, var(--primary-color), #00d4ff, #00f2fe);
}

.unified-legend .legend-signin {
  background: linear-gradient(135deg, #10b981, #059669, #047857);
}

.unified-legend .legend-activity {
  background: linear-gradient(135deg, #f59e0b, #d97706, #b45309);
}

.unified-legend .legend-text {
  font-size: 11px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.unified-legend .hint-icon {
  font-size: 13px;
  color: var(--primary-color);
  flex-shrink: 0;
}


.side-points {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-top: 4px;
  border-top: 1px solid rgba(102, 126, 234, 0.1);
  flex-shrink: 0;
}

.points-total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  flex-wrap: wrap;
}

.points-formula {
  display: flex;
  align-items: center;
  gap: 3px;
  flex-wrap: nowrap;
  flex: 1;
  min-width: 0;
}

.points-total {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1px;
  flex-shrink: 0;
}

.points-equals {
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
  margin: 0 2px;
}

.points-plus {
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
  margin: 0 2px;
}

.points-total-main {
  color: var(--primary-color);
  background: linear-gradient(135deg, var(--primary-color), #00d4ff, #00f2fe);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  animation: points-gradient-flow 3s ease infinite;
}


.points-detail {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  line-height: 1.3;
}

.points-number {
  font-weight: 700;
  font-size: 10px;
  flex-shrink: 0;
}

.points-number.points-signin {
  color: #10b981;
  background: linear-gradient(135deg, #10b981, #059669, #047857);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.points-number.points-activity {
  color: #f59e0b;
  background: linear-gradient(135deg, #f59e0b, #d97706, #b45309);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.points-separator {
  color: var(--text-secondary);
  opacity: 0.5;
  font-size: 9px;
}

.points-placeholder {
  font-size: 10px;
  color: var(--text-secondary);
  opacity: 0.6;
}

.points-legend {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 8px;
  padding: 6px 0;
  font-size: 10px;
  border-bottom: 1px solid rgba(102, 126, 234, 0.15);
}

.points-legend .legend-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--text-secondary);
  font-size: 10px;
}

.points-legend .legend-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}

.points-legend .legend-total {
  background: linear-gradient(135deg, var(--primary-color), #00d4ff, #00f2fe);
}

.points-legend .legend-signin {
  background: linear-gradient(135deg, #10b981, #059669, #047857);
}

.points-legend .legend-activity {
  background: linear-gradient(135deg, #f59e0b, #d97706, #b45309);
}

.points-legend .legend-text {
  font-size: 10px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.side-records {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.record-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 11px;
  color: var(--text-primary);
  padding: 6px 8px;
  border-radius: 6px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(0, 242, 254, 0.06) 100%);
  border: 1px solid rgba(102, 126, 234, 0.15);
}

.record-points {
  font-weight: 700;
  font-size: 13px;
  min-width: 40px;
  text-align: center;
  padding: 2px 6px;
  border-radius: 6px;
  flex-shrink: 0;
}

.record-points.positive {
  color: #10b981;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.record-points.negative {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.record-reason {
  color: var(--text-primary);
  flex: 1;
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.5;
  opacity: 0.9;
  hyphens: auto;
}

.side-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--text-secondary);
  padding: 32px 12px;
  font-size: 13px;
}

.ranking-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.ranking-tabs {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
}

:deep(.el-tabs__header) {
  margin: 0 0 24px 0;
}

:deep(.el-tabs__nav-wrap::after) {
  background-color: rgba(255, 255, 255, 0.1);
}

:deep(.el-tabs__item) {
  color: var(--text-secondary);
  font-size: 16px;
  font-weight: 500;
  padding: 0 24px;
  height: 48px;
  line-height: 48px;
}

:deep(.el-tabs__item.is-active) {
  color: var(--primary-color);
  font-weight: 600;
}

:deep(.el-tabs__active-bar) {
  background-color: var(--primary-color);
  height: 3px;
}

.ranking-list-container {
  min-height: 280px;
  width: 100%;
}

.loading-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 16px;
  color: var(--text-secondary);
}

.loading-container .el-icon {
  font-size: 48px;
  color: var(--primary-color);
}

.empty-container .el-icon {
  font-size: 48px;
  color: var(--text-secondary);
}

.points-chart {
  width: 100%;
  height: 400px;
  min-height: 300px;
  max-height: 500px;
  touch-action: pan-y;
}

.color-legend {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 6px 0 3px;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 11px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2);
}

.legend-signin {
  background: linear-gradient(135deg, #4facfe, #60a5fa);
}

.legend-activity {
  background: linear-gradient(135deg, #00f2fe, #00d4ff);
}

.formula-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(0, 242, 254, 0.05) 100%);
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 12px;
  border: 1px solid rgba(102, 126, 234, 0.15);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm);
}

.formula-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.formula-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-primary);
  flex-wrap: wrap;
  line-height: 1.4;
}

.formula-label {
  font-weight: 600;
  color: var(--primary-color);
  font-size: 12px;
  letter-spacing: 0.2px;
}

.formula-equals {
  color: var(--text-secondary);
  font-weight: 500;
  margin: 0 2px;
  font-size: 12px;
}

.formula-value {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(0, 242, 254, 0.12) 100%);
  padding: 3px 8px;
  border-radius: 5px;
  color: var(--primary-color);
  font-weight: 500;
  border: 1px solid rgba(102, 126, 234, 0.2);
  font-size: 11px;
}

.formula-operator {
  color: var(--text-secondary);
  font-weight: 600;
  margin: 0 3px;
  font-size: 13px;
  opacity: 0.8;
}

.formula-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(102, 126, 234, 0.15);
  opacity: 0.85;
}

.formula-card.formula-mini {
  padding: 10px 12px;
  margin-bottom: 12px;
}

.formula-card.formula-mini .formula-item {
  font-size: 11px;
  gap: 4px;
}

.formula-card.formula-mini .formula-label,
.formula-card.formula-mini .formula-value,
.formula-card.formula-mini .formula-equals {
  font-size: 11px;
}

.formula-card.formula-mini .formula-value {
  padding: 2px 6px;
  font-size: 10px;
}

.formula-card.formula-mini .formula-operator {
  font-size: 12px;
  margin: 0 2px;
}

.formula-card.formula-mini .formula-desc {
  font-size: 9px;
  margin-top: 4px;
  padding-top: 6px;
}

.view-records-btn {
  width: 22px;
  height: 22px;
  padding: 0;
  min-height: 22px;
  flex-shrink: 0;
  backdrop-filter: blur(10px);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(0, 242, 254, 0.1) 100%);
  border: 1px solid rgba(102, 126, 234, 0.35);
  box-shadow: var(--shadow-primary);
  touch-action: manipulation;
}

.view-records-btn:hover,
.view-records-btn:focus {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(0, 242, 254, 0.1) 100%);
  border-color: rgba(102, 126, 234, 0.35);
  box-shadow: var(--shadow-primary);
}

.view-records-btn:active {
  transform: scale(0.95);
}

.view-records-btn :deep(.el-button__inner) {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
}

.view-records-btn .el-icon {
  font-size: 11px;
  color: var(--primary-color);
}


.records-dialog :deep(.el-dialog__body) {
  padding: 16px;
  max-height: 70vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 完全禁用弹窗过渡动画，避免闪烁 */
.records-dialog :deep(.el-dialog__wrapper) {
  transition: none !important;
  animation: none !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}

.records-dialog :deep(.el-dialog) {
  transition: none !important;
  animation: none !important;
  transform: none !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}

.records-dialog :deep(.el-overlay) {
  transition: none !important;
  animation: none !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}

.records-dialog :deep(.el-dialog__body) {
  transition: none !important;
  animation: none !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}

.records-dialog :deep(.el-dialog__header) {
  transition: none !important;
  animation: none !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}

/* 禁用 BaseTransition 组件的过渡动画 */
.records-dialog :deep(.el-fade-in),
.records-dialog :deep(.el-fade-in-linear),
.records-dialog :deep(.el-zoom-in-center),
.records-dialog :deep(.el-zoom-in-top),
.records-dialog :deep(.el-zoom-in-bottom) {
  transition: none !important;
  animation: none !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}

/* 弹窗遮罩和容器定位修复 */
:deep(.records-dialog-overlay) {
  position: fixed !important;
  inset: 0 !important;
  background: rgba(0, 0, 0, 0.5) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 3000 !important;
  transition: none !important;
  animation: none !important;
}

:deep(.records-dialog-overlay .el-overlay-dialog) {
  position: fixed !important;
  inset: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 3001 !important;
  transition: none !important;
  animation: none !important;
}

.records-loading,
.records-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  color: var(--text-secondary);
}

.records-loading .el-icon {
  font-size: 48px;
  color: var(--primary-color);
}

.records-empty .el-icon {
  font-size: 48px;
  color: var(--text-secondary);
}

.records-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
}

.record-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(0, 242, 254, 0.05) 100%);
  border: 1px solid rgba(102, 126, 234, 0.15);
  border-radius: 12px;
  padding: 12px;
  box-shadow: var(--shadow-sm);
  width: 100%;
  box-sizing: border-box;
  word-break: break-word;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.record-time {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.record-points-badge {
  font-size: 16px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 6px;
  min-width: 60px;
  text-align: center;
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

/* 动画关键帧定义 */
@keyframes card-enter {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}


@keyframes points-gradient-flow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.record-reason-text {
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.6;
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

</style>
