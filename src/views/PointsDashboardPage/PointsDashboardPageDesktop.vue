<template>
  <div class="points-dashboard-container">
    <div class="header">
      <div class="header-left">
        <el-button @click="goBack" class="back-btn" type="primary" :icon="ArrowLeft" circle></el-button>
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊" class="logo" @click="toggleTheme" title="切换主题模式">
        <div class="title-section">
          <h1>积分看板</h1>
          <p>Points Dashboard</p>
        </div>
      </div>
      <div class="header-right">
        <div class="slogan">
          <img src="@/assets/QunCeQunLiChuangXingGongXing.png" alt="群策群力，创新共行" class="slogan-img">
        </div>
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
              <div class="side-card-title">优秀成员</div>
              <div class="side-card-subtitle">总积分前8名，含签到积分与积分记录（每人最多展示3条记录）</div>
            </div>
            <div class="side-card-body" v-if="topStudents.length > 0">
              <div
                v-for="(student, idx) in topStudents"
                :key="student.studentInfoId || student.placeholderId"
                class="side-student"
                :class="{ 
                  'is-placeholder': student.placeholder,
                  'rank-1': idx === 0 && !student.placeholder,
                  'rank-2': idx === 1 && !student.placeholder,
                  'rank-3': idx === 2 && !student.placeholder
                }"
              >
                <div class="side-info">
                  <div class="side-rank-badge" v-if="!student.placeholder && idx < 3">
                    <span class="rank-number">{{ idx + 1 }}</span>
                  </div>
                  <div class="side-avatar-wrapper">
                    <div class="side-avatar" :class="{ 'has-avatar': student.hasAvatar && student.avatarUrl, 'no-avatar': !student.hasAvatar || !student.avatarUrl }">
                      <img v-if="student.hasAvatar && student.avatarUrl" :src="student.avatarUrl" alt="头像" class="avatar-image" @error="handleAvatarError(student)" />
                      <el-icon v-else size="28" class="avatar-icon"><User /></el-icon>
                    </div>
                    <div class="side-name">
                      {{ student.placeholder ? '待入榜' : (student.name || `学生ID: ${student.studentInfoId}`) }}
                    </div>
                  </div>
                  <div class="side-meta" v-if="!student.placeholder">
                    <div class="meta-line meta-line-first">{{ student.college || '--' }}</div>
                    <div class="meta-line meta-line-second" v-if="student.major">{{ student.major }}</div>
                    <div class="meta-line meta-line-second" v-if="student.grade">{{ student.grade }} 年级</div>
                    <div class="meta-line meta-line-second" v-if="!student.major && !student.grade">--</div>
                  </div>
                  <div class="side-points">
                    <div class="points-total-row">
                      <span class="points-total">
                        {{ student.placeholder ? '--' : `${student.totalPoints}分` }}
                      </span>
                      <el-button 
                        v-if="!student.placeholder"
                        size="small" 
                        type="primary" 
                        plain 
                        @click="openRecordsDialog(student)"
                        class="view-records-btn"
                      >
                        <el-icon><View /></el-icon>
                        <span>查看全部记录</span>
                      </el-button>
                    </div>
                    <span class="points-detail">
                      {{ student.placeholder ? '待公布' : `总签到积分 ${student.signInPoints} · 总活动积分 ${student.activityPoints}` }}
                    </span>
                  </div>
                  <div class="side-records" v-if="!student.placeholder && topStudentRecords[student.studentInfoId]?.length">
                    <div class="record-list">
                      <div v-for="(rec, rIdx) in topStudentRecords[student.studentInfoId]" :key="rIdx" class="record-item">
                        <span class="record-points" :class="{ positive: rec.adjustPoints >= 0, negative: rec.adjustPoints < 0 }">
                          {{ rec.adjustPoints > 0 ? `+${rec.adjustPoints}` : rec.adjustPoints }}
                        </span>
                        <span class="record-reason">{{ rec.adjustReason }}</span>
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
      v-if="recordsDialogVisible"
      v-model="recordsDialogVisible"
      :title="`${currentStudent?.name || '学生'}的改分记录`"
      width="80%"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :append-to-body="true"
      :teleported="true"
      modal-class="records-dialog-overlay"
      class="records-dialog"
      @close="handleRecordsDialogClose"
    >
      <div v-if="recordsLoading" class="records-loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载中...</span>
      </div>
      <div v-else-if="allRecords.length === 0" class="records-empty">
        <el-icon><Box /></el-icon>
        <span>暂无改分记录</span>
      </div>
      <div v-else class="records-grid">
        <div
          v-for="(record, index) in allRecords"
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
import { getStudentPublicFieldValueById, getAvatarUrl } from '@/api/student'

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
const selectedTopN = 16
const totalRankingTopN = 50
const signInRanking = ref([])
const activityRanking = ref([])
const totalRanking = ref([])
const topStudents = ref([])
const topStudentRecords = ref({})
const signInLoading = ref(false)
const activityLoading = ref(false)
const totalLoading = ref(false)

// 改分记录弹窗相关
const recordsDialogVisible = ref(false)
const currentStudent = ref(null)
const allRecords = ref([])
const recordsLoading = ref(false)
const isClosingRecordsDialog = ref(false)

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

  const option = {
    tooltip: {
      show: false
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
        fontSize: 12,
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
            let line1 = item.college || '--'
            let line2 = ''
            if (item.major) {
              line2 += item.major
            }
            if (item.major && item.grade) {
              line2 += ' '
            }
            if (item.grade) {
              if (!item.major) {
                line2 += ' '
              }
              line2 += `${item.grade} 年级`
            }
            if (!line2) {
              line2 = '--'
            }
            return `${line1}\n${line2}`
          },
          fontSize: 11,
          color: isDark ? '#ffffff' : '#666',
          lineHeight: 14,
          distance: 10
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

  const option = {
    tooltip: {
      show: false
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
        fontSize: 12,
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
            let line1 = item.college || '--'
            let line2 = ''
            if (item.major) {
              line2 += item.major
            }
            if (item.major && item.grade) {
              line2 += ' '
            }
            if (item.grade) {
              if (!item.major) {
                line2 += ' '
              }
              line2 += `${item.grade} 年级`
            }
            if (!line2) {
              line2 = '--'
            }
            return `${line1}\n${line2}`
          },
          fontSize: 11,
          color: isDark ? '#ffffff' : '#666',
          lineHeight: 14,
          distance: 10
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
        fontSize: 12
      }
    },
    grid: {
      left: '0%',
      right: '15%',
      bottom: '3%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 12,
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
        fontSize: 12,
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
          fontSize: 11,
          color: isDark ? '#ffffff' : '#666',
          distance: 10
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
      // 查询必要的字段：name, grade, major, college（接口不支持studentId字段）
      const [nameResponse, gradeResponse, majorResponse, collegeResponse] = await Promise.all([
        getStudentPublicFieldValueById(studentId, 'name').catch(() => ({ code: 400, data: null })),
        getStudentPublicFieldValueById(studentId, 'grade').catch(() => ({ code: 400, data: null })),
        getStudentPublicFieldValueById(studentId, 'major').catch(() => ({ code: 400, data: null })),
        getStudentPublicFieldValueById(studentId, 'college').catch(() => ({ code: 400, data: null }))
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
      if (collegeResponse.code === 200 && collegeResponse.data) {
        item.college = collegeResponse.data
      }
      
      // 加载头像
      const avatarUrlString = getAvatarUrl(studentId)
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

const padTopStudents = (list, targetLength = 8) => {
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
      // 加载所有需要显示的学生信息（包括前16名）
      await loadStudentInfo(totalRanking.value, 'studentInfoId')
      // 从已加载信息的总排行榜中取前8名用于侧边栏显示
      const topList = totalRanking.value.slice(0, 8)
      topStudents.value = padTopStudents(topList, 8)
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

      // 加载top10的积分记录（最多3条）
      const recordPromises = topStudents.value.map(async (item) => {
        const res = await getTopAdjustRecordsByStudentInfoId(item.studentInfoId, 3).catch(() => ({ code: 400, data: [] }))
        if (res.code === 200 && Array.isArray(res.data)) {
          return { id: item.studentInfoId, records: res.data.slice(0, 3) }
        }
        return { id: item.studentInfoId, records: [] }
      })
      const recordResults = await Promise.all(recordPromises)
      const recordMap = {}
      recordResults.forEach(({ id, records }) => { recordMap[id] = records })
      topStudentRecords.value = recordMap
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
  // 重置关闭状态
  isClosingRecordsDialog.value = false
  
  // 设置当前学生
  currentStudent.value = student
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
  // 防止重复关闭
  if (isClosingRecordsDialog.value) return
  isClosingRecordsDialog.value = true
  
  // 先关闭弹窗，避免在弹窗关闭过程中触发响应式更新
  // 注意：这里不需要手动设置 recordsDialogVisible.value = false
  // 因为 @close 事件触发时，v-model 已经自动设置为 false
  
  // 使用 setTimeout(0) 延迟清空数据，确保弹窗完全关闭后再清空
  // 这样可以避免在弹窗关闭过程中触发响应式更新，造成闪烁
  setTimeout(() => {
    allRecords.value = []
    recordsLoading.value = false
    currentStudent.value = null
    isClosingRecordsDialog.value = false
  }, 0)
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
  --shadow-rank-1: 0 4px 16px rgba(251, 191, 36, 0.2), 0 2px 8px rgba(251, 191, 36, 0.1);
  --shadow-rank-2: 0 4px 16px rgba(148, 163, 184, 0.2), 0 2px 8px rgba(148, 163, 184, 0.1);
  --shadow-rank-3: 0 4px 16px rgba(217, 119, 6, 0.2), 0 2px 8px rgba(217, 119, 6, 0.1);
}

html.light {
  /* 排名前3使用彩色阴影，保持原有颜色但增强不透明度 */
  --shadow-rank-1: 0 4px 20px rgba(251, 191, 36, 0.45), 0 2px 12px rgba(251, 191, 36, 0.3), 0 1px 4px rgba(251, 191, 36, 0.2);
  --shadow-rank-2: 0 4px 20px rgba(148, 163, 184, 0.45), 0 2px 12px rgba(148, 163, 184, 0.3), 0 1px 4px rgba(148, 163, 184, 0.2);
  --shadow-rank-3: 0 4px 20px rgba(217, 119, 6, 0.45), 0 2px 12px rgba(217, 119, 6, 0.3), 0 1px 4px rgba(217, 119, 6, 0.2);
}

.points-dashboard-container {
  height: 100vh;
  overflow: hidden;
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
  padding: 10px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
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

html.dark .slogan-img {
  filter: invert(1);
}

.back-btn {
  width: 48px;
  height: 48px;
  background: var(--primary-color);
  border: none;
  box-shadow: var(--shadow-button);
}

.logo {
  width: 64px;
  height: 64px;
  cursor: pointer;
  border-radius: 16px;
}

.title-section h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-section p {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 4px 0 0 0;
  font-weight: 500;
}

.main-content[data-v-eba736f6] {
  padding: 16px 16px;
  max-width: 100%;
  width: 100%;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dashboard-layout {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.dashboard-main {
  min-width: 0;
  width: fit-content;
  max-width: 550px;
}

.ranking-tabs {
  width: 550px;
  margin-left: 0%;
  margin-top: 0%;
}

.ranking-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.ranking-arrows {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 0;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 14px;
  padding: 4px 8px;
  backdrop-filter: blur(6px);
}

html.dark .ranking-arrows {
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.ranking-arrows .el-button {
  padding: 4px;
  width: 28px;
  height: 28px;
}

.ranking-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  padding: 2px 8px;
  border-radius: 12px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  line-height: 18px;
  white-space: nowrap;
}

html.dark .ranking-label {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.ranking-topbar .color-legend {
  margin-left: auto;
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
  border-radius: 20px;
  padding: 24px;
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-lg);
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

.side-card-header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(102, 126, 234, 0.15);
  flex-shrink: 0;
}

.side-card-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-primary);
  background: linear-gradient(135deg, var(--primary-color), #00d4ff, #00f2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.8px;
  text-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
  position: relative;
  display: inline-block;
}

.side-card-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 6px;
  opacity: 0.85;
}

.side-card-body {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  gap: 12px;
  width: 100%;
  align-items: stretch;
  position: relative;
  overflow: hidden;
  flex: 1;
  min-height: 0;
}


.side-student {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
  border: 1.5px solid rgba(102, 126, 234, 0.2);
  box-shadow: var(--shadow-card), 0 2px 8px rgba(102, 126, 234, 0.1);
  position: relative;
  overflow: visible;
  min-height: 0;
  height: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: card-enter 0.6s ease-out backwards;
}

.side-student:nth-child(1) { animation-delay: 0.1s; }
.side-student:nth-child(2) { animation-delay: 0.2s; }
.side-student:nth-child(3) { animation-delay: 0.3s; }
.side-student:nth-child(4) { animation-delay: 0.4s; }
.side-student:nth-child(5) { animation-delay: 0.5s; }
.side-student:nth-child(6) { animation-delay: 0.6s; }
.side-student:nth-child(7) { animation-delay: 0.7s; }
.side-student:nth-child(8) { animation-delay: 0.8s; }

.side-student.rank-1 {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.25) 0%, rgba(245, 158, 11, 0.18) 50%, rgba(234, 179, 8, 0.15) 100%);
  border-color: rgba(251, 191, 36, 0.5);
  border-width: 2px;
  box-shadow: var(--shadow-rank-1), 0 0 20px rgba(251, 191, 36, 0.2);
  transform: scale(1.02);
  animation: card-float-gold 4s ease-in-out infinite, card-glow-breathe-gold 3s ease-in-out infinite;
}

.side-student.rank-2 {
  background: linear-gradient(135deg, rgba(148, 163, 184, 0.22) 0%, rgba(100, 116, 139, 0.16) 50%, rgba(71, 85, 105, 0.12) 100%);
  border-color: rgba(148, 163, 184, 0.45);
  border-width: 2px;
  box-shadow: var(--shadow-rank-2), 0 0 15px rgba(148, 163, 184, 0.15);
  transform: scale(1.01);
  animation: card-float-silver 4.2s ease-in-out infinite, card-glow-breathe-silver 3.2s ease-in-out infinite;
}

.side-student.rank-3 {
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.22) 0%, rgba(180, 83, 9, 0.16) 50%, rgba(154, 52, 18, 0.12) 100%);
  border-color: rgba(217, 119, 6, 0.45);
  border-width: 2px;
  box-shadow: var(--shadow-rank-3), 0 0 15px rgba(217, 119, 6, 0.15);
  transform: scale(1.01);
  animation: card-float-bronze 4.4s ease-in-out infinite, card-glow-breathe-bronze 3.4s ease-in-out infinite;
}

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

.side-avatar-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.side-avatar {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
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
  border-radius: 12px;
  position: relative;
  z-index: 0;
}

.side-avatar .avatar-icon {
  color: white;
  position: relative;
  z-index: 0;
}

.side-rank-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.side-student.rank-1 .side-rank-badge {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
  box-shadow: 0 4px 16px rgba(251, 191, 36, 0.4), 0 0 20px rgba(251, 191, 36, 0.3);
  animation: rank-badge-glow-gold 3s ease-in-out infinite;
}

.side-student.rank-2 .side-rank-badge {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 50%, #475569 100%);
  box-shadow: 0 4px 16px rgba(148, 163, 184, 0.4), 0 0 20px rgba(148, 163, 184, 0.3);
  animation: rank-badge-glow-silver 3.2s ease-in-out infinite;
}

.side-student.rank-3 .side-rank-badge {
  background: linear-gradient(135deg, #d97706 0%, #b45309 50%, #92400e 100%);
  box-shadow: 0 4px 16px rgba(217, 119, 6, 0.4), 0 0 20px rgba(217, 119, 6, 0.3);
  animation: rank-badge-glow-bronze 3.4s ease-in-out infinite;
}

.side-rank-badge .rank-number {
  font-size: 24px;
  font-weight: 900;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1;
}

.side-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  word-break: break-word;
  line-height: 1.4;
  letter-spacing: 0.2px;
  flex: 1;
  min-width: 0;
}

.side-student.rank-1 .side-name {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}

.side-student.rank-2 .side-name {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}

.side-student.rank-3 .side-name {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}

.side-meta {
  display: flex;
  flex-direction: row;
  gap: 4px;
  font-size: 12px;
  color: var(--text-primary);
  min-height: 0;
  flex-wrap: wrap;
  align-items: center;
}

.side-meta .meta-line {
  padding: 4px 10px;
  border-radius: 6px;
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
  font-size: 11px;
  white-space: nowrap;
}



.side-meta .meta-line-first {
  min-height: 0;
  font-weight: 600;
  color: var(--primary-color);
}

.side-meta .meta-line-second {
  min-height: 0;
  font-size: 11px;
  color: var(--text-secondary);
}


.side-points {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
  padding-top: 6px;
  border-top: 1px solid rgba(102, 126, 234, 0.1);
  flex-shrink: 0;
}

.points-total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}

.points-total {
  font-size: 20px;
  font-weight: 800;
  color: var(--primary-color);
  background: linear-gradient(135deg, var(--primary-color), #00d4ff, #00f2fe);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
  flex-shrink: 0;
  text-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  animation: points-gradient-flow 3s ease infinite;
}

.side-student.rank-1 .points-total {
  font-size: 22px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 8px rgba(251, 191, 36, 0.4);
  animation: points-gradient-flow 3s ease infinite;
}

.side-student.rank-2 .points-total {
  font-size: 21px;
  background: linear-gradient(135deg, #94a3b8, #64748b, #475569);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 8px rgba(148, 163, 184, 0.4);
  animation: points-gradient-flow 3.2s ease infinite;
}

.side-student.rank-3 .points-total {
  font-size: 21px;
  background: linear-gradient(135deg, #d97706, #b45309, #92400e);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 8px rgba(217, 119, 6, 0.4);
  animation: points-gradient-flow 3.4s ease infinite;
}

.points-detail {
  font-size: 11px;
  color: var(--text-secondary);
  opacity: 0.8;
  line-height: 1.4;
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
  word-break: break-all;
  line-height: 1.5;
  opacity: 0.9;
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

.ranking-arrows {
  display: flex;
  gap: 6px;
  position: absolute;
  top: 8px;
  left: 8px;
  align-items: center;
}

.ranking-arrows .el-button {
  padding: 4px;
  width: 28px;
  height: 28px;
}

.ranking-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  padding: 2px 8px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  line-height: 18px;
}

.ranking-tabs {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 20px;
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
  min-height: 320px;
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
  height: 550px;
}

.color-legend {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 8px 0 4px;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 13px;
}

.legend-dot {
  width: 12px;
  height: 12px;
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
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
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
  gap: 8px;
  font-size: 14px;
  color: var(--text-primary);
  flex-wrap: wrap;
  line-height: 1.5;
}

.formula-label {
  font-weight: 600;
  color: var(--primary-color);
  font-size: 14px;
  letter-spacing: 0.3px;
}

.formula-equals {
  color: var(--text-secondary);
  font-weight: 500;
  margin: 0 2px;
  font-size: 15px;
}

.formula-value {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(0, 242, 254, 0.12) 100%);
  padding: 4px 12px;
  border-radius: 6px;
  color: var(--primary-color);
  font-weight: 500;
  border: 1px solid rgba(102, 126, 234, 0.2);
  font-size: 13px;
}

.formula-operator {
  color: var(--text-secondary);
  font-weight: 600;
  margin: 0 4px;
  font-size: 16px;
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
  padding: 14px 18px;
  margin-bottom: 16px;
}

.formula-card.formula-mini .formula-item {
  font-size: 13px;
  gap: 6px;
}

.formula-card.formula-mini .formula-label,
.formula-card.formula-mini .formula-value,
.formula-card.formula-mini .formula-equals {
  font-size: 13px;
}

.formula-card.formula-mini .formula-value {
  padding: 3px 10px;
  font-size: 12px;
}

.formula-card.formula-mini .formula-operator {
  font-size: 14px;
  margin: 0 3px;
}

.formula-card.formula-mini .formula-desc {
  font-size: 11px;
  margin-top: 6px;
  padding-top: 10px;
}

.view-records-btn {
  font-size: 12px;
  padding: 8px 16px;
  flex-shrink: 0;
  border-radius: 8px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(0, 242, 254, 0.1) 100%);
  border: 1px solid rgba(102, 126, 234, 0.35);
  box-shadow: var(--shadow-primary);
}

.view-records-btn :deep(.el-button__inner) {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--primary-color);
}

.view-records-btn .el-icon {
  margin-right: 6px;
  font-size: 14px;
  color: var(--primary-color);
}

.view-records-btn .el-icon {
  margin-right: 4px;
}

.records-dialog :deep(.el-dialog__body) {
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
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
}

:deep(.records-dialog-overlay .el-overlay-dialog) {
  position: fixed !important;
  inset: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 3001 !important;
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.record-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(0, 242, 254, 0.05) 100%);
  border: 1px solid rgba(102, 126, 234, 0.15);
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm);
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

@keyframes rank-badge-glow-gold {
  0%, 100% {
    box-shadow: 0 4px 16px rgba(251, 191, 36, 0.4), 0 0 20px rgba(251, 191, 36, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(251, 191, 36, 0.6), 0 0 30px rgba(251, 191, 36, 0.5);
  }
}

@keyframes rank-badge-glow-silver {
  0%, 100% {
    box-shadow: 0 4px 16px rgba(148, 163, 184, 0.4), 0 0 20px rgba(148, 163, 184, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(148, 163, 184, 0.6), 0 0 30px rgba(148, 163, 184, 0.5);
  }
}

@keyframes rank-badge-glow-bronze {
  0%, 100% {
    box-shadow: 0 4px 16px rgba(217, 119, 6, 0.4), 0 0 20px rgba(217, 119, 6, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(217, 119, 6, 0.6), 0 0 30px rgba(217, 119, 6, 0.5);
  }
}

@keyframes card-float-gold {
  0%, 100% {
    transform: scale(1.02) translateY(0);
  }
  50% {
    transform: scale(1.02) translateY(-4px);
  }
}

@keyframes card-float-silver {
  0%, 100% {
    transform: scale(1.01) translateY(0);
  }
  50% {
    transform: scale(1.01) translateY(-3px);
  }
}

@keyframes card-float-bronze {
  0%, 100% {
    transform: scale(1.01) translateY(0);
  }
  50% {
    transform: scale(1.01) translateY(-3px);
  }
}

@keyframes card-glow-breathe-gold {
  0%, 100% {
    box-shadow: var(--shadow-rank-1), 0 0 20px rgba(251, 191, 36, 0.2);
  }
  50% {
    box-shadow: var(--shadow-rank-1), 0 0 30px rgba(251, 191, 36, 0.4);
  }
}

@keyframes card-glow-breathe-silver {
  0%, 100% {
    box-shadow: var(--shadow-rank-2), 0 0 15px rgba(148, 163, 184, 0.15);
  }
  50% {
    box-shadow: var(--shadow-rank-2), 0 0 25px rgba(148, 163, 184, 0.3);
  }
}

@keyframes card-glow-breathe-bronze {
  0%, 100% {
    box-shadow: var(--shadow-rank-3), 0 0 15px rgba(217, 119, 6, 0.15);
  }
  50% {
    box-shadow: var(--shadow-rank-3), 0 0 25px rgba(217, 119, 6, 0.3);
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
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.6;
  word-break: break-word;
}

</style>
