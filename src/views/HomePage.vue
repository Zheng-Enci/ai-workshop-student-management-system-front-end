<template>
  <div class="home-container">
    <div class="theme-toggle-container">
      <img 
        src="@/assets/AiWorkShop_icon.png" 
        alt="AI坊" 
        class="theme-toggle-icon" 
        @click="toggleTheme" 
        title="切换主题模式"
      >
    </div>

    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-left">
          <div class="logo-section">
            <div class="logo-container">
              <div class="logo-glow"></div>
            </div>
            <h1 class="main-title">人工智能创作坊</h1>
            <p class="main-subtitle">学生管理系统</p>
            <p class="tagline">世界很大 AI无限</p>
          </div>
          
          <div class="description-section">
            <h2 class="section-title">欢迎使用AI坊学生管理系统</h2>
            <p class="description">
              基于Vue3和Spring Boot构建的现代化学生管理系统，
              提供智能化的学生信息管理、考勤统计、数据分析等功能。
              让教育管理更加高效、便捷、智能。
            </p>
          </div>

          <div class="action-section">
            <el-button type="primary" size="large" @click="goToLogin" class="action-button">
              <el-icon><ArrowRight /></el-icon>
              立即体验
            </el-button>
            <el-button size="large" @click="goToRegister" class="secondary-button">
              注册账号
            </el-button>
            <el-button size="large" @click="showUpdateLog" class="update-log-button">
              <el-icon><Document /></el-icon>
              更新日志
            </el-button>
          </div>
        </div>

        <div class="hero-right">
          <div class="features-showcase">
            <div class="feature-card primary">
              <div class="feature-icon">
                <el-icon><User /></el-icon>
              </div>
              <h3>学生管理</h3>
              <p>完善的学生信息管理，支持注册、登录、信息更新</p>
            </div>
            
            <div class="feature-card secondary">
              <div class="feature-icon">
                <el-icon><Calendar /></el-icon>
              </div>
              <h3>智能考勤</h3>
              <p>分时段签到系统，实时统计考勤数据</p>
            </div>
            
            <div class="feature-card tertiary">
              <div class="feature-icon">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <h3>数据分析</h3>
              <p>多维度数据统计，可视化图表展示</p>
            </div>
            
            <div class="feature-card quaternary">
              <div class="feature-icon">
                <el-icon><Setting /></el-icon>
              </div>
              <h3>权限管理</h3>
              <p>多级权限控制，安全可靠的管理体系</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="info-section">
      <div class="info-content">
        <div class="tech-stack">
          <h3>技术栈</h3>
          <div class="tech-tags">
            <span class="tech-tag">Vue 3</span>
            <span class="tech-tag">Element Plus</span>
            <span class="tech-tag">Spring Boot</span>
            <span class="tech-tag">MySQL</span>
            <span class="tech-tag">Redis</span>
            <span class="tech-tag">JWT</span>
          </div>
        </div>
        
        <div class="contact-info">
          <h3>联系我们</h3>
          <p>如有问题或建议，请联系开发团队</p>
          <div class="qr-codes">
            <div class="qr-item">
              <img src="@/assets/ShouJiDuanQianDanRuKou.png" alt="手机端签到入口" class="qr-image">
              <p>手机端签到入口</p>
            </div>
            <div class="qr-item">
              <img src="@/assets/ErWeiMa.png" alt="公众号" class="qr-image">
              <p>扫码关注</p>
            </div>
          </div>
        </div>
        
        <div class="documentation-section">
          <h3>技术文档</h3>
          <p>查看开发者的技术文章和经验分享</p>
          <div class="documentation-layout">
            <div class="developer-profile-large">
              <div class="profile-avatar-large">
                <img src="https://p3-passport.byteacctimg.com/img/user-avatar/835c1120c7584cc5fc44606adacd40b0~200x200.awebp" alt="开发者头像" class="avatar-image-large">
              </div>
              <div class="profile-info-large">
                <h4>郑恩赐</h4>
                <p>计算机视觉与深度学习工程师 | AI算法工程师 | 全栈开发工程师</p>
              </div>
            </div>
            <div class="doc-links-right">
              <div class="doc-item-right">
                <div class="doc-icon">
                  <el-icon><Reading /></el-icon>
                </div>
                <div class="doc-content">
                  <h4>掘金技术专栏</h4>
                  <p>技术文章和专栏分享</p>
                  <a href="https://juejin.cn/user/2883382090934252" target="_blank" class="doc-link">
                    <el-icon><Link /></el-icon>
                    访问专栏
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-content">
        <p>&copy; 2024 人工智能创作坊学生管理系统. All rights reserved.</p>
        <p>群策群力，创新共行</p>
      </div>
    </div>

    <el-dialog
      v-model="updateLogVisible"
      title="系统更新日志"
      width="80%"
      :before-close="handleClose"
      class="update-log-dialog"
    >
      <div class="update-log-content">
        <div class="update-section">
          <h3 class="section-title">
            <el-icon><Trophy /></el-icon>
            积分看板功能
          </h3>
          <div class="update-items">
            <div class="update-item">
              <div class="update-icon primary">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <div class="update-content">
                <h4>增加了积分看板页面</h4>
                <p>新增积分看板页面，展示学生积分排行榜和优秀成员信息，支持签到积分、活动积分和总积分三种排行榜查看，提供数据可视化图表展示</p>
              </div>
            </div>
            <div class="update-item">
              <div class="update-icon secondary">
                <el-icon><Star /></el-icon>
              </div>
              <div class="update-content">
                <h4>增加积分功能</h4>
                <p>实现完整的积分系统，包括签到积分计算、活动积分记录、总积分统计等功能，支持积分排行榜展示和优秀成员展示</p>
              </div>
            </div>
          </div>
        </div>

        <div class="update-summary">
          <div class="summary-card">
            <h3>
              <el-icon><Trophy /></el-icon>
              更新总结
            </h3>
            <p>本次更新新增积分看板页面和积分功能，为学生提供更全面的数据展示和激励体系。积分看板支持签到积分、活动积分和总积分三种排行榜查看，展示优秀成员信息，提供数据可视化图表展示，让教育管理更加高效、便捷、智能。</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElIcon, ElDialog } from 'element-plus'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-dialog.css'
import { 
  User, Calendar, TrendCharts, Setting, ArrowRight, Document, Reading, Link,
  Star, Trophy
} from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore

const updateLogVisible = ref(false)

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}

const showUpdateLog = () => {
  updateLogVisible.value = true
}

const handleClose = () => {
  updateLogVisible.value = false
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: var(--text-primary);
  position: relative;
  overflow-x: hidden;
}

.theme-toggle-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
}

.theme-toggle-icon {
  width: 48px;
  height: 48px;
  cursor: pointer;
  border-radius: 50%;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 2px solid var(--glass-border);
  padding: 8px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px var(--shadow-color);
}

.theme-toggle-icon:hover {
  transform: scale(1.1) rotate(180deg);
  box-shadow: 0 12px 40px var(--shadow-hover);
  border-color: var(--primary-color);
}

.theme-toggle-icon:active {
  transform: scale(0.95);
}

.hero-section {
  padding: 40px 20px 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.hero-content {
  max-width: 1400px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  align-items: center;
}

.hero-left {
  text-align: center;
}

.hero-right {
  display: none;
}

.logo-section {
  margin-bottom: 40px;
}

.logo-container {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

.main-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.main-subtitle {
  font-size: 18px;
  margin: 0 0 15px 0;
  color: var(--text-secondary);
  font-weight: 500;
}

.tagline {
  font-size: 16px;
  margin: 0;
  color: var(--text-tertiary);
  font-style: italic;
}

.description-section {
  margin-bottom: 50px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: var(--text-primary);
}

.description {
  font-size: 16px;
  line-height: 1.7;
  margin: 0;
  color: var(--text-secondary);
}

.action-section {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 50px;
}

.action-button {
  background: var(--primary-gradient);
  border: none;
  padding: 16px 36px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 32px;
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
}

.action-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.action-button:hover::before {
  left: 100%;
}

.action-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(102, 126, 234, 0.4);
}

.secondary-button {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 2px solid var(--glass-border);
  color: var(--text-secondary);
  padding: 16px 36px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 32px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.secondary-button:hover {
  background: var(--bg-secondary);
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px var(--shadow-hover);
}

.update-log-button {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  border: none;
  color: white;
  padding: 16px 36px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 32px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
}

.update-log-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.update-log-button:hover::before {
  left: 100%;
}

.update-log-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(67, 233, 123, 0.4);
}

.features-showcase {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.feature-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px 28px;
  border: 1px solid var(--glass-border);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--primary-gradient);
  transform: scaleX(0);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 48px var(--shadow-hover);
  background: var(--glass-bg);
}

.feature-card.primary .feature-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.feature-card.secondary .feature-icon {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.feature-card.tertiary .feature-icon {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.feature-card.quaternary .feature-icon {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 24px;
  color: white;
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: var(--text-primary);
  text-align: center;
}

.feature-card p {
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  color: var(--text-secondary);
  text-align: center;
}

.info-section {
  background: var(--bg-secondary);
  padding: 50px 20px;
}

.info-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  align-items: start;
}

.tech-stack h3,
.contact-info h3,
.documentation-section h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: var(--text-primary);
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tech-tag {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.contact-info p {
  font-size: 14px;
  color: var(--text-tertiary);
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.qr-codes {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.qr-item {
  text-align: center;
}

.qr-image {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
}

.qr-item p {
  font-size: 12px;
  color: var(--text-tertiary);
  margin: 0;
}

.documentation-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  backdrop-filter: blur(20px);
  border-radius: 28px;
  padding: 40px 36px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.documentation-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.documentation-section:hover::before {
  opacity: 1;
}

.documentation-section:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 48px rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.documentation-section h3 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.documentation-section p {
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0 0 32px 0;
  line-height: 1.7;
  font-weight: 500;
}

.documentation-layout {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.developer-profile-large {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 36px 32px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  border-radius: 24px;
  border: 1px solid rgba(102, 126, 234, 0.15);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
}

.developer-profile-large::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.developer-profile-large:hover::after {
  opacity: 1;
}

.developer-profile-large:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 100%);
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 16px 40px rgba(102, 126, 234, 0.2);
}

.profile-avatar-large {
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.avatar-image-large {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 5px solid transparent;
  background: linear-gradient(135deg, #667eea, #764ba2) padding-box,
              linear-gradient(135deg, #667eea, #764ba2) border-box;
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.25),
              0 0 0 8px rgba(102, 126, 234, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  object-fit: cover;
  position: relative;
  z-index: 1;
}

.avatar-image-large:hover {
  transform: scale(1.08) rotate(2deg);
  box-shadow: 0 16px 48px rgba(102, 126, 234, 0.35),
              0 0 0 12px rgba(102, 126, 234, 0.15);
}

.profile-info-large {
  position: relative;
  z-index: 1;
}

.profile-info-large h4 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.3px;
}

.profile-info-large p {
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.8;
  font-weight: 500;
}

.doc-links-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.doc-item-right {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 28px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
  border-radius: 20px;
  border: 1px solid rgba(102, 126, 234, 0.15);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
}

.doc-item-right::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #667eea, #764ba2);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.doc-item-right:hover::before {
  transform: scaleY(1);
}

.doc-item-right:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateX(12px) translateY(-2px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.2);
}

.doc-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.doc-item-right:hover .doc-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.doc-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.doc-content h4 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: var(--text-primary);
  letter-spacing: -0.2px;
}

.doc-content p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.6;
  font-weight: 500;
}

.doc-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--primary-color);
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 8px;
  background: rgba(102, 126, 234, 0.08);
  position: relative;
  overflow: hidden;
}

.doc-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.doc-link:hover::before {
  left: 100%;
}

.doc-link:hover {
  color: white;
  background: linear-gradient(135deg, #667eea, #764ba2);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.doc-link .el-icon {
  transition: transform 0.3s ease;
}

.doc-link .el-icon {
  font-size: 16px;
}

.footer {
  background: #2c3e50;
  color: white;
  padding: 30px 20px;
  text-align: center;
}

.footer-content p {
  margin: 5px 0;
  opacity: 0.8;
}

.footer-content p:first-child {
  font-size: 12px;
}

.footer-content p:last-child {
  font-size: 14px;
  font-weight: 600;
}

@media (min-width: 768px) {
  .hero-section {
    padding: 60px 40px 80px;
  }
  
  .hero-content {
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }
  
  .hero-left {
    text-align: left;
  }
  
  .hero-right {
    display: block;
  }
  
  .theme-toggle-icon {
    width: 56px;
    height: 56px;
    top: 32px;
    right: 32px;
  }
  
  .logo-glow {
    width: 140px;
    height: 140px;
  }
  
  .main-title {
    font-size: 42px;
  }
  
  .main-subtitle {
    font-size: 22px;
  }
  
  .tagline {
    font-size: 18px;
  }
  
  .section-title {
    font-size: 32px;
  }
  
  .description {
    font-size: 18px;
  }
  
  .action-section {
    justify-content: flex-start;
    gap: 20px;
  }
  
  .action-button,
  .secondary-button {
    padding: 16px 36px;
    font-size: 18px;
  }
  
  .features-showcase {
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
  }
  
  .feature-card {
    padding: 35px 30px;
  }
  
  .feature-icon {
    width: 70px;
    height: 70px;
    font-size: 28px;
  }
  
  .feature-card h3 {
    font-size: 22px;
  }
  
  .feature-card p {
    font-size: 15px;
  }
  
  .info-content {
    grid-template-columns: 1fr 1fr;
    gap: 60px;
  }
  
  .documentation-section {
    grid-column: 1 / -1;
    margin-top: 20px;
  }
  
  .tech-stack h3,
  .contact-info h3,
  .documentation-section h3 {
    font-size: 24px;
  }
  
  .tech-tag {
    font-size: 14px;
    padding: 10px 18px;
  }
  
  .contact-info p,
  .documentation-section p {
    font-size: 16px;
  }
  
  .doc-links {
    flex-direction: row;
    gap: 25px;
  }
  
  .doc-item {
    flex-direction: column;
    text-align: center;
    padding: 25px 20px;
  }
  
  .doc-item:hover {
    transform: translateY(-4px);
  }
  
  .doc-icon {
    width: 60px;
    height: 60px;
    font-size: 24px;
    margin: 0 auto 16px;
  }
  
  .doc-content h4 {
    font-size: 18px;
  }
  
  .doc-content p {
    font-size: 14px;
  }
  
  .documentation-layout {
    gap: 25px;
  }
  
  .developer-profile-large {
    padding: 25px;
  }
  
  .avatar-image-large {
    width: 130px;
    height: 130px;
  }
  
  .profile-info-large h4 {
    font-size: 20px;
  }
  
  .profile-info-large p {
    font-size: 15px;
  }
  
  .doc-item-right {
    padding: 20px;
  }
  
  .doc-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
  
  .doc-content h4 {
    font-size: 16px;
  }
  
  .doc-content p {
    font-size: 13px;
  }
  
  .qr-image {
    width: 120px;
    height: 120px;
  }
  
  .qr-item p {
    font-size: 14px;
  }
  
  .footer {
    padding: 40px 20px;
  }
  
  .footer-content p:first-child {
    font-size: 14px;
  }
  
  .footer-content p:last-child {
    font-size: 16px;
  }
}

html.dark .documentation-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
  border-color: rgba(102, 126, 234, 0.3);
}

html.dark .documentation-section h3 {
  background: linear-gradient(135deg, #8b9eff, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

html.dark .documentation-section p {
  color: var(--text-secondary);
}

html.dark .developer-profile-large {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.8) 100%);
  border-color: rgba(102, 126, 234, 0.25);
}

html.dark .developer-profile-large:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  border-color: rgba(102, 126, 234, 0.4);
}

html.dark .avatar-image-large {
  border: 5px solid transparent;
  background: linear-gradient(135deg, #8b9eff, #a78bfa) padding-box,
              linear-gradient(135deg, #8b9eff, #a78bfa) border-box;
  box-shadow: 0 12px 32px rgba(139, 158, 255, 0.3),
              0 0 0 8px rgba(139, 158, 255, 0.15);
}

html.dark .avatar-image-large:hover {
  box-shadow: 0 16px 48px rgba(139, 158, 255, 0.4),
              0 0 0 12px rgba(139, 158, 255, 0.2);
}

html.dark .profile-info-large h4 {
  background: linear-gradient(135deg, #8b9eff, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

html.dark .profile-info-large p {
  color: var(--text-secondary);
}

html.dark .doc-item-right {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.8) 100%);
  border-color: rgba(102, 126, 234, 0.25);
}

html.dark .doc-item-right:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  border-color: rgba(102, 126, 234, 0.4);
}

html.dark .doc-item-right::before {
  background: linear-gradient(180deg, #8b9eff, #a78bfa);
}

html.dark .doc-icon {
  background: linear-gradient(135deg, #8b9eff 0%, #a78bfa 100%);
  box-shadow: 0 6px 20px rgba(139, 158, 255, 0.35);
}

html.dark .doc-item-right:hover .doc-icon {
  box-shadow: 0 8px 24px rgba(139, 158, 255, 0.45);
}

html.dark .doc-content h4 {
  color: var(--text-primary);
}

html.dark .doc-content p {
  color: var(--text-secondary);
}

html.dark .doc-link {
  color: #8b9eff;
  background: rgba(139, 158, 255, 0.12);
}

html.dark .doc-link:hover {
  color: white;
  background: linear-gradient(135deg, #8b9eff, #a78bfa);
  box-shadow: 0 4px 12px rgba(139, 158, 255, 0.35);
}

@media (min-width: 1024px) {
  .hero-content {
    gap: 80px;
  }
  
  .main-title {
    font-size: 48px;
  }
  
  .main-subtitle {
    font-size: 24px;
  }
  
  .section-title {
    font-size: 36px;
  }
  
  .description {
    font-size: 20px;
  }
  
  .features-showcase {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }
  
  .feature-card {
    padding: 40px 35px;
  }
  
  .action-section {
    gap: 25px;
  }
  
  .qr-codes {
    gap: 30px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 30px 15px 50px;
  }
  
  .theme-toggle-icon {
    width: 40px;
    height: 40px;
    top: 16px;
    right: 16px;
  }
  
  .logo-glow {
    width: 100px;
    height: 100px;
  }
  
  .main-title {
    font-size: 24px;
  }
  
  .main-subtitle {
    font-size: 16px;
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .description {
    font-size: 14px;
  }
  
  .action-section {
    flex-direction: column;
    align-items: center;
  }
  
  .action-button,
  .secondary-button,
  .update-log-button {
    width: 100%;
    max-width: 280px;
  }
}

.update-log-dialog {
  border-radius: 24px;
  overflow: hidden;
}

.update-log-dialog :deep(.el-dialog) {
  border-radius: 24px;
  background: var(--bg-primary);
  border: 1px solid var(--glass-border);
}

.update-log-dialog :deep(.el-dialog__header) {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--glass-border);
  padding: 24px 32px;
}

.update-log-dialog :deep(.el-dialog__title) {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.update-log-dialog :deep(.el-dialog__body) {
  padding: 0;
  background: var(--bg-primary);
}

.update-log-content {
  padding: 32px;
  max-height: 70vh;
  overflow-y: auto;
}

.update-section {
  margin-bottom: 40px;
}

.update-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 24px 0;
  color: var(--text-primary);
  padding-bottom: 12px;
  border-bottom: 2px solid var(--primary-color);
}

.section-title .el-icon {
  font-size: 24px;
  color: var(--primary-color);
}

.update-items {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.update-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid var(--glass-border);
  transition: all 0.3s ease;
}

.update-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px var(--shadow-hover);
  border-color: var(--primary-color);
}

.update-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  flex-shrink: 0;
}

.update-icon.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.update-icon.secondary {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.update-icon.tertiary {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.update-icon.quaternary {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}

.update-content {
  flex: 1;
}

.update-content h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.update-content p {
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  color: var(--text-secondary);
}

.update-summary {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 2px solid var(--glass-border);
}

.summary-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  border: 1px solid var(--glass-border);
  text-align: center;
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px var(--shadow-hover);
  border-color: var(--primary-color);
}

.summary-card h3 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: var(--text-primary);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.summary-card h3 .el-icon {
  font-size: 24px;
  color: var(--primary-color);
}

.summary-card p {
  font-size: 16px;
  line-height: 1.7;
  margin: 0;
  color: var(--text-secondary);
}

@media (min-width: 768px) {
  .update-items {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  
  .update-log-content {
    padding: 40px;
  }
  
  .section-title {
    font-size: 22px;
  }
  
  .update-content h4 {
    font-size: 20px;
  }
  
  .update-content p {
    font-size: 15px;
  }
  
  .summary-card h3 {
    font-size: 24px;
  }
  
  .summary-card p {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .update-log-dialog :deep(.el-dialog) {
    width: 95% !important;
    margin: 0 auto;
  }
  
  .update-log-content {
    padding: 20px;
  }
  
  .update-item {
    padding: 16px;
  }
  
  .update-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
  
  .update-content h4 {
    font-size: 16px;
  }
  
  .update-content p {
    font-size: 13px;
  }
  
  .summary-card {
    padding: 24px;
  }
  
  .summary-card h3 {
    font-size: 20px;
  }
  
  .summary-card p {
    font-size: 14px;
  }
}
</style>
