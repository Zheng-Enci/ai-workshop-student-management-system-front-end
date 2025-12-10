<template>
  <div class="admin-container">
    <div class="tech-background">
      <div class="scan-lines"></div>
      <div class="grid-overlay"></div>
      <div class="data-streams">
        <div class="stream stream-1"></div>
        <div class="stream stream-2"></div>
        <div class="stream stream-3"></div>
      </div>
      <div class="security-particles">
        <div class="particle" v-for="n in 20" :key="n"></div>
      </div>
    </div>
    
    <div class="admin-header">
      <div class="header-content">
        <div class="logo-container">
          <img 
            src="@/assets/AiWorkShop_icon.png" 
            alt="AI坊" 
            class="admin-logo" 
            @click="toggleTheme"
            title="切换主题模式"
          >
          <div class="logo-ring"></div>
        </div>
        <div class="admin-title">
          <h1>超级管理员控制台</h1>
          <p>Super Admin Console</p>
          <div class="title-glow"></div>
        </div>
        <div class="security-badge">
          <div class="security-icon-container">
            <el-icon class="security-icon"><Lock /></el-icon>
            <div class="security-pulse"></div>
          </div>
          <span>安全模式</span>
          <div class="security-status">
            <div class="status-dot"></div>
            <span>已激活</span>
          </div>
        </div>
      </div>
    </div>

    <router-view />
  </div>
</template>

<script setup>
import { ElIcon } from 'element-plus'
import 'element-plus/theme-chalk/el-icon.css'
import { Lock } from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const { toggleTheme } = themeStore
</script>

<style scoped>
:root {
  --admin-bg-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --admin-bg-secondary: rgba(255, 255, 255, 0.95);
  --admin-bg-card: rgba(255, 255, 255, 0.95);
  --admin-text-primary: #2c3e50;
  --admin-text-secondary: #5a6c7d;
  --admin-text-tertiary: #7f8c8d;
  --admin-border-color: rgba(255, 255, 255, 0.2);
  --admin-shadow: rgba(0, 0, 0, 0.1);
}

html.dark {
  --admin-bg-primary: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  --admin-bg-secondary: rgba(0, 0, 0, 0.3);
  --admin-bg-card: rgba(0, 0, 0, 0.8);
  --admin-text-primary: #ffffff;
  --admin-text-secondary: #e2e8f0;
  --admin-text-tertiary: #cbd5e1;
  --admin-border-color: rgba(255, 255, 255, 0.1);
  --admin-shadow: rgba(0, 0, 0, 0.2);
}

.admin-container {
  min-height: 100vh;
  background: var(--admin-bg-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #ffffff;
  position: relative;
  overflow: hidden;
}

.tech-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.scan-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 255, 255, 0.1) 50%,
    transparent 100%
  );
  animation: scan 3s linear infinite;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: grid-move 20s linear infinite;
}

html.dark .grid-overlay {
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
}

.data-streams {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.stream {
  position: absolute;
  width: 2px;
  height: 100px;
  background: linear-gradient(to bottom, transparent, #00ffff, transparent);
  animation: stream-flow 4s linear infinite;
}

.stream-1 {
  left: 20%;
  animation-delay: 0s;
}

.stream-2 {
  left: 50%;
  animation-delay: 1.5s;
}

.stream-3 {
  left: 80%;
  animation-delay: 3s;
}

.security-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #00ffff;
  border-radius: 50%;
  animation: particle-float 8s linear infinite;
}

.particle:nth-child(odd) {
  animation-delay: 0s;
}

.particle:nth-child(even) {
  animation-delay: 4s;
}

@keyframes scan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes grid-move {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

@keyframes stream-flow {
  0% { 
    top: -100px; 
    opacity: 0; 
  }
  50% { 
    opacity: 1; 
  }
  100% { 
    top: 100vh; 
    opacity: 0; 
  }
}

@keyframes particle-float {
  0% {
    transform: translateY(100vh) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(100px);
    opacity: 0;
  }
}

@keyframes header-glow {
  0% { opacity: 0.3; }
  100% { opacity: 1; }
}

@keyframes logo-rotate {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes title-pulse {
  0% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.8); }
  100% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); }
}

@keyframes security-pulse {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
}

@keyframes status-blink {
  0% { opacity: 0.5; }
  100% { opacity: 1; }
}

@keyframes border-glow {
  0% { opacity: 0.3; }
  100% { opacity: 0.8; }
}

@keyframes card-scan {
  0% { left: -100%; }
  100% { left: 100%; }
}

@keyframes icon-rotate {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes icon-pulse {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.3; }
  100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
}

@keyframes indicator-flow {
  0% { width: 10px; }
  100% { width: 30px; }
}

@keyframes input-glow {
  0% { opacity: 0.3; }
  100% { opacity: 0.8; }
}

@keyframes button-sweep {
  0% { left: -100%; }
  100% { left: 100%; }
}

@keyframes title-gradient {
  0% { 
    background-position: 0% 50%; 
    filter: brightness(1);
  }
  100% { 
    background-position: 100% 50%; 
    filter: brightness(1.2);
  }
}

.admin-header {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(15px);
  border-bottom: 2px solid rgba(0, 255, 255, 0.3);
  padding: 20px 40px;
  position: relative;
  z-index: 10;
}

.admin-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
  animation: header-glow 2s ease-in-out infinite alternate;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
}

.logo-container {
  position: relative;
  margin-right: 20px;
}

.admin-logo {
  width: 50px;
  height: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;
}

.admin-logo:hover {
  transform: scale(1.1);
  filter: brightness(1.2);
}

.logo-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border: 3px solid rgba(0, 255, 255, 0.7);
  border-radius: 50%;
  animation: logo-rotate 4s linear infinite;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
}

.logo-ring::before {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 2px solid rgba(0, 255, 255, 0.4);
  border-radius: 50%;
  animation: logo-rotate 4s linear infinite reverse;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
}

.logo-ring::after {
  content: '';
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 50%;
  animation: logo-rotate 6s linear infinite;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.1);
}

.admin-title {
  position: relative;
  text-align: center;
}

.admin-title h1 {
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 8px 0;
  color: #ffffff;
  text-shadow: 
    0 0 20px rgba(0, 255, 255, 0.8),
    0 0 40px rgba(0, 255, 255, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
  letter-spacing: 2px;
  text-transform: uppercase;
  background: linear-gradient(45deg, #ffffff, #00ffff, #ffffff);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: title-gradient 3s ease-in-out infinite alternate;
}

.admin-title p {
  font-size: 14px;
  color: rgba(0, 255, 255, 0.9);
  margin: 0;
  text-shadow: 
    0 0 10px rgba(0, 255, 255, 0.6),
    0 0 20px rgba(0, 255, 255, 0.3);
  letter-spacing: 1px;
  font-weight: 500;
  text-transform: uppercase;
  opacity: 0.9;
}

.title-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 80px;
  background: radial-gradient(ellipse, rgba(0, 255, 255, 0.15) 0%, transparent 70%);
  animation: title-pulse 3s ease-in-out infinite alternate;
  border-radius: 20px;
  filter: blur(1px);
}

.security-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 255, 255, 0.1);
  padding: 12px 20px;
  border-radius: 25px;
  border: 2px solid rgba(0, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
}

.security-icon-container {
  position: relative;
}

.security-icon {
  color: #00ffff;
  font-size: 20px;
  position: relative;
  z-index: 2;
}

.security-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border: 2px solid rgba(0, 255, 255, 0.5);
  border-radius: 50%;
  animation: security-pulse 2s ease-in-out infinite;
}

.security-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #00ff00;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #00ff00;
  border-radius: 50%;
  animation: status-blink 1s ease-in-out infinite alternate;
}

.auth-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 40px;
}

.auth-card {
  background: var(--admin-bg-card);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px var(--admin-shadow);
  border: 1px solid var(--admin-border-color);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.auth-card {
  background: var(--admin-bg-card);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px var(--admin-shadow);
  border: 2px solid rgba(0, 255, 255, 0.3);
  max-width: 400px;
  width: 100%;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.card-border-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  background: linear-gradient(45deg, transparent, rgba(0, 255, 255, 0.1), transparent);
  animation: border-glow 3s ease-in-out infinite alternate;
}

.card-scan-line {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
  animation: card-scan 2s linear infinite;
}

.auth-icon-container {
  position: relative;
  margin-bottom: 20px;
}

.auth-icon {
  font-size: 48px;
  color: #00ffff;
  position: relative;
  z-index: 2;
}

.icon-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border: 2px solid rgba(0, 255, 255, 0.5);
  border-radius: 50%;
  animation: icon-rotate 3s linear infinite;
}

.icon-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 50%;
  animation: icon-pulse 2s ease-in-out infinite;
}

.auth-status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 14px;
  color: var(--admin-text-secondary);
}

.indicator-line {
  width: 20px;
  height: 2px;
  background: linear-gradient(90deg, #00ffff, transparent);
  animation: indicator-flow 1.5s ease-in-out infinite alternate;
}

.input-container {
  position: relative;
  margin-bottom: 20px;
}

.password-input {
  position: relative;
  z-index: 2;
}

.input-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 8px;
  background: linear-gradient(45deg, transparent, rgba(0, 255, 255, 0.1), transparent);
  animation: input-glow 2s ease-in-out infinite alternate;
}

.auth-button {
  position: relative;
  overflow: hidden;
  background: linear-gradient(45deg, #00ffff, #0080ff);
  border: none;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
}

.button-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: button-sweep 2s ease-in-out infinite;
}

.auth-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin: 0 0 10px 0;
}

.auth-header p {
  font-size: 16px;
  color: var(--admin-text-secondary);
  margin: 0;
  font-weight: 500;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.password-input {
  width: 100%;
}

.auth-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #f56565;
  font-size: 14px;
  margin-top: 15px;
}

.admin-content {
  max-width: 90%;
  margin: 0 auto;
  padding: 40px;
}

.admin-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--admin-text-primary);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 16px;
  color: var(--admin-text-secondary);
}

.students-section {
  background: var(--admin-bg-card);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid var(--admin-border-color);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-input {
  width: 250px;
}


.level-tabs {
  margin-bottom: 30px;
}

.level-tabs-container {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  padding: 16px 24px;
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-size: 16px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  min-width: 160px;
  justify-content: center;
}

.tab-label::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s;
}

.tab-label:hover::before {
  left: 100%;
}

.tab-count {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 800;
  color: var(--admin-text-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  min-width: 32px;
  text-align: center;
}

.level-tab-info .tab-label {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%);
  color: #ffffff;
  border: 2px solid rgba(25, 118, 210, 0.3);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.3);
}

.level-tab-info .tab-label:hover {
  background: linear-gradient(135deg, #1565c0 0%, #0d47a1 50%, #0277bd 100%);
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 35px rgba(25, 118, 210, 0.5);
}

.level-tab-success .tab-label {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 50%, #0d4f1c 100%);
  color: #ffffff;
  border: 2px solid rgba(46, 125, 50, 0.3);
  box-shadow: 0 8px 25px rgba(46, 125, 50, 0.3);
}

.level-tab-success .tab-label:hover {
  background: linear-gradient(135deg, #1b5e20 0%, #0d4f1c 50%, #004d40 100%);
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 35px rgba(46, 125, 50, 0.5);
}

.level-tab-warning .tab-label {
  background: linear-gradient(135deg, #f57c00 0%, #ef6c00 50%, #e65100 100%);
  color: #ffffff;
  border: 2px solid rgba(245, 124, 0, 0.3);
  box-shadow: 0 8px 25px rgba(245, 124, 0, 0.3);
}

.level-tab-warning .tab-label:hover {
  background: linear-gradient(135deg, #ef6c00 0%, #e65100 50%, #d84315 100%);
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 35px rgba(245, 124, 0, 0.5);
}

.level-tab-danger .tab-label {
  background: linear-gradient(135deg, #d32f2f 0%, #c62828 50%, #b71c1c 100%);
  color: #ffffff;
  border: 2px solid rgba(211, 47, 47, 0.3);
  box-shadow: 0 8px 25px rgba(211, 47, 47, 0.3);
}

.level-tab-danger .tab-label:hover {
  background: linear-gradient(135deg, #c62828 0%, #b71c1c 50%, #a71e1e 100%);
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 35px rgba(211, 47, 47, 0.5);
}

.level-tab-info .tab-count {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: var(--admin-text-primary);
  border-color: rgba(25, 118, 210, 0.3);
}

.level-tab-success .tab-count {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  color: var(--admin-text-primary);
  border-color: rgba(46, 125, 50, 0.3);
}

.level-tab-warning .tab-count {
  background: linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%);
  color: var(--admin-text-primary);
  border-color: rgba(245, 124, 0, 0.3);
}

.level-tab-danger .tab-count {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  color: var(--admin-text-primary);
  border-color: rgba(211, 47, 47, 0.3);
}

.students-table-container {
  margin-bottom: 20px;
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.students-table {
  width: 100%;
  min-width: 1800px;
}

.student-id {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: var(--admin-text-secondary);
}

.student-name {
  font-weight: 600;
  color: var(--admin-text-primary);
}

.phone-number {
  font-family: 'Courier New', monospace;
  color: var(--admin-text-secondary);
  font-weight: 500;
}

.college, .major {
  color: var(--admin-text-primary);
}

.class-num {
  color: var(--admin-text-secondary);
  font-weight: 500;
}

.attendance-count {
  display: flex;
  justify-content: center;
  align-items: center;
}

.attendance-tag {
  font-weight: 600;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  min-width: 50px;
  text-align: center;
}

.level-select {
  width: 120px;
}

.admin-select {
  width: 180px;
}

.no-admin-available {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%);
  border-radius: 8px;
  border: 1px solid #ff9800;
  color: var(--admin-text-primary);
  font-size: 12px;
  width: 180px;
}

.admin-level-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border-radius: 8px;
  border: 1px solid #f44336;
  color: var(--admin-text-primary);
  font-size: 12px;
  width: 180px;
  font-weight: 600;
}

.warning-icon {
  color: var(--admin-text-secondary);
  font-size: 14px;
}

.admin-icon {
  color: var(--admin-text-secondary);
  font-size: 14px;
}

.admin-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.option-icon {
  color: var(--admin-text-secondary);
  font-size: 14px;
}

.option-text {
  flex: 1;
}

.option-name {
  font-weight: 600;
  color: var(--admin-text-primary);
  font-size: 13px;
  line-height: 1.2;
}

.option-id {
  color: var(--admin-text-tertiary);
  font-size: 11px;
  line-height: 1.2;
  font-family: 'Courier New', monospace;
}


.level-row-info {
  background: #0000FF !important;
  border: 5px solid #000080 !important;
  box-shadow: 0 0 20px #0000FF, inset 0 0 20px #0000FF !important;
  font-weight: 900 !important;
  color: #FFFFFF !important;
  text-shadow: 2px 2px 4px #000000 !important;
  animation: pulse-blue 2s infinite !important;
}

.level-row-success {
  background: #00FF00 !important;
  border: 5px solid #008000 !important;
  box-shadow: 0 0 20px #00FF00, inset 0 0 20px #00FF00 !important;
  font-weight: 900 !important;
  color: #000000 !important;
  text-shadow: 2px 2px 4px #FFFFFF !important;
  animation: pulse-green 2s infinite !important;
}

.level-row-warning {
  background: #FFA500 !important;
  border: 5px solid #FF8C00 !important;
  box-shadow: 0 0 20px #FFA500, inset 0 0 20px #FFA500 !important;
  font-weight: 900 !important;
  color: #000000 !important;
  text-shadow: 2px 2px 4px #FFFFFF !important;
  animation: pulse-orange 2s infinite !important;
}

.level-row-danger {
  background: #FF0000 !important;
  border: 5px solid #8B0000 !important;
  box-shadow: 0 0 20px #FF0000, inset 0 0 20px #FF0000 !important;
  font-weight: 900 !important;
  color: #FFFFFF !important;
  text-shadow: 2px 2px 4px #000000 !important;
  animation: pulse-red 2s infinite !important;
}

.level-row-info:hover {
  background: #000080 !important;
  border: 8px solid #0000FF !important;
  box-shadow: 0 0 30px #0000FF, inset 0 0 30px #0000FF !important;
  transform: scale(1.05) !important;
  animation: pulse-blue-fast 0.5s infinite !important;
}

.level-row-success:hover {
  background: #008000 !important;
  border: 8px solid #00FF00 !important;
  box-shadow: 0 0 30px #00FF00, inset 0 0 30px #00FF00 !important;
  transform: scale(1.05) !important;
  animation: pulse-green-fast 0.5s infinite !important;
}

.level-row-warning:hover {
  background: #FF8C00 !important;
  border: 8px solid #FFA500 !important;
  box-shadow: 0 0 30px #FFA500, inset 0 0 30px #FFA500 !important;
  transform: scale(1.05) !important;
  animation: pulse-orange-fast 0.5s infinite !important;
}

.level-row-danger:hover {
  background: #8B0000 !important;
  border: 8px solid #FF0000 !important;
  box-shadow: 0 0 30px #FF0000, inset 0 0 30px #FF0000 !important;
  transform: scale(1.05) !important;
  animation: pulse-red-fast 0.5s infinite !important;
}

@keyframes pulse-blue {
  0%, 100% { box-shadow: 0 0 20px #0000FF, inset 0 0 20px #0000FF; }
  50% { box-shadow: 0 0 40px #0000FF, inset 0 0 40px #0000FF; }
}

@keyframes pulse-green {
  0%, 100% { box-shadow: 0 0 20px #00FF00, inset 0 0 20px #00FF00; }
  50% { box-shadow: 0 0 40px #00FF00, inset 0 0 40px #00FF00; }
}

@keyframes pulse-orange {
  0%, 100% { box-shadow: 0 0 20px #FFA500, inset 0 0 20px #FFA500; }
  50% { box-shadow: 0 0 40px #FFA500, inset 0 0 40px #FFA500; }
}

@keyframes pulse-red {
  0%, 100% { box-shadow: 0 0 20px #FF0000, inset 0 0 20px #FF0000; }
  50% { box-shadow: 0 0 40px #FF0000, inset 0 0 40px #FF0000; }
}

@keyframes pulse-blue-fast {
  0%, 100% { box-shadow: 0 0 30px #0000FF, inset 0 0 30px #0000FF; }
  50% { box-shadow: 0 0 60px #0000FF, inset 0 0 60px #0000FF; }
}

@keyframes pulse-green-fast {
  0%, 100% { box-shadow: 0 0 30px #00FF00, inset 0 0 30px #00FF00; }
  50% { box-shadow: 0 0 60px #00FF00, inset 0 0 60px #00FF00; }
}

@keyframes pulse-orange-fast {
  0%, 100% { box-shadow: 0 0 30px #FFA500, inset 0 0 30px #FFA500; }
  50% { box-shadow: 0 0 60px #FFA500, inset 0 0 60px #FFA500; }
}

@keyframes pulse-red-fast {
  0%, 100% { box-shadow: 0 0 30px #FF0000, inset 0 0 30px #FF0000; }
  50% { box-shadow: 0 0 60px #FF0000, inset 0 0 60px #FF0000; }
}


.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.pagination-info {
  color: var(--admin-text-secondary);
  font-size: 14px;
}

.pagination {
  margin: 0;
}

.admin-footer {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 40px;
  margin-top: 40px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-left {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 15px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.logout-btn {
  background: rgba(245, 101, 101, 0.2);
  border: 1px solid rgba(245, 101, 101, 0.3);
  color: #f56565;
}

.logout-btn:hover {
  background: rgba(245, 101, 101, 0.3);
  border-color: rgba(245, 101, 101, 0.5);
}

@media (max-width: 768px) {
  .admin-header {
    padding: 15px 20px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .admin-content {
    padding: 20px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .search-input {
    width: 100%;
  }
  
  .table-footer {
    flex-direction: column;
    align-items: stretch;
  }
  
  .admin-footer {
    padding: 15px 20px;
  }
  
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
  
  .students-table-container {
    margin: 0 -20px;
    border-radius: 0;
  }
  
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.action-btn:active {
  transform: translateY(0);
}

.edit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.edit-btn:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

.records-btn {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
}

.records-btn:hover {
  background: linear-gradient(135deg, #0ea572 0%, #047857 100%);
}

.makeup-btn {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  color: white;
}

.makeup-btn:hover {
  background: linear-gradient(135deg, #e58e0a 0%, #c46205 100%);
}

@media (max-width: 1200px) {
  .students-table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .students-table {
    min-width: 1800px;
  }
  
  .action-buttons {
    gap: 6px;
  }
  
  .action-btn {
    width: 28px;
    height: 28px;
  }
}

}

.edit-dialog {
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

.edit-form {
  .el-form-item__label {
    font-weight: 600;
    color: #2c3e50;
  }
  
  .el-input__inner,
  .el-select .el-input__inner {
    border-radius: 8px;
    border: 2px solid #e1e8ed;
    transition: all 0.3s ease;
  }
  
  .el-input__inner:focus,
  .el-select .el-input__inner:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
  
  .el-input-number {
    width: 100%;
  }
  
  .el-input-number .el-input__inner {
    text-align: left;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  
  .el-button {
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .el-button--primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
  }
  
  .el-button--primary:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
}


.today-attendance-dialog {
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
  display: none;
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

.calendar-day {
  position: relative;
  height: 100%;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 4px;
}

.day-number {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.attendance-dots {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.attendance-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.attendance-dot.morning {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  box-shadow: 0 0 4px rgba(16, 185, 129, 0.4);
}

.attendance-dot.afternoon {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  box-shadow: 0 0 4px rgba(245, 158, 11, 0.4);
}

.attendance-dot.evening {
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  box-shadow: 0 0 4px rgba(139, 92, 246, 0.4);
}

.attendance-dot:hover {
  transform: scale(1.2);
}

.calendar-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6B7280;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-dot.morning {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.4);
}

.legend-dot.afternoon {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  box-shadow: 0 0 6px rgba(245, 158, 11, 0.4);
}

.legend-dot.evening {
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  box-shadow: 0 0 6px rgba(139, 92, 246, 0.4);
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

.records-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
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


