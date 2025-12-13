<template>
  <div class="attendance-container-mobile">
    <div class="background-effects-mobile">
      <div class="gradient-orb-mobile orb-1"></div>
      <div class="gradient-orb-mobile orb-2"></div>
      <div class="gradient-orb-mobile orb-3"></div>
    </div>
    
    <div class="content-wrapper-mobile">
      <el-button 
        type="primary" 
        @click="goToNavigation" 
        class="nav-button-mobile"
        :icon="ArrowLeft"
      >
        返回
      </el-button>
      
      <div class="attendance-header-mobile">
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊学生管理系统" class="logo-mobile" @click="toggleTheme" title="切换主题模式">
        <h1>AI坊学生签到</h1>
        <p class="subtitle">智能签到系统</p>
      </div>
      
      <div class="main-content-mobile">
        <div class="time-card-mobile">
          <div class="time-info-mobile">
            <div class="current-time-mobile">
              <el-icon class="time-icon-mobile"><Clock /></el-icon>
              <span>{{ currentTime }}</span>
            </div>
            <div v-if="!isInSignTime" class="next-time-mobile">
              <el-icon class="next-icon-mobile"><Calendar /></el-icon>
              <span>下次签到：{{ nextSignTime }}</span>
            </div>
          </div>
        </div>
        
        <div class="sign-button-container-mobile">
          <button 
            class="modern-sign-button-mobile"
            @click="submitAttendance"
            :disabled="loading || !isInSignTime || isCurrentSlotSigned()"
            :class="{ 
              'loading': loading, 
              'disabled': !isInSignTime || isCurrentSlotSigned(),
              'success': isInSignTime && isCurrentSlotSigned()
            }"
          >
            <div class="button-background-mobile"></div>
            <div class="button-content-mobile">
              <div class="icon-container-mobile">
                <el-icon v-if="!loading && isInSignTime && !isCurrentSlotSigned()" size="40" class="main-icon-mobile"><Check /></el-icon>
                <el-icon v-else-if="!loading && isInSignTime && isCurrentSlotSigned()" size="40" class="main-icon-mobile success-icon-mobile"><Check /></el-icon>
                <el-icon v-else-if="!loading && !isInSignTime" size="40" class="main-icon-mobile disabled-icon-mobile"><Clock /></el-icon>
                <el-icon v-else size="28" class="loading-icon-mobile"><Loading /></el-icon>
              </div>
              <span v-if="!loading" class="button-text-mobile">
                {{ !isInSignTime ? '非签到时间' : (isCurrentSlotSigned() ? '已签到' : '点击签到') }}
              </span>
              <span v-else class="loading-text-mobile">签到中...</span>
            </div>
            <div class="ripple-effect-mobile"></div>
          </button>
        </div>
        
        <div class="status-cards-mobile">
          <div class="status-card-mobile" :class="{ 'active': getCurrentTimeSlot() === 'morning', 'signed': isSlotSigned('morning') }">
            <div class="card-icon-mobile">
              <el-icon><Sunrise /></el-icon>
            </div>
            <div class="card-content-mobile">
              <div class="card-title-mobile">上午签到</div>
              <div class="card-time-mobile">08:00 - 11:00</div>
              <div class="card-status-mobile" :class="{ 'signed': isSlotSigned('morning') }">
                {{ isSlotSigned('morning') ? '已签到' : '未签到' }}
              </div>
            </div>
          </div>
          
          <div class="status-card-mobile" :class="{ 'active': getCurrentTimeSlot() === 'afternoon', 'signed': isSlotSigned('afternoon') }">
            <div class="card-icon-mobile">
              <el-icon><Sunny /></el-icon>
            </div>
            <div class="card-content-mobile">
              <div class="card-title-mobile">下午签到</div>
              <div class="card-time-mobile">14:00 - 17:00</div>
              <div class="card-status-mobile" :class="{ 'signed': isSlotSigned('afternoon') }">
                {{ isSlotSigned('afternoon') ? '已签到' : '未签到' }}
              </div>
            </div>
          </div>
          
          <div class="status-card-mobile" :class="{ 'active': getCurrentTimeSlot() === 'evening', 'signed': isSlotSigned('evening') }">
            <div class="card-icon-mobile">
              <el-icon><Moon /></el-icon>
            </div>
            <div class="card-content-mobile">
              <div class="card-title-mobile">晚上签到</div>
              <div class="card-time-mobile">19:00 - 22:00</div>
              <div class="card-status-mobile" :class="{ 'signed': isSlotSigned('evening') }">
                {{ isSlotSigned('evening') ? '已签到' : '未签到' }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="desktop-tip-card-mobile">
          <div class="tip-icon-mobile">
            <el-icon><Monitor /></el-icon>
          </div>
          <div class="tip-content-mobile">
            <p class="tip-text-mobile">💡 提示：如需查看详细签到记录和历史数据，请在电脑端访问</p>
          </div>
        </div>
      </div>
      
    </div>
    
    <el-dialog
      v-if="showVerificationCodeDialog"
      v-model="showVerificationCodeDialog"
      title="输入签到验证码"
      width="90%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
      class="verification-code-dialog-mobile"
      @close="handleVerificationCodeDialogClose"
    >
      <div class="verification-code-content-mobile">
        <div class="verification-code-hint-mobile">
          <p>请输入6位数字验证码</p>
        </div>
        <el-input
          v-model="inputVerificationCode"
          placeholder="请输入验证码"
          maxlength="6"
          class="verification-code-input-mobile"
          @keyup.enter="confirmVerificationCode"
        />
        <div class="verification-code-actions-mobile">
          <el-button @click.stop="cancelVerificationCode">取消</el-button>
          <el-button type="primary" @click.stop="confirmVerificationCode" :loading="loading">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElButton, ElIcon, ElDialog, ElInput } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-input.css'
import { Check, Loading, ArrowLeft, Clock, Calendar, Sunrise, Sunny, Moon, Monitor } from '@element-plus/icons-vue'
import { signIn } from '@/api/attendance'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { useRouter } from 'vue-router'

const loading = ref(false)
const userStore = useUserStore()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore
const router = useRouter()
const studentLevel = ref(0)
const isInSignTime = ref(false)
const currentTime = ref('')
const nextSignTime = ref('')
const timeInterval = ref(null)
const showVerificationCodeDialog = ref(false)
const inputVerificationCode = ref('')
const attendanceStatus = ref({
  morning: null,
  afternoon: null,
  evening: null
})

const goToNavigation = () => {
  router.push('/navigation')
}

const getCurrentTimeSlot = () => {
  const now = new Date()
  const hour = now.getHours()
  
  if (hour >= 8 && hour < 11) return 'morning'
  if (hour >= 14 && hour < 17) return 'afternoon'
  if (hour >= 19 && hour < 22) return 'evening'
  return null
}

const isCurrentSlotSigned = () => {
  try {
    const currentSlot = getCurrentTimeSlot()
    if (!currentSlot) return false
    return isSlotSigned(currentSlot)
  } catch (error) {
    return false
  }
}

const isSlotSigned = (slot) => {
  try {
    if (!attendanceStatus.value || typeof attendanceStatus.value !== 'object') return false
    
    const signTime = attendanceStatus.value[slot]
    if (!signTime) return false
    
    const today = new Date().toDateString()
    const signDate = new Date(signTime).toDateString()
    
    return signDate === today
  } catch (error) {
    return false
  }
}

const loadAttendanceStatus = () => {
  const today = new Date().toDateString()
  const saved = localStorage.getItem(`attendance_${today}`)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed && typeof parsed === 'object' && 
          'morning' in parsed && 'afternoon' in parsed && 'evening' in parsed) {
        attendanceStatus.value = parsed
      } else {
        attendanceStatus.value = { morning: null, afternoon: null, evening: null }
      }
    } catch (e) {
      attendanceStatus.value = { morning: null, afternoon: null, evening: null }
    }
  } else {
    attendanceStatus.value = { morning: null, afternoon: null, evening: null }
  }
}

const syncAllAttendanceStatus = async () => {
  try {
    const today = new Date().toDateString()
    const saved = localStorage.getItem(`attendance_${today}`)
    
    if (saved) {
      try {
        const status = JSON.parse(saved)
        if (status && typeof status === 'object') {
          attendanceStatus.value = {
            morning: status.morning || null,
            afternoon: status.afternoon || null,
            evening: status.evening || null
          }
        }
      } catch (e) {
        attendanceStatus.value = { morning: null, afternoon: null, evening: null }
      }
    }
  } catch (error) {
    attendanceStatus.value = { morning: null, afternoon: null, evening: null }
  }
}

const saveAttendanceStatus = () => {
  const today = new Date().toDateString()
  if (attendanceStatus.value && typeof attendanceStatus.value === 'object') {
    localStorage.setItem(`attendance_${today}`, JSON.stringify(attendanceStatus.value))
  } else {
    const defaultStatus = { morning: null, afternoon: null, evening: null }
    localStorage.setItem(`attendance_${today}`, JSON.stringify(defaultStatus))
  }
}

const checkSignTime = () => {
  const now = new Date()
  const hour = now.getHours()
  const minute = now.getMinutes()
  const second = now.getSeconds()
  const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
  currentTime.value = timeStr
  
  const signTimeRanges = [
    { start: 8, end: 11, name: '上午' },
    { start: 14, end: 17, name: '下午' },
    { start: 19, end: 22, name: '晚上' }
  ]
  
  let inTime = false
  let nextTime = ''
  
  for (const range of signTimeRanges) {
    if (hour >= range.start && hour < range.end) {
      inTime = true
      break
    }
  }
  
  if (!inTime) {
    for (const range of signTimeRanges) {
      if (hour < range.start) {
        nextTime = `${range.name} ${range.start.toString().padStart(2, '0')}:00`
        break
      }
    }
    if (!nextTime) {
      nextTime = '明天上午 08:00'
    }
  }
  
  isInSignTime.value = inTime
  nextSignTime.value = nextTime
  
  if (minute === 0 && second === 0) {
    syncAllAttendanceStatus()
  }
}

const submitAttendance = async () => {
  if (!isInSignTime.value) {
    ElMessage.error(`当前时间 ${currentTime.value} 不在签到时间内，下次签到时间：${nextSignTime.value}`)
    return
  }
  
  if (isCurrentSlotSigned()) {
    ElMessage.warning('当前时间段已签到，请等待下次签到时间')
    return
  }
  
  inputVerificationCode.value = ''
  showVerificationCodeDialog.value = true
}

const confirmVerificationCode = async () => {
  if (!inputVerificationCode.value || inputVerificationCode.value.length !== 6) {
    ElMessage.error('请输入6位数字验证码')
    return
  }
  
  if (!/^\d{6}$/.test(inputVerificationCode.value)) {
    ElMessage.error('验证码必须是6位数字')
    return
  }
  
  loading.value = true
  
  try {
    const token = userStore.token || localStorage.getItem('token')
    if (!token) {
      ElMessage.error('请先登录')
      router.push('/login')
      loading.value = false
      showVerificationCodeDialog.value = false
      return
    }
    
    const res = await signIn(token, inputVerificationCode.value)
    
    if (res.code === 200) {
      const currentSlot = getCurrentTimeSlot()
      if (currentSlot && attendanceStatus.value) {
        attendanceStatus.value = {
          ...attendanceStatus.value,
          [currentSlot]: new Date().toISOString()
        }
        saveAttendanceStatus()
      }
      
      showVerificationCodeDialog.value = false
      inputVerificationCode.value = ''
      ElMessage.success('签到成功！')
    } else if (res.code === 400 && res.message && res.message.includes('已签到')) {
      const currentSlot = getCurrentTimeSlot()
      if (currentSlot && attendanceStatus.value) {
        attendanceStatus.value = {
          ...attendanceStatus.value,
          [currentSlot]: new Date().toISOString()
        }
        saveAttendanceStatus()
      }
      
      showVerificationCodeDialog.value = false
      inputVerificationCode.value = ''
      ElMessage.success('您已签到，无需重复签到')
    } else {
      if (res.message && (res.message.includes('验证码错误') || res.message.includes('验证码已过期'))) {
        ElMessage.error(res.message)
        inputVerificationCode.value = ''
      } else {
        ElMessage.error(res.message || '签到失败')
      }
    }
  } catch (error) {
    if (error.message && (error.message.includes('验证码错误') || error.message.includes('验证码已过期'))) {
      ElMessage.error(error.message)
      inputVerificationCode.value = ''
    } else {
      ElMessage.error(error.message || '签到失败')
    }
  } finally {
    loading.value = false
  }
}

const handleVerificationCodeDialogClose = () => {
  inputVerificationCode.value = ''
}

const cancelVerificationCode = () => {
  showVerificationCodeDialog.value = false
}

onMounted(async () => {
  try {
    loadAttendanceStatus()
    checkSignTime()
    timeInterval.value = setInterval(checkSignTime, 1000)
    loadStudentLevel()
    setTimeout(async () => {
      await syncAllAttendanceStatus()
    }, 500)
  } catch (error) {
    attendanceStatus.value = { morning: null, afternoon: null, evening: null }
  }
})

onUnmounted(() => {
  if (timeInterval.value) {
    clearInterval(timeInterval.value)
  }
})

const loadStudentLevel = () => {
  try {
    const userInfo = userStore.userInfo || JSON.parse(localStorage.getItem('userInfo') || '{}')
    studentLevel.value = userInfo.level || 0
  } catch (error) {
    studentLevel.value = 0
  }
}
</script>

<style scoped>
.attendance-container-mobile {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 12px;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.1) 0%, 
    rgba(168, 85, 247, 0.08) 25%, 
    rgba(236, 72, 153, 0.06) 50%, 
    rgba(251, 146, 60, 0.08) 75%, 
    rgba(34, 197, 94, 0.1) 100%);
  position: relative;
  overflow: hidden;
}

.background-effects-mobile {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.gradient-orb-mobile {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  animation: float-mobile 20s ease-in-out infinite;
}

.orb-1 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 70%, transparent 100%);
  top: 5%;
  left: 5%;
  animation-delay: 0s;
}

.orb-2 {
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(168, 85, 247, 0.04) 70%, transparent 100%);
  top: 50%;
  right: 5%;
  animation-delay: 6s;
}

.orb-3 {
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.03) 70%, transparent 100%);
  bottom: 10%;
  left: 15%;
  animation-delay: 12s;
}

@keyframes float-mobile {
  0%, 100% { 
    transform: translateY(0px) translateX(0px) rotate(0deg); 
    opacity: 0.6;
  }
  25% { 
    transform: translateY(-15px) translateX(8px) rotate(90deg); 
    opacity: 0.8;
  }
  50% { 
    transform: translateY(-8px) translateX(-12px) rotate(180deg); 
    opacity: 1;
  }
  75% { 
    transform: translateY(12px) translateX(4px) rotate(270deg); 
    opacity: 0.7;
  }
}

.content-wrapper-mobile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  position: relative;
  z-index: 1;
}

.attendance-header-mobile {
  text-align: center;
  margin-bottom: 24px;
  padding: 16px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid var(--glass-border);
  box-shadow: 0 6px 24px var(--shadow-color);
}

.nav-button-mobile {
  position: fixed;
  top: 12px;
  left: 12px;
  height: 36px;
  border-radius: 18px;
  font-size: 12px;
  font-weight: 600;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  box-shadow: 0 3px 12px var(--shadow-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  padding: 0 12px;
  min-width: 60px;
}

.nav-button-mobile:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px var(--shadow-color);
  background: var(--primary-color);
  color: #ffffff;
}

.logo-mobile {
  width: 50px;
  height: 50px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  box-shadow: 0 3px 12px var(--shadow-color);
}

.logo-mobile:hover {
  transform: scale(1.1) rotate(5deg);
  filter: brightness(1.2);
}

h1 {
  color: var(--text-primary);
  font-size: 20px;
  margin: 0 0 6px 0;
  font-weight: 700;
  text-shadow: 0 2px 6px var(--shadow-color);
  letter-spacing: 0.5px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 12px;
  margin: 0;
  font-weight: 400;
  opacity: 0.8;
}

.main-content-mobile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.time-card-mobile {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid var(--glass-border);
  box-shadow: 0 6px 24px var(--shadow-color);
  padding: 16px 20px;
  text-align: center;
  transition: all 0.3s ease;
  width: 100%;
}

.time-card-mobile:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 28px var(--shadow-color);
}

.time-info-mobile {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.current-time-mobile {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  color: var(--text-primary);
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.time-icon-mobile {
  color: var(--primary-color);
  font-size: 20px;
}

.next-time-mobile {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.next-icon-mobile {
  color: var(--text-tertiary);
  font-size: 14px;
}

.sign-button-container-mobile {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modern-sign-button-mobile {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 8px 28px rgba(102, 126, 234, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.modern-sign-button-mobile:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 
    0 12px 36px rgba(102, 126, 234, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.modern-sign-button-mobile:active:not(:disabled) {
  transform: translateY(-1px) scale(0.98);
}

.modern-sign-button-mobile:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: scale(0.95);
}

.modern-sign-button-mobile.disabled {
  background: linear-gradient(135deg, #9E9E9E 0%, #757575 100%);
  box-shadow: 
    0 6px 20px rgba(158, 158, 158, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.modern-sign-button-mobile.success {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  box-shadow: 
    0 8px 28px rgba(76, 175, 80, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.modern-sign-button-mobile.loading {
  animation: pulse-mobile 2s ease-in-out infinite;
}

.button-background-mobile {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 50%;
}

.button-content-mobile {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 8px;
}

.icon-container-mobile {
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-icon-mobile {
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3));
  transition: all 0.3s ease;
}

.success-icon-mobile {
  filter: drop-shadow(0 3px 6px rgba(76, 175, 80, 0.4));
}

.disabled-icon-mobile {
  opacity: 0.6;
  filter: grayscale(100%) drop-shadow(0 3px 6px rgba(0, 0, 0, 0.2));
}

.loading-icon-mobile {
  animation: spin-mobile 1s linear infinite;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.button-text-mobile {
  font-size: 14px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
  color: white;
  transition: all 0.3s ease;
}

.loading-text-mobile {
  font-size: 12px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  color: white;
}

.ripple-effect-mobile {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: all 0.6s ease;
}

.modern-sign-button-mobile:active:not(:disabled) .ripple-effect-mobile {
  width: 200px;
  height: 200px;
}

.status-cards-mobile {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: 100%;
}

.status-card-mobile {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  border: 1px solid var(--glass-border);
  box-shadow: 0 3px 12px var(--shadow-color);
  padding: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.status-card-mobile:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px var(--shadow-color);
}

.status-card-mobile.active {
  border-color: var(--primary-color);
  box-shadow: 0 6px 18px rgba(102, 126, 234, 0.2);
}

.status-card-mobile.signed {
  border-color: #4CAF50;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);
}

.card-icon-mobile {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--primary-color);
  color: white;
  margin-bottom: 8px;
  font-size: 16px;
}

.status-card-mobile.signed .card-icon-mobile {
  background: #4CAF50;
}

.card-content-mobile {
  text-align: center;
}

.card-title-mobile {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.card-time-mobile {
  font-size: 9px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.card-status-mobile {
  font-size: 9px;
  font-weight: 500;
  padding: 3px 6px;
  border-radius: 12px;
  background: rgba(158, 158, 158, 0.1);
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.card-status-mobile.signed {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.desktop-tip-card-mobile {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  border: 1px solid var(--glass-border);
  box-shadow: 0 3px 12px var(--shadow-color);
  padding: 12px 16px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.tip-icon-mobile {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(102, 126, 234, 0.1);
  color: var(--primary-color);
  flex-shrink: 0;
  font-size: 18px;
}

.tip-content-mobile {
  flex: 1;
  min-width: 0;
}

.tip-text-mobile {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
  word-break: break-word;
}

@keyframes spin-mobile {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.verification-code-dialog-mobile {
  border-radius: 16px;
}

.verification-code-content-mobile {
  padding: 20px 0;
}

.verification-code-hint-mobile {
  margin-bottom: 20px;
  text-align: center;
}

.verification-code-hint-mobile p {
  margin: 8px 0;
  color: var(--text-primary);
  font-size: 14px;
}


.verification-code-input-mobile {
  margin-bottom: 20px;
}

.verification-code-input-mobile :deep(.el-input__wrapper) {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 2px solid var(--glass-border);
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 4px 16px var(--shadow-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.verification-code-input-mobile :deep(.el-input__wrapper:hover) {
  border-color: var(--primary-color);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
}

.verification-code-input-mobile :deep(.el-input__wrapper.is-focus) {
  border-color: var(--primary-color);
  box-shadow: 0 6px 24px rgba(102, 126, 234, 0.3);
}

.verification-code-input-mobile :deep(.el-input__inner) {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 6px;
  font-family: 'Consolas', 'Monaco', 'Lucida Console', monospace;
  color: var(--text-primary);
  background: transparent;
  border: none;
  padding: 0;
}

.verification-code-input-mobile :deep(.el-input__inner::placeholder) {
  color: var(--text-tertiary);
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 2px;
  opacity: 0.6;
}

.verification-code-actions-mobile {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.verification-code-actions-mobile .el-button {
  flex: 1;
}

@keyframes pulse-mobile {
  0% {
    box-shadow: 
      0 8px 28px rgba(102, 126, 234, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow: 
      0 12px 36px rgba(102, 126, 234, 0.5),
      0 0 0 6px rgba(102, 126, 234, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  100% {
    box-shadow: 
      0 8px 28px rgba(102, 126, 234, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
}

</style>

<style>
.verification-code-dialog-mobile.el-dialog {
  background-color: #ffffff !important;
}

.verification-code-dialog-mobile.el-dialog .el-dialog__header {
  background-color: #ffffff !important;
  border-bottom: 1px solid #e2e8f0 !important;
}

.verification-code-dialog-mobile.el-dialog .el-dialog__body {
  background-color: #ffffff !important;
}

html.dark .verification-code-dialog-mobile.el-dialog {
  background-color: #0f172a !important;
}

html.dark .verification-code-dialog-mobile.el-dialog .el-dialog__header {
  background-color: #0f172a !important;
  border-bottom: 1px solid #334155 !important;
}

html.dark .verification-code-dialog-mobile.el-dialog .el-dialog__body {
  background-color: #0f172a !important;
}
</style>