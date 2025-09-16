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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, User, Edit, Lock, Calendar } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { getStudentProfile, updateStudentInfo, changePassword, getMyAttendanceCount } from '@/api/user'

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
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  margin-top: 8px;
  width: fit-content;
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
}
</style>
