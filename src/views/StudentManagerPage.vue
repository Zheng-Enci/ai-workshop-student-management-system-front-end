<template>
  <div class="student-manager-container">
    <div class="header">
      <el-button @click="goBack" class="back-btn">
        <el-icon><ArrowLeft /></el-icon>
        返回导航
      </el-button>
      <div class="header-content">
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊学生管理系统" class="logo">
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
          <el-button type="primary" @click="refreshStudents" :loading="loading">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        
        <div class="students-list" v-if="!loading && managedStudents.length > 0">
          <div class="student-card" v-for="student in managedStudents" :key="student.studentId">
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
              <div class="attendance-count">
                <el-icon class="attendance-icon"><Calendar /></el-icon>
                <span class="count-text">{{ getStudentAttendanceCountFromCache(student.studentId) }}次</span>
              </div>
              <el-button 
                type="warning" 
                size="small" 
                @click="openMakeupDialog(student)"
                class="makeup-btn"
              >
                <el-icon><Clock /></el-icon>
                补卡
              </el-button>
            </div>
          </div>
        </div>
        
        <div class="empty-state" v-if="!loading && managedStudents.length === 0">
          <el-icon size="64" class="empty-icon"><User /></el-icon>
          <h3>暂无管理的学生</h3>
          <p>您当前没有管理任何学生</p>
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
            <div class="student-name">{{ selectedStudent?.name }}</div>
            <div class="student-id">{{ selectedStudent?.studentId }}</div>
            <div class="student-grade">{{ selectedStudent?.grade }}年级 · {{ selectedStudent?.major }}</div>
          </div>
          <div class="student-status">
            <el-tag type="success" size="small">管理员</el-tag>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Calendar, Star, Refresh, Loading, ArrowLeft, Clock, InfoFilled, Check } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getManagedStudents, getStudentAttendanceCount, makeupAttendance } from '@/api/admin'

const router = useRouter()
const userStore = useUserStore()
const managedStudents = ref([])
const loading = ref(false)
const attendanceCounts = ref({})
const makeupDialogVisible = ref(false)
const selectedStudent = ref(null)
const makeupForm = ref({
  attendanceTime: ''
})
const makeupLoading = ref(false)

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
  selectedStudent.value = student
  makeupForm.value.attendanceTime = ''
  makeupDialogVisible.value = true
}

const closeMakeupDialog = () => {
  makeupDialogVisible.value = false
  selectedStudent.value = null
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
      selectedStudent.value.studentId,
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

onMounted(() => {
  if (!userStore.userInfo?.studentId) {
    ElMessage.error('请先登录')
    router.push('/login')
    return
  }
  
  if (userStore.studentLevel?.levelCode !== 3) {
    ElMessage.error('您没有管理员权限')
    router.push('/navigation')
    return
  }
  
  loadManagedStudents()
})
</script>

<style scoped>
.student-manager-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
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
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
  pointer-events: none;
}

.header {
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 0 0 30px 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.header-content {
  text-align: center;
  position: relative;
}

.logo {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
}

h1 {
  color: #2c3e50;
  font-size: 24px;
  margin: 0 0 15px 0;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.admin-info {
  margin-top: 10px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #E53E3E 0%, #C53030 100%);
  border-radius: 20px;
  display: inline-block;
  box-shadow: 0 4px 15px rgba(229, 62, 62, 0.3);
}

.admin-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.admin-name {
  color: white;
  font-size: 16px;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.admin-level {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.level-icon {
  font-size: 12px;
  color: #FFD700;
}

.level-text {
  color: #FFD700;
  font-size: 12px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
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
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 500;
}

.students-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  color: #2c3e50;
  font-weight: 700;
}

.students-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.student-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.student-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.student-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.student-info {
  flex: 1;
  min-width: 0;
}

.student-name {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px;
}

.student-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.detail-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.label {
  color: #7f8c8d;
  font-weight: 500;
  margin-right: 4px;
}

.value {
  color: #2c3e50;
  font-weight: 600;
}

.student-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.attendance-count {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  border-radius: 12px;
  color: white;
}

.attendance-icon {
  font-size: 14px;
}

.count-text {
  font-size: 14px;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #7f8c8d;
}

.empty-icon {
  color: #ddd;
  margin-bottom: 15px;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #7f8c8d;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

.loading-state {
  text-align: center;
  padding: 40px 20px;
  color: #7f8c8d;
}

.loading-icon {
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}


.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 120px;
  height: 40px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  box-shadow: 0 3px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  z-index: 10;
}

.back-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.makeup-btn {
  margin-top: 8px;
  width: 100%;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.makeup-dialog {
  border-radius: 20px;
  overflow: hidden;
}

.makeup-dialog .el-dialog__body {
  padding: 0;
}

.makeup-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 25px 30px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
}

.header-icon {
  width: 50px;
  height: 50px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.header-content h3 {
  margin: 0 0 5px 0;
  font-size: 22px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.header-content p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
  font-weight: 500;
}

.makeup-content {
  padding: 30px;
  background: #f8fafc;
}

.student-info-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  margin-bottom: 25px;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.student-info-card .student-avatar {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.student-info-card .student-details {
  flex: 1;
}

.student-info-card .student-name {
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 6px;
}

.student-info-card .student-id {
  font-size: 16px;
  color: #7f8c8d;
  font-weight: 600;
  margin-bottom: 4px;
}

.student-info-card .student-grade {
  font-size: 14px;
  color: #95a5a6;
  font-weight: 500;
}

.student-status {
  position: absolute;
  top: 15px;
  right: 15px;
}

.form-section {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.form-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f1f3f4;
}

.form-icon {
  color: #667eea;
  font-size: 20px;
}

.form-title {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
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
  border: 2px solid #e1e8ed;
  padding: 12px 16px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.datetime-picker .el-input__wrapper:hover {
  border-color: #667eea;
}

.datetime-picker .el-input__wrapper.is-focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border-radius: 10px;
  border-left: 4px solid #667eea;
  font-size: 14px;
  color: #5a6c7d;
  font-weight: 500;
}

.form-tip .el-icon {
  color: #667eea;
  font-size: 16px;
}

.makeup-footer {
  background: white;
  padding: 20px 30px;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  border-top: 1px solid #e1e8ed;
}

.cancel-btn {
  width: 120px;
  height: 45px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  border: 2px solid #e1e8ed;
  color: #7f8c8d;
  background: white;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  border-color: #d1d9e0;
  color: #5a6c7d;
  background: #f8fafc;
}

.submit-btn {
  width: 140px;
  height: 45px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.submit-btn:active {
  transform: translateY(0);
}

@media (max-width: 480px) {
  .header {
    padding: 15px;
  }
  
  .back-btn {
    position: static;
    width: 100%;
    height: 45px;
    font-size: 16px;
    margin-bottom: 15px;
  }
  
  .stats-section {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .student-details {
    grid-template-columns: 1fr;
    gap: 4px;
  }
  
  .student-card {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .student-actions {
    flex-direction: row;
    justify-content: center;
  }
  
  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .section-header h2 {
    text-align: center;
  }
  
  .makeup-dialog {
    width: 95% !important;
  }
  
  .makeup-header {
    padding: 20px;
    flex-direction: column;
    text-align: center;
    gap: 10px;
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
    gap: 15px;
    padding: 20px;
  }
  
  .student-status {
    position: static;
    margin-top: 10px;
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
    padding: 15px 20px;
    flex-direction: column;
    gap: 10px;
  }
  
  .cancel-btn,
  .submit-btn {
    width: 100%;
    height: 50px;
  }
}
</style>
