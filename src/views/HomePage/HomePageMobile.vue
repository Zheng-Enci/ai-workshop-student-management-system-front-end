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
            <h1 class="main-title">厦门工学院人工智能创作坊</h1>
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
            <el-button size="large" @click="showContactForm" class="contact-form-button">
              <el-icon><User /></el-icon>
              联系我们
            </el-button>
            <el-button size="large" @click="showEnvironmentPolicy" class="environment-policy-button">
              <el-icon><OfficeBuilding /></el-icon>
              环境保障机制
            </el-button>
          </div>
        </div>

        <div class="hero-right">
          <div class="features-showcase">
            <div class="feature-card primary" @click="goToDashboard">
              <div class="feature-icon">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <h3>数据看板</h3>
              <p>实时展示积分排行、考勤统计、成员数据</p>
            </div>
            
            <div class="feature-card secondary" @click="goToAttendanceAnalysis">
              <div class="feature-icon">
                <el-icon><Calendar /></el-icon>
              </div>
              <h3>签到分析</h3>
              <p>可视化展示签到趋势、出勤率统计</p>
            </div>
            
            <div class="feature-card tertiary" @click="goToPointsDashboard">
              <div class="feature-icon">
                <el-icon><Star /></el-icon>
              </div>
              <h3>积分看板</h3>
              <p>展示成员积分排行和优秀成员信息</p>
            </div>
            
            <div class="feature-card quaternary" @click="goToAllMembers">
              <div class="feature-icon">
                <el-icon><User /></el-icon>
              </div>
              <h3>全部成员</h3>
              <p>查看所有成员信息和积分排名</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="info-section">
      <div class="info-content">

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
          <h3>本项目作者</h3>
          <p>查看作者的技术文章和经验分享</p>
          <div class="documentation-layout">
            <div class="developer-profile-large">
              <div class="profile-avatar-large">
                <img :src="developerAvatar" alt="开发者头像" class="avatar-image-large" @error="handleAvatarError">
              </div>
              <div class="profile-info-large">
                <h4>郑恩赐</h4>
                <p>AI全栈应用开发工程师</p>
                <p>联系邮箱: <a href="mailto:zheng_enci@qq.com" class="author-email">zheng_enci@qq.com</a></p>
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
              <div class="doc-item-right">
                <div class="doc-icon">
                  <el-icon><DocumentCopy /></el-icon>
                </div>
                <div class="doc-content">
                  <h4>Gitee 仓库</h4>
                  <p>项目代码和开源作品</p>
                  <a href="https://gitee.com/zheng-enci050704" target="_blank" class="doc-link">
                    <el-icon><Link /></el-icon>
                    访问仓库
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
        <p>&copy; 2024 厦门工学院人工智能创作坊学生管理系统. All rights reserved.</p>
        <p>群策群力，创新共行</p>
      </div>
    </div>

    <el-dialog
      v-model="updateLogVisible"
      title="系统更新日志"
      width="95%"
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

    <el-dialog
      v-model="contactFormVisible"
      title="联系我们"
      width="500px"
      :close-on-click-modal="true"
      :destroy-on-close="true"
      :append-to-body="true"
      :teleported="true"
      class="contact-dialog"
    >
      <div class="contact-form">
        <div class="contact-info-item">
          <h4>开发团队</h4>
          <p>厦门工学院人工智能创作坊</p>
        </div>
        <div class="contact-info-item">
          <h4>联系人</h4>
          <p>郑恩赐</p>
        </div>
        <div class="contact-info-item">
          <h4>邮箱</h4>
          <p><a href="mailto:zheng_enci@qq.com">zheng_enci@qq.com</a></p>
        </div>
        <div class="contact-info-item">
          <h4>GitHub</h4>
          <p><a href="https://gitee.com/zheng-enci050704" target="_blank">访问我的Gitee仓库</a></p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import './HomePageMobile.css'
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
import { onMounted } from 'vue'
import { getAvatarUrl } from '@/api/student'

const router = useRouter()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore

const updateLogVisible = ref(false)
const contactFormVisible = ref(false)
const developerAvatar = ref('')

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}

const goToDashboard = () => {
  router.push('/dashboard')
}

const goToAttendanceAnalysis = () => {
  router.push('/attendance-analysis')
}

const goToPointsDashboard = () => {
  router.push('/points-dashboard')
}

const goToAllMembers = () => {
  router.push('/all-members')
}

const loadDeveloperAvatar = () => {
  // 使用项目统一的getAvatarUrl函数获取id为1的头像
  const avatarUrl = getAvatarUrl(1)
  if (avatarUrl) {
    developerAvatar.value = avatarUrl
  } else {
    // 如果获取失败，使用默认头像
    developerAvatar.value = 'https://p3-passport.byteacctimg.com/img/user-avatar/835c1120c7584cc5fc44606adacd40b0~200x200.awebp'
  }
}

const handleAvatarError = () => {
  // 图片加载失败时使用默认头像
  developerAvatar.value = 'https://p3-passport.byteacctimg.com/img/user-avatar/835c1120c7584cc5fc44606adacd40b0~200x200.awebp'
}

onMounted(() => {
  loadDeveloperAvatar()
})

const showUpdateLog = () => {
  updateLogVisible.value = true
}

const showContactForm = () => {
  contactFormVisible.value = true
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
  top: 16px;
  right: 16px;
  z-index: 1000;
}

.theme-toggle-icon {
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: 0;
  background: transparent;
  backdrop-filter: blur(20px);
  border: none;
  padding: 6px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: none;
}

.theme-toggle-icon:hover {
  transform: scale(1.15);
}

.theme-toggle-icon:active {
  transform: scale(1.1);
}

.hero-section {
  padding: 30px 15px 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.hero-content {
  max-width: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  align-items: center;
}

.hero-left {
  text-align: center;
}

.hero-right {
  display: none;
}

.logo-section {
  margin-bottom: 30px;
}

.logo-container {
  position: relative;
  display: inline-block;
  margin-bottom: 15px;
}

.logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

.main-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.main-subtitle {
  font-size: 16px;
  margin: 0 0 12px 0;
  color: var(--text-secondary);
  font-weight: 500;
}

.tagline {
  font-size: 14px;
  margin: 0;
  color: var(--text-tertiary);
  font-style: italic;
}

.description-section {
  margin-bottom: 40px;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: var(--text-primary);
}

.description {
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  color: var(--text-secondary);
}

.action-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
}

.action-button,
.secondary-button,
.update-log-button,
.contact-form-button {
  width: 100%;
  max-width: 280px;
  background: var(--primary-gradient);
  border: none;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 30px;
  box-shadow: 0 10px 28px rgba(102, 126, 234, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.action-button::before,
.secondary-button::before,
.update-log-button::before,
.contact-form-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.action-button:hover::before,
.secondary-button:hover::before,
.update-log-button:hover::before,
.contact-form-button:hover::before {
  left: 100%;
}

.action-button:hover,
.secondary-button:hover,
.update-log-button:hover,
.contact-form-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 36px rgba(102, 126, 234, 0.4);
}

.secondary-button {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 2px solid var(--glass-border);
  color: var(--text-secondary);
}

.secondary-button:hover {
  background: var(--bg-secondary);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.update-log-button {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  color: white;
}

.update-log-button:hover {
  box-shadow: 0 14px 36px rgba(67, 233, 123, 0.4);
}

.contact-form-button {
  background: linear-gradient(135deg, #ff6b6b, #ff8787);
  color: white;
}

.contact-form-button:hover {
  box-shadow: 0 14px 36px rgba(255, 107, 107, 0.4);
}

.features-showcase {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.feature-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px 20px;
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
  height: 2px;
  background: var(--primary-gradient);
  transform: scaleX(0);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px var(--shadow-hover);
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
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 20px;
  color: white;
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: var(--text-primary);
  text-align: center;
}

.feature-card p {
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
  color: var(--text-secondary);
  text-align: center;
}

.info-section {
  background: var(--bg-secondary);
  padding: 40px 15px;
}

.info-content {
  max-width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  align-items: start;
}

.contact-info h3,
.documentation-section h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: var(--text-primary);
}

.contact-info p {
  font-size: 13px;
  color: var(--text-tertiary);
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.qr-codes {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.qr-item {
  text-align: center;
}

.qr-image {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 6px;
}

.qr-item p {
  font-size: 11px;
  color: var(--text-tertiary);
  margin: 0;
}

.documentation-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 30px 24px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.08);
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
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.documentation-section:hover::before {
  opacity: 1;
}

.documentation-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 40px rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.documentation-section h3 {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.4px;
}

.documentation-section p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 24px 0;
  line-height: 1.6;
  font-weight: 500;
}

.documentation-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}

.developer-profile-large {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 28px 24px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  border-radius: 20px;
  border: 1px solid rgba(102, 126, 234, 0.15);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 3px 16px rgba(0, 0, 0, 0.06);
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
  transform: translateY(-5px) scale(1.01);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.2);
}

.profile-avatar-large {
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.avatar-image-large {
  width: 120px;
  height: 120px;
  border-radius: 25%;
  border: 4px solid transparent;
  background: linear-gradient(135deg, #667eea, #764ba2) padding-box,
              linear-gradient(135deg, #667eea, #764ba2) border-box;
  box-shadow: 0 10px 28px rgba(102, 126, 234, 0.25),
              0 0 0 6px rgba(102, 126, 234, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  object-fit: cover;
  position: relative;
  z-index: 1;
}

.avatar-image-large:hover {
  transform: scale(1.06) rotate(2deg);
  box-shadow: 0 12px 36px rgba(102, 126, 234, 0.35),
              0 0 0 8px rgba(102, 126, 234, 0.15);
}

.profile-info-large {
  position: relative;
  z-index: 1;
}

.profile-info-large h4 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.2px;
}

.profile-info-large p {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
  font-weight: 500;
}

.author-email {
  color: var(--text-primary);
  text-decoration: underline;
  opacity: 0.85;
  transition: opacity 0.3s ease;
}

.author-email:hover {
  opacity: 1;
  text-decoration: none;
}

.doc-links-right {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.doc-item-right {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 22px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
  border-radius: 18px;
  border: 1px solid rgba(102, 126, 234, 0.15);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
}

.doc-item-right::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
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
  transform: translateX(10px) translateY(-1px);
  box-shadow: 0 10px 28px rgba(102, 126, 234, 0.2);
}

.doc-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 5px 18px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.doc-item-right:hover .doc-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.doc-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.doc-content h4 {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: var(--text-primary);
  letter-spacing: -0.1px;
}

.doc-content p {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0 0 14px 0;
  line-height: 1.5;
  font-weight: 500;
}

.doc-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  padding: 6px 14px;
  border-radius: 6px;
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
  transform: translateX(3px);
  box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
}

.doc-link .el-icon {
  transition: transform 0.3s ease;
  font-size: 14px;
}

.footer {
  background: #2c3e50;
  color: white;
  padding: 24px 15px;
  text-align: center;
}

.footer-content p {
  margin: 4px 0;
  opacity: 0.8;
}

.footer-content p:first-child {
  font-size: 11px;
}

.footer-content p:last-child {
  font-size: 13px;
  font-weight: 600;
}

.update-log-dialog {
  border-radius: 20px;
  overflow: hidden;
}

.update-log-dialog :deep(.el-dialog) {
  border-radius: 20px;
  background: var(--bg-primary);
  border: 1px solid var(--glass-border);
  width: 95% !important;
  margin: 0 auto;
}

.update-log-dialog :deep(.el-dialog__header) {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--glass-border);
  padding: 20px 24px;
}

.update-log-dialog :deep(.el-dialog__title) {
  font-size: 20px;
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
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.update-section {
  margin-bottom: 32px;
}

.update-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: var(--text-primary);
  padding-bottom: 10px;
  border-bottom: 2px solid var(--primary-color);
}

.section-title .el-icon {
  font-size: 20px;
  color: var(--primary-color);
}

.update-items {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.update-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 20px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 14px;
  border: 1px solid var(--glass-border);
  transition: all 0.3s ease;
}

.update-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px var(--shadow-hover);
  border-color: var(--primary-color);
}

.update-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
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
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: var(--text-primary);
}

.update-content p {
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
  color: var(--text-secondary);
}

.update-summary {
  margin-top: 32px;
  padding-top: 28px;
  border-top: 2px solid var(--glass-border);
}

.summary-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 18px;
  padding: 24px;
  border: 1px solid var(--glass-border);
  text-align: center;
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 28px var(--shadow-hover);
  border-color: var(--primary-color);
}

.summary-card h3 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: var(--text-primary);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.summary-card h3 .el-icon {
  font-size: 20px;
  color: var(--primary-color);
}

.summary-card p {
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  color: var(--text-secondary);
}

.contact-dialog {
  border-radius: 20px;
  overflow: hidden;
}

.contact-dialog :deep(.el-dialog) {
  border-radius: 20px;
  background: var(--bg-primary);
  border: 1px solid var(--glass-border);
}

.contact-dialog :deep(.el-dialog__header) {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--glass-border);
  padding: 20px 24px;
}

.contact-dialog :deep(.el-dialog__title) {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contact-dialog :deep(.el-dialog__body) {
  padding: 0;
  background: var(--bg-primary);
}

.contact-form {
  padding: 20px;
}

.contact-info-item {
  margin-bottom: 20px;
  padding: 16px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  border: 1px solid var(--glass-border);
  transition: all 0.3s ease;
}

.contact-info-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px var(--shadow-hover);
  border-color: var(--primary-color);
}

.contact-info-item:last-child {
  margin-bottom: 0;
}

.contact-info-item h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text-primary);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contact-info-item p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.contact-info-item a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-info-item a:hover {
  color: var(--text-primary);
  text-decoration: underline;
}

@media (min-width: 768px) {
  .hero-section {
    padding: 40px 20px 60px;
  }
  
  .hero-content {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;
  }
  
  .hero-left {
    text-align: left;
  }
  
  .hero-right {
    display: block;
  }
  
  .theme-toggle-icon {
    width: 48px;
    height: 48px;
    top: 24px;
    right: 24px;
  }
  
  .logo-glow {
    width: 120px;
    height: 120px;
  }
  
  .main-title {
    font-size: 32px;
  }
  
  .main-subtitle {
    font-size: 18px;
  }
  
  .tagline {
    font-size: 16px;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .description {
    font-size: 16px;
  }
  
  .action-section {
    flex-direction: row;
    gap: 15px;
    justify-content: flex-start;
  }
  
  .action-button,
  .secondary-button,
  .update-log-button,
  .contact-form-button {
    width: auto;
    max-width: none;
    padding: 16px 36px;
    font-size: 18px;
  }
  
  .features-showcase {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .feature-card {
    padding: 32px 28px;
  }
  
  .feature-icon {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }
  
  .feature-card h3 {
    font-size: 20px;
  }
  
  .feature-card p {
    font-size: 14px;
  }
  
  .info-content {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  
  .documentation-section {
    grid-column: 1 / -1;
    margin-top: 20px;
  }
  
  .contact-info h3,
  .documentation-section h3 {
    font-size: 20px;
  }
  
  .contact-info p,
  .documentation-section p {
    font-size: 15px;
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
    width: 100px;
    height: 100px;
  }
  
  .qr-item p {
    font-size: 12px;
  }
  
  .footer {
    padding: 30px 20px;
  }
  
  .footer-content p:first-child {
    font-size: 12px;
  }
  
  .footer-content p:last-child {
    font-size: 14px;
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
  border: 4px solid transparent;
  background: linear-gradient(135deg, #8b9eff, #a78bfa) padding-box,
              linear-gradient(135deg, #8b9eff, #a78bfa) border-box;
  box-shadow: 0 10px 28px rgba(139, 158, 255, 0.3),
              0 0 0 6px rgba(139, 158, 255, 0.15);
}

html.dark .avatar-image-large:hover {
  box-shadow: 0 12px 36px rgba(139, 158, 255, 0.4),
              0 0 0 8px rgba(139, 158, 255, 0.2);
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
  box-shadow: 0 5px 18px rgba(139, 158, 255, 0.35);
}

html.dark .doc-item-right:hover .doc-icon {
  box-shadow: 0 6px 20px rgba(139, 158, 255, 0.45);
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
  box-shadow: 0 3px 10px rgba(139, 158, 255, 0.35);
}

@media (min-width: 1024px) {
  .hero-content {
    gap: 60px;
  }
  
  .main-title {
    font-size: 42px;
  }
  
  .main-subtitle {
    font-size: 22px;
  }
  
  .section-title {
    font-size: 32px;
  }
  
  .description {
    font-size: 18px;
  }
  
  .features-showcase {
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
  }
  
  .feature-card {
    padding: 35px 30px;
  }
  
  .action-section {
    gap: 20px;
  }
  
  .qr-codes {
    gap: 25px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 25px 12px 40px;
  }
  
  .theme-toggle-icon {
    width: 36px;
    height: 36px;
    top: 12px;
    right: 12px;
  }
  
  .logo-glow {
    width: 90px;
    height: 90px;
  }
  
  .main-title {
    font-size: 22px;
  }
  
  .main-subtitle {
    font-size: 15px;
  }
  
  .section-title {
    font-size: 18px;
  }
  
  .description {
    font-size: 13px;
  }
  
  .action-section {
    flex-direction: column;
    align-items: center;
  }
  
  .action-button,
  .secondary-button,
  .update-log-button,
  .contact-form-button {
    width: 100%;
    max-width: 260px;
    padding: 12px 28px;
    font-size: 15px;
  }
}
</style>