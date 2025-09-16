<template>
  <div class="navigation-container">
    <div class="header">
      <img src="@/assets/AiWorkShop_icon.png" alt="AI坊学生管理系统" class="logo">
      <h1>AI坊学生管理系统</h1>
      <div class="user-info">
        <div class="user-details">
          <span class="welcome-text">欢迎，{{ userStore.userInfo?.name || '学生' }}</span>
          <div class="level-info" :class="getLevelClass(userStore.studentLevel?.levelCode)" v-if="userStore.studentLevel">
            <el-icon class="level-icon" :class="getLevelClass(userStore.studentLevel?.levelCode)"><Star /></el-icon>
            <span class="level-text" :class="getLevelClass(userStore.studentLevel?.levelCode)">{{ getLevelName(userStore.studentLevel.levelCode) }}</span>
          </div>
          <div class="attendance-info" v-if="attendanceCount !== null">
            <el-icon class="attendance-icon"><Calendar /></el-icon>
            <span class="attendance-text">已签到 {{ attendanceCount }} 次</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="main-content">
      <div class="feature-cards">
        <div class="card attendance-card" @click="goToAttendance" :class="getCardClass('attendance')">
          <div class="card-icon">
            <el-icon size="40"><Check /></el-icon>
          </div>
          <div class="card-content">
            <h3>学生签到</h3>
            <p>点击进行AI坊实践签到</p>
          </div>
        </div>
        
        <div class="card profile-card" @click="showProfile" :class="getCardClass('profile')">
          <div class="card-icon">
            <el-icon size="40"><User /></el-icon>
          </div>
          <div class="card-content">
            <h3>个人信息</h3>
            <p>查看和编辑个人资料</p>
          </div>
        </div>
        
        <div class="card stats-card" @click="goToDashboard" :class="getCardClass('stats')">
          <div class="card-icon">
            <el-icon size="40"><DataAnalysis /></el-icon>
          </div>
          <div class="card-content">
            <h3>数据看板</h3>
            <p>查看学习数据分析</p>
          </div>
        </div>
        
        <div class="card settings-card" @click="showSettings" :class="getCardClass('settings')">
          <div class="card-icon">
            <el-icon size="40"><Setting /></el-icon>
          </div>
          <div class="card-content">
            <h3>系统设置</h3>
            <p>个性化设置选项</p>
          </div>
        </div>
        
        <div class="card admin-card" @click="goToAdmin" v-if="isAdmin" :class="getCardClass('admin')">
          <div class="card-icon">
            <el-icon size="40"><UserFilled /></el-icon>
          </div>
          <div class="card-content">
            <h3>学生管理</h3>
            <p>管理员控制台</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <el-button type="danger" @click="handleLogout" class="logout-btn">
        <el-icon><SwitchButton /></el-icon>
        退出登录
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, User, DataAnalysis, Setting, SwitchButton, Calendar, Star, UserFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getMyAttendanceCount, getStudentLevel } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()
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

const getCardClass = (cardType) => {
  const levelCode = userStore.studentLevel?.levelCode || 0
  const levelClassMap = {
    0: 'club-member',
    1: 'normal-member',
    2: 'core-member',
    3: 'admin'
  }
  return `${cardType}-${levelClassMap[levelCode]}`
}

const goToAttendance = () => {
  router.push('/attendance')
}

const showProfile = () => {
  router.push('/profile')
}

const goToDashboard = () => {
  router.push('/dashboard')
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
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0;
  margin: 0;
  position: relative;
  overflow: hidden;
}

.navigation-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
  pointer-events: none;
}

.header {
  text-align: center;
  padding: 40px 20px 30px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 0 0 30px 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 15px;
}

h1 {
  color: #2c3e50;
  font-size: 28px;
  margin: 0 0 15px 0;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-info {
  margin-top: 15px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 25px;
  display: inline-block;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.welcome-text {
  color: white;
  font-size: 16px;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.attendance-info {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.attendance-icon {
  font-size: 14px;
  color: white;
}

.attendance-text {
  color: white;
  font-size: 14px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.level-info {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.level-info.club-member {
  background: rgba(33, 150, 243, 0.2);
  border: 1px solid rgba(33, 150, 243, 0.3);
}

.level-info.normal-member {
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.level-info.core-member {
  background: rgba(255, 152, 0, 0.2);
  border: 1px solid rgba(255, 152, 0, 0.3);
}

.level-info.admin {
  background: rgba(244, 67, 54, 0.2);
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.level-icon {
  font-size: 14px;
  transition: all 0.3s ease;
}

.level-icon.club-member {
  color: #2196F3;
}

.level-icon.normal-member {
  color: #4CAF50;
}

.level-icon.core-member {
  color: #FF9800;
}

.level-icon.admin {
  color: #F44336;
}

.level-text {
  font-size: 14px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.level-text.club-member {
  color: #2196F3;
}

.level-text.normal-member {
  color: #4CAF50;
}

.level-text.core-member {
  color: #FF9800;
}

.level-text.admin {
  color: #F44336;
}

.main-content {
  flex: 1;
  padding: 40px 20px;
  position: relative;
  z-index: 1;
}

.feature-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  max-width: 450px;
  margin: 0 auto;
}

.card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 30px 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover::before {
  opacity: 1;
}

.card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.8);
}

.card-icon {
  margin-bottom: 22px;
  color: #667eea;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  padding: 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  min-width: 64px;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
}

.card-content h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #2c3e50;
  font-weight: 700;
  position: relative;
  z-index: 2;
}

.card-content p {
  margin: 0;
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
  position: relative;
  z-index: 2;
}

.attendance-card {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(76, 175, 80, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.attendance-card:hover {
  box-shadow: 
    0 20px 40px rgba(76, 175, 80, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.3);
}

.attendance-card .card-icon {
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  background: rgba(255, 255, 255, 0.2);
  padding: 12px;
  border-radius: 16px;
  min-width: 64px;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.attendance-card .card-content h3,
.attendance-card .card-content p {
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.profile-card {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(33, 150, 243, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.profile-card:hover {
  box-shadow: 
    0 20px 40px rgba(33, 150, 243, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.3);
}

.profile-card .card-icon {
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  background: rgba(255, 255, 255, 0.2);
  padding: 12px;
  border-radius: 16px;
  min-width: 64px;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-card .card-content h3,
.profile-card .card-content p {
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.stats-card {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(255, 152, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.stats-card:hover {
  box-shadow: 
    0 20px 40px rgba(255, 152, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.3);
}

.stats-card .card-icon {
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  background: rgba(255, 255, 255, 0.2);
  padding: 12px;
  border-radius: 16px;
  min-width: 64px;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stats-card .card-content h3,
.stats-card .card-content p {
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.settings-card {
  background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(156, 39, 176, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.settings-card:hover {
  box-shadow: 
    0 20px 40px rgba(156, 39, 176, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.3);
}

.settings-card .card-icon {
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  background: rgba(255, 255, 255, 0.2);
  padding: 12px;
  border-radius: 16px;
  min-width: 64px;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-card .card-content h3,
.settings-card .card-content p {
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.admin-card {
  background: linear-gradient(135deg, #E53E3E 0%, #C53030 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(229, 62, 62, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.admin-card:hover {
  box-shadow: 
    0 20px 40px rgba(229, 62, 62, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.3);
}

.admin-card .card-icon {
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  background: rgba(255, 255, 255, 0.2);
  padding: 12px;
  border-radius: 16px;
  min-width: 64px;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-card .card-content h3,
.admin-card .card-content p {
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.attendance-club-member {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(76, 175, 80, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.attendance-normal-member {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(33, 150, 243, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.attendance-core-member {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(255, 152, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.attendance-admin {
  background: linear-gradient(135deg, #E53E3E 0%, #C53030 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(229, 62, 62, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.profile-club-member {
  background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(156, 39, 176, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.profile-normal-member {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(76, 175, 80, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.profile-core-member {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(33, 150, 243, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.profile-admin {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(255, 152, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.stats-club-member {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(255, 152, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.stats-normal-member {
  background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(156, 39, 176, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.stats-core-member {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(76, 175, 80, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.stats-admin {
  background: linear-gradient(135deg, #E53E3E 0%, #C53030 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(229, 62, 62, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.settings-club-member {
  background: linear-gradient(135deg, #E53E3E 0%, #C53030 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(229, 62, 62, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.settings-normal-member {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(255, 152, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.settings-core-member {
  background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(156, 39, 176, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.settings-admin {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(76, 175, 80, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.admin-club-member {
  background: linear-gradient(135deg, #607D8B 0%, #455A64 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(96, 125, 139, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.admin-normal-member {
  background: linear-gradient(135deg, #795548 0%, #5D4037 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(121, 85, 72, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.admin-core-member {
  background: linear-gradient(135deg, #607D8B 0%, #455A64 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(96, 125, 139, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.admin-admin {
  background: linear-gradient(135deg, #E53E3E 0%, #C53030 100%);
  color: white;
  box-shadow: 
    0 8px 32px rgba(229, 62, 62, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.footer {
  padding: 30px 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 30px 30px 0 0;
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.logout-btn {
  width: 220px;
  height: 50px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #f56c6c 0%, #e53e3e 100%);
  border: none;
  color: white;
  box-shadow: 
    0 8px 25px rgba(245, 108, 108, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.logout-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.logout-btn:hover::before {
  left: 100%;
}

.logout-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 
    0 12px 35px rgba(245, 108, 108, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.3);
}

@media (max-width: 480px) {
  .feature-cards {
    grid-template-columns: 1fr;
    gap: 20px;
    max-width: 100%;
  }
  
  .card {
    padding: 25px 20px;
    border-radius: 20px;
  }
  
  .header {
    padding: 30px 15px 20px;
  }
  
  .main-content {
    padding: 30px 15px;
  }
  
  .logo {
    width: 80px;
    height: 80px;
  }
  
  h1 {
    font-size: 24px;
  }
  
  .logout-btn {
    width: 200px;
    height: 45px;
  }
}
</style>

