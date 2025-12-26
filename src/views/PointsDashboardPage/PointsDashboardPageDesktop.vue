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
        <el-button @click="goToAllMembers" type="primary" size="default" plain>
          <el-icon><User /></el-icon>
          <span style="margin-left: 6px;">查看全部成员</span>
        </el-button>
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
              <div v-else class="chart-container">
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
              <div v-else class="chart-container">
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
              <div v-else class="chart-container">
                <div ref="totalChart" class="points-chart"></div>
                <div class="formula-card formula-mini">
                  <div class="formula-content">
                    <div class="formula-item">
                      <span class="formula-label">总积分</span>
                      <span class="formula-equals">=</span>
                      <span class="formula-value formula-signin">总签到积分</span>
                      <span class="formula-operator">+</span>
                      <span class="formula-value formula-activity">总活动积分</span>
                    </div>
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
              <div class="random-quote-container" v-if="topStudents.length > 0">
                <div class="random-quote" :class="{ 'fade-in': showQuote }">
                  {{ currentQuote }}
                </div>
              </div>
            </div>
            <div class="side-card-body" v-if="topStudents.length > 0">
              <div
                v-for="(student, index) in topStudents"
                :key="student.studentInfoId || student.placeholderId"
                :style="{ animationDelay: `${index * 0.05}s` }"
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
                      <img v-if="student.hasAvatar && student.avatarUrl" v-lazy="student.avatarUrl" alt="头像" class="avatar-image" @error="handleAvatarError(student)" />
                      <el-icon v-else size="26" class="avatar-icon"><User /></el-icon>
                    </div>
                    <div class="side-name">
                      {{ student.placeholder ? '待入榜' : (student.name || `学生ID: ${student.studentInfoId}`) }}
                    </div>
                  </div>
                  <div class="side-content">
                    <div class="side-meta" v-if="!student.placeholder">
                      <div class="meta-line meta-line-second" v-if="student.major">{{ student.major }}</div>
                      <div class="meta-line meta-line-second" v-else>--</div>
                      <div class="meta-line meta-line-second" v-if="student.grade">{{ formatGrade(student.grade) }}</div>
                      <div class="meta-line meta-line-second" v-else>--</div>
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
                        <el-tooltip content="查看全部改分记录" placement="top" :show-after="300">
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
                        </el-tooltip>
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
import { ElButton, ElIcon, ElDialog, ElTooltip } from 'element-plus'
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
import 'element-plus/theme-chalk/el-tooltip.css'
import 'element-plus/theme-chalk/display.css'
import { ArrowLeft, ArrowRight, Loading, Box, View, User } from '@element-plus/icons-vue'
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import {
  GridComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { getTopAdjustRecordsByStudentInfoId } from '@/api/points'
import PointsDashboardPage from './js/PointsDashboardPage'

echarts.use([
  GridComponent,
  BarChart,
  CanvasRenderer
])

const router = useRouter()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore

// 创建 PointsDashboardPage 实例
const dashboardPage = ref(new PointsDashboardPage())

const activeTab = ref('total')
const tabOrder = ['total', 'signIn', 'activity']
const tabLabelMap = {
  total: '总积分排行榜',
  signIn: '签到积分排行榜',
  activity: '活动积分排行榜'
}
const currentTabLabel = computed(() => tabLabelMap[activeTab.value] || '')
const signInRanking = ref([])
const activityRanking = ref([])
const totalRanking = ref([])
const topStudents = ref([])
const signInLoading = ref(false)
const activityLoading = ref(false)
const totalLoading = ref(false)

// 随机文案相关 - 128句技术相关激励文案
const quotes = [
  '每一行代码，都是向梦想更近一步',
  '今天的代码，是明天产品的基石',
  '不要等待需求，要主动创造价值',
  '坚持不是看到bug才修复，而是持续优化代码',
  '你的代码，终将成就更好的产品',
  '代码不会发光，发光的是写代码的你',
  '上线不是终点，bug也不是末日',
  '只有写出来的功能，没有等出来的产品',
  '相信自己，你比想象中更会编程',
  '每一次调试，都是成长的机会',
  '编程到无能为力，重构到感动自己',
  '代码虽多行则将至，bug虽难修则必成',
  '不经历bug，怎么见彩虹',
  '越写代码，越幸运',
  '成功没有捷径，只有敲代码',
  '今天的你，决定了明天的代码质量',
  '不要害怕报错，害怕的是从未尝试',
  '梦想照进现实，需要代码来实现',
  '坚持写代码就是胜利，放弃才是失败',
  '你的编程潜力无限，只待你去发掘',
  '每一次报错，都是为了更好地理解代码',
  '写代码的人，运气都不会太差',
  '相信自己，你值得拥有最好的技术栈',
  '不要停止学习新技术，不要固守旧技术',
  '成功的人找方法，失败的人找借口',
  '只有拼尽全力，才能写出优雅的代码',
  '你的坚持，终将写出好代码',
  '梦想不会逃跑，会逃跑的永远是bug',
  '努力的意义，是让自己随时有能力重构代码',
  '没有框架的孩子，必须手写代码',
  '你现在的学习，是为了将来有更多技术选择',
  '不要在该学技术的年纪选择安逸',
  '成功就是简单的代码重复优化',
  '每一个不曾写代码的日子，都是对技术的辜负',
  '你的代码，时间会给你答案',
  '不要因为走得太远，而忘记为什么写代码',
  '相信自己，没有什么功能实现不了',
  '每一次代码提交，都是对未来的投资',
  '成功不是偶然，而是持续写代码',
  '不要等待机会，要主动创造产品',
  '写代码的人，终将被技术温柔以待',
  '梦想还是要有的，万一用代码实现了呢',
  '今天的代码，是明天成功的资本',
  '不要害怕bug，bug是成长的阶梯',
  '你的代码，终将照亮前行的路',
  '坚持到底写代码，就是胜利',
  '相信自己，你比想象中更会解决问题',
  '每一次代码优化，都在为成功铺路',
  '不要轻言放弃，否则对不起代码',
  '你的坚持，终将换来成功',
  '不要停止写代码，成功就在前方',
  '相信自己，没有什么功能做不到',
  '每一次重构代码，都是突破的机会',
  '写代码的人，终将收获成功',
  '不要害怕报错，报错是成功之母',
  '你的代码，时间会证明一切',
  '相信自己，你值得拥有成功',
  '每一次代码提交，都在向目标靠近',
  '不要等待需求，要主动抓住机会',
  '你的坚持，终将成就梦想',
  '不要因为困难而放弃，要因为坚持而成功',
  '每一次学习新技术，都是对未来的投资',
  '不要停止编码，成功就在前方',
  '你的代码，终将换来回报',
  '不要害怕新技术，新技术是成长的机会',
  '每一次代码审查，都在为成功铺路',
  '不要等待机会，要主动创造产品',
  '你的坚持，终将成就更好的代码',
  '每一次提交代码，都在向梦想靠近',
  '你的代码，终将照亮前行的路',
  '不要停止学习新技术，成功就在前方',
  '每一次重构代码，都是突破的机会',
  '你的坚持，终将换来成功',
  '不要等待需求，要主动抓住机会',
  '相信自己，你值得拥有成功',
  '每一次性能优化，都在为成功铺路',
  '不要因为困难而放弃，要因为坚持而成功',
  '你的代码，时间会证明一切',
  '不要停止编码，不要回顾旧代码',
  '每一次单元测试，都在向目标靠近',
  '不要害怕新技术，新技术是成长的机会',
  '你的代码，终将换来回报',
  '不要等待机会，要主动创造产品',
  '每一次学习算法，都是对未来的投资',
  '不要因为走得太远，而忘记为什么写代码',
  '你的坚持，终将成就梦想',
  '不要轻言放弃，否则对不起代码',
  '每一次架构设计，都是突破的机会',
  '你的代码，时间会给你答案',
  '相信自己，没有什么功能做不到',
  '每一次代码提交，都在向梦想靠近',
  '你的坚持，终将成就更好的代码',
  '每一次学习设计模式，都是对未来的投资',
  '你的代码，终将换来成功',
  '相信自己，你值得拥有最好的技术',
  '每一次代码审查，都在向目标靠近',
  '写代码的人，运气都不会太差',
  '相信自己，你比想象中更会编程',
  '写代码的人，终将被技术温柔以待',
  '每一次Git提交，都是对代码质量的承诺',
  '不要害怕技术债务，重构是成长的必经之路',
  '你的代码注释，是给未来自己的礼物',
  '每一次代码Review，都在提升团队水平',
  '不要停止思考，算法是程序员的灵魂',
  '你的测试覆盖率，决定了代码的可靠性',
  '每一次性能调优，都在追求极致体验',
  '不要忽视代码规范，细节决定成败',
  '你的设计模式，让代码更优雅',
  '每一次学习新技术栈，都在拓宽技术边界',
  '不要害怕开源，分享让技术更美好',
  '你的代码架构，决定了系统的可扩展性',
  '每一次解决技术难题，都在突破自我',
  '不要停止探索，技术世界永无止境',
  '你的代码质量，体现了你的专业素养',
  '每一次技术分享，都在传播知识',
  '不要害怕挑战，复杂问题需要耐心',
  '你的代码风格，是个人品牌的体现',
  '每一次优化算法，都在追求效率',
  '不要停止实践，理论需要代码验证',
  '你的技术选型，决定了项目的未来',
  '每一次代码重构，都在追求完美',
  '不要害怕新技术，拥抱变化才能进步',
  '你的代码可读性，体现了你的责任心',
  '每一次技术突破，都在创造价值',
  '不要停止学习，技术更新日新月异',
  '你的代码文档，是团队协作的桥梁',
  '每一次技术选型，都在权衡利弊',
  '不要害怕失败，错误是最好的老师',
  '你的代码版本控制，记录了成长的轨迹'
]

const currentQuote = ref('')
const showQuote = ref(false)
let quoteTimer = null
let lastQuoteIndex = -1

// 获取随机文案（避免连续显示相同文案）
const getRandomQuote = () => {
  let randomIndex
  // 如果只有一条文案，直接返回
  if (quotes.length === 1) {
    return quotes[0]
  }
  // 确保不连续显示相同的文案
  do {
    randomIndex = Math.floor(Math.random() * quotes.length)
  } while (randomIndex === lastQuoteIndex && quotes.length > 1)
  
  lastQuoteIndex = randomIndex
  return quotes[randomIndex]
}

// 更新文案（带淡入淡出效果）
const updateQuote = () => {
  showQuote.value = false
  setTimeout(() => {
    currentQuote.value = getRandomQuote()
    showQuote.value = true
  }, 400) // 淡出时间
}

// 启动文案轮播
const startQuoteRotation = () => {
  // 立即显示第一条
  currentQuote.value = getRandomQuote()
  showQuote.value = true
  
  // 每隔一段时间刷新（5-8秒随机间隔，增加自然感）
  const scheduleNext = () => {
    const delay = 5000 + Math.random() * 3000 // 5-8秒随机
    quoteTimer = setTimeout(() => {
      updateQuote()
      scheduleNext()
    }, delay)
  }
  scheduleNext()
}

// 停止文案轮播
const stopQuoteRotation = () => {
  if (quoteTimer) {
    clearTimeout(quoteTimer)
    quoteTimer = null
  }
}

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

const goToAllMembers = () => {
  router.push('/all-members')
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
      right: '15%',
      bottom: '3%',
      top: '0%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      max: maxValue,
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
  const maxValue = sortedData.length > 0 ? sortedData[sortedData.length - 1].activityPoints : null

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
      max: maxValue,
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
  const maxValue = sortedData.length > 0 ? sortedData[sortedData.length - 1].totalPoints : null

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
      max: maxValue,
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


// 已删除 loadStudentInfo 函数，因为 PointsDashboardPage 已经返回了完整的学生信息

// 删除了冗余的 loadSignInRanking 和 loadActivityRanking 函数，现在统一使用 PointsDashboardPage 管理数据

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
    // 使用 PointsDashboardPage 获取数据（前32名）
    await dashboardPage.value.initData()
    const rankingData = dashboardPage.value.comprehensiveRankingData || []
    
    // 将数据格式化为图表所需格式，直接使用 PointsDashboardPage 返回的完整数据
    totalRanking.value = rankingData.map(student => ({
      studentInfoId: student.studentInfoId,
      name: student.name,                   // 直接使用已获取的姓名
      grade: student.grade,                  // 直接使用已获取的年级
      major: student.major,                  // 直接使用已获取的专业
      levelCode: student.levelCode,          // 直接使用已获取的等级
      hasAvatar: !!student.avatarUrl,        // 直接使用已获取的头像信息
      avatarUrl: student.avatarUrl,          // 直接使用已获取的头像URL
      signInPoints: student.attendancePoints,  // 签到积分
      activityPoints: student.activityPoints,  // 活动积分
      totalPoints: student.totalPoints         // 总积分
    }))
    
    // 侧边栏显示前32名
    const topList = totalRanking.value.slice(0, 32)
    topStudents.value = padTopStudents(topList, 32)
    
    // 初始化图表 - 显示前20名
    await nextTick()
    if (totalRanking.value.length > 0) {
      const initChartWithRetry = async (retryCount = 0) => {
        if (totalChart.value) {
          await initTotalChart(totalRanking.value.slice(0, 32))
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
  } catch (error) {
    console.error('获取综合排名数据失败:', error)
    totalRanking.value = []
  } finally {
    totalLoading.value = false
  }
}

const handleTabChange = async (tabName) => {
  await nextTick()
  if (tabName === 'signIn') {
    // 使用 PointsDashboardPage 的数据构建签到积分排行榜
    if (dashboardPage.value.comprehensiveRankingData && dashboardPage.value.comprehensiveRankingData.length > 0) {
      const rankingData = dashboardPage.value.comprehensiveRankingData
      signInRanking.value = rankingData.map(student => ({
        studentInfoId: student.studentInfoId,
        name: student.name,
        grade: student.grade,
        major: student.major,
        signInPoints: student.attendancePoints
      }))
      
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
    // 使用 PointsDashboardPage 的数据构建活动积分排行榜
    if (dashboardPage.value.comprehensiveRankingData && dashboardPage.value.comprehensiveRankingData.length > 0) {
      const rankingData = dashboardPage.value.comprehensiveRankingData
      activityRanking.value = rankingData.map(student => ({
        targetStudentInfoId: student.studentInfoId,
        name: student.name,
        grade: student.grade,
        major: student.major,
        activityPoints: student.activityPoints
      }))
      
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
          await initTotalChart(totalRanking.value.slice(0, 32))
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

// 自动刷新定时器
let refreshTimer = null

// 统一的刷新函数，根据当前激活的 tab 刷新对应的数据
const refreshData = async () => {
  // 统一使用 PointsDashboardPage 刷新数据
  await dashboardPage.value.refreshData()
  const rankingData = dashboardPage.value.comprehensiveRankingData || []
  
  // 更新总积分排行榜
  totalRanking.value = rankingData.map(student => ({
    studentInfoId: student.studentInfoId,
    name: student.name,                   // 直接使用已获取的姓名
    grade: student.grade,                  // 直接使用已获取的年级
    major: student.major,                  // 直接使用已获取的专业
    levelCode: student.levelCode,          // 直接使用已获取的等级
    hasAvatar: !!student.avatarUrl,        // 直接使用已获取的头像信息
    avatarUrl: student.avatarUrl,          // 直接使用已获取的头像URL
    signInPoints: student.attendancePoints,  // 签到积分
    activityPoints: student.activityPoints,  // 活动积分
    totalPoints: student.totalPoints         // 总积分
  }))
  
  // 更新侧边栏显示的前32名
  const topList = totalRanking.value.slice(0, 32)
  topStudents.value = padTopStudents(topList, 32)
  
  // 根据当前激活的 tab 更新对应的排行榜
  if (activeTab.value === 'signIn') {
    signInRanking.value = rankingData.map(student => ({
      studentInfoId: student.studentInfoId,
      name: student.name,
      grade: student.grade,
      major: student.major,
      signInPoints: student.attendancePoints
    }))
  } else if (activeTab.value === 'activity') {
    activityRanking.value = rankingData.map(student => ({
      targetStudentInfoId: student.studentInfoId,
      name: student.name,
      grade: student.grade,
      major: student.major,
      activityPoints: student.activityPoints
    }))
  }
}

// 启动自动刷新
const startAutoRefresh = () => {
  // 清除已存在的定时器
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
  // 设置定时器，每隔60秒（60000毫秒）刷新一次
  refreshTimer = setInterval(() => {
    refreshData()
  }, 60000)
}

// 停止自动刷新
const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
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
  
  // 恢复遮罩层样式，确保可以正常显示
  const dialogWrapper = document.querySelector('.records-dialog-overlay')
  if (dialogWrapper) {
    dialogWrapper.style.display = ''
    dialogWrapper.style.visibility = ''
    dialogWrapper.style.opacity = ''
  }
  
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
    isClosingRecordsDialog.value = false
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
  startQuoteRotation()
  // 启动自动刷新
  startAutoRefresh()
})

onUnmounted(() => {
  stopQuoteRotation()
  // 停止自动刷新
  stopAutoRefresh()
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


.points-dashboard-container {
  height: 100vh;
  overflow: hidden;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
}

.header {
	top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
	min-height: 72px;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  position: absolute;
  left: 24px;
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
  position: absolute;
  right: 24px;
  z-index: 1;
}

.slogan {
  display: flex;
  align-items: center;
  padding: 16px 16px 0 16px;
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
  border-radius: 0;
}

.title-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
}

.title-section .main-title {
  font-size: 32px;
  font-weight: 800;
  margin: 0;
  padding: 0;
  line-height: 1.2;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
  text-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  display: block;
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
  margin: 8px 0 0 0;
  font-weight: 500;
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
  margin-left: 0;
  margin-top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
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
  padding: 0 24px 24px 24px;
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-lg);
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

.side-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  margin-top: 1%;
  padding-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(102, 126, 234, 0.15);
  flex-shrink: 0;
  position: relative;
}

.random-quote-container {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: fit-content;
  padding: 12px 18px;
  background: transparent;
  border-radius: 12px;
  border: none;
  backdrop-filter: none;
  box-shadow: none;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 0;
}

.random-quote {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.8;
  text-align: right;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  font-weight: 500;
  letter-spacing: 1px;
  word-break: break-word;
  overflow-wrap: break-word;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.random-quote.fade-in {
  opacity: 0.95;
}

.card-header-left {
  display: flex;
  flex-direction: column;
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
  letter-spacing: 1px;
  text-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
  position: relative;
  display: inline-block;
}

.side-card-subtitle {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 4px;
  opacity: 0.85;
}

.side-card-body {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
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

/* 积分看板块对角线光影扫过效果 */
.side-card-body::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    135deg,
    transparent 30%,
    rgba(255, 255, 255, 0.15) 50%,
    transparent 70%
  );
  transform: translate(-100%, -100%);
  animation: diagonal-sweep 3s ease-in-out infinite;
  pointer-events: none;
  z-index: 10;
}

@keyframes diagonal-sweep {
  0% {
    transform: translate(-100%, -100%);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translate(100%, 100%);
    opacity: 0;
  }
}


.side-student {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 12px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
  box-shadow: var(--shadow-card), 0 2px 8px rgba(102, 126, 234, 0.1);
  position: relative;
  overflow: visible;
  min-height: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: card-enter 0.6s ease-out backwards;
}

.side-student::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 10px;
  padding: 2px;
  background: linear-gradient(135deg, transparent 0%, transparent 60%, rgba(102, 126, 234, 0.08) 100%);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: 0;
}

.side-student.level-club-member {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%);
}

.side-student.level-club-member::before {
  background: linear-gradient(135deg, transparent 0%, transparent 60%, rgba(59, 130, 246, 0.12) 100%);
}

.side-student.level-normal-member {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.06) 100%);
}

.side-student.level-normal-member::before {
  background: linear-gradient(135deg, transparent 0%, transparent 60%, rgba(34, 197, 94, 0.12) 100%);
}

.side-student.level-core-member {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.12) 0%, rgba(251, 191, 36, 0.06) 100%);
}

.side-student.level-core-member::before {
  background: linear-gradient(135deg, transparent 0%, transparent 60%, rgba(251, 191, 36, 0.12) 100%);
}

.side-student.level-admin {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.06) 100%);
}

.side-student.level-admin::before {
  background: linear-gradient(135deg, transparent 0%, transparent 60%, rgba(239, 68, 68, 0.12) 100%);
}


.side-student.is-placeholder {
  opacity: 0.6;
  box-shadow: none;
  background: rgba(255, 255, 255, 0.02);
  border: 2px dashed rgba(102, 126, 234, 0.2);
}

.side-student.is-placeholder::before {
  display: none;
}



.side-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  gap: 7px;
  margin-bottom: 0;
}

.side-avatar {
  width: 56px;
  height: 56px;
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
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  word-break: break-word;
  line-height: 1.3;
  letter-spacing: 0;
  flex: 1;
  min-width: 0;
}


.side-content {
  display: flex;
  flex-direction: column;
  gap: 9px;
  flex: 1;
  min-width: 0;
}

.side-meta {
  display: flex;
  flex-direction: row;
  gap: 4px;
  font-size: 10px;
  color: var(--text-primary);
  min-height: 0;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.side-meta .meta-line {
  padding: 2px 4px;
  border-radius: 4px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(0, 242, 254, 0.08) 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
  line-height: 1.3;
  cursor: default;
  width: fit-content;
  flex: 0 0 auto;
  box-sizing: border-box;
  font-weight: 500;
  box-shadow: var(--shadow-primary);
  position: relative;
  font-size: 10px;
  white-space: nowrap;
  text-align: center;
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
  gap: 16px;
  flex: 1;
  min-width: 0;
  padding: 0;
  border-bottom: none;
  align-items: center;
}

.unified-legend .legend-section {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.unified-legend .legend-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 12px;
}

.unified-legend .legend-dot {
  width: 10px;
  height: 10px;
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
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.unified-legend .hint-icon {
  font-size: 14px;
  color: var(--primary-color);
  flex-shrink: 0;
}


.side-points {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-top: 7px;
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
  gap: 4px;
  flex-wrap: nowrap;
  flex: 1;
  min-width: 0;
}

.points-total {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0;
  flex-shrink: 0;
}

.points-equals {
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
  margin: 0 1px;
}

.points-plus {
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
  margin: 0 1px;
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


.points-number {
  font-weight: 700;
  font-size: 11px;
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

.points-placeholder {
  font-size: 11px;
  color: var(--text-secondary);
  opacity: 0.6;
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

.ranking-arrows {
  display: flex;
  gap: 6px;
  position: absolute;
  top: 8px;
  left: 8px;
  align-items: center;
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

.ranking-list-container {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.chart-container {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
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

.points-chart {
  width: 100%;
  flex: 1;
  min-height: 400px;
  position: relative;
}

.color-legend {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0 0 8px 0;
  flex-shrink: 0;
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
  letter-spacing: 0;
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
  flex-shrink: 0;
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

.formula-card.formula-mini .formula-signin {
  background-color: rgba(64, 158, 255, 0.15);
  padding: 2px 6px;
  border-radius: 4px;
}

.formula-card.formula-mini .formula-activity {
  background-color: rgba(250, 173, 20, 0.15);
  padding: 2px 6px;
  border-radius: 4px;
}

.formula-card.formula-mini .formula-desc {
  font-size: 11px;
  margin-top: 6px;
  padding-top: 10px;
}

.view-records-btn {
  width: 24px;
  height: 24px;
  padding: 0;
  flex-shrink: 0;
  backdrop-filter: blur(10px);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(0, 242, 254, 0.1) 100%);
  border: 1px solid rgba(102, 126, 234, 0.35);
  box-shadow: var(--shadow-primary);
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


@keyframes points-gradient-flow {
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

.record-reason-text {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.6;
  word-break: break-word;
}

</style>
