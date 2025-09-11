<template>
  <div class="attendance-container">
    <div class="content-wrapper">
      <div class="attendance-header">
        <el-button 
          type="primary" 
          @click="goToNavigation" 
          class="nav-button"
          :icon="ArrowLeft"
        >
          返回导航
        </el-button>
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊学生管理系统" class="logo">
        <h1>AI坊学生签到</h1>
      </div>
      
      <div class="center-area">
        <div class="time-info">
          <div class="current-time">当前时间：{{ currentTime }}</div>
          <div v-if="!isInSignTime" class="next-time">下次签到：{{ nextSignTime }}</div>
        </div>
          <button 
            class="circle-button"
            @click="submitAttendance"
            :disabled="loading || !isInSignTime || isCurrentSlotSigned()"
            :class="{ 
              'loading': loading, 
              'disabled': !isInSignTime || isCurrentSlotSigned(),
              'success': isInSignTime && isCurrentSlotSigned()
            }"
          >
          <div class="button-content">
            <el-icon v-if="!loading && isInSignTime && !isCurrentSlotSigned()" size="48" class="icon"><Check /></el-icon>
            <el-icon v-else-if="!loading && isInSignTime && isCurrentSlotSigned()" size="48" class="icon success-icon"><Check /></el-icon>
            <el-icon v-else-if="!loading && !isInSignTime" size="48" class="icon disabled-icon"><Clock /></el-icon>
            <el-icon v-else size="32" class="loading-icon"><Loading /></el-icon>
            <span v-if="!loading" class="button-text">
              {{ !isInSignTime ? '非签到时间' : (isCurrentSlotSigned() ? '已签到' : '签到') }}
            </span>
          </div>
        </button>
      </div>
      
      <div v-if="result" class="result-message" :class="result.type">
        {{ result.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Check, Loading, ArrowLeft, Clock } from '@element-plus/icons-vue'
import { signIn } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const loading = ref(false)
const result = ref(null)
const userStore = useUserStore()
const router = useRouter()
const isInSignTime = ref(false)
const currentTime = ref('')
const nextSignTime = ref('')
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
  
  if (hour >= 8 && hour < 12) return 'morning'
  if (hour >= 14 && hour < 18) return 'afternoon'
  if (hour >= 19 && hour < 22) return 'evening'
  return null
}

const isCurrentSlotSigned = () => {
  const currentSlot = getCurrentTimeSlot()
  if (!currentSlot) return false
  return attendanceStatus.value[currentSlot]
}

const loadAttendanceStatus = () => {
  const today = new Date().toDateString()
  const saved = localStorage.getItem(`attendance_${today}`)
  if (saved) {
    try {
      attendanceStatus.value = JSON.parse(saved)
    } catch (e) {
      attendanceStatus.value = { morning: false, afternoon: false, evening: false }
    }
  }
}

const saveAttendanceStatus = () => {
  const today = new Date().toDateString()
  localStorage.setItem(`attendance_${today}`, JSON.stringify(attendanceStatus.value))
}

const checkSignTime = () => {
  const now = new Date()
  const hour = now.getHours()
  const minute = now.getMinutes()
  const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  currentTime.value = timeStr
  
  const signTimeRanges = [
    { start: 8, end: 11, name: '上午' },
    { start: 14, end: 17, name: '下午' },
    { start: 19, end: 23, name: '晚上' }
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
      if (currentSlot) {
        attendanceStatus.value[currentSlot] = true
        saveAttendanceStatus()
      }
      
      result.value = {
        type: 'success',
        message: res.message || '签到成功'
      }
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

onMounted(() => {
  loadAttendanceStatus()
  checkSignTime()
  setInterval(checkSignTime, 60000)
})
</script>

<style scoped>
.attendance-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #ffffff;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  max-height: 600px;
}

.attendance-header {
  position: relative;
  text-align: center;
  margin-bottom: auto;
  padding-top: 20px;
}

.nav-button {
  position: fixed;
  top: 10px;
  left: 10px;
  height: 40px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  background: linear-gradient(135deg, #4ca1af 0%, #2c3e50 100%);
  border: none;
  color: white;
  box-shadow: 0 2px 8px rgba(76, 161, 175, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
  padding: 0 16px;
  min-width: 80px;
}

.nav-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 161, 175, 0.4);
}

@media (max-width: 768px) {
  .nav-button {
    top: 8px;
    left: 8px;
    height: 44px;
    font-size: 15px;
    padding: 0 18px;
    min-width: 90px;
    border-radius: 22px;
  }
  
  .attendance-header {
    padding-top: 60px;
  }
}

.logo {
  width: 70px;
  height: 70px;
  margin-bottom: 15px;
}

h1 {
  color: #333333;
  font-size: 26px;
  margin: 0;
  font-weight: 500;
}

.center-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
  gap: 20px;
}

.time-info {
  text-align: center;
  margin-bottom: 10px;
}

.current-time {
  font-size: 16px;
  color: #666;
  font-weight: 500;
  margin-bottom: 5px;
}

.next-time {
  font-size: 14px;
  color: #999;
}

.circle-button {
  width: 200px !important;
  height: 200px !important;
  border-radius: 50% !important;
  border: none !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  cursor: pointer !important;
  box-shadow: 
    0 10px 40px rgba(102, 126, 234, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  position: relative !important;
  overflow: hidden !important;
}

.circle-button:hover:not(:disabled) {
  transform: translateY(-2px) !important;
  box-shadow: 
    0 12px 45px rgba(102, 126, 234, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
}

.circle-button:hover:not(:disabled) .icon {
  transform: scale(1.05) !important;
}

.circle-button:hover:not(:disabled) .button-text {
  transform: translateY(-1px) !important;
}

.circle-button:active:not(:disabled) {
  transform: translateY(1px) !important;
  box-shadow: 
    0 6px 25px rgba(102, 126, 234, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
}

.circle-button:disabled {
  opacity: 0.8;
  cursor: not-allowed;
  transform: scale(0.98);
}

.circle-button.disabled {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
  background: linear-gradient(135deg, #9E9E9E 0%, #757575 50%, #616161 100%) !important;
  box-shadow: 
    0 6px 25px rgba(158, 158, 158, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
}

.circle-button.disabled:hover {
  transform: none !important;
  box-shadow: 
    0 6px 25px rgba(158, 158, 158, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
}

.circle-button.disabled.success {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 50%, #2E7D32 100%) !important;
  opacity: 0.8 !important;
  box-shadow: 
    0 6px 25px rgba(76, 175, 80, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
}

.disabled-icon {
  opacity: 0.6 !important;
  filter: grayscale(100%) !important;
}

.success-icon {
  opacity: 0.8 !important;
  filter: drop-shadow(0 3px 6px rgba(76, 175, 80, 0.4)) !important;
}

.circle-button.loading {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  animation: pulse 2s ease-in-out infinite !important;
}

.circle-button.loading .icon {
  animation: spin 1s linear infinite !important;
}

.button-content {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 12px !important;
  position: relative !important;
  z-index: 2 !important;
}

.icon {
  margin-bottom: 0 !important;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3)) !important;
  transition: all 0.3s ease !important;
}

.button-text {
  font-size: 24px !important;
  font-weight: 700 !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
  letter-spacing: 1px !important;
  color: white !important;
  transition: all 0.3s ease !important;
}

.loading-icon {
  animation: spin 1s linear infinite;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 
      0 10px 40px rgba(102, 126, 234, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow: 
      0 15px 50px rgba(102, 126, 234, 0.5),
      0 0 0 8px rgba(102, 126, 234, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  100% {
    box-shadow: 
      0 10px 40px rgba(102, 126, 234, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
}

.result-message {
  margin-top: auto;
  margin-bottom: 40px;
  padding: 15px 25px;
  border-radius: 25px;
  text-align: center;
  font-size: 16px;
  max-width: 300px;
}

.result-message.success {
  background: rgba(103, 194, 58, 0.1);
  color: #67c23a;
  border: 1px solid rgba(103, 194, 58, 0.2);
}

.result-message.error {
  background: rgba(245, 108, 108, 0.1);
  color: #f56c6c;
  border: 1px solid rgba(245, 108, 108, 0.2);
}

@media (max-height: 600px) {
  .content-wrapper {
    max-height: 500px;
  }
  
  .circle-button {
    width: 180px !important;
    height: 180px !important;
  }
  
  .button-text {
    font-size: 22px !important;
  }
}

@media (max-width: 480px) {
  .circle-button {
    width: 170px !important;
    height: 170px !important;
  }
  
  .button-text {
    font-size: 20px !important;
  }
  
  .icon {
    margin-bottom: 0 !important;
  }
}
</style>