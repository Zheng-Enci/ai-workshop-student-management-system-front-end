<template>
  <div class="all-members-container">
    <div class="header">
      <div class="header-left">
        <el-button 
          type="primary" 
          circle 
          class="back-btn"
          @click="goBack"
        >
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <img 
          src="@/assets/AiWorkShop_icon.png" 
          alt="AI坊" 
          class="logo" 
          @click="toggleTheme" 
          title="切换主题模式"
        >
        <div class="title-section">
          <h1 class="main-title">在0与1之间，见证每一位创作者的光芒</h1>
        </div>
      </div>
      <div class="header-right">
        <div class="slogan">
          <img 
            src="@/assets/QunCeQunLiChuangXingGongXing.png" 
            alt="群策群力，创新共行" 
            class="slogan-img"
          >
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
                <div 
                  class="side-avatar" 
                  :class="{ 
                    'has-avatar': student.hasAvatar && student.avatarUrl, 
                    'no-avatar': !student.hasAvatar || !student.avatarUrl 
                  }"
                >
                  <img 
                    v-if="student.hasAvatar && student.avatarUrl" 
                    :src="student.avatarUrl" 
                    alt="头像" 
                    class="avatar-image" 
                    @error="handleAvatarError(student)" 
                  />
                  <el-icon v-else size="26" class="avatar-icon"><User /></el-icon>
                </div>
                <div class="side-name">
                  {{ student.placeholder ? '待入榜' : (student.name || `学生ID: ${student.studentInfoId}`) }}
                </div>
              </div>
              <div class="side-content">
                <div class="side-meta" v-if="!student.placeholder">
                  <div class="meta-line meta-line-second" v-if="student.major">
                    {{ student.major }}
                  </div>
                  <div class="meta-line meta-line-second" v-else>--</div>
                  <div class="meta-line meta-line-second" v-if="student.grade">
                    {{ formatGrade(student.grade) }}
                  </div>
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
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, User, View, Box } from '@element-plus/icons-vue'

const router = useRouter()
const topStudents = ref([])
const showQuote = ref(false)
const currentQuote = ref('')

const goBack = () => {
  router.push('/navigation')
}

const toggleTheme = () => {
  // 主题切换逻辑
}

const formatGrade = (grade) => {
  return grade
}

const handleAvatarError = () => {
  // 头像加载失败处理
}

const openRecordsDialog = () => {
  // 打开改分记录对话框
}
</script>

<style scoped>
</style>