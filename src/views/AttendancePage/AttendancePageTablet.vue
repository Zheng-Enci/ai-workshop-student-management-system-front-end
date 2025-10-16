<template>
  <div class="attendance-container-tablet">
    <div class="background-effects-tablet">
      <div class="gradient-orb-tablet orb-1"></div>
      <div class="gradient-orb-tablet orb-2"></div>
      <div class="gradient-orb-tablet orb-3"></div>
    </div>
    
    <div class="content-wrapper-tablet">
      <el-button 
        type="primary" 
        @click="goToNavigation" 
        class="nav-button-tablet"
        :icon="ArrowLeft"
      >
        返回导航
      </el-button>
      
      <div class="attendance-header-tablet">
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊学生管理系统" class="logo-tablet" @click="toggleTheme" title="切换主题模式">
        <h1>AI坊学生签到</h1>
        <p class="subtitle">智能签到系统</p>
      </div>
      
      <div class="motto-corner-tablet">
        <img src="@/assets/QunCeQunLiChuangXingGongXing.png" alt="群策群力 创新共行" class="motto-image-tablet">
      </div>
      
      <div class="main-content-tablet">
        <div class="time-card-tablet">
          <div class="time-info-tablet">
            <div class="current-time-tablet">
              <el-icon class="time-icon-tablet"><Clock /></el-icon>
              <span>{{ currentTime }}</span>
            </div>
            <div v-if="!isInSignTime" class="next-time-tablet">
              <el-icon class="next-icon-tablet"><Calendar /></el-icon>
              <span>下次签到：{{ nextSignTime }}</span>
            </div>
          </div>
        </div>
        
        <div class="sign-button-container-tablet">
          <button 
            class="modern-sign-button-tablet"
            @click="submitAttendance"
            :disabled="loading || !isInSignTime || isCurrentSlotSigned()"
            :class="{ 
              'loading': loading, 
              'disabled': !isInSignTime || isCurrentSlotSigned(),
              'success': isInSignTime && isCurrentSlotSigned()
            }"
          >
            <div class="button-background-tablet"></div>
            <div class="button-content-tablet">
              <div class="icon-container-tablet">
                <el-icon v-if="!loading && isInSignTime && !isCurrentSlotSigned()" size="44" class="main-icon-tablet"><Check /></el-icon>
                <el-icon v-else-if="!loading && isInSignTime && isCurrentSlotSigned()" size="44" class="main-icon-tablet success-icon-tablet"><Check /></el-icon>
                <el-icon v-else-if="!loading && !isInSignTime" size="44" class="main-icon-tablet disabled-icon-tablet"><Clock /></el-icon>
                <el-icon v-else size="30" class="loading-icon-tablet"><Loading /></el-icon>
              </div>
              <span v-if="!loading" class="button-text-tablet">
                {{ !isInSignTime ? '非签到时间' : (isCurrentSlotSigned() ? '已签到' : '点击签到') }}
              </span>
              <span v-else class="loading-text-tablet">签到中...</span>
            </div>
            <div class="ripple-effect-tablet"></div>
          </button>
        </div>
        
        <div class="status-cards-tablet">
          <div class="status-card-tablet" :class="{ 'active': getCurrentTimeSlot() === 'morning', 'signed': attendanceStatus?.value?.morning }">
            <div class="card-icon-tablet">
              <el-icon><Sunrise /></el-icon>
            </div>
            <div class="card-content-tablet">
              <div class="card-title-tablet">上午签到</div>
              <div class="card-time-tablet">08:00 - 11:00</div>
              <div class="card-status-tablet" :class="{ 'signed': attendanceStatus?.value?.morning }">
                {{ attendanceStatus?.value?.morning ? '已签到' : '未签到' }}
              </div>
            </div>
          </div>
          
          <div class="status-card-tablet" :class="{ 'active': getCurrentTimeSlot() === 'afternoon', 'signed': attendanceStatus?.value?.afternoon }">
            <div class="card-icon-tablet">
              <el-icon><Sunny /></el-icon>
            </div>
            <div class="card-content-tablet">
              <div class="card-title-tablet">下午签到</div>
              <div class="card-time-tablet">14:00 - 17:00</div>
              <div class="card-status-tablet" :class="{ 'signed': attendanceStatus?.value?.afternoon }">
                {{ attendanceStatus?.value?.afternoon ? '已签到' : '未签到' }}
              </div>
            </div>
          </div>
          
          <div class="status-card-tablet" :class="{ 'active': getCurrentTimeSlot() === 'evening', 'signed': attendanceStatus?.value?.evening }">
            <div class="card-icon-tablet">
              <el-icon><Moon /></el-icon>
            </div>
            <div class="card-content-tablet">
              <div class="card-title-tablet">晚上签到</div>
              <div class="card-time-tablet">19:00 - 22:00</div>
              <div class="card-status-tablet" :class="{ 'signed': attendanceStatus?.value?.evening }">
                {{ attendanceStatus?.value?.evening ? '已签到' : '未签到' }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="result && result.type" class="result-message-tablet" :class="result.type">
        <div class="result-icon-tablet">
          <el-icon v-if="result.type === 'success'"><Check /></el-icon>
          <el-icon v-else><Warning /></el-icon>
        </div>
        <div class="result-content-tablet">
          <div class="result-title-tablet">{{ result.type === 'success' ? '签到成功' : '签到失败' }}</div>
          <div class="result-text-tablet">{{ result.message || '' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Check, Loading, ArrowLeft, Clock, Calendar, Sunrise, Sunny, Moon, Warning } from '@element-plus/icons-vue'
import { signIn } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { useRouter } from 'vue-router'

const loading = ref(false)
const result = ref(null)
const userStore = useUserStore()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore
const router = useRouter()
const studentLevel = ref(0)
const isInSignTime = ref(false)
const currentTime = ref('')
const nextSignTime = ref('')
const timeInterval = ref(null)
const attendanceStatus = ref({
  morning: false,
  afternoon: false,
  evening: false
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
    if (!attendanceStatus.value || typeof attendanceStatus.value !== 'object') return false
    return Boolean(attendanceStatus.value[currentSlot])
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
        attendanceStatus.value = { morning: false, afternoon: false, evening: false }
      }
    } catch (e) {
      attendanceStatus.value = { morning: false, afternoon: false, evening: false }
    }
  } else {
    attendanceStatus.value = { morning: false, afternoon: false, evening: false }
  }
}

const syncAllAttendanceStatus = async () => {
  try {
    const token = userStore.token || localStorage.getItem('token')
    if (!token) return
    
    const today = new Date().toDateString()
    const saved = localStorage.getItem(`attendance_${today}`)
    
    if (saved) {
      try {
        const status = JSON.parse(saved)
        if (status && typeof status === 'object') {
          attendanceStatus.value = {
            morning: Boolean(status.morning),
            afternoon: Boolean(status.afternoon),
            evening: Boolean(status.evening)
          }
        }
      } catch (e) {
        attendanceStatus.value = { morning: false, afternoon: false, evening: false }
      }
    }
    
    const currentSlot = getCurrentTimeSlot()
    if (currentSlot) {
      try {
        const response = await signIn(token)
        if (response && response.code === 400 && response.message && response.message.includes('已签到')) {
          if (attendanceStatus.value) {
            attendanceStatus.value[currentSlot] = true
            saveAttendanceStatus()
          }
        }
      } catch (error) {
        error
      }
    }
  } catch (error) {
    error
  }
}

const refreshAttendanceStatus = async () => {
  try {
    const token = userStore.token || localStorage.getItem('token')
    if (!token) return
    
    const today = new Date().toDateString()
    
    try {
      const response = await signIn(token)
      if (response && response.code === 400 && response.message && response.message.includes('已签到')) {
        const currentSlot = getCurrentTimeSlot()
        if (currentSlot && attendanceStatus.value) {
          attendanceStatus.value[currentSlot] = true
          saveAttendanceStatus()
        }
      }
    } catch (error) {
      const saved = localStorage.getItem(`attendance_${today}`)
      if (saved) {
        try {
          const status = JSON.parse(saved)
          if (status && typeof status === 'object') {
            attendanceStatus.value = {
              morning: Boolean(status.morning),
              afternoon: Boolean(status.afternoon),
              evening: Boolean(status.evening)
            }
          }
        } catch (e) {
          attendanceStatus.value = { morning: false, afternoon: false, evening: false }
        }
      }
    }
  } catch (error) {
    error
  }
}

const saveAttendanceStatus = () => {
  const today = new Date().toDateString()
  if (attendanceStatus.value && typeof attendanceStatus.value === 'object') {
    localStorage.setItem(`attendance_${today}`, JSON.stringify(attendanceStatus.value))
  } else {
    const defaultStatus = { morning: false, afternoon: false, evening: false }
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
    result.value = {
      type: 'error',
      message: `当前时间 ${currentTime.value} 不在签到时间内，下次签到时间：${nextSignTime.value}`
    }
    return
  }
  
  if (isCurrentSlotSigned()) {
    result.value = {
      type: 'error',
      message: '当前时间段已签到，请等待下次签到时间'
    }
    return
  }
  
  loading.value = true
  result.value = null
  
  try {
    const token = userStore.token || localStorage.getItem('token')
    if (!token) {
      ElMessage.error('请先登录')
      router.push('/login')
      loading.value = false
      return
    }
    
    const res = await signIn(token)
    
    if (res.code === 200) {
      const currentSlot = getCurrentTimeSlot()
      if (currentSlot && attendanceStatus.value) {
        attendanceStatus.value[currentSlot] = true
        saveAttendanceStatus()
      }
      
      result.value = {
        type: 'success',
        message: '签到成功！'
      }
      
      await refreshAttendanceStatus()
    } else if (res.code === 400 && res.message && res.message.includes('已签到')) {
      const currentSlot = getCurrentTimeSlot()
      if (currentSlot && attendanceStatus.value) {
        attendanceStatus.value[currentSlot] = true
        saveAttendanceStatus()
      }
      
      result.value = {
        type: 'success',
        message: '您已签到，无需重复签到'
      }
      
      await refreshAttendanceStatus()
    } else {
      throw new Error(res.message || '签到失败')
    }
  } catch (error) {
    result.value = {
      type: 'error',
      message: error.message || '签到失败'
    }
  } finally {
    loading.value = false
  }
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
    attendanceStatus.value = { morning: false, afternoon: false, evening: false }
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
.attendance-container-tablet {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 16px;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.1) 0%, 
    rgba(168, 85, 247, 0.08) 25%, 
    rgba(236, 72, 153, 0.06) 50%, 
    rgba(251, 146, 60, 0.08) 75%, 
    rgba(34, 197, 94, 0.1) 100%);
  position: relative;
  overflow: hidden;
}

.background-effects-tablet {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.gradient-orb-tablet {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  animation: float-tablet 22s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 70%, transparent 100%);
  top: 5%;
  left: 5%;
  animation-delay: 0s;
}

.orb-2 {
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(168, 85, 247, 0.04) 70%, transparent 100%);
  top: 50%;
  right: 5%;
  animation-delay: 7s;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.03) 70%, transparent 100%);
  bottom: 10%;
  left: 15%;
  animation-delay: 14s;
}

@keyframes float-tablet {
  0%, 100% { 
    transform: translateY(0px) translateX(0px) rotate(0deg); 
    opacity: 0.6;
  }
  25% { 
    transform: translateY(-18px) translateX(9px) rotate(90deg); 
    opacity: 0.8;
  }
  50% { 
    transform: translateY(-9px) translateX(-13px) rotate(180deg); 
    opacity: 1;
  }
  75% { 
    transform: translateY(13px) translateX(4px) rotate(270deg); 
    opacity: 0.7;
  }
}

.content-wrapper-tablet {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  position: relative;
  z-index: 1;
}

.attendance-header-tablet {
  text-align: center;
  margin-bottom: 32px;
  padding: 18px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 22px;
  border: 1px solid var(--glass-border);
  box-shadow: 0 7px 28px var(--shadow-color);
}

.nav-button-tablet {
  position: fixed;
  top: 16px;
  left: 16px;
  height: 42px;
  border-radius: 21px;
  font-size: 13px;
  font-weight: 600;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  box-shadow: 0 3px 14px var(--shadow-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  padding: 0 16px;
  min-width: 80px;
}

.nav-button-tablet:hover {
  transform: translateY(-1px);
  box-shadow: 0 7px 21px var(--shadow-color);
  background: var(--primary-color);
  color: #ffffff;
}

.logo-tablet {
  width: 65px;
  height: 65px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 14px;
  box-shadow: 0 3px 14px var(--shadow-color);
}

.logo-tablet:hover {
  transform: scale(1.1) rotate(5deg);
  filter: brightness(1.2);
}

.motto-corner-tablet {
  position: fixed;
  top: 18px;
  right: 18px;
  z-index: 999;
  transition: all 0.3s ease;
}

.motto-corner-tablet:hover {
  transform: translateY(-1px);
}

.motto-image-tablet {
  width: 120px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 3px 14px var(--shadow-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.9;
}

.motto-image-tablet:hover {
  transform: scale(1.05);
  opacity: 1;
  box-shadow: 0 7px 21px var(--shadow-color);
}

html.dark .motto-image-tablet {
  filter: invert(1) hue-rotate(180deg);
  transition: filter 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

html.light .motto-image-tablet {
  filter: none;
  transition: filter 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

h1 {
  color: var(--text-primary);
  font-size: 26px;
  margin: 0 0 7px 0;
  font-weight: 700;
  text-shadow: 0 2px 7px var(--shadow-color);
  letter-spacing: 0.8px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0;
  font-weight: 400;
  opacity: 0.8;
}

.main-content-tablet {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
  width: 100%;
}

.time-card-tablet {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 18px;
  border: 1px solid var(--glass-border);
  box-shadow: 0 7px 28px var(--shadow-color);
  padding: 20px 26px;
  text-align: center;
  transition: all 0.3s ease;
  width: 100%;
}

.time-card-tablet:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 34px var(--shadow-color);
}

.time-info-tablet {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.current-time-tablet {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 19px;
  color: var(--text-primary);
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.time-icon-tablet {
  color: var(--primary-color);
  font-size: 24px;
}

.next-time-tablet {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

.next-icon-tablet {
  color: var(--text-tertiary);
  font-size: 16px;
}

.sign-button-container-tablet {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modern-sign-button-tablet {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 10px 34px rgba(102, 126, 234, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.modern-sign-button-tablet:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 
    0 14px 44px rgba(102, 126, 234, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.modern-sign-button-tablet:active:not(:disabled) {
  transform: translateY(-1px) scale(0.98);
}

.modern-sign-button-tablet:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: scale(0.95);
}

.modern-sign-button-tablet.disabled {
  background: linear-gradient(135deg, #9E9E9E 0%, #757575 100%);
  box-shadow: 
    0 7px 22px rgba(158, 158, 158, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.modern-sign-button-tablet.success {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  box-shadow: 
    0 10px 34px rgba(76, 175, 80, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.modern-sign-button-tablet.loading {
  animation: pulse-tablet 2s ease-in-out infinite;
}

.button-background-tablet {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 50%;
}

.button-content-tablet {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
}

.icon-container-tablet {
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-icon-tablet {
  filter: drop-shadow(0 3px 7px rgba(0, 0, 0, 0.3));
  transition: all 0.3s ease;
}

.success-icon-tablet {
  filter: drop-shadow(0 3px 7px rgba(76, 175, 80, 0.4));
}

.disabled-icon-tablet {
  opacity: 0.6;
  filter: grayscale(100%) drop-shadow(0 3px 7px rgba(0, 0, 0, 0.2));
}

.loading-icon-tablet {
  animation: spin-tablet 1s linear infinite;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.button-text-tablet {
  font-size: 17px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.7px;
  color: white;
  transition: all 0.3s ease;
}

.loading-text-tablet {
  font-size: 15px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  color: white;
}

.ripple-effect-tablet {
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

.modern-sign-button-tablet:active:not(:disabled) .ripple-effect-tablet {
  width: 250px;
  height: 250px;
}

.status-cards-tablet {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  width: 100%;
}

.status-card-tablet {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 14px;
  border: 1px solid var(--glass-border);
  box-shadow: 0 3px 14px var(--shadow-color);
  padding: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.status-card-tablet:hover {
  transform: translateY(-1px);
  box-shadow: 0 7px 21px var(--shadow-color);
}

.status-card-tablet.active {
  border-color: var(--primary-color);
  box-shadow: 0 7px 21px rgba(102, 126, 234, 0.2);
}

.status-card-tablet.signed {
  border-color: #4CAF50;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);
}

.card-icon-tablet {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--primary-color);
  color: white;
  margin-bottom: 12px;
  font-size: 20px;
}

.status-card-tablet.signed .card-icon-tablet {
  background: #4CAF50;
}

.card-content-tablet {
  text-align: center;
}

.card-title-tablet {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.card-time-tablet {
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.card-status-tablet {
  font-size: 11px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 16px;
  background: rgba(158, 158, 158, 0.1);
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.card-status-tablet.signed {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.result-message-tablet {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 22px;
  border-radius: 14px;
  text-align: left;
  font-size: 15px;
  max-width: 100%;
  box-shadow: 0 3px 14px var(--shadow-color);
  animation: slideUp-tablet 0.3s ease-out;
  position: fixed;
  top: 70px;
  left: 16px;
  right: 16px;
  z-index: 1000;
}

.result-message-tablet.success {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.result-message-tablet.error {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%);
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.result-icon-tablet {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 18px;
}

.result-message-tablet.success .result-icon-tablet {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.result-message-tablet.error .result-icon-tablet {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.result-content-tablet {
  flex: 1;
}

.result-title-tablet {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 3px;
}

.result-message-tablet.success .result-title-tablet {
  color: #4CAF50;
}

.result-message-tablet.error .result-title-tablet {
  color: #f44336;
}

.result-text-tablet {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.35;
}

@keyframes spin-tablet {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse-tablet {
  0% {
    box-shadow: 
      0 10px 34px rgba(102, 126, 234, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow: 
      0 14px 44px rgba(102, 126, 234, 0.5),
      0 0 0 7px rgba(102, 126, 234, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  100% {
    box-shadow: 
      0 10px 34px rgba(102, 126, 234, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
}

@keyframes slideUp-tablet {
  from {
    opacity: 0;
    transform: translateY(17px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
