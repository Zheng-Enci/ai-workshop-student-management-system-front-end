<template>
  <div class="navigation-container">
    <div class="background-effects">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>
    
    <div class="header">
      <div class="header-content">
        <el-button @click="goToHome" class="home-btn" type="primary" :icon="House" circle></el-button>
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊学生管理系统" class="logo" @click="toggleTheme" title="切换主题模式">
        <div class="title-section">
          <h1>AI坊学生管理系统</h1>
          <p>人工智能创作坊</p>
        </div>
      </div>
      
      <div class="user-profile">
        <div class="user-avatar" @click="showProfile" :class="{ 'has-avatar': hasAvatar, 'no-avatar': !hasAvatar }">
          <img v-if="hasAvatar && avatarUrl" :src="avatarUrl" alt="用户头像" class="avatar-image" />
          <el-icon v-else size="28" class="avatar-icon"><User /></el-icon>
          <div v-if="avatarLoading" class="avatar-loading">
            <el-icon class="loading-icon"><Loading /></el-icon>
          </div>
        </div>
        <div class="user-details">
          <div class="user-name">{{ userStore.userInfo?.name || '学生' }}</div>
          <div class="user-level" :class="getLevelClass(userStore.studentLevel?.levelCode)" v-if="userStore.studentLevel">
            <el-icon class="level-icon"><Star /></el-icon>
            <span>{{ getLevelName(userStore.studentLevel.levelCode) }}</span>
          </div>
          <div class="attendance-count" v-if="attendanceCount !== null">
            <el-icon class="attendance-icon"><Calendar /></el-icon>
            <span>已签到 {{ attendanceCount }} 次</span>
          </div>
        </div>
      </div>
      
      <div class="points-display" v-if="!pointsLoading && (totalPoints !== null || signInPoints !== null || activityPoints !== null)">
        <div class="points-card total-points">
          <div class="points-icon">
            <el-icon size="16"><Coin /></el-icon>
          </div>
          <div class="points-content">
            <div class="points-label">总积分</div>
            <div class="points-value">{{ totalPoints !== null ? totalPoints : 0 }}</div>
          </div>
        </div>
        <div class="points-card activity-points">
          <div class="points-icon">
            <el-icon size="16"><Trophy /></el-icon>
          </div>
          <div class="points-content">
            <div class="points-label">活动积分</div>
            <div class="points-value">{{ activityPoints !== null ? activityPoints : 0 }}</div>
          </div>
        </div>
        <div class="points-card signin-points">
          <div class="points-icon">
            <el-icon size="16"><Calendar /></el-icon>
          </div>
          <div class="points-content">
            <div class="points-label">签到积分</div>
            <div class="points-value">{{ signInPoints !== null ? signInPoints : 0 }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="main-content">
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
          <div class="feature-grid">
            <div class="feature-card primary-card" @click="goToAttendance">
              <div class="card-background"></div>
              <div class="card-content">
                <div class="card-icon">
                  <el-icon size="32"><Check /></el-icon>
                </div>
                <div class="card-text">
                  <h3>学生签到</h3>
                  <p>进行AI坊实践签到</p>
                </div>
                <div class="card-arrow">
                  <el-icon><ArrowRight /></el-icon>
                </div>
              </div>
            </div>
            
            <div class="feature-card" @click="showProfile">
              <div class="card-background"></div>
              <div class="card-content">
                <div class="card-icon">
                  <el-icon size="28"><User /></el-icon>
                </div>
                <div class="card-text">
                  <h3>个人信息</h3>
                  <p>编辑个人资料信息</p>
                </div>
                <div class="card-arrow">
                  <el-icon><ArrowRight /></el-icon>
                </div>
              </div>
            </div>
            
            <div class="feature-card" @click="goToScoreChangeRecords">
              <div class="card-background"></div>
              <div class="card-content">
                <div class="card-icon">
                  <el-icon size="28"><Document /></el-icon>
                </div>
                <div class="card-text">
                  <h3>改分记录</h3>
                  <p>查看所有积分调整记录</p>
                </div>
                <div class="card-arrow">
                  <el-icon><ArrowRight /></el-icon>
                </div>
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
          <div class="feature-grid">
            <div class="feature-card" @click="goToDashboard">
              <div class="card-background"></div>
              <div class="card-content">
                <div class="card-icon">
                  <el-icon size="28"><DataAnalysis /></el-icon>
                </div>
                <div class="card-text">
                  <h3>数据看板</h3>
                  <p>查看数据统计图表</p>
                </div>
                <div class="card-arrow">
                  <el-icon><ArrowRight /></el-icon>
                </div>
              </div>
            </div>
            
            <div class="feature-card" @click="goToAttendanceAnalysis">
              <div class="card-background"></div>
              <div class="card-content">
                <div class="card-icon">
                  <el-icon size="28"><TrendCharts /></el-icon>
                </div>
                <div class="card-text">
                  <h3>签到分析</h3>
                  <p>查看签到时段分析</p>
                </div>
                <div class="card-arrow">
                  <el-icon><ArrowRight /></el-icon>
                </div>
              </div>
            </div>
            
            <div class="feature-card" @click="goToPointsDashboard">
              <div class="card-background"></div>
              <div class="card-content">
                <div class="card-icon">
                  <el-icon size="28"><Trophy /></el-icon>
                </div>
                <div class="card-text">
                  <h3>积分看板</h3>
                  <p>查看积分排行榜</p>
                </div>
                <div class="card-arrow">
                  <el-icon><ArrowRight /></el-icon>
                </div>
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
          <div class="feature-grid">
            <div class="feature-card admin-card" @click="goToAdmin">
              <div class="card-background"></div>
              <div class="card-content">
                <div class="card-icon">
                  <el-icon size="28"><UserFilled /></el-icon>
                </div>
                <div class="card-text">
                  <h3>学生管理</h3>
                  <p>管理学生信息</p>
                </div>
                <div class="card-arrow">
                  <el-icon><ArrowRight /></el-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <el-button type="danger" @click="handleLogout" class="logout-btn" plain>
        <el-icon><SwitchButton /></el-icon>
        退出登录
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElButton, ElIcon } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import { Check, User, DataAnalysis, SwitchButton, Calendar, Star, UserFilled, House, TrendCharts, ArrowRight, Trophy, Coin, Document, Loading } from '@element-plus/icons-vue'
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

const goToDashboard = () => {
  router.push('/dashboard')
}

const goToAttendanceAnalysis = () => {
  router.push('/attendance-analysis')
}

const goToPointsDashboard = () => {
  router.push('/points-dashboard')
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
    ElMessage({
      message: '您还没有上传头像，请前往个人信息页面上传头像',
      type: 'info',
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
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  top: 60%;
  right: 10%;
  animation-delay: -7s;
}

.orb-3 {
  width: 180px;
  height: 180px;
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
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  margin-top: 20px;
  position: relative;
}

.home-btn {
  position: absolute;
  top: 0;
  left: 0;
  width: 44px;
  height: 44px;
  background: var(--primary-color);
  border: none;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  z-index: 10;
}

.logo {
  width: 56px;
  height: 56px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
}

.logo:active {
  transform: scale(0.95);
  filter: brightness(1.2);
}

.title-section h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-section p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 4px 0 0 0;
  font-weight: 500;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  flex-shrink: 0;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  touch-action: manipulation;
}

.user-avatar:active {
  transform: scale(0.95);
}

.user-avatar.has-avatar {
  background: transparent;
}

.user-avatar.no-avatar {
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
  font-size: 18px;
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

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  word-break: break-word;
}

.user-level {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.user-level.club-member {
  color: var(--info-color);
}

.user-level.normal-member {
  color: var(--success-color);
}

.user-level.core-member {
  color: var(--warning-color);
}

.user-level.admin {
  color: var(--danger-color);
}

.attendance-count {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-secondary);
}

.points-display {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-top: 16px;
  padding: 0 20px;
}

.points-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  touch-action: manipulation;
  flex: 1;
  min-width: 0;
}

.points-card:active {
  transform: scale(0.98);
  background: rgba(255, 255, 255, 0.12);
}

.points-card.total-points {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
  border-color: rgba(102, 126, 234, 0.3);
}

.points-card.total-points:active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
}

.points-card.activity-points {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 152, 0, 0.15));
  border-color: rgba(255, 193, 7, 0.3);
}

.points-card.activity-points:active {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.2), rgba(255, 152, 0, 0.2));
}

.points-card.signin-points {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(56, 142, 60, 0.15));
  border-color: rgba(76, 175, 80, 0.3);
}

.points-card.signin-points:active {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(56, 142, 60, 0.2));
}

.points-icon {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  flex-shrink: 0;
}

.points-card.total-points .points-icon {
  background: rgba(102, 126, 234, 0.25);
  color: #667eea;
}

.points-card.activity-points .points-icon {
  background: rgba(255, 193, 7, 0.25);
  color: #ffc107;
}

.points-card.signin-points .points-icon {
  background: rgba(76, 175, 80, 0.25);
  color: #4caf50;
}

.points-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
  width: 100%;
}

.points-label {
  font-size: 10px;
  color: var(--text-secondary);
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
}

.points-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
  word-break: break-word;
  text-align: center;
}

.main-content {
  position: relative;
  z-index: 10;
  padding: 40px 20px;
}

.navigation-sections {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.nav-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
  flex-shrink: 0;
}

.section-icon {
  font-size: 18px;
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
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.4);
  box-shadow: 0 0 8px rgba(102, 126, 234, 0.6);
}

.feature-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.feature-card {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  overflow: hidden;
  touch-action: manipulation;
}

.feature-card:active {
  transform: scale(0.98);
  background: rgba(255, 255, 255, 0.1);
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:active .card-background {
  opacity: 1;
}

.card-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.feature-card:active .card-icon {
  background: rgba(102, 126, 234, 0.2);
  transform: scale(1.05);
}

.card-text {
  flex: 1;
  min-width: 0;
}

.card-text h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: var(--text-primary);
  word-break: break-word;
}

.card-text p {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
  word-break: break-word;
}

.card-arrow {
  color: var(--text-tertiary);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.feature-card:active .card-arrow {
  transform: translateX(4px);
}

.primary-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
  border-color: rgba(102, 126, 234, 0.3);
}

.primary-card:active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.25), rgba(118, 75, 162, 0.25));
  border-color: rgba(102, 126, 234, 0.5);
}

.admin-card {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(229, 62, 62, 0.1));
  border-color: rgba(244, 67, 54, 0.2);
}

.admin-card:active {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(229, 62, 62, 0.2));
  border-color: rgba(244, 67, 54, 0.4);
}

.footer {
  position: relative;
  z-index: 10;
  padding: 24px 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  padding: 12px 32px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  color: var(--danger-color) !important;
  border-color: var(--danger-color) !important;
  width: 100%;
  max-width: 200px;
  touch-action: manipulation;
}

.logout-btn:active {
  transform: scale(0.98);
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.3);
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

.dark .logout-btn.el-button--danger.is-plain:active {
  background-color: #000000 !important;
  color: white !important;
  border-color: #000000 !important;
}
</style>

