<template>
  <div class="auth-section">
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-icon-container">
          <el-icon class="auth-icon"><Key /></el-icon>
          <div class="icon-ring"></div>
        </div>
        <h2>身份验证</h2>
        <p>请输入特殊密码以访问管理员功能</p>
        <div class="auth-status-indicator">
          <div class="status-icon">
            <div class="status-dot"></div>
            <div class="status-pulse"></div>
          </div>
          <span class="status-text">等待验证</span>
          <div class="status-animation">
            <div class="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
      <div class="auth-form">
        <div class="input-container">
          <el-input
            v-model="specialPassword"
            type="password"
            placeholder="请输入特殊密码"
            show-password
            size="large"
            @keyup.enter="authenticate"
            class="password-input"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </div>
        <el-button 
          type="primary" 
          size="large" 
          @click="authenticate"
          :loading="isLoading"
          class="auth-button"
        >
          <span>验证身份</span>
        </el-button>
      </div>
      <div v-if="authError" class="error-message">
        <el-icon><Warning /></el-icon>
        {{ authError }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Lock, Key, Warning } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { getAllStudentsWithSpecialPassword } from '@/api/admin'
import { useAdminStore } from '@/stores/admin'

const router = useRouter()
const adminStore = useAdminStore()

const specialPassword = ref('')
const authError = ref('')
const isLoading = ref(false)

const authenticate = async () => {
  if (!specialPassword.value.trim()) {
    authError.value = '请输入特殊密码'
    return
  }

  isLoading.value = true
  authError.value = ''

  try {
    const response = await getAllStudentsWithSpecialPassword(specialPassword.value)
    
    if (response.code === 200) {
      adminStore.setAdminPassword(specialPassword.value)
      ElMessage.success('身份验证成功')
      setTimeout(() => {
        router.push('/admin/console').catch(() => {
          authError.value = '页面跳转失败，请手动刷新'
        })
      }, 500)
    } else {
      authError.value = '密码错误，请重新输入'
    }
  } catch (error) {
    if (error.message === '特殊密码错误') {
      authError.value = '密码错误，请重新输入'
    } else {
      authError.value = '验证失败，请重试'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.auth-section :deep(.el-message--success) {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: white !important;
}

.auth-section :deep(.el-message--success .el-message__content) {
  color: white !important;
}

.auth-section :deep(.el-message--success .el-icon) {
  color: white !important;
}

.auth-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 25px 50px var(--shadow-color);
  border: 1px solid var(--glass-border);
  max-width: 420px;
  width: 100%;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.auth-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 32px 64px var(--shadow-hover);
}

.auth-icon-container {
  position: relative;
  margin-bottom: 32px;
}

.auth-icon {
  font-size: 56px;
  color: var(--primary-color);
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.auth-icon:hover {
  transform: scale(1.1);
  color: var(--secondary-color);
}

.icon-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.auth-icon-container:hover .icon-ring {
  border-color: var(--primary-color);
  box-shadow: 0 0 20px var(--shadow-color);
}

.auth-status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
  padding: 16px 24px;
  background: var(--glass-bg);
  border-radius: 16px;
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px var(--shadow-color);
  transition: all 0.3s ease;
}

.auth-status-indicator:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px var(--shadow-hover);
}

.status-icon {
  position: relative;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: var(--primary-color);
  border-radius: 50%;
  position: relative;
  z-index: 2;
}

.status-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid var(--primary-color);
  border-radius: 50%;
  animation: status-pulse 2s ease-in-out infinite;
}

.status-text {
  font-size: 16px;
  color: var(--text-primary);
  font-weight: 600;
  letter-spacing: 0.5px;
}

.status-animation {
  display: flex;
  align-items: center;
}

.loading-dots {
  display: flex;
  gap: 4px;
}

.loading-dots span {
  width: 6px;
  height: 6px;
  background: var(--primary-color);
  border-radius: 50%;
  animation: loading-dots 1.4s ease-in-out infinite both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0s;
}

@keyframes status-pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

@keyframes loading-dots {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.input-container {
  position: relative;
  margin-bottom: 24px;
}

.password-input {
  position: relative;
  z-index: 2;
}

.password-input :deep(.el-input__wrapper) {
  border-radius: 12px;
  border: 2px solid var(--border-color);
  background: var(--bg-primary);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px var(--shadow-color);
}

.password-input :deep(.el-input__wrapper:hover) {
  border-color: var(--primary-color);
  box-shadow: 0 6px 20px var(--shadow-color);
}

.password-input :deep(.el-input__wrapper.is-focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--shadow-color);
}

.password-input :deep(.el-input__inner) {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 16px;
}

.password-input :deep(.el-input__inner::placeholder) {
  color: var(--text-tertiary);
  font-weight: 500;
}

.password-input :deep(.el-input__prefix) {
  color: var(--text-secondary);
}

.auth-button {
  position: relative;
  overflow: hidden;
  background: var(--primary-gradient);
  border: none;
  border-radius: 12px;
  box-shadow: 0 8px 24px var(--shadow-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: white;
  font-weight: 600;
}

.auth-button:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 12px 32px var(--shadow-hover);
  color: white;
}

.auth-button:active {
  transform: translateY(0);
  color: white;
}

.auth-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
}

.auth-header p {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 600;
  line-height: 1.6;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.password-input {
  width: 100%;
}

.auth-button {
  width: 100%;
  height: 52px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--danger-color);
  font-size: 14px;
  font-weight: 600;
  margin-top: 16px;
  padding: 12px 16px;
  background: rgba(245, 108, 108, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(245, 108, 108, 0.2);
}

@media (max-width: 768px) {
  .auth-section {
    padding: 20px;
  }
  
  .auth-card {
    padding: 32px 24px;
    border-radius: 20px;
  }
  
  .auth-header h2 {
    font-size: 24px;
  }
  
  .auth-header p {
    font-size: 14px;
  }
  
  .auth-icon {
    font-size: 48px;
  }
  
  .icon-ring {
    width: 80px;
    height: 80px;
  }
}
</style>