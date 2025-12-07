<template>
  <div class="profile-container">
    <div class="background-effects">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>
    
    <div class="content-wrapper">
      <div class="page-header">
        <el-button @click="goBack" class="back-btn" type="primary" :icon="ArrowLeft" circle></el-button>
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊" class="logo" @click="toggleTheme" title="切换主题模式">
        <div class="title-section">
          <h1>个人信息</h1>
          <p>Personal Profile</p>
        </div>
      </div>

      <div class="main-content">
        <div class="profile-card">
        <div v-if="isLoading" class="loading-overlay">
          <div class="loading-spinner"></div>
        </div>
        
        <div class="profile-header">
          <div class="user-info-section">
            <div class="avatar-container">
              <div class="avatar">
                <el-icon class="avatar-icon"><User /></el-icon>
              </div>
              <div class="avatar-status"></div>
            </div>
            <div class="user-details">
              <h2>{{ formData.name || '用户' }}</h2>
              <p class="student-id">{{ formData.studentId || '学号' }}</p>
              <div class="user-stats">
                <div class="stat-item" v-if="attendanceCount !== null">
                  <el-icon class="stat-icon"><Calendar /></el-icon>
                  <span class="stat-text">已签到 {{ attendanceCount }} 次</span>
                </div>
              </div>
            </div>
            <div class="action-buttons">
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
        </div>

        <div class="form-section" v-if="!showPasswordSection">
          <div class="section-header">
            <div class="section-title-wrapper">
              <div>
            <h3>基本信息</h3>
            <p>管理您的个人资料信息</p>
              </div>
            </div>
            <div class="security-badge">
              <el-icon class="badge-icon"><Lock /></el-icon>
              <span>安全保护</span>
            </div>
          </div>
          
          <el-form 
            ref="formRef" 
            :model="formData" 
            :rules="rules" 
            class="profile-form"
          >
            <div class="form-grid">
              <div class="form-group">
                <div class="form-item">
                  <label class="form-label">姓名</label>
                  <el-form-item prop="name">
                  <el-input 
                    v-model="formData.name" 
                    :disabled="!isEditing"
                    placeholder="请输入姓名"
                    maxlength="20"
                    class="form-input"
                  />
                  </el-form-item>
                </div>
                
                <div class="form-item">
                  <label class="form-label">学号</label>
                  <el-form-item prop="studentId">
                  <el-input 
                    v-model="formData.studentId" 
                    :disabled="!isEditing"
                    placeholder="请输入学号"
                    maxlength="10"
                    class="form-input"
                  />
                  </el-form-item>
                </div>
              </div>
              
              <div class="form-group">
                <div class="form-item">
                  <label class="form-label">性别</label>
                  <el-form-item prop="gender">
                  <el-select 
                    v-model="formData.gender" 
                    :disabled="!isEditing"
                    placeholder="请选择性别"
                    class="form-input"
                  >
                    <el-option label="男" value="男" />
                    <el-option label="女" value="女" />
                  </el-select>
                  </el-form-item>
                </div>
                
                <div class="form-item">
                  <label class="form-label">手机号</label>
                  <el-form-item prop="phoneNumber">
                  <el-input 
                    v-model="formData.phoneNumber" 
                    :disabled="!isEditing"
                    placeholder="请输入手机号"
                    maxlength="11"
                    class="form-input"
                  />
                  </el-form-item>
                </div>
              </div>
              
              <div class="form-group">
                <div class="form-item">
                  <label class="form-label">学院</label>
                  <el-form-item prop="college">
                  <el-input 
                    v-model="formData.college" 
                    :disabled="!isEditing"
                    placeholder="请输入学院"
                    maxlength="50"
                    class="form-input"
                  />
                  </el-form-item>
                </div>
                
                <div class="form-item">
                  <label class="form-label">专业</label>
                  <el-form-item prop="major">
                  <el-input 
                    v-model="formData.major" 
                    :disabled="!isEditing"
                    placeholder="请输入专业"
                    maxlength="50"
                    class="form-input"
                  />
                  </el-form-item>
                </div>
              </div>
              
              <div class="form-group">
                <div class="form-item">
                  <label class="form-label">年级</label>
                  <el-form-item prop="grade">
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
                  </el-form-item>
                </div>
                
                <div class="form-item">
                  <label class="form-label">班级</label>
                  <el-form-item prop="classNum">
                  <el-input-number 
                    v-model="formData.classNum" 
                    :disabled="!isEditing"
                    :min="1" 
                    :max="100"
                    placeholder="请输入班级"
                    class="form-input"
                  />
                  </el-form-item>
                </div>
              </div>
              
              <div class="form-group">
                <div class="form-item">
                  <label class="form-label">
                    <el-icon class="label-icon"><Lock /></el-icon>
                    当前密码
                  </label>
                  <el-form-item prop="password">
                    <el-input 
                      v-model="formData.password" 
                      type="password"
                      :disabled="!isEditing"
                      placeholder="请输入当前密码以确认身份"
                      maxlength="16"
                      show-password
                      class="form-input security-input"
                    />
                  </el-form-item>
                  <div class="security-hint" v-if="isEditing">
                    <el-icon class="hint-icon"><Lock /></el-icon>
                    <span>密码用于验证身份，确保操作安全</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="isEditing" class="form-actions">
              <el-button @click.prevent="resetForm" :disabled="isLoading" class="reset-btn">
                重置
              </el-button>
              <el-button type="primary" @click="saveProfile" :loading="isLoading" :disabled="isLoading" class="save-btn">
                保存修改
              </el-button>
            </div>
          </el-form>
        </div>

        <div class="password-section">
          <div class="section-header">
            <h3>安全设置</h3>
            <p>保护您的账户安全</p>
          </div>
          <div class="security-card">
            <div class="security-info">
              <div class="security-icon">
                <el-icon><Lock /></el-icon>
              </div>
              <div class="security-content">
                <h4>密码管理</h4>
                <p>定期修改密码有助于保护账户安全</p>
              </div>
            </div>
            <el-button type="primary" :icon="Lock" @click="togglePasswordSection" class="security-btn">
              {{ showPasswordSection ? '返回基本信息' : '修改密码' }}
            </el-button>
      </div>
    </div>

        <div class="password-section" v-if="showPasswordSection">
          <div class="section-header security-header">
            <div class="section-title-wrapper">
              <el-icon class="section-icon security-icon-large"><Lock /></el-icon>
              <div>
          <h3>修改密码</h3>
          <p>为了账户安全，请设置新密码</p>
              </div>
            </div>
            <div class="security-tip">
              <el-icon class="tip-icon"><Lock /></el-icon>
              <span>您的密码将被加密存储</span>
            </div>
        </div>
        
          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            class="profile-form"
          >
            <div class="form-grid">
              <div class="form-group">
              <div class="form-item">
                  <label class="form-label">
                    <el-icon class="label-icon"><Lock /></el-icon>
                    原密码
                  </label>
                <el-form-item prop="oldPassword">
                  <el-input
                    v-model="passwordForm.oldPassword"
                    type="password"
                    placeholder="请输入原密码"
                    maxlength="16"
                    show-password
                      class="form-input security-input"
                  />
                </el-form-item>
              </div>
              
              <div class="form-item">
                  <label class="form-label">
                    <el-icon class="label-icon"><Lock /></el-icon>
                    新密码
                  </label>
                <el-form-item prop="newPassword">
                  <el-input
                    v-model="passwordForm.newPassword"
                    type="password"
                      placeholder="请输入新密码（6-16位字符）"
                    maxlength="16"
                    show-password
                      class="form-input security-input"
                  />
                </el-form-item>
                  <div class="security-hint">
                    <el-icon class="hint-icon"><Lock /></el-icon>
                    <span>建议使用字母、数字和特殊字符组合</span>
                  </div>
              </div>
              
              <div class="form-item">
                  <label class="form-label">
                    <el-icon class="label-icon"><Lock /></el-icon>
                    确认新密码
                  </label>
                <el-form-item prop="confirmPassword">
                  <el-input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    placeholder="请再次输入新密码"
                    maxlength="16"
                    show-password
                      class="form-input security-input"
                  />
                </el-form-item>
              </div>
            </div>
            </div>
          
            <div class="form-actions">
              <el-button @click="cancelPasswordChange" :disabled="isPasswordLoading" class="reset-btn">
              取消
            </el-button>
            <el-button 
              type="primary" 
              @click="confirmPasswordChange" 
              :loading="isPasswordLoading"
                class="save-btn"
            >
              确认修改
            </el-button>
          </div>
          </el-form>
        </div>
      </div>
          </div>
        </div>
        

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElButton, ElIcon, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElInputNumber } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-select.css'
import 'element-plus/theme-chalk/el-option.css'
import 'element-plus/theme-chalk/el-input-number.css'
import { ArrowLeft, User, Edit, Lock, Calendar } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { getStudentProfile, updateStudentInfo, changePassword } from '@/api/student'
import { getMyAttendanceCount } from '@/api/attendance'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const themeStore = useThemeStore()
const formRef = ref()
const passwordFormRef = ref()
const isLoading = ref(false)
const isEditing = ref(false)
const showPasswordSection = ref(false)
const isPasswordLoading = ref(false)
const attendanceCount = ref(null)

const formData = reactive({
  name: '',
  studentId: '',
  gender: '',
  phoneNumber: '',
  college: '',
  major: '',
  grade: null,
  classNum: null,
  password: ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
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
  ],
  password: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码长度在6到16个字符', trigger: 'blur' }
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


const originalData = ref({})

const goBack = () => {
  router.push('/navigation')
}

const toggleTheme = () => {
  themeStore.toggleTheme()
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
    resetForm()
    isEditing.value = false
    ElMessage.success('已取消编辑')
  } else {
    isEditing.value = true
  }
}

const resetForm = () => {
  Object.assign(formData, originalData.value)
  formData.password = ''
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

const togglePasswordSection = () => {
  showPasswordSection.value = !showPasswordSection.value
  if (showPasswordSection.value) {
  resetPasswordForm()
  }
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
  showPasswordSection.value = false
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
      showPasswordSection.value = false
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

const saveProfile = async () => {
  if (isLoading.value) {
    ElMessage.warning('系统正在加载中，请稍后重试')
    return
  }
  
  if (!formRef.value) {
    ElMessage.warning('表单未初始化，请稍后重试')
    return
  }
  
  try {
    await formRef.value.validate()
  } catch (error) {
    ElMessage.warning('请先完善表单信息')
    return
  }
  
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      ElMessage.error('请先登录')
      router.push('/login')
      return
    }

    const updateData = { ...formData }

    const response = await updateStudentInfo(token, updateData)
    
    if (response.code === 200) {
      ElMessage.success('个人信息更新成功')
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      originalData.value = { ...formData }
      formData.password = ''
      isEditing.value = false
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
    isLoading.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: var(--bg-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  position: relative;
  overflow-x: hidden;
}

.background-effects {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: float 20s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  top: 50%;
  right: -150px;
  animation-delay: 5s;
}

.orb-3 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  bottom: -175px;
  left: 20%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.content-wrapper {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

.page-header {
  position: relative;
  z-index: 2;
  padding: 24px 40px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--glass-border);
  box-shadow: 0 4px 12px var(--shadow-color);
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.back-btn {
  width: 40px;
  height: 40px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.logo {
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.logo:hover {
  transform: scale(1.1) rotate(5deg);
  filter: brightness(1.2);
}

.title-section h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-section p {
  font-size: 14px;
  color: var(--text-tertiary);
  margin: 5px 0 0 0;
  font-weight: 500;
}

.main-content {
  padding: 32px 40px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.profile-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 8px 32px var(--shadow-color);
  border: 1px solid var(--glass-border);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.profile-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--primary-gradient);
  transform: translateX(-100%);
  transition: transform 0.4s ease-out;
}

.profile-card:hover::before {
  transform: translateX(0);
}

.profile-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px var(--shadow-hover);
  border-color: var(--primary-color);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border-radius: 24px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f1f5f9;
  border-top: 3px solid #3b82f6;
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
  border-bottom: 2px solid var(--border-color);
  position: relative;
}

.profile-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 60px;
  height: 2px;
  background: var(--primary-gradient);
  border-radius: 2px;
}

.user-info-section {
  display: flex;
  align-items: center;
  gap: 24px;
}

.avatar-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar {
  width: 90px;
  height: 90px;
  background: var(--primary-gradient);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  border: 3px solid var(--glass-bg);
}

.avatar:hover {
  transform: scale(1.05) rotate(5deg);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
}

.avatar-icon {
  font-size: 32px;
  color: white;
}

.avatar-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  background: #10b981;
  border: 3px solid white;
  border-radius: 50%;
}

.user-details {
  flex: 1;
}

.user-details h2 {
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 6px 0;
  color: var(--text-primary);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.student-id {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
  font-weight: 500;
}

.user-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-secondary);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: var(--bg-tertiary);
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.stat-icon {
  font-size: 16px;
  color: var(--primary-color);
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.edit-btn {
  background: var(--primary-gradient);
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 14px;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.form-section {
  margin-bottom: 32px;
}

.section-header {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  position: relative;
  overflow: hidden;
}

.section-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--primary-gradient);
  opacity: 0.6;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.section-icon {
  font-size: 24px;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 8px;
  border-radius: 8px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.security-icon-large {
  font-size: 28px;
  color: #667eea;
  background: rgba(102, 126, 234, 0.15);
  padding: 10px;
  border-radius: 10px;
  border: 2px solid rgba(102, 126, 234, 0.3);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.section-header h3 {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px 0;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-header p {
  font-size: 14px;
  color: var(--text-tertiary);
  margin: 0;
  font-weight: 500;
}

.security-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #667eea;
}

.security-badge .badge-icon {
  font-size: 16px;
}

.security-header {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 100%);
  border-color: rgba(102, 126, 234, 0.3);
}

.security-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 8px;
  font-size: 13px;
  color: #10b981;
  font-weight: 500;
}

.security-tip .tip-icon {
  font-size: 16px;
}

.label-icon {
  font-size: 14px;
  color: #667eea;
  margin-right: 6px;
  vertical-align: middle;
}

.security-input {
  border: 2px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
}

.security-input:hover {
  border-color: rgba(102, 126, 234, 0.4);
}

.security-input:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.security-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 8px 12px;
  background: rgba(102, 126, 234, 0.05);
  border-left: 3px solid #667eea;
  border-radius: 4px;
  font-size: 12px;
  color: var(--text-tertiary);
}

.security-hint .hint-icon {
  font-size: 14px;
  color: #667eea;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
}

.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid var(--border-color);
}

.reset-btn {
  flex: 1;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  border: 2px solid var(--border-color);
  color: var(--text-primary);
  height: 44px;
  background: var(--bg-secondary);
  transition: all 0.3s ease;
}

.reset-btn:hover {
  border-color: var(--text-tertiary);
  background: var(--bg-tertiary);
  transform: translateY(-2px);
}

.save-btn {
  flex: 1;
  background: var(--primary-gradient);
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  height: 44px;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.password-section {
  margin-top: 32px;
}

.security-card {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--glass-border);
  box-shadow: 0 4px 16px var(--shadow-color);
  transition: all 0.3s ease;
}

.security-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px var(--shadow-hover);
  border-color: var(--primary-color);
}

.security-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.security-icon {
  width: 56px;
  height: 56px;
  background: var(--primary-gradient);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.security-card:hover .security-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.security-content h4 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px 0;
}

.security-content p {
  font-size: 14px;
  color: var(--text-tertiary);
  margin: 0;
  font-weight: 500;
}

.security-btn {
  background: var(--primary-gradient);
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 14px;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.security-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}


.password-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.password-content {
  padding: 0;
}

.password-header {
  text-align: center;
  padding: 32px 32px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
}

.password-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
}

.password-dialog .password-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.password-header h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: white;
}

.password-header p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.password-body {
  padding: 32px;
  background: white;
}

.password-form {
  margin-bottom: 24px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.password-input {
  width: 100%;
}

.password-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

:deep(.password-dialog .el-dialog__body) {
  padding: 0;
}

:deep(.password-dialog .el-dialog__header) {
  display: none;
}

:deep(.password-input .el-input__wrapper) {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: none;
  transition: all 0.3s ease;
  height: 44px;
  background: #f9fafb;
}

:deep(.password-input .el-input__wrapper:hover) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
}

:deep(.password-input .el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  background: white;
}

:deep(.password-input .el-input__inner) {
  color: #374151;
  font-size: 14px;
}

:deep(.password-input .el-input__inner::placeholder) {
  color: #9ca3af;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  box-shadow: none;
  transition: all 0.2s ease;
  height: 40px;
}

:deep(.el-input__wrapper:hover) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1);
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 8px;
}

:deep(.el-input-number .el-input__wrapper) {
  border-radius: 8px;
}

:deep(.el-form-item__error) {
  font-size: 12px;
  margin-top: 4px;
}

html.dark .profile-container {
  background: var(--bg-primary);
}

html.dark .page-header {
  background: var(--glass-bg);
  border-bottom-color: var(--glass-border);
  box-shadow: 0 4px 12px var(--shadow-color);
}

html.dark .back-btn {
  background: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

html.dark .back-btn:hover {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

html.dark .title-section h1 {
  color: var(--text-primary);
}

html.dark .title-section p {
  color: var(--text-tertiary);
}

html.dark .profile-card {
  background: var(--glass-bg);
  border-color: var(--glass-border);
  box-shadow: 0 8px 32px var(--shadow-color);
}

html.dark .profile-card:hover {
  box-shadow: 0 16px 48px var(--shadow-hover);
}

html.dark .user-details h2 {
  color: var(--text-primary);
}

html.dark .student-id {
  color: var(--text-secondary);
}

html.dark .stat-item {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

html.dark .stat-item:hover {
  background: var(--bg-tertiary);
  border-color: var(--primary-color);
}

html.dark .section-header h3 {
  color: var(--text-primary);
}

html.dark .section-header p {
  color: var(--text-tertiary);
}

html.dark .form-label {
  color: var(--text-primary);
}

html.dark .reset-btn {
  background: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

html.dark .reset-btn:hover {
  background: var(--bg-tertiary);
  border-color: var(--text-tertiary);
}

html.dark .save-btn {
  background: var(--primary-gradient);
}

html.dark .cancel-btn {
  background: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

html.dark .cancel-btn:hover {
  background: var(--bg-tertiary);
  border-color: var(--text-tertiary);
}

html.dark .confirm-btn {
  background: var(--primary-gradient);
}

html.dark .security-card {
  background: var(--glass-bg);
  border-color: var(--glass-border);
}

html.dark .security-content h4 {
  color: var(--text-primary);
}

html.dark .security-content p {
  color: var(--text-tertiary);
}

html.dark .security-btn {
  background: var(--primary-gradient);
}

html.dark .confirm-header {
  background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%);
}

html.dark .confirm-form {
  background: var(--bg-primary);
}

html.dark :deep(.password-input .el-input__wrapper) {
  background-color: var(--bg-secondary);
  border-color: var(--border-color);
}

html.dark :deep(.password-input .el-input__wrapper:hover) {
  border-color: var(--primary-color);
  background-color: var(--bg-tertiary);
}

html.dark :deep(.password-input .el-input__wrapper.is-focus) {
  border-color: var(--primary-color);
}

html.dark :deep(.password-input .el-input__inner) {
  color: var(--text-primary);
}

html.dark :deep(.password-input .el-input__suffix-inner .el-icon) {
  color: var(--text-tertiary);
}

html.dark :deep(.password-input .el-input__suffix-inner .el-icon:hover) {
  color: var(--primary-color);
}

html.dark .cancel-btn {
  background: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

html.dark .cancel-btn:hover {
  background: var(--bg-tertiary);
  border-color: var(--text-tertiary);
}

html.dark .confirm-btn {
  background: var(--primary-gradient);
}

html.dark .password-header {
  background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%);
}

html.dark .password-body {
  background: #1e293b;
}

html.dark .form-label {
  color: #e2e8f0;
}

html.dark {
  --el-input-bg-color: #000000 !important;
  --el-input-text-color: #ffffff !important;
  --el-input-border-color: #ffffff !important;
  --el-input-hover-border-color: #ffffff !important;
  --el-input-focus-border-color: #ffffff !important;
  --el-input-placeholder-color: #ffffff !important;
}

html:not(.dark) {
  --el-input-bg-color: #ffffff !important;
  --el-input-text-color: #000000 !important;
  --el-input-border-color: #d1d5db !important;
  --el-input-hover-border-color: #3b82f6 !important;
  --el-input-focus-border-color: #3b82f6 !important;
  --el-input-placeholder-color: #9ca3af !important;
}

html.dark .password-input {
  --el-input-text-color: #ffffff !important;
  --el-input-bg-color: #000000 !important;
  --el-input-border-color: #ffffff !important;
  --el-input-hover-border-color: #ffffff !important;
  --el-input-focus-border-color: #ffffff !important;
  --el-input-placeholder-color: #ffffff !important;
}

html.dark .password-input .el-input__wrapper {
  background: #000000 !important;
  border-color: #ffffff !important;
  color: #ffffff !important;
}

html.dark .password-input .el-input__wrapper:hover {
  background: #000000 !important;
  border-color: #ffffff !important;
}

html.dark .password-input .el-input__wrapper.is-focus {
  background: #000000 !important;
  border-color: #ffffff !important;
}

html.dark .password-input .el-input__inner {
  color: #ffffff !important;
  background: #000000 !important;
}

html.dark .password-input .el-input__inner::placeholder {
  color: #ffffff !important;
}

html.dark :deep(.password-input .el-input__wrapper) {
  background: #000000 !important;
  border-color: #ffffff !important;
  color: #ffffff !important;
}

html.dark :deep(.password-input .el-input__wrapper:hover) {
  background: #000000 !important;
  border-color: #ffffff !important;
}

html.dark :deep(.password-input .el-input__wrapper.is-focus) {
  background: #000000 !important;
  border-color: #ffffff !important;
}

html.dark :deep(.password-input .el-input__inner) {
  color: #ffffff !important;
  background: #000000 !important;
}

html.dark :deep(.password-input .el-input__inner::placeholder) {
  color: #ffffff !important;
}

html.dark .password-input input {
  color: #ffffff !important;
  background: #000000 !important;
}

html.dark .password-input input::placeholder {
  color: #ffffff !important;
}

html.dark .password-input input[type="password"] {
  color: #ffffff !important;
  background: #000000 !important;
}

html.dark .password-input input[type="text"] {
  color: #ffffff !important;
  background: #000000 !important;
}

html.dark .password-input .el-input__suffix {
  color: #ffffff !important;
}

html.dark .password-input .el-input__prefix {
  color: #ffffff !important;
}

html.dark .password-input .el-input__suffix-inner {
  color: #ffffff !important;
}

html.dark .el-input__inner {
  background-color: #000000 !important;
  color: #ffffff !important;
}

html.dark .el-input__wrapper {
  background-color: #000000 !important;
  color: #ffffff !important;
}

html:not(.dark) .el-input__inner {
  background-color: #ffffff !important;
  color: #000000 !important;
}

html:not(.dark) .el-input__wrapper {
  background-color: #ffffff !important;
  color: #000000 !important;
}

html.dark .password-input .el-input__wrapper,
html.dark .password-input .el-input__inner,
html.dark .password-input input {
  background: #000000 !important;
  color: #ffffff !important;
}

html.dark .password-input .el-input__wrapper * {
  background: #000000 !important;
  color: #ffffff !important;
}
</style>