<template>
  <div class="profile-container">
    <div class="header">
      <div class="header-content">
        <el-button @click="goBack" class="back-btn" type="primary" :icon="ArrowLeft" circle></el-button>
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊" class="logo" @click="toggleTheme">
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

        <div class="form-section">
          <div class="section-header">
            <h3>基本信息</h3>
            <p>管理您的个人资料信息</p>
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
              </div>
              
              <div class="form-group">
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
              </div>
              
              <div class="form-group">
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
              </div>
              
              <div class="form-group">
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
            <el-button type="primary" :icon="Lock" @click="showPasswordDialog" class="security-btn">
              修改密码
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-if="passwordDialogVisible"
      v-model="passwordDialogVisible"
      width="480px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center
      class="password-dialog"
      destroy-on-close
      @close="handlePasswordDialogClose"
    >
      <div class="password-content">
        <div class="password-header">
          <div class="password-icon">
            <el-icon><Lock /></el-icon>
          </div>
          <h3>修改密码</h3>
          <p>为了账户安全，请设置新密码</p>
        </div>
        
        <div class="password-body">
          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            class="password-form"
          >
            <div class="form-section">
              <div class="form-item">
                <label class="form-label">原密码</label>
                <el-form-item prop="oldPassword">
                  <el-input
                    v-model="passwordForm.oldPassword"
                    type="password"
                    placeholder="请输入原密码"
                    maxlength="16"
                    show-password
                    class="form-input"
                  />
                </el-form-item>
              </div>
              
              <div class="form-item">
                <label class="form-label">新密码</label>
                <el-form-item prop="newPassword">
                  <el-input
                    v-model="passwordForm.newPassword"
                    type="password"
                    placeholder="请输入新密码"
                    maxlength="16"
                    show-password
                    class="form-input"
                  />
                </el-form-item>
              </div>
              
              <div class="form-item">
                <label class="form-label">确认新密码</label>
                <el-form-item prop="confirmPassword">
                  <el-input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    placeholder="请再次输入新密码"
                    maxlength="16"
                    show-password
                    class="form-input"
                  />
                </el-form-item>
              </div>
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
      </div>
    </el-dialog>

    <el-dialog
      v-model="passwordConfirmDialogVisible"
      width="360px"
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

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, User, Edit, Lock, Calendar } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { getStudentProfile, updateStudentInfo, changePassword, getMyAttendanceCount } from '@/api/user'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const themeStore = useThemeStore()
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
const isPasswordDialogClosing = ref(false)

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
}

const handlePasswordDialogClose = () => {
  isPasswordDialogClosing.value = false
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

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  position: relative;
}

.header {
  position: relative;
  z-index: 1;
  padding: 20px 40px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.back-btn {
  width: 40px;
  height: 40px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #475569;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}

.logo {
  width: 36px;
  height: 36px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.title-section h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #1e293b;
}

.title-section p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.main-content {
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.profile-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
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
  border-radius: 16px;
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
  border-bottom: 1px solid #e2e8f0;
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
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
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
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1e293b;
}

.student-id {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 12px 0;
}

.user-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f1f5f9;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  color: #475569;
}

.stat-icon {
  font-size: 14px;
  color: #3b82f6;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.edit-btn {
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
  font-size: 14px;
  color: white;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.form-section {
  margin-bottom: 32px;
}

.section-header {
  margin-bottom: 24px;
}

.section-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.section-header p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
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
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.reset-btn {
  flex: 1;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  border: 1px solid #d1d5db;
  color: #374151;
  height: 40px;
  background: white;
}

.save-btn {
  flex: 1;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  height: 40px;
  color: white;
}

.password-section {
  margin-top: 32px;
}

.security-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e2e8f0;
}

.security-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.security-icon {
  width: 48px;
  height: 48px;
  background: #3b82f6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.security-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.security-content p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.security-btn {
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
  font-size: 14px;
  color: white;
}

.confirm-dialog {
  border-radius: 12px;
  overflow: hidden;
}

.confirm-content {
  padding: 0;
}

.confirm-header {
  text-align: center;
  padding: 24px 24px 20px;
  background: #3b82f6;
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
  font-weight: 600;
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
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  border: 1px solid #d1d5db;
  color: #374151;
  height: 40px;
  background: white;
}

.confirm-btn {
  flex: 1;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  height: 40px;
  color: white;
}

:deep(.confirm-dialog .el-dialog__body) {
  padding: 0;
}

:deep(.confirm-dialog .el-dialog__header) {
  display: none;
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
  background: #0f172a;
}

html.dark .header {
  background: #1e293b;
  border-bottom: 1px solid #334155;
}

html.dark .back-btn {
  background: #334155;
  border: 1px solid #475569;
  color: #e2e8f0;
}

html.dark .back-btn:hover {
  background: #475569;
}

html.dark .title-section h1 {
  color: #f1f5f9;
}

html.dark .title-section p {
  color: #94a3b8;
}

html.dark .profile-card {
  background: #1e293b;
  border: 1px solid #334155;
}

html.dark .user-details h2 {
  color: #f1f5f9;
}

html.dark .student-id {
  color: #94a3b8;
}

html.dark .stat-item {
  background: #334155;
  color: #cbd5e1;
}

html.dark .section-header h3 {
  color: #f1f5f9;
}

html.dark .section-header p {
  color: #94a3b8;
}

html.dark .form-label {
  color: #e2e8f0;
}

html.dark .reset-btn {
  background: #334155;
  border: 1px solid #475569;
  color: #e2e8f0;
}

html.dark .reset-btn:hover {
  background: #475569;
  border-color: #64748b;
}

html.dark .cancel-btn {
  background: #334155;
  border: 1px solid #475569;
  color: #e2e8f0;
}

html.dark .cancel-btn:hover {
  background: #475569;
  border-color: #64748b;
}

html.dark .security-card {
  background: #334155;
  border: 1px solid #475569;
}

html.dark .security-content h4 {
  color: #f1f5f9;
}

html.dark .security-content p {
  color: #94a3b8;
}

html.dark .confirm-header {
  background: #1d4ed8;
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