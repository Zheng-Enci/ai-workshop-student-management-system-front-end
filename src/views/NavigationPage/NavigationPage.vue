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
        <div class="user-avatar">
          <el-icon size="24"><User /></el-icon>
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
    </div>
    
    <div class="main-content">
      <div class="content-header">
        <h2>功能导航</h2>
        <p>选择您需要的功能模块</p>
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
              <p>查看和编辑个人资料</p>
            </div>
            <div class="card-arrow">
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
        
        <div class="feature-card" @click="goToDashboard">
          <div class="card-background"></div>
          <div class="card-content">
            <div class="card-icon">
              <el-icon size="28"><DataAnalysis /></el-icon>
            </div>
            <div class="card-text">
              <h3>数据看板</h3>
              <p>查看学习数据分析</p>
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
              <p>查看签到数据分析</p>
            </div>
            <div class="card-arrow">
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
        
        <div class="feature-card" @click="showSettings">
          <div class="card-background"></div>
          <div class="card-content">
            <div class="card-icon">
              <el-icon size="28"><Setting /></el-icon>
            </div>
            <div class="card-text">
              <h3>系统设置</h3>
              <p>个性化设置选项</p>
            </div>
            <div class="card-arrow">
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
        
        <div class="feature-card admin-card" @click="goToAdmin" v-if="isAdmin">
          <div class="card-background"></div>
          <div class="card-content">
            <div class="card-icon">
              <el-icon size="28"><UserFilled /></el-icon>
            </div>
            <div class="card-text">
              <h3>学生管理</h3>
              <p>管理员控制台</p>
            </div>
            <div class="card-arrow">
              <el-icon><ArrowRight /></el-icon>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, User, DataAnalysis, Setting, SwitchButton, Calendar, Star, UserFilled, House, TrendCharts, ArrowRight } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { getMyAttendanceCount, getStudentLevel } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore
const attendanceCount = ref(null)

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

const showSettings = () => {
  ElMessage.info('系统设置功能开发中...')
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
    }
  } catch (error) {
    if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      router.push('/login')
    }
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

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '确认退出',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  } catch {
    ElMessage.info('已取消退出')
  }
}

onMounted(() => {
  loadAttendanceCount()
  loadStudentLevel()
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
  padding: 40px 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 24px;
}

.home-btn {
  width: 48px;
  height: 48px;
  background: var(--primary-color);
  border: none;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.logo {
  width: 64px;
  height: 64px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
}

.logo:hover {
  transform: scale(1.1) rotate(5deg);
  filter: brightness(1.2);
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

.user-profile {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.user-level {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
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
  gap: 6px;
  font-size: 14px;
  color: var(--text-secondary);
}

.main-content {
  position: relative;
  z-index: 10;
  padding: 60px;
  max-width: 1400px;
  margin: 0 auto;
}

.content-header {
  text-align: center;
  margin-bottom: 48px;
}

.content-header h2 {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: var(--text-primary);
}

.content-header p {
  font-size: 18px;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 500;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 32px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  overflow: hidden;
}

.feature-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.feature-card:hover .card-arrow {
  transform: translateX(8px);
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

.feature-card:hover .card-background {
  opacity: 1;
}

.card-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 20px;
}

.card-icon {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  transition: all 0.3s ease;
}

.feature-card:hover .card-icon {
  background: rgba(102, 126, 234, 0.2);
  transform: scale(1.1);
}

.card-text {
  flex: 1;
}

.card-text h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.card-text p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.card-arrow {
  color: var(--text-tertiary);
  transition: all 0.3s ease;
}

.primary-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
  border-color: rgba(102, 126, 234, 0.3);
}

.primary-card:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.25), rgba(118, 75, 162, 0.25));
  border-color: rgba(102, 126, 234, 0.5);
}

.admin-card {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(229, 62, 62, 0.1));
  border-color: rgba(244, 67, 54, 0.2);
}

.admin-card:hover {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(229, 62, 62, 0.2));
  border-color: rgba(244, 67, 54, 0.4);
}

.footer {
  position: relative;
  z-index: 10;
  padding: 40px 60px;
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
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(245, 108, 108, 0.3);
  background-color: var(--danger-color) !important;
  color: white !important;
}

@media (max-width: 768px) {
  .header {
    padding: 24px 20px;
    flex-direction: column;
    gap: 20px;
    position: relative;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
    margin-top: 20px;
  }
  
  .home-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 44px;
    height: 44px;
    z-index: 10;
  }
  
  .main-content {
    padding: 40px 20px;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .feature-card {
    padding: 24px;
  }
  
  .card-content {
    gap: 16px;
  }
  
  .card-icon {
    width: 56px;
    height: 56px;
  }
  
  .footer {
    padding: 24px 20px;
  }
}

@media (max-width: 480px) {
  .title-section h1 {
    font-size: 24px;
  }
  
  .content-header h2 {
    font-size: 28px;
  }
  
  .feature-card {
    padding: 20px;
  }
  
  .card-text h3 {
    font-size: 18px;
  }
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