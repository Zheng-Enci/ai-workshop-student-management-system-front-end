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
            <div class="avatar-wrapper">
              <div class="avatar-container" @click="handleAvatarClick">
                <div class="avatar" :class="{ 'avatar-loading': avatarLoading }">
                  <img 
                    v-if="avatarUrl && !avatarLoading" 
                    :src="avatarUrl" 
                    alt="头像" 
                    class="avatar-image"
                    @error="handleAvatarError"
                  />
                  <el-icon v-else class="avatar-icon"><User /></el-icon>
                  <div v-if="avatarLoading" class="avatar-loading-spinner"></div>
                </div>
                <div class="avatar-status"></div>
                <div class="avatar-upload-overlay">
                  <el-icon class="upload-icon"><Camera /></el-icon>
                  <span class="upload-text">点击上传头像</span>
                </div>
                <input 
                  ref="fileInputRef"
                  type="file" 
                  accept="image/*" 
                  style="display: none"
                  @change="handleFileSelect"
                />
              </div>
              <div class="avatar-tip">
                <el-icon class="tip-icon"><Camera /></el-icon>
                <span class="tip-text">{{ avatarUrl ? '点击头像修改头像' : '点击头像上传头像' }}</span>
              </div>
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
              
              <div class="form-item">
                <label class="form-label">当前密码</label>
                <el-form-item prop="password">
                  <el-input 
                    v-model="formData.password" 
                    type="password"
                    :disabled="!isEditing"
                    placeholder="请输入当前密码以确认身份"
                    maxlength="16"
                    show-password
                    class="form-input"
                  />
                </el-form-item>
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
        
        <!-- 头像裁剪对话框 -->
        <el-dialog
          v-model="cropDialogVisible"
          title="裁剪头像"
          width="90%"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
        >
          <div class="crop-container">
            <div class="crop-wrapper" ref="cropWrapperRef">
              <canvas ref="cropCanvasRef" class="crop-canvas"></canvas>
              <div class="crop-box" ref="cropBoxRef"></div>
            </div>
            <div class="crop-controls">
              <el-button @click="zoomOut" :icon="ZoomOut" circle size="small"></el-button>
              <span class="zoom-info">{{ Math.round(scale * 100) }}%</span>
              <el-button @click="zoomIn" :icon="ZoomIn" circle size="small"></el-button>
              <el-button @click="resetCrop" size="small" style="margin-left: 12px;">重置</el-button>
            </div>
          </div>
          <template #footer>
            <el-button @click="cancelCrop">取消</el-button>
            <el-button type="primary" @click="confirmCrop" :loading="isCropping">确认裁剪</el-button>
          </template>
        </el-dialog>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElButton, ElIcon, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElInputNumber, ElDialog } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-select.css'
import 'element-plus/theme-chalk/el-option.css'
import 'element-plus/theme-chalk/el-input-number.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-scrollbar.css'
import 'element-plus/theme-chalk/base.css'
import { ArrowLeft, User, Edit, Lock, Calendar, Camera, ZoomIn, ZoomOut } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { getStudentProfile, updateStudentInfo, changePassword, uploadAvatar, getAvatarUrl, getStudentDatabaseTableId } from '@/api/student'
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
const studentInfoId = ref(null)
const avatarUrl = ref(null)
const avatarLoading = ref(false)
const isUploading = ref(false)
const fileInputRef = ref(null)
const cropDialogVisible = ref(false)
const cropCanvasRef = ref(null)
const cropWrapperRef = ref(null)
const cropBoxRef = ref(null)
const originalImageFile = ref(null)
const cropImage = ref(null)
const scale = ref(1)
const imageX = ref(0)
const imageY = ref(0)
const isCropping = ref(false)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const dragStartImageX = ref(0)
const dragStartImageY = ref(0)
// 触摸捏合缩放相关
const isPinching = ref(false)
const initialPinchDistance = ref(0)
const initialPinchScale = ref(1)
const initialPinchCenterX = ref(0)
const initialPinchCenterY = ref(0)
// 保存事件监听器引用，用于移除
let mouseDownHandler = null
let mouseMoveHandler = null
let mouseUpHandler = null
let wheelHandler = null
let touchStartHandler = null
let touchMoveHandler = null
let touchEndHandler = null

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

    const [profileResponse, attendanceResponse, studentIdResponse] = await Promise.all([
      getStudentProfile(token),
      getMyAttendanceCount(token),
      getStudentDatabaseTableId(token)
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

    if (studentIdResponse.code === 200) {
      studentInfoId.value = studentIdResponse.data
      await loadAvatar()
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

const loadAvatar = async () => {
  if (!studentInfoId.value) return
  
  avatarLoading.value = true
  try {
    const url = getAvatarUrl(studentInfoId.value)
    if (!url) {
      avatarUrl.value = null
      return
    }
    
    // 使用Image对象检测头像是否存在
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    const checkAvatar = new Promise((resolve) => {
      img.onload = () => {
        resolve(true)
      }
      img.onerror = () => {
        resolve(false)
      }
      // 设置超时，避免长时间等待
      setTimeout(() => resolve(false), 5000)
      img.src = url + '?t=' + Date.now()
    })
    
    const hasAvatar = await checkAvatar
    if (hasAvatar) {
      avatarUrl.value = url + '?t=' + Date.now()
    } else {
      avatarUrl.value = null
    }
  } catch (error) {
    console.error('加载头像失败:', error)
    avatarUrl.value = null
  } finally {
    avatarLoading.value = false
  }
}

const handleAvatarError = () => {
  avatarUrl.value = null
}

const handleAvatarClick = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // 文件类型验证
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }

  try {
    // 保存原始文件，显示裁剪对话框
    originalImageFile.value = file
    await showCropDialog(file)
  } catch (error) {
    console.error('显示裁剪对话框失败:', error)
    ElMessage.error('图片加载失败：' + error.message)
  } finally {
    // 清空文件选择，允许重复选择同一文件
    event.target.value = ''
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

/**
 * 显示裁剪对话框
 */
const showCropDialog = async (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          cropImage.value = img
          cropDialogVisible.value = true
          
          // 等待DOM更新后初始化裁剪
          nextTick(() => {
            setTimeout(() => {
              initCrop()
            }, 500)
          })
          resolve()
        }
        img.onerror = (error) => {
          console.error('图片加载失败:', error)
          reject(new Error('图片加载失败'))
        }
        img.src = e.target.result
      }
      reader.onerror = (error) => {
        console.error('文件读取失败:', error)
        reject(new Error('文件读取失败'))
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('显示裁剪对话框异常:', error)
      reject(error)
    }
  })
}

/**
 * 初始化裁剪
 */
const initCrop = () => {
  if (!cropCanvasRef.value || !cropImage.value || !cropWrapperRef.value) {
    console.error('初始化裁剪失败：缺少必要的引用')
    return
  }
  
  const canvas = cropCanvasRef.value
  const wrapper = cropWrapperRef.value
  const img = cropImage.value
  
  // 设置画布尺寸（移动端适配）
  let wrapperWidth = wrapper.clientWidth
  const wrapperHeight = 300 // 移动端固定高度较小
  
  if (wrapperWidth === 0) {
    wrapperWidth = wrapper.offsetWidth || 320
  }
  
  // 设置Canvas的实际像素尺寸
  canvas.width = wrapperWidth
  canvas.height = wrapperHeight
  
  // 确保Canvas的CSS尺寸与实际尺寸一致
  canvas.style.width = wrapperWidth + 'px'
  canvas.style.height = wrapperHeight + 'px'
  
  // 计算初始缩放比例，使图片适应画布
  const imgAspect = img.width / img.height
  const wrapperAspect = wrapperWidth / wrapperHeight
  
  if (imgAspect > wrapperAspect) {
    scale.value = wrapperWidth / img.width * 0.8
  } else {
    scale.value = wrapperHeight / img.height * 0.8
  }
  
  // 居中显示
  imageX.value = (wrapperWidth - img.width * scale.value) / 2
  imageY.value = (wrapperHeight - img.height * scale.value) / 2
  
  // 初始化裁剪框（正方形，位于中心）
  const cropSize = Math.min(wrapperWidth * 0.7, wrapperHeight * 0.7, 250)
  const cropBox = cropBoxRef.value
  if (cropBox) {
    cropBox.style.width = cropSize + 'px'
    cropBox.style.height = cropSize + 'px'
    cropBox.style.left = (wrapperWidth - cropSize) / 2 + 'px'
    cropBox.style.top = (wrapperHeight - cropSize) / 2 + 'px'
  }
  
  // 先绘制一次，确保内容显示
  drawCropCanvas()
  setupCropEvents()
}

/**
 * 绘制裁剪画布
 */
const drawCropCanvas = () => {
  if (!cropCanvasRef.value || !cropImage.value) {
    return
  }
  
  const canvas = cropCanvasRef.value
  const ctx = canvas.getContext('2d')
  const img = cropImage.value
  
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 绘制半透明背景
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // 绘制图片
  const imgWidth = img.width * scale.value
  const imgHeight = img.height * scale.value
  
  ctx.save()
  ctx.globalCompositeOperation = 'source-over'
  ctx.drawImage(img, imageX.value, imageY.value, imgWidth, imgHeight)
  
  // 绘制裁剪框外的遮罩
  if (cropBoxRef.value) {
    const cropBox = cropBoxRef.value
    const cropRect = cropBox.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()
    
    let cropX, cropY, cropSize
    
    if (cropRect.width > 0) {
      cropX = cropRect.left - canvasRect.left
      cropY = cropRect.top - canvasRect.top
      cropSize = cropRect.width
    } else {
      const left = parseFloat(cropBox.style.left) || 0
      const top = parseFloat(cropBox.style.top) || 0
      cropSize = parseFloat(cropBox.style.width) || 250
      cropX = left
      cropY = top
    }
    
    // 使用destination-out模式清除裁剪框区域
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillRect(cropX, cropY, cropSize, cropSize)
  }
  
  ctx.restore()
}

/**
 * 设置裁剪事件（移动端支持触摸）
 */
const setupCropEvents = () => {
  if (!cropCanvasRef.value) return
  
  // 先移除旧的事件监听器
  removeCropEvents()
  
  const canvas = cropCanvasRef.value
  
  // 鼠标/触摸按下
  mouseDownHandler = (e) => {
    const target = e.target
    if (target === canvas || target === cropWrapperRef.value || 
        (cropWrapperRef.value && cropWrapperRef.value.contains(target))) {
      if (cropBoxRef.value && cropBoxRef.value.contains(target)) {
        return
      }
      e.preventDefault()
      e.stopPropagation()
      isDragging.value = true
      dragStartX.value = e.clientX || e.touches?.[0]?.clientX || 0
      dragStartY.value = e.clientY || e.touches?.[0]?.clientY || 0
      dragStartImageX.value = imageX.value
      dragStartImageY.value = imageY.value
      canvas.style.cursor = 'grabbing'
    }
  }
  
  // 鼠标/触摸移动
  mouseMoveHandler = (e) => {
    if (isDragging.value) {
      e.preventDefault()
      const currentX = e.clientX || e.touches?.[0]?.clientX || 0
      const currentY = e.clientY || e.touches?.[0]?.clientY || 0
      const deltaX = currentX - dragStartX.value
      const deltaY = currentY - dragStartY.value
      imageX.value = dragStartImageX.value + deltaX
      imageY.value = dragStartImageY.value + deltaY
      drawCropCanvas()
    }
  }
  
  // 鼠标/触摸释放
  mouseUpHandler = () => {
    if (isDragging.value) {
      isDragging.value = false
      if (canvas) {
        canvas.style.cursor = 'move'
      }
    }
  }
  
  // 滚轮缩放
  wheelHandler = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const oldScale = scale.value
    const delta = e.deltaY > 0 ? -0.01 : 0.01
    const newScale = Math.max(0.1, Math.min(5, scale.value + delta))
    
    if (newScale === oldScale) {
      return
    }
    
    // 以裁剪框中心为基准进行缩放
    if (cropBoxRef.value && cropCanvasRef.value) {
      const cropBox = cropBoxRef.value
      const canvas = cropCanvasRef.value
      const cropRect = cropBox.getBoundingClientRect()
      const canvasRect = canvas.getBoundingClientRect()
      
      const cropCenterX = (cropRect.left - canvasRect.left) + cropRect.width / 2
      const cropCenterY = (cropRect.top - canvasRect.top) + cropRect.height / 2
      
      const scaleRatio = newScale / oldScale
      
      imageX.value = cropCenterX - (cropCenterX - imageX.value) * scaleRatio
      imageY.value = cropCenterY - (cropCenterY - imageY.value) * scaleRatio
    }
    
    scale.value = newScale
    drawCropCanvas()
  }
  
  // 计算两点之间的距离
  const getDistance = (touch1, touch2) => {
    const dx = touch2.clientX - touch1.clientX
    const dy = touch2.clientY - touch1.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }
  
  // 计算两点的中心点
  const getCenter = (touch1, touch2) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    }
  }
  
  // 触摸事件（移动端）
  touchStartHandler = (e) => {
    const target = e.target
    if (target === canvas || target === cropWrapperRef.value || 
        (cropWrapperRef.value && cropWrapperRef.value.contains(target))) {
      if (cropBoxRef.value && cropBoxRef.value.contains(target)) {
        return
      }
      
      // 检测是否有两个触摸点（捏合手势）
      if (e.touches.length === 2) {
        e.preventDefault()
        e.stopPropagation()
        
        // 开始捏合缩放
        isPinching.value = true
        isDragging.value = false
        
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        
        // 记录初始距离和缩放比例
        initialPinchDistance.value = getDistance(touch1, touch2)
        initialPinchScale.value = scale.value
        
        // 计算初始中心点（在画布上的坐标）
        const center = getCenter(touch1, touch2)
        const canvasRect = canvas.getBoundingClientRect()
        initialPinchCenterX.value = center.x - canvasRect.left
        initialPinchCenterY.value = center.y - canvasRect.top
      } else if (e.touches.length === 1) {
        // 单点触摸，处理拖动
        mouseDownHandler(e)
      }
    }
  }
  
  touchMoveHandler = (e) => {
    if (isPinching.value && e.touches.length === 2) {
      // 处理捏合缩放
      e.preventDefault()
      e.stopPropagation()
      
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const currentDistance = getDistance(touch1, touch2)
      
      // 计算缩放比例
      const distanceRatio = currentDistance / initialPinchDistance.value
      const newScale = Math.max(0.1, Math.min(5, initialPinchScale.value * distanceRatio))
      
      // 计算当前中心点（在画布上的坐标）
      const center = getCenter(touch1, touch2)
      const canvasRect = canvas.getBoundingClientRect()
      const currentCenterX = center.x - canvasRect.left
      const currentCenterY = center.y - canvasRect.top
      
      // 以中心点为基准进行缩放
      const scaleRatio = newScale / scale.value
      imageX.value = currentCenterX - (currentCenterX - imageX.value) * scaleRatio
      imageY.value = currentCenterY - (currentCenterY - imageY.value) * scaleRatio
      
      scale.value = newScale
      drawCropCanvas()
    } else if (isDragging.value && e.touches.length === 1) {
      // 单点拖动
      mouseMoveHandler(e)
    } else if (e.touches.length === 1 && !isPinching.value) {
      // 从捏合变为单点，开始拖动
      mouseDownHandler(e)
    }
  }
  
  touchEndHandler = (e) => {
    if (isPinching.value) {
      // 结束捏合
      isPinching.value = false
      initialPinchDistance.value = 0
    }
    
    if (e.touches.length === 0) {
      // 所有触摸点都释放了
      mouseUpHandler()
    } else if (e.touches.length === 1) {
      // 从两个触摸点变为一个，重置拖动状态
      isDragging.value = false
      const touch = e.touches[0]
      dragStartX.value = touch.clientX
      dragStartY.value = touch.clientY
      dragStartImageX.value = imageX.value
      dragStartImageY.value = imageY.value
    }
  }
  
  // 添加事件监听器
  canvas.addEventListener('mousedown', mouseDownHandler)
  canvas.addEventListener('touchstart', touchStartHandler, { passive: false })
  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('touchmove', touchMoveHandler, { passive: false })
  document.addEventListener('mouseup', mouseUpHandler)
  document.addEventListener('touchend', touchEndHandler)
  canvas.addEventListener('wheel', wheelHandler)
  
  canvas.style.cursor = 'move'
}

/**
 * 移除裁剪事件
 */
const removeCropEvents = () => {
  if (!cropCanvasRef.value) return
  
  const canvas = cropCanvasRef.value
  
  if (mouseDownHandler) {
    canvas.removeEventListener('mousedown', mouseDownHandler)
  }
  if (touchStartHandler) {
    canvas.removeEventListener('touchstart', touchStartHandler)
  }
  if (mouseMoveHandler) {
    document.removeEventListener('mousemove', mouseMoveHandler)
  }
  if (touchMoveHandler) {
    document.removeEventListener('touchmove', touchMoveHandler)
  }
  if (mouseUpHandler) {
    document.removeEventListener('mouseup', mouseUpHandler)
  }
  if (touchEndHandler) {
    document.removeEventListener('touchend', touchEndHandler)
  }
  if (wheelHandler) {
    canvas.removeEventListener('wheel', wheelHandler)
  }
}

/**
 * 放大
 */
const zoomIn = () => {
  const oldScale = scale.value
  const newScale = Math.min(5, scale.value + 0.1)
  
  if (newScale === oldScale) {
    return
  }
  
  if (cropBoxRef.value && cropCanvasRef.value) {
    const cropBox = cropBoxRef.value
    const canvas = cropCanvasRef.value
    const cropRect = cropBox.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()
    
    const cropCenterX = (cropRect.left - canvasRect.left) + cropRect.width / 2
    const cropCenterY = (cropRect.top - canvasRect.top) + cropRect.height / 2
    
    const scaleRatio = newScale / oldScale
    
    imageX.value = cropCenterX - (cropCenterX - imageX.value) * scaleRatio
    imageY.value = cropCenterY - (cropCenterY - imageY.value) * scaleRatio
  }
  
  scale.value = newScale
  drawCropCanvas()
}

/**
 * 缩小
 */
const zoomOut = () => {
  const oldScale = scale.value
  const newScale = Math.max(0.1, scale.value - 0.1)
  
  if (newScale === oldScale) {
    return
  }
  
  if (cropBoxRef.value && cropCanvasRef.value) {
    const cropBox = cropBoxRef.value
    const canvas = cropCanvasRef.value
    const cropRect = cropBox.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()
    
    const cropCenterX = (cropRect.left - canvasRect.left) + cropRect.width / 2
    const cropCenterY = (cropRect.top - canvasRect.top) + cropRect.height / 2
    
    const scaleRatio = newScale / oldScale
    
    imageX.value = cropCenterX - (cropCenterX - imageX.value) * scaleRatio
    imageY.value = cropCenterY - (cropCenterY - imageY.value) * scaleRatio
  }
  
  scale.value = newScale
  drawCropCanvas()
}

/**
 * 重置裁剪
 */
const resetCrop = () => {
  if (!cropImage.value || !cropWrapperRef.value) return
  initCrop()
}

/**
 * 取消裁剪
 */
const cancelCrop = () => {
  removeCropEvents()
  
  cropDialogVisible.value = false
  cropImage.value = null
  originalImageFile.value = null
  scale.value = 1
  imageX.value = 0
  imageY.value = 0
  isDragging.value = false
  isPinching.value = false
  initialPinchDistance.value = 0
}

/**
 * 确认裁剪
 */
const confirmCrop = async () => {
  if (!cropCanvasRef.value || !cropImage.value || !cropBoxRef.value) return
  
  isCropping.value = true
  try {
    const canvas = cropCanvasRef.value
    const cropBox = cropBoxRef.value
    const img = cropImage.value
    
    // 获取裁剪框位置和尺寸
    const canvasRect = canvas.getBoundingClientRect()
    const cropRect = cropBox.getBoundingClientRect()
    const cropX = cropRect.left - canvasRect.left
    const cropY = cropRect.top - canvasRect.top
    const cropSize = cropRect.width
    
    // 计算裁剪区域在原图中的位置和尺寸
    const sourceX = (cropX - imageX.value) / scale.value
    const sourceY = (cropY - imageY.value) / scale.value
    const sourceSize = cropSize / scale.value
    
    // 创建新的Canvas进行裁剪
    const cropCanvas = document.createElement('canvas')
    cropCanvas.width = cropSize
    cropCanvas.height = cropSize
    const cropCtx = cropCanvas.getContext('2d')
    
    // 绘制裁剪区域
    cropCtx.drawImage(
      img,
      sourceX, sourceY, sourceSize, sourceSize,
      0, 0, cropSize, cropSize
    )
    
    // 转换为Blob
    cropCanvas.toBlob(async (blob) => {
      if (!blob) {
        ElMessage.error('裁剪失败')
        return
      }
      
      // 创建File对象
      const croppedFile = new File([blob], originalImageFile.value?.name || 'avatar.jpg', {
        type: originalImageFile.value?.type || 'image/jpeg',
        lastModified: Date.now()
      })
      
      // 关闭裁剪对话框
      cropDialogVisible.value = false
      
      // 压缩并上传
      try {
        const compressedFile = await compressImage(croppedFile)
        
        // 预览图片
        const reader = new FileReader()
        reader.onload = (e) => {
          avatarUrl.value = e.target.result
        }
        reader.readAsDataURL(compressedFile)
        
        // 上传头像
        await uploadAvatarFile(compressedFile)
      } catch (error) {
        ElMessage.error('图片处理失败：' + error.message)
      } finally {
        isCropping.value = false
        cropImage.value = null
        originalImageFile.value = null
      }
    }, originalImageFile.value?.type || 'image/jpeg', 0.9)
  } catch (error) {
    isCropping.value = false
    ElMessage.error('裁剪失败：' + error.message)
  }
}

/**
 * 压缩图片直到小于2MB
 */
const compressImage = (file, maxSize = 2 * 1024 * 1024) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        let width = img.width
        let height = img.height
        const minDimension = 100
        const quality = 0.9
        
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        const tryCompress = () => {
          canvas.width = width
          canvas.height = height
          
          ctx.drawImage(img, 0, 0, width, height)
          
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('图片压缩失败'))
                return
              }
              
              if (blob.size <= maxSize) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type || 'image/jpeg',
                  lastModified: Date.now()
                })
                resolve(compressedFile)
                return
              }
              
              if (width > minDimension && height > minDimension) {
                width = Math.max(minDimension, Math.floor(width * 0.5))
                height = Math.max(minDimension, Math.floor(height * 0.5))
                tryCompress()
                return
              }
              
              const compressedFile = new File([blob], file.name, {
                type: file.type || 'image/jpeg',
                lastModified: Date.now()
              })
              resolve(compressedFile)
            },
            file.type || 'image/jpeg',
            quality
          )
        }
        
        tryCompress()
      }
      
      img.onerror = () => {
        reject(new Error('图片加载失败'))
      }
      
      img.src = e.target.result
    }
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
    
    reader.readAsDataURL(file)
  })
}

const uploadAvatarFile = async (file) => {
  isUploading.value = true
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      ElMessage.error('请先登录')
      router.push('/login')
      return
    }

    const response = await uploadAvatar(token, file)
    
    if (response && response.code === 200) {
      ElMessage.success('头像上传成功')
      setTimeout(async () => {
        await loadAvatar()
      }, 500)
    } else {
      ElMessage.error(response?.message || '头像上传失败')
      await loadAvatar()
    }
  } catch (error) {
    console.error('头像上传错误:', error)
    const errorMessage = error.response?.data?.message || error.message || '头像上传失败'
    ElMessage.error('头像上传失败：' + errorMessage)
    await loadAvatar()
    if (errorMessage.includes('Token无效') || errorMessage.includes('请重新登录')) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      router.push('/login')
    }
  } finally {
    isUploading.value = false
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
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 100%;
  margin: 0 auto;
}

.back-btn {
  width: 36px;
  height: 36px;
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
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.title-section h1 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #1e293b;
}

.title-section p {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.main-content {
  padding: 20px;
  max-width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
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
  border-radius: 12px;
}

.loading-spinner {
  width: 28px;
  height: 28px;
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
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.user-info-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  text-align: center;
}

.avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.avatar-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  touch-action: manipulation;
}

.avatar-container:active {
  transform: scale(0.98);
}

.avatar {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.avatar-icon {
  font-size: 28px;
  color: white;
}

.avatar-loading {
  pointer-events: none;
}

.avatar-loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.avatar-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  background: #10b981;
  border: 2px solid white;
  border-radius: 50%;
  z-index: 2;
}

.avatar-upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.avatar-container:active .avatar-upload-overlay {
  opacity: 1;
}

.upload-icon {
  font-size: 18px;
  color: white;
}

.upload-text {
  font-size: 10px;
  color: white;
  font-weight: 500;
}

.avatar-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.1) 100%);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  margin-top: 10px;
  margin-bottom: 6px;
  animation: fadeIn 0.3s ease;
  width: 100%;
  touch-action: manipulation;
}

.avatar-tip .tip-icon {
  font-size: 14px;
  color: #3b82f6;
}

.avatar-tip .tip-text {
  font-size: 12px;
  color: #3b82f6;
  font-weight: 500;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

html.dark .avatar-tip {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(29, 78, 216, 0.15) 100%);
  border-color: rgba(59, 130, 246, 0.4);
}

html.dark .avatar-tip .tip-icon,
html.dark .avatar-tip .tip-text {
  color: #60a5fa;
}

.user-details {
  flex: 1;
  text-align: center;
}

.user-details h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1e293b;
}

.student-id {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 12px 0;
}

.user-stats {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f1f5f9;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: #475569;
}

.stat-icon {
  font-size: 12px;
  color: #3b82f6;
}

.action-buttons {
  display: flex;
  width: 100%;
}

.edit-btn {
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  font-size: 14px;
  color: white;
  transition: all 0.2s ease;
  width: 100%;
}

.edit-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.form-section {
  margin-bottom: 24px;
}

.section-header {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-radius: 10px;
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
  height: 2px;
  background: var(--primary-gradient);
  opacity: 0.6;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  font-size: 20px;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 6px;
  border-radius: 6px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.security-icon-large {
  font-size: 24px;
  color: #667eea;
  background: rgba(102, 126, 234, 0.15);
  padding: 8px;
  border-radius: 8px;
  border: 2px solid rgba(102, 126, 234, 0.3);
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.2);
}

.section-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.section-header p {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.security-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  color: #667eea;
  align-self: flex-start;
}

.security-badge .badge-icon {
  font-size: 14px;
}

.security-header {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 100%);
  border-color: rgba(102, 126, 234, 0.3);
}

.security-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 6px;
  font-size: 12px;
  color: #10b981;
  font-weight: 500;
}

.security-tip .tip-icon {
  font-size: 14px;
}

.label-icon {
  font-size: 13px;
  color: #667eea;
  margin-right: 4px;
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
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.security-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
  padding: 6px 10px;
  background: rgba(102, 126, 234, 0.05);
  border-left: 2px solid #667eea;
  border-radius: 4px;
  font-size: 11px;
  color: #64748b;
}

.security-hint .hint-icon {
  font-size: 12px;
  color: #667eea;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.reset-btn {
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  border: 1px solid #d1d5db;
  color: #6b7280;
  height: 44px;
  background: white;
}

.save-btn {
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  height: 44px;
  color: white;
}

.password-section {
  margin-top: 24px;
}

.security-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid #e2e8f0;
}

.security-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.security-icon {
  width: 40px;
  height: 40px;
  background: #3b82f6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.security-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.security-content p {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.security-btn {
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 500;
  font-size: 14px;
  color: white;
  width: 100%;
}



.password-dialog {
  border-radius: 12px;
  overflow: hidden;
}

.password-content {
  padding: 0;
}

.password-header {
  text-align: center;
  padding: 20px 20px 16px;
  background: #3b82f6;
  color: white;
}

.password-dialog .password-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  font-size: 18px;
}

.password-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: white;
}

.password-header p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.password-form {
  padding: 20px;
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
  flex-direction: column;
  gap: 12px;
  padding: 0 20px 20px;
  align-items: stretch;
}

.password-actions .el-button {
  width: 100%;
  height: 44px;
  margin: 0;
}

:deep(.password-dialog .el-dialog__body) {
  padding: 0;
}

:deep(.password-dialog .el-dialog__header) {
  display: none;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  box-shadow: none;
  transition: all 0.2s ease;
  height: 44px;
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
    padding: 24px 20px;
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
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.student-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.student-avatar-large {
  width: 60px;
  height: 60px;
  border-radius: 12px;
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
  height: 60px;
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
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
  padding: 0 8px;
  align-items: center;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.header-actions .el-button {
  display: inline-flex !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.calendar-day {
  position: relative;
  height: 100%;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 6px 2px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.calendar-day:hover {
  background: rgba(102, 126, 234, 0.05);
}

.day-number {
  font-size: 12px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 6px;
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
  width: 10px;
  height: 10px;
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
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
  padding: 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
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

html.dark .profile-container {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

html.dark .profile-container::before {
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
}

html.dark .header {
  background: rgba(0, 0, 0, 0.2);
}

html.dark .profile-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

html.dark .profile-card::before {
  background: linear-gradient(90deg, #4a5568 0%, #2d3748 100%);
}

html.dark .user-details h2 {
  color: #e2e8f0;
}

html.dark .student-id {
  color: #a0aec0;
}

html.dark .section-title h3 {
  color: #e2e8f0;
}

html.dark .section-header {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
  border-color: rgba(102, 126, 234, 0.3);
}

html.dark .section-icon {
  color: #818cf8;
  background: rgba(129, 140, 248, 0.15);
  border-color: rgba(129, 140, 248, 0.3);
}

html.dark .security-icon-large {
  color: #818cf8;
  background: rgba(129, 140, 248, 0.2);
  border-color: rgba(129, 140, 248, 0.4);
  box-shadow: 0 2px 6px rgba(129, 140, 248, 0.3);
}

html.dark .section-header h3 {
  color: #e2e8f0;
}

html.dark .section-header p {
  color: #cbd5e1;
}

html.dark .security-badge {
  background: rgba(129, 140, 248, 0.15);
  border-color: rgba(129, 140, 248, 0.4);
  color: #818cf8;
}

html.dark .security-header {
  background: linear-gradient(135deg, rgba(129, 140, 248, 0.18) 0%, rgba(167, 139, 250, 0.18) 100%);
  border-color: rgba(129, 140, 248, 0.4);
}

html.dark .security-tip {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.4);
  color: #34d399;
}

html.dark .label-icon {
  color: #818cf8;
}

html.dark .security-input {
  border-color: rgba(129, 140, 248, 0.3);
}

html.dark .security-input:hover {
  border-color: rgba(129, 140, 248, 0.5);
}

html.dark .security-input:focus-within {
  border-color: #818cf8;
  box-shadow: 0 0 0 2px rgba(129, 140, 248, 0.2);
}

html.dark .security-hint {
  background: rgba(129, 140, 248, 0.1);
  border-left-color: #818cf8;
  color: #cbd5e1;
}

html.dark .security-hint .hint-icon {
  color: #818cf8;
}

html.dark .form-label {
  color: #e2e8f0;
}

html.dark .password-content h4 {
  color: #e2e8f0;
}

html.dark .password-content p {
  color: #a0aec0;
}

html.dark .password-card {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

html.dark .confirm-header {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
}

html.dark .password-header {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
}

html.dark .records-header {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

html.dark .student-details h3 {
  color: #e2e8f0;
}

html.dark .student-details p {
  color: #a0aec0;
}

html.dark .calendar-container {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

html.dark .calendar-legend {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

html.dark .legend-item {
  background: rgba(0, 0, 0, 0.3);
  color: #e2e8f0;
}

html.dark .header-title {
  color: #e2e8f0;
}

html.dark .day-number {
  color: #e2e8f0;
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
  background: #1d4ed8;
}

/* 裁剪对话框样式 */
.crop-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.crop-wrapper {
  position: relative;
  width: 100%;
  height: 300px;
  background: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  touch-action: none;
}

.crop-canvas {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none;
}

.crop-box {
  position: absolute;
  border: 2px solid #3b82f6;
  border-style: dashed;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  z-index: 10;
}

.crop-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.zoom-info {
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  min-width: 50px;
  text-align: center;
}

html.dark .crop-wrapper {
  background: #1e293b;
}

html.dark .crop-controls {
  background: #334155;
}

html.dark .zoom-info {
  color: #cbd5e1;
}
</style>
