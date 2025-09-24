<template>
  <div class="profile-container">
    <div class="header">
      <div class="header-content">
        <el-button @click="goBack" class="back-btn" type="primary" :icon="ArrowLeft" circle></el-button>
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊" class="logo">
        <div class="title-section">
          <h1>个人信息</h1>
          <p>Personal Profile</p>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="profile-card">
        <div v-if="isLoading" class="loading-overlay">
          <div class="loading-spinner"></div>
        </div>
        
        <div class="profile-header">
          <div class="user-avatar-section">
            <div class="avatar-container">
              <div class="avatar-wrapper">
                <div class="avatar-bg">
                  <div class="avatar-inner">
                    <el-icon class="avatar-icon"><User /></el-icon>
                  </div>
                </div>
                <div class="avatar-ring"></div>
              </div>
            </div>
            <div class="user-details">
              <h2>{{ formData.name || '用户' }}</h2>
              <p class="student-id">{{ formData.studentId || '学号' }}</p>
              <div class="attendance-info" v-if="attendanceCount !== null">
                <el-icon class="attendance-icon"><Calendar /></el-icon>
                <span class="attendance-text">已签到 {{ attendanceCount }} 次</span>
              </div>
            </div>
          </div>
          <div class="action-buttons">
            <el-button 
              type="success" 
              :icon="Calendar" 
              @click="openAttendanceRecordsDialog"
              :disabled="isLoading"
              class="records-btn"
            >
              考勤记录
            </el-button>
            <el-button 
              type="primary" 
              :icon="Edit" 
              @click="toggleEditMode"
              :disabled="isLoading"
              class="edit-btn"
            >
              {{ isEditing ? '取消' : '编辑' }}
            </el-button>
          </div>
        </div>

        <div class="form-section">
          <div class="section-title">
            <h3>基本信息</h3>
            <div class="section-line"></div>
          </div>
          
          <el-form 
            ref="formRef" 
            :model="formData" 
            :rules="rules" 
            class="profile-form"
          >
            <div class="form-grid">
              <div class="form-item">
                <label class="form-label">姓名</label>
                <el-input 
                  v-model="formData.name" 
                  :disabled="!isEditing"
                  placeholder="请输入姓名"
                  maxlength="20"
                  class="form-input"
                />
              </div>
              
              <div class="form-item">
                <label class="form-label">学号</label>
                <el-input 
                  v-model="formData.studentId" 
                  :disabled="!isEditing"
                  placeholder="请输入学号"
                  maxlength="10"
                  class="form-input"
                />
              </div>
              
              <div class="form-item">
                <label class="form-label">性别</label>
                <el-select 
                  v-model="formData.gender" 
                  :disabled="!isEditing"
                  placeholder="请选择性别"
                  class="form-input"
                >
                  <el-option label="男" value="男" />
                  <el-option label="女" value="女" />
                </el-select>
              </div>
              
              <div class="form-item">
                <label class="form-label">手机号</label>
                <el-input 
                  v-model="formData.phoneNumber" 
                  :disabled="!isEditing"
                  placeholder="请输入手机号"
                  maxlength="11"
                  class="form-input"
                />
              </div>
              
              <div class="form-item">
                <label class="form-label">学院</label>
                <el-input 
                  v-model="formData.college" 
                  :disabled="!isEditing"
                  placeholder="请输入学院"
                  maxlength="50"
                  class="form-input"
                />
              </div>
              
              <div class="form-item">
                <label class="form-label">专业</label>
                <el-input 
                  v-model="formData.major" 
                  :disabled="!isEditing"
                  placeholder="请输入专业"
                  maxlength="50"
                  class="form-input"
                />
              </div>
              
              <div class="form-item">
                <label class="form-label">年级</label>
                <el-select 
                  v-model="formData.grade" 
                  :disabled="!isEditing"
                  placeholder="请选择年级"
                  class="form-input"
                >
                  <el-option label="1年级" :value="1" />
                  <el-option label="2年级" :value="2" />
                  <el-option label="3年级" :value="3" />
                  <el-option label="4年级" :value="4" />
                  <el-option label="5年级" :value="5" />
                </el-select>
              </div>
              
              <div class="form-item">
                <label class="form-label">班级</label>
                <el-input-number 
                  v-model="formData.classNum" 
                  :disabled="!isEditing"
                  :min="1" 
                  :max="100"
                  placeholder="请输入班级"
                  class="form-input"
                />
              </div>
            </div>

            <div v-if="isEditing" class="form-actions">
              <el-button @click="resetForm" :disabled="isLoading" class="reset-btn">
                重置
              </el-button>
              <el-button type="primary" @click="showPasswordConfirmDialog" :loading="isLoading" class="save-btn">
                保存修改
              </el-button>
            </div>
          </el-form>
        </div>

        <div class="password-section">
          <div class="section-title">
            <h3>安全设置</h3>
            <div class="section-line"></div>
          </div>
          <div class="password-card">
            <div class="password-info">
              <div class="password-icon">
                <el-icon><Lock /></el-icon>
              </div>
              <div class="password-content">
                <h4>密码管理</h4>
                <p>定期修改密码有助于保护账户安全</p>
              </div>
            </div>
            <el-button type="primary" :icon="Lock" @click="showPasswordDialog" class="password-btn">
              修改密码
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="passwordDialogVisible"
      width="360px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center
      class="password-dialog"
    >
      <div class="password-content">
        <div class="password-header">
          <div class="password-icon">
            <el-icon><Lock /></el-icon>
          </div>
          <h3>修改密码</h3>
          <p>为了账户安全，请设置新密码</p>
        </div>
        
        <el-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          class="password-form"
        >
          <div class="form-group">
            <el-form-item prop="oldPassword">
              <el-input
                v-model="passwordForm.oldPassword"
                type="password"
                placeholder="请输入原密码"
                maxlength="16"
                show-password
                class="password-input"
              />
            </el-form-item>
          </div>
          
          <div class="form-group">
            <el-form-item prop="newPassword">
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="请输入新密码"
                maxlength="16"
                show-password
                class="password-input"
              />
            </el-form-item>
          </div>
          
          <div class="form-group">
            <el-form-item prop="confirmPassword">
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="请再次输入新密码"
                maxlength="16"
                show-password
                class="password-input"
              />
            </el-form-item>
          </div>
        </el-form>
        
        <div class="password-actions">
          <el-button @click="cancelPasswordChange" :disabled="isPasswordLoading" class="cancel-btn">
            取消
          </el-button>
          <el-button 
            type="primary" 
            @click="confirmPasswordChange" 
            :loading="isPasswordLoading"
            class="confirm-btn"
          >
            确认修改
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-model="passwordConfirmDialogVisible"
      width="320px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center
      class="confirm-dialog"
    >
      <div class="confirm-content">
        <div class="confirm-header">
          <div class="confirm-icon">
            <el-icon><Lock /></el-icon>
          </div>
          <h3>身份验证</h3>
          <p>请输入密码以确认身份</p>
        </div>
        
        <el-form
          ref="passwordConfirmFormRef"
          :model="passwordConfirmForm"
          :rules="passwordConfirmRules"
          class="confirm-form"
        >
          <el-form-item prop="password">
            <el-input
              v-model="passwordConfirmForm.password"
              type="password"
              placeholder="请输入当前密码"
              maxlength="16"
              show-password
              class="password-input"
            />
          </el-form-item>
        </el-form>
        
        <div class="confirm-actions">
          <el-button @click="cancelPasswordConfirm" :disabled="isPasswordConfirmLoading" class="cancel-btn">
            取消
          </el-button>
          <el-button 
            type="primary" 
            @click="confirmPasswordAndSave" 
            :loading="isPasswordConfirmLoading"
            class="confirm-btn"
          >
            确认
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-model="attendanceRecordsDialogVisible"
      title="我的考勤记录"
      width="90%"
      :close-on-click-modal="false"
      class="attendance-records-dialog"
    >
      <div class="attendance-records-container">
        <div class="records-header">
          <div class="student-info">
            <div class="student-avatar-large">
              {{ formData.name?.charAt(0) }}
            </div>
            <div class="student-details">
              <h3>{{ formData.name }}</h3>
              <p>学号：{{ formData.studentId }}</p>
              <p>专业：{{ formData.major }} | 年级：{{ formData.grade }}年级</p>
            </div>
          </div>
          <div class="attendance-summary">
            <div class="summary-item">
              <span class="summary-label">总签到次数</span>
              <span class="summary-value">{{ attendanceRecords.length }}</span>
            </div>
          </div>
        </div>
        
        <div v-if="attendanceRecords.length === 0" class="no-records">
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
              <div class="calendar-day">
                <div class="day-number">{{ data.day.split('-').slice(2).join('-') }}</div>
                <div class="attendance-dots">
                  <div 
                    v-for="record in getDayAttendanceRecords(data.day)" 
                    :key="record.attendanceDateTime"
                    class="attendance-dot"
                    :class="getTimePeriodClass(record.attendanceDateTime)"
                    :title="formatAttendanceTime(record.attendanceDateTime)"
                  ></div>
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, User, Edit, Lock, Calendar } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { getStudentProfile, updateStudentInfo, changePassword, getMyAttendanceCount, getMyAttendanceRecords } from '@/api/user'

const router = useRouter()
const formRef = ref()
const passwordFormRef = ref()
const passwordConfirmFormRef = ref()
const isLoading = ref(false)
const isEditing = ref(false)
const passwordDialogVisible = ref(false)
const isPasswordLoading = ref(false)
const passwordConfirmDialogVisible = ref(false)
const isPasswordConfirmLoading = ref(false)
const attendanceCount = ref(null)
const attendanceRecordsDialogVisible = ref(false)
const attendanceRecords = ref([])
const calendarValue = ref(new Date())
const scrollPosition = ref(0)

const formData = reactive({
  name: '',
  studentId: '',
  gender: '',
  phoneNumber: '',
  college: '',
  major: '',
  grade: null,
  classNum: null
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordConfirmForm = reactive({
  password: ''
})

const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在2到20个字符', trigger: 'blur' }
  ],
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { pattern: /^[2-3][0-9]\d{8}$/, message: '学号格式不正确（以20-30开头的10位数字）', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  college: [
    { required: true, message: '请输入学院', trigger: 'blur' },
    { min: 2, max: 50, message: '学院名称长度在2到50个字符', trigger: 'blur' }
  ],
  major: [
    { required: true, message: '请输入专业', trigger: 'blur' },
    { min: 2, max: 50, message: '专业名称长度在2到50个字符', trigger: 'blur' }
  ],
  grade: [
    { required: true, message: '请选择年级', trigger: 'change' }
  ],
  classNum: [
    { required: true, message: '请输入班级', trigger: 'blur' },
    { type: 'number', min: 1, max: 100, message: '班级必须在1到100之间', trigger: 'blur' }
  ]
}

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码长度在6到16个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const passwordConfirmRules = {
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码长度在6到16个字符', trigger: 'blur' }
  ]
}

const originalData = ref({})

const goBack = () => {
  router.push('/navigation')
}

const loadProfile = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      ElMessage.error('请先登录')
      router.push('/login')
      return
    }

    const [profileResponse, attendanceResponse] = await Promise.all([
      getStudentProfile(token),
      getMyAttendanceCount(token)
    ])

    if (profileResponse.code === 200) {
      Object.assign(formData, profileResponse.data)
      originalData.value = { ...profileResponse.data }
    } else {
      ElMessage.error(profileResponse.message || '获取个人信息失败')
    }

    if (attendanceResponse.code === 200) {
      attendanceCount.value = attendanceResponse.data.count
    }
  } catch (error) {
    ElMessage.error('获取个人信息失败：' + error.message)
    if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      router.push('/login')
    }
  } finally {
    isLoading.value = false
  }
}

const toggleEditMode = () => {
  if (isEditing.value) {
    ElMessageBox.confirm(
      '确定要取消编辑吗？未保存的修改将丢失。',
      '确认取消',
      {
        confirmButtonText: '确定',
        cancelButtonText: '继续编辑',
        type: 'warning'
      }
    ).then(() => {
      resetForm()
      isEditing.value = false
    }).catch(() => {})
  } else {
    isEditing.value = true
  }
}

const resetForm = () => {
  Object.assign(formData, originalData.value)
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

const showPasswordDialog = () => {
  passwordDialogVisible.value = true
  resetPasswordForm()
}

const resetPasswordForm = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  if (passwordFormRef.value) {
    passwordFormRef.value.clearValidate()
  }
}

const cancelPasswordChange = () => {
  passwordDialogVisible.value = false
  resetPasswordForm()
}

const confirmPasswordChange = async () => {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
  } catch (error) {
    return
  }

  isPasswordLoading.value = true
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      ElMessage.error('请先登录')
      router.push('/login')
      return
    }

    const response = await changePassword(token, {
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
      confirmPassword: passwordForm.confirmPassword
    })
    
    if (response.code === 200) {
      ElMessage.success('密码修改成功')
      passwordDialogVisible.value = false
      resetPasswordForm()
    } else {
      ElMessage.error(response.message || '修改密码失败')
    }
  } catch (error) {
    ElMessage.error('修改密码失败：' + error.message)
    if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      router.push('/login')
    }
  } finally {
    isPasswordLoading.value = false
  }
}

const showPasswordConfirmDialog = () => {
  passwordConfirmDialogVisible.value = true
  resetPasswordConfirmForm()
}

const resetPasswordConfirmForm = () => {
  passwordConfirmForm.password = ''
  if (passwordConfirmFormRef.value) {
    passwordConfirmFormRef.value.clearValidate()
  }
}

const cancelPasswordConfirm = () => {
  passwordConfirmDialogVisible.value = false
  resetPasswordConfirmForm()
}

const confirmPasswordAndSave = async () => {
  if (!passwordConfirmFormRef.value) return
  
  try {
    await passwordConfirmFormRef.value.validate()
  } catch (error) {
    return
  }

  isPasswordConfirmLoading.value = true
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      ElMessage.error('请先登录')
      router.push('/login')
      return
    }

    const updateData = { 
      ...formData,
      password: passwordConfirmForm.password
    }

    const response = await updateStudentInfo(token, updateData)
    if (response.code === 200) {
      ElMessage.success('个人信息更新成功')
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      originalData.value = { ...formData }
      isEditing.value = false
      passwordConfirmDialogVisible.value = false
      resetPasswordConfirmForm()
    } else {
      ElMessage.error(response.message || '更新个人信息失败')
    }
  } catch (error) {
    ElMessage.error('更新个人信息失败：' + error.message)
    if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      router.push('/login')
    }
  } finally {
    isPasswordConfirmLoading.value = false
  }
}

const openAttendanceRecordsDialog = async () => {
  scrollPosition.value = window.pageYOffset || document.documentElement.scrollTop
  
  const restoreScroll = () => {
    setTimeout(() => {
      window.scrollTo(0, scrollPosition.value)
    }, 50)
  }
  
  try {
    isLoading.value = true
    restoreScroll()
    const token = localStorage.getItem('token')
    if (!token) {
      ElMessage.error('请先登录')
      router.push('/login')
      return
    }

    const response = await getMyAttendanceRecords()
    if (response.code === 200) {
      attendanceRecords.value = response.data || []
      attendanceRecordsDialogVisible.value = true
    } else {
      ElMessage.error(response.message || '获取考勤记录失败')
    }
  } catch (error) {
    ElMessage.error('获取考勤记录失败：' + error.message)
    if (error.message.includes('Token无效') || error.message.includes('请重新登录')) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      router.push('/login')
    }
  } finally {
    isLoading.value = false
    restoreScroll()
  }
}

const closeAttendanceRecordsDialog = () => {
  attendanceRecordsDialogVisible.value = false
  setTimeout(() => {
    window.scrollTo(0, scrollPosition.value)
  }, 100)
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

const getTimePeriodClass = (timeString) => {
  if (!timeString) return 'morning'
  const date = new Date(timeString)
  const hour = date.getHours()
  
  if (hour >= 8 && hour < 11) {
    return 'morning'
  } else if (hour >= 14 && hour < 17) {
    return 'afternoon'
  } else if (hour >= 19 && hour < 22) {
    return 'evening'
  } else {
    return 'morning'
  }
}


const getDayAttendanceRecords = (dateString) => {
  if (!attendanceRecords.value || attendanceRecords.value.length === 0) return []
  
  const targetDate = new Date(dateString)
  const year = targetDate.getFullYear()
  const month = String(targetDate.getMonth() + 1).padStart(2, '0')
  const day = String(targetDate.getDate()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`
  
  return attendanceRecords.value.filter(record => {
    const recordDate = new Date(record.attendanceDateTime)
    const recordYear = recordDate.getFullYear()
    const recordMonth = String(recordDate.getMonth() + 1).padStart(2, '0')
    const recordDay = String(recordDate.getDate()).padStart(2, '0')
    const recordDateStr = `${recordYear}-${recordMonth}-${recordDay}`
    return recordDateStr === dateStr
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

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  position: relative;
}

.profile-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.header {
  position: relative;
  z-index: 1;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 15px;
  max-width: 400px;
  margin: 0 auto;
}

.back-btn {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.logo {
  width: 40px;
  height: 40px;
  filter: brightness(0) invert(1);
}

.title-section h1 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title-section p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.main-content {
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.profile-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 24px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.profile-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border-radius: 24px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.profile-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
}

.user-avatar-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.avatar-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-bg {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  position: relative;
  z-index: 2;
}

.avatar-inner {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(10px);
}

.avatar-icon {
  font-size: 28px;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.avatar-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  border: 3px solid transparent;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2, #f093fb, #f5576c) border-box;
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}


.user-details h2 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #2c3e50;
}

.student-id {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0 0 8px 0;
}

.attendance-info {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  margin-top: 8px;
  width: 100%;
  transition: all 0.3s ease;
}

.attendance-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.attendance-icon {
  font-size: 14px;
}

.attendance-text {
  font-size: 13px;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.edit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 20px;
  padding: 8px 20px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.records-btn {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  border: none;
  border-radius: 20px;
  padding: 8px 20px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}

.records-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
}

.form-section {
  margin-bottom: 32px;
}

.section-title {
  margin-bottom: 20px;
}

.section-title h3 {
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.section-line {
  height: 2px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 1px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.form-input {
  width: 100%;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.reset-btn {
  flex: 1;
  border-radius: 20px;
  font-weight: 600;
  border: 1px solid #e8e8e8;
  color: #666;
}

.save-btn {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 20px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.password-section {
  margin-top: 32px;
}

.password-card {
  background: rgba(248, 249, 250, 0.8);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.password-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.password-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.password-content h4 {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
}

.password-content p {
  font-size: 12px;
  color: #7f8c8d;
  margin: 0;
}

.password-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 16px;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.confirm-dialog {
  border-radius: 20px;
  overflow: hidden;
}

.confirm-content {
  padding: 0;
}

.confirm-header {
  text-align: center;
  padding: 24px 24px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.confirm-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 20px;
}

.confirm-header h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: white;
}

.confirm-header p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.confirm-form {
  padding: 24px;
}

.password-input {
  width: 100%;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px;
}

.cancel-btn {
  flex: 1;
  border-radius: 20px;
  font-weight: 600;
  border: 1px solid #e8e8e8;
  color: #666;
  height: 40px;
}

.confirm-btn {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 20px;
  font-weight: 600;
  height: 40px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

:deep(.confirm-dialog .el-dialog__body) {
  padding: 0;
}

:deep(.confirm-dialog .el-dialog__header) {
  display: none;
}

.password-dialog {
  border-radius: 20px;
  overflow: hidden;
}

.password-content {
  padding: 0;
}

.password-header {
  text-align: center;
  padding: 24px 24px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.password-dialog .password-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 20px;
}

.password-header h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: white;
}

.password-header p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.password-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.password-input {
  width: 100%;
}

.password-actions {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px;
}

:deep(.password-dialog .el-dialog__body) {
  padding: 0;
}

:deep(.password-dialog .el-dialog__header) {
  display: none;
}

:deep(.el-input__wrapper) {
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  box-shadow: none;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 12px;
}

:deep(.el-input-number .el-input__wrapper) {
  border-radius: 12px;
}

:deep(.el-form-item__error) {
  font-size: 12px;
  margin-top: 4px;
}

@media (max-width: 480px) {
  .main-content {
    padding: 16px;
  }
  
  .profile-card {
    padding: 20px;
  }
  
  .user-avatar-section {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .password-card {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 8px;
    width: 100%;
    align-items: stretch;
  }
  
  .records-btn,
  .edit-btn {
    width: 100%;
    margin: 0;
    box-sizing: border-box;
  }
}

.attendance-records-dialog {
  .el-dialog__header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px 24px;
    border-radius: 8px 8px 0 0;
  }
  
  .el-dialog__title {
    color: white;
    font-weight: 700;
    font-size: 18px;
  }
  
  .el-dialog__headerbtn .el-dialog__close {
    color: white;
    font-size: 20px;
  }
  
  .el-dialog__body {
    padding: 30px 24px;
    background: #f8f9fa;
  }
  
  .el-dialog__footer {
    background: #f8f9fa;
    padding: 20px 24px;
    border-radius: 0 0 8px 8px;
  }
}

.attendance-records-container {
  max-height: 500px;
  overflow-y: auto;
}

.records-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.student-details h3 {
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.student-details p {
  font-size: 14px;
  color: #7f8c8d;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.summary-label {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
}

.summary-value {
  font-size: 24px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.no-records {
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
}

.no-records-icon {
  font-size: 48px;
  color: #ddd;
  margin-bottom: 20px;
}

.no-records p {
  font-size: 16px;
  margin: 0;
}

.calendar-container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.attendance-calendar {
  width: 100%;
}

.attendance-calendar :deep(.el-calendar__header) {
  display: block;
}

.attendance-calendar :deep(.el-calendar__body) {
  padding: 0;
}

.attendance-calendar :deep(.el-calendar-table) {
  border: none;
}

.attendance-calendar :deep(.el-calendar-table thead th) {
  background: #f8f9fa;
  color: #495057;
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

.attendance-calendar :deep(.el-calendar-table thead th)::after {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
}

.attendance-calendar :deep(.el-calendar-table tbody td) {
  border: 1px solid #e9ecef;
  padding: 0;
  height: 80px;
  vertical-align: top;
}

.attendance-calendar :deep(.el-calendar-table tbody td.is-today) {
  background: rgba(102, 126, 234, 0.1);
}

.attendance-calendar :deep(.el-calendar-table tbody td.is-selected) {
  background: rgba(102, 126, 234, 0.2);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 8px;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.header-actions .el-button {
  display: inline-flex !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.calendar-day {
  position: relative;
  height: 100%;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 4px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.calendar-day:hover {
  background: rgba(102, 126, 234, 0.05);
}

.day-number {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  z-index: 2;
}

.attendance-dots {
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
}

.attendance-dot {
  width: 12px;
  height: 12px;
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
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3), 0 0 0 2px rgba(16, 185, 129, 0.1);
}

.attendance-dot.afternoon {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3), 0 0 0 2px rgba(245, 158, 11, 0.1);
}

.attendance-dot.evening {
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
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
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  flex-wrap: wrap;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #495057;
  font-weight: 500;
  padding: 8px 16px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.legend-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.legend-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-dot.morning {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3), 0 0 0 2px rgba(16, 185, 129, 0.1);
}

.legend-dot.afternoon {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3), 0 0 0 2px rgba(245, 158, 11, 0.1);
}

.legend-dot.evening {
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3), 0 0 0 2px rgba(139, 92, 246, 0.1);
}

.attendance-record-item {
  background: #ffffff;
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
  background: linear-gradient(90deg, #10B981 0%, #059669 100%);
}

.attendance-record-item.afternoon::before {
  background: linear-gradient(90deg, #F59E0B 0%, #D97706 100%);
}

.attendance-record-item.evening::before {
  background: linear-gradient(90deg, #8B5CF6 0%, #7C3AED 100%);
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
  color: #10B981;
}

.time-period-indicator.afternoon {
  color: #F59E0B;
}

.time-period-indicator.evening {
  color: #8B5CF6;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.time-period-indicator.morning .indicator-dot {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
}

.time-period-indicator.afternoon .indicator-dot {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
}

.time-period-indicator.evening .indicator-dot {
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
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
  color: white;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.student-avatar.morning {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.student-avatar.afternoon {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.student-avatar.evening {
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.student-details {
  flex: 1;
  min-width: 0;
}

.student-name {
  font-weight: 700;
  color: #1F2937;
  font-size: 16px;
  margin-bottom: 4px;
  line-height: 1.2;
}

.student-id {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-weight: 500;
  color: #6B7280;
  font-size: 13px;
  line-height: 1.2;
}

.attendance-time {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6B7280;
  font-size: 14px;
  flex-shrink: 0;
}

.time-icon {
  color: #9CA3AF;
  font-size: 16px;
  transition: all 0.3s ease;
}

.time-text {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-weight: 500;
  font-size: 13px;
  color: #6B7280;
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
    min-height: 60px;
    padding: 6px 2px;
  }
  
  .day-number {
    font-size: 12px;
    margin-bottom: 6px;
  }
  
  .attendance-dot {
    width: 10px;
    height: 10px;
  }
  
  .calendar-legend {
    flex-direction: column;
    gap: 12px;
    align-items: center;
    padding: 16px;
  }
  
  .legend-item {
    font-size: 13px;
    padding: 6px 12px;
    gap: 8px;
  }
  
  .legend-dot {
    width: 12px;
    height: 12px;
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
}
</style>
