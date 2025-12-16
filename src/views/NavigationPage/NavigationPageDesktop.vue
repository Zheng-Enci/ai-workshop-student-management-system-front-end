<template>
  <div class="navigation-container">
    <div class="background-effects">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>
    
    <div class="header">
      <div class="header-top">
        <div class="header-left">
        <el-button @click="goToHome" class="home-btn" type="primary" :icon="House" circle></el-button>
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊学生管理系统" class="logo" @click="toggleTheme" title="切换主题模式">
        <div class="title-section">
          <h1>AI坊学生管理系统</h1>
          <p>人工智能创作坊</p>
        </div>
      </div>
      
        <div class="header-center">
          <div class="page-title-wrapper">
            <div class="page-title">功能导航</div>
          </div>
        </div>
        
        <div class="header-right">
          <el-button type="danger" @click="handleLogout" class="logout-btn" plain>
            <el-icon><SwitchButton /></el-icon>
            退出登录
          </el-button>
        </div>
      </div>
    </div>
    
    <div class="main-content">
      <div class="center-hub-layout">
        <div class="center-info-card">
          <div class="center-left-section">
            <div class="center-avatar" @click="handleAvatarClick" :class="{ 'has-avatar': hasAvatar, 'no-avatar': !hasAvatar }">
              <img v-if="hasAvatar && avatarUrl" :src="avatarUrl" alt="用户头像" class="avatar-image" />
              <el-icon v-else size="32" class="avatar-icon"><User /></el-icon>
              <div v-if="avatarLoading" class="avatar-loading">
                <el-icon class="loading-icon"><Loading /></el-icon>
              </div>
            </div>
            <div class="center-user-info">
              <div class="center-user-name">{{ userStore.userInfo?.name || '学生' }}</div>
              <div class="center-user-level" :class="getLevelClass(userStore.studentLevel?.levelCode)" v-if="userStore.studentLevel">
                <el-icon class="level-icon" size="14"><Star /></el-icon>
                <span>{{ getLevelName(userStore.studentLevel.levelCode) }}</span>
              </div>
              <div class="center-attendance" v-if="attendanceCount !== null">
                <el-icon class="attendance-icon" size="16"><Calendar /></el-icon>
                <span>已签到 {{ attendanceCount }} 次</span>
              </div>
            </div>
          </div>
          
          <div class="center-points-section" v-if="!pointsLoading && (totalPoints !== null || signInPoints !== null || activityPoints !== null)">
            <div class="center-points-grid">
              <div class="center-point-item total-points">
                <div class="center-point-icon">
                  <el-icon size="20"><Coin /></el-icon>
                </div>
                <div class="center-point-info">
                  <div class="center-point-label">总积分</div>
                  <div class="center-point-value">{{ totalPoints !== null ? totalPoints : 0 }}</div>
                </div>
              </div>
              <div class="center-point-item activity-points">
                <div class="center-point-icon">
                  <el-icon size="20"><Trophy /></el-icon>
                </div>
                <div class="center-point-info">
                  <div class="center-point-label">活动积分</div>
                  <div class="center-point-value">{{ activityPoints !== null ? activityPoints : 0 }}</div>
                </div>
              </div>
              <div class="center-point-item signin-points">
                <div class="center-point-icon">
                  <el-icon size="20"><Calendar /></el-icon>
                </div>
                <div class="center-point-info">
                  <div class="center-point-label">签到积分</div>
                  <div class="center-point-value">{{ signInPoints !== null ? signInPoints : 0 }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="navigation-sections">
          <!-- 个人中心分组 -->
          <div class="nav-section">
            <div class="section-header">
              <div class="section-title">
                <el-icon class="section-icon"><User /></el-icon>
                <span>个人中心</span>
              </div>
              <div class="section-divider"></div>
            </div>
            <div class="navigation-grid">
              <div class="nav-card" @click="goToAttendance">
                <div class="nav-icon">
                  <el-icon size="28"><Check /></el-icon>
                </div>
                <div class="nav-content">
                  <div class="nav-label">签到记录</div>
                  <div class="nav-description">查看签到历史记录</div>
                </div>
              </div>
              
              <div class="nav-card" @click="showProfile">
                <div class="nav-icon">
                  <el-icon size="28"><User /></el-icon>
                </div>
                <div class="nav-content">
                  <div class="nav-label">个人信息</div>
                  <div class="nav-description">编辑个人资料信息</div>
                </div>
              </div>
              
              <div class="nav-card" @click="goToScoreChangeRecords">
                <div class="nav-icon">
                  <el-icon size="28"><Document /></el-icon>
                </div>
                <div class="nav-content">
                  <div class="nav-label">改分记录</div>
                  <div class="nav-description">查看所有积分调整记录</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 数据查看分组 -->
          <div class="nav-section">
            <div class="section-header">
              <div class="section-title">
                <el-icon class="section-icon"><DataAnalysis /></el-icon>
                <span>数据查看</span>
              </div>
              <div class="section-divider"></div>
            </div>
            <div class="navigation-grid grid-4-cols">
              <div class="nav-card" @click="goToDashboard">
                <div class="nav-icon">
                  <el-icon size="28"><DataAnalysis /></el-icon>
                </div>
                <div class="nav-content">
                  <div class="nav-label">数据看板</div>
                  <div class="nav-description">查看数据统计图表</div>
                </div>
              </div>
              
              <div class="nav-card" @click="goToAttendanceAnalysis">
                <div class="nav-icon">
                  <el-icon size="28"><TrendCharts /></el-icon>
                </div>
                <div class="nav-content">
                  <div class="nav-label">签到分析</div>
                  <div class="nav-description">查看签到时段分析</div>
                </div>
              </div>
              
              <div class="nav-card" @click="goToPointsDashboard">
                <div class="nav-icon">
                  <el-icon size="28"><Trophy /></el-icon>
                </div>
                <div class="nav-content">
                  <div class="nav-label">积分看板</div>
                  <div class="nav-description">查看积分排行榜</div>
                </div>
              </div>
              
              <div class="nav-card" @click="goToAllMembers">
                <div class="nav-icon">
                  <el-icon size="28"><UserFilled /></el-icon>
                </div>
                <div class="nav-content">
                  <div class="nav-label">查看全部成员</div>
                  <div class="nav-description">查看所有成员信息</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 管理功能分组（管理员可见） -->
          <div class="nav-section" v-if="isAdmin">
            <div class="section-header">
              <div class="section-title">
                <el-icon class="section-icon"><UserFilled /></el-icon>
                <span>管理功能</span>
              </div>
              <div class="section-divider"></div>
            </div>
            <div class="navigation-grid">
              <div class="nav-card" @click="goToAdmin">
                <div class="nav-icon">
                  <el-icon size="28"><UserFilled /></el-icon>
                </div>
                <div class="nav-content">
                  <div class="nav-label">学生管理</div>
                  <div class="nav-description">管理学生信息</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElButton, ElIcon } from 'element-plus'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-popper.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import { Check, User, DataAnalysis, SwitchButton, Calendar, Star, UserFilled, House, TrendCharts, Trophy, Coin, Document, Loading } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { getStudentLevel, getStudentDatabaseTableId, getAvatarUrl } from '@/api/student'
import { getMyAttendanceCount } from '@/api/attendance'
import { getTotalPointsByStudentInfoId } from '@/api/points'

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore
const attendanceCount = ref(null)
const signInPoints = ref(null)
const activityPoints = ref(null)
const totalPoints = ref(null)
const pointsLoading = ref(false)
const avatarUrl = ref(null)
const hasAvatar = ref(false)
const avatarLoading = ref(false)
const avatarTipShown = ref(false)

const isAdmin = computed(() => {
  return userStore.studentLevel?.levelCode === 3
})

const getLevelName = (levelCode) => {
  const levelMap = {
    0: '社团成员',
    1: '普通成员', 
    2: '核心成员',
    3: '管理员'
  }
  return levelMap[levelCode] || '未知等级'
}

const getLevelClass = (levelCode) => {
  const levelClassMap = {
    0: 'club-member',
    1: 'normal-member',
    2: 'core-member',
    3: 'admin'
  }
  return levelClassMap[levelCode] || 'club-member'
}

const goToAttendance = () => {
  router.push('/attendance')
}

const goToHome = () => {
  router.push('/')
}

const showProfile = () => {
  router.push('/profile')
}

const handleAvatarClick = () => {
  router.push('/profile/desktop')
}

const goToDashboard = () => {
  router.push('/dashboard')
}

const goToAttendanceAnalysis = () => {
  router.push('/attendance-analysis')
}

const goToPointsDashboard = () => {
  router.push('/points-dashboard')
}

const goToAllMembers = () => {
  router.push('/all-members')
}

const goToScoreChangeRecords = () => {
  router.push('/score-change-records')
}

const goToAdmin = () => {
  router.push('/student-manager')
}

const loadAttendanceCount = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return

    const response = await getMyAttendanceCount(token)
    if (response.code === 200) {
      attendanceCount.value = response.data.count
      // 计算签到积分：签到次数 × 0.64（四舍五入）
      signInPoints.value = Math.round(response.data.count * 0.64)
    }
  } catch (error) {
    if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      router.push('/login')
    }
  }
}

const loadPoints = async () => {
  try {
    pointsLoading.value = true
    const token = localStorage.getItem('token')
    if (!token) {
      pointsLoading.value = false
      return
    }

    // 并行加载签到次数和学生数据库ID
    const [attendanceResponse, studentIdResponse] = await Promise.all([
      getMyAttendanceCount(token).catch(() => ({ code: 0, data: { count: 0 } })),
      getStudentDatabaseTableId(token).catch(() => ({ code: 0, data: null }))
    ])

    // 计算签到积分
    if (attendanceResponse.code === 200) {
      signInPoints.value = Math.round(attendanceResponse.data.count * 0.64)
    } else {
      signInPoints.value = 0
    }

    // 获取活动积分
    if (studentIdResponse.code === 200 && studentIdResponse.data) {
      const activityResponse = await getTotalPointsByStudentInfoId(studentIdResponse.data).catch(() => ({ code: 0, data: 0 }))
      if (activityResponse.code === 200) {
        activityPoints.value = activityResponse.data || 0
      } else {
        activityPoints.value = 0
      }
    } else {
      activityPoints.value = 0
    }

    // 计算总积分
    totalPoints.value = (signInPoints.value || 0) + (activityPoints.value || 0)
  } catch (error) {
    if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      router.push('/login')
    } else {
      // 发生错误时设置为0，避免显示null
      signInPoints.value = 0
      activityPoints.value = 0
      totalPoints.value = 0
    }
  } finally {
    pointsLoading.value = false
  }
}

const loadStudentLevel = async () => {
  try {
    if (!userStore.userInfo?.studentId) return

    const response = await getStudentLevel(userStore.userInfo.studentId)
    if (response.code === 200) {
      userStore.setStudentLevel(response.data)
    }
  } catch (error) {
    return
  }
}

const showDefaultAvatar = () => {
  hasAvatar.value = false
  avatarUrl.value = null
  // 显示提示消息（只显示一次）
  if (!avatarTipShown.value) {
    ElMessage.info({
      message: '您还没有上传头像，点击头像前往个人信息页面上传',
      duration: 4000,
      showClose: true
    })
    avatarTipShown.value = true
  }
}

const loadUserAvatar = async () => {
  try {
    avatarLoading.value = true
    const token = localStorage.getItem('token')
    if (!token) {
      showDefaultAvatar()
      avatarLoading.value = false
      return
    }

    // 获取学生数据库ID
    const idResponse = await getStudentDatabaseTableId(token)
    if (idResponse.code !== 200 || !idResponse.data) {
      showDefaultAvatar()
      avatarLoading.value = false
      return
    }

    const studentInfoId = idResponse.data
    const avatarUrlString = getAvatarUrl(studentInfoId)
    
    if (!avatarUrlString) {
      showDefaultAvatar()
      avatarLoading.value = false
      return
    }

    // 使用fetch检测头像是否存在（更可靠的方式）
    try {
      const response = await fetch(avatarUrlString, { method: 'GET' })
      if (response.ok) {
        const contentType = response.headers.get('content-type')
        // 检查响应是否为图片类型
        if (contentType && contentType.startsWith('image/')) {
          // 头像存在，使用Image对象加载
          const img = new Image()
          img.onload = () => {
            avatarUrl.value = avatarUrlString
            hasAvatar.value = true
            avatarLoading.value = false
          }
          img.onerror = () => {
            showDefaultAvatar()
            avatarLoading.value = false
          }
          img.src = avatarUrlString
        } else {
          // 返回的不是图片（可能是JSON错误信息），头像不存在
          showDefaultAvatar()
          avatarLoading.value = false
        }
      } else {
        // 响应状态码不是200（可能是400），头像不存在
        showDefaultAvatar()
        avatarLoading.value = false
      }
    } catch (fetchError) {
      // fetch失败，可能是网络错误或CORS问题，使用Image对象作为fallback
      const img = new Image()
      img.onload = () => {
        avatarUrl.value = avatarUrlString
        hasAvatar.value = true
        avatarLoading.value = false
      }
      img.onerror = () => {
        showDefaultAvatar()
        avatarLoading.value = false
      }
      img.src = avatarUrlString
    }
  } catch (error) {
    if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      router.push('/login')
    } else {
      showDefaultAvatar()
    }
    avatarLoading.value = false
  }
}

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/login')
}

onMounted(() => {
  loadAttendanceCount()
  loadStudentLevel()
  loadPoints()
  loadUserAvatar()
})
</script>

<style scoped>
.navigation-container {
  min-height: 100vh;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.background-effects {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: float 20s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  top: 60%;
  right: 10%;
  animation-delay: -7s;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  bottom: 20%;
  left: 50%;
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-30px) rotate(120deg); }
  66% { transform: translateY(30px) rotate(240deg); }
}

.header {
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 60px;
  position: relative;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--primary-color);
  border: none;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.25);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.home-btn .el-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-btn .el-icon svg {
  width: 100%;
  height: 100%;
}

.home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.35);
}

.logo {
  width: 56px;
  height: 56px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0;
}

.logo:hover {
  transform: scale(1.05) rotate(3deg);
  filter: brightness(1.15);
}

.title-section h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.title-section p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 4px 0 0 0;
  font-weight: 500;
}

.page-title-wrapper {
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
  padding: 12px 32px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
  border-radius: 24px;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 0 0 1px rgba(102, 126, 234, 0.1);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.page-title-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.page-title-wrapper:hover::before {
  left: 100%;
}

.page-title-wrapper:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.12));
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 
    0 12px 48px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 0 0 1px rgba(102, 126, 234, 0.2),
    0 0 40px rgba(102, 126, 234, 0.15);
  transform: translateY(-3px) scale(1.02);
}

.page-title-badge {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  box-shadow: 
    0 0 16px rgba(102, 126, 234, 1),
    0 0 32px rgba(102, 126, 234, 0.6),
    inset 0 1px 2px rgba(255, 255, 255, 0.3);
  animation: badge-pulse 2.5s ease-in-out infinite;
  flex-shrink: 0;
  position: relative;
}

.page-title-badge::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(102, 126, 234, 0.4);
  animation: badge-ripple 2.5s ease-in-out infinite;
}

.page-title {
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 4px;
  text-transform: uppercase;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  position: relative;
  animation: gradient-shift 5s ease-in-out infinite;
  white-space: nowrap;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.page-title-accent {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #764ba2, #667eea);
  box-shadow: 
    0 0 16px rgba(118, 75, 162, 1),
    0 0 32px rgba(118, 75, 162, 0.6),
    inset 0 1px 2px rgba(255, 255, 255, 0.3);
  animation: badge-pulse 2.5s ease-in-out infinite 0.6s;
  flex-shrink: 0;
  position: relative;
}

.page-title-accent::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(118, 75, 162, 0.4);
  animation: badge-ripple 2.5s ease-in-out infinite 0.6s;
}

@keyframes badge-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

@keyframes badge-ripple {
  0% {
    width: 10px;
    height: 10px;
    opacity: 1;
  }
  100% {
    width: 30px;
    height: 30px;
    opacity: 0;
  }
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
    filter: brightness(1);
  }
  50% {
    background-position: 100% 50%;
    filter: brightness(1.15);
  }
}

.main-content {
  position: relative;
  z-index: 10;
  padding: 40px 60px 60px 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 300px);
  overflow: visible;
}

.center-hub-layout {
  position: relative;
  width: 100%;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
  margin: 0 auto;
}

.center-info-card {
  width: 100%;
  max-width: 900px;
  padding: 32px 40px;
  background: transparent;
  border-radius: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  z-index: 10;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.center-left-section {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.center-avatar {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  flex-shrink: 0;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.center-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
}

.center-avatar.has-avatar {
  background: transparent;
}

.center-avatar.no-avatar {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.avatar-icon {
  color: white;
}


.avatar-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
}

.loading-icon {
  font-size: 24px;
  color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.center-user-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

.center-user-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  text-align: left;
}

.center-user-level {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
}

.center-user-level.club-member {
  color: var(--info-color);
}

.center-user-level.normal-member {
  color: var(--success-color);
}

.center-user-level.core-member {
  color: var(--warning-color);
}

.center-user-level.admin {
  color: var(--danger-color);
}

.center-points-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-left: 32px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.center-points-grid {
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;
}

.center-point-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  transition: all 0.3s ease;
  min-width: 90px;
}

.center-point-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-4px);
}

.center-point-item.total-points {
  border-top: 3px solid #667eea;
}

.center-point-item.activity-points {
  border-top: 3px solid #ffc107;
}

.center-point-item.signin-points {
  border-top: 3px solid #4caf50;
}

.center-point-icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.center-point-item.total-points .center-point-icon {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
}

.center-point-item.activity-points .center-point-icon {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.center-point-item.signin-points .center-point-icon {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.center-point-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.center-point-label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.center-point-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.center-attendance {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
}

.navigation-sections {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 0 20px;
}

.nav-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
  flex-shrink: 0;
}

.section-icon {
  font-size: 20px;
  color: #667eea;
  flex-shrink: 0;
}

.section-divider {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.3) 0%, rgba(102, 126, 234, 0.1) 50%, transparent 100%);
  position: relative;
}

.section-divider::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.4);
  box-shadow: 0 0 12px rgba(102, 126, 234, 0.6);
}

.navigation-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.navigation-grid.grid-4-cols {
  grid-template-columns: repeat(4, 1fr);
}

.nav-card {
  padding: 28px 24px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.nav-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  opacity: 0;
  transition: opacity 0.4s ease;
}

.nav-card:hover::before {
  opacity: 1;
}

.nav-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
}

.nav-icon {
  position: relative;
  z-index: 2;
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-card:hover .nav-icon {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
}

.nav-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  width: 100%;
}

.nav-label {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
}

.nav-description {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  opacity: 0.85;
}

.nav-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-card:hover .nav-icon {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
}



.header-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.logout-btn {
  padding: 10px 28px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--danger-color) !important;
  border-color: var(--danger-color) !important;
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 108, 108, 0.25);
  background-color: var(--danger-color) !important;
  color: white !important;
}
</style>

<style>
.dark .logout-btn.el-button--danger.is-plain {
  color: #ffffff !important;
  border-color: #000000 !important;
  background-color: #000000 !important;
}

.dark .logout-btn.el-button--danger.is-plain:hover {
  background-color: #000000 !important;
  color: white !important;
  border-color: #000000 !important;
}
</style>

